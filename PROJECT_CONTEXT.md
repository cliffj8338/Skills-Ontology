# Blueprint — Project Context

**Version:** v4.5.0 | **Build:** 20260218-0530 | **Lines:** ~16,370 | **Functions:** ~313
**Repository:** https://github.com/cliffj8338/Skills-Ontology
**Live:** https://cliffj8338.github.io/Skills-Ontology/
**Founder:** Cliff Jurkiewicz

---

## Branding

- **Name:** Blueprint (formerly "Work Blueprint")
- **Logo:** B4 "Architect's Stamp" — network graph mark (5 nodes, 4 primary connections, 3 secondary) contained within a circular ring
- **Typography:** Outfit 500, spaced uppercase (letter-spacing: 0.22em) for header and nav
- **Mark colors:** Center node #60a5fa, outer nodes #93bbfc and #818cf8, ring #60a5fa at 22% opacity
- **Type color:** #93bbfc (light blue) on dark backgrounds
- **Font import:** Google Fonts — Outfit 400-700
- **SVG mark viewBox:** 0 0 52 52 (scales cleanly to any size)
- **Trademark:** Blueprint™ — ™ symbol in header (superscript, 55% size, 60% opacity)
- **Copyright:** © 2026 Cliff Jurkiewicz. All rights reserved.
- **Legal:** Full IP/legal notice modal (`showLegalNotice()`) covering trademark, copyright, IP (ontology system, match algorithm, network visualization, proprietary frameworks), third-party data, user data policy
- **Copyright in exports:** Travels with PDF footer, HTML Blueprint export, resume export, and text export
- **Nav typography:** Outfit 500, uppercase, 0.08em letter-spacing (desktop), 0.06em (mobile)

---

## What This Is

A single-page web application that maps professional skills to O*NET/ESCO taxonomies, visualizes them as an interactive D3 force-directed network, calculates market valuation, and generates exportable executive blueprints. Built as a single `index.html` file (~16.4K lines) hosted on GitHub Pages with Firebase backend.

## Tech Stack

- **Frontend:** Vanilla JS, D3.js v7 (force network), HTML5 Canvas (hero animation)
- **Backend:** Firebase Auth + Cloud Firestore
- **Hosting:** GitHub Pages (static)
- **CDN Libraries:** D3, Ajv (JSON schema validation), Firebase SDK v10.7.0 (compat builds)
- **Typography:** Google Fonts — Outfit (brand), system fonts (body)
- **No build step:** Everything runs from a single HTML file + JSON data files in the repo

---

## Firebase Configuration

```
Project: work-blueprint
Auth Domain: work-blueprint.firebaseapp.com
Project ID: work-blueprint
API Key: AIzaSyBO703p11FdLojH6ogB50XrxoFVy_7bHLE (public, domain-restricted)
```

**API Key Security:** Restricted in Google Cloud Console to HTTP referrers: `cliffj8338.github.io/*`, `localhost/*`, `work-blueprint.firebaseapp.com/*`, `work-blueprint.web.app/*`. Safe for Firebase client-side keys. Security enforced by Firestore Rules + Firebase Auth.

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
  savedJobs: [ ... ]
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

**1. HTML baseline:** All 8 view containers and controls bar start with `style="display:none;"`. Nothing visible until JS explicitly shows a view via `switchView()`.

**2. DOMContentLoaded** (async):
```
checkMagicLinkSignIn()        // wrapped in try-catch
await authReadyPromise         // waits for onAuthStateChanged
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
- Welcome page: only re-renders if `_welcomePickerActive` flag is not set
- Network view: hides filter button, shows filter pill if role active
- Card view: shows filter button, hides network filter pill

### Key Globals

```javascript
fbApp, fbAuth, fbDb              // Firebase instances
fbUser = null                     // Current Firebase user or null
fbIsAdmin = false                 // Admin role flag
authReadyPromise                  // Resolves when onAuthStateChanged fires once

userData = { initialized, profile, skills, values, purpose, outcomes, savedJobs, ... }
skillsData = { skills, roles, skillDetails }
templates = {}                    // Loaded profile templates keyed by ID
isReadOnlyProfile = false         // True when viewing sample as non-admin
activeRole = 'all'                // Currently filtered role in network view

currentView = 'network'           // Active view
currentSkillsView = 'network'     // 'network' or 'card' within Skills tab
```

### Navigation

**Header tabs:** Skills | Jobs | Applications | Blueprint (Outfit spaced caps)
**Header right:** Theme toggle | Sign In | Profile chip + dropdown | Overflow menu

**Logo click** returns to welcome page.

**Profile dropdown** (rebuilt by `rebuildProfileDropdown()`): current user section with ADMIN badge, sample profiles from manifest, Admin Dashboard / Sign Out actions. Click propagation fix: clicks inside dropdown options don't bubble to the chip toggle.

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

## Network Filtering (v4.5.0)

### Interaction Model
- **Filter button hidden** in network view (filtering via direct node interaction)
- **Filter button visible** in card view (traditional panel with roles + levels)
- **Click role node** to filter to that role's skills (dims everything else)
- **Click same role again** to toggle back to "all" (deselect)
- **Click center node (your name)** to reset to show all
- **All interactive nodes have cursor:pointer** (center, role, skill)

### Floating Filter Pill
- ID: `networkFilterPill`
- Appears at top-center when a role is actively filtered
- Shows role name with color dot matching the role's node color
- × button clears the filter via `filterByRole('all')`
- Hidden when "all" is active or when in card view
- Styled: backdrop-blur, elevated bg, accent border, Outfit font

### filterByRole(roleId) Updates
- Manages both the role-chip panel state AND the network filter pill
- Looks up role name and color from `window.networkData.nodes`
- Shows/hides pill based on whether filtering is active

---

## Profile System

### Sample Profiles
- Load from JSON files in the repo, not Firestore
- `profiles-manifest.json` lists enabled profiles
- Currently: Cliff Jones (VP Strategy), Sarah Chen (Tech Recruiter), Mike Rodriguez (Eng Lead), Jamie Martinez (Hair Stylist), Alex Thompson (Retail Cashier)

### Profile Switching (`switchProfile(templateId)`)
- Loads template inline, no page reload
- Resets ALL view init flags
- **Navigates to Skills Network view** (card on mobile)
- Scrolls to top with 50ms delay

### Profile Dropdown Fix (v4.5.0)
- `toggleProfileDropdown()` checks if click originated inside `profileDropdownOptions`
- If yes, returns early (lets the option's own onclick handle closing)
- Prevents re-toggle bug

---

## Authentication

### Auth Modal (`showAuthModal(mode)`)
- Sign-in / Sign-up toggle, Google OAuth, email/password, magic link

### Post Sign-In (`handlePostSignIn(user, isNewUser)`)
- Creates Firestore doc on first sign-in
- Loads Firestore data or offers wizard for new users

### Magic Link
- **CRITICAL:** Uses `fbAuth.isSignInWithEmailLink()` (instance method), NOT `firebase.auth.isSignInWithEmailLink()` (static, does not exist in compat SDK)

---

## Job Cart System (v4.2.0+)

### Data Structure
```javascript
{
  id: 'job_1708300000000',
  title: 'Senior Talent Strategist',
  company: 'Acme Corp',
  sourceUrl: 'https://...',
  sourceNote: 'Found on LinkedIn',
  rawText: '...',               // Original JD text (capped 5000 chars)
  parsedSkills: [...],
  parsedRoles: [...],
  seniority: 'Senior',
  matchData: { score, matched[], gaps[], surplus[], totalJobSkills, totalUserSkills },
  addedAt: '2026-02-18T...'
}
```

### Parsing Engines

**Claude API (`parseJobWithAPI`):**
- Claude Sonnet via direct browser access (`anthropic-dangerous-direct-browser-access` header)
- API key in localStorage ('wbAnthropicKey'), never sent to our servers

**Local Fallback (`parseJobLocally`):**
- Title extraction: skips meta lines, prioritizes role keywords, scans first 15 lines
- Company extraction: "Company:", "About [Company]" patterns
- Four-pass skill extraction: user skills → O*NET library → 100+ keyword dictionary → phrase-level regex
- Word-overlap fuzzy matching: 50%+ word overlap = partial match at reduced quality

### Match Algorithm (`matchJobToProfile`)
- Exact match first, then fuzzy (substring for terms > 4 chars)
- Weighted: Required=3x, Preferred=2x, Nice-to-have=1x
- Proficiency bonus: Mastery=1.0, Expert=0.9, Advanced=0.75, Proficient=0.6, Novice=0.4

### Job Management UI
- `editJobInfo(idx)` — modal for title, company, URL, note
- `reanalyzeJob(idx)` — re-runs parser against stored JD text
- `removeJob(idx)` — confirm and delete, clears overlay if affected
- Edit/Remove buttons on pipeline cards and detail view header
- 10-job cap per user

### Network Overlay (v4.3.0)

**Three modes:** You / Job / Match (pill toggle in controls bar)
- **You:** Standard user skills network
- **Job:** Job requirements as network, skills grouped by category
- **Match:** Overlay combining both — green matched, red gaps, grey surplus, dashed cross-links
- Active job badge with × clear button
- Floating legend with live counts + match percentage

---

## Values System (v4.1.0)

25 values across 5 groups. Each has name, keywords, description. Personal notes per value. Notes appear in cards, clipboard, and PDF exports.

---

## Export System

All exports under Blueprint tab > Export sub-tab.

1. **Executive Blueprint** — standalone HTML (generateWorkBlueprint)
2. **Professional Resume** — ATS-friendly HTML (generateResume)
3. **PDF Summary** — jsPDF 2-page (generatePDF)
4. **Copy to Clipboard** — plain text (copyBlueprintText)
5. **Full JSON** — complete data backup (exportFullJSON)

All exports include © 2026 Cliff Jurkiewicz / Blueprint™ attribution.

---

## Mobile Behavior

- `initNetwork()` detects mobile via `window.innerWidth <= 768`
- Mobile: top 25 skills, bigger touch targets, hidden skill labels
- `switchProfile()` defaults to card view on mobile
- Mobile nav bar at bottom with Outfit uppercase labels
- Network filter pill, match overlay legend all responsive

---

## Admin & GDPR

- `role: "admin"` in Firestore → admin badge, bypass read-only, admin panel
- GDPR: `viewMyData()`, `exportMyData()`, `requestDataDeletion()`

---

## File Structure

```
Skills-Ontology/
  index.html              # Entire app (~16.4K lines)
  profiles-manifest.json  # Enabled sample profiles
  cliff-jones-demo.json   # Sample profiles...
  sarah-chen-demo.json
  mike-rodriguez-demo.json
  jamie-martinez-demo.json
  alex-thompson-demo.json
  skill_evidence.json
  skills/
    index-v3.json         # 13,960+ skills
  firestore.rules
  PROJECT_CONTEXT.md      # This file
```

---

## Version History

| Build | Date | Changes |
|-------|------|---------|
| v4.0.0 | 20260218 | Firebase Auth + Firestore + admin + GDPR + welcome page + read-only samples + nav restructure + hero animation + async init fixes |
| v4.1.0-0400 | 20260218 | Mobile responsive + Values descriptions/notes + Consent fixes + Export consolidation |
| v4.2.0-0430 | 20260218 | Job Cart: JD analysis (Claude API + local fallback), match scoring, pipeline UI, Firestore persistence |
| v4.3.0-0500 | 20260218 | Job Cart Phase 2: Network overlay (You/Job/Match toggle), match visualization with legend |
| v4.3.1-0510 | 20260218 | Parser rebuild: 100+ skill dictionary, phrase extraction, fuzzy word-overlap matching. Job edit/delete/re-analyze UI. |
| v4.4.0-0520 | 20260218 | Rebrand: "Work Blueprint" → "Blueprint". B4 Architect's Stamp logo (Outfit 500 spaced caps). SVG network mark throughout. Copyright/trademark/IP legal notice. All exports carry attribution. |
| v4.5.0-0530 | 20260218 | Nav: Outfit spaced caps. Network filtering via node clicks (filter button hidden). Center node reset. Role toggle. Floating filter pill. Profile dropdown fix. Removed subtitle. |

---

## Pending / Next Steps

### High Priority
- [ ] Cover letter / interview prep generation from match data
- [ ] Wire onboarding wizard to save directly to Firestore
- [ ] Move sample profiles to Firestore `samples/` collection
- [ ] Test all sign-in flows end-to-end
- [ ] Loading screen / welcome page lockup with B4 logo

### Medium Priority
- [ ] Real-time save indicator (checkmark/spinner)
- [ ] Network resize handler
- [ ] Remove dead code (old buildProfileDropdown, showWizardPrompt, etc.)
- [ ] Profile photo/avatar upload
- [ ] Enforce read-only in UI (disable edit buttons)
- [ ] Persist consent preset to userData.preferences

### Lower Priority
- [ ] Offline mode with Firebase persistence
- [ ] Mobile-optimized wizard
- [ ] Analytics dashboard for admin
- [ ] LinkedIn Profile export
- [ ] Interview Prep STAR stories generator
- [ ] Domain registration (blueprint.work recommended)

---

## Common Pitfalls

1. **Never call `initNetwork()` before Skills tab is visible.** D3 needs visible container dimensions.

2. **Firebase compat SDK:** Use `fbAuth.isSignInWithEmailLink()` (instance), NOT `firebase.auth.isSignInWithEmailLink()`.

3. **`rebuildProfileDropdown()` must run after both manifest AND auth resolve.**

4. **`switchView()` is the only way to show a view.** All views start hidden.

5. **The `_welcomePickerActive` flag** prevents switchView from overwriting welcomeView content.

6. **Python string replacement is dangerous on this file.** Use `str_replace` tool or targeted `sed`.

7. **The `tv(dark, light)` helper** returns theme-appropriate values at render time only.

8. **Always verify shipped output matches working file.**

9. **The `exportModal` div is reused dynamically** by multiple functions.

10. **Mobile network shows subset of skills.** Top 25 key/expert.

11. **App footer hidden on welcome view.** Welcome has its own disclaimer.

12. **Claude API uses direct browser access.** `anthropic-dangerous-direct-browser-access` header required.

13. **Jobs tab reinitializes on every visit.** `opportunitiesInitialized` resets after add/remove.

14. **Local JD parsing depends on skill library index.**

15. **Firebase project ID is `work-blueprint`** (infrastructure). User-facing name is "Blueprint" everywhere.

16. **Network filter pill only in network view.** `filterByRole()` checks `currentSkillsView`.

---

## Competitive Landscape (Blueprint name)

Searched Feb 2026. No conflicts in our space:
- **blueprint.tech** — ad tech / media spend optimization
- **Blueprint (healthtech)** — mental health tools for clinicians
- **BlueprintSys** — RPA migration/automation
- **Blueprint (Seattle)** — data solutions firm
- **Blueprint HR Software** — India SAP implementation (acquired by HR Path)
- **Blueprint HC** — management process platform

None in personal professional ontology / career intelligence. Clear daylight.

---

## Cliff's Writing/Style Preferences

- Limit em/en dashes, rephrase or use commas
- Avoid redundancy and excessive examples
- Never use "the uncomfortable truth" or "talent wars"
- Avoid jargon, superlatives, borrowed authority
- Precise verbs over generic ones
- Newsletter emails: SHORT and PUNCHY, 10-second read max
- Editorial board review: WSJ, NY Times, The Atlantic, HR Executive
- Terse communication with AI is for efficiency, not dissatisfaction
