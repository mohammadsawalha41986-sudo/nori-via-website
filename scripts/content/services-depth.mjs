/**
 * Depth layer for the service catalogue.
 *
 * Every service already in the database keeps its identity — slug, name,
 * summary, category and publish status are never touched here. This module
 * supplies only the fields the service page renders but the catalogue left
 * empty: why the work matters, the benefits list, the process steps, the FAQs
 * and, for services that shipped as a name and a summary only, the hero
 * description, the "what we do" body, the approach and the deliverables.
 *
 * The applier writes a field only when the stored value is still empty, so an
 * edit made in Admin always wins and a second run changes nothing.
 *
 * Nothing here states a client, a figure, an award or a result. Where a number
 * appears it is a definition (a ratio, a formula, a reporting period), never a
 * claim about work Noriva has done.
 *
 * Tuple shapes, kept compact so the catalogue reads as a table:
 *   deliverables : [en, ar]
 *   benefits     : [en, ar]
 *   process      : [titleEn, titleAr, bodyEn, bodyAr]
 *   faqs         : [questionEn, questionAr, answerEn, answerAr]
 */

/** Marketing, social and content — the always-on channel practice. */
const MARKETING_SOCIAL = [
  {
    slug: 'social-media-management',
    whyEn:
      'A channel that goes quiet for two weeks does not simply pause; it drops out of the shortlist guests build before they are hungry. Consistency is the cheapest form of presence an F&B business can buy, and the hardest to sustain without a system behind it.',
    whyAr:
      'القناة التي تصمت أسبوعين لا تتوقف فحسب، بل تخرج من قائمة الخيارات التي يبنيها الضيف قبل أن يشعر بالجوع. الاستمرارية أرخص أشكال الحضور التي يمكن لمشروع الأغذية والمشروبات شراؤها، وأصعبها استدامةً بلا نظام يسندها.',
    benefits: [
      ['A publishing rhythm the team can sustain after we hand over', 'إيقاع نشر يستطيع الفريق الاستمرار عليه بعد التسليم'],
      ['Every post tied to a commercial objective, not to a trend', 'كل منشور مرتبط بهدف تجاري لا بموجة رائجة'],
      ['Arabic and English written natively, not translated', 'محتوى عربي وإنجليزي مكتوب بلغته الأصلية لا مترجم'],
      ['One monthly read of what worked and what to change', 'قراءة شهرية واحدة لما نجح وما يجب تغييره'],
    ],
    process: [
      ['Channel audit', 'تدقيق القنوات', 'What is published today, what performs, and what the account is missing.', 'ما يُنشر اليوم، وما يحقق أداءً، وما تفتقده الحسابات.'],
      ['Plan', 'الخطة', 'A ninety-day calendar mapped to launches, dayparts and menu priorities.', 'تقويم لتسعين يوماً مرتبط بالإطلاقات وأوقات الذروة وأولويات القائمة.'],
      ['Production', 'الإنتاج', 'Monthly shooting, editing, copywriting and scheduling cycles.', 'دورات شهرية للتصوير والمونتاج وكتابة النصوص والجدولة.'],
      ['Review', 'المراجعة', 'A monthly report that changes next month’s plan rather than describing last month’s.', 'تقرير شهري يغيّر خطة الشهر القادم بدل وصف الشهر الماضي.'],
    ],
    faqs: [
      ['Do you need access to our accounts?', 'هل تحتاجون صلاحية الوصول إلى حساباتنا؟', 'Yes — publishing and community management require account access. Ownership stays with you throughout, and access is returned on request.', 'نعم، فالنشر وإدارة المجتمع يتطلبان صلاحية الوصول. تبقى ملكية الحسابات لك طوال الوقت، وتُعاد الصلاحيات عند الطلب.'],
      ['Can you work with content we already have?', 'هل يمكنكم العمل بمحتوى موجود لدينا؟', 'Yes. The audit begins with your existing library, and anything usable is re-cut and scheduled before new production is planned.', 'نعم. يبدأ التدقيق من مكتبتك الحالية، ويُعاد تحرير كل ما يصلح منها وجدولته قبل التخطيط لإنتاج جديد.'],
    ],
  },
  {
    slug: 'content-strategy',
    whyEn:
      'Random content produces random results, and worse, it makes performance unreadable: when nothing was planned, nothing can be attributed. A pillar structure turns a feed into a set of deliberate bets you can judge.',
    whyAr:
      'المحتوى العشوائي ينتج نتائج عشوائية، والأسوأ أنه يجعل الأداء غير قابل للقراءة: ما لم يُخطَّط له لا يمكن نسب النتيجة إليه. هيكل المحاور يحوّل الحساب إلى مجموعة رهانات مقصودة يمكن الحكم عليها.',
    benefits: [
      ['Content pillars tied to dayparts, categories and margin', 'محاور محتوى مرتبطة بأوقات الذروة والتصنيفات والهامش'],
      ['A format library the team can produce repeatedly', 'مكتبة صيغ يستطيع الفريق إنتاجها بشكل متكرر'],
      ['A cadence sized to your actual production capacity', 'إيقاع نشر مقاس على طاقتك الإنتاجية الفعلية'],
      ['A measurement frame that connects content to orders', 'إطار قياس يربط المحتوى بالطلبات'],
    ],
    process: [
      ['Audit', 'التدقيق', 'Twelve months of content read against sales, not against likes.', 'قراءة محتوى اثني عشر شهراً مقابل المبيعات لا مقابل الإعجابات.'],
      ['Pillars', 'المحاور', 'Three to five themes the brand can own and repeat credibly.', 'من ثلاثة إلى خمسة محاور تستطيع العلامة امتلاكها وتكرارها بمصداقية.'],
      ['Formats', 'الصيغ', 'A library of repeatable shots, edits and caption patterns.', 'مكتبة من اللقطات والمونتاج وأنماط النصوص القابلة للتكرار.'],
      ['Roadmap', 'خارطة الطريق', 'A ninety-day plan with owners, cadence and review points.', 'خطة تسعين يوماً بمسؤوليات وإيقاع ونقاط مراجعة.'],
    ],
    faqs: [
      ['Is this different from a content calendar?', 'هل يختلف هذا عن تقويم المحتوى؟', 'A calendar says when. A strategy says why, and gives the calendar something to be judged against.', 'التقويم يحدد المتى، أما الاستراتيجية فتحدد اللماذا وتمنح التقويم معياراً يُحاكم إليه.'],
      ['Can our own team execute it?', 'هل يستطيع فريقنا تنفيذها؟', 'That is the intent. The format library and cadence are sized to the team you have, not to an agency retainer.', 'هذا هو المقصود. تُقاس مكتبة الصيغ والإيقاع على الفريق المتاح لديك لا على عقد وكالة.'],
    ],
  },
  {
    slug: 'content-creation',
    whyEn:
      'Media budget cannot rescue weak assets. Creative quality sets the ceiling on every campaign that runs after it, and in food that ceiling is decided on the shoot day, not in the ad account.',
    whyAr:
      'لا يمكن للميزانية الإعلانية أن تنقذ مواد ضعيفة. جودة الإبداع تحدد سقف كل حملة تليها، وفي قطاع الطعام يُحسم هذا السقف في يوم التصوير لا في حساب الإعلانات.',
    benefits: [
      ['A stocked, tagged library rather than a one-off gallery', 'مكتبة مجهزة ومصنفة بدل معرض صور لمرة واحدة'],
      ['Dishes shot to sell, not only to look attractive', 'أطباق تُصوَّر لتُباع لا لتبدو جميلة فقط'],
      ['Vertical, square and horizontal crops delivered together', 'قصاصات عمودية ومربعة وأفقية تُسلَّم معاً'],
      ['Assets sized for menu, delivery apps, ads and social', 'مواد بمقاسات القائمة وتطبيقات التوصيل والإعلانات والتواصل'],
    ],
    process: [
      ['Shot list', 'قائمة اللقطات', 'Built from the content plan and the items that need to move.', 'مبنية على خطة المحتوى والأصناف التي تحتاج إلى تحريك.'],
      ['Direction', 'الإدارة الفنية', 'Art-directed on site with the kitchen, not around it.', 'إدارة فنية في الموقع مع المطبخ لا بمعزل عنه.'],
      ['Production', 'الإنتاج', 'Stills and motion captured in the same session to protect consistency.', 'التقاط الصور والفيديو في الجلسة نفسها للحفاظ على الاتساق.'],
      ['Delivery', 'التسليم', 'An organised, named and tagged library handed to your team.', 'مكتبة منظمة ومسماة ومصنفة تُسلَّم لفريقك.'],
    ],
    faqs: [
      ['How often should we shoot?', 'كم مرة ينبغي أن نصوّر؟', 'Most operations are best served by a recurring cycle tied to menu changes and seasons rather than by occasional large shoots.', 'تستفيد معظم العمليات من دورة متكررة مرتبطة بتغييرات القائمة والمواسم أكثر من جلسات كبيرة متفرقة.'],
      ['Do you shoot during service?', 'هل تصوّرون أثناء الخدمة؟', 'Only when atmosphere is the subject. Food is shot outside service hours so the kitchen is not compromised.', 'فقط حين تكون الأجواء هي الموضوع. أما الطعام فيُصوَّر خارج ساعات الخدمة حتى لا يتأثر المطبخ.'],
    ],
  },
  {
    slug: 'community-management',
    whyEn:
      'Comments, direct messages and reviews are the highest-intent conversations a venue has, and the slowest to be answered. Response time and tone decide whether attention converts or evaporates.',
    whyAr:
      'التعليقات والرسائل المباشرة والتقييمات هي أعلى المحادثات نيةً لدى أي مطعم، وأبطؤها استجابةً. سرعة الرد ونبرته هما ما يحسم تحوّل الانتباه إلى طلب أو تبدده.',
    benefits: [
      ['A defined response window across every channel', 'نافذة استجابة محددة عبر كل قناة'],
      ['A tone-of-voice guide covering praise and complaint alike', 'دليل نبرة صوت يغطي الثناء والشكوى معاً'],
      ['An escalation path for issues the floor must handle', 'مسار تصعيد للحالات التي يجب أن تعالجها الصالة'],
      ['Recurring themes reported back to operations', 'رفع الأنماط المتكررة إلى التشغيل'],
    ],
    process: [
      ['Baseline', 'خط الأساس', 'Current response times, sentiment and unanswered volume.', 'أزمنة الاستجابة الحالية والانطباع وحجم الرسائل بلا رد.'],
      ['Playbook', 'دليل التعامل', 'Reply patterns for the situations that actually recur.', 'أنماط ردود للحالات التي تتكرر فعلاً.'],
      ['Operate', 'التشغيل', 'Daily monitoring, replies and escalation inside the agreed window.', 'متابعة يومية وردود وتصعيد داخل النافذة المتفق عليها.'],
      ['Report', 'التقرير', 'Monthly sentiment themes routed to the operations owner.', 'أنماط الانطباع الشهرية تُحوَّل إلى مسؤول التشغيل.'],
    ],
    faqs: [
      ['Who answers complaints about the food?', 'من يجيب عن الشكاوى المتعلقة بالطعام؟', 'We acknowledge publicly within the agreed window and escalate the substance to your operations owner — we never invent an explanation on your behalf.', 'نردّ علناً بالإقرار داخل النافذة المتفق عليها ونصعّد المضمون إلى مسؤول التشغيل لديك، ولا نختلق تفسيراً نيابة عنك أبداً.'],
      ['Do you manage review platforms too?', 'هل تديرون منصات التقييم أيضاً؟', 'Yes, where access allows. Review responses follow the same playbook as social replies.', 'نعم حيثما تسمح الصلاحيات، وتتبع الردود على التقييمات الدليل نفسه المتبع في التواصل الاجتماعي.'],
    ],
  },
  {
    slug: 'social-media-design',
    whyEn:
      'A feed is read as one surface before any single post is read on its own. Without a design system the account looks like several brands sharing an account name.',
    whyAr:
      'يُقرأ الحساب كسطح واحد قبل أن يُقرأ أي منشور بمفرده. وبلا نظام تصميم تبدو الحسابات وكأن عدة علامات تتشارك اسماً واحداً.',
    benefits: [
      ['A template set that keeps the grid coherent', 'مجموعة قوالب تحافظ على تماسك الشبكة'],
      ['Arabic and English typography set with equal care', 'معالجة متساوية للخط العربي والإنجليزي'],
      ['Layouts that survive being cropped by each platform', 'تخطيطات تصمد أمام قصاصات كل منصة'],
      ['Editable files handed over, not flattened exports', 'ملفات قابلة للتعديل تُسلَّم بدل تصديرات مسطّحة'],
    ],
    process: [
      ['Audit', 'التدقيق', 'How the current grid reads at thumbnail size.', 'كيف تُقرأ الشبكة الحالية بحجم المصغّرات.'],
      ['System', 'النظام', 'Type scale, colour roles, spacing and image treatment.', 'مقياس الخط وأدوار اللون والمسافات ومعالجة الصور.'],
      ['Templates', 'القوالب', 'Post, story and highlight layouts in both languages.', 'تخطيطات المنشور والقصة والأبرز باللغتين.'],
      ['Handover', 'التسليم', 'Source files plus a short usage note for the team.', 'الملفات المصدرية مع ملاحظة استخدام مختصرة للفريق.'],
    ],
    faqs: [
      ['Do we need a full brand identity first?', 'هل نحتاج هوية بصرية كاملة أولاً؟', 'Not necessarily. A social design system can work from an existing identity; where none exists, we flag it rather than invent one quietly.', 'ليس بالضرورة. يمكن لنظام التصميم أن ينطلق من هوية قائمة، وإن لم توجد هوية أشرنا إلى ذلك بدل ابتكارها بصمت.'],
      ['Will the templates work in Arabic?', 'هل ستعمل القوالب بالعربية؟', 'They are built right-to-left first and checked left-to-right, so neither language is an afterthought.', 'تُبنى من اليمين إلى اليسار أولاً وتُراجع من اليسار إلى اليمين، فلا تكون أي لغة إضافة لاحقة.'],
    ],
  },
];

/** Paid media and performance. */
const ADVERTISING = [
  {
    slug: 'meta-ads',
    whyEn:
      'Meta remains the cheapest way to reach a defined catchment repeatedly, and the easiest place to spend money on people who will never visit. The difference is almost entirely structural: geography, creative rotation and what you count as a result.',
    whyAr:
      'تظل منصات ميتا أرخص وسيلة للوصول المتكرر إلى نطاق جغرافي محدد، وأسهل مكان لإنفاق المال على من لن يزور أبداً. والفرق بنيوي في معظمه: الجغرافيا، وتدوير الإبداعات، وما تعتبره نتيجة.',
    benefits: [
      ['Catchment-level geography rather than city-wide spend', 'استهداف على مستوى النطاق بدل الإنفاق على المدينة كاملة'],
      ['Creative rotation planned before fatigue, not after', 'تدوير الإبداعات مخطط قبل الإجهاد لا بعده'],
      ['Conversion events that match a real business outcome', 'أحداث تحويل تطابق نتيجة تجارية حقيقية'],
      ['Weekly optimisation with a written rationale', 'تحسين أسبوعي مصحوب بتبرير مكتوب'],
    ],
    process: [
      ['Account setup', 'إعداد الحساب', 'Pixel, events, catalogue and geography verified before spend.', 'البكسل والأحداث والكتالوج والجغرافيا تُتحقق قبل الإنفاق.'],
      ['Structure', 'البنية', 'Campaign architecture by objective, offer and catchment.', 'بنية الحملات حسب الهدف والعرض والنطاق.'],
      ['Creative', 'الإبداعات', 'A rotation built to be refreshed on a schedule.', 'تدوير إبداعي مبني على جدول تحديث.'],
      ['Optimise', 'التحسين', 'Weekly reads, budget shifts and a monthly written review.', 'قراءات أسبوعية ونقل ميزانيات ومراجعة شهرية مكتوبة.'],
    ],
    faqs: [
      ['What budget do we need to start?', 'ما الميزانية اللازمة للبدء؟', 'It depends on catchment size and objective. We size the budget from your delivery radius and average order value rather than quoting a fixed minimum.', 'يعتمد ذلك على حجم النطاق والهدف. نحدد الميزانية انطلاقاً من نطاق التوصيل ومتوسط قيمة الطلب بدل ذكر حد أدنى ثابت.'],
      ['Do you guarantee a return?', 'هل تضمنون عائداً؟', 'No. Anyone who guarantees a paid-media return is guessing. We commit to structure, measurement and honest reporting.', 'لا. من يضمن عائداً من الإعلانات المدفوعة إنما يخمّن. نلتزم بالبنية والقياس والتقرير الصادق.'],
    ],
  },
  {
    slug: 'tiktok-ads',
    whyEn:
      'TikTok rewards native production and punishes repurposed advertising. Winning there is a content discipline with a media budget attached, not a media buy with content attached.',
    whyAr:
      'يكافئ تيك توك الإنتاج الأصلي للمنصة ويعاقب الإعلان المعاد استخدامه. النجاح فيه انضباط محتوى تُلحق به ميزانية إعلانية، لا شراء إعلاني يُلحق به محتوى.',
    benefits: [
      ['Platform-native creative produced for the format', 'إبداعات أصلية للمنصة منتجة لصيغتها'],
      ['A hook-first structure tested in the first seconds', 'بنية تبدأ بالجذب وتُختبر في الثواني الأولى'],
      ['Volume planned so the account never runs dry', 'حجم إنتاج مخطط بحيث لا يجف الحساب'],
      ['Spend read against orders, not against views', 'قراءة الإنفاق مقابل الطلبات لا مقابل المشاهدات'],
    ],
    process: [
      ['Concepting', 'التصور', 'Hooks and formats chosen for the platform, not adapted to it.', 'مداخل وصيغ تُختار للمنصة لا تُكيَّف عليها.'],
      ['Production', 'الإنتاج', 'Batch shooting so testing has enough variants to be meaningful.', 'تصوير دفعي ليكون الاختبار ذا دلالة كافية.'],
      ['Testing', 'الاختبار', 'Structured rounds that isolate hook, offer and audience.', 'جولات منظمة تعزل المدخل والعرض والجمهور.'],
      ['Scale', 'التوسيع', 'Budget moved behind what survives testing.', 'نقل الميزانية خلف ما يصمد في الاختبار.'],
    ],
    faqs: [
      ['Can we reuse our Instagram creative?', 'هل يمكن إعادة استخدام إبداعات إنستغرام؟', 'Occasionally, but repurposed film usually underperforms. Budget for native production if the channel is meant to matter.', 'أحياناً، لكن المواد المعاد استخدامها تحقق أداءً أضعف عادة. خصّص ميزانية لإنتاج أصلي إن أردت للقناة أن تكون مهمة.'],
      ['Do we need to appear on camera?', 'هل يجب أن نظهر أمام الكاميرا؟', 'No, though venues where staff appear tend to build familiarity faster. It is a choice, not a requirement.', 'لا، وإن كانت المطاعم التي يظهر فيها الفريق تبني الألفة أسرع. هو خيار لا شرط.'],
    ],
  },
  {
    slug: 'google-ads',
    whyEn:
      'Search captures demand that already exists, which makes it the most honest channel a venue runs: nobody types your category by accident. The work is in coverage, negatives and what the landing page does next.',
    whyAr:
      'يلتقط البحث طلباً قائماً فعلاً، ما يجعله أصدق قناة يديرها المطعم: لا أحد يكتب تصنيفك مصادفة. والعمل يكمن في التغطية والكلمات السالبة وما تفعله صفحة الوصول بعد ذلك.',
    benefits: [
      ['Brand and category coverage separated and measured apart', 'فصل تغطية العلامة عن التصنيف وقياس كل منهما على حدة'],
      ['A negative-keyword discipline that stops wasted clicks', 'انضباط في الكلمات السالبة يوقف النقرات المهدرة'],
      ['Location and hours extensions kept accurate', 'إضافات الموقع وساعات العمل تُبقى دقيقة'],
      ['A landing destination chosen to convert, not to impress', 'وجهة وصول تُختار للتحويل لا للإبهار'],
    ],
    process: [
      ['Demand map', 'خريطة الطلب', 'What people actually search in your category and area.', 'ما يبحث عنه الناس فعلاً في تصنيفك ومنطقتك.'],
      ['Build', 'البناء', 'Structure, match types, negatives and extensions.', 'البنية وأنواع المطابقة والكلمات السالبة والإضافات.'],
      ['Landing', 'صفحة الوصول', 'The destination reviewed before spend, not after.', 'مراجعة الوجهة قبل الإنفاق لا بعده.'],
      ['Refine', 'التحسين', 'Search-term review on a fixed weekly cadence.', 'مراجعة عبارات البحث بإيقاع أسبوعي ثابت.'],
    ],
    faqs: [
      ['Should we bid on our own brand name?', 'هل نزايد على اسم علامتنا؟', 'Usually yes when competitors or aggregators bid on it, and it should always be measured separately from category demand.', 'غالباً نعم حين يزايد عليه المنافسون أو تطبيقات التجميع، ويجب قياسه دائماً بمعزل عن طلب التصنيف.'],
      ['Is search worth it for a single venue?', 'هل يستحق البحث العناء لفرع واحد؟', 'Often, at modest budgets, because intent is high and the geography is tight. It is rarely the whole plan.', 'غالباً نعم بميزانيات متواضعة لأن النية عالية والجغرافيا ضيقة، لكنه نادراً ما يكون الخطة كاملة.'],
    ],
  },
  {
    slug: 'performance-marketing',
    whyEn:
      'Channels are usually optimised in isolation while the business is judged as a whole. Reading them together is what stops one channel taking credit for demand another created.',
    whyAr:
      'تُحسَّن القنوات عادة كل على حدة بينما يُحاكم المشروع ككل. وقراءتها مجتمعة هي ما يمنع قناة من نسب طلب صنعته قناة أخرى إلى نفسها.',
    benefits: [
      ['One reporting frame across every paid channel', 'إطار تقرير واحد يغطي كل القنوات المدفوعة'],
      ['Budget allocated by contribution, not by habit', 'توزيع الميزانية حسب المساهمة لا حسب العادة'],
      ['Clear definitions of what counts as a conversion', 'تعريفات واضحة لما يُحتسب تحويلاً'],
      ['A monthly written interpretation, not only a dashboard', 'تفسير شهري مكتوب لا لوحة مؤشرات فقط'],
    ],
    process: [
      ['Measurement', 'القياس', 'Events, sources and definitions agreed before optimisation.', 'الأحداث والمصادر والتعريفات تُتفق قبل التحسين.'],
      ['Allocation', 'التوزيع', 'Budget split by objective and by what each channel can do.', 'تقسيم الميزانية حسب الهدف وقدرة كل قناة.'],
      ['Testing', 'الاختبار', 'A rolling test plan so learning does not stop at launch.', 'خطة اختبار متجددة كي لا يتوقف التعلم عند الإطلاق.'],
      ['Report', 'التقرير', 'Monthly review written in decisions, not in metrics.', 'مراجعة شهرية مكتوبة بقرارات لا بمؤشرات.'],
    ],
    faqs: [
      ['Do you replace our existing agency?', 'هل تحلّون محل وكالتنا الحالية؟', 'Not necessarily. This can sit above existing channel teams as the measurement and allocation layer.', 'ليس بالضرورة. يمكن أن تعمل هذه الخدمة فوق فرق القنوات الحالية كطبقة قياس وتوزيع.'],
      ['What if the numbers say to spend less?', 'ماذا لو دلّت الأرقام على تقليل الإنفاق؟', 'Then we say so. Recommending a smaller budget is part of the work.', 'حينها نقول ذلك. التوصية بميزانية أصغر جزء من العمل.'],
    ],
  },
  {
    slug: 'campaign-optimization',
    whyEn:
      'Most underperforming campaigns are not badly bought; they are badly structured, badly measured, or asking a single creative to carry a month. Optimisation begins by finding which of those three it is.',
    whyAr:
      'معظم الحملات ضعيفة الأداء ليست سيئة الشراء، بل سيئة البنية أو القياس أو تطلب من إبداع واحد أن يحمل شهراً كاملاً. ويبدأ التحسين بتحديد أي من هذه الثلاثة هو السبب.',
    benefits: [
      ['A diagnosis before any change to the account', 'تشخيص قبل أي تغيير في الحساب'],
      ['Structural fixes prioritised over bid tinkering', 'إصلاحات بنيوية تسبق العبث بالمزايدات'],
      ['Creative fatigue identified and scheduled against', 'رصد إجهاد الإبداعات وجدولة مواجهته'],
      ['Changes logged so results can be attributed', 'توثيق التغييرات لتُنسب النتائج إليها'],
    ],
    process: [
      ['Diagnose', 'التشخيص', 'Structure, tracking, creative and offer reviewed in that order.', 'مراجعة البنية والتتبع والإبداع والعرض بهذا الترتيب.'],
      ['Fix', 'الإصلاح', 'The structural and measurement problems first.', 'مشكلات البنية والقياس أولاً.'],
      ['Test', 'الاختبار', 'One variable at a time, long enough to be readable.', 'متغير واحد في كل مرة ولمدة كافية ليُقرأ.'],
      ['Document', 'التوثيق', 'A change log that makes next month’s reading possible.', 'سجل تغييرات يجعل قراءة الشهر القادم ممكنة.'],
    ],
    faqs: [
      ['Can you audit without taking over the account?', 'هل يمكنكم التدقيق دون تسلّم الحساب؟', 'Yes. A read-only audit with a written recommendation is a common starting point.', 'نعم. التدقيق بصلاحية قراءة فقط مع توصية مكتوبة نقطة بداية شائعة.'],
      ['How long before we can judge a change?', 'كم نحتاج قبل الحكم على تغيير؟', 'Long enough for the account to leave the learning phase and for the sample to be readable — rushing the read is the most common error.', 'مدة كافية ليخرج الحساب من مرحلة التعلم وتصبح العينة قابلة للقراءة، والاستعجال في القراءة أشيع الأخطاء.'],
    ],
  },
  {
    slug: 'roas-analysis',
    whyEn:
      'Return on ad spend is measured against revenue, while the business survives on contribution. A campaign can post a healthy ratio and still lose money once food cost, packaging and commission are subtracted.',
    whyAr:
      'يُقاس العائد على الإنفاق الإعلاني مقابل الإيراد، بينما يعيش المشروع على المساهمة. وقد تسجل حملة نسبة صحية وتخسر مالاً بعد خصم تكلفة الطعام والتغليف والعمولة.',
    benefits: [
      ['Return recalculated after food cost and commission', 'إعادة احتساب العائد بعد تكلفة الطعام والعمولة'],
      ['A break-even return specific to your margin', 'عائد تعادل خاص بهامشك أنت'],
      ['Channel comparison on a like-for-like basis', 'مقارنة القنوات على أساس متكافئ'],
      ['A clear rule for when to scale and when to stop', 'قاعدة واضحة لمتى تتوسع ومتى تتوقف'],
    ],
    process: [
      ['Inputs', 'المدخلات', 'Spend, revenue, item cost, packaging and commission gathered.', 'جمع الإنفاق والإيراد وتكلفة الصنف والتغليف والعمولة.'],
      ['Rebuild', 'إعادة البناء', 'Return recomputed on contribution rather than revenue.', 'إعادة احتساب العائد على المساهمة بدل الإيراد.'],
      ['Threshold', 'الحد الفاصل', 'The break-even return the business actually needs.', 'عائد التعادل الذي يحتاجه المشروع فعلاً.'],
      ['Decision', 'القرار', 'Scale, hold or stop, written per channel and offer.', 'التوسع أو التثبيت أو التوقف، مكتوباً لكل قناة وعرض.'],
    ],
    faqs: [
      ['What data do you need from us?', 'ما البيانات التي تحتاجونها منا؟', 'Ad spend and revenue by channel, item costs, packaging cost and platform commission. Estimates are workable if they are labelled as estimates.', 'الإنفاق الإعلاني والإيراد لكل قناة، وتكاليف الأصناف، وتكلفة التغليف، وعمولة المنصات. والتقديرات مقبولة إن وُسمت كتقديرات.'],
      ['Does this replace platform reporting?', 'هل يحل هذا محل تقارير المنصات؟', 'No. It reinterprets it. Platform numbers stay the source; the margin view is what makes them decision-grade.', 'لا، بل يعيد تفسيرها. تبقى أرقام المنصات هي المصدر، وتحويلها إلى منظور الهامش هو ما يجعلها صالحة للقرار.'],
    ],
  },
];

/** Brand, creative and production. */
const CREATIVE = [
  {
    slug: 'brand-identity',
    whyEn:
      'An identity is not a logo; it is the set of decisions that let a hundred future assets look like they came from the same place without anyone asking permission first.',
    whyAr:
      'الهوية ليست شعاراً، بل مجموعة القرارات التي تجعل مئة مادة مستقبلية تبدو صادرة من المكان نفسه دون أن يستأذن أحد.',
    benefits: [
      ['A system that scales past the pieces we design', 'نظام يتوسع إلى ما بعد القطع التي نصممها'],
      ['Arabic and Latin type treated as one identity', 'الخط العربي واللاتيني كهوية واحدة'],
      ['Applications tested on real surfaces before sign-off', 'تطبيقات تُختبر على أسطح حقيقية قبل الاعتماد'],
      ['Guidelines written to be used, not archived', 'دليل مكتوب ليُستخدم لا ليُؤرشف'],
    ],
    process: [
      ['Positioning', 'التموضع', 'What the brand is for, and who it is not for.', 'لماذا وُجدت العلامة، ولمن ليست موجهة.'],
      ['Design', 'التصميم', 'Marque, type, colour and image direction developed together.', 'العلامة والخط واللون واتجاه الصورة تُطوَّر معاً.'],
      ['Application', 'التطبيق', 'Menu, signage, packaging and digital surfaces.', 'القائمة واللوحات والتغليف والأسطح الرقمية.'],
      ['Guidelines', 'الدليل', 'A short, usable document plus production-ready files.', 'وثيقة قصيرة قابلة للاستخدام مع ملفات جاهزة للإنتاج.'],
    ],
    faqs: [
      ['Do we have to rename the business?', 'هل يجب تغيير اسم المشروع؟', 'No. Naming is a separate decision and we will say plainly when the existing name is not the problem.', 'لا. التسمية قرار منفصل، وسنقول بوضوح متى لا يكون الاسم الحالي هو المشكلة.'],
      ['Can you work with our existing logo?', 'هل يمكن العمل بشعارنا الحالي؟', 'Often yes. A system can be built around a sound marque; we recommend redrawing only when it genuinely blocks the work.', 'غالباً نعم. يمكن بناء نظام حول علامة سليمة، ولا نوصي بإعادة الرسم إلا حين يعيق ذلك العمل فعلاً.'],
    ],
  },
  {
    slug: 'creative-direction',
    whyEn:
      'Consistency is not produced by rules alone; it is produced by someone holding the line across every piece that leaves the building. Without that role, quality drifts one small compromise at a time.',
    whyAr:
      'لا تُنتَج الاستمرارية بالقواعد وحدها، بل بوجود من يحرس الخط في كل مادة تخرج. وبغياب هذا الدور تنحدر الجودة بتنازل صغير تلو الآخر.',
    benefits: [
      ['One standard applied across every channel', 'معيار واحد يُطبَّق على كل القنوات'],
      ['Briefs written so suppliers can hit the mark', 'مواجيز مكتوبة تمكّن المورّدين من إصابة الهدف'],
      ['Review points that catch drift early', 'نقاط مراجعة تلتقط الانحراف مبكراً'],
      ['Faster approvals because the standard is explicit', 'اعتمادات أسرع لأن المعيار صريح'],
    ],
    process: [
      ['Standard', 'المعيار', 'What good looks like, written down and illustrated.', 'ما هو الجيد، مكتوباً وموضحاً بالأمثلة.'],
      ['Brief', 'الموجز', 'Each piece briefed against that standard.', 'كل مادة تُوجَّه بموجز مقابل ذلك المعيار.'],
      ['Direct', 'التوجيه', 'Direction through production rather than judgement at the end.', 'توجيه أثناء الإنتاج بدل الحكم في نهايته.'],
      ['Review', 'المراجعة', 'A quarterly look at whether the standard still fits.', 'نظرة ربع سنوية إلى مدى ملاءمة المعيار.'],
    ],
    faqs: [
      ['Do you direct our other suppliers?', 'هل توجّهون مورّدينا الآخرين؟', 'Yes, where that is agreed. Direction works best when it covers everything that reaches a guest.', 'نعم حيث يُتفق على ذلك. يعمل التوجيه على أفضل وجه حين يغطي كل ما يصل إلى الضيف.'],
      ['Is this a retainer or a project?', 'هل هذه خدمة بعقد مستمر أم مشروع؟', 'Either. A standard can be set as a project; holding it is ongoing by nature.', 'كلاهما ممكن. يمكن وضع المعيار كمشروع، أما الحفاظ عليه فمستمر بطبيعته.'],
    ],
  },
  {
    slug: 'graphic-design',
    whyEn:
      'The printed and placed surfaces — menu, signage, packaging, table collateral — are read at a distance, in poor light, by someone deciding quickly. They deserve more care than they usually get.',
    whyAr:
      'الأسطح المطبوعة والموضوعة — القائمة واللوحات والتغليف ومواد الطاولة — تُقرأ من مسافة وفي إضاءة ضعيفة من شخص يقرر بسرعة، وهي تستحق عناية أكبر مما تُمنح عادة.',
    benefits: [
      ['Legibility tested at the distance it will be read', 'اختبار الوضوح على المسافة التي ستُقرأ منها'],
      ['Bilingual layouts that balance rather than mirror', 'تخطيطات ثنائية اللغة متوازنة لا معكوسة'],
      ['Print-ready files with the right specifications', 'ملفات جاهزة للطباعة بالمواصفات الصحيحة'],
      ['Source files handed over for future edits', 'تسليم الملفات المصدرية للتعديلات المستقبلية'],
    ],
    process: [
      ['Scope', 'النطاق', 'Which surfaces matter, and how each one is actually used.', 'أي الأسطح مهم، وكيف يُستخدم كل منها فعلاً.'],
      ['Design', 'التصميم', 'Layouts developed in both languages at the same time.', 'تخطيطات تُطوَّر باللغتين في الوقت نفسه.'],
      ['Proof', 'التجربة', 'Printed proofs checked in the venue, not on screen.', 'نماذج مطبوعة تُفحص في المكان لا على الشاشة.'],
      ['Release', 'الإصدار', 'Production files and a specification sheet per supplier.', 'ملفات الإنتاج وورقة مواصفات لكل مورّد.'],
    ],
    faqs: [
      ['Do you manage printing?', 'هل تديرون الطباعة؟', 'We prepare production-ready files and specifications, and can coordinate with your printer. We do not mark up print costs.', 'نجهّز ملفات ومواصفات جاهزة للإنتاج ويمكننا التنسيق مع مطبعتك. ولا نضيف هامشاً على تكاليف الطباعة.'],
      ['Can you redesign only the menu?', 'هل يمكن إعادة تصميم القائمة فقط؟', 'Yes, though menu design and menu economics are stronger together — we will flag it if the layout is not the real problem.', 'نعم، وإن كان تصميم القائمة واقتصادها أقوى معاً، وسننبّه إن لم يكن التخطيط هو المشكلة الحقيقية.'],
    ],
  },
  {
    slug: 'photography',
    whyEn:
      'Food photography is the single asset that appears everywhere: menu, delivery apps, advertising and social. Its quality is the floor beneath every impression a guest forms before arriving.',
    whyAr:
      'تصوير الطعام هو الأصل الوحيد الذي يظهر في كل مكان: القائمة وتطبيقات التوصيل والإعلانات والتواصل الاجتماعي، وجودته هي الأرضية التي يقوم عليها كل انطباع يكوّنه الضيف قبل وصوله.',
    benefits: [
      ['Dishes styled by the kitchen that will plate them', 'أطباق يُنسّقها المطبخ الذي سيقدمها'],
      ['Consistent light and treatment across the set', 'إضاءة ومعالجة متسقة عبر المجموعة'],
      ['Crops delivered for every destination', 'قصاصات تُسلَّم لكل وجهة'],
      ['A named, organised library rather than a folder dump', 'مكتبة مسماة ومنظمة بدل مجلد مبعثر'],
    ],
    process: [
      ['Shot list', 'قائمة اللقطات', 'Items selected by menu priority and commercial need.', 'أصناف تُختار حسب أولوية القائمة والحاجة التجارية.'],
      ['Prep', 'التحضير', 'Plating, props and light agreed before the day.', 'التقديم والإكسسوارات والإضاءة يُتفق عليها قبل اليوم.'],
      ['Shoot', 'التصوير', 'Captured outside service so the kitchen is not compromised.', 'التصوير خارج أوقات الخدمة حتى لا يتأثر المطبخ.'],
      ['Deliver', 'التسليم', 'Retouched, named, tagged and sized for each surface.', 'تنقيح وتسمية وتصنيف ومقاسات لكل سطح.'],
    ],
    faqs: [
      ['Do you use food stylists?', 'هل تستعينون بمنسّقي طعام؟', 'When the dish needs it. In most venues the head chef plating as they would in service produces more honest and more useful images.', 'حين يحتاج الطبق ذلك. وفي معظم المطاعم يمنح تقديم رئيس الطهاة كما في الخدمة صوراً أصدق وأنفع.'],
      ['Who owns the images?', 'لمن ملكية الصور؟', 'You do, on delivery, with full usage rights across every channel.', 'لك، عند التسليم، مع حقوق استخدام كاملة على كل القنوات.'],
    ],
  },
  {
    slug: 'video-production',
    whyEn:
      'Video is the format that carries atmosphere — heat, movement, service, sound. It is also the format most often produced once, used for a week and never planned for again.',
    whyAr:
      'الفيديو هو الصيغة التي تنقل الأجواء: الحرارة والحركة والخدمة والصوت. وهو أيضاً الأكثر إنتاجاً لمرة واحدة واستخداماً لأسبوع ثم لا يُخطط له مجدداً.',
    benefits: [
      ['One shoot cut into many usable lengths', 'تصوير واحد يُقصّ إلى أطوال متعددة قابلة للاستخدام'],
      ['Vertical and horizontal masters delivered together', 'نسخ رئيسية عمودية وأفقية تُسلَّم معاً'],
      ['Captioned in Arabic and English', 'ترجمة نصية بالعربية والإنجليزية'],
      ['A shot bank kept for future edits', 'بنك لقطات يُحفظ للتعديلات المستقبلية'],
    ],
    process: [
      ['Concept', 'الفكرة', 'What the film has to do, and where it will be seen.', 'ما يجب أن يفعله الفيلم وأين سيُشاهد.'],
      ['Pre-production', 'التحضير', 'Schedule, locations, talent and kitchen coordination.', 'الجدول والمواقع والمشاركون والتنسيق مع المطبخ.'],
      ['Shoot', 'التصوير', 'Captured to serve multiple cuts, not a single edit.', 'تصوير يخدم نسخاً متعددة لا نسخة واحدة.'],
      ['Post', 'ما بعد الإنتاج', 'Grade, sound, captions and versioned exports.', 'تصحيح ألوان وصوت وترجمة وتصديرات متعددة النسخ.'],
    ],
    faqs: [
      ['Do we need a script?', 'هل نحتاج نصاً؟', 'For anything with dialogue or a claim, yes. Atmosphere films work from a shot list instead.', 'لكل ما فيه حوار أو ادعاء، نعم. أما أفلام الأجواء فتعمل بقائمة لقطات بدلاً من ذلك.'],
      ['Can you film during opening week?', 'هل يمكن التصوير في أسبوع الافتتاح؟', 'Yes, and it is often the right moment — but it needs planning around service rather than during it.', 'نعم، وغالباً يكون التوقيت مناسباً، لكنه يحتاج تخطيطاً حول الخدمة لا داخلها.'],
    ],
  },
  {
    slug: 'reels-short-form',
    whyEn:
      'Short-form is a volume game with a quality floor. One good film a month loses to a steady cadence of competent ones, because the format rewards presence over polish.',
    whyAr:
      'الفيديو القصير لعبة كمّ بحدّ أدنى من الجودة. فيلم جيد واحد شهرياً يخسر أمام إيقاع ثابت من أفلام كفؤة، لأن الصيغة تكافئ الحضور أكثر من الإتقان.',
    benefits: [
      ['Batch production that fills a full month', 'إنتاج دفعي يملأ شهراً كاملاً'],
      ['Hooks written before anything is filmed', 'مداخل تُكتب قبل أي تصوير'],
      ['Formats the in-house team can repeat', 'صيغ يستطيع الفريق الداخلي تكرارها'],
      ['Sound and captions handled as part of the edit', 'الصوت والترجمة جزء من المونتاج'],
    ],
    process: [
      ['Format', 'الصيغة', 'A small set of repeatable structures chosen deliberately.', 'مجموعة صغيرة من البنى القابلة للتكرار تُختار بقصد.'],
      ['Batch', 'الدفعة', 'A month of films captured in one or two days.', 'أفلام شهر كامل تُصوَّر في يوم أو يومين.'],
      ['Edit', 'المونتاج', 'Cut, captioned and scheduled ahead of the month.', 'قص وترجمة وجدولة قبل بداية الشهر.'],
      ['Learn', 'التعلم', 'Retention read per format, and the weak ones dropped.', 'قراءة نسبة البقاء لكل صيغة وإسقاط الضعيف منها.'],
    ],
    faqs: [
      ['How many films a month is right?', 'كم فيلماً في الشهر مناسب؟', 'Enough that the account is never silent for more than a few days, and no more than the team can sustain after handover.', 'ما يكفي ألا يصمت الحساب أكثر من أيام قليلة، ولا يتجاوز ما يستطيع الفريق الاستمرار عليه بعد التسليم.'],
      ['Can staff appear in them?', 'هل يمكن أن يظهر الفريق فيها؟', 'Yes, with consent. Staff-led films usually build familiarity faster than polished brand films.', 'نعم بموافقتهم. وأفلام الفريق تبني الألفة أسرع عادة من أفلام العلامة المصقولة.'],
    ],
  },
  {
    slug: 'campaign-creatives',
    whyEn:
      'A campaign fails on creative more often than on targeting. Enough variants, produced to one standard and rotated on a schedule, is what keeps a media plan alive past its second week.',
    whyAr:
      'تفشل الحملات على مستوى الإبداع أكثر مما تفشل على الاستهداف. وتوفير عدد كافٍ من النسخ بمعيار واحد وتدويرها وفق جدول هو ما يبقي الخطة الإعلامية حية بعد أسبوعها الثاني.',
    benefits: [
      ['A variant set built for testing from the start', 'مجموعة نسخ مبنية للاختبار منذ البداية'],
      ['Every placement sized correctly, not cropped later', 'كل موضع بمقاسه الصحيح لا مقصوصاً لاحقاً'],
      ['Offer and message separated so each can be tested', 'فصل العرض عن الرسالة ليُختبر كل منهما'],
      ['A refresh schedule agreed before launch', 'جدول تحديث يُتفق عليه قبل الإطلاق'],
    ],
    process: [
      ['Brief', 'الموجز', 'The offer, the audience and the single thing to communicate.', 'العرض والجمهور والرسالة الواحدة المطلوب إيصالها.'],
      ['Variants', 'النسخ', 'Hooks, formats and messages built as a matrix.', 'مداخل وصيغ ورسائل تُبنى كمصفوفة.'],
      ['Adapt', 'التكييف', 'Sized and versioned per placement and language.', 'مقاسات ونسخ لكل موضع ولغة.'],
      ['Refresh', 'التحديث', 'New variants delivered before fatigue, on schedule.', 'نسخ جديدة تُسلَّم قبل الإجهاد وفق الجدول.'],
    ],
    faqs: [
      ['How many variants do we need?', 'كم نسخة نحتاج؟', 'Enough that testing is meaningful and rotation is possible — the exact number follows budget and flight length.', 'ما يكفي ليكون الاختبار ذا معنى والتدوير ممكناً، والعدد الدقيق يتبع الميزانية ومدة الحملة.'],
      ['Do you write the copy as well?', 'هل تكتبون النصوص أيضاً؟', 'Yes, in Arabic and English, written natively in each rather than translated from one.', 'نعم، بالعربية والإنجليزية، وتُكتب كل منهما بلغتها لا مترجمة عن الأخرى.'],
    ],
  },
];

export const SERVICE_DEPTH_PART_1 = [...MARKETING_SOCIAL, ...ADVERTISING, ...CREATIVE];
