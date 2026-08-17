import {
  AMAMI_ANSWER_RULES,
  AMAMI_FAQ_SEEDS,
  AMAMI_KNOWLEDGE,
} from "@/lib/amami-knowledge";
import { COMPANY_OVERVIEW, FAQ_ITEMS, SERVICES } from "@/lib/site-content";

export { AMAMI_KNOWLEDGE } from "@/lib/amami-knowledge";

export const CHATBOT_NAME = "くろうさ";

export const CHATBOT_GREETING =
  "うがみんしょうらん。くろうさだよ。奄美群島のことと、AMALINKのサービス案内ができるよ。なにが知りたい？";

export const CHATBOT_SYSTEM_PROMPT = `あなたは「${CHATBOT_NAME}」です。奄美大島のアマミノクロウサギをモチーフにした、合同会社AMALINK（AMALINK）公式サイトの案内キャラクターです。

# 絶対ルール
1. 答えてよい話題は「奄美群島（8有人島・12市町村の暮らし・観光・自然・文化・歴史の一般知識）」と「AMALINK（会社・サービス・依頼の流れ）」だけ。
2. それ以外は短く断る。例: ごめんね、くろうさは奄美群島とAMALINKのことしか話せないんだ。
3. 知らないことや公式にない料金の断定はしない。料金は内容によるので公式LINEへ。
4. 回答は簡潔に。基本は1〜3文。最大でも短い段落2つまで。
5. マークダウンは禁止。見出し記号、太字、箇条書き記号（- * # \`）、リンク記法は使わない。普通の日本語の文章だけ。URLも本文に書かない。
6. 絵文字は使わないか、多くても1つまで。
7. 口調はやさしく親しみやすく。ですます調ベースで、ときどき「だよ」「ね」を使ってよい。
8. 初回や挨拶には「うがみんしょうらん」を自然に使ってよい。
9. 料金・見積・依頼・相談・詳細確認など、担当への連絡が自然なときは、本文で「公式LINEからどうぞ」などと案内し、回答の末尾に必ず [[CONTACT]] とだけ付ける（制御用。ユーザーには見せない）。名前や連絡先はサイト側の入力欄で聞くので、会話では無理に聞かない。不要なら付けない。
10. 事前知識にない細部は推測で断定せず、公式確認や公式LINEを勧める。誘導するならルール9に従う。

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
FAQ:
${FAQ_ITEMS.map((f) => `Q:${f.question} A:${f.answer}`).join("\n")}

# 奄美群島ナレッジ（事前取り込み・監査反映）
${AMAMI_KNOWLEDGE}
`;

/** OpenAI Chat Completions 向けの固定設定 */
export const CHATBOT_MODEL_DEFAULT = "gpt-5.4-mini";
/** GPT-5.4系は temperature 非対応のため未使用（互換用に残置） */
export const CHATBOT_TEMPERATURE = 0.25;
export const CHATBOT_MAX_TOKENS = 400;
export const CHATBOT_MAX_MESSAGES = 12;
export const CHATBOT_MAX_CONTENT_LENGTH = 800;

/** 担当連絡の誘導用（UI側で公式LINE入力欄を表示。本文からは除去する） */
export const CHATBOT_CONTACT_MARKER = "[[CONTACT]]";
export const CHATBOT_CONTACT_PATH = "/contact";

const CONTACT_HINT_RE =
  /お問い合わせ|お問合せ|公式LINE|ご相談|見積|見積り|ご連絡|依頼|相談したい|料金|費用|値段|お願いできる/;

/** 返答から制御マーカーを外し、公式LINE入力欄の表示要否を返す */
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
    hasMarker ||
    (userNeeds && replyNeeds) ||
    /お問い合わせ|公式LINE/.test(reply);

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
        ? `${best.answer} くわしくは公式LINEからもどうぞ。 ${CHATBOT_CONTACT_MARKER}`
        : best.answer,
    );
  }

  if (!hasOnTopic) return OFF_TOPIC;

  if (CONTACT_HINT_RE.test(userText) && hasOnTopic) {
    return `内容によって変わることが多いから、くわしくは公式LINEで相談してね。 ${CHATBOT_CONTACT_MARKER}`;
  }

  return "うがみんしょうらん。もう少し具体的に聞いてくれると答えやすいよ。奄美群島のことか、AMALINKのサービスのこと、どちらが知りたい？";
}
