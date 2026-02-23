# Blueprint™ Project Context
**Version:** v4.37.8.0 | **Date:** February 23, 2026 | **Owner:** Cliff Jurkiewicz

---

## What Blueprint Is

Blueprint™ is a career intelligence platform that maps professional skills through interactive D3.js visualizations, generates market valuations, and produces scouting reports for job matching. It's a single-page application (~24,500 lines in `index.html`) with companion report files.

**Live URL:** `myblueprint.work` (Vercel — production, custom domain active)
**Vercel URL:** `blueprint-ecru.vercel.app` (auto-deploy from GitHub)
**Legacy URL:** `cliffj8338.github.io/blueprint/` (GitHub Pages — still active)
**GitHub Repo:** `cliffj8338/blueprint`

---

## File Architecture

```
blueprint/
├── index.html              # Main SPA (~24,500 lines) — everything lives here
├── blueprint.css            # Supplemental styles
├── vercel.json              # Vercel config: security headers, rewrites, caching
├── firestore.rules          # Hardened Firestore security rules (deployed to console)
├── favicon.ico              # Constellation network favicon (16x16, 32x32)
├── favicon.svg              # SVG favicon
├── apple-touch-icon.png     # iOS bookmark icon (180x180)
├── profiles/
│   ├── demo/                # 24 TV character JSON profiles
│   │   ├── breaking-bad/    # Walter, Jesse, Gus, Hank, Saul, Mike
│   │   ├── stranger-things/ # Hopper, Eleven, Joyce, Dustin, Steve, Murray
│   │   ├── succession/      # Kendall, Shiv, Roman, Logan, Tom, Gerri
│   │   └── game-of-thrones/ # Tyrion, Cersei, Daenerys, Varys, Littlefinger, Brienne
│   └── templates/           # Profile templates (lowercase — case-sensitive on Vercel)
│       └── blank.json       # Empty template for new profiles
└── reports/
    ├── README.md            # Architecture docs + sharding strategy
    ├── view.html            # Public viewer page (Firestore-backed share links)
    ├── templates/
    │   └── base.html        # Self-hydrating scouting report template (~878 lines)
    ├── demos/               # 4 pre-built TV character HTML scouting reports
    │   ├── tyrion-lannister.html
    │   ├── walter-white.html
    │   ├── jim-hopper.html
    │   └── kendall-roy.html
    └── u/                   # User reports (future sharding — 256 hex buckets)
```

---

## Tech Stack

- **Frontend:** Vanilla JS, no framework. Single `index.html` SPA.
- **Visualizations:** D3.js v7.9.0 (pinned, force-directed networks, proficiency charts)
- **PDF Generation:** jsPDF (client-side, no server)
- **Backend:** Firebase (Auth + Firestore)
- **AI Features:** Anthropic API (client-side, user-supplied key) — resume parsing, purpose generation, job description parsing
- **Fonts:** Outfit (Google Fonts)
- **Skills Data:** 14,000+ skills from O*NET and ESCO datasets
- **Hosting:** Vercel (production), GitHub Pages (legacy, still active from same repo)
- **DNS:** Cloudflare (active, nameservers: devin.ns.cloudflare.com / mariah.ns.cloudflare.com)
- **Domain:** myblueprint.work (registered at Network Solutions, DNS via Cloudflare)

---

## Deployment Configuration

### Vercel
- **Project:** blueprint-ecru.vercel.app (auto-imported from GitHub)
- **Framework:** none (static site, no build step)
- **Auto-deploy:** Every `git push` to `main` triggers deploy (15-30 seconds)
- **Custom domains:** myblueprint.work (apex), www.myblueprint.work (redirects to apex via 307)
- **Security headers:** X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Report viewer:** `X-Frame-Options: DENY`, `Cache-Control: no-store`
- **Caching:** Profile JSONs: 24h. JS files: immutable.
- **Rewrite:** `/report/:id` → `/reports/view.html`

### Cloudflare DNS (Active)
| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | @ | 216.198.79.1 | DNS only |
| CNAME | www | 71e147702f81e1bf.vercel-dns-017.com | DNS only |

- SSL/TLS: Full (strict)
- Status: **Active** — all domains show "Valid Configuration" in Vercel

### Firebase
```
Project: work-blueprint
Auth Domain: work-blueprint.firebaseapp.com
Plan: Spark (free)
Admin UID: 8vYo5jtdj6RnxIqoT2wWOBfSBgU2 (cliffj8338@gmail.com)
Admin role: Set manually in Firestore console (users/{uid}.role = "admin")
Authorized domains: myblueprint.work, www.myblueprint.work, cliffj8338.github.io
```

---

## Firestore Schema

**`users/{uid}`** — User profile, skills, saved jobs, blueprint data
**`users/{uid}/verifications/{docId}`** — Skill verification records
**`waitlist/{docId}`** — Waitlist submissions (doc ID = sanitized email)
  - `name`, `email`, `type`, `status` ("waiting"/"invited"), `position`, `source`, `createdAt`
**`reports/{reportId}`** — Shared scouting reports
  - `reportData`, `candidateName`, `jobTitle`, `company`, `matchScore`, `createdBy`, `viewCount`
**`report_views/{viewId}`** — View analytics (append-only)
**`analytics_events/{eventId}`** — Usage analytics (append-only)

### Firestore Rules (Deployed)

**IMPORTANT:** Rules must be deployed via Firebase Console → Firestore → Rules tab (paste and publish). They do NOT auto-deploy from the repo file.

Key properties:
- `isAdmin()`: cross-doc lookup (`users/{uid}.role == 'admin'`)
- Users: owner read/write + admin read. **Role field write-blocked**
- Waitlist: **public create** (write-only) with validation, admin-only read/update/delete
- Reports: authenticated create, public read
- Report views / analytics: public create, authenticated read, append-only

---

## PDF Scouting Report (v4.36.5.0)

### Pages
1. **Cover** — Hero (photo, name, title, contact), match ring, target role card, narrative, purpose quote, **Top Capabilities** grid (15 skills, 3-column), **Competency Distribution** horizontal bars
2. **Job Match Network** — Force-relaxed graph: center=job, role hubs, skill nodes (green=matched, red=gap, grey=surplus), all labeled
3. **Candidate Skills Network** — Force-relaxed graph: role hubs, skill nodes colored by proficiency, all labeled
4. **Education & Certifications + Professional Experience**
5. **Values & Cultural Alignment** — Structured two-column layout with connecting lines
6. **Skill Alignment Detail** — Full skill list with proficiency levels and REQUIRED badges
7. **Gap Analysis + Outcomes** — Gap cards with bridge narratives, achievement cards (auto-sizing, no truncation)
8. **Competency Domains + Compensation + Recommendation**
9. **Back Page** — Blueprint branding, report metadata

### Technical Notes
- **Emoji restriction:** jsPDF + Helvetica cannot render emoji. All PDF text uses plain ASCII/Latin characters only.
- **Network graphs:** D3 force simulation rendered to offscreen `<canvas>` (3600×3200px), embedded as JPEG via `doc.addImage()`. Role hubs pinned at fixed positions; only skill nodes float.
- **Match color inference:** Three-tier fallback: `sk.k` flag → `R.jobRequired` name match → inferred from `matchPct` + `gaps.length` (sorts skills by proficiency, marks top N as matched).
- **Narrative/outcome rendering:** Explicit per-line loops with auto-sizing boxes. No truncation or line caps.
- **Role/evidence normalization:** `buildReportData()` auto-converts `skill.role` (string) → `skill.roles` (array) and evidence strings → `{outcome, description}` objects.
- **Level map:** Mastery, Expert, Advanced, Proficient, Competent (→ Proficient styling), Novice.

---

## Waitlist Flow

- **Submit:** Write-only to Firestore (no collection read — avoids permission errors for unauthenticated users)
- **Doc ID:** Sanitized email (e.g., `cliff_kyleswish_com`)
- **Admin view:** Admin Dashboard → Waitlist tab (requires `role: "admin"`)
- **Invite:** Admin clicks Invite → status changes to "invited"
- **Position:** Timestamp-based (admin sees real order via `createdAt`)
- **No confirmation email yet.** Options: Firebase Cloud Functions (Blaze plan) or EmailJS/Formspree webhook.

---

## Security Posture (v4.36.0.0)

### Completed
- XSS mitigation (`escapeHtml()` on all admin panels)
- Privilege escalation blocked (role field write-blocked client + server)
- AI call headers fixed (Anthropic API key gate + required headers)
- Report data injection hardened (`encodeURIComponent`)
- JSON parse safety (`safeParse()`)
- External links hardened (`rel="noopener noreferrer"`)
- Sign-out cleanup (clears sensitive localStorage)
- D3.js pinned to v7.9.0

### Phase 2 (Pending)
- CSP meta tag, SRI hashes, console.log cleanup, input length limits, Firebase App Check, rate limiting

---

## Demo Profile JSON Structure

```javascript
{
  "profile": { "name", "currentTitle", "location", "email", "phone", "linkedinUrl" },
  "roles": [{ "id": "role-id", "name": "Role Name", "color": "#hex" }],
  "skills": [{
    "name": "Skill", "level": "Expert", "category": "skill",
    "key": true,
    "roles": ["role-id"],           // MUST be array of role IDs
    "evidence": [{ "outcome": "...", "description": "..." }]  // MUST be objects
  }],
  "values": [{ "name": "Value Name", "selected": true }],
  "purpose": "...",
  "workHistory": [{ "title", "company", "dates" }],
  "education": [...],
  "certifications": [...],
  "savedJobs": [...]
}
```

**Critical:** `roles` must be array of IDs (not string), `evidence` must be objects (not strings). Code has fallbacks but proper format prevents match failures.

---

## REPORT_DATA Object Structure

```javascript
{
  candidate: { name, photo, title, location, contact, phone, linkedin, purpose, blindTitle },
  workHistory: [{ title, company, dates, description }],
  job: { title, company, date },
  match: { percentage, narrative },
  roles: [{ id, name, color }],
  skills: [{ n, l, r[], k?, ev?, vf?, vfLabel? }],
  jobRequired: ['skill names'],
  gaps: [{ n, rq, br, adj[] }],
  values: { score, narrative, candidate: [{ n, s }], company: [{ n, t, s }] },
  outcomes: [{ text, blind }],
  education: [...], certifications: [...],
  domains: [{ n, c, m, cl }],
  proficiency: { Mastery, Expert, Advanced, Proficient, Novice }
}
```

---

## Version History (Recent)

| Version | Date | Changes |
|---------|------|---------|
| v4.37.8.0 | 2026-02-23 | Preview disclosure, report mismatch banner, feedback function (mailto), overflow menu button |
| v4.37.7.0 | 2026-02-23 | Fix stale jobs: sync skillsData before sample job injection in loadTemplate |
| v4.37.6.0 | 2026-02-23 | Waitlist copy: 150-300→30-60 skills, reframe around agency |
| v4.37.5.0 | 2026-02-23 | Remove explicit 14,000 skill count from user-facing copy |
| v4.37.4.0 | 2026-02-23 | Welcome tour: 16→7 steps aligned to teaser pillars (skills, jobs, values, reports, valuation, purpose) |
| v4.37.3.0 | 2026-02-23 | Gate help tour behind teaser modal dismissal |
| v4.37.2.0 | 2026-02-23 | First-visit teaser modal: manifesto + feature cards + waitlist CTA + LinkedIn backstory |
| v4.37.1.0 | 2026-02-23 | Demo mode toggle: isolated data contexts with snapshot/restore, write guards |
| v4.37.0.0 | 2026-02-23 | Demo: restore HTML/PDF format picker, redirect to sample report viewer with overlay |
| v4.36.9.0 | 2026-02-22 | PDF: inferred match coloring from matchPct for stale job data |
| v4.36.8.0 | 2026-02-22 | PDF: pinned hub layout, jobRequired match fallback, max spread |
| v4.36.7.0 | 2026-02-22 | PDF: spread-out D3 graphs, JPEG compression, verified badge fix |
| v4.36.6.0 | 2026-02-22 | PDF: D3 canvas-rendered network graphs, match % badge |
| v4.36.5.0 | 2026-02-22 | PDF: force-relaxed network graphs, page 1 skills snapshot + competency bars |
| v4.36.4.0 | 2026-02-22 | Waitlist write-only fix, FOMO counter disabled, invite check gated |
| v4.36.3.0 | 2026-02-22 | PDF: emoji removal, network graph rewrite with labeled nodes |
| v4.36.2.0 | 2026-02-22 | PDF: narrative/outcome truncation fix, role mapping resilience, Competent level |
| v4.36.1.0 | 2026-02-22 | PDF: contact info, work history, recommendation section |
| v4.36.0.0 | 2026-02-22 | Security hardening: XSS, role escalation, Firestore rules, AI headers |
| v4.35.2.0 | 2026-02-22 | PDF scouting report: exact HTML replica layout |
| v4.35.1.0 | 2026-02-22 | Values network alignment fix |
| v4.35.0.0 | 2026-02-22 | Scouting Report PDF redesign: dark theme |
| v4.34.2.0 | 2026-02-22 | Context-aware help overlays + guided tour |
| v4.34.1.0 | 2026-02-22 | Demo lockdown: 10 export functions guarded |
| v4.34.0.0 | 2026-02-22 | Firestore share links, public viewer, view tracking |

---

## TO-DO LIST (Prioritized)

### Ready Now
1. Re-run Tyrion job match (saved job predates JSON fix — shows "0 matched")
2. Test all 4 demo PDFs with v4.36.5.0
3. Verify myblueprint.work in Firebase Auth → Authorized domains

### Short-Term
4. Live analytics on Reports dashboard
5. My Reports list with view counts
6. Recruiter actions on view.html
7. Waitlist confirmation email

### Demo/Marketing
8. Bulk-generate all 24 character scouting reports
9. Teaser campaign prep

### Security Phase 2
10. CSP, SRI hashes, console cleanup, input limits, App Check

### Medium-Term
11. Blind mode persistence, report expiration, delete account cleanup

### Future
12. Real-time collaboration, report templates, API integration

---

## Important Notes

- **Version bumping:** ALWAYS bump on every deployment, even non-index changes.
- **Vercel auto-deploys:** Every `git push` to `main` goes live in 15-30 seconds.
- **Case sensitivity:** Vercel = Linux. `templates/` ≠ `Templates/`.
- **Firestore rules:** Must be pasted into Firebase Console. Does NOT deploy from repo.
- **Admin role:** Set via Firebase Console only. Client code cannot write role field.
- **Demo lockdown:** Sample profiles show HTML/PDF format picker but both redirect to sample report viewer (4 pre-built HTML reports). Sample profiles remain read-only even after user signs in. Admin (`fbIsAdmin`) bypasses all restrictions.

### Demo Mode Toggle Architecture
Signed-in users can toggle between their real profile and demo exploration. Data isolation is enforced at three levels:

**State isolation (`appContext`):**
- `enterDemoMode()` deep-clones `userData`, `skillsData`, and `blueprintData` into snapshots
- Demo loads via existing `loadTemplate()` infrastructure
- `exitDemoMode()` restores all three objects from snapshots
- `appContext.mode` tracks current state: `'live'` or `'demo'`

**Write guards (belt-and-suspenders):**
- `saveToFirestore()`: blocked by `appContext.mode === 'demo'` AND by templateId guard
- `saveUserData()`: blocked by `appContext.mode === 'demo'` (won't overwrite localStorage profile preference)
- `switchProfile()`: routes to `switchDemoProfile()` when in demo mode

**UI:**
- Demo toggle button in header (visible only when signed in)
- Amber "DEMO MODE" indicator with pulsing dot and exit button
- Profile switcher works normally in demo mode (switches between sample profiles)
- **Two PDF generators:** `generateScoutingReportPDF(R)` for scouting reports, `generatePDF(data, targetJob)` for general exports.
- **Network egress disabled** in Claude environment — no npm/pip/web fetches.

---

## Version Control Rules (MANDATORY)

**Every file change requires a version bump in `index.html`.** This is non-negotiable.

### When to bump
- ANY change to `index.html` (code, CSS, copy, comments — anything)
- ANY change to other repo files (`blueprint.css`, `vercel.json`, `firestore.rules`, profile JSONs, report templates, etc.)
- ANY new file added to the repo
- Even if `index.html` has zero functional changes, the version must still be bumped to track the release

### What to update (all four locations)
1. **HTML comment** (line ~7): `<!-- v4.X.Y.Z | YYYYMMDD | description -->`
2. **JS boot constant** (line ~963): `var BP_VERSION = 'v4.X.Y.Z';`
3. The console banner and About modal read from `BP_VERSION` automatically

### Version format: `v4.MAJOR.MINOR.PATCH`
- **MAJOR** — new feature area or breaking change (e.g., PDF scouting report, Firestore integration)
- **MINOR** — feature iteration or significant fix within a major area
- **PATCH** — bug fixes, tweaks, polish (usually 0 for fresh minor bumps)

### Why this matters
Cliff tracks every deployment by version number. Vercel auto-deploys on push, so the version is the only reliable way to confirm which code is live, reproduce issues, and communicate changes. Skipping a version bump breaks the audit trail.
