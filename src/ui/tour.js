// ui/tour.js — Blueprint v4.46.21
// Phase 8c extraction — Guided tour system (IIFE unwrapped to module)

import { bpIcon }      from './icons.js';
import { escapeHtml }  from '../core/security.js';

'use strict';

// --- Tour State ---
var tourActive = false;
var tourSteps = [];
var tourCurrentStep = 0;
var tourOverlay = null;
var tourTooltip = null;
var tourName = '';
var TOUR_SEEN_KEY = 'bp_tour_seen';
var TOUR_SEEN_WELCOME = 'bp_tour_welcome_seen';

// --- CSS Injection ---
var tourStyle = document.createElement('style');
tourStyle.textContent = ''
    // Overlay backdrop — always dark
    + '.tour-overlay {'
    + '  position: fixed; inset: 0; z-index: 99998;'
    + '  background: rgba(0,0,0,0.6);'
    + '  pointer-events: auto; transition: opacity 0.25s;'
    + '}'
    + '.tour-overlay.fade-in { opacity: 1; }'
    + '.tour-overlay.fade-out { opacity: 0; }'
    // Spotlight cutout — positioned over the target, punches a hole via overlay clip-path
    + '.tour-spotlight {'
    + '  position: fixed; z-index: 99998; border-radius: 10px;'
    + '  box-shadow: 0 0 0 4px rgba(245,158,11,0.35);'
    + '  pointer-events: none; transition: all 0.35s cubic-bezier(0.4,0,0.2,1);'
    + '}'
    // Tooltip
    + '.tour-tooltip {'
    + '  position: fixed; z-index: 99999; max-width: 380px; width: calc(100vw - 32px);'
    + '  background: var(--bg-card, #1e1e2e); border: 1px solid var(--border, #333);'
    + '  border-radius: 14px; padding: 20px 22px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.4);'
    + '  font-family: Outfit, system-ui, sans-serif; transition: all 0.3s cubic-bezier(0.4,0,0.2,1);'
    + '}'
    + '.tour-tooltip.fade-in { opacity: 1; transform: translateY(0); }'
    + '.tour-tooltip.fade-out { opacity: 0; transform: translateY(8px); }'
    // Tooltip arrow
    + '.tour-tooltip::before {'
    + '  content: ""; position: absolute; width: 14px; height: 14px;'
    + '  background: var(--bg-card, #1e1e2e); border: 1px solid var(--border, #333);'
    + '  transform: rotate(45deg); z-index: -1;'
    + '}'
    + '.tour-tooltip.arrow-top::before { top: -8px; left: 50%; margin-left: -7px; border-right: none; border-bottom: none; }'
    + '.tour-tooltip.arrow-bottom::before { bottom: -8px; left: 50%; margin-left: -7px; border-left: none; border-top: none; }'
    + '.tour-tooltip.arrow-none::before { display: none; }'
    // Tooltip internals
    + '.tour-step-badge {'
    + '  display: inline-block; font-size: 0.7em; color: var(--accent, #f59e0b); font-weight: 700;'
    + '  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;'
    + '}'
    + '.tour-title {'
    + '  font-size: 1.12em; font-weight: 700; color: var(--text-primary, #f0f0f0);'
    + '  margin-bottom: 6px; line-height: 1.3;'
    + '}'
    + '.tour-desc {'
    + '  font-size: 0.88em; color: var(--text-secondary, #a0a0b0); line-height: 1.55; margin-bottom: 16px;'
    + '}'
    + '.tour-actions {'
    + '  display: flex; justify-content: space-between; align-items: center; gap: 8px;'
    + '}'
    + '.tour-btn {'
    + '  padding: 8px 18px; border-radius: 8px; font-size: 0.85em; font-weight: 600;'
    + '  cursor: pointer; border: none; transition: all 0.15s;'
    + '}'
    + '.tour-btn-primary {'
    + '  background: var(--accent, #f59e0b); color: #000;'
    + '}'
    + '.tour-btn-primary:hover { filter: brightness(1.1); }'
    + '.tour-btn-secondary {'
    + '  background: transparent; color: var(--text-secondary, #a0a0b0); border: 1px solid var(--border, #333);'
    + '}'
    + '.tour-btn-secondary:hover { background: rgba(255,255,255,0.05); }'
    + '.tour-btn-skip {'
    + '  background: transparent; color: var(--text-muted, #666); font-size: 0.8em;'
    + '  padding: 8px 12px;'
    + '}'
    + '.tour-btn-skip:hover { color: var(--text-secondary, #a0a0b0); }'
    // Progress dots
    + '.tour-dots {'
    + '  display: flex; gap: 5px; align-items: center;'
    + '}'
    + '.tour-dot {'
    + '  width: 6px; height: 6px; border-radius: 50%; background: var(--border, #333); transition: all 0.2s;'
    + '}'
    + '.tour-dot.active { background: var(--accent, #f59e0b); width: 18px; border-radius: 3px; }'
    + '.tour-dot.done { background: var(--accent, #f59e0b); opacity: 0.4; }'
    // Floating help button
    + '#tourHelpBtn {'
    + '  position: fixed; bottom: 24px; right: 24px; z-index: 9990;'
    + '  width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--border, #333);'
    + '  background: var(--bg-card, #1e1e2e); color: var(--accent, #f59e0b);'
    + '  font-size: 1.2em; font-weight: 800; cursor: pointer;'
    + '  box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: all 0.2s;'
    + '  display: flex; align-items: center; justify-content: center;'
    + '  font-family: Outfit, system-ui, sans-serif;'
    + '}'
    + '#tourHelpBtn:hover { transform: scale(1.1); border-color: var(--accent, #f59e0b); }'
    // Help menu popover
    + '#tourHelpMenu {'
    + '  position: fixed; bottom: 78px; right: 24px; z-index: 9991;'
    + '  background: var(--bg-card, #1e1e2e); border: 1px solid var(--border, #333);'
    + '  border-radius: 12px; padding: 8px; min-width: 200px;'
    + '  box-shadow: 0 12px 40px rgba(0,0,0,0.4); display: none;'
    + '  font-family: Outfit, system-ui, sans-serif;'
    + '}'
    + '#tourHelpMenu button {'
    + '  display: block; width: 100%; text-align: left; padding: 10px 14px;'
    + '  background: transparent; border: none; color: var(--text-primary, #f0f0f0);'
    + '  font-size: 0.88em; cursor: pointer; border-radius: 8px; transition: background 0.15s;'
    + '}'
    + '#tourHelpMenu button:hover { background: rgba(255,255,255,0.06); }'
    + '#tourHelpMenu .tour-menu-label {'
    + '  padding: 6px 14px 4px; font-size: 0.72em; color: var(--text-muted, #666);'
    + '  text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;'
    + '}'
    + '#tourHelpMenu .tour-menu-divider { height: 1px; background: var(--border, #333); margin: 4px 0; }'
    // Mobile adjustments
    + '@media (max-width: 768px) {'
    + '  #tourHelpBtn { bottom: 80px; right: 16px; width: 40px; height: 40px; font-size: 1.05em; }'
    + '  #tourHelpMenu { bottom: 130px; right: 16px; }'
    + '  .tour-tooltip { max-width: calc(100vw - 24px); padding: 16px 18px 14px; }'
    + '}';
document.head.appendChild(tourStyle);

// --- Core Engine ---

export function startTour(name, steps) {
    if (tourActive) endTour();
    tourName = name;
    tourSteps = steps;
    tourCurrentStep = 0;
    tourActive = true;
    // Tour explores a profile — unlock nav gates
    window._profileExplicitlySelected = true;
    closeHelpMenu();
    createOverlayElements();
    showStep(0);
}

export function endTour(skipFlag) {
    tourActive = false;
    if (tourOverlay) { tourOverlay.style.clipPath = ''; tourOverlay.remove(); tourOverlay = null; }
    if (tourTooltip) { tourTooltip.remove(); tourTooltip = null; }
    var spotlight = document.querySelector('.tour-spotlight');
    if (spotlight) spotlight.remove();
    // Mark tour as seen
    if (skipFlag !== false) {
        try { localStorage.setItem(TOUR_SEEN_KEY, 'true'); } catch(e) {}
        if (tourName === 'welcome') {
            try { localStorage.setItem(TOUR_SEEN_WELCOME, 'true'); } catch(e) {}
        }
    }
    tourSteps = [];
    tourCurrentStep = 0;
}

export function createOverlayElements() {
    // Backdrop overlay (click to dismiss)
    tourOverlay = document.createElement('div');
    tourOverlay.className = 'tour-overlay fade-in';
    tourOverlay.onclick = function(e) {
        if (e.target === tourOverlay) endTour();
    };
    document.body.appendChild(tourOverlay);

    // Tooltip (positioned per step)
    tourTooltip = document.createElement('div');
    tourTooltip.className = 'tour-tooltip arrow-none fade-in';
    document.body.appendChild(tourTooltip);
}

export function showStep(idx) {
    if (idx < 0 || idx >= tourSteps.length) { endTour(); return; }
    tourCurrentStep = idx;
    var step = tourSteps[idx];

    // beforeShow callback (e.g., navigate to a different tab)
    try {
        if (step.beforeShow) step.beforeShow();
    } catch(err) {
        console.warn('Tour beforeShow error at step ' + idx + ':', err);
    }

    // Delay to allow DOM to settle after navigation
    var delay = step.delay || (step.beforeShow ? 450 : 50);
    setTimeout(function() { renderStep(step, idx); }, delay);
}

export function renderStep(step, idx) {
    if (!tourActive) return;

    try {
        var target = step.target ? document.querySelector(step.target) : null;
        
        // If target specified but not found, try once more after a short delay
        if (step.target && !target) {
            setTimeout(function() {
                if (!tourActive) return;
                target = document.querySelector(step.target);
                positionStep(step, idx, target);
            }, 500);
            return;
        }
        
        positionStep(step, idx, target);
    } catch(err) {
        console.warn('Tour renderStep error at step ' + idx + ':', err);
        positionStep(step, idx, null); // fallback to centered
    }
}

export function positionStep(step, idx, target) {
    if (!tourActive || !tourTooltip) return;
    
    try {
        // --- Clean up previous spotlight ---
        var existingSpot = document.querySelector('.tour-spotlight');
        if (existingSpot) existingSpot.remove();

        if (target) {
            var rect = target.getBoundingClientRect();
            var pad = step.spotlightPad || 8;
            var br = step.spotlightRadius || '10px';
            
            // Clamp spotlight to reasonable size (max 80% of viewport)
            // For huge elements (SVG, full-page containers), skip the cutout
            var maxW = window.innerWidth * 0.8;
            var maxH = window.innerHeight * 0.7;
            var tooBig = (rect.width > maxW && rect.height > maxH);
            
            if (!tooBig && rect.width > 0 && rect.height > 0) {
                // Create spotlight ring around target
                var spot = document.createElement('div');
                spot.className = 'tour-spotlight';
                spot.style.top = (rect.top - pad) + 'px';
                spot.style.left = (rect.left - pad) + 'px';
                spot.style.width = (rect.width + pad * 2) + 'px';
                spot.style.height = (rect.height + pad * 2) + 'px';
                spot.style.borderRadius = br;
                document.body.appendChild(spot);
                
                // Punch a hole in the overlay via clip-path (polygon with inner cutout)
                var sx = rect.left - pad;
                var sy = rect.top - pad;
                var sw = rect.width + pad * 2;
                var sh = rect.height + pad * 2;
                var clipPath = 'polygon('
                    + '0% 0%, 0% 100%, '
                    + sx + 'px 100%, ' + sx + 'px ' + sy + 'px, '
                    + (sx + sw) + 'px ' + sy + 'px, ' + (sx + sw) + 'px ' + (sy + sh) + 'px, '
                    + sx + 'px ' + (sy + sh) + 'px, ' + sx + 'px 100%, '
                    + '100% 100%, 100% 0%)';
                tourOverlay.style.clipPath = clipPath;
                tourOverlay.style.webkitClipPath = clipPath;
            } else {
                // Target is too big or zero-sized — just show dark overlay, no cutout
                tourOverlay.style.clipPath = '';
                tourOverlay.style.webkitClipPath = '';
            }

            // Scroll target into view if needed (only for reasonably-sized elements)
            if (!tooBig && (rect.top < 0 || rect.bottom > window.innerHeight)) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(function() {
                    if (!tourActive) return;
                    // Re-run positioning after scroll
                    positionStep(step, idx, target);
                }, 400);
                return;
            }

            // Position tooltip relative to target
            // For large targets, position tooltip at top-center of viewport instead
            if (tooBig) {
                positionTooltip(step, idx, null);
            } else {
                positionTooltip(step, idx, rect);
            }
        } else {
            // No target — full dark overlay, centered tooltip
            tourOverlay.style.clipPath = '';
            tourOverlay.style.webkitClipPath = '';
            positionTooltip(step, idx, null);
        }
    } catch(err) {
        console.warn('Tour positioning error:', err);
        // Fallback: show tooltip centered
        tourOverlay.style.clipPath = '';
        tourOverlay.style.webkitClipPath = '';
        positionTooltip(step, idx, null);
    }
}

export function positionTooltip(step, idx, targetRect) {
    if (!tourTooltip) return;
    
    // Build tooltip content
    var totalSteps = tourSteps.length;
    var isFirst = idx === 0;
    var isLast = idx === totalSteps - 1;

    var dotsHtml = '<div class="tour-dots">';
    for (var d = 0; d < totalSteps; d++) {
        var cls = d < idx ? 'done' : (d === idx ? 'active' : '');
        dotsHtml += '<div class="tour-dot ' + cls + '"></div>';
    }
    dotsHtml += '</div>';

    tourTooltip.innerHTML = ''
        + '<div class="tour-step-badge">' + (step.badge || (tourName === 'welcome' ? 'Tour' : tourName)) + ' \u00B7 ' + (idx + 1) + ' of ' + totalSteps + '</div>'
        + '<div class="tour-title">' + (step.title || '') + '</div>'
        + '<div class="tour-desc">' + (step.desc || '') + '</div>'
        + '<div class="tour-actions">'
        + (isFirst
            ? '<button class="tour-btn tour-btn-skip" onclick="window._bpTour.end()">Skip tour</button>'
            : '<button class="tour-btn tour-btn-secondary" onclick="window._bpTour.prev()">\u2190 Back</button>')
        + dotsHtml
        + (isLast
            ? '<button class="tour-btn tour-btn-primary" onclick="window._bpTour.end()">Got it! \u2713</button>'
            : '<button class="tour-btn tour-btn-primary" onclick="window._bpTour.next()">Next \u2192</button>')
        + '</div>';

    // Reset all positioning
    tourTooltip.style.top = '';
    tourTooltip.style.bottom = '';
    tourTooltip.style.left = '';
    tourTooltip.style.right = '';
    tourTooltip.style.transform = '';
    tourTooltip.style.width = '';
    tourTooltip.className = 'tour-tooltip fade-in';
    
    if (!targetRect) {
        // Center on screen (modal-style for intro/outro steps)
        tourTooltip.classList.add('arrow-none');
        tourTooltip.style.top = '50%';
        tourTooltip.style.left = '50%';
        tourTooltip.style.transform = 'translate(-50%, -50%)';
        return;
    }

    // Decide placement: prefer below, use above if not enough space
    var ttHeight = 220;
    var spaceBelow = window.innerHeight - targetRect.bottom;
    var spaceAbove = targetRect.top;
    var placement = (spaceBelow >= ttHeight + 20 || spaceBelow > spaceAbove) ? 'below' : 'above';

    // Horizontal: center on target, clamp to viewport
    var ttWidth = Math.min(380, window.innerWidth - 32);
    var leftPos = targetRect.left + (targetRect.width / 2) - (ttWidth / 2);
    leftPos = Math.max(12, Math.min(window.innerWidth - ttWidth - 12, leftPos));

    tourTooltip.style.width = ttWidth + 'px';
    tourTooltip.style.left = leftPos + 'px';

    if (placement === 'below') {
        tourTooltip.style.top = (targetRect.bottom + 16) + 'px';
        tourTooltip.classList.add('arrow-top');
    } else {
        tourTooltip.style.top = Math.max(12, targetRect.top - ttHeight - 16) + 'px';
        tourTooltip.classList.add('arrow-bottom');
    }
}

// --- Navigation Helpers ---
export function goNext() { if (tourActive) showStep(tourCurrentStep + 1); }
export function goPrev() { if (tourActive) showStep(tourCurrentStep - 1); }

// Keyboard support
document.addEventListener('keydown', function(e) {
    if (!tourActive) return;
    if (e.key === 'Escape') { endTour(); }
    else if (e.key === 'ArrowRight' || e.key === 'Enter') { goNext(); }
    else if (e.key === 'ArrowLeft') { goPrev(); }
});

// --- Help Button & Menu ---

export function createHelpButton() {
    // Floating "?" FAB
    var btn = document.createElement('button');
    btn.id = 'tourHelpBtn';
    btn.innerHTML = '?';
    btn.title = 'Take a tour';
    btn.onclick = function(e) {
        e.stopPropagation();
        toggleHelpMenu();
    };
    document.body.appendChild(btn);

    // Help menu popover
    var menu = document.createElement('div');
    menu.id = 'tourHelpMenu';
    menu.innerHTML = ''
        + '<div class="tour-menu-label">Guided Tours</div>'
        + '<button onclick="window._bpTour.startWelcome()">' + bpIcon('compass',15) + ' Full Tour</button>'
        + '<div class="tour-menu-divider"></div>'
        + '<div class="tour-menu-label">Section Tours</div>'
        + '<button onclick="window._bpTour.startMini(\'skills\')">' + bpIcon('network',15) + ' Skills Network</button>'
        + '<button onclick="window._bpTour.startMini(\'jobs\')">' + bpIcon('target',15) + ' Job Matching</button>'
        + '<button onclick="window._bpTour.startMini(\'blueprint\')">' + bpIcon('blueprint',15) + ' Blueprint Dashboard</button>'
        + '<button onclick="window._bpTour.startMini(\'samples\')">' + bpIcon('users',15) + ' Sample Profiles</button>';
    document.body.appendChild(menu);

    // Close menu when clicking elsewhere
    document.addEventListener('click', function(e) {
        var m = document.getElementById('tourHelpMenu');
        if (m && m.style.display !== 'none' && !m.contains(e.target) && e.target.id !== 'tourHelpBtn') {
            m.style.display = 'none';
        }
    });
}

export function toggleHelpMenu() {
    var menu = document.getElementById('tourHelpMenu');
    if (!menu) return;
    menu.style.display = menu.style.display === 'none' || !menu.style.display ? 'block' : 'none';
}

export function closeHelpMenu() {
    var menu = document.getElementById('tourHelpMenu');
    if (menu) menu.style.display = 'none';
}

// --- Step Definitions ---

export function getWelcomeSteps() {
    var profileName = (window._userData.profile && window._userData.profile.name) || 'this profile';
    var skillCount = (skillsData.skills || []).length;
    var jobCount = (window._userData.savedJobs || []).length;
    var topJob = (window._userData.savedJobs || [])[0];
    var topJobLabel = topJob ? (topJob.title || 'Target Role') + ' at ' + (topJob.company || 'Target Company') : '';
    var topJobScore = topJob && topJob.matchData ? topJob.matchData.score : 0;
    var tv = typeof calculateTotalMarketValue === 'function' ? calculateTotalMarketValue() : null;
    var marketVal = tv && tv.yourWorth ? '$' + Math.round(tv.yourWorth / 1000) + 'K' : '';
    var roleLevel = tv ? (tv.roleLevel || '') : '';
    var valuesCount = ((window._blueprintData.values || []).filter(function(v) { return v.selected; })).length;
    return [
        {
            title: 'Welcome to Blueprint\u2122',
            desc: 'This is <strong>' + profileName + '</strong>\u2019s career intelligence profile \u2014 skills, market value, job fit, and negotiation strategy, all in one place.'
                + '<br><br>Let\u2019s walk through the key features. This takes about 2 minutes.',
            badge: 'Overview',
            target: null,
            beforeShow: function() { switchView('skills'); },
            delay: 600
        },
        {
            title: 'The Skills Network',
            desc: 'Every node is a skill. <strong>Size</strong> = proficiency level. <strong>Color</strong> = role cluster. Connected nodes share professional context.'
                + (skillCount > 0 ? '<br><br>This profile has <strong>' + skillCount + ' skills</strong> mapped across ' + ((window._userData.roles || []).length || 'multiple') + ' professional roles.' : '')
                + '<br><br><span style="color:#60a5fa;">Try it \u2014 drag nodes to rearrange, tap one to explore.</span>',
            badge: 'Skills Architecture',
            target: '#controlsBar',
            spotlightPad: 6,
            beforeShow: function() { switchView('skills'); },
            delay: 500
        },
        {
            title: 'Evidence Behind Every Skill',
            desc: 'Each skill claim is backed by <strong>documented evidence</strong> \u2014 outcomes, metrics, and accomplishments that prove the level.'
                + '<br><br>No self-reported fluff. Blueprint tracks evidence points and calculates an <strong>effective level</strong> based on what you can actually prove.'
                + '<br><br><span style="color:#f59e0b;">Tap any skill node on the network to see its evidence.</span>',
            badge: 'Evidence System',
            target: null
        },
        {
            title: 'Job Match Intelligence',
            desc: 'Paste any job description and Blueprint parses the requirements, scores your match, and breaks down exactly where you align <span style="color:#10b981;">\u25cf</span>, where the gaps are <span style="color:#ef4444;">\u25cf</span>, and where you have leverage <span style="color:#64748b;">\u25cf</span>.'
                + (topJob ? '<br><br>This profile has <strong>' + jobCount + ' jobs</strong> analyzed. Top match: <strong>' + topJobLabel + '</strong> at <strong>' + topJobScore + '%</strong>.' : ''),
            badge: 'Job Intelligence',
            target: '#nav-jobs',
            spotlightPad: 4,
            beforeShow: function() { switchView('jobs'); },
            delay: 400
        },
        {
            title: 'Match Overlay on the Network',
            desc: 'Toggle the <strong>Match Overlay</strong> to see job fit directly on the skills network. Matched skills glow <span style="color:#10b981;">green</span>, gaps pulse <span style="color:#ef4444;">red</span>, surplus skills fade \u2014 giving you an instant visual read on any opportunity.'
                + '<br><br>This is the view that changes how you think about job fit.',
            badge: 'Visual Match',
            target: '#controlsBar',
            spotlightPad: 6,
            beforeShow: function() { switchView('skills'); },
            delay: 400
        },
        {
            title: 'Know Your Market Value',
            desc: 'Compensation powered by <strong>BLS wage data</strong>, calibrated to your function, seniority, and skill depth.'
                + (marketVal ? '<br><br>' + profileName + '\u2019s justified value: <strong>' + marketVal + '</strong> (' + roleLevel + ').' : '')
                + '<br><br>Two modes: <strong>Evidence-based</strong> (what your documented outcomes prove) and <strong>Potential</strong> (your full skill architecture).',
            badge: 'Market Valuation',
            target: null,
            beforeShow: function() { switchView('blueprint'); switchBlueprintTab('overview'); },
            delay: 400
        },
        {
            title: 'Negotiation Guide',
            desc: 'For each job, Blueprint generates a complete <strong>negotiation playbook</strong> \u2014 your opening move, the ask number, strengths to lead with, blind spots to watch for, and counter-offer responses.'
                + '<br><br>All built from your actual skills, experience, and BLS comp data. No generic advice.'
                + '<br><br><span style="color:#10b981;">Try it \u2014 click Negotiation Guide on any saved job.</span>',
            badge: 'Negotiation',
            target: null,
            beforeShow: function() { switchBlueprintTab('export'); },
            delay: 400
        },
        {
            title: 'Values Alignment',
            desc: 'Blueprint surfaces your <strong>core professional values</strong> from career patterns \u2014 not a personality quiz.'
                + (valuesCount > 0 ? ' This profile has <strong>' + valuesCount + ' values</strong> identified.' : '')
                + '<br><br>Then it maps them against <strong>company culture profiles</strong> so you can see alignment before you commit. The right job isn\u2019t just about skills \u2014 it\u2019s about fit.',
            badge: 'Values',
            target: null,
            beforeShow: function() { switchBlueprintTab('values'); },
            delay: 400
        },
        {
            title: 'The Career Dashboard',
            desc: 'The executive summary of your professional identity \u2014 market value, skill distribution, readiness score, purpose statement, and career trajectory in one view.'
                + '<br><br>Six tabs: <strong>Dashboard</strong> \u00B7 <strong>Skills</strong> \u00B7 <strong>Experience</strong> \u00B7 <strong>Outcomes</strong> \u00B7 <strong>Values</strong> \u00B7 <strong>Export</strong>.',
            badge: 'Blueprint Dashboard',
            target: '#blueprintSubnav',
            spotlightPad: 4,
            beforeShow: function() { switchView('blueprint'); switchBlueprintTab('overview'); },
            delay: 400
        },
        {
            title: 'Scouting Reports',
            desc: 'Generate a <strong>Scouting Report</strong> \u2014 an interactive career intelligence page designed to send to recruiters and hiring managers. Skills match, gap analysis, talking points, and values alignment in one shareable document.'
                + '<br><br>This isn\u2019t a resume. It\u2019s a signal that you\u2019re a different kind of candidate.'
                + (isReadOnlyProfile ? '<br><span style="color:#10b981;">Sample reports are available on the Reports page.</span>' : ''),
            badge: 'Reports',
            target: '#nav-reports',
            spotlightPad: 4,
            beforeShow: function() { switchView('reports'); },
            delay: 400
        },
        {
            title: '24 Characters. Real Blueprints.',
            desc: '<strong>Breaking Bad</strong> \u00B7 <strong>Stranger Things</strong> \u00B7 <strong>Succession</strong> \u00B7 <strong>Game of Thrones</strong> \u2014 six characters per show, each with a complete career Blueprint.'
                + '<br><br>Skills, values, job matches, market values \u2014 all fully built. Switch profiles anytime to explore.',
            badge: 'Sample Profiles',
            target: null,
            beforeShow: function() { viewSampleProfile(); },
            delay: 500
        },
        {
            title: isReadOnlyProfile ? 'Ready to Build Yours?' : 'Your Career Intelligence',
            desc: isReadOnlyProfile
                ? 'You\u2019ve seen what Blueprint does with ' + profileName + '. Imagine this with <strong>your</strong> skills, <strong>your</strong> evidence, <strong>your</strong> market value.'
                    + '<br><br>Hit <strong>?</strong> anytime for feature guides. Explore all 24 profiles. When you\u2019re ready \u2014 <strong>build yours</strong>.'
                : 'That\u2019s Blueprint \u2014 career intelligence across every dimension. Hit <strong>?</strong> anytime for section guides.'
                    + '<br><br>Your data stays yours. Export it, own it, take it anywhere.',
            badge: isReadOnlyProfile ? 'Get Started' : 'Let\u2019s Go',
            target: '#tourHelpBtn',
            spotlightPad: 6,
            spotlightRadius: '50%'
        }
    ];
}

// --- Mini Tour Definitions ---

export function getSkillsTour() {
    var skillCount = (skillsData.skills || []).length;
    return [
        {
            title: 'Your Skills, Fully Mapped',
            desc: 'Built on <strong>ESCO</strong> and <strong>O*NET</strong> taxonomies. Each node is a skill \u2014 <strong>size</strong> = proficiency, <strong>color</strong> = role cluster.' + (skillCount > 0 ? ' This profile: <strong>' + skillCount + '</strong> mapped.' : ''),
            badge: 'Map', target: '#controlsBar', spotlightPad: 6,
            beforeShow: function() { switchView('skills'); }, delay: 600
        },
        {
            title: 'Evidence, Not Buzzwords',
            desc: 'Tap any node for proficiency level, evidence from your career, and role assignment. This is proof of capability. Drag to rearrange.',
            badge: 'Map', target: null
        },
        {
            title: 'Network vs. Card View',
            desc: '<strong>Network</strong> reveals relationships and clusters. <strong>Card</strong> gives you a sortable list with proficiency badges.',
            badge: 'Map', target: '#skillsViewToggle', spotlightPad: 4
        },
        {
            title: 'Overlay Modes: The X-Ray',
            desc: 'Select a job from the Pipeline and four overlay modes appear: <strong>You</strong> \u00B7 <strong>Job</strong> \u00B7 <strong>Match</strong> \u00B7 <strong>Values</strong> \u2014 see exactly how you stack up against any role.',
            badge: 'Map', target: '#matchModeToggle', spotlightPad: 6
        }
    ];
}

export function getJobsTour() {
    var jobCount = (window._userData.savedJobs || []).length;
    return [
        {
            title: 'Intelligent Job Matching',
            desc: 'Every job scored against your actual skill portfolio \u2014 not keywords. Match percentage, BLS salary estimate, and full gap analysis.' + (jobCount > 0 ? ' Tracking <strong>' + jobCount + ' jobs</strong>.' : ''),
            badge: 'Jobs', target: null,
            beforeShow: function() { switchView('jobs'); }, delay: 500
        },
        {
            title: 'Skills Breakdown Per Job',
            desc: 'Tap any job to see <strong>matched skills</strong> (green), <strong>gaps</strong> (red), and <strong>surplus skills</strong> that give you negotiation leverage. This is the analysis recruiters do manually \u2014 Blueprint does it instantly.',
            badge: 'Jobs', target: null
        },
        {
            title: 'Pipeline \u00B7 Tracker \u00B7 Find Jobs',
            desc: '<strong>Pipeline</strong> for saved opportunities with match intelligence \u00B7 <strong>Tracker</strong> for application status and notes \u00B7 <strong>Find Jobs</strong> to add new targets.',
            badge: 'Jobs', target: null
        }
    ];
}

export function getBlueprintTour() {
    return [
        {
            title: 'The Career Intelligence Dashboard',
            desc: 'Market value, skill distribution, readiness score, purpose statement \u2014 the executive summary of your professional profile.',
            badge: 'Blueprint', target: null,
            beforeShow: function() { switchView('blueprint'); switchBlueprintTab('dashboard'); }, delay: 500
        },
        {
            title: 'Six Lenses on Your Career',
            desc: '<strong>Dashboard</strong> \u00B7 <strong>Skills</strong> \u00B7 <strong>Experience</strong> \u00B7 <strong>Outcomes</strong> \u00B7 <strong>Values</strong> \u00B7 <strong>Export</strong> \u2014 every dimension of your professional identity, quantified.',
            badge: 'Blueprint', target: '#blueprintSubnav', spotlightPad: 4
        },
        {
            title: 'Intelligence Reports',
            desc: isReadOnlyProfile
                ? '<strong>Scouting Reports</strong> \u2014 generate a PDF right now to see targeted job analysis. With your own Blueprint, unlock <strong>Negotiation Guides</strong>, <strong>Executive Blueprints</strong>, shareable HTML reports, and more.'
                : '<strong>Scouting Reports</strong> \u2014 targeted job intelligence briefs. <strong>Negotiation Guides</strong> \u2014 salary strategy backed by BLS data. <strong>Executive Blueprints</strong> \u2014 shareable career profiles. All generated in seconds.',
            badge: 'Blueprint', target: '#blueprintSubnav', spotlightPad: 4,
            beforeShow: function() { switchBlueprintTab('export'); }, delay: 400
        },
        {
            title: 'Values Alignment',
            desc: 'Your core professional values mapped against company culture profiles. See alignment scores before you interview \u2014 the right job is about fit, not just skills.',
            badge: 'Blueprint', target: '#blueprintSubnav', spotlightPad: 4,
            beforeShow: function() { switchBlueprintTab('values'); }, delay: 400
        }
    ];
}

export function getSamplesTour() {
    return [
        {
            title: 'Famous Characters. Real Blueprints.',
            desc: '<strong>24 iconic TV characters</strong> from Breaking Bad, Stranger Things, Succession, and Game of Thrones \u2014 each with a complete career Blueprint. Skills, values, job matches, market values. Tyrion Lannister: $4.2M. Tywin Lannister: $125M.',
            badge: 'Samples', target: null,
            beforeShow: function() { viewSampleProfile(); }, delay: 600
        },
        {
            title: 'Four Shows. Six Characters Each.',
            desc: 'Tap the show tabs to browse collections. <strong style="color:#22c55e;">Breaking Bad</strong> \u2014 chemists to cartel bosses. <strong style="color:#ef4444;">Stranger Things</strong> \u2014 small-town heroes. <strong style="color:#b5cc4b;">Succession</strong> \u2014 corporate royalty. <strong style="color:#B8860B;">Game of Thrones</strong> \u2014 architects of power.',
            badge: 'Samples', target: null
        },
        {
            title: 'Load a Profile. See Everything.',
            desc: 'Tap <strong>View</strong> on any character to load their complete Blueprint \u2014 skills network, job matches, compensation, values, the works. Then imagine what yours looks like.',
            badge: 'Samples', target: null
        }
    ];
}

// --- Public API ---

window._bpTour = {
    startWelcome: function() { startTour('welcome', getWelcomeSteps()); },
    startMini: function(section) {
        var tours = {
            skills: getSkillsTour,
            jobs: getJobsTour,
            blueprint: getBlueprintTour,
            samples: getSamplesTour
        };
        var fn = tours[section];
        if (fn) startTour(section, fn());
    },
    next: goNext,
    prev: goPrev,
    end: endTour,
    isActive: function() { return tourActive; }
};

// --- Auto-Trigger Logic ---
// Fire welcome tour for first-time visitors after profile loads

export function maybeAutoTour() {
    return;
}

// Initialize help button and check for auto-tour after app loads
export function initTourSystem() {
    createHelpButton();
    // Delay auto-tour check to let app fully initialize
    setTimeout(maybeAutoTour, 2500);
}

// Hook into app initialization
if (document.readyState === 'complete') {
    setTimeout(initTourSystem, 1000);
} else {
    window.addEventListener('load', function() {
        setTimeout(initTourSystem, 1000);
    });
}

window.startTour = startTour;
window.endTour = endTour;
window.createOverlayElements = createOverlayElements;
window.showStep = showStep;
window.renderStep = renderStep;
window.positionStep = positionStep;
window.positionTooltip = positionTooltip;
window.goNext = goNext;
window.goPrev = goPrev;
window.createHelpButton = createHelpButton;
window.toggleHelpMenu = toggleHelpMenu;
window.closeHelpMenu = closeHelpMenu;
window.getWelcomeSteps = getWelcomeSteps;
window.getSkillsTour = getSkillsTour;
window.getJobsTour = getJobsTour;
window.getBlueprintTour = getBlueprintTour;
window.getSamplesTour = getSamplesTour;
window.maybeAutoTour = maybeAutoTour;
window.initTourSystem = initTourSystem;
