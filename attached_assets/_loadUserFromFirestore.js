function loadUserFromFirestore(uid) {
            if (!fbDb) return Promise.resolve(false);
            
            return fbDb.collection('users').doc(uid).get()
                .then(function(doc) {
                    if (!doc.exists) {
                        // Doc doesn't exist — clear scaffold data so signed-in user gets clean slate
                        if (fbUser) {
                            var authName = fbUser.displayName || fbUser.email.split('@')[0];
                            userData.profile = { name: authName, email: fbUser.email };
                            userData.skills = [];
                            userData.values = [];
                            userData.purpose = '';
                            userData.roles = [];
                            userData.savedJobs = [];
                            userData.workHistory = [];
                            userData.education = [];
                            userData.certifications = [];
                            userData.templateId = 'firestore-' + uid;
                            userData.initialized = true; _markUserDataReady();
                            if (typeof skillsData !== 'undefined') {
                                skillsData.skills = [];
                                skillsData.roles = [];
                            }
                            console.log('ℹ️ No Firestore doc — cleared scaffold, clean profile for', authName);
                        }
                        return false;
                    }
                    var data = doc.data();
                    
                    console.log('☁ Loading profile from Firestore...');
                    
                    // Populate userData — even if empty, this is YOUR profile
                    userData.initialized = true; _markUserDataReady();
                    userData.profile = data.profile || {};
                    
                    // If no profile name set, use Firebase display name
                    // ALWAYS prefer Firebase auth name for signed-in users (prevents scaffold contamination)
                    if (fbUser) {
                        userData.profile.name = fbUser.displayName || fbUser.email.split('@')[0];
                        if (fbUser.email && !userData.profile.email) userData.profile.email = fbUser.email;
                    }
                    
                    userData.skills = data.skills || [];
                    userData.values = data.values || [];
                    if ((!data.values || data.values.length === 0) || (data.values.length > 0 && !data.values.some(function(v) { return v.selected; }))) {
                        try {
                            var _durV = safeGet('bp_values_durable');
                            if (_durV) {
                                var _parsedV = JSON.parse(_durV);
                                if (_parsedV && _parsedV.length > 0 && _parsedV.some(function(v) { return v.selected; })) {
                                    userData.values = _parsedV;
                                    console.warn('[Values] Firestore empty/unselected — restored from durable backup (' + _parsedV.length + ' values)');
                                }
                            }
                        } catch(e) {}
                    }
                    userData.purpose = data.purpose || '';
                    if (data.purpose && data.purpose.trim().length > 0) {
                        window._lastKnownPurpose = data.purpose;
                        try { sessionStorage.setItem('bp_last_purpose', data.purpose); } catch(e) {}
                        safeSet('bp_purpose_durable', data.purpose);
                    } else {
                        try {
                            var _durP = safeGet('bp_purpose_durable');
                            if (_durP && _durP.trim().length > 0) {
                                userData.purpose = _durP;
                                window._lastKnownPurpose = _durP;
                                console.warn('[Purpose] Firestore empty — restored from durable backup');
                            }
                        } catch(e) {}
                    }
                    userData.roles = data.roles || [];
                    userData.preferences = data.preferences || userData.preferences;
                    userData.applications = data.applications || [];
                    userData.savedJobs = data.savedJobs || [];
                    userData.workHistory = data.workHistory || [];
                    userData.education = data.education || [];
                    userData.certifications = data.certifications || [];
                    userData.verifications = data.verifications || [];
                    userData.linkedinContent = data.linkedinContent || {};
                    userData.contentVisibility = data.contentVisibility || {};
                    userData.companyTenures = data.companyTenures || [];
                    userData.importStats = data.importStats || {};
                    userData.blindDefaults = data.blindDefaults || {};
                    if (data.profileType) userData.profileType = data.profileType;
                    if (data.explorerData) userData.explorerData = data.explorerData;
                    if (data.activities) userData.activities = data.activities;
                    userData.growthSkills = data.growthSkills || [];
                    userData.privacyLog = data.privacyLog || [];
                    // Restore sharing preset
                    if ((data.preferences || {}).sharingPreset && typeof currentPreset !== 'undefined') {
                        currentPreset = data.preferences.sharingPreset;
                    }
                    userData.templateId = 'firestore-' + uid;
                    
                    // Load dev velocity stats if present
                    if (data.devStats) {
                        Object.assign(window._blueprintDevStats, data.devStats);
                    }
                    
                    // Populate skillsData
                    if (typeof skillsData !== 'undefined') {
                        skillsData.skills = data.skills || [];
                        skillsData.roles = data.roles || [];
                    }
                    
                    if (typeof blueprintData !== 'undefined') {
                        blueprintData.purpose = userData.purpose || '';
                        var _fsVals = data.values && data.values.length > 0 ? data.values : userData.values;
                        blueprintData.values = (_fsVals && _fsVals.length > 0) ? _fsVals : (blueprintData.values && blueprintData.values.length > 0 ? blueprintData.values : []);
                        blueprintData.outcomes = data.outcomes || blueprintData.outcomes;
                        if (blueprintData.values && blueprintData.values.length > 0
                                && blueprintData.values.some(function(v) { return v.selected; })) {
                            window._lastKnownValues = JSON.parse(JSON.stringify(blueprintData.values));
                            var valKey = 'bp_last_values' + (uid ? '_' + uid : '');
                            try { sessionStorage.setItem(valKey, JSON.stringify(blueprintData.values)); } catch(e) {}
                            safeSet('bp_values_durable', JSON.stringify(blueprintData.values));
                        }
                    }
                    
                    // Deduplicate skills on load
                    if (typeof deduplicateSkills === 'function') {
                        var dupes = deduplicateSkills();
                        if (dupes > 0) { saveUserData(); if (fbUser) debouncedSave(); }
                    }
                    
                    // Migrate saved jobs to v2 schema (Schema.org + JDX aligned)
                    if (typeof migrateAllJobsToV2 === 'function') {
                        var jobsMigrated = migrateAllJobsToV2();
                        if (jobsMigrated > 0) { saveUserData(); if (fbUser) debouncedSave(); }
                    }
                    
                    // Skill cap triage: if still over cap after dedup, queue triage overlay
                    if ((userData.skills || []).length > PROFILE_SKILL_CAP && typeof showSkillCapTriage === 'function') {
                        setTimeout(function() { showSkillCapTriage(); }, 1500);
                    }
                    
                    // GUARD: Detect demo data contamination
                    // If Firestore has roles from demo templates, clear them for signed-in users
                    var demoRoleNames = [
                        'Restaurant Executive', 'Supply Chain Director', 'Community Leader',
                        'King in the North', 'Lord Commander', 'Queen of the Seven Kingdoms',
                        'Hand of the King', 'Chief Strategic Advisor', 'Mother of Dragons',
                        'Empire Builder', 'Master of Coin', 'Lord Protector',
                        'King & Warden of the West', 'Corporate Strategy & Acquisitions',
                        'Media Conglomerate CEO', 'Political Strategist & Consultant',
                        'Entertainment & Business Development', 'Media Operations & Compliance',
                        'Rancher, Producer & Ambassador', 'Retail Worker & Investigator',
                        'Interdimensional Architect', 'Prodigy & Communicator'
                    ];
                    var loadedRoles = (data.roles || []).map(function(r) { return r.name || r; });
                    var hasDemoRoles = loadedRoles.some(function(rn) {
                        return demoRoleNames.indexOf(rn) !== -1;
                    });
                    
                    if (hasDemoRoles && fbUser) {
                        console.warn('⚠️ Demo data detected in Firestore profile — clearing contamination');
                        userData.skills = [];
                        userData.roles = [];
                        userData.values = [];
                        userData.purpose = '';
                        userData.workHistory = [];
                        userData.education = [];
                        userData.certifications = [];
                        userData.savedJobs = (userData.savedJobs || []).filter(function(j) { return !j.sample; });
                        userData.profileBuilt = false;
                        if (typeof skillsData !== 'undefined') {
                            skillsData.skills = [];
                            skillsData.roles = [];
                        }
                        // Save the cleaned profile back to Firestore
                        setTimeout(function() { saveToFirestore(); }, 2000);
                        console.log('✓ Demo data cleared. Profile reset to clean state.');
                    }
                    
                    // blueprintData already synced above (before dedup) to prevent race condition
                    // where saveToFirestore() reads empty blueprintData.values and wipes Firestore.
                    // This block kept as a no-op for safety — values/purpose already correct.
                    // Also persist outcomes into userData so completeness checks can read it
                    userData.outcomes = data.outcomes || [];
                    // Clear localStorage purpose — Firestore is authoritative for signed-in users
                    try { localStorage.removeItem('wbPurpose'); } catch(e) {}

                    // Re-render
                    if (typeof initializeMainApp === 'function') {
                        initializeMainApp();
                    }
                    updateProfileChip(userData.profile.name);
                    
                    // Refresh app mode and UI state after data load
                    // Skip if currently in demo mode — we don't want the Firestore
                    // callback overwriting demo state or hiding the demo banner
                    if (appContext.mode !== 'demo') {
                        if (typeof detectAppMode === 'function') detectAppMode();
                        if (typeof checkReadOnly === 'function') checkReadOnly();
                    }
                    
                    // Rescore jobs against current skills and reset views
                    if (typeof rescoreAllJobs === 'function') rescoreAllJobs();
                    window.opportunitiesInitialized = false;
                    window.reportsInitialized = false;
                    
                    var skillCount = (data.skills || []).length;
                    console.log('✓ Loaded from Firestore:', skillCount, 'skills | admin:', fbIsAdmin, '| mode:', appMode);
                    recordApiHealth('firebase-db', 'ok', 'Operational');
                    recordApiHealth('firebase-auth', 'ok', 'Authenticated');
                    window._lastSavedAt = new Date();
                    
                    // If empty profile, prompt to build
                    if (skillCount === 0) {
                        showToast('Your Blueprint is empty. Use Build My Blueprint to get started!', 'info');
                    }
                    
                    return true;
                })
                .catch(function(err) {
                    console.error('Firestore load error:', err);
                    recordApiHealth('firebase-db', 'down', 'Load failed: ' + err.message);
                    logIncident('critical', 'firestore-load', 'Firestore load failed: ' + err.message, { rawError: err.message });
                    showToast('Could not load your profile. Check your connection and try refreshing.', 'error', 8000);
                    var backup = getSaveBackup();
                    if (backup && backup.data) {
                        console.log('Restoring from local backup (saved ' + new Date(backup.ts).toLocaleTimeString() + ')');
                        var d = backup.data;
                        userData.initialized = true; _markUserDataReady();
                        userData.profile = d.profile || userData.profile;
                        userData.skills = d.skills || [];
                        userData.values = d.values || [];
                        userData.purpose = d.purpose || '';
                        userData.roles = d.roles || [];
                        userData.savedJobs = d.savedJobs || [];
                        userData.workHistory = d.workHistory || [];
                        userData.education = d.education || [];
                        userData.certifications = d.certifications || [];
                        userData.templateId = fbUser ? 'firestore-' + fbUser.uid : userData.templateId;
                        if (typeof skillsData !== 'undefined') {
                            skillsData.skills = d.skills || [];
                            skillsData.roles = d.roles || [];
                        }
                        if (typeof blueprintData !== 'undefined') {
                            blueprintData.values = d.values || [];
                            blueprintData.purpose = d.purpose || '';
                            blueprintData.outcomes = d.outcomes || [];
                        }
                        userData.outcomes = d.outcomes || [];
                        try { if (typeof initializeMainApp === 'function') initializeMainApp(); } catch(e) { console.warn('Backup restore re-init error:', e.message); }
                        showToast('Loaded from local backup. Your latest changes may appear once connection restores.', 'info', 6000);
                    }
                    return false;
                });
        }