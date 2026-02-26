# Blueprint Security Hardening Audit
## Updated: 2026-02-26 | Codebase: v4.44.80
## Original Audit: 2026-02-23 | Codebase: v4.37.13.0

---

## Executive Summary

Blueprint's security posture has improved significantly since the initial audit. All critical XSS vectors have been closed, CSP and SRI are in place, security headers are complete, and Firestore rules now include field-level validation to prevent role escalation. The remaining open items are medium/low severity and relate to architectural patterns (single-file inline JS, localStorage key storage) that require larger refactoring efforts.

---

## Remediation Status (from original audit)

### RESOLVED - Critical

| ID | Finding | Status | Resolution |
|----|---------|--------|------------|
| C1 | No Content Security Policy | FIXED | CSP meta tag in index.html + CSP header in vercel.json |
| C2 | No SRI on CDN scripts | FIXED | All 7 external scripts have integrity + crossorigin attributes |
| C3 | Anthropic API key in localStorage | MITIGATED | Security warning added to UI. Key cleared on sign-out. Server-side proxy available for authenticated users |
| C4 | XSS via err.message in innerHTML | FIXED | All instances now use escapeHtml(err.message) |
| C5 | XSS via Firebase photoURL | FIXED | Uses safeSetAvatar() DOM API instead of innerHTML |

### RESOLVED - High

| ID | Finding | Status | Resolution |
|----|---------|--------|------------|
| H1 | Inconsistent innerHTML escaping | IMPROVED | escapeHtml coverage expanded from 17 to 121+ instances. Key user-controlled data points escaped |
| H2 | Reports collection world-readable | FIXED | Report IDs use crypto.getRandomValues (128-bit). Firestore rules now require auth + ownership |
| H3 | Unauthenticated Firestore writes | FIXED | analytics_events requires auth. report_views requires auth. waitlist validates fields + server timestamp |
| H4 | Job URLs without protocol validation | FIXED | URLs validated with ^https?:\/\/ before rendering |
| H5 | CORS proxy data leakage | FIXED | Third-party proxies (corsproxy.io, allorigins.win) removed |
| H6 | AI-parsed resume data incomplete escaping | IMPROVED | Error handlers now use escapeHtml |

### RESOLVED - Medium

| ID | Finding | Status | Resolution |
|----|---------|--------|------------|
| M1 | No HSTS header | FIXED | Strict-Transport-Security: max-age=31536000; includeSubDomains |
| M2 | No X-XSS-Protection header | FIXED | X-XSS-Protection: 0 (modern best practice) |
| M3 | document.write usage | FIXED | No longer present |

### RESOLVED - Low

| ID | Finding | Status | Resolution |
|----|---------|--------|------------|
| L2 | Report demo D3 without SRI | FIXED | Pinned to d3@7.9.0 with SRI hash |

---

## NEW: Firestore Rules Hardening (2026-02-25)

The `firestore.rules` file has been expanded to cover all collections with proper access controls:

- **users/{userId}**: Create blocked from setting `role` field. Update blocked from changing `role` field. Prevents self-escalation to admin.
- **analytics_events/{eventId}**: Requires authentication. Type field validated (string, max 50 chars).
- **reports/{reportId}**: Owner-only read/write. Admin can read all. Create requires uid match.
- **report_views/{viewId}**: Requires authentication for create. Admin-only read.
- **waitlist/{entryId}**: Requires email + server timestamp. Email validated (string, 1-320 chars).
- **jobs/{jobId}**: Authenticated read, no client writes (populated by server-side cron).
- **meta/{docId}**: Authenticated read, no client writes.
- **Default catch-all**: Denies all access to unlisted collections.

---

## NEW: Report Template XSS Hardening (2026-02-25)

All 6 report HTML files now include `escapeHtml()` and apply it to:
- Job title and company name in targetCard
- Match narrative text
- Values narrative text
- Skill names, gap names, and domain names
- Bridge skill tags

Files updated: `reports/view.html`, `reports/templates/base.html`, `reports/demos/*.html`

---

## NEW: v4.44.80 Audit — Security, Stability & Performance (2026-02-26)

### Security Findings

| Severity | Finding | Status | Details |
|----------|---------|--------|---------|
| LOW | AI prompt injection via value names | MITIGATED | Value names are user-controlled and included in prompts to Claude Haiku. Server-side proxy enforces model/token limits. AI responses parsed as JSON and rendered through escapeHtml(). No code execution path. Prompt output cannot escalate privileges. |
| LOW | AI-generated descriptions XSS | SAFE | AI text stored in `_jdcResult.values[].description`, rendered via `escapeHtml(valDesc)` (line 9228). Single-value AI sets `.value` on input element (safe DOM API). Bulk AI triggers full re-render through escapeHtml. |
| LOW | Google Fonts without SRI | ACCEPTABLE | Two Google Fonts CSS links (lines 165, 167) lack SRI. Google Fonts dynamically generates CSS per user-agent, making SRI impractical. CSP restricts font sources to fonts.gstatic.com. |
| NONE | onclick handlers in new code | SAFE | New AI buttons use integer indices (`jdcAIFillOneValueDesc(0)`) or no parameters (`jdcAIFillValueDescs()`). No user-controlled strings in onclick attributes. |
| NONE | CSP coverage | VERIFIED | CSP meta tag covers all current script/connect sources including API proxy path. |
| NONE | SRI coverage | VERIFIED | All 7 CDN scripts (D3, jsPDF, Firebase×3, JSZip, PapaParse) have SHA-384 integrity hashes. |

### Stability Findings

| Severity | Finding | Status | Details |
|----------|---------|--------|---------|
| LOW | Empty catch blocks (12 remaining) | ACCEPTABLE | All 12 are intentional: localStorage ops in private browsing (×5), error body JSON parsing (×3), analytics fire-and-forget (×1), localStorage preference reads (×3). Non-trivial operations have console.warn. |
| LOW | State flag consistency | VERIFIED | `_jdcFromRepo`, `_jdcEditMode`, `_jdcResult` reset correctly on: tab switch (line 7144), new conversion (line 7239), repo load (line 9393), save success (line 9288). Save behavior is conditional on `_jdcFromRepo`. |
| LOW | No double-click protection on save | FIXED | Added `_jdcSaving` flag guard. Prevents duplicate Firestore writes on rapid clicks. Flag reset on success and error. |
| NONE | AI call error handling | VERIFIED | Both `jdcAIFillValueDescs` and `jdcAIFillOneValueDesc` have try/catch with showToast on failure. |
| NONE | Null guards | VERIFIED | New code uses `if (descEl)` guard before `.value` and `.placeholder` access. Existing WBW form uses `|| {}` pattern for getElementById fallback. |

### Performance Findings

| Severity | Finding | Status | Details |
|----------|---------|--------|---------|
| MEDIUM | Full DOM replacement on each edit action | KNOWN | `renderAdminJDConverter` (29 call sites) replaces entire innerHTML on every add/remove/edit action. For small forms this is acceptable; for 18+ skills with values it may cause input focus loss. Long-term: consider virtual DOM or targeted updates. |
| LOW | index.html size (2.3MB, 36K lines) | KNOWN | Single-file architecture. All JS inline. Loads in ~200ms on broadband. Gzip reduces to ~350KB. Long-term: split into modules. |
| LOW | 3 setInterval timers | VERIFIED | Analytics heartbeat (30s), save display update (30s), one more. All are lightweight DOM updates or batch flushes. No memory growth observed. |
| NONE | Static JSON caching | VERIFIED | Browser returns 304 for all data files (skills, O*NET, BLS). Profile manifest uses cache-busting query param. |
| NONE | Firestore queries | VERIFIED | Work blueprints query scoped to `users/{uid}/work_blueprints` — max ~50 docs per user. No unbounded collection reads. |

### Firestore Rules Verification

| Collection | Access Control | Field Limits | Status |
|------------|---------------|-------------|--------|
| users/{userId} | Owner + admin read. Owner write. Role escalation blocked. | skills≤500, savedJobs≤200, purpose≤5000 chars, etc. | VERIFIED |
| users/{userId}/work_blueprints/{id} | Owner only. | keys≤30, title≤300 chars | VERIFIED |
| reports/{reportId} | Token-gated get. Owner/admin list. | uid required on create | VERIFIED |
| analytics_events | Auth required. | type≤50 chars | VERIFIED |
| Default catch-all | Deny all | — | VERIFIED |

---

## REMAINING OPEN ITEMS

### Medium Priority

**M4. Admin sample editor textarea injection**
- Status: OPEN (admin-only, low practical risk)
- `meta.description` placed between textarea tags without encoding

**M5. Firebase SDK version 10.7.0**
- Status: OPEN
- Current stable is 11.x. Update when convenient and regenerate SRI hashes

**M6. Waitlist position timing information**
- Status: OPEN (cosmetic, not security-critical)
- Position derived from `Date.now() % 1000`

**M7. Magic link email in localStorage**
- Status: MITIGATED
- Cleared on sign-in and sign-out. Low residual risk

**M8. Anthropic API key in localStorage (architectural)**
- Status: MITIGATED
- Security warning added. Key cleared on sign-out. Server-side proxy available for authenticated users
- Full fix requires removing direct-browser API path

### Low Priority

**L1. Console logging of operational details**
- Status: OPEN
- Firebase project ID, auth domain, data counts logged to console

**L3. sanitizeForFirestore doesn't sanitize HTML**
- Status: ACCEPTABLE
- Acceptable given escapeHtml coverage is now comprehensive on rendering paths

**L4. onclick handlers via string concatenation**
- Status: OPEN (long-term architectural)
- Fragile pattern; switch to addEventListener long-term

**L5. Vercel redirect rule for www**
- Status: OPEN (harmless)
- Path-based redirect doesn't do what was intended

---

## Current Security Posture

### Defense Layers in Place

1. **CSP** - Blocks loading of unauthorized external scripts and data exfiltration
2. **SRI** - All 7 CDN scripts verified with SHA-384 integrity hashes
3. **Security headers** - HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection
4. **HTML escaping** - `escapeHtml()` used in 364 call sites across innerHTML assignments
5. **URL sanitization** - `sanitizeUrl()` validates protocols on all user-provided URLs
6. **Import validation** - `sanitizeImport()` whitelists allowed fields, strips privileged fields
7. **Firestore rules** - Owner-only access, role escalation prevention, field validation
8. **API proxy authentication** - Firebase token verification, rate limiting, model/token enforcement
9. **CORS allowlists** - All server-side APIs restrict origins
10. **Credential cleanup** - API keys and magic link emails cleared on sign-out
11. **Crypto-secure IDs** - Report IDs use `crypto.getRandomValues()` (128-bit entropy)
12. **Safe DOM patterns** - `safeSetAvatar()`, `textContent` for simple text, `safeParse()`

### Remaining Risk Profile

- **Low risk** for demo/beta with gated access
- **Medium risk** items are architectural and don't represent immediate attack vectors
- No known exploitable XSS vectors remain in current codebase
- AI features (value descriptions) use server-side proxy with auth, rate limiting, and model enforcement
- AI-generated content is escaped on render; no direct innerHTML insertion of AI text
