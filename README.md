# Work Blueprint v1.0

**Your Consent-Based Professional Profile & Job Search System**

---

## 🎯 What Is This?

Work Blueprint is a comprehensive personal career management system that helps you:

1. **Organize your professional skills** - 73 skills visualized as an interactive network
2. **Find matching jobs** - Real-time job aggregation with AI-powered matching
3. **Generate custom pitches** - AI creates cover letters using YOUR authentic outcomes
4. **Track applications** - Complete application lifecycle management
5. **Control what you share** - Consent-based sharing with per-item toggles
6. **Export professionally** - Generate PDFs for sharing your Work Blueprint

---

## 🚀 Quick Start

### Installation

1. **Download** `work-blueprint-v1.0.zip`
2. **Extract** to a folder on your computer
3. **Upload to GitHub Pages:**
   - Create a new repository (e.g., `Work-Blueprint`)
   - Upload `index.html` and `skill_evidence.json`
   - Enable GitHub Pages in Settings → Pages → Source: main branch
   - Visit `https://[your-username].github.io/Work-Blueprint/`

### First Time Setup

1. **Skills Ontology Tab:**
   - Browse your 73 skills
   - Click any skill to see evidence and details
   - Filter by role or proficiency level
   - Search for specific skills

2. **Settings Tab:**
   - Enter your name (updates throughout system)
   - Set your seniority level (Entry/Mid/Senior/Executive)
   - Adjust match thresholds
   - All settings auto-save

3. **Work Blueprint Tab:**
   - Review auto-extracted outcomes
   - Toggle share settings (ON/OFF per outcome)
   - Add custom outcomes using templates
   - Edit your purpose statement
   - Select your core values

4. **Opportunities Tab:**
   - Click "Find Matching Jobs"
   - Review job matches (real-time from multiple sources)
   - Click "Generate Pitch" to create custom cover letter
   - Click "View on Network" to visualize skill matches
   - Click "Track Application" to add to tracker

5. **Applications Tab:**
   - Track jobs you've applied to
   - Update status (Applied → Interviewing → Offer/Closed)
   - Set follow-up dates
   - Add notes

---

## 📊 System Overview

### Main Tabs

1. **Skills Ontology** - Your professional competencies
   - Network View (graph visualization)
   - Card View (detailed list)
   - 73 skills across 9 career roles
   - Evidence database for each skill

2. **Opportunities** - Job search & matching
   - Multi-source job aggregation
   - AI-powered skill matching
   - Generate custom pitches
   - Visual skill mapping

3. **Applications** - Track your job search
   - Complete application management
   - Status tracking
   - Follow-up reminders
   - Notes system

4. **Work Blueprint** - Your professional profile
   - Outcomes you've driven
   - Core values
   - Purpose statement
   - Consent controls

5. **Consent & Sharing** - Privacy controls
   - Share profile presets
   - Per-item toggles
   - Legal information
   - Export options

6. **Settings** - Configuration
   - Profile information
   - Job preferences
   - Backup & restore

---

## ✨ Key Features

### Auto-Save System
- Saves every 30 seconds automatically
- Manual save on all changes
- Data persists across browser sessions
- Never lose your work

### PDF Export
- Professional formatted documents
- Respects your consent settings
- Includes outcomes, values, purpose
- Download as `work-blueprint-[name].pdf`

### AI Pitch Generation
- Uses YOUR authentic outcomes and skills
- Matches to specific job requirements
- Editable before sending
- Copy or download

### Visual Job Matching
- "View on Network" highlights matching skills
- See exactly why you're a fit
- Understand skill gaps

### Application Tracking
- Track unlimited applications
- 4 status types
- Follow-up date tracking
- Auto-track from job opportunities

---

## 💾 Data & Privacy

### Where Is Data Stored?
- **Locally** in your browser (localStorage)
- **No server** - everything runs in browser
- **Your control** - export/delete anytime

### What Data Is Saved?
- Profile settings (name, email, location)
- Job preferences
- Work Blueprint (outcomes, values, purpose)
- Application tracking data
- Consent settings

### Data Portability
- Export full profile as JSON backup
- Import to restore or transfer devices
- PDF export for sharing

### Privacy
- You control exactly what's shared
- Per-item consent toggles
- Share presets for different audiences
- No tracking, no analytics

---

## 🔧 Configuration

### Seniority Levels

**Entry Level:**
- Shows: Junior, Associate, Entry roles
- Hides: Senior, Director, VP roles

**Mid Level:**
- Shows: Senior, Lead, Manager roles
- Hides: Junior, Director, VP roles

**Senior Level:**
- Shows: Senior Manager, Director roles
- Hides: Junior, VP roles

**Executive Level:**
- Shows: VP, Chief, Head of, Director roles
- Hides: IC roles (Engineer, Designer, etc.)

### Match Thresholds

- **Minimum Match Score:** 0-100% (default 50%)
- **Minimum Skill Matches:** 1-10 skills (default 3)
- **Minimum Salary:** Optional filter

---

## 📱 Mobile Support

- Fully responsive design
- Defaults to Card View on mobile (Network View too complex for touch)
- Touch-friendly buttons and controls
- Works on tablets and phones

---

## 🐛 Troubleshooting

### Jobs Not Loading
- Check browser console for errors
- RemoteOK API may be rate-limited
- Try again in a few minutes
- Sample data loads as fallback

### Data Not Saving
- Check browser localStorage is enabled
- Clear browser cache and refresh
- Export backup before clearing

### PDF Export Not Working
- Ensure jsPDF library loaded (check console)
- Try in different browser
- Disable ad blockers

### Network View Too Crowded
- Use search box to filter skills
- Switch to Card View for mobile
- Adjust browser zoom

---

## 🗺️ Roadmap

### v1.1 (Next Update)
- More job sources
- Interview prep notes
- Enhanced mobile UI
- Bug fixes

### v2.0 (Major Update)
- Onboarding Wizard (resume upload)
- Companies I Follow tab
- Timeline View
- Advanced analytics

### v3.0 (Advanced Features)
- ML-based matching
- Multiple profiles
- Dark/Light mode
- Email notifications

---

## 📄 Files Included

- `index.html` - Complete application (152KB)
- `skill_evidence.json` - Skills database (22KB)
- `CHANGELOG.md` - Version history
- `VERSION` - Current version number
- `README.md` - This file

---

## 🤝 Support

This is a personal tool built for individual use. No official support provided, but:

- Check `CHANGELOG.md` for features and fixes
- Review code in `index.html` (all JavaScript is inline)
- Backup your data regularly using Settings → Backup & Restore

---

## 📜 License

Personal use only. Not for redistribution or commercial use.

---

## 🎉 Credits

**Built with:**
- D3.js - Network visualization
- jsPDF - PDF generation
- Vanilla JavaScript
- HTML5 & CSS3

**Version:** 1.0.0  
**Release Date:** February 16, 2026  
**Status:** Production Ready ✅

---

**Enjoy your Work Blueprint!** 🚀
