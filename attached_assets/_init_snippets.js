

/* --- snippet 1 @1288306 --- */
);
                var cb = '?v=' + Date.now();
                await Promise.allSettled(enabledProfiles.map(function(pm) {
                    return fetch(pm.path + cb).then(function(r) { return r.json(); }).then(function(tpl) {
                        templates[pm.id] = tpl;
                    });
                }));
            } catch(e) {
                console.warn('⚠ Manifest load error:', e);
            }
            
            if (sp) sp.style.width = '70%';
            
            // Load showcase profile
            try {
                var profileData = await fetch('profiles/showcase/admin-demo.json?v=' + Date.now()).then(r => r.json());
                
                userData = {
                    initialized: true,
                    profile: profileData.profile || {},
                    skills: profileData.skills || [],
                    skillDetails: profileData.skillDetails || {},
                    values: profileData.values || [],
                    purpose: profileData.purpose || '',
                    roles: (profileData.roles || []).map(function(r) { if (!r.id) r.id = r.name; return r; }),
                    workHistory: profileData.workHistory || [],
                    education: profileData.education || [],
                    certifications: profileData.certifications || [],
                    verifications: profileData.verifications || [],
                    preferences: profileData.preferences || {},
                    templateId: 'admin-showcase'
                };
                window._userData = userData;
                
                if (profileData.work_blueprints && profileData.work_blueprints.length > 0) {
                    _wbRepoCache = profileData.work_blueprints;
                    _jdcRepoCache = profileData.work_blueprints;
                    console.log('✓ Showcase WBs loaded from JSON:', _wbRepoCache.length);
                }
                if (profileData.saved_comparisons && profileData.saved_comparisons.length > 0) {
                    _wbCompCache = profileData.saved_comparisons;
                    _wbCompCacheLoaded = true;
                    console.log('✓ Showcase comparisons loaded from JSON:', _wbCompCache.length);
                }
                
                console.log('✓ Showcase profile loaded:', userData.skills.length, 'skills');
                
            

/* --- snippet 2 @1337220 --- */
e },
                { name: "Nonprofit Founding & Operations", level: "Advanced", roles: ["advocate", "entrepreneur"], key: false },
                { name: "Authentic Leadership & Trust Building", level: "Mastery", roles: ["advocate", "futurist"], key: true },
                { name: "Culture Change & Inclusion Initiatives", level: "Advanced", roles: ["advocate"], key: false },
                { name: "Complex Problem Diagnosis & Resolution", level: "Advanced", roles: ["advocate"], key: false }
            ],
            
            skillDetails: {} // Will be loaded from skill_evidence.json
        };
        
        // ===== v2.0: USER DATA MANAGEMENT SYSTEM =====
        
        let userData = {
            initialized: false,
            profile: {
                name: "",
                email: "",
                phone: "",
                linkedinUrl: "",
                location: "Remote"
            },
            skills: [],
            skillDetails: {},
            values: [],
            purpose: "",
            roles: [],
            workHistory: [],
            education: [],
            certifications: [],
            verifications: [],
            preferences: {
                seniorityLevel: "Mid-Career",
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
            savedJobs: []
        };
        
        let templates = {};
        window._templates = templates;
        window.templates = templates;
        var _resolveUserDataReady;
        

/* --- snippet 3 @1515065 --- */
ype + ')');
            
            return jobs;
        }
        
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
                    t

/* --- snippet 4 @1531612 --- */
ed') { window.companyDataLoaded = libResults[8].value; console.log('✅ Company values loaded: ' + Object.keys(libResults[8].value).length + ' companies'); }
            else { window.companyDataLoaded = {}; console.warn('⚠ companies.json failed to load — using JD inference fallback'); }

            setTimeout(_loadCrosswalkDeferred, 100);
            
            // ===== PROFILE DECISION FLOW =====
            const currentProfile = safeGet('currentProfile');
            
            // CASE 1: Signed-in user — DO NOT load scaffold, go straight to Firestore
            if (fbUser && fbDb) {
                // Initialize minimal userData structure (no scaffold contamination)
                userData = {
                    initialized: false,
                    profile: { name: fbUser.displayName || fbUser.email.split('@')[0], email: fbUser.email || '' },
                    skills: [], skillDetails: {}, values: [], purpose: '',
                    roles: [], workHistory: [], education: [], certifications: [],
                    verifications: [], preferences: userData.preferences || {},
                    applications: [], savedJobs: [], templateId: 'firestore-' + fbUser.uid
                };
                skillsData.skills = [];
                skillsData.roles = [];
                window._userData = userData;
                
                initializeMainApp();
                window._profileExplicitlySelected = true; // signed-in users always have a profile
                
                var targetView = 'welcome';
                
                // Respect URL hash if present (e.g. #opportunities, #network, #blueprint)
                var hashView = window.location.hash.replace('#', '');
                var validViews = ['network', 'opportunities', 'blueprint', 'reports', 'settings', 'admin', 'consent'];
                var hashTarget = validViews.indexOf(hashView) !== -1 ? hashView : null;
                
                try {
                    var loaded = await loadUserFromFirestore(fbUser.uid);
                    if (loaded) {
                        console.log('☁ Firestore profile applied for', fbUser.displayName || fbUser.email);
                        targetView = hashTarget || 'blueprint';
                    } else {
                        console.log('ℹ️ No Firestore data for signed-in user');
                        targetVi

/* --- snippet 5 @1515913 --- */
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
            var hasCuratedJobs = template.savedJobs && template.savedJobs.lengt

/* --- snippet 6 @1531978 --- */
// ===== PROFILE DECISION FLOW =====
            const currentProfile = safeGet('currentProfile');
            
            // CASE 1: Signed-in user — DO NOT load scaffold, go straight to Firestore
            if (fbUser && fbDb) {
                // Initialize minimal userData structure (no scaffold contamination)
                userData = {
                    initialized: false,
                    profile: { name: fbUser.displayName || fbUser.email.split('@')[0], email: fbUser.email || '' },
                    skills: [], skillDetails: {}, values: [], purpose: '',
                    roles: [], workHistory: [], education: [], certifications: [],
                    verifications: [], preferences: userData.preferences || {},
                    applications: [], savedJobs: [], templateId: 'firestore-' + fbUser.uid
                };
                skillsData.skills = [];
                skillsData.roles = [];
                window._userData = userData;
                
                initializeMainApp();
                window._profileExplicitlySelected = true; // signed-in users always have a profile
                
                var targetView = 'welcome';
                
                // Respect URL hash if present (e.g. #opportunities, #network, #blueprint)
                var hashView = window.location.hash.replace('#', '');
                var validViews = ['network', 'opportunities', 'blueprint', 'reports', 'settings', 'admin', 'consent'];
                var hashTarget = validViews.indexOf(hashView) !== -1 ? hashView : null;
                
                try {
                    var loaded = await loadUserFromFirestore(fbUser.uid);
                    if (loaded) {
                        console.log('☁ Firestore profile applied for', fbUser.displayName || fbUser.email);
                        targetView = hashTarget || 'blueprint';
                    } else {
                        console.log('ℹ️ No Firestore data for signed-in user');
                        targetView = hashTarget || 'blueprint';
                    }
                } catch(e) {
                    console.warn('Firestore load failed:', e);
                    targetView = hashTarget || 'blueprint';
                }
                // Reset view init flags so they render with correct data
                window.blueprintInitialized = false;
               