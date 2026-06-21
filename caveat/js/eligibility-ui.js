/* Caveat — Affordability & stamp-duty tool. */
const Eligibility = (() => {
  const C = Caveat; let RATES = null; let emode = 'costs';

  async function init() {
    RATES = await C.rates(); window.__rates = RATES;
    renderForm();
    const modal = document.getElementById('ratesModal');
    document.getElementById('ratesClose').onclick = closeRates;
    modal.addEventListener('click', e => { if (e.target.id === 'ratesModal') closeRates(); });
    const fl = document.getElementById('footRatesLink');
    if (fl) fl.onclick = e => { e.preventDefault(); openRates(); };
  }

  // ---------- full rates & rules reference (built live from rates.json) ----------
  function openRates() {
    document.getElementById('ratesBody').innerHTML = referenceHTML();
    document.getElementById('ratesModal').hidden = false;
  }
  function closeRates() { document.getElementById('ratesModal').hidden = true; }

  function referenceHTML() {
    const a = RATES.absd, f = RATES.financing, h = RATES.hdb;
    const absdRow = (label, o) => `<tr><td>${label}</td><td class="num">${o['1']}%</td><td class="num">${o['2']}%</td><td class="num">${o['3']}%</td></tr>`;
    const bsd = RATES.bsd.tiers.map((t, i) => {
      const lo = i === 0 ? 0 : RATES.bsd.tiers[i - 1].upto;
      const band = t.upto == null ? `Above $${(lo / 1e6)}m` : `$${(lo / 1000)}k – $${(t.upto / 1000)}k`;
      return `<tr><td>${band}</td><td class="num">${t.rate}%</td></tr>`;
    }).join('');
    const ssd = RATES.ssd.tiers.filter(t => t.held_years_upto).map(t =>
      `<tr><td>Year ${t.held_years_upto}</td><td class="num">${t.rate}%</td></tr>`).join('');
    return `
      <p class="ref-badge">✓ ${RATES.verified}</p>
      <div class="ref-sec"><h3>Additional Buyer's Stamp Duty (ABSD)</h3>
        <p class="ref-note">${a.note}</p>
        <table class="ref-tbl"><thead><tr><th>Buyer</th><th>1st</th><th>2nd</th><th>3rd+</th></tr></thead><tbody>
          ${absdRow('Singapore Citizen', a.SC)}${absdRow('Singapore PR', a.SPR)}
          ${absdRow('Foreigner', a.Foreigner)}${absdRow('Entity / Trustee', a.Entity)}
        </tbody></table>
        <p class="ref-note">${a.fta_note}</p>
        <p class="ref-note">${a.married_refund_note}</p>
      </div>
      <div class="ref-sec"><h3>Buyer's Stamp Duty (BSD)</h3>
        <p class="ref-note">${RATES.bsd.note} Progressive — each band taxed at its own rate.</p>
        <table class="ref-tbl"><thead><tr><th>Price band</th><th>Rate</th></tr></thead><tbody>${bsd}</tbody></table>
      </div>
      <div class="ref-sec"><h3>Seller's Stamp Duty (SSD)</h3>
        <p class="ref-note">${RATES.ssd.note}</p>
        <table class="ref-tbl"><thead><tr><th>Sold within</th><th>Rate</th></tr></thead><tbody>${ssd}<tr><td>After 4 years</td><td class="num">0%</td></tr></tbody></table>
        <p class="ref-note">${RATES.ssd.grandfathered_pre_2025_07_04.note} Then: ${RATES.ssd.grandfathered_pre_2025_07_04.tiers.filter(t => t.held_years_upto).map(t => `Yr${t.held_years_upto} ${t.rate}%`).join(', ')}, after 0%.</p>
      </div>
      <div class="ref-sec"><h3>Financing limits</h3>
        <ul class="ref-list">
          <li><b>TDSR ${f.tdsr_pct}%</b> — total monthly debt repayments can't exceed ${f.tdsr_pct}% of gross income.</li>
          <li><b>MSR ${f.msr_pct}%</b> — for HDB/EC, the home loan alone can't exceed ${f.msr_pct}% of gross income.</li>
          <li><b>Stress rate ${f.stress_rate_pct}%</b> — eligibility is tested at a ${f.stress_rate_pct}% notional interest rate (or higher).</li>
          <li><b>Variable-income haircut ${f.variable_income_haircut_pct}%</b> — only ${100 - f.variable_income_haircut_pct}% of bonuses/commissions/rental counts.</li>
        </ul>
        <table class="ref-tbl"><thead><tr><th>Loan-to-Value (bank)</th><th>1st</th><th>2nd</th><th>3rd+</th></tr></thead><tbody>
          <tr><td>Standard</td><td class="num">${f.ltv.bank['1']}%</td><td class="num">${f.ltv.bank['2']}%</td><td class="num">${f.ltv.bank['3']}%</td></tr>
          <tr><td>Reduced*</td><td class="num">${f.ltv.bank_reduced['1']}%</td><td class="num">${f.ltv.bank_reduced['2']}%</td><td class="num">${f.ltv.bank_reduced['3']}%</td></tr>
        </tbody></table>
        <p class="ref-note">*${f.ltv.reduced_note} HDB concessionary loan: ${f.ltv.hdb_loan}% LTV. Minimum cash: ${f.min_cash_pct.ltv75}% (75% LTV) / ${f.min_cash_pct.ltv55}% (55% LTV) / ${f.min_cash_pct.second_plus}% (2nd+ property).</p>
      </div>
      <div class="ref-sec"><h3>HDB eligibility</h3>
        <ul class="ref-list">
          <li><b>Income ceilings</b> — Family $${h.income_ceiling.family.toLocaleString()} · Extended $${h.income_ceiling.extended.toLocaleString()} · Singles $${h.income_ceiling.single.toLocaleString()} · EC $${h.income_ceiling.ec.toLocaleString()} /month.</li>
          <li class="ref-sub">${h.income_ceiling_note}</li>
          <li><b>MOP</b> — Standard ${h.mop_years.standard} yrs · Plus/Prime ${h.mop_years.plus} yrs.</li>
          <li><b>Grants</b> — ${h.grants_note}</li>
          <li><b>EIP</b> — ${h.eip_note}</li>
        </ul>
      </div>
      <p class="ref-disc">${RATES.disclaimer}</p>`;
  }

  function rulesApplied(r, ctx) {
    const nth = ['1st', '2nd', '3rd+'][ctx.count - 1];
    const profLabel = ctx.profile === 'Foreigner' && ctx.fta ? `${ctx.fta} national (taxed as Citizen)`
      : { SC: 'Citizen', SPR: 'PR', Foreigner: 'Foreigner', Entity: 'Entity' }[ctx.profile];
    const li = (rule, why) => `<li><span class="ra-rule">${rule}</span><span class="ra-why">${why}</span></li>`;
    return `<div class="rules-applied">
      <h4>How this was worked out</h4>
      <ul>
        ${li(`ABSD ${r.absd_pct}%`, `${profLabel}, ${nth} property`)}
        ${li('BSD progressive 1–6%', 'standard residential stamp-duty bands')}
        ${li(`LTV ${r.ltvPct}%`, `${nth} housing loan${ctx.isHDB ? ' (HDB)' : ''} → max loan ${C.fmtMoney(r.loan)}`)}
        ${li(`Min. cash ${r.minCashPct}%`, 'minimum cash downpayment')}
        ${li(`TDSR ${RATES.financing.tdsr_pct}%${ctx.isHDB ? ` + MSR ${RATES.financing.msr_pct}%` : ''}`, `tested at ${RATES.financing.stress_rate_pct}% over 25 yrs`)}
      </ul>
      <button class="rates-link" type="button" onclick="Eligibility.openRates()">📋 See full rates &amp; rules →</button>
    </div>`;
  }

  function renderForm() {
    const el = document.getElementById('eligForm');
    if (emode === 'mortgage') return renderMortgage();
    el.innerHTML = `
      <div class="seg" id="eSeg"><button data-m="costs" class="on">Costs &amp; duties</button><button data-m="mortgage">Mortgage</button></div>
      <h3 class="panel-title">Buyer & purchase</h3>
      <div class="field"><label>Purchase price</label>
        <input id="e_price" type="number" inputmode="numeric" placeholder="1500000"><span class="suffix">SGD</span></div>
      <div class="field"><label>Buyer profile</label>
        <select id="e_profile">
          <option value="SC">Singapore Citizen</option>
          <option value="SPR">Singapore PR</option>
          <option value="Foreigner">Foreigner</option>
          <option value="Entity">Entity / company</option>
        </select></div>
      <div class="field" id="e_ftaWrap" style="display:none">
        <label>Nationality (FTA check)</label>
        <select id="e_fta"><option value="">— Other —</option></select>
        <div class="hint">${RATES.absd.fta_as_sc.join(', ')} nationals are taxed as Citizens under FTAs.</div>
      </div>
      <div class="field"><label>This will be their…</label>
        <select id="e_count">
          <option value="1">1st residential property</option>
          <option value="2">2nd property</option>
          <option value="3">3rd or more</option>
        </select></div>
      <div class="field"><label>Combined monthly income</label>
        <input id="e_income" type="number" inputmode="numeric" placeholder="12000"><span class="suffix">SGD</span></div>
      <label style="display:flex;gap:9px;align-items:center;margin:4px 0 16px;font-size:13.5px;font-weight:600;color:var(--ink-2)">
        <input type="checkbox" id="e_hdb" style="width:auto"> HDB flat (applies MSR 30%)</label>
      <button class="btn-primary" id="e_go">Calculate</button>
      <button class="rates-link" id="ratesRefBtn" type="button">📋 View all rates &amp; rules</button>
      <p class="err" id="e_err" style="display:none;margin-top:12px"></p>`;
    const prof = document.getElementById('e_profile'), ftaWrap = document.getElementById('e_ftaWrap'),
      fta = document.getElementById('e_fta');
    fta.innerHTML += RATES.absd.fta_as_sc.map(n => `<option>${n}</option>`).join('');
    prof.onchange = () => { ftaWrap.style.display = prof.value === 'Foreigner' ? 'block' : 'none'; };
    document.getElementById('e_go').onclick = calc;
    document.getElementById('ratesRefBtn').onclick = openRates;
    wireSeg();
  }

  function wireSeg() {
    document.querySelectorAll('#eSeg button').forEach(b => b.onclick = () => { emode = b.dataset.m; renderForm(); });
  }

  function renderMortgage() {
    document.getElementById('eligForm').innerHTML = `
      <div class="seg" id="eSeg"><button data-m="costs">Costs &amp; duties</button><button data-m="mortgage" class="on">Mortgage</button></div>
      <h3 class="panel-title">Loan repayment</h3>
      <div class="field"><label>Loan amount</label><input id="m_loan" type="number" inputmode="numeric" placeholder="1200000"><span class="suffix">SGD</span></div>
      <div class="field two">
        <div><label>Interest rate</label><input id="m_rate" type="number" step="0.1" inputmode="decimal" placeholder="3.5"><span class="suffix">%</span></div>
        <div><label>Tenure</label><input id="m_tenure" type="number" inputmode="numeric" placeholder="25"><span class="suffix">yrs</span></div></div>
      <button class="btn-primary" id="m_go">Calculate repayment</button>
      <p class="err" id="m_err" style="display:none;margin-top:12px"></p>`;
    wireSeg();
    document.getElementById('m_go').onclick = mortCalc;
  }

  function mortCalc() {
    const loan = +v('m_loan');
    let rate = v('m_rate').trim() === '' ? 3.5 : +v('m_rate');
    let tenure = v('m_tenure').trim() === '' ? 25 : +v('m_tenure');
    if (!(rate >= 0)) rate = 3.5;
    tenure = Math.min(35, Math.max(1, tenure || 25));
    const e = document.getElementById('m_err');
    if (!(loan > 0)) { e.textContent = 'Enter a valid loan amount.'; e.style.display = 'block'; return; }
    e.style.display = 'none';
    const r = rate / 100 / 12, n = tenure * 12;
    const monthly = r ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
    let bal = loan, y1int = 0;
    for (let i = 0; i < 12; i++) { const ii = bal * r; y1int += ii; bal -= monthly - ii; }
    const totalPaid = monthly * n;
    const out = document.getElementById('eligResult');
    out.innerHTML = `<div class="elig-card">
      <div class="elig-hero">
        <div class="deck-kicker" style="color:#9fb0c4">Mortgage repayment</div>
        <div class="deck-addr">${C.fmtMoney(loan)} loan · ${rate}% · ${tenure} yrs</div>
        <div class="eh-grid">
          <div class="eh-cell"><div class="ehk">Monthly instalment</div><div class="ehv">${C.fmtMoney(monthly)}</div></div>
          <div class="eh-cell"><div class="ehk">Total interest</div><div class="ehv">${C.fmtK(totalPaid - loan)}</div><div class="ehs">over ${tenure} years</div></div>
          <div class="eh-cell"><div class="ehk">Total repayable</div><div class="ehv">${C.fmtK(totalPaid)}</div></div>
        </div></div>
      <div class="breakdown">
        ${brow('Loan principal', 'what you borrow', C.fmtMoney(loan))}
        ${brow('Total interest', `at ${rate}% over ${tenure} years`, C.fmtMoney(Math.round(totalPaid - loan)))}
        ${brow('Interest in year 1', 'interest is front-loaded — most is paid early', C.fmtMoney(Math.round(y1int)))}
        <div class="brow total"><div class="bk">Total repayable</div><div class="bv">${C.fmtMoney(Math.round(totalPaid))}</div></div>
      </div>
      <div class="deck-disc">Indicative — assumes a constant interest rate for the full tenure. Actual repayments move with rate changes and your bank's terms.</div>
    </div>`;
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function calc() {
    let price = +v('e_price'), income = +v('e_income') || 0;
    if (income < 0) income = 0;
    const errEl = document.getElementById('e_err');
    if (!(price > 0)) { errEl.textContent = 'Enter a valid purchase price.'; errEl.style.display = 'block'; return; }
    errEl.style.display = 'none';
    let profile = v('e_profile'); const fta = v('e_fta');
    if (profile === 'Foreigner' && fta) profile = 'SC'; // FTA national taxed as citizen
    const count = +v('e_count'), isHDB = document.getElementById('e_hdb').checked;
    const r = Engines.purchaseCosts({ price, profile, propertyCount: count, isHDB, monthlyIncome: income }, RATES);
    render(r, { price, profile: v('e_profile'), fta, count, income, isHDB });
  }

  function render(r, ctx) {
    const out = document.getElementById('eligResult');
    const instOK = r.tdsrOK && r.msrOK;
    const cap = ctx.isHDB ? Math.min(r.tdsrCap, r.msrCap) : r.tdsrCap;
    const pct = ctx.income ? Math.min(100, Math.round(r.monthlyInstalment / cap * 100)) : 0;
    out.innerHTML = `<div class="elig-card" id="eligDeck">
      <div class="elig-hero">
        <div class="deck-kicker" style="color:#9fb0c4">Purchase summary</div>
        <div class="deck-addr">${C.fmtMoney(ctx.price)} ${ctx.isHDB ? 'HDB flat' : 'property'}</div>
        <div class="eh-grid">
          <div class="eh-cell"><div class="ehk">Cash needed upfront</div><div class="ehv">${C.fmtK(r.cashUpfront)}</div><div class="ehs">duties + min. cash</div></div>
          <div class="eh-cell"><div class="ehk">Max bank loan</div><div class="ehv">${C.fmtK(r.loan)}</div><div class="ehs">${r.ltvPct}% LTV</div></div>
          <div class="eh-cell"><div class="ehk">Est. monthly</div><div class="ehv">${C.fmtMoney(r.monthlyInstalment)}</div><div class="ehs">25yr @ ${RATES.financing.stress_rate_pct}% stress</div></div>
        </div>
      </div>
      <div class="breakdown">
        ${brow('Buyer’s Stamp Duty (BSD)', 'On purchase price', C.fmtMoney(r.bsd))}
        ${brow(`Additional Buyer’s Stamp Duty (ABSD)`, absdNote(ctx, r), r.absd ? C.fmtMoney(r.absd) : '—')}
        ${brow('Minimum cash downpayment', `${r.minCashPct}% of price`, C.fmtMoney(r.minCash))}
        ${brow('Total downpayment', `${100 - r.ltvPct}% (cash + CPF)`, C.fmtMoney(r.downpayment))}
        <div class="brow total"><div class="bk">Cash required upfront <small>BSD + ABSD + minimum cash</small></div><div class="bv">${C.fmtMoney(r.cashUpfront)}</div></div>
      </div>
      <div class="gauge">
        <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600">
          <span>${ctx.isHDB ? 'TDSR / MSR' : 'TDSR'} loan headroom</span>
          <span class="tnum">${ctx.income ? C.fmtMoney(r.monthlyInstalment) + ' / ' + C.fmtMoney(cap) : 'enter income'}</span></div>
        <div class="gtrack"><div class="gfill ${pct >= 100 ? 'over' : ''}" style="width:${pct}%"></div></div>
        ${ctx.income ? `<div class="flag ${instOK ? 'ok' : 'warn'}">${instOK
          ? '✓ Instalment fits within ' + (ctx.isHDB ? 'MSR 30% / TDSR 55%' : 'TDSR 55%')
          : '⚠ Instalment exceeds the ' + (ctx.isHDB ? 'MSR/TDSR' : 'TDSR') + ' cap — loan amount or tenure may need adjusting'}</div>`
          : `<div class="hint">Add monthly income to test loan eligibility.</div>`}
      </div>
      ${rulesApplied(r, ctx)}
      <div class="deck-foot">
        <div class="agent-card">${agentMini()}</div>
        <button class="btn-ghost" onclick="window.print()">Export PDF</button>
      </div>
      <div class="deck-disc">${RATES.disclaimer} Rates as of ${RATES.as_of}. ${RATES.hdb.eip_note}</div>
    </div>`;
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function absdNote(ctx, r) {
    if (ctx.profile === 'Foreigner' && ctx.fta) return `${ctx.fta} national — taxed as Citizen (FTA)`;
    const names = { SC: 'Citizen', SPR: 'PR', Foreigner: 'Foreigner', Entity: 'Entity' };
    return `${names[ctx.profile]} · ${['1st','2nd','3rd+'][ctx.count - 1]} property · ${r.absd_pct}%`;
  }

  function brow(k, sub, v) { return `<div class="brow"><div class="bk">${k}<small>${sub}</small></div><div class="bv">${v}</div></div>`; }
  function agentMini() {
    const p = App.getProfile() || {}; const color = p.color || '#0f9d76';
    return `<div class="ac-av" style="background:linear-gradient(135deg,${color},${App.shade(color, -20)})">${App.initials(p.name)}</div>
      <div><div class="acn">${p.name || 'Your name'}</div><div class="acm">${[p.agency, p.cea].filter(Boolean).join(' · ') || 'Set up profile →'}</div></div>`;
  }
  const v = id => (document.getElementById(id) || {}).value || '';

  return { init, openRates };
})();
