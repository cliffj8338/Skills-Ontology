// views/settings.js — Blueprint v4.46.21
// Phase 7b extraction

import { bpIcon }        from '../ui/icons.js';
import { escapeHtml, safeSetAvatar, sanitizeImport } from '../core/security.js';
import { showToast }     from '../ui/toast.js';
import { _sd, _bd, waitForUserData } from '../core/data-helpers.js';


// ===== SETTINGS SYSTEM =====

export async function initSettings() {
    const view = document.getElementById('settingsView');
    if (!window._userData || !window._userData.initialized) {
        if (view) view.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-muted);">Loading...</div>';
        await waitForUserData();
    }
    // Initialize current tab if not set
    if (!window.currentSettingsTab) {
        window.currentSettingsTab = 'profile';
    }
    
    view.innerHTML = `
        <div class="blueprint-container">
            
            
            <div class="settings-tabs" style="overflow-x:auto; -webkit-overflow-scrolling:touch; white-space:nowrap; scrollbar-width:none;">
                <button class="settings-tab ${window.currentSettingsTab === 'profile' ? 'active' : ''}" 
                        onclick="switchSettingsTab('profile')">
                    ${bpIcon('profile',15)} Profile
                </button>
                <button class="settings-tab ${window.currentSettingsTab === 'preferences' ? 'active' : ''}" 
                        onclick="switchSettingsTab('preferences')">
                    ${bpIcon('preferences',15)} Preferences
                </button>
                <button class="settings-tab ${window.currentSettingsTab === 'privacy' ? 'active' : ''}" 
                        onclick="switchSettingsTab('privacy')">
                    ${bpIcon('privacy',15)} Privacy
                </button>
            </div>
            
            <div id="settingsTabContent">
                ${renderSettingsTabContent()}
            </div>
        </div>
    `;
    // Post-render: set profile photo via DOM API (avoids innerHTML img src issues)
    if (window._userData.profile && window._userData.profile.photo) {
        safeSetAvatar(document.getElementById('settingPhotoPreview'), window._userData.profile.photo, false);
    }
}

export function switchSettingsTab(tab) {
    window.currentSettingsTab = tab;
    var stc = document.getElementById('settingsTabContent');
    if (stc) stc.innerHTML = renderSettingsTabContent();
    // Post-render: set profile photo via DOM API
    if (tab === 'profile' && window._userData.profile && window._userData.profile.photo) {
        safeSetAvatar(document.getElementById('settingPhotoPreview'), window._userData.profile.photo, false);
    }
    
    // Update tab styling
    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
}

export function renderSettingsTabContent() {
    switch(window.currentSettingsTab) {
        case 'profile':
            return renderProfileSettings();
        case 'experience':
            // Moved to Blueprint > Experience tab
            window.currentSettingsTab = 'profile';
            return renderProfileSettings();
        case 'preferences':
            return renderJobPreferences();
        case 'privacy':
            return renderPrivacyAndData();
        default:
            return renderProfileSettings();
    }
}

export function renderProfileSettings() {
    // Guard: don't render editable profile in demo/read-only mode
    const _isDemo = window.appContext && window.appContext.mode === 'demo';
    if (!window.fbUser || _isDemo || window.isReadOnlyProfile) {
        return `<div style="text-align:center; padding:60px 20px;">
            <div style="margin-bottom:16px; opacity:0.4;">${bpIcon('profile',48)}</div>
            <div style="font-size:1.1em; font-weight:600; color:var(--text-primary); margin-bottom:8px;">Sign in to edit your profile</div>
            <div style="color:var(--text-muted); max-width:400px; margin:0 auto 24px; line-height:1.6;">
                Your name, photo, and headline are saved to your account. Sign in to personalize your Blueprint.</div>
            <button onclick="showAuthModal('signin')" style="padding:12px 28px; background:var(--accent); color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.95em;">Sign In</button>
        </div>`;
    }
    if (!window._userData || !window._userData.initialized) {
        setTimeout(function() { if (window._userData && window._userData.initialized) window.initSettings(); }, 300);
        return '<div style="text-align:center; padding:40px; color:var(--text-muted);">Loading profile data...</div>';
    }
    return `
        <div class="blueprint-section">
            <div class="blueprint-section-header">
                <div class="blueprint-section-title">
                    <span class="section-icon">${bpIcon("profile",20)}</span>
                    <span>Profile Information</span>
                </div>
            </div>
            
            <div class="settings-group">
                <label class="settings-label">Your Name</label>
                <input type="text" class="settings-input" id="settingName" 
                       value="${window._userData.profile.name || ''}" 
                       placeholder="Enter your name">
                <div class="settings-help">This appears in the header and exports</div>
            </div>
            
            <div class="settings-group">
                <label class="settings-label">Profile Photo</label>
                <div style="display:flex; align-items:center; gap:16px;">
                    <div id="settingPhotoPreview" onclick="document.getElementById('settingPhotoInput').click()" 
                         style="width:64px; height:64px; border-radius:50%; background:var(--accent); color:#fff; 
                                display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.2em;
                                cursor:pointer; overflow:hidden; border:2px solid var(--border); flex-shrink:0;
                                ${window._userData.profile.photo ? 'padding:0' : ''}">
                        ${(window._userData.profile.name || 'U').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div>
                        <button onclick="document.getElementById('settingPhotoInput').click()" 
                                style="background:var(--accent-glow); border:1px solid var(--border); color:var(--text-primary); padding:6px 14px; border-radius:6px; cursor:pointer; font-size:0.85em;">
                            Upload Photo
                        </button>
                        ${window._userData.profile.photo ? '<button onclick="removeProfilePhoto()" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.82em; margin-left:8px;">Remove</button>' : ''}
                        <input type="file" id="settingPhotoInput" accept="image/*" onchange="handleProfilePhoto(this)" style="display:none;">
                        <div class="settings-help" style="margin-top:4px;">Max 200KB, resized to 128px</div>
                    </div>
                </div>
            </div>
            
            <div class="settings-group">
                <label class="settings-label">Email (Optional)</label>
                <input type="email" class="settings-input" id="settingEmail" 
                       value="${window._userData.profile.email || ''}" 
                       placeholder="your.email@example.com">
                <div class="settings-help">For export contact information</div>
            </div>
            
            <div class="settings-group">
                <label class="settings-label">Phone (Optional)</label>
                <input type="tel" class="settings-input" id="settingPhone" 
                       value="${window._userData.profile.phone || ''}" 
                       placeholder="(555) 123-4567">
                <div class="settings-help">Included in resume exports</div>
            </div>
            
            <div class="settings-group">
                <label class="settings-label">LinkedIn URL (Optional)</label>
                <input type="url" class="settings-input" id="settingLinkedIn" 
                       value="${window._userData.profile.linkedinUrl || ''}" 
                       placeholder="https://linkedin.com/in/yourname">
                <div class="settings-help">Included in resume and executive blueprint exports</div>
            </div>
            
            <div class="settings-group">
                <label class="settings-label">Location (for market valuation)</label>
                <select class="settings-select" id="settingLocation">
                    <option value="Philadelphia, PA" ${window._userData.profile.location === 'Philadelphia, PA' ? 'selected' : ''}>Philadelphia, PA</option>
                    <option value="San Francisco Bay Area, CA">San Francisco Bay Area, CA</option>
                    <option value="New York City, NY">New York City, NY</option>
                    <option value="Seattle, WA">Seattle, WA</option>
                    <option value="Boston, MA">Boston, MA</option>
                    <option value="Washington DC">Washington DC</option>
                    <option value="Los Angeles, CA">Los Angeles, CA</option>
                    <option value="San Diego, CA">San Diego, CA</option>
                    <option value="Denver, CO">Denver, CO</option>
                    <option value="Austin, TX">Austin, TX</option>
                    <option value="Chicago, IL">Chicago, IL</option>
                    <option value="Atlanta, GA">Atlanta, GA</option>
                    <option value="Remote">Remote</option>
                    <option value="Phoenix, AZ">Phoenix, AZ</option>
                    <option value="Dallas, TX">Dallas, TX</option>
                    <option value="Houston, TX">Houston, TX</option>
                    <option value="Miami, FL">Miami, FL</option>
                    <option value="Portland, OR">Portland, OR</option>
                    <option value="Charlotte, NC">Charlotte, NC</option>
                    <option value="Nashville, TN">Nashville, TN</option>
                    <option value="Indianapolis, IN">Indianapolis, IN</option>
                    <option value="Columbus, OH">Columbus, OH</option>
                    <option value="Kansas City, MO">Kansas City, MO</option>
                    <option value="Omaha, NE">Omaha, NE</option>
                    <option value="Lincoln, NE">Lincoln, NE</option>
                    <option value="Other US Metro">Other US Metro</option>
                    <option value="Rural US">Rural US</option>
                </select>
                <div class="settings-help">Your location affects skill market valuations (cost of living adjustment)</div>
            </div>
            
            <div class="settings-group">
                <label class="settings-label">Current Total Compensation (Optional)</label>
                <div style="position:relative;">
                    <span style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-weight:600;">$</span>
                    <input type="text" class="settings-input" id="settingComp" 
                           value="${window._userData.profile.reportedComp ? Math.round(window._userData.profile.reportedComp).toLocaleString() : ''}" 
                           placeholder="e.g. 350,000"
                           style="padding-left:24px;"
                           oninput="this.value = this.value.replace(/[^0-9,]/g, '')">
                </div>
                <div class="settings-help">Base + bonus + equity. Used to compare against market benchmarks. Never shared externally.</div>
            </div>
            
            <div style="margin-top:24px; padding-top:20px; border-top:1px solid var(--border); display:flex; justify-content:flex-end;">
                <button onclick="saveSettings()" style="padding:10px 28px; background:var(--accent); color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.92em; letter-spacing:0.02em;">
                    ${bpIcon('save',14)} Save Profile
                </button>
            </div>
        </div>
    `;
}

// ===== EXPERIENCE SETTINGS (Work History, Education, Certifications) =====

function refreshExperienceContent() {
    // Works from both Blueprint > Experience and Settings > Experience (legacy)
    var target = document.getElementById('blueprintTabContent') || document.getElementById('settingsTabContent');
    if (target && (blueprintTab === 'experience' || window.currentSettingsTab === 'experience')) {
        target.innerHTML = renderExperienceSettings();
    }
}

export function renderExperienceSettings() {
    var whItems = window._userData.workHistory || [];
    var edItems = window._userData.education || [];
    var certItems = window._userData.certifications || [];
    
    var html = '';
    
    // ── LinkedIn Merge Import ──
    var lastMerge = (window._userData.importStats || {}).lastMerge;
    var lastMergeStr = lastMerge ? new Date(lastMerge).toLocaleDateString() : null;
    
    html += '<div style="padding:16px; margin-bottom:20px; background:linear-gradient(135deg, rgba(10,102,194,0.06), rgba(10,102,194,0.02)); '
        + 'border:1px solid rgba(10,102,194,0.2); border-radius:10px;">'
        + '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">'
        + '<div style="flex:1; min-width:200px;">'
        + '<div style="font-weight:700; color:var(--text-primary); font-size:0.9em; display:flex; align-items:center; gap:6px;">'
        + '<svg width="16" height="16" viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
        + ' Update from LinkedIn</div>'
        + '<div style="font-size:0.78em; color:var(--text-muted); margin-top:4px; line-height:1.4;">'
        + 'Upload your LinkedIn data export to merge new positions, skills, endorsements, recommendations, articles, and more into your existing profile. Nothing you\'ve built will be overwritten.'
        + (lastMergeStr ? ' <span style="color:var(--accent);">Last updated: ' + lastMergeStr + '</span>' : '')
        + '</div></div>'
        + '<div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">'
        + '<label id="liMergeBtn" style="padding:8px 18px; background:#0a66c2; color:#fff; border-radius:8px; cursor:pointer; '
        + 'font-weight:600; font-size:0.82em; display:inline-flex; align-items:center; gap:6px; transition:opacity 0.2s;">'
        + bpIcon('network', 14) + ' Upload .zip'
        + '<input type="file" accept=".zip" onchange="handleLinkedInMerge(this)" style="display:none;">'
        + '</label>'
        + '</div></div>'
        + '<div id="liMergeStatus" style="display:none; font-size:0.8em; color:var(--accent); margin-top:10px; padding:8px 12px; '
        + 'background:var(--c-surface-2); border-radius:6px;">' + bpIcon('settings', 12) + ' Processing...</div>'
        + '<div id="liMergeResult" style="display:none; margin-top:10px; padding:10px 12px; '
        + 'background:var(--c-surface-2); border-radius:6px;"></div>'
        + '</div>';
    
    // --- Work History ---
    // Build company groups for progression display
    var companyGroups = {};
    whItems.forEach(function(job, idx) {
        var normCo = (job.company || '').trim().replace(/,?\s*(LLC|Inc\.?|Corp\.?|Ltd\.?|Co\.?|People|Group|Holdings)\.?\s*$/i, '').trim().toLowerCase();
        if (!normCo) normCo = '_ungrouped_' + idx;
        if (!companyGroups[normCo]) companyGroups[normCo] = [];
        companyGroups[normCo].push({ job: job, idx: idx });
    });
    
    // Sort groups: multi-position first, then by most recent start date
    var groupArr = Object.values(companyGroups).sort(function(a, b) {
        // Most recent position in each group
        var aRecent = a.reduce(function(max, e) {
            var y = parseInt((e.job.startDate || '').split(' ').pop()) || parseInt(e.job.startDate) || 0;
            return y > max ? y : max;
        }, 0);
        var bRecent = b.reduce(function(max, e) {
            var y = parseInt((e.job.startDate || '').split(' ').pop()) || parseInt(e.job.startDate) || 0;
            return y > max ? y : max;
        }, 0);
        return bRecent - aRecent;
    });
    
    var hiddenCount = whItems.filter(function(j) { return j.hidden; }).length;
    
    html += '<div class="blueprint-section">'
        + '<div class="blueprint-section-header">'
        + '<div class="blueprint-section-title">'
        + '<span class="section-icon">' + bpIcon('briefcase',20) + '</span>'
        + '<span>Work History</span>'
        + '<span class="section-count">' + whItems.length + ' entries</span>'
        + (hiddenCount > 0 ? '<span style="font-size:0.72em; padding:2px 8px; border-radius:8px; background:rgba(245,158,11,0.1); color:#f59e0b; font-weight:600; margin-left:6px;">'
            + bpIcon('eye',11) + ' ' + hiddenCount + ' hidden</span>' : '')
        + '</div>'
        + '</div>'
        + '<div class="coaching-tip">'
        + '<div class="coaching-tip-title">' + bpIcon('lightbulb',14) + ' CAREER PROGRESSION</div>'
        + '<div class="coaching-tip-content">'
        + 'Positions at the same company are grouped to show your career trajectory. Multiple roles demonstrate growth, expanding scope, and increasing responsibility.'
        + '</div>'
        + '</div>';
    
    if (whItems.length > 0) {
        groupArr.forEach(function(group) {
            var isProgression = group.length > 1;
            
            // Sort positions within group by start date (earliest first for progression display)
            group.sort(function(a, b) {
                var aY = parseInt((a.job.startDate || '').split(' ').pop()) || parseInt(a.job.startDate) || 0;
                var bY = parseInt((b.job.startDate || '').split(' ').pop()) || parseInt(b.job.startDate) || 0;
                return aY - bY;
            });
            
            if (isProgression) {
                var coName = group[0].job.company || 'Company';
                var firstStart = group[0].job.startDate || '?';
                var lastEnd = group[group.length - 1].job.endDate || group[group.length - 1].job.current ? 'Present' : '?';
                
                // Calculate total tenure
                var firstYear = parseInt((firstStart || '').split(' ').pop()) || parseInt(firstStart) || 0;
                var lastYear = lastEnd === 'Present' ? new Date().getFullYear() : (parseInt((lastEnd || '').split(' ').pop()) || parseInt(lastEnd) || 0);
                var tenure = lastYear - firstYear;
                
                html += '<div style="padding:16px; margin-bottom:12px; background:var(--c-surface-1); '
                    + 'border:1px solid var(--c-surface-5b); border-radius:10px; border-left:3px solid var(--c-accent);">';
                
                // Company header with progression badge
                html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">'
                    + '<div>'
                    + '<div style="font-weight:700; color:var(--c-accent); font-size:0.95em;">' + escapeHtml(coName) + '</div>'
                    + '<div style="color:var(--c-muted); font-size:0.78em;">' + formatWorkDate(firstStart) + ' \u2013 ' + (lastEnd === 'Present' ? 'Present' : formatWorkDate(lastEnd))
                    + (tenure > 0 ? ' \u00B7 ' + tenure + ' year' + (tenure !== 1 ? 's' : '') : '') + '</div>'
                    + '</div>'
                    + '<span style="font-size:0.68em; padding:3px 8px; border-radius:4px; '
                    + 'background:rgba(96,165,250,0.1); color:#60a5fa; font-weight:600; letter-spacing:0.03em;">'
                    + '\u2191 ' + group.length + ' ROLES</span>'
                    + '</div>';
                
                // Progression timeline (most recent on top)
                var reversedGroup = group.slice().reverse();
                reversedGroup.forEach(function(entry, gIdx) {
                    var job = entry.job;
                    var idx = entry.idx;
                    var isLatest = gIdx === 0;
                    var isHidden = job.hidden === true;
                    var dateRange = formatWorkDate(job.startDate || '?') + ' \u2013 ' + (job.current ? 'Present' : formatWorkDate(job.endDate || '?'));
                    
                    html += '<div id="wh-card-' + idx + '" style="padding:10px 12px; margin-left:12px; border-left:2px solid '
                        + (isLatest ? 'var(--c-accent)' : 'var(--c-surface-5b)') + '; position:relative;'
                        + (isHidden ? ' opacity:0.4;' : '') + '">';
                    
                    // Timeline dot
                    html += '<div style="position:absolute; left:-5px; top:14px; width:8px; height:8px; border-radius:50%; '
                        + 'background:' + (isLatest ? 'var(--c-accent)' : 'var(--c-surface-5b)') + ';"></div>';
                    
                    // Controls
                    html += '<div style="position:absolute; top:6px; right:4px; display:flex; align-items:center; gap:6px;">'
                        + '<button onclick="toggleWorkHistoryHidden(' + idx + ')" title="' + (isHidden ? 'Show in Blueprint' : 'Hide from Blueprint') + '" '
                        + 'style="background:none; border:none; cursor:pointer; font-size:0.72em; padding:1px 4px; border-radius:3px; '
                        + 'color:' + (isHidden ? '#f59e0b' : 'var(--c-muted)') + ';">'
                        + (isHidden ? bpIcon('eye',11) + ' Hidden' : bpIcon('eye',11)) + '</button>'
                        + '<button onclick="editWorkHistoryItem(' + idx + ')" title="Edit" style="background:none; border:none; cursor:pointer; font-size:0.85em; color:var(--c-accent);">\u270E</button>'
                        + '<button onclick="removeWorkHistoryItem(' + idx + ')" title="Remove" style="background:none; border:none; cursor:pointer; font-size:0.9em; color:var(--c-danger);">\u00D7</button>'
                        + '</div>';
                    
                    html += '<div style="font-weight:' + (isLatest ? '700' : '600') + '; color:var(--c-text-alt); font-size:0.9em;">' + escapeHtml(job.title || 'Untitled') + '</div>'
                        + '<div style="color:var(--c-muted); font-size:0.78em; margin-top:1px;">' + dateRange + '</div>';
                    
                    if (job.description && isLatest) {
                        html += '<div style="color:var(--c-heading); font-size:0.82em; margin-top:6px; line-height:1.5;">' + escapeHtml(job.description.substring(0, 300)) + (job.description.length > 300 ? '...' : '') + '</div>';
                    }
                    
                    if (job.achievements && job.achievements.length > 0 && isLatest) {
                        html += '<div style="margin-top:6px;">';
                        job.achievements.forEach(function(ach) {
                            html += '<div style="font-size:0.8em; color:var(--c-heading); padding:2px 0 2px 14px; position:relative; line-height:1.45;">'
                                + '<span style="position:absolute; left:0; color:var(--c-success);">\u25B8</span>'
                                + escapeHtml(ach) + '</div>';
                        });
                        html += '</div>';
                    }
                    
                    html += '</div>';
                });
                
                html += '</div>';
            } else {
                // Single position — render normally
                var entry = group[0];
                var job = entry.job;
                var idx = entry.idx;
                var dateRange = formatWorkDate(job.startDate || '?') + ' \u2013 ' + (job.current ? 'Present' : formatWorkDate(job.endDate || '?'));
                var isHidden = job.hidden === true;
                
                html += '<div id="wh-card-' + idx + '" style="padding:16px; margin-bottom:12px; background:var(--c-surface-1); '
                    + 'border:1px solid var(--c-surface-5b); border-radius:10px; position:relative;'
                    + (isHidden ? ' opacity:0.4;' : '') + '">';
                
                html += '<div style="position:absolute; top:10px; right:10px; display:flex; align-items:center; gap:6px;">'
                    + '<button onclick="toggleWorkHistoryHidden(' + idx + ')" title="' + (isHidden ? 'Show in Blueprint' : 'Hide from Blueprint') + '" '
                    + 'style="background:none; border:none; cursor:pointer; font-size:0.78em; padding:2px 6px; border-radius:4px; '
                    + 'color:' + (isHidden ? '#f59e0b' : 'var(--c-muted)') + '; transition:all 0.2s;">'
                    + (isHidden ? bpIcon('eye',13) + ' Hidden' : bpIcon('eye',13)) + '</button>'
                    + '<button onclick="editWorkHistoryItem(' + idx + ')" title="Edit" style="background:none; border:none; cursor:pointer; font-size:0.85em; color:var(--c-accent);">\u270E</button>'
                    + '<button onclick="removeWorkHistoryItem(' + idx + ')" title="Remove" style="background:none; border:none; cursor:pointer; font-size:0.9em; color:var(--c-danger);">\u00D7</button>'
                    + '</div>';
                
                html += '<div style="font-weight:700; color:var(--c-text-alt); font-size:0.95em;">' + escapeHtml(job.title || 'Untitled Role') + '</div>'
                    + '<div style="color:var(--c-accent); font-size:0.88em; margin-top:2px;">' + escapeHtml(job.company || '') + (job.location ? ' \u00B7 ' + escapeHtml(job.location) : '') + '</div>'
                    + '<div style="color:var(--c-muted); font-size:0.82em; margin-top:2px;">' + dateRange + '</div>';
                
                if (job.description) {
                    html += '<div style="color:var(--c-heading); font-size:0.85em; margin-top:8px; line-height:1.5;">' + escapeHtml(job.description) + '</div>';
                }
                
                if (job.achievements && job.achievements.length > 0) {
                    html += '<div style="margin-top:8px;">';
                    job.achievements.forEach(function(ach) {
                        html += '<div style="font-size:0.83em; color:var(--c-heading); padding:3px 0 3px 14px; position:relative; line-height:1.45;">'
                            + '<span style="position:absolute; left:0; color:var(--c-success);">\u25B8</span>'
                            + escapeHtml(ach) + '</div>';
                    });
                    html += '</div>';
                }
                
                html += '</div>';
            }
        });
    } else {
        html += '<div style="text-align:center; padding:24px; color:var(--c-faint); font-size:0.9em;">'
            + 'No work history added yet. Add your roles to power resume generation.'
            + '</div>';
    }
    
    html += '<button onclick="addWorkHistoryItem()" style="'
        + 'background:var(--c-accent-bg-5a); '
        + 'border:1px solid var(--c-accent-border-4); '
        + 'color:var(--c-accent-deep); padding:10px 20px; border-radius:8px; cursor:pointer; '
        + 'font-size:0.9em; font-weight:600; margin-top:12px;">'
        + '+ Add Position</button>'
        + '</div>';
    
    // --- Education ---
    html += '<div class="blueprint-section" style="margin-top:24px;">'
        + '<div class="blueprint-section-header">'
        + '<div class="blueprint-section-title">'
        + '<span class="section-icon">' + bpIcon('graduation',20) + '</span>'
        + '<span>Education</span>'
        + '<span class="section-count">' + edItems.length + ' entries</span>'
        + '</div>'
        + '</div>';
    
    if (edItems.length > 0) {
        var edTypeIcons = { degree:'🎓', cert:'📜', trade:'🔧', bootcamp:'⚡', profdev:'📊', military:'🎖️' };
        var edTypeLabels = { degree:'Degree', cert:'Certificate', trade:'Trade', bootcamp:'Bootcamp', profdev:'Prof Dev', military:'Military' };
        
        edItems.forEach(function(ed, idx) {
            var edType = ed.type || 'degree';
            var icon = edTypeIcons[edType] || '🎓';
            var typeLabel = edTypeLabels[edType] || 'Degree';
            var hasLinkedCreds = ed.linkedCredentials && ed.linkedCredentials.length > 0;
            
            // Build date display
            var dateStr = '';
            if (ed.startYear && ed.endYear) {
                dateStr = ed.startYear + ' \u2013 ' + (ed.currentlyEnrolled ? 'Present' : ed.endYear);
            } else if (ed.startYear && ed.currentlyEnrolled) {
                dateStr = ed.startYear + ' \u2013 Present';
            } else if (ed.year) {
                dateStr = ed.year;
            }
            
            html += '<div style="padding:12px 16px; margin-bottom:8px; background:var(--c-surface-1); '
                + 'border:1px solid var(--c-surface-5b); border-radius:8px;">'
                + '<div style="display:flex; justify-content:space-between; align-items:flex-start;">'
                + '<div style="flex:1; min-width:0;">'
                
                // Type badge + credential
                + '<div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">'
                + '<span style="font-size:0.68em; padding:2px 8px; border-radius:10px; background:var(--c-surface-4a); color:var(--c-muted); font-weight:600; white-space:nowrap;">'
                + icon + ' ' + typeLabel + '</span>'
                + '</div>'
                
                // Main line: degree/credential + field
                + '<div style="font-weight:600; color:var(--c-text-alt); font-size:0.9em; margin-top:4px;">'
                + (ed.degree || '') + (ed.field ? ' in ' + ed.field : '') + '</div>'
                
                // Institution + dates
                + '<div style="color:var(--c-muted); font-size:0.82em; margin-top:2px;">'
                + (ed.school || '') 
                + (ed.issuingAuthority ? ' \u00B7 Issued by ' + ed.issuingAuthority : '')
                + (dateStr ? ' \u00B7 ' + dateStr : '') + '</div>'
                
                // Linked credentials
                + (hasLinkedCreds ? '<div style="margin-top:6px;">' + ed.linkedCredentials.map(function(ci) {
                    var cert = window._userData.certifications[ci];
                    if (!cert) return '';
                    return '<span style="font-size:0.72em; padding:2px 8px; border-radius:8px; background:var(--c-accent-bg-5a); color:var(--c-accent-deep); font-weight:600;">'
                        + '\uD83D\uDD17 ' + escapeHtml(cert.name + (cert.abbr ? ' (' + cert.abbr + ')' : '')) + '</span> ';
                }).join('') + '</div>' : '')
                
                // Description preview
                + (ed.description ? '<div style="color:var(--c-heading); font-size:0.78em; margin-top:4px; line-height:1.4; opacity:0.8;">' + escapeHtml(ed.description.substring(0, 120)) + (ed.description.length > 120 ? '...' : '') + '</div>' : '')
                
                + '</div>'
                + '<div style="display:flex; gap:6px; flex-shrink:0;">'
                + '<button onclick="editEducationItem(' + idx + ')" style="background:none; border:none; cursor:pointer; font-size:0.85em; color:var(--c-accent);">\u270E</button>'
                + '<button onclick="removeEducationItem(' + idx + ')" style="background:none; border:none; cursor:pointer; font-size:0.9em; color:var(--c-danger);">\u00D7</button>'
                + '</div></div></div>';
        });
    } else {
        html += '<div style="text-align:center; padding:16px; color:var(--c-faint); font-size:0.88em;">'
            + 'No education entries yet.'
            + '</div>';
    }
    
    html += '<button onclick="addEducationItem()" style="'
        + 'background:var(--c-accent-bg-5a); '
        + 'border:1px solid var(--c-accent-border-4); '
        + 'color:var(--c-accent-deep); padding:8px 16px; border-radius:8px; cursor:pointer; '
        + 'font-size:0.85em; font-weight:600; margin-top:8px;">'
        + '+ Add Education</button>'
        + '</div>';
    
    // --- Certifications ---
    html += '<div class="blueprint-section" style="margin-top:24px;">'
        + '<div class="blueprint-section-header">'
        + '<div class="blueprint-section-title">'
        + '<span class="section-icon">' + bpIcon('award',20) + '</span>'
        + '<span>Certifications, Licenses & Degrees</span>'
        + '<span class="section-count">' + certItems.length + ' entries</span>'
        + '</div>'
        + '</div>';
    
    if (certItems.length > 0) {
        certItems.forEach(function(cert, idx) {
            var tierColor = cert.tier >= 2 ? '#f59e0b' : '#10b981';
            var tierTag = cert.tier >= 2 ? 'ADV' : 'PRO';
            var linkedCount = (cert.linkedSkills || []).length;
            var libSkills = cert.libraryMatch ? (findCertInLibrary(cert.libraryMatch) || {}).skills : null;
            var totalLinks = linkedCount + (libSkills ? libSkills.length : 0);
            
            html += '<div style="padding:12px 16px; margin-bottom:8px; background:var(--c-surface-1); '
                + 'border:1px solid var(--c-surface-5b); border-radius:8px; '
                + 'display:flex; justify-content:space-between; align-items:center;">'
                + '<div>'
                + '<div style="font-weight:600; color:var(--c-text-alt); font-size:0.9em;">'
                + (cert.name || '')
                + (cert.abbr ? ' <span style="color:var(--c-accent); font-size:0.85em;">(' + cert.abbr + ')</span>' : '')
                + '</div>'
                + '<div style="display:flex; gap:6px; align-items:center; margin-top:3px;">'
                + '<span style="color:var(--c-muted); font-size:0.82em;">'
                + (cert.issuer || '') + (cert.year ? ' \u00B7 ' + cert.year : '') + '</span>'
                + (cert.tier ? ' <span style="font-size:0.68em; padding:1px 6px; border-radius:6px; background:rgba(' + (cert.tier >= 2 ? '245,158,11' : '16,185,129') + ',0.12); color:' + tierColor + '; font-weight:700;">' + tierTag + '</span>' : '')
                + (totalLinks > 0 ? ' <span style="font-size:0.72em; color:var(--c-purple-light);">\uD83D\uDD17 ' + totalLinks + ' skills</span>' : '')
                + '</div>'
                + '</div>'
                + '<div style="display:flex; gap:6px;">'
                + '<button onclick="editCertItem(' + idx + ')" style="background:none; border:none; cursor:pointer; font-size:0.85em; color:var(--c-accent);">\u270E</button>'
                + '<button onclick="removeCertItem(' + idx + ')" style="background:none; border:none; cursor:pointer; font-size:0.9em; color:var(--c-danger);">\u00D7</button>'
                + '</div></div>';
        });
    } else {
        html += '<div style="text-align:center; padding:16px; color:var(--c-faint); font-size:0.88em;">'
            + 'No credentials yet. Add certifications, licenses, or degrees from the library.'
            + '</div>';
    }
    
    html += '<button onclick="addCertItem()" style="'
        + 'background:var(--c-accent-bg-5a); '
        + 'border:1px solid var(--c-accent-border-4); '
        + 'color:var(--c-accent-deep); padding:8px 16px; border-radius:8px; cursor:pointer; '
        + 'font-size:0.85em; font-weight:600; margin-top:8px;">'
        + '+ Add Credential</button>'
        + '</div>';
    
    // Save button
    html += '<div style="margin-top:24px; display:flex; gap:12px;">'
        + '<button onclick="saveAll(); showToast(\'Experience saved.\', \'success\')" style="'
        + 'background:var(--accent); color:#fff; border:none; padding:12px 28px; border-radius:8px; '
        + 'cursor:pointer; font-weight:600; font-size:0.95em;">'
        + 'Save All Changes</button>'
        + '</div>';
    
    return html;
}

// --- Work History CRUD ---
export function addWorkHistoryItem() {
    if (readOnlyGuard()) return;
    openWorkHistoryModal(-1);
}
export function editWorkHistoryItem(idx) {
    if (readOnlyGuard()) return;
    openWorkHistoryModal(idx);
}
export function removeWorkHistoryItem(idx) {
    if (readOnlyGuard()) return;
    if (!confirm('Remove this position?')) return;
    var removedJob = window._userData.workHistory[idx];
    window._userData.workHistory.splice(idx, 1);
    // Clean up orphaned role if no other position matches it
    if (removedJob) {
        var removedTitle = (removedJob.title || '').toLowerCase().trim();
        var stillExists = window._userData.workHistory.some(function(j) {
            return (j.title || '').toLowerCase().trim() === removedTitle;
        });
        if (!stillExists && removedTitle) {
            // Remove from _sd().roles and window._userData.roles, track removed IDs
            var removedRoleIds = new Set();
            removedRoleIds.add(removedTitle);
            [_sd().roles, window._userData.roles].forEach(function(rolesArr) {
                if (!Array.isArray(rolesArr)) return;
                for (var ri = rolesArr.length - 1; ri >= 0; ri--) {
                    var rn = (rolesArr[ri].name || '').toLowerCase().trim();
                    var rid = (rolesArr[ri].id || '').toLowerCase().trim();
                    if (rn === removedTitle || rid === removedTitle) {
                        removedRoleIds.add(rn);
                        removedRoleIds.add(rid);
                        rolesArr.splice(ri, 1);
                    }
                }
            });
            // Also remove role references from skills
            (_sd().skills || []).forEach(function(s) {
                if (s.roles && Array.isArray(s.roles)) {
                    s.roles = s.roles.filter(function(r) {
                        var rName = (typeof r === 'string' ? r : '').toLowerCase().trim();
                        return !removedRoleIds.has(rName);
                    });
                }
            });
        }
    }
    saveAll();
    if (fbUser) debouncedSave();
    window.networkInitialized = false;
    refreshExperienceContent();
    showToast('Position removed.', 'info');
}

export function toggleWorkHistoryHidden(idx) {
    if (readOnlyGuard()) return;
    var job = (window._userData.workHistory || [])[idx];
    if (!job) return;
    job.hidden = !job.hidden;
    saveAll();
    if (fbUser) debouncedSave();
    // Update UI in-place
    var card = document.getElementById('wh-card-' + idx);
    if (card) card.style.opacity = job.hidden ? '0.4' : '1';
    // Re-render the toggle button
    var btns = card ? card.querySelectorAll('button') : [];
    btns.forEach(function(btn) {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').indexOf('toggleWorkHistoryHidden(' + idx + ')') !== -1) {
            btn.title = job.hidden ? 'Show in Blueprint' : 'Hide from Blueprint';
            btn.style.color = job.hidden ? '#f59e0b' : 'var(--c-muted)';
            btn.innerHTML = job.hidden ? bpIcon('eye',13) + ' Hidden' : bpIcon('eye',13);
        }
    });
    // Mark network as needing rebuild when user switches to Map
    window.networkInitialized = false;
    // Refresh the hidden count badge in section header
    refreshExperienceContent();
    showToast(job.hidden ? 'Position hidden from Blueprint.' : 'Position visible in Blueprint.', 'info', 2500);
}
// Returns only non-hidden work history items — use for matching, exports, network, scouting
export function getVisibleWorkHistory() {
    if (!window._userData) return [];
    return (window._userData.workHistory || []).filter(function(job) { return !job.hidden; });
}
// Returns roles whose corresponding workHistory position is not hidden
// Orphan roles (no matching workHistory entry at all) are excluded
export function getVisibleRoles() {
    if (!window._userData || !_sd().skills) return [];
    var wh = window._userData.workHistory || [];
    // No work history → show all roles (nothing to hide)
    if (wh.length === 0) return (_sd().roles || []).slice();
    var visibleTitles = new Set();
    wh.forEach(function(job) {
        if (!job.hidden) visibleTitles.add((job.title || '').toLowerCase().trim());
    });
    // If all entries are hidden, return empty (user explicitly hid everything)
    if (visibleTitles.size === 0) return [];
    var filtered = (_sd().roles || []).filter(function(role) {
        var rName = (role.name || '').toLowerCase().trim();
        var rId = (role.id || '').toLowerCase().trim();
        return visibleTitles.has(rName) || visibleTitles.has(rId);
    });
    // If no roles matched any work history titles, show all roles
    // (template data may use different naming conventions)
    return filtered.length > 0 ? filtered : (_sd().roles || []).slice();
}
// Hide a role from the network by marking its workHistory entry as hidden
export function hideRoleFromNetwork(roleName) {
    if (readOnlyGuard()) return;
    var rLower = (roleName || '').toLowerCase().trim();
    // Find role object to get both name and ID for matching
    var roleObj = (_sd().roles || []).find(function(r) {
        return (r.name || '').toLowerCase().trim() === rLower 
            || (r.id || '').toLowerCase().trim() === rLower;
    });
    var matchNames = new Set();
    matchNames.add(rLower);
    if (roleObj) {
        matchNames.add((roleObj.name || '').toLowerCase().trim());
        matchNames.add((roleObj.id || '').toLowerCase().trim());
    }
    
    var found = false;
    // Exact match first
    (window._userData.workHistory || []).forEach(function(job) {
        var titleLower = (job.title || '').toLowerCase().trim();
        if (!job.hidden && matchNames.has(titleLower)) {
            job.hidden = true;
            found = true;
        }
    });
    // Fuzzy fallback: partial/substring match
    if (!found) {
        (window._userData.workHistory || []).forEach(function(job) {
            if (found || job.hidden) return;
            var titleLower = (job.title || '').toLowerCase().trim();
            matchNames.forEach(function(mn) {
                if (!found && mn && titleLower && (mn.indexOf(titleLower) !== -1 || titleLower.indexOf(mn) !== -1)) {
                    job.hidden = true;
                    found = true;
                }
            });
        });
    }
    if (found) {
        saveAll();
        if (fbUser) debouncedSave();
        var ric = document.getElementById('roleInfoCard');
        if (ric) ric.style.display = 'none';
        filterByRole('all');
        if (typeof setNetworkMatchMode === 'function') {
            setNetworkMatchMode(networkMatchMode || 'you');
        }
        showToast('Role hidden from Blueprint. Unhide it in Experience tab.', 'info', 3500);
    } else {
        // Orphan role: exists in _sd().roles but has no matching workHistory entry.
        // Remove it directly from roles and clean skill references.
        var orphanIdx = (_sd().roles || []).findIndex(function(r) {
            return matchNames.has((r.name || '').toLowerCase().trim()) || matchNames.has((r.id || '').toLowerCase().trim());
        });
        if (orphanIdx !== -1) {
            var orphanRole = _sd().roles[orphanIdx];
            var orphanId = orphanRole.id;
            var orphanName = orphanRole.name;
            _sd().roles.splice(orphanIdx, 1);
            // Also remove from window._userData.roles if present
            if (window._userData.roles) {
                window._userData.roles = window._userData.roles.filter(function(r) {
                    return (r.name || '').toLowerCase().trim() !== (orphanName || '').toLowerCase().trim()
                        && (r.id || '').toLowerCase().trim() !== (orphanId || '').toLowerCase().trim();
                });
            }
            // Clean role references from skills
            (_sd().skills || []).forEach(function(s) {
                if (s.roles) {
                    s.roles = s.roles.filter(function(rid) { return rid !== orphanId && rid !== orphanName; });
                }
            });
            saveAll();
            if (fbUser) debouncedSave();
            networkInitialized = false;
            var ric2 = document.getElementById('roleInfoCard');
            if (ric2) ric2.style.display = 'none';
            filterByRole('all');
            if (typeof setNetworkMatchMode === 'function') {
                setNetworkMatchMode(networkMatchMode || 'you');
            }
            showToast('Orphan role "' + (orphanName || roleName) + '" removed from Blueprint.', 'info', 3500);
        } else {
            showToast('Could not find matching position to hide.', 'warning');
        }
    }
}
export function cleanOrphanRoles() {
    if (readOnlyGuard()) return;
    var whTitles = new Set();
    (window._userData.workHistory || []).forEach(function(j) { whTitles.add((j.title || '').toLowerCase().trim()); });
    var orphans = [];
    (_sd().roles || []).forEach(function(r) {
        var rn = (r.name || '').toLowerCase().trim();
        var ri = (r.id || '').toLowerCase().trim();
        if (!whTitles.has(rn) && !whTitles.has(ri)) orphans.push(r);
    });
    if (orphans.length === 0) {
        showToast('No orphan roles found.', 'info');
        return;
    }
    orphans.forEach(function(orphan) {
        var oid = orphan.id;
        var oname = orphan.name;
        // Remove from _sd().roles
        _sd().roles = (_sd().roles || []).filter(function(r) { return r !== orphan; });
        // Remove from window._userData.roles
        if (window._userData.roles) {
            window._userData.roles = window._userData.roles.filter(function(r) {
                return (r.name || '').toLowerCase().trim() !== (oname || '').toLowerCase().trim()
                    && (r.id || '').toLowerCase().trim() !== (oid || '').toLowerCase().trim();
            });
        }
        // Clean role references from skills
        (_sd().skills || []).forEach(function(s) {
            if (s.roles) {
                s.roles = s.roles.filter(function(rid) { return rid !== oid && rid !== oname; });
            }
        });
    });
    saveAll();
    if (fbUser) debouncedSave();
    networkInitialized = false;
    showToast(orphans.length + ' orphan role' + (orphans.length !== 1 ? 's' : '') + ' cleaned: ' + orphans.map(function(o) { return o.name; }).join(', '), 'success', 4000);
    // Refresh admin view
    if (typeof renderAdminOverview === 'function') {
        var adminEl = document.getElementById('adminTabContent');
        if (adminEl && adminSubTab === 'overview') renderAdminOverview(adminEl);
    }
}
// ── Dev Velocity Stats Editor ─────────────────────────────
export function editDevStats() {
    var ds = window._blueprintDevStats;
    var modal = document.getElementById('exportModal');
    var mc = modal.querySelector('.modal-content');
    mc.innerHTML = '<div class="modal-header">'
        + '<div class="modal-header-left"><h2 class="modal-title">' + bpIcon('trending-up',20) + ' Dev Velocity Stats</h2>'
        + '<div class="modal-subtitle">Update your AI development tracking metrics</div></div>'
        + '<button class="modal-close" onclick="closeExportModal()">\u00D7</button></div>'
        + '<div style="padding:20px; display:grid; grid-template-columns:1fr 1fr; gap:14px;">'
        + _devStatsField('devstat-firstCommit', 'Project Start Date', ds.firstCommit, 'date', '2025-12-28')
        + _devStatsField('devstat-lineCount', 'Lines of Code', ds.lineCount, 'number', '43000')
        + _devStatsField('devstat-sessionsAI', 'AI Sessions', ds.sessionsAI, 'number', '48')
        + _devStatsField('devstat-avgSessionHrs', 'Avg Session (hrs)', ds.avgSessionHrs, 'number', '3.5')
        + _devStatsField('devstat-aiSubscriptionMonthly', 'AI Sub ($/mo)', ds.aiSubscriptionMonthly, 'number', '200')
        + _devStatsField('devstat-hostingMonthly', 'Hosting ($/mo)', ds.hostingMonthly, 'number', '25')
        + '</div>'
        + '<div style="padding:14px 20px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">'
        + '<span style="font-size:0.75em; color:var(--text-muted);">Saved to Firestore with your profile</span>'
        + '<div style="display:flex; gap:8px;">'
        + '<button onclick="closeExportModal()" style="padding:8px 18px; background:transparent; border:1px solid var(--border); color:var(--text-secondary); border-radius:8px; cursor:pointer; font-size:0.88em;">Cancel</button>'
        + '<button onclick="saveDevStats()" style="padding:8px 24px; background:var(--accent); color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.88em;">' + bpIcon('check',14) + ' Save</button>'
        + '</div></div>';
    history.pushState({ modal: true }, ''); modal.classList.add('active');
}
function _devStatsField(id, label, value, type, placeholder) {
    var inputType = type === 'date' ? 'date' : 'number';
    var step = type === 'number' && String(value).indexOf('.') !== -1 ? ' step="0.1"' : '';
    return '<div>'
        + '<label style="font-size:0.78em; color:var(--text-muted); display:block; margin-bottom:4px;">' + label + '</label>'
        + '<input id="' + id + '" type="' + inputType + '" value="' + escapeHtml(String(value)) + '" placeholder="' + placeholder + '"' + step
        + ' class="settings-input" style="width:100%; font-size:0.92em;">'
        + '</div>';
}

export function saveDevStats() {
    var ds = window._blueprintDevStats;
    var fc = document.getElementById('devstat-firstCommit');
    var lc = document.getElementById('devstat-lineCount');
    var sa = document.getElementById('devstat-sessionsAI');
    var ah = document.getElementById('devstat-avgSessionHrs');
    var ai = document.getElementById('devstat-aiSubscriptionMonthly');
    var ho = document.getElementById('devstat-hostingMonthly');
    if (fc) ds.firstCommit = fc.value || ds.firstCommit;
    if (lc) ds.lineCount = parseInt(lc.value) || ds.lineCount;
    if (sa) ds.sessionsAI = parseInt(sa.value) || ds.sessionsAI;
    if (ah) ds.avgSessionHrs = parseFloat(ah.value) || ds.avgSessionHrs;
    if (ai) ds.aiSubscriptionMonthly = parseInt(ai.value) || ds.aiSubscriptionMonthly;
    if (ho) ds.hostingMonthly = parseInt(ho.value) || ds.hostingMonthly;
    // Persist to Firestore
    if (fbUser && fbDb) {
        fbDb.collection('users').doc(fbUser.uid).set({ devStats: ds }, { merge: true })
            .then(function() { showToast('Dev stats saved.', 'success'); })
            .catch(function(e) { showToast('Save failed: ' + e.message, 'error'); });
    } else {
        showToast('Dev stats updated (not signed in, will not persist).', 'info');
    }
    closeExportModal();
    // Refresh admin overview
    var adminEl = document.getElementById('adminTabContent');
    if (adminEl && adminSubTab === 'overview') renderAdminOverview(adminEl);
}
export function openWorkHistoryModal(idx) {
    var job = idx >= 0 ? window._userData.workHistory[idx] : { title:'', company:'', location:'', startDate:'', endDate:'', current:false, description:'', achievements:[] };
    var isEdit = idx >= 0;
    var modal = document.getElementById('exportModal');
    var mc = modal.querySelector('.modal-content');
    
    var achHTML = (job.achievements || []).map(function(a, i) {
        return '<div style="display:flex; gap:8px; margin-bottom:8px;">'
            + '<input type="text" class="settings-input wh-ach-input" value="' + escapeHtml(a||'') + '" '
            + 'placeholder="e.g., Increased pipeline velocity 40% through process redesign" '
            + 'style="flex:1; font-size:0.88em;">'
            + '<button onclick="this.parentElement.remove()" style="background:none; border:none; color:var(--c-danger); cursor:pointer; font-size:1.1em; padding:0 4px;">\u00D7</button>'
            + '</div>';
    }).join('');
    
    mc.innerHTML = '<div class="modal-header">'
        + '<div class="modal-header-left">'
        + '<h2 class="modal-title">' + (isEdit ? 'Edit Position' : 'Add Position') + '</h2>'
        + '<p style="color:var(--c-muted); margin-top:5px;">Add your role details and key accomplishments</p>'
        + '</div>'
        + '<button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()">\u00D7</button>'
        + '</div>'
        + '<div class="modal-body" style="padding:24px; max-height:70vh; overflow-y:auto;">'
        + '<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">'
        + '<div class="settings-group"><label class="settings-label">Job Title *</label>'
        + '<input type="text" class="settings-input" id="whTitle" value="' + escapeHtml(job.title||'') + '" placeholder="VP of Strategy"></div>'
        + '<div class="settings-group"><label class="settings-label">Company *</label>'
        + '<input type="text" class="settings-input" id="whCompany" value="' + escapeHtml(job.company||'') + '" placeholder="Acme Corp"></div>'
        + '<div class="settings-group"><label class="settings-label">Location</label>'
        + '<input type="text" class="settings-input" id="whLocation" value="' + escapeHtml(job.location||'') + '" placeholder="Philadelphia, PA"></div>'
        + '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">'
        + '<div class="settings-group"><label class="settings-label">Start Date</label>'
        + '<input type="text" class="settings-input" id="whStartDate" value="' + escapeHtml(job.startDate||'') + '" placeholder="Jan 2020"></div>'
        + '<div class="settings-group"><label class="settings-label">End Date</label>'
        + '<input type="text" class="settings-input" id="whEndDate" value="' + escapeHtml(job.endDate||'') + '" placeholder="Present" ' + (job.current ? 'disabled' : '') + '></div>'
        + '</div>'
        + '</div>'
        + '<div class="settings-group" style="margin-top:4px;">'
        + '<label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.88em; color:var(--c-heading);">'
        + '<input type="checkbox" id="whCurrent" ' + (job.current ? 'checked' : '') + ' onchange="document.getElementById(\'whEndDate\').disabled=this.checked; if(this.checked) document.getElementById(\'whEndDate\').value=\'\';">'
        + ' I currently work here</label>'
        + '</div>'
        + '<div class="settings-group" style="margin-top:10px;">'
        + '<label class="settings-label">Role Description (Optional)</label>'
        + '<textarea class="settings-input" id="whDescription" rows="2" style="resize:vertical; font-size:0.88em;" '
        + 'placeholder="Brief summary of your responsibilities and scope">' + escapeHtml(job.description||'') + '</textarea>'
        + '</div>'
        + '<div class="settings-group" style="margin-top:10px;">'
        + '<label class="settings-label">Key Achievements</label>'
        + '<div class="settings-help" style="margin-bottom:8px;">Quantify where possible: revenue impact, team size, efficiency gains, etc.</div>'
        + '<div id="whAchievementsContainer">' + achHTML + '</div>'
        + '<button onclick="addAchievementInput()" style="background:none; border:1px dashed var(--c-accent-border-4); '
        + 'color:var(--c-accent); padding:6px 14px; border-radius:6px; cursor:pointer; font-size:0.82em; margin-top:4px;">'
        + '+ Add Achievement</button>'
        + '</div>'
        + '<div style="display:flex; gap:10px; margin-top:20px;">'
        + '<button onclick="saveWorkHistoryFromModal(' + idx + ')" style="background:var(--accent); color:#fff; border:none; padding:10px 24px; border-radius:8px; cursor:pointer; font-weight:600;">'
        + (isEdit ? 'Save Changes' : 'Add Position') + '</button>'
        + '<button onclick="closeExportModal()" style="background:transparent; color:var(--c-muted); border:1px solid var(--c-border-solid); padding:10px 20px; border-radius:8px; cursor:pointer;">'
        + 'Cancel</button>'
        + '</div></div>';
    
    modal.style.display = 'flex';
}

export function addAchievementInput() {
    var container = document.getElementById('whAchievementsContainer');
    var div = document.createElement('div');
    div.style.cssText = 'display:flex; gap:8px; margin-bottom:8px;';
    div.innerHTML = '<input type="text" class="settings-input wh-ach-input" placeholder="e.g., Led $2M digital transformation initiative" style="flex:1; font-size:0.88em;">'
        + '<button onclick="this.parentElement.remove()" style="background:none; border:none; color:var(--c-danger); cursor:pointer; font-size:1.1em; padding:0 4px;">\u00D7</button>';
    container.appendChild(div);
    var newInput = div.querySelector('input');
    if (newInput) newInput.focus();
}

export function saveWorkHistoryFromModal(idx) {
    if (readOnlyGuard()) return;
    var title = document.getElementById('whTitle').value.trim();
    var company = document.getElementById('whCompany').value.trim();
    if (!title || !company) { showToast('Title and company are required.', 'warning'); return; }
    
    var achievements = [];
    document.querySelectorAll('.wh-ach-input').forEach(function(inp) {
        var v = inp.value.trim();
        if (v) achievements.push(v);
    });
    
    var entry = {
        id: idx >= 0 ? (window._userData.workHistory[idx].id || 'wh-' + Date.now()) : 'wh-' + Date.now(),
        title: title,
        company: company,
        location: document.getElementById('whLocation').value.trim(),
        startDate: document.getElementById('whStartDate').value.trim(),
        endDate: document.getElementById('whEndDate').value.trim(),
        current: document.getElementById('whCurrent').checked,
        description: document.getElementById('whDescription').value.trim(),
        achievements: achievements
    };
    
    if (idx >= 0) {
        window._userData.workHistory[idx] = entry;
    } else {
        window._userData.workHistory.unshift(entry); // newest first
    }
    
    closeExportModal();
    saveAll();
    refreshExperienceContent();
    showToast(idx >= 0 ? 'Position updated.' : 'Position added.', 'success');
}

// --- Education CRUD ---
export function addEducationItem() {
    if (readOnlyGuard()) return;
    openEducationModal(-1);
}
export function editEducationItem(idx) {
    if (readOnlyGuard()) return;
    openEducationModal(idx);
}
export function removeEducationItem(idx) {
    if (readOnlyGuard()) return;
    if (!confirm('Remove this education entry?')) return;
    window._userData.education.splice(idx, 1);
    saveAll();
    refreshExperienceContent();
}

export function openEducationModal(idx) {
    var ed = idx >= 0 ? window._userData.education[idx] : { school:'', degree:'', field:'', year:'', type:'degree', startYear:'', endYear:'', description:'', issuingAuthority:'', linkedCredentials:[], currentlyEnrolled:false };
    var isEdit = idx >= 0;
    var modal = document.getElementById('exportModal');
    var mc = modal.querySelector('.modal-content');
    
    // Education type configurations
    var edTypes = {
        degree:   { label:'Degree',         icon:'🎓', instLabel:'School / University',    credLabel:'Degree',           credPlaceholder:'B.S., M.B.A., Ph.D.', fieldLabel:'Field of Study',  fieldPlaceholder:'Business Administration', showAuthority:false, showDuration:true,  showEnrolled:true  },
        cert:     { label:'Certificate',     icon:'📜', instLabel:'Issuing Org / School',   credLabel:'Certificate / License', credPlaceholder:'Private Pilot, CDL-A', fieldLabel:'Specialization',  fieldPlaceholder:'Aviation, Cybersecurity', showAuthority:true,  showDuration:true,  showEnrolled:false },
        trade:    { label:'Trade / Vocational', icon:'🔧', instLabel:'School / Program',    credLabel:'Credential',       credPlaceholder:'Journeyman, Certification', fieldLabel:'Trade / Focus', fieldPlaceholder:'Welding, Electrical, HVAC', showAuthority:false, showDuration:true,  showEnrolled:true  },
        bootcamp: { label:'Bootcamp',        icon:'⚡', instLabel:'Program / Provider',     credLabel:'Certificate',      credPlaceholder:'Certificate of Completion', fieldLabel:'Focus Area',      fieldPlaceholder:'Full-Stack Development',   showAuthority:false, showDuration:true,  showEnrolled:true  },
        profdev:  { label:'Professional Dev', icon:'📊', instLabel:'Organization',           credLabel:'Completion',       credPlaceholder:'Executive Certificate',     fieldLabel:'Focus Area',      fieldPlaceholder:'Leadership, Finance',      showAuthority:false, showDuration:false, showEnrolled:false },
        military: { label:'Military',        icon:'🎖️', instLabel:'Branch / School',        credLabel:'Qualification',    credPlaceholder:'MOS, Rating, NEC',          fieldLabel:'Specialty',        fieldPlaceholder:'Infantry, Aviation, Intel', showAuthority:false, showDuration:true,  showEnrolled:true  }
    };
    
    var currentType = ed.type || 'degree';
    
    // Build type pills
    var pillsHtml = '<div id="edTypePills" style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:20px;">';
    Object.keys(edTypes).forEach(function(key) {
        var t = edTypes[key];
        var isActive = key === currentType;
        pillsHtml += '<button onclick="edSwitchType(\'' + key + '\')" data-ed-type="' + key + '" '
            + 'style="padding:6px 14px; border-radius:20px; font-size:0.78em; font-weight:600; cursor:pointer; transition:all 0.15s; '
            + 'border:1px solid ' + (isActive ? 'var(--accent)' : 'var(--c-border-solid)') + '; '
            + 'background:' + (isActive ? 'var(--accent)' : 'transparent') + '; '
            + 'color:' + (isActive ? '#fff' : 'var(--c-muted)') + ';">'
            + t.icon + ' ' + t.label + '</button>';
    });
    pillsHtml += '</div>';
    
    var cfg = edTypes[currentType];
    
    // Build credential link options from existing certifications
    var certOptions = '<option value="">— None —</option>';
    (window._userData.certifications || []).forEach(function(c, ci) {
        var name = c.name + (c.abbr ? ' (' + c.abbr + ')' : '');
        var isLinked = (ed.linkedCredentials || []).indexOf(ci) >= 0 || (ed.linkedCredentials || []).indexOf(c.name) >= 0;
        certOptions += '<option value="' + ci + '"' + (isLinked ? ' selected' : '') + '>' + escapeHtml(name) + '</option>';
    });
    
    mc.innerHTML = '<div class="modal-header">'
        + '<div class="modal-header-left">'
        + '<h2 class="modal-title">' + (isEdit ? 'Edit Education' : 'Add Education') + '</h2>'
        + '<p style="color:var(--c-muted); margin-top:4px; font-size:0.85em;">All learning counts — degrees, licenses, trades, bootcamps, military</p>'
        + '</div>'
        + '<button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()">\u00D7</button>'
        + '</div>'
        + '<div class="modal-body" style="padding:24px; max-height:75vh; overflow-y:auto;">'
        
        // Type pills
        + pillsHtml
        
        // Row 1: Institution + Credential
        + '<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">'
        + '<div class="settings-group"><label class="settings-label" id="edInstLabel">' + cfg.instLabel + '</label>'
        + '<input type="text" class="settings-input" id="edSchool" value="' + escapeHtml(ed.school||'') + '" placeholder=""></div>'
        + '<div class="settings-group"><label class="settings-label" id="edCredLabel">' + cfg.credLabel + '</label>'
        + '<input type="text" class="settings-input" id="edDegree" value="' + escapeHtml(ed.degree||'') + '" placeholder="' + cfg.credPlaceholder + '"></div>'
        + '</div>'
        
        // Row 2: Field + Authority (conditional)
        + '<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:14px;">'
        + '<div class="settings-group"><label class="settings-label" id="edFieldLabel">' + cfg.fieldLabel + '</label>'
        + '<input type="text" class="settings-input" id="edField" value="' + escapeHtml(ed.field||'') + '" placeholder="' + cfg.fieldPlaceholder + '"></div>'
        + '<div class="settings-group" id="edAuthorityGroup" style="' + (cfg.showAuthority ? '' : 'display:none;') + '">'
        + '<label class="settings-label">Issuing Authority</label>'
        + '<input type="text" class="settings-input" id="edAuthority" value="' + escapeHtml(ed.issuingAuthority||'') + '" placeholder="FAA, State Board, etc."></div>'
        + '<div class="settings-group" id="edYearSingleGroup" style="' + (cfg.showAuthority ? 'display:none;' : '') + '">'
        + '<label class="settings-label">Year</label>'
        + '<input type="text" class="settings-input" id="edYearSingle" value="' + escapeHtml(ed.year||ed.endYear||'') + '" placeholder="2024"></div>'
        + '</div>'
        
        // Row 3: Duration (conditional)
        + '<div id="edDurationRow" style="display:' + (cfg.showDuration ? 'grid' : 'none') + '; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-top:14px;">'
        + '<div class="settings-group"><label class="settings-label">Start Year</label>'
        + '<input type="text" class="settings-input" id="edStartYear" value="' + escapeHtml(ed.startYear||'') + '" placeholder="2004"></div>'
        + '<div class="settings-group"><label class="settings-label">End Year</label>'
        + '<input type="text" class="settings-input" id="edEndYear" value="' + escapeHtml(ed.endYear||ed.year||'') + '" placeholder="2006"></div>'
        + '<div class="settings-group" style="display:flex; align-items:flex-end;">'
        + '<label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.82em; color:var(--c-muted); padding-bottom:10px;" id="edEnrolledLabel">'
        + '<input type="checkbox" id="edEnrolled" ' + (ed.currentlyEnrolled ? 'checked' : '') + ' style="accent-color:var(--accent);"> Currently enrolled</label></div>'
        + '</div>'
        
        // Row 4: Description (optional, collapsible)
        + '<div style="margin-top:14px;">'
        + '<button onclick="var d=document.getElementById(\'edDescGroup\'); d.style.display=d.style.display===\'none\'?\'block\':\'none\';" '
        + 'style="background:none; border:none; color:var(--c-accent); font-size:0.82em; cursor:pointer; padding:0;">'
        + '+ Add description or notes</button>'
        + '<div id="edDescGroup" class="settings-group" style="display:' + (ed.description ? 'block' : 'none') + '; margin-top:8px;">'
        + '<textarea class="settings-input" id="edDescription" rows="2" style="resize:vertical; min-height:50px;" placeholder="Key outcomes, honors, relevant details...">' + escapeHtml(ed.description||'') + '</textarea>'
        + '</div></div>'
        
        // Row 5: Linked credentials
        + '<div style="margin-top:16px; padding-top:14px; border-top:1px solid var(--c-border-faint);">'
        + '<label class="settings-label" style="margin-bottom:6px;">Resulted in Credential <span style="font-weight:400; color:var(--c-faint); font-size:0.88em;">(optional)</span></label>'
        + '<div style="display:flex; gap:8px; align-items:center;">'
        + '<select class="settings-select" id="edLinkedCred" style="flex:1; font-size:0.85em;">' + certOptions + '</select>'
        + '<button onclick="edAddNewCred()" style="padding:6px 12px; background:var(--c-accent-bg-5a); color:var(--c-accent-deep); border:1px solid var(--c-accent-border-4); border-radius:6px; cursor:pointer; font-size:0.78em; white-space:nowrap;">+ New</button>'
        + '</div>'
        + '<div id="edLinkedCredTags" style="display:flex; flex-wrap:wrap; gap:4px; margin-top:8px;"></div>'
        + '</div>'
        
        // Save/Cancel
        + '<div style="display:flex; gap:10px; margin-top:20px;">'
        + '<button onclick="saveEducationFromModal(' + idx + ')" style="background:var(--accent); color:#fff; border:none; padding:10px 24px; border-radius:8px; cursor:pointer; font-weight:600;">'
        + (isEdit ? 'Save' : 'Add') + '</button>'
        + '<button onclick="closeExportModal()" style="background:transparent; color:var(--c-muted); border:1px solid var(--c-border-solid); padding:10px 20px; border-radius:8px; cursor:pointer;">Cancel</button>'
        + '</div></div>';
    
    modal.style.display = 'flex';
    
    // Store type state for switch function
    window._edCurrentType = currentType;
    window._edTypeConfigs = edTypes;
    window._edLinkedCreds = (ed.linkedCredentials || []).slice();
    edRenderLinkedCredTags();
}

export function edSwitchType(newType) {
    window._edCurrentType = newType;
    var cfg = window._edTypeConfigs[newType];
    if (!cfg) return;
    
    // Update pill styling
    document.querySelectorAll('#edTypePills button').forEach(function(btn) {
        var isActive = btn.getAttribute('data-ed-type') === newType;
        btn.style.background = isActive ? 'var(--accent)' : 'transparent';
        btn.style.color = isActive ? '#fff' : 'var(--c-muted)';
        btn.style.borderColor = isActive ? 'var(--accent)' : 'var(--c-border-solid)';
    });
    
    // Update labels
    var instLabel = document.getElementById('edInstLabel');
    var credLabel = document.getElementById('edCredLabel');
    var fieldLabel = document.getElementById('edFieldLabel');
    if (instLabel) instLabel.textContent = cfg.instLabel;
    if (credLabel) credLabel.textContent = cfg.credLabel;
    if (fieldLabel) fieldLabel.textContent = cfg.fieldLabel;
    
    // Update placeholders
    var degreeInput = document.getElementById('edDegree');
    var fieldInput = document.getElementById('edField');
    if (degreeInput) degreeInput.placeholder = cfg.credPlaceholder;
    if (fieldInput) fieldInput.placeholder = cfg.fieldPlaceholder;
    
    // Show/hide authority vs year-single
    var authGroup = document.getElementById('edAuthorityGroup');
    var yearSingle = document.getElementById('edYearSingleGroup');
    if (authGroup) authGroup.style.display = cfg.showAuthority ? '' : 'none';
    if (yearSingle) yearSingle.style.display = cfg.showAuthority ? 'none' : '';
    
    // Show/hide duration row
    var durRow = document.getElementById('edDurationRow');
    if (durRow) durRow.style.display = cfg.showDuration ? 'grid' : 'none';
}
export function edAddNewCred() {
    // Close education modal, open cert modal, with note to come back
    closeExportModal();
    showToast('Add the credential first, then return to link it to this education entry.', 'info', 5000);
    addCertItem();
}
export function edRenderLinkedCredTags() {
    var container = document.getElementById('edLinkedCredTags');
    if (!container) return;
    var creds = window._edLinkedCreds || [];
    if (creds.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = creds.map(function(ci, i) {
        var cert = window._userData.certifications[ci];
        var name = cert ? (cert.name + (cert.abbr ? ' (' + cert.abbr + ')' : '')) : 'Credential #' + ci;
        return '<span style="display:inline-flex; align-items:center; gap:4px; padding:3px 10px; background:var(--c-accent-bg-5a); '
            + 'color:var(--c-accent-deep); border-radius:12px; font-size:0.78em; font-weight:600;">'
            + '\uD83D\uDD17 ' + escapeHtml(name)
            + ' <button onclick="edRemoveLinkedCred(' + i + ')" style="background:none; border:none; cursor:pointer; color:inherit; font-size:1em; padding:0 2px;">\u00D7</button></span>';
    }).join('');
}
export function edRemoveLinkedCred(i) {
    (window._edLinkedCreds || []).splice(i, 1);
    edRenderLinkedCredTags();
}
export function saveEducationFromModal(idx) {
    if (readOnlyGuard()) return;
    
    // Collect linked credential from dropdown if selected
    var linkedCreds = (window._edLinkedCreds || []).slice();
    var credSelect = document.getElementById('edLinkedCred');
    if (credSelect && credSelect.value !== '') {
        var ci = parseInt(credSelect.value);
        if (!isNaN(ci) && linkedCreds.indexOf(ci) < 0) linkedCreds.push(ci);
    }
    
    var edType = window._edCurrentType || 'degree';
    var cfg = (window._edTypeConfigs || {})[edType] || {};
    
    var entry = {
        id: idx >= 0 ? (window._userData.education[idx].id || 'ed-' + Date.now()) : 'ed-' + Date.now(),
        type: edType,
        school: (document.getElementById('edSchool')?.value || '').trim(),
        degree: (document.getElementById('edDegree')?.value || '').trim(),
        field: (document.getElementById('edField')?.value || '').trim(),
        // Year: prefer endYear for backward compat, fallback to single year
        year: (document.getElementById('edEndYear')?.value || document.getElementById('edYearSingle')?.value || '').trim(),
        startYear: (document.getElementById('edStartYear')?.value || '').trim(),
        endYear: (document.getElementById('edEndYear')?.value || document.getElementById('edYearSingle')?.value || '').trim(),
        description: (document.getElementById('edDescription')?.value || '').trim(),
        issuingAuthority: cfg.showAuthority ? (document.getElementById('edAuthority')?.value || '').trim() : '',
        currentlyEnrolled: document.getElementById('edEnrolled')?.checked || false,
        linkedCredentials: linkedCreds
    };
    if (!entry.school && !entry.degree) { showToast('Add at least an institution or credential.', 'warning'); return; }
    
    if (idx >= 0) { window._userData.education[idx] = entry; }
    else { window._userData.education.push(entry); }
    
    closeExportModal();
    saveAll();
    refreshExperienceContent();
    showToast(idx >= 0 ? 'Education updated.' : 'Education added.', 'success');
}

// --- Certifications CRUD ---
export function addCertItem() {
    if (readOnlyGuard()) return;
    openCertModal(-1);
}
export function editCertItem(idx) {
    if (readOnlyGuard()) return;
    openCertModal(idx);
}
export function removeCertItem(idx) {
    if (readOnlyGuard()) return;
    if (!confirm('Remove this certification?')) return;
    window._userData.certifications.splice(idx, 1);
    saveAll();
    refreshExperienceContent();
}

export function openCertModal(idx) {
    var cert = idx >= 0 ? window._userData.certifications[idx] : { name:'', abbr:'', issuer:'', year:'', type:'Certification', linkedSkills:[], tier:1, libraryMatch:null };
    var isEdit = idx >= 0;
    var modal = document.getElementById('exportModal');
    var mc = modal.querySelector('.modal-content');
    
    // Build linked skills display
    var linkedSkills = cert.linkedSkills || [];
    var linkedHTML = linkedSkills.map(function(sn) {
        return '<span style="display:inline-flex; align-items:center; gap:4px; padding:3px 10px; background:var(--c-purple-bg-1); '
            + 'color:var(--c-purple-light); border-radius:12px; font-size:0.82em; margin:2px 4px 2px 0;">'
            + escapeHtml(sn) + ' <button onclick="removeCertLinkedSkill(this, \'' + escapeHtml(sn).replace(/'/g,"&#39;") + '\')" style="background:none; border:none; cursor:pointer; color:inherit; font-size:1em; padding:0 2px;">\u00D7</button></span>';
    }).join('');
    
    // Build skill suggestion datalist from profile skills
    var skillOptions = (_sd().skills || []).map(function(s) {
        return '<option value="' + s.name.replace(/"/g,'&quot;') + '">';
    }).join('');
    
    // Determine tier display
    var tierLevel = cert.tier || 1;
    var tierLabel = tierLevel >= 2 ? 'Advanced' : 'Proficient';
    var tierColor = tierLevel >= 2 ? '#f59e0b' : '#10b981';
    
    mc.innerHTML = '<div class="modal-header">'
        + '<div class="modal-header-left">'
        + '<h2 class="modal-title">' + (isEdit ? 'Edit Credential' : 'Add Credential') + '</h2>'
        + '<p style="color:var(--c-muted); margin-top:4px; font-size:0.85em;">Search the library or enter manually</p>'
        + '</div>'
        + '<button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()">\u00D7</button>'
        + '</div>'
        + '<div class="modal-body" style="padding:24px; max-height:75vh; overflow-y:auto;">'
        
        // Library search
        + '<div class="settings-group" style="margin-bottom:16px; position:relative;">'
        + '<label class="settings-label">\uD83D\uDD0D Search Credential Library <span style="font-weight:400; color:var(--c-faint); font-size:0.88em;">(191 credentials)</span></label>'
        + '<input type="text" class="settings-input" id="certLibrarySearch" '
        + 'placeholder="Type name, abbreviation, or category..." '
        + 'oninput="onCertLibrarySearch()" autocomplete="off" '
        + 'style="font-size:0.9em;"'
        + (isEdit ? ' value="' + escapeHtml(cert.name||'') + '"' : '') + '>'
        + '<div id="certSearchResults" style="display:none; position:absolute; top:100%; left:0; right:0; z-index:100; max-height:240px; overflow-y:auto; '
        + 'background:var(--c-bg-solid-alt); border:1px solid var(--c-border-strong); border-radius:8px; margin-top:4px; '
        + 'box-shadow:0 8px 24px rgba(0,0,0,0.3);"></div>'
        + '</div>'
        
        // Tier badge
        + '<div id="certTierBadge" style="margin-bottom:14px;' + (isEdit && cert.tier ? '' : ' display:none;') + '">'
        + '<span style="font-size:0.78em; padding:3px 10px; border-radius:10px; font-weight:600; background:rgba(' + (tierLevel >= 2 ? '245,158,11' : '16,185,129') + ',0.12); color:' + tierColor + ';">'
        + (tierLevel >= 2 ? '\u2B50 Tier 2: Advanced' : '\u2705 Tier 1: Proficient') + ' floor for linked skills</span>'
        + '</div>'
        
        // Manual fields
        + '<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">'
        + '<div class="settings-group" style="grid-column:1/-1;"><label class="settings-label">Credential Name *</label>'
        + '<input type="text" class="settings-input" id="certName" value="' + escapeHtml(cert.name||'') + '" placeholder="Full credential name"></div>'
        + '<div class="settings-group"><label class="settings-label">Abbreviation</label>'
        + '<input type="text" class="settings-input" id="certAbbr" value="' + escapeHtml(cert.abbr||'') + '" placeholder="PMP, CFA, CDL-A" style="font-size:0.9em;"></div>'
        + '<div class="settings-group"><label class="settings-label">Issuing Organization</label>'
        + '<input type="text" class="settings-input" id="certIssuer" value="' + escapeHtml(cert.issuer||'') + '" placeholder="PMI, SHRM, AWS, etc."></div>'
        + '<div class="settings-group"><label class="settings-label">Type</label>'
        + '<select class="settings-select" id="certType" style="font-size:0.88em;">'
        + ['Certification','License','Degree','Rating','Endorsement','Credential','Certificate','Commission'].map(function(t) {
            return '<option value="' + t + '"' + ((cert.type || 'Certification') === t ? ' selected' : '') + '>' + t + '</option>';
        }).join('')
        + '</select></div>'
        + '<div class="settings-group"><label class="settings-label">Year Obtained</label>'
        + '<input type="text" class="settings-input" id="certYear" value="' + escapeHtml(cert.year||'') + '" placeholder="2023"></div>'
        + '</div>'
        
        // Linked skills
        + '<div class="settings-group" style="margin-top:14px;">'
        + '<label class="settings-label">\uD83D\uDD17 Linked Skills</label>'
        + '<div class="settings-help" style="margin-bottom:8px;">Skills linked to this credential receive a <strong id="certFloorLabel">' + tierLabel + '</strong> evidence floor for market valuation.</div>'
        + '<div id="certLinkedSkillsContainer" style="display:flex; flex-wrap:wrap; margin-bottom:8px;">' + linkedHTML + '</div>'
        + '<div style="display:flex; gap:8px;">'
        + '<input type="text" class="settings-input" id="certLinkSkillInput" list="certSkillSuggestions" placeholder="Type skill name..." style="flex:1; font-size:0.88em;">'
        + '<datalist id="certSkillSuggestions">' + skillOptions + '</datalist>'
        + '<button onclick="addCertLinkedSkill()" style="padding:6px 14px; background:var(--c-purple-bg-2a); color:var(--c-purple-light); border:1px solid var(--c-purple-border-1); border-radius:6px; cursor:pointer; font-size:0.82em; white-space:nowrap;">+ Link</button>'
        + '</div></div>'
        
        // Save/Cancel
        + '<div style="display:flex; gap:10px; margin-top:20px;">'
        + '<button onclick="saveCertFromModal(' + idx + ')" style="background:var(--accent); color:#fff; border:none; padding:10px 24px; border-radius:8px; cursor:pointer; font-weight:600;">'
        + (isEdit ? 'Save' : 'Add Credential') + '</button>'
        + '<button onclick="closeExportModal()" style="background:transparent; color:var(--c-muted); border:1px solid var(--c-border-solid); padding:10px 20px; border-radius:8px; cursor:pointer;">Cancel</button>'
        + '</div></div>';
    
    modal.style.display = 'flex';
    initCertLinkedSkills(linkedSkills);
    window._selectedLibCert = cert.libraryMatch || null;
}

// Library search handler
export function onCertLibrarySearch() {
    var input = document.getElementById('certLibrarySearch');
    var results = document.getElementById('certSearchResults');
    if (!input || !results) return;
    
    var query = input.value.trim();
    if (query.length < 2) { results.style.display = 'none'; return; }
    
    var matches = window.searchCertLibrary(query);
    if (matches.length === 0) {
        results.innerHTML = '<div style="padding:12px 16px; color:var(--c-faint); font-size:0.85em;">No matches. Enter the credential manually below.</div>';
        results.style.display = 'block';
        return;
    }
    
    var html = '';
    matches.forEach(function(c) {
        var tierBg = c.tier >= 2 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)';
        var tierColor = c.tier >= 2 ? '#f59e0b' : '#10b981';
        var tierTag = c.tier >= 2 ? 'ADV' : 'PRO';
        
        html += '<div onclick="selectCertFromLibrary(\'' + escapeHtml(c.abbr).replace(/'/g,"&#39;") + '\')" '
            + 'style="padding:10px 16px; cursor:pointer; border-bottom:1px solid var(--c-surface-3a); '
            + 'transition:background 0.1s;" '
            + 'onmouseover="this.style.background=\'var(--c-surface-4a)\'" '
            + 'onmouseout="this.style.background=\'transparent\'">'
            + '<div style="display:flex; justify-content:space-between; align-items:center;">'
            + '<div>'
            + '<div style="font-weight:600; color:var(--c-text-alt); font-size:0.88em;">'
            + escapeHtml(c.name) + ' <span style="color:var(--c-accent); font-size:0.85em;">(' + escapeHtml(c.abbr) + ')</span></div>'
            + '<div style="font-size:0.78em; color:var(--c-muted);">' + escapeHtml(c.category) + ' \u00B7 ' + escapeHtml(c.type)
            + (c.skills ? ' \u00B7 ' + c.skills.length + ' skill links' : '') + '</div>'
            + '</div>'
            + '<span style="font-size:0.7em; padding:2px 8px; border-radius:8px; background:' + tierBg + '; color:' + tierColor + '; font-weight:700;">' + tierTag + '</span>'
            + '</div></div>';
    });
    
    results.innerHTML = html;
    results.style.display = 'block';
}
export function selectCertFromLibrary(abbr) {
    var cert = findCertInLibrary(abbr);
    if (!cert) return;
    
    document.getElementById('certName').value = cert.name;
    document.getElementById('certAbbr').value = cert.abbr;
    document.getElementById('certLibrarySearch').value = cert.name;
    
    var typeSelect = document.getElementById('certType');
    if (typeSelect) {
        var opts = Array.from(typeSelect.options);
        var match = opts.find(function(o) { return o.value === cert.type; });
        if (match) typeSelect.value = cert.type;
    }
    
    // Update tier badge
    var badge = document.getElementById('certTierBadge');
    var floorLabel = document.getElementById('certFloorLabel');
    if (badge) {
        var tColor = cert.tier >= 2 ? '#f59e0b' : '#10b981';
        var tBg = cert.tier >= 2 ? '245,158,11' : '16,185,129';
        badge.style.display = '';
        badge.innerHTML = '<span style="font-size:0.78em; padding:3px 10px; border-radius:10px; font-weight:600; background:rgba(' + tBg + ',0.12); color:' + tColor + ';">'
            + (cert.tier >= 2 ? '\u2B50 Tier 2: Advanced' : '\u2705 Tier 1: Proficient') + ' floor for linked skills</span>'
            + (cert.skills ? ' <span style="font-size:0.72em; color:var(--c-muted);">\u00B7 ' + cert.skills.length + ' curated skill links</span>' : '');
    }
    if (floorLabel) floorLabel.textContent = cert.tier >= 2 ? 'Advanced' : 'Proficient';
    
    // Auto-suggest skill links
    var associations = getCertSkillAssociations(cert);
    if (associations.length > 0) {
        window._certLinkedSkills = [];
        var container = document.getElementById('certLinkedSkillsContainer');
        container.innerHTML = '';
        associations.forEach(function(sn) {
            window._certLinkedSkills.push(sn);
            var span = document.createElement('span');
            span.style.cssText = 'display:inline-flex; align-items:center; gap:4px; padding:3px 10px; background:var(--c-purple-bg-1); color:var(--c-purple-light); border-radius:12px; font-size:0.82em; margin:2px 4px 2px 0;';
            span.innerHTML = escapeHtml(sn) + ' <button onclick="removeCertLinkedSkill(this, \'' + sn.replace(/'/g,"\\'") + '\')" style="background:none; border:none; cursor:pointer; color:inherit; font-size:1em; padding:0 2px;">\u00D7</button>';
            container.appendChild(span);
        });
    }
    
    window._selectedLibCert = cert;
    document.getElementById('certSearchResults').style.display = 'none';
}
// Helper: track linked skills in modal state
window._certLinkedSkills = [];
function initCertLinkedSkills(skills) { window._certLinkedSkills = skills.slice(); }

export function addCertLinkedSkill() {
    var input = document.getElementById('certLinkSkillInput');
    var name = input.value.trim();
    if (!name) return;
    if (window._certLinkedSkills.indexOf(name) >= 0) { input.value = ''; return; }
    window._certLinkedSkills.push(name);
    
    var container = document.getElementById('certLinkedSkillsContainer');
    var span = document.createElement('span');
    span.style.cssText = 'display:inline-flex; align-items:center; gap:4px; padding:3px 10px; background:var(--c-purple-bg-1); color:var(--c-purple-light); border-radius:12px; font-size:0.82em; margin:2px 4px 2px 0;';
    span.innerHTML = escapeHtml(name) + ' <button onclick="removeCertLinkedSkill(this, \'' + escapeHtml(name).replace(/'/g,"\\'") + '\')" style="background:none; border:none; cursor:pointer; color:inherit; font-size:1em; padding:0 2px;">\u00D7</button>';
    container.appendChild(span);
    input.value = '';
    input.focus();
}
export function removeCertLinkedSkill(btn, name) {
    var idx = window._certLinkedSkills.indexOf(name);
    if (idx >= 0) window._certLinkedSkills.splice(idx, 1);
    btn.parentElement.remove();
}
export function saveCertFromModal(idx) {
    if (readOnlyGuard()) return;
    var libCert = window._selectedLibCert || null;
    var entry = {
        id: idx >= 0 ? (window._userData.certifications[idx].id || 'cert-' + Date.now()) : 'cert-' + Date.now(),
        name: document.getElementById('certName').value.trim(),
        abbr: (document.getElementById('certAbbr') || {}).value ? document.getElementById('certAbbr').value.trim() : '',
        issuer: document.getElementById('certIssuer').value.trim(),
        type: (document.getElementById('certType') || {}).value || 'Certification',
        year: document.getElementById('certYear').value.trim(),
        linkedSkills: window._certLinkedSkills ? window._certLinkedSkills.slice() : [],
        tier: libCert ? libCert.tier : 1,
        libraryMatch: libCert ? libCert.abbr : null
    };
    if (!entry.name) { showToast('Certification name is required.', 'warning'); return; }
    
    if (idx >= 0) { window._userData.certifications[idx] = entry; }
    else { window._userData.certifications.push(entry); }
    
    // Auto-add and bump skills from cert associations
    var certFloorLevel = entry.tier >= 2 ? 'Advanced' : 'Proficient';
    var certFloorVal = proficiencyValue(certFloorLevel);
    var allLinkedSkills = entry.linkedSkills.slice();
    
    // Also include library curated skills if not already in linked list
    if (libCert && libCert.skills) {
        libCert.skills.forEach(function(sn) {
            if (allLinkedSkills.indexOf(sn) < 0) allLinkedSkills.push(sn);
        });
    }
    
    var added = [];
    var bumped = [];
    var defaultRoles = (window._userData.roles || []).map(function(r) { return r.id; });
    
    allLinkedSkills.forEach(function(skillName) {
        var existing = window._userData.skills.find(function(s) { return s.name.toLowerCase() === skillName.toLowerCase(); });
        var existingSD = (_sd().skills || []).find(function(s) { return s.name.toLowerCase() === skillName.toLowerCase(); });
        
        if (!existing) {
            // Skill not in profile: add it at the cert floor level
            var newSkill = {
                name: skillName,
                category: 'unique',
                level: certFloorLevel,
                roles: defaultRoles,
                key: false,
                addedFrom: 'certification',
                certSource: entry.name
            };
            window._userData.skills.push(newSkill);
            _sd().skills.push(newSkill);
            if (typeof registerInSkillLibrary === 'function') registerInSkillLibrary(skillName, 'unique');
            added.push(skillName);
        } else {
            // Skill exists: check if it needs a bump
            var currentVal = proficiencyValue(existing.level);
            if (currentVal < certFloorVal) {
                var oldLevel = existing.level;
                existing.level = certFloorLevel;
                if (existingSD) existingSD.level = certFloorLevel;
                bumped.push(skillName + ' (' + oldLevel + ' \u2192 ' + certFloorLevel + ')');
            }
        }
    });
    
    closeExportModal();
    saveAll();
    rescoreAllJobs();
    refreshAllViews();
    refreshExperienceContent();
    
    // Build notification
    var msgs = [];
    if (idx >= 0) {
        msgs.push('\uD83C\uDFC5 Credential updated: ' + entry.name);
    } else {
        msgs.push('\uD83C\uDFC5 Credential added: ' + entry.name);
    }
    
    if (added.length > 0) {
        msgs.push('\u2795 Added ' + added.length + ' skill' + (added.length > 1 ? 's' : '') + ': ' + added.join(', '));
    }
    if (bumped.length > 0) {
        msgs.push('\u2B06 Bumped ' + bumped.length + ' skill' + (bumped.length > 1 ? 's' : '') + ' to ' + certFloorLevel + ': ' + bumped.join(', '));
    }
    
    if (added.length > 0 || bumped.length > 0) {
        // Show detailed notification modal
        showCertSkillNotification(entry, added, bumped, certFloorLevel);
    } else {
        showToast(msgs[0], 'success');
    }
}

export function showCertSkillNotification(cert, added, bumped, floorLevel) {
    var modal = document.getElementById('exportModal');
    var mc = modal.querySelector('.modal-content');
    
    var tierColor = cert.tier >= 2 ? '#f59e0b' : '#10b981';
    var tierLabel = cert.tier >= 2 ? 'Tier 2 (Advanced)' : 'Tier 1 (Proficient)';
    
    var html = '<div class="modal-header">'
        + '<div class="modal-header-left">'
        + '<h2 class="modal-title">\uD83C\uDFC5 Credential Impact</h2>'
        + '<p style="color:var(--c-muted); margin-top:4px; font-size:0.85em;">' + cert.name + (cert.abbr ? ' (' + cert.abbr + ')' : '') + '</p>'
        + '</div>'
        + '<button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()">\u00D7</button>'
        + '</div>'
        + '<div class="modal-body" style="padding:24px;">';
    
    // Summary
    html += '<div style="background:var(--c-green-bg-2a); border:1px solid var(--c-green-bg-6); border-radius:10px; padding:16px; margin-bottom:16px;">'
        + '<div style="font-weight:700; color:' + tierColor + '; font-size:0.9em; margin-bottom:8px;">' + tierLabel + ' \u2014 ' + floorLevel + ' floor applied</div>'
        + '<div style="color:var(--c-label); font-size:0.85em; line-height:1.5;">'
        + 'This credential proves competence in the skills below. Evidence points and market valuation have been updated automatically.'
        + '</div></div>';
    
    // Added skills
    if (added.length > 0) {
        html += '<div style="margin-bottom:14px;">'
            + '<div style="font-weight:600; color:var(--c-success); font-size:0.85em; margin-bottom:8px;">\u2795 Skills Added to Profile (' + added.length + ')</div>';
        added.forEach(function(sn) {
            html += '<div style="padding:6px 12px; margin-bottom:4px; background:var(--c-green-bg-1a); border-radius:6px; font-size:0.85em; color:var(--c-text-alt);">'
                + sn + ' <span style="color:' + tierColor + '; font-size:0.85em;">\u2192 ' + floorLevel + '</span></div>';
        });
        html += '</div>';
    }
    
    // Bumped skills
    if (bumped.length > 0) {
        html += '<div style="margin-bottom:14px;">'
            + '<div style="font-weight:600; color:var(--c-accent); font-size:0.85em; margin-bottom:8px;">\u2B06 Skills Upgraded (' + bumped.length + ')</div>';
        bumped.forEach(function(desc) {
            html += '<div style="padding:6px 12px; margin-bottom:4px; background:var(--c-accent-bg-2d); border-radius:6px; font-size:0.85em; color:var(--c-text-alt);">'
                + desc + '</div>';
        });
        html += '</div>';
    }
    
    html += '<div style="text-align:center; margin-top:18px;">'
        + '<button onclick="closeExportModal()" style="padding:10px 28px; background:var(--accent); color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Got It</button>'
        + '</div></div>';
    
    mc.innerHTML = html;
    modal.style.display = 'flex';
}
// Expose experience functions to global scope
export function renderJobPreferences() {
    if (!window._userData || !window._userData.initialized) return '<div style="padding:40px; text-align:center; color:var(--text-muted);">Loading...</div>';
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
                    <option value="Entry" ${window._userData.preferences.seniorityLevel === 'Entry' ? 'selected' : ''}>Entry Level</option>
                    <option value="Mid" ${window._userData.preferences.seniorityLevel === 'Mid' ? 'selected' : ''}>Mid Level</option>
                    <option value="Senior" ${window._userData.preferences.seniorityLevel === 'Senior' ? 'selected' : ''}>Senior Level</option>
                    <option value="Executive" ${window._userData.preferences.seniorityLevel === 'Executive' ? 'selected' : ''}>Executive Level</option>
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
                <label class="settings-label">Minimum Salary (Optional)</label>
                <input type="number" class="settings-input" id="settingMinSalary" 
                       value="${window._userData.preferences.minSalary || ''}"
                       placeholder="e.g., 150000">
                <div class="settings-help">Leave blank for no minimum. Enter annual salary (USD).</div>
            </div>
            
            <button class="save-settings-btn" onclick="saveSettings()">
                ${bpIcon("save",14)} Save Settings
            </button>
        </div>
    `;
}

export function renderDataExport() {
    return `
        <div class="blueprint-section">
            <div class="blueprint-section-header">
                <div class="blueprint-section-title">
                    <span class="section-icon">${bpIcon("save",20)}</span>
                    <span>Backup & Restore</span>
                </div>
            </div>
            
            <div class="coaching-tip">
                <div class="coaching-tip-title">
                    ${bpIcon("lightbulb",14)} DATA PORTABILITY
                </div>
                <div class="coaching-tip-content">
                    Export your complete Blueprint as JSON to back up all your data. 
                    Import from a previous export to restore or transfer to another device.
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 8px; padding: 20px;">
                    <h3 style="color: #60a5fa; margin-bottom: 10px;">${bpIcon("upload",14)} Export Profile</h3>
                    <p style="color: #9ca3af; font-size: 0.9em; margin-bottom: 15px;">
                        Download complete backup including skills, outcomes, values, and all settings
                    </p>
                    <button class="export-btn-large" onclick="exportFullProfile()" style="width: 100%;">
                        Download Backup
                    </button>
                </div>
                
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 20px; ${window.isReadOnlyProfile ? 'display:none;' : ''}">
                    <h3 style="color: #10b981; margin-bottom: 10px;">${bpIcon("download",14)} Import Profile</h3>
                    <p style="color: #9ca3af; font-size: 0.9em; margin-bottom: 15px;">
                        Restore from a previous backup or transfer from another device
                    </p>
                    <input type="file" id="importFileInput" accept=".json" style="display: none;" onchange="importFullProfile(this)">
                    <button class="export-btn-large" onclick="document.getElementById('importFileInput').click()" 
                            style="width: 100%; background: #10b981;">
                        Select Backup File
                    </button>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; border-radius: 4px; ${window.isReadOnlyProfile ? 'display:none;' : ''}">
                <strong style="color: #ef4444;">${bpIcon("warning",14)} Warning:</strong>
                <span style="color: #d1d5db; font-size: 0.9em;">
                    Importing will replace all current data. Make sure to export first if you want to keep your current profile!
                </span>
            </div>
        </div>
    `;
}


// ===== PRIVACY & DATA (v4.20.0, absorbed from Consent + Data Export) =====
export function renderPrivacyAndData() {
    if (!window._userData || !window._userData.initialized) return '<div style="padding:40px; text-align:center; color:var(--text-muted);">Loading...</div>';
    var tc = 'var(--c-heading)';
    var hc = 'var(--c-accent-deep)';
    var sc = 'var(--c-muted)';
    var bgCard = 'var(--c-surface-1)';
    
    var html = '';
    
    // --- Sharing Presets (from Consent) ---
    html += '<div class="blueprint-section">'
        + '<div class="blueprint-section-header">'
        + '<div class="blueprint-section-title">'
        + '<span class="section-icon">' + bpIcon('share',20) + '</span>'
        + '<span>Sharing Presets</span>'
        + '</div>'
        + '</div>'
        + '<div class="coaching-tip">'
        + '<div class="coaching-tip-title">'
        + bpIcon('lightbulb',14) + ' CHOOSE YOUR SHARING LEVEL'
        + '</div>'
        + '<div class="coaching-tip-content">'
        + 'Select a preset that matches your audience. These control what data appears in exports and shared views.'
        + '</div>'
        + '</div>'
        + '<div class="values-grid">'
        + Object.entries(sharePresets).map(function(entry) { return renderPresetCard(entry[0], entry[1]); }).join('')
        + '</div>'
        + (currentPreset === 'custom' ? '<div style="margin-top:12px; padding:10px 14px; background:rgba(96,165,250,0.08); border-left:3px solid #60a5fa; border-radius:4px; font-size:0.85em; color:var(--c-heading);">' + bpIcon('info',12) + ' Custom mode active. Manage individual share toggles for outcomes and values in the <a onclick="switchView(\'blueprint\');" style="color:#60a5fa; cursor:pointer; text-decoration:underline;">Blueprint</a> tab. Skills are included based on your profile data.</div>' : '')
        + '</div>';
    
    // --- What You're Sharing (from Consent) ---
    var skillCount = (_sd().skills || []).length;
    var sharedSkills = currentPreset === 'full' ? skillCount : 
                        currentPreset === 'executive' ? Math.min(20, skillCount) :
                        currentPreset === 'advisory' ? _sd().skills.filter(function(s) { return s.key; }).length :
                        currentPreset === 'board' ? _sd().skills.filter(function(s) { return s.key || s.level === 'Mastery'; }).length :
                        skillCount;
    var totalOutcomes = (_bd().outcomes || []).length;
    var sharedOutcomes = _bd().outcomes.filter(function(o) { return o.shared; }).length;
    var totalValues = (_bd().values || []).length;
    var sharedValues = _bd().values.filter(function(v) { return v.selected; }).length;
    
    function sharingLabel(shared, total, noun) {
        if (total === 0) return '<div style="font-size:0.72em; color:#f59e0b; margin-top:4px;">None added yet</div>';
        if (shared < total) return '<div style="font-size:0.72em; color:' + sc + '; margin-top:4px;">of ' + total + ' total</div>';
        return '';
    }
    
    html += '<div class="blueprint-section">'
        + '<div class="blueprint-section-header">'
        + '<div class="blueprint-section-title">'
        + '<span class="section-icon">' + bpIcon('eye',20) + '</span>'
        + '<span>What You\'re Sharing</span>'
        + '</div>'
        + '</div>'
        + '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:16px;">'
        + '<div style="background:rgba(96,165,250,0.1); border:1px solid rgba(96,165,250,0.3); border-radius:8px; padding:20px; text-align:center;">'
        + '<div style="font-size:2em; color:#60a5fa; font-weight:bold;">' + sharedSkills + '</div>'
        + '<div style="color:' + sc + '; margin-top:5px;">Skills</div>'
        + (sharedSkills < skillCount ? '<div style="font-size:0.72em; color:' + sc + '; margin-top:4px;">of ' + skillCount + ' total</div>' : '')
        + '</div>'
        + '<div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:20px; text-align:center;">'
        + '<div style="font-size:2em; color:' + (totalOutcomes === 0 ? '#64748b' : '#10b981') + '; font-weight:bold;">' + sharedOutcomes + '</div>'
        + '<div style="color:' + sc + '; margin-top:5px;">Outcomes</div>'
        + sharingLabel(sharedOutcomes, totalOutcomes, 'outcomes')
        + '</div>'
        + '<div style="background:rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.3); border-radius:8px; padding:20px; text-align:center;">'
        + '<div style="font-size:2em; color:' + (totalValues === 0 ? '#64748b' : '#fbbf24') + '; font-weight:bold;">' + sharedValues + '</div>'
        + '<div style="color:' + sc + '; margin-top:5px;">Values</div>'
        + sharingLabel(sharedValues, totalValues, 'values')
        + '</div>'
        + '</div>'
        + '<div style="margin-top:16px; padding:12px 15px; background:rgba(251,191,36,0.08); border-left:3px solid #fbbf24; border-radius:4px; font-size:0.9em;">'
        + '<strong style="color:#fbbf24;">Note:</strong> '
        + '<span style="color:' + tc + ';">Sensitive content (recovery, personal loss) is flagged in Blueprint. Review before sharing.</span>'
        + '</div>'
        + '</div>';
    
    // --- Backup & Restore ---
    html += renderDataExport();
    
    // --- Blind Mode Defaults ---
    html += '<div class="blueprint-section">'
        + '<div class="blueprint-section-header">'
        + '<div class="blueprint-section-title">'
        + '<span class="section-icon">' + bpIcon('privacy',20) + '</span>'
        + '<span>Blind Mode Defaults</span>'
        + '</div>'
        + '</div>'
        + '<div style="color:' + tc + '; font-size:0.9em; line-height:1.6; margin-bottom:14px;">'
        + 'Control what identifying information is hidden in scouting reports by default. These settings apply globally. You can override them per report at generation time.'
        + '</div>';
    
    var blindDefs = getBlindDefaults();
    BLIND_FIELDS.forEach(function(f) {
        var isOn = blindDefs[f.key];
        html += '<div style="display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--c-border-subtle, rgba(255,255,255,0.06));">'
            + '<div style="flex:1; min-width:0;">'
            + '<div style="font-weight:500; font-size:0.9em;">' + f.label + '</div>'
            + '<div style="font-size:0.75em; color:' + sc + '; margin-top:2px;">' + f.desc + '</div>'
            + '</div>'
            + '<div class="rpt-toggle' + (isOn ? ' on' : '') + '" onclick="this.classList.toggle(\'on\'); setBlindDefault(\'' + f.key + '\', this.classList.contains(\'on\'));"></div>'
            + '</div>';
    });
    html += '</div>';
    
    // --- Privacy Activity Log ---
    var privLog = (window._userData.privacyLog || []).slice().reverse();
    html += '<div class="blueprint-section">'
        + '<div class="blueprint-section-header">'
        + '<div class="blueprint-section-title">'
        + '<span class="section-icon">' + bpIcon('clock',20) + '</span>'
        + '<span>Privacy Activity</span>'
        + '</div>'
        + '</div>'
        + '<div style="color:' + tc + '; font-size:0.88em; line-height:1.5; margin-bottom:14px;">'
        + 'Audit trail of what privacy settings were active for each scouting report and share event.'
        + '</div>';
    
    if (privLog.length > 0) {
        html += '<div style="overflow-x:auto;">'
            + '<table style="width:100%; border-collapse:collapse; font-size:0.82em;">'
            + '<thead><tr>'
            + '<th style="text-align:left; padding:8px 6px; font-size:0.72em; text-transform:uppercase; letter-spacing:0.05em; color:' + sc + '; border-bottom:1px solid var(--c-border-subtle); font-weight:600;">Date</th>'
            + '<th style="text-align:left; padding:8px 6px; font-size:0.72em; text-transform:uppercase; letter-spacing:0.05em; color:' + sc + '; border-bottom:1px solid var(--c-border-subtle); font-weight:600;">Job</th>'
            + '<th style="text-align:left; padding:8px 6px; font-size:0.72em; text-transform:uppercase; letter-spacing:0.05em; color:' + sc + '; border-bottom:1px solid var(--c-border-subtle); font-weight:600;">Format</th>'
            + '<th style="text-align:left; padding:8px 6px; font-size:0.72em; text-transform:uppercase; letter-spacing:0.05em; color:' + sc + '; border-bottom:1px solid var(--c-border-subtle); font-weight:600;">Preset</th>'
            + '<th style="text-align:left; padding:8px 6px; font-size:0.72em; text-transform:uppercase; letter-spacing:0.05em; color:' + sc + '; border-bottom:1px solid var(--c-border-subtle); font-weight:600;">Blinded</th>'
            + '<th style="text-align:center; padding:8px 6px; font-size:0.72em; text-transform:uppercase; letter-spacing:0.05em; color:' + sc + '; border-bottom:1px solid var(--c-border-subtle); font-weight:600;">Override</th>'
            + '</tr></thead><tbody>';
        
        var blindKeyLabels = { identity: 'ID', location: 'Loc', employer: 'Emp', institution: 'Inst', outcomes: 'Out', compensation: 'Comp' };
        var fmtLabels = { html: 'HTML', pdf: 'PDF', share: 'Share' };
        var fmtColors = { html: '#60a5fa', pdf: '#f59e0b', share: '#10b981' };
        var presetLabels = { full: 'Full', executive: 'Executive', advisory: 'Advisory', board: 'Board', custom: 'Custom' };
        var presetColors = { full: '#10b981', executive: '#60a5fa', advisory: '#a78bfa', board: '#f59e0b', custom: '#94a3b8' };
        
        privLog.slice(0, 50).forEach(function(entry) {
            var d = new Date(entry.ts);
            var dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            var blindPills = '';
            var blindKeys = entry.blind || {};
            Object.keys(blindKeys).forEach(function(k) {
                if (blindKeys[k]) {
                    blindPills += '<span style="display:inline-block; font-size:0.7em; padding:1px 5px; border-radius:4px; background:rgba(16,185,129,0.12); color:#10b981; margin:1px 2px; font-weight:600;">' + (blindKeyLabels[k] || k) + '</span>';
                }
            });
            if (!blindPills) blindPills = '<span style="font-size:0.75em; color:' + sc + ';">None</span>';
            
            var presetKey = entry.preset || 'custom';
            var presetPill = '<span style="font-size:0.7em; padding:1px 6px; border-radius:4px; background:' + (presetColors[presetKey] || '#94a3b8') + '1a; color:' + (presetColors[presetKey] || '#94a3b8') + '; font-weight:600;">' + (presetLabels[presetKey] || presetKey) + '</span>';
            
            html += '<tr style="border-bottom:1px solid var(--c-border-subtle, rgba(255,255,255,0.04));">'
                + '<td style="padding:8px 6px; white-space:nowrap;">' + dateStr + '</td>'
                + '<td style="padding:8px 6px; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="' + escapeHtml(entry.job || '') + '">' + escapeHtml(entry.job || 'Unknown') + '</td>'
                + '<td style="padding:8px 6px;"><span style="font-size:0.72em; padding:2px 6px; border-radius:4px; background:' + (fmtColors[entry.type] || '#64748b') + '22; color:' + (fmtColors[entry.type] || '#64748b') + '; font-weight:600;">' + (fmtLabels[entry.type] || entry.type) + '</span></td>'
                + '<td style="padding:8px 6px;">' + presetPill + '</td>'
                + '<td style="padding:8px 6px;">' + blindPills + '</td>'
                + '<td style="padding:8px 6px; text-align:center;">' + (entry.overridden ? '<span style="color:#f59e0b;" title="Settings were overridden for this report">' + bpIcon('warning', 12) + '</span>' : '') + '</td>'
                + '</tr>';
        });
        
        html += '</tbody></table></div>';
        if (privLog.length > 50) {
            html += '<div style="text-align:center; padding:8px; font-size:0.78em; color:' + sc + ';">Showing 50 of ' + privLog.length + ' entries</div>';
        }
    } else {
        html += '<div style="padding:24px; text-align:center; color:' + sc + ';">'
            + '<div style="font-size:1.4em; margin-bottom:8px; opacity:0.3;">' + bpIcon('clock', 32) + '</div>'
            + '<div style="font-weight:500;">No privacy events recorded yet</div>'
            + '<div style="font-size:0.82em; margin-top:4px;">Entries will appear here when you generate or share scouting reports.</div>'
            + '</div>';
    }
    html += '</div>';
    
    // --- Privacy & Legal (from Consent) ---
    html += '<div class="blueprint-section">'
        + '<div class="blueprint-section-header">'
        + '<div class="blueprint-section-title">'
        + '<span class="section-icon">' + bpIcon('privacy',20) + '</span>'
        + '<span>Privacy & Data Rights</span>'
        + '</div>'
        + '</div>'
        + '<div style="color:' + tc + '; line-height:1.7;">'
        + '<p style="margin-bottom:16px;">When signed in, your Blueprint data is stored securely in Firebase (Google Cloud). '
        + 'When not signed in, data persists locally in your browser. You have complete control over what you share.</p>'
        + '<div style="display:grid; gap:8px;">'
        + '<div style="padding:10px; background:' + bgCard + '; border-radius:6px;">'
        + '<strong>CCPA</strong> &mdash; <span style="font-size:0.9em; color:' + sc + ';">Right to know, delete, and opt-out of data sale</span></div>'
        + '<div style="padding:10px; background:' + bgCard + '; border-radius:6px;">'
        + '<strong>GDPR</strong> &mdash; <span style="font-size:0.9em; color:' + sc + ';">Right to access, rectify, erase, and port your data</span></div>'
        + '<div style="padding:10px; background:' + bgCard + '; border-radius:6px;">'
        + '<strong>EEOC</strong> &mdash; <span style="font-size:0.9em; color:' + sc + ';">Employers must handle your data fairly, no discrimination</span></div>'
        + '</div>'
        + '</div></div>';
    
    // --- Data Rights Actions ---
    html += '<div class="blueprint-section">'
        + '<div class="blueprint-section-header">'
        + '<div class="blueprint-section-title">'
        + '<span class="section-icon">' + bpIcon('lock',20) + '</span>'
        + '<span>Your Data Rights</span>'
        + '</div>'
        + '</div>'
        + '<div style="color:' + tc + '; line-height:1.7; font-size:0.93em;">'
        + '<p style="margin-bottom:16px;">Under GDPR and similar privacy regulations, you have the right to access, export, and delete your personal data at any time.</p>'
        + '<div style="display:flex; gap:12px; flex-wrap:wrap;">'
        + '<button onclick="viewMyData()" style="background:var(--c-accent-bg-5a); border:1px solid var(--c-accent-border-4); color:var(--c-accent-deep); padding:12px 20px; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.9em;">' + bpIcon('eye',14) + ' View My Stored Data</button>'
        + '<button onclick="exportMyData()" style="background:var(--c-green-bg-4b); border:1px solid var(--c-green-border-2b); color:var(--c-success); padding:12px 20px; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.9em;">' + bpIcon('download',14) + ' Export My Data</button>'
        + '<button onclick="requestDataDeletion()" style="background:var(--c-red-bg-2a); border:1px solid var(--c-red-border-2); color:var(--c-danger); padding:12px 20px; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.9em;">' + bpIcon('trash',14) + ' Delete All My Data</button>'
        + '</div>'
        + '<div style="margin-top:12px; font-size:0.82em; color:var(--c-faint);">'
        + 'You must be signed in to use these features. Data deletion is permanent and cannot be undone.'
        + '</div>'
        + '</div></div>';
    
    return html;
}
// ===== SAMPLE MODE BULK ACTION DISABLING (v4.20.2) =====
export function disableBulkActionsInSampleMode() {
    // Check if viewing a sample profile
    var isSample = window.isReadOnlyProfile || (window.currentProfileType && window.currentProfileType !== 'user');
    if (!isSample && typeof skillsData !== 'undefined' && _sd().sample) isSample = true;
    
    if (isSample) {
        // Disable all bulk action buttons
        document.querySelectorAll('.bulk-action-btn').forEach(function(btn) {
            btn.disabled = true;
            btn.style.opacity = '0.35';
            btn.style.cursor = 'not-allowed';
            btn.style.pointerEvents = 'none';
            btn.title = 'Not available in sample/demo mode';
        });
        
        // Also handle inline onclick buttons for openBulkImport and openBulkManager
        document.querySelectorAll('.export-btn-large').forEach(function(btn) {
            var onclick = btn.getAttribute('onclick') || '';
            if (onclick.includes('openBulkImport') || onclick.includes('openBulkManager')) {
                btn.disabled = true;
                btn.style.opacity = '0.35';
                btn.style.cursor = 'not-allowed';
                btn.title = 'Not available in sample/demo mode';
            }
        });
    }
}
// [removed] renderSkillManagement — dead code cleanup v4.22.0

export function renderSkillsList() {
    const categoryFilter = document.getElementById('skillCategoryFilter')?.value || 'all';
    const searchQuery = document.getElementById('skillSearchInput')?.value.toLowerCase() || '';
    
    let skills = window._userData.skills || [];
    
    // Apply filters
    if (categoryFilter !== 'all') {
        skills = skills.filter(s => s.category === categoryFilter);
    }
    if (searchQuery) {
        skills = skills.filter(s => s.name.toLowerCase().includes(searchQuery));
    }
    
    if (skills.length === 0) {
        return `<div style="text-align: center; padding: 40px; color: #9ca3af;">
            No skills found. ${searchQuery ? 'Try a different search.' : 'Add some skills to get started!'}
        </div>`;
    }
    
    // Group by category
    const grouped = {
        skill: skills.filter(s => s.category === 'skill'),
        ability: skills.filter(s => s.category === 'ability'),
        workstyle: skills.filter(s => s.category === 'workstyle'),
        unique: skills.filter(s => s.category === 'unique')
    };
    
    const categoryLabels = {
        skill: { name: 'O*NET Skills', color: '#60a5fa', badge: 'SKILL' },
        ability: { name: 'O*NET Abilities', color: '#a78bfa', badge: 'ABILITY' },
        workstyle: { name: 'O*NET Work Styles', color: '#10b981', badge: 'WORK STYLE' },
        unique: { name: 'Unique Skills', color: '#fbbf24', badge: 'UNIQUE' }
    };
    
    let html = '';
    
    Object.entries(grouped).forEach(([category, categorySkills]) => {
        if (categorySkills.length === 0) return;
        
        const label = categoryLabels[category];
        html += `
            <div style="margin-bottom: 25px;">
                <h3 style="color: ${label.color}; font-size: 1.1em; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span>${label.name}</span>
                    <span style="font-size: 0.8em; opacity: 0.7;">(${categorySkills.length})</span>
                </h3>
                <div style="display: grid; gap: 10px;">
        `;
        
        categorySkills.forEach(skill => {
            const roleNames = skill.roles.map(roleId => {
                const role = window._userData.roles.find(r => r.id === roleId);
                return role ? role.name : roleId;
            }).join(', ');
            
            const levelColors = {
                'Mastery':    '#10b981',
                'Expert':     '#fb923c',
                'Advanced':   '#a78bfa',
                'Proficient': '#60a5fa',
                'Novice':     '#94a3b8'
            };
            
            html += `
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; gap: 15px;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
                                <span style="font-weight: 600; font-size: 1.05em;">${escapeHtml(skill.name)}</span>
                                <span style="background: rgba(${category === 'skill' ? '59, 130, 246' : category === 'ability' ? '139, 92, 246' : category === 'workstyle' ? '16, 185, 129' : '251, 191, 36'}, 0.2); 
                                             color: ${label.color}; 
                                             font-size: 0.7em; 
                                             padding: 2px 6px; 
                                             border-radius: 3px;">
                                    ${label.badge}
                                </span>
                                ${skill.key ? '<span style="background: rgba(251, 191, 36, 0.2); color: #fbbf24; font-size: 0.7em; padding: 2px 6px; border-radius: 3px;">CORE</span>' : ''}
                            </div>
                            <div style="color: #9ca3af; font-size: 0.9em;">
                                <span style="color: ${levelColors[skill.level]}; font-weight: 600;">${escapeHtml(skill.level)}</span>
                                ${roleNames ? ` • ${escapeHtml(roleNames)}` : ''}
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; flex-shrink: 0; ${window.isReadOnlyProfile ? 'display:none;' : ''}">
                            <button onclick="openEditSkillModal('${escapeHtml(skill.name).replace(/'/g, "\\'")}', '${category}')" 
                                    style="padding: 6px 12px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 4px; cursor: pointer; font-size: 0.9em; white-space: nowrap;">
                                ${bpIcon("edit",12)} Edit
                            </button>
                            <button onclick="confirmDeleteSkill('${escapeHtml(skill.name).replace(/'/g, "\\'")}', '${category}')" 
                                    style="padding: 6px 12px; background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 4px; cursor: pointer; font-size: 0.9em; white-space: nowrap;">
                                ${bpIcon("trash",14)}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    return html;
}


// saveUserData and loadUserData: single source of truth is the profile JSON.
// localStorage only stores which profile is currently active (handled in first saveUserData definition).
// This comment replaces duplicate/conflicting definitions that were removed in v3.5.2.

export function exportFullProfile() {
    if (readOnlyGuard()) return;
    const fullData = {
        userData: userData,
        blueprintData: blueprintData,
        skillsData: {
            skills: _sd().skills,
            roles: _sd().roles,
            skillDetails: _sd().skillDetails
        },
        version: '1.0',
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(fullData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blueprint-full-${window._userData.profile.name || 'profile'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

export function importFullProfile(fileInput) {
    if (readOnlyGuard()) return;
    const file = fileInput.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (confirm('This will replace your current Blueprint data. Continue?')) {
                // Restore all data with sanitization
                if (imported.userData) {
                    var safeUserData = sanitizeImport(imported.userData);
                    Object.assign(userData, safeUserData);
                }
                if (imported.blueprintData && typeof imported.blueprintData === 'object') {
                    if (Array.isArray(imported.blueprintData.values)) _bd().values = imported.blueprintData.values;
                    if (Array.isArray(imported.blueprintData.outcomes)) _bd().outcomes = imported.blueprintData.outcomes;
                    if (typeof imported.blueprintData.purpose === 'string') _bd().purpose = imported.blueprintData.purpose.slice(0, 5000);
                }
                if (imported.skillsData && typeof imported.skillsData === 'object') {
                    if (Array.isArray(imported.skillsData.skills)) _sd().skills = imported.skillsData.skills;
                    if (Array.isArray(imported.skillsData.roles)) _sd().roles = imported.skillsData.roles;
                    if (imported.skillsData.skillDetails) _sd().skillDetails = imported.skillsData.skillDetails;
                }
                
                // Save to localStorage
                saveUserData();
                
                showToast('Profile imported. Refreshing page...', 'success');
                location.reload();
            }
        } catch (err) {
            showToast('Import error: ' + err.message, 'error');
        }
    };
    reader.readAsText(file);
}

if (!window.initSettings) window.initSettings = initSettings;
if (!window.switchSettingsTab) window.switchSettingsTab = switchSettingsTab;
if (!window.renderSettingsTabContent) window.renderSettingsTabContent = renderSettingsTabContent;
if (!window.renderProfileSettings) window.renderProfileSettings = renderProfileSettings;
if (!window.renderExperienceSettings) window.renderExperienceSettings = renderExperienceSettings;
if (!window.renderJobPreferences) window.renderJobPreferences = renderJobPreferences;
if (!window.renderPrivacyAndData) window.renderPrivacyAndData = renderPrivacyAndData;
if (!window.renderDataExport) window.renderDataExport = renderDataExport;
if (!window.addWorkHistoryItem) window.addWorkHistoryItem = addWorkHistoryItem;
if (!window.editWorkHistoryItem) window.editWorkHistoryItem = editWorkHistoryItem;
if (!window.removeWorkHistoryItem) window.removeWorkHistoryItem = removeWorkHistoryItem;
if (!window.openWorkHistoryModal) window.openWorkHistoryModal = openWorkHistoryModal;
if (!window.addAchievementInput) window.addAchievementInput = addAchievementInput;
if (!window.saveWorkHistoryFromModal) window.saveWorkHistoryFromModal = saveWorkHistoryFromModal;
if (!window.toggleWorkHistoryHidden) window.toggleWorkHistoryHidden = toggleWorkHistoryHidden;
if (!window.getVisibleWorkHistory) window.getVisibleWorkHistory = getVisibleWorkHistory;
if (!window.getVisibleRoles) window.getVisibleRoles = getVisibleRoles;
if (!window.hideRoleFromNetwork) window.hideRoleFromNetwork = hideRoleFromNetwork;
if (!window.cleanOrphanRoles) window.cleanOrphanRoles = cleanOrphanRoles;
if (!window.addEducationItem) window.addEducationItem = addEducationItem;
if (!window.editEducationItem) window.editEducationItem = editEducationItem;
if (!window.removeEducationItem) window.removeEducationItem = removeEducationItem;
if (!window.openEducationModal) window.openEducationModal = openEducationModal;
if (!window.edSwitchType) window.edSwitchType = edSwitchType;
if (!window.edAddNewCred) window.edAddNewCred = edAddNewCred;
if (!window.edRenderLinkedCredTags) window.edRenderLinkedCredTags = edRenderLinkedCredTags;
if (!window.edRemoveLinkedCred) window.edRemoveLinkedCred = edRemoveLinkedCred;
if (!window.saveEducationFromModal) window.saveEducationFromModal = saveEducationFromModal;
if (!window.addCertItem) window.addCertItem = addCertItem;
if (!window.editCertItem) window.editCertItem = editCertItem;
if (!window.removeCertItem) window.removeCertItem = removeCertItem;
if (!window.openCertModal) window.openCertModal = openCertModal;
if (!window.onCertLibrarySearch) window.onCertLibrarySearch = onCertLibrarySearch;
if (!window.selectCertFromLibrary) window.selectCertFromLibrary = selectCertFromLibrary;
if (!window.addCertLinkedSkill) window.addCertLinkedSkill = addCertLinkedSkill;
if (!window.removeCertLinkedSkill) window.removeCertLinkedSkill = removeCertLinkedSkill;
if (!window.saveCertFromModal) window.saveCertFromModal = saveCertFromModal;
if (!window.showCertSkillNotification) window.showCertSkillNotification = showCertSkillNotification;
if (!window.editDevStats) window.editDevStats = editDevStats;
if (!window.saveDevStats) window.saveDevStats = saveDevStats;
if (!window.exportFullProfile) window.exportFullProfile = exportFullProfile;
if (!window.importFullProfile) window.importFullProfile = importFullProfile;
if (!window.disableBulkActionsInSampleMode) window.disableBulkActionsInSampleMode = disableBulkActionsInSampleMode;
if (!window.renderSkillsList) window.renderSkillsList = renderSkillsList;

// ─── DEBUG HELPER (remove after stabilization) ───────────────────────────────
export function bpDebugState() {
    console.group('[BP DEBUG] Global State Snapshot');
    console.log('window._userData:', window._userData);
    console.log('window.userData:', window.userData);
    console.log('window.fbUser:', window.fbUser);
    console.log('window.appContext:', window.appContext);
    console.log('window.skillsData:', window.skillsData);
    console.log('window.blueprintData:', window.blueprintData);
    console.log('window.reportsInitialized:', window.reportsInitialized);
    console.log('window.settingsInitialized:', window.settingsInitialized);
    console.log('reportsView el:', document.getElementById('reportsView'));
    console.log('settingsView el:', document.getElementById('settingsView'));
    console.groupEnd();
}
if (!window.bpDebugState) window.bpDebugState = bpDebugState;
// Call immediately on load
setTimeout(function() { window.bpDebugState && window.bpDebugState(); }, 3000);
