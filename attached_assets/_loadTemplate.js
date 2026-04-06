function loadTemplate(templateId) {
            const template = templates[templateId];
            if (!template) {
                console.error('Template not found:', templateId);
                return false;
            }
            
            console.log('📋 Loading template:', templateId);
            console.log('  → Template has', template.skills.length, 'skills');
            console.log('  → First skill:', template.skills[0].name);
            console.log('  → First skill has evidence:', template.skills[0].evidence ? `YES (${template.skills[0].evidence.length} items)` : 'NO');
            
            userData = {
                initialized: true,
                profile: {...template.profile},
                skills: [...template.skills],
                skillDetails: {},
                values: template.values ? [...template.values] : [],
                purpose: template.purpose || "",
                roles: [...template.roles].map(function(r) { if (!r.id) r.id = r.name; return r; }),
                workHistory: template.workHistory ? JSON.parse(JSON.stringify(template.workHistory)) : [],
                education: template.education ? JSON.parse(JSON.stringify(template.education)) : [],
                certifications: template.certifications ? JSON.parse(JSON.stringify(template.certifications)) : [],
                verifications: template.verifications ? JSON.parse(JSON.stringify(template.verifications)) : [],
                preferences: {
                    seniorityLevel: template.profile.roleLevel || "Mid-Career",
                    targetTitles: [],
                    seniorityKeywords: ['vp', 'vice president', 'chief', 'head of', 'director', 'principal', 'senior director'],
                    excludeRoles: ['engineer', 'developer', 'designer', 'analyst', 'coordinator', 'specialist', 
                                  'junior', 'mid-level', 'associate', 'intern', 'entry', 'qa', 'frontend', 'backend',
                                  'full stack', 'fullstack', 'software', 'devops', 'ui/ux', 'data scientist'],
                    strategicKeywords: ['strategy', 'strategic', 'transformation', 'innovation', 'evangelist', 
                                       'thought leader', 'advisory', 'ai', 'ml', 'product', 'growth', 'business'],
                    targetIndustries: [],
                    minSalary: null,
                    locationPreferences: ["US", "Remote"],
                    minimumSkillMatches: 3,
                    minimumMatchScore: 50
                },
                applications: [],
                savedJobs: template.savedJobs ? JSON.parse(JSON.stringify(template.savedJobs)) : [],
                templateId: templateId
            };
            userData.profileType = template.profileType || 'standard';
            userData.explorerData = template.explorerData ? JSON.parse(JSON.stringify(template.explorerData)) : undefined;
            
            // Inject sample jobs for manifest-loaded sample profiles (always refresh on load)
            // Skip if profile has curated jobs already
            var hasCuratedJobs = template.savedJobs && template.savedJobs.length > 0 && template.savedJobs[0].curated;
            var isManifestProfile = false;
            if (window.profilesManifest && window.profilesManifest.profiles) {
                isManifestProfile = window.profilesManifest.profiles.some(function(p) { return p.id === templateId; });
            }
            
            // CRITICAL: Clear stale localStorage values/purpose when switching demo profiles
            // Otherwise inferValues() loads the PREVIOUS profile's cached values
            if (isManifestProfile || templateId.indexOf('demo') !== -1 || templateId.indexOf('sample') !== -1) {
                safeRemove('wbValues');
                safeRemove('wbPurpose');
            }
            
            // CRITICAL: Sync skillsData BEFORE sample job injection.
            // getSampleJobsForProfile → matchJobToProfile reads skillsData.skills,
            // which still points to the PREVIOUS profile if we don't update it here.
            skillsData.skills = userData.skills;
            skillsData.roles = userData.roles;
            window._userData = userData;
            
            if (!hasCuratedJobs) {
                if (isManifestProfile || templateId.indexOf('demo') !== -1 || templateId.indexOf('sample') !== -1) {
                    userData.savedJobs = getSampleJobsForProfile(templateId, template);
                }
            }
            
            console.log('  → userData.skills[0] has evidence:', userData.skills[0].evidence ? `YES (${userData.skills[0].evidence.length} items)` : 'NO');
            
            // Load skill evidence if it exists
            fetch('skill_evidence.json')
                .then(response => response.json())
                .then(data => {
                    userData.skillDetails = data;
                    console.log('✓ Loaded evidence for', Object.keys(data).length, 'skills');
                })
                .catch(error => console.log('No skill evidence file found'));
            
            saveUserData();
            console.log('✓ Template loaded:', template.templateName);

            if (fbIsAdmin && fbDb && (isManifestProfile || templateId.indexOf('demo') !== -1)) {
                fbDb.collection('sampleProfiles').doc(templateId).get().then(function(doc) {
                    if (doc.exists) {
                        var saved = doc.data();
                        console.log('✓ Admin: Found cloud edits for', templateId, '(saved', saved.updatedAt, ')');
                        if (saved.profile) userData.profile = saved.profile;
                        if (saved.skills) userData.skills = saved.skills;
                        if (saved.roles) userData.roles = saved.roles;
                        if (saved.values) userData.values = saved.values;
                        if (saved.purpose !== undefined) userData.purpose = saved.purpose;
                        if (saved.workHistory) userData.workHistory = saved.workHistory;
                        if (saved.education) userData.education = saved.education;
                        if (saved.certifications) userData.certifications = saved.certifications;
                        if (saved.verifications) userData.verifications = saved.verifications;
                        if (saved.outcomes) userData.outcomes = saved.outcomes;
                        if (saved.explorerData) userData.explorerData = saved.explorerData;
                        if (saved.profileType) userData.profileType = saved.profileType;
                        if (saved.linkedinContent) userData.linkedinContent = saved.linkedinContent;
                        if (saved.contentVisibility) userData.contentVisibility = saved.contentVisibility;
                        if (saved.companyTenures) userData.companyTenures = saved.companyTenures;
                        if (saved.savedJobs) userData.savedJobs = saved.savedJobs;
                        skillsData.skills = userData.skills;
                        skillsData.roles = userData.roles;
                        window._userData = userData;
                        saveUserData();
                        showToast('Loaded your cloud edits for this profile', 'info');
                        try {
                            var mc = document.getElementById('mainContent');
                            if (mc && mc.getAttribute('data-view')) {
                                switchView(mc.getAttribute('data-view'));
                            }
                        } catch(e) {}
                    }
                }).catch(function(err) {
                    console.log('No cloud edits for', templateId, ':', err.message);
                });
            }

            return true;
        }