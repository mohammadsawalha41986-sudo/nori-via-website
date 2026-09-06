/**
 * Depth layer, part three: the F&B catalogue services that shipped as a name,
 * a summary and an intake form. These need the full page body — hero
 * description, what we do, approach, deliverables — as well as the framing,
 * benefits, process and FAQs.
 *
 * They stay DRAFT unless the operator publishes them; nothing here changes a
 * publish status. No client, figure, award or result appears anywhere.
 */

export const SERVICE_DEPTH_PART_3 = [
  {
    slug: 'menu-strategy-engineering-pricing',
    whyEn:
      'The menu is the only document a guest is guaranteed to read and the only one that sets both revenue and cost at the same time. Treating it as a design artefact rather than a commercial one is the most expensive habit in the sector.',
    whyAr:
      'القائمة هي الوثيقة الوحيدة المضمون أن يقرأها الضيف، والوحيدة التي تحدد الإيراد والتكلفة في آن واحد. والتعامل معها كعمل تصميمي لا كوثيقة تجارية هو أغلى عادة في القطاع.',
    benefits: [
      ['Every item placed by popularity and by contribution', 'كل صنف موضوع حسب الإقبال والمساهمة'],
      ['A decision and a reason recorded per item', 'قرار وسبب مسجلان لكل صنف'],
      ['Dine-in and delivery priced as different businesses', 'تسعير الصالة والتوصيل كنشاطين مختلفين'],
      ['A re-measurement plan so change can be judged', 'خطة إعادة قياس ليُحكم على التغيير'],
    ],
  },

  /* --- F&B consulting & management ------------------------------------- */
  {
    slug: 'fnb-consulting',
    heroEn:
      'An outside reading of the whole business — concept, menu, operations, cost and market — written so it can be acted on rather than filed.',
    heroAr:
      'قراءة خارجية للمشروع كاملاً: المفهوم والقائمة والتشغيل والتكلفة والسوق، مكتوبة لتُنفَّذ لا لتُحفظ.',
    whatEn:
      'We take the business as a whole rather than as a department. The concept and its position in the local market, the menu and what each part of it earns, the operation and what it can sustain, the cost base and where it leaks, and the commercial picture the owner is actually managing against.\n\nThe engagement produces a diagnosis first: what is working, what is not, and which of the visible problems are symptoms of something else. Recommendations follow that diagnosis and are ranked, so a team with limited hours knows what to do first.',
    whatAr:
      'نتعامل مع المشروع ككل لا كإدارات منفصلة: المفهوم وموقعه في السوق المحلي، والقائمة وما يحققه كل جزء منها، والتشغيل وما يستطيع تحمله، وقاعدة التكاليف وأين تتسرب، والصورة التجارية التي يديرها المالك فعلياً.\n\nينتج العمل تشخيصاً أولاً: ما الذي ينجح وما الذي لا ينجح، وأي المشكلات الظاهرة هو عَرَض لشيء آخر. ثم تأتي التوصيات مرتّبة، ليعرف فريق محدود الساعات بماذا يبدأ.',
    apprEn:
      'Nothing is recommended without evidence behind it, and nothing is recommended that the operation cannot execute. Where the honest answer is that a problem is smaller than it looks, or that the money is better spent elsewhere, that is what the report says.',
    apprAr:
      'لا نوصي بشيء دون دليل خلفه، ولا نوصي بما لا يستطيع التشغيل تنفيذه. وحين تكون الإجابة الصادقة أن المشكلة أصغر مما تبدو، أو أن المال أجدى في موضع آخر، فذلك ما يقوله التقرير.',
    deliverables: [
      ['Business diagnostic report', 'تقرير تشخيصي للمشروع'],
      ['Concept and market position review', 'مراجعة المفهوم والتموضع في السوق'],
      ['Menu and product assessment', 'تقييم القائمة والمنتج'],
      ['Operational assessment', 'تقييم تشغيلي'],
      ['Cost structure review', 'مراجعة هيكل التكاليف'],
      ['Prioritised action plan', 'خطة عمل مرتبة حسب الأولوية'],
      ['Implementation sequence with owners', 'تسلسل تنفيذي بمسؤوليات محددة'],
    ],
    whyEn:
      'Operators rarely lack effort; they lack an outside reading of where the effort should go. A single view across concept, menu, cost and operations is what stops three departments each solving a different version of the same problem.',
    whyAr:
      'نادراً ما ينقص المشغّلين الجهد، بل تنقصهم قراءة خارجية لأين يجب أن يذهب الجهد. والرؤية الواحدة عبر المفهوم والقائمة والتكلفة والتشغيل هي ما يمنع ثلاث إدارات من حل ثلاث نسخ مختلفة للمشكلة نفسها.',
    benefits: [
      ['One diagnosis instead of several partial opinions', 'تشخيص واحد بدل عدة آراء جزئية'],
      ['Findings supported by your own numbers', 'نتائج مسنودة بأرقامك أنت'],
      ['Actions ranked by impact and by effort', 'إجراءات مرتبة حسب الأثر والجهد'],
      ['A plan sized to the team that has to run it', 'خطة بحجم الفريق الذي سينفذها'],
    ],
    process: [
      ['Discovery', 'الاستكشاف', 'Financials, menu, site visit and management interviews.', 'البيانات المالية والقائمة وزيارة الموقع ومقابلات الإدارة.'],
      ['Diagnosis', 'التشخيص', 'Causes separated from symptoms, each with evidence.', 'فصل الأسباب عن الأعراض مع دليل لكل منها.'],
      ['Recommendations', 'التوصيات', 'Ranked by impact, effort and dependency.', 'مرتبة حسب الأثر والجهد والتسلسل.'],
      ['Handover', 'التسليم', 'A working session so the plan leaves with the team.', 'جلسة عمل ليخرج الفريق بالخطة فعلاً.'],
    ],
    faqs: [
      ['How long does an engagement take?', 'كم يستغرق العمل؟', 'It follows the size of the operation and the state of the data. A single venue with clean records moves considerably faster than a multi-branch business without them.', 'يتبع حجم التشغيل وحالة البيانات. فالفرع الواحد بسجلات منظمة يتقدم أسرع بكثير من مشروع متعدد الفروع بلا سجلات.'],
      ['What do you need from us to start?', 'ما الذي تحتاجونه منا للبدء؟', 'Sales by item, item costs, a recent P&L if one exists, the current menu, and access to the venue during service.', 'المبيعات حسب الصنف، وتكاليف الأصناف، وقائمة أرباح وخسائر حديثة إن وُجدت، والقائمة الحالية، وإمكانية الوصول إلى المكان أثناء الخدمة.'],
    ],
  },
  {
    slug: 'cafe-consulting',
    heroEn:
      'Café economics behave differently from restaurant economics: smaller tickets, faster turns, a beverage margin that carries the business and a food offer that has to justify its space.',
    heroAr:
      'اقتصاديات المقاهي تختلف عن اقتصاديات المطاعم: فواتير أصغر، ودوران أسرع، وهامش مشروبات يحمل المشروع، وعرض طعام عليه أن يبرر المساحة التي يشغلها.',
    whatEn:
      'We review the café as the business it is rather than as a small restaurant. Beverage programme and specification, food offer and its role beside the drinks, ticket size and attachment, peak-hour throughput, seating and dwell time, and the cost base underneath all of it.\n\nThe work covers where the margin actually sits, which items justify their preparation time, and what the space can turn during the hours that matter.',
    whatAr:
      'نراجع المقهى بوصفه ما هو عليه لا مطعماً صغيراً: برنامج المشروبات ومواصفاته، وعرض الطعام ودوره إلى جانب المشروبات، وحجم الفاتورة ونسب الإضافات، والطاقة الاستيعابية في ساعات الذروة، والجلوس ومدة البقاء، وقاعدة التكاليف تحت كل ذلك.\n\nيغطي العمل أين يقع الهامش فعلاً، وأي الأصناف يبرر وقت تحضيره، وما تستطيع المساحة تحقيقه في الساعات المهمة.',
    apprEn:
      'Cafés live or die on repeat visits and on the hours between peaks. Recommendations are written against that reality rather than against a restaurant playbook applied at a smaller scale.',
    apprAr:
      'تعيش المقاهي أو تموت على الزيارات المتكررة وعلى الساعات بين الذروات. وتُكتب التوصيات وفق هذا الواقع لا وفق دليل مطاعم مطبّق بحجم أصغر.',
    deliverables: [
      ['Café performance review', 'مراجعة أداء المقهى'],
      ['Beverage programme assessment', 'تقييم برنامج المشروبات'],
      ['Food offer review', 'مراجعة عرض الطعام'],
      ['Ticket size and attachment analysis', 'تحليل حجم الفاتورة والإضافات'],
      ['Peak-hour throughput review', 'مراجعة الطاقة في ساعات الذروة'],
      ['Cost and pricing recommendations', 'توصيات التكلفة والتسعير'],
      ['Prioritised action plan', 'خطة عمل مرتبة حسب الأولوية'],
    ],
    whyEn:
      'Most café problems present as a slow afternoon and are actually a specification, attachment or throughput problem. Reading them as one thing is how a café ends up discounting instead of fixing.',
    whyAr:
      'تظهر معظم مشكلات المقاهي على شكل فترة بعد ظهر بطيئة، بينما هي في الحقيقة مشكلة مواصفات أو إضافات أو طاقة استيعابية. وقراءتها كشيء واحد هو ما ينتهي بالمقهى إلى التخفيضات بدل الإصلاح.',
    benefits: [
      ['Beverage margin examined item by item', 'فحص هامش المشروبات صنفاً صنفاً'],
      ['Attachment opportunities identified, not assumed', 'تحديد فرص الإضافات لا افتراضها'],
      ['Off-peak hours treated as a separate question', 'التعامل مع ساعات ما بين الذروات كسؤال منفصل'],
      ['Recommendations sized to a small team', 'توصيات بحجم فريق صغير'],
    ],
    process: [
      ['Observe', 'الملاحظة', 'Service watched across peak and off-peak hours.', 'مراقبة الخدمة في ساعات الذروة وما بينها.'],
      ['Analyse', 'التحليل', 'Ticket, mix, margin and preparation time reviewed together.', 'مراجعة الفاتورة والمزيج والهامش وزمن التحضير معاً.'],
      ['Recommend', 'التوصية', 'Changes to offer, specification, pricing and flow.', 'تغييرات في العرض والمواصفات والتسعير والانسيابية.'],
      ['Plan', 'الخطة', 'A short implementation sequence with review points.', 'تسلسل تنفيذي قصير بنقاط مراجعة.'],
    ],
    faqs: [
      ['We are a specialty café — does this apply?', 'نحن مقهى مختص، هل ينطبق هذا علينا؟', 'Yes, and specification discipline usually matters more there, because the guest can taste the difference a cost decision makes.', 'نعم، وغالباً ما يكون انضباط المواصفات أهم هناك، لأن الضيف يتذوق أثر قرار التكلفة.'],
      ['Can you help with the food offer only?', 'هل يمكنكم العمل على عرض الطعام فقط؟', 'Yes, though food and beverage decisions interact through preparation time and attachment, so we will flag anything the narrower scope misses.', 'نعم، وإن كانت قرارات الطعام والمشروبات تتفاعل عبر زمن التحضير والإضافات، وسننبّه إلى ما يفوته النطاق الأضيق.'],
    ],
  },
  {
    slug: 'management-advisory',
    heroEn:
      'A standing advisory relationship for owners and management teams: a second, independent reading of the decisions that carry real cost.',
    heroAr:
      'علاقة استشارية مستمرة للملاك وفرق الإدارة: قراءة ثانية مستقلة للقرارات التي تحمل تكلفة حقيقية.',
    whatEn:
      'We sit alongside the management team on a recurring cadence rather than delivering a single report. Monthly or quarterly reviews of performance, pressure-testing of decisions before they are committed, and support on the questions that fall between departments — pricing, capacity, hiring against forecast, channel economics and expansion timing.\n\nThe role is deliberately advisory. We do not take operational control, and we do not sign off on decisions that belong to the owner.',
    whatAr:
      'نعمل إلى جانب فريق الإدارة بإيقاع متكرر بدل تسليم تقرير واحد: مراجعات أداء شهرية أو ربع سنوية، واختبار القرارات قبل الالتزام بها، ودعم في الأسئلة الواقعة بين الإدارات — التسعير والطاقة الاستيعابية والتوظيف مقابل التوقعات واقتصاديات القنوات وتوقيت التوسع.\n\nالدور استشاري بقصد. لا نتولى السيطرة التشغيلية ولا نعتمد قرارات هي من صلاحية المالك.',
    apprEn:
      'The value of an advisory seat is candour on a schedule. Reviews are written, decisions are logged, and the same questions are asked each period so trends are visible rather than argued about.',
    apprAr:
      'قيمة المقعد الاستشاري هي الصراحة وفق جدول. تُكتب المراجعات وتُسجَّل القرارات وتُطرح الأسئلة نفسها كل فترة، فتصير الاتجاهات مرئية بدل أن تكون محل جدل.',
    deliverables: [
      ['Recurring management review', 'مراجعة إدارية دورية'],
      ['Performance reporting pack', 'حزمة تقارير الأداء'],
      ['Decision support notes', 'مذكرات دعم القرار'],
      ['Risk and dependency register', 'سجل المخاطر والتبعيات'],
      ['Quarterly priority reset', 'إعادة ضبط الأولويات ربع سنوياً'],
      ['Annual planning support', 'دعم التخطيط السنوي'],
    ],
    whyEn:
      'Owners are rarely short of opinions and often short of an independent one. A standing seat means the difficult question gets asked on a schedule instead of after the cost is already committed.',
    whyAr:
      'نادراً ما ينقص الملاك الآراء، وغالباً ما ينقصهم رأي مستقل. والمقعد الدائم يعني أن السؤال الصعب يُطرح وفق جدول بدل أن يُطرح بعد الالتزام بالتكلفة.',
    benefits: [
      ['A recurring, independent read of performance', 'قراءة دورية مستقلة للأداء'],
      ['Decisions pressure-tested before they are committed', 'اختبار القرارات قبل الالتزام بها'],
      ['Continuity between projects and departments', 'استمرارية بين المشاريع والإدارات'],
      ['A written record of what was decided and why', 'سجل مكتوب لما تقرر ولماذا'],
    ],
    process: [
      ['Onboard', 'التهيئة', 'Baseline the business, the numbers and the open questions.', 'تحديد خط الأساس للمشروع والأرقام والأسئلة المفتوحة.'],
      ['Cadence', 'الإيقاع', 'A fixed review rhythm agreed with management.', 'إيقاع مراجعة ثابت متفق عليه مع الإدارة.'],
      ['Review', 'المراجعة', 'Performance read and decisions tested each period.', 'قراءة الأداء واختبار القرارات كل فترة.'],
      ['Reset', 'إعادة الضبط', 'Priorities revisited quarterly against evidence.', 'مراجعة الأولويات ربع سنوياً وفق الأدلة.'],
    ],
    faqs: [
      ['Do you take an operational role?', 'هل تتولون دوراً تشغيلياً؟', 'No. This is advisory by design — we support decisions, we do not own them.', 'لا. الدور استشاري بقصد: ندعم القرارات ولا نملكها.'],
      ['Can this run alongside a project?', 'هل يمكن أن تعمل بالتوازي مع مشروع؟', 'Yes, and it often does. Advisory usually continues after a project ends, which is where most of its value shows.', 'نعم، وغالباً ما يحدث ذلك. تستمر الاستشارة عادة بعد انتهاء المشروع، وهناك تظهر معظم قيمتها.'],
    ],
  },
  {
    slug: 'fnb-audit',
    heroEn:
      'A structured audit of the whole operation — concept, menu, cost, service, marketing and financial control — delivered as findings with evidence, not impressions.',
    heroAr:
      'تدقيق منهجي للتشغيل كاملاً: المفهوم والقائمة والتكلفة والخدمة والتسويق والضبط المالي، يُسلَّم كنتائج مسنودة بالأدلة لا كانطباعات.',
    whatEn:
      'The audit runs to a fixed checklist so nothing is skipped because it was not raised. Concept clarity and market position; menu structure, costing and pricing; purchasing, receiving, storage and waste; kitchen and service flow; customer experience from arrival to payment; marketing presence and channel economics; and the financial controls that should catch problems before we do.\n\nEach finding is recorded with what was observed, why it matters and what it costs to leave as it is.',
    whatAr:
      'يسير التدقيق وفق قائمة تحقق ثابتة كي لا يُغفل شيء لمجرد أنه لم يُذكر: وضوح المفهوم والتموضع في السوق؛ وبنية القائمة وتكلفتها وتسعيرها؛ والشراء والاستلام والتخزين والهدر؛ وانسيابية المطبخ والخدمة؛ وتجربة العميل من الوصول إلى الدفع؛ والحضور التسويقي واقتصاديات القنوات؛ والضوابط المالية التي يفترض أن تلتقط المشكلات قبلنا.\n\nتُسجَّل كل نتيجة بما لوحظ ولماذا يهم وما تكلفة تركه كما هو.',
    apprEn:
      'An audit is only useful if it is uncomfortable in the right places. Findings are written plainly, ranked by cost of inaction, and separated clearly from opinion.',
    apprAr:
      'لا يفيد التدقيق إلا إذا كان مزعجاً في المواضع الصحيحة. تُكتب النتائج بوضوح وتُرتَّب حسب تكلفة التقاعس وتُفصل بجلاء عن الرأي.',
    deliverables: [
      ['Full audit report', 'تقرير تدقيق كامل'],
      ['Findings register with evidence', 'سجل نتائج مسنود بالأدلة'],
      ['Menu and costing review', 'مراجعة القائمة والتكلفة'],
      ['Operational observation notes', 'ملاحظات المعاينة التشغيلية'],
      ['Customer journey findings', 'نتائج رحلة العميل'],
      ['Risk-ranked correction plan', 'خطة تصحيح مرتبة حسب المخاطر'],
    ],
    whyEn:
      'Problems that everyone knows about are rarely the expensive ones. A fixed checklist finds what familiarity has made invisible, and puts a cost on leaving it alone.',
    whyAr:
      'نادراً ما تكون المشكلات التي يعرفها الجميع هي المكلفة. وقائمة التحقق الثابتة تكتشف ما أخفته الألفة وتضع تكلفة لتركه كما هو.',
    benefits: [
      ['Nothing skipped because nobody raised it', 'لا شيء يُغفل لمجرد أن أحداً لم يذكره'],
      ['Findings evidenced rather than asserted', 'نتائج بأدلة لا بادعاءات'],
      ['A cost of inaction attached to each item', 'تكلفة تقاعس مرتبطة بكل بند'],
      ['A correction plan ranked by risk', 'خطة تصحيح مرتبة حسب المخاطر'],
    ],
    process: [
      ['Prepare', 'التحضير', 'Documents, numbers and access arranged in advance.', 'ترتيب الوثائق والأرقام والصلاحيات مسبقاً.'],
      ['Observe', 'المعاينة', 'On-site across service periods, following the checklist.', 'معاينة ميدانية عبر فترات الخدمة وفق قائمة التحقق.'],
      ['Analyse', 'التحليل', 'Observations tested against the numbers.', 'اختبار الملاحظات مقابل الأرقام.'],
      ['Report', 'التقرير', 'Findings, evidence and a ranked correction plan.', 'النتائج والأدلة وخطة تصحيح مرتبة.'],
    ],
    faqs: [
      ['Will staff know they are being audited?', 'هل سيعرف الفريق أنه يخضع للتدقيق؟', 'That is your call. Announced audits produce better documents; unannounced observation produces a truer picture of service.', 'القرار لك. التدقيق المعلن ينتج وثائق أفضل، والمعاينة غير المعلنة تنتج صورة أصدق عن الخدمة.'],
      ['Do you also implement the corrections?', 'هل تنفذون التصحيحات أيضاً؟', 'Separately, if you want that. The audit is deliberately independent of implementation so the findings are not shaped by who will act on them.', 'بشكل منفصل إن رغبت. التدقيق مستقل عن التنفيذ بقصد، حتى لا تتأثر النتائج بمن سينفذها.'],
    ],
  },
  {
    slug: 'operational-audit',
    heroEn:
      'A focused review of how the operation actually runs during service — flow, timing, staffing, stations and the controls that hold quality steady at peak.',
    heroAr:
      'مراجعة مركّزة لكيفية سير التشغيل فعلياً أثناء الخدمة: الانسيابية والتوقيت والتوظيف والمحطات والضوابط التي تحفظ الجودة في الذروة.',
    whatEn:
      'We observe service rather than interview about it. Station layout and mise en place, ticket times by course and by station, expediting and pass discipline, front-of-house sequence, hand-offs between kitchen and floor, staffing against actual demand curves, and the points at which quality begins to slip as volume rises.\n\nFindings are tied to the specific moment and station where they occur, so a correction has an address rather than a department.',
    whatAr:
      'نراقب الخدمة بدل السؤال عنها: تخطيط المحطات والتحضير المسبق، وأزمنة الطلبات حسب الطبق والمحطة، وانضباط التمرير والتنسيق، وتسلسل خدمة الصالة، والتسليم بين المطبخ والصالة، والتوظيف مقابل منحنيات الطلب الفعلية، والنقاط التي تبدأ عندها الجودة بالتراجع مع ارتفاع الضغط.\n\nتُربط النتائج باللحظة والمحطة التي تحدث فيها، ليكون للتصحيح عنوان محدد لا إدارة عامة.',
    apprEn:
      'Operational problems are observed, not reported. We watch the shifts that actually hurt — the busiest and the most understaffed — because that is where the system reveals what it really is.',
    apprAr:
      'المشكلات التشغيلية تُلاحظ ولا تُروى. نراقب الورديات التي تؤلم فعلاً: الأكثر ازدحاماً والأقل عدداً، لأن النظام يكشف حقيقته هناك.',
    deliverables: [
      ['Service observation report', 'تقرير معاينة الخدمة'],
      ['Ticket time analysis', 'تحليل أزمنة الطلبات'],
      ['Station and flow assessment', 'تقييم المحطات والانسيابية'],
      ['Staffing against demand curve', 'التوظيف مقابل منحنى الطلب'],
      ['Standard operating procedure gaps', 'فجوات إجراءات التشغيل المعيارية'],
      ['Correction plan by station', 'خطة تصحيح حسب المحطة'],
    ],
    whyEn:
      'Service quality does not fall evenly; it falls at a specific station, at a specific volume, at a specific hour. Until that point is located, extra staff and extra training are guesses.',
    whyAr:
      'لا تتراجع جودة الخدمة بالتساوي، بل تتراجع عند محطة محددة وحجم محدد وساعة محددة. وحتى تُحدَّد تلك النقطة تبقى زيادة الموظفين والتدريب مجرد تخمين.',
    benefits: [
      ['The breaking point located, not estimated', 'تحديد نقطة الانهيار لا تقديرها'],
      ['Ticket times measured by station and course', 'قياس أزمنة الطلبات حسب المحطة والطبق'],
      ['Staffing read against the real demand curve', 'قراءة التوظيف مقابل منحنى الطلب الحقيقي'],
      ['Procedures written for the shift that needs them', 'إجراءات مكتوبة للوردية التي تحتاجها'],
    ],
    process: [
      ['Baseline', 'خط الأساس', 'Demand curve, rota and menu complexity mapped.', 'رسم منحنى الطلب والجدول وتعقيد القائمة.'],
      ['Observe', 'المعاينة', 'Multiple services watched, including the hardest.', 'مراقبة عدة ورديات بينها الأصعب.'],
      ['Measure', 'القياس', 'Times, hand-offs and failure points recorded.', 'تسجيل الأزمنة والتسليمات ونقاط الإخفاق.'],
      ['Correct', 'التصحيح', 'A station-level plan with training and checks.', 'خطة على مستوى المحطة بتدريب وفحوصات.'],
    ],
    faqs: [
      ['How many services do you observe?', 'كم وردية تراقبون؟', 'Enough to cover the peak, a normal service and a difficult one. A single visit shows a snapshot, not a system.', 'ما يكفي لتغطية الذروة ووردية اعتيادية وأخرى صعبة. الزيارة الواحدة تُظهر لقطة لا نظاماً.'],
      ['Do you write the procedures as well?', 'هل تكتبون الإجراءات أيضاً؟', 'Yes, where gaps are found. They are written short and in the language the team works in, or they will not be used.', 'نعم حيث تُكتشف فجوات. وتُكتب قصيرة وبلغة عمل الفريق، وإلا فلن تُستخدم.'],
    ],
  },
];
