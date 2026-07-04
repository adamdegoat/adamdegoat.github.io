/* Caveat, Market Pulse dashboard. Renders pre-computed pulse.json with full
   context: every figure states its period, basis and date range. */
const Pulse = (() => {
  const C = Caveat;
  let DATA = null, EB = null, sortKey = 'txns', sortDir = -1;
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  async function init() {
    try { DATA = await C.getJSON('pulse.json'); window.__pulse = DATA; try { EB = await C.getJSON('en_bloc.json'); } catch (e) {} render(); }
    catch (e) { document.getElementById('pulseBody').innerHTML = `<div class="empty-state"><p class="err">${e.message}</p></div>`; }
  }

  function render() {
    const d = DATA;
    document.getElementById('pulseBody').innerHTML =
      periodBar(d) + statCards(d) + trendRow(d) + rentalBand(d) + segmentRow(d) + townsBlock(d) + flatRow(d) + hotBlock(d) + enblocBlock() + foot(d);
    wireSort();
  }

  // ---- context bar: what window are we looking at ----
  function periodBar(d) {
    const h = d.overall.hdb.months, p = d.overall.private.months;
    return `<div class="pulse-period">
      <span><b>HDB resale</b> ${range(h)} · ${d.overall.hdb.txns.toLocaleString()} sales</span>
      <span class="pp-sep"></span>
      <span><b>Private resale</b> ${range(p)} · ${d.overall.private.txns.toLocaleString()} sales</span>
      <span class="pp-note">All figures are medians of official transactions (resale &amp; sub-sale).</span>
    </div>`;
  }

  // ---- stat cards ----
  function statCards(d) {
    const h = d.overall.hdb, p = d.overall.private;
    const card = (k, v, s) => `<div class="pstat"><div class="ps-k">${k}</div><div class="ps-v">${v}</div><div class="ps-s">${s}</div></div>`;
    return `<div class="pulse-stats">
      ${card('HDB median resale price', C.fmtK(h.median_price), `≈ $${h.median_psf} psf · ${d.window.hdb_months}-mo median`)}
      ${card('Private median resale price', '$' + (p.median_price / 1e6).toFixed(2) + 'm', `≈ $${p.median_psf} psf · ${d.window.private_months}-mo median`)}
      ${card('HDB resale volume', h.txns.toLocaleString(), `transactions, last ${d.window.hdb_months} months`)}
      ${card('Private resale volume', p.txns.toLocaleString(), `transactions, last ${d.window.private_months} months`)}
    </div>`;
  }

  // ---- twin PSF trend sparklines ----
  function trendRow(d) {
    return `<h3 class="pulse-h">Median price-per-sqft trend</h3>
      <div class="pulse-row two">
      ${trendCard('HDB resale', d.overall.hdb.months, '#0f9d76', d.window.hdb_months)}
      ${trendCard('Private resale', d.overall.private.months, '#b88a2e', d.window.private_months)}
    </div>`;
  }
  function trendCard(title, months, color, win) {
    const m = months.filter(x => x.psf);
    const first = m[0].psf, last = m[m.length - 1].psf;
    const chg = first ? ((last - first) / first * 100) : 0;
    return `<div class="pcard">
      <div class="pc-head"><h4>${title}</h4>
        <span class="pc-now">$${last}<span> psf now</span></span></div>
      <div class="pc-trend">${trendBadge(+chg.toFixed(1))}
        <span class="pc-trend-lbl">over the period (${MON[mm(m[0].m)]} ’${yy(m[0].m)} → ${MON[mm(m[m.length - 1].m)]} ’${yy(m[m.length - 1].m)})</span></div>
      ${sparkline(m.map(x => x.psf), color)}
      <div class="pc-range"><span>${MON[mm(m[0].m)]} ’${yy(m[0].m)}</span><span>${win}-month median PSF</span><span>${MON[mm(m[m.length - 1].m)]} ’${yy(m[m.length - 1].m)}</span></div>
    </div>`;
  }

  // ---- private rental + implied yield ----
  function rentalBand(d) {
    const r = d.rental; if (!r || !r.median_rent) return '';
    const cell = (v, k) => `<div class="rb-cell"><div class="rb-v">${v}</div><div class="rb-k">${k}</div></div>`;
    return `<h3 class="pulse-h">Private rental market <span class="pulse-hint">non-landed · last 5 quarters · ${r.leases.toLocaleString()} leases</span></h3>
      <div class="rental-band">
        ${cell(C.fmtMoney(r.median_rent) + '<span>/mo</span>', 'Median monthly rent')}
        ${cell('$' + r.median_rent_psf + '<span> psf</span>', 'Median rent PSF')}
        ${cell('~' + r.implied_gross_yield + '%', 'Implied gross yield')}
      </div>
      <p class="ptable-legend">Implied gross yield = median rent PSF × 12 ÷ median resale PSF, a market-wide indication before costs &amp; vacancy. Yields for a specific project appear on its valuation.</p>`;
  }

  // ---- market segments ----
  function segmentRow(d) {
    return `<h3 class="pulse-h">Private market by region <span class="pulse-hint">median resale PSF · last ${d.window.private_months} months</span></h3>
      <div class="pulse-row three">${d.private_segments.map(s => `
      <div class="pcard pseg">
        <div class="pc-head"><h4>${s.label}</h4></div>
        <div class="pc-big">$${s.median_psf} <span class="pc-unit">psf median</span></div>
        <div class="pc-trend">${trendBadge(s.trend)} <span class="pc-trend-lbl">3-month momentum</span></div>
        <div class="seg-sub">Median price ${C.fmtK(s.median_price)} · ${s.txns.toLocaleString()} sales</div>
      </div>`).join('')}</div>`;
  }

  // ---- HDB towns table ----
  function townsBlock(d) {
    return `<h3 class="pulse-h">HDB resale by town <span class="pulse-hint">last ${d.window.hdb_months} months · tap a heading to sort</span></h3>
      <div class="ptable-wrap"><table class="ptable" id="townsTbl">
        <thead><tr>
          <th data-k="town">Town</th>
          <th data-k="median_price" class="num">Median price</th>
          <th data-k="median_psf" class="num hide-sm">Median PSF</th>
          <th data-k="txns" class="num">Sales</th>
          <th data-k="trend" class="num">3-mo PSF Δ</th>
        </tr></thead><tbody id="townsBody">${townRows(d.hdb_towns)}</tbody>
      </table></div>
      <p class="ptable-legend">“3-mo PSF Δ” = the town’s median PSF over the latest 3 months versus the 3 months before it, a momentum read, not the headline price change.</p>`;
  }
  function townRows(towns) {
    return towns.map(t => `<tr>
      <td>${t.town}</td>
      <td class="num">${C.fmtMoney(t.median_price)}</td>
      <td class="num hide-sm">$${t.median_psf}</td>
      <td class="num">${t.txns.toLocaleString()}</td>
      <td class="num">${trendBadge(t.trend)}</td></tr>`).join('');
  }
  function wireSort() {
    document.querySelectorAll('#townsTbl th').forEach(th => th.onclick = () => {
      const k = th.dataset.k;
      if (k === sortKey) sortDir = -sortDir; else { sortKey = k; sortDir = k === 'town' ? 1 : -1; }
      const sorted = [...DATA.hdb_towns].sort((a, b) => {
        const av = a[k] ?? -1e9, bv = b[k] ?? -1e9;
        return (typeof av === 'string') ? av.localeCompare(bv) * sortDir : (av - bv) * sortDir;
      });
      document.getElementById('townsBody').innerHTML = townRows(sorted);
      document.querySelectorAll('#townsTbl th').forEach(t => t.classList.toggle('sorted', t.dataset.k === sortKey));
    });
  }

  // ---- HDB flat-type medians ----
  function flatRow(d) {
    return `<h3 class="pulse-h">HDB median resale price by flat type <span class="pulse-hint">last ${d.window.hdb_months} months</span></h3>
      <div class="flat-row">${d.hdb_flat_types.map(f => `
        <div class="flat-cell"><div class="ft-t">${ftLabel(f.type)}</div>
        <div class="ft-p">${C.fmtK(f.median_price)}</div>
        <div class="ft-s">$${f.median_psf} psf · ${f.txns.toLocaleString()} sales</div></div>`).join('')}</div>`;
  }

  // ---- hottest projects ----
  function hotBlock(d) {
    return `<h3 class="pulse-h">Most-transacted condos <span class="pulse-hint">by resale volume · last ${d.window.private_months} months</span></h3>
      <div class="hot-list">${d.hot_projects.map((p, i) => `
      <div class="hot"><span class="hot-rank">${i + 1}</span>
        <div class="hot-main"><div class="hot-n">${p.project}</div>
        <div class="hot-s">District ${p.district} · ${p.seg} · median ${C.fmtK(p.median_price)}</div></div>
        <div class="hot-r"><div class="hot-psf">$${p.median_psf}<span> psf</span></div>
        <div class="hot-c">${p.txns} sales</div></div></div>`).join('')}</div>`;
  }

  function enblocBlock() {
    if (!EB || !EB.rows.length) return '';
    const big = p => p >= 1e9 ? '$' + (p / 1e9).toFixed(2) + 'b' : '$' + Math.round(p / 1e6) + 'm';
    const when = m => `${MON[+m.slice(2) - 1]} ’${m.slice(0, 2)}`;
    return `<h3 class="pulse-h">Recent collective sales <span class="pulse-hint">en-bloc &amp; land deals · last 5 years</span></h3>
      <div class="ptable-wrap"><table class="ptable">
        <thead><tr><th>Development</th><th class="hide-sm">District</th><th class="hide-sm">Type</th>
          <th style="text-align:right">Land area</th><th style="text-align:right">Price</th><th style="text-align:right" class="hide-sm">When</th></tr></thead>
        <tbody>${EB.rows.slice(0, 20).map(r => `<tr>
          <td>${r[0]}</td><td class="hide-sm">D${r[1]}</td><td class="hide-sm">${r[3]}</td>
          <td class="num">${Math.round(r[4] * 10.7639 / 1000).toLocaleString()}k sf</td>
          <td class="num">${big(r[5])}</td><td class="num hide-sm">${when(r[6])}</td></tr>`).join('')}</tbody>
      </table></div>
      <p class="ptable-legend">Whole-development sales (excluded from unit comparables). Context only, an en-bloc resets local supply and can lift nearby prices.</p>`;
  }

  function foot(d) {
    return `<p class="pulse-foot">Source: official URA private caveats &amp; HDB resale registrations (resale &amp; sub-sale only; private excludes landed). “Median” is the middle transacted value over the stated window, half sold above, half below. “Median PSF” trend spans the full ${d.window.private_months}/${d.window.hdb_months}-month window; “3-month momentum” compares the latest 3 months’ median PSF with the prior 3. Data current as of ${d.built}; refreshes weekly.</p>`;
  }

  // ---- helpers ----
  const mm = m => m.includes('-') ? +m.split('-')[1] - 1 : +m.slice(2) - 1;
  const yy = m => m.includes('-') ? m.slice(2, 4) : m.slice(0, 2);
  const range = months => { const m = months.filter(x => x.psf); return m.length ? `${MON[mm(m[0].m)]} ’${yy(m[0].m)}, ${MON[mm(m[m.length - 1].m)]} ’${yy(m[m.length - 1].m)}` : ''; };

  function trendBadge(t) {
    if (t == null) return `<span class="tr flat" title="not enough data">-</span>`;
    if (t > 0.5) return `<span class="tr up">▲ ${t}%</span>`;
    if (t < -0.5) return `<span class="tr down">▼ ${Math.abs(t)}%</span>`;
    return `<span class="tr flat">≈ flat (${t}%)</span>`;
  }
  function sparkline(vals, color) {
    if (vals.length < 2) return '';
    const W = 320, H = 70, pad = 6;
    const lo = Math.min(...vals), hi = Math.max(...vals), span = (hi - lo) || 1;
    const xs = vals.map((_, i) => pad + i * (W - 2 * pad) / (vals.length - 1));
    const yOf = v => H - pad - (v - lo) / span * (H - 2 * pad);
    const pts = vals.map((v, i) => `${xs[i].toFixed(1)},${yOf(v).toFixed(1)}`);
    const id = 'sg' + color.slice(1);
    return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${color}" stop-opacity=".25"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <path d="M${xs[0]},${H - pad} L${pts.join(' L')} L${xs[xs.length - 1]},${H - pad} Z" fill="url(#${id})"/>
      <polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${xs[xs.length - 1]}" cy="${yOf(vals[vals.length - 1]).toFixed(1)}" r="3" fill="#fff" stroke="${color}" stroke-width="2"/>
    </svg>`;
  }
  const ftLabel = t => ({ 'EXECUTIVE': 'Executive', 'MULTI-GENERATION': 'Multi-Gen' }[t] || t.replace(' ROOM', '-room'));

  return { init };
})();
