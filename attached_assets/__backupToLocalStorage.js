function _backupToLocalStorage(data) {
            try {
                var backup = JSON.parse(JSON.stringify(data));
                delete backup.updatedAt;
                // Trim heavy fields if payload is large to avoid localStorage quota errors
                var payload = { ts: Date.now(), data: backup };
                var serialized = JSON.stringify(payload);
                if (serialized.length > 800000) {
                    // Drop large optional arrays to get under limit
                    delete backup.verifications;
                    delete backup.outcomes;
                    serialized = JSON.stringify({ ts: Date.now(), data: backup });
                }
                if (serialized.length > 1500000) {
                    // Trim skills and work history as last resort
                    if (backup.skills) backup.skills = backup.skills.slice(0, 100);
                    if (backup.workHistory) backup.workHistory = backup.workHistory.slice(0, 20);
                    serialized = JSON.stringify({ ts: Date.now(), data: backup });
                }
                localStorage.setItem(_saveBackupKey, serialized);
            } catch(e) { console.warn('localStorage backup failed:', e.message); }
        }