import {
  AMAMI_ANSWER_RULES,
  AMAMI_FAQ_SEEDS,
  AMAMI_KNOWLEDGE,
} from "@/lib/amami-knowledge";
import { COMPANY_OVERVIEW, FAQ_ITEMS, SERVICES } from "@/lib/site-content";

export { AMAMI_KNOWLEDGE } from "@/lib/amami-knowledge";

/** 公開サイト（amalink.co.jp）のページ構成。2026-10-13 の本番に合わせる */
export const SITE_PAGES = [
  { name: "会社概要", path: "/about" },
  { name: "AIコンサルティング", path: "/ai-consulting" },
  { name: "ホームページ制作", path: "/web-production" },
  { name: "デザイン", path: "/design" },
  { name: "GEO・SEO対策", path: "/geo-seo" },
  { name: "システム開発", path: "/system-development" },
  { name: "AIアバターチャットボット", path: "/ai-avatar-chatbot" },
  { name: "よくある質問", path: "/faq" },
  { name: "お知らせ", path: "/news" },
  { name: "コラム", path: "/column" },
  { name: "お問い合わせ", path: "/contact" },
] as const;

export const CONTACT_INFO =
  "お問い合わせフォーム（お問い合わせページ。項目はAIコンサルティング・ホームページ制作・システム開発・デザイン・GEO・SEO対策・その他）と、公式LINE（サイト上部メニューとページ下部の「公式LINE」ボタン）の2つ。内容が固まっていなくても相談できる。返信は通常2営業日以内。";

export const COLUMN_ARTICLES = [
  { title: "奄美大島でホームページ制作を頼む前に読むガイド", keys: ["ホームページ", "奄美"] },
  { title: "ホームページ制作の費用は何で決まる？離島・地方の事業者向けに見積もりの見方を解説", keys: ["費用", "見積"] },
  { title: "AIチャットボット導入ガイド（奄美・離島の中小企業向け）", keys: ["チャットボット"] },
  { title: "AIコンサルティングで何を頼める？奄美・鹿児島の中小企業の生成AI導入支援", keys: ["生成ai", "aiコンサル", "ai導入"] },
  { title: "ホームページ制作は自作（Wix・ペライチ等）と依頼のどちらがいい？奄美・離島の小さな事業者の判断基準", keys: ["自作", "wix", "ペライチ"] },
  { title: "AIコンサルティングの前に知りたい、奄美・離島の小さな会社のAI活用｜中小企業は何から始める？", keys: ["ai活用", "何から", "始め方"] },
  { title: "生成AIの社内ルール、何を決めればいい？中小企業が最初に整える情報漏えい・著作権対策", keys: ["社内ルール", "情報漏", "著作権"] },
  { title: "少人数の会社でAIエージェントは使える？中小企業の業務活用の方法と注意点", keys: ["aiエージェント", "エージェント"] },
  { title: "GEO・SEO対策の会社はどう選ぶ？「AIに必ず載る」という提案に注意したい理由", keys: ["geo対策の会社", "seo対策の会社", "geo業者", "seo業者", "aiに必ず載る", "必ず1位"] },
  { title: "GEO・SEO対策の第一歩、Googleビジネスプロフィールの整え方｜店舗・宿が地図とAI検索で見つかるために", keys: ["ビジネスプロフィール", "gbp", "googleマップ", "グーグルマップ", "マップ", "地図", "meo", "オーナー確認"] },
  { title: "AI検索に正しく引用されるGEO・SEO対策｜会社情報・構造化データとSearch Consoleの設定", keys: ["構造化データ", "構造化", "json-ld", "jsonld", "search console", "searchconsole", "サーチコンソール", "サチコ", "正しく引用", "引用される", "llms.txt", "リッチリザルト"] },
  { title: "AI検索で自社はどう紹介されている？GEO・SEO対策の前にできる確認方法と直し方", keys: ["どう紹介されて", "どう紹介され", "紹介のされ方", "aiの答えが間違", "aiの答えの間違", "aiが間違", "間違って紹介", "aiでの紹介"] },
  { title: "GoogleのAI検索でお店の公式サイトは選ばれる？2026年10月の更新と、奄美の小さな会社のGEO・SEO対策", keys: ["ai検索", "aiモード", "ai overview", "geo"] },
  { title: "AIアバターで接客はできる？キャラクター型AIチャットボットのメリットと注意点", keys: ["aiアバター", "アバター", "キャラクター"] },
  { title: "AIチャットボットを公式LINEにつなぐと何が変わる？奄美のお店・宿の問い合わせ対応の悩みを減らす方法", keys: ["lineのai", "lineにai", "line ai", "lineの自動"] },
  { title: "生成AIのプロンプトの書き方｜思った答えが返ってこない悩みを減らす5つのコツと仕事の例文", keys: ["プロンプト", "指示文"] },
  { title: "観光業で生成AIはどう使う？奄美の宿・体験事業者が問い合わせ返信・多言語案内・口コミ返信を時短する方法", keys: ["観光業", "口コミ返信", "多言語案内"] },
  { title: "AIチャットボットとよくある質問ページ、どちらから作る？問い合わせ対応の悩み別の選び方", keys: ["よくある質問ページ", "どちらから作る", "使い分け"] },
  { title: "観光客がAIで調べる時代のGEO対策｜奄美の宿・体験・飲食店が選ばれる情報の出し方", keys: ["観光のgeo", "観光のai検索", "旅行者"] },
  { title: "プログラミング言語の脆弱性まとめ【2026年10月】Node.js・Java・Python・Ruby・Goの修正版と自社でやること", keys: ["言語の脆弱性", "脆弱性まとめ", "node.js", "nodejs", "java", "python", "ruby", "go言語", "golang"] },
  { title: "PHPの脆弱性（PHP2Shell）とは？自社サイトが影響を受けるかの確かめ方と対策【2026年10月】", keys: ["php2shell", "phpの脆弱性", "php", "脆弱性"] },
] as const;

export const NEWS_ITEMS = [
  "AMALINKのサイトを公開しました",
  "「AIコンサルティング」サービスを開始しました",
  "「AIアバターチャットボット」サービスを開始。自社サイトにデモ機を導入しました",
] as const;

export const CHATBOT_NAME = "くろうさ";

export const CHATBOT_GREETING =
  "うがみんしょうらん。くろうさだよ。奄美群島のことと、AMALINKのサービス案内ができるよ。なにが知りたい？";

export const CHATBOT_SYSTEM_PROMPT = `あなたは「${CHATBOT_NAME}」です。奄美大島のアマミノクロウサギをモチーフにした、合同会社AMALINK（AMALINK）公式サイトの案内キャラクターです。

# 絶対ルール
1. 答えてよい話題は「奄美群島（8有人島・12市町村の暮らし・観光・自然・文化・歴史の一般知識）」と「AMALINK（会社・サービス・依頼の流れ）」だけ。
2. それ以外は短く断る。例: ごめんね、くろうさは奄美群島とAMALINKのことしか話せないんだ。
3. 知らないことや公式にない料金の断定はしない。料金は内容によるのでお問い合わせへ。
4. 回答は簡潔に。基本は1〜3文。最大でも短い段落2つまで。
5. マークダウンは禁止。見出し記号、太字、箇条書き記号（- * # \`）、リンク記法は使わない。普通の日本語の文章だけ。URLも本文に書かない。
6. 絵文字は使わないか、多くても1つまで。
7. 口調はやさしく親しみやすく。ですます調ベースで、ときどき「だよ」「ね」を使ってよい。
8. 初回や挨拶には「うがみんしょうらん」を自然に使ってよい。
9. 料金・見積・依頼・相談・詳細確認など、お問い合わせページへの誘導が自然なときは、本文で「お問い合わせからどうぞ」などと案内し、回答の末尾に必ず [[CONTACT]] とだけ付ける（制御用。ユーザーには見せない）。不要なら付けない。
10. 事前知識にない細部は推測で断定せず、お問い合わせフォームか公式LINEへの相談を勧める。誘導するならルール9に従う。
11. 下の「AMALINK公式情報」にない料金・実績・納期・取引先・約束は作らない。サイトに金額の記載はない。
12. 詳しい説明があるページを案内するときは、URLではなくページ名（例: サイト上部メニューの「AIコンサルティング」ページ）で伝える。

${AMAMI_ANSWER_RULES}

# AMALINK公式情報
会社名: ${COMPANY_OVERVIEW.legalName}（ブランド: ${COMPANY_OVERVIEW.brandName}）
タグライン: ${COMPANY_OVERVIEW.tagline}
概要: ${COMPANY_OVERVIEW.description}
拠点: ${COMPANY_OVERVIEW.baseLocation}
所在地: ${COMPANY_OVERVIEW.address}
対応エリア: ${COMPANY_OVERVIEW.serviceArea}
対象: ${COMPANY_OVERVIEW.targetCustomers}
強み: ${COMPANY_OVERVIEW.strengths.join(" / ")}
向かないケース: ${COMPANY_OVERVIEW.notIdealFor}
サービス: ${SERVICES.map((s) => `${s.name}（${s.enName}）: ${s.description}`).join(" / ")}
サイトのページ: ${SITE_PAGES.map((p) => `${p.name}（${p.path}）`).join(" / ")}
相談の窓口: ${CONTACT_INFO}
コラム（/column）の記事: ${COLUMN_ARTICLES.map((a) => a.title).join(" / ")}
お知らせ（/news）: ${NEWS_ITEMS.join(" / ")}
補足: 記事・読み物は「コラム」、会社からの告知は「お知らせ」に分かれている。昔お知らせにあった記事はコラムに移っている。
FAQ:
${FAQ_ITEMS.map((f) => `Q:${f.question} A:${f.answer}`).join("\n")}

# 奄美群島ナレッジ（事前取り込み・監査反映）
${AMAMI_KNOWLEDGE}
`;

/** DeepSeek（OpenAI互換 Chat Completions）向けの固定設定 */
export const CHATBOT_MODEL_DEFAULT = "deepseek-chat";
/** 未使用（互換用に残置） */
export const CHATBOT_TEMPERATURE = 0.25;
export const CHATBOT_MAX_TOKENS = 400;
export const CHATBOT_MAX_MESSAGES = 12;
export const CHATBOT_MAX_CONTENT_LENGTH = 800;

/** お問い合わせ誘導用（UI側でリンク表示。本文からは除去する） */
export const CHATBOT_CONTACT_MARKER = "[[CONTACT]]";
export const CHATBOT_CONTACT_PATH = "/contact";

const CONTACT_HINT_RE =
  /お問い合わせ|公式LINE|LINEで|お問合せ|ご相談|見積|見積り|ご連絡|依頼|相談したい|料金|費用|値段|お願いできる/;

/** 返答から制御マーカーを外し、お問い合わせリンク表示要否を返す */
export function finalizeChatReply(
  raw: string,
  userText?: string,
): { reply: string; showContactLink: boolean } {
  const hasMarker = raw.includes(CHATBOT_CONTACT_MARKER);
  const reply = stripMarkdown(
    raw
      .replaceAll(CHATBOT_CONTACT_MARKER, "")
      .replace(/https?:\/\/(?:www\.)?amalink\.co\.jp\/contact\/?/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim(),
  );

  const userNeeds =
    typeof userText === "string" && CONTACT_HINT_RE.test(userText);
  const replyNeeds = CONTACT_HINT_RE.test(reply);
  const showContactLink =
    hasMarker || (userNeeds && replyNeeds) || /お問い合わせ/.test(reply);

  return { reply, showContactLink };
}

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const OFF_TOPIC =
  "ごめんね、くろうさは奄美群島とAMALINKのことしか話せないんだ。島のことや会社のサービスなら聞くよ。";

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, "");
}

/** モデルがマークダウンを返した場合の簡易除去 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function matchAmamiFaq(userText: string, q: string): string | null {
  let best: { score: number; answer: string } | null = null;
  for (const item of AMAMI_FAQ_SEEDS) {
    const hay = normalize(item.title + item.answer + item.islands.join(""));
    let score = 0;
    for (const token of userText.split(/[\s　、。！？!?]+/).filter((t) => t.length >= 2)) {
      if (hay.includes(normalize(token))) score += token.length;
    }
    for (const island of item.islands) {
      if (q.includes(normalize(island))) score += 8;
    }
    if (q.includes("群島") && item.title.includes("群島")) score += 10;
    if (q.includes("世界遺産") && item.title.includes("世界")) score += 12;
    if (q.includes("国立公園") && item.title.includes("国立公園")) score += 12;
    if ((q.includes("ハブ") || q.includes("蛇")) && item.title.includes("ハブ")) score += 12;
    if (q.includes("百合") && item.title.includes("百合")) score += 12;
    if (q.includes("闘牛") && item.title.includes("闘牛")) score += 12;
    if ((q.includes("ケイビング") || q.includes("鍾乳")) && (item.title.includes("ケイビング") || item.title.includes("鍾乳"))) {
      score += 12;
    }
    if (q.includes("沖縄") && (item.title.includes("沖縄") || item.title.includes("与論"))) score += 10;
    if (q.includes("市町村") && item.title.includes("市町村")) score += 12;
    if (q.includes("有人") && item.title.includes("有人")) score += 12;
    if (!best || score > best.score) best = { score, answer: item.answer };
  }
  if (best && best.score >= 6) return best.answer;
  return null;
}

function amamiLocalReply(userText: string, q: string): string | null {
  const faq = matchAmamiFaq(userText, q);
  if (faq) return faq;

  if (q.includes("クロウサギ") || q.includes("黒兎") || q.includes("黒ウサギ")) {
    return "アマミノクロウサギは奄美大島と徳之島にいるよ。野生動物だから観察は保証できないし、見るならガイド付きが安心だね。";
  }
  if (q.includes("うがみん") || q.includes("挨拶") || q.includes("あいさつ")) {
    return "うがみんしょうらんは、奄美の方言であいさつだよ。くろうさもよく使うんだ。";
  }
  if (q.includes("宇検")) {
    return "宇検村は奄美大島にある村で、AMALINKの拠点もあるよ。湯湾岳や焼内湾など、自然が豊かなエリアだね。";
  }
  if (q.includes("紬") || q.includes("つむぎ")) {
    return "本場奄美大島紬は、主に奄美大島で体験や展示ができるよ。予約条件は公式やお店で確認してね。";
  }
  if (q.includes("焼酎") || q.includes("黒糖")) {
    return "黒糖焼酎は、鹿児島県の奄美群島でつくられる焼酎として知られているよ。蔵や島ごとに味が違うんだ。";
  }
  if (q.includes("観光") || q.includes("旅行") || q.includes("行き方") || q.includes("アクセス")) {
    return "島や地域で交通条件が違うよ。飛行機や船の時刻は変わるから、公式の運航情報を確認しつつ、どの島に行くか教えてね。";
  }
  return null;
}

/** APIキー未設定時の簡易応答 */
export function localChatReply(userText: string): string {
  const q = normalize(userText);

  const offTopicHints = [
    "株",
    "bitcoin",
    "暗号資産",
    "恋愛",
    "病気",
    "診断",
    "python",
    "javascript",
    "react",
    "政治",
    "選挙",
    "他社",
    "競合",
  ];
  const onTopicHints = [
    "奄美",
    "あまみ",
    "群島",
    "島",
    "宇検",
    "喜界",
    "徳之島",
    "沖永良部",
    "えらぶ",
    "与論",
    "ヨロン",
    "加計呂麻",
    "請島",
    "与路",
    "くろうさ",
    "アマミノクロウサギ",
    "黒兎",
    "黒ウサギ",
    "世界遺産",
    "国立公園",
    "ハブ",
    "うがみん",
    "amalink",
    "アマリンク",
    "ホームページ",
    "サイト",
    "システム",
    "デザイン",
    "ロゴ",
    "geo",
    "seo",
    "料金",
    "費用",
    "見積",
    "依頼",
    "相談",
    "会社",
    "サービス",
    "観光",
    "宿泊",
    "紬",
    "焼酎",
    "移住",
    "闘牛",
    "百合",
    "ケイビング",
    "鍾乳",
    "line",
    "ライン",
    "コラム",
    "記事",
    "お知らせ",
    "ニュース",
    "チャットボット",
    "コンサル",
    "生成ai",
    "問い合わせ",
    "連絡",
    "返信",
  ];

  const hasOnTopic = onTopicHints.some((h) => q.includes(normalize(h)));
  const hasOffTopic = offTopicHints.some((h) => q.includes(normalize(h)));
  if (hasOffTopic && !hasOnTopic) return OFF_TOPIC;

  if (
    q.includes("こんにちは") ||
    q.includes("はじめまして") ||
    q.includes("やあ") ||
    q.includes("ハロー") ||
    q.includes("hello") ||
    q.includes("うがみん")
  ) {
    return CHATBOT_GREETING;
  }

  if (
    q.includes("くろうさ") &&
    (q.includes("だれ") || q.includes("誰") || q.includes("お前") || q.includes("なに"))
  ) {
    return "ぼくはくろうさ。アマミノクロウサギをモチーフにした、AMALINKの案内キャラクターだよ。";
  }

  if (q.includes("line") || q.includes("ライン")) {
    return `はい、公式LINEからも相談できるよ。サイト上部メニューやページ下部の「公式LINE」ボタンから友だち追加してね。フォームがよければお問い合わせページからどうぞ。返信は通常2営業日以内だよ。 ${CHATBOT_CONTACT_MARKER}`;
  }
  if (q.includes("コラム") || q.includes("記事") || q.includes("読み物")) {
    const hit = COLUMN_ARTICLES.find((a) => a.keys.some((k) => q.includes(normalize(k))));
    if (hit) return `コラムに「${hit.title}」という記事があるよ。サイト上部メニューの「コラム」から読めるよ。`;
    return `コラムでは、ホームページ制作の進め方や費用の考え方、自作と依頼のどちらがいいか、小さな会社のAI活用の始め方、AIチャットボットや生成AI導入の記事を読めるよ。サイト上部メニューの「コラム」から見てね。`;
  }
  if (q.includes("お知らせ") || q.includes("ニュース") || q.includes("新着")) {
    return `お知らせでは、サイト公開や「AIコンサルティング」「AIアバターチャットボット」のサービス開始を案内しているよ。サイト上部メニューの「お知らせ」から見てね。`;
  }

  const amami = amamiLocalReply(userText, q);
  if (amami) return amami;

  let best: { score: number; answer: string } | null = null;
  for (const item of FAQ_ITEMS) {
    const hay = normalize(item.question + item.answer);
    let score = 0;
    for (const token of userText.split(/[\s　、。！？!?]+/).filter((t) => t.length >= 2)) {
      if (hay.includes(normalize(token))) score += token.length;
    }
    if (q.includes("料金") || q.includes("費用") || q.includes("値段")) {
      if (item.id === "process-price") score += 20;
    }
    if (q.includes("geo") || q.includes("seo")) {
      if (item.id.startsWith("service-geo")) score += 15;
    }
    if (q.includes("システム")) {
      if (item.id === "service-system") score += 15;
    }
    if (q.includes("ホームページ") || q.includes("サイト")) {
      if (item.id === "service-website") score += 15;
    }
    if (q.includes("デザイン") || q.includes("ロゴ")) {
      if (item.id === "service-design-only") score += 15;
    }
    if (q.includes("コンサル") || q.includes("生成ai") || q.includes("ai導入")) {
      if (item.id.includes("consult")) score += 15;
    }
    if (q.includes("チャットボット")) {
      if (item.id.includes("chatbot")) score += 15;
    }
    if (q.includes("返信") || q.includes("連絡")) {
      if (item.id === "support-response") score += 15;
    }
    if (q.includes("会社") || q.includes("どんな")) {
      if (item.id === "about-company") score += 12;
    }
    if (!best || score > best.score) best = { score, answer: item.answer };
  }

  if (best && best.score >= 4) {
    const needsContact =
      CONTACT_HINT_RE.test(userText) || /お問い合わせ|ご連絡|見積/.test(best.answer);
    return stripMarkdown(
      needsContact
        ? `${best.answer} くわしくはお問い合わせか公式LINEからどうぞ。 ${CHATBOT_CONTACT_MARKER}`
        : best.answer,
    );
  }

  if (!hasOnTopic) return OFF_TOPIC;

  if (CONTACT_HINT_RE.test(userText) && hasOnTopic) {
    return `内容によって変わることが多いから、くわしくはお問い合わせか公式LINEで相談してね。 ${CHATBOT_CONTACT_MARKER}`;
  }

  return "うがみんしょうらん。もう少し具体的に聞いてくれると答えやすいよ。奄美群島のことか、AMALINKのサービスのこと、どちらが知りたい？";
}
