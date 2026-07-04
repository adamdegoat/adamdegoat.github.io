/* Caveat, Find: smart search over the market (condos by budget/region/yield, HDB towns by budget). */
const Search = (() => {
  const C = Caveat; let IDX = null, CONDO = null, mode = 'condo';

  function init(idx) { IDX = idx; renderForm(); }

  function renderForm() {
    const el = document.getElementById('findForm');
    el.innerHTML = `
      <div class="seg" id="findSeg">
        <button data-m="condo" class="${mode === 'condo' ? 'on' : ''}">Condo</button>
        <button data-m="hdb" class="${mode === 'hdb' ? 'on' : ''}">HDB town</button>
      </div>
      <div id="findFields">${mode === 'condo' ? condoFields() : hdbFields()}</div>
      <button class="btn-primary" id="findGo">Find matches</button>`;
    el.querySelectorAll('#findSeg button').forEach(b => b.onclick = () => { mode = b.dataset.m; renderForm(); });
    document.getElementById('findGo').onclick = run;
  }

  function condoFields() {
    return `
      <div class="field"><label>Region</label>
        <select id="s_region"><option value="">Any region</option>
          <option value="CCR">Core Central (CCR)</option>
          <option value="RCR">City Fringe (RCR)</option>
          <option value="OCR">Outside Central (OCR)</option></select></div>
      <div class="field"><label>Max budget</label>
        <input id="s_budget" type="number" inputmode="numeric" placeholder="e.g. 1500000"><span class="suffix">SGD</span></div>
      <div class="field"><label>Min gross yield <span style="font-weight:500;color:var(--ink-3)">· optional</span></label>
        <input id="s_yield" type="number" inputmode="decimal" placeholder="e.g. 3.5"><span class="suffix">%</span></div>
      <div class="field"><label>Sort by</label>
        <select id="s_sort">
          <option value="yield">Highest rental yield</option>
          <option value="price">Lowest median price</option>
          <option value="txns">Most active (volume)</option>
          <option value="psf">Lowest PSF</option></select></div>`;
  }
  function hdbFields() {
    return `
      <div class="field"><label>Max budget (median)</label>
        <input id="s_budget" type="number" inputmode="numeric" placeholder="e.g. 600000"><span class="suffix">SGD</span></div>
      <div class="field"><label>Sort by</label>
        <select id="s_sort">
          <option value="price">Lowest median price</option>
          <option value="txns">Most active (volume)</option>
          <option value="psf">Lowest PSF</option></select></div>
      <p class="hint">Searches towns by their overall median resale price across all flat types (last 15 months).</p>`;
  }

  async function run() {
    const out = document.getElementById('findResult');
    out.innerHTML = `<div class="empty-state"><div class="spinner"></div><p>Searching…</p></div>`;
    try { mode === 'condo' ? await runCondo(out) : runHdb(out); }
    catch (e) { out.innerHTML = `<div class="empty-state"><p class="err">${e.message}</p></div>`; }
  }

  async function runCondo(out) {
    if (!CONDO) CONDO = C.expand(await C.getJSON('condo_summary.json'));
    const region = val('s_region'), bRaw = val('s_budget').trim(), budget = bRaw === '' ? Infinity : +bRaw, minY = +val('s_yield') || 0, sort = val('s_sort');
    let m = CONDO.filter(p => (!region || p.seg === region) && p.median_price <= budget && (minY ? (p.yield != null && p.yield >= minY) : true));
    const sorters = { yield: (a, b) => (b.yield ?? -1) - (a.yield ?? -1), price: (a, b) => a.median_price - b.median_price,
      txns: (a, b) => b.txns - a.txns, psf: (a, b) => a.median_psf - b.median_psf };
    m.sort(sorters[sort] || sorters.yield);
    renderCondo(out, m);
  }

  function renderCondo(out, m) {
    if (!m.length) { out.innerHTML = `<div class="empty-state"><p>No condos match, widen the budget or region.</p></div>`; return; }
    const head = `<div class="find-head"><h2>${m.length.toLocaleString()} matching condo${m.length > 1 ? 's' : ''}</h2>
      <span class="hint">showing top ${Math.min(m.length, 40)} · median resale, last 18 months</span></div>`;
    out.innerHTML = head + `<div class="find-list">${m.slice(0, 40).map(p => `
      <div class="find-card">
        <div class="fc-main"><div class="fc-n">${p.project}</div>
          <div class="fc-s">District ${p.district} · ${p.seg} · ${p.txns} sales</div></div>
        <div class="fc-stats">
          <div class="fc-price">${C.fmtMoney(p.median_price)}<span>median · $${p.median_psf} psf</span></div>
          ${p.yield != null ? `<div class="fc-yield">~${p.yield}%<span>gross yield</span></div>` : '<div class="fc-yield none">—<span>no rent data</span></div>'}
        </div>
        <button class="btn-ghost fc-val" data-p="${esc(p.project)}">Value this →</button>
      </div>`).join('')}</div>`;
    out.querySelectorAll('.fc-val').forEach(b => b.onclick = () => valuate(b.dataset.p));
  }

  // jump to the Valuation tab with this project pre-filled
  function valuate(projectTitle) {
    const up = projectTitle.toUpperCase();
    const meta = IDX.condo_projects.find(p => p[0] === up);
    App.route('valuation');
    if (meta) CMA.loadCondo(meta);
  }

  function runHdb(out) {
    if (!window.__pulse) { out.innerHTML = `<div class="empty-state"><p class="err">Market data still loading, try again in a moment.</p></div>`; return; }
    const bRaw = val('s_budget').trim(), budget = bRaw === '' ? Infinity : +bRaw, sort = val('s_sort');
    let towns = window.__pulse.hdb_towns.filter(t => t.median_price <= budget);
    const sorters = { price: (a, b) => a.median_price - b.median_price, txns: (a, b) => b.txns - a.txns, psf: (a, b) => a.median_psf - b.median_psf };
    towns.sort(sorters[sort] || sorters.price);
    if (!towns.length) { out.innerHTML = `<div class="empty-state"><p>No towns under that budget, raise it.</p></div>`; return; }
    out.innerHTML = `<div class="find-head"><h2>${towns.length} matching town${towns.length > 1 ? 's' : ''}</h2>
      <span class="hint">overall median resale price · last 15 months</span></div>
      <div class="find-list">${towns.map(t => `
      <div class="find-card">
        <div class="fc-main"><div class="fc-n">${t.town}</div><div class="fc-s">${t.txns.toLocaleString()} sales</div></div>
        <div class="fc-stats"><div class="fc-price">${C.fmtMoney(t.median_price)}<span>median · $${t.median_psf} psf</span></div></div>
      </div>`).join('')}</div>`;
  }

  const val = id => (document.getElementById(id) || {}).value || '';
  const esc = s => s.replace(/"/g, '&quot;');

  return { init };
})();
