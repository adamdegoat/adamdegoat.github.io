/* Caveat, Prospecting radar: recent transactions in a farm area + outreach drafts. */
const Prospect = (() => {
  const C = Caveat; let IDX = null; let mode = 'hdb'; let MOP = null;

  function init(idx) { IDX = idx; renderForm(); }

  function renderForm() {
    const el = document.getElementById('prospectForm');
    const towns = Object.keys(IDX.hdb_towns).sort()
      .map(t => `<option value="${t}">${Narrative.titleCase(t)}</option>`).join('');
    const districts = [...new Set(IDX.condo_projects.map(p => p[1]))].sort((a, b) => a - b)
      .map(d => `<option value="${d}">District ${d}</option>`).join('');
    el.innerHTML = `
      <div class="seg seg-wrap" id="pSeg">
        <button data-m="hdb" class="${mode === 'hdb' ? 'on' : ''}">HDB sales</button>
        <button data-m="condo" class="${mode === 'condo' ? 'on' : ''}">Condo sales</button>
        <button data-m="mop" class="${mode === 'mop' ? 'on' : ''}">MOP targets</button>
      </div>
      <div id="pFields">
        ${mode === 'hdb'
          ? `<div class="field"><label>Town / farm area</label><select id="p_town">${towns}</select></div>
             <div class="field"><label>Flat type <span style="font-weight:500;color:var(--ink-3)">· optional</span></label>
               <select id="p_ftype"><option value="">All types</option></select></div>`
          : mode === 'condo'
          ? `<div class="field"><label>District</label><select id="p_district">${districts}</select></div>`
          : `<div class="field"><label>Town</label><select id="p_mtown"></select></div>
             <p class="hint">HDB blocks reaching their 5-year MOP, owners are newly free to sell, so these are prime farming targets for first-time sellers.</p>`}
      </div>
      <button class="btn-primary" id="p_go">${mode === 'mop' ? 'Show MOP targets' : 'Show recent sales'}</button>`;
    el.querySelectorAll('#pSeg button').forEach(b => b.onclick = () => { mode = b.dataset.m; renderForm(); });
    if (mode === 'hdb') {
      const town = document.getElementById('p_town'), ft = document.getElementById('p_ftype');
      const fill = () => { ft.innerHTML = '<option value="">All types</option>' +
        (IDX.hdb_towns[town.value] || []).map(t => `<option>${t}</option>`).join(''); };
      town.onchange = fill; fill();
    }
    if (mode === 'mop') {
      C.getJSON('mop_targets.json').then(d => {
        MOP = d; const sel = document.getElementById('p_mtown');
        if (sel) sel.innerHTML = Object.keys(d.towns).sort().map(t => `<option value="${t}">${Narrative.titleCase(t)}</option>`).join('');
      });
    }
    document.getElementById('p_go').onclick = run;
  }

  async function run() {
    const out = document.getElementById('prospectResult');
    out.innerHTML = `<div class="empty-state"><div class="spinner"></div><p>Scanning latest caveats…</p></div>`;
    try { mode === 'hdb' ? await runHdb(out) : mode === 'condo' ? await runCondo(out) : await runMop(out); }
    catch (e) { out.innerHTML = `<div class="empty-state"><p class="err">${e.message}</p></div>`; }
  }

  async function runHdb(out) {
    const town = val('p_town'), ft = val('p_ftype');
    let rows = await C.hdbTown(town);
    if (ft) rows = rows.filter(r => r.flat_type === ft);
    rows = rows.sort((a, b) => b.yymm.localeCompare(a.yymm)).slice(0, 12);
    const area = Narrative.titleCase(town);
    render(out, area, rows.map(r => ({
      title: `Blk ${r.block} ${Narrative.titleCase(r.street)}`,
      sub: `${Narrative.titleCase(r.flat_type)} · ${Math.round(r.area_sqm * C.SQM_SQF)} sqft · ${mLabel(r.yymm)}`,
      price: r.price, psf: r.psf,
      txn: { flat_type: r.flat_type, block: r.block, price: r.price, psf: r.psf },
    })), area);
  }

  async function runCondo(out) {
    const d = val('p_district');
    let rows = await C.condoDistrict(d);
    rows = rows.sort((a, b) => b.yymm.localeCompare(a.yymm)).slice(0, 12);
    const area = `District ${d}`;
    render(out, area, rows.map(r => ({
      title: Narrative.titleCase(r.project),
      sub: `${r.ptype} · ${Math.round(r.area_sqm * C.SQM_SQF)} sqft · #${String(r.floor_mid || '').padStart(2, '0')} · ${mLabel(r.yymm)}`,
      price: r.price, psf: r.psf,
      txn: { ptype: r.ptype, price: r.price, psf: r.psf },
    })), area);
  }

  async function runMop(out) {
    if (!MOP) MOP = await C.getJSON('mop_targets.json');
    const town = val('p_mtown');
    const blocks = MOP.towns[town] || [];  // [block, street, lease_commence, sales, avgp]
    if (!blocks.length) { out.innerHTML = `<div class="empty-state"><p>No recently-MOP blocks found for ${Narrative.titleCase(town)}.</p></div>`; return; }
    out.innerHTML = `
      <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px">
        <h2 style="font-family:var(--serif);font-size:22px">MOP targets · ${Narrative.titleCase(town)}</h2>
        <span class="hint">${blocks.length} blocks reaching 5-yr MOP</span></div>
      <div class="txn-list">${blocks.slice(0, 30).map(b => `
        <div class="txn">
          <div><div class="tx-main">Blk ${b[0]} ${Narrative.titleCase(b[1])}</div>
            <div class="tx-sub">Lease from ${b[2]} · ${b[3]} recent ${b[3] === 1 ? 'sale' : 'sales'}</div></div>
          <div><div class="tx-price" style="font-size:18px">${C.fmtMoney(b[4])}</div><div class="tx-psf">avg recent price</div></div>
        </div>`).join('')}</div>
      <p class="pulse-foot" style="margin-top:16px">Proxy: blocks whose 99-year lease started ${MOP.mop_window}, BTOs handed over ~5 years ago, so owners are newly eligible to sell. Confirm each owner's exact MOP date.</p>`;
  }

  function render(out, area, items, areaName) {
    if (!items.length) { out.innerHTML = `<div class="empty-state"><p>No recent transactions found here.</p></div>`; return; }
    out.innerHTML = `
      <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px">
        <h2 style="font-family:var(--serif);font-size:22px">Recent sales · ${area}</h2>
        <span class="hint">${items.length} latest transactions</span>
      </div>
      <div class="txn-list">${items.map((it, i) => card(it, i, areaName)).join('')}</div>`;
    items.forEach((it, i) => {
      const btn = document.getElementById('pd' + i);
      btn.onclick = () => {
        const d = document.getElementById('draft' + i);
        if (!d.dataset.filled) { d.textContent = Narrative.outreach(it.txn, areaName); d.dataset.filled = '1'; }
        d.classList.toggle('show');
        btn.textContent = d.classList.contains('show') ? 'Hide message' : 'Draft outreach';
      };
      const cp = document.getElementById('cp' + i);
      cp.onclick = async () => {
        const d = document.getElementById('draft' + i);
        if (!d.dataset.filled) { d.textContent = Narrative.outreach(it.txn, areaName); d.dataset.filled = '1'; d.classList.add('show'); }
        try { await navigator.clipboard.writeText(d.textContent); cp.innerHTML = '<span class="copy-ok">✓ Copied</span>'; setTimeout(() => cp.textContent = 'Copy', 1500); } catch (e) {}
      };
    });
  }

  function card(it, i) {
    return `<div class="txn">
      <div><div class="tx-main">${it.title}</div><div class="tx-sub">${it.sub}</div></div>
      <div><div class="tx-price">${C.fmtMoney(it.price)}</div><div class="tx-psf">$${Math.round(it.psf)} psf</div></div>
      <div class="txn-foot">
        <button class="btn-ghost" id="pd${i}">Draft outreach</button>
        <button class="btn-ghost" id="cp${i}">Copy</button>
        <div class="draft" id="draft${i}"></div>
      </div></div>`;
  }

  const val = id => (document.getElementById(id) || {}).value || '';
  const mLabel = yymm => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+yymm.slice(2) - 1] + " '" + yymm.slice(0, 2);

  return { init };
})();
