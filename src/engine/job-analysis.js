/**
 * src/engine/job-analysis.js
 * Full JD parsing pipeline: BLS matching, Claude API, local fallback, skill extraction, section detection, proficiency inference
 *
 * STATUS: STUB — not yet migrated
 * MONOLITH LINES: 35327–36678
 *
 * Dependencies:
 *   ../core/security.js
 *   ../core/firebase.js
 *   ./skill-library.js
 *   ./bls.js
 *   ./crosswalk.js
 *
 * Exports:
 *   analyzeJobDescription
 *   extractSkillsFromText
 *   parseJobTitle
 *   detectSeniority
 */

// TODO: Add imports when migrating
// import { ... } from '../core/security.js';
// import { ... } from '../core/firebase.js';
// import { ... } from './skill-library.js';
// import { ... } from './bls.js';
// import { ... } from './crosswalk.js';

// ─── STUB EXPORTS ────────────────────────────────────────────────────────────
// Replace each with the real implementation during migration.
// Throwing on call ensures broken migrations surface immediately rather than silently.

export function analyzeJobDescription() { console.warn('analyzeJobDescription not yet migrated'); return null; }
export function extractSkillsFromText() { console.warn('extractSkillsFromText not yet migrated'); return null; }
export function parseJobTitle() { console.warn('parseJobTitle not yet migrated'); return null; }
export function detectSeniority() { console.warn('detectSeniority not yet migrated'); return null; }
