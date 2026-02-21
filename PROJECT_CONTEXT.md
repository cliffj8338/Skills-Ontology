# BLUEPRINT — Project Context
**Last Updated:** 2026-02-21
**Current Version:** v4.27.1.3 (build 20260221-mobile-stack)
**Working Output Files:** index.html (21,058 lines), blueprint.css (4,030 lines), companies.json (58 companies)

## What Is Blueprint?
A career intelligence platform that maps professional skills through interactive visualizations. Users build skill profiles, discover role matches, and analyze job fit through network graphs, card views, and overlay lenses. Built as a single-page app (index.html + blueprint.css) with external JSON data files.

## Architecture

### Core Files
| File | Purpose | Lines/Size |
|------|---------|------------|
| `index.html` | All JS + HTML in single file | 21,058 |
| `blueprint.css` | All styles | 4,030 |
| `companies.json` | Company values/culture data | 58 companies |
| `skills/index-v3.json` | Skill library (14,000+ skills) | 2.4 MB |
| `skill_evidence.json` | Evidence patterns per skill | 52 KB |
| `skill_valuations.json` | Market values per skill | 6 KB |
| `values-library.json` | User values catalog (25 values, 5 groups) | 6 KB |
| `certification_library.json` | Certifications database | — |
| `bls-wages.json` | Bureau of Labor Statistics wage data | — |
| `trades-creative-library.json` | Trades/creative skills | 27 KB |
| `profiles-manifest.json` | Demo profile registry | 3 KB |
| `profiles/demo/*.json` | Individual demo profiles | 8-52 KB each |

### Data Loading
All JSON files load at startup via Promise.allSettled in the init function. The loader array index matters — if adding new data files, append to the array and update the index reference.

```
Loader array order:
[0] onet-skills-library.json
[1] onet-abilities-library.json
[2] onet-workstyles-library.json
[3] onet-knowledge-library.json
[4] onet-work-activities-library.json
[5] trades-creative-library.json
[6] values-library.json
[7] bls-wages.json
[8] companies.json
```

### Key Global Variables
- `BP_VERSION` — Display version string (currently `'v4.27.1.3'`)
- `companyDataLoaded` — Company values from companies.json (window global, object keyed by company name)
- `userData` — Current user's profile data
- `blueprintData` — Blueprint tab data including values
- `networkMatchMode` — Current network view: `'you'` | `'job'` | `'match'` | `'values'`

### Version String Locations (ALL FOUR must stay in sync)
1. **Line 7** — HTML comment: `<!-- v4.27.1.3 | 20260221 | ... -->`
2. **~Line 902** — JS comment: `// BLUEPRINT v4.27.1.3 - BUILD ...`
3. **~Line 903** — `var BP_VERSION = 'v4.27.1.3';`
4. **~Line 919** — `console.log` build string

⚠ **CRITICAL**: Always `grep` all four locations and verify consistency before delivering files. Every distinct set of changes increments the patch number (4th digit).

## Demo Profiles (TV Characters)

### Active Profiles (15 + 2 utility)
| Profile | File | Show | Role Level | Curated Job Companies |
|---------|------|------|-----------|----------------------|
| Alex Thompson | alex-thompson.json | Original | Entry-Mid | *(no savedJobs — uses generated)* |
| Dustin Henderson | dustin-henderson.json | Stranger Things | Early Career | MIT Lincoln Lab, NSA, Smithsonian |
| Eleven (Jane Hopper) | eleven.json | Stranger Things | Early Career | Johns Hopkins, SAMHSA, NSA |
| Gus Fring | gus-fring.json | Breaking Bad | Executive | Yum! Brands, Sysco, Chipotle |
| Hank Schrader | hank-schrader.json | Breaking Bad | Senior | Amazon Security, DHS, Walmart |
| Jesse Pinkman | jesse-pinkman.json | Breaking Bad | Early Career | West Elm, Snap-on, Boys & Girls Clubs |
| Jim Hopper | jim-hopper.json | Stranger Things | Senior | FEMA, Tesla, Monroe County |
| Joyce Byers | joyce-byers.json | Stranger Things | Mid-Career | NCMEC, Ace Hardware, Self-Employed (PI) |
| Kendall Roy | kendall-roy.json | Succession | Executive | Paramount Global, Goldman Sachs, a16z |
| Logan Roy | logan-roy.json | Succession | C-Suite | Warner Bros Discovery, Apollo, News Corp |
| Roman Roy | roman-roy.json | Succession | Executive | Netflix, Universal Pictures, Spotify |
| Saul Goodman | saul-goodman.json | Better Call Saul | Mid-Career | Morgan & Morgan, Edelman, Dollar Shave Club |
| Shiv Roy | shiv-roy.json | Succession | Executive | Disney, McKinsey, Meta |
| Steve Harrington | steve-harrington.json | Stranger Things | Early Career | YMCA, Target, Camp Tecumseh |
| Tom Wambsgans | tom-wambsgans.json | Succession | C-Suite | iHeartMedia, Fox Corp, CNN |
| Walter White | walter-white.json | Breaking Bad | Mid-Career | UNM, Pfizer, McKinsey |
| Jamie Martinez | jamie-martinez.json | Original | — | *(empty profile — needs curation or removal)* |

### REMOVED Profiles (delete everywhere)
- ~~cliff-jones.json~~ — DELETE from profiles/demo/ and profiles-manifest.json
- ~~mike-rodriguez.json~~ — DELETE from profiles/demo/ and profiles-manifest.json
- ~~sarah-chen.json~~ — DELETE from profiles/demo/ and profiles-manifest.json

### Generated Job Companies (from getSampleJobsForProfile)
When a profile has no curated `savedJobs`, the system generates 3 sample jobs based on detected role type:

| Role Type | Companies |
|-----------|-----------|
| Recruiter | Datadog, Figma, McKinsey |
| Product | Notion, Stripe, Scale AI |
| Retail | Target, Starbucks, Nordstrom |
| Trades | Great Clips, Aveda Salon, Ulta Beauty |
| Strategy/Exec (default) | ServiceNow, Deloitte, Palantir |
| Tech/Engineering | Cloudflare, Datadog, Anthropic |

All of these companies are in `companies.json`.

## Values Overlay System (Complete as of v4.27.1.3)

### Architecture: Three Entities
```
PROFILES (people)          COMPANIES (organizations)       JOBS (positions)
├── skills                 ├── name                        ├── title
├── values (25 catalog)    ├── industry                    ├── company → refs COMPANY
├── roles                  ├── values                      ├── required skills
├── work history           │   ├── primary[]               ├── companyValues (lazy-computed)
└── purpose                │   ├── secondary[]             ├── match scores
                           │   ├── tensions[]              └── seniority
                           │   └── story (narrative)
                           └── future: news, sentiment...
```

### Company Values Data (companies.json)
- **58 curated company profiles** covering all demo profile jobs + generated jobs
- Each company: `industry`, `values.primary[]`, `values.secondary[]`, `values.tensions[]`, `values.story`
- Values drawn from the VALUES_CATALOG (25 values across 5 groups)
- Loaded at startup via index 8 in Promise.allSettled → `window.companyDataLoaded`
- Lookup chain in `getCompanyValues()`: exact name → case-insensitive → partial match (e.g. "Amazon Security" → "Amazon") → JD inference fallback → generic defaults

### VALUES_CATALOG (25 values)
Excellence, Strategic Thinking, Collaboration, Accountability, Courage, Integrity, Empathy, Curiosity, Craftsmanship, Bias Toward Action, Continuous Improvement, Servant Leadership, Authenticity, Purpose Over Profit, Inclusion, Systems Thinking, Evidence-Based Decision Making, Resourcefulness, Transparency, Trust, Empowerment, Work-Life Boundaries, Intellectual Honesty, Candor, Resilience.

### Values Alignment Scoring
`computeValuesAlignment(userValues, companyValues)` returns:
- `score` (0-100%) — weighted overlap
- `aligned[]` — shared values (green)
- `yourPriority[]` — user values company doesn't signal (amber)
- `theirPriority[]` — company values user doesn't hold (indigo)
- `tensionRisk[]` — user values that conflict with company tensions (red)

Weights: primary aligned = 20pts, secondary aligned = 10pts, tension penalty = -15pts.

### Network Visualization (Values Mode)
`initValuesNetwork(job)` — dual-hub force-directed graph:
- Left hub: "[First Name]'s Values" cluster (uses smart possessive: "Gus'" not "Gus's")
- Right hub: "[Company]'s Culture" cluster (same grammar: "Yum! Brands'" not "Brands's")
- Green bridge links for aligned values
- Color coding: green (aligned), amber (your priority), indigo (their priority), red (tension)
- ⚠ tension marker nodes between hubs
- Hub labels: clean text, no text-shadow (`.node.hub text { text-shadow: none; }`)

### Values Alignment Panel (v4.27.1.3)
**Desktop** (>768px):
- `position: fixed` — viewport-pinned, won't scroll away
- Draggable by header (mouse + touch support via `initPanelDrag`)
- Merged job info in header (title + company) — eliminates separate `jobInfoTile` in values mode
- Collapse (−/+) toggles body visibility; Close (✕) removes panel from DOM
- Width: 320px, glass morphism styling

**Mobile** (≤768px):
- `position: relative` — inline flow after SVG, scrollable
- Full-width, no border-radius on sides, stacks below the graph
- No drag (not needed — it's in document flow)
- Same collapse/close controls
- Job info tile suppressed in values mode

### Job Detail CTA Area
- "Compare Skills" + "Values Fit" buttons in `.jd-cta-box`
- Desktop: horizontal flex with description text alongside
- Mobile: stacks vertically (`.jd-cta-box { flex-direction: column; }`)
- Values alignment badge with score, aligned/friction counts, company story

### UI Integration Points
- Match mode toggle: You / Job / Match / **Values** buttons
- Job detail view: "Values Fit" button alongside "Compare Skills"
- Values alignment score badge in job detail stats area
- Values alignment panel (desktop: floating/draggable, mobile: inline stacked)

### Key Functions
| Function | Purpose |
|----------|---------|
| `getCompanyValues(name, rawText)` | Lookup company → companies.json (3-tier match + JD inference fallback) |
| `inferCompanyValuesFromJD(rawText)` | Keyword scan against VALUES_CATALOG, returns primary/secondary |
| `computeValuesAlignment(userValues, companyValues)` | Scoring algorithm |
| `initValuesNetwork(job)` | Dual-hub D3 force-directed visualization |
| `addValuesAlignmentPanel(alignment, job, cv)` | Panel builder (desktop: fixed+drag, mobile: inline) |
| `toggleValuesPanel()` | Collapse/expand panel body |
| `closeValuesPanel()` | Remove panel from DOM |
| `initPanelDrag(panel, handle)` | Desktop drag handler (mouse + touch) |
| `activateValuesOverlay(idx)` | Direct activation from job detail view |

### Known Fix: rawText vs description
Curated jobs use `description` field, generated jobs use `rawText`. All value lookups use `job.rawText || job.description || ''` as fallback chain (7 call sites, all consistent).

## Version History (This Session)

### v4.27.0.0 — Values Overlay MVP
- Company values catalog (17 inline companies in COMPANY_VALUES)
- JD inference engine
- Alignment scoring algorithm
- Dual-hub network visualization
- Values alignment panel
- UI integration (buttons, badges, panel)
- CSS additions (~64 lines)

### v4.27.0.1 — Fix: Missing Company Values
- Lazy computation: companyValues computed on-demand if missing from job object
- Case-insensitive company name lookup
- Generic fallback for JDs with no keyword matches
- Diagnostic console.warn logging

### v4.27.1.0 — Companies.json Architecture
- **Externalized** all company values from inline COMPANY_VALUES to `companies.json`
- 58 curated company profiles covering all demo profile jobs + generated jobs
- Startup loader integration (index 8 in Promise.allSettled array)
- Removed inline COMPANY_VALUES constant
- `getCompanyValues()` reads from `window.companyDataLoaded` global
- Added 3-tier name matching: exact → case-insensitive → partial match
- All 7 `getCompanyValues()` call sites updated with `rawText || description || ''` fallback

### v4.27.1.1 — Panel Collapse/Close + Hub Labels (rolled into v4.27.1.3)
- Panel header with collapse (−) and close (✕) controls
- Hub label text-shadow removed (clean typography)
- Possessive grammar fix (smart apostrophe for names ending in 's')

### v4.27.1.2 — Panel Merge + Drag (rolled into v4.27.1.3)
- Job info tile merged into values panel header
- Panel repositioned from `position: absolute` to `position: fixed`
- Desktop drag support (mouse + touch)

### v4.27.1.3 — Mobile Stacking + CTA Fix (current)
- Mobile: values panel switches to `position: relative` inline flow below SVG
- Mobile: full-width stacked layout, scrollable, no overlap
- Mobile: job info tile suppressed in values mode
- Job detail CTA area: flex-wrap on mobile, stacks vertically
- Consolidated all v4.27.1.1 and v4.27.1.2 improvements

## Known Issues / TODO

### Bugs
1. **Jamie Martinez profile** — appears to be an empty/incomplete profile. Needs curation or removal.

### Cleanup
1. Delete cliff-jones.json, mike-rodriguez.json, sarah-chen.json from repo
2. Update profiles-manifest.json to remove those three profiles

### Testing Needed
1. Verify values overlay works for ALL 15 active demo profiles after companies.json integration
2. Test curated job `description` fallback (Kendall/Paramount, Gus/Yum! Brands)
3. Mobile testing across all demo profiles for values panel stacking
4. Light theme testing for values panel and hub labels

### Future Enhancements
- **Company enrichment**: Add news signals, Glassdoor sentiment, financial health to company profiles
- **Real-time inference**: When real users paste JDs, extract company name and enrich from web
- **Stated vs Lived values**: Gap analysis between what companies say and what employees report
- **Values over time**: Track how user values evolve across career transitions
- **Values in job recommendations**: Weight values alignment in overall job match score
- **Match/Job panels**: Apply same floating/draggable/mobile-stacking pattern to match legend and job network overlays for consistency

## Technical Notes

### Adding a New Demo Profile
1. Create `profiles/demo/{name}.json` with full profile structure
2. Add entry to `profiles-manifest.json`
3. For each company in `savedJobs`, ensure it exists in `companies.json`
4. If profile type doesn't match existing generated job categories, add new category in `getSampleJobsForProfile`

### Adding a New Company to companies.json
```json
"Company Name": {
    "industry": "Industry / Sector",
    "values": {
        "primary": ["Value1", "Value2", "Value3"],
        "secondary": ["Value4", "Value5"],
        "tensions": ["Value6"],
        "story": "2-3 sentence culture narrative..."
    }
}
```
Values must come from the VALUES_CATALOG (25 values listed above).

### Network Visualization Modes
| Mode | Hub(s) | Nodes | Links | Panel |
|------|--------|-------|-------|-------|
| You | Person | Skills by role | Role→Skill | None |
| Job | Job | Required skills | Role→Skill | Job info tile |
| Match | Person + Job | Overlapping skills | Match bridges | Match legend |
| Values | Your Values + Company Culture | Values | Alignment bridges | Values panel (merged job info) |

## File Output Locations
After each build session, final files go to:
- `/mnt/user-data/outputs/index.html`
- `/mnt/user-data/outputs/blueprint.css`
- `/mnt/user-data/outputs/companies.json`
