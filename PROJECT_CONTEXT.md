# Blueprint — Project Context
## Last Updated: 2026-02-20 (Session 16 Final) · v4.25.1.23

---

## WHAT IS BLUEPRINT

Blueprint is a career intelligence platform that maps professional skills through interactive visualizations and generates career deliverables. Built as a single-page application (~24,128 lines) in one `index.html` file. Domain: **myblueprint.work** (primary), **getblueprint.work** (redirect/marketing).

**Core insight:** "You are not your resume." Most professionals can name 15–20 skills. Blueprint maps 150–300 using a 14,000+ skill ontology (O*NET + ESCO datasets).

---

## FILE & ARCHITECTURE

**Single file:** `index.html` — ~24,128 lines, ~1.2MB
**No build system.** Pure HTML/CSS/JS. CDN dependencies only.
**Hosted:** GitHub Pages at `cliffj8338.github.io/Skills-Ontology/`

### CDN Dependencies
- Firebase 10.7.0 (Auth, Firestore)
- jsPDF 2.5.1 (PDF generation)
- D3.js 7 (network visualization)
- Google Fonts (Outfit, JetBrains Mono)

### Versioning
4-part version: `v{major}.{minor}.{patch}.{build}` (e.g., v4.25.1.23)
- `BP_VERSION` constant at top of script — single source of truth
- Referenced in: console banner, About modal, admin overview
- HTML comment + boot comment are hardcoded labels
- **Always bump version on every delivery**

### Global State Variables
```
fbUser, fbIsAdmin, fbDb    — Firebase auth/admin/Firestore
skillsData                  — { skills: [], roles: [] }
userData                    — { profile: {}, savedJobs: [], applications: [], preferences: {},
                               workHistory: [], education: [], certifications: [] }
blueprintData               — { outcomes: [], values: [], purpose: '' }
isReadOnlyProfile           — True when viewing sample as non-admin
appMode                     — 'demo' | 'waitlisted' | 'invited' | 'active' (admin → always active)
waitlistPosition            — Queue number (int or null)
currentView                 — Current main nav view
blueprintTab                — 'dashboard' | 'skills' | 'experience' | 'outcomes' | 'values' | 'export'
valuationMode               — 'evidence' | 'potential' (drives dual cards + detail section)
skillValuations             — Market value data (BLS-based)
adminSubTab                 — 'overview' | 'users' | 'samples' | 'waitlist' | 'config'
BP_VERSION                  — Version constant (e.g., 'v4.25.1.23')
```

### Navigation Structure
```
Primary Nav:  [Skills] [Jobs] [Blueprint] [Settings] [Samples]
Skills:       Network graph / Card view (toggle)
Jobs:         Pipeline (saved) / Tracker (applications) / Find Jobs (API)
Blueprint:    Dashboard / Skills / Experience / Outcomes / Values / Export
Settings:     Profile / Preferences / Privacy & Data
Samples:      TV show collection browser (Breaking Bad / Stranger Things / Succession)
Admin:        Overview / Users / Samples / Waitlist / Config (admin-only, full page)
```

### Key Functions
```
renderBlueprint()              — Main Blueprint tab renderer (6 tabs)
renderDashboardTab()           — Dashboard command center
renderSkillsManagementTab()    — Skills management by domain
renderExperienceTab()          — Wraps renderExperienceSettings()
renderExportSection()          — Export tab with 4 grouped sections + exportCard() helper
generatePDF(data, targetJob)   — PDF gen (optional job for scouting reports)
generateScoutingReport(idx)    — Targeted PDF with match analysis
matchJobToProfile(parsed)      — 4-tier fuzzy skill matching (normalizes string arrays)
calculateTotalMarketValue()    — BLS-based salary model
exportBlueprint(format)        — Export dispatcher (pdf/html/json/clipboard)
switchView(view)               — Main nav router (incl. admin view)
initAdminView()                — Full-page admin dashboard renderer
renderAdminOverview(el)        — Admin overview with analytics
loadPlatformAnalytics()        — Async Firestore analytics aggregation
logAnalyticsEvent(type, meta)  — Event tracking to analytics_events collection
rescoreAllJobs()               — Recompute all job match scores against current skills
loadUserFromFirestore(uid)     — Load user data, clear scaffold for signed-in users
updateAuthUI()                 — Profile chip, admin buttons, auth state
updateProfileChip(name)        — Name + Google photo in nav
detectAppMode()                — Sets appMode from auth + localStorage + Firestore
normalizeUserRoles()           — Ensures roles have id, color, skills[] (called on every profile load)
viewSampleProfile()            — TV show collection page (3 tabs, 15 characters)
selectShowCollection(showId)   — Renders show-specific character grid
initNetwork()                  — Main D3 force network (calls normalizeUserRoles first)
```

---

## SAMPLE PROFILES SYSTEM (v4.25.1.17–23)

### Architecture
- `profiles-manifest.json` — registry of all 15 profiles with id, name, title, path, enabled
- `profiles/demo/{id}.json` — individual profile data files
- Profiles loaded at boot via manifest → fetch each JSON → stored in `templates[id]`
- Profile switching via `switchProfile(templateId)` → `loadTemplate()` → `initializeMainApp()`
- **Manifest normalization (v4.25.1.23):** Code handles both array `[...]` and object `{profiles: [...]}` — bare arrays get wrapped at load time

### TV Show Collections (15 profiles)

**Breaking Bad** (green `#22c55e`):
| ID | Character | Skills | Evidence | Work History | Education | Certs |
|----|-----------|--------|----------|--------------|-----------|-------|
| `walter-white` | Walter White | 32 | 6 | 5 | 3 | 1 |
| `gus-fring` | Gus Fring | 29 | 5 | 4 | 2 | 1 |
| `hank-schrader` | Hank Schrader | 25 | 5 | 4 | 2 | 2 |
| `jesse-pinkman` | Jesse Pinkman | 21 | 4 | 3 | 1 | 0 |
| `saul-goodman` | Saul Goodman | 24 | 5 | 4 | 3 | 1 |

**Stranger Things** (red `#ef4444`):
| ID | Character | Skills | Evidence | Work History | Education | Certs |
|----|-----------|--------|----------|--------------|-----------|-------|
| `jim-hopper` | Jim Hopper | 21 | 5 | 4 | 2 | 2 |
| `eleven` | Eleven (Jane Hopper) | 16 | 3 | 2 | 1 | 0 |
| `steve-harrington` | Steve Harrington | 17 | 4 | 3 | 1 | 1 |
| `dustin-henderson` | Dustin Henderson | 21 | 5 | 3 | 2 | 0 |
| `joyce-byers` | Joyce Byers | 18 | 4 | 4 | 1 | 0 |

**Succession** (gold `#c4a035`):
| ID | Character | Skills | Evidence | Work History | Education | Certs |
|----|-----------|--------|----------|--------------|-----------|-------|
| `logan-roy` | Logan Roy | 20 | 5 | 4 | 2 | 0 |
| `kendall-roy` | Kendall Roy | 19 | 4 | 4 | 3 | 0 |
| `shiv-roy` | Siobhan "Shiv" Roy | 21 | 5 | 4 | 3 | 0 |
| `roman-roy` | Roman Roy | 17 | 3 | 3 | 2 | 0 |
| `tom-wambsgans` | Tom Wambsgans | 22 | 5 | 4 | 2 | 1 |

**Totals:** 323 skills, 68 evidence items, 46 work history entries, 27 education records, 10 certifications

### Profile Data Structure
Each profile JSON contains:
```json
{
  "profile": { "name", "title", "location", "summary", "roleLevel" },
  "skills": [{ "name", "level", "category", "evidence": [{ "description", "outcome" }] }],
  "roles": [{ "name" }],
  "workHistory": [{ "title", "company", "startDate", "endDate", "description", "achievements" }],
  "education": [{ "degree", "institution", "year", "field" }],
  "certifications": [{ "name", "issuer", "year" }],
  "values": [{ "name", "selected" }],
  "savedJobs": [{ "title", "company", "parsedSkills", "curated": true }]
}
```

### Job Match Realism
Each job has 13-20 `parsedSkills` — a mix of skills the character HAS (creating matches) and skills they DON'T have (creating realistic gaps). Jobs use `curated: true` flag to skip auto-generated sample jobs. `matchJobToProfile()` normalizes string arrays to objects.

### Samples Page UI
- Header: "SAMPLE BLUEPRINTS" (uppercase, Outfit font, letter-spacing 0.08em)
- Three color-coded tab selectors (Breaking Bad green, Stranger Things red, Succession gold)
- Show banner with tagline + description
- 5 character cards per show with initials avatar, emoji, title, description, skill count, "View →" button

### Read-Only Protection
- `isReadOnlyProfile` = true when viewing sample as non-admin
- `readOnlyGuard()` blocks: add skill, delete skill, edit outcome, add outcome, edit skill modal
- Skill detail modal hides Edit/Assess/Verify/Remove action bar for read-only
- Card view hides Edit/Delete buttons for read-only
- Admin retains full editing + JSON export via admin panel

---

## D3 NETWORK VISUALIZATION

### Four Network Views
1. **Main Network** (`initNetwork()`) — user's skills grouped by roles
2. **Match Overlay** — job match visualization with matched/surplus/gap states
3. **Job Overlay** — job-specific network with category grouping
4. **Highlight Network** (`initNetworkWithHighlight()`) — skills highlighted by job match

### Node Z-Order
All four views call `.raise()` on role and center nodes after initial draw, ensuring character/user name and role labels render on top of skill nodes.

### Link Safety
All network views validate links before passing to D3 via `validRoleIds` / `validMatchRoleIds` / `validNodeIds` sets. Missing role references are silently skipped.

### Mobile Skills Labels (v4.25.1.23)
- Label visibility controlled via `.hide-skill-labels` CSS class on SVG element
- Touch targets enlarged to 48×28px for toggle controls
- CSS-class-based approach replaced fragile D3 data-bound filtering on mobile

---

## ROLE NORMALIZATION

Profiles store bare roles as `{name: 'Chemistry Professor'}`. The app requires `{id, name, color, skills[]}` for D3 network rendering. `normalizeUserRoles()` handles this:

- Assigns `role.id = role.name`
- Assigns `role.color` from 8-color palette
- Builds `role.skills[]` by scanning `userData.skills` for role references

Called in: `switchProfile()`, wizard completion, `initializeMainApp()`, and as safety net inside `initNetwork()`.

---

## FIREBASE STRUCTURE

### Collections
```
users/{uid}/              — Full user profile + skills + jobs + applications
waitlist/{docId}/         — Name, email, type, status, position, createdAt
analytics_events/{auto}/  — type, uid, displayName, meta, timestamp
```

### Admin Detection
- `role: 'admin'` field on user doc in Firestore
- Admin always gets `appMode = 'active'`, lands on admin dashboard

---

## AUTH & BOOT SEQUENCE

### Signed-In User Boot
1. Firebase `onAuthStateChanged` → set `fbUser`, check admin role
2. `updateAuthUI()` — chip = Google name + photo
3. `initializeApp()` → load manifest + templates → `initializeMainApp()`
4. **Firestore load overwrites scaffold** (or clears if no doc)
5. `rescoreAllJobs()` → admin → admin view, others → blueprint/welcome

### Demo User Boot
1. Auth resolves null → "Sign In" button
2. Load scaffold from localStorage, browse samples via Samples nav

### Critical Guards
- Signed-in users never see scaffold names
- Scaffold cleared when no Firestore doc exists
- `switchProfile()` won't save to localStorage when `fbUser` exists
- `saveToFirestore()` only fires when `fbUser` exists AND userData is real

---

## DATA LIBRARIES (parallel load via Promise.allSettled)

| Source | Library | Count |
|--------|---------|-------|
| Custom | Skills (index-v3.json) | 13,960 |
| Custom | Certification library | 191 |
| Custom | Skill evidence | 73 skills |
| Custom | Skill valuations | ✓ |
| Custom | Impact ratings | ✓ |
| O*NET | Skills (nested) | ~120 |
| O*NET | Abilities | 52 |
| O*NET | Work Styles | 21 |
| O*NET | Knowledge | 33 |
| O*NET | Work Activities | 41 |
| Custom | Trades & Creative | 64 |
| Custom | Values | 30 |
| BLS | Wages | 831 occupations |

---

## MODELS

**Valuation:** BLS base + impact premiums + rarity bonus × location. Offers at 75/85/95%.

**Matching:** Exact (1.0) → Synonym (0.95) → Substring (0.85) → Word overlap (0.75×ratio). Weighted Required×3, Preferred×2, Nice×1. Normalizes string arrays for curated jobs.

---

## VERSION HISTORY (Sessions 14–16)

| Version | Changes |
|---------|---------|
| v4.25.0 | Blueprint 6-tab restructure, auth flow overhaul, profile chip cleanup |
| v4.25.1.9 | Jobs auto-rescore, pipeline subtitle fix |
| v4.25.1.10 | Admin profile chip fix (Google identity always wins) |
| v4.25.1.11 | Full admin page (5 tabs), admin boot redirect |
| v4.25.1.12 | O*NET skills nested count fix |
| v4.25.1.13 | Analytics engine, event tracking (9 hooks), grouped data libraries |
| v4.25.1.14 | Root cause fix: scaffold contamination (signed-in users never load templates) |
| v4.25.1.15 | Parallel library loading (Promise.allSettled) |
| v4.25.1.16 | Export removed from hamburger, footer hidden on admin, sample profile editing |
| v4.25.1.17 | Samples page: 3 TV show collections, 15 character cards, tab navigation |
| v4.25.1.18 | 15 profile JSONs (385 skills, 45 curated jobs), curated jobs flag |
| v4.25.1.19 | matchJobToProfile fix — normalize string skill arrays to objects |
| v4.25.1.20 | normalizeUserRoles() — roles get id, color, skills[] for D3 |
| v4.25.1.21 | D3 link guards in all 4 networks, safety normalize in initNetwork() |
| v4.25.1.22 | Heading font fix, edit disabled for demos, center node z-order in all networks |
| v4.25.1.23 | Manifest array normalization, mobile label toggle CSS fix, null safety on saveSampleEdits |

### Session 14: Profile Data Enrichment
Generated 15 TV character profiles with timeline-accurate work history, education, certifications, and skill evidence. 323 skills, 68 evidence items, 46 work history entries, 27 education records, 10 certifications.

### Session 15: Mobile Skills Label Toggle Fix
Root cause: D3 data-bound filtering fragile on mobile. Solution: CSS-class-based approach using `.hide-skill-labels` class on SVG element. Touch targets enlarged to 48×28px.

### Session 16: Manifest Loading Error Fix
Root cause: Profile generation script wrote manifest as bare JSON array `[...]` but `initializeApp()` expected `{profiles: [...]}`. Fix: Added normalization after fetch — `if (Array.isArray(manifest)) { manifest = { profiles: manifest }; }`. Also added null safety to `saveSampleEdits()`.

---

## SUPPORTING FILES

| File | Description |
|------|-------------|
| `index.html` | Main app (~24,128 lines) |
| `teaser.html` | Landing page with animated network |
| `profiles-manifest.json` | 15-profile registry (bare array or `{profiles:[...]}`) |
| `profiles/demo/*.json` | 15 character profile JSONs |
| `skills/index-v3.json` | Master skill library (13,960 skills) |
| `onet-*.json` | O*NET data libraries (5 files) |
| `trades-creative-library.json` | Trades & creative skills |
| `bls-wages.json` | BLS salary data |
| `certification-library.json` | 191 certifications |
| `skill_evidence.json` | Evidence for 73 skills |
| `WHY_BLUEPRINT.md` | Positioning document |
| `LAUNCH_PLAN.md` | Invite-only launch spec |
| `PROJECT_CONTEXT.md` | This file |

---

## TECH DEBT

- Job APIs need network access (CORS proxied)
- Consider code splitting at 25K+ lines
- ESCO library not yet loaded (placeholder in admin)
- `analytics_events` needs Firestore composite indexes
- Old 5 sample profiles (cliff-jones, sarah-chen, etc.) should be deleted from repo
- Mobile tab scroll testing needed
- Manifest should be standardized to `{profiles: [...]}` format (currently normalized at runtime)

---

## NEXT STEPS

**Immediate:** Deploy v4.25.1.23 + 15 profile JSONs + manifest. Delete old profiles from repo.
**Short-term:** ESCO library integration, email invite notifications, sample evidence population
**Medium-term:** Ambassador mechanic, LinkedIn sharing, analytics time-series, IAM Phenom prep
**Content:** Articles on recruiting transformation, AI in TA, org restructuring
