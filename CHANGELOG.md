# Work Blueprint - Version History

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
