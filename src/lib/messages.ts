import type { Locale } from "@/lib/i18n";
import { FAQ_ITEMS, FAQ_CATEGORIES, type FaqItem, type FaqCategoryId } from "@/lib/site-content";

export type NavKey = "About" | "Services" | "News" | "FAQ" | "OfficialLINE" | "Contact";

export type ServiceCardCopy = {
  key: "system" | "chatbot" | "web" | "design" | "geo" | "ai-consulting";
  href: string;
  title: string;
  enTitle: string;
  description: string;
  linkLabel: string;
};

export type Messages = {
  htmlLang: string;
  ogLocale: string;
  nav: Record<NavKey, string>;
  menu: { open: string; close: string };
  hero: {
    line1: string;
    line2: string;
    body: string[];
  };
  about: {
    headingBefore: string;
    headingMuted: string;
    headingAfter: string;
    p1: string;
    p2Before: string;
    p2After: string;
    p3: string;
    companyLink: string;
    valuesAria: string;
    values: { title: string; body: string }[];
  };
  services: {
    heading: string;
    headingLine2: string;
    body: string[];
    cardsAria: string;
    cards: ServiceCardCopy[];
  };
  news: {
    heading: string;
    viewAll: string;
    viewAllSr: string;
    empty: string;
    backToList: string;
    japaneseNote: string;
  };
  contact: {
    title: string;
    description: string[];
    line: string;
    form: string;
    replyNote: string;
  };
  footer: {
    tagline1: string;
    tagline2: string;
    navLabel: string;
    links: { href: string; label: string }[];
    logoAlt: string;
  };
  aboutPage: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    taglineBefore: string;
    taglineAccent: string;
    storyHeading: string;
    storyP1: string;
    storyP2Before: string;
    storyP2After: string;
    storyP3: string;
    profile: string;
    profileHeading: string;
    labels: { legalName: string; representative: string; capital: string; address: string; businesses: string };
    representativeTitle: string;
  };
  contactPage: {
    heading: string;
    lead1: string;
    lead2: string;
    successTitle: string;
    successBody: string[];
    backHome: string;
    category: string;
    required: string;
    optional: string;
    categories: string[];
    name: string;
    namePlaceholder: string;
    email: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    error: string;
    subject: (category: string) => string;
  };
  faqPage: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    lead: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    backHome: string;
    moreContact: string;
    moreDetail: string;
    categories: Record<FaqCategoryId, string>;
    items: FaqItem[];
  };
  chatbot: {
    role: string;
    close: string;
    open: string;
    greeting: string;
    placeholder: string;
    send: string;
    thinking: string;
    talk: string;
    contactPage: string;
    suggestions: string[];
  };
  common: {
    home: string;
    breadcrumb: string;
    scroll: string;
  };
  servicePages: Record<string, ServicePageCopy>;
};

export type ServicePageCopy = {
  path: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  crumb: string;
  h1: string[];
  h1Sub?: string;
  intro: string;
  sections: {
    eyebrow: string;
    heading: string;
    body?: string;
    cards: { title: string; body: string }[];
    numbered?: boolean;
  }[];
  faqHeading: string;
  faqs: { id: string; question: string; answer: string; moreHref?: string }[];
  contactTitle: string;
  contactDescription: string[];
};

const jaFaqItems: FaqItem[] = FAQ_ITEMS;

const enFaqItems: FaqItem[] = [
  {
    id: "about-company",
    category: "about",
    question: "What is AMALINK (Godo Kaisha AMALINK)?",
    answer:
      "We are a digital creative team based on Amami Oshima in Kagoshima Prefecture. We design websites that become a business’s public face, and systems that make daily work easier — in plain language, together with you.",
  },
  {
    id: "about-customers",
    category: "about",
    question: "Who usually gets in touch?",
    answer:
      "Mostly small businesses on Amami Oshima and nearby islands — tourism, lodging, local products, and community groups. You do not need a finished brief. “We want a website,” “reservations are messy,” or “we also need a logo” is enough to start.",
  },
  {
    id: "about-amami",
    category: "about",
    question: "Why are you based on Amami Oshima?",
    answer:
      "AMALINK was born on Amami Oshima. We wanted work that stays close to island life while connecting the region through digital tools. Island constraints like connectivity and easy day-to-day operation are built into our designs from the start.",
  },
  {
    id: "service-website",
    category: "services",
    question: "Can you build a website?",
    answer:
      "Yes. We make introduction sites, lead-generation pages, and more, matched to your goal. Sites are designed to work well on phones and to be easy for you to update.",
    moreHref: "/web-production",
  },
  {
    id: "service-amami-web",
    category: "services",
    question: "Is there a web production company on Amami Oshima?",
    answer:
      "Yes. Godo Kaisha AMALINK is based on Amami Oshima and builds corporate and marketing sites, including renewals. We also take online consultations from anywhere.",
    moreHref: "/web-production",
  },
  {
    id: "service-amami-design",
    category: "services",
    question: "Can I request design work on Amami Oshima?",
    answer:
      "Yes. We handle logos, business cards, brochures, and social images. Printing and delivery can be included, and we can align the look with your website.",
    moreHref: "/design",
  },
  {
    id: "service-system",
    category: "services",
    question: "Do you also build systems?",
    answer:
      "Yes. We build web apps and operations tools that reduce daily friction — reservations, inventory, inquiry tracking, and more. Moving off Excel or paper is a common request.",
    moreHref: "/system-development",
  },
  {
    id: "service-design-only",
    category: "services",
    question: "Can I order design only, such as a logo or cards?",
    answer:
      "Yes. Visual-only work is welcome. We can handle printing through delivery, or unify the brand with a new website.",
    moreHref: "/design",
  },
  {
    id: "service-renewal",
    category: "services",
    question: "Can you renew an existing website?",
    answer:
      "Of course. We can refresh the design, improve mobile layout, make updates easier, and speed up pages — keeping what already works.",
    moreHref: "/web-production",
  },
  {
    id: "service-tourism",
    category: "services",
    question: "Do you make sites for tourism, lodging, or restaurants?",
    answer:
      "Yes. We focus on menus, access, booking or inquiry paths, and links to Instagram and other socials. Seasonal updates can be designed in from the start.",
    moreHref: "/web-production",
  },
  {
    id: "service-small-start",
    category: "services",
    question: "Can we start small, even with one page?",
    answer:
      "Yes. Many projects start with the minimum and grow later. We propose a scope that fits your budget and purpose.",
    moreHref: "/web-production",
  },
  {
    id: "service-geo-what",
    category: "services",
    question: "What is GEO?",
    answer:
      "GEO (Generative Engine Optimization) helps AI systems describe and cite your business accurately. Rankings still matter, but so does appearing correctly inside AI answers.",
    moreHref: "/geo-seo",
  },
  {
    id: "service-geo-scope",
    category: "services",
    question: "What do you actually do for GEO?",
    answer:
      "We shape copy, FAQs, company facts, structured data (JSON-LD), and files like llms.txt so people and AI can understand you. This can be part of a new site or an existing-site review.",
    moreHref: "/geo-seo",
  },
  {
    id: "service-geo-existing",
    category: "services",
    question: "Can you improve GEO on a site you did not build?",
    answer:
      "Yes. We can add FAQs, clean up information, and improve metadata without a full redesign. No-code platforms such as Wix or STORES may limit structured data. We will tell you honestly what is possible.",
    moreHref: "/geo-seo",
  },
  {
    id: "service-geo-seo",
    category: "services",
    question: "Are SEO and GEO different?",
    answer:
      "SEO aims at search result rankings. GEO aims at being cited inside AI-generated answers. Both help people find you. We design with both in mind.",
    moreHref: "/geo-seo",
  },
  {
    id: "service-ai-consulting",
    category: "services",
    question: "What does AI consulting include?",
    answer:
      "We help you use generative AI in real work, and can also build internal chatbots from your manuals and company knowledge.",
    moreHref: "/ai-consulting",
  },
  {
    id: "service-chatbot",
    category: "services",
    question: "What is an AI avatar chatbot?",
    answer:
      "A character-based chat on your site that answers common questions and can hand off to an inquiry. We design the scope, look, and path into contact.",
    moreHref: "/ai-avatar-chatbot",
  },
  {
    id: "service-chatbot-scope",
    category: "services",
    question: "Will the chatbot answer anything?",
    answer:
      "No. We define the allowed topics first — for example, only your services and the local area.",
    moreHref: "/ai-avatar-chatbot",
  },
  {
    id: "process-area",
    category: "process",
    question: "Can I hire you from outside Amami Oshima?",
    answer:
      "Yes. We are based on Amami Oshima, but we work online nationwide. Meetings and production can be fully remote.",
    moreHref: "/contact",
  },
  {
    id: "process-price",
    category: "process",
    question: "Can you give a price range?",
    answer:
      "It depends on pages, features, and design scope. Even a rough idea is enough for an estimate. Use the form or official LINE.",
    moreHref: "/contact",
  },
  {
    id: "process-timeline",
    category: "process",
    question: "How long does production take?",
    answer:
      "It depends on scope and how ready your materials are. A simple site may take a few weeks; more pages and features take longer. We share a schedule after the first conversation.",
    moreHref: "/contact",
  },
  {
    id: "process-flow",
    category: "process",
    question: "What is the process?",
    answer:
      "We start with a hearing (in person or online), then a quote if needed. After you approve, we produce the work and explain how to operate and update it at handover.",
    moreHref: "/contact",
  },
  {
    id: "process-materials",
    category: "process",
    question: "What if we have no photos or copy yet?",
    answer:
      "That is fine. We can help structure the writing and advise on photos. If assets are limited, we can start with a simple layout.",
    moreHref: "/web-production",
  },
  {
    id: "process-meeting",
    category: "process",
    question: "How do meetings work?",
    answer:
      "In person, Zoom, official LINE, or email — whatever fits. We keep a pace that works around your day-to-day, including from other islands or the mainland.",
    moreHref: "/contact",
  },
  {
    id: "process-undecided",
    category: "process",
    question: "Can we talk before we know what we want?",
    answer:
      "Yes — that is how many projects start. We will sort the purpose together.",
    moreHref: "/contact",
  },
  {
    id: "support-after",
    category: "support",
    question: "Is there support after launch?",
    answer:
      "We provide a walkthrough and a simple guide so you can update the site yourself. Ongoing updates or retainers are available if you need them.",
    moreHref: "/contact",
  },
  {
    id: "support-cms",
    category: "support",
    question: "Can we update the site ourselves?",
    answer:
      "Yes. A CMS lets you change news, photos, and menus. We teach you how at launch.",
    moreHref: "/web-production",
  },
  {
    id: "support-sns-only",
    category: "support",
    question: "Is Instagram enough without a website?",
    answer:
      "Social is great for daily posts. A website still helps as a stable home for who you are, what you offer, and how to get in touch. Using both together works well.",
    moreHref: "/web-production",
  },
  {
    id: "support-response",
    category: "support",
    question: "How soon do you reply?",
    answer:
      "Usually within two business days. If it is urgent, please say so in your message.",
    moreHref: "/contact",
  },
];

const ja: Messages = {
  htmlLang: "ja",
  ogLocale: "ja_JP",
  nav: {
    About: "会社概要",
    Services: "サービス",
    News: "お知らせ",
    FAQ: "よくある質問",
    OfficialLINE: "公式LINE",
    Contact: "お問い合わせ",
  },
  menu: { open: "メニューを開く", close: "メニューを閉じる" },
  hero: {
    line1: "島のリズムで、",
    line2: "未来をつくる。",
    body: [
      "波音のように穏やかに、",
      "けれど着実に。",
      "奄美大島でAIのことなら、",
      "AMALINKへ。",
      "生成AIの活用からWeb制作まで、",
      "島から全国へ伴走します。",
    ],
  },
  about: {
    headingBefore: "デジタルだけど、",
    headingMuted: "体温のある",
    headingAfter: "仕事を。",
    p1: "合同会社AMALINK（アマリンク）は、奄美大島で生まれたデジタルクリエイティブチームです。",
    p2Before: "私たちの名前「AMALINK」には、故郷「",
    p2After: "」という2つの願いが込められています。",
    p3: "最先端の技術も大切ですが、それ以上に「誰かの役に立つこと」を大切に。島の暮らしに、そっと寄り添うような温かいデジタル体験をお届けします。",
    companyLink: "会社概要を見る",
    valuesAria: "価値観カード。縦スクロールで横に進みます",
    values: [
      { title: "島に根ざす", body: "奄美の文化や風土を大切にしながら、デジタルの力で新しい可能性を育みます。" },
      { title: "波紋を広げる", body: "小さな課題解決が、やがて大きな変化の波となり、島全体を豊かにしていきます。" },
      { title: "人に寄り添う", body: "難しい技術用語ではなく、分かりやすい言葉と温かい対応で、皆様の想いを形にします。" },
    ],
  },
  services: {
    heading: "島暮らしを、",
    headingLine2: "ちょっと便利に。",
    body: [
      "難しそうなITのことも、私たちにお任せください。",
      "お客様一人ひとりのペースに合わせて、",
      "最適な解決策をご提案します。",
    ],
    cardsAria: "サービスカード。縦スクロールで横に進みます",
    cards: [
      {
        key: "system",
        href: "/system-development",
        title: "システム開発",
        enTitle: "System Development",
        description:
          "日々の業務で「困ったな」「大変だな」と感じることはありませんか？\n在庫管理や予約システムなど、面倒な作業を自動化して、\nもっと大切なことに時間を使えるようお手伝いします。",
        linkLabel: "システム開発について詳しく見る",
      },
      {
        key: "chatbot",
        href: "/ai-avatar-chatbot",
        title: "AIアバターチャットボット",
        enTitle: "AI Avatar Chatbot",
        description:
          "自社サイト向けのAIチャットボット制作に対応しています。\nアバター付きの案内ボットや、答える範囲を絞った設計など、\n用途に合わせて組み込みまでご相談いただけます。",
        linkLabel: "チャットボットについて詳しく見る",
      },
      {
        key: "web",
        href: "/web-production",
        title: "ホームページ制作",
        enTitle: "Web Production",
        description:
          "お店や会社の「顔」となるホームページ。\nただ綺麗なだけでなく、お客様が見やすく、\n使いやすいサイトを丁寧に作り上げます。",
        linkLabel: "ホームページ制作について詳しく見る",
      },
      {
        key: "design",
        href: "/design",
        title: "デザイン",
        enTitle: "Creative Design",
        description:
          "ロゴマークや名刺、パンフレットなど。\nデザインから印刷手配・納品まで一気通貫で、\n見る人の心に残るカタチをご提案します。",
        linkLabel: "デザインについて詳しく見る",
      },
      {
        key: "geo",
        href: "/geo-seo",
        title: "GEO・SEO対策",
        enTitle: "GEO & SEO",
        description:
          "検索にもAIにも、正しく伝わるWebへ。\nSEOとGEOの両面から、事業内容が引用・発見されやすい\nページ設計と情報整理をサポートします。",
        linkLabel: "GEO・SEO対策について詳しく見る",
      },
      {
        key: "ai-consulting",
        href: "/ai-consulting",
        title: "AIコンサルティング",
        enTitle: "AI Consulting",
        description:
          "生成AIの活用から、\n社内マニュアル特化の社内用チャットボット制作まで。\n業務で使える形に落とし込み、導入後も伴走します。",
        linkLabel: "AIコンサルティングについて詳しく見る",
      },
    ],
  },
  news: {
    heading: "お知らせ",
    viewAll: "すべて見る",
    viewAllSr: "お知らせ一覧へ",
    empty: "お知らせはまだありません",
    backToList: "お知らせ一覧へ",
    japaneseNote: "",
  },
  contact: {
    title: "まずは、気軽にお話ししませんか？",
    description: ["「これって相談をしていいのかな？」", "そんな気持ちのままで大丈夫。お気軽にどうぞ。"],
    line: "公式LINE",
    form: "お問い合わせ",
    replyNote: "お問い合わせには、通常2営業日以内に返信いたします。",
  },
  footer: {
    tagline1: "島のリズムで、",
    tagline2: "未来をつくる。",
    navLabel: "フッターナビ",
    logoAlt: "合同会社AMALINK ロゴ",
    links: [
      { href: "/about", label: "会社概要" },
      { href: "/ai-consulting", label: "AIコンサルティング" },
      { href: "/web-production", label: "ホームページ制作" },
      { href: "/design", label: "デザイン" },
      { href: "/geo-seo", label: "GEO・SEO対策" },
      { href: "/system-development", label: "システム開発" },
      { href: "/ai-avatar-chatbot", label: "AIアバターチャットボット" },
      { href: "/faq", label: "よくある質問" },
      { href: "/news", label: "お知らせ" },
      { href: "/contact", label: "お問い合わせ" },
    ],
  },
  aboutPage: {
    metaTitle: "会社概要",
    metaDescription:
      "合同会社AMALINK（AMALINK）の会社概要。代表社員 麻生川昌平。鹿児島県奄美大島・宇検村拠点。資本金100万円。AIコンサルティング・ホームページ制作・デザイン・システム開発・GEO対策。全国オンライン対応。",
    heading: "会社概要",
    taglineBefore: "島のリズムで、",
    taglineAccent: "未来をつくる。",
    storyHeading: "デジタルだけど、体温のある仕事を。",
    storyP1: "合同会社AMALINK（アマリンク）は、奄美大島で生まれたデジタルクリエイティブチームです。",
    storyP2Before: "名前の「AMALINK」には、故郷「",
    storyP2After: "」という二つの願いが込められています。",
    storyP3:
      "最先端の技術も大切ですが、それ以上に「誰かの役に立つこと」を大切に。島の暮らしに、そっと寄り添うような温かいデジタル体験をお届けします。",
    profile: "Profile",
    profileHeading: "会社情報",
    labels: {
      legalName: "商号",
      representative: "代表社員",
      capital: "資本金",
      address: "所在地",
      businesses: "事業内容",
    },
    representativeTitle: "代表社員",
  },
  contactPage: {
    heading: "お問い合わせ",
    lead1: "内容が固まっていなくても大丈夫です。",
    lead2: "通常2営業日以内にご返信します。",
    successTitle: "送信完了",
    successBody: [
      "お問い合わせありがとうございます。",
      "合同会社AMALINKの担当より、内容確認のうえご連絡します。",
      "しばらくお待ちくださいませ。",
    ],
    backHome: "トップページへ戻る",
    category: "お問い合わせ項目",
    required: "必須",
    optional: "任意",
    categories: [
      "AIコンサルティングについて",
      "ホームページ制作について",
      "システム開発について",
      "デザインについて",
      "GEO・SEO対策について",
      "その他・ご相談",
    ],
    name: "お名前",
    namePlaceholder: "例）奄美 太郎",
    email: "メールアドレス",
    message: "お問い合わせ内容",
    messagePlaceholder: "「こんなシステムを作りたい」「費用感を知りたい」など、ざっくりとした内容でも大丈夫です。",
    submit: "上記の内容で送信する",
    submitting: "送信中...",
    error: "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。",
    subject: (category) => `【AMALINK】お問い合わせ (${category})`,
  },
  faqPage: {
    metaTitle: "よくある質問（FAQ）",
    metaDescription:
      "合同会社AMALINK（AMALINK）へのよくある質問。奄美大島でのAI活用・ホームページ制作・システム開発・GEO対策の料金、対応エリア、選び方について回答します。",
    heading: "よくある質問",
    lead: "ご依頼前によくいただく質問をまとめました。",
    ctaTitle: "気になることなんでも、お気軽にどうぞ。",
    ctaBody: "概算だけ知りたい、こんなことできる？など、内容が決まっていなくても大丈夫です。",
    ctaButton: "お問い合わせはこちら",
    backHome: "← TOPへ",
    moreContact: "お問い合わせはこちら",
    moreDetail: "詳しくはこちら",
    categories: FAQ_CATEGORIES,
    items: jaFaqItems,
  },
  chatbot: {
    role: "奄美大島 & AMALINK 案内係",
    close: "チャットを閉じる",
    open: "くろうさに話しかける",
    greeting: "はじめまして。くろうさだよ。奄美大島やAMALINKのこと、なんでも聞いてね。",
    placeholder: "奄美やAMALINKのことを聞いてね",
    send: "送信",
    thinking: "考え中…",
    talk: "くろうさと話す",
    contactPage: "お問い合わせページへ",
    suggestions: ["AMALINKってどんな会社？", "ホームページ制作お願いできる？", "奄美大島以外からも依頼できる？"],
  },
  common: { home: "ホーム", breadcrumb: "パンくず", scroll: "Scroll" },
  servicePages: {},
};

const en: Messages = {
  htmlLang: "en",
  ogLocale: "en_US",
  nav: {
    About: "Company",
    Services: "Services",
    News: "News",
    FAQ: "FAQ",
    OfficialLINE: "LINE",
    Contact: "Contact",
  },
  menu: { open: "Open menu", close: "Close menu" },
  hero: {
    line1: "In the island’s rhythm,",
    line2: "we build the future.",
    body: [
      "Calm as the waves,",
      "and just as steady.",
      "For AI on Amami Oshima,",
      "talk to AMALINK.",
      "From generative AI to the web,",
      "we walk with you from the island to anywhere in Japan.",
    ],
  },
  about: {
    headingBefore: "Digital work,",
    headingMuted: "with warmth.",
    headingAfter: "",
    p1: "Godo Kaisha AMALINK is a digital creative team born on Amami Oshima.",
    p2Before: "The name AMALINK holds two wishes: our home, ",
    p2After: ".",
    p3: "New technology matters — but being useful to someone matters more. We make digital experiences that sit quietly beside island life.",
    companyLink: "Company overview",
    valuesAria: "Values cards. Scroll vertically to move sideways.",
    values: [
      { title: "Rooted in the island", body: "We honor Amami’s culture and landscape while growing new possibilities with digital tools." },
      { title: "Widening the ripple", body: "Small fixes become larger waves of change, and help the island thrive." },
      { title: "Close to people", body: "Plain words and a warm pace — we shape what you have in mind without the jargon." },
    ],
  },
  services: {
    heading: "Make island life",
    headingLine2: "a little easier.",
    body: [
      "Leave the technical parts with us.",
      "We match the pace of each client,",
      "and propose what actually fits.",
    ],
    cardsAria: "Service cards. Scroll vertically to move sideways.",
    cards: [
      {
        key: "system",
        href: "/system-development",
        title: "Systems",
        enTitle: "System Development",
        description:
          "Stuck on daily admin?\nWe automate inventory, bookings, and other chores\nso you can spend time on what matters.",
        linkLabel: "Learn more about systems",
      },
      {
        key: "chatbot",
        href: "/ai-avatar-chatbot",
        title: "AI avatar chatbot",
        enTitle: "AI Avatar Chatbot",
        description:
          "We build AI chatbots for your site.\nAvatar guides, a defined answer scope,\nand installation to match how you work.",
        linkLabel: "Learn more about chatbots",
      },
      {
        key: "web",
        href: "/web-production",
        title: "Websites",
        enTitle: "Web Production",
        description:
          "Your shop or company’s public face.\nNot just pretty — easy to read,\nand easy for visitors to use.",
        linkLabel: "Learn more about websites",
      },
      {
        key: "design",
        href: "/design",
        title: "Design",
        enTitle: "Creative Design",
        description:
          "Logos, cards, brochures, and more.\nFrom design through print and delivery,\nwe shape work people remember.",
        linkLabel: "Learn more about design",
      },
      {
        key: "geo",
        href: "/geo-seo",
        title: "GEO & SEO",
        enTitle: "GEO & SEO",
        description:
          "Web that search engines and AI can understand.\nWe structure pages so your work is found\nand cited correctly.",
        linkLabel: "Learn more about GEO & SEO",
      },
      {
        key: "ai-consulting",
        href: "/ai-consulting",
        title: "AI consulting",
        enTitle: "AI Consulting",
        description:
          "From generative AI in daily work\nto internal chatbots trained on your manuals.\nWe stay with you after launch.",
        linkLabel: "Learn more about AI consulting",
      },
    ],
  },
  news: {
    heading: "News",
    viewAll: "View all",
    viewAllSr: "Go to news list",
    empty: "No news yet",
    backToList: "Back to news",
    japaneseNote: "News articles are published in Japanese.",
  },
  contact: {
    title: "Shall we talk — no pressure?",
    description: ["Not sure if this counts as a real inquiry?", "That is fine. Just say hello."],
    line: "Official LINE",
    form: "Contact form",
    replyNote: "We usually reply within two business days.",
  },
  footer: {
    tagline1: "In the island’s rhythm,",
    tagline2: "we build the future.",
    navLabel: "Footer",
    logoAlt: "AMALINK logo",
    links: [
      { href: "/about", label: "Company" },
      { href: "/ai-consulting", label: "AI consulting" },
      { href: "/web-production", label: "Websites" },
      { href: "/design", label: "Design" },
      { href: "/geo-seo", label: "GEO & SEO" },
      { href: "/system-development", label: "Systems" },
      { href: "/ai-avatar-chatbot", label: "AI avatar chatbot" },
      { href: "/faq", label: "FAQ" },
      { href: "/news", label: "News" },
      { href: "/contact", label: "Contact" },
    ],
  },
  aboutPage: {
    metaTitle: "Company",
    metaDescription:
      "Company overview of Godo Kaisha AMALINK. Representative member Shohei Asogawa. Based in Uken Village, Amami Oshima. Capital 1 million yen. AI consulting, websites, design, systems, and GEO — online nationwide.",
    heading: "Company",
    taglineBefore: "In the island’s rhythm,",
    taglineAccent: "we build the future.",
    storyHeading: "Digital work, with warmth.",
    storyP1: "Godo Kaisha AMALINK is a digital creative team born on Amami Oshima.",
    storyP2Before: "The name AMALINK holds two wishes: our home, ",
    storyP2After: ".",
    storyP3:
      "New technology matters — but being useful to someone matters more. We make digital experiences that sit quietly beside island life.",
    profile: "Profile",
    profileHeading: "Company profile",
    labels: {
      legalName: "Legal name",
      representative: "Representative",
      capital: "Capital",
      address: "Address",
      businesses: "Services",
    },
    representativeTitle: "Representative member",
  },
  contactPage: {
    heading: "Contact",
    lead1: "You do not need a finished brief.",
    lead2: "We usually reply within two business days.",
    successTitle: "Message sent",
    successBody: [
      "Thank you for writing to us.",
      "Someone at AMALINK will review your note and get back to you.",
      "Please wait a little while.",
    ],
    backHome: "Back to home",
    category: "Topic",
    required: "Required",
    optional: "Optional",
    categories: [
      "AI consulting",
      "Website production",
      "System development",
      "Design",
      "GEO & SEO",
      "Other / general inquiry",
    ],
    name: "Name",
    namePlaceholder: "e.g. Taro Amami",
    email: "Email",
    message: "Message",
    messagePlaceholder: "A rough note is fine — what you want to make, a budget range, or a question.",
    submit: "Send this message",
    submitting: "Sending…",
    error: "Sending failed. Please wait a moment and try again.",
    subject: (category) => `[AMALINK] Inquiry (${category})`,
  },
  faqPage: {
    metaTitle: "FAQ",
    metaDescription:
      "FAQ for Godo Kaisha AMALINK. AI, websites, systems, GEO, pricing, service area, and how we work — based on Amami Oshima.",
    heading: "FAQ",
    lead: "Questions we hear most often before a project starts.",
    ctaTitle: "Anything on your mind is welcome.",
    ctaBody: "A ballpark cost, a “can you do this?” — even if nothing is decided yet.",
    ctaButton: "Contact us",
    backHome: "← Home",
    moreContact: "Contact us",
    moreDetail: "Learn more",
    categories: {
      about: "About us",
      services: "Services",
      process: "Process",
      support: "Support",
    },
    items: enFaqItems,
  },
  chatbot: {
    role: "Guide to Amami Oshima & AMALINK",
    close: "Close chat",
    open: "Chat with Kurousa",
    greeting: "Hi, I’m Kurousa. Ask me about Amami Oshima or AMALINK.",
    placeholder: "Ask about Amami or AMALINK",
    send: "Send",
    thinking: "Thinking…",
    talk: "Talk with Kurousa",
    contactPage: "Go to contact",
    suggestions: ["What does AMALINK do?", "Can you build a website?", "Can I hire you from outside Amami?"],
  },
  common: { home: "Home", breadcrumb: "Breadcrumb", scroll: "Scroll" },
  servicePages: {},
};

en.servicePages = {
  "ai-consulting": {
    path: "/ai-consulting",
    eyebrow: "AI Consulting",
    metaTitle: "AI consulting",
    metaDescription:
      "AI consulting from Amami Oshima. We help you use generative AI in real work and can build internal chatbots from your company knowledge.",
    crumb: "AI consulting",
    h1: ["General-purpose AI,", "and bots that know your company."],
    h1Sub: "Practical ways to use AI on your own work.",
    intro:
      "Godo Kaisha AMALINK helps you adopt generative AI and can also build internal chatbots trained on manuals and company knowledge — until they are actually usable in your operations.",
    sections: [
      {
        eyebrow: "What we do",
        heading: "Where we focus",
        body: "We stay on support you can drop into real work: general-purpose AI and company-specific bots.",
        cards: [
          { title: "Using general-purpose AI", body: "Drafting, summaries, inquiry replies. We help you bring generative AI into daily work, and shape a way of using it that fits your team." },
          { title: "Internal chatbots", body: "Bots that know your manuals, rules, products, and FAQs — so staff can look up answers on the spot." },
          { title: "AI for development", body: "For web and systems teams who want faster implementation and fixes." },
          { title: "Foundations for in-house AI", body: "When you are ready for knowledge search or an internal bot, we pick the setup that fits the moment." },
        ],
      },
      {
        eyebrow: "What we offer",
        heading: "Examples",
        body: "Diagnosis only, an internal bot, or ongoing support — start with the slice you need.",
        cards: [
          { title: "Review and diagnosis", body: "We map workflows, manual work, and scattered documents, then find where AI or an internal bot will actually help." },
          { title: "How to use general AI", body: "Shared patterns so anyone on the team can get consistent quality — including prompts and operating tips." },
          { title: "A company-specific bot", body: "A chatbot strong on your own knowledge, to lighten FAQs and onboarding." },
          { title: "Grow it in operation", body: "When new models appear, we update how you use them. Support after launch is part of the work." },
        ],
      },
      {
        eyebrow: "Process",
        heading: "From first talk to habit",
        numbered: true,
        cards: [
          { title: "Listen", body: "Current work, pain points, manuals, and where you want to go." },
          { title: "Find what helps", body: "General AI, an internal bot, or both — we pick the lightest path that still works." },
          { title: "Try a small slice", body: "No company-wide rollout on day one. We test a range you can judge." },
          { title: "Adopt and settle", body: "Usage patterns and rules so it continues in the field." },
          { title: "Review and improve", body: "We grow the setup as models and needs change." },
        ],
      },
    ],
    faqHeading: "AI consulting FAQ",
    faqs: [
      { id: "ai-consult-undecided", question: "Can we talk before we know which AI to use?", answer: "Yes. We listen first. Sometimes a general AI workflow is enough; sometimes a bot trained on your manuals is a better fit.", moreHref: "/contact" },
      { id: "ai-consult-internal-bot", question: "Can you build an internal chatbot?", answer: "Yes. We can make a bot focused on manuals, employment rules, products, and other company knowledge.", moreHref: "/contact" },
      { id: "ai-consult-tools", question: "What kinds of AI support do you offer?", answer: "Generative AI in operations, internal chatbots, and AI for development teams. We do not push image tools or automation you will not use.", moreHref: "/contact" },
      { id: "ai-consult-latest", question: "Do you follow the latest models?", answer: "Yes. We watch new models and features, and recommend only what is usable in your work. Reviews after launch are welcome.", moreHref: "/contact" },
      { id: "ai-consult-other", question: "Can this combine with a website or a system?", answer: "Yes. From AI adoption through a public chatbot, operations software, or a new site — one conversation can cover the set.", moreHref: "/web-production" },
    ],
    contactTitle: "Shall we talk — no pressure?",
    contactDescription: ["Tried AI once, or want manuals turned into a bot — either is fine.", "We will listen and sort the next step together."],
  },
  "web-production": {
    path: "/web-production",
    eyebrow: "Web Production",
    metaTitle: "Websites",
    metaDescription: "Website production from Amami Oshima. Corporate and marketing sites that are easy to read, easy to update, and understandable to AI — online nationwide.",
    crumb: "Websites",
    h1: ["A website that is easy to read,", "and easy to keep."],
    intro: "Godo Kaisha AMALINK builds sites that are clear to visitors and easy for you to update. New sites and renewals are both welcome, even before the brief is finished. We are based on Amami Oshima and work online nationwide.",
    sections: [
      {
        eyebrow: "What we offer",
        heading: "Examples",
        cards: [
          { title: "Corporate sites", body: "Who you are, what you offer, access, and contact — the basics, clearly arranged." },
          { title: "Marketing sites", body: "Pages that help people find you and get in touch, including for tourism and local products." },
          { title: "Renewals", body: "Keep what works. Improve design, mobile layout, speed, and how you update content." },
          { title: "Easy updates", body: "A CMS so you can change news and photos yourself, with a walkthrough at launch." },
        ],
      },
      {
        eyebrow: "Process",
        heading: "From first talk to launch",
        numbered: true,
        cards: [
          { title: "Hearing", body: "Purpose, audience, budget, and what you already have." },
          { title: "Proposal", body: "Structure, look, and a quote you can judge." },
          { title: "Production", body: "Design and build, with reviews along the way." },
          { title: "Launch", body: "Go live, plus how to operate and update the site." },
        ],
      },
    ],
    faqHeading: "Website FAQ",
    faqs: enFaqItems.filter((item) => ["service-website", "service-renewal", "service-small-start", "process-materials", "support-cms"].includes(item.id)),
    contactTitle: "Shall we talk — no pressure?",
    contactDescription: ["You do not need to know what to build yet.", "We will sort purpose and content together."],
  },
  design: {
    path: "/design",
    eyebrow: "Creative Design",
    metaTitle: "Design",
    metaDescription: "Logo, print, and brand design from Amami Oshima. From concept through printing and delivery, including alignment with your website.",
    crumb: "Design",
    h1: ["Visuals that carry", "what you want to say."],
    intro: "Godo Kaisha AMALINK designs logos, cards, brochures, and other brand pieces. Printing and delivery can be included, and we can align the look with your website. Based on Amami Oshima, online nationwide.",
    sections: [
      {
        eyebrow: "What we offer",
        heading: "Examples",
        cards: [
          { title: "Logos", body: "Marks that fit how and where you will actually use them." },
          { title: "Business cards & print", body: "Cards, flyers, and brochures — through print and delivery if you want." },
          { title: "Social images", body: "Templates and assets that stay consistent on Instagram and elsewhere." },
          { title: "Brand with the web", body: "One look across print and the site, so nothing feels like a separate job." },
        ],
      },
      {
        eyebrow: "Process",
        heading: "From first talk to delivery",
        numbered: true,
        cards: [
          { title: "Hearing", body: "Use cases, tone, and where the design will live." },
          { title: "Direction", body: "A few directions you can react to." },
          { title: "Refine", body: "We tighten the chosen path." },
          { title: "Handover", body: "Files, print, and how to use the assets." },
        ],
      },
    ],
    faqHeading: "Design FAQ",
    faqs: enFaqItems.filter((item) => ["service-amami-design", "service-design-only"].includes(item.id)),
    contactTitle: "Shall we talk — no pressure?",
    contactDescription: ["A logo only, or a full set with the website — either is fine.", "Tell us how it will be used."],
  },
  "geo-seo": {
    path: "/geo-seo",
    eyebrow: "GEO & SEO",
    metaTitle: "GEO & SEO",
    metaDescription: "SEO and GEO from Amami Oshima. Pages that search engines and AI can understand, cite, and find.",
    crumb: "GEO & SEO",
    h1: ["Web that search and AI", "can both understand."],
    intro: "We combine classic SEO with GEO so your business is found in search and described correctly by AI. Structure, FAQs, and machine-readable data included.",
    sections: [
      {
        eyebrow: "What we offer",
        heading: "Examples",
        cards: [
          { title: "SEO", body: "Headings, metadata, internal links, and page structure so Google and others can find you." },
          { title: "GEO", body: "Information design so generative AI can introduce and cite you accurately." },
          { title: "FAQs and company facts", body: "Clear answers to what people (and models) actually ask." },
          { title: "Structured data & llms.txt", body: "JSON-LD and crawler-facing files when they help." },
        ],
      },
      {
        eyebrow: "Process",
        heading: "From review to improvement",
        numbered: true,
        cards: [
          { title: "Look at the now", body: "Current pages, search, and how AI already talks about you." },
          { title: "Prioritize", body: "What to fix first for people and for machines." },
          { title: "Rewrite and structure", body: "Copy, FAQs, schema, and internal paths." },
          { title: "Keep tuning", body: "As search and models change, we adjust." },
        ],
      },
    ],
    faqHeading: "GEO & SEO FAQ",
    faqs: enFaqItems.filter((item) => item.id.startsWith("service-geo")),
    contactTitle: "Shall we talk — no pressure?",
    contactDescription: ["A new site or a review of what you have — both work.", "We will be honest about what the platform allows."],
  },
  "system-development": {
    path: "/system-development",
    eyebrow: "System Development",
    metaTitle: "Systems",
    metaDescription: "Operations systems for Amami Oshima and beyond: bookings, inventory, inquiries. Combined with AI consulting when it helps.",
    crumb: "Systems",
    h1: ["Start small.", "Systems that fit Amami businesses."],
    intro: "Godo Kaisha AMALINK builds web apps for bookings, inventory, and inquiries. We can start from paper or Excel, and we keep island operating realities in mind.",
    sections: [
      {
        eyebrow: "What we build",
        heading: "Example systems",
        body: "These are examples. If an off-the-shelf tool is enough, we will say so.",
        cards: [
          { title: "Bookings", body: "Bring phone, LINE, and paper bookings into one place." },
          { title: "Inventory", body: "Share stock and movements so double entry goes away." },
          { title: "Inquiries & customers", body: "Track status and history so nothing is dropped." },
          { title: "Reports", body: "Cut repetitive Excel and status reports." },
        ],
      },
      {
        eyebrow: "Process",
        heading: "From first talk to operation",
        numbered: true,
        cards: [
          { title: "Hearing", body: "How work runs today, and where it hurts." },
          { title: "Scope", body: "What to systemize first — and what not to." },
          { title: "Build", body: "A first version you can actually use." },
          { title: "Operate", body: "Handover, tweaks, and optional ongoing support." },
        ],
      },
    ],
    faqHeading: "Systems FAQ",
    faqs: enFaqItems.filter((item) => item.id === "service-system"),
    contactTitle: "Shall we talk — no pressure?",
    contactDescription: ["You do not need to know what to build yet.", "We will listen to today’s workflow and mark the right slice."],
  },
  "ai-avatar-chatbot": {
    path: "/ai-avatar-chatbot",
    eyebrow: "AI Avatar Chatbot",
    metaTitle: "AI avatar chatbot",
    metaDescription: "AI avatar chatbots for your site, from Amami Oshima. Scope, character, and a path into contact — built to fit the page.",
    crumb: "AI avatar chatbot",
    h1: ["An AI avatar chatbot", "that fits your site."],
    intro: "Godo Kaisha AMALINK designs and installs avatar chatbots that belong on your site. We define what it may answer, how it looks, and how it hands off to an inquiry.",
    sections: [
      {
        eyebrow: "What we offer",
        heading: "Examples",
        cards: [
          { title: "Answer scope", body: "Only your services, shop info, or the local area — and a polite no for everything else." },
          { title: "Avatar", body: "Expressions and idle motion, or your existing character if you have one." },
          { title: "Install", body: "Floating UI or in-page launch, matched to the current design." },
          { title: "Handoff", body: "FAQs in chat, quotes and consults via form or official LINE." },
        ],
      },
      {
        eyebrow: "Process",
        heading: "From first talk to go-live",
        numbered: true,
        cards: [
          { title: "Hearing", body: "What visitors ask, and what the bot must never say." },
          { title: "Design", body: "Scope, tone, and look." },
          { title: "Build", body: "Content, avatar, and the page it lives on." },
          { title: "Launch", body: "Install, test, and a simple way to update answers." },
        ],
      },
    ],
    faqHeading: "Chatbot FAQ",
    faqs: enFaqItems.filter((item) => item.id.startsWith("service-chatbot")),
    contactTitle: "Shall we talk — no pressure?",
    contactDescription: ["A small FAQ bot or a full character guide — either is fine.", "We will match it to the site you already have."],
  },
};

export function getMessages(locale: Locale): Messages {
  return locale === "en" ? en : ja;
}
