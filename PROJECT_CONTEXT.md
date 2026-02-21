# BLUEPRINT — Project Context
**Last Updated:** 2026-02-21
**Current Version:** v4.27.1.8 (build 20260221-chip-fix)
**Working Output Files:** index.html (21,107 lines), blueprint.css (4,057 lines), companies.json (58 companies)

## What Is Blueprint?
A career intelligence platform that maps professional skills through interactive visualizations. Users build skill profiles, discover role matches, and analyze job fit through network graphs, card views, and overlay lenses. Built as a single-page app (index.html + blueprint.css) with external JSON data files.

## Architecture

### Core Files
| File | Purpose | Lines/Size |
|------|---------|------------|
| `index.html` | All JS + HTML in single file | 21,107 |
| `blueprint.css` | All styles | 4,057 |
| `companies.json` | Company values/culture data | 58 companies |
| `skills/index-v3.json` | Skill library (14,000+ skills) | 2.4 MB |
| `skill_evidence.json` | Evidence patterns per skill | 52 KB |
| `skill_valuations.json` | Market values per skill | 6 KB |
| `values-library.json` | User values catalog (25 values, 5 groups) | 6 KB |
| `bls-wages.json` | Bureau of Labor Statistics wage data | — |
| `profiles-manifest.json` | Demo profile registry | 3 KB |
| `profiles/demo/*.json` | Individual demo profiles | 8-52 KB each |

### Data Loading (Promise.allSettled array)
```
[0] onet-skills-library.json    [5] trades-creative-library.json
[1] onet-abilities-library.json [6] values-library.json
[2] onet-workstyles-library.json[7] bls-wages.json
[3] onet-knowledge-library.json [8] companies.json
[4] onet-work-activities-library.json
```

### Version String Locations (ALL FOUR must stay in sync)
1. **Line 7** — HTML comment
2. **~Line 893** — JS comment
3. **~Line 894** — `var BP_VERSION`
4. **~Line 910** — `console.log` build string

⚠ Always `grep` all four and verify before delivery. Each change set increments the 4th digit.

## Firestore Persistence

### Save Guard (v4.27.1.7+)
`saveToFirestore()` checks `userData.templateId`:
- `'firestore-*'` → own profile → save proceeds
- Any other value → demo profile → **save skipped silently**

### Sanitizer (v4.27.1.5+)
`sanitizeForFirestore(obj)` strips `undefined` values recursively before `.set()`.

### Profile Chip
- Signed-in: header chip always shows **their own name** (even browsing demos)
- Non-signed-in: chip shows active demo profile name

## Demo Profiles (15 active + 1 incomplete)
| Profile | Show | Level | Curated Jobs |
|---------|------|-------|-------------|
| Dustin Henderson | Stranger Things | Early | MIT Lincoln Lab, NSA, Smithsonian |
| Eleven | Stranger Things | Early | Johns Hopkins, SAMHSA, NSA |
| Steve Harrington | Stranger Things | Early | YMCA, Target, Camp Tecumseh |
| Jim Hopper | Stranger Things | Senior | FEMA, Tesla, Monroe County |
| Joyce Byers | Stranger Things | Mid | NCMEC, Ace Hardware, Self-Employed |
| Jesse Pinkman | Breaking Bad | Early | West Elm, Snap-on, Boys & Girls Clubs |
| Walter White | Breaking Bad | Mid | UNM, Pfizer, McKinsey |
| Hank Schrader | Breaking Bad | Senior | Amazon Security, DHS, Walmart |
| Gus Fring | Breaking Bad | Exec | Yum! Brands, Sysco, Chipotle |
| Saul Goodman | Better Call Saul | Mid | Morgan & Morgan, Edelman, Dollar Shave Club |
| Kendall Roy | Succession | Exec | Paramount Global, Goldman Sachs, a16z |
| Logan Roy | Succession | C-Suite | Warner Bros Discovery, Apollo, News Corp |
| Roman Roy | Succession | Exec | Netflix, Universal Pictures, Spotify |
| Shiv Roy | Succession | Exec | Disney, McKinsey, Meta |
| Tom Wambsgans | Succession | C-Suite | iHeartMedia, Fox Corp, CNN |
| Jamie Martinez | Original | — | *(incomplete — needs curation or removal)* |

DELETE from repo: cliff-jones.json, mike-rodriguez.json, sarah-chen.json

## Values Overlay System (Complete)
- **companies.json**: 58 companies, curated primary/secondary/tensions/story
- **Scoring**: primary aligned=20pts, secondary=10pts, tension=-15pts
- **Panel**: Desktop=fixed+draggable, Mobile=inline below SVG
- **Labels**: Contextual pill toggles (Roles/Skills in normal mode, Values in values mode)
- **Mobile SVG**: Capped at min(420px, 48vh) to eliminate dead space
- **Tooltips**: Above-node positioning on mobile, flips below if needed

## Version History (This Session)
| Version | Key Changes |
|---------|------------|
| v4.27.0.0–0.1 | Values overlay MVP + fixes |
| v4.27.1.0 | companies.json externalization (58 companies) |
| v4.27.1.3 | Mobile panel stacking, CTA wrap |
| v4.27.1.4 | Mobile SVG compact height |
| v4.27.1.5 | Firestore sanitizer + null guards |
| v4.27.1.6 | Mobile tooltip repositioning |
| v4.27.1.7 | **Critical**: Skip Firestore save for demo profiles |
| v4.27.1.8 | Fix: signed-in admins keep own name in header chip |

## Known Issues / Next Steps
1. **Market value calibration** — BLS data unrealistic for demo profiles; need seniority-aware multipliers, C-suite ranges, number abbreviation ($1.2M, $100M+)
2. Jamie Martinez — incomplete profile
3. Delete removed profiles from repo + manifest
4. Full test pass: all 15 profiles × values overlay
5. Light theme testing
