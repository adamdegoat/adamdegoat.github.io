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
    'Cash needed upfront': '前期所需现金', 'min cash + stamp duty + ~$3k legal/fees allowance': '最低现金 + 印花税 + 约 $3k 律师费等'
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
  function translateTree(root) {
    if (LANG !== 'zh' || !root) return;
    if (root.nodeType === 3) return translateTextNode(root);
    if (root.nodeType !== 1) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(translateTextNode);
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

  window.PSI18N = {
    lang: LANG, t: t, apply: apply, set: set,
    toggle: function () { set(LANG === 'zh' ? 'en' : 'zh'); },
    add: function (d) { for (var k in d) DICT[k] = d[k]; buildNorm(); apply(); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
