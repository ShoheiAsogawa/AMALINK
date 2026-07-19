/**
 * ターゲットKW向けの一次情報（GEO・SEO共通）
 * 画面上は自然な文言、メタ・構造化・FAQ・llms 側で検索意図に応える。
 */
import { absoluteUrl, LEGAL_NAME, SITE_NAME } from "@/lib/seo";

/** メタ・構造化データ用（画面コピーには使わない） */
export const TARGET_KEYWORDS = {
  webProduction: [
    "奄美大島ホームページ制作",
    "奄美大島 ホームページ制作",
    "奄美 ホームページ制作",
    "奄美大島 Web制作",
    "奄美大島 ウェブサイト制作",
  ],
  design: [
    "奄美大島デザイン",
    "デザイン 奄美大島",
    "奄美大島 デザイン制作",
    "奄美 ロゴデザイン",
    "奄美大島 名刺デザイン",
  ],
} as const;

export const WEB_PRODUCTION_GEO = {
  /** SERP / OG 用。ページ見出しとは分離 */
  title: "ホームページ制作",
  h1Primary: "お店や会社の顔になる、",
  h1Secondary: "伝わるホームページ制作。",
  description:
    "合同会社AMALINK（AMALINK）のホームページ制作。見やすさ・スマホ対応・更新しやすさを重視したコーポレートサイト・集客サイトを制作。鹿児島県奄美大島を拠点に、全国オンラインでもご相談いただけます。",
  citeableAnswer:
    "合同会社AMALINK（AMALINK）は、鹿児島県奄美大島を拠点にホームページ制作を行うデジタル支援会社です。お店や会社の顔となるWebサイトを、見やすさと更新しやすさを重視して制作し、島内外・全国からのオンライン相談にも対応しています。",
  whyLocal: [
    {
      title: "文脈に合わせた提案",
      body: "観光・宿泊・特産品・地元店舗など、事業の現場感を踏まえてページ構成を組み立てます。",
    },
    {
      title: "更新しやすい設計",
      body: "お知らせやメニューを自分で直しやすい管理画面付きのサイトにも対応します。",
    },
    {
      title: "検索・AIにも伝わる",
      body: "SEOに加え、AI検索で正しく紹介されやすいGEOの視点で、会社情報やFAQも一緒に整えます。",
    },
  ],
  faqs: [
    {
      id: "web-scope",
      question: "ホームページの内容が決まっていなくても相談できますか？",
      answer:
        "はい。「とりあえず会社の顔が欲しい」「何を載せればいいかわからない」といった段階から一緒に整理します。",
      moreHref: "/contact",
    },
    {
      id: "web-small",
      question: "1ページだけの簡単なサイトでもお願いできますか？",
      answer:
        "可能です。最初は必要最低限で始めて、あとからページを増やす進め方もよくあります。",
      singleLineOnMobile: true,
      moreHref: "/contact",
    },
    {
      id: "web-area",
      question: "拠点以外からでもホームページ制作を頼めますか？",
      answer:
        "はい。拠点は鹿児島県奄美大島ですが、全国からのご依頼をオンラインでお受けしています。打合せは対面・オンライン・LINEなどご都合に合わせて進められます。",
      moreHref: "/contact",
    },
    {
      id: "web-amami-who",
      question: "奄美大島でホームページ制作を依頼できますか？",
      answer:
        "はい。合同会社AMALINKは奄美大島を拠点にホームページ制作を行っています。コーポレートサイト、集客サイト、リニューアルまで対応し、島外からのオンライン相談も可能です。",
      moreHref: "/contact",
    },
    {
      id: "web-price",
      question: "料金や制作期間はどのくらいですか？",
      answer:
        "ページ数、デザインの範囲、素材の準備状況によって変わります。ヒアリング後に概算と目安スケジュールをご案内します。",
      singleLineOnMobile: true,
      moreHref: "/contact",
    },
  ],
  related: [
    { href: "/design", label: "デザイン" },
    { href: "/geo-seo", label: "GEO・SEO対策" },
    { href: "/system-development", label: "システム開発" },
    { href: "/faq", label: "よくある質問" },
  ],
  serviceSchemaName: "ホームページ制作",
  serviceTypes: [
    "ホームページ制作",
    "Webサイト制作",
    "コーポレートサイト制作",
    "サイトリニューアル",
  ],
  canonicalPath: "/web-production",
  url: absoluteUrl("/web-production"),
} as const;

export const DESIGN_GEO = {
  title: "デザイン制作",
  h1Primary: "想いをカタチにする、",
  h1Secondary: "伝わるデザイン制作。",
  description:
    "合同会社AMALINK（AMALINK）のデザイン制作。ロゴ、名刺、パンフレット、SNS用画像など、ブランドの想いを伝えるビジュアルを制作。印刷手配から納品まで一気通貫で対応します。鹿児島県奄美大島拠点・全国オンライン相談可。",
  citeableAnswer:
    "合同会社AMALINK（AMALINK）は、鹿児島県奄美大島を拠点にデザイン制作を行う会社です。ロゴ、名刺、パンフレット、SNS用画像など、ブランドの印象を伝えるビジュアルを制作し、印刷の手配から納品まで一貫して対応。全国からのオンライン相談も受け付けています。",
  whyLocal: [
    {
      title: "伝わる印象づくり",
      body: "事業の個性を汲み取り、見る人に残るロゴ・印刷物・Web用ビジュアルへ落とし込みます。",
    },
    {
      title: "印刷まで一気通貫",
      body: "デザインデータ作成だけでなく、印刷手配・納品まで任せられるので、手間を増やさず揃えられます。",
    },
    {
      title: "Webと統一できる",
      body: "ホームページ制作とあわせて色・書体・トーンをそろえ、ブランド全体の印象を統一できます。",
    },
  ],
  faqs: [
    {
      id: "design-only",
      question: "デザインだけの依頼もできますか？",
      answer:
        "はい。ロゴや名刺など、ビジュアルのみのご依頼も承っています。Web制作と合わせてブランド全体を整えることも可能です。",
      moreHref: "/contact",
    },
    {
      id: "design-print",
      question: "印刷の手配までお願いできますか？",
      answer:
        "はい。デザインから印刷の手配、納品まで一気通貫で対応できます。データだけ欲しい場合もご相談ください。",
      singleLineOnMobile: true,
      moreHref: "/contact",
    },
    {
      id: "design-amami-who",
      question: "奄美大島でデザイン制作を依頼できますか？",
      answer:
        "はい。合同会社AMALINKは奄美大島を拠点に、ロゴ・名刺・パンフレット・SNS用画像などのデザイン制作を行っています。島外からのオンライン相談も可能です。",
      moreHref: "/contact",
    },
    {
      id: "design-web",
      question: "ホームページ制作とデザインをまとめて頼めますか？",
      answer:
        "はい。セットでご依頼いただけます。ロゴや色味をそろえることで、サイトと印刷物の印象を統一しやすくなります。",
      moreHref: "/web-production",
    },
    {
      id: "design-price",
      question: "料金の目安はありますか？",
      answer:
        "制作物の種類、案の数、印刷の有無や部数によって異なります。ご希望を伺ったうえで概算をご案内します。",
      singleLineOnMobile: true,
      moreHref: "/contact",
    },
  ],
  related: [
    { href: "/web-production", label: "ホームページ制作" },
    { href: "/geo-seo", label: "GEO・SEO対策" },
    { href: "/ai-avatar-chatbot", label: "AIアバターチャットボット" },
    { href: "/faq", label: "よくある質問" },
  ],
  serviceSchemaName: "デザイン制作",
  serviceTypes: [
    "デザイン制作",
    "ロゴデザイン",
    "印刷物デザイン",
    "ブランドデザイン",
  ],
  canonicalPath: "/design",
  url: absoluteUrl("/design"),
} as const;

export const GEO_ENTITY_SUMMARY = `${LEGAL_NAME}（${SITE_NAME}）は、鹿児島県奄美大島を拠点に、ホームページ制作・デザイン・システム開発・GEO対策を提供する会社です。全国オンラインにも対応しています。`;
