/* Caveat — valuation + eligibility engines (ported from the Python reference). */
const Engines = (() => {
  const C = Caveat;

  // ============ HDB AVM ============
  const HDB = { STOREY: 0.004, LEASE: 0.004, HALFLIFE: 9, SIZE_TOL: 0.20, MIN: 5 };

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
    const lo = subj.area_sqm * (1 - HDB.SIZE_TOL), hi = subj.area_sqm * (1 + HDB.SIZE_TOL);
    const base = rows.filter(r => r.flat_type === subj.flat_type && r.area_sqm >= lo && r.area_sqm <= hi);
    if (base.length < HDB.MIN) return { ok: false, reason: `Only ${base.length} comparable sales of this flat type & size in the area (need ${HDB.MIN}).` };

    // LOCALITY TIERS — use the tightest pool with enough comps, and say which one.
    // block -> street -> estate -> town. Never silently fall back to the whole town.
    const blkU = String(subj.block || '').toUpperCase().trim();
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
      scope = stU ? `wider ${townTitle} — only ${n} ${label} sale${n === 1 ? '' : 's'} in range` : townTitle;
    }

    const byMonth = {};
    pool.forEach(r => (byMonth[r.yymm] = byMonth[r.yymm] || []).push(r.psf));
    const idx = {}; for (const m in byMonth) idx[m] = C.median(byMonth[m]);
    const recent = Object.keys(idx).sort().slice(-3);
    const nowLevel = C.median(recent.map(m => idx[m]));
    const now = C.yymmNow();

    const comps = pool.map(r => {
      const drift = idx[r.yymm] ? nowLevel / idx[r.yymm] : 1;
      const storeyAdj = 1 + HDB.STOREY * ((subj.storey_mid || 0) - (r.storey_mid || 0));
      const leaseAdj = (subj.rem_lease_mths && r.rem_lease_mths)
        ? 1 + HDB.LEASE * ((subj.rem_lease_mths - r.rem_lease_mths) / 12) : 1;
      const adj = r.psf * drift * storeyAdj * leaseAdj;
      const age = C.monthsBetween(r.yymm, now);
      const wRec = Math.pow(0.5, age / HDB.HALFLIFE);
      const wSize = 1 / (1 + Math.abs(r.area_sqm - subj.area_sqm) / subj.area_sqm * 4);
      const wStorey = 1 / (1 + Math.abs((subj.storey_mid || 0) - (r.storey_mid || 0)) * 0.06);
      const wLease = (subj.rem_lease_mths && r.rem_lease_mths)
        ? 1 / (1 + Math.abs(subj.rem_lease_mths - r.rem_lease_mths) / 12 * 0.04) : 1;
      // proximity: exact block / street dominate even within a wider estate or town pool
      const wProx = (blkU && String(r.block || '').toUpperCase().trim() === blkU && r.street === stU) ? 2.5
        : (stU && r.street === stU) ? 1.8
        : (esK && estateKey(r.street) === esK) ? 1.2 : 1;
      return { ...r, drift, storeyAdj, leaseAdj, adj_psf: adj, weight: wRec * wSize * wStorey * wLease * wProx };
    });
    const res = finalize(comps, subj.area_sqm, { highN: 12, highCV: 0.07, medN: 6, medCV: 0.10 });
    res.scope = scope; res.tier = tier;
    return res;
  }

  // ============ CONDO AVM ============
  const CD = { FLOOR: 0.007, FH: 0.12, HALFLIFE: 8, SIZE_TOL: 0.18, MIN_PROJ: 4, MIN: 5 };

  function condoEstimate(rows, subj) {
    // subj: {project, seg, ptype, tenure_fh, area_sqm, floor_mid}
    const lo = subj.area_sqm * (1 - CD.SIZE_TOL), hi = subj.area_sqm * (1 + CD.SIZE_TOL);
    const inSize = r => r.area_sqm >= lo && r.area_sqm <= hi;
    let pool = rows.filter(r => r.project === subj.project && inSize(r));
    let cross = false, scope = 'same project';
    if (pool.length < CD.MIN_PROJ) {
      pool = rows.filter(r => r.seg === subj.seg && r.ptype === subj.ptype && inSize(r));
      cross = true; scope = `D${subj.district} · ${subj.seg} · ${subj.ptype}`;
    }
    if (pool.length < CD.MIN) return { ok: false, reason: `Only ${pool.length} comparable caveats in ${scope} (need ${CD.MIN}).` };

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
      const wSize = 1 / (1 + Math.abs(r.area_sqm - subj.area_sqm) / subj.area_sqm * 4);
      const wFloor = 1 / (1 + Math.abs((subj.floor_mid || 0) - (r.floor_mid || 0)) * 0.04);
      return { ...r, drift, floorAdj, tenureAdj, adj_psf: adj, weight: wRec * wSize * wFloor };
    });
    const res = finalize(comps, subj.area_sqm, cross
      ? { highN: 999, highCV: 0, medN: 6, medCV: 0.10 }
      : { highN: 8, highCV: 0.07, medN: 6, medCV: 0.10 });
    res.scope = scope; res.cross = cross;
    return res;
  }

  // shared: weighted estimate + band + confidence + PSF trend
  function finalize(comps, area_sqm, conf) {
    comps.sort((a, b) => b.weight - a.weight);
    const wsum = comps.reduce((s, c) => s + c.weight, 0);
    const estPsf = comps.reduce((s, c) => s + c.adj_psf * c.weight, 0) / wsum;
    const variance = comps.reduce((s, c) => s + c.weight * (c.adj_psf - estPsf) ** 2, 0) / wsum;
    const cv = Math.sqrt(variance) / estPsf;
    const sqft = area_sqm * C.SQM_SQF;
    const estPrice = estPsf * sqft;
    const band = Math.max(0.03, Math.min(cv, 0.09));
    let confidence = 'Lower';
    if (comps.length >= conf.highN && cv < conf.highCV) confidence = 'High';
    else if (comps.length >= conf.medN && cv < conf.medCV) confidence = 'Medium';

    // monthly median PSF trend (raw, for the chart)
    const byM = {};
    comps.forEach(c => (byM[c.yymm] = byM[c.yymm] || []).push(c.psf));
    const trend = Object.keys(byM).sort().map(m => ({ yymm: m, psf: Math.round(C.median(byM[m])) }));

    return {
      ok: true, estimate_psf: Math.round(estPsf),
      estimate_price: Math.round(estPrice / 1000) * 1000,
      low: Math.round(estPrice * (1 - band) / 1000) * 1000,
      high: Math.round(estPrice * (1 + band) / 1000) * 1000,
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
