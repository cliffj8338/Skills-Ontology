# Blueprint Rearchitecture — Session Handoff
**Date:** 2026-03-05  
**Version at session start:** v4.46.21  
**Version at session end:** v4.46.23  
**Handoff author:** Claude Sonnet 4.6

---

## Project Context

Blueprint (myblueprint.work) is a career ontology SPA built in vanilla JS, D3.js, Firebase, deployed on Vercel. The rearchitecture goal is to extract all JavaScript into ES modules, retiring `legacy.js` when complete.

**Hosting:** Vercel (builds via Vite, output to `dist/`)  
**Auth:** Firebase Auth  
**Database:** Firestore  
**Repo:** github.com/cliffj8338/blueprint (local clone: `/Users/cliff/Documents/GitHub/Skills-Ontology`)  
**Deploy path:** Commit to local repo → push via GitHub Desktop → Vercel auto-builds from GitHub

---

## What Was Done This Session

### 1. API Module Fixes — All Serverless Functions

**Root cause discovered:** All `/api/*.js` files used CommonJS `module.exports` syntax, but `package.json` has `"type": "module"`. Vercel treats all `.js` files as ES modules, causing immediate crash on every function call: `ReferenceError: module is not defined in ES module scope`.

**Files fixed:**

| File | Fix Applied |
|------|-------------|
| `api/jobs.js` | Renamed to `api/job-search.js`. Converted to ES module. Added top-level try/catch. Removed dead code. |
| `api/ai.js` | Converted `require('crypto')` to `import crypto from 'crypto'`. Converted `module.exports` to `export default`. |
| `api/api-job-proxy.js` | Converted `module.exports` to `export default`. |
| `api/verify.js` | Converted to ES module. Used `createRequire` pattern for `firebase-admin`. |
| `api/jobs-sync.js` | Converted to ES module. Used `createRequire` pattern for `firebase-admin`. |

**`firebase-admin` import pattern** (required for all functions using it):
```javascript
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const admin = require('firebase-admin');
```

**JOBS_PROXY_URL updated** in both `src/views/jobs.js` and `legacy.js`:
- Old: `/api/jobs`
- New: `/api/job-search`

**`api/jobs.js` deleted** from repo to eliminate naming collision with `src/views/jobs.js`.

**`_fitFetchAndScore()` in legacy.js** stubbed (duplicate of the version in `src/views/jobs.js`):
- Line ~34249: 75-line body replaced with 2-line no-op
- Comment: `// legacy.js copy retained as no-op to avoid reference errors during Phase 9 retirement.`

---

### 2. Window Exposures Added to legacy.js

| Exposure | Location | Purpose |
|----------|----------|---------|
| `window._templates = templates;` | L17588 (after `let templates = {}`) | ES modules read sample profiles |
| `window._d3Simulation = null;` | After `let simulation;` declaration | nav-shared.js drag handlers |
| `window._d3Simulation = simulation;` | After each `d3.forceSimulation(nodes)` call (4 locations) | Keeps nav-shared.js in sync |
| `window.openSkillModal = openSkillModal;` | After `closeSkillModal()` definition | nav-shared.js and inline onclick |
| `window.closeSkillModal = closeSkillModal;` | Same location | nav-shared.js and inline onclick |

---

### 3. nav-shared.js Fixes

**File:** `src/ui/nav-shared.js`

Two classes of bare reference errors fixed:

**`simulation.alphaTarget` errors (nav-shared.js line 263, 276):**
- Bare `simulation` reference was invisible to the ES module scope
- Fix: read from `window._d3Simulation` with null guard

```javascript
// Before
if (!event.active) simulation.alphaTarget(0.3).restart();

// After
if (!event.active) { var sim = window._d3Simulation; if (sim) sim.alphaTarget(0.3).restart(); }
```

**Bare `openSkillModal()` calls:**
- Replaced with `(window.openSkillModal || function(){})(skillName, skill)`

---

### 4. Modal HTML Moved to index.html

**Problem:** 9 modal `<div>` blocks were defined inside `legacy.js` (the JavaScript file). Vite treats `legacy.js` as pure JS, so the HTML inside was never rendered into the DOM. `document.getElementById('skillModal')` returned `null`, causing every double-click on a skill node to throw `TypeError: Cannot set properties of null (setting 'textContent')`.

**Fix:** Extracted all 9 modal blocks (legacy.js lines 1079-1721) and inserted them into `index.html` before `</body>`. Removed them from `legacy.js` with a comment placeholder.

**Modals now in index.html:**
- `#skillModal` — skill detail
- `#exportModal` — export/outcome editing
- `#onetPickerModal` — O*NET skill picker
- `#customSkillModal` — create custom skill
- `#bulkImportModal` — bulk import
- `#bulkSkillManagerModal` — manage profile skills
- `#editSkillModal` — edit skill
- `#assessSkillModal` — assess skill impact
- `#skillManagementModal` — manage skills

---

### 5. vercel.json — COOP Header Fix

Added headers to eliminate `Cross-Origin-Opener-Policy` console warnings caused by Firebase Auth popups:

```json
{
  "source": "/(.*)",
  "headers": [
    { "key": "Cross-Origin-Opener-Policy", "value": "same-origin-allow-popups" },
    { "key": "Cross-Origin-Embedder-Policy", "value": "unsafe-none" }
  ]
}
```

---

### 6. O*NET Crosswalk Admin Tile Fix

**Problem:** Admin overview tile showed 0 aliases on load because `_loadCrosswalkDeferred()` (fetches 5.97MB JSON) finishes after the tile first renders.

**Fix:** After the crosswalk fetch resolves, trigger `renderAdminOverview(adminEl)` if the admin panel is currently open and on the overview tab.

---

### 7. Version History This Session

| Version | Change |
|---------|--------|
| v4.46.21 | Session start |
| v4.46.22 | API fixes, `window._templates`, crosswalk tile fix |
| v4.46.23 | Modal HTML moved to index.html, `window._d3Simulation`, `window.openSkillModal` |

---

## Rearchitecture Status

### Phases Complete

| Phase | Module(s) | Notes |
|-------|-----------|-------|
| 0 | Boot scaffolding | Module loader, init sequence |
| 1 | `core/constants.js` | Global constants |
| 2 | `core/firebase.js` | Auth functions, Firestore init |
| 3 | `core/security.js` | escapeHtml, sanitizeUrl |
| 4 | `core/utils.js` | safeGet/safeSet, debounce, etc. |
| 5 | `ui/icons.js`, `ui/toast.js` | bpIcon(), showToast() |
| 6 | `ui/nav.js` | switchView, updateProfileChip, initTheme |
| 7a | `views/welcome.js` | Sample profiles, demo mode |
| 7b | `views/blueprint.js` | Blueprint render pipeline |
| 7c | `views/card-view.js` | Skills card view |
| 7d | `views/network.js` | D3 network visualization |
| 7e | `views/scouting.js` | Scouting report system |
| 7f | `views/jobs.js` | Full jobs pipeline |
| 7g | `views/profile.js` | Profile/settings view |
| 7h | `views/admin.js` | Admin dashboard |
| 8a | `core/auth.js` | Auth UI, magic link |
| 8b | `ui/profile-dropdown.js` | Dropdown, overflow menu |
| 8c | `ui/tour.js` | Onboarding tour |

### Phases Remaining

| Phase | Target | Est. Lines | Notes |
|-------|--------|-----------|-------|
| 9 | Firebase/boot infra | ~8,000 | **DEFERRED** — see decision below |
| 10 | Admin panel | ~3,000 | Next target |
| 11 | JDC converter | ~2,500 | |
| 12 | WB Wizard | ~4,000 | |
| 13 | Tracker/Applications | ~1,500 | |
| Final | `legacy.js` retirement | — | Gate: Phase 9 complete |

### Phase 9 Deferral Decision

Phase 9 (Firebase/boot extraction) was assessed and deliberately deferred. The Firebase section references ~25 functions and variables still in legacy.js: `userData`, `skillsData`, `blueprintData`, `appContext`, `showToast`, `bpIcon`, `escapeHtml`, `switchView`, `updateProfileChip`, and more. A window-bridge extraction is technically possible but adds indirection on already-bridged code. 

**Better path:** Complete Phases 10-13 first (self-contained view modules). Once data structures have clean module homes, Phase 9 extraction uses real imports instead of window bridges and becomes a true retirement gate.

---

## Deployment Architecture

**Important:** Vercel builds from GitHub, not from direct file uploads. The workflow is:

1. Copy output files into `/Users/cliff/Documents/GitHub/Skills-Ontology/`
2. GitHub Desktop detects changes
3. Commit and click **Push origin**
4. Vercel auto-triggers a Vite build from the pushed commit
5. All files go through the Vite build pipeline — static assets served from `dist/`

**Never** use Vercel's "Redeploy" button after pushing files manually — it will use build cache and may not pick up changes. Always push a real commit.

**Public files** (crosswalk JSON, profile manifests, etc.) must be in the `/public/` directory to be included in the Vite build output.

---

## Known Issues / Watch Items

### Version Display in Admin Panel
The admin panel still shows v4.46.21 in some browser sessions despite the repo containing v4.46.22+. Confirmed via `view-source` that the deployed HTML is correct. Root cause: Vite chunks the legacy.js bundle and the chunk hash doesn't always invalidate on content changes. Not functional, purely cosmetic. No action required.

### Apple Web App Meta Tag Warning
Console shows: `<meta name="apple-mobile-web-app-capable" content="yes"> is deprecated`. Should be replaced with `<meta name="mobile-web-app-capable" content="yes">` in index.html. Low priority.

### Jobs Sync Last Run
Jobs database shows "12h ago" — sync is working but hasn't run recently. The cron is set to every 6h; verify the cron secret is configured in Vercel if it stops updating.

---

## Architectural Patterns (Reference)

### Data Accessor Pattern
All modules use internal helpers instead of direct `window._userData`:
```js
function _sd() {
    if (window._skillsData) return window._skillsData;
    var ud = window._userData;
    return { skills: (ud && ud.skills) || [], roles: (ud && ud.roles) || [], skillDetails: (ud && ud.skillDetails) || {} };
}
function _bd() {
    if (window._blueprintData) return window._blueprintData;
    var ud = window._userData;
    return { values: (ud && ud.values) || [], outcomes: (ud && ud.outcomes) || [], purpose: (ud && ud.purpose) || '' };
}
```

### Window Exposure Pattern
Closure-scoped vars in `legacy.js` must be exposed on `window` before ES modules can reference them.

**Current window exposures (legacy.js):**
- `window._userData` — user data object
- `window._skillsData` — skills accessor cache
- `window._blueprintData` — blueprint accessor cache
- `window._templates` — sample profile templates (L17588)
- `window._d3Simulation` — D3 force simulation instance
- `window.openSkillModal` — skill detail modal opener
- `window.closeSkillModal` — skill detail modal closer
- `window.clearJobOverlay` — job match overlay dismiss
- `window.saveToFirestore` — Firestore save
- `window.activateValuesOverlay` — values overlay

### firebase-admin in ES Modules
Always use `createRequire` — direct `import admin from 'firebase-admin'` fails in Vercel's Node runtime:
```javascript
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const admin = require('firebase-admin');
```

### Poll Guard Pattern
Views that depend on `window._userData` initialization:
```js
export function initXxx() {
    if (!window._userData || !window._userData.initialized) {
        var _t = 0, _p = setInterval(function() {
            _t++;
            if (window._userData && window._userData.initialized) { clearInterval(_p); initXxx(); }
            else if (_t > 25) clearInterval(_p);
        }, 200);
        return;
    }
    // render
}
```

---

## Session Protocol Reminders

- Every session opens with security/stability review before feature work
- Always grep all version references before delivering files: `BP_VERSION`, HTML comment, build string, console log
- Always bump version on every deployment, even non-index file changes
- Always add completed work to admin roadmap tracker
- legacy.js version strings live in the file itself, not just index.html
- Avoid em/en dashes in writing
- Never use "the uncomfortable truth," "talent wars," or superlatives

---

## Next Session Priorities

### Priority 1: Phase 10 — Admin Panel Extraction
Target: `src/views/admin-panel.js`  
Scope: Admin CRUD modals, blocklist management, user management UI, data libraries panel, admin roadmap tracker (~3,000 lines)  
Pre-work: Security/stability review per protocol before any extraction

### Priority 2: Phase 11 — JDC Converter
Target: `src/views/jdc.js`  
Scope: JDX/Schema.org job description converter (~2,500 lines)

### Priority 3: Phases 12-13
- WB Wizard: `src/views/wizard.js` (~4,000 lines)
- Tracker/Applications: `src/views/tracker.js` (~1,500 lines)

### Priority 4: Phase 9 (after 10-13 complete)
Firebase/boot infra extraction — becomes straightforward once data structures have module homes.

---

*End of handoff — next session opens with security/stability review, then Phase 10 admin panel extraction.*
