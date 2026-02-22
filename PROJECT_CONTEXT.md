# Blueprint Project Context — v4.32.0.1
## Prepared: February 22, 2026

---

## What Blueprint Is

Blueprint is a career intelligence platform that maps professional skills through interactive visualizations, matching them against the world's largest skill ontologies (O*NET, ESCO). It's a single-page app (one `index.html` file, ~22,400 lines) with an external `blueprint.css` and JSON profile/skill library files.

**Creator:** Cliff Jurkiewicz — VP Global Strategy & GM Customer Advisory at Phenom  
**Domain:** myblueprint.work (pending migration)  
**Tagline:** "The Resume is Dead. Here is Your Blueprint.™"

---

## Architecture

### Single File App
- `index.html` — all JS/HTML inline (~22,400 lines)
- `blueprint.css` — external stylesheet
- `profiles/demo/*.json` — sample character profiles (Breaking Bad, Stranger Things, Succession, Game of Thrones)
- `profiles-manifest.json` — profile registry
- `skills/*.json` — skill library index files (O*NET + ESCO, 14,000+ skills)
- `companies.json` — company values data for match scoring

### Key Data Structures
```javascript
userData = {
    profile: { name, email, currentTitle, location, photo },
    skills: [{ name, level, category, key, roles, role, evidence: [] }],
    skillDetails: {},
    values: [{ name, selected, custom? }],
    purpose: '',
    roles: [{ id, name, color }],
    workHistory: [],
    savedJobs: [{ id, title, company, rawText, parsedRoles, seniority, tier, matchData, companyValues }],
    applications: [],
    templateId: ''
}

skillsData = {
    skills: [], // mirrors userData.skills
    roles: []   // role clusters
}
```

### Job Match Data (`job.matchData`)
Computed by `scoreJobMatch()`:
```javascript
matchData = {
    score: 75,           // overall match %
    matched: [{          // skills that matched
        userSkill: 'Crisis Leadership',
        jobSkill: 'crisis management',
        profMatch: 0.95, // proficiency alignment 0-1
        requirement: 'Required' | 'Preferred' | 'Nice-to-have'
    }],
    gaps: [{             // required skills user lacks
        name: 'Python',
        requirement: 'Required'
    }],
    surplus: [{          // user skills not in job
        name: 'Alliance Building',
        level: 'Expert'
    }]
}
```

### Company Values Data (`job.companyValues`)
Computed by `getCompanyValues()` or tier-controlled for demo profiles:
```javascript
companyValues = {
    primary: ['Courage', 'Resilience', ...],     // 2-5 values
    secondary: ['Innovation', ...],               // 2-4 values
    tensions: [],
    story: '',
    inferred: true | false
}
```

### Values System
- `VALUES_CATALOG` — 25 canonical values across categories
- User selects 5-7 values (can include custom non-catalog values)
- Values alignment % = overlap between user values and company values
- Custom values display but don't affect alignment math

### Compensation Data
- `DEMO_COMP` — curated compensation for demo profiles
- `getEffectiveComp()` — returns market rate, conservative, competitive ranges
- BLS benchmark data for salary ranges by occupation

---

## Current Sample Profiles (4 Shows, 22 Characters)

### Breaking Bad (6): Walter White, Gus Fring, Hank Schrader, Jesse Pinkman, Saul Goodman, Tuco Salamanca
### Stranger Things (6): Jim Hopper, Eleven, Steve Harrington, Dustin Henderson, Joyce Byers, Nancy Wheeler
### Succession (4): Logan Roy, Kendall Roy, Siobhan Roy, Roman Roy
### Game of Thrones (6): Tyrion Lannister, Cersei Lannister, Daenerys Targaryen, Jon Snow, Petyr Baelish, Tywin Lannister

Each profile has:
- Skills (17-37 per character) with proficiency levels and role assignments
- Work history entries
- 6-7 values (5 catalog + 1-2 fun custom like "Chaos is a Ladder")
- 3 curated jobs per character targeting ~85% / ~65% / ~40% skill match
- Curated compensation (DEMO_COMP)

---

## Current Scouting Report (PDF via jsPDF)

### What Exists
The scouting report is generated as a **PDF** via `generateScoutingReport(jobIdx)` → `generatePDF(sharedData, job)`. When a target job is provided, the PDF enters "scouting report mode" (`isScoutingReport = true`) which adds job-specific pages:

**Cover Page (scouting mode):**
- "PREPARED FOR: [Job Title]" + company
- Match Score %, Total Skills, Skills Aligned, Gaps (4 stat boxes)
- Purpose statement, market positioning

**Match Analysis Page:**
- Score summary narrative (strong matches, partial matches, required gaps)
- Skill Alignment Table — sorted by proficiency match, color-coded ✓/~/↑
- Gap Analysis table with requirement levels
- Surplus Skills (top 20, multi-column layout)

**Strategic Assessment Section:**
- Key Strengths (top 3 strong matches)
- Development Areas (gap narrative)
- Recommendation (advance to interview with focus areas)

**Standard Pages (always included):**
- Skills by Domain (grouped by role cluster)
- Skills Evidence (evidence items per skill)
- Outcomes
- Values & Purpose
- Compensation Framework

### What's Missing / Needs Work
- No HTML interactive version (only static PDF)
- No personalization for recruiter vs. hiring manager audience
- No values alignment visualization
- No work history / career timeline integration
- No "bridge the gap" narrative connecting user skills to job requirements
- Limited storytelling — mostly data tables

---

## Auth & Access Model

- **Demo visitors** — see Welcome page, can explore Samples, nav-gated from Skills/Jobs/Blueprint until they select a profile
- **Waitlisted users** — can browse samples, see waitlist position
- **Signed-in users** — full access, Firestore persistence
- **Admin** — Cliff's account, full access + admin panel
- **Account creation disabled** — `showAuthModal('signup')` redirects to waitlist
- **Sign In** — Google auth, email/password, magic link (existing accounts only)

---

## Recent Changes (This Session — v4.27.3.3 → v4.32.0.1)

1. **Game of Thrones profiles** — 6 characters with skills, work history, values, curated jobs
2. **Duplicate skills bug fix** — `renderSkillsManagementTab()` and `initCardView()` normalized `s.roles || s.role` handling
3. **Succession brand color** — changed from gold to lime green `#b5cc4b`
4. **Welcome hero copy** — "The Resume is Dead. Here is Your Blueprint.™"
5. **About modal rewrite** — counter-intelligence suite framing, agency-focused feature cards
6. **Help modal** — network controls (drag/hover/click/domain/match overlay) added
7. **Nav gating** — Skills/Jobs/Blueprint blocked until user selects a profile or signs in
8. **Banner persistence** — readonly banner now shows/hides correctly across all views
9. **Banner spacing fix** — forced `display:block` to prevent flex whitespace collapse
10. **Auth lockdown** — signup redirects to waitlist, sign-in modal simplified
11. **"Imagine your skills" nudge** — removed
12. **Network hint overlay** — removed (consolidated into Help modal)
13. **Job match calibration** — 18 GoT jobs keyword-calibrated for ~85%/~65%/~40% targets
14. **Values expansion** — all 6 GoT characters now have 6-7 values with custom flavor values

---

## File Locations

```
/mnt/user-data/outputs/
├── index.html                          # Main app (v4.32.0.1)
├── profiles/
│   ├── demo/
│   │   ├── walter-white.json
│   │   ├── gus-fring.json
│   │   ├── hank-schrader.json
│   │   ├── jesse-pinkman.json
│   │   ├── saul-goodman.json
│   │   ├── tuco-salamanca.json
│   │   ├── jim-hopper.json
│   │   ├── eleven.json
│   │   ├── steve-harrington.json
│   │   ├── dustin-henderson.json
│   │   ├── joyce-byers.json
│   │   ├── nancy-wheeler.json
│   │   ├── logan-roy.json
│   │   ├── kendall-roy.json
│   │   ├── siobhan-roy.json
│   │   ├── roman-roy.json
│   │   ├── tyrion-lannister.json
│   │   ├── cersei-lannister.json
│   │   ├── daenerys-targaryen.json
│   │   ├── jon-snow.json
│   │   ├── petyr-baelish.json
│   │   └── tywin-lannister.json
│   └── profiles-manifest.json
```

---

## Version Convention
- Format: `v4.XX.Y.Z` (major.feature.patch.hotfix)
- **Three references must stay in sync:** HTML comment (line 7), build string (~line 895), `BP_VERSION` variable (~line 896)
- Always grep all references before delivery: `grep -n "BP_VERSION\|v4\.\|BUILD " index.html`
- Build string format: `YYYYMMDD-brief-description`
