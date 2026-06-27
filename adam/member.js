/* PropSight membership — shared client state + the signup UI used everywhere
   (Research wall, homepage modal, hero). One card design, one place to maintain.
   <script src="/adam/member.js"></script>  (sync rewrites the path on propsight.sg) */
(function () {
  var API = 'https://web-production-07326.up.railway.app';
  var KEY = 'ps_member';

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

  function captureToken() {
    try { var p = new URLSearchParams(location.search), t = p.get('t');
      if (t) { setMember(t, p.get('n') || firstName()); return t; } } catch (e) {}
    return null;
  }

  // ── shared styles (injected once; brand colours hardcoded so it looks identical on every page) ──
  var CSS = ''
   + '.psj-card{--g:#1b3a2d;--g2:#27513f;--br:#b08d57;--ink:#191512;--ink2:#5a5248;--ink3:#8a8175;--line:#e7e0d2;'
   + 'font-family:"Schibsted Grotesk",system-ui,sans-serif;background:linear-gradient(180deg,#fff,#f7f4ec);'
   + 'border:1px solid var(--line);border-radius:22px;padding:30px 30px 26px;box-shadow:0 30px 80px rgba(15,35,26,.20),0 1px 0 rgba(255,255,255,.7) inset;text-align:left;color:var(--ink)}'
   + '.psj-ey{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#0f231a;'
   + 'background:linear-gradient(135deg,#e3c98f,#b08d57);padding:5px 11px;border-radius:30px;margin-bottom:14px}'
   + '.psj-h{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:26px;line-height:1.12;letter-spacing:-.3px;margin:0 0 9px}'
   + '.psj-sub{font-size:14px;color:var(--ink2);line-height:1.5;margin:0 0 18px}'
   + '.psj-perks{list-style:none;margin:0 0 20px;padding:0}'
   + '.psj-perks li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;color:var(--ink2);padding:7px 0}'
   + '.psj-perks b{color:var(--ink);font-weight:600}'
   + '.psj-tick{flex:none;width:20px;height:20px;border-radius:50%;background:#eaf5ef;border:1px solid #cde7d8;display:flex;align-items:center;justify-content:center;margin-top:1px}'
   + '.psj-tick svg{width:11px;height:11px;stroke:var(--g);fill:none;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}'
   + '.psj-form{display:flex;flex-direction:column;gap:9px}'
   + '.psj-form input{width:100%;padding:13px 15px;border:1px solid #d8cfbe;border-radius:12px;font-size:15px;font-family:inherit;background:#fff;color:var(--ink)}'
   + '.psj-form input:focus{outline:none;border-color:var(--g);box-shadow:0 0 0 3px rgba(31,193,143,.14)}'
   + '.psj-form button{width:100%;padding:14px;border:0;border-radius:12px;background:var(--g);color:#f5f1e8;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;transition:.18s;margin-top:2px}'
   + '.psj-form button:hover{background:#163025}.psj-form button:disabled{opacity:.55;cursor:default}'
   + '.psj-msg{font-size:13px;font-weight:600;margin-top:11px;min-height:1px}.psj-msg.ok{color:#1b7a52}.psj-msg.err{color:#c0392b}'
   + '.psj-fine{font-size:11.5px;color:var(--ink3);margin-top:13px;line-height:1.5}'
   + '.psj-fine a{color:var(--g2);font-weight:600;text-decoration:none;cursor:pointer}'
   + '@media(min-width:480px){.psj-row{display:flex;gap:9px}.psj-row input{flex:1}}'
   /* modal */
   + '.psj-ov{position:fixed;inset:0;z-index:9999;background:rgba(12,20,16,.55);display:flex;align-items:center;justify-content:center;'
   + 'padding:20px;overflow-y:auto;opacity:0;transition:opacity .22s}'
   + '.psj-ov.on{opacity:1}'
   + '.psj-ov .psj-card{max-width:440px;width:100%;position:relative;margin:auto;transform:translateY(8px);transition:transform .22s}'
   + '.psj-ov.on .psj-card{transform:none}'
   + '.psj-x{position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:9px;border:1px solid var(--line);background:#fff;'
   + 'color:var(--ink2);cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center}'
   + '.psj-x:hover{background:#f4f0e6}';

  var _styled = false;
  function injectCSS() { if (_styled) return; _styled = true;
    var s = document.createElement('style'); s.id = 'psj-css'; s.textContent = CSS; document.head.appendChild(s); }

  var TICK = '<span class="psj-tick"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></span>';
  function cardHTML(opts) {
    opts = opts || {};
    var h = opts.heading || 'Unlock the full picture.';
    var sub = opts.sub || 'Join PropSight free — see every condo &amp; HDB in full, plus the weekly insights and live Telegram signals.';
    var x = opts.modal ? '<button class="psj-x" data-psj-close aria-label="Close">×</button>' : '';
    return '<div class="psj-card">' + x
      + '<div class="psj-ey">Free membership</div>'
      + '<h3 class="psj-h">' + h + '</h3>'
      + '<p class="psj-sub">' + sub + '</p>'
      + '<ul class="psj-perks">'
      + '<li>' + TICK + '<span><b>Full research</b> — every condo &amp; HDB, ranked, compared &amp; tracked.</span></li>'
      + '<li>' + TICK + '<span><b>More of Aillie</b> — a higher chat limit with your property assistant.</span></li>'
      + '<li>' + TICK + '<span><b>Weekly newsletter</b> — the moves that matter, in plain English.</span></li>'
      + '<li>' + TICK + '<span><b>Telegram channel</b> — live property signals as they happen.</span></li>'
      + '</ul>'
      + '<form class="psj-form" novalidate>'
      + '<div class="psj-row"><input name="name" placeholder="First name" autocomplete="given-name">'
      + '<input name="email" type="email" placeholder="you@email.com" autocomplete="email"></div>'
      + '<button type="submit">Join free →</button></form>'
      + '<div class="psj-msg"></div>'
      + '<div class="psj-fine">Free forever · no spam · <a data-psj-signin>Already a member? Sign in</a></div>'
      + '</div>';
  }

  // wire a rendered card (its root contains .psj-form etc.). onDone(member) fires on success.
  function wire(root, source, onDone) {
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
          msg.className = 'psj-msg ok'; msg.textContent = 'You’re in! Check your email to confirm.';
          if (onDone) onDone(get());
        } else {
          btn.disabled = false; btn.textContent = 'Join free →';
          msg.className = 'psj-msg err'; msg.textContent = (r && r.error) || 'Something went wrong — please try again.';
        }
      }).catch(function () { btn.disabled = false; btn.textContent = 'Join free →'; msg.className = 'psj-msg err'; msg.textContent = 'Network error — please try again.'; });
    });
    var si = root.querySelector('[data-psj-signin]');
    if (si) si.addEventListener('click', function () {
      var email = prompt('Enter your email and we’ll send you a sign-in link:');
      if (!email || email.indexOf('@') < 1) return;
      signin(email.trim()).then(function () { msg.className = 'psj-msg ok'; msg.textContent = 'Sent — check your email for the sign-in link.'; });
    });
  }

  function openModal(source) {
    injectCSS();
    if (document.querySelector('.psj-ov')) return;
    var ov = document.createElement('div'); ov.className = 'psj-ov';
    ov.innerHTML = cardHTML({ modal: true });
    document.body.appendChild(ov);
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { ov.classList.add('on'); });
    function close() { document.documentElement.style.overflow = ''; ov.classList.remove('on'); setTimeout(function () { ov.remove(); }, 240); }
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.hasAttribute('data-psj-close')) close(); });
    wire(ov, source || 'home', function () { /* keep modal open to show the "check email" success line */ setTimeout(close, 2600); });
    setTimeout(function(){ var i=ov.querySelector('[name=name]'); if(i) i.focus(); }, 260);
  }

  window.PS = {
    API: API, get: get, isMember: isMember, setMember: setMember, clear: clear, firstName: firstName,
    captureToken: captureToken, join: join, signin: signin,
    injectCSS: injectCSS, cardHTML: cardHTML, wire: wire, openModal: openModal
  };
})();
