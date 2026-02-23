# Blueprint Session — v4.39.1.0 Hardening
## February 23, 2026

### Changes from v4.39.0.0

---

## 1. SRI Hashes Applied (Security)

All 7 CDN scripts in index.html now have integrity attributes:

| Library | Version | Hash Algorithm |
|---------|---------|----------------|
| D3.js | 7.9.0 | sha384 |
| jsPDF | 2.5.1 | sha384 |
| Firebase App | 10.7.0 | sha384 |
| Firebase Auth | 10.7.0 | sha384 |
| Firebase Firestore | 10.7.0 | sha384 |
| **JSZip** | **3.10.1** | **sha512** |
| **PapaParse** | **5.4.1** | **sha512** |

Hashes sourced from cdnjs (verified via web search against published integrity values). Browser will block any tampered CDN assets.

---

## 2. Resume PDF File Upload (Feature)

Wizard Step 2 now has **three tabs** (was two):

| Tab | Function |
|-----|----------|
| **Upload PDF** (default) | Drag-and-drop or file picker, 10 MB limit |
| Paste Text | Existing text paste flow |
| LinkedIn Text | Existing LinkedIn text paste |

**How it works:**
- User drops/selects a PDF file
- `FileReader` reads it as base64
- On parse, sent to Claude API as a `document` content block (native PDF processing)
- Claude extracts structured data from the PDF directly, no intermediate text extraction needed
- File info shows name + size with remove button
- State tracks `resumeFileBase64`, `resumeFileName`, `resumeFileSize`

**New functions:** `wizardHandleResumeDrop()`, `wizardHandleResumeFile()`, `wizardProcessResumeFile()`, `wizardClearResumeFile()`

---

## 3. LinkedIn CSV Header Normalization (Resilience)

Added `normalizeLinkedInRow()` function with a comprehensive header mapping that handles:

- **Case variations**: "Company Name" vs "company name" vs "COMPANY NAME"
- **Spacing/formatting**: "start_date" vs "Start Date" vs "Started On"
- **LinkedIn version changes**: "Geo Location" vs "Location", "Field Of Study" vs "Notes"
- **BOM removal**: Strips `\uFEFF` characters from CSV headers
- **Multi-name columns**: "Credential ID" → "License Number", "Issuing Organization" → "Authority"

**44 header mappings** covering Profile, Positions, Skills, Education, Certifications, and Email CSVs.

Applied via `.map(normalizeLinkedInRow)` to every parsed CSV row before field extraction. All field extractors also have fallback chains (e.g., `row['Headline'] || row['Title'] || ''`).

---

## Roadmap Updates

| ID | Item | Status |
|----|------|--------|
| s7 | SRI hashes on CDN scripts | done (updated: 7 scripts) |
| p2-3c | Resume PDF file upload | done |
| p2-3d | LinkedIn CSV header normalization | done |
