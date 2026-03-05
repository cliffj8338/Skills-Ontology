/**
 * src/main.js — Blueprint™ App Entry Point
 * Phase 7b: Views/reports + Views/settings live.
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

// ─── Phase 3: Engine ──────────────────────────────────────────────────────────
import { loadCrosswalkDeferred }                       from './engine/crosswalk.js';
import { loadCertificationLibrary, searchCertLibrary } from './engine/certifications.js';
import {
    initSkillLibrary, loadExternalSynonyms,
    ensureSkillLibrary, searchSkills,
    deduplicateSkills, canAddSkill,
    loadAdminSkillBlocklist, loadAdminApprovedSkills,
    isSkillBlocklisted, isSkillApproved,
    getEscoCategorySiblings,
} from './engine/skill-library.js';

// ─── Phase 4: Navigation ──────────────────────────────────────────────────────
import {
    initTheme, updateProfileChip, toggleFilterPanel,
    saveAll, saveUserData,
    checkReadOnly, readOnlyGuard, detectAppMode,
    demoGate, gatedPromptHTML,
    enterDemoMode, exitDemoMode, toggleDemoMode, switchDemoProfile, updateDemoToggleUI,
    switchView, toggleSkillsView,
} from './ui/nav.js';

// ─── Phase 7a: Reports view ───────────────────────────────────────────────────
import {
    initReports,
    openDemoScoutingReport,
    viewDemoSampleReport,
} from './views/reports.js';

// ─── Phase 7b: Settings view ──────────────────────────────────────────────────
import {
    initSettings, switchSettingsTab, renderSettingsTabContent,
    renderProfileSettings, renderExperienceSettings, refreshExperienceContent,
    renderJobPreferences, renderDataExport, renderPrivacyAndData,
    addWorkHistoryItem, editWorkHistoryItem, removeWorkHistoryItem,
    openWorkHistoryModal, addAchievementInput, saveWorkHistoryFromModal,
    toggleWorkHistoryHidden, getVisibleWorkHistory, getVisibleRoles,
    hideRoleFromNetwork, cleanOrphanRoles,
    addEducationItem, editEducationItem, removeEducationItem,
    openEducationModal, edSwitchType, edAddNewCred,
    edRenderLinkedCredTags, edRemoveLinkedCred, saveEducationFromModal,
    addCertItem, editCertItem, removeCertItem, openCertModal,
    onCertLibrarySearch, selectCertFromLibrary,
    addCertLinkedSkill, removeCertLinkedSkill, saveCertFromModal,
    showCertSkillNotification, editDevStats, saveDevStats,
    disableBulkActionsInSampleMode, renderSkillsList,
    exportFullProfile, importFullProfile,
} from './views/settings.js';

// ─── Phase 7b confirmation ────────────────────────────────────────────────────
console.log('%c   BLUEPRINT™ MODULE BUILD   ', 'color:#60a5fa;font-weight:bold;font-size:14px;');
console.log('%c   ' + BP_VERSION + ' — Phase 7b  ', 'color:#a78bfa;font-weight:bold;font-size:12px;');
console.log('%c   Reports + Settings views live  ', 'color:#10b981;font-size:11px;');

// ─── Pending phases ───────────────────────────────────────────────────────────
// Phase 5: admin/index.js         (delivered, needs re-upload)
// Phase 6: features/ai-generators.js (delivered, needs re-upload)
// Phase 7c: views/network.js
// Phase 7d: views/applications.js
// Phase 7e: views/welcome.js
// Phase 7f: views/jobs.js
// Phase 7g: views/blueprint.js
// Phase 8: remove legacy.js, wire full init()
