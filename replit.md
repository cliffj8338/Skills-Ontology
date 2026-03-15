# Blueprint™

Career intelligence web app at myblueprint.work. Modular Vite-based frontend + Firebase Auth/Firestore backend, deployed via Vercel from GitHub (cliffj8338/blueprint).

## Architecture
- **Frontend**: Vite-built modular SPA. Entry: `index.html` (1,241-line shell) → `src/main.js` → modular ES modules in `src/`. `public/app-core.js` (formerly legacy.js) loaded alongside for backward compatibility.
- **Backend**: Firebase Auth + Firestore for user data, Vercel serverless functions for API proxying
- **Deployment**: Vercel auto-deploys from GitHub `main` branch. Runs `vite build` → `dist/`.
- **Dev server**: `npm run dev` (Vite dev server on port 5000 with HMR)
- **Dual-load pattern**: `index.html` loads `public/app-core.js` (regular script) AND `src/main.js` (ES module). Legacy runs its own DOMContentLoaded with `initializeApp()`. Module DOMContentLoaded is gated by `window._legacyInitComplete` to prevent double init.
- **CRITICAL: Module MUST override legacy**: All wizard functions in `src/views/welcome.js` use unconditional `window.X = X` (NOT `if (!window.X)`) so the module version always wins. The legacy `initializeMainApp()` in `app-core.js`/`legacy.js` must NOT re-assign wizard window globals — those lines were removed in v4.46.98 to prevent the Firebase auth callback from clobbering module overrides.

## Project Structure
- `src/core/constants.js` — Single source of truth for `BP_VERSION`, `BP_BUILD`
- `src/core/security.js` — Sanitization, escaping, `debouncedSave()`
- `src/core/firebase.js` — Firebase init, auth, Firestore read/write
- `src/core/analytics.js` — Tracking, funnel analytics
- `src/core/data-helpers.js` — Shared `_sd()`, `_bd()` data accessors, `waitForUserData()` Promise
- `src/views/network.js` — Skills network view + Card View (`initCardView`)
- `src/views/jobs.js` — Job search, pipeline, Fit For Me
- `src/views/blueprint.js` — Blueprint view
- `src/views/applications.js` — Applications, skill impact, WB features
- `src/views/welcome.js` — Landing page, onboarding
- `src/views/settings.js` — User settings
- `src/views/reports.js` — Reports generation
- `src/engine/match.js` — 6-pass matching engine
- `src/engine/job-analysis.js` — Job parsing
- `src/engine/skill-library.js` — 43K skill library loader
- `src/engine/crosswalk.js` — O*NET crosswalk
- `src/engine/certifications.js` — Certification library
- `src/ui/nav.js` — Navigation, routing
- `src/ui/icons.js` — SVG icon system (`bpIcon`)
- `src/ui/toast.js` — Toast notifications
- `public/app-core.js` — Main application logic (formerly legacy.js monolith)
- `legacy.js` — Root HTML monolith (kept for reference, not served)
- `vite.config.js` — Vite build config with manual chunk splitting
- `vercel.json` — Vercel deployment config, security headers, CSP, rewrites
- `scripts/count-lines.js` — Build-time script that counts source lines and writes `public/build-stats.json`
- `public/build-stats.json` — Auto-generated: lineCount, jsLines, htmlLines, cssLines, fileCount, totalDeploys, version, buildDate

## API Endpoints
- `api/ai.js` — AI proxy (Firebase auth required, rate limited)
- `api/job-search.js` — Multi-source job aggregator (7 sources)
- `api/api-job-proxy.js` — CORS proxy for ATS page fetching (domain allowlisted, SSRF-hardened)
- `api/verify.js` — Skill verification (token-based, rate limited, CORS restricted)
- `api/jobs-sync.js` — Background job sync
- `api/jobs-sources-additions.js` — Adzuna/Muse sync helpers

## Key Data Files
- `skills/index-v4.json` — 43K+ skill library (ESCO, Lightcast, O*NET, trades)
- `onet-impact-ratings.json` — O*NET impact ratings with `marketScarcity` per skill
- `certifications/lightcast-certs.json` — 1,583 certification credentials
- `profiles/demo/` — Demo candidate profiles (24 characters)
- `profiles/demo-assets/negotiation-guides.json` — Pre-built static negotiation guides for all 24 demo profiles (zero API calls in demo mode)
- `bls-wages.json` — BLS wage data (831 occupations)
- `companies.json` — Company values (58 companies)

## Version
Current: v4.46.98. Single source of truth: `src/core/constants.js` (`BP_VERSION` + `BP_BUILD`). Also update `package.json` version field.

**UNBREAKABLE VERSION RULE**: Update BP_VERSION in ALL 5 places: `src/core/constants.js` (BP_VERSION + BP_BUILD), `package.json` version, `public/app-core.js` comment + var, `legacy.js` comment + var, and `index.html` version comment.

## Security Hardening (v4.46.90)
- **Security Headers (vercel.json)**: HSTS, X-Frame-Options SAMEORIGIN, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy, CSP. API responses get `no-store` cache control.
- **CSP**: Restricts scripts to self + Firebase/Google/CDN, blocks object/embed, restricts connect-src to Firebase + self.
- **API CORS**: All APIs use allowlisted origins (myblueprint.work, www.myblueprint.work, localhost). `verify.js` moved from wildcard `*` to explicit allowlist.
- **Rate Limiting**: `verify.js` and `ai.js` have per-IP/per-UID rate limiting (in-memory Map, resets on cold start).
- **Input Validation**: `verify.js` validates uid format (`[a-zA-Z0-9_-]{1,128}`), token format (`vrf-` prefix), response values (whitelist), and sanitizes all output strings.
- **SSRF Protection**: `api-job-proxy.js` uses domain allowlist + regex, blocks internal/private IPs, uses `redirect: 'manual'` to prevent redirect-based SSRF.
- **XSS**: All user-controlled innerHTML uses `escapeHtml()` and `escapeAttr()`. No eval/Function usage.

## Stability Hardening (v4.46.90)
- **Error handlers**: `window.onerror` + `unhandledrejection` catch all runtime errors and log incidents.
- **Promise safety**: All `.then()` chains have `.catch()` handlers — no unhandled rejections.
- **DOM null guards**: All `querySelector` results checked before use. Modal elements guarded against null.
- **Firestore retry**: `saveToFirestore` retries 3x with exponential backoff.
- **localStorage wrapper**: `safeGet()`/`safeSet()`/`safeRemove()` handle quota exceeded + private browsing.

## Performance (v4.46.90)
- **Console banner**: Only shown in localhost dev mode, suppressed in production.
- **Verbose debug logs**: Removed from comparison engine hot paths.
- **52 event listeners / 9 removeEventListeners**: Potential leak area for future cleanup.
- **3.2MB app-core.js**: Monolith size; code splitting would require full refactor.

## Proficiency Color Palette
Gradient from cool to warm to green (achievement): Novice `#94a3b8` (slate) → Proficient `#60a5fa` (blue) → Advanced `#a78bfa` (purple) → Expert `#fb923c` (orange) → Mastery `#10b981` (green). Red `#ef4444` is ONLY for errors/problems. Yellow `#fbbf24` for caution/warnings.

## Git
Token embedded in remote URL. Push: `git add -A && git commit -m "..." && git push origin main`

## Job Schema v2.0
- `JOB_SCHEMA_VERSION = '2.0'`, `JOB_SKILLS_CAP = 50`
- Pipeline jobs must have `matchData` (object with `.score`, `.matched`, `.gaps`, `.surplus`) and `parsedSkills` (array)

## Job Sources (7 active)
JSearch (RapidAPI), Remotive, USAJobs, Himalayas, Jobicy, Adzuna, The Muse.

## Dev Velocity Auto-Stats
`scripts/count-lines.js` runs at `prebuild` (before `vite build`) and writes `public/build-stats.json`. Runtime loads this JSON to auto-compute:
- **Lines of Code**: Real count from src/ + api/ + public/ + index.html + blueprint.css
- **Deploys**: Deterministic from version number (stored in build-stats.json)
- **AI Sessions**: Derived from deploy count (1 deploy ≈ 1 AI session)
- **Features Shipped**: Counted from `ROADMAP_DATA.phases[].items` with `status: 'done'`
- **Calendar Time / Speed / Cost multipliers**: Computed from firstCommit date and other stats
Only 4 manual fields remain in Edit Stats modal: Project Start Date, Avg Session Hours, AI Sub $/mo, Hosting $/mo

## Key Features
- Work Blueprint Wizard (JD → structured WB conversion)
- WB Repository (CRUD, Clone, Compare)
- Blueprint Advantage™ Compare (structured WB vs raw JD matching)
- 6-pass ontology matching engine with confidence penalty
- 43K skill library with category bridging
- AI content generation with full role context
- Skills Card View: rarity-based grouping with market intelligence
- Fit For Me: persistent results with manual refresh
