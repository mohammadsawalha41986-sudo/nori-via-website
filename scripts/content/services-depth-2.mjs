/**
 * Depth layer, part two: the menu, profitability and growth practices that
 * shipped with a body but without the commercial framing, benefits, process
 * or FAQs the service page renders.
 *
 * Same rules as part one: no client, no figure, no result. Numbers appear only
 * as definitions of a method.
 */

/** Menu and product economics. */
const MENU = [
  {
    slug: 'menu-development',
    whyEn:
      'A menu grows by addition and almost never by subtraction, until it is too long to cook well, too broad to buy well, and too crowded for a guest to read. Development is as much about what leaves as what arrives.',
    whyAr:
      'تنمو القائمة بالإضافة ونادراً ما تنمو بالحذف، حتى تصير أطول من أن تُطهى جيداً، وأوسع من أن تُشترى بكفاءة، وأزحم من أن يقرأها الضيف. وتطوير القائمة يتعلق بما يخرج منها بقدر ما يتعلق بما يدخل.',
    benefits: [
      ['A menu sized to the kitchen that has to produce it', 'قائمة بحجم المطبخ الذي عليه إنتاجها'],
      ['New items costed before they are launched', 'أصناف جديدة تُحسب تكلفتها قبل إطلاقها'],
      ['Shared preparation planned to control waste', 'تحضيرات مشتركة مخططة لضبط الهدر'],
      ['A written case for every item that is retired', 'مبرر مكتوب لكل صنف يُسحب'],
    ],
    process: [
      ['Review', 'المراجعة', 'The current list read against sales, cost and kitchen load.', 'قراءة القائمة الحالية مقابل المبيعات والتكلفة وحمل المطبخ.'],
      ['Concept', 'التصور', 'Gaps and additions defined by category, not by inspiration.', 'تحديد الفجوات والإضافات حسب التصنيف لا حسب الإلهام.'],
      ['Develop', 'التطوير', 'Recipes built, costed and tested at service volume.', 'بناء الوصفات وحساب تكلفتها واختبارها بحجم الخدمة.'],
      ['Launch', 'الإطلاق', 'Training, specification sheets and a review date set.', 'تدريب وأوراق مواصفات وتاريخ مراجعة محدد.'],
    ],
    faqs: [
      ['Will you change our recipes?', 'هل ستغيرون وصفاتنا؟', 'Only where cost, consistency or kitchen load require it, and always with the kitchen rather than around it.', 'فقط حيث تفرض التكلفة أو الاتساق أو حمل المطبخ ذلك، ودائماً مع المطبخ لا بمعزل عنه.'],
      ['How many items should a menu have?', 'كم صنفاً ينبغي أن تضم القائمة؟', 'There is no universal number. The right size is what your kitchen can execute consistently at peak and your purchasing can support without waste.', 'لا يوجد رقم عام. الحجم الصحيح هو ما يستطيع مطبخك تنفيذه باتساق في الذروة وما يحتمله شراؤك دون هدر.'],
    ],
  },
  {
    slug: 'menu-engineering',
    whyEn:
      'Every item sits somewhere on two axes: how often it is ordered, and what it contributes after food cost. Most menus are managed on the first axis alone, which is how a popular item can quietly cost the business money.',
    whyAr:
      'يقع كل صنف على محورين: كم مرة يُطلب، وكم يساهم بعد تكلفة الطعام. وتُدار معظم القوائم على المحور الأول وحده، وهكذا يمكن لصنف رائج أن يكلّف المشروع مالاً بهدوء.',
    benefits: [
      ['Every item placed on popularity and contribution', 'وضع كل صنف على محوري الإقبال والمساهمة'],
      ['A keep, rework, reprice or retire decision per item', 'قرار لكل صنف: إبقاء أو تطوير أو إعادة تسعير أو سحب'],
      ['Category-level reading, not just item-level', 'قراءة على مستوى التصنيف لا الصنف فقط'],
      ['A re-measurement plan so the change can be judged', 'خطة إعادة قياس ليُحكم على التغيير'],
    ],
    process: [
      ['Data', 'البيانات', 'Sales quantity, price and item cost for a full period.', 'كمية المبيعات والسعر وتكلفة الصنف لفترة كاملة.'],
      ['Matrix', 'المصفوفة', 'Items placed by popularity and contribution margin.', 'ترتيب الأصناف حسب الإقبال وهامش المساهمة.'],
      ['Actions', 'الإجراءات', 'A written decision and a reason for every item.', 'قرار مكتوب وسبب لكل صنف.'],
      ['Re-measure', 'إعادة القياس', 'The same analysis repeated after the change lands.', 'إعادة التحليل نفسه بعد تطبيق التغيير.'],
    ],
    faqs: [
      ['How much sales history do you need?', 'كم من تاريخ المبيعات تحتاجون؟', 'A period long enough to be representative and free of unusual events — a full trading cycle including weekends and any seasonal pattern.', 'فترة طويلة بما يكفي لتكون ممثِّلة وخالية من الأحداث الاستثنائية: دورة تشغيل كاملة تشمل نهايات الأسبوع وأي نمط موسمي.'],
      ['Is engineering the same as redesigning the menu?', 'هل الهندسة هي إعادة تصميم القائمة؟', 'No. Engineering decides what belongs and at what price; design decides how it is presented. They work best in that order.', 'لا. الهندسة تقرر ما ينتمي إلى القائمة وبأي سعر، والتصميم يقرر كيف يُعرض، والأفضل أن يأتيا بهذا الترتيب.'],
    ],
  },
  {
    slug: 'menu-pricing',
    whyEn:
      'Pricing is usually set once, then inherited. Costs move, competitors move and channels multiply, so a price that was right at opening is rarely still right two years later.',
    whyAr:
      'يُحدد التسعير عادة مرة واحدة ثم يُتوارث. لكن التكاليف تتحرك والمنافسون يتحركون والقنوات تتعدد، فالسعر الصحيح عند الافتتاح نادراً ما يبقى صحيحاً بعد عامين.',
    benefits: [
      ['Prices modelled from cost, not copied from neighbours', 'أسعار تُنمذج من التكلفة لا تُنسخ من الجوار'],
      ['Separate models for dine-in and delivery', 'نماذج منفصلة لداخل الفرع وللتوصيل'],
      ['Psychological thresholds handled deliberately', 'التعامل المقصود مع العتبات السعرية النفسية'],
      ['A staged plan rather than one visible jump', 'خطة تدريجية بدل قفزة واحدة ظاهرة'],
    ],
    process: [
      ['Cost base', 'قاعدة التكلفة', 'Current item costs verified before any price is moved.', 'التحقق من تكاليف الأصناف الحالية قبل تحريك أي سعر.'],
      ['Position', 'التموضع', 'Category price bands read against the local set.', 'قراءة نطاقات أسعار التصنيفات مقابل السوق المحلي.'],
      ['Model', 'النمذجة', 'Margin impact modelled per item and per channel.', 'نمذجة أثر الهامش لكل صنف ولكل قناة.'],
      ['Stage', 'التدريج', 'Sequenced changes with a review point after each.', 'تغييرات متتابعة مع نقطة مراجعة بعد كل مرحلة.'],
    ],
    faqs: [
      ['Will raising prices lose guests?', 'هل يفقدنا رفع الأسعار ضيوفاً؟', 'Some movement is normal. Sequencing, category choice and menu presentation decide whether it is noticed as a price rise or absorbed as a normal update.', 'بعض الحركة أمر طبيعي. والتدرج واختيار التصنيفات وطريقة عرض القائمة هي ما يحدد إن كان الأمر سيُقرأ كرفع أسعار أم يُستوعب كتحديث معتاد.'],
      ['Should delivery prices match dine-in?', 'هل يجب أن تساوي أسعار التوصيل أسعار الصالة؟', 'Rarely, once commission and packaging are counted. Matching them is one of the most common ways a venue loses money on delivery.', 'نادراً، بعد احتساب العمولة والتغليف. ومطابقتها من أشيع أسباب خسارة المطاعم في التوصيل.'],
    ],
  },
  {
    slug: 'recipe-costing',
    whyEn:
      'Without a costed recipe there is no reliable food cost, no defensible price and no way to tell whether a supplier increase has reached the plate. It is the foundation every other number rests on.',
    whyAr:
      'بلا وصفة محسوبة التكلفة لا توجد تكلفة طعام موثوقة ولا سعر يمكن الدفاع عنه ولا وسيلة لمعرفة ما إذا كانت زيادة المورّد قد وصلت إلى الطبق. إنها الأساس الذي تقوم عليه كل الأرقام الأخرى.',
    benefits: [
      ['A costed sheet for every item on the menu', 'ورقة تكلفة لكل صنف في القائمة'],
      ['Yield and waste factored rather than ignored', 'احتساب نسب الاستخلاص والهدر بدل تجاهلها'],
      ['A structure your team can update when prices move', 'هيكل يستطيع فريقك تحديثه عند تغير الأسعار'],
      ['Portion specifications tied to each cost', 'مواصفات حصص مرتبطة بكل تكلفة'],
    ],
    process: [
      ['Collect', 'الجمع', 'Recipes, purchase prices, pack sizes and yields.', 'الوصفات وأسعار الشراء وأحجام العبوات ونسب الاستخلاص.'],
      ['Build', 'البناء', 'A costing sheet per item, including sub-recipes.', 'ورقة تكلفة لكل صنف تشمل الوصفات الفرعية.'],
      ['Verify', 'التحقق', 'Sheets checked against actual plating in the kitchen.', 'مطابقة الأوراق مع التقديم الفعلي في المطبخ.'],
      ['Hand over', 'التسليم', 'A maintainable model plus a short update routine.', 'نموذج قابل للصيانة مع روتين تحديث مختصر.'],
    ],
    faqs: [
      ['We do not have written recipes. Can you still help?', 'ليست لدينا وصفات مكتوبة، هل يمكنكم المساعدة؟', 'Yes. Writing them down is part of the work, and it is usually the most valuable part.', 'نعم. كتابتها جزء من العمل، وغالباً هو الجزء الأكثر قيمة.'],
      ['How often should costs be updated?', 'كم مرة تُحدَّث التكاليف؟', 'At every meaningful supplier change, and on a fixed periodic review so drift is caught before it reaches the margin.', 'عند كل تغيير مؤثر من المورّد، وضمن مراجعة دورية ثابتة ليُلتقط الانحراف قبل أن يصل إلى الهامش.'],
    ],
  },
  {
    slug: 'food-cost-analysis',
    whyEn:
      'Theoretical food cost is what the recipes say you should have spent. Actual food cost is what you did. The gap between them is where portioning, waste, theft and purchasing errors live.',
    whyAr:
      'تكلفة الطعام النظرية هي ما تقوله الوصفات إنك كان يجب أن تنفقه، والفعلية هي ما أنفقته. والفجوة بينهما هي موضع أخطاء الحصص والهدر والفاقد وأخطاء الشراء.',
    benefits: [
      ['Theoretical and actual cost calculated side by side', 'حساب التكلفة النظرية والفعلية جنباً إلى جنب'],
      ['The variance broken down by likely cause', 'تفكيك الفارق حسب السبب المرجح'],
      ['Category-level reading so effort goes where it pays', 'قراءة على مستوى التصنيف لتوجيه الجهد حيث يجدي'],
      ['A control routine the team runs without us', 'روتين ضبط يديره الفريق دون وجودنا'],
    ],
    process: [
      ['Baseline', 'خط الأساس', 'Purchases, stock movement and sales for the period.', 'المشتريات وحركة المخزون والمبيعات للفترة.'],
      ['Theoretical', 'النظري', 'What the sales mix should have consumed.', 'ما كان ينبغي أن يستهلكه مزيج المبيعات.'],
      ['Variance', 'الفارق', 'The gap isolated and attributed by category.', 'عزل الفجوة ونسبها إلى التصنيفات.'],
      ['Controls', 'الضوابط', 'Portioning, receiving and stock routines that close it.', 'روتين الحصص والاستلام والمخزون الذي يغلقها.'],
    ],
    faqs: [
      ['What is a good food cost percentage?', 'ما نسبة تكلفة الطعام الجيدة؟', 'It is concept-dependent and not a target in itself. A ratio that looks healthy on a menu nobody orders is worth less than a higher one on items that contribute.', 'تعتمد على المفهوم وليست هدفاً بذاتها. فالنسبة التي تبدو صحية على قائمة لا يطلبها أحد أقل قيمة من نسبة أعلى على أصناف تساهم فعلاً.'],
      ['Do we need a stock count for this?', 'هل نحتاج جرد مخزون لذلك؟', 'Yes — without opening and closing stock the actual figure is an estimate, and the variance cannot be read.', 'نعم، فبلا مخزون افتتاحي وختامي يبقى الرقم الفعلي تقديراً ولا يمكن قراءة الفارق.'],
    ],
  },
];

/** Profitability, control and growth. */
const GROWTH = [
  {
    slug: 'restaurant-consulting',
    whyEn:
      'Most operators know something is wrong before they know where. A structured review separates the symptom that is visible from the cause that is not, so effort is spent once rather than three times.',
    whyAr:
      'يعرف معظم المشغّلين أن هناك خللاً قبل أن يعرفوا أين هو. والمراجعة المنظمة تفصل العَرَض الظاهر عن السبب الخفي، فيُبذل الجهد مرة واحدة بدل ثلاث.',
    benefits: [
      ['A single view across menu, cost, service and marketing', 'رؤية واحدة تشمل القائمة والتكلفة والخدمة والتسويق'],
      ['Findings ranked by impact and by effort', 'نتائج مرتبة حسب الأثر والجهد'],
      ['A sequenced plan instead of a list of everything', 'خطة متتابعة بدل قائمة بكل شيء'],
      ['Owners and review dates attached to each action', 'مسؤول وتاريخ مراجعة لكل إجراء'],
    ],
    process: [
      ['Discovery', 'الاستكشاف', 'Numbers, menu, site visit and management conversation.', 'الأرقام والقائمة وزيارة الموقع والحوار مع الإدارة.'],
      ['Diagnosis', 'التشخيص', 'Symptoms separated from causes, with evidence for each.', 'فصل الأعراض عن الأسباب مع دليل لكل منها.'],
      ['Plan', 'الخطة', 'Actions sequenced by impact, effort and dependency.', 'إجراءات مرتبة حسب الأثر والجهد والتسلسل.'],
      ['Support', 'المتابعة', 'Review points through implementation, if wanted.', 'نقاط مراجعة أثناء التنفيذ عند الرغبة.'],
    ],
    faqs: [
      ['Do you work with pre-opening businesses?', 'هل تعملون مع مشاريع قبل الافتتاح؟', 'Yes, though pre-opening work is closer to concept development and feasibility than to a performance review.', 'نعم، وإن كان العمل قبل الافتتاح أقرب إلى تطوير المفهوم ودراسة الجدوى منه إلى مراجعة الأداء.'],
      ['Will you tell us things we do not want to hear?', 'هل ستخبروننا بما لا نرغب في سماعه؟', 'That is the point of hiring an outside view. Findings are written with evidence so they can be argued with rather than simply accepted or dismissed.', 'هذا هو الغرض من الاستعانة برأي خارجي. تُكتب النتائج بأدلة ليمكن مناقشتها بدل قبولها أو رفضها بلا نقاش.'],
    ],
  },
  {
    slug: 'cost-control',
    whyEn:
      'Cost control is a routine, not a project. Purchasing, receiving, storage, portioning and waste each leak slowly, and none of them shows up as a single dramatic number on the P&L.',
    whyAr:
      'ضبط التكاليف روتين لا مشروع. فالشراء والاستلام والتخزين والحصص والهدر يتسرب كل منها ببطء، ولا يظهر أي منها كرقم واحد صارخ في قائمة الأرباح والخسائر.',
    benefits: [
      ['Written procedures for receiving and storage', 'إجراءات مكتوبة للاستلام والتخزين'],
      ['Portion specifications the kitchen can hold to', 'مواصفات حصص يستطيع المطبخ الالتزام بها'],
      ['A waste log that produces decisions, not paperwork', 'سجل هدر ينتج قرارات لا أوراقاً'],
      ['A stock-count routine sized to the operation', 'روتين جرد مقاس على حجم التشغيل'],
    ],
    process: [
      ['Observe', 'الملاحظة', 'The current routine watched in service, not described.', 'مراقبة الروتين الحالي أثناء الخدمة لا وصفه.'],
      ['Quantify', 'القياس', 'Where the loss is, and roughly how much it is worth.', 'أين الخسارة وكم تساوي تقريباً.'],
      ['Design', 'التصميم', 'Procedures written for the team that will run them.', 'إجراءات تُكتب للفريق الذي سينفذها.'],
      ['Embed', 'الترسيخ', 'Training, a checklist and a review cadence.', 'تدريب وقائمة تحقق وإيقاع مراجعة.'],
    ],
    faqs: [
      ['Is this only for large operations?', 'هل هذا للعمليات الكبيرة فقط؟', 'No. Smaller venues often leak proportionally more, because nothing is written down and everything depends on one person.', 'لا. غالباً ما تتسرب المطاعم الصغيرة نسبياً أكثر، لأن لا شيء مكتوب وكل شيء يعتمد على شخص واحد.'],
      ['Will staff resist the routine?', 'هل سيقاوم الفريق الروتين؟', 'Less than expected when the procedure is short, written in their language, and explained by its purpose rather than imposed.', 'أقل من المتوقع حين يكون الإجراء قصيراً ومكتوباً بلغتهم ومشروحاً بغرضه لا مفروضاً.'],
    ],
  },
  {
    slug: 'profitability-analysis',
    whyEn:
      'Revenue is the number everyone watches and the one that explains least. Contribution by item, daypart and channel is what tells you which parts of the business are funding the others.',
    whyAr:
      'الإيراد هو الرقم الذي يراقبه الجميع وأقلها تفسيراً. أما المساهمة حسب الصنف والوقت والقناة فهي ما يخبرك أي أجزاء المشروع تموّل بقيته.',
    benefits: [
      ['Contribution read by item, daypart and channel', 'قراءة المساهمة حسب الصنف والوقت والقناة'],
      ['Delivery economics separated from dine-in', 'فصل اقتصاديات التوصيل عن الصالة'],
      ['Fixed and variable cost behaviour made explicit', 'توضيح سلوك التكاليف الثابتة والمتغيرة'],
      ['A short list of the changes that matter most', 'قائمة قصيرة بالتغييرات الأكثر أثراً'],
    ],
    process: [
      ['Assemble', 'التجميع', 'Sales, costs and channel data brought into one model.', 'جمع المبيعات والتكاليف وبيانات القنوات في نموذج واحد.'],
      ['Segment', 'التقسيم', 'Contribution calculated across each dimension.', 'حساب المساهمة عبر كل بُعد.'],
      ['Interpret', 'التفسير', 'What is funding what, written plainly.', 'ما الذي يموّل ماذا، مكتوباً بوضوح.'],
      ['Act', 'العمل', 'A ranked set of changes with expected direction.', 'مجموعة تغييرات مرتبة مع اتجاه أثر متوقع.'],
    ],
    faqs: [
      ['Is this the same as reading our P&L?', 'هل هذا مثل قراءة قائمة الأرباح والخسائر لدينا؟', 'No. A P&L tells you the result. This tells you which parts of the operation produced it.', 'لا. قائمة الأرباح والخسائر تخبرك بالنتيجة، وهذا يخبرك أي أجزاء التشغيل أنتجتها.'],
      ['What if our data is incomplete?', 'ماذا لو كانت بياناتنا ناقصة؟', 'We work with what exists, label every assumption, and tell you which conclusions the gaps make weaker.', 'نعمل بالمتاح ونوسم كل افتراض ونخبرك أي الاستنتاجات تضعفها تلك الفجوات.'],
    ],
  },
  {
    slug: 'performance-analysis',
    whyEn:
      'Most venues track more numbers than they use and fewer than they need. A small, stable set of measures — read on the same cadence, defined the same way — is worth more than a dashboard nobody opens.',
    whyAr:
      'تتابع معظم المطاعم أرقاماً أكثر مما تستخدم وأقل مما تحتاج. ومجموعة صغيرة ثابتة من المقاييس تُقرأ بالإيقاع نفسه وتُعرَّف بالطريقة نفسها أثمن من لوحة مؤشرات لا يفتحها أحد.',
    benefits: [
      ['A short KPI set defined once and held stable', 'مجموعة مؤشرات قصيرة تُعرَّف مرة وتثبت'],
      ['A reporting cadence that matches decision-making', 'إيقاع تقارير يوازي إيقاع اتخاذ القرار'],
      ['Trend reading rather than month-to-month reaction', 'قراءة الاتجاه بدل رد الفعل الشهري'],
      ['A written interpretation attached to every report', 'تفسير مكتوب مرافق لكل تقرير'],
    ],
    process: [
      ['Define', 'التعريف', 'Which measures matter here, and exactly how each is calculated.', 'أي المقاييس مهم هنا وكيف يُحسب كل منها بدقة.'],
      ['Instrument', 'التجهيز', 'Sources connected so the numbers arrive without manual work.', 'ربط المصادر لتصل الأرقام دون عمل يدوي.'],
      ['Report', 'التقرير', 'A fixed format read on a fixed cadence.', 'صيغة ثابتة تُقرأ بإيقاع ثابت.'],
      ['Review', 'المراجعة', 'A quarterly check that the set still answers the questions.', 'فحص ربع سنوي للتأكد أن المجموعة ما زالت تجيب الأسئلة.'],
    ],
    faqs: [
      ['How many KPIs should we track?', 'كم مؤشراً ينبغي أن نتابع؟', 'Few enough that the whole set can be read in one sitting and each one has an owner who can act on it.', 'قليلة بما يكفي لقراءة المجموعة كاملة في جلسة واحدة، ولكل منها مسؤول يستطيع التصرف بناء عليها.'],
      ['Do you build the dashboard?', 'هل تبنون لوحة المؤشرات؟', 'We define and structure it. Where a spreadsheet is enough, we say so rather than recommend a tool you do not need.', 'نحن نعرّفها ونبني هيكلها. وحيث يكفي جدول بيانات نقول ذلك بدل التوصية بأداة لا تحتاجها.'],
    ],
  },
  {
    slug: 'growth-strategy',
    whyEn:
      'Doing everything at once is the most reliable way for a healthy venue to run out of cash. Growth is a sequencing problem before it is an ambition problem.',
    whyAr:
      'فعل كل شيء دفعة واحدة أضمن طريقة لينفد النقد من مطعم سليم. النمو مسألة ترتيب أولويات قبل أن يكون مسألة طموح.',
    benefits: [
      ['Growth options sized before they are chosen', 'تقدير حجم خيارات النمو قبل اختيارها'],
      ['A twelve-month sequence with dependencies made explicit', 'تسلسل لاثني عشر شهراً بتبعيات واضحة'],
      ['Budget and ownership attached to each move', 'ميزانية ومسؤولية لكل خطوة'],
      ['A quarterly review rhythm built into the plan', 'إيقاع مراجعة ربع سنوي مدمج في الخطة'],
    ],
    process: [
      ['Baseline', 'خط الأساس', 'Where the business is, in numbers rather than impressions.', 'أين المشروع، بالأرقام لا بالانطباعات.'],
      ['Options', 'الخيارات', 'Each growth route sized for cost, risk and capacity.', 'تقدير كل مسار نمو من حيث التكلفة والمخاطر والطاقة.'],
      ['Sequence', 'التسلسل', 'The order that keeps cash and operations intact.', 'الترتيب الذي يحافظ على النقد والتشغيل.'],
      ['Govern', 'الحوكمة', 'Review points where the plan can be changed on evidence.', 'نقاط مراجعة يمكن عندها تعديل الخطة بناء على الأدلة.'],
    ],
    faqs: [
      ['Is a second branch always the answer?', 'هل الفرع الثاني هو الجواب دائماً؟', 'No, and it is the most expensive way to find out it was not. Capacity, delivery and menu often carry more growth at less risk.', 'لا، وهو أغلى طريقة لاكتشاف أنه لم يكن كذلك. فالطاقة الاستيعابية والتوصيل والقائمة تحمل غالباً نمواً أكبر بمخاطر أقل.'],
      ['How far ahead should we plan?', 'إلى أي مدى نخطط؟', 'Twelve months in detail, with the following year sketched. Beyond that, conditions change faster than the plan is worth.', 'اثنا عشر شهراً بالتفصيل مع رسم تقريبي للعام التالي. وما بعد ذلك تتغير الظروف أسرع من قيمة الخطة.'],
    ],
  },
];

/** Studio-era practices retained in the catalogue. */
const STUDIO = [
  {
    slug: 'brand-strategy-identity',
    category: 'brand-customer-experience',
    whyEn:
      'A concept that cannot be described in one sentence will be described differently by every person who works on it — and by every guest who tries to recommend it.',
    whyAr:
      'المفهوم الذي لا يمكن وصفه في جملة واحدة سيصفه كل من يعمل عليه بطريقة مختلفة، وكذلك كل ضيف يحاول أن يوصي به.',
    benefits: [
      ['A written positioning the whole team can repeat', 'تموضع مكتوب يستطيع الفريق كله ترديده'],
      ['An identity system rather than a set of files', 'نظام هوية لا مجرد مجموعة ملفات'],
      ['Bilingual naming and voice decided deliberately', 'قرار مقصود في التسمية والصوت باللغتين'],
      ['Applications proven on the surfaces guests see', 'تطبيقات مُثبتة على الأسطح التي يراها الضيف'],
    ],
    process: [
      ['Interrogate', 'الاستقصاء', 'The market, the offer and the audience examined together.', 'فحص السوق والعرض والجمهور معاً.'],
      ['Position', 'التموضع', 'One sentence, defended against the obvious alternatives.', 'جملة واحدة يُدافَع عنها أمام البدائل الواضحة.'],
      ['Express', 'التعبير', 'Identity, voice and image direction built from it.', 'الهوية والصوت واتجاه الصورة تُبنى منها.'],
      ['Apply', 'التطبيق', 'The system taken to the surfaces that matter first.', 'نقل النظام إلى الأسطح الأهم أولاً.'],
    ],
    faqs: [
      ['Is positioning worth it for a single venue?', 'هل يستحق التموضع العناء لفرع واحد؟', 'Yes — a single venue has fewer chances to be misunderstood and less budget to correct it later.', 'نعم، فالفرع الواحد لديه فرص أقل ليُساء فهمه وميزانية أقل لتصحيح ذلك لاحقاً.'],
      ['How long does it take?', 'كم يستغرق ذلك؟', 'It depends on how much is already decided. The slowest part is agreement, not design.', 'يعتمد على ما هو محسوم مسبقاً. والجزء الأبطأ هو الاتفاق لا التصميم.'],
    ],
  },
  {
    slug: 'digital-product-web',
    category: 'marketing-advertising',
    whyEn:
      'For most F&B businesses the website is not a brochure; it is the place a guest checks the menu, the hours and the location before deciding. Slow, unclear or out of date costs covers directly.',
    whyAr:
      'الموقع الإلكتروني لمعظم مشاريع الأغذية والمشروبات ليس كتيّباً تعريفياً، بل المكان الذي يتحقق فيه الضيف من القائمة وساعات العمل والموقع قبل أن يقرر. والبطء أو الغموض أو قِدَم المعلومة يكلّف طلبات مباشرة.',
    benefits: [
      ['Menu, hours and location reachable in one step', 'القائمة وساعات العمل والموقع في خطوة واحدة'],
      ['Arabic and English built as equals, not as a toggle', 'العربية والإنجليزية تُبنيان متكافئتين لا كزرّ تبديل'],
      ['Content editable by your team without a developer', 'محتوى قابل للتعديل من فريقك دون مطوّر'],
      ['Technical SEO and structured data handled at build', 'التحسين التقني والبيانات المهيكلة تُعالج أثناء البناء'],
    ],
    process: [
      ['Define', 'التحديد', 'The handful of tasks a visitor actually comes to do.', 'المهام القليلة التي يأتي الزائر فعلاً لأدائها.'],
      ['Structure', 'الهيكلة', 'Content model and navigation shaped around those tasks.', 'نموذج المحتوى والتنقل يُبنيان حول تلك المهام.'],
      ['Build', 'البناء', 'Performance, accessibility and both languages tested throughout.', 'اختبار الأداء وإتاحة الوصول واللغتين طوال البناء.'],
      ['Hand over', 'التسليم', 'Editor training so the site stays current.', 'تدريب المحرر ليبقى الموقع محدّثاً.'],
    ],
    faqs: [
      ['Do we need a website if we are on delivery apps?', 'هل نحتاج موقعاً ونحن على تطبيقات التوصيل؟', 'Yes. Aggregator listings are rented attention on someone else’s terms; a site is the one channel where the margin and the relationship are yours.', 'نعم. فقوائم التطبيقات انتباه مستأجر بشروط غيرك، أما الموقع فهو القناة الوحيدة التي يكون فيها الهامش والعلاقة لك.'],
      ['Can you update our existing site instead?', 'هل يمكن تحديث موقعنا الحالي بدلاً من ذلك؟', 'Often yes, and we will say so when a rebuild is not justified.', 'غالباً نعم، وسنقول ذلك حين لا يكون إعادة البناء مبرراً.'],
    ],
  },
  {
    slug: 'content-production',
    category: 'marketing-social',
    whyEn:
      'Production capacity, not ideas, is what limits most content plans. A programme that produces reliably beats a brilliant plan the team cannot execute twice.',
    whyAr:
      'ما يحدّ معظم خطط المحتوى هو الطاقة الإنتاجية لا الأفكار. والبرنامج الذي ينتج بانتظام يتفوق على خطة لامعة لا يستطيع الفريق تنفيذها مرتين.',
    benefits: [
      ['A recurring production cycle rather than one-off shoots', 'دورة إنتاج متكررة بدل تصوير متفرق'],
      ['Stills, motion and copy produced in one pass', 'صور وفيديو ونصوص تُنتج في مسار واحد'],
      ['A tagged library your team can search', 'مكتبة مصنفة يستطيع فريقك البحث فيها'],
      ['Capacity planned against the publishing cadence', 'تخطيط الطاقة مقابل إيقاع النشر'],
    ],
    process: [
      ['Plan', 'التخطيط', 'A production calendar tied to the content plan.', 'تقويم إنتاج مرتبط بخطة المحتوى.'],
      ['Produce', 'الإنتاج', 'Batched sessions covering a full publishing period.', 'جلسات دفعية تغطي فترة نشر كاملة.'],
      ['Assemble', 'التجميع', 'Edits, crops, captions and versions prepared together.', 'المونتاج والقصاصات والنصوص والنسخ تُجهَّز معاً.'],
      ['Archive', 'الأرشفة', 'Everything named and tagged for reuse.', 'تسمية وتصنيف كل شيء لإعادة الاستخدام.'],
    ],
    faqs: [
      ['Can you train our team to produce?', 'هل يمكنكم تدريب فريقنا على الإنتاج؟', 'Yes. In many venues the right answer is a small in-house capability plus periodic professional production, not one or the other.', 'نعم. وفي كثير من المطاعم يكون الجواب الصحيح قدرة داخلية صغيرة إلى جانب إنتاج احترافي دوري، لا أحدهما فقط.'],
      ['How far ahead should content be produced?', 'إلى أي مدى يُنتج المحتوى مسبقاً؟', 'Far enough that a bad week never empties the calendar, close enough that it still reflects what is on the menu.', 'بما يكفي ألا يفرّغ أسبوع سيئ التقويم، وقريباً بما يكفي ليظل معبّراً عما في القائمة.'],
    ],
  },
  {
    slug: 'growth-performance',
    category: 'growth-profitability',
    whyEn:
      'Marketing performance and business performance are different questions, and answering only the first is how a venue ends up with excellent campaign reports and a difficult P&L.',
    whyAr:
      'أداء التسويق وأداء المشروع سؤالان مختلفان، والاكتفاء بالأول هو ما ينتهي بمطعم لديه تقارير حملات ممتازة وقائمة أرباح وخسائر صعبة.',
    benefits: [
      ['One frame covering acquisition and contribution', 'إطار واحد يغطي الاكتساب والمساهمة'],
      ['Cost per new guest read against repeat behaviour', 'قراءة تكلفة الضيف الجديد مقابل سلوك التكرار'],
      ['Channel decisions made on margin, not on volume', 'قرارات القنوات على أساس الهامش لا الحجم'],
      ['A monthly decision log, not just a report', 'سجل قرارات شهري لا مجرد تقرير'],
    ],
    process: [
      ['Frame', 'الإطار', 'The measures that connect marketing to the P&L.', 'المقاييس التي تربط التسويق بقائمة الأرباح والخسائر.'],
      ['Measure', 'القياس', 'Acquisition cost and contribution tracked together.', 'تتبع تكلفة الاكتساب والمساهمة معاً.'],
      ['Decide', 'القرار', 'Budget moved on evidence at a fixed cadence.', 'نقل الميزانية بناء على الأدلة بإيقاع ثابت.'],
      ['Review', 'المراجعة', 'A quarterly reset of targets and assumptions.', 'إعادة ضبط ربع سنوية للأهداف والافتراضات.'],
    ],
    faqs: [
      ['Do you need access to financial data?', 'هل تحتاجون الوصول إلى البيانات المالية؟', 'Item costs and channel commissions at minimum. Without them, marketing can only be judged on revenue.', 'تكاليف الأصناف وعمولات القنوات كحد أدنى. وبدونها لا يمكن الحكم على التسويق إلا بالإيراد.'],
      ['Is this a monthly engagement?', 'هل هذه خدمة شهرية؟', 'It works best as one, because the value comes from the cadence rather than from a single analysis.', 'تعمل على أفضل وجه كذلك، لأن القيمة تأتي من الإيقاع لا من تحليل واحد.'],
    ],
  },
  {
    slug: 'spatial-experience',
    category: 'brand-customer-experience',
    whyEn:
      'The room is the part of the brand a guest cannot scroll past. Flow, sound, light and signage shape the experience long before anything on the menu is tasted.',
    whyAr:
      'المكان هو الجزء من العلامة الذي لا يستطيع الضيف تجاوزه بالتمرير. فالانسيابية والصوت والإضاءة واللافتات تشكّل التجربة قبل تذوق أي شيء في القائمة.',
    benefits: [
      ['Guest flow mapped from arrival to departure', 'رسم مسار الضيف من الوصول إلى المغادرة'],
      ['Signage and wayfinding written in both languages', 'لافتات وإرشاد مكتوبة باللغتين'],
      ['Light, sound and material read as one decision', 'الإضاءة والصوت والمواد كقرار واحد'],
      ['Recommendations scoped to what can actually be changed', 'توصيات محددة بما يمكن تغييره فعلاً'],
    ],
    process: [
      ['Walk', 'الجولة', 'The venue experienced as a guest, at the times guests come.', 'اختبار المكان كضيف في الأوقات التي يأتي فيها الضيوف.'],
      ['Map', 'الرسم', 'Friction points located along the journey.', 'تحديد نقاط الاحتكاك على امتداد الرحلة.'],
      ['Design', 'التصميم', 'Changes proposed by impact and by cost to implement.', 'تغييرات مقترحة حسب الأثر وتكلفة التنفيذ.'],
      ['Support', 'المساندة', 'Specifications and supplier briefs for what is approved.', 'مواصفات ومواجيز للمورّدين لما يُعتمد.'],
    ],
    faqs: [
      ['Are you architects?', 'هل أنتم مهندسون معماريون؟', 'No. We work on experience, flow and brand expression, and coordinate with your architect or fit-out contractor rather than replacing them.', 'لا. نعمل على التجربة والانسيابية والتعبير عن العلامة وننسق مع مهندسك أو مقاول التجهيز بدل أن نحل محلهما.'],
      ['Can this be done without renovation?', 'هل يمكن ذلك دون تجديد؟', 'Often. Sequence, signage, light levels and sound account for a large share of perceived experience at modest cost.', 'غالباً نعم. فالترتيب واللافتات ومستويات الإضاءة والصوت تشكّل حصة كبيرة من التجربة المدركة بتكلفة متواضعة.'],
    ],
  },
];

export const SERVICE_DEPTH_PART_2 = [...MENU, ...GROWTH, ...STUDIO];
