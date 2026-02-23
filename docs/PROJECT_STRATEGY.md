# Blueprint™ Project Strategy
## Living Document — v1.0 | 2026-02-23

---

## Core Principles

These are non-negotiable. Every product decision filters through them.

1. **Free for individuals, forever.** Blueprint is a tool people use to understand and articulate their own professional capabilities. No paywall, no premium tier, no "upgrade to see your full profile."

2. **We never sell user data.** Individual skill data, evidence, career history, values, compensation — none of it is sold, licensed, or shared with third parties in identifiable form. Period.

3. **Hiring managers access scouting reports for free.** The report is the handshake between the individual and the opportunity. Gating it behind payment breaks the value proposition for both sides.

4. **Intelligence is the product, not people.** Enterprise customers pay for aggregated, anonymized intelligence about skills, capabilities, and workforce patterns — not for access to individuals or their data.

5. **The individual owns their data.** Export it, delete it, control who sees it. Blueprint is a tool they use, not a platform that uses them.

---

## The Value Architecture

Blueprint creates a three-sided market with a specific value flow:

```
INDIVIDUALS (free)                    HIRING MANAGERS (free)
┌─────────────────────┐              ┌─────────────────────┐
│ Build evidence-backed│              │ View scouting reports│
│ skill profiles       │──────────────│ Match candidates     │
│ Understand their     │  Scouting    │ Assess fit           │
│ market position      │  Reports     │ Share internally     │
└──────────┬──────────┘              └──────────┬──────────┘
           │                                     │
           │ Aggregated, anonymized               │ Usage patterns,
           │ skill intelligence                   │ demand signals
           │                                     │
      ┌────▼─────────────────────────────────────▼────┐
      │              ENTERPRISES (paid)                │
      │                                                │
      │  Workforce Intelligence    Talent Intelligence │
      │  "What can we do?"         "What's out there?" │
      │                                                │
      │  Skills benchmarking, gap analysis, supply     │
      │  forecasting, role architecture, compensation  │
      │  intelligence, predictive modeling             │
      └────────────────────────────────────────────────┘
```

The flywheel: more individuals create Blueprints → richer intelligence for enterprises → enterprises invest in the ecosystem → better tools for individuals → more individuals.

---

## Monetization Tiers

### Tier 0: Free Forever

**Individuals:**
- Full Blueprint creation (skills, evidence, roles, values, purpose)
- AI-powered resume parsing and skill extraction
- Skill valuation and market positioning
- Job matching and pipeline management
- Scouting report generation
- Data export and portability
- Verification system

**Hiring Managers / Recruiters:**
- View any shared scouting report
- Send notes to candidates
- Blind/unblind mode for bias reduction
- Share reports internally

**Why free:** These are the data creation and data consumption layers. Charging either side slows the flywheel. The more profiles exist and the more reports get viewed, the more valuable the enterprise intelligence becomes.

---

### Tier 1: Enterprise Talent Intelligence (Core Revenue)

**Product: Workforce Skill Mapping**
A company connects their employee roster (CSV upload, HRIS integration, or employees create Blueprints directly). Blueprint maps the workforce against its ontology and delivers:
- Skill concentration heat maps by department/team/location
- Gap analysis against strategic objectives
- Redundancy detection (3 teams with overlapping capability)
- Succession risk scoring (single points of failure in critical skills)
- Internal mobility opportunities (employees whose skills fit open roles)

*Value proposition:* Every HRIS shows headcount by department. None show capability density by skill cluster. This is the product CHROs don't have today.

**Product: Market Skill Benchmarking**
Anonymized, aggregated data showing how a company's skill profile compares to industry peers:
- "Your engineering org has 3x the cloud infrastructure depth of median but half the ML capability of direct competitors"
- Skill profile comparison against industry verticals
- Geographic talent density for specific skill clusters
- Emerging vs. declining skill trends in their market

*Requires:* Sufficient platform scale for meaningful anonymization (minimum cohort sizes for any reported metric).

**Product: Skill Supply Forecasting**
Trend intelligence built from Blueprint creation patterns, job matching data, and evidence recency:
- Which skills are growing, declining, or emerging
- Velocity of skill adoption across industries
- Leading indicators for skill commoditization
- "Prompt engineering as a standalone skill peaked 14 months ago — the market is consolidating it into existing roles"

*Value proposition:* Informs build-vs-buy workforce decisions. Companies currently make these calls using LinkedIn job posting trends (lagging indicator) or vendor surveys (biased data). Blueprint provides evidence-backed leading indicators.

**Product: Role Architecture Tools**
Companies define roles by selecting skills from Blueprint's ontology, setting proficiency levels, and weighting criticality. Blueprint shows:
- How the designed role maps to available talent supply
- Compensation benchmark based on skill valuations (not title matching)
- Whether the role is actually two roles or half a role
- How the role relates to existing roles in their org

*Value proposition:* Operationalizes the "Liberation of Talent" thesis. Role design becomes skill-driven, not title-driven.

---

### Tier 2: Integration & Volume Features

**Product: Scouting Report API**
Individual reports remain free to view. Enterprise API enables:
- Batch report generation (500 candidates against a requisition)
- Ranking, filtering, and scoring at scale
- Export to ATS/HRIS (Workday, SuccessFactors, Greenhouse, Lever)
- Webhook notifications for new matches
- Custom report templates and branding

*Free tier:* View reports one at a time, share via link.
*Enterprise tier:* Batch generation, filtering, ranking, export, integration.

**Product: ATS/HRIS Connector**
Blueprint as a skills intelligence layer plugging into existing systems:
- ATS sends requisition → Blueprint returns matched candidates with scouting reports
- HRIS sends employee roster → Blueprint returns workforce skill map
- Bi-directional sync keeps profiles current
- Doesn't replace the ATS, makes it smarter

*Strategic positioning:* The transition product. Companies get Blueprint intelligence through existing tools while the ATS category collapses around them.

**Product: Team Blueprint Dashboard**
Org-level view showing aggregated skill profiles across teams:
- Team capability map (what this team can actually do)
- Cross-team skill overlap and gap identification
- Internal mobility matching (employees → open roles)
- Project staffing recommendations based on skill fit
- Manager view: "Your team's strongest and weakest capabilities"

---

### Tier 3: Intelligence Products (High Margin)

**Product: Custom Talent Market Reports**
Commissioned analysis for specific industries, geographies, or skill domains:
- "AI engineering talent landscape in the Southeast for companies under 500 employees"
- Built from Blueprint's structured data, not surveys
- Delivered as polished intelligence products
- Gartner-quality insight grounded in evidence, not opinion

**Product: Predictive Attrition Modeling**
When enough employees at a company have Blueprints, detect structural patterns preceding departure:
- Skill development stagnation (no new evidence in 6+ months)
- Growing gap between capability and role requirements
- Declining evidence freshness
- Pattern matching against historical attrition data

*Critical constraint:* The signal is structural, not behavioral. Blueprint never tells the company what the individual is doing — only that the structural conditions associated with attrition are present.

**Product: Compensation Intelligence**
Blueprint captures skill valuations and (optionally) reported compensation:
- Tie pay to demonstrated capability, not title or tenure
- "Your Senior Engineers are compensated 15% below market for their actual skill profile"
- Identify overpayment for commoditizing skill clusters
- Geographic and industry-adjusted benchmarks

---

### Tier 4: Platform Ecosystem (Long-Term)

**Product: Verified Skills Credential**
Blueprint becomes the verification layer for skills claims:
- Candidate shares a Blueprint verification badge on LinkedIn or in an application
- Employer clicks it, sees the evidence-backed skill profile
- Enterprise pays for verification infrastructure at scale
- Individual earns the credential for free

**Product: Skills-Based Internal Mobility Marketplace**
Enterprise uses Blueprint for internal matching:
- Employees → internal opportunities
- Project staffing based on skill fit
- Stretch assignment recommendations
- Mentorship pairing (skills complementarity)
- Competes with Gloat, Eightfold, Fuel50 — with the advantage of evidence-backed, individual-owned data

**Product: L&D Intelligence Layer**
Blueprint identifies skill gaps → connects to learning resources:
- Integration with Coursera, Udemy, LinkedIn Learning, internal training
- Gap-specific recommendations (not generic catalogs)
- Enterprise pays for gap analysis + recommendation engine
- Referral fees from learning providers for qualified leads
- Individual gets free, personalized development path

---

## Pricing Model

Annual per-seat licensing, tiered by employee count:

| Tier | Employees | Includes |
|------|-----------|----------|
| **Starter** | Under 500 | Workforce skill mapping, team dashboards, basic benchmarking |
| **Professional** | 500-5,000 | + API access, ATS integration, advanced analytics, custom reports |
| **Enterprise** | 5,000+ | + Predictive modeling, compensation intelligence, dedicated support, custom ontology |

Scouting reports remain free at every tier. Enterprise pays for intelligence infrastructure, not access to people.

---

## Build Priority

### Phase 1: Foundation (Current → Q2 2026)
1. Security hardening (completed 2026-02-23)
2. API proxy for Anthropic calls (server-side key management)
3. Report access control (share tokens)
4. Admin roadmap tracker (completed 2026-02-23)
5. Continue demo profile polish and scouting report refinement

### Phase 2: Enterprise MVP (Q3 2026)
6. Scouting Report API (batch generation, filtering)
7. Team Blueprint Dashboard (org-level skill aggregation)
8. Workforce Skill Mapping (CSV roster upload)
9. Basic anonymized benchmarking

### Phase 3: Integration (Q4 2026)
10. ATS connector (start with Greenhouse or Lever)
11. CORS proxy via serverless
12. Data export/portability tooling
13. Privacy controls and consent management

### Phase 4: Intelligence (2027)
14. Market Skill Benchmarking (requires scale)
15. Skill Supply Forecasting
16. Role Architecture Tools
17. Compensation Intelligence

### Phase 5: Platform (2027+)
18. Verified Skills Credential
19. Internal Mobility Marketplace
20. L&D Intelligence Layer
21. Predictive Attrition Modeling
22. Custom Talent Market Reports

---

## Security & Stability Strategy

See `SECURITY_CONTEXT.md` for the full technical security posture, architecture diagrams, and session review checklist. Key principles:

- Every session opens with security review
- Every innerHTML assignment escapes variable data
- Every new external data source gets protocol validation
- Every new CDN dependency gets SRI hashes
- Every deployment gets a version bump
- Firestore rules follow principle of least privilege
- PII readiness scales with the architecture phases above

### Architecture Evolution

The security architecture evolves with the product:

| Phase | Architecture | Security Posture |
|-------|-------------|-----------------|
| Current | Static site + Firebase BaaS | CSP, Firestore rules, client-side escaping |
| Phase 1 | + Vercel serverless functions | Server-side API keys, auth validation |
| Phase 2 | + Enterprise API layer | Rate limiting, API authentication, audit logging |
| Phase 3 | + ATS integrations | OAuth flows, webhook signing, data minimization |
| Phase 4+ | + Intelligence pipeline | Anonymization engine, differential privacy, SOC 2 |

---

## Competitive Landscape

Blueprint occupies a unique position: skills intelligence grounded in individual-owned, evidence-backed data. No competitor has this combination.

| Competitor | What They Do | Blueprint Advantage |
|-----------|-------------|-------------------|
| LinkedIn | Profile-based matching | Evidence-backed skills vs. self-reported claims |
| Eightfold | AI talent intelligence | Individual data ownership vs. employer-controlled |
| Gloat | Internal talent marketplace | Open ecosystem vs. single-org silo |
| Fuel50 | Career pathing | Skill ontology depth vs. generic competency models |
| HiredScore | AI screening | Transparency (scouting reports) vs. black box |
| Phenom | Talent experience | Complementary — Blueprint feeds intelligence layer |

---

## Document History

| Date | Change |
|------|--------|
| 2026-02-23 | Document created. Monetization framework, build priority, security strategy |
