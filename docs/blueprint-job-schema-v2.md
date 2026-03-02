# Blueprint™ Structured Job Schema v2.0
**Spec Date:** March 1, 2026
**Status:** Draft — Standards-Aligned Revision
**Supersedes:** v1.0 (same date)
**Author:** Blueprint Engineering

---

## What Changed from v1.0

v1.0 was designed from first principles. v2.0 aligns with three industry standards while keeping Blueprint's practical needs intact:

| Standard | What We Took | What We Skipped |
|---|---|---|
| **Schema.org JobPosting** | Property names for identity/compensation (`title`, `baseSalary`, `employmentType`, `occupationalCategory`, `hiringOrganization`), location structure, O\*NET-SOC reference | JSON-LD wrapper, SEO-specific properties (`validThrough`, `directApply`), `description` as HTML blob |
| **JDX JobSchema+** | Competency metadata model: requirement level (tier), proficiency, framework alignment via `inDefinedTermSet`, source tracking (user-generated vs. suggested vs. modified), competency categories | Full RDF modeling, Credential Engine integration, CTDL-ASN references |
| **HR Open Standards** | Separation of skills from qualifications from responsibilities, skill category taxonomy concepts | Full XML/JSON-Schema suite, payroll/benefits/timecard specs |
| **People Data Labs** | Title decomposition (`titleRole`, `titleLevel`), derived seniority, skills extraction from description | Their proprietary enrichment pipeline, company foreign keys |

**Key structural changes from v1.0:**
- `company` string → `hiringOrganization` object (Schema.org alignment)
- `employment.seniority` → `titleLevel` (PDL alignment, more precise)
- Added `occupationalCategory` with O\*NET-SOC code (Schema.org + JDX)
- Skills gain `frameworkRef` for competency framework alignment (JDX)
- Skills gain `source` tracking (JDX: user-generated / extracted / suggested+modified)
- Compensation adopts Schema.org `MonetaryAmount` → `QuantitativeValue` nesting
- Added `schemaVersion` field for forward migration
- Added `confidence` to skills for local vs. API extraction quality signals

---

## Design Principles (unchanged from v1.0)

1. **Parse once, match forever.** The structured job object is immutable after ingest. Profile changes trigger re-matching against the same structure, not re-parsing.
2. **Candidate-independent.** The job schema describes what the job requires. Match results are computed, never stored on the job.
3. **Source-agnostic.** Whether a job comes from paste, API fetch, scrape, or manual entry, the ingest pipeline normalizes it into the same schema.
4. **Enrichment-ready.** The schema accommodates fields that may not be present at ingest but can be populated later.
5. **Human-readable.** No encoded blobs, no opaque IDs without labels.
6. **Standards-aligned.** Property names and structures follow Schema.org, JDX, and HR Open where practical. Blueprint-specific extensions are clearly namespaced.

---

## Schema Definition

```javascript
const SCHEMA_VERSION = "2.0";

{
  // ═══════════════════════════════════════════════
  // SECTION 1: IDENTITY
  // Aligned with Schema.org JobPosting where practical
  // ═══════════════════════════════════════════════
  schemaVersion: "2.0",
  id: "job_1709312400000",             // Blueprint internal ID (generated at ingest)

  // --- Core identity (Schema.org property names) ---
  title: "Digital Strategy Consultant",   // Schema.org: title (not "name")
  hiringOrganization: {                   // Schema.org: hiringOrganization
    name: "Blue Acorn iCi",
    sameAs: "https://blueacornici.com",   // Schema.org: canonical URL
    industry: "Digital Consultancy",      // Schema.org: industry
    size: "mid-market"                    // Blueprint extension: "startup" | "smb" | "mid-market" | "enterprise"
  },

  // --- Title decomposition (PDL-inspired) ---
  titleRole: "strategy",                  // Functional role: "engineering", "strategy", "finance", "marketing", etc.
  titleLevel: "mid",                      // Seniority: "entry" | "mid" | "senior" | "lead" | "director" | "vp" | "c-suite"

  // --- O*NET alignment (Schema.org + JDX) ---
  occupationalCategory: {                 // Schema.org: occupationalCategory
    code: "13-1161.00",                   // O*NET-SOC code
    name: "Market Research Analysts and Marketing Specialists",
    framework: "O*NET-SOC",
    url: "https://www.onetonline.org/link/summary/13-1161.00"
  },

  // --- Location (Schema.org structure) ---
  jobLocation: {                          // Schema.org: jobLocation
    primary: "United States",             // Display string
    address: {                            // Schema.org: PostalAddress (when available)
      locality: null,                     // addressLocality
      region: null,                       // addressRegion
      country: "US"                       // addressCountry
    },
    locationType: "TELECOMMUTE",          // Schema.org: jobLocationType — "TELECOMMUTE" | null
    remote: "remote",                     // Blueprint simplified: "remote" | "hybrid" | "onsite"
    remoteDetail: ""                      // e.g. "3 days per week in office"
  },

  // --- Employment (Schema.org names) ---
  employmentType: "FULL_TIME",            // Schema.org: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "TEMPORARY" | "INTERN"
  department: "Strategy",                 // Blueprint extension

  // --- Posting metadata ---
  postingMeta: {
    sourceUrl: "https://...",
    sourceNote: "Found on LinkedIn",
    datePosted: null,                     // Schema.org: datePosted (ISO date)
    validThrough: null,                   // Schema.org: validThrough (ISO date)
    externalId: "",                       // e.g. req ID "JR331198"
    ingestedAt: "2026-03-01T...",         // Blueprint: when we processed it
    ingestMethod: "api",                  // Blueprint: "api" | "local" | "manual"
    rawTextHash: "a1b2c3d4"              // SHA-256 of raw text (dedup)
  },

  // ═══════════════════════════════════════════════
  // SECTION 2: REQUIREMENTS
  // Competency model aligned with JDX JobSchema+
  // ═══════════════════════════════════════════════
  requirements: {

    // --- Skills / Competencies (JDX-aligned) ---
    // Each skill follows JDX competency metadata pattern:
    //   requirement level, proficiency, framework ref, source tracking
    skills: [
      {
        // -- Identity --
        name: "Adobe Experience Platform",      // Display name (human-readable)
        canonical: "adobe experience platform",  // Normalized: lowercase, trimmed, collapsed whitespace
        abbreviation: "AEP",                     // Common abbreviation if any (v1.0 open question resolved)

        // -- JDX competency metadata --
        tier: "required",                   // Requirement level: "required" | "preferred" | "nice-to-have"
                                            // JDX: "Required" | "Recommended" | "Preferred"
                                            // We collapse Recommended into Preferred for simplicity

        proficiency: "Proficient",          // Blueprint proficiency scale:
                                            //   Awareness → Foundational → Proficient → Advanced → Expert → Mastery
                                            // Maps to JDX concept scheme for competency levels

        category: "platform",               // Blueprint skill categories:
                                            //   "technical" | "analytical" | "strategic" | "soft" |
                                            //   "domain" | "platform" | "tool" | "methodology"
                                            // Roughly maps to JDX: foundational / industry / sector / occupational

        // -- Provenance (JDX source tracking) --
        section: "Adobe Platform Familiarity",   // JD section heading where this appeared
        context: "Working knowledge of AEP, RTCDP, AJO, and CJA",  // Original text snippet
        source: "extracted",                // JDX-inspired: "extracted" | "inferred" | "user-added" | "user-modified"
                                            // JDX uses: user-generated / suggested / suggested-and-modified
        confidence: 0.9,                    // 0.0-1.0: how confident the extraction is
                                            //   API ingest: typically 0.8-0.95
                                            //   Local ingest: typically 0.4-0.7
                                            //   User-added: 1.0

        // -- Framework reference (JDX inDefinedTermSet pattern) --
        frameworkRef: {                     // null if no framework match
          framework: "O*NET",               // "O*NET" | "ESCO" | "Blueprint" | "Emsi" | "Lightcast"
          id: null,                         // Framework-specific ID if available
          name: "Adobe Experience Platform"  // Name in that framework's terminology
        }
      },

      {
        name: "RTCDP",
        canonical: "rtcdp",
        abbreviation: null,
        tier: "required",
        proficiency: "Proficient",
        category: "platform",
        section: "Adobe Platform Familiarity",
        context: "Working knowledge of AEP, RTCDP, AJO, and CJA",
        source: "extracted",
        confidence: 0.85,
        frameworkRef: null                  // Vendor-specific, no standard framework match
      },

      {
        name: "Customer Experience",
        canonical: "customer experience",
        abbreviation: "CX",
        tier: "required",
        proficiency: "Advanced",
        category: "domain",
        section: "Digital Strategy & Business Analysis",
        context: "Strong understanding of customer experience principles, lifecycle marketing, and personalization strategies",
        source: "extracted",
        confidence: 0.95,
        frameworkRef: {
          framework: "O*NET",
          id: "2.A.2.a",
          name: "Customer and Personal Service"
        }
      },

      {
        name: "Stakeholder Management",
        canonical: "stakeholder management",
        abbreviation: null,
        tier: "required",
        proficiency: "Advanced",
        category: "soft",
        section: "Soft Skills",
        context: "Consultative mindset with experience facilitating workshops or working directly with business stakeholders",
        source: "extracted",
        confidence: 0.9,
        frameworkRef: null
      }
      // ... all extracted skills
    ],

    // --- Qualifications (HR Open separation) ---
    // Credentials, years, degrees — NOT matchable as skills
    qualifications: [
      {
        type: "experience",               // "experience" | "education" | "certification" | "clearance" | "license"
        description: "5+ years in digital strategy or business analysis",
        tier: "required",                  // Same tier values as skills
        years: 5,                          // Parsed numeric years, null if unparseable
        experienceInPlaceOfEducation: false // Schema.org property: can experience substitute for degree?
      },
      {
        type: "education",
        description: "Bachelor's degree in a related field",
        tier: "preferred",
        years: null,
        degree: "bachelors"                // "associates" | "bachelors" | "masters" | "doctorate" | "certification" | null
      }
    ],

    // --- Responsibilities ---
    // What the person will DO — informs skill inference, not direct matching
    responsibilities: [
      {
        section: "Strategic & Journey Definition",
        items: [
          "Translate business priorities into journey maps, epics, and actionable digital use cases",
          "Define measurable KPIs, success metrics, and value frameworks",
          "Partner with business stakeholders to articulate goals and prioritize activation use cases"
        ]
      },
      {
        section: "Requirements & Documentation",
        items: [
          "Develop detailed requirement documents, business rules, and acceptance criteria for AEP, AJO, and RTCDP use cases",
          "Document segmentation logic, audience frameworks, messaging triggers, and data dependencies"
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SECTION 3: COMPENSATION
  // Follows Schema.org MonetaryAmount/QuantitativeValue pattern
  // ═══════════════════════════════════════════════
  compensation: {
    baseSalary: {                          // Schema.org: baseSalary → MonetaryAmount
      currency: "USD",                    // ISO 4217
      value: {                            // Schema.org: QuantitativeValue
        minValue: null,                   // Schema.org property name
        maxValue: null,
        unitText: "YEAR"                  // "YEAR" | "MONTH" | "HOUR" (Schema.org enum)
      }
    },
    estimatedSalary: null,                // Schema.org: estimatedSalary — for BLS/research data
    incentiveCompensation: null,          // Schema.org: incentiveCompensation — bonus/commission text
    equity: null,                         // Blueprint extension: ESPP, RSU, options text
    jobBenefits: [],                      // Schema.org: jobBenefits — array of benefit strings
    source: null                          // Blueprint: "posted" | "estimated" | "researched"
  },

  // ═══════════════════════════════════════════════
  // SECTION 4: COMPANY CONTEXT
  // Enrichment data beyond hiringOrganization basics
  // ═══════════════════════════════════════════════
  companyContext: {
    values: {
      primary: [],                        // Core values detected from JD
      secondary: [],
      source: "jd"                        // "jd" | "researched" | "user"
    },
    culture: [],                          // Culture signals: "fast-paced", "collaborative", etc.
    employerOverview: null                // Schema.org: employerOverview
  },

  // ═══════════════════════════════════════════════
  // SECTION 5: RAW STORAGE
  // Original text preserved for reference, NEVER for matching
  // ═══════════════════════════════════════════════
  raw: {
    text: "...",                           // Original JD text (capped at 8000 chars)
    sections: [                            // Detected section structure
      { heading: "Position Overview", startIndex: 0 },
      { heading: "Key Responsibilities", startIndex: 412 },
      { heading: "Required Skills & Experience", startIndex: 1830 },
      { heading: "Soft Skills", startIndex: 2640 }
    ]
  },

  // ═══════════════════════════════════════════════
  // SECTION 6: PIPELINE STATE
  // User-specific tracking (the ONLY mutable section)
  // ═══════════════════════════════════════════════
  pipeline: {
    status: "active",                     // "active" | "applied" | "interviewing" | "offer" | "rejected" | "withdrawn" | "archived"
    addedAt: "2026-03-01T...",
    appliedAt: null,
    notes: "",
    tags: []
  }
}
```

---

## Standards Alignment Map

This table maps every Blueprint field to its source standard. Fields without a standard reference are Blueprint extensions.

### Section 1: Identity

| Blueprint Field | Schema.org | JDX | Notes |
|---|---|---|---|
| `title` | `JobPosting.title` | `title` | Direct alignment |
| `hiringOrganization.name` | `hiringOrganization.name` | `hiringOrganization` | Direct alignment |
| `hiringOrganization.sameAs` | `Organization.sameAs` | — | Company canonical URL |
| `hiringOrganization.industry` | `JobPosting.industry` | `industryCode` | JDX uses coded values |
| `hiringOrganization.size` | — | — | Blueprint extension |
| `titleRole` | — | — | PDL-inspired decomposition |
| `titleLevel` | — | — | PDL-inspired decomposition |
| `occupationalCategory.code` | `occupationalCategory` | `occupationalCategory` | O\*NET-SOC code |
| `jobLocation` | `jobLocation` → `Place` | `jobLocation` | Schema.org Place/PostalAddress |
| `jobLocation.locationType` | `jobLocationType` | — | "TELECOMMUTE" for remote |
| `employmentType` | `employmentType` | `employmentType` | Schema.org enum values |
| `postingMeta.datePosted` | `datePosted` | `datePosted` | ISO 8601 |
| `postingMeta.validThrough` | `validThrough` | — | Schema.org expiration |
| `postingMeta.externalId` | `identifier` | `identifier` | Requisition ID |
| `postingMeta.ingestMethod` | — | — | Blueprint provenance |

### Section 2: Requirements

| Blueprint Field | Schema.org | JDX | Notes |
|---|---|---|---|
| `skills[].name` | `skills` (Text) | Competency `name` | JDX goes much deeper |
| `skills[].canonical` | — | — | Blueprint normalization key |
| `skills[].abbreviation` | — | `alternateName` | Common short form |
| `skills[].tier` | — | Competency `conditionType` | JDX: Required / Recommended / Preferred |
| `skills[].proficiency` | — | Competency level concept scheme | JDX allows framework-specific levels |
| `skills[].category` | — | foundational / industry / sector / occupational | Blueprint simplifies to 8 categories |
| `skills[].section` | — | — | Blueprint provenance |
| `skills[].context` | — | — | Blueprint provenance |
| `skills[].source` | — | JDX source tracking | user-generated / suggested / modified |
| `skills[].confidence` | — | — | Blueprint quality signal |
| `skills[].frameworkRef` | — | `inDefinedTermSet` | JDX's framework alignment pattern |
| `qualifications[].type` | `educationRequirements` / `experienceRequirements` | separate properties | Schema.org has flat text, we structure |
| `qualifications[].experienceInPlaceOfEducation` | `experienceInPlaceOfEducation` | — | Schema.org boolean |
| `responsibilities` | `responsibilities` (Text) | `responsibilities` | We structure into sections + items |

### Section 3: Compensation

| Blueprint Field | Schema.org | JDX | Notes |
|---|---|---|---|
| `baseSalary` | `baseSalary` → `MonetaryAmount` | `baseSalary` | Exact Schema.org nesting |
| `baseSalary.value` | `QuantitativeValue` | — | minValue/maxValue/unitText |
| `estimatedSalary` | `estimatedSalary` | — | For BLS/research estimates |
| `incentiveCompensation` | `incentiveCompensation` | — | Bonus/commission |
| `jobBenefits` | `jobBenefits` | — | Benefits array |

### Section 4-6

| Blueprint Field | Schema.org | JDX | Notes |
|---|---|---|---|
| `companyContext.employerOverview` | `employerOverview` | — | Schema.org text field |
| `raw.text` | `description` | — | Schema.org puts everything in description, we preserve raw |
| `pipeline.*` | — | — | Blueprint-only, user-specific state |

---

## Skill Object: Deep Dive

The skill object is the heart of the schema. Here's why each field exists:

### Fields the MATCHER uses
```
canonical    → Primary match key. "adobe experience platform" matches user skill "Adobe Experience Platform"
tier         → Scoring weight. required=3, preferred=2, nice-to-have=1
proficiency  → Gap severity. If job wants Expert and user has Foundational, that's a bigger gap than Expert vs. Advanced
```

### Fields the UI uses
```
name         → Display label in scouting report, skill cards, gap lists
abbreviation → Compact display: "AEP" instead of "Adobe Experience Platform"
category     → Grouping in scouting report sections, color coding
tier         → Badge color: red for required, yellow for preferred, gray for nice-to-have
proficiency  → Level indicator in gap analysis
```

### Fields for PROVENANCE
```
section      → Shows user which part of the JD this came from
context      → Shows the exact text snippet — "here's what they said"
source       → Was this extracted by AI, inferred from responsibilities, or added by the user?
confidence   → How much to trust this extraction (API=high, local=low, user=1.0)
```

### Fields for FUTURE INTELLIGENCE
```
frameworkRef → Links to O*NET, ESCO, Lightcast for:
               - Cross-referencing skills across jobs
               - Suggesting learning paths
               - Industry-standard skill gap analysis
               - Labor market intelligence
```

---

## Resolving v1.0 Open Questions

### Q1: Skill name normalization — store "Adobe Experience Platform (AEP)" as-is or split?

**Answer: Split.** The `name` field stores the full display name ("Adobe Experience Platform"). The `abbreviation` field stores "AEP". The `canonical` field stores the match key ("adobe experience platform"). This gives the UI three rendering options (full, abbreviated, match) without parsing parenthetical expressions at display time.

### Q2: Responsibility-to-skill inference — should ingest pipeline infer skills from responsibilities?

**Answer: Yes, with source tracking.** API ingest can flag inferred skills with `source: "inferred"` and lower confidence (0.5-0.7). The matcher treats them the same, but the UI can optionally dim or group inferred skills separately. Local ingest should NOT attempt inference — it produces too many false positives. This aligns with JDX's source tracking pattern.

### Q3: Schema versioning — migrate stored jobs or support multiple versions?

**Answer: Migrate with version field.** The `schemaVersion` field enables forward migration. On first load after a schema update, `migrateJobSchema(job)` transforms old structures. Stored jobs always get written back in the current version. No multi-version support in the matcher.

### Q4: Storage cap — what's the Firestore per-job budget?

**Answer: Budget is ~15KB per job.** Firestore charges per document size and read. A fully extracted job with 30 skills, 5 qualifications, 4 responsibility sections, and 8000 chars of raw text runs approximately 12-14KB. This is well within Firestore's 1MB document limit and keeps read costs negligible. The raw text cap stays at 8000 chars. Skills are capped at 50 per job (diminishing returns above that).

---

## Ingest Pipeline (updated from v1.0)

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐     ┌────────────┐
│  Raw Input   │────▶│   Extract    │────▶│   Normalize   │────▶│  Framework   │────▶│   Store    │
│  (paste/API/ │     │  (parse JD   │     │  (canonical,  │     │  Align       │     │  (Firestore│
│   scrape)    │     │   to schema) │     │   tiers,      │     │  (O*NET xw,  │     │   + local) │
└─────────────┘     └──────────────┘     │   proficiency) │     │   abbrevs)   │     └────────────┘
                                         └───────────────┘     └──────────────┘          │
                                                                                          ▼
                                                                                   ┌────────────┐
                                                                                   │   Match    │
                                                                                   │  (on demand│
                                                                                   │   against  │
                                                                                   │   profile) │
                                                                                   └────────────┘
```

### New: Framework Alignment Step

After normalization, before storage, the pipeline attempts to link each skill to a known framework:

1. Check Blueprint's skill library (43K+ skills) for a canonical match
2. If found, pull the O\*NET crosswalk mapping (already built for Blueprint v4.45+)
3. Populate `frameworkRef` with the matched framework entry
4. If no framework match, `frameworkRef` stays null — the skill is still valid, just unlinked

This step is fast (local dictionary lookup) and adds significant value for cross-job skill comparison.

### Path A: API Ingest (primary)

Extraction prompt instructs Claude to return JSON conforming to the schema, with special attention to:
- Separating skills from qualifications from responsibilities
- Assigning tier based on section language ("Required", "Must have" vs. "Preferred", "Nice to have")
- Inferring proficiency from seniority context and JD language
- Extracting compound lists ("AEP, RTCDP, AJO, and CJA" → 4 skills)
- Detecting section structure
- Flagging `source: "extracted"` for direct mentions, `source: "inferred"` for responsibility-derived skills

### Path B: Local Ingest (fallback)

Improved `parseJobLocally` with:
- **Section detection**: Regex patterns for common headings ("Requirements", "Qualifications", "What You'll Do")
- **Bullet parsing**: Split compound terms on commas, "and", semicolons
- **Library matching**: Check against 43K skill library with fuzzy threshold
- **Dictionary fallback**: Hardcoded high-value skills for common gaps
- All skills flagged with `source: "extracted"`, lower confidence (0.4-0.7)
- No responsibility-to-skill inference (too unreliable without LLM)

### Normalize Step (both paths)

1. **Canonical names**: Lowercase, trim, collapse whitespace
2. **Abbreviation extraction**: Parse parenthetical patterns — "Adobe Experience Platform (AEP)" → abbreviation: "AEP"
3. **Synonym resolution**: Check if canonical maps to known synonym group. Don't rename, annotate.
4. **Tier classification**: Map JD language to three tiers
   - "Required", "Must have", "Essential", "Mandatory" → `required`
   - "Preferred", "Desired", "Strongly preferred", "Recommended" → `preferred`
   - "Nice to have", "Plus", "Bonus", "Familiarity with" → `nice-to-have`
5. **Proficiency inference**: From seniority + JD language
   - "Familiarity" → Foundational
   - "Working knowledge" → Proficient
   - "Strong understanding", "Proven ability" → Advanced
   - "Deep experience", "Expert-level" → Expert
   - Seniority multiplier: Senior+ roles default to Advanced minimum for required skills
6. **Category assignment**: From section headers + skill content
7. **Dedup**: Same canonical name in multiple sections → keep highest tier, merge contexts

---

## Match Interface (updated)

```javascript
// v1 signature (current codebase)
matchJobToProfile({ skills: [...], roles: [...] })

// v2 signature
matchJobToProfile(job.requirements.skills, userProfile)
```

The matcher receives the structured skills array directly. Each skill carries its own tier and proficiency, so the matcher doesn't guess.

### Scoring Formula

```
For each job skill:
  tierWeight = { required: 3, preferred: 2, "nice-to-have": 1 }[skill.tier]
  totalWeight += tierWeight

  if user has matching skill:
    proficiencyDelta = userLevel - requiredLevel
    if proficiencyDelta >= 0:
      earnedWeight += tierWeight        // Full credit
    else:
      earnedWeight += tierWeight * 0.5  // Partial credit for having skill but underleveled
    matched.push({ skill, proficiencyDelta })
  else:
    gaps.push(skill)

score = (earnedWeight / totalWeight) * 100
```

This resolves the 100% match bug from v1: the denominator is always the sum of all tier weights for all extracted skills, never shrinks due to blocklist filtering.

---

## Migration: v1 to v2

### Existing Job Format (current codebase)
```javascript
{
  title: "...",
  company: "...",
  parsedSkills: ["Strategy", "Business Strategy", "Communication"],
  parsedRoles: ["Consultant"],
  matchData: { score: 100, matched: [...], gaps: [...], surplus: [...] },
  rawText: "...",
  blsSalary: { median: 95000 },
  status: "saved"
}
```

### Migration Function
```javascript
function migrateJobToV2(oldJob) {
  return {
    schemaVersion: "2.0",
    id: oldJob.id || "job_" + Date.now(),
    title: oldJob.title,
    hiringOrganization: {
      name: oldJob.company || "",
      sameAs: null,
      industry: "",
      size: ""
    },
    titleRole: null,
    titleLevel: null,
    occupationalCategory: null,
    jobLocation: {
      primary: oldJob.location || "",
      address: { locality: null, region: null, country: null },
      locationType: null,
      remote: oldJob.remote || null,
      remoteDetail: ""
    },
    employmentType: oldJob.employmentType || null,
    department: null,
    postingMeta: {
      sourceUrl: oldJob.url || oldJob.sourceUrl || "",
      sourceNote: "",
      datePosted: null,
      validThrough: null,
      externalId: "",
      ingestedAt: oldJob.savedAt || new Date().toISOString(),
      ingestMethod: "local",          // All legacy jobs were locally parsed
      rawTextHash: null
    },
    requirements: {
      skills: (oldJob.parsedSkills || []).map(function(s) {
        var name = typeof s === 'string' ? s : (s.name || s.skill || '');
        return {
          name: name,
          canonical: name.toLowerCase().trim(),
          abbreviation: null,
          tier: (s && s.tier) || "required",    // Legacy had no tiers, default to required
          proficiency: (s && s.proficiency) || "Proficient",
          category: (s && s.category) || "technical",
          section: null,
          context: null,
          source: "extracted",
          confidence: 0.4,              // Legacy local parse = low confidence
          frameworkRef: null
        };
      }),
      qualifications: [],
      responsibilities: []
    },
    compensation: {
      baseSalary: oldJob.blsSalary ? {
        currency: "USD",
        value: {
          minValue: oldJob.blsSalary.p25 || null,
          maxValue: oldJob.blsSalary.p75 || null,
          unitText: "YEAR"
        }
      } : { currency: "USD", value: { minValue: null, maxValue: null, unitText: "YEAR" } },
      estimatedSalary: oldJob.blsSalary ? oldJob.blsSalary.median : null,
      incentiveCompensation: null,
      equity: null,
      jobBenefits: [],
      source: oldJob.blsSalary ? "estimated" : null
    },
    companyContext: {
      values: { primary: [], secondary: [], source: "jd" },
      culture: [],
      employerOverview: null
    },
    raw: {
      text: oldJob.rawText || "",
      sections: []
    },
    pipeline: {
      status: oldJob.status || "active",
      addedAt: oldJob.savedAt || new Date().toISOString(),
      appliedAt: null,
      notes: oldJob.notes || "",
      tags: oldJob.tags || []
    }
  };
}
```

### Migration triggers
- On app load: check each saved job for `schemaVersion`. If missing or < "2.0", run `migrateJobToV2()`.
- After migration: re-run framework alignment step to populate `frameworkRef` and `occupationalCategory` from O\*NET crosswalk.
- Write migrated job back to Firestore. Old `parsedSkills`, `matchData`, `rawText` fields are preserved on the object for safety but ignored by the v2 matcher.

---

## Firestore Document Structure

```
users/{uid}/jobs/{jobId}
  ├── schemaVersion: "2.0"
  ├── title, hiringOrganization, titleRole, titleLevel, occupationalCategory
  ├── jobLocation, employmentType, department
  ├── postingMeta (subcollection not needed, fits in doc)
  ├── requirements
  │   ├── skills[]      (array of skill objects)
  │   ├── qualifications[]
  │   └── responsibilities[]
  ├── compensation
  ├── companyContext
  ├── raw
  │   ├── text          (capped 8000 chars)
  │   └── sections[]
  └── pipeline
```

Estimated document size: 12-15KB per job. Firestore limit: 1MB. Comfortable headroom.

---

## Implementation Phases (updated)

### Phase 1: Schema + Constants + Migration
- Define `JOB_SCHEMA_VERSION` constant
- Build `migrateJobToV2()` function
- Build `validateJobSchema()` function (runtime checks, not JSON-Schema)
- Wire migration into app load for existing saved jobs
- Update `matchJobToProfile()` to accept v2 skill array
- Update scouting report to read from `requirements.skills` instead of `parsedSkills`

### Phase 2: API Ingest
- Write Claude extraction prompt returning v2-conformant JSON
- Build `ingestJobViaAPI(rawText)` → structured job
- Wire into `analyzeJob()` as primary path when API key present
- Add framework alignment step (O\*NET crosswalk lookup)

### Phase 3: Local Ingest Improvements
- Add section detection to `parseJobLocally`
- Add compound term splitting
- Add bullet-aware extraction
- Output v2 schema format, `ingestMethod: "local"`, lower confidence values
- Run same normalize + framework alignment steps

### Phase 4: Cleanup
- Remove `quickScoreJob` (legacy fallback)
- Remove `matchData` from job storage (computed on demand)
- Remove BLS-only salary path (unified into `compensation.estimatedSalary`)
- Add re-ingest capability: re-run API extraction on jobs that were originally locally parsed
