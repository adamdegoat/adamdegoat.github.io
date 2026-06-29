/* Caveat, template narrative generator (no LLM). Drafts the deck prose; the
   agent verifies. Deterministic, defensible, SG-context wording. */
const Narrative = (() => {
  const C = Caveat;

  function trendWord(trend) {
    if (trend.length < 3) return { word: 'broadly stable', dir: 0 };
    const first = C.median(trend.slice(0, Math.ceil(trend.length / 2)).map(t => t.psf));
    const last = C.median(trend.slice(-Math.ceil(trend.length / 2)).map(t => t.psf));
    const chg = first ? (last - first) / first : 0;
    if (chg > 0.03) return { word: 'firming', dir: 1, pct: Math.round(chg * 100) };
    if (chg < -0.03) return { word: 'softening', dir: -1, pct: Math.round(-chg * 100) };
    return { word: 'broadly stable', dir: 0 };
  }

  const confLine = {
    High: 'a tight, consistent set of recent comparables, a confident read',
    Medium: 'a reasonable set of recent comparables, a sound working estimate',
    Lower: 'a more varied set of comparables, so treat this as an indicative range to refine on viewing',
  };

  function cma(kind, subj, res, amen) {
    const t = trendWord(res.trend);
    const loc = subj.locationName || (kind === 'hdb' ? subj.town : `District ${subj.district}`);
    const sub = kind === 'hdb'
      ? `this ${subj.flat_type.toLowerCase()} flat in ${titleCase(subj.town)}`
      : `this ${res.area_sqf} sqft unit at ${titleCase(subj.project)}`;

    let p1 = `Based on ${res.n_comps} comparable ${kind === 'hdb' ? 'resale transactions' : 'caveats'} ` +
      `(${res.scope ? res.scope.replace(/·/g, '·') + ', ' : ''}drawn from the last ${kind === 'hdb' ? 15 : 18} months), ` +
      `${sub} is estimated at ${C.fmtMoney(res.estimate_price)} (≈${C.fmtPsf(res.estimate_psf)}), with comparable units selling between ` +
      `${C.fmtMoney(res.obs_low)} and ${C.fmtMoney(res.obs_high)}. ` +
      `The comparables form ${confLine[res.confidence]}.`;

    let p2 = `Pricing in the area has been ${t.word}${t.pct ? ` (about ${t.pct}% over the window)` : ''} on a per-square-foot basis. `;
    if (kind === 'hdb' && subj.rem_lease_mths) {
      p2 += `With roughly ${C.leaseYears(subj.rem_lease_mths)} years of lease remaining, lease decay is factored into the comparison. `;
    }
    if (kind === 'condo') {
      p2 += subj.tenure_fh ? `As a freehold unit, it holds a tenure premium over comparable leasehold stock. `
        : `Leasehold tenure is reflected against the relevant comparable set. `;
    }

    let p3 = '';
    if (amen) {
      const bits = [];
      const nearest = (k, label) => { if (amen[k] && amen[k][0]) bits.push(`${label} ${amen[k][0].name.replace(/\s*\(.*\)/, '')} (${amen[k][0].dist}m)`); };
      if (amen.mrt) nearest('mrt', 'the MRT at');
      else if (amen.lrt) nearest('lrt', 'the LRT at');
      nearest('school', 'a school'); nearest('hawker', 'a hawker centre'); nearest('park', 'a park');
      if (bits.length) p3 = `On location, the unit is within walking reach of ${joinList(bits)}.`;
    }
    return [p1, p2.trim(), p3].filter(Boolean);
  }

  function outreach(txn, area) {
    const psf = Math.round(txn.psf);
    return `Hi! I noticed a ${txn.flat_type || txn.ptype || 'unit'} ${txn.block ? 'at Blk ' + txn.block + ' ' : ''}` +
      `in ${area} just transacted around ${C.fmtMoney(txn.price)} (≈$${psf} psf). ` +
      `If you've ever wondered what your home could fetch in today's market, I'd be happy to put together a ` +
      `no-obligation valuation for you. Would that be useful?`;
  }

  const titleCase = s => (s || '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  function joinList(a) { return a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }

  return { cma, outreach, titleCase };
})();
