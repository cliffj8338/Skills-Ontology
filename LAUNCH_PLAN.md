# Blueprint — Invite-Only Beta Launch Plan
## Functional Spec & Task List

---

## What The Best Did (and What We're Stealing)

### Gmail (2004) — The Accidental Masterclass
- Invite-only due to infrastructure limits → accidentally created scarcity
- Each user got limited invites → turned users into gatekeepers
- Result: massive press coverage, invites traded/sold online

### Superhuman (2016–present) — The Velvet Rope
- 180K waitlist, $30/month pricing (premium positioning)
- 4-step onboarding: survey → deep survey → email follow-up → 30-min video call
- Key insight: **made users qualify to get in** (not just wait)
- Every user's email signature said "Sent via Superhuman" = passive viral loop
- Referral invites let you skip the line → incentivized sharing

### Clubhouse (2020) — The Handle Reserve
- Beyond waitlists: let people **reserve their username** before getting in
- Created urgency: "someone might take your handle"
- Only 2 invites per user → scarcity pressure
- Celebrity seeding (Elon, Zuckerberg) → gave people a reason to care
- No marketing site, no feature list → mystery as strategy

### Robinhood — The Transparent Queue
- Showed your **position in line** and how many people were behind you
- Referrals moved you up the queue → gamified the wait
- Created visible momentum ("450,000 people are waiting")

### Key Takeaway For Blueprint
Combine: **explorable demo** (Superhuman's "see the value first") + **waitlist position** (Robinhood's transparency) + **invite-only access** (Clubhouse's exclusivity) + **qualification survey** (Superhuman's "earn your seat"). Our unique advantage: the demo profiles ARE the marketing. People can see exactly what they'd get before they're let in.

---

## The Blueprint Experience Flow

```
VISITOR → Teaser Landing Page → Signs Up (email + short survey)
  ↓
WAITLISTED → Gets confirmation email with queue position
  ↓
DEMO ACCESS → Can explore app with sample profiles (read-only)
  ↓                Can generate sample PDF exports
  ↓                Can see network graphs, market data
  ↓                Cannot: add skills, edit profiles, upload resume, use AI features
  ↓
INVITED → Admin unlocks account → Full app access
  ↓                User notified via email
  ↓                Onboarding wizard now functional
  ↓
ACTIVE USER → Full Blueprint experience
```

---

## TODAY'S TASK LIST (Priority Order)

### ═══ TIER 1: Demo Profiles Must Be Flawless ═══

#### T1.1 — Audit & Fix Sample Profile Data
- [ ] Verify all 3+ sample profiles load without errors
- [ ] Check every tab renders correctly with sample data: Blueprint, Network, Cards, Jobs, Settings
- [ ] Ensure sample profile role definitions have valid icon names (no emoji remnants)
- [ ] Test skill modal opens correctly for every sample skill
- [ ] Verify market valuation calculations work with sample data
- [ ] Check evidence/outcomes render for sample profiles
- [ ] Ensure O*NET explorer works in sample mode

#### T1.2 — Network Graph Polish (Sample Profiles)
- [ ] Verify force simulation runs smoothly for all sample profiles
- [ ] Check role info card displays correctly on node click
- [ ] Test mobile network rendering for samples
- [ ] Ensure zoom/pan works and resets properly
- [ ] Verify skill-to-role connections are accurate

#### T1.3 — Card View Polish
- [ ] Verify masonry layout renders for sample data
- [ ] Check all card categories display properly
- [ ] Ensure impact badges render (SVG icons, not emoji)
- [ ] Test category filtering works in sample mode

---

### ═══ TIER 2: PDF Export — The Money Feature ═══

The PDF is the single most shareable artifact. If someone generates a beautiful PDF from a sample profile and shares it, that's organic marketing.

#### T2.1 — Full Professional PDF Export
Current PDF is basic. Needs to become a **premium deliverable**:

- [ ] **Cover Page**: Blueprint logo, profile name, date, "Career Intelligence Report" title, confidentiality notice
- [ ] **Executive Summary**: Total skills, role breakdown, market value range, top differentiators
- [ ] **Network Visualization**: Render D3 network graph to canvas → embed as image in PDF
- [ ] **Skill Architecture**: Organized by role/domain with proficiency levels, impact ratings, evidence counts
- [ ] **Market Valuation**: Total portfolio value, per-skill breakdown, salary band analysis, market positioning
- [ ] **Job Match Analysis**: If jobs are in pipeline, show match scores, gap analysis, matched skills
- [ ] **Career Outcomes**: Evidence and outcomes section with metrics
- [ ] **Values & Purpose**: Core values, purpose statement
- [ ] **Skills Gap Radar**: Visual representation of strengths vs gaps for target roles
- [ ] **Page numbers, headers/footers**: "Blueprint™ Career Intelligence Report — Confidential"
- [ ] **Dark theme option**: PDF in Blueprint's dark aesthetic (premium feel)
- [ ] **Blueprint branding**: Logo watermark, consistent color palette

#### T2.2 — PDF Generation Stability
- [ ] Handle missing data gracefully (no "undefined" in output)
- [ ] Test with all sample profiles
- [ ] Ensure works on mobile (download triggers correctly)
- [ ] File naming: `Blueprint_[Name]_[Date].pdf`

---

### ═══ TIER 3: Invite-Only Mode (The Gate) ═══

This is the core mechanic. The app needs two modes:

#### T3.1 — App Mode System
```
APP_MODE = 'demo' | 'waitlisted' | 'invited' | 'active'

demo:       No account. Exploring samples only.
waitlisted: Has account, submitted email. Can explore samples + generate sample PDFs.
invited:    Admin has unlocked. Full access. Onboarding wizard enabled.
active:     Has completed onboarding. Full app.
```

#### T3.2 — Demo Mode Lockdown
- [ ] **Allow in demo mode**:
  - Switch between sample profiles
  - View all tabs (Blueprint, Network, Cards, Jobs pipeline with sample data)
  - Open skill modals (read-only)
  - Generate PDF export of sample profiles
  - View market valuation
  - Explore O*NET skill browser
  - View "About Blueprint" / "Why Blueprint"

- [ ] **Block in demo mode** (show "Join waitlist" prompt instead):
  - Onboarding wizard / resume upload
  - Add/edit/delete skills
  - AI features (Claude integration)
  - Edit profile information
  - Import/export personal data
  - Job search (Find Jobs API)
  - Track applications
  - Settings modifications
  - Consent & sharing preferences
  
- [ ] **UI treatment for locked features**:
  - Subtle lock icon overlay on disabled nav items
  - Clicking locked feature → modal: "This feature is available to invited members. Join the waitlist to get early access." + email capture form
  - Don't hide features — show them but gate them. Let people see what they're missing.

#### T3.3 — Waitlist Registration (In-App)
- [ ] Registration modal: Email + Name + "What describes you best?" (Individual | Talent Leader | HR/Recruiter | Executive | Other)
- [ ] Optional: "How many skills do you think you have?" (fun engagement hook, echoes the "60-80% blind spot" messaging)
- [ ] Store to Firestore `waitlist` collection: email, name, type, timestamp, status ('waiting')
- [ ] Show confirmation: "You're #[position] on the waitlist. We'll notify you when it's your turn."
- [ ] Waitlist position based on Firestore document count

#### T3.4 — Post-Registration Experience
- [ ] After registering, user stays in demo mode but sees personalized touches:
  - "Welcome, [Name]" in nav
  - "You're #47 on the waitlist" badge
  - Locked features now say "You're on the list! We'll unlock this soon." instead of generic gate message
- [ ] Subtle FOMO: "23 people joined the waitlist today" (live counter from Firestore)

---

### ═══ TIER 4: Admin Invite System ═══

#### T4.1 — Admin Dashboard Enhancements
- [ ] **Waitlist view**: Table of all waitlisted users (name, email, type, date, status)
- [ ] **Invite button**: One-click to change status from 'waiting' → 'invited'
- [ ] **Bulk invite**: Select multiple users, invite all
- [ ] **Invite email trigger**: When status changes to 'invited', trigger notification
  - For now: set a flag in Firestore. User sees "You've been invited!" on next login
  - Future: actual email via SendGrid/Mailchimp
- [ ] **User stats**: Total waitlisted, total invited, total active, conversion rates

#### T4.2 — Invitation Detection
- [ ] On app load, check Firestore for user's waitlist status
- [ ] If status === 'invited' → unlock full app, show welcome modal
- [ ] If status === 'waiting' → maintain demo mode
- [ ] If no account → pure demo mode

---

### ═══ TIER 5: Polish & Psychology ═══

#### T5.1 — "Why Blueprint" Integration
- [ ] Add a "Why Blueprint?" nav item or prominent link (visible in demo mode)
- [ ] Creates a modal or section with the core messaging from WHY_BLUEPRINT.md:
  - The 60-80% skill blind spot stat
  - The 7.4 second resume problem
  - The old way vs Blueprint way comparison
  - "See what you're missing" → CTA to waitlist

#### T5.2 — Social Proof & Urgency Elements
- [ ] Waitlist counter on landing page: "[X] professionals on the waitlist"
- [ ] "Built by [Cliff Carey], VP of Strategy at Phenom with 10+ years in talent intelligence"
- [ ] Sample profile quality badges: "This is a real Blueprint. Yours could be next."
- [ ] Subtle timestamp: "Early access launching Q2 2026"

#### T5.3 — Share Mechanics
- [ ] "Share your spot" after waitlist signup: generate shareable link
- [ ] PDF export includes: "Generated by Blueprint™ — myblueprint.work" footer on every page
- [ ] Referral tracking: if someone signs up from a shared link, original referrer moves up in queue

#### T5.4 — The "Aha Moment" Design
Following Superhuman's playbook: the demo itself should create desire.
- [ ] When viewing sample network graph → floating tooltip: "Imagine seeing YOUR skills mapped like this"
- [ ] When viewing market valuation → "Your skill portfolio could be worth more than you think"
- [ ] When viewing PDF export → "This is a sample. Your Blueprint will be unique."
- [ ] After 2 minutes of exploration → gentle slide-in: "Ready to map your own Blueprint?"

---

## WHAT YOU'RE NOT MISSING (You Nailed It)

Your instincts are spot-on. The four pillars you identified map exactly to the playbook:

| Your Goal | Proven By | Blueprint Execution |
|-----------|-----------|-------------------|
| 1. Gather user info | Superhuman (qualification survey) | Waitlist form with persona segmentation |
| 2. Demonstrate & generate interest | Robinhood (visible product) | Explorable demo with real sample data |
| 3. Create tension | Clubhouse (FOMO mechanics) | Waitlist position, daily counter, locked features visible |
| 4. Exclusive access | Gmail (invite scarcity) | Admin-controlled invitations |

## WHAT I'D ADD

### 5. Qualification Over Quantity
Don't just collect emails — collect **intent signals**. The waitlist form should ask enough to segment users into:
- **High-value** (talent leaders, executives, active job seekers with 10+ years experience)
- **Standard** (individual contributors, curious professionals)
This lets you invite strategically: seed with influential people first who'll talk about it.

### 6. The "Ambassador" Mechanic
When you invite someone, give them 2-3 invite codes they can share. This:
- Creates scarcity (limited invites)
- Turns early users into evangelists
- Builds organic growth loops
- Tracks viral coefficient

### 7. Content Drip for Waitlisted Users
Don't let waitlisted users go cold. While they wait:
- Weekly email with a "skill insight" (e.g., "The 5 most undervalued skills in your industry")
- Ties to your "Uncomfortable Truth" newsletter
- Each email ends with: "Your Blueprint is being prepared. Current position: #[X]"

### 8. The PDF as Viral Loop
The sample PDF export should be SO good that people share it as a conversation piece:
- "Look at this career intelligence report format"
- Every shared PDF = free marketing
- Footer: "Map your own Blueprint → myblueprint.work"

### 9. Analytics from Day 1
Track everything:
- Which sample profiles get explored most
- Which features get clicked (locked or not)
- Time spent on network graph vs card view vs market valuation
- PDF download count
- Waitlist conversion rate
- Drop-off points

### 10. The LinkedIn Play
Your specific advantage: you have a built-in audience of talent executives.
- Share a sample Blueprint PDF on LinkedIn with commentary
- "Here's what a career intelligence report looks like. Résumés are dead."
- Link to waitlist
- Your newsletter subscribers are pre-qualified leads

---

## EXECUTION ORDER FOR TODAY

Given these are big items and we're in one session, recommended priority:

1. **PDF Export overhaul** (T2.1-T2.2) — This is the most shareable output. If the PDF is stunning, everything else follows.

2. **Demo mode lockdown** (T3.2) — Flip the switch: sample profiles work, everything else gated.

3. **Waitlist registration** (T3.3) — In-app email capture with Firestore storage.

4. **Admin invite** (T4.1-T4.2) — Basic toggle: admin can change waitlist status, app detects it.

5. **Sample profile audit** (T1.1-T1.3) — Quick pass to make sure demos are clean.

6. **Why Blueprint modal** (T5.1) — Reuse the teaser page content inside the app.

7. **Polish/psychology** (T5.4) — The floating prompts and FOMO elements.

---

*"When something is rare, we perceive its value as higher. Our desire increases because our curiosity is peaked, we are scared to miss out, and we want to belong to a coveted group." — Commodity Theory*

*The demo profiles ARE the marketing. The PDF IS the viral loop. The gate IS the product.*
