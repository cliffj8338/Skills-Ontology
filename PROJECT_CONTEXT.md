# Work Blueprint — Project Context

**Version**: v4.0.0 | **Build**: 20260219-0315 | **Lines**: ~14,560 | **Functions**: ~288
**Repository**: https://github.com/cliffj8338/Skills-Ontology
**Live**: https://cliffj8338.github.io/Skills-Ontology/
**Creator**: Cliff Jurkiewicz
**Page Title**: "Work Blueprint by Cliff Jurkiewicz"

---

## What This Is

A single-page web application that maps professional skills to O*NET/ESCO taxonomies, visualizes them as an interactive D3 force-directed network, calculates market valuation, and generates exportable executive blueprints. Built as a single `index.html` file (~14.5K lines) hosted on GitHub Pages with Firebase backend.

## Tech Stack

- **Frontend**: Vanilla JS, D3.js v7 (force network), HTML5 Canvas (hero animation)
- **Backend**: Firebase Auth + Cloud Firestore (persistence layer added in v4.0.0)
- **Hosting**: GitHub Pages (static)
- **CDN Libraries**: D3, Ajv (JSON schema validation), Firebase SDK v10.7.0 (compat builds)
- **No build step**: Everything runs from a single HTML file + JSON data files in the repo

## Firebase Configuration

```
Project: work-blueprint
Auth Domain: work-blueprint.firebaseapp.com
Project ID: work-blueprint
API Key: AIzaSyBO703p11FdLojH6ogB50XrxoFVy_7bHLE (public, restricted to domains)
Authorized Domains: cliffj8338.github.io, localhost
```

**API Key Security**: Key is restricted in Google Cloud Console to HTTP referrers: `cliffj8338.github.io/*`, `localhost/*`, `work-blueprint.firebaseapp.com/*`, `work-blueprint.web.app/*`. Google flagged it as publicly exposed on GitHub; this is expected and safe for Firebase client-side keys. The real security layer is Firestore Security Rules + Firebase Auth.

### Auth Methods Enabled
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

samples/{sampleId}  (reserved, not yet used)
  readable by everyone, writable only by admin
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

**Admin seeding**: After first sign-in, manually set `role: "admin"` in Firebase Console → Firestore → Data → users/{cliff-uid}.

---

## Application Architecture

### Page Load / Init Flow (Critical)

This was the source of multiple bugs. The correct flow as of build 0315:

1. **HTML**: All 8 view containers (`welcomeView`, `networkView`, `cardView`, `opportunitiesView`, `applicationsView`, `blueprintView`, `consentView`, `settingsView`) start with `style="display:none;"`. Controls bar also hidden. Nothing is visible until JS explicitly shows a view.

2. **DOMContentLoaded** (async):
   - `checkMagicLinkSignIn()` — handles Firebase magic link if URL has sign-in params
   - `await authReadyPromise` — waits for `onAuthStateChanged` to fire once
   - `var targetView = await initializeApp()` — loads manifest, templates, determines view
   - If `userData.initialized`: update profile chip, init card view data, start auto-save interval
   - `switchView(targetView)` — shows welcome, blueprint, or network based on auth state
   - Deferred `rebuildProfileDropdown()` at 500ms as safety net

3. **initializeApp()** (async, returns string):
   - Fetches `profiles-manifest.json`, loads all enabled profile templates
   - Loads skill library index, values library
   - Loads scaffold template (from localStorage `currentProfile` or default `cliff-jones-demo`)
   - Calls `initializeMainApp()` to wire up globals
   - **Decision flow**:
     - If `fbUser && fbDb`: `await loadUserFromFirestore(uid)` — if data found, return `'blueprint'`; else return `'welcome'`
     - If not signed in: return `'welcome'`
   - Returns target view string

4. **switchView(view)** — master view controller:
   - Hides all 8 views + controls
   - Shows requested view
   - Lazy-initializes network SVG (`window.networkInitialized` flag) and card view on first visit
   - Lazy-initializes opportunities, applications, blueprint, consent, settings on first visit

### Key Globals

```javascript
var fbApp, fbAuth, fbDb;           // Firebase instances
var fbUser = null;                  // Current Firebase user (or null)
var fbIsAdmin = false;              // Admin role flag
var fbReady = false;                // SDK initialized
var authReadyPromise;               // Resolves when onAuthStateChanged fires once

var userData = { initialized: false, profile: {}, skills: [], ... };
var skillsData = { skills: [], roles: [], skillDetails: {} };
var templates = {};                 // Loaded profile templates keyed by ID
var isReadOnlyProfile = false;      // True when viewing sample as non-admin

var currentView = 'network';        // Current active view
var currentSkillsView = 'network';  // 'network' or 'card' within Skills tab
```

### Navigation Structure

**Header tabs**: Skills | Jobs | Applications | Work Blueprint
**Header right**: Theme toggle | Sign In button | Profile chip + dropdown | Overflow menu (...)

**Overflow menu items**:
- Home (welcome page)
- Build My Work Blueprint (wizard)
- View Sample Profiles
- Auth actions: Sign In / Sign Out
- Admin Dashboard (if admin)

**Profile dropdown** (rebuilt by `rebuildProfileDropdown()`):
- Current user section (if signed in) with ADMIN badge
- Sample profiles from manifest with SAMPLE label and checkmark on active
- Divider
- Admin Dashboard (if admin) / Sign Out / Sign In

**Logo click**: Returns to welcome page

### Views

| View | ID | Lazy Init | Description |
|------|----|-----------|-------------|
| Welcome | `welcomeView` | No (rendered each time) | Landing page with hero, animated network, CTAs |
| Skills - Network | `networkView` | Yes (`networkInitialized`) | D3 force-directed graph, full SVG |
| Skills - Card | `cardView` | Yes (`cardViewInitialized`) | Grid cards grouped by role/domain |
| Jobs | `opportunitiesView` | Yes | Job opportunity matching |
| Applications | `applicationsView` | Yes | Application tracker |
| Work Blueprint | `blueprintView` | Yes | Executive summary, compensation, outcomes |
| Consent | `consentView` | Yes | Privacy, GDPR tools, disclaimer |
| Settings | `settingsView` | Yes | Preferences |

### Profile System

**Sample profiles** load from JSON files in the repo (not Firestore):
- `profiles-manifest.json` lists enabled profiles
- Each profile has a JSON template file (e.g., `cliff-jones-demo.json`)
- Templates loaded at init, cached in `templates{}` object

**Profile switching** (`switchProfile(templateId)`):
- Loads template inline (no page reload as of build 0215)
- Resets all view init flags so they re-render fresh
- Updates profile chip, checks read-only, rebuilds dropdown
- Navigates to Work Blueprint tab

**Read-only mode** (`checkReadOnly()`):
- Active when viewing a sample profile AND not admin
- Shows sticky yellow banner with links to create account or build blueprint
- `isReadOnlyProfile` global flag available for downstream features

**User profiles** (signed-in users):
- Saved to Firestore under `users/{uid}`
- Auto-saved every 60 seconds
- Loaded on sign-in via `loadUserFromFirestore(uid)`

### Authentication UI

**Auth modal** (`showAuthModal(mode)`):
- Overlay with backdrop blur
- Sign-in / Sign-up toggle
- Google OAuth button with SVG logo
- Email/password form with Enter key support
- Magic link option ("Send me a sign-in link instead")
- Error/success message display
- `friendlyAuthError(code)` maps Firebase errors to readable messages

**Post sign-in** (`handlePostSignIn(user, isNewUser)`):
- Creates Firestore user doc on first sign-in
- Updates lastLogin for returning users
- Loads Firestore data or offers wizard

**Sign out** (`authSignOut()`):
- Clears fbUser/fbIsAdmin
- Navigates to welcome page
- Rebuilds dropdown

### GDPR Compliance (Consent Section)

Three functions accessible from buttons in the Consent and Sharing view:
- `viewMyData()` — modal showing stored data summary
- `exportMyData()` — downloads complete Firestore doc as JSON
- `requestDataDeletion()` — double-confirm, deletes Firestore doc + Firebase auth account, clears localStorage, signs out

### Admin System

- Role stored as `role: "admin"` in Firestore user doc
- `checkAdminRole(uid)` queries Firestore on each auth state change
- `fbIsAdmin` global flag
- Admin badge in profile chip and dropdown
- `showAdminPanel()` — modal listing all registered users with name, email, skill count, last login
- Admin can view all user data (Firestore rules allow read if admin)
- Admin bypasses read-only mode on sample profiles

### Welcome Page (build 0315)

Layout (top to bottom):
1. Headline: "Know Your Worth. Own Your Narrative."
2. Subtitle paragraph
3. Two CTA buttons: "View Sample Profiles" (outlined) | "Build Your Blueprint" (filled)
4. Animated network canvas in bordered showcase frame (320px, rounded corners, border glow)
5. Caption: "Interactive skills network visualization..."
6. "HOW IT WORKS" — three numbered steps (Upload, Value, Story)
7. Sign-in link
8. Disclaimer with Full Disclaimer link

**Hero animation** (`initHeroNetwork()`):
- HTML5 Canvas, 35 nodes in 8 color-coded domains
- Center "YOU" node, 8 domain hubs (Strategy, Leadership, Analytics, Innovation, Communication, Technology, Operations, Finance), 26 skill nodes
- Connections drawn based on distance, pulse with sinusoidal breathing
- Labels on hub nodes
- IntersectionObserver pauses animation when offscreen
- Respects dark/light theme
- Cleanup function stored at `window._heroNetworkCleanup`

**Sample profile picker** (`viewSampleProfile()`):
- If multiple samples: shows picker page with avatar cards for each profile
- If single sample: loads directly
- Each card shows initials avatar, name, title, description
- Back link returns to welcome

### Skills Network (D3)

- Force-directed graph with center "You" node
- Role hubs as large colored circles with labels
- Individual skills as smaller nodes connected to their role hub
- Cross-domain connections for shared skills
- Zoom/pan enabled
- Role Labels toggle, Skill Labels toggle
- Filter panel for roles/categories/levels
- Search bar filters nodes
- Network/Card view toggle
- Lazy-initialized on first visit to Skills tab via `window.networkInitialized` flag

### Work Blueprint Tab

Generates executive-ready document with:
- Executive summary
- Core competencies grid
- Strategic outcomes with metrics
- Leadership philosophy
- Market positioning quote
- Compensation framework (base market rate, conservative range, competitive range)
- Career narrative
- Future vision
- Export to standalone HTML document

### Onboarding Wizard

Multi-step flow:
1. Choose path: Upload resume / Manual entry / Import profile
2. Resume parsing (if upload path)
3. Profile basics (name, title, location)
4. Skills selection/confirmation
5. Values selection from library
6. Purpose statement (AI-generated option)
7. Download blueprint and/or launch app

---

## File Structure (GitHub Repo)

```
Skills-Ontology/
  index.html              # The entire app (~14.5K lines)
  profiles-manifest.json  # Lists enabled sample profiles
  cliff-jones-demo.json   # Cliff's sample profile template
  sarah-chen-demo.json    # Sarah's sample profile template
  skill_evidence.json     # Evidence data for skills
  skills/
    index-v3.json         # Skill library index (13,960+ skills)
  firestore.rules         # Firestore security rules
  PROJECT_CONTEXT.md      # This file
```

---

## Version History

| Version | Build | Key Changes |
|---------|-------|-------------|
| v3.9.4 | - | Theme toggle re-render fix |
| v4.0.0 | 0115 | Firebase Auth + Firestore + admin system + GDPR tools |
| v4.0.0 | 0200 | Welcome page + read-only samples + nav restructure |
| v4.0.0 | 0215 | Welcome-first flow + inline profile switch + sample picker |
| v4.0.0 | 0230 | Animated hero network + admin dropdown timing fix |
| v4.0.0 | 0300 | Async init fix + hero redesign + lazy network init |
| v4.0.0 | 0315 | All views hidden by default in HTML + network showcase layout |

---

## Known Issues / Bugs to Watch

1. **Profile dropdown timing**: Multiple `rebuildProfileDropdown()` calls needed because auth state and manifest load asynchronously. Deferred 500ms safety rebuild in DOMContentLoaded handles most cases. If dropdown still shows wrong data, the timing race is not fully resolved.

2. **Network resize**: D3 network does not auto-resize on window resize. If you load the page at one size then resize, the SVG dimensions are wrong. The lazy-init partially mitigates this since the network renders at container size when you first visit Skills tab.

3. **Sample profiles are JSON files, not Firestore**: To edit samples, admin must edit JSON and push to GitHub. The `samples/` Firestore collection exists in rules but is not wired up yet.

4. **Wizard not wired to Firestore**: The onboarding wizard saves to `templates['wizard-built']` and localStorage. It does not yet save to Firestore automatically. After wizard completion, the auto-save interval will eventually push to Firestore, but there is no explicit "save to cloud" step.

5. **No offline mode**: App requires network for Firestore reads/writes. Firebase offline persistence is not enabled.

6. **Magic link edge case**: If user clears localStorage between requesting and clicking the magic link, the email is not stored and sign-in may fail.

7. **Profile chip shows "Cliff Jones" even when signed in as different user**: The profile chip reflects the loaded sample profile name, not necessarily the authenticated user. When Firestore data loads, it overwrites with the correct name, but there can be a flash of the wrong name.

---

## Pending / Next Steps

### High Priority
- [ ] Wire onboarding wizard to save directly to Firestore on completion
- [ ] Add "Save to Cloud" indicator or manual save button
- [ ] Move sample profiles from JSON files to Firestore `samples/` collection for admin editing
- [ ] Test all sign-in flows end-to-end: Google, email/password, magic link
- [ ] Verify admin panel loads and shows user list
- [ ] Add "View Samples" button to admin dashboard

### Medium Priority
- [ ] Real-time save indicator (checkmark/spinner when Firestore save completes)
- [ ] Network resize handler (re-render SVG on window resize)
- [ ] Profile photo/avatar upload
- [ ] "My Profile" section for signed-in users to edit their info
- [ ] Enforce read-only mode in UI (disable edit buttons when `isReadOnlyProfile` is true)

### Lower Priority
- [ ] Offline mode with Firebase persistence
- [ ] Real-time collaboration features
- [ ] Export to PDF (currently exports to standalone HTML)
- [ ] Mobile-optimized wizard flow
- [ ] Analytics dashboard for admin
- [ ] Email notifications for profile completion milestones

---

## Development Notes

### Working With This Codebase

The entire app is one HTML file. When editing:
- Search by function name, not line number (lines shift constantly)
- The file has ~288 functions; key entry points are `initializeApp()`, `initializeMainApp()`, `switchView()`, `switchProfile()`
- Global state is extensive; changes to `userData` or `skillsData` affect multiple views
- All view init functions check a `window.xxxInitialized` flag to avoid re-rendering
- `switchProfile()` resets all init flags to force fresh renders

### CSS Architecture
- CSS variables for theming: `--bg`, `--text-primary`, `--accent`, `--border`, etc.
- `[data-theme="light"]` overrides for light mode
- `tv(dark, light)` helper function returns theme-appropriate value at render time
- Auth modal styles prefixed with `.auth-`
- Profile dropdown uses `.profile-option`, `.profile-option-avatar`, `.profile-option-info`, `.profile-option-name`, `.profile-option-title`
- Welcome page uses `.welcome-hero`, `.welcome-cards`, `.welcome-card`, `.welcome-features`, `.welcome-feature`

### Common Pitfalls
- **Do not call `initNetwork()` before the Skills tab is visible** — D3 needs visible container dimensions
- **Do not assume `profilesManifest` is loaded when auth fires** — manifest loads async in `initializeApp()`
- **`rebuildProfileDropdown()` must be called after both manifest AND auth resolve**
- **`window.location.reload()` was removed from `switchProfile()`** — profile switching is now inline
- **All views start hidden in HTML** — `switchView()` is the only way to show a view
- **The `tv(dark, light)` helper** only works at render time, not reactively; if theme changes, content using `tv()` must be re-rendered

### Cliff's Writing/Style Preferences (for AI-generated content in the app)
- Limit em/en dashes, prefer commas or rephrasing
- Avoid redundancy and excessive examples
- Never use "the uncomfortable truth" or "talent wars"
- Avoid jargon, superlatives, borrowed authority
- Precise verbs over generic ones
- Newsletter emails: SHORT and PUNCHY, 10-second read max
