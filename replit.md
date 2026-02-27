# Blueprint — Career Intelligence App

## Overview
Blueprint is a single-page career intelligence web application. It visualizes skills, reveals market value, and connects users to matching jobs. Originally hosted on Vercel with Firebase backend.

## Architecture
- **Frontend**: Single-file `index.html` (~35,200 lines), vanilla JavaScript, D3.js network graph
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

## Work Blueprint Wizard (v4.44.71)
- Admin → WB Wizard: Create a Work Blueprint from scratch with AI-powered curation
- 5-step guided flow: Company & Title → Skills & Outcomes → Requirements → Values & Culture → Review & Finish
- Step 1: Company research via web scrape + LLM (Anthropic Haiku), falls back to companies.json (58 companies)
- Step 2: Skills pre-populated from O*NET crosswalk based on resolved SOC code, proficiency adjusted by seniority
- Step 3: Requirements auto-populated by seniority (years, education, certifications)
- Step 4: Values picker from values-library.json (30 values, 7 categories), company values pre-selected
- Step 5: Review with full Work Blueprint render, export to JSON/PDF/Word, save to Firestore repository
- Custom skill addition, inline outcome editing, proficiency level adjustment
- Reuses existing renderWorkBlueprint, exportWorkBlueprintJSON/PDF/Word, jdcSaveToRepository

## Work Blueprint Converter (v4.44.80)
- Admin → JD Converter: paste any job description, get a structured Work Blueprint
- Extraction pipeline: title, company, location, employment type, department, reports-to, schedule, travel, seniority, industry
- Requirements extraction: years of experience (with area), education levels, certifications (191 known certs)
- Skill extraction: O*NET crosswalk (canonical) + JD text parsing (phrase patterns + 100+ tech terms + bullet scanning)
- Proficiency inference: years-based + keyword-based + seniority-aware defaults (no more flat "Advanced" default)
- Outcome generation: seniority-aware verbs with varied templates per skill category
- Summary generation: extracts actual JD sentences when available, falls back to structured template
- Values: explicit "Values:" section parsing + fuzzy matching (Levenshtein-like 70% threshold) + misspelling map + pattern inference fallback
- Skills: JD-extracted skills prioritized over O*NET generic skills; AI skill deduplication (strips "tools", "creation", "and usage" variants)
- Compensation: BLS wage data + per-skill comp model; compensation blinding per-row (toggle eye icon hides rows on export while visible in admin)
- Export: JSON/PDF/Word all respect hiddenCompRows; blinded rows stripped from export data
- Input modes: Paste (single JD), URL fetch (via /api/api-job-proxy?source=page&url=...), Bulk (--- separated or file upload)
- Bulk: supports .txt (--- separated), .json (array of strings or objects with description), .csv (auto-detects description column)
- Section order: Header/Logistics → Skills/Outcomes/Proficiency → Requirements → Compensation → Demonstrated Experience → Values
- Edit form (v4.44.73→75): Full field editing with auto-save — _jdcSyncFormToState() preserves all edits when adding/deleting fields. Skills table + values section. AI skills suggestion banner (6 suggestions: Generative AI, Agentic AI, AI Fluency, Prompt Engineering, AI Tool Adoption, AI-Assisted Decision Making). Suggested values banner (8 core values). Click-to-add for both. Blueprint preview hidden during edit. Save & Preview + Save to Repository buttons
- JDC extraction (v4.44.73→79): AI compound phrase detection ("Generative and Agentic AI" decomposed into separate skills). Section-header bullet scanning captures skills from "Key Skills and Competencies:" sections. Skill cap raised from 14 to 18. Tech terms expanded with 50+ AI/ML terms. Company name from possessives/context, department allows commas, reports-to prioritizes explicit labels. Compensation range/bonus, qualifications, Industry/Travel parsing, High School + Other education
- WBW Wizard (v4.44.73): Step 1 adds Travel, Industry, Compensation fields; Step 3 adds searchable certification picker (from certification_library.json, 191 entries, Enter to add custom), qualifications field with add/remove
- Inline editing (v4.44.73): WBW Step 5 Edit button opens full field editor before save/export; Apply Edits returns to preview
- Admin sidebar (v4.44.74): "Work Blueprint" group replaces JDC/WBW under Content; items: Converter, Wizard, Repository
- Repository (v4.44.74): Standalone admin tab for browsing/viewing/exporting/deleting saved Work Blueprints; loads from Firestore `work_blueprints` subcollection; "Edit in Converter" loads blueprint into JDC for modification
- UX Flow (v4.44.80): Converter defaults to edit mode after first conversion; Repository → Edit opens directly in edit mode (no extra click); "Save to Repository" shows "Save" when editing from repo; after save, navigates back to Repository tab; AI value descriptions (per-value wand button or bulk "AI Fill Descriptions" button) generate professional descriptions via Claude Haiku; `_jdcFromRepo` flag tracks source for context-aware UI
- Stability (v4.44.81): Double-click save protection (`_jdcSaving` guard flag prevents duplicate Firestore writes); removed useless `catch(e) { throw e; }` no-ops in Himalayas/Jobicy fetch functions
- Wizard parity (v4.44.82): WBW Step 1 now has Work Summary textarea + Custom Fields (key/value pairs, add/remove); Step 4 shows value descriptions with per-value AI wand button + bulk "AI Fill Descriptions" button (Claude Haiku); custom values can be added by name; `_wbwSaveCurrentStep` saves Step 1 and Step 4 state on navigation; `_wbwBuildResult` includes `valueDescriptions` and `customFields` in output; `renderWorkBlueprint` displays custom fields in logistics tags; PDF/Word/JSON exports include custom fields; Converter edit form also gains custom fields section with `_jdcSyncFormToState` persistence
- Repo export fix (v4.44.83): Fixed function name mismatch — `wbRepoExport` now calls `exportWorkBlueprintPDF`/`exportWorkBlueprintWord` (was incorrectly referencing `jdcExportPDF`/`jdcExportWord`)
- Repo edit modal (v4.44.84): Repository "Edit" button now opens a modal overlay instead of navigating to the Converter tab; `renderJDCEditForm` accepts `opts` parameter (`saveFn`, `cancelFn`, `refreshFn`, `saveLabel`, `showBottomRow`) so it can be reused in different contexts without fragile string replacement; modal saves directly to Firestore and refreshes repo view on success; `_wbRepoModalRefresh()` handles add/remove of skills/values/custom fields within the modal
- Dropdowns + tracking (v4.44.85–91): WBW Step 1 and Converter edit form now use `<select>` dropdowns for Industry (35 options from shared `WB_INDUSTRIES[]`), Travel (`WB_TRAVEL_OPTIONS[]`), Schedule (`WB_SCHEDULE_OPTIONS[]`), and Employment Type (`WB_EMPLOYMENT_TYPES[]`). Industry includes fallback for non-matching existing values. AI_FEATURES registry extended with `wb-company-research`, `wb-value-desc`, `wb-value-desc-bulk`. All WB AI calls now use correct `callAnthropicAPI(requestBody, null, featureTag)` format for proper tracking. Analytics events added: `wb_created`, `wb_edited`, `wb_deleted`, `wb_exported_pdf/word/json`, `wb_wizard_complete`, `wb_converted` via `logAnalyticsEvent()`. `wb_converted` tracked on all conversion paths (paste, URL fetch, bulk paste, file upload) with source metadata. Admin traffic dashboard shows Work Blueprint Activity card (Row 4b) with tile counts for each WB operation when data exists
- Cost dashboard actuals (v4.44.87): INFRASTRUCTURE array now includes `key` property on every item for actuals storage. Replit billing broken into 5 items: Core Plan ($25/mo fixed), AI Agent (usage), Credit Overages (usage), Data Transfer (usage), App Storage (usage). New "platform" category with ordered rendering (`categoryOrder` array). Usage-based items (`cycle: 'usage'`) default to $0 until actual entered. Click pencil icon on any item to enter actual cost via `costActualEdit(key, label)` prompt; actuals stored in `bpCostActuals` localStorage key. "Reset" button clears all actuals. Monthly Cost Snapshot breakdown now dynamically generated from INFRASTRUCTURE array (items with actuals marked with *). Summary tiles label updated to "Infrastructure (subs + actuals)". Footnote explains actual cost tracking
- UX fixes (v4.44.87): WB repo edit modal now uses opaque `var(--c-bg)` background instead of transparent `rgba(0,0,0,0.6)`. Value descriptions now use `v.desc || v.description` fallback in renderWorkBlueprint, renderJDCEditForm, PDF export, and Word export (fixes property name mismatch between edit form and view). Comp export blinding buttons added to edit form when BLS data present — 5 percentile toggles (10th/25th/50th/75th/90th) with eye/eye-off icons; `toggleCompBlinding` detects modal context and syncs form state before re-render. Job network graph center node offset from `0.42/0.35` to `0.18/0.22` (upper-left on desktop) to avoid centering
- Edit form fixes (v4.44.92–93): Fixed `wbRepoEditCancel()` calling nonexistent `renderAdminWBRepository` (→ `renderAdminWBRepo`). Fixed double `_jdcSyncFormToState()` in `_wbRepoModalRefresh()` causing skill data corruption on delete (sync removed from refresh since all onclicks already sync). AI skill outcome generation: per-skill wand button (`jdcAIFillOneSkillOutcome(idx)`) + bulk "AI Fill Outcomes" button (`jdcAIFillSkillOutcomes()`) using Claude Haiku with full WB context (role, company, industry, seniority). Comp table added to edit form showing BLS percentile data alongside blinding toggles. New AI_FEATURES entries: `wb-skill-outcome` (~600 in / ~50 out), `wb-skill-outcome-bulk` (~900 in / ~1200 out)
- Export redesign (v4.44.94): Premium PDF export with dark header bar + blue accent stripe, colored section indicators (rounded pill bars), skills table with zebra-striped rows and column headers, compensation card layout (inline boxes with median highlighted in green), proper requirements/values/demonstrated sections with bullet dots, page break detection, professional footer. Word export redesign: dark header block, logistics bar with label/value pairs, styled skills table with header row + alternating row colors, inline compensation boxes with median highlight, sub-grouped requirements, clean value formatting. Comp blinding data persistence fix: `_jdcPrepareExport()` no longer strips `hiddenCompRows` from saved data (was permanently deleting hidden percentile values on save); new `_jdcStripHiddenComp()` helper used only for JSON export/clipboard copy where field removal is intentional; PDF/Word exports filter hidden rows inline without mutating source data
- Demonstrated Experience + fixes (v4.44.95): Demonstrated Experience now editable in the edit form — evidence items with add/remove, artifacts textarea, full `_jdcSyncFormToState` persistence. AI-powered demonstrated experience generation (`jdcAIFillDemonstrated()`) via Claude Haiku with full role context: title, company, industry, location, seniority, department, skills (with levels), values, and work summary — produces 5-7 industry-verticalized evidence statements + artifacts description. New AI_FEATURES entry: `wb-demonstrated` (~800 in / ~900 out). PDF fixes: department/logistics text now wraps instead of truncating (was `.substring(0,35)`, now `splitTextToSize` with 2-line limit), increased row height for readability. Word export: comp boxes converted from CSS `inline-block` (broken in Word) to HTML table layout. All outputs (PDF footer, Word footer, JSON `generatedBy`) now show "myblueprint.work" instead of "blueprint.work"

- Clone + Blueprint Advantage (v4.44.97): WB Repository clone feature — `wbRepoClone(idx)` deep-copies blueprint with " (Copy)" title, new ID, saves to Firestore. Blueprint Advantage comparison: live before/after matching using real engine.
- Compare Wizard (v4.44.98): Standalone "Compare" tab under Work Blueprint admin sidebar. Multi-step wizard flow: (1) Select a WB from repository, (2) Add traditional JD via paste or URL fetch (reuses `/api/api-job-proxy` + `_jdcExtractTextFromHTML`), (3) Select candidate from 24 demo profiles or Alex Morgan default, (4) Run live comparison showing full `_wbRenderComparison` results. Step progress bar with checkmarks. Pre-fills JD text from `sourceJD` when available. "New Comparison" button to restart. All values from WB now included in comparison (was only first 6, now splits evenly into primary/secondary).
- Comparison engine v5 (v4.45.04): Complete rewrite of comparison pipeline. `_wbCompareRawJDMatch(rawJDText, candidateProfile)` runs `parseJobLocally()` to extract skills from raw JD text via heuristics, then matches those extracted skills against candidate profile using synonym + substring + word-overlap matching, plus `inferCompanyValuesFromJD()` for inferred values. `_wbCompareStructuredMatch(workBlueprint, candidateProfile)` uses WB's curated structured skills with explicit proficiency levels and requirement weights, full synonym/ontology matching, and explicit values from WB. Both functions are self-contained (don't depend on global `userData`). `_wbCompareRunBoth()` orchestrates both and returns `{ raw, struct }`. Redesigned comparison UI: three-column layout with score gauges (before → delta → after), intelligence comparison table (6 dimensions), side-by-side matched skills lists, gap analysis. Demo candidate: Alex Morgan (`profiles/demo/comparison-candidate.json`) — VP Business Strategy, 30 skills with evidence, 18 values, 4 roles in work history.
- Skill quality filtering (v4.45.05): Converter `addSkill()` now rejects sentence fragments: max 5 words per skill name, blocks sentence indicators ("the ability to", "within a", "responsible for", etc.), rejects skills starting with articles/prepositions. Bullet scanning in skills sections now splits comma/semicolon-separated items instead of treating entire bullet text as one skill. `_wbSkillQualityFilter(skills)` utility filters WB skills at comparison time (catches bad skills from WBs already saved to Firestore). `_wbCompareStructuredMatch` auto-enriches from O*NET crosswalk when a WB has fewer than 5 valid skills after filtering (caps at 12, uses `resolveTitle` + `onetCrosswalk`). Step 4 loading guard: shows spinner when comparison results aren't ready instead of crashing on null data.

## Stability (v4.44.70)
- Firestore save: 3-attempt retry with exponential backoff + localStorage backup
- Firestore load: user-facing error toast + automatic restore from local backup
- Global error handlers: window.onerror + unhandledrejection (log to incident system)
- Save debouncing: debouncedSave() prevents race conditions on rapid edits
- Job search: 30s overall timeout safety net prevents stuck loading spinners
- Error visibility: showToast on all critical operation failures (auth, search, reports, card view, blueprint render, skill search)
- Null DOM guards: view switching, waitlist forms, controlsBar, focus() calls inside setTimeout, networkView/cardView, roleInfo, matchValue, settingsTabContent, querySelector for skill level inputs
- Empty catch blocks: console.warn added to non-trivial operations (analytics, mode detection, getIdToken)
- Shared networkLabelLines() utility for consistent multi-line label truncation across all 4 graph views
- Mobile network layout (v4.44.40-42): hub/name nodes positioned upper-right on mobile for all views; expanded link distances, stronger charge repulsion, larger collision radii; reduced boundary padding to 30px for full canvas use; Match view: name upper-right, job upper-left; You view: height accounts for match toggle row
- XSS hardening (v4.44.43-47): 259 escapeHtml() call sites covering innerHTML, textarea content, and input value attributes; textarea breakout prevention; report share tokens with crypto.getRandomValues(); Firestore field-size limits (30 constraints)
- Admin sidebar (v4.44.58): 10-tab horizontal bar replaced with grouped sidebar layout (Operations, Content, System, Planning); sticky sidebar on desktop, wrapping pill bar on mobile (<900px); group labels hidden on mobile
- UX nav cleanup (v4.44.59): Top nav "Skills" renamed to "Map"; "Samples" moved from primary nav to overflow menu (already existed there); Blueprint sub-tabs reordered to workflow sequence (Dashboard→Experience→Skills→Outcomes→Verify→Values→Export); tour badges updated
- Find Jobs redesign (v4.44.61): Unified search — one Search button always does live API search; removed separate "Live" button, source badges, sync status display, and database badge; cache no longer auto-loads on tab visit (eliminates slow Firestore fetch); search bar simplified to keyword + location + Search in one row, filters in second row with match threshold inline
- Find Jobs sorting + entity fix (v4.44.62–67): Sort dropdown (Match % high/low, Title A–Z, Company A–Z, Location A–Z) defaults to highest match first; unified quickScore across Find Jobs, Pipeline add, rescoreAllJobs, and rescoreOneJob — all use quickScoreJob for the headline %, matchJobToProfile for skill gap analysis; regex-based decodeHtmlEntities (named before numeric) for double-encoded API data; toast messages use decoded titles; addRemoteJobToPipeline uses displayed sort order via window._displayedJobs

## Data Libraries
- `onet-skills-library.json` — O*NET skills (13,960 skills)
- `onet-abilities-library.json` — O*NET abilities
- `onet-knowledge-library.json` — O*NET knowledge domains
- `bls-wages.json` — BLS wage data (831 occupations)
- `companies.json` — Company values (58 companies)
- `certification_library.json` — 191 credentials
- `values-library.json` — 30 work values
