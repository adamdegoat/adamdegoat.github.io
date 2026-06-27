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
    ['News', BASE + '/adam/news/', ''],
    ['Guide', BASE + '/adam/essentials/', ''],
    ['About us', BASE + '/adam/about/', ''],
    ['Contact', BASE + '/adam/#talk', ''],
    ["Let's talk", 'https://wa.me/6583219747', 'cta']
  ];
  var p = location.pathname;
  function active(href) {
    if (/\/thesis\//.test(p)) return /\/thesis\//.test(href);
    if (/\/launches\//.test(p)) return /\/launches\//.test(href);
    if (/\/notes\//.test(p)) return /\/notes\//.test(href);
    if (/\/news\//.test(p)) return /\/news\//.test(href);
    if (/\/about\//.test(p)) return /\/about\//.test(href);
    if (/\/essentials\//.test(p)) return /\/essentials\//.test(href);
    if (/\/tools\//.test(p)) return /#tools$/.test(href);
    return false;
  }
  var MARK = '<svg class="pm" viewBox="0 0 64 64" aria-hidden="true">' +
    '<path d="M9 35 L32 13 L55 35" fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M16 49 L48 49" stroke="currentColor" stroke-width="4.2" stroke-linecap="round"/>' +
    '<circle cx="32" cy="39" r="3.4" fill="#b08d57"/></svg>';

  var css = '' +
    '.psnav{position:sticky;top:0;z-index:300;background:rgba(247,244,236,.97);border-bottom:1px solid #e7e0d2;font-family:"Schibsted Grotesk",system-ui,sans-serif}' +
    '.psnav-in{max-width:1200px;margin:0 auto;padding:0 36px;height:76px;display:flex;align-items:center;gap:30px}' +
    '.psnav-brand{display:flex;align-items:center;gap:11px;text-decoration:none}.psnav-brand .pm{width:38px;height:38px;flex:none;color:#1b3a2d}' +
    '.psnav-brand .bw{display:flex;flex-direction:column;line-height:1}.psnav-brand .bw span{font-size:9px;letter-spacing:.32em;text-transform:uppercase;color:#8a8175;font-weight:700;margin-top:4px}' +
    '.psnav-brand b{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:22px;color:#191512;letter-spacing:.01em}' +
    '.psnav-links{display:flex;gap:22px;margin-left:auto;align-items:center}' +
    '.psnav-links a{font-size:14.5px;font-weight:600;color:#5a5248;text-decoration:none;white-space:nowrap;transition:color .2s}' +
    '.psnav-links a:hover{color:#191512}.psnav-links a.cur{color:#1b3a2d}' +
    '.psnav-links a.feat{position:relative;overflow:visible}.psnav-links a.feat::after{content:"Featured";position:absolute;left:50%;top:-12px;transform:translateX(-50%);font-size:7px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#241a0d;background:linear-gradient(135deg,#e3c98f,#b08d57);padding:2px 6px;border-radius:7px;white-space:nowrap;line-height:1.2;box-shadow:0 2px 7px rgba(176,141,87,.38)}' +
    '.psnav-links a.cta{background:#1b3a2d;color:#f5f1e8;padding:9px 18px;border-radius:30px;font-weight:700}' +
    '.psnav-burger{display:none;margin-left:auto;width:42px;height:42px;border:1px solid #dbd1bf;border-radius:10px;background:rgba(255,255,255,.6);cursor:pointer;align-items:center;justify-content:center}' +
    '.psnav-burger svg{width:22px;height:22px;stroke:#191512;fill:none;stroke-width:2;stroke-linecap:round}' +
    '.psnav-menu{position:fixed;left:0;right:0;top:76px;bottom:0;z-index:299;background:#f6f3ea;padding:14px 24px 30px;display:none;flex-direction:column;overflow-y:auto}' +
    '.psnav-menu.open{display:flex}' +
    '.psnav-menu a{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:23px;color:#191512;text-decoration:none;padding:16px 2px;border-bottom:1px solid #e7e0d2}' +
    '@media(max-width:860px){.psnav-links{display:none}.psnav-burger{display:flex}}@media(max-width:560px){.psnav-in{padding:0 20px}.psnav-brand b{font-size:20px}.psnav-brand .pm{width:34px;height:34px}}';

  function linkHtml(l, mobile) {
    var cls = [];
    if (l[2] === 'feat' && !mobile) cls.push('feat');
    if (l[2] === 'cta' && !mobile) cls.push('cta');
    if (active(l[1])) cls.push('cur');
    return '<a href="' + l[1] + '"' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' + l[0] + '</a>';
  }
  var navHTML = '<header class="psnav"><div class="psnav-in">' +
    '<a class="psnav-brand" href="' + BASE + '/adam/">' + MARK + '<span class="bw"><b>PropSight</b><span>Singapore</span></span></a>' +
    '<nav class="psnav-links">' + LINKS.map(function (l) { return linkHtml(l, false); }).join('') + '</nav>' +
    '<button class="psnav-burger" id="psBurger" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>' +
    '</div></header>';
  var menuHTML = '<div class="psnav-menu" id="psMenu">' + LINKS.map(function (l) { return linkHtml(l, true); }).join('') + '</div>';

  function init() {
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
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
