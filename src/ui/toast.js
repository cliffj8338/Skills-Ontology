/**
 * src/ui/toast.js — Phase 1
 * showToast() / dismissToast() notification system.
 * MONOLITH LINES: 15705–15750
 * DEPENDENCIES: ui/icons.js (bpIcon), core/security.js (escapeHtml)
 * During transition: references globals bpIcon + escapeHtml from legacy.js
 */

var toastCounter = 0;

export function showToast(message, type, duration) {
    type     = type     || 'info';
    duration = duration || 4000;
    var icons = { success: 'check', error: 'x', info: 'about', warning: 'warning' };
    var id        = 'toast-' + (++toastCounter);
    var container = document.getElementById('toastContainer');
    if (!container) return;

    // Cap at 3 visible toasts
    var existing = container.querySelectorAll('.toast');
    if (existing.length >= 3) dismissToast(existing[0].id);

    var el       = document.createElement('div');
    el.id        = id;
    el.className = 'toast toast-' + type;
    el.innerHTML = '<span class="toast-icon">' + bpIcon(icons[type] || icons.info, 16) + '</span>'
        + '<div class="toast-body"><div class="toast-msg">' + escapeHtml(message) + '</div></div>'
        + '<button class="toast-close" onclick="dismissToast(\'' + id + '\')" aria-label="Close">\u00D7</button>';
    container.appendChild(el);

    requestAnimationFrame(function() {
        requestAnimationFrame(function() { el.classList.add('show'); });
    });
    el._timer = setTimeout(function() { dismissToast(id); }, duration);
}
window.showToast = showToast;

export function dismissToast(id) {
    var el = document.getElementById(id);
    if (!el) return;
    clearTimeout(el._timer);
    el.classList.remove('show');
    el.classList.add('hide');
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
}
window.dismissToast = dismissToast;
