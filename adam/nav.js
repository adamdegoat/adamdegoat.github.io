/* PropSight shared navigation, one consistent header on every sub-page.
   Drop <script src="/adam/nav.js" defer></script> on any page; it replaces that
   page's own <header> with the standard PropSight nav (absolute links, active
   state, mobile menu). The homepage keeps its own hero-integrated nav. */
(function () {
  var BASE = location.origin; // same-origin absolute links work from any page depth
  var LINKS = [
    ['Tools', BASE + '/adam/#tools', ''],
    ['Research', BASE + '/thesis/', 'feat'],
    ['New Launches', BASE + '/adam/launches/', ''],
    ['Market Analysis', BASE + '/adam/market-analysis/', ''],
    ['News', BASE + '/adam/news/', 'smart'],
    ['Guide', BASE + '/adam/essentials/', ''],
    ['About us', BASE + '/adam/about/', ''],
    ['Contact', BASE + '/adam/#talk', '']
  ];

  /* Language: delegate to the shared engine in i18n.js (English-default).
     If a sub-page included nav.js but not i18n.js, lazy-load it so the toggle still works. */
  if (!window.PSI18N && !document.querySelector('script[src*="i18n.js"]')) {
    var _i18 = document.createElement('script'); _i18.src = BASE + '/adam/i18n.js'; document.head.appendChild(_i18);
  }
  function t(s) { return (window.PSI18N && window.PSI18N.t) ? window.PSI18N.t(s) : s; }
  function curLang() { return (window.PSI18N && window.PSI18N.lang) || 'en'; }
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
  var LISTINGS = 'https://listings.propsight.sg';
  var PROPWORLD = LISTINGS + '/propworld.html';
  var ARROW ='<svg class="pd-ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  var MARK = '<svg class="pm" viewBox="0 0 64 64" aria-hidden="true">' +
    '<circle cx="27" cy="27" r="19" fill="none" stroke="currentColor" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M17.5 32.5 L27 21.5 L36.5 32.5" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M20.5 37 L33.5 37" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="27" cy="33.4" r="2" fill="#15a0a0"/>' +
    '<path d="M40.5 40.5 L53.5 53.5" fill="none" stroke="#15a0a0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var css = '' +
    /* ── site-wide de-AI refresh: Fraunces -> Schibsted, kill the hand-drawn swash ── */
    ':root{--serif:"Schibsted Grotesk",system-ui,sans-serif}' +
    '.hl,.hl-i,.uline{display:none!important}' +
    'em,.serif em,h1 em,h2 em,h3 em{font-style:normal!important}' +
    /* flatten the decorative stock-photo header bands -> clean brand green (no photo) */
    '.newshero,.nh-bg,.mast-bg,.ghero-bg,.ph-bg{background:linear-gradient(120deg,#123b2a,#0d2418)!important}' +
    ":root{--gtex:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='gn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0 0.02 0 0 0 0.22 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23gn)'/%3E%3C/svg%3E\")}" +
    '.psnav{position:sticky;top:0;z-index:300;background:rgba(236,247,245,.97);border-bottom:1px solid #d2e7e3;font-family:"Schibsted Grotesk",system-ui,sans-serif;padding-top:env(safe-area-inset-top)}' +
    '.psnav-in{box-sizing:border-box;max-width:1280px;margin:0 auto;padding:0 32px;height:76px;display:flex;align-items:center;gap:12px}@media(min-width:1201px){.psnav-in{height:84px}}' +
    '.psnav-brand{display:flex;align-items:center;gap:11px;text-decoration:none}.psnav-brand .pm{width:38px;height:38px;flex:none;color:#1b3a2d}' +
    '.psnav-brand .bw{display:flex;flex-direction:row;align-items:baseline;gap:6px;line-height:1}.psnav-brand .bw span{font-size:20px;font-weight:800;letter-spacing:-.012em;text-transform:none;color:#0f7a82;margin:0}' +
    '.psnav-brand b{font-family:"Schibsted Grotesk",system-ui,sans-serif;font-weight:800;font-size:20px;color:#191512;letter-spacing:-.012em}' +
    '.psnav-links{display:flex;gap:19px;margin:0 auto;align-items:center}' +
    '.psnav-links a{font-size:13.5px;font-weight:600;color:#485a56;text-decoration:none;white-space:nowrap;transition:color .2s}' +
    '.psnav-links a:hover{color:#191512}.psnav-links a.cur{color:#1b3a2d}' +
    '.psnav-links a.feat,.psnav-links a.smart,.psnav-links a.soon{position:relative}.psnav-links a.feat::before,.psnav-links a.smart::before,.psnav-links a.soon::before{position:absolute;left:50%;bottom:calc(100% - 1px);transform:translateX(-50%);display:flex;align-items:center;justify-content:center;height:14px;padding:0 8px;font:800 8px/1 "Schibsted Grotesk",system-ui,sans-serif;letter-spacing:.07em;text-transform:uppercase;color:#eef6f1;background:var(--gtex,none),#1b3a2d;border-radius:20px;white-space:nowrap;box-shadow:0 2px 6px rgba(15,35,26,.3)}.psnav-links a.feat::before{content:"Featured"}.psnav-links a.smart::before{content:"Smart"}.psnav-links a.soon::before{content:"Soon";background:linear-gradient(135deg,#2f5a46,#1b3a2d);color:#c8eae3;box-shadow:0 2px 6px rgba(27,58,45,.32)}' +
    '.psnav-links a.cta{background:#1b3a2d;color:#e8f5f2;padding:9px 18px;border-radius:30px;font-weight:700}' +
    '.psnav-signin{margin-left:4px;background:none;border:0;font-family:inherit;font-size:13.5px;font-weight:600;color:#485a56;cursor:pointer;padding:8px 2px;white-space:nowrap;transition:color .2s}.psnav-signin:hover{color:#191512}' +
    '.psnav-join{margin-left:0;flex:none;background:var(--gtex,none),#1b3a2d;color:#eef6f1;font-weight:800;font-size:13.5px;font-family:inherit;border:1px solid #15a0a0;border-radius:40px;padding:9px 16px;cursor:pointer;white-space:nowrap;box-shadow:0 8px 22px rgba(15,35,26,.34);transition:transform .2s,box-shadow .2s}' +
    '.psnav-join:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(15,35,26,.44)}' +
    /* the "doorway" into the Listing Platform, set apart from the menu, reads as a separate place */
    '.psnav-door{display:flex;align-items:stretch;text-decoration:none;margin-left:6px;border:1px solid #cdd9d0;border-radius:12px;background:linear-gradient(180deg,#fff,#f1f5f1);position:relative;flex:none;overflow:hidden;transition:transform .2s,border-color .2s,box-shadow .2s}' +
    '.psnav-door::before{content:"";position:absolute;left:-9px;top:50%;transform:translateY(-50%);width:1px;height:28px;background:#c9e2dd}' +
    '.psnav-door:hover{transform:translateY(-1px);border-color:#27513f;box-shadow:0 9px 22px rgba(39,81,63,.15)}' +
    '.psnav-door .pd-half{display:flex;flex-direction:column;gap:2px;text-decoration:none;padding:5px 9px;transition:background .2s}' +
    '.psnav-door .pd-half+.pd-half{border-left:1px solid #d7e2db}' +
    '.psnav-door .pd-half:hover{background:rgba(39,81,63,.06)}' +
    '.psnav-door .pd-half.pd-world{background:linear-gradient(180deg,#f1fbfa,#e3f5f1)}' +
    '.psnav-door .pd-half.pd-world .pd-top{color:#0f7a82}.psnav-door .pd-half.pd-world .pd-ar{color:#15a0a0}' +
    '.psnav-door .pd-half.pd-world:hover{background:rgba(21,160,160,.1)}' +
    '.psnav-door .pd-top{display:flex;align-items:center;gap:5px;font-size:11.5px;font-weight:700;color:#1b3a2d;line-height:1.05;white-space:nowrap}' +
    '.psnav-door .pd-ar{width:11px;height:11px;flex:none}' +
    '.psnav-door .pd-sub{display:flex;align-items:center;gap:4px;font-size:7.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#758a86;line-height:1}' +
    '.psnav-door .pd-dot{width:6px;height:6px;border-radius:50%;background:#3aa76d;box-shadow:0 0 0 0 rgba(58,167,109,.5);animation:pddot 2.2s ease-out infinite}' +
    '@keyframes pddot{0%{box-shadow:0 0 0 0 rgba(58,167,109,.5)}70%{box-shadow:0 0 0 7px rgba(58,167,109,0)}100%{box-shadow:0 0 0 0 rgba(58,167,109,0)}}' +
    '@media(prefers-reduced-motion:reduce){.psnav-door .pd-dot{animation:none}}' +
    '.psnav-door .pd-half.cur{background:linear-gradient(180deg,#27513f,#1b3a2d)}' +
    '.psnav-door .pd-half.cur .pd-top{color:#e6f3f0}.psnav-door .pd-half.cur .pd-sub{color:rgba(230,243,240,.82)}' +
    '@media(max-width:860px){.psnav-signin{display:inline-block;margin-left:auto}.psnav-join{margin-left:9px;margin-right:10px;font-size:13px;padding:9px 15px}}' +
    '.psnav-back{display:none;margin-right:2px;width:40px;height:40px;flex:none;align-items:center;justify-content:center;border:1px solid #bfdbd5;border-radius:11px;background:rgba(255,255,255,.6);cursor:pointer;color:#1b3a2d;-webkit-tap-highlight-color:transparent;transition:background .2s}' +
    '.psnav-back svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}' +
    '.psnav-back:active{background:#dbefeb}' +
    '@media(max-width:860px){.psnav-back{display:inline-flex}}' +
    '@media all and (display-mode:standalone){.psnav-back{display:inline-flex}}' +
    '.psnav-burger{display:none;margin-left:auto;width:42px;height:42px;border:1px solid #bfdbd5;border-radius:10px;background:rgba(255,255,255,.6);cursor:pointer;align-items:center;justify-content:center}' +
    '.psnav-burger svg{width:22px;height:22px;stroke:#191512;fill:none;stroke-width:2;stroke-linecap:round}' +
    '.psnav-menu{position:fixed;left:0;right:0;top:calc(76px + env(safe-area-inset-top));bottom:0;z-index:299;background:#eaf6f4;padding:14px 24px 30px;display:none;flex-direction:column;overflow-y:auto}' +
    '.psnav-menu.open{display:flex}' +
    '.psnav-menu a:not(.psm-door){display:flex;align-items:center;gap:10px;font-family:"Schibsted Grotesk",system-ui,sans-serif;font-weight:600;font-size:14px;letter-spacing:.15em;text-transform:uppercase;color:#1c2322;text-decoration:none;padding:12.5px 2px}' +
    '.psnav-menu a:not(.psm-door):active .psm-t,.psnav-menu a:not(.psm-door):active{color:#0d6f78}' +
    '.psnav-menu a .psm-pill{display:inline-block;vertical-align:middle;margin-left:8px;font-family:"Schibsted Grotesk",system-ui,sans-serif;font-weight:800;font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:#eef6f1;background:var(--gtex,none),#1b3a2d;border-radius:20px;padding:3px 7px}' +
    '.psnav-menu a .psm-soon{background:linear-gradient(135deg,#2f5a46,#1b3a2d);color:#c8eae3;box-shadow:0 2px 6px rgba(27,58,45,.3)}' +
    '.psnav-mjoin{width:100%;background:var(--gtex,none),#1b3a2d;color:#eef6f1;font-family:"Schibsted Grotesk",system-ui,sans-serif;font-weight:800;font-size:16px;border:0;border-radius:14px;padding:15px;margin-bottom:8px;cursor:pointer;box-shadow:0 10px 26px rgba(15,35,26,.34)}' +
    '.psnav-msignin{width:100%;background:none;border:0;font-family:"Schibsted Grotesk",system-ui,sans-serif;font-size:14px;font-weight:600;color:#27513f;padding:6px;margin-bottom:8px;cursor:pointer}' +
    /* mobile menu: the door becomes a distinct card pinned at the very end */
    '.psnav-menu a.psm-door{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px;padding:18px 18px;border:1px solid #cdd9d0;border-bottom:1px solid #cdd9d0;border-radius:15px;background:linear-gradient(180deg,#fff,#eef4ef)}' +
    '.psnav-menu a.psm-door+a.psm-door{margin-top:11px}' +
    '.psnav-menu a.psm-door.psm-world{background:linear-gradient(180deg,#f1fbfa,#e3f5f1);border-color:#bfe6e0}' +
    '.psnav-menu a.psm-door.psm-world .psm-door-t{color:#0f7a82}.psnav-menu a.psm-door.psm-world .psm-arr{background:#15a0a0}' +
    '.psnav-menu a.psm-door .psm-door-t{display:block;font-family:"Schibsted Grotesk",system-ui,sans-serif;font-weight:600;font-size:21px;color:#1b3a2d;line-height:1.1}' +
    '.psnav-menu a.psm-door .psm-door-d{display:block;font-family:"Schibsted Grotesk",system-ui,sans-serif;font-size:13px;color:#576b67;margin-top:4px}' +
    '.psnav-menu a.psm-door .psm-arr{flex:none;width:34px;height:34px;border-radius:50%;background:#27513f;display:flex;align-items:center;justify-content:center}' +
    '.psnav-menu a.psm-door .psm-arr svg{width:15px;height:15px;stroke:#e6f3f0}' +
    '@media(max-width:1360px){.psnav-links{display:none}.psnav-door{display:none}.psnav-burger{display:flex}}@media(max-width:560px){.psnav-in{padding:0 13px;gap:8px}.psnav-brand b{font-size:18px}.psnav-brand .bw span{display:none}.psnav-brand .pm{width:31px;height:31px}.psnav-back{width:34px;height:34px}.psnav-signin{font-size:12.5px}.psnav-join{font-size:12.5px;padding:8px 12px}}@media(max-width:400px){.psnav-in{padding:0 10px;gap:6px}.psnav-brand b,.psnav-brand .bw span{font-size:16px}.psnav-brand .pm{width:27px;height:27px}.psnav-back{width:30px;height:30px}.psnav-signin{font-size:11.5px}.psnav-join{font-size:11.5px;padding:8px 10px}}' +
    /* shared site footer, legal links + the global "information only" disclaimer */
    '.psftr{background:linear-gradient(180deg,#0f231a,#0a1712);color:#cfe4dc;padding:60px 0 0;font-family:"Schibsted Grotesk",system-ui,sans-serif}' +
    '.psf-in{max-width:1120px;margin:0 auto;padding:0 32px}' +
    '.psf-cols{display:grid;grid-template-columns:1.7fr 1fr 1fr 1fr;gap:44px;padding-bottom:44px}' +
    '.psf-logo{display:flex;align-items:center;gap:11px}' +
    '.psf-mark{width:42px;height:42px;flex:none;color:#cfe4dc}' +
    '.psf-bw{display:flex;flex-direction:row;align-items:baseline;gap:7px;line-height:1}' +
    '.psf-bw b{font-family:"Schibsted Grotesk",system-ui,sans-serif;font-weight:800;font-size:23px;color:#fff;letter-spacing:-.012em}' +
    '.psf-bw span{font-size:23px;font-weight:800;letter-spacing:-.012em;text-transform:none;color:#7fd0bb;margin:0}' +
    '.psf-tag{margin:16px 0 20px;font-size:14.5px;line-height:1.6;color:rgba(207,228,220,.72);max-width:310px}' +
    '.psf-soc{display:flex;align-items:center;gap:11px;margin-bottom:16px}' +
    '.psf-ico{width:40px;height:40px;border:1px solid rgba(255,255,255,.15);border-radius:11px;display:inline-flex;align-items:center;justify-content:center;color:rgba(207,228,220,.82);transition:.2s}' +
    '.psf-ico svg{width:20px;height:20px}.psf-ico:hover{color:#84e6d4;border-color:rgba(132,230,212,.45)}' +
    '.psf-inst{display:inline-flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600;color:rgba(207,228,220,.82);text-decoration:none}' +
    '.psf-inst svg{width:18px;height:18px}.psf-inst:hover{color:#84e6d4}' +
    '.psf-col h4{font-size:14px;color:#d8b15e;margin-bottom:15px;font-weight:700}' +
    '.psf-col a{display:block;font-size:14px;color:rgba(207,228,220,.82);text-decoration:none;padding:6px 0;transition:color .2s}.psf-col a:hover{color:#fff}' +
    '.psf-bar{border-top:1px solid rgba(255,255,255,.1);padding:22px 0 calc(38px + env(safe-area-inset-bottom));display:flex;align-items:center;gap:16px;flex-wrap:wrap}' +
    '.psf-cr{font-size:13px;font-weight:700;color:#fff}' +
    '.psf-disc{font-size:12.5px;color:rgba(207,228,220,.55);flex:1;min-width:240px;line-height:1.5}' +
    '.psf-lang{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#cfe4dc;font-size:13px;font-weight:600;padding:8px 16px;border-radius:9px;cursor:pointer;font-family:inherit}.psf-lang:hover{background:rgba(255,255,255,.14)}' +
    '@media(max-width:820px){.psf-cols{grid-template-columns:1fr 1fr;gap:36px 24px}.psf-brand{grid-column:1/-1}}' +
    '@media(max-width:520px){.psftr{padding-top:44px}.psf-in{padding:0 20px}}' +
    /* language toggle (desktop pill + mobile menu button) */
    '.psnav-lang{display:inline-flex;align-items:center;gap:6px;margin-left:8px;flex:none;background:#eaf6f4;border:1.5px solid #27513f;border-radius:30px;font-family:inherit;font-size:13px;font-weight:800;color:#1b3a2d;cursor:pointer;padding:8px 14px;white-space:nowrap;transition:background .2s,color .2s,transform .2s}' +
    '.psnav-lang svg{width:15px;height:15px;flex:none;stroke:currentColor;fill:none;stroke-width:1.7}' +
    '.psnav-lang:hover{background:#1b3a2d;color:#eaf6f4;transform:translateY(-1px)}' +
    '@media(max-width:1360px){.psnav-lang{display:none}}' +
    '.psnav-mlang{width:100%;background:#dff0ec;border:1px solid #bfdbd5;border-radius:14px;font-family:"Schibsted Grotesk",system-ui,sans-serif;font-weight:800;font-size:15px;color:#1b3a2d;padding:13px;margin-bottom:14px;cursor:pointer}' +
    /* Chinese versions of the CSS-rendered nav badges */
    'html.lang-zh .psnav-links a.feat::before{content:"精选"}html.lang-zh .psnav-links a.smart::before{content:"智能"}html.lang-zh .psnav-links a.soon::before{content:"即将"}';

  function linkHtml(l, mobile) {
    var cls = [];
    if (l[2] === 'feat' && !mobile) cls.push('feat');
    if (l[2] === 'smart' && !mobile) cls.push('smart');
    if (l[2] === 'soon' && !mobile) cls.push('soon');
    if (l[2] === 'cta' && !mobile) cls.push('cta');
    if (active(l[1])) cls.push('cur');
    var label = t(l[0]);
    if (mobile && l[2] === 'feat') label += ' <span class="psm-pill">' + t('Featured') + '</span>';
    if (mobile && l[2] === 'smart') label += ' <span class="psm-pill">' + t('Smart') + '</span>';
    if (mobile && l[2] === 'soon') label += ' <span class="psm-pill psm-soon">' + t('Soon') + '</span>';
    return '<a href="' + l[1] + '"' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' + label + '</a>';
  }
  var navHTML = '<header class="psnav"><div class="psnav-in">' +
    '<button class="psnav-back" id="psBack" type="button" aria-label="Go back"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>' +
    '<a class="psnav-brand" href="' + BASE + '/adam/">' + MARK + '<span class="bw"><b>PropSight</b><span>' + t('Singapore') + '</span></span></a>' +
    '<nav class="psnav-links">' + LINKS.map(function (l) { return linkHtml(l, false); }).join('') + '</nav>' +
    '<div class="psnav-door">' +
      '<a class="pd-half' + (active(LISTINGS) ? ' cur' : '') + '" href="' + LISTINGS + '">' +
        '<span class="pd-top">' + t('Listing Platform') + ARROW + '</span>' +
        '<span class="pd-sub"><span class="pd-dot"></span>' + t('Buy and rent') + '</span>' +
      '</a>' +
      '<a class="pd-half pd-world' + (active(PROPWORLD) ? ' cur' : '') + '" href="' + PROPWORLD + '">' +
        '<span class="pd-top">' + t('PropWorld') + ARROW + '</span>' +
        '<span class="pd-sub">' + t('Brought to life') + '</span>' +
      '</a>' +
    '</div>' +
    '<button class="psnav-lang" id="psLang" type="button" aria-label="Switch language"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18"/></svg>' + (curLang() === 'zh' ? 'EN' : '中文') + '</button>' +
    '<button class="psnav-signin ps-signin-cta" type="button" onclick="window.PS&&PS.login(\'nav\')">' + t('Sign in') + '</button>' +
    '<button class="psnav-burger" id="psBurger" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>' +
    '</div></header>';
  var menuHTML = '<div class="psnav-menu" id="psMenu">' +
    '<button class="psnav-mlang" id="psLangM" type="button">' + (curLang() === 'zh' ? 'English' : '切换中文') + '</button>' +
    '<button class="psnav-mjoin ps-join-cta" type="button" onclick="window.PS&&PS.cta(\'menu\')">' + t('Join our Telegram →') + '</button>' +
    '<button class="psnav-msignin ps-signin-cta" type="button" onclick="window.PS&&PS.login(\'menu\')">' + t('Already a member? Sign in') + '</button>' +
    LINKS.map(function (l) { return linkHtml(l, true); }).join('') +
    '<a class="psm-door' + (active(LISTINGS) ? ' cur' : '') + '" href="' + LISTINGS + '">' +
      '<span><span class="psm-door-t">' + t('Listing Platform') + '</span><span class="psm-door-d">' + t('Browse homes for sale and rent') + '</span></span>' +
      '<span class="psm-arr">' + ARROW + '</span>' +
    '</a>' +
    '<a class="psm-door psm-world' + (active(PROPWORLD) ? ' cur' : '') + '" href="' + PROPWORLD + '">' +
      '<span><span class="psm-door-t">' + t('PropWorld') + '</span><span class="psm-door-d">' + t('Singapore property, brought to life') + '</span></span>' +
      '<span class="psm-arr">' + ARROW + '</span>' +
    '</a>' + '</div>';

  var year = new Date().getFullYear();
  var _MK = '<svg class="psf-mark" aria-hidden="true" viewBox="0 0 64 64"><circle cx="27" cy="27" r="19" fill="none" stroke="currentColor" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 32.5 L27 21.5 L36.5 32.5" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.5 37 L33.5 37" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="27" cy="33.4" r="2" fill="#84e6d4"/><path d="M40.5 40.5 L53.5 53.5" fill="none" stroke="#84e6d4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var _TG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3l-3.3 15.6c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.2L18.5 6c.4-.3-.1-.5-.6-.2L7.4 12.6l-4.8-1.5c-1-.3-1-1 .2-1.5l18.7-7.2c.9-.3 1.6.2 1.4 1.9z"/></svg>';
  var _IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg>';
  var _PHN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10.5 18.5h3"/></svg>';
  function _fl(href, label) { return '<a href="' + href + '">' + t(label) + '</a>'; }
  var footerHTML = '<footer class="psftr" id="psFtr"><div class="psf-in"><div class="psf-cols">' +
    '<div class="psf-brand">' +
      '<div class="psf-logo">' + _MK + '<span class="psf-bw"><b>PropSight</b><span>' + t('Singapore') + '</span></span></div>' +
      '<p class="psf-tag">' + t('Singapore property, decoded. Every value, grant and guide, free.') + '</p>' +
      '<div class="psf-soc"><a class="psf-ico" href="https://t.me/propsightsg" target="_blank" rel="noopener" aria-label="Telegram">' + _TG + '</a>' +
        '<a class="psf-ico" href="https://instagram.com/propsightsg" target="_blank" rel="noopener" aria-label="Instagram">' + _IG + '</a></div>' +
      '<a class="psf-inst" href="' + BASE + '/adam/install.html">' + _PHN + '<span>' + t('Add PropSight to your phone') + '</span></a>' +
    '</div>' +
    '<div class="psf-col"><h4>' + t('Tools') + '</h4>' +
      _fl(BASE + '/adam/tools/value.html', 'Value a home') + _fl(BASE + '/adam/tools/afford.html', 'What you can afford') +
      _fl(BASE + '/adam/tools/stamp-duty.html', 'Stamp duty') + _fl(BASE + '/adam/tools/grants.html', 'Grants') +
      _fl(BASE + '/adam/tools/schools.html', 'Schools nearby') + _fl(BASE + '/adam/tools/sell.html', 'Selling') +
      _fl(BASE + '/adam/tools/eligibility.html', 'Eligibility') + _fl(BASE + '/adam/tools/mortgage.html', 'Mortgage') +
    '</div>' +
    '<div class="psf-col"><h4>' + t('Explore') + '</h4>' +
      _fl(BASE + '/thesis/', 'Research') + _fl(BASE + '/adam/market-analysis/', 'Market Analysis') + _fl(BASE + '/adam/news/', 'News') +
      _fl(BASE + '/adam/essentials/', 'Guide') + _fl(BASE + '/adam/launches/', 'New Launches') +
    '</div>' +
    '<div class="psf-col"><h4>' + t('Company') + '</h4>' +
      _fl(BASE + '/adam/about/', 'About us') + _fl(BASE + '/adam/#talk', 'Contact') +
      _fl(BASE + '/adam/privacy/', 'Privacy') + _fl(BASE + '/adam/terms/', 'Terms') +
    '</div>' +
    '</div>' +
    '<div class="psf-bar"><span class="psf-cr">&copy; ' + year + ' PropSight</span>' +
      '<span class="psf-disc">' + t('Built on official URA and HDB data. Indicative, not financial advice.') + '</span>' +
      '<button class="psf-lang" data-ps-langtoggle type="button" aria-label="Switch language">中文</button>' +
    '</div>' +
  '</div></footer>';

  // self-referential canonical → https://propsight.sg + pathname (index.html stripped)
  function injectCanonical() {
    if (document.querySelector('link[rel="canonical"]')) return;
    var path = location.pathname.replace(/index\.html$/, '');
    var l = document.createElement('link');
    l.rel = 'canonical';
    l.href = 'https://www.propsight.sg' + path + location.search.replace(/^\?$/, '');
    document.head.appendChild(l);
  }

  function init() {
    // the Join button opens the shared signup modal, make sure member.js is present
    if (!window.PS && !document.querySelector('script[src*="member.js"]')) {
      var ms = document.createElement('script'); ms.src = BASE + '/adam/member.js'; document.head.appendChild(ms);
    }
    injectCanonical();
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var holder = document.createElement('div'); holder.innerHTML = navHTML + menuHTML;
    var nav = holder.firstChild, menu = holder.lastChild;
    var old = document.querySelector('header');
    if (old) old.parentNode.replaceChild(nav, old);
    else document.body.insertBefore(nav, document.body.firstChild);
    document.body.appendChild(menu);
    var b = document.getElementById('psBurger');
    b.addEventListener('click', function () { menu.classList.toggle('open'); });
    var back = document.getElementById('psBack');
    if (back) back.addEventListener('click', function () {
      // go back within the app if there's history, otherwise home
      if (history.length > 1) history.back(); else location.href = BASE + '/adam/';
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); });
    // shared footer (legal links + global disclaimer), append once, only if the page hasn't got one
    if (!document.getElementById('psFtr')) {
      var fh = document.createElement('div'); fh.innerHTML = footerHTML;
      document.body.appendChild(fh.firstChild);
    }
    function doToggle() { if (window.PSI18N) window.PSI18N.toggle(); }
    var lang = document.getElementById('psLang');
    if (lang) lang.addEventListener('click', doToggle);
    var langM = document.getElementById('psLangM');
    if (langM) langM.addEventListener('click', doToggle);
    if (window.PSI18N) window.PSI18N.apply();   // translate any data-i18n page content
    if (window.PS && PS.applyAuthUI) PS.applyAuthUI();   // relabel Join→name if already signed in
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ── Analytics: cookieless, privacy-first (PDPA-friendly, no cookies, no PII). ──
   Paste your free GoatCounter site code below to switch it on. Sign up (2 min, free)
   at https://www.goatcounter.com/signup → pick a code e.g. "propsight" → it becomes
   https://propsight.goatcounter.com . Set GC_CODE to that code and re-sync. Until then
   this is a no-op, so it can never slow or break the site. (Swap to Cloudflare/Plausible
   here later if you prefer, same one place.) */
(function () {
  var GC_CODE = "propsight"; // https://propsight.goatcounter.com
  if (!GC_CODE) return;
  var s = document.createElement('script');
  s.async = true; s.src = '//gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + GC_CODE + '.goatcounter.com/count');
  document.head.appendChild(s);
})();
