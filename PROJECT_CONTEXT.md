# BLUEPRINT — Project Context
**Last Updated:** 2026-02-21
**Current Version:** v4.27.2.3 (build 20260221-values-overlay)
**Working Files:** index.html (21,319 lines), blueprint.css (4,055 lines), companies.json (58 companies)

## What Is Blueprint?
A career intelligence platform that maps professional skills through interactive visualizations. Users build skill profiles, discover role matches, and analyze job fit through network graphs, card views, and overlay lenses. Built as a single-page app (index.html + blueprint.css) with external JSON data files.

## Architecture

### Core Files
| File | Purpose | Lines/Size |
|------|---------|------------|
| `index.html` | All JS + HTML in single file | 21,319 |
| `blueprint.css` | All styles | 4,055 |
| `companies.json` | Company values/culture data | 58 companies |
| `skills/index-v3.json` | Skill library (14,000+ skills) | 2.4 MB |
| `skill_evidence.json` | Evidence patterns per skill | 52 KB |
| `skill_valuations.json` | Market values per skill | 6 KB |
| `values-library.json` | User values catalog (25 values, 5 groups) | 6 KB |
| `bls-wages.json` | Bureau of Labor Statistics wage data | — |
| `profiles-manifest.json` | Demo profile registry | 3 KB |
| `profiles/demo/*.json` | Individual demo profiles | 8-52 KB each |

### Version String Locations (ALL FOUR must stay in sync)
1. **Line 7** — HTML comment
2. **~Line 893** — JS comment
3. **~Line 894** — `var BP_VERSION`
4. **~Line 910** — `console.log` build string

⚠ Always `grep` all four and verify before delivery. Each change set increments the patch number.

## Compensation System (v4.27.2.0+)

### Three-Tier Architecture
| Priority | Source | When Used | Display |
|----------|--------|-----------|---------|
| 1 | `userData.profile.reportedComp` | User entered their own comp | "Your Compensation" |
| 2 | `DEMO_COMP[templateId]` | Demo profile with curated value | "Market Value" |
| 3 | `calculateTotalMarketValue()` | No other source available | "Market Estimate" |

### Key Functions
- **`formatCompValue(value)`** — Under $1M: `$185,000`. $1M+: `$4.5M`. $1B+: `$1.2B`
- **`getEffectiveComp()`** — Returns full calc object + `displayComp`, `compSource`, `compLabel`, `algorithmEstimate`
- **`calculateTotalMarketValue(mode)`** — BLS-based algorithm, mode = `'evidence'` or `'potential'`

### Curated Demo Compensation (DEMO_COMP)
```javascript
'steve-harrington': 45000,    'jesse-pinkman': 38000,
'dustin-henderson': 75000,    'eleven': 65000,
'joyce-byers': 52000,         'saul-goodman': 280000,
'walter-white': 185000,       'hank-schrader': 165000,
'jim-hopper': 135000,         'gus-fring': 4500000,
'kendall-roy': 8500000,       'shiv-roy': 5200000,
'roman-roy': 6800000,         'tom-wambsgans': 3800000,
'logan-roy': 95000000
```

### Blueprint Dashboard Display
- **Curated/reported profiles**: Prominent green gradient banner above stat cards showing curated value + BLS benchmark delta. When BLS Evidence = BLS Potential (common for demos), collapses to single "BLS Estimate" card.
- **Algorithm-only profiles**: Dual Evidence-Based / Potential cards (no banner).

### Self-Reported Comp Input Points
1. **Wizard step 4** — "Total Compensation (optional)" field
2. **Settings > Profile** — "$" prefixed input with comma formatting
3. Stored as `userData.profile.reportedComp` (integer, persists to Firestore)

### Why BLS Evidence = Potential for Demo Profiles
Demo profiles have all skills at Proficient or below with no evidence items. The premium factors that differentiate modes (work styles at Advanced+, critical depth at Expert+) both produce $0. Both modes converge on the same BLS base salary. **This is a data issue in the demo profiles, not a code bug.**

## Proficiency Levels

| Level | Color | Years Estimate | Points (valuation weight) |
|-------|-------|---------------|--------------------------|
| Mastery | #ef4444 (red) | 10+ years | 4 pts |
| Expert | #f97316 (orange) | 7–10 years | 3 pts |
| Advanced | #f59e0b (amber) | 4–7 years | 2 pts |
| Proficient | #10b981 (green) | 2–4 years | 1 pt |
| Novice | #6b7280 (gray) | 0–2 years | 0 pts |

**Guide from wizard prompt (line 5982):**
- Mastery = career-defining expertise (15+ yrs)
- Expert = deep proficiency (8-15 yrs)
- Advanced = strong competency (4-8 yrs)
- Proficient = solid (1-4 yrs)
- Novice = learning

### Impact on Valuation
- **Seniority boost**: totalPoints ≥ 80 → Director, ≥ 40 → Senior, ≥ 20 → Mid
- **Premium factors**: Work styles at Advanced+ (max 8%), Critical depth at Expert+ (max 5%)
- **Current demo profiles**: ALL skills at Proficient or below → totalPoints low → no seniority boost → no premium differentiation → Evidence = Potential

## Demo Profiles — Current State & Issues

### Active Profiles (15 + 1 incomplete)
| Profile | Show | Level | Skills | Curated Comp | Issues |
|---------|------|-------|--------|-------------|--------|
| Steve Harrington | Stranger Things | Early | ~24 | $45K | All Proficient, needs variety |
| Jesse Pinkman | Breaking Bad | Early | ~20 | $38K | All Proficient |
| Dustin Henderson | Stranger Things | Early | ~24 | $75K | All Proficient |
| Eleven | Stranger Things | Early | ~24 | $65K | All Proficient |
| Joyce Byers | Stranger Things | Mid | ~24 | $52K | All Proficient |
| Saul Goodman | Better Call Saul | Mid | ~29 | $280K | All Proficient, needs Expert in legal/negotiation |
| Walter White | Breaking Bad | Mid | ~20 | $185K | **Way too few skills**, all Proficient. 20yr professor needs 35+ skills, Mastery in chemistry |
| Hank Schrader | Breaking Bad | Senior | ~20 | $165K | All Proficient, needs Expert in investigation |
| Jim Hopper | Stranger Things | Senior | ~24 | $135K | All Proficient |
| Gus Fring | Breaking Bad | Exec | ~29 | $4.5M | **Way too few skills**, all Proficient. Empire builder needs 40+ skills, Mastery in operations/strategy |
| Kendall Roy | Succession | Exec | ~20 | $8.5M | All Proficient, needs Expert/Mastery in M&A/finance |
| Logan Roy | Succession | C-Suite | ~20 | $95M | **Critical**: 60yr media mogul has ~20 Proficient skills. Needs 50+ skills, Mastery in 10+, Expert in 15+ |
| Roman Roy | Succession | Exec | ~20 | $6.8M | All Proficient |
| Shiv Roy | Succession | Exec | ~20 | $5.2M | All Proficient |
| Tom Wambsgans | Succession | C-Suite | ~20 | $3.8M | All Proficient |
| Jamie Martinez | Original | — | — | — | Incomplete, needs curation or removal |

### DELETE from repo
- cliff-jones.json, mike-rodriguez.json, sarah-chen.json
- Update profiles-manifest.json to remove them

---

## 🚨 NEXT SESSION: DEMO PROFILE OVERHAUL

### The Problem
Every demo profile has ALL skills set to "Proficient" level. This causes:
1. **Evidence = Potential** on dashboard (no premium differentiation)
2. **Seniority boost doesn't fire** (totalPoints too low)
3. **Credibility gap** — Logan Roy with 20 Proficient skills is absurd for a 60-year C-suite mogul
4. **Skill counts too low** — executives should have 35-50+ skills

### What Each Profile Needs

**Early Career (Steve, Jesse, Dustin, Eleven):**
- 15-25 skills is fine
- Mix: mostly Proficient, a few Advanced in their specialty
- Jesse: Advanced in hands-on/trades skills, Novice in business
- Dustin: Advanced in STEM, Proficient in social
- Eleven: Expert in a couple unique abilities, Novice in conventional skills

**Mid Career (Walter, Joyce, Saul):**
- 25-35 skills
- Walter: **Mastery** in Organic Chemistry, Chemical Engineering, Lab Management. Expert in Teaching, Research Methodology, Grant Writing. Advanced in Analytical Thinking, Problem Solving. Add more academic/research skills.
- Saul: Expert in Negotiation, Persuasion, Contract Law, Marketing. Advanced in Client Relations, Crisis Management.
- Joyce: Advanced in Resourcefulness, Customer Service. Proficient in most.

**Senior (Hank, Hopper):**
- 30-40 skills
- Hank: Expert in Criminal Investigation, Forensic Analysis, Team Leadership. Advanced in Surveillance, Case Management.
- Hopper: Expert in Crisis Leadership, Investigation, Community Relations.

**Executive (Gus, Kendall, Shiv, Roman):**
- 35-50 skills
- Gus: **Mastery** in Strategic Operations, Supply Chain, Risk Management. Expert in Multi-Unit Management, Financial Planning, Talent Recruitment, Organizational Design. Advanced in Food Service Operations, Regulatory Compliance.
- Kendall: Expert in M&A, Capital Markets, Media Strategy. Advanced in Corporate Governance, Public Speaking.
- Shiv: Expert in Political Strategy, Organizational Behavior, Stakeholder Management.
- Roman: Expert in Content Strategy, Brand Development. Advanced in Digital Media.

**C-Suite (Logan, Tom):**
- Logan: **50+ skills**. Mastery in: Media Industry, Corporate Strategy, M&A, Negotiation, Board Governance, Competitive Intelligence, Crisis Management, Market Positioning, Executive Leadership, Talent Assessment. Expert in: Financial Modeling, Regulatory Navigation, Public Relations, International Business, Capital Allocation, Succession Planning, Risk Management, Government Relations, Brand Architecture, Content Strategy. Advanced in many more.
- Tom: 35-40 skills. Expert in Operations, Corporate Communications, Regulatory Compliance. Advanced in Media Production, Strategic Planning.

### How to Edit Demo Profiles
Each profile is a JSON file in `profiles/demo/`. Key structure:
```json
{
  "templateId": "logan-roy",
  "profile": { "name": "Logan Roy", "currentTitle": "CEO & Founder", ... },
  "skills": [
    { "name": "Corporate Strategy", "level": "Mastery", "category": "skill", "key": true, "roles": ["ceo"], "evidence": [] },
    ...
  ]
}
```

### Validation After Editing
After updating profiles, verify:
1. `calculateTotalMarketValue('evidence')` ≠ `calculateTotalMarketValue('potential')` — different levels should produce different totals
2. Seniority detection fires correctly (totalPoints ≥ 80 for C-suite profiles)
3. Dashboard shows differentiated Evidence vs Potential cards
4. "0 expert+" in stat cards changes to actual count

---

## Firestore Persistence

### Save Guard (v4.27.1.7+)
`saveToFirestore()` checks `userData.templateId`:
- `'firestore-*'` → own profile → save proceeds
- Any other value → demo profile → **save skipped silently**

### Sanitizer (v4.27.1.5+)
`sanitizeForFirestore(obj)` strips `undefined` values recursively before `.set()`.

## Mobile UI Patterns

### Values Mode (v4.27.2.3)
- **SVG**: Full viewport height `max(innerHeight - 200, 400)` — same as other modes
- **Panel**: `position: absolute; bottom: 70px` — overlays on SVG (same pattern as Match)
- **Panel max-height**: 55vh with overflow-y scroll
- **Panel placed inside**: `networkView.parentElement` with `position: relative`

### Match Mode (reference pattern)
- match-legend: `position: absolute; bottom: 70px` on mobile
- Appended to SVG parent container
- Full-height SVG, panel overlays

### Skill Modal
- Years estimate from proficiency level via `estimateSkillYears()`:
  Mastery→"10+", Expert→"7–10", Advanced→"4–7", Proficient→"2–4", Novice→"0–2"

## Values Overlay System
- **companies.json**: 58 companies, curated primary/secondary/tensions/story
- **Scoring**: primary aligned=20pts, secondary=10pts, tension=-15pts
- **Labels**: Contextual pill toggles (Roles/Skills in normal mode, Values in values mode)

## Version History (This Session: 2026-02-21)
| Version | Key Changes |
|---------|------------|
| v4.27.1.3–1.8 | Mobile stacking, SVG fit, Firestore sanitizer, tooltip fix, admin guard |
| v4.27.2.0 | **Comp system**: formatCompValue, DEMO_COMP, getEffectiveComp, self-reported input |
| v4.27.2.1 | Skill years estimation, mobile SVG/node adjustments |
| v4.27.2.2 | Curated comp banner above stat cards, collapse identical BLS cards |
| v4.27.2.3 | **Values panel overlay on mobile** (like Match), full-height SVG restored |

## File Output Locations
After each build session, final files go to:
- `/mnt/user-data/outputs/index.html`
- `/mnt/user-data/outputs/blueprint.css`
- `/mnt/user-data/outputs/companies.json`
