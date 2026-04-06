function saveToFirestore() {
            if (showcaseMode) return Promise.resolve(false);
            if (!fbDb || !fbUser) return Promise.resolve(false);
            
            if (appContext.mode === 'demo') return Promise.resolve(false);
            
            var tid = userData.templateId || '';
            if (tid && tid.indexOf('firestore-') !== 0 && tid !== 'wizard-built') {
                return Promise.resolve(false);
            }
            
            // GUARD: Never save before Firestore data has loaded — early saves overwrite good data with empty
            if (!userData.initialized) {
                console.warn('saveToFirestore blocked: userData not yet initialized (Firestore load in progress)');
                return Promise.resolve(false);
            }
            
            if (fbUser.displayName && userData.profile) {
                userData.profile.name = fbUser.displayName;
            }
            
            var si = document.getElementById('saveIndicator');
            if (si) { si.innerHTML = bpIcon('upload',12) + ' Saving...'; si.style.opacity = '0.6'; si.style.color = 'var(--text-muted)'; }
            
            var uid = fbUser.uid;
            var data = _buildFirestoreData();

            console.log('[Save] role:', data.role, 'keys:', Object.keys(data).length,
                'skills:', (data.skills || []).length,
                'savedJobs:', (data.savedJobs || []).length,
                'values:', (data.values || []).length,
                'roles:', (data.roles || []).length);
            
            _backupToLocalStorage(data);
            
            var maxRetries = 3;
            function attemptSave(attempt) {
                return fbDb.collection('users').doc(uid).set(data, { merge: true })
                    .then(function() {
                        console.log('☁ Saved to Firestore' + (attempt > 1 ? ' (retry ' + (attempt - 1) + ')' : ''));
                        recordApiHealth('firebase-db', 'ok', 'Operational');
                        _clearSaveBackup();
                        window._lastSavedAt = new Date();
                        var si = document.getElementById('saveIndicator');
                        if (si) { si.innerHTML = bpIcon('check',12) + ' Saved'; si.style.opacity = '1'; si.style.color = '#30d158'; setTimeout(function() { updateLastSavedDisplay(); }, 2500); }
                        return true;
                    })
                    .catch(function(err) {
                        if (attempt < maxRetries) {
                            var delay = Math.pow(2, attempt) * 500;
                            console.warn('Firestore save attempt ' + attempt + ' failed, retrying in ' + delay + 'ms:', err.message);
                            return new Promise(function(resolve) {
                                setTimeout(function() { resolve(attemptSave(attempt + 1)); }, delay);
                            });
                        }
                        console.error('Firestore save error (all retries exhausted):', err);
                        recordApiHealth('firebase-db', 'down', 'Save failed: ' + err.message);
                        logIncident('critical', 'firestore-save', 'Firestore save failed after ' + maxRetries + ' attempts: ' + err.message, { rawError: err.message });
                        var si = document.getElementById('saveIndicator');
                        if (si) { si.innerHTML = bpIcon('warning',12) + ' Save failed'; si.style.opacity = '1'; si.style.color = '#ff453a'; setTimeout(function() { si.style.opacity = '0'; }, 4000); }
                        showToast('Your changes could not be saved. They are backed up locally and will sync when connection restores.', 'error', 6000);
                        return false;
                    });
            }
            return attemptSave(1);
        }