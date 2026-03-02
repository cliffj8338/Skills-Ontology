// ============================================================
// BLUEPRINT JOB SOURCE ADDITIONS — Add to /api/jobs.js
// Adzuna, The Muse integration for serverless sync
// ============================================================
//
// SETUP REQUIRED:
// 1. Adzuna: Register at https://developer.adzuna.com → get app_id + app_key
// 3. The Muse: Register at https://www.themuse.com/developers/api/v2 → get api_key (optional, works without)
//
// Add these as Vercel environment variables:
//   ADZUNA_APP_ID=your_app_id
//   ADZUNA_APP_KEY=your_app_key  
//   MUSE_API_KEY=your_api_key (optional)
//

// === ADZUNA ===
// Volume: ~3-4M US jobs. 50 results/page. Paginated.
// Rate limit: Generous for free tier.
// Strategy: Broad category queries × 5 pages each = massive coverage

const ADZUNA_CATEGORIES = [
    'it-jobs', 'engineering-jobs', 'healthcare-nursing-jobs', 'accounting-finance-jobs',
    'sales-jobs', 'hr-jobs', 'marketing-jobs', 'admin-jobs', 'customer-services-jobs',
    'logistics-warehouse-jobs', 'manufacturing-jobs', 'scientific-qa-jobs',
    'legal-jobs', 'consultancy-jobs', 'energy-oil-gas-jobs', 'property-jobs',
    'teaching-jobs', 'trade-construction-jobs', 'travel-jobs'
];

const ADZUNA_LOCATIONS = [
    '', // nationwide
    'New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Houston',
    'Phoenix', 'Philadelphia', 'San Antonio', 'Dallas', 'Austin',
    'Seattle', 'Denver', 'Boston', 'Atlanta', 'Miami',
    'Washington DC', 'Minneapolis', 'Portland', 'Detroit', 'Charlotte'
];

async function fetchAdzunaPage(query, location, page) {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    if (!appId || !appKey) return [];

    let url = `https://api.adzuna.com/v1/api/jobs/us/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=50&content-type=application/json`;
    if (query) url += `&what=${encodeURIComponent(query)}`;
    if (location) url += `&where=${encodeURIComponent(location)}`;
    // Sort by date to get freshest listings
    url += '&sort_by=date&max_days_old=30';

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Adzuna ${res.status}`);
    const data = await res.json();

    return (data.results || []).map(job => ({
        id: 'adzuna-' + job.id,
        title: job.title || '',
        company: job.company?.display_name || '',
        location: job.location?.display_name || '',
        type: job.contract_time === 'full_time' ? 'Full Time' : job.contract_time === 'part_time' ? 'Part Time' : 'Full Time',
        url: job.redirect_url || '',
        salary: formatAdzunaSalary(job),
        description: (job.description || '').substring(0, 2000),
        tags: job.category ? [job.category.label] : [],
        source: 'Adzuna',
        sourceKey: 'adzuna',
        pubDate: job.created || '',
        latitude: job.latitude,
        longitude: job.longitude
    }));
}

function formatAdzunaSalary(job) {
    if (job.salary_min && job.salary_max) {
        return `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`;
    }
    if (job.salary_min && !job.salary_is_predicted) {
        return `$${(job.salary_min / 1000).toFixed(0)}k+`;
    }
    return '';
}

// Sync strategy: Rotate through categories + locations
// Each sync cycle: 10 category queries × 3 pages = 30 calls × 50 results = 1,500 jobs
// 4 sync cycles/day × 1,500 = 6,000 new jobs/day from Adzuna alone
// With location rotation: 20 locations × 10 categories × 3 pages = 600 calls = 30,000 jobs
// Budget per cycle to not overwhelm: 30 calls
async function syncAdzunaJobs(syncGroup) {
    const jobs = [];
    const cats = ADZUNA_CATEGORIES;
    const startIdx = (syncGroup % Math.ceil(cats.length / 5)) * 5;
    const batch = cats.slice(startIdx, startIdx + 5);
    
    // Pick 2 locations per sync (rotate through)
    const locIdx = (syncGroup % Math.ceil(ADZUNA_LOCATIONS.length / 2)) * 2;
    const locations = ADZUNA_LOCATIONS.slice(locIdx, locIdx + 2);
    if (!locations.includes('')) locations.unshift(''); // always include nationwide

    for (const cat of batch) {
        for (const loc of locations) {
            for (let page = 1; page <= 3; page++) {
                try {
                    const results = await fetchAdzunaPage(cat, loc, page);
                    jobs.push(...results);
                    // Rate limit protection
                    await new Promise(r => setTimeout(r, 200));
                } catch (e) {
                    console.warn(`Adzuna ${cat}/${loc}/p${page}:`, e.message);
                }
            }
        }
    }
    return jobs;
}


// === THE MUSE ===
// Volume: ~10-20K quality professional jobs
// 20 results/page, paginated. Free API.
// Strategy: Paginate through categories to get full inventory

const MUSE_CATEGORIES = [
    'Engineering', 'Data Science', 'Design', 'Marketing', 'Product',
    'Finance', 'HR', 'Sales', 'Business Operations', 'Customer Service',
    'Education', 'Editorial', 'Healthcare', 'Legal', 'Project Management',
    'Social Media', 'Science', 'Retail'
];

async function fetchMusePage(category, page) {
    const apiKey = process.env.MUSE_API_KEY || '';
    let url = `https://www.themuse.com/api/public/jobs?page=${page}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (apiKey) url += `&api_key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Muse ${res.status}`);
    const data = await res.json();

    return {
        jobs: (data.results || []).map(job => ({
            id: 'muse-' + job.id,
            title: job.name || '',
            company: job.company?.name || '',
            location: (job.locations || []).map(l => l.name).join(', ') || 'Various',
            type: job.type || 'Full Time',
            url: job.refs?.landing_page || '',
            salary: '',
            description: (job.contents || '').replace(/<[^>]+>/g, '').substring(0, 2000),
            tags: (job.categories || []).map(c => c.name),
            source: 'The Muse',
            sourceKey: 'themuse',
            pubDate: job.publication_date || ''
        })),
        pageCount: data.page_count || 0
    };
}

// Sync strategy: 6 categories × 5 pages = 30 calls = ~600 jobs per sync
// Rotate categories across sync groups to cover all 18 over 3 cycles
async function syncMuseJobs(syncGroup) {
    const jobs = [];
    const startIdx = (syncGroup % 3) * 6;
    const batch = MUSE_CATEGORIES.slice(startIdx, startIdx + 6);

    for (const cat of batch) {
        for (let page = 0; page < 5; page++) {
            try {
                const result = await fetchMusePage(cat, page);
                jobs.push(...result.jobs);
                if (page >= result.pageCount - 1) break; // No more pages
                await new Promise(r => setTimeout(r, 100));
            } catch (e) {
                console.warn(`Muse ${cat}/p${page}:`, e.message);
                break;
            }
        }
    }
    return jobs;
}


// ============================================================
// INTEGRATION INTO EXISTING SYNC FUNCTION
// ============================================================
// Add this to your existing sync handler in /api/jobs.js:
//
// In the main sync function where you call JSearch, Remotive, etc:
//
//   const [jsearchJobs, remotiveJobs, usajobsJobs, himalayasJobs, jobicyJobs, adzunaJobs, museJobs] = await Promise.all([
//       syncJSearchJobs(syncGroup).catch(e => { console.warn('JSearch sync failed:', e.message); return []; }),
//       syncRemotiveJobs().catch(e => { console.warn('Remotive sync failed:', e.message); return []; }),
//       syncUSAJobs(syncGroup).catch(e => { console.warn('USAJobs sync failed:', e.message); return []; }),
//       syncHimalayasJobs().catch(e => { console.warn('Himalayas sync failed:', e.message); return []; }),
//       syncJobicyJobs().catch(e => { console.warn('Jobicy sync failed:', e.message); return []; }),
//       syncAdzunaJobs(syncGroup).catch(e => { console.warn('Adzuna sync failed:', e.message); return []; }),
//       syncMuseJobs(syncGroup).catch(e => { console.warn('Muse sync failed:', e.message); return []; }),
//   ]);
//
//   const allJobs = [...jsearchJobs, ...remotiveJobs, ...usajobsJobs, ...himalayasJobs, 
//
// Update sourceCounts in meta/jobsSync:
//   sourceCounts: {
//       jsearch: jsearchJobs.length,
//       remotive: remotiveJobs.length,
//       usajobs: usajobsJobs.length,
//       himalayas: himalayasJobs.length,
//       jobicy: jobicyJobs.length,
//       adzuna: adzunaJobs.length,
//       themuse: museJobs.length,
//   }

// ============================================================
// VERCEL ENVIRONMENT VARIABLES TO ADD
// ============================================================
// In Vercel dashboard → Settings → Environment Variables:
//
// ADZUNA_APP_ID     = (from developer.adzuna.com registration)
// ADZUNA_APP_KEY    = (from developer.adzuna.com registration)
// MUSE_API_KEY      = (from themuse.com/developers registration — optional)

// ============================================================
// EXPECTED VOLUME IMPROVEMENT
// ============================================================
// Before (5 sources):
//   JSearch: ~2,000-3,000/day (rate limited to 10K calls/month)
//   Remotive: ~200-400 (small inventory, remote-only)
//   USAJobs: ~500-1,000 (government only)
//   Himalayas: ~100-300 (small, remote-only)
//   Jobicy: ~100-200 (small, remote-only)
//   TOTAL: ~3,000-5,000 unique jobs in database
//
// After (8 sources):
//   + Adzuna: ~5,000-15,000/week (3-4M US inventory, broad queries)
//   + The Muse: ~1,000-2,000/week (quality professional roles)
//   TOTAL: ~15,000-30,000 unique jobs within first week
//   TOTAL: ~40,000-60,000 within first month (with rotation)
//
// through the back door. Adzuna has massive US inventory with good
// filtering and salary data.

module.exports = {
    syncAdzunaJobs,
    syncMuseJobs,
    fetchAdzunaPage,
    fetchMusePage,
    ADZUNA_CATEGORIES,
    MUSE_CATEGORIES
};
