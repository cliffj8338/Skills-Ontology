# PROJECT_CONTEXT.md — Blueprint v4.15.0 (Work History + Resume v2)
**Updated:** 2026-02-19 | **Lines:** 19,316 | **Functions:** ~380 | **Size:** ~975 KB | **Braces:** 0 (balanced)

## What Is Blueprint

Blueprint is a single-page career ontology platform that maps a person's full professional identity (skills, evidence, values, purpose) into an interactive visualization, scores it against job postings, and generates professional deliverables (resumes, cover letters, interview prep, LinkedIn profiles). It runs as a static site on GitHub Pages with optional Firebase auth/persistence.

**Live URL:** https://cliffj8338.github.io/Skills-Ontology/
**Repo:** https://github.com/cliffj8338/Skills-Ontology
**Primary file:** `index.html` (single-file SPA, 18,780 lines)

## Architecture Overview

### Single-File SPA
Everything lives in one `index.html`: CSS (lines 1-3600), HTML structure (3600-3700), JavaScript (3700-18780). No build tools, no bundler, no framework. Pure vanilla JS with D3.js for network visualization.

### External Dependencies
- **D3.js v7** — Network graph visualization (CDN)
- **jsPDF 2.5.1** — PDF resume generation (CDN)
- **Firebase 10.7.0** — Auth (Google, email, magic link) + Firestore persistence (CDN)
- **Anthropic API** — Job description parsing, resume AI, wizard parsing (client-side, key stored in localStorage)
- **Outfit font** — Primary typeface (Google Fonts)

### Local JSON Data Files (loaded at init)
| File | Purpose |
|------|---------|
| `profiles-manifest.json` | Lists enabled demo profiles with paths |
| `profiles/templates/blank.json` | Empty template for new profiles |
| `profiles/*.json` | Demo profile templates (recruiter, product, strategy) |
| `onet-skills-library.json` | O*NET skills taxonomy |
| `onet-abilities-library.json` | O*NET abilities taxonomy |
| `onet-workstyles-library.json` | O*NET work styles |
| `onet-knowledge-library.json` | O*NET knowledge domains |
| `onet-work-activities-library.json` | O*NET work activities |
| `trades-creative-library.json` | Non-O*NET trade/creative skills |
| `values-library.json` | Professional values catalog |
| `skill_valuations.json` | Market value data per skill |
| `skill_evidence.json` | Pre-loaded evidence for demo profiles |
| `onet-impact-ratings.json` | Skill impact scoring data |

### State Management
Two primary state objects, kept in sync:

**`userData`** — The active profile:
```
{ initialized, profile: {name, title, headline, photo, roleLevel, email, phone, linkedinUrl},
  skills: [{name, level, category, key, core, roles, evidence, synonyms}],
  skillDetails: {}, values: [], purpose: "", roles: [{id, name, color}],
  workHistory: [{id, title, company, location, startDate, endDate, current, description, achievements[]}],
  education: [{id, school, degree, field, year}],
  certifications: [{id, name, issuer, year}],
  preferences: {seniorityLevel, targetTitles, excludeRoles, ...},
  applications: [], savedJobs: [], templateId }
```

**`skillsData`** — Derived/synced mirror for rendering:
```
{ skills: [...], roles: [...], skillDetails: {} }
```

**Persistence chain:** User action → update userData → `saveUserData()` (localStorage) → `saveToFirestore()` (if signed in) → `rescoreAllJobs()` (if skills changed) → `refreshAllViews()`

### Auth & Permissions
- `fbUser` — Current Firebase user (null if anonymous)
- `fbIsAdmin` — Boolean, checked via `checkAdminRole()` against Firestore admins collection
- Admin gets: profile switching, sample job editing, admin panel, all demo profiles in dropdown
- Non-admin gets: read-only on demo profiles, locked sample jobs, standard user features
- `readOnlyGuard()` — Blocks edits on demo profiles for non-admin users

### localStorage Keys
`currentProfile`, `wbTheme`, `wbValues`, `wbPurpose`, `wbAnthropicKey`, `wbMagicLinkEmail`

---

## CSS Architecture (Lines 1-3600)

| Section | Lines | Purpose |
|---------|-------|---------|
| Theme Variables | 23-87 | CSS custom properties for dark/light themes |
| Light Theme Overrides | 88-136 | `[data-theme="light"]` overrides |
| Blueprint Sections | 137-347 | Cards, modals, buttons, form elements |
| Nav Bar | 348-891 | Top nav, profile chip, mobile bottom nav |
| Contextual Filter Bar | 892-1100 | View toggle buttons, filter chips |
| Network Visualization | 1100-1800 | SVG container, node styles, tooltips |
| Match Legend | 1800-2100 | Job match overlay stats panel |
| Job Cards | 2100-2400 | Pipeline card grid, match bars |
| Toast Notifications | 2400-2500 | Toast container, animations |
| Wizard | 2500-2650 | Onboarding wizard overlay |
| Mobile Responsiveness | 2650-3189 | `@media (max-width: 768px)` overrides |
| Auth Modal | 3189-3600 | Sign in/up modal styles |

---

## JavaScript Architecture (Lines 3700-18780)

### Firebase & Auth (L4280-4700, 18 functions)
`showAuthModal`, `authWithGoogle`, `authEmailSignIn`, `authEmailSignUp`, `authSendMagicLink`, `authSignOut`, `checkMagicLinkSignIn`, `handlePostSignIn`, `checkAdminRole`, `updateAuthUI`, `rebuildProfileDropdown`, `saveToFirestore`, `loadUserFromFirestore`

Key patterns: Auth state listener updates `fbUser`/`fbIsAdmin`, triggers `updateAuthUI()`. Post-signin loads from Firestore or falls back to localStorage. Firestore serializer at L4649 preserves all fields including `sample` flag on jobs.

### Profile & State Management (L4700-5950, 21 functions)
`saveAll`, `checkReadOnly`, `readOnlyGuard`, `renderWelcomePage`, `initHeroNetwork`, `viewSampleProfile`, `showToast`, `dismissToast`, `calculateSkillValue`, `calculateTotalMarketValue`, `getClosestRoleBenchmark`, `buildProfileSelector`, `switchProfile`, `saveUserData`

Key patterns: `saveAll()` orchestrates full save chain. `readOnlyGuard()` returns true (blocks action) if current profile is a demo and user isn't admin. `calculateTotalMarketValue()` sums skill-level market rates. Welcome page has animated hero network (D3 force simulation).

### Template & Profile Loading (L5950-6500, 12 functions)
`loadSkillLibraryIndex`, `searchSkills`, `getCategoryColor`, `isSkillAlreadyAdded`, `getSampleJobsForProfile`, `loadTemplate`, `initializeApp`

**`getSampleJobsForProfile(templateId, template)`** — Dynamic engine (v4.14.0). Reads template.skills to construct 3 calibrated jobs per profile type:
- **High tier (~80%+):** 10 profile skills at matching proficiency + 2 soft gaps
- **Mid tier (~50-65%):** 6 profile skills (2 at stretch level) + 6 Required gaps
- **Low tier (<50%):** 3 profile skills as Preferred + 10 Required/Expert alien-domain gaps
- Gap pools: technical, finance, operations, data (skills unlikely in the profile)
- All sample jobs flagged `sample: true` — locked for non-admin

**`loadTemplate(templateId)`** — Populates userData from template JSON. Injects sample jobs if savedJobs empty and profile is a demo.

**`initializeApp()`** — Master init: loads manifest, fetches all JSON libraries, builds profile selector, loads template, inits network.

### Onboarding Wizard (L6500-7600, 39 functions)
8-step wizard: Welcome → Upload method → Resume input → AI parsing → Profile edit → Skills review → Values → Purpose → Launch. Supports resume paste, file upload, or manual entry. Uses Anthropic API for resume parsing. Builds complete userData on completion.

### Network Visualization (L7600-9100, 26 functions)
Three D3 force-directed networks:
- **"You" mode** (`initNetwork`): User's skills grouped by role, color-coded by role
- **"Job" mode** (`initJobNetwork`): Single job's required/preferred skills
- **"Match" mode** (`initMatchNetwork`): Overlay showing matched (green), gaps (red), surplus (gray)

**Match overlay colors (v4.14.1):**
- Green = matched skill (user has it)
- Red = gap skill (job needs, user lacks)
- Gray = surplus skill (user has, job doesn't need)
- Blue = person center node only
- Role nodes: neutral slate fill with gray/red stroke (no more orange/blue confusion)

**Match legend panel** (`addMatchLegend`): Floating stats panel, top-right on desktop, bottom on mobile. Shows job title, company, score (color-coded), matched/gaps/surplus counts, proficiency gap warning, close/view-details buttons.

Key functions: `activateJobOverlay`, `clearJobOverlay`, `setNetworkMatchMode`, `switchView` (toggles Network/Card/You/Job/Match), `filterByRole`, `filterByLevel`

### Card View (L8318-8600)
Alternative to network: grid of skill cards grouped by role, sorted by level. Includes bulk import/edit buttons, search, and the same filter bar as network view.

### Skill Modals (L9100-9400, 8 functions)
`openSkillModal` — Rich detail modal for any skill: market value, proficiency bar, evidence list, related skills, coaching, category info. Accessible from both network nodes and card view.

### Resume & Document Generation (L9379-9998)
**Resume v2 (v4.15.0):** `generateResume` → `gatherResumeData` → `buildResumeHTML`. Full ATS-compatible HTML resume. Contact block includes email, phone, LinkedIn URL, location. Professional Experience section renders structured work history entries with per-role achievements. Education and Certifications sections. Falls back to single-entry stub if no work history data. Core competencies grid, values tags. Print-to-PDF via browser.

`generateWorkBlueprint` / `gatherBlueprintData` / `createBlueprintHTML` — Executive Blueprint document.

### Blueprint Tab (L10200-11300, 26 functions)
Five sub-tabs: Market Valuation, Outcomes, Values, Purpose, Export. Outcomes extracted from skill evidence. Values picker with catalog. Purpose statement (AI-generatable). Export to PDF (`generatePDF` via jsPDF), copy as text, download HTML.

### Valuation & Export (L11300-12000, 21 functions)
Market valuation with role benchmarks. PDF generation with multi-page support. Cover letter generator (AI-powered or template). Interview prep builder. LinkedIn profile generator.

### Jobs & Matching Engine (L12000-14500, 45 functions)

**`matchJobToProfile(parsed)`** (L13210) — Core scoring algorithm:
1. Builds user skill lookup with synonym expansion
2. For each job skill, attempts: exact match → synonym match → substring containment → 50%+ word overlap
3. Calculates weighted score: `reqWeight * nameMatchQuality * proficiencyMatch`
4. Required skills: weight 3, Preferred: 2, Nice-to-have: 1
5. Proficiency match: full credit if user meets/exceeds, partial credit proportional to gap
6. Returns: `{ score, matched[], gaps[], surplus[], profGapCount }`

**`getSkillSynonyms(name)`** (L13006) — 150+ synonym groups for fuzzy matching (e.g., "Agile" ↔ "Scrum" ↔ "Kanban")

**Job pipeline features:** Add job (paste URL or JD text), AI parsing via Anthropic, local regex fallback, manual skill editing, match overlay, detail view with matched/gap/surplus breakdown, quick-add gap skills, rescore, re-analyze.

**Remote job search:** Fetches from RemoteOK, Remotive, Arbeitnow APIs. Filters by match score, seniority, keywords.

**Sample job locking (v4.14.0):** Jobs with `sample: true` flag. Non-admin cannot edit/remove/re-analyze. Guards in `removeJob()`, `editJobInfo()`, `reanalyzeJob()`. UI shows "🔒 Demo job" label.

### Settings: Experience Tab (v4.15.0, ~24 functions)
New "Experience" tab in Settings for managing structured career data:

**Work History** (`renderExperienceSettings`, `openWorkHistoryModal`, `saveWorkHistoryFromModal`): Full CRUD for work positions. Each entry: title, company, location, start/end dates, current flag, description, achievements array. Modal-based editing with dynamic achievement inputs. Reverse chronological order. Data flows to resume generation.

**Education** (`openEducationModal`, `saveEducationFromModal`): School, degree, field of study, year. Simple CRUD with modal editing.

**Certifications** (`openCertModal`, `saveCertFromModal`): Cert name, issuing org, year. Simple CRUD with modal editing.

**Profile Settings** also enhanced: phone and LinkedIn URL fields added alongside existing email. All contact fields appear in resume exports.

All three data types persist through the same chain: `saveAll()` → Firestore (if signed in) + localStorage values.

### Applications Tracker (L15469-15800, 10 functions)
Kanban-style tracker: Saved → Applied → Interviewing → Offer → Rejected. Add/edit/delete applications with company, role, salary, notes, next follow-up.

### O*NET Library & Skill Picker (L16693-16990, 9 functions)
Full O*NET taxonomy browser with category tabs (Skills, Abilities, Work Styles, Knowledge, Activities, Trades). Search, filter, multi-select, batch add to profile.

### Custom Skill Builder (L16964-17040)
Create skills not in O*NET: name, category (unique), proficiency, roles, core/differentiator flag. Registers in skill library with synonyms.

### Bulk Import & Manager (L17041-17470, 14 functions)

**Bulk Import** (`openBulkImport`): Two input modes (paste text or CSV/TSV upload). Smart CSV parser with flexible column names. Synonym-aware deduplication. Three merge strategies (Skip, Keep higher, Overwrite). Two-step review with per-skill action override. Destination toggle: Library Only vs Library + Profile.

**Bulk Manager** (`openBulkManager`): Searchable skill list with checkboxes. Bulk set proficiency level. Bulk remove from profile.

### Skill Editing (L17617-17830, 12 functions)
`openEditSkillModal` — Edit any skill's proficiency, category, roles, evidence. Delete from profile. Universal access from network nodes and card view.

`openAssessSkillModal` — Guided self-assessment for unique skills.

`refreshAllViews()` — Master refresh: rebuilds skillsData, rescores jobs, re-renders active view.

### Skill Management Hub (L17864-18430, 15 functions)
Unified modal with two tabs: "Your Skills" (manage existing) and "Add Skills" (search all libraries + custom). Search across all O*NET categories simultaneously.

### Admin & Config (L18430-18780, 22 functions)
Theme toggle (dark/light), profile dropdown, filter panel, overflow menu. Help modal, About modal (shows current version), Legal/IP notice. Admin panel with user data viewer, profile switching.

---

## Version History

### v4.15.0 (current)
- **Work History management:** Full CRUD in Settings → Experience tab. Title, company, location, dates, description, per-role achievements. Modal-based editing with dynamic achievement inputs.
- **Education management:** School, degree, field, year. CRUD with modal editing.
- **Certifications management:** Name, issuer, year. CRUD with modal editing.
- **Profile contact fields:** Phone and LinkedIn URL added to Settings → Profile. Persisted through Firestore and included in exports.
- **Resume v2:** Rebuilt `buildResumeHTML()` with structured Professional Experience (multiple entries with per-role achievements), Education section, Certifications section, full contact header (email, phone, LinkedIn, location). Falls back gracefully to single-entry stub when no work history exists. ATS-optimized, print-to-PDF ready.
- **Data model expansion:** `userData.workHistory[]`, `userData.education[]`, `userData.certifications[]`, `userData.profile.phone`, `userData.profile.linkedinUrl` — all persisted through Firestore serializer/loader, template loading, and wizard builder.

### v4.14.1 (stabilized)
- Fixed match overlay role node colors: neutral slate instead of profile-colored (orange/blue)
- Repositioned match legend panel: top-right on desktop, full-width bottom on mobile
- Updated About dialog version reference (was stale at v4.6.0)
- Removed verbose debug console.logs (template loading, skill modal, sample job scoring)
- Full audit: 0 duplicate functions, 0 missing onclick targets, 0 duplicate HTML IDs, balanced braces

### v4.14.0
- Calibrated sample jobs: Dynamic engine reads actual template skills. Three tiers per profile type (high ~80%+, mid ~50-65%, low <50%). Gap pools from alien domains. All flagged `sample: true`, locked for non-admin.

### v4.13.0
- Match overlay stats panel: job title, score bar, matched/gaps/surplus counts, proficiency gap warning, close/view-details actions, glass-morphism design.

### v4.12.0
- Library-only import mode. Bulk skill manager (search, select all, set level, remove). Roles made optional in all skill modals.

### v4.11.0
- Bulk skill import: paste text or CSV/TSV, synonym-aware dedup, three merge strategies, per-skill action overrides, two-step review.

### v4.10.1
- Toast CSS fix (moved to main head). Universal skill editing from network. Corrected proficiency levels (added Competent). Sample job injection for demo profiles. Three bug fixes.

### v4.9.0
- Jobs tab overhaul: pipeline view, Find Jobs with remote API search, job detail with matched/gap/surplus breakdown, match overlay in network view.

### v4.7.0-v4.8.0
- UI stubs, inventory system, card view filters, initial job matching.

### v4.6.0
- Wizard, exports, resume generation, negotiation guide, valuation engine, hero animation, profile switching.

### v4.0.0
- Foundation: network visualization, skill ontology, Firebase auth, theme system, O*NET integration.

---

## Key Patterns & Conventions

### Function Naming
- `render*` — Returns or injects HTML
- `init*` — Sets up a major feature (called once)
- `open*/close*` — Modal lifecycle
- `switch*` — Tab/view navigation
- `save*` — Persist data
- `export*/generate*` — Create deliverables

### Modal Reuse
Most modals reuse `exportModal` container by swapping `.modal-content` innerHTML. Dedicated modals: `skillModal`, `customSkillModal`, `editSkillModal`, `assessSkillModal`, `bulkImportModal`, `bulkSkillManagerModal`, `onetPickerModal`, `skillManagementModal`.

### View System
`switchView(viewName)` manages: 'skills' (network/card), 'opportunities' (jobs), 'applications', 'blueprint'. Each has an `init*` function called on first visit.

### Skill Level Scale
6 levels: Novice (1) → Competent (2) → Proficient (3) → Advanced (4) → Expert (5) → Mastery (6). `proficiencyValue(level)` converts name to number.

### Toast System
`showToast(message, type)` — Types: 'success' (green), 'warning' (amber), 'error' (red), 'info' (blue). Auto-dismiss after 4s. Stacks multiple toasts.

---

## Known Considerations

1. **Backtick count is odd (507)** — False alarm. Backticks inside regex patterns on L6996 (`/^\`\`\`json.../`) for JSON fence stripping are counted but aren't template delimiters. JS executes correctly.

2. **Console.logs remain (70)** — Kept intentionally for admin debugging. Key lifecycle markers (Firebase init, template loading, job scoring). No debugger statements.

3. **var/let/const mix** — 826 var, 77 let, 668 const. Older code uses var, newer uses const/let. Not causing issues but could be modernized.

4. **Window exposures (167)** — Functions exposed via `window.functionName = functionName` for onclick handler access. Standard pattern for non-module SPA.

5. **Empty catch blocks (2)** — One legitimate Firebase fallback (L4553), one for localStorage quota/private mode (L10089). Both intentional.

---

## Development Transcript History

Sessions are stored in `/mnt/transcripts/`:
1. `2026-02-19-03-51-49-blueprint-v46-wizard-exports.txt`
2. `2026-02-19-14-57-36-hero-animation-profile-switch-fixes.txt`
3. `2026-02-19-15-17-20-hero-animation-profile-bugs-audit.txt`
4. `2026-02-19-15-40-07-v47-audit-fixes-ui-stub-inventory.txt`
5. `2026-02-19-16-59-35-v49-jobs-matching-overhaul.txt`
6. `2026-02-19-18-01-02-v410-skill-edit-sample-jobs-bugfix.txt`
7. `2026-02-19-19-07-15-v412-v413-bulk-import-manager-overlay-panel.txt`
8. Previous session: v4.14.0-v4.14.1 (calibrated sample jobs, overlay color fix, stabilization audit)
9. Current session: v4.15.0 (Work History/Education/Certifications management, Resume v2, Profile contact expansion)

---

## Priority Queue (Next Features)

### High Priority
- **Values System v2** — Editable descriptions (not just catalog defaults), drag-to-reorder or explicit ranking (top 3 marked as "core"), stronger evidence-linking UI, "value story" narrative field per value
- **Evidence Management** — Add/edit/remove evidence items directly from skill cards and modals. Currently evidence comes through wizard or demo data with no inline editing path. Feeds both Outcomes and resume achievements.
- **Consent-to-Export Pipeline** — Wire consent presets so they actually filter what appears in exports. "Preview what gets shared" summary before any export.
- **Proficiency gap visualization on nodes** — Show visual indicator when user matches a job skill but at lower proficiency
- **Job application tracking integration** — Connect pipeline jobs to application tracker

### Medium Priority
- **Animated transitions between network modes** — Smooth morph between You/Job/Match views
- **Drag-to-rearrange** in skill lists and card view
- **Skill gap development plans** — Suggest learning paths for gap skills
- **Work history import from wizard** — Parse work history entries from resume text during onboarding wizard AI parsing

### Low Priority
- **var → const/let modernization** — Cleanup pass on older functions
- **Code splitting** — Break monolith into modules (would require build tooling)
- **Offline support** — Service worker for PWA capability
- **Import from LinkedIn** — Parse LinkedIn data export

### Completed (v4.15.0)
- ✅ **Professional resume generation v2** — Full ATS-compatible resume with structured work history, education, certifications, full contact block
- ✅ **Work History / Education / Certifications management** — Settings → Experience tab with full CRUD
- ✅ **Profile contact expansion** — Phone and LinkedIn URL fields

---

## Creator & IP

Blueprint is the intellectual property of Cliff Jurkiewicz. All methodologies, ontology structures, and matching algorithms are original work. Copyright notices in About dialog (L18623) and Legal Notice (L18669).
