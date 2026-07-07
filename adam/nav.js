/* PropSight shared navigation, one consistent header on every sub-page.
   Drop <script src="/adam/nav.js" defer></script> on any page; it replaces that
   page's own <header> with the standard PropSight nav (absolute links, active
   state, grouped dropdowns, mobile menu). The homepage keeps its own hero nav.

   Source paths use /adam/, /thesis/, /essentials/ etc; sync.sh rewrites them to
   the live propsight.sg paths (/, /research/, /guide/, ...). active() matches
   both the source and the rewritten live forms. */
(function () {
  var BASE = location.origin;

  /* nav model. k: world|menu|link. kids = dropdown items [label, href, icon, sub?]. */
  var ITEMS = [
    { k:'world', t:'PropWorld', href: BASE + '/adam/propworld/' },
    { k:'menu',  t:'Tools', href: BASE + '/adam/#tools', kids:[
        ['Value a home',        BASE + '/adam/tools/value.html',      'calc'],
        ['What you can afford',  BASE + '/adam/tools/afford.html',     'calc'],
        ['Stamp duty',          BASE + '/adam/tools/stamp-duty.html', 'calc'],
        ['Grants',              BASE + '/adam/tools/grants.html',     'calc'],
        ['Schools nearby',      BASE + '/adam/tools/schools.html',    'pin'],
        ['Mortgage',            BASE + '/adam/tools/mortgage.html',   'calc'],
        ['Eligibility',         BASE + '/adam/tools/eligibility.html','calc'],
        ['Selling',             BASE + '/adam/tools/sell.html',       'calc'] ] },
    { k:'link',  t:'New Launches', href: BASE + '/adam/launches/' },
    { k:'link',  t:'Area Guides',  href: BASE + '/adam/areaguides/' },
    { k:'menu',  t:'Insights', smart:true, href: BASE + '/thesis/', kids:[
        ['Research',        BASE + '/thesis/',               'spark', 'Side by side, every condo and HDB'],
        ['Market Analysis', BASE + '/adam/market-analysis/', 'chart', 'Monthly analyst report'],
        ['News',            BASE + '/adam/news/',            'news',  'Daily Singapore property news'] ] },
    { k:'link',  t:'Beginners Guide', href: BASE + '/adam/essentials/' }
  ];
  var LISTINGS = 'https://listings.propsight.sg';

  /* Language: delegate to the shared engine in i18n.js (English-default). */
  if (!window.PSI18N && !document.querySelector('script[src*="i18n.js"]')) {
    var _i18 = document.createElement('script'); _i18.src = BASE + '/i18n.js'; document.head.appendChild(_i18);
  }
  function t(s) { return (window.PSI18N && window.PSI18N.t) ? window.PSI18N.t(s) : s; }
  function curLang() { return (window.PSI18N && window.PSI18N.lang) || 'en'; }

  var p = location.pathname;
  function has(re){ return re.test(p); }
  function itemActive(it){
    switch (it.t) {
      case 'PropWorld':       return has(/\/propworld\//);
      case 'Tools':           return has(/\/tools\//) || has(/#tools/);
      case 'New Launches':    return has(/\/launches\//);
      case 'Area Guides':     return has(/\/areaguides\//);
      case 'Insights':        return has(/\/(research|thesis|market-analysis|market-pulse|notes|news)\//);
      case 'Beginners Guide': return has(/\/(guide|essentials)\//);
    }
    return false;
  }
  function listingsActive(){ return has(/\/listings\//); }

  /* ── icons ── */
  function svg(inner, extra){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'+(extra||'')+'>'+inner+'</svg>'; }
  var IC = {
    calc:  '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h.01M8 15h2M12 15h2M16 15h.01M8 19h6"/>',
    pin:   '<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.4"/>',
    spark: '<path d="M4 18l5-6 4 3 6-8"/><path d="M17 7h3v3"/>',
    chart: '<path d="M5 21V10M12 21V4M19 21v-7"/>',
    news:  '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 13h10M7 16h10"/>',
    build: '<rect x="4" y="8" width="7" height="12"/><rect x="13" y="4" width="7" height="16"/><path d="M6.5 11h2M6.5 14h2M15.5 7h2M15.5 11h2"/>',
    book:  '<path d="M4 5a2 2 0 0 1 2-2h11v16H6a2 2 0 0 0-2 2z"/><path d="M17 3v16"/>',
    orb:   '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><path d="M3 12h18"/>'
  };
  function ic(k){ return svg(IC[k]||IC.calc); }
  var ARROW = '<svg class="pd-ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  var CARET = '<svg class="ps-car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  var MARK = '<svg class="pm" viewBox="0 0 64 64" aria-hidden="true">' +
    '<circle cx="27" cy="27" r="19" fill="none" stroke="currentColor" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M17.5 32.5 L27 21.5 L36.5 32.5" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M20.5 37 L33.5 37" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="27" cy="33.4" r="2" fill="var(--mk-acc,#15a0a0)"/>' +
    '<path d="M40.5 40.5 L53.5 53.5" fill="none" stroke="var(--mk-acc,#15a0a0)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var css = `
    :root{--serif:"Schibsted Grotesk",system-ui,sans-serif}
    .hl,.hl-i,.uline{display:none!important}
    em,.serif em,h1 em,h2 em,h3 em{font-style:normal!important}
    .newshero,.nh-bg,.mast-bg,.ghero-bg,.ph-bg{background:linear-gradient(120deg,#123b2a,#0d2418)!important}
    :root{--gtex:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='gn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0 0.02 0 0 0 0.22 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23gn)'/%3E%3C/svg%3E")}
    .psnav{position:sticky;top:0;z-index:300;background:rgba(236,247,245,.97);border-bottom:1px solid #d2e7e3;font-family:"Schibsted Grotesk",system-ui,sans-serif;padding-top:env(safe-area-inset-top)}
    .psnav-in{box-sizing:border-box;max-width:1320px;margin:0 auto;padding:0 30px;height:76px;display:flex;align-items:center;gap:10px}
    @media(min-width:1201px){.psnav-in{height:84px}}
    .psnav-brand{display:flex;align-items:center;gap:11px;text-decoration:none}.psnav-brand .pm{width:27px;height:27px;flex:none}
    .pm-tile{width:40px;height:40px;flex:none;border-radius:11px;display:flex;align-items:center;justify-content:center;background:linear-gradient(158deg,#2a5643,#163121);box-shadow:0 6px 15px -7px rgba(12,30,22,.6),inset 0 0 0 1px rgba(255,255,255,.07);color:#eaf7f2;--mk-acc:#7fd0bb}
    .psnav-brand .bw{display:flex;flex-direction:column;align-items:flex-start;gap:2px;line-height:1}.psnav-brand .bw span{font-size:9.5px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#0f7a82;margin:0}
    .psnav-brand b{font-weight:800;font-size:20px;color:#191512;letter-spacing:-.012em}

    /* links row */
    .psnav-links{display:flex;gap:4px;margin:0 auto;align-items:center}
    .psnav-item{position:relative}
    .psnav-a{position:relative;display:flex;align-items:center;gap:5px;font-size:13.5px;font-weight:600;color:#485a56;text-decoration:none;white-space:nowrap;padding:9px 12px;border-radius:10px;cursor:pointer;background:none;border:0;font-family:inherit;transition:color .18s,background .18s}
    .psnav-a:hover{color:#191512;background:rgba(39,81,63,.06)}
    .psnav-a .ps-car{width:11px;height:11px;opacity:.65}
    .psnav-a.cur{color:#1b3a2d}
    .psnav-a.cur::after{content:"";position:absolute;left:12px;right:12px;bottom:1px;height:2.5px;border-radius:3px;background:linear-gradient(90deg,#27513f,#15a0a0)}
    /* PropWorld featured (teal) */
    .psnav-a.world{color:#0f5a60;font-weight:700;background:linear-gradient(180deg,#f0fbfa,#e2f5f0);border:1px solid #bfe6e0;padding:8px 13px 8px 11px}
    .psnav-a.world .wic{width:16px;height:16px;color:#15a0a0;flex:none;display:inline-flex}
    .psnav-a.world:hover{background:linear-gradient(180deg,#eafbf9,#d5f1ea)}
    .psnav-a.world::before,.psnav-a.smart::before{position:absolute;left:50%;bottom:calc(100% - 4px);transform:translateX(-50%);font:800 7.5px/1 "Schibsted Grotesk",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#eef6f1;padding:2px 7px;border-radius:20px;white-space:nowrap}
    .psnav-a.world::before{content:"Featured";background:#15a0a0;box-shadow:0 2px 6px rgba(21,160,160,.4)}
    html.lang-zh .psnav-a.world::before{content:"精选"}
    /* Insights featured (pine) */
    .psnav-a.smart{color:#1b3a2d;font-weight:700;background:linear-gradient(180deg,#f1f7f3,#e7f1ec);border:1px solid #cfe3d8;padding:8px 11px}
    .psnav-a.smart .wic{width:15px;height:15px;color:#27513f;flex:none;display:inline-flex}
    .psnav-a.smart:hover{background:linear-gradient(180deg,#eaf4ef,#dcece4)}
    .psnav-a.smart::before{content:"Smart";background:#27513f;box-shadow:0 2px 6px rgba(27,58,45,.35)}
    html.lang-zh .psnav-a.smart::before{content:"智能"}
    .psnav-a .wic svg{width:100%;height:100%}

    /* dropdown panel */
    .psnav-drop{position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%) translateY(6px);min-width:255px;background:#fff;border:1px solid #d9e7e0;border-radius:15px;box-shadow:0 22px 48px -22px rgba(16,42,30,.55);padding:8px;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .16s,transform .16s;z-index:320}
    .psnav-item:hover .psnav-drop,.psnav-item.open .psnav-drop{opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0)}
    .psnav-drop.grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;min-width:430px}
    .psnav-di{display:flex;align-items:center;gap:11px;padding:9px 11px;border-radius:10px;text-decoration:none;color:#191512}
    .psnav-di:hover{background:rgba(39,81,63,.06)}
    .psnav-di .di-ic{width:30px;height:30px;flex:none;border-radius:9px;background:#eef6f1;display:flex;align-items:center;justify-content:center;color:#27513f}
    .psnav-di .di-ic svg{width:17px;height:17px}
    .psnav-di b{font-size:13.5px;font-weight:600;display:block;line-height:1.15}
    .psnav-di span{font-size:11px;color:#758a86;display:block;margin-top:1px}

    /* right cluster: Listing Platform doorway */
    .psnav-door{display:flex;align-items:center;gap:9px;text-decoration:none;margin-left:8px;padding:7px 13px;border:1px solid #cdd9d0;border-radius:12px;background:linear-gradient(180deg,#fff,#f1f5f1);position:relative;flex:none;transition:transform .2s,border-color .2s,box-shadow .2s}
    .psnav-door::before{content:"";position:absolute;left:-10px;top:50%;transform:translateY(-50%);width:1px;height:30px;background:#c9e2dd}
    .psnav-door:hover{transform:translateY(-1px);border-color:#27513f;box-shadow:0 9px 22px -8px rgba(39,81,63,.28)}
    .psnav-door.cur{background:linear-gradient(180deg,#27513f,#1b3a2d);border-color:#1b3a2d}
    .psnav-door .dt{display:flex;flex-direction:column;gap:2px;line-height:1.05}
    .psnav-door .dt b{font-size:12px;font-weight:700;color:#1b3a2d}
    .psnav-door .dt span{font-size:7.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#758a86;display:flex;align-items:center;gap:4px}
    .psnav-door.cur .dt b{color:#e6f3f0}.psnav-door.cur .dt span{color:rgba(230,243,240,.8)}
    .psnav-door .pd-dot{width:6px;height:6px;border-radius:50%;background:#3aa76d;box-shadow:0 0 0 0 rgba(58,167,109,.5);animation:pddot 2.2s ease-out infinite}
    @keyframes pddot{0%{box-shadow:0 0 0 0 rgba(58,167,109,.5)}70%{box-shadow:0 0 0 7px rgba(58,167,109,0)}100%{box-shadow:0 0 0 0 rgba(58,167,109,0)}}
    @media(prefers-reduced-motion:reduce){.psnav-door .pd-dot{animation:none}}
    .psnav-door .pd-ar{width:13px;height:13px;flex:none;color:#27513f}
    .psnav-lang{display:inline-flex;align-items:center;gap:6px;margin-left:8px;flex:none;background:#eaf6f4;border:1.5px solid #27513f;border-radius:30px;font-family:inherit;font-size:13px;font-weight:800;color:#1b3a2d;cursor:pointer;padding:8px 14px;white-space:nowrap;transition:background .2s,color .2s,transform .2s}
    .psnav-lang svg{width:15px;height:15px;flex:none;stroke:currentColor;fill:none;stroke-width:1.7}
    .psnav-lang:hover{background:#1b3a2d;color:#eaf6f4;transform:translateY(-1px)}

    .psnav-back{display:none;margin-right:2px;width:40px;height:40px;flex:none;align-items:center;justify-content:center;border:1px solid #bfdbd5;border-radius:11px;background:rgba(255,255,255,.6);cursor:pointer;color:#1b3a2d;-webkit-tap-highlight-color:transparent}
    .psnav-back svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
    @media(max-width:1180px){.psnav-back{display:inline-flex}}
    @media all and (display-mode:standalone){.psnav-back{display:inline-flex}}
    .psnav-burger{display:none;margin-left:auto;width:42px;height:42px;border:1px solid #bfdbd5;border-radius:10px;background:rgba(255,255,255,.6);cursor:pointer;align-items:center;justify-content:center}
    .psnav-burger svg{width:22px;height:22px;stroke:#191512;fill:none;stroke-width:2;stroke-linecap:round}
    /* collapse to burger when the grouped row no longer fits comfortably */
    @media(max-width:1180px){.psnav-links,.psnav-door,.psnav-lang{display:none}.psnav-burger{display:flex}}

    /* ── mobile menu: everything visible, no accordion ── */
    .psnav-menu,.psnav-menu *{box-sizing:border-box}
    .psnav-menu{position:fixed;left:0;right:0;top:calc(76px + env(safe-area-inset-top));bottom:0;z-index:299;background:#eaf6f4;padding:14px 16px calc(20px + env(safe-area-inset-bottom));display:none;flex-direction:column;overflow-y:auto;overflow-x:hidden}
    .psnav-menu.open{display:flex}
    .psm-chip{min-width:0}.psm-chip b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .psm-world{display:flex;align-items:center;gap:12px;text-decoration:none;padding:13px 14px;border-radius:15px;background:linear-gradient(135deg,#0f7a82,#15a0a0);color:#eafffb;box-shadow:0 12px 26px -12px rgba(15,122,130,.6)}
    .psm-world .wl{flex:1}
    .psm-world .badge{font-size:7.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;background:rgba(255,255,255,.22);color:#eafffb;padding:2px 7px;border-radius:20px;display:inline-block;margin-bottom:4px}
    .psm-world b{display:block;font-size:18px;font-weight:700;line-height:1.1}
    .psm-world .s{display:block;font-size:11.5px;color:rgba(234,255,251,.85);margin-top:2px}
    .psm-world .worb{width:44px;height:44px;flex:none;color:rgba(234,255,251,.9);fill:none;stroke:currentColor;stroke-width:1.6}
    .psm-grp{margin-top:14px}
    .psm-glbl{font-size:9.5px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#758a86;margin:0 2px 8px;display:flex;align-items:center;gap:8px}
    .psm-glbl::after{content:"";flex:1;height:1px;background:#d2e2db}
    .psm-glbl .mtag{font-size:7.5px;font-weight:800;letter-spacing:.05em;color:#eef6f1;background:#27513f;border-radius:20px;padding:2px 7px}
    .psm-chips{display:grid;grid-template-columns:1fr 1fr;gap:7px}
    .psm-chip{display:flex;align-items:center;gap:8px;text-decoration:none;background:#fff;border:1px solid #dbe9e2;border-radius:11px;padding:10px 11px;color:#191512}
    .psm-chip svg{width:15px;height:15px;color:#27513f;flex:none;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
    .psm-chip b{font-size:12.5px;font-weight:600}
    .psm-chip.wide{grid-column:1/-1}
    .psm-chip.acc{background:linear-gradient(180deg,#f1f7f3,#e7f1ec);border-color:#cfe3d8}
    .psm-door{display:flex;align-items:center;gap:11px;text-decoration:none;margin-top:14px;padding:14px 15px;border:1px solid #cdd9d0;border-radius:14px;background:linear-gradient(180deg,#fff,#eef4ef)}
    .psm-door.cur{background:linear-gradient(180deg,#27513f,#1b3a2d);border-color:#1b3a2d}
    .psm-door .md{flex:1}
    .psm-door b{display:block;font-size:16px;font-weight:600;color:#1b3a2d}
    .psm-door span{display:block;font-size:11.5px;color:#758a86;margin-top:2px}
    .psm-door.cur b{color:#eef6f1}.psm-door.cur span{color:rgba(238,246,241,.78)}
    .psm-door .arr{width:32px;height:32px;flex:none;border-radius:50%;background:#27513f;display:flex;align-items:center;justify-content:center;color:#e6f3f0}
    .psm-door .arr svg{width:14px;height:14px}
    .psm-util{margin-top:auto;padding-top:14px}
    .psm-util-in{border-top:2px solid #cfe3db;padding-top:13px}
    .psm-urow{display:flex;gap:8px;align-items:center}
    .psm-tg{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;background:#1b3a2d;color:#eef6f1;border-radius:11px;padding:12px;font-size:13px;font-weight:800;text-decoration:none;border:0;font-family:inherit;cursor:pointer}
    .psm-tg svg{width:15px;height:15px}
    .psm-lang{background:#dff0ec;border:1px solid #bfdbd5;border-radius:11px;font:800 12.5px "Schibsted Grotesk",system-ui,sans-serif;color:#1b3a2d;padding:12px 16px;cursor:pointer}
    .psm-phone{display:inline-flex;align-items:center;gap:6px;align-self:center;margin-top:11px;font-size:11.5px;font-weight:700;color:#758a86;text-decoration:none;background:#e4efe9;border:1px solid #d3e3db;border-radius:20px;padding:6px 13px}
    .psm-phone svg{width:13px;height:13px;color:#27513f;fill:none;stroke:currentColor;stroke-width:1.8}

    @media(max-width:560px){.psnav-in{padding:0 13px;gap:8px}.psnav-brand b{font-size:17px}.pm-tile{width:35px;height:35px;border-radius:10px}.psnav-brand .pm{width:24px;height:24px}.psnav-back{width:34px;height:34px}}
    @media(max-width:400px){.psnav-in{padding:0 10px;gap:6px}.psnav-brand b{font-size:16px}.pm-tile{width:32px;height:32px}.psnav-brand .pm{width:22px;height:22px}.psnav-back{width:30px;height:30px}}

    /* shared site footer */
    .psftr{background:linear-gradient(180deg,#0f231a,#0a1712);color:#cfe4dc;padding:60px 0 0;font-family:"Schibsted Grotesk",system-ui,sans-serif}
    .psf-in{max-width:1120px;margin:0 auto;padding:0 32px}
    .psf-cols{display:grid;grid-template-columns:1.7fr 1fr 1fr 1fr;gap:44px;padding-bottom:44px}
    .psf-logo{display:flex;align-items:center;gap:11px}
    .psf-mark{width:42px;height:42px;flex:none;color:#cfe4dc}
    .psf-bw{display:flex;flex-direction:row;align-items:baseline;gap:7px;line-height:1}
    .psf-bw b{font-weight:800;font-size:23px;color:#fff;letter-spacing:-.012em}
    .psf-bw span{font-size:23px;font-weight:800;letter-spacing:-.012em;color:#7fd0bb;margin:0}
    .psf-tag{margin:16px 0 20px;font-size:14.5px;line-height:1.6;color:rgba(207,228,220,.72);max-width:310px}
    .psf-soc{display:flex;align-items:center;gap:11px;margin-bottom:16px}
    .psf-ico{width:40px;height:40px;border:1px solid rgba(255,255,255,.15);border-radius:11px;display:inline-flex;align-items:center;justify-content:center;color:rgba(207,228,220,.82);transition:.2s}
    .psf-ico svg{width:20px;height:20px}.psf-ico:hover{color:#84e6d4;border-color:rgba(132,230,212,.45)}
    .psf-inst{display:inline-flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600;color:rgba(207,228,220,.82);text-decoration:none}
    .psf-inst svg{width:18px;height:18px}.psf-inst:hover{color:#84e6d4}
    .psf-col h4{font-size:14px;color:#d8b15e;margin-bottom:15px;font-weight:700}
    .psf-col a{display:block;font-size:14px;color:rgba(207,228,220,.82);text-decoration:none;padding:6px 0;transition:color .2s}.psf-col a:hover{color:#fff}
    .psf-bar{border-top:1px solid rgba(255,255,255,.1);padding:22px 0 calc(38px + env(safe-area-inset-bottom));display:flex;align-items:center;gap:16px;flex-wrap:wrap}
    .psf-cr{font-size:13px;font-weight:700;color:#fff}
    .psf-disc{font-size:12.5px;color:rgba(207,228,220,.55);flex:1;min-width:240px;line-height:1.5}
    .psf-lang{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#cfe4dc;font-size:13px;font-weight:600;padding:8px 16px;border-radius:9px;cursor:pointer;font-family:inherit}.psf-lang:hover{background:rgba(255,255,255,.14)}
    @media(max-width:820px){.psf-cols{grid-template-columns:1fr 1fr;gap:36px 24px}.psf-brand{grid-column:1/-1}}
    @media(max-width:520px){.psftr{padding-top:44px}.psf-in{padding:0 20px}}
  `;

  /* ── desktop item render ── */
  function itemHtml(it){
    var cur = itemActive(it);
    if (it.k === 'world') {
      return '<div class="psnav-item"><a class="psnav-a world'+(cur?' cur':'')+'" href="'+it.href+'"><span class="wic">'+ic('orb')+'</span>'+t(it.t)+'</a></div>';
    }
    if (it.k === 'link') {
      return '<div class="psnav-item"><a class="psnav-a'+(cur?' cur':'')+'" href="'+it.href+'">'+t(it.t)+'</a></div>';
    }
    // menu
    var smart = it.smart ? ' smart' : '';
    var trigger = '<button class="psnav-a'+smart+(cur?' cur':'')+'" type="button" aria-haspopup="true" aria-expanded="false">' +
      (it.smart ? '<span class="wic">'+ic('spark')+'</span>' : '') + t(it.t) + CARET + '</button>';
    var grid = it.t === 'Tools' ? ' grid' : '';
    var items = it.kids.map(function(k){
      var sub = k[3] ? '<span>'+t(k[3])+'</span>' : '';
      return '<a class="psnav-di" href="'+k[1]+'"><span class="di-ic">'+ic(k[2])+'</span><span><b>'+t(k[0])+'</b>'+sub+'</span></a>';
    }).join('');
    return '<div class="psnav-item">'+trigger+'<div class="psnav-drop'+grid+'">'+items+'</div></div>';
  }

  var LANG_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18"/></svg>';

  var navHTML = '<header class="psnav"><div class="psnav-in">' +
    '<button class="psnav-back" id="psBack" type="button" aria-label="Go back"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>' +
    '<a class="psnav-brand" href="' + BASE + '/"><span class="pm-tile">' + MARK + '</span><span class="bw"><b>PropSight</b><span>' + t('Singapore') + '</span></span></a>' +
    '<nav class="psnav-links">' + ITEMS.map(itemHtml).join('') + '</nav>' +
    '<a class="psnav-door' + (listingsActive() ? ' cur' : '') + '" href="' + LISTINGS + '">' +
      '<span class="dt"><b>' + t('Listing Platform') + '</b><span><span class="pd-dot"></span>' + t('Buy and rent') + '</span></span>' + ARROW +
    '</a>' +
    '<button class="psnav-lang" id="psLang" type="button" aria-label="Switch language">' + LANG_SVG + (curLang() === 'zh' ? 'EN' : '中文') + '</button>' +
    '<button class="psnav-burger" id="psBurger" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>' +
    '</div></header>';

  /* ── mobile menu ── */
  var mobileShort = { 'What you can afford':'Afford', 'Schools nearby':'Schools', 'Market Analysis':'Market' };
  function mlabel(s){ return mobileShort[s] || s; }
  function chip(label, href, icon, cls){ return '<a class="psm-chip'+(cls?' '+cls:'')+'" href="'+href+'">'+ic(icon)+'<b>'+t(mlabel(label))+'</b></a>'; }
  var PW = ITEMS[0], TOOLS = ITEMS[1], NL = ITEMS[2], AREAS = ITEMS[3], INS = ITEMS[4], BG = ITEMS[5];

  var TG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3l-3.3 15.6c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.2L18.5 6c.4-.3-.1-.5-.6-.2L7.4 12.6l-4.8-1.5c-1-.3-1-1 .2-1.5l18.7-7.2c.9-.3 1.6.2 1.4 1.9z"/></svg>';
  var PHN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10.5 18.5h3"/></svg>';

  var menuHTML = '<div class="psnav-menu" id="psMenu">' +
    '<a class="psm-world" href="'+PW.href+'"><span class="wl"><span class="badge">'+t('Featured')+'</span><b>PropWorld</b><span class="s">'+t('Singapore property, brought to life')+'</span></span><svg class="worb" viewBox="0 0 24 24">'+IC.orb+'</svg></a>' +
    '<div class="psm-grp"><div class="psm-glbl">'+t('Tools')+'</div><div class="psm-chips">' +
      TOOLS.kids.map(function(k){ return chip(k[0], k[1], k[2]); }).join('') +
    '</div></div>' +
    '<div class="psm-grp"><div class="psm-chips">' +
      chip('New Launches', NL.href, 'build') + chip('Area Guides', AREAS.href, 'pin') +
    '</div></div>' +
    '<div class="psm-grp"><div class="psm-glbl">'+t('Insights')+' <span class="mtag">'+t('Smart')+'</span></div><div class="psm-chips">' +
      INS.kids.map(function(k){ return chip(k[0], k[1], k[2], 'acc'); }).join('') +
    '</div></div>' +
    '<div class="psm-grp"><div class="psm-chips">' + chip('Beginners Guide', BG.href, 'book', 'wide') + '</div></div>' +
    '<a class="psm-door'+(listingsActive()?' cur':'')+'" href="'+LISTINGS+'"><span class="md"><b>'+t('Listing Platform')+'</b><span>'+t('Browse homes for sale and rent')+'</span></span><span class="arr">'+ARROW+'</span></a>' +
    '<div class="psm-util"><div class="psm-util-in">' +
      '<div class="psm-urow">' +
        '<button class="psm-tg" type="button" onclick="window.PS&&PS.cta&&PS.cta(\'menu\')">'+TG+t('Join our Telegram')+'</button>' +
        '<button class="psm-lang" id="psLangM" type="button">'+(curLang()==='zh'?'English':'切换中文')+'</button>' +
      '</div>' +
      '<a class="psm-phone" href="'+BASE+'/install.html">'+PHN+t('Add PropSight to your phone')+'</a>' +
    '</div></div>' +
  '</div>';

  var _MK = '<svg class="psf-mark" aria-hidden="true" viewBox="0 0 64 64"><circle cx="27" cy="27" r="19" fill="none" stroke="currentColor" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 32.5 L27 21.5 L36.5 32.5" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.5 37 L33.5 37" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="27" cy="33.4" r="2" fill="#84e6d4"/><path d="M40.5 40.5 L53.5 53.5" fill="none" stroke="#84e6d4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var _IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg>';
  var _PHN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10.5 18.5h3"/></svg>';
  function _fl(href, label) { return '<a href="' + href + '">' + t(label) + '</a>'; }
  var footerHTML = '<footer class="psftr" id="psFtr"><div class="psf-in"><div class="psf-cols">' +
    '<div class="psf-brand">' +
      '<div class="psf-logo">' + _MK + '<span class="psf-bw"><b>PropSight</b><span>' + t('Singapore') + '</span></span></div>' +
      '<p class="psf-tag">' + t('Singapore property, decoded. Every value, grant and guide, free.') + '</p>' +
      '<div class="psf-soc"><a class="psf-ico" href="https://t.me/propsightsg" target="_blank" rel="noopener" aria-label="Telegram">' + TG + '</a>' +
        '<a class="psf-ico" href="https://instagram.com/propsightsg" target="_blank" rel="noopener" aria-label="Instagram">' + _IG + '</a></div>' +
      '<a class="psf-inst" href="' + BASE + '/install.html">' + _PHN + '<span>' + t('Add PropSight to your phone') + '</span></a>' +
    '</div>' +
    '<div class="psf-col"><h4>' + t('Tools') + '</h4>' +
      _fl(BASE + '/adam/tools/value.html', 'Value a home') + _fl(BASE + '/adam/tools/afford.html', 'What you can afford') +
      _fl(BASE + '/adam/tools/stamp-duty.html', 'Stamp duty') + _fl(BASE + '/adam/tools/grants.html', 'Grants') +
      _fl(BASE + '/adam/tools/schools.html', 'Schools nearby') + _fl(BASE + '/adam/tools/sell.html', 'Selling') +
      _fl(BASE + '/adam/tools/eligibility.html', 'Eligibility') + _fl(BASE + '/adam/tools/mortgage.html', 'Mortgage') +
    '</div>' +
    '<div class="psf-col"><h4>' + t('Explore') + '</h4>' +
      _fl(BASE + '/adam/propworld/', 'PropWorld') + _fl(BASE + '/adam/areaguides/', 'Area Guides') +
      _fl(BASE + '/thesis/', 'Research') + _fl(BASE + '/adam/market-analysis/', 'Market Analysis') + _fl(BASE + '/adam/news/', 'News') +
      _fl(BASE + '/adam/essentials/', 'Beginners Guide') + _fl(BASE + '/adam/launches/', 'New Launches') +
    '</div>' +
    '<div class="psf-col"><h4>' + t('Company') + '</h4>' +
      _fl(BASE + '/adam/about/', 'About us') + _fl(BASE + '/#talk', 'Contact') +
      _fl(BASE + '/adam/privacy/', 'Privacy') + _fl(BASE + '/adam/terms/', 'Terms') +
    '</div>' +
    '</div>' +
    '<div class="psf-bar"><span class="psf-cr">&copy; ' + (new Date().getFullYear()) + ' PropSight</span>' +
      '<span class="psf-disc">' + t('Built on official URA and HDB data. Indicative, not financial advice.') + '</span>' +
      '<button class="psf-lang" data-ps-langtoggle type="button" aria-label="Switch language">中文</button>' +
    '</div>' +
  '</div></footer>';

  function injectCanonical() {
    if (document.querySelector('link[rel="canonical"]')) return;
    var path = location.pathname.replace(/index\.html$/, '');
    var l = document.createElement('link');
    l.rel = 'canonical';
    l.href = 'https://www.propsight.sg' + path + location.search.replace(/^\?$/, '');
    document.head.appendChild(l);
  }

  function init() {
    if (!window.PS && !document.querySelector('script[src*="member.js"]')) {
      var ms = document.createElement('script'); ms.src = BASE + '/member.js'; document.head.appendChild(ms);
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

    // desktop dropdowns: click-toggle for touch, hover handled by CSS; close on outside click / Esc
    var items = nav.querySelectorAll('.psnav-item');
    items.forEach(function (it) {
      var trig = it.querySelector('button.psnav-a');
      if (!trig) return;
      trig.addEventListener('click', function (e) {
        e.preventDefault();
        var wasOpen = it.classList.contains('open');
        items.forEach(function (o) { o.classList.remove('open'); var b2 = o.querySelector('button.psnav-a'); if (b2) b2.setAttribute('aria-expanded', 'false'); });
        if (!wasOpen) { it.classList.add('open'); trig.setAttribute('aria-expanded', 'true'); }
      });
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) items.forEach(function (o) { o.classList.remove('open'); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') items.forEach(function (o) { o.classList.remove('open'); }); });

    var back = document.getElementById('psBack');
    if (back) back.addEventListener('click', function () {
      var path = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
      var last = path.split('/').pop() || '';
      var parent = last.indexOf('.') > -1 ? '/' : (path.slice(0, path.lastIndexOf('/') + 1) || '/');
      location.href = BASE + parent;
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); });

    if (!document.getElementById('psFtr')) {
      var fh = document.createElement('div'); fh.innerHTML = footerHTML;
      document.body.appendChild(fh.firstChild);
    }
    function doToggle() { if (window.PSI18N) window.PSI18N.toggle(); }
    var lang = document.getElementById('psLang'); if (lang) lang.addEventListener('click', doToggle);
    var langM = document.getElementById('psLangM'); if (langM) langM.addEventListener('click', doToggle);
    if (window.PSI18N) window.PSI18N.apply();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ── Analytics: cookieless, privacy-first (PDPA-friendly, no cookies, no PII). ── */
(function () {
  var GC_CODE = "propsight"; // https://propsight.goatcounter.com
  if (!GC_CODE) return;
  var s = document.createElement('script');
  s.async = true; s.src = '//gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + GC_CODE + '.goatcounter.com/count');
  document.head.appendChild(s);
})();
