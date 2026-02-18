# Work Blueprint — Project Context

**Version:** v4.0.0 | **Build:** 20260219-0335 | **Lines:** ~14,570 | **Functions:** ~288
**Repository:** https://github.com/cliffj8338/Skills-Ontology
**Live:** https://cliffj8338.github.io/Skills-Ontology/
**Creator:** Cliff Jurkiewicz
**Page Title:** "Work Blueprint by Cliff Jurkiewicz"

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

**Header tabs:** Skills | Jobs | Applications | Work Blueprint
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
| Work Blueprint | blueprintView | blueprintInitialized | Executive summary |
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

## Welcome Page (build 0335)

Layout top to bottom:
1. Headline: "Know Your Worth. Own Your Narrative."
2. Subtitle
3. Two CTA buttons: "View Sample Profiles" (outlined) | "Build Your Blueprint" (filled)
4. Animated network canvas in bordered showcase frame (320px, rounded corners, subtle border glow)
5. Caption text
6. "HOW IT WORKS" — three numbered steps with colored circle badges
7. Sign-in link
8. Disclaimer with Full Disclaimer link

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

## Bugs Fixed This Session

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Welcome page never shows on load | `firebase.auth.isSignInWithEmailLink` crashes (wrong compat SDK syntax), kills entire DOMContentLoaded | Changed to `fbAuth.isSignInWithEmailLink()`, wrapped in try-catch |
| Blank network page on first load | `<svg id="networkView">` had no `display:none`, visible before JS runs | All 8 views + controls bar now `display:none` in HTML |
| Network graphic behind hero text, hard to see | Full-bleed canvas with text overlay was muddy | Moved network to bordered showcase frame below CTAs |
| "View Sample Profiles" button does nothing | `viewSampleProfile()` writes picker HTML, then `switchView('welcome')` calls `renderWelcomePage()` which overwrites it | Added `_welcomePickerActive` flag, switchView skips re-render when set |
| Sample picker cards overlap footer disclaimer | No bottom padding on picker container | Added `padding-bottom:80px` to picker wrapper |
| Sample click lands on Work Blueprint tab | `switchProfile` called `switchView('blueprint')` | Changed to `switchView('network')` (the wow factor) |
| "Viewing: Name" toast appears at top-left then disappears | Unnecessary toast after clicking a sample card | Removed toast from switchProfile entirely |
| Scroll position wrong after sample click | `scrollTo(0,0)` fires before view renders | Moved to `setTimeout(50ms)` after switchView |
| Wizard completion calls unguarded initNetwork | Could render network into invisible container | Reset init flags and call `switchView('network')` instead (lazy init handles rendering) |
| DOMContentLoaded has redundant initNetwork | Called before switchView which also lazy-inits | Removed redundant call, switchView handles it |

---

## Stabilization Audit (build 0335)

```
Brace balance:     {=2705 }=2705 ✓
All views hidden:  8/8 ✓
Controls hidden:   ✓
initNetwork calls: All guarded (3 remaining, all behind currentView or networkInitialized checks) ✓
Magic link:        Instance method + try-catch ✓
Picker flag:       _welcomePickerActive working ✓
switchProfile:     → network, scrollTo, no toast ✓
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

---

## Pending / Next Steps

### High Priority
- [ ] Wire onboarding wizard to save directly to Firestore on completion
- [ ] Move sample profiles to Firestore `samples/` collection for admin editing
- [ ] Test all sign-in flows: Google, email/password, magic link
- [ ] "Save to Cloud" indicator for user awareness
- [ ] Verify admin panel loads user list correctly

### Medium Priority
- [ ] Real-time save indicator (checkmark/spinner)
- [ ] Network resize handler (re-render on window resize)
- [ ] Remove dead code: buildProfileDropdown, showWizardPrompt, showWelcomeScreen (do carefully, Python string replacement corrupts easily in this file)
- [ ] Profile photo/avatar upload
- [ ] Enforce read-only in UI (disable edit buttons when isReadOnlyProfile)

### Lower Priority
- [ ] Offline mode with Firebase persistence
- [ ] Export to PDF
- [ ] Mobile-optimized wizard
- [ ] Analytics dashboard for admin

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
