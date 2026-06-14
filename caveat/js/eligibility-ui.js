/* Caveat — Affordability & stamp-duty tool. */
const Eligibility = (() => {
  const C = Caveat; let RATES = null;

  async function init() {
    RATES = await C.rates(); window.__rates = RATES;
    renderForm();
  }

  function renderForm() {
    const el = document.getElementById('eligForm');
    el.innerHTML = `
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
        <div class="hint">US, Iceland, Liechtenstein, Norway &amp; Switzerland nationals are taxed as Citizens under FTAs.</div>
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
      <p class="err" id="e_err" style="display:none;margin-top:12px"></p>`;
    const prof = document.getElementById('e_profile'), ftaWrap = document.getElementById('e_ftaWrap'),
      fta = document.getElementById('e_fta');
    fta.innerHTML += RATES.absd.fta_as_sc.map(n => `<option>${n}</option>`).join('');
    prof.onchange = () => { ftaWrap.style.display = prof.value === 'Foreigner' ? 'block' : 'none'; };
    document.getElementById('e_go').onclick = calc;
  }

  function calc() {
    const price = +v('e_price'), income = +v('e_income') || 0;
    const errEl = document.getElementById('e_err');
    if (!price) { errEl.textContent = 'Enter a purchase price.'; errEl.style.display = 'block'; return; }
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

  return { init };
})();
