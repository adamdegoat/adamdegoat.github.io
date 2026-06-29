/* Caveat, valuation + eligibility engines (ported from the Python reference). */
const Engines = (() => {
  const C = Caveat;

  // ============ HDB AVM ============
  const HDB = { STOREY: 0.004, LEASE: 0.004, HALFLIFE: 9, SIZE_TOL: 0.20, MIN: 5 };

  // Bias calibration, measured by avm/backtest.js (point-in-time holdout, signed median error).
  // The weighting+adjustment pipeline runs a touch low on condos and a touch high on HDB; these
  // re-center the point estimate so the median signed error sits at ~0. Re-derive after any
  // change to the comp weighting and update these (1.0 = no correction).
  const CONDO_CALIB = 1.012;   // condos measured ~1.2% low
  const HDB_CALIB   = 0.994;   // HDB measured ~0.6% high

  // Estate key: group streets in the same estate, ignoring road-type/number/direction
  // tokens. "POTONG PASIR AVE 1/2/3" -> "POTONG PASIR"; "LOR 1 TOA PAYOH" -> "TOA PAYOH".
  const ROAD_TOKENS = new Set(['AVE','AVENUE','ST','STREET','RD','ROAD','DR','DRIVE','CTRL','CENTRAL',
    'CRES','CRESCENT','CL','CLOSE','LANE','LINK','WALK','VIEW','TER','TERRACE','PL','PLACE','GDNS',
    'GARDENS','HTS','HEIGHTS','RISE','LOOP','GROVE','GREEN','HILL','PARK','PK','LOR','LORONG','JLN',
    'JALAN','NTH','NORTH','STH','SOUTH','EAST','WEST','UPP','UPPER','LOWER']);
  function estateKey(street) {
    if (!street) return '';
    return street.toUpperCase().split(/\s+/)
      .filter(t => !ROAD_TOKENS.has(t) && !/^\d+[A-Z]?$/.test(t)).join(' ').trim();
  }
  const titleish = s => (s || '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  function hdbEstimate(rows, subj) {
    // subj: {flat_type, area_sqm, storey_mid, rem_lease_mths, street, block, town}
    // Floor area & storey are OPTIONAL, flat type + address is enough for a typical-unit estimate.
    const hasArea = subj.area_sqm > 0, hasStorey = subj.storey_mid > 0;
    const lo = hasArea ? subj.area_sqm * (1 - HDB.SIZE_TOL) : 0;
    const hi = hasArea ? subj.area_sqm * (1 + HDB.SIZE_TOL) : Infinity;
    const base = rows.filter(r => r.flat_type === subj.flat_type && (!hasArea || (r.area_sqm >= lo && r.area_sqm <= hi)));
    if (base.length < HDB.MIN) { const n = base.length; return { ok: false, reason: `Only ${n} recent ${subj.flat_type.toLowerCase()} sale${n === 1 ? '' : 's'} on record near here, try a nearby street or a more common flat type.` }; }

    // LOCALITY TIERS, use the tightest pool with enough comps, and say which one.
    // block -> street -> estate -> town. Never silently fall back to the whole town.
    const blkU = String(subj.block || '').toUpperCase().trim();
    const subjBlkNum = parseInt(blkU, 10) || 0;  // numeric part, for nearest-block ordering
    const stU = subj.street || '';
    const esK = estateKey(stU);
    const townTitle = subj.town ? titleish(subj.town) : 'the town';
    const sameBlk = (blkU && stU) ? base.filter(r => String(r.block || '').toUpperCase().trim() === blkU && r.street === stU) : [];
    const sameSt = stU ? base.filter(r => r.street === stU) : [];
    const sameEs = esK ? base.filter(r => estateKey(r.street) === esK) : [];
    let pool, scope, tier;
    if (sameBlk.length >= 4) { pool = sameBlk; tier = 'block'; scope = `Blk ${subj.block} ${titleish(stU)}`; }
    else if (sameSt.length >= 5) { pool = sameSt; tier = 'street'; scope = titleish(stU); }
    else if (sameEs.length >= 6) { pool = sameEs; tier = 'estate'; scope = titleish(esK); }
    else {
      pool = base; tier = 'town';
      const n = sameSt.length || sameEs.length, label = titleish(esK || stU || townTitle);
      scope = stU ? `wider ${townTitle}, only ${n} ${label} sale${n === 1 ? '' : 's'} in range` : townTitle;
    }

    const areaForEst = hasArea ? subj.area_sqm : C.median(pool.map(r => r.area_sqm));
    const byMonth = {};
    pool.forEach(r => (byMonth[r.yymm] = byMonth[r.yymm] || []).push(r.psf));
    const idx = {}; for (const m in byMonth) idx[m] = C.median(byMonth[m]);
    const recent = Object.keys(idx).sort().slice(-3);
    const nowLevel = C.median(recent.map(m => idx[m]));
    const now = C.yymmNow();

    const comps = pool.map(r => {
      const drift = idx[r.yymm] ? nowLevel / idx[r.yymm] : 1;
      const storeyAdj = hasStorey ? 1 + HDB.STOREY * (subj.storey_mid - (r.storey_mid || 0)) : 1;
      const leaseAdj = (subj.rem_lease_mths && r.rem_lease_mths)
        ? 1 + HDB.LEASE * ((subj.rem_lease_mths - r.rem_lease_mths) / 12) : 1;
      const adj = r.psf * drift * storeyAdj * leaseAdj;
      const age = C.monthsBetween(r.yymm, now);
      const wRec = Math.pow(0.5, age / HDB.HALFLIFE);
      const wSize = hasArea ? 1 / (1 + Math.abs(r.area_sqm - subj.area_sqm) / subj.area_sqm * 4) : 1;
      const wStorey = hasStorey ? 1 / (1 + Math.abs(subj.storey_mid - (r.storey_mid || 0)) * 0.06) : 1;
      const wLease = (subj.rem_lease_mths && r.rem_lease_mths)
        ? 1 / (1 + Math.abs(subj.rem_lease_mths - r.rem_lease_mths) / 12 * 0.04) : 1;
      // proximity: exact block / street dominate even within a wider estate or town pool
      const wProx = (blkU && String(r.block || '').toUpperCase().trim() === blkU && r.street === stU) ? 2.5
        : (stU && r.street === stU) ? 1.8
        : (esK && estateKey(r.street) === esK) ? 1.2 : 1;
      // nearest-block ordering: on the same street, closer block numbers rank higher
      const rBlkNum = parseInt(String(r.block || ''), 10) || 0;
      const wBlock = (subjBlkNum && rBlkNum && r.street === stU) ? 1 / (1 + Math.abs(rBlkNum - subjBlkNum) * 0.05) : 1;
      return { ...r, drift, storeyAdj, leaseAdj, adj_psf: adj, weight: wRec * wSize * wStorey * wLease * wProx * wBlock };
    });
    const res = finalize(comps, areaForEst, { highN: 12, highCV: 0.07, medN: 6, medCV: 0.10 }, HDB_CALIB);
    res.scope = scope; res.tier = tier; res.area_assumed = !hasArea;
    res.block_n = sameBlk.length;  // recent sales at the exact block searched
    const yrs = pool.map(r => r.rem_lease_mths).filter(Boolean).map(m => Math.round(m / 12));
    if (yrs.length) { res.lease_lo = Math.min(...yrs); res.lease_hi = Math.max(...yrs); }
    return res;
  }

  // ============ CONDO AVM ============
  const CD = { FLOOR: 0.007, FH: 0.12, HALFLIFE: 8, SIZE_TOL: 0.18, MIN_PROJ: 2, MIN: 5, CROSS_PROJ: 25, CROSS_KM: 0.3 };

  function condoEstimate(rows, subj) {
    // subj: {project, seg, ptype, tenure_fh, area_sqm, floor_mid}
    const hasArea = subj.area_sqm > 0;
    const lo = hasArea ? subj.area_sqm * (1 - CD.SIZE_TOL) : 0, hi = hasArea ? subj.area_sqm * (1 + CD.SIZE_TOL) : Infinity;
    const inSize = r => !hasArea || (r.area_sqm >= lo && r.area_sqm <= hi);
    // subject location: use any same-project caveats' coords (centroid) so the
    // cross-district fallback can weight by real distance, no frontend wiring needed.
    const projRows = rows.filter(r => r.project === subj.project && r.x && r.y);
    const subjX = subj.x || (projRows.length ? C.median(projRows.map(r => r.x)) : null);
    const subjY = subj.y || (projRows.length ? C.median(projRows.map(r => r.y)) : null);
    let pool = rows.filter(r => r.project === subj.project && inSize(r));
    let cross = false, scope = 'same project';
    if (pool.length < CD.MIN_PROJ) {
      pool = rows.filter(r => r.seg === subj.seg && r.ptype === subj.ptype && inSize(r));
      cross = true; scope = `D${subj.district} · ${subj.seg} · ${subj.ptype}`;
    }
    // same-project sales are strong signal: accept from MIN_PROJ. district fallback needs MIN.
    const need = cross ? CD.MIN : CD.MIN_PROJ;
    if (pool.length < need) { const n = pool.length; return { ok: false, reason: `Only ${n} comparable sale${n === 1 ? '' : 's'} in ${scope}${hasArea ? ' near this size' : ''}. ${hasArea ? 'Clear the floor area to include all unit sizes, or try' : 'Try'} a nearby project.` }; }

    const byMonth = {};
    pool.forEach(r => (byMonth[r.yymm] = byMonth[r.yymm] || []).push(r.psf));
    const idx = {}; for (const m in byMonth) idx[m] = C.median(byMonth[m]);
    const nowLevel = C.median(Object.keys(idx).sort().slice(-3).map(m => idx[m]));
    const now = C.yymmNow();

    const comps = pool.map(r => {
      const drift = idx[r.yymm] ? nowLevel / idx[r.yymm] : 1;
      const floorAdj = r.floor_mid ? 1 + CD.FLOOR * ((subj.floor_mid || 0) - r.floor_mid) : 1;
      let tenureAdj = 1;
      if (cross && r.tenure_fh !== subj.tenure_fh) tenureAdj = subj.tenure_fh ? 1 + CD.FH : 1 - CD.FH;
      const adj = r.psf * drift * floorAdj * tenureAdj;
      const age = C.monthsBetween(r.yymm, now);
      const wRec = Math.pow(0.5, age / CD.HALFLIFE);
      const wSize = hasArea ? 1 / (1 + Math.abs(r.area_sqm - subj.area_sqm) / subj.area_sqm * 4) : 1;
      const wFloor = 1 / (1 + Math.abs((subj.floor_mid || 0) - (r.floor_mid || 0)) * 0.04);
      // cross-district fallback only: lean on same-project sales and physically nearer
      // projects (real GPS distance) instead of weighting the whole district equally.
      let wProx = 1;
      if (cross) {
        const wProj = r.project === subj.project ? CD.CROSS_PROJ : 1;
        let wDist = 1;
        if (subjX && subjY && r.x && r.y) {
          const km = Math.hypot(subjX - r.x, subjY - r.y) / 1000;
          wDist = 1 / (1 + km / CD.CROSS_KM);
        }
        wProx = wProj * wDist;
      }
      return { ...r, drift, floorAdj, tenureAdj, adj_psf: adj, weight: wRec * wSize * wFloor * wProx };
    });
    const areaForEst = hasArea ? subj.area_sqm : C.median(pool.map(r => r.area_sqm));
    const res = finalize(comps, areaForEst, cross
      ? { highN: 999, highCV: 0, medN: 6, medCV: 0.10, cross: true }
      : { highN: 8, highCV: 0.07, medN: 6, medCV: 0.10 }, CONDO_CALIB);
    res.scope = scope; res.cross = cross; res.area_assumed = !hasArea;
    return res;
  }

  // shared: weighted estimate + band + confidence + PSF trend
  // calib = systematic-bias correction measured by the backtest (signed median error);
  // applied to the model PSF only, the observed sale range (obs_low/high) stays raw.
  function finalize(comps, area_sqm, conf, calib) {
    comps.sort((a, b) => b.weight - a.weight);
    const wsum = comps.reduce((s, c) => s + c.weight, 0);
    const rawPsf = comps.reduce((s, c) => s + c.adj_psf * c.weight, 0) / wsum;
    const variance = comps.reduce((s, c) => s + c.weight * (c.adj_psf - rawPsf) ** 2, 0) / wsum;
    const cv = Math.sqrt(variance) / rawPsf;       // spread is measured on raw comps
    const estPsf = rawPsf * (calib || 1);          // bias correction applied to the point estimate

    const sqft = area_sqm * C.SQM_SQF;
    const estPrice = estPsf * sqft;
    // Cross-district/segment fallback: the backtest shows ~16% real error on this path
    // (vs ~4% same-project), so the narrow same-project band would overstate precision.
    // Here we widen the band (floor 12%, cap 15%) and never let the chip read above
    // "Lower", an estimate built from other projects/segments is only indicative.
    const isCross = !!(conf && conf.cross);
    const band = isCross ? Math.max(0.12, Math.min(cv, 0.15)) : Math.max(0.03, Math.min(cv, 0.09));
    let confidence = 'Lower';
    if (!isCross) {
      if (comps.length >= conf.highN && cv < conf.highCV) confidence = 'High';
      else if (comps.length >= conf.medN && cv < conf.medCV) confidence = 'Medium';
    }

    // monthly median PSF trend (raw, for the chart)
    const byM = {};
    comps.forEach(c => (byM[c.yymm] = byM[c.yymm] || []).push(c.psf));
    const trend = Object.keys(byM).sort().map(m => ({ yymm: m, psf: Math.round(C.median(byM[m])) }));

    // observed range of comparable sales (normalised to subject size), trimmed 10th-90th pct
    const psfSorted = comps.map(c => c.adj_psf).sort((a, b) => a - b);
    const pctl = q => psfSorted[Math.max(0, Math.min(psfSorted.length - 1, Math.round(q * (psfSorted.length - 1))))];
    const obs_low = Math.round(pctl(0.10) * sqft / 1000) * 1000;
    const obs_high = Math.round(pctl(0.90) * sqft / 1000) * 1000;

    return {
      ok: true, estimate_psf: Math.round(estPsf),
      estimate_price: Math.round(estPrice / 1000) * 1000,
      low: Math.round(estPrice * (1 - band) / 1000) * 1000,
      high: Math.round(estPrice * (1 + band) / 1000) * 1000,
      obs_low, obs_high,
      band_pct: +(band * 100).toFixed(1), confidence, n_comps: comps.length,
      cv: +cv.toFixed(3), area_sqf: Math.round(sqft), comps, trend,
    };
  }

  // ============ ELIGIBILITY / STAMP DUTY ============
  function bsd(price, rates) {
    let duty = 0, prev = 0;
    for (const t of rates.bsd.tiers) {
      const cap = t.upto == null ? price : Math.min(price, t.upto);
      if (cap > prev) duty += (cap - prev) * t.rate / 100;
      prev = t.upto == null ? price : t.upto;
      if (price <= prev) break;
    }
    return Math.round(duty);
  }

  function absd(price, profile, count, rates) {
    const band = Math.min(Math.max(count, 1), 3);
    const pct = (rates.absd[profile] || rates.absd.SC)[String(band)] || 0;
    return { pct, amount: Math.round(price * pct / 100) };
  }

  function ssd(price, heldYears, rates) {
    for (const t of rates.ssd.tiers) {
      if (t.held_years_upto == null || heldYears <= t.held_years_upto)
        return { pct: t.rate, amount: Math.round(price * t.rate / 100) };
    }
    return { pct: 0, amount: 0 };
  }

  // full purchase cost breakdown
  function purchaseCosts(opts, rates) {
    // opts: {price, profile, propertyCount, ltvTier, isHDB, monthlyIncome, fta}
    const b = bsd(opts.price, rates);
    let prof = opts.profile;
    const band = Math.min(Math.max(opts.propertyCount, 1), 3);
    const a_pct = (rates.absd[prof] || {})[String(band)] || 0;
    const a = Math.round(opts.price * a_pct / 100);

    const ltvPct = opts.isHDB ? rates.financing.ltv.hdb_loan : (rates.financing.ltv.bank[String(Math.min(opts.propertyCount, 3))] || 75);
    const loan = Math.round(opts.price * ltvPct / 100);
    const downpayment = opts.price - loan;
    const minCashPct = opts.propertyCount >= 2 ? rates.financing.min_cash_pct.second_plus
      : (ltvPct >= 75 ? rates.financing.min_cash_pct.ltv75 : rates.financing.min_cash_pct.ltv55);
    const minCash = Math.round(opts.price * minCashPct / 100);

    const cashUpfront = b + a + minCash;
    // simple TDSR/MSR headroom on a 25yr loan @ stress rate
    const stress = rates.financing.stress_rate_pct / 100 / 12;
    const n = 25 * 12;
    const monthlyInst = loan > 0 ? loan * stress / (1 - Math.pow(1 + stress, -n)) : 0;
    const tdsrCap = opts.monthlyIncome * rates.financing.tdsr_pct / 100;
    const msrCap = opts.monthlyIncome * rates.financing.msr_pct / 100;

    return {
      price: opts.price, bsd: b, absd: a, absd_pct: a_pct,
      ltvPct, loan, downpayment, minCashPct, minCash, cashUpfront,
      monthlyInstalment: Math.round(monthlyInst),
      tdsrCap: Math.round(tdsrCap), msrCap: Math.round(msrCap),
      tdsrOK: monthlyInst <= tdsrCap, msrOK: !opts.isHDB || monthlyInst <= msrCap,
    };
  }

  return { hdbEstimate, condoEstimate, bsd, absd, ssd, purchaseCosts };
})();
