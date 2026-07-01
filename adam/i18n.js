/* PropSight i18n, shared, tiny, English-default language layer.
   Load this on EVERY page (before nav.js). Chinese is an ADDITIVE swap layer:
   English always stays in the DOM as the fallback, so a missing/broken key can
   never lose the English text. Pages opt content in with data-i18n / data-i18n-ph.
   Public API: window.PSI18N { lang, t(s), apply(), add(dict), set(lang) }. */
(function () {
  // PropSight has its own EN/中文 toggle, so tell Chrome not to pop its "translate this page?" bar
  // (it would fight our own language switch on every toggle). Runs as early as the script executes.
  try {
    document.documentElement.setAttribute('translate', 'no');
    if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
      var _nt = document.createElement('meta'); _nt.name = 'google'; _nt.content = 'notranslate';
      (document.head || document.documentElement).appendChild(_nt);
    }
  } catch (e) {}
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
    'Every number here is a guide. For your exact case, financing, timing, the smartest move, have a quick chat. No pressure, no sales script.':
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
    'Flat type': '组屋类型', 'Select flat type (pick street first)': '选择组屋类型（先选街道）',
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
    // value result sentences (templates + fragments)
    'Limited recent sales for this one.': '这套房的近期成交较少。',
    'Treat the range above as a rough guide only, not a reliable valuation. For an accurate figure,': '上面的区间仅供粗略参考，并非可靠估值。如需准确数字，',
    'get a proper valuation': '获取正式估值',
    ', the likely range, from real recent comparable sales.': '，根据真实的近期同类成交，这是大概的价格区间。',
    ', the likely range, from real recent comparable sales (typical unit size, add yours to sharpen).': '，根据真实的近期同类成交，这是大概的价格区间（采用典型户型面积，填入你的面积更精准）。',
    'typical size assumed, add yours to sharpen': '采用典型面积，填入你的更精准',
    'as you entered': '按你输入的',
    '{n} recent sales · {scope}': '{n} 笔近期成交 · {scope}',
    'Add your floor area above for a tighter number.': '在上方填入面积可得到更精确的数字。',
    'Want it pinned to your exact unit, floor and condition?': '想要精确到你的具体单位、楼层和装修状况？',
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
    // afford result sentences (templates + fragments)
    'about {pct}% of the price': '约为房价的 {pct}%',
    'cash ~{cash} + CPF ~{cpf}': '现金约 {cash} + CPF 约 {cpf}',
    'tested at {sr}%, your actual will be lower': '按 {sr}% 压力测试，你实际会更低',
    'That lease is too short to finance.': '这屋契太短，无法贷款。',
    "With under ~20 years left, banks won't lend and CPF can't be used, these homes are effectively cash-only. Tell us the exact lease and we'll work out the cash price.":
      '剩余不到约20年时，银行不放贷，CPF 也不能用，这类房子基本只能全款。告诉我们确切的屋契年限，我们帮你算出现金价。',
    'Your existing monthly debts already use up the borrowing limit.': '你现有的每月债务已经用完了可借额度。',
    'Banks cap all your debt repayments at {tdsr}% of your income, clearing some debt, or a higher/combined income, would free up some budget.':
      '银行将你所有债务还款上限设为收入的 {tdsr}%。还清部分债务，或提高/合并收入，能腾出一些预算。',
    "You'll need some cash to start.": '你需要一些现金才能开始。',
    "At least {minCash}% of the price must be paid in cash, CPF can't cover that part.": '房价的至少 {minCash}% 必须用现金支付，CPF 无法覆盖这部分。',
    "With these numbers there isn't a workable budget yet, try a longer loan, more savings, or message us and we'll look at it together.":
      '以这些数字目前还算不出可行的预算，试试更长的贷款年限、更多存款，或联系我们一起看看。',
    "the remaining lease won't cover you to age 95": '剩余屋契无法覆盖你到95岁',
    'the loan would run past age 65': '贷款期会超过65岁',
    'the loan is longer than {maxTen} years': '贷款期长于 {maxTen} 年',
    'On a short lease your usable CPF is also pro-rated down, so the real budget is lower.': '屋契短时，你可用的 CPF 也会按比例减少，所以实际预算更低。',
    'A shorter loan, or buying younger, lifts this.': '缩短贷款年限，或趁年轻购买，能提高这个上限。',
    'Because {why}, banks cap your loan at <b>{pct}%</b> (not 75%), so you need a much bigger down payment. {extra}':
      '由于{why}，银行将你的贷款上限设为 <b>{pct}%</b>（而非75%），所以你需要大得多的首付。{extra}',
    'Your income is the limit here.': '这里的限制是你的收入。',
    'Banks cap your loan at a share of your income, a longer loan, a co-borrower, or clearing existing debt would lift your budget.':
      '银行按你收入的一定比例限制贷款。更长的贷款年限、增加共同借款人，或还清现有债务，都能提高你的预算。',
    'Your savings are the limit here.': '这里的限制是你的存款。',
    "You could borrow more, but the down payment needs cash + CPF you don't have yet. Building savings raises your ceiling fastest.":
      '你本可以借更多，但首付需要你目前还没有的现金 + CPF。积累存款能最快提高你的上限。',
    'Your cash is the limit here.': '这里的限制是你的现金。',
    "At least {minCash}% of the price must be paid in cash (CPF can't cover that part).": '房价的至少 {minCash}% 必须用现金支付（CPF 无法覆盖这部分）。',
    'This uses the real rules: a bank can lend up to <b>{tdsr}% of your income for all debts</b>{msr}, stress-tested at <b>{sr}%</b>{hdb} even though real rates are usually lower.':
      '这采用真实规则：银行最多可按你<b>收入的 {tdsr}% 用于所有债务</b>放贷{msr}，并按 <b>{sr}%</b> 做压力测试{hdb}，尽管实际利率通常更低。',
    " and, for an HDB flat or new EC, the home loan alone can't exceed <b>{msr}%</b>": '，并且对于组屋或新 EC，单是房贷就不能超过<b>{msr}%</b>',
    ' (the HDB-loan rate; no minimum cash needed)': '（HDB 贷款利率；无需最低现金）',
    'an <b>HDB loan</b>': '一笔 <b>HDB 贷款</b>', 'a <b>bank loan</b>': '一笔 <b>银行贷款</b>',
    "Indicative only, not financial advice. Assumes {loan} and your <b>first home</b>. Your loan and CPF only stretch up to the bank's valuation, if you buy <b>above</b> valuation, the extra is cash on top of these figures. CPF use is also capped at valuation and you may keep a buffer in your OA, so treat the CPF figure as a maximum. If your income is mainly commission or self-employed, banks count only about <b>70%</b> of it, your real figure would be lower. For an <b>older home</b>, a short remaining lease cuts how much CPF and loan you can use (CPF needs the lease to cover you to age 95). HDB buyers using CPF also pay a small <b>Home Protection Scheme</b> premium from their OA. A precise number depends on your credit and the bank's valuation. Rules as of {as_of}. Always confirm with a banker.":
      '仅供参考，不构成财务建议。假设为{loan}且是你的<b>第一套房</b>。你的贷款和 CPF 最多只能用到银行估值；如果你买得<b>高于</b>估值，超出部分要额外用现金支付。CPF 的使用同样以估值为上限，你也可能在 OA 中保留一些缓冲，所以请把 CPF 数字当作上限。如果你的收入主要是佣金或自雇，银行通常只计算其中约 <b>70%</b>，你的实际数字会更低。对于<b>较旧的房子</b>，剩余屋契短会减少你能用的 CPF 和贷款（CPF 需要屋契覆盖你到95岁）。使用 CPF 的组屋买家还需从 OA 支付少量<b>房屋保障计划</b> (HPS) 保费。准确数字取决于你的信用和银行估值。规则截至 {as_of}。请务必向银行人员确认。',

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
    // sell result sentences
    'plus {cpf} returned to your CPF (still yours), {total} in total': '另有 {cpf} 退回你的 CPF（仍是你的钱），共计 {total}',
    '{rate}%, sold within the holding period': '{rate}%，在持有期内出售',
    "No Seller's Stamp Duty.": '无需缴卖方印花税。',
    'HDB flats are exempt, the minimum occupation period already runs longer than the SSD holding period, so by the time you can sell, SSD no longer applies.':
      '组屋免缴，最低居住年限 (MOP) 已经长于 SSD 的持有期，所以到你能卖的时候，SSD 已不再适用。',
    "<b>Seller's Stamp Duty applies: {rate}% = {ssd}.</b> You've held this for about <b>{yrs} years</b>, within the {hold} holding period for a home bought {when}. Waiting until the period is up removes it entirely. (Charged on the higher of price or valuation.)":
      '<b>需缴卖方印花税：{rate}% = {ssd}。</b>你持有约 <b>{yrs} 年</b>，在 {when} 购买房子的 {hold} 持有期内。等到持有期满即可完全免除。（按房价或估值中较高者计征。）',
    '3-year': '3年', '4-year': '4年', 'before 4 Jul 2025': '2025年7月4日之前', 'on/after 4 Jul 2025': '2025年7月4日当天或之后',
    "<b>No Seller's Stamp Duty.</b> You've held this for about <b>{yrs} years</b>, past the holding period, so nothing is due.":
      '<b>无需缴卖方印花税。</b>你已持有约 <b>{yrs} 年</b>，超过持有期，所以无需缴纳。',
    "Before costs, you're selling <b>{gross}</b> above what you paid. After the loan, CPF refund and costs above, your usable cash is <b>{cash}</b>":
      '扣除成本前，你比当初买入价高 <b>{gross}</b> 卖出。扣掉贷款、CPF 退还和上面的成本后，你可用的现金是 <b>{cash}</b>',
    ' (your CPF also gets <b>{cpf}</b> back).': '（你的 CPF 另外退回 <b>{cpf}</b>）。',
    'Heads up, this sale is <b>{gross}</b> below what you paid': '提醒一下，这笔交易比你当初买入价低 <b>{gross}</b>',
    ", and the proceeds don't cover the loan + CPF refund, so you'd need to top up <b>{cash}</b> in cash.": '，而且这笔收益不够偿还贷款 + CPF 退还，所以你需要额外补 <b>{cash}</b> 现金。',
    'Worth a chat before you commit.': '动手之前值得聊一聊。',
    "Indicative only, not financial or legal advice. Seller's Stamp Duty is charged on the <b>higher of price or market valuation</b>; this uses your sale price. Your <b>CPF refund</b> (the amount you withdrew plus 2.5% accrued interest) goes back to your CPF account, it's still your money but can't be spent as cash; get the exact figure from your CPF statement. Figures exclude any outstanding property tax, maintenance, or early-redemption penalty. Rules as of {as_of}. Always confirm with your conveyancing lawyer and banker.":
      '仅供参考，不构成财务或法律建议。卖方印花税按<b>房价或市场估值中较高者</b>计征；这里用的是你的售价。你的 <b>CPF 退还</b>（你提取的金额加 2.5% 累计利息）会退回你的 CPF 账户，仍是你的钱但不能当现金花；确切数字请查你的 CPF 对账单。数字不含任何欠缴的房产税、管理费或提前赎回罚金。规则截至 {as_of}。请务必向你的产权过户律师和银行人员确认。',

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
    // grants result sentences
    'Your income is above the EHG ceiling ({ceil}/mo), so no EHG.': '你的收入超过 EHG 上限（{ceil}/月），因此没有 EHG。',
    "On an older resale flat, grants can be <b>pro-rated</b> if the remaining lease won't cover the youngest buyer to age 95, so a short-lease flat may give you less than the figure above. Send us the exact unit and we'll check.":
      '对于较旧的转售组屋，如果剩余屋契无法覆盖最年轻的买家到95岁，补贴可能会<b>按比例减少</b>，所以短屋契的组屋拿到的可能比上面的数字少。把确切的单位发给我们，我们帮你核实。',
    'SC/PR couple: the Family Grant is $10k less until you have a child together or the PR becomes a citizen.': '公民/永久居民夫妻：在你们共同生育孩子或永久居民转为公民之前，家庭补贴会少 $10k。',
    'Your income is above the Family Grant ceiling ({ceil}/mo).': '你的收入超过家庭补贴上限（{ceil}/月）。',
    "Singles can't buy a new EC, it needs a family nucleus.": '单身者不能购买新 EC，需要符合家庭核心要求。',
    'The EC grant tapers to $0 above $12,000 income, you can still buy an EC (ceiling $16,000), just no grant.': '收入超过 $12,000 时 EC 补贴递减至 $0，你仍可以买 EC（上限 $16,000），只是没有补贴。',
    'Income above the EC income ceiling ($16,000).': '收入超过 EC 收入上限（$16,000）。',
    'Upgrading from a subsidised 2- or 3-room flat? You may also qualify for the $15k Step-Up Grant (income ≤ $7,000), ask us to check.': '从受津贴的2房式或3房式组屋升级？你可能还符合 $15k 升级补贴（收入 ≤ $7,000），找我们核实。',
    'on a new BTO flat': '购买新 BTO 组屋时', 'on a new EC from the developer': '向发展商购买新 EC 时',
    "because you're taking a grant on a resale flat": '因为你在转售组屋上领取了补贴',
    'Buying a resale flat <b>without</b> taking any grant? No resale levy is due.': '购买转售组屋但<b>不</b>领取任何补贴？无需缴转售税。',
    'Net picture: <b>{total}</b> of grants into your CPF, minus a <b>{levy}</b> levy = <b>{sign}{net}</b> overall.': '总体情况：<b>{total}</b> 补贴存入你的 CPF，减去 <b>{levy}</b> 转售税 = 整体 <b>{sign}{net}</b>。',
    'This is a cash cost on top of the flat, it can be paid from your sale proceeds, not borrowed.': '这是房款之外的现金成本，可以用你的卖房收益支付，不能贷款。',
    "As a second-timer, you pay a resale levy {why}, based on your first {size} flat. It's <b>not a grant and not financeable</b>.": '作为二次购房者，你需缴转售税{why}，按你第一套 {size} 组屋计算。它<b>不是补贴，也不能贷款</b>。',

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
    // eligibility verdict points
    "As a foreigner you pay <b>60% Additional Buyer's Stamp Duty</b> on the price (nationals of the US, Iceland, Liechtenstein, Norway & Switzerland are taxed at citizen rates under treaties).":
      '作为外国人，你需按房价缴 <b>60% 额外买方印花税 (ABSD)</b>（美国、冰岛、列支敦士登、挪威和瑞士的国民根据条约按公民税率征税）。',
    "<b>Landed houses</b> need special government approval, condos/apartments don't.": '<b>有地住宅</b>需要政府特别批准，公寓则不需要。',
    'Any Singapore Citizen or PR can buy a private condo. No income ceiling, no citizenship scheme.': '任何新加坡公民或永久居民都可以购买私人公寓。没有收入上限，也没有公民身份计划要求。',
    'Stamp duty depends on how many homes you\'ll own, check the <a href="stamp-duty.html" style="color:var(--green2);font-weight:700">Stamp Duty tool</a>.':
      '印花税取决于你将拥有几套房，查看<a href="stamp-duty.html" style="color:var(--green2);font-weight:700">印花税工具</a>。',
    "<b>No minimum occupation period</b>, you can sell anytime (but Seller's Stamp Duty applies if you sell within ~3-4 years).":
      '<b>没有最低居住年限</b>，你随时可以卖（但如果在约3-4年内卖出，需缴卖方印花税）。',
    'HDB flats are public housing, for Singapore Citizens and PRs only. Private property is your route.': '组屋是公共住房，仅限新加坡公民和永久居民。私宅才是你的途径。',
    'You can only buy <b>with a Singapore Citizen</b>, or <b>with another PR, and both of you must have held PR for at least 3 years</b>. Either way you need a recognised family nucleus.':
      '你只能<b>与新加坡公民</b>，或<b>与另一位永久居民（你们两人都必须持有 PR 至少3年）</b>一起购买。无论哪种，你都需要符合家庭核心要求。',
    'As a PR your first home carries <b>5% ABSD</b> (refundable only in limited cases).': '作为永久居民，你的第一套房需缴 <b>5% ABSD</b>（仅在有限情况下可退）。',
    'The <b>Single Singapore Citizen Scheme</b> starts at <b>age 35</b>. Until then, you can buy <b>with a family nucleus</b> (a spouse, or your parents), or look at renting or a private property.':
      '<b>单身新加坡公民计划</b>从 <b>35岁</b>开始。在那之前，你可以<b>与家庭核心</b>（配偶，或你的父母）一起购买，或考虑租房或私宅。',
    "Turning 35 soon? You'll be able to buy a resale flat on your own then.": '快35岁了？到时你就能独自购买转售组屋了。',
    'On your own under the <b>singles scheme</b> (age 35+).': '以<b>单身计划</b>（35岁以上）独自购买。',
    'With your family nucleus, a spouse, parents, or children.': '与你的家庭核心一起：配偶、父母或子女。',
    '<b>No income ceiling</b> to buy a resale flat, income limits only apply to HDB loans (≤{fam} for families) and grants.':
      '购买转售组屋<b>没有收入上限</b>，收入限制只适用于 HDB 贷款（家庭 ≤{fam}）和补贴。',
    "<b>Good news:</b> a Singapore Citizen aged 55+ buying a 4-room-or-smaller resale flat is <b>exempt from the wait-out</b>. You still sell your private property first, but there's no waiting period after that.":
      '<b>好消息：</b>55岁以上的新加坡公民购买4房式或更小的转售组屋，<b>免除等待期</b>。你仍需先卖掉私宅，但之后没有等待期。',
    "You own / recently sold private property: <b>sell it first</b>, then serve a <b>30-month wait</b> before you can buy, because you're taking an HDB loan or a CPF housing grant.":
      '你拥有/近期卖出过私宅：需<b>先卖掉</b>，然后<b>等待30个月</b>才能购买，因为你要用 HDB 贷款或 CPF 购房补贴。',
    'You own / recently sold private property: <b>sell it first</b>, then serve a <b>15-month wait</b> before you can buy (a non-subsidised resale flat, with no HDB loan or grant).':
      '你拥有/近期卖出过私宅：需<b>先卖掉</b>，然后<b>等待15个月</b>才能购买（不带补贴的转售组屋，不用 HDB 贷款或补贴）。',
    "You can't own a flat and a private property at the same time (beyond a short grace period).": '你不能同时拥有组屋和私宅（短暂的宽限期除外）。',
    "After buying, there's a <b>5-year Minimum Occupation Period</b>, you can't sell it or buy private property until then. <b>Plus / Prime</b> flats have a 10-year MOP.":
      '购买后有 <b>5年最低居住年限 (MOP)</b>，在此之前你不能卖出或购买私宅。<b>Plus / Prime</b> 组屋的 MOP 为10年。',
    'At least one buyer must be a Singapore Citizen. Look at private condos instead.': '至少一位买家必须是新加坡公民。可以考虑私人公寓。',
    "You're above the {ec} income ceiling for a new EC.": '你超过了新 EC 的 {ec} 收入上限。',
    'New ECs from a developer have a <b>{ec}</b> household income ceiling, your {income} is over it.': '向发展商购买的新 EC 有 <b>{ec}</b> 的家庭收入上限，你的 {income} 超过了。',
    "Options: a <b>resale EC</b> (no income ceiling once it's 5+ years old) or <b>private property</b>.": '选择：<b>转售 EC</b>（满5年后没有收入上限）或<b>私宅</b>。',
    'At least one buyer must be a <b>Singapore Citizen</b>, with a co-applicant (SC or PR) forming a family nucleus.': '至少一位买家必须是<b>新加坡公民</b>，并有一位共同申请人（公民或永久居民）组成家庭核心。',
    "Household income <b>≤ {ec}</b>, you're within it.": '家庭收入 <b>≤ {ec}</b>，你在范围内。',
    'You must <b>not have owned or sold any private property in the last 30 months</b>.': '你必须<b>在过去30个月内没有拥有或卖出过任何私宅</b>。',
    ", you said you have, so you'd need to wait it out.": '，你说你有，所以需要等过这段期限。',
    "<b>5-year Minimum Occupation Period</b> (10 years for the newest EC sites launched from May 2026). A resale levy may apply if you've taken a housing subsidy before.":
      '<b>5年最低居住年限 (MOP)</b>（2026年5月起推出的最新 EC 地段为10年）。如果你以前领过购房补贴，可能需缴转售税。',

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
    // schools result sentences
    'within 1km': '1公里内', 'within 1-2km': '1-2公里内',
    'No condos {near} of this school.': '这所学校 {near} 没有公寓。',
    '+ {n} more {near}, message us for the full list': '{near}还有 {n} 个，联系我们获取完整名单',
    'No HDB streets {near} of this school.': '这所学校 {near} 没有组屋街道。',
    '+ {n} more {near}': '{near}还有 {n} 个',
    '{p1} condos within 1km · {p2} between 1-2km': '1公里内 {p1} 个公寓 · 1-2公里 {p2} 个',
    '{p1} HDB streets within 1km · {p2} between 1-2km': '1公里内 {p1} 条组屋街道 · 1-2公里 {p2} 条',
    // ══ about page copy ══
    'About PropSight': '关于 PropSight',
    "We read Singapore's property records, so you don't have to.": '我们替你读遍新加坡的房产记录。',
    "A free property hub built on the same official data the professionals use, every private caveat from URA, every HDB resale, OneMap's school and amenity records. Read, refreshed weekly, and turned into plain answers. Look up anything without signing up, and when you want it pulled together, just ask Aillie.":
      '一个免费的房产平台，建立在专业人士使用的同一份官方数据之上：URA 的每一笔私宅成交、每一笔组屋转售、OneMap 的学校和设施记录。我们读取、每周更新，并转化为大白话的答案。无需注册就能查任何东西，想要汇总分析时，问 Aillie 就好。',
    'Value any flat or condo': '估算任何组屋或公寓', 'on real recent sales, in seconds': '基于真实近期成交，几秒搞定',
    'Ask Aillie anything': '有问题尽管问 Aillie', 'real numbers back, instantly': '即时返回真实数据',
    'See what you can afford': '看看你能负担多少', 'worked out before you view': '看房前就算清楚',
    'Free, no sign-up needed': '免费，无需注册', 'look up anything you want': '想查什么都行',
    'Built on official records': '基于官方记录',
    'The numbers the pros pay for. Yours, free.': '专业人士付费才有的数据，免费给你。',
    'Every figure on PropSight traces back to source. We pull the official transaction records, what homes actually sold for, not what a listing is asking, and rebuild the picture from the ground up each week.':
      'PropSight 上的每个数字都能追溯到源头。我们采用官方成交记录，也就是房子实际卖了多少，而不是挂牌要价，并每周从头重建整个画面。',
    'Open the research →': '打开研究 →',
    'Real answers, with the receipts': '有理有据的真实答案',
    'You see the working, not just a number.': '你看到的是推算过程，而不只是一个数字。',
    "Ask Aillie anything and she pulls the real figures for you. Every valuation comes with the recent comparable sales it's based on, an honest range, and a confidence level, so you see exactly why, not just what.":
      '有问题尽管问 Aillie，她会为你调出真实数据。每个估值都附上所依据的近期同类成交、诚实的区间和可信度，让你清楚看到为什么，而不只是结果。',
    'Value a home →': '估算房价 →',
    'Everything in one place': '全部集中在一处',
    'Eleven tools, with a twelfth on the way.': '十一个工具，第十二个即将上线。',
    "Every job in a property move has its own tool, each built on the same official data: value a home, work out your real budget, research any project, check stamp duty, grants and eligibility, see what you'd walk away with as a seller, find homes near a school, and follow the market with Market Pulse, News and the Guide. They all read the same records, so the numbers always agree.":
      '买卖房子的每件事都有专属工具，全部基于同一份官方数据：估算房价、算出你的真实预算、研究任何楼盘、查印花税、补贴和购买资格、看看作为卖家你能实拿多少、查找名校周边的房子，并通过市场动态、新闻和购房指南关注市场。它们读取同一份记录，所以数字始终一致。',
    'Join the inside track.': '加入内部圈子。',
    "Looking around is free and always will be. Join free to open the full research, get the weekly insights and a higher chat limit with Aillie, and get into the members' Telegram channel for live signals.":
      '随便看看永远免费。免费加入即可解锁完整研究、获得每周洞察和更高的 Aillie 对话额度，并进入会员专属 Telegram 频道获取实时信号。',

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
    // mortgage result sentences
    'over {years} years at {rate}% a year': '{years} 年，年利率 {rate}%',
    'what the loan costs you over {years} years': '这笔贷款 {years} 年下来的成本',
    'This is your repayment at {rate}% a year.': '这是你在年利率 {rate}% 下的还款。',
    'Banks must also stress-test you at a higher rate (4% for a bank loan) to make sure you can still cope if rates rise, so check your budget against that too.':
      '银行还必须按更高的利率（银行贷款为 4%）对你做压力测试，确保利率上升时你仍能负担，所以也要按那个标准核对你的预算。',
    'A longer loan lowers the monthly figure but you pay more interest overall, a shorter one does the opposite.': '贷款年限越长，每月还款越低，但总利息越多；越短则相反。',
    'The HDB concessionary rate is currently {hdb}%.': '目前 HDB 优惠利率为 {hdb}%。',
    'Bank package rates move with the market, so use your own quoted rate for the truest figure.': '银行配套利率随市场浮动，用你自己拿到的报价利率才最准确。',
    'Indicative only, not financial advice. Assumes a constant interest rate over the whole loan, real packages change after the first few years. Your actual repayment depends on your bank, package and the loan approved against the property valuation. Rates as of {as_of}. Always confirm with a banker.':
      '仅供参考，不构成财务建议。假设整个贷款期利率不变，实际配套在头几年后会变动。你的实际还款取决于你的银行、配套，以及按房产估值批出的贷款。规则截至 {as_of}。请务必向银行人员确认。',
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
  function norm(s) { return s.replace(/\s*[\u2014\u2013]\s*/g, ', ').replace(/[‘’′]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim(); }
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
    // any element tagged data-ps-langtoggle becomes a working 中文/EN switch (globe icon + label)
    var GLOBE = '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:15px;height:15px;flex:none;stroke:currentColor;fill:none;stroke-width:1.7;vertical-align:-3px"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18"/></svg>';
    document.querySelectorAll('[data-ps-langtoggle]').forEach(function (el) {
      el.innerHTML = GLOBE + ' ' + (LANG === 'zh' ? 'EN' : '中文');
      if (!el._wired) { el._wired = true; el.addEventListener('click', function () { set(LANG === 'zh' ? 'en' : 'zh'); }); }
    });
    // dual-language blocks (for long-form prose): show only the block matching the current language
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.style.display = (el.getAttribute('data-lang') === LANG) ? '' : 'none';
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
