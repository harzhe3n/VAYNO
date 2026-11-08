/* VAYNO translations: English, Arabic (العربية) and Kurdish Sorani (کوردی).
 *
 * The brand name VAYNO is never translated; it stays in Latin letters in every
 * language, as do the five value letters V-A-Y-N-O.
 *
 * strings: key -> { en, ar, ckb }. Keys that only appear in index.html may
 * leave out "en": the English already written in the page is used for them.
 * content: projects and team profiles are written in English in
 * data/site-content.json, so their translations are looked up by the exact English text.
 *
 * Please have a native speaker review the Arabic and Kurdish copy before launch.
 */
window.VAYNO_I18N = {
    languages: {
        en: { label: "EN", dir: "ltr" },
        ar: { label: "عربي", dir: "rtl" },
        ckb: { label: "کوردی", dir: "rtl" }
    },

    strings: {
        // ---- Page ----
        "meta.title": {
            en: "VAYNO — Rooted in Kurdistan. Ready for What's Next.",
            ar: "VAYNO — جذورنا في كوردستان، وعيننا على المستقبل",
            ckb: "VAYNO — ڕەگمان لە کوردستانە، ئامادەین بۆ داهاتوو"
        },
        "meta.description": {
            en: "VAYNO is an independent creative and digital agency rooted in Kurdistan, building thoughtful brands, websites, and software for what comes next.",
            ar: "VAYNO وكالة إبداعية ورقمية مستقلة متجذّرة في كوردستان، تبني علامات تجارية ومواقع وبرمجيات مدروسة لما هو قادم.",
            ckb: "VAYNO ئاژانسێکی داهێنەرانە و دیجیتاڵیی سەربەخۆیە کە ڕەگی لە کوردستانە، براند و ماڵپەڕ و سۆفتوێری ورد بۆ داهاتوو دروست دەکات."
        },
        "loader.aria": { ar: "جارٍ تحميل VAYNO", ckb: "VAYNO بار دەکرێت" },
        "loader.tag": { ar: "متجذّرون في كوردستان", ckb: "ڕەگمان لە کوردستانە" },
        "lang.aria": { ar: "اللغة", ckb: "زمان" },
        "main.aria": {
            ar: "VAYNO: الرئيسية والمشاريع والخدمات ومن نحن والتواصل",
            ckb: "VAYNO: سەرەکی، پرۆژەکان، خزمەتگوزارییەکان، دەربارە و پەیوەندی"
        },

        // ---- Navigation ----
        "nav.aria": { ar: "القائمة الرئيسية", ckb: "لیستی سەرەکی" },
        "nav.home.aria": { ar: "الصفحة الرئيسية لـ VAYNO", ckb: "سەرەتای VAYNO" },
        "nav.home": { ar: "الرئيسية", ckb: "سەرەکی" },
        "nav.projects": { ar: "المشاريع", ckb: "پرۆژەکان" },
        "nav.services": { ar: "الخدمات", ckb: "خزمەتگوزاری" },
        "nav.about": { ar: "من نحن", ckb: "دەربارەی ئێمە" },
        "nav.contact": { ar: "تواصل معنا", ckb: "پەیوەندی" },
        "nav.open": { en: "Open navigation", ar: "فتح القائمة", ckb: "کردنەوەی لیست" },
        "nav.close": { en: "Close navigation", ar: "إغلاق القائمة", ckb: "داخستنی لیست" },

        // ---- Hero ----
        "hero.aria": { ar: "VAYNO، متجذّرة في كوردستان", ckb: "VAYNO، ڕەگداکوتاو لە کوردستان" },
        "hero.kicker": {
            ar: "وكالة إبداعية ورقمية مستقلة <span></span> كوردستان",
            ckb: "ئاژانسی داهێنان و دیجیتاڵی سەربەخۆ <span></span> کوردستان"
        },
        "hero.sr": {
            en: "VAYNO builds websites, web apps, online stores, software and brands.",
            ar: "تبني VAYNO المواقع وتطبيقات الويب والمتاجر الإلكترونية والبرمجيات والهويات البصرية.",
            ckb: "VAYNO ماڵپەڕ، ئەپی وێب، فرۆشگای ئۆنلاین، سۆفتوێر و براند دروست دەکات."
        },
        // The typing headline. {word} marks where the changing word sits, so
        // each language keeps its own word order (Kurdish puts the verb last).
        "hero.build": { en: "We build {word}", ar: "نبني {word}", ckb: "{word} دروست دەکەین" },
        "hero.words": {
            en: "websites|web apps|online stores|software|brands",
            ar: "مواقع|تطبيقات ويب|متاجر إلكترونية|برمجيات|هويات بصرية",
            ckb: "ماڵپەڕ|ئەپی وێب|فرۆشگای ئۆنلاین|سۆفتوێر|براند"
        },
        "hero.lede": {
            ar: "الأفكار العظيمة تستحق شكلاً يليق بها. نمنح فكرتك غايةً ودقةً ومكاناً في العالم.",
            ckb: "بیرۆکە گەورەکان شایانی شێوەیەکی شیاون. ئێمە ئامانج و وردی و جێگەیەک لە جیهاندا بە بیرۆکەکەت دەبەخشین."
        },
        "hero.start": { en: "Start a project", ar: "ابدأ مشروعك", ckb: "پرۆژەکەت دەست پێبکە" },
        "hero.orb": { ar: "فعّل فكرتك", ckb: "بیرۆکەکەت چالاک بکە" },
        "hero.orb.aria": {
            ar: "فعّل فكرتك: ابدأ مشروعك مع VAYNO",
            ckb: "بیرۆکەکەت چالاک بکە: پرۆژەکەت لەگەڵ VAYNO دەست پێبکە"
        },
        "hero.cta": { ar: "اكتشف أعمالنا", ckb: "کارەکانمان ببینە" },

        // ---- Quick links on the edge of the screen ----
        "dock.aria": { ar: "روابط سريعة", ckb: "بەستەرە خێراکان" },
        "dock.work": { ar: "أعمالنا", ckb: "کارەکانمان" },
        "dock.contact": { ar: "تواصل معنا", ckb: "پەیوەندیمان پێوە بکە" },

        // ---- Projects ----
        "projects.eyebrow": { ar: "VAYNO / أعمال مختارة", ckb: "VAYNO / کارە هەڵبژێردراوەکان" },
        "projects.title": { ar: "مشاريعنا", ckb: "پرۆژەکانمان" },
        "projects.aria": { ar: "مشاريع VAYNO", ckb: "پرۆژەکانی VAYNO" },
        "projects.controls": { ar: "التنقّل بين المشاريع", ckb: "گەڕان لە نێوان پرۆژەکاندا" },
        "projects.prev": { ar: "المشاريع السابقة", ckb: "پرۆژەکانی پێشوو" },
        "projects.next": { ar: "المشاريع التالية", ckb: "پرۆژەکانی دواتر" },
        "projects.empty": {
            en: "Our next projects are taking shape. Check back soon.",
            ar: "مشاريعنا القادمة قيد التشكّل. عُد إلينا قريبًا.",
            ckb: "پرۆژەکانی داهاتوومان خەریکە شێوە دەگرن. بەم زووانە سەردانمان بکەرەوە."
        },
        "projects.unavailable": {
            en: "Projects are temporarily unavailable.",
            ar: "المشاريع غير متاحة مؤقتًا.",
            ckb: "پرۆژەکان بە شێوەیەکی کاتی بەردەست نین."
        },
        "project.open": { en: "See how it works", ar: "شاهد كيف يعمل", ckb: "ببینە چۆن کار دەکات" },
        "project.visit": { en: "Visit website", ar: "زيارة الموقع", ckb: "سەردانی ماڵپەڕەکە بکە" },
        "project.imageAlt": { en: "{name} project image", ar: "صورة مشروع {name}", ckb: "وێنەی پرۆژەی {name}" },
        "case.site": { en: "On the website", ar: "على الموقع", ckb: "لە ماڵپەڕەکەدا" },
        "case.admin": { en: "In the admin panel", ar: "في لوحة التحكم", ckb: "لە پانێڵی بەڕێوەبردندا" },
        "case.close": { en: "Close", ar: "إغلاق", ckb: "داخستن" },
        "case.shot": { en: "Screenshot: {title}", ar: "لقطة شاشة: {title}", ckb: "وێنەی شاشە: {title}" },
        "case.privacy": {
            en: "Customer details and business figures in these screenshots are blurred to protect our client’s privacy.",
            ar: "بيانات العملاء والأرقام التجارية في هذه اللقطات مموّهة حفاظًا على خصوصية عميلنا.",
            ckb: "زانیاری کڕیاران و ژمارە بازرگانییەکان لەم وێنانەدا لێڵ کراون بۆ پاراستنی تایبەتمەندیی کڕیارەکەمان."
        },

        // ---- Services ----
        "services.eyebrow": { ar: "VAYNO / شبكة الخدمات", ckb: "VAYNO / تۆڕی خزمەتگوزاری" },
        "services.title": { ar: "خدماتنا", ckb: "خزمەتگوزارییەکانمان" },
        "services.link": { ar: "لست متأكدًا أيّها تحتاج؟ لنتحدّث", ckb: "نازانیت کامیانت پێویستە؟ با قسە بکەین" },
        "services.aria": { ar: "خدمات VAYNO", ckb: "خزمەتگوزارییەکانی VAYNO" },

        "service.1.title": { en: "Software Development", ar: "تطوير البرمجيات", ckb: "گەشەپێدانی سۆفتوێر" },
        "service.1.copy": {
            en: "Custom software, web applications, business systems, and digital products.",
            ar: "برمجيات مخصّصة وتطبيقات ويب وأنظمة أعمال ومنتجات رقمية.",
            ckb: "سۆفتوێری تایبەت، ئەپی وێب، سیستەمی بازرگانی و بەرهەمی دیجیتاڵ."
        },
        "service.1.tag": { en: "BUILD", ar: "بناء", ckb: "دروستکردن" },
        "service.2.title": { en: "AI Development", ar: "تطوير الذكاء الاصطناعي", ckb: "گەشەپێدانی زیرەکیی دەستکرد" },
        "service.2.copy": {
            en: "AI-powered tools, intelligent automation, integrations, and practical AI solutions.",
            ar: "أدوات مدعومة بالذكاء الاصطناعي، وأتمتة ذكية، وتكاملات، وحلول عملية.",
            ckb: "ئامرازی زیرەکیی دەستکرد، ئۆتۆماتیکی زیرەک، یەکخستن و چارەسەری کردەیی."
        },
        "service.2.tag": { en: "INTELLIGENCE", ar: "ذكاء", ckb: "زیرەکی" },
        "service.3.title": { en: "Website & Application Development", ar: "تطوير المواقع والتطبيقات", ckb: "گەشەپێدانی ماڵپەڕ و ئەپ" },
        "service.3.copy": {
            en: "Modern, responsive websites and applications designed around user needs.",
            ar: "مواقع وتطبيقات حديثة ومتجاوبة مصمّمة حول احتياجات المستخدم.",
            ckb: "ماڵپەڕ و ئەپی مۆدێرن و گونجاو، بەپێی پێداویستیی بەکارهێنەر دیزاین کراون."
        },
        "service.3.tag": { en: "WEB / APP", ar: "ويب / تطبيق", ckb: "وێب / ئەپ" },
        "service.4.title": { en: "UI/UX Design", ar: "تصميم UI/UX", ckb: "دیزاینی UI/UX" },
        "service.4.copy": {
            en: "User research, interface design, user flows, prototypes, and polished digital experiences.",
            ar: "أبحاث المستخدمين، وتصميم الواجهات، ومسارات الاستخدام، والنماذج الأولية، وتجارب رقمية مصقولة.",
            ckb: "لێکۆڵینەوەی بەکارهێنەر، دیزاینی ڕووکار، ڕێڕەوی بەکارهێنان، نموونەی سەرەتایی و ئەزموونی دیجیتاڵی ڕێکوپێک."
        },
        "service.4.tag": { en: "INTERFACE", ar: "واجهة", ckb: "ڕووکار" },
        "service.5.title": { en: "Graphic Design", ar: "التصميم الجرافيكي", ckb: "دیزاینی گرافیک" },
        "service.5.copy": {
            en: "Brand identities, visual systems, digital graphics, and marketing assets.",
            ar: "هويات العلامات التجارية، والأنظمة البصرية، والرسومات الرقمية، والمواد التسويقية.",
            ckb: "ناسنامەی براند، سیستەمی بینراو، گرافیکی دیجیتاڵ و کەرەستەی بازاڕگەری."
        },
        "service.5.tag": { en: "IDENTITY", ar: "هوية", ckb: "ناسنامە" },
        "service.6.title": { en: "Motion Graphics", ar: "الموشن جرافيك", ckb: "موشن گرافیک" },
        "service.6.copy": {
            en: "Motion design, animation, visual storytelling, and dynamic digital content.",
            ar: "تصميم الحركة، والرسوم المتحركة، والسرد البصري، والمحتوى الرقمي الحيّ.",
            ckb: "دیزاینی جووڵە، ئەنیمەیشن، گێڕانەوەی بینراو و ناوەڕۆکی دیجیتاڵیی زیندوو."
        },
        "service.6.tag": { en: "MOTION", ar: "حركة", ckb: "جووڵە" },

        // ---- About ----
        "about.aria": { ar: "عن VAYNO", ckb: "دەربارەی VAYNO" },
        "about.eyebrow": { ar: "رؤية صاغها المكان", ckb: "ڕوانگەیەک کە شوێن شێوەی پێداوە" },
        "about.title": {
            ar: "جذورنا هنا.<br>وأفكارنا تصل إلى كل مكان.",
            ckb: "ڕەگمان لێرەیە.<br>بیرۆکەکانمان دەگەنە هەموو شوێنێک."
        },
        "values.eyebrow": { ar: "ميثاق VAYNO / ٥ قيم", ckb: "بنەماکانی VAYNO / ٥ بەها" },
        "values.aria": { ar: "قيم VAYNO", ckb: "بەهاکانی VAYNO" },
        "values.v.title": { ar: "الرؤية", ckb: "دیدگا" },
        "values.v.text": { ar: "نرى الإمكانية قبل أن تتشكّل.", ckb: "دەرفەت دەبینین پێش ئەوەی شێوە وەربگرێت." },
        "values.a.title": { ar: "الطموح", ckb: "ئامانجخوازی" },
        "values.a.text": { ar: "فكّر أكبر، واجعله حقيقة.", ckb: "گەورەتر بیر بکەرەوە، بیکە بە ڕاستی." },
        "values.y.title": { ar: "الشباب", ckb: "گەنجی" },
        "values.y.text": { ar: "طاقة متجدّدة تسائل ما هو قائم.", ckb: "وزەیەکی نوێ بۆ پرسیارکردن لەوەی هەیە." },
        "values.n.title": { ar: "الجيل الجديد", ckb: "نەوەی نوێ" },
        "values.n.text": { ar: "نبني للعالم الذي يتشكّل الآن.", ckb: "بۆ ئەو جیهانە دروست دەکەین کە خەریکە شێوە دەگرێت." },
        "values.o.title": { ar: "التفاؤل", ckb: "گەشبینی" },
        "values.o.text": { ar: "نؤمن بما يمكننا صنعه في الغد.", ckb: "باوەڕمان بەوەیە کە سبەی دەتوانین چی دروست بکەین." },

        "team.eyebrow": { ar: "فريق صغير بأفق واسع", ckb: "تیمێکی بچووک بە ئاسۆیەکی فراوان" },
        "team.title": { ar: "من نحن", ckb: "دەربارەی ئێمە" },
        "team.aria": { ar: "أعضاء فريق VAYNO", ckb: "ئەندامانی تیمی VAYNO" },
        "team.empty": {
            en: "We’re introducing the people behind VAYNO. Check back soon.",
            ar: "نستعدّ لتقديم الفريق الذي يقف وراء VAYNO. عُد إلينا قريبًا.",
            ckb: "بەم زووانە ئەو کەسانە دەناسێنین کە لە پشت VAYNO وەستاون. دواتر سەردانمان بکەرەوە."
        },
        "team.portfolio": { en: "View portfolio", ar: "عرض الأعمال", ckb: "بینینی کارەکان" },
        "team.portrait": { en: "Portrait of {name}", ar: "صورة {name}", ckb: "وێنەی {name}" },

        // ---- Value seals (drawn on canvas) ----
        "scratch.note": { en: "VAYNO / FIELD NOTE 0{n}", ar: "VAYNO / ملاحظة ميدانية 0{n}", ckb: "VAYNO / تێبینیی مەیدانی 0{n}" },
        "scratch.cta": { en: "SCRATCH TO DISCOVER", ar: "امسح لتكتشف", ckb: "پاکی بکەوە بۆ دۆزینەوە" },
        "scratch.drag": { en: "DRAG ACROSS THE SEAL", ar: "اسحب فوق الختم", ckb: "بەسەر مۆرەکەدا ڕایبکێشە" },
        "scratch.aria": { en: "Scratch to reveal {letter}: {title}", ar: "امسح لكشف {letter}: {title}", ckb: "پاکی بکەوە بۆ دەرخستنی {letter}: {title}" },
        "scratch.revealed": { en: "{letter}: {title}. Revealed.", ar: "{letter}: {title}. تمّ الكشف.", ckb: "{letter}: {title}. دەرکەوت." },

        // ---- Contact ----
        "contact.eyebrow": { ar: "VAYNO / لنبنِ معًا", ckb: "VAYNO / با پێکەوە دروستی بکەین" },
        "contact.title": { ar: "لديك فكرة؟ لنبنِها معًا.", ckb: "بیرۆکەیەکت هەیە؟ با دروستی بکەین." },
        "contact.whatsapp": { ar: "واتساب", ckb: "واتسئاپ" },
        "contact.email": { ar: "راسل VAYNO", ckb: "ئیمەیڵ بۆ VAYNO" },
        "contact.copy": { ar: "نسخ البريد الإلكتروني", ckb: "کۆپیکردنی ئیمەیڵ" },
        "contact.copied": { en: "Email address copied.", ar: "تمّ نسخ البريد الإلكتروني.", ckb: "ئیمەیڵەکە کۆپی کرا." },
        "contact.copyFailed": {
            en: "Could not copy automatically. Select the email address in the footer.",
            ar: "تعذّر النسخ تلقائيًا. حدّد البريد الإلكتروني في أسفل الصفحة.",
            ckb: "کۆپیکردنی خۆکار سەرنەکەوت. ئیمەیڵەکە لە خوارەوەی پەڕەکە هەڵبژێرە."
        },
        "contact.emailAria": { en: "Email VAYNO at {email}", ar: "راسل VAYNO على {email}", ckb: "ئیمەیڵ بۆ VAYNO بنێرە: {email}" },
        "contact.socialTitle": {
            en: "{label} link coming soon",
            ar: "سيُضاف رابط {label} قريبًا",
            ckb: "بەستەری {label} دواتر زیاد دەکرێت"
        },

        // ---- Inquiry form ----
        "form.heading": { ar: "ابدأ مشروعًا", ckb: "پرۆژەیەک دەست پێبکە" },
        "form.name": { ar: "الاسم الكامل <span>*</span>", ckb: "ناوی تەواو <span>*</span>" },
        "form.email": { ar: "البريد الإلكتروني <span>*</span>", ckb: "ئیمەیڵ <span>*</span>" },
        "form.company": { ar: "الشركة أو المؤسسة", ckb: "کۆمپانیا یان دامەزراوە" },
        "form.type": { ar: "نوع المشروع <span>*</span>", ckb: "جۆری پرۆژە <span>*</span>" },
        "form.type.choose": { ar: "اختر نوع المشروع", ckb: "جۆری پرۆژە هەڵبژێرە" },
        "form.type.website": { ar: "تطوير المواقع", ckb: "گەشەپێدانی ماڵپەڕ" },
        "form.type.software": { ar: "تطوير البرمجيات", ckb: "گەشەپێدانی سۆفتوێر" },
        "form.type.ai": { ar: "تطوير الذكاء الاصطناعي", ckb: "گەشەپێدانی زیرەکیی دەستکرد" },
        "form.type.uiux": { ar: "تصميم UI/UX", ckb: "دیزاینی UI/UX" },
        "form.type.graphic": { ar: "التصميم الجرافيكي", ckb: "دیزاینی گرافیک" },
        "form.type.motion": { ar: "الموشن جرافيك", ckb: "موشن گرافیک" },
        "form.type.other": { ar: "أخرى", ckb: "هیتر" },
        "form.subject": { ar: "الموضوع <span>*</span>", ckb: "بابەت <span>*</span>" },
        "form.description": { ar: "حدّثنا عن المشروع <span>*</span>", ckb: "دەربارەی پرۆژەکە پێمان بڵێ <span>*</span>" },
        "form.budget": { ar: "نطاق الميزانية", ckb: "بڕی بودجە" },
        "form.budget.choose": { ar: "نطاق الميزانية", ckb: "بڕی بودجە" },
        "form.budget.1": { ar: "50 – 100 دولار", ckb: "50 – 100 دۆلار" },
        "form.budget.2": { ar: "100 – 1,000 دولار", ckb: "100 – 1,000 دۆلار" },
        "form.budget.3": { ar: "1,000 دولار فأكثر", ckb: "1,000 دۆلار و زیاتر" },
        "form.method": { ar: "وسيلة التواصل المفضّلة", ckb: "ڕێگای پەیوەندیی دڵخواز" },
        "form.method.choose": { ar: "وسيلة التواصل المفضّلة", ckb: "ڕێگای پەیوەندیی دڵخواز" },
        "form.method.whatsapp": { ar: "واتساب", ckb: "واتسئاپ" },
        "form.method.email": { ar: "البريد الإلكتروني", ckb: "ئیمەیڵ" },
        "form.submit": { en: "Send project inquiry", ar: "أرسل طلب المشروع", ckb: "ناردنی داواکاریی پرۆژە" },
        "form.sending": { en: "Sending inquiry…", ar: "جارٍ الإرسال…", ckb: "دەنێردرێت…" },
        "form.invalidEmail": { en: "Enter a valid email address.", ar: "أدخل بريدًا إلكترونيًا صالحًا.", ckb: "ئیمەیڵێکی دروست بنووسە." },
        "form.success": {
            en: "Your inquiry was sent successfully. Reference: {reference}",
            ar: "تمّ إرسال طلبك بنجاح. الرقم المرجعي: {reference}",
            ckb: "داواکارییەکەت بە سەرکەوتوویی نێردرا. ژمارەی ئاماژە: {reference}"
        },
        "form.networkError": {
            en: "Unable to reach the inquiry service. Please try again in a moment.",
            ar: "تعذّر الوصول إلى خدمة الطلبات. يُرجى المحاولة بعد قليل.",
            ckb: "نەتوانرا پەیوەندی بە خزمەتگوزاریی داواکارییەوە بکرێت. تکایە کەمێکی تر هەوڵ بدەرەوە."
        },
        "form.genericError": {
            en: "We couldn't send your inquiry. Please try again.",
            ar: "لم نتمكّن من إرسال طلبك. يُرجى المحاولة مرة أخرى.",
            ckb: "نەمانتوانی داواکارییەکەت بنێرین. تکایە دووبارە هەوڵ بدەرەوە."
        },

        // ---- Guide robot ----
        "robot.aria": { ar: "افتح دليل مشاريع VAYNO", ckb: "ڕێبەری پرۆژەی VAYNO بکەرەوە" },
        "guide.eyebrow": { ar: "VAYNO / دليل المشاريع", ckb: "VAYNO / ڕێبەری پرۆژە" },
        "guide.title": { ar: "ماذا تبني؟", ckb: "چی دروست دەکەیت؟" },
        "guide.close": { ar: "إغلاق دليل المشاريع", ckb: "داخستنی ڕێبەری پرۆژە" },
        "guide.intro": {
            ar: "يمكنني مساعدتك في العثور على خدمة VAYNO المناسبة والخطوة التالية. ولمحادثة مخصّصة، أرسل ملاحظة عن مشروعك إلى فريقنا.",
            ckb: "دەتوانم یارمەتیت بدەم خزمەتگوزاریی گونجاوی VAYNO و هەنگاوی دواتر بدۆزیتەوە. بۆ گفتوگۆیەکی تایبەت، تێبینییەک دەربارەی پرۆژەکەت بۆ تیمەکەمان بنێرە."
        },
        "guide.suggestions": { ar: "أسئلة مقترحة", ckb: "پرسیاری پێشنیارکراو" },
        "guide.s1": { ar: "موقع إلكتروني", ckb: "ماڵپەڕ" },
        "guide.s1.prompt": { ar: "أحتاج إلى موقع إلكتروني", ckb: "پێویستم بە ماڵپەڕێکە" },
        "guide.s2": { ar: "برمجيات مخصّصة", ckb: "سۆفتوێری تایبەت" },
        "guide.s2.prompt": { ar: "أريد بناء برنامج", ckb: "دەمەوێت سۆفتوێرێک دروست بکەم" },
        "guide.s3": { ar: "حل بالذكاء الاصطناعي", ckb: "چارەسەری زیرەکیی دەستکرد" },
        "guide.s3.prompt": { ar: "أحتاج مساعدة في الذكاء الاصطناعي", ckb: "یارمەتیم دەوێت لە زیرەکیی دەستکرددا" },
        "guide.s4": { ar: "هوية علامة تجارية", ckb: "ناسنامەی براند" },
        "guide.s4.prompt": { ar: "أحتاج إلى هوية لعلامتي التجارية", ckb: "پێویستم بە ناسنامەی براندە" },
        "guide.label": { ar: "اسأل دليل مشاريع VAYNO", ckb: "پرسیار لە ڕێبەری پرۆژەی VAYNO بکە" },
        "guide.placeholder": { ar: "أخبرني على ماذا تعمل…", ckb: "پێم بڵێ خەریکی چیت…" },
        "guide.send": { ar: "إرسال الرسالة", ckb: "ناردنی نامە" },
        "guide.footnote": {
            ar: "للحصول على ردّ شخصي، <a href=\"#contact\">تحدّث إلى فريقنا <span aria-hidden=\"true\">←</span></a>",
            ckb: "بۆ وەڵامێکی تایبەت، <a href=\"#contact\">قسە لەگەڵ تیمەکەمان بکە <span aria-hidden=\"true\">←</span></a>"
        },
        "guide.link.services": { en: "Explore services", ar: "استكشف الخدمات", ckb: "خزمەتگوزارییەکان ببینە" },
        "guide.link.contact": { en: "Tell us about your project", ar: "حدّثنا عن مشروعك", ckb: "دەربارەی پرۆژەکەت پێمان بڵێ" },
        "guide.reply.price": {
            en: "Project costs depend on the scope and the work involved, so I can’t give you a reliable quote here. Share your goals and budget range with the team for a tailored estimate.",
            ar: "تعتمد تكلفة المشروع على نطاقه وحجم العمل، لذا لا يمكنني إعطاؤك سعرًا دقيقًا هنا. شارك أهدافك ونطاق ميزانيتك مع الفريق للحصول على تقدير مخصّص.",
            ckb: "تێچووی پرۆژە پشت بە قەبارە و جۆری کارەکە دەبەستێت، بۆیە ناتوانم لێرە نرخێکی دروستت پێ بدەم. ئامانج و بڕی بودجەکەت لەگەڵ تیمەکە باس بکە بۆ خەمڵاندنێکی تایبەت."
        },
        "guide.reply.ai": {
            en: "For AI tools, intelligent automation, or practical AI integrations, AI Development is the closest fit. Describe the workflow you want to improve and the team can help scope it.",
            ar: "لأدوات الذكاء الاصطناعي أو الأتمتة الذكية أو التكاملات العملية، فإن تطوير الذكاء الاصطناعي هو الأنسب. صِف سير العمل الذي تريد تحسينه وسيساعدك الفريق في تحديد نطاقه.",
            ckb: "بۆ ئامرازی زیرەکیی دەستکرد، ئۆتۆماتیکی زیرەک یان یەکخستنی کردەیی، گەشەپێدانی زیرەکیی دەستکرد گونجاوترینە. ئەو ڕێڕەوەی کارەی دەتەوێت باشتری بکەیت باس بکە و تیمەکە یارمەتیت دەدات قەبارەکەی دیاری بکەیت."
        },
        "guide.reply.web": {
            en: "Website & Application Development is a good starting point. VAYNO can help shape the experience, design the interface, and build it responsively.",
            ar: "تطوير المواقع والتطبيقات نقطة انطلاق جيدة. يمكن لـ VAYNO المساعدة في صياغة التجربة وتصميم الواجهة وبنائها بشكل متجاوب.",
            ckb: "گەشەپێدانی ماڵپەڕ و ئەپ خاڵێکی باشە بۆ دەستپێکردن. VAYNO دەتوانێت یارمەتی بدات لە شێوەدانی ئەزموونەکە، دیزاینی ڕووکار و دروستکردنی بە شێوەیەکی گونجاو."
        },
        "guide.reply.software": {
            en: "Software Development covers custom applications, business systems, and digital products. If the project also needs automation or AI, those can be explored together.",
            ar: "يشمل تطوير البرمجيات التطبيقات المخصّصة وأنظمة الأعمال والمنتجات الرقمية. وإذا احتاج المشروع أيضًا إلى أتمتة أو ذكاء اصطناعي، يمكن استكشافهما معًا.",
            ckb: "گەشەپێدانی سۆفتوێر ئەپی تایبەت، سیستەمی بازرگانی و بەرهەمی دیجیتاڵ دەگرێتەوە. ئەگەر پرۆژەکە پێویستی بە ئۆتۆماتیک یان زیرەکیی دەستکردیش بێت، دەتوانین پێکەوە لێیان بکۆڵینەوە."
        },
        "guide.reply.brand": {
            en: "Graphic Design is a good match for brand identity, visual systems, and campaign assets. For a larger brand direction, mention that in your project note.",
            ar: "التصميم الجرافيكي مناسب لهوية العلامة التجارية والأنظمة البصرية ومواد الحملات. وإن كنت تريد توجّهًا أوسع لعلامتك، اذكر ذلك في ملاحظة مشروعك.",
            ckb: "دیزاینی گرافیک بۆ ناسنامەی براند، سیستەمی بینراو و کەرەستەی کەمپەین گونجاوە. ئەگەر ئاراستەیەکی گەورەتری براندت دەوێت، لە تێبینیی پرۆژەکەتدا ئاماژەی پێ بکە."
        },
        "guide.reply.uiux": {
            en: "UI/UX Design can help with user research, interface design, flows, and prototypes—whether you’re starting fresh or improving an existing product.",
            ar: "يساعدك تصميم UI/UX في أبحاث المستخدمين وتصميم الواجهات والمسارات والنماذج الأولية، سواء كنت تبدأ من الصفر أو تحسّن منتجًا قائمًا.",
            ckb: "دیزاینی UI/UX یارمەتیت دەدات لە لێکۆڵینەوەی بەکارهێنەر، دیزاینی ڕووکار، ڕێڕەو و نموونەی سەرەتایی، جا لە سفرەوە دەست پێبکەیت یان بەرهەمێکی هەبوو باشتر بکەیت."
        },
        "guide.reply.motion": {
            en: "Motion Graphics is the right place to start for animation, motion design, and visual storytelling.",
            ar: "الموشن جرافيك هو المكان المناسب للبدء في الرسوم المتحركة وتصميم الحركة والسرد البصري.",
            ckb: "موشن گرافیک شوێنی گونجاوە بۆ دەستپێکردن لە ئەنیمەیشن، دیزاینی جووڵە و گێڕانەوەی بینراو."
        },
        "guide.reply.default": {
            en: "Tell me a little more about what you’re making—such as the audience, the problem you want to solve, or what you need built. I can point you to a service, or you can send the team a short brief.",
            ar: "أخبرني المزيد عمّا تصنعه، مثل جمهورك أو المشكلة التي تريد حلّها أو ما تحتاج إلى بنائه. يمكنني توجيهك إلى خدمة، أو يمكنك إرسال موجز قصير إلى الفريق.",
            ckb: "کەمێک زیاتر دەربارەی ئەوەی دروستی دەکەیت پێم بڵێ، وەک بینەرەکانت، ئەو کێشەیەی دەتەوێت چارەسەری بکەیت، یان ئەوەی پێویستە دروست بکرێت. دەتوانم ڕێنماییت بکەم بۆ خزمەتگوزارییەک، یان دەتوانیت کورتەیەک بۆ تیمەکە بنێریت."
        },
        "hello.1": { en: "Hi! Tap me and I’ll help you.", ar: "مرحبًا! اضغط عليّ وسأساعدك.", ckb: "سڵاو! کرتەم لێ بکە و یارمەتیت دەدەم." },
        "hello.2": { en: "Hi there! Need a hand with a project?", ar: "أهلًا! هل تحتاج مساعدة في مشروع؟", ckb: "سڵاو! یارمەتیت دەوێت بۆ پرۆژەیەک؟" },
        "hello.3": { en: "Hello! I can find the right service for you.", ar: "مرحبًا! يمكنني إيجاد الخدمة المناسبة لك.", ckb: "سڵاو! دەتوانم خزمەتگوزاریی گونجاوت بۆ بدۆزمەوە." },
        "hello.4": { en: "Silav! Tap me to open your guide.", ar: "أهلًا بك! اضغط عليّ لفتح الدليل.", ckb: "سڵاو! کرتەم لێ بکە بۆ کردنەوەی ڕێبەرەکەت." },
        "hint.0": { en: "Welcome back! Tap me for a guide.", ar: "أهلًا بعودتك! اضغط عليّ للمساعدة.", ckb: "بەخێربێیتەوە! کرتەم لێ بکە بۆ ڕێنمایی." },
        "hint.1": { en: "Tap a disc to see how it works!", ar: "اضغط على أيّ قرص لترى كيف يعمل!", ckb: "دەست لە دیسکێک بدە بۆ ئەوەی ببینیت چۆن کار دەکات!" },
        "hint.2": { en: "Not sure which fits? Ask me!", ar: "لست متأكدًا أيّها يناسبك؟ اسألني!", ckb: "نازانیت کامیان گونجاوە؟ لە من بپرسە!" },
        "hint.3": { en: "Scratch the seals to see our values.", ar: "امسح الأختام لترى قيمنا.", ckb: "مۆرەکان پاکی بکەوە بۆ بینینی بەهاکانمان." },
        "hint.4": { en: "Tell us your idea. We’ll build it!", ar: "أخبرنا بفكرتك، وسنبنيها!", ckb: "بیرۆکەکەت پێمان بڵێ، دروستی دەکەین!" },

        // ---- Footer ----
        "footer.tagline": { ar: "جذورنا في كوردستان، وعيننا على المستقبل.", ckb: "ڕەگمان لە کوردستانە، ئامادەین بۆ داهاتوو." },
        "footer.social": { ar: "وسائل التواصل الاجتماعي", ckb: "تۆڕە کۆمەڵایەتییەکان" },
        "footer.rights": { ar: "جميع الحقوق محفوظة.", ckb: "هەموو مافەکان پارێزراون." },
    },

    // Projects and team text from data/site-content.json, looked up by their English text.
    content: {
        // Shared
        "Admin panel": { ar: "لوحة تحكم", ckb: "پانێڵی بەڕێوەبردن" },

        // Shax Store
        "E-commerce · Website development": { ar: "تجارة إلكترونية · تطوير المواقع", ckb: "بازرگانی ئەلیکترۆنی · گەشەپێدانی ماڵپەڕ" },
        "E-commerce": { ar: "تجارة إلكترونية", ckb: "بازرگانی ئەلیکترۆنی" },
        "A complete online shop for gym wear, built for Kurdistan. Shoppers browse categories, pick colours, see prices and reviews, and order through a cart, in Kurdish, Arabic or English. Behind it, the owner runs everything from an admin panel: products, categories, orders, stock and shipments, customer notifications and Telegram order alerts.": {
            ar: "متجر إلكتروني متكامل لملابس الرياضة، صُمّم لكوردستان. يتصفّح المتسوّقون الفئات ويختارون الألوان ويرون الأسعار والتقييمات ويطلبون عبر سلة التسوّق، بالكوردية أو العربية أو الإنجليزية. وخلفه يدير المالك كل شيء من لوحة تحكم: المنتجات والفئات والطلبات والمخزون والشحنات وإشعارات العملاء وتنبيهات الطلبات عبر تيليغرام.",
            ckb: "فرۆشگایەکی ئۆنلاینی تەواو بۆ جلی وەرزشی، بۆ کوردستان دروستکراوە. کڕیاران بە ناو جۆرەکاندا دەگەڕێن، ڕەنگ هەڵدەبژێرن، نرخ و هەڵسەنگاندنەکان دەبینن و لە ڕێگەی سەبەتەوە داوا دەکەن، بە کوردی، عەرەبی یان ئینگلیزی. لە پشتیەوە، خاوەنەکەی هەموو شتێک لە پانێڵی بەڕێوەبردنەوە بەڕێوە دەبات: بەرهەمەکان، جۆرەکان، داواکارییەکان، کۆگا و بارەکان، ئاگادارکردنەوەی کڕیاران و ئاگاداری داواکاری لە تێلیگرام."
        },
        "Storefront": { ar: "واجهة المتجر", ckb: "ڕووکاری فرۆشگا" },
        "A bold home page with product search, light and dark themes, and Kurdish, Arabic and English versions. Customers can shop as guests or create an account.": {
            ar: "صفحة رئيسية لافتة مع بحث عن المنتجات ووضعين فاتح وداكن ونسخ بالكوردية والعربية والإنجليزية. يمكن للعملاء التسوّق كضيوف أو إنشاء حساب.",
            ckb: "پەڕەیەکی سەرەکیی سەرنجڕاکێش لەگەڵ گەڕان بۆ بەرهەم، ڕووکاری ڕووناک و تاریک، و وەشانی کوردی، عەرەبی و ئینگلیزی. کڕیاران دەتوانن وەک میوان بکڕن یان هەژمار دروست بکەن."
        },
        "Shop by category": { ar: "التسوّق حسب الفئة", ckb: "کڕین بەپێی جۆر" },
        "Products are grouped into categories, such as compression, oversize shirts, sweat pants and shorts. Each one has its own image and shows how many products it holds.": {
            ar: "تُجمَّع المنتجات في فئات مثل الملابس الضاغطة والقمصان الواسعة والبناطيل الرياضية والشورتات. لكل فئة صورتها الخاصة وتعرض عدد المنتجات فيها.",
            ckb: "بەرهەمەکان بە جۆر ڕێکخراون، وەک بلوزی تەسک، تیشێرتی ئۆڤەرسایز، پانتۆڵ و شۆڕتی وەرزشی. هەر جۆرێک وێنەی خۆی هەیە و ژمارەی بەرهەمەکانی پیشان دەدات."
        },
        "Colours, prices and reviews": { ar: "الألوان والأسعار والتقييمات", ckb: "ڕەنگ، نرخ و هەڵسەنگاندن" },
        "Every product card shows its colour options, star rating and reviews, price and sale price, with one tap to add it to the cart. Shoppers can sort by best sellers, price or newest, and filter by brand.": {
            ar: "تعرض كل بطاقة منتج خيارات الألوان والتقييم بالنجوم والمراجعات والسعر وسعر التخفيض، مع إضافته إلى السلة بلمسة واحدة. ويمكن الترتيب حسب الأكثر مبيعًا أو السعر أو الأحدث، والتصفية حسب العلامة التجارية.",
            ckb: "هەر کارتێکی بەرهەم ڕەنگەکانی، هەڵسەنگاندن بە ئەستێرە و بۆچوونەکان، نرخ و نرخی داشکاندن پیشان دەدات، و بە یەک دەستلێدان دەچێتە سەبەتەوە. کڕیاران دەتوانن بەپێی پڕفرۆشترین، نرخ یان نوێترین ڕیزیان بکەن و بەپێی براند فلتەریان بکەن."
        },
        "Dashboard": { ar: "لوحة المعلومات", ckb: "داشبۆرد" },
        "One screen for the whole business: revenue, profit and cost from delivered orders, order and customer counts, the latest orders, and stock alerts for products that have run out.": {
            ar: "شاشة واحدة للعمل كله: الإيرادات والأرباح والتكاليف من الطلبات المُسلَّمة، وعدد الطلبات والعملاء، وأحدث الطلبات، وتنبيهات المخزون للمنتجات التي نفدت.",
            ckb: "یەک شاشە بۆ هەموو کارەکە: داهات، قازانج و تێچووی داواکارییە گەیەندراوەکان، ژمارەی داواکاری و کڕیاران، دوایین داواکارییەکان، و ئاگاداری کۆگا بۆ ئەو بەرهەمانەی تەواو بوون."
        },
        "Products": { ar: "المنتجات", ckb: "بەرهەمەکان" },
        "Add, edit and remove products with their price, stock status, rating and badges such as New. Each product records which team member added it.": {
            ar: "إضافة المنتجات وتعديلها وحذفها مع سعرها وحالة مخزونها وتقييمها وشارات مثل «جديد». ويُسجَّل لكل منتج عضو الفريق الذي أضافه.",
            ckb: "زیادکردن، دەستکاریکردن و سڕینەوەی بەرهەمەکان لەگەڵ نرخ، باری کۆگا، هەڵسەنگاندن و نیشانەی وەک «نوێ». بۆ هەر بەرهەمێک تۆمار دەکرێت کام ئەندامی تیم زیادی کردووە."
        },
        "Categories in three languages": { ar: "فئات بثلاث لغات", ckb: "جۆرەکان بە سێ زمان" },
        "Each category has an image and a name in English, Kurdish and Arabic, so the whole shop switches language cleanly. Extra filters, such as a brand, group products across categories.": {
            ar: "لكل فئة صورة واسم بالإنجليزية والكوردية والعربية، فيتبدّل المتجر كله بين اللغات بسلاسة. وتجمع فلاتر إضافية، مثل العلامة التجارية، المنتجات عبر الفئات.",
            ckb: "هەر جۆرێک وێنە و ناوێکی بە ئینگلیزی، کوردی و عەرەبی هەیە، بۆیە هەموو فرۆشگاکە بە ئاسانی زمان دەگۆڕێت. فلتەری زیادە، وەک براند، بەرهەمەکان لە هەموو جۆرەکاندا کۆ دەکەنەوە."
        },
        "Orders": { ar: "الطلبات", ckb: "داواکارییەکان" },
        "Orders move from pending to processing, shipped and delivered, or cancelled. A team member can take an order to handle it, and every order can be opened in full.": {
            ar: "تنتقل الطلبات من قيد الانتظار إلى قيد التجهيز ثم الشحن والتسليم، أو الإلغاء. ويمكن لعضو في الفريق أن يتولّى طلبًا لمتابعته، ويمكن فتح كل طلب بتفاصيله الكاملة.",
            ckb: "داواکارییەکان لە چاوەڕوانییەوە دەچن بۆ ئامادەکردن، ناردن و گەیاندن، یان هەڵوەشاندنەوە. ئەندامێکی تیم دەتوانێت داواکارییەک وەربگرێت بۆ بەڕێوەبردنی، و هەر داواکارییەک بە تەواوی دەکرێتەوە."
        },
        "Stock and shipments": { ar: "المخزون والشحنات", ckb: "کۆگا و بارەکان" },
        "Tracks each incoming shipment: units per size, product costs, delivery fees, and the profit expected if everything sells.": {
            ar: "يتابع كل شحنة واردة: عدد القطع لكل مقاس، وتكاليف المنتجات، ورسوم التوصيل، والربح المتوقّع إذا بيع كل شيء.",
            ckb: "هەموو بارێکی هاتوو بەدواداچوونی بۆ دەکرێت: ژمارەی دانە بۆ هەر قەبارەیەک، تێچووی بەرهەم، کرێی گەیاندن، و ئەو قازانجەی چاوەڕێ دەکرێت ئەگەر هەمووی بفرۆشرێت."
        },
        "Customer notifications": { ar: "إشعارات العملاء", ckb: "ئاگادارکردنەوەی کڕیاران" },
        "Write a message, choose its type and who receives it (all customers, sponsors, admins or one person), and preview it before sending.": {
            ar: "اكتب رسالة واختر نوعها ومن يستلمها (كل العملاء أو الرعاة أو المشرفين أو شخص واحد)، وعاينها قبل الإرسال.",
            ckb: "نامەیەک بنووسە، جۆرەکەی و وەرگرەکانی هەڵبژێرە (هەموو کڕیاران، سپۆنسەرەکان، بەڕێوەبەران یان یەک کەس)، و پێش ناردن پێشبینینی بکە."
        },
        "Telegram order alerts": { ar: "تنبيهات الطلبات عبر تيليغرام", ckb: "ئاگاداری داواکاری لە تێلیگرام" },
        "New orders and every change in an order's status are sent to the shop's Telegram automatically, with product photos.": {
            ar: "تُرسَل الطلبات الجديدة وكل تغيير في حالة الطلب إلى تيليغرام المتجر تلقائيًا، مع صور المنتجات.",
            ckb: "داواکارییە نوێکان و هەر گۆڕانکارییەک لە باری داواکارییەکدا بە شێوەیەکی خۆکار دەنێردرێن بۆ تێلیگرامی فرۆشگاکە، لەگەڵ وێنەی بەرهەمەکان."
        },

        // X Barber
        "Booking system · Web app": { ar: "نظام حجز · تطبيق ويب", ckb: "سیستەمی نۆرەگرتن · ئەپی وێب" },
        "Online booking": { ar: "حجز عبر الإنترنت", ckb: "نۆرەگرتنی ئۆنلاین" },
        "A booking system for a barbershop. Customers book a barber and a free time in seconds, with no account or password. Staff run the day from a cashier screen, and the owner manages barbers, services, products, working hours and earnings from the admin panel, in Kurdish, Arabic or English.": {
            ar: "نظام حجز لصالون حلاقة. يحجز العملاء حلّاقًا ووقتًا متاحًا في ثوانٍ، دون حساب أو كلمة مرور. ويدير الموظفون يومهم من شاشة الكاشير، بينما يدير المالك الحلّاقين والخدمات والمنتجات وساعات العمل والأرباح من لوحة التحكم، بالكوردية أو العربية أو الإنجليزية.",
            ckb: "سیستەمێکی نۆرەگرتن بۆ سەرتاشخانەیەک. کڕیاران لە چەند چرکەیەکدا نۆرە لای باربەرێک و کاتێکی بەتاڵ دەگرن، بێ هەژمار و بێ وشەی نهێنی. کارمەندان ڕۆژەکەیان لە شاشەی کاشێرەوە بەڕێوە دەبەن، و خاوەنەکەی باربەرەکان، خزمەتگوزارییەکان، بەرهەمەکان، کاتی کارکردن و داهات لە پانێڵی بەڕێوەبردنەوە بەڕێوە دەبات، بە کوردی، عەرەبی یان ئینگلیزی."
        },
        "Booking website": { ar: "موقع الحجز", ckb: "ماڵپەڕی نۆرەگرتن" },
        "Customers see each barber, whether the shop is open now, and the next free time. Three short steps explain how booking works.": {
            ar: "يرى العملاء كل حلّاق، وهل الصالون مفتوح الآن، وأقرب وقت متاح. وتشرح ثلاث خطوات قصيرة طريقة الحجز.",
            ckb: "کڕیاران هەر باربەرێک دەبینن، ئایا دوکانەکە ئێستا کراوەیە، و یەکەم کاتی بەتاڵ. سێ هەنگاوی کورت ڕوون دەکەنەوە نۆرەگرتن چۆن کار دەکات."
        },
        "Pick a day and time": { ar: "اختيار اليوم والوقت", ckb: "هەڵبژاردنی ڕۆژ و کات" },
        "Free times come straight from the shop and are always up to date; taken times can't be picked. After choosing a time, the customer only leaves a name and phone number.": {
            ar: "تأتي الأوقات المتاحة مباشرة من الصالون وتبقى محدّثة دائمًا، ولا يمكن اختيار الأوقات المحجوزة. وبعد اختيار الوقت يترك العميل اسمه ورقم هاتفه فقط.",
            ckb: "کاتە بەتاڵەکان ڕاستەوخۆ لە دوکانەوە دێن و هەمیشە نوێن، و کاتە گیراوەکان هەڵنابژێردرێن. دوای هەڵبژاردنی کات، کڕیار تەنها ناو و ژمارەی تەلەفۆنەکەی دەنووسێت."
        },
        "Cashier": { ar: "الكاشير", ckb: "کاشێر" },
        "Each barber has a column of time slots. Staff add walk-in clients, start and finish each cut, add services, and see who is waiting, who is in the chair, and the money received today.": {
            ar: "لكل حلّاق عمود من المواعيد. يضيف الموظفون الزبائن الحاضرين دون حجز، ويبدؤون كل حلاقة وينهونها، ويضيفون الخدمات، ويرون من ينتظر ومن على الكرسي والمبلغ المستلم اليوم.",
            ckb: "هەر باربەرێک ستوونێکی کاتەکانی هەیە. کارمەندان ئەو کڕیارانەی بێ نۆرە دێن زیاد دەکەن، هەر قژبڕینێک دەست پێدەکەن و تەواو دەکەن، خزمەتگوزاری زیاد دەکەن، و دەبینن کێ چاوەڕێیە، کێ لەسەر کورسییە و ئەمڕۆ چەند پارە وەرگیراوە."
        },
        "Barbers": { ar: "الحلّاقون", ckb: "باربەرەکان" },
        "Add barbers and their photos, give each one their own sign-in, and see their finished clients, waiting clients and earnings for the day.": {
            ar: "أضف الحلّاقين وصورهم، وامنح كلًّا منهم حساب دخول خاصًّا، وتابع زبائنه المنتهين والمنتظرين وأرباحه لليوم.",
            ckb: "باربەر و وێنەکانیان زیاد بکە، هەر یەکەیان چوونەژوورەوەی تایبەتی خۆی بدەرێ، و کڕیارە تەواوبووەکان، چاوەڕوانەکان و داهاتی ڕۆژەکەی ببینە."
        },
        "Shop settings": { ar: "إعدادات الصالون", ckb: "ڕێکخستنی دوکان" },
        "Shop name, phone, address, Instagram and WhatsApp for the booking site; opening hours, time between clients for each barber, closed days, passwords and backups.": {
            ar: "اسم الصالون وهاتفه وعنوانه وإنستغرام وواتساب لموقع الحجز؛ وساعات العمل والوقت بين الزبائن لكل حلّاق وأيام الإغلاق وكلمات المرور والنسخ الاحتياطية.",
            ckb: "ناو، تەلەفۆن، ناونیشان، ئینستاگرام و واتسئاپی دوکان بۆ ماڵپەڕی نۆرەگرتن؛ کاتی کارکردن، ماوەی نێوان کڕیاران بۆ هەر باربەرێک، ڕۆژانی داخراو، وشەی نهێنی و پاشەکەوتکردن."
        },

        // Team
        "Developer": { ar: "مطوّر", ckb: "گەشەپێدەر" },
        "Freelance developer and graphic designer with more than two years of building. He brings code and visual design together, turning ideas into working software, graphics and digital content, and gets sharper with every project.": {
            ar: "مطوّر ومصمّم جرافيك مستقل بخبرة تزيد على سنتين في البناء. يجمع البرمجة بالتصميم البصري، فيحوّل الأفكار إلى برمجيات تعمل ورسومات ومحتوى رقمي، ويزداد إتقانًا مع كل مشروع.",
            ckb: "گەشەپێدەر و دیزاینەری گرافیکی سەربەخۆ بە زیاتر لە دوو ساڵ ئەزموون. کۆد و دیزاینی بینراو پێکەوە دەبەستێت و بیرۆکەکان دەکاتە سۆفتوێری کارا، گرافیک و ناوەڕۆکی دیجیتاڵ، و لەگەڵ هەر پرۆژەیەک شارەزاتر دەبێت."
        },
        "Designer & Videographer": { ar: "مصمّم ومصوّر فيديو", ckb: "دیزاینەر و ڤیدیۆگرافەر" },
        "Filmmaker and photographer in Erbil since 2022. At an AMG Performance dealership he averaged four finished car videos a day, and he has led content for brands, events and schools, from the first idea to the final edit.": {
            ar: "صانع أفلام ومصوّر في أربيل منذ عام ٢٠٢٢. أنجز في وكالة AMG Performance أربعة فيديوهات سيارات مكتملة يوميًا في المتوسط، وقاد المحتوى لعلامات تجارية وفعاليات ومدارس، من الفكرة الأولى حتى المونتاج النهائي.",
            ckb: "فیلمساز و وێنەگرە لە هەولێر لە ساڵی ٢٠٢٢ەوە. لە نوێنەرایەتیی AMG Performance بە تێکڕا ڕۆژانە چوار ڤیدیۆی تەواوی ئۆتۆمبێلی ئامادە دەکرد، و ناوەڕۆکی بۆ براند و بۆنە و قوتابخانەکان بەڕێوە بردووە، لە یەکەم بیرۆکەوە تا مۆنتاژی کۆتایی."
        },
        "Founder & Developer": { ar: "المؤسس والمطوّر", ckb: "دامەزرێنەر و گەشەپێدەر" },
        "Founder and lead developer of Shax Store, with more than two years of shipping software. He leads products from idea to launch: fast, secure full-stack websites, AI workflows he engineers himself, and the design and video that give them their look.": {
            ar: "مؤسس Shax Store ومطوّرها الرئيسي، بخبرة تزيد على سنتين في إطلاق البرمجيات. يقود المنتجات من الفكرة إلى الإطلاق: مواقع متكاملة سريعة وآمنة، وسير عمل بالذكاء الاصطناعي يصمّمه بنفسه، والتصميم والفيديو اللذان يمنحانها هويتها.",
            ckb: "دامەزرێنەر و گەشەپێدەری سەرەکیی Shax Store، بە زیاتر لە دوو ساڵ ئەزموون لە دروستکردن و بڵاوکردنەوەی سۆفتوێر. بەرهەمەکان لە بیرۆکەوە تا بڵاوکردنەوە بەڕێوە دەبات: ماڵپەڕی فول-ستاکی خێرا و پارێزراو، ڕێگاکانی کاری زیرەکی دەستکرد کە خۆی دایاندەڕێژێت، و ئەو دیزاین و ڤیدیۆیەی ناسنامەیان پێدەبەخشێت."
        }
    }
};
