// Blueprint™ Job Sync Cron — /api/jobs-sync
// Runs every 6 hours. Pulls jobs from all sources, writes to Firestore.
// Requires: FIREBASE_SERVICE_ACCOUNT, RAPIDAPI_KEY, CRON_SECRET env vars

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

// Search queries covering major job families — broad terms for maximum coverage
const SYNC_QUERIES = [
  'software engineer',
  'product manager',
  'data analyst',
  'marketing manager',
  'operations manager',
  'project manager',
  'UX designer',
  'sales director',
  'HR manager',
  'executive leadership',
  'supply chain manager',
  'business analyst',
  'talent acquisition',
  'strategy consultant',
  'customer success',
  'engineering director',
  'chief technology officer',
  'account executive',
  'financial analyst',
  'program manager',
  'devops engineer',
  'content marketing',
  'business development',
  'machine learning engineer',
  'solutions architect'
];

// === SOURCE FETCHERS ===

async function fetchJSearch(query) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return { jobs: [], source: 'jsearch', error: 'No API key' };
  try {
    const params = new URLSearchParams({
      query: query,
      page: '1',
      num_pages: '3',
      date_posted: 'month'
    });
    const res = await fetch('https://jsearch.p.rapidapi.com/search?' + params, {
      headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' },
      signal: AbortSignal.timeout(20000)
    });
    if (!res.ok) return { jobs: [], source: 'jsearch', error: 'HTTP ' + res.status };
    const data = await res.json();
    const jobs = (data.data || []).map(j => ({
      id: 'jsearch-' + j.job_id,
      title: j.job_title || '',
      company: j.employer_name || '',
      companyLogo: j.employer_logo || '',
      location: j.job_location || '',
      type: j.job_employment_type || 'Full-time',
      salary: j.job_salary_string || (j.job_min_salary && j.job_max_salary ? '$' + Math.round(j.job_min_salary/1000) + 'K-$' + Math.round(j.job_max_salary/1000) + 'K' : ''),
      remote: !!j.job_is_remote,
      source: 'jsearch',
      url: j.job_apply_link || '',
      description: (j.job_description || '').substring(0, 2000),
      tags: [],
      qualifications: j.job_highlights?.Qualifications || [],
      responsibilities: j.job_highlights?.Responsibilities || [],
      benefits: (j.job_benefits || []).join(','),
      postedAt: j.job_posted_at_datetime_utc || ''
    }));
    return { jobs, source: 'jsearch', count: jobs.length };
  } catch (e) {
    return { jobs: [], source: 'jsearch', error: e.message };
  }
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

async function fetchHimalayas(query) {
  try {
    const res = await fetch('https://himalayas.app/jobs/api?limit=50', {
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) return { jobs: [], source: 'himalayas', error: 'HTTP ' + res.status };
    const data = await res.json();
    const q = query.toLowerCase();
    const jobs = (data.jobs || []).filter(j =>
      (j.title || '').toLowerCase().includes(q) || (j.description || '').toLowerCase().includes(q)
    ).map(j => ({
      id: 'himalayas-' + j.id,
      title: j.title || '',
      company: j.companyName || '',
      companyLogo: j.companyLogo || '',
      location: j.location || 'Remote',
      type: 'Full-Time',
      salary: j.minSalary && j.maxSalary ? '$' + Math.round(j.minSalary/1000) + 'K-$' + Math.round(j.maxSalary/1000) + 'K' : '',
      remote: true,
      source: 'himalayas',
      url: j.applicationLink || j.url || '',
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
      tags: j.jobIndustry || [],
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

// === MAIN SYNC HANDLER ===
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
  let apiCallCount = 0;

  console.log('[jobs-sync] Starting sync with ' + SYNC_QUERIES.length + ' queries...');

  // Process queries in batches of 3 to avoid overwhelming APIs
  for (let i = 0; i < SYNC_QUERIES.length; i += 3) {
    const batch = SYNC_QUERIES.slice(i, i + 3);

    const batchResults = await Promise.all(batch.map(async (query) => {
      const results = await Promise.allSettled([
        fetchJSearch(query),
        fetchRemotive(query),
        fetchUSAJobs(query),
        fetchHimalayas(query),
        fetchJobicy(query)
      ]);
      apiCallCount += 5;
      return { query, results };
    }));

    batchResults.forEach(({ query, results }) => {
      results.forEach(r => {
        if (r.status === 'fulfilled' && r.value) {
          const { jobs, source, error } = r.value;
          if (error) {
            errors.push(source + ': ' + error + ' (query: ' + query + ')');
          }
          if (jobs && jobs.length > 0) {
            sourceCounts[source] = (sourceCounts[source] || 0) + jobs.length;
            jobs.forEach(job => {
              if (job.id && job.title) {
                allJobs.set(job.id, {
                  ...job,
                  syncedAt: admin.firestore.Timestamp.now(),
                  syncQuery: query
                });
              }
            });
          }
        } else if (r.status === 'rejected') {
          errors.push('Unknown: ' + (r.reason?.message || 'Promise rejected'));
        }
      });
    });
  }

  console.log('[jobs-sync] Fetched ' + allJobs.size + ' unique jobs. Writing to Firestore...');

  // Batch write to Firestore (max 500 per batch)
  const jobEntries = Array.from(allJobs.entries());
  let written = 0;

  for (let i = 0; i < jobEntries.length; i += 450) {
    const chunk = jobEntries.slice(i, i + 450);
    const batch = db.batch();
    chunk.forEach(([id, job]) => {
      const ref = db.collection('jobs').doc(safeDocId(id));
      batch.set(ref, job, { merge: true });
    });
    await batch.commit();
    written += chunk.length;
  }

  // Clean up old jobs (>30 days)
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

  // Get total job count in collection
  let totalInDb = written;
  try {
    const countSnap = await db.collection('jobs').count().get();
    totalInDb = countSnap.data().count;
  } catch (e) {
    // count() may not be available on older SDK
  }

  // Write sync metadata
  const meta = {
    lastSync: admin.firestore.FieldValue.serverTimestamp(),
    totalJobs: totalInDb,
    jobsSynced: allJobs.size,
    sourceCounts,
    queriesRun: SYNC_QUERIES.length,
    apiCalls: apiCallCount,
    errors: errors.slice(0, 20),
    cleaned,
    duration: Date.now() - startTime
  };
  await db.collection('meta').doc('jobsSync').set(meta);

  console.log('[jobs-sync] Done. ' + written + ' jobs written, ' + cleaned + ' old jobs cleaned. Duration: ' + meta.duration + 'ms');

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'OK',
    jobsSynced: allJobs.size,
    totalInDb,
    sourceCounts,
    errors: errors.slice(0, 10),
    cleaned,
    duration: meta.duration
  }));
};

// Vercel config: 60s timeout (Pro plan max), Node 18
module.exports.config = { maxDuration: 60 };
