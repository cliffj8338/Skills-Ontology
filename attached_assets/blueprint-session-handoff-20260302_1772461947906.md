# Blueprint Session Handoff — March 2, 2026

**Current version:** v4.45.83
**Sessions covered:** v4.45.75 → v4.45.83

---

## Completed Work

### 1. Job Schema v2.0 — Phase 1 (v4.45.77) ✅

Standards-aligned job schema replacing flat `parsedSkills[]` with structured `requirements.skills[]`.

**What shipped:**
- `JOB_SCHEMA_VERSION = '2.0'` constant, `JOB_SKILLS_CAP = 50`
- `migrateJobToV2()` — non-destructive migration, builds full v2 structure (hiringOrganization, compensation, postingMeta, requirements, raw, pipeline) while preserving legacy fields
- `migrateAllJobsToV2()` — runs on Firestore load, auto-persists
- `getJobSkills(job)` — abstraction layer so all callers read v2 transparently
- `normalizeTier()` / `tierWeight()` — canonical tier handling
- `validateJobSchema()` — runtime shape checker

**Updated callers (8 functions):** matchJobToProfile, rescoreAllJobs, rescoreOneJob, analyzeJob, reanalyzeJob, addRemoteJobToPipeline, initJobNetwork, showAdminBlocklistInContext, scouting report jobRequiredNames

**Critical bug fix:** Blocklisted gaps now stay in the match denominator. Before: 2 matched / 2 visible = 100% when 3 gaps were blocklisted. After: earned / (matched + visible gaps + blocklisted weight) = correct score.

**Schema alignment:** Schema.org JobPosting properties, JDX JobSchema+ competency model (tier/proficiency/category/source/confidence/frameworkRef), O*NET-SOC crosswalk readiness.

---

### 2. Job Schema v2.0 — Phase 2: API Extraction (v4.45.78) ✅

Rewrote the Claude API extraction prompt to output v2-native skill objects.

**What shipped:**
- 10 skill categories: technical, analytical, strategic, leadership, communication, domain, platform, tool, methodology, soft
- Section-aware extraction with tier assignment from JD structure (requirements section → required, preferred section → preferred, etc.)
- Compound list splitting (e.g., "MS Word, Excel, PowerPoint" → 3 separate skills)
- Domain knowledge extraction (insurance claims, reinsurance, etc.)
- `source: extracted|inferred` with confidence differential (0.85 extracted, 0.55 inferred)
- Identity metadata extraction: location, remote status, industry, department, employmentType
- Qualifications and responsibilities as structured arrays
- JD text cap raised to 6000 chars, max_tokens to 4000
- UI: metadata badges, section tooltips, inferred skill indicators, extraction quality summary

**Test result (Mission Underwriting JD):** Extraction improved from 5 skills → 30 skills. Match dropped from 96% (inflated) → 59% (realistic). 14 matched, 9 gaps identified.

---

### 3. URL Fetch for Job Postings (v4.45.79–83) ✅

Added "Fetch & Analyze" button to the Add Job modal. Paste a URL from any ATS page, fetch the content server-side, extract text, analyze.

**Architecture (final, as fixed by Replit in v4.45.83):**

Three-strategy fallback chain in `fetchJobPageText()`:

1. **Strategy 1: Firebase Cloud Function** (`https://fetchjobpage-oiewslfoua-uc.a.run.app`) — authenticated via Firebase ID token, domain allowlist, CORS handled via `cors` npm middleware
2. **Strategy 2: Vercel API proxy** (`/api/api-job-proxy`) — same-origin, no CSP/CORS issues, includes `extractTextFromHtml()` and `extractSPAJobData()` for SPA content
3. **Strategy 3: Direct CORS fetch** — fallback for sites with permissive headers

**Cloud Function details:**
- Firebase 2nd Gen (Cloud Run), Node.js 22, `us-central1`
- `invoker: "public"` (auth verified in code via Firebase ID token)
- Domain allowlist: Rippling, Greenhouse, Lever, Workable, Ashby, iCIMS, Workday, LinkedIn, Indeed, Glassdoor, ZipRecruiter, Wellfound, BuiltIn, Dice, Monster, SmartRecruiters, BambooHR, Jobvite, Phenom, USAJobs, GovernmentJobs, Breezy, Recruitee
- Smart pattern matching: hostnames containing "career", "job", "recruit" auto-allowed

**CSP updates:** Both HTML meta tag and vercel.json synced with `*.run.app`, `*.cloudfunctions.net`, and all job board domains.

**Note on Puppeteer:** Multiple attempts to run headless Chrome on Cloud Run failed (binary version mismatches, `@sparticuz/chromium` not resolving). Replit solved this by adding the Vercel API proxy as Strategy 2, which handles SPA-rendered pages without needing a browser.

---

### 4. Add Job Modal Redesign (v4.45.79) ✅

- URL-first layout: "Job Posting URL" field at top with "Fetch & Analyze" button
- "or paste text directly" separator with JD text area below
- Loading indicator with "Fetching & rendering page... This may take 10-20 seconds"
- Graceful fallback messaging: "Could not fetch that page. The site may require JavaScript rendering. Try pasting the job description text below."

---

### 5. Bug Fixes (v4.45.75–76) ✅

- **Negotiation guide mastery count:** Fixed data source priority in `renderInlineNegotiation()` and `showNegotiationGuide()`
- **Scouting report D3 filtering:** Fixed job match tab showing fewer matched skills than overlay by correcting data source priority (jobAllSet vs jobRequiredSet) and D3 node filtering logic
- **Card view grid layout:** Fixed grid width constraints and mobile responsive improvements (v4.45.83)

---

## Pending Work

### Job Schema v2.0 — Phase 3: Local Parser Improvements (Not Started)

`parseJobLocally()` is the bottleneck for jobs found via the search pipeline (which never hits the API). Currently extracts ~8 skills from a JD with 22+ available.

**Planned work:**
- Section detection ("Qualifications", "What you'll do", "Preferred Qualifications", "Requirements")
- Bullet-aware extraction (each bullet = likely distinct skill)
- Compound term splitting ("MS Word, Excel, PowerPoint" → 3 skills)
- Output v2 schema format with `ingestMethod: "local"`, lower confidence values
- Run same normalize + framework alignment steps as API path

**Impact:** This is the highest-impact remaining work. The Find Jobs search tab, remote job pipeline, and re-analyze without API key all use this path.

---

### Job Schema v2.0 — Phase 4: Cleanup (Not Started)

- Remove `quickScoreJob` (legacy fallback)
- Remove `matchData` from job storage (compute on demand)
- Remove BLS-only salary path (unify into `compensation.estimatedSalary`)
- Add re-ingest capability: re-run API extraction on jobs that were originally locally parsed

---

### Known Bugs (Identified During v4.45.78 Testing)

**1. Title extraction grabs section headings**
The API prompt sometimes extracts "What you'll do" as the job title instead of the actual title. Needs guard logic in the prompt or post-processing to reject common section headings.

**2. BLS mismatch on some roles**
Mission Underwriting "Manager, Program Success" matched to "Makeup Artists, Theatrical and Performance" (SOC mismatch). The `matchJobToBLS()` keyword matching needs improvement for compound role titles.

**3. Noise gaps from qualification language**
"geometry", "algebra", "meet deadlines", "Journals", "Dependability" extracted as skill gaps. These are qualification prerequisites or soft traits, not skills. The blocklist catches some, but the extraction prompt needs tighter filtering for qualification-section content.

---

### Cloud Function Maintenance

**Location:** `~/blueprint-functions/functions/` on local machine
**Deployed to:** `https://fetchjobpage-oiewslfoua-uc.a.run.app`
**Firebase project:** `work-blueprint`

The Cloud Function currently uses simple HTTP fetch (no Puppeteer). It works for server-rendered ATS pages but returns empty shells for SPAs like Rippling. The Vercel API proxy (Strategy 2) handles SPA pages. If you want full SPA support in the Cloud Function itself, you'd need to either:
- Use a headless browser service (Browserless.io, ScrapingBee) instead of self-hosted Puppeteer
- Or accept the current setup where Strategy 2 handles SPAs

**Deploy command:**
```bash
cd ~/blueprint-functions
firebase deploy --only functions:fetchJobPage
```

---

## File Inventory

| File | Location | Purpose |
|------|----------|---------|
| `index.html` | GitHub repo root | Main app (v4.45.83) |
| `vercel.json` | GitHub repo root | CSP headers, Vercel config |
| `functions/index.js` | `~/blueprint-functions/functions/` | Cloud Function source |
| `functions/package.json` | `~/blueprint-functions/functions/` | Cloud Function deps |
| `firebase.json` | `~/blueprint-functions/` | Firebase config (nodejs22 runtime) |
| `blueprint-job-schema-v2.md` | Previously delivered | Full schema specification |

---

## Version History This Session

| Version | Date | Changes |
|---------|------|---------|
| v4.45.75 | 2026-03-01 | Dashboard reorder, inline negotiation, purpose→content tab |
| v4.45.76 | 2026-03-01 | Negotiation mastery count fix, scouting D3 filter fix |
| v4.45.77 | 2026-03-01 | Job Schema v2.0 Phase 1: schema, migration, matcher, denominator fix |
| v4.45.78 | 2026-03-01 | Job Schema v2.0 Phase 2: API extraction prompt rewrite |
| v4.45.79 | 2026-03-01 | Add Job modal redesign (URL-first), extraction bug fixes |
| v4.45.80 | 2026-03-01 | Cloud Function deployment, CSP updates |
| v4.45.81 | 2026-03-01 | Cloud Run URL fix, CSP sync |
| v4.45.82 | 2026-03-02 | Puppeteer attempt, 45s client timeout |
| v4.45.83 | 2026-03-02 | Replit: Vercel API proxy, card view grid fix, mobile responsive |

---

## Priority Recommendations

1. **Phase 3 (local parser)** — Highest impact. Fixes the search pipeline extraction quality without requiring API keys.
2. **Title extraction bug** — Quick prompt fix. Add section heading rejection list.
3. **BLS matching** — Medium priority. Improve keyword matching for compound role titles.
4. **Noise gap filtering** — Ongoing. Can be addressed through blocklist or prompt refinement.
5. **Phase 4 (cleanup)** — Low urgency. Technical debt reduction.
