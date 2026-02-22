# Scouting Report — Next Session TODO
## Blueprint v4.32.0.1 → v4.33+

---

## The Vision

Transform the scouting report from a static PDF data dump into an **interactive HTML experience** personalized for recruiters and hiring managers. This is the "Bridge the Gap" feature — connecting the candidate's skill architecture directly to the role with human-centric storytelling.

Two audience modes:
1. **Recruiter Version** — quick-scan, match-focused, "should I advance this candidate?"
2. **Hiring Manager Version** — deeper, evidence-rich, "can this person do the job?"

---

## Data Available for the Report

### Already Computed (in `job.matchData`)
- [ ] Overall match score %
- [ ] Matched skills with proficiency alignment (0-1 scale per skill)
- [ ] Requirement classification (Required / Preferred / Nice-to-have)
- [ ] Gap skills with requirement levels
- [ ] Surplus skills with proficiency levels

### Already Computed (in `job.companyValues`)
- [ ] Primary company values (2-5)
- [ ] Secondary company values (2-4)
- [ ] Values alignment % (catalog overlap with user values)
- [ ] Custom user values (display-only, flavor)

### Already Available (in `userData` / `skillsData`)
- [ ] User profile (name, title, location, photo)
- [ ] All skills with proficiency levels (Novice → Mastery)
- [ ] Role clusters (domain groupings)
- [ ] Work history entries (title, company, dates, description)
- [ ] Outcomes (shared vs. private, with metrics)
- [ ] Values (selected catalog + custom)
- [ ] Purpose statement
- [ ] Compensation data (market rate, conservative, competitive ranges)
- [ ] BLS benchmark data

### Needs to Be Built
- [ ] "Bridge narrative" — per-skill storytelling connecting user evidence to job requirement
- [ ] Gap closure assessment — adjacent skills that suggest learning velocity
- [ ] Cultural fit narrative — values overlap story
- [ ] Career trajectory analysis — work history → this role as logical next step

---

## Interactive HTML Report — Feature Requirements

### Structure (Discuss with Cliff)
- [ ] Single self-contained HTML file (inline CSS/JS, shareable via link or email attachment)
- [ ] Responsive design (looks good on desktop + mobile)
- [ ] Dark theme matching Blueprint brand? Or professional light theme for enterprise audience?
- [ ] Print-friendly CSS for PDF fallback

### Proposed Sections
1. **Header / Cover**
   - Candidate name, title, photo
   - Target role + company
   - Match score (large, prominent)
   - Date generated, confidentiality note

2. **Executive Match Summary**
   - 2-3 sentence narrative: why this candidate fits
   - Key stats: match %, skills aligned, gaps, surplus
   - Values alignment indicator

3. **Skill Alignment (Interactive)**
   - Visual skill-by-skill breakdown
   - Color-coded: green (match), amber (partial), red (gap), gray (surplus)
   - Click/expand to see evidence per matched skill
   - Proficiency bars showing user level vs. job requirement level
   - Grouped by domain/role cluster

4. **Gap Analysis & Bridge**
   - Each gap skill with:
     - Requirement level (Required/Preferred)
     - Adjacent skills the candidate HAS that suggest learnability
     - Estimated ramp-up narrative
   - Overall gap severity assessment

5. **Values & Cultural Alignment**
   - Side-by-side: candidate values vs. company values
   - Overlap visualization
   - Custom values as "character differentiators"
   - Cultural fit narrative

6. **Evidence & Outcomes**
   - Top outcomes with metrics (shared only)
   - Evidence items linked to matched skills
   - Recruiter version: summary bullets
   - Hiring manager version: full detail

7. **Career Trajectory**
   - Work history timeline
   - Narrative: how career path leads to this role
   - Domain expertise progression

8. **Compensation Context**
   - Market positioning
   - BLS benchmark comparison
   - Negotiation-relevant data (hiring manager version may exclude this)

9. **Recommendation**
   - Recruiter: advance/hold/pass with reasoning
   - Hiring manager: interview focus areas, questions to probe

### Interactive Elements
- [ ] Expandable/collapsible sections
- [ ] Skill detail cards on click
- [ ] Smooth scroll navigation (sticky TOC?)
- [ ] Hover tooltips for proficiency definitions
- [ ] Toggle between recruiter/hiring manager view?

---

## Implementation Approach (Discuss)

### Option A: Generate HTML string in `index.html`
- Like current PDF but outputs HTML
- `generateScoutingReportHTML(jobIdx, audience)` 
- Opens in new tab or provides download
- Pro: self-contained, simple
- Con: massive string concatenation

### Option B: Template-based generation
- HTML template with placeholders
- Inject data via JS
- Pro: cleaner, easier to style
- Con: more complex architecture

### Option C: React/JSX artifact
- Build as a standalone component
- Pro: interactive, modern
- Con: not embeddable in current app flow

**Recommendation:** Option A matches the existing pattern (`generatePDF` already does this). Generate a complete self-contained HTML file that opens in a new tab. User can then save/share/email it.

---

## Questions for Next Session

1. **Audience toggle** — one report with toggle, or two separate reports?
2. **Branding** — dark Blueprint theme or professional light theme?
3. **Shareability** — new tab only, or also save-to-file / copy-link?
4. **Which sample profile to use for testing?** (Tyrion has the most skills at 26)
5. **Privacy controls** — which data is always included vs. opt-in?
6. **Compensation** — show in recruiter version? Hiring manager version? Neither?
7. **Custom values** — how prominently to feature "Chaos is a Ladder" etc. in a professional report?

---

## Files to Modify
- `index.html` — add `generateScoutingReportHTML()` function, wire up from `showScoutingReportPicker()`
- Possibly: new picker UI allowing audience selection before generation

## Current Entry Points
- Blueprint tab → Export section → "Scouting Report" button → `showScoutingReportPicker()`
- Picker shows saved jobs → click job → `generateScoutingReport(jobIdx)` → currently generates PDF
- New flow: picker → audience selection → `generateScoutingReportHTML(jobIdx, 'recruiter' | 'hiring_manager')`
