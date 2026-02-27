# Replit — Lightcast Certifications Build Task

**Date**: February 27, 2026
**Context**: Blueprint v4.45.25 already has the loader code deployed. This task produces the data file it expects.

---

## Objective

Format the 3,411 Lightcast certifications from the v4.45.24 build into a deployable JSON file at `certifications/lightcast-certs.json`. The frontend loader is already written and waiting for this file.

---

## Background

During the v4.45.24 session, 3,411 certifications were pulled from the Lightcast Open Skills API (2023-05 dataset). The v4.45.24 handoff noted these were "NOT yet merged into `certification_library.json`."

The v4.45.25 frontend now includes a chained loader that:

1. Loads `certification_library.json` (existing ~45 curated certs)
2. Fetches `certifications/lightcast-certs.json` (this file)
3. Deduplicates by name and abbreviation
4. Merges new entries into the runtime cert library

If the file doesn't exist, the loader fails silently and the base library still works.

---

## Required Output

### File Path
```
certifications/lightcast-certs.json
```

Create the `certifications/` directory at the project root (same level as `skills/`).

### Required Schema

The file must match this exact structure:

```json
{
  "totalCredentials": 3411,
  "source": "lightcast",
  "sourceVersion": "2023-05",
  "generatedAt": "2026-02-27T00:00:00Z",
  "credentials": [
    {
      "name": "Full certification name",
      "abbr": "ABBR",
      "category": "Category Name",
      "description": "Brief description of what this certification covers",
      "provider": "Issuing organization name",
      "skills": [],
      "tier": "standard",
      "source": "lightcast"
    }
  ]
}
```

### Field Requirements

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | Full certification name. Title case. No duplicates. |
| `abbr` | string | Yes | Abbreviation or acronym. Empty string `""` if none exists. |
| `category` | string | Yes | See category mapping below. |
| `description` | string | Yes | 1-2 sentence description. Can be generated from the name if Lightcast doesn't provide one. |
| `provider` | string | Yes | Issuing body (e.g., "Microsoft", "CompTIA", "PMI"). Use `"Various"` if unknown. |
| `skills` | array | Yes | Empty array `[]` is fine. Populate if Lightcast provides skill associations. |
| `tier` | string | Yes | Always `"standard"` for Lightcast certs. The base library uses `"gold"` / `"silver"` for curated certs. |
| `source` | string | Yes | Always `"lightcast"`. |

### Category Mapping

Map Lightcast certification types/categories to these standard categories. Use the closest match:

| Category | Examples |
|----------|----------|
| `Cloud & Infrastructure` | AWS, Azure, GCP, VMware certs |
| `Cybersecurity` | CISSP, CEH, CompTIA Security+, CISM |
| `Data & Analytics` | Tableau, Power BI, Google Analytics, data science certs |
| `Development & Programming` | Language-specific certs, full-stack bootcamp certs |
| `AI & Machine Learning` | TensorFlow, ML certs, AI practitioner |
| `Project Management` | PMP, PRINCE2, Agile/Scrum certs |
| `Networking` | CCNA, CCNP, CompTIA Network+, Juniper |
| `IT Operations` | ITIL, CompTIA A+, ServiceNow, help desk |
| `Finance & Accounting` | CPA, CFA, CFP, enrolled agent, bookkeeping |
| `Healthcare` | HIPAA, medical coding, nursing, EMT |
| `Human Resources` | SHRM, PHR, SPHR, talent management |
| `Marketing & Sales` | Google Ads, HubSpot, Salesforce, digital marketing |
| `Legal & Compliance` | Paralegal, compliance officer, GDPR |
| `Quality & Manufacturing` | Six Sigma, Lean, ISO, ASQ |
| `Education & Training` | Teaching, instructional design, TESOL |
| `Business & Management` | MBA-adjacent certs, leadership, strategy |
| `Design & Creative` | Adobe, UX certs, graphic design |
| `Trades & Safety` | OSHA, CDL, electrical, welding, EPA |
| `General` | Anything that doesn't fit above |

If Lightcast provides its own category field, map it to the closest one above. If there's no category data, infer from the certification name.

---

## Step-by-Step Instructions

### Step 1: Locate the Raw Data

Find the Lightcast certification data from the v4.45.24 build session. It's likely in one of:
- A build script output file
- A raw API response dump
- An intermediate JSON file in the project

Look for files containing ~3,411 certification entries with Lightcast-style fields.

### Step 2: Inspect the Raw Schema

Examine the raw Lightcast data to understand what fields are available. Lightcast typically provides: `id`, `name`, `type`, sometimes `description` or `category`. Note what's present and what needs to be generated.

### Step 3: Transform

Write a script (Node.js or Python) that:

1. Reads the raw Lightcast certification data
2. Maps each entry to the required schema above
3. Generates descriptions from names if not provided (e.g., "Certified Kubernetes Administrator" → "Professional certification for Kubernetes cluster administration and operations")
4. Maps categories using the table above
5. Extracts abbreviations from names where possible (e.g., "Certified Public Accountant (CPA)" → abbr: "CPA")
6. Deduplicates by lowercase name
7. Sorts alphabetically by name

### Step 4: Validate

After transformation, verify:
- [ ] Every entry has all required fields (no null/undefined)
- [ ] `name` field is never empty
- [ ] `abbr` is string (empty string is OK, not null)
- [ ] `category` matches one of the categories in the table above
- [ ] No duplicate names (case-insensitive)
- [ ] `totalCredentials` matches `credentials.length`
- [ ] File is valid JSON
- [ ] File size is reasonable (expect 1-3 MB for ~3,400 entries)

### Step 5: Save and Deploy

```
mkdir -p certifications
# Save the output as:
certifications/lightcast-certs.json
```

Deploy with the next Vercel push. No other file changes needed — the frontend loader in v4.45.25 handles everything.

---

## Verification

After deployment, open the site and check the browser console. You should see:

```
✅ Certification library loaded: 45 credentials
✅ Lightcast certifications merged: +3366 new (3411 total)
```

Then go to Settings → Credentials and search for something Lightcast would have but the base library doesn't (e.g., "Kubernetes", "Salesforce Administrator", "Google Cloud"). Results should appear.

---

## What NOT to Do

- **Do NOT modify `certification_library.json`**. The 45 curated certs stay untouched. The merge happens at runtime.
- **Do NOT modify `index.html`**. The loader code is already deployed in v4.45.25.
- **Do NOT worry about skill associations**. Empty `skills: []` is fine for now. Skill linking can be a future enhancement.

---

## If the Raw Data is Missing

If the Lightcast certification data from v4.45.24 can't be found in the project, it needs to be re-fetched from the Lightcast Open Skills API:

```
GET https://emsiservices.com/skills/versions/latest/certifications
```

This requires a Lightcast API token. Check environment variables for `LIGHTCAST_CLIENT_ID` and `LIGHTCAST_CLIENT_SECRET`, or check the build scripts from v4.45.24 for how the original fetch was done.
