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
Current: check `BP_VERSION` in `index.html` (line ~1506). Bump in 3 places: line 1 HTML comment, JS block comment, `BP_VERSION` variable.

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

## Key Features
- Work Blueprint Wizard (JD → structured WB conversion)
- WB Repository (CRUD, Clone, Compare)
- Blueprint Advantage™ Compare (structured WB vs raw JD matching)
- 6-pass ontology matching engine
- 43K skill library with category bridging
- Admin skill blocklist (Firestore-backed)
- AI content generation with full role context
