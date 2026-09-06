/**
 * Library depth: descriptions, contents, audience and tags for the resources
 * that shipped as a title and a summary, plus the additional resources needed
 * for the library to cover the full practice.
 *
 * Every resource stays DRAFT until its file is uploaded in Admin. That is a
 * deliberate rule and not an oversight: publishing a download with no file
 * behind it puts a dead link on the public site. No fake file, fake size or
 * fake external URL is written anywhere in this module.
 *
 * Shapes:
 *   RESOURCE_DEPTH : { slug, descEn, descAr, includes: [en, ar][],
 *                      audience: [en, ar][], tags: string[] }
 *   NEW_RESOURCES  : RESOURCE_DEPTH + { type, titleEn, titleAr,
 *                      summaryEn, summaryAr, category }
 */

const b = (...pairs) => pairs;

/* ------------------------------------------------- existing library entries */

export const RESOURCE_DEPTH = [
  {
    slug: 'menu-engineering-template',
    descEn:
      'A working spreadsheet that places every item on your menu by how often it is ordered and what it contributes after food cost. Enter sales quantity, selling price and item cost, and the model returns the contribution, the category share and the quadrant each item falls into — so a keep, rework, reprice or retire decision can be written against evidence rather than instinct.',
    descAr:
      'جدول عمل يضع كل صنف في قائمتك حسب كم مرة يُطلب وكم يساهم بعد تكلفة الطعام. أدخل كمية المبيعات وسعر البيع وتكلفة الصنف، فيعيد النموذج المساهمة وحصة التصنيف والربع الذي يقع فيه كل صنف، ليُكتب قرار الإبقاء أو التطوير أو إعادة التسعير أو السحب بناء على دليل لا على حدس.',
    includes: b(
      ['Item entry sheet for sales, price and cost', 'ورقة إدخال للمبيعات والسعر والتكلفة'],
      ['Contribution and margin calculation per item', 'حساب المساهمة والهامش لكل صنف'],
      ['Popularity and contribution quadrant view', 'عرض أرباع الإقبال والمساهمة'],
      ['Category-level summary', 'ملخص على مستوى التصنيف'],
      ['Decision column with reason field', 'عمود القرار مع حقل للسبب'],
    ),
    audience: b(
      ['Owners and general managers', 'الملاك والمديرون العامون'],
      ['Head chefs and kitchen managers', 'رؤساء الطهاة ومديرو المطابخ'],
      ['Anyone preparing a menu review', 'كل من يعدّ مراجعة قائمة'],
    ),
    tags: ['menu', 'engineering', 'profitability', 'excel'],
  },
  {
    slug: 'menu-pricing-worksheet',
    descEn:
      'A pricing model that starts from your cost base rather than from the venue next door. It calculates food cost percentage, gross profit and contribution at any price you test, shows the effect of moving an item across a price threshold, and keeps dine-in and delivery as separate columns because they are separate businesses.',
    descAr:
      'نموذج تسعير ينطلق من قاعدة تكلفتك لا من المطعم المجاور. يحسب نسبة تكلفة الطعام والربح الإجمالي والمساهمة عند أي سعر تختبره، ويُظهر أثر نقل صنف عبر عتبة سعرية، ويُبقي الصالة والتوصيل في عمودين منفصلين لأنهما نشاطان منفصلان.',
    includes: b(
      ['Cost-up pricing calculation per item', 'حساب التسعير من التكلفة لكل صنف'],
      ['Target margin and reverse-price solver', 'محلّل الهامش المستهدف والسعر العكسي'],
      ['Dine-in and delivery price columns', 'عمودا سعر الصالة والتوصيل'],
      ['Threshold and rounding guidance', 'إرشادات العتبات والتقريب'],
      ['Before-and-after margin comparison', 'مقارنة الهامش قبل وبعد'],
    ),
    audience: b(
      ['Owners setting or revising prices', 'الملاك عند تحديد الأسعار أو مراجعتها'],
      ['Finance and operations managers', 'مديرو المالية والتشغيل'],
    ),
    tags: ['pricing', 'menu', 'margin', 'excel'],
  },
  {
    slug: 'food-cost-sheet',
    descEn:
      'A recipe costing sheet built to be maintained rather than filled in once. It handles sub-recipes, yield and waste factors, pack sizes and portion weights, so a supplier price change can be entered in one place and flow through every item that uses the ingredient.',
    descAr:
      'ورقة تكلفة وصفات مبنية للصيانة لا لتُملأ مرة واحدة. تتعامل مع الوصفات الفرعية ونسب الاستخلاص والهدر وأحجام العبوات وأوزان الحصص، فيمكن إدخال تغيير سعر المورّد في مكان واحد ليسري على كل صنف يستخدم المكوّن.',
    includes: b(
      ['Ingredient master list with pack sizes', 'قائمة مكونات رئيسية بأحجام العبوات'],
      ['Yield and waste factor fields', 'حقول نسب الاستخلاص والهدر'],
      ['Sub-recipe support', 'دعم الوصفات الفرعية'],
      ['Cost per portion and per plate', 'التكلفة لكل حصة ولكل طبق'],
      ['Supplier price update column', 'عمود تحديث أسعار الموردين'],
    ),
    audience: b(
      ['Head chefs and sous chefs', 'رؤساء الطهاة ومساعدوهم'],
      ['Cost controllers', 'مراقبو التكاليف'],
    ),
    tags: ['food cost', 'recipe', 'costing', 'excel'],
  },
  {
    slug: 'item-profitability-analysis',
    descEn:
      'A per-item view of what each dish actually earns the business, in money rather than as a ratio. It separates gross profit from contribution after packaging and channel commission, so an item that looks healthy in the dining room and loses money on delivery is visible before it scales.',
    descAr:
      'منظور لكل صنف لما يحققه كل طبق فعلاً للمشروع، بالمال لا كنسبة. يفصل الربح الإجمالي عن المساهمة بعد التغليف وعمولة القناة، ليصير الصنف الذي يبدو صحياً في الصالة ويخسر في التوصيل مرئياً قبل أن يتوسع.',
    includes: b(
      ['Gross profit and contribution per item', 'الربح الإجمالي والمساهمة لكل صنف'],
      ['Channel commission and packaging inputs', 'مدخلات عمولة القناة والتغليف'],
      ['Ranking by total contribution', 'ترتيب حسب إجمالي المساهمة'],
      ['Loss-making item flag', 'إشارة للأصناف الخاسرة'],
    ),
    audience: b(
      ['Owners and finance managers', 'الملاك ومديرو المالية'],
      ['Operators running delivery channels', 'المشغّلون الذين يديرون قنوات التوصيل'],
    ),
    tags: ['profitability', 'analysis', 'delivery', 'excel'],
  },
  {
    slug: 'product-mix-analysis',
    descEn:
      'A product mix model that shows what your guests are actually buying and how that mix moves over time. Category share, item ranking and period-on-period movement, so a shift in mix is caught while it is still small — mix drift is the most common reason revenue holds while contribution falls.',
    descAr:
      'نموذج لمزيج المنتجات يُظهر ما يشتريه ضيوفك فعلاً وكيف يتحرك ذلك المزيج عبر الزمن: حصة التصنيف وترتيب الأصناف والحركة بين الفترات، ليُلتقط تحوّل المزيج وهو ما يزال صغيراً، فانحراف المزيج أشيع أسباب ثبات الإيراد مع هبوط المساهمة.',
    includes: b(
      ['Category and item share of sales', 'حصة التصنيفات والأصناف من المبيعات'],
      ['Period-on-period movement', 'الحركة بين الفترات'],
      ['Mix-weighted contribution', 'المساهمة مرجّحة بالمزيج'],
      ['Top and bottom mover lists', 'قوائم الأصناف الأكثر صعوداً وهبوطاً'],
    ),
    audience: b(
      ['Owners and general managers', 'الملاك والمديرون العامون'],
      ['Anyone preparing a monthly review', 'كل من يعدّ مراجعة شهرية'],
    ),
    tags: ['product mix', 'analysis', 'menu', 'excel'],
  },
  {
    slug: 'restaurant-kpi-dashboard',
    descEn:
      'A short, stable measurement set for a restaurant, built on the principle that a few numbers read the same way every month beat a dashboard nobody opens. Revenue by daypart and channel, contribution, theoretical against actual food cost, labour against the demand curve, average transaction value and one service quality measure.',
    descAr:
      'مجموعة قياس قصيرة وثابتة للمطعم، مبنية على مبدأ أن أرقاماً قليلة تُقرأ بالطريقة نفسها كل شهر تتفوق على لوحة مؤشرات لا يفتحها أحد: الإيراد حسب الوقت والقناة، والمساهمة، والتكلفة النظرية مقابل الفعلية، والعمالة مقابل منحنى الطلب، ومتوسط قيمة المعاملة، ومقياس واحد لجودة الخدمة.',
    includes: b(
      ['Monthly input sheet', 'ورقة إدخال شهرية'],
      ['Revenue by daypart and channel', 'الإيراد حسب الوقت والقناة'],
      ['Theoretical versus actual food cost', 'التكلفة النظرية مقابل الفعلية'],
      ['Labour and average transaction value', 'العمالة ومتوسط قيمة المعاملة'],
      ['Trend view with threshold flags', 'عرض الاتجاه مع إشارات العتبات'],
    ),
    audience: b(
      ['Owners and general managers', 'الملاك والمديرون العامون'],
      ['Multi-site operators comparing branches', 'مشغّلو الفروع المتعددة عند المقارنة'],
    ),
    tags: ['kpi', 'reporting', 'performance', 'excel'],
  },
  {
    slug: 'cafe-kpi-dashboard',
    descEn:
      'The same discipline sized for a café, where the economics behave differently: beverage margin, attachment rate, ticket size, throughput at peak and the off-peak hours that decide whether the space pays for itself.',
    descAr:
      'الانضباط نفسه مقاساً على المقهى حيث تتصرف الاقتصاديات بشكل مختلف: هامش المشروبات، ونسبة الإضافات، وحجم الفاتورة، والطاقة في الذروة، وساعات ما بين الذروات التي تحدد إن كانت المساحة تسدد ثمنها.',
    includes: b(
      ['Beverage and food margin split', 'فصل هامش المشروبات عن الطعام'],
      ['Attachment rate tracking', 'تتبع نسبة الإضافات'],
      ['Ticket size by hour', 'حجم الفاتورة حسب الساعة'],
      ['Peak throughput measure', 'مقياس الطاقة في الذروة'],
    ),
    audience: b(
      ['Café owners and managers', 'ملاك المقاهي ومديروها'],
      ['Specialty operators tracking consistency', 'مشغّلو القهوة المختصة عند تتبع الاتساق'],
    ),
    tags: ['kpi', 'cafe', 'reporting', 'excel'],
  },
  {
    slug: 'annual-budget-model',
    descEn:
      'A twelve-month operating plan built as a working model rather than a document. Revenue by daypart and channel, cost of sales from the menu mix, labour modelled from a rota rather than a ratio, fixed overheads placed in the month they actually land, and a monthly cash flow that shows the lowest point of the year before it arrives.',
    descAr:
      'خطة تشغيل لاثني عشر شهراً مبنية كنموذج عمل لا كوثيقة: الإيراد حسب الوقت والقناة، وتكلفة المبيعات من مزيج القائمة، والعمالة منمذجة من جدول لا من نسبة، والمصاريف الثابتة موضوعة في الشهر الذي تقع فيه فعلاً، وتدفق نقدي شهري يُظهر أدنى نقطة في السنة قبل وصولها.',
    includes: b(
      ['Monthly revenue model by segment', 'نموذج إيراد شهري حسب الشريحة'],
      ['Cost of sales from menu mix', 'تكلفة المبيعات من مزيج القائمة'],
      ['Labour schedule model', 'نموذج جدول العمالة'],
      ['Fixed and annual cost calendar', 'تقويم التكاليف الثابتة والسنوية'],
      ['Monthly cash flow and break-even', 'التدفق النقدي الشهري ونقطة التعادل'],
      ['Downside case toggle', 'مفتاح حالة الهبوط'],
    ),
    audience: b(
      ['Owners and finance managers', 'الملاك ومديرو المالية'],
      ['Operators preparing an annual plan', 'المشغّلون عند إعداد خطة سنوية'],
    ),
    tags: ['budget', 'finance', 'cash flow', 'excel'],
  },
  {
    slug: 'menu-review-checklist',
    descEn:
      'The checklist we work through when reading a menu: structure and length, category sequence, item hierarchy, description discipline, price presentation, threshold crossings, sole-use ingredients, kitchen load at peak, and the differences between the dine-in and delivery lists.',
    descAr:
      'قائمة التحقق التي نعمل بها عند قراءة قائمة: البنية والطول، وتسلسل التصنيفات، وهرمية الأصناف، وانضباط الأوصاف، وعرض السعر، وعبور العتبات، والمكونات وحيدة الاستخدام، وحمل المطبخ في الذروة، والفروق بين قائمتي الصالة والتوصيل.',
    includes: b(
      ['Structure and length review', 'مراجعة البنية والطول'],
      ['Category and item sequence checks', 'فحوصات تسلسل التصنيفات والأصناف'],
      ['Description and price presentation checks', 'فحوصات الأوصاف وعرض السعر'],
      ['Kitchen load and sole-use ingredient checks', 'فحوصات حمل المطبخ والمكونات وحيدة الاستخدام'],
      ['Delivery list comparison', 'مقارنة قائمة التوصيل'],
    ),
    audience: b(
      ['Owners and managers reviewing a menu', 'الملاك والمديرون عند مراجعة القائمة'],
      ['Chefs preparing a menu change', 'الطهاة عند إعداد تغيير في القائمة'],
    ),
    tags: ['menu', 'checklist', 'review'],
  },
  {
    slug: 'menu-engineering-guide',
    descEn:
      'A written guide to reading a menu commercially: what data you need, how to build the two-axis view, what each quadrant means, the mistake of optimising a percentage instead of total contribution, and how to re-measure so a menu decision can be judged rather than assumed.',
    descAr:
      'دليل مكتوب لقراءة القائمة تجارياً: ما البيانات التي تحتاجها، وكيف تبني المنظور ثنائي المحور، وماذا يعني كل ربع، وخطأ تحسين نسبة مئوية بدل إجمالي المساهمة، وكيف تعيد القياس ليُحكم على قرار القائمة بدل افتراضه.',
    includes: b(
      ['Data requirements and how to export them', 'متطلبات البيانات وكيفية تصديرها'],
      ['Building the popularity and contribution view', 'بناء منظور الإقبال والمساهمة'],
      ['What each quadrant means and what to do', 'ماذا يعني كل ربع وماذا تفعل'],
      ['Common errors and how to avoid them', 'الأخطاء الشائعة وكيفية تجنبها'],
      ['Re-measurement method', 'منهج إعادة القياس'],
    ),
    audience: b(
      ['Owners and general managers', 'الملاك والمديرون العامون'],
      ['Anyone new to menu engineering', 'كل مبتدئ في هندسة القوائم'],
    ),
    tags: ['menu', 'engineering', 'guide'],
  },
  {
    slug: 'menu-pricing-checklist',
    descEn:
      'A pre-flight checklist for a price change: is the cost base current, which items are anchors, where do thresholds sit, is delivery being priced separately, is the change staged, and how will mix be re-measured afterwards.',
    descAr:
      'قائمة تحقق قبل تغيير الأسعار: هل قاعدة التكلفة حديثة، وأي الأصناف مرجعية، وأين تقع العتبات، وهل يُسعَّر التوصيل منفصلاً، وهل التغيير متدرج، وكيف سيُعاد قياس المزيج بعده.',
    includes: b(
      ['Cost base verification steps', 'خطوات التحقق من قاعدة التكلفة'],
      ['Anchor item identification', 'تحديد الأصناف المرجعية'],
      ['Threshold and rounding checks', 'فحوصات العتبات والتقريب'],
      ['Channel separation check', 'فحص فصل القنوات'],
      ['Staging plan and re-measurement', 'خطة التدرج وإعادة القياس'],
    ),
    audience: b(
      ['Owners planning a price change', 'الملاك عند التخطيط لتغيير الأسعار'],
      ['Finance and operations managers', 'مديرو المالية والتشغيل'],
    ),
    tags: ['pricing', 'checklist', 'menu'],
  },
  {
    slug: 'restaurant-audit-checklist',
    descEn:
      'The structured checklist behind a full restaurant audit, so nothing is skipped because nobody raised it: concept clarity, menu and costing, purchasing and receiving, storage and waste, kitchen and service flow, the guest journey, marketing presence and financial controls.',
    descAr:
      'قائمة التحقق المنهجية وراء تدقيق مطعم كامل، كي لا يُغفل شيء لمجرد أن أحداً لم يذكره: وضوح المفهوم، والقائمة والتكلفة، والشراء والاستلام، والتخزين والهدر، وانسيابية المطبخ والخدمة، ورحلة الضيف، والحضور التسويقي، والضوابط المالية.',
    includes: b(
      ['Concept and market position section', 'قسم المفهوم والتموضع'],
      ['Menu, costing and pricing section', 'قسم القائمة والتكلفة والتسعير'],
      ['Purchasing, receiving and storage section', 'قسم الشراء والاستلام والتخزين'],
      ['Kitchen and service observation section', 'قسم معاينة المطبخ والخدمة'],
      ['Guest journey section', 'قسم رحلة الضيف'],
      ['Findings register with cost-of-inaction column', 'سجل نتائج بعمود تكلفة التقاعس'],
    ),
    audience: b(
      ['Owners and operations directors', 'الملاك ومديرو التشغيل'],
      ['Anyone taking over an existing venue', 'كل من يتسلّم مطعماً قائماً'],
    ),
    tags: ['audit', 'checklist', 'operations'],
  },
  {
    slug: 'cafe-audit-checklist',
    descEn:
      'The café version of the audit, written around the things that actually decide a café: beverage specification and consistency, attachment, throughput at peak, the food offer beside the bar, dwell time and the off-peak hours.',
    descAr:
      'نسخة المقهى من التدقيق، مكتوبة حول ما يحسم أمر المقهى فعلاً: مواصفات المشروبات واتساقها، والإضافات، والطاقة في الذروة، وعرض الطعام بجانب البار، ومدة البقاء، وساعات ما بين الذروات.',
    includes: b(
      ['Beverage specification and consistency checks', 'فحوصات مواصفات المشروبات واتساقها'],
      ['Attachment and ticket size section', 'قسم الإضافات وحجم الفاتورة'],
      ['Bar throughput and queue checks', 'فحوصات طاقة البار والطوابير'],
      ['Food offer and preparation load', 'عرض الطعام وحمل التحضير'],
      ['Dwell time and seating review', 'مراجعة مدة البقاء والجلوس'],
    ),
    audience: b(
      ['Café owners and managers', 'ملاك المقاهي ومديروها'],
      ['Specialty coffee operators', 'مشغّلو القهوة المختصة'],
    ),
    tags: ['audit', 'cafe', 'checklist'],
  },
  {
    slug: 'opening-checklist',
    descEn:
      'A pre-opening checklist sequenced in the order that protects the budget: concept, menu, costing, pricing, then equipment and suppliers, then standards, training and a soft opening designed as a test rather than a preview.',
    descAr:
      'قائمة تحقق ما قبل الافتتاح مرتّبة بالتسلسل الذي يحمي الميزانية: المفهوم، ثم القائمة، ثم التكلفة، ثم التسعير، ثم المعدات والموردون، ثم المعايير والتدريب وافتتاح تجريبي مصمم كاختبار لا كمعاينة.',
    includes: b(
      ['Sequenced pre-opening task list', 'قائمة مهام ما قبل الافتتاح مرتبة'],
      ['Decision gates before each stage', 'بوابات قرار قبل كل مرحلة'],
      ['Supplier and equipment readiness checks', 'فحوصات جاهزية الموردين والمعدات'],
      ['Standards and training checkpoints', 'نقاط تحقق المعايير والتدريب'],
      ['Soft opening test plan', 'خطة اختبار الافتتاح التجريبي'],
    ),
    audience: b(
      ['Owners opening a new venue', 'الملاك عند افتتاح مطعم جديد'],
      ['Project managers running a pre-opening', 'مديرو مشاريع ما قبل الافتتاح'],
    ),
    tags: ['opening', 'checklist', 'development'],
  },
  {
    slug: 'expansion-checklist',
    descEn:
      'A readiness checklist to work through before a second lease is discussed: is the first site documented, can training transfer without the founder, is the supplier base ready for volume, does the reporting compare sites, and what is fixed versus flexible.',
    descAr:
      'قائمة تحقق للجاهزية يُعمل بها قبل مناقشة عقد إيجار ثانٍ: هل الفرع الأول موثق، وهل ينتقل التدريب دون المؤسس، وهل قاعدة الموردين جاهزة للحجم، وهل تقارن التقارير بين الفروع، وما هو الثابت مقابل المرن.',
    includes: b(
      ['Documentation readiness section', 'قسم جاهزية التوثيق'],
      ['Training transfer test', 'اختبار انتقال التدريب'],
      ['Supplier scalability checks', 'فحوصات قابلية الموردين للتوسع'],
      ['Management structure requirements', 'متطلبات الهيكل الإداري'],
      ['Fixed versus flexible register template', 'قالب سجل الثابت مقابل المرن'],
    ),
    audience: b(
      ['Owners considering a second site', 'الملاك عند التفكير في فرع ثانٍ'],
      ['Operations directors preparing to scale', 'مديرو التشغيل عند التحضير للتوسع'],
    ),
    tags: ['expansion', 'checklist', 'multi-site'],
  },
  {
    slug: 'menu-development-brief',
    descEn:
      'The brief to complete before menu development starts, so the kitchen is designing against a decided concept rather than against a preference: audience and occasion, structure and length, price position, kitchen constraints, and what is deliberately excluded.',
    descAr:
      'الموجز الذي يُستكمل قبل بدء تطوير القائمة، ليصمم المطبخ مقابل مفهوم محسوم لا مقابل تفضيل: الجمهور والمناسبة، والبنية والطول، والموقع السعري، وقيود المطبخ، وما يُستبعد عمداً.',
    includes: b(
      ['Concept and occasion section', 'قسم المفهوم والمناسبة'],
      ['Structure, categories and length', 'البنية والتصنيفات والطول'],
      ['Price position and target margin', 'الموقع السعري والهامش المستهدف'],
      ['Kitchen and equipment constraints', 'قيود المطبخ والمعدات'],
      ['Explicit exclusions', 'الاستبعادات الصريحة'],
    ),
    audience: b(
      ['Owners briefing a chef or consultant', 'الملاك عند توجيه طاهٍ أو مستشار'],
      ['Development chefs', 'طهاة التطوير'],
    ),
    tags: ['menu', 'brief', 'development'],
  },
  {
    slug: 'marketing-plan-template',
    descEn:
      'An annual marketing plan structured so every activity has a purpose, an owner, a budget and a way of being judged: positioning, audience and catchment, offer architecture, channel plan, calendar including the soft months, and a measurement frame agreed before spend.',
    descAr:
      'خطة تسويق سنوية مهيكلة بحيث يكون لكل نشاط غرض ومسؤول وميزانية وطريقة للحكم عليه: التموضع، والجمهور والنطاق، وبنية العروض، وخطة القنوات، والتقويم بما فيه الأشهر الضعيفة، وإطار قياس متفق عليه قبل الإنفاق.',
    includes: b(
      ['Positioning and messaging section', 'قسم التموضع والرسائل'],
      ['Audience and catchment definition', 'تعريف الجمهور والنطاق'],
      ['Offer and promotion architecture', 'بنية العروض والترويج'],
      ['Channel plan and budget allocation', 'خطة القنوات وتوزيع الميزانية'],
      ['Twelve-month calendar', 'تقويم اثني عشر شهراً'],
      ['Measurement framework', 'إطار القياس'],
    ),
    audience: b(
      ['Owners and marketing managers', 'الملاك ومديرو التسويق'],
      ['Agencies briefing on an F&B account', 'الوكالات عند التوجيه لحساب مطاعم'],
    ),
    tags: ['marketing', 'planning', 'template'],
  },
  {
    slug: 'campaign-brief-template',
    descEn:
      'A campaign brief that forces the awkward questions before budget is committed: what has to change, what would prove it changed, what the offer costs in margin, how many creative variants are needed, and when the campaign will be judged.',
    descAr:
      'موجز حملة يفرض الأسئلة الصعبة قبل الالتزام بالميزانية: ما الذي يجب أن يتغير، وما الذي يثبت تغيره، وكم يكلّف العرض من الهامش، وكم نسخة إبداعية مطلوبة، ومتى سيُحكم على الحملة.',
    includes: b(
      ['Objective and success definition', 'الهدف وتعريف النجاح'],
      ['Offer design and margin check', 'تصميم العرض وفحص الهامش'],
      ['Audience and channel selection', 'اختيار الجمهور والقنوات'],
      ['Creative variant requirements', 'متطلبات النسخ الإبداعية'],
      ['Measurement and review date', 'القياس وتاريخ المراجعة'],
    ),
    audience: b(
      ['Marketing managers and owners', 'مديرو التسويق والملاك'],
      ['Anyone briefing an agency or freelancer', 'كل من يوجّه وكالة أو مستقلاً'],
    ),
    tags: ['marketing', 'campaign', 'brief'],
  },
];

/* ------------------------------------------------------ new library entries */

/**
 * Additional resource categories. `menu`, `finance`, `operations` and
 * `marketing` already exist and are reused rather than duplicated.
 */
export const NEW_RESOURCE_CATEGORIES = [
  {
    slug: 'strategy-development',
    nameEn: 'Strategy & Development',
    nameAr: 'الاستراتيجية والتطوير',
    descriptionEn: 'Concept, feasibility, business planning and the documents that decide a venue before it opens.',
    descriptionAr: 'المفهوم ودراسة الجدوى وتخطيط الأعمال والوثائق التي تحسم أمر المطعم قبل افتتاحه.',
    order: 5,
  },
  {
    slug: 'brand-experience',
    nameEn: 'Brand & Experience',
    nameAr: 'العلامة والتجربة',
    descriptionEn: 'Positioning, brand audit, customer journey and the surfaces a guest actually experiences.',
    descriptionAr: 'التموضع وتدقيق العلامة ورحلة العميل والأسطح التي يعيشها الضيف فعلاً.',
    order: 6,
  },
  {
    slug: 'growth-expansion',
    nameEn: 'Growth & Expansion',
    nameAr: 'النمو والتوسع',
    descriptionEn: 'Readiness assessments, branch feasibility and the reporting a multi-site business needs.',
    descriptionAr: 'تقييمات الجاهزية وجدوى الفروع والتقارير التي يحتاجها العمل متعدد الفروع.',
    order: 7,
  },
];

/** Descriptions for the resource categories that shipped without one. */
export const RESOURCE_CATEGORY_DEPTH = [
  {
    slug: 'menu',
    descriptionEn: 'Menu structure, engineering, costing and pricing — the highest-leverage documents in the business.',
    descriptionAr: 'بنية القائمة وهندستها وتكلفتها وتسعيرها — أعلى وثائق المشروع تأثيراً.',
  },
  {
    slug: 'finance',
    descriptionEn: 'Budgets, cash flow, profitability models and the reporting that keeps a plan alive.',
    descriptionAr: 'الموازنات والتدفق النقدي ونماذج الربحية والتقارير التي تُبقي الخطة حية.',
  },
  {
    slug: 'operations',
    descriptionEn: 'Purchasing, receiving, inventory, service standards and the routines that hold quality steady.',
    descriptionAr: 'الشراء والاستلام والمخزون ومعايير الخدمة والروتين الذي يحفظ ثبات الجودة.',
  },
  {
    slug: 'marketing',
    descriptionEn: 'Planning, campaigns, content and the frameworks that tie marketing spend to a commercial result.',
    descriptionAr: 'التخطيط والحملات والمحتوى والأطر التي تربط الإنفاق التسويقي بنتيجة تجارية.',
  },
];

export const NEW_RESOURCES = [
  {
    slug: 'restaurant-business-plan-template',
    type: 'WORD',
    category: 'strategy-development',
    titleEn: 'Restaurant Business Plan Template',
    titleAr: 'قالب خطة عمل مطعم',
    summaryEn: 'A business plan structured for an F&B venue rather than a generic company, with the assumptions stated so a lender or partner can test them.',
    summaryAr: 'خطة عمل مهيكلة لمشروع أغذية ومشروبات لا لشركة عامة، بافتراضات معلنة ليتمكن الممول أو الشريك من اختبارها.',
    descEn:
      'A plan written the way an F&B business actually works: concept and occasion before market size, menu and cost base before revenue projections, labour modelled as a rota rather than a ratio, and a monthly cash view that shows the lowest point of the first year.',
    descAr:
      'خطة مكتوبة بالطريقة التي يعمل بها مشروع الأغذية والمشروبات فعلاً: المفهوم والمناسبة قبل حجم السوق، والقائمة وقاعدة التكلفة قبل توقعات الإيراد، والعمالة منمذجة كجدول لا كنسبة، ومنظور نقدي شهري يُظهر أدنى نقطة في السنة الأولى.',
    includes: b(
      ['Concept and positioning section', 'قسم المفهوم والتموضع'],
      ['Market and catchment analysis', 'تحليل السوق والنطاق'],
      ['Menu, cost base and pricing', 'القائمة وقاعدة التكلفة والتسعير'],
      ['Investment and operating cost structure', 'الاستثمار وهيكل التكاليف التشغيلية'],
      ['Monthly cash flow and break-even', 'التدفق النقدي الشهري ونقطة التعادل'],
      ['Assumptions register', 'سجل الافتراضات'],
    ),
    audience: b(
      ['Founders preparing to open', 'المؤسسون عند التحضير للافتتاح'],
      ['Operators raising finance or a partner', 'المشغّلون عند جمع تمويل أو شريك'],
    ),
    tags: ['business plan', 'strategy', 'finance'],
  },
  {
    slug: 'restaurant-concept-brief',
    type: 'WORD',
    category: 'strategy-development',
    titleEn: 'Restaurant Concept Brief',
    titleAr: 'موجز مفهوم مطعم',
    summaryEn: 'The document that turns an idea into a definition specific enough for a designer, a chef and a marketer to work from.',
    summaryAr: 'الوثيقة التي تحوّل الفكرة إلى تعريف محدد بما يكفي ليعمل منه المصمم والطاهي والمسوّق.',
    descEn:
      'A concept brief built around the five questions a definition has to answer — who it is for, what occasion it serves, what the offer is, where it sits on price and why it would be chosen over the named alternatives nearby — with a test at the end: could someone disagree with this?',
    descAr:
      'موجز مفهوم مبني على الأسئلة الخمسة التي يجب أن يجيب عنها التعريف — لمن هو، وأي مناسبة يخدم، وما هو العرض، وأين يقع سعرياً، ولماذا يُختار على البدائل المسمّاة القريبة — مع اختبار في النهاية: هل يستطيع أحد الاعتراض على هذا؟',
    includes: b(
      ['Audience and occasion definition', 'تعريف الجمهور والمناسبة'],
      ['Offer structure and menu direction', 'بنية العرض واتجاه القائمة'],
      ['Price positioning worksheet', 'ورقة عمل التموضع السعري'],
      ['Named competitive set', 'المجموعة التنافسية بالأسماء'],
      ['One-sentence definition test', 'اختبار التعريف في جملة واحدة'],
    ),
    audience: b(
      ['Founders and concept owners', 'المؤسسون وأصحاب المفاهيم'],
      ['Anyone briefing a design or kitchen team', 'كل من يوجّه فريق تصميم أو مطبخ'],
    ),
    tags: ['concept', 'brief', 'strategy'],
  },
  {
    slug: 'brand-positioning-worksheet',
    type: 'WORD',
    category: 'brand-experience',
    titleEn: 'Brand Positioning Worksheet',
    titleAr: 'ورقة عمل تموضع العلامة',
    summaryEn: 'A worksheet that produces a position you can be wrong for some guests about — which is the only kind that does any work.',
    summaryAr: 'ورقة عمل تنتج موقعاً يمكن أن تكون به خاطئاً لبعض الضيوف، وهو النوع الوحيد الذي يؤدي عملاً فعلاً.',
    descEn:
      'Positioning works by exclusion. This worksheet takes you through the occasion, the named alternatives and the operational proof that makes a position credible before a guest has to take it on trust — and ends with a statement some potential guests would read and self-exclude from.',
    descAr:
      'يعمل التموضع بالاستبعاد. تأخذك هذه الورقة عبر المناسبة والبدائل المسمّاة والدليل التشغيلي الذي يجعل الموقع قابلاً للتصديق قبل أن يضطر الضيف لأخذه على الثقة، وتنتهي ببيان يقرأه بعض الضيوف المحتملين فيستبعدون أنفسهم.',
    includes: b(
      ['Occasion and audience mapping', 'رسم المناسبة والجمهور'],
      ['Named competitive set exercise', 'تمرين المجموعة التنافسية بالأسماء'],
      ['Operational proof checklist', 'قائمة تحقق الدليل التشغيلي'],
      ['Position statement drafting', 'صياغة بيان التموضع'],
      ['Self-exclusion test', 'اختبار الاستبعاد الذاتي'],
    ),
    audience: b(
      ['Owners and brand leads', 'الملاك ومسؤولو العلامة'],
      ['Teams preparing a rebrand', 'الفرق عند التحضير لتحديث العلامة'],
    ),
    tags: ['brand', 'positioning', 'strategy'],
  },
  {
    slug: 'customer-experience-audit',
    type: 'PDF',
    category: 'brand-experience',
    titleEn: 'Customer Experience Audit',
    titleAr: 'تدقيق تجربة العميل',
    summaryEn: 'A journey audit covering both the dining room and delivery, with friction ranked by how many guests meet it rather than by how it feels.',
    summaryAr: 'تدقيق رحلة يغطي الصالة والتوصيل، مع ترتيب الاحتكاك حسب عدد من يمر به لا حسب شعوره.',
    descEn:
      'Walk the journey as a guest, at the hours guests actually come, and record every point where effort is required of them: discovery, arrival, seating, ordering, service pace, payment, departure and — for delivery — packaging, temperature, completeness and the unboxing.',
    descAr:
      'خُض الرحلة كضيف في الساعات التي يأتي فيها الضيوف فعلاً، وسجّل كل نقطة يُطلب فيها منهم جهد: الاكتشاف والوصول والجلوس والطلب وإيقاع الخدمة والدفع والمغادرة، وللتوصيل: التغليف والحرارة والاكتمال ولحظة الفتح.',
    includes: b(
      ['Dining room journey sections', 'أقسام رحلة الصالة'],
      ['Delivery journey sections', 'أقسام رحلة التوصيل'],
      ['Friction register with frequency scoring', 'سجل الاحتكاك بتقييم التكرار'],
      ['Standards drafting page', 'صفحة صياغة المعايير'],
    ),
    audience: b(
      ['Owners and general managers', 'الملاك والمديرون العامون'],
      ['Service and floor managers', 'مديرو الخدمة والصالة'],
    ),
    tags: ['customer experience', 'audit', 'service'],
  },
  {
    slug: 'competitor-analysis-template',
    type: 'EXCEL',
    category: 'strategy-development',
    titleEn: 'Competitor Analysis Template',
    titleAr: 'قالب تحليل المنافسين',
    summaryEn: 'A comparison built around your actual catchment rather than the category leader, because a guest chooses between the venues within reach.',
    summaryAr: 'مقارنة مبنية على نطاقك الفعلي لا على قائد التصنيف، لأن الضيف يختار بين المطاعم القريبة منه.',
    descEn:
      'Compare the venues a guest would realistically choose instead of you, on the dimensions that decide the choice: occasion served, menu length and price bands, service model, hours, delivery presence and what each one is obviously right for.',
    descAr:
      'قارن المطاعم التي قد يختارها الضيف واقعياً بدلاً منك، على الأبعاد التي تحسم الاختيار: المناسبة المخدومة، وطول القائمة والنطاقات السعرية، ونموذج الخدمة، والساعات، والحضور في التوصيل، وما هو كل منها صواب بديهي له.',
    includes: b(
      ['Catchment competitor list', 'قائمة منافسي النطاق'],
      ['Price band comparison', 'مقارنة النطاقات السعرية'],
      ['Occasion and service model comparison', 'مقارنة المناسبة ونموذج الخدمة'],
      ['Delivery and channel presence', 'الحضور في التوصيل والقنوات'],
      ['Gap and opportunity summary', 'ملخص الفجوات والفرص'],
    ),
    audience: b(
      ['Owners and strategy leads', 'الملاك ومسؤولو الاستراتيجية'],
      ['Teams planning a new site', 'الفرق عند التخطيط لموقع جديد'],
    ),
    tags: ['competitor', 'analysis', 'strategy'],
  },
  {
    slug: 'restaurant-launch-plan',
    type: 'WORD',
    category: 'marketing',
    titleEn: 'Restaurant Launch Plan',
    titleAr: 'خطة إطلاق مطعم',
    summaryEn: 'A launch plan that waits for the operation to be stable, because a full launch into an untested kitchen buys negative first impressions.',
    summaryAr: 'خطة إطلاق تنتظر استقرار التشغيل، لأن الإطلاق الكامل على مطبخ غير مختبر يشتري انطباعات أولى سلبية.',
    descEn:
      'A staged launch: soft opening as a test with limited covers and a shortened menu, corrections, then a controlled build of awareness — with the capacity check written in as a gate rather than assumed.',
    descAr:
      'إطلاق متدرج: افتتاح تجريبي كاختبار بعدد طلبات محدود وقائمة مختصرة، ثم تصحيحات، ثم بناء وعي متحكم فيه، مع كتابة فحص الطاقة كبوابة لا افتراضه.',
    includes: b(
      ['Soft opening test plan', 'خطة اختبار الافتتاح التجريبي'],
      ['Capacity gate before launch', 'بوابة الطاقة قبل الإطلاق'],
      ['Awareness build sequence', 'تسلسل بناء الوعي'],
      ['Content and asset checklist', 'قائمة تحقق المحتوى والمواد'],
      ['Week-by-week timeline', 'جدول زمني أسبوعاً بأسبوع'],
    ),
    audience: b(
      ['Owners opening a venue', 'الملاك عند افتتاح مطعم'],
      ['Marketing leads planning an opening', 'مسؤولو التسويق عند التخطيط لافتتاح'],
    ),
    tags: ['launch', 'opening', 'marketing'],
  },
  {
    slug: 'marketing-campaign-planner',
    type: 'EXCEL',
    category: 'marketing',
    titleEn: 'Marketing Campaign Planner',
    titleAr: 'مخطط الحملات التسويقية',
    summaryEn: 'A twelve-month planner that covers the soft months as deliberately as the busy ones.',
    summaryAr: 'مخطط لاثني عشر شهراً يغطي الأشهر الضعيفة بالقصد نفسه الذي يغطي به المزدحمة.',
    descEn:
      'Plan the year by objective rather than by occasion: what each period has to achieve, the offer and its margin cost, the channel and budget, the creative required, and the review date at which each activity is judged.',
    descAr:
      'خطط للسنة حسب الهدف لا حسب المناسبة: ما الذي يجب أن تحققه كل فترة، والعرض وتكلفته من الهامش، والقناة والميزانية، والإبداع المطلوب، وتاريخ المراجعة الذي يُحكم عنده على كل نشاط.',
    includes: b(
      ['Twelve-month calendar grid', 'شبكة تقويم اثني عشر شهراً'],
      ['Objective and success definition per activity', 'الهدف وتعريف النجاح لكل نشاط'],
      ['Budget allocation by channel', 'توزيع الميزانية حسب القناة'],
      ['Offer margin check column', 'عمود فحص هامش العرض'],
      ['Review date tracker', 'متتبع تواريخ المراجعة'],
    ),
    audience: b(
      ['Marketing managers', 'مديرو التسويق'],
      ['Owners planning the marketing year', 'الملاك عند التخطيط للسنة التسويقية'],
    ),
    tags: ['marketing', 'planning', 'calendar'],
  },
  {
    slug: 'social-media-content-planner',
    type: 'EXCEL',
    category: 'marketing',
    titleEn: 'Social Media Content Planner',
    titleAr: 'مخطط محتوى وسائل التواصل',
    summaryEn: 'A monthly content plan sized to the production capacity you actually have, not to an ideal cadence.',
    summaryAr: 'خطة محتوى شهرية مقاسة على طاقتك الإنتاجية الفعلية لا على إيقاع مثالي.',
    descEn:
      'Plan the month from a commercial brief — a launch, a soft daypart, a category that needs attention — then map pillars, formats, production days and publishing slots so the calendar can actually be produced by the team that has to produce it.',
    descAr:
      'خطط للشهر انطلاقاً من موجز تجاري — إطلاق، أو وقت ضعيف، أو تصنيف يحتاج انتباهاً — ثم ارسم المحاور والصيغ وأيام الإنتاج وفترات النشر ليكون التقويم قابلاً للإنتاج فعلاً من الفريق الذي عليه إنتاجه.',
    includes: b(
      ['Monthly commercial brief page', 'صفحة الموجز التجاري الشهري'],
      ['Content pillar and format library', 'مكتبة محاور المحتوى وصيغه'],
      ['Production day planner', 'مخطط أيام الإنتاج'],
      ['Publishing calendar in both languages', 'تقويم نشر باللغتين'],
      ['Performance review sheet', 'ورقة مراجعة الأداء'],
    ),
    audience: b(
      ['In-house social media managers', 'مديرو التواصل الاجتماعي الداخليون'],
      ['Owners running their own channels', 'الملاك الذين يديرون قنواتهم بأنفسهم'],
    ),
    tags: ['social media', 'content', 'planning'],
  },
  {
    slug: 'restaurant-pl-template',
    type: 'EXCEL',
    category: 'finance',
    titleEn: 'Restaurant P&L Template',
    titleAr: 'قالب قائمة الأرباح والخسائر للمطاعم',
    summaryEn: 'A profit and loss structure built for an F&B operation, with contribution visible by segment rather than only at the bottom line.',
    summaryAr: 'هيكل أرباح وخسائر مبني لتشغيل مطاعم، بمساهمة مرئية حسب الشريحة لا في السطر الأخير فقط.',
    descEn:
      'A monthly P&L laid out the way a restaurant is actually managed: revenue by daypart and channel, cost of sales by category, labour split by function, prime cost, controllable expenses and fixed overheads placed in the month they land.',
    descAr:
      'قائمة أرباح وخسائر شهرية مرتبة بالطريقة التي يُدار بها المطعم فعلاً: الإيراد حسب الوقت والقناة، وتكلفة المبيعات حسب التصنيف، والعمالة مقسمة حسب الوظيفة، والتكلفة الأولية، والمصاريف القابلة للتحكم، والمصاريف الثابتة موضوعة في الشهر الذي تقع فيه.',
    includes: b(
      ['Monthly P&L structure', 'هيكل قائمة أرباح وخسائر شهري'],
      ['Revenue by daypart and channel', 'الإيراد حسب الوقت والقناة'],
      ['Prime cost calculation', 'حساب التكلفة الأولية'],
      ['Year-to-date and prior-period comparison', 'مقارنة السنة حتى تاريخه والفترة السابقة'],
    ),
    audience: b(
      ['Owners and finance managers', 'الملاك ومديرو المالية'],
      ['Accountants reporting on an F&B business', 'المحاسبون عند التقرير عن مشروع مطاعم'],
    ),
    tags: ['p&l', 'finance', 'reporting'],
  },
  {
    slug: 'cash-flow-forecast',
    type: 'EXCEL',
    category: 'finance',
    titleEn: 'Cash Flow Forecast',
    titleAr: 'توقعات التدفق النقدي',
    summaryEn: 'A monthly cash view that shows the tight month while there is still time to act on it.',
    summaryAr: 'منظور نقدي شهري يُظهر الشهر الضيق بينما ما زال الوقت متاحاً للتصرف.',
    descEn:
      'Model receipts and payments by month, including the annual and quarterly costs that are forgotten in a monthly view — licences, insurance, maintenance — plus supplier terms, rent timing and a downside case where revenue runs below plan for two consecutive months.',
    descAr:
      'انمذج المقبوضات والمدفوعات شهرياً بما يشمل التكاليف السنوية والربع سنوية المنسية في المنظور الشهري — التراخيص والتأمين والصيانة — إضافة إلى شروط الموردين وتوقيت الإيجار وحالة هبوط يكون فيها الإيراد دون الخطة لشهرين متتاليين.',
    includes: b(
      ['Monthly receipts and payments model', 'نموذج المقبوضات والمدفوعات الشهري'],
      ['Annual and quarterly cost calendar', 'تقويم التكاليف السنوية والربع سنوية'],
      ['Supplier terms and rent timing', 'شروط الموردين وتوقيت الإيجار'],
      ['Lowest-point identification', 'تحديد أدنى نقطة'],
      ['Downside case toggle', 'مفتاح حالة الهبوط'],
    ),
    audience: b(
      ['Owners and finance managers', 'الملاك ومديرو المالية'],
      ['Operators planning through a slow season', 'المشغّلون عند التخطيط لموسم بطيء'],
    ),
    tags: ['cash flow', 'finance', 'planning'],
  },
  {
    slug: 'break-even-model',
    type: 'EXCEL',
    category: 'finance',
    titleEn: 'Break-Even Model',
    titleAr: 'نموذج نقطة التعادل',
    summaryEn: 'The revenue, covers and average transaction value required to cover the cost base — and how far each can fall before it does not.',
    summaryAr: 'الإيراد وعدد الطلبات ومتوسط قيمة المعاملة اللازمة لتغطية قاعدة التكلفة، وكم يمكن أن يهبط كل منها قبل ألا تُغطى.',
    descEn:
      'Break-even expressed three ways — in revenue, in covers and in average transaction value — with a sensitivity view showing how much each input can move before the result changes. Fixed and variable costs are separated explicitly, because most break-even errors start there.',
    descAr:
      'نقطة التعادل معبَّراً عنها بثلاث طرق: بالإيراد وبعدد الطلبات وبمتوسط قيمة المعاملة، مع منظور حساسية يُظهر كم يمكن أن يتحرك كل مدخل قبل تغيّر النتيجة. وتُفصل التكاليف الثابتة عن المتغيرة صراحة لأن معظم أخطاء التعادل تبدأ هناك.',
    includes: b(
      ['Fixed and variable cost separation', 'فصل التكاليف الثابتة عن المتغيرة'],
      ['Break-even in revenue, covers and ATV', 'التعادل بالإيراد وعدد الطلبات ومتوسط الفاتورة'],
      ['Contribution margin calculation', 'حساب هامش المساهمة'],
      ['Sensitivity view', 'منظور الحساسية'],
    ),
    audience: b(
      ['Owners and finance managers', 'الملاك ومديرو المالية'],
      ['Anyone testing a new site or format', 'كل من يختبر موقعاً أو صيغة جديدة'],
    ),
    tags: ['break-even', 'finance', 'analysis'],
  },
  {
    slug: 'labour-cost-tracker',
    type: 'EXCEL',
    category: 'operations',
    titleEn: 'Labour Cost Tracker',
    titleAr: 'متتبع تكلفة العمالة',
    summaryEn: 'Labour read as a schedule against the demand curve, not as a percentage of revenue.',
    summaryAr: 'قراءة العمالة كجدول مقابل منحنى الطلب لا كنسبة من الإيراد.',
    descEn:
      'Plot demand in fifteen-minute intervals, overlay the rota, and see where you are paying for coverage in quiet hours while under-staffing the twenty minutes that decide the service. Includes cost per hour by function and a variance view against plan.',
    descAr:
      'ارسم الطلب في فترات خمس عشرة دقيقة، وضع الجدول فوقه، وانظر أين تدفع مقابل تغطية في ساعات هادئة بينما ينقص العدد في العشرين دقيقة التي تحسم الخدمة. ويتضمن التكلفة بالساعة حسب الوظيفة ومنظور الانحراف مقابل الخطة.',
    includes: b(
      ['Demand curve in fifteen-minute intervals', 'منحنى الطلب في فترات خمس عشرة دقيقة'],
      ['Rota overlay', 'إسقاط الجدول على المنحنى'],
      ['Cost per hour by function', 'التكلفة بالساعة حسب الوظيفة'],
      ['Variance against plan', 'الانحراف مقابل الخطة'],
    ),
    audience: b(
      ['General managers and head chefs', 'المديرون العامون ورؤساء الطهاة'],
      ['Operators building a rota', 'المشغّلون عند بناء الجداول'],
    ),
    tags: ['labour', 'scheduling', 'cost control'],
  },
  {
    slug: 'inventory-control-checklist',
    type: 'PDF',
    category: 'operations',
    titleEn: 'Inventory Control Checklist',
    titleAr: 'قائمة تحقق ضبط المخزون',
    summaryEn: 'The storage, rotation and counting routine that makes a theoretical-versus-actual food cost reading possible.',
    summaryAr: 'روتين التخزين والتدوير والجرد الذي يجعل قراءة التكلفة النظرية مقابل الفعلية ممكنة.',
    descEn:
      'A count routine designed to be consistent rather than exhaustive: the same person, the same order, the same day, the same level of detail — because an inconsistent count measures the counter rather than the kitchen. Includes storage, rotation and par level review sections.',
    descAr:
      'روتين جرد مصمم للاتساق لا للشمول: الشخص نفسه، والترتيب نفسه، واليوم نفسه، ومستوى التفصيل نفسه، لأن الجرد غير المتسق يقيس القائم بالجرد لا المطبخ. ويتضمن أقسام التخزين والتدوير ومراجعة حدود المخزون.',
    includes: b(
      ['Count routine and sheet structure', 'روتين الجرد وبنية الورقة'],
      ['Storage and rotation checks', 'فحوصات التخزين والتدوير'],
      ['Par level review section', 'قسم مراجعة حدود المخزون'],
      ['Waste log guidance', 'إرشادات سجل الهدر'],
    ),
    audience: b(
      ['Kitchen and stores managers', 'مديرو المطبخ والمستودعات'],
      ['Cost controllers', 'مراقبو التكاليف'],
    ),
    tags: ['inventory', 'stock', 'operations'],
  },
  {
    slug: 'procurement-checklist',
    type: 'PDF',
    category: 'operations',
    titleEn: 'Purchasing & Receiving Checklist',
    titleAr: 'قائمة تحقق الشراء والاستلام',
    summaryEn: 'The back-door routine that decides a large part of food cost before a chef touches anything.',
    summaryAr: 'روتين الباب الخلفي الذي يحسم جزءاً كبيراً من تكلفة الطعام قبل أن يلمس الطاهي شيئاً.',
    descEn:
      'A receiving standard that can actually be followed on a busy morning: named responsibility, delivery checked against the order rather than the invoice, weights verified for anything priced by weight, quality inspected before signature, and discrepancies recorded the same day.',
    descAr:
      'معيار استلام يمكن اتباعه فعلاً في صباح مزدحم: مسؤولية مسمّاة، وفحص التوريد مقابل الطلب لا الفاتورة، وتحقق الأوزان لكل ما يُسعَّر بالوزن، وفحص الجودة قبل التوقيع، وتسجيل الفروق في اليوم نفسه.',
    includes: b(
      ['Receiving standard and responsibilities', 'معيار الاستلام والمسؤوليات'],
      ['Order-versus-delivery check sheet', 'ورقة فحص الطلب مقابل التوريد'],
      ['Weight and quality verification', 'التحقق من الوزن والجودة'],
      ['Discrepancy log', 'سجل الفروق'],
      ['Price drift check', 'فحص انحراف الأسعار'],
    ),
    audience: b(
      ['Stores and receiving staff', 'موظفو المستودعات والاستلام'],
      ['Kitchen managers', 'مديرو المطابخ'],
    ),
    tags: ['purchasing', 'receiving', 'operations'],
  },
  {
    slug: 'supplier-evaluation-template',
    type: 'EXCEL',
    category: 'operations',
    titleEn: 'Supplier Evaluation Template',
    titleAr: 'قالب تقييم الموردين',
    summaryEn: 'Cost is not only price. This compares suppliers on reliability, consistency and short deliveries as well as the invoice.',
    summaryAr: 'التكلفة ليست السعر فقط. يقارن هذا القالب الموردين على الموثوقية والاتساق والتوريدات الناقصة إلى جانب الفاتورة.',
    descEn:
      'Score suppliers on the dimensions that carry a monetary value beyond the unit price: delivery reliability, specification consistency, short-delivery frequency, quality variation, responsiveness and terms — with space for a second source on anything you cannot operate without.',
    descAr:
      'قيّم الموردين على الأبعاد التي تحمل قيمة نقدية تتجاوز سعر الوحدة: موثوقية التوريد، واتساق المواصفات، وتكرار التوريدات الناقصة، وتذبذب الجودة، وسرعة الاستجابة، والشروط، مع مساحة لمصدر ثانٍ لكل ما لا يمكنك العمل بدونه.',
    includes: b(
      ['Supplier scorecard', 'بطاقة تقييم المورّد'],
      ['Specification compliance tracking', 'تتبع الالتزام بالمواصفات'],
      ['Short-delivery and quality log', 'سجل التوريدات الناقصة والجودة'],
      ['Second-source register', 'سجل المصادر البديلة'],
    ),
    audience: b(
      ['Purchasing managers', 'مديرو المشتريات'],
      ['Owners reviewing supplier terms', 'الملاك عند مراجعة شروط الموردين'],
    ),
    tags: ['supplier', 'purchasing', 'evaluation'],
  },
  {
    slug: 'branch-feasibility-checklist',
    type: 'PDF',
    category: 'growth-expansion',
    titleEn: 'Branch Feasibility Checklist',
    titleAr: 'قائمة تحقق جدوى الفرع',
    summaryEn: 'Site criteria, catchment comparison and the format question — asked in that order, after readiness rather than before it.',
    summaryAr: 'معايير الموقع ومقارنة النطاقات وسؤال الصيغة، مطروحة بهذا الترتيب وبعد الجاهزية لا قبلها.',
    descEn:
      'A structured way to compare candidate sites on the same criteria rather than on enthusiasm: catchment profile, competitive set, access and visibility, format fit, investment and payback profile, and the management cost a second site adds.',
    descAr:
      'طريقة منهجية لمقارنة المواقع المرشحة بالمعايير نفسها لا بالحماس: ملف النطاق، والمجموعة التنافسية، والوصول والظهور، وملاءمة الصيغة، وملف الاستثمار والاسترداد، والتكلفة الإدارية التي يضيفها فرع ثانٍ.',
    includes: b(
      ['Site scoring criteria', 'معايير تقييم الموقع'],
      ['Catchment comparison grid', 'شبكة مقارنة النطاقات'],
      ['Format fit assessment', 'تقييم ملاءمة الصيغة'],
      ['Investment and payback outline', 'مخطط الاستثمار والاسترداد'],
    ),
    audience: b(
      ['Owners evaluating sites', 'الملاك عند تقييم المواقع'],
      ['Expansion and development managers', 'مديرو التوسع والتطوير'],
    ),
    tags: ['expansion', 'feasibility', 'checklist'],
  },
  {
    slug: 'expansion-readiness-assessment',
    type: 'PDF',
    category: 'growth-expansion',
    titleEn: 'Expansion Readiness Assessment',
    titleAr: 'تقييم الجاهزية للتوسع',
    summaryEn: 'One question, scored honestly: could someone who did not build the first site run the second one from your documents?',
    summaryAr: 'سؤال واحد يُقيَّم بصدق: هل يستطيع من لم يبنِ الفرع الأول أن يدير الثاني من وثائقك؟',
    descEn:
      'A readiness score across documentation, training transfer, supplier scalability, management depth and reporting comparability — with the gaps listed as a work plan rather than a verdict.',
    descAr:
      'درجة جاهزية عبر التوثيق وانتقال التدريب وقابلية الموردين للتوسع وعمق الإدارة وقابلية التقارير للمقارنة، مع سرد الفجوات كخطة عمل لا كحكم.',
    includes: b(
      ['Documentation completeness score', 'درجة اكتمال التوثيق'],
      ['Training transfer test', 'اختبار انتقال التدريب'],
      ['Supplier and management readiness', 'جاهزية الموردين والإدارة'],
      ['Gap list as a work plan', 'قائمة الفجوات كخطة عمل'],
    ),
    audience: b(
      ['Owners considering expansion', 'الملاك عند التفكير في التوسع'],
      ['Operations directors', 'مديرو التشغيل'],
    ),
    tags: ['expansion', 'readiness', 'assessment'],
  },
  {
    slug: 'brand-and-digital-presence-audit',
    type: 'PDF',
    category: 'brand-experience',
    titleEn: 'Brand & Digital Presence Audit',
    titleAr: 'تدقيق العلامة والحضور الرقمي',
    summaryEn: 'Every surface a guest meets before arriving — listing, photos, menu, website, hours, reviews — checked for accuracy before anything else.',
    summaryAr: 'كل سطح يلتقيه الضيف قبل الوصول — القائمة المعروضة والصور والقائمة والموقع والساعات والتقييمات — يُفحص للدقة قبل أي شيء آخر.',
    descEn:
      'Audit the pre-arrival experience: whether hours are correct today, whether the menu is readable on a phone in both languages, whether the map link works, what the listing photography promises, and whether the brand reads as one thing across every surface.',
    descAr:
      'دقّق تجربة ما قبل الوصول: هل الساعات صحيحة اليوم، وهل القائمة مقروءة على الهاتف باللغتين، وهل رابط الخريطة يعمل، وبماذا تعد صور القائمة المعروضة، وهل تُقرأ العلامة كشيء واحد عبر كل سطح.',
    includes: b(
      ['Listing and map accuracy checks', 'فحوصات دقة القوائم المعروضة والخرائط'],
      ['Website task-completion timing', 'توقيت إنجاز مهام الموقع'],
      ['Bilingual consistency checks', 'فحوصات الاتساق بين اللغتين'],
      ['Photography and expectation review', 'مراجعة الصور والتوقعات'],
      ['Review sentiment themes', 'أنماط انطباع التقييمات'],
    ),
    audience: b(
      ['Owners and marketing managers', 'الملاك ومديرو التسويق'],
      ['Anyone preparing a brand refresh', 'كل من يحضّر لتحديث العلامة'],
    ),
    tags: ['brand', 'digital', 'audit'],
  },
];
