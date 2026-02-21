# Blueprint — Project Context
## Last Updated: 2026-02-20 (Session 14 Final) · v4.25.1.22

---

## WHAT IS BLUEPRINT

Blueprint is a career intelligence platform that maps professional skills through interactive visualizations and generates career deliverables. Built as a single-page application (~24,124 lines) in one `index.html` file. Domain: **myblueprint.work** (primary), **getblueprint.work** (redirect/marketing).

**Core insight:** "You are not your resume." Most professionals can name 15–20 skills. Blueprint maps 150–300 using a 14,000+ skill ontology (O*NET + ESCO datasets).

---

## FILE & ARCHITECTURE

**Single file:** `index.html` — ~24,124 lines, ~1.2MB
**No build system.** Pure HTML/CSS/JS. CDN dependencies only.
**Hosted:** GitHub Pages at `cliffj8338.github.io/Skills-Ontology/`

### CDN Dependencies
- Firebase 10.7.0 (Auth, Firestore)
- jsPDF 2.5.1 (PDF generation)
- D3.js 7 (network visualization)
- Google Fonts (Outfit, JetBrains Mono)

### Versioning
4-part version: `v{major}.{minor}.{patch}.{build}` (e.g., v4.25.1.22)
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
BP_VERSION                  — Version constant (e.g., 'v4.25.1.22')
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

## SAMPLE PROFILES SYSTEM (v4.25.1.17–22)

### Architecture
- `profiles-manifest.json` — registry of all 15 profiles with id, name, title, path, enabled
- `profiles/demo/{id}.json` — individual profile data files
- Profiles loaded at boot via manifest → fetch each JSON → stored in `templates[id]`
- Profile switching via `switchProfile(templateId)` → `loadTemplate()` → `initializeMainApp()`

### TV Show Collections (15 profiles)

**Breaking Bad** (green `#22c55e`):
| ID | Character | Skills | Job 1 (~70-80%) | Job 2 (~55-65%) | Job 3 (~42-55%) |
|----|-----------|--------|------------------|------------------|------------------|
| `walter-white` | Walter White | 32 | UNM Chemistry Prof (71%) | Pfizer R&D Director (55%) | McKinsey Consultant (42%) |
| `gus-fring` | Gus Fring | 29 | Yum! Brands VP Ops (67%) | Sysco SVP Supply Chain (56%) | Chipotle Dev Director (53%) |
| `hank-schrader` | Hank Schrader | 25 | Amazon Investigations Dir (76%) | DHS Intel Director (58%) | Walmart VP Security (44%) |
| `jesse-pinkman` | Jesse Pinkman | 21 | West Elm Furniture Maker (62%) | Snap-on Sales Rep (64%) | Boys & Girls Club (57%) |
| `saul-goodman` | Saul Goodman | 24 | Morgan & Morgan VP Marketing (74%) | Edelman Crisis Dir (56%) | Dollar Shave Club GC (48%) |

**Stranger Things** (red `#ef4444`):
| ID | Character | Skills | Job 1 | Job 2 | Job 3 |
|----|-----------|--------|-------|-------|-------|
| `jim-hopper` | Jim Hopper | 21 | FEMA Emergency Dir (72%) | Tesla VP Security (52%) | County Sheriff (68%) |
| `eleven` | Eleven (Jane Hopper) | 16 | Johns Hopkins Research (43%) | SAMHSA Crisis Specialist (69%) | NSA Analyst (47%) |
| `steve-harrington` | Steve Harrington | 17 | YMCA Youth Director (60%) | Target District Mgr (50%) | Camp Director (64%) |
| `dustin-henderson` | Dustin Henderson | 21 | MIT Lincoln Labs Engineer (55%) | NSA Cryptanalyst (45%) | Smithsonian STEM Dir (68%) |
| `joyce-byers` | Joyce Byers | 18 | NCMEC Victim Advocacy (62%) | Ace Hardware Manager (78%) | Private Investigator (50%) |

**Succession** (gold `#c4a035`):
| ID | Character | Skills | Job 1 | Job 2 | Job 3 |
|----|-----------|--------|-------|-------|-------|
| `logan-roy` | Logan Roy | 20 | WBD CEO (67%) | Apollo PE Partner (60%) | News Corp Board (58%) |
| `kendall-roy` | Kendall Roy | 19 | Paramount CSO (64%) | Goldman Sachs TMT MD (60%) | a16z Portfolio CEO (47%) |
| `shiv-roy` | Siobhan "Shiv" Roy | 21 | Disney CSO (68%) | McKinsey Partner (58%) | Meta VP Gov Affairs (72%) |
| `roman-roy` | Roman Roy | 17 | Netflix VP BizDev (70%) | Universal COO (50%) | Spotify Content Head (62%) |
| `tom-wambsgans` | Tom Wambsgans | 22 | iHeartMedia CEO (64%) | Fox CCO (67%) | CNN GM (53%) |

*Match percentages are raw skill overlap. The match engine adds fuzzy/synonym matching so live scores run ~5-10% higher.*

### Job Match Realism
Each job has 13-20 `parsedSkills` — a mix of skills the character HAS (creating matches) and skills they DON'T have (creating realistic gaps). Gap skills are character-authentic:
- Walter White lacks "Grant Writing," "FDA Regulatory Affairs," "Management Consulting"
- Steve Harrington lacks "Wilderness First Responder," "P&L Management," "RFID Systems"
- Eleven lacks "Bachelor's Degree Required," "SPSS Statistical Analysis," "Hadoop"

Jobs use `curated: true` flag to skip auto-generated sample jobs. `matchJobToProfile()` normalizes string arrays to objects.

### Samples Page UI
- Header: "SAMPLE BLUEPRINTS" (uppercase, Outfit font, letter-spacing 0.08em)
- Three color-coded tab selectors (Breaking Bad green, Stranger Things red, Succession gold)
- Show banner with tagline + description
- 5 character cards per show with initials avatar, emoji, title, description, skill count, "View →" button
- `selectShowCollection(showId)` handles tab switching with show-specific content

### Read-Only Protection
- `isReadOnlyProfile` = true when viewing sample as non-admin
- `readOnlyGuard()` blocks: add skill, delete skill, edit outcome, add outcome, edit skill modal
- Skill detail modal hides Edit/Assess/Verify/Remove action bar for read-only
- Card view hides Edit/Delete buttons for read-only
- Admin retains full editing + JSON export via admin panel

---

## ROLE NORMALIZATION

Profiles store bare roles as `{name: 'Chemistry Professor'}`. The app requires `{id, name, color, skills[]}` for D3 network rendering. `normalizeUserRoles()` handles this:

- Assigns `role.id = role.name`
- Assigns `role.color` from 8-color palette
- Builds `role.skills[]` by scanning `userData.skills` for role references

Called in: `switchProfile()`, wizard completion, `initializeMainApp()`, and as safety net inside `initNetwork()`.

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
| O*NET | Skills (nested) | ~120 |
| O*NET | Abilities | 52 |
| O*NET | Work Styles | 21 |
| O*NET | Knowledge | 33 |
| O*NET | Work Activities | 41 |
| Custom | Trades & Creative | 64 |
| Custom | Values | 30 |
| BLS | Wages | 831 occupations |
| ESCO | (Planned) | ~13,890 |

---

## MODELS

**Valuation:** BLS base + impact premiums + rarity bonus × location. Offers at 75/85/95%.

**Matching:** Exact (1.0) → Synonym (0.95) → Substring (0.85) → Word overlap (0.75×ratio). Weighted Required×3, Preferred×2, Nice×1. Normalizes string arrays for curated jobs.

---

## SESSION 14 VERSION HISTORY

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

---

## SUPPORTING FILES

| File | Description |
|------|-------------|
| `index.html` | Main app (~24,124 lines) |
| `teaser.html` | Landing page with animated network |
| `profiles-manifest.json` | 15-profile registry (TV characters) |
| `profiles/demo/*.json` | 15 character profile JSONs |
| `onet-*.json` | O*NET data libraries (5 files) |
| `trades-creative-library.json` | Trades & creative skills |
| `bls-wages.json` | BLS salary data |
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

---

## NEXT STEPS

**Immediate:** Deploy v4.25.1.22 + 15 profile JSONs + manifest. Delete old profiles from repo.
**Short-term:** ESCO library integration, email invite notifications, sample evidence population
**Medium-term:** Ambassador mechanic, LinkedIn sharing, analytics time-series, IAM Phenom prep
**Content:** Articles on recruiting transformation, AI in TA, org restructuring
