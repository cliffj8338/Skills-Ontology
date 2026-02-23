# Blueprint™ — Project Context
**Version:** v4.26.0.6 | **Build:** 20260221-s20 | **Date:** 2026-02-21

---

## 1. WHAT BLUEPRINT IS

Blueprint™ is a career intelligence platform that maps professional skills through interactive visualizations. It's a single-page web app (SPA) served from GitHub Pages at `cliffj8338.github.io/Skills-Ontology/`. The app consists of two files:

- **index.html** — 20,388 lines (1,169 KB) — all JS, HTML structure, and inline data
- **blueprint.css** — 3,844 lines (119 KB) — all CSS, extracted from inline `<style>` in v4.26.0

Both files must be co-located in the same directory. The CSS is independently cacheable.

### Core Features
- **Skills Network Visualization** (D3.js force graph) — interactive network showing roles, skills, and connections
- **Card View** — alternative grid-based skill display
- **Job Matching** — compares user skills against job requirements
- **Blueprint PDF Export** — generates comprehensive PDF via jsPDF
- **Work History / Education** — timeline-based career data
- **Settings** — theme (dark/light), profile management
- **Sample Profiles** — demo mode with fictional characters (Walter White, Eleven, Siobhan Roy, etc.)
- **Firebase Auth** — sign-in/sign-up (waitlist-gated)
- **Skill Library** — 14,000+ skills from ESCO/O*NET taxonomies

### Tech Stack
- Vanilla JS (no framework) — ES6 with some `var` for broad compat
- D3.js v7 (CDN) — network visualization + force simulation
- jsPDF (CDN) — PDF generation
- Firebase (CDN) — auth + Firestore
- CSS custom properties for theming (114 `--c-*` variables, dark/light)
- Google Fonts: Outfit (UI), Crimson Pro (PDF), JetBrains Mono (code)

---

## 2. ARCHITECTURE

### File Structure
```
/Skills-Ontology/
├── index.html              # Main SPA (20K lines)
├── blueprint.css           # All styles (3.8K lines)
├── templates/              # Sample profile JSON files
│   ├── walter-white.json
│   ├── eleven.json
│   ├── siobhan-roy.json
│   └── ...
├── skill_evidence/         # Evidence data per profile
│   ├── walter-white.json
│   └── ...
├── data/
│   ├── skills_library.json       # Master skill library
│   ├── skills_index.json         # Search index
│   ├── bls_wages.json            # Bureau of Labor Statistics wage data
│   └── esco_*.json               # ESCO taxonomy files
└── assets/                 # Static assets
```

### Key Architectural Patterns

**State Management:** Global variables — `userData`, `skillsData`, `opportunitiesData`, `isReadOnlyProfile`, `simulation` (D3). No state management library.

**View System:** Hash-based routing (`#network`, `#card`, `#jobs`, `#blueprint`, `#settings`). `switchView()` function manages tab state and re-renders.

**Read-Only Mode:** `isReadOnlyProfile` flag + `readOnlyGuard()` function (65 call sites). Sample profiles are locked — all mutations blocked, edit buttons hidden via `isReadOnlyProfile` checks in render functions. CSS selector blocklist in blueprint.css (47 selectors with `pointer-events:none` etc.).

**Theming:** CSS custom properties in `:root` (dark) and `[data-theme="light"]` blocks. 114 `--c-*` variables. Theme toggle via `data-theme` attribute on `<html>`. The old `tv()` function was eliminated in v4.26.0 — zero JS overhead for theming now.

**Network Visualization:**
- Center node = person's name, pinned at `width * 0.28` (left offset)
- Role nodes = colored circles orbiting around `width / 2` (true viewport center)
- Skill nodes = small circles connected to roles
- Force simulation: `forceCenter`, `forceX`, `forceY`, `forceRadial`, `forceCollide`, `forceManyBody`
- Interaction: drag to hard-pin (white ring indicator), click skill to open detail modal, click center to reset all pins
- Drag vs click: `_dragMoved` flag distinguishes real drags from clicks
- Mobile: reduced skill count (top 25), centered layout, touch-friendly

**Modals:** 10 modal elements in HTML. Each has open/close functions. Skill modal (`openSkillModal`) is read-only-safe and shows: proficiency level, years experience, evidence quality panel, roles, market impact, verification badges. Mutation buttons (Add Outcome, Edit, Delete, Assess) are conditionally hidden in read-only mode.

### Function Count & Categories
- **Total functions:** ~449
- **readOnlyGuard calls:** 65
- **console.log statements:** 63 (includes operational logs)
- **console.error:** 35

---

## 3. VERSION HISTORY (Current Session)

### v4.26.0.0 — CSS Extraction
- Extracted 3,610 lines from `<style>` to `blueprint.css`
- Eliminated `tv()` function: 449 calls → 114 CSS custom properties
- Removed `tb()` helper function
- Removed dead code: `calculateMatchScore` (87 lines), `showPitchModal` (35 lines), `initNetworkWithHighlight` (169 lines), `filterSkillsList` (6 lines) = 297 lines

### v4.26.0.1 — Network Hard Pin
- Drag pins nodes in place (fx/fy persist after drop)
- White ring indicator on pinned nodes
- Center node offset to `width * 0.72` (later revised)
- Click center → `resetNetworkLayout()` with pulse animation + toast

### v4.26.0.2 — Network Layout Fix
- **Network body** forces target `width / 2` (centered)
- **Name node** offset independently to `width * 0.18` (later revised)
- Reset restores center node to `homeX`/`homeY`

### v4.26.0.3 — UI Polish
- Name offset adjusted to `width * 0.28`
- Smart tooltip positioning (viewport-aware, flips at edges)
- Tooltip z-index bumped to 10000

### v4.26.0.4 — Skill Modal from Network
- `_dragMoved` flag: pure clicks pass through to open skill modal
- Enriched tooltips: level + years + "Click for full detail"
- Role tooltips: skill count + "Click to filter"
- Mutation buttons hidden in read-only mode (Add Outcome, Edit, Delete, Assess)

### v4.26.0.5 — Null Guards
- `skillData.level` → fallback to `'proficient'`
- `skillData.roles` → `(skillData.roles || [])` before forEach
- Display: `skillData.level || 'Proficient'`

### v4.26.0.6 — Audit & Dead Code Cleanup
- Removed 10 dead functions (87 lines): `bodyText`, `drawPill`, `copyPitch`, `downloadPitch`, `trackFromPitch`, `returnToOpportunities`, `openONETPicker`, `openCustomSkillBuilder`, `openSkillManagement`, `currentSkillManagementTab`
- Fixed `d.level.toLowerCase()` null crash in dimmed filter
- Cleaned debug console.log statements from `openSkillModal`

---

## 4. PREVIOUS SESSION HISTORY

### Session 1: Work History Date Formatting
- Fixed ISO date display in work history (formatDate utility)

### Session 2: Mobile UI + Import Lockdown
- Fixed network/card rendering on mobile (empty nodes, blank cards, layout height)
- Null safety for `skill.level` / `skill.roles`
- Comprehensive read-only lockdown: 66 `readOnlyGuard()` calls, 47 CSS selectors

### Session 3: Read-Only Hardening + Architecture Analysis
- Export tab restrictions, Skills Management UI hiding
- Network center node offset (first iteration)
- Tooltip null-safety
- Architecture analysis document (modularization roadmap)

### Session 4: CSS Extraction + Network Pinning (current)
- CSS extraction to external file
- tv() elimination
- Network interaction model (drag-pin, click-reset)
- Multiple rounds of position tuning
- Skill modal from network clicks
- Full codebase audit

---

## 5. AUDIT FINDINGS

### Resolved This Session
| Issue | Status |
|-------|--------|
| 10 dead functions (87 lines) | ✅ Removed |
| `d.level.toLowerCase()` null crash | ✅ Fixed |
| Evidence debug console.logs | ✅ Cleaned |
| Tooltip z-index below cards | ✅ Fixed (→ 10000) |
| Tooltip clipping at viewport edges | ✅ Smart positioning |
| Mutation buttons visible in demo | ✅ Hidden in read-only |

### Known — Not Bugs (Feature Stubs)
These are UI/HTML elements for features not yet fully wired — they're gated by `demoGate()` or `readOnlyGuard()`:
- `openONETPicker` — was dead, removed (modal HTML remains for future use)
- `openCustomSkillBuilder` — was dead, removed (modal HTML remains)
- `openSkillManagement` — was dead, removed (modal HTML remains)
- Wizard onboarding elements (`wizardEmail`, `wizardName`, etc.) — future feature
- `onboardingWizard`, `adminWaitlistContent` — admin features
- `totalMarketValue` — dynamically created element

### Low Priority Observations
- **63 console.log statements** — mostly operational (template loading, profile switching). 5 verbose template-debugging logs could be removed.
- **Duplicate `sectionHead` function** — two definitions at lines ~10599 and ~11446, both inside PDF generation scope (different signatures, both are IIFEs so no collision).
- **`drawNetworkPage` / `drawDistributionPage`** — appear "dead" in function scan but are IIFEs inside PDF generator (self-invoking). NOT dead.
- **11x `networkInitialized` assignments** — multiple view-switching paths reset this flag. Functional but noisy.
- **CSS custom properties** — perfect 114:114 match between JS usage and CSS definitions.
- **All CSS classes** — no orphans; every class used in JS is defined in CSS.
- **All onclick handlers** — every function called from `onclick` attributes is defined.
- **All modal close functions** — defined and working for all 10 modals.

---

## 6. PENDING ARCHITECTURE WORK

From the architecture analysis document created in Session 3, these phases remain:

### Phase 2: PDF Template Extraction
- Move PDF generation (`generateBlueprintPDF` + all draw* functions) to `blueprint-pdf.js`
- Estimated: ~2,500 lines extractable

### Phase 3: Data Layer Extraction
- Move template loading, Firebase operations, data transforms to `blueprint-data.js`
- Estimated: ~1,500 lines

### Phase 4: State Consolidation
- Replace scattered globals with single `AppState` object
- Event-based state change notifications

### Phase 5: View Modules
- Extract each view (network, card, jobs, blueprint, settings) into modules
- ~2,000-3,000 lines each

### Other Pending Items
- Additional sample profiles
- Waitlist / onboarding flow completion
- Mobile experience refinement
- Performance optimization for large skill sets
- Accessibility audit (ARIA labels, keyboard navigation)

---

## 7. KEY PATTERNS FOR NEW SESSIONS

### When Editing index.html
1. Always work on `/home/claude/index.html` (copy from outputs first if needed)
2. Use `str_replace` for targeted edits — never rewrite large sections
3. Bump version comment AND `BP_VERSION` variable on every change
4. Copy both files to `/mnt/user-data/outputs/` before presenting
5. Test null-safety — many skill properties (`level`, `roles`, `evidence`, `yearsExperience`) can be undefined

### Common Variable Locations
- `BP_VERSION` — near top of `<script>` block (~line 915)
- `isReadOnlyProfile` — set during profile loading (~line 2580)
- `readOnlyGuard()` — function definition (~line 2570)
- `simulation` — D3 force simulation variable, global scope
- `skillsData` — processed skill data used by all views
- `userData` — raw user data from template/Firebase

### Version Comment Format
```html
<!-- v4.26.0.6 | 20260221 | Brief description of changes -->
```

### Build Identifier Format
```
20260221-s20   (date-sessionNumber)
```
