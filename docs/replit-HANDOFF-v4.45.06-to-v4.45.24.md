# Replit — Blueprint™ Handoff: v4.45.06 → v4.45.24

**Date**: February 27, 2026
**Scope**: Skills Library v4 build, external synonym layer, loader upgrade

---

## Summary

Upgraded the skills database from 13,939 skills (ESCO-only v3) to 43,063 skills across four sources. Built an external synonym map with 381 entries. Updated the skill library loader to prefer v4 as primary and load extended synonyms at startup.

---

## What Changed

### 1. Skills Library v4 (`skills/index-v4.json`)

**Before**: `skills/index-v3.json` — 13,939 skills from ESCO v1.2.1 only.

**After**: `skills/index-v4.json` — 43,063 skills from four sources:

| Source | Version | Skills | Notes |
|--------|---------|--------|-------|
| ESCO | v1.2.1 | 13,939 | European Skills, Competences, Qualifications and Occupations |
| Lightcast | 2023-05 | 28,955 | Open Skills API (formerly Burning Glass/EMSI) |
| O*NET | 30.1 | 139 | US Dept of Labor occupational skills |
| Trades & Creative | 1.0 | 30 | Manual additions for trades/creative fields |

- File size: ~5.6 MB
- Same schema as v3 (`n`, `c`, `sc` fields) — fully backward compatible
- Deduplicated across all sources (case-insensitive)
- Each skill tagged with `src` field indicating origin source

**Known issue**: 28,955 Lightcast skills landed in "General Professional" category because categorization regexes need improvement. Functional but not ideally categorized for ESCO category bridge browsing.

### 2. External Synonym Map (`skills/synonyms.json`)

New file — 143 synonym groups with 381 bidirectional entries and 740 total mappings.

Coverage areas:
- Programming languages (e.g., JavaScript ↔ JS ↔ Node.js)
- Cloud/DevOps (e.g., AWS ↔ Amazon Web Services)
- AI/ML (e.g., Machine Learning ↔ ML ↔ Deep Learning)
- BI tools (e.g., Tableau ↔ Power BI ↔ Data Visualization)
- Business terms (e.g., P&L ↔ Profit and Loss)
- Marketing, HR, soft skills, certifications

Loaded at startup via `loadExternalSynonyms()`. Merges into the existing `_synonymLookup` map alongside the hardcoded `SKILL_SYNONYMS` (376 entries). Combined total: ~670+ synonym entries.

### 3. Loader Changes (`loadSkillLibraryIndex()`)

**Before**:
```javascript
const candidates = ['skills/index-v3.json', 'skills/index-v4.json'];
```

**After**:
```javascript
const candidates = ['skills/index-v4.json', 'skills/index-v3.json'];
```

- v4 is now primary, v3 is fallback
- Cache buster updated to `?v=20260227-v4`
- Added source breakdown logging (logs each source's count and version)
- Reads `data.count` field (v4 format) in addition to `data.totalSkills` (v3 format)

### 4. New Function: `loadExternalSynonyms()`

- Fetches `skills/synonyms.json` at startup (parallel with skill library load)
- Merges entries into `_synonymLookup` bidirectionally
- Deduplicates against existing hardcoded synonyms
- Graceful failure — if file missing, hardcoded `SKILL_SYNONYMS` still work
- Console output: `✓ Extended synonyms loaded: 293 new mappings from 381 entries`

---

## Files Modified

| File | Change |
|------|--------|
| `index.html` | Loader priority swap (v4 first), `loadExternalSynonyms()` function added, startup call added, version bump to v4.45.24 |
| `skills/index-v4.json` | New file — 43,063 skills from 4 sources (5.6 MB) |
| `skills/synonyms.json` | New file — 143 groups, 381 entries, 740 mappings |

## Files NOT Modified

| File | Status |
|------|--------|
| `skills/index-v3.json` | Preserved as fallback — still loads if v4 fails |
| `certification_library.json` | Lightcast certifications (3,411) NOT yet merged |

---

## Console Output (Successful Load)

```
✓ Extended synonyms loaded: 293 new mappings from 381 entries
✓ ESCO category bridge: 43061 skills across 2314 subcategories
✓ Skill library loaded: 43,063 skills (skills/index-v4.json)
  esco: 13939 skills (vv1.2.1)
  lightcast: 28955 skills (v2023-05)
  onet: 139 skills (v30.1)
  trades: 30 skills (v1.0)
```

---

## Version Bump Locations

1. Line 1: `<!-- v4.45.24 | 2026-02-27 | Skills library v4: 43K skills (ESCO + Lightcast + O*NET), external synonym layer -->`
2. JS block comment: `// BLUEPRINT v4.45.24 - BUILD 20260227-skills-library-v4`
3. JS variable: `var BP_VERSION = 'v4.45.24';`

---

## Open Items for Next Session

1. **Lightcast categorization**: 28,955 skills in "General Professional" need better categorization regexes
2. **Lightcast certifications**: 3,411 certifications (3,366 new) not yet merged into `certification_library.json`
3. **Firestore permissions**: `[VALUES] Firestore persist failed` — security rules need update for values comparison caching path
