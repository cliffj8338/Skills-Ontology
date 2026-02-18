# Work Blueprint — Project Context File
For use at the start of new chat sessions to restore full context.
Last updated: February 18, 2026 — v3.6.4

---

## What This Project Is

Work Blueprint is a browser-based career intelligence platform that helps job seekers fully
represent themselves — skills, evidence, outcomes, market value — and use that data to
negotiate for meaningful work with confidence. Runs entirely in the browser (no server,
no database), deployed to GitHub Pages.

Core Philosophy: Most job seekers underrepresent themselves. This tool fixes that by making
evidence, value, and achievement visible and actionable.

Live URL: https://cliffj8338.github.io/Skills-Ontology/
GitHub Repo: https://github.com/cliffj8338/Skills-Ontology

---

## Current Version: 3.6.4 (BUILD 20260218-1600)

### v3.6.4 Changes (Feb 18 2026) — Deduplication
- Removed 3,300+ lines of duplicate blueprint system code accumulated from editing sessions
- File had 3 full copies of WORK BLUEPRINT SYSTEM block — kept last (most complete)
- blueprintData went from 3 declarations to 1, renderBlueprint() from 6 copies to 1
- File size: 12,032 lines (was 15,525 with duplicates)

### v3.6.3 Changes (Feb 18 2026) — Syntax Fixes
- Fixed apostrophes in single-quoted wizard string arguments breaking JS parse
- Exposed all 23 wizard and nav functions to window scope for onclick handler access

### v3.6.2 Changes (Feb 18 2026) — Scope Fixes
- Removed userName span DOM lookup (element removed in nav redesign)
- All nav/wizard functions exposed to window scope via window.X = X pattern

### v3.6.1 Changes (Feb 18 2026) — Light Theme Fixes
- Added tv(darkVal, lightVal) and tb(darkBg, lightBg) theme-aware helpers
- Market valuation section: 36 hardcoded dark-mode colors replaced with tv()/tb()
- Network graph node text-shadows corrected for light background

### v3.6.0 Changes (Feb 18 2026) — Onboarding Wizard
- Full 8-step onboarding wizard: Start > Resume > Parsing > Profile > Skills > Values > Purpose > Complete
- Claude API (claude-sonnet-4-20250514) for resume parsing and purpose regeneration
- Entry points: More menu, auto-launch for new users, first-visit banner
- wizardApplyAndLaunch() injects built profile into running app without reload

### v3.5.3/3.5.4 Changes (Feb 18 2026) — Navigation Redesign + Light Theme
- Complete nav redesign: 56px bar, logo/wordmark, pill nav, profile avatar chip
- ADMIN label removed — profile switcher is now a proper user account selector
- Light/dark theme toggle with full CSS custom properties system
- Filter bar: contextual (Skills tab only), collapsible
- Mobile: bottom tab bar

### v3.5.2 Changes (Feb 18 2026) — Foundation Audit
- Fixed inferValues() to read userData first, not hardcode Cliff's values
- Fixed levelColors (Expert + Novice added), dynamic filter chips/counts
- Removed duplicate saveUserData(), dead loadUserData(), replaced alert() modals

### v3.5.1 — Fixed 0 Outcomes bug (reads userData.skills[].evidence)
### v3.5.0 — Professional Resume Generator working
### v3.4.0 — Multi-profile architecture, skills management, market valuation

---

## File Structure

Skills-Ontology/
  index.html                    ENTIRE app (~12,000 lines, all JS inline)
  skill_valuations.json         Market value data
  onet-skills-library.json      O*NET 35 standard skills
  onet-abilities-library.json   O*NET 52 abilities
  onet-workstyles-library.json  O*NET 16 work styles
  onet-impact-ratings.json      Impact tier ratings
  values-library.json           30 corporate values
  profiles-manifest.json        Registry of all available profiles
  PROJECT_CONTEXT.md            THIS FILE
  profiles/
    demo/
      cliff-jones.json          89 skills, 100 evidence items, 42 qualifying outcomes
      sarah-chen.json           HR/recruiting
      mike-rodriguez.json       Engineering lead
      jamie-martinez.json       Service industry
      alex-thompson.json        Entry level
    templates/
      blank.json                Empty starter template
  skills/
    index-v3.json               2,138 searchable skills

---

## Architecture

Core Pattern: Templates Are Source of Truth
- On load: fetch profiles-manifest.json, load all profile JSONs into templates{}
- localStorage ONLY stores: currentProfile, wbTheme, wbHasVisited
- Wizard-built profiles stored in templates['wizard-built'] for session persistence

Key Global Objects:
  userData          active profile
  skillsData        runtime skill data
  templates{}       all loaded profiles
  skillValuations   from skill_valuations.json
  wizardState       onboarding wizard state
  blueprintData     extracted outcomes/values/purpose (ONE declaration — do not duplicate)

userData shape:
  initialized, templateId, profile{name, email, location, currentTitle, yearsExperience,
  executiveSummary, headline}, skills[{name, level, category, key, onetId, roles,
  evidence:[{description, outcome}]}], values[{name, description, selected}],
  purpose, roles[{id, name, color}], preferences{}, applications[]

---

## Theme System

CSS custom properties on :root (dark default) and [data-theme="light"] overrides.
Variables: --bg-base/surface/elevated/card, --border, --text-primary/secondary/muted,
  --accent, --accent-glow, --nav-bg, --chip-bg, --input-bg, --shadow, --success/warning/danger

tv(darkVal, lightVal) — inline JS style helper, reads current data-theme attribute
tb(darkBg, lightBg)  — same for background values

RULE: All new inline style colors in JS template strings must use tv()/tb().
CSS class colors go in [data-theme="light"] override block in the stylesheet.

---

## Navigation

Header (56px): ◈ logo + wordmark | Skills/Jobs/Apps/Blueprint pills | theme toggle + profile chip + More
Filter bar (48px, Skills only, collapsible): view pills + search + Filter button → chips
Mobile: bottom 5-tab bar

More menu: ◈ Build My Work Blueprint | Settings | Export | Blueprint | Consent | Help | About

---

## Onboarding Wizard

Steps: Start(1) > Resume(2) > Parsing(3) > Profile(4) > Skills(5) > Values(6) > Purpose(7) > Complete(8)

Claude API (claude-sonnet-4-20250514, max_tokens 4000):
  Parsing: extracts profile, roles, 15-40 skills+evidence, values, purpose from resume text
  Regenerate: rewrites purpose from profile+skills+values+outcomes

wizardApplyAndLaunch(built): loads built profile, resets all tab init flags, calls initNetwork()

---

## Scope Pattern — CRITICAL

Functions inside DOMContentLoaded async closure are NOT reachable from HTML onclick="".
Must explicitly expose: window.functionName = functionName

Currently exposed: toggleTheme, initTheme, toggleProfileDropdown, closeProfileDropdown,
  showOnboardingWizard, all wizardXxx functions, confirmExitWizard,
  toggleFilterPanel, renderFilterChips, switchView, switchProfile, filterByRole,
  filterByLevel, toggleSkillsView, etc.

When adding any new function called from onclick="", add window.X = X after its definition.

---

## Market Valuation

calculateTotalMarketValue() in skill_valuations.json data.
Returns: yourWorth, standardOffer, competitiveOffer, conservativeOffer, top10Skills,
  criticalSkills, highSkills, criticalBonus, highBonus, rarityBonus, compaRatio, etc.

renderMarketValuationSection() uses tv()/tb() for all inline colors — do not add raw rgba() here.

---

## Export Features

WORKING: Resume (generateResume()) | Work Blueprint HTML (generateWorkBlueprint())
STUBS: Capability Statement | LinkedIn export | Interview Prep

---

## Known Issues

  No workHistory[] in JSONs     Resume experience section limited to current role
  Card view domains             Hardcoded to Cliff's skills — wizard profiles may sort wrong
  Consent presets               UI only — doesn't actually filter skills for export
  Capability Statement          Stub
  Light theme                   Ongoing polish — report issues with screenshots

---

## Roadmap Priorities

1. Light theme remaining polish
2. Test wizard with real resume — refine Claude parsing prompt
3. Personalized company/role page generator (shareable URL with encoded profile data)
4. Email composer for recruiter outreach
5. Add workHistory[] to profile JSONs
6. Capability Statement export
7. Consent preset actually filters export

---

## Deployment

  cp ~/Downloads/index.html ./
  cp ~/Downloads/PROJECT_CONTEXT.md ./
  git add -A && git commit -m "v3.6.4" && git push

---

## Tech Stack

Vanilla JS | D3.js v7 | Anthropic API (claude-sonnet-4-20250514)
HTML5/CSS3 | GitHub Pages | Static JSON | localStorage (minimal)

---

## Key Context

Primary demo: Cliff Jones — VP Global Strategy, Phenom, FAA IFR pilot, 37-year musician,
recovery advocate (Kyle's Wish Foundation co-founder). 89 skills, 100 evidence items.
Demo company: TalentEdge.

Five demo profiles: cliff-jones, sarah-chen, mike-rodriguez, jamie-martinez, alex-thompson.

---

## Starting a New Chat

Give new Claude: PROJECT_CONTEXT.md + index.html

Say: "This is a career intelligence platform. Read PROJECT_CONTEXT.md for context.
Current version: v3.6.4. Today I want to [task]."
