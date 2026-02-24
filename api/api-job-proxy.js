// /api/job-proxy.js — Lightweight CORS proxy for keyed job APIs
// Deploy to Vercel alongside existing /api/jobs.js
// Routes: ?source=adzuna&q=...&location=... | ?source=muse&... | ?source=jooble&...

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { source, q, location, category, page } = req.query;

    try {
        let data;

        switch (source) {
            case 'adzuna': {
                const appId = req.query.app_id || process.env.ADZUNA_APP_ID;
                const appKey = req.query.app_key || process.env.ADZUNA_APP_KEY;
                if (!appId || !appKey) return res.status(400).json({ error: 'Adzuna credentials missing' });

                let url = `https://api.adzuna.com/v1/api/jobs/us/search/${page || 1}?app_id=${appId}&app_key=${appKey}&results_per_page=50&content-type=application/json&sort_by=date&max_days_old=30`;
                if (q) url += `&what=${encodeURIComponent(q)}`;
                if (location) url += `&where=${encodeURIComponent(location)}`;

                const adzRes = await fetch(url);
                if (!adzRes.ok) throw new Error(`Adzuna ${adzRes.status}: ${await adzRes.text()}`);
                data = await adzRes.json();
                break;
            }

            case 'muse': {
                const apiKey = req.query.api_key || process.env.MUSE_API_KEY || '';
                let url = `https://www.themuse.com/api/public/jobs?page=${page || 0}`;
                if (category) url += `&category=${encodeURIComponent(category)}`;
                if (location) url += `&location=${encodeURIComponent(location)}`;
                if (apiKey) url += `&api_key=${apiKey}`;

                const museRes = await fetch(url);
                if (!museRes.ok) throw new Error(`Muse ${museRes.status}: ${await museRes.text()}`);
                data = await museRes.json();
                break;
            }

            case 'jooble': {
                const joobleKey = req.query.api_key || process.env.JOOBLE_API_KEY;
                if (!joobleKey) return res.status(400).json({ error: 'Jooble API key missing' });

                const joobleRes = await fetch(`https://jooble.org/api/${joobleKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        keywords: q || '',
                        location: location || 'United States',
                        page: page || '1'
                    })
                });
                if (!joobleRes.ok) throw new Error(`Jooble ${joobleRes.status}: ${await joobleRes.text()}`);
                data = await joobleRes.json();
                break;
            }

            default:
                return res.status(400).json({ error: 'Unknown source. Use: adzuna, muse, jooble' });
        }

        return res.status(200).json(data);

    } catch (e) {
        console.error(`job-proxy [${source}]:`, e.message);
        return res.status(502).json({ error: e.message, source });
    }
}
