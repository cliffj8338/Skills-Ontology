# Blueprint™ Project Context
## Updated: 2026-02-25 | Current Version: v4.44.42

---

## What is Blueprint?

Blueprint™ is a career intelligence web application at **myblueprint.work**. It visualizes professional skills as interactive network graphs, reveals market value, matches users against real job postings, and generates comprehensive career reports. The tagline: "The Resume is Dead. Here is Your Blueprint.™"

---

## Architecture

| Layer | Technology | Details |
|-------|-----------|---------|
| Frontend | Vanilla JS + D3.js | Single-file `index.html` (~32,700 lines), no framework |
| Styling | `blueprint.css` | Custom design system with CSS variables, dark/light themes |
| Auth | Firebase Auth | Google provider + email/password, project: `work-blueprint` |
| Database | Firestore | Collections: users, analytics_events, jobs, meta, reports, waitlist |
| API | Vercel Serverless | `/api/` directory: ai.js, jobs.js, jobs-sync.js, api-job-proxy.js |
| Hosting | Vercel | Auto-deploys from GitHub push to `main` branch |
| Domain | myblueprint.work | Custom domain on Vercel |
| Dev Environment | Replit | Static file server via `serve` on port 5000 |

**Deployment flow**: Edit in Replit → `git push origin main` → Vercel auto-deploys frontend + serverless functions. Firestore rules deploy separately via Firebase Console.

---

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Entire frontend app (~32,700 lines) |
| `blueprint.css` | Stylesheet |
| `firestore.rules` | Firestore security rules (deploy to Firebase Console separately) |
| `vercel.json` | Vercel deployment config (headers, rewrites, crons) |
| `docs/SECURITY_AUDIT.md` | Security audit and remediation tracker |
| `api/ai.js` | AI proxy (OpenAI) |
| `api/jobs.js` | Job search aggregator |
| `api/jobs-sync.js` | Job sync/cron endpoint |
| `api/api-job-proxy.js` | Job API proxy |
| `profiles/demo/` | 24 demo profiles (Breaking Bad, Stranger Things, Succession, The Wire) |
| `profiles/templates/` | Profile templates |
| `reports/` | Report templates (view.html, base.html) + 4 demo reports |
| `skills/` | Skills index files (index-v3.json) |
| `replit.md` | Replit agent memory file |

---

## Data Libraries

| File | Content |
|------|---------|
| `onet-skills-library.json` | O*NET skills (13,960 skills) |
| `onet-abilities-library.json` | O*NET abilities |
| `onet-knowledge-library.json` | O*NET knowledge domains |
| `onet-workstyles-library.json` | O*NET work styles |
| `onet-work-activities-library.json` | O*NET work activities |
| `trades-creative-library.json` | Trades/creative skills |
| `values-library.json` | 30 work values |
| `bls-wages.json` | BLS wage data (831 occupations) |
| `companies.json` | Company values (58 companies) |
| `certification_library.json` | 191 professional credentials |
| `onet-crosswalk.json` | O*NET crosswalk (4.6MB, loaded deferred) |

---

## Version Tracking

Version must be updated in **5 places** on every release:

1. **Line 1**: HTML comment `<!-- v4.44.42 | date | description -->`
2. **~Line 167**: CSS section comment (same format)
3. **~Line 1487**: JS block comment `// BLUEPRINT v4.44.42 - BUILD ...`
4. **~Line 1488**: `var BP_VERSION = 'v4.44.42';`
5. **~Line 2041**: Console banner build tag string
6. **`docs/SECURITY_AUDIT.md` line 2**: Version reference

---

## Network Graph System (D3.js Force Layout)

The core visualization is an interactive force-directed network graph. There are **4 network views**, all sharing the same rendering pipeline through `initNetwork()` and related functions. All profile types (demo, user, admin/showcase) use the same renderer — there is no separate code path per role.

### Network Functions (in `index.html`)

| Function | Line | Purpose |
|----------|------|---------|
| `initNetwork()` | ~12743 | **You view** — user's skills/roles graph |
| `initJobNetwork(job)` | ~13236 | **Job view** — job requirements graph |
| `initMatchNetwork(job)` | ~13389 | **Match view** — side-by-side user vs job comparison |
| `initValuesNetwork(job)` | ~13830 | **Values view** — user values vs company values alignment |
| `setNetworkMatchMode(mode)` | ~13176 | Switches between You/Job/Match/Values overlay tabs |
| `toggleNetworkLabels(type)` | ~12718 | Toggle role/skill/value label visibility |

### Mobile Layout Parameters (v4.44.42)

**You view** (with job selected):
- Name node: pinned upper-right at `width * 0.72, height * 0.22`
- Network body center: `width * 0.45`
- Role orbit radius: `130 * scaleFactor`
- Link distances: `[120, 105]` (role, skill)
- Charge strength: `[-300, -140]` (role, skill)
- Collision radii: `[55, 48, 30]` (center, role, skill)
- Gravity: x=0.08, y=0.08 toward center
- Radial spread: `0.32 * min(w,h) * scale`, strength 0.08
- Gravity center: `height * 0.46`
- Height offset accounts for: header(52) + controls(48) + bottom nav(60) + readonly banner(44) + match toggle(40)
- Boundary padding: 30px

**Job view**:
- Hub node: upper-right at `width * 0.68, height * 0.18`
- Role orbit radius: `160 * scaleFactor`
- Link distances: `[140, 120]`
- Charge: `[-400, -180] * scaleFactor`
- Gravity pulls body to `width * 0.40`, center at `height * 0.52`

**Match view**:
- Name node (You): upper-right at `width * 0.75, height * 0.12`
- Job Needs node: upper-left at `width * 0.18, height * 0.12`
- Network body center: `width * 0.50`
- Roles orbit from body center at `height * 0.45`
- User skills pull toward `width * 0.55`
- Gap skills pull toward `width * 0.25` (near job node)
- Matched skills pull to center `width * 0.50`
- Gravity center: `height * 0.52`

**Values view** (unchanged — already well-spaced):
- Left hub (Your Values): `width * 0.30`
- Right hub (Company Values): `width * 0.70`
- Value node radius: `155 * scaleFactor`

### Match Mode Toggle

Located in controls bar HTML (~line 720):
```html
<div id="matchModeToggle" class="match-mode-toggle">
    <button data-mode="you" onclick="setNetworkMatchMode('you')">You</button>
    <button data-mode="job" onclick="setNetworkMatchMode('job')">Job</button>
    <button data-mode="match" onclick="setNetworkMatchMode('match')">Match</button>
    <button data-mode="values" onclick="setNetworkMatchMode('values')">Values</button>
</div>
```
Visible only when a job is selected from the Pipeline. The inline job selector (`#inlineJobSelector`) appears alongside it.

---

## Security Hardening (Current State)

### Implemented
- **CSP** meta tag + vercel.json header
- **SRI** integrity hashes on all 7 CDN scripts
- **escapeHtml()** used on 121+ innerHTML assignments
- **Firestore rules**: role escalation prevention, auth requirements, field validation, `hasOnly()` on waitlist creates (restricting to 8 known fields)
- **HTTP headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Report templates** hardened with escapeHtml for all user-controlled data
- **Client-side rate limit**: 30-second `_wlLastSubmit` throttle on waitlist submissions

### Open Items (from `docs/SECURITY_AUDIT.md`)
- **FR4**: User field-size limits (not yet enforced)
- **M4**: Textarea injection in admin editor
- **M5**: Firebase SDK 10.7.0 → upgrade to 11.x

---

## Stability Features (v4.44.25+)

- **Save retry**: `saveToFirestore()` has 3-attempt retry with exponential backoff + localStorage backup (`bp_save_backup`)
- **Load failure**: `loadUserFromFirestore()` shows error toast + offers restore from local backup
- **Global error handlers**: `window.onerror` + `unhandledrejection` log to incident system
- **Save debouncing**: `debouncedSave()` prevents race conditions on rapid edits
- **Job search timeout**: 35s overall timeout safety net
- **Error toasts**: `showToast(msg, 'error')` on all critical operation failures
- **Null DOM guards**: on `focus()` calls inside `setTimeout`, chained `querySelector` patterns
- **Empty catch blocks**: `console.warn` added to all non-trivial operations

---

## Performance (v4.44.39+)

- **Parallel profile loading**: `Promise.allSettled()` for all 24 demo profiles (was sequential `for...await`)
- **Parallel data library loading**: All 9 JSON data files load concurrently
- **Deferred crosswalk**: `onet-crosswalk.json` (4.6MB) loaded via `_loadCrosswalkDeferred()` after initial render with `setTimeout(100)` — only needed for wizard enrichment + job scoring
- Same optimizations applied to `initShowcaseMode()`

---

## Session Changes (2026-02-25): v4.44.38 → v4.44.42

### v4.44.38 — Security Hardening
- Synced `firestore.rules` with live Firebase Console (repo was severely outdated)
- Added `hasOnly()` to waitlist create rule restricting to 8 known fields
- Added 30-second client-side rate limit on `submitWaitlist()`
- Updated `docs/SECURITY_AUDIT.md` marking FR1-FR3 fixed

### v4.44.39 — Performance
- Converted sequential profile loading to parallel `Promise.allSettled()`
- Data libraries + profiles load concurrently
- Deferred crosswalk loading (4.6MB) after initial render

### v4.44.40 — Mobile Network Layout (Initial)
- Hub/name nodes repositioned to upper-right on mobile across all 4 views
- Expanded link distances, stronger charge repulsion, larger collision radii
- Reduced boundary padding from 50-60px to 30px for full canvas use
- Gravity center pushed lower for body separation from hub

### v4.44.41 — Match View + You View Refinements
- Match view: separated name node to upper-right (was overlapping with roles)
- You view: tightened radial spread and increased centering gravity to prevent edge clipping

### v4.44.42 — Final Layout Tuning
- **Match view**: Name node pinned upper-right (`0.75, 0.12`), Job Needs node pinned upper-left (`0.18, 0.12`) — completely separated, no overlap
- **Match view**: User skills pull right, gap skills pull left toward job node, matched skills center
- **You view**: Height calculation now accounts for match mode toggle row (+40px) when job is selected
- **You view**: Tightened all mobile forces — link distances [120, 105], charge [-300, -140], collision [55, 48, 30], radial spread 0.32, gravity center at 46%
- **You view**: Role orbit radius reduced from 150 to 130 for tighter fit
- Desktop layout parameters unchanged across all iterations

---

## Git Workflow

```bash
git add -A
git commit -m "v4.44.42: description"
git push origin main
```

Vercel auto-deploys from push. Firestore rules must be deployed separately via Firebase Console.

To pull latest from GitHub into Replit:
```bash
git reset --hard origin/main
```

---

## Demo Profiles

24 fictional characters across 4 TV shows:
- **Breaking Bad** (6): Walter White, Gus Fring, Hank Schrader, Jesse Pinkman, Saul Goodman, Tuco Salamanca
- **Stranger Things** (6): Eleven, Jim Hopper, Steve Harrington, Dustin Henderson, Joyce Byers, Vecna
- **Succession** (6): Logan Roy, Kendall Roy, Siobhan Roy, Roman Roy, Tom Wambsgans, Greg Hirsch
- **The Wire** (6): Jimmy McNulty, Omar Little, Avon Barksdale, Stringer Bell, Cedric Daniels, Bubbles

All stored in `profiles/demo/` as JSON files, loaded from `profiles-manifest.json`.

---

## Key UI Components

- **Skills tab**: Network graph (D3 force layout) or Card view toggle
- **Jobs tab**: Job search + pipeline management, real-time API search
- **Blueprint tab**: Auto-generated career blueprint with AI enrichment
- **Reports tab**: PDF-exportable career reports
- **Settings tab**: Profile management, data import/export (LinkedIn ZIP)
- **Samples tab**: Demo profile browser (grouped by TV show)
- **Match overlay**: When a job is selected, You/Job/Match/Values tabs appear in the controls bar
- **Admin/Showcase mode**: Full admin panel with profile management, analytics, and system status
