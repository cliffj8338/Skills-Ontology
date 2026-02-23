# Blueprint™ Security & Stability Context
## Living Document — Updated 2026-02-23

This document is reviewed at the start of every Blueprint development session. It tracks the current security posture, known risks, architecture decisions, and the roadmap toward PII-safe production infrastructure.

---

## Current Security Posture

### Hardened (2026-02-23)
- [x] Content Security Policy (CSP) via vercel.json
- [x] HSTS (Strict-Transport-Security)
- [x] X-Frame-Options: SAMEORIGIN
- [x] X-Content-Type-Options: nosniff
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Permissions-Policy: camera, mic, geolocation denied
- [x] CDN scripts crossorigin-ready (SRI hashes pending generation)
- [x] escapeHtml on all error messages (6 instances)
- [x] escapeHtml on all photoURL/dataUrl rendering (4 instances)
- [x] escapeHtml on showToast (global coverage)
- [x] escapeHtml on profile names in banners (source-level)
- [x] escapeHtml on external API data (job title, company, location)
- [x] Job URL protocol validation (blocks javascript: URIs)
- [x] Report IDs use crypto.getRandomValues (128-bit entropy)
- [x] Third-party CORS proxies removed
- [x] document.write eliminated
- [x] Firestore rules: analytics_events requires auth
- [x] Firestore rules: report_views field validation
- [x] Firestore rules: waitlist field limits + server timestamp
- [x] Firestore rules: role escalation prevention
- [x] Demo mode firewalled from Firestore writes

### Pending
- [ ] SRI hashes on 5 CDN scripts (run generate-sri-hashes.sh)
- [ ] SRI hashes on 4 scouting report D3 tags
- [ ] Systematic audit of remaining ~130 innerHTML assignments
- [ ] Firebase SDK update (10.7.0 → latest stable)
- [ ] Anthropic API key proxy (move from client-side to serverless)

---

## Architecture: Current State

```
┌─────────────────────────────────────────────────┐
│                   Vercel (CDN)                   │
│  Static hosting: index.html, CSS, JSON profiles  │
│  Security headers via vercel.json                │
└──────────────────────┬──────────────────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
   ┌────────▼────────┐  ┌────────▼────────┐
   │  Firebase Auth   │  │ Firestore DB    │
   │  - Email/pass    │  │ - users/{uid}   │
   │  - Magic link    │  │ - reports/{}    │
   │  - Google OAuth  │  │ - waitlist/{}   │
   └─────────────────┘  │ - analytics/{}  │
                         │ - report_views/ │
                         └─────────────────┘
            │
   ┌────────▼────────┐
   │ Anthropic API    │
   │ (direct browser) │
   │ Key in localStorage│
   └─────────────────┘
```

### What This Means for PII

**Good:** No custom server code. Firebase handles auth, sessions, encryption at rest, encryption in transit. Vercel handles TLS, DDoS protection, edge caching.

**Risk areas:**
1. Anthropic API key in browser = visible to extensions, DevTools, XSS
2. All application logic is client-side = fully inspectable, modifiable
3. Report data stored as JSON string in Firestore = no field-level encryption
4. No server-side validation layer = Firestore rules are the only gate

---

## Architecture: PII-Ready Target State

```
┌─────────────────────────────────────────────────┐
│                   Vercel (CDN)                   │
│  Static: index.html, CSS, JSON profiles          │
│  CSP + HSTS + security headers                   │
└──────────────────────┬──────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
 ┌────────▼────────┐    ┌──────────▼──────────┐
 │  Firebase Auth   │    │  Vercel Serverless   │
 │  (unchanged)     │    │  /api/ai-proxy       │
 └─────────────────┘    │  /api/cors-proxy     │
                         │  /api/export         │
          │              └──────────┬──────────┘
          │                         │
 ┌────────▼────────┐    ┌──────────▼──────────┐
 │  Firestore DB    │    │  Anthropic API       │
 │  (unchanged +    │    │  (key server-side)   │
 │   tighter rules) │    └─────────────────────┘
 └─────────────────┘
```

### Migration Steps (in order)

#### Phase 1: API Proxy (Priority: HIGH)
**Why:** Removes API key from browser entirely.
**What:** Single Vercel serverless function at `/api/ai`:
- Accepts auth token in header
- Validates Firebase ID token server-side
- Forwards request to Anthropic with server-held key
- Returns response to client
**Effort:** ~2-3 hours
**Impact:** Eliminates C3 from audit, blocks API key theft

#### Phase 2: CORS Proxy (Priority: MEDIUM)
**Why:** Job board APIs need CORS workaround, but third-party proxies leak data.
**What:** Vercel serverless function at `/api/fetch`:
- Allowlist of permitted domains (remotive.com, himalayas.app, jobicy.com)
- Validates and proxies requests
- No open redirect risk
**Effort:** ~1 hour
**Impact:** Restores job board functionality without data leakage

#### Phase 3: Report Access Control (Priority: MEDIUM)
**Why:** Shared reports contain full career data, currently world-readable with guessable IDs.
**What:** Two options:
- **Option A (simple):** Add `shareToken` field to report doc, require token in URL query param, validate in Firestore rules. Share URL becomes `/report/{id}?token={random}`.
- **Option B (full):** Server-side report rendering. Report viewer calls `/api/report/{id}` which validates access before returning data.
**Effort:** Option A ~1 hour, Option B ~4 hours
**Impact:** Prevents unauthorized report access

#### Phase 4: Field-Level Encryption for PII (Priority: FUTURE)
**Why:** Defense-in-depth. If Firestore access is compromised, PII fields remain encrypted.
**What:** Encrypt sensitive fields (name, email, phone, compensation) client-side before Firestore write, decrypt on read. Key derived from user's auth token.
**Effort:** ~4-6 hours
**Impact:** PII protection even against database compromise
**When:** Before storing real compensation data or contact information at scale

#### Phase 5: Data Residency & Compliance (Priority: FUTURE)
**Why:** Enterprise customers will ask about GDPR, CCPA, data location.
**What:**
- Firestore region selection (currently default)
- Data export functionality (user's right to portability)
- Data deletion workflow (right to be forgotten)
- Privacy policy covering specific data collected
- Cookie consent (if analytics cookies added later)
**Effort:** ~1-2 weeks
**When:** Before enterprise pilots

---

## Session Review Checklist

At the start of each Blueprint session, quickly verify:

1. **Any new innerHTML additions?** → Must use escapeHtml for any variable data
2. **Any new Firestore collections/rules?** → Must follow principle of least privilege
3. **Any new external data sources?** → Must escape before rendering, validate URLs
4. **Any new CDN dependencies?** → Must add SRI hashes
5. **Version bump needed?** → Every deployment gets a version increment
6. **CSP still covers new domains?** → Update connect-src if new APIs added

---

## Sensitive Data Inventory

| Data Type | Where Stored | Encrypted at Rest | Access Control |
|-----------|-------------|-------------------|----------------|
| Email | Firestore users/{uid} | Firebase default | Owner + admin |
| Name | Firestore users/{uid} | Firebase default | Owner + admin |
| Phone | Firestore users/{uid} | Firebase default | Owner + admin |
| Compensation | Firestore users/{uid} | Firebase default | Owner + admin |
| Skills + Evidence | Firestore users/{uid} | Firebase default | Owner + admin |
| Career History | Firestore users/{uid} | Firebase default | Owner + admin |
| Values/Purpose | Firestore users/{uid} | Firebase default | Owner + admin |
| Report Data | Firestore reports/{id} | Firebase default | Currently public read |
| Anthropic API Key | localStorage | None | Any script/extension |
| Magic Link Email | localStorage (temp) | None | Any script/extension |
| Waitlist Info | Firestore waitlist/{id} | Firebase default | Admin only |

---

## Incident Response (Pre-Scale)

If a security issue is discovered:
1. **Assess severity** — Does it expose PII? Is it actively exploitable?
2. **Contain** — If Firestore rules, deploy fix immediately via Firebase CLI
3. **Fix** — If client-side, push to Vercel (auto-deploys from repo)
4. **Verify** — Check fix in production, test exploit no longer works
5. **Document** — Update this file with what happened and what changed

---

## Change Log

| Date | Change | Category |
|------|--------|----------|
| 2026-02-23 | Initial security audit + 22 fixes implemented | Hardening |
| 2026-02-23 | CSP, HSTS, X-XSS-Protection headers added | Headers |
| 2026-02-23 | escapeHtml coverage: 17 → 39 instances | XSS Prevention |
| 2026-02-23 | Report IDs upgraded to crypto.getRandomValues | Access Control |
| 2026-02-23 | Third-party CORS proxies removed | Data Leakage |
| 2026-02-23 | Firestore rules hardened (auth, field validation) | Access Control |
| 2026-02-23 | This document created | Process |
