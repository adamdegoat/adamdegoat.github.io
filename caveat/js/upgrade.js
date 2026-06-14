/* Caveat — Upgrade Path Planner (HDB → condo). Sell-first vs buy-first paths. */
const Upgrade = (() => {
  const C = Caveat; let RATES = null;

  async function init() { RATES = await C.rates(); renderForm(); }

  function renderForm() {
    document.getElementById('upgradeForm').innerHTML = `
      <h3 class="panel-title">Your current flat</h3>
      <div class="field"><label>Estimated flat value</label><input id="u_val" type="number" inputmode="numeric" placeholder="650000"><span class="suffix">SGD</span></div>
      <div class="field"><label>Outstanding home loan</label><input id="u_loan" type="number" inputmode="numeric" placeholder="180000"><span class="suffix">SGD</span></div>
      <div class="field"><label>Cash + CPF savings <span style="font-weight:500;color:var(--ink-3)">· optional</span></label><input id="u_save" type="number" inputmode="numeric" placeholder="100000"><span class="suffix">SGD</span></div>
      <h3 class="panel-title" style="margin-top:18px">The condo</h3>
      <div class="field"><label>Target price</label><input id="u_price" type="number" inputmode="numeric" placeholder="1600000"><span class="suffix">SGD</span></div>
      <div class="field"><label>Combined monthly income</label><input id="u_income" type="number" inputmode="numeric" placeholder="14000"><span class="suffix">SGD</span></div>
      <button class="btn-primary" id="u_go">Map my upgrade</button>
      <button class="rates-link" id="u_rates" type="button">📋 View all rates &amp; rules</button>
      <p class="err" id="u_err" style="display:none;margin-top:12px"></p>`;
    document.getElementById('u_go').onclick = calc;
    document.getElementById('u_rates').onclick = () => Eligibility.openRates();
  }

  function calc() {
    const val = +v('u_val'), loan = +v('u_loan') || 0, save = +v('u_save') || 0, price = +v('u_price'), income = +v('u_income') || 0;
    const e = document.getElementById('u_err');
    if (!val || !price) { e.textContent = 'Enter your flat value and the target condo price.'; e.style.display = 'block'; return; }
    e.style.display = 'none';
    const available = (val - loan) + save;  // CPF nets out (refunded to OA, reusable for the next downpayment)
    const bsd = Engines.bsd(price, RATES);
    const stress = RATES.financing.stress_rate_pct / 100 / 12, n = 25 * 12;
    const f = RATES.financing;

    const path = (absdPct, ltvPct) => {
      const absd = Math.round(price * absdPct / 100);
      const loanAmt = Math.round(price * ltvPct / 100);
      const cashNeeded = Math.round(price + bsd + absd - loanAmt - available);
      const inst = loanAmt > 0 ? loanAmt * stress / (1 - Math.pow(1 + stress, -n)) : 0;
      const tdsrCap = income * f.tdsr_pct / 100;
      return { absdPct, absd, loanAmt, downpayment: price - loanAmt, cashNeeded,
        inst: Math.round(inst), tdsrOK: income ? inst <= tdsrCap : null, tdsrCap: Math.round(tdsrCap) };
    };
    const sell = path(RATES.absd.SC['1'], f.ltv.bank['1']);            // 1st property
    const buy = path(RATES.absd.SC['2'], loan > 0 ? f.ltv.bank['2'] : f.ltv.bank['1']);  // 2nd loan if HDB loan still on
    render({ available, val, loan, save, price, income, bsd }, sell, buy);
  }

  function render(ctx, sell, buy) {
    const out = document.getElementById('upgradeResult');
    const cashLine = p => p.cashNeeded > 0
      ? `<span class="bv" style="color:var(--rose)">${C.fmtMoney(p.cashNeeded)} more</span>`
      : `<span class="bv" style="color:var(--brand-d)">${C.fmtMoney(-p.cashNeeded)} spare</span>`;
    const pathCard = (title, note, p, rec) => `<div class="up-path ${rec ? 'rec' : ''}">
      ${rec ? '<span class="up-badge">Usually cheaper</span>' : ''}
      <h4>${title}</h4><p class="up-note">${note}</p>
      <div class="up-rows">
        <div class="up-r"><span>ABSD (${p.absdPct}%)</span><span>${p.absd ? C.fmtMoney(p.absd) : '—'}${p.absdPct ? ' <small>refundable</small>' : ''}</span></div>
        <div class="up-r"><span>Buyer's stamp duty</span><span>${C.fmtMoney(ctx.bsd)}</span></div>
        <div class="up-r"><span>Max loan (${Math.round(p.loanAmt / ctx.price * 100)}%)</span><span>${C.fmtMoney(p.loanAmt)}</span></div>
        <div class="up-r"><span>Monthly instalment</span><span>${C.fmtMoney(p.inst)}${p.tdsrOK === false ? ' <small style="color:var(--rose)">over TDSR</small>' : p.tdsrOK ? ' <small style="color:var(--brand-d)">fits TDSR</small>' : ''}</span></div>
        <div class="up-r tot"><span>Extra cash needed<br><small>after using your sale funds</small></span><span>${cashLine(p)}</span></div>
      </div></div>`;
    out.innerHTML = `<div class="elig-card" id="upgradeDeck">
      <div class="elig-hero">
        <div class="deck-kicker" style="color:#9fb0c4">Upgrade plan · HDB → condo</div>
        <div class="deck-addr">${C.fmtMoney(ctx.price)} condo</div>
        <div class="eh-grid">
          <div class="eh-cell"><div class="ehk">Funds from your flat</div><div class="ehv">${C.fmtK(ctx.available)}</div><div class="ehs">value − loan + savings</div></div>
          <div class="eh-cell"><div class="ehk">Sale value</div><div class="ehv">${C.fmtK(ctx.val)}</div><div class="ehs">your flat</div></div>
          <div class="eh-cell"><div class="ehk">Condo price</div><div class="ehv">${C.fmtK(ctx.price)}</div><div class="ehs">target</div></div>
        </div>
      </div>
      <div class="up-paths">
        ${pathCard('Sell first, then buy', 'Your condo becomes your only property — no ABSD. Cleanest path, but you may need interim housing between the sale and the new place.', sell, true)}
        ${pathCard('Buy first, keep HDB', 'Pay the 20% ABSD upfront — fully refundable if you sell the flat within 6 months. Needs more cash and a smaller loan while the HDB loan is still on.', buy, false)}
      </div>
      <div class="rules-applied" style="border-radius:0 0 var(--r-lg) var(--r-lg)">
        <h4>Good to know</h4>
        <ul style="display:block">
          <li style="display:list-item;margin-left:16px">The 15-month wait-out rule does <b>not</b> apply when upgrading from HDB to private.</li>
          <li style="display:list-item;margin-left:16px">CPF used on your flat (plus accrued interest) is refunded to your CPF and can fund the condo downpayment — so it nets out of “funds available”.</li>
          <li style="display:list-item;margin-left:16px">Figures are indicative — Caveat drafts, you and your banker confirm the exact loan, CPF and timing.</li>
        </ul>
      </div>
      <div class="deck-disc">${RATES.disclaimer} Rates as of ${RATES.as_of}.</div>
    </div>`;
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const v = id => (document.getElementById(id) || {}).value || '';
  return { init };
})();
