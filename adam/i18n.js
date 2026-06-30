/* PropSight i18n — shared, tiny, English-default language layer.
   Load this on EVERY page (before nav.js). Chinese is an ADDITIVE swap layer:
   English always stays in the DOM as the fallback, so a missing/broken key can
   never lose the English text. Pages opt content in with data-i18n / data-i18n-ph.
   Public API: window.PSI18N { lang, t(s), apply(), add(dict), set(lang) }. */
(function () {
  var DICT = {
    // ── shared chrome (nav + footer + badges), keyed by the English string ──
    'Tools': '工具', 'Research': '楼盘研究', 'New Launches': '新盘', 'Market Pulse': '市场动态',
    'News': '房产新闻', 'Guide': '购房指南', 'About us': '关于我们', 'Contact': '联系我们',
    'Listing Platform': '房源平台', 'Coming soon': '即将推出',
    'Coming soon, step into the platform': '即将推出，进入平台看看',
    'Sign in': '登录', 'Join free': '免费加入', 'Join free →': '免费加入 →',
    'Already a member? Sign in': '已是会员？登录',
    'Featured': '精选', 'Smart': '智能', 'Soon': '即将',
    'Singapore': '新加坡', 'About': '关于', 'Privacy': '隐私', 'Terms': '条款',
    'PropSight is information only, not financial or property advice. Figures are estimates; verify before acting.':
      'PropSight 仅供参考，不构成财务或房产建议。所有数据均为估算，行动前请自行核实。',

    // ── homepage hero (explicit keys) ──
    'hero.eyebrow': '新加坡房产洞察',
    'hero.h1a': '新加坡房产，', 'hero.h1b': '一目了然。',
    'hero.leadLg': '免费看懂新加坡房产。用真实的近期成交估算任何组屋或公寓，深入研究每个楼盘和区域，算出你负担得起的预算，读真正重要的房产新闻，全部用大白话。没有中介推销，只有真实数据。再加上 Aillie，让你买卖都心里有数。',
    'hero.leadSm': '免费看懂新加坡房产。真实估值、深入研究、你负担得起的预算，还有真正重要的房产新闻，全部用大白话。再加上 Aillie，让你买卖都心里有数。',
    'cta.join': '免费加入', 'cta.askAillie': '问 Aillie', 'cta.value': '估算房价',
    'chatcue.t': '有问题尽管问 Aillie', 'chatcue.s': '真实数据 · 免费',

    // ── Aillie chat (display-only: greeting + disclaimer; keyed by the English text) ──
    "Hi! I'm Aillie, PropSight's property intelligence. I can be wrong, so please verify anything important before acting on it. I value any HDB or condo on real recent sales, check a project's price trend and rental yield, or work out your budget. What can I help you with?":
      '你好！我是 Aillie，PropSight 的房产智能助手。我也可能出错，重要的事情请先自行核实再行动。我可以用真实的近期成交估算任何组屋或公寓的价值，查看楼盘的价格走势和租金回报，或帮你算出预算。有什么可以帮你？',
    'aillie.disc': 'Aillie 也可能出错，行动前请核实 · 不构成财务建议',
    // chip labels (kept for later; chips stay English for now so Aillie's English intent-router still works)
    "What's my home worth?": '我的房子值多少？',
    'What can I afford?': '我能负担多少？',
    'Homes near a school': '学校周边的房子',
    'Price trend for a project': '某楼盘的价格走势',
    'See new launches': '查看新盘',

    // ── homepage: hero extras ──
    'Free membership': '免费会员',
    ', the full research, more chats with Aillie, a weekly newsletter & live Telegram signals.': '，完整研究、更多 Aillie 对话、每周通讯和实时 Telegram 信号。',
    'Join in 10 seconds.': '十秒完成注册。',
    'Coming soon:': '即将推出：',
    'a PropSight listings platform, every home with the real numbers built in.': 'PropSight 房源平台，每套房子都内置真实数据。',
    'Home values · affordability · stamp duty · grants · schools · selling · eligibility,': '房价估值 · 负担能力 · 印花税 · 补贴 · 学校 · 卖房 · 购买资格，',
    'all free, all here.': '全部免费，全在这里。',
    'New to property? Start with the guide →': '刚接触房产？从购房指南开始 →',
    'Live · built on official URA data · refreshed weekly': '实时 · 基于 URA 官方数据 · 每周更新',
    'Add this hub to your phone, one tap to every tool': '把这个平台添加到手机，一键直达所有工具',

    // ── homepage: mobile menu ──
    'Add to your phone': '添加到手机',
    "Let's talk →": '找我们聊聊 →',

    // ── homepage: "What brings you here" ──
    'Start here': '从这里开始',
    'What brings you here?': '你来这里想做什么？',
    "No menus to dig through, pick where you are, and we'll show you only what's useful.": '不用翻一堆菜单，选一个最贴近你的情况，我们只给你有用的。',
    "I'm buying": '我要买房',
    'See what you can afford, value any home, and find the areas that fit, before you fall for the wrong one.': '先看看你能负担多少，估算任何房子的价值，找到适合的区域，免得爱上不该爱的房子。',
    'Start buying': '开始买房',
    "I'm selling": '我要卖房',
    "What it's worth, when you can sell penalty-free, and what you'll actually walk away with, upfront.": '它值多少，什么时候卖不用多缴税，以及你最后能实拿多少，先告诉你。',
    'Start selling': '开始卖房',
    'Just exploring': '只是看看',
    'New to all this? Start with the Guide, how it actually works, start to finish, then play with the tools at your pace.': '刚开始了解？先看购房指南，从头到尾讲清楚整个流程，然后按自己的节奏试用工具。',
    'Open the Guide': '打开指南',
    'Watching the market': '关注市场',
    "Not moving yet, just keeping an eye on prices? Our weekly Market Pulse, what's rising, which areas are hot, and whether it's a good time.": '还没打算出手，只想盯着价格？我们的每周市场动态：什么在涨、哪些区域火、现在是不是好时机。',
    'See the Market Pulse': '查看市场动态',

    // ── homepage: toolkit ──
    'Free · no sign-up': '免费 · 无需注册',
    'The toolkit.': '工具箱。',
    'The kind of data the portals keep behind a wall, here, free, for you.': '房产网站收费才给你的数据，这里免费，全给你。',
    'All tools': '全部工具', 'For buyers': '买家', 'For sellers': '卖家', 'For exploring': '探索',
    'Affordability': '负担能力', 'Your real budget': '你的真实预算',
    'Home value': '房价估值', "What it's worth": '它值多少', 'Most useful': '最实用',
    'Stamp duty': '印花税', 'BSD and ABSD': 'BSD 和 ABSD',
    'Near a school': '学校周边', '1km / 2km zones': '1公里 / 2公里范围',
    'Net proceeds': '卖房净得', 'What you pocket': '你能实拿多少', 'Next step': '下一步',
    'Eligibility': '购买资格', 'Can I buy it?': '我能买吗？',
    'Grants': '购房补贴', 'CPF housing grants': 'CPF 购房补贴', 'Go deeper': '深入了解',
    'Condos and HDB': '公寓和组屋', 'Ask Aillie': '问 Aillie', 'Get real numbers': '获取真实数据',
    'Free': '免费',

    // ── homepage: news + guide + about + contact ──
    'Singapore property news': '新加坡房产新闻',
    "What's moving in the market.": '市场上正在发生什么。',
    'The headlines that matter for your home, with what each one means for you. The latest, on top.': '对你的房子真正重要的新闻，告诉你每条意味着什么。最新的排在最上面。',
    'See all news →': '查看所有新闻 →',
    'Loading the latest…': '正在加载最新内容…',
    'See all property news': '查看所有房产新闻',
    'The Guide': '购房指南',
    'New here? Learn how it all works.': '新手上路？先搞懂整个流程。',
    "Never bought before? Don't know your OTP from your ABSD? Our guide walks you through the whole process, step by step, plus the tips that quietly save people money.": '第一次买房？分不清 OTP 和 ABSD？这份指南一步步带你走完整个流程，还有那些悄悄帮人省钱的小贴士。',
    'Step by step': '分步讲解',
    'How buying actually works': '买房到底怎么走',
    'The full journey for a condo or HDB, from first viewing to keys in hand, and exactly what you pay at each step.': '从第一次看房到拿钥匙，公寓或组屋的完整流程，以及每一步要付多少钱。',
    'See the steps': '查看步骤',
    'How selling works': '卖房怎么走',
    'The selling journey end to end, plus the timing traps near the finish line that catch people out.': '从头到尾的卖房流程，以及临近收尾时在时机上容易踩的坑。',
    'Tips': '小贴士',
    'Tips worth knowing': '值得知道的小贴士',
    "Straight answers to the things every buyer wishes they'd known first, budgets, hidden costs, lease decay and more.": '每个买家都希望早点知道的事，直接给你答案：预算、隐藏成本、屋契递减等等。',
    'Read the tips': '阅读贴士',
    'Open the Guide →': '打开指南 →',
    'The story behind PropSight': 'PropSight 背后的故事',
    'Why we built it, and everything the platform does.': '我们为什么做它，以及这个平台能做的一切。',
    'About us →': '关于我们 →',
    'When you\'re ready': '准备好了就来',
    "Let's figure out your move.": '一起想清楚你的下一步。',
    'A question about a home, a project, the platform, or anything at all, ask away. A straight conversation, no obligation, no sales script. Message us directly, anytime.': '关于某套房子、某个楼盘、这个平台，或任何事情，尽管问。直接聊，没有义务，没有推销话术。随时直接联系我们。',
    'Message us': '联系我们',
    'Prefer email? Reach us anytime, about anything:': '更喜欢电邮？任何事都可以随时找我们：',
    'Add this hub to your phone, one tap to every tool →': '把这个平台添加到手机，一键直达所有工具 →',
    'PropSight · Singapore · built on official data · indicative, not financial advice': 'PropSight · 新加坡 · 基于官方数据 · 仅供参考，不构成财务建议',

    // ══ TOOLS: shared across all tool pages ══
    'More free tools': '更多免费工具',
    'Not sure about your situation?': '不确定自己的情况？',
    'Get a straight answer from our team.': '让我们团队给你一个直接的答案。',
    'Every number here is a guide. For your exact case — financing, timing, the smartest move — have a quick chat. No pressure, no sales script.':
      '这里的每个数字都只是参考。想了解你的具体情况，融资、时机、最聪明的做法，找我们聊几句就好。没有压力，没有推销话术。',
    'WhatsApp us →': 'WhatsApp 联系我们 →',
    'Value a home': '估算房价', 'Stamp duty & ABSD': '印花税与 ABSD', "What you'll pay": '你要付多少',
    'Find your grant': '查找你的补贴', '1km / 2km finder': '1公里 / 2公里查找',
    'Net sale proceeds': '卖房净得', 'Eligibility check': '购买资格查询',
    // common form vocabulary (appears across several tools)
    'HDB flat': '组屋', 'Private / condo': '公寓 / 私宅', 'New EC': '新 EC', 'Private / condo ': '公寓 / 私宅',
    '(optional)': '（可选）', 'Which loan?': '哪种贷款？', 'Bank loan': '银行贷款', 'HDB loan': 'HDB 贷款',
    'Loan length': '贷款年限', 'Who\'s buying?': '谁来买？', 'What are you buying?': '你想买什么？',
    'Singapore Citizen': '新加坡公民', 'PR': '永久居民 (PR)', 'Foreigner': '外国人', 'Yes': '是', 'No': '否',

    // ══ value.html ══
    "What's your home worth?": '你的房子值多少？',
    'Home valuation': '房产估值',
    'A real estimate for any HDB flat or condo, plus reference prices for landed homes and new launches, built from actual, recent transactions. No sign-up, no agent calling you after.':
      '为任何组屋或公寓提供真实估算，还有有地住宅和新盘的参考价格，全部基于真实的近期成交。无需注册，事后也不会有中介打电话给你。',
    'Condo / private': '公寓 / 私宅', 'Landed': '有地住宅', 'New launch': '新盘',
    'Your address': '你的地址',
    'Just start typing your street, then pick it from the list.': '开始输入你的街道名，然后从列表中选择。',
    'Block': '座号', 'Values your exact block.': '估算你具体那一座。',
    'Flat type': '组屋类型', 'Pick your street first…': '请先选择街道…',
    'Floor area': '面积', 'In sqft. Leave blank for a typical unit.': '单位为平方英尺。留空则按典型单位计算。',
    'Storey': '楼层', 'Roughly which floor': '大约第几层',
    'Project name': '楼盘名称', 'Start typing a condo…': '开始输入公寓名…',
    'Floor': '楼层', 'Roughly which level': '大约第几层',
    'Street or area': '街道或区域',
    'Type at least 2 letters, then pick your street from the list.': '至少输入2个字母，然后从列表中选择街道。',
    'Landed type': '有地住宅类型',
    'Terrace, semi-detached or detached. Leave on "All landed" to see everything.': '排屋、半独立式或独立式。保持“所有有地住宅”可查看全部。',
    'All landed': '所有有地住宅', 'Terrace': '排屋', 'Semi-detached': '半独立式', 'Detached': '独立式',
    'New launch project': '新盘楼盘', 'Start typing, then pick the launch from the list.': '开始输入，然后从列表中选择新盘。',
    'Value this home →': '估算这套房 →',
    'Estimated value range': '估算价值区间', 'Ask us for a precise valuation →': '向我们咨询精确估值 →',
    'Estimated value': '估算价值', 'High confidence': '高度可信', 'Fair confidence': '中等可信', 'Indicative': '仅供参考',
    'Price per sqft': '每平方英尺价格', 'what comparable homes fetch': '同类房子的成交价',
    'Recent sales ranged': '近期成交区间', 'actual transacted prices, low to high': '实际成交价，从低到高',
    'Based on': '依据', 'The recent sales behind this number': '支撑这个数字的近期成交',
    'Type your street and pick it from the list.': '输入你的街道并从列表中选择。',
    'Pick a flat type.': '请选择组屋类型。', 'Pick a project from the list.': '请从列表中选择楼盘。',
    'Type a project and pick it from the list.': '输入楼盘并从列表中选择。',
    'No data': '暂无数据', 'No matching street, try fewer words.': '没有匹配的街道，试试少输入几个字。',
    'No matching project.': '没有匹配的楼盘。', 'No matching launch.': '没有匹配的新盘。',
    'Something went wrong, try again.': '出了点问题，请重试。', 'Working…': '处理中…',
    'lots of recent, similar sales nearby, this is a solid estimate': '附近有很多近期的同类成交，这是一个可靠的估算',
    'a fair number of comparable sales, a reasonable guide': '有相当数量的同类成交，可作合理参考',
    'fewer or more varied sales, so treat this as a rough guide': '成交较少或差异较大，请当作粗略参考',

    // ══ afford.html ══
    'What can you actually afford?': '你到底能负担多少？',
    'Work out the home price that fits your income and savings, using the same lending rules the banks must follow. Do this before you fall for anything.':
      '用银行必须遵守的贷款规则，算出适合你收入和存款的房价。在心动之前先算清楚。',
    'New to this? Start with the Guide →': '新手？先看购房指南 →',
    'HDB flats and new ECs have a stricter cap, the loan alone can\'t exceed 30% of your income.': '组屋和新 EC 有更严格的上限，单是贷款就不能超过你收入的 30%。',
    'Your gross monthly income': '你的每月税前收入', 'Before CPF. Combine both incomes if buying together.': '扣 CPF 之前。两人同买就把收入加在一起。',
    'Monthly debt repayments': '每月债务还款', 'Car, other loans, card minimums': '车贷、其他贷款、信用卡最低还款',
    'Your age': '你的年龄', 'The oldest borrower': '年龄最大的借款人',
    'Cash savings': '现金存款', 'For the home': '用于买房',
    'CPF you\'ll use': '你会动用的 CPF',
    'Your CPF Ordinary Account (OA), goes toward the down payment & stamp duty, not the minimum cash. Wise to keep a little as buffer.': '你的 CPF 普通账户 (OA)，用于首付和印花税，不能抵最低现金。留一点作缓冲比较明智。',
    'Housing grant': '购房补贴', 'First-timer HDB/EC? Find your grant → (it\'s added to your CPF)': '首次购房 HDB/EC？查找你的补贴 →（会加入你的 CPF）',
    '25 years': '25 年', 'Remaining lease': '剩余屋契',
    'Only for an older home. Leave blank for a new or freehold one. On a short lease, the rules cut how much CPF and loan you can use.': '只用于较旧的房子。新房或永久地契请留空。屋契短的话，规则会减少你能用的 CPF 和贷款。',
    'Your realistic ceiling': '你的实际上限', 'Get a proper assessment from our team →': '让我们团队为你做正式评估 →',
    'Stamp duty calculator': '印花税计算器',
    'Enter your monthly income to see what you can afford.': '输入你的每月收入，看看你能负担多少。',
    'Indicative only, not financial advice. Always confirm with a banker.': '仅供参考，不构成财务建议。请务必向银行人员确认。',
    'the most you should look at, many buyers aim a bit below this for breathing room': '这是你最高应考虑的价位，很多买家会留一点余地，看得略低一些',
    'Home price': '房价', 'the ceiling for your search': '你选房的上限',
    "Loan you'd take": '你要借的贷款', 'You put down': '你的首付', 'Monthly repayment': '每月还款',
    'Cash needed upfront': '前期所需现金', 'min cash + stamp duty + ~$3k legal/fees allowance': '最低现金 + 印花税 + 约 $3k 律师费等',

    // ══ stamp-duty.html ══
    "Buyer's stamp duty": '买方印花税', 'How much stamp duty will you pay?': '你要付多少印花税？',
    "Enter the price and a couple of details, we'll show you the tax you'll pay on a Singapore home, to the dollar. Updated to the latest official rates.":
      '输入价格和几个细节，我们就告诉你在新加坡买房要付的税，精确到元。已更新至最新官方税率。',
    "The home's price": '房子的价格',
    "Your residency sets the extra duty (ABSD). If buying jointly, the highest-duty owner's status applies to the whole purchase.":
      '你的居民身份决定额外的印花税 (ABSD)。如果联名购买，整笔交易按税率最高的那位业主的身份计算。',
    'Is this your…': '这是你第几套房？',
    "Count every home you (and your spouse) already own or part-own, that's what decides the ABSD tier, not just homes in your name.":
      '把你（和配偶）已经拥有或部分拥有的每一套房都算进去，这才是决定 ABSD 档次的依据，不只是登记在你名下的。',
    '1st home': '第1套房', '2nd home': '第2套房', '3rd+ home': '第3套及以上',
    'Total stamp duty': '印花税总额', 'Ask us about your purchase →': '就你的购房咨询我们 →',
    "Buyer's Stamp Duty": '买方印花税', 'everyone pays this': '人人都要付',
    'Additional Stamp Duty': '额外印花税', 'none for this profile': '此情况无需缴纳',
    // stamp-duty result sentences (templates + fragments)
    'on a {price} home': '房价 {price}',
    '2nd+ home': '第2套及以上', 'foreigner': '外国人',
    'is the basic tax everyone pays when buying a home, it steps up with the price.': '是买房时人人都要付的基本税，会随房价递增。',
    "because this isn't your first home": '因为这不是你的第一套房',
    'because PRs pay additional duty': '因为永久居民需缴额外印花税',
    '(more from the second home)': '（第二套起更高）',
    'because foreign buyers pay additional duty': '因为外国买家需缴额外印花税',
    'adds {ar}% on top, {why}.': '再加收 {ar}%，{why}。',
    "There's no extra ABSD here, a Singapore Citizen's first home pays only the basic duty.": '这里没有额外的 ABSD，新加坡公民的第一套房只付基本印花税。',
    'Both are due within 14 days of signing.': '两者都需在签约后 14 天内缴清。',
    "Additional Buyer's Stamp Duty (ABSD)": '额外买方印花税 (ABSD)', 'Note:': '注意：',
    "some nationalities are taxed at citizen rates under trade agreements, US citizens, and citizens & PRs of Iceland, Liechtenstein, Norway and Switzerland. If that's you, message us to check.":
      '根据贸易协定，部分国籍按公民税率征税：美国公民，以及冰岛、列支敦士登、挪威和瑞士的公民及永久居民。如果你符合，请联系我们核实。',
    'Upgrading as a married couple?': '夫妻换房升级？',
    "If you're buying your next home before selling your current one, you pay this ABSD upfront, but a married couple with at least one Singapore Citizen can claim it back in full, as long as you sell the first home within 6 months of buying the second (for a completed property). Worth planning the timing with us before you commit.":
      '如果你在卖掉现有房子之前就买下一套，需先预缴这笔 ABSD；但只要夫妻中至少一方是新加坡公民，并在买第二套后 6 个月内卖出第一套（已建成的房产），就可以全额退回。动手之前值得和我们一起规划好时机。',

    // ══ sell.html ══
    'Sale proceeds': '卖房净收益', 'What will you walk away with?': '你最后能拿到多少？',
    "Selling a home? See if Seller's Stamp Duty applies, and exactly what lands in your pocket after the loan, your CPF refund and selling costs.":
      '要卖房？看看是否需缴卖方印花税 (SSD)，以及扣除贷款、CPF 退还和卖房成本后，你实际能拿到多少。',
    'What are you selling?': '你要卖什么？',
    "HDB flats are exempt from Seller's Stamp Duty, the minimum occupation period already covers it.":
      '组屋免缴卖方印花税，最低居住年限 (MOP) 已经覆盖了这段时间。',
    'When did you buy it?': '你什么时候买的？', 'The date you signed the purchase': '你签购房合同的日期',
    'When are you selling?': '你打算什么时候卖？', 'Leave as today if unsure': '不确定就保留今天的日期',
    'What you paid': '你的买入价', 'Your purchase price': '你当初的购买价',
    'Expected sale price': '预期售价', "What you'll sell for": '你打算卖多少',
    'Outstanding home loan': '未还清的房贷', 'Left to repay the bank': '还要还给银行的部分',
    'CPF to refund': '需退还的 CPF', 'Used + accrued interest, from your CPF statement': '已动用金额 + 累计利息，见你的 CPF 对账单',
    'Agent fee': '中介佣金', '% of sale price (GST added)': '售价的百分比（加 GST）',
    'Legal & misc': '律师费及杂费', 'Conveyancing, admin': '产权过户、行政费',
    'Cash in your pocket': '你实拿的现金', 'Get a proper sale plan from our team →': '让我们团队为你制定卖房方案 →',
    'What can I afford next?': '下一套我能负担多少？',
    'Sale price': '售价', 'what the buyer pays': '买家支付的金额',
    'Repay your home loan': '偿还房贷', 'released to the bank': '支付给银行',
    "Seller's Stamp Duty": '卖方印花税', 'Agent fee + GST': '中介佣金 + GST',
    'conveyancing, admin': '产权过户、行政费', 'Refund to your CPF': '退还到你的 CPF',
    'principal + accrued interest → your OA': '本金 + 累计利息 → 你的 OA',
    'what you can actually use': '你实际可动用的', 'what lands in your bank after everything is settled': '一切结清后到账的金额',
    'Enter when you bought to check Seller\'s Stamp Duty.': '输入你的买入日期，查看是否需缴卖方印花税。',

    // ══ grants.html ══
    'Housing grants': '购房补贴', 'What grants can you get?': '你能拿到哪些补贴？',
    'First-time buyers can get tens of thousands in CPF housing grants, most people have no idea how much. Answer a few things and see your likely total.':
      '首次购房者可以拿到数万元的 CPF 购房补贴，多数人根本不知道有多少。回答几个问题，看看你大概能拿多少。',
    'Have you taken a housing subsidy before?': '你以前领过购房补贴吗？',
    'A "first-timer" has never received an HDB/CPF housing grant or subsidised flat.': '“首次购房者”指从未领过 HDB/CPF 购房补贴或津贴组屋的人。',
    'First-timer': '首次购房者', 'Taken one before': '以前领过',
    'Your first subsidised flat was a…': '你第一套津贴组屋是…',
    "Second-timers pay a resale levy when buying another subsidised flat. It's based on this first flat.":
      '二次购房者再买津贴组屋时要缴转售税 (resale levy)，按这第一套房计算。',
    '2-room': '2房式', '3-room': '3房式', '4-room': '4房式', '5-room': '5房式', 'Executive': '公寓式',
    'Couple (both SC)': '夫妻（双方都是公民）', 'SC + PR': '公民 + 永久居民', 'Single (SC, 35+)': '单身（公民，35岁以上）',
    'Resale HDB': '转售组屋', 'BTO (new HDB)': 'BTO（新组屋）', 'Flat size': '组屋面积',
    '4-room or smaller': '4房式或更小', '5-room or bigger': '5房式或更大',
    'Buying near family?': '买在家人附近？',
    "Living with, or within 4km of, your parents' or kids' home (resale only).": '与父母或子女同住，或在其住所 4 公里内（仅限转售）。',
    'Within 4km': '4公里内', 'Living together': '同住',
    'Average monthly household income': '家庭平均月收入', 'Gross, before CPF, combine both incomes.': '税前（扣 CPF 前），两人收入相加。',
    'You could get about': '你大概能拿到', 'Add this to "What can I afford?" →': '把这个加进“我能负担多少？” →',
    'Ask us to confirm →': '让我们帮你确认 →',
    'Enhanced CPF Housing Grant (EHG)': '强化版 CPF 购房补贴 (EHG)', 'CPF Housing Grant (Family)': 'CPF 购房补贴（家庭）',
    'Proximity Housing Grant': '就近购房补贴 (PHG)', 'EC Family Grant': 'EC 家庭补贴',
    'into your CPF, to help pay for the home': '存入你的 CPF，用于支付房款',
    'no grants for this combination, see the notes': '这种组合没有补贴，详见说明',
    'No grants apply to these answers.': '根据你的回答，没有适用的补贴。',
    "Resale levy you'll owe": '你需缴的转售税',
    'EHG is for first-timers only.': 'EHG 仅限首次购房者。',
    'The EC grant is for first-timers.': 'EC 补贴仅限首次购房者。',
    'Proximity & Family grants are for resale flats, not BTO.': '就近补贴和家庭补贴适用于转售组屋，不适用于 BTO。',

    // ══ eligibility.html ══
    'Can you actually buy it?': '你到底能不能买？',
    "Before you fall for a flat or a condo, check if you're even allowed to buy it. Citizenship, income limits, owning private property, and how long you're locked in.":
      '在你看上某套组屋或公寓之前，先确认你到底有没有资格买。公民身份、收入限制、是否拥有私宅，以及锁定期有多长。',
    'What do you want to buy?': '你想买什么？', 'HDB resale flat': '转售组屋', 'Private condo': '私人公寓',
    'You are a…': '你是…', 'With family / partner': '与家人 / 伴侣', 'On my own': '我自己一个人',
    'Are you 35 or older?': '你年满35岁吗？',
    'A single can buy a resale flat on their own only from age 35.': '单身者只有年满35岁才能独自购买转售组屋。',
    'Do you own, or sold in the last ~2.5 years, a private property?': '你是否拥有、或在过去约2.5年内卖出过私宅？',
    'Household monthly income': '家庭月收入', 'New ECs have a $16,000 income ceiling.': '新 EC 的收入上限为 $16,000。',
    'Will you take an HDB loan or a CPF housing grant?': '你会用 HDB 贷款或 CPF 购房补贴吗？',
    'This sets your wait-out, 15 months without, 30 months with.': '这决定你的等待期：不用为15个月，用了为30个月。',
    'A Singapore Citizen aged 55+, buying a 4-room or smaller flat?': '55岁以上的新加坡公民，购买4房式或更小的组屋？',
    "If yes, you're exempt from the wait-out entirely.": '如果是，你完全无需等待期。',
    'Ask us to check your case →': '让我们帮你核查情况 →',
    'You can, with extra cost': '可以，但有额外成本', "You're good": '你没问题', 'Not allowed': '不允许',
    'Only with the right partner': '需符合条件的共同买家', 'Not yet': '还不行', "You're eligible": '你符合资格',
    'Over the limit': '超过上限', 'Eligible, a few conditions': '符合资格，有几个条件',
    'Eligible, but sell & wait first': '符合资格，但需先卖房并等待', 'Eligible, but sell &amp; wait first': '符合资格，但需先卖房并等待',
    'Yes, foreigners can buy a private condo.': '可以，外国人可以购买私人公寓。',
    'Yes, no eligibility limits on private property.': '可以，私宅没有资格限制。',
    "Foreigners can't buy HDB flats.": '外国人不能购买组屋。',
    "A PR can't buy a resale flat alone.": '永久居民不能独自购买转售组屋。',
    'As a single Singapore Citizen, you can buy a resale flat on your own only from age 35.': '作为单身新加坡公民，你只有年满35岁才能独自购买转售组屋。',
    'Yes, a single Singapore Citizen aged 35+ can buy a resale flat.': '可以，年满35岁的单身新加坡公民可以购买转售组屋。',
    'Yes, as a Singapore Citizen you can buy a resale flat.': '可以，作为新加坡公民你可以购买转售组屋。',
    "New ECs aren't open to foreigners.": '新 EC 不向外国人开放。', 'Yes, you can buy a new EC.': '可以，你可以购买新 EC。',
    '💬 WhatsApp us →': '💬 WhatsApp 联系我们 →',

    // ══ schools.html ══
    'School proximity': '学校距离', 'Homes near a primary school': '小学周边的房子',
    'Buying with P1 registration in mind? Pick a school and see which condos sit within 1km (top priority) and 1-2km (next in line), measured straight-line, the same way MOE does.':
      '考虑小一报名 (P1)？选一所学校，看看哪些公寓在 1 公里内（最高优先）和 1-2 公里（其次），按直线距离测量，和教育部的算法一样。',
    'Search a primary school': '搜索小学', 'Popular:': '热门：', 'Private condos': '私人公寓',
    'Both groups below get registration priority over homes more than 2km away. The 1km group is first, then 1-2km.':
      '下面两组都比 2 公里以外的住宅享有报名优先权。1 公里组排第一，然后是 1-2 公里。',
    '1 km': '1 公里', '1-2 km': '1-2 公里',
    'Within 1km, top priority for P1 registration': '1公里内，P1 报名最高优先',
    'Highest priority in the ballot for Singapore Citizens': '在抽签中对新加坡公民优先级最高',
    '1-2km, next priority': '1-2公里，其次优先',
    'Comes after the 1km group, ahead of homes beyond 2km': '排在 1 公里组之后，2 公里以外之前',
    'HDB streets within 1km': '1公里内的组屋街道', 'Top priority distance for P1 registration': 'P1 报名的最高优先距离',
    'HDB streets 1-2km': '1-2公里的组屋街道', 'Next priority after the 1km group': '1公里组之后的次优先',
    'Ask us about a school-zone home →': '就学区房咨询我们 →',
    "Couldn't load school data, please refresh.": '无法加载学校数据，请刷新。', 'No primary school matches that.': '没有匹配的小学。',

    // ══ mortgage.html ══
    'Mortgage': '房贷', 'What will your home loan cost a month?': '你的房贷每月要还多少？',
    "See your monthly repayment, the total interest you'll pay, and the full cost of the loan, for a bank loan or an HDB loan, at any rate and tenure.":
      '查看你的每月还款、总利息和贷款总成本，适用于银行贷款或 HDB 贷款，任意利率和年限。',
    'Not sure of your budget? Check what you can afford →': '不确定预算？看看你能负担多少 →',
    'An HDB loan uses the concessionary rate. Bank packages move with the market, so set your own rate below.':
      'HDB 贷款采用优惠利率。银行配套随市场浮动，请在下方设置你自己的利率。',
    'Property price': '房产价格', 'The purchase price of the home.': '房子的购买价格。',
    'Down payment': '首付', 'The part you pay yourself': '你自己支付的部分',
    'Down payment %': '首付百分比', 'Of the price': '占房价的比例',
    'Interest rate': '利率', "Your loan's yearly interest rate. Bank packages are typically around 3 to 4%.": '你贷款的年利率。银行配套通常在 3 到 4% 左右。',
    'Your monthly repayment': '你的每月还款',
    'Loan amount': '贷款金额', 'Total interest': '总利息', 'Total you repay': '你总共偿还', 'Interest vs loan': '利息占贷款比例',
    'price minus your down payment': '房价减去首付', 'principal + interest': '本金 + 利息',
    'interest as a share of the amount borrowed': '利息占借款金额的比例',
    'Your down payment covers the whole price, so there is no loan to repay.': '你的首付已覆盖全部房价，无需偿还贷款。',
    'Enter a property price to see your repayment.': '输入房产价格，查看你的还款。',
    'Talk to our team about financing →': '就融资问题联系我们团队 →', 'Not sure which package?': '不确定选哪个配套？',
    'Every number here is a guide. For your exact case, the right loan, the timing, the smartest move, have a quick chat. No pressure, no sales script.':
      '这里的每个数字都只是参考。想了解你的具体情况，合适的贷款、时机、最聪明的做法，找我们聊几句就好。没有压力，没有推销话术。',

    // ══ member.js (signup / sign-in modal, rendered on demand → MutationObserver translates it) ══
    'See the full picture.': '看清全貌。',
    'Join PropSight free, see every condo & HDB in full, plus the weekly insights and live Telegram signals.':
      '免费加入 PropSight，完整查看每个公寓和组屋，还有每周洞察和实时 Telegram 信号。',
    'Full research': '完整研究', ', every condo & HDB, ranked, compared & tracked.': '，每个公寓和组屋，排名、对比、持续追踪。',
    'More of Aillie': '更多 Aillie', ', a higher chat limit with your property assistant.': '，更高的对话额度，畅聊你的房产助手。',
    'Weekly newsletter': '每周通讯', ', the moves that matter.': '，重要的市场动向。',
    'Telegram channel': 'Telegram 频道', ', live property signals as they happen.': '，实时房产信号，第一时间送达。',
    'First name': '名字',
    'By joining you agree to receive PropSight emails and accept our': '加入即表示你同意接收 PropSight 邮件，并接受我们的',
    'Privacy Policy': '隐私政策', '. Unsubscribe anytime.': '。可随时退订。',
    'Free forever · no password · unsubscribe anytime.': '永久免费 · 无需密码 · 可随时退订。',
    'Sign in to PropSight.': '登录 PropSight。',
    "No password needed, just enter the email you joined with and you're straight back in.": '无需密码，输入你注册时用的邮箱即可直接登录。',
    'Sign in →': '登录 →',
    'Please enter a valid email.': '请输入有效的电邮地址。', 'Joining…': '加入中…',
    "You're in! Check your email to confirm.": '你已加入！请查收邮件以确认。',
    'Something went wrong, please try again.': '出了点问题，请重试。', 'Network error, please try again.': '网络错误，请重试。',
    'Signing in…': '登录中…', 'Signed in ✓': '已登录 ✓', 'Signed in': '已登录',
    "Couldn't sign you in, please try again.": '无法登录，请重试。',
    "Full research, the higher Aillie limit, the weekly newsletter and the members' Telegram channel are all unlocked.":
      '完整研究、更高的 Aillie 额度、每周通讯和会员专属 Telegram 频道均已解锁。',
    'Join the Telegram channel →': '加入 Telegram 频道 →', 'Sign out': '退出登录'
  };

  var LANG = (function () { try { return localStorage.getItem('ps_lang') === 'zh' ? 'zh' : 'en'; } catch (e) { return 'en'; } })();
  if (window.PS_I18N_ZH) { for (var k in window.PS_I18N_ZH) DICT[k] = window.PS_I18N_ZH[k]; }  // pages may pre-register strings

  // normalize curly/straight apostrophes + quotes + whitespace so matching is punctuation-insensitive
  function norm(s) { return s.replace(/[‘’′]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim(); }
  var NORM = {};
  function buildNorm() { NORM = {}; for (var k in DICT) NORM[norm(k)] = DICT[k]; }
  buildNorm();

  function t(s) { return (LANG === 'zh' && (DICT[s] || NORM[norm(s)])) ? (DICT[s] || NORM[norm(s)]) : s; }

  // ── text-node auto-translation (zh only). Touches only text nodes, so structure survives. ──
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TIME: 1, CODE: 1, TEXTAREA: 1, PRE: 1 };
  function translateTextNode(n) {
    var p = n.parentNode;
    if (p && (SKIP[p.nodeName] || (p.hasAttribute && p.hasAttribute('data-i18n')))) return;
    var raw = n.nodeValue, key = norm(raw);
    if (!key) return;
    var val = NORM[key];
    if (val) n.nodeValue = (raw.match(/^\s*/) || [''])[0] + val + (raw.match(/\s*$/) || [''])[0];
  }
  function translatePlaceholder(el) {
    if (!el.getAttribute) return;
    var v = el.getAttribute('placeholder'); if (!v) return;
    var k = norm(v); if (k && NORM[k]) el.setAttribute('placeholder', NORM[k]);
  }
  function translateTree(root) {
    if (LANG !== 'zh' || !root) return;
    if (root.nodeType === 3) return translateTextNode(root);
    if (root.nodeType !== 1) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(translateTextNode);
    if (root.hasAttribute && root.hasAttribute('placeholder')) translatePlaceholder(root);
    if (root.querySelectorAll) root.querySelectorAll('[placeholder]').forEach(translatePlaceholder);
  }
  // Watch for JS-rendered content (tool results, Aillie messages, news cards) and translate it too.
  var moStarted = false;
  function startObserver() {
    if (moStarted || LANG !== 'zh' || typeof MutationObserver === 'undefined' || !document.body) return;
    moStarted = true;
    new MutationObserver(function (muts) {
      muts.forEach(function (m) { for (var i = 0; i < m.addedNodes.length; i++) translateTree(m.addedNodes[i]); });
    }).observe(document.body, { childList: true, subtree: true });
  }

  function apply() {
    var html = document.documentElement;
    html.lang = (LANG === 'zh' ? 'zh-Hans' : 'en');
    html.classList.toggle('lang-zh', LANG === 'zh');
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el._en === undefined) el._en = el.textContent;           // capture English once
      var key = el.getAttribute('data-i18n') || (el._en || '').trim();
      el.textContent = (LANG === 'zh' && DICT[key]) ? DICT[key] : el._en;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      if (el._enPh === undefined) el._enPh = el.getAttribute('placeholder') || '';
      var key = el.getAttribute('data-i18n-ph') || el._enPh;
      el.setAttribute('placeholder', (LANG === 'zh' && DICT[key]) ? DICT[key] : el._enPh);
    });
    // Bulk: auto-translate matching text nodes now, then keep watching for JS-rendered content.
    translateTree(document.body);
    startObserver();
    // any element tagged data-ps-langtoggle becomes a working 中文/EN switch
    document.querySelectorAll('[data-ps-langtoggle]').forEach(function (el) {
      el.textContent = (LANG === 'zh' ? 'EN' : '中文');
      if (!el._wired) { el._wired = true; el.addEventListener('click', function () { set(LANG === 'zh' ? 'en' : 'zh'); }); }
    });
  }

  function set(l) { try { localStorage.setItem('ps_lang', l); } catch (e) {} location.reload(); }

  // tf(enTemplate, vars): fill a template with {token} placeholders, using the Chinese
  // template (keyed by the English template) in zh mode. Lets result sentences reorder
  // words around interpolated numbers. e.g. tf('on a {price} home', {price: '$1.5M'}).
  function tf(en, vars) {
    var tpl = (LANG === 'zh' && (DICT[en] || NORM[norm(en)])) ? (DICT[en] || NORM[norm(en)]) : en;
    return tpl.replace(/\{(\w+)\}/g, function (m, k) { return (vars && vars[k] != null) ? vars[k] : m; });
  }
  window.PSI18N = {
    lang: LANG, t: t, tf: tf, apply: apply, set: set,
    toggle: function () { set(LANG === 'zh' ? 'en' : 'zh'); },
    add: function (d) { for (var k in d) DICT[k] = d[k]; buildNorm(); apply(); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
