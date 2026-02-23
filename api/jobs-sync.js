// Blueprint™ Job Sync Cron — /api/jobs-sync
// Runs every 6 hours. Pulls jobs from all sources, writes to Firestore.
// Requires: FIREBASE_SERVICE_ACCOUNT, RAPIDAPI_KEY, CRON_SECRET env vars
//
// Architecture:
//   - JSearch (paid): large aggregator, gets diverse query list with pagination
//   - Free sources (Remotive, Jobicy): smaller catalogs, broad queries only
//   - Himalayas: no server-side search, fetched ONCE per sync
//   - USAJobs: free, government-specific queries
//   - JSearch queries split into A/B groups, alternating each sync to stay under 10k/mo
//
// Budget math (RapidAPI Pro = 10,000 requests/month):
//   - JSearch: 18 queries/sync × 5 pages = 90 billed requests/sync
//   - 4 syncs/day × 30 days = 120 syncs/month × 90 = 10,800 — tight
//   - With A/B alternation: 18 queries/sync → 9 per group × 5 = 45/sync × 120 = 5,400/month ✓
//   - Leaves ~4,600 requests/month headroom for live search

const admin = require('firebase-admin');

// Firebase Admin init (singleton)
if (!admin.apps.length) {
  try {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  } catch (e) {
    console.error('Firebase Admin init failed:', e.message);
  }
}
const db = admin.firestore();

// ============================================================
// QUERY LISTS — tuned per source
// ============================================================

// JSearch queries: split into A and B groups, alternating per sync.
// Each returns up to 50 results (num_pages: 5 × ~10 per page).
// Broad role terms for high-volume coverage.
const JSEARCH_GROUP_A = [
  'software engineer',
  'product manager',
  'data analyst',
  'marketing director',
  'UX designer',
  'sales director',
  'HR director',
  'project manager',
  'talent acquisition manager',
  'engineering manager',
  'solutions architect',
  'machine learning engineer',
  'chief technology officer',
  'program manager',
  'business development manager',
  'customer success manager',
  'content strategist',
  'cloud architect',
];

const JSEARCH_GROUP_B = [
  'operations director',
  'financial analyst',
  'strategy consultant',
  'supply chain manager',
  'executive leadership',
  'business analyst',
  'account executive',
  'devops engineer',
  'product designer',
  'data engineer',
  'VP of engineering',
  'director of marketing',
  'chief operating officer',
  'people operations manager',
  'revenue operations',
  'AI engineer',
  'security engineer',
  'head of product',
];

// Free source queries: broad terms, run all per sync (no cost).
// These are small catalogs so 8 queries covers most of the inventory.
const FREE_SOURCE_QUERIES = [
  'engineer',
  'manager',
  'director',
  'analyst',
  'designer',
  'marketing',
  'product',
  'data',
];

// USAJobs queries: government-relevant roles (free, no limit)
const USAJOBS_QUERIES = [
  'program manager',
  'analyst',
  'engineer',
  'director',
  'specialist',
  'technology',
  'management',
  'operations',
];

// ============================================================
// SOURCE FETCHERS
// ============================================================

async function fetchJSearch(query, numPages) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return { jobs: [], source: 'jsearch', error: 'No API key', query };
  try {
    const params = new URLSearchParams({
      query: query,
      page: '1',
      num_pages: String(numPages || 5),
      date_posted: 'month'
    });
    const res = await fetch('https://jsearch.p.rapidapi.com/search?' + params, {
      headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' },
      signal: AbortSignal.timeout(20000)
    });
    if (!res.ok) return { jobs: [], source: 'jsearch', error: 'HTTP ' + res.status, query };
    const data = await res.json();
    const jobs = (data.data || []).map(j => ({
      id: 'jsearch-' + j.job_id,
      title: j.job_title || '',
      company: j.employer_name || '',
      companyLogo: j.employer_logo || '',
      location: [j.job_city, j.job_state, j.job_country].filter(Boolean).join(', ') || j.job_location || '',
      type: j.job_employment_type || 'Full-time',
      salary: j.job_salary_string || formatSalary(j.job_min_salary, j.job_max_salary, j.job_salary_period),
      remote: !!j.job_is_remote,
      source: 'jsearch',
      url: j.job_apply_link || '',
      description: (j.job_description || '').substring(0, 2000),
      tags: j.job_required_skills || [],
      qualifications: j.job_highlights?.Qualifications || [],
      responsibilities: j.job_highlights?.Responsibilities || [],
      benefits: (j.job_benefits || []).join(','),
      postedAt: j.job_posted_at_datetime_utc || ''
    }));
    return { jobs, source: 'jsearch', count: jobs.length, query };
  } catch (e) {
    return { jobs: [], source: 'jsearch', error: e.message, query };
  }
}

function formatSalary(min, max, period) {
  if (!min && !max) return '';
  const fmt = n => n >= 1000 ? '$' + Math.round(n / 1000) + 'K' : '$' + n;
  const suffix = period ? '/' + period.toLowerCase() : '';
  if (min && max) return fmt(min) + '-' + fmt(max) + suffix;
  if (min) return 'From ' + fmt(min) + suffix;
  return 'Up to ' + fmt(max) + suffix;
}

async function fetchRemotive(query) {
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs?search=' + encodeURIComponent(query) + '&limit=50', {
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) return { jobs: [], source: 'remotive', error: 'HTTP ' + res.status };
    const data = await res.json();
    const jobs = (data.jobs || []).map(j => ({
      id: 'remotive-' + j.id,
      title: j.title || '',
      company: j.company_name || '',
      companyLogo: j.company_logo_url || '',
      location: j.candidate_required_location || 'Remote',
      type: j.job_type || 'full time',
      salary: j.salary || '',
      remote: true,
      source: 'remotive',
      url: j.url || '',
      description: (j.description || '').replace(/<[^>]*>/g, '').substring(0, 2000),
      tags: j.tags || [],
      qualifications: [],
      responsibilities: [],
      benefits: '',
      postedAt: j.publication_date || ''
    }));
    return { jobs, source: 'remotive', count: jobs.length };
  } catch (e) {
    return { jobs: [], source: 'remotive', error: e.message };
  }
}

async function fetchHimalayas() {
  // Himalayas has NO server-side search. Always returns latest jobs.
  // Fetch once per sync, keep everything. No point calling multiple times.
  try {
    const res = await fetch('https://himalayas.app/jobs/api?limit=100', {
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) return { jobs: [], source: 'himalayas', error: 'HTTP ' + res.status };
    const raw = await res.json();
    const data = Array.isArray(raw) ? raw : (raw.jobs || []);
    const jobs = data.map(j => ({
      id: 'himalayas-' + (j.id || j.slug || Date.now()),
      title: j.title || '',
      company: j.companyName || '',
      companyLogo: j.companyLogo || '',
      location: (j.locationRestrictions || []).join(', ') || j.location || 'Remote',
      type: j.employmentType || 'Full-Time',
      salary: j.minSalary && j.maxSalary ? '$' + Math.round(j.minSalary / 1000) + 'K-$' + Math.round(j.maxSalary / 1000) + 'K' : '',
      remote: true,
      source: 'himalayas',
      url: j.applicationLink || j.applicationUrl || j.url || '',
      description: (j.description || '').substring(0, 2000),
      tags: j.categories || [],
      qualifications: [],
      responsibilities: [],
      benefits: '',
      postedAt: j.pubDate || ''
    }));
    return { jobs, source: 'himalayas', count: jobs.length };
  } catch (e) {
    return { jobs: [], source: 'himalayas', error: e.message };
  }
}

async function fetchJobicy(query) {
  try {
    const res = await fetch('https://jobicy.com/api/v2/remote-jobs?count=50&tag=' + encodeURIComponent(query), {
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) return { jobs: [], source: 'jobicy', error: 'HTTP ' + res.status };
    const data = await res.json();
    const jobs = (data.jobs || []).map(j => ({
      id: 'jobicy-' + j.id,
      title: j.jobTitle || '',
      company: j.companyName || '',
      companyLogo: j.companyLogo || '',
      location: j.jobGeo || 'Remote',
      type: Array.isArray(j.jobType) ? j.jobType.join(', ') : (j.jobType || 'Full-Time'),
      salary: j.annualSalaryMin && j.annualSalaryMax ? '$' + j.annualSalaryMin + '-$' + j.annualSalaryMax : '',
      remote: true,
      source: 'jobicy',
      url: j.url || '',
      description: (j.jobDescription || '').replace(/<[^>]*>/g, '').substring(0, 2000),
      tags: Array.isArray(j.jobIndustry) ? j.jobIndustry : [j.jobIndustry].filter(Boolean),
      qualifications: [],
      responsibilities: [],
      benefits: '',
      postedAt: j.pubDate || ''
    }));
    return { jobs, source: 'jobicy', count: jobs.length };
  } catch (e) {
    return { jobs: [], source: 'jobicy', error: e.message };
  }
}

async function fetchUSAJobs(query) {
  const apiKey = process.env.USAJOBS_API_KEY;
  const email = process.env.USAJOBS_EMAIL;
  if (!apiKey || !email) return { jobs: [], source: 'usajobs', error: 'Not configured' };
  try {
    const params = new URLSearchParams({ Keyword: query, ResultsPerPage: '50' });
    const res = await fetch('https://data.usajobs.gov/api/Search?' + params, {
      headers: { 'Authorization-Key': apiKey, 'User-Agent': email },
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) return { jobs: [], source: 'usajobs', error: 'HTTP ' + res.status };
    const data = await res.json();
    const items = data.SearchResult?.SearchResultItems || [];
    const jobs = items.map(item => {
      const p = item.MatchedObjectDescriptor;
      const sal = p.PositionRemuneration?.[0] || {};
      return {
        id: 'usajobs-' + (p.PositionID || p.PositionURI),
        title: p.PositionTitle || '',
        company: p.OrganizationName || 'US Government',
        companyLogo: '',
        location: p.PositionLocationDisplay || '',
        type: p.PositionSchedule?.[0]?.Name || 'Full-time',
        salary: sal.MinimumRange && sal.MaximumRange ? '$' + parseInt(sal.MinimumRange).toLocaleString() + '-$' + parseInt(sal.MaximumRange).toLocaleString() : '',
        remote: (p.PositionLocationDisplay || '').toLowerCase().includes('remote'),
        source: 'usajobs',
        url: p.PositionURI || p.ApplyURI?.[0] || '',
        description: (p.UserArea?.Details?.MajorDuties?.join(' ') || p.QualificationSummary || '').substring(0, 2000),
        tags: [],
        qualifications: p.QualificationSummary ? [p.QualificationSummary.substring(0, 500)] : [],
        responsibilities: p.UserArea?.Details?.MajorDuties || [],
        benefits: '',
        postedAt: p.PublicationStartDate || ''
      };
    });
    return { jobs, source: 'usajobs', count: jobs.length };
  } catch (e) {
    return { jobs: [], source: 'usajobs', error: e.message };
  }
}

// Safe Firestore doc ID (no slashes, max 200 chars)
function safeDocId(id) {
  return id.replace(/[\/\.\#\$\[\]]/g, '_').substring(0, 200);
}

// ============================================================
// MAIN SYNC HANDLER
// ============================================================
module.exports = async function handler(req, res) {
  // Auth: Vercel cron or manual trigger with CRON_SECRET
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.authorization;
    if (auth !== 'Bearer ' + secret) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }
  }

  const startTime = Date.now();
  const allJobs = new Map();
  const errors = [];
  const sourceCounts = { jsearch: 0, remotive: 0, usajobs: 0, himalayas: 0, jobicy: 0 };
  let jsearchApiCalls = 0;

  // Determine which JSearch group to run (A or B, alternating per sync)
  let syncGroup = 'A';
  try {
    const metaDoc = await db.collection('meta').doc('jobsSync').get();
    if (metaDoc.exists) {
      const lastGroup = metaDoc.data().syncGroup;
      syncGroup = lastGroup === 'A' ? 'B' : 'A';
    }
  } catch (e) {
    // Default to A if can't read meta
  }

  const jsearchQueries = syncGroup === 'A' ? JSEARCH_GROUP_A : JSEARCH_GROUP_B;
  const JSEARCH_PAGES = 5; // 5 pages × ~10 results = ~50 jobs per query

  console.log('[jobs-sync] Starting sync — JSearch group ' + syncGroup + ' (' + jsearchQueries.length + ' queries × ' + JSEARCH_PAGES + ' pages), free sources (' + FREE_SOURCE_QUERIES.length + ' queries)');

  // Helper to collect results into allJobs
  function collectJobs(result) {
    const { jobs, source, error, query } = result;
    if (error) errors.push(source + ': ' + error + (query ? ' (q: ' + query + ')' : ''));
    sourceCounts[source] = (sourceCounts[source] || 0) + (jobs ? jobs.length : 0);
    (jobs || []).forEach(job => {
      if (job.id && job.title) {
        allJobs.set(job.id, { ...job, syncedAt: admin.firestore.Timestamp.now(), syncGroup });
      }
    });
  }

  // ── Phase 1: JSearch (paid, batched 3 at a time) ──────────
  for (let i = 0; i < jsearchQueries.length; i += 3) {
    const batch = jsearchQueries.slice(i, i + 3);
    const results = await Promise.all(batch.map(q => fetchJSearch(q, JSEARCH_PAGES)));
    results.forEach(r => {
      jsearchApiCalls += JSEARCH_PAGES; // Each page = 1 billed request
      collectJobs(r);
    });
  }

  // ── Phase 2: Free sources (parallel, no cost) ─────────────

  // Himalayas: ONE call (no server-side search)
  collectJobs(await fetchHimalayas());

  // Remotive + Jobicy: broad queries in parallel
  const freeResults = await Promise.all(
    FREE_SOURCE_QUERIES.flatMap(q => [fetchRemotive(q), fetchJobicy(q)])
  );
  freeResults.forEach(collectJobs);

  // USAJobs: dedicated query list, batched 4 at a time
  for (let i = 0; i < USAJOBS_QUERIES.length; i += 4) {
    const batch = USAJOBS_QUERIES.slice(i, i + 4);
    const results = await Promise.all(batch.map(q => fetchUSAJobs(q)));
    results.forEach(collectJobs);
  }

  console.log('[jobs-sync] Fetched ' + allJobs.size + ' unique jobs. Sources: jsearch=' + sourceCounts.jsearch + ' remotive=' + sourceCounts.remotive + ' usajobs=' + sourceCounts.usajobs + ' himalayas=' + sourceCounts.himalayas + ' jobicy=' + sourceCounts.jobicy + '. Writing to Firestore...');

  // ── Phase 3: Write to Firestore (batch upsert) ────────────
  const jobEntries = Array.from(allJobs.entries());
  let written = 0;

  for (let i = 0; i < jobEntries.length; i += 450) {
    const chunk = jobEntries.slice(i, i + 450);
    const fbBatch = db.batch();
    chunk.forEach(([id, job]) => {
      const ref = db.collection('jobs').doc(safeDocId(id));
      fbBatch.set(ref, job, { merge: true });
    });
    await fbBatch.commit();
    written += chunk.length;
  }

  // ── Phase 4: Cleanup old jobs (>30 days) ───────────────────
  let cleaned = 0;
  try {
    const cutoff = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 30 * 86400000));
    const oldSnap = await db.collection('jobs').where('syncedAt', '<', cutoff).limit(500).get();
    if (!oldSnap.empty) {
      const delBatch = db.batch();
      oldSnap.docs.forEach(doc => delBatch.delete(doc.ref));
      await delBatch.commit();
      cleaned = oldSnap.size;
    }
  } catch (e) {
    errors.push('Cleanup: ' + e.message);
  }

  // ── Phase 5: Update metadata ───────────────────────────────
  let totalInDb = written;
  try {
    const countSnap = await db.collection('jobs').count().get();
    totalInDb = countSnap.data().count;
  } catch (e) {
    // count() may not be available on older SDK
  }

  const meta = {
    lastSync: admin.firestore.FieldValue.serverTimestamp(),
    totalJobs: totalInDb,
    jobsSynced: allJobs.size,
    sourceCounts,
    syncGroup,
    jsearchQueries: jsearchQueries.length,
    jsearchPages: JSEARCH_PAGES,
    jsearchApiCalls,
    freeQueries: FREE_SOURCE_QUERIES.length,
    usajobsQueries: USAJOBS_QUERIES.length,
    errors: errors.slice(0, 20),
    cleaned,
    duration: Date.now() - startTime
  };
  await db.collection('meta').doc('jobsSync').set(meta);

  console.log('[jobs-sync] Done. Group ' + syncGroup + ': ' + written + ' written, ' + cleaned + ' cleaned, ' + totalInDb + ' total in DB. JSearch API calls: ' + jsearchApiCalls + '. Duration: ' + meta.duration + 'ms');

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'OK',
    syncGroup,
    jobsSynced: allJobs.size,
    totalInDb,
    sourceCounts,
    jsearchApiCalls,
    errors: errors.slice(0, 10),
    cleaned,
    duration: meta.duration
  }));
};

// Vercel config: 60s timeout (Pro plan max), Node 18
module.exports.config = { maxDuration: 60 };
