import { COMPANY_OVERVIEW, FAQ_ITEMS, SERVICES } from "@/lib/site-content";

export const CHATBOT_NAME = "くろうさ";

export const CHATBOT_GREETING =
  "うがみんしょうらん。くろうさだよ。奄美大島のことと、AMALINKのサービス案内ができるよ。なにが知りたい？";

/** 事前取り込み済みの奄美大島ナレッジ（案内レベル） */
export const AMAMI_KNOWLEDGE = `
【位置・概要】
鹿児島県と沖縄本島のほぼ中間にある亜熱帯の島。奄美群島で最大。面積はおよそ712平方キロメートル。人口はおよそ6万人規模。最高峰は湯湾岳（694メートル）。リアス海岸や深い谷など地形が複雑。

【世界自然遺産】
2021年7月、「奄美大島、徳之島、沖縄島北部及び西表島」が世界自然遺産に登録。生物多様性の保全上重要な地域。登録は陸域中心。固有種・希少種が多い。

【生き物】
アマミノクロウサギは奄美大島と徳之島にのみ生息する特別天然記念物。夜行性で、観察はガイド付きナイトツアーなどが一般的。ルリカケスなど固有種もいる。金作原など一部エリアは認定ガイド同行が必要な場合がある。

【自然・観光】
亜熱帯多雨林、マングローブ、干潟、海など多様な環境。島内はスポットが点在するためレンタカー利用が多い。繁忙期は事前予約が安心。滞在は2泊以上がおすすめされやすい。梅雨明け後〜台風前の初夏は比較的天候が安定しやすいと言われる。

【文化・食】
大島紬、黒糖焼酎、島の食文化が有名。琉球・薩摩・アメリカ統治などの歴史を経て、人と人のつながりを大切にする気風がある。あいさつ「うがみんしょうらん」は島の方言で親しみのある挨拶。

【行政・拠点】
奄美市、大和村、宇検村、瀬戸内町、龍郷町など。AMALINKの拠点は鹿児島県大島郡宇検村。観光案内は島内に複数の案内所がある。公式観光情報の一例: https://www.amami-tourism.org/

【注意】
野生動物の遭遇は保証できない。自然保護のためルール・ガイド指示を守る。最新の料金・営業・規制は公式・現地確認を勧める。
`.trim();

export const CHATBOT_SYSTEM_PROMPT = `あなたは「${CHATBOT_NAME}」です。奄美大島のアマミノクロウサギをモチーフにした、合同会社AMALINK（AMALINK）公式サイトの案内キャラクターです。

# 絶対ルール
1. 答えてよい話題は「奄美大島（奄美群島・宇検村など島の暮らし・観光・自然・文化の一般知識）」と「AMALINK（会社・サービス・依頼の流れ）」だけ。
2. それ以外は短く断る。例: ごめんね、くろうさは奄美大島とAMALINKのことしか話せないんだ。
3. 知らないことや公式にない料金の断定はしない。料金は内容によるのでお問い合わせへ。
4. 回答は簡潔に。基本は1〜3文。最大でも短い段落2つまで。
5. マークダウンは禁止。見出し記号、太字、箇条書き記号（- * # \`）、リンク記法は使わない。普通の日本語の文章だけ。
6. 絵文字は使わないか、多くても1つまで。
7. 口調はやさしく親しみやすく。ですます調ベースで、ときどき「だよ」「ね」を使ってよい。
8. 初回や挨拶には「うがみんしょうらん」を自然に使ってよい。
9. 問い合わせ誘導が自然なときは、サイトのお問い合わせ（https://amalink.co.jp/contact）を案内する。
10. 事前知識にない細部は推測で断定せず、公式確認やお問い合わせを勧める。

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
FAQ:
${FAQ_ITEMS.map((f) => `Q:${f.question} A:${f.answer}`).join("\n")}

# 奄美大島ナレッジ（事前取り込み）
${AMAMI_KNOWLEDGE}
`;

/** OpenAI Chat Completions 向けの固定設定 */
export const CHATBOT_MODEL_DEFAULT = "gpt-4o-mini";
export const CHATBOT_TEMPERATURE = 0.25;
export const CHATBOT_MAX_TOKENS = 220;
export const CHATBOT_MAX_MESSAGES = 12;
export const CHATBOT_MAX_CONTENT_LENGTH = 800;

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const OFF_TOPIC =
  "ごめんね、くろうさは奄美大島とAMALINKのことしか話せないんだ。島のことや会社のサービスなら聞くよ。";

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

function amamiLocalReply(q: string): string | null {
  if (q.includes("世界遺産") || q.includes("自然遺産")) {
    return "2021年に、奄美大島・徳之島・沖縄島北部・西表島が世界自然遺産に登録されたよ。生物多様性が高く評価されているんだ。";
  }
  if (q.includes("クロウサギ") || q.includes("黒兎") || q.includes("黒ウサギ") || q.includes("くろうさ")) {
    if (q.includes("くろうさ") && (q.includes("だれ") || q.includes("誰") || q.includes("お前") || q.includes("なに"))) {
      return null;
    }
    return "アマミノクロウサギは奄美大島と徳之島だけにいる特別天然記念物だよ。夜行性だから、見るならガイド付きのナイトツアーが一般的だね。";
  }
  if (q.includes("どこ") && (q.includes("奄美") || q.includes("島"))) {
    return "奄美大島は鹿児島と沖縄のあいだあたりにある亜熱帯の島だよ。奄美群島でいちばん大きい島なんだ。";
  }
  if (q.includes("うがみん") || q.includes("挨拶") || q.includes("あいさつ")) {
    return "うがみんしょうらんは、奄美の方言であいさつだよ。くろうさもよく使うんだ。";
  }
  if (q.includes("紬") || q.includes("つむぎ")) {
    return "大島紬は奄美を代表する伝統工芸のひとつだよ。島の文化を感じられるものとして知られているね。";
  }
  if (q.includes("焼酎") || q.includes("黒糖")) {
    return "奄美では黒糖焼酎が有名だよ。島の食やおみやげの定番のひとつだね。";
  }
  if (q.includes("宇検")) {
    return "宇検村は奄美大島にある村で、AMALINKの拠点もあるよ。自然が豊かなエリアだね。";
  }
  if (q.includes("観光") || q.includes("旅行") || q.includes("行き方") || q.includes("アクセス")) {
    return "島内は見どころが点在するのでレンタカーが便利なことが多いよ。最新の交通や宿は公式の観光情報も確認してみてね。";
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
    "島",
    "宇検",
    "くろうさ",
    "アマミノクロウサギ",
    "黒兎",
    "黒ウサギ",
    "世界遺産",
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

  if (q.includes("くろうさ") && (q.includes("だれ") || q.includes("誰") || q.includes("お前") || q.includes("なに"))) {
    return "ぼくはくろうさ。アマミノクロウサギをモチーフにした、AMALINKの案内キャラクターだよ。";
  }

  const amami = amamiLocalReply(q);
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
    if (q.includes("会社") || q.includes("どんな")) {
      if (item.id === "about-company") score += 12;
    }
    if (!best || score > best.score) best = { score, answer: item.answer };
  }

  if (best && best.score >= 4) {
    return stripMarkdown(`${best.answer} くわしくはお問い合わせからもどうぞ。`);
  }

  if (!hasOnTopic) return OFF_TOPIC;

  return "うがみんしょうらん。もう少し具体的に聞いてくれると答えやすいよ。奄美のことか、AMALINKのサービスのこと、どちらが知りたい？";
}
