# Blueprint Project Context
**Version:** 4.19.0 | **Date:** February 19, 2026 | **Lines:** 20,892

## What Blueprint Is

Blueprint (formerly Work Blueprint) is a career ontology platform built as a single-page HTML/JS application. It helps professionals map their skills, roles, values, and experience into a structured profile, then calculates market valuation and matches against job opportunities. Created by Cliff Jurkiewicz (VP Global Strategy at Phenom, talent intelligence platform).

The app runs as a single `index.html` file (~1.1MB) with companion JSON data files. It uses Firebase Auth (Google sign-in) and Firestore for persistence. No build tools, no frameworks, vanilla JS throughout. Everything is in one HTML file by design.

---

## Architecture

### Core Files
- **index.html** — The entire application (20,892 lines). All HTML, CSS, and JS in one file.
- **bls-wages.json** — BLS OEWS May 2024 wage data. 831 occupations, 170 job title aliases, keyword index. 255KB.
- **skills-library.json** — Categorized skill definitions with proficiency descriptors.
- **trades-creative-library.json** — Extended skill library for trades/creative professions.
- **values-library.json** — Work values taxonomy.
- **cert-library.json** — 191 professional certifications with tiered skill mappings.

### Infrastructure
- **Firebase Auth** — Google sign-in, admin detection via UID check
- **Firestore** — User profile persistence (skills, roles, values, jobs, settings)
- **No backend** — Entirely client-side. API calls (Claude) use user-provided keys
- **Dark/light theme** — `tv(dark, light)` helper throughout

### Key Global Variables
- `userData` — The master profile object (profile, roles, skills, savedJobs, settings, etc.)
- `skillsData` — Working copy of skills with computed fields
- `valuesLibrary` — Loaded from values-library.json
- `window.blsWages` — BLS wage data loaded on init
- `fbUser`, `fbDb`, `fbIsAdmin` — Firebase state
- `currentView` — Active tab/view name

---

## Feature Map

### Tabs/Views
1. **Blueprint** — Profile overview, market valuation summary, radar chart
2. **Skills** — Skill management with add/edit/delete, proficiency levels, role assignments, evidence engine
3. **Experience** — Work history, timeline, role progression
4. **Values** — 3-7 work values selection with ranking, alignment scoring
5. **Opportunities** — Job pipeline (max 10), JD paste and analysis, match scoring
6. **Settings** — Theme, API key, admin tools, preset management

### Valuation Engine (L5575-5860)
- **Function detection** — Two-pass system: checks title+roles first (strongest signal), falls back to skill keywords. 15 functions: technology, recruiting, hr, marketing, finance, sales, operations, strategy, healthcare, education, legal, engineering, trades, retail, general.
- **Seniority detection** — 5 levels: entry (0), mid (1), senior (2), director (3), vp/c-suite (4). Pattern-matched from title.
- **Base rate** — From `SALARY_TABLE[function][seniority]`, now sourced from BLS OEWS May 2024 percentile data.
- **Premium factors** (5 factors, hard-capped at 35% total):
  - Factor 1: Work Style Versatility (max 8%)
  - Factor 2: Evidence Quality (max 12%)
  - Factor 3: Skill Rarity (max 8%)
  - Factor 4: Critical Depth (max 5%)
  - Factor 5: Learning Velocity (max 2%)
- **Salary cap** — From `SALARY_CAP[function][seniority]`, BLS 90th percentile ceiling.
- **Evidence/Potential toggle** — Switches between evidence-weighted and potential-based valuation.

### BLS Integration (NEW in v4.19.0)
- `bls-wages.json` loads on startup into `window.blsWages`
- `matchJobToBLS(title, description)` — Matches any job to a specific BLS SOC occupation
  - Phase 1: Alias matching (170 common job titles mapped to SOC codes, weight 5)
  - Phase 2: Keyword overlap with BLS occupation title words (weight 1 per word)
  - Returns: SOC code, title, full percentile wage data (10th/25th/median/75th/90th), employment count
- Wired into: `analyzeJob()`, `reanalyzeJob()`, sample job injection
- Displayed on job cards (25th-75th range) and job detail view (full percentile bar with source attribution)

### Evidence Engine (L~10000-10500)
- Per-skill evidence items with outcome quality scoring (1-5 points)
- Categories: project, metric, recognition, certification, training
- Effective level calculation: `claimed_level + evidence_modifier`
- Third-party verification workflow (pending/verified/rejected states)
- Certification library with tiered skill bumps (Proficient floor or Advanced floor)

### Job Analysis Pipeline
- **parseJobLocally()** — Regex-based skill extraction against skill library
- **parseJobWithAPI()** — Claude API parsing (user-provided key) for structured extraction
- **matchJobToProfile()** — Scores match percentage, identifies gaps, surplus, proficiency deltas
- **matchJobToBLS()** — Maps job to BLS occupation for salary data
- Job detail view shows: match %, matched skills, gaps (clickable to quick-add), surplus, BLS salary range

### Demo Profiles
Three scaffold profiles loaded via `loadTemplate(scaffoldId)`:
- **Cliff Jones** (demo-cliff) — Strategy VP, detected as strategy/vp
- **Sarah Chen** (demo-sarah) — Senior Recruiter, detected as recruiting/senior
- **Mike Rodriguez** (demo-mike) — Senior Software Engineer, detected as technology/senior

Each gets 3 calibrated sample jobs (high/mid/low match tiers). Demo profiles skip Firestore load to preserve sample data. Sample jobs marked with `job.sample = true`.

### Admin Features
- Admin detection by Firebase UID
- Profile scaffold management (CRUD for demo profiles)
- Settings presets (save/load/share)
- Evidence threshold configuration
- Can edit/delete demo sample jobs

---

## BLS Salary Data Structure

### SALARY_TABLE (base rates, in index.html)
Maps 15 functions × 5 seniority levels to BLS percentile-derived base rates:
- Entry: 25th percentile of the mapped SOC occupation
- Mid: Median of the mapped SOC occupation
- Senior: 75th percentile
- Director: 75th percentile of the *manager-level* SOC
- VP: 90th percentile of the manager-level SOC (estimated where BLS reports '#')

### SALARY_CAP (ceilings, in index.html)
- Entry: Median (can't exceed typical for the role)
- Mid: 75th percentile
- Senior/Director/VP: 90th percentile of the appropriate SOC

### SOC Code Mapping (key examples)
| Function | Entry SOC | Mid SOC | Senior SOC | Director SOC | VP SOC |
|---|---|---|---|---|---|
| technology | 15-1299 | 15-1252 | 15-1252 | 11-3021 | 11-3021 |
| recruiting | 43-4161 | 13-1071 | 13-1071 | 11-3121 | 11-3121 |
| strategy | 13-1111 | 13-1111 | 13-1111 | 11-1021 | 11-1011 |
| general | 41-2011 | 43-9061 | 43-1011 | 11-1021 | 11-1011 |
| retail | 41-2011 | 41-2031 | 41-1011 | 11-2022 | 11-2022 |
| trades | 39-5012 | 47-2111 | 47-2111 | 47-1011 | 11-9021 |

### bls-wages.json Structure
```json
{
  "source": "U.S. Bureau of Labor Statistics...",
  "period": "May 2024",
  "count": 831,
  "occupations": [
    {
      "soc": "15-1252",
      "title": "Software Developers",
      "employment": 1795300,
      "a_mean": 139080,
      "a_pct10": 79850,
      "a_pct25": 103050,
      "a_median": 133080,
      "a_pct75": 169000,
      "a_pct90": 211450,
      "keywords": ["software", "developers"]
    }
  ],
  "aliases": {
    "software engineer": "15-1252",
    "recruiter": "13-1071",
    "cashier": "41-2011"
    // ... 170 total
  },
  "keywordIndex": { "software": ["15-1252", "15-1253"], ... },
  "functionMap": { "technology": ["15-1252", ...], ... },
  "socGroups": { "11": "Management", "15": "Computer & Mathematical", ... }
}
```

---

## Version History (Recent)

| Version | Key Changes |
|---|---|
| 4.19.0 | BLS OEWS May 2024 integration: 831 occupations, 15 function salary tables, job-to-SOC matching, salary range on job cards/detail, `bls-wages.json` standalone data file |
| 4.18.2 | Premium cap reduction (125% → 35%), function detection two-pass fix, sample job injection with Firestore skip, selectPreset declaration fix |
| 4.18.1 | Salary caps (90th percentile ceiling per function/seniority), values 3-7 limit enforcement, Experience tab save button fix |
| 4.18.0 | Evidence/potential valuation toggle, role-based salary floors, auto-skill from certifications, Google auth redirect migration |
| 4.17.0 | Certification library (191 certs), two-tier evidence floor system, curated skill maps for 83 certs |
| 4.16.0 | Evidence engine with outcome quality scoring, effective level calculation, verification workflow |
| 4.15.0 | Evidence CRUD UI, edit skill gap awareness, card view indicators |
| 4.14.1 | Feature roadmap planning session |

---

## Known Issues / Technical Debt

1. **Single-file architecture** — 20,892 lines in one HTML file. Works but increasingly difficult to navigate. Functions found by line number ranges.
2. **Hardcoded admin UID** — Firebase admin check is a string comparison against a specific UID.
3. **No offline fallback** — If `bls-wages.json` fails to load, salary engine falls back to built-in SALARY_TABLE (still BLS-sourced, just no per-job matching).
4. **BLS '#' values** — Where BLS reports '#' (salary >= $239,200), we estimate 1.15-1.4x the 75th percentile. Affects C-suite and some senior legal/finance roles.
5. **Job pipeline cap** — Hard-limited to 10 jobs. No archive/history.
6. **API key management** — Claude API key stored in localStorage. Works but not ideal.
7. **Location multipliers** — Not yet implemented. BLS has state-level data we could use. Currently national-only.

---

## Pending / Next Steps

1. **Location-adjusted salaries** — Use BLS state-level OEWS data for geographic multipliers (download state_M2024_dl.xlsx).
2. **Resume generation** — Professional resume output from profile data (was on roadmap before BLS work).
3. **Skill gap recommendations** — Suggest skills to add based on target jobs' gap patterns.
4. **BLS auto-update** — Annual refresh when new OEWS data publishes (typically March for prior May data).
5. **Industry-specific salary** — BLS data has NAICS industry splits (Files 2 & 3). Could refine salary if user specifies industry.

---

## Development Conventions

- **Version comments** — Line 7 of index.html: `<!-- v4.19.0 | date | Feature: description -->`
- **Brace balance** — Always verify `{` count equals `}` count after edits
- **Function exposure** — Key functions assigned to `window.functionName` for onclick handlers
- **TV helper** — `tv(darkValue, lightValue)` for theme-aware styling
- **Console logging** — Emoji-prefixed: ✅ success, 📋 info, ⚠️ warnings
- **No build step** — Everything works as static files served from any web server
- **Companion files** — JSON data files must be in same directory as index.html

---

## File Deployment Checklist

All files go in the same directory:
- [ ] index.html (v4.19.0)
- [ ] bls-wages.json (BLS OEWS May 2024)
- [ ] skills-library.json
- [ ] trades-creative-library.json
- [ ] values-library.json
- [ ] cert-library.json
