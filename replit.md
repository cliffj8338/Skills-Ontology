# Blueprint™

Career intelligence web app at myblueprint.work. Static HTML/JS frontend + Firebase Auth/Firestore backend, deployed via Vercel from GitHub (cliffj8338/blueprint).

## Architecture
- **Frontend**: Single-page app in `index.html` (~41K lines) + `index_part2.js` (~2K lines)
- **Backend**: Firebase Auth + Firestore for user data, Vercel serverless functions for API proxying
- **Deployment**: Vercel auto-deploys from GitHub `main` branch
- **Dev server**: `serve . -p 5000` (static file server)

## Key Files
- `index.html` — Main application (all UI, matching engine, WB wizard, comparison engine)
- `index_part2.js` — Job analysis, matching functions, opportunity finder
- `firestore.rules` — Firestore security rules (v1.5)
- `api/api-job-proxy.js` — Vercel serverless CORS proxy for job APIs + ATS page fetching
- `skills/index-v4.json` — 43K+ skill library (ESCO, Lightcast, O*NET, trades)
- `certifications/lightcast-certs.json` — 1,583 certification credentials
- `profiles/demo/` — Demo candidate profiles (24 characters)
- `profiles/demo/comparison-candidate.json` — Alex Morgan profile for Blueprint Advantage comparison
- `vercel.json` — Vercel deployment config, CSP headers, rewrites

## Version
Current: v4.46.2. Check `BP_VERSION` in `index.html` (line ~1647). **UNBREAKABLE RULE**: Every file change that requires a deploy MUST bump the version in ALL 3 places — even if index.html itself has no other changes: line 1 HTML comment, JS block comment, `BP_VERSION` variable.

## Proficiency Color Palette (v4.45.98)
Gradient from cool to warm to green (achievement): Novice `#94a3b8` (slate) → Proficient `#60a5fa` (blue) → Advanced `#a78bfa` (purple) → Expert `#fb923c` (orange) → Mastery `#10b981` (green). Red `#ef4444` is ONLY for errors/problems. Yellow `#fbbf24` for caution/warnings. Applied across 12+ `levelColors` definitions in index.html.

## Skills/Verify Tile Layout (v4.45.96)
All three skill views use CSS Grid card tiles instead of inline rows:
- **Card View** (`initCardView`): Rarity-grouped tiers (Rare/Uncommon/Common) with `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`. Each tile shows skill name, level badge, icon badges (★ core, shield verified, ✓ evidence, ⚠ gap, category icons), impact indicator, and role alignment. Legend bar at top.
- **Skills List** (`renderSkillsManagementTab`): Same rarity tiers with `minmax(280px, 1fr)` grid. Tiles include edit/remove buttons with `event.stopPropagation()`.
- **Verify Tab** (`renderVerificationsTab`): Verified skills as card tiles with verifier avatar, credibility weight, and date. Pending requests and unverified skills also use grid layouts.

## Git
Token embedded in remote URL. Push: `git add -A && git commit -m "..." && git push origin main`

## URL Fetch Architecture
The "Add a Job" URL fetch uses a 3-strategy cascade:
1. **Firebase Cloud Function** (Puppeteer, handles JS-rendered SPAs) — requires sign-in
2. **Vercel API proxy** (`/api/api-job-proxy?source=page&url=...`) — same-origin, no CSP issues
3. **Direct fetch** — only works for CORS-permissive sites

SPA extraction handles: JSON-LD JobPosting, __NEXT_DATA__ (Rippling, Greenhouse), React hydration blobs, meta tag fallback.

## Job Schema v2.0
- `JOB_SCHEMA_VERSION = '2.0'`, `JOB_SKILLS_CAP = 50`
- v2 skill objects: `{ name, canonical, tier, proficiency, category, section, source, confidence, frameworkRef }`
- Phase 1: Schema, migration (`migrateJobToV2`), `getJobSkills()` abstraction, `tierWeight()` scoring
- Phase 2: AI extraction prompt (10 categories, section-aware, compound splitting)
- Phase 3 (v4.45.84): `parseJobLocally()` rewrite — section detection (Requirements/Preferred/Responsibilities/About/Benefits), bullet-aware extraction, compound term splitting ("X, Y, and Z" → individual skills), slash-separated terms, v2 schema output with section/tier/confidence, raised cap from 30 → 50
- Phase 4 (v4.45.87): Parser overhaul — expanded skill dictionary (300+ terms across insurance, finance, healthcare, legal, supply chain, consulting, education, real estate, energy, government), stem-variant matching (Pass 3b: negotiate→negotiation, strategic→strategy, etc.), contextual noun-phrase extraction (Pass 3c: extracts multi-word skill phrases from sentence context, validated against skill library)

## Job Sources (7 active)
JSearch (RapidAPI), Remotive, USAJobs, Himalayas, Jobicy, Adzuna, The Muse.
Jooble was removed in v4.45.89 — its API only returns text snippets (not full JDs), producing unreliable skill parsing and inflated match scores.

## Key Features
- Work Blueprint Wizard (JD → structured WB conversion)
- WB Repository (CRUD, Clone, Compare)
- Blueprint Advantage™ Compare (structured WB vs raw JD matching)
- 6-pass ontology matching engine with confidence penalty (jobs with <5 skills parsed get score discount)
- Low-confidence indicators on Fit For Me results (⚠ limited data label)
- 43K skill library with category bridging
- Admin skill blocklist (Firestore-backed at `meta/skillBlocklist`)
- Admin approved skills dictionary (Firestore-backed at `meta/parserApprovedSkills`) — curated terms injected into parser via word-boundary matching
- Parse Audit skill curation — action buttons (+/x) on missed/recommended terms to approve or block directly from audit results
- AI content generation with full role context
- Skills Card View: rarity-based grouping (Rare/Uncommon/Common tiers from O*NET market scarcity data), two-line skill cards with level badge + impact + rarity pill + role alignment, tier summary stats (proficiency breakdown, evidence coverage, verified count)
