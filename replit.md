# Blueprint — Career Intelligence App

## Overview
Blueprint is a single-page career intelligence web application. It visualizes skills, reveals market value, and connects users to matching jobs. Originally hosted on Vercel with Firebase backend.

## Architecture
- **Frontend**: Single-file `index.html` (~31,600 lines), vanilla JavaScript, D3.js network graph
- **Auth**: Firebase Auth (Google provider, email/password) — project: `work-blueprint`
- **Database**: Firestore (users, analytics_events, jobs, meta, reports, waitlist collections)
- **API**: Vercel serverless functions in `/api/` (ai.js, jobs.js, jobs-sync.js, api-job-proxy.js)
- **Static assets**: JSON data files (skills, certifications, O*NET data, BLS wages, profiles)

## Running in Replit
- Static file server using `serve` npm package
- Served on port 5000 via `npm start`
- Workflow: "Start application" → `npm start`
- Deployment: Configured as static (publicDir: ".")
- Git remote: `origin` → `https://github.com/cliffj8338/blueprint` (push to GitHub, Vercel picks up)

## Key Files
- `index.html` — Main application (entire frontend, ~31,600 lines)
- `blueprint.css` — Stylesheet
- `api/` — Serverless API functions (designed for Vercel, not served locally)
- `profiles/demo/` — 24 demo profiles (fictional TV/film characters)
- `profiles/templates/` — Profile templates
- `reports/` — Report templates and demo reports (view.html, base.html, 4 demos)
- `skills/` — Skills index files
- `*.json` — Reference data (O*NET, BLS wages, certifications, etc.)
- `firestore.rules` — Firestore security rules (deploy to Firebase console)
- `vercel.json` — Vercel deployment config (headers, rewrites, crons)
- `docs/SECURITY_AUDIT.md` — Security audit and remediation tracking

## Security
- CSP meta tag + vercel.json header
- SRI integrity hashes on all 7 CDN scripts
- escapeHtml() used on 121+ innerHTML assignments
- Firestore rules: role escalation prevention, auth requirements, field validation
- HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Report templates hardened with escapeHtml for all user-controlled data
- See `docs/SECURITY_AUDIT.md` for full audit details

## Stability (v4.44.60)
- Firestore save: 3-attempt retry with exponential backoff + localStorage backup
- Firestore load: user-facing error toast + automatic restore from local backup
- Global error handlers: window.onerror + unhandledrejection (log to incident system)
- Save debouncing: debouncedSave() prevents race conditions on rapid edits
- Job search: 30s overall timeout safety net prevents stuck loading spinners
- Error visibility: showToast on all critical operation failures (auth, search, reports, card view, blueprint render, skill search)
- Null DOM guards: view switching, waitlist forms, controlsBar, focus() calls inside setTimeout
- Empty catch blocks: console.warn added to non-trivial operations (analytics, mode detection, getIdToken)
- Shared networkLabelLines() utility for consistent multi-line label truncation across all 4 graph views
- Mobile network layout (v4.44.40-42): hub/name nodes positioned upper-right on mobile for all views; expanded link distances, stronger charge repulsion, larger collision radii; reduced boundary padding to 30px for full canvas use; Match view: name upper-right, job upper-left; You view: height accounts for match toggle row
- XSS hardening (v4.44.43-47): 259 escapeHtml() call sites covering innerHTML, textarea content, and input value attributes; textarea breakout prevention; report share tokens with crypto.getRandomValues(); Firestore field-size limits (30 constraints)
- Admin sidebar (v4.44.58): 10-tab horizontal bar replaced with grouped sidebar layout (Operations, Content, System, Planning); sticky sidebar on desktop, wrapping pill bar on mobile (<900px); group labels hidden on mobile
- UX nav cleanup (v4.44.59): Top nav "Skills" renamed to "Map"; "Samples" moved from primary nav to overflow menu (already existed there); Blueprint sub-tabs reordered to workflow sequence (Dashboard→Experience→Skills→Outcomes→Verify→Values→Export); tour badges updated
- Find Jobs redesign (v4.44.61): Unified search — one Search button always does live API search; removed separate "Live" button, source badges, sync status display, and database badge; cache no longer auto-loads on tab visit (eliminates slow Firestore fetch); search bar simplified to keyword + location + Search in one row, filters in second row with match threshold inline

## Data Libraries
- `onet-skills-library.json` — O*NET skills (13,960 skills)
- `onet-abilities-library.json` — O*NET abilities
- `onet-knowledge-library.json` — O*NET knowledge domains
- `bls-wages.json` — BLS wage data (831 occupations)
- `companies.json` — Company values (58 companies)
- `certification_library.json` — 191 credentials
- `values-library.json` — 30 work values
