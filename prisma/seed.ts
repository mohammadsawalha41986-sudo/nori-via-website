import 'dotenv/config';
import { PrismaClient, type Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SERVICE_CATEGORIES = [
  { slug: 'marketing-social', nameEn: 'Marketing & Social', nameAr: 'التسويق والتواصل الاجتماعي', order: 1,
    descriptionEn: 'Owning the feed your guests scroll every day.', descriptionAr: 'نمتلك المحتوى الذي يتصفحه ضيوفك كل يوم.' },
  { slug: 'advertising-performance', nameEn: 'Advertising & Performance', nameAr: 'الإعلانات والأداء', order: 2,
    descriptionEn: 'Paid media built to move covers, not impressions.', descriptionAr: 'إعلانات مدفوعة تُحرّك الطلبات لا مجرد الانطباعات.' },
  { slug: 'creative-branding', nameEn: 'Creative & Branding', nameAr: 'الإبداع والهوية', order: 3,
    descriptionEn: 'The look, the language and the craft behind the brand.', descriptionAr: 'الشكل واللغة والحرفية خلف العلامة التجارية.' },
  { slug: 'restaurant-menu', nameEn: 'Restaurant & Menu', nameAr: 'المطعم وقائمة الطعام', order: 4,
    descriptionEn: 'The menu is the highest-leverage asset in the restaurant.', descriptionAr: 'قائمة الطعام هي الأصل الأعلى تأثيرًا في المطعم.' },
  { slug: 'growth-profitability', nameEn: 'Growth & Profitability', nameAr: 'النمو والربحية', order: 5,
    descriptionEn: 'Marketing decisions read against the P&L.', descriptionAr: 'قرارات تسويقية تُقرأ في ضوء قائمة الأرباح والخسائر.' },
];

type SeedService = {
  slug: string; nameEn: string; nameAr: string; category: string;
  summaryEn: string; summaryAr: string;
  whatWeDoEn: string; whatWeDoAr: string;
  whyEn: string; whyAr: string;
  approachEn: string; approachAr: string;
  deliverables: [string, string][];
};

const SERVICES: SeedService[] = [
  { slug: 'social-media-management', nameEn: 'Social Media Management', nameAr: 'إدارة وسائل التواصل الاجتماعي', category: 'marketing-social',
    summaryEn: 'Always-on channel management that keeps your restaurant in the feed and in the conversation.',
    summaryAr: 'إدارة مستمرة لقنواتك تُبقي مطعمك حاضرًا في المحتوى وفي الحديث.',
    whatWeDoEn: 'We run your restaurant’s social channels end to end: monthly content planning, shooting and editing, publishing, captions in Arabic and English, and daily community management. Every post is tied to something the restaurant actually needs that month — a launch, a slow daypart, a new menu section.',
    whatWeDoAr: 'ندير قنوات مطعمك من البداية إلى النهاية: تخطيط شهري للمحتوى، تصوير ومونتاج، نشر، نصوص بالعربية والإنجليزية، وإدارة يومية للمجتمع. كل منشور مرتبط بهدف فعلي للمطعم في ذلك الشهر.',
    whyEn: 'Guests decide where to eat long before they are hungry. A channel that goes quiet for two weeks is a restaurant that disappears from the shortlist.',
    whyAr: 'يقرر الضيوف أين يأكلون قبل أن يشعروا بالجوع بوقت طويل. القناة الصامتة لأسبوعين تعني مطعمًا اختفى من قائمة الخيارات.',
    approachEn: 'We start with a content audit and a 90-day channel plan, then move to monthly production cycles. Performance is reviewed every month and the plan is adjusted — we do not repeat a calendar that is not working.',
    approachAr: 'نبدأ بتدقيق المحتوى وخطة قناة لـ٩٠ يومًا، ثم ننتقل إلى دورات إنتاج شهرية مع مراجعة أداء شهرية.',
    deliverables: [['Monthly content calendar', 'تقويم محتوى شهري'], ['Photo and video shoot days', 'أيام تصوير فوتوغرافي وفيديو'], ['Bilingual captions and hashtags', 'نصوص ووسوم بالعربية والإنجليزية'], ['Daily community management', 'إدارة يومية للمجتمع'], ['Monthly performance report', 'تقرير أداء شهري']] },

  { slug: 'content-strategy', nameEn: 'Content Strategy', nameAr: 'استراتيجية المحتوى', category: 'marketing-social',
    summaryEn: 'A content plan built around what the restaurant needs to sell, not around what is trending.',
    summaryAr: 'خطة محتوى مبنية على ما يحتاج المطعم لبيعه، لا على ما هو رائج.',
    whatWeDoEn: 'We map your menu, your dayparts and your margins against the content that drives each one, then build a pillar structure and a publishing rhythm your team can actually sustain.',
    whatWeDoAr: 'نربط قائمتك وأوقات ذروتك وهوامشك بالمحتوى الذي يحرك كل منها، ثم نبني هيكل محاور وإيقاع نشر قابلًا للاستمرار.',
    whyEn: 'Most restaurant content is random. Random content produces random results, and makes it impossible to tell what is working.',
    whyAr: 'معظم محتوى المطاعم عشوائي، والمحتوى العشوائي ينتج نتائج عشوائية.',
    approachEn: 'Audit, pillar definition, format library, publishing cadence, and a measurement frame that ties content back to covers and orders.',
    approachAr: 'تدقيق، تحديد المحاور، مكتبة صيغ، إيقاع نشر، وإطار قياس.',
    deliverables: [['Content audit', 'تدقيق المحتوى'], ['Pillar and format framework', 'إطار المحاور والصيغ'], ['90-day content roadmap', 'خارطة محتوى لـ٩٠ يومًا'], ['Measurement framework', 'إطار القياس']] },

  { slug: 'content-creation', nameEn: 'Content Creation', nameAr: 'إنتاج المحتوى', category: 'marketing-social',
    summaryEn: 'Food, people and place, shot properly — the raw material every other channel depends on.',
    summaryAr: 'الطعام والناس والمكان، بتصوير احترافي — المادة الخام التي تعتمد عليها كل قناة أخرى.',
    whatWeDoEn: 'Recurring shoot days covering dishes, atmosphere, staff and process. We deliver a stocked library, not a one-off gallery, so the channel never runs dry.',
    whatWeDoAr: 'أيام تصوير دورية تغطي الأطباق والأجواء والفريق والعملية، مع تسليم مكتبة متجددة.',
    whyEn: 'You cannot run good advertising on bad assets. Creative quality sets the ceiling on every campaign that follows.',
    whyAr: 'لا يمكن تشغيل إعلان جيد بمواد رديئة؛ جودة الإبداع تحدد سقف كل حملة.',
    approachEn: 'Shot list built from the content plan, art-directed on site, delivered as an organised and tagged asset library.',
    approachAr: 'قائمة لقطات مبنية على خطة المحتوى، بإدارة فنية في الموقع، وتسليم منظم.',
    deliverables: [['Photography shoot days', 'أيام تصوير فوتوغرافي'], ['Short-form video and reels', 'فيديو قصير وريلز'], ['Edited and graded assets', 'مواد مُعدّلة ومصححة الألوان'], ['Organised asset library', 'مكتبة مواد منظمة']] },

  { slug: 'community-management', nameEn: 'Community Management', nameAr: 'إدارة المجتمع', category: 'marketing-social',
    summaryEn: 'Answering every comment, message and review the way the brand should sound.',
    summaryAr: 'الرد على كل تعليق ورسالة ومراجعة بالصوت الذي تستحقه علامتك.',
    whatWeDoEn: 'Daily monitoring and replies across Instagram, TikTok and Google, working from an agreed tone-of-voice guide and an escalation path for anything operational.',
    whatWeDoAr: 'متابعة يومية وردود عبر إنستغرام وتيك توك وجوجل، وفق دليل نبرة متفق عليه ومسار تصعيد واضح.',
    whyEn: 'An unanswered complaint is public. So is a great reply — and it is read by everyone considering a booking.',
    whyAr: 'الشكوى دون رد علنية، وكذلك الرد الجيد الذي يقرأه كل من يفكر بالحجز.',
    approachEn: 'Tone-of-voice guide, response-time targets, saved-reply library, weekly sentiment summary.',
    approachAr: 'دليل نبرة، أهداف زمن استجابة، مكتبة ردود، وملخص أسبوعي.',
    deliverables: [['Daily comment and DM management', 'إدارة يومية للتعليقات والرسائل'], ['Review response handling', 'التعامل مع المراجعات'], ['Tone-of-voice guide', 'دليل نبرة الصوت'], ['Weekly sentiment summary', 'ملخص أسبوعي للانطباع']] },

  { slug: 'social-media-design', nameEn: 'Social Media Design', nameAr: 'تصميم وسائل التواصل', category: 'marketing-social',
    summaryEn: 'A feed that looks like one brand instead of twelve different designers.',
    summaryAr: 'حساب يبدو كعلامة واحدة، لا كأعمال اثني عشر مصممًا مختلفًا.',
    whatWeDoEn: 'Templates, grids, story and reel frames, promo layouts and Arabic/English typography rules that hold together at feed scale.',
    whatWeDoAr: 'قوالب وشبكات وإطارات قصص وريلز وتصاميم عروض وقواعد طباعية عربية وإنجليزية.',
    whyEn: 'Consistency is what makes a small restaurant look established, and an established one look serious.',
    whyAr: 'الاتساق هو ما يجعل المطعم الصغير يبدو راسخًا.',
    approachEn: 'A compact design system, delivered as editable templates your team can use between our shoots.',
    approachAr: 'نظام تصميم مختصر، يُسلم كقوالب قابلة للتعديل.',
    deliverables: [['Feed and story templates', 'قوالب للحساب والقصص'], ['Promo and offer layouts', 'تصاميم العروض'], ['Bilingual typography rules', 'قواعد طباعية ثنائية اللغة'], ['Editable source files', 'ملفات مصدرية قابلة للتعديل']] },

  { slug: 'meta-ads', nameEn: 'Meta Ads', nameAr: 'إعلانات ميتا', category: 'advertising-performance',
    summaryEn: 'Instagram and Facebook campaigns built around covers, orders and delivery baskets.',
    summaryAr: 'حملات إنستغرام وفيسبوك مبنية على الطلبات والزيارات وسلة التوصيل.',
    whatWeDoEn: 'Account structure, audience and geo build-out around your catchment, creative testing at pace, and weekly optimisation against the metric that actually matters to the restaurant.',
    whatWeDoAr: 'بناء هيكل الحساب والجمهور والنطاق الجغرافي، واختبار إبداعي سريع، وتحسين أسبوعي.',
    whyEn: 'Restaurants live inside a delivery radius. Advertising that ignores geography wastes most of its budget.',
    whyAr: 'المطاعم تعيش داخل نطاق توصيل؛ والإعلان الذي يتجاهل الجغرافيا يهدر ميزانيته.',
    approachEn: 'Tracking and events first, then a lean account structure, then continuous creative iteration.',
    approachAr: 'التتبع والأحداث أولاً، ثم هيكل حساب مرن، ثم تكرار إبداعي مستمر.',
    deliverables: [['Campaign build and launch', 'بناء الحملات وإطلاقها'], ['Audience and geo strategy', 'استراتيجية الجمهور والنطاق'], ['Creative testing cycles', 'دورات اختبار إبداعي'], ['Weekly optimisation', 'تحسين أسبوعي'], ['Monthly performance report', 'تقرير أداء شهري']] },

  { slug: 'tiktok-ads', nameEn: 'TikTok Ads', nameAr: 'إعلانات تيك توك', category: 'advertising-performance',
    summaryEn: 'Native-feeling video advertising for the platform where food discovery now starts.',
    summaryAr: 'إعلانات فيديو بروح المنصة، حيث يبدأ اكتشاف المطاعم اليوم.',
    whatWeDoEn: 'Hook-first creative made for TikTok rather than resized from Instagram, run against local audiences and iterated weekly.',
    whatWeDoAr: 'إبداع يبدأ بالخطاف، مصمم لتيك توك لا معاد تحجيمه من إنستغرام.',
    whyEn: 'Reused Instagram creative underperforms on TikTok, consistently and expensively.',
    whyAr: 'إعادة استخدام محتوى إنستغرام تؤدي أداءً أضعف وأغلى.',
    approachEn: 'Platform-native concepting, rapid shooting, and a testing loop measured on cost per order.',
    approachAr: 'ابتكار مناسب للمنصة، تصوير سريع، ودورة اختبار.',
    deliverables: [['TikTok-native creative', 'محتوى مصمم لتيك توك'], ['Campaign management', 'إدارة الحملات'], ['Creator brief templates', 'قوالب توجيه صنّاع المحتوى'], ['Performance reporting', 'تقارير الأداء']] },

  { slug: 'google-ads', nameEn: 'Google Ads', nameAr: 'إعلانات جوجل', category: 'advertising-performance',
    summaryEn: 'Capturing the guest who is already searching for somewhere to eat tonight.',
    summaryAr: 'التقاط الضيف الذي يبحث الآن عن مكان لتناول الطعام.',
    whatWeDoEn: 'Search, Maps and Performance Max campaigns tuned to local intent, plus the Business Profile work that makes them convert.',
    whatWeDoAr: 'حملات بحث وخرائط وأداء أقصى مضبوطة على النية المحلية، مع تحسين الملف التجاري.',
    whyEn: 'Search intent is the shortest distance between a screen and a table.',
    whyAr: 'نية البحث هي أقصر مسافة بين الشاشة والطاولة.',
    approachEn: 'Keyword and competitor mapping, conversion tracking, then tight geo and schedule control.',
    approachAr: 'تخطيط الكلمات والمنافسين، تتبع التحويلات، ثم ضبط دقيق.',
    deliverables: [['Search and Maps campaigns', 'حملات البحث والخرائط'], ['Google Business Profile optimisation', 'تحسين ملف النشاط على جوجل'], ['Conversion tracking setup', 'إعداد تتبع التحويلات'], ['Monthly reporting', 'تقارير شهرية']] },

  { slug: 'performance-marketing', nameEn: 'Performance Marketing', nameAr: 'التسويق بالأداء', category: 'advertising-performance',
    summaryEn: 'One view of paid media across every channel, judged on outcomes rather than platform dashboards.',
    summaryAr: 'رؤية موحدة للإعلانات عبر كل القنوات، تُقاس بالنتائج لا بلوحات المنصات.',
    whatWeDoEn: 'Budget allocation across Meta, TikTok and Google, blended cost-per-order tracking, incrementality thinking and a single monthly read of what paid media actually returned.',
    whatWeDoAr: 'توزيع الميزانية عبر ميتا وتيك توك وجوجل، وتتبع مدمج لتكلفة الطلب، وقراءة شهرية واحدة.',
    whyEn: 'Each platform reports itself generously. Only a blended view tells you what the money did.',
    whyAr: 'كل منصة تمدح نفسها؛ الرؤية المدمجة وحدها تكشف الحقيقة.',
    approachEn: 'Define the true north metric with the operator, instrument it, then manage budget against it.',
    approachAr: 'نحدد المؤشر المرجعي مع المشغل، نقيسه، ثم ندير الميزانية وفقه.',
    deliverables: [['Cross-channel budget plan', 'خطة ميزانية عبر القنوات'], ['Blended performance dashboard', 'لوحة أداء مدمجة'], ['Monthly performance review', 'مراجعة أداء شهرية'], ['Scaling roadmap', 'خارطة توسع']] },

  { slug: 'campaign-optimization', nameEn: 'Campaign Optimization', nameAr: 'تحسين الحملات', category: 'advertising-performance',
    summaryEn: 'Taking over campaigns that are running but not returning.',
    summaryAr: 'استلام حملات تعمل دون أن تعود بنتيجة.',
    whatWeDoEn: 'A structured audit of account structure, tracking, audiences and creative, followed by a prioritised fix list and hands-on optimisation.',
    whatWeDoAr: 'تدقيق منظم للهيكل والتتبع والجمهور والإبداع، ثم قائمة إصلاح مرتبة بالأولوية.',
    whyEn: 'Most underperforming accounts have a measurement problem before they have a creative problem.',
    whyAr: 'معظم الحسابات الضعيفة تعاني من مشكلة قياس قبل مشكلة إبداع.',
    approachEn: 'Audit, fix tracking, restructure, then test creative — in that order.',
    approachAr: 'تدقيق، إصلاح التتبع، إعادة هيكلة، ثم اختبار الإبداع.',
    deliverables: [['Full account audit', 'تدقيق كامل للحساب'], ['Tracking verification', 'التحقق من التتبع'], ['Prioritised fix list', 'قائمة إصلاح مرتبة'], ['Optimisation sprint', 'دورة تحسين مكثفة']] },

  { slug: 'roas-analysis', nameEn: 'ROAS Analysis', nameAr: 'تحليل العائد على الإنفاق الإعلاني', category: 'advertising-performance',
    summaryEn: 'Reading advertising return against real food cost, not platform revenue.',
    summaryAr: 'قراءة العائد الإعلاني مقابل تكلفة الطعام الحقيقية، لا إيرادات المنصة.',
    whatWeDoEn: 'We rebuild your return calculation using contribution margin after food and delivery costs, so a campaign that looks profitable on the dashboard is tested against the P&L.',
    whatWeDoAr: 'نعيد بناء حساب العائد باستخدام هامش المساهمة بعد تكلفة الطعام والتوصيل.',
    whyEn: 'A 6x ROAS on a low-margin dish can still lose money. The platform will never tell you that.',
    whyAr: 'عائد مرتفع على طبق بهامش منخفض قد يعني خسارة، والمنصة لن تخبرك.',
    approachEn: 'Map dish margins, rebuild attribution, model contribution per campaign, then reallocate.',
    approachAr: 'نرسم هوامش الأطباق، نعيد بناء الإسناد، ثم نعيد التوزيع.',
    deliverables: [['Margin-aware return model', 'نموذج عائد يراعي الهامش'], ['Channel contribution analysis', 'تحليل مساهمة القنوات'], ['Budget reallocation plan', 'خطة إعادة توزيع الميزانية']] },

  { slug: 'brand-identity', nameEn: 'Brand Identity', nameAr: 'الهوية البصرية', category: 'creative-branding',
    summaryEn: 'The full identity system — name-forward, bilingual, and built to survive a signboard and a delivery bag.',
    summaryAr: 'نظام هوية متكامل، ثنائي اللغة، مصمم ليصمد على اللوحة وعلى كيس التوصيل.',
    whatWeDoEn: 'Positioning, logo system, Arabic and Latin typography, colour, packaging direction, signage and a usable brand book.',
    whatWeDoAr: 'التموضع، نظام الشعار، الخطوط العربية واللاتينية، الألوان، التغليف، اللوحات، ودليل هوية عملي.',
    whyEn: 'A restaurant brand is experienced at arm’s length and at forty metres. It has to work at both.',
    whyAr: 'علامة المطعم تُرى عن قرب ومن أربعين مترًا، ويجب أن تنجح في الحالتين.',
    approachEn: 'Discovery, territory exploration, one committed direction, then rollout across every real touchpoint.',
    approachAr: 'استكشاف، اختبار اتجاهات، التزام باتجاه واحد، ثم التطبيق.',
    deliverables: [['Brand positioning', 'تموضع العلامة'], ['Logo and identity system', 'نظام الشعار والهوية'], ['Bilingual typography', 'خطوط ثنائية اللغة'], ['Packaging and signage direction', 'اتجاه التغليف واللوحات'], ['Brand guidelines', 'دليل الهوية']] },

  { slug: 'creative-direction', nameEn: 'Creative Direction', nameAr: 'الإدارة الإبداعية', category: 'creative-branding',
    summaryEn: 'One consistent creative standard across everything the restaurant publishes.',
    summaryAr: 'معيار إبداعي واحد لكل ما ينشره المطعم.',
    whatWeDoEn: 'We set the visual and verbal standard, brief the makers, and review the output — whether it comes from us, your team or a third party.',
    whatWeDoAr: 'نضع المعيار البصري واللغوي، ونوجه المنفذين، ونراجع المخرجات.',
    whyEn: 'Without direction, output drifts — and drift is what makes brands look cheap over time.',
    whyAr: 'بدون إدارة ينحرف الإنتاج، والانحراف يجعل العلامات تبدو رخيصة.',
    approachEn: 'Creative principles, reference boards, briefing templates and a standing review rhythm.',
    approachAr: 'مبادئ إبداعية، لوحات مرجعية، قوالب توجيه، ومراجعة دورية.',
    deliverables: [['Creative principles', 'المبادئ الإبداعية'], ['Art direction boards', 'لوحات الاتجاه الفني'], ['Briefing templates', 'قوالب التوجيه'], ['Output review cycle', 'دورة مراجعة المخرجات']] },

  { slug: 'graphic-design', nameEn: 'Graphic Design', nameAr: 'التصميم الجرافيكي', category: 'creative-branding',
    summaryEn: 'Menus, print, packaging, signage and campaign assets — produced properly.',
    summaryAr: 'قوائم الطعام والمطبوعات والتغليف واللوحات ومواد الحملات، بتنفيذ محترف.',
    whatWeDoEn: 'Day-to-day design production in both Arabic and English, delivered print-ready and to spec.',
    whatWeDoAr: 'إنتاج تصميم يومي بالعربية والإنجليزية، جاهز للطباعة وفق المواصفات.',
    whyEn: 'Arabic typesetting done badly is the fastest way to lose a local audience’s trust.',
    whyAr: 'التنسيق العربي الرديء أسرع طريقة لفقدان ثقة الجمهور المحلي.',
    approachEn: 'Template-led where it should be, bespoke where it matters.',
    approachAr: 'قوالب حيث ينبغي، وتصميم خاص حيث يهم.',
    deliverables: [['Menu design', 'تصميم قائمة الطعام'], ['Print and packaging artwork', 'تصاميم المطبوعات والتغليف'], ['Signage artwork', 'تصاميم اللوحات'], ['Campaign asset production', 'إنتاج مواد الحملات']] },

  { slug: 'photography', nameEn: 'Photography', nameAr: 'التصوير الفوتوغرافي', category: 'creative-branding',
    summaryEn: 'Food and venue photography that sells the dish before it is described.',
    summaryAr: 'تصوير طعام ومكان يبيع الطبق قبل وصفه.',
    whatWeDoEn: 'Art-directed shoots covering menu, interiors, team and detail, delivered retouched and in every crop the channels need.',
    whatWeDoAr: 'جلسات تصوير بإدارة فنية تغطي القائمة والداخل والفريق، مع معالجة وقصاصات جاهزة.',
    whyEn: 'On a delivery app, the photograph is the product.',
    whyAr: 'في تطبيق التوصيل، الصورة هي المنتج.',
    approachEn: 'Pre-production shot list, styled on set with the kitchen, retouched to a consistent grade.',
    approachAr: 'قائمة لقطات مسبقة، تنسيق مع المطبخ، ومعالجة متسقة.',
    deliverables: [['Menu photography', 'تصوير قائمة الطعام'], ['Interior and atmosphere', 'تصوير المكان والأجواء'], ['Team portraits', 'صور الفريق'], ['Retouched delivery in all crops', 'تسليم معالج بكل المقاسات']] },

  { slug: 'video-production', nameEn: 'Video Production', nameAr: 'إنتاج الفيديو', category: 'creative-branding',
    summaryEn: 'Brand films, campaign spots and the short-form video that carries the channel.',
    summaryAr: 'أفلام العلامة وإعلانات الحملات والفيديو القصير الذي يحمل القناة.',
    whatWeDoEn: 'Concept, production and post — from a single-day reel shoot to a full campaign film with bilingual subtitles.',
    whatWeDoAr: 'الفكرة والإنتاج والمونتاج، من تصوير يوم واحد إلى فيلم حملة كامل بترجمة ثنائية.',
    whyEn: 'Video is the only format that can show heat, motion and craft — the three things food photography cannot.',
    whyAr: 'الفيديو وحده يظهر الحرارة والحركة والحرفية.',
    approachEn: 'Treatment first, tight shooting schedule, edit variants cut for each placement.',
    approachAr: 'معالجة أولاً، جدول تصوير محكم، ونسخ مونتاج لكل موضع.',
    deliverables: [['Concept and treatment', 'الفكرة والمعالجة'], ['Production and direction', 'الإنتاج والإخراج'], ['Edit, grade and sound', 'المونتاج والتصحيح والصوت'], ['Bilingual subtitles', 'ترجمة ثنائية اللغة'], ['Platform cut-downs', 'نسخ مخصصة لكل منصة']] },

  { slug: 'reels-short-form', nameEn: 'Reels & Short-Form', nameAr: 'الريلز والفيديو القصير', category: 'creative-branding',
    summaryEn: 'A steady supply of vertical video, produced at the volume the algorithm rewards.',
    summaryAr: 'تدفق ثابت من الفيديو العمودي، بالكم الذي تكافئه الخوارزمية.',
    whatWeDoEn: 'Batch-produced reels from a monthly shoot day, edited with hooks, captions and sound built for each platform.',
    whatWeDoAr: 'إنتاج مجمّع للريلز من يوم تصوير شهري، مع خطافات ونصوص وصوت مناسب.',
    whyEn: 'Short-form rewards consistency far more than it rewards budget.',
    whyAr: 'الفيديو القصير يكافئ الانتظام أكثر من الميزانية.',
    approachEn: 'One shoot day, many edits, tested hooks, published on a fixed weekly rhythm.',
    approachAr: 'يوم تصوير واحد، نسخ متعددة، وإيقاع أسبوعي ثابت.',
    deliverables: [['Monthly reel batch', 'دفعة ريلز شهرية'], ['Hook and caption variants', 'نسخ خطافات ونصوص'], ['Platform-specific exports', 'تصدير لكل منصة']] },

  { slug: 'campaign-creatives', nameEn: 'Campaign Creatives', nameAr: 'إبداعات الحملات', category: 'creative-branding',
    summaryEn: 'The full creative set behind a launch, a season or a promotion.',
    summaryAr: 'المجموعة الإبداعية الكاملة خلف إطلاق أو موسم أو عرض.',
    whatWeDoEn: 'A single idea executed across paid, organic, in-store and print, with every size and language variant produced up front.',
    whatWeDoAr: 'فكرة واحدة تُنفذ عبر المدفوع والعضوي والفرع والمطبوع، بكل المقاسات واللغات.',
    whyEn: 'A campaign that only exists on Instagram is not a campaign.',
    whyAr: 'الحملة التي توجد فقط على إنستغرام ليست حملة.',
    approachEn: 'Idea, key visual, full asset matrix, then production and handover.',
    approachAr: 'الفكرة، المشهد الرئيسي، مصفوفة المواد، ثم الإنتاج.',
    deliverables: [['Campaign idea and key visual', 'الفكرة والمشهد الرئيسي'], ['Full asset matrix', 'مصفوفة المواد الكاملة'], ['In-store and print collateral', 'مواد الفرع والمطبوعات'], ['Bilingual variants', 'نسخ ثنائية اللغة']] },

  { slug: 'menu-development', nameEn: 'Menu Development', nameAr: 'تطوير قائمة الطعام', category: 'restaurant-menu',
    summaryEn: 'Building or rebuilding the menu around what the kitchen can execute and the guest will order.',
    summaryAr: 'بناء القائمة أو إعادة بنائها حول ما يمكن للمطبخ تنفيذه وما سيطلبه الضيف.',
    whatWeDoEn: 'Concept definition, category structure, dish selection, naming and description writing in both languages, and a workable kitchen spec.',
    whatWeDoAr: 'تحديد المفهوم، هيكلة الأقسام، اختيار الأطباق، والتسمية والوصف باللغتين.',
    whyEn: 'An over-extended menu slows the pass, raises waste and confuses the guest — all at once.',
    whyAr: 'القائمة المتضخمة تبطئ الخدمة وترفع الهدر وتربك الضيف.',
    approachEn: 'Work with the chef and the numbers together — never one without the other.',
    approachAr: 'نعمل مع الشيف والأرقام معًا، لا أحدهما دون الآخر.',
    deliverables: [['Menu concept and structure', 'مفهوم القائمة وهيكلها'], ['Dish selection', 'اختيار الأطباق'], ['Bilingual naming and descriptions', 'التسمية والوصف بالعربية والإنجليزية'], ['Kitchen specification', 'مواصفات المطبخ']] },

  { slug: 'menu-engineering', nameEn: 'Menu Engineering', nameAr: 'هندسة قائمة الطعام', category: 'restaurant-menu',
    summaryEn: 'Rearranging the menu so the profitable dishes are the ones guests actually choose.',
    summaryAr: 'إعادة ترتيب القائمة ليختار الضيوف الأطباق الأعلى ربحية.',
    whatWeDoEn: 'Classify every item by popularity and contribution margin, then redesign placement, naming, grouping and layout around that map.',
    whatWeDoAr: 'نصنف كل صنف حسب الشعبية وهامش المساهمة، ثم نعيد تصميم الترتيب والتسمية والتجميع.',
    whyEn: 'Menu engineering is the cheapest margin improvement available to a restaurant — it costs design time, not capital.',
    whyAr: 'هندسة القائمة أرخص تحسين للهامش؛ تكلف وقت تصميم لا رأس مال.',
    approachEn: 'Sales-mix and cost data in, classification map out, then a redesigned menu and a re-measurement after 60 days.',
    approachAr: 'بيانات المبيعات والتكلفة دخلاً، خريطة تصنيف خرجًا، ثم إعادة قياس.',
    deliverables: [['Sales-mix and margin analysis', 'تحليل مزيج المبيعات والهامش'], ['Item classification map', 'خريطة تصنيف الأصناف'], ['Redesigned menu layout', 'تصميم قائمة جديد'], ['Post-launch measurement', 'قياس بعد الإطلاق']] },

  { slug: 'menu-pricing', nameEn: 'Menu Pricing', nameAr: 'تسعير قائمة الطعام', category: 'restaurant-menu',
    summaryEn: 'Pricing that protects margin without pushing the guest to the competitor next door.',
    summaryAr: 'تسعير يحمي الهامش دون دفع الضيف إلى المنافس المجاور.',
    whatWeDoEn: 'Cost-informed pricing with a read on local competitors, psychological price points, and separate logic for dine-in versus delivery.',
    whatWeDoAr: 'تسعير مبني على التكلفة مع قراءة للمنافسين، ومنطق منفصل للصالة والتوصيل.',
    whyEn: 'Delivery commission quietly turns profitable dishes into unprofitable ones unless pricing accounts for it.',
    whyAr: 'عمولة التوصيل تحول الأطباق الرابحة إلى خاسرة دون تسعير يراعيها.',
    approachEn: 'Recipe costs first, then competitor benchmarking, then channel-specific price architecture.',
    approachAr: 'تكاليف الوصفات أولاً، ثم مقارنة المنافسين، ثم بنية سعرية لكل قناة.',
    deliverables: [['Price architecture', 'بنية التسعير'], ['Competitor benchmark', 'مقارنة المنافسين'], ['Delivery channel pricing', 'تسعير قنوات التوصيل'], ['Implementation plan', 'خطة التطبيق']] },

  { slug: 'recipe-costing', nameEn: 'Recipe Costing', nameAr: 'تكلفة الوصفات', category: 'restaurant-menu',
    summaryEn: 'Knowing what every plate costs, to the ingredient.',
    summaryAr: 'معرفة تكلفة كل طبق، حتى مستوى المكوّن.',
    whatWeDoEn: 'Standardised recipe cards with yields, waste factors and portion costs, so pricing and margin decisions rest on real numbers.',
    whatWeDoAr: 'بطاقات وصفات معيارية مع المردود وعوامل الهدر وتكلفة الحصة.',
    whyEn: 'Most restaurants price from instinct. Instinct does not survive a supplier price rise.',
    whyAr: 'معظم المطاعم تسعر بالحدس، والحدس لا يصمد أمام ارتفاع أسعار الموردين.',
    approachEn: 'Build recipe cards with the kitchen, verify yields on the line, then hand over a maintainable costing sheet.',
    approachAr: 'نبني بطاقات الوصفات مع المطبخ ونتحقق من المردود عمليًا.',
    deliverables: [['Standardised recipe cards', 'بطاقات وصفات معيارية'], ['Yield and waste factors', 'عوامل المردود والهدر'], ['Portion cost per dish', 'تكلفة الحصة لكل طبق'], ['Maintainable costing sheet', 'ملف تكلفة قابل للتحديث']] },

  { slug: 'food-cost-analysis', nameEn: 'Food Cost Analysis', nameAr: 'تحليل تكلفة الطعام', category: 'restaurant-menu',
    summaryEn: 'Finding the gap between the food cost you should have and the one you actually have.',
    summaryAr: 'إيجاد الفجوة بين تكلفة الطعام النظرية والفعلية.',
    whatWeDoEn: 'Theoretical versus actual food cost analysis, variance investigation, and a practical list of where the margin is leaking.',
    whatWeDoAr: 'تحليل التكلفة النظرية مقابل الفعلية، وتحقيق في الانحرافات، وقائمة عملية بمواضع التسرب.',
    whyEn: 'A three-point food cost gap can be the entire net margin of the restaurant.',
    whyAr: 'فجوة ثلاث نقاط في التكلفة قد تعادل صافي ربح المطعم بالكامل.',
    approachEn: 'Compare theoretical to actual, then trace the variance to portioning, waste, purchasing or theft.',
    approachAr: 'نقارن النظري بالفعلي ثم نتتبع الانحراف إلى مصدره.',
    deliverables: [['Theoretical vs actual analysis', 'تحليل نظري مقابل فعلي'], ['Variance investigation', 'تحقيق في الانحرافات'], ['Margin leak report', 'تقرير تسرب الهامش'], ['Corrective action plan', 'خطة إجراءات تصحيحية']] },

  { slug: 'restaurant-consulting', nameEn: 'Restaurant Consulting', nameAr: 'استشارات المطاعم', category: 'growth-profitability',
    summaryEn: 'A senior read on the whole business, not just the marketing.',
    summaryAr: 'قراءة شاملة للنشاط بأكمله، لا للتسويق وحده.',
    whatWeDoEn: 'Structured review of concept, menu, pricing, operations, service and marketing, ending in a prioritised plan the operator can act on.',
    whatWeDoAr: 'مراجعة منظمة للمفهوم والقائمة والتسعير والعمليات والخدمة والتسويق، تنتهي بخطة مرتبة.',
    whyEn: 'Marketing cannot fix a concept, a price point or a service problem — it only makes them more visible.',
    whyAr: 'التسويق لا يصلح مفهومًا أو سعرًا أو خدمةً، بل يجعلها أكثر وضوحًا.',
    approachEn: 'On-site review, data request, findings session, prioritised roadmap with owners and dates.',
    approachAr: 'مراجعة ميدانية، طلب بيانات، جلسة نتائج، خارطة طريق مرتبة.',
    deliverables: [['On-site business review', 'مراجعة ميدانية للنشاط'], ['Findings and diagnosis', 'النتائج والتشخيص'], ['Prioritised action roadmap', 'خارطة إجراءات مرتبة'], ['Follow-up review', 'مراجعة متابعة']] },

  { slug: 'cost-control', nameEn: 'Cost Control', nameAr: 'ضبط التكاليف', category: 'growth-profitability',
    summaryEn: 'The routines that keep food and labour cost from drifting month after month.',
    summaryAr: 'الأنظمة التي تمنع تكلفة الطعام والعمالة من الانحراف شهرًا بعد شهر.',
    whatWeDoEn: 'Purchasing discipline, inventory counts, portion control, waste logging and a weekly cost review the management team can run themselves.',
    whatWeDoAr: 'انضباط الشراء، جرد المخزون، ضبط الحصص، تسجيل الهدر، ومراجعة تكلفة أسبوعية.',
    whyEn: 'Cost control is a habit, not a project. The systems have to outlast the consultant.',
    whyAr: 'ضبط التكاليف عادة لا مشروع؛ والأنظمة يجب أن تبقى بعد الاستشاري.',
    approachEn: 'Install the routine, train the team, then step back and audit.',
    approachAr: 'نرسّخ الروتين، ندرب الفريق، ثم ندقق.',
    deliverables: [['Purchasing and receiving process', 'عملية الشراء والاستلام'], ['Inventory and count schedule', 'جدول الجرد'], ['Portion control standards', 'معايير ضبط الحصص'], ['Weekly cost review format', 'نموذج مراجعة أسبوعية']] },

  { slug: 'profitability-analysis', nameEn: 'Profitability Analysis', nameAr: 'تحليل الربحية', category: 'growth-profitability',
    summaryEn: 'Understanding which dishes, dayparts and channels actually make money.',
    summaryAr: 'فهم الأطباق والأوقات والقنوات التي تحقق ربحًا فعليًا.',
    whatWeDoEn: 'Contribution analysis by item, daypart and channel, plus a break-even read that shows what the restaurant needs to cover its fixed costs.',
    whatWeDoAr: 'تحليل المساهمة حسب الصنف والوقت والقناة، مع قراءة نقطة التعادل.',
    whyEn: 'Revenue growth in the wrong channel can reduce profit. Volume is not the same as health.',
    whyAr: 'نمو الإيراد في القناة الخاطئة قد يخفض الربح.',
    approachEn: 'Rebuild the contribution model from POS and cost data, then test scenarios against it.',
    approachAr: 'نعيد بناء نموذج المساهمة من بيانات نقاط البيع والتكلفة.',
    deliverables: [['Contribution model', 'نموذج المساهمة'], ['Daypart and channel analysis', 'تحليل الأوقات والقنوات'], ['Break-even read', 'قراءة نقطة التعادل'], ['Scenario modelling', 'نمذجة السيناريوهات']] },

  { slug: 'performance-analysis', nameEn: 'Performance Analysis', nameAr: 'تحليل الأداء', category: 'growth-profitability',
    summaryEn: 'One monthly report that puts marketing, sales and cost on the same page.',
    summaryAr: 'تقرير شهري واحد يجمع التسويق والمبيعات والتكلفة في صفحة واحدة.',
    whatWeDoEn: 'A consolidated monthly read: traffic, covers, average cheque, channel mix, food cost and marketing return — with a written interpretation, not just charts.',
    whatWeDoAr: 'قراءة شهرية مجمّعة: الحركة، الطلبات، متوسط الفاتورة، مزيج القنوات، تكلفة الطعام، والعائد التسويقي — مع تفسير مكتوب.',
    whyEn: 'Numbers without interpretation do not change decisions.',
    whyAr: 'الأرقام دون تفسير لا تغير القرارات.',
    approachEn: 'Agree the metric set once, report it consistently, and always end with a recommendation.',
    approachAr: 'نتفق على المؤشرات مرة، ونقرر بانتظام، وننتهي دائمًا بتوصية.',
    deliverables: [['Monthly performance report', 'تقرير أداء شهري'], ['Written interpretation', 'تفسير مكتوب'], ['Recommendation list', 'قائمة توصيات'], ['Review session', 'جلسة مراجعة']] },

  { slug: 'growth-strategy', nameEn: 'Growth Strategy', nameAr: 'استراتيجية النمو', category: 'growth-profitability',
    summaryEn: 'The plan for the next twelve months — more covers, more branches, or more margin.',
    summaryAr: 'خطة الاثني عشر شهرًا القادمة: طلبات أكثر، فروع أكثر، أو هامش أعلى.',
    whatWeDoEn: 'Define where growth will come from, what it costs, and in what order to do it — across marketing, menu, channel and expansion.',
    whatWeDoAr: 'نحدد من أين سيأتي النمو وما تكلفته وبأي ترتيب، عبر التسويق والقائمة والقنوات والتوسع.',
    whyEn: 'Doing everything at once is the most common way a good restaurant runs out of cash.',
    whyAr: 'فعل كل شيء دفعة واحدة أشهر طريقة ينفد بها النقد.',
    approachEn: 'Baseline, opportunity sizing, sequenced plan with budget and owners.',
    approachAr: 'خط أساس، تقدير الفرص، خطة متتابعة بميزانية ومسؤوليات.',
    deliverables: [['Growth opportunity map', 'خريطة فرص النمو'], ['12-month sequenced plan', 'خطة متتابعة لـ١٢ شهرًا'], ['Budget and resourcing', 'الميزانية والموارد'], ['Quarterly review rhythm', 'مراجعة ربع سنوية']] },
];

const WORK_CATEGORIES = [
  { slug: 'social', nameEn: 'Social', nameAr: 'التواصل الاجتماعي', order: 1 },
  { slug: 'advertising', nameEn: 'Advertising', nameAr: 'الإعلانات', order: 2 },
  { slug: 'branding', nameEn: 'Branding', nameAr: 'الهوية', order: 3 },
  { slug: 'creative', nameEn: 'Creative', nameAr: 'الإبداع', order: 4 },
  { slug: 'menu', nameEn: 'Menu', nameAr: 'قائمة الطعام', order: 5 },
  { slug: 'restaurant-growth', nameEn: 'Restaurant Growth', nameAr: 'نمو المطاعم', order: 6 },
];

const INSIGHT_CATEGORIES = [
  { slug: 'restaurant-marketing', nameEn: 'Restaurant Marketing', nameAr: 'تسويق المطاعم', order: 1 },
  { slug: 'social-media', nameEn: 'Social Media', nameAr: 'وسائل التواصل', order: 2 },
  { slug: 'advertising', nameEn: 'Advertising', nameAr: 'الإعلانات', order: 3 },
  { slug: 'creative', nameEn: 'Creative', nameAr: 'الإبداع', order: 4 },
  { slug: 'menu-engineering', nameEn: 'Menu Engineering', nameAr: 'هندسة القوائم', order: 5 },
  { slug: 'food-cost', nameEn: 'Food Cost', nameAr: 'تكلفة الطعام', order: 6 },
  { slug: 'profitability', nameEn: 'Profitability', nameAr: 'الربحية', order: 7 },
  { slug: 'restaurant-growth', nameEn: 'Restaurant Growth', nameAr: 'نمو المطاعم', order: 8 },
];

const SYSTEM_STAGES = [
  { step: '01', titleEn: 'MAKE THEM NOTICE', titleAr: 'اجعلهم يلاحظون',
    descriptionEn: 'Attention is the first cost of doing business. We buy it with craft — content, advertising and a feed that stops the scroll in a crowded local market.',
    descriptionAr: 'الانتباه هو أول تكلفة في العمل. نشتريه بالحرفية: محتوى وإعلانات وحساب يوقف التمرير.',
    services: ['Social Media', 'Advertising', 'Content'], order: 1 },
  { step: '02', titleEn: 'MAKE THEM REMEMBER', titleAr: 'اجعلهم يتذكرون',
    descriptionEn: 'Being seen once is noise. Being recognised is a brand. Identity, creative direction, photography and video that hold together everywhere the restaurant appears.',
    descriptionAr: 'الظهور مرة ضجيج، أما أن تُعرف فذلك علامة تجارية: هوية وإدارة إبداعية وتصوير وفيديو متسق.',
    services: ['Branding', 'Creative', 'Photography', 'Video'], order: 2 },
  { step: '03', titleEn: 'MAKE THEM ORDER', titleAr: 'اجعلهم يطلبون',
    descriptionEn: 'Awareness that never becomes a cover is a cost. Campaigns, promotions, menu design and performance marketing that convert interest into an order.',
    descriptionAr: 'الوعي الذي لا يتحول إلى طلب هو تكلفة: حملات وعروض وتصميم قائمة وتسويق أداء.',
    services: ['Campaigns', 'Promotions', 'Menu', 'Performance'], order: 3 },
  { step: '04', titleEn: 'MAKE THEM COME BACK', titleAr: 'اجعلهم يعودون',
    descriptionEn: 'The second visit is where the profit is. Retention, growth strategy and the operational and menu work that makes returning worth it.',
    descriptionAr: 'الزيارة الثانية هي موضع الربح: الاحتفاظ واستراتيجية النمو والعمل على القائمة والتشغيل.',
    services: ['Growth', 'Retention', 'Performance', 'Restaurant Strategy'], order: 4 },
];

const NAVIGATION = [
  { labelEn: 'Work', labelAr: 'أعمالنا', href: '/work', order: 1 },
  { labelEn: 'Services', labelAr: 'خدماتنا', href: '/services', order: 2 },
  { labelEn: 'Restaurant Growth', labelAr: 'نمو المطاعم', href: '/restaurant-growth', order: 3 },
  { labelEn: 'About', labelAr: 'من نحن', href: '/about', order: 4 },
  { labelEn: 'Library', labelAr: 'المكتبة', href: '/library', order: 6 },
  { labelEn: 'Tools', labelAr: 'الأدوات', href: '/tools', order: 7 },
  { labelEn: 'Insights', labelAr: 'رؤى', href: '/insights', order: 5 },
  { labelEn: 'Library', labelAr: 'المكتبة', href: '/library', order: 6 },
  { labelEn: 'Tools', labelAr: 'الأدوات', href: '/tools', order: 7 },
];

const FOOTER_NAV = [
  { labelEn: 'Work', labelAr: 'أعمالنا', href: '/work', order: 1 },
  { labelEn: 'Services', labelAr: 'خدماتنا', href: '/services', order: 2 },
  { labelEn: 'Restaurant Growth', labelAr: 'نمو المطاعم', href: '/restaurant-growth', order: 3 },
  { labelEn: 'About', labelAr: 'من نحن', href: '/about', order: 4 },
  { labelEn: 'Insights', labelAr: 'رؤى', href: '/insights', order: 5 },
  { labelEn: 'Contact', labelAr: 'تواصل معنا', href: '/contact', order: 6 },
  { labelEn: 'Privacy', labelAr: 'الخصوصية', href: '/privacy', order: 7 },
  { labelEn: 'Terms', labelAr: 'الشروط', href: '/terms', order: 8 },
];

function jsonList(items: unknown[]): Prisma.InputJsonValue {
  return items as Prisma.InputJsonValue;
}

async function main() {
  // ---- Admin user -------------------------------------------------------
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 10) throw new Error('ADMIN_PASSWORD must be at least 10 characters.');
    await prisma.adminUser.upsert({
      where: { email: email.toLowerCase() },
      update: {},
      create: {
        email: email.toLowerCase(),
        name: process.env.ADMIN_NAME || 'Noriva Admin',
        passwordHash: await bcrypt.hash(password, 12),
        role: 'OWNER',
      },
    });
    console.log(`✓ admin user ready: ${email}`);
  } else {
    console.log('! ADMIN_EMAIL / ADMIN_PASSWORD not set — no admin user created.');
  }

  // ---- Site settings ----------------------------------------------------
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      companyNameEn: 'Noriva',
      companyNameAr: 'نوريفا',
      taglineEn: 'Restaurant · Creative · Growth',
      taglineAr: 'مطاعم · إبداع · نمو',
      descriptionEn: 'Noriva is a restaurant-specialised creative and growth company. We build the attention that turns a restaurant brand, experience and business into growth.',
      descriptionAr: 'نوريفا شركة إبداع ونمو متخصصة في المطاعم. نبني الانتباه الذي يحوّل العلامة والتجربة والنشاط إلى نمو.',
      inquiryEmail: process.env.CONTACT_EMAIL || '',
      contactEmail: process.env.CONTACT_EMAIL || '',
      footerDescriptionEn: 'Restaurant marketing, creative and growth. We make restaurants impossible to ignore.',
      footerDescriptionAr: 'تسويق وإبداع ونمو للمطاعم. نجعل المطاعم مستحيلة التجاهل.',
      copyrightEn: `© ${new Date().getFullYear()} Noriva. All rights reserved.`,
      copyrightAr: `© ${new Date().getFullYear()} نوريفا. جميع الحقوق محفوظة.`,
      seoTitleEn: 'Noriva — Restaurant Marketing, Creative & Growth',
      seoTitleAr: 'نوريفا — تسويق وإبداع ونمو المطاعم',
      seoDescriptionEn: 'A restaurant-specialised creative and growth company. Social, advertising, branding, menu and profitability work for restaurants.',
      seoDescriptionAr: 'شركة إبداع ونمو متخصصة في المطاعم: التواصل الاجتماعي والإعلانات والهوية وقوائم الطعام والربحية.',
    },
  });

  // ---- Homepage ---------------------------------------------------------
  await prisma.homepageContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroEyebrowEn: 'Restaurant Marketing · Creative · Advertising · Growth',
      heroEyebrowAr: 'تسويق المطاعم · إبداع · إعلانات · نمو',
      heroHeadlineEn: 'WE MAKE RESTAURANTS\nIMPOSSIBLE TO IGNORE.',
      heroHeadlineAr: 'نجعل المطاعم\nمستحيلة التجاهل.',
      heroSubtitleEn: 'We build the attention that turns a restaurant brand, an experience and a business into growth.',
      heroSubtitleAr: 'نبني الانتباه الذي يحوّل العلامة والتجربة والنشاط إلى نمو.',
      heroPrimaryCtaEn: 'Start a Project',
      heroPrimaryCtaAr: 'ابدأ مشروعك',
      heroSecondaryCtaEn: 'Explore Our Work',
      heroSecondaryCtaAr: 'استعرض أعمالنا',
      statementEn: "A RESTAURANT ISN'T JUST A PLACE TO EAT.\nIT'S A BRAND.\nAN EXPERIENCE.\nA BUSINESS.\nWE BUILD THE ATTENTION THAT TURNS ALL THREE INTO GROWTH.",
      statementAr: 'المطعم ليس مجرد مكان للطعام.\nإنه علامة تجارية.\nوتجربة.\nونشاط تجاري.\nنحن نبني الانتباه الذي يحوّل الثلاثة إلى نمو.',
      statementSupportEn: 'Most agencies market restaurants. We understand how they work — the menu, the margin, the pass and the P&L behind every campaign we run.',
      statementSupportAr: 'معظم الوكالات تسوّق للمطاعم. نحن نفهم كيف تعمل: القائمة والهامش والخدمة والأرباح خلف كل حملة ننفذها.',
      systemHeadlineEn: 'THE NORIVA SYSTEM',
      systemHeadlineAr: 'نظام نوريفا',
      intelligenceHeadlineEn: 'MARKETING THAT READS THE P&L.',
      intelligenceHeadlineAr: 'تسويق يقرأ قائمة الأرباح والخسائر.',
      intelligenceBodyEn: 'We work at the point where marketing meets the numbers. A campaign that fills the room with your lowest-margin dish is not a win — and most agencies will never tell you that, because most agencies never look.',
      intelligenceBodyAr: 'نعمل عند النقطة التي يلتقي فيها التسويق بالأرقام. الحملة التي تملأ الصالة بأقل أطباقك ربحية ليست نجاحًا — ومعظم الوكالات لن تخبرك بذلك، لأنها لا تنظر أصلًا.',
      intelligenceItems: jsonList([
        { labelEn: 'Menu', labelAr: 'قائمة الطعام' },
        { labelEn: 'Pricing', labelAr: 'التسعير' },
        { labelEn: 'Food Cost', labelAr: 'تكلفة الطعام' },
        { labelEn: 'Operations', labelAr: 'العمليات' },
        { labelEn: 'Profitability', labelAr: 'الربحية' },
        { labelEn: 'Customer Acquisition', labelAr: 'اكتساب العملاء' },
        { labelEn: 'Marketing', labelAr: 'التسويق' },
        { labelEn: 'Performance', labelAr: 'الأداء' },
      ]),
      ctaHeadlineEn: "LET'S TALK ABOUT YOUR RESTAURANT.",
      ctaHeadlineAr: 'لنتحدث عن مطعمك.',
      ctaDescriptionEn: 'Tell us what you are building. We will come back with a point of view, not a template.',
      ctaDescriptionAr: 'أخبرنا بما تبنيه، وسنعود إليك برأي واضح لا بقالب جاهز.',
      ctaLabelEn: 'Start a Project',
      ctaLabelAr: 'ابدأ مشروعك',
    },
  });

  // ---- Taxonomies -------------------------------------------------------
  for (const c of SERVICE_CATEGORIES) {
    await prisma.serviceCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  for (const c of WORK_CATEGORIES) {
    await prisma.workCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  for (const c of INSIGHT_CATEGORIES) {
    await prisma.insightCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // ---- Services ---------------------------------------------------------
  let order = 0;
  for (const s of SERVICES) {
    const category = await prisma.serviceCategory.findUnique({ where: { slug: s.category } });
    order += 1;
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        nameEn: s.nameEn,
        nameAr: s.nameAr,
        categoryId: category?.id ?? null,
        summaryEn: s.summaryEn,
        summaryAr: s.summaryAr,
        heroHeadlineEn: s.nameEn.toUpperCase() + '.',
        heroHeadlineAr: s.nameAr,
        heroDescriptionEn: s.summaryEn,
        heroDescriptionAr: s.summaryAr,
        whatWeDoEn: s.whatWeDoEn,
        whatWeDoAr: s.whatWeDoAr,
        whyItMattersEn: s.whyEn,
        whyItMattersAr: s.whyAr,
        approachEn: s.approachEn,
        approachAr: s.approachAr,
        deliverables: jsonList(s.deliverables.map(([en, ar]) => ({ labelEn: en, labelAr: ar }))),
        seoTitleEn: `${s.nameEn} for Restaurants — Noriva`,
        seoTitleAr: `${s.nameAr} للمطاعم — نوريفا`,
        seoDescriptionEn: s.summaryEn,
        seoDescriptionAr: s.summaryAr,
        status: 'PUBLISHED',
        order,
      },
    });
  }

  // ---- System stages ----------------------------------------------------
  for (const s of SYSTEM_STAGES) {
    const exists = await prisma.systemStage.findFirst({ where: { step: s.step } });
    if (!exists) {
      await prisma.systemStage.create({ data: { ...s, services: jsonList(s.services) } });
    }
  }

  // ---- Navigation -------------------------------------------------------
  for (const n of NAVIGATION) {
    const exists = await prisma.navigationItem.findFirst({ where: { href: n.href, location: 'header' } });
    if (!exists) await prisma.navigationItem.create({ data: { ...n, location: 'header' } });
  }
  for (const n of FOOTER_NAV) {
    const exists = await prisma.navigationItem.findFirst({ where: { href: n.href, location: 'footer' } });
    if (!exists) await prisma.navigationItem.create({ data: { ...n, location: 'footer' } });
  }

  // ---- Editorial pages --------------------------------------------------
  const pages: { key: string; titleEn: string; titleAr: string; bodyEn: string; bodyAr: string; content?: Prisma.InputJsonValue }[] = [
    {
      key: 'about',
      titleEn: "WE'RE NOT JUST\nANOTHER MARKETING AGENCY.",
      titleAr: 'لسنا مجرد\nوكالة تسويق أخرى.',
      bodyEn: 'Noriva is a creative and growth company built specifically for restaurants. We work across marketing, advertising, branding and the commercial side of the business — the menu, the pricing and the margin that most agencies never look at.',
      bodyAr: 'نوريفا شركة إبداع ونمو بُنيت خصيصًا للمطاعم. نعمل عبر التسويق والإعلان والهوية والجانب التجاري للنشاط: القائمة والتسعير والهامش الذي لا تنظر إليه معظم الوكالات.',
      content: {
        sections: [
          { key: 'who', titleEn: 'Who We Are', titleAr: 'من نحن',
            bodyEn: 'A restaurant-specialised creative and growth company. We do not split our attention across every industry — restaurants are the whole practice.',
            bodyAr: 'شركة إبداع ونمو متخصصة في المطاعم. لا نوزّع تركيزنا على كل القطاعات — المطاعم هي كامل عملنا.' },
          { key: 'believe', titleEn: 'What We Believe', titleAr: 'بماذا نؤمن',
            bodyEn: 'That attention is worthless if it does not arrive at a profitable table. That a beautiful campaign for an unprofitable dish is a failure. That the work should be judged on the restaurant’s numbers, not on the agency’s.',
            bodyAr: 'نؤمن أن الانتباه بلا قيمة إن لم يصل إلى طاولة رابحة، وأن حملة جميلة لطبق خاسر هي فشل، وأن العمل يُقاس بأرقام المطعم لا بأرقام الوكالة.' },
          { key: 'think', titleEn: 'How We Think', titleAr: 'كيف نفكر',
            bodyEn: 'Commercially first, creatively always. We start from the constraint — the margin, the kitchen capacity, the catchment — and make the most interesting work possible inside it.',
            bodyAr: 'تجاريًا أولًا، وإبداعيًا دائمًا. نبدأ من القيد: الهامش، طاقة المطبخ، النطاق الجغرافي، ثم ننتج أفضل عمل ممكن داخله.' },
          { key: 'approach', titleEn: 'Our Approach', titleAr: 'منهجيتنا',
            bodyEn: 'Understand the business, define what growth actually means for it, build the creative and the media around that definition, then measure honestly and adjust.',
            bodyAr: 'نفهم النشاط، ونحدد معنى النمو له فعليًا، ونبني الإبداع والإعلام حول ذلك التعريف، ثم نقيس بصدق ونعدّل.' },
          { key: 'expertise', titleEn: 'Restaurant Expertise', titleAr: 'خبرة في المطاعم',
            bodyEn: 'Menu development and engineering, recipe costing, food cost analysis, pricing, cost control and profitability analysis — alongside the marketing. This is what lets us tell you when a campaign is the wrong answer.',
            bodyAr: 'تطوير وهندسة القوائم، وتكلفة الوصفات، وتحليل تكلفة الطعام، والتسعير، وضبط التكاليف، وتحليل الربحية — إلى جانب التسويق. هذا ما يتيح لنا إخبارك حين تكون الحملة إجابة خاطئة.' },
        ],
      },
    },
    {
      key: 'restaurant-growth',
      titleEn: "WE DON'T JUST MARKET RESTAURANTS.\nWE UNDERSTAND HOW THEY WORK.",
      titleAr: 'نحن لا نسوّق للمطاعم فقط.\nنحن نفهم كيف تعمل.',
      bodyEn: 'A campaign is a lever, not a strategy. Before we spend a riyal of your media budget, we want to know which dishes carry your margin, which dayparts are soft, what delivery commission is doing to your contribution, and what the kitchen can actually absorb on a Friday night.',
      bodyAr: 'الحملة أداة لا استراتيجية. قبل أن ننفق ريالًا من ميزانيتك الإعلانية، نريد أن نعرف أي الأطباق تحمل هامشك، وأي الأوقات ضعيفة، وماذا تفعل عمولة التوصيل بمساهمتك، وما الذي يستطيع المطبخ استيعابه فعلًا في ليلة جمعة.',
      content: {
        pillars: [
          { titleEn: 'Menu', titleAr: 'قائمة الطعام', bodyEn: 'Structure, naming, engineering and layout — the highest-leverage asset you own.', bodyAr: 'الهيكل والتسمية والهندسة والتصميم — أعلى أصولك تأثيرًا.' },
          { titleEn: 'Pricing', titleAr: 'التسعير', bodyEn: 'Cost-informed, competitor-aware, and separately modelled for dine-in and delivery.', bodyAr: 'مبني على التكلفة، واعٍ بالمنافسين، ومنمذج بشكل منفصل للصالة والتوصيل.' },
          { titleEn: 'Food Cost', titleAr: 'تكلفة الطعام', bodyEn: 'Theoretical versus actual, and the discipline that closes the gap between them.', bodyAr: 'النظري مقابل الفعلي، والانضباط الذي يغلق الفجوة بينهما.' },
          { titleEn: 'Operations', titleAr: 'العمليات', bodyEn: 'What the kitchen and the floor can sustain when the marketing works.', bodyAr: 'ما يستطيع المطبخ والصالة تحمّله حين ينجح التسويق.' },
          { titleEn: 'Profitability', titleAr: 'الربحية', bodyEn: 'Contribution by item, daypart and channel — not just top-line revenue.', bodyAr: 'المساهمة حسب الصنف والوقت والقناة، لا الإيراد الإجمالي فقط.' },
          { titleEn: 'Customer Acquisition', titleAr: 'اكتساب العملاء', bodyEn: 'What a new guest costs, and what they are worth on the second visit.', bodyAr: 'ما يكلفه ضيف جديد، وما يساويه في الزيارة الثانية.' },
          { titleEn: 'Marketing', titleAr: 'التسويق', bodyEn: 'Brand, content and campaigns built on top of all of the above.', bodyAr: 'العلامة والمحتوى والحملات مبنية فوق كل ما سبق.' },
          { titleEn: 'Performance', titleAr: 'الأداء', bodyEn: 'Measured against the P&L, reported monthly, interpreted in writing.', bodyAr: 'مقاس مقابل الأرباح والخسائر، ويُقرَّر شهريًا بتفسير مكتوب.' },
        ],
      },
    },
    {
      key: 'contact',
      titleEn: "LET'S TALK ABOUT\nYOUR RESTAURANT.",
      titleAr: 'لنتحدث عن\nمطعمك.',
      bodyEn: 'Tell us where the restaurant is today and where you want it to be. We will come back quickly, and honestly.',
      bodyAr: 'أخبرنا أين مطعمك اليوم وأين تريده أن يكون. سنعود إليك بسرعة، وبصدق.',
    },
    {
      key: 'start-a-project',
      titleEn: 'START A PROJECT',
      titleAr: 'ابدأ مشروعك',
      bodyEn: 'Seven short steps. The more you tell us, the sharper our first response will be.',
      bodyAr: 'سبع خطوات قصيرة. كلما أخبرتنا أكثر، كان ردنا الأول أدق.',
    },
    {
      key: 'work',
      titleEn: 'SELECTED WORK',
      titleAr: 'أعمال مختارة',
      bodyEn: 'Restaurant brands, campaigns and growth work.',
      bodyAr: 'علامات ومطاعم وحملات وأعمال نمو.',
    },
    {
      key: 'services',
      titleEn: 'WHAT WE DO',
      titleAr: 'ما الذي نقوم به',
      bodyEn: 'Five practices, built to work together: marketing and social, advertising and performance, creative and branding, restaurant and menu, growth and profitability.',
      bodyAr: 'خمس ممارسات مصممة للعمل معًا: التسويق والتواصل، الإعلانات والأداء، الإبداع والهوية، المطعم والقائمة، النمو والربحية.',
    },
    {
      key: 'insights',
      titleEn: 'INSIGHTS',
      titleAr: 'رؤى',
      bodyEn: 'Writing on restaurant marketing, menu engineering, food cost and growth.',
      bodyAr: 'كتابات في تسويق المطاعم وهندسة القوائم وتكلفة الطعام والنمو.',
    },
    {
      key: 'library',
      titleEn: 'Library',
      titleAr: 'المكتبة',
      bodyEn: 'Templates, models and guides from the Noriva team. Edit this introduction, and add resources, from the Noriva Admin.',
      bodyAr: 'قوالب ونماذج وأدلة من فريق نوريفا. يمكنك تعديل هذه المقدمة وإضافة الموارد من لوحة تحكم نوريفا.',
    },
    {
      key: 'tools',
      titleEn: 'Tools',
      titleAr: 'الأدوات',
      bodyEn: 'Interactive calculators built around the numbers that decide a result. Edit this introduction, and add tools, from the Noriva Admin.',
      bodyAr: 'حاسبات تفاعلية مبنية على الأرقام التي تصنع الفرق. يمكنك تعديل هذه المقدمة وإضافة الأدوات من لوحة تحكم نوريفا.',
    },
    {
      key: 'privacy',
      titleEn: 'Privacy Policy',
      titleAr: 'سياسة الخصوصية',
      bodyEn: 'This page is a placeholder. Replace this text from the Noriva Admin with your reviewed privacy policy before launch.\n\nWhat we collect: when you submit an inquiry or contact message we store the details you provide — your name, business, contact details, the description of your request and any files you attach — so that our team can respond.\n\nHow we use it: solely to respond to your inquiry and to contact you about the work you asked about. We do not sell your data.\n\nAttachments: files you upload with an inquiry are stored privately and are accessible only to authorised Noriva staff.\n\nContact: to request deletion of your data, write to the contact address shown on this site.',
      bodyAr: 'هذه الصفحة نص مبدئي. استبدله من لوحة تحكم نوريفا بسياسة الخصوصية المعتمدة قبل الإطلاق.\n\nما نجمعه: عند إرسال طلب أو رسالة تواصل نحفظ البيانات التي تزودنا بها — الاسم والنشاط وبيانات التواصل ووصف الطلب وأي ملفات مرفقة — ليتمكن فريقنا من الرد.\n\nكيف نستخدمها: للرد على طلبك والتواصل معك بشأن العمل المطلوب فقط. نحن لا نبيع بياناتك.\n\nالمرفقات: تُحفظ الملفات التي ترفعها بشكل خاص ولا يصل إليها إلا موظفو نوريفا المخوّلون.\n\nللتواصل: لطلب حذف بياناتك، راسلنا على عنوان التواصل الموضح في الموقع.',
    },
    {
      key: 'terms',
      titleEn: 'Terms of Use',
      titleAr: 'شروط الاستخدام',
      bodyEn: 'This page is a placeholder. Replace this text from the Noriva Admin with your reviewed terms before launch.\n\nUse of this site: the content on this website is provided for information about Noriva and its services. Submitting an inquiry does not create a contract; any engagement begins only with a written agreement between you and Noriva.\n\nIntellectual property: all brand assets, photography and written content on this site belong to Noriva or to its clients and may not be reproduced without permission.',
      bodyAr: 'هذه الصفحة نص مبدئي. استبدله من لوحة تحكم نوريفا بالشروط المعتمدة قبل الإطلاق.\n\nاستخدام الموقع: المحتوى المعروض هنا لغرض التعريف بنوريفا وخدماتها. إرسال طلب لا ينشئ عقدًا؛ ولا يبدأ أي تعاقد إلا باتفاق مكتوب بينك وبين نوريفا.\n\nالملكية الفكرية: جميع عناصر الهوية والصور والمحتوى المكتوب في هذا الموقع مملوكة لنوريفا أو لعملائها ولا يجوز إعادة إنتاجها دون إذن.',
    },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { key: p.key },
      update: {},
      create: { ...p, content: p.content ?? {} },
    });
  }

  console.log('✓ seed complete');
  console.log(`  ${SERVICES.length} services · ${SERVICE_CATEGORIES.length} service categories · ${pages.length} pages`);
  console.log('  No projects, case studies, statistics or testimonials were created — real content only.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
