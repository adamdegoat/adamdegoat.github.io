/* Caveat — Market Pulse dashboard. Renders the pre-computed pulse.json. */
const Pulse = (() => {
  const C = Caveat;
  let DATA = null, sortKey = 'txns', sortDir = -1;

  async function init() {
    try { DATA = await C.getJSON('pulse.json'); render(); }
    catch (e) { document.getElementById('pulseBody').innerHTML = `<div class="empty-state"><p class="err">${e.message}</p></div>`; }
  }

  function render() {
    const d = DATA;
    document.getElementById('pulseBody').innerHTML =
      statCards(d) + trendRow(d) + segmentRow(d) + townsBlock(d) + flatRow(d) + hotBlock(d) + foot(d);
    wireSort();
  }

  // ---- stat cards ----
  function statCards(d) {
    const h = d.overall.hdb, p = d.overall.private;
    const card = (k, v, s) => `<div class="pstat"><div class="ps-k">${k}</div><div class="ps-v">${v}</div><div class="ps-s">${s}</div></div>`;
    return `<div class="pulse-stats">
      ${card('HDB median resale', C.fmtK(h.median_price), `≈ $${h.median_psf} psf`)}
      ${card('Private median resale', '$' + (p.median_price / 1e6).toFixed(2) + 'm', `≈ $${p.median_psf} psf`)}
      ${card('HDB transactions', h.txns.toLocaleString(), `last ${d.window.hdb_months} months`)}
      ${card('Private transactions', p.txns.toLocaleString(), `last ${d.window.private_months} months`)}
    </div>`;
  }

  // ---- twin PSF trend sparklines ----
  function trendRow(d) {
    return `<div class="pulse-row two">
      ${trendCard('HDB median PSF', d.overall.hdb.months, '#0f9d76')}
      ${trendCard('Private median PSF', d.overall.private.months, '#b88a2e')}
    </div>`;
  }
  function trendCard(title, months, color) {
    const m = months.filter(x => x.psf);
    const first = m[0] ? m[0].psf : 0, last = m[m.length - 1] ? m[m.length - 1].psf : 0;
    const chg = first ? ((last - first) / first * 100) : 0;
    return `<div class="pcard">
      <div class="pc-head"><h4>${title}</h4>${trendBadge(+chg.toFixed(1))}</div>
      <div class="pc-big">$${last} <span class="pc-unit">psf</span></div>
      ${sparkline(m.map(x => x.psf), m.map(x => x.m), color)}
    </div>`;
  }

  // ---- market segments ----
  function segmentRow(d) {
    return `<h3 class="pulse-h">Private market by region</h3>
      <div class="pulse-row three">${d.private_segments.map(s => `
      <div class="pcard seg">
        <div class="pc-head"><h4>${s.label}</h4>${trendBadge(s.trend)}</div>
        <div class="pc-big">$${s.median_psf} <span class="pc-unit">psf</span></div>
        <div class="seg-sub">Median ${C.fmtK(s.median_price)} · ${s.txns.toLocaleString()} sales</div>
      </div>`).join('')}</div>`;
  }

  // ---- HDB towns table (sortable) ----
  function townsBlock(d) {
    return `<h3 class="pulse-h">HDB resale by town <span class="pulse-hint">tap a heading to sort</span></h3>
      <div class="ptable-wrap"><table class="ptable" id="townsTbl">
        <thead><tr>
          <th data-k="town">Town</th>
          <th data-k="median_price" class="num">Median price</th>
          <th data-k="median_psf" class="num hide-sm">PSF</th>
          <th data-k="txns" class="num">Sales</th>
          <th data-k="trend" class="num">3-mo</th>
        </tr></thead><tbody id="townsBody">${townRows(d.hdb_towns)}</tbody>
      </table></div>`;
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
    return `<h3 class="pulse-h">HDB median price by flat type</h3>
      <div class="flat-row">${d.hdb_flat_types.map(f => `
        <div class="flat-cell"><div class="ft-t">${ftLabel(f.type)}</div>
        <div class="ft-p">${C.fmtK(f.median_price)}</div>
        <div class="ft-s">${f.txns.toLocaleString()} sales</div></div>`).join('')}</div>`;
  }

  // ---- hottest projects ----
  function hotBlock(d) {
    return `<h3 class="pulse-h">Most-transacted condos</h3>
      <div class="hot-list">${d.hot_projects.map((p, i) => `
      <div class="hot"><span class="hot-rank">${i + 1}</span>
        <div class="hot-main"><div class="hot-n">${p.project}</div>
        <div class="hot-s">D${p.district} · ${p.seg} · median ${C.fmtK(p.median_price)}</div></div>
        <div class="hot-r"><div class="hot-psf">$${p.median_psf}<span> psf</span></div>
        <div class="hot-c">${p.txns} sales</div></div></div>`).join('')}</div>`;
  }

  function foot(d) {
    return `<p class="pulse-foot">Medians from official URA caveats &amp; HDB resale registrations (resale &amp; sub-sale only). HDB last ${d.window.hdb_months} months, private last ${d.window.private_months}. 3-mo = latest 3 months' median PSF vs the prior 3. Updated ${d.built}.</p>`;
  }

  // ---- helpers ----
  function trendBadge(t) {
    if (t == null) return `<span class="tr flat">–</span>`;
    if (t > 0.5) return `<span class="tr up">▲ ${t}%</span>`;
    if (t < -0.5) return `<span class="tr down">▼ ${Math.abs(t)}%</span>`;
    return `<span class="tr flat">≈ ${t}%</span>`;
  }
  function sparkline(vals, labels, color) {
    if (vals.length < 2) return '';
    const W = 320, H = 80, pad = 6;
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
  const ftLabel = t => ({ 'EXECUTIVE': 'Exec', 'MULTI-GENERATION': 'Multi-Gen' }[t] || t.replace(' ROOM', '-rm'));

  return { init };
})();
