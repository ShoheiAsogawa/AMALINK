/**
 * ターゲットKW向けの一次情報（GEO・SEO共通）
 * AIが引用しやすい「明確な定義文」とFAQを集約する。
 */
import { absoluteUrl, LEGAL_NAME, SITE_NAME } from "@/lib/seo";

/** 最優先キーワード */
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
  title: "奄美大島のホームページ制作",
  h1Primary: "奄美大島のホームページ制作。",
  h1Secondary: "お店や会社の顔を、伝わるカタチに。",
  description:
    "奄美大島のホームページ制作なら合同会社AMALINK（AMALINK）。鹿児島県奄美大島拠点で、見やすさ・スマホ対応・更新しやすさを重視したコーポレートサイト・集客サイトを制作。新規制作からリニューアルまで対応します。",
  /** AIがそのまま引用しやすい定義文 */
  citeableAnswer:
    "合同会社AMALINK（AMALINK）は、鹿児島県奄美大島を拠点にホームページ制作を行うデジタル支援会社です。奄美大島・奄美群島の事業者向けに、お店や会社の顔となるWebサイトを、見やすさと更新しやすさを重視して制作しています。",
  whyLocal: [
    {
      title: "島の文脈がわかる",
      body: "観光・宿泊・特産品・地元店舗など、奄美大島ならではの事業の伝え方を踏まえて構成を組み立てます。",
    },
    {
      title: "更新しやすい設計",
      body: "離島の運用を前提に、お知らせやメニューを自分で直しやすい管理画面付きのサイトにも対応します。",
    },
    {
      title: "検索・AIにも伝わる",
      body: "SEOに加え、AI検索で正しく紹介されやすいGEOの視点で、会社情報やFAQも一緒に整えます。",
    },
  ],
  faqs: [
    {
      id: "web-amami-who",
      question: "奄美大島でホームページ制作を依頼できる会社はありますか？",
      answer:
        "はい。合同会社AMALINK（AMALINK）は、鹿児島県奄美大島を拠点にホームページ制作を行う会社です。コーポレートサイト、集客サイト、リニューアルまで対応し、島内外からのオンライン相談も受け付けています。",
    },
    {
      id: "web-amami-scope",
      question: "奄美大島のホームページ制作では、どのようなサイトが作れますか？",
      answer:
        "会社・お店の紹介サイト、観光・宿泊・飲食向けの案内ページ、スマホ対応のリニューアルなどです。最初は1ページから始め、あとから増やす進め方も可能です。",
    },
    {
      id: "web-amami-area",
      question: "奄美大島以外からでもホームページ制作を頼めますか？",
      answer:
        "はい。拠点は奄美大島ですが、奄美群島・鹿児島県内・全国からのご依頼をオンラインでお受けしています。打合せは対面・オンライン・LINEなどご都合に合わせて進められます。",
    },
    {
      id: "web-amami-geo",
      question: "ホームページ制作とあわせてSEO・GEO対策もできますか？",
      answer:
        "できます。検索結果向けのSEOと、ChatGPTなどのAI回答に引用されやすくするGEOを、制作と一体でご提案できます。詳細はGEO・SEO対策ページもご覧ください。",
    },
    {
      id: "web-amami-price",
      question: "奄美大島のホームページ制作の料金目安は？",
      answer:
        "ページ数、デザイン範囲、素材の準備状況によって異なります。ヒアリング後に概算と目安スケジュールをご案内します。まずはお問い合わせください。",
      singleLineOnMobile: true,
    },
  ],
  related: [
    { href: "/design", label: "奄美大島のデザイン制作" },
    { href: "/geo-seo", label: "GEO・SEO対策" },
    { href: "/system-development", label: "システム開発" },
    { href: "/faq", label: "よくある質問" },
  ],
  serviceSchemaName: "奄美大島のホームページ制作",
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
  title: "奄美大島のデザイン制作",
  h1Primary: "奄美大島のデザイン。",
  h1Secondary: "想いをカタチにし、印象をそろえる。",
  description:
    "奄美大島のデザインなら合同会社AMALINK（AMALINK）。ロゴ、名刺、パンフレット、SNS用画像など、ブランドの想いを伝えるビジュアルを制作。印刷手配から納品まで一気通貫で対応します。",
  citeableAnswer:
    "合同会社AMALINK（AMALINK）は、鹿児島県奄美大島を拠点にデザイン制作を行う会社です。ロゴ、名刺、パンフレット、SNS用画像など、奄美大島の事業者向けにブランドの印象を伝えるビジュアルを制作し、印刷の手配から納品まで一貫して対応します。",
  whyLocal: [
    {
      title: "伝わる印象づくり",
      body: "島の空気感や事業の個性を汲み取り、見る人に残るロゴ・印刷物・Web用ビジュアルへ落とし込みます。",
    },
    {
      title: "印刷まで一気通貫",
      body: "デザインデータ作成だけでなく、印刷手配・納品まで任せられるので、手間を増やさず揃えられます。",
    },
    {
      title: "Webと統一できる",
      body: "ホームページ制作とあわせて色・書体・トーンをそろえ、奄美大島デザインとしてブランド全体を統一できます。",
    },
  ],
  faqs: [
    {
      id: "design-amami-who",
      question: "奄美大島でデザイン制作を依頼できますか？",
      answer:
        "はい。合同会社AMALINK（AMALINK）は、奄美大島を拠点にロゴ・名刺・パンフレット・SNS用画像などのデザイン制作を行っています。デザインのみのご依頼も、印刷まで含めたご依頼も可能です。",
    },
    {
      id: "design-amami-what",
      question: "奄美大島デザインでは何を作れますか？",
      answer:
        "ロゴマーク、名刺、チラシ、パンフレット、店舗・Web用バナー、SNS投稿画像などです。用途に合わせてデータ形式を整え、必要なら印刷手配まで対応します。",
    },
    {
      id: "design-amami-web",
      question: "ホームページ制作とデザインをまとめて頼めますか？",
      answer:
        "はい。奄美大島のホームページ制作とデザイン制作をセットでご依頼いただけます。ロゴや色味をそろえることで、サイトと印刷物の印象を統一しやすくなります。",
    },
    {
      id: "design-amami-renewal",
      question: "既存ロゴの修正やリニューアルも相談できますか？",
      answer:
        "可能です。既存ロゴを活かす調整から、印象を刷新するリニューアルまでご相談ください。使う場面（名刺・看板・Web）もあわせて確認します。",
      singleLineOnMobile: true,
    },
    {
      id: "design-amami-price",
      question: "奄美大島のデザイン制作の料金目安は？",
      answer:
        "制作物の種類、案の数、印刷の有無や部数によって異なります。ご希望を伺ったうえで概算をご案内します。",
      singleLineOnMobile: true,
    },
  ],
  related: [
    { href: "/web-production", label: "奄美大島のホームページ制作" },
    { href: "/geo-seo", label: "GEO・SEO対策" },
    { href: "/ai-avatar-chatbot", label: "AIアバターチャットボット" },
    { href: "/faq", label: "よくある質問" },
  ],
  serviceSchemaName: "奄美大島のデザイン制作",
  serviceTypes: [
    "デザイン制作",
    "ロゴデザイン",
    "印刷物デザイン",
    "ブランドデザイン",
  ],
  canonicalPath: "/design",
  url: absoluteUrl("/design"),
} as const;

export const GEO_ENTITY_SUMMARY = `${LEGAL_NAME}（${SITE_NAME}）は、鹿児島県奄美大島を拠点に「奄美大島ホームページ制作」「奄美大島デザイン」を中心としたWeb制作・デザイン・システム開発・GEO対策を提供する会社です。`;
