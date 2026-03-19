// api/galileo-refresh.js  v4.0
// Full crawl — incremental counters, no large doc storage, paragraph-only counting.
//
// MODES:
//   ?mode=harvest  → scrape sitemaps + RSS, dedup, write queue + reset progress
//   ?mode=process  → fetch + count next 15 articles, update incremental counters
//   ?mode=stats    → build final stats doc from progress counters
//   ?mode=status   → check progress
//   ?mode=reset    → wipe progress doc (use if counts look wrong)
//
// REQUIRED ENV VAR: FIREBASE_API_KEY

import { fsGet, fsSet } from './lib/firestore-rest.js';

const COL = 'galileo_counter';
const LAUNCH_DATE = new Date('2023-11-15');
const BATCH_SIZE = 15;

// ── UTILITIES ─────────────────────────────────────────────────────────────────

function slugFromUrl(url) {
  return (url || '').replace(/https?:\/\/[^/]+/, '').replace(/[/?#].*$/, '').split('/').filter(Boolean).pop() || '';
}

function titleFingerprint(title) {
  return (title || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim().slice(0, 45);
}

function countGalileoInParagraphs(html) {
  // Strip ALL anchor tag content first.
  // Every CTA on joshbersin.com ("Get Galileo", "Galileo Learn", nav items,
  // "exclusively through Galileo" banner, footer links) is a hyperlink.
  // Genuine prose mentions in article body are plain text, not links.
  // Stripping <a>...</a> content eliminates all of them in one pass.
  let body = html.replace(/<a[^>]*>[\s\S]*?<\/a>/gi, ' ');

  // Isolate <article> tag if present (WordPress standard)
  const am = body.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (am) body = am[1];

  // Count in <p> tags with 60+ chars — real paragraphs, not captions
  let count = 0;
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(body)) !== null) {
    const t = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (t.length < 60) continue;
    if (t.toLowerCase().includes('exclusively through')) continue;
    count += (t.match(/\bgalileo\b/gi) || []).length;
  }
  return count;
}

function stripForTitle(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

async function fetchText(url, ms = 8000) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GalileoCounter/4.0)' },
    signal: AbortSignal.timeout(ms),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ── HARVEST SOURCES ───────────────────────────────────────────────────────────

async function harvestJoshBersin() {
  const urls = [];
  let rootXml;
  try { rootXml = await fetchText('https://joshbersin.com/sitemap.xml'); }
  catch (e) { console.warn('[harvest:jb]', e.message); return urls; }

  const isIndex = rootXml.includes('<sitemapindex');
  const sitemaps = isIndex
    ? (rootXml.match(/<loc>([^<]+)<\/loc>/gi) || [])
        .map(m => m.replace(/<\/?loc>/gi, '').trim())
        .filter(u => !u.includes('image') && !u.includes('media'))
    : ['https://joshbersin.com/sitemap.xml'];

  for (const sitemapUrl of sitemaps) {
    let xml;
    try { xml = sitemapUrl === 'https://joshbersin.com/sitemap.xml' ? rootXml : await fetchText(sitemapUrl); }
    catch (e) { continue; }
    for (const block of (xml.match(/<url>[\s\S]*?<\/url>/gi) || [])) {
      const locMatch = block.match(/<loc>(https?:\/\/joshbersin\.com\/\d{4}\/[^<]+)<\/loc>/i);
      if (!locMatch) continue;
      const dateMatch = block.match(/<(?:lastmod|pubDate)>([^<]+)<\/(?:lastmod|pubDate)>/i);
      const pubDate = dateMatch ? new Date(dateMatch[1]) : null;
      if (pubDate && pubDate < LAUNCH_DATE) continue;
      urls.push({ url: locMatch[1].trim().replace(/\/$/, ''), source: 'joshbersin.com', pubDate: pubDate ? pubDate.toISOString().slice(0, 10) : null, title: null });
    }
  }
  console.log(`[harvest:jb] ${urls.length}`);
  return urls;
}

async function harvestSubstack() {
  const urls = [];
  let rss;
  try { rss = await fetchText('https://joshbersin.substack.com/feed'); }
  catch (e) { console.warn('[harvest:substack]', e.message); return urls; }
  for (const item of (rss.match(/<item>[\s\S]*?<\/item>/gi) || [])) {
    const linkMatch = item.match(/<link>([^<]+)<\/link>/i) || item.match(/<guid[^>]*>([^<]+)<\/guid>/i);
    if (!linkMatch) continue;
    const url = linkMatch[1].trim();
    if (!url.startsWith('http')) continue;
    const pubDateMatch = item.match(/<pubDate>([^<]+)<\/pubDate>/i);
    const pubDate = pubDateMatch ? new Date(pubDateMatch[1]) : null;
    if (pubDate && pubDate < LAUNCH_DATE) continue;
    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?\s*([^\]<]{2,200}?)(?:\s*\]\]>)?<\/title>/i);
    urls.push({ url: url.replace(/[?#].*$/, ''), source: 'substack', pubDate: pubDate ? pubDate.toISOString().slice(0, 10) : null, title: titleMatch ? titleMatch[1].trim() : null });
  }
  console.log(`[harvest:substack] ${urls.length}`);
  return urls;
}

async function harvestGalileoTag() {
  const urls = [];
  for (let page = 1; page <= 8; page++) {
    const pageUrl = page === 1 ? 'https://joshbersin.com/tag/galileo/' : `https://joshbersin.com/tag/galileo/page/${page}/`;
    let html;
    try { html = await fetchText(pageUrl); } catch (e) { break; }
    const matches = html.match(/href="(https?:\/\/joshbersin\.com\/\d{4}\/[^"]+)"/gi) || [];
    if (matches.length === 0) break;
    for (const m of matches) {
      const url = m.replace(/href="|"/gi, '').replace(/\/$/, '');
      if (url.match(/\/\d{4}\/\d{2}\//)) urls.push({ url, source: 'joshbersin.com', pubDate: null, title: null });
    }
  }
  const seen = new Set();
  const unique = urls.filter(u => { if (seen.has(u.url)) return false; seen.add(u.url); return true; });
  console.log(`[harvest:galileo-tag] ${unique.length}`);
  return unique;
}

async function harvestPodcastArchive() {
  const urls = [];
  for (let page = 1; page <= 10; page++) {
    const pageUrl = page === 1 ? 'https://joshbersin.com/podcast/' : `https://joshbersin.com/podcast/page/${page}/`;
    let html;
    try { html = await fetchText(pageUrl); } catch (e) { break; }
    const matches = html.match(/href="(https?:\/\/joshbersin\.com\/podcast\/[^"]+)"/gi) || [];
    let found = 0;
    for (const m of matches) {
      const url = m.replace(/href="|"/gi, '').replace(/\/$/, '');
      if (url === 'https://joshbersin.com/podcast' || url.includes('/page/')) continue;
      urls.push({ url, source: 'joshbersin.com', pubDate: null, title: null });
      found++;
    }
    if (found === 0) break;
  }
  const seen = new Set();
  const unique = urls.filter(u => { if (seen.has(u.url)) return false; seen.add(u.url); return true; });
  console.log(`[harvest:podcast] ${unique.length}`);
  return unique;
}

// ── DEDUP ─────────────────────────────────────────────────────────────────────

function deduplicateUrls(allUrls) {
  const sorted = [...allUrls].sort((a, b) => {
    if (a.source === 'joshbersin.com' && b.source !== 'joshbersin.com') return -1;
    if (a.source !== 'joshbersin.com' && b.source === 'joshbersin.com') return 1;
    return (b.pubDate || '').localeCompare(a.pubDate || '');
  });
  const seenSlugs = new Set();
  const seenFps = new Set();
  const kept = [];
  let dupes = 0;
  for (const item of sorted) {
    const slug = slugFromUrl(item.url);
    const fp = item.title ? titleFingerprint(item.title) : null;
    if ((slug && seenSlugs.has(slug)) || (fp && fp.length > 10 && seenFps.has(fp))) { dupes++; continue; }
    if (slug) seenSlugs.add(slug);
    if (fp && fp.length > 10) seenFps.add(fp);
    kept.push(item);
  }
  console.log(`[dedup] ${allUrls.length} → ${dupes} dupes → ${kept.length} unique`);
  return kept;
}

// ── PROCESS ONE ARTICLE ───────────────────────────────────────────────────────

async function processArticle(item) {
  try {
    const html = await fetchText(item.url);
    let title = item.title;
    if (!title) {
      const tm = html.match(/<title>([^<]{3,300})<\/title>/i);
      if (tm) title = tm[1].replace(/\s*[–|—-]\s*(JOSH BERSIN|joshbersin\.com).*/i, '').replace(/\s*\|\s*.*/i, '').trim();
      title = title || item.url;
    }
    const galileoCount = countGalileoInParagraphs(html);
    return { url: item.url, source: item.source, pubDate: item.pubDate, title, galileoCount, error: null };
  } catch (e) {
    return { url: item.url, source: item.source, pubDate: item.pubDate, title: item.title || item.url, galileoCount: 0, error: e.message };
  }
}

// ── BUILD STATS FROM PROGRESS ─────────────────────────────────────────────────

function buildStatsFromProgress(progress, total) {
  const { processed = 0, totalMentions = 0, withGalileo = 0, errors = 0, topArticles = [], yearMap = {} } = progress;

  const yearData = Object.entries(yearMap)
    .filter(([y]) => y !== 'unknown').sort()
    .map(([yr, d]) => ({
      yr: yr === '2023' ? 'Nov–Dec\n2023' : yr,
      total: d.total, gal: d.gal,
      note: yr === '2023' ? 'Nov 15 launch — first 7 weeks only' : '',
    }));

  const logData = [...topArticles]
    .sort((a, b) => b.galileoCount - a.galileoCount)
    .map(r => {
      const t = (r.title || '').toLowerCase();
      let tag = 'product';
      if (r.galileoCount >= 6 || t.includes('galileo')) tag = 'dedicated';
      if (t.includes('introduc') || t.includes('launch') || t.includes('announc')) tag = 'launch';
      return {
        date: r.pubDate ? new Date(r.pubDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—',
        title: r.title, refs: r.galileoCount, url: r.url, tag,
      };
    });

  const lastMention = [...topArticles].filter(r => r.pubDate).sort((a, b) => b.pubDate.localeCompare(a.pubDate))[0];
  const daysSinceMention = lastMention ? Math.max(0, Math.floor((Date.now() - new Date(lastMention.pubDate).getTime()) / 86400000)) : 0;
  const rate = processed > 0 ? Math.round(withGalileo / processed * 100) : 0;

  return {
    yearData, logData,
    totalPublications: processed,
    totalArticlesWithGalileo: withGalileo,
    totalMentions, mentionRate: rate, daysSinceMention,
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    refreshedAt: new Date().toISOString(),
    crawlErrors: errors,
    totalCrawled: total,
  };
}

// ── HANDLER ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers['authorization'];
    const secret = req.query.secret;
    if (auth !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const mode = req.query.mode || 'harvest';

  // RESET — wipe progress so next harvest starts clean
  if (mode === 'reset') {
    await fsSet(COL, 'progress', { processed: 0, totalMentions: 0, withGalileo: 0, errors: 0, topArticles: [], yearMap: {}, resetAt: new Date().toISOString() });
    return res.status(200).json({ success: true, message: 'Progress reset. Run ?mode=harvest next.' });
  }

  // STATUS
  if (mode === 'status') {
    const [queue, progress, stats] = await Promise.all([fsGet(COL, 'queue'), fsGet(COL, 'progress'), fsGet(COL, 'stats')]);
    return res.status(200).json({
      pending: queue ? (queue.pending?.length || 0) : 'no queue',
      processed: progress?.processed || 0,
      total: queue?.total || 0,
      mentionsSoFar: progress?.totalMentions || 0,
      galileoArticlesSoFar: progress?.withGalileo || 0,
      progressResetAt: progress?.resetAt || null,
      lastStats: stats ? { lastUpdated: stats.lastUpdated, totalPublications: stats.totalPublications, totalMentions: stats.totalMentions, mentionRate: stats.mentionRate + '%' } : null,
    });
  }

  // HARVEST
  if (mode === 'harvest') {
    try {
      const [jbRes, ssRes, tagRes, podRes] = await Promise.allSettled([harvestJoshBersin(), harvestSubstack(), harvestGalileoTag(), harvestPodcastArchive()]);
      const all = [
        ...(jbRes.status === 'fulfilled' ? jbRes.value : []),
        ...(ssRes.status === 'fulfilled' ? ssRes.value : []),
        ...(tagRes.status === 'fulfilled' ? tagRes.value : []),
        ...(podRes.status === 'fulfilled' ? podRes.value : []),
      ];
      if (!all.length) return res.status(500).json({ error: 'All sources returned 0 URLs' });
      const unique = deduplicateUrls(all);
      // Always reset progress on harvest
      await Promise.all([
        fsSet(COL, 'queue', { pending: unique, total: unique.length, harvestedAt: new Date().toISOString() }),
        fsSet(COL, 'progress', { processed: 0, totalMentions: 0, withGalileo: 0, errors: 0, topArticles: [], yearMap: {}, resetAt: new Date().toISOString() }),
      ]);
      return res.status(200).json({
        success: true, queued: unique.length,
        joshbersinCom: jbRes.status === 'fulfilled' ? jbRes.value.length : 'failed',
        substack: ssRes.status === 'fulfilled' ? ssRes.value.length : 'failed',
        galileoTag: tagRes.status === 'fulfilled' ? tagRes.value.length : 'failed',
        podcastArchive: podRes.status === 'fulfilled' ? podRes.value.length : 'failed',
        duplicatesRemoved: all.length - unique.length,
        progressReset: true,
        next: 'Call ?mode=process repeatedly until done:true, then ?mode=stats',
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // PROCESS
  if (mode === 'process') {
    try {
      const queue = await fsGet(COL, 'queue');
      if (!queue) return res.status(400).json({ error: 'No queue. Run ?mode=harvest first.' });
      const { pending = [], total = 0 } = queue;

      // Load current progress
      const progress = await fsGet(COL, 'progress') || { processed: 0, totalMentions: 0, withGalileo: 0, errors: 0, topArticles: [], yearMap: {} };

      if (pending.length === 0) {
        const stats = buildStatsFromProgress(progress, total);
        await fsSet(COL, 'stats', stats);
        return res.status(200).json({
          success: true, done: true, message: 'Queue empty — stats finalized',
          totalPublications: stats.totalPublications,
          totalMentions: stats.totalMentions,
          totalArticlesWithGalileo: stats.totalArticlesWithGalileo,
          mentionRate: stats.mentionRate + '%',
        });
      }

      const batch = pending.slice(0, BATCH_SIZE);
      const remaining = pending.slice(BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(processArticle));

      // Update progress incrementally
      const updated = {
        processed: progress.processed + batchResults.length,
        totalMentions: progress.totalMentions,
        withGalileo: progress.withGalileo,
        errors: progress.errors + batchResults.filter(r => r.error).length,
        topArticles: [...(progress.topArticles || [])],
        yearMap: { ...(progress.yearMap || {}) },
        resetAt: progress.resetAt || null,
      };

      for (const r of batchResults) {
        if (r.galileoCount > 0) {
          updated.totalMentions += r.galileoCount;
          updated.withGalileo++;
          // Dedup by URL — sitemap + tag archive may both queue the same article
          // Dedup by slug (immune to trailing slash / query string variants)
          const rSlug = r.url.replace(/\/$/, '').split('/').pop().toLowerCase();
          const rTitle = (r.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
          const alreadyHave = updated.topArticles.some(a => {
            const aSlug = a.url.replace(/\/$/, '').split('/').pop().toLowerCase();
            const aTitle = (a.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
            return aSlug === rSlug || (rTitle.length > 10 && aTitle === rTitle);
          });
          if (!alreadyHave) {
            updated.topArticles.push({ url: r.url, source: r.source, pubDate: r.pubDate, title: r.title, galileoCount: r.galileoCount });
            updated.topArticles.sort((a, b) => b.galileoCount - a.galileoCount);
            if (updated.topArticles.length > 100) updated.topArticles = updated.topArticles.slice(0, 100);
          }
        }
        if (!r.error && r.pubDate) {
          const yr = r.pubDate.slice(0, 4);
          if (!updated.yearMap[yr]) updated.yearMap[yr] = { total: 0, gal: 0 };
          updated.yearMap[yr].total++;
          if (r.galileoCount > 0) updated.yearMap[yr].gal++;
        }
      }

      const mentionsInBatch = batchResults.reduce((s, r) => s + r.galileoCount, 0);

      await Promise.all([
        fsSet(COL, 'progress', updated),
        fsSet(COL, 'queue', { pending: remaining, total }),
      ]);

      if (remaining.length === 0) {
        const stats = buildStatsFromProgress(updated, total);
        await fsSet(COL, 'stats', stats);
        return res.status(200).json({
          success: true, done: true, message: 'Queue empty — stats finalized',
          processed: updated.processed, total,
          totalMentions: updated.totalMentions,
          totalArticlesWithGalileo: updated.withGalileo,
          mentionRate: Math.round(updated.withGalileo / (updated.processed || 1) * 100) + '%',
        });
      }

      return res.status(200).json({
        success: true, done: false,
        batchSize: batch.length,
        processed: updated.processed,
        remaining: remaining.length,
        total,
        percentComplete: total > 0 ? Math.round(updated.processed / total * 100) : 0,
        mentionsInBatch,
        totalMentionsSoFar: updated.totalMentions,
        galileoArticlesSoFar: updated.withGalileo,
        next: 'Hit ?mode=process again',
      });
    } catch (err) {
      console.error('[process]', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // STATS
  if (mode === 'stats') {
    try {
      const progress = await fsGet(COL, 'progress');
      if (!progress?.processed) return res.status(400).json({ error: 'No progress data. Run harvest + process first.' });
      const queue = await fsGet(COL, 'queue');
      const stats = buildStatsFromProgress(progress, queue?.total || progress.processed);
      await fsSet(COL, 'stats', stats);
      return res.status(200).json({
        success: true,
        totalPublications: stats.totalPublications,
        totalArticlesWithGalileo: stats.totalArticlesWithGalileo,
        totalMentions: stats.totalMentions,
        mentionRate: stats.mentionRate + '%',
        daysSinceMention: stats.daysSinceMention,
        crawlErrors: stats.crawlErrors,
        lastUpdated: stats.lastUpdated,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: `Unknown mode: "${mode}"`, valid: ['harvest', 'process', 'stats', 'status', 'reset'] });
}
