# PROJECT_CONTEXT.md — Blueprint v4.8.0
**Updated:** 2026-02-19 | **Lines:** 16,846 | **Functions:** ~315

## Architecture

Single-file SPA (`index.html`) deployed to GitHub Pages. No build step, no bundler. All HTML, CSS, and JS in one file. Firebase for auth + Firestore for persistence. D3.js for network visualization. jsPDF for PDF export. Claude API for AI-powered generation features.

**Repository:** https://github.com/cliffj8338/Skills-Ontology

### External Dependencies (CDN)
- D3.js v7 (network visualization)
- jsPDF 2.5.1 (PDF generation)
- Firebase 10.7.0 (auth + Firestore)
- Google Fonts: Outfit (400/500/600/700) with preconnect

## Key Sections & Line Ranges (approximate)

| Section | Start | Fns | Notes |
|---------|-------|-----|-------|
| CSS Styles | 15 | — | ~3200 lines, light/dark themes, readonly-mode rules |
| Loading Splash | 3198 | — | SVG logo, progress bar, 8s failsafe timeout |
| HTML Structure | 3230 | — | Nav, modals, controls, footer |
| Firebase Auth | 3950 | 7 | Google sign-in, email/password, magic link |
| Firestore Save | 4335 | 2 | saveToFirestore with save indicator, loadUserFromFirestore |
| Admin Panel | 4530 | 5 | User management (admin-only) |
| Read-Only System | 4588 | 2 | checkReadOnly, readOnlyGuard; CSS + JS enforcement |
| Hero Animation | 4730 | 1 | Solar system orbital model, click-emit particles |
| Sample Profiles | 5010 | 3 | Manifest loading, picker, viewSampleProfile |
| Profile Switching | 5520 | 4 | switchProfile, saveUserData, rebuildProfileDropdown |
| App Init | 5760 | 1 | initializeApp: manifest→profiles→auth→splash dismiss |
| Skill Library | 5640 | 6 | ESCO/O*NET search, category browsing |
| Onboarding Wizard | 6030 | ~30 | 8-step wizard, resume parsing via Claude API |
| Network Visualization | 7040 | 15 | D3 force layout, role filtering, node interactions |
| Card View | 7690 | 3 | initCardView, domain grouping, level badges |
| View Router | 7960 | 5 | switchView (with pushState), toggleSkillsView, updateStatsBar |
| Skill Detail Modal | 8440 | 8 | openSkillModal, edit, assess, evidence |
| Resume Generator | 8700 | 6 | HTML resume, print-to-PDF |
| Work Blueprint | 8840 | 10 | AI-powered via Claude API |
| Values System | 9250 | 47 | Evidence matching, notes, ordering |
| Purpose System | 9850 | 8 | AI generation, manual editing |
| Export Tab | 10150 | 8 | Cover letter, interview prep, LinkedIn |
| Cover Letter | 11050 | 6 | AI-powered via Claude API |
| Interview Prep | 11250 | 6 | AI-powered via Claude API |
| LinkedIn Profile | 11500 | 6 | AI-powered via Claude API |
| Opportunities/Jobs | 11750 | 26 | Job search, detail view, bookmarking |
| Job APIs | 12570 | 3 | RemoteOK, Remotive, ArbeitNow (CORS fallback UI) |
| Find Jobs Search | 13000 | 2 | searchOpportunities with CORS error detection |
| Pitch Generator | 13290 | 2 | generatePitch, showPitchModal |
| Match Overlay | 13420 | 18 | viewOnNetwork, job-to-skill matching visualization |
| Applications Tracker | 13600 | 9 | Application status tracking |
| Settings | 13680 | 11 | Profile editing, theme, API key, photo upload |
| Profile Photo | 14800 | 2 | handleProfilePhoto (resize+crop), removeProfilePhoto |
| Consent & Sharing | 14600 | 10 | CCPA/GDPR, sharing preferences |
| Impact/Valuation | 14800 | 12 | Skill market valuation, breakdown |
| Skill Search/Filter | 14850 | 3 | Network + card view filtering (domain-card aware) |
| UI Utilities | 15900 | 15 | Toast, legal notice, about, help |
| Profile Dropdown | 16600 | 5 | Toggle, close, switch, chip (photo-aware) |
| Filter Panel | 16700 | 3 | Toggle, apply, chip rendering |
| Resize + History | 16800 | 2 | Debounced resize, popstate handler |

## State Management

### Global Variables
- `userData` — Current profile (profile, skills, roles, outcomes, values, purpose)
- `skillsData` — Reference alias to userData.skills / userData.roles
- `currentView` — Active view ('network','opportunities','applications','blueprint','welcome','settings','consent')
- `currentSkillsView` — Sub-view ('network' or 'card')
- `activeRole` — Filtered role ID or 'all'
- `activeJobForNetwork` — Job object for match overlay, or null
- `isReadOnlyProfile` — True for sample profiles (non-admin)
- `fbUser` / `fbDb` / `fbIsAdmin` — Firebase auth state

### Init Flags (all reset on profile switch)
networkInitialized, cardViewInitialized, blueprintInitialized, opportunitiesInitialized, applicationsInitialized, consentInitialized, settingsInitialized

### localStorage Keys
currentProfile, wbTheme, wbAnthropicKey, wbValues, wbPurpose, wbMagicLinkEmail

## Version History

### v4.8.0 (current)
- Loading splash with SVG logo, progress bar, 8s failsafe
- CORS failure detection in Find Jobs (3+/4 APIs fail → helpful error with alternatives)
- Read-only enforcement: CSS pointer-events + JS readOnlyGuard() on mutation functions
- Firestore save indicator: "Saving..." → "Saved" / "Save failed" in header
- Profile photo upload: resize to 128x128 JPEG, stored as base64 in userData.profile.photo
- Profile chip shows photo when available
- Removed dead viewOpportunityDetail stub

### v4.7.0
- C1: Debounced resize handler for network SVG
- C2: Browser back button (pushState/popstate)
- C3: Neutral profile chip on load
- C4: Dynamic document title on profile switch
- H2-H6: Removed 370 lines dead functions
- H7-H8: Removed dead CSS and pass-through functions
- M3: Modal back-button close
- M5: Reset activeRole, activeJobForNetwork, search on profile switch
- M6: Fixed card view search selectors
- M9: Preconnect for Google Fonts
- L5: Removed orphaned localStorage ref
- L7: Dynamic copyright year

### v4.6.0
- Wizard→Firestore save, cover letter, interview prep, LinkedIn export

## Known Issues — Remaining

### Functional Gaps
- M4: Minimal accessibility (no keyboard nav, no focus traps, few aria-labels)
- M8: Job APIs still CORS-blocked (now with graceful fallback UI)
- L8: Unnecessary initConsent() calls on theme change
- L9: ~50 console statements need debug flag

### Jobs Ontology Overlay (Next Focus)
The `viewOnNetwork` / `activateJobOverlay` / `initJobNetwork` / `initMatchNetwork` system needs refinement. Current state:
- `viewOnNetwork(jobId)` — Switches to skills tab, stores job, reinits network
- `activateJobOverlay(idx)` — For "Your Jobs" detail view, calls initMatchNetwork
- `initJobNetwork(job)` / `initMatchNetwork(job)` — D3 force layouts showing skill overlap
- Issues to evaluate: visual clarity, matched vs. gap skill distinction, overlay dismiss behavior, mobile responsiveness

## Hero Animation Details

Solar system model: center "YOU" fixed, 8 domain hubs in 3 orbital bands (inner 58-68px, mid 75-92px, outer 100-112px). Each hub has unique angular speed. ~31 skill nodes inherit parent speed ±12.5%. Hub-hub gravitational repulsion. Click-emit particles every 1.2-2s. Canvas-based, RAF with delta-time, IntersectionObserver pause.

## Development Gotchas

- `switchView('network')` = skills tab, not network-only
- `currentSkillsView` tracks network vs card sub-view
- Profile switch resets all init flags
- `skillsData` is reference alias, not copy
- `tv(darkVal, lightVal)` helper for theme-aware values
- `window.X = fn` makes closure functions accessible to onclick
- Hero uses polar coordinates (angle + dist from center)
- `readOnlyGuard()` returns true (blocked) for sample profiles — add to any new mutation function
- `userData.profile.photo` is base64 JPEG string or undefined
- Brace balance: 0 (balanced)
