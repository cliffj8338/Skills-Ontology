# Blueprint Security Hardening Audit
## Updated: 2026-02-26 | Codebase: v4.44.71
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
4. **HTML escaping** - `escapeHtml()` used in 121+ innerHTML assignments
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
