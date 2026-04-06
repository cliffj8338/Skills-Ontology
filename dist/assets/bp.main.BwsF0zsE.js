import{c as ot,a as Si,d as nt,e as w,B as Ei}from"./bp.core.Cw3r0I38.js";import{a as at,b as f,s as x}from"./bp.firebase.BXHiXDMC.js";import"./bp.engines.Tpqxaq1e.js";import{_ as D,a as k,w as Bi}from"./bp.views.BSyKfEic.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function i(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(a){if(a.ep)return;a.ep=!0;const n=i(a);fetch(a.href,n)}})();var rt={credentials:[]};function Ii(e){if(!e||e.length<2)return[];var t=e.toLowerCase();return(rt.credentials||[]).filter(function(i){return i.name.toLowerCase().includes(t)||i.abbr.toLowerCase().includes(t)||i.description.toLowerCase().includes(t)||i.category.toLowerCase().includes(t)}).slice(0,15)}window.searchCertLibrary=Ii;function Ci(e){if(!e)return null;var t=e.toLowerCase().trim();return(rt.credentials||[]).find(function(i){return i.abbr.toLowerCase()===t||i.name.toLowerCase()===t})||null}window.findCertInLibrary=Ci;function Li(e){return e?e.skills&&e.skills.length>0?e.skills.slice():Mi(e):[]}window.getCertSkillAssociations=Li;function Mi(e){if(!e)return[];var t=["and","the","for","with","from","that","this","level","based","state","national","professional","certified","certification","license","advanced"],i=(e.description+" "+e.category+" "+e.name).toLowerCase().split(/[\s,.\-\/]+/).filter(function(n){return n.length>3&&t.indexOf(n)<0}),o=[],a=(typeof skillsData<"u"?skillsData.skills:null)||[];return a.forEach(function(n){var r=n.name.toLowerCase(),l=i.filter(function(d){return r.includes(d)}).length;l>0&&o.push({name:n.name,score:l})}),o.sort(function(n,r){return r.score-n.score}),o.slice(0,6).map(function(n){return n.name})}function Di(e){var t=typeof evidenceConfig<"u"&&evidenceConfig.certFloor?evidenceConfig.certFloor:"Proficient";return e?e.tier===2?"Advanced":"Proficient":t}window.getCertFloorLevel=Di;var Me=!1;window._skipHistoryPush=!1;function Ti(){var e=ot("wbTheme")||"dark";document.documentElement.setAttribute("data-theme",e);var t=document.getElementById("themeToggleBtn");t&&(t.textContent=e==="light"?"☀️":"🌙")}window.initTheme||(window.initTheme=Ti);function se(e){if(e){var t=e.split(" ").map(function(r){return r[0]}).join("").slice(0,2).toUpperCase(),i=document.getElementById("profileAvatar"),o=document.getElementById("profileChipName");if(i){var a=window.appContext&&window.appContext.mode==="demo",n=window.userData&&window.userData.profile&&window.userData.profile.photo||!a&&window.fbUser&&window.fbUser.photoURL||null;n?Si(i,n,!0):i.textContent=t}o&&(o.textContent=e),document.title="Blueprint™"}}window.updateProfileChip||(window.updateProfileChip=se);function Ai(){var e=document.getElementById("filterPanel"),t=document.getElementById("filterToggleBtn"),i=e.classList.toggle("open");t.classList.toggle("active",i)}window.toggleFilterPanel||(window.toggleFilterPanel=Ai);function $i(){st()||(lt(),typeof saveValues=="function"&&saveValues(),window.fbUser&&window.fbDb&&at())}window.saveAll||(window.saveAll=$i);function lt(){try{if(window.appContext&&window.appContext.mode==="demo")return!0;var e=window.userData&&window.userData.templateId||Object.keys(window.templates||{})[0]||"walter-white";return nt("currentProfile",e),console.log("✓ Profile preference saved:",e),window.fbUser&&window.fbDb&&at(),!0}catch(t){return console.error("Error saving profile preference:",t),!1}}window.saveUserData||(window.saveUserData=lt);var Y=!1;function de(){if(window.showcaseMode){Y=!0,window.isReadOnlyProfile=!0,document.body.classList.add("readonly-mode");return}var e=window.userData&&window.userData.templateId||"",t=e.indexOf("demo")!==-1||e.indexOf("sample")!==-1;!t&&window.profilesManifest&&window.profilesManifest.profiles&&(t=window.profilesManifest.profiles.some(function(l){return l.id===e})),Y=t&&!window.fbIsAdmin,window.isReadOnlyProfile=Y,document.body.classList.toggle("readonly-mode",Y);var i=document.getElementById("readonlyBanner"),o=w(window.userData&&window.userData.profile&&window.userData.profile.name||"Sample Profile");if(t){if(!i){i=document.createElement("div"),i.id="readonlyBanner",i.className="readonly-banner",i.style.cssText="display:block !important; text-align:center; padding:10px 16px; font-size:0.88em; word-spacing:normal; white-space:normal;";var a=document.querySelector(".header");a&&a.parentNode.insertBefore(i,a.nextSibling)}var n=window.appContext&&window.appContext.mode==="demo",r="";window.fbIsAdmin?r=f(n?"eye":"lock",14)+" <strong>Viewing: "+o+"</strong> · "+(n?"Demo Mode":"Admin mode")+' · <a href="#" onclick="event.preventDefault(); exitDemoMode();" style="color:inherit; text-decoration:underline; font-weight:700;">← Return to my profile</a>':window.fbUser&&n?r=f("eye",14)+" <strong>Viewing: "+o+'</strong> · Demo Mode · <a href="#" onclick="event.preventDefault(); exitDemoMode();" style="color:inherit; text-decoration:underline; font-weight:700;">← Return to my profile</a>':window.appMode==="waitlisted"?r=f("lock",14)+" <strong>Viewing: "+o+'</strong> · Sample profile. You’re #<span id="bannerPosition">'+(window.waitlistPosition||"...")+"</span> on the waitlist.":window.fbUser?r=f("lock",14)+" <strong>Viewing: "+o+'</strong> · Sample profile. <a href="#" onclick="event.preventDefault(); loadUserFromFirestore(fbUser.uid);" style="color:inherit; text-decoration:underline; font-weight:700;">← Back to my profile</a>':r=f("lock",14)+" <strong>Viewing: "+o+`</strong> · Sample profile. <a href="#" onclick="event.preventDefault(); showWaitlist();" style="color:inherit; text-decoration:underline; font-weight:700;">Join the waitlist</a> for early access or <a href="#" onclick="event.preventDefault(); showAuthModal('signin');" style="color:inherit; text-decoration:underline;">sign in</a>.`,i.innerHTML=r,i.style.cssText="display:block !important; text-align:center; padding:10px 16px; font-size:0.88em; word-spacing:normal; white-space:normal;"}else i&&(i.style.display="none")}window.checkReadOnly||(window.checkReadOnly=de);function st(){return Y?(dt("edit this profile"),!0):!1}window.readOnlyGuard||(window.readOnlyGuard=st);function zi(){if(!window.showcaseMode){if(window.fbUser&&window.fbIsAdmin){window.appMode="active";return}if(window.fbUser&&window.userData&&window.userData.templateId&&window.userData.templateId.indexOf("firestore")!==-1){window.appMode="active";return}try{var e=new URLSearchParams(window.location.search),t=e.get("invite");if(t&&window.fbDb){window.appMode="invited",window.fbDb.collection("waitlist").doc(t).get().then(function(a){a.exists&&a.data().status==="invited"?(nt("blueprint_waitlist",JSON.stringify({name:a.data().name,email:a.data().email,status:"invited",position:a.data().position})),window.waitlistEmail=a.data().email,window.history&&window.history.replaceState&&window.history.replaceState(null,"",window.location.pathname+window.location.hash)):window.appMode="demo"}).catch(function(){});return}}catch{}var i=ot("blueprint_waitlist");if(i)try{var o=JSON.parse(i);if(o.status==="invited"){window.appMode="invited";return}if(o.status==="waiting"){window.appMode="waitlisted",window.waitlistPosition=o.position||null,window.waitlistEmail=o.email||null;return}}catch{}if(window.fbUser){window.appMode="invited";return}window.appMode="demo"}}window.detectAppMode||(window.detectAppMode=zi);function dt(e){if(window.appMode==="active"||window.appMode==="invited")return!1;if(window.showcaseMode)return x("Editing disabled in showcase mode","info"),!0;var t=window.appMode==="waitlisted",i=t?"You’re #"+(window.waitlistPosition||"?")+" on the waitlist! We’ll unlock <strong>"+e+"</strong> when it’s your turn.":"Join the waitlist to unlock <strong>"+e+"</strong> and build your own Blueprint.",o=t?"Check Your Position":"Join the Waitlist",a=t?"closeExportModal(); showToast('You are #"+(window.waitlistPosition||"?")+" on the waitlist. We will be in touch!', 'info');":"closeExportModal(); showWaitlist();",n=document.getElementById("exportModal"),r=n.querySelector(".modal-content");return r.innerHTML='<div class="modal-header"><div class="modal-header-left"><h2 class="modal-title">'+f("lock",18)+' Early Access Feature</h2></div><button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()">×</button></div><div class="modal-body" style="padding:40px 32px; text-align:center;"><div style="font-size:2.8em; margin-bottom:16px; opacity:0.8;">◈</div><div style="font-size:1.1em; color:var(--text-primary); margin-bottom:8px; font-weight:600;">This feature is available to invited members</div><div style="font-size:0.9em; color:var(--text-secondary); margin-bottom:24px; line-height:1.6;">'+i+'</div><button onclick="'+a+'" style="padding:12px 32px; border-radius:10px; border:none; background:linear-gradient(135deg,#3b82f6,#1d4ed8); color:#fff; font-weight:700; font-size:0.95em; cursor:pointer;">'+o+'</button><div style="margin-top:16px; font-size:0.78em; color:var(--text-muted);">Explore sample profiles in the meantime — they’re fully interactive.</div></div>',history.pushState({modal:!0},""),n.classList.add("active"),!0}window.demoGate||(window.demoGate=dt);function Pi(e,t){if(window.appMode==="active"||window.appMode==="invited")return"";var i=window.appMode==="waitlisted"?"showToast('You are on the waitlist! We will unlock this soon.', 'info')":"showWaitlist()",o=window.appMode==="waitlisted"?"You’re on the list ✔":"Join Waitlist for Access";return'<div class="gated-prompt"><div class="gp-icon">'+f("lock",48)+'</div><div class="gp-title">'+e+'</div><div class="gp-text">'+t+'</div><button class="gp-btn" onclick="'+i+'">'+o+"</button></div>"}window.gatedPromptHTML||(window.gatedPromptHTML=Pi);function Ae(e){if(!(window.appContext&&window.appContext.mode==="demo")){var t=e||window.appContext&&window.appContext.demoTemplateId||"breaking-bad";if(!window.templates||!window.templates[t]){x("Demo profile not available.","error");return}window.appContext.userSnapshot=JSON.parse(JSON.stringify(window.userData)),window.appContext.skillsSnapshot={roles:JSON.parse(JSON.stringify(window.skillsData.roles||[])),skills:JSON.parse(JSON.stringify(window.skillsData.skills||[]))},window.appContext.blueprintSnapshot={values:JSON.parse(JSON.stringify(window.blueprintData.values||[])),outcomes:JSON.parse(JSON.stringify(window.blueprintData.outcomes||[])),purpose:window.blueprintData.purpose||""};var i=document.querySelector(".nav-btn.active");window.appContext.returnView=i&&i.dataset.view||"network",window.appContext.mode="demo",window.appContext.demoTemplateId=t,typeof loadTemplate=="function"&&loadTemplate(t),typeof normalizeUserRoles=="function"&&normalizeUserRoles(),window.skillsData.skills=window.userData.skills,window.skillsData.roles=window.userData.roles,window.blueprintData.values=[],window.blueprintData.outcomes=[],window.blueprintData.purpose="",typeof inferValues=="function"&&inferValues(),typeof extractOutcomesFromEvidence=="function"&&extractOutcomesFromEvidence(),typeof rescoreAllJobs=="function"&&rescoreAllJobs(),window.blueprintInitialized=window.opportunitiesInitialized=window.applicationsInitialized=window.networkInitialized=window.cardViewInitialized=!1,de(),$e(),se(window.userData.profile.name||"Demo Profile"),typeof clearJobOverlay=="function"&&clearJobOverlay(),z("network"),setTimeout(function(){window.scrollTo(0,0)},50),setTimeout(function(){typeof renderJobSelectorWidget=="function"&&renderJobSelectorWidget()},500),x("Exploring demo: "+(window.userData.profile.name||t)+". Your data is safely preserved.","info",3e3)}}window.enterDemoMode||(window.enterDemoMode=Ae);function ct(){if(!window.appContext||window.appContext.mode!=="demo"||!window.appContext.userSnapshot){window.fbUser&&window.fbDb&&typeof loadUserFromFirestore=="function"&&loadUserFromFirestore(window.fbUser.uid).then(function(){typeof normalizeUserRoles=="function"&&normalizeUserRoles(),window.blueprintInitialized=window.networkInitialized=window.cardViewInitialized=!1,de(),se(window.userData.profile.name||"My Profile"),z("blueprint")});return}window.userData=window.appContext.userSnapshot,window._userData=window.userData,window.skillsData.roles=window.appContext.skillsSnapshot.roles,window.skillsData.skills=window.appContext.skillsSnapshot.skills,window.blueprintData.values=window.appContext.blueprintSnapshot.values,window.blueprintData.outcomes=window.appContext.blueprintSnapshot.outcomes,window.blueprintData.purpose=window.appContext.blueprintSnapshot.purpose,window.appContext.userSnapshot=window.appContext.skillsSnapshot=window.appContext.blueprintSnapshot=null,window.appContext.mode="live",typeof normalizeUserRoles=="function"&&normalizeUserRoles(),typeof rescoreAllJobs=="function"&&rescoreAllJobs(),window.blueprintInitialized=window.opportunitiesInitialized=window.applicationsInitialized=window.networkInitialized=window.cardViewInitialized=!1,de(),$e(),se(window.userData.profile.name||"My Profile"),typeof clearJobOverlay=="function"&&clearJobOverlay(),z("blueprint"),setTimeout(function(){window.scrollTo(0,0)},50),x("Welcome back! Your Blueprint is restored.","info",2e3),typeof rebuildProfileDropdown=="function"&&rebuildProfileDropdown()}window.exitDemoMode||(window.exitDemoMode=ct);function Oi(){window.appContext&&window.appContext.mode==="demo"?ct():Ae()}window.toggleDemoMode||(window.toggleDemoMode=Oi);function Ni(e){if(!window.appContext||window.appContext.mode!=="demo"){Ae(e);return}!window.templates||!window.templates[e]||(window.appContext.demoTemplateId=e,typeof loadTemplate=="function"&&loadTemplate(e),typeof normalizeUserRoles=="function"&&normalizeUserRoles(),window.skillsData.skills=window.userData.skills,window.skillsData.roles=window.userData.roles,window.blueprintData.values=[],window.blueprintData.outcomes=[],window.blueprintData.purpose="",typeof inferValues=="function"&&inferValues(),typeof extractOutcomesFromEvidence=="function"&&extractOutcomesFromEvidence(),typeof rescoreAllJobs=="function"&&rescoreAllJobs(),window.blueprintInitialized=window.opportunitiesInitialized=window.networkInitialized=window.cardViewInitialized=!1,de(),se(window.userData.profile.name||e),typeof clearJobOverlay=="function"&&clearJobOverlay(),z("network"))}window.switchDemoProfile||(window.switchDemoProfile=Ni);function $e(){var e=document.getElementById("demoModeToggle"),t=document.getElementById("demoModeIndicator");if(e){e.style.display=window.fbUser?"":"none";var i=window.appContext&&window.appContext.mode==="demo";e.classList.toggle("demo-active",i),e.title=i?"Return to My Blueprint":"Explore Demo Profiles",t&&(t.style.display=i?"":"none")}}window.updateDemoToggleUI||(window.updateDemoToggleUI=$e);function z(e,t){if(e==="skills"&&(e="network"),e==="jobs"&&(e="opportunities"),e==="applications"&&(e="opportunities",window.jobsSubTab="tracker"),window.bpTracker&&window.bpTracker.sid&&window.bpTracker.trackView(e),window.currentView=e,window.scrollTo(0,0),e!=="network"&&window.simulation)try{window.simulation.stop()}catch{}if(e!=="admin"){var i=document.getElementById("tourHelpBtn");i&&(i.style.display="")}var o={network:"Map",opportunities:"Jobs",blueprint:"Blueprint",reports:"Reports",settings:"Settings",consent:"Settings",welcome:"Home",admin:"Admin"},a=document.getElementById("srAnnounce");a&&(a.textContent=(o[e]||e)+" view"),Me||history.pushState({view:e},"","#"+e),document.querySelectorAll(".nav-btn").forEach(function(M){M.classList.remove("active"),M.removeAttribute("aria-current")});var n={network:"nav-skills",skills:"nav-skills",opportunities:"nav-jobs",jobs:"nav-jobs",applications:"nav-jobs",blueprint:"nav-blueprint",reports:"nav-reports",settings:"nav-settings",consent:"nav-settings"},r=n[e];if(r){var l=document.getElementById(r);l&&(l.classList.add("active"),l.setAttribute("aria-current","page"))}var d=document.getElementById("controlsBar");d&&(d.style.display="none");var s=document.querySelector(".main-content");if(s){s.classList.remove("with-filters","with-controls");var c=document.getElementById("readonlyBanner")&&document.getElementById("readonlyBanner").style.display!=="none";s.classList.toggle("with-banner",!!c)}if(e!=="network"){["matchModeToggle","matchActiveBadge"].forEach(function(M){var F=document.getElementById(M);F&&(F.style.display="none")}),["matchLegend","jobInfoTile","valuesAlignmentPanel","mobileNetworkBadge"].forEach(function(M){var F=document.getElementById(M);F&&F.remove()});var p=document.getElementById("roleInfoCard");p&&(p.style.display="none")}document.querySelectorAll(".mobile-nav-btn").forEach(function(M){M.classList.remove("active"),M.removeAttribute("aria-current")});var g={network:"mob-skills",opportunities:"mob-jobs",applications:"mob-jobs",blueprint:"mob-blueprint",reports:"mob-reports",settings:"mob-settings",consent:"mob-settings"},u=g[e];if(u){var y=document.getElementById(u);y&&(y.classList.add("active"),y.setAttribute("aria-current","page"))}["welcomeView","networkView","cardView","opportunitiesView","applicationsView","blueprintView","consentView","settingsView","reportsView"].forEach(function(M){var F=document.getElementById(M);F&&(F.style.display="none")});var h=document.getElementById("skillsPageHeader");h&&(h.style.display="none");var b=document.getElementById("networkJobSelector");b&&b.remove();var v=document.getElementById("inlineJobSelector");v&&(v.style.display="none",v.innerHTML="");var m=document.getElementById("jobSelectorDropdown");m&&m.remove();var E=document.getElementById("adminView");E&&(E.style.display="none");var B=document.querySelector(".controls");B&&(B.style.display="none");var O=document.getElementById("readonlyBanner");O&&(e==="welcome"||e==="consent"||e==="admin"?O.style.display="none":Y&&(O.style.cssText="display:block !important; text-align:center; padding:10px 16px; font-size:0.88em; word-spacing:normal; white-space:normal;"));var H=document.getElementById("appFooter");if(H&&(H.style.display=e==="welcome"||e==="admin"?"none":"block"),e==="welcome"){var ve=document.getElementById("welcomeView");ve&&(ve.style.display="block"),!window._welcomePickerActive&&typeof renderWelcomePage=="function"&&renderWelcomePage(),window._welcomePickerActive=!1}else if(e==="network"){if(B&&(B.style.display="flex"),s&&s.classList.add("with-controls"),document.querySelectorAll("#skillsViewToggle .view-pill").forEach(function(M){M.classList.toggle("active",M.dataset.view===window.currentSkillsView)}),window.currentSkillsView==="network"){var V=document.getElementById("networkView");V&&(V.style.display="block");var C=document.getElementById("networkLabelToggles");C&&(C.style.display=window.innerWidth>=768?"flex":"none");var ee=document.getElementById("filterToggleBtn");ee&&(ee.style.display="none");var te=document.getElementById("filterPanel");te&&te.classList.remove("open");var W=document.getElementById("networkFilterPill");W&&(W.style.display=window.activeRole&&window.activeRole!=="all"?"flex":"none"),!window.networkInitialized&&typeof initNetwork=="function"&&(initNetwork(),window.networkInitialized=!0),setTimeout(function(){typeof renderJobSelectorWidget=="function"&&renderJobSelectorWidget()},100),window.activeJobForNetwork&&(typeof updateMatchOverlayUI=="function"&&updateMatchOverlayUI(),window.networkMatchMode!=="you"&&typeof setNetworkMatchMode=="function"&&setNetworkMatchMode(window.networkMatchMode))}else{var ie=document.getElementById("cardView");ie&&(ie.style.display="block");var N=document.getElementById("networkLabelToggles");N&&(N.style.display="none");var oe=document.getElementById("filterToggleBtn");oe&&(oe.style.display="none");var q=document.getElementById("filterPanel");q&&(q.classList.remove("open"),q.style.display="none");var Je=document.getElementById("networkFilterPill");Je&&(Je.style.display="none"),!window.cardViewInitialized&&typeof initCardView=="function"&&(initCardView(),window.cardViewInitialized=!0),setTimeout(function(){typeof renderJobSelectorWidget=="function"&&renderJobSelectorWidget()},100)}typeof updateStatsBar=="function"&&updateStatsBar()}else if(e==="opportunities"){var Ye=document.getElementById("opportunitiesView");Ye&&(Ye.style.display="block"),typeof initOpportunities=="function"&&(window.opportunitiesInitialized?initOpportunities():(initOpportunities(),window.opportunitiesInitialized=!0)),typeof updateStatsBar=="function"&&updateStatsBar()}else if(e==="applications"){var Ge=document.getElementById("applicationsView");Ge&&(Ge.style.display="block"),!window.applicationsInitialized&&typeof initApplications=="function"&&(initApplications(),window.applicationsInitialized=!0),typeof updateStatsBar=="function"&&updateStatsBar()}else if(e==="blueprint"){var Ke=document.getElementById("blueprintView");Ke&&(Ke.style.display="block"),!window.blueprintInitialized&&typeof initBlueprint=="function"&&(initBlueprint(),window.blueprintInitialized=!0),typeof updateStatsBar=="function"&&updateStatsBar()}else if(e==="consent"){var Qe=document.getElementById("consentView");Qe&&(Qe.style.display="block"),!window.consentInitialized&&typeof initConsent=="function"&&(initConsent(),window.consentInitialized=!0),typeof updateStatsBar=="function"&&updateStatsBar()}else if(e==="reports"){var Xe=document.getElementById("reportsView");Xe&&(Xe.style.display="block"),!window.reportsInitialized&&typeof initReports=="function"&&(initReports(),window.reportsInitialized=!0),typeof updateStatsBar=="function"&&updateStatsBar()}else if(e==="settings"){var Ze=document.getElementById("settingsView");Ze&&(Ze.style.display="block"),!window.settingsInitialized&&typeof initSettings=="function"&&(initSettings(),window.settingsInitialized=!0),typeof updateStatsBar=="function"&&updateStatsBar()}else if(e==="admin"){var et=document.getElementById("adminView");et&&(et.style.display="block",typeof initAdminView=="function"&&initAdminView())}}window.switchView||(window.switchView=z);function _i(e){window.currentSkillsView=e,document.querySelectorAll("#skillsViewToggle .view-pill").forEach(function(v){v.classList.toggle("active",v.dataset.view===e)});var t=document.getElementById("matchModeToggle"),i=document.getElementById("matchActiveBadge");if(e==="network"){var o=document.getElementById("networkView");o&&(o.style.display="block");var a=document.getElementById("cardView");a&&(a.style.display="none");var n=document.getElementById("networkLabelToggles");n&&(n.style.display=window.innerWidth>=768?"flex":"none"),!window.networkInitialized&&typeof initNetwork=="function"&&(initNetwork(),window.networkInitialized=!0);var r=document.getElementById("filterToggleBtn");r&&(r.style.display="none");var l=document.getElementById("filterPanel");l&&l.classList.remove("open");var d=document.getElementById("networkFilterPill");if(d&&(d.style.display=window.activeRole&&window.activeRole!=="all"?"flex":"none"),window.activeJobForNetwork){t&&(t.style.display="inline-flex");var s=document.getElementById("matchActiveTitle");s&&(s.textContent=window.activeJobForNetwork.title||"Job Match"),i&&(i.style.display="inline-flex");var c=window.networkMatchMode;typeof initMatchNetwork=="function"&&c==="match"?initMatchNetwork(window.activeJobForNetwork):typeof initValuesNetwork=="function"&&c==="values"?initValuesNetwork(window.activeJobForNetwork):typeof initJobNetwork=="function"&&c==="job"?initJobNetwork(window.activeJobForNetwork):(window.networkInitialized=!1,typeof initNetwork=="function"&&initNetwork(),window.networkInitialized=!0)}}else{var p=document.getElementById("networkView");p&&(p.style.display="none");var g=document.getElementById("cardView");g&&(g.style.display="block");var u=document.getElementById("networkLabelToggles");u&&(u.style.display="none"),!window.cardViewInitialized&&typeof initCardView=="function"&&(initCardView(),window.cardViewInitialized=!0);var y=document.getElementById("filterToggleBtn");y&&(y.style.display="none");var h=document.getElementById("filterPanel");h&&(h.classList.remove("open"),h.style.display="none");var b=document.getElementById("networkFilterPill");b&&(b.style.display="none"),["jobInfoTile","matchLegend","valuesAlignmentPanel","roleInfoCard","mobileNetworkBadge","jobSelectorDropdown"].forEach(function(v){var m=document.getElementById(v);m&&(v==="roleInfoCard"?m.style.display="none":m.remove())}),window.jobSelectorExpanded=!1,t&&(t.style.display="none"),i&&(i.style.display="none")}}window.toggleSkillsView||(window.toggleSkillsView=_i);document.addEventListener("keydown",function(e){var t=(e.target.tagName||"").toLowerCase();if(!(t==="input"||t==="textarea"||e.target.isContentEditable)){var i=document.getElementById("exportModal");if(!(i&&i.style.display!=="none"&&i.style.display!=="")&&!(window._bpTour&&document.querySelector(".tour-overlay"))&&!(e.altKey||e.ctrlKey||e.metaKey))switch(e.key){case"1":e.preventDefault(),z("skills");break;case"2":e.preventDefault(),z("jobs");break;case"3":e.preventDefault(),z("blueprint");break;case"4":e.preventDefault(),z("reports");break;case"5":e.preventDefault(),z("settings");break;case"?":e.preventDefault(),typeof showHelp=="function"&&showHelp();break}}});window.addEventListener("popstate",function(e){var t=document.querySelector(".modal.active");if(t){t.classList.remove("active");return}var i=e.state&&e.state.view?e.state.view:"welcome";Me=!0,window._skipHistoryPush=!0,z(i),Me=!1,window._skipHistoryPush=!1});async function Ri(){(!window._userData||!window._userData.initialized)&&await Bi();const e=document.getElementById("applicationsView");e.innerHTML=`
        <div class="applications-header">
            <h2 style="font-size: 2em; color: #60a5fa; margin-bottom: 10px;">Application Tracker</h2>
            <p style="color: #9ca3af; margin-bottom: 20px;">Track your job applications and follow-ups</p>
            <button class="export-btn-large" onclick="addApplicationModal()" style="display: inline-flex; align-items: center; gap: 8px;">
                ${f("plus",14)} Add Application
            </button>
        </div>
        
        <div id="applicationsContainer"></div>
    `,X()}function X(){const e=document.getElementById("applicationsContainer");if(!window._userData.applications||window._userData.applications.length===0){e.innerHTML=`
            <div style="text-align: center; padding: 60px 20px; color: #9ca3af;">
                <div style="margin-bottom: 20px;">${f("clipboard",48)}</div>
                <h3 style="color: #d1d5db; margin-bottom: 10px;">No applications tracked yet</h3>
                <p>Click "Add Application" above to start tracking your job search</p>
                <div style="margin-top: 30px; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto;">
                    <strong style="color: #60a5fa;">Track from Opportunities:</strong>
                    <p style="font-size: 0.9em; margin-top: 8px;">When you generate a pitch for a job, you'll have the option to automatically add it to your application tracker.</p>
                </div>
            </div>
        `;return}const t={applied:window._userData.applications.filter(i=>i.status==="applied"),interviewing:window._userData.applications.filter(i=>i.status==="interviewing"),offer:window._userData.applications.filter(i=>i.status==="offer"),rejected:window._userData.applications.filter(i=>i.status==="rejected")};e.innerHTML=`
        <div style="margin-bottom: 30px; display: flex; gap: 15px; flex-wrap: wrap;">
            <div class="application-status status-applied">${t.applied.length} Applied</div>
            <div class="application-status status-interviewing">${t.interviewing.length} Interviewing</div>
            <div class="application-status status-offer">${t.offer.length} Offers</div>
            <div class="application-status status-rejected">${t.rejected.length} Closed</div>
        </div>
        
        <div class="applications-grid">
            ${window._userData.applications.map((i,o)=>pt(i,o)).join("")}
        </div>
    `}function pt(e,t){const i={applied:"Applied",interviewing:"Interviewing",offer:"Offer Received",rejected:"Closed"};return`
        <div class="application-card">
            <div class="application-status status-${e.status}">
                ${i[e.status]}
            </div>
            
            <div class="application-title">${e.title}</div>
            <div class="application-company">${e.company}</div>
            
            <div class="application-meta-grid">
                <div class="application-meta-item">
                    <div class="application-meta-label">Applied</div>
                    <div class="application-meta-value">${new Date(e.appliedDate).toLocaleDateString()}</div>
                </div>
                <div class="application-meta-item">
                    <div class="application-meta-label">Match</div>
                    <div class="application-meta-value">${e.matchScore||"N/A"}%</div>
                </div>
                ${e.salary?`
                    <div class="application-meta-item">
                        <div class="application-meta-label">Salary</div>
                        <div class="application-meta-value">${e.salary}</div>
                    </div>
                `:""}
                ${e.nextFollowUp?`
                    <div class="application-meta-item">
                        <div class="application-meta-label">Follow Up</div>
                        <div class="application-meta-value">${new Date(e.nextFollowUp).toLocaleDateString()}</div>
                    </div>
                `:""}
            </div>
            
            ${e.notes?`
                <div class="application-notes">
                    ${f("edit",12)} ${e.notes}
                </div>
            `:""}
            
            <div class="application-actions">
                <button class="application-btn" onclick="updateApplicationStatus(${t})">
                    ${f("clock",12)} Update Status
                </button>
                <button class="application-btn" onclick="editApplication(${t})">
                    ✏️ Edit
                </button>
                ${e.url?`
                    <button class="application-btn" onclick="window.open('${sanitizeUrl(e.url)}', '_blank')">
                        ${f("external",12)} View Job
                    </button>
                `:""}
                <button class="application-btn delete" onclick="deleteApplication(${t})">
                    ${f("trash",14)} Remove
                </button>
            </div>
        </div>
    `}function Ui(e=null){if(readOnlyGuard())return;const t=document.getElementById("exportModal"),i=t.querySelector(".modal-content");i.innerHTML=`
        <div class="modal-header">
            <div class="modal-header-left">
                <h2 class="modal-title">Add Application</h2>
                <p style="color: #9ca3af; margin-top: 5px;">Track a job you've applied to</p>
            </div>
            <button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()">×</button>
        </div>
        <div class="modal-body" style="padding: 30px;">
            <div style="display: grid; gap: 20px;">
                <div>
                    <label class="settings-label">Job Title *</label>
                    <input type="text" id="appTitle" value="${e?.title||""}" class="settings-input" required>
                </div>
                
                <div>
                    <label class="settings-label">Company *</label>
                    <input type="text" id="appCompany" value="${e?.company||""}" class="settings-input" required>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <label class="settings-label">Applied Date *</label>
                        <input type="date" id="appDate" value="${new Date().toISOString().split("T")[0]}" class="settings-input" required>
                    </div>
                    <div>
                        <label class="settings-label">Status</label>
                        <select id="appStatus" class="settings-select">
                            <option value="applied">Applied</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="offer">Offer Received</option>
                            <option value="rejected">Closed</option>
                        </select>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <label class="settings-label">Salary Range</label>
                        <input type="text" id="appSalary" value="${e?.salary||""}" placeholder="e.g., $150k-$200k" class="settings-input">
                    </div>
                    <div>
                        <label class="settings-label">Match Score</label>
                        <input type="number" id="appMatch" value="${e?.matchScore||""}" min="0" max="100" class="settings-input">
                    </div>
                </div>
                
                <div>
                    <label class="settings-label">Job URL</label>
                    <input type="url" id="appUrl" value="${e?.url||""}" placeholder="https://" class="settings-input">
                </div>
                
                <div>
                    <label class="settings-label">Follow-Up Date</label>
                    <input type="date" id="appFollowUp" class="settings-input">
                </div>
                
                <div>
                    <label class="settings-label">Notes</label>
                    <textarea id="appNotes" class="purpose-editor" style="min-height: 80px;" placeholder="Contact names, interview details, etc."></textarea>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: flex-end; margin-top: 25px;">
                <button class="action-btn" onclick="closeExportModal()" style="padding: 10px 20px;">
                    Cancel
                </button>
                <button class="export-btn-large" onclick="saveApplication()" style="padding: 10px 20px;">
                    ${f("plus",14)} Add Application
                </button>
            </div>
        </div>
    `,history.pushState({modal:!0},""),t.classList.add("active")}function Vi(){if(readOnlyGuard())return;const e=document.getElementById("appTitle").value.trim(),t=document.getElementById("appCompany").value.trim();if(!e||!t){x("Please enter job title and company.","warning");return}const i={id:Date.now(),title:e,company:t,appliedDate:document.getElementById("appDate").value,status:document.getElementById("appStatus").value,salary:document.getElementById("appSalary").value.trim(),matchScore:document.getElementById("appMatch").value?parseInt(document.getElementById("appMatch").value):null,url:document.getElementById("appUrl").value.trim(),nextFollowUp:document.getElementById("appFollowUp").value||null,notes:document.getElementById("appNotes").value.trim()};window._userData.applications||(window._userData.applications=[]),window._userData.applications.unshift(i),saveUserData(),closeExportModal(),X(),x("Application added.","success")}function Fi(e){const t=window._userData.applications[e],i=prompt(`Update status for "${t.title}":

1 = Applied
2 = Interviewing
3 = Offer
4 = Closed

Enter number:`,t.status==="applied"?"1":t.status==="interviewing"?"2":t.status==="offer"?"3":"4");if(i){const o={1:"applied",2:"interviewing",3:"offer",4:"rejected"};window._userData.applications[e].status=o[i]||t.status,saveUserData(),X()}}function Hi(e){if(readOnlyGuard())return;const t=window._userData.applications[e],i=document.getElementById("exportModal"),o=i.querySelector(".modal-content");o.innerHTML=`
        <div class="modal-header">
            <div class="modal-header-left">
                <h2 class="modal-title">Edit Application</h2>
            </div>
            <button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()">×</button>
        </div>
        <div class="modal-body" style="padding: 30px;">
            <div style="display: grid; gap: 20px;">
                <div>
                    <label class="settings-label">Job Title</label>
                    <input type="text" id="editAppTitle" value="${t.title}" class="settings-input">
                </div>
                
                <div>
                    <label class="settings-label">Company</label>
                    <input type="text" id="editAppCompany" value="${t.company}" class="settings-input">
                </div>
                
                <div>
                    <label class="settings-label">Status</label>
                    <select id="editAppStatus" class="settings-select">
                        <option value="applied" ${t.status==="applied"?"selected":""}>Applied</option>
                        <option value="interviewing" ${t.status==="interviewing"?"selected":""}>Interviewing</option>
                        <option value="offer" ${t.status==="offer"?"selected":""}>Offer Received</option>
                        <option value="rejected" ${t.status==="rejected"?"selected":""}>Closed</option>
                    </select>
                </div>
                
                <div>
                    <label class="settings-label">Follow-Up Date</label>
                    <input type="date" id="editAppFollowUp" value="${t.nextFollowUp||""}" class="settings-input">
                </div>
                
                <div>
                    <label class="settings-label">Notes</label>
                    <textarea id="editAppNotes" class="purpose-editor" style="min-height: 80px;">${w(t.notes||"")}</textarea>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: flex-end; margin-top: 25px;">
                <button class="action-btn" onclick="closeExportModal()">Cancel</button>
                <button class="export-btn-large" onclick="saveApplicationEdit(${e})">${f("save",14)} Save Changes</button>
            </div>
        </div>
    `,history.pushState({modal:!0},""),i.classList.add("active")}function ji(e){readOnlyGuard()||(window._userData.applications[e].title=document.getElementById("editAppTitle").value,window._userData.applications[e].company=document.getElementById("editAppCompany").value,window._userData.applications[e].status=document.getElementById("editAppStatus").value,window._userData.applications[e].nextFollowUp=document.getElementById("editAppFollowUp").value||null,window._userData.applications[e].notes=document.getElementById("editAppNotes").value.trim(),saveUserData(),closeExportModal(),X())}function Wi(e){const t=window._userData.applications[e];confirm(`Remove "${t.title}" at ${t.company} from tracker?`)&&(window._userData.applications.splice(e,1),saveUserData(),X())}let qi={full:{name:"Full Transparency",skills:"all",outcomes:"all",values:"all",purpose:!0},executive:{name:"Executive Brief",skills:"top20",outcomes:"all",values:"all",purpose:!0},advisory:{name:"Advisory Pitch",skills:"strategic",outcomes:"strategic",values:"all",purpose:!0},board:{name:"Board Candidate",skills:"leadership",outcomes:"business",values:"selected",purpose:!0},custom:{name:"Custom",skills:"selected",outcomes:"selected",values:"selected",purpose:!0}},j="custom";function ut(){const e=document.getElementById("consentView");e.innerHTML=`
        <div class="blueprint-container">
            
            
            ${ft()}
            ${gt()}
            ${vt()}
        </div>
    `}function ft(){return`
        <div class="blueprint-section">
            <div class="blueprint-section-header">
                <div class="blueprint-section-title">
                    <span class="section-icon">${f("preferences",18)}</span>
                    <span>Share Profile Presets</span>
                </div>
            </div>
            
            <div class="coaching-tip">
                <div class="coaching-tip-title">
                    ${f("lightbulb",14)} CHOOSE YOUR SHARING LEVEL
                </div>
                <div class="coaching-tip-content">
                    Select a preset that matches your audience, or use Custom to choose exactly what to share.
                    All presets respect your individual item toggles from the Blueprint.
                </div>
            </div>
            
            <div class="values-grid">
                ${Object.entries(qi).map(([e,t])=>mt(e,t)).join("")}
            </div>
            ${j==="custom"?'<div style="margin-top:12px; padding:10px 14px; background:rgba(96,165,250,0.08); border-left:3px solid #60a5fa; border-radius:4px; font-size:0.85em; color:var(--c-heading);">'+f("info",12)+" Custom mode active. Manage individual share toggles for outcomes and values in the Blueprint tab. Skills are included based on your profile data.</div>":""}
        </div>
    `}function mt(e,t){const i=j===e?"selected":"";var o=(k().skills||[]).length,a=k().skills.filter(function(c){return c.key}).length,n=k().skills.filter(function(c){return c.key||c.level==="Mastery"}).length,r=(D().outcomes||[]).length,l=(D().values||[]).filter(function(c){return c.selected}).length;function d(c,p,g){var u=[];return u.push(c+" skill"+(c!==1?"s":"")),u.push(p>0?p+" outcome"+(p!==1?"s":""):"no outcomes yet"),u.push(g>0?g+" value"+(g!==1?"s":""):"no values yet"),u.join(", ")}const s={full:d(o,r,l)+", and purpose",executive:"Top "+Math.min(20,o)+" skills + "+(r>0?"all outcomes":"no outcomes yet")+", ideal for executive search",advisory:a+" strategic skill"+(a!==1?"s":"")+" + "+(r>0?"relevant outcomes":"no outcomes yet")+", for advisory and consulting",board:n+" leadership skill"+(n!==1?"s":"")+" + "+(r>0?"business outcomes":"no outcomes yet")+", for board positions",custom:"Granular control. Toggle individual skills, outcomes, and values in the Blueprint tab."};return`
        <div class="value-card ${i}" onclick="selectPreset('${e}')">
            <div class="value-title">${t.name}</div>
            <div class="value-description">${s[e]}</div>
        </div>
    `}function gt(){var e=(k().skills||[]).length,t=j==="full"?e:j==="executive"?Math.min(20,e):j==="advisory"?k().skills.filter(function(s){return s.key}).length:j==="board"?k().skills.filter(function(s){return s.key||s.level==="Mastery"}).length:e,i=(D().outcomes||[]).length,o=D().outcomes.filter(s=>s.shared).length,a=(D().values||[]).length,n=D().values.filter(s=>s.selected).length,r=t<e?'<div style="font-size:0.72em; color:#9ca3af; margin-top:4px;">of '+e+" total</div>":"",l=i===0?'<div style="font-size:0.72em; color:#f59e0b; margin-top:4px;">None added yet</div>':o<i?'<div style="font-size:0.72em; color:#9ca3af; margin-top:4px;">of '+i+" total</div>":"",d=a===0?'<div style="font-size:0.72em; color:#f59e0b; margin-top:4px;">None added yet</div>':n<a?'<div style="font-size:0.72em; color:#9ca3af; margin-top:4px;">of '+a+" total</div>":"";return`
        <div class="blueprint-section">
            <div class="blueprint-section-header">
                <div class="blueprint-section-title">
                    <span class="section-icon">${f("bar-chart",18)}</span>
                    <span>What You're Sharing</span>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 8px; padding: 20px; text-align: center;">
                    <div style="font-size: 2em; color: #60a5fa; font-weight: bold;">${t}</div>
                    <div style="color: #9ca3af; margin-top: 5px;">Skills</div>
                    ${r}
                </div>
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 20px; text-align: center;">
                    <div style="font-size: 2em; color: ${i===0?"#64748b":"#10b981"}; font-weight: bold;">${o}</div>
                    <div style="color: #9ca3af; margin-top: 5px;">Outcomes</div>
                    ${l}
                </div>
                <div style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 8px; padding: 20px; text-align: center;">
                    <div style="font-size: 2em; color: ${a===0?"#64748b":"#fbbf24"}; font-weight: bold;">${n}</div>
                    <div style="color: #9ca3af; margin-top: 5px;">Values</div>
                    ${d}
                </div>
                <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 8px; padding: 20px; text-align: center;">
                    <div style="font-size: 2em; color: #a78bfa; font-weight: bold;">✓</div>
                    <div style="color: #9ca3af; margin-top: 5px;">Purpose</div>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(251, 191, 36, 0.1); border-left: 3px solid #fbbf24; border-radius: 4px;">
                <strong style="color: #fbbf24;">Note:</strong> 
                <span style="color: #d1d5db;">Sensitive content (recovery, personal loss) is flagged in Blueprint. Review before sharing.</span>
            </div>
        </div>
    `}function vt(){var e="var(--c-heading)",t="var(--c-accent-deep)",i="var(--c-muted)",o="var(--c-surface-1)",a="var(--c-amber-border-3)";return'<div id="disclaimerSection" class="blueprint-section"><div class="blueprint-section-header"><div class="blueprint-section-title"><span class="section-icon">'+f("warning",20)+'</span><span>Disclaimer & Terms of Use</span></div></div><div style="padding:20px; background:var(--c-amber-bg-2c); border:1px solid '+a+'; border-radius:10px; margin-bottom:24px;"><p style="color:'+e+'; line-height:1.7; margin:0; font-size:0.95em;"><strong style="color:var(--c-warn);">Blueprint is a personal demonstration project provided as-is for educational and illustrative purposes only.</strong> It is not a commercial product and carries no warranty of any kind, express or implied.</p></div><div style="color:'+e+'; line-height:1.7; font-size:0.93em;"><div style="padding:16px; background:'+o+'; border-radius:8px; margin-bottom:12px;"><h4 style="color:'+t+'; margin:0 0 8px 0;">Data Accuracy</h4><p style="margin:0;">Skill taxonomies, market valuations, compensation estimates, and any generated content may contain errors, omissions, or outdated information. ESCO, O*NET, and other referenced datasets are used under their respective licenses and may not reflect current labor market conditions. No figure produced by this tool should be treated as a verified market rate or guaranteed outcome.</p></div><div style="padding:16px; background:'+o+'; border-radius:8px; margin-bottom:12px;"><h4 style="color:'+t+'; margin:0 0 8px 0;">Not Professional Advice</h4><p style="margin:0;">Nothing in this application constitutes legal, financial, career, compensation, or employment advice. Users should consult qualified professionals before making decisions based on any information presented here.</p></div><div style="padding:16px; background:'+o+'; border-radius:8px; margin-bottom:12px;"><h4 style="color:'+t+'; margin:0 0 8px 0;">No Liability</h4><p style="margin:0;">The creator of this tool accepts no responsibility for decisions made, opportunities pursued or declined, salary negotiations conducted, or any other action taken based on information generated by this application.</p></div><div style="padding:16px; background:'+o+'; border-radius:8px; margin-bottom:12px;"><h4 style="color:'+t+'; margin:0 0 8px 0;">Local Data Only</h4><p style="margin:0;">All user data is stored in your browser’s local storage. No data is transmitted to or stored on any server. Clearing your browser data will permanently delete your profile. The creator has no access to your data.</p></div><div style="padding:16px; background:'+o+'; border-radius:8px; margin-bottom:12px;"><h4 style="color:'+t+'; margin:0 0 8px 0;">Third-Party AI</h4><p style="margin:0;">The onboarding wizard uses the Anthropic API to parse resumes and infer skills. Resume text submitted during onboarding is sent to Anthropic’s servers and is subject to <a href="https://www.anthropic.com/policies" target="_blank" rel="noopener" style="color:'+t+'; text-decoration:underline;">Anthropic’s usage policies</a>. No resume data is stored by this application after processing. The LinkedIn data import option parses your .zip archive entirely in-browser using JSZip and PapaParse. No LinkedIn data leaves your device during CSV parsing. A small Claude API call may be used to infer skill levels from your job titles.</p></div><div style="padding:16px; background:'+o+'; border-radius:8px; margin-bottom:12px;"><h4 style="color:'+t+'; margin:0 0 8px 0;">Demonstration Profiles</h4><p style="margin:0;">Pre-loaded demo profiles represent real professional histories and are included with the profile owner’s consent. Do not redistribute demo profile data.</p></div><div style="padding:16px; background:var(--c-red-bg-1); border:1px solid var(--c-red-border-1); border-radius:8px; margin-bottom:12px;"><h4 style="color:var(--c-danger-light); margin:0 0 8px 0;">Use at Your Own Risk</h4><p style="margin:0;">By using this tool, you acknowledge these limitations and accept full responsibility for how you apply its outputs.</p></div></div></div><div class="blueprint-section"><div class="blueprint-section-header"><div class="blueprint-section-title"><span class="section-icon">'+f("scale",20)+'</span><span>Privacy & Data Rights</span></div></div><div style="color:'+e+'; line-height:1.7;"><p style="margin-bottom:20px;">When signed in, your Blueprint data is stored securely in Firebase (Google Cloud). When not signed in, data persists locally in your browser. You have complete control over what you share, when you share it, and with whom.</p><h4 style="color:'+t+'; margin-bottom:10px;">Relevant Privacy Laws:</h4><div style="padding:10px; background:'+o+'; margin-bottom:8px; border-radius:6px;"><strong>🇺🇸 CCPA (California Consumer Privacy Act)</strong><br><span style="font-size:0.9em; color:'+i+';">Right to know what data is collected, right to delete, right to opt-out of sale</span><br><a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer" style="color:'+t+'; text-decoration:none; font-size:0.85em;">Learn more →</a></div><div style="padding:10px; background:'+o+'; margin-bottom:8px; border-radius:6px;"><strong>🇪🇺 GDPR (General Data Protection Regulation)</strong><br><span style="font-size:0.9em; color:'+i+';">Right to access, rectify, erase, and port your personal data</span><br><a href="https://gdpr.eu/" target="_blank" rel="noopener noreferrer" style="color:'+t+'; text-decoration:none; font-size:0.85em;">Learn more →</a></div><div style="padding:10px; background:'+o+'; margin-bottom:8px; border-radius:6px;"><strong>📋 Employment Data Rights (US)</strong><br><span style="font-size:0.9em; color:'+i+';">Employers must handle your data fairly and cannot discriminate based on protected characteristics</span><br><a href="https://www.eeoc.gov/" target="_blank" rel="noopener noreferrer" style="color:'+t+'; text-decoration:none; font-size:0.85em;">EEOC Guidelines →</a></div><h4 style="color:'+t+'; margin:25px 0 10px 0;">Best Practices:</h4><div style="color:'+e+'; line-height:2;">• Never share sensitive personal information (SSN, financial details)<br>• Review what you are sharing before exporting<br>• Keep Blueprint data up to date but do not embellish<br>• Consider context before sharing recovery or advocacy work</div></div></div><div class="blueprint-section"><div class="blueprint-section-header"><div class="blueprint-section-title"><span class="section-icon">'+f("lock",20)+'</span><span>Your Data Rights</span></div></div><div style="color:var(--c-heading); line-height:1.7; font-size:0.93em;"><p style="margin-bottom:16px;">Under GDPR and similar privacy regulations, you have the right to access, export, and delete your personal data at any time. Use the controls below to exercise these rights.</p><div style="display:flex; gap:12px; flex-wrap:wrap;"><button onclick="viewMyData()" style="background:var(--c-accent-bg-5a); border:1px solid var(--c-accent-border-4); color:var(--c-accent-deep); padding:12px 20px; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.9em;">📄 View My Stored Data</button><button onclick="exportMyData()" style="background:var(--c-green-bg-4b); border:1px solid var(--c-green-border-2b); color:var(--c-success); padding:12px 20px; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.9em;">📥 Export My Data (JSON)</button><button onclick="requestDataDeletion()" style="background:var(--c-red-bg-2a); border:1px solid var(--c-red-border-2); color:var(--c-danger); padding:12px 20px; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.9em;">🗑 Delete All My Data</button></div><div style="margin-top:12px; font-size:0.82em; color:var(--c-faint);">You must be signed in to use these features. Data deletion is permanent and cannot be undone.</div></div></div>'}function wt(e){var t=e.files[0];if(t){if(t.size>2*1024*1024){x("Image must be under 2MB.","warning");return}var i=new FileReader;i.onload=function(o){var a=new Image;a.onload=function(){var n=document.createElement("canvas");n.width=128,n.height=128;var r=n.getContext("2d"),l=Math.min(a.width,a.height),d=(a.width-l)/2,s=(a.height-l)/2;r.drawImage(a,d,s,l,l,0,0,128,128);var c=n.toDataURL("image/jpeg",.8);window._userData.profile.photo=c;var p=document.getElementById("settingPhotoPreview");safeSetAvatar(p,c,!1);var g=document.getElementById("profileAvatar");safeSetAvatar(g,c,!0),saveUserData(),x("Profile photo updated.","success")},a.src=o.target.result},i.readAsDataURL(t)}}window.handleProfilePhoto||(window.handleProfilePhoto=wt);function yt(){delete window._userData.profile.photo;var e=document.getElementById("profileAvatar");e&&(e.textContent=(window._userData.profile.name||"U").split(" ").map(function(t){return t[0]}).join("").slice(0,2).toUpperCase()),saveUserData(),window.settingsInitialized=!1,initSettings(),window.settingsInitialized=!0}window.removeProfilePhoto||(window.removeProfilePhoto=yt);function bt(){if(!readOnlyGuard()){window._userData.profile.name=(document.getElementById("settingName")||{}).value||window._userData.profile.name,window._userData.profile.email=(document.getElementById("settingEmail")||{}).value||window._userData.profile.email||"",window._userData.profile.phone=(document.getElementById("settingPhone")||{}).value||window._userData.profile.phone||"",window._userData.profile.linkedinUrl=(document.getElementById("settingLinkedIn")||{}).value||window._userData.profile.linkedinUrl||"";var e=document.getElementById("settingLocation");e&&(window._userData.profile.location=e.value);var t=document.getElementById("settingComp");if(t){var i=parseInt((t.value||"").replace(/[^0-9]/g,""),10);window._userData.profile.reportedComp=i>0?i:null}var o=document.getElementById("settingSeniority"),a=o?o.value:window._userData.preferences.seniorityLevel;window._userData.preferences.seniorityLevel=a;var n=document.getElementById("settingMinSalary");if(n){var r=n.value;window._userData.preferences.minSalary=r?parseInt(r):null}a==="Entry"?(window._userData.preferences.seniorityKeywords=["junior","associate","entry","coordinator"],window._userData.preferences.excludeRoles=["senior","lead","manager","director","vp","chief","principal"]):a==="Mid"?(window._userData.preferences.seniorityKeywords=["senior","lead","manager","specialist"],window._userData.preferences.excludeRoles=["junior","entry","associate","intern"]):a==="Senior"?(window._userData.preferences.seniorityKeywords=["senior manager","director","senior director","principal"],window._userData.preferences.excludeRoles=["junior","entry","mid-level","associate"]):(window._userData.preferences.seniorityKeywords=["vp","vice president","chief","head of","director","principal","senior director"],window._userData.preferences.excludeRoles=["engineer","developer","designer","analyst","coordinator","specialist","junior","mid-level","associate","intern","entry"]),window._userData.profile.name&&updateProfileChip(window._userData.profile.name),saveUserData(),x("Settings saved. Go to Opportunities and click Find Matching Jobs to see updated results.","success",5e3)}}window.saveSettings||(window.saveSettings=bt);function ht(e){if(j=e,window._userData.preferences||(window._userData.preferences={}),window._userData.preferences.sharingPreset=e,e==="full"?(D().outcomes.forEach(function(i){i.shared=!0}),D().values.forEach(function(i){i.selected=!0})):e==="executive"?(D().outcomes.forEach(function(i){i.shared=!0}),D().values.forEach(function(i){i.selected=!0})):e==="advisory"?(D().outcomes.forEach(function(i){i.shared=i.category==="Strategic Foresight"||i.category==="Thought Leadership"||i.category==="Business Impact"}),D().values.forEach(function(i){i.selected=!0})):e==="board"&&(D().outcomes.forEach(function(i){i.shared=i.category==="Business Impact"||i.category==="Crisis Leadership"||i.category==="Entrepreneurial"}),D().values.forEach(function(i){i.selected=!0})),saveUserData(),window.currentSettingsTab==="privacy"){var t=document.getElementById("settingsTabContent");t&&(t.innerHTML=renderSettingsTabContent())}else ut()}window.selectPreset||(window.selectPreset=ht);function Ji(e){const t=e.toLowerCase().trim();if(currentSkillsView==="network"){const o=d3.select("#networkView");o.selectAll(".node").style("opacity",function(r){return r.type!=="skill"||!t||r.name.toLowerCase().includes(t)?1:.1}),o.selectAll(".node-label").style("opacity",function(r){return r.type!=="skill"||!t||r.name.toLowerCase().includes(t)?1:.1})}else{var i=document.querySelectorAll(".domain-card");i.forEach(function(o){var a=o.querySelectorAll(".skill-item"),n=!1;a.forEach(function(r){var l=r.querySelector(".skill-name"),d=l?l.textContent.toLowerCase():"";!t||d.includes(t)?(r.style.display="",n=!0):r.style.display="none"}),o.style.display=n||!t?"":"none"})}}function Yi(){const e=calculateTotalMarketValue(),t=document.getElementById("exportModal"),i=t.querySelector(".modal-content"),o=k().skills.map(n=>{const r=ae(n);return{name:n.name,level:n.level,category:n.category,impact:r,impactLevel:r.level}}),a={critical:1,high:2,moderate:3,standard:4,supplementary:5};o.sort((n,r)=>{const l=a[n.impactLevel]-a[r.impactLevel];return l!==0?l:n.name.localeCompare(r.name)}),i.innerHTML=`
        <div class="modal-header">
            <div class="modal-header-left">
                <h2 class="modal-title">All ${k().skills.length} Skills</h2>
                <p style="color: #9ca3af; margin-top: 5px;">Complete list with impact ratings</p>
            </div>
            <button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()">×</button>
        </div>
        <div class="modal-body" style="padding: 30px; max-height: 70vh; overflow-y: auto;">
            <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; text-align: center;">
                    <div>
                        <div style="color: #ef4444; font-size: 1.8em; font-weight: 700;">
                            ${o.filter(n=>n.impactLevel==="critical").length}
                        </div>
                        <div style="color: #9ca3af; font-size: 0.9em;">${f("flame",14)} Critical</div>
                    </div>
                    <div>
                        <div style="color: #f59e0b; font-size: 1.8em; font-weight: 700;">
                            ${o.filter(n=>n.impactLevel==="high").length}
                        </div>
                        <div style="color: #9ca3af; font-size: 0.9em;">${f("star",14)} High</div>
                    </div>
                    <div>
                        <div style="color: #3b82f6; font-size: 1.8em; font-weight: 700;">
                            ${o.filter(n=>n.impactLevel==="moderate").length}
                        </div>
                        <div style="color: #9ca3af; font-size: 0.9em;">${f("diamond",14)} Moderate</div>
                    </div>
                    <div>
                        <div style="color: #6b7280; font-size: 1.8em; font-weight: 700;">
                            ${o.filter(n=>n.impactLevel==="standard").length}
                        </div>
                        <div style="color: #9ca3af; font-size: 0.9em;">${f("check",14)} Standard</div>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3 style="color: #60a5fa; margin-bottom: 15px;">All Skills (Sorted by Impact)</h3>
                <div style="display: grid; gap: 8px; max-height: 500px; overflow-y: auto; padding-right: 10px;">
                    ${o.map((n,r)=>{const l=ze(n.impactLevel),d=n.category==="skill"?"SKILL":n.category==="ability"?"ABILITY":n.category==="workstyle"?"WORK STYLE":"UNIQUE";return`
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; border-left: 3px solid ${l};">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <span style="color: #e0e0e0; font-weight: 500;">${w(n.name)}</span>
                                    <span style="color: #6b7280; font-size: 0.75em; padding: 2px 6px; background: rgba(255,255,255,0.1); border-radius: 3px;">${d}</span>
                                </div>
                                <div style="color: #9ca3af; font-size: 0.85em;">
                                    ${w(n.level)} • ${w(n.impact.label)}
                                </div>
                            </div>
                            <div style="color: ${l}; font-weight: 600; font-size: 1.2em; min-width: 40px; text-align: right;">
                                ${n.impact.icon}
                            </div>
                        </div>
                    `}).join("")}
                </div>
            </div>
            
            <div style="background: rgba(96, 165, 250, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #60a5fa; margin-bottom: 15px;">Your Market Value</h3>
                <div style="color: #d1d5db; line-height: 1.8;">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <span>Base Market Rate (${e.percentile} percentile):</span>
                        <strong>$${e.marketRate.toLocaleString()}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <span>Critical Skills Premium (${e.criticalSkills.length} skills):</span>
                        <strong style="color: #10b981;">+$${e.criticalBonus.toLocaleString()}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <span>High Impact Skills (${e.highSkills.length} skills):</span>
                        <strong style="color: #10b981;">+$${e.highBonus.toLocaleString()}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <span>Rare Combinations:</span>
                        <strong style="color: #10b981;">+$${e.rarityBonus.toLocaleString()}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 1.2em; margin-top: 10px;">
                        <strong>Total Market Value:</strong>
                        <strong style="color: #10b981;">$${e.total.toLocaleString()}</strong>
                    </div>
                </div>
            </div>
            
            <button class="export-btn-large" onclick="closeExportModal()" style="width: 100%; background: rgba(96, 165, 250, 0.2); border-color: #60a5fa; color: #60a5fa;">
                Close
            </button>
        </div>
    `,history.pushState({modal:!0},""),t.classList.add("active")}function kt(e){if(!e||!e.total)return"";var t="";t+='<div style="display:grid; gap:6px; margin-bottom:14px;">';var i=[{label:"Conservative (75%)",val:e.conservativeOffer,desc:"Budget-constrained",color:"#9ca3af"},{label:"Standard (85%)",val:e.standardOffer,desc:"Most common initial",color:"#60a5fa"},{label:"Competitive (95%)",val:e.competitiveOffer,desc:"Strong employers",color:"#10b981"}];i.forEach(function(p){t+='<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:rgba(255,255,255,0.03); border-radius:6px; border-left:3px solid '+p.color+';"><div><div style="color:'+p.color+'; font-weight:600; font-size:0.82em;">'+p.label+'</div><div style="color:var(--c-muted); font-size:0.72em;">'+p.desc+'</div></div><div style="font-weight:700; color:var(--c-text);">$'+p.val.toLocaleString()+"</div></div>"}),t+="</div>";var o=e.yourWorth-e.standardOffer;t+='<div style="padding:10px 12px; background:rgba(251,191,36,0.06); border-radius:8px; margin-bottom:14px;"><div style="color:#fbbf24; font-weight:600; font-size:0.82em; margin-bottom:4px;">'+f("lightbulb",12)+" Negotiation Gap: $"+o.toLocaleString()+'</div><div style="font-size:0.78em; color:var(--c-muted); line-height:1.5;">Start at $'+e.yourWorth.toLocaleString()+", negotiate to $"+e.competitiveOffer.toLocaleString()+"+.</div></div>",t+='<div style="font-size:0.78em; font-weight:700; color:#fbbf24; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.04em;">Talking Points</div><div style="display:grid; gap:6px; margin-bottom:14px;">';var a=skillsData&&k().skills||userData&&window._userData.skills||[],n=a.filter(function(p){return(p.level||"").toLowerCase()==="mastery"}),r=a.filter(function(p){return(p.level||"").toLowerCase()==="expert"}),l=n.slice(0,4).map(function(p){return p.name}).join(", "),d=e.marketRate>0?Math.round((e.yourWorth-e.marketRate)/e.marketRate*100):0,s=n.length>0?n.length+" mastery-level skill"+(n.length!==1?"s":"")+" ("+l+")"+(r.length>0?" plus "+r.length+" at expert level":"")+" command market premiums.":r.length+" expert-level skills command market premiums.",c=[{title:"Lead with Worth",text:'"My value is $'+Math.round(e.yourWorth*.95/1e3)*1e3+"–$"+Math.round(e.yourWorth*1.05/1e3)*1e3+" for "+(e.roleLevel||"")+' roles."'},{title:"Skills Premium",text:s},{title:"Market Data",text:"Market rate: $"+e.marketRate.toLocaleString()+". My skills justify a "+d+"% premium."}];return c.forEach(function(p){t+='<div style="padding:8px 12px; background:rgba(255,255,255,0.02); border-radius:6px; font-size:0.82em; color:var(--c-muted); line-height:1.5;"><strong style="color:var(--c-text);">'+p.title+":</strong> "+p.text+"</div>"}),t+="</div>",t+=`<div style="font-size:0.78em; font-weight:700; color:#60a5fa; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.04em;">When Asked for Expectations</div><div style="padding:10px 12px; background:rgba(255,255,255,0.02); border-radius:8px; font-size:0.82em; color:var(--c-muted); font-style:italic; line-height:1.6; margin-bottom:10px;">"Based on my skill profile and market analysis, I'm targeting $`+Math.round(e.competitiveOffer/1e3)*1e3+"–$"+Math.round(e.yourWorth/1e3)*1e3+'. Flexible on total package structure."</div>',t+='<div style="font-size:0.78em; font-weight:700; color:#60a5fa; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.04em;">Best Practices</div><div style="font-size:0.78em; color:var(--c-muted); line-height:1.6;">Never share salary history. Name your range first (anchoring). Get the full offer in writing before negotiating. Ask about equity, signing bonus, PTO separately. Express enthusiasm before countering.</div>',t}window.renderInlineNegotiation||(window.renderInlineNegotiation=kt);function Gi(){if(window.isReadOnlyProfile){demoGate("use the negotiation guide");return}logAnalyticsEvent("negotiation_guide",{});const e=getEffectiveComp(),t=e.yourWorth-e.standardOffer,i=formatCompValue(e.displayComp),o=document.getElementById("exportModal"),a=o.querySelector(".modal-content");a.innerHTML=`
        <div class="modal-header">
            <div class="modal-header-left">
                <h2 class="modal-title">${f("briefcase",18)} Salary Negotiation Strategy</h2>
                <p style="color: #9ca3af; margin-top: 5px;">Compa-ratio based negotiation guidance</p>
            </div>
            <button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()">×</button>
        </div>
        <div class="modal-body" style="padding: 30px; max-height: 70vh; overflow-y: auto;">
            <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <div style="color: #10b981; font-weight: 600; margin-bottom: 10px;">${e.compLabel}</div>
                <div style="font-size: 2em; font-weight: 700; color: #e0e0e0;">
                    ${i}/yr
                </div>
                <div style="color: #9ca3af; margin-top: 8px;">
                    ${e.roleLevel} • ${e.compSource==="algorithm"?e.compaRatio+"% compa-ratio • ":""}${window._userData.profile.location||""}
                </div>
            </div>
            
            <div style="background: rgba(96, 165, 250, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="color: #60a5fa; margin-bottom: 15px;">${f("bar-chart",14)} Understanding Compa-Ratios</h3>
                <div style="color: #d1d5db; font-size: 0.95em; line-height: 1.7;">
                    <strong>Compa-ratio</strong> = Your salary ÷ Market median × 100%
                    <br><br>
                    <strong>How Companies Use This:</strong>
                    <br>• <strong>80-120%</strong> = Acceptable range
                    <br>• <strong>100%</strong> = Exactly at market median
                    <br>• <strong>&lt;80%</strong> = Underpaid (flight risk)
                    <br>• <strong>&gt;120%</strong> = Overpaid for role
                    <br><br>
                    <strong>Market Rate (50th percentile):</strong> $${e.marketRate.toLocaleString()}
                    <br><strong>Your Worth (with premiums):</strong> $${e.yourWorth.toLocaleString()} (${e.compaRatio}%)
                </div>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3 style="color: #fbbf24; margin-bottom: 15px;">${f("dollar",14)} Expected Offer Ranges</h3>
                <div style="color: #9ca3af; font-size: 0.9em; margin-bottom: 15px;">
                    Companies typically offer <strong>75-95%</strong> of your market worth. Here's what to expect:
                </div>
                
                <div style="background: rgba(107, 114, 128, 0.2); padding: 15px; border-radius: 8px; margin-bottom: 12px; border-left: 3px solid #9ca3af;">
                    <div style="color: #9ca3af; font-weight: 600; margin-bottom: 5px;">Conservative Offer (75%)</div>
                    <div style="font-size: 1.3em; color: #e0e0e0; font-weight: 600;">
                        $${e.conservativeOffer.toLocaleString()}
                    </div>
                    <div style="color: #9ca3af; font-size: 0.9em; margin-top: 5px;">
                        Budget-constrained companies • Startups • Non-profits
                    </div>
                </div>
                
                <div style="background: rgba(96, 165, 250, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 12px; border-left: 3px solid #60a5fa;">
                    <div style="color: #60a5fa; font-weight: 600; margin-bottom: 5px;">Standard Offer (85%) ← Most Common</div>
                    <div style="font-size: 1.3em; color: #e0e0e0; font-weight: 600;">
                        $${e.standardOffer.toLocaleString()}
                    </div>
                    <div style="color: #9ca3af; font-size: 0.9em; margin-top: 5px;">
                        Typical initial offers • Room to negotiate up
                    </div>
                </div>
                
                <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #10b981;">
                    <div style="color: #10b981; font-weight: 600; margin-bottom: 5px;">Competitive Offer (95%)</div>
                    <div style="font-size: 1.3em; color: #e0e0e0; font-weight: 600;">
                        $${e.competitiveOffer.toLocaleString()}
                    </div>
                    <div style="color: #9ca3af; font-size: 0.9em; margin-top: 5px;">
                        High-demand roles • Top-tier companies • Multiple offers
                    </div>
                </div>
                
                <div style="margin-top: 15px; padding: 15px; background: rgba(251, 191, 36, 0.2); border-radius: 8px;">
                    <div style="color: #fbbf24; font-weight: 600; margin-bottom: 5px;">${f("lightbulb",14)} Your Negotiation Gap</div>
                    <div style="color: #d1d5db; font-size: 0.95em;">
                        <strong>$${t.toLocaleString()}</strong> between standard offer and your worth
                        <br>This is your leverage. Start at your worth ($${e.yourWorth.toLocaleString()}) and negotiate down to competitive range ($${e.competitiveOffer.toLocaleString()}+).
                    </div>
                </div>
            </div>
            
            <div style="background: rgba(251, 191, 36, 0.1); padding: 20px; border-radius: 8px; border-left: 3px solid #fbbf24; margin-bottom: 25px;">
                <h3 style="color: #fbbf24; margin-bottom: 15px;">${f("target",16)} Your Talking Points</h3>
                <div style="color: #d1d5db; line-height: 1.8;">
                    <p style="margin-bottom: 15px;">
                        <strong style="color: #fbbf24;">1. Lead with Your Worth:</strong><br>
                        "Based on my skill profile and market analysis, my value is in the $${Math.round(e.yourWorth*.95/1e3)*1e3}-$${Math.round(e.yourWorth*1.05/1e3)*1e3} range for ${e.roleLevel} roles in ${window._userData.profile.location}."
                    </p>
                    <p style="margin-bottom: 15px;">
                        <strong style="color: #fbbf24;">2. Reference Your Top 10 Skills:</strong><br>
                        "I bring ${e.top10Skills.filter(n=>n.level==="Mastery").length} mastery-level skills including ${e.top10Skills.slice(0,3).map(n=>n.skill).join(", ")}. These command premiums in the current market."
                    </p>
                    <p style="margin-bottom: 15px;">
                        <strong style="color: #fbbf24;">3. Show the Data:</strong><br>
                        "The market rate for ${e.roleLevel} is $${e.marketRate.toLocaleString()}. My critical and high-impact skills justify a ${Math.round((e.yourWorth-e.marketRate)/e.marketRate*100)}% premium."
                    </p>
                    <p style="margin-bottom: 15px;">
                        <strong style="color: #fbbf24;">4. Use Your Outcomes:</strong><br>
                        "I've consistently delivered [cite 2-3 quantified outcomes from your Blueprint]. This track record supports my valuation."
                    </p>
                </div>
            </div>
            
            <div style="background: rgba(96, 165, 250, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="color: #60a5fa; margin-bottom: 15px;">${f("clipboard",14)} Negotiation Script</h3>
                <div style="color: #d1d5db; line-height: 1.8; font-size: 0.95em;">
                    <strong>When they ask for salary expectations:</strong>
                    <br><br>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 6px; margin: 10px 0; font-style: italic;">
                    "I appreciate you asking. Based on my research and skill profile, I'm looking at the $${Math.round(e.competitiveOffer/1e3)*1e3}-$${Math.round(e.yourWorth/1e3)*1e3} range. But I'm flexible depending on the total compensation package, including equity and benefits. What range were you considering?"
                    </div>
                    <br>
                    <strong>When they give a low offer ($${e.conservativeOffer.toLocaleString()}):</strong>
                    <br><br>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 6px; margin: 10px 0; font-style: italic;">
                    "I appreciate the offer. Based on market data for ${e.roleLevel} roles with my skill set${e.top10Skills.length>0?"—particularly my "+e.top10Skills[0].skill+" expertise":""}—the range is typically closer to $${e.standardOffer.toLocaleString()}-$${e.competitiveOffer.toLocaleString()}. Can we explore options in that range?"
                    </div>
                </div>
            </div>
            
            <div style="background: rgba(96, 165, 250, 0.1); padding: 20px; border-radius: 8px;">
                <h3 style="color: #60a5fa; margin-bottom: 15px;">✓ Best Practices</h3>
                <div style="color: #d1d5db; line-height: 1.8;">
                    <div style="margin-bottom: 15px;">
                        <strong style="color: #10b981;">DO:</strong>
                        <ul style="margin-left: 20px; margin-top: 8px;">
                            <li>Start at your worth ($${e.yourWorth.toLocaleString()})</li>
                            <li>Reference the $${t.toLocaleString()} gap as your leverage</li>
                            <li>Cite your top 10 skills as justification</li>
                            <li>Ask about total comp (equity, bonus, benefits)</li>
                            <li>Get offers in writing before negotiating</li>
                        </ul>
                    </div>
                    <div>
                        <strong style="color: #ef4444;">DON'T:</strong>
                        <ul style="margin-left: 20px; margin-top: 8px;">
                            <li>Accept the first offer—they expect negotiation</li>
                            <li>Give a range first—make them lead</li>
                            <li>Focus only on base salary</li>
                            <li>Negotiate without data</li>
                            <li>Accept below $${e.conservativeOffer.toLocaleString()} (75%)</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <button class="export-btn-large" onclick="closeExportModal()" style="width: 100%; margin-top: 25px;">
                Close Guide
            </button>
        </div>
    `,history.pushState({modal:!0},""),o.classList.add("active")}let K=null;async function Ki(){try{K=await(await fetch("onet-impact-ratings.json")).json(),console.log("✓ Impact ratings loaded")}catch(e){console.warn("Impact ratings not available (non-critical):",e.message)}}Ki();var R=null;function xt(){R||!K||(R={},["skills","abilities","workstyles"].forEach(function(e){var t=K[e];t&&Object.keys(t).forEach(function(i){var o=i.replace(/-/g," ").toLowerCase();R[o]={category:e,id:i,data:t[i]},o.split(" and ").forEach(function(a){var n=a.trim();n.length>3&&(R[n]={category:e,id:i,data:t[i]})})})}))}function St(e){if(xt(),!R)return null;var t=(e||"").toLowerCase().replace(/[^a-z0-9 ]/g,"").trim();if(R[t])return R[t];var i=null,o=0;return Object.keys(R).forEach(function(a){a.length>o&&(t.indexOf(a)!==-1||a.indexOf(t)!==-1)&&(i=R[a],o=a.length)}),i}function ae(e){if(!K)return{level:"moderate",label:"Moderate Impact",icon:f("diamond",14),rationale:"Loading ratings..."};if(e.category==="unique")return Et(e);var t=e.category,i=K[t+"s"],o=null;if(i&&e.onetId&&(o=i[e.onetId]),!o){var a=St(e.name);a&&(o=a.data)}if(!o){var n=e.level||"Proficient",r=n==="Mastery"?"high":n==="Expert"?"moderate":"standard";return{level:r,label:ce(r),icon:pe(r),rationale:"Estimated from proficiency level"}}var l=o.proficiencyMultiplier[e.level]||o.baseImpact;return{level:l,label:ce(l),icon:pe(l),rationale:o.rationale,executiveImportance:o.executiveImportance,marketScarcity:o.marketScarcity}}function Et(e){if(e.userAssessment)return Q(e.userAssessment);const t=Bt(e.name);return t?{...t,rationale:"Estimated based on similar skills. Consider providing custom assessment for more accuracy.",needsAssessment:!0}:{level:"high",label:"High Impact",icon:"⭐",rationale:"Unique differentiator. Provide assessment for accurate rating.",needsAssessment:!0}}function Bt(e){if(!K)return null;const t=e.toLowerCase();return t.includes("ai")||t.includes("artificial intelligence")?ae({category:"skill",onetId:"systems-analysis",level:"Mastery"}):t.includes("strategy")?ae({category:"skill",onetId:"complex-problem-solving",level:"Mastery"}):t.includes("leadership")?ae({category:"workstyle",onetId:"leadership",level:"Mastery"}):null}function Q(e){let t=0;e.years>=10?t+=3:e.years>=5?t+=2:t+=1,e.impact==="major"?t+=3:e.impact==="significant"?t+=2:t+=1,e.rarity==="rare"?t+=3:e.rarity==="uncommon"?t+=2:t+=1,e.salaryBand===">$250k"?t+=3:e.salaryBand==="$150-250k"?t+=2:t+=1;let i;return t>=10?i="critical":t>=8?i="high":t>=6?i="moderate":i="standard",{level:i,label:ce(i),icon:pe(i),rationale:"Based on your assessment",userAssessed:!0}}function ce(e){return{critical:"Critical Impact",high:"High Impact",moderate:"Moderate Impact",standard:"Standard",supplementary:"Supplementary"}[e]||"Moderate Impact"}function pe(e){var t={critical:f("flame",14),high:f("star",14),moderate:f("diamond",14),standard:f("check",14),supplementary:f("check",14)};return t[e]||f("diamond",14)}function ze(e){return{critical:"#ef4444",high:"#f59e0b",moderate:"#3b82f6",standard:"#6b7280",supplementary:"#9ca3af"}[e]||"#3b82f6"}let _=[],$="skills",L=null;function It(){document.getElementById("onetPickerModal").classList.remove("active"),_=[]}window.switchONETTab=function(t){$=t,document.querySelectorAll(".onet-tab").forEach(i=>i.classList.remove("active")),document.getElementById("onetTab"+t.charAt(0).toUpperCase()+t.slice(1)).classList.add("active"),xe()};function xe(){const e=document.getElementById("onetLibraryContent"),t=document.getElementById("onetSearchInput").value.toLowerCase();let i="",o,a;if($==="skills"?(o=window.onetSkillsLibrary,a="skill"):$==="abilities"?(o=window.onetAbilitiesLibrary,a="ability"):$==="knowledge"?(o=window.onetKnowledgeLibrary,a="knowledge"):$==="activities"?(o=window.onetWorkActivitiesLibrary,a="workactivity"):(o=window.onetWorkStylesLibrary,a="workstyle"),!o){e.innerHTML=`<div style="text-align:center;padding:40px;color:#9ca3af;">
            Library not loaded.<br><small style="opacity:0.6">Make sure the JSON file is deployed to GitHub.</small>
        </div>`;return}const n=window._userData.skills.filter(r=>r.category===a).map(r=>r.name);if($==="knowledge"||$==="activities"){const r=$==="knowledge"?o.knowledge:o.activities,l={};r.forEach(d=>{const s=d.group||"Other";l[s]||(l[s]=[]),l[s].push(d)}),Object.entries(l).forEach(([d,s])=>{let c="",p=!1;s.forEach(g=>{const u=n.includes(g.name),y=_.some(v=>v.id===g.onetCode);if(!(!t||g.name.toLowerCase().includes(t)||(g.description||"").toLowerCase().includes(t)))return;p=!0;const b={id:g.onetCode,name:g.name,definition:g.description||""};c+=ye(b,a,u,y)}),p&&(i+=`<div class="onet-category">
                    <div class="onet-category-title">▼ ${d}</div>
                    ${c}
                </div>`)})}else if($==="workstyles"){const r=o.workStyles||[],l={};r.forEach(d=>{const s=d.group||d.onetGroup||"Work Styles";l[s]||(l[s]=[]),l[s].push(d)}),Object.keys(l).length>1,r.forEach(d=>{const s=n.includes(d.name),c=_.some(u=>u.id===(d.id||d.onetCode));if(!(!t||d.name.toLowerCase().includes(t)||(d.definition||d.description||"").toLowerCase().includes(t)))return;const g={id:d.id||d.onetCode,name:d.name,definition:d.definition||d.description||""};i+=ye(g,a,s,c)})}else{const r=o.categories;Object.entries(r).forEach(([l,d])=>{let s="",c=!1;d.subcategories&&Object.entries(d.subcategories).forEach(([p,g])=>{let u="",y=!1;const h=$==="skills"?g.skills:g.abilities;h&&(h.forEach(b=>{const v=n.includes(b.name),m=_.some(B=>B.id===b.id);(!t||b.name.toLowerCase().includes(t)||b.definition.toLowerCase().includes(t))&&(u+=ye(b,a,v,m),y=!0,c=!0)}),y&&(s+=`
                            <div class="onet-subcategory">
                                <div class="onet-subcategory-title">${g.name}</div>
                                ${u}
                            </div>
                        `))}),c&&(i+=`
                    <div class="onet-category">
                        <div class="onet-category-title">▼ ${d.name}</div>
                        ${s}
                    </div>
                `)})}i||(i='<div style="text-align: center; padding: 40px; color: #9ca3af;">No results found</div>'),e.innerHTML=i,Pe()}function ye(e,t,i,o){return`
        <div class="onet-skill-item ${i?"disabled":""} ${o?"selected":""}" 
             onclick="${i?"":`toggleONETSkillSelection('${e.id}', '${e.name}', '${t}')`}">
            <input type="checkbox" 
                   class="onet-skill-checkbox" 
                   ${o?"checked":""}
                   ${i?"disabled":""}
                   onclick="event.stopPropagation();">
            <div class="onet-skill-content">
                <div class="onet-skill-name">
                    ${e.name}
                    ${i?'<span class="onet-skill-added">✓ Added</span>':""}
                </div>
                <div class="onet-skill-definition">${e.definition}</div>
            </div>
        </div>
    `}function Qi(e,t,i){const o=_.findIndex(a=>a.id===e);o===-1?_.push({id:e,name:t,category:i}):_.splice(o,1),xe(),Pe()}function Pe(){const e=_.length,t=document.getElementById("onetSelectedCount"),i=document.getElementById("onetAddButton");e===0?(t.textContent="Select skills to add",i.disabled=!0,i.style.opacity="0.5"):(t.textContent=`${e} skill${e>1?"s":""} selected`,i.disabled=!1,i.style.opacity="1")}function Xi(){xe()}function Zi(){if(_.length!==0){var e=new Set((window._userData.skills||[]).map(function(a){return a.name.toLowerCase()})),t=0,i=0;_.forEach(a=>{if(e.has(a.name.toLowerCase())){i++;return}if((window._userData.skills||[]).length>=PROFILE_SKILL_CAP){i++;return}e.add(a.name.toLowerCase());const n={name:a.name,category:a.category,onetId:a.id,level:"Advanced",roles:[window._userData.roles[0].id],key:!1};window._userData.skills.push(n),k().skills.push(n),t++}),saveUserData(),rescoreAllJobs(),A(),It();var o="Added "+t+" skill"+(t!==1?"s":"")+".";i>0&&(o+=" "+i+" skipped (duplicates or cap reached)."),(window._userData.skills||[]).length>=PROFILE_SKILL_CAP&&(o+=" Profile skill cap ("+PROFILE_SKILL_CAP+") reached."),x(o,t>0?"success":"warning")}}function Ct(){document.getElementById("customSkillModal").classList.remove("active")}function eo(){if(readOnlyGuard())return;const e=document.getElementById("customSkillName").value.trim(),t=document.querySelector('input[name="customSkillLevel"]:checked');if(!t){x("Please select a proficiency level.","warning");return}const i=t.value,o=document.getElementById("customSkillCore").checked;let a=Array.from(document.querySelectorAll(".custom-skill-role-checkbox:checked")).map(r=>r.value);if(!e){x("Please enter a skill name.","warning");return}if(a.length===0&&(a=(window._userData.roles||[]).map(function(r){return r.id})),window._userData.skills.some(r=>r.name.toLowerCase()===e.toLowerCase())){x("A skill with this name already exists.","warning");return}if(!canAddSkill())return;const n={name:e,category:"unique",level:i,roles:a,key:o};window._userData.skills.push(n),k().skills.push(n),registerInSkillLibrary(e,"unique"),saveUserData(),rescoreAllJobs(),A(),Ct(),x(`Created "${e}".`,"success")}var T=[],ue=null;function Lt(){var e=window.isReadOnlyProfile||window.currentProfileType&&window.currentProfileType!=="user";if(!e&&typeof skillsData<"u"&&k().sample&&(e=!0),e){x("Bulk import is not available in sample/demo mode.","warning");return}var t=document.getElementById("bulkImportModal");if(t){T=[],ue=null,document.getElementById("bulkSkillsText").value="",document.getElementById("bulkCsvFile").value="",document.getElementById("bulkCsvPreview").innerHTML="",document.getElementById("bulkImportStep1").style.display="",document.getElementById("bulkImportStep2").style.display="none",Ne("text");var i=document.getElementById("bulkImportRoles");i.innerHTML=(window._userData.roles||[]).map(function(o){return'<label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" value="'+w(o.id)+'" class="bulk-role-checkbox"><span style="font-size:0.9em;">'+w(o.name)+"</span></label>"}).join(""),history.pushState({modal:!0},""),t.classList.add("active")}}window.openBulkImport||(window.openBulkImport=Lt);function Oe(){var e=document.getElementById("bulkImportModal");e&&e.classList.remove("active")}window.closeBulkImport||(window.closeBulkImport=Oe);function Ne(e){document.getElementById("bulkTabText").className="onet-tab"+(e==="text"?" active":""),document.getElementById("bulkTabCsv").className="onet-tab"+(e==="csv"?" active":""),document.getElementById("bulkTextInput").style.display=e==="text"?"":"none",document.getElementById("bulkCsvInput").style.display=e==="csv"?"":"none"}window.switchBulkTab||(window.switchBulkTab=Ne);function Mt(e){var t=e.files[0];if(t){var i=new FileReader;i.onload=function(o){ue=o.target.result;var a=ue.split(`
`).filter(function(n){return n.trim()});document.getElementById("bulkCsvPreview").innerHTML="✓ Loaded "+w(t.name)+" ("+a.length+" lines, "+Math.round(t.size/1024)+" KB)"},i.readAsText(t)}}window.handleBulkCsvFile||(window.handleBulkCsvFile=Mt);var to=["Novice","Competent","Proficient","Advanced","Expert","Mastery"],be={};to.forEach(function(e){be[e.toLowerCase()]=e});function Dt(){var e=document.getElementById("bulkDefaultLevel").value,t=Array.from(document.querySelectorAll(".bulk-role-checkbox:checked")).map(function(s){return s.value});t.length===0&&(t=(window._userData.roles||[]).map(function(s){return s.id}));var i=[],o=document.getElementById("bulkCsvInput").style.display!=="none";if(o&&ue)i=At(ue,e);else{var a=document.getElementById("bulkSkillsText").value.trim();if(!a){x("Paste some skills first.","warning");return}i=Tt(a,e)}if(i.length===0){x("No valid skills found in input.","warning");return}var n={},r=[];i.forEach(function(s){var c=s.name.toLowerCase();if(!n[c])n[c]=!0,r.push(s);else{var p=r.find(function(g){return g.name.toLowerCase()===c});p&&proficiencyValue(s.level)>proficiencyValue(p.level)&&(p.level=s.level)}});var l={};(window._userData.skills||[]).forEach(function(s){l[s.name.toLowerCase()]=s;var c=getSkillSynonyms(s.name.toLowerCase());c.forEach(function(p){l[p]=s})});var d=document.getElementById("bulkMergeStrategy").value;T=r.map(function(s){var c=s.name.toLowerCase(),p=l[c];if(!p){for(var g=getSkillSynonyms(c),u=0;u<g.length;u++)if(l[g[u]]){p=l[g[u]];break}}var y="add",h=null;return p&&(h=p,d==="skip"?y="skip":d==="higher"?proficiencyValue(s.level)>proficiencyValue(p.level)?y="upgrade":y="skip":y="overwrite"),{name:s.name,level:s.level,category:s.category||"unique",core:s.core||!1,roles:t,action:y,conflict:h}}),zt()}window.parseBulkSkills||(window.parseBulkSkills=Dt);function Tt(e,t){var i=[],o=e.split(/\n/).map(function(r){return r.trim()}).filter(Boolean);if(o.length===1&&o[0].indexOf(",")!==-1){var a=o[0].split(",").map(function(r){return r.trim()}).filter(Boolean),n=a.some(function(r){return be[r.toLowerCase()]});if(!n)return a.forEach(function(r){r.length>1&&r.length<100&&i.push({name:re(r),level:t})}),i}return o.forEach(function(r){if(r=r.replace(/^[\s\-\u2022\u2023\u25E6\u2043\*\d\.)\]]+\s*/,"").trim(),!(!r||r.length<2)){var l=r.match(/^(.+?)\s*[,\-\|]\s*(Novice|Competent|Proficient|Advanced|Expert|Mastery)\s*$/i);l?i.push({name:re(l[1].trim()),level:be[l[2].toLowerCase()]||t}):i.push({name:re(r),level:t})}}),i}function At(e,t){var i=[],o=e.split(/\r?\n/).filter(function(m){return m.trim()});if(o.length<2)return i;var a=o[0].indexOf("	")!==-1?"	":",",n=o[0].split(a).map(function(m){return m.trim().toLowerCase().replace(/['"]/g,"")}),r=n.indexOf("name");r===-1&&(r=n.indexOf("skill")),r===-1&&(r=n.indexOf("skill name")),r===-1&&(r=0);var l=n.indexOf("level");l===-1&&(l=n.indexOf("proficiency"));var d=n.indexOf("category");d===-1&&(d=n.indexOf("type"));var s=n.indexOf("core");s===-1&&(s=n.indexOf("key")),s===-1&&(s=n.indexOf("differentiator"));for(var c=1;c<o.length;c++){var p=$t(o[c],a),g=(p[r]||"").trim();if(!(!g||g.length<2)){var u=t;if(l!==-1&&p[l]){var y=be[(p[l]||"").trim().toLowerCase()];y&&(u=y)}var h="unique";d!==-1&&p[d]&&(h=p[d].trim().toLowerCase()||"unique");var b=!1;if(s!==-1&&p[s]){var v=p[s].trim().toLowerCase();b=v==="true"||v==="yes"||v==="1"||v==="x"}i.push({name:re(g),level:u,category:h,core:b})}}return i}function $t(e,t){for(var i=[],o="",a=!1,n=0;n<e.length;n++){var r=e[n];r==='"'||r==="'"?a=!a:r===t&&!a?(i.push(o.trim()),o=""):o+=r}return i.push(o.trim()),i}function re(e){return e.replace(/\b\w+/g,function(t){return t===t.toUpperCase()&&t.length<=5?t:t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()})}function zt(){document.getElementById("bulkImportStep1").style.display="none",document.getElementById("bulkImportStep2").style.display="";var e=T.filter(function(l){return l.action==="add"}),t=T.filter(function(l){return l.action==="upgrade"}),i=T.filter(function(l){return l.action==="overwrite"}),o=T.filter(function(l){return l.action==="skip"}),a=e.length+t.length+i.length,n='<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin-bottom:16px;"><div style="text-align:center; padding:12px; border-radius:8px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2);"><div style="font-size:1.4em; font-weight:700; color:#10b981;">'+e.length+'</div><div style="font-size:0.78em; color:var(--text-muted);">New</div></div><div style="text-align:center; padding:12px; border-radius:8px; background:rgba(96,165,250,0.08); border:1px solid rgba(96,165,250,0.2);"><div style="font-size:1.4em; font-weight:700; color:#60a5fa;">'+t.length+'</div><div style="font-size:0.78em; color:var(--text-muted);">Upgrading</div></div><div style="text-align:center; padding:12px; border-radius:8px; background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.2);"><div style="font-size:1.4em; font-weight:700; color:#f59e0b;">'+i.length+'</div><div style="font-size:0.78em; color:var(--text-muted);">Overwriting</div></div><div style="text-align:center; padding:12px; border-radius:8px; background:rgba(107,114,128,0.06); border:1px solid rgba(107,114,128,0.15);"><div style="font-size:1.4em; font-weight:700; color:#6b7280;">'+o.length+'</div><div style="font-size:0.78em; color:var(--text-muted);">Skipped</div></div></div>';document.getElementById("bulkReviewSummary").innerHTML=n,document.getElementById("bulkImportConfirmBtn").textContent="Import "+a+" Skill"+(a!==1?"s":""),document.getElementById("bulkImportConfirmBtn").disabled=a===0,document.getElementById("bulkImportConfirmBtn").style.opacity=a===0?"0.4":"1";var r="";T.forEach(function(l,d){var s,c,p;if(l.action==="add")s="rgba(16,185,129,0.06)",c="✚",p='<span style="color:#10b981;">New at '+l.level+"</span>";else if(l.action==="upgrade")s="rgba(96,165,250,0.06)",c="⬆",p='<span style="color:#60a5fa;">'+l.conflict.level+" → "+l.level+"</span>";else if(l.action==="overwrite")s="rgba(251,191,36,0.06)",c="↻",p='<span style="color:#f59e0b;">Replace '+l.conflict.level+" with "+l.level+"</span>";else{s="rgba(107,114,128,0.04)",c="⊘";var g=l.conflict?'Already exists as "'+l.conflict.name+'" ('+l.conflict.level+")":"Duplicate";p='<span style="color:#6b7280;">'+g+"</span>"}r+='<div style="display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:6px; background:'+s+'; margin-bottom:4px;"><span style="font-size:1.1em; width:20px; text-align:center;">'+c+'</span><span style="flex:1; font-weight:500; font-size:0.9em; color:var(--text-primary);">'+l.name+'</span><span style="font-size:0.82em;">'+p+'</span><select data-bulk-idx="'+d+'" onchange="updateBulkAction(this)" style="padding:4px 8px; background:var(--bg-card); border:1px solid var(--border); border-radius:4px; color:var(--text-primary); font-size:0.78em;"><option value="add"'+(l.action==="add"?" selected":"")+">Add</option>"+(l.conflict?'<option value="upgrade"'+(l.action==="upgrade"?" selected":"")+">Upgrade</option>":"")+(l.conflict?'<option value="overwrite"'+(l.action==="overwrite"?" selected":"")+">Overwrite</option>":"")+'<option value="skip"'+(l.action==="skip"?" selected":"")+">Skip</option></select></div>"}),document.getElementById("bulkReviewList").innerHTML=r}function Pt(e){var t=parseInt(e.getAttribute("data-bulk-idx"));if(!isNaN(t)&&T[t]){T[t].action=e.value;var i=T.filter(function(r){return r.action==="add"}).length,o=T.filter(function(r){return r.action==="upgrade"}).length,a=T.filter(function(r){return r.action==="overwrite"}).length,n=i+o+a;document.getElementById("bulkImportConfirmBtn").textContent="Import "+n+" Skill"+(n!==1?"s":""),document.getElementById("bulkImportConfirmBtn").disabled=n===0,document.getElementById("bulkImportConfirmBtn").style.opacity=n===0?"0.4":"1"}}window.updateBulkAction||(window.updateBulkAction=Pt);function Ot(){document.getElementById("bulkImportStep1").style.display="",document.getElementById("bulkImportStep2").style.display="none"}window.bulkImportBack||(window.bulkImportBack=Ot);function Nt(){var e=document.querySelector('input[name="bulkDestination"]:checked'),t=document.getElementById("bulkProfileOptions");e&&t&&(t.style.display=e.value==="library"?"none":"")}window.toggleBulkProfileOptions||(window.toggleBulkProfileOptions=Nt);function _t(){var e=document.querySelector('input[name="bulkDestination"]:checked'),t=e&&e.value==="library",i=0,o=0,a=0,n=0;T.forEach(function(l){if(l.action!=="skip"&&(registerInSkillLibrary(l.name,l.category||"unique"),n++,!t)){if(l.action==="add"){var d={name:l.name,category:l.category,level:l.level,roles:l.roles,key:l.core};window._userData.skills.push(d),k().skills.push(d),i++}else if(l.action==="upgrade"||l.action==="overwrite"){var s=window._userData.skills.find(function(p){return p.name.toLowerCase()===(l.conflict?l.conflict.name.toLowerCase():l.name.toLowerCase())});if(s){s.level=l.level,l.action==="overwrite"&&(s.key=l.core);var c=k().skills.findIndex(function(p){return p.name===s.name});c!==-1&&(k().skills[c]={...s}),l.action==="upgrade"?o++:a++}}}}),saveUserData(),fbUser&&debouncedSave(),rescoreAllJobs(),A(),Oe();var r=[];t?r.push(n+" added to library"):(i&&r.push(i+" added"),o&&r.push(o+" upgraded"),a&&r.push(a+" overwritten")),x("Bulk import: "+r.join(", ")+".","success",5e3)}window.executeBulkImport||(window.executeBulkImport=_t);function Rt(){var e=window.isReadOnlyProfile||window.currentProfileType&&window.currentProfileType!=="user";if(!e&&typeof skillsData<"u"&&k().sample&&(e=!0),e){x("Bulk edit is not available in sample/demo mode.","warning");return}var t=document.getElementById("bulkSkillManagerModal");t&&(document.getElementById("bulkManagerSearch").value="",document.getElementById("bulkManagerSelectAll").checked=!1,me(),history.pushState({modal:!0},""),t.classList.add("active"))}window.openBulkManager||(window.openBulkManager=Rt);function Ut(){var e=document.getElementById("bulkSkillManagerModal");e&&e.classList.remove("active")}window.closeBulkManager||(window.closeBulkManager=Ut);function me(){var e=(document.getElementById("bulkManagerSearch").value||"").toLowerCase(),t=(window._userData.skills||[]).slice().sort(function(a,n){return a.name.localeCompare(n.name)});e&&(t=t.filter(function(a){return a.name.toLowerCase().indexOf(e)!==-1})),document.getElementById("bulkManagerCount").textContent=t.length+" skill"+(t.length!==1?"s":"");var i={Novice:"#94a3b8",Competent:"#22d3ee",Proficient:"#60a5fa",Advanced:"#a78bfa",Expert:"#fb923c",Mastery:"#10b981"},o=t.map(function(a){var n=i[a.level]||"#6b7280",r=(a.roles||[]).map(function(l){var d=(window._userData.roles||[]).find(function(s){return s.id===l});return d?d.name:l}).join(", ")||"All roles";return'<div class="bm-row" style="display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:6px; border-bottom:1px solid var(--border);"><input type="checkbox" class="bm-checkbox" value="'+a.name.replace(/"/g,"&quot;")+'" onchange="updateBulkManagerSelection()"><span style="flex:1; font-size:0.9em; font-weight:500; color:var(--text-primary);">'+a.name+'</span><span style="font-size:0.75em; padding:3px 8px; border-radius:4px; background:'+n+"22; color:"+n+'; font-weight:600;">'+a.level+'</span><span style="font-size:0.75em; color:var(--text-muted); max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="'+r+'">'+r+"</span></div>"}).join("");o||(o='<div style="padding:20px; text-align:center; color:var(--text-muted);">No skills match your filter.</div>'),document.getElementById("bulkManagerList").innerHTML=o,Se()}function Vt(){me()}window.filterBulkManager||(window.filterBulkManager=Vt);function Ft(e){var t=document.querySelectorAll(".bm-checkbox");t.forEach(function(i){i.checked=e}),Se()}window.toggleBulkManagerAll||(window.toggleBulkManagerAll=Ft);function Se(){var e=document.querySelectorAll(".bm-checkbox:checked"),t=document.getElementById("bulkManagerActions"),i=document.getElementById("bulkManagerSelected");e.length>0?(t.style.display="flex",i.textContent=e.length+" selected"):t.style.display="none"}window.updateBulkManagerSelection||(window.updateBulkManagerSelection=Se);function Ee(){return Array.from(document.querySelectorAll(".bm-checkbox:checked")).map(function(e){return e.value})}function Ht(){var e=Ee();if(e.length!==0){var t=document.getElementById("bulkManagerActions"),i=["Novice","Competent","Proficient","Advanced","Expert","Mastery"],o='<div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap; margin-top:8px;" id="bmLevelPicker"><span style="font-size:0.82em; color:var(--text-muted);">Set '+e.length+" skill"+(e.length>1?"s":"")+" to:</span>";i.forEach(function(n){o+=`<button onclick="executeBulkSetLevel('`+n+`')" style="padding:5px 12px; border-radius:5px; cursor:pointer; font-size:0.82em; font-weight:600; background:rgba(139,92,246,0.1); color:#a78bfa; border:1px solid rgba(139,92,246,0.25);">`+n+"</button>"}),o+=`<button onclick="document.getElementById('bmLevelPicker').remove();" style="padding:5px 10px; border:none; background:none; cursor:pointer; color:var(--text-muted); font-size:0.82em;">Cancel</button>`,o+="</div>";var a=document.getElementById("bmLevelPicker");a&&a.remove(),t.insertAdjacentHTML("beforeend",o)}}window.bulkManagerSetLevel||(window.bulkManagerSetLevel=Ht);function jt(e){var t=Ee(),i=0;t.forEach(function(o){var a=window._userData.skills.find(function(r){return r.name===o});if(a){a.level=e;var n=k().skills.findIndex(function(r){return r.name===o});n!==-1&&(k().skills[n].level=e),i++}}),saveUserData(),fbUser&&debouncedSave(),rescoreAllJobs(),A(),me(),x("Set "+i+" skill"+(i!==1?"s":"")+" to "+e+".","success")}window.executeBulkSetLevel||(window.executeBulkSetLevel=jt);function Wt(){var e=Ee();if(e.length!==0&&confirm("Remove "+e.length+" skill"+(e.length>1?"s":"")+` from this profile?

This cannot be undone.`)){var t=0;e.forEach(function(i){var o=window._userData.skills.findIndex(function(n){return n.name===i});o!==-1&&(window._userData.skills.splice(o,1),t++);var a=k().skills.findIndex(function(n){return n.name===i});a!==-1&&k().skills.splice(a,1)}),saveUserData(),fbUser&&debouncedSave(),rescoreAllJobs(),A(),me(),x("Removed "+t+" skill"+(t!==1?"s":"")+" from profile.","info")}}window.bulkManagerRemove||(window.bulkManagerRemove=Wt);function io(e,t){if(readOnlyGuard())return;const i=window._userData.skills.find(p=>p.name===e);if(!i)return;L=e;const o=document.getElementById("editSkillModal");document.getElementById("editSkillName").value=i.name;var a=document.querySelector('input[name="editSkillLevel"][value="'+i.level+'"]');if(a)a.checked=!0;else{var n=document.querySelector('input[name="editSkillLevel"][value="Proficient"]');n&&(n.checked=!0)}document.getElementById("editSkillCore").checked=i.key||!1;const r=document.getElementById("editSkillRoles");r.innerHTML=window._userData.roles.map(p=>`
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" value="${w(p.id)}" class="edit-skill-role-checkbox" ${i.roles.includes(p.id)?"checked":""}>
            <span>${w(p.name)}</span>
        </label>
    `).join(""),history.pushState({modal:!0},""),o.classList.add("active");var l=document.getElementById("editSkillEvidenceStatus");if(l&&typeof getEvidenceSummary=="function"){var d=getEvidenceSummary(i),s=d.hasGap?"var(--c-warn)":"var(--c-success)",c=d.hasGap?"var(--c-amber-bg-2b)":"var(--c-green-bg-2a)";l.innerHTML='<div style="padding:10px 14px; background:'+c+'; border-radius:8px; font-size:0.82em;"><span style="color:'+s+'; font-weight:600;">'+d.points+" evidence pts → "+d.effectiveLevel+'</span><span style="color:var(--c-muted); margin-left:8px;">('+d.evidenceCount+" outcome"+(d.evidenceCount!==1?"s":"")+")</span>"+(d.verifiedCount>0?' <span style="color:#10b981;"> ✓ '+d.verifiedCount+" verified</span>":"")+`<br><button onclick="closeEditSkillModal(); setTimeout(function(){ var sk = (_sd().skills||[]).find(function(s){return s.name==='`+w(e).replace(/'/g,"\\'")+"';}); if(sk) openSkillModal('"+w(e).replace(/'/g,"\\'")+`', sk); }, 100);" style="margin-top:6px; padding:3px 10px; background:transparent; border:1px solid var(--c-green-border-2); color:#10b981; border-radius:4px; cursor:pointer; font-size:0.88em;">+ Add Evidence</button></div>`}_e()}function qt(){document.getElementById("editSkillModal").classList.remove("active"),L=null}function _e(){var e=document.getElementById("editSkillGapWarning");if(!(!e||!L)){var t=(k().skills||[]).find(function(r){return r.name===L});if(t){var i=(document.querySelector('input[name="editSkillLevel"]:checked')||{}).value||"Novice",o=getEvidenceSummary(t),a=proficiencyValue(i),n=proficiencyValue(o.effectiveLevel);a>n?e.innerHTML='<div style="padding:8px 12px; background:var(--c-amber-bg-2b); border:1px solid var(--c-amber-border-1b); border-radius:6px; font-size:0.82em; color:var(--c-warn);">⚠ Claiming <strong>'+i+"</strong> but evidence supports <strong>"+o.effectiveLevel+"</strong>. Market valuation will use "+o.effectiveLevel+" until more evidence is added.</div>":e.innerHTML=""}}}window.updateEditSkillGapWarning||(window.updateEditSkillGapWarning=_e);function Jt(e){if(!readOnlyGuard()){var t=window._userData.skills.findIndex(function(o){return o.name===e});if(t!==-1){window._userData.skills.splice(t,1);var i=k().skills.findIndex(function(o){return o.name===e});i!==-1&&k().skills.splice(i,1),saveUserData(),rescoreAllJobs(),A(),x('Removed "'+e+'" from profile.',"info")}}}window.deleteSkillFromProfile||(window.deleteSkillFromProfile=Jt);function Yt(e){if(!readOnlyGuard()){var t=(window._userData.skills||[]).find(function(v){return v.name===e});if(!t){x("Skill not found.","error");return}L=e;var i=["Novice","Competent","Proficient","Advanced","Expert","Mastery"],o={Novice:"#94a3b8",Competent:"#22d3ee",Proficient:"#60a5fa",Advanced:"#a78bfa",Expert:"#fb923c",Mastery:"#10b981"},a=typeof getEvidenceSummary=="function"?getEvidenceSummary(t):null,n=window._userData.roles||[],r=t.roles||[],l=!!t.userAssessment,d=t.userAssessment||{years:5,impact:"significant",rarity:"uncommon"},s=!!(t.onetId||t.onetCode),c="";if(c+='<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;"><div><h2 style="margin:0; font-size:1.3em; color:var(--text-primary);">'+w(e)+'</h2><div style="display:flex; align-items:center; gap:8px; margin-top:6px; flex-wrap:wrap;"><span style="padding:3px 10px; border-radius:10px; font-size:0.75em; font-weight:600; background:'+(o[t.level]||"#6b7280")+"22; color:"+(o[t.level]||"#6b7280")+';">'+(t.level||"Proficient")+"</span>"+(t.key?'<span style="padding:3px 8px; border-radius:10px; font-size:0.7em; background:rgba(245,158,11,0.15); color:#f59e0b; font-weight:600;">CORE</span>':"")+(s?'<span style="padding:3px 8px; border-radius:10px; font-size:0.7em; background:rgba(96,165,250,0.15); color:#60a5fa;">O*NET</span>':"")+function(){var v=getSkillVerifications(e),m=v.filter(function(B){return B.status==="confirmed"});if(m.length>0){var E=m[0].verifierName||"verifier";return'<span style="padding:3px 8px; border-radius:10px; font-size:0.7em; background:rgba(16,185,129,0.15); color:#10b981; font-weight:600;">✓ Verified by '+w(E)+"</span>"}return""}()+'</div></div><button onclick="closeUnifiedSkillEditor()" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.4em; padding:4px;">✕</button></div>',c+='<div style="margin-bottom:18px;"><div style="font-weight:600; font-size:0.85em; color:var(--accent); margin-bottom:8px;">Proficiency Level</div><div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px;">',i.forEach(function(v){var m=t.level===v,E=o[v];c+='<label style="display:flex; align-items:center; gap:6px; padding:8px 10px; border-radius:8px; cursor:pointer; background:'+(m?E+"18":"var(--input-bg)")+"; border:1.5px solid "+(m?E:"var(--border)")+';"><input type="radio" name="uniLevel" value="'+v+'"'+(m?" checked":"")+' onchange="uniUpdateGapWarning()" style="accent-color:'+E+';"><span style="font-size:0.82em; font-weight:'+(m?"700":"500")+"; color:"+(m?E:"var(--text-secondary)")+';">'+v+"</span></label>"}),c+="</div>",c+='<div id="uniGapWarning" style="margin-top:6px;"></div>',a){var p=a.hasGap?"#f59e0b":"#10b981";c+='<div style="margin-top:6px; padding:6px 10px; border-radius:6px; font-size:0.78em; background:var(--bg-elevated); border:1px solid var(--border);"><span style="color:'+p+'; font-weight:600;">'+a.points+" evidence pts → "+a.effectiveLevel+'</span><span style="color:var(--text-muted); margin-left:6px;">('+a.evidenceCount+" outcome"+(a.evidenceCount!==1?"s":"")+")</span>"+(a.verifiedCount>0?' <span style="color:#10b981;"> ✓ '+a.verifiedCount+" verified</span>":"")+"</div>"}c+="</div>",n.length>0&&(c+='<div style="margin-bottom:18px;"><div style="font-weight:600; font-size:0.85em; color:var(--accent); margin-bottom:8px;">Used in Roles <span style="color:var(--text-muted); font-weight:400; font-size:0.9em;">(defaults to all)</span></div><div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:4px;">',n.forEach(function(v){var m=r.includes(v.id)||r.includes(v.name);c+='<label style="display:flex; align-items:center; gap:6px; padding:6px 8px; border-radius:6px; cursor:pointer; font-size:0.82em; color:var(--text-secondary);"><input type="checkbox" class="uni-role-cb" value="'+(v.id||v.name)+'"'+(m?" checked":"")+"><span>"+w(v.name)+"</span></label>"}),c+="</div></div>"),c+=`<div style="margin-bottom:18px; border:1px solid var(--border); border-radius:10px; overflow:hidden;"><div onclick="document.getElementById('uniAssessBody').style.display = document.getElementById('uniAssessBody').style.display === 'none' ? 'block' : 'none';" style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; cursor:pointer; background:var(--bg-elevated);"><div style="font-weight:600; font-size:0.85em; color:var(--accent);">📊 Impact Assessment`+(l?' <span style="color:#10b981; font-size:0.85em;">✓ Assessed</span>':' <span style="color:var(--text-muted); font-size:0.85em;">(optional)</span>')+'</div><span style="color:var(--text-muted);">▼</span></div><div id="uniAssessBody" style="display:'+(s&&!l?"none":"block")+'; padding:14px;">',s||(c+=`<div style="padding:8px 10px; background:rgba(245,158,11,0.1); border-left:3px solid #f59e0b; border-radius:4px; font-size:0.78em; color:var(--text-secondary); margin-bottom:12px;">💡 This skill doesn't have a direct O*NET match. Assess it to improve market impact accuracy.</div>`),c+='<div style="margin-bottom:12px;"><label style="font-size:0.8em; color:var(--accent); font-weight:600;">Years of experience</label><input type="number" id="uniAssessYears" value="'+(d.years||5)+'" min="0" max="40" style="display:block; width:80px; margin-top:4px; padding:6px 10px; background:var(--input-bg); border:1px solid var(--border); border-radius:6px; color:var(--text-primary); font-size:0.9em;"></div>';var g=[["minor","Minor","Supports work but doesn't directly drive outcomes"],["significant","Significant","Directly contributes to key business results"],["transformative","Transformative","Creates new capabilities or markets"]];c+='<div style="margin-bottom:12px;"><label style="font-size:0.8em; color:var(--accent); font-weight:600;">Impact on business outcomes</label>',g.forEach(function(v){var m=d.impact===v[0];c+='<label style="display:flex; align-items:start; gap:8px; padding:6px 0; cursor:pointer; font-size:0.82em;"><input type="radio" name="uniImpact" value="'+v[0]+'"'+(m?" checked":"")+' style="margin-top:2px;"><div><strong style="color:var(--text-primary);">'+v[1]+'</strong><div style="color:var(--text-muted); font-size:0.9em;">'+v[2]+"</div></div></label>"}),c+="</div>";var u=[["common","Common","Many professionals have this"],["uncommon","Uncommon","Requires specialized training"],["rare","Rare","Few people have deep expertise"]];c+='<div style="margin-bottom:8px;"><label style="font-size:0.8em; color:var(--accent); font-weight:600;">How rare is deep expertise?</label>',u.forEach(function(v){var m=d.rarity===v[0];c+='<label style="display:flex; align-items:start; gap:8px; padding:6px 0; cursor:pointer; font-size:0.82em;"><input type="radio" name="uniRarity" value="'+v[0]+'"'+(m?" checked":"")+' style="margin-top:2px;"><div><strong style="color:var(--text-primary);">'+v[1]+'</strong><div style="color:var(--text-muted); font-size:0.9em;">'+v[2]+"</div></div></label>"}),c+="</div></div></div>",c+='<label style="display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:8px; background:var(--bg-elevated); border:1px solid var(--border); cursor:pointer; margin-bottom:18px;"><input type="checkbox" id="uniCore"'+(t.key?" checked":"")+'><div><span style="font-weight:600; font-size:0.85em; color:var(--accent);">Mark as Core Differentiator</span><div style="font-size:0.75em; color:var(--text-muted);">Core skills appear as key differentiators in scouting reports and job matching.</div></div></label>';var y=blueprintData&&D().outcomes||[],h=y.filter(function(v){return v.skills&&v.skills.indexOf(e)!==-1});c+='<div style="margin-bottom:18px;"><div style="font-weight:600; font-size:0.85em; color:var(--accent); margin-bottom:8px;">Linked Outcomes <span style="font-weight:400; color:var(--text-muted);">('+h.length+")</span></div>",h.length>0&&(c+='<div style="display:flex; flex-direction:column; gap:4px;">',h.forEach(function(v){c+='<div style="padding:6px 10px; border-radius:6px; background:var(--bg-elevated); border:1px solid var(--border); font-size:0.8em;"><span style="color:var(--text-primary); font-weight:500;">'+w(v.title||v.name||"Untitled")+"</span></div>"}),c+="</div>"),c+=`<button onclick="closeUnifiedSkillEditor(); switchBlueprintTab('outcomes');" style="margin-top:8px; padding:6px 14px; border-radius:6px; font-size:0.78em; cursor:pointer; background:none; border:1px solid var(--border); color:var(--accent); display:inline-flex; align-items:center; gap:4px;">`+f("plus",12)+(h.length>0?" Manage Outcomes":" Add an Outcome")+"</button></div>",c+=`<div style="display:flex; gap:10px; align-items:center;"><button onclick="saveUnifiedSkillEdit()" style="flex:1; padding:12px 20px; background:var(--accent); color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:700; font-size:0.92em;">Save Changes</button><button onclick="closeUnifiedSkillEditor()" style="padding:12px 20px; background:var(--input-bg); color:var(--text-secondary); border:1px solid var(--border); border-radius:8px; cursor:pointer; font-size:0.88em;">Cancel</button><button onclick="if(confirm('Remove `+w(e).replace(/'/g,"\\'")+"?')) { deleteSkillFromProfile('"+w(e).replace(/'/g,"\\'")+`'); closeUnifiedSkillEditor(); }" style="margin-left:auto; padding:10px 14px; background:none; color:#ef4444; border:1px solid rgba(239,68,68,0.3); border-radius:8px; cursor:pointer; font-size:0.82em;">`+f("trash",14)+" Remove</button></div>";var b=document.getElementById("unifiedSkillEditor");b||(b=document.createElement("div"),b.id="unifiedSkillEditor",b.className="modal",b.innerHTML='<div class="modal-content" style="max-width:600px; max-height:85vh; overflow-y:auto; padding:28px 32px;"><div id="uniEditorContent"></div></div>',document.body.appendChild(b),b.addEventListener("click",function(v){v.target===b&&Be()})),document.getElementById("uniEditorContent").innerHTML=c,history.pushState({modal:!0},""),b.classList.add("active"),setTimeout(Re,50)}}window.openUnifiedSkillEditor||(window.openUnifiedSkillEditor=Yt);function Be(){var e=document.getElementById("unifiedSkillEditor");e&&e.classList.remove("active"),L=null}window.closeUnifiedSkillEditor||(window.closeUnifiedSkillEditor=Be);function Re(){var e=document.getElementById("uniGapWarning");if(!(!e||!L)){var t=(k().skills||[]).find(function(r){return r.name===L});if(t){var i=(document.querySelector('input[name="uniLevel"]:checked')||{}).value||"Novice",o=typeof getEvidenceSummary=="function"?getEvidenceSummary(t):null;if(!o){e.innerHTML="";return}var a=proficiencyValue(i),n=proficiencyValue(o.effectiveLevel);a>n?e.innerHTML='<div style="padding:6px 10px; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:6px; font-size:0.78em; color:#f59e0b;">⚠ Claiming <strong>'+i+"</strong> but evidence supports <strong>"+o.effectiveLevel+"</strong>. Market valuation uses "+o.effectiveLevel+" until more evidence is added.</div>":e.innerHTML=""}}}window.uniUpdateGapWarning||(window.uniUpdateGapWarning=Re);function Gt(){if(!readOnlyGuard()&&L){var e=window._userData.skills.find(function(p){return p.name===L});if(e){var t=document.querySelector('input[name="uniLevel"]:checked');t&&(e.level=t.value);var i=document.getElementById("uniCore");i&&(e.key=i.checked);var o=document.querySelectorAll(".uni-role-cb:checked"),a=Array.from(o).map(function(p){return p.value});a.length===0&&(a=(window._userData.roles||[]).map(function(p){return p.id})),e.roles=a;var n=document.getElementById("uniAssessYears"),r=document.querySelector('input[name="uniImpact"]:checked'),l=document.querySelector('input[name="uniRarity"]:checked');if(n&&r&&l&&(e.userAssessment={years:parseInt(n.value)||0,impact:r.value,rarity:l.value,salaryBand:(document.querySelector('input[name="uniSalary"]:checked')||{}).value||"$150-250k"},typeof Q=="function")){var d=Q(e.userAssessment);e.impactRating=d.level,e.impactScore=d.score}var s=k().skills.findIndex(function(p){return p.name===L});s!==-1&&(k().skills[s]=Object.assign({},e)),saveUserData(),rescoreAllJobs(),A();var c=L;Be(),x('Updated "'+c+'".',"success")}}}window.saveUnifiedSkillEdit||(window.saveUnifiedSkillEdit=Gt);function oo(){if(readOnlyGuard()||!L)return;const e=window._userData.skills.find(l=>l.name===L);if(!e)return;const t=document.querySelector('input[name="editSkillLevel"]:checked');if(!t){x("Please select a proficiency level.","warning");return}const i=t.value,o=document.getElementById("editSkillCore").checked;var a=Array.from(document.querySelectorAll(".edit-skill-role-checkbox:checked")).map(l=>l.value);a.length===0&&(a=(window._userData.roles||[]).map(function(l){return l.id})),e.level=i,e.key=o,e.roles=a;const n=k().skills.findIndex(l=>l.name===L);n!==-1&&(k().skills[n]={...e}),saveUserData(),rescoreAllJobs(),A();var r=L;qt(),x('Updated "'+r+'".',"success")}function no(e,t){confirm(`Delete "${e}"?

This cannot be undone.`)&&Kt(e)}function Kt(e){const t=window._userData.skills.findIndex(o=>o.name===e);t!==-1&&window._userData.skills.splice(t,1);const i=k().skills.findIndex(o=>o.name===e);i!==-1&&k().skills.splice(i,1),saveUserData(),rescoreAllJobs(),A()}let G=null;function ao(e){const t=window._userData.skills.find(o=>o.name===e);if(!t)return;G=e;const i=document.getElementById("assessSkillModal");document.getElementById("assessSkillName").textContent=t.name,t.userAssessment?(document.getElementById("assessYears").value=t.userAssessment.years||5,document.querySelector(`input[name="assessImpact"][value="${t.userAssessment.impact}"]`).checked=!0,document.querySelector(`input[name="assessRarity"][value="${t.userAssessment.rarity}"]`).checked=!0,document.querySelector(`input[name="assessSalary"][value="${t.userAssessment.salaryBand}"]`).checked=!0):(document.getElementById("assessYears").value=5,document.querySelector('input[name="assessImpact"][value="significant"]').checked=!0,document.querySelector('input[name="assessRarity"][value="uncommon"]').checked=!0,document.querySelector('input[name="assessSalary"][value="$150-250k"]').checked=!0),J(),history.pushState({modal:!0},""),i.classList.add("active"),document.getElementById("assessYears").addEventListener("input",J),document.querySelectorAll('input[name="assessImpact"]').forEach(o=>o.addEventListener("change",J)),document.querySelectorAll('input[name="assessRarity"]').forEach(o=>o.addEventListener("change",J)),document.querySelectorAll('input[name="assessSalary"]').forEach(o=>o.addEventListener("change",J))}function Qt(){document.getElementById("assessSkillModal").classList.remove("active"),G=null}function J(){const e=parseInt(document.getElementById("assessYears").value)||0,t=document.querySelector('input[name="assessImpact"]:checked')?.value||"significant",i=document.querySelector('input[name="assessRarity"]:checked')?.value||"uncommon",o=document.querySelector('input[name="assessSalary"]:checked')?.value||"$150-250k",n=Q({years:e,impact:t,rarity:i,salaryBand:o}),r=document.getElementById("assessmentPreview"),l=pe(n.level),d=ce(n.level),s=ze(n.level);r.innerHTML=`Predicted rating: <span style="color: ${s}; font-weight: 600;">${l} ${d}</span>`}function ro(){if(readOnlyGuard()||!G)return;const e=window._userData.skills.find(l=>l.name===G);if(!e)return;const t=parseInt(document.getElementById("assessYears").value)||0,i=document.querySelector('input[name="assessImpact"]:checked')?.value||"significant",o=document.querySelector('input[name="assessRarity"]:checked')?.value||"uncommon",a=document.querySelector('input[name="assessSalary"]:checked')?.value||"$150-250k";e.userAssessment={years:t,impact:i,rarity:o,salaryBand:a,assessedDate:new Date().toISOString()};const n=k().skills.findIndex(l=>l.name===G);n!==-1&&(k().skills[n].userAssessment=e.userAssessment),saveUserData(),A(),Qt();const r=Q(e.userAssessment);x(`Assessment saved. "${G}" rated as ${r.label}.`,"success")}function A(){const e=document.getElementById("skillsList");if(e&&(e.innerHTML=renderSkillsList()),currentView==="blueprint"){var t=document.getElementById("blueprintTabContent");if(t)try{t.innerHTML=renderBlueprintTabContent()}catch(i){console.warn("Blueprint refresh error:",i)}}currentView==="network"&&initNetwork(),currentView==="network"&&currentSkillsView==="cards"&&renderCardView(),updateStatsBar(),currentView==="settings"&&initSettings()}window.populateCategoryFilter=function(){const t=document.getElementById("yourSkillsCategoryFilter");if(!t)return;const i=t.value,o={skill:{label:"Skills",icon:f("compass",14)},ability:{label:"Abilities",icon:f("zap",14)},workstyle:{label:"Work Styles",icon:f("flag",14)},knowledge:{label:"Knowledge",icon:f("book",14)},workactivity:{label:"Work Activities",icon:f("settings",14)},trades:{label:"Trade Skills",icon:f("tool",14)},unique:{label:"Custom Skills",icon:"⭐"}},a={};window._userData.skills.forEach(l=>{const d=l.category||"skill";a[d]=(a[d]||0)+1});let n=`<option value="all">All Categories (${window._userData.skills.length})</option>`;const r=["skill","ability","workstyle","knowledge","workactivity","trades","unique"];r.forEach(l=>{const d=a[l];if(!d)return;const s=o[l]||{label:l,icon:"•"};n+=`<option value="${l}">${s.icon} ${s.label} (${d})</option>`}),Object.keys(a).forEach(l=>{r.includes(l)||(n+=`<option value="${l}">${l} (${a[l]})</option>`)}),t.innerHTML=n,i&&t.querySelector(`option[value="${i}"]`)&&(t.value=i)};function lo(){document.getElementById("skillManagementModal").classList.remove("active")}function so(e){currentSkillManagementTab=e,document.getElementById("yourSkillsTab").classList.toggle("active",e==="yours"),document.getElementById("addSkillsTab").classList.toggle("active",e==="add"),document.getElementById("yourSkillsContent").style.display=e==="yours"?"block":"none",document.getElementById("addSkillsContent").style.display=e==="add"?"block":"none",e==="yours"?Ie():Ve()}function Xt(){let e=0;return skillLibraryIndex?.totalSkills?e+=skillLibraryIndex.totalSkills:skillLibraryIndex?.index?.length&&(e+=skillLibraryIndex.index.length),window.onetSkillsLibrary&&(e+=35),window.onetAbilitiesLibrary?.abilities&&(e+=window.onetAbilitiesLibrary.abilities.length),window.onetWorkStylesLibrary?.workStyles&&(e+=window.onetWorkStylesLibrary.workStyles.length),window.onetKnowledgeLibrary?.knowledge&&(e+=window.onetKnowledgeLibrary.knowledge.length),window.onetWorkActivitiesLibrary?.activities&&(e+=window.onetWorkActivitiesLibrary.activities.length),window.tradesCreativeLibrary?.count&&(e+=window.tradesCreativeLibrary.count),e>0?e:2384}function Ue(){const e=window._userData.skills.length,t=Xt();document.getElementById("yourSkillsCount").textContent=e,document.getElementById("availableSkillsCount").textContent=t.toLocaleString(),document.getElementById("skillManagementCount").textContent=`${e} selected • ${t.toLocaleString()} available`}function Ie(){const e=document.getElementById("yourSkillsList"),t=document.getElementById("yourSkillsSearchInput").value.toLowerCase(),i=document.getElementById("yourSkillsCategoryFilter").value,o=document.getElementById("yourSkillsLevelFilter").value;let a=window._userData.skills.filter(l=>{const d=!t||l.name.toLowerCase().includes(t),s=i==="all"||l.category===i,c=o==="all"||l.level===o;return d&&s&&c});if(a.length===0){e.innerHTML=`
            <div style="text-align: center; padding: 60px 20px; color: #9ca3af;">
                <div style="font-size: 3em; margin-bottom: 10px;">${f("clipboard",14)}</div>
                <div style="font-size: 1.1em;">No skills found</div>
                <div style="font-size: 0.9em; margin-top: 10px;">Try adjusting your filters</div>
            </div>
        `;return}const n={};a.forEach(l=>{const d=l.category||"unique";n[d]||(n[d]=[]),n[d].push(l)});const r={skill:"Technology",ability:"General Professional",workstyle:"Work Styles",unique:"Custom Skills"};e.innerHTML=Object.entries(n).map(([l,d])=>`
        <div style="margin-bottom: 25px;">
            <div style="color: #9ca3af; font-size: 0.85em; font-weight: 600; margin-bottom: 12px; text-transform: uppercase;">
                ${r[l]||l} (${d.length})
            </div>
            ${d.map(s=>`
                <div class="your-skill-item">
                    <div style="display: flex; justify-content: space-between; align-items: start; gap: 15px;">
                        <div style="flex: 1;">
                            <div style="color: #e0e0e0; font-weight: 600; margin-bottom: 6px; font-size: 1.05em;">
                                ${w(s.name)}
                            </div>
                            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                                <span style="color: #60a5fa; font-size: 0.8em; padding: 2px 8px; background: rgba(96, 165, 250, 0.2); border-radius: 3px;">
                                    ${w(s.level)}
                                </span>
                                ${s.key?'<span style="color: #fbbf24; font-size: 0.8em;">⭐ Core</span>':""}
                                ${s.roles?`<span style="color: #9ca3af; font-size: 0.8em;">${s.roles.length} role${s.roles.length>1?"s":""}</span>`:""}
                            </div>
                        </div>
                        <button onclick="removeSkillFromProfile('${w(s.name).replace(/'/g,"\\'")}', '${l}')" 
                                style="padding: 8px 16px; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; border-radius: 6px; cursor: pointer; font-size: 0.9em; white-space: nowrap; font-weight: 600; transition: all 0.2s;"
                                onmouseover="this.style.background='rgba(239, 68, 68, 0.3)'"
                                onmouseout="this.style.background='rgba(239, 68, 68, 0.2)'">
                            Remove
                        </button>
                    </div>
                </div>
            `).join("")}
        </div>
    `).join("")}function co(){Ie()}function po(e,t){if(readOnlyGuard()||!confirm(`Remove "${e}" from your profile?`))return;const i=window._userData.skills.findIndex(a=>a.name===e&&a.category===t);i!==-1&&window._userData.skills.splice(i,1);const o=k().skills.findIndex(a=>a.name===e&&a.category===t);o!==-1&&k().skills.splice(o,1),saveUserData(),Ue(),Ie(),A()}function Ve(){if(readOnlyGuard())return;const e=document.getElementById("addSkillsResults");e.innerHTML=`
        <div style="text-align: center; padding: 60px 20px; color: #9ca3af;">
            <div style="margin-bottom: 10px;">' + bpIcon('search',48) + '</div>
            <div style="font-size: 1.1em;">Start typing to search skills</div>
            <div style="font-size: 0.9em; margin-top: 10px;">Try: "python", "marketing", "leadership"</div>
        </div>
    `,document.getElementById("skillManagementStatus").textContent="",document.getElementById("addSkillsCategories").style.display="block"}let tt;function Fe(){clearTimeout(tt),tt=setTimeout(()=>{const e=document.getElementById("addSkillsSearchInput");if(!e)return;const t=e.value;if(console.log("Search triggered for:",t),!skillLibraryIndex||!skillLibraryIndex.index){console.error("Skill library not loaded!"),x("Skill library is still loading. Please wait a moment.","info");const i=document.getElementById("addSkillsResults");if(!i)return;i.innerHTML=`
                <div style="text-align: center; padding: 60px 20px; color: #f59e0b;">
                    <div style="font-size: 3em; margin-bottom: 10px;">⏳</div>
                    <div style="font-size: 1.1em;">Loading skill library...</div>
                    <div style="font-size: 0.9em; margin-top: 10px;">Please wait</div>
                </div>
            `,_skillLibraryPromise=loadSkillLibraryIndex().then(()=>{console.log("Library loaded, retrying search"),Fe()});return}if(console.log("Library loaded with",skillLibraryIndex.totalSkills,"skills"),!t||t.trim().length<2){console.log("Query too short, showing empty state"),Ve();return}console.log("Performing search for:",t),He(t)},300)}function Zt(e){const t=e.toLowerCase().trim();if(t.length<2)return[];const i=[],o=new Set;return searchSkills(e).forEach(n=>{const r=(n.n||"").toLowerCase();o.has(r)||(o.add(r),i.push({id:n.id,n:n.n,c:n.c,sc:n.sc||"",definition:"",source:"esco",category:null,_raw:n}))}),window.tradesCreativeLibrary&&window.tradesCreativeLibrary.categories&&Object.entries(window.tradesCreativeLibrary.categories).forEach(function([n,r]){(r.skills||[]).forEach(function(l){const d=l.name.toLowerCase().includes(t),s=(l.definition||"").toLowerCase().includes(t),c=(l.adjacencies||[]).some(function(p){return p.toLowerCase().includes(t)});if(d||s||c){const p=l.name.toLowerCase();o.has(p)||(o.add(p),i.push({id:l.id,n:l.name,c:r.name,sc:"Trades & Creative",definition:l.definition||"",source:"trades",category:"trades",_raw:l}))}})}),window.onetKnowledgeLibrary&&window.onetKnowledgeLibrary.knowledge&&window.onetKnowledgeLibrary.knowledge.forEach(function(n){if(n.name.toLowerCase().includes(t)||(n.description||"").toLowerCase().includes(t)){const r=n.name.toLowerCase();o.has(r)||(o.add(r),i.push({id:n.onetCode,n:n.name,c:"Knowledge",sc:n.group||"",definition:n.description||"",source:"onet-knowledge",category:"knowledge",_raw:n}))}}),window.onetWorkActivitiesLibrary&&window.onetWorkActivitiesLibrary.activities&&window.onetWorkActivitiesLibrary.activities.forEach(function(n){if(n.name.toLowerCase().includes(t)||(n.description||"").toLowerCase().includes(t)){const r=n.name.toLowerCase();o.has(r)||(o.add(r),i.push({id:n.onetCode,n:n.name,c:"Work Activities",sc:n.group||"",definition:n.description||"",source:"onet-activities",category:"workactivity",_raw:n}))}}),window.onetAbilitiesLibrary&&window.onetAbilitiesLibrary.abilities&&window.onetAbilitiesLibrary.abilities.forEach(function(n){const r=n.definition||n.description||"";if(n.name.toLowerCase().includes(t)||r.toLowerCase().includes(t)){const l=n.name.toLowerCase();o.has(l)||(o.add(l),i.push({id:n.id||n.onetCode,n:n.name,c:"Abilities",sc:n.group||"",definition:r,source:"onet-abilities",category:"ability",_raw:n}))}}),window.onetWorkStylesLibrary&&window.onetWorkStylesLibrary.workStyles&&window.onetWorkStylesLibrary.workStyles.forEach(function(n){const r=n.definition||n.description||"";if(n.name.toLowerCase().includes(t)||r.toLowerCase().includes(t)){const l=n.name.toLowerCase();o.has(l)||(o.add(l),i.push({id:n.id||n.onetCode,n:n.name,c:"Work Styles",sc:n.group||"",definition:r,source:"onet-workstyles",category:"workstyle",_raw:n}))}}),i.slice(0,30)}function He(e){try{const t=Zt(e),i=document.getElementById("addSkillsResults");if(!i){console.error("ERROR: addSkillsResults container not found!");return}const o=document.getElementById("addSkillsCategories");if(o&&(o.style.display="none"),t.length===0){console.log("No results found, showing empty state"),i.innerHTML=`
                <div style="text-align: center; padding: 60px 20px; color: #9ca3af;">
                    <div style="font-size: 3em; margin-bottom: 10px;">❌</div>
                    <div style="font-size: 1.1em;">No skills found for "${w(e)}"</div>
                    <div style="font-size: 0.9em; margin-top: 10px;">Try a different search term</div>
                </div>
            `;const n=document.getElementById("skillManagementStatus");n&&(n.textContent="No results");return}console.log("Rendering",t.length,"results"),i.innerHTML=t.map(n=>{try{const r=isSkillAlreadyAdded(n.n),l=getCategoryColor(n.c);return`
                    <div class="skill-search-result ${r?"added":""}" 
                         style="padding: 12px; margin-bottom: 8px; background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid ${l}; cursor: ${r?"default":"pointer"}; transition: all 0.2s;"
                         ${r?"":`onclick="addSkillFromLibrary('${w(n.id)}')"`}
                         onmouseover="if (!this.classList.contains('added')) this.style.background='rgba(255,255,255,0.06)'"
                         onmouseout="if (!this.classList.contains('added')) this.style.background='rgba(255,255,255,0.03)'">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <div style="color: #e0e0e0; font-weight: 600; margin-bottom: 4px;">
                                    ${w(n.n)}
                                    ${r?'<span style="color: #10b981; font-size: 0.85em; margin-left: 8px;">✓ Already have</span>':""}
                                </div>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <span style="color: ${l}; font-size: 0.75em; padding: 2px 6px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                                        ${w(n.c)}
                                    </span>
                                    ${n.sc?`
                                        <span style="color: #9ca3af; font-size: 0.75em;">
                                            ${w(n.sc)}
                                        </span>
                                    `:""}
                                </div>
                            </div>
                            ${r?"":`
                                <button style="padding: 6px 12px; background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); border: none; border-radius: 6px; color: white; font-size: 0.85em; font-weight: 600; cursor: pointer;"
                                        onclick="event.stopPropagation(); addSkillFromLibrary('${w(n.id)}')">
                                    + Add
                                </button>
                            `}
                        </div>
                    </div>
                `}catch(r){return console.error("Error rendering skill:",n,r),""}}).filter(Boolean).join("");const a=document.getElementById("skillManagementStatus");a&&(a.textContent=`Found ${t.length} skill${t.length>1?"s":""}`)}catch(t){console.error("=== CRITICAL ERROR in performAddSkillsSearch ==="),console.error("Error:",t),console.error("Error message:",t.message),console.error("Error stack:",t.stack),x("Skill search encountered an error. Please try again.","error");const i=document.getElementById("addSkillsResults");i&&(i.innerHTML=`
                <div style="text-align: center; padding: 60px 20px; color: #ef4444;">
                    <div style="margin-bottom: 10px;">${f("warning",48)}</div>
                    <div style="font-size: 1.1em; font-weight: bold;">Search Error</div>
                    <div style="font-size: 0.9em; margin-top: 10px; font-family: monospace;">
                        ${w(t.message)}
                    </div>
                    <div style="font-size: 0.85em; margin-top: 10px; color: #9ca3af;">
                        Check browser console (F12) for details
                    </div>
                </div>
            `),x("Search error: "+t.message,"error")}}function uo(e){if(e==="Trades"){var t=document.getElementById("addSkillsCategories");t&&(t.style.display="none");var i=document.getElementById("addSkillsResults");if(!i)return;var o=[];if(window.tradesCreativeLibrary&&window.tradesCreativeLibrary.categories&&Object.values(window.tradesCreativeLibrary.categories).forEach(function(r){(r.skills||[]).forEach(function(l){o.push({id:l.id,n:l.name,c:r.name,sc:"Trades & Creative",definition:l.definition||"",source:"trades",category:"trades"})})}),o.length===0){i.innerHTML='<div style="text-align:center;padding:30px;color:#9ca3af;">Trades library not loaded yet.</div>';return}var a={"Woodworking & Construction":"#d97706","Electrical/Plumbing/Mechanical":"#0891b2","Painting & Finishing":"#7c3aed","Culinary Arts":"#f59e0b","Visual Arts":"#db2777","Fiber & Textile":"#059669","Performing Arts":"#ea580c","Outdoor & Agriculture":"#16a34a","Technology & Making":"#2563eb"};i.innerHTML=o.map(function(r){var l=isSkillAlreadyAdded(r.n),d=a[r.c]||"#d97706";return'<div style="padding:12px;margin-bottom:8px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:3px solid '+d+";cursor:"+(l?"default":"pointer")+';" '+(l?"":`onclick="addSkillFromLibrary('`+w(r.id)+`')"`)+'><div style="display:flex;justify-content:space-between;align-items:start;"><div style="flex:1;"><div style="color:#e0e0e0;font-weight:600;margin-bottom:4px;">'+w(r.n)+(l?' <span style="color:#10b981;font-size:0.85em;">✓ Added</span>':"")+'</div><span style="color:'+d+';font-size:0.75em;padding:2px 6px;background:rgba(255,255,255,0.1);border-radius:3px;">'+w(r.c)+"</span></div>"+(l?"":`<button style="padding:6px 12px;background:linear-gradient(135deg,#60a5fa,#3b82f6);border:none;border-radius:6px;color:white;font-size:0.85em;font-weight:600;cursor:pointer;" onclick="event.stopPropagation();addSkillFromLibrary('`+w(r.id)+`')">+ Add</button>`)+"</div></div>"}).join("");var n=document.getElementById("skillManagementStatus");n&&(n.textContent="Showing "+o.length+" Trade Skills");return}document.getElementById("addSkillsSearchInput").value=e,Fe()}function fo(e){if(readOnlyGuard())return;let t=null,i="skill";if(skillLibraryIndex&&skillLibraryIndex.index){const n=skillLibraryIndex.index.find(r=>r.id===e);if(n){t=n.n;const r=(n.sc||"").toLowerCase(),l=(n.c||"").toLowerCase();l==="work styles"||r.includes("work style")?i="workstyle":["transversal skills","language skills","cognitive abilities","sensory abilities","physical abilities","psychomotor abilities"].includes(l)?i="ability":i="skill"}}if(!t&&window.tradesCreativeLibrary&&window.tradesCreativeLibrary.categories){e:for(const n of Object.values(window.tradesCreativeLibrary.categories))for(const r of n.skills||[])if(r.id===e){t=r.name,i="trades",r.definition;break e}}if(!t){const n=[{lib:window.onetKnowledgeLibrary?.knowledge,cat:"knowledge",nameField:"name",idField:"onetCode"},{lib:window.onetWorkActivitiesLibrary?.activities,cat:"workactivity",nameField:"name",idField:"onetCode"},{lib:window.onetAbilitiesLibrary?.abilities,cat:"ability",nameField:"name",idField:"id"},{lib:window.onetWorkStylesLibrary?.workStyles,cat:"workstyle",nameField:"name",idField:"id"}];for(const r of n){if(!r.lib)continue;const l=r.lib.find(d=>(d[r.idField]||d.id||d.onetCode)===e);if(l){t=l.name,i=r.cat,l.definition||l.description;break}}}if(!t){console.warn("Skill not found for id:",e);return}if(isSkillAlreadyAdded(t)||!canAddSkill())return;const o={name:t,category:i,level:"Advanced",roles:[window._userData.roles[0]?.id||"default"],key:!1,evidence:[],source:"library",libraryId:e};window._userData.skills.push(o),k().skills.push(o),saveUserData(),populateCategoryFilter(),Ue(),A();const a=document.getElementById("addSkillsSearchInput").value;a&&He(a)}window.initApplications||(window.initApplications=Ri);window.renderApplications||(window.renderApplications=X);window.renderApplicationCard||(window.renderApplicationCard=pt);window.addApplicationModal||(window.addApplicationModal=Ui);window.saveApplication||(window.saveApplication=Vi);window.updateApplicationStatus||(window.updateApplicationStatus=Fi);window.editApplication||(window.editApplication=Hi);window.saveApplicationEdit||(window.saveApplicationEdit=ji);window.deleteApplication||(window.deleteApplication=Wi);window.initConsent||(window.initConsent=ut);window.renderSharePresets||(window.renderSharePresets=ft);window.renderPresetCard||(window.renderPresetCard=mt);window.renderSharingStatus||(window.renderSharingStatus=gt);window.renderLegalSection||(window.renderLegalSection=vt);window.handleProfilePhoto||(window.handleProfilePhoto=wt);window.removeProfilePhoto||(window.removeProfilePhoto=yt);window.saveSettings||(window.saveSettings=bt);window.selectPreset||(window.selectPreset=ht);window.filterSkillsView||(window.filterSkillsView=Ji);window.showValuationBreakdown||(window.showValuationBreakdown=Yi);window.renderInlineNegotiation||(window.renderInlineNegotiation=kt);window.showNegotiationGuide||(window.showNegotiationGuide=Gi);window._buildOnetNameIndex||(window._buildOnetNameIndex=xt);window._matchOnetByName||(window._matchOnetByName=St);window.getSkillImpact||(window.getSkillImpact=ae);window.getUniqueSkillImpact||(window.getUniqueSkillImpact=Et);window.findComparableSkill||(window.findComparableSkill=Bt);window.calculateUniqueSkillImpact||(window.calculateUniqueSkillImpact=Q);window.getImpactLabel||(window.getImpactLabel=ce);window.getImpactIcon||(window.getImpactIcon=pe);window.getImpactColor||(window.getImpactColor=ze);window.closeONETPicker||(window.closeONETPicker=It);window.renderONETLibrary||(window.renderONETLibrary=xe);window.renderONETSkillItem||(window.renderONETSkillItem=ye);window.toggleONETSkillSelection||(window.toggleONETSkillSelection=Qi);window.updateONETSelectedCount||(window.updateONETSelectedCount=Pe);window.filterONETLibrary||(window.filterONETLibrary=Xi);window.addSelectedONETSkills||(window.addSelectedONETSkills=Zi);window.closeCustomSkillBuilder||(window.closeCustomSkillBuilder=Ct);window.createCustomSkill||(window.createCustomSkill=eo);window.openBulkImport||(window.openBulkImport=Lt);window.closeBulkImport||(window.closeBulkImport=Oe);window.switchBulkTab||(window.switchBulkTab=Ne);window.handleBulkCsvFile||(window.handleBulkCsvFile=Mt);window.parseBulkSkills||(window.parseBulkSkills=Dt);window.parseTextToItems||(window.parseTextToItems=Tt);window.parseCsvToItems||(window.parseCsvToItems=At);window.parseCsvLine||(window.parseCsvLine=$t);window.titleCase||(window.titleCase=re);window.renderBulkReview||(window.renderBulkReview=zt);window.updateBulkAction||(window.updateBulkAction=Pt);window.bulkImportBack||(window.bulkImportBack=Ot);window.toggleBulkProfileOptions||(window.toggleBulkProfileOptions=Nt);window.executeBulkImport||(window.executeBulkImport=_t);window.openBulkManager||(window.openBulkManager=Rt);window.closeBulkManager||(window.closeBulkManager=Ut);window.renderBulkManagerList||(window.renderBulkManagerList=me);window.filterBulkManager||(window.filterBulkManager=Vt);window.toggleBulkManagerAll||(window.toggleBulkManagerAll=Ft);window.updateBulkManagerSelection||(window.updateBulkManagerSelection=Se);window.getSelectedBulkSkillNames||(window.getSelectedBulkSkillNames=Ee);window.bulkManagerSetLevel||(window.bulkManagerSetLevel=Ht);window.executeBulkSetLevel||(window.executeBulkSetLevel=jt);window.bulkManagerRemove||(window.bulkManagerRemove=Wt);window.openEditSkillModal||(window.openEditSkillModal=io);window.closeEditSkillModal||(window.closeEditSkillModal=qt);window.updateEditSkillGapWarning||(window.updateEditSkillGapWarning=_e);window.deleteSkillFromProfile||(window.deleteSkillFromProfile=Jt);window.openUnifiedSkillEditor||(window.openUnifiedSkillEditor=Yt);window.closeUnifiedSkillEditor||(window.closeUnifiedSkillEditor=Be);window.uniUpdateGapWarning||(window.uniUpdateGapWarning=Re);window.saveUnifiedSkillEdit||(window.saveUnifiedSkillEdit=Gt);window.saveSkillEdit||(window.saveSkillEdit=oo);window.confirmDeleteSkill||(window.confirmDeleteSkill=no);window.deleteSkill||(window.deleteSkill=Kt);window.openAssessSkillModal||(window.openAssessSkillModal=ao);window.closeAssessSkillModal||(window.closeAssessSkillModal=Qt);window.updateAssessmentPreview||(window.updateAssessmentPreview=J);window.saveSkillAssessment||(window.saveSkillAssessment=ro);window.refreshAllViews||(window.refreshAllViews=A);window.closeSkillManagement||(window.closeSkillManagement=lo);window.switchSkillManagementTab||(window.switchSkillManagementTab=so);window.getTotalAvailableSkillCount||(window.getTotalAvailableSkillCount=Xt);window.updateSkillManagementCounts||(window.updateSkillManagementCounts=Ue);window.renderYourSkills||(window.renderYourSkills=Ie);window.filterYourSkills||(window.filterYourSkills=co);window.removeSkillFromProfile||(window.removeSkillFromProfile=po);window.showAddSkillsEmpty||(window.showAddSkillsEmpty=Ve);window.handleAddSkillsSearch||(window.handleAddSkillsSearch=Fe);window.searchAllLibraries||(window.searchAllLibraries=Zt);window.performAddSkillsSearch||(window.performAddSkillsSearch=He);window.searchAddSkillsByCategory||(window.searchAddSkillsByCategory=uo);window.addSkillFromLibrary||(window.addSkillFromLibrary=fo);function U(){if(window._skillsData)return window._skillsData;var e=window._userData;return{skills:e&&e.skills||[],roles:e&&e.roles||[],skillDetails:e&&e.skillDetails||{}}}function we(){if(window._blueprintData)return window._blueprintData;var e=window._userData;return{values:e&&e.values||[],outcomes:e&&e.outcomes||[],purpose:e&&e.purpose||""}}var Ce=!1;function mo(){const e=document.getElementById("statsBar");if(currentView==="network"){const i=getEffectiveComp(),o=i.displayComp>0?formatCompValue(i.displayComp):"",a=o?` • <span style="color: #10b981; font-weight: 700;">${i.compLabel}: ${o}/yr</span>`:"",n=window._userData.skills?.length||0,r=window._userData.roles?.length||0,l=window._userData.skills?.filter(g=>g.category==="skill").length||0,d=window._userData.skills?.filter(g=>g.category==="ability").length||0,s=window._userData.skills?.filter(g=>g.category==="workstyle").length||0,c=window._userData.skills?.filter(g=>g.category==="unique").length||0;let p="";n>=90?p=` (${l} Skills + ${d} Abilities + ${s} Work Styles + ${c} Unique)`:l>0&&c>0&&(p=` (${l} O*NET + ${c} Unique)`),e.innerHTML=`${n} Total Skills${p} • ${r} Career Roles${a}`;var t=getVerificationStats();(t.verified>0||t.pending>0)&&(e.innerHTML+=` • ${t.verified} Verified`,t.pending>0&&(e.innerHTML+=` (${t.pending} pending)`))}else if(currentView==="opportunities"){const i=opportunitiesData.filter(o=>o.matchScore>=currentMatchThreshold).length;e.innerHTML=`${i} Matching Opportunities • ${currentMatchThreshold}%+ Match Threshold`}else if(currentView==="applications"){const i=window._userData.applications?.length||0,o=window._userData.applications?.filter(a=>a.status!=="rejected").length||0;e.innerHTML=`${i} Applications Tracked • ${o} Active`}else if(currentView==="blueprint"){const i=we().outcomes.filter(a=>a.shared).length,o=we().values.filter(a=>a.selected).length;e.innerHTML=`${i} Outcomes • ${o} Values • Purpose Statement`}else if(currentView==="consent"){const i=we().outcomes.filter(o=>o.shared).length+we().values.filter(o=>o.selected).length;e.innerHTML=`${i} Items Shared • Data Privacy & Control`}else currentView==="settings"&&(e.innerHTML=`Profile Settings • ${w(window._userData.preferences.seniorityLevel)} Level • Customize Your Experience`)}function ei(e){var t=document.getElementById("labelPill"+e.charAt(0).toUpperCase()+e.slice(1));if(t){t.classList.toggle("active");var i=t.classList.contains("active"),o=d3.select("#networkView");o.empty()||o.selectAll("text").filter(function(a){return a&&a.type===e}).classed("hidden",!i)}}window.toggleLabelPill||(window.toggleLabelPill=ei);function ti(){var e=d3.select("#networkView");if(!e.empty()){var t=["role","skill","value"];t.forEach(function(i){var o=document.getElementById("labelPill"+i.charAt(0).toUpperCase()+i.slice(1));if(o){var a=o.classList.contains("active");e.selectAll("text").filter(function(n){return n&&n.type===i}).classed("hidden",!a)}})}}window.applyLabelToggles||(window.applyLabelToggles=ti);function go(){const e=document.getElementById("roleChipsContainer");if(e&&window._userData.roles){var t=typeof getVisibleRoles=="function"?getVisibleRoles():window._userData.roles||[];e.innerHTML=`<div class="role-chip active" data-role="all" onclick="filterByRole('all')">All</div>`+t.map(o=>`<div class="role-chip" data-role="${w(o.id)}" onclick="filterByRole('${w(o.id)}')">${w(o.name)}</div>`).join("")}const i=document.getElementById("levelChipsContainer");if(i&&window._userData.skills){const o=[{key:"Mastery",cls:"mastery"},{key:"Expert",cls:"expert"},{key:"Advanced",cls:"advanced"},{key:"Proficient",cls:"proficient"},{key:"Novice",cls:"novice"}];i.innerHTML=o.map(({key:a,cls:n})=>{const r=window._userData.skills.filter(l=>l.level===a).length;return r===0?"":`<div class="level-chip ${n}" onclick="filterByLevel('${a.toLowerCase()}')">${a} (${r})</div>`}).join("")}}window.filterByRole||(window.filterByRole=filterByRole);function vo(e,t){const i=d3.select("#tooltip");let o="";if(t.type==="center")o='<div class="tooltip-title" style="font-size:0.85em; opacity:0.7;">Click to reset layout</div>';else if(t.type==="hub")o=`<div class="tooltip-title">${w(t.name)}</div><div style="font-size:0.78em; opacity:0.6; margin-top:2px;">Click to reset layout</div>`;else if(t.type==="tension-marker")o='<div class="tooltip-title" style="color:#ef4444;">⚠ Friction Risk</div>',o+='<div style="font-size:0.82em; color:#9ca3af; margin-top:2px;">This value may conflict with the company culture</div>';else if(t.type==="value"){o=`<div class="tooltip-title">${w(t.name)}</div>`;var a=getCatalogDescription(t.name);a&&(o+=`<div style="font-size:0.82em; color:#9ca3af; margin-top:3px; line-height:1.4;">${w(a)}</div>`);var n={aligned:"✅ Shared value",yours:"🟡 Your priority",theirs:"🟣 Their priority",tension:"⚠ Friction risk"},r={aligned:"#10b981",yours:"#f59e0b",theirs:"#6366f1",tension:"#ef4444"};t.valState&&(o+=`<div style="font-size:0.78em; color:${r[t.valState]||"#9ca3af"}; margin-top:5px; font-weight:600;">${n[t.valState]||""}</div>`),t.tier&&(o+=`<div style="font-size:0.72em; color:#6b7280; margin-top:2px;">${t.tier==="primary"?"Core company value":"Secondary value"}</div>`)}else if(t.type==="role"){var l=(U().skills||[]).filter(N=>(N.roles||[]).indexOf(t.id)!==-1).length;o=`<div class="tooltip-title">${w(t.name)}</div>`,o+=`<div style="font-size:0.82em; color:#9ca3af; margin-top:2px;">${l} skills · Click to filter</div>`}else{o=`<div class="tooltip-title">${w(t.name)}</div>`;var d=t.level||"",s=t.key?" · Core Differentiator":"",c=(U().skills||[]).find(N=>N.name===t.name),p=(U().skillDetails||{})[t.name]||{},g=p.years||c&&c.yearsExperience||"",u=g?g+" yrs":"";if(d||u||s){var y=[];d&&y.push(d),u&&y.push(u),o+=`<div class="tooltip-level">${y.join(" · ")}${s}</div>`}var h=t.roles||[];h.length>0&&(o+='<div class="tooltip-roles">Used in: ',h.forEach(N=>{const oe=U().roles.find(q=>q.id===N||q.name===N);o+=`<span class="tooltip-role-tag">${w(oe?oe.name:N)}</span>`}),o+="</div>"),o+='<div style="font-size:0.72em; color:#6b7280; margin-top:6px; border-top:1px solid rgba(255,255,255,0.08); padding-top:5px;">Click for full detail</div>'}i.html(o).style("opacity",1);var b=i.node(),v=b.offsetWidth||200,m=b.offsetHeight||60,E=window.innerWidth,B=window.innerHeight,O=e.pageX,H=e.pageY,ve=E<=768,V,C;if(ve){V=Math.max(8,Math.min((E-v)/2,E-v-8));var ee=document.getElementById("networkView"),te=ee?ee.getBoundingClientRect():{top:0,bottom:B*.6},W=te.top+window.scrollY,ie=te.bottom+window.scrollY;C=H-m-20,C<W+8&&(C=H+20),C+m>ie-4&&(C=ie-m-4),C<W+4&&(C=W+4)}else V=O+12,C=H-12,V+v>E-10&&(V=O-v-12),C<10&&(C=H+16),C+m>B-10&&(C=B-m-10);i.style("left",V+"px").style("top",C+"px")}function wo(){d3.select("#tooltip").style("opacity",0)}var Ce=!1;function yo(e,t){Ce=!1;var i=window._d3simulation||(typeof simulation<"u"?simulation:null);i&&!e.active&&i.alphaTarget(.3).restart(),t.fx=t.x,t.fy=t.y,d3.select(e.sourceEvent.target).style("cursor","grabbing")}function bo(e,t){Ce=!0,t.fx=e.x,t.fy=e.y}function ho(e,t){var i=window._d3simulation||(typeof simulation<"u"?simulation:null);if(i&&!e.active&&i.alphaTarget(0),d3.select(e.sourceEvent.target).style("cursor",t.type==="center"?"pointer":"grab"),!Ce){t.type!=="center"&&(t.fx=null,t.fy=null);return}if(t.type!=="center"){var o=d3.select(e.sourceEvent.target);o.attr("stroke","rgba(255,255,255,0.4)").attr("stroke-width",2)}}function ko(){const e=U().skills||window._userData.skills||[],t=e.map(r=>({...r,impact:getSkillImpact(r)})).sort((r,l)=>(l.impact?.score||0)-(r.impact?.score||0)).slice(0,10),i=getEffectiveComp(),o=[];e.forEach(r=>{(r.evidence||[]).forEach(l=>{const d=(l.outcome||"")+" "+(l.description||"");let s=0;/\$[\d,]+[MBK]?/i.test(d)&&(s+=5),/\d+%/.test(d)&&(s+=4),/million|billion/i.test(d)&&(s+=5),/\d+x|\d+ times/i.test(d)&&(s+=3),(r.level==="Mastery"||r.level==="Expert")&&(s+=2),r.key&&(s+=2),o.push({skill:r.name,description:l.description,outcome:l.outcome,score:s})})}),o.sort((r,l)=>l.score-r.score);const a=o.slice(0,5).map(r=>({title:r.skill,metric:ii(r.outcome),description:r.description||"",outcome:r.outcome||""})),n=(window._userData.values||[]).filter(r=>r.selected!==!1).map(r=>r.name||r);return{name:window._userData.profile.name||"Your Name",title:window._userData.profile.currentTitle||"Your Title",company:window._userData.profile.currentCompany||"",location:window._userData.profile.location||"",headline:window._userData.profile.headline||`${window._userData.profile.currentTitle||"Strategic Professional"} · ${window._userData.profile.yearsExperience||""}+ Years`,generatedDate:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),executiveSummary:window._userData.profile.executiveSummary||window._userData.purpose||"Accomplished professional with proven track record of delivering measurable business impact.",purpose:window._userData.purpose||"",coreCompetencies:t,strategicOutcomes:a,leadershipPhilosophy:window._userData.purpose||"Leadership is about creating conditions where great work becomes inevitable.",marketPositioning:n.length>0?`Core principles: ${n.join(" · ")}.`:"Strategic professional with deep domain expertise and proven track record.",compensation:i,careerNarrative:window._userData.profile.executiveSummary||"A career defined by building bridges between technical innovation and business strategy.",futureVision:window._userData.purpose||"Focused on creating lasting impact through authentic leadership and evidence-based strategy."}}function ii(e){if(!e)return"";const t=e.match(/\$[\d.,]+[MBK]?(?:\s*\w+)?/i);if(t)return t[0];const i=e.match(/\d+%(?:\s*\w+)?/);if(i)return i[0];const o=e.match(/\d+x(?:\s*\w+)?/i);return o?o[0]:e.slice(0,40)+(e.length>40?"…":"")}function xo(e){var t=w;return'<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Blueprint - '+t(e.name)+'</title><link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}:root{--primary:#1e40af;--accent:#f59e0b;--text:#1f2937;--text-light:#6b7280;--border:#e5e7eb;--bg:#fff;--bg-alt:#f9fafb}body{font-family:Crimson Pro,Georgia,serif;color:var(--text);background:var(--bg);line-height:1.7;font-size:18px}.container{max-width:900px;margin:0 auto;padding:60px 40px}header{border-bottom:3px solid var(--primary);padding-bottom:40px;margin-bottom:60px}h1{font-size:48px;font-weight:700;color:var(--primary);margin-bottom:10px}h2{font-size:32px;font-weight:700;color:var(--primary);margin-bottom:20px;border-left:4px solid var(--accent);padding-left:20px}section{margin-bottom:60px}p{margin-bottom:16px}.subtitle{font-size:24px;color:var(--text-light);margin-bottom:20px}.headline{font-size:20px;color:var(--accent);font-weight:600}.meta{font-family:JetBrains Mono,monospace;font-size:14px;color:var(--text-light);margin-top:20px}.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;margin-top:30px}.skill-card{background:var(--bg-alt);border:1px solid var(--border);border-left:4px solid #3b82f6;padding:20px}.skill-name{font-size:18px;font-weight:600;color:var(--primary);margin-bottom:8px}.skill-level{font-family:JetBrains Mono,monospace;font-size:12px;color:var(--accent);text-transform:uppercase}.outcome{background:linear-gradient(to right,var(--bg-alt),var(--bg));border-left:4px solid var(--accent);padding:24px;margin-bottom:20px}.outcome-title{font-size:20px;font-weight:600;color:var(--primary);margin-bottom:8px}.outcome-metric{font-family:JetBrains Mono,monospace;font-size:16px;color:var(--accent);margin-bottom:10px}.comp-framework{background:var(--bg-alt);border:2px solid var(--primary);padding:30px;margin-top:30px}.comp-row{display:flex;justify-content:space-between;padding:16px 0;border-bottom:1px solid var(--border)}.comp-label{font-weight:600}.comp-value{font-family:JetBrains Mono,monospace;color:var(--primary);font-weight:600}.quote-block{background:linear-gradient(135deg,var(--primary),#3b82f6);color:#fff;padding:40px;margin:40px 0;font-size:22px;font-style:italic}@media print{body{font-size:11pt}.container{padding:20px}h1{font-size:28pt}h2{font-size:18pt}}</style></head><body><div class="container"><header><h1>'+t(e.name)+'</h1><div class="subtitle">'+t(e.title)+'</div><div class="headline">'+t(e.headline)+'</div><div class="meta">Generated: '+t(e.generatedDate)+"</div></header><section><h2>Executive Summary</h2><p>"+t(e.executiveSummary)+'</p></section><section><h2>Core Competencies</h2><p>Strategic capabilities driving measurable impact:</p><div class="skills-grid">'+e.coreCompetencies.map(o=>'<div class="skill-card"><div class="skill-name">'+t(o.name)+'</div><div class="skill-level">'+t(o.proficiency||"Expert")+"</div></div>").join("")+"</div></section><section><h2>Strategic Outcomes</h2>"+e.strategicOutcomes.map(o=>'<div class="outcome"><div class="outcome-title">'+t(o.title)+'</div><div class="outcome-metric">'+t(o.metric)+"</div><p>"+t(o.description)+"</p></div>").join("")+"</section><section><h2>Leadership Philosophy</h2><p>"+t(e.leadershipPhilosophy)+'</p></section><div class="quote-block">"'+t(e.marketPositioning)+'"</div><section><h2>Compensation Framework</h2><p>Market-informed positioning based on skill depth and impact:</p><div class="comp-framework"><div class="comp-row"><span class="comp-label">Base Market Rate</span><span class="comp-value">$'+Math.round(e.compensation.marketRate||2e5).toLocaleString()+'</span></div><div class="comp-row"><span class="comp-label">Conservative Range</span><span class="comp-value">$'+Math.round(e.compensation.conservativeOffer||225e3).toLocaleString()+'</span></div><div class="comp-row"><span class="comp-label">Competitive Range</span><span class="comp-value">$'+Math.round(e.compensation.competitiveOffer||275e3).toLocaleString()+"</span></div></div></section><section><h2>Career Narrative</h2><p>"+t(e.careerNarrative)+"</p></section><section><h2>Future Vision</h2><p>"+t(e.futureVision)+'</p></section><footer style="margin-top:80px;padding-top:40px;border-top:2px solid var(--border);color:var(--text-light);font-size:14px"><p>This Blueprint is a living document representing strategic capabilities and market positioning as of '+t(e.generatedDate)+'.</p><p style="margin-top:8px;">&copy; '+new Date().getFullYear()+" Cliff Jurkiewicz. All rights reserved. Blueprint&trade; and its methodologies are the intellectual property of Cliff Jurkiewicz. &middot; myblueprint.work</p></footer></div></body></html>"}function So(e,t){const i=new Blob([e],{type:"text/html"}),o=URL.createObjectURL(i),a=document.createElement("a");a.href=o,a.download=t,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(o)}function Eo(e){var t={Mastery:"10+",Expert:"7–10",Advanced:"4–7",Proficient:"2–4",Novice:"0–2",Competent:"1–3"};return t[e]||"2+"}function Bo(e){const t=U().skills.find(i=>i.name===e);t&&(window.openSkillModal||function(){})(e,t)}function Io(e){const t=U().skills.find(i=>i.name===e);t?(console.log("  → Skill has evidence:",t.evidence?`YES (${t.evidence.length} items)`:"NO"),(window.openSkillModal||function(){})(e,t)):console.error("  → ERROR: Skill not found in _sd().skills")}function Co(){const e=U().skills||window._userData.skills||[],t=window._userData.profile||{},i=getEffectiveComp(),o=[];e.forEach(u=>{(u.evidence||[]).forEach(y=>{const h=(y.outcome||"")+" "+(y.description||"");let b=0;/\$[\d,]+[MBK]?/i.test(h)&&(b+=5),/\d+%/.test(h)&&(b+=4),/\d+x|\d+ times/i.test(h)&&(b+=3),/\d+ (months?|years?|days?)/i.test(h)&&(b+=2),/million|billion/i.test(h)&&(b+=5),/zero|perfect|first|award|recogni/i.test(h)&&(b+=2),u.level==="Mastery"?b+=3:u.level==="Expert"?b+=2:u.level==="Advanced"&&(b+=1),u.key&&(b+=2),o.push({skill:u.name,level:u.level,category:u.category,roles:u.roles||[],description:y.description||"",outcome:y.outcome||"",score:b})})}),o.sort((u,y)=>y.score-u.score);const a=o.slice(0,10),n=e.filter(u=>u.key||u.level==="Mastery"||u.level==="Expert"),r=[],l=new Set;n.forEach(u=>{!l.has(u.name)&&r.length<18&&(r.push(u),l.add(u.name))}),e.filter(u=>u.level==="Advanced"&&!l.has(u.name)).slice(0,18-r.length).forEach(u=>{r.push(u),l.add(u.name)});const d={};(typeof getVisibleRoles=="function"?getVisibleRoles():window._userData.roles||U().roles||[]).forEach(u=>{const y=e.filter(h=>(h.roles||[]).includes(u.id));y.length>0&&(d[u.name]=y)});const s=(window._userData.values||[]).filter(u=>u.selected!==!1).map(u=>u.name||u),c=getVisibleWorkHistory().map(u=>({...u,achievements:u.achievements||[]})),p=window._userData.education||[],g=window._userData.certifications||[];return{name:t.name||"Your Name",title:t.currentTitle||"Professional",company:t.currentCompany||"",location:t.location||"",email:t.email||"",phone:t.phone||"",linkedinUrl:t.linkedinUrl||"",yearsExperience:t.yearsExperience||"",executiveSummary:t.executiveSummary||window._userData.purpose||"",purpose:window._userData.purpose||"",topAchievements:a,competencies:r,roleGroups:d,values:s,workHistory:c,education:p,certifications:g,compensation:i,generatedDate:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),totalSkills:e.length,masteryCount:e.filter(u=>u.level==="Mastery").length,expertCount:e.filter(u=>u.level==="Expert").length}}function Lo(e){const t=e.name,i=e.title,o=e.location?e.location.split(",").slice(-2).join(",").trim():"",a=e.compensation,n=a&&a.standardOffer?`$${Math.round(a.conservativeOffer/1e3)}K – $${Math.round(a.competitiveOffer/1e3)}K`:"",r=e.topAchievements.map(m=>{const E=m.outcome.trim().replace(/\.$/,""),B=m.description.trim().replace(/\.$/,""),O=B.length>120?B.slice(0,117)+"…":B;return`<li><span class="ach-outcome">${E}.</span> <span class="ach-context">${O}.</span></li>`}).join(`
`),l=e.competencies.map(m=>{const E=m.level==="Mastery"?"●●●":m.level==="Expert"?"●●○":m.level==="Advanced"?"●○○":"○○○";return`<div class="comp-item"><span class="comp-name">${w(m.name)}</span><span class="comp-dots">${E}</span></div>`}).join(`
`),d=e.values.length?e.values.map(m=>`<span class="value-tag">${w(m)}</span>`).join(""):"",s=[];if(e.email&&s.push(`<div class="contact-item">${e.email}</div>`),e.phone&&s.push(`<div class="contact-item">${e.phone}</div>`),o&&s.push(`<div class="contact-item">${o}</div>`),e.linkedinUrl){const m=e.linkedinUrl.replace(/^https?:\/\/(www\.)?/,"").replace(/\/$/,"");s.push(`<div class="contact-item"><a href="${sanitizeUrl(e.linkedinUrl)}" style="color:var(--ink-2); text-decoration:none;">${w(m)}</a></div>`)}e.yearsExperience&&s.push(`<div class="contact-item">${e.yearsExperience}+ Years Experience</div>`);const c=s.join('<div class="contact-sep">·</div>'),p=(e.workHistory||[]).map(m=>{const E=formatWorkDate(m.startDate||"")+" – "+(m.current?"Present":formatWorkDate(m.endDate||"")),B=(m.achievements||[]).map(O=>`<li>${O}</li>`).join(`
`);return`
        <div class="experience-block">
            <div class="exp-header">
                <div class="exp-title">${m.title||""}</div>
                <div class="exp-dates">${E}</div>
            </div>
            <div class="exp-company">${m.company||""}${m.location?" · "+m.location:""}</div>
            ${m.description?`<p class="exp-desc">${m.description}</p>`:""}
            ${B?`<ul class="exp-achievements">${B}</ul>`:""}
        </div>`}).join(`
`),g=(e.education||[]).map(m=>`<div class="edu-item">
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
                <div><strong>${m.degree||""}${m.field?" in "+m.field:""}</strong></div>
                <div class="exp-dates">${m.year||""}</div>
            </div>
            <div style="color:var(--ink-2);">${m.school||""}</div>
        </div>`).join(`
`),u=(e.certifications||[]).map(m=>`<span class="cert-tag">${m.name}${m.issuer?" ("+m.issuer+")":""}${m.year?" · "+m.year:""}</span>`).join(""),y=n?`<div class="contact-item">Target: ${n}</div>`:"",h=e.workHistory&&e.workHistory.length>0,b=e.education&&e.education.length>0,v=e.certifications&&e.certifications.length>0;return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Resume — ${t}</title>
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
    <div class="resume-name">${t}</div>
    <div class="resume-title">${i}</div>
    <div class="contact-row">
      ${c}
      ${y}
    </div>
  </header>

  <!-- PROFESSIONAL SUMMARY -->
  ${e.executiveSummary?`
  <section class="section">
    <div class="section-label">Professional Summary</div>
    <p class="summary-text">${e.executiveSummary}</p>
  </section>`:""}

  <!-- CORE COMPETENCIES -->
  ${e.competencies.length>0?`
  <section class="section">
    <div class="section-label">Core Competencies</div>
    <div class="comp-grid">
      ${l}
    </div>
    <div class="legend" style="margin-top:8pt;">Proficiency: ●●● Mastery &nbsp;·&nbsp; ●●○ Expert &nbsp;·&nbsp; ●○○ Advanced</div>
  </section>`:""}

  <!-- PROFESSIONAL EXPERIENCE -->
  ${h?`
  <section class="section">
    <div class="section-label">Professional Experience</div>
    ${p}
  </section>`:`
  <section class="section">
    <div class="section-label">Professional Experience</div>
    <div class="experience-block">
      <div class="exp-header">
<div class="exp-title">${i}</div>
<div class="exp-dates">Present${e.yearsExperience?" · "+e.yearsExperience+"+ years":""}</div>
      </div>
      <div class="exp-company">${e.company}${o?" · "+o:""}</div>
    </div>
    ${e.purpose?'<p class="summary-text" style="font-size:9.5pt; color: #4b5563;">'+e.purpose+"</p>":""}
  </section>`}

  <!-- SELECTED ACHIEVEMENTS -->
  ${e.topAchievements.length>0&&!h?`
  <section class="section">
    <div class="section-label">Selected Achievements</div>
    <ul class="achievements-list">
      ${r}
    </ul>
  </section>`:""}

  <!-- EDUCATION -->
  ${b?`
  <section class="section">
    <div class="section-label">Education</div>
    ${g}
  </section>`:""}

  <!-- CERTIFICATIONS -->
  ${v?`
  <section class="section">
    <div class="section-label">Certifications &amp; Licenses</div>
    <div style="display:flex; flex-wrap:wrap; gap:4pt;">
      ${u}
    </div>
  </section>`:""}

  <!-- VALUES -->
  ${d?`
  <section class="section">
    <div class="section-label">Core Values &amp; Leadership Principles</div>
    <div class="values-row">${d}</div>
  </section>`:""}

  <!-- FOOTER -->
  <footer class="resume-footer">
    <span>Generated by Blueprint&trade; · ${e.generatedDate} · &copy; ${new Date().getFullYear()} Cliff Jurkiewicz · myblueprint.work</span>
    <span>${e.totalSkills} documented skills · ${e.masteryCount+e.expertCount} at Mastery/Expert level</span>
  </footer>

</div><!-- /page -->
</body>
</html>`}let Mo={outcomes:[],values:[],purpose:"",shareSettings:{}};window._skillsData||(window._skillsData=skillsData);window._userData||(window._userData=userData);window._blueprintData||(window._blueprintData=Mo);window.updateStatsBar||(window.updateStatsBar=mo);window.toggleLabelPill||(window.toggleLabelPill=ei);window.applyLabelToggles||(window.applyLabelToggles=ti);window.renderFilterChips||(window.renderFilterChips=go);window.showTooltip||(window.showTooltip=vo);window.hideTooltip||(window.hideTooltip=wo);window.dragstarted||(window.dragstarted=yo);window.dragged||(window.dragged=bo);window.dragended||(window.dragended=ho);window.gatherBlueprintData||(window.gatherBlueprintData=ko);window.extractMetric||(window.extractMetric=ii);window.createBlueprintHTML||(window.createBlueprintHTML=xo);window.downloadBlueprint||(window.downloadBlueprint=So);window.estimateSkillYears||(window.estimateSkillYears=Eo);window.openRelatedSkill||(window.openRelatedSkill=Bo);window.openSkillModalFromCard||(window.openSkillModalFromCard=Io);window.gatherResumeData||(window.gatherResumeData=Co);window.buildResumeHTML||(window.buildResumeHTML=Lo);function oi(){if(fbAuth){var e=(document.getElementById("authName")||{}).value||"",t=(document.getElementById("authEmail")||{}).value||"",i=(document.getElementById("authPassword")||{}).value||"";if(!t||!i){showAuthError("Please enter email and password.");return}fbAuth.createUserWithEmailAndPassword(t,i).then(function(o){e&&o.user.updateProfile({displayName:e}),closeAuthModal(),ai(o.user)}).catch(function(o){showAuthError(ni(o.code))})}}window.authEmailSignUp=oi;function Do(){try{if(!fbAuth||!fbAuth.isSignInWithEmailLink(window.location.href))return;var e=localStorage.getItem("wbMagicLinkEmail");e||(e=prompt("Please enter your email to confirm sign-in:")),e&&fbAuth.signInWithEmailLink(e,window.location.href).then(function(t){localStorage.removeItem("wbMagicLinkEmail"),window.history.replaceState({},document.title,window.location.pathname),ai(t.user,t.additionalUserInfo&&t.additionalUserInfo.isNewUser)}).catch(function(t){console.error("Magic link sign-in failed:",t),x("Sign-in link expired or invalid. Please try again.","error")})}catch(t){console.warn("Magic link check skipped:",t.message)}}function ni(e){var t={"auth/email-already-in-use":"An account with this email already exists. Try signing in.","auth/invalid-email":"Please enter a valid email address.","auth/weak-password":"Password must be at least 6 characters.","auth/user-not-found":"No account found with this email.","auth/wrong-password":"Incorrect password.","auth/invalid-credential":"Incorrect email or password.","auth/too-many-requests":"Too many attempts. Please wait a moment and try again.","auth/network-request-failed":"Network error. Check your connection.","auth/popup-blocked":"Pop-up blocked by browser. Allow pop-ups for this site."};return t[e]||"Authentication error. Please try again."}function ai(e,t){if(e){if(fbDb){var i=fbDb.collection("users").doc(e.uid);i.get().then(function(o){if(o.exists)i.update({lastLogin:firebase.firestore.FieldValue.serverTimestamp()}),loadUserFromFirestore(e.uid);else{var a=e.displayName||e.email.split("@")[0];i.set({email:e.email,displayName:a,createdAt:firebase.firestore.FieldValue.serverTimestamp(),lastLogin:firebase.firestore.FieldValue.serverTimestamp(),role:"user",profile:{name:a,email:e.email},skills:[],roles:[]}),console.log("✓ Created Firestore user document"),window._userData.profile={name:a,email:e.email},window._userData.skills=[],window._userData.templateId="firestore-"+e.uid,typeof skillsData<"u"&&(skillsData.skills=[],skillsData.roles=[]),updateProfileChip(a),typeof initializeMainApp=="function"&&initializeMainApp(),setTimeout(function(){showOnboardingWizard()},600)}}).catch(function(o){console.error("Firestore user check failed:",o),x("Could not verify your account. Some features may be limited.","error",5e3)})}x("Welcome, "+w(e.displayName||e.email)+"!","success"),typeof bpTracker<"u"&&bpTracker.sid&&bpTracker.trackFunnel("signup")}}function To(){if(!showcaseMode){var e=document.getElementById("authNavBtn"),t=document.getElementById("profileChip"),i=document.getElementById("overflowSignIn"),o=document.getElementById("overflowSignOut"),a=document.getElementById("overflowAdmin");if(fbUser){e&&(e.style.display="none"),i&&(i.style.display="none"),o&&(o.style.display=""),a&&(a.style.display=fbIsAdmin?"":"none");var n=document.getElementById("adminBadge");if(n&&(n.style.display=fbIsAdmin?"inline-block":"none"),t){t.style.display="";var r=fbUser.displayName||fbUser.email.split("@")[0];updateProfileChip(r)}updateDemoToggleUI()}else{e&&(e.style.display=""),i&&(i.style.display=""),o&&(o.style.display="none"),a&&(a.style.display="none");var l=document.getElementById("adminBadge");l&&(l.style.display="none"),t&&(t.style.display="none"),updateDemoToggleUI()}}}function Ao(){}function $o(e){if(!e)return"?";var t=e.trim().split(/\s+/);return t.length>=2?(t[0][0]+t[t.length-1][0]).toUpperCase():e.substring(0,2).toUpperCase()}window.authEmailSignUp=oi;window.checkMagicLinkSignIn=Do;window.friendlyAuthError=ni;window.updateAuthUI=To;window.rebuildProfileDropdown=Ao;window.getInitials=$o;function ri(e){e&&e.stopPropagation()}window.toggleProfileDropdown=ri;function li(){}window.closeProfileDropdown=li;function zo(){}document.addEventListener("click",function(e){const t=document.getElementById("overflowMenu"),i=document.getElementById("overflowMenuBtn");t&&i&&t.style.display==="block"&&!t.contains(e.target)&&!i.contains(e.target)&&je()});function Po(e){e&&e.stopPropagation();const t=document.getElementById("overflowMenu"),i=document.getElementById("overflowMenuBtn");t.style.display==="block"?(t.style.display="none",i.classList.remove("active"),i.setAttribute("aria-expanded","false")):(t.style.display="block",i.classList.add("active"),i.setAttribute("aria-expanded","true"))}function je(){const e=document.getElementById("overflowMenu"),t=document.getElementById("overflowMenuBtn");e&&(e.style.display="none"),t&&(t.classList.remove("active"),t.setAttribute("aria-expanded","false"))}function Oo(){const e=document.getElementById("exportModal"),t=e.querySelector(".modal-content");var i="";if(isReadOnlyProfile){var o=appMode==="waitlisted"?"closeExportModal(); showToast('You are #"+(waitlistPosition||"?")+" on the waitlist!', 'info');":"closeExportModal(); showWaitlist();",a=appMode==="waitlisted"?"You’re #"+(waitlistPosition||"?")+" on the waitlist ✔":"Join the Waitlist →";i='<div style="background:linear-gradient(135deg, rgba(96,165,250,0.12), rgba(99,102,241,0.08)); border:1px solid rgba(96,165,250,0.25); border-radius:12px; padding:20px; margin-bottom:24px;"><div style="font-weight:700; color:#60a5fa; margin-bottom:8px; font-size:0.95em;">🔍 You’re exploring a sample profile</div><div style="color:var(--c-muted, #9ca3af); font-size:0.88em; line-height:1.6; margin-bottom:12px;">Everything you see is fully interactive — browse skills, explore job matches, compare values. The one export available is the <strong style="color:#10b981;">Scouting Report PDF</strong>, so you can see what Blueprint delivers to hiring teams.</div><div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:14px;"><div style="font-size:0.78em; font-weight:600; color:var(--c-faint, #6b7280); min-width:100%;">AVAILABLE NOW:</div><span style="font-size:0.75em; padding:3px 10px; border-radius:20px; background:rgba(16,185,129,0.15); color:#10b981;">Browse all tabs</span><span style="font-size:0.75em; padding:3px 10px; border-radius:20px; background:rgba(16,185,129,0.15); color:#10b981;">Skill networks</span><span style="font-size:0.75em; padding:3px 10px; border-radius:20px; background:rgba(16,185,129,0.15); color:#10b981;">Job matching</span><span style="font-size:0.75em; padding:3px 10px; border-radius:20px; background:rgba(16,185,129,0.15); color:#10b981;">Scouting Report PDF</span></div><div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:16px;"><div style="font-size:0.78em; font-weight:600; color:var(--c-faint, #6b7280); min-width:100%;">WITH YOUR OWN BLUEPRINT:</div><span style="font-size:0.75em; padding:3px 10px; border-radius:20px; background:rgba(96,165,250,0.15); color:#60a5fa;">Shareable HTML reports</span><span style="font-size:0.75em; padding:3px 10px; border-radius:20px; background:rgba(96,165,250,0.15); color:#60a5fa;">Executive Blueprint</span><span style="font-size:0.75em; padding:3px 10px; border-radius:20px; background:rgba(96,165,250,0.15); color:#60a5fa;">Resume &amp; cover letters</span><span style="font-size:0.75em; padding:3px 10px; border-radius:20px; background:rgba(96,165,250,0.15); color:#60a5fa;">Interview prep</span><span style="font-size:0.75em; padding:3px 10px; border-radius:20px; background:rgba(96,165,250,0.15); color:#60a5fa;">Negotiation guide</span><span style="font-size:0.75em; padding:3px 10px; border-radius:20px; background:rgba(96,165,250,0.15); color:#60a5fa;">LinkedIn optimizer</span><span style="font-size:0.75em; padding:3px 10px; border-radius:20px; background:rgba(96,165,250,0.15); color:#60a5fa;">Share links</span></div><button onclick="'+o+'" style="padding:10px 24px; border-radius:8px; border:none; background:linear-gradient(135deg,#3b82f6,#1d4ed8); color:#fff; font-weight:600; font-size:0.88em; cursor:pointer;">'+a+"</button></div>"}var n=isReadOnlyProfile?"":'<div style="display: flex; gap: 15px; align-items: start;"><div style="min-width: 40px;">'+f("settings",28)+'</div><div><div style="color: #60a5fa; font-weight: 600; margin-bottom: 5px;">Settings (More menu)</div><div style="color: #d1d5db; font-size: 0.95em; line-height: 1.6;">Update your profile info, preferences, and manage your skills. Export your full profile as JSON to save your work or move it to another device.</div></div></div>',r=isReadOnlyProfile?"Generate a Scouting Report PDF to see how Blueprint builds targeted career intelligence for a specific job — match analysis, gap bridging, verified credentials, and market positioning.":"Your premium career intelligence artifact. Each scouting report is a standalone, shareable document built for a specific job — including interactive skill/value networks, match analysis, gap bridging, verified credentials, and blind mode for bias-free evaluation.",l="Your source of truth. See your market valuation, manage outcomes, choose values, and write your purpose statement."+(isReadOnlyProfile?"":" Export as a resume or personalized page to share with recruiters.");t.innerHTML=`<div class="modal-header"><div class="modal-header-left"><h2 class="modal-title">How to Use Blueprint</h2></div><button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()">×</button></div><div class="modal-body" style="padding: 30px;"><div style="background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.18); border-radius:10px; padding:16px; margin-bottom:20px;"><div style="font-size:0.85em; color:#fbbf24; font-weight:700; margin-bottom:6px;">⚡ Active Preview</div><div style="font-size:0.82em; color:var(--c-muted, #9ca3af); line-height:1.6; margin-bottom:10px;">Blueprint is in active development. What you’re exploring is a working preview — features are shipping weekly and the platform is evolving fast. Sample scouting reports are available for select characters during the preview. Your feedback directly shapes what gets built next.</div><button onclick="closeExportModal(); sendFeedback('help');" style="padding:7px 16px; border-radius:7px; border:1px solid rgba(245,158,11,0.25); background:rgba(245,158,11,0.08); color:#fbbf24; font-weight:600; font-size:0.78em; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='rgba(245,158,11,0.15)'" onmouseout="this.style.background='rgba(245,158,11,0.08)'">✉ Give Feedback</button></div>`+i+'<div style="display: flex; flex-direction: column; gap: 20px;"><div style="display: flex; gap: 15px; align-items: start;"><div style="min-width: 40px;">'+f("compass",28)+'</div><div><div style="color: #60a5fa; font-weight: 600; margin-bottom: 5px;">Skills Network</div><div style="color: #d1d5db; font-size: 0.95em; line-height: 1.6;">Your interactive skill constellation. Every node is a skill; every cluster is a professional domain.</div><div style="margin-top:10px; padding:12px 14px; background:rgba(96,165,250,0.08); border:1px solid rgba(96,165,250,0.2); border-radius:8px;"><div style="font-size:0.82em; color:#60a5fa; font-weight:700; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.05em;">Network Controls</div><div style="display:grid; gap:6px; font-size:0.88em; color:#d1d5db;"><div><strong style="color:#f59e0b;">Drag</strong> any node to rearrange the layout — the network remembers where you put things</div><div><strong style="color:#f59e0b;">Hover</strong> over a skill to highlight its connections and see which domains it bridges</div><div><strong style="color:#f59e0b;">Click a skill</strong> to open its detail card with evidence, proficiency level, and role assignments</div><div><strong style="color:#f59e0b;">Click a domain</strong> (large node) to filter the network to just that role cluster</div><div><strong style="color:#f59e0b;">Match Overlay</strong> — select a job from the Pipeline, then return to Skills. Four overlay modes light up: <em>You · Job · Match · Values</em></div></div></div></div></div><div style="display: flex; gap: 15px; align-items: start;"><div style="min-width: 40px;">'+f("briefcase",28)+'</div><div><div style="color: #60a5fa; font-weight: 600; margin-bottom: 5px;">Jobs Tab</div><div style="color: #d1d5db; font-size: 0.95em; line-height: 1.6;">Find opportunities matched to your actual skill profile. Skills you have are highlighted green; gaps shown in red. Generate a personalized outreach message for any role.</div></div></div><div style="display: flex; gap: 15px; align-items: start;"><div style="min-width: 40px;">'+f("bar-chart",28)+'</div><div><div style="color: #60a5fa; font-weight: 600; margin-bottom: 5px;">Blueprint Tab</div><div style="color: #d1d5db; font-size: 0.95em; line-height: 1.6;">'+l+'</div></div></div><div style="display: flex; gap: 15px; align-items: start;"><div style="min-width: 40px;">'+f("target",28)+'</div><div><div style="color: #60a5fa; font-weight: 600; margin-bottom: 5px;">Scouting Reports</div><div style="color: #d1d5db; font-size: 0.95em; line-height: 1.6;">'+r+'</div><div style="margin-top:10px; padding:12px 14px; background:rgba(96,165,250,0.08); border:1px solid rgba(96,165,250,0.2); border-radius:8px;"><div style="font-size:0.82em; color:#60a5fa; font-weight:700; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.05em;">How to Create</div><div style="display:grid; gap:6px; font-size:0.88em; color:#d1d5db;"><div><strong style="color:#f59e0b;">From any job card</strong> in your Pipeline — tap “Create Scouting Report”</div><div><strong style="color:#f59e0b;">From Job Detail</strong> — the Scouting Report button sits alongside Compare Skills and Values Fit</div><div><strong style="color:#f59e0b;">From Match Overlay</strong> — after comparing skills, create the report right from the match legend</div><div><strong style="color:#f59e0b;">From Blueprint Tab</strong> — Export → Scouting Report card</div></div></div><button onclick="closeExportModal(); openSampleScoutingReport()" style="margin-top:12px; padding:10px 20px; border-radius:8px; border:1px solid rgba(96,165,250,0.3); background:linear-gradient(135deg, rgba(96,165,250,0.1), rgba(99,102,241,0.06)); color:#60a5fa; font-weight:600; font-size:0.88em; cursor:pointer; display:flex; align-items:center; gap:8px;">'+f("file-text",16)+" View Sample Scouting Report</button></div></div>"+n+"</div></div>",history.pushState({modal:!0},""),e.classList.add("active")}function si(){if(!document.getElementById("teaserOverlay")){var e=document.createElement("div");e.id="teaserOverlay",e.className="teaser-overlay",e.innerHTML=`<div class="teaser-card"><div class="teaser-header"><div class="teaser-mark"><span class="teaser-mark-dot"></span> BLUEPRINT</div><div class="teaser-title">The resume is dead.<br>Here is your <em>Blueprint.</em></div><div class="teaser-sub">You collapse your life's work into a flat document that barely represents your capability. Not because you lack ability, but because the enterprise owns the systems that evaluate you.<br><br>Blueprint changes that. It maps the hidden architecture of your skills, proficiency, values, and outcomes against the world's largest skill ontologies, then gives you the intelligence to own every career conversation.</div></div><div class="teaser-features"><div class="teaser-feat"><div class="teaser-feat-icon" style="color:#60a5fa;">`+f("skills",15)+' Skills Architecture</div><div class="teaser-feat-desc">Your complete skill ontology mapped across roles, proficiency levels, and evidence. Not a keyword list.</div></div><div class="teaser-feat"><div class="teaser-feat-icon" style="color:#10b981;">'+f("jobs",15)+' Job Intelligence</div><div class="teaser-feat-desc">Paste any job description. Blueprint scores the match, finds gaps, and builds your talking points.</div></div><div class="teaser-feat"><div class="teaser-feat-icon" style="color:#f59e0b;">'+f("values",15)+' Values Alignment</div><div class="teaser-feat-desc">Your operating principles surfaced and mapped against company culture. Know the fit before you walk in.</div></div><div class="teaser-feat"><div class="teaser-feat-icon" style="color:#a78bfa;">'+f("target",15)+' Scouting Reports</div><div class="teaser-feat-desc">Interactive career intelligence documents that attract recruiters and hiring managers to you.</div></div><div class="teaser-feat"><div class="teaser-feat-icon" style="color:#ec4899;">'+f("dollar",15)+' Market Valuation</div><div class="teaser-feat-desc">Evidence-based compensation intelligence. Know your worth before negotiation starts.</div></div><div class="teaser-feat"><div class="teaser-feat-icon" style="color:#06b6d4;">'+f("purpose",15)+` Purpose & Narrative</div><div class="teaser-feat-desc">Your career story distilled into the language that connects who you are with what the work demands.</div></div></div><div class="teaser-promise"><strong>Free for the individual.</strong> No corporate gatekeeping. Your data stays yours.<br>I've been advocating for replacing the resume and job description for years. This is the proof of concept.</div><div class="teaser-actions"><button class="teaser-btn-primary" onclick="closeTeaserModal(); showWaitlist('teaser');">Join the Waitlist</button><button class="teaser-btn-ghost" onclick="closeTeaserModal();">Start Exploring</button></div><div class="teaser-backstory">This project has been in the making publicly since 2024. <a href="https://www.linkedin.com/posts/cliffj_workblueprint-futureofwork-skillsbasedorganizations-activity-7387133545355345920-eOwI" target="_blank" rel="noopener">See the backstory on LinkedIn →</a></div></div>`,document.body.appendChild(e),requestAnimationFrame(function(){requestAnimationFrame(function(){e.classList.add("visible")})}),e.addEventListener("click",function(i){i.target===e&&he()});var t=function(i){i.key==="Escape"&&(he(),document.removeEventListener("keydown",t))};document.addEventListener("keydown",t)}}window.showTeaserModal=si;function he(){var e=document.getElementById("teaserOverlay");e&&(safeSet("bp_teaser_seen","1"),e.classList.remove("visible"),setTimeout(function(){e.remove()},400))}window.closeTeaserModal=he;function No(){const e=document.getElementById("exportModal"),t=e.querySelector(".modal-content");t.innerHTML=`
        <div class="modal-header" style="flex-direction:column; align-items:center; text-align:center; padding-bottom:20px;">
            <button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()" style="position:absolute; top:16px; right:16px;">×</button>
            <h2 class="modal-title" style="text-align:center; width:100%;">The Resume is Dead.<br>Here is Your Blueprint.<span style="font-size:0.5em; font-weight:400; vertical-align:super;">™</span></h2>
            <p style="color: var(--text-secondary); margin-top: 8px; font-size:0.95em;">Your career, fully represented.</p>
            <p style="color: var(--text-muted); margin-top: 4px; font-size:0.78em;">${BP_VERSION}</p>
        </div>
        <div class="modal-body" style="padding: 30px;">
            <p style="color: #d1d5db; line-height: 1.8; margin-bottom: 20px;">
                Most professionals are forced to collapse their life’s work into a flat, one-dimensional document 
                that barely scratches the surface of their true capability. You don’t underrepresent yourself because 
                you lack ability—you do it because the enterprise owns the systems of evaluation.
            </p>
            <p style="color: #d1d5db; line-height: 1.8; margin-bottom: 28px;">
                Blueprint changes that. This is your counter-intelligence suite. By mapping the hidden architecture 
                of your skills, proficiency levels, and values against the world’s largest skill ontologies, Blueprint 
                gives you the same high-fidelity data that employers use. It moves you from a passive applicant to an 
                informed operator, giving you the radical clarity and evidence you need to own every career conversation 
                and negotiate your true market value.
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div style="background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.3); border-radius: 8px; padding: 15px;">
                    <div style="color: #60a5fa; font-weight: 700; margin-bottom: 4px;">${f("compass",14)} Decode Your Expertise</div>
                    <div style="color: #9ca3af; font-size: 0.9em; line-height:1.6;">Surface the latent skills and differentiators that standard resumes ignore.</div>
                </div>
                <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 8px; padding: 15px;">
                    <div style="color: #10b981; font-weight: 700; margin-bottom: 4px;">${f("dollar",14)} Negotiate with Intelligence</div>
                    <div style="color: #9ca3af; font-size: 0.9em; line-height:1.6;">Access real-world market ranges to know your worth before you walk into the room.</div>
                </div>
                <div style="background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); border-radius: 8px; padding: 15px;">
                    <div style="color: #fbbf24; font-weight: 700; margin-bottom: 4px;">${f("bar-chart",14)} Own Your Narrative</div>
                    <div style="color: #9ca3af; font-size: 0.9em; line-height:1.6;">A complete system for documenting outcomes, values, and purpose—on your terms.</div>
                </div>
                <div style="background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); border-radius: 8px; padding: 15px;">
                    <div style="color: #a78bfa; font-weight: 700; margin-bottom: 4px;">${f("external",14)} Bridge the Gap</div>
                    <div style="color: #9ca3af; font-size: 0.9em; line-height:1.6;">Connect your architecture directly to the role with interactive, human-centric storytelling.</div>
                </div>
            </div>
            <p style="color: #6b7280; font-size: 0.85em; text-align: center; line-height:1.6;">Free for the individual. No corporate fluff. Your data stays yours.</p>
        </div>
    `,history.pushState({modal:!0},""),e.classList.add("active")}function di(e){var t=window._userData.profile&&window._userData.profile.name||"Unknown",i=window._userData.templateId||"none",o=currentView||"unknown",a=e?" ("+e+")":"",n=encodeURIComponent("Blueprint Feedback "+BP_VERSION+a),r=encodeURIComponent("Profile: "+t+`
Template: `+i+`
View: `+o+`
Version: `+BP_VERSION+`
Mode: `+(appContext.mode||"live")+`
Date: `+new Date().toISOString()+`

--- Your feedback below ---

`);window.open("mailto:cliffj8338@gmail.com?subject="+n+"&body="+r,"_blank")}window.sendFeedback=di;function ci(){var e=document.getElementById("exportModal"),t=e.querySelector(".modal-content");t.innerHTML='<div class="modal-header"><div class="modal-header-left"><h2 class="modal-title">Legal &amp; Intellectual Property Notice</h2></div><button class="modal-close" aria-label="Close dialog" onclick="closeExportModal()">&times;</button></div><div class="modal-body" style="padding:28px; color:var(--text-secondary); line-height:1.8; font-size:0.9em;"><h3 style="color:var(--text-primary); font-size:1.05em; margin-bottom:12px;">Trademark</h3><p style="margin-bottom:20px;">Blueprint&trade; is a trademark of Cliff Jurkiewicz. The Blueprint name, logo, network mark, and associated visual identity are the property of Cliff Jurkiewicz. Unauthorized use of the Blueprint name or mark is prohibited.</p><h3 style="color:var(--text-primary); font-size:1.05em; margin-bottom:12px;">Copyright</h3><p style="margin-bottom:20px;">&copy; '+new Date().getFullYear()+' Cliff Jurkiewicz. All rights reserved. The Blueprint software, including its source code, user interface design, visual assets, and documentation, is the copyrighted work of Cliff Jurkiewicz. No portion of this software may be reproduced, distributed, or transmitted in any form without prior written permission.</p><h3 style="color:var(--text-primary); font-size:1.05em; margin-bottom:12px;">Intellectual Property</h3><p style="margin-bottom:20px;">The following are original methodologies and intellectual property of Cliff Jurkiewicz:</p><div style="margin-bottom:20px; padding:16px; background:var(--c-accent-bg-2e); border:1px solid var(--c-accent-bg-6d); border-radius:8px;"><div style="margin-bottom:8px;"><strong style="color:var(--text-primary);">Blueprint Ontology System</strong> &mdash; The professional skill ontology architecture, role-cluster mapping methodology, and 90-skill framework integrating O*NET occupational data with individualized career modeling.</div><div style="margin-bottom:8px;"><strong style="color:var(--text-primary);">Match Algorithm</strong> &mdash; The weighted skill-matching engine including fuzzy word-overlap scoring, requirement-level classification, and proficiency-weighted gap analysis.</div><div style="margin-bottom:8px;"><strong style="color:var(--text-primary);">Network Visualization</strong> &mdash; The force-directed ontology visualization system including the match overlay methodology for displaying skill alignment between professional profiles and job requirements.</div><div><strong style="color:var(--text-primary);">Proprietary Frameworks</strong> &mdash; Including but not limited to: human-in-the-lead (vs. human-in-the-loop), candidate experience architecture, and AI fluency models.</div></div><h3 style="color:var(--text-primary); font-size:1.05em; margin-bottom:12px;">Third-Party Data</h3><p style="margin-bottom:20px;">Blueprint incorporates data from the O*NET program (U.S. Department of Labor) and the ESCO classification (European Commission). These datasets are used under their respective open-access terms. Their inclusion does not imply endorsement by these organizations.</p><h3 style="color:var(--text-primary); font-size:1.05em; margin-bottom:12px;">User Data</h3><p>Users retain ownership of their personal data entered into Blueprint. Blueprint does not sell, share, or monetize user data. Profile data is stored locally in the browser and, when authenticated, encrypted in cloud storage accessible only to the account holder.</p></div>',history.pushState({modal:!0},""),e.classList.add("active")}window.showLegalNotice=ci;document.addEventListener("click",function(e){const t=document.getElementById("overflowMenu"),i=document.getElementById("overflowMenuBtn");t&&i&&t.style.display==="block"&&!t.contains(e.target)&&!i.contains(e.target)&&je()});var it=null;window.addEventListener("resize",function(){clearTimeout(it),it=setTimeout(function(){currentView==="network"&&currentSkillsView==="network"&&(activeJobForNetwork&&networkMatchMode!=="you"?setNetworkMatchMode(networkMatchMode):(window.networkInitialized=!1,initNetwork(),window.networkInitialized=!0))},250)});window.addEventListener("popstate",function(e){var t=document.querySelector(".modal.active");if(t){t.classList.remove("active");return}var i=e.state&&e.state.view?e.state.view:"welcome";_skipHistoryPush=!0,switchView(i),_skipHistoryPush=!1});window.toggleProfileDropdown=ri;window.closeProfileDropdown=li;window.buildProfileDropdown=zo;window.toggleOverflowMenu=Po;window.closeOverflowMenu=je;window.showHelp=Oo;window.showTeaserModal=si;window.closeTeaserModal=he;window.showAbout=No;window.sendFeedback=di;window.showLegalNotice=ci;var P=!1,fe=[],ge=0,I=null,S=null,ke="",_o="bp_tour_seen",Ro="bp_tour_welcome_seen",pi=document.createElement("style");pi.textContent='.tour-overlay {  position: fixed; inset: 0; z-index: 99998;  background: rgba(0,0,0,0.6);  pointer-events: auto; transition: opacity 0.25s;}.tour-overlay.fade-in { opacity: 1; }.tour-overlay.fade-out { opacity: 0; }.tour-spotlight {  position: fixed; z-index: 99998; border-radius: 10px;  box-shadow: 0 0 0 4px rgba(245,158,11,0.35);  pointer-events: none; transition: all 0.35s cubic-bezier(0.4,0,0.2,1);}.tour-tooltip {  position: fixed; z-index: 99999; max-width: 380px; width: calc(100vw - 32px);  background: var(--bg-card, #1e1e2e); border: 1px solid var(--border, #333);  border-radius: 14px; padding: 20px 22px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.4);  font-family: Outfit, system-ui, sans-serif; transition: all 0.3s cubic-bezier(0.4,0,0.2,1);}.tour-tooltip.fade-in { opacity: 1; transform: translateY(0); }.tour-tooltip.fade-out { opacity: 0; transform: translateY(8px); }.tour-tooltip::before {  content: ""; position: absolute; width: 14px; height: 14px;  background: var(--bg-card, #1e1e2e); border: 1px solid var(--border, #333);  transform: rotate(45deg); z-index: -1;}.tour-tooltip.arrow-top::before { top: -8px; left: 50%; margin-left: -7px; border-right: none; border-bottom: none; }.tour-tooltip.arrow-bottom::before { bottom: -8px; left: 50%; margin-left: -7px; border-left: none; border-top: none; }.tour-tooltip.arrow-none::before { display: none; }.tour-step-badge {  display: inline-block; font-size: 0.7em; color: var(--accent, #f59e0b); font-weight: 700;  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;}.tour-title {  font-size: 1.12em; font-weight: 700; color: var(--text-primary, #f0f0f0);  margin-bottom: 6px; line-height: 1.3;}.tour-desc {  font-size: 0.88em; color: var(--text-secondary, #a0a0b0); line-height: 1.55; margin-bottom: 16px;}.tour-actions {  display: flex; justify-content: space-between; align-items: center; gap: 8px;}.tour-btn {  padding: 8px 18px; border-radius: 8px; font-size: 0.85em; font-weight: 600;  cursor: pointer; border: none; transition: all 0.15s;}.tour-btn-primary {  background: var(--accent, #f59e0b); color: #000;}.tour-btn-primary:hover { filter: brightness(1.1); }.tour-btn-secondary {  background: transparent; color: var(--text-secondary, #a0a0b0); border: 1px solid var(--border, #333);}.tour-btn-secondary:hover { background: rgba(255,255,255,0.05); }.tour-btn-skip {  background: transparent; color: var(--text-muted, #666); font-size: 0.8em;  padding: 8px 12px;}.tour-btn-skip:hover { color: var(--text-secondary, #a0a0b0); }.tour-dots {  display: flex; gap: 5px; align-items: center;}.tour-dot {  width: 6px; height: 6px; border-radius: 50%; background: var(--border, #333); transition: all 0.2s;}.tour-dot.active { background: var(--accent, #f59e0b); width: 18px; border-radius: 3px; }.tour-dot.done { background: var(--accent, #f59e0b); opacity: 0.4; }#tourHelpBtn {  position: fixed; bottom: 24px; right: 24px; z-index: 9990;  width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--border, #333);  background: var(--bg-card, #1e1e2e); color: var(--accent, #f59e0b);  font-size: 1.2em; font-weight: 800; cursor: pointer;  box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: all 0.2s;  display: flex; align-items: center; justify-content: center;  font-family: Outfit, system-ui, sans-serif;}#tourHelpBtn:hover { transform: scale(1.1); border-color: var(--accent, #f59e0b); }#tourHelpMenu {  position: fixed; bottom: 78px; right: 24px; z-index: 9991;  background: var(--bg-card, #1e1e2e); border: 1px solid var(--border, #333);  border-radius: 12px; padding: 8px; min-width: 200px;  box-shadow: 0 12px 40px rgba(0,0,0,0.4); display: none;  font-family: Outfit, system-ui, sans-serif;}#tourHelpMenu button {  display: block; width: 100%; text-align: left; padding: 10px 14px;  background: transparent; border: none; color: var(--text-primary, #f0f0f0);  font-size: 0.88em; cursor: pointer; border-radius: 8px; transition: background 0.15s;}#tourHelpMenu button:hover { background: rgba(255,255,255,0.06); }#tourHelpMenu .tour-menu-label {  padding: 6px 14px 4px; font-size: 0.72em; color: var(--text-muted, #666);  text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;}#tourHelpMenu .tour-menu-divider { height: 1px; background: var(--border, #333); margin: 4px 0; }@media (max-width: 768px) {  #tourHelpBtn { bottom: 80px; right: 16px; width: 40px; height: 40px; font-size: 1.05em; }  #tourHelpMenu { bottom: 130px; right: 16px; }  .tour-tooltip { max-width: calc(100vw - 24px); padding: 16px 18px 14px; }}';document.head.appendChild(pi);function De(e,t){P&&Z(),ke=e,fe=t,ge=0,P=!0,window._profileExplicitlySelected=!0,vi(),ui(),Le(0)}function Z(e){P=!1,I&&(I.style.clipPath="",I.remove(),I=null),S&&(S.remove(),S=null);var t=document.querySelector(".tour-spotlight");if(t&&t.remove(),e!==!1){try{localStorage.setItem(_o,"true")}catch{}if(ke==="welcome")try{localStorage.setItem(Ro,"true")}catch{}}fe=[],ge=0}function ui(){I=document.createElement("div"),I.className="tour-overlay fade-in",I.onclick=function(e){e.target===I&&Z()},document.body.appendChild(I),S=document.createElement("div"),S.className="tour-tooltip arrow-none fade-in",document.body.appendChild(S)}function Le(e){if(e<0||e>=fe.length){Z();return}ge=e;var t=fe[e];try{t.beforeShow&&t.beforeShow()}catch(o){console.warn("Tour beforeShow error at step "+e+":",o)}var i=t.delay||(t.beforeShow?450:50);setTimeout(function(){fi(t,e)},i)}function fi(e,t){if(P)try{var i=e.target?document.querySelector(e.target):null;if(e.target&&!i){setTimeout(function(){P&&(i=document.querySelector(e.target),le(e,t,i))},500);return}le(e,t,i)}catch(o){console.warn("Tour renderStep error at step "+t+":",o),le(e,t,null)}}function le(e,t,i){if(!(!P||!S))try{var o=document.querySelector(".tour-spotlight");if(o&&o.remove(),i){var a=i.getBoundingClientRect(),n=e.spotlightPad||8,r=e.spotlightRadius||"10px",l=window.innerWidth*.8,d=window.innerHeight*.7,s=a.width>l&&a.height>d;if(!s&&a.width>0&&a.height>0){var c=document.createElement("div");c.className="tour-spotlight",c.style.top=a.top-n+"px",c.style.left=a.left-n+"px",c.style.width=a.width+n*2+"px",c.style.height=a.height+n*2+"px",c.style.borderRadius=r,document.body.appendChild(c);var p=a.left-n,g=a.top-n,u=a.width+n*2,y=a.height+n*2,h="polygon(0% 0%, 0% 100%, "+p+"px 100%, "+p+"px "+g+"px, "+(p+u)+"px "+g+"px, "+(p+u)+"px "+(g+y)+"px, "+p+"px "+(g+y)+"px, "+p+"px 100%, 100% 100%, 100% 0%)";I.style.clipPath=h,I.style.webkitClipPath=h}else I.style.clipPath="",I.style.webkitClipPath="";if(!s&&(a.top<0||a.bottom>window.innerHeight)){i.scrollIntoView({behavior:"smooth",block:"center"}),setTimeout(function(){P&&le(e,t,i)},400);return}s?ne(e,t,null):ne(e,t,a)}else I.style.clipPath="",I.style.webkitClipPath="",ne(e,t,null)}catch(b){console.warn("Tour positioning error:",b),I.style.clipPath="",I.style.webkitClipPath="",ne(e,t,null)}}function ne(e,t,i){if(S){for(var o=fe.length,a=t===0,n=t===o-1,r='<div class="tour-dots">',l=0;l<o;l++){var d=l<t?"done":l===t?"active":"";r+='<div class="tour-dot '+d+'"></div>'}if(r+="</div>",S.innerHTML='<div class="tour-step-badge">'+(e.badge||(ke==="welcome"?"Tour":ke))+" · "+(t+1)+" of "+o+'</div><div class="tour-title">'+(e.title||"")+'</div><div class="tour-desc">'+(e.desc||"")+'</div><div class="tour-actions">'+(a?'<button class="tour-btn tour-btn-skip" onclick="window._bpTour.end()">Skip tour</button>':'<button class="tour-btn tour-btn-secondary" onclick="window._bpTour.prev()">← Back</button>')+r+(n?'<button class="tour-btn tour-btn-primary" onclick="window._bpTour.end()">Got it! ✓</button>':'<button class="tour-btn tour-btn-primary" onclick="window._bpTour.next()">Next →</button>')+"</div>",S.style.top="",S.style.bottom="",S.style.left="",S.style.right="",S.style.transform="",S.style.width="",S.className="tour-tooltip fade-in",!i){S.classList.add("arrow-none"),S.style.top="50%",S.style.left="50%",S.style.transform="translate(-50%, -50%)";return}var s=220,c=window.innerHeight-i.bottom,p=i.top,g=c>=s+20||c>p?"below":"above",u=Math.min(380,window.innerWidth-32),y=i.left+i.width/2-u/2;y=Math.max(12,Math.min(window.innerWidth-u-12,y)),S.style.width=u+"px",S.style.left=y+"px",g==="below"?(S.style.top=i.bottom+16+"px",S.classList.add("arrow-top")):(S.style.top=Math.max(12,i.top-s-16)+"px",S.classList.add("arrow-bottom"))}}function We(){P&&Le(ge+1)}function qe(){P&&Le(ge-1)}document.addEventListener("keydown",function(e){P&&(e.key==="Escape"?Z():e.key==="ArrowRight"||e.key==="Enter"?We():e.key==="ArrowLeft"&&qe())});function mi(){var e=document.createElement("button");e.id="tourHelpBtn",e.innerHTML="?",e.title="Take a tour",e.onclick=function(i){i.stopPropagation(),gi()},document.body.appendChild(e);var t=document.createElement("div");t.id="tourHelpMenu",t.innerHTML='<div class="tour-menu-label">Guided Tours</div><button onclick="window._bpTour.startWelcome()">'+f("compass",15)+` Full Tour</button><div class="tour-menu-divider"></div><div class="tour-menu-label">Section Tours</div><button onclick="window._bpTour.startMini('skills')">`+f("network",15)+` Skills Network</button><button onclick="window._bpTour.startMini('jobs')">`+f("target",15)+` Job Matching</button><button onclick="window._bpTour.startMini('blueprint')">`+f("blueprint",15)+` Blueprint Dashboard</button><button onclick="window._bpTour.startMini('samples')">`+f("users",15)+" Sample Profiles</button>",document.body.appendChild(t),document.addEventListener("click",function(i){var o=document.getElementById("tourHelpMenu");o&&o.style.display!=="none"&&!o.contains(i.target)&&i.target.id!=="tourHelpBtn"&&(o.style.display="none")})}function gi(){var e=document.getElementById("tourHelpMenu");e&&(e.style.display=e.style.display==="none"||!e.style.display?"block":"none")}function vi(){var e=document.getElementById("tourHelpMenu");e&&(e.style.display="none")}function wi(){var e=window._userData.profile&&window._userData.profile.name||"this profile",t=(skillsData.skills||[]).length;return[{title:"Your Skills, Fully Mapped",desc:"Every node is a skill. <strong>Size</strong> = proficiency. <strong>Color</strong> = role cluster. Built on professional-grade <strong>O*NET</strong> and <strong>ESCO</strong> taxonomies."+(t>0?" This profile has <strong>"+t+"</strong> mapped.":"")+'<br><br><span style="color:#60a5fa;">Drag any node to rearrange. Tap one to see the evidence behind it.</span>',badge:"Skills Architecture",target:"#controlsBar",spotlightPad:6,beforeShow:function(){switchView("skills")},delay:600},{title:"Test Yourself Against Any Job",desc:'Paste any job description. Blueprint parses the requirements, scores your match, and shows exactly where you align <span style="color:#10b981;">&#9679;</span>, where the gaps are <span style="color:#ef4444;">&#9679;</span>, and where you have leverage <span style="color:#64748b;">&#9679;</span>.<br><br>Then toggle the <strong>Match Overlay</strong> on the skills network to see it visually.',badge:"Job Intelligence",target:"#nav-jobs",spotlightPad:4,beforeShow:function(){switchView("jobs")}},{title:"Know the Fit Before You Walk In",desc:"Blueprint surfaces your <strong>core professional values</strong> from career patterns — not a personality quiz. Then it maps them against company culture profiles so you can see alignment before you commit.<br><br>Because the right job isn’t just about skills. It’s about fit.",badge:"Values Alignment",target:"#nav-blueprint",spotlightPad:4,beforeShow:function(){switchView("blueprint"),switchBlueprintTab("values")},delay:400},{title:"Attract Them to You",desc:"Generate a <strong>Scouting Report</strong> — an interactive career intelligence page designed to be sent to recruiters and hiring managers. Your skills, match analysis, talking points, and values alignment in one shareable document.<br><br>This isn’t a resume. It’s a signal that you’re a different kind of candidate."+(isReadOnlyProfile?'<br><span style="color:#10b981;">Try it — sample reports are available on the Reports page.</span>':""),badge:"Scouting Reports",target:"#nav-reports",spotlightPad:4,beforeShow:function(){switchView("reports")},delay:400},{title:"Know Your Number",desc:"<strong>Evidence-based</strong> valuation reflects what your documented outcomes prove. <strong>Potential</strong> reflects your full skill architecture. Both are powered by BLS salary data and skill rarity analysis.<br><br>Walk into every compensation conversation knowing your range — and the evidence to justify it.",badge:"Market Valuation",target:"#nav-blueprint",spotlightPad:4,beforeShow:function(){switchView("blueprint"),switchBlueprintTab("overview")},delay:400},{title:"Your Career Story, Distilled",desc:"Blueprint synthesizes your skills, outcomes, and values into a <strong>purpose statement</strong> — the language that connects who you are with what the work demands.<br><br>This is the narrative thread that ties your entire professional identity together.",badge:"Purpose",target:null,beforeShow:function(){switchBlueprintTab("purpose")},delay:300},{title:isReadOnlyProfile?"Ready to Build Your Own?":"Your Career Intelligence Starts Here",desc:isReadOnlyProfile?"You’ve seen what Blueprint can do with "+e+". Imagine this with <strong>your</strong> skills, <strong>your</strong> outcomes, <strong>your</strong> market value.<br><br>Hit the <strong>?</strong> button anytime for help. Explore all 24 sample profiles. Then join the waitlist to build yours.":"That’s Blueprint. Six lenses on one career. Hit the <strong>?</strong> button anytime for section-specific guides.<br><br>Your data stays yours — export it, own it, take it anywhere.",badge:isReadOnlyProfile?"Get Started":"Let’s Go",target:"#tourHelpBtn",spotlightPad:6,spotlightRadius:"50%",beforeShow:function(){viewSampleProfile()}}]}function yi(){var e=(skillsData.skills||[]).length;return[{title:"Your Skills, Fully Mapped",desc:"Built on <strong>ESCO</strong> and <strong>O*NET</strong> taxonomies. Each node is a skill — <strong>size</strong> = proficiency, <strong>color</strong> = role cluster."+(e>0?" This profile: <strong>"+e+"</strong> mapped.":""),badge:"Map",target:"#controlsBar",spotlightPad:6,beforeShow:function(){switchView("skills")},delay:600},{title:"Evidence, Not Buzzwords",desc:"Tap any node for proficiency level, evidence from your career, and role assignment. This is proof of capability. Drag to rearrange.",badge:"Map",target:null},{title:"Network vs. Card View",desc:"<strong>Network</strong> reveals relationships and clusters. <strong>Card</strong> gives you a sortable list with proficiency badges.",badge:"Map",target:"#skillsViewToggle",spotlightPad:4},{title:"Overlay Modes: The X-Ray",desc:"Select a job from the Pipeline and four overlay modes appear: <strong>You</strong> · <strong>Job</strong> · <strong>Match</strong> · <strong>Values</strong> — see exactly how you stack up against any role.",badge:"Map",target:"#matchModeToggle",spotlightPad:6}]}function bi(){var e=(window._userData.savedJobs||[]).length;return[{title:"Intelligent Job Matching",desc:"Every job scored against your actual skill portfolio — not keywords. Match percentage, BLS salary estimate, and full gap analysis."+(e>0?" Tracking <strong>"+e+" jobs</strong>.":""),badge:"Jobs",target:null,beforeShow:function(){switchView("jobs")},delay:500},{title:"Skills Breakdown Per Job",desc:"Tap any job to see <strong>matched skills</strong> (green), <strong>gaps</strong> (red), and <strong>surplus skills</strong> that give you negotiation leverage. This is the analysis recruiters do manually — Blueprint does it instantly.",badge:"Jobs",target:null},{title:"Pipeline · Tracker · Find Jobs",desc:"<strong>Pipeline</strong> for saved opportunities with match intelligence · <strong>Tracker</strong> for application status and notes · <strong>Find Jobs</strong> to add new targets.",badge:"Jobs",target:null}]}function hi(){return[{title:"The Career Intelligence Dashboard",desc:"Market value, skill distribution, readiness score, purpose statement — the executive summary of your professional profile.",badge:"Blueprint",target:null,beforeShow:function(){switchView("blueprint"),switchBlueprintTab("dashboard")},delay:500},{title:"Six Lenses on Your Career",desc:"<strong>Dashboard</strong> · <strong>Skills</strong> · <strong>Experience</strong> · <strong>Outcomes</strong> · <strong>Values</strong> · <strong>Export</strong> — every dimension of your professional identity, quantified.",badge:"Blueprint",target:"#blueprintSubnav",spotlightPad:4},{title:"Intelligence Reports",desc:isReadOnlyProfile?"<strong>Scouting Reports</strong> — generate a PDF right now to see targeted job analysis. With your own Blueprint, unlock <strong>Negotiation Guides</strong>, <strong>Executive Blueprints</strong>, shareable HTML reports, and more.":"<strong>Scouting Reports</strong> — targeted job intelligence briefs. <strong>Negotiation Guides</strong> — salary strategy backed by BLS data. <strong>Executive Blueprints</strong> — shareable career profiles. All generated in seconds.",badge:"Blueprint",target:"#blueprintSubnav",spotlightPad:4,beforeShow:function(){switchBlueprintTab("export")},delay:400},{title:"Values Alignment",desc:"Your core professional values mapped against company culture profiles. See alignment scores before you interview — the right job is about fit, not just skills.",badge:"Blueprint",target:"#blueprintSubnav",spotlightPad:4,beforeShow:function(){switchBlueprintTab("values")},delay:400}]}function ki(){return[{title:"Famous Characters. Real Blueprints.",desc:"<strong>24 iconic TV characters</strong> from Breaking Bad, Stranger Things, Succession, and Game of Thrones — each with a complete career Blueprint. Skills, values, job matches, market values. Tyrion Lannister: $4.2M. Tywin Lannister: $125M.",badge:"Samples",target:null,beforeShow:function(){viewSampleProfile()},delay:600},{title:"Four Shows. Six Characters Each.",desc:'Tap the show tabs to browse collections. <strong style="color:#22c55e;">Breaking Bad</strong> — chemists to cartel bosses. <strong style="color:#ef4444;">Stranger Things</strong> — small-town heroes. <strong style="color:#b5cc4b;">Succession</strong> — corporate royalty. <strong style="color:#B8860B;">Game of Thrones</strong> — architects of power.',badge:"Samples",target:null},{title:"Load a Profile. See Everything.",desc:"Tap <strong>View</strong> on any character to load their complete Blueprint — skills network, job matches, compensation, values, the works. Then imagine what yours looks like.",badge:"Samples",target:null}]}window._bpTour={startWelcome:function(){De("welcome",wi())},startMini:function(e){var t={skills:yi,jobs:bi,blueprint:hi,samples:ki},i=t[e];i&&De(e,i())},next:We,prev:qe,end:Z,isActive:function(){return P}};function xi(){}function Te(){mi(),setTimeout(xi,2500)}document.readyState==="complete"?setTimeout(Te,1e3):window.addEventListener("load",function(){setTimeout(Te,1e3)});window.startTour=De;window.endTour=Z;window.createOverlayElements=ui;window.showStep=Le;window.renderStep=fi;window.positionStep=le;window.positionTooltip=ne;window.goNext=We;window.goPrev=qe;window.createHelpButton=mi;window.toggleHelpMenu=gi;window.closeHelpMenu=vi;window.getWelcomeSteps=wi;window.getSkillsTour=yi;window.getJobsTour=bi;window.getBlueprintTour=hi;window.getSamplesTour=ki;window.maybeAutoTour=xi;window.initTourSystem=Te;console.log("%c   BLUEPRINT™ MODULE BUILD   ","color:#60a5fa;font-weight:bold;font-size:14px;");console.log("%c   "+Ei+" — Phase 7c  ","color:#a78bfa;font-weight:bold;font-size:12px;");console.log("%c   Phase 8 live  ","color:#10b981;font-size:11px;");
//# sourceMappingURL=bp.main.BwsF0zsE.js.map
