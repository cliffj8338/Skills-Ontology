# Blueprint™ Security Hardening Audit
## Conducted: 2026-02-23 | Codebase: v4.37.13.0

---

## Executive Summary

Blueprint's security posture is **reasonable for a preview/beta product** but has several gaps that should be closed before any real user PII flows through it. The Firestore rules are well-structured for the most part. The biggest systemic issue is the absence of a Content Security Policy, which leaves the entire app open to injection attacks if any single XSS vector is exploited. The second systemic issue is inconsistent HTML escaping across 169 innerHTML assignments.

Nothing here is "hair on fire" for a demo-mode product with gated access, but several items become urgent the moment real users with real career data are on the platform.

---

## CRITICAL (Fix Before Real Users)

### C1. No Content Security Policy (CSP)
**Location:** `vercel.json` headers, `index.html` meta tags
**Finding:** No CSP header or meta tag exists anywhere. This is the single highest-impact security gap. Without CSP, any successful XSS injection can load arbitrary scripts, exfiltrate data, or hijack sessions.
**Risk:** If any of the innerHTML XSS vectors below are exploited, there is zero defense-in-depth.
**Fix:** Add to `vercel.json` global headers:
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://www.gstatic.com https://apis.google.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.anthropic.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com wss://*.firebaseio.com; img-src 'self' data: blob: https://*.googleusercontent.com; frame-src 'self' blob:; object-src 'none'; base-uri 'self'"
}
```
**Note:** `'unsafe-inline'` for scripts is needed due to the inline `<script>` architecture. Long-term, moving to external JS files + nonces would allow dropping this, but the CSP above still blocks the most dangerous attack vectors (loading external malicious scripts, data exfiltration to unauthorized domains).

### C2. No Subresource Integrity (SRI) on CDN Scripts
**Location:** `index.html` lines 11-15, scouting report HTMLs line 8
**Finding:** Five external scripts load without integrity hashes:
- `d3@7.9.0` from jsdelivr
- `jspdf@2.5.1` from cdnjs
- `firebase-app-compat@10.7.0` from gstatic
- `firebase-auth-compat@10.7.0` from gstatic
- `firebase-firestore-compat@10.7.0` from gstatic

If any CDN is compromised or MITM'd, arbitrary code executes with full access to user data and Firebase credentials.
**Fix:** Add `integrity` and `crossorigin="anonymous"` attributes to every external script tag. Generate hashes with `shasum -b -a 384` or use srihash.org.

### C3. Anthropic API Key Stored in localStorage, Sent from Browser
**Location:** Lines ~1211-1217 (safeGet/safeSet), ~6868, ~7280, ~16906, ~17094, ~17278, ~17838
**Finding:** User's Anthropic API key is stored in `localStorage` as plaintext (`wbAnthropicKey`) and sent directly from the browser to `api.anthropic.com` with `anthropic-dangerous-direct-browser-access: true`. This header exists for a reason: it's dangerous.
**Risks:**
- Any XSS exploit can steal the key from localStorage
- The key is visible in browser DevTools → Application → Local Storage
- The key is sent in request headers visible in Network tab
- Browser extensions can read localStorage
- The key grants full API access to the user's Anthropic account
**Fix (short-term):** Add prominent UI warning that the key is stored locally and visible to browser extensions. Clear key on sign-out (already done ✓).
**Fix (long-term):** Proxy AI calls through a backend endpoint that holds the key server-side. This eliminates client-side key exposure entirely.

### C4. XSS via Error Messages in innerHTML (5 instances)
**Location:** Lines 2440, 2495, 2717, 2882, 17903
**Finding:** Error `.message` properties are injected directly into innerHTML:
```js
container.innerHTML = '<div style="color:#ef4444;">Error: ' + err.message + '</div>';
```
If an attacker can influence error messages (e.g., through a crafted Firestore document name, API response, or network error), they can inject HTML/JS.
**Fix:** Use `escapeHtml(err.message)` in all five locations. Or use `textContent` for the error message portion.

### C5. XSS via Firebase photoURL in innerHTML
**Location:** Lines 1766, 24130
**Finding:** `fbUser.photoURL` is injected directly into an `<img src="...">` via innerHTML without escaping:
```js
avatarEl.innerHTML = '<img src="' + fbUser.photoURL + '" alt=""...>';
```
Firebase allows users to set custom photoURLs via the Admin SDK or through linked OAuth providers. A malicious photoURL like `" onerror="alert(1)` or containing a `javascript:` URI could execute code.
**Fix:** Escape the URL: `escapeHtml(fbUser.photoURL)` or validate it starts with `https://`.

---

## HIGH (Fix Before Public Launch)

### H1. Inconsistent innerHTML Escaping (169 assignments, ~150 without escapeHtml)
**Location:** Throughout index.html
**Finding:** `escapeHtml()` exists and is used in ~16 places (mostly admin panel). But ~150 innerHTML assignments use raw variable interpolation. While many of these use hardcoded strings or data that originates from the app itself rather than user input, the inconsistency means any future code change could introduce XSS.
**Key unescaped locations with user-controlled data:**
- Line 3372: `pName` (profile name) in banner innerHTML
- Line 9565: `name` variable in report header
- Line 9991: `userData.preferences.seniorityLevel` in stats bar
- Line 22663, 23249: `userData.roles` rendered into innerHTML
- Line 22694: `file.name` (uploaded CSV filename) into innerHTML
**Fix:** Establish a rule: every variable interpolated into innerHTML must pass through `escapeHtml()`. Audit all 169 instances. For bulk rendering, consider switching to `textContent` for data portions or using a template literal helper that auto-escapes.

### H2. Reports Collection is World-Readable
**Location:** Firestore rules, `reports/{reportId}` → `allow read: if true`
**Finding:** Any person with a report ID can read the full report document, which contains `JSON.stringify(reportData)` including the candidate's name, title, location, skills, evidence outcomes, values, education, and certifications.
**Risk:** Report IDs use `Date.now().toString(36) + Math.random().toString(36).substring(2,6)` which provides ~61 bits of entropy. While not trivially guessable, `Math.random()` is not cryptographically secure and report IDs are sequential (the timestamp portion is monotonically increasing), making enumeration feasible for a determined attacker.
**Fixes:**
1. Use `crypto.getRandomValues()` for report IDs (128+ bits of entropy)
2. Consider adding a `sharedWith` field and Firestore rule requiring either ownership or being in the shared list
3. At minimum, add a random access token appended to the share URL that's validated in the read rule

### H3. Unauthenticated Firestore Writes (Billing/Abuse Vector)
**Location:** Firestore rules for `analytics_events`, `report_views`, and `waitlist`
**Finding:**
- `analytics_events`: `allow create: if true` with only type string validation (≤50 chars)
- `report_views`: `allow create: if true` with no field validation
- `waitlist`: `allow create` with basic field validation but no rate limiting

An attacker can write unlimited documents to these collections, potentially:
- Running up Firestore billing (each write costs)
- Flooding waitlist with fake entries
- Filling analytics with garbage data
**Fixes:**
1. For `analytics_events`: Require authentication (`isAuth()`). The client code already gates on `fbUser` (line 2920: `if (!fbDb || !fbUser) return`), so the rule should match.
2. For `report_views`: Add field validation (required fields, size limits) and consider requiring auth.
3. For `waitlist`: Add a rate limit via Cloud Functions or at minimum validate `createdAt` is a server timestamp.

### H4. Job URLs Rendered as href Without Protocol Validation
**Location:** Lines 19286, 19296, 19333
**Finding:** `job.url` from API responses (Remotive, Himalayas, Jobicy) is placed directly into `<a href="...">` without validating the protocol:
```js
var jobUrl = job.url || '#';
// ...
'<a href="' + jobUrl + '" target="_blank"...'
```
If an API returns `javascript:alert(1)` as a URL, it would execute on click.
**Fix:** Validate URLs start with `https://` or `http://` before rendering:
```js
var jobUrl = (job.url && /^https?:\/\//i.test(job.url)) ? job.url : '#';
```

### H5. CORS Proxy Data Leakage
**Location:** Lines 19421-19437
**Finding:** Job search results are fetched through `corsproxy.io` and `allorigins.win` as fallbacks. These third-party services see the full request URL and can intercept response data.
**Risk:** User's job search queries and results pass through untrusted third parties.
**Fix:** Remove third-party CORS proxies. If CORS is needed, deploy a lightweight proxy as a Vercel serverless function (`/api/proxy`) that you control.

### H6. AI-Parsed Resume Data Rendered with Incomplete Escaping
**Location:** Lines 6990-7048 (wizardField, renderWizardStep4)
**Finding:** Claude's parsed resume response populates input fields via:
```js
value="${(value || '').replace(/"/g, '&quot;')}"
```
This escapes double quotes but not `<`, `>`, or `'`. While input `value` attributes are generally safe from script execution, the `executiveSummary` flows into a textarea's text content (line 7021) without escaping, and the error handler at line ~6962 puts `err.message` directly into innerHTML.
**Fix:** Use full HTML entity escaping for all AI-returned data, not just `&quot;`.

---

## MEDIUM (Fix Before Scale)

### M1. No HSTS Header
**Location:** `vercel.json`
**Finding:** No `Strict-Transport-Security` header. While Vercel serves HTTPS by default, HSTS tells browsers to always use HTTPS, preventing downgrade attacks.
**Fix:** Add to global headers:
```json
{ "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" }
```

### M2. No X-XSS-Protection Header
**Location:** `vercel.json`
**Finding:** While largely deprecated in favor of CSP, `X-XSS-Protection: 0` should be set to disable browser XSS "auditors" which can sometimes be exploited.
**Fix:** Add `{ "key": "X-XSS-Protection", "value": "0" }` (modern best practice is to disable it and rely on CSP).

### M3. document.write Usage
**Location:** Line 533
**Finding:** `document.write(new Date().getFullYear())` for copyright year. Minor, but `document.write` is blocked by some CSP configurations and is a code smell.
**Fix:** Replace with: `<span id="copyrightYear"></span>` + `document.getElementById('copyrightYear').textContent = new Date().getFullYear();`

### M4. Admin Sample Editor Textarea HTML Injection
**Location:** Line 2575
**Finding:** `meta.description` is placed between textarea tags without encoding:
```js
'<textarea id="editSampleDesc">' + (meta.description || '') + '</textarea>'
```
If a sample description contains `</textarea><script>...`, it could break out. Only exploitable by an admin editing their own sample data, so low practical risk.
**Fix:** Escape `<` as `&lt;` in textarea content: `escapeHtml(meta.description || '')`

### M5. Firebase SDK Version
**Location:** Lines 13-15
**Finding:** Firebase JS SDK 10.7.0. Current stable is 11.x. Older versions may have known vulnerabilities.
**Fix:** Update to latest stable Firebase JS SDK and regenerate SRI hashes.

### M6. Waitlist Position Leaks Timing Information
**Location:** Line 3319
**Finding:** `var position = Date.now() % 1000` — waitlist position is derived from timestamp modulo, which is not meaningful as a queue position and could confuse users. Not a security issue per se, but misrepresents data.
**Fix:** Use Firestore transaction to get actual count, or generate a random position for display purposes.

### M7. Magic Link Email in localStorage
**Location:** Lines 1605, 1641, 1648
**Finding:** `localStorage.setItem('wbMagicLinkEmail', email)` stores the user's email in localStorage for the magic link flow. This is Firebase's recommended pattern, but the email is accessible to any script or browser extension.
**Fix:** Already cleared on successful sign-in ✓ and on sign-out ✓. Low residual risk. Consider using `sessionStorage` instead since magic links are same-session.

---

## LOW (Cleanup / Best Practice)

### L1. Console Logging of Operational Details
**Location:** Multiple (Firebase project ID, auth domain, data counts, etc.)
**Finding:** Console logs expose internal operational information. Not a direct vulnerability but aids reconnaissance.
**Fix:** Wrap in a debug flag: `if (BP_DEBUG) console.log(...)` that's false in production.

### L2. Scouting Report Demo HTMLs Load D3 Without SRI
**Location:** Line 8 of all four report HTMLs
**Finding:** `<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>` without version pin or SRI. Uses floating `@7` which resolves to latest 7.x, meaning the loaded code could change without your knowledge.
**Fix:** Pin version (`d3@7.9.0`) and add SRI hash.

### L3. The `sanitizeForFirestore` Function Doesn't Sanitize HTML
**Location:** Lines 1796-1807
**Finding:** The function strips `undefined` values (good for Firestore) but does not sanitize HTML content in string values. Any HTML in user-provided strings survives into Firestore.
**Fix:** This is acceptable IF all rendering paths escape HTML. Given H1 above, this becomes a latent risk. Consider adding HTML stripping for text fields at the Firestore write boundary as defense-in-depth.

### L4. onclick Handlers Built via String Concatenation
**Location:** Lines 2536-2537, 2586-2587, 2688, 2854, 3884, 3962, 4778, 20458
**Finding:** onclick handlers are built by concatenating escaped strings into HTML. While `escapeHtml` is used for the data portions in admin contexts, the pattern is fragile and any missed escape creates XSS.
**Fix:** Long-term, switch to `addEventListener` patterns or a lightweight framework. Short-term, audit each instance to verify escaping.

### L5. Vercel Redirect Rule
**Location:** `vercel.json` redirects
**Finding:** `"/www.myblueprint.work"` redirects to `"https://myblueprint.work"`. This source pattern matches a path, not a domain. The redirect only triggers if someone visits `myblueprint.work/www.myblueprint.work`, which is unlikely. Not harmful, but not doing what was probably intended.
**Fix:** This redirect is typically handled at the DNS/Vercel project level, not in vercel.json. Can be removed unless it serves a specific purpose.

---

## What's Already Good

- **Firestore rules are well-structured.** Owner-only access for user documents, role escalation prevention on create/update, admin checks via server-side role lookup.
- **escapeHtml exists and is used in admin panels** where Firestore-sourced user data (names, emails) is displayed.
- **Demo mode is properly firewalled** from Firestore writes (line 1818: demo guard on save).
- **Magic link email is cleared** on both successful sign-in and sign-out.
- **API key is cleared on sign-out.**
- **X-Frame-Options: SAMEORIGIN** prevents clickjacking.
- **X-Content-Type-Options: nosniff** prevents MIME sniffing.
- **Referrer-Policy** is set to strict-origin-when-cross-origin.
- **Permissions-Policy** blocks camera, mic, and geolocation.
- **Report view.html has DENY framing and no-store caching.**
- **noopener noreferrer** on external links.
- **Input value attributes** use `&quot;` escaping for double quotes.
- **Firestore user role escalation is prevented** in rules (update cannot change role).

---

## Priority Action Plan

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| 1 | Add CSP header to vercel.json | 30 min | Blocks most XSS exploitation |
| 2 | Add SRI to all 5 CDN scripts | 30 min | Prevents CDN compromise |
| 3 | Escape err.message in 5 innerHTML locations | 15 min | Closes direct XSS vectors |
| 4 | Escape photoURL in 2 innerHTML locations | 10 min | Closes auth-based XSS vector |
| 5 | Add HSTS header | 5 min | Prevents protocol downgrade |
| 6 | Validate job URLs (https:// protocol check) | 10 min | Blocks javascript: URI injection |
| 7 | Require auth on analytics_events writes | 5 min | Prevents billing abuse |
| 8 | Use crypto.getRandomValues for report IDs | 15 min | Prevents report enumeration |
| 9 | Audit remaining innerHTML for escaping | 2-3 hrs | Systematic XSS prevention |
| 10 | Remove third-party CORS proxies | 1-2 hrs | Eliminates data leakage to third parties |

Items 1-6 can be done in a single deployment and would materially improve the security posture. Items 7-10 are pre-launch priorities.
