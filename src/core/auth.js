// core/auth.js — Blueprint v4.46.21
// Phase 8a extraction — Email/magic link auth, admin check

import { escapeHtml }  from './security.js';
import { showToast }   from '../ui/toast.js';
import { bpIcon }      from '../ui/icons.js';

function authEmailSignIn() {
    if (!fbAuth) return;
    var email = (document.getElementById('authEmail') || {}).value || '';
    var password = (document.getElementById('authPassword') || {}).value || '';
    if (!email || !password) { showAuthError('Please enter email and password.'); return; }
    
    fbAuth.signInWithEmailAndPassword(email, password)
        .then(function(result) {
            closeAuthModal();
            handlePostSignIn(result.user, false);
        })
        .catch(function(err) {
            showAuthError(friendlyAuthError(err.code));
        });
}

export function authEmailSignUp() {
    if (!fbAuth) return;
    var name = (document.getElementById('authName') || {}).value || '';
    var email = (document.getElementById('authEmail') || {}).value || '';
    var password = (document.getElementById('authPassword') || {}).value || '';
    if (!email || !password) { showAuthError('Please enter email and password.'); return; }
    
    fbAuth.createUserWithEmailAndPassword(email, password)
        .then(function(result) {
            // Set display name
            if (name) {
                result.user.updateProfile({ displayName: name });
            }
            closeAuthModal();
            handlePostSignIn(result.user, true);
        })
        .catch(function(err) {
            showAuthError(friendlyAuthError(err.code));
        });
}
window.authEmailSignUp = authEmailSignUp;

function authSendMagicLink() {
    if (!fbAuth) return;
    var email = (document.getElementById('authEmail') || {}).value || '';
    if (!email) { showAuthError('Please enter your email address first.'); return; }
    
    var actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true
    };
    
    fbAuth.sendSignInLinkToEmail(email, actionCodeSettings)
        .then(function() {
            localStorage.setItem('wbMagicLinkEmail', email);
            showAuthSuccess('Sign-in link sent to ' + email + '. Check your inbox.');
        })
        .catch(function(err) {
            showAuthError(friendlyAuthError(err.code));
        });
}

function authSignOut() {
    if (!fbAuth) return;
    fbAuth.signOut().then(function() {
        fbUser = null;
        fbIsAdmin = false;
        // Reset comparison cache so next user gets fresh load
        _wbCompCache = null;
        _wbCompCacheLoaded = false;
        
        // SECURITY: Clear sensitive localStorage on sign-out
        safeRemove('wbAnthropicKey');
        safeRemove('wbValues');
        safeRemove('wbPurpose');
        safeRemove('wbEvidenceConfig');
        safeRemove('currentProfile');
        safeRemove('blueprint_waitlist');
        safeRemove('wbMagicLinkEmail');
        
        showToast('Signed out.', 'info');
        updateAuthUI();
        rebuildProfileDropdown();
        switchView('welcome');
    });
}

// Handle magic link sign-in on page load
export function checkMagicLinkSignIn() {
    try {
        if (!fbAuth || !fbAuth.isSignInWithEmailLink(window.location.href)) return;
        var email = localStorage.getItem('wbMagicLinkEmail');
        if (!email) {
            email = prompt('Please enter your email to confirm sign-in:');
        }
        if (email) {
            fbAuth.signInWithEmailLink(email, window.location.href)
                .then(function(result) {
                    localStorage.removeItem('wbMagicLinkEmail');
                    window.history.replaceState({}, document.title, window.location.pathname);
                    handlePostSignIn(result.user, result.additionalUserInfo && result.additionalUserInfo.isNewUser);
                })
                .catch(function(err) {
                    console.error('Magic link sign-in failed:', err);
                    showToast('Sign-in link expired or invalid. Please try again.', 'error');
                });
        }
    } catch(e) {
        console.warn('Magic link check skipped:', e.message);
    }
}

export function friendlyAuthError(code) {
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

// ===== POST SIGN-IN HANDLER =====
function handlePostSignIn(user, isNewUser) {
    if (!user) return;
    
    // Ensure user document exists in Firestore
    if (fbDb) {
        var userRef = fbDb.collection('users').doc(user.uid);
        userRef.get().then(function(doc) {
            if (!doc.exists) {
                // First sign-in: create user document with profile name
                var displayName = user.displayName || user.email.split('@')[0];
                userRef.set({
                    email: user.email,
                    displayName: displayName,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    role: 'user',
                    profile: { name: displayName, email: user.email },
                    skills: [],
                    roles: []
                });
                console.log('✓ Created Firestore user document');
                
                // Set local profile so chip updates immediately
                window._userData.profile = { name: displayName, email: user.email };
                window._userData.skills = [];
                window._userData.templateId = 'firestore-' + user.uid;
                if (typeof skillsData !== 'undefined') {
                    skillsData.skills = [];
                    skillsData.roles = [];
                }
                updateProfileChip(displayName);
                if (typeof initializeMainApp === 'function') initializeMainApp();
                
                // Offer wizard for new users
                setTimeout(function() { showOnboardingWizard(); }, 600);
            } else {
                // Returning user: update last login, load their data
                userRef.update({ lastLogin: firebase.firestore.FieldValue.serverTimestamp() });
                loadUserFromFirestore(user.uid);
            }
        }).catch(function(err) {
            console.error('Firestore user check failed:', err);
            showToast('Could not verify your account. Some features may be limited.', 'error', 5000);
        });
    }
    
    showToast('Welcome, ' + escapeHtml(user.displayName || user.email) + '!', 'success');
    if (typeof bpTracker !== 'undefined' && bpTracker.sid) bpTracker.trackFunnel('signup');
}

// ===== ADMIN ROLE CHECK =====
function checkAdminRole(uid) {
    if (!fbDb) return Promise.resolve(false);
    return fbDb.collection('users').doc(uid).get()
        .then(function(doc) {
            if (doc.exists && doc.data().role === 'admin') {
                console.log('[Admin] Admin role confirmed');
                return true;
            }
            console.log('ℹ️ User role:', doc.exists ? (doc.data().role || 'user') : 'no document');
            return false;
        })
        .catch(function(err) {
            console.error('⚠️ Admin check failed:', err.code || err.message || err);
            return false;
        });
}

// ===== AUTH UI UPDATE =====
export function updateAuthUI() {
    // v4.44.36: Showcase mode manages its own header state
    if (showcaseMode) return;
    var authBtn = document.getElementById('authNavBtn');
    var profileChip = document.getElementById('profileChip');
    var overflowSignIn = document.getElementById('overflowSignIn');
    var overflowSignOut = document.getElementById('overflowSignOut');
    var overflowAdmin = document.getElementById('overflowAdmin');
    
    if (fbUser) {
        // Signed in
        if (authBtn) authBtn.style.display = 'none';
        if (overflowSignIn) overflowSignIn.style.display = 'none';
        if (overflowSignOut) overflowSignOut.style.display = '';
        if (overflowAdmin) overflowAdmin.style.display = fbIsAdmin ? '' : 'none';
        var adminBadge = document.getElementById('adminBadge');
        if (adminBadge) adminBadge.style.display = fbIsAdmin ? 'inline-block' : 'none';
        if (profileChip) {
            profileChip.style.display = '';
            var displayName = fbUser.displayName || fbUser.email.split('@')[0];
            // Defer to updateProfileChip so stored profile.photo always wins over Google photo
            updateProfileChip(displayName);
        }
        updateDemoToggleUI();
    } else {
        // Not signed in — hide chip entirely
        if (authBtn) authBtn.style.display = '';
        if (overflowSignIn) overflowSignIn.style.display = '';
        if (overflowSignOut) overflowSignOut.style.display = 'none';
        if (overflowAdmin) overflowAdmin.style.display = 'none';
        var adminBadge2 = document.getElementById('adminBadge');
        if (adminBadge2) adminBadge2.style.display = 'none';
        if (profileChip) profileChip.style.display = 'none';
        updateDemoToggleUI();
    }
}

// Profile dropdown removed — stub for backward compat
export function rebuildProfileDropdown() { /* no-op — dropdown removed */ }

export function getInitials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

// ===== FIRESTORE PERSISTENCE =====
window.authEmailSignUp = authEmailSignUp;
window.checkMagicLinkSignIn = checkMagicLinkSignIn;
window.friendlyAuthError = friendlyAuthError;
window.updateAuthUI = updateAuthUI;
window.rebuildProfileDropdown = rebuildProfileDropdown;
window.getInitials = getInitials;
