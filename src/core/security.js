/**
 * src/core/security.js — Phase 1
 * HTML sanitization, safe localStorage, JSON parse, URL + import validators,
 * global error handlers, save debounce.
 * MONOLITH LINES: 2067–2193
 * DEPENDENCIES: none (leaf module)
 */

// ─── localStorage wrappers ────────────────────────────────────────────────────

export function safeGet(key, fallback) {
    try { return localStorage.getItem(key); } catch(e) { return fallback || null; }
}
export function safeSet(key, val) {
    try {
        localStorage.setItem(key, val);
        if (Math.random() < 0.05) {
            var total = 0;
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                total += (k.length + (localStorage.getItem(k) || '').length) * 2;
            }
            if (total > 4000000) {
                console.warn('localStorage usage high:', Math.round(total / 1024) + 'KB');
                if (typeof logIncident === 'function')
                    logIncident('warning', 'storage-quota', 'localStorage at ' + Math.round(total / 1048576 * 100) + '% capacity');
            }
        }
        return true;
    } catch(e) {
        if (typeof logIncident === 'function')
            logIncident('warning', 'storage-quota', 'localStorage write failed for ' + key + ': ' + e.message);
        return false;
    }
}
export function safeRemove(key) {
    try { localStorage.removeItem(key); } catch(e) {}
}

// ─── JSON ─────────────────────────────────────────────────────────────────────

export function safeParse(str, fallback) {
    if (!str) return fallback !== undefined ? fallback : null;
    try { return JSON.parse(str); } catch(e) { return fallback !== undefined ? fallback : null; }
}

// ─── HTML sanitization ────────────────────────────────────────────────────────

export function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}

export function decodeHtmlEntities(str) {
    if (!str || typeof str !== 'string') return str || '';
    return str
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
        .replace(/&ndash;/g, '\u2013').replace(/&mdash;/g, '\u2014').replace(/&nbsp;/g, ' ')
        .replace(/&#(\d+);/g,   function(m, c) { return String.fromCharCode(parseInt(c, 10)); })
        .replace(/&#x([0-9a-fA-F]+);/g, function(m, c) { return String.fromCharCode(parseInt(c, 16)); });
}

export function safeSetAvatar(el, url, rounded) {
    if (!el) return;
    if (url) {
        var img = document.createElement('img');
        img.src = url; img.alt = '';
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;' + (rounded ? 'border-radius:50%;' : '');
        el.innerHTML = '';
        el.appendChild(img);
    }
}

// ─── URL sanitizer ────────────────────────────────────────────────────────────

export function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '#';
    var t = url.trim();
    if (/^https?:\/\//i.test(t)) return t;
    if (/^mailto:/i.test(t)) return t;
    return '#';
}

// ─── Import validator ─────────────────────────────────────────────────────────

export function sanitizeImport(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid import: not an object');
    var allowed = ['profile','skills','roles','values','purpose','outcomes','preferences',
        'applications','workHistory','education','certifications','verifications',
        'savedJobs','initialized','templateId','linkedinContent','companyTenures',
        'importStats','contentVisibility','careerLens'];
    var clean = {};
    allowed.forEach(function(key) { if (raw[key] !== undefined) clean[key] = raw[key]; });
    delete clean.role; delete clean.isAdmin;
    if (clean.profile && typeof clean.profile === 'object') {
        Object.keys(clean.profile).forEach(function(k) {
            if (typeof clean.profile[k] === 'string') clean.profile[k] = clean.profile[k].slice(0, 2000);
        });
    }
    if (Array.isArray(clean.skills)) {
        clean.skills = clean.skills.filter(function(s) { return s && typeof s === 'object'; });
        clean.skills.forEach(function(s) {
            if (typeof s.name  === 'string') s.name  = s.name.slice(0, 200);
            if (typeof s.level === 'string') s.level = s.level.slice(0, 50);
            if (typeof s.category === 'string') s.category = s.category.slice(0, 100);
        });
    }
    if (Array.isArray(clean.roles)) {
        clean.roles = clean.roles.filter(function(r) { return r && typeof r === 'object'; });
        clean.roles.forEach(function(r) {
            if (typeof r.name    === 'string') r.name    = r.name.slice(0, 200);
            if (typeof r.company === 'string') r.company = r.company.slice(0, 200);
        });
    }
    if (Array.isArray(clean.savedJobs)) {
        clean.savedJobs.forEach(function(j) {
            if (j && j.sourceUrl) j.sourceUrl = sanitizeUrl(j.sourceUrl);
        });
    }
    return clean;
}

// ─── Global error handlers ────────────────────────────────────────────────────

window.onerror = function(msg, url, line, col, error) {
    try {
        if (typeof logIncident === 'function')
            logIncident('error', 'runtime', String(msg).slice(0, 200) + ' at line ' + line,
                { col, stack: error && error.stack ? error.stack.slice(0, 500) : '' });
    } catch(e) {}
    return false;
};
window.addEventListener('unhandledrejection', function(event) {
    try {
        var msg = (event.reason && event.reason.message) ? event.reason.message : String(event.reason);
        if (typeof logIncident === 'function')
            logIncident('warning', 'unhandled-promise', String(msg).slice(0, 200));
    } catch(e) {}
});

// ─── Save debounce ────────────────────────────────────────────────────────────

var _saveDebounceTimer = null;
export function debouncedSave(delay) {
    if (_saveDebounceTimer) clearTimeout(_saveDebounceTimer);
    _saveDebounceTimer = setTimeout(function() {
        _saveDebounceTimer = null;
        if (typeof saveToFirestore === 'function') saveToFirestore();
    }, delay || 2000);
}
window.debouncedSave = debouncedSave;
