/* PropSight membership, shared client state + the signup UI used everywhere
   (Research wall, homepage modal, hero). One card design, one place to maintain.
   <script src="/adam/member.js"></script>  (sync rewrites the path on propsight.sg) */
(function () {
  var API = 'https://web-production-07326.up.railway.app';
  var KEY = 'ps_member';
  var TG = 'https://t.me/propsightsg';   // members-only channel, link is gated behind sign-in

  function get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function isMember() { var m = get(); return !!(m && m.token); }
  function setMember(token, name) { localStorage.setItem(KEY, JSON.stringify({ token: token, name: name || '', ts: Date.now() })); }
  function clear() { localStorage.removeItem(KEY); }
  function firstName() { var m = get(); return (m && m.name) || ''; }

  function post(path, body) {
    return fetch(API + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {})
    }).then(function (r) { return r.json().catch(function () { return {}; }); });
  }
  function join(name, email, source) { return post('/api/member/signup', { name: name, email: email, source: source || 'site' }); }
  function signin(email) { return post('/api/member/signin', { email: email }); }
  function loginEmail(email) { return post('/api/member/login', { email: email }); }

  function captureToken() {
    try { var p = new URLSearchParams(location.search), t = p.get('t');
      if (t) { setMember(t, p.get('n') || firstName()); return t; } } catch (e) {}
    return null;
  }

  // ── shared styles (injected once; brand colours hardcoded so it looks identical on every page) ──
  var CSS = ''
   + '.psj-card{--g:#1b3a2d;--g2:#27513f;--br:#0f7a82;--ink:#191512;--ink2:#485a56;--ink3:#758a86;--line:#d2e7e3;'
   + 'font-family:"Schibsted Grotesk",system-ui,sans-serif;background:linear-gradient(180deg,#fff,#ecf7f5);'
   + 'border:1px solid var(--line);border-radius:22px;padding:30px 30px 26px;box-shadow:0 30px 80px rgba(15,35,26,.20),0 1px 0 rgba(255,255,255,.7) inset;text-align:left;color:var(--ink)}'
   + '.psj-ey{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#0f231a;'
   + 'background:var(--gtex,none),#1b3a2d;padding:5px 11px;border-radius:30px;margin-bottom:14px}'
   + '.psj-h{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:26px;line-height:1.12;letter-spacing:-.3px;margin:0 0 9px}'
   + '.psj-sub{font-size:14px;color:var(--ink2);line-height:1.5;margin:0 0 18px}'
   + '.psj-perks{list-style:none;margin:0 0 20px;padding:0}'
   + '.psj-perks li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;color:var(--ink2);padding:7px 0}'
   + '.psj-perks b{color:var(--ink);font-weight:600}'
   + '.psj-tick{flex:none;width:20px;height:20px;border-radius:50%;background:#eaf5ef;border:1px solid #cde7d8;display:flex;align-items:center;justify-content:center;margin-top:1px}'
   + '.psj-tick svg{width:11px;height:11px;stroke:var(--g);fill:none;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}'
   + '.psj-form,.psj-siform{display:flex;flex-direction:column;gap:9px}'
   + '.psj-form input,.psj-siform input{width:100%;padding:13px 15px;border:1px solid #bed8d3;border-radius:12px;font-size:16px;font-family:inherit;background:#fff;color:var(--ink)}'
   + '.psj-form input:focus,.psj-siform input:focus{outline:none;border-color:var(--g);box-shadow:0 0 0 3px rgba(31,193,143,.14)}'
   + '.psj-form button,.psj-siform button{width:100%;padding:14px;border:0;border-radius:12px;background:var(--g);color:#e8f5f2;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;transition:.18s;margin-top:2px}'
   + '.psj-form button:hover,.psj-siform button:hover{background:#163025}.psj-form button:disabled,.psj-siform button:disabled{opacity:.55;cursor:default}'
   + '.psj-msg{font-size:13px;font-weight:600;margin-top:11px;min-height:1px}.psj-msg.ok{color:#1b7a52}.psj-msg.err{color:#c0392b}'
   + '.psj-fine{font-size:11.5px;color:var(--ink3);margin-top:13px;line-height:1.5}'
   + '.psj-fine a{color:var(--g2);font-weight:600;text-decoration:none;cursor:pointer}'
   + '.psj-consent{font-size:11px;color:var(--ink3);margin-top:10px;line-height:1.5}'
   + '.psj-consent a{color:var(--ink3);font-weight:600;text-decoration:underline;text-underline-offset:2px}'
   + '@media(min-width:480px){.psj-row{display:flex;gap:9px}.psj-row input{flex:1}}'
   /* modal */
   + '.psj-ov{position:fixed;inset:0;z-index:9999;background:rgba(12,20,16,.55);display:flex;align-items:center;justify-content:center;'
   + 'padding:20px;overflow-y:auto;opacity:0;transition:opacity .22s}'
   + '.psj-ov.on{opacity:1}'
   + '.psj-ov .psj-card{max-width:440px;width:100%;position:relative;margin:auto;transform:translateY(8px);transition:transform .22s}'
   + '.psj-ov.on .psj-card{transform:none}'
   + '.psj-x{position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:9px;border:1px solid var(--line);background:#fff;'
   + 'color:var(--ink2);cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center}'
   + '.psj-x:hover{background:#e6f4f1}'
   /* account view */
   + '.psj-acct{display:flex;flex-direction:column;gap:10px;margin-top:6px}'
   + '.psj-acct a,.psj-acct button{display:flex;align-items:center;justify-content:center;width:100%;padding:14px;border-radius:12px;font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;text-decoration:none;border:0}'
   + '.psj-acct .psj-go{background:var(--g);color:#e8f5f2}.psj-acct .psj-go:hover{background:#163025}'
   + '.psj-acct .psj-tg{background:#eaf5ef;color:var(--g);border:1px solid #cde7d8}.psj-acct .psj-tg:hover{background:#dff0e7;border-color:#bfe0cd}'
   + '.psj-acct .psj-out{background:#fff;color:var(--ink);border:1px solid var(--line)}.psj-acct .psj-out:hover{border-color:var(--br);color:#8a2f2f}'
   + '.psj-acct .psj-em{font-size:12.5px;color:var(--ink3);text-align:center;margin:2px 0 4px}'
   /* logged-in nav chip */
   + '.ps-member{position:relative}.ps-member::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#3aa76d;margin-right:7px;vertical-align:middle}';

  var _styled = false;
  function injectCSS() { if (_styled) return; _styled = true;
    var s = document.createElement('style'); s.id = 'psj-css'; s.textContent = CSS; document.head.appendChild(s); }

  var TICK = '<span class="psj-tick"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></span>';
  function cardHTML(opts) {
    opts = opts || {};
    var h = opts.heading || 'See the full picture.';
    var sub = opts.sub || 'Join PropSight free, see every condo &amp; HDB in full, plus the weekly insights and live Telegram signals.';
    var x = opts.modal ? '<button class="psj-x" data-psj-close aria-label="Close">×</button>' : '';
    return '<div class="psj-card">' + x
      + '<div class="psj-join">'
      +   '<div class="psj-ey">Free membership</div>'
      +   '<h3 class="psj-h">' + h + '</h3>'
      +   '<p class="psj-sub">' + sub + '</p>'
      +   '<ul class="psj-perks">'
      +   '<li>' + TICK + '<span><b>Full research</b>, every condo &amp; HDB, ranked, compared &amp; tracked.</span></li>'
      +   '<li>' + TICK + '<span><b>More of Aillie</b>, a higher chat limit with your property assistant.</span></li>'
      +   '<li>' + TICK + '<span><b>Weekly newsletter</b>, the moves that matter.</span></li>'
      +   '<li>' + TICK + '<span><b>Telegram channel</b>, live property signals as they happen.</span></li>'
      +   '</ul>'
      +   '<form class="psj-form" novalidate>'
      +   '<div class="psj-row"><input name="name" placeholder="First name" autocomplete="given-name">'
      +   '<input name="email" type="email" placeholder="you@email.com" autocomplete="email"></div>'
      +   '<button type="submit">Join free →</button></form>'
      +   '<div class="psj-consent">By joining you agree to receive PropSight emails and accept our <a href="/privacy/">Privacy Policy</a> &amp; <a href="/terms/">Terms</a>. Unsubscribe anytime.</div>'
      +   '<div class="psj-msg"></div>'
      +   '<div class="psj-fine">Free forever · no password · unsubscribe anytime. <a data-psj-tosignin>Already a member? Sign in</a></div>'
      + '</div>'
      + '<div class="psj-signin" style="display:none">'
      +   '<div class="psj-ey">Welcome back</div>'
      +   '<h3 class="psj-h">Sign in to PropSight.</h3>'
      +   '<p class="psj-sub">No password needed, just enter the email you joined with and you’re straight back in.</p>'
      +   '<form class="psj-siform" novalidate>'
      +   '<input name="email" type="email" placeholder="you@email.com" autocomplete="email">'
      +   '<button type="submit">Sign in →</button></form>'
      +   '<div class="psj-msg psj-simsg"></div>'
      +   '<div class="psj-fine"><a data-psj-tojoin>← New here? Join free</a></div>'
      + '</div>'
      + '</div>';
  }

  // wire a rendered card. onDone(member) fires on a successful join.
  function wire(root, source, onDone) {
    var joinView = root.querySelector('.psj-join'),
        siView = root.querySelector('.psj-signin');
    // ── join ──
    var form = root.querySelector('.psj-form'),
        msg = root.querySelector('.psj-msg'),
        btn = form.querySelector('button');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name=name]').value || '').trim();
      var email = (form.querySelector('[name=email]').value || '').trim();
      if (email.indexOf('@') < 1) { msg.className = 'psj-msg err'; msg.textContent = 'Please enter a valid email.'; return; }
      btn.disabled = true; btn.textContent = 'Joining…';
      join(name, email, source).then(function (r) {
        if (r && r.ok && r.token) {
          setMember(r.token, r.name || name);
          applyAuthUI();
          msg.className = 'psj-msg ok'; msg.textContent = 'You’re in! Your full research is unlocked. We also emailed you a sign-in link for your other devices.';
          if (onDone) onDone(get());
        } else {
          btn.disabled = false; btn.textContent = 'Join free →';
          msg.className = 'psj-msg err'; msg.textContent = (r && r.error) || 'Something went wrong, please try again.';
        }
      }).catch(function () { btn.disabled = false; btn.textContent = 'Join free →'; msg.className = 'psj-msg err'; msg.textContent = 'Network error, please try again.'; });
    });
    // ── toggle between join / sign-in ──
    var toSi = root.querySelector('[data-psj-tosignin]'), toJoin = root.querySelector('[data-psj-tojoin]');
    if (toSi && siView) toSi.addEventListener('click', function () {
      joinView.style.display = 'none'; siView.style.display = 'block';
      var i = siView.querySelector('[name=email]'); if (i) i.focus();
    });
    if (toJoin) toJoin.addEventListener('click', function () {
      siView.style.display = 'none'; joinView.style.display = 'block';
    });
    // ── sign-in (passwordless link) ──
    var sif = root.querySelector('.psj-siform');
    if (sif) {
      var simsg = root.querySelector('.psj-simsg'), sib = sif.querySelector('button');
      sif.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (sif.querySelector('[name=email]').value || '').trim();
        if (email.indexOf('@') < 1) { simsg.className = 'psj-msg psj-simsg err'; simsg.textContent = 'Please enter a valid email.'; return; }
        sib.disabled = true; sib.textContent = 'Signing in…';
        loginEmail(email).then(function (r) {
          if (r && r.ok && r.token) {
            setMember(r.token, r.name || '');
            applyAuthUI();
            simsg.className = 'psj-msg psj-simsg ok';
            simsg.textContent = 'Welcome back' + (r.name ? ', ' + r.name : '') + '! You’re in.';
            sib.textContent = 'Signed in ✓';
            setTimeout(function () { try { location.reload(); } catch (e) {} }, 750);
          } else {
            sib.disabled = false; sib.textContent = 'Sign in →';
            simsg.className = 'psj-msg psj-simsg err'; simsg.textContent = (r && r.error) || 'Couldn’t sign you in, please try again.';
          }
        }).catch(function () { sib.disabled = false; sib.textContent = 'Sign in →'; simsg.className = 'psj-msg psj-simsg err'; simsg.textContent = 'Network error, please try again.'; });
      });
    }
  }

  function openModal(source, startSignin) {
    injectCSS();
    if (document.querySelector('.psj-ov')) return;
    var ov = document.createElement('div'); ov.className = 'psj-ov';
    ov.innerHTML = cardHTML({ modal: true });
    document.body.appendChild(ov);
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { ov.classList.add('on'); });
    function close() { document.documentElement.style.overflow = ''; ov.classList.remove('on'); setTimeout(function () { ov.remove(); }, 240); }
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.hasAttribute('data-psj-close')) close(); });
    wire(ov, source || 'home', function () { applyAuthUI(); setTimeout(close, 2600); });
    if (startSignin) { var t = ov.querySelector('[data-psj-tosignin]'); if (t) t.click(); }
    else setTimeout(function(){ var i=ov.querySelector('[name=name]'); if(i) i.focus(); }, 260);
  }

  // explicit "I already have an account" path → opens the box on the sign-in panel
  function login(source) { if (isMember()) { openAccount(); return; } openModal(source, true); }

  function logout() { clear(); try { location.reload(); } catch (e) {} }

  // account panel for signed-in members (replaces the join box once logged in)
  function openAccount() {
    injectCSS();
    if (document.querySelector('.psj-ov')) return;
    var fn = firstName(), m = get() || {};
    var ov = document.createElement('div'); ov.className = 'psj-ov';
    ov.innerHTML = '<div class="psj-card"><button class="psj-x" data-psj-close aria-label="Close">×</button>'
      + '<div class="psj-ey">Signed in</div>'
      + '<h3 class="psj-h">You’re a member' + (fn ? ', ' + fn : '') + '.</h3>'
      + '<p class="psj-sub">Full research, the higher Aillie limit, the weekly newsletter and the members’ Telegram channel are all unlocked.</p>'
      + '<div class="psj-acct">'
      + '<a class="psj-go" href="/thesis/">Open the full research →</a>'
      + '<a class="psj-tg" href="' + TG + '" target="_blank" rel="noopener">Join the Telegram channel →</a>'
      + '<button class="psj-out" data-psj-logout type="button">Sign out</button>'
      + '</div></div>';
    document.body.appendChild(ov);
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { ov.classList.add('on'); });
    function close() { document.documentElement.style.overflow = ''; ov.classList.remove('on'); setTimeout(function () { ov.remove(); }, 240); }
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.hasAttribute('data-psj-close')) close(); });
    ov.querySelector('[data-psj-logout]').addEventListener('click', logout);
  }

  // every join CTA routes through here: members get the account panel, guests get the join box
  function cta(source) { if (isMember()) openAccount(); else openModal(source); }

  // relabel join CTAs based on state (".ps-join-cta" → member's name when signed in)
  function applyAuthUI() {
    var member = isMember(), label = firstName() || 'My account';
    var nodes = document.querySelectorAll('.ps-join-cta');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (member) {
        if (!el.dataset.joinlabel) el.dataset.joinlabel = (el.textContent || '').trim();
        el.textContent = label; el.classList.add('ps-member');
      } else if (el.dataset.joinlabel) {
        el.textContent = el.dataset.joinlabel; el.classList.remove('ps-member');
      }
    }
    // "Sign in" entries only make sense for guests, hide them once signed in
    var si = document.querySelectorAll('.ps-signin-cta');
    for (var j = 0; j < si.length; j++) si[j].style.display = member ? 'none' : '';
    // Telegram link is a member-only perk, reveal it only once signed in
    var tg = document.querySelectorAll('.ps-tg-only');
    for (var k = 0; k < tg.length; k++) tg[k].style.display = member ? '' : 'none';
  }

  function _ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  _ready(applyAuthUI);
  setTimeout(applyAuthUI, 400);   // catch nav buttons built late by nav.js

  window.PS = {
    API: API, get: get, isMember: isMember, setMember: setMember, clear: clear, firstName: firstName,
    captureToken: captureToken, join: join, signin: signin,
    injectCSS: injectCSS, cardHTML: cardHTML, wire: wire, openModal: openModal,
    cta: cta, login: login, openAccount: openAccount, logout: logout, applyAuthUI: applyAuthUI
  };
})();
