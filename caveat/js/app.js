/* Caveat, app shell: routing, agent profile (localStorage), init. */
const App = (() => {
  const PROFILE_KEY = 'caveat_profile';
  let profile = null;

  function getProfile() {
    if (profile) return profile;
    try { profile = JSON.parse(localStorage.getItem(PROFILE_KEY)); } catch (e) { profile = null; }
    return profile;
  }
  function saveProfile(p) { profile = p; localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); renderProfileChip(); }

  function initials(name) {
    return (name || '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '—';
  }
  function renderProfileChip() {
    const p = getProfile();
    const av = document.getElementById('profileAvatar'), nm = document.getElementById('profileNameTop');
    if (p && p.name) {
      av.textContent = initials(p.name); nm.textContent = p.name;
      if (p.color) av.style.background = `linear-gradient(135deg,${p.color},${shade(p.color,-18)})`;
    } else { av.textContent = '+'; nm.textContent = 'Set up profile'; }
  }
  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = pct / 100; r = Math.round(r + (pct < 0 ? r : 255 - r) * f);
    g = Math.round(g + (pct < 0 ? g : 255 - g) * f); b = Math.round(b + (pct < 0 ? b : 255 - b) * f);
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

  // ---- routing ----
  function route(name) {
    document.querySelectorAll('.route').forEach(s => s.classList.toggle('active', s.id === name));
    document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b.dataset.route === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    location.hash = name;
  }

  // ---- settings modal ----
  function openSettings() {
    const m = document.getElementById('settingsModal'); m.hidden = false;
    const p = getProfile() || {}; const f = document.getElementById('settingsForm');
    f.name.value = p.name || ''; f.cea.value = p.cea || ''; f.agency.value = p.agency || '';
    f.phone.value = p.phone || ''; f.color.value = p.color || '#0f9d76';
  }
  function closeSettings() { document.getElementById('settingsModal').hidden = true; }

  function applyTheme(dark) {
    document.body.classList.toggle('dark', dark);
    const b = document.getElementById('themeBtn'); if (b) b.textContent = dark ? '☀' : '◐';
    document.querySelector('meta[name=theme-color]').setAttribute('content', dark ? '#0d1218' : '#101a2b');
  }

  async function init() {
    renderProfileChip();
    applyTheme(localStorage.getItem('caveat_theme') === 'dark');
    document.getElementById('themeBtn').addEventListener('click', () => {
      const dark = !document.body.classList.contains('dark');
      localStorage.setItem('caveat_theme', dark ? 'dark' : 'light');
      applyTheme(dark);
    });
    // nav
    document.querySelectorAll('[data-route]').forEach(el =>
      el.addEventListener('click', () => route(el.dataset.route)));
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('settingsClose').addEventListener('click', closeSettings);
    document.getElementById('settingsModal').addEventListener('click', e => {
      if (e.target.id === 'settingsModal') closeSettings();
    });
    // help / how-to-use
    const helpModal = document.getElementById('helpModal');
    const openHelp = () => { helpModal.hidden = false; };
    const closeHelp = () => { helpModal.hidden = true; localStorage.setItem('caveat_seen_help', '1'); };
    document.getElementById('helpBtn').addEventListener('click', openHelp);
    document.getElementById('helpClose').addEventListener('click', closeHelp);
    document.getElementById('helpGotit').addEventListener('click', closeHelp);
    helpModal.addEventListener('click', e => { if (e.target.id === 'helpModal') closeHelp(); });
    // Escape closes any open modal
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      ['settingsModal', 'helpModal', 'ratesModal'].forEach(id => { const m = document.getElementById(id); if (m && !m.hidden) m.hidden = true; });
      document.querySelectorAll('.cav-modal.open').forEach(m => m.classList.remove('open'));
    });
    if (!localStorage.getItem('caveat_seen_help')) setTimeout(openHelp, 700); // first-visit tour

    document.getElementById('settingsForm').addEventListener('submit', e => {
      e.preventDefault(); const f = e.target;
      saveProfile({ name: f.name.value.trim(), cea: f.cea.value.trim().toUpperCase(),
        agency: f.agency.value.trim(), phone: f.phone.value.trim(), color: f.color.value });
      closeSettings();
    });
    document.getElementById('clearProfile').addEventListener('click', () => {
      localStorage.removeItem('caveat_profile'); profile = null; renderProfileChip();
      const f = document.getElementById('settingsForm'); f.reset(); f.color.value = '#0f9d76';
      closeSettings();
    });
    if (location.hash) { const h = location.hash.slice(1); if (document.getElementById(h)) route(h); }

    // load index + freshness, then boot the tools
    try {
      const idx = await Caveat.index();
      const fr = idx.freshness;
      window.__freshness = fr;
      const built = new Date(fr.built + 'T00:00:00');
      const days = Math.max(0, Math.floor((Date.now() - built.getTime()) / 86400000));
      const rel = days === 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`;
      const counts = `${fr.hdb_txns.toLocaleString()} HDB resale + ${fr.condo_txns.toLocaleString()} private caveats + ${fr.amenities.toLocaleString()} amenities`;
      document.getElementById('freshness').innerHTML =
        `<span class="live-dot"></span> Data refreshed <b>${rel}</b> (${fr.built}) · auto-updates weekly · ${counts}`;
      CMA.init(idx); Eligibility.init(); Prospect.init(idx); Pulse.init(); Search.init(idx); Upgrade.init();
    } catch (err) {
      document.getElementById('freshness').textContent = 'Data failed to load, ' + err.message;
    }
  }

  return { init, getProfile, openSettings, shade, initials, route };
})();
document.addEventListener('DOMContentLoaded', App.init);
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
