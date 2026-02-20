# Blueprint — Project Context
## Last Updated: 2026-02-20 (Session 12)

---

## WHAT IS BLUEPRINT

Blueprint is a career intelligence platform that maps professional skills through interactive visualizations and generates career deliverables. Built as a single-page application (~23,300 lines) in one `index.html` file. Domain: **myblueprint.work** (primary), **getblueprint.work** (redirect/marketing).

**Core insight:** "You are not your resume." Most professionals can name 15–20 skills. Blueprint maps 150–300 using a 14,000+ skill ontology (O*NET + ESCO datasets).

---

## FILE & ARCHITECTURE

**Single file:** `/mnt/user-data/outputs/index.html` — ~23,320 lines, ~1.07MB
**No build system.** Pure HTML/CSS/JS. CDN dependencies only.

### CDN Dependencies
- Firebase 10.7.0 (Auth, Firestore)
- jsPDF 2.5.1 (PDF generation)
- D3.js 7 (network visualization)
- Google Fonts (Outfit, JetBrains Mono)

### Global State Variables
```
fbUser, fbIsAdmin, fbDb    — Firebase auth/admin/Firestore
skillsData                  — { skills: [], roles: [] }
userData                    — { profile: {}, savedJobs: [], applications: [], preferences: {} }
blueprintData               — { outcomes: [], values: [], purpose: '' }
isReadOnlyProfile           — True when viewing sample as non-admin
appMode                     — 'demo' | 'waitlisted' | 'invited' | 'active'
waitlistPosition            — Queue number (int or null)
currentView                 — Current main nav view
blueprintTab                — 'dashboard' | 'outcomes' | 'values' | 'export'
valuationMode               — 'evidence' | 'potential'
skillValuations             — Market value data (BLS-based)
```

### Navigation Structure
```
Primary Nav:  [Skills] [Jobs] [Blueprint] [Settings]
Skills:       Network graph / Card view (toggle)
Jobs:         Find Jobs (API) / Pipeline (saved) / Tracker (applications)
Blueprint:    Dashboard / Outcomes / Values / Export
Settings:     Profile / Preferences / Privacy / Data / Theme
```

### Key Functions
```
renderBlueprint()              — Main Blueprint tab renderer
renderDashboardTab()           — Dashboard command center (session 12)
generatePDF(data, targetJob)   — PDF gen (optional job for scouting reports)
showScoutingReportPicker()     — Job picker modal for scouting reports
generateScoutingReport(idx)    — Targeted PDF with match analysis
matchJobToProfile(parsed)      — 4-tier fuzzy skill matching
calculateTotalMarketValue()    — BLS-based salary model
exportBlueprint(format)        — Export dispatcher (pdf/html/json/clipboard)
switchView(view)               — Main nav router
showWaitlist()                 — Waitlist registration modal
demoGate(featureName)          — Feature gating for demo/waitlist users
detectAppMode()                — Sets appMode from auth + localStorage + Firestore
```

---

## CURRENT STATE (v4.23.0+)

### Working Features
- **Skills:** D3 force network, card view, role grouping, proficiency levels, skill modals, evidence tracking
- **Jobs:** 3 APIs (Remotive/Himalayas/Jobicy), job parsing, skill matching, pipeline, tracker
- **Blueprint Dashboard:** Stat cards (worth/skills/outcomes/values), inline purpose editor, collapsible market valuation, quick actions, best job match card, completeness tracker
- **PDF Export:** Career Intelligence Report (cover, skill architecture, network viz, proficiency charts, evidence, values, market valuation, job pipeline, back cover)
- **Scouting Report:** Targeted PDF (match overview, alignment table, gap analysis, surplus value, talking points)
- **Market Valuation:** BLS OEWS model, compa-ratio, role tiers, impact skills, evidence vs potential
- **Firebase:** Google auth, Firestore, admin roles, waitlist collection
- **Demo Mode:** 4-state funnel, feature gating, waitlist modal, admin invites, aha-moment nudge
- **SVG Icons:** ~80 custom icons, zero emoji
- **Theming:** Dark/light with CSS variables

### Session 12 Changes (Current)
1. **Blueprint Dashboard** — tabs at top (sticky), stat cards, inline purpose, collapsible valuation, quick actions, completeness tracker. Purpose no longer a separate tab.
2. **Scouting Report** — targeted PDF: pick a job → match overview (score ring), alignment table, gap analysis, surplus skills, auto-generated talking points
3. **Demo Mode Lockdown** — appMode system, demoGate(), waitlist modal (Firestore), admin panel with invite/bulk-invite
4. **PDF Fixes** — deterministic network (hashStr), roleList scoping fix

### Tech Debt
- `renderMarketValuationSection()` — old 800px valuation wall, superseded by Dashboard compact card
- `renderPurposeSection()` — still exists, redirects to dashboard
- Skill management buttons need a home (removed from Dashboard, should go to Skills tab)
- Job APIs need network access (CORS proxied)

---

## LAUNCH PLAN STATUS

| Tier | Feature | Status |
|------|---------|--------|
| 1 | Demo Profile Quality | ✅ |
| 2 | PDF Export Enhancement | ✅ |
| 3 | Demo Mode Lockdown | ✅ |
| 4 | Admin Invite Emails | ⬜ |
| 5 | Polish & Psychology | ⬜ |

### Gated Features (demo/waitlisted blocked)
searchOpportunities, showOnboardingWizard, openSkillManagement, openONETPicker, openCustomSkillBuilder

### Waitlist: Firestore `waitlist` collection + localStorage fallback. Admin: invite/bulk-invite. Auto-upgrade on load.

---

## PDF STRUCTURE

**Standard:** Cover → Skills → Network Viz → Charts → Evidence → Values → Valuation → Jobs → Back Cover

**Scouting Report:** Cover (with job) → Match Overview (score ring) → Alignment Table → Gap Analysis → Surplus Value → Talking Points → then standard pages → Back Cover. Filename: `Blueprint_Name_ScoutingReport_Company_Date.pdf`

---

## MODELS

**Valuation:** BLS base + Critical/High impact premiums + rarity bonus × location = Your Worth. Offers at 75/85/95%.

**Matching:** Exact (1.0) → Synonym (0.95) → Substring (0.85) → Word overlap (0.75×ratio). Weighted by Required×3, Preferred×2, Nice×1.

---

## 12 SESSION HISTORY

1. Nav consolidation plan
2. v4.20.0 SVG icons + nav restructure
3. v4.20.1 UX polish
4. v4.20.2 emoji cleanup + job API research
5. v4.21.0 Find Jobs (3 APIs)
6. v4.21.0 branding
7. v4.22.0 emoji→SVG (100+), mobile
8. v4.22.0 site audit (4 bugs, 439 dead lines)
9. Teaser + launch strategy + WHY_BLUEPRINT.md + LAUNCH_PLAN.md
10. PDF network viz + charts + domain branding (v4.23.0)
11. Demo mode + waitlist + scouting report + admin panel
12. Blueprint Dashboard restructure (THIS SESSION)

---

## SUPPORTING FILES (all in /mnt/user-data/outputs/)
- `index.html` — Main app (~23,320 lines)
- `teaser.html` — Landing page with animated network
- `WHY_BLUEPRINT.md` — Positioning document
- `LAUNCH_PLAN.md` — Invite-only launch spec
- `PROJECT_CONTEXT.md` — This file

---

## NEXT STEPS

**Immediate:** Test Dashboard, verify scouting report, clean dead code
**Short-term:** Sample profile audit, "Why Blueprint" modal, social proof, email notifications
**Medium-term:** Ambassador mechanic, analytics, LinkedIn sharing
**Tech debt:** Remove legacy valuation, relocate bulk buttons, code splitting at 25K lines
