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

// ─── Phase 7d: Applications view ─────────────────────────────────────────────
import {
    initApplications, renderApplications, renderApplicationCard,
    addApplicationModal, saveApplication, updateApplicationStatus,
    editApplication, saveApplicationEdit, deleteApplication,
    initConsent, renderSharePresets, renderPresetCard,
    renderSharingStatus, renderLegalSection,
    handleProfilePhoto, removeProfilePhoto, saveSettings, selectPreset,
    filterSkillsView, showValuationBreakdown, renderInlineNegotiation, showNegotiationGuide,
    getSkillImpact, getImpactLabel, getImpactIcon, getImpactColor,
    closeONETPicker, renderONETLibrary, addSelectedONETSkills,
    openBulkImport, closeBulkImport, executeBulkImport,
    openBulkManager, closeBulkManager, bulkManagerSetLevel, bulkManagerRemove,
    openEditSkillModal, closeEditSkillModal, openUnifiedSkillEditor, closeUnifiedSkillEditor,
    saveSkillEdit, confirmDeleteSkill, deleteSkill,
    openAssessSkillModal, closeAssessSkillModal, saveSkillAssessment,
    refreshAllViews, renderYourSkills, filterYourSkills, removeSkillFromProfile,
    handleAddSkillsSearch, addSkillFromLibrary,
} from './views/applications.js';

// ─── Phase 7e: Welcome view ───────────────────────────────────────────────────
import {
        renderWelcomePage, initHeroNetwork, viewSampleProfile, selectShowCollection,
    showWelcomeView, showBlsCategoryEditor,
    saveBlsCategoryOverride, clearBlsCategoryOverride, setValuationMode, formatCompValue,
    getEffectiveComp, loadEvidenceConfig, saveEvidenceConfig, scoreOutcome,
    calculateEvidencePoints, getEffectiveLevel, getEffectiveLevelFromPoints, hasLinkedCertification,
    getHighestCertTier, getSkillVerifications, getValuationLevel, getEvidenceSummary,
    requestVerification, sendVerificationRequest, confirmVerification, declineVerification,
    getVerificationStats, expireStalePendingVerifications, getCredibilityLabel, checkVerificationLandingPage,
    checkShowcaseMode, showVerifierLandingPage, fetchVerificationData, renderVerifierForm,
    submitVerifierResponse, addOutcomeToSkill, editSkillOutcome, removeOutcome,
    showOutcomeForm, updateOutcomeScorePreview, saveOutcomeForm, cancelOutcomeForm,
    getCertSkillAssociations, getFallbackSkillMatches, getCertFloorLevel, buildProfileSelector,
    switchProfile,
    getCategoryColor, isSkillAlreadyAdded, showSkillCapTriage, updateTriageCount,
    confirmSkillCapTriage, getSampleJobsForProfile, loadTemplate,
    showOnboardingWizard, closeWizard, renderWizardStep, wizardNext,
    wizardBack, confirmExitWizard, wizardHeading, wizardBtn,
    openMergeComparisonModal, mergeToggleAll, applyMergeSelections, renderWizardStep1,
    wizardOverwriteGuard, wizardQuickExport, wizardChooseUpload, wizardChooseLinkedIn,
    wizardChooseManual, wizardChooseImport, wizardImportProfile, renderWizardStep2,
    wizardSetResumeTab, wizardHandleResumeDrop, wizardHandleResumeFile, wizardProcessResumeFile,
    wizardClearResumeFile, wizardCheckResumeReady, wizardSkipParsing, renderWizardStep2LinkedIn,
    wizardHandleLinkedInDrop, wizardHandleLinkedInFile, renderWizardStep3, renderWizardStep4,
    wizardField, wizardSaveProfile, renderWizardStep5, wizardSaveEnrichment,
    renderWizardStep6, wizardSaveSkills, renderWizardStep7, wizardToggleValue,
    wizardEditValueDesc, wizardAddCustomValue, wizardSaveValues, renderWizardStep8,
    wizardSavePurpose, renderWizardStep9, wizardApplyContentOpts, wizardBuildUserData,
    wizardSaveAndGo, wizardDownloadBackup, wizardLaunchOnly, wizardApplyAndLaunch,
} from './views/welcome.js';

// ─── Phase 7f: Jobs view ──────────────────────────────────────────────────────
import {
    _fitBuildSearchTerms, _fitSortData, _fitAddToPipeline, initOpportunities, switchJobsSubTab,
    renderJobsSubTab, renderTrackerInJobs, renderSavedJobs, renderFindJobs, clearJobSearch,
    showAddJobModal, extractSPAJobData, _extractDeepJobText, extractTextFromHtml, matchJobToBLS,
    parseJobLocally, classifyRequirementLevel, inferJobProficiency, proficiencyValue, crosswalkNormalizeTitle,
    crosswalkDice, resolveTitle, getOccupationProfile, detectSeniority, adjustLevel,
    inferSkillsDeterministic, suggestMissingSkills, mergeSkillSources, registerInSkillLibrary, getSkillSynonyms,
    getSkillSynonymsExpanded, getRoleSuggestions, isJobV2, getJobSkills, getJobRoles,
    normalizeTier, tierWeight, migrateJobToV2, migrateAllJobsToV2, validateJobSchema,
    matchJobToProfile, rescoreAllJobs, rescoreOneJob, quickAddGapSkill, confirmQuickAddGapSkill,
    quickAddSuggested, showJobDetail, removeJob, editJobInfo, saveJobEdit,
    reanalyzeJob, updateMatchThreshold, updateMinSkillMatches, updateFitMinMatch, updateFitMinSkills,
    _debouncedSavePrefs, filterOpportunities, setJobsSort, sortJobResults, renderOpportunities,
    formatJobsCount, updateJobsDbCount, getJobsSourceBreakdown, loadJobsFromCache, scoreAndDisplayCachedJobs,
    formatTimeAgo, updateSyncStatusDisplay, updateJobsBadge, searchOpportunities, searchLiveFromAPIs,
    searchDirect, quickScoreJob,
} from './views/jobs.js';

// ─── Phase 7g: Blueprint view ─────────────────────────────────────────────────
import {
    initBlueprint, extractOutcomesFromEvidence, categorizeOutcome, isSensitiveContent, generateCoachingFor,
    inferCompanyValuesFromJD, _persistCompanyValues, getCompanyValues, computeValuesAlignment, saveValues,
    loadSavedValues, getEvidenceForValue, getKeywordsForValue, scoreValueByEvidence, getCatalogDescription,
    editValueNote, saveValueNote, inferValues, renderBlueprint, switchBlueprintTab,
    renderBlueprintTabContent, renderDashboardTab, renderSkillsManagementTab, renderExperienceTab, renderOutcomesSection,
    renderOutcomeItem, renderValuesSection, renderSelectedValues, renderValuesPicker, _countContentItems,
    _getContentVis, toggleContentVis, contentToggleAllSection, _toggleSwitch, _contentCard,
    _sectionHeader, renderContentEvidenceTab, renderExportSection, renderVerificationsTab, verifyTabRequestNew,
    verifyTabRevoke, verifyTabClearExpired, verifyTabResend, toggleOutcomeShare, deleteBlueprintOutcome,
    editOutcome, saveOutcomeEdit, viewOutcomeEvidence, addCustomOutcome, fillOutcomeTemplate,
    saveCustomOutcome, toggleValue, refreshValuesUI, updateValuesBadge, toggleValuesPicker,
    pickValue, removeSelectedValue, showAddCustomValueForm, showAddValueForm, hideAddValueForm,
    addCustomValue, moveValue, updatePurpose, getBlindDefaults, setBlindDefault,
    getActiveBlindSettings, hasAnyBlinding, hasOverrides, applyBlindSettings, logPrivacyEvent,
    showScoutingReportPicker, launchScoutingReport, showReportFormatPicker, generateHTMLScoutingReport, buildReportData,
    showReportOverlay, shareScoutingReport, openSampleScoutingReport, generateScoutingReport, generateScoutingReportPDF,
    exportBlueprint, generatePDF, copyBlueprintText, generateCoverLetter, buildCoverLetter,
    buildTemplateCoverLetter, showCoverLetterResult, copyCoverLetter, downloadCoverLetter, generateInterviewPrep,
    buildInterviewPrep, buildTemplateInterviewPrep, showInterviewPrepResult, copyInterviewPrep, downloadInterviewPrep,
    generateLinkedInProfile, buildTemplateLinkedIn, showLinkedInResult, copyLinkedIn,
} from './views/blueprint.js';

// ─── Phase 7h: Nav shared ─────────────────────────────────────────────────────
import {
    updateStatsBar, toggleLabelPill, applyLabelToggles, renderFilterChips, showTooltip, hideTooltip, dragstarted, dragged, dragended, gatherBlueprintData, extractMetric, createBlueprintHTML, downloadBlueprint, estimateSkillYears, openRelatedSkill, openSkillModalFromCard, gatherResumeData, buildResumeHTML,
} from './ui/nav-shared.js';

// ─── Build banner ─────────────────────────────────────────────────────────────
console.log('%c   BLUEPRINT™ MODULE BUILD   ', 'color:#60a5fa;font-weight:bold;font-size:14px;');
console.log('%c   ' + BP_VERSION + ' — Phase 7c  ', 'color:#a78bfa;font-weight:bold;font-size:12px;');
console.log('%c   Phase 7 complete  ', 'color:#10b981;font-size:11px;');

// ─── Pending phases ───────────────────────────────────────────────────────────
// Phase 5: admin/index.js
// Phase 6: features/ai-generators.js
// Phase 7d: views/applications.js  (L42894–L46372, 3,478 lines)
// Phase 7e: views/welcome.js       (L15032–L22481, 7,449 lines)
// Phase 7f: views/jobs.js          (L34230–L40719, 6,489 lines)
// Phase 7g: views/blueprint.js     (L26795–L34230, 7,435 lines)
// Phase 7h: ui/nav-shared.js       (L24948–L26794, 1,846 lines — switchView, updateStatsBar etc.)
// Phase 8:  remove legacy.js, wire full init()
