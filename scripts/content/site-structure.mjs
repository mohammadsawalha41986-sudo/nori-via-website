/**
 * Site structure: the Noriva System, editorial pages, taxonomy descriptions,
 * navigation ordering, settings, social channels, statistics and testimonials.
 *
 * Honesty rules applied here:
 *   - No contact detail is invented. Email, phone, WhatsApp, address and every
 *     social URL are left empty rather than filled with a plausible-looking
 *     value, because these render publicly and a wrong one is worse than none.
 *   - Statistics describe the methodology and are verifiable against this
 *     database (the number of practice groups, of disciplines, of calculators).
 *     They are still created hidden, so nothing unverified reaches a visitor.
 *   - Testimonials are created as clearly-labelled samples and unpublished.
 */

/* ------------------------------------------------------- the Noriva System */

/**
 * The ten disciplines. Steps 01–05 already exist; the four shipped by
 * prisma/seed.ts carry agency-era copy ("MAKE THEM NOTICE") that predates the
 * F&B positioning, so they are rewritten only while they still hold exactly
 * that shipped text — the same rule the repositioning layer already uses.
 */
export const SYSTEM_STAGES = [
  {
    step: '01',
    titleEn: 'Strategy',
    titleAr: 'الاستراتيجية',
    descriptionEn:
      'Everything begins with a decision that can be argued with: who the business is for, what occasion it serves, where it sits on price and why it would be chosen over the specific alternatives nearby. A definition that cannot be disagreed with cannot guide a decision either.',
    descriptionAr:
      'يبدأ كل شيء بقرار يمكن الاعتراض عليه: لمن هذا المشروع، وأي مناسبة يخدم، وأين يقع سعرياً، ولماذا يُختار على البدائل المحددة القريبة. فالتعريف الذي لا يمكن الاعتراض عليه لا يمكنه توجيه قرار.',
    services: ['Concept', 'Positioning', 'Feasibility', 'Growth strategy'],
    /** Replaces the agency-era stage only while it still holds shipped copy. */
    replacesTitleEn: 'MAKE THEM NOTICE',
  },
  {
    step: '02',
    titleEn: 'Brand',
    titleAr: 'العلامة',
    descriptionEn:
      'Identity follows the definition rather than preceding it. A system rather than a set of files: marque, Arabic and Latin type treated as one, colour, image direction and voice — tested where they are actually experienced, on a menu in low light and in a delivery bag.',
    descriptionAr:
      'تتبع الهوية التعريف ولا تسبقه. نظام لا مجموعة ملفات: العلامة، والخط العربي واللاتيني كنظام واحد، واللون واتجاه الصورة والصوت، مختبَرة حيث تُعاش فعلاً: على قائمة في إضاءة خافتة وداخل كيس توصيل.',
    services: ['Brand identity', 'Positioning', 'Tone of voice', 'Guidelines'],
    replacesTitleEn: 'MAKE THEM REMEMBER',
  },
  {
    step: '03',
    titleEn: 'Concept',
    titleAr: 'المفهوم',
    descriptionEn:
      'The offer made specific: menu structure and length, service model, price position and the room. This is where a strategy stops being a document and becomes a set of constraints a designer, a chef and a marketer can all build from without three interpretations.',
    descriptionAr:
      'العرض محدداً: بنية القائمة وطولها، ونموذج الخدمة، والموقع السعري، والمكان. وهنا تتوقف الاستراتيجية عن كونها وثيقة وتصير قيوداً يبني منها المصمم والطاهي والمسوّق دون ثلاثة تفسيرات.',
    services: ['Concept development', 'Menu direction', 'Service model', 'Spatial experience'],
    replacesTitleEn: 'MAKE THEM ORDER',
  },
  {
    step: '04',
    titleEn: 'Customer Experience',
    titleAr: 'تجربة العميل',
    descriptionEn:
      'The journey as a guest actually meets it — discovery, arrival, ordering, pace, payment, and for delivery the packaging and the unboxing. The second visit is decided by small frictions that never rose to the level of a complaint.',
    descriptionAr:
      'الرحلة كما يعيشها الضيف فعلاً: الاكتشاف والوصول والطلب والإيقاع والدفع، وللتوصيل التغليف ولحظة الفتح. والزيارة الثانية تحسمها احتكاكات صغيرة لم ترقَ إلى مستوى الشكوى.',
    services: ['Journey mapping', 'Service standards', 'Delivery experience', 'Feedback'],
    replacesTitleEn: 'MAKE THEM COME BACK',
  },
  {
    step: '05',
    titleEn: 'Menu & Product',
    titleAr: 'القائمة والمنتج',
    descriptionEn:
      'The menu read as a commercial document rather than a design object: every item placed by how often it is ordered and what it contributes after food cost, with a keep, rework, reprice or retire decision recorded against each one.',
    descriptionAr:
      'القائمة تُقرأ كوثيقة تجارية لا كعمل تصميمي: كل صنف موضوع حسب كم مرة يُطلب وكم يساهم بعد تكلفة الطعام، مع تسجيل قرار الإبقاء أو التطوير أو إعادة التسعير أو السحب لكل منه.',
    services: ['Menu engineering', 'Pricing', 'Recipe costing', 'Menu design'],
    replacesTitleEn: 'Grow',
  },
  {
    step: '06',
    titleEn: 'Operations',
    titleAr: 'التشغيل',
    descriptionEn:
      'What the kitchen and the floor can hold when the rest of the work succeeds. Service quality does not fall evenly; it fails at one station, at one volume, at one hour — and the point is locatable rather than a general shortage of effort.',
    descriptionAr:
      'ما يستطيع المطبخ والصالة تحمّله حين ينجح باقي العمل. فجودة الخدمة لا تتراجع بالتساوي، بل تنهار عند محطة واحدة وحجم واحد وساعة واحدة، والنقطة قابلة للتحديد لا نقصاً عاماً في الجهد.',
    services: ['Operational audit', 'Standards', 'Purchasing', 'Cost control'],
  },
  {
    step: '07',
    titleEn: 'Marketing',
    titleAr: 'التسويق',
    descriptionEn:
      'Built on everything above rather than instead of it. Marketing multiplies whatever the business already is — which makes it the cheapest growth available when the product is right, and the most expensive form of honesty when it is not.',
    descriptionAr:
      'مبني على كل ما سبق لا بديلاً عنه. فالتسويق يضاعف ما عليه المشروع أصلاً، ما يجعله أرخص نمو متاح حين يكون المنتج صحيحاً، وأغلى شكل من الصدق حين لا يكون.',
    services: ['Marketing strategy', 'Campaigns', 'Social media', 'Content'],
  },
  {
    step: '08',
    titleEn: 'Finance',
    titleAr: 'المالية',
    descriptionEn:
      'Contribution by item, daypart and channel, a cost base that is current, and a monthly cash view that shows the tight month while there is still time to act. Restaurants fail on cash timing more often than on the absence of eventual profit.',
    descriptionAr:
      'المساهمة حسب الصنف والوقت والقناة، وقاعدة تكلفة حديثة، ومنظور نقدي شهري يُظهر الشهر الضيق بينما ما زال الوقت متاحاً للتصرف. فالمطاعم تفشل على توقيت النقد أكثر من فشلها على غياب الربح.',
    services: ['Profitability analysis', 'Budgeting', 'Cash flow', 'Cost reduction'],
  },
  {
    step: '09',
    titleEn: 'Growth',
    titleAr: 'النمو',
    descriptionEn:
      'Sequenced rather than attempted at once. Five routes use capacity already paid for — mix, ticket, hours, channel and reach — before the sixth doubles the fixed costs and divides the management attention.',
    descriptionAr:
      'مرتَّب لا منفَّذ دفعة واحدة. فخمسة مسارات تستخدم طاقة دُفع ثمنها بالفعل — المزيج والفاتورة والساعات والقناة والوصول — قبل أن يضاعف السادس التكاليف الثابتة ويقسّم انتباه الإدارة.',
    services: ['Growth strategy', 'Expansion study', 'Branch development', 'Channel economics'],
  },
  {
    step: '10',
    titleEn: 'Performance',
    titleAr: 'الأداء',
    descriptionEn:
      'A short, stable measurement set read the same way every month, with an owner attached to each number and a written line of interpretation. A number without an explanation invites a debate; a number with one invites a decision.',
    descriptionAr:
      'مجموعة قياس قصيرة وثابتة تُقرأ بالطريقة نفسها كل شهر، بمسؤول لكل رقم وسطر تفسير مكتوب. فالرقم بلا تفسير يستدعي جدالاً، والرقم مع تفسير يستدعي قراراً.',
    services: ['KPI definition', 'Reporting', 'Performance analysis', 'Review cadence'],
  },
];

/* ------------------------------------------------------------------ pages */

/**
 * SEO for every editorial page, plus the section content the templates read.
 * `canonical` is left empty: the page templates already emit a canonical from
 * the site URL and the locale, and a hard-coded absolute one would break as
 * soon as the domain changes.
 */
export const PAGE_DEPTH = [
  {
    key: 'about',
    seoTitleEn: 'About Noriva — F&B Consulting, Development & Growth',
    seoTitleAr: 'عن نوريفا — استشارات وتطوير ونمو الأغذية والمشروبات',
    seoDescriptionEn:
      'Noriva is a Food & Beverage consulting and development partner working across strategy, brand, concept, menu, operations, marketing, finance and growth.',
    seoDescriptionAr:
      'نوريفا شريك متخصص في استشارات وتطوير مشاريع الأغذية والمشروبات، يعمل عبر الاستراتيجية والعلامة والمفهوم والقائمة والتشغيل والتسويق والمالية والنمو.',
  },
  {
    key: 'restaurant-growth',
    seoTitleEn: 'Restaurant Growth — Menu, Margin and Operations | Noriva',
    seoTitleAr: 'نمو المطاعم — القائمة والهامش والتشغيل | نوريفا',
    seoDescriptionEn:
      'How growth actually arrives in an F&B business: menu mix, pricing, food cost, channel economics, capacity and the sequence that protects cash.',
    seoDescriptionAr:
      'كيف يأتي النمو فعلاً في مشاريع الأغذية والمشروبات: مزيج القائمة والتسعير وتكلفة الطعام واقتصاديات القنوات والطاقة والتسلسل الذي يحمي النقد.',
  },
  {
    key: 'contact',
    seoTitleEn: 'Contact Noriva',
    seoTitleAr: 'تواصل مع نوريفا',
    seoDescriptionEn:
      'Tell us where the business is today and where you want it to be. We will come back with a point of view rather than a template.',
    seoDescriptionAr:
      'أخبرنا أين المشروع اليوم وأين تريده أن يكون، وسنعود إليك برأي واضح لا بقالب جاهز.',
  },
  {
    key: 'start-a-project',
    seoTitleEn: 'Start a Project with Noriva',
    seoTitleAr: 'ابدأ مشروعك مع نوريفا',
    seoDescriptionEn:
      'A short brief covering the business, the challenge and the outcome you are after, so our first response is specific rather than generic.',
    seoDescriptionAr:
      'موجز قصير يغطي المشروع والتحدي والنتيجة المطلوبة، ليكون ردنا الأول محدداً لا عاماً.',
  },
  {
    key: 'work',
    seoTitleEn: 'Selected Work — Noriva',
    seoTitleAr: 'أعمال مختارة — نوريفا',
    seoDescriptionEn:
      'Selected engagements across concept development, menu and pricing, customer experience, operations and growth in food and beverage.',
    seoDescriptionAr:
      'أعمال مختارة عبر تطوير المفاهيم والقائمة والتسعير وتجربة العميل والتشغيل والنمو في قطاع الأغذية والمشروبات.',
  },
  {
    key: 'services',
    seoTitleEn: 'F&B Consulting Services — Noriva',
    seoTitleAr: 'خدمات استشارات الأغذية والمشروبات — نوريفا',
    seoDescriptionEn:
      'Consulting, development, finance, menu, marketing, brand, experience and growth services for restaurants, cafés and food and beverage businesses.',
    seoDescriptionAr:
      'خدمات الاستشارات والتطوير والمالية والقائمة والتسويق والعلامة والتجربة والنمو للمطاعم والمقاهي ومشاريع الأغذية والمشروبات.',
  },
  {
    key: 'insights',
    seoTitleEn: 'Insights — Restaurant Strategy, Menu and Profitability | Noriva',
    seoTitleAr: 'رؤى — استراتيجية المطاعم والقائمة والربحية | نوريفا',
    seoDescriptionEn:
      'Writing on menu engineering, pricing, food cost, delivery economics, customer experience, operations and growth in food and beverage.',
    seoDescriptionAr:
      'كتابات في هندسة القوائم والتسعير وتكلفة الطعام واقتصاديات التوصيل وتجربة العميل والتشغيل والنمو في قطاع الأغذية والمشروبات.',
  },
  {
    key: 'library',
    seoTitleEn: 'Library — F&B Templates, Models and Guides | Noriva',
    seoTitleAr: 'المكتبة — قوالب ونماذج وأدلة للأغذية والمشروبات | نوريفا',
    seoDescriptionEn:
      'Working templates and models for menu engineering, pricing, food cost, budgeting, KPI reporting, purchasing, marketing and expansion.',
    seoDescriptionAr:
      'قوالب ونماذج عملية لهندسة القوائم والتسعير وتكلفة الطعام والموازنات وتقارير المؤشرات والشراء والتسويق والتوسع.',
  },
  {
    key: 'tools',
    seoTitleEn: 'Calculators — Food Cost, Pricing and Break-Even | Noriva',
    seoTitleAr: 'الحاسبات — تكلفة الطعام والتسعير ونقطة التعادل | نوريفا',
    seoDescriptionEn:
      'Interactive calculators for food cost, menu pricing, contribution margin, discounts, delivery pricing, break-even, prime cost and labour.',
    seoDescriptionAr:
      'حاسبات تفاعلية لتكلفة الطعام وتسعير القائمة وهامش المساهمة والخصومات وتسعير التوصيل ونقطة التعادل والتكلفة الأولية والعمالة.',
  },
  {
    key: 'start-here',
    seoTitleEn: 'Start Here — Noriva',
    seoTitleAr: 'ابدأ من هنا — نوريفا',
    seoDescriptionEn:
      'Not sure where to begin? Choose the route that matches where your business is today — services, work, calculators, library, insights or a project brief.',
    seoDescriptionAr:
      'لست متأكداً من أين تبدأ؟ اختر المسار الذي يناسب وضع مشروعك اليوم: الخدمات أو الأعمال أو الحاسبات أو المكتبة أو الرؤى أو موجز مشروع.',
  },
  {
    key: 'privacy',
    seoTitleEn: 'Privacy Policy — Noriva',
    seoTitleAr: 'سياسة الخصوصية — نوريفا',
    seoDescriptionEn: 'How Noriva collects, uses and stores the information you provide through this website.',
    seoDescriptionAr: 'كيف تجمع نوريفا المعلومات التي تقدمها عبر هذا الموقع وتستخدمها وتحفظها.',
  },
  {
    key: 'terms',
    seoTitleEn: 'Terms of Use — Noriva',
    seoTitleAr: 'شروط الاستخدام — نوريفا',
    seoDescriptionEn: 'The terms that apply to the use of this website and to any inquiry submitted through it.',
    seoDescriptionAr: 'الشروط التي تنطبق على استخدام هذا الموقع وعلى أي طلب يُرسل من خلاله.',
  },
  {
    key: 'menu-example',
    seoTitleEn: 'Menu Study — Worked Example | Noriva',
    seoTitleAr: 'دراسة قائمة — مثال محسوب | نوريفا',
    seoDescriptionEn: 'An illustrative worked example of how a menu study reads item performance and contribution.',
    seoDescriptionAr: 'مثال توضيحي محسوب لكيفية قراءة دراسة القائمة لأداء الأصناف ومساهمتها.',
    noindex: true,
  },
];

/**
 * Section content for the pages whose templates read `content` but which
 * shipped with an empty object. Written only where the page is otherwise a
 * heading and a paragraph.
 */
export const PAGE_CONTENT = [
  {
    key: 'services',
    content: {
      sections: [
        {
          key: 'how',
          titleEn: 'How the practices work together',
          titleAr: 'كيف تعمل الممارسات معاً',
          bodyEn:
            'The services are grouped rather than listed because they are rarely bought alone. A menu study changes what marketing should promote; an operational audit changes what the menu can carry; a growth plan is only as good as the cost base underneath it. Where an engagement would be stronger combined, we say so — and where a smaller scope is enough, we say that too.',
          bodyAr:
            'تُجمَّع الخدمات ولا تُسرد لأنها نادراً ما تُشترى منفردة. فدراسة القائمة تغيّر ما ينبغي للتسويق الترويج له، والتدقيق التشغيلي يغيّر ما تستطيع القائمة حمله، وخطة النمو لا تتجاوز جودة قاعدة التكلفة تحتها. وحين يكون العمل أقوى مجتمعاً نقول ذلك، وحين يكفي نطاق أصغر نقول ذلك أيضاً.',
        },
        {
          key: 'engagement',
          titleEn: 'How an engagement starts',
          titleAr: 'كيف يبدأ العمل',
          bodyEn:
            'Every service page carries its own short intake. It asks what the business is, what has already been tried and what the data looks like, so the first conversation starts from something specific rather than from a generic discovery call.',
          bodyAr:
            'تحمل كل صفحة خدمة استمارة قصيرة خاصة بها، تسأل عن طبيعة المشروع وما جُرِّب سابقاً وكيف تبدو البيانات، ليبدأ الحوار الأول من شيء محدد لا من مكالمة تعارف عامة.',
        },
      ],
    },
  },
  {
    key: 'work',
    content: {
      sections: [
        {
          key: 'note',
          titleEn: 'A note on what is shown here',
          titleAr: 'ملاحظة بشأن ما يُعرض هنا',
          bodyEn:
            'Client work is published only with permission and only with results we can evidence. Where an engagement is shown as an illustration of method rather than as client work, it is labelled as such in its own opening line. We do not present a conceptual project as a delivered one, and we do not publish a figure we cannot support.',
          bodyAr:
            'يُنشر عمل العملاء بإذن فقط ومع نتائج يمكننا إثباتها فقط. وحين يُعرض عمل كتوضيح للمنهجية لا كعمل لعميل، يُوسم بذلك في سطره الأول. ولا نقدّم مشروعاً تصورياً على أنه منفَّذ، ولا ننشر رقماً لا نستطيع دعمه.',
        },
      ],
    },
  },
  {
    key: 'insights',
    content: {
      sections: [
        {
          key: 'about',
          titleEn: 'What you will find here',
          titleAr: 'ما ستجده هنا',
          bodyEn:
            'Working notes rather than opinion pieces: how to read a menu commercially, what the gap between theoretical and actual food cost means, what delivery commission does to a margin, where service breaks at peak, and what to check before spending on marketing. Every article ends with something you can do.',
          bodyAr:
            'ملاحظات عمل لا مقالات رأي: كيف تُقرأ القائمة تجارياً، وماذا تعني الفجوة بين تكلفة الطعام النظرية والفعلية، وماذا تفعل عمولة التوصيل بالهامش، وأين تنهار الخدمة في الذروة، وما الذي يجب فحصه قبل الإنفاق على التسويق. وينتهي كل مقال بشيء يمكنك فعله.',
        },
      ],
    },
  },
  {
    key: 'library',
    content: {
      sections: [
        {
          key: 'files',
          titleEn: 'About these files',
          titleAr: 'عن هذه الملفات',
          bodyEn:
            'These are the working models and checklists we use in engagements, not marketing brochures. A resource appears here only once its file has been uploaded, so the library never offers a download that does not exist.',
          bodyAr:
            'هذه هي النماذج وقوائم التحقق التي نستخدمها في أعمالنا لا كتيبات تسويقية. ولا يظهر أي مورد هنا إلا بعد رفع ملفه، فلا تعرض المكتبة أبداً تحميلاً غير موجود.',
        },
      ],
    },
  },
  {
    key: 'tools',
    content: {
      sections: [
        {
          key: 'how',
          titleEn: 'How to read the results',
          titleAr: 'كيف تقرأ النتائج',
          bodyEn:
            'Each calculator runs entirely in your browser — nothing you enter is sent anywhere or stored. The default values exist only so the tool renders a worked example on first load; replace them with your own figures. Every result is arithmetic on what you entered, so it is exactly as good as the inputs.',
          bodyAr:
            'تعمل كل حاسبة داخل متصفحك بالكامل، ولا يُرسل ما تدخله إلى أي مكان ولا يُحفظ. والقيم الافتراضية موجودة فقط ليعرض النموذج مثالاً محسوباً عند أول فتح، فاستبدلها بأرقامك. وكل نتيجة عملية حسابية على ما أدخلته، فهي بجودة المدخلات تماماً.',
        },
      ],
    },
  },
  {
    key: 'contact',
    content: {
      sections: [
        {
          key: 'expect',
          titleEn: 'What to expect',
          titleAr: 'ما الذي تتوقعه',
          bodyEn:
            'Tell us what the business is, what is not working and what you have already tried. The more specific the message, the more specific the first reply — and if we think the problem is not one we should be paid to solve, we will say so.',
          bodyAr:
            'أخبرنا بطبيعة المشروع وما الذي لا يعمل وما جرّبته بالفعل. وكلما كانت الرسالة أدق كان الرد الأول أدق، وإن رأينا أن المشكلة ليست مما ينبغي أن نتقاضى أجراً لحلها فسنقول ذلك.',
        },
      ],
    },
  },
  {
    key: 'start-a-project',
    content: {
      sections: [
        {
          key: 'brief',
          titleEn: 'Before you start',
          titleAr: 'قبل أن تبدأ',
          bodyEn:
            'Nothing here is compulsory. Sales by item, current item costs and a recent profit and loss statement make a first response considerably more useful, but if none of that is available yet, say so — that is itself a useful piece of information.',
          bodyAr:
            'لا شيء هنا إلزامي. فالمبيعات حسب الصنف والتكاليف الحالية وقائمة أرباح وخسائر حديثة تجعل الرد الأول أنفع بكثير، وإن لم يتوفر شيء من ذلك بعد فقل ذلك، فهو بحد ذاته معلومة مفيدة.',
        },
      ],
    },
  },
];

/* -------------------------------------------------------------- taxonomies */

export const SERVICE_CATEGORY_DEPTH = [
  { slug: 'fnb-consulting-management', descriptionEn: 'An outside reading of the whole business — concept, menu, cost, service and control — written to be acted on.', descriptionAr: 'قراءة خارجية للمشروع كاملاً: المفهوم والقائمة والتكلفة والخدمة والضبط، مكتوبة لتُنفَّذ.' },
  { slug: 'fnb-development', descriptionEn: 'Everything decided before opening: concept, feasibility, menu, costing, standards and the launch sequence.', descriptionAr: 'كل ما يُحسم قبل الافتتاح: المفهوم ودراسة الجدوى والقائمة والتكلفة والمعايير وتسلسل الإطلاق.' },
  { slug: 'finance-profitability', descriptionEn: 'Contribution, cost base, budgets and the cash view that shows the tight month before it arrives.', descriptionAr: 'المساهمة وقاعدة التكلفة والموازنات والمنظور النقدي الذي يُظهر الشهر الضيق قبل وصوله.' },
  { slug: 'menu-product', descriptionEn: 'The menu read as a commercial document: structure, engineering, costing, pricing and the delivery list.', descriptionAr: 'القائمة تُقرأ كوثيقة تجارية: البنية والهندسة والتكلفة والتسعير وقائمة التوصيل.' },
  { slug: 'marketing-advertising', descriptionEn: 'Planning, campaigns and channels built on the menu, the margin and the capacity underneath them.', descriptionAr: 'تخطيط وحملات وقنوات مبنية على القائمة والهامش والطاقة تحتها.' },
  { slug: 'brand-customer-experience', descriptionEn: 'Positioning, identity and the journey a guest actually meets — in the room and in a delivery bag.', descriptionAr: 'التموضع والهوية والرحلة التي يعيشها الضيف فعلاً، في المكان وفي كيس التوصيل.' },
  { slug: 'growth-expansion', descriptionEn: 'Growth sequenced rather than attempted at once, and expansion tested for readiness before location.', descriptionAr: 'نمو مرتَّب لا منفَّذ دفعة واحدة، وتوسع يُختبر بالجاهزية قبل الموقع.' },
  { slug: 'marketing-social', descriptionEn: 'Always-on channel management: planning, production, publishing and community across the year.', descriptionAr: 'إدارة قنوات مستمرة: تخطيط وإنتاج ونشر وإدارة مجتمع على مدار السنة.' },
  { slug: 'advertising-performance', descriptionEn: 'Paid media bought to move orders, measured on contribution rather than on reach.', descriptionAr: 'إعلانات مدفوعة تُشترى لتحريك الطلبات وتُقاس بالمساهمة لا بالوصول.' },
  { slug: 'creative-branding', descriptionEn: 'The craft layer: identity, art direction, photography, film and the assets every campaign depends on.', descriptionAr: 'طبقة الحرفة: الهوية والإدارة الفنية والتصوير والفيديو والمواد التي تعتمد عليها كل حملة.' },
  { slug: 'restaurant-menu', descriptionEn: 'Menu development, engineering, recipe costing and pricing for restaurants and cafés.', descriptionAr: 'تطوير القوائم وهندستها وتكلفة الوصفات والتسعير للمطاعم والمقاهي.' },
  { slug: 'growth-profitability', descriptionEn: 'Consulting, cost control, profitability and the measurement that holds an improvement in place.', descriptionAr: 'الاستشارات وضبط التكاليف والربحية والقياس الذي يحفظ التحسن.' },
];

export const WORK_CATEGORY_DEPTH = [
  { slug: 'brand-identity', nameEn: 'Brand & Identity', nameAr: 'العلامة والهوية' },
  { slug: 'menu', nameEn: 'Menu & Product', nameAr: 'القائمة والمنتج' },
  { slug: 'restaurant-growth', nameEn: 'Growth & Development', nameAr: 'النمو والتطوير' },
  { slug: 'spatial', nameEn: 'Experience & Space', nameAr: 'التجربة والمكان' },
  { slug: 'campaign', nameEn: 'Campaigns', nameAr: 'الحملات' },
  { slug: 'digital', nameEn: 'Digital', nameAr: 'الرقمي' },
];

/* ------------------------------------------------------------- navigation */

/**
 * Ordering only. No item is added, removed or repointed, because every public
 * route is already represented and the site has no /case-studies or
 * /noriva-system route to link to — case studies render inside a project page
 * and the system renders on the homepage. Adding those links would create
 * dead ends.
 *
 * The duplicate `order` values the seeds produced (two items at 5, two at 6,
 * two at 7) made the menu order non-deterministic; these give each item a
 * distinct position.
 */
export const NAV_ORDER = {
  header: [
    ['/start-here', 0],
    ['/services', 1],
    ['/work', 2],
    ['/restaurant-growth', 3],
    ['/insights', 4],
    ['/library', 5],
    ['/tools', 6],
    ['/about', 7],
    ['/contact', 8],
  ],
  footer: [
    ['/services', 1],
    ['/work', 2],
    ['/restaurant-growth', 3],
    ['/insights', 4],
    ['/library', 5],
    ['/tools', 6],
    ['/about', 7],
    ['/contact', 8],
    ['/privacy', 9],
    ['/terms', 10],
  ],
};

/* ------------------------------------------------------------- statistics */

/**
 * Descriptive, not promotional. Each of these counts something that can be
 * checked against this database, so none of them is an unsupported claim.
 * They are still created hidden — an owner publishes them from Admin once the
 * catalogue is final.
 */
export const STATISTICS = [
  {
    value: '10',
    labelEn: 'Disciplines in the Noriva System',
    labelAr: 'تخصصاً في نظام نوريفا',
    descriptionEn: 'Strategy, brand, concept, customer experience, menu, operations, marketing, finance, growth and performance.',
    descriptionAr: 'الاستراتيجية والعلامة والمفهوم وتجربة العميل والقائمة والتشغيل والتسويق والمالية والنمو والأداء.',
    order: 1,
  },
  {
    value: '7',
    labelEn: 'Practice groups',
    labelAr: 'مجموعات ممارسة',
    descriptionEn: 'Consulting and management, development, finance and profitability, menu and product, marketing, brand and experience, growth and expansion.',
    descriptionAr: 'الاستشارات والإدارة، والتطوير، والمالية والربحية، والقائمة والمنتج، والتسويق، والعلامة والتجربة، والنمو والتوسع.',
    order: 2,
  },
  {
    value: '2',
    labelEn: 'Languages, written natively',
    labelAr: 'لغتان مكتوبتان أصلاً',
    descriptionEn: 'Every service page, article and resource is written in Arabic and English rather than translated from one into the other.',
    descriptionAr: 'كل صفحة خدمة ومقال ومورد مكتوب بالعربية والإنجليزية لا مترجماً من إحداهما إلى الأخرى.',
    order: 3,
  },
];

/* ----------------------------------------------------------- testimonials */

/**
 * Placeholders only. No words are attributed to any real person or business.
 * Both records are created unpublished and are named so that publishing one by
 * accident is impossible to miss.
 */
export const SAMPLE_TESTIMONIALS = [
  {
    name: 'Sample testimonial — replace before publishing',
    company: 'Not a real client',
    role: 'Placeholder record',
    quoteEn:
      'Placeholder text. Replace this entire record with a quote a real client has given and approved in writing, then publish it. Noriva does not publish testimonials it cannot attribute.',
    quoteAr:
      'نص مبدئي. استبدل هذا السجل بالكامل باقتباس قدّمه عميل حقيقي ووافق عليه كتابياً، ثم انشره. لا تنشر نوريفا شهادات لا يمكن نسبتها.',
  },
  {
    name: 'Sample testimonial 2 — replace before publishing',
    company: 'Not a real client',
    role: 'Placeholder record',
    quoteEn:
      'Placeholder text. This second record exists only so the testimonials section can be previewed with more than one card. Delete it or replace it with a real, approved quote.',
    quoteAr:
      'نص مبدئي. وُجد هذا السجل الثاني فقط لتتمكن من معاينة قسم الشهادات ببطاقة أكثر من واحدة. احذفه أو استبدله باقتباس حقيقي معتمد.',
  },
];

/* --------------------------------------------------------- taxonomy tidy */

/**
 * Studio-era taxonomy terms that are unused and duplicated by a term the F&B
 * catalogue already uses. They are hidden rather than deleted, so nothing an
 * editor may still want is destroyed and any future re-use is one toggle away.
 *
 * Work categories matter most here: the Work page builds its filter chips from
 * every visible work category, so an empty one renders a chip that returns no
 * results.
 *
 * Each entry names the term that replaces it, so the decision is auditable.
 */
export const REDUNDANT_TAXONOMY = {
  workCategory: [
    ['social', 'campaign'],
    ['advertising', 'campaign'],
    ['branding', 'brand-identity'],
    ['creative', 'brand-identity'],
  ],
  insightCategory: [
    ['advertising', 'marketing-advertising'],
    ['restaurant-marketing', 'marketing-advertising'],
    ['profitability', 'finance-profitability'],
    ['restaurant-growth', 'expansion-growth'],
    ['social-media', 'marketing-advertising'],
    ['creative', 'branding'],
    ['menu-engineering', 'menu-pricing'],
    ['food-cost', 'finance-profitability'],
  ],
};

/** SEO for the placeholder engagements that shipped before this pass. */
export const LEGACY_SAMPLE_PROJECT_SEO = [
  ['sample-hospitality-identity', 'Hospitality Identity System', 'نظام هوية لمشروع ضيافة'],
  ['sample-editorial-platform', 'Editorial Content Platform', 'منصة محتوى تحريري'],
  ['sample-launch-campaign', 'Opening Campaign', 'حملة افتتاح'],
  ['sample-retail-experience', 'Retail Experience Design', 'تصميم تجربة التجزئة'],
  ['sample-brand-refresh', 'Brand Refresh', 'تحديث علامة'],
  ['sample-booking-experience', 'Booking Experience', 'تجربة الحجز'],
];
