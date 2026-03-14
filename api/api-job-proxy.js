// Blueprint™ Job Proxy — Vercel Serverless Function
// Proxies job API requests to bypass CORS restrictions.
// Allowlisted domains only. No API keys stored server-side — passed from client.
// v1.0.0 | 2026-02-24

const ALLOWED_ORIGINS = [
    'https://www.myblueprint.work',
    'https://myblueprint.work',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
];

const SOURCE_CONFIG = {
    remotive: {
        base: 'https://remotive.com/api/remote-jobs',
        method: 'GET',
        buildUrl: (params) => {
            let url = 'https://remotive.com/api/remote-jobs?limit=50';
            if (params.category) url += '&category=' + encodeURIComponent(params.category);
            if (params.q) url += '&search=' + encodeURIComponent(params.q);
            return url;
        }
    },
    himalayas: {
        base: 'https://himalayas.app/jobs/api',
        method: 'GET',
        buildUrl: (params) => {
            return 'https://himalayas.app/jobs/api?limit=50';
        }
    },
    jobicy: {
        base: 'https://jobicy.com/api/v2/remote-jobs',
        method: 'GET',
        buildUrl: (params) => {
            let url = 'https://jobicy.com/api/v2/remote-jobs?count=50&geo=usa';
            if (params.q) url += '&tag=' + encodeURIComponent(params.q);
            if (params.industry) url += '&industry=' + encodeURIComponent(params.industry);
            return url;
        }
    },
    adzuna: {
        base: 'https://api.adzuna.com',
        method: 'GET',
        buildUrl: (params) => {
            const page = params.page || '1';
            let url = `https://api.adzuna.com/v1/api/jobs/us/search/${page}`
                + `?app_id=${encodeURIComponent(params.app_id || '')}`
                + `&app_key=${encodeURIComponent(params.app_key || '')}`
                + '&results_per_page=50&content-type=application/json&sort_by=date&max_days_old=30';
            if (params.q) url += '&what=' + encodeURIComponent(params.q);
            if (params.location) url += '&where=' + encodeURIComponent(params.location);
            return url;
        }
    },
    muse: {
        base: 'https://www.themuse.com/api/public/jobs',
        method: 'GET',
        buildUrl: (params) => {
            let url = 'https://www.themuse.com/api/public/jobs?page=0';
            if (params.category) url += '&category=' + encodeURIComponent(params.category);
            if (params.location) url += '&location=' + encodeURIComponent(params.location);
            if (params.api_key) url += '&api_key=' + encodeURIComponent(params.api_key);
            return url;
        }
    },
    jsearch: {
        base: 'https://jsearch.p.rapidapi.com/search',
        method: 'GET',
        buildUrl: (params) => {
            let url = 'https://jsearch.p.rapidapi.com/search?num_pages=5';
            if (params.q) url += '&query=' + encodeURIComponent(params.q);
            if (params.remote_jobs_only) url += '&remote_jobs_only=true';
            if (params.date_posted) url += '&date_posted=' + encodeURIComponent(params.date_posted);
            if (params.page) url += '&page=' + encodeURIComponent(params.page);
            return url;
        },
        headers: (params) => ({
            'X-RapidAPI-Key': params.rapid_key || '',
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        })
    },
    usajobs: {
        base: 'https://data.usajobs.gov/api/search',
        method: 'GET',
        buildUrl: (params) => {
            let url = 'https://data.usajobs.gov/api/search?ResultsPerPage=50';
            if (params.q) url += '&Keyword=' + encodeURIComponent(params.q);
            if (params.location) url += '&LocationName=' + encodeURIComponent(params.location);
            return url;
        },
        headers: (params) => ({
            'Authorization-Key': params.api_key || '',
            'User-Agent': params.email || 'blueprint@myblueprint.work'
        })
    }
};

function getCorsHeaders(origin) {
    const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowed,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Cache-Control': 'public, max-age=300, s-maxage=300'
    };
}

export default async function handler(req, res) {
    const origin = req.headers.origin || '';
    const corsHeaders = getCorsHeaders(origin);

    // CORS preflight
    if (req.method === 'OPTIONS') {
        Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
        return res.status(204).end();
    }

    // Set CORS headers for all responses
    Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

    const params = req.query || {};
    const source = (params.source || '').toLowerCase();

    if (source === 'page') {
        const pageUrl = params.url || '';
        if (!pageUrl || !pageUrl.match(/^https?:\/\//)) {
            return res.status(400).json({ error: 'Missing or invalid url parameter' });
        }

        let parsedHost;
        try { parsedHost = new URL(pageUrl).hostname.toLowerCase(); } catch(e) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const ATS_DOMAINS = [
            'ats.rippling.com', 'boards.greenhouse.io', 'jobs.greenhouse.io', 'job-boards.greenhouse.io',
            'jobs.lever.co', 'jobs.ashbyhq.com', 'apply.workable.com',
            'myworkdayjobs.com', 'wd1.myworkdaysite.com', 'wd3.myworkdaysite.com', 'wd5.myworkdaysite.com',
            'careers.icims.com', 'jobs.smartrecruiters.com',
            'linkedin.com', 'www.linkedin.com',
            'indeed.com', 'www.indeed.com',
            'glassdoor.com', 'www.glassdoor.com',
            'ziprecruiter.com', 'www.ziprecruiter.com',
            'angel.co', 'wellfound.com',
            'builtin.com', 'www.builtin.com',
            'dice.com', 'www.dice.com',
            'monster.com', 'www.monster.com',
            'simplyhired.com', 'www.simplyhired.com',
            'usajobs.gov', 'www.usajobs.gov',
            'careers.google.com', 'jobs.apple.com', 'amazon.jobs', 'www.amazon.jobs',
            'careers.microsoft.com', 'jobs.netflix.com',
            'phenom.com', 'jobs.jobvite.com',
        ];
        const isAllowed = ATS_DOMAINS.some(d => parsedHost === d || parsedHost.endsWith('.' + d))
            || /\.(myworkdayjobs|myworkdaysite)\.com$/.test(parsedHost)
            || /^[a-z0-9-]+\.greenhouse\.io$/.test(parsedHost)
            || /^[a-z0-9-]+\.lever\.co$/.test(parsedHost)
            || /^[a-z0-9-]+\.ashbyhq\.com$/.test(parsedHost)
            || /^[a-z0-9-]+\.icims\.com$/.test(parsedHost)
            || /^[a-z0-9-]+\.smartrecruiters\.com$/.test(parsedHost)
            || /^[a-z0-9-]+\.jobvite\.com$/.test(parsedHost)
            || /^[a-z0-9-]+\.phenom\.com$/.test(parsedHost)
            || /^[a-z0-9-]+\.rippling\.com$/.test(parsedHost)
            || /^[a-z0-9-]+\.(careers|jobs|talent|recruiting)\.[a-z]{2,6}$/.test(parsedHost);

        if (!isAllowed) {
            return res.status(403).json({ error: 'Domain not allowed for page fetching: ' + parsedHost });
        }

        if (/^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|0\.)/.test(parsedHost) || parsedHost === '[::1]') {
            return res.status(403).json({ error: 'Internal addresses not allowed' });
        }

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20000);
            const pageRes = await fetch(pageUrl, {
                signal: controller.signal,
                redirect: 'manual',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'identity',
                    'Cache-Control': 'no-cache',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none'
                }
            });
            clearTimeout(timeout);
            if (pageRes.status >= 300 && pageRes.status < 400) {
                return res.status(pageRes.status).json({ error: 'Page redirected', location: pageRes.headers.get('location') || '' });
            }
            if (!pageRes.ok) {
                return res.status(pageRes.status).json({ error: 'Page returned ' + pageRes.status });
            }
            const html = await pageRes.text();
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            return res.status(200).send(html.substring(0, 800000));
        } catch (err) {
            const status = err.name === 'AbortError' ? 504 : 502;
            return res.status(status).json({ error: 'Page fetch error', message: err.message });
        }
    }

    if (!source || !SOURCE_CONFIG[source]) {
        return res.status(400).json({
            error: 'Invalid source',
            valid: Object.keys(SOURCE_CONFIG).concat(['page']),
            usage: '/api/api-job-proxy?source=remotive&q=engineer'
        });
    }

    const config = SOURCE_CONFIG[source];

    try {
        const targetUrl = config.buildUrl(params);
        const fetchOptions = {
            method: config.method || 'GET',
            headers: {
                'Accept': 'application/json',
                ...(config.headers ? config.headers(params) : {})
            }
        };

        if (config.method === 'POST' && config.buildBody) {
            fetchOptions.headers['Content-Type'] = 'application/json';
            fetchOptions.body = config.buildBody(params);
        }

        // Timeout: 10s
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        fetchOptions.signal = controller.signal;

        const response = await fetch(targetUrl, fetchOptions);
        clearTimeout(timeout);

        if (!response.ok) {
            return res.status(response.status).json({
                error: `${source} returned ${response.status}`,
                upstream: response.statusText
            });
        }

        const data = await response.json();

        // Set shorter cache for expensive APIs
        if (source === 'jsearch') {
            res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600');
        }

        return res.status(200).json(data);

    } catch (err) {
        const status = err.name === 'AbortError' ? 504 : 502;
        return res.status(status).json({
            error: `${source} proxy error`,
            message: err.message
        });
    }
};
