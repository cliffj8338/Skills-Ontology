export function _sd() {
    if (window._skillsData) return window._skillsData;
    var ud = window._userData;
    return { skills: (ud && ud.skills) || [], roles: (ud && ud.roles) || [], skillDetails: (ud && ud.skillDetails) || {} };
}

export function _bd() {
    if (window._blueprintData) return window._blueprintData;
    var ud = window._userData;
    return { values: (ud && ud.values) || [], outcomes: (ud && ud.outcomes) || [], purpose: (ud && ud.purpose) || '', certifications: (ud && ud.certifications) || [], education: (ud && ud.education) || [] };
}

export function waitForUserData() {
    if (window._userData && window._userData.initialized) return Promise.resolve();
    if (window._userDataReady) return window._userDataReady;
    return new Promise(function(resolve) {
        var _t = 0, _p = setInterval(function() {
            _t++;
            if (window._userData && window._userData.initialized) { clearInterval(_p); resolve(); }
            else if (_t > 50) { clearInterval(_p); console.warn('[data-helpers] waitForUserData timed out after 10s'); resolve(); }
        }, 200);
    });
}
