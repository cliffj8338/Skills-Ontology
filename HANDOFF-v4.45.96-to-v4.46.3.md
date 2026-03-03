# Blueprint Handoff Document
## Session: March 2-3, 2026 | v4.45.96 → v4.46.3

**39 commits | 22 files changed | 669 insertions, 458 deletions**

---

## 1. No-Red Policy (v4.45.97 → v4.45.99)

### What Changed
Eliminated red (#ef4444) from all non-error UI. Red is now reserved exclusively for real errors (Firebase offline, save failures, delete confirmations).

### Details
- **12+ `levelColors` definitions** updated across index.html:
  - Novice: `#94a3b8` (slate)
  - Proficient: `#60a5fa` (blue)
  - Advanced: `#a78bfa` (purple)
  - Expert: `#fb923c` (orange)
  - Mastery: `#10b981` (green)
- **Network view**: Role default palette replaced red with orange; match gaps now amber, values tension amber, job-req nodes amber, welcome hero Finance bubble sky blue `#38bdf8`
- **`normalizeUserRoles()` patched** (v4.45.99): Added `bannedReds` array — existing Firestore-saved roles with `#ef4444` are auto-reassigned to the new palette on load
- **Caution color**: Yellow `#fbbf24` for evidence gaps, pending verifications

### Files
- `index.html` — all `levelColors` objects, `normalizeUserRoles()`, network rendering, welcome hero

---

## 2. Card View Rarity Grouping (v4.45.96 → v4.46.0)

### What Changed
Skills Card View groups skills by market rarity (Rare / Uncommon / Common) instead of role domain, with per-tier summary stats and per-skill rarity pills.

### Details
- **Three rarity tiers** with distinct visual treatment:
  - **Rare** (gold/amber): market differentiators, flame icon
  - **Uncommon** (blue/purple): competitive advantages, diamond icon
  - **Common** (neutral): foundational capabilities, check icon
- **Rarity classification** uses `getSkillImpact(skill)` from O*NET impact ratings; unique skills default to "uncommon" unless user-assessed
- **Sorting**: Core/key skills first, then by proficiency level descending, then alphabetical
- **Per-tier stats bar**: proficiency breakdown by level, evidence coverage (X/Y evidence-backed), verified count
- **Per-skill rarity pill** (v4.46.0): each tile's line 2 shows a small RARE/UNCOMMON/COMMON pill in the tier color
- **Legend bar** at top with icon badges for Core, Verified, Evidence, Gap, Skill/Ability/WorkStyle/Unique
- **Skill tile two-line layout**: Line 1 = dot + name + badges, Line 2 = level pill + impact icon + rarity pill + years + role alignment

### Files
- `index.html` — `initCardView()` function (~line 23917)

---

## 3. Job Matching Preferences Moved Inline (v4.46.1)

### What Changed
Moved "Minimum Match Score" slider and "Minimum Skill Matches" input from the Settings page to both the **Find Jobs** and **Fit For Me** tabs for easier access.

### Details
- **Find Jobs tab**: Added "Min skills" number input next to existing "Min match" slider
- **Fit For Me tab**: Added new filter bar with both min match slider and min skills input; results filtered in real-time
- **Settings page**: Removed both controls; replaced with info note pointing to Jobs tabs. Seniority Level and Minimum Salary remain in Settings.
- **Auto-save**: Both tabs' controls sync to `userData.preferences` with 1.5s debounced save to Firestore
- **Shared state**: Adjusting on one tab carries over to the other; `currentMatchThreshold` initialized from saved preferences

### Functions Added
- `updateMinSkillMatches(value)` — updates min skill filter on Find Jobs
- `updateFitMinMatch(value)` — updates min match on Fit For Me
- `updateFitMinSkills(value)` — updates min skills on Fit For Me
- `_debouncedSavePrefs()` — 1.5s debounced save to Firestore

### Files
- `index.html` — `renderFindJobs()`, `renderFitForMe()`, `renderJobPreferences()`, `saveSettings()`, new update functions

---

## 4. Pipeline Match Score Fix (v4.46.2)

### What Changed
Fixed jobs added from Fit For Me showing 0% match in Pipeline due to mismatched field names.

### Root Cause
`_fitAddToPipeline()` saved match data as `matchResult` and `parsedData`, but the pipeline system reads from `matchData` and `parsedSkills`.

### Fix
- **`_fitAddToPipeline()`**: Now saves `matchData` (not `matchResult`), `parsedSkills` (not `parsedData`), and `rawText`
- **`renderSavedJobs()`**: Migrates legacy field names on render (`matchResult` → `matchData`, `parsedData.skills` → `parsedSkills`)
- **`rescoreAllJobs()`**: Same migration before re-scoring

### Files
- `index.html` — `_fitAddToPipeline()`, `renderSavedJobs()`, `rescoreAllJobs()`

---

## 5. Pipeline Rescore + Fit For Me Persistence (v4.46.3)

### What Changed
Fixed "Refresh Matches" button not improving scores, and made Fit For Me results persist until manually refreshed.

### Details
- **`rescoreAllJobs()` improvements**:
  - Re-parses raw text through `parseJobLocally()` when no `parsedSkills` exist (recovers skills from job description)
  - Always saves after rescoring (previously only saved on change)
  - Always shows toast feedback: "X job scores updated" or "All Y job scores are current"
  - Shows "No jobs in pipeline to rescore" if empty
- **Fit For Me persistence**:
  - First visit auto-fetches and scores as before
  - Results now stay on screen when switching tabs — no auto-refresh after 15 minutes
  - Only re-fetches when user clicks "Refresh" button explicitly

### Files
- `index.html` — `rescoreAllJobs()`, `renderFitForMe()`

---

## Version History

| Version  | Date       | Summary |
|----------|------------|---------|
| v4.45.96 | 2026-03-02 | Card View rarity grouping baseline |
| v4.45.97 | 2026-03-03 | No-red policy: 12+ levelColors updated |
| v4.45.98 | 2026-03-03 | Network view de-reded, welcome hero fix |
| v4.45.99 | 2026-03-03 | normalizeUserRoles bannedReds patch |
| v4.46.0  | 2026-03-03 | Per-skill rarity pill on card tiles |
| v4.46.1  | 2026-03-03 | Job match filters moved inline to Jobs tabs |
| v4.46.2  | 2026-03-03 | Pipeline 0% match fix (field name mismatch) |
| v4.46.3  | 2026-03-03 | Pipeline rescore fix + Fit For Me persistence |

---

## Key Technical Notes

- **Version rule (UNBREAKABLE)**: Every file change that requires a deploy must bump the version in ALL 3 places in index.html: line 1 HTML comment, JS block comment, `BP_VERSION` variable
- **Color palette**: No red in non-error UI. Red `#ef4444` only for Firebase errors, save failures, delete buttons. Amber `#fbbf24` for caution/warnings.
- **Job data schema**: Pipeline jobs must have `matchData` (object with `.score`, `.matched`, `.gaps`, `.surplus`) and `parsedSkills` (array of skill objects). The `matchResult`/`parsedData` field names are legacy and get auto-migrated.
- **Fit For Me data lifecycle**: `_fitForMeData` array persists in memory; `_fitForMeLastRun` timestamp tracks freshness; only resets when user clicks Refresh (sets both to empty/0)
- **Git push**: The `.git/refs/remotes/origin/main.lock` error on push is cosmetic — verify success by checking `git ls-remote origin main` matches local HEAD
