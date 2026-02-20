# PROJECT_CONTEXT.md — Blueprint v4.20.1 (UX Polish + Network Fixes)
**Updated:** 2026-02-20 | **Lines:** 21,540 | **Functions:** ~430 | **Size:** ~1,153 KB | **Braces:** 0 (balanced)

## What Is Blueprint

Blueprint is a single-page career ontology platform that maps a person's full professional identity (skills, evidence, values, purpose) into an interactive visualization, scores it against job postings, and generates professional deliverables (resumes, cover letters, interview prep, LinkedIn profiles). It runs as a static site on GitHub Pages with optional Firebase auth/persistence.

**Live URL:** https://cliffj8338.github.io/Skills-Ontology/
**Repo:** https://github.com/cliffj8338/Skills-Ontology
**Primary file:** `index.html` (single-file SPA, 21,149 lines)

## Architecture Overview

### Single-File SPA
Everything lives in one `index.html`: CSS (lines 1-3600), HTML structure (3600-3700), JavaScript (3700-21460). No build tools, no bundler, no framework. Pure vanilla JS with D3.js for network visualization.

### Icon System (v4.20.0)
`bpIcon(name, size)` — Returns inline SVG strings for ~60 stroke-based icons using `currentColor`. Icons are theme-aware (dark/light) and replace all emoji throughout the UI. Hydrated at init via `hydrateIcons()` for static HTML elements (nav, mobile nav, overflow menu). Dynamic elements call `bpIcon()` directly in render functions.

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
| `profiles/*.json` | Demo profile templates (6 types: strategy, recruiter, product, tech, retail, trades) |
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
| `bls-wages.json` | BLS OEWS May 2024 wage data (75 occupations, 15 functions x 5 seniority levels) |
| `certifications-library.json` | 191 credentials with tiered skill maps |

### State Management
Two primary state objects, kept in sync:

**`userData`** — The active profile:
```
{ initialized, profile: {name, title, headline, photo, roleLevel},
  skills: [{name, level, category, key, core, roles, evidence, synonyms}],
  skillDetails: {}, values: [], purpose: "", roles: [{id, name, color}],
  preferences: {seniorityLevel, targetTitles, excludeRoles, ...},
  applications: [], savedJobs: [], templateId }
```

**`skillsData`** — Derived/synced mirror for rendering:
```
{ skills: [...], roles: [...], skillDetails: {} }
```

**Persistence chain:** User action -> update userData -> `saveUserData()` (localStorage) -> `saveToFirestore()` (if signed in) -> `rescoreAllJobs()` (if skills changed) -> `refreshAllViews()`

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
| Job Info Tile | 2029-2103 | Upper-left job context tile with BLS salary |
| Job Cards | 2100-2400 | Pipeline card grid, match bars |
| Toast Notifications | 2400-2500 | Toast container, animations |
| Wizard | 2500-2650 | Onboarding wizard overlay |
| Mobile Responsiveness | 2650-3189 | `@media (max-width: 768px)` overrides |
| Icon System | 3189-3210 | `.nav-icon`, `.overflow-icon`, `.section-icon` SVG alignment |
| Auth Modal | 3210-3600 | Sign in/up modal styles |

---

## JavaScript Architecture (Lines 3700-21149)

### Firebase & Auth (L4400-4800, 18 functions)
`showAuthModal`, `authWithGoogle`, `authEmailSignIn`, `authEmailSignUp`, `authSendMagicLink`, `authSignOut`, `checkMagicLinkSignIn`, `handlePostSignIn`, `checkAdminRole`, `updateAuthUI`, `rebuildProfileDropdown`, `saveToFirestore`, `loadUserFromFirestore`

### Icon System (L4375-4500, 2 functions)
`bpIcon(name, size)` — Returns inline SVG string for named icon. ~60 icons covering nav, settings, export, sections.
`hydrateIcons()` — Scans DOM for `[data-icon]` elements and injects SVG markup. Called once after init.
`applyLabelToggles()` — Reads checkbox state from networkControls and applies hidden/visible to SVG text elements. Called after every network init (You/Job/Match).

Key patterns: Auth state listener updates `fbUser`/`fbIsAdmin`, triggers `updateAuthUI()`. Post-signin loads from Firestore or falls back to localStorage. Firestore serializer preserves all fields including `sample` flag on jobs.

### Profile & State Management (L4700-5950, 21 functions)
`saveAll`, `checkReadOnly`, `readOnlyGuard`, `renderWelcomePage`, `initHeroNetwork`, `viewSampleProfile`, `showToast`, `dismissToast`, `calculateSkillValue`, `calculateTotalMarketValue`, `getClosestRoleBenchmark`, `buildProfileSelector`, `switchProfile`, `saveUserData`

Key patterns: `saveAll()` orchestrates full save chain. `readOnlyGuard()` returns true (blocks action) if current profile is a demo and user isn't admin. `calculateTotalMarketValue()` sums skill-level market rates with salary caps per function/seniority band. Welcome page has animated hero network (D3 force simulation).

**`checkReadOnly()`** — Uses manifest lookup (`profilesManifest.profiles.some()`) to detect sample profiles, not just string matching on template IDs. This ensures all manifest-loaded profiles are properly read-only.

**`switchProfile(templateId)`** — Full state cleanup: resets all `*Initialized` flags, clears `activeJobForNetwork`, `networkMatchMode`, removes match legend/job info tile/toggle DOM elements, then navigates to Skills view.

### Template & Profile Loading (L5950-7400, 12 functions)
`loadSkillLibraryIndex`, `searchSkills`, `getCategoryColor`, `isSkillAlreadyAdded`, `getSampleJobsForProfile`, `loadTemplate`, `initializeApp`

**`getSampleJobsForProfile(templateId, template)`** — Dynamic sample job engine (v4.19.2). Detects profile type from roles/title signals (6 types: recruiter, product, retail, trades, strategy, tech). Strategy is checked before tech in cascade to prevent false tech classification of executive profiles. Constructs 3 calibrated jobs per type:
- **High tier (~80%+):** 10 profile skills at matching proficiency + 1-2 soft gaps
- **Mid tier (~50-65%):** 6 profile skills (2 at stretch level) + 5-6 Required gaps
- **Low tier (<50%):** 3 profile skills as Preferred + 9-10 Required/Expert alien-domain gaps
- Gap pools: technical, finance, operations, data, management, creative (selected by profile type)
- BLS salary data attached via `matchJobToBLS()`
- All sample jobs flagged `sample: true`, locked for non-admin

**Profile type detection (L7013-7020):**
```
recruiter: /recruit|talent acqui|sourcing|staffing/ (roles/title only)
product:   /product manager|product lead|product director/ (roles/title only)
strategy:  /strateg|advisory|futurist|evangelist|transformation|chief|vp/ (roles/title only)
tech:      /engineer|developer|architect|software|devops/ (roles/title only)
retail:    /cashier|retail|store|merchandise/ (roles/title + skills)
trades:    /hair|stylist|cosmetolog|barber|electrician/ (roles/title + skills)
```

**Sample detection:** Uses `profilesManifest.profiles.some()` to identify manifest profiles (not string matching). Applied in `loadTemplate`, Firestore skip, and `checkReadOnly`.

**`loadTemplate(templateId)`** — Populates userData from template JSON. Injects sample jobs for all manifest profiles.

**`initializeApp()`** — Master init: loads manifest, fetches all JSON libraries (including BLS wages), builds profile selector, loads template, inits network.

### Onboarding Wizard (L7500-8600, 39 functions)
8-step wizard: Welcome -> Upload method -> Resume input -> AI parsing -> Profile edit -> Skills review -> Values -> Purpose -> Launch. Supports resume paste, file upload, or manual entry. Uses Anthropic API for resume parsing. Builds complete userData on completion.

### Network Visualization (L8600-9500, 26 functions)
Three D3 force-directed networks, all viewport-responsive:

**Viewport Scaling (v4.19.2):**
- `scaleFactor = min(width, height) / 900`, clamped 0.8-1.6
- Applied to: node radii, link distances, charge strengths, collision radii, radial spread, text offsets
- On large monitors (~1440p) the network fills ~30% more space
- Mobile uses fixed values (unaffected by scale)

**Center Node Positioning (v4.19.2):**
- Pinned to `height * 0.22` (upper area) so name is always readable above the network
- Gravity center at `height * 0.48` pulls roles/skills below the name
- Applied to all three network modes

**"You" mode** (`initNetwork`): User's skills grouped by role, color-coded by proficiency level
**"Job" mode** (`initJobNetwork`): Single job's required/preferred skills grouped by category
**"Match" mode** (`initMatchNetwork`): Overlay showing matched (green), gaps (red), surplus (gray)

**Match overlay colors:**
- Green (#10b981) = matched skill (user has it)
- Red (#ef4444) = gap skill (job needs, user lacks)
- Gray (#475569) = surplus skill (user has, job doesn't need)
- Blue (#60a5fa) = person center node only
- Role nodes: neutral slate fill with gray/red stroke

**Job Info Tile** (`addJobInfoTile`, L9255-9303): Upper-left glass-morphism tile showing job title, company, seniority badge, date, BLS salary range (25th-75th percentile), occupation title, source link. Responsive (full-width on mobile).

**Match Legend Panel** (`addMatchLegend`): Floating stats panel, top-right on desktop, bottom on mobile. Shows score (color-coded), matched/gaps/surplus counts, proficiency gap warning, close/view-details buttons.

**Lifecycle Management (v4.19.2, audited):**
- `switchView()`: Removes tile + legend when leaving network, restores them (re-renders via `setNetworkMatchMode`) on return
- `switchProfile()`: Clears `activeJobForNetwork`, `networkMatchMode='you'`, removes all overlay DOM
- `clearJobOverlay()`: Full cleanup, re-inits normal network
- Resize handler: Preserves match mode, re-renders correct view
- All cleanup points verified via stability audit

Key functions: `activateJobOverlay`, `clearJobOverlay`, `setNetworkMatchMode`, `switchView`, `filterByRole`, `filterByLevel`

### Card View (L10300-10600)
Alternative to network: grid of skill cards grouped by role, sorted by level. Includes bulk import/edit buttons, search, and the same filter bar as network view.

### Skill Modals (L11100-11400, 8 functions)
`openSkillModal` — Rich detail modal for any skill: market value, proficiency bar, evidence list, related skills, coaching, category info. Accessible from both network nodes and card view.

### Evidence Engine (L11400-12200)
Evidence-based skill validation system with outcome quality scoring (1-5 points), effective level calculation, and third-party verification workflow. Evidence CRUD UI with live scoring, edit-aware gap indicators. Certification-to-skill linking with tiered bump logic (Proficient/Advanced floors).

### Resume & Document Generation (L12200-12900)
ATS-compatible resume (jsPDF), cover letter, negotiation guide, interview prep, LinkedIn profile export. BLS salary data integrated into negotiation materials.

### BLS Salary Integration (v4.19.0)
**Data:** `bls-wages.json` with 75 SOC-mapped occupations covering 15 functional areas x 5 seniority tiers. Each entry has `pct10`, `pct25`, `median`, `pct75`, `pct90`, `occupation`, `soc`.

**`matchJobToBLS(titleText, descText)`** (L13908): Three-phase scoring algorithm:
1. Alias matching (weight 5) — longest phrase first
2. Keyword matching (weight 1) — individual terms
3. Returns top-scoring occupation with salary percentiles, or null if no BLS data

**Display points:** Job pipeline cards, job detail view, job info tile (network), negotiation guide. All guarded with `if (!window.blsWages) return null` and display-level `bls && bls.median` checks.

### Market Valuation (L14800-15600)
Two-mode valuation engine:
- **Evidence-Backed:** Uses effective levels from evidence scoring, salary caps per function/seniority band
- **Potential Value:** Uses claimed proficiency levels

Compa-ratio model for offer ranges (75%/85%/95%). Role-based salary floors. Premium cap at 35% above BLS median. Function detection from role signals for appropriate salary bands.

### Job Matching Engine (L13000-14000)
`matchJobToProfile(parsedJob)` — Scores user skills against job requirements. Synonym-aware matching. Proficiency gap detection. Produces `matchData: { matched, gaps, surplus, score }`.

`rescoreAllJobs()` — Re-runs matching for all saved jobs after skill changes.

### Job Pipeline (L14000-15600)
Full pipeline view with job cards showing match %, skill breakdown bar, BLS salary range. Job detail modal with matched/gap/surplus skill lists, proficiency gaps, and network match entry point.

### O*NET Library & Skill Picker (L18000-18400, 9 functions)
Full O*NET taxonomy browser with category tabs (Skills, Abilities, Work Styles, Knowledge, Activities, Trades). Search, filter, multi-select, batch add to profile.

### Custom Skill Builder (L18400-18500)
Create skills not in O*NET: name, category (unique), proficiency, roles, core/differentiator flag. Registers in skill library with synonyms.

### Bulk Import & Manager (L18500-18900, 14 functions)

**Bulk Import** (`openBulkImport`): Two input modes (paste text or CSV/TSV upload). Smart CSV parser with flexible column names. Synonym-aware deduplication. Three merge strategies (Skip, Keep higher, Overwrite). Two-step review with per-skill action override. Destination toggle: Library Only vs Library + Profile.

**Bulk Manager** (`openBulkManager`): Searchable skill list with checkboxes. Bulk set proficiency level. Bulk remove from profile.

### Skill Editing (L19100-19300, 12 functions)
`openEditSkillModal` — Edit any skill's proficiency, category, roles, evidence. Delete from profile. Universal access from network nodes and card view.

`openAssessSkillModal` — Guided self-assessment for unique skills.

`refreshAllViews()` — Master refresh: rebuilds skillsData, rescores jobs, re-renders active view.

### Skill Management Hub (L19300-19900, 15 functions)
Unified modal with two tabs: "Your Skills" (manage existing) and "Add Skills" (search all libraries + custom). Search across all O*NET categories simultaneously.

### Admin & Config (L19900-21149, 22 functions)
Theme toggle (dark/light), profile dropdown, filter panel, overflow menu. Help modal, About modal (shows current version), Legal/IP notice. Admin panel with user data viewer, profile switching.

---

## Version History

### v4.20.1 (current)
- **"Compare Skills" CTA moved above the fold** in Job detail. Previously "View Network Overlay" was buried at bottom of job detail page. Now positioned right after job header + match score, with bpIcon('network') icon and descriptive text.
- **Card view masonry layout** — CSS columns (3-col desktop, 2-col tablet, 1-col mobile) replace fixed grid. `break-inside: avoid` eliminates empty space between domain cards. Cards stack naturally by content height.
- **Toggle label fixes** — `toggleLabels()` rewritten to read actual checkbox state and query SVG directly (works across You/Job/Match networks). New `applyLabelToggles()` syncs toggle state after every network re-render. Called via `setTimeout` after `initNetwork()`, `initJobNetwork()`, `initMatchNetwork()`.
- **Role Info Card** — Replaces the small filter pill. When clicking a role node in the network, a glass-morphism card appears (top-left, 220-280px wide) showing: role name with color dot, total skill count, proficiency distribution (Mastery/Expert/Advanced/Proficient/Novice with colored dots), and core competency count. All role labels hidden on network when a role is selected (card carries the context). Card dismissed via X button or clicking "All" filter.
- **Card view SVG icons** — `roleIconMap` and `categoryMeta` converted from emoji to bpIcon names. `getRoleIcon()` returns SVG HTML. Domain header icons now theme-aware via `currentColor`.
- **Empty state icons** — Jobs "no jobs yet" and Applications "no applications" use SVG icons instead of large emoji.
- **Network controls visible in all modes** — Label toggles now show when in Job and Match network views, not just You view.

### v4.20.0
- **SVG Icon System:** `bpIcon()` function with ~60 stroke-based icons replacing all emoji. Icons use `currentColor` for automatic theme awareness. `hydrateIcons()` populates `data-icon` placeholders in static HTML.
- **Nav Restructure:** Desktop nav reduced from 4+hidden to 4 clean tabs: Skills | Jobs | Blueprint | Settings. Applications folded into Jobs as "Tracker" sub-tab. Settings promoted from overflow menu to primary nav. Consent absorbed into Settings > Privacy & Data tab.
- **Jobs sub-tabs:** Pipeline (was "Your Jobs") | Tracker (was standalone Applications view) | Find Jobs. Three-tab layout with icon labels.
- **Settings Privacy & Data tab:** New `renderPrivacyAndData()` combines sharing presets, sharing summary, backup/restore, legal/privacy info, and GDPR data rights actions. Replaces separate Consent view.
- **Overflow menu cleanup:** Removed Settings and Consent entries. Reduced to: Home, Build, Sample Profiles, Export, Help, About, Sign In/Out. All entries use SVG icons.
- **Mobile nav:** Updated to match desktop: Skills | Jobs | Blueprint | Settings | More. SVG icons throughout.
- **Export card icons:** All document generation cards (Executive Blueprint, Resume, PDF, Cover Letter, Interview Prep, LinkedIn, JSON) use purpose-specific SVG icons instead of emoji.
- **Section header icons:** All coaching tips, section headers, and action buttons across Settings, Blueprint, and Export use `bpIcon()` calls.

### v4.19.2 (stabilized)
- **Stability audit:** 22-point lifecycle, safety, and functional integration check
- **Network scaling:** Viewport-responsive `scaleFactor` (0.8-1.6) applied to all three network views
- **Center node positioning:** Name pinned to upper area (`height * 0.22`) with gravity at `height * 0.48`
- **Job info tile lifecycle fix:** Tile removed on view exit, restored on return
- **Profile switch cleanup:** Clears all match state, removes overlay DOM elements
- **Sample job detection:** Manifest-based lookup replaces string matching on template IDs
- **Profile type detection:** 6 types (recruiter, product, retail, trades, strategy, tech) using roles/title as primary signal, strategy checked before tech
- **Profile-appropriate gap pools:** management + creative pools added for retail/trades
- **Proficiency gap mobile fix:** flex-wrap replaces hardcoded min-width values

### v4.19.1
- Job info tile: upper-left glass-morphism tile with job context + BLS salary in network match view
- Resize state preservation: window resize re-renders active match mode instead of resetting
- Mobile skill visibility: backfill threshold raised to 25 (key -> expert -> advanced -> proficient)
- Match legend simplified: removed redundant job title/company (tile owns identity)

### v4.19.0
- BLS OEWS May 2024 wage data integration (75 occupations, 15 functions x 5 seniority levels)
- `matchJobToBLS()` three-phase scoring algorithm with alias system
- Salary display on job pipeline cards, detail view, and network tile
- SOC code mapping for accurate occupation-to-salary matching

### v4.18.x
- Salary caps per function/seniority band
- Values limit enforcement (3-7)
- Premium cap reduction from 125% to 35%
- Function detection priority fix for valuation

### v4.17.x
- Evidence/potential valuation toggle
- Role-based salary floors
- Auto-skill addition from certifications with bump logic
- Google auth redirect migration

### v4.16.x
- Certification library (191 credentials with tiered skill maps)
- Evidence CRUD UI with live scoring
- Card view evidence indicators
- Two-tier evidence floor system (Proficient/Advanced)

### v4.15.x
- Evidence-based skill validation system
- Outcome quality scoring (1-5 points)
- Effective level calculation
- Third-party verification workflow

### v4.14.1
- Fixed match overlay role node colors: neutral slate instead of profile-colored
- Repositioned match legend panel: top-right on desktop, full-width bottom on mobile
- Removed verbose debug console.logs
- Full audit: 0 duplicate functions, 0 missing onclick targets, balanced braces

### v4.14.0
- Calibrated sample jobs: Dynamic engine reads actual template skills. Three tiers per profile type.

### v4.13.0
- Match overlay stats panel with glass-morphism design

### v4.12.0
- Library-only import mode. Bulk skill manager. Roles made optional in all skill modals.

### v4.11.0
- Bulk skill import: paste text or CSV/TSV, synonym-aware dedup, three merge strategies.

### v4.10.1
- Toast CSS fix. Universal skill editing from network. Sample job injection for demo profiles.

### v4.9.0
- Jobs tab overhaul: pipeline view, Find Jobs, job detail, match overlay in network view.

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
- `init*` — Sets up a major feature (called once, re-called after profile switch)
- `open*/close*` — Modal lifecycle
- `switch*` — Tab/view navigation
- `save*` — Persist data
- `export*/generate*` — Create deliverables
- `matchJob*` — Job scoring/matching functions

### Modal Reuse
Most modals reuse `exportModal` container by swapping `.modal-content` innerHTML. Dedicated modals: `skillModal`, `customSkillModal`, `editSkillModal`, `assessSkillModal`, `bulkImportModal`, `bulkSkillManagerModal`, `onetPickerModal`, `skillManagementModal`.

### View System
`switchView(viewName)` manages: 'skills' (network/card), 'opportunities' (jobs with pipeline/tracker/find sub-tabs), 'blueprint', 'settings' (profile/experience/preferences/privacy tabs), 'consent' (legacy, redirects to settings>privacy), 'welcome'. Each has an `init*` function called on first visit (lazy init). Cleanup on exit removes match overlays; return restores them.

**Navigation structure (v4.20.0):**
- **Desktop nav:** Skills | Jobs | Blueprint | Settings (4 primary tabs)
- **Mobile nav:** Skills | Jobs | Blueprint | Settings | More (5 buttons)
- **Jobs sub-tabs:** Pipeline | Tracker | Find Jobs (Applications folded into Jobs)
- **Settings tabs:** Profile | Experience | Preferences | Privacy & Data (Consent absorbed)
- **Blueprint tabs:** Outcomes | Values | Purpose | Export
- **Overflow menu:** Home, Build My Blueprint, Sample Profiles, Export, Help, About, Sign In/Out

### Skill Level Scale
6 levels: Novice (1) -> Competent (2) -> Proficient (3) -> Advanced (4) -> Expert (5) -> Mastery (6). `proficiencyValue(level)` converts name to number.

### Toast System
`showToast(message, type)` — Types: 'success' (green), 'warning' (amber), 'error' (red), 'info' (blue). Auto-dismiss after 4s. Stacks multiple toasts.

### Sample Profile Detection
All sample/demo profile detection uses `profilesManifest.profiles.some(p => p.id === templateId)` as primary check, with fallback string matching for 'demo'/'sample' in template IDs. Applied consistently in: `loadTemplate`, `checkReadOnly`, Firestore skip logic.

---

## Known Considerations

1. **Parenthesis count is off by 3** — False alarm from parens inside regex patterns and template strings. Braces are perfectly balanced (4091/4091). App executes correctly.

2. **Legacy Consent view still exists** — The `consentView` div and `initConsent()` function remain in the DOM/JS for backward compatibility. The consent view is no longer in primary navigation but can still be rendered if navigated to directly. Its content has been absorbed into Settings > Privacy & Data tab via `renderPrivacyAndData()`. Safe to remove in a future cleanup pass.

3. **Legacy Applications view still exists** — The `applicationsView` div and `initApplications()` remain but `switchView('applications')` now redirects to Jobs > Tracker sub-tab. The old view is never displayed in normal navigation.

4. **~80 emoji instances remain in deeper UI** — Skill modals, compensation modal, wizard steps, toast messages, filter panel labels ("📊 Your Skills"), and various inline labels still use native emoji. A systematic cleanup pass is queued.

5. **Console.logs (129+)** — Kept intentionally for admin debugging. Key lifecycle markers (Firebase init, template loading, job scoring, profile type detection). No debugger statements.

3. **var/let/const mix** — 1763 var, 75 let, 689 const. Older code uses var, newer uses const/let. Not causing issues but could be modernized.

4. **Window exposures (221)** — Functions exposed via `window.functionName = functionName` for onclick handler access. Standard pattern for non-module SPA.

5. **setInterval without clearInterval (1)** — Auto-save timer at L9729 runs every 60s. Intentional, single-page app never needs to clear it.

6. **Event listeners (10 added, 0 removed)** — DOMContentLoaded(2), change(3), click(2), input(1), popstate(1), resize(1). All are page-level listeners that persist for app lifetime.

---

## Development Transcript History

Sessions stored in `/mnt/transcripts/`:
1. `2026-02-19-03-51-49-blueprint-v46-wizard-exports.txt`
2. `2026-02-19-14-57-36-hero-animation-profile-switch-fixes.txt`
3. `2026-02-19-15-17-20-hero-animation-profile-bugs-audit.txt`
4. `2026-02-19-15-40-07-v47-audit-fixes-ui-stub-inventory.txt`
5. `2026-02-19-16-59-35-v49-jobs-matching-overhaul.txt`
6. `2026-02-19-18-01-02-v410-skill-edit-sample-jobs-bugfix.txt`
7. `2026-02-19-19-07-15-v412-v413-bulk-import-manager-overlay-panel.txt`
8. `2026-02-19-20-08-08-blueprint-v414-next-features-planning.txt`
9. `2026-02-19-21-28-58-skill-validation-system-design.txt`
10. `2026-02-19-21-55-15-evidence-engine-verification-v416.txt`
11. `2026-02-19-22-18-55-evidence-crud-cert-library-design.txt`
12. `2026-02-19-22-35-24-cert-library-tier-system.txt`
13. `2026-02-19-23-02-29-valuation-toggle-cert-auto-skills-auth-fix.txt`
14. `2026-02-19-23-18-33-valuation-caps-values-limit-fix.txt`
15. `2026-02-19-23-47-43-salary-caps-sample-jobs-bls-data.txt`
16. `2026-02-20-00-30-03-bls-wage-data-integration-v4-19.txt`
17. `2026-02-20-01-00-26-job-info-tile-sample-jobs-v4-19-2.txt`
18. `2026-02-20-nav-restructure-icon-system-v4-20.txt` (current session)

---

## Priority Queue (Next Features)

### High Priority
- **Professional resume generation** — Next major feature per Cliff. Full ATS-compatible resume from profile data.
- **Job application tracking integration** — Connect pipeline jobs to tracker (basic integration done in v4.20.0, needs "Track This" button from job detail)
- **Find Jobs tab** — Remote API job search functionality (UI stub exists)
- **Remaining emoji cleanup** — ~80 emoji instances remain in deeper UI (skill modals, compensation modal, wizard steps, toast messages, filter panel labels). Systematic pass to convert all to bpIcon()

### Medium Priority
- **Career Narrative generator** — Synthesize outcomes + values + purpose into coherent story (enhances Purpose tab and export quality)
- **Animated transitions between network modes** — Smooth morph between You/Job/Match views
- **Drag-to-rearrange** in skill lists and card view
- **Evidence management UX improvements** — Streamline add/edit/remove evidence workflow
- **Skill gap development plans** — Suggest learning paths for gap skills

### Low Priority
- **var -> const/let modernization** — Cleanup pass on older functions
- **Code splitting** — Break monolith into modules (would require build tooling)
- **Offline support** — Service worker for PWA capability
- **Import from LinkedIn** — Parse LinkedIn data export
- **Remove legacy Consent view** — Currently still exists but redirects to Settings>Privacy. Can be fully removed after confirming no deep links depend on it.

---

## Creator & IP

Blueprint is the intellectual property of Cliff Jurkiewicz. All methodologies, ontology structures, and matching algorithms are original work. Copyright notices in About dialog and Legal Notice modal.
