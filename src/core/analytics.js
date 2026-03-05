/**
 * src/core/analytics.js — Phase 2
 * bpTracker: session tracking, view timing, feature usage, funnel analytics.
 * MONOLITH LINES: 2195–2375
 * DEPENDENCIES: core/security.js (safeGet, safeSet, safeParse)
 * During transition: fbDb, fbUser referenced as globals from legacy.js
 */

import { safeGet, safeSet, safeParse } from './security.js';

export var bpTracker = {
    sid: null, vid: null, sessStart: null, curView: null, viewStart: null,
    viewTimes: {}, hbInterval: null, isNew: false,

    init: function() {
        this.vid = safeGet('bpVisitorId');
        if (!this.vid) {
            this.vid = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
            safeSet('bpVisitorId', this.vid);
            this.isNew = true;
        }
        this.sid = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4);
        this.sessStart = Date.now();

        this.log('session_start', { referrer: document.referrer || 'direct', isNew: this.isNew });
        this.log('device_info', {
            screenW: screen.width, screenH: screen.height,
            vpW: window.innerWidth, vpH: window.innerHeight,
            mobile: window.innerWidth <= 768,
            dark: document.body?.classList?.contains('dark-theme') || window.matchMedia('(prefers-color-scheme: dark)').matches,
            lang: navigator.language
        });

        var self = this;
        this.hbInterval = setInterval(function() { self.flush(); }, 30000);
        window.addEventListener('beforeunload', function() { self.end(); });
        document.addEventListener('visibilitychange', function() {
            document.hidden ? self.pauseView() : self.resumeView();
        });

        var visits = parseInt(safeGet('bpVisitCount') || '0') + 1;
        safeSet('bpVisitCount', String(visits));
        safeSet('bpLastVisit', new Date().toISOString());
        if (!safeGet('bpFirstVisit')) safeSet('bpFirstVisit', new Date().toISOString());
    },

    trackView: function(v) {
        if (!v) return;
        if (this.curView && this.viewStart) {
            var el = Math.round((Date.now() - this.viewStart) / 1000);
            if (el > 0 && el < 3600) this.viewTimes[this.curView] = (this.viewTimes[this.curView] || 0) + el;
        }
        this.curView = v; this.viewStart = Date.now();
        this.log('page_view', { view: v });
    },

    pauseView: function() {
        if (this.curView && this.viewStart) {
            var el = Math.round((Date.now() - this.viewStart) / 1000);
            if (el > 0 && el < 3600) this.viewTimes[this.curView] = (this.viewTimes[this.curView] || 0) + el;
            this.viewStart = null;
        }
    },

    resumeView: function() { if (this.curView) this.viewStart = Date.now(); },

    trackFeature: function(name, extra) {
        this.log('feature_use', Object.assign({ feature: name }, extra || {}));
    },

    trackFunnel: function(step) {
        this.log('funnel', { step: step });
        var order = ['visit', 'signup', 'profile_created', 'skills_added', 'first_job', 'report_generated'];
        var cur = safeGet('bpFunnelStep') || 'visit';
        if (order.indexOf(step) > order.indexOf(cur)) safeSet('bpFunnelStep', step);
    },

    flush: function() {
        var dur = Math.round((Date.now() - this.sessStart) / 1000);
        var d = this.getData(); var today = new Date().toISOString().slice(0, 10);
        if (!d.sessions[today]) d.sessions[today] = [];
        var found = false;
        for (var i = 0; i < d.sessions[today].length; i++) {
            if (d.sessions[today][i].sid === this.sid) {
                d.sessions[today][i].dur = dur;
                d.sessions[today][i].vt = Object.assign({}, this.viewTimes);
                found = true; break;
            }
        }
        if (!found) d.sessions[today].push({ sid: this.sid, vid: this.vid, start: this.sessStart, dur: dur, vt: Object.assign({}, this.viewTimes), isNew: this.isNew });
        this.saveData(d);
    },

    end: function() {
        clearInterval(this.hbInterval); this.pauseView(); this.flush();
        var dur = Math.round((Date.now() - this.sessStart) / 1000);
        var pvCount = 0; var d = this.getData(); var today = new Date().toISOString().slice(0, 10);
        var dpv = d.pageViews[today] || {}; Object.values(dpv).forEach(function(v) { pvCount += v; });
        this.log('session_end', { duration: dur, pvCount: pvCount });
    },

    log: function(type, evData) {
        var d = this.getData(); var today = new Date().toISOString().slice(0, 10);
        if (type === 'page_view') {
            if (!d.pageViews[today]) d.pageViews[today] = {};
            var vw = evData.view || 'unknown';
            d.pageViews[today][vw] = (d.pageViews[today][vw] || 0) + 1;
            d.totalPV = (d.totalPV || 0) + 1;
        }
        if (type === 'feature_use') {
            if (!d.features[today]) d.features[today] = {};
            d.features[today][evData.feature] = (d.features[today][evData.feature] || 0) + 1;
        }
        if (type === 'device_info') {
            if (!d.devices) d.devices = { mobile: 0, desktop: 0, dark: 0, light: 0, sizes: {} };
            evData.mobile ? d.devices.mobile++ : d.devices.desktop++;
            evData.dark ? d.devices.dark++ : d.devices.light++;
            var sk = evData.screenW + 'x' + evData.screenH;
            d.devices.sizes[sk] = (d.devices.sizes[sk] || 0) + 1;
        }
        if (type === 'session_start') {
            if (!d.dailySess) d.dailySess = {};
            d.dailySess[today] = (d.dailySess[today] || 0) + 1;
            d.totalSess = (d.totalSess || 0) + 1;
            if (evData.isNew) { if (!d.newVis) d.newVis = {}; d.newVis[today] = (d.newVis[today] || 0) + 1; }
        }
        if (type === 'funnel') { if (!d.funnel) d.funnel = {}; d.funnel[evData.step] = (d.funnel[evData.step] || 0) + 1; }
        if (type === 'session_end' && evData.pvCount <= 1) { if (!d.bounces) d.bounces = {}; d.bounces[today] = (d.bounces[today] || 0) + 1; }
        this.saveData(d);

        // Firestore (non-blocking, transition globals)
        if (type !== 'device_info' && window.fbDb && window.fbUser) {
            try {
                window.fbDb.collection('site_analytics').add({
                    type: type, data: evData || {}, uid: window.fbUser.uid,
                    vid: this.vid, sid: this.sid,
                    ts: firebase.firestore.FieldValue.serverTimestamp(),
                    date: today
                });
            } catch(e) {}
        }
    },

    getData: function() {
        return safeParse(safeGet('bpSiteAnalytics'), {
            pageViews: {}, sessions: {}, dailySess: {}, features: {},
            devices: { mobile: 0, desktop: 0, dark: 0, light: 0, sizes: {} },
            funnel: {}, bounces: {}, newVis: {}, totalPV: 0, totalSess: 0
        });
    },

    saveData: function(d) { safeSet('bpSiteAnalytics', JSON.stringify(d)); },

    getStats: function(days) {
        var d = this.getData(); var dates = []; var now = new Date();
        for (var i = 0; i < days; i++) { var dt = new Date(now); dt.setDate(dt.getDate() - i); dates.push(dt.toISOString().slice(0, 10)); }
        var sess = 0, pv = 0, bnc = 0, nv = 0, viewCts = {}, featCts = {}, dailyPV = [], dailySess = [], totDur = 0, sessCt = 0, viewDurs = {};
        dates.forEach(function(date) {
            var ds = d.dailySess[date] || 0; sess += ds; dailySess.push({ date: date, count: ds });
            bnc += d.bounces[date] || 0; nv += d.newVis[date] || 0;
            var dpv = d.pageViews[date] || {}; var dt2 = 0;
            Object.keys(dpv).forEach(function(v) { viewCts[v] = (viewCts[v] || 0) + dpv[v]; dt2 += dpv[v]; });
            pv += dt2; dailyPV.push({ date: date, count: dt2 });
            var df = d.features[date] || {};
            Object.keys(df).forEach(function(f) { featCts[f] = (featCts[f] || 0) + df[f]; });
            (d.sessions[date] || []).forEach(function(s) {
                if (s.dur > 0) { totDur += s.dur; sessCt++; }
                if (s.vt) Object.keys(s.vt).forEach(function(v) { viewDurs[v] = (viewDurs[v] || 0) + s.vt[v]; });
            });
        });
        return {
            sessions: sess, pageViews: pv, bounceRate: sess > 0 ? Math.round(bnc / sess * 100) : 0,
            newVisitors: nv, returning: sess - nv,
            avgDuration: sessCt > 0 ? Math.round(totDur / sessCt) : 0, totalDuration: totDur,
            viewsPerSession: sess > 0 ? (pv / sess).toFixed(1) : '0',
            viewCounts: viewCts, viewDurations: viewDurs, featureCounts: featCts,
            dailyPV: dailyPV.reverse(), dailySessions: dailySess.reverse(),
            devices: d.devices || {}, funnel: d.funnel || {}
        };
    }
};

window.bpTracker = bpTracker;
