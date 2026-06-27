/* PropSight membership — shared client state.
   Talks to the Aillie/PropSight backend on Railway (CORS open). Membership is a
   soft gate: a token in localStorage unlocks member-only views. Drop with
   <script src="/adam/member.js"></script> (sync rewrites the path on propsight.sg). */
(function () {
  var API = 'https://web-production-07326.up.railway.app';
  var KEY = 'ps_member';

  function get() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function isMember() { var m = get(); return !!(m && m.token); }
  function setMember(token, name) {
    localStorage.setItem(KEY, JSON.stringify({ token: token, name: name || '', ts: Date.now() }));
  }
  function clear() { localStorage.removeItem(KEY); }
  function firstName() { var m = get(); return (m && m.name) || ''; }

  function post(path, body) {
    return fetch(API + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.json().catch(function () { return {}; }); });
  }

  // If a confirm/sign-in link dropped us here with ?t=<token>, log this device in.
  function captureToken() {
    try {
      var p = new URLSearchParams(location.search);
      var t = p.get('t');
      if (t) { setMember(t, p.get('n') || firstName()); return t; }
    } catch (e) {}
    return null;
  }

  window.PS = {
    API: API,
    get: get,
    isMember: isMember,
    setMember: setMember,
    clear: clear,
    firstName: firstName,
    captureToken: captureToken,
    join: function (name, email, source) { return post('/api/member/signup', { name: name, email: email, source: source || 'research' }); },
    signin: function (email) { return post('/api/member/signin', { email: email }); }
  };
})();
