# Blueprint™ Architecture Quick Reference
## As of v4.39.0.0 — February 23, 2026

### Stack
- **Frontend**: Single-file `index.html` (~27,570 lines), vanilla JS, D3.js network graph
- **Hosting**: Vercel Pro (vercel.json config)
- **Auth**: Firebase Auth (Google provider, email/password)
- **Database**: Firestore (users, analytics_events, jobs, meta collections)
- **CDN**: Cloudflare (DNS + SSL)
- **Domain**: myblueprint.work
- **API Proxy**: Vercel serverless functions (`/api/ai.js`, `/api/jobs.js`, `/api/jobs-sync.js`)
- **Client Libs**: D3.js 7.9, jsPDF 2.5.1, JSZip 3.10.1, PapaParse 5.4.1

### Key Data Structures
```javascript
// userData — the core profile object
userData = {
  profile: { name, email, currentTitle, location, ... },
  skills: [{ name, level, category, key, roles, evidence }],
  roles: [{ id, name, color }],
  values: [{ name, selected }],
  purpose: "string",
  workHistory: [{ title, company, location, description, startDate, endDate }],
  education: [{ school, degree, field, startDate, endDate, activities }],
  certifications: [{ name, authority, licenseNumber, startDate, endDate, url }],
  savedJobs: [{ id, title, company, rawText, parsedSkills, matchData, ... }],
  templateId: 'firestore-{uid}' // or template name for demos
};

// skillsData — mirrors userData for D3 rendering
skillsData = { skills: [...], roles: [...] };

// blueprintData — derived/inferred data
blueprintData = { values: [...], outcomes: [...], purpose: '' };
```

### Auth & Mode System
- `fbUser` — Firebase auth user object (null if not signed in)
- `fbIsAdmin` — boolean, checked against Firestore users doc `role: 'admin'`
- `appContext.mode` — 'live' (normal) or 'demo' (viewing sample profile)
- `isReadOnlyProfile` — true when non-admin views sample profile
- `appMode` — 'demo' | 'waitlisted' | 'invited' | 'active'

### Profile Loading Flow
1. `initializeApp()` — loads manifest, fetches all 24 demo profile JSONs
2. If signed in: `loadUserFromFirestore(uid)` — returns user's data or empty
3. If demo data detected (by role names): auto-clears contamination
4. `_profileExplicitlySelected = true` for signed-in users
5. Route to hash target or default to Blueprint tab

### Demo Mode Flow
1. `enterDemoMode(templateId)` — snapshots current user data
2. `loadTemplate(templateId)` — loads demo profile + injects sample jobs
3. `appContext.mode = 'demo'` — blocks Firestore saves
4. Banner shows with exit link
5. `exitDemoMode()` — restores snapshot, navigates to Blueprint

### Onboarding Wizard (v4.39.0.0)
Three-path profile builder triggered for new/empty profiles:

**Path A: Resume Upload** (existing)
- Paste text or LinkedIn text → Claude AI parse → structured profile
- Cost: ~$0.02-0.05 per parse

**Path B: LinkedIn Data Import** (new)
- User uploads GDPR data archive (.zip) from LinkedIn Settings
- Client-side parsing: JSZip extracts → PapaParse reads CSVs
- Files parsed: Profile.csv, Positions.csv, Skills.csv, Education.csv, Certifications.csv
- Optional Claude call for skill level inference (~$0.01)
- Privacy: Entire .zip parsed in browser, no data sent to servers during CSV parse
- Cost: $0 (CSV parse) + ~$0.01 (optional skill inference)

**Path C: Manual Entry**
- Step-by-step guided form

All paths converge at Step 4 (Profile Review) → Skills → Values → Purpose → Complete

### Key Functions
- `switchView(view)` — main navigation (network, opportunities, blueprint, reports, settings, admin)
- `switchProfile(templateId)` — routes to enterDemoMode for signed-in users
- `showOnboardingWizard()` — launches the multi-step profile builder
- `wizardParseLinkedInZip(file)` — core LinkedIn .zip parser (JSZip + PapaParse + Claude inference)
- `renderJobSelectorWidget()` — inline pill + fixed dropdown in controls bar
- `activateJobOverlay(idx)` — enables You/Job/Match/Values network overlay
- `saveToFirestore()` — saves to Firestore (guarded: blocks in demo mode, blocks sample data)
- `getSampleJobsForProfile(templateId, template)` — generates 3 calibrated demo jobs per character

### Serverless Functions
- `/api/ai.js` — Anthropic API proxy (Firebase token auth, rate limiting)
- `/api/jobs.js` — Live job search proxy (JSearch, Remotive, USAJobs, Himalayas, Jobicy)
- `/api/jobs-sync.js` — Cron job: syncs jobs to Firestore every 6h (CRON_SECRET auth)

### Environment Variables (Vercel)
- `ANTHROPIC_API_KEY` — Claude API
- `RAPIDAPI_KEY` — JSearch
- `FIREBASE_SERVICE_ACCOUNT` — Full JSON service account for admin SDK
- `CRON_SECRET` — Bearer token for cron endpoint
- `USAJOBS_API_KEY` / `USAJOBS_EMAIL` — Not yet configured

### Version Convention
- Format: `v{major}.{minor}.{patch}.{micro}`
- ALWAYS bump on every deployment
- Check: HTML comment, JS boot constant, console banner, About modal
- Grep all references before delivering
