/**
 * コラムのジャンル。CMSのカテゴリ（全記事「column」）とは別の軸。
 *
 * 優先順位:
 * 1. CMS の genre 列（編集者が選んだ値）
 * 2. タイトル末尾の（）書きなどから自動判定
 * 3. どれにも当てはまらなければ「AI活用・導入」（会社の主領域）
 *
 * 新しい記事は毎日増えるので、slug の個別対応はしない。
 */

export const COLUMN_GENRE_IDS = [
  "ai-search-seo",
  "ai-usage",
  "ai-basics",
  "ai-chatbot",
  "security",
  "web-production",
] as const;

export type ColumnGenreId = (typeof COLUMN_GENRE_IDS)[number];

export type ColumnGenre = {
  id: ColumnGenreId;
  label: string;
  /** 一覧ページのリード文 */
  lead: string;
  seoTitle: string;
  seoDescription: string;
};

export const DEFAULT_COLUMN_GENRE: ColumnGenreId = "ai-usage";

export const COLUMN_GENRES: readonly ColumnGenre[] = [
  {
    id: "ai-search-seo",
    label: "AI検索・SEO",
    lead: "AI検索に引用されるためのGEO対策、SEO、llms.txt、Googleビジネスプロフィールなど。",
    seoTitle: "AI検索・SEOのコラム",
    seoDescription:
      "合同会社AMALINKのコラムです。GEO・SEO対策、llms.txt、AIクローラー、Googleビジネスプロフィール、コアアップデートなど、AI検索と検索対策の読み物をまとめています。",
  },
  {
    id: "ai-usage",
    label: "AI活用・導入",
    lead: "社内ルール、プロンプト、AIエージェント、観光業での使い方など、現場に入れる話。",
    seoTitle: "AI活用・導入のコラム",
    seoDescription:
      "合同会社AMALINKのコラムです。生成AIの社内ルール、AIエージェント、プロンプト、観光業の生成AI、AIコンサルティングで頼めることなど、導入と活用の読み物をまとめています。",
  },
  {
    id: "ai-basics",
    label: "AIの基礎知識",
    lead: "生成AIとは、ハルシネーション、ガイドライン、著作権など、先に押さえておきたいこと。",
    seoTitle: "AIの基礎知識のコラム",
    seoDescription:
      "合同会社AMALINKのコラムです。生成AIとは、ハルシネーション、マルチモーダルAI、ローカルLLM、AI事業者ガイドライン、AI画像の著作権など、基礎知識の読み物をまとめています。",
  },
  {
    id: "ai-chatbot",
    label: "AIチャットボット",
    lead: "RAG、LINE連携、アバター接客、FAQとの使い分け、導入の進め方。",
    seoTitle: "AIチャットボットのコラム",
    seoDescription:
      "合同会社AMALINKのコラムです。RAG、LINE連携、アバター接客、よくある質問ページとの使い分け、導入ガイドなど、AIチャットボットの読み物をまとめています。",
  },
  {
    id: "security",
    label: "セキュリティ・詐欺対策",
    lead: "ニセ警察SMS、偽ショップ、ソフトや言語の脆弱性、AI詐欺、ディープフェイク。",
    seoTitle: "セキュリティ・詐欺対策のコラム",
    seoDescription:
      "合同会社AMALINKのコラムです。ニセ警察SMS、偽ショップ、Outlook・PHP・言語の脆弱性、AI詐欺、ディープフェイク、AI文章の見分け方など、安全対策の読み物をまとめています。",
  },
  {
    id: "web-production",
    label: "ホームページ制作",
    lead: "費用、自作か依頼か、奄美での進め方、多言語化、AI画像の表示ルール。",
    seoTitle: "ホームページ制作のコラム",
    seoDescription:
      "合同会社AMALINKのコラムです。ホームページ制作の費用、自作か依頼か、奄美での制作ガイド、AI翻訳での多言語化、AI画像の表示ルールなどの読み物をまとめています。",
  },
] as const;

const GENRE_SET = new Set<string>(COLUMN_GENRE_IDS);

export function isColumnGenreId(value: string | null | undefined): value is ColumnGenreId {
  return Boolean(value && GENRE_SET.has(value));
}

export function getColumnGenre(id: string | null | undefined): ColumnGenre | undefined {
  if (!id) return undefined;
  return COLUMN_GENRES.find((genre) => genre.id === id);
}

export function columnGenrePath(id: ColumnGenreId): string {
  return `/column/genre/${id}`;
}

/** タイトル末尾の（）書きで、ジャンルが一意に決まるものだけ。AIコンサルティングは複数ジャンルに跨るので使わない。 */
const SUFFIX_GENRE: Record<string, ColumnGenreId> = {
  "GEO・SEO対策": "ai-search-seo",
  SEO対策: "ai-search-seo",
  GEO対策: "ai-search-seo",
  ホームページ制作: "web-production",
  AIチャットボット: "ai-chatbot",
  スマホの詐欺対策: "security",
  ネット通販の安全対策: "security",
  パソコンのセキュリティ: "security",
};

const RULES: { id: ColumnGenreId; needles: readonly string[] }[] = [
  {
    id: "security",
    needles: [
      "詐欺",
      "ニセ警察",
      "偽物",
      "偽ショップ",
      "激安サイト",
      "脆弱性",
      "セキュリティ",
      "ディープフェイク",
      "deepfake",
      "なりすまし",
      "zeijakusei",
      "fake-police",
      "fake-shop",
      "sagi-taisaku",
      "bunsho-miwake",
      "文章は見分け",
      "文章の見分け",
      "outlook-vulnerability",
    ],
  },
  {
    id: "ai-chatbot",
    needles: [
      "チャットボット",
      "chatbot",
      "ragとは",
      "rag-towa",
      "アバターで接客",
      "アバター接客",
      "公式lineにつな",
      "line-ai-chat",
      "よくある質問ページ",
      "faq-tsukaiwake",
    ],
  },
  {
    id: "web-production",
    needles: [
      "ホームページ制作",
      "homepage",
      "ペライチ",
      "wix",
      "自作（",
      "多言語ホームページ",
      "画像はどう表示",
      "ai-gazo-hyoji",
      "ai-honyaku",
      "amami-homepage",
    ],
  },
  {
    id: "ai-search-seo",
    needles: [
      "geo",
      "seo",
      "llms.txt",
      "llms-txt",
      "クローラー",
      "コアアップデート",
      "ビジネスプロフィール",
      "business hub",
      "ai検索",
      "検索順位",
      "search console",
      "構造化データ",
      "kensaku",
      "chatgpt-business",
    ],
  },
  {
    id: "ai-basics",
    needles: [
      "生成aiとは",
      "ハルシネーション",
      "hallucination",
      "マルチモーダル",
      "multimodal",
      "ローカルllm",
      "local-llm",
      "事業者ガイドライン",
      "画像生成の著作権",
      "著作権とは",
      "仕組み・できること・苦手",
    ],
  },
  {
    id: "ai-usage",
    needles: [
      "社内ルール",
      "aiエージェント",
      "ai-agent",
      "プロンプト",
      "prompt",
      "観光業で生成ai",
      "何を頼める",
      "donyu-shien",
      "ai活用",
      "katsuyo",
      "何から始める",
    ],
  },
];

function haystackOf(title: string, slug: string): string {
  return `${title} ${slug}`.toLowerCase();
}

function suffixGenre(title: string): ColumnGenreId | undefined {
  const match = title.trim().match(/（([^（）]+)）\s*$/);
  if (!match) return undefined;
  return SUFFIX_GENRE[match[1]];
}

function keywordGenre(title: string, slug: string): ColumnGenreId | undefined {
  const haystack = haystackOf(title, slug);
  for (const rule of RULES) {
    if (rule.needles.some((needle) => haystack.includes(needle.toLowerCase()))) {
      return rule.id;
    }
  }
  return undefined;
}

/** タイトル・slug からジャンルを決める。CMS未設定の新着記事向け。 */
export function inferColumnGenre(title: string, slug = ""): ColumnGenreId {
  return suffixGenre(title) ?? keywordGenre(title, slug) ?? DEFAULT_COLUMN_GENRE;
}

export function resolveColumnGenre(item: {
  genre?: string | null;
  title: string;
  slug?: string | null;
}): ColumnGenreId {
  if (isColumnGenreId(item.genre)) return item.genre;
  return inferColumnGenre(item.title, item.slug ?? "");
}
