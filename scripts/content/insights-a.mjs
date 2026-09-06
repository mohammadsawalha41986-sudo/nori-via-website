/**
 * Knowledge centre, part A: strategy, concept, menu and cost.
 *
 * These are full articles, not summaries. Each is written natively in both
 * languages rather than translated, and each follows the same structure:
 * an opening that states the problem, sections that work it through, practical
 * recommendations, and a closing that says what to do next.
 *
 * No client, benchmark, survey result or industry statistic appears in any
 * article. Where a number is used it is arithmetic inside a worked example and
 * is labelled as illustrative.
 *
 * Shape: { slug, categorySlug, tags, daysAgo, titleEn/Ar, excerptEn/Ar,
 *          contentEn/Ar }
 */

export const INSIGHTS_A = [
  {
    slug: 'reading-a-menu-as-a-commercial-document',
    categorySlug: 'menu-pricing',
    tags: ['menu', 'pricing', 'profitability'],
    daysAgo: 6,
    titleEn: 'Reading a menu as a commercial document',
    titleAr: 'قراءة القائمة بوصفها وثيقة تجارية',
    excerptEn:
      'A menu is the only document every guest reads and the only one that sets revenue and cost at the same time. Here is how to read yours as a commercial instrument rather than a list.',
    excerptAr:
      'القائمة هي الوثيقة الوحيدة التي يقرأها كل ضيف، والوحيدة التي تحدد الإيراد والتكلفة معاً. إليك كيف تقرأ قائمتك كأداة تجارية لا كقائمة أصناف.',
    contentEn: `Almost every restaurant treats its menu as a design object. It is proofread, laid out, printed and then left alone until something changes in the kitchen. Meanwhile it is quietly doing the two things that decide the business: setting what guests are likely to order, and setting what those orders cost to produce.

## What a commercial reading actually means

A commercial reading asks four questions of every item on the list.

**How often is it ordered?** Not whether it is loved, but its share of sales in its category over a representative period. A period that includes a holiday, a closure or a promotion is not representative.

**What does it contribute?** Selling price minus the cost of the ingredients that go into it, in money rather than as a percentage. Percentage is a ratio; the business banks the money.

**What does it cost the kitchen?** Preparation time, station load and whether it uses ingredients that appear nowhere else on the list. An item with a sole-use ingredient carries a waste risk the costing sheet rarely shows.

**What is it for?** Some items exist to anchor a price band, to signal a cuisine or to give a group a safe option. These are legitimate roles, but they should be deliberate.

## The two-axis view

Place each item on two axes: popularity on one, contribution on the other. Four groups appear, and each has a different instruction.

High popularity and high contribution items are the business. They should be the easiest to find on the page, the best described, and the most protected from a supplier change nobody noticed.

High popularity and low contribution items are the ones worth working on. Because volume already exists, a small change to specification, portion, garnish or price moves real money. This is where most of the recoverable value in a menu sits.

Low popularity and high contribution items are usually a presentation problem, not a product problem. Before retiring one, try moving it, renaming it, describing it better, or training the floor to recommend it.

Low popularity and low contribution items are a decision. Each one still consumes stock, prep, training and menu space. Some earn their place as a signal or as a group-safe option. The rest should leave.

## A worked example

The arithmetic below is illustrative — it is not drawn from any business.

Take two items. Item A sells for 45 and costs 12, so it contributes 33. Item B sells for 28 and costs 6, so it contributes 22. Item B has the better food cost ratio — 21 per cent against 27 per cent — and on a ratio-driven menu review it would look like the healthier item.

Now add volume. Item A sells 300 times a month and contributes 9,900. Item B sells 150 times and contributes 3,300. The item with the worse ratio is producing three times the money.

This is the single most common error in menu management: optimising a percentage rather than the total contribution the menu actually generates.

## Where the menu is read, not just written

A menu is also a physical object read in specific conditions. Two minutes, in the venue's light, often by someone who is hungry and talking. Sequence and hierarchy matter as much as content.

Categories are read in order, and the first two items in each category are read most carefully. Long descriptions are skimmed. A column of aligned prices invites the guest to read the menu by price rather than by dish. None of these are style opinions; they change what gets ordered.

## Practical recommendations

1. Pull a full trading period of sales by item, and pair it with a current cost per item. Without both, no reading is possible.
2. Rank by contribution in money, then by volume. Look at the top and bottom ten of each list before looking at anything else.
3. Work the high-volume, low-contribution group first. It is where the same effort returns the most.
4. Count your sole-use ingredients. Each one is a waste risk that the costing sheet does not show.
5. Re-measure after the change. A menu decision that is never re-measured is an opinion that has been printed.

## In short

The menu is the highest-leverage document in the business and the one most often managed by instinct. Reading it commercially does not require new software or a large project — it requires sales data, item costs and a willingness to act on what the two say together.`,
    contentAr: `يتعامل كل مطعم تقريباً مع قائمته بوصفها عملاً تصميمياً: تُراجَع لغوياً وتُنسَّق وتُطبع ثم تُترك حتى يتغير شيء في المطبخ. وهي في الأثناء تؤدي بهدوء الأمرين اللذين يحسمان المشروع: تحديد ما يُرجَّح أن يطلبه الضيوف، وتحديد تكلفة إنتاج تلك الطلبات.

## ماذا تعني القراءة التجارية فعلاً

تطرح القراءة التجارية أربعة أسئلة على كل صنف في القائمة.

**كم مرة يُطلب؟** ليس هل هو محبوب، بل ما حصته من مبيعات تصنيفه خلال فترة ممثِّلة. والفترة التي تتضمن عطلة أو إغلاقاً أو عرضاً ترويجياً ليست ممثِّلة.

**كم يساهم؟** سعر البيع ناقص تكلفة المكونات الداخلة فيه، بالمال لا بالنسبة المئوية. فالنسبة نسبة، والمشروع يودع المال.

**كم يكلّف المطبخ؟** زمن التحضير وحمل المحطة، وما إذا كان يستخدم مكونات لا تظهر في أي مكان آخر من القائمة. فالصنف ذو المكوّن الوحيد الاستخدام يحمل مخاطر هدر نادراً ما تُظهرها ورقة التكلفة.

**ما وظيفته؟** بعض الأصناف موجود لتثبيت نطاق سعري، أو للدلالة على مطبخ معين، أو لمنح المجموعات خياراً آمناً. وهذه أدوار مشروعة، لكن ينبغي أن تكون مقصودة.

## المنظور ثنائي المحور

ضع كل صنف على محورين: الإقبال على أحدهما والمساهمة على الآخر. تظهر أربع مجموعات، ولكل منها تعليمات مختلفة.

الأصناف عالية الإقبال وعالية المساهمة هي المشروع نفسه. ينبغي أن تكون الأسهل عثوراً عليها في الصفحة، والأفضل وصفاً، والأكثر حمايةً من تغيير مورّد لم ينتبه له أحد.

الأصناف عالية الإقبال ومنخفضة المساهمة هي التي تستحق العمل. فبما أن الحجم موجود أصلاً، يحرّك أي تغيير صغير في المواصفات أو الحصة أو التقديم أو السعر مالاً حقيقياً. وهنا تقع معظم القيمة القابلة للاسترداد في القائمة.

الأصناف منخفضة الإقبال وعالية المساهمة مشكلة عرض غالباً لا مشكلة منتج. وقبل سحب أي منها، جرّب نقله أو إعادة تسميته أو تحسين وصفه أو تدريب الصالة على التوصية به.

الأصناف منخفضة الإقبال ومنخفضة المساهمة قرار. فكل منها ما زال يستهلك مخزوناً وتحضيراً وتدريباً ومساحة في القائمة. بعضها يستحق مكانه كإشارة أو كخيار آمن للمجموعات، وما تبقى ينبغي أن يخرج.

## مثال محسوب

الحساب أدناه توضيحي وليس مأخوذاً من أي مشروع.

خذ صنفين. الصنف (أ) يُباع بـ45 وتكلفته 12، فمساهمته 33. والصنف (ب) يُباع بـ28 وتكلفته 6، فمساهمته 22. نسبة تكلفة الصنف (ب) أفضل — 21٪ مقابل 27٪ — وفي مراجعة قائمة قائمة على النسب سيبدو الصنف الأصح.

الآن أضف الحجم. يُباع الصنف (أ) 300 مرة شهرياً فيساهم بـ9,900، ويُباع الصنف (ب) 150 مرة فيساهم بـ3,300. الصنف ذو النسبة الأسوأ ينتج ثلاثة أضعاف المال.

هذا أشيع خطأ في إدارة القوائم: تحسين نسبة مئوية بدل إجمالي المساهمة الذي تولّده القائمة فعلاً.

## أين تُقرأ القائمة لا أين تُكتب

القائمة أيضاً جسم مادي يُقرأ في ظروف محددة: دقيقتان، في إضاءة المكان، وغالباً من شخص جائع يتحدث. والتسلسل والهرمية لا يقلان أهمية عن المحتوى.

تُقرأ التصنيفات بالترتيب، وأول صنفين في كل تصنيف يُقرآن بعناية أكبر. والأوصاف الطويلة تُتصفح سريعاً. وعمود الأسعار المحاذى يدفع الضيف لقراءة القائمة بالسعر لا بالطبق. وليست هذه آراء ذوقية، بل تغيّر ما يُطلب فعلاً.

## توصيات عملية

1. استخرج فترة تشغيل كاملة من المبيعات حسب الصنف، واقرنها بتكلفة حالية لكل صنف. فبلا الاثنين معاً لا قراءة ممكنة.
2. رتّب حسب المساهمة بالمال ثم حسب الحجم. وانظر إلى أعلى وأدنى عشرة في كل قائمة قبل النظر إلى أي شيء آخر.
3. اعمل على مجموعة الحجم العالي والمساهمة المنخفضة أولاً، فهي حيث يعود الجهد نفسه بأكبر قدر.
4. أحصِ مكوناتك وحيدة الاستخدام. كل واحد منها مخاطرة هدر لا تُظهرها ورقة التكلفة.
5. أعد القياس بعد التغيير. فقرار القائمة الذي لا يُعاد قياسه رأي طُبع.

## باختصار

القائمة أعلى وثائق المشروع تأثيراً وأكثرها إدارة بالحدس. والقراءة التجارية لها لا تتطلب برمجيات جديدة ولا مشروعاً كبيراً، بل تتطلب بيانات مبيعات وتكاليف أصناف واستعداداً للتصرف بناء على ما يقولانه معاً.`,
  },
  {
    slug: 'theoretical-versus-actual-food-cost',
    categorySlug: 'finance-profitability',
    tags: ['food cost', 'cost control', 'operations'],
    daysAgo: 13,
    titleEn: 'Theoretical versus actual food cost: reading the gap',
    titleAr: 'تكلفة الطعام النظرية مقابل الفعلية: قراءة الفجوة',
    excerptEn:
      'The difference between what your recipes say you should have spent and what you actually spent is the most useful number in the kitchen — and the one least often calculated.',
    excerptAr:
      'الفرق بين ما تقول وصفاتك إنك كان يجب أن تنفقه وما أنفقته فعلاً هو أنفع رقم في المطبخ، وأقلها حساباً.',
    contentEn: `Most operators know their food cost percentage. Far fewer know whether that number is the one their recipes predicted, and almost none know why the two differ. The gap between theoretical and actual food cost is where portioning, waste, receiving errors, unrecorded staff meals and theft all live — and none of them announce themselves on the P&L.

## The two numbers

**Theoretical food cost** is arithmetic. Take every item sold in the period, multiply by its costed recipe, and add them up. That is what the sales mix should have consumed.

**Actual food cost** is inventory. Opening stock plus purchases minus closing stock. That is what actually left the store.

Both are needed. Theoretical alone tells you what should have happened. Actual alone tells you what happened without telling you whether it was reasonable.

## Why the gap matters more than the level

A food cost of 32 per cent means very little on its own. Concept, menu mix and price position all move it. But a theoretical of 29 per cent against an actual of 34 per cent means something precise: five percentage points of food left the store without being sold at the price the recipe assumed.

That gap has a small number of possible causes:

**Portioning drift.** The most common and the most correctable. If the recipe says 180 grams and the line serves 210, every plate carries an unbudgeted cost.

**Waste and spoilage.** Over-ordering, poor rotation, prep for demand that did not arrive.

**Yield assumptions.** A costing sheet that assumes a yield the kitchen does not achieve is not a control failure; it is a costing failure.

**Receiving.** Short deliveries accepted, price increases not caught, weight not checked.

**Unrecorded consumption.** Staff meals, comps, remakes and tasting that leave stock without a sale.

**Theft.** Real, but the last thing to conclude rather than the first, because the other five explain most gaps.

## Working the gap

Do not try to close a gap in one move. Attribute it first.

Start by category. Meat, seafood, dairy, produce and beverage behave differently and fail differently. A gap concentrated in produce is almost always waste and yield. A gap concentrated in high-value protein is portioning or receiving. A gap spread evenly across everything is usually a counting or a recipe-accuracy problem, not an operational one.

Then test the costing sheets themselves. In a surprising number of kitchens, part of the gap is that the theoretical number is wrong — sub-recipes missing, yields optimistic, pack sizes out of date.

Only after those two steps is it worth investigating people.

## A practical routine

1. **Count consistently.** The same person, the same order, the same day of the week, the same level of detail. An inconsistent count produces a gap that is measuring the counter, not the kitchen.
2. **Cost the top items accurately.** You do not need every item perfect on day one. Cost the twenty items that make up most of your volume and the theoretical number becomes usable.
3. **Log waste for one week per quarter.** A permanent waste log becomes paperwork. A short, intense one produces information.
4. **Check portion weights during service, not before it.** A pre-service check measures intent; a mid-service check measures behaviour.
5. **Review the gap monthly, at the same point in the cycle.** Trend matters more than any single month.

## What to expect

A gap that closes to zero usually means the count or the costing is wrong, not that the kitchen is perfect. Some difference is normal — trim, natural loss, small remakes. What matters is whether the gap is stable and explainable. A stable, understood gap is a controlled kitchen. A moving one is a kitchen where something is changing that nobody has named.

## In short

Food cost percentage is a headline. The theoretical-versus-actual gap is the diagnosis. If you only have the appetite to build one new routine this quarter, build the one that produces this number every month.`,
    contentAr: `يعرف معظم المشغّلين نسبة تكلفة الطعام لديهم، وأقل منهم بكثير من يعرف ما إذا كان ذلك الرقم هو ما توقعته وصفاته، ويكاد لا يعرف أحد سبب اختلاف الاثنين. والفجوة بين التكلفة النظرية والفعلية هي موضع أخطاء الحصص والهدر والاستلام ووجبات الفريق غير المسجلة والفاقد، ولا يعلن أي منها عن نفسه في قائمة الأرباح والخسائر.

## الرقمان

**تكلفة الطعام النظرية** عملية حسابية: خذ كل صنف بيع في الفترة، واضربه في تكلفة وصفته، ثم اجمع. هذا ما كان ينبغي أن يستهلكه مزيج المبيعات.

**تكلفة الطعام الفعلية** جرد: مخزون افتتاحي زائد المشتريات ناقص المخزون الختامي. هذا ما خرج فعلاً من المستودع.

كلاهما ضروري. فالنظري وحده يخبرك بما كان ينبغي أن يحدث، والفعلي وحده يخبرك بما حدث دون أن يخبرك إن كان معقولاً.

## لماذا الفجوة أهم من المستوى

نسبة تكلفة طعام 32٪ لا تعني شيئاً بذاتها، فالمفهوم ومزيج القائمة والموقع السعري كلها تحركها. لكن نظرياً بـ29٪ مقابل فعلي بـ34٪ يعني شيئاً دقيقاً: خمس نقاط مئوية من الطعام غادرت المستودع دون أن تُباع بالسعر الذي افترضته الوصفة.

ولهذه الفجوة عدد محدود من الأسباب المحتملة:

**انحراف الحصص.** الأشيع والأسهل تصحيحاً. فإن قالت الوصفة 180 غراماً وقدّم الخط 210، حمل كل طبق تكلفة غير مدرجة في الموازنة.

**الهدر والتلف.** طلب زائد، وتدوير سيئ للمخزون، وتحضير لطلب لم يأتِ.

**افتراضات الاستخلاص.** ورقة تكلفة تفترض نسبة استخلاص لا يحققها المطبخ ليست خللاً في الضبط بل خللاً في التكلفة.

**الاستلام.** قبول توريدات ناقصة، وزيادات أسعار لم تُلتقط، وأوزان لم تُفحص.

**الاستهلاك غير المسجل.** وجبات الفريق، والمجاملات، وإعادة التحضير، والتذوق، وكلها تُخرج مخزوناً بلا بيع.

**الفاقد.** حقيقي، لكنه آخر ما يُستنتج لا أوله، لأن الأسباب الخمسة السابقة تفسر معظم الفجوات.

## معالجة الفجوة

لا تحاول إغلاق الفجوة بخطوة واحدة، بل انسبها أولاً.

ابدأ حسب التصنيف. فاللحوم والمأكولات البحرية والألبان والخضار والمشروبات تتصرف وتخفق بطرق مختلفة. الفجوة المتركزة في الخضار هدر واستخلاص دائماً تقريباً، والمتركزة في البروتين مرتفع القيمة حصص أو استلام، والموزعة بالتساوي على كل شيء مشكلة جرد أو دقة وصفات لا مشكلة تشغيلية.

ثم اختبر أوراق التكلفة نفسها. ففي عدد مفاجئ من المطابخ يكون جزء من الفجوة أن الرقم النظري خاطئ: وصفات فرعية ناقصة، ونسب استخلاص متفائلة، وأحجام عبوات قديمة.

وبعد هاتين الخطوتين فقط يستحق الأمر التحقيق مع الأشخاص.

## روتين عملي

1. **اجرد باتساق.** الشخص نفسه، والترتيب نفسه، واليوم نفسه من الأسبوع، ومستوى التفصيل نفسه. فالجرد غير المتسق ينتج فجوة تقيس القائم بالجرد لا المطبخ.
2. **احسب تكلفة الأصناف الكبرى بدقة.** لست بحاجة إلى إتقان كل صنف من اليوم الأول. احسب العشرين صنفاً التي تشكل معظم حجمك ليصبح الرقم النظري قابلاً للاستخدام.
3. **سجّل الهدر أسبوعاً واحداً كل ربع.** فسجل الهدر الدائم يتحول إلى أوراق، أما القصير المكثف فينتج معلومة.
4. **افحص أوزان الحصص أثناء الخدمة لا قبلها.** فالفحص قبل الخدمة يقيس النية، والفحص أثناءها يقيس السلوك.
5. **راجع الفجوة شهرياً في النقطة نفسها من الدورة.** فالاتجاه أهم من أي شهر منفرد.

## ما الذي تتوقعه

الفجوة التي تنغلق إلى الصفر تعني عادة أن الجرد أو حساب التكلفة خاطئ لا أن المطبخ مثالي. فبعض الفارق طبيعي: التشذيب والفقد الطبيعي وإعادة التحضير المحدودة. والمهم هو ما إذا كانت الفجوة مستقرة وقابلة للتفسير. فالفجوة المستقرة المفهومة مطبخ منضبط، والمتحركة مطبخ يتغير فيه شيء لم يسمّه أحد.

## باختصار

نسبة تكلفة الطعام عنوان، والفجوة بين النظري والفعلي هي التشخيص. وإن لم يكن لديك استعداد إلا لبناء روتين واحد جديد هذا الربع، فابنِ الذي ينتج هذا الرقم كل شهر.`,
  },
  {
    slug: 'delivery-economics-what-commission-really-costs',
    categorySlug: 'menu-pricing',
    tags: ['delivery', 'pricing', 'profitability'],
    daysAgo: 20,
    titleEn: 'Delivery economics: what commission really costs',
    titleAr: 'اقتصاديات التوصيل: التكلفة الحقيقية للعمولة',
    excerptEn:
      'Listing the dine-in menu at dine-in prices on a delivery platform is the most common way a profitable restaurant sells at a loss without noticing.',
    excerptAr:
      'إدراج قائمة الصالة بأسعار الصالة على منصة توصيل هو أشيع طريقة يبيع بها مطعم رابح بخسارة دون أن يلاحظ.',
    contentEn: `Delivery is not a channel that sells the same food to more people. It is a different business with a different cost structure, a different competitive set and a different quality risk, and it is usually run as if none of that were true.

## The arithmetic nobody redoes

The illustrative figures below are arithmetic, not a benchmark.

Take a dish that sells for 40 in the dining room with a food cost of 12. Contribution is 28, a comfortable margin.

Now list it on a platform at the same 40. Commission at, say, 25 per cent takes 10. Packaging costs 3. Food cost is still 12. Contribution is 15 — a little over half of what the same dish earns at a table.

That is still positive, which is why the problem hides. Now apply the same arithmetic to a dish with a higher food cost — a protein-led main at 60 with a food cost of 26. Commission takes 15, packaging 3, and contribution falls to 16 on a much higher-value item. And on any dish sold with a platform-funded discount the venue partly absorbs, the number can go negative.

## Four decisions that matter more than price

**Which items are listed at all.** The delivery menu should be shorter than the dine-in menu, and the items that come off should be the ones that travel badly or contribute least after commission. A dish that arrives soggy does more brand damage than the order was worth.

**What the price is.** A delivery price that differs from the dine-in price is standard practice and generally expected. What damages trust is an inconsistent difference, not a stated one.

**How items are bundled.** Bundles and minimum-order thresholds move average order value, which spreads the fixed elements of the cost — packaging, the driver's time, the platform's fee floor — across more contribution.

**How the listing is built.** Aggregator listings are browsed, not read. Photography, item order and category naming decide a large share of what gets ordered, and they are usually inherited from the dine-in menu without thought.

## Own delivery versus platforms

Running your own delivery replaces a variable cost with a fixed one. That is worth doing only above a certain order volume, and the calculation is specific to your average order value, your radius and your driver cost. It is a calculation, not a principle — and it is worth redoing whenever commission terms or volume change materially.

Most venues benefit from a hybrid: platforms for reach and discovery, direct ordering for repeat guests, with the direct channel priced to make it obviously worth using.

## Practical recommendations

1. Rebuild contribution for every listed item after commission and packaging. Do this before touching price.
2. Delist anything that is negative after that calculation, and anything that arrives materially worse than it leaves.
3. Set delivery prices deliberately and consistently. An erratic gap is worse than a visible one.
4. Look at your average order value as a lever. Raising it is usually easier than raising prices.
5. Treat the platform listing as a shopfront: photograph the items you want to sell and order the categories the way you want them browsed.
6. Re-run the whole calculation whenever commission terms change.

## In short

Delivery can be a genuinely profitable channel, but only if it is priced and curated as its own business. The venues that lose money on delivery are rarely the ones that chose to; they are the ones that never redid the arithmetic after the platform took its share.`,
    contentAr: `التوصيل ليس قناة تبيع الطعام نفسه لعدد أكبر من الناس، بل نشاط مختلف بهيكل تكاليف مختلف ومجموعة تنافسية مختلفة ومخاطر جودة مختلفة، ويُدار عادة كأن شيئاً من ذلك غير صحيح.

## الحساب الذي لا يعيده أحد

الأرقام التوضيحية أدناه عملية حسابية لا معيار قياس.

خذ طبقاً يُباع بـ40 في الصالة بتكلفة طعام 12، فتكون المساهمة 28، وهو هامش مريح.

الآن أدرجه على منصة بالسعر نفسه 40. تأخذ العمولة — لنقل 25٪ — عشرة. ويكلّف التغليف ثلاثة. وتبقى تكلفة الطعام 12. فتصبح المساهمة 15، أي أكثر بقليل من نصف ما يحققه الطبق نفسه على الطاولة.

وهذا ما زال موجباً، ولهذا تختبئ المشكلة. الآن طبّق الحساب نفسه على طبق أعلى تكلفة: طبق رئيسي بروتيني بـ60 وتكلفة طعام 26. تأخذ العمولة 15 والتغليف ثلاثة، فتهبط المساهمة إلى 16 على صنف أعلى قيمة بكثير. وفي أي طبق يُباع بخصم تموّله المنصة ويتحمل المطعم جزءاً منه، يمكن للرقم أن يصبح سالباً.

## أربعة قرارات أهم من السعر

**أي الأصناف تُدرج أصلاً.** ينبغي أن تكون قائمة التوصيل أقصر من قائمة الصالة، وأن تكون الأصناف التي تخرج هي التي لا تحتمل النقل أو الأقل مساهمة بعد العمولة. فالطبق الذي يصل طرياً مبللاً يضر بالعلامة أكثر مما يساوي الطلب.

**ما هو السعر.** اختلاف سعر التوصيل عن سعر الصالة ممارسة معتادة ومتوقعة عموماً. وما يضر بالثقة هو الفارق غير المتسق لا المعلن.

**كيف تُجمَّع الأصناف.** ترفع الوجبات المركبة وحدود الطلب الأدنى متوسط قيمة الطلب، فتوزّع العناصر الثابتة من التكلفة — التغليف ووقت السائق والحد الأدنى لرسوم المنصة — على مساهمة أكبر.

**كيف تُبنى القائمة المعروضة.** قوائم تطبيقات التجميع تُتصفح ولا تُقرأ. والصورة وترتيب الأصناف وتسمية التصنيفات تحسم حصة كبيرة مما يُطلب، وتُورَّث عادة من قائمة الصالة بلا تفكير.

## التوصيل الذاتي مقابل المنصات

تشغيل توصيلك الخاص يستبدل تكلفة متغيرة بأخرى ثابتة، وهو يستحق العناء فوق حجم طلبات معين فقط، والحساب خاص بمتوسط قيمة طلبك ونطاقك وتكلفة السائق لديك. إنها عملية حسابية لا مبدأ، وتستحق الإعادة كلما تغيرت شروط العمولة أو الحجم تغيراً جوهرياً.

وتستفيد معظم المطاعم من نموذج مختلط: المنصات للوصول والاكتشاف، والطلب المباشر للضيوف المتكررين، مع تسعير القناة المباشرة بحيث يكون استخدامها مجزياً بوضوح.

## توصيات عملية

1. أعد بناء المساهمة لكل صنف مدرج بعد العمولة والتغليف، وافعل ذلك قبل المساس بالسعر.
2. اسحب كل ما يصبح سالباً بعد ذلك الحساب، وكل ما يصل أسوأ بشكل ملموس مما غادر.
3. حدد أسعار التوصيل بقصد وباتساق. فالفارق المتقلب أسوأ من الفارق الظاهر.
4. انظر إلى متوسط قيمة الطلب كرافعة، فرفعه أسهل عادة من رفع الأسعار.
5. تعامل مع القائمة المعروضة كواجهة متجر: صوّر الأصناف التي تريد بيعها ورتّب التصنيفات بالطريقة التي تريد تصفحها بها.
6. أعد الحساب كاملاً كلما تغيرت شروط العمولة.

## باختصار

يمكن للتوصيل أن يكون قناة رابحة فعلاً، لكن فقط إذا سُعّر ونُقّي كنشاط قائم بذاته. والمطاعم التي تخسر في التوصيل نادراً ما تكون قد اختارت ذلك، بل هي التي لم تعد الحساب بعد أن أخذت المنصة حصتها.`,
  },
];
