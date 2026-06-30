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
    '双方提交转售申请；HDB <b>为组屋估价并批准</b>交易。',

  // ── tips library (13) ──
  'Your real budget has three parts, most people count one': '你的真实预算有三部分，大多数人只算了一个',
  "<p>The price tag isn't your budget. Three things decide what you can actually spend, and the <b>lowest of the three</b> is your real ceiling: how much a <b>bank will lend</b> you (capped by your income), how much you've <b>saved</b> in cash and CPF, and how much of that saving is <b>actual cash</b> (since a slice of every purchase must be paid in cash, not CPF).</p><p>People fixate on the loan and forget the cash. That's how you fall for a place you can't actually close on.</p><div class=\"takeaway\">Work out all three before you view anything. <a class=\"tl\" href=\"../tools/afford.html\">The afford tool does it for you →</a></div>":
    '<p>标价不是你的预算。三样东西决定你实际能花多少，其中<b>最低的那个</b>才是你真正的上限：<b>银行能借</b>你多少（受你收入限制）、你在现金和 CPF 里<b>存了</b>多少，以及其中有多少是<b>真正的现金</b>（因为每笔购房都有一部分必须用现金付，不能用 CPF）。</p><p>人们盯着贷款，却忘了现金。这就是你看上一套自己其实付不起的房子的原因。</p><div class="takeaway">在看任何房子之前，先把这三样都算清楚。<a class="tl" href="../tools/afford.html">负担能力工具帮你算好 →</a></div>',
  'The costs that catch buyers out, beyond the price': '价格之外，最容易让买家措手不及的成本',
  "<p>On top of the down payment, budget for: <b>stamp duty</b> (a government tax on the price, paid in cash), <b>legal fees</b>, a <b>valuation fee</b>, and, if you're upgrading, possibly <b>ABSD</b>, which can be a very large sum. Then there's <b>renovation</b>, and on a resale flat, any <b>cash-over-valuation</b>.</p><div class=\"takeaway\">Add roughly 3-5% of the price for the \"extras\" and keep it in cash, separate from your down payment.</div>":
    '<p>除了首付，还要预留：<b>印花税</b>（政府按房价征收的税，用现金付）、<b>律师费</b>、<b>估价费</b>，如果你是换房，可能还有<b>额外印花税 (ABSD)</b>，这可能是一笔很大的钱。然后还有<b>装修费</b>，转售组屋还可能有<b>高出估值的现金 (COV)</b>。</p><div class="takeaway">为这些“额外开销”预留大约房价的 3-5%，并用现金，和首付分开放。</div>',
  'Renting vs buying, the honest way to decide': '租房还是买房，诚实的判断方法',
  "<p>Forget \"rent is dead money\", owning has its own dead money (interest, stamp duty, agent fees, the CPF interest you owe yourself back). The real question is <b>how long you'll stay</b> and <b>how settled your life is</b>. Buy when you'll hold for many years and want to put down roots; rent when your job, family plans, or finances are still moving.</p><div class=\"takeaway\">Short, uncertain horizon → renting is often the smarter money move, not the lazy one.</div>":
    '<p>别再说“租房是把钱扔进水里”，买房也有自己“扔掉的钱”（利息、印花税、中介费，以及你欠自己要补回的 CPF 利息）。真正的问题是<b>你会住多久</b>，以及<b>你的生活有多稳定</b>。打算住很多年、想安定下来就买；工作、家庭计划或财务还在变动，就租。</p><div class="takeaway">时间短、未来不确定 → 租房往往是更聪明的理财选择，而不是偷懒。</div>',
  'BTO vs resale flat, waiting vs buying now': 'BTO 还是转售组屋，等待还是现在就买',
  "<p><b>BTO</b> is cheaper and comes with the biggest grants, but you ballot for it, wait 3-4 years, and you're tied in for 5 years after. <b>Resale</b> lets you move in now, pick the exact location and a bigger or higher floor, and skip the wait, but you pay more, and older flats have less lease left.</p><div class=\"takeaway\">In a hurry or fussy about location → resale. Patient and want to save the most → BTO.</div>":
    '<p><b>BTO</b> 更便宜，补贴也最多，但要抽签、等 3-4 年，建好后还要锁定 5 年。<b>转售</b>让你现在就能入住、挑选确切的地点和更大或更高的楼层，省去等待，但价格更高，而且较旧的组屋剩余屋契更少。</p><div class="takeaway">赶时间或讲究地点 → 转售。有耐心、想省最多 → BTO。</div>',
  "Condo vs HDB, what you're really choosing": '公寓还是组屋，你真正在选的是什么',
  "<p>An HDB flat is <b>subsidised public housing</b> with rules on who can buy and when you can sell, but it's far better value per dollar and the grants help a lot. A <b>condo</b> buys you facilities, fewer restrictions, and the chance of stronger price growth, but you pay a big premium for the lifestyle, and the maintenance fees never stop.</p><div class=\"takeaway\">You're mostly paying for facilities and flexibility. Be honest about whether you'll use the pool.</div>":
    '<p>组屋是<b>受津贴的公共住房</b>，对谁能买、何时能卖有规定，但每块钱的性价比高得多，补贴也帮很大忙。<b>公寓</b>给你设施、更少的限制，以及更强价格增长的可能，但你要为这种生活方式付一大笔溢价，而且管理费永远不停。</p><div class="takeaway">你主要是在为设施和灵活性付钱。诚实问问自己到底会不会用那个泳池。</div>',
  'What to check before you fall for a place': '在你看上一套房之前要查什么',
  "<p>Beyond the photos: <b>how much lease is left</b> (it caps your loan and CPF, and the next buyer's too), the <b>floor and facing</b> (afternoon sun and noise are real), what <b>similar units actually sold for</b>, the <b>monthly maintenance fee</b>, and whether anything nearby is about to be built that blocks the view.</p><div class=\"takeaway\">View it twice, once in the day, once in the evening. The place can feel very different.</div>":
    '<p>照片之外：<b>剩余屋契还有多少</b>（它限制你的贷款和 CPF，下一个买家也一样）、<b>楼层和朝向</b>（午后西晒和噪音是真实存在的）、<b>同类单位的实际成交价</b>、<b>每月管理费</b>，以及附近是否快要建什么会挡住视野。</p><div class="takeaway">看两次，白天一次、傍晚一次。同一个地方感觉可能很不一样。</div>',
  "Why the cheapest unit isn't the best deal": '为什么最便宜的单位不是最划算的',
  "<p>The cheapest unit in a project is usually cheap <b>for a reason</b>, a low floor, a west-facing afternoon-sun unit, a spot over the rubbish bay, or a shorter lease. You feel it when you try to sell: the same things that got you a discount get you a discount from the next buyer too.</p><div class=\"takeaway\">A fair price on a good unit beats a \"steal\" on a flawed one. Resale value remembers.</div>":
    '<p>一个项目里最便宜的单位通常便宜<b>是有原因的</b>：低楼层、西晒、正对垃圾房，或剩余屋契更短。等你要卖时就会感受到：当初让你拿到折扣的那些因素，也会让下一个买家向你压价。</p><div class="takeaway">一套好单位的公道价，胜过一套有缺陷单位的“捡漏价”。转售价格会记住这些。</div>',
  'New launch vs resale condo, what your money buys': '新盘还是转售公寓，你的钱买到的是什么',
  "<p>A <b>new launch</b> means progressive payments (lighter at the start), a brand-new place, and a wait of a few years, but you're buying off a showflat, not the real thing. A <b>resale</b> condo you can walk through, rent out from day one, and you see exactly what you get, but you pay the full amount sooner and it's not new.</p><div class=\"takeaway\">Want it now and no surprises → resale. Happy to wait and pay in stages → new launch.</div>":
    '<p><b>新盘</b>意味着分期付款（开头较轻松）、全新的房子，以及几年的等待，但你是看着样板房买的，不是实物。<b>转售</b>公寓你可以实地走一遍、第一天就能出租，看到的就是你买到的，但你要更早付清全款，而且不是新的。</p><div class="takeaway">想马上要、不想有意外 → 转售。愿意等、愿意分期付 → 新盘。</div>',
  'Buying with your partner, sort this out first': '和伴侣一起买房，先把这件事谈清楚',
  "<p>Decide early: <b>whose name(s)</b> the home goes under, and how you'd split it if life changes. Putting it in one name only can keep the other person's \"first-timer\" status free for a future second property (and dodge a big ABSD bill), but it has trade-offs for CPF use and protection.</p><div class=\"takeaway\">This decision is hard to undo later and can cost tens of thousands. Talk it through (with us, if useful) before you commit.</div>":
    '<p>尽早决定：房子登记在<b>谁的名下</b>，以及万一生活有变如何分配。只登记在一人名下，可以保留另一人的“首次购房者”身份用于将来的第二套房（并避开一大笔 ABSD），但这在 CPF 使用和保障上有取舍。</p><div class="takeaway">这个决定以后很难改，可能花掉数万元。动手之前先谈清楚（需要的话也可以找我们聊）。</div>',
  'What "leasehold" and lease decay really mean': '“租赁地契”和屋契递减到底是什么意思',
  "<p>Most homes here sit on a <b>99-year lease</b>, a clock that matters. As it runs down, the home's <b>value falls</b> and buyers can use <b>less loan and CPF</b> on it, which shrinks your future buyer pool. <b>Freehold</b> never expires, which is why it costs more.</p><div class=\"takeaway\">On an older flat, always ask how many years are left, it quietly drives both price and how easily you'll resell.</div>":
    '<p>这里大多数房子是<b>99 年地契</b>，这是一个重要的倒计时。随着年限递减，房子<b>价值下降</b>，买家能用的<b>贷款和 CPF 也更少</b>，这会缩小你未来的买家群。<b>永久地契</b>永不到期，所以更贵。</p><div class="takeaway">买较旧的组屋时，一定要问还剩多少年，它悄悄影响价格和你转售的难易。</div>',
  'How much cash you actually need upfront': '你前期到底需要多少现金',
  "<p>You can't do it all with CPF. At least <b>5% of the price must be actual cash</b>, and your <b>stamp duty and legal fees are cash</b> too. On a resale flat, any amount above HDB's valuation is also cash. People get caught not by the down payment, but by the cash slices stacked on top of it.</p><div class=\"takeaway\">Map your cash separately from your CPF before you start. Running short at completion is the worst time to find out.</div>":
    '<p>你不可能全用 CPF。房价的至少 <b>5% 必须是真正的现金</b>，你的<b>印花税和律师费也是现金</b>。转售组屋里，任何高出 HDB 估值的部分也是现金。人们栽跟头往往不在首付，而在叠加其上的那几笔现金。</p><div class="takeaway">开始之前，把现金和 CPF 分开规划好。在交易完成时才发现钱不够，是最糟糕的时机。</div>',
  'Upgrading: should you sell first or buy first?': '换房：该先卖还是先买？',
  "<p><b>Buy first</b> and for a moment you own two homes, so you pay <b>ABSD</b> (a large sum) upfront, and only claim it back if you sell the old one within the timeline. <b>Sell first</b> and you skip the ABSD cash crunch, but you may need somewhere to stay in between. Getting the order and timing right can save you a five-figure sum.</p><div class=\"takeaway\">This is the single most expensive thing to get wrong when upgrading. Plan the sequence early. <a class=\"tl\" href=\"../tools/stamp-duty.html\">See the ABSD figure →</a></div>":
    '<p><b>先买</b>，你会有一段时间同时拥有两套房，所以要先预缴<b>ABSD</b>（一大笔钱），只有在期限内卖掉旧房才能退回。<b>先卖</b>，你避开 ABSD 的现金压力，但中间可能需要找地方住。把顺序和时机弄对，可能为你省下五位数。</p><div class="takeaway">这是换房时最烧钱的一个环节，最容易出错。尽早规划好顺序。<a class="tl" href="../tools/stamp-duty.html">查看 ABSD 金额 →</a></div>',
  'The CPF "accrued interest" trap when you sell': '卖房时的 CPF “累计利息”陷阱',
  "<p>Using CPF for your home isn't free money. When you sell, you must <b>return everything you took out, plus the interest it would have earned</b> sitting in your CPF (around 2.5% a year, compounding). On a home held many years, that's a big number, and it comes out of your sale proceeds, not thin air.</p><div class=\"takeaway\">Your cash-in-hand after selling is often far less than \"sale price minus loan\". Check the real number before you count on it. <a class=\"tl\" href=\"../tools/sell.html\">Your net proceeds →</a></div>":
    '<p>用 CPF 买房不是免费的钱。卖房时，你必须<b>把取出的全部连同它本可赚到的利息一起还回</b>你的 CPF（每年约 2.5%，按复利计算）。持有多年的房子，这是一笔大数目，而且是从你的卖房所得里扣，不是凭空冒出来的。</p><div class="takeaway">卖房后你实际到手的现金，往往远少于“售价减贷款”。在你指望这笔钱之前，先算出真实数字。<a class="tl" href="../tools/sell.html">你的卖房净得 →</a></div>',

  // ── article library + closing ──
  'Read deeper': '深入阅读',
  'Longer reads on the questions that come up most, in plain English. We add to this as we go, so check back.':
    '针对最常见问题的更长文章，用大白话写成。我们会持续增加，欢迎常来看看。',
  'Buying': '买房', 'Selling': '卖房', 'Costs & financing': '成本与融资',
  '1 article': '1 篇文章', 'more coming': '更多即将推出',
  'How much do you really need to buy an HDB flat?': '买一套组屋到底需要多少钱？',
  'Costs · 6 min': '成本 · 6 分钟',
  'The cash and CPF, stamp duty, fees, your monthly repayment, and the grants that bring it all down. Piece by piece.':
    '现金和 CPF、印花税、各项费用、你的月供，以及把这一切拉低的补贴。一项一项讲清楚。',
  'Read it →': '阅读全文 →',
  'New reads on pricing, timing and your net proceeds are on the way.': '关于定价、时机和卖房净得的新文章即将推出。',
  'Loans, stamp duty and the cash traps, explained simply. Coming soon.': '贷款、印花税和现金陷阱，简单讲清。即将推出。',
  "That's completely normal, and exactly what we're here for. Tell us your situation and we'll point you to the right next step. No obligation.":
    '这完全正常，也正是我们存在的意义。告诉我们你的情况，我们会为你指出合适的下一步。没有义务。',
  'Ask us →': '问我们 →', 'Browse the tools': '浏览工具',
  'Short summaries to get you oriented, not financial or legal advice, and the rules change. Always confirm the specifics with a banker, lawyer, HDB, or with us before you commit.':
    '只是帮你快速了解的简短摘要，不构成财务或法律建议，且规则会变。在你做决定之前，务必向银行人员、律师、HDB 或我们确认具体细节。'
});
