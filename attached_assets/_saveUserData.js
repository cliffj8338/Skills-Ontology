function saveUserData() {
            try {
                // Don't save demo profile as user preference
                if (appContext.mode === 'demo') return true;
                // Only save which profile is active
                const currentProfileId = userData.templateId || Object.keys(templates)[0] || 'walter-white';
                safeSet('currentProfile', currentProfileId);
                console.log('✓ Profile preference saved:', currentProfileId);
                // Persist to Firestore if signed in
                if (fbUser && fbDb) {
                    saveToFirestore();
                }
                return true;
            } catch (e) {
                console.error('Error saving profile preference:', e);
                return false;
            }
        }