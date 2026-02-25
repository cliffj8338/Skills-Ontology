# Blueprint™ — Career Intelligence App

## Overview
Blueprint is a single-page career intelligence web application. It visualizes skills, reveals market value, and connects users to matching jobs. Originally hosted on Vercel with Firebase backend.

## Architecture
- **Frontend**: Single-file `index.html` (~15,000 lines), vanilla JavaScript, D3.js network graph
- **Auth**: Firebase Auth (Google provider, email/password) — project: `work-blueprint`
- **Database**: Firestore (users, analytics_events, jobs, meta collections)
- **API**: Vercel serverless functions in `/api/` (ai.js, jobs.js, jobs-sync.js, api-job-proxy.js)
- **Static assets**: JSON data files (skills, certifications, O*NET data, BLS wages, profiles)

## Running in Replit
- Static file server using `serve` npm package
- Served on port 5000 via `npm start`
- Workflow: "Start application" → `npm start`

## Key Files
- `index.html` — Main application (entire frontend)
- `blueprint.css` — Stylesheet
- `api/` — Serverless API functions (designed for Vercel)
- `profiles/demo/` — 24 demo profiles (fictional TV/film characters)
- `profiles/templates/` — Profile templates
- `reports/` — Report templates and demo reports
- `skills/` — Skills index files
- `*.json` — Reference data (O*NET, BLS wages, certifications, etc.)

## Data Libraries
- `onet-skills-library.json` — O*NET skills (13,960 skills)
- `onet-abilities-library.json` — O*NET abilities
- `onet-knowledge-library.json` — O*NET knowledge domains
- `bls-wages.json` — BLS wage data (831 occupations)
- `companies.json` — Company values (58 companies)
- `certification_library.json` — 191 credentials
- `values-library.json` — 30 work values

## Deployment
- Configured as static deployment (publicDir: ".")
- User can publish via the Publish button in Replit
