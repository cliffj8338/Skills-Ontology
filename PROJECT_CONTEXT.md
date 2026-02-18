# Work Blueprint — Project Context File
For use at the start of new chat sessions to restore full context.
Last updated: February 18, 2026 — v3.6.5

---

## HOW TO START A NEW CHAT

Paste this at the top of a new conversation:

> "I'm continuing work on my Work Blueprint project. Please read the attached
> PROJECT_CONTEXT.md in full before responding — it contains everything you need
> to know about the codebase, architecture, and current state. Current version is
> v3.6.5. Today I want to [your task]."

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

## Current Version: 3.6.5 (BUILD 20260218-1700)

### Full Version History

v3.6.5 (Feb 18 2026) — Card View Dynamic Bucketing
- Replaced hardcoded keyword-matching domain logic with dynamic role-based grouping
- 3-tier strategy: (1) role-based if 50%+ coverage, (2) O*NET category fallback, (3) mixed
- Works for ALL profiles now — not just Cliff's. Sarah, Mike, any wizard-built profile
- Skills sorted within domains: key/core first, then by level (Mastery down to Novice)
- All 181 O*NET taxonomy entries scraped and built as separate library JSON files

v3.6.4 (Feb 18 2026) — Deduplication
- Removed 3,300+ lines of duplicate blueprint code accumulated from editing sessions
- File had 3 copies of WORK BLUEPRINT SYSTEM block — kept last (most complete)
- blueprintData: 3 declarations to 1. renderBlueprint(): 6 copies to 1
- File size: 15,525 to 12,032 lines

v3.6.3 (Feb 18 2026) — Apostrophe Syntax Fixes
- Apostrophes in single-quoted wizard string arguments caused SyntaxError
- Contractions replaced with full words or Unicode \u2019 in all wizard strings

v3.6.2 (Feb 18 2026) — Scope Fixes
- 23 wizard and nav functions exposed to window scope for onclick handler access
- Removed stale userName span DOM lookup (element removed in nav redesign)

v3.6.1 (Feb 18 2026) — Light Theme Inline Style Fixes
- Added tv(darkVal, lightVal) and tb(darkBg, lightBg) theme-aware color helpers
- Market valuation section: 36 hardcoded dark-mode colors replaced with tv()/tb()
- Network graph node text-shadows corrected for light background

v3.6.0 (Feb 18 2026) — Onboarding Wizard
- Full 8-step wizard: Start > Resume > Parsing > Profile > Skills > Values > Purpose > Complete
- Claude API (claude-sonnet-4-20250514, 4000 tokens) for resume parsing and purpose gen
- Entry points: More menu, auto-launch for first-time visitors, first-visit banner

v3.5.3/3.5.4 (Feb 18 2026) — Navigation Redesign + Light Theme
- 56px header, pill nav, profile avatar chip, ADMIN label removed
- Light/dark theme with CSS custom properties system
- Filter bar: contextual (Skills tab only), collapsible. Mobile: bottom tab bar

v3.5.2 (Feb 18 2026) — Foundation Audit
- Fixed inferValues(), levelColors, dynamic filter chips. Removed duplicate functions.

v3.5.1 — Fixed 0 Outcomes bug
v3.5.0 — Resume Generator working
v3.4.0 — Multi-profile architecture, skills management, market valuation

---

## File Structure (GitHub repo)

Skills-Ontology/
  index.html                        ENTIRE app (~12,100 lines, all JS inline)
  skill_valuations.json             Market value data by skill
  onet-skills-library.json          O*NET 35 skills (2.A + 2.B)
  onet-abilities-library.json       O*NET 52 abilities (1.A) — complete
  onet-workstyles-library.json      O*NET 21 work styles (1.D) — updated from 16
  onet-knowledge-library.json       O*NET 33 knowledge domains (2.C) — NEW, needs commit
  onet-work-activities-library.json O*NET 41 work activities (4.A) — NEW, needs commit
  onet-impact-ratings.json          Impact tier ratings
  values-library.json               30 corporate values
  profiles-manifest.json            Registry of all available profiles
  PROJECT_CONTEXT.md                THIS FILE
  profiles/
    demo/
      cliff-jones.json              89 skills, 100 evidence items, 42 qualifying outcomes
      sarah-chen.json               HR/Recruiting focused
      mike-rodriguez.json           Engineering lead
      jamie-martinez.json           Service industry
      alex-thompson.json            Entry level
    templates/
      blank.json                    Empty starter template
  skills/
    index-v3.json                   2,138 searchable ESCO-derived skills (Add Skills modal)

---

## Architecture — Critical Patterns

### Templates Are Source of Truth
- On load: fetch profiles-manifest.json > load all profile JSONs into templates{}
- localStorage ONLY stores: currentProfile, wbTheme, wbHasVisited
- Wizard-built profiles stored as templates['wizard-built'] for session persistence

### Key Global Objects
  userData       — active profile (see shape below)
  skillsData     — runtime {skills[], roles[], skillDetails{}}
  templates{}    — all loaded profiles keyed by templateId
  skillValuations — from skill_valuations.json
  wizardState    — onboarding wizard state machine
  blueprintData  — extracted outcomes/values/purpose. ONE declaration only. Never duplicate.

### userData Shape
  initialized, templateId,
  profile: { name, email, location, currentTitle, yearsExperience, executiveSummary, headline }
  skills: [{ name, level, category, key, onetId, roles[], evidence:[{description, outcome}] }]
  values: [{ name, description, selected }]
  purpose: string
  roles: [{ id, name, color, years, company }]
  preferences: { seniorityLevel, targetTitles[], seniorityKeywords[], excludeRoles[],
                 strategicKeywords[], targetIndustries[], minSalary,
                 locationPreferences[], minimumSkillMatches, minimumMatchScore }
  applications: []
  skillDetails: {}

### Skill Categories (O*NET-aligned)
  "skill"        — O*NET 2.A/2.B cross-functional and basic skills
  "ability"      — O*NET 1.A abilities (enduring attributes)
  "workstyle"    — O*NET 1.D work styles (personality tendencies)
  "knowledge"    — O*NET 2.C knowledge domains (NEW in v3.6.5)
  "workactivity" — O*NET 4.A work activities (NEW in v3.6.5)
  "unique"       — non-O*NET skills specific to the individual

---

## Theme System

CSS custom properties on :root (dark default) + [data-theme="light"] overrides.
Variables: --bg-base/surface/elevated/card, --border, --text-primary/secondary/muted,
  --accent, --accent-glow, --nav-bg, --chip-bg, --input-bg, --shadow, --success/warning/danger

CRITICAL RULE: All new inline style colors in JS template strings MUST use tv()/tb():
  tv(darkVal, lightVal)  — returns correct color for current theme
  tb(darkBg, lightBg)    — same, for backgrounds
  Example: `color: ${tv("#d1d5db","#334155")}`

CSS class styles go in [data-theme="light"] override block in the stylesheet.
Never write raw rgba() or hex in JS template literal styles.

Dark-to-light color mapping reference:
  #d1d5db  >  #334155 (slate-700)
  #e0e0e0  >  #1e293b (slate-800)
  #9ca3af  >  #64748b (slate-500)
  rgba(255,255,255,0.03) > rgba(0,0,0,0.03)
  rgba(96,165,250,0.2)   > rgba(37,99,235,0.12)

---

## Navigation Structure

Header (56px): [◈ Work Blueprint logo] | [Skills][Jobs][Applications][Work Blueprint] | [moon][CJ Name v][...]
Filter bar (48px, Skills only, collapsible): [Network][Card] | [search] | [Filter] > chips
Mobile: 5-tab bottom bar
More menu: Build My Work Blueprint | Settings | Export | Work Blueprint | Consent | Help | About

---

## Onboarding Wizard

Steps: Start(1) > Resume(2) > Parsing(3) > Profile(4) > Skills(5) > Values(6) > Purpose(7) > Complete(8)
Claude API: claude-sonnet-4-20250514, 4000 tokens for parsing, 300 for purpose regeneration
wizardApplyAndLaunch(built): loads profile, resets tab init flags, calls initNetwork()

---

## Card View Domain Grouping (v3.6.5)

3-tier dynamic strategy:
1. Role-based (if 50%+ skills have role assignments): groups by profile's own roles[]
   Leftover skills sub-bucket by O*NET category
2. Category fallback (under 50% role coverage): groups ALL skills by O*NET category
   Works for wizard-built profiles with empty role assignments

Sort within domains: key/core skills first, then Mastery > Expert > Advanced > Proficient > Novice

---

## Scope Pattern — CRITICAL

Functions inside DOMContentLoaded async closure are NOT reachable from HTML onclick="".
Must explicitly expose: window.functionName = functionName

Currently exposed (23+): toggleTheme, initTheme, toggleProfileDropdown, closeProfileDropdown,
showOnboardingWizard, wizardChooseUpload, wizardChooseManual, wizardChooseImport,
wizardImportProfile, wizardBack, wizardNext, wizardSetResumeTab, wizardSkipParsing,
wizardStartParsing, wizardSaveProfile, wizardSaveSkills, wizardToggleValue, wizardSaveValues,
wizardSavePurpose, wizardRegeneratePurpose, wizardDownloadAndLaunch, wizardLaunchOnly,
confirmExitWizard, toggleFilterPanel, renderFilterChips, switchView, switchProfile,
filterByRole, filterByLevel, toggleSkillsView, openSkillModal, openSkillModalFromCard,
startWithTemplate, showSettings, showHelp, showAbout

Adding any new onclick function: add window.X = X immediately after its definition.

---

## Apostrophe Rule

Contractions inside wizard string arguments (${wizardHeading('text')}) cause SyntaxError.
Use Unicode: "it\u2019s" not "it's" — or rewrite: "do not" not "don't".
Never use contractions in wizard heading/subtitle string arguments.

---

## Market Valuation

calculateTotalMarketValue() reads skill_valuations.json.
renderMarketValuationSection() — all inline colors use tv()/tb(). Never raw rgba() here.
WARNING: This function has historically accumulated duplicate copies during editing.
If you see "blueprintData already declared" error, file has duplicates — keep LAST copy.

---

## Skills Library Status

O*NET taxonomy (scraped Feb 18 2026, all taxonomies complete):
  2.A Basic Skills:          10 entries
  2.B Cross-Functional:      25 entries
  2.C Knowledge:             33 entries (NEW)
  4.A Work Activities:       41 entries (NEW)
  1.D Work Styles:           21 entries (updated from 16)
  1.A Abilities:             52 entries
  TOTAL O*NET:              182 entries

ESCO (European Skills/Competences):
  index-v3.json already has 2,138 ESCO-derived skills
  Full ESCO v1.2.1 = 13,939 skills — free download at esco.ec.europa.eu/en/use-esco/download
  Download skills_en.csv and send to Claude to merge + deduplicate into index-v3

Lightcast: 75,000+ skills — Cliff has API access pending

---

## Deduplication Warning

File has a history of accumulating duplicate code blocks during iterative editing.
Signs: file > ~13,000 lines, "blueprintData already declared" SyntaxError,
multiple copies of renderBlueprint() or renderMarketValuationSection().
Fix: grep for duplicate function definitions, keep LAST copy, delete earlier copies.

---

## Export Features

WORKING: Resume (generateResume()) | Work Blueprint HTML (generateWorkBlueprint())
STUBS: Capability Statement | LinkedIn export | Interview Prep

---

## Known Issues / Backlog

  onet-knowledge + work-activities files    HIGH    Built, need GitHub commit
  ESCO 13,939 skills integration            HIGH    Manual download needed
  No workHistory[] in profile JSONs         MEDIUM  Resume limited to current role
  Consent preset filtering                  LOW     UI only, not functional
  Capability Statement export               LOW     Stub only
  Light theme polish                        LOW     Ongoing, report with screenshots

---

## Roadmap (in order)

1. Commit new library files to GitHub (onet-knowledge, onet-work-activities, workstyles)
2. Download ESCO skills_en.csv, send to Claude, merge into index-v3 (2,138 > ~14,000)
3. Test wizard with real resume — validate Claude parsing accuracy
4. Personalized page generator — shareable URL with encoded profile for recruiter outreach
5. Email composer for recruiter outreach
6. Add workHistory[] to profile JSONs for proper resume experience section
7. Lightcast API integration when access available
8. Capability Statement export

---

## Deployment

  cp ~/Downloads/index.html ./
  cp ~/Downloads/PROJECT_CONTEXT.md ./
  cp ~/Downloads/onet-knowledge-library.json ./
  cp ~/Downloads/onet-work-activities-library.json ./
  cp ~/Downloads/onet-workstyles-library.json ./
  git add -A && git commit -m "v3.6.5" && git push

---

## Tech Stack

Vanilla JS | D3.js v7 | Anthropic API (claude-sonnet-4-20250514)
HTML5/CSS3 | GitHub Pages | Static JSON | localStorage (minimal)

---

## Key Context

Primary demo: Cliff Jones — VP Global Strategy & GM Customer Advisory at Phenom
(talent intelligence platform). FAA Certified IFR Pilot 2,000+ hours, 37-year musician,
12+ years sobriety, co-founded Kyle's Wish Foundation (aviation + mental health/addiction).
89 skills, 100 evidence items, 42 qualifying outcomes. Demo company: TalentEdge.

Five demo profiles: cliff-jones (primary), sarah-chen (HR), mike-rodriguez (engineering),
jamie-martinez (service), alex-thompson (entry level).

---

## Session History (compact)

Session 1 (Feb 18 AM): v3.5.0-3.5.4 — resume generator, outcomes fix, foundation audit,
nav redesign, light/dark theme system.

Session 2 (Feb 18 midday): v3.6.0-3.6.4 — 8-step onboarding wizard with Claude API,
light theme inline fixes (tv/tb helpers), scope errors (window.X = X for 23 functions),
apostrophe syntax errors, file deduplication (3,300 lines removed).

Session 3 (Feb 18 afternoon): v3.6.5 — card view dynamic bucketing (works for all
profiles). Full O*NET taxonomy scrape: added 2.C Knowledge (33) and 4.A Work Activities
(41), updated 1.D Work Styles (16 to 21). 5 library JSON files built and ready to commit.
Mapped path to 75K skills: ESCO free download (13,939) + Lightcast API pending.
