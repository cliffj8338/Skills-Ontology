# Work Blueprint — Project Context

**Version:** v4.0.0 | **Build:** 20260219-0320 | **Lines:** ~14,560
**Repository:** https://github.com/cliffj8338/Skills-Ontology
**Live URL:** https://cliffj8338.github.io/Skills-Ontology/
**Creator:** Cliff Jurkiewicz (page title: "Work Blueprint by Cliff Jurkiewicz")

---

## What This Application Is

Work Blueprint is a single-page web application that maps a professional's skills to ESCO and O*NET taxonomies, visualizes them as an interactive D3 force-directed network, calculates market valuation, and generates an exportable executive blueprint document. It runs entirely client-side on GitHub Pages with Firebase for authentication and persistence.

The app serves two audiences:
1. **Visitors** — view sample profiles to understand the product
2. **Authenticated users** — build their own Work Blueprint via an onboarding wizard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Hosting | GitHub Pages (static) |
| Framework | Vanilla JS, single `index.html` file |
| Visualization | D3.js v7 (force-directed network) |
| Authentication | Firebase Auth (Google OAuth, email/password, magic link) |
| Database | Cloud Firestore |
| Styling | Custom CSS variables with dark/light theme toggle |
| Libraries | Ajv (JSON validation), html2canvas + jsPDF (export) |
| CDN | cdnjs.cloudflare.com, cdn.jsdelivr.net, gstatic.com (Firebase) |

---

## Firebase Configuration

**Project:** work-blueprint
**Console:** https://console.firebase.google.com/project/work-blueprint

```javascript
{
    apiKey: "AIzaSyBO703p11FdLojH6ogB50XrxoFVy_7bHLE",
    authDomain: "work-blueprint.firebaseapp.com",
    projectId: "work-blueprint",
    storageBucket: "work-blueprint.firebasestorage.app",
    messagingSenderId: "338454233039",
    appId: "1:338454233039:web:76016289b81d8298269cba"
}
```

**API key restrictions:** HTTP referrers locked to `cliffj8338.github.io/*`, `localhost/*`, `work-blueprint.firebaseapp.com/*`, `work-blueprint.web.app/*`

**Auth methods enabled:** Google sign-in, email/password, email link (magic link)

**Authorized domain:** cliffj8338.github.io

**Admin user:** Cliff Jurkiewicz — role set manually in Firestore Console → users/{uid} → role: "admin"

---

## File Architecture

Everything lives in a single `index.html` file (~14,560 lines). Supporting files in the repo:

```
Skills-Ontology/
├── index.html                  # The entire application
├── profiles/
│   ├── manifest.json           # Lists available sample profiles
│   ├── cliff-jones-demo.json   # Sample profile: Cliff Jones
│   └── sarah-chen-demo.json    # Sample profile: Sarah Chen
├── skills/
│   └── index-v3.json           # 13,960+ O*NET skills search index
├── skill_evidence.json         # Evidence data for skill cards
├── values-catalog.json         # 25 professional values catalog
└── firestore.rules             # Firestore security rules (deploy separately)
```

---

## Application Views

The app has 8 view containers, ALL hidden by default (`display:none` in HTML). `switchView()` shows one at a time.

| View ID | Nav Label | Purpose |
|---|---|---|
| `welcomeView` | (Home/logo click) | Landing page with animated network, CTAs, "How It Works" |
| `networkView` | Skills | D3 force-directed skills network (SVG) |
| `cardView` | Skills | Card/grid view of skills (alternate to network) |
| `opportunitiesView` | Jobs | Job matching and opportunity tracking |
| `applicationsView` | Applications | Application tracker |
| `blueprintView` | Work Blueprint | Executive summary, valuation, outcomes, export |
| `consentView` | (overflow menu) | GDPR tools, consent preferences, disclaimer |
| `settingsView` | (overflow menu) | App settings |

**Critical:** All views start with `style="display:none;"` in the HTML to prevent flash of blank content before JS runs. The `controlsBar` is also hidden by default.

---

## Navigation & Routing

### Page Load Flow (DOMContentLoaded)

```
1. checkMagicLinkSignIn()         — handle magic link if URL has params
2. await authReadyPromise         — wait for Firebase onAuthStateChanged
3. targetView = await initializeApp()  — load manifest, templates, decide view
4. switchView(targetView)         — show welcome, blueprint, or network
5. setTimeout(rebuildProfileDropdown, 500)  — safety rebuild
```

### initializeApp Decision Flow

```
Load scaffold template (currentProfile from localStorage, fallback: cliff-jones-demo)
→ initializeMainApp()

IF fbUser && fbDb:
    await loadUserFromFirestore(uid)
    → loaded?     targetView = 'blueprint'
    → not loaded?  targetView = 'welcome'

ELSE (not signed in):
    targetView = 'welcome'

return targetView
```

**Key design decision:** `initializeApp` is now fully `async` and `await`s the Firestore load. The returned `targetView` string drives DOMContentLoaded's view selection. This eliminates the async race condition that previously caused blank network views on load.

### View Switching

`switchView(view)` hides all 8 views, shows the selected one. Lazy initialization pattern:

- **Network:** `initNetwork()` only on first visit (`window.networkInitialized` flag)
- **Card view:** `initCardView()` only on first visit (`window.cardViewInitialized` flag)
- **Blueprint/Opportunities/Applications/Consent/Settings:** each has `*Initialized` flag

### Profile Switching (Inline, No Reload)

`switchProfile(templateId)` — NO `window.location.reload()`:
1. `loadTemplate(templateId)` — populates `userData` from template JSON
2. Updates `skillsData`, profile chip, dropdown
3. Resets ALL `*Initialized` flags (including `networkInitialized`, `cardViewInitialized`)
4. `checkReadOnly()` + `rebuildProfileDropdown()`
5. `switchView('blueprint')` — lands on Work Blueprint tab
6. Shows toast: "Viewing: [name]"

---

## Authentication System

### Auth Modal

`showAuthModal(mode)` renders a modal overlay with:
- Google sign-in button (OAuth popup)
- Email/password form with sign-in/sign-up toggle
- Magic link option ("Send me a sign-in link instead")
- Friendly error messages via `friendlyAuthError(code)`

### Auth State Globals

| Variable | Type | Purpose |
|---|---|---|
| `fbApp` | Firebase App | App instance |
| `fbAuth` | Firebase Auth | Auth instance |
| `fbDb` | Firestore | Database instance |
| `fbUser` | User \| null | Current authenticated user |
| `fbIsAdmin` | boolean | Admin role check result |
| `fbReady` | boolean | SDK initialized |
| `authReadyPromise` | Promise | Resolves after first onAuthStateChanged |

### onAuthStateChanged Flow

```
→ checkAdminRole(uid)   — queries Firestore for role field
→ set fbUser, fbIsAdmin
→ updateAuthUI()        — nav buttons, profile chip, page title
→ rebuildProfileDropdown()
```

### Sign-Out

`authSignOut()` → clears globals → `switchView('welcome')` — always returns to welcome page.

### Post Sign-In

`handlePostSignIn(user, isNewUser)`:
- New user: creates Firestore doc, offers wizard after 600ms
- Returning user: updates lastLogin timestamp

---

## Firestore Data Model

### users/{uid}

```javascript
{
    email: string,
    displayName: string,
    createdAt: timestamp,
    lastLogin: timestamp,
    role: 'user' | 'admin',
    profile: { name, email, location, seniority, ... },
    skills: [ { name, level, category, key, roles, evidence[] } ],
    values: [ { name, selected, inferred, custom } ],
    purpose: string,
    outcomes: [ { text, skill, category, shared, ... } ],
    preferences: { consentPreset, theme, ... },
    applications: [ ... ],
    updatedAt: timestamp
}
```

### Security Rules (firestore.rules)

```
users/{userId}: read/write by owner, read by admin
samples/{sampleId}: read by all, write by admin only
Admin check: get users/{auth.uid}.data.role == "admin"
```

Deploy via: Firebase Console → Firestore → Rules → paste → Publish

### Auto-Save

60-second interval saves to both localStorage (profile preference only) and Firestore (full profile, if signed in).

---

## Welcome Page

Rendered by `renderWelcomePage()` into `#welcomeView`.

### Layout (top to bottom)

1. **Headline** — "Know Your Worth. Own Your Narrative." centered
2. **Subtitle** — one-line value prop
3. **Two CTA buttons** — "View Sample Profiles" (outlined) + "Build Your Blueprint" (filled)
4. **Network showcase** — 320px bordered canvas frame with animated network, caption below
5. **"How It Works"** — three numbered circles: Upload → See Value → Own Story
6. **Sign-in link** + disclaimer

### Animated Network (Canvas)

`initHeroNetwork()` — lightweight canvas 2D animation (NOT D3):
- 35 nodes: 1 center ("YOU") + 8 domain hubs + 26 skill nodes
- 8 domain colors matching the real network
- Domain labels: Strategy, Leadership, Analytics, Innovation, Communication, Technology, Operations, Finance
- Sinusoidal drift, distance-based link opacity, pulsing sizes
- `IntersectionObserver` pauses when off-screen
- Cleanup: `window._heroNetworkCleanup()`

### Sample Profile Picker

`viewSampleProfile()`:
- 1 sample → loads directly
- Multiple samples → shows picker page with avatar cards
- Clicking a sample calls `switchProfile()` → Work Blueprint tab

---

## Read-Only Mode

`isReadOnlyProfile` = true when viewing a sample as non-admin.

Sticky yellow banner: "You are viewing a sample profile (read-only)" with links to create account or build blueprint.

Admin users bypass. `checkReadOnly()` called after every profile switch.

---

## Profile Dropdown

`rebuildProfileDropdown()` — single source of truth, rebuilt multiple times during init for timing safety.

**Signed in:**
1. Current user name + ADMIN badge (if admin)
2. Sample profiles (SAMPLE label, checkmark on active)
3. Divider → Admin Dashboard (if admin) → Sign Out

**Not signed in:**
1. Sample profiles (checkmark on active)
2. Divider → Sign In / Create Account

CSS classes: `profile-option`, `profile-option-avatar`, `profile-option-info`, `profile-option-name`, `profile-option-title`

---

## Overflow Menu

Accessible via `...` button in header. Contains:
- 🏠 Home (→ welcome)
- ◈ Build My Work Blueprint (→ onboarding wizard)
- 📊 View Sample Profiles (→ sample picker)
- Consent & Sharing (→ consent view)
- Settings (→ settings view)
- Sign In / Sign Out (toggles based on auth state)

---

## Admin System

- Role stored in Firestore: `role: "admin"` on user document
- Set manually in Firebase Console after first sign-in
- `showAdminPanel()` — modal listing all users with name, email, badge, skill count, last login
- Admin can read all user documents (security rules)
- Sample profiles are JSON files — admin edits by updating repo files

---

## GDPR Compliance

Three functions in Consent & Sharing section:

| Function | Action | GDPR Article |
|---|---|---|
| `viewMyData()` | Modal with stored data summary | Art. 15 (Access) |
| `exportMyData()` | Downloads Firestore doc as JSON | Art. 20 (Portability) |
| `requestDataDeletion()` | Double-confirm, deletes everything | Art. 17 (Erasure) |

Deletion: removes Firestore doc + Firebase auth account + localStorage, then reloads page.

---

## Skills Network (D3)

`initNetwork()` builds a force-directed graph from `userData.skills` and `userData.roles`.

- Center node = user name
- Hub nodes = roles (color-coded, sized by skill count)
- Leaf nodes = individual skills (sized by proficiency level)
- Links connect skills to their parent roles
- Toggle controls: Role Labels, Skill Labels
- Search and filter in `#controlsBar`
- Lazy-initialized on first visit to Skills tab

---

## Onboarding Wizard

`showOnboardingWizard()` — multi-step modal flow:

1. Choose method: Upload resume, Manual entry, Import profile
2. Resume parsing (paste text → AI extraction)
3. Profile basics: name, title, location, seniority
4. Skills review and editing
5. Values selection (25-value catalog with evidence-based scoring)
6. Purpose statement (auto-generated, editable)
7. Launch: saves profile, navigates to blueprint

Wizard-built profiles stored with `templateId: 'wizard-built'`.

---

## Values System (v3.9.3+)

25 professional values loaded from `values-catalog.json`. Each value has:
- Name, category, description
- Evidence signals (skill keywords, outcome keywords, role indicators)

`scoreValuesForProfile()` auto-selects top values based on the user's skills and outcomes. Users can override selections manually. Values display in Blueprint tab and export documents.

---

## Export System

Three export types from Blueprint tab:

1. **Executive Blueprint (HTML)** — styled document with Crimson Pro font, sections for summary, competencies, outcomes, valuation, narrative
2. **Resume (HTML)** — traditional resume format
3. **Full Data (JSON)** — complete userData dump

All use `Blob` + `URL.createObjectURL` for client-side download. No server required.

---

## Theme System

CSS custom properties: `:root` (dark default) → `[data-theme="light"]` overrides.

Toggle button in header. Saved to `localStorage('wbTheme')`. `tv(darkVal, lightVal)` helper for inline styles.

Key variables: `--bg-primary`, `--bg-card`, `--bg-elevated`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent`, `--border`, `--shadow`

---

## Key Global Variables

| Variable | Purpose |
|---|---|
| `userData` | Current profile (skills, values, outcomes, etc.) |
| `skillsData` | Reference copy for D3 network |
| `templates` | Loaded profile templates from manifest |
| `fbUser` / `fbIsAdmin` | Auth state |
| `isReadOnlyProfile` | Read-only sample flag |
| `currentView` | Active view name string |
| `currentSkillsView` | 'network' or 'card' |
| `skillLibraryIndex` | 13,960+ skills for search |
| `valuesLibrary` | 25 values for picker |
| `window.profilesManifest` | Manifest data with profile list |

---

## Version History

| Version | Build | Key Changes |
|---|---|---|
| v3.9.0 | 20260218 | Toast system, export redesign |
| v3.9.3 | 20260218 | Values system redesign (25-value catalog) |
| v3.9.4 | 20260218 | Theme toggle re-render fix |
| v4.0.0-0115 | 20260219 | Firebase auth + Firestore + admin + GDPR |
| v4.0.0-0200 | 20260219 | Welcome page + read-only samples + nav |
| v4.0.0-0215 | 20260219 | Welcome-first flow + inline profile switch + sample picker |
| v4.0.0-0230 | 20260219 | Animated hero network + admin dropdown fix |
| v4.0.0-0300 | 20260219 | Async init fix + hero redesign + lazy network |
| v4.0.0-0315 | 20260219 | All views hidden default + network showcase frame |
| v4.0.0-0320 | 20260219 | Fix: isSignInWithEmailLink compat SDK crash + try-catch guard |

---

## Known Issues & Next Steps

### Active Issues
- Profile chip shows sample name briefly before auth resolves (cosmetic)
- Sample profile editing requires git commits (no in-app admin editor)
- No offline mode
- Magic link requires email re-entry if localStorage cleared

### Planned Work
- Wire onboarding wizard to save directly to Firestore
- "Save to Cloud" indicator / manual save button
- Move samples from JSON files to Firestore `samples` collection for admin editing
- Real-time sync indicators
- Consider multi-file architecture if past ~16,000 lines

---

## Development Notes

### Coding Conventions
- ES5 `var` / `function(){}` in Firebase/auth code for broad compat
- ES6 `const`/`let`/arrows in D3 and newer UI code
- All onclick handlers exposed via `window.fn = fn`
- No build step — edit index.html, push to GitHub Pages
- `tv(dark, light)` helper for inline theme values

### Testing Checklist
1. Incognito load → welcome page (not blank network)
2. "View Sample Profiles" → picker → click → Work Blueprint tab
3. Click Skills → lazy network init renders correctly
4. Sign in (Google) → loads Firestore data or offers wizard
5. Sign out → returns to welcome page
6. Profile switch → inline load, no page reload
7. Admin: dropdown shows samples + admin dashboard
8. Theme toggle → all views update
9. Resize window → network handles gracefully

### Build Versioning
Format: `BUILD YYYYMMDD-HHMM` in comment + console banner on load.
