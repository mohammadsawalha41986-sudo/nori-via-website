/**
 * Food & Beverage positioning, service catalogue, tools and library entries.
 *
 * Everything here is provisioning, not code: each item is created only if it is
 * absent, and each singleton field is rewritten only when it still holds a
 * value this repository shipped. An edit made in Admin therefore always wins,
 * and running the script twice changes nothing the second time.
 *
 * No client, statistic, award or result is invented. The service catalogue is
 * the one supplied by the business; every illustrative figure is labelled as an
 * illustration.
 */

/* ------------------------------------------------------------- positioning */

export const POSITIONING = {
  settings: {
    /* The registered brand entity. Search results were resolving the short
       name to unrelated, similarly spelled companies, so the full name is what
       the site states about itself everywhere. */
    companyNameEn: 'NORIVA GLOBAL',
    companyNameAr: 'نوريفا جلوبال',
    taglineEn: 'Food & Beverage · Consulting · Development · Growth',
    taglineAr: 'الأغذية والمشروبات · استشارات · تطوير · نمو',
    descriptionEn:
      'A specialized Food & Beverage consulting and development partner, helping restaurants, cafés and food & beverage businesses build, improve, market and grow stronger businesses.',
    descriptionAr:
      'شريك متخصص في استشارات وتطوير مشاريع الأغذية والمشروبات، نساعد المطاعم والمقاهي ومشاريع الطعام والشراب على تأسيس أعمال أقوى، وتحسين أدائها، وتسويقها، وتطويرها ونموها.',
    footerDescriptionEn:
      'Food & Beverage consulting, development, marketing and growth for restaurants, cafés and F&B concepts.',
    footerDescriptionAr:
      'استشارات وتطوير وتسويق ونمو لمشاريع الأغذية والمشروبات: المطاعم والمقاهي ومفاهيم الطعام والشراب.',
    seoTitleEn: 'Restaurant & F&B Consulting, Development and Growth in Saudi Arabia',
    seoTitleAr: 'استشارات وتطوير المطاعم والمقاهي وقطاع الأغذية والمشروبات في السعودية',
    seoDescriptionEn:
      'Specialized F&B consulting: concept development, feasibility, operations, profitability, menu engineering and pricing, marketing and growth for restaurants, cafés and food & beverage businesses.',
    seoDescriptionAr:
      'استشارات متخصصة في الأغذية والمشروبات: تطوير المفاهيم ودراسات الجدوى والتشغيل والربحية وهندسة وتسعير القوائم والتسويق والنمو للمطاعم والمقاهي ومشاريع الطعام والشراب.',
  },
  homepage: {
    heroEyebrowEn: 'Food & Beverage · Consulting · Development · Growth',
    heroEyebrowAr: 'الأغذية والمشروبات · استشارات · تطوير · نمو',
    heroHeadlineEn: 'We develop\nbetter F&B businesses.',
    heroHeadlineAr: 'نطوّر\nمشاريع أغذية ومشروبات أفضل.',
    heroSubtitleEn:
      'We help restaurants, cafés and food & beverage businesses develop stronger concepts, improve performance, build better customer experiences and grow with clearer decisions.',
    heroSubtitleAr:
      'نساعد المطاعم والمقاهي ومشاريع الأغذية والمشروبات على تطوير مفاهيم أقوى، وتحسين الأداء، وبناء تجارب أفضل للعملاء، والنمو من خلال قرارات أوضح.',
    heroPrimaryCtaEn: 'Start a Project',
    heroPrimaryCtaAr: 'ابدأ مشروعك',
    heroSecondaryCtaEn: 'Explore Our Services',
    heroSecondaryCtaAr: 'اكتشف خدماتنا',
    statementEn:
      'Food & Beverage is the specialisation, not a sector we also serve. Restaurants, cafés, bakeries, dessert and beverage concepts, cloud kitchens and multi-branch operators — the work is the same discipline applied to each.',
    statementAr:
      'الأغذية والمشروبات هي التخصص، لا قطاعاً نخدمه بين قطاعات أخرى. المطاعم والمقاهي والمخابز ومفاهيم الحلويات والمشروبات والمطابخ السحابية والعلامات متعددة الفروع — العمل هو المنهجية ذاتها مطبّقة على كل حالة.',
  },
};

/* ------------------------------------------------------- service catalogue */

export const SERVICE_GROUPS = [
  { slug: 'fnb-consulting-management', nameEn: 'F&B Consulting & Management', nameAr: 'استشارات وإدارة الأغذية والمشروبات', order: 1 },
  { slug: 'fnb-development', nameEn: 'F&B Development', nameAr: 'تطوير مشاريع الأغذية والمشروبات', order: 2 },
  { slug: 'finance-profitability', nameEn: 'Finance & Profitability', nameAr: 'المالية والربحية', order: 3 },
  { slug: 'menu-product', nameEn: 'Menu & Product', nameAr: 'القائمة والمنتج', order: 4 },
  { slug: 'marketing-advertising', nameEn: 'Marketing & Advertising', nameAr: 'التسويق والإعلان', order: 5 },
  { slug: 'brand-customer-experience', nameEn: 'Brand & Customer Experience', nameAr: 'العلامة وتجربة العميل', order: 6 },
  { slug: 'growth-expansion', nameEn: 'Growth & Expansion', nameAr: 'النمو والتوسع', order: 7 },
];

/** Shared opening questions: who is asking, and about what kind of business. */
const BASE_QUESTIONS = [
  {
    key: 'businessType',
    labelEn: 'What kind of business is it?',
    labelAr: 'ما نوع المشروع؟',
    type: 'select',
    required: true,
    helpEn: '', helpAr: '',
    options: [
      { value: 'restaurant', labelEn: 'Restaurant', labelAr: 'مطعم' },
      { value: 'cafe', labelEn: 'Café / coffee shop', labelAr: 'مقهى' },
      { value: 'bakery', labelEn: 'Bakery / dessert concept', labelAr: 'مخبز / حلويات' },
      { value: 'qsr', labelEn: 'Fast casual / QSR', labelAr: 'وجبات سريعة' },
      { value: 'cloud-kitchen', labelEn: 'Cloud kitchen / delivery-only', labelAr: 'مطبخ سحابي / توصيل فقط' },
      { value: 'beverage', labelEn: 'Beverage concept', labelAr: 'مفهوم مشروبات' },
      { value: 'food-retail', labelEn: 'Food retail', labelAr: 'تجزئة غذائية' },
      { value: 'other', labelEn: 'Other F&B concept', labelAr: 'مفهوم آخر في الأغذية والمشروبات' },
    ],
  },
  {
    key: 'stage',
    labelEn: 'Is this a new project or an existing business?',
    labelAr: 'هل المشروع جديد أم قائم؟',
    type: 'select',
    required: true,
    helpEn: '', helpAr: '',
    options: [
      { value: 'new', labelEn: 'New project', labelAr: 'مشروع جديد' },
      { value: 'existing', labelEn: 'Existing business', labelAr: 'مشروع قائم' },
    ],
  },
  {
    key: 'branches',
    labelEn: 'How many branches?',
    labelAr: 'كم عدد الفروع؟',
    type: 'number',
    required: false,
    helpEn: '', helpAr: '', options: [],
  },
  {
    key: 'city',
    labelEn: 'City',
    labelAr: 'المدينة',
    type: 'text',
    required: false,
    helpEn: '', helpAr: '', options: [],
  },
  {
    key: 'challenge',
    labelEn: 'What is the main challenge you want solved?',
    labelAr: 'ما التحدي الرئيسي الذي تريد حلّه؟',
    type: 'longtext',
    required: true,
    helpEn: '', helpAr: '', options: [],
  },
  {
    key: 'outcome',
    labelEn: 'What outcome would make this worthwhile?',
    labelAr: 'ما النتيجة التي تجعل هذا العمل مجدياً بالنسبة لك؟',
    type: 'longtext',
    required: false,
    helpEn: '', helpAr: '', options: [],
  },
];

const q = (key, labelEn, labelAr, type = 'text', required = false, options = [], helpEn = '', helpAr = '') => ({
  key, labelEn, labelAr, type, required, options, helpEn, helpAr,
});

/** The menu questionnaire the business asked for, in full. */
const MENU_QUESTIONS = [
  ...BASE_QUESTIONS,
  q('menuType', 'What kind of menu is it?', 'ما نوع القائمة؟', 'multiselect', false, [
    { value: 'dine-in', labelEn: 'Dine-in', labelAr: 'داخل الفرع' },
    { value: 'delivery', labelEn: 'Delivery', labelAr: 'توصيل' },
    { value: 'takeaway', labelEn: 'Takeaway', labelAr: 'طلبات خارجية' },
    { value: 'beverage', labelEn: 'Beverage / café menu', labelAr: 'قائمة مشروبات / مقهى' },
    { value: 'seasonal', labelEn: 'Seasonal or promotional', labelAr: 'موسمية أو ترويجية' },
  ]),
  q('itemCount', 'How many items are on the menu?', 'كم عدد الأصناف في القائمة؟', 'number'),
  q('cuisine', 'Cuisine or concept', 'نوع المطبخ أو المفهوم'),
  q('averageTicket', 'Current average ticket', 'متوسط قيمة الفاتورة الحالية', 'number'),
  q('foodCost', 'Current food cost %, if known', 'نسبة تكلفة الطعام الحالية إن كانت معروفة', 'number'),
  q('bestSellers', 'Best-selling items', 'الأصناف الأكثر مبيعاً', 'longtext'),
  q('slowSellers', 'Slow-selling items', 'الأصناف الأقل مبيعاً', 'longtext'),
  q('salesSplit', 'Roughly how do sales split between dine-in, delivery and takeaway?',
    'ما التوزيع التقريبي للمبيعات بين داخل الفرع والتوصيل والطلبات الخارجية؟', 'longtext'),
  q('beverageShare', 'Beverage share of sales, if applicable', 'حصة المشروبات من المبيعات إن وُجدت', 'text'),
  q('discounts', 'Do you run discounts, combos or add-ons?', 'هل لديك خصومات أو وجبات مركبة أو إضافات؟', 'longtext'),
  q('menuFormat', 'Current menu format', 'صيغة القائمة الحالية', 'select', false, [
    { value: 'printed', labelEn: 'Printed', labelAr: 'مطبوعة' },
    { value: 'digital', labelEn: 'Digital / QR', labelAr: 'رقمية / QR' },
    { value: 'delivery-app', labelEn: 'Delivery app', labelAr: 'تطبيق توصيل' },
    { value: 'mixed', labelEn: 'Mixed', labelAr: 'مختلطة' },
  ]),
  q('menuProblem', 'What is the main problem with the menu today?', 'ما المشكلة الأساسية في القائمة اليوم؟', 'longtext', true),
];

const intake = (headlineEn, headlineAr, introEn, introAr, questions, uploadsEn, uploadsAr) => ({
  headlineEn, headlineAr, introEn, introAr,
  uploadsEn: uploadsEn ?? 'Anything that helps us understand the business: menus, sales or cost reports, POS exports, photos.',
  uploadsAr: uploadsAr ?? 'أي ملفات تساعدنا على فهم المشروع: القوائم، تقارير المبيعات أو التكاليف، تصدير نقاط البيع، صور.',
  questions,
});

/**
 * The catalogue. Only the menu service ships published, because its page is
 * written in full here; the rest are created as drafts carrying their name,
 * summary and questionnaire, for the team to complete and publish in Admin.
 */
export const FNB_SERVICES = [
  // D — Menu & product (the flagship service, published)
  {
    slug: 'menu-strategy-engineering-pricing',
    group: 'menu-product',
    status: 'PUBLISHED',
    order: 1,
    nameEn: 'Menu Strategy, Engineering & Pricing',
    nameAr: 'دراسة وتطوير وهندسة وتسعير قوائم الطعام',
    summaryEn:
      'A structured study of what your menu sells, what each item earns, and what to change — item performance, food cost, pricing, product mix and menu structure.',
    summaryAr:
      'دراسة منهجية لما تبيعه قائمتك، وما يحققه كل صنف، وما الذي يجب تغييره — أداء الأصناف وتكلفة الطعام والتسعير ومزيج المنتجات وبنية القائمة.',
    heroDescriptionEn:
      'Most menus are written, then never read as a commercial document. This service reads it as one: which items carry the business, which quietly cost it money, and what the menu should look like next.',
    heroDescriptionAr:
      'تُكتب معظم القوائم ثم لا تُقرأ أبداً كوثيقة تجارية. هذه الخدمة تقرؤها كذلك: أي الأصناف يحمل المشروع، وأيها يكلّفه بهدوء، وكيف ينبغي أن تكون القائمة بعد ذلك.',
    whatWeDoEn:
      'We work from your own numbers. Sales by item, item cost, price and category are brought together so each item can be placed by two measures at once: how well it sells, and what it contributes after food cost.\n\nFrom there the study covers menu structure and size, category performance, product mix, pricing and gross and contribution margin, combos, add-ons and upselling opportunities, and the differences between the dine-in, delivery and beverage menus — which rarely deserve the same prices or the same list of items.',
    whatWeDoAr:
      'نعمل انطلاقاً من أرقامك أنت. نجمع مبيعات كل صنف وتكلفته وسعره وتصنيفه لنتمكن من تحديد موقعه بمقياسين معاً: مدى إقباله، وما يساهم به بعد تكلفة الطعام.\n\nومن هناك تشمل الدراسة بنية القائمة وحجمها، وأداء التصنيفات، ومزيج المنتجات، والتسعير وهوامش الربح الإجمالي والمساهمة، والوجبات المركبة والإضافات وفرص البيع الإضافي، والفروق بين قوائم داخل الفرع والتوصيل والمشروبات — وهي نادراً ما تستحق الأسعار نفسها أو القائمة نفسها من الأصناف.',
    approachEn:
      'The analysis is only half of it. Recommendations are written to be acted on: which items to keep, rework, reprice or retire, in what order, and what to measure afterwards so the change can be judged rather than assumed.',
    approachAr:
      'التحليل نصف العمل فقط. تُكتب التوصيات لتُنفَّذ: أي الأصناف يُبقى عليه، وأيها يُعاد تطويره أو تسعيره أو سحبه، وبأي ترتيب، وما الذي يُقاس بعد ذلك ليُحكم على التغيير بدل افتراض نتيجته.',
    deliverables: [
      ['Menu performance analysis', 'تحليل أداء القائمة'],
      ['Item profitability analysis', 'تحليل ربحية الأصناف'],
      ['Menu engineering matrix', 'مصفوفة هندسة القائمة'],
      ['Pricing recommendations', 'توصيات التسعير'],
      ['Product mix analysis', 'تحليل مزيج المنتجات'],
      ['Food cost review', 'مراجعة تكلفة الطعام'],
      ['Menu structure recommendations', 'توصيات بنية القائمة'],
      ['Low-performing item identification', 'تحديد الأصناف ضعيفة الأداء'],
      ['High-potential item identification', 'تحديد الأصناف الواعدة'],
      ['Delivery menu review', 'مراجعة قائمة التوصيل'],
      ['Promotional item analysis', 'تحليل الأصناف الترويجية'],
    ],
    process: [
      ['Data', 'البيانات', 'Sales by item, costs, prices and the current menu.', 'مبيعات كل صنف وتكاليفه وأسعاره والقائمة الحالية.'],
      ['Analysis', 'التحليل', 'Popularity and contribution for every item and category.', 'الإقبال والمساهمة لكل صنف وتصنيف.'],
      ['Recommendations', 'التوصيات', 'What to keep, rework, reprice or retire — and in what order.', 'ما يُبقى عليه أو يُعاد تطويره أو تسعيره أو سحبه — وبأي ترتيب.'],
      ['Follow-up', 'المتابعة', 'What to measure after the change, so the result can be judged.', 'ما الذي يُقاس بعد التغيير ليُحكم على النتيجة.'],
    ],
    faqs: [
      [
        'What do you need from us to start?',
        'ما الذي تحتاجونه منا للبدء؟',
        'The current menu, sales by item for a representative period, and item costs. A POS export is usually enough; where costs are missing we work with you to build them.',
        'القائمة الحالية، ومبيعات كل صنف لفترة تمثيلية، وتكاليف الأصناف. عادةً يكفي تصدير من نقاط البيع؛ وحين تغيب التكاليف نبنيها معك.',
      ],
      [
        'Do you guarantee a specific increase?',
        'هل تضمنون زيادة محددة؟',
        'No. The study identifies what the numbers support and what to change; the result depends on execution, and on conditions no consultant controls.',
        'لا. تحدد الدراسة ما تدعمه الأرقام وما الذي ينبغي تغييره؛ أما النتيجة فتعتمد على التنفيذ وعلى ظروف لا يتحكم بها أي مستشار.',
      ],
      [
        'Does this apply to a café menu?',
        'هل ينطبق هذا على قائمة مقهى؟',
        'Yes. Beverage-led menus are analysed the same way, with attention to modifiers, sizes and the share of sales that beverages carry.',
        'نعم. تُحلَّل القوائم التي تقودها المشروبات بالطريقة ذاتها، مع الانتباه إلى الإضافات والأحجام وحصة المشروبات من المبيعات.',
      ],
    ],
    intake: intake(
      'Menu study request',
      'طلب دراسة قائمة',
      'The more of this you can answer, the more of the first conversation can be about findings rather than fact-finding.',
      'كلما أجبت عن المزيد من هذه الأسئلة، أصبح اللقاء الأول عن النتائج بدل جمع المعلومات.',
      MENU_QUESTIONS,
      'Please attach the current menu (PDF or Excel), a sales report or POS export by item, and a cost sheet if you have one.',
      'يرجى إرفاق القائمة الحالية (PDF أو Excel)، وتقرير مبيعات أو تصدير نقاط بيع لكل صنف، وورقة تكاليف إن وُجدت.',
    ),
    /* Labelled as an illustration wherever it is rendered. */
    example: {
      titleEn: 'A café with 40 items',
      titleAr: 'مقهى يضم ٤٠ صنفاً',
      bodyEn:
        'A café lists 40 items, but a small number of them generate most of the sales. Bringing together sales, food cost, price, contribution and popularity places every item in one of four groups — stars, plowhorses, puzzles and dogs — and the shape of the menu becomes an argument rather than an opinion.\n\nWhat follows is a sequence: analysis, then recommendations, then menu changes, then a pricing review, then follow-up measurement. This is an illustration of the method. It is not a client result, and no figure here describes a real business.',
      bodyAr:
        'يعرض مقهى ٤٠ صنفاً، لكن عدداً قليلاً منها يحقق معظم المبيعات. جمع المبيعات وتكلفة الطعام والسعر والمساهمة والإقبال يضع كل صنف في واحدة من أربع مجموعات — النجوم، وخيول العمل، والألغاز، والكلاب — فتتحول بنية القائمة إلى حجة مبنية على الأرقام بدل رأي.\n\nثم يأتي التسلسل: تحليل، فتوصيات، فتعديلات على القائمة، فمراجعة أسعار، فقياس للمتابعة. هذا مثال توضيحي للمنهجية، وليس نتيجة عميل، ولا يصف أي رقم فيه مشروعاً حقيقياً.',
    },
  },

  // Remaining catalogue — created as drafts for the team to complete.
  ...[
    ['fnb-consulting', 'fnb-consulting-management', 'F&B Consulting', 'استشارات الأغذية والمشروبات',
      'Advisory across concept, operations, cost and commercial performance for food and beverage businesses.',
      'استشارات تشمل المفهوم والتشغيل والتكلفة والأداء التجاري لمشاريع الأغذية والمشروبات.'],
    ['restaurant-consulting', 'fnb-consulting-management', 'Restaurant Consulting', 'استشارات المطاعم',
      'Restaurant-specific advisory: operations, cost, service and commercial performance.',
      'استشارات خاصة بالمطاعم: التشغيل والتكلفة والخدمة والأداء التجاري.'],
    ['cafe-consulting', 'fnb-consulting-management', 'Café Consulting', 'استشارات المقاهي',
      'Café and coffee shop advisory: beverage programme, operations, cost and customer experience.',
      'استشارات المقاهي ومحلات القهوة: برنامج المشروبات والتشغيل والتكلفة وتجربة العميل.'],
    ['management-advisory', 'fnb-consulting-management', 'Management Advisory', 'الاستشارات الإدارية',
      'Ongoing advisory for owners and operators making decisions about their F&B business.',
      'استشارات مستمرة للملّاك والمشغّلين عند اتخاذ القرارات في مشاريع الأغذية والمشروبات.'],
    ['fnb-audit', 'fnb-consulting-management', 'Comprehensive F&B Audit', 'تقييم شامل لمشروع الأغذية والمشروبات',
      'A full review of the business — concept, operations, cost, menu, marketing and customer experience.',
      'مراجعة شاملة للمشروع: المفهوم والتشغيل والتكلفة والقائمة والتسويق وتجربة العميل.'],
    ['operational-audit', 'fnb-consulting-management', 'Operational Audit', 'التقييم التشغيلي',
      'A review of how the operation actually runs, including field visits where appropriate.',
      'مراجعة لطريقة عمل التشغيل فعلياً، وتشمل زيارات ميدانية عند الحاجة.'],

    ['new-restaurant-project', 'fnb-development', 'New Restaurant Project', 'مشروع مطعم جديد',
      'Developing a new restaurant from concept through to opening readiness.',
      'تطوير مطعم جديد من المفهوم وحتى الجاهزية للافتتاح.'],
    ['new-cafe-project', 'fnb-development', 'New Café Project', 'مشروع مقهى جديد',
      'Developing a new café or coffee shop from concept through to opening readiness.',
      'تطوير مقهى جديد من المفهوم وحتى الجاهزية للافتتاح.'],
    ['concept-development', 'fnb-development', 'F&B Concept Development', 'تطوير مفهوم غذائي',
      'Defining what the concept is, who it is for, and how it is different in its market.',
      'تحديد ماهية المفهوم، ولمن هو موجّه، وكيف يختلف في سوقه.'],
    ['feasibility-study', 'fnb-development', 'Feasibility Study', 'دراسة الجدوى',
      'Assessing whether the project holds together commercially before the money is committed.',
      'تقييم مدى تماسك المشروع تجارياً قبل التزام رأس المال.'],
    ['expansion-study', 'fnb-development', 'Expansion Study', 'دراسة التوسع',
      'Assessing readiness for a new branch, and what has to be true before opening it.',
      'تقييم الجاهزية لفرع جديد، وما الذي يجب أن يتحقق قبل افتتاحه.'],

    ['profitability-analysis', 'finance-profitability', 'Profitability Analysis', 'تحليل الربحية',
      'Where the money is actually made and lost across items, categories, channels and branches.',
      'أين يُكسب المال ويُخسر فعلياً عبر الأصناف والتصنيفات والقنوات والفروع.'],
    ['cost-reduction', 'finance-profitability', 'Cost Reduction', 'خفض التكاليف',
      'Reducing cost without cutting the things customers actually pay for.',
      'خفض التكاليف دون المساس بما يدفع العملاء مقابله فعلاً.'],
    ['financial-planning', 'finance-profitability', 'Financial Planning & Budget', 'التخطيط المالي والموازنة',
      'Annual budget, break-even analysis and the numbers a decision should be made against.',
      'الموازنة السنوية وتحليل نقطة التعادل والأرقام التي يُبنى عليها القرار.'],

    ['menu-pricing', 'menu-product', 'Menu Pricing', 'تسعير القائمة',
      'Pricing reviewed against cost, contribution, positioning and what the market will carry.',
      'مراجعة الأسعار مقابل التكلفة والمساهمة والتموضع وما يحتمله السوق.'],
    ['food-cost-analysis', 'menu-product', 'Food Cost Analysis', 'تحليل تكلفة الطعام',
      'Recipe and item costing, and what the food cost percentage is actually telling you.',
      'تكلفة الوصفات والأصناف، وما الذي تعنيه نسبة تكلفة الطعام فعلياً.'],
    ['delivery-menu-pricing', 'menu-product', 'Delivery Menu & Pricing', 'قائمة وتسعير التوصيل',
      'The delivery menu treated as its own commercial problem: commission, packaging and price.',
      'التعامل مع قائمة التوصيل كمسألة تجارية مستقلة: العمولة والتغليف والسعر.'],

    ['fnb-marketing', 'marketing-advertising', 'F&B Marketing', 'تسويق الأغذية والمشروبات',
      'Marketing built around what an F&B business actually needs: covers, frequency and spend.',
      'تسويق مبني على ما يحتاجه مشروع الأغذية والمشروبات فعلاً: عدد الزوار والتكرار والإنفاق.'],
    ['social-media-management-fnb', 'marketing-advertising', 'Social Media', 'إدارة السوشال ميديا',
      'Social media for restaurants and cafés: content, publishing and community.',
      'السوشال ميديا للمطاعم والمقاهي: المحتوى والنشر والتفاعل مع الجمهور.'],
    ['advertising-campaigns', 'marketing-advertising', 'Advertising & Campaigns', 'الدعاية والحملات الإعلانية',
      'Paid campaigns for launches, seasons and new branches, measured against what they returned.',
      'حملات مدفوعة للافتتاحات والمواسم والفروع الجديدة، تُقاس بما حققته.'],

    ['brand-identity-fnb', 'brand-customer-experience', 'Brand & Concept Positioning', 'العلامة وتموضع المفهوم',
      'Positioning, identity and the way the concept presents itself.',
      'التموضع والهوية والطريقة التي يقدّم بها المفهوم نفسه.'],
    ['menu-design', 'brand-customer-experience', 'Menu Design & Packaging', 'تصميم القائمة والتغليف',
      'The menu and packaging as the two pieces of design a customer always sees.',
      'القائمة والتغليف بوصفهما العنصرين اللذين يراهما العميل دائماً.'],
    ['customer-experience', 'brand-customer-experience', 'Customer Experience', 'تجربة العميل',
      'The experience across the branch, the app and everything between them.',
      'التجربة داخل الفرع وعبر التطبيق وكل ما بينهما.'],

    ['fnb-growth', 'growth-expansion', 'F&B Growth', 'نمو مشاريع الأغذية والمشروبات',
      'Growing an existing F&B business on the levers it actually has.',
      'تنمية مشروع قائم في الأغذية والمشروبات اعتماداً على الأدوات المتاحة له فعلاً.'],
    ['branch-development', 'growth-expansion', 'Branch Development', 'تطوير الفروع',
      'Opening and improving branches without losing what made the first one work.',
      'افتتاح الفروع وتحسينها دون فقدان ما جعل الفرع الأول ناجحاً.'],
    ['performance-improvement', 'growth-expansion', 'Performance Improvement', 'تحسين الأداء',
      'A structured programme against the numbers that are underperforming.',
      'برنامج منظّم يعالج المؤشرات التي يقل أداؤها عن المطلوب.'],
  ].map(([slug, group, nameEn, nameAr, summaryEn, summaryAr], index) => ({
    slug,
    group,
    status: 'DRAFT',
    order: index + 2,
    nameEn,
    nameAr,
    summaryEn,
    summaryAr,
    heroDescriptionEn: '',
    heroDescriptionAr: '',
    whatWeDoEn: '',
    whatWeDoAr: '',
    approachEn: '',
    approachAr: '',
    deliverables: [],
    process: [],
    faqs: [],
    intake: intake(
      `${nameEn} request`,
      `طلب: ${nameAr}`,
      'Tell us about the business and what you need, and we will come back to you.',
      'أخبرنا عن المشروع وما تحتاجه وسنعود إليك.',
      BASE_QUESTIONS,
    ),
    example: null,
  })),
];

/* ------------------------------------------------------------------- tools */

/** Real calculators, each one arithmetic a consultant would do by hand. */
export const FNB_TOOLS = [
  {
    slug: 'food-cost-calculator',
    nameEn: 'Food Cost Calculator',
    nameAr: 'حاسبة تكلفة الطعام',
    summaryEn: 'Food cost percentage and gross margin for a single item, from its cost and selling price.',
    summaryAr: 'نسبة تكلفة الطعام وهامش الربح الإجمالي لصنف واحد، انطلاقاً من تكلفته وسعر بيعه.',
    featured: true,
    order: 1,
    config: {
      currency: '',
      inputs: [
        { key: 'itemCost', labelEn: 'Item cost', labelAr: 'تكلفة الصنف', type: 'number', defaultValue: 12, min: 0, max: null, step: null, unit: '', options: [], helpEn: 'What the item costs you to produce.', helpAr: 'ما يكلفك إنتاج الصنف.' },
        { key: 'sellingPrice', labelEn: 'Selling price', labelAr: 'سعر البيع', type: 'number', defaultValue: 40, min: 0, max: null, step: null, unit: '', options: [], helpEn: '', helpAr: '' },
      ],
      outputs: [
        { key: 'foodCostPct', labelEn: 'Food cost %', labelAr: 'نسبة تكلفة الطعام', expression: 'sellingPrice > 0 ? itemCost / sellingPrice * 100 : 0', format: 'percent', precision: 1, primary: true, helpEn: '', helpAr: '' },
        { key: 'grossProfit', labelEn: 'Gross profit per item', labelAr: 'الربح الإجمالي للصنف', expression: 'sellingPrice - itemCost', format: 'currency', precision: 2, primary: false, helpEn: '', helpAr: '' },
        { key: 'grossMargin', labelEn: 'Gross margin %', labelAr: 'هامش الربح الإجمالي', expression: 'sellingPrice > 0 ? (sellingPrice - itemCost) / sellingPrice * 100 : 0', format: 'percent', precision: 1, primary: false, helpEn: '', helpAr: '' },
      ],
      notesEn: 'Food cost percentage is a ratio, not a verdict. A high-cost item that sells well can contribute more money than a low-cost item nobody orders — which is why the menu study looks at contribution alongside popularity.',
      notesAr: 'نسبة تكلفة الطعام مؤشر لا حكم نهائي. قد يساهم صنف مرتفع التكلفة كثير المبيع بمال أكثر من صنف منخفض التكلفة لا يطلبه أحد — ولهذا تنظر دراسة القائمة إلى المساهمة إلى جانب الإقبال.',
    },
  },
  {
    slug: 'menu-pricing-calculator',
    nameEn: 'Menu Pricing Calculator',
    nameAr: 'حاسبة تسعير القائمة',
    summaryEn: 'The price an item needs to hit a target food cost percentage, before and after VAT.',
    summaryAr: 'السعر الذي يحتاجه الصنف لتحقيق نسبة تكلفة طعام مستهدفة، قبل الضريبة وبعدها.',
    featured: true,
    order: 2,
    config: {
      currency: '',
      inputs: [
        { key: 'itemCost', labelEn: 'Item cost', labelAr: 'تكلفة الصنف', type: 'number', defaultValue: 12, min: 0, max: null, step: null, unit: '', options: [], helpEn: '', helpAr: '' },
        { key: 'targetFoodCost', labelEn: 'Target food cost %', labelAr: 'نسبة تكلفة الطعام المستهدفة', type: 'number', defaultValue: 30, min: 1, max: 95, step: null, unit: '%', options: [], helpEn: '', helpAr: '' },
        { key: 'vat', labelEn: 'VAT %', labelAr: 'نسبة ضريبة القيمة المضافة', type: 'number', defaultValue: 15, min: 0, max: 50, step: null, unit: '%', options: [], helpEn: '', helpAr: '' },
      ],
      outputs: [
        { key: 'priceExVat', labelEn: 'Price before VAT', labelAr: 'السعر قبل الضريبة', expression: 'targetFoodCost > 0 ? itemCost / (targetFoodCost / 100) : 0', format: 'currency', precision: 2, primary: true, helpEn: '', helpAr: '' },
        { key: 'priceIncVat', labelEn: 'Price including VAT', labelAr: 'السعر شامل الضريبة', expression: 'priceExVat * (1 + vat / 100)', format: 'currency', precision: 2, primary: false, helpEn: '', helpAr: '' },
        { key: 'contribution', labelEn: 'Contribution per item', labelAr: 'مساهمة الصنف', expression: 'priceExVat - itemCost', format: 'currency', precision: 2, primary: false, helpEn: '', helpAr: '' },
      ],
      notesEn: 'This gives the arithmetic price. What a guest will actually pay is a separate question, and the two are reconciled in the pricing review rather than in a calculator.',
      notesAr: 'يعطي هذا السعر الحسابي. أما ما سيدفعه الضيف فعلاً فمسألة أخرى، ويُوفَّق بينهما في مراجعة التسعير لا في حاسبة.',
    },
  },
  {
    slug: 'contribution-margin-calculator',
    nameEn: 'Contribution Margin Calculator',
    nameAr: 'حاسبة هامش المساهمة',
    summaryEn: 'What an item contributes per sale and per month, once its cost is taken out.',
    summaryAr: 'ما يساهم به الصنف في كل عملية بيع وفي الشهر، بعد خصم تكلفته.',
    featured: false,
    order: 3,
    config: {
      currency: '',
      inputs: [
        { key: 'price', labelEn: 'Selling price', labelAr: 'سعر البيع', type: 'number', defaultValue: 40, min: 0, max: null, step: null, unit: '', options: [], helpEn: '', helpAr: '' },
        { key: 'cost', labelEn: 'Item cost', labelAr: 'تكلفة الصنف', type: 'number', defaultValue: 12, min: 0, max: null, step: null, unit: '', options: [], helpEn: '', helpAr: '' },
        { key: 'unitsPerMonth', labelEn: 'Units sold per month', labelAr: 'عدد الوحدات المباعة شهرياً', type: 'number', defaultValue: 300, min: 0, max: null, step: null, unit: '', options: [], helpEn: '', helpAr: '' },
      ],
      outputs: [
        { key: 'contribution', labelEn: 'Contribution per unit', labelAr: 'المساهمة لكل وحدة', expression: 'price - cost', format: 'currency', precision: 2, primary: true, helpEn: '', helpAr: '' },
        { key: 'monthly', labelEn: 'Monthly contribution', labelAr: 'المساهمة الشهرية', expression: 'contribution * unitsPerMonth', format: 'currency', precision: 0, primary: false, helpEn: '', helpAr: '' },
        { key: 'marginPct', labelEn: 'Contribution margin %', labelAr: 'نسبة هامش المساهمة', expression: 'price > 0 ? contribution / price * 100 : 0', format: 'percent', precision: 1, primary: false, helpEn: '', helpAr: '' },
      ],
      notesEn: 'Monthly contribution is the number that decides whether an item earns its place on the menu — a small margin on a popular item often beats a large margin on a rare one.',
      notesAr: 'المساهمة الشهرية هي الرقم الذي يحدد ما إذا كان الصنف يستحق مكانه في القائمة — فهامش صغير على صنف رائج يتفوق غالباً على هامش كبير على صنف نادر.',
    },
  },
  {
    slug: 'discount-impact-calculator',
    nameEn: 'Discount Impact Calculator',
    nameAr: 'حاسبة أثر الخصم',
    summaryEn: 'How much extra volume a discount has to generate before it stops costing you money.',
    summaryAr: 'كم من الزيادة في الكمية يحتاجها الخصم قبل أن يتوقف عن تكليفك مالاً.',
    featured: true,
    order: 4,
    config: {
      currency: '',
      inputs: [
        { key: 'price', labelEn: 'Normal price', labelAr: 'السعر الاعتيادي', type: 'number', defaultValue: 40, min: 0, max: null, step: null, unit: '', options: [], helpEn: '', helpAr: '' },
        { key: 'cost', labelEn: 'Item cost', labelAr: 'تكلفة الصنف', type: 'number', defaultValue: 12, min: 0, max: null, step: null, unit: '', options: [], helpEn: '', helpAr: '' },
        { key: 'discount', labelEn: 'Discount %', labelAr: 'نسبة الخصم', type: 'number', defaultValue: 25, min: 0, max: 90, step: null, unit: '%', options: [], helpEn: '', helpAr: '' },
      ],
      outputs: [
        { key: 'newPrice', labelEn: 'Discounted price', labelAr: 'السعر بعد الخصم', expression: 'price * (1 - discount / 100)', format: 'currency', precision: 2, primary: false, helpEn: '', helpAr: '' },
        { key: 'newContribution', labelEn: 'Contribution after discount', labelAr: 'المساهمة بعد الخصم', expression: 'newPrice - cost', format: 'currency', precision: 2, primary: false, helpEn: '', helpAr: '' },
        { key: 'volumeNeeded', labelEn: 'Extra volume needed to break even', labelAr: 'الزيادة المطلوبة في الكمية للتعادل', expression: 'newContribution > 0 ? ((price - cost) / newContribution - 1) * 100 : 0', format: 'percent', precision: 1, primary: true, helpEn: 'Compared with selling the same item at full price.', helpAr: 'مقارنةً ببيع الصنف نفسه بالسعر الكامل.' },
      ],
      notesEn: 'When contribution after the discount reaches zero or below, no amount of extra volume recovers it: every additional sale increases the loss.',
      notesAr: 'حين تصل المساهمة بعد الخصم إلى الصفر أو أقل، لا تعوّضها أي زيادة في الكمية: كل عملية بيع إضافية تزيد الخسارة.',
    },
  },
  {
    slug: 'delivery-pricing-calculator',
    nameEn: 'Delivery Pricing Calculator',
    nameAr: 'حاسبة تسعير التوصيل',
    summaryEn: 'What is left of a delivery order after commission and packaging, and the price that protects it.',
    summaryAr: 'ما يتبقى من طلب التوصيل بعد العمولة والتغليف، والسعر الذي يحمي هذا المتبقي.',
    featured: false,
    order: 5,
    config: {
      currency: '',
      inputs: [
        { key: 'price', labelEn: 'Delivery menu price', labelAr: 'سعر قائمة التوصيل', type: 'number', defaultValue: 45, min: 0, max: null, step: null, unit: '', options: [], helpEn: '', helpAr: '' },
        { key: 'cost', labelEn: 'Item cost', labelAr: 'تكلفة الصنف', type: 'number', defaultValue: 12, min: 0, max: null, step: null, unit: '', options: [], helpEn: '', helpAr: '' },
        { key: 'packaging', labelEn: 'Packaging cost', labelAr: 'تكلفة التغليف', type: 'number', defaultValue: 3, min: 0, max: null, step: null, unit: '', options: [], helpEn: '', helpAr: '' },
        { key: 'commission', labelEn: 'Platform commission %', labelAr: 'نسبة عمولة المنصة', type: 'number', defaultValue: 25, min: 0, max: 60, step: null, unit: '%', options: [], helpEn: '', helpAr: '' },
        { key: 'targetContribution', labelEn: 'Target contribution per order', labelAr: 'المساهمة المستهدفة لكل طلب', type: 'number', defaultValue: 15, min: 0, max: null, step: null, unit: '', options: [], helpEn: '', helpAr: '' },
      ],
      outputs: [
        { key: 'netRevenue', labelEn: 'Net revenue after commission', labelAr: 'صافي الإيراد بعد العمولة', expression: 'price * (1 - commission / 100)', format: 'currency', precision: 2, primary: false, helpEn: '', helpAr: '' },
        { key: 'contribution', labelEn: 'Contribution per order', labelAr: 'المساهمة لكل طلب', expression: 'netRevenue - cost - packaging', format: 'currency', precision: 2, primary: true, helpEn: '', helpAr: '' },
        { key: 'requiredPrice', labelEn: 'Price needed for the target', labelAr: 'السعر اللازم لتحقيق المستهدف', expression: 'commission < 100 ? (cost + packaging + targetContribution) / (1 - commission / 100) : 0', format: 'currency', precision: 2, primary: false, helpEn: '', helpAr: '' },
      ],
      notesEn: 'Commission applies to the menu price, so a delivery menu priced like the dine-in menu quietly sells at a different margin. This is the arithmetic behind pricing the two separately.',
      notesAr: 'تُحتسب العمولة على سعر القائمة، لذا فإن تسعير قائمة التوصيل كقائمة داخل الفرع يعني البيع بهامش مختلف دون أن يلاحظ أحد. هذه هي الحسبة وراء تسعير القائمتين بشكل منفصل.',
    },
  },
];

/* ----------------------------------------------------------------- library */

/** Entries are created as drafts: a resource cannot publish without its file. */
export const FNB_RESOURCES = [
  ['menu-engineering-template', 'EXCEL', 'Menu Engineering Template', 'قالب هندسة القائمة',
    'A worksheet that places every item by popularity and contribution, and groups them accordingly.',
    'ورقة عمل تحدد موقع كل صنف حسب الإقبال والمساهمة وتصنّفها تبعاً لذلك.'],
  ['menu-pricing-worksheet', 'EXCEL', 'Menu Pricing Worksheet', 'ورقة عمل تسعير القائمة',
    'Item cost, target food cost and resulting price, item by item.',
    'تكلفة الصنف ونسبة التكلفة المستهدفة والسعر الناتج، صنفاً بصنف.'],
  ['food-cost-sheet', 'EXCEL', 'Food Cost Sheet', 'ورقة تكلفة الطعام',
    'Recipe-level costing for a menu, with yields and unit costs.',
    'تكلفة على مستوى الوصفة للقائمة، مع الكميات وتكاليف الوحدات.'],
  ['item-profitability-analysis', 'EXCEL', 'Item Profitability Analysis', 'تحليل ربحية الأصناف',
    'Contribution per item and per month, ranked.',
    'المساهمة لكل صنف وشهرياً، مرتبة تنازلياً.'],
  ['product-mix-analysis', 'EXCEL', 'Product Mix Analysis', 'تحليل مزيج المنتجات',
    'Category and item share of sales, and how it moves over a period.',
    'حصة التصنيفات والأصناف من المبيعات وتغيرها عبر فترة.'],
  ['restaurant-kpi-dashboard', 'EXCEL', 'Restaurant KPI Dashboard', 'لوحة مؤشرات أداء المطعم',
    'The operating numbers a restaurant should be able to see weekly.',
    'الأرقام التشغيلية التي ينبغي أن يراها المطعم أسبوعياً.'],
  ['cafe-kpi-dashboard', 'EXCEL', 'Café KPI Dashboard', 'لوحة مؤشرات أداء المقهى',
    'The same discipline for a café, with beverage-led measures.',
    'المنهجية ذاتها للمقهى، مع مؤشرات تناسب المشروبات.'],
  ['annual-budget-model', 'EXCEL', 'Annual Budget Model', 'نموذج الموازنة السنوية',
    'A budget structure for an F&B business, by month and by cost line.',
    'هيكل موازنة لمشروع أغذية ومشروبات، بحسب الشهر وبند التكلفة.'],
  ['menu-review-checklist', 'PDF', 'Menu Review Checklist', 'قائمة مراجعة القائمة',
    'What to look at before deciding a menu needs to change.',
    'ما ينبغي فحصه قبل الحكم بأن القائمة تحتاج إلى تغيير.'],
  ['menu-engineering-guide', 'GUIDE', 'Menu Engineering Guide', 'دليل هندسة القائمة',
    'How the method works, and how to read the four groups it produces.',
    'كيف تعمل المنهجية، وكيف تُقرأ المجموعات الأربع التي تنتجها.'],
  ['menu-pricing-checklist', 'PDF', 'Menu Pricing Checklist', 'قائمة مراجعة التسعير',
    'The checks to run before changing a price.',
    'الفحوصات الواجبة قبل تغيير أي سعر.'],
  ['restaurant-audit-checklist', 'PDF', 'Restaurant Audit Checklist', 'قائمة تقييم المطعم',
    'A structured walk through a restaurant operation.',
    'جولة منظّمة في تشغيل المطعم.'],
  ['cafe-audit-checklist', 'PDF', 'Café Audit Checklist', 'قائمة تقييم المقهى',
    'The same walk for a café.', 'الجولة ذاتها للمقهى.'],
  ['opening-checklist', 'PDF', 'Opening Checklist', 'قائمة مراجعة الافتتاح',
    'What has to be ready before a new branch opens.',
    'ما الذي يجب أن يكون جاهزاً قبل افتتاح فرع جديد.'],
  ['expansion-checklist', 'PDF', 'Expansion Checklist', 'قائمة مراجعة التوسع',
    'What has to be true before opening the next branch.',
    'ما الذي يجب أن يتحقق قبل افتتاح الفرع التالي.'],
  ['menu-development-brief', 'WORD', 'Menu Development Brief', 'موجز تطوير القائمة',
    'A brief template for a menu development project.',
    'قالب موجز لمشروع تطوير قائمة.'],
  ['marketing-plan-template', 'WORD', 'Marketing Plan Template', 'قالب الخطة التسويقية',
    'A marketing plan structure for an F&B business.',
    'هيكل خطة تسويقية لمشروع أغذية ومشروبات.'],
  ['campaign-brief-template', 'WORD', 'Campaign Brief', 'موجز الحملة',
    'A brief template for a campaign, launch or seasonal push.',
    'قالب موجز لحملة أو افتتاح أو نشاط موسمي.'],
];

/* ------------------------------------------------- knowledge architecture */

export const INSIGHT_CATEGORIES = [
  ['fnb-management', 'F&B Management', 'إدارة الأغذية والمشروبات'],
  ['restaurant-management', 'Restaurant Management', 'إدارة المطاعم'],
  ['cafe-management', 'Café Management', 'إدارة المقاهي'],
  ['operations', 'Operations', 'التشغيل'],
  ['finance-profitability', 'Finance & Profitability', 'المالية والربحية'],
  ['food-cost', 'Food Cost', 'تكلفة الطعام'],
  ['menu-engineering', 'Menu Engineering', 'هندسة القائمة'],
  ['menu-pricing', 'Menu Pricing', 'تسعير القائمة'],
  ['purchasing-inventory', 'Purchasing & Inventory', 'المشتريات والمخزون'],
  ['marketing-advertising', 'Marketing & Advertising', 'التسويق والإعلان'],
  ['social-media', 'Social Media', 'السوشال ميديا'],
  ['customer-experience', 'Customer Experience', 'تجربة العميل'],
  ['branding', 'Branding', 'العلامة التجارية'],
  ['development-new-concepts', 'Development & New Concepts', 'التطوير والمفاهيم الجديدة'],
  ['expansion-growth', 'Expansion & Growth', 'التوسع والنمو'],
];

/* ------------------------------------------------------------- start here */

export const START_HERE_PATHS_FNB = [
  ['I am opening a new F&B project', 'أؤسس مشروعاً جديداً', 'Concept, feasibility and development.', 'المفهوم ودراسة الجدوى والتطوير', '/services/new-restaurant-project'],
  ['I want my existing business assessed', 'أريد تقييم مشروعي الحالي', 'A comprehensive F&B audit.', 'تقييم شامل للمشروع', '/services/fnb-audit'],
  ['I want to improve profitability', 'أريد تحسين الربحية', 'Where the money is made and lost.', 'أين يُكسب المال ويُخسر', '/services/profitability-analysis'],
  ['I want to reduce costs', 'أريد خفض التكاليف', 'Cost reduction without cutting what customers pay for.', 'خفض التكاليف دون المساس بما يدفع العملاء مقابله', '/services/cost-reduction'],
  ['I want to improve operations', 'أريد تطوير التشغيل', 'An operational audit of how the business runs.', 'تقييم تشغيلي لطريقة عمل المشروع', '/services/operational-audit'],
  ['I want my menu studied and developed', 'أريد دراسة وتطوير القائمة', 'Menu strategy, engineering and pricing.', 'دراسة وهندسة وتسعير القائمة', '/services/menu-strategy-engineering-pricing'],
  ['I want to review my prices', 'أريد مراجعة الأسعار', 'Pricing against cost, contribution and positioning.', 'التسعير مقابل التكلفة والمساهمة والتموضع', '/services/menu-pricing'],
  ['I want better marketing', 'أريد تحسين التسويق', 'F&B marketing built on the numbers.', 'تسويق مبني على الأرقام', '/services/fnb-marketing'],
  ['I want advertising and campaigns', 'أريد الدعاية والإعلان', 'Paid campaigns, measured.', 'حملات مدفوعة تُقاس نتائجها', '/services/advertising-campaigns'],
  ['I want social media managed', 'أريد إدارة السوشال ميديا', 'Content, publishing and community.', 'المحتوى والنشر والتفاعل', '/services/social-media-management-fnb'],
  ['I want to develop the brand and experience', 'أريد تطوير العلامة والتجربة', 'Positioning, identity and customer experience.', 'التموضع والهوية وتجربة العميل', '/services/brand-identity-fnb'],
  ['I want to expand', 'أريد التوسع', 'Expansion readiness and branch development.', 'الجاهزية للتوسع وتطوير الفروع', '/services/expansion-study'],
  ['I have a café I want to develop', 'أملك مقهى وأريد تطويره', 'Café consulting and development.', 'استشارات وتطوير المقاهي', '/services/cafe-consulting'],
  ['I am not sure yet', 'لست متأكداً', 'Start with a conversation and we will point you at the right service.', 'ابدأ بمحادثة وسنوجهك إلى الخدمة المناسبة', '/start-a-project'],
].map(([titleEn, titleAr, bodyEn, bodyAr, href]) => ({
  titleEn, titleAr, bodyEn, bodyAr, href,
  labelEn: 'Continue', labelAr: 'متابعة',
}));


/* -------------------------------------------------- service repositioning */

/**
 * Copy that shipped before the Food & Beverage correction, and what replaces
 * it. As with the site positioning, a field is rewritten only while it still
 * holds the old shipped text, so anything edited in Admin is left alone.
 *
 * Content & Production is a content service for F&B — food and product
 * photography, social post design, campaign assets — not film
 * or editorial production.
 */
/*
 * Superseded by CONTENT_SERVICE_REPOSITIONING below, and deliberately left in
 * place: its `now` values are what production rows still hold, and they are
 * matched verbatim as the `was` of the newer entry. Both run in one pass, so a
 * row at either the original or the intermediate wording lands on the current
 * one. Editing the strings here would break that chain.
 */
export const SERVICE_REPOSITIONING = [
  {
    slug: 'content-production',
    was: {
      summaryEn: 'Photography, film, and editorial content produced against a plan rather than one shoot at a time.',
      summaryAr: 'تصوير وأفلام ومحتوى تحريري يُنتَج وفق خطة، لا جلسة تصوير في كل مرة.',
      whatWeDoEn:
        'Art direction, stills and motion, food and interior photography, short-form social video, and the editorial writing that holds it together in both Arabic and English. We plan production in cycles so a single shoot supplies a quarter of scheduled content rather than a fortnight of scrambling.',
      whatWeDoAr:
        'التوجيه الفني، والصور الثابتة والمتحركة، وتصوير الطعام والديكور، والفيديو القصير للمنصات، والكتابة التحريرية التي تربطها بالعربية والإنجليزية. نخطط الإنتاج على دورات، لتغذّي جلسة واحدة محتوى ربع كامل بدل أسبوعين من الارتجال.',
    },
    now: {
      summaryEn: 'Designed social posts, stories and carousels — planned as a monthly set rather than made one post at a time.',
      summaryAr: 'تصميم منشورات وقصص ومنشورات متعددة الشرائح، تُخطَّط كحزمة شهرية لا منشوراً في كل مرة.',
      whatWeDoEn: 'Art direction and design for the social channel: Instagram feed posts, Instagram and TikTok stories, multi-slide carousels, offer and campaign artwork, and the Arabic and English typography that keeps all of it reading as one brand. We plan a month at a time, so the channel is designed against a calendar rather than assembled the night before.',
      whatWeDoAr: 'التوجيه الفني والتصميم لقناة التواصل: منشورات إنستغرام، وقصص إنستغرام وتيك توك، والمنشورات متعددة الشرائح، وتصاميم العروض والحملات، والقواعد الطباعية العربية والإنجليزية التي تُبقيها جميعاً بصوت علامة واحدة. نخطط شهراً كاملاً، فتُصمَّم القناة وفق تقويم لا في الليلة السابقة للنشر.',
      seoDescriptionEn: 'Social media post design for restaurants and cafés: Instagram feed, Instagram and TikTok stories, carousels and campaign artwork in Arabic and English.',
      seoDescriptionAr: 'تصميم منشورات منصات التواصل للمطاعم والمقاهي: إنستغرام فيد، وقصص إنستغرام وتيك توك، والمنشورات متعددة الشرائح، وتصاميم الحملات بالعربية والإنجليزية.',
    },
    deliverables: [
      { labelEn: 'Food photography', labelAr: 'تصوير الطعام' },
      { labelEn: 'Product photography', labelAr: 'تصوير المنتجات' },
      { labelEn: 'Short-form video', labelAr: 'الفيديو القصير' },
      { labelEn: 'Social media content', labelAr: 'محتوى منصات التواصل' },
      { labelEn: 'Campaign assets', labelAr: 'أصول الحملات' },
      { labelEn: 'Content systems', labelAr: 'أنظمة المحتوى' },
    ],
  },
];

/*
 * The About page, as a restaurant and café consultancy.
 *
 * The page shipped with the studio-era copy that described a brand and digital
 * studio — an accurate description of neither the company nor the catalogue it
 * publishes. Each section names one of the disciplines the service catalogue
 * actually contains, and carries the photograph that belongs to that
 * discipline, so the page reads as a specialisation rather than a list of
 * capabilities. Nothing here claims a client, a number or a result.
 */
export const ABOUT_FNB = {
  titleEn: 'Restaurant and café consulting, built around the numbers',
  titleAr: 'استشارات وتطوير المطاعم والمقاهي، مبنية على الأرقام',
  bodyEn:
    'NORIVA GLOBAL is a Food & Beverage consulting and development company working with restaurants and cafés in Saudi Arabia — on profitability, cost, menu, operations and the decisions behind opening and expanding.',
  bodyAr:
    'نوريفا جلوبال شركة استشارات وتطوير في قطاع الأغذية والمشروبات، تعمل مع المطاعم والمقاهي في السعودية على الربحية والتكلفة والمنيو والتشغيل والقرارات التي تسبق الافتتاح والتوسّع.',
  heroImage: '/img/about.jpg',
  sections: [
    {
      key: 'who-we-are',
      titleEn: 'Who we are',
      titleAr: 'من نحن',
      bodyEn:
        'We are a Food & Beverage consulting and development company working with restaurants, cafés and F&B concepts across Saudi Arabia. Our work sits where the kitchen, the menu and the P&L meet — with owners and operators who need a clear reading of the business before they decide what to change.\n\nWe are not a marketing agency that also advises on operations. The starting point is the commercial position of the business, and everything else follows from it.',
      bodyAr:
        'نحن شركة استشارات وتطوير في قطاع الأغذية والمشروبات، نعمل مع المطاعم والمقاهي والمفاهيم الغذائية في السعودية. يقع عملنا عند نقطة التقاء المطبخ والمنيو وقائمة الأرباح والخسائر، مع ملاك ومشغّلين يحتاجون قراءة واضحة لأعمالهم قبل أن يقرروا ما الذي يغيّرونه.\n\nنحن لسنا وكالة تسويق تقدّم نصائح تشغيلية على الهامش. نقطة البداية هي الوضع التجاري للنشاط، وكل ما بعدها يُبنى عليه.',
      image: '/img/noriva-service-restaurant-consulting.webp',
      imageAltEn: 'A consulting session with a restaurant owner in the dining room',
      imageAltAr: 'جلسة استشارية مع صاحب مطعم داخل صالة المطعم',
    },
    {
      key: 'sales-profitability',
      titleEn: 'Sales and profitability analysis',
      titleAr: 'تحليل المبيعات والربحية',
      bodyEn:
        'We read the business through its own numbers: sales by daypart, by channel and by item, contribution margin, average check and the gap between revenue that looks healthy and profit that is not.\n\nThe outcome is a picture of where the money is actually made and where it quietly leaves — before anyone spends on fixing the wrong thing.',
      bodyAr:
        'نقرأ النشاط من أرقامه: المبيعات حسب أوقات اليوم والقنوات والأصناف، وهامش المساهمة، ومتوسط الفاتورة، والفجوة بين إيراد يبدو جيداً وربح ليس كذلك.\n\nالنتيجة صورة واضحة لأين يُصنع الربح فعلاً وأين يتسرّب بهدوء، قبل أن تُنفق ميزانية على إصلاح الشيء الخطأ.',
      image: '/img/noriva-service-profitability-analysis.webp',
      imageAltEn: 'Reviewing restaurant sales and profitability reports',
      imageAltAr: 'مراجعة تقارير المبيعات والربحية في مطعم',
    },
    {
      key: 'food-cost',
      titleEn: 'Food cost and operating costs',
      titleAr: 'تكلفة الطعام والتكاليف التشغيلية',
      bodyEn:
        'Recipe costing, theoretical versus actual food cost, purchasing, inventory, waste and labour — examined as one cost structure rather than as separate line items.\n\nMost cost problems are not a supplier price. They are a difference between what a dish is supposed to cost and what it costs on a busy Thursday, and that difference is measurable.',
      bodyAr:
        'تكلفة الوصفات، والفرق بين التكلفة النظرية والفعلية للطعام، والمشتريات والمخزون والهدر والعمالة — تُدرس كهيكل تكلفة واحد لا كبنود منفصلة.\n\nمعظم مشاكل التكلفة ليست سعر مورّد، بل فرق بين ما يُفترض أن يكلّفه الطبق وما يكلّفه فعلاً في ليلة مزدحمة، وهذا الفرق قابل للقياس.',
      image: '/img/noriva-service-food-cost-analysis.webp',
      imageAltEn: 'Costing ingredients and portions in a professional kitchen',
      imageAltAr: 'احتساب تكلفة المكونات والحصص في مطبخ احترافي',
    },
    {
      key: 'menu',
      titleEn: 'Menu engineering and pricing',
      titleAr: 'هندسة المنيو وتسعيره',
      bodyEn:
        'The menu is the most commercial document a restaurant owns. We engineer it by margin and popularity, restructure what it leads with, and price it against cost, positioning and what the catchment will carry — including a separate reading for delivery, where commission changes the arithmetic.',
      bodyAr:
        'المنيو هو أكثر مستند تجاري يملكه المطعم. نهندسه وفق الهامش والإقبال، ونعيد ترتيب ما يتصدّره، ونسعّره وفق التكلفة والتموضع وما يحتمله النطاق المحيط — مع قراءة منفصلة للتوصيل، حيث تغيّر العمولة الحساب كله.',
      image: '/img/noriva-service-menu-strategy-engineering-pricing.webp',
      imageAltEn: 'Working through a menu as a commercial document',
      imageAltAr: 'العمل على المنيو بوصفه وثيقة تجارية',
    },
    {
      key: 'operations-experience',
      titleEn: 'Operations and guest experience',
      titleAr: 'تحسين التشغيل وتجربة العميل',
      bodyEn:
        'Where service breaks at peak, how long a table actually turns, what the second visit depends on, and which steps of the journey decide whether a guest returns.\n\nWe document the operating standard, then work with the team that has to run it — because an operations manual nobody uses changes nothing.',
      bodyAr:
        'أين تنكسر الخدمة في وقت الذروة، وكم تستغرق الطاولة فعلاً، وعلى ماذا تعتمد الزيارة الثانية، وأي خطوات الرحلة تحسم عودة الضيف من عدمها.\n\nنوثّق المعيار التشغيلي، ثم نعمل مع الفريق الذي سيطبّقه — لأن دليل تشغيل لا يستخدمه أحد لا يغيّر شيئاً.',
      image: '/img/noriva-service-customer-experience.webp',
      imageAltEn: 'Service and guest experience on the restaurant floor',
      imageAltAr: 'الخدمة وتجربة الضيف في صالة المطعم',
    },
    {
      key: 'feasibility',
      titleEn: 'Feasibility studies and project development',
      titleAr: 'دراسات الجدوى وتطوير المشاريع',
      bodyEn:
        'For a new restaurant or café, and for a second branch: concept definition, site evaluation, investment and pre-opening budget, revenue and cost modelling, break-even, and the pre-opening sequence that protects the budget.\n\nA feasibility study is only as good as the assumptions under it, so we write those down where they can be argued with.',
      bodyAr:
        'لمشروع مطعم أو مقهى جديد، وللفرع الثاني: تحديد المفهوم، وتقييم الموقع، وميزانية الاستثمار وما قبل الافتتاح، ونمذجة الإيرادات والتكاليف، ونقطة التعادل، وتسلسل ما قبل الافتتاح الذي يحمي الميزانية.\n\nقيمة دراسة الجدوى من قيمة افتراضاتها، لذلك نكتب تلك الافتراضات صراحةً حيث يمكن مناقشتها.',
      image: '/img/noriva-service-feasibility-study.webp',
      imageAltEn: 'Planning a new restaurant project and its feasibility',
      imageAltAr: 'التخطيط لمشروع مطعم جديد ودراسة جدواه',
    },
    {
      key: 'practical',
      titleEn: 'Practical work you can implement and measure',
      titleAr: 'حلول عملية قابلة للتنفيذ والقياس',
      bodyEn:
        'Every engagement ends with something the team can act on: a decision, a number to watch, a standard to hold, and a way to tell in thirty days whether it worked.\n\nWe would rather hand over a short list that gets implemented than a long report that gets filed.',
      bodyAr:
        'كل تكليف ينتهي بشيء يستطيع الفريق تنفيذه: قرار، ورقم يُتابَع، ومعيار يُلتزم به، وطريقة تُظهر خلال ثلاثين يوماً ما إذا كان قد نجح.\n\nنفضّل تسليم قائمة قصيرة تُنفَّذ على تقرير طويل يُحفَظ في الدرج.',
      image: '/img/noriva-service-performance-improvement.webp',
      imageAltEn: 'Reviewing measurable results with a restaurant team',
      imageAltAr: 'مراجعة نتائج قابلة للقياس مع فريق المطعم',
    },
  ],
};

/**
 * The studio-era About copy this page shipped with.
 *
 * Recorded so the rewrite above can replace it and *only* it: if an editor has
 * touched the page in Admin, none of these will match and the page is left
 * exactly as they left it.
 */
export const ABOUT_SHIPPED = {
  titleEn: [
    // The marketing-agency page prisma/seed.ts creates, which is what the live
    // site is actually serving.
    "WE'RE NOT JUST\nANOTHER MARKETING AGENCY.",
    // The studio-era page this provisioning script used to fill in.
    'A studio built as one team',
  ],
  titleAr: ['لسنا مجرد\nوكالة تسويق أخرى.', 'استوديو مبني كفريق واحد'],
  bodyEn: [
    'Noriva is a creative and growth company built specifically for restaurants. We work across marketing, advertising, branding and the commercial side of the business — the menu, the pricing and the margin that most agencies never look at.',
    'Brand, digital and growth in one place — because the losses in this kind of work happen at the handovers between them.',
  ],
  bodyAr: [
    'نوريفا شركة إبداع ونمو بُنيت خصيصًا للمطاعم. نعمل عبر التسويق والإعلان والهوية والجانب التجاري للنشاط: القائمة والتسعير والهامش الذي لا تنظر إليه معظم الوكالات.',
    'العلامة والرقمنة والنمو في مكان واحد، لأن الخسائر في هذا العمل تقع عند التسليم بينها.',
  ],
  /**
   * The section-key signatures the page has shipped with. Two of them, because
   * the page has had two shipped versions and a deployment may be sitting on
   * either — matching only one would silently skip the rewrite on the other.
   */
  sectionKeys: [
    ['who', 'believe', 'think', 'approach', 'expertise'],
    ['story', 'approach', 'bilingual', 'handover'],
  ],
};

/*
 * Services the company no longer offers.
 *
 * NORIVA GLOBAL does not produce video. These two services promised exactly
 * that, so they are withdrawn from the published catalogue and marked
 * `noindex` — a service that cannot be delivered is worse than a gap in the
 * list. The rows are kept rather than deleted: they hold their own history,
 * their images and any relations pointing at them.
 *
 * `shippedSummaryEn` is what makes this reversible. A service still carrying
 * the copy this repository shipped is still the video service, and is withdrawn
 * again on every deploy. Rewrite it in Admin into something the company does
 * deliver, and it stays published — the same contract every other rule in this
 * file follows, rather than a permanent lock an owner cannot undo.
 */
export const SERVICE_RETIREMENT = [
  {
    slug: 'video-production',
    shippedSummaryEn: 'Short-form video, campaign assets and the social content that carries the channel.',
  },
  {
    slug: 'reels-short-form',
    shippedSummaryEn: 'A steady supply of vertical video, produced at the volume the algorithm rewards.',
  },
];

/*
 * The content service, repositioned from production to design.
 *
 * It described recurring shoot days and short-form video — the same promise
 * the retired services made. What the company actually produces is the design
 * of social content: feed posts, stories, carousels and campaign artwork, in
 * Arabic and English. The `was` values are matched exactly, so an edited
 * service is never rewritten.
 */
export const CONTENT_SERVICE_REPOSITIONING = [
  {
    slug: 'content-production',
    was: {
      summaryEn:
        'Food and product photography, short-form video and social content, produced against a plan rather than one shoot at a time.',
      summaryAr: 'تصوير الطعام والمنتجات والفيديو القصير ومحتوى المنصات، يُنتَج وفق خطة لا جلسة تصوير في كل مرة.',
      whatWeDoEn:
        'Art direction, food and product photography, short-form video for social, campaign assets, and the content system that holds them together in both Arabic and English. We plan production in cycles, so one shoot supplies a quarter of scheduled content rather than a fortnight of scrambling.',
      whatWeDoAr:
        'التوجيه الفني، وتصوير الطعام والمنتجات، والفيديو القصير للمنصات، وأصول الحملات، ونظام المحتوى الذي يربطها بالعربية والإنجليزية. نخطط الإنتاج على دورات، لتغذّي جلسة واحدة محتوى ربع كامل بدل أسبوعين من الارتجال.',
    },
    now: {
      nameEn: 'Social Media Content Design',
      nameAr: 'تصميم محتوى منصات التواصل',
      summaryEn:
        'Designed social posts, stories and carousels — planned as a monthly set rather than made one post at a time.',
      summaryAr: 'تصميم منشورات وقصص ومنشورات متعددة الشرائح، تُخطَّط كحزمة شهرية لا منشوراً في كل مرة.',
      whatWeDoEn:
        'Art direction and design for the social channel: Instagram feed posts, Instagram and TikTok stories, multi-slide carousels, offer and campaign artwork, and the Arabic and English typography that keeps all of it reading as one brand. We plan a month at a time, so the channel is designed against a calendar rather than assembled the night before.',
      whatWeDoAr:
        'التوجيه الفني والتصميم لقناة التواصل: منشورات إنستغرام، وقصص إنستغرام وتيك توك، والمنشورات متعددة الشرائح، وتصاميم العروض والحملات، والقواعد الطباعية العربية والإنجليزية التي تُبقيها جميعاً بصوت علامة واحدة. نخطط شهراً كاملاً، فتُصمَّم القناة وفق تقويم لا في الليلة السابقة للنشر.',
      seoDescriptionEn:
        'Social media post design for restaurants and cafés: Instagram feed, Instagram and TikTok stories, carousels and campaign artwork in Arabic and English.',
      seoDescriptionAr:
        'تصميم منشورات منصات التواصل للمطاعم والمقاهي: إنستغرام فيد، وقصص إنستغرام وتيك توك، والمنشورات متعددة الشرائح، وتصاميم الحملات بالعربية والإنجليزية.',
    },
    deliverables: [
      { labelEn: 'Social media post design', labelAr: 'تصميم بوستات السوشال ميديا' },
      { labelEn: 'Instagram feed design', labelAr: 'تصميم Instagram Feed' },
      { labelEn: 'Instagram and TikTok stories', labelAr: 'قصص إنستغرام وتيك توك' },
      { labelEn: 'Carousels', labelAr: 'منشورات متعددة الشرائح (Carousels)' },
      { labelEn: 'Campaign designs', labelAr: 'تصاميم الحملات' },
      { labelEn: 'Arabic and English content', labelAr: 'المحتوى العربي والإنجليزي' },
    ],
    /** The deliverable set this service shipped with, matched before replacing. */
    shippedDeliverables: ['Food photography', 'Short-form video', 'Social media content'],
  },
  {
    slug: 'content-creation',
    was: {
      summaryEn: 'Food, people and place, shot properly — the raw material every other channel depends on.',
      summaryAr: 'الطعام والناس والمكان، بتصوير احترافي — المادة الخام التي تعتمد عليها كل قناة أخرى.',
      whatWeDoEn:
        'Recurring shoot days covering dishes, atmosphere, staff and process. We deliver a stocked library, not a one-off gallery, so the channel never runs dry.',
      whatWeDoAr: 'أيام تصوير دورية تغطي الأطباق والأجواء والفريق والعملية، مع تسليم مكتبة متجددة.',
      whyEn: 'You cannot run good advertising on bad assets. Creative quality sets the ceiling on every campaign that follows.',
      whyAr: 'لا يمكن تشغيل إعلان جيد بمواد رديئة؛ جودة الإبداع تحدد سقف كل حملة.',
      approachEn:
        'Shot list built from the content plan, art-directed on site, delivered as an organised and tagged asset library.',
      approachAr: 'قائمة لقطات مبنية على خطة المحتوى، بإدارة فنية في الموقع، وتسليم منظم.',
    },
    now: {
      nameEn: 'Social Post Design',
      nameAr: 'تصميم منشورات السوشال',
      summaryEn: 'The designed posts themselves — feed, stories, carousels and campaign artwork, in Arabic and English.',
      summaryAr: 'المنشورات المصمَّمة نفسها: الفيد والقصص والشرائح وتصاميم الحملات، بالعربية والإنجليزية.',
      whatWeDoEn:
        'Monthly design sets for the social channel: Instagram feed posts, Instagram and TikTok story frames, multi-slide carousels that carry an idea properly, and the offer and campaign artwork that sits alongside them.',
      whatWeDoAr:
        'حزم تصميم شهرية لقناة التواصل: منشورات إنستغرام، وإطارات قصص إنستغرام وتيك توك، ومنشورات متعددة الشرائح تحمل الفكرة كما ينبغي، وتصاميم العروض والحملات المرافقة لها.',
      whyEn:
        'A feed is read as one thing. Posts designed one at a time look like several brands sharing an account, and that is what a guest notices first.',
      whyAr: 'يُقرأ الحساب ككل واحد. المنشورات المصمَّمة واحداً تلو الآخر تبدو كعلامات متعددة تتشارك حساباً، وهذا أول ما يلاحظه الضيف.',
      approachEn:
        'A monthly plan, designed as a set against a template system, delivered in every size each placement needs and in both languages.',
      approachAr: 'خطة شهرية، تُصمَّم كحزمة واحدة وفق نظام قوالب، وتُسلَّم بكل المقاسات التي يحتاجها كل موضع وباللغتين.',
      seoDescriptionEn:
        'Social media post design for restaurants and cafés: Instagram feed, stories, carousels and campaign designs in Arabic and English.',
      seoDescriptionAr:
        'تصميم منشورات السوشال للمطاعم والمقاهي: إنستغرام فيد، والقصص، والمنشورات متعددة الشرائح، وتصاميم الحملات بالعربية والإنجليزية.',
    },
    deliverables: [
      { labelEn: 'Social media post design', labelAr: 'تصميم بوستات السوشال ميديا' },
      { labelEn: 'Instagram feed design', labelAr: 'تصميم Instagram Feed' },
      { labelEn: 'Instagram and TikTok stories', labelAr: 'قصص إنستغرام وتيك توك' },
      { labelEn: 'Carousels', labelAr: 'منشورات متعددة الشرائح (Carousels)' },
      { labelEn: 'Campaign designs', labelAr: 'تصاميم الحملات' },
      { labelEn: 'Arabic and English content', labelAr: 'المحتوى العربي والإنجليزي' },
    ],
    shippedDeliverables: ['Photography shoot days', 'Short-form video and reels'],
  },
];
