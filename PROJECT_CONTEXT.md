# Blueprint — Project Context

**Version:** v4.4.0 | **Build:** 20260218-0520 | **Lines:** ~16,250 | **Functions:** ~312
**Repository:** https://github.com/cliffj8338/Skills-Ontology
**Live:** https://cliffj8338.github.io/Skills-Ontology/
**Founder:** Cliff Jurkiewicz

## Branding
- **Name:** Blueprint (formerly "Work Blueprint")
- **Logo:** B4 "Architect's Stamp" — network graph mark (5 nodes, 4 primary connections, 3 secondary) contained within a subtle circular ring
- **Typography:** Outfit 500, spaced uppercase (letter-spacing: 0.22em)
- **Mark colors:** Center node #60a5fa, outer nodes #93bbfc and #818cf8, ring #60a5fa at 22% opacity
- **Light mode variant:** #2563eb, #3b82f6, #6366f1
- **Font import:** Google Fonts — Outfit 400-700
- **SVG mark viewBox:** 0 0 52 52 (scales cleanly to any size)
**Creator:** Cliff Jurkiewicz
**Page Title:** "Blueprint by Cliff Jurkiewicz"

---

## What This Is

A single-page web application that maps professional skills to O*NET/ESCO taxonomies, visualizes them as an interactive D3 force-directed network, calculates market valuation, and generates exportable executive blueprints. Built as a single `index.html` file (~14.5K lines) hosted on GitHub Pages with Firebase backend.

## Tech Stack

- **Frontend:** Vanilla JS, D3.js v7 (force network), HTML5 Canvas (hero animation)
- **Backend:** Firebase Auth + Cloud Firestore
- **Hosting:** GitHub Pages (static)
- **CDN Libraries:** D3, Ajv (JSON schema validation), Firebase SDK v10.7.0 (compat builds)
- **No build step:** Everything runs from a single HTML file + JSON data files in the repo

---

## Firebase Configuration

```
Project: work-blueprint
Auth Domain: work-blueprint.firebaseapp.com
Project ID: work-blueprint
API Key: AIzaSyBO703p11FdLojH6ogB50XrxoFVy_7bHLE (public, domain-restricted)
```

**API Key Security:** Restricted in Google Cloud Console to HTTP referrers: `cliffj8338.github.io/*`, `localhost/*`, `work-blueprint.firebaseapp.com/*`, `work-blueprint.web.app/*`. This is expected and safe for Firebase client-side keys. Security enforced by Firestore Rules + Firebase Auth.

### Auth Methods
1. Google Sign-In (OAuth popup)
2. Email/Password
3. Magic Link (passwordless email)

### Firestore Data Model

```
users/{uid}
  email, displayName, createdAt, lastLogin
  role: 'user' | 'admin'
  profile: { name, email, location, seniority, ... }
  skills: [ { name, level, category, key, roles, evidence[] } ]
  values: [ { name, selected, inferred, custom } ]
  purpose: string
  outcomes: [ { text, skill, category, shared, ... } ]
  preferences: { consentPreset, theme, ... }
  applications: [ ... ]
  updatedAt: timestamp

samples/{sampleId}  (reserved in rules, not yet wired)
```

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && (
        request.auth.uid == userId || isAdmin()
      );
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /samples/{sampleId} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

**Admin seeding:** After first sign-in, manually set `role: "admin"` in Firebase Console, Firestore, Data, users/{cliff-uid}.

---

## Application Architecture

### Page Load / Init Flow

This was the source of the most bugs during development. Understanding it is critical.

**1. HTML baseline:** All 8 view containers and controls bar start with `style="display:none;"`. Nothing is visible until JS explicitly shows a view via `switchView()`.

**2. DOMContentLoaded** (async):
```
checkMagicLinkSignIn()        // wrapped in try-catch, uses fbAuth instance method
await authReadyPromise         // waits for onAuthStateChanged to fire once
targetView = await initializeApp()  // loads manifest, templates, determines view
if userData.initialized → update profile chip, init card view data, start auto-save
switchView(targetView)         // welcome, blueprint, or network
deferred rebuildProfileDropdown() at 500ms
```

**3. initializeApp()** (async, returns string):
```
Fetch profiles-manifest.json → load all enabled profile templates
Load skill library index, values library
Load scaffold template from localStorage or default cliff-jones-demo
Call initializeMainApp() to wire up globals
DECISION:
  - If fbUser && fbDb → await loadUserFromFirestore(uid)
    - If data found → return 'blueprint'
    - If no data → return 'welcome'
  - If not signed in → return 'welcome'
```

**4. switchView(view)** — master view controller:
- Hides all 8 views + controls bar
- Shows requested view
- Scroll to top on every view switch
- Lazy-initializes views on first visit via `window.xxxInitialized` flags
- Welcome page: only re-renders if `_welcomePickerActive` flag is not set (prevents sample picker from being overwritten)

### Key Globals

```javascript
fbApp, fbAuth, fbDb              // Firebase instances
fbUser = null                     // Current Firebase user or null
fbIsAdmin = false                 // Admin role flag
authReadyPromise                  // Resolves when onAuthStateChanged fires once

userData = { initialized, profile, skills, values, purpose, outcomes, ... }
skillsData = { skills, roles, skillDetails }
templates = {}                    // Loaded profile templates keyed by ID
isReadOnlyProfile = false         // True when viewing sample as non-admin

currentView = 'network'           // Active view
currentSkillsView = 'network'     // 'network' or 'card' within Skills tab
```

### Navigation

**Header tabs:** Skills | Jobs | Applications | Blueprint
**Header right:** Theme toggle | Sign In | Profile chip + dropdown | Overflow menu

**Logo click** returns to welcome page.

**Profile dropdown** (rebuilt by `rebuildProfileDropdown()`): current user section with ADMIN badge, sample profiles from manifest, Admin Dashboard / Sign Out actions.

### Views

| View | ID | Lazy Init Flag | Default |
|------|----|---------------|---------|
| Welcome | welcomeView | No (rendered each time) | Landing page |
| Skills Network | networkView | networkInitialized | D3 force graph |
| Skills Card | cardView | cardViewInitialized | Grid cards |
| Jobs | opportunitiesView | opportunitiesInitialized | Job matching |
| Applications | applicationsView | applicationsInitialized | App tracker |
| Blueprint | blueprintView | blueprintInitialized | Executive summary |
| Consent | consentView | consentInitialized | Privacy/GDPR |
| Settings | settingsView | settingsInitialized | Preferences |

---

## Profile System

### Sample Profiles
- Load from JSON files in the repo, not Firestore
- `profiles-manifest.json` lists enabled profiles with id, name, title, description, path
- Templates fetched at init and cached in `templates{}` object
- Currently: Cliff Jones (VP Strategy), Sarah Chen (Tech Recruiter), Mike Rodriguez (Eng Lead), Jamie Martinez (Hair Stylist), Alex Thompson (Retail Cashier)

### Profile Switching (`switchProfile(templateId)`)
- Loads template inline, no page reload
- Resets ALL view init flags so they re-render fresh
- Updates profile chip, checks read-only, rebuilds dropdown
- **Navigates to Skills Network view** (the wow factor for demos)
- Scrolls to top with 50ms delay to ensure view is rendered
- No toast notification (removed, it was redundant)

### Sample Picker (`viewSampleProfile()`)
- Sets `window._welcomePickerActive = true` before calling `switchView('welcome')`
- This flag prevents `switchView` from overwriting picker content with `renderWelcomePage()`
- Flag auto-resets to false after switchView reads it
- "Back to home" link clears the flag so welcome re-renders normally

### Read-Only Mode (`checkReadOnly()`)
- Active when viewing sample profile AND not admin
- Shows sticky banner: "You are viewing a sample profile (read-only)"
- `isReadOnlyProfile` global flag

### User Profiles (signed-in)
- Saved to Firestore under `users/{uid}`
- Auto-saved every 60 seconds
- Loaded on sign-in via `loadUserFromFirestore(uid)`

---

## Authentication

### Auth Modal (`showAuthModal(mode)`)
- Sign-in / Sign-up toggle, Google OAuth, email/password, magic link
- `friendlyAuthError(code)` maps Firebase error codes

### Post Sign-In (`handlePostSignIn(user, isNewUser)`)
- Creates Firestore doc on first sign-in
- Updates lastLogin for returning users
- Loads Firestore data or offers wizard for new users

### Sign Out (`authSignOut()`)
- Clears fbUser/fbIsAdmin, navigates to welcome, rebuilds dropdown

### Magic Link (`checkMagicLinkSignIn()`)
- **CRITICAL:** Uses `fbAuth.isSignInWithEmailLink()` (instance method), NOT `firebase.auth.isSignInWithEmailLink()` (static, does not exist in compat SDK)
- Wrapped in try-catch so failures never crash the init flow

---

## Welcome Page (build 0400)

Layout top to bottom:
1. Headline: "Know Your Worth. Own Your Narrative."
2. Subtitle
3. Two CTA buttons: "View Sample Profiles" (outlined) | "Build Your Blueprint" (filled)
4. Animated network canvas in bordered showcase frame (320px, rounded corners, subtle border glow)
5. Caption text
6. "HOW IT WORKS" — three numbered steps with colored circle badges (stacks to 1-column on mobile via `.welcome-steps-grid`)
7. Sign-in link
8. Disclaimer with Full Disclaimer link

**App footer** (`#appFooter`) is hidden when welcome view is active (welcome has its own disclaimer). Shown on all other views.

**Hero Animation** (`initHeroNetwork()`): HTML5 Canvas, 35 nodes, 8 color-coded domains, center "YOU" node, IntersectionObserver pauses when offscreen, respects dark/light theme.

---

## Admin System

- `role: "admin"` in Firestore user doc
- `checkAdminRole(uid)` queries on auth state change
- Admin badge in profile chip, dropdown, and UI
- `showAdminPanel()` lists all registered users
- Admin bypasses read-only mode

## GDPR Compliance

- `viewMyData()` — modal showing stored data summary
- `exportMyData()` — downloads Firestore doc as JSON
- `requestDataDeletion()` — double-confirm, deletes Firestore doc + Firebase auth, clears localStorage

---

## Values System (v4.1.0)

### VALUES_CATALOG
25 values across 5 groups (How I Think, How I Lead, How I Work, How I Connect, What I Protect). Each entry has `name`, `keywords` (for evidence matching), and `description` (one-sentence behavioral definition).

### Value Cards (renderSelectedValues)
- Show catalog description under the value name
- "Add a personal note" button opens modal editor
- Notes stored in `blueprintData.values[idx].note`
- Notes appear in value cards, clipboard export, and PDF export
- Evidence preview shows first matching skill evidence

### Helper Functions
- `getCatalogDescription(name)` — looks up description from VALUES_CATALOG
- `editValueNote(idx)` — opens modal with textarea for personal note
- `saveValueNote(idx)` — saves note and re-renders blueprint tab
- `scoreValueByEvidence(valueDef)` — counts keyword matches in skill evidence

---

## Mobile Network (v4.1.0)

### Behavior
- `initNetwork()` detects mobile via `window.innerWidth <= 768`
- On mobile: shows only top 25 skills (key + Mastery/Expert, backfilled with Advanced)
- Reduced distances, tighter forces, stronger center pull
- Circle radii slightly larger for touch targets
- Skill labels hidden by default (too cluttered), role labels visible
- Info badge at bottom: "Showing top N of M skills"
- `switchProfile()` and `DOMContentLoaded` both default to card view on mobile

### Force Parameters (mobile vs desktop)
- Link distance: 90/100 vs 140/160
- Charge strength: -200/-120 vs -250/-180
- Collision radius: 50/45/35 vs 70/65/45
- Center/radial force: 0.12/0.15 vs 0.08/0.1

---

## Export System (v4.1.0)

### Single Export Path
All export options consolidated under Blueprint tab > Export sub-tab. Overflow menu has single "Export Blueprint" button that navigates there.

### Available Exports
1. **Executive Blueprint** — standalone HTML document, editorial design (generateWorkBlueprint)
2. **Professional Resume** — ATS-friendly HTML, print to PDF (generateResume)
3. **PDF Summary** — jsPDF 2-page summary with outcomes, values+notes, skills, market (generatePDF)
4. **Copy to Clipboard** — plain text with values+descriptions+notes (copyBlueprintText)
5. **JSON Data** — structured export for backups/integration (exportBlueprint('json'))

### Removed
- Old "Export Profile" modal with 3 stub options (Capability, LinkedIn, Interview)
- Separate "Generate Blueprint" overflow menu item
- `exportProfile()` function still exists but only 'resume' works, others toast "coming soon"

---

## Job Cart System (v4.2.0)

### Architecture
The Jobs tab (`opportunitiesView`) now has two sub-tabs:
- **Your Jobs** — saved JD analyses with match data (the "pipeline")
- **Find Jobs** — the original job search system (renamed)

Controlled by `jobsSubTab` variable ('your-jobs' | 'find-jobs'). Sub-tab state resets on view switch.

### Data Model
Each saved job in `userData.savedJobs[]`:
```javascript
{
  id: 'job-1739...',           // Unique ID
  title: 'VP Strategy',        // Extracted by parser
  company: 'Acme Corp',        // Extracted by parser
  sourceUrl: 'https://...',    // User-provided
  sourceNote: 'LinkedIn',      // User-provided
  rawText: '...',              // First 5000 chars of pasted JD
  parsedSkills: [...],         // Array of {name, level, category}
  parsedRoles: [...],          // Functional areas
  seniority: 'Executive',      // Entry|Mid|Senior|Executive
  matchData: {                 // Computed match results
    score: 72,
    matched: [{jobSkill, userSkill, level, requirement, category}],
    gaps: [{name, level, category}],
    surplus: [{name, level, category}],
    totalJobSkills: 18,
    totalUserSkills: 90
  },
  addedAt: '2026-02-18T...'
}
```

### Parsing Engines

**Claude API (`parseJobWithAPI`):**
- Uses Claude Sonnet via direct browser access
- Extracts title, company, seniority, roles, and 10-30 skills
- Sends user's top 50 skill names to maximize matching
- Classifies skills as Required/Preferred/Nice-to-have
- Infers implied competencies from responsibilities
- API key stored in localStorage ('wbAnthropicKey'), never sent to our servers

**Local Fallback (`parseJobLocally`):**
- No API key needed
- **Title extraction:** Skips meta lines (Summary, Posted, Generated, etc.), prioritizes lines containing role keywords (Manager, Director, etc.), scans first 15 lines
- **Company extraction:** Matches "Company:", "About [Company]" patterns
- **Four-pass skill extraction:**
  1. Match user's own skill names against JD text
  2. Match O*NET skill library index if loaded
  3. 100+ skill keyword dictionary covering Recruiting/Talent, HR, PM, Leadership, Communication, Technical, Data, Business, Strategy, Marketing, Soft Skills
  4. Phrase-level extraction from bullet-pointed requirement lines using regex patterns for "X years experience in Y", "proficiency in Y", "strong Y skills"
- **Word-overlap fuzzy matching:** If 50%+ of words in a job skill appear in a user skill name, counts as a match at reduced quality
- Requirement level classification from surrounding context (Required/Preferred/Nice-to-have)
- Seniority and functional role inference

### Match Algorithm (`matchJobToProfile`)
- Builds lowercase lookup map of user skills + word variants
- Exact match first, then fuzzy (substring containment for terms > 4 chars)
- Weighted scoring: Required=3x, Preferred=2x, Nice-to-have=1x
- Proficiency bonus: Mastery=1.0, Expert=0.9, Advanced=0.75, Proficient=0.6, Novice=0.4
- Returns: matched (with both job and user skill names), gaps, surplus, score

### UI Components
- `showAddJobModal()` — paste JD + source URL/note + optional API key (collapsible)
- `renderSavedJobs()` — pipeline list with match bars, skill counts, edit/remove buttons per card
- `showJobDetail(idx)` — full breakdown: matched/gaps/surplus skill chips, with header action bar
- `editJobInfo(idx)` — modal to edit title, company, source URL, source note
- `saveJobEdit(idx)` — persists edits to userData and Firestore
- `reanalyzeJob(idx)` — re-runs parser (API or local) against stored raw JD text, updates match data
- `removeJob(idx)` — confirm and delete from pipeline, clears active overlay if affected

### Persistence
- `userData.savedJobs` saved to Firestore (signed in) or localStorage
- Cap: 10 jobs max per user
- Raw JD text capped at 5000 chars for storage

### Phase 2: Network Overlay (v4.3.0)

**State variables:**
- `networkMatchMode` ('you' | 'job' | 'match') — current network display mode
- `activeJobForNetwork` — the saved job object being compared (null when no overlay active)

**UI Components:**
- Match mode toggle: You/Job/Match pill buttons in controls bar (hidden until job activated)
- Active job badge: shows truncated job title with × to clear, next to toggle
- Floating legend: shows matched/gaps/surplus counts with match percentage
- All hidden when not on network view or when no job is active

**Three Network Modes:**
1. **You** (`initNetwork()`) — the standard user skills network, unchanged
2. **Job** (`initJobNetwork(job)`) — job requirements rendered as a network, with skills grouped by category (Technical, Leadership, etc.), center node is job title, required skills get white stroke
3. **Match** (`initMatchNetwork(job)`) — overlay combining both:
   - User roles as role clusters (original colors)
   - "Job Needs" pseudo-role cluster (red) positioned opposite
   - Matched skills: green (#10b981), larger circles, white stroke, connected to BOTH user roles and job cluster via dashed lines
   - Gap skills: red (#ef4444), only connected to job cluster
   - Surplus skills: dimmed grey (#475569, opacity 0.35), connected to user roles only
   - Clicking matched/surplus user skills opens the skill detail modal
   - Floating legend with live counts

**Flow:**
1. Jobs tab → Your Jobs → click a job → "View Network Overlay" button
2. `activateJobOverlay(idx)` → sets active job, switches to network view, renders match mode
3. You/Job/Match toggle switches between views instantly
4. × button on badge calls `clearJobOverlay()` → returns to normal network
5. Navigating away hides overlay UI; returning restores it if job still active

**Mobile behavior:**
- Match mode toggle and badge resize for small screens
- Legend positioned above mobile nav bar (bottom: 70px)
- Job and Match networks follow same mobile rules: capped skills, bigger targets, hidden labels

**Bug fix included:** `toggleSkillsView()` and `initNetworkWithHighlight()` both referenced `.role-chip` but the actual buttons use `.view-pill` — corrected both selectors.

---

## Bugs Fixed This Session

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Welcome page footer/disclaimer overlap | App footer always visible, welcome page has its own disclaimer, creating double text that overlaps "HOW IT WORKS" | Footer hidden on welcome view via switchView(), shown on all other views |
| Mobile "HOW IT WORKS" 3-column too cramped | Inline grid-template-columns:repeat(3,1fr) with no mobile breakpoint | Added .welcome-steps-grid class with 1fr mobile override |
| Mobile: no bottom padding for mobile nav bar | Welcome page content hidden behind fixed bottom nav | Added #welcomeView padding-bottom:80px at 768px |
| Consent sharing counts always wrong | renderSharingStatus() checked 'all'/'top20' but presets use 'full'/'executive' | Fixed key names and added dynamic counting per preset |
| Consent "stored locally" copy stale | Copy predated Firebase backend | Updated to mention Firebase (signed in) vs localStorage (not signed in) |
| Consent presets don't propagate | Only 'full' preset had logic, others were no-ops | All 5 presets now apply appropriate sharing filters |
| Consent hardcoded "all 73 skills" | Preset description assumed specific skill count | Replaced with dynamic skillsData.skills.length |
| Export modal shows 3 stubs ("coming next release") | Old modal had Resume + 3 placeholder options | Removed modal export path, consolidated to Blueprint > Export tab |
| Two redundant overflow menu export buttons | "Export Profile" (modal) and "Generate Blueprint" (direct) | Merged into single "Export Blueprint" pointing to Blueprint tab |
| Network view unusable on mobile | All skills rendered, too crowded, no touch optimization | Mobile shows top 25 key/expert skills, bigger circles, hidden labels, tighter forces |
| Profile switch always shows network on mobile | switchProfile hardcoded switchView('network') | Added mobile detection to default to card view |

## Bugs Fixed Prior Session

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Welcome page never shows on load | `firebase.auth.isSignInWithEmailLink` crashes (wrong compat SDK syntax), kills entire DOMContentLoaded | Changed to `fbAuth.isSignInWithEmailLink()`, wrapped in try-catch |
| Blank network page on first load | `<svg id="networkView">` had no `display:none`, visible before JS runs | All 8 views + controls bar now `display:none` in HTML |
| Network graphic behind hero text, hard to see | Full-bleed canvas with text overlay was muddy | Moved network to bordered showcase frame below CTAs |
| "View Sample Profiles" button does nothing | `viewSampleProfile()` writes picker HTML, then `switchView('welcome')` calls `renderWelcomePage()` which overwrites it | Added `_welcomePickerActive` flag, switchView skips re-render when set |
| Sample picker cards overlap footer disclaimer | No bottom padding on picker container | Added `padding-bottom:80px` to picker wrapper |
| Sample click lands on Blueprint tab | `switchProfile` called `switchView('blueprint')` | Changed to `switchView('network')` (the wow factor) |
| "Viewing: Name" toast appears at top-left then disappears | Unnecessary toast after clicking a sample card | Removed toast from switchProfile entirely |
| Scroll position wrong after sample click | `scrollTo(0,0)` fires before view renders | Moved to `setTimeout(50ms)` after switchView |
| Wizard completion calls unguarded initNetwork | Could render network into invisible container | Reset init flags and call `switchView('network')` instead (lazy init handles rendering) |
| DOMContentLoaded has redundant initNetwork | Called before switchView which also lazy-inits | Removed redundant call, switchView handles it |

---

## Stabilization Audit (build 0430)

```
Brace balance:     {=2842 }=2842 ✓
Paren balance:     (=6157 )=6157 ✓
All views hidden:  8/8 ✓
Controls hidden:   ✓
Job cart functions: 10 new functions verified ✓
Firestore save:    savedJobs included ✓
Firestore load:    savedJobs included ✓
userData.savedJobs: Initialized in userData default ✓
Jobs sub-tabs:     Your Jobs / Find Jobs switching ✓
API key storage:   localStorage only, never server ✓
```

**Dead code exists but is low-risk** (old `buildProfileDropdown`, `showWizardPrompt`, `showWelcomeScreen` — never called). Attempted removal corrupted file; safer to leave as-is and clean in a future refactor pass.

---

## File Structure

```
Skills-Ontology/
  index.html              # Entire app (~14.5K lines)
  profiles-manifest.json  # Enabled sample profiles
  cliff-jones-demo.json   # Sample profile
  sarah-chen-demo.json    # Sample profile
  mike-rodriguez-demo.json
  jamie-martinez-demo.json
  alex-thompson-demo.json
  skill_evidence.json     # Evidence data
  skills/
    index-v3.json         # 13,960+ skills
  firestore.rules
  PROJECT_CONTEXT.md      # This file
```

---

## Version History

| Build | Date | Changes |
|-------|------|---------|
| v4.0.0-0115 | 20260218 | Firebase Auth + Firestore + admin + GDPR |
| v4.0.0-0200 | 20260219 | Welcome page + read-only samples + nav restructure |
| v4.0.0-0215 | 20260219 | Welcome-first flow + inline profile switch + sample picker |
| v4.0.0-0230 | 20260219 | Animated hero network + admin dropdown timing fix |
| v4.0.0-0300 | 20260219 | Async init fix + hero redesign + lazy network init |
| v4.0.0-0315 | 20260219 | All views hidden by default + network showcase layout |
| v4.0.0-0320 | 20260219 | Fix: isSignInWithEmailLink compat SDK crash + try-catch |
| v4.0.0-0325 | 20260219 | Fix: Sample picker overwritten by renderWelcomePage |
| v4.0.0-0330 | 20260219 | Fix: Picker layout padding + footer overlap |
| v4.0.0-0335 | 20260219 | Fix: Network default for samples, remove toast, guard initNetwork, stabilization |
| v4.1.0-0400 | 20260218 | Mobile responsive + Values descriptions/notes + Consent fixes + Export consolidation |
| v4.2.0-0430 | 20260218 | Job Cart: JD analysis (Claude API + local fallback), match scoring, pipeline UI, Firestore persistence |
| v4.3.0-0500 | 20260218 | Job Cart Phase 2: Network overlay (You/Job/Match toggle), job-only network, match visualization with legend |
| v4.3.1-0510 | 20260218 | Parser rebuild: 100+ skill dictionary, phrase extraction, better title parsing. Edit/delete/re-analyze on jobs. Fuzzy word-overlap matching. |
| v4.4.0-0520 | 20260218 | Rebrand: "Blueprint" → "Blueprint". B4 Architect's Stamp logo (Outfit 500 spaced caps). SVG network mark replaces ◈ diamond throughout. All user-facing strings updated. |

---

## Pending / Next Steps

### High Priority
- [ ] **Cover letter / interview prep from match data** — use matched + gap analysis to generate targeted content
- [ ] Wire onboarding wizard to save directly to Firestore on completion
- [ ] Move sample profiles to Firestore `samples/` collection for admin editing
- [ ] Test all sign-in flows: Google, email/password, magic link
- [ ] "Save to Cloud" indicator for user awareness
- [ ] Verify admin panel loads user list correctly
- [ ] Test mobile experience end-to-end (welcome → sample → card view → blueprint → export)

### Medium Priority
- [ ] Real-time save indicator (checkmark/spinner)
- [ ] Network resize handler (re-render on window resize)
- [ ] Remove dead code: buildProfileDropdown, showWizardPrompt, showWelcomeScreen, exportProfile() stubs
- [ ] Profile photo/avatar upload
- [ ] Enforce read-only in UI (disable edit buttons when isReadOnlyProfile)
- [ ] Add value notes to sample profile JSON templates
- [ ] Persist consent preset selection to userData.preferences

### Lower Priority
- [ ] Offline mode with Firebase persistence
- [ ] Export to PDF — improve layout with descriptions and notes
- [ ] Mobile-optimized wizard
- [ ] Analytics dashboard for admin
- [ ] LinkedIn Profile export (clipboard formatted for LinkedIn sections)
- [ ] Interview Prep STAR stories generator

### Completed This Session
- [x] Welcome page layout: footer overlap fixed, HOW IT WORKS responsive on mobile
- [x] Mobile defaults: card view on mobile for switchProfile + initial load
- [x] Simplified mobile network: top 25 skills, bigger touch targets, hidden labels, info badge
- [x] VALUES_CATALOG: all 25 values have descriptions
- [x] Value cards: show descriptions + personal note field with modal editor
- [x] Value notes: saved to blueprintData, included in clipboard + PDF exports
- [x] Values picker: description tooltips on hover
- [x] Consent: preset key mismatches fixed (full/executive/advisory/board/custom)
- [x] Consent: stale "stored locally" copy updated for Firebase
- [x] Consent: all presets now apply sharing filters to outcomes/values
- [x] Consent: dynamic skill counts in preset descriptions
- [x] Export: consolidated to single path (Blueprint > Export tab)
- [x] Export: removed stub modal, merged overflow menu items
- [x] Job Cart: Jobs tab restructured with Your Jobs / Find Jobs sub-tabs
- [x] Job Cart: Add Job modal with paste field, source URL, source note, optional API key
- [x] Job Cart: Claude API parsing (Sonnet, direct browser access, extracts skills/roles/seniority)
- [x] Job Cart: Local fallback parsing (skill library + keyword matching)
- [x] Job Cart: Weighted match algorithm (requirement level × proficiency bonus)
- [x] Job Cart: Pipeline list view with match bars and skill counts
- [x] Job Cart: Job detail view with matched/gaps/surplus chip breakdown
- [x] Job Cart: Firestore persistence + localStorage fallback
- [x] Job Cart: 10-job cap, remove functionality
- [x] Network Overlay: You/Job/Match toggle in controls bar
- [x] Network Overlay: Job-only network with category-grouped skills
- [x] Network Overlay: Match overlay with matched (green), gap (red), surplus (dimmed grey) node states
- [x] Network Overlay: Dashed connection lines between matched skills and both clusters
- [x] Network Overlay: Floating legend with live counts + match percentage
- [x] Network Overlay: Active job badge with clear button
- [x] Network Overlay: State preserved when navigating away and back
- [x] Network Overlay: Mobile responsive (legend above nav, badge compact)
- [x] Bug fix: toggleSkillsView and initNetworkWithHighlight used wrong CSS selector (.role-chip → .view-pill)
- [x] Parser rebuild: 100+ skill keyword dictionary, four-pass extraction, phrase-level skill mining
- [x] Parser: smarter title extraction (skip meta lines, prefer role keywords)
- [x] Matcher: word-overlap fuzzy matching with quality weighting
- [x] Job management: edit info modal (title, company, URL, note)
- [x] Job management: re-analyze button (re-runs parser against stored JD text)
- [x] Job management: edit/remove buttons visible on pipeline cards and detail view header
- [x] Rebrand: "Work Blueprint" → "Blueprint" across all 96 user-facing references
- [x] Logo: B4 Architect's Stamp SVG mark replaces ◈ diamond in header, wizard, banners
- [x] Typography: Outfit font imported, header uses spaced uppercase lockup
- [x] Founder attribution: Cliff Jurkiewicz throughout

---

## Common Pitfalls

1. **Never call `initNetwork()` before Skills tab is visible.** D3 needs visible container dimensions. Use lazy init via `window.networkInitialized` flag inside `switchView`.

2. **Firebase compat SDK:** Use `fbAuth.isSignInWithEmailLink()` (instance method), NOT `firebase.auth.isSignInWithEmailLink()` (doesn't exist). Constructors like `new firebase.auth.GoogleAuthProvider()` use namespace correctly.

3. **`rebuildProfileDropdown()` must run after both manifest AND auth resolve.** Multiple calls are intentional as safety net.

4. **`switchView()` is the only way to show a view.** All views start hidden in HTML. Direct `style.display` changes will break state.

5. **The `_welcomePickerActive` flag** prevents switchView from overwriting custom welcomeView content. Set it before calling switchView from the picker.

6. **Python string replacement is dangerous on this file.** The brace-counting removal approach corrupted the file once. Use `str_replace` tool or targeted `sed` for edits, not bulk Python replacements.

7. **The `tv(dark, light)` helper** returns theme-appropriate values at render time only. If theme changes, content using `tv()` must be re-rendered.

8. **Always verify the shipped output file matches the local working file.** Earlier in this session, `/mnt/user-data/outputs/index.html` was stale while `/home/claude/index.html` had the correct fix. This caused a deployed bug.

9. **The `exportModal` div is reused dynamically.** `editOutcome()`, `editValueNote()`, and `viewMyData()` all rewrite its innerHTML. The default HTML content in the modal is a redirect to the Blueprint export tab.

10. **Mobile network shows a subset of skills.** `initNetwork()` filters to top 25 key/expert skills on mobile. The full dataset is still in `skillsData.skills`. The info badge reads from `skillsToShow.length` vs `skillsData.skills.length`.

11. **App footer is hidden on welcome view.** `switchView()` toggles `#appFooter` display. The welcome page has its own disclaimer, so showing both created overlapping text.

12. **Claude API calls use direct browser access.** The `anthropic-dangerous-direct-browser-access` header is required for client-side calls. API key is stored in localStorage only, never transmitted to our backend.

13. **Jobs tab reinitializes on every visit.** `opportunitiesInitialized` is reset after adding/removing jobs to force a fresh render. The sub-tab state (`jobsSubTab`) persists within session but resets on page reload.

14. **Local JD parsing depends on skill library index.** If `skillLibraryIndex` hasn't loaded yet, the local parser falls back to just matching against `skillsData.skills` and common keywords. Always less accurate than the API path.

---

## Cliff's Writing/Style Preferences

- Limit em/en dashes, rephrase or use commas
- Avoid redundancy and excessive examples
- Never use "the uncomfortable truth" or "talent wars"
- Avoid jargon, superlatives, borrowed authority
- Precise verbs over generic ones
- Newsletter emails: SHORT and PUNCHY, 10-second read max, hook to drive click-through
- Editorial board review: WSJ, NY Times, The Atlantic, HR Executive
- Terse communication with AI is for efficiency, not dissatisfaction
