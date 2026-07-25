/* PropSight: the two things left from the retired membership.
   Accounts, the join wall and the signup card were removed on 2026-07-04, and the
   research gate they fed has been a bare `return` ever since. What still runs is
   the Telegram call-to-action in the nav and on /about/, plus a tidy-up that hides
   any sign-in button left in older markup. Everything else, including the call to
   the Railway backend, is gone.
   nav.js injects this file when window.PS is absent, so it stays a file rather
   than moving inline. */
(function () {
  var TG = 'https://t.me/propsightsg';

  function cta() { window.open(TG, '_blank', 'noopener'); }

  function applyAuthUI() {
    var si = document.querySelectorAll('.ps-signin-cta');
    for (var j = 0; j < si.length; j++) si[j].style.display = 'none';
    var tg = document.querySelectorAll('.ps-tg-only');
    for (var k = 0; k < tg.length; k++) tg[k].style.display = '';
  }

  window.PS = { cta: cta, applyAuthUI: applyAuthUI };

  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(applyAuthUI);
  setTimeout(applyAuthUI, 400);   // nav.js builds its buttons late
})();
