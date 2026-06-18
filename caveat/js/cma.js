/* Caveat — CMA deck tool. */
const CMA = (() => {
  const C = Caveat; let IDX = null; let mode = 'hdb';

  function init(idx) { IDX = idx; renderForm(); regen(); }

  const townOpts = () => Object.keys(IDX.hdb_towns).sort()
    .map(t => `<option value="${t}">${Narrative.titleCase(t)}</option>`).join('');

  const MODES = [['hdb', 'HDB'], ['condo', 'Condo'], ['landed', 'Landed'], ['newlaunch', 'New launch']];
  const fieldsFor = { hdb: hdbFields, condo: condoFields, landed: landedFields, newlaunch: newLaunchFields };
  const wireFor = { hdb: wireHdb, condo: wireCondo, landed: () => {}, newlaunch: wireNewLaunch };
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
    document.getElementById('cmaGo').onclick = generate;
  }

  function hdbFields() {
    return `
      <div class="field"><label>Town <span style="font-weight:500;color:var(--ink-3)">· estate not listed (e.g. Potong Pasir)? type it in Street below ↓</span></label><select id="f_town">${townOpts()}</select></div>
      <div class="field"><label>Flat type</label><select id="f_ftype"></select></div>
      <div class="field two">
        <div><label>Floor area</label><input id="f_area" type="number" inputmode="decimal" placeholder="93"><span class="suffix">sqm</span></div>
        <div><label>Storey</label><input id="f_storey" type="number" inputmode="numeric" placeholder="8"></div>
      </div>
      <div class="field two">
        <div><label>Lease left</label><input id="f_lease" type="number" inputmode="numeric" placeholder="92"><span class="suffix">yrs</span></div>
        <div><label>Block</label><input id="f_block" placeholder="406"></div>
      </div>
      <div class="field ac-wrap"><label>Street / estate <span style="font-weight:500;color:var(--ink-3)">· sets town &amp; sharpens comps</span></label>
        <input id="f_street" autocomplete="off" placeholder="e.g. Potong Pasir, or Ang Mo Kio Ave 10">
        <div class="ac-list" id="f_streetac" style="display:none"></div></div>`;
  }
  async function wireHdb() {
    const town = document.getElementById('f_town'), ft = document.getElementById('f_ftype');
    const fill = () => { ft.innerHTML = (IDX.hdb_towns[town.value] || []).map(t => `<option>${t}</option>`).join(''); };
    town.onchange = fill; fill();
    // street/estate search → resolves the HDB town (e.g. Potong Pasir → Toa Payoh)
    const inp = document.getElementById('f_street'), ac = document.getElementById('f_streetac');
    let STREETS = null;
    inp.oninput = async () => {
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
        if ([...town.options].some(o => o.value === d.dataset.tn)) { town.value = d.dataset.tn; fill(); }
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
        <div><label>Floor area</label><input id="f_area" type="number" inputmode="decimal" placeholder="90"><span class="suffix">sqm</span></div>
        <div><label>Floor level</label><input id="f_floor" type="number" inputmode="numeric" placeholder="12"></div>
      </div>
      <div class="field"><div id="f_projinfo" class="hint"></div></div>`;
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
    const ds = [...new Set(IDX.condo_projects.map(p => p[1]))].sort();
    return `
      <div class="field"><label>District</label><select id="l_district">
        ${ds.map(d => `<option value="${d}">District ${d}</option>`).join('')}</select></div>
      <div class="field"><label>Landed type</label><select id="l_type">
        <option value="">All landed</option><option>Terrace</option><option>Semi-detached</option><option>Detached</option></select></div>
      <p class="hint">Landed prices swing widely with land area, tenure &amp; plot — so Caveat shows <b>recent transactions for reference</b>, not a single estimate.</p>`;
  }
  async function genLanded(res) {
    const d = val('l_district'), type = val('l_type');
    let rows = (await C.condoDistrict(d)).filter(r => LANDED_TYPES.includes(r.ptype));
    if (type) rows = rows.filter(r => r.ptype === type || r.ptype === 'Strata ' + type);
    if (rows.length < 1) throw new Error('No landed transactions found for that district/type in the last 18 months.');
    rows.sort((a, b) => b.yymm.localeCompare(a.yymm));
    const psfs = rows.map(r => r.psf), prices = rows.map(r => r.price);
    res.innerHTML = `<div class="deck" id="deck">
      <div class="deck-top"><div class="dt-row"><div>
        <div class="deck-kicker">Landed reference · District ${d}</div>
        <div class="deck-addr">${type || 'All landed'} transactions</div>
        <div class="deck-sub">${rows.length} sales · last 18 months</div></div>
        <div class="chip lower"><span class="chip-dot"></span>Reference only</div></div></div>
      <div class="ref-banner">⚠ Landed homes vary enormously by land size, tenure and plot — there is no reliable single price-per-sqft. These are <b>actual recent transactions</b> to anchor your own judgement, not a valuation.</div>
      <div class="estimate" style="grid-template-columns:1fr 1fr 1fr">
        <div><div class="est-label">Median price</div><div class="est-figure" style="font-size:30px">${C.fmtMoney(C.median(prices))}</div></div>
        <div><div class="est-label">Median land PSF</div><div class="est-figure" style="font-size:30px">$${Math.round(C.median(psfs))}</div></div>
        <div><div class="est-label">Price range</div><div class="est-figure" style="font-size:22px">${C.fmtK(Math.min(...prices))}–${C.fmtK(Math.max(...prices))}</div></div>
      </div>
      <div class="deck-section"><h4>Recent landed transactions</h4>
        <table class="comps"><thead><tr><th>Street</th><th class="hide-sm">Type</th><th class="hide-sm">Month</th>
          <th style="text-align:right">Land area</th><th style="text-align:right">PSF</th><th style="text-align:right">Price</th></tr></thead>
        <tbody>${rows.slice(0, 14).map(r => `<tr>
          <td>${Narrative.titleCase(r.street)}</td><td class="hide-sm">${r.ptype}</td><td class="hide-sm">${mLabel(r.yymm)}</td>
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
    const town = val('f_town'), ft = val('f_ftype'), area = +val('f_area'),
      storey = +val('f_storey'), leaseY = +val('f_lease'), block = val('f_block'), street = val('f_street');
    if (!town) throw new Error('Pick a town to value an HDB flat.');
    if (!area || !storey) throw new Error('Enter at least floor area and storey.');
    const rows = await C.hdbTown(town);
    const subj = { flat_type: ft, area_sqm: area, storey_mid: storey,
      rem_lease_mths: leaseY ? Math.round(leaseY * 12) : null, street: street ? street.toUpperCase() : null, town };
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
    const meta = val('f_projmeta'); if (!meta) throw new Error('Pick a project from the list.');
    const p = JSON.parse(meta); const area = +val('f_area'), floor = +val('f_floor');
    if (!area || !floor) throw new Error('Enter floor area and floor level.');
    const rows = await C.condoDistrict(p[1]);
    const subj = { project: p[0], district: p[1], seg: p[2], ptype: p[3], tenure_fh: p[4],
      area_sqm: area, floor_mid: floor };
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
      ? `${Narrative.titleCase(subj.flat_type)} · ${r.area_sqf} sqft · ${C.leaseYears(subj.rem_lease_mths) || '—'} yrs lease`
      : `${subj.seg} · D${subj.district} · ${r.area_sqf} sqft · ${subj.tenure_fh ? 'Freehold' : 'Leasehold'}`;
    const cc = r.confidence.toLowerCase();
    const paras = Narrative.cma(kind, subj, r, amen);

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
          </div>
          <div class="chip ${cc}"><span class="chip-dot"></span>${r.confidence} confidence</div>
        </div>
      </div>

      <div class="estimate">
        <div class="est-main">
          <div class="est-label">Estimated value</div>
          <div class="est-figure" style="color:${getCss('--ink')}">${C.fmtMoney(r.estimate_price)}</div>
          <div class="est-psf">≈ ${C.fmtPsf(r.estimate_psf)} · based on ${r.n_comps} comparables</div>
          <div class="band">
            <div class="band-track">
              <div class="band-fill" style="left:14%;right:14%;background:linear-gradient(90deg,${color},${App.shade(color, -18)})"></div>
              <div class="band-mid" style="left:50%"></div>
            </div>
            <div class="band-ends"><span>${C.fmtMoney(r.low)}</span><span>${C.fmtMoney(r.high)}</span></div>
          </div>
        </div>
        <div class="est-side">
          <div class="fact"><span class="k">Indicative range</span><span class="v">±${r.band_pct}%</span></div>
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

  async function regen() {
    const res = document.getElementById('cmaResult');
    res.innerHTML = `<div class="empty-state"><div class="empty-mark"></div><p>Loading the market…</p></div>`;
    let p = {};
    try { p = await (await fetch('data/pulse.json')).json(); } catch (e) {}
    const ov = p.overall || {}, hdb = ov.hdb || {}, pri = ov.private || {};
    const fk = n => n >= 1e6 ? '$' + (n / 1e6).toFixed(2) + 'm' : '$' + Math.round(n / 1000) + 'k';
    const hdbMed = hdb.median_price ? fk(hdb.median_price) : '—';
    const hdbYield = (p.hdb_rental && p.hdb_rental.implied_gross_yield) ? p.hdb_rental.implied_gross_yield + '%' : '—';
    const priPsf = pri.median_psf ? '$' + pri.median_psf.toLocaleString() : '—';
    const txns = (hdb.txns || 0) + (pri.txns || 0);
    const txnsL = txns ? (txns >= 1000 ? Math.round(txns / 1000) + 'k+' : txns) : '58k+';
    res.innerHTML = `
      <div class="cma-welcome">
        <div class="w-eyebrow"><span class="dot"></span>Live · official URA &amp; HDB data${p.built ? ' · ' + p.built : ''}</div>
        <h2 class="w-h">Singapore's market, <em>in real numbers.</em></h2>
        <p class="w-p">Price any HDB flat or condo on the left — you'll get an estimate range, comparable sales, the price trend, a map, rental yield and a written summary in seconds. Every figure is drawn from official caveats, not guesswork.</p>
        <div class="w-kpis">
          <div class="w-kpi"><div class="v">${hdbMed}</div><div class="k">HDB median price</div></div>
          <div class="w-kpi"><div class="v">${hdbYield}</div><div class="k">HDB rental yield</div></div>
          <div class="w-kpi"><div class="v">${priPsf}</div><div class="k">Private median psf</div></div>
          <div class="w-kpi"><div class="v">${txnsL}</div><div class="k">transactions tracked</div></div>
        </div>
        <div class="w-try"><span>See it in action —</span>
          <button data-s="TAMPINES|4 ROOM|93|10|70">4-room · Tampines</button>
          <button data-s="PUNGGOL|5 ROOM|110|12|88">5-room · Punggol</button>
          <button data-s="ANG MO KIO|3 ROOM|68|8|55">3-room · Ang Mo Kio</button>
        </div>
      </div>`;
    res.querySelectorAll('.w-try button').forEach(b => b.onclick = () => {
      if (mode !== 'hdb') { mode = 'hdb'; renderForm(); }
      const [town, ft, area, storey, lease] = b.dataset.s.split('|');
      const set = (id, v) => { const el = document.getElementById(id); if (el) { el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); } };
      set('f_town', town); set('f_ftype', ft); set('f_area', area); set('f_storey', storey); set('f_lease', lease);
      document.getElementById('cmaGo').click();
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
    const rows = comps.slice(0, 8).map(c => kind === 'hdb' ? `<tr>
      <td>Blk ${c.block} <span class="hide-sm">${Narrative.titleCase(c.street).replace(/Ave /,'Ave ')}</span></td>
      <td class="hide-sm">${mLabel(c.yymm)}</td>
      <td class="num">${c.area_sqm}m²</td>
      <td class="num hide-sm">$${Math.round(c.psf)}</td>
      <td class="num adj">$${Math.round(c.adj_psf)}</td>
      <td class="num">${C.fmtK(c.price)}</td></tr>`
      : `<tr>
      <td>${Narrative.titleCase(c.project)} <span class="hide-sm" style="color:var(--ink-3)">· #${String(c.floor_mid||'').padStart(2,'0')}</span></td>
      <td class="hide-sm">${mLabel(c.yymm)}</td>
      <td class="num">${c.area_sqm}m²</td>
      <td class="num hide-sm">$${Math.round(c.psf)}</td>
      <td class="num adj">$${Math.round(c.adj_psf)}</td>
      <td class="num">${C.fmtK(c.price)}</td></tr>`).join('');
    return `<table class="comps"><thead><tr>
      <th>${kind === 'hdb' ? 'Block' : 'Project'}</th><th class="hide-sm">Month</th>
      <th style="text-align:right">Size</th><th style="text-align:right" class="hide-sm">Raw psf</th>
      <th style="text-align:right">Adj psf</th><th style="text-align:right">Price</th>
      </tr></thead><tbody>${rows}</tbody></table>
      <p class="hint" style="margin-top:10px">“Adj psf” normalises each comparable to the subject for time, ${kind === 'hdb' ? 'storey &amp; lease' : 'floor &amp; tenure'}.</p>`;
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
