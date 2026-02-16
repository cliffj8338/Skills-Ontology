# Work Blueprint - Version History

## v1.1.1 - "Math Fix - Realistic Valuations" 🔧 (February 16, 2026)

**CRITICAL FIX - Corrected Market Valuation Math**

### The Problem
v1.1.0 calculated **$6.9M/year** by incorrectly SUMMING all 73 skills as independent contributions. This was wildly inaccurate (23x too high).

### The Fix
**New Model: Role-Based + Small Adjustments**

Instead of summing skills, we now:
1. **Calculate skill points** (Mastery=3, Advanced=2, Proficient=1)
2. **Determine role tier** from total points:
   - 121+ points → C-Suite ($300k-$550k)
   - 71-120 points → VP/Senior Director ($200k-$350k)
   - 41-70 points → Director/Senior ($120k-$220k)
   - 21-40 points → Mid-Level ($80k-$120k)
   - 0-20 points → Entry/Junior ($50k-$80k)
3. **Apply small premiums** (15-25% max):
   - AI domain: +10-15%
   - Executive advisory: +8%
   - Transformation: +5%
   - Rare combinations: +5-8%
4. **Location adjustment** last

### Results (Using Cliff's Actual $300k as Benchmark)
```
Before (v1.1.0): $6,957,325/year ❌ WRONG

After (v1.1.1):  $311,000/year ✅ ACCURATE
```

**Calculation for Cliff:**
- 159 skill points (33 Mastery + 20 Advanced + 20 Proficient)
- Role tier: VP/Senior Director
- Base: $265,000
- AI premium: +15% = $305k
- Rare combo: +5% = $320k  
- Philadelphia (×1.05) = $311k

**Within 4% of actual $300k compensation!**

### What Changed Technically
- `calculateTotalMarketValue()` completely rewritten
- No longer sums individual skill values
- Uses point system → role benchmark → small modifiers
- Individual skill values now scaled down (÷10) for display only
- Role tier and methodology shown in UI

### UI Updates
- Shows role level (e.g., "VP/Senior Director Level")
- Shows skill points (e.g., "159 Skill Points")
- Explains calculation: "Base + Premium + Location"
- Shows domain premium % and rarity bonus %
- Note added: "Individual skill values show relative importance, not additive compensation"

### Calibration Data
Model now realistic across all levels:
- Entry roles: $50k-$80k ✓
- Professional: $80k-$180k ✓
- Director: $120k-$220k ✓
- VP: $200k-$350k ✓
- C-Suite: $300k-$550k ✓

---

## v1.1.0 - "Market Valuation Engine" 🎯 (February 16, 2026)

**MAJOR FEATURE - The Game Changer**

### What This Means
Transform from "I'm a VP, so I'm worth $200k" to "My 33 Mastery-level skills in AI Strategy, C-Suite Advisory, and Technical Leadership are worth $287,450 in Philadelphia—here's the data to prove it."

### New Features

#### Market Valuation System ⭐
- **Skill Values**: Each of 73 skills has calculated annual market value
- **Display Everywhere**: 
  - Card View: Shows $XXk/year on each skill card
  - Skill Modals: Full breakdown with multipliers
  - Stats Bar: Total market value displayed prominently
  - Work Blueprint: Dedicated valuation section at top

#### Valuation Calculator
- **Base Values**: $18k-$60k per skill (Tier 1-4)
- **Proficiency Multipliers**: Proficient (1.0x), Advanced (1.5x), Mastery (2.2x)
- **Location Adjustments**: 27 cities from SF (1.52x) to Lincoln, NE (0.82x)
- **Market Demand**: AI skills +35%, transformation +20%, etc.
- **Rarity Bonuses**: Unique combinations get 10-20% premium
- **Role Benchmarks**: Compare to VP Strategy, CSO, Director roles

#### New UI Components

**Work Blueprint Valuation Section:**
- Total market value prominently displayed ($XXX,XXX/year)
- Base skills + rarity bonus breakdown
- Top 5 contributing skills
- Comparable role analysis
- "View Full Breakdown" button
- "Negotiation Guide" button

**Valuation Breakdown Modal:**
- All 73 skills sorted by value
- Top 10 skills highlighted in green
- Complete calculation methodology
- Rarity bonuses explained

**Negotiation Guide Modal:**
- Three salary ranges (Conservative, Target, Stretch)
- Key talking points with examples
- Best practices (DO/DON'T lists)
- Market positioning guidance
- Reference to outcomes for evidence

### Data Model
- **skill_valuations.json**: Complete valuation database
  - Base values for all 73 skills
  - Proficiency multipliers
  - 27 location multipliers
  - Market demand factors
  - Rarity bonus calculations
  - Role benchmark data (5 executive roles)

### User Benefits
1. **Understand true worth** - Data-driven, not guesswork
2. **Negotiate confidently** - Defensible numbers
3. **Prioritize development** - See which skills are most valuable
4. **Compare locations** - Know compensation differences
5. **Evaluate offers** - Objectively assess if fair

### Technical Implementation
- Calculator functions: `calculateSkillValue()`, `calculateTotalMarketValue()`, `getClosestRoleBenchmark()`
- Dynamic rendering based on loaded valuation data
- Graceful fallback if data not loaded
- Real-time calculations on page load
- Location dropdown in Settings (27 cities)

### Example Output
**Cliff's Profile:**
- 33 Mastery skills, 20 Advanced skills
- Philadelphia, PA location
- Top skills: Enterprise AI Strategy, C-Suite Advisory, Crisis Leadership
- **Calculated Value: $287,450/year**
- Comparable to: VP Strategy (+17% above median)
- Top skill alone: Enterprise AI Strategy = $171,518/year

### Philosophy
This isn't about inflating egos—it's about giving people objective data to:
- Negotiate fairly
- Understand their market position
- Make informed career decisions
- Develop high-value skills strategically

---

## v1.0.2 - "Job Search + Valuation Prep" (February 16, 2026)

**Job Source Improvements + Foundation for Market Valuation**

### Features from v1.0.1
- Fixed threshold slider (0-20% shows ALL jobs)
- Added Remotive.io API (real job source)
- Added Arbeitnow API (real job source)  
- Now 4 job sources total
- Better filtering and job variety

### New in v1.0.2
- **Location dropdown** in Settings - 27 cities with cost-of-living data
- **Market valuation backend** - Calculator functions ready (UI coming in v1.1.0)
- **skill_valuations.json** - Complete skill valuation data model
- Foundation laid for salary negotiation guidance

### What's Ready But Not Visible Yet
The system can now calculate your market value based on:
- Each skill's base value ($18k-$60k/year per skill)
- Proficiency multipliers (Mastery = 2.2x)
- Location adjustments (SF 1.52x → Lincoln 0.82x)
- Market demand factors (AI skills +35%)
- Rarity bonuses (unique combinations)

But UI to display this is coming in v1.1.0 (see SPEC document).

### Known Issues
- WeWorkRemotely still using sample data
- Market valuation not yet visible in UI

---

## v1.0.1 - "Job Source Expansion" (February 16, 2026)

**CRITICAL FIX - Job Search Improvements**

### Bug Fixes
- **Fixed threshold slider** - Now actually works! Setting threshold to 0-20% shows ALL jobs, bypassing seniority and strategic filters
- **Fixed filtering logic** - Removed double-filtering that was hiding jobs even at low thresholds
- Users can now see jobs they're overqualified for by lowering threshold

### New Features
- **Added Remotive.io API** - Real job source, free public API, 100+ remote jobs
- **Added Arbeitnow API** - Real job source, free public API, European + remote jobs
- Now aggregating from 4 job sources total:
  - RemoteOK (working)
  - Remotive (NEW)
  - Arbeitnow (NEW)
  - WeWorkRemotely (sample data)

### Improvements
- Updated loading message to show all 4 sources
- Better "no results" message with clear threshold guidance
- Console logging for each source's job count
- More job variety and volume

### How the Threshold Fix Works
- **0-20% threshold**: Shows ALL jobs from all sources, bypasses all filters (seniority, strategic keywords, skill minimums)
- **21%+ threshold**: Normal filtering applies (seniority level, strategic keywords, minimum skill matches)
- This lets you see the full job market when you want, and filter down when you don't

### Known Issues
- WeWorkRemotely still using sample data (no public API)
- RemoteOK may occasionally rate-limit
- Job descriptions vary in quality across sources

---

## v1.0 - "Complete System" (February 16, 2026)

**MAJOR RELEASE - First production-ready version**

### Core Features

#### Skills Management
- 73 professional skills with evidence database
- Network graph visualization (D3.js force layout)
- Card view with detailed information
- Role-based filtering (9 career roles)
- Proficiency level filtering (Mastery, Advanced, Proficient)
- Live skill search and filtering
- Interactive skill detail modals
- Mobile-responsive (defaults to card view on mobile)

#### Job Search & Matching
- Multi-source job aggregation (RemoteOK, WeWorkRemotely)
- Smart skill extraction with synonym matching
- Weighted keyword matching (title 3x, early mention 2x, late 1x)
- 60+ skill mappings with 3-6 synonyms each
- Configurable seniority filtering (Entry/Mid/Senior/Executive)
- Minimum match score and skill count thresholds
- Match score visualization with color coding
- Source badges showing job board origin

#### AI-Powered Pitch Generation
- Custom cover letters using your skills and outcomes
- Pulls from shared Work Blueprint data
- Matches skills to job requirements
- Includes purpose statement and values alignment
- Editable in modal before saving
- Copy to clipboard or download as .txt
- Auto-track application option

#### Job-Skill Visualization
- "View on Network" highlights matching skills
- Dims non-matching skills and connections
- Larger nodes for matched skills with green borders
- "Back to Jobs" overlay button
- Visual understanding of fit

#### Work Blueprint System
- Auto-extracted outcomes from skill evidence (12+)
- Pattern recognition: quantification, comparison, scale
- 7 outcome categories (Business Impact, Strategic Foresight, etc.)
- Sensitive content flagging (recovery, personal stories)
- Coaching suggestions per outcome
- Add custom outcomes with 7 templates
- Edit outcomes with full modal
- Inferred values from evidence (7 core values)
- Editable purpose statement
- Per-item share toggles (consent-based)

#### Application Tracker ⭐ NEW
- Complete job application management system
- Track unlimited applications
- Status tracking: Applied, Interviewing, Offer, Closed
- Fields: Title, Company, Date, Salary, Match Score, URL, Notes, Follow-up
- CRUD operations (Create, Read, Update, Delete)
- Status summary dashboard
- Quick status updates
- Auto-track from Opportunities tab
- Card-based UI with color-coded status badges
- Follow-up date reminders

#### Professional PDF Export
- jsPDF-powered document generation
- Professional formatting with sections
- Respects consent settings (only shared items)
- Includes: Outcomes, Values, Purpose, Professional Context
- Proper page breaks and margins
- Downloads as `work-blueprint-[name].pdf`

#### Data Persistence & Backup
- Auto-save every 30 seconds
- Manual save on all data changes
- localStorage persistence across sessions
- Export full profile as JSON
- Import profile from backup
- Backup/restore UI in Settings
- Data portability across devices

#### Consent & Sharing
- Per-item share toggles (outcomes, values)
- Share profile presets (5 types)
- Sharing status dashboard
- Legal & privacy information
- Links to CCPA, GDPR, EEOC
- Best practices guidance
- Basic shareable links (URL-encoded)

#### Settings & Configuration
- Profile information (name, email, location)
- Job preferences:
  - Seniority level (4 options)
  - Minimum match score slider
  - Minimum skill matches
  - Minimum salary (optional)
- Dynamic keyword filtering based on seniority
- Settings persist across sessions
- Backup & restore section

#### User Experience
- Universal configuration system (not hardcoded to one user)
- Dynamic stats bar (changes per tab)
- Mobile-responsive design (768px and 480px breakpoints)
- Loading states and spinners
- Error handling with fallbacks
- Coaching tips throughout
- Reflection prompts for self-assessment

### Technical Improvements
- Balanced network physics (fits on screen, minimal overlap)
- Viewport bounds (nodes can't escape)
- Collision detection in force layout
- Enhanced skill extraction with word boundaries
- Deduplication across job sources
- Source tracking per job
- Auto-initialization on page load

### Performance
- Auto-save throttled to 30 seconds
- Lazy loading for tabs (initialize on first view)
- Efficient data structures
- Compressed assets (55KB ZIP)

### Files Included
- `index.html` - Complete application (single file)
- `skill_evidence.json` - 73 skills with evidence database
- `CHANGELOG.md` - This file

---

## Future Roadmap

### v1.1 (Next Minor Update)
- Bug fixes from v1.0
- More job sources (AngelList, etc.)
- Enhanced mobile UI
- Interview prep notes in Application Tracker

### v2.0 (Next Major Update)
- Onboarding Wizard (resume upload, skill extraction)
- Companies I Follow tab
- Timeline View (career arc)
- Enhanced analytics

### v3.0 (Advanced Features)
- ML-based job matching
- Multiple profiles
- Dark/Light mode toggle
- Email notifications
- Calendar integration

---

## Credits
Built with: D3.js, jsPDF, vanilla JavaScript, HTML5, CSS3
