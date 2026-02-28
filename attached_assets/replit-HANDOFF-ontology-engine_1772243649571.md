# Replit Handoff: Stability & Performance & Security Scan
## Blueprint v4.45.37 — Post-Ontology Engine Build
**Date:** February 27, 2026
**Priority:** Review new matching engine and admin blocklist for production readiness

---

## What Was Added (v4.45.32→37)

### New Subsystems to Review

**1. Six-pass matching engine** in `matchJobToProfile()` (~line 32596)
- Passes 1-3: existing (exact, substring, word-overlap)
- Pass 4: ESCO subcategory sibling matching via `getEscoCategorySiblings()`
- Pass 5: Concept-root stem decomposition via `_stemEquiv`
- Pass 6: Seniority domain implication via keyword regex patterns

**2. Skill validation layer** in `parseJobLocally()` (~line 30870)
- `SKILL_BLOCKLIST` (Set, ~80 terms)
- `VALUES_BLOCKLIST` (Set, ~25 terms)
- Metrics regex filter
- Fragment detection heuristics
- Admin blocklist integration

**3. Admin skill blocklist** (~line 16420)
- Firestore: `meta/skillBlocklist` document
- Runtime: `_adminSkillBlocklist` (global Set)
- UI: gap chip ✕ buttons + Admin Config panel
- Functions: `loadAdminSkillBlocklist()`, `saveAdminSkillBlocklist()`, `adminBlockSkill()`, `adminUnblockSkill()`, `isSkillBlocklisted()`

**4. Compare engine filter hardening** in `_wbSkillQualityFilter()` (~line 10573)
- Expanded blocklist (personality traits, fragments, metrics)
- Admin blocklist integration via `isSkillBlocklisted()`

---

## Performance Hotspots

### P1: Pass 4 fuzzy subcategory resolution
```javascript
// ~line 32718: Iterates ALL keys in _escoSkillToSubcategory when exact lookup fails
var keys = Object.keys(_escoSkillToSubcategory);
for (var ki = 0; ki < keys.length; ki++) { ... }
```
- **Size:** ~43,000 keys
- **Frequency:** Once per unmatched gap skill (after passes 1-3 fail)
- **Concern:** For a JD with 15 unresolved gaps, that's 15 × 43K = 645K string comparisons
- **Recommendation:** Build reverse prefix index at load time, or add early termination

### P2: Pass 6 domain keyword matching
```javascript
// ~line 32770: Nested loop — domain keywords × user skills
Object.keys(domainKeywords).forEach(function(domain) { ... });
// Then:
userSkills.forEach(function(us) { ... Object.keys(domainKeywords2).forEach(...) });
```
- **Size:** 8 domains × 35 user skills = 280 iterations per gap
- **Frequency:** Once per unresolved gap after passes 1-5
- **Concern:** Low — 280 iterations is trivial. But regex `.test()` on each is slightly expensive
- **Recommendation:** Cache user skill domain assignments once per match call

### P3: User skill indexing in category bridge
```javascript
// In buildEscoCategoryIndex() ~line 16375
skillsData.skills.forEach(function(s) {
    var libMatch = skillLibraryIndex.index.find(function(e) { ... });
});
```
- **Size:** 35 user skills × 43K library = 1.5M comparisons
- **Frequency:** Once at load (after skill library loads)
- **Recommendation:** Convert to Map-based lookup if load time regresses

### P4: Validation layer in parseJobLocally
```javascript
// ~line 30920: Library verification for short single words
var inLibrary = skillLibraryIndex.index.some(function(e) { return ... });
```
- **Size:** Up to 43K per short skill candidate
- **Frequency:** Per extracted skill (typically 15-30 per JD)
- **Recommendation:** Build Set of all library names at load time for O(1) lookup

---

## Security Review

### Firestore Rules
Verify `meta/skillBlocklist`:
- **Read:** Should be open (all authenticated users need it for parsing)
- **Write:** Should be admin-only (`request.auth.token.admin == true` or role check)

### XSS Vectors
Gap chip ✕ button constructs onclick handler with skill name:
```javascript
html += '<span onclick="event.stopPropagation(); adminBlockSkill(\''
    + escapeHtml(g.name).replace(/'/g, "\\'") + '\', ' + idx + ');"...';
```
- `escapeHtml()` runs first (handles `<`, `>`, `&`, `"`)
- Single quotes escaped with `\\'`
- **Risk:** Low, but verify `escapeHtml` handles backticks and template literals

### Admin blocklist panel
```javascript
// Manual input field
'<input type="text" id="blocklistAddInput" ... onkeydown="if(event.key===\'Enter\'){adminBlockSkillFromInput()}">'
```
- Input value passed through `adminBlockSkill()` which lowercases and trims
- Stored as plain string in Firestore array
- **Risk:** Minimal — no HTML rendering of raw input, Set membership check is string-exact

### `readOnlyGuard()` check
`adminBlockSkill()` calls `readOnlyGuard()` before writes. Verify this guard:
- Returns true in showcase mode
- Returns true for non-authenticated users
- Returns true for demo profiles

---

## Stability Checks

### Null safety
1. `userData.roles` — used in pass 6. Verify exists for: new users, demo profiles, showcase mode, pre-auth state
2. `_escoSkillToSubcategory` — used in passes 4 and 6. Verify populated before `matchJobToProfile()` can run
3. `skillLibraryIndex.index` — used in validation layer. Verify loaded before `parseJobLocally()` can run
4. `_adminSkillBlocklist` — Set, initialized empty. `isSkillBlocklisted()` works on empty Set (returns false)

### State consistency
1. `_adminSkillBlocklist` rebuilds from Firestore on each auth. No stale state risk from re-auth
2. `adminBlockSkill()` modifies Set AND saves to Firestore. If Firestore write fails, local Set is still updated (inconsistency until next load). Consider rollback on save failure
3. `matchType` field on matched entries: values are 'exact', 'sibling', 'concept', 'implied'. Downstream consumers should handle all values gracefully (job detail, network graph, PDF, scouting report)

### Edge cases
1. **Empty skills profile:** Passes 4-6 iterate `userSkills.forEach()` — safe with empty array, just no matches found
2. **Empty JD:** `parseJobLocally()` returns empty skills array, `matchJobToProfile()` returns 0% score
3. **Blocklist with 1000+ entries:** `_adminSkillBlocklist.has()` is O(1) Set lookup. `Array.from()` for rendering/saving is O(n) but only on admin panel open or blocklist change
4. **Very long skill names (>100 chars):** Blocked by existing validation (`name.length > 35` in quality filter). Verify `parseJobLocally` validation also caps length

---

## Test Scenarios

### Matching engine
1. Re-analyze a saved job → verify no duplicate matched skills
2. Re-analyze with a JD containing "Analytics" → verify it matches against user's "Competitive Analysis" (pass 5)
3. Executive user with Strategy Mastery + JD requiring "Business Strategy" → should match via pass 2 or earlier, not leak to pass 6
4. Executive user + JD requiring "Reporting" → should match via pass 6 (seniority implication, analytics domain)

### Admin blocklist
1. Block a skill from gap chip ✕ → verify toast, verify skill disappears from current view
2. Verify blocked skill doesn't appear when re-analyzing same or different job
3. Admin Config → Skill Blocklist panel → verify all blocked skills shown
4. Unblock a skill → verify it reappears on next re-analyze
5. Non-admin user → verify no ✕ buttons on gap chips
6. Non-admin user → verify blocklist still applied to parsing

### Compare engine
1. Run Blueprint Advantage Compare with same JD → verify "Ashing", "Composure", "Gross Margin" not in extracted skills
2. Verify admin-blocked skills don't appear in Compare JD parsing results
3. Verify extracted skill count reflects post-filter count

---

## File Locations (Key Functions)

| Function | Purpose | ~Line |
|----------|---------|-------|
| `parseJobLocally()` | JD skill extraction | 30700 |
| `matchJobToProfile()` | 6-pass matching engine | 32596 |
| `_wbSkillQualityFilter()` | Compare engine filter | 10573 |
| `_wbCompareRawJDMatch()` | Compare JD matching | 10462 |
| `buildEscoCategoryIndex()` | ESCO category bridge | 16364 |
| `getEscoCategorySiblings()` | Subcategory sibling lookup | 16399 |
| `loadAdminSkillBlocklist()` | Firestore blocklist load | 16424 |
| `adminBlockSkill()` | Block skill + save | 16452 |
| `renderAdminBlocklistPanel()` | Admin UI panel | 16478 |
| `quickScoreJob()` | Find Jobs scoring (NOT updated) | 33917 |
| `initJobNetwork()` | Job network graph | 20032 |
