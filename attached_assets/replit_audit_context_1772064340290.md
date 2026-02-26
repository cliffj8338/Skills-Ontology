# Blueprint™ Security & Stability Audit Context
## Session: 2026-02-25 | Versions: v4.44.43 → v4.44.46
## Purpose: Secondary audit of security hardening + architecture map update

---

## Audit Scope

This session performed four builds focused on XSS prevention, Firestore hardening, report access control, and architecture documentation. A Replit secondary audit should verify correctness, identify any gaps, and confirm no regressions were introduced.

---

## Build Summary

| Version | Focus | Lines Changed |
|---------|-------|---------------|
| v4.44.43 | innerHTML XSS audit — 57 new escapeHtml() calls | ~80 lines across 30+ locations |
| v4.44.44 | Textarea injection + verifier-suggested level scoring | ~120 lines across 20+ locations |
| v4.44.45 | Report share tokens + Firestore field-size limits | ~90 lines in app + new firestore.rules |
| v4.44.46 | Architecture map update — 3 new components, 6 new flows | ~180 lines in architecture section |

**Net line count:** 32,683 → 32,783 (~100 net new lines)
**escapeHtml() call sites:** 156 → 249 (93 new)

---

## v4.44.43: innerHTML XSS Audit

### What Was Done
Systematic audit of every `innerHTML` assignment in the codebase. Added `escapeHtml()` to 57 locations where dynamic data was injected without sanitization.

### High-Risk Fixes (user input or API responses)
| Location | Data | Line Area |
|----------|------|-----------|
| D3 tooltip rendering | `d.name` (skill/role/value names) in 4 tooltip types | ~15551-15570 |
| Card view | `skill.name`, `domainTitle`, `rolesList` | ~14467, 14519 |
| Skill browser search | `${query}` in "No results" message | ~31264 |
| JD surplus chips | `s.name` | ~25406 |
| Settings skill management | `skill.name` across 3 sub-views | ~28078, 29045, 31051 |
| Values picker | `value.name`, `catalogDesc` | ~18072, 18077 |
| Error displays | `error.message` in search errors | ~31334 |

### Medium-Risk Fixes (O*NET/library data, defense-in-depth)
| Location | Data | Line Area |
|----------|------|-----------|
| Suggestion chips | `s.name`, `s.reason`, `s.level` | ~14553-56 |
| Role gap suggestions | `s.name` in JD analysis | ~25380-92 |
| Library search results | `skill.n`, `skill.c`, `skill.sc` | ~31288-99 |
| Trades search | `skill.n`, `skill.c` | ~31371-74 |
| Demo profiles | `p.name`, `p.show`, `p.role`, `p.company` | ~14827 |

### Audit Checklist for Replit
- [ ] Search for `innerHTML` assignments that DON'T use `escapeHtml()` — any remaining gaps?
- [ ] Verify `escapeHtml()` function handles all 5 characters: `& < > " '`
- [ ] Confirm no double-escaping (escapeHtml on already-escaped content)
- [ ] Check that icon rendering (`bpIcon()`) is not broken by escaping

---

## v4.44.44: Textarea Injection + Verifier Level Scoring

### Textarea Injection Hardening
Fixed `</textarea>` breakout XSS in 6 textareas and upgraded 11 input value attributes from partial `&quot;` escaping to full `escapeHtml()`.

**Textareas fixed (pre-filled values now escaped):**
| Textarea | Line Area |
|----------|-----------|
| Outcome editor description | ~9071 |
| Wizard resume text | ~10938 |
| Wizard summary text | ~11612 |
| Wizard purpose text | ~12161 |
| Value notes | ~17168 |
| Value modal header | ~17158 |
| Dashboard purpose display | ~17639 |
| Cover letter output | ~22699 |
| Interview prep output | ~22914 |
| LinkedIn output | ~23050 |

**Input value attributes upgraded to escapeHtml():**
| Input Group | Fields | Line Area |
|-------------|--------|-----------|
| Admin sample edit | name, title, location, level | ~3857-3866 |
| Job edit | title, company, URL, note | ~25455-25468 |
| Work history | title, company, location | ~27250-27254 |
| Education | school, degree, field | ~27369-27373 |
| Certifications | name, abbr, issuer | ~27478-27482 |
| Wizard field utility | template | ~11666 |

### Verifier-Suggested Level Scoring
When a verifier suggests a different proficiency level than claimed:

| Scenario | Score Adjustment | Example |
|----------|-----------------|---------|
| Suggests higher | `+1.5 × credibility weight` | Manager endorsing up = +3 pts |
| Suggests lower | `-1.5 × credibility weight` | Manager disagreeing = -3 pts |
| Confirms claimed | No change | Standard multiplier applies |

**Implementation locations:**
| Function | Line Area | Change |
|----------|-----------|--------|
| `calculateEvidencePoints()` | ~8282+ | Checks `confirmedLevel` vs claimed level |
| `confirmVerification()` | ~8563 | Accepts and stores `confirmedLevel` parameter |
| `getEvidenceSummary()` | ~8350+ | Returns `levelSuggestions` array |
| Verify tab rendering | ~18543 | Shows ↑/↓ badges when suggestion differs |
| Skill modal evidence panel | ~15979 | Shows suggestion badges inline |

### Audit Checklist for Replit
- [ ] Test textarea breakout: enter `</textarea><script>alert(1)</script>` in any text field
- [ ] Verify input values with `"` and `'` characters render correctly in edit modals
- [ ] Confirm level scoring math: suggested higher gives bonus, lower gives penalty
- [ ] Check that `confirmedLevel` is properly validated (must be valid level string)
- [ ] Verify the scoring changes don't break existing evidence calculations

---

## v4.44.45: Report Share Tokens + Firestore Field-Size Limits

### Report Access Control (p1-2)

**Vulnerability found:** Any unauthenticated client could query `collection('reports').where('status','==','active')` and enumerate ALL shared reports.

**Fix applied:**
| Rule | Before | After |
|------|--------|-------|
| `read` | Single rule allowing any read | Split into `get` + `list` |
| `get` (single doc) | — | Requires 128-bit reportId + shareToken field exists |
| `list` (collection query) | — | Requires auth + owner/admin only |

**Implementation:**
| Component | Line Area | Change |
|-----------|-----------|--------|
| `generateShareToken()` | ~19624 | 128-bit crypto token via `crypto.getRandomValues()` |
| Share URL construction | ~19647 | Includes `&token=` parameter |
| Report creation | ~19620+ | `shareToken` field required on Firestore write |
| Firestore rules | firestore.rules | `get` requires shareToken field (16-64 chars), `list` requires auth |

### Firestore Field-Size Limits (s12)
30 field-size constraints added to `firestore.rules`:

**User document limits:**
| Field | Type | Limit |
|-------|------|-------|
| skills | Array | 500 items |
| savedJobs | Array | 200 items |
| verifications | Array | 1000 items |
| applications | Array | 500 items |
| workHistory | Array | 100 items |
| education | Array | 50 items |
| certifications | Array | 100 items |
| values | Array | 100 items |
| outcomes | Array | 200 items |
| roles | Array | 50 items |
| purpose | String | 5000 chars |
| profile | Object | 20 keys max |

**Report document limits:**
| Field | Type | Limit |
|-------|------|-------|
| reportData | String | 500K chars |
| candidateName | String | 200 chars |
| company | String | 200 chars |
| jobTitle | String | 300 chars |
| createdByName | String | 200 chars |
| Document total | Keys | 15 max |

### Audit Checklist for Replit
- [ ] **CRITICAL:** `firestore.rules` must be deployed to Firebase Console separately from Vercel
- [ ] Test report enumeration: unauthenticated list query should be DENIED
- [ ] Test report single-doc access: valid reportId + shareToken should succeed
- [ ] Verify shareToken is generated with `crypto.getRandomValues()` not `Math.random()`
- [ ] Confirm field-size limits don't block normal user saves (test with a full profile)
- [ ] Check that share URL with token parameter loads the report correctly
- [ ] Verify the rules file matches what's actually in Firebase Console

---

## v4.44.46: Architecture Map Update

### New Components Added
| Component | Layer | Purpose |
|-----------|-------|---------|
| Verification System | Runtime (engine) | Peer evidence scoring, credibility weights, level suggestions |
| Showcase Mode | Frontend (screen) | Read-only profile export, mutation lockout |
| XSS Security Layer | Runtime (engine) | 249 escapeHtml sites, textarea/input sanitization |

### New Data Flows Added
| From | To | Label | Type |
|------|----|-------|------|
| verification | firestore | stores evidence | data |
| verification | skillsData | updates scores | sync |
| blueprint | verification | evidence display | read |
| reports | firestore | share tokens | data |
| showcase | userData | reads snapshot | read |
| showcase | skillsData | reads snapshot | read |

### Updated Existing Components
| Component | What Changed |
|-----------|-------------|
| Firestore | Added rules info, field limits, share tokens, reports collection |
| Reports Engine | Added share token generation, access control |
| Admin Panel | Updated line range (~2550-5990), 109 roadmap items |
| Valuation Engine | Added verification evidence integration |

### Standalone Export
`blueprint-architecture.html` — self-contained dark-theme interactive visualization with layer filtering, component search, detail panel with I/O + flows + tech debt. No dependencies.

**Totals:** 38 components, 31 data flows, 4 layers

### Audit Checklist for Replit
- [ ] Verify architecture diagram renders correctly in both tiles and SVG views
- [ ] Confirm new component positions don't overlap in SVG diagram view
- [ ] Check that expanded canvas (1680×S instead of 1480×S) fits without breaking layout
- [ ] Verify all 38 components have matching position entries in the diagram pos map

---

## Firestore Rules File

**Location:** `firestore.rules` (root of repo)
**Deploy method:** Firebase Console → Firestore → Rules → paste and publish
**NOT deployed via Vercel** — this is a common mistake

The rules file includes:
1. User document: auth-gated read/write, hasOnly() field whitelist, array size limits, string length limits, 1-write/sec rate limiting
2. Reports collection: split get/list, shareToken validation, field-size constraints
3. Waitlist: hasOnly() on 8 known fields
4. Analytics events: auth-required

---

## Key File Locations (updated for v4.44.46)

| System | Line Area |
|--------|-----------|
| escapeHtml() function | ~1300 |
| Firebase config + auth | ~2180-2260 |
| Showcase config | ~2215-2220 |
| Admin dashboard + tabs | ~3016-3160 |
| Admin tab renderers | ~3700-5990 |
| Architecture map (getArchComponents) | ~5131-5365 |
| Architecture map (getArchFlows) | ~5366-5400 |
| Architecture diagram (buildArchDiagram) | ~5492-5845 |
| Valuation engine | ~6500-6900 |
| Evidence scoring (calculateEvidencePoints) | ~8168-8420 |
| Verification system | ~8420-8830 |
| Wizard textareas | ~10938, 11612, 12161 |
| D3 tooltips | ~15551-15570 |
| Values picker | ~18072-18077 |
| Report generation + share tokens | ~19605-19690 |
| Cover letter / interview / LinkedIn outputs | ~22699-23050 |
| JD analysis / gap suggestions | ~25380-25468 |
| Work history / education / certs forms | ~27250-27482 |
| Settings skill management | ~28078-31051 |
| Skill browser search | ~31264-31374 |

---

## What NOT to Change

1. **escapeHtml() function itself** — it's correct and covers all 5 HTML entities
2. **Evidence scoring thresholds** — these are tuned and tested
3. **Credibility weight values** — Manager 2.0x → Other 1.2x is intentional
4. **Architecture component IDs** — used by onclick handlers and detail panel
5. **Share token length** (128-bit / 32 hex chars) — security-critical

---

## Suggested Audit Priorities

### Priority 1: Verify Security Fixes Work
1. Test innerHTML XSS: inject `<img src=x onerror=alert(1)>` in skill names, company names, search queries
2. Test textarea breakout: inject `</textarea><script>alert(1)</script>` in purpose, resume, cover letter fields
3. Test report enumeration: confirm unauthenticated list queries are blocked

### Priority 2: Check for Gaps
1. Search for any remaining `innerHTML =` without `escapeHtml()` on dynamic data
2. Look for any `value="` in inputs where user data is interpolated without escaping
3. Verify firestore.rules matches Firebase Console (may need manual comparison)

### Priority 3: Regression Check
1. Confirm all 24 demo profiles still load correctly
2. Verify D3 tooltips still render skill names properly
3. Check that scouting reports generate without errors
4. Confirm architecture map renders in both tiles and diagram views
5. Test the verification flow end-to-end (request → verifier landing → confirmation)

---

## Git Workflow

```bash
git add -A && git commit -m "v4.44.46: description" && git push origin main
```

Vercel auto-deploys frontend + serverless. Firestore rules deploy separately via Firebase Console.

---

## Version Tracking (6 places)

1. **Line 1-2**: HTML comments with version + date + description
2. **~Line 166**: CSS section comment
3. **~Line 1487**: JS block comment
4. **~Line 1488**: `var BP_VERSION = 'v4.44.46';`
5. **~Line 2041**: Console banner build tag
6. **`docs/SECURITY_AUDIT.md`**: Version reference
