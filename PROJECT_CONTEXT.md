# PROJECT_CONTEXT.md — Blueprint v4.13.0
**Updated:** 2026-02-19 | **Lines:** 18,749 | **Functions:** ~350 | **Braces:** 0 (balanced)

## Architecture

Single-file SPA (`index.html`) deployed to GitHub Pages. No build step, no bundler. All HTML, CSS, and JS in one file. Firebase for auth + Firestore for persistence. D3.js for network visualization. jsPDF for PDF export. Claude API for AI-powered generation features.

**Repository:** https://github.com/cliffj8338/Skills-Ontology

### External Dependencies (CDN)
- D3.js v7 (network visualization)
- jsPDF 2.5.1 (PDF generation)
- Firebase 10.7.0 (auth + Firestore)
- Google Fonts: Outfit (400/500/600/700) with preconnect

---

## Version History (This Session: v4.7.0 → v4.10.0)

### v4.13.0 (current)
- **Match overlay stats panel:** Replaced minimal pill legend with comprehensive floating panel in bottom-left during job match overlay. Shows: job title/company, large score percentage with color-coded progress bar, 3-column stats grid (Matched/Gaps/Surplus), proficiency gap warning, color legend with human-readable labels ("You have"/"You need"/"Your extra"), action buttons (Close overlay, View Details navigates to Jobs tab). Glass-morphism design, theme-aware, mobile responsive.
- **Fixed duplicate clearJobOverlay:** Removed accidental duplicate, kept the original that properly resets networkMatchMode and UI toggles.
- **Added findJobIdx():** Helper to locate current overlay job's index in savedJobs for navigation.

### v4.12.0
- **Library-only import mode:** Bulk import now has a destination toggle: "Skill Library only" (adds to searchable index for job matching without touching profile) vs "Library + Current Profile". Profile options (level, merge strategy, roles) hide when library-only is selected.
- **Bulk Skill Manager:** New modal for managing existing profile skills in bulk. Searchable/filterable list of all profile skills with checkboxes. Select all/none toggle. Bulk actions toolbar appears when skills are selected: "Set Level" (inline 6-level picker) and "Remove Selected" (with confirmation). Accessible from Blueprint tab, Card view, and Admin dashboard.
- **Roles optional everywhere:** All three skill modals (Create Custom, Edit Skill, Bulk Import) no longer require role selection. If no roles checked, skills default to all roles in the current profile. Labels updated to "(optional, defaults to all)".

### v4.11.0
- **Bulk skill import system:** Two input modes: paste text (one per line, comma-separated, or "Name, Level" pairs) or upload CSV/TSV. Smart CSV parser (flexible column names, quoted field support). Synonym-aware deduplication against existing profile skills. Three merge strategies: Skip, Keep higher, Overwrite. Two-step review flow with 4-column summary (New/Upgrading/Overwriting/Skipped). Per-skill action override dropdowns in review. Accessible from Blueprint tab, Card view, Admin panel.

### v4.10.1
- **Fix: "Updated null" toast** — `closeEditSkillModal()` nulled `currentEditingSkill` before the toast read it. Now saves name to local var first.
- **Fix: Firestore "Unsupported field value: undefined"** — savedJobs serialization now defaults all fields to empty strings/arrays instead of passing `undefined` to Firestore.
- **Fix: "Competent" missing from Create Custom Skill modal** — Was only fixed in Edit Skill modal. Now both modals have all 6 levels. Default changed from Advanced to Proficient for new custom skills.

### v4.10.0
- **Toast CSS fix:** Toast notifications had CSS only inside the resume template JS string, never in the main `<head>`. Toasts rendered unstyled at top-left. Moved full toast CSS into main `<style>` block. Added max 3 toast stacking limit.
- **Skill editing from all views:** Skill detail modal (network + card view) now has Edit Skill, Assess, and Remove buttons at bottom. Previously edit was only reachable from card view.
- **Competent proficiency level:** Added missing "Competent" radio button to edit skill modal (was jumping from Novice to Proficient). Now 6 levels: Novice, Competent, Proficient, Advanced, Expert, Mastery.
- **deleteSkillFromProfile():** New function for removing skills with auto-rescore and view refresh.
- **Sample jobs for demo profiles:** `getSampleJobsForProfile()` detects profile type by role keywords, injects 2-3 pre-parsed jobs with realistic parsedSkills arrays. Match scores computed live against profile at load time. Recruiter profiles get Stripe/HubSpot/Scale AI jobs. Product profiles get Notion/Figma. Strategy profiles get Workday/Phenom/Deloitte.
- **Defensive level selection:** `openEditSkillModal` no longer crashes if skill has an unexpected level value.
- **Read-only relaxed for skill editing:** `saveSkillEdit` no longer blocked by readOnlyGuard, allowing sample profile editing for demo/testing.

### v4.9.0
- **Skill Library Registry fix (CRITICAL):** All 11 references to `skillLibraryIndex.skills` changed to `.index`. Custom skills, gap-added skills, and role-suggested skills were silently failing to register in the searchable library because `.skills` didn't exist (the real array is `.index`). Now fixed with centralized `registerInSkillLibrary()` helper.
- **Comprehensive synonym system:** 80+ entries in `SKILL_SYNONYMS` with bidirectional `_synonymLookup` map. Covers recruiting (ATS↔Applicant Tracking System), business (CRM, ERP, GTM, KPI, OKR, FP&A), technical (ML, AI, CI/CD, SQL, AWS), role variants (team leadership↔people management, sourcing↔talent sourcing). Both `matchJobToProfile()` and `calculateMatchScore()` resolve synonyms on BOTH sides.
- **Enhanced API prompt:** Sends 120 vocabulary terms (user skills + synonym keys) for normalization. Instructs API to use full forms over abbreviations.
- **Expanded ROLE_SKILL_MAP:** 16 roles (up from 9). Added UX Designer, Customer Success, Operations, Executive, Futurist, Content, General Manager.
- **Improved getRoleSuggestions():** Keyword-based fallback matching with synonym-aware deduplication.
- **Job detail view enhancements:** New Proficiency Gaps panel (shows your level vs. required with progress bars). Role Suggestions in job detail (job-gap overlap highlighted). 4-column stats (Matched / Proficiency Gaps / Missing / Surplus).

### v4.8.0
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
- H2-H8: Removed 370+ lines dead functions and CSS
- M3: Modal back-button close (27 modal opens)
- M5: Reset activeRole, activeJobForNetwork, search on profile switch
- M6: Fixed card view search selectors (was targeting wrong DOM)
- M9: Preconnect for Google Fonts
- L5: Removed orphaned localStorage ref
- L7: Dynamic copyright year

---

## Key Sections and Line Ranges (approximate)

| Section | Start | Notes |
|---------|-------|-------|
| CSS Styles | 15 | ~3250 lines incl. toast, readonly-mode, dark/light themes |
| Loading Splash | 3260 | SVG logo, progress bar, failsafe timeout |
| HTML Structure | 3295 | Nav, modals (skill, edit, export, O*NET, custom, assess), footer |
| Toast System | 5075 | showToast (max 3), dismissToast |
| Firebase Auth | 3950 | Google sign-in, email/password, magic link |
| Firestore Save | 4335 | saveToFirestore with save indicator |
| Admin Panel | 4530 | User management (admin-only) |
| Read-Only System | 4588 | checkReadOnly, readOnlyGuard; CSS + JS enforcement |
| Hero Animation | 4730 | Solar system orbital model, click-emit particles |
| Sample Profiles | 5010 | Manifest loading, picker, viewSampleProfile |
| Profile Switching | 5520 | switchProfile, saveUserData, rebuildProfileDropdown |
| Sample Jobs | ~5770 | getSampleJobsForProfile (recruiter/product/strategy) |
| App Init | 5825 | initializeApp: manifest, profiles, auth, splash dismiss |
| Onboarding Wizard | 6100 | 8-step wizard, resume parsing via Claude API |
| Network Visualization | 7100 | D3 force layout, role filtering, node interactions |
| Card View | 7750 | initCardView, domain grouping, role suggestions |
| View Router | 8020 | switchView (with pushState), toggleSkillsView |
| Skill Detail Modal | 8604 | openSkillModal (with Edit/Assess/Remove actions) |
| Resume Generator | 8770 | HTML resume, print-to-PDF |
| Proficiency Scale | ~12250 | PROFICIENCY_SCALE, proficiencyValue() |
| Skill Registry Utils | ~12270 | registerInSkillLibrary(), SKILL_SYNONYMS (80+), _synonymLookup, getSkillSynonyms() |
| Role-Skill Map | ~12400 | ROLE_SKILL_MAP (16 roles), getRoleSuggestions() with keyword fallbacks |
| Match Engine | ~12520 | matchJobToProfile() with synonym + proficiency weighting |
| Job Analysis | 11875 | analyzeJob, parseJobWithAPI, parseJobLocally |
| Quick-Add Gap Skill | ~12700 | Proficiency picker modal, auto-rescore |
| Job Detail View | ~12820 | showJobDetail with proficiency gaps, role suggestions |
| Find Jobs APIs | ~13150 | RemoteOK, Remotive, ArbeitNow (CORS fallback) |
| calculateMatchScore | ~13100 | For remote job results (synonym-aware) |
| Applications Tracker | ~13750 | CRUD for job applications |
| Settings | ~13800 | Profile editing, photo upload, theme, API key |
| Edit Skill Modal | ~16800 | openEditSkillModal (6 proficiency levels), saveSkillEdit, deleteSkillFromProfile |
| Bulk Import | ~16830 | openBulkImport, parseBulkSkills, executeBulkImport; text/CSV, library-only mode |
| Bulk Skill Manager | ~17200 | openBulkManager, bulkManagerSetLevel, bulkManagerRemove; select/filter/bulk ops |
| Profile Chip | ~16740 | updateProfileChip (photo-aware) |
| Resize + History | ~16900 | Debounced resize, popstate handler |

---

## State Management

### Global Variables
- `userData` — Current profile (profile, skills, roles, outcomes, values, purpose, savedJobs, applications, preferences)
- `skillsData` — Reference alias to userData (skills, roles arrays)
- `skillLibraryIndex` — Loaded from skills/index-v3.json, `.index` is the array, `.totalSkills` is count
- `currentView` — Active view ('network','opportunities','applications','blueprint','welcome','settings','consent')
- `currentSkillsView` — Sub-view ('network' or 'card')
- `activeRole` — Filtered role ID or 'all'
- `activeJobForNetwork` — Job object for match overlay, or null
- `isReadOnlyProfile` — True for sample profiles (non-admin), but skill editing is allowed
- `fbUser` / `fbDb` / `fbIsAdmin` — Firebase auth state
- `SKILL_SYNONYMS` / `_synonymLookup` — Bidirectional synonym resolution
- `ROLE_SKILL_MAP` / `ROLE_KEYWORDS` — Role-to-skill mapping with keyword fallbacks
- `PROFICIENCY_SCALE` — Novice:1, Competent:2, Proficient:3, Advanced:3.5, Expert:4, Mastery:5

### Init Flags (all reset on profile switch)
networkInitialized, cardViewInitialized, blueprintInitialized, opportunitiesInitialized, applicationsInitialized, consentInitialized, settingsInitialized

### localStorage Keys
currentProfile, wbTheme, wbAnthropicKey, wbValues, wbPurpose, wbMagicLinkEmail

---

## PRIORITY WORK REMAINING

### 1. 🟡 Jobs Network Overlay (Partially Addressed)
v4.13.0 added comprehensive stats panel with legend, score, stats grid, proficiency gap indicator, and action buttons. Further refinements Cliff may want:
- Visual representation of proficiency gaps on individual nodes (e.g., partial-fill circles)
- Animated transitions between You/Job/Match modes
- Drag-to-rearrange to manually explore cluster relationships
- The "Job" view mode (`initJobNetwork`) still has no panel/legend
- Cliff hasn't fully validated the current overlay yet, so additional feedback expected

### 2. 🟡 Remaining from Code Audit (v4.7.0)
- **M4: Accessibility** — Minimal keyboard nav, no focus traps, few aria-labels
- **M8: CORS** — Job APIs still blocked (graceful fallback UI exists now)
- **L8:** Unnecessary initConsent() calls on theme change
- **L9:** ~50 console statements need debug flag

### 3. 🟡 Resume Generation Enhancement
Cliff mentioned wanting professional resume generation as the next major feature. The HTML resume generator exists (`generateResume` line ~8770) but Cliff wants it enhanced. This was mentioned earlier as a priority but the jobs overlay came first.

### 4. 🟢 Other Items Noted
- The skill library search (14K+ ESCO/O*NET) relies on `skills/index-v3.json` being present in the repo. If missing, search returns empty but app still works.
- Profile templates load from `profiles/` directory via `profiles-manifest.json`
- Sample jobs are injected at load time for demo profiles, not stored in template files
- Jobs that users manually add or parse DO save to Firestore (if authenticated) via savedJobs array

---

## Development Gotchas (Critical for New Chat)

- **Single-file SPA:** Everything is in index.html. No modules. Use `window.fn = fn` to expose functions to onclick handlers.
- **`switchView('network')` = skills tab**, not network-only. `currentSkillsView` tracks network vs card sub-view.
- **Profile switch resets all init flags** via switchProfile()
- **`skillsData` is reference alias**, not copy. Changes to skillsData.skills affect userData.skills.
- **`tv(darkVal, lightVal)` helper** for theme-aware inline values
- **`readOnlyGuard()`** returns true (blocked) for sample profiles on mutation functions, but skill editing was deliberately exempted.
- **`userData.profile.photo`** is base64 JPEG string or undefined
- **`registerInSkillLibrary(name, category)`** — Always use this to add skills to the searchable index, never push directly to `.index`
- **`getSkillSynonyms(lowerName)`** — Returns array of synonym strings for matching
- **Brace balance must be 0** — Always verify after edits with: `let b=0; for(let c of s){if(c==='{')b++;if(c==='}')b--;} console.log(b);`
- **Toast CSS is in the main `<style>` block** (line ~3208). There's also a duplicate in the resume template JS string (~line 9240), that one is for the resume HTML export, not the app.
- **Sample jobs** are generated by `getSampleJobsForProfile()` and scored by `matchJobToProfile()` at load time. They are NOT stored in the profile JSON template files.
- **Hero animation** uses polar coordinates (angle + dist from center), solar system orbital model with gravitational repulsion between hubs.

---

## Transcript History

Previous session transcripts are at `/mnt/transcripts/`:
1. `2026-02-19-03-51-49-blueprint-v46-wizard-exports.txt` — Wizard-to-Firestore, AI generators
2. `2026-02-19-14-57-36-hero-animation-profile-switch-fixes.txt` — Hero animation, profile dropdown bugs
3. `2026-02-19-15-17-20-hero-animation-profile-bugs-audit.txt` — Solar system animation, 30-defect audit
4. `2026-02-19-15-40-07-v47-audit-fixes-ui-stub-inventory.txt` — v4.7.0 audit fixes, UI stub inventory
5. Current session (v4.7.0 to v4.13.0): UI stubs, matching engine, toast, skill editing, sample jobs, bulk import/manager, library-only mode, overlay stats panel
