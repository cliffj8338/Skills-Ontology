# PROJECT_CONTEXT.md — Blueprint v4.7.0
**Updated:** 2026-02-19 | **Lines:** 16,696 | **Functions:** 313

## Architecture

Single-file SPA (`index.html`) deployed to GitHub Pages. No build step, no bundler. All HTML, CSS, and JS in one file. Firebase for auth + Firestore for persistence. D3.js for network visualization. jsPDF for PDF export. Claude API for AI-powered generation features.

**Repository:** https://github.com/cliffj8338/Skills-Ontology

### File Structure
```
index.html               — The entire application (16,696 lines)
profiles-manifest.json   — Sample profile metadata
skill_valuations.json    — Market value data for skills
skill_evidence.json      — Evidence/outcome data for skills
templates/               — Sample profile JSON files
```

### External Dependencies (CDN)
- D3.js v7 (network visualization)
- jsPDF 2.5.1 (PDF generation)
- Firebase 10.7.0 (auth + Firestore)
- Google Fonts: Outfit (400/500/600/700)

## Key Sections & Line Ranges (approximate)

| Section | Start | Fns | Notes |
|---------|-------|-----|-------|
| CSS Styles | 15 | — | ~3200 lines, CSS variables, light/dark themes |
| HTML Structure | 3200 | — | Nav, modals, controls, footer |
| Firebase Auth | 3920 | 7 | Google sign-in, email/password, magic link |
| Admin Panel | 4500 | 5 | User management (admin-only) |
| Hero Animation | 4707 | 1 | Solar system orbital model, click-emit particles |
| Sample Profiles | 4980 | 3 | Manifest loading, picker, viewSampleProfile |
| Profile Switching | 5490 | 4 | switchProfile, saveUserData, rebuildProfileDropdown |
| Skill Library | 5600 | 6 | ESCO/O*NET search, category browsing |
| Onboarding Wizard | 5990 | ~30 | 8-step wizard, resume parsing via Claude API |
| Network Visualization | 7000 | 15 | D3 force layout, role filtering, node interactions |
| Card View | 7649 | 3 | initCardView, domain grouping, level badges |
| View Router | 7918 | 5 | switchView, toggleSkillsView, updateStatsBar |
| Skill Detail Modal | 8400 | 8 | openSkillModal, edit, assess, evidence |
| Resume Generator | 8660 | 6 | HTML resume, print-to-PDF |
| Work Blueprint | 8800 | 10 | AI-powered via Claude API |
| Values System | 9200 | 47 | Evidence matching, notes, ordering |
| Purpose System | 9800 | 8 | AI generation, manual editing |
| Export Tab | 10100 | 8 | Cover letter, interview prep, LinkedIn |
| Cover Letter | 11000 | 6 | AI-powered via Claude API |
| Interview Prep | 11200 | 6 | AI-powered via Claude API |
| LinkedIn Profile | 11450 | 6 | AI-powered via Claude API |
| Opportunities/Jobs | 11700 | 26 | Job search, detail view, bookmarking |
| Job APIs | 12500 | 3 | RemoteOK, Remotive, ArbeitNow (CORS blocked) |
| Match Overlay | 12800 | 18 | Job-to-skill matching visualization |
| Applications Tracker | 13500 | 9 | Application status tracking |
| Settings | 13700 | 11 | Profile editing, theme, API key |
| Consent & Sharing | 14500 | 10 | CCPA/GDPR, sharing preferences |
| Impact/Valuation | 14700 | 12 | Skill market valuation, breakdown |
| Skill Search/Filter | 14700 | 3 | Network + card view filtering |
| UI Utilities | 15800 | 15 | Toast, legal notice, about, help |
| Profile Dropdown | 16500 | 5 | Toggle, close, switch, chip update |
| Filter Panel | 16600 | 3 | Toggle, apply, chip rendering |
| Resize + History | 16700 | 2 | Debounced resize, popstate handler |

## State Management

### Global Variables
- `userData` — Current profile (profile, skills, roles, outcomes, values, purpose)
- `skillsData` — Reference alias to userData.skills / userData.roles
- `currentView` — Active view ('network','opportunities','applications','blueprint','welcome','settings','consent')
- `currentSkillsView` — Sub-view ('network' or 'card')
- `activeRole` — Filtered role ID or 'all'
- `activeJobForNetwork` — Job object for match overlay, or null
- `fbUser` / `fbDb` / `fbIsAdmin` — Firebase auth state

### Init Flags (all reset on profile switch)
networkInitialized, cardViewInitialized, blueprintInitialized, opportunitiesInitialized, applicationsInitialized, consentInitialized, settingsInitialized

### localStorage Keys
currentProfile, wbTheme, wbAnthropicKey, wbValues, wbPurpose, wbMagicLinkEmail

## Completed Fixes (v4.7.0)

- C1: Debounced resize handler for network SVG
- C2: Browser back button (pushState/popstate)
- C3: Neutral profile chip on load (was hardcoded "Cliff Jurkiewicz")
- C4: Dynamic document title on profile switch
- H2-H6: Removed 370 lines dead functions (bulk mgmt, skill templates, old stubs)
- H7: Removed unused .bulk-mode CSS
- H8: Removed dead exportProfile pass-through
- M3: Modal open pushes history (back button closes modals)
- M5: Reset activeRole, activeJobForNetwork, search on profile switch
- M6: Fixed card view search (wrong DOM selectors)
- M9: Preconnect hints for Google Fonts
- L5: Removed orphaned wbHasVisited reference
- L7: Dynamic copyright year
- Profile toggle pill sync on mobile
- Network + card lazy-init in toggleSkillsView
- Profile dropdown race condition fix
- Hero network: solar system orbital + gravitational repulsion

## Known Issues — Remaining

### Functional Gaps
- M4: Zero accessibility (187 buttons, 1 aria-label)
- M8: Job APIs CORS-blocked in production (RemoteOK, Remotive, ArbeitNow)
- L8: Unnecessary initConsent() calls on theme change
- L9: 51 console statements need debug flag

### Features Not Yet Built
- Loading screen / splash with B4 logo
- Real-time save indicator
- Profile photo upload
- Read-only UI for sample profiles
- Consent preset persistence
- Move sample profiles to Firestore samples/ collection

### API-Dependent Features (need Claude API key in Settings)
generateWorkBlueprint, generateCoverLetter, generateInterviewPrep, generateLinkedInProfile, wizard resume parsing, purpose generation

## Hero Animation Details

Solar system model: center "YOU" fixed, 8 domain hubs in 3 orbital bands (inner 58-68px, mid 75-92px, outer 100-112px). Each hub has unique angular speed. ~31 skill nodes inherit parent speed ±12.5%. Hub-hub gravitational repulsion (angular nudge + radial push within 65px, hard limit 38px). Click-emit particles every 1.2-2s. Canvas-based, RAF with delta-time, IntersectionObserver pause.

## Development Gotchas

- `switchView('network')` = skills tab, not network-only
- `currentSkillsView` tracks network vs card sub-view
- Profile switch resets all init flags
- `skillsData` is reference alias, not copy
- `tv(darkVal, lightVal)` helper for theme-aware values
- `window.X = fn` makes closure functions accessible to onclick
- Hero uses polar coordinates (angle + dist from center)
- Brace balance: 0 (balanced). Parens: -2 (regex offset, not error)
