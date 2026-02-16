# Work Blueprint v1.1.0 - Market Valuation Engine
## Comprehensive Feature Specification

---

## 🎯 **VISION**

**Transform skill assessment from subjective to data-driven.**

Instead of: "I'm a VP, so I'm worth $200k"  
Enable: "My unique combination of 33 Mastery-level skills in AI Strategy, C-Suite Advisory, and Technical Leadership, adjusted for Philadelphia market rates, is worth $287,000 base + negotiation leverage"

---

## 💡 **CORE CONCEPT**

### **The Formula:**
```
Your Market Value = Σ(Skill_i × Proficiency_i × Location × Demand × Rarity) + Outcomes_Value
```

Where:
- **Skill_i** = Base annual value contribution of skill
- **Proficiency_i** = Multiplier (Proficient 1.0x, Advanced 1.5x, Mastery 2.2x)
- **Location** = Cost of living adjustment (Lincoln, NE 0.82x → SF 1.52x)
- **Demand** = Current market demand for skill domain (AI 1.35x)
- **Rarity** = Unique combination bonuses (AI + Executive = +15%)
- **Outcomes_Value** = Quantified impact from Work Blueprint

### **Purpose:**
Help users understand and **negotiate their true market value** based on:
1. Skills they actually possess
2. Evidence they can provide
3. Outcomes they've driven
4. Current market conditions

NOT just "what does this role title pay?"

---

## 📊 **DATA MODEL (Already Built)**

### **1. Skill Base Values** (`skill_valuations.json`)
Each of 73 skills has a base annual value:

**Tier 1 - Strategic/Executive ($40k-$60k/year):**
- Enterprise AI Strategy: $55,000
- C-Suite Advisory & Influence: $52,000
- Strategic Foresight & Market Prediction: $48,000
- AI/ML Product Strategy: $50,000

**Tier 2 - Specialized/Leadership ($25k-$40k/year):**
- Organizational Transformation: $42,000
- Data-Driven Strategy Development: $42,000
- Talent Intelligence Platform Design: $42,000
- Crisis Leadership & Decision Making: $45,000

**Tier 3 - Professional/Foundational ($15k-$30k/year):**
- Technical Concept Translation: $28,000
- Public Speaking & Keynote Delivery: $25,000
- Research Synthesis & Forecasting: $30,000

**Tier 4 - Specialized/Niche ($18k-$25k/year):**
- Single-Pilot IFR in Complex Airspace: $35,000
- Recovery Leadership & Peer Mentorship: $25,000
- Music Production & Artist Development: $24,000

### **2. Proficiency Multipliers**
```json
{
  "Proficient": 1.0,   // Base level - competent
  "Advanced": 1.5,     // 50% premium - expert
  "Mastery": 2.2       // 120% premium - recognized authority
}
```

### **3. Location Adjustments** (27 cities)
Based on cost of living indices:
```json
{
  "San Francisco Bay Area, CA": 1.52,  // +52% premium
  "New York City, NY": 1.48,           // +48%
  "Philadelphia, PA": 1.05,            // +5% (baseline metro)
  "Lincoln, NE": 0.82,                 // -18% discount
  "Remote": 0.95                       // -5% (slight remote discount)
}
```

### **4. Market Demand Factors** (2026 Market)
```json
{
  "ai": 1.35,                    // 35% premium for AI skills
  "transformation": 1.20,         // 20% for transformation
  "cybersecurity": 1.28,          // 28% for security
  "cloud": 1.25,                  // 25% for cloud
  "analytics": 1.20,              // 20% for analytics
  "default": 1.0
}
```

### **5. Rarity Bonuses**
Unique combinations get additional value:
```json
{
  "executive_technical": 0.10,     // 10% for exec + technical
  "ai_domain_expert": 0.15,        // 15% for AI + domain expertise
  "unique_combination": 0.15,      // 15% for truly unique combos
  "mastery_rare_skill": 0.20,      // 20% for mastery in rare skills
  "thought_leader": 0.12           // 12% for public thought leadership
}
```

### **6. Role Benchmarks** (Reality Check)
Compare calculated value to market data:
```json
{
  "VP Strategy": {
    "min": 180000,
    "median": 245000,
    "max": 380000
  },
  "Chief Strategy Officer": {
    "min": 220000,
    "median": 320000,
    "max": 550000
  }
}
```

---

## 🎨 **UI/UX IMPLEMENTATION PLAN**

### **Phase 1: Individual Skill Values**

#### **1A. Skill Cards (Card View)**
Add to bottom of each skill card:

```
┌────────────────────────────────────┐
│ Enterprise AI Strategy             │
│ Mastery • 10+ years                │
│                                    │
│ Evidence: [3 bullets]              │
│                                    │
│ 💰 Market Value: $121,000/year    │  ← NEW
│    (Base: $55k × 2.2 × 1.05 × 1.35)│  ← NEW
└────────────────────────────────────┘
```

**Interaction:**
- Click on $121,000 → Opens detailed breakdown modal

#### **1B. Skill Detail Modal (Enhanced)**
When clicking a skill, show full breakdown:

```
┌─────────────────────────────────────────┐
│ Enterprise AI Strategy                  │
│ Mastery Level • 10+ years               │
├─────────────────────────────────────────┤
│ Evidence:                               │
│ • [bullets as before]                   │
├─────────────────────────────────────────┤
│ 💰 MARKET VALUATION BREAKDOWN          │  ← NEW SECTION
│                                         │
│ Base Value:            $55,000          │
│ × Mastery (2.2x):      $121,000         │
│ × Location (1.05x):    $127,050         │
│ × AI Demand (1.35x):   $171,518         │
│                                         │
│ Annual Value:          $171,518         │
│                                         │
│ 📊 Market Context:                     │
│ • Top 15% of strategic skills          │
│ • High demand (AI sector)              │
│ • Philadelphia: +5% vs national avg    │
│                                         │
│ 💡 Negotiation Tip:                    │
│ This skill alone justifies significant  │
│ compensation. Use your evidence when    │
│ discussing value with employers.        │
└─────────────────────────────────────────┘
```

#### **1C. Network View Enhancement**
On hover over skill node, show tooltip:

```
┌──────────────────────┐
│ Enterprise AI        │
│ Strategy             │
│                      │
│ 💰 $171,518/year     │
│ Top 15% value        │
└──────────────────────┘
```

---

### **Phase 2: Total Portfolio Value**

#### **2A. Dashboard Header (Top Stats Bar)**
Replace current "73 Skills • 9 Career Roles • Interactive Ontology" with:

```
┌────────────────────────────────────────────────────────────┐
│ Your Market Value: $287,450/year                          │
│ 73 Skills (33 Mastery) • Philadelphia, PA • Executive     │
└────────────────────────────────────────────────────────────┘
```

Click on $287,450 → Opens full valuation modal

#### **2B. Work Blueprint Tab - NEW Section**
Add at top of Work Blueprint, before Outcomes:

```
┌─────────────────────────────────────────────────────────────┐
│ 💰 YOUR MARKET VALUATION                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│        Total Market Value: $287,450/year                    │
│                                                             │
│ ┌──────────────────┬──────────────────┬──────────────────┐ │
│ │  Base Skills     │  Rarity Bonus    │  Your Location   │ │
│ │  $248,200        │  +$39,250 (16%)  │  Philadelphia    │ │
│ └──────────────────┴──────────────────┴──────────────────┘ │
│                                                             │
│ Breakdown by Category:                                      │
│ • Strategic/Executive (25 skills):    $142,000             │
│ • Technical/Product (18 skills):       $89,000             │
│ • Communication (12 skills):           $34,000             │
│ • Domain Expertise (18 skills):        $22,450             │
│                                                             │
│ Comparable Roles:                                           │
│ ✓ VP Strategy (Median: $245k)     You're +17% above       │
│ ✓ Director Strategy (Median: $185k) You're +55% above     │
│                                                             │
│ [View Full Breakdown] [Negotiation Guide] [Export PDF]    │
└─────────────────────────────────────────────────────────────┘
```

#### **2C. Valuation Breakdown Modal**
Click "View Full Breakdown" opens:

```
┌───────────────────────────────────────────────────────┐
│ YOUR MARKET VALUATION - DETAILED BREAKDOWN            │
├───────────────────────────────────────────────────────┤
│                                                       │
│ CALCULATED VALUE: $287,450/year                      │
│                                                       │
│ Top Contributing Skills (Value each):                │
│ 1. Enterprise AI Strategy         $171,518           │
│ 2. C-Suite Advisory & Influence   $136,760           │
│ 3. Strategic Foresight            $126,720           │
│ 4. AI/ML Product Strategy         $137,500           │
│ 5. Crisis Leadership              $119,070           │
│                                                       │
│ [Show All 73 Skills]                                 │
│                                                       │
│ ADJUSTMENTS:                                         │
│ Base Skills Total:        $248,200                   │
│ + Rarity Bonuses:         +$39,250                   │
│   - AI + Executive:       +$37,230 (15%)            │
│   - Unique Combo:         +$2,020 (custom)          │
│                                                       │
│ LOCATION ADJUSTMENT:                                 │
│ Philadelphia, PA: +5% cost of living                 │
│ Compare to:                                          │
│ • San Francisco: $436,125 (+52%)                     │
│ • New York: $425,286 (+48%)                          │
│ • Lincoln, NE: $235,709 (-18%)                       │
│                                                       │
│ ROLE BENCHMARKS:                                     │
│ Your value aligns with:                              │
│ ✓ VP Strategy (Median $245k) - You: +17%            │
│ ○ CSO (Median $320k) - You: -10%                    │
│                                                       │
│ [Export as PDF] [Share with Recruiter] [Close]      │
└───────────────────────────────────────────────────────┘
```

---

### **Phase 3: Negotiation Guidance**

#### **3A. Negotiation Guidance Modal**
Click "Negotiation Guide" opens:

```
┌────────────────────────────────────────────────────────┐
│ 💼 SALARY NEGOTIATION GUIDANCE                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Based on Your Profile:                                │
│ • Total Market Value: $287,450                        │
│ • Role Alignment: VP Strategy (+17% above median)     │
│ • Location: Philadelphia, PA                          │
│                                                        │
│ RECOMMENDED RANGES:                                   │
│                                                        │
│ Conservative Ask:  $260,000 - $280,000               │
│ (90-97% of calculated value)                          │
│                                                        │
│ Target Ask:        $280,000 - $305,000               │
│ (97-106% of calculated value)                         │
│                                                        │
│ Stretch Ask:       $305,000 - $340,000               │
│ (If unique fit, high demand company)                  │
│                                                        │
│ KEY TALKING POINTS:                                   │
│                                                        │
│ 1. Skill Rarity:                                     │
│    "My combination of AI strategy expertise with     │
│    C-suite advisory experience is rare in the        │
│    market. I have 33 mastery-level skills."          │
│                                                        │
│ 2. Quantified Outcomes:                              │
│    "I've driven outcomes including: [pull from       │
│    Work Blueprint - show 3 strongest]"               │
│                                                        │
│ 3. Market Data:                                      │
│    "Based on market rates for my skill profile       │
│    in Philadelphia, comparable roles range from      │
│    $245k-$320k."                                      │
│                                                        │
│ 4. Total Value Proposition:                          │
│    "Beyond base salary, I bring immediate value      │
│    through [list 3 matching skills to their needs]"  │
│                                                        │
│ CONVERSATION FRAMEWORK:                               │
│                                                        │
│ DO:                                                   │
│ ✓ Lead with value, not need                         │
│ ✓ Use your outcome evidence                         │
│ ✓ Reference market data                             │
│ ✓ Be specific about your skill contributions        │
│                                                        │
│ DON'T:                                               │
│ ✗ Give range first - let them offer                 │
│ ✗ Accept first offer without negotiating            │
│ ✗ Focus only on title, not total comp              │
│ ✗ Forget to negotiate equity, bonus, benefits       │
│                                                        │
│ [Export Negotiation Brief] [Practice Script] [Close] │
└────────────────────────────────────────────────────────┘
```

---

### **Phase 4: Opportunities Integration**

#### **4A. Job Cards Enhancement**
On each job opportunity card, add comparison:

```
┌────────────────────────────────────────┐
│ VP of Product Strategy                 │
│ TechCorp • Remote • $180k-$240k       │
│                                        │
│ Match: 78% (8 skills)                  │
│                                        │
│ 💰 Value Analysis:                     │  ← NEW
│ Salary Range:  $180k-$240k            │
│ Your Value:    $287k                   │
│ Negotiation:   You're worth +20-60%   │  ← NEW
│                more than their max     │
│                                        │
│ 💡 Their range is below your market   │  ← NEW
│    value. Strong negotiation position. │
│                                        │
│ [Generate Pitch] [View on Network]     │
└────────────────────────────────────────┘
```

#### **4B. Pitch Generator Enhancement**
When generating pitch, include valuation context:

```
Dear Hiring Manager,

I'm writing to express interest in the VP of Product Strategy 
position at TechCorp. My background aligns strongly with your 
requirements, with a 78% match to the role's key competencies.

QUANTIFIED VALUE I BRING:
My market valuation of $287,450 reflects:
• 8 directly matching skills at Advanced/Mastery level
• Proven outcomes including: [pull 3 matching outcomes]
• Strategic expertise in AI, Product, and Transformation

YOUR REQUIREMENTS - MY EXPERIENCE:
[existing pitch content]

COMPENSATION EXPECTATIONS:
Based on my skill profile and the value I'll deliver, my 
target range is $280,000-$305,000 base, with flexibility 
on total compensation structure.

[rest of pitch]
```

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **Files Structure:**
```
/mnt/user-data/outputs/
├── index.html (main app)
├── skill_evidence.json (existing)
├── skill_valuations.json (NEW - already created)
└── CHANGELOG.md
```

### **Functions to Build:**

```javascript
// Already built:
function calculateSkillValue(skill) { ... }
function calculateTotalMarketValue() { ... }
function getClosestRoleBenchmark(calculatedValue) { ... }

// Need to build:
function updateMarketValueDisplay() { ... }
function showSkillValueBreakdown(skillName) { ... }
function showTotalValuationModal() { ... }
function showNegotiationGuidance() { ... }
function exportValuationPDF() { ... }
function compareToJobSalary(jobSalary, userValue) { ... }
function generateNegotiationPoints(job) { ... }
```

### **Where to Add UI Elements:**

1. **Skill Cards** - Add value to `.skill-card` template
2. **Skill Modal** - Enhance `showSkillDetail()` function
3. **Work Blueprint** - New section at top of `renderBlueprint()`
4. **Header Stats** - Modify `updateStatsBar()` for Skills Ontology view
5. **Opportunities** - Enhance `renderOpportunities()` job cards
6. **Settings** - Already changed location to dropdown

---

## 📈 **EXPECTED OUTCOMES**

### **For Users:**
1. **Understand their true market value** based on skills, not just title
2. **Negotiate confidently** with data-driven justification
3. **See which skills are most valuable** (prioritize development)
4. **Compare locations** for relocation decisions
5. **Evaluate job offers** objectively (underpaid vs. overpaid)

### **Example User Journey:**

**Sarah - VP Strategy (Philadelphia)**
- Has 28 Mastery skills, 20 Advanced
- Sees total value: $265,000
- Gets offer: $210,000
- Uses system: "My skill profile values at $265k, your offer is 21% below market"
- Negotiates to: $245,000 + equity
- **Result:** $35k more than original offer

**Mike - Director (Lincoln, NE)**
- Has 15 Advanced skills, considering SF move
- Sees Lincoln value: $142,000
- Sees SF value: $215,880 (+52%)
- Makes informed relocation decision
- **Result:** Knows exactly what salary to target

---

## ⚠️ **IMPORTANT CONSIDERATIONS**

### **1. Accuracy Disclaimers**
```
⚠️ DISCLAIMER:
Market valuations are estimates based on:
• Industry research and salary data
• Skill demand trends
• Geographic cost of living indices

Actual compensation depends on:
• Company size, funding, profitability
• Industry sector and growth stage
• Your negotiation and fit
• Total comp (equity, bonus, benefits)

Use as guidance, not guarantee.
```

### **2. Regular Updates Needed**
- Market demand factors change (AI might cool down)
- Location multipliers shift with inflation
- Role benchmarks need annual updates
- Skill values evolve with technology

### **3. Ethical Considerations**
- Don't create false expectations
- Emphasize "market value" not "guaranteed salary"
- Encourage negotiation, not entitlement
- Focus on value delivery, not just dollar amounts

---

## 🚀 **IMPLEMENTATION PHASES**

### **Phase 1: Core Display** (v1.1.0)
- [x] Data model created (skill_valuations.json)
- [x] Calculator functions built
- [x] Location dropdown in settings
- [ ] Show $ on skill cards
- [ ] Show $ in skill modals with breakdown
- [ ] Total value in header
- [ ] Total value section in Work Blueprint

**Estimated Time:** 2-3 hours

### **Phase 2: Negotiation Tools** (v1.1.1)
- [ ] Negotiation guidance modal
- [ ] Comparison to role benchmarks
- [ ] Export valuation as PDF
- [ ] Practice negotiation scripts

**Estimated Time:** 2 hours

### **Phase 3: Job Integration** (v1.1.2)
- [ ] Salary comparison on job cards
- [ ] "Worth vs. Offer" analysis
- [ ] Enhanced pitch with valuation
- [ ] "Should I take this?" calculator

**Estimated Time:** 1-2 hours

### **Phase 4: Advanced Features** (v1.2.0)
- [ ] Track salary offers in Application Tracker
- [ ] Negotiation outcome tracking
- [ ] Skill ROI calculator ("which skills to develop?")
- [ ] Career path value projections

**Estimated Time:** 3-4 hours

---

## 📋 **TESTING CHECKLIST**

Before release:
- [ ] Calculate Cliff's actual portfolio value
- [ ] Compare to known salary data for VP Strategy roles
- [ ] Verify all 73 skills have base values
- [ ] Test all 27 location multipliers
- [ ] Verify proficiency calculations
- [ ] Check rarity bonus logic
- [ ] Ensure role benchmarks are realistic
- [ ] Test with different user profiles:
  - [ ] Entry level (few skills)
  - [ ] Mid-level (balanced)
  - [ ] Executive (many mastery skills)
  - [ ] Different locations (SF vs Lincoln)

---

## 🎯 **SUCCESS METRICS**

This feature succeeds when:
1. Users say "I never knew I was worth that much"
2. Users successfully negotiate higher salaries using data
3. Users make informed location decisions
4. Users prioritize skill development based on value
5. System becomes "the source of truth" for career decisions

---

## 📝 **NEXT SESSION CHECKLIST**

When we build v1.1.0, start here:

1. **Load this spec document**
2. **Review work-in-progress code** (calculator functions exist)
3. **Build Phase 1 UI** (cards, modals, Work Blueprint section)
4. **Test with Cliff's actual data**
5. **Verify calculations make sense**
6. **Create v1.1.0 release**

---

**END OF SPECIFICATION**

This document should be enough to build the complete Market Valuation Engine in the next session.
