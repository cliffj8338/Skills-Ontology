# Blueprint™ Session Summary — February 23, 2026 (Night #2)
## LinkedIn Data Import + Quick Profile Builder

### Version: v4.39.0.0 (from v4.38.5.0)

---

## What Was Built

### 1. LinkedIn Data Archive Import (p2-3a)
- **Path**: User uploads LinkedIn GDPR data export (.zip) from Settings & Privacy → Get a copy of your data
- **Parsing**: Client-side only via JSZip + PapaParse — zero server cost, zero latency
- **Files parsed**: Profile.csv, Positions.csv, Skills.csv, Education.csv, Certifications.csv, Languages.csv, Projects.csv, Email Addresses.csv
- **Privacy**: Entire .zip is parsed in the browser. No LinkedIn data touches any server.
- **Skill inference**: After CSV parse, sends skill list + work history to Claude for level/category inference (~$0.01, 3-5s). Falls back to "Proficient" default if API unavailable.
- **CDN deps added**: JSZip 3.10.1, PapaParse 5.4.1

### 2. Three-Path Onboarding Wizard (p2-3b)
- **Step 1** now presents three cards: Upload Resume, LinkedIn Import, Start Fresh
- **Resume path**: Existing flow (paste text or upload → Claude parse → review)
- **LinkedIn path**: Drop/browse .zip → instant CSV parse → optional AI skill inference → review
- **Manual path**: Skip to profile form
- **All paths converge** at Step 4 (Profile Review) through the same review/confirm/save flow
- **Back button**: Smart navigation that skips the AI parsing step when coming from LinkedIn or manual mode

### 3. Research Deliverable
- Full analysis of all 5 LinkedIn integration options (OIDC, API v2, PDF export, GDPR archive, scraping)
- Identified Firebase Auth OIDC incompatibility with LinkedIn discovery document path
- Recommended strategy: Lead with GDPR archive (zero-cost structured data) and resume upload (existing infra)
- LinkedIn OAuth deferred to Phase 2 (marginal auth value, Google already covers identity)

---

## Research Findings (Key Decisions)

### Why LinkedIn GDPR Archive over LinkedIn OAuth
| Approach | Career Data? | Cost | Approval | Latency |
|----------|-------------|------|----------|---------|
| OIDC Sign-In | No (name/email only) | Free | Self-service | N/A |
| API v2 Full Profile | Yes | $$$ (partner) | Weeks-months | Fast |
| Profile PDF | Yes | ~$0.03 AI | None | 10-15s |
| **GDPR Archive (.zip)** | **Yes** | **$0** | **None** | **<1s** |
| Scraping | Yes | Legal risk | ToS violation | N/A |

### Firebase Auth + LinkedIn OIDC Problem
- Firebase OIDC expects discovery at `{issuer}/.well-known/openid-configuration`
- LinkedIn hosts it at `{issuer}/oauth/.well-known/openid-configuration`
- Workaround exists (serverless callback → custom token) but adds complexity for marginal value
- Deferred to Phase 2

---

## Files Changed

| File | Status | Notes |
|------|--------|-------|
| `index.html` | Updated | v4.39.0.0 — LinkedIn import, 3-path wizard, JSZip/PapaParse CDN |

---

## Data Flow: LinkedIn .zip Import

```
User uploads .zip
  → JSZip extracts in browser
  → PapaParse reads CSVs (Profile, Positions, Skills, Education, Certs)
  → Map to wizardState fields
  → Send skill names + work history to Claude for level inference
  → Fall back to "Proficient" if API unavailable
  → wizardState.step = 4 (Profile Review)
  → User confirms/edits → same flow as resume import
  → saveToFirestore()
```

## New Functions Added

| Function | Purpose |
|----------|---------|
| `wizardChooseLinkedIn()` | Entry mode setter for LinkedIn path |
| `renderWizardStep2LinkedIn(el)` | LinkedIn-specific Step 2 UI with drag/drop zone + instructions |
| `wizardHandleLinkedInDrop(event)` | Drag-and-drop handler for .zip files |
| `wizardHandleLinkedInFile(event)` | File input handler for .zip files |
| `wizardParseLinkedInZip(file)` | Core parser: JSZip → PapaParse → Claude inference → wizardState |

---

## Roadmap Status

### Done (this session)
- p2-3a: LinkedIn profile import (GDPR archive, client-side CSV parse)
- p2-3b: Quick profile builder (3-path wizard)

### Next Session Candidates
- **p2-4: LinkedIn OAuth sign-in** — Serverless callback, Firebase custom token, "Sign in with LinkedIn" button
- **p2-5: Resume PDF upload** — File upload to /api/ai.js (currently paste-only, need actual file upload handler)
- **p2-6: Onboarding analytics** — Track which import path users choose, completion rates, drop-off points
- **p3-1: Workforce Skill Mapping** — CSV roster upload for CHRO product (monetization)

### Known Issues
- JSZip and PapaParse CDN scripts don't have SRI hashes (should generate and add for security)
- LinkedIn .zip CSV column names may vary by export language/date — currently assumes English headers
- Resume Step 2 still paste-only (no actual file upload for PDF — user must paste text or use LinkedIn .zip)
