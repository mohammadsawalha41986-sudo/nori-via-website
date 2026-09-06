/**
 * Tools depth and additions.
 *
 * The tool platform stores inputs, outputs and formulas as data, so a new
 * calculator is content rather than code. Formulas are expressions over the
 * tool's own input keys and are evaluated by src/lib/tool-engine.ts, which
 * parses rather than evaluates them — so only the documented operators and
 * functions (+ - * / % ^, comparisons, ternary, min max round floor ceil abs
 * sqrt pow) are available.
 *
 * Every calculator divides defensively: a denominator that could be zero is
 * guarded with a ternary so the tool returns 0 rather than a non-finite value.
 *
 * No default value here is a claim about any business; defaults exist only so
 * the tool renders a worked example on first load.
 */

/* ------------------------------------------------------ existing tool copy */

export const TOOL_DEPTH = [
  {
    slug: 'food-cost-calculator',
    descEn:
      'Food cost percentage is the ratio most often quoted and most often misread. This calculator returns it alongside the two numbers that actually matter for a decision: the gross profit the item produces in money, and the margin that profit represents.\n\nUse it per item rather than across the menu. A menu-wide average tells you very little, because it is a blend of items with completely different roles.',
    descAr:
      'نسبة تكلفة الطعام هي النسبة الأكثر تداولاً والأكثر إساءة قراءة. تعيدها هذه الحاسبة إلى جانب الرقمين المهمين فعلاً لاتخاذ قرار: الربح الإجمالي الذي ينتجه الصنف بالمال، والهامش الذي يمثله ذلك الربح.\n\nاستخدمها لكل صنف على حدة لا لعموم القائمة، فالمتوسط العام لا يخبرك بالكثير لأنه خليط من أصناف بأدوار مختلفة تماماً.',
    purposeEn:
      'To move a menu conversation from a percentage to a contribution in money, per item.',
    purposeAr:
      'لنقل الحديث عن القائمة من نسبة مئوية إلى مساهمة بالمال لكل صنف.',
  },
  {
    slug: 'menu-pricing-calculator',
    descEn:
      'Work backwards from the margin you need rather than forwards from the price you are used to. Enter the item cost and the food cost percentage you are targeting, and the calculator returns the price that achieves it, along with the gross profit at that price.\n\nTreat the result as a starting point, not a decision. A price still has to sit sensibly within its category band and avoid crossing a threshold that makes the change more visible than it needs to be.',
    descAr:
      'اعمل رجوعاً من الهامش الذي تحتاجه بدل التقدم من السعر الذي اعتدته. أدخل تكلفة الصنف ونسبة تكلفة الطعام المستهدفة، فتعيد الحاسبة السعر الذي يحققها مع الربح الإجمالي عنده.\n\nتعامل مع النتيجة كنقطة بداية لا كقرار، فالسعر ما زال عليه أن يستقر منطقياً داخل نطاق تصنيفه وأن يتجنب عبور عتبة تجعل التغيير أظهر مما يحتاج.',
    purposeEn:
      'To test a target margin against a real cost base before a price is set.',
    purposeAr:
      'لاختبار هامش مستهدف مقابل قاعدة تكلفة حقيقية قبل تحديد السعر.',
  },
  {
    slug: 'contribution-margin-calculator',
    descEn:
      'Contribution is what an item adds to the business after the costs that vary with it. It is the number that decides whether a popular item is worth its place, and it is frequently at odds with the food cost percentage.\n\nAn item with a worse ratio and higher volume can contribute several times more money than one with an excellent ratio that nobody orders. This calculator shows both so the comparison is honest.',
    descAr:
      'المساهمة هي ما يضيفه الصنف للمشروع بعد التكاليف التي تتغير معه. وهي الرقم الذي يحدد إن كان الصنف الرائج يستحق مكانه، وكثيراً ما يتعارض مع نسبة تكلفة الطعام.\n\nفالصنف ذو النسبة الأسوأ والحجم الأعلى قد يساهم بأضعاف ما يساهم به صنف بنسبة ممتازة لا يطلبه أحد. وتُظهر هذه الحاسبة الاثنين لتكون المقارنة صادقة.',
    purposeEn:
      'To compare items on the money they contribute rather than on the ratio they post.',
    purposeAr:
      'لمقارنة الأصناف بالمال الذي تساهم به لا بالنسبة التي تسجلها.',
  },
  {
    slug: 'discount-impact-calculator',
    descEn:
      'A discount is a margin decision presented as a marketing one. This calculator shows how much additional volume a given discount has to generate simply to stand still — the number that is almost never worked out before a promotion runs.\n\nThe required uplift rises sharply as margin falls, which is why the same discount can be reasonable on one item and destructive on another.',
    descAr:
      'الخصم قرار هامش يُقدَّم كقرار تسويقي. تُظهر هذه الحاسبة حجم الزيادة التي على خصم معين توليدها لمجرد البقاء في المكان نفسه، وهو الرقم الذي لا يُحسب تقريباً قبل تشغيل أي عرض.\n\nوترتفع الزيادة المطلوبة بحدة كلما انخفض الهامش، ولهذا قد يكون الخصم نفسه معقولاً على صنف ومدمّراً على آخر.',
    purposeEn:
      'To find out what a discount actually costs before it is offered.',
    purposeAr:
      'لمعرفة ما يكلّفه الخصم فعلاً قبل تقديمه.',
  },
  {
    slug: 'delivery-pricing-calculator',
    descEn:
      'A dish that earns well in the dining room can lose money on every delivery order once commission and packaging are subtracted. This calculator recalculates contribution for the delivery channel and shows the price required to hold the same margin.\n\nRun it per item and per platform. Commission terms differ, and an item that works on one platform can be negative on another.',
    descAr:
      'الطبق الذي يحقق ربحاً جيداً في الصالة قد يخسر في كل طلب توصيل بعد خصم العمولة والتغليف. تعيد هذه الحاسبة حساب المساهمة لقناة التوصيل وتُظهر السعر اللازم للحفاظ على الهامش نفسه.\n\nشغّلها لكل صنف ولكل منصة، فشروط العمولة تختلف، والصنف الذي ينجح على منصة قد يكون سالباً على أخرى.',
    purposeEn:
      'To price the delivery channel as its own business rather than as the dining room at a distance.',
    purposeAr:
      'لتسعير قناة التوصيل كنشاط قائم بذاته لا كصالة عن بُعد.',
  },
];

/* ------------------------------------------------------------- new tools */

const n = (key, labelEn, labelAr, defaultValue, helpEn = '', helpAr = '', min = 0) => ({
  key, labelEn, labelAr, helpEn, helpAr, type: 'number', unit: '',
  min, max: null, step: null, defaultValue, options: [],
});

const out = (key, labelEn, labelAr, expression, format, precision, primary = false, helpEn = '', helpAr = '') => ({
  key, labelEn, labelAr, helpEn, helpAr, expression, format, precision, primary,
});

export const NEW_TOOLS = [
  {
    slug: 'break-even-calculator',
    order: 6,
    featured: true,
    nameEn: 'Break-Even Calculator',
    nameAr: 'حاسبة نقطة التعادل',
    summaryEn: 'The monthly revenue, and the daily covers, required to cover the fixed cost base.',
    summaryAr: 'الإيراد الشهري وعدد الطلبات اليومية اللازمة لتغطية قاعدة التكاليف الثابتة.',
    descriptionEn:
      'Break-even is usually quoted as a revenue figure, which is hard to manage against. Expressed as covers per day it becomes an operational target the floor can recognise.\n\nEnter the monthly fixed cost base — rent, salaries that do not vary with volume, overheads — the variable cost percentage of revenue, and the average transaction value. The calculator returns break-even revenue, break-even covers per month and per day, and the contribution each transaction makes towards the fixed base.',
    descriptionAr:
      'تُذكر نقطة التعادل عادة كرقم إيراد، وهو صعب الإدارة. وحين تُعبَّر بعدد الطلبات يومياً تصير هدفاً تشغيلياً يستطيع فريق الصالة إدراكه.\n\nأدخل قاعدة التكاليف الثابتة الشهرية — الإيجار والرواتب التي لا تتغير مع الحجم والمصاريف العامة — ونسبة التكاليف المتغيرة من الإيراد، ومتوسط قيمة المعاملة. فتعيد الحاسبة إيراد التعادل، وعدد طلبات التعادل شهرياً ويومياً، والمساهمة التي تقدمها كل معاملة نحو القاعدة الثابتة.',
    purposeEn: 'To turn a fixed cost base into a daily operational target.',
    purposeAr: 'لتحويل قاعدة التكاليف الثابتة إلى هدف تشغيلي يومي.',
    config: {
      currency: '',
      inputs: [
        n('fixedCosts', 'Monthly fixed costs', 'التكاليف الثابتة الشهرية', 90000, 'Rent, fixed salaries and overheads that do not move with volume.', 'الإيجار والرواتب الثابتة والمصاريف التي لا تتحرك مع الحجم.'),
        n('variableCostPct', 'Variable cost % of revenue', 'نسبة التكاليف المتغيرة من الإيراد', 45, 'Food, packaging, commission and variable labour, as a percentage of revenue.', 'الطعام والتغليف والعمولة والعمالة المتغيرة كنسبة من الإيراد.'),
        n('avgTransactionValue', 'Average transaction value', 'متوسط قيمة المعاملة', 65),
        n('openDays', 'Trading days per month', 'أيام العمل في الشهر', 30, '', '', 1),
      ],
      outputs: [
        out('contributionPerTransaction', 'Contribution per transaction', 'المساهمة لكل معاملة', 'avgTransactionValue * (1 - variableCostPct / 100)', 'currency', 2, false),
        out('breakEvenRevenue', 'Break-even revenue per month', 'إيراد التعادل الشهري', 'variableCostPct < 100 ? fixedCosts / (1 - variableCostPct / 100) : 0', 'currency', 0, true),
        out('breakEvenTransactions', 'Break-even transactions per month', 'عدد معاملات التعادل شهرياً', 'variableCostPct < 100 && avgTransactionValue > 0 ? fixedCosts / (1 - variableCostPct / 100) / avgTransactionValue : 0', 'number', 0, false),
        out('breakEvenPerDay', 'Break-even transactions per day', 'عدد معاملات التعادل يومياً', 'variableCostPct < 100 && avgTransactionValue > 0 && openDays > 0 ? fixedCosts / (1 - variableCostPct / 100) / avgTransactionValue / openDays : 0', 'number', 0, false),
      ],
      notesEn:
        'Break-even is a floor, not a target. It says what the business must do to cover its fixed base, not what it must do to be worth running — that requires a return on the capital invested as well.',
      notesAr:
        'نقطة التعادل أرضية لا هدف. فهي تقول ما يجب أن يفعله المشروع لتغطية قاعدته الثابتة، لا ما يجب أن يفعله ليستحق التشغيل، فذلك يتطلب عائداً على رأس المال المستثمر أيضاً.',
    },
  },
  {
    slug: 'prime-cost-calculator',
    order: 7,
    featured: false,
    nameEn: 'Prime Cost Calculator',
    nameAr: 'حاسبة التكلفة الأولية',
    summaryEn: 'Cost of sales and labour read together, because they trade against each other.',
    summaryAr: 'تكلفة المبيعات والعمالة تُقرآن معاً لأن كلاً منهما يقايض الآخر.',
    descriptionEn:
      'Food cost and labour cost are usually reviewed separately, which hides the trade between them: a cheaper ingredient that takes longer to prepare moves cost from one line to the other without helping the business.\n\nPrime cost reads them together. Enter revenue, cost of sales and total labour, and the calculator returns prime cost in money and as a percentage of revenue, plus what remains to cover fixed costs.',
    descriptionAr:
      'تُراجع تكلفة الطعام وتكلفة العمالة منفصلتين عادة، وهو ما يخفي المقايضة بينهما: فالمكوّن الأرخص الذي يستغرق تحضيره وقتاً أطول ينقل التكلفة من بند إلى آخر دون أن يفيد المشروع.\n\nوالتكلفة الأولية تقرؤهما معاً. أدخل الإيراد وتكلفة المبيعات وإجمالي العمالة، فتعيد الحاسبة التكلفة الأولية بالمال وكنسبة من الإيراد، وما يتبقى لتغطية التكاليف الثابتة.',
    purposeEn: 'To read cost of sales and labour as one number, since they move against each other.',
    purposeAr: 'لقراءة تكلفة المبيعات والعمالة كرقم واحد، لأن كلاً منهما يتحرك مقابل الآخر.',
    config: {
      currency: '',
      inputs: [
        n('revenue', 'Revenue for the period', 'الإيراد للفترة', 250000),
        n('costOfSales', 'Cost of sales', 'تكلفة المبيعات', 75000, 'Food, beverage and packaging.', 'الطعام والمشروبات والتغليف.'),
        n('labourCost', 'Total labour cost', 'إجمالي تكلفة العمالة', 62500, 'All wages, benefits and related charges for the period.', 'كل الأجور والمزايا والرسوم المرتبطة للفترة.'),
      ],
      outputs: [
        out('primeCost', 'Prime cost', 'التكلفة الأولية', 'costOfSales + labourCost', 'currency', 0, false),
        out('primeCostPct', 'Prime cost % of revenue', 'التكلفة الأولية كنسبة من الإيراد', 'revenue > 0 ? (costOfSales + labourCost) / revenue * 100 : 0', 'percent', 1, true),
        out('costOfSalesPct', 'Cost of sales %', 'نسبة تكلفة المبيعات', 'revenue > 0 ? costOfSales / revenue * 100 : 0', 'percent', 1, false),
        out('labourPct', 'Labour %', 'نسبة العمالة', 'revenue > 0 ? labourCost / revenue * 100 : 0', 'percent', 1, false),
        out('afterPrimeCost', 'Remaining for fixed costs', 'المتبقي للتكاليف الثابتة', 'revenue - costOfSales - labourCost', 'currency', 0, false),
      ],
      notesEn:
        'There is no universal prime cost target. What it should be depends on the concept, the service model and the rent, and the useful comparison is against your own trend rather than against a published figure.',
      notesAr:
        'لا يوجد هدف عام للتكلفة الأولية. فما ينبغي أن تكون عليه يعتمد على المفهوم ونموذج الخدمة والإيجار، والمقارنة المفيدة هي مع اتجاهك أنت لا مع رقم منشور.',
    },
  },
  {
    slug: 'marketing-roi-calculator',
    order: 8,
    featured: false,
    nameEn: 'Marketing Return Calculator',
    nameAr: 'حاسبة عائد التسويق',
    summaryEn: 'Return on ad spend recalculated on contribution, plus the break-even return your margin actually requires.',
    summaryAr: 'العائد على الإنفاق الإعلاني محسوباً على المساهمة، مع عائد التعادل الذي يتطلبه هامشك فعلاً.',
    descriptionEn:
      'Platforms report return against revenue, while the business runs on contribution. A campaign can post a healthy ratio and still lose money once food cost, packaging and commission are subtracted.\n\nEnter spend, the revenue attributed to it and the variable cost percentage, and the calculator returns the reported return, the return on contribution, and the break-even return your margin requires — the number that says whether to scale or stop.',
    descriptionAr:
      'تُبلّغ المنصات عن العائد مقابل الإيراد، بينما يعيش المشروع على المساهمة. وقد تسجل حملة نسبة صحية وتخسر مالاً بعد خصم تكلفة الطعام والتغليف والعمولة.\n\nأدخل الإنفاق والإيراد المنسوب إليه ونسبة التكاليف المتغيرة، فتعيد الحاسبة العائد المُبلَّغ عنه، والعائد على المساهمة، وعائد التعادل الذي يتطلبه هامشك، وهو الرقم الذي يقول إن كان عليك التوسع أم التوقف.',
    purposeEn: 'To judge advertising on contribution rather than on revenue.',
    purposeAr: 'للحكم على الإعلان بالمساهمة لا بالإيراد.',
    config: {
      currency: '',
      inputs: [
        n('adSpend', 'Ad spend', 'الإنفاق الإعلاني', 20000),
        n('attributedRevenue', 'Revenue attributed to the spend', 'الإيراد المنسوب للإنفاق', 80000),
        n('variableCostPct', 'Variable cost % of revenue', 'نسبة التكاليف المتغيرة من الإيراد', 45, 'Food, packaging and channel commission on that revenue.', 'الطعام والتغليف وعمولة القناة على ذلك الإيراد.'),
      ],
      outputs: [
        out('reportedRoas', 'Reported return on ad spend', 'العائد المُبلَّغ عنه على الإنفاق', 'adSpend > 0 ? attributedRevenue / adSpend : 0', 'number', 2, false),
        out('contribution', 'Contribution from that revenue', 'المساهمة من ذلك الإيراد', 'attributedRevenue * (1 - variableCostPct / 100)', 'currency', 0, false),
        out('netAfterSpend', 'Contribution after ad spend', 'المساهمة بعد الإنفاق الإعلاني', 'attributedRevenue * (1 - variableCostPct / 100) - adSpend', 'currency', 0, true),
        out('breakEvenRoas', 'Break-even return required', 'عائد التعادل المطلوب', 'variableCostPct < 100 ? 1 / (1 - variableCostPct / 100) : 0', 'number', 2, false),
      ],
      notesEn:
        'Attribution is an estimate, not a fact. Treat the attributed revenue as the platform’s claim and the contribution view as the sanity check on it.',
      notesAr:
        'النسب تقدير لا حقيقة. تعامل مع الإيراد المنسوب بوصفه ادعاء المنصة، ومع منظور المساهمة بوصفه اختبار المعقولية عليه.',
    },
  },
  {
    slug: 'labour-cost-calculator',
    order: 9,
    featured: false,
    nameEn: 'Labour Cost Calculator',
    nameAr: 'حاسبة تكلفة العمالة',
    summaryEn: 'Labour percentage alongside sales per labour hour — the measure a rota can actually be managed by.',
    summaryAr: 'نسبة العمالة إلى جانب المبيعات لكل ساعة عمل، وهو المقياس الذي يمكن إدارة الجدول به فعلاً.',
    descriptionEn:
      'Labour percentage is a result; the rota is the decision. Sales per labour hour is closer to the decision, because it can be compared across shifts and used when building a schedule.\n\nEnter revenue, total labour cost and hours scheduled for the same period, and the calculator returns labour percentage, average cost per hour and sales per labour hour.',
    descriptionAr:
      'نسبة العمالة نتيجة، والجدول هو القرار. والمبيعات لكل ساعة عمل أقرب إلى القرار لأنها قابلة للمقارنة بين الورديات وللاستخدام عند بناء الجدول.\n\nأدخل الإيراد وإجمالي تكلفة العمالة والساعات المجدولة للفترة نفسها، فتعيد الحاسبة نسبة العمالة ومتوسط التكلفة بالساعة والمبيعات لكل ساعة عمل.',
    purposeEn: 'To turn a labour ratio into a number a rota can be built against.',
    purposeAr: 'لتحويل نسبة العمالة إلى رقم يمكن بناء الجدول عليه.',
    config: {
      currency: '',
      inputs: [
        n('revenue', 'Revenue for the period', 'الإيراد للفترة', 250000),
        n('labourCost', 'Total labour cost', 'إجمالي تكلفة العمالة', 62500),
        n('hoursScheduled', 'Hours scheduled', 'الساعات المجدولة', 1800, 'Total paid hours across all roles for the same period.', 'إجمالي الساعات المدفوعة لكل الأدوار للفترة نفسها.'),
      ],
      outputs: [
        out('labourPct', 'Labour % of revenue', 'نسبة العمالة من الإيراد', 'revenue > 0 ? labourCost / revenue * 100 : 0', 'percent', 1, false),
        out('salesPerLabourHour', 'Sales per labour hour', 'المبيعات لكل ساعة عمل', 'hoursScheduled > 0 ? revenue / hoursScheduled : 0', 'currency', 2, true),
        out('costPerHour', 'Average cost per hour', 'متوسط التكلفة بالساعة', 'hoursScheduled > 0 ? labourCost / hoursScheduled : 0', 'currency', 2, false),
      ],
      notesEn:
        'Compare sales per labour hour across shifts rather than against an external figure. The useful question is which shift is out of line with your own others, and why.',
      notesAr:
        'قارن المبيعات لكل ساعة عمل بين الورديات لا مقابل رقم خارجي. فالسؤال المفيد هو أي وردية خارجة عن سياق ورديّاتك الأخرى ولماذا.',
    },
  },
  {
    slug: 'branch-payback-calculator',
    order: 10,
    featured: false,
    nameEn: 'Branch Payback Calculator',
    nameAr: 'حاسبة استرداد استثمار الفرع',
    summaryEn: 'How long a new site takes to return its investment, with the ramp-up period included rather than ignored.',
    summaryAr: 'كم يستغرق الموقع الجديد لاسترداد استثماره، مع إدراج فترة التصاعد لا تجاهلها.',
    descriptionEn:
      'Most payback estimates assume the new site reaches its steady state immediately. It does not, and the months before it does are funded from somewhere.\n\nEnter the investment, the expected monthly revenue at steady state, the variable cost percentage, the monthly fixed costs and the ramp-up period. The calculator returns monthly contribution, monthly profit at steady state and payback in months including the ramp.',
    descriptionAr:
      'تفترض معظم تقديرات الاسترداد أن الموقع الجديد يبلغ حالته المستقرة فوراً، وهو لا يفعل، والأشهر التي تسبق ذلك تُموَّل من مكان ما.\n\nأدخل الاستثمار والإيراد الشهري المتوقع عند الاستقرار ونسبة التكاليف المتغيرة والتكاليف الثابتة الشهرية وفترة التصاعد، فتعيد الحاسبة المساهمة الشهرية والربح الشهري عند الاستقرار والاسترداد بالأشهر شاملاً فترة التصاعد.',
    purposeEn: 'To size an expansion decision with the ramp-up period counted.',
    purposeAr: 'لتقدير قرار التوسع مع احتساب فترة التصاعد.',
    config: {
      currency: '',
      inputs: [
        n('investment', 'Total investment', 'إجمالي الاستثمار', 1500000, 'Fit-out, equipment, deposits, pre-opening costs and initial stock.', 'التجهيز والمعدات والودائع وتكاليف ما قبل الافتتاح والمخزون الأولي.'),
        n('monthlyRevenue', 'Monthly revenue at steady state', 'الإيراد الشهري عند الاستقرار', 400000),
        n('variableCostPct', 'Variable cost % of revenue', 'نسبة التكاليف المتغيرة من الإيراد', 45),
        n('monthlyFixedCosts', 'Monthly fixed costs', 'التكاليف الثابتة الشهرية', 140000),
        n('rampMonths', 'Ramp-up period (months)', 'فترة التصاعد (أشهر)', 6, 'Months before the site reaches steady state. Contribution is assumed to average half of steady state during the ramp.', 'الأشهر قبل بلوغ الموقع حالته المستقرة. ويُفترض أن تبلغ المساهمة في المتوسط نصف مستوى الاستقرار خلالها.'),
      ],
      outputs: [
        out('monthlyContribution', 'Monthly contribution at steady state', 'المساهمة الشهرية عند الاستقرار', 'monthlyRevenue * (1 - variableCostPct / 100)', 'currency', 0, false),
        out('monthlyProfit', 'Monthly profit at steady state', 'الربح الشهري عند الاستقرار', 'monthlyRevenue * (1 - variableCostPct / 100) - monthlyFixedCosts', 'currency', 0, true),
        out('rampShortfall', 'Cash consumed during ramp-up', 'النقد المستهلك خلال التصاعد', 'max(0, (monthlyFixedCosts - monthlyRevenue * (1 - variableCostPct / 100) * 0.5) * rampMonths)', 'currency', 0, false),
        out('paybackMonths', 'Payback including ramp-up (months)', 'الاسترداد شاملاً التصاعد (أشهر)', 'monthlyRevenue * (1 - variableCostPct / 100) - monthlyFixedCosts > 0 ? rampMonths + (investment + max(0, (monthlyFixedCosts - monthlyRevenue * (1 - variableCostPct / 100) * 0.5) * rampMonths)) / (monthlyRevenue * (1 - variableCostPct / 100) - monthlyFixedCosts) : 0', 'number', 1, false),
      ],
      notesEn:
        'The ramp is modelled simply, as contribution averaging half of steady state across the ramp months. It is a planning approximation, not a forecast — the useful test is what happens to payback when the ramp takes twice as long as assumed.',
      notesAr:
        'تُنمذج فترة التصاعد ببساطة، بافتراض أن المساهمة تبلغ في المتوسط نصف مستوى الاستقرار خلال أشهرها. وهو تقريب تخطيطي لا توقع، والاختبار المفيد هو ما يحدث للاسترداد حين يستغرق التصاعد ضعف المفترض.',
    },
  },
];
