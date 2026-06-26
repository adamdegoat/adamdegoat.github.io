/* Caveat — CMA deck tool. */
const CMA = (() => {
  const C = Caveat; let IDX = null; let mode = 'hdb';

  // sqm/sqft input toggle — engine always works in sqm; choice is remembered.
  const areaUnit = () => localStorage.getItem('caveat_area_unit') || (mode === 'condo' ? 'sqft' : 'sqm');
  const toSqm = v => (areaUnit() === 'sqft' && v ? v / C.SQM_SQF : v);
  function wireAreaUnit() {
    const el = document.getElementById('f_area_unit'); if (!el) return;
    el.textContent = areaUnit();
    el.onclick = () => {
      const next = areaUnit() === 'sqm' ? 'sqft' : 'sqm';
      const inp = document.getElementById('f_area'), v = parseFloat(inp.value);
      if (!isNaN(v) && v > 0) inp.value = next === 'sqft' ? Math.round(v * C.SQM_SQF) : +(v / C.SQM_SQF).toFixed(1);
      localStorage.setItem('caveat_area_unit', next);
      el.textContent = next;
    };
  }

  function init(idx) { IDX = idx; renderForm(); }

  const townOpts = () => Object.keys(IDX.hdb_towns).sort()
    .map(t => `<option value="${t}">${Narrative.titleCase(t)}</option>`).join('');

  const MODES = [['hdb', 'HDB'], ['condo', 'Condo'], ['landed', 'Landed'], ['newlaunch', 'New launch']];
  const fieldsFor = { hdb: hdbFields, condo: condoFields, landed: landedFields, newlaunch: newLaunchFields };
  const wireFor = { hdb: wireHdb, condo: wireCondo, landed: wireLanded, newlaunch: wireNewLaunch };
  const goLabel = { hdb: 'Generate valuation', condo: 'Generate valuation',
    landed: 'Show landed reference', newlaunch: 'Show launch benchmark' };

  function renderForm() {
    const el = document.getElementById('cmaForm');
    el.innerHTML = `
      <div class="seg seg-wrap" id="cmaSeg">
        ${MODES.map(([m, l]) => `<button data-m="${m}" class="${mode === m ? 'on' : ''}">${l}</button>`).join('')}
      </div>
      <div id="cmaFields">${fieldsFor[mode]()}</div>
      <button class="btn-primary" id="cmaGo">${goLabel[mode]}</button>
      <p class="field-err err" id="cmaErr" style="display:none;margin-top:12px"></p>`;
    el.querySelectorAll('#cmaSeg button').forEach(b => b.onclick = () => { mode = b.dataset.m; renderForm(); });
    (wireFor[mode] || (() => {}))();
    wireAreaUnit();
    document.getElementById('cmaGo').onclick = generate;
  }

  function hdbFields() {
    return `
      <div class="field ac-wrap"><label>Address — street or estate <span style="font-weight:500;color:var(--ink-3)">· type &amp; pick from the list</span></label>
        <input id="f_street" autocomplete="off" placeholder="e.g. Potong Pasir Ave 1">
        <input type="hidden" id="f_town">
        <div class="ac-list" id="f_streetac" style="display:none"></div></div>
      <div class="field two">
        <div><label>Block</label><input id="f_block" placeholder="148"></div>
        <div><label>Flat type</label><select id="f_ftype"><option value="">Pick a street first</option></select></div>
      </div>
      <div class="field two">
        <div><label>Floor area <span style="font-weight:500;color:var(--ink-3)">· optional</span></label><input id="f_area" type="number" inputmode="decimal" placeholder="typical"><span class="suffix" id="f_area_unit" role="button" tabindex="0" title="Tap to switch sqm / sqft" style="cursor:pointer;text-decoration:underline dotted">sqm</span></div>
        <div><label>Storey <span style="font-weight:500;color:var(--ink-3)">· optional</span></label><input id="f_storey" type="number" inputmode="numeric" placeholder="any"></div>
      </div>
      <div class="field"><label>Lease remaining <span style="font-weight:500;color:var(--ink-3)">· optional</span></label>
        <input id="f_lease" type="number" inputmode="numeric" placeholder="62"><span class="suffix">yrs</span></div>
      <p class="hint">Just the address &amp; flat type is enough — add floor area, storey or lease to sharpen the estimate.</p>`;
  }
  async function wireHdb() {
    const townH = document.getElementById('f_town'), ft = document.getElementById('f_ftype');
    const inp = document.getElementById('f_street'), ac = document.getElementById('f_streetac');
    let STREETS = null;
    const fillTypes = tn => { ft.innerHTML = (IDX.hdb_towns[tn] || []).map(t => `<option>${t}</option>`).join('') || '<option value="">No data</option>'; };
    // search a street/estate → resolves the HDB town behind the scenes (Potong Pasir → Toa Payoh)
    inp.oninput = async () => {
      townH.value = ''; ft.innerHTML = '<option value="">Pick a street first</option>';
      const q = inp.value.trim().toUpperCase();
      if (q.length < 3) { ac.style.display = 'none'; return; }
      if (!STREETS) STREETS = await C.hdbStreets();
      const hits = STREETS.filter(s => s.street.includes(q)).slice(0, 8);
      if (!hits.length) { ac.style.display = 'none'; return; }
      ac.innerHTML = hits.map(s => `<div data-st="${escAttr(s.street)}" data-tn="${escAttr(s.town)}">
        ${Narrative.titleCase(s.street)} <span class="ac-meta">· ${Narrative.titleCase(s.town)}</span></div>`).join('');
      ac.style.display = 'block';
      ac.querySelectorAll('div').forEach(d => d.onclick = () => {
        inp.value = Narrative.titleCase(d.dataset.st);
        townH.value = d.dataset.tn; fillTypes(d.dataset.tn);
        ac.style.display = 'none';
      });
    };
    document.addEventListener('click', e => { if (!ac.contains(e.target) && e.target !== inp) ac.style.display = 'none'; });
  }

  function condoFields() {
    return `
      <div class="field ac-wrap"><label>Project</label>
        <input id="f_project" autocomplete="off" placeholder="Start typing a condo name…">
        <input type="hidden" id="f_projmeta">
        <div class="ac-list" id="f_ac" style="display:none"></div>
      </div>
      <div class="field two">
        <div><label>Floor area <span style="font-weight:500;color:var(--ink-3)">· optional</span></label><input id="f_area" type="number" inputmode="decimal" placeholder="your unit"><span class="suffix" id="f_area_unit" role="button" tabindex="0" title="Tap to switch sqm / sqft" style="cursor:pointer;text-decoration:underline dotted">sqm</span></div>
        <div><label>Floor level <span style="font-weight:500;color:var(--ink-3)">· optional</span></label><input id="f_floor" type="number" inputmode="numeric" placeholder="any"></div>
      </div>
      <div class="field"><div id="f_projinfo" class="hint"></div></div>
      <p class="hint">Just the project name works — but condo prices swing a lot by size, so <b>add your floor area</b> for an accurate figure (without it you'll get a rough typical-unit estimate).</p>`;
  }
  function wireCondo() {
    const inp = document.getElementById('f_project'), ac = document.getElementById('f_ac');
    const meta = document.getElementById('f_projmeta'), info = document.getElementById('f_projinfo');
    inp.oninput = () => {
      const q = inp.value.trim().toUpperCase(); meta.value = ''; info.textContent = '';
      if (q.length < 2) { ac.style.display = 'none'; return; }
      const hits = IDX.condo_projects.filter(p => p[0].includes(q)).slice(0, 8);
      if (!hits.length) { ac.style.display = 'none'; return; }
      ac.innerHTML = hits.map(p => `<div data-p='${escAttr(JSON.stringify(p))}'>
        ${Narrative.titleCase(p[0])} <span class="ac-meta">· D${p[1]} ${p[2]} ${p[4] ? 'Freehold' : ''}</span></div>`).join('');
      ac.style.display = 'block';
      ac.querySelectorAll('div').forEach(d => d.onclick = () => {
        const p = JSON.parse(d.getAttribute('data-p'));
        inp.value = Narrative.titleCase(p[0]); meta.value = JSON.stringify(p); ac.style.display = 'none';
        info.textContent = `District ${p[1]} · ${p[2]} · ${p[3]} · ${p[4] ? 'Freehold' : 'Leasehold'}`;
      });
    };
    document.addEventListener('click', e => { if (!ac.contains(e.target) && e.target !== inp) ac.style.display = 'none'; });
  }

  function err(msg) { const e = document.getElementById('cmaErr'); e.textContent = msg; e.style.display = 'block'; }
  function clearErr() { document.getElementById('cmaErr').style.display = 'none'; }

  async function generate() {
    clearErr();
    const btn = document.getElementById('cmaGo'); btn.disabled = true; btn.textContent = 'Working…';
    const res = document.getElementById('cmaResult');
    res.innerHTML = `<div class="empty-state"><div class="spinner"></div><p>Pulling data…</p></div>`;
    try {
      if (mode === 'hdb') await genHdb(res);
      else if (mode === 'condo') await genCondo(res);
      else if (mode === 'landed') await genLanded(res);
      else await genNewLaunch(res);
    } catch (e) {
      res.innerHTML = `<div class="empty-state"><p class="err">${e.message}</p></div>`;
    }
    btn.disabled = false; btn.textContent = goLabel[mode];
  }

  // ===================== LANDED (reference only) =====================
  const LANDED_TYPES = ['Terrace', 'Semi-detached', 'Detached', 'Strata Terrace', 'Strata Semi-detached', 'Strata Detached'];
  function landedFields() {
    return `
      <div class="field ac-wrap"><label>Street or area <span style="font-weight:500;color:var(--ink-3)">· type &amp; pick from the list</span></label>
        <input id="l_street" autocomplete="off" placeholder="e.g. Alnwick Road">
        <input type="hidden" id="l_meta">
        <div class="ac-list" id="l_streetac" style="display:none"></div></div>
      <div class="field"><label>Landed type</label><select id="l_type">
        <option value="">All landed</option><option>Terrace</option><option>Semi-detached</option><option>Detached</option></select></div>
      <p class="hint">Search a street to see recent landed sales there, with the surrounding area for context. Landed prices swing widely with land size, tenure &amp; plot — these are <b>reference transactions</b>, not a single estimate.</p>`;
  }
  async function wireLanded() {
    const inp = document.getElementById('l_street'), ac = document.getElementById('l_streetac'), meta = document.getElementById('l_meta');
    if (!inp) return;
    let LS = null;
    inp.oninput = async () => {
      meta.value = '';
      const q = inp.value.trim().toUpperCase();
      if (q.length < 2) { ac.style.display = 'none'; return; }
      if (!LS) LS = await C.landedStreets();
      const hits = LS.filter(s => s.street.includes(q)).sort((a, b) => b.n - a.n).slice(0, 8);
      if (!hits.length) { ac.style.display = 'none'; return; }
      ac.innerHTML = hits.map(s => `<div data-st="${escAttr(s.street)}" data-d="${s.district}">
        ${Narrative.titleCase(s.street)} <span class="ac-meta">· D${s.district} · ${s.n} sale${s.n > 1 ? 's' : ''}</span></div>`).join('');
      ac.style.display = 'block';
      ac.querySelectorAll('div').forEach(d => d.onclick = () => {
        inp.value = Narrative.titleCase(d.dataset.st);
        meta.value = JSON.stringify([d.dataset.st, d.dataset.d]);
        ac.style.display = 'none';
      });
    };
    document.addEventListener('click', e => { if (!ac.contains(e.target) && e.target !== inp) ac.style.display = 'none'; });
  }
  async function genLanded(res) {
    let meta = val('l_meta');
    if (!meta) {  // typed but didn't tap — auto-resolve an exact street match
      const typed = val('l_street').trim().toUpperCase();
      const LS = await C.landedStreets();
      const hit = typed && LS.find(s => s.street === typed);
      if (hit) meta = JSON.stringify([hit.street, hit.district]);
      else throw new Error('Pick a street from the dropdown.');
    }
    const [street, d] = JSON.parse(meta), type = val('l_type'), streetU = street.toUpperCase();
    let area = (await C.condoDistrict(d)).filter(r => LANDED_TYPES.includes(r.ptype));
    if (type) area = area.filter(r => r.ptype === type || r.ptype === 'Strata ' + type);
    const rows = area.filter(r => (r.street || '').toUpperCase() === streetU);
    if (rows.length < 1) throw new Error(`No recent ${type || 'landed'} sales on ${Narrative.titleCase(street)} — try the "All landed" type or another street.`);
    rows.sort((a, b) => b.yymm.localeCompare(a.yymm));
    const prices = rows.map(r => r.price), psfs = rows.map(r => r.psf);
    const aPrices = area.map(r => r.price), aPsf = area.map(r => r.psf);
    res.innerHTML = `<div class="deck" id="deck">
      <div class="deck-top"><div class="dt-row"><div>
        <div class="deck-kicker">Landed reference · ${Narrative.titleCase(street)}</div>
        <div class="deck-addr">${type || 'All landed'} · District ${d}</div>
        <div class="deck-sub">${rows.length} sale${rows.length > 1 ? 's' : ''} on this street · last 18 months</div></div>
        <div class="chip lower"><span class="chip-dot"></span>Reference only</div></div></div>
      <div class="ref-banner">⚠ Landed homes vary enormously by land size, tenure and plot — there is no reliable single price-per-sqft. These are <b>actual recent transactions</b> to anchor your own judgement, not a valuation.</div>
      <div class="estimate" style="grid-template-columns:1fr 1fr 1fr">
        <div><div class="est-label">Median price · this street</div><div class="est-figure" style="font-size:30px">${C.fmtMoney(C.median(prices))}</div></div>
        <div><div class="est-label">Median land PSF</div><div class="est-figure" style="font-size:30px">$${Math.round(C.median(psfs))}</div></div>
        <div><div class="est-label">Price range</div><div class="est-figure" style="font-size:22px">${C.fmtK(Math.min(...prices))}–${C.fmtK(Math.max(...prices))}</div></div>
      </div>
      <p class="hint" style="margin:2px 0 0">Wider area — District ${d} ${type || 'landed'}: median <b>${C.fmtMoney(C.median(aPrices))}</b> at <b>$${Math.round(C.median(aPsf))} psf</b> across ${area.length} recent sale${area.length > 1 ? 's' : ''}.</p>
      <div class="deck-section"><h4>Recent sales on ${Narrative.titleCase(street)}</h4>
        <table class="comps"><thead><tr><th>Type</th><th class="hide-sm">Month</th>
          <th style="text-align:right">Land area</th><th style="text-align:right">PSF</th><th style="text-align:right">Price</th></tr></thead>
        <tbody>${rows.slice(0, 14).map(r => `<tr>
          <td>${r.ptype}</td><td class="hide-sm">${mLabel(r.yymm)}</td>
          <td class="num">${Math.round(r.area_sqm * C.SQM_SQF)} sf</td><td class="num">$${Math.round(r.psf)}</td><td class="num">${C.fmtK(r.price)}</td></tr>`).join('')}</tbody></table>
        <p class="hint" style="margin-top:10px">PSF is on strata/land area as filed with URA. Showing ${Math.min(rows.length, 14)} most recent of ${rows.length}.</p></div>
      <div class="deck-disc">${window.__freshness ? `Transactions current as of ${window.__freshness.built}. ` : ''}Reference transactions from URA caveats — not a valuation or guarantee of price.</div>
    </div>`;
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===================== NEW LAUNCH (benchmark only) =====================
  let NL = null;
  function newLaunchFields() {
    return `
      <div class="field ac-wrap"><label>New-launch project</label>
        <input id="nl_project" autocomplete="off" placeholder="Start typing a launch…">
        <input type="hidden" id="nl_meta"><div class="ac-list" id="nl_ac" style="display:none"></div></div>
      <p class="hint">New launches are <b>developer-priced</b>. Caveat shows the <b>recent new-sale benchmark</b> — actual transacted prices — not a market valuation.</p>`;
  }
  async function wireNewLaunch() {
    if (!NL) NL = C.expand(await C.getJSON('new_launch.json'));  // already sorted recency→volume
    const inp = document.getElementById('nl_project'), ac = document.getElementById('nl_ac'), meta = document.getElementById('nl_meta');
    if (!inp) return;
    const show = list => {
      if (!list.length) { ac.style.display = 'none'; return; }
      ac.innerHTML = list.map(p => `<div data-p='${escAttr(JSON.stringify(p))}'>${p.project}
        <span class="ac-meta">· D${p.district} ${p.seg} · $${p.median_psf} psf</span></div>`).join('');
      ac.style.display = 'block';
      ac.querySelectorAll('div').forEach(dv => dv.onclick = () => {
        const p = JSON.parse(dv.getAttribute('data-p')); inp.value = p.project; meta.value = JSON.stringify(p); ac.style.display = 'none';
      });
    };
    const update = () => {
      const q = inp.value.trim().toUpperCase(); meta.value = '';
      show(q.length === 0 ? NL.slice(0, 14) : NL.filter(p => p.project.toUpperCase().includes(q)).slice(0, 12));
    };
    inp.onfocus = update;   // click the box → recent launches appear
    inp.oninput = update;
    document.addEventListener('click', e => { if (!ac.contains(e.target) && e.target !== inp) ac.style.display = 'none'; });
  }
  async function genNewLaunch(res) {
    const meta = val('nl_meta'); if (!meta) throw new Error('Pick a launch from the list.');
    const p = JSON.parse(meta);
    const seg = (window.__pulse ? window.__pulse.private_segments : []).find(s => s.seg === p.seg);
    const vs = seg ? Math.round((p.median_psf - seg.median_psf) / seg.median_psf * 100) : null;
    res.innerHTML = `<div class="deck" id="deck">
      <div class="deck-top"><div class="dt-row"><div>
        <div class="deck-kicker">New-launch benchmark</div>
        <div class="deck-addr">${p.project}</div>
        <div class="deck-sub">District ${p.district} · ${p.seg} · last sale ${mLabel(p.last)}</div></div>
        <div class="chip medium"><span class="chip-dot"></span>Benchmark</div></div></div>
      <div class="ref-banner">New launches are priced by the developer, not the resale market. This is the <b>benchmark of actual new-sale transactions</b> at this project — useful context for pricing, not an independent valuation.</div>
      <div class="estimate" style="grid-template-columns:1fr 1fr 1fr">
        <div><div class="est-label">Median new-sale PSF</div><div class="est-figure" style="font-size:32px">$${p.median_psf}</div></div>
        <div><div class="est-label">Median price</div><div class="est-figure" style="font-size:26px">${C.fmtK(p.median_price)}</div></div>
        <div><div class="est-label">Units transacted</div><div class="est-figure" style="font-size:32px">${p.txns}</div></div>
      </div>
      ${seg ? `<div class="deck-section"><h4>Versus the ${p.seg} resale market</h4>
        <p style="font-size:14.5px;color:var(--ink-2);line-height:1.6">At <b>$${p.median_psf} psf</b>, ${p.project} is benchmarking
        <b style="color:${vs >= 0 ? 'var(--rose)' : 'var(--brand-d)'}">${vs >= 0 ? vs + '% above' : Math.abs(vs) + '% below'}</b>
        the ${seg.label} resale median of $${seg.median_psf} psf — typical of the new-launch premium over comparable resale stock.</p></div>` : ''}
      <div class="deck-disc">${window.__freshness ? `Current as of ${window.__freshness.built}. ` : ''}New-sale transactions from URA over the last 30 months — developer-priced benchmark, not a valuation.</div>
    </div>`;
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function genHdb(res) {
    const town = val('f_town'), ft = val('f_ftype'), area = toSqm(+val('f_area')),
      storey = +val('f_storey'), leaseY = +val('f_lease'), block = val('f_block'), street = val('f_street');
    if (!town || !street) throw new Error('Search an address and pick it from the list first.');
    if (!ft) {
      const sel = document.getElementById('f_ftype');
      throw new Error(sel && sel.options.length <= 1
        ? 'No HDB sales on record for this street — try a nearby street or estate.'
        : 'Pick the flat type.');
    }
    const rows = await C.hdbTown(town);
    const subj = { flat_type: ft, area_sqm: area || null, storey_mid: storey || null,
      rem_lease_mths: leaseY ? Math.round(leaseY * 12) : null,
      street: street ? street.toUpperCase() : null, block: block || null, town };
    const r = Engines.hdbEstimate(rows, subj);
    if (!r.ok) throw new Error(r.reason);
    // HDB gross yield (median rent for this flat type in this town)
    try {
      const rd = ((await C.hdbRent())[town] || {})[ft];  // [median_rent, n, trend]
      if (rd) r.rental = { est_rent: rd[0], n: rd[1], trend: rd[2],
        yield: +(rd[0] * 12 / r.estimate_price * 100).toFixed(1),
        basis: `${Narrative.titleCase(ft)} flats in ${Narrative.titleCase(town)}` };
    } catch (e) {}
    // amenities + coords (geocode block+street or street)
    let amen = null, addr = `${Narrative.titleCase(ft)} · ${Narrative.titleCase(town)}`, sloc = null, svy = null;
    if (street) {
      try {
        const g = await C.geocode(`${block} ${street}`.trim());
        if (g && g.svy_x) { amen = await C.nearby(g.svy_x, g.svy_y, { maxEach: 1 }); addr = g.address ? shortAddr(g.address) : addr; sloc = { lat: g.lat, lng: g.lng }; svy = { x: g.svy_x, y: g.svy_y };
          try { r.schools = await C.nearbyBand(g.svy_x, g.svy_y, 'school', [1, 2]); } catch (e) {} }
      } catch (e) {}
    }
    renderDeck(res, 'hdb', { ...subj, town, locationName: addr, lat: sloc && sloc.lat, lng: sloc && sloc.lng, svy_x: svy && svy.x, svy_y: svy && svy.y }, r, amen);
  }

  async function genCondo(res) {
    let meta = val('f_projmeta');
    if (!meta) {  // typed a name but didn't tap the dropdown — auto-resolve an exact match
      const typed = val('f_project').trim().toUpperCase();
      const hit = typed && IDX.condo_projects.find(p => p[0] === typed);
      if (hit) meta = JSON.stringify(hit);
      else throw new Error('Pick the matching project from the dropdown.');
    }
    const p = JSON.parse(meta); const area = toSqm(+val('f_area')), floor = +val('f_floor');
    const rows = await C.condoDistrict(p[1]);
    const subj = { project: p[0], district: p[1], seg: p[2], ptype: p[3], tenure_fh: p[4],
      area_sqm: area || null, floor_mid: floor || null };
    const r = Engines.condoEstimate(rows, subj);
    if (!r.ok) throw new Error(r.reason);
    // rental + gross yield (if the project has enough recent leases)
    try {
      const rd = (await C.rentals())[p[0]];  // [median_rent_psf, median_rent, n_leases, trend]
      if (rd) {
        const estRent = Math.round(rd[0] * area * C.SQM_SQF);
        r.rental = { est_rent: estRent, n: rd[2], trend: rd[3],
          yield: +(estRent * 12 / r.estimate_price * 100).toFixed(1),
          basis: `recent leases in ${Narrative.titleCase(p[0])}` };
      }
    } catch (e) {}
    // amenities + subject location from any same-project caveat's coords
    let amen = null, sloc = null;
    const pr = rows.find(x => x.project === p[0] && x.x);
    if (pr) { try { amen = await C.nearby(pr.x, pr.y, { maxEach: 1 }); r.schools = await C.nearbyBand(pr.x, pr.y, 'school', [1, 2]); } catch (e) {} sloc = SVY21.toLatLng(pr.x, pr.y); }
    renderDeck(res, 'condo', { ...subj, locationName: Narrative.titleCase(p[0]), lat: sloc && sloc[0], lng: sloc && sloc[1], svy_x: pr && pr.x, svy_y: pr && pr.y }, r, amen);
  }

  // ---------- render deck ----------
  function renderDeck(res, kind, subj, r, amen) {
    const pr = App.getProfile() || {};
    const color = pr.color || getCss('--brand');
    const sub = kind === 'hdb'
      ? `${Narrative.titleCase(subj.flat_type)} · ${r.area_assumed ? '~' : ''}${r.area_sqf} sqft${r.area_assumed ? ' (typical)' : ''} · ${C.leaseYears(subj.rem_lease_mths) || 'lease n/a'}${subj.rem_lease_mths ? ' yrs lease' : ''}`
      : `${subj.seg} · D${subj.district} · ${r.area_assumed ? '~' : ''}${r.area_sqf} sqft${r.area_assumed ? ' (typical)' : ''} · ${subj.tenure_fh ? 'Freehold' : 'Leasehold'}`;
    const cc = r.confidence.toLowerCase();
    const paras = Narrative.cma(kind, subj, r, amen);
    const blockMsg = (kind === 'hdb' && subj.block)
      ? (r.tier === 'block'
          ? `✓ Based on ${r.block_n} recent sale${r.block_n > 1 ? 's' : ''} at Blk ${subj.block}`
          : (r.block_n > 0
              ? `Only ${r.block_n} recent ${subj.flat_type.toLowerCase()} sale${r.block_n > 1 ? 's' : ''} at Blk ${subj.block} — estimate uses ${r.n_comps} nearby ${r.scope} sales`
              : `No recent ${subj.flat_type.toLowerCase()} sales at Blk ${subj.block} — estimate uses ${r.n_comps} nearby ${r.scope} sales`))
      : '';
    const leaseMsg = (kind === 'hdb' && r.lease_lo && r.lease_hi && (r.lease_hi - r.lease_lo) >= 10)
      ? `comparables span ${r.lease_lo}–${r.lease_hi} yrs lease — shorter-lease units sit at the lower end` : '';
    const areaMsg = r.area_assumed ? '⚠ Rough estimate for a typical unit in this project — enter your floor area for an accurate figure' : '';
    const rspan = Math.max(1, (r.obs_high || 0) - (r.obs_low || 0));
    const midPct = Math.max(8, Math.min(92, Math.round((r.estimate_price - (r.obs_low || r.estimate_price)) / rspan * 100)));

    res.innerHTML = `<div class="deck" id="deck">
      <div class="print-cover">
        <div><div class="pc-brand">◆ Caveat</div><div class="pc-sub">Singapore Property Intelligence</div></div>
        <div class="pc-agent">Prepared by <b>${pr.name || '—'}</b>${pr.cea ? ' · ' + pr.cea : ''}${pr.agency ? '<br>' + pr.agency : ''}${pr.phone ? ' · ' + pr.phone : ''}${window.__freshness ? '<br><span style="color:#888">Data current ' + window.__freshness.built + '</span>' : ''}</div>
      </div>
      <div class="deck-top">
        <div class="dt-row">
          <div>
            <div class="deck-kicker">Comparable Market Analysis</div>
            <div class="deck-addr">${subj.locationName}</div>
            <div class="deck-sub">${sub}</div>
            ${blockMsg ? `<div class="deck-sub" style="color:var(--brand-d);font-weight:600;margin-top:4px">${blockMsg}</div>` : ''}
            ${areaMsg ? `<div class="deck-sub" style="color:var(--amber,#c98a16);font-weight:600;margin-top:4px">${areaMsg}</div>` : ''}
          </div>
          <div class="chip ${cc}"><span class="chip-dot"></span>${r.confidence} confidence</div>
        </div>
      </div>

      <div class="estimate">
        <div class="est-main">
          <div class="est-label">Indicative value</div>
          <div class="est-figure" style="color:${getCss('--ink')}">${C.fmtMoney(r.estimate_price)}</div>
          <div class="est-psf">≈ ${C.fmtPsf(r.estimate_psf)} · ${r.n_comps} comparables</div>
          <div class="band">
            <div class="band-track">
              <div class="band-fill" style="left:8%;right:8%;background:linear-gradient(90deg,${color},${App.shade(color, -18)})"></div>
              <div class="band-mid" style="left:${midPct}%"></div>
            </div>
            <div class="band-ends"><span>${C.fmtMoney(r.obs_low)}</span><span>${C.fmtMoney(r.obs_high)}</span></div>
          </div>
          <div class="est-rangenote" style="font-size:12.5px;color:var(--ink-2);line-height:1.5;margin-top:9px">Comparable units sold between <b>${C.fmtMoney(r.obs_low)}</b> and <b>${C.fmtMoney(r.obs_high)}</b>${leaseMsg ? ` · ${leaseMsg}` : ''}.</div>
        </div>
        <div class="est-side">
          <div class="fact"><span class="k">Likely range</span><span class="v" style="font-size:12.5px">${C.fmtK(r.obs_low)}–${C.fmtK(r.obs_high)}</span></div>
          <div class="fact"><span class="k">Comparables used</span><span class="v">${r.n_comps}</span></div>
          <div class="fact"><span class="k">Price agreement</span><span class="v">${cvWord(r.cv)}</span></div>
          ${r.scope ? `<div class="fact"><span class="k">Comp basis</span><span class="v" style="font-size:12px">${r.scope}</span></div>` : ''}
          ${r.rental ? `<div class="fact"><span class="k">Est. gross yield</span><span class="v" style="color:var(--brand-d)">~${r.rental.yield}%</span></div>` : ''}
        </div>
      </div>

      <div class="deck-section">
        <h4>Per-sqft price trend</h4>
        ${chartSVG(r.trend, color)}
      </div>

      <div class="deck-section">
        <h4>Comparable transactions</h4>
        ${compsTable(kind, r.comps)}
      </div>

      ${amen ? `<div class="deck-section"><h4>Location &amp; amenities</h4>${amenRow(amen)}</div>` : ''}

      ${r.rental ? `<div class="deck-section"><h4>Rental snapshot</h4>
        <div class="rental-snap">
          <div class="rs-cell"><div class="rs-v">${C.fmtMoney(r.rental.est_rent)}<span>/mo</span></div><div class="rs-k">Est. monthly rent</div></div>
          <div class="rs-cell hl"><div class="rs-v">~${r.rental.yield}%</div><div class="rs-k">Gross rental yield</div></div>
          <div class="rs-cell"><div class="rs-v" style="font-size:18px">${trendArrow(r.rental.trend)}</div><div class="rs-k">Rent trend · 6mo</div></div>
        </div>
        <p class="hint" style="margin-top:11px">From ${r.rental.n.toLocaleString()} ${r.rental.basis} (last ~5 quarters). Gross yield = estimated annual rent ÷ estimated price, before costs &amp; vacancy.</p></div>` : ''}

      ${schoolSection(r.schools)}

      ${subj.lat ? `<div class="deck-section"><h4>On the map</h4><div id="deckMap" class="deck-map"></div></div>` : ''}

      <div class="deck-section narrative">
        <h4>Summary</h4>${paras.map(p => `<p>${p}</p>`).join('')}
      </div>

      <div class="deck-foot">
        <div class="agent-card">
          <div class="ac-av" style="background:linear-gradient(135deg,${color},${App.shade(color, -20)})">${App.initials(pr.name)}</div>
          <div><div class="acn">${pr.name || 'Your name'}</div>
          <div class="acm">${[pr.agency, pr.cea, pr.phone].filter(Boolean).join(' · ') || 'Set up your profile →'}</div></div>
        </div>
        <button class="btn-ghost" onclick="window.print()">Export PDF</button>
        <button class="btn-primary" style="width:auto;margin:0;padding:11px 18px" onclick="CMA.regen()">New valuation</button>
      </div>
      <div class="deck-disc">${window.__freshness ? `Comparables current as of ${window.__freshness.built} (data auto-refreshes weekly). ` : ''}Indicative estimate from recent comparable transactions — not a bank valuation or a guarantee of sale price. Generated by Caveat for the named agent, who is responsible for verifying it.</div>
    </div>`;
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (subj.lat) prepMap(kind, subj, r, amen, color);
  }

  // build the Leaflet map for the deck (async: HDB comps geocoded live)
  async function prepMap(kind, subj, r, amen, color) {
    const amenities = [];
    if (amen) for (const k in amen) amen[k].forEach(a => {
      if (a.x && a.y) amenities.push({ kind: k, name: a.name.replace(/\s*\(.*?\)/, ''),
        latlng: SVY21.toLatLng(a.x, a.y), label: amenLabel[k] || k, dist: a.dist });
    });
    // Comps are pinned only where we already hold coordinates (URA caveats carry
    // x/y). HDB comps have no coords and live-geocoding a batch trips OneMap's rate
    // limit, so HDB maps show the unit + amenities (comps are in the table below).
    let comps = [];
    if (kind === 'condo') {
      comps = r.comps.filter(c => c.x && c.y).slice(0, 14).map(c => ({
        latlng: SVY21.toLatLng(c.x, c.y), label: Narrative.titleCase(c.project),
        sub: `${mLabel(c.yymm)} · ${C.fmtK(c.price)} · $${Math.round(c.psf)} psf` }));
    }
    CaveatMap.render('deckMap', {
      subject: { latlng: [subj.lat, subj.lng], label: subj.locationName },
      comps, amenities, color });
  }

  // deep-link from Find: prefill the condo valuation form with a project
  function loadCondo(meta) {
    mode = 'condo'; renderForm();
    const inp = document.getElementById('f_project'); if (!inp) return;
    inp.value = Narrative.titleCase(meta[0]);
    document.getElementById('f_projmeta').value = JSON.stringify(meta);
    document.getElementById('f_projinfo').textContent =
      `District ${meta[1]} · ${meta[2]} · ${meta[3]} · ${meta[4] ? 'Freehold' : 'Leasehold'}`;
    document.getElementById('f_area').focus();
  }

  function regen() { document.getElementById('cmaResult').innerHTML =
    `<div class="empty-state"><div class="empty-mark"></div><p>Fill in a property on the left to generate its valuation deck.</p></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' }); }

  // ---------- bits ----------
  function chartSVG(trend, color) {
    if (trend.length < 2) return `<p class="hint">Not enough monthly data to chart.</p>`;
    const W = 640, H = 150, pad = { l: 6, r: 6, t: 14, b: 22 };
    const xs = trend.map((_, i) => pad.l + i * (W - pad.l - pad.r) / (trend.length - 1));
    const lo = Math.min(...trend.map(t => t.psf)), hi = Math.max(...trend.map(t => t.psf));
    const span = (hi - lo) || 1;
    const yOf = v => H - pad.b - (v - lo) / span * (H - pad.t - pad.b);
    const pts = trend.map((t, i) => `${xs[i].toFixed(1)},${yOf(t.psf).toFixed(1)}`);
    const area = `M${xs[0]},${H - pad.b} L${pts.join(' L')} L${xs[xs.length - 1]},${H - pad.b} Z`;
    const labelEvery = Math.ceil(trend.length / 6);
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs><linearGradient id="cvg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/>
      </linearGradient></defs>
      <path class="area" d="${area}" fill="url(#cvg)"/>
      <polyline class="line" points="${pts.join(' ')}" stroke="${color}"/>
      ${trend.map((t, i) => i % labelEvery === 0 || i === trend.length - 1
        ? `<circle class="dot" cx="${xs[i].toFixed(1)}" cy="${yOf(t.psf).toFixed(1)}" r="3" stroke="${color}"/>
           <text x="${xs[i].toFixed(1)}" y="${H - 6}" text-anchor="middle">${mLabel(t.yymm)}</text>` : '').join('')}
      <text x="2" y="11">$${hi}</text><text x="2" y="${H - pad.b}">$${lo}</text>
    </svg>`;
  }
  const mLabel = yymm => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+yymm.slice(2) - 1] + " '" + yymm.slice(0, 2);

  function compsTable(kind, comps) {
    const SHOWN = 20, win = kind === 'hdb' ? 15 : 18;
    const rows = comps.slice(0, SHOWN).map(c => kind === 'hdb' ? `<tr>
      <td>Blk ${c.block}${c.storey_mid ? ` <span style="color:var(--ink-3)">· #${c.storey_mid}</span>` : ''} <span class="hide-sm">${Narrative.titleCase(c.street).replace(/Ave /,'Ave ')}</span>${(c.flat_model || c.rem_lease_mths) ? `<div style="font-size:11px;color:var(--ink-3);margin-top:1px">${[c.flat_model, c.rem_lease_mths ? Math.round(c.rem_lease_mths / 12) + ' yr lease' : ''].filter(Boolean).join(' · ')}</div>` : ''}</td>
      <td>${mLabel(c.yymm)}</td>
      <td class="num">${Math.round(c.area_sqm * C.SQM_SQF)} sqft</td>
      <td class="num hide-sm">$${Math.round(c.psf)}</td>
      <td class="num adj">$${Math.round(c.adj_psf)}</td>
      <td class="num">${C.fmtK(c.price)}</td></tr>`
      : `<tr>
      <td>${Narrative.titleCase(c.project)}${c.floor_mid ? ` <span style="color:var(--ink-3)">· #${String(c.floor_mid).padStart(2, '0')}</span>` : ''}<div style="font-size:11px;color:var(--ink-3);margin-top:1px">${[c.tenure_fh ? 'Freehold' : (c.lease_left ? '~' + c.lease_left + ' yr left' : 'Leasehold'), ({ Condominium: 'Condo', 'Executive Condominium': 'EC', Apartment: 'Apt' }[c.ptype] || c.ptype)].filter(Boolean).join(' · ')}</div></td>
      <td>${mLabel(c.yymm)}</td>
      <td class="num">${Math.round(c.area_sqm * C.SQM_SQF)} sqft</td>
      <td class="num hide-sm">$${Math.round(c.psf)}</td>
      <td class="num adj">$${Math.round(c.adj_psf)}</td>
      <td class="num">${C.fmtK(c.price)}</td></tr>`).join('');
    return `<table class="comps"><thead><tr>
      <th>${kind === 'hdb' ? 'Block' : 'Project'}</th><th>Month</th>
      <th style="text-align:right">Size</th><th style="text-align:right" class="hide-sm">Raw psf</th>
      <th style="text-align:right">Adj psf</th><th style="text-align:right">Price</th>
      </tr></thead><tbody>${rows}</tbody></table>
      <p class="hint" style="margin-top:10px">Showing the ${Math.min(comps.length, SHOWN)} closest of ${comps.length} comparable${comps.length === 1 ? '' : 's'} used (last ${win} months), ranked by recency, size &amp; floor. “Adj psf” normalises each to the subject for time, ${kind === 'hdb' ? 'storey &amp; lease' : 'floor &amp; tenure'}. #floor is the band mid-point.</p>`;
  }

  const amenIcon = { mrt: '🚇', lrt: '🚈', school: '🎓', hawker: '🍜', park: '🌳' };
  const amenLabel = { mrt: 'MRT', lrt: 'LRT', school: 'School', hawker: 'Hawker', park: 'Park' };
  function amenRow(amen) {
    const order = ['mrt', 'lrt', 'school', 'hawker', 'park'];
    return `<div class="amen-row">${order.filter(k => amen[k]).map(k => {
      const a = amen[k][0];
      return `<div class="amen"><span class="ai">${amenIcon[k]}</span>
        <span><b>${a.name.replace(/\s*\(.*?\)/, '')}</b><br><span class="ad">${amenLabel[k]} · ${a.dist}m</span></span></div>`;
    }).join('')}</div>`;
  }

  function trendArrow(t) {
    if (t == null) return '<span style="color:var(--ink-3)">— flat</span>';
    if (t > 0.5) return `<span style="color:var(--brand-d)">▲ ${t}%</span>`;
    if (t < -0.5) return `<span style="color:var(--rose)">▼ ${Math.abs(t)}%</span>`;
    return `<span style="color:var(--slate)">≈ flat</span>`;
  }
  function schoolSection(s) {
    if (!s) return '';
    const prim = b => (s[b] || []).filter(x => x.level === 'PRIMARY');
    const w1 = prim(1), w2 = prim(2);
    if (!w1.length && !w2.length) return '';
    const chips = arr => arr.slice(0, 8).map(x =>
      `<span class="school-chip">${Narrative.titleCase(x.name).replace(/ Primary School/i, ' Pri')}<span> ${x.dist}m</span></span>`).join('');
    return `<div class="deck-section"><h4>Primary schools · P1 priority</h4>
      ${w1.length ? `<div class="school-band"><span class="sb-label">Within 1km</span><div class="school-chips">${chips(w1)}</div></div>` : ''}
      ${w2.length ? `<div class="school-band"><span class="sb-label">1–2 km</span><div class="school-chips">${chips(w2)}</div></div>` : ''}
      <p class="hint" style="margin-top:9px">Home-to-school distance sets Primary 1 registration priority (within 1km, then 1–2km).</p></div>`;
  }

  const val = id => (document.getElementById(id) || {}).value || '';
  const getCss = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const cvWord = cv => cv < 0.05 ? 'Very tight' : cv < 0.08 ? 'Tight' : cv < 0.11 ? 'Moderate' : 'Wide';
  const escAttr = s => s.replace(/'/g, '&#39;');
  const shortAddr = a => Narrative.titleCase(a.replace(/ SINGAPORE \d+$/, ''));

  return { init, regen, loadCondo };
})();
