# Blueprint — Project Context
## Last Updated: 2026-02-20 (Session 15) · v4.25.1.22

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

## SAMPLE PROFILES SYSTEM (v4.25.1.17–22, data refresh Session 15)

### Architecture
- `profiles-manifest.json` — registry of all 15 profiles with id, name, title, path, enabled
- `profiles/demo/{id}.json` — individual profile data files
- Profiles loaded at boot via manifest → fetch each JSON → stored in `templates[id]`
- Profile switching via `switchProfile(templateId)` → `loadTemplate()` → `initializeMainApp()`

### TV Show Collections (15 profiles)

All profiles include lore-accurate work history with dates, education, certifications, and skill evidence that auto-generates outcomes via `extractOutcomesFromEvidence()`.

**Breaking Bad** (green `#22c55e`) — set 2008–2010, Albuquerque NM:
| ID | Character | Skills | Evidence | Work History | Education | Jobs |
|----|-----------|--------|----------|-------------|-----------|------|
| `walter-white` | Walter White | 32 | 11 | 4 (Caltech PhD → Sandia Labs → Gray Matter → JP Wynne HS) | 3 (Caltech PhD/MS, UNM BS) | 3 |
| `gus-fring` | Gus Fring | 29 | 8 | 3 (Madrigal → Los Pollos Hermanos → Lavandería Brillante) | 2 (U Santiago, U Chile MBA) | 3 |
| `hank-schrader` | Hank Schrader | 25 | 4 | 3 (DEA El Paso → DEA ABQ Agent → ASAC) | 2 (UNM, DEA Academy) | 3 |
| `jesse-pinkman` | Jesse Pinkman | 21 | 4 | 3 (Retail → Woodworking → Youth Volunteer) | 1 (JP Wynne HS) | 3 |
| `saul-goodman` | Saul Goodman | 24 | 4 | 4 (HHM Mailroom → Solo → Davis & Main → Saul Goodman & Assoc) | 2 (U American Samoa JD/BA) | 3 |

**Stranger Things** (red `#ef4444`) — set 1983–1986, Hawkins IN:
| ID | Character | Skills | Evidence | Work History | Education | Jobs |
|----|-----------|--------|----------|-------------|-----------|------|
| `jim-hopper` | Jim Hopper | 21 | 4 | 3 (US Army Vietnam → NYPD Homicide → Hawkins Chief) | 2 (Hawkins HS, NYPD Academy) | 3 |
| `eleven` | Eleven (Jane Hopper) | 16 | 5 | 2 (Hawkins Lab Research Subject → Crisis Response) | 2 (Lab Education, Hawkins Middle) | 3 |
| `steve-harrington` | Steve Harrington | 17 | 3 | 3 (Lifeguard → Scoops Ahoy → Youth Mentor) | 1 (Hawkins HS) | 3 |
| `dustin-henderson` | Dustin Henderson | 21 | 5 | 2 (AV Club/Science Fair → Ham Radio Operator) | 1 (Hawkins Middle) | 3 |
| `joyce-byers` | Joyce Byers | 18 | 4 | 2 (Big Buy Deli → Melvald's General Store) | 1 (Hawkins HS) | 3 |

**Succession** (gold `#c4a035`) — set ~2018–2020, NYC:
| ID | Character | Skills | Evidence | Work History | Education | Jobs |
|----|-----------|--------|----------|-------------|-----------|------|
| `logan-roy` | Logan Roy | 20 | 4 | 2 (Royco Holdings Canada → Waystar Royco CEO 1972–2020) | 1 (Self-educated) | 3 |
| `kendall-roy` | Kendall Roy | 19 | 3 | 3 (Goldman Sachs → Waystar VP → Head of Corp Dev/Acting CEO) | 3 (Harvard MBA/BA, Buckley School) | 3 |
| `shiv-roy` | Siobhan "Shiv" Roy | 21 | 3 | 4 (Senate Aide → Political Consultant → Eavis Campaign → Waystar President) | 2 (Yale MA, Georgetown BA) | 3 |
| `roman-roy` | Roman Roy | 17 | 2 | 3 (Waystar Studios Associate → VP BizDev LA → COO) | 2 (Brown BA, Buckley School) | 3 |
| `tom-wambsgans` | Tom Wambsgans | 22 | 4 | 5 (Bain → Waystar VP → SVP Parks/Cruises → ATN Chairman → CEO) | 2 (U Minnesota MBA/BA) | 3 |

**Totals: 323 skills, 68 evidence items, 46 work history entries, 27 education records, 10 certifications, 45 curated jobs**

*Match percentages are raw skill overlap. The match engine adds fuzzy/synonym matching so live scores run ~5-10% higher.*

### Outcomes Auto-Generation
Outcomes are NOT stored in profile JSONs — they're extracted at runtime by `extractOutcomesFromEvidence()` from skill evidence entries. Evidence items that contain metrics ($, %, x) or result verbs (achieved, reduced, launched, etc.) become blueprint outcomes. Each profile has 2-11 evidence entries designed to generate meaningful outcomes.

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

## SESSION 15 CHANGES

| Change | Details |
|--------|---------|
| Profile data refresh | All 15 profiles rebuilt with lore-accurate work history, education, certifications, and skill evidence |
| Work history | 46 entries total with accurate dates from show timelines (BB: 2008-2010, ST: 1983-1986, Succession: 2018-2020) |
| Education | 27 entries — Walter's Caltech PhD, Kendall's Harvard MBA, Saul's U American Samoa JD, Hopper's NYPD Academy, etc. |
| Certifications | 10 entries — teaching licenses, ServSafe, DEA training, CPR, FCC amateur radio, bar licenses |
| Skill evidence | 68 evidence items with metrics/outcomes that auto-generate blueprint outcomes via extractOutcomesFromEvidence() |
| Profile summaries | Professional summaries added to all 15 profiles for export readiness |
| Skills recount | 323 skills (down from 385 — removed filler, added evidence-bearing skills) |

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

**Immediate:** Deploy updated 15 profile JSONs + manifest. Delete old profiles from repo.
**Short-term:** ESCO library integration, email invite notifications, sample evidence population refinement
**Medium-term:** Ambassador mechanic, LinkedIn sharing, analytics time-series, IAM Phenom prep
**Content:** Articles on recruiting transformation, AI in TA, org restructuring
**Profile refinement:** Adjust skill evidence wording for better outcome extraction, add values to profiles, test match percentages across all 45 jobs
