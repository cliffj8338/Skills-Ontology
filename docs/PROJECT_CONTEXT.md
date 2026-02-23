# Blueprint™ Scouting Report — Project Context
**Last Updated:** Feb 22, 2026 · v4.32.0.5
**Owner:** Cliff · VP Global Strategy & GM Customer Advisory, Phenom

---

## WHAT THIS IS

Blueprint is a career intelligence platform with interactive D3.js skill visualizations, job matching, and market valuations. The **Scouting Report** is a standalone, shareable HTML artifact — a candidate intelligence briefing sent to recruiters with interactive networks, verified credentials, blind mode, and match analytics.

The main app is a single-page application (~22,500 lines in `index.html` + `blueprint.css`). The scouting report is a self-contained HTML file (`scouting-report.html`, ~866 lines) that renders entirely from a `REPORT_DATA` config object.

---

## FILES

| File | Lines | Description |
|------|-------|-------------|
| `index.html` | ~22,581 | Main Blueprint app (Skills, Jobs, Pipeline, Blueprint Export, Settings tabs) |
| `blueprint.css` | ~4,123 | Main app stylesheet |
| `scouting-report.html` | ~866 | **Templated** scouting report — self-contained, config-driven |

All three files deploy to the same directory (GitHub Pages, migrating to Vercel).

---

## CURRENT STATE — WHAT'S BUILT

### Scouting Report (scouting-report.html)
- ✅ **Data Contract** — Single `REPORT_DATA` JS config object at top of file drives everything
- ✅ **Template Engine** — `initReport()` populates all HTML from config; `renderCredentials()`, `renderOutcomesHTML()`, `renderProfGrid()` handle dynamic sections
- ✅ **D3 Skills Network** — Force-directed graph with candidate skills, role clusters, drag/hover/click/evidence popups
- ✅ **D3 Match Network** — Job overlay showing matched (green), gap (red), surplus (gray) skills with dashed bridge links
- ✅ **D3 Values Network** — Dual-hub (candidate ↔ company) with aligned/yours/theirs nodes and bridge links
- ✅ **Network Mode Toggle** — "Job Match" vs "Candidate Skills" view switcher
- ✅ **Light/Dark Theme** — Full CSS variable system, D3 re-renders with theme-aware node/link/text colors
- ✅ **SVG Layer Ordering** — Links render BELOW nodes (explicit `layer-links` / `layer-nodes` groups)
- ✅ **Opaque Role Fills** — Role cluster nodes use solid fills (#e2e8f0 light / #1e293b dark) instead of transparent
- ✅ **Light Mode Contrast** — All text upgraded to #1e293b, white text-shadows, 20+ light-mode CSS overrides
- ✅ **Blind Mode** — 5 toggles (identity, location, employer, institution, outcomes), candidate-controlled architecture
- ✅ **Blind Outcomes** — Each outcome has a `blind` field in config with anonymized text
- ✅ **Verified Badge System** — Green (verified), Blue (cert), Purple (edu) with inline SVG checkmarks
- ✅ **Education & Certifications** — Two-column grid rendered from config arrays with linked skill tags
- ✅ **Gap Analysis** — Bridge narratives with adjacent skill tags
- ✅ **Competency Domains** — Bar chart showing skill distribution across clusters
- ✅ **Compensation Teaser** — Locked section with candidate-controlled release messaging
- ✅ **Comm Bar** — Shortlist buttons, Send a Note modal, Share link copy
- ✅ **Mobile Responsive** — Collapsible overlays, hidden skill labels on mobile
- ✅ **Section Nav** — Sticky nav with scroll-spy (IntersectionObserver)
- ✅ **Match Ring** — SVG donut chart computed from config percentage
- ✅ **Blind Tip Tooltip** — One-time explanatory tooltip for demo viewers

### Main App (index.html) Scouting Report Integration
- ✅ **4 CTA Entry Points** — Match Legend, Job Detail, Pipeline Cards, Blueprint Export tab
- ✅ **`showScoutingReportPicker()`** — Ranked job list by match score
- ✅ **`launchScoutingReport()`** — Shortcut alias
- ✅ **Help Overlay** — "Scouting Reports" section with 4 entry points listed, "View Sample" button
- ✅ **`openSampleScoutingReport()`** — Full-screen iframe overlay with DEMO badge, close on ✕/Escape/bg click
- ✅ **Network Layer Fixes** — All 3 main app networks use explicit link-layer/node-layer groups
- ✅ **Theme-Aware Networks** — Match + Values networks check `data-theme` for light mode fills/text

### Data Contract Schema (REPORT_DATA)
```javascript
REPORT_DATA = {
    candidate: { name, photo, title, location, contact, purpose, blindTitle },
    job: { title, company, date },
    match: { percentage, narrative },
    roles: [{ id, name, color }],
    skills: [{ n, l, r, k, ev, vf, vfLabel }],
    jobRequired: [string],
    gaps: [{ n, rq, br, adj }],
    values: { score, narrative, candidate: [{n,s}], company: [{n,t,s}] },
    outcomes: [{ text, vf, vfLabel, blind }],
    education: [{ name, desc, location, dates, vf, skills }],
    certifications: [{ name, vf, vfLabel, desc, dates, status, skills }],
    domains: [{ n, c, m, cl }],
    proficiency: { Mastery, Expert, Advanced, Proficient, Novice }
}
```

---

## REMAINING TO-DOs — NEXT SESSION

### 1. Sample Profile Data (Breaking Bad, Stranger Things, Succession)
Create `REPORT_DATA` configs for TV character profiles. Each needs:
- Candidate bio + photo emoji + purpose quote
- Target job that maps to the character's arc
- 15-25 skills with levels, evidence, role cluster assignments, verification badges
- 5-8 job-required skills with match logic
- 2-3 gap skills with bridge narratives
- 5-7 candidate values + 5-7 company values with alignment mapping
- 3-5 outcomes with blind-mode abstractions
- 2-3 education entries + 2-4 certifications
- Competency domain distribution
- Proficiency level counts

**Suggested Character × Job Pairings:**
- **Breaking Bad:** Walter White → Chief Science Officer, pharmaceutical company (or similar)
- **Stranger Things:** Jim Hopper → Director of National Security / Crisis Response
- **Succession:** Kendall Roy → CEO, media conglomerate

Each profile = a separate copy of `scouting-report.html` with different `REPORT_DATA`, OR a profile switcher in a single file. Decide approach.

### 2. Candidate Analytics Dashboard (New Tab in Main App)
Build as a new view inside Blueprint (alongside Skills, Jobs, Blueprint, Settings tabs).

**Core Sections:**
- **My Reports** — List of generated scouting reports with job title, company, match score, date, view count, status (draft/shared/expired)
- **Blind Mode Defaults** — Global 5-toggle panel, overridable per report
- **Sharing Controls** — Generate shareable link, set expiration, require email capture, toggle "Request Full Profile"
- **Analytics Dashboard** — All four metrics the user selected:
  - View count + unique viewers (line chart over time)
  - Shortlist / note actions taken by recruiters (count badges)
  - Time-on-page + section heatmap (bar chart showing which sections get attention)
  - Share link management (create, expire, revoke with status table)
- **Credential Vault** — Manage education & certifications, upload verification docs
- **Profile Completeness** — % indicator for outcomes, values, purpose, credentials

**Implementation Notes:**
- Add "Reports" or "Scouting" tab to main nav in index.html
- Dashboard content goes in a new `<div id="reportsView">` section
- Mock data for analytics (no real backend yet)
- Consistent with existing UI patterns (cards, grids, CSS variables)
- Theme-aware (respects data-theme light/dark)

### 3. Generator Bridge (Future — connects main app to scouting report)
- `generateScoutingReport(jobIdx)` in index.html already computes match data
- Needs to serialize into REPORT_DATA format and either:
  - Open scouting-report.html with config injected via URL params/postMessage
  - Generate a standalone HTML file with embedded config
  - Store in localStorage and load on the report page
- This is the bridge between "click Create Scouting Report" and "see the finished artifact"
- **Not blocking the profile data or dashboard work**

---

## ARCHITECTURE DECISIONS (LOCKED)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Blind mode access | Candidate controls from dashboard, recruiter sees output only | Candidate sovereignty / DEI positioning |
| Scouting report hosting | Self-contained HTML, no backend | Portable, shareable, works offline |
| Dashboard location | New tab inside Blueprint | Unified UX, no context-switching |
| Theme system | CSS variables + `html.light` class (SR) / `data-theme="light"` (main app) | Different files, same visual result |
| SVG rendering | Explicit layer groups (links below nodes) | Prevents line-through-circle bleed |
| Network fills | Opaque (#e2e8f0 / #1e293b) not transparent | Clean layering in both themes |

---

## PRODUCT POSITIONING

The scouting report is Blueprint's **premium artifact** — the thing candidates share with recruiters instead of a resume. It's positioned as:
- **Career intelligence briefing** (not an application)
- **Candidate-controlled** (blind mode, compensation gate, sharing controls)
- **Interactive** (D3 networks, not static PDFs)
- **Verifiable** (badge system linked to credentials)
- **Bias-reducing** (blind mode as DEI tool)

The dashboard is the **control plane** — where candidates manage their reports, set defaults, and see who's engaging with their profile.

---

## QUICK REFERENCE

**To create a new profile:** Duplicate `scouting-report.html`, replace the `REPORT_DATA` object. Everything else renders automatically.

**Key functions in scouting-report.html:**
- `initReport()` — Populates all static HTML from config
- `initYouNet()` — Renders candidate skills network
- `initSN()` — Renders job match network
- `initVN()` — Renders values alignment network
- `renderCredentials()` — Builds education + cert HTML
- `renderOutcomesHTML()` — Builds outcomes with badges
- `renderSk()` — Builds skill alignment detail list
- `renderGaps()` — Builds gap analysis cards
- `renderDom()` — Builds competency domain bars
- `applyBlind()` — Applies/removes blind mode across all sections
- `toggleTheme()` — Switches light/dark and re-renders networks

**Key functions in index.html (scouting report related):**
- `showScoutingReportPicker()` — Job selection modal for report generation
- `launchScoutingReport()` — Alias shortcut
- `openSampleScoutingReport()` — Iframe overlay for sample report preview
