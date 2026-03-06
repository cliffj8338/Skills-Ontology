# Blueprint™

Career intelligence web app at myblueprint.work. Modular Vite-based frontend + Firebase Auth/Firestore backend, deployed via Vercel from GitHub (cliffj8338/blueprint).

## Architecture
- **Frontend**: Vite-built modular SPA. Entry: `index.html` (1,241-line shell) → `src/main.js` → modular ES modules in `src/`. `legacy.js` (46K-line monolith) loaded alongside for backward compatibility.
- **Backend**: Firebase Auth + Firestore for user data, Vercel serverless functions for API proxying
- **Deployment**: Vercel auto-deploys from GitHub `main` branch. Runs `vite build` → `dist/`.
- **Dev server**: `npm run dev` (Vite dev server on port 5000 with HMR)
- **Dual-load pattern**: `index.html` loads `legacy.js` (regular script) AND `src/main.js` (ES module). Legacy runs its own DOMContentLoaded with `initializeApp()`. Module DOMContentLoaded is gated by `window._legacyInitComplete` to prevent double init.

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
- `legacy.js` — Old monolith (kept for backward compat, loaded alongside modules)
- `vite.config.js` — Vite build config with manual chunk splitting
- `vercel.json` — Vercel deployment config, CSP headers, rewrites

## Key Data Files
- `skills/index-v4.json` — 43K+ skill library (ESCO, Lightcast, O*NET, trades)
- `onet-impact-ratings.json` — O*NET impact ratings with `marketScarcity` per skill
- `certifications/lightcast-certs.json` — 1,583 certification credentials
- `profiles/demo/` — Demo candidate profiles (24 characters)
- `bls-wages.json` — BLS wage data (831 occupations)
- `companies.json` — Company values (58 companies)

## Version
Current: v4.46.25. Single source of truth: `src/core/constants.js` (`BP_VERSION` + `BP_BUILD`). Also update `package.json` version field. Legacy.js header version is informational only.

**UNBREAKABLE VERSION RULE**: Update BP_VERSION in ALL 5 places: `src/core/constants.js` (BP_VERSION + BP_BUILD), `package.json` version, `legacy.js` line ~1083 JS comment, `legacy.js` line ~1084 `var BP_VERSION`, and `legacy.js` line 1 HTML comment, and `index.html` version comment.

## Architecture Hardening (v4.46.25)
- **Stubs**: All 30+ unmigrated function stubs in `src/` now `console.warn` + `return null` instead of throwing
- **Data-ready Promise**: `window._userDataReady` Promise created in legacy.js, resolved at all `userData.initialized = true` points. Views use `waitForUserData()` from `src/core/data-helpers.js` instead of setInterval polling
- **Shared helpers**: `_sd()` and `_bd()` deduplicated from 7 view files into `src/core/data-helpers.js`
- **Double-init gate**: `window._legacyInitComplete` flag set by legacy.js; module DOMContentLoaded in network.js skips if set
- **window.templates**: Both `window._templates` and `window.templates` exposed in legacy.js for nav.js compatibility

## Proficiency Color Palette
Gradient from cool to warm to green (achievement): Novice `#94a3b8` (slate) → Proficient `#60a5fa` (blue) → Advanced `#a78bfa` (purple) → Expert `#fb923c` (orange) → Mastery `#10b981` (green). Red `#ef4444` is ONLY for errors/problems. Yellow `#fbbf24` for caution/warnings.

## Skills Card View (v4.46.24)
Rarity-based grouping using O*NET `marketScarcity` data:
- **Rare** (amber theme): Market differentiators. `getSkillImpact(skill).marketScarcity === 'rare'`
- **Uncommon** (blue/purple theme): Competitive advantages. `marketScarcity === 'uncommon'`
- **Common** (neutral theme): Foundational capabilities. `marketScarcity === 'common'`
- Unique skills default to "uncommon" unless `skill.userAssessment.rarity` is set
- Fallback: maps `impact.level` (critical/high → rare, moderate → uncommon, standard/supplementary → common) when `marketScarcity` unavailable
- Each tier shows: header with icon/count/description, stats bar (proficiency breakdown, evidence coverage, verified count), then skill cards in grid layout
- Skill cards: two-line layout with level badge + impact + rarity pill + role alignment
- Sorting within tiers: core first, then proficiency level descending, then alphabetical

## Git
Token embedded in remote URL. Push: `git add -A && git commit -m "..." && git push origin main`

## Job Schema v2.0
- `JOB_SCHEMA_VERSION = '2.0'`, `JOB_SKILLS_CAP = 50`
- Pipeline jobs must have `matchData` (object with `.score`, `.matched`, `.gaps`, `.surplus`) and `parsedSkills` (array)

## Job Sources (7 active)
JSearch (RapidAPI), Remotive, USAJobs, Himalayas, Jobicy, Adzuna, The Muse.

## Key Features
- Work Blueprint Wizard (JD → structured WB conversion)
- WB Repository (CRUD, Clone, Compare)
- Blueprint Advantage™ Compare (structured WB vs raw JD matching)
- 6-pass ontology matching engine with confidence penalty
- 43K skill library with category bridging
- AI content generation with full role context
- Skills Card View: rarity-based grouping with market intelligence
- Fit For Me: persistent results with manual refresh
