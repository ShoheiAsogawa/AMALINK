import { NextResponse } from "next/server";
import {
  CHAT_MAX_BODY_BYTES,
  checkChatRateLimit,
  getClientIp,
  isAllowedChatOrigin,
} from "@/lib/chat-rate-limit";
import {
  CHATBOT_MAX_CONTENT_LENGTH,
  CHATBOT_MAX_MESSAGES,
  CHATBOT_MAX_TOKENS,
  CHATBOT_MODEL_DEFAULT,
  CHATBOT_SYSTEM_PROMPT,
  finalizeChatReply,
  localChatReply,
  type ChatMessage,
} from "@/lib/chatbot-knowledge";

export const runtime = "nodejs";

/** ボディ上の messages 配列の最大長（slice 前に弾く） */
const CHATBOT_MAX_MESSAGES_INCOMING = CHATBOT_MAX_MESSAGES + 4;

type Body = {
  messages?: { role?: string; content?: string }[];
};

function rateLimitHeaders(retryAfterSec?: number, remainingMinute?: number) {
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
  };
  if (typeof retryAfterSec === "number") {
    headers["Retry-After"] = String(retryAfterSec);
  }
  if (typeof remainingMinute === "number") {
    headers["X-RateLimit-Limit"] = "8";
    headers["X-RateLimit-Remaining"] = String(Math.max(0, remainingMinute));
  }
  return headers;
}

/** DeepSeek は短めに待ち、だめなら OpenAI へ。合計でも約20秒以内 */
const DEEPSEEK_TIMEOUT_MS = 9000;
const OPENAI_TIMEOUT_MS = 11000;
const OPENAI_MODEL_DEFAULT = "gpt-4o-mini";

export async function POST(request: Request) {
  if (!isAllowedChatOrigin(request)) {
    return NextResponse.json(
      { error: "許可されていないリクエストです" },
      { status: 403, headers: rateLimitHeaders() },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > CHAT_MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "リクエストが大きすぎます" },
      { status: 413, headers: rateLimitHeaders() },
    );
  }

  const ip = getClientIp(request);
  const limited = checkChatRateLimit(ip);
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: "リクエストが多すぎます。少し待ってから、もう一度話しかけてね。",
        reply: "ごめんね、いまちょっと込み合ってるみたい。少し待ってから、もう一度話しかけてね。",
      },
      {
        status: 429,
        headers: rateLimitHeaders(limited.retryAfterSec),
      },
    );
  }

  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (rawText.length > CHAT_MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "リクエストが大きすぎます" },
      { status: 413, headers: rateLimitHeaders() },
    );
  }

  let body: Body;
  try {
    body = JSON.parse(rawText) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  if (incoming.length > CHATBOT_MAX_MESSAGES_INCOMING) {
    return NextResponse.json(
      { error: "メッセージが多すぎます" },
      { status: 400, headers: rateLimitHeaders(undefined, limited.remainingMinute) },
    );
  }

  const cleaned: ChatMessage[] = incoming
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, CHATBOT_MAX_CONTENT_LENGTH),
    }))
    .slice(-CHATBOT_MAX_MESSAGES);

  const lastUser = [...cleaned].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json({ error: "メッセージが空です" }, { status: 400 });
  }

  const headers = rateLimitHeaders(undefined, limited.remainingMinute);
  const upstreamMessages = [
    { role: "system", content: CHATBOT_SYSTEM_PROMPT },
    ...cleaned,
  ];
  const startedAt = Date.now();

  const providers: { name: "deepseek" | "openai"; url: string; key?: string; model: string; timeoutMs: number }[] = [
    {
      name: "deepseek",
      url: "https://api.deepseek.com/chat/completions",
      key: process.env.DEEPSEEK_API_KEY?.trim(),
      model: process.env.DEEPSEEK_CHAT_MODEL?.trim() || CHATBOT_MODEL_DEFAULT,
      timeoutMs: DEEPSEEK_TIMEOUT_MS,
    },
    {
      name: "openai",
      url: "https://api.openai.com/v1/chat/completions",
      key: process.env.OPENAI_API_KEY?.trim(),
      model: process.env.OPENAI_CHAT_MODEL?.trim() || OPENAI_MODEL_DEFAULT,
      timeoutMs: OPENAI_TIMEOUT_MS,
    },
  ];

  for (const p of providers) {
    if (!p.key) continue;
    const t0 = Date.now();
    const content = await callChatProvider(p.url, p.key, p.model, upstreamMessages, p.timeoutMs);
    if (content) {
      console.log(`[chat] provider=${p.name} model=${p.model} ms=${Date.now() - t0} total_ms=${Date.now() - startedAt}`);
      const finalized = finalizeChatReply(content, lastUser.content);
      return NextResponse.json(
        { reply: finalized.reply, showContactLink: finalized.showContactLink, mode: p.name },
        { headers },
      );
    }
    console.warn(`[chat] provider=${p.name} failed ms=${Date.now() - t0}, trying next`);
  }

  console.warn(`[chat] provider=local total_ms=${Date.now() - startedAt}`);
  const local = finalizeChatReply(localChatReply(lastUser.content), lastUser.content);
  return NextResponse.json(
    {
      reply: local.reply,
      showContactLink: local.showContactLink,
      mode: "local" as const,
      warning: "一時的に接続できないため、簡易回答に切り替えました。",
    },
    { headers },
  );
}

/** OpenAI互換の Chat Completions を呼ぶ。タイムアウト・5xx/429等・通信エラー・空応答は null */
async function callChatProvider(
  url: string,
  key: string,
  model: string,
  messages: { role: string; content: string }[],
  timeoutMs: number,
): Promise<string | null> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, max_tokens: CHATBOT_MAX_TOKENS, messages }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) {
      console.error("[chat] upstream error", url, response.status, (await response.text()).slice(0, 300));
      return null;
    }
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error("[chat] upstream failed", url, String(error));
    return null;
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
