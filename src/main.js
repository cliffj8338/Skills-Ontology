/**
 * src/main.js — Blueprint™ App Entry Point
 * Phase 7c: Network view live.
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
    renderProfileSettings, renderExperienceSettings,
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

// ─── Phase 7c: Network view ───────────────────────────────────────────────────
import {
    toggleJobSelector, renderJobSelectorWidget,
    networkLabelLines, toggleNetworkLabels,
    initNetwork, activateJobOverlay, activateValuesOverlay, clearJobOverlay,
    updateMatchOverlayUI, setNetworkMatchMode,
    initJobNetwork, initMatchNetwork,
    makeTileDraggable, addJobInfoTile, addMatchLegend,
    initValuesNetwork, addValuesAlignmentPanel,
    toggleValuesPanel, closeValuesPanel, initPanelDrag,
    findJobIdx, initCardView,
} from './views/network.js';

// ─── Build banner ─────────────────────────────────────────────────────────────
console.log('%c   BLUEPRINT™ MODULE BUILD   ', 'color:#60a5fa;font-weight:bold;font-size:14px;');
console.log('%c   ' + BP_VERSION + ' — Phase 7c  ', 'color:#a78bfa;font-weight:bold;font-size:12px;');
console.log('%c   Network view live  ', 'color:#10b981;font-size:11px;');

// ─── Pending phases ───────────────────────────────────────────────────────────
// Phase 5: admin/index.js
// Phase 6: features/ai-generators.js
// Phase 7d: views/applications.js  (L42894–L46372, 3,478 lines)
// Phase 7e: views/welcome.js       (L15032–L22481, 7,449 lines)
// Phase 7f: views/jobs.js          (L34230–L40719, 6,489 lines)
// Phase 7g: views/blueprint.js     (L26795–L34230, 7,435 lines)
// Phase 7h: ui/nav-shared.js       (L24948–L26794, 1,846 lines — switchView, updateStatsBar etc.)
// Phase 8:  remove legacy.js, wire full init()
