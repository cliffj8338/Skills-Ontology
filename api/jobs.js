// Blueprint™ Job Search Proxy — /api/jobs
// Aggregates: JSearch (RapidAPI), Remotive, USAJobs, Himalayas, Jobicy
// Requires: RAPIDAPI_KEY env var for JSearch, USAJOBS_EMAIL env var for USAJobs

const ALLOWED_ORIGINS = ['https://myblueprint.work', 'https://www.myblueprint.work', 'http://localhost:3000'];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
}

// === JSEARCH (RapidAPI — Google for Jobs aggregator) ===
async function fetchJSearch(query, location, page, remoteOnly) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return { jobs: [], source: 'jsearch', error: 'RAPIDAPI_KEY not configured' };

  try {
    const params = new URLSearchParams({
      query: query + (location ? ' in ' + location : ''),
      page: String(page || 1),
      num_pages: '3',
      date_posted: 'all'
    });
    if (remoteOnly) params.set('remote_jobs_only', 'true');

    const res = await fetch('https://jsearch.p.rapidapi.com/search?' + params.toString(), {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return { jobs: [], source: 'jsearch', error: 'HTTP ' + res.status, detail: errText.substring(0, 200) };
    }

    const data = await res.json();
    const jobs = (data.data || []).map(j => ({
      id: 'jsearch-' + (j.job_id || Date.now() + Math.random()),
      title: j.job_title || 'Untitled',
      company: j.employer_name || '',
      companyLogo: j.employer_logo || '',
      location: [j.job_city, j.job_state, j.job_country].filter(Boolean).join(', ') || 'Not specified',
      type: j.job_employment_type || 'Full-time',
      url: j.job_apply_link || j.job_google_link || '',
      salary: formatJSearchSalary(j),
      description: (j.job_description || '').substring(0, 3000),
      tags: (j.job_required_skills || []),
      source: 'JSearch',
      pubDate: j.job_posted_at_datetime_utc || '',
      remote: j.job_is_remote || false,
      benefits: j.job_benefits || [],
      experience: j.job_required_experience || {},
      qualifications: (j.job_highlights?.Qualifications || []).slice(0, 5),
      responsibilities: (j.job_highlights?.Responsibilities || []).slice(0, 5)
    }));

    return { jobs, source: 'jsearch', count: jobs.length, total: data.total_count || jobs.length };
  } catch (e) {
    return { jobs: [], source: 'jsearch', error: e.message };
  }
}

function formatJSearchSalary(j) {
  const min = j.job_min_salary;
  const max = j.job_max_salary;
  const period = j.job_salary_period;
  if (!min && !max) return '';
  const fmt = n => n >= 1000 ? '$' + (n / 1000).toFixed(0) + 'k' : '$' + n;
  if (min && max) return fmt(min) + ' - ' + fmt(max) + (period ? '/' + period.toLowerCase() : '');
  if (min) return 'From ' + fmt(min) + (period ? '/' + period.toLowerCase() : '');
  return 'Up to ' + fmt(max) + (period ? '/' + period.toLowerCase() : '');
}

// === REMOTIVE (free, no auth) ===
async function fetchRemotive(query, category) {
  try {
    let url = 'https://remotive.com/api/remote-jobs?limit=50';
    if (query) url += '&search=' + encodeURIComponent(query);
    if (category) {
      const catMap = { 'software-dev': 'software-dev', 'marketing': 'marketing', 'business': 'business', 'data': 'data', 'design': 'design', 'product': 'product', 'hr': 'hr', 'finance': 'finance-legal', 'sales': 'sales', 'customer-support': 'customer-support', 'writing': 'writing', 'devops': 'devops-sysadmin' };
      if (catMap[category]) url += '&category=' + catMap[category];
    }
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) return { jobs: [], source: 'remotive', error: 'HTTP ' + res.status };
    const data = await res.json();
    const jobs = (data.jobs || []).slice(0, 40).map(j => ({
      id: 'remotive-' + j.id,
      title: j.title || 'Untitled',
      company: j.company_name || '',
      companyLogo: j.company_logo_url || '',
      location: j.candidate_required_location || 'Worldwide',
      type: (j.job_type || 'full_time').replace(/_/g, ' '),
      url: j.url || '',
      salary: j.salary || '',
      description: (j.description || '').substring(0, 3000),
      tags: j.tags || [],
      source: 'Remotive',
      pubDate: j.publication_date || '',
      remote: true
    }));
    return { jobs, source: 'remotive', count: jobs.length };
  } catch (e) {
    return { jobs: [], source: 'remotive', error: e.message };
  }
}

// === USAJOBS (free, requires email header) ===
async function fetchUSAJobs(query, location) {
  const email = process.env.USAJOBS_EMAIL;
  const apiKey = process.env.USAJOBS_API_KEY;
  if (!email || !apiKey) return { jobs: [], source: 'usajobs', error: 'USAJOBS credentials not configured' };

  try {
    const params = new URLSearchParams({ Keyword: query, ResultsPerPage: '25' });
    if (location) params.set('LocationName', location);

    const res = await fetch('https://data.usajobs.gov/api/Search?' + params.toString(), {
      headers: {
        'Authorization-Key': apiKey,
        'User-Agent': email,
        'Host': 'data.usajobs.gov'
      },
      signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) return { jobs: [], source: 'usajobs', error: 'HTTP ' + res.status };
    const data = await res.json();
    const results = data?.SearchResult?.SearchResultItems || [];
    const jobs = results.slice(0, 25).map(item => {
      const j = item.MatchedObjectDescriptor;
      const pos = (j.PositionLocation || [])[0] || {};
      const sal = j.PositionRemuneration?.[0] || {};
      return {
        id: 'usajobs-' + (j.PositionID || Date.now()),
        title: j.PositionTitle || 'Untitled',
        company: j.OrganizationName || j.DepartmentName || 'US Government',
        companyLogo: '',
        location: [pos.CityName, pos.CountrySubDivisionCode].filter(Boolean).join(', ') || 'Various',
        type: (j.PositionSchedule || [{ Name: 'Full-time' }])[0]?.Name || 'Full-time',
        url: j.PositionURI || j.ApplyURI?.[0] || '',
        salary: sal.MinimumRange && sal.MaximumRange ? '$' + Number(sal.MinimumRange).toLocaleString() + ' - $' + Number(sal.MaximumRange).toLocaleString() + '/' + (sal.RateIntervalCode || 'year').toLowerCase() : '',
        description: (j.QualificationSummary || j.UserArea?.Details?.MajorDuties?.join(' ') || '').substring(0, 3000),
        tags: (j.PositionOfferingType || []).map(t => t.Name),
        source: 'USAJobs',
        pubDate: j.PositionStartDate || j.PublicationStartDate || '',
        remote: (j.PositionLocationDisplay || '').toLowerCase().includes('remote')
      };
    });
    return { jobs, source: 'usajobs', count: jobs.length };
  } catch (e) {
    return { jobs: [], source: 'usajobs', error: e.message };
  }
}

// === HIMALAYAS (free, no auth) ===
async function fetchHimalayas(query) {
  try {
    const res = await fetch('https://himalayas.app/jobs/api?limit=50', { signal: AbortSignal.timeout(12000) });
    if (!res.ok) return { jobs: [], source: 'himalayas', error: 'HTTP ' + res.status };
    let data = await res.json();
    if (!Array.isArray(data)) return { jobs: [], source: 'himalayas', error: 'Invalid response' };

    if (query) {
      const kw = query.toLowerCase();
      data = data.filter(j => ((j.title || '') + ' ' + (j.companyName || '') + ' ' + ((j.categories || []).join(' '))).toLowerCase().includes(kw));
    }

    const jobs = data.slice(0, 40).map(j => {
      const salary = j.minSalary && j.maxSalary ? '$' + (j.minSalary / 1000).toFixed(0) + 'k - $' + (j.maxSalary / 1000).toFixed(0) + 'k' : '';
      return {
        id: 'himalayas-' + (j.id || Date.now()),
        title: j.title || 'Untitled',
        company: j.companyName || '',
        companyLogo: j.companyLogo || '',
        location: (j.locationRestrictions || []).join(', ') || 'Worldwide',
        type: j.employmentType || 'Full Time',
        url: j.applicationUrl || j.url || '',
        salary: salary,
        description: (j.description || '').substring(0, 3000),
        tags: j.categories || [],
        source: 'Himalayas',
        pubDate: j.pubDate || '',
        remote: true
      };
    });
    return { jobs, source: 'himalayas', count: jobs.length };
  } catch (e) {
    return { jobs: [], source: 'himalayas', error: e.message };
  }
}

// === JOBICY (free, no auth) ===
async function fetchJobicy(query, category) {
  try {
    let url = 'https://jobicy.com/api/v2/remote-jobs?count=30';
    if (query) url += '&tag=' + encodeURIComponent(query);
    if (category) {
      const catMap = { 'software-dev': 'dev', 'marketing': 'marketing', 'business': 'business', 'data': 'data-science', 'design': 'design-multimedia', 'hr': 'hr', 'finance': 'accounting-finance', 'sales': 'seller', 'customer-support': 'supporting', 'writing': 'copywriting', 'devops': 'dev' };
      if (catMap[category]) url += '&job_categories=' + catMap[category];
    }
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) return { jobs: [], source: 'jobicy', error: 'HTTP ' + res.status };
    const data = await res.json();
    const jobs = (data.jobs || []).slice(0, 30).map(j => {
      const salary = j.annualSalaryMin && j.annualSalaryMax ? '$' + (j.annualSalaryMin / 1000).toFixed(0) + 'k - $' + (j.annualSalaryMax / 1000).toFixed(0) + 'k' : '';
      return {
        id: 'jobicy-' + (j.id || Date.now()),
        title: j.jobTitle || 'Untitled',
        company: j.companyName || '',
        companyLogo: j.companyLogo || '',
        location: j.jobGeo || 'Worldwide',
        type: (j.jobType || ['Full Time']).join(', '),
        url: j.url || '',
        salary: salary,
        description: (j.jobDescription || '').substring(0, 3000),
        tags: [j.jobIndustry].filter(Boolean),
        source: 'Jobicy',
        pubDate: j.pubDate || '',
        remote: true
      };
    });
    return { jobs, source: 'jobicy', count: jobs.length };
  } catch (e) {
    return { jobs: [], source: 'jobicy', error: e.message };
  }
}

// === MAIN HANDLER ===
module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405, headers);
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const url = new URL(req.url, 'https://myblueprint.work');
  const query = url.searchParams.get('q') || '';
  const location = url.searchParams.get('location') || '';
  const category = url.searchParams.get('category') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const remoteOnly = url.searchParams.get('remote') === 'true';
  const sourcesParam = url.searchParams.get('sources') || 'all'; // all, jsearch, remotive, usajobs, himalayas, jobicy

  if (!query) {
    res.writeHead(400, headers);
    res.end(JSON.stringify({ error: 'Query parameter "q" is required' }));
    return;
  }

  const wantedSources = sourcesParam === 'all'
    ? ['jsearch', 'remotive', 'usajobs', 'himalayas', 'jobicy']
    : sourcesParam.split(',');

  // Run all requested sources in parallel
  const fetchers = [];
  if (wantedSources.includes('jsearch')) fetchers.push(fetchJSearch(query, location, page, remoteOnly));
  if (wantedSources.includes('remotive')) fetchers.push(fetchRemotive(query, category));
  if (wantedSources.includes('usajobs')) fetchers.push(fetchUSAJobs(query, location));
  if (wantedSources.includes('himalayas')) fetchers.push(fetchHimalayas(query));
  if (wantedSources.includes('jobicy')) fetchers.push(fetchJobicy(query, category));

  const results = await Promise.all(fetchers);

  // Merge and deduplicate
  const allJobs = [];
  const seen = new Set();
  const sourceStats = {};

  results.forEach(r => {
    sourceStats[r.source] = { count: r.count || 0, error: r.error || null, total: r.total || null };
    (r.jobs || []).forEach(j => {
      const key = (j.title + '-' + j.company).toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seen.has(key)) {
        seen.add(key);
        allJobs.push(j);
      }
    });
  });

  res.writeHead(200, headers);
  res.end(JSON.stringify({
    jobs: allJobs,
    total: allJobs.length,
    sources: sourceStats,
    query,
    location,
    page,
    timestamp: new Date().toISOString()
  }));
};

// Vercel serverless config — extend timeout to 30s (Pro plan supports up to 60s)
module.exports.config = { maxDuration: 30 };
