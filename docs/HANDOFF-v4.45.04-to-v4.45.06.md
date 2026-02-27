# Blueprint™ Handoff: v4.45.04 → v4.45.06

**Date**: February 27, 2026  
**Scope**: Comparison engine stability, skill quality filtering, O*NET enrichment  
**Files Modified**: `index.html`, `replit.md`

---

## Problem Statement

The Blueprint Advantage™ comparison wizard was crashing and — when it did work — showed the Work Blueprint scoring *lower* than the traditional JD (14–20% WB vs 27% JD). This completely undermined the demo's purpose of proving structured WBs are superior to raw job descriptions.

**Root causes identified:**
1. `_wbRenderComparison` crashed with `TypeError: Cannot read properties of null (reading 'skills')` when Step 4 rendered before async comparison completed
2. The JD-to-WB converter (`_jdcExtractSkillsFromText`) was capturing entire bullet-point sentences as "skill" names (e.g., "Strategic storytelling and the ability to articulate…" truncated at 45 chars)
3. No quality filtering existed to catch these garbage skills at comparison time for WBs already saved to Firestore
4. No fallback enrichment existed when a WB had too few valid skills

---

## Changes by Version

### v4.45.05 — Skill Quality Filtering + Crash Fix

#### 1. Step 4 Loading Guard
- `_wbCompWizStep4()` now checks if `rawResult` and `structResult` exist before rendering
- Shows a loading spinner with "Running live comparison…" message while results compute
- Prevents the null-access crash entirely

#### 2. Converter `addSkill()` Hardening
- **Sentence indicator regex** — new check rejects skills containing phrases like "the ability to", "within a", "responsible for", "as well as", "in order to", "partner with", "collaborate with", etc.
- **Article/preposition start check** — rejects skills starting with "the", "a", "an", "to", "in", "on", "at", "by", "for", "or", "and", "of"
- **Word count limit** — max 5 words per skill name (was unlimited)
- **Max length reduced** — 35 chars (was 45), prevents truncated sentence fragments

#### 3. Bullet Scanning Rewrite
- **Before**: Entire bullet text (up to 80 chars) treated as a single skill name
- **After**: If bullet contains commas or semicolons → split into individual skills; otherwise pass whole bullet through `addSkill()` quality checks
- Preserves compound skill names like "Research and Development" (no longer splits on "and"/"or")

#### 4. `_wbSkillQualityFilter()` — New Utility Function
- Applied at comparison time to WB skills from Firestore
- Same quality checks as `addSkill()`: length limits, word count, sentence indicators, article starts
- Catches garbage skills from WBs that were converted before the fix

#### 5. O*NET Enrichment Fallback
- When a WB has fewer than 5 valid skills after filtering, `_wbCompareStructuredMatch` auto-enriches from O*NET crosswalk
- Uses `resolveTitle()` on the WB's job title to get SOC code, then pulls canonical skills from `onetCrosswalk`
- Caps at 12 total skills, respects seniority for proficiency defaults
- Enriched skills tagged with `source: 'onet-enriched'`

#### 6. Structured Result Tracking
- Added `skillsFiltered` count to structured match results
- Console log updated to show `[COMPARE] WB: X skills (Y filtered)`

---

### v4.45.06 — Tighter Thresholds

#### 1. Quality Filter Tightened
- `_wbSkillQualityFilter` max length: 35 chars (was uncapped in filter, only addSkill had limits)
- Max words: 5 (aligned with addSkill, was 6 in filter)
- Added "delivering", "articulate", "leverage" to sentence indicators

#### 2. O*NET Enrichment Threshold Raised
- Enrichment now triggers when WB has fewer than **8** valid skills (was 5)
- Ensures most poorly-converted WBs get supplemented with real O*NET skills
- Result: WBs with garbage data still produce meaningful comparisons

#### 3. Phrase Pattern Regex Update
- Converter phrase patterns reduced from `{3,45}` to `{3,35}` char capture range
- Prevents regex from greedily capturing long sentence fragments

---

## Impact on Existing Data

| Scenario | Effect |
|----------|--------|
| **WBs already in Firestore with garbage skills** | Quality filter removes them at comparison time; O*NET enrichment backfills real skills |
| **Future JD conversions** | Converter produces cleaner skill names from the start |
| **Good WBs with 8+ valid skills** | No change — filter passes them through, enrichment doesn't trigger |
| **Demo candidate Alex Morgan** | No changes to profile; comparison results improve because WB side now has real skills |

---

## Key Functions Modified

| Function | Location | Change |
|----------|----------|--------|
| `_wbCompWizStep4` | ~line 11089 | Added null guard + loading spinner |
| `addSkill` (in `_jdcExtractSkillsFromText`) | ~line 8118 | Sentence indicators, word/char limits |
| Bullet scanning block | ~line 8223 | Split on commas/semicolons, not whole bullet |
| `_wbSkillQualityFilter` | ~line 10451 | New utility — filters WB skills at comparison time |
| `_wbCompareStructuredMatch` | ~line 10464 | Calls quality filter + O*NET enrichment |
| Phrase pattern regexes | ~line 8110 | Capture range `{3,45}` → `{3,35}` |

---

## Testing Notes

- The comparison wizard requires authentication (admin access) + at least one WB saved in the Firestore repository
- To test: Admin → Work Blueprint → Compare → select a WB → paste/load a JD → select candidate → Results
- The WB used in testing ("Senior Director, Business Planning and Strategy" at Salesforce) had 7 original skills, 6 of which were sentence fragments
- After v4.45.06 filtering: 4 valid skills remain → O*NET enrichment fills to ~12 → WB match score should exceed raw JD score

---

## Known Limitations

1. **Single-word generic skills** (e.g., "Finance") pass the quality filter — they're valid skill names in isolation even if vague
2. **O*NET enrichment depends on `resolveTitle()`** succeeding — if the WB title doesn't map to an SOC code, no enrichment occurs
3. **Existing WBs aren't retroactively fixed** in Firestore — quality filtering only happens at comparison time; the stored data still has garbage skills visible in the repository view and edit form
4. **Phrase patterns may under-capture** with the 35-char limit for legitimate long skill names (longest real skill names are ~32 chars, so risk is low)

---

## Version Bump Locations

All three updated to v4.45.06:
1. Line 1: HTML comment
2. ~Line 1504: JS block comment
3. ~Line 1505: `BP_VERSION` variable
