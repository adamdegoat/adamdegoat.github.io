/* PropSight shared navigation — one consistent header on every sub-page.
   Drop <script src="/adam/nav.js" defer></script> on any page; it replaces that
   page's own <header> with the standard PropSight nav (absolute links, active
   state, mobile menu). The homepage keeps its own hero-integrated nav. */
(function () {
  var BASE = location.origin; // same-origin absolute links work from any page depth
  var LINKS = [
    ['Tools', BASE + '/adam/#tools', ''],
    ['Research', BASE + '/thesis/', 'feat'],
    ['New Launches', BASE + '/adam/launches/', ''],
    ['Market Pulse', BASE + '/adam/notes/', ''],
    ['News', BASE + '/adam/news/', 'smart'],
    ['Guide', BASE + '/adam/essentials/', ''],
    ['About us', BASE + '/adam/about/', ''],
    ['Contact', BASE + '/adam/#talk', '']
  ];
  var p = location.pathname;
  function active(href) {
    if (/\/thesis\//.test(p)) return /\/thesis\//.test(href);
    if (/\/launches\//.test(p)) return /\/launches\//.test(href);
    if (/\/listings\//.test(p)) return /\/listings\//.test(href);
    if (/\/notes\//.test(p)) return /\/notes\//.test(href);
    if (/\/news\//.test(p)) return /\/news\//.test(href);
    if (/\/about\//.test(p)) return /\/about\//.test(href);
    if (/\/essentials\//.test(p)) return /\/essentials\//.test(href);
    if (/\/tools\//.test(p)) return /#tools$/.test(href);
    return false;
  }
  var LISTINGS = BASE + '/adam/listings/';
  var ARROW = '<svg class="pd-ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  var MARK = '<svg class="pm" viewBox="0 0 64 64" aria-hidden="true">' +
    '<path d="M9 35 L32 13 L55 35" fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M16 49 L48 49" stroke="currentColor" stroke-width="4.2" stroke-linecap="round"/>' +
    '<circle cx="32" cy="39" r="3.4" fill="#b08d57"/></svg>';

  var css = '' +
    '.psnav{position:sticky;top:0;z-index:300;background:rgba(247,244,236,.97);border-bottom:1px solid #e7e0d2;font-family:"Schibsted Grotesk",system-ui,sans-serif;padding-top:env(safe-area-inset-top)}' +
    '.psnav-in{max-width:1240px;margin:0 auto;padding:0 32px;height:76px;display:flex;align-items:center;gap:16px}' +
    '.psnav-brand{display:flex;align-items:center;gap:11px;text-decoration:none}.psnav-brand .pm{width:38px;height:38px;flex:none;color:#1b3a2d}' +
    '.psnav-brand .bw{display:flex;flex-direction:column;line-height:1}.psnav-brand .bw span{font-size:9px;letter-spacing:.32em;text-transform:uppercase;color:#8a8175;font-weight:700;margin-top:4px}' +
    '.psnav-brand b{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:22px;color:#191512;letter-spacing:.01em}' +
    '.psnav-links{display:flex;gap:17px;margin-left:auto;align-items:center}' +
    '.psnav-links a{font-size:13.5px;font-weight:600;color:#5a5248;text-decoration:none;white-space:nowrap;transition:color .2s}' +
    '.psnav-links a:hover{color:#191512}.psnav-links a.cur{color:#1b3a2d}' +
    '.psnav-links a.feat,.psnav-links a.smart,.psnav-links a.soon{position:relative}.psnav-links a.feat::before,.psnav-links a.smart::before,.psnav-links a.soon::before{position:absolute;left:50%;bottom:calc(100% - 2px);transform:translateX(-50%);display:flex;align-items:center;justify-content:center;height:15px;padding:0 9px;font:800 8px/1 "Schibsted Grotesk",system-ui,sans-serif;letter-spacing:.07em;text-transform:uppercase;color:#241a0d;background:linear-gradient(135deg,#e3c98f,#b08d57);border-radius:20px;white-space:nowrap;box-shadow:0 2px 6px rgba(176,141,87,.3)}.psnav-links a.feat::before{content:"Featured"}.psnav-links a.smart::before{content:"Smart"}.psnav-links a.soon::before{content:"Soon";background:linear-gradient(135deg,#2f5a46,#1b3a2d);color:#eadfc8;box-shadow:0 2px 6px rgba(27,58,45,.32)}' +
    '.psnav-links a.cta{background:#1b3a2d;color:#f5f1e8;padding:9px 18px;border-radius:30px;font-weight:700}' +
    '.psnav-signin{margin-left:14px;background:none;border:0;font-family:inherit;font-size:13.5px;font-weight:600;color:#5a5248;cursor:pointer;padding:8px 2px;white-space:nowrap;transition:color .2s}.psnav-signin:hover{color:#191512}' +
    '.psnav-join{margin-left:12px;flex:none;background:linear-gradient(135deg,#e3c98f,#b08d57);color:#241a0d;font-weight:800;font-size:13.5px;font-family:inherit;border:1px solid #b08d57;border-radius:40px;padding:10px 17px;cursor:pointer;white-space:nowrap;box-shadow:0 8px 22px rgba(176,141,87,.34);transition:transform .2s,box-shadow .2s}' +
    '.psnav-join:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(176,141,87,.44)}' +
    /* the "doorway" into the Listing Platform — set apart from the menu, reads as a separate place */
    '.psnav-door{display:flex;flex-direction:column;gap:2px;text-decoration:none;margin-left:20px;padding:8px 15px;border:1px solid #cdd9d0;border-radius:13px;background:linear-gradient(180deg,#fff,#f1f5f1);position:relative;transition:transform .2s,border-color .2s,box-shadow .2s}' +
    '.psnav-door::before{content:"";position:absolute;left:-20px;top:50%;transform:translateY(-50%);width:1px;height:30px;background:#e2dac9}' +
    '.psnav-door:hover{transform:translateY(-1px);border-color:#27513f;box-shadow:0 9px 22px rgba(39,81,63,.15)}' +
    '.psnav-door .pd-top{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;color:#1b3a2d;line-height:1.05;white-space:nowrap}' +
    '.psnav-door .pd-ar{width:12px;height:12px;flex:none}' +
    '.psnav-door .pd-sub{display:flex;align-items:center;gap:5px;font-size:8.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#8a8175;line-height:1}' +
    '.psnav-door .pd-dot{width:6px;height:6px;border-radius:50%;background:#3aa76d;box-shadow:0 0 0 0 rgba(58,167,109,.5);animation:pddot 2.2s ease-out infinite}' +
    '@keyframes pddot{0%{box-shadow:0 0 0 0 rgba(58,167,109,.5)}70%{box-shadow:0 0 0 7px rgba(58,167,109,0)}100%{box-shadow:0 0 0 0 rgba(58,167,109,0)}}' +
    '@media(prefers-reduced-motion:reduce){.psnav-door .pd-dot{animation:none}}' +
    '.psnav-door.cur{border-color:#27513f;background:linear-gradient(180deg,#27513f,#1b3a2d)}' +
    '.psnav-door.cur .pd-top{color:#f3efe6}.psnav-door.cur .pd-sub{color:rgba(243,239,230,.82)}' +
    '@media(max-width:860px){.psnav-signin{display:none}.psnav-join{margin-left:auto;margin-right:10px;font-size:13px;padding:9px 15px}}' +
    '.psnav-burger{display:none;margin-left:auto;width:42px;height:42px;border:1px solid #dbd1bf;border-radius:10px;background:rgba(255,255,255,.6);cursor:pointer;align-items:center;justify-content:center}' +
    '.psnav-burger svg{width:22px;height:22px;stroke:#191512;fill:none;stroke-width:2;stroke-linecap:round}' +
    '.psnav-menu{position:fixed;left:0;right:0;top:calc(76px + env(safe-area-inset-top));bottom:0;z-index:299;background:#f6f3ea;padding:14px 24px 30px;display:none;flex-direction:column;overflow-y:auto}' +
    '.psnav-menu.open{display:flex}' +
    '.psnav-menu a{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:23px;color:#191512;text-decoration:none;padding:16px 2px;border-bottom:1px solid #e7e0d2}' +
    '.psnav-menu a .psm-pill{display:inline-block;vertical-align:middle;position:relative;top:-3px;margin-left:9px;font-family:"Schibsted Grotesk",system-ui,sans-serif;font-weight:800;font-size:9px;letter-spacing:.07em;text-transform:uppercase;color:#241a0d;background:linear-gradient(135deg,#e3c98f,#b08d57);border-radius:20px;padding:3px 8px;box-shadow:0 2px 6px rgba(176,141,87,.3)}' +
    '.psnav-menu a .psm-soon{background:linear-gradient(135deg,#2f5a46,#1b3a2d);color:#eadfc8;box-shadow:0 2px 6px rgba(27,58,45,.3)}' +
    '.psnav-mjoin{width:100%;background:linear-gradient(135deg,#e3c98f,#b08d57);color:#241a0d;font-family:"Schibsted Grotesk",system-ui,sans-serif;font-weight:800;font-size:16px;border:0;border-radius:14px;padding:15px;margin-bottom:8px;cursor:pointer;box-shadow:0 10px 26px rgba(176,141,87,.34)}' +
    '.psnav-msignin{width:100%;background:none;border:0;font-family:"Schibsted Grotesk",system-ui,sans-serif;font-size:14px;font-weight:600;color:#27513f;padding:6px;margin-bottom:8px;cursor:pointer}' +
    /* mobile menu: the door becomes a distinct card pinned at the very end */
    '.psnav-menu a.psm-door{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px;padding:18px 18px;border:1px solid #cdd9d0;border-bottom:1px solid #cdd9d0;border-radius:15px;background:linear-gradient(180deg,#fff,#eef4ef)}' +
    '.psnav-menu a.psm-door .psm-door-t{display:block;font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:21px;color:#1b3a2d;line-height:1.1}' +
    '.psnav-menu a.psm-door .psm-door-d{display:block;font-family:"Schibsted Grotesk",system-ui,sans-serif;font-size:13px;color:#6b6357;margin-top:4px}' +
    '.psnav-menu a.psm-door .psm-arr{flex:none;width:34px;height:34px;border-radius:50%;background:#27513f;display:flex;align-items:center;justify-content:center}' +
    '.psnav-menu a.psm-door .psm-arr svg{width:15px;height:15px;stroke:#f3efe6}' +
    '@media(max-width:1100px){.psnav-links{display:none}.psnav-door{display:none}.psnav-burger{display:flex}}@media(max-width:560px){.psnav-in{padding:0 20px}.psnav-brand b{font-size:20px}.psnav-brand .pm{width:34px;height:34px}}';

  function linkHtml(l, mobile) {
    var cls = [];
    if (l[2] === 'feat' && !mobile) cls.push('feat');
    if (l[2] === 'smart' && !mobile) cls.push('smart');
    if (l[2] === 'soon' && !mobile) cls.push('soon');
    if (l[2] === 'cta' && !mobile) cls.push('cta');
    if (active(l[1])) cls.push('cur');
    var label = l[0];
    if (mobile && l[2] === 'feat') label += ' <span class="psm-pill">Featured</span>';
    if (mobile && l[2] === 'smart') label += ' <span class="psm-pill">Smart</span>';
    if (mobile && l[2] === 'soon') label += ' <span class="psm-pill psm-soon">Soon</span>';
    return '<a href="' + l[1] + '"' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' + label + '</a>';
  }
  var navHTML = '<header class="psnav"><div class="psnav-in">' +
    '<a class="psnav-brand" href="' + BASE + '/adam/">' + MARK + '<span class="bw"><b>PropSight</b><span>Singapore</span></span></a>' +
    '<nav class="psnav-links">' + LINKS.map(function (l) { return linkHtml(l, false); }).join('') + '</nav>' +
    '<a class="psnav-door' + (active(LISTINGS) ? ' cur' : '') + '" href="' + LISTINGS + '">' +
      '<span class="pd-top">Listing Platform' + ARROW + '</span>' +
      '<span class="pd-sub"><span class="pd-dot"></span>Coming soon</span>' +
    '</a>' +
    '<button class="psnav-signin ps-signin-cta" type="button" onclick="window.PS&&PS.login(\'nav\')">Sign in</button>' +
    '<button class="psnav-join ps-join-cta" type="button" onclick="window.PS&&PS.cta(\'nav\')">Join free</button>' +
    '<button class="psnav-burger" id="psBurger" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>' +
    '</div></header>';
  var menuHTML = '<div class="psnav-menu" id="psMenu">' +
    '<button class="psnav-mjoin ps-join-cta" type="button" onclick="window.PS&&PS.cta(\'menu\')">Join free →</button>' +
    '<button class="psnav-msignin ps-signin-cta" type="button" onclick="window.PS&&PS.login(\'menu\')">Already a member? Sign in</button>' +
    LINKS.map(function (l) { return linkHtml(l, true); }).join('') +
    '<a class="psm-door' + (active(LISTINGS) ? ' cur' : '') + '" href="' + LISTINGS + '">' +
      '<span><span class="psm-door-t">Listing Platform</span><span class="psm-door-d">Coming soon — step into the platform</span></span>' +
      '<span class="psm-arr">' + ARROW + '</span>' +
    '</a>' + '</div>';

  function init() {
    // the Join button opens the shared signup modal — make sure member.js is present
    if (!window.PS && !document.querySelector('script[src*="member.js"]')) {
      var ms = document.createElement('script'); ms.src = BASE + '/adam/member.js'; document.head.appendChild(ms);
    }
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var holder = document.createElement('div'); holder.innerHTML = navHTML + menuHTML;
    var nav = holder.firstChild, menu = holder.lastChild;
    var old = document.querySelector('header');
    if (old) old.parentNode.replaceChild(nav, old);
    else document.body.insertBefore(nav, document.body.firstChild);
    document.body.appendChild(menu);
    var b = document.getElementById('psBurger');
    b.addEventListener('click', function () { menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); });
    if (window.PS && PS.applyAuthUI) PS.applyAuthUI();   // relabel Join→name if already signed in
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
