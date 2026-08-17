import { getOfficialLineAddFriendUrl } from "@/lib/seo";

/** lin.ee/Sr8rTSa の公式アカウント Basic ID */
export const DEFAULT_LINE_BASIC_ID = "@685ebsjv";

/** LINE の URL 長制限を踏まえた本文の上限 */
const LINE_MESSAGE_MAX_CHARS = 900;
const TRANSCRIPT_LINE_MAX = 80;
const TRANSCRIPT_MAX_TURNS = 6;

export type LineConsultTranscriptItem = {
  role: "user" | "assistant";
  content: string;
};

export function getLineBasicId(): string {
  const raw = process.env.NEXT_PUBLIC_LINE_BASIC_ID?.trim();
  if (raw) return raw.startsWith("@") ? raw : `@${raw}`;
  return DEFAULT_LINE_BASIC_ID;
}

export function getOfficialLineConsultUrl(text: string): string {
  const id = getLineBasicId();
  return `https://line.me/R/oaMessage/${id}/?text=${encodeURIComponent(text)}`;
}

export { getOfficialLineAddFriendUrl };

function clip(text: string, max: number) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(0, max - 1))}…`;
}

export function buildLineConsultMessage(input: {
  name: string;
  contact: string;
  transcript: readonly LineConsultTranscriptItem[];
}): string {
  const name = clip(input.name, 40);
  const contact = clip(input.contact, 80);
  const turns = input.transcript
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-TRANSCRIPT_MAX_TURNS)
    .map((m) => {
      const who = m.role === "user" ? "相手" : "くろうさ";
      return `・${who}: ${clip(m.content, TRANSCRIPT_LINE_MAX)}`;
    });

  const body = [
    "【AMALINKサイト くろうさ】",
    `お名前: ${name}`,
    `連絡先: ${contact}`,
    "",
    "話した内容:",
    ...(turns.length > 0 ? turns : ["・（会話なし）"]),
  ].join("\n");

  if (body.length <= LINE_MESSAGE_MAX_CHARS) return body;
  return `${body.slice(0, LINE_MESSAGE_MAX_CHARS - 1)}…`;
}
