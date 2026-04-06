function _buildFirestoreData() {
            var _ud = window._userData || userData;
            var data = {
                profile: _ud.profile || {},
                skills: (skillsData && skillsData.skills) ? skillsData.skills.map(function(s) {
                    var mapped = { name: s.name || '', level: s.level || 1, category: s.category || '', key: s.key || s.name || '', roles: s.roles || [], evidence: s.evidence || [] };
                    if (s.endorsements) mapped.endorsements = s.endorsements;
                    if (s.endorsementBoosted) mapped.endorsementBoosted = true;
                    if (s.source) mapped.source = s.source;
                    if (s.userAssessment) mapped.userAssessment = s.userAssessment;
                    if (s.impactRating) mapped.impactRating = s.impactRating;
                    if (s.impactScore) mapped.impactScore = s.impactScore;
                    if (s.onetId) mapped.onetId = s.onetId;
                    if (s.onetCode) mapped.onetCode = s.onetCode;
                    if (s.core) mapped.core = s.core;
                    return mapped;
                }) : [],
                roles: (skillsData && skillsData.roles) || [],
                values: (function() {
                    if (blueprintData.values && blueprintData.values.length > 0 && blueprintData.values.some(function(v) { return v.selected; })) return blueprintData.values;
                    if (_ud.values && _ud.values.length > 0 && _ud.values.some(function(v) { return v.selected; })) return _ud.values;
                    if (window._lastKnownValues && window._lastKnownValues.length > 0) return window._lastKnownValues;
                    try {
                        var _dv = safeGet('bp_values_durable');
                        if (_dv) { var _p = JSON.parse(_dv); if (_p && _p.length > 0) return _p; }
                    } catch(e) {}
                    if (blueprintData.values && blueprintData.values.length > 0) return blueprintData.values;
                    if (_ud.values && _ud.values.length > 0) return _ud.values;
                    return [];
                })(),
                purpose: (function() {
                    var p = blueprintData.purpose || _ud.purpose || window._lastKnownPurpose || '';
                    if (!p || p.trim().length === 0) {
                        try {
                            var _dp = safeGet('bp_purpose_durable');
                            if (_dp && _dp.trim().length > 0) p = _dp;
                        } catch(e) {}
                    }
                    return p;
                })(),
                outcomes: blueprintData.outcomes || [],
                preferences: _ud.preferences || {},
                applications: _ud.applications || [],
                workHistory: _ud.workHistory || [],
                education: _ud.education || [],
                certifications: _ud.certifications || [],
                verifications: _ud.verifications || [],
                savedJobs: (_ud.savedJobs || []).map(function(j) {
                    return { id: j.id || '', title: j.title || '', company: j.company || '', sourceUrl: j.sourceUrl || '', sourceNote: j.sourceNote || '',
                        rawText: j.rawText || '', parsedSkills: j.parsedSkills || [], parsedRoles: j.parsedRoles || [],
                        seniority: j.seniority || '', matchData: j.matchData || {}, addedAt: j.addedAt || new Date().toISOString(),
                        sample: j.sample || false };
                }),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (_ud.profileType) data.profileType = _ud.profileType;
            if (_ud.explorerData) data.explorerData = _ud.explorerData;
            if (_ud.activities && _ud.activities.length > 0) data.activities = _ud.activities;
            if (_ud.linkedinContent) data.linkedinContent = _ud.linkedinContent;
            if (_ud.contentVisibility) data.contentVisibility = _ud.contentVisibility;
            if (_ud.companyTenures) data.companyTenures = _ud.companyTenures;
            if (_ud.importStats) data.importStats = _ud.importStats;
            if (_ud.blindDefaults) data.blindDefaults = _ud.blindDefaults;
            data.growthSkills = (_ud.growthSkills && _ud.growthSkills.length > 0) ? _ud.growthSkills : [];
            if (_ud.privacyLog && _ud.privacyLog.length > 0) data.privacyLog = _ud.privacyLog.slice(-100);
            // Dev velocity stats (admin)
            if (window._blueprintDevStats) data.devStats = window._blueprintDevStats;
            
            data = sanitizeForFirestore(data);
            data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            data.role = _ud.role || 'user';
            delete data.isAdmin;
            return data;
        }