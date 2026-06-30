/* Guide (essentials) page-local Simplified-Chinese dictionary.
   Loaded BEFORE i18n.js, which merges window.PS_I18N_ZH into its dictionary.
   Kept on this page so the global engine stays lean. Section 1: journeys + static labels. */
window.PS_I18N_ZH = Object.assign(window.PS_I18N_ZH || {}, {
  // ── hero + section chrome ──
  'How property actually works.': '房产到底是怎么运作的。',
  '3 chapters · about 12 min read': '3 章 · 约 12 分钟阅读',
  "New to all this? Start here. See exactly how buying and selling happen, step by step, and pick up the things that quietly cost people money. No jargon you can't follow, no sales pitch.":
    '第一次接触？从这里开始。一步步看清买房和卖房到底怎么发生，并了解那些悄悄让人破费的事。没有看不懂的术语，也没有推销。',
  'How buying works': '买房怎么走',
  'The whole journey, from "I like this one" to keys in your hand.': '从“我喜欢这套”到钥匙到手的完整旅程。',
  "Pick what you're buying": '选择你要买的类型',
  ', the steps change a fair bit between them.': '，不同类型的步骤差别不小。',
  'Resale condo': '转售公寓', 'New launch condo': '新盘公寓', 'Resale HDB': '转售组屋', 'BTO (new HDB)': 'BTO（新组屋）',
  'Selling up, to upgrade, downsize, or cash out.': '卖房，为了升级、换小或套现。',
  "Pick what you're selling": '选择你要卖的类型',
  ', and watch the timing traps near the end.': '，并留意临近收尾的时间陷阱。',
  'Selling a condo': '卖公寓', 'Selling an HDB': '卖组屋',
  'Start to finish': '从头到尾',
  'The things we wish every buyer knew before they started.': '我们希望每位买家在开始前就知道的事。',
  'Tap any one': '点开任意一条', ' to open it.': '查看。',
  'For everyone': '人人适用',
  "The words you'll keep hearing.": '你会反复听到的那些词。',
  'Every term the tools and agents throw at you, translated once, with what it actually means for you.':
    '工具和中介抛给你的每个术语，一次讲清，并告诉你它对你意味着什么。',
  'The article library.': '文章库。',
  'Still not sure where you stand?': '还不确定自己的情况？',
  // tool names used in journey steps (not already in the global dict)
  'Estimate stamp duty': '估算印花税', 'Check eligibility': '检查购买资格', 'Value a flat': '估算组屋价值',
  'What grants can I get?': '我能拿到哪些补贴？',

  // ── journey metas ──
  '6 steps · about 3 months': '6 步 · 约 3 个月',
  "6 steps · pay as it's built": '6 步 · 边建边付',
  '6 steps · about 8-12 weeks': '6 步 · 约 8-12 周',
  '6 steps · about 3-4 years': '6 步 · 约 3-4 年',
  '5 steps · about 3 months': '5 步 · 约 3 个月',
  '5 steps · about 8-12 weeks': '5 步 · 约 8-12 周',

  // ── resale-condo journey ──
  'Before you view': '看房之前', 'Sort your real budget': '算清你的真实预算',
  "Get a bank's <b>In-Principle Approval</b> so you know exactly what you can borrow. Your real budget is the lowest of three things: what the bank lends, what you've saved, and how much of that is actual cash.":
    '先拿到银行的<b>原则性批贷 (IPA)</b>，弄清楚你到底能借多少。你的真实预算取决于三者中的最低值：银行能借的、你存下的，以及其中有多少是真正的现金。',
  'Nothing to pay yet': '暂时无需付款',
  'The hunt': '看房阶段', 'Find it and agree a price': '看房并谈好价格',
  "View units, check what similar ones <b>actually sold for</b> (not the hopeful asking price), and negotiate with the seller.":
    '看房，查看同类单位的<b>实际成交价</b>（而不是卖家的理想要价），并与卖家议价。',
  'Locking it in': '锁定', 'Get the Option to Purchase': '取得购买选择权 (OTP)',
  "You pay a small booking fee and the seller hands you the <b>Option to Purchase</b>. For about two weeks, they can't sell it to anyone else while you finalise your loan.":
    '你支付一笔小额订金，卖家把<b>购买选择权 (OTP)</b> 交给你。约两周内，卖家不能卖给别人，你趁这段时间敲定贷款。',
  'Pay 1% now': '现在付 1%', '~14-day window': '约 14 天窗口期',
  'Committing': '正式承诺', 'Exercise the option': '行使选择权',
  "Within that window you sign to confirm and pay the rest of the deposit, with a lawyer handling the paperwork. Now it's a <b>firm deal on both sides</b>.":
    '在窗口期内你签字确认并支付余下的订金，由律师处理文件。现在这是<b>双方都确定的交易</b>。',
  'Pay another 4% (5% total)': '再付 4%（共 5%）',
  'The taxman': '缴税', 'Pay your stamp duty': '缴印花税',
  "Within 14 days you pay <b>Buyer's Stamp Duty</b> to the government, plus extra duty (ABSD) if it isn't your first home. This is cash, on top of your deposit, so know the figure early.":
    '14 天内向政府缴<b>买方印花税 (BSD)</b>，如果不是第一套房还要加额外印花税 (ABSD)。这是现金，且在订金之外，所以要早点知道金额。',
  'Stamp duty · cash': '印花税 · 现金',
  'Keys in hand': '拿到钥匙', 'Completion': '交易完成',
  "About 10-12 weeks later your <b>loan and CPF kick in</b>, you pay the balance, the lawyers complete the sale, and the home is officially yours.":
    '约 10-12 周后你的<b>贷款和 CPF 开始生效</b>，你付清余款，律师完成交易，房子正式归你。',
  'Balance + your keys': '余款 + 钥匙', '~10-12 weeks later': '约 10-12 周后',

  // ── new-launch journey ──
  'Before the showflat': '参观样板房之前', 'Sort your budget first': '先算清预算',
  "Same starting point: get your <b>In-Principle Approval</b> so you know your ceiling before you get swept up at a glossy showflat.":
    '同样的起点：先拿到<b>原则性批贷 (IPA)</b>，在被光鲜的样板房冲昏头之前先知道自己的上限。',
  'Booking day': '认购日', 'Book a unit at the showflat': '在样板房认购单位',
  "Pick your unit and pay the <b>booking fee</b> to secure it. The developer issues you the Option to Purchase.":
    '选好单位并支付<b>认购费</b>锁定它。发展商会向你发出购买选择权 (OTP)。',
  'Pay 5% (mostly cash)': '付 5%（多为现金）', 'on booking': '认购时',
  'The contract': '签约', 'Sign the Sale & Purchase Agreement': '签署买卖协议 (S&P)',
  "A few weeks later the developer sends the <b>S&P Agreement</b>. You sign it, and pay your stamp duty within 14 days. By now you've put down about 20%.":
    '几周后发展商寄来<b>买卖协议 (S&P)</b>。你签字，并在 14 天内缴印花税。到这时你已付了约 20%。',
  'Stamp duty + balance of 20%': '印花税 + 凑足 20% 的余款',
  'As it goes up': '随楼建造', 'Progressive payments': '分期付款',
  "You pay in <b>stages as the building is constructed</b>, foundation, frame, walls, and so on. Your bank loan disburses to match, so the monthly repayment also builds up gradually.":
    '你<b>随着楼盘的建造分阶段付款</b>：打地基、搭框架、砌墙等等。银行贷款相应分批发放，所以月供也逐步增加。',
  'By stages': '分阶段', 'over 2-4 years': '2-4 年内',
  'Move-in': '入住', 'Collect keys at TOP': 'TOP 时领钥匙',
  "When the project gets its <b>Temporary Occupation Permit</b>, it's ready to live in. You collect your keys and can move in or rent it out.":
    '当项目拿到<b>临时入伙准证 (TOP)</b> 时就可以入住了。你领取钥匙，可以搬进去或出租。',
  'Most of the price paid by now': '此时大部分房款已付', 'TOP': 'TOP',
  'Wrapping up': '收尾', 'Final completion (CSC)': '最终竣工 (CSC)',
  "About a year after TOP the project gets its <b>Certificate of Statutory Completion</b> and the final slice of payment is made. Fully done.":
    'TOP 后约一年，项目拿到<b>合法竣工证书 (CSC)</b>，支付最后一笔款项。全部完成。',
  'Final ~15%': '最后约 15%', '~1 year after TOP': 'TOP 后约 1 年',

  // ── hdb-resale journey ──
  'Step zero': '第零步', 'Get your HFE letter': '取得 HFE 信',
  "Apply on the HDB portal for an <b>HDB Flat Eligibility letter</b>. It confirms in one go what you can buy, how much HDB will lend, and which grants you qualify for.":
    '在 HDB 网站申请<b>组屋购买资格信 (HFE)</b>。它一次性确认你能买什么、HDB 能借多少，以及你符合哪些补贴。',
  'Find a flat and get the Option': '找到组屋并取得选择权',
  "View flats, agree a price, and pay the <b>Option Fee</b> (up to $1,000) for the Option to Purchase.":
    '看房、谈好价格，并支付<b>选择权费</b>（最高 $1,000）取得购买选择权。',
  'Option fee · up to $1,000': '选择权费 · 最高 $1,000',
  'Exercise and apply to HDB': '行使选择权并向 HDB 申请',
  "Within the window you pay the rest of the deposit (up to $5,000 total), then <b>both you and the seller submit the resale application</b> to HDB.":
    '在窗口期内你付清余下的订金（总共最高 $5,000），然后<b>你和卖家一起向 HDB 提交转售申请</b>。',
  'Deposit · up to $5,000': '订金 · 最高 $5,000',
  'HDB checks': 'HDB 审核', 'Approval, valuation & stamp duty': '批准、估价和印花税',
  "HDB confirms everyone's eligible, values the flat, and approves the sale. You pay your <b>stamp duty</b> around here too.":
    'HDB 确认各方符合资格、为组屋估价并批准交易。你也在这时缴<b>印花税</b>。',
  'Watch for this': '留意这一点', 'Pay any cash-over-valuation': '支付任何高出估值的现金 (COV)',
  "If you agreed a price <b>above HDB's valuation</b>, the difference must be paid in cash, on top of everything else. Loan and CPF only stretch to the valuation.":
    '如果你谈的价格<b>高于 HDB 的估值</b>，差额必须用现金支付，且在其他所有费用之外。贷款和 CPF 只能用到估值为止。',
  'Cash, only if above valuation': '现金，仅当高于估值时', 'if it applies': '如适用',
  'Completion appointment': '交易完成预约',
  "At the HDB completion appointment your <b>loan, CPF and grants</b> all apply, you pay the balance, and you collect the keys. Your 5-year stay clock (MOP) starts now.":
    '在 HDB 的完成预约中，你的<b>贷款、CPF 和补贴</b>全部生效，你付清余款并领取钥匙。你的 5 年居住期 (MOP) 从现在开始计算。',

  // ── bto journey ──
  'Check you qualify, then apply': '确认符合资格，然后申请',
  "Make sure you tick the boxes (citizen, within the income ceiling, first-timer perks), then <b>apply when a launch opens</b>.":
    '确认你符合条件（公民、在收入上限内、首次购房优惠），然后<b>在推出新一批时申请</b>。',
  'The luck part': '看运气的部分', 'Ballot and book': '抽签并认购',
  "If your <b>queue number</b> gets called, you go down to pick a unit and pay the Option Fee to book it.":
    '如果你的<b>排队号码</b>被叫到，你就去选单位并支付选择权费认购。',
  'Option fee': '选择权费', 'when your number is called': '号码被叫到时',
  'Signing on': '签约', 'Sign the lease agreement': '签署租赁协议',
  "A few months later you sign the <b>Agreement for Lease</b>, pay the downpayment, and settle the stamp duty.":
    '几个月后你签署<b>租赁协议</b>，支付首付，并缴清印花税。',
  'Downpayment + stamp duty': '首付 + 印花税',
  'The wait': '等待期', 'It gets built': '等它建好',
  "Now you wait, usually <b>3 to 4 years</b>, while it's constructed. You pay nothing more in the meantime.":
    '现在你等待，通常<b>3 到 4 年</b>，等它建造完成。这期间你无需再付款。',
  'Nothing meanwhile': '期间无需付款', '3-4 years': '3-4 年',
  'Collect your keys': '领取钥匙',
  "When it's ready, your <b>loan and CPF kick in</b> for the final payment and you collect the keys to a brand-new home.":
    '建好后，你的<b>贷款和 CPF 生效</b>支付尾款，你领取这套全新组屋的钥匙。',
  'The rule after': '之后的规定', 'Live in it (MOP)': '住满居住期 (MOP)',
  "You must <b>live there for 5 years</b>, the Minimum Occupation Period, before you can sell it or buy a private property.":
    '在能卖出或购买私宅之前，你必须<b>在那里住满 5 年</b>，即最低居住期 (MOP)。',
  '5-year stay': '住满 5 年',

  // ── sell-condo journey ──
  'First move': '第一步', "Know what it's worth": '了解它值多少',
  "Price it on <b>real recent sales</b> in your project, not a hopeful number. An honest range gets you a faster, cleaner sale.":
    '根据你楼盘里<b>真实的近期成交</b>定价，而不是凭空开价。诚实的价格区间能让你卖得更快、更顺。',
  'Going to market': '推向市场', 'List it and find a buyer': '挂牌并找到买家',
  "Engage an agent, market the unit, and field offers. Good photos and the right price do most of the work.":
    '聘请中介、推广单位并处理出价。好照片加合适的价格能完成大部分工作。',
  'Offer accepted': '接受出价', 'Grant the Option': '授予选择权',
  "You accept an offer; the buyer pays <b>1%</b> and you give them the Option to Purchase. They've got about two weeks to confirm.":
    '你接受一个出价；买家支付<b>1%</b>，你把购买选择权给他们。他们有约两周时间确认。',
  'You receive 1%': '你收到 1%',
  'Firm deal': '交易确定', 'Buyer exercises': '买家行使选择权',
  'The buyer pays the rest of the deposit and the sale is locked in on both sides.': '买家付清余下的订金，交易双方都锁定。',
  'You receive 4% more': '你再收到 4%',
  'Cashing out': '套现', 'Completion & your proceeds': '交易完成与你的所得',
  "About 10-12 weeks later you pay off your <b>remaining loan</b>, refund your <b>CPF with accrued interest</b>, settle agent and legal fees, and pocket what's left. If you bought under a few years ago, check Seller's Stamp Duty first.":
    '约 10-12 周后你还清<b>剩余贷款</b>、连本带<b>累计利息退还 CPF</b>、结清中介和律师费，剩下的就是你的。如果你几年前才买入，先查一下卖方印花税。',
  'Net cash to you': '你的净得现金', 'Your net proceeds': '你的卖房净得',

  // ── sell-hdb journey ──
  'First, the rule': '首先，规定', 'Confirm you can sell': '确认你可以卖',
  "You must have finished your <b>5-year Minimum Occupation Period</b> before you're allowed to sell.":
    '你必须先住满<b>5 年最低居住期 (MOP)</b>才被允许出售。',
  'Pricing': '定价', 'Value it and list': '估价并挂牌',
  "Price on <b>recent resale transactions</b> for your block and flat type, then put it on the market.":
    '根据你那一座和户型的<b>近期转售成交</b>定价，然后挂牌。',
  'You receive the option fee': '你收到选择权费',
  'Through HDB': '通过 HDB', 'Submit the resale application': '提交转售申请',
  "Both sides submit the resale application; HDB <b>values the flat and approves</b> the sale.":
    '双方提交转售申请；HDB <b>为组屋估价并批准</b>交易。'
});
