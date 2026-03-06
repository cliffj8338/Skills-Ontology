// ui/nav-shared.js — Blueprint v4.46.21
// Phase 7h extraction — stats bar, D3 drag helpers, skill modal, resume/blueprint gen

import { bpIcon }                          from './icons.js';
import { escapeHtml }                      from '../core/security.js';
import { showToast }                       from './toast.js';

// ─── Data accessors ───────────────────────────────────────────────────────────
function _sd() {
    if (window._skillsData) return window._skillsData;
    var ud = window._userData;
    return { skills: (ud && ud.skills) || [], roles: (ud && ud.roles) || [], skillDetails: (ud && ud.skillDetails) || {} };
}
function _bd() {
    if (window._blueprintData) return window._blueprintData;
    var ud = window._userData;
    return { values: (ud && ud.values) || [], outcomes: (ud && ud.outcomes) || [], purpose: (ud && ud.purpose) || '' };
}

var _dragMoved = false;

// switchView — provided by imported module


// toggleSkillsView — provided by imported module


export function updateStatsBar() {
    const statsBar = document.getElementById('statsBar');
    if (currentView === 'network') {
        // Calculate total market value
        const totalValue = getEffectiveComp();
        const valueFormatted = totalValue.displayComp > 0 ? formatCompValue(totalValue.displayComp) : '';
        const valueDisplay = valueFormatted ? ` • <span style="color: #10b981; font-weight: 700;">${totalValue.compLabel}: ${valueFormatted}/yr</span>` : '';
        
        // Dynamic counts by category
        const skillCount = window._userData.skills?.length || 0;
        const roleCount = window._userData.roles?.length || 0;
        const onetSkillsCount = window._userData.skills?.filter(s => s.category === 'skill').length || 0;
        const abilitiesCount = window._userData.skills?.filter(s => s.category === 'ability').length || 0;
        const workStylesCount = window._userData.skills?.filter(s => s.category === 'workstyle').length || 0;
        const uniqueCount = window._userData.skills?.filter(s => s.category === 'unique').length || 0;
        
        // Show detailed breakdown for v2.0.6 comprehensive model
        let skillBreakdown = '';
        if (skillCount >= 90) {
            // Comprehensive 90-skill model
            skillBreakdown = ` (${onetSkillsCount} Skills + ${abilitiesCount} Abilities + ${workStylesCount} Work Styles + ${uniqueCount} Unique)`;
        } else if (onetSkillsCount > 0 && uniqueCount > 0) {
            // Hybrid model (v2.0.5)
            skillBreakdown = ` (${onetSkillsCount} O*NET + ${uniqueCount} Unique)`;
        }
        
        statsBar.innerHTML = `${skillCount} Total Skills${skillBreakdown} • ${roleCount} Career Roles${valueDisplay}`;
        // Append verification stats if any exist
        var vStats = getVerificationStats();
        if (vStats.verified > 0 || vStats.pending > 0) {
            statsBar.innerHTML += ` • ${vStats.verified} Verified`;
            if (vStats.pending > 0) statsBar.innerHTML += ` (${vStats.pending} pending)`;
        }
    } else if (currentView === 'opportunities') {
        const matches = opportunitiesData.filter(j => j.matchScore >= currentMatchThreshold).length;
        statsBar.innerHTML = `${matches} Matching Opportunities • ${currentMatchThreshold}%+ Match Threshold`;
    } else if (currentView === 'applications') {
        const total = window._userData.applications?.length || 0;
        const active = window._userData.applications?.filter(a => a.status !== 'rejected').length || 0;
        statsBar.innerHTML = `${total} Applications Tracked • ${active} Active`;
    } else if (currentView === 'blueprint') {
        const sharedOutcomes = _bd().outcomes.filter(o => o.shared).length;
        const selectedValues = _bd().values.filter(v => v.selected).length;
        statsBar.innerHTML = `${sharedOutcomes} Outcomes • ${selectedValues} Values • Purpose Statement`;
    } else if (currentView === 'consent') {
        const totalShared = _bd().outcomes.filter(o => o.shared).length + 
                           _bd().values.filter(v => v.selected).length;
        statsBar.innerHTML = `${totalShared} Items Shared • Data Privacy & Control`;
    } else if (currentView === 'settings') {
        statsBar.innerHTML = `Profile Settings • ${escapeHtml(window._userData.preferences.seniorityLevel)} Level • Customize Your Experience`;
    }
}

export function toggleLabelPill(type) {
    var pill = document.getElementById('labelPill' + type.charAt(0).toUpperCase() + type.slice(1));
    if (!pill) return;
    pill.classList.toggle('active');
    var isActive = pill.classList.contains('active');
    
    var svg = d3.select("#networkView");
    if (svg.empty()) return;
    svg.selectAll('text')
        .filter(function(d) { return d && d.type === type; })
        .classed('hidden', !isActive);
}
if (!window.toggleLabelPill) window.toggleLabelPill = toggleLabelPill;

// Apply current pill states to network after any re-render
export function applyLabelToggles() {
    var svg = d3.select("#networkView");
    if (svg.empty()) return;
    
    var types = ['role', 'skill', 'value'];
    types.forEach(function(type) {
        var pill = document.getElementById('labelPill' + type.charAt(0).toUpperCase() + type.slice(1));
        if (pill) {
            var isActive = pill.classList.contains('active');
            svg.selectAll('text')
                .filter(function(d) { return d && d.type === type; })
                .classed('hidden', !isActive);
        }
    });
}
if (!window.applyLabelToggles) window.applyLabelToggles = applyLabelToggles;

// Render dynamic role chips and level counts from current profile data
export function renderFilterChips() {
    // --- ROLES ---
    const rolesContainer = document.getElementById('roleChipsContainer');
    if (rolesContainer && window._userData.roles) {
        var chipRoles = typeof getVisibleRoles === 'function' ? getVisibleRoles() : (window._userData.roles || []);
        rolesContainer.innerHTML = `<div class="role-chip active" data-role="all" onclick="filterByRole('all')">All</div>` +
            chipRoles.map(role => 
                `<div class="role-chip" data-role="${escapeHtml(role.id)}" onclick="filterByRole('${escapeHtml(role.id)}')">${escapeHtml(role.name)}</div>`
            ).join('');
    }
    
    // --- LEVELS ---
    const levelContainer = document.getElementById('levelChipsContainer');
    if (levelContainer && window._userData.skills) {
        const levelDefs = [
            { key: 'Mastery',    cls: 'mastery' },
            { key: 'Expert',     cls: 'expert' },
            { key: 'Advanced',   cls: 'advanced' },
            { key: 'Proficient', cls: 'proficient' },
            { key: 'Novice',     cls: 'novice' }
        ];
        levelContainer.innerHTML = levelDefs
            .map(({ key, cls }) => {
                const count = window._userData.skills.filter(s => s.level === key).length;
                if (count === 0) return '';
                return `<div class="level-chip ${cls}" onclick="filterByLevel('${key.toLowerCase()}')">${key} (${count})</div>`;
            })
            .join('');
    }
}

// filterByRole — provided by imported module

if (!window.filterByRole) window.filterByRole = filterByRole;

// filterByLevel — provided by imported module



export function showTooltip(event, d) {
    const tooltip = d3.select('#tooltip');
    let html = '';

    if (d.type === 'center') {
        html = `<div class="tooltip-title" style="font-size:0.85em; opacity:0.7;">Click to reset layout</div>`;
    } else if (d.type === 'hub') {
        html = `<div class="tooltip-title">${escapeHtml(d.name)}</div><div style="font-size:0.78em; opacity:0.6; margin-top:2px;">Click to reset layout</div>`;
    } else if (d.type === 'tension-marker') {
        html = `<div class="tooltip-title" style="color:#ef4444;">\u26A0 Friction Risk</div>`;
        html += `<div style="font-size:0.82em; color:#9ca3af; margin-top:2px;">This value may conflict with the company culture</div>`;
    } else if (d.type === 'value') {
        html = `<div class="tooltip-title">${escapeHtml(d.name)}</div>`;
        var desc = getCatalogDescription(d.name);
        if (desc) html += `<div style="font-size:0.82em; color:#9ca3af; margin-top:3px; line-height:1.4;">${escapeHtml(desc)}</div>`;
        var stateLabels = { aligned: '\u2705 Shared value', yours: '\uD83D\uDFE1 Your priority', theirs: '\uD83D\uDFE3 Their priority', tension: '\u26A0 Friction risk' };
        var stateColors = { aligned: '#10b981', yours: '#f59e0b', theirs: '#6366f1', tension: '#ef4444' };
        if (d.valState) {
            html += `<div style="font-size:0.78em; color:${stateColors[d.valState] || '#9ca3af'}; margin-top:5px; font-weight:600;">${stateLabels[d.valState] || ''}</div>`;
        }
        if (d.tier) html += `<div style="font-size:0.72em; color:#6b7280; margin-top:2px;">${d.tier === 'primary' ? 'Core company value' : 'Secondary value'}</div>`;
    } else if (d.type === 'role') {
        var roleSkillCount = (_sd().skills || []).filter(s => (s.roles || []).indexOf(d.id) !== -1).length;
        html = `<div class="tooltip-title">${escapeHtml(d.name)}</div>`;
        html += `<div style="font-size:0.82em; color:#9ca3af; margin-top:2px;">${roleSkillCount} skills · Click to filter</div>`;
    } else {
        html = `<div class="tooltip-title">${escapeHtml(d.name)}</div>`;
        var levelText = d.level || '';
        var keyText = d.key ? ' · Core Differentiator' : '';
        // Look up full skill for years of experience
        var fullSkill = (_sd().skills || []).find(s => s.name === d.name);
        var details = (_sd().skillDetails || {})[d.name] || {};
        var years = (details.years || (fullSkill && fullSkill.yearsExperience) || '');
        var yearsText = years ? years + ' yrs' : '';
        
        if (levelText || yearsText || keyText) {
            var parts = [];
            if (levelText) parts.push(levelText);
            if (yearsText) parts.push(yearsText);
            html += `<div class="tooltip-level">${parts.join(' · ')}${keyText}</div>`;
        }
        var skillRoles = d.roles || [];
        if (skillRoles.length > 0) {
            html += `<div class="tooltip-roles">Used in: `;
            skillRoles.forEach(roleId => {
                const role = _sd().roles.find(r => r.id === roleId || r.name === roleId);
                html += `<span class="tooltip-role-tag">${escapeHtml(role ? role.name : roleId)}</span>`;
            });
            html += `</div>`;
        }
        html += `<div style="font-size:0.72em; color:#6b7280; margin-top:6px; border-top:1px solid rgba(255,255,255,0.08); padding-top:5px;">Click for full detail</div>`;
    }

    tooltip
        .html(html)
        .style('opacity', 1);
    
    // Smart positioning: measure tooltip, keep within viewport
    var ttNode = tooltip.node();
    var ttW = ttNode.offsetWidth || 200;
    var ttH = ttNode.offsetHeight || 60;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var px = event.pageX;
    var py = event.pageY;
    
    var isMobileTooltip = vw <= 768;
    var left, top;
    
    if (isMobileTooltip) {
        // Mobile: center horizontally
        left = Math.max(8, Math.min((vw - ttW) / 2, vw - ttW - 8));
        var svgEl = document.getElementById('networkView');
        var svgRect = svgEl ? svgEl.getBoundingClientRect() : { top: 0, bottom: vh * 0.6 };
        var svgTop = svgRect.top + window.scrollY;
        var svgBottom = svgRect.bottom + window.scrollY;
        
        // Position above the tapped node
        top = py - ttH - 20;
        // If above would clip above SVG, flip below the node
        if (top < svgTop + 8) {
            top = py + 20;
        }
        // If below would go past SVG bottom, clamp to SVG bottom edge
        if (top + ttH > svgBottom - 4) {
            top = svgBottom - ttH - 4;
        }
        // Final clamp: never above the SVG top
        if (top < svgTop + 4) top = svgTop + 4;
    } else {
        // Desktop: right and above cursor
        left = px + 12;
        top = py - 12;
        // Flip left if overflowing right edge
        if (left + ttW > vw - 10) left = px - ttW - 12;
        // Flip down if overflowing top
        if (top < 10) top = py + 16;
        // Clamp bottom
        if (top + ttH > vh - 10) top = vh - ttH - 10;
    }
    tooltip.style('left', left + 'px').style('top', top + 'px');
}

export function hideTooltip() {
    d3.select('#tooltip').style('opacity', 0);
}

var _dragMoved = false;
export function dragstarted(event, d) {
    _dragMoved = false;
    var sim = window._d3simulation || (typeof simulation !== 'undefined' ? simulation : null);
    if (sim && !event.active) sim.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    d3.select(event.sourceEvent.target).style("cursor", "grabbing");
}

export function dragged(event, d) {
    _dragMoved = true;
    d.fx = event.x;
    d.fy = event.y;
}

export function dragended(event, d) {
    var sim = window._d3simulation || (typeof simulation !== 'undefined' ? simulation : null);
    if (sim && !event.active) sim.alphaTarget(0);
    d3.select(event.sourceEvent.target).style("cursor", d.type === "center" ? "pointer" : "grab");
    if (!_dragMoved) {
        // Pure click — release pin so node flows back
        if (d.type !== 'center') {
            d.fx = null;
            d.fy = null;
        }
        return; // let click event handle it
    }
    // Real drag — hard pin with indicator ring
    if (d.type !== 'center') {
        var circle = d3.select(event.sourceEvent.target);
        circle.attr("stroke", "rgba(255,255,255,0.4)").attr("stroke-width", 2);
    }
}

// Reset all pinned nodes when center node is clicked
// resetNetworkLayout — provided by imported module

// [removed] openExportModal — dead code cleanup v4.22.0

// closeExportModal — provided by imported module


// ===== WORK BLUEPRINT GENERATOR =====

// generateWorkBlueprint — provided by imported module


export function gatherBlueprintData() {
    const skills = _sd().skills || window._userData.skills || [];
    const topSkills = skills.map(skill => ({ ...skill, impact: getSkillImpact(skill) })).sort((a, b) => (b.impact?.score || 0) - (a.impact?.score || 0)).slice(0, 10);
    const compensation = getEffectiveComp();

    // Pull real strategic outcomes from skill evidence — prefer items with metrics
    const allEvidence = [];
    skills.forEach(skill => {
        (skill.evidence || []).forEach(ev => {
            const text = (ev.outcome || '') + ' ' + (ev.description || '');
            let score = 0;
            if (/\$[\d,]+[MBK]?/i.test(text)) score += 5;
            if (/\d+%/.test(text)) score += 4;
            if (/million|billion/i.test(text)) score += 5;
            if (/\d+x|\d+ times/i.test(text)) score += 3;
            if (skill.level === 'Mastery' || skill.level === 'Expert') score += 2;
            if (skill.key) score += 2;
            allEvidence.push({ skill: skill.name, description: ev.description, outcome: ev.outcome, score });
        });
    });
    allEvidence.sort((a, b) => b.score - a.score);

    // Build strategicOutcomes from top 5 real evidence items
    const strategicOutcomes = allEvidence.slice(0, 5).map(item => ({
        title: item.skill,
        metric: extractMetric(item.outcome),
        description: item.description || '',
        outcome: item.outcome || ''
    }));

    // Use real values from profile
    const selectedValues = (window._userData.values || []).filter(v => v.selected !== false).map(v => v.name || v);

    return {
        name: window._userData.profile.name || 'Your Name',
        title: window._userData.profile.currentTitle || 'Your Title',
        company: window._userData.profile.currentCompany || '',
        location: window._userData.profile.location || '',
        headline: window._userData.profile.headline || `${window._userData.profile.currentTitle || 'Strategic Professional'} · ${window._userData.profile.yearsExperience || ''}+ Years`,
        generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        executiveSummary: window._userData.profile.executiveSummary || window._userData.purpose || 'Accomplished professional with proven track record of delivering measurable business impact.',
        purpose: window._userData.purpose || '',
        coreCompetencies: topSkills,
        strategicOutcomes,
        leadershipPhilosophy: window._userData.purpose || 'Leadership is about creating conditions where great work becomes inevitable.',
        marketPositioning: selectedValues.length > 0
            ? `Core principles: ${selectedValues.join(' · ')}.`
            : 'Strategic professional with deep domain expertise and proven track record.',
        compensation: compensation,
        careerNarrative: window._userData.profile.executiveSummary || 'A career defined by building bridges between technical innovation and business strategy.',
        futureVision: window._userData.purpose || 'Focused on creating lasting impact through authentic leadership and evidence-based strategy.'
    };
}

// Extract the most compelling metric from an outcome string
export function extractMetric(text) {
    if (!text) return '';
    const dollarMatch = text.match(/\$[\d.,]+[MBK]?(?:\s*\w+)?/i);
    if (dollarMatch) return dollarMatch[0];
    const pctMatch = text.match(/\d+%(?:\s*\w+)?/);
    if (pctMatch) return pctMatch[0];
    const multMatch = text.match(/\d+x(?:\s*\w+)?/i);
    if (multMatch) return multMatch[0];
    // Fallback: first 40 chars
    return text.slice(0, 40) + (text.length > 40 ? '…' : '');
}

export function createBlueprintHTML(data) {
    var e = escapeHtml; // shorthand
    const htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Blueprint - ' + e(data.name) + '</title><link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}:root{--primary:#1e40af;--accent:#f59e0b;--text:#1f2937;--text-light:#6b7280;--border:#e5e7eb;--bg:#fff;--bg-alt:#f9fafb}body{font-family:Crimson Pro,Georgia,serif;color:var(--text);background:var(--bg);line-height:1.7;font-size:18px}.container{max-width:900px;margin:0 auto;padding:60px 40px}header{border-bottom:3px solid var(--primary);padding-bottom:40px;margin-bottom:60px}h1{font-size:48px;font-weight:700;color:var(--primary);margin-bottom:10px}h2{font-size:32px;font-weight:700;color:var(--primary);margin-bottom:20px;border-left:4px solid var(--accent);padding-left:20px}section{margin-bottom:60px}p{margin-bottom:16px}.subtitle{font-size:24px;color:var(--text-light);margin-bottom:20px}.headline{font-size:20px;color:var(--accent);font-weight:600}.meta{font-family:JetBrains Mono,monospace;font-size:14px;color:var(--text-light);margin-top:20px}.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;margin-top:30px}.skill-card{background:var(--bg-alt);border:1px solid var(--border);border-left:4px solid #3b82f6;padding:20px}.skill-name{font-size:18px;font-weight:600;color:var(--primary);margin-bottom:8px}.skill-level{font-family:JetBrains Mono,monospace;font-size:12px;color:var(--accent);text-transform:uppercase}.outcome{background:linear-gradient(to right,var(--bg-alt),var(--bg));border-left:4px solid var(--accent);padding:24px;margin-bottom:20px}.outcome-title{font-size:20px;font-weight:600;color:var(--primary);margin-bottom:8px}.outcome-metric{font-family:JetBrains Mono,monospace;font-size:16px;color:var(--accent);margin-bottom:10px}.comp-framework{background:var(--bg-alt);border:2px solid var(--primary);padding:30px;margin-top:30px}.comp-row{display:flex;justify-content:space-between;padding:16px 0;border-bottom:1px solid var(--border)}.comp-label{font-weight:600}.comp-value{font-family:JetBrains Mono,monospace;color:var(--primary);font-weight:600}.quote-block{background:linear-gradient(135deg,var(--primary),#3b82f6);color:#fff;padding:40px;margin:40px 0;font-size:22px;font-style:italic}@media print{body{font-size:11pt}.container{padding:20px}h1{font-size:28pt}h2{font-size:18pt}}</style></head><body><div class="container"><header><h1>' + e(data.name) + '</h1><div class="subtitle">' + e(data.title) + '</div><div class="headline">' + e(data.headline) + '</div><div class="meta">Generated: ' + e(data.generatedDate) + '</div></header><section><h2>Executive Summary</h2><p>' + e(data.executiveSummary) + '</p></section><section><h2>Core Competencies</h2><p>Strategic capabilities driving measurable impact:</p><div class="skills-grid">' + data.coreCompetencies.map(s => '<div class="skill-card"><div class="skill-name">' + e(s.name) + '</div><div class="skill-level">' + e(s.proficiency || 'Expert') + '</div></div>').join('') + '</div></section><section><h2>Strategic Outcomes</h2>' + data.strategicOutcomes.map(o => '<div class="outcome"><div class="outcome-title">' + e(o.title) + '</div><div class="outcome-metric">' + e(o.metric) + '</div><p>' + e(o.description) + '</p></div>').join('') + '</section><section><h2>Leadership Philosophy</h2><p>' + e(data.leadershipPhilosophy) + '</p></section><div class="quote-block">"' + e(data.marketPositioning) + '"</div><section><h2>Compensation Framework</h2><p>Market-informed positioning based on skill depth and impact:</p><div class="comp-framework"><div class="comp-row"><span class="comp-label">Base Market Rate</span><span class="comp-value">$' + Math.round(data.compensation.marketRate || 200000).toLocaleString() + '</span></div><div class="comp-row"><span class="comp-label">Conservative Range</span><span class="comp-value">$' + Math.round(data.compensation.conservativeOffer || 225000).toLocaleString() + '</span></div><div class="comp-row"><span class="comp-label">Competitive Range</span><span class="comp-value">$' + Math.round(data.compensation.competitiveOffer || 275000).toLocaleString() + '</span></div></div></section><section><h2>Career Narrative</h2><p>' + e(data.careerNarrative) + '</p></section><section><h2>Future Vision</h2><p>' + e(data.futureVision) + '</p></section><footer style="margin-top:80px;padding-top:40px;border-top:2px solid var(--border);color:var(--text-light);font-size:14px"><p>This Blueprint is a living document representing strategic capabilities and market positioning as of ' + e(data.generatedDate) + '.</p><p style=\"margin-top:8px;\">&copy; ' + new Date().getFullYear() + ' Cliff Jurkiewicz. All rights reserved. Blueprint&trade; and its methodologies are the intellectual property of Cliff Jurkiewicz. &middot; myblueprint.work</p></footer></div></body></html>';
    return htmlContent;
}

export function downloadBlueprint(html, filename) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Estimate years of experience from skill proficiency level
export function estimateSkillYears(level) {
    var ranges = {
        'Mastery': '10+',
        'Expert': '7–10',
        'Advanced': '4–7',
        'Proficient': '2–4',
        'Novice': '0–2',
        'Competent': '1–3'
    };
    return ranges[level] || '2+';
}

// openSkillModal — provided by imported module


// closeSkillModal — provided by imported module


export function openRelatedSkill(skillName) {
    const skill = _sd().skills.find(s => s.name === skillName);
    if (skill) {
        (window.openSkillModal || function(){})(skillName, skill);
    }
}

export function openSkillModalFromCard(skillName) {
    const skill = _sd().skills.find(s => s.name === skillName);
    
    if (skill) {
        console.log('  → Skill has evidence:', skill.evidence ? `YES (${skill.evidence.length} items)` : 'NO');
        (window.openSkillModal || function(){})(skillName, skill);
    } else {
        console.error('  → ERROR: Skill not found in _sd().skills');
    }
}

// ===== PROFESSIONAL RESUME GENERATOR =====
// Produces a clean, ATS-readable HTML resume styled for print-to-PDF.
// Pulls real data: executiveSummary, skill evidence outcomes, values, purpose, market value.

// generateResume — provided by imported module


export function gatherResumeData() {
    const skills = _sd().skills || window._userData.skills || [];
    const profile = window._userData.profile || {};
    const compensation = getEffectiveComp();

    // --- Achievements: pull evidence items that have real outcomes ---
    const allEvidence = [];
    skills.forEach(skill => {
        (skill.evidence || []).forEach(ev => {
            const text = (ev.outcome || '') + ' ' + (ev.description || '');
            let score = 0;
            if (/\$[\d,]+[MBK]?/i.test(text)) score += 5;
            if (/\d+%/.test(text)) score += 4;
            if (/\d+x|\d+ times/i.test(text)) score += 3;
            if (/\d+ (months?|years?|days?)/i.test(text)) score += 2;
            if (/million|billion/i.test(text)) score += 5;
            if (/zero|perfect|first|award|recogni/i.test(text)) score += 2;
            if (skill.level === 'Mastery') score += 3;
            else if (skill.level === 'Expert') score += 2;
            else if (skill.level === 'Advanced') score += 1;
            if (skill.key) score += 2;
            allEvidence.push({
                skill: skill.name,
                level: skill.level,
                category: skill.category,
                roles: skill.roles || [],
                description: ev.description || '',
                outcome: ev.outcome || '',
                score
            });
        });
    });
    allEvidence.sort((a, b) => b.score - a.score);
    const topAchievements = allEvidence.slice(0, 10);

    // --- Core competencies: key + mastery skills, deduplicated by category ---
    const keySkills = skills.filter(s => s.key || s.level === 'Mastery' || s.level === 'Expert');
    const compSet = [];
    const seen = new Set();
    keySkills.forEach(s => { if (!seen.has(s.name) && compSet.length < 18) { compSet.push(s); seen.add(s.name); } });
    skills.filter(s => s.level === 'Advanced' && !seen.has(s.name))
          .slice(0, 18 - compSet.length)
          .forEach(s => { compSet.push(s); seen.add(s.name); });

    // --- Role groupings for skills section (visible roles only) ---
    const roleGroups = {};
    (typeof getVisibleRoles === 'function' ? getVisibleRoles() : (window._userData.roles || _sd().roles || [])).forEach(role => {
        const roleSkills = skills.filter(s => (s.roles || []).includes(role.id));
        if (roleSkills.length > 0) roleGroups[role.name] = roleSkills;
    });

    // --- Values (selected only) ---
    const selectedValues = (window._userData.values || [])
        .filter(v => v.selected !== false)
        .map(v => v.name || v);

    // --- Work History (exclude hidden positions) ---
    const workHistory = getVisibleWorkHistory().map(job => ({
        ...job,
        achievements: job.achievements || []
    }));

    // --- Education ---
    const education = window._userData.education || [];

    // --- Certifications ---
    const certifications = window._userData.certifications || [];

    return {
        name: profile.name || 'Your Name',
        title: profile.currentTitle || 'Professional',
        company: profile.currentCompany || '',
        location: profile.location || '',
        email: profile.email || '',
        phone: profile.phone || '',
        linkedinUrl: profile.linkedinUrl || '',
        yearsExperience: profile.yearsExperience || '',
        executiveSummary: profile.executiveSummary || window._userData.purpose || '',
        purpose: window._userData.purpose || '',
        topAchievements,
        competencies: compSet,
        roleGroups,
        values: selectedValues,
        workHistory,
        education,
        certifications,
        compensation,
        generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        totalSkills: skills.length,
        masteryCount: skills.filter(s => s.level === 'Mastery').length,
        expertCount: skills.filter(s => s.level === 'Expert').length
    };
}

export function buildResumeHTML(d) {
    const name = d.name;
    const title = d.title;
    const location = d.location ? d.location.split(',').slice(-2).join(',').trim() : '';
    const comp = d.compensation;
    const salaryRange = comp && comp.standardOffer
        ? `$${Math.round(comp.conservativeOffer / 1000)}K – $${Math.round(comp.competitiveOffer / 1000)}K`
        : '';

    // Achievement bullets
    const achievementHTML = d.topAchievements.map(item => {
        const outcome = item.outcome.trim().replace(/\.$/, '');
        const desc = item.description.trim().replace(/\.$/, '');
        const shortDesc = desc.length > 120 ? desc.slice(0, 117) + '…' : desc;
        return `<li><span class="ach-outcome">${outcome}.</span> <span class="ach-context">${shortDesc}.</span></li>`;
    }).join('\n');

    // Competencies grid
    const compHTML = d.competencies.map(s => {
        const levelDot = s.level === 'Mastery' ? '●●●' : s.level === 'Expert' ? '●●○' : s.level === 'Advanced' ? '●○○' : '○○○';
        return `<div class="comp-item"><span class="comp-name">${escapeHtml(s.name)}</span><span class="comp-dots">${levelDot}</span></div>`;
    }).join('\n');

    // Values
    const valuesHTML = d.values.length
        ? d.values.map(v => `<span class="value-tag">${escapeHtml(v)}</span>`).join('')
        : '';

    // Contact items
    const contactParts = [];
    if (d.email) contactParts.push(`<div class="contact-item">${d.email}</div>`);
    if (d.phone) contactParts.push(`<div class="contact-item">${d.phone}</div>`);
    if (location) contactParts.push(`<div class="contact-item">${location}</div>`);
    if (d.linkedinUrl) {
        const shortLi = d.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
        contactParts.push(`<div class="contact-item"><a href="${sanitizeUrl(d.linkedinUrl)}" style="color:var(--ink-2); text-decoration:none;">${escapeHtml(shortLi)}</a></div>`);
    }
    if (d.yearsExperience) contactParts.push(`<div class="contact-item">${d.yearsExperience}+ Years Experience</div>`);
    const contactHTML = contactParts.join('<div class="contact-sep">·</div>');

    // Work History
    const workHistoryHTML = (d.workHistory || []).map(job => {
        const dateRange = formatWorkDate(job.startDate || '') + ' – ' + (job.current ? 'Present' : formatWorkDate(job.endDate || ''));
        const achList = (job.achievements || []).map(a => 
            `<li>${a}</li>`
        ).join('\n');
        
        return `
        <div class="experience-block">
            <div class="exp-header">
                <div class="exp-title">${job.title || ''}</div>
                <div class="exp-dates">${dateRange}</div>
            </div>
            <div class="exp-company">${job.company || ''}${job.location ? ' · ' + job.location : ''}</div>
            ${job.description ? `<p class="exp-desc">${job.description}</p>` : ''}
            ${achList ? `<ul class="exp-achievements">${achList}</ul>` : ''}
        </div>`;
    }).join('\n');

    // Education
    const educationHTML = (d.education || []).map(ed => {
        return `<div class="edu-item">
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
                <div><strong>${ed.degree || ''}${ed.field ? ' in ' + ed.field : ''}</strong></div>
                <div class="exp-dates">${ed.year || ''}</div>
            </div>
            <div style="color:var(--ink-2);">${ed.school || ''}</div>
        </div>`;
    }).join('\n');

    // Certifications
    const certHTML = (d.certifications || []).map(c => {
        return `<span class="cert-tag">${c.name}${c.issuer ? ' (' + c.issuer + ')' : ''}${c.year ? ' · ' + c.year : ''}</span>`;
    }).join('');

    // Salary target line
    const salaryLine = salaryRange
        ? `<div class="contact-item">Target: ${salaryRange}</div>`
        : '';

    // Determine if we have structured work history or need fallback
    const hasWorkHistory = d.workHistory && d.workHistory.length > 0;
    const hasEducation = d.education && d.education.length > 0;
    const hasCerts = d.certifications && d.certifications.length > 0;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Resume — ${name}</title>
<style>
/* =====================================================
   BLUEPRINT RESUME v2 — Professional Print-Ready
   ATS-optimized structure + clean human presentation
   Print: File → Print → Save as PDF
   ===================================================== */

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --ink:       #111827;
  --ink-2:     #374151;
  --ink-3:     #6b7280;
  --rule:      #d1d5db;
  --accent:    #1d4ed8;
  --accent-lt: #eff6ff;
  --pg-w:      8.5in;
  --pg-pad:    0.65in;
}

html { font-size: 11pt; }

body {
  font-family: 'Georgia', 'Times New Roman', serif;
  color: var(--ink);
  background: #f3f4f6;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.page {
  width: var(--pg-w);
  min-height: 11in;
  margin: 0.4in auto;
  padding: var(--pg-pad);
  background: #fff;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
}

/* ---- HEADER ---- */
.resume-header {
  border-bottom: 2.5pt solid var(--accent);
  padding-bottom: 14pt;
  margin-bottom: 18pt;
}

.resume-name {
  font-family: 'Arial', 'Helvetica Neue', sans-serif;
  font-size: 26pt;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.5pt;
  line-height: 1;
  margin-bottom: 4pt;
}

.resume-title {
  font-family: 'Arial', sans-serif;
  font-size: 12pt;
  font-weight: 400;
  color: var(--accent);
  letter-spacing: 0.3pt;
  margin-bottom: 10pt;
}

.contact-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6pt 18pt;
  font-family: 'Arial', sans-serif;
  font-size: 9pt;
  color: var(--ink-2);
}

.contact-item { display: flex; align-items: center; gap: 4pt; }
.contact-item a { color: var(--ink-2); text-decoration: none; }
.contact-sep { color: var(--rule); }

/* ---- SECTION STRUCTURE ---- */
.section { margin-bottom: 18pt; }

.section-label {
  font-family: 'Arial', sans-serif;
  font-size: 8.5pt;
  font-weight: 700;
  letter-spacing: 1.5pt;
  text-transform: uppercase;
  color: var(--accent);
  border-bottom: 1pt solid var(--rule);
  padding-bottom: 3pt;
  margin-bottom: 10pt;
}

/* ---- SUMMARY ---- */
.summary-text {
  font-size: 10.5pt;
  line-height: 1.65;
  color: var(--ink-2);
  max-width: 100%;
}

/* ---- ACHIEVEMENTS ---- */
.achievements-list {
  list-style: none;
  padding: 0;
}

.achievements-list li {
  font-size: 10pt;
  line-height: 1.6;
  padding: 5pt 0 5pt 14pt;
  border-bottom: 0.5pt solid #f0f0f0;
  position: relative;
}

.achievements-list li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-size: 9pt;
  top: 6pt;
}

.achievements-list li:last-child { border-bottom: none; }
.ach-outcome { font-weight: 600; color: var(--ink); }
.ach-context { color: var(--ink-2); }

/* ---- COMPETENCIES GRID ---- */
.comp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5pt 16pt;
}

.comp-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 9.5pt;
  padding: 3pt 0;
  border-bottom: 0.5pt solid #f5f5f5;
}

.comp-name { color: var(--ink-2); }

.comp-dots {
  font-size: 7pt;
  color: var(--accent);
  letter-spacing: 2pt;
  flex-shrink: 0;
  margin-left: 6pt;
}

/* ---- EXPERIENCE ---- */
.experience-block { margin-bottom: 14pt; }

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2pt;
}

.exp-title {
  font-family: 'Arial', sans-serif;
  font-size: 11pt;
  font-weight: 600;
  color: var(--ink);
}

.exp-dates {
  font-family: 'Arial', sans-serif;
  font-size: 9pt;
  color: var(--ink-3);
}

.exp-company {
  font-family: 'Arial', sans-serif;
  font-size: 10pt;
  color: var(--ink-2);
  margin-bottom: 4pt;
}

.exp-desc {
  font-size: 9.5pt;
  line-height: 1.55;
  color: var(--ink-2);
  margin-bottom: 6pt;
}

.exp-achievements {
  list-style: none;
  padding: 0;
  margin: 0;
}

.exp-achievements li {
  font-size: 9.5pt;
  line-height: 1.55;
  padding: 2pt 0 2pt 14pt;
  color: var(--ink-2);
  position: relative;
}

.exp-achievements li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-size: 8.5pt;
  top: 3pt;
}

/* ---- EDUCATION ---- */
.edu-item {
  margin-bottom: 8pt;
  font-size: 10pt;
}

.edu-item strong {
  color: var(--ink);
  font-family: 'Arial', sans-serif;
}

/* ---- CERTIFICATIONS ---- */
.cert-tag {
  font-family: 'Arial', sans-serif;
  font-size: 9pt;
  color: var(--ink-2);
  background: #f9fafb;
  padding: 2pt 8pt;
  border-radius: 2pt;
  border: 0.5pt solid #e5e7eb;
  display: inline-block;
  margin: 0 6pt 4pt 0;
}

/* ---- VALUES ---- */
.values-row { display: flex; flex-wrap: wrap; gap: 6pt; }

.value-tag {
  font-family: 'Arial', sans-serif;
  font-size: 9pt;
  color: var(--accent);
  background: var(--accent-lt);
  padding: 2pt 8pt;
  border-radius: 2pt;
  border: 0.5pt solid #bfdbfe;
}

/* ---- FOOTER ---- */
.resume-footer {
  margin-top: 24pt;
  padding-top: 8pt;
  border-top: 0.5pt solid var(--rule);
  font-family: 'Arial', sans-serif;
  font-size: 8pt;
  color: var(--ink-3);
  display: flex;
  justify-content: space-between;
}

.legend {
  font-family: 'Arial', sans-serif;
  font-size: 8pt;
  color: var(--ink-3);
  margin-top: 6pt;
}

/* ---- PRINT ---- */
@media print {
  body { background: white; }
  .page {
    width: 100%;
    margin: 0;
    padding: 0.55in 0.65in;
    box-shadow: none;
    min-height: auto;
  }
  .section { page-break-inside: avoid; }
  .experience-block { page-break-inside: avoid; }
  .no-print { display: none !important; }
}

.print-bar {
  width: var(--pg-w);
  margin: 0 auto 10pt;
  display: flex;
  justify-content: flex-end;
  gap: 10pt;
}

.btn-print {
  font-family: 'Arial', sans-serif;
  font-size: 10pt;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  border: none;
  padding: 8pt 20pt;
  border-radius: 4pt;
  cursor: pointer;
  letter-spacing: 0.3pt;
}

.btn-print:hover { background: #1e40af; }
@media print { .print-bar { display: none; } }
</style>
</head>
<body>

<div class="print-bar no-print">
  <button class="btn-print" onclick="window.print()">⬇ Save as PDF</button>
</div>

<div class="page">

  <!-- HEADER -->
  <header class="resume-header">
    <div class="resume-name">${name}</div>
    <div class="resume-title">${title}</div>
    <div class="contact-row">
      ${contactHTML}
      ${salaryLine}
    </div>
  </header>

  <!-- PROFESSIONAL SUMMARY -->
  ${d.executiveSummary ? `
  <section class="section">
    <div class="section-label">Professional Summary</div>
    <p class="summary-text">${d.executiveSummary}</p>
  </section>` : ''}

  <!-- CORE COMPETENCIES -->
  ${d.competencies.length > 0 ? `
  <section class="section">
    <div class="section-label">Core Competencies</div>
    <div class="comp-grid">
      ${compHTML}
    </div>
    <div class="legend" style="margin-top:8pt;">Proficiency: ●●● Mastery &nbsp;·&nbsp; ●●○ Expert &nbsp;·&nbsp; ●○○ Advanced</div>
  </section>` : ''}

  <!-- PROFESSIONAL EXPERIENCE -->
  ${hasWorkHistory ? `
  <section class="section">
    <div class="section-label">Professional Experience</div>
    ${workHistoryHTML}
  </section>` : `
  <section class="section">
    <div class="section-label">Professional Experience</div>
    <div class="experience-block">
      <div class="exp-header">
<div class="exp-title">${title}</div>
<div class="exp-dates">Present${d.yearsExperience ? ' · ' + d.yearsExperience + '+ years' : ''}</div>
      </div>
      <div class="exp-company">${d.company}${location ? ' · ' + location : ''}</div>
    </div>
    ${d.purpose ? '<p class="summary-text" style="font-size:9.5pt; color: #4b5563;">' + d.purpose + '</p>' : ''}
  </section>`}

  <!-- SELECTED ACHIEVEMENTS -->
  ${d.topAchievements.length > 0 && !hasWorkHistory ? `
  <section class="section">
    <div class="section-label">Selected Achievements</div>
    <ul class="achievements-list">
      ${achievementHTML}
    </ul>
  </section>` : ''}

  <!-- EDUCATION -->
  ${hasEducation ? `
  <section class="section">
    <div class="section-label">Education</div>
    ${educationHTML}
  </section>` : ''}

  <!-- CERTIFICATIONS -->
  ${hasCerts ? `
  <section class="section">
    <div class="section-label">Certifications &amp; Licenses</div>
    <div style="display:flex; flex-wrap:wrap; gap:4pt;">
      ${certHTML}
    </div>
  </section>` : ''}

  <!-- VALUES -->
  ${valuesHTML ? `
  <section class="section">
    <div class="section-label">Core Values &amp; Leadership Principles</div>
    <div class="values-row">${valuesHTML}</div>
  </section>` : ''}

  <!-- FOOTER -->
  <footer class="resume-footer">
    <span>Generated by Blueprint&trade; · ${d.generatedDate} · &copy; ${new Date().getFullYear()} Cliff Jurkiewicz · myblueprint.work</span>
    <span>${d.totalSkills} documented skills · ${d.masteryCount + d.expertCount} at Mastery/Expert level</span>
  </footer>

</div><!-- /page -->
</body>
</html>`;
}
// ===== END RESUME GENERATOR =====

// Resize handler

// ===== WORK BLUEPRINT SYSTEM =====

let blueprintData = {
    outcomes: [],
    values: [],
    purpose: "",
    shareSettings: {}
};
// Expose state for console tooling
if (!window._skillsData) window._skillsData = skillsData;
if (!window._userData) window._userData = userData;
if (!window._blueprintData) window._blueprintData = blueprintData;

if (!window.updateStatsBar) window.updateStatsBar = updateStatsBar;
if (!window.toggleLabelPill) window.toggleLabelPill = toggleLabelPill;
if (!window.applyLabelToggles) window.applyLabelToggles = applyLabelToggles;
if (!window.renderFilterChips) window.renderFilterChips = renderFilterChips;
if (!window.showTooltip) window.showTooltip = showTooltip;
if (!window.hideTooltip) window.hideTooltip = hideTooltip;
if (!window.dragstarted) window.dragstarted = dragstarted;
if (!window.dragged) window.dragged = dragged;
if (!window.dragended) window.dragended = dragended;
if (!window.gatherBlueprintData) window.gatherBlueprintData = gatherBlueprintData;
if (!window.extractMetric) window.extractMetric = extractMetric;
if (!window.createBlueprintHTML) window.createBlueprintHTML = createBlueprintHTML;
if (!window.downloadBlueprint) window.downloadBlueprint = downloadBlueprint;
if (!window.estimateSkillYears) window.estimateSkillYears = estimateSkillYears;
if (!window.openRelatedSkill) window.openRelatedSkill = openRelatedSkill;
if (!window.openSkillModalFromCard) window.openSkillModalFromCard = openSkillModalFromCard;
if (!window.gatherResumeData) window.gatherResumeData = gatherResumeData;
if (!window.buildResumeHTML) window.buildResumeHTML = buildResumeHTML;
