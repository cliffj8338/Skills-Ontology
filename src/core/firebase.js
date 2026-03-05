/**
 * src/core/firebase.js — Phase 2
 * Firebase init, auth state, Firestore persistence, auth UI, GDPR functions.
 * MONOLITH LINES: 2521–3444
 *
 * PHASE 2 BRIDGE PATTERN:
 * legacy.js already called firebase.initializeApp() before this module runs.
 * We read the existing window.fb* globals and re-export them.
 * This eliminates the double-init warning.
 * Phase 8: when legacy.js is removed, this module does the real init.
 *
 * DEPENDENCIES (transition globals from legacy.js):
 *   userData, skillsData, blueprintData, appContext, appMode
 *   updateProfileChip, initializeMainApp, detectAppMode, checkReadOnly
 *   rescoreAllJobs, deduplicateSkills, migrateAllJobsToV2, saveUserData
 *   showWaitlist, showOnboardingWizard, switchView, readOnlyGuard
 *   closeExportModal, showHelp, updateDemoToggleUI
 */

import { logIncident, recordApiHealth, PROFILE_SKILL_CAP } from './constants.js';
import { safeGet, safeSet, safeRemove, safeParse, escapeHtml, safeSetAvatar } from './security.js';
import { bpIcon } from '../ui/icons.js';
import { showToast } from '../ui/toast.js';

// ─── Firebase config ──────────────────────────────────────────────────────────

var firebaseConfig = {
    apiKey:            'AIzaSyBO703p11FdLojH6ogB50XrxoFVy_7bHLE',
    authDomain:        'work-blueprint.firebaseapp.com',
    projectId:         'work-blueprint',
    storageBucket:     'work-blueprint.firebasestorage.app',
    messagingSenderId: '338454233039',
    appId:             '1:338454233039:web:76016289b81d8298269cba'
};

// ─── Bridge: read existing globals set by legacy.js ──────────────────────────
// legacy.js already ran firebase.initializeApp() — don't run it again.
// Phase 8: replace this block with real initializeApp call.

export var fbApp  = window.firebase && window.firebase.apps && window.firebase.apps.length
    ? window.firebase.apps[0]
    : null;
export var fbAuth = window.fbAuth || (window.firebase && window.firebase.auth   ? window.firebase.auth()      : null);
export var fbDb   = window.fbDb   || (window.firebase && window.firebase.firestore ? window.firebase.firestore() : null);
export var fbUser     = window.fbUser     || null;
export var fbIsAdmin  = window.fbIsAdmin  || false;
export var fbReady    = window.fbReady    || false;
export var showcaseMode = window.showcaseMode || false;

// authReady promise — resolves when auth state is first known
export var authReady = window.authReadyPromise || Promise.resolve(null);

// ─── Showcase mode config ─────────────────────────────────────────────────────

export var SHOWCASE_CONFIG = {
    key:        'blueprint-demo-2026',
    sourceUid:  '',
    bannerText: 'Showcase Mode \u2014 All features visible, editing disabled'
};

// ─── Auth modal ───────────────────────────────────────────────────────────────

export function showAuthModal(mode) {
    if (!fbReady) { showToast('Authentication service unavailable. Try refreshing.', 'error'); return; }
    if (mode === 'signup') { if (typeof showWaitlist === 'function') showWaitlist(); return; }

    var overlay = document.getElementById('authOverlay');
    var content = document.getElementById('authModalContent');
    if (!overlay || !content) return;

    content.innerHTML = '<h2>Sign In</h2>'
        + '<div class="auth-subtitle">Welcome back</div>'
        + '<button class="auth-btn auth-btn-google" onclick="authWithGoogle()" style="margin-bottom:10px;">'
        + '<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>'
        + 'Continue with Google</button>'
        + '<div class="auth-divider">or</div>'
        + '<div class="auth-error" id="authError"></div>'
        + '<div class="auth-success" id="authSuccess"></div>'
        + '<input class="auth-input" id="authEmail" type="email" placeholder="Email address" />'
        + '<input class="auth-input" id="authPassword" type="password" placeholder="Password" '
        + 'onkeydown="if(event.key===\'Enter\'){authEmailSignIn()}" />'
        + '<button class="auth-btn auth-btn-primary" onclick="authEmailSignIn()" style="margin-bottom:10px;">Sign In</button>'
        + '<button class="auth-btn auth-btn-magic" onclick="authSendMagicLink()">Send me a sign-in link instead</button>'
        + '<div class="auth-toggle">Don\'t have an account? <a onclick="closeAuthModal(); showWaitlist();">Join the waitlist</a></div>';

    overlay.classList.add('active');
}
window.showAuthModal = showAuthModal;

export function closeAuthModal() {
    var el = document.getElementById('authOverlay');
    if (el) el.classList.remove('active');
}
window.closeAuthModal = closeAuthModal;

function showAuthError(msg) {
    var el = document.getElementById('authError');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
    var s = document.getElementById('authSuccess');
    if (s) s.style.display = 'none';
}
function showAuthSuccess(msg) {
    var el = document.getElementById('authSuccess');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
    var e = document.getElementById('authError');
    if (e) e.style.display = 'none';
}

// ─── Auth methods ─────────────────────────────────────────────────────────────

export function authWithGoogle() {
    if (!fbAuth) return;
    fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(function(r) { closeAuthModal(); handlePostSignIn(r.user, r.additionalUserInfo && r.additionalUserInfo.isNewUser); })
        .catch(function(err) {
            if (err.code === 'auth/popup-closed-by-user') return;
            if (err.code === 'auth/popup-blocked') { showAuthError('Popup blocked. Allow popups for this site, or use email sign-in below.'); return; }
            showAuthError(err.message || 'Google sign-in failed. Try email sign-in below.');
        });
}
window.authWithGoogle = authWithGoogle;

export function authEmailSignIn() {
    if (!fbAuth) return;
    var email = (document.getElementById('authEmail') || {}).value || '';
    var pass  = (document.getElementById('authPassword') || {}).value || '';
    if (!email || !pass) { showAuthError('Please enter email and password.'); return; }
    fbAuth.signInWithEmailAndPassword(email, pass)
        .then(function(r) { closeAuthModal(); handlePostSignIn(r.user, false); })
        .catch(function(err) { showAuthError(friendlyAuthError(err.code)); });
}
window.authEmailSignIn = authEmailSignIn;

export function authSendMagicLink() {
    if (!fbAuth) return;
    var email = (document.getElementById('authEmail') || {}).value || '';
    if (!email) { showAuthError('Please enter your email address first.'); return; }
    fbAuth.sendSignInLinkToEmail(email, { url: window.location.href, handleCodeInApp: true })
        .then(function() { localStorage.setItem('wbMagicLinkEmail', email); showAuthSuccess('Sign-in link sent to ' + email + '. Check your inbox.'); })
        .catch(function(err) { showAuthError(friendlyAuthError(err.code)); });
}
window.authSendMagicLink = authSendMagicLink;

export function authSignOut() {
    if (!fbAuth) return;
    fbAuth.signOut().then(function() {
        window.fbUser = null; fbUser = null;
        window.fbIsAdmin = false; fbIsAdmin = false;
        window._wbCompCache = null; window._wbCompCacheLoaded = false;
        ['wbAnthropicKey','wbValues','wbPurpose','wbEvidenceConfig','currentProfile','blueprint_waitlist','wbMagicLinkEmail'].forEach(safeRemove);
        showToast('Signed out.', 'info');
        if (typeof updateAuthUI === 'function') updateAuthUI();
        if (typeof rebuildProfileDropdown === 'function') rebuildProfileDropdown();
        if (typeof switchView === 'function') switchView('welcome');
    });
}
window.authSignOut = authSignOut;

function friendlyAuthError(code) {
    var map = {
        'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/popup-blocked': 'Pop-up blocked by browser. Allow pop-ups for this site.'
    };
    return map[code] || 'Authentication error. Please try again.';
}

// ─── Post sign-in handler ─────────────────────────────────────────────────────

export function handlePostSignIn(user, isNewUser) {
    if (!user || !fbDb) return;
    var userRef = fbDb.collection('users').doc(user.uid);
    userRef.get().then(function(doc) {
        if (!doc.exists) {
            var name = user.displayName || user.email.split('@')[0];
            userRef.set({
                email: user.email, displayName: name,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                role: 'user', profile: { name: name, email: user.email }, skills: [], roles: []
            });
            if (typeof userData !== 'undefined') {
                userData.profile = { name: name, email: user.email };
                userData.skills = []; userData.templateId = 'firestore-' + user.uid;
            }
            if (typeof skillsData !== 'undefined') { skillsData.skills = []; skillsData.roles = []; }
            if (typeof updateProfileChip === 'function') updateProfileChip(name);
            if (typeof initializeMainApp === 'function') initializeMainApp();
            setTimeout(function() { if (typeof showOnboardingWizard === 'function') showOnboardingWizard(); }, 600);
        } else {
            userRef.update({ lastLogin: firebase.firestore.FieldValue.serverTimestamp() });
            loadUserFromFirestore(user.uid);
        }
    }).catch(function(err) {
        console.error('Firestore user check failed:', err);
        showToast('Could not verify your account. Some features may be limited.', 'error', 5000);
    });
    showToast('Welcome, ' + escapeHtml(user.displayName || user.email) + '!', 'success');
    if (typeof bpTracker !== 'undefined' && bpTracker.sid) bpTracker.trackFunnel('signup');
}
window.handlePostSignIn = handlePostSignIn;

// ─── Admin role check ─────────────────────────────────────────────────────────

export function checkAdminRole(uid) {
    if (!fbDb) return Promise.resolve(false);
    return fbDb.collection('users').doc(uid).get()
        .then(function(doc) {
            var isAdmin = doc.exists && doc.data().role === 'admin';
            console.log(isAdmin ? '[Admin] Admin role confirmed' : '\u2139\uFE0F User role: ' + (doc.exists ? (doc.data().role || 'user') : 'no document'));
            return isAdmin;
        })
        .catch(function(err) { console.error('\u26A0\uFE0F Admin check failed:', err.code || err.message); return false; });
}
window.checkAdminRole = checkAdminRole;

// ─── Firestore persistence ────────────────────────────────────────────────────

function sanitizeForFirestore(obj) {
    if (obj === null || obj === undefined) return null;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sanitizeForFirestore).filter(function(v) { return v !== undefined; });
    var clean = {};
    Object.keys(obj).forEach(function(k) {
        var v = obj[k];
        if (v === undefined) return;
        clean[k] = (typeof v === 'object' && v !== null) ? sanitizeForFirestore(v) : v;
    });
    return clean;
}

var _saveBackupKey = 'bp_save_backup';
function _backupToLocalStorage(data) {
    try { var b = JSON.parse(JSON.stringify(data)); delete b.updatedAt; localStorage.setItem(_saveBackupKey, JSON.stringify({ ts: Date.now(), data: b })); } catch(e) {}
}
function _clearSaveBackup() { try { localStorage.removeItem(_saveBackupKey); } catch(e) {} }
export function getSaveBackup() {
    try { var r = localStorage.getItem(_saveBackupKey); if (!r) return null; var p = JSON.parse(r); if (Date.now() - p.ts > 86400000) { _clearSaveBackup(); return null; } return p; } catch(e) { return null; }
}

export function saveToFirestore() {
    if (!fbDb || !window.fbUser) return Promise.resolve(false);
    if (typeof appContext !== 'undefined' && appContext.mode === 'demo') return Promise.resolve(false);
    var tid = (typeof userData !== 'undefined' && userData.templateId) ? userData.templateId : '';
    if (tid && tid.indexOf('firestore-') !== 0 && tid !== 'wizard-built') return Promise.resolve(false);

    if (window.fbUser.displayName && typeof userData !== 'undefined' && userData.profile) userData.profile.name = window.fbUser.displayName;

    var si = document.getElementById('saveIndicator');
    if (si) { si.innerHTML = bpIcon('upload', 12) + ' Saving...'; si.style.opacity = '0.6'; si.style.color = 'var(--text-muted)'; }

    var uid  = window.fbUser.uid;
    var data = _buildFirestoreData();
    _backupToLocalStorage(data);

    function attempt(n) {
        return fbDb.collection('users').doc(uid).set(data, { merge: true })
            .then(function() {
                console.log('\u2601 Saved to Firestore' + (n > 1 ? ' (retry ' + (n-1) + ')' : ''));
                recordApiHealth('firebase-db', 'ok', 'Operational');
                _clearSaveBackup();
                window._lastSavedAt = new Date();
                var si = document.getElementById('saveIndicator');
                if (si) { si.innerHTML = bpIcon('check', 12) + ' Saved'; si.style.opacity = '1'; si.style.color = '#10b981'; setTimeout(updateLastSavedDisplay, 2500); }
                return true;
            })
            .catch(function(err) {
                if (n < 3) return new Promise(function(res) { setTimeout(function() { res(attempt(n+1)); }, Math.pow(2,n)*500); });
                console.error('Firestore save error (all retries exhausted):', err);
                recordApiHealth('firebase-db', 'down', 'Save failed: ' + err.message);
                logIncident('critical', 'firestore-save', 'Save failed after 3 attempts: ' + err.message);
                var si = document.getElementById('saveIndicator');
                if (si) { si.innerHTML = bpIcon('warning', 12) + ' Save failed'; si.style.opacity = '1'; si.style.color = '#ef4444'; setTimeout(function(){ si.style.opacity='0'; }, 4000); }
                showToast('Your changes could not be saved. They are backed up locally.', 'error', 6000);
                return false;
            });
    }
    return attempt(1);
}
window.saveToFirestore = saveToFirestore;

function _buildFirestoreData() {
    var ud = typeof userData !== 'undefined' ? userData : {};
    var sd = typeof skillsData !== 'undefined' ? skillsData : {};
    var bd = typeof blueprintData !== 'undefined' ? blueprintData : {};
    var data = {
        profile: ud.profile || {},
        skills: (sd.skills || []).map(function(s) {
            var m = { name: s.name||'', level: s.level||1, category: s.category||'', key: s.key||s.name||'', roles: s.roles||[], evidence: s.evidence||[] };
            ['endorsements','endorsementBoosted','source','userAssessment','impactRating','impactScore','onetId','onetCode','core'].forEach(function(k){ if(s[k]) m[k]=s[k]; });
            return m;
        }),
        roles: sd.roles || [],
        values: bd.values || [],
        purpose: bd.purpose || '',
        outcomes: bd.outcomes || [],
        preferences: ud.preferences || {},
        applications: ud.applications || [],
        workHistory: ud.workHistory || [],
        education: ud.education || [],
        certifications: ud.certifications || [],
        verifications: ud.verifications || [],
        savedJobs: (ud.savedJobs || []).map(function(j) {
            return { id:j.id||'', title:j.title||'', company:j.company||'', sourceUrl:j.sourceUrl||'', sourceNote:j.sourceNote||'',
                rawText:j.rawText||'', parsedSkills:j.parsedSkills||[], parsedRoles:j.parsedRoles||[],
                seniority:j.seniority||'', matchData:j.matchData||{}, addedAt:j.addedAt||new Date().toISOString(), sample:j.sample||false };
        }),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    ['linkedinContent','contentVisibility','companyTenures','importStats','blindDefaults'].forEach(function(k){ if(ud[k]) data[k]=ud[k]; });
    if (ud.privacyLog && ud.privacyLog.length > 0) data.privacyLog = ud.privacyLog.slice(-100);
    if (window._blueprintDevStats) data.devStats = window._blueprintDevStats;
    data = sanitizeForFirestore(data);
    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    delete data.role; delete data.isAdmin;
    return data;
}

// ─── Last saved display ───────────────────────────────────────────────────────

export function updateLastSavedDisplay() {
    var si = document.getElementById('saveIndicator');
    if (!si || !window._lastSavedAt) { if (si) si.style.opacity = '0'; return; }
    var diff  = Math.round((new Date() - window._lastSavedAt) / 1000);
    var label = diff < 10 ? 'just now' : diff < 60 ? diff + 's ago' : diff < 3600 ? Math.floor(diff/60) + 'm ago' : Math.floor(diff/3600) + 'h ago';
    si.innerHTML = bpIcon('clock', 10) + ' ' + label;
    si.style.color = 'var(--text-muted)'; si.style.opacity = '0.6';
}
window.updateLastSavedDisplay = updateLastSavedDisplay;
setInterval(updateLastSavedDisplay, 30000);

// ─── Load from Firestore ──────────────────────────────────────────────────────

export function loadUserFromFirestore(uid) {
    if (!fbDb) return Promise.resolve(false);
    return fbDb.collection('users').doc(uid).get()
        .then(function(doc) {
            var ud = typeof userData !== 'undefined' ? userData : {};
            if (!doc.exists) {
                if (window.fbUser) {
                    var n = window.fbUser.displayName || window.fbUser.email.split('@')[0];
                    ud.profile = { name: n, email: window.fbUser.email };
                    ud.skills = ud.values = ud.roles = ud.savedJobs = ud.workHistory = ud.education = ud.certifications = [];
                    ud.purpose = ''; ud.templateId = 'firestore-' + uid; ud.initialized = true;
                    if (typeof skillsData !== 'undefined') { skillsData.skills = []; skillsData.roles = []; }
                }
                return false;
            }
            var data = doc.data();
            console.log('\u2601 Loading profile from Firestore...');
            ud.initialized = true;
            ud.profile = data.profile || {};
            if (window.fbUser) {
                ud.profile.name = window.fbUser.displayName || window.fbUser.email.split('@')[0];
                if (window.fbUser.email && !ud.profile.email) ud.profile.email = window.fbUser.email;
            }
            ['skills','values','purpose','roles','preferences','applications','savedJobs','workHistory',
             'education','certifications','verifications','linkedinContent','contentVisibility',
             'companyTenures','importStats','blindDefaults','privacyLog'].forEach(function(k){
                ud[k] = data[k] || (typeof ud[k] === 'string' ? '' : Array.isArray(ud[k]) ? [] : {});
            });
            if ((data.preferences||{}).sharingPreset && typeof currentPreset !== 'undefined') currentPreset = data.preferences.sharingPreset;
            ud.templateId = 'firestore-' + uid;
            if (data.devStats && window._blueprintDevStats) Object.assign(window._blueprintDevStats, data.devStats);
            if (typeof skillsData !== 'undefined') { skillsData.skills = data.skills||[]; skillsData.roles = data.roles||[]; }
            if (typeof deduplicateSkills === 'function') { var d = deduplicateSkills(); if (d>0) { if (typeof saveUserData==='function') saveUserData(); if (window.fbUser) { var db=typeof debouncedSave==='function'?debouncedSave:null; if(db) db(); } } }
            if (typeof migrateAllJobsToV2 === 'function') { var m = migrateAllJobsToV2(); if (m>0) { if (typeof saveUserData==='function') saveUserData(); } }
            if ((ud.skills||[]).length > PROFILE_SKILL_CAP && typeof showSkillCapTriage === 'function') setTimeout(showSkillCapTriage, 1500);
            // Demo data contamination guard
            var demoNames = ['Restaurant Executive','Supply Chain Director','Community Leader','King in the North','Lord Commander','Queen of the Seven Kingdoms','Hand of the King','Chief Strategic Advisor','Mother of Dragons','Empire Builder','Master of Coin','Lord Protector','King & Warden of the West','Corporate Strategy & Acquisitions','Media Conglomerate CEO','Political Strategist & Consultant','Entertainment & Business Development','Rancher, Producer & Ambassador','Retail Worker & Investigator','Interdimensional Architect','Prodigy & Communicator'];
            if (window.fbUser && (data.roles||[]).some(function(r){ return demoNames.indexOf(r.name||r) !== -1; })) {
                console.warn('\u26A0\uFE0F Demo data detected in Firestore profile \u2014 clearing');
                ud.skills=ud.roles=ud.values=ud.workHistory=ud.education=ud.certifications=[]; ud.purpose=''; ud.profileBuilt=false;
                ud.savedJobs=(ud.savedJobs||[]).filter(function(j){return !j.sample;});
                if (typeof skillsData !== 'undefined') { skillsData.skills=[]; skillsData.roles=[]; }
                setTimeout(function(){ if(typeof saveToFirestore==='function') saveToFirestore(); }, 2000);
            }
            if (typeof initializeMainApp === 'function') initializeMainApp();
            if (typeof updateProfileChip === 'function') updateProfileChip(ud.profile.name);
            if (typeof detectAppMode === 'function') detectAppMode();
            if (typeof checkReadOnly === 'function') checkReadOnly();
            if (typeof rescoreAllJobs === 'function') rescoreAllJobs();
            window.opportunitiesInitialized = false;
            var sc = (data.skills||[]).length;
            console.log('\u2713 Loaded from Firestore:', sc, 'skills | admin:', window.fbIsAdmin, '| mode:', typeof appMode !== 'undefined' ? appMode : 'unknown');
            recordApiHealth('firebase-db', 'ok', 'Operational');
            recordApiHealth('firebase-auth', 'ok', 'Authenticated');
            window._lastSavedAt = new Date();
            if (sc === 0) showToast('Your Blueprint is empty. Use Build My Blueprint to get started!', 'info');
            return true;
        })
        .catch(function(err) {
            console.error('Firestore load error:', err);
            recordApiHealth('firebase-db', 'down', 'Load failed: ' + err.message);
            logIncident('critical', 'firestore-load', 'Firestore load failed: ' + err.message);
            showToast('Could not load your profile. Check your connection and try refreshing.', 'error', 8000);
            var backup = getSaveBackup();
            if (backup && backup.data) {
                var d = backup.data, ud2 = typeof userData !== 'undefined' ? userData : {};
                ud2.initialized = true; ud2.profile = d.profile||ud2.profile;
                ['skills','values','purpose','roles','savedJobs','workHistory','education','certifications'].forEach(function(k){ ud2[k]=d[k]||[]; });
                ud2.templateId = window.fbUser ? 'firestore-'+window.fbUser.uid : ud2.templateId;
                if (typeof skillsData !== 'undefined') { skillsData.skills=d.skills||[]; skillsData.roles=d.roles||[]; }
                if (typeof blueprintData !== 'undefined') { blueprintData.values=d.values||[]; blueprintData.purpose=d.purpose||''; blueprintData.outcomes=d.outcomes||[]; }
                try { if (typeof initializeMainApp==='function') initializeMainApp(); } catch(e) {}
                showToast('Loaded from local backup. Your latest changes may appear once connection restores.', 'info', 6000);
            }
            return false;
        });
}
window.loadUserFromFirestore = loadUserFromFirestore;

// ─── GDPR functions ───────────────────────────────────────────────────────────

export function exportMyData() {
    if (typeof readOnlyGuard === 'function' && readOnlyGuard()) return;
    if (!fbDb || !window.fbUser) { showToast('You must be signed in to export your data.', 'warning'); return; }
    fbDb.collection('users').doc(window.fbUser.uid).get().then(function(doc) {
        if (!doc.exists) { showToast('No data found for your account.', 'info'); return; }
        var data = doc.data(); data.exportedAt = new Date().toISOString(); data.exportedFor = window.fbUser.email;
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
        a.download = 'blueprint-data-export-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click(); URL.revokeObjectURL(a.href);
        showToast('Your data has been exported.', 'success');
    });
}
window.exportMyData = exportMyData;

export function requestDataDeletion() {
    if (typeof readOnlyGuard === 'function' && readOnlyGuard()) return;
    if (!fbDb || !window.fbUser) { showToast('You must be signed in to request deletion.', 'warning'); return; }
    if (!confirm('This will permanently delete all your Blueprint data and sign you out. This cannot be undone.\n\nAre you sure?')) return;
    if (!confirm('Final confirmation: All your skills, values, outcomes, and profile data will be permanently deleted. Proceed?')) return;
    var uid = window.fbUser.uid;
    fbDb.collection('users').doc(uid).delete()
        .then(function() { return fbAuth.currentUser.delete(); })
        .then(function() {
            ['wbValues','wbPurpose','currentProfile'].forEach(safeRemove);
            showToast('Your data has been permanently deleted.', 'info', 6000);
            window.fbUser = null; window.fbIsAdmin = false;
            if (typeof updateAuthUI === 'function') updateAuthUI();
            setTimeout(function() { window.location.reload(); }, 2000);
        })
        .catch(function(err) {
            if (err.code === 'auth/requires-recent-login') showToast('For security, please sign out and sign back in, then try again.', 'warning', 6000);
            else showToast('Error deleting data. Please try again or contact support.', 'error');
        });
}
window.requestDataDeletion = requestDataDeletion;
