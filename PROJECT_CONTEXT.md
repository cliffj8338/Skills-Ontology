# Work Blueprint — Project Context File
For use at the start of new chat sessions to restore full context.
Last updated: February 18, 2026 — v3.5.1

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

## Current Version: 3.5.2 (BUILD 20260218-1100)


### v3.5.2 Changes (Feb 18 2026)
- Fixed inferValues(): now reads userData.values and userData.purpose from profile — all profiles get their own values/purpose instead of Cliff's
- Fixed levelColors: Expert (#f97316) and Novice (#6b7280) added — no more invisible skill dots
- Added Expert and Novice level chip CSS
- Role filter chips now render dynamically from userData.roles — all profiles show correct roles
- Level filter counts now render dynamically from actual skill data
- Added renderFilterChips() called from initializeMainApp()
- Removed duplicate saveUserData() (line 7755 version) — one definition, correct behavior
- Removed dead loadUserData() migration code
- About and Help now use proper modals instead of browser alert() calls
- Fixed misleading "Share it via link" text in blueprint download confirmation
### v3.5.1 Changes (Feb 18 2026)
- Fixed 0 Outcomes bug: extractOutcomesFromEvidence() was reading from legacy skillDetails
  (skill_evidence.json string format) instead of userData.skills[].evidence objects.
  Now reads from userData.skills — cliff-jones profile shows 42 outcomes vs 0 before.
- Outcomes sorted: dollar amounts first, percentages second, sensitive items last (default unshared)
- Added legacy fallback: if userData.skills produces nothing, falls back to skillDetails strings

### v3.5.0 Changes
- Professional Resume Generator working (exportProfile resume downloads real HTML)
- Fixed gatherBlueprintData() to use real evidence instead of hardcoded outcomes
- Added extractMetric() helper

### v3.4.0 (prior)
- Multi-profile architecture (5 profiles)
- Skills management with O*NET + 2138-skill library
- Market valuation backend + Work Blueprint display
- Impact rating system (5 tiers)

---

## File Structure

Skills-Ontology/
  index.html                    ENTIRE app (~10,000 lines, all JS inline)
  skill_evidence.json           Legacy evidence store (superseded by profile JSONs)
  skill_valuations.json         Market value data (base values, multipliers, benchmarks)
  onet-skills-library.json      O*NET 35 standard skills
  onet-abilities-library.json   O*NET 52 abilities
  onet-workstyles-library.json  O*NET 16 work styles
  onet-impact-ratings.json      Impact tier ratings for O*NET skills
  values-library.json           30 corporate values
  profiles-manifest.json        Registry of all available profiles
  PROJECT_CONTEXT.md            THIS FILE - update and deploy every session
  profiles/
    demo/
      cliff-jones.json          89 skills, 100 evidence items, 42 qualifying outcomes
      sarah-chen.json           32 skills, HR/recruiting
      mike-rodriguez.json       35 skills, engineering lead
      jamie-martinez.json       Service industry (hair stylist)
      alex-thompson.json        Entry level (retail cashier)
    templates/
      blank.json                Empty starter template
  skills/
    index-v3.json               2,138 searchable skills (224KB)
    details/
      esco-technology.json

---

## Architecture

Core Pattern: Templates Are Source of Truth
- On load: fetch profiles-manifest.json, load ALL enabled profile JSONs into templates{}
- localStorage ONLY stores currentProfile string
- Profile data always loaded fresh from JSON — no cache bugs

Key Global Objects:
  userData          active profile (skills, profile, values, purpose, roles, applications)
  skillsData        runtime skill data for network graph and card views
  templates{}       all loaded profile templates
  skillValuations   from skill_valuations.json
  impactRatings     from onet-impact-ratings.json
  skillLibraryIndex 2,138 skills from skills/index-v3.json

userData shape:
  initialized: true
  profile: { name, email, location, roleLevel, currentTitle,
             yearsExperience, currentCompany, executiveSummary }
  skills: [{ name, level, category, key, onetId, roles,
             evidence: [{description, outcome}] }]
  skillDetails: {}  (legacy)
  values: [{ name, description, selected }]
  purpose: string
  roles: [{ id, name, icon, color }]
  preferences: { seniorityLevel, targetTitles, ... }
  applications: []
  templateId: string

Profile JSON shape:
  templateId, templateName, templateDescription
  profile: { name, location, roleLevel, currentTitle, yearsExperience,
             currentCompany, executiveSummary }
  roles: [{ id, name, icon, color }]
  skills: [{ name, level, category, key, onetId, yearsExperience, roles,
             evidence: [{description, outcome}] }]
  values: [{ name, description, selected }]
  purpose: string

NOTE: No workHistory[] in profile JSONs yet. Resume experience section
synthesized from current role only. Adding workHistory[] is a roadmap item.

---

## Navigation

Main Tabs:
  1. Skills         Network graph (D3.js) + Card view + skill detail modals
  2. Jobs           Multi-source job search + AI pitch generation
  3. Applications   Full CRUD application tracker
  4. Work Blueprint Market valuation + outcomes + values + purpose + export

Overflow Menu: Settings | Export Profile | Generate Work Blueprint | Consent | Help/About
Header: Profile Selector dropdown switches between all 5 profiles instantly.

---

## Skills System

Categories:
  skill      O*NET Standard Skill (blue)
  ability    O*NET Ability (purple)
  workstyle  O*NET Work Style (green)
  unique     Unique Differentiator (gold)
  onet       Legacy alias for skill

Levels: Novice 0.7x | Proficient 1.0x | Advanced 1.5x | Expert 1.9x | Mastery 2.2x
Impact tiers: CRITICAL | HIGH | MODERATE | STANDARD | SUPPLEMENTARY

---

## Market Valuation

skill_valuations.json: skillBaseValues (70+ skills $18k-$55k), proficiencyMultipliers,
locationMultipliers (30 US cities), demandFactors, rarityBonuses, roleBenchmarks.

calculateTotalMarketValue() returns:
  total, yourWorth, marketRate, baseMarketRate, percentile, roleLevel, compaRatio,
  conservativeOffer, standardOffer, competitiveOffer, criticalBonus, highBonus,
  rarityBonus, top10Skills, criticalSkills, highSkills

---

## Export Features

WORKING: Professional Resume (v3.5.0+)
  generateResume() -> resume-[name]-[date].html
  gatherResumeData() scores evidence: $amounts+5, %+4, millions+5, multipliers+3,
    date refs+2, Mastery/Expert+2, skill.key+2. Top 10 achievements, top 18 competencies.
  Sections: Header, Summary, Competencies grid, Achievements, Experience, Values, Footer
  Output: HTML, print-to-PDF via browser.

WORKING: Work Blueprint HTML Generator (v3.5.0+, fixed from hardcoded)
  generateWorkBlueprint() -> work-blueprint-[name].html

STUBS (alert only): Capability Statement | LinkedIn export | Interview Prep

---

## Outcomes System (fixed v3.5.1)

extractOutcomesFromEvidence() reads userData.skills[].evidence objects:
  ev.outcome + ev.description = combined text for pattern matching
  Qualifies if: has dollar/percent/multiplier metric OR has result verb
    (retained, increased, reduced, improved, delivered, generated, etc.)
  Sensitive items (recovery/Kyle/sobriety/addiction/mental health) default to unshared
  Sort order: dollar amounts first, percentages second, sensitive last

cliff-jones: 42 outcomes extracted
Display fields used: outcome.text (combined display), outcome.skill (From: tag),
  outcome.category (categorized), outcome.shared (consent toggle)

---

## Known Issues / Status

  Live site stale              v3.5.1 not yet deployed
  No workHistory[] in JSONs    resume experience section limited to current role
  Capability Statement         stub
  LinkedIn export              stub
  Interview Prep               stub
  Market value on skill cards  not built
  Market value in header       not built

---

## Roadmap Priorities

Next:
  1. Add workHistory[] to profile JSONs for proper experience section in resume
  2. Capability Statement export (1-page executive summary)
  3. Market value $ on skill cards
  4. Market value persistent display in header

Later:
  5. LinkedIn / Interview Prep exports
  6. Onboarding wizard
  7. Mobile UX improvements

---

## Deployment

  cd ~/path/to/Skills-Ontology
  cp ~/Downloads/index.html ./
  cp ~/Downloads/PROJECT_CONTEXT.md ./
  git add -A && git commit -m "v3.5.1 - Fix 0 outcomes bug" && git push

---

## Tech Stack

Vanilla JavaScript | D3.js v7 | jsPDF 2.5.1 (loaded, unused)
HTML5/CSS3 | GitHub Pages | Static JSON files | localStorage (profile key only)

---

## Key Context

Primary demo: Cliff Jones — VP Global Strategy, talent tech, FAA IFR pilot,
37-year musician, recovery advocate (Kyle's Wish Foundation), 89 skills, 100 evidence items.
Real company: Phenom. Demo company: TalentEdge.

---

## Starting a New Chat

Give new Claude: PROJECT_CONTEXT.md + index.html + any profile JSONs being modified.

Say: "This is a career intelligence platform. Read PROJECT_CONTEXT.md for context.
Current version: v3.5.1. Today I want to [task]."
