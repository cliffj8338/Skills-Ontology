/**
 * src/main.js — Blueprint™ App Entry Point
 * Phase 2: Core + UI + Firebase + Analytics modules live.
 */

// ─── Phase 1: Core utilities ──────────────────────────────────────────────────
import {
    BP_VERSION,
    logIncident, resolveIncidents, clearIncidentLog,
    recordApiHealth, getServiceStatus,
    trackAICall, trackAPICall,
    WB_INDUSTRIES, WB_TRAVEL_OPTIONS, WB_SCHEDULE_OPTIONS, WB_EMPLOYMENT_TYPES,
} from './core/constants.js';

import {
    safeGet, safeSet, safeRemove, safeParse,
    escapeHtml, decodeHtmlEntities, safeSetAvatar,
    sanitizeUrl, sanitizeImport, debouncedSave,
} from './core/security.js';

// ─── Phase 1: UI primitives ───────────────────────────────────────────────────
import { bpIcon, getRoleIconSvg, hydrateIcons } from './ui/icons.js';
import { showToast, dismissToast }               from './ui/toast.js';

// ─── Phase 2: Firebase + Analytics ───────────────────────────────────────────
import {
    showAuthModal, closeAuthModal,
    authWithGoogle, authEmailSignIn, authSendMagicLink, authSignOut,
    handlePostSignIn, checkAdminRole,
    saveToFirestore, loadUserFromFirestore,
    exportMyData, requestDataDeletion,
    updateLastSavedDisplay, getSaveBackup,
} from './core/firebase.js';

import { bpTracker } from './core/analytics.js';

// ─── Phase 2 confirmation ─────────────────────────────────────────────────────
console.log('%c   BLUEPRINT™ MODULE BUILD   ', 'color:#60a5fa;font-weight:bold;font-size:14px;');
console.log('%c   ' + BP_VERSION + ' — Phase 2  ', 'color:#a78bfa;font-weight:bold;font-size:12px;');
console.log('%c   Firebase + Analytics live  ', 'color:#10b981;font-size:11px;');

// ─── Pending phases ───────────────────────────────────────────────────────────
// Phase 3: engine modules (skill-library, bls, crosswalk, match)
// Phase 4: ui/nav.js — switchView, hydrateIcons on route changes
// Phase 5: admin/index.js
// Phase 6: features (wb-wizard, scouting, resume, cover-letter)
// Phase 7: views (welcome, network, jobs, blueprint, settings)
// Phase 8: remove legacy.js, wire full init()
