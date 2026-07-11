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

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    const local = finalizeChatReply(localChatReply(lastUser.content), lastUser.content);
    return NextResponse.json(
      {
        reply: local.reply,
        showContactLink: local.showContactLink,
        mode: "local" as const,
      },
      { headers: rateLimitHeaders(undefined, limited.remainingMinute) },
    );
  }

  const model = process.env.OPENAI_CHAT_MODEL?.trim() || CHATBOT_MODEL_DEFAULT;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_completion_tokens: CHATBOT_MAX_TOKENS,
        messages: [
          { role: "system", content: CHATBOT_SYSTEM_PROMPT },
          ...cleaned,
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("OpenAI chat error", response.status, detail);
      const local = finalizeChatReply(localChatReply(lastUser.content), lastUser.content);
      return NextResponse.json(
        {
          reply: local.reply,
          showContactLink: local.showContactLink,
          mode: "local" as const,
          warning: "AI接続に失敗したため、簡易回答に切り替えました。",
        },
        { headers: rateLimitHeaders(undefined, limited.remainingMinute) },
      );
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw =
      data.choices?.[0]?.message?.content?.trim() ||
      localChatReply(lastUser.content);
    const finalized = finalizeChatReply(raw, lastUser.content);

    return NextResponse.json(
      {
        reply: finalized.reply,
        showContactLink: finalized.showContactLink,
        mode: "openai" as const,
      },
      { headers: rateLimitHeaders(undefined, limited.remainingMinute) },
    );
  } catch (error) {
    console.error("Chat route failed", error);
    const local = finalizeChatReply(localChatReply(lastUser.content), lastUser.content);
    return NextResponse.json(
      {
        reply: local.reply,
        showContactLink: local.showContactLink,
        mode: "local" as const,
        warning: "一時的に接続できないため、簡易回答に切り替えました。",
      },
      { headers: rateLimitHeaders(undefined, limited.remainingMinute) },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
