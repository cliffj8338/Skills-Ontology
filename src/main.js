/**
 * src/main.js — Blueprint™ App Entry Point
 * Phase 1: Core + UI leaf modules wired in.
 * legacy.js still runs the full app — these modules run alongside it,
 * exporting to window.* for compatibility during migration.
 */

// ─── Phase 1: Core utilities ──────────────────────────────────────────────────
import {
    BP_VERSION, BP_BUILD,
    JOB_SCHEMA_VERSION, JOB_SKILLS_CAP,
    PROFILE_SKILL_CAP, WB_SKILL_CAP, SKILL_CAP_WARN,
    INCIDENT_MAX, AI_PROXY_URL,
    AI_INPUT_COST_PER_M, AI_OUTPUT_COST_PER_M,
    AI_FEATURES, API_FEATURES, API_HEALTH_SERVICES,
    WB_INDUSTRIES, WB_TRAVEL_OPTIONS, WB_SCHEDULE_OPTIONS, WB_EMPLOYMENT_TYPES,
    devStats,
    logIncident, resolveIncidents, clearIncidentLog,
    getIncidentLog, saveIncidentLog,
    getApiHealth, saveApiHealth, recordApiHealth, getServiceStatus,
    getAIUsageLog, saveAIUsageLog, trackAICall,
    getAPIUsageLog, saveAPIUsageLog, trackAPICall, getMonthlyAPIUsage,
} from './core/constants.js';

import {
    safeGet, safeSet, safeRemove,
    safeParse,
    escapeHtml, decodeHtmlEntities, safeSetAvatar,
    sanitizeUrl, sanitizeImport,
    debouncedSave,
} from './core/security.js';

// ─── Phase 1: UI primitives ───────────────────────────────────────────────────
import { bpIcon, getRoleIconSvg, hydrateIcons } from './ui/icons.js';
import { showToast, dismissToast }               from './ui/toast.js';

// ─── Phase 1 confirmation ─────────────────────────────────────────────────────
console.log('%c   BLUEPRINT™ MODULE BUILD   ', 'color:#60a5fa;font-weight:bold;font-size:14px;');
console.log('%c   ' + BP_VERSION + ' — Phase 1  ', 'color:#a78bfa;font-weight:bold;font-size:12px;');
console.log('%c   Core + UI modules live     ', 'color:#10b981;font-size:11px;');

// ─── Pending phases (uncomment as phases complete) ────────────────────────────
// Phase 2: import { initFirebase } from './core/firebase.js';
// Phase 3: import { loadSkillLibrary } from './engine/skill-library.js'; ...
// Phase 4: import { initNav, switchView } from './ui/nav.js';
// Phase 5: import { initAdminView } from './admin/index.js';
// Phase 6: import { initWBWizard } from './features/wb-wizard.js'; ...
// Phase 7: import { initWelcome } from './views/welcome.js'; ...
// Phase 8: remove legacy.js, wire full init()
