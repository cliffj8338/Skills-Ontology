# Work Blueprint — Project Context File
For use at the start of new chat sessions to restore full context.
Last updated: February 18, 2026 — v3.9.3

---

## HOW TO START A NEW CHAT

Paste this at the top of a new conversation:

> "I'm continuing work on my Work Blueprint project. Please read the attached
> PROJECT_CONTEXT.md in full before responding — it contains everything you need
> to know about the codebase, architecture, and current state. Current version is
> v3.9.3. Today I want to [your task]."

Attach: PROJECT_CONTEXT.md + index.html (current version from outputs)
Optional: screenshots of bugs you want fixed

Do NOT summarize the project verbally — the file does that. Just state the task.

---

## What This Project Is

Work Blueprint is a browser-based career intelligence platform that helps job seekers
fully represent themselves — skills, evidence, outcomes, market value — and use that
data to negotiate for meaningful work. Runs entirely in the browser (no server, no
database). Deployed to GitHub Pages.

Core Philosophy: Most job seekers underrepresent themselves. This tool fixes that by
making evidence, value, and achievement visible and actionable.

Live URL: https://cliffj8338.github.io/Skills-Ontology/
GitHub Repo: https://github.com/cliffj8338/Skills-Ontology

---

## Current Version: 3.9.0 (BUILD 20260218-2330)

---

## Full Version History (this session Feb 18, 2026)

v3.9.0 — Toast Notifications + Alert Cleanup + Export Overhaul + Quick Fixes
- Added toast notification system (showToast/dismissToast) with 4 types: success, error, info, warning
- Replaced all 43 alert() calls with contextual toast notifications
- Toast CSS: dark/light theme aware, mobile responsive, auto-dismiss with manual close
- Export tab redesigned: 5-card layout (Executive Blueprint, Resume, PDF, Clipboard, JSON)
- Executive Blueprint (HTML) now featured as primary export with prominent card
- Professional Resume surfaced directly in export tab (was hidden in modal only)
- PDF generator rebuilt: section headings with blue rules, 2-column skills, market positioning, page footers
- New copyBlueprintText() generates clean text summary for email/clipboard
- JSON export now includes full skills+roles data for backup/portability
- Removed broken base64 shareable link (replaced by clipboard copy)
- Fixed search placeholder: "2,138+" updated to "13,960+" reflecting ESCO v1.2.1 count
- Added ESCO + O*NET attribution footer (required by ESCO license)
- Window exposure: generateWorkBlueprint, generateResume, exportBlueprint, copyBlueprintText

v3.8.2 — Trades Button Full Render
- Clicking Trades button renders all 64 trade skills directly (no search term needed)
- Each card color-coded by subcategory (amber=woodworking, teal=electrical, purple=painting, etc.)
- Fixed renderAddSkillsResults reference error — replaced with inline renderer
- searchAddSkillsByCategory handles Trades as special case; all others via text search

v3.8.1 — Trades Button Added
- Added Trades button to Browse by Category row in Add Skills tab

v3.8.0 — ESCO v1.2.1 Full Integration
- Replaced skills/index-v3.json (2,138 skills) with full ESCO v1.2.1 (13,960 skills)
- Categories: Skills 8,161 / Knowledge 3,073 / Transversal 2,717 / Language 9
- Sorted: transversal/cross-sector first for relevance
- Definitions for ~4,200 cross-sector + transversal skills only (keeps file lean)
- File: 2.31MB uncompressed, ~600KB gzip served by GitHub Pages
- Combined count now ~14,200 (ESCO + O*NET + Trades all summed dynamically)
- REQUIRED TODO: Add ESCO attribution to app footer:
  "This service uses the ESCO classification of the European Commission."

v3.7.3 — Blueprint Tab Syntax Fix
- Fixed SyntaxError: missing ) after argument list at line 7341
- Root cause: Python string escaping mangled querySelector with nested quotes
- Fix: replaced querySelector with forEach + indexOf (quote-safe)
- Skills page was completely blank after v3.7.2; this restores it

v3.7.2 — Blueprint Sub-Nav + Trade Skills Category
- Work Blueprint now has horizontal sub-nav: Outcomes | Values | Purpose | Export
- Replaces single infinite-scroll page with tabbed sections
- Tab badges show live counts
- Market Valuation section stays pinned above tabs
- Trade Skills added as first-class category (category: 'trades')
- Category filter shows "Trade Skills (N)" when profile has trades

v3.7.1 — Unified Multi-Library Search
- searchAllLibraries(query) queries all 7 libraries simultaneously
- Results normalized, deduplicated by name, capped at 30
- addSkillFromLibrary(skillId) tries all libraries in sequence
- Fixed: searching "carpentry", "welding", etc. now returns results

v3.7.0 — Dynamic Counts + Trades Library + Category Filter
- getTotalAvailableSkillCount() — single source of truth, sums all libraries at runtime
- trades-creative-library.json — 64 skills, 9 categories, adjacencies documented
- Dynamic category filter — built from actual profile data, hides empty categories

v3.6.9 — Mobile Responsive Fixes
- Card view: single column on mobile
- Modals: slide up from bottom on mobile
- O*NET tab bar: horizontal scroll

v3.6.8 — Accurate Skill Counts (dynamic, not hardcoded)
v3.6.7 — Blocking Error Fix (graceful fallback for missing JSON)
v3.6.6 — O*NET Library UI (5-tab browser in Manage Skills modal)
v3.6.5 — Card View Dynamic Domain Bucketing (role-based grouping)
v3.6.4 — Deduplication (3,493 lines removed, 15,525 -> 12,032)
v3.6.3 — Apostrophe syntax fixes (Unicode \u2019)
v3.6.2 — JavaScript scope errors (23 functions exposed to window)
v3.6.1 — Light theme inline style fixes (tv()/tb() helpers)
v3.6.0 — 8-step onboarding wizard with Claude API
v3.5.x — Resume generator, light/dark theme, mobile nav, foundation audit

---

## Repository File Structure

    Skills-Ontology/
    index.html                          <- MAIN APP (~12,530 lines, single file)
    skills/
        index-v3.json                   <- ESCO v1.2.1 (13,960 skills, 2.31MB) UPDATED
    trades-creative-library.json        <- 64 trades/creative skills with adjacencies
    onet-skills-library.json            <- O*NET 35 skills (2.A + 2.B)
    onet-abilities-library.json         <- O*NET 52 abilities (1.A)
    onet-workstyles-library.json        <- O*NET 21 work styles (1.D)
    onet-knowledge-library.json         <- O*NET 33 knowledge domains (2.C)
    onet-work-activities-library.json   <- O*NET 41 work activities (4.A)
    skill_evidence.json                 <- Evidence for Cliff's skills
    skill_valuations.json               <- Market valuation data
    PROJECT_CONTEXT.md                  <- This file

---

## Architecture

### Single-File App
Everything in index.html. No build system, no npm. GitHub Pages serves directly.
This is intentional — zero-friction deployment.

### Key Global Variables
    userData              // Current user profile (skills, values, purpose, etc.)
    skillsData            // Loaded from demo profiles or localStorage
    skillLibraryIndex     // ESCO search index {n, c, sc, id, d?} — 13,960 entries
    window.onetSkillsLibrary
    window.onetAbilitiesLibrary
    window.onetWorkStylesLibrary
    window.onetKnowledgeLibrary
    window.onetWorkActivitiesLibrary
    window.tradesCreativeLibrary   // 64 trades/creative skills
    blueprintData         // {outcomes: [], values: [], purpose: ""}
    blueprintTab          // Active tab: outcomes|values|purpose|export
    skillValuations       // Market valuation data

### Theme System
CSS variables for colors — never hardcode in JS template strings.
tv(darkVal, lightVal) — inline dark/light color values
tb(darkBg, lightBg)  — inline background values
ALL inline styles in JS template literals must use these helpers.

### Critical Coding Rules
1. Never use backtick template literals inside other template literals
2. All onclick handlers need window.functionName = functionName exposure
3. Apostrophes in strings: use \u2019 not single quote inside JS strings
4. No em/en dashes — rephrase or use commas
5. No alert() — use showToast(message, type, duration) instead
6. CSS selectors with quotes: use forEach + indexOf, not querySelector with nested quotes
7. Mobile first: test at 390px, modals anchor bottom on mobile

---

## Skill Object Shape

    {
      name: "Strategic Thinking",
      level: "Mastery",          // Mastery/Expert/Advanced/Proficient/Novice
      category: "skill",         // skill/ability/workstyle/knowledge/workactivity/trades/unique
      roles: ["strategy", "..."],
      key: true,
      evidence: [{ description: "...", outcome: "..." }]
    }

## Skill Categories

    skill        Skills           Map emoji   ESCO/O*NET
    ability      Abilities        Lightning   O*NET 1.A
    workstyle    Work Styles      Compass     O*NET 1.D
    knowledge    Knowledge        Books       O*NET 2.C
    workactivity Work Activities  Gear        O*NET 4.A
    trades       Trade Skills     Hammer      trades-creative-library.json
    unique       Custom Skills    Star        User-created

---

## Key Functions

### Search & Library
    searchAllLibraries(query)        // All 7 libraries, normalized results, 30 cap
    addSkillFromLibrary(skillId)     // Finds across all libraries, adds to profile
    searchAddSkillsByCategory(cat)   // Trades = special full-list render; others = text search
    getTotalAvailableSkillCount()    // Dynamic sum of all loaded library counts
    populateCategoryFilter()         // Builds dropdown from actual profile data

### Blueprint Page
    initBlueprint()                  // Entry: extract outcomes, infer values, render
    renderBlueprint()                // Container + market val + sub-nav + tab content
    switchBlueprintTab(tab)          // Swaps content only, no full re-render
    renderBlueprintTabContent()      // Returns HTML for current blueprintTab
    extractOutcomesFromEvidence()    // Builds blueprintData.outcomes
    inferValues()                    // Populates blueprintData.values

### Values System
    VALUES_CATALOG                      // 25 values in 5 groups with keyword arrays
    saveValues() / loadSavedValues()    // localStorage persistence
    getEvidenceForValue(valueName)      // Keyword scan, returns up to 3 matches
    getKeywordsForValue(name)           // Looks up catalog keywords or generates stems
    scoreValueByEvidence(valueDef)      // Scores a catalog value against evidence corpus
    inferValues()                       // localStorage > profile > auto-select top 5 by evidence score
    renderValuesSection()               // Delegates to picker or selected view
    renderSelectedValues()              // Cards with reorder, remove, evidence badges
    renderValuesPicker()                // Grouped pill buttons, evidence dots, done button
    pickValue(name) / removeSelectedValue(idx) / moveValue(idx, dir)
    addCustomValue()                    // Custom name, dedup, saves
    toggleValuesPicker()                // Switches between picker and review views
    refreshValuesUI() / updateValuesBadge()

### Export & Sharing
    renderExportSection()               // 5-card export hub in Blueprint tab
    generateWorkBlueprint()             // Full HTML Executive Blueprint download
    generateResume()                    // Traditional resume HTML download
    generatePDF(data)                   // Improved jsPDF summary (sections, 2-col skills, market val)
    exportBlueprint(format)             // Handles 'pdf' and 'json' formats
    copyBlueprintText()                 // Plain text to clipboard for email pasting

### Toast Notifications
    showToast(message, type, duration)  // type: success|error|info|warning; duration default 4000ms
    dismissToast(id)                    // Programmatic dismiss

### Theme Helpers
    tv(darkVal, lightVal)   // Returns correct value for current theme
    tb(darkBg, lightBg)     // Returns correct background for current theme

---

## Manage Skills Modal

Tab 1: Your Skills (N)
- Search, filter by category (dynamic), filter by level
- Grouped by domain, Remove buttons

Tab 2: Add Skills (N)
- Search 13,960+ ESCO + O*NET + Trades
- Category buttons: Technology | Business | Finance | Marketing | Creative | Leadership | Trades
- O*NET browser: 5 tabs (Skills / Abilities / Work Styles / Knowledge / Work Activities)

---

## Work Blueprint Page

Horizontal sub-nav below Market Valuation:
  Outcomes (N)  |  Values (N selected)  |  Purpose  |  Export

### Export Tab (v3.9.0+)
5-card layout:
- Executive Blueprint (HTML) — featured, full standalone document with editorial design
- Professional Resume (HTML) — traditional format, print to PDF
- PDF Summary — jsPDF with section headings, 2-column skills, market positioning
- Copy to Clipboard — plain text for email pasting
- JSON Data — full profile backup including skills, roles, outcomes, values

---

## Trades Library Summary

64 skills, 9 categories, each with adjacencies array:
Woodworking & Construction (9) — amber #d97706
Electrical/Plumbing/Mechanical (9) — teal #0891b2
Painting & Finishing (6) — purple #7c3aed
Culinary Arts (6) — red #dc2626
Visual Arts (12) — pink #db2777
Fiber & Textile (5) — green #059669
Performing Arts (5) — orange #ea580c
Outdoor & Agriculture (5) — green #16a34a
Technology & Making (7) — blue #2563eb

Rationale: Trades skills signal spatial reasoning, precision, project management.
Most ATS systems ignore them — strategic differentiation.

---

## Lightcast API Integration (When Ready)

Adding Lightcast (~75,000 skills) requires exactly:
1. Add search block to searchAllLibraries() — one function
2. Add lookup block to addSkillFromLibrary() — one block
3. Count auto-updates via getTotalAvailableSkillCount() — automatic

---

## Known Working State (v3.9.3)

Skills network view, card view (mobile responsive) — working
Manage Skills modal, both tabs, all search — working
Add Skills: 7 libraries searched simultaneously — working
Category browse buttons including Trades — working
O*NET library browser (5 tabs) — working
ESCO 13,960 skills loaded and searchable — working
Dynamic skill count summing all libraries — working
Dynamic category filter from profile data — working
Work Blueprint horizontal sub-nav tabs — working
Market Valuation section above tabs — working
Light/dark theme full coverage — working
Toast notification system (4 types, themed, mobile) — working
Values: add/edit/delete/reorder/evidence-link with localStorage persistence — working
ESCO/O*NET attribution footer — working
Onboarding wizard (8 steps, Claude API) — working
Mobile layout: card view, bottom-anchored modals — working

---

## Pending / Next Steps

HIGH PRIORITY:
- ESCO attribution in footer (required by license)
- Search placeholder still says "2,138+" (stale copy, update to "13,960+")
- Blueprint tab count badges: static on render, don't update if outcomes added mid-session

MEDIUM PRIORITY:
- Export functionality (PDF/JSON buttons exist but need testing)
- Profile switching cleanup (demo vs user data can confuse)
- Lightcast API when access available

LOWER PRIORITY:
- Companies tab (watchlist, news, job matching)
- Interview prep module
- Enhanced job matching (semantic similarity)
- Timeline / career arc visualization

---

## Cliff's Profile Context

Cliff Jones — VP Global Strategy & GM Customer Advisory at Phenom.
89 skills across 7 roles. 37 years professional musician. FAA IFR Pilot 2000+ hours.
Co-founder Kyle's Wish Foundation. 12+ years sobriety. Job searching Feb 2026.

Writing rules:
- No em/en dashes (rephrase or use commas)
- Never use "the uncomfortable truth"
- Never use "talent wars"
- No superlatives, no borrowed authority
- Precise verbs, no inflation
- Terse = efficiency, not dissatisfaction
- Newsletter: SHORT and PUNCHY, 10-second read, hook to click

---

## Development Conventions

Version format: v[major].[minor].[patch] — BUILD YYYYMMDD-HHMM
Bump version in HTML comment block on every meaningful change
Cache busting: update cacheBuster const in loadSkillLibraryIndex() for new JSON deploys
Deploy: push to GitHub, Pages auto-deploys in ~60 seconds
No console.log spam — remove debug logs before shipping

---

END OF PROJECT CONTEXT — v3.9.3
