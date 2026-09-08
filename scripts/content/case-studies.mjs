/**
 * Illustrative engagements and their case studies.
 *
 * IMPORTANT — these are NOT client work.
 *
 * They exist so the Work and Case Studies modules are populated in Admin, so
 * an editor can see the shape of a finished record, and so the public
 * templates can be reviewed with realistic content. Every one of them:
 *
 *   - carries the client value "Illustrative project", which is visibly shown
 *     on the public work card and cannot be mistaken for a client name;
 *   - is published only as an educational example, never as client work;
 *   - states in its own opening line that it is an illustrative engagement;
 *   - contains no client name, no revenue figure, no percentage, no ROI and
 *     no quoted testimonial.
 *
 * Outcomes are qualitative only — what became clearer, what became decidable —
 * because no verified metric exists for work that is illustrative.
 *
 * The `metrics` field is deliberately left empty on every record.
 */

/** Public label: explicit enough to prevent the example being read as client work. */
export const SAMPLE_CLIENT = 'Illustrative project';

const disclaimerEn =
  'This is an illustrative engagement written to show how Noriva works. It is not client work, and it contains no client name, figure or verified result.';
const disclaimerAr =
  'هذا نموذج توضيحي لطريقة عمل نوريفا. ليس عملاً لعميل، ولا يتضمن اسم عميل أو رقماً أو نتيجة موثقة.';

export const FNB_SAMPLE_PROJECTS = [
  {
    slug: 'sample-menu-restructure',
    titleEn: 'Menu Restructure for a Casual Dining Concept',
    titleAr: 'إعادة بناء قائمة لمفهوم مطعم غير رسمي',
    categorySlug: 'menu',
    year: 2025,
    location: 'Riyadh',
    serviceSlugs: ['menu-strategy-engineering-pricing', 'menu-engineering', 'menu-pricing'],
    descriptionEn: `${disclaimerEn}\n\nA menu that had grown by addition for four years, read as a commercial document for the first time: item performance against contribution, category structure, price bands and the difference between the dine-in and delivery lists.`,
    descriptionAr: `${disclaimerAr}\n\nقائمة نمت بالإضافة أربع سنوات، تُقرأ لأول مرة كوثيقة تجارية: أداء الأصناف مقابل المساهمة، وبنية التصنيفات، والنطاقات السعرية، والفرق بين قائمتي الصالة والتوصيل.`,
    order: 10,
  },
  {
    slug: 'sample-cafe-concept-development',
    titleEn: 'Café Concept Development',
    titleAr: 'تطوير مفهوم مقهى',
    categorySlug: 'restaurant-growth',
    year: 2025,
    location: 'Jeddah',
    serviceSlugs: ['concept-development', 'new-cafe-project', 'brand-identity-fnb'],
    descriptionEn: `${disclaimerEn}\n\nA specialty café defined before it was designed: audience and occasion, beverage programme and specification, the food offer that sits beside it, and the throughput the counter has to hold at peak.`,
    descriptionAr: `${disclaimerAr}\n\nمقهى مختص عُرِّف قبل أن يُصمَّم: الجمهور والمناسبة، وبرنامج المشروبات ومواصفاته، وعرض الطعام المجاور له، والطاقة التي على الكاونتر تحملها في الذروة.`,
    order: 11,
  },
  {
    slug: 'sample-delivery-channel-rebuild',
    titleEn: 'Delivery Channel Rebuild',
    titleAr: 'إعادة بناء قناة التوصيل',
    categorySlug: 'restaurant-growth',
    year: 2024,
    location: 'Riyadh',
    serviceSlugs: ['delivery-menu-pricing', 'profitability-analysis'],
    descriptionEn: `${disclaimerEn}\n\nDelivery treated as its own business rather than as the dining room at a distance: contribution recalculated after commission and packaging, the list shortened, and the aggregator presentation rebuilt around how it is actually browsed.`,
    descriptionAr: `${disclaimerAr}\n\nالتوصيل يُعامل كنشاط قائم بذاته لا كصالة عن بُعد: إعادة حساب المساهمة بعد العمولة والتغليف، وتقصير القائمة، وإعادة بناء العرض على تطبيقات التجميع وفق طريقة تصفحها الفعلية.`,
    order: 12,
  },
  {
    slug: 'sample-restaurant-opening-programme',
    titleEn: 'Restaurant Opening Programme',
    titleAr: 'برنامج افتتاح مطعم',
    categorySlug: 'restaurant-growth',
    year: 2024,
    location: 'Dammam',
    serviceSlugs: ['new-restaurant-project', 'feasibility-study', 'financial-planning'],
    descriptionEn: `${disclaimerEn}\n\nA pre-opening sequence run in order: concept, menu, costing, pricing, then equipment and suppliers — with standards written before the first hire and a soft opening designed as a test rather than a preview.`,
    descriptionAr: `${disclaimerAr}\n\nتسلسل ما قبل الافتتاح منفَّذ بالترتيب: المفهوم ثم القائمة ثم التكلفة ثم التسعير ثم المعدات والموردون، مع كتابة المعايير قبل أول تعيين وافتتاح تجريبي مصمم كاختبار لا كمعاينة.`,
    order: 13,
  },
  {
    slug: 'sample-guest-experience-programme',
    titleEn: 'Guest Experience Programme',
    titleAr: 'برنامج تجربة الضيف',
    categorySlug: 'spatial',
    year: 2024,
    location: 'Riyadh',
    serviceSlugs: ['customer-experience', 'spatial-experience', 'operational-audit'],
    descriptionEn: `${disclaimerEn}\n\nThe journey mapped as a guest experiences it — arrival, seating, ordering, pace, payment and the delivery unboxing — with friction ranked by how many guests meet it rather than by how it feels.`,
    descriptionAr: `${disclaimerAr}\n\nرسم الرحلة كما يعيشها الضيف: الوصول والجلوس والطلب والإيقاع والدفع وفتح طلب التوصيل، مع ترتيب الاحتكاك حسب عدد من يمر به لا حسب شعوره.`,
    order: 14,
  },
  {
    slug: 'sample-multi-branch-readiness',
    titleEn: 'Multi-Branch Readiness Programme',
    titleAr: 'برنامج الجاهزية لتعدد الفروع',
    categorySlug: 'restaurant-growth',
    year: 2023,
    location: 'Riyadh',
    serviceSlugs: ['branch-development', 'expansion-study', 'performance-improvement'],
    descriptionEn: `${disclaimerEn}\n\nA single working site documented well enough to be repeated: recipes and specifications written down, training built to transfer without the founder, and a fixed-versus-flexible register agreed before a second lease was considered.`,
    descriptionAr: `${disclaimerAr}\n\nفرع واحد ناجح يُوثَّق بما يكفي لتكراره: كتابة الوصفات والمواصفات، وبناء تدريب ينتقل دون المؤسس، والاتفاق على سجل الثابت مقابل المرن قبل التفكير في عقد إيجار ثانٍ.`,
    order: 15,
  },
];

/**
 * Case studies. `projectSlug` links to a project above. Every record carries
 * an explicit illustrative label and no metric.
 */
export const CASE_STUDIES = [
  {
    slug: 'menu-restructure-case-study',
    projectSlug: 'sample-menu-restructure',
    serviceSlugs: ['menu-strategy-engineering-pricing', 'menu-engineering', 'menu-pricing'],
    titleEn: 'Reading a four-year-old menu as a commercial document',
    titleAr: 'قراءة قائمة عمرها أربع سنوات كوثيقة تجارية',
    challengeEn: `${disclaimerEn}\n\nThe list had grown by addition for four years. Nothing had been removed, several items existed only because a former chef had introduced them, and the kitchen was carrying sole-use ingredients for dishes that sold in single figures each week. Management could describe which items were popular but not which items paid.`,
    challengeAr: `${disclaimerAr}\n\nنمت القائمة بالإضافة أربع سنوات. لم يُحذف شيء، ووُجدت عدة أصناف لمجرد أن طاهياً سابقاً أدخلها، وكان المطبخ يحمل مكونات وحيدة الاستخدام لأطباق تُباع بأعداد أحادية أسبوعياً. وكانت الإدارة تستطيع وصف الأصناف الرائجة لا الأصناف الرابحة.`,
    ideaEn:
      'Read the menu on two axes at once — how often an item is ordered and what it contributes after food cost — and let the four resulting groups carry different instructions rather than applying one policy to the whole list.',
    ideaAr:
      'قراءة القائمة على محورين معاً — كم مرة يُطلب الصنف وكم يساهم بعد تكلفة الطعام — وترك المجموعات الأربع الناتجة تحمل تعليمات مختلفة بدل تطبيق سياسة واحدة على القائمة كلها.',
    strategyEn:
      'A full trading period of sales by item was paired with a current cost per item. Every item was placed by popularity and by contribution, and the work was sequenced so that the high-volume, low-contribution group — where the same effort returns the most — was addressed first. Category structure and price bands were reviewed after the item-level decisions, not before them.',
    strategyAr:
      'قُرنت فترة تشغيل كاملة من المبيعات حسب الصنف بتكلفة حالية لكل صنف. ووُضع كل صنف حسب الإقبال والمساهمة، ورُتِّب العمل بحيث تُعالج أولاً مجموعة الحجم المرتفع والمساهمة المنخفضة، حيث يعود الجهد نفسه بأكبر قدر. وروجعت بنية التصنيفات والنطاقات السعرية بعد قرارات الأصناف لا قبلها.',
    creativeEn:
      'The menu was then rebuilt as a reading object: categories renamed for findability rather than for cleverness, descriptions shortened so the first three words say what the dish is, the price column removed so the price follows the description, and the whole document proofed in the room at the hour guests arrive.',
    creativeAr:
      'ثم أُعيد بناء القائمة كجسم يُقرأ: أُعيدت تسمية التصنيفات لسهولة العثور لا للذكاء، وقُصِّرت الأوصاف بحيث تقول الكلمات الثلاث الأولى ما هو الطبق، وحُذف عمود الأسعار ليتبع السعر الوصف، وجُرِّبت الوثيقة كاملة في المكان في ساعة وصول الضيوف.',
    campaignEn:
      'Changes were staged rather than launched. The least-watched items moved first, the middle of the menu followed, and the anchor items — the dishes a regular would notice on the bill — were left until last. A re-measurement date was set at the same time as the change, so the decision could be judged rather than assumed.',
    campaignAr:
      'نُفِّذت التغييرات على مراحل لا كإطلاق واحد. تحركت الأصناف الأقل مراقبة أولاً، ثم وسط القائمة، وتُركت الأصناف المرجعية — التي يلاحظها الزبون الدائم في الفاتورة — إلى الأخير. وحُدد تاريخ إعادة القياس مع التغيير نفسه ليُحكم على القرار بدل افتراضه.',
    outcomeEn:
      'Qualitative outcomes only, as no verified metric exists for an illustrative engagement: a shorter list the kitchen can execute consistently at peak; a written keep, rework, reprice or retire decision for every item with the reason recorded; sole-use ingredients identified and reduced; a delivery list that is no longer a copy of the dine-in one; and a re-measurement routine that lets the next menu decision start from evidence.',
    outcomeAr:
      'نتائج نوعية فقط، إذ لا توجد مقاييس موثقة لنموذج توضيحي: قائمة أقصر يستطيع المطبخ تنفيذها باتساق في الذروة؛ وقرار مكتوب لكل صنف بالإبقاء أو التطوير أو إعادة التسعير أو السحب مع تسجيل السبب؛ وتحديد المكونات وحيدة الاستخدام وتقليلها؛ وقائمة توصيل لم تعد نسخة من قائمة الصالة؛ وروتين إعادة قياس يتيح لقرار القائمة التالي أن يبدأ من الأدلة.',
    resultEn:
      'The lasting change is the routine rather than the document: the menu is now re-read against sales and cost on a fixed cycle instead of being revisited when something goes wrong.',
    resultAr:
      'التغيير الباقي هو الروتين لا الوثيقة: صارت القائمة تُقرأ مقابل المبيعات والتكلفة في دورة ثابتة بدل مراجعتها حين يسوء شيء.',
  },
  {
    slug: 'cafe-concept-case-study',
    projectSlug: 'sample-cafe-concept-development',
    serviceSlugs: ['concept-development', 'new-cafe-project', 'brand-identity-fnb'],
    titleEn: 'Defining a café before designing it',
    titleAr: 'تعريف مقهى قبل تصميمه',
    challengeEn: `${disclaimerEn}\n\nThe brief arrived as a cuisine, a location and an adjective — specialty coffee, a corner unit, premium. That is a description rather than a proposition, and it left the designer, the beverage lead and the marketer each filling the gap with a different interpretation.`,
    challengeAr: `${disclaimerAr}\n\nوصل الموجز كمطبخ وموقع وصفة: قهوة مختصة، ووحدة زاوية، وراقٍ. وهذا وصف لا قيمة مقترحة، فترك المصمم ومسؤول المشروبات والمسوّق يملأ كل منهم الفراغ بتفسير مختلف.`,
    ideaEn:
      'Write the concept as one sentence containing a person, an occasion and a reason to choose it — a sentence specific enough that some potential guests would read it and decide it is not for them.',
    ideaAr:
      'كتابة المفهوم في جملة واحدة تتضمن شخصاً ومناسبة وسبباً للاختيار، جملة محددة بما يكفي ليقرأها بعض الضيوف المحتملين فيقرروا أنها ليست لهم.',
    strategyEn:
      'Audience and occasion were separated from demographics. The three venues a guest would realistically choose instead were named, in the actual catchment, and the position was written against those rather than against an abstraction. The beverage programme was then treated as the decision that everything else follows: equipment, counter layout, staffing at peak, training depth and the food offer that has to sit beside it without slowing the bar.',
    strategyAr:
      'فُصل الجمهور والمناسبة عن الشرائح السكانية. وسُمِّيت المطاعم الثلاثة التي قد يختارها الضيف واقعياً بدلاً منه في النطاق الفعلي، وكُتب التموضع مقابلها لا مقابل تجريد. ثم عومل برنامج المشروبات كالقرار الذي يتبعه كل ما عداه: المعدات وتخطيط الكاونتر والتوظيف في الذروة وعمق التدريب وعرض الطعام الذي عليه أن يجاوره دون إبطاء البار.',
    creativeEn:
      'Identity followed the definition rather than preceding it: marque, Arabic and Latin type set as one system, and applications tested where they are actually experienced — the cup, the counter, the signage and the delivery bag — before anything was signed off.',
    creativeAr:
      'تبعت الهوية التعريف ولم تسبقه: العلامة، والخط العربي واللاتيني كنظام واحد، وتطبيقات اختُبرت حيث تُعاش فعلاً — الكوب والكاونتر واللافتات وكيس التوصيل — قبل اعتماد أي شيء.',
    campaignEn:
      'Specification was written before equipment was chosen, and training was designed to defend that specification rather than to introduce it. Throughput was planned against the peak hour rather than the daily average, because a café is judged on whether the third visit tastes like the first.',
    campaignAr:
      'كُتبت المواصفات قبل اختيار المعدات، وصُمِّم التدريب للدفاع عنها لا للتعريف بها. وخُططت الطاقة الاستيعابية مقابل ساعة الذروة لا المتوسط اليومي، لأن المقهى يُحكم عليه بما إذا كانت الزيارة الثالثة تشبه الأولى.',
    outcomeEn:
      'Qualitative outcomes only: a definition specific enough for a designer, a beverage lead and a marketer to work from without three interpretations; a specification written before equipment was committed; a food offer sized to the bar it sits beside; and a training programme built around holding the specification rather than around individual talent.',
    outcomeAr:
      'نتائج نوعية فقط: تعريف محدد بما يكفي ليعمل منه المصمم ومسؤول المشروبات والمسوّق دون ثلاثة تفسيرات؛ ومواصفات كُتبت قبل الالتزام بالمعدات؛ وعرض طعام بحجم البار الذي يجاوره؛ وبرنامج تدريب مبني على حفظ المواصفات لا على المواهب الفردية.',
    resultEn:
      'The concept became arguable, which is the point of defining one. Decisions downstream could be tested against it instead of being settled by preference.',
    resultAr:
      'صار المفهوم قابلاً للنقاش، وهذا هو الغرض من تعريفه. وأمكن اختبار القرارات اللاحقة مقابله بدل حسمها بالتفضيل.',
  },
  {
    slug: 'delivery-rebuild-case-study',
    projectSlug: 'sample-delivery-channel-rebuild',
    serviceSlugs: ['delivery-menu-pricing', 'profitability-analysis'],
    titleEn: 'Rebuilding a delivery channel from the margin backwards',
    titleAr: 'إعادة بناء قناة التوصيل انطلاقاً من الهامش',
    challengeEn: `${disclaimerEn}\n\nThe full dine-in menu was listed on two platforms at dine-in prices. Volume was substantial and rising, and it was being read as a success because nobody had recalculated contribution after commission and packaging. Several items travelled badly enough that the reviews mentioning them were about food that had left the kitchen correctly.`,
    challengeAr: `${disclaimerAr}\n\nكانت قائمة الصالة كاملة مدرجة على منصتين بأسعار الصالة. وكان الحجم كبيراً ومتصاعداً ويُقرأ كنجاح لأن أحداً لم يعد حساب المساهمة بعد العمولة والتغليف. وكانت عدة أصناف لا تحتمل النقل بدرجة جعلت التقييمات التي تذكرها تتحدث عن طعام غادر المطبخ سليماً.`,
    ideaEn:
      'Stop treating delivery as the dining room at a distance. Rebuild it as its own business with its own list, its own prices and its own margin calculation.',
    ideaAr:
      'التوقف عن معاملة التوصيل كصالة عن بُعد، وإعادة بنائه كنشاط قائم بذاته بقائمته وأسعاره وحساب هامشه.',
    strategyEn:
      'Item costs, commission rates and packaging costs were brought together and contribution was recalculated per item and per platform. The first output was a shorter list rather than a cheaper one: anything negative after that calculation was delisted, as was anything that arrived materially worse than it left. Only then were prices set, deliberately and consistently, so that the difference from the dining room is stated rather than erratic.',
    strategyAr:
      'جُمعت تكاليف الأصناف ونسب العمولة وتكاليف التغليف وأُعيد حساب المساهمة لكل صنف ولكل منصة. وكان المخرج الأول قائمة أقصر لا أرخص: سُحب كل ما صار سالباً بعد ذلك الحساب، وكذلك كل ما يصل أسوأ بشكل ملموس مما غادر. وبعد ذلك فقط حُددت الأسعار بقصد وباتساق ليكون الفارق عن الصالة معلناً لا متقلباً.',
    creativeEn:
      'The aggregator listing was rebuilt as a shopfront rather than inherited as a menu: the items the business wants to sell were photographed properly, categories were named for how the app is browsed, and item order was set deliberately instead of alphabetically.',
    creativeAr:
      'أُعيد بناء القائمة على تطبيقات التجميع كواجهة متجر لا كقائمة موروثة: صُوِّرت الأصناف التي يريد المشروع بيعها كما ينبغي، وسُمِّيت التصنيفات وفق طريقة تصفح التطبيق، ورُتِّبت الأصناف بقصد لا أبجدياً.',
    campaignEn:
      'Bundles and a minimum-order threshold were introduced to move average order value, which spreads the fixed elements of the cost across more contribution. A rule was written for when the whole calculation is re-run: at any material change in commission terms.',
    campaignAr:
      'أُدخلت وجبات مركبة وحد أدنى للطلب لتحريك متوسط قيمة الطلب، ما يوزّع العناصر الثابتة من التكلفة على مساهمة أكبر. وكُتبت قاعدة لموعد إعادة الحساب كاملاً: عند أي تغيير جوهري في شروط العمولة.',
    outcomeEn:
      'Qualitative outcomes only: a delivery list curated rather than inherited; items that lost money on every order identified before they scaled further; a stated and consistent price relationship between the two channels; and a written trigger for re-running the calculation when commission terms move.',
    outcomeAr:
      'نتائج نوعية فقط: قائمة توصيل مُنتقاة لا موروثة؛ وتحديد الأصناف الخاسرة في كل طلب قبل توسعها أكثر؛ وعلاقة سعرية معلنة ومتسقة بين القناتين؛ ومحفّز مكتوب لإعادة الحساب عند تغير شروط العمولة.',
    resultEn:
      'Delivery stopped being a volume story and became a margin one, which is the only version of the channel that can be managed.',
    resultAr:
      'توقف التوصيل عن كونه قصة حجم وصار قصة هامش، وهي النسخة الوحيدة من القناة التي يمكن إدارتها.',
  },
  {
    slug: 'opening-programme-case-study',
    projectSlug: 'sample-restaurant-opening-programme',
    serviceSlugs: ['new-restaurant-project', 'feasibility-study', 'financial-planning'],
    titleEn: 'A pre-opening sequence run in the right order',
    titleAr: 'تسلسل ما قبل الافتتاح منفَّذ بالترتيب الصحيح',
    challengeEn: `${disclaimerEn}\n\nThe site was signed, a kitchen layout had been drawn, and equipment quotes were being compared — all before the menu existed as more than a list of intentions. Every subsequent menu decision would have had to apologise to a kitchen designed without it.`,
    challengeAr: `${disclaimerAr}\n\nكان الموقع موقَّعاً، وتخطيط المطبخ مرسوماً، وعروض المعدات تُقارن، وكل ذلك قبل وجود القائمة كأكثر من قائمة نوايا. وكان كل قرار قائمة لاحق سيضطر للاعتذار لمطبخ صُمم بدونها.`,
    ideaEn:
      'Stop the equipment decision and re-run the sequence: concept, menu, costing, pricing, then equipment and suppliers. Order matters more than speed, because pre-opening is when decisions are cheapest to change and most expensive to inherit.',
    ideaAr:
      'إيقاف قرار المعدات وإعادة تشغيل التسلسل: المفهوم ثم القائمة ثم التكلفة ثم التسعير ثم المعدات والموردون. فالترتيب أهم من السرعة، لأن ما قبل الافتتاح هو أرخص وقت لتغيير القرارات وأغلى وقت لتوريثها.',
    strategyEn:
      'The concept was written as one defensible sentence and tested against the three alternatives in the catchment. The menu was written from that concept rather than from a repertoire, then costed item by item before any price was set. Pricing was modelled against both the cost base and the revenue the site needs to work, with a feasibility model carrying three cases and a stated assumptions register.',
    strategyAr:
      'كُتب المفهوم في جملة واحدة قابلة للدفاع واختُبر مقابل البدائل الثلاثة في النطاق. وكُتبت القائمة من ذلك المفهوم لا من ذخيرة طهي، ثم حُسبت تكلفتها صنفاً صنفاً قبل تحديد أي سعر. ونُمذج التسعير مقابل قاعدة التكلفة والإيراد الذي يحتاجه الموقع، مع نموذج جدوى بثلاث حالات وسجل افتراضات معلن.',
    creativeEn:
      'Equipment and layout were then derived from the finished menu, and suppliers were selected against written specifications rather than on whoever was available during fit-out.',
    creativeAr:
      'ثم اشتُقت المعدات والتخطيط من القائمة المكتملة، واختير الموردون مقابل مواصفات مكتوبة لا حسب من كان متاحاً أثناء التجهيز.',
    campaignEn:
      'Standards were written before the first hire, so new team members learned a documented standard rather than establishing one. The soft opening was designed as a test with deliberately limited covers, a shortened menu and one person whose only job was to record failures rather than help fix them.',
    campaignAr:
      'كُتبت المعايير قبل أول تعيين، فتعلّم الموظفون الجدد معياراً موثقاً بدل أن يرسوا واحداً. وصُمِّم الافتتاح التجريبي كاختبار بعدد طلبات محدود عمداً وقائمة مختصرة وشخص وظيفته الوحيدة تسجيل الإخفاقات لا المساعدة في إصلاحها.',
    outcomeEn:
      'Qualitative outcomes only: a menu costed before equipment was committed; a pricing model tied to the revenue the site actually needs; a cash curve built monthly including the pre-opening period and its lowest point; standards written before hiring; and a soft opening that produced information rather than only revenue.',
    outcomeAr:
      'نتائج نوعية فقط: قائمة حُسبت تكلفتها قبل الالتزام بالمعدات؛ ونموذج تسعير مرتبط بالإيراد الذي يحتاجه الموقع فعلاً؛ ومنحنى نقد شهري يشمل فترة ما قبل الافتتاح وأدنى نقطة فيه؛ ومعايير كُتبت قبل التوظيف؛ وافتتاح تجريبي أنتج معلومة لا إيراداً فقط.',
    resultEn:
      'The opening day was a rehearsal of a decided system rather than the first attempt at inventing one.',
    resultAr:
      'صار يوم الافتتاح بروفة لنظام محسوم لا أول محاولة لابتكاره.',
  },
  {
    slug: 'guest-experience-case-study',
    projectSlug: 'sample-guest-experience-programme',
    serviceSlugs: ['customer-experience', 'spatial-experience', 'operational-audit'],
    titleEn: 'Finding the friction nobody complains about',
    titleAr: 'العثور على الاحتكاك الذي لا يشتكي منه أحد',
    challengeEn: `${disclaimerEn}\n\nReviews were positive about the food and the repeat rate was weaker than the food deserved. That combination almost always points away from the kitchen: guests were not leaving unhappy, they were simply not being given a reason to return, and several small frictions along the journey had never risen to the level of a complaint.`,
    challengeAr: `${disclaimerAr}\n\nكانت التقييمات إيجابية عن الطعام ومعدل التكرار أضعف مما يستحقه الطعام. وهذه التركيبة تشير دائماً تقريباً بعيداً عن المطبخ: لم يكن الضيوف يغادرون غير راضين، بل لم يكن يُعطى لهم سبب للعودة، ولم ترقَ عدة احتكاكات صغيرة على امتداد الرحلة إلى مستوى الشكوى.`,
    ideaEn:
      'Walk the journey as a guest, unannounced, at the hours guests actually come — and record every point where effort is required of them, before judging any of it.',
    ideaAr:
      'خوض الرحلة كضيف دون إعلان في الساعات التي يأتي فيها الضيوف فعلاً، وتسجيل كل نقطة يُطلب فيها منهم جهد قبل الحكم على أي منها.',
    strategyEn:
      'Both channels were mapped: discovery and what the listing promised, arrival and whether it is obvious where to go, the ordering moment and how long until it is possible, service pace, payment, departure, and — for delivery — packaging, temperature, completeness and the unboxing. Friction was then ranked by how many guests meet it rather than by how bad it feels, which reorders the list considerably.',
    strategyAr:
      'رُسمت القناتان: الاكتشاف وما وعدت به القائمة المعروضة، والوصول وهل من الواضح أين يذهب، ولحظة الطلب وكم تستغرق حتى تصبح ممكنة، وإيقاع الخدمة، والدفع، والمغادرة، وللتوصيل: التغليف والحرارة والاكتمال ولحظة الفتح. ثم رُتِّب الاحتكاك حسب عدد الضيوف الذين يمرون به لا حسب مدى سوء شعوره، وهو ما يعيد ترتيب القائمة كثيراً.',
    creativeEn:
      'The end of the meal was addressed first, because payment and departure are remembered out of proportion to their length. Signage and menu legibility were tested in the venue’s own light rather than on a screen, and the delivery presentation was reviewed as the entire experience it is for that channel.',
    creativeAr:
      'عولجت نهاية الوجبة أولاً لأن الدفع والمغادرة يُذكران بما لا يتناسب مع مدتهما. واختُبرت اللافتات ووضوح القائمة في إضاءة المكان نفسه لا على الشاشة، وروجعت طريقة تقديم التوصيل بوصفها التجربة كاملة لتلك القناة.',
    campaignEn:
      'Each change was written as a standard attached to a specific moment and a specific role, rather than as a general aspiration. The floor team was given one concrete thing to do that creates a reason to return, and a check that it actually happens.',
    campaignAr:
      'كُتب كل تغيير كمعيار مرتبط بلحظة محددة ودور محدد لا كطموح عام. وأُعطي فريق الصالة شيئاً ملموساً واحداً يفعله ليخلق سبباً للعودة، مع فحص لحدوثه فعلاً.',
    outcomeEn:
      'Qualitative outcomes only: a documented journey map for both channels; friction ranked by frequency rather than by severity of feeling; standards written for the shift that has to run them; a feedback mechanism that reaches the guest while they can still be helped; and a delivery experience reviewed rather than assumed.',
    outcomeAr:
      'نتائج نوعية فقط: خريطة رحلة موثقة للقناتين؛ واحتكاك مرتب حسب التكرار لا حسب حدة الشعور؛ ومعايير مكتوبة للوردية التي عليها تنفيذها؛ وآلية ملاحظات تصل الضيف بينما يمكن مساعدته؛ وتجربة توصيل روجعت ولم تُفترض.',
    resultEn:
      'The second visit stopped being treated as a marketing outcome and started being managed as an operational one.',
    resultAr:
      'توقف التعامل مع الزيارة الثانية كنتيجة تسويقية وبدأت إدارتها كنتيجة تشغيلية.',
  },
  {
    slug: 'multi-branch-readiness-case-study',
    projectSlug: 'sample-multi-branch-readiness',
    serviceSlugs: ['branch-development', 'expansion-study', 'performance-improvement'],
    titleEn: 'Writing down what one person knew',
    titleAr: 'كتابة ما يعرفه شخص واحد',
    challengeEn: `${disclaimerEn}\n\nA single site was performing well and a second lease was under discussion. The readiness question was never asked, and the honest answer to it was no: recipes were partial, purchasing lived in one person's relationships, training was delivered by demonstration, and the judgement calls that hold a service together existed only in the founder's head.`,
    challengeAr: `${disclaimerAr}\n\nكان فرع واحد يحقق أداءً جيداً وعقد إيجار ثانٍ قيد النقاش. ولم يُطرح سؤال الجاهزية قط، والإجابة الصادقة عنه كانت لا: الوصفات جزئية، والشراء يعيش في علاقات شخص واحد، والتدريب يُقدَّم بالعرض العملي، وقرارات التقدير التي تمسك الخدمة موجودة في رأس المؤسس وحده.`,
    ideaEn:
      'Test readiness before location. If someone who did not build the first site could not run the second one from the documents that exist today, then documentation is the real first project — not the lease.',
    ideaAr:
      'اختبار الجاهزية قبل الموقع. فإن كان من لم يبنِ الفرع الأول لا يستطيع إدارة الثاني من الوثائق الموجودة اليوم، فالتوثيق هو المشروع الأول الحقيقي لا عقد الإيجار.',
    strategyEn:
      'Work was ordered by value per page written. The top twenty items by volume were documented with full recipes, yields, portions, plating and the common failure to avoid. Opening and closing routines became checklists rather than prose. Purchasing specifications were written for the items that matter, with a reference price so drift becomes visible.',
    strategyAr:
      'رُتِّب العمل حسب القيمة لكل صفحة تُكتب. فوُثِّقت العشرون صنفاً الأولى حسب الحجم بوصفات كاملة ونسب استخلاص وحصص وتقديم والخطأ الشائع الواجب تجنبه. وصار روتين الفتح والإغلاق قوائم تحقق لا نصوصاً. وكُتبت مواصفات الشراء للأصناف المهمة مع سعر مرجعي ليصير الانحراف مرئياً.',
    creativeEn:
      'The judgement rules — when to comp, when to remake, when to stop taking orders, how much to prep on a quiet day — were written as if-then statements. They were the most awkward part to write and the most valuable part of the result.',
    creativeAr:
      'كُتبت قواعد التقدير — متى تُقدَّم مجاملة، ومتى يُعاد التحضير، ومتى يُتوقف عن استقبال الطلبات، وكم يُحضَّر في يوم هادئ — كعبارات «إذا… فإن…». وكانت أصعب الأجزاء كتابةً وأثمن ما في النتيجة.',
    campaignEn:
      'The documents were then tested rather than filed: handed to someone who had not been there, with every question they asked recorded as a gap. A fixed-versus-flexible register was agreed so that menu length, hours and local additions can adapt by site while core recipes, brand expression, service standards and reporting stay identical.',
    campaignAr:
      'ثم اختُبرت الوثائق ولم تُحفظ: سُلِّمت لشخص لم يكن حاضراً، وسُجِّل كل سؤال طرحه كفجوة. واتُّفق على سجل الثابت مقابل المرن ليتكيّف طول القائمة والساعات والإضافات المحلية حسب الفرع بينما تبقى الوصفات الأساسية والتعبير عن العلامة ومعايير الخدمة والتقارير متطابقة.',
    outcomeEn:
      'Qualitative outcomes only: a documented core the founder does not have to be present to enforce; training that transfers rather than degrades with each copy; a purchasing specification and reference price that make drift visible; and an explicit register of what is fixed and what may vary, which removes most of the arguments multi-site management otherwise consumes.',
    outcomeAr:
      'نتائج نوعية فقط: أساس موثق لا يحتاج حضور المؤسس لفرضه؛ وتدريب ينتقل بدل أن يتدهور مع كل نسخة؛ ومواصفة شراء وسعر مرجعي يجعلان الانحراف مرئياً؛ وسجل صريح لما هو ثابت وما يجوز أن يتغير، وهو ما يزيل معظم الخلافات التي تستهلك إدارة الفروع المتعددة.',
    resultEn:
      'The expansion question changed from "where" to "when the documents pass the test", which is a considerably cheaper question to answer.',
    resultAr:
      'تحوّل سؤال التوسع من «أين» إلى «متى تجتاز الوثائق الاختبار»، وهو سؤال أقل كلفة بكثير في الإجابة عنه.',
  },
];
