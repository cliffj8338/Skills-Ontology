# PROJECT_CONTEXT.md — Blueprint v4.17.1 (Role Floors + Valuation Toggle)
**Updated:** 2026-02-19 | **Lines:** 20,480 | **Functions:** ~428 | **Size:** ~1.09 MB | **Braces:** 0 (balanced)

## What Is Blueprint

Blueprint is a single-page career ontology platform that maps a person's full professional identity (skills, evidence, values, purpose) into an interactive visualization, scores it against job postings, and generates professional deliverables (resumes, cover letters, interview prep, LinkedIn profiles). It runs as a static site on GitHub Pages with optional Firebase auth/persistence.

**Live URL:** https://cliffj8338.github.io/Skills-Ontology/
**Repo:** https://github.com/cliffj8338/Skills-Ontology
**Primary file:** `index.html` (single-file SPA, 18,780 lines)

## Architecture Overview

### Single-File SPA
Everything lives in one `index.html`: CSS (lines 1-3600), HTML structure (3600-3700), JavaScript (3700-18780). No build tools, no bundler, no framework. Pure vanilla JS with D3.js for network visualization.

### External Dependencies
- **D3.js v7** — Network graph visualization (CDN)
- **jsPDF 2.5.1** — PDF resume generation (CDN)
- **Firebase 10.7.0** — Auth (Google, email, magic link) + Firestore persistence (CDN)
- **Anthropic API** — Job description parsing, resume AI, wizard parsing (client-side, key stored in localStorage)
- **Outfit font** — Primary typeface (Google Fonts)

### Local JSON Data Files (loaded at init)
| File | Purpose |
|------|---------|
| `profiles-manifest.json` | Lists enabled demo profiles with paths |
| `profiles/templates/blank.json` | Empty template for new profiles |
| `profiles/*.json` | Demo profile templates (recruiter, product, strategy) |
| `onet-skills-library.json` | O*NET skills taxonomy |
| `onet-abilities-library.json` | O*NET abilities taxonomy |
| `onet-workstyles-library.json` | O*NET work styles |
| `onet-knowledge-library.json` | O*NET knowledge domains |
| `onet-work-activities-library.json` | O*NET work activities |
| `trades-creative-library.json` | Non-O*NET trade/creative skills |
| `values-library.json` | Professional values catalog |
| `skill_valuations.json` | Market value data per skill |
| `certification_library.json` | 191 credentials with tiers, categories, curated skill maps |
| `skill_evidence.json` | Pre-loaded evidence for demo profiles |
| `onet-impact-ratings.json` | Skill impact scoring data |

### State Management
Two primary state objects, kept in sync:

**`userData`** — The active profile:
```
{ initialized, profile: {name, title, headline, photo, roleLevel, email, phone, linkedinUrl},
  skills: [{name, level, category, key, core, roles, evidence, synonyms}],
  skillDetails: {}, values: [], purpose: "", roles: [{id, name, color}],
  workHistory: [{id, title, company, location, startDate, endDate, current, description, achievements[]}],
  education: [{id, school, degree, field, year}],
  certifications: [{id, name, abbr, issuer, type, year, linkedSkills[], tier, libraryMatch}],
  verifications: [{id, skillName, claimedLevel, evidenceSummary, verifierName, verifierEmail, relationship, token, status, confirmedLevel, verifierNote, requestedAt, respondedAt}],
  preferences: {seniorityLevel, targetTitles, excludeRoles, ...},
  applications: [], savedJobs: [], templateId }
```

**`skillsData`** — Derived/synced mirror for rendering:
```
{ skills: [...], roles: [...], skillDetails: {} }
```

**Persistence chain:** User action → update userData → `saveUserData()` (localStorage) → `saveToFirestore()` (if signed in) → `rescoreAllJobs()` (if skills changed) → `refreshAllViews()`

### Auth & Permissions
- `fbUser` — Current Firebase user (null if anonymous)
- `fbIsAdmin` — Boolean, checked via `checkAdminRole()` against Firestore admins collection
- Admin gets: profile switching, sample job editing, admin panel, all demo profiles in dropdown
- Non-admin gets: read-only on demo profiles, locked sample jobs, standard user features
- `readOnlyGuard()` — Blocks edits on demo profiles for non-admin users

### localStorage Keys
`currentProfile`, `wbTheme`, `wbValues`, `wbPurpose`, `wbAnthropicKey`, `wbMagicLinkEmail`

---

## CSS Architecture (Lines 1-3600)

| Section | Lines | Purpose |
|---------|-------|---------|
| Theme Variables | 23-87 | CSS custom properties for dark/light themes |
| Light Theme Overrides | 88-136 | `[data-theme="light"]` overrides |
| Blueprint Sections | 137-347 | Cards, modals, buttons, form elements |
| Nav Bar | 348-891 | Top nav, profile chip, mobile bottom nav |
| Contextual Filter Bar | 892-1100 | View toggle buttons, filter chips |
| Network Visualization | 1100-1800 | SVG container, node styles, tooltips |
| Match Legend | 1800-2100 | Job match overlay stats panel |
| Job Cards | 2100-2400 | Pipeline card grid, match bars |
| Toast Notifications | 2400-2500 | Toast container, animations |
| Wizard | 2500-2650 | Onboarding wizard overlay |
| Mobile Responsiveness | 2650-3189 | `@media (max-width: 768px)` overrides |
| Auth Modal | 3189-3600 | Sign in/up modal styles |

---

## JavaScript Architecture (Lines 3700-18780)

### Firebase & Auth (L4280-4700, 18 functions)
`showAuthModal`, `authWithGoogle`, `authEmailSignIn`, `authEmailSignUp`, `authSendMagicLink`, `authSignOut`, `checkMagicLinkSignIn`, `handlePostSignIn`, `checkAdminRole`, `updateAuthUI`, `rebuildProfileDropdown`, `saveToFirestore`, `loadUserFromFirestore`

Key patterns: Auth state listener updates `fbUser`/`fbIsAdmin`, triggers `updateAuthUI()`. Post-signin loads from Firestore or falls back to localStorage. Firestore serializer at L4649 preserves all fields including `sample` flag on jobs.

### Profile & State Management (L4700-5950, 21 functions)
`saveAll`, `checkReadOnly`, `readOnlyGuard`, `renderWelcomePage`, `initHeroNetwork`, `viewSampleProfile`, `showToast`, `dismissToast`, `calculateSkillValue`, `calculateTotalMarketValue`, `getClosestRoleBenchmark`, `buildProfileSelector`, `switchProfile`, `saveUserData`

Key patterns: `saveAll()` orchestrates full save chain. `readOnlyGuard()` returns true (blocks action) if current profile is a demo and user isn't admin. `calculateTotalMarketValue()` sums skill-level market rates. Welcome page has animated hero network (D3 force simulation).

### Template & Profile Loading (L5950-6500, 12 functions)
`loadSkillLibraryIndex`, `searchSkills`, `getCategoryColor`, `isSkillAlreadyAdded`, `getSampleJobsForProfile`, `loadTemplate`, `initializeApp`

**`getSampleJobsForProfile(templateId, template)`** — Dynamic engine (v4.14.0). Reads template.skills to construct 3 calibrated jobs per profile type:
- **High tier (~80%+):** 10 profile skills at matching proficiency + 2 soft gaps
- **Mid tier (~50-65%):** 6 profile skills (2 at stretch level) + 6 Required gaps
- **Low tier (<50%):** 3 profile skills as Preferred + 10 Required/Expert alien-domain gaps
- Gap pools: technical, finance, operations, data (skills unlikely in the profile)
- All sample jobs flagged `sample: true` — locked for non-admin

**`loadTemplate(templateId)`** — Populates userData from template JSON. Injects sample jobs if savedJobs empty and profile is a demo.

**`initializeApp()`** — Master init: loads manifest, fetches all JSON libraries, builds profile selector, loads template, inits network.

### Onboarding Wizard (L6500-7600, 39 functions)
8-step wizard: Welcome → Upload method → Resume input → AI parsing → Profile edit → Skills review → Values → Purpose → Launch. Supports resume paste, file upload, or manual entry. Uses Anthropic API for resume parsing. Builds complete userData on completion.

### Network Visualization (L7600-9100, 26 functions)
Three D3 force-directed networks:
- **"You" mode** (`initNetwork`): User's skills grouped by role, color-coded by role
- **"Job" mode** (`initJobNetwork`): Single job's required/preferred skills
- **"Match" mode** (`initMatchNetwork`): Overlay showing matched (green), gaps (red), surplus (gray)

**Match overlay colors (v4.14.1):**
- Green = matched skill (user has it)
- Red = gap skill (job needs, user lacks)
- Gray = surplus skill (user has, job doesn't need)
- Blue = person center node only
- Role nodes: neutral slate fill with gray/red stroke (no more orange/blue confusion)

**Match legend panel** (`addMatchLegend`): Floating stats panel, top-right on desktop, bottom on mobile. Shows job title, company, score (color-coded), matched/gaps/surplus counts, proficiency gap warning, close/view-details buttons.

Key functions: `activateJobOverlay`, `clearJobOverlay`, `setNetworkMatchMode`, `switchView` (toggles Network/Card/You/Job/Match), `filterByRole`, `filterByLevel`

### Card View (L8318-8600)
Alternative to network: grid of skill cards grouped by role, sorted by level. Includes bulk import/edit buttons, search, and the same filter bar as network view.

### Skill Modals (L9100-9400, 8 functions)
`openSkillModal` — Rich detail modal for any skill: market value, proficiency bar, evidence list, related skills, coaching, category info. Accessible from both network nodes and card view.

### Role-Based Value Floors & Valuation Toggle (v4.17.1)

**Role-based minimum floors:**
Title keywords from `userData.profile.currentTitle` and `userData.roles[].name` are scanned against seniority patterns. Floor is applied after location multiplier:
- CEO/CTO/CFO/C-Suite/President: $200,000
- SVP/EVP: $180,000
- VP/Vice President: $150,000
- Senior Director: $130,000
- Director: $110,000
- Senior Manager/Principal: $95,000
- Manager/Lead/Head: $75,000
- Senior: $65,000
- `finalValue = Math.max(calculatedValue, roleFloor)`

**Valuation mode toggle:**
Global `valuationMode` ('evidence' | 'potential') switches how `calculateTotalMarketValue()` calculates proficiency points.
- **Evidence-Backed** (🔒, default): Uses `getValuationLevel(skill)` — min(claimed, effective). This is the "real" number.
- **Potential Value** (✨): Uses `skill.level` directly — trusts claimed levels. Shows amber warning: "This is your potential value, not your proven value. Adding evidence could close a $X gap."

Key: `getLevelForMode(skill)` helper inside calc function switches between modes. Both modes still respect role floor.

Toggle rendered as pill buttons in the Blueprint Market Valuation section. `setValuationMode(mode)` updates global and re-renders via `switchView('blueprint')`.

**Bug fix:** "Entry Level Level" doubled word — removed redundant " Level" suffix from display template.

**Return object additions:** `mode`, `roleFloor`, `roleFloorApplied`, `rawCalculatedValue`

### Certification Library System (v4.17.0)
**File:** `certification_library.json` — 191 credentials across 15 categories (University Degrees, Healthcare, Transportation, Technology, Finance, HR, Legal, Trades, Real Estate, Education, Food/Hospitality, Manufacturing, Marketing, Security, Environmental).

**Data structure per credential:**
```
{ category, name, abbr, type (Certification|License|Degree|Rating|...), 
  description, tier (1|2), skills? (curated array, present on 83 certs) }
```

**Tier system:**
- Tier 1 (Foundation) → Proficient floor (5 pts). Standard professional credentials. 115 credentials.
- Tier 2 (Advanced) → Advanced floor (10 pts). Expert/senior/highest-in-class. 76 credentials.
- Highest cert wins: when multiple certs link to the same skill, the highest tier determines the floor.

**Skill mapping (Option C hybrid):**
- 83 credentials have curated skill maps (3-7 skills each) covering the most common certs
- 108 uncurated credentials use fallback matching: keyword overlap between cert description/category and profile skill names
- User can always edit/add/remove skill links manually

**Key functions:**
- `searchCertLibrary(query)` — Fuzzy search by name, abbreviation, description, or category. Returns top 15.
- `findCertInLibrary(nameOrAbbr)` — Exact match by abbreviation or full name.
- `getCertSkillAssociations(cert)` — Returns curated skills or fallback matches.
- `getFallbackSkillMatches(cert)` — Keyword matching between cert metadata and profile skills.
- `getCertFloorLevel(cert)` / `getCertFloorPoints(cert)` — Tier-aware floor calculation.
- `getHighestCertTier(skillName)` — Scans all user certs for the highest tier linking to a skill.

**UI: Cert Modal (Add/Edit Credential)**
- Library search field with live dropdown showing matching credentials with tier badges (PRO/ADV)
- Selecting from library auto-fills: name, abbreviation, type, tier badge, and suggested skill links
- Manual entry supported for credentials not in library
- New fields: abbreviation, type selector, tier badge display
- Linked skills section shows dynamic floor label based on tier

**Integration with Evidence Engine:**
- `calculateEvidencePoints()` now calls `getHighestCertTier()` for tier-specific floors
- `hasLinkedCertification()` checks both manual `linkedSkills[]` AND library curated skill maps
- A PMP (tier 2) linking to "Project Management" bumps it to Advanced floor (10 pts)
- A CompTIA A+ (tier 1) linking to "IT Support" bumps it to Proficient floor (5 pts)

### Evidence CRUD & UX Consistency (v4.16.1)
**Principle:** Evidence editing lives in ONE canonical location (skill detail modal). All other surfaces link there. No duplicate editing paths that could diverge.

**Skill Detail Modal (canonical evidence editor):**
- "Evidence & Outcomes" section now fully editable: each outcome shows point score, edit ✎ and remove × buttons
- "+ Add Outcome" button at section header opens inline form
- Outcome form: result field (required, what happened), description field (context), live score preview showing 1-5 points as user types
- `scoreOutcome()` runs in real-time via `updateOutcomeScorePreview()`, showing "🔥 High impact" / "✔ Solid" / "↗ Add metrics for more"
- Save/cancel keeps user in the modal flow (close + reopen with fresh data)

**Edit Skill Modal (evidence-aware, not editor):**
- Now shows evidence status panel: points, effective level, outcome count, verification count
- Level radio buttons trigger `updateEditSkillGapWarning()` on change
- Gap warning appears if selected level exceeds evidence: "⚠ Claiming Expert but evidence supports Competent. Market valuation will use Competent..."
- "+ Add Evidence" button links back to skill detail modal (the canonical editor)
- Users CAN still change level freely (soft gate), but they see the consequence immediately

**Card View (indicator only):**
- ⚠ warning icon on skills with evidence gap (claimed > effective)
- ✓ checkmark on skills with evidence backing
- ★ star on verified skills
- Hover tooltips show evidence details

**Function naming:** `editSkillOutcome(skillName, idx)` for skill evidence editing. Blueprint outcomes editor remains `editOutcome(idx)`. No collision.

**UX Flow Map:**
```
Card View ──click──→ Skill Detail Modal (view + evidence CRUD + verify)
                         ├── ✏️ Edit ──→ Edit Skill Modal (level/roles/core + gap warning)
                         ├── 📝 Assess ──→ Assessment Modal (unique skills)
                         └── ✅ Verify ──→ Verification Request Modal
Network ──click──→ Skill Detail Modal (same as above)
Blueprint > Outcomes ──→ Read-only extraction from evidence (editOutcome for Blueprint text only)
```

### Evidence Quality Engine (L5750-5930, v4.16.0)
**Core concept:** Skills have a `claimedLevel` (user-set) and an `effectiveLevel` (evidence-derived). Market valuation uses the evidence-backed level, creating a natural incentive to provide quality outcomes.

**`scoreOutcome(text)`** — Scores a single outcome 1-5 points based on impact signals: financial scale ($M/$B = +2, any $ = +1), percentages (10%+ = +1), multipliers (Nx = +1), scope language (global, enterprise = +0.5), founding/building language (+0.5), recognition signals (award, published, keynote = +1), crisis context (+0.5). Capped at 5, allows 0.5 increments.

**`calculateEvidencePoints(skill)`** — Sums all outcome scores for a skill. Applies verification multiplier (default 1.5x) for confirmed outcomes. Applies certification floor (default Proficient = 5 pts) if skill has a linked cert.

**`getEffectiveLevel(skill)` / `getEffectiveLevelFromPoints(points)`** — Maps points to level: Novice (0), Competent (2), Proficient (5), Advanced (10), Expert (18), Mastery (28). Thresholds are admin-configurable.

**`getValuationLevel(skill)`** — Returns `min(claimed, effective)` for valuation. Evidence cannot lower you below what you've proven, but claiming above your evidence won't inflate your market value.

**`getEvidenceSummary(skill)`** — Returns complete status: points, effectiveLevel, claimedLevel, gap detection, next level threshold, verification counts, cert linkage.

**`evidenceConfig`** — Admin-configurable thresholds stored in localStorage. Defaults: Competent=2, Proficient=5, Advanced=10, Expert=18, Mastery=28. Also configures cert floor level and verification multiplier.

**Integration with valuation:** `calculateTotalMarketValue()` now calls `getValuationLevel()` instead of `skill.level` for point calculations. This means the entire compensation model respects evidence quality.

### Verification System (L5930-6100, v4.16.0)
**`requestVerification(skillNames[])`** — Modal-based flow to request third-party verification. Collects verifier name, email, relationship. Shows evidence preview per skill.

**`sendVerificationRequest()`** — Creates verification records in `userData.verifications[]`, saves to Firestore subcollection `users/{uid}/verifications/{id}`, generates mailto: link with verification URL and evidence summary.

**`getVerificationStats()`** — Profile-level counts: total skills, verified (confirmed by third party), pending, unverified. Displayed in stats bar.

**Verification record structure:** `{id, skillName, claimedLevel, evidenceSummary, verifierName, verifierEmail, relationship, token, status (pending|confirmed|adjusted|declined), confirmedLevel, verifierNote, requestedAt, respondedAt}`

**Certification-to-skill linking:** Certs now have `linkedSkills[]` array. Linked skills automatically receive cert floor level (default Proficient) in evidence point calculation. Linking UI in cert modal with profile skill autocomplete.

**UI surfaces:** Skill modal shows evidence quality panel (gap warning, progress bar, points, verification badges). Skill modal action bar has "Verify" button. Stats bar shows "X Verified" count. Admin panel has threshold configuration.

### Resume & Document Generation (L9379-9998)
**Resume v2 (v4.15.0):** `generateResume` → `gatherResumeData` → `buildResumeHTML`. Full ATS-compatible HTML resume. Contact block includes email, phone, LinkedIn URL, location. Professional Experience section renders structured work history entries with per-role achievements. Education and Certifications sections. Falls back to single-entry stub if no work history data. Core competencies grid, values tags. Print-to-PDF via browser.

`generateWorkBlueprint` / `gatherBlueprintData` / `createBlueprintHTML` — Executive Blueprint document.

### Blueprint Tab (L10200-11300, 26 functions)
Five sub-tabs: Market Valuation, Outcomes, Values, Purpose, Export. Outcomes extracted from skill evidence. Values picker with catalog. Purpose statement (AI-generatable). Export to PDF (`generatePDF` via jsPDF), copy as text, download HTML.

### Valuation & Export (L11300-12000, 21 functions)
Market valuation with role benchmarks. PDF generation with multi-page support. Cover letter generator (AI-powered or template). Interview prep builder. LinkedIn profile generator.

### Jobs & Matching Engine (L12000-14500, 45 functions)

**`matchJobToProfile(parsed)`** (L13210) — Core scoring algorithm:
1. Builds user skill lookup with synonym expansion
2. For each job skill, attempts: exact match → synonym match → substring containment → 50%+ word overlap
3. Calculates weighted score: `reqWeight * nameMatchQuality * proficiencyMatch`
4. Required skills: weight 3, Preferred: 2, Nice-to-have: 1
5. Proficiency match: full credit if user meets/exceeds, partial credit proportional to gap
6. Returns: `{ score, matched[], gaps[], surplus[], profGapCount }`

**`getSkillSynonyms(name)`** (L13006) — 150+ synonym groups for fuzzy matching (e.g., "Agile" ↔ "Scrum" ↔ "Kanban")

**Job pipeline features:** Add job (paste URL or JD text), AI parsing via Anthropic, local regex fallback, manual skill editing, match overlay, detail view with matched/gap/surplus breakdown, quick-add gap skills, rescore, re-analyze.

**Remote job search:** Fetches from RemoteOK, Remotive, Arbeitnow APIs. Filters by match score, seniority, keywords.

**Sample job locking (v4.14.0):** Jobs with `sample: true` flag. Non-admin cannot edit/remove/re-analyze. Guards in `removeJob()`, `editJobInfo()`, `reanalyzeJob()`. UI shows "🔒 Demo job" label.

### Settings: Experience Tab (v4.15.0, ~24 functions)
New "Experience" tab in Settings for managing structured career data:

**Work History** (`renderExperienceSettings`, `openWorkHistoryModal`, `saveWorkHistoryFromModal`): Full CRUD for work positions. Each entry: title, company, location, start/end dates, current flag, description, achievements array. Modal-based editing with dynamic achievement inputs. Reverse chronological order. Data flows to resume generation.

**Education** (`openEducationModal`, `saveEducationFromModal`): School, degree, field of study, year. Simple CRUD with modal editing.

**Certifications** (`openCertModal`, `saveCertFromModal`): Cert name, issuing org, year. Simple CRUD with modal editing.

**Profile Settings** also enhanced: phone and LinkedIn URL fields added alongside existing email. All contact fields appear in resume exports.

All three data types persist through the same chain: `saveAll()` → Firestore (if signed in) + localStorage values.

### Applications Tracker (L15469-15800, 10 functions)
Kanban-style tracker: Saved → Applied → Interviewing → Offer → Rejected. Add/edit/delete applications with company, role, salary, notes, next follow-up.

### O*NET Library & Skill Picker (L16693-16990, 9 functions)
Full O*NET taxonomy browser with category tabs (Skills, Abilities, Work Styles, Knowledge, Activities, Trades). Search, filter, multi-select, batch add to profile.

### Custom Skill Builder (L16964-17040)
Create skills not in O*NET: name, category (unique), proficiency, roles, core/differentiator flag. Registers in skill library with synonyms.

### Bulk Import & Manager (L17041-17470, 14 functions)

**Bulk Import** (`openBulkImport`): Two input modes (paste text or CSV/TSV upload). Smart CSV parser with flexible column names. Synonym-aware deduplication. Three merge strategies (Skip, Keep higher, Overwrite). Two-step review with per-skill action override. Destination toggle: Library Only vs Library + Profile.

**Bulk Manager** (`openBulkManager`): Searchable skill list with checkboxes. Bulk set proficiency level. Bulk remove from profile.

### Skill Editing (L17617-17830, 12 functions)
`openEditSkillModal` — Edit any skill's proficiency, category, roles, evidence. Delete from profile. Universal access from network nodes and card view.

`openAssessSkillModal` — Guided self-assessment for unique skills.

`refreshAllViews()` — Master refresh: rebuilds skillsData, rescores jobs, re-renders active view.

### Skill Management Hub (L17864-18430, 15 functions)
Unified modal with two tabs: "Your Skills" (manage existing) and "Add Skills" (search all libraries + custom). Search across all O*NET categories simultaneously.

### Admin & Config (L18430-18780, 22 functions)
Theme toggle (dark/light), profile dropdown, filter panel, overflow menu. Help modal, About modal (shows current version), Legal/IP notice. Admin panel with user data viewer, profile switching.

---

## Version History

### v4.17.1 (current)
- **Role-based value floors:** Title keyword detection sets minimum market value (VP → $150k, Director → $110k, etc.). Floor displayed when active.
- **Evidence/Potential toggle:** Two-mode valuation in Blueprint. Evidence-Backed (default) uses effective levels. Potential shows value assuming claimed levels are true, with amber warning showing the gap and encouraging outcome entry.
- **Bug fix:** "Entry Level Level" doubled word in Blueprint Market Valuation display.
- **Return object enriched:** `mode`, `roleFloor`, `roleFloorApplied`, `rawCalculatedValue` added to market value return.

### v4.17.0
- **Certification Library:** 191 credentials (certifications, licenses, degrees, ratings) across 15 industry categories. Loaded from `certification_library.json`.
- **Tier system:** Tier 1 (Foundation, 115 certs) → Proficient floor. Tier 2 (Advanced, 76 certs) → Advanced floor. Highest cert wins for overlapping skills.
- **Curated skill maps:** 83 most common credentials have hand-built skill associations (PMP → Project Management, Risk Management, etc.). 108 use fallback keyword matching.
- **Searchable cert picker:** Library search field in cert modal with live dropdown, tier badges (PRO/ADV), auto-fill of all fields, and auto-suggested skill links.
- **Tier-aware evidence engine:** `calculateEvidencePoints()` uses `getHighestCertTier()` for dynamic floor calculation. `hasLinkedCertification()` checks library maps + manual links.
- **Expanded cert data model:** Added `abbr`, `type`, `tier`, `libraryMatch` fields to certification records.
- **Updated cert display:** Settings shows abbreviation, tier badge, linked skill count per credential.

### v4.16.1
- **Evidence CRUD:** Add/edit/remove outcomes directly in skill detail modal. Inline form with live point scoring preview. Each outcome shows its evidence point value (1-5) with edit/remove controls.
- **Edit Skill gap awareness:** Edit Skill Modal now shows evidence status (points, effective level, outcome count). Level radio buttons trigger live gap warning when claimed level exceeds evidence. "+ Add Evidence" button links to skill detail modal.
- **Card view indicators:** Evidence gap warning (⚠), evidence backing (✓), and verification (★) indicators on skill cards with hover tooltips.
- **UX consistency audit:** All evidence editing flows through one canonical location (skill detail modal). Edit Skill Modal is evidence-aware but not an editor. No duplicate editing paths.
- **Function naming fix:** Renamed skill evidence editor to `editSkillOutcome()` to avoid collision with Blueprint's `editOutcome()`.

### v4.16.0
- **Evidence Quality Engine:** Each outcome scored 1-5 points based on impact signals (financial scale, percentages, scope, recognition). One exceptional outcome ($340M transformation) outweighs three minor ones. `effectiveLevel` derived from cumulative evidence points, not self-reported claims.
- **Evidence-weighted valuation:** `calculateTotalMarketValue()` now uses `getValuationLevel()` which returns the evidence-backed level. Claimed levels above evidence don't inflate compensation. Gap is shown transparently in skill modal with coaching guidance.
- **Certification-to-skill linking:** Certs have `linkedSkills[]` array. Linked skills auto-bump to Proficient floor in evidence calculations. Linking UI with profile skill autocomplete in cert modal.
- **Third-party verification:** Request verification via email for any skill(s). Verification records stored in Firestore. Stats bar shows verification counts. Skill modal shows verified/pending badges.
- **Admin threshold configuration:** Admin panel now includes Evidence Threshold Configuration section. Adjustable point requirements per level, cert floor level, and verification multiplier. Persisted in localStorage.
- **Skill modal evidence panel:** New panel at top of skill modal showing evidence points, progress bar, gap warning when claimed > effective, next level requirements, and verification badges.
- **Data model:** Added `userData.verifications[]`, `cert.linkedSkills[]`. Wired through Firestore serializer/loader, template loading, wizard builder.

### v4.15.0
- **Work History management:** Full CRUD in Settings → Experience tab. Title, company, location, dates, description, per-role achievements. Modal-based editing with dynamic achievement inputs.
- **Education management:** School, degree, field, year. CRUD with modal editing.
- **Certifications management:** Name, issuer, year. CRUD with modal editing.
- **Profile contact fields:** Phone and LinkedIn URL added to Settings → Profile. Persisted through Firestore and included in exports.
- **Resume v2:** Rebuilt `buildResumeHTML()` with structured Professional Experience (multiple entries with per-role achievements), Education section, Certifications section, full contact header (email, phone, LinkedIn, location). Falls back gracefully to single-entry stub when no work history exists. ATS-optimized, print-to-PDF ready.
- **Data model expansion:** `userData.workHistory[]`, `userData.education[]`, `userData.certifications[]`, `userData.profile.phone`, `userData.profile.linkedinUrl` — all persisted through Firestore serializer/loader, template loading, and wizard builder.

### v4.14.1 (stabilized)
- Fixed match overlay role node colors: neutral slate instead of profile-colored (orange/blue)
- Repositioned match legend panel: top-right on desktop, full-width bottom on mobile
- Updated About dialog version reference (was stale at v4.6.0)
- Removed verbose debug console.logs (template loading, skill modal, sample job scoring)
- Full audit: 0 duplicate functions, 0 missing onclick targets, 0 duplicate HTML IDs, balanced braces

### v4.14.0
- Calibrated sample jobs: Dynamic engine reads actual template skills. Three tiers per profile type (high ~80%+, mid ~50-65%, low <50%). Gap pools from alien domains. All flagged `sample: true`, locked for non-admin.

### v4.13.0
- Match overlay stats panel: job title, score bar, matched/gaps/surplus counts, proficiency gap warning, close/view-details actions, glass-morphism design.

### v4.12.0
- Library-only import mode. Bulk skill manager (search, select all, set level, remove). Roles made optional in all skill modals.

### v4.11.0
- Bulk skill import: paste text or CSV/TSV, synonym-aware dedup, three merge strategies, per-skill action overrides, two-step review.

### v4.10.1
- Toast CSS fix (moved to main head). Universal skill editing from network. Corrected proficiency levels (added Competent). Sample job injection for demo profiles. Three bug fixes.

### v4.9.0
- Jobs tab overhaul: pipeline view, Find Jobs with remote API search, job detail with matched/gap/surplus breakdown, match overlay in network view.

### v4.7.0-v4.8.0
- UI stubs, inventory system, card view filters, initial job matching.

### v4.6.0
- Wizard, exports, resume generation, negotiation guide, valuation engine, hero animation, profile switching.

### v4.0.0
- Foundation: network visualization, skill ontology, Firebase auth, theme system, O*NET integration.

---

## Key Patterns & Conventions

### Function Naming
- `render*` — Returns or injects HTML
- `init*` — Sets up a major feature (called once)
- `open*/close*` — Modal lifecycle
- `switch*` — Tab/view navigation
- `save*` — Persist data
- `export*/generate*` — Create deliverables

### Modal Reuse
Most modals reuse `exportModal` container by swapping `.modal-content` innerHTML. Dedicated modals: `skillModal`, `customSkillModal`, `editSkillModal`, `assessSkillModal`, `bulkImportModal`, `bulkSkillManagerModal`, `onetPickerModal`, `skillManagementModal`.

### View System
`switchView(viewName)` manages: 'skills' (network/card), 'opportunities' (jobs), 'applications', 'blueprint'. Each has an `init*` function called on first visit.

### Skill Level Scale
6 levels: Novice (1) → Competent (2) → Proficient (3) → Advanced (4) → Expert (5) → Mastery (6). `proficiencyValue(level)` converts name to number.

### Toast System
`showToast(message, type)` — Types: 'success' (green), 'warning' (amber), 'error' (red), 'info' (blue). Auto-dismiss after 4s. Stacks multiple toasts.

---

## Known Considerations

1. **Backtick count is odd (507)** — False alarm. Backticks inside regex patterns on L6996 (`/^\`\`\`json.../`) for JSON fence stripping are counted but aren't template delimiters. JS executes correctly.

2. **Console.logs remain (70)** — Kept intentionally for admin debugging. Key lifecycle markers (Firebase init, template loading, job scoring). No debugger statements.

3. **var/let/const mix** — 826 var, 77 let, 668 const. Older code uses var, newer uses const/let. Not causing issues but could be modernized.

4. **Window exposures (167)** — Functions exposed via `window.functionName = functionName` for onclick handler access. Standard pattern for non-module SPA.

5. **Empty catch blocks (2)** — One legitimate Firebase fallback (L4553), one for localStorage quota/private mode (L10089). Both intentional.

---

## Development Transcript History

Sessions are stored in `/mnt/transcripts/`:
1. `2026-02-19-03-51-49-blueprint-v46-wizard-exports.txt`
2. `2026-02-19-14-57-36-hero-animation-profile-switch-fixes.txt`
3. `2026-02-19-15-17-20-hero-animation-profile-bugs-audit.txt`
4. `2026-02-19-15-40-07-v47-audit-fixes-ui-stub-inventory.txt`
5. `2026-02-19-16-59-35-v49-jobs-matching-overhaul.txt`
6. `2026-02-19-18-01-02-v410-skill-edit-sample-jobs-bugfix.txt`
7. `2026-02-19-19-07-15-v412-v413-bulk-import-manager-overlay-panel.txt`
8. Previous session: v4.14.0-v4.14.1 (calibrated sample jobs, overlay color fix, stabilization audit)
9. Current session: v4.15.0-v4.17.1 (Work History/Education/Certs, Resume v2, Evidence Engine, Verification, Evidence CRUD, Cert Library, Role Floors, Valuation Toggle)

---

## Priority Queue (Next Features)

### High Priority
- **Values System v2** — Editable descriptions (not just catalog defaults), drag-to-reorder or explicit ranking (top 3 marked as "core"), stronger evidence-linking UI, "value story" narrative field per value
- **Evidence Management UI** — ✅ COMPLETED in v4.16.1. Add/edit/remove outcomes in skill detail modal with live scoring. Edit skill modal has gap awareness. Card view has indicators.
- **Consent-to-Export Pipeline** — Wire consent presets so they actually filter what appears in exports. "Preview what gets shared" summary before any export.
- **Proficiency gap visualization on nodes** — Show visual indicator when user matches a job skill but at lower proficiency
- **Job application tracking integration** — Connect pipeline jobs to application tracker

### Medium Priority
- **Verification landing page** — Standalone `verify.html` page where verifiers click link from email, see evidence summary, confirm/adjust/decline without auth. Currently manual confirmation via profile owner.
- **Animated transitions between network modes** — Smooth morph between You/Job/Match views
- **Drag-to-rearrange** in skill lists and card view
- **Skill gap development plans** — Suggest learning paths for gap skills
- **Work history import from wizard** — Parse work history entries from resume text during onboarding wizard AI parsing

### Low Priority
- **var → const/let modernization** — Cleanup pass on older functions
- **Code splitting** — Break monolith into modules (would require build tooling)
- **Offline support** — Service worker for PWA capability
- **Import from LinkedIn** — Parse LinkedIn data export

### Completed (v4.17.0)
- ✅ **Certification Library** — 191 credentials, searchable picker, tier system, curated skill maps
- ✅ **Tier-aware evidence engine** — Dynamic floor calculation, highest cert wins

### Completed (v4.16.1)
- ✅ **Evidence CRUD** — Add/edit/remove outcomes in skill modal with live scoring
- ✅ **Edit Skill gap awareness** — Evidence status panel, live gap warnings on level change
- ✅ **Card view evidence indicators** — Gap/backed/verified badges
- ✅ **UX consistency audit** — Single canonical editor, no duplicate paths

### Completed (v4.16.0)
- ✅ **Evidence Quality Engine** — Outcome scoring (1-5 pts), effective levels, evidence-weighted valuation
- ✅ **Third-party verification system** — Request, track, display verification status
- ✅ **Certification-to-skill linking** — Auto-bump effective level for cert-linked skills
- ✅ **Admin threshold configuration** — Configurable point requirements per level

### Completed (v4.15.0)
- ✅ **Professional resume generation v2** — Full ATS-compatible resume with structured work history, education, certifications, full contact block
- ✅ **Work History / Education / Certifications management** — Settings → Experience tab with full CRUD
- ✅ **Profile contact expansion** — Phone and LinkedIn URL fields

---

## Creator & IP

Blueprint is the intellectual property of Cliff Jurkiewicz. All methodologies, ontology structures, and matching algorithms are original work. Copyright notices in About dialog (L18623) and Legal Notice (L18669).
