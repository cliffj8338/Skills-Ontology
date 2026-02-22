# BLUEPRINT™ — Project Context
**Version:** v4.27.3.3 | **Date:** February 21, 2026 | **Next Focus:** Guided Tour / Onboarding

---

## What Blueprint Is

Blueprint is a career intelligence platform that maps professional skills through interactive visualizations. Users build a "career blueprint" — a structured profile of skills (with evidence), values, work history, and outcomes — then match it against real job descriptions to see fit scores, gaps, and compensation estimates.

The app is a single-page application: one `index.html` file (~21,500 lines), one external `blueprint.css` (~4,055 lines), with demo profiles loaded from JSON files via a `profiles-manifest.json`.

**Live URL:** https://cliffj8338.github.io  
**Hosting:** GitHub Pages (static files only, no backend)  
**Auth:** Firebase (Firestore for user data, Firebase Auth for sign-in)  
**Data sources:** ESCO classification (EU), O*NET occupational data, BLS salary benchmarks

---

## Architecture

### File Structure
```
/
├── index.html              # Main app (~21,500 lines — HTML + all JS inline)
├── blueprint.css           # All styles (~4,055 lines, includes mobile responsive)
├── profiles-manifest.json  # Registry of all 18 demo profiles
├── profiles/
│   ├── demo/               # 18 character JSON profiles
│   │   ├── walter-white.json
│   │   ├── gus-fring.json
│   │   ├── logan-roy.json
│   │   ├── vecna.json
│   │   ├── tuco-salamanca.json
│   │   ├── connor-roy.json
│   │   └── ... (18 total)
│   └── templates/
│       └── blank.json      # Empty template for new users
├── skills/
│   └── index-v3.json       # 14,000+ skill library with ESCO/O*NET mappings
├── companies.json           # Company values profiles for values alignment
└── skill_evidence.json      # Evidence templates (optional)
```

### Key Global Objects
- **`userData`** — Current profile data (skills, values, work history, roles, etc.)
- **`blueprintData`** — Derived data (outcomes extracted from evidence, values, purpose)
- **`skillsData`** — Reference to userData.skills + roles (used by network visualization)
- **`templates`** — All loaded profile templates keyed by templateId
- **`window.profilesManifest`** — The manifest of available demo profiles
- **`window.companyDataLoaded`** — Company values database from companies.json

### Data Flow for Demo Profiles
1. `initializeApp()` → fetches `profiles-manifest.json`
2. Loads each enabled profile JSON into `templates{}`
3. `loadTemplate(templateId)` → populates `userData` from template
4. Clears localStorage (`wbValues`, `wbPurpose`) to prevent crossover
5. `getSampleJobsForProfile()` → generates 3 tailored demo jobs per character
6. `inferValues()` → reads `userData.values` into `blueprintData.values`
7. Views render from `userData` and `blueprintData`

---

## Navigation Structure

### Desktop Top Nav
```
SKILLS | JOBS | BLUEPRINT | SETTINGS | SAMPLES
```
Plus: Sign In button, dark/light theme toggle, overflow menu (···)

### Mobile Bottom Nav
```
SKILLS | JOBS | BLUEPRINT | SETTINGS | MORE
```
SAMPLES is accessed via the overflow menu (···) on mobile.

---

## Main Views — What's In Each

### 1. SKILLS (default landing view)
The interactive skill network visualization.

**Sub-views (toggle buttons):**
- **Network** — Force-directed graph showing skills as colored nodes clustered by role. Node size = proficiency level. Colors = role assignments. Lines = relationships.
- **Card** — Traditional card/list view of all skills with proficiency badges.

**Overlay modes (appear when a job is selected from Jobs tab):**
- **You** — Default; shows your skills only
- **Job** — Shows job's required skills
- **Match** — Shows overlap (green=matched, red=gap, gray=surplus)
- **Values** — Force graph showing your values vs. company values alignment

**What users can do here:**
- Tap/click any node to see skill details, evidence, proficiency
- Drag nodes to reposition (they stick)
- Select a job from the Jobs tab to activate overlay modes
- View values alignment visualization per job

**Recent change (v4.27.3.3):** Removed the labels toggle (Roles/Skills/Values pills), search input, and filter button from the toolbar. Nodes are interactive — tap for details.

### 2. JOBS
Job pipeline and matching system.

**Sub-tabs:**
- **Pipeline** — Saved jobs with match scores, skill gap analysis, BLS salary estimates
- **Tracker** — Application tracking (status, dates, notes)
- **Find Jobs** — Job search/paste interface

**Per-job features:**
- Match percentage (skill overlap score)
- Matched skills / Gaps / Surplus counts
- BLS salary range estimate
- "Demo job" badge for sample profiles
- Click to expand → full skill breakdown, gap analysis
- Scouting Report generation (targeted job analysis)

**Demo jobs:** Each of the 18 characters gets 3 tailored jobs:
- **High match** (~80-90% skill match, 71% values alignment)
- **Mid match** (~50-65% skill match, 57% values alignment)
- **Low/stretch** (<50% skill match, 29% values alignment)

### 3. BLUEPRINT
The career intelligence dashboard.

**Sub-tabs:**
- **Dashboard** — Hero compensation card, skill distribution bar, purpose statement, quick actions
- **Skills** — Detailed skill list with proficiency levels, evidence, role assignments
- **Experience** — Work history, education, certifications timeline
- **Outcomes** — Extracted from skill evidence (auto-generated)
- **Values** — 7 selected values with descriptions, evidence linking
- **Export** — PDF Summary, Executive Blueprint (HTML), Scouting Report, Negotiation Guide

**Compensation display (Dashboard):**
- Demo profiles with curated comp → shows "MARKET VALUE" hero card (e.g., Logan Roy $95M)
- Demo profiles without curated comp → shows "EVIDENCE-BASED" and "POTENTIAL" cards
- Real users with reported comp → shows "YOUR COMPENSATION" card
- All show BLS Benchmark comparison

**Quick Actions row:**
- Manage Skills → Skills tab
- Scouting Report → generates targeted PDF
- PDF Summary → full career summary PDF
- Executive Blueprint → HTML email-ready format
- Negotiation Guide → salary strategy document

### 4. SETTINGS
User configuration.

**Sub-tabs:**
- **Profile** — Name, title, location, seniority level, reported compensation
- **Preferences** — Target roles, industries, salary minimums, location preferences
- **Privacy** — Data controls, export/delete, terms of service

### 5. SAMPLES (accessed via nav or overflow menu)
The demo profile browser.

**Structure:** Three show collections displayed as tabbed sections:
- **Breaking Bad** (6 characters) — green accent
- **Stranger Things** (6 characters) — red accent
- **Succession** (6 characters) — gold accent

Each character card shows: name, emoji, title, skill count, description, "View →" button.
Clicking "View" loads the profile via `switchProfile()`.

---

## The 18 Demo Profiles

### Breaking Bad
| Character | Skills | Level | Curated Comp | Fun Values |
|---|---|---|---|---|
| Walter White | 37 | Mid-Career | $185K | Empire Building, Say My Name |
| Gus Fring | 43 | Executive | $4.5M | Calculated Ruthlessness, Operational Paranoia |
| Hank Schrader | 30 | Senior | $165K | Relentless Pursuit, The Badge Means Something |
| Jesse Pinkman | 19 | Early Career | $38K | Loyalty Over Logic, No More Half Measures |
| Saul Goodman | 29 | Mid-Career | $280K | Creative Ethics, Hustle Over Pedigree |
| Tuco Salamanca | 17 | Mid-Career | $425K | Tight Tight Tight!, Fear Is Respect |

### Stranger Things
| Character | Skills | Level | Curated Comp | Fun Values |
|---|---|---|---|---|
| Jim Hopper | 25 | Senior | $135K | (all 7 catalog — wholesome) |
| Eleven | 15 | Early Career | $65K | (all 7 catalog — wholesome) |
| Steve Harrington | 16 | Early Career | $45K | (all 7 catalog — wholesome) |
| Dustin Henderson | 16 | Early Career | $75K | (all 7 catalog — wholesome) |
| Joyce Byers | 17 | Mid-Career | $52K | (all 7 catalog — wholesome) |
| Vecna | 21 | C-Suite | $12M | Dominion Over All, Suffering Builds Order, One Mind One Purpose, The First Shadow |

### Succession
| Character | Skills | Level | Curated Comp | Fun Values |
|---|---|---|---|---|
| Logan Roy | 61 | C-Suite | $95M | Absolute Control, Legacy Through Dominance |
| Kendall Roy | 23 | Executive | $8.5M | Proving Them Wrong, L to the OG |
| Shiv Roy | 25 | Executive | $5.2M | Power Over Permission, Redesign the Table |
| Roman Roy | 24 | Executive | $6.8M | Chaos as Strategy, Comedy Is Tragedy Plus Time |
| Tom Wambsgans | 25 | C-Suite | $3.8M | Survival Instinct, The Long Game |
| Connor Roy | 20 | Executive | $1.2M | The Eldest Son, Austerlitz State of Mind |

---

## Values System

### VALUES_CATALOG (25 canonical values in 5 groups)
```
How I Think:    Intellectual Honesty, Strategic Thinking, Curiosity, Evidence-Based Decision Making, Systems Thinking
How I Lead:     Accountability, Servant Leadership, Empowerment, Transparency, Courage
How I Work:     Excellence, Resourcefulness, Bias Toward Action, Continuous Improvement, Craftsmanship
How I Connect:  Empathy, Collaboration, Trust, Candor, Inclusion
What I Protect: Integrity, Resilience, Authenticity, Work-Life Boundaries, Purpose Over Profit
```

### Values Scoring Math
- Each user has 7 values (5 from catalog + 2 custom/fun for BB/Succession; 7 catalog for Stranger Things)
- `maxScore = 7 × 20 = 140`
- Company primary match = +20 pts, secondary = +10 pts, tension = -15 pts
- Score = `Math.round((rawScore / maxScore) * 100)`, clamped 0-100

### Demo Job Values Bands
- **High tier:** 5 user catalog values as company primary → **71%**
- **Mid tier:** 4 user catalog values as company primary → **57%**
- **Low tier:** 2 user catalog values as company primary → **29%**

Non-user catalog values used as filler so company profiles look realistic.

---

## Key Technical Details

### Profile Switch Flow (critical — recent bug fixes)
When `switchProfile(templateId)` fires:
1. `loadTemplate()` populates `userData` from JSON template
2. `safeRemove('wbValues')` + `safeRemove('wbPurpose')` clears localStorage
3. `blueprintData.values = []` + `inferValues()` forces fresh values from new profile
4. `extractOutcomesFromEvidence()` refreshes outcomes
5. All `*Initialized` flags reset to false → views re-render on next visit
6. `rescoreAllJobs()` re-matches jobs against new skill set

### Compensation System (DEMO_COMP)
Curated comp values in `DEMO_COMP{}` object (line ~3872). When `getEffectiveComp()` finds a match:
- Shows "MARKET VALUE" hero card instead of algorithm-based cards
- `compSource = 'curated'`
- BLS algorithm estimate shown as benchmark comparison

### Sample Jobs Generation
`getSampleJobsForProfile(templateId, template)` at line ~4965:
1. Checks `characterJobs[templateId]` map first (18 character-specific job sets)
2. Falls back to role-type detection (recruiter/product/strategy/tech/retail/trades)
3. Generates `parsedSkills` arrays with calibrated overlap for high/mid/low tiers
4. Attaches curated `companyValues` for deterministic values scoring

---

## Recent Session Changes (Feb 21, 2026)

### v4.27.2.4 → v4.27.3.3 (this session)
1. **Values system overhaul** — All 18 profiles updated to 7 values each (5 catalog + 2 fun for BB/Succession)
2. **3 new profiles** — Vecna, Tuco Salamanca, Connor Roy (full profiles with skills, evidence, values, work history)
3. **Profiles-manifest.json** — Created with all 18 profiles registered
4. **Samples page updated** — All 3 shows now have 6 characters each
5. **Character-specific demo jobs** — 18 unique job sets (54 total jobs) replacing generic fallback
6. **Values scoring bands** — Deterministic 71%/57%/29% bands for high/mid/low jobs
7. **Values crossover bug fixed** — `blueprintData.values` now cleared + re-inferred on profile switch
8. **localStorage persistence bug fixed** — `wbValues`/`wbPurpose` cleared on demo profile load
9. **DEMO_COMP updated** — Added Vecna ($12M), Tuco ($425K), Connor ($1.2M)
10. **Toolbar cleanup** — Removed labels toggle, search input, filter button from network view

---

## Next Session: Guided Tour

### Goal
Build an interactive guided tour that walks new users through Blueprint's features and shows them where things are and how to use them. This is especially important because:
- The app has a lot of depth that isn't immediately obvious
- Demo profile visitors need to understand what they're looking at
- The network visualization is powerful but non-obvious
- Job matching, values overlay, and scouting reports need discovery

### Key Screens/Features to Cover in the Tour

**1. Skills Network (landing page)**
- What the nodes represent (skills, sized by proficiency, colored by role)
- How to interact: tap a node to see details, drag to reposition
- Role clusters and what they mean

**2. Job Matching**
- How to view saved jobs in the Pipeline
- What match percentage means
- How to activate a job overlay (You/Job/Match/Values modes)
- The Values alignment visualization

**3. Blueprint Dashboard**
- Compensation cards (what evidence-based vs. potential means)
- Skill distribution bar
- Purpose statement
- Quick actions (Scouting Report, PDF, etc.)

**4. Blueprint Sub-tabs**
- Skills tab (detailed view with evidence)
- Experience tab (work history timeline)
- Outcomes tab (auto-extracted achievements)
- Values tab (selected values + evidence linking)
- Export tab (all output formats)

**5. Samples Browser**
- How to browse character profiles
- Switching between shows
- What "View" does

**6. Hidden/Power Features**
- Values overlay on the network (select a job → click Values)
- Scouting Report generation (per-job targeted analysis)
- Negotiation Guide (salary strategy)
- Profile switching via the dropdown

### Implementation Considerations
- Should work on both desktop and mobile
- Demo profile visitors are read-only — tour should not prompt them to edit
- Tour should be dismissable and not block usage
- Consider a "?" help button that re-launches the tour
- Tooltip/spotlight approach (highlight an element, explain it, advance)
- Could use a library like Shepherd.js, Intro.js, or custom implementation
- **No external network access** — any library must be self-contained or CDN-linked if available

### Tour Trigger Points
- First visit (no profile loaded yet)
- After loading a demo profile for the first time
- Manual trigger from a help button
- Potentially different tours for different contexts (Skills tour, Jobs tour, Blueprint tour)

---

## Version Convention
Every deployment bumps the version in ALL THREE locations:
1. HTML comment (line 7): `<!-- v4.27.3.3 | date | description -->`
2. JS comment (line ~893): `// BLUEPRINT v4.27.3.3 - BUILD date-tag`
3. `BP_VERSION` variable (line ~894): `var BP_VERSION = 'v4.27.3.3';`

Build string in console log should also be updated.

**Always grep all version references before delivering files to verify consistency.**

---

## Known Issues / Technical Debt
- The `inferValues()` function has a 3-step priority chain (localStorage → profile → auto-inference) that was the source of the values crossover bug. The fix works but the architecture could be simplified.
- `index.html` is 21,500+ lines — everything inline. CSS is separate but JS is not.
- The `getSampleJobsForProfile()` function is now very large with 18 character-specific job sets.
- Some CSS for the toolbar elements was overriding `display:none` on mobile — fixed with `!important` but not ideal.
- The onboarding wizard (8-step flow for new users) exists but may conflict with a guided tour — needs coordination.

---

## Pending Changes (Ready to Implement Next Session)

### 1. Network Labels — Always ON
The labels toggle was removed (v4.27.3.3) but the default label visibility needs to be set to `true` for both roles and skills so they always render. Currently labels may default to off since the toggle that controlled them is gone.

### 2. Market Value Adjustments — Illicit Economy Characters
Several Breaking Bad characters have curated comp values that don't reflect their actual show-canon earnings. The whole point of these characters is they operate outside legal comp bands.

| Character | Current | Proposed | Rationale |
|---|---|---|---|
| Walter White | $185K | $3.2M | At peak clearing ~$80M/yr; "market value" of a chemistry genius with his operation |
| Saul Goodman | $280K | $1.8M | Sandpiper settlement alone was $2.16M, plus cash practice revenue |
| Tuco Salamanca | $425K | $2.1M | Moving $5M+/month through his distribution network |
| Jesse Pinkman | $38K | $450K | Started low but eventually a skilled cook earning serious money |
| Hank Schrader | $165K | $165K | *(stays — legitimate federal employee)* |
| Gus Fring | $4.5M | $4.5M | *(already reflects the empire — correct)* |

### 3. Profile Identification Banner — State Matrix

**Problem:** When viewing demo profiles, there's no indication of WHOSE profile you're looking at on the Blueprint, Jobs, or Settings pages. You'd have to remember what you clicked.

**Solution:** Enrich the existing gold sample banner (already on every page for demo viewers) to include the profile name. The banner content changes based on auth state and context.

#### Banner State Logic

```
if (viewing own profile)         → NO BANNER (it's their app)
if (not signed in + sample)      → "🔒 Viewing: {name} · Sample profile. Join waitlist or sign in."
if (signed in + waitlisted)      → "🔒 Viewing: {name} · Sample profile. You're #{position} on the waitlist."
if (signed in + active + sample) → "🔒 Viewing: {name} · Sample profile. ← Back to my profile"
if (admin + sample)              → "🔒 Viewing: {name} · Admin mode"
```

#### Full State Matrix

| State | Signed In? | Viewing | Header (top-right) | Banner |
|---|---|---|---|---|
| **Demo visitor** | No | Sample profile | Sign In button | 🔒 **Viewing: Walter White** · Sample profile. Join the waitlist or sign in. |
| **Waitlisted user** | Yes | Sample (no own profile yet) | **Jane Smith** badge | 🔒 **Viewing: Walter White** · Sample profile. You're #142 on the waitlist. |
| **Active user** | Yes | Own profile | **Jane Smith** badge | *(no banner)* |
| **Active user browsing** | Yes | Sample profile | **Jane Smith** badge | 🔒 **Viewing: Walter White** · Sample profile. ← Back to my profile |
| **Admin** | Yes | Sample profile | **Cliff** badge (admin) | 🔒 **Viewing: Walter White** · Admin mode |

#### Header Badge Behavior
- **Not signed in:** "Sign In" button (current behavior)
- **Signed in (user):** User's name badge replaces Sign In button (same position, same spot)
- **Signed in (admin):** Admin badge with name (already implemented)
- Badge is persistent across all pages — it identifies WHO is using the app
- Banner identifies WHAT they're viewing (only shows when viewing something other than their own profile)

#### Key Design Principle
The **header badge** = WHO you are. The **banner** = WHAT you're viewing. These never conflict because:
- Your own profile → badge shows your name, no banner needed
- Someone else's profile → badge still shows YOUR name, banner shows WHOSE profile
- Not signed in → no badge (Sign In button), banner shows profile name + CTA

This extends cleanly to future features like team views, shared profiles, or recruiter browsing candidate blueprints.

