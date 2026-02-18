# Work Blueprint — Project Context File
For use at the start of new chat sessions to restore full context.
Last updated: February 18, 2026 — v3.5.0

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

## Current Version: 3.5.0 (BUILD 20260218-0900)

### v3.5.0 Changes (Feb 18 2026)
- Professional Resume Generator: exportProfile('resume') now downloads a real print-ready HTML resume
- Fixed gatherBlueprintData(): Work Blueprint generator now pulls real skill evidence instead of hardcoded outcomes
- Added extractMetric() helper to surface the strongest metric from any evidence string
- Export modal: Resume option updated to "Professional resume - print to PDF"

### Prior version: 3.4.0
- Multi-profile architecture finalized (5 profiles)
- Skills management: add/edit/delete, O*NET picker + 2,138-skill library
- Market valuation backend complete, UI display in Work Blueprint tab
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
      cliff-jones.json          89 skills, 100 evidence items, full executiveSummary
      sarah-chen.json           32 skills, HR/recruiting
      mike-rodriguez.json       35 skills, engineering lead
      jamie-martinez.json       Service industry (hair stylist)
      alex-thompson.json        Entry level (retail cashier)
    templates/
      blank.json                Empty starter template
  skills/
    index-v3.json               2,138 searchable skills (224KB)
    details/
      esco-technology.json      100 tech skill details

---

## Architecture

Core Pattern: Templates Are Source of Truth
- On load: fetch profiles-manifest.json, load ALL enabled profile JSONs into templates{} object
- localStorage ONLY stores the currentProfile string (which profile is active)
- Profile data never cached in localStorage — always loaded fresh from JSON
- Eliminates all cache invalidation bugs from v1/v2 era

Key Global Objects:
  userData       active profile (skills, profile, values, purpose, roles, applications)
  skillsData     runtime skill data for network graph and card views
  templates{}    all loaded profile templates
  skillValuations  from skill_valuations.json
  impactRatings    from onet-impact-ratings.json
  skillLibraryIndex  2,138 skills from skills/index-v3.json

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
  preferences: { seniorityLevel, targetTitles, seniorityKeywords, ... }
  applications: []
  templateId: string

Profile JSON shape (each file under profiles/):
  templateId, templateName, templateDescription
  profile: { name, location, roleLevel, currentTitle, yearsExperience,
             currentCompany, executiveSummary }
  roles: [{ id, name, icon, color }]
  skills: [{ name, level, category, key, onetId, yearsExperience, roles,
             evidence: [{description, outcome}] }]
  values: [{ name, description, selected }]
  purpose: string

IMPORTANT: No workHistory[] array in profile JSONs yet. The resume experience section
is synthesized from the current role only. Adding workHistory[] is a roadmap item.

---

## Navigation

Main Tabs:
  1. Skills         Network graph (D3.js) + Card view + skill detail modals
  2. Jobs           Multi-source job search + AI pitch generation
  3. Applications   Full CRUD application tracker
  4. Work Blueprint Market valuation + outcomes + values + purpose + export

Overflow Menu (More):
  Settings (Profile / Preferences / Data tabs)
  Export Profile (Resume WORKING, others stub)
  Generate Work Blueprint
  Consent Settings / Help / About

Header: Profile Selector dropdown switches between all 5 profiles instantly.

---

## Skills System

Categories:
  skill      O*NET Standard Skill (blue badge)
  ability    O*NET Ability (purple badge)
  workstyle  O*NET Work Style (green badge)
  unique     Unique Differentiator (gold badge)
  onet       Legacy alias for skill

Proficiency levels with valuation multipliers:
  Novice 0.7x | Proficient 1.0x | Advanced 1.5x | Expert 1.9x | Mastery 2.2x

Impact tiers: CRITICAL | HIGH | MODERATE | STANDARD | SUPPLEMENTARY

---

## Market Valuation

skill_valuations.json contains:
  skillBaseValues     dollar values for 70+ named skills ($18k-$55k range)
  proficiencyMultipliers
  locationMultipliers  30 US cities (SF 1.52x to Rural 0.78x)
  demandFactors       AI/ML/cloud/data premium factors
  rarityBonuses       executive_technical, ai_domain_expert, etc.
  roleBenchmarks      VP Strategy, CSO, Director, etc. (min/median/max)

calculateTotalMarketValue() returns:
  total, yourWorth, marketRate, baseMarketRate, percentile, roleLevel, compaRatio,
  conservativeOffer, standardOffer, competitiveOffer, criticalBonus, highBonus,
  rarityBonus, top10Skills, criticalSkills, highSkills

---

## Export Features

WORKING: Professional Resume (v3.5.0)
  generateResume() downloads resume-[name]-[date].html

  Function chain: gatherResumeData() -> buildResumeHTML() -> downloadBlueprint()

  gatherResumeData() scores all skill evidence items:
    Dollar amounts in text     +5
    Percentages                +4
    Million/billion            +5
    Multipliers (2x, 3 times)  +3
    Date references            +2
    Mastery or Expert level    +2
    skill.key = true           +2
  Selects top 10 achievements, top 18 competencies.

  Resume sections:
    Header (name, title, company, location, years experience, target salary range)
    Professional Summary (from executiveSummary)
    Core Competencies grid (proficiency dots: full/two-thirds/one-third filled)
    Selected Achievements (top scored evidence items)
    Professional Experience (current role + purpose statement)
    Core Values and Leadership Principles
    Footer (generated date + skill count stats)

  Output: HTML file, print-to-PDF via browser. ATS-readable.

WORKING: Work Blueprint HTML Generator
  generateWorkBlueprint() downloads work-blueprint-[name].html
  Fixed in v3.5.0: uses real evidence, real values, real compensation data.

STUBS (alert only, to build next):
  Capability Statement
  LinkedIn Profile export
  Interview Prep / STAR stories

---

## Known Issues

  Live site is stale         v3.5.0 not yet deployed to GitHub Pages
  No workHistory[] in JSONs  resume experience section limited to current role
  Capability Statement       stub
  LinkedIn export            stub
  Interview Prep             stub
  Market value on skill cards  not built
  Market value in header       not built

---

## Roadmap Priorities

Next session:
  1. Add workHistory[] to profile JSONs for proper multi-role experience section in resume
  2. Capability Statement export (1-page executive summary for outreach)
  3. Market value $ on skill cards in card view
  4. "Your Market Value: $XXX,XXX" persistent display in header

Later:
  5. LinkedIn export
  6. Interview Prep STAR stories
  7. Onboarding wizard (resume upload + AI skill extraction)
  8. Mobile UX improvements

---

## Deployment

  cd ~/path/to/Skills-Ontology
  cp ~/Downloads/index.html ./
  cp ~/Downloads/PROJECT_CONTEXT.md ./
  git add -A && git commit -m "v3.5.0 - Professional resume generator" && git push
  GitHub Pages auto-deploys in ~60 seconds.

---

## Tech Stack

  Vanilla JavaScript (no framework)
  D3.js v7               network graph
  jsPDF 2.5.1            loaded but unused (HTML->print-PDF preferred for resumes)
  HTML5/CSS3
  GitHub Pages           free hosting
  Static JSON files      all data
  localStorage           profile preference string only

---

## Key Context

Primary user/demo: Cliff Jones — VP Global Strategy, talent tech industry, FAA IFR pilot,
37-year professional musician, recovery advocate (Kyle's Wish Foundation), 89 documented
skills, 100 evidence items. Real company: Phenom. Demo company name: TalentEdge.

---

## Starting a New Chat

Provide the new Claude:
  1. This file (PROJECT_CONTEXT.md)
  2. Current index.html
  3. Any profile JSONs being modified that session

Opening prompt:
  "This is a career intelligence platform I'm building. Read PROJECT_CONTEXT.md for full
  context. Current version is v3.5.0. Today I want to [specific task]."
