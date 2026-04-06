

/* ==== renderFindJobs ==== */
function renderFindJobs() {
            if (window._lastJobRadius === undefined && userData.preferences.searchRadius) window._lastJobRadius = userData.preferences.searchRadius;
            // Build role suggestions from user's profile
            var roleSuggestions = '';
            if (userData.roles && userData.roles.length > 0) {
                roleSuggestions = userData.roles.map(function(r) {
                    return '<button onclick="document.getElementById(\'findJobsKeyword\').value=\'' + r.name.replace(/'/g, "\\'") + '\'; searchOpportunities();" '
                        + 'style="padding:4px 12px; border-radius:12px; border:1px solid var(--border); background:none; '
                        + 'color:var(--text-secondary); cursor:pointer; font-size:0.82em; transition:all 0.15s;" '
                        + 'onmouseover="this.style.borderColor=\'var(--accent)\'; this.style.color=\'var(--accent)\'" '
                        + 'onmouseout="this.style.borderColor=\'var(--border)\'; this.style.color=\'var(--text-secondary)\'">'
                        + r.name + '</button>';
                }).join('');
            }
            
            return ''
                
                + '<div style="display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap;">'
                + '<input id="findJobsKeyword" type="text" placeholder="Job title, skill, or keyword..." '
                + 'value="' + escapeAttr(window._lastJobSearch || '') + '" '
                + 'onkeydown="if(event.key===\'Enter\') searchOpportunities();" '
                + 'style="flex:2; min-width:180px; padding:10px 14px; background:var(--c-input-bg); '
                + 'border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.92em;" />'
                + '<input id="findJobsLocation" type="text" placeholder="Zip, city, or state..." '
                + 'value="' + escapeAttr(window._lastJobLocation || userData.profile.zipCode || userData.profile.cityState || '') + '" '
                + 'onkeydown="if(event.key===\'Enter\') searchOpportunities();" '
                + 'style="flex:1; min-width:140px; padding:10px 14px; background:var(--c-input-bg); '
                + 'border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.92em;" />'
                + '<button onclick="searchOpportunities()" style="padding:10px 20px; background:var(--accent); '
                + 'color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.9em; '
                + 'display:flex; align-items:center; gap:6px; white-space:nowrap;">'
                + bpIcon('search',14) + ' Search</button>'
                + '</div>'
                + '<div style="display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; align-items:center;">'
                
                + '<select id="findJobsCategory" style="padding:10px 14px; background:var(--c-input-bg); '
                + 'border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.88em; min-width:150px;">'
                + '<option value="">All Categories</option>'
                + '<option value="software-dev">Software Dev</option>'
                + '<option value="marketing">Marketing</option>'
                + '<option value="business">Business</option>'
                + '<option value="data">Data Science</option>'
                + '<option value="design">Design</option>'
                + '<option value="product">Product</option>'
                + '<option value="hr">Human Resources</option>'
                + '<option value="finance">Finance</option>'
                + '<option value="sales">Sales</option>'
                + '<option value="customer-support">Customer Support</option>'
                + '<option value="writing">Writing</option>'
                + '<option value="devops">DevOps / SysAdmin</option>'
                + '</select>'
                
                + '<select id="findJobsRadius" style="padding:10px 14px; background:var(--c-input-bg); '
                + 'border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.88em; min-width:110px;">'
                + '<option value="0"' + ((window._lastJobRadius || 0) == 0 ? ' selected' : '') + '>Any distance</option>'
                + '<option value="10"' + (window._lastJobRadius == 10 ? ' selected' : '') + '>10 miles</option>'
                + '<option value="25"' + (window._lastJobRadius == 25 ? ' selected' : '') + '>25 miles</option>'
                + '<option value="50"' + (window._lastJobRadius == 50 ? ' selected' : '') + '>50 miles</option>'
                + '<option value="100"' + (window._lastJobRadius == 100 ? ' selected' : '') + '>100 miles</option>'
                + '<option value="200"' + (window._lastJobRadius == 200 ? ' selected' : '') + '>200 miles</option>'
                + '</select>'
                
                + '<select id="findJobsWorkArrangement" style="padding:10px 14px; background:var(--c-input-bg); '
                + 'border:1px solid var(--border); border-radius:8px; color:var(--text-primary); font-size:0.88em; min-width:120px;">'
                + '<option value="all"' + ((window._lastJobArrangement || 'all') === 'all' ? ' selected' : '') + '>All types</option>'
                + '<option value="remote"' + (window._lastJobArrangement === 'remote' ? ' selected' : '') + '>Remote only</option>'
                + '<option value="hybrid"' + (window._lastJobArrangement === 'hybrid' ? ' selected' : '') + '>Hybrid</option>'
                + '<option value="onsite"' + (window._lastJobArrangement === 'onsite' ? ' selected' : '') + '>On-site</option>'
                + '</select>'
                
                + '<button onclick="clearJobSearch();" '
                + 'style="padding:8px 12px; background:none; border:1px solid var(--border); border-radius:8px; '
                + 'color:var(--text-muted); cursor:pointer; font-size:0.78em;">Clear</button>'
                + '<div style="display:flex; align-items:center; gap:12px; margin-left:auto; flex-wrap:wrap;">'
                + '<div style="display:flex; align-items:center; gap:6px;">'
                + '<span style="font-size:0.82em; color:var(--text-muted); white-space:nowrap;">Min match:</span>'
                + '<input type="range" min="0" max="80" value="' + currentMatchThreshold + '" '
                + 'oninput="updateMatchThreshold(this.value)" style="width:100px; accent-color:var(--accent);" />'
                + '<span id="matchValue" style="font-weight:600; color:var(--accent); font-size:0.85em; min-width:30px;">' + currentMatchThreshold + '%</span>'
                + '</div>'
                + '<div style="display:flex; align-items:center; gap:6px;">'
                + '<span style="font-size:0.82em; color:var(--text-muted); white-space:nowrap;">Min skills:</span>'
                + '<input type="number" id="findJobsMinSkills" min="0" max="20" value="' + (userData.preferences.minimumSkillMatches || 3) + '" '
                + 'onchange="updateMinSkillMatches(this.value)" '
                + 'style="width:48px; padding:4px 6px; background:var(--c-input-bg); border:1px solid var(--border); border-radius:6px; color:var(--text-primary); font-size:0.85em; text-align:center;" />'
                + '</div>'
                + '</div>'
                + '</div>'
                
                + (roleSuggestions ? '<div style="display:flex; gap:6px; margin-bottom:16px; flex-wrap:wrap;">'
                + '<span style="font-size:0.78em; color:var(--text-muted); padding:4px 0;">Quick search:</span>'
                + roleSuggestions + '</div>' : '')
                
                + '<div id="opportunitiesResults"></div>';
        }


/* ==== searchOpportunities ==== */
function searchOpportunities() {
            if (demoGate('Find Jobs')) return;
            var keyword = (document.getElementById('findJobsKeyword') || {}).value || '';
            keyword = keyword.trim();
            if (!keyword) { showToast('Enter a keyword to search.', 'info'); return; }
            window._lastJobSearch = keyword;
            
            var location = (document.getElementById('findJobsLocation') || {}).value || '';
            location = location.trim();
            window._lastJobLocation = location;
            
            var arrangement = (document.getElementById('findJobsWorkArrangement') || {}).value || 'all';
            window._lastJobArrangement = arrangement;
            var radius = parseInt((document.getElementById('findJobsRadius') || {}).value || '0', 10);
            window._lastJobRadius = radius;
            
            searchLiveFromAPIs();
        }


/* ==== searchLiveFromAPIs ==== */
function searchLiveFromAPIs() {
            if (demoGate('Find Jobs')) return;
            var keyword = (document.getElementById('findJobsKeyword') || {}).value || '';
            keyword = keyword.trim();
            if (!keyword) { showToast('Enter a keyword to search live.', 'info'); return; }
            window._lastJobSearch = keyword;
            
            var location = (document.getElementById('findJobsLocation') || {}).value || '';
            location = location.trim();
            window._lastJobLocation = location;
            
            var category = (document.getElementById('findJobsCategory') || {}).value || '';
            var arrangement = (document.getElementById('findJobsWorkArrangement') || {}).value || 'all';
            window._lastJobArrangement = arrangement;
            var remoteOnly = arrangement === 'remote';
            var radius = parseInt((document.getElementById('findJobsRadius') || {}).value || '0', 10);
            window._lastJobRadius = radius;
            
            var resultsDiv = document.getElementById('opportunitiesResults');
            if (!resultsDiv) return;
            
            resultsDiv.innerHTML = '<div style="text-align:center; padding:40px;">'
                + '<div class="loading-spinner" style="width:32px; height:32px; border-width:3px; margin:0 auto 12px;"></div>'
                + '<p style="font-size:1em; color:var(--text-secondary);">Searching job sources...</p>'
                + '<p style="font-size:0.82em; color:var(--text-muted); margin-top:6px;">Aggregating results from multiple job boards</p>'
                + '</div>';
            
            var searchId = Date.now();
            window._currentJobSearchId = searchId;
            window._jobSearchTimeout = setTimeout(function() {
                if (window._currentJobSearchId !== searchId) return;
                if (resultsDiv && resultsDiv.querySelector('.loading-spinner')) {
                    if (opportunitiesData && opportunitiesData.length > 0) {
                        renderOpportunities();
                        showToast('Some job sources timed out. Showing partial results.', 'info', 4000);
                    } else {
                        resultsDiv.innerHTML = '<div style="text-align:center; padding:40px 20px;">'
                            + '<div style="margin-bottom:16px; opacity:0.35;">' + bpIcon('search',48) + '</div>'
                            + '<p style="font-size:1.05em; color:var(--text-primary); margin-bottom:8px;">Search timed out</p>'
                            + '<p style="color:var(--text-muted); font-size:0.88em;">Job sources took too long to respond. Please try again.</p></div>';
                    }
                }
            }, 30000);
            
            if (JOBS_PROXY_AVAILABLE !== false) {
                searchViaProxy(keyword, location, category, remoteOnly, resultsDiv, radius, arrangement);
            } else {
                searchDirect(keyword, category, resultsDiv);
            }
        }


/* ==== searchViaProxy ==== */
async function searchViaProxy(keyword, location, category, remoteOnly, resultsDiv, radius, arrangement) {
            try {
                // HYBRID MODE: Proxy handles JSearch/Remotive/USAJobs/Himalayas/Jobicy
                // Browser directly calls Adzuna/Muse with user-entered keys in parallel
                var proxyPromise = (async function() {
                    var params = new URLSearchParams({ q: keyword });
                    if (location) params.set('location', location);
                    if (category) params.set('category', category);
                    if (remoteOnly) params.set('remote', 'true');
                    if (radius && radius > 0) params.set('radius', String(radius));
                    
                    var res = await fetch(JOBS_PROXY_URL + '?' + params.toString(), { signal: AbortSignal.timeout(25000) });
                    if (!res.ok) throw new Error('Proxy returned ' + res.status);
                    return res.json();
                })().catch(function(e) { console.warn('Proxy:', e.message); return { jobs: [], sources: {} }; });
                
                // Direct keyed API calls (only fire if keys are configured)
                var adzunaPromise = fetchAdzunaJobs(keyword, location)
                    .then(function(r) { trackAPICall('adzuna'); if (r.length > 0) recordApiHealth('adzuna', 'ok', r.length + ' results'); return { jobs: r, source: 'adzuna', count: r.length }; })
                    .catch(function(e) { console.warn('Adzuna direct:', e.message); recordApiHealth('adzuna', 'down', e.message); return { jobs: [], source: 'adzuna', error: e.message }; });
                
                var musePromise = fetchMuseJobs(keyword, category, location)
                    .then(function(r) { trackAPICall('themuse'); if (r.length > 0) recordApiHealth('themuse', 'ok', r.length + ' results'); return { jobs: r, source: 'themuse', count: r.length }; })
                    .catch(function(e) { console.warn('Muse direct:', e.message); recordApiHealth('themuse', 'down', e.message); return { jobs: [], source: 'themuse', error: e.message }; });
                
                
                var results = await Promise.all([proxyPromise, adzunaPromise, musePromise]);
                var proxyData = results[0];
                var directResults = [results[1], results[2]];
                
                JOBS_PROXY_AVAILABLE = !!(proxyData.jobs && proxyData.jobs.length > 0) || JOBS_PROXY_AVAILABLE;
                updateJobsDbCount(proxyData);
                
                // Track proxy source API calls + record health
                if (proxyData.sources) {
                    Object.keys(proxyData.sources).forEach(function(src) {
                        if (!proxyData.sources[src].error) {
                            trackAPICall(src);
                            recordApiHealth(src, 'ok', (proxyData.sources[src].count || 0) + ' results');
                        } else {
                            recordApiHealth(src, 'down', proxyData.sources[src].error);
                        }
                    });
                }
                
                // Merge proxy jobs + direct keyed API jobs
                var proxyJobs = (proxyData.jobs || []).map(function(job) {
                    var match = quickScoreJob(job.title, job.description, job.tags);
                    job.matchScore = match.score;
                    job.matchedSkills = match.matched;
                    job.gapSkills = match.gaps;
                    return job;
                });
                
                var directJobs = [];
                directResults.forEach(function(r) { directJobs = directJobs.concat(r.jobs || []); });
                
                var allJobs = proxyJobs.concat(directJobs);
                
                // Deduplicate + decode HTML entities from APIs
                var seen = {};
                opportunitiesData = allJobs.filter(function(job) {
                    if (job.title) job.title = decodeHtmlEntities(job.title);
                    if (job.company) job.company = decodeHtmlEntities(job.company);
                    var key = (job.title + '-' + job.company).toLowerCase().replace(/[^a-z0-9]/g, '');
                    if (seen[key]) return false;
                    seen[key] = true;
                    return true;
                });
                
                if (arrangement && arrangement !== 'all') {
                    opportunitiesData = opportunitiesData.filter(function(job) {
                        var loc = ((job.location || '') + ' ' + (job.type || '') + ' ' + ((job.tags || []).join(' '))).toLowerCase();
                        var title = (job.title || '').toLowerCase();
                        var isRemote = loc.indexOf('remote') !== -1 || title.indexOf('remote') !== -1 || job.remote;
                        var isHybrid = loc.indexOf('hybrid') !== -1 || title.indexOf('hybrid') !== -1;
                        if (arrangement === 'remote') return isRemote;
                        if (arrangement === 'hybrid') return isHybrid;
                        if (arrangement === 'onsite') return !isRemote && !isHybrid;
                        return true;
                    });
                }
                
                opportunitiesData.sort(function(a, b) { return b.matchScore - a.matchScore; });
                
                // Build source status line
                var sources = [];
                if (proxyData.sources) {
                    Object.keys(proxyData.sources).forEach(function(src) {
                        var s = proxyData.sources[src];
                        if (s.error) sources.push(src + ': \u2717');
                        else sources.push(src + ': ' + (s.count || 0));
                    });
                }
                directResults.forEach(function(r) {
                    if (r.error) sources.push(r.source + ': \u2717');
                    else if (r.count > 0) sources.push(r.source + ': ' + r.count);
                    else if (r.source === 'adzuna' && !ADZUNA_APP_ID) sources.push('adzuna: no key');
                    else sources.push(r.source + ': 0');
                });
                window._findJobsSources = sources.join(' \u00B7 ');
                
                // Log any source errors for debugging
                if (proxyData.sources) {
                    Object.keys(proxyData.sources).forEach(function(src) {
                        var s = proxyData.sources[src];
                        if (s.error) console.warn('Job source ' + src + ' error:', s.error, s.detail || '');
                    });
                }
                
                console.log('Find Jobs (hybrid): ' + opportunitiesData.length + ' results (' + proxyJobs.length + ' proxy + ' + directJobs.length + ' direct). Sources:', window._findJobsSources);
                
                if (opportunitiesData.length === 0) {
                    resultsDiv.innerHTML = '<div style="text-align:center; padding:40px 20px;">'
                        + '<div style="margin-bottom:16px; opacity:0.35;">' + bpIcon('search',48) + '</div>'
                        + '<p style="font-size:1.05em; color:var(--text-primary); margin-bottom:8px;">No matching jobs found</p>'
                        + '<p style="color:var(--text-muted); font-size:0.88em;">Try different keywords, adjust location, or lower the match threshold.</p></div>';
                    return;
                }
                
                renderOpportunities();
                
            } catch(e) {
                console.warn('Jobs hybrid failed:', e.message);
                JOBS_PROXY_AVAILABLE = false;
                searchDirect(keyword, (document.getElementById('findJobsCategory') || {}).value || '', resultsDiv);
            }
        }


/* ==== saveSettings ==== */
function saveSettings() {
            if (readOnlyGuard()) return;
            // Get values from form
            userData.profile.name = (document.getElementById('settingName') || {}).value || userData.profile.name;
            userData.profile.email = (document.getElementById('settingEmail') || {}).value || userData.profile.email || '';
            userData.profile.phone = (document.getElementById('settingPhone') || {}).value || userData.profile.phone || '';
            userData.profile.linkedinUrl = (document.getElementById('settingLinkedIn') || {}).value || userData.profile.linkedinUrl || '';
            var locEl = document.getElementById('settingLocation');
            if (locEl) userData.profile.location = locEl.value;
            
            // Parse and save reported compensation
            var compInput = document.getElementById('settingComp');
            if (compInput) {
                var compVal = parseInt((compInput.value || '').replace(/[^0-9]/g, ''), 10);
                userData.profile.reportedComp = compVal > 0 ? compVal : null;
            }
            
            var zipEl = document.getElementById('settingZipCode');
            if (zipEl) userData.profile.zipCode = zipEl.value.trim();
            var cityStateEl = document.getElementById('settingCityState');
            if (cityStateEl) userData.profile.cityState = cityStateEl.value.trim();
            
            var seniorityEl = document.getElementById('settingSeniority');
            var newSeniority = seniorityEl ? seniorityEl.value : userData.preferences.seniorityLevel;
            userData.preferences.seniorityLevel = newSeniority;
            var minSalaryEl = document.getElementById('settingMinSalary');
            if (minSalaryEl) {
                var minSalaryInput = minSalaryEl.value;
                userData.preferences.minSalary = minSalaryInput ? parseInt(minSalaryInput) : null;
            }
            var radiusEl = document.getElementById('settingSearchRadius');
            if (radiusEl) userData.preferences.searchRadius = parseInt(radiusEl.value) || 0;
            var workArrChecks = document.querySelectorAll('.workArrangementCheck');
            if (workArrChecks.length > 0) {
                var arr = [];
                workArrChecks.forEach(function(cb) { if (cb.checked) arr.push(cb.value); });
                userData.preferences.workArrangement = arr.length > 0 ? arr : ['On-site', 'Hybrid', 'Remote'];
            }
            
            // Update seniority keywords based on level
            if (newSeniority === 'Entry') {
                userData.preferences.seniorityKeywords = ['junior', 'associate', 'entry', 'coordinator'];
                userData.preferences.excludeRoles = ['senior', 'lead', 'manager', 'director', 'vp', 'chief', 'principal'];
            } else if (newSeniority === 'Mid') {
                userData.preferences.seniorityKeywords = ['senior', 'lead', 'manager', 'specialist'];
                userData.preferences.excludeRoles = ['junior', 'entry', 'associate', 'intern'];
            } else if (newSeniority === 'Senior') {
                userData.preferences.seniorityKeywords = ['senior manager', 'director', 'senior director', 'principal'];
                userData.preferences.excludeRoles = ['junior', 'entry', 'mid-level', 'associate'];
            } else { // Executive
                userData.preferences.seniorityKeywords = ['vp', 'vice president', 'chief', 'head of', 'director', 'principal', 'senior director'];
                userData.preferences.excludeRoles = ['engineer', 'developer', 'designer', 'analyst', 'coordinator', 'specialist', 
                                                    'junior', 'mid-level', 'associate', 'intern', 'entry'];
            }
            
            // Update profile chip with new name
            if (userData.profile.name) {
                updateProfileChip(userData.profile.name);
            }
            
            // Save to localStorage
            saveUserData();
            
            showToast('Settings saved. Go to Opportunities and click Find Matching Jobs to see updated results.', 'success', 5000);
        }


/* ==== renderJobPreferences ==== */
function renderJobPreferences() {
            return `
                <div class="blueprint-section">
                    <div class="blueprint-section-header">
                        <div class="blueprint-section-title">
                            <span class="section-icon">${bpIcon("target",20)}</span>
                            <span>Job Matching Preferences</span>
                        </div>
                    </div>
                    
                    <div class="coaching-tip">
                        <div class="coaching-tip-title">
                            ${bpIcon("lightbulb",14)} HOW JOB MATCHING WORKS
                        </div>
                        <div class="coaching-tip-content">
                            These settings control which jobs appear in your Opportunities feed. 
                            Set your seniority level to filter out irrelevant positions.
                        </div>
                    </div>
                    
                    <div class="settings-group">
                        <label class="settings-label">Seniority Level</label>
                        <select class="settings-select" id="settingSeniority">
                            <option value="Entry" ${userData.preferences.seniorityLevel === 'Entry' ? 'selected' : ''}>Entry Level</option>
                            <option value="Mid" ${userData.preferences.seniorityLevel === 'Mid' ? 'selected' : ''}>Mid Level</option>
                            <option value="Senior" ${userData.preferences.seniorityLevel === 'Senior' ? 'selected' : ''}>Senior Level</option>
                            <option value="Executive" ${userData.preferences.seniorityLevel === 'Executive' ? 'selected' : ''}>Executive Level</option>
                        </select>
                        <div class="settings-help">
                            <strong>Entry:</strong> Includes junior, associate roles<br>
                            <strong>Mid:</strong> Includes senior, lead, manager roles<br>
                            <strong>Senior:</strong> Includes senior manager, director roles<br>
                            <strong>Executive:</strong> VP, Chief, Head of roles only
                        </div>
                    </div>
                    
                    <div class="settings-group" style="padding:12px 16px; background:var(--c-surface-2a); border-radius:8px; border:1px solid var(--border);">
                        <div style="font-size:0.82em; color:var(--text-muted);">${bpIcon('info',14)} Match Score and Skill Match filters have moved to the <strong>Find Jobs</strong> and <strong>Fit For Me</strong> tabs for easier access.</div>
                    </div>
                    
                    <div class="settings-group">
                        <label class="settings-label">Search Radius</label>
                        <select class="settings-select" id="settingSearchRadius">
                            <option value="0" ${(userData.preferences.searchRadius || 0) == 0 ? 'selected' : ''}>Any distance</option>
                            <option value="10" ${userData.preferences.searchRadius == 10 ? 'selected' : ''}>10 miles</option>
                            <option value="25" ${userData.preferences.searchRadius == 25 ? 'selected' : ''}>25 miles</option>
                            <option value="50" ${userData.preferences.searchRadius == 50 ? 'selected' : ''}>50 miles</option>
                            <option value="100" ${userData.preferences.searchRadius == 100 ? 'selected' : ''}>100 miles</option>
                            <option value="200" ${userData.preferences.searchRadius == 200 ? 'selected' : ''}>200 miles</option>
                        </select>
                        <div class="settings-help">Filters results by distance from your zip code (applies to USAJobs and JSearch)</div>
                    </div>
                    
                    <div class="settings-group">
                        <label class="settings-label">Work Arrangement</label>
                        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:6px;">
                            ${['On-site', 'Hybrid', 'Remote'].map(function(arr) {
                                var prefs = userData.preferences.workArrangement || ['On-site', 'Hybrid', 'Remote'];
                                var isActive = prefs.indexOf(arr) !== -1;
                                return '<label style="display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:8px; cursor:pointer; font-size:0.88em; '
                                    + 'border:1px solid ' + (isActive ? 'var(--accent)' : 'var(--border)') + '; '
                                    + 'background:' + (isActive ? 'rgba(96,165,250,0.08)' : 'transparent') + '; '
                                    + 'color:' + (isActive ? 'var(--accent)' : 'var(--text-secondary)') + ';">'
                                    + '<input type="checkbox" class="workArrangementCheck" value="' + arr + '" '
                                    + (isActive ? 'checked' : '') + ' style="accent-color:var(--accent);"> ' + arr + '</label>';
                            }).join('')}
                        </div>
                        <div class="settings-help">Select which work arrangements you\u2019re interested in. Controls job search filtering.</div>
                    </div>
                    
                    <div class="settings-group">
                        <label class="settings-label">Minimum Salary (Optional)</label>
                        <input type="number" class="settings-input" id="settingMinSalary" 
                               value="${userData.preferences.minSalary || ''}"
                               placeholder="e.g., 150000">
                        <div class="settings-help">Leave blank for no minimum. Enter annual salary (USD).</div>
                    </div>
                    
                    <button class="save-settings-btn" onclick="saveSettings()">
                        ${bpIcon("save",14)} Save Settings
                    </button>
                </div>
            `;
        }
