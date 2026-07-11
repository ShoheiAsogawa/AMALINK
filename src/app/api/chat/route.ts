import { NextResponse } from "next/server";
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

type Body = {
  messages?: { role?: string; content?: string }[];
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
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
    return NextResponse.json({
      reply: local.reply,
      showContactLink: local.showContactLink,
      mode: "local" as const,
    });
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
      return NextResponse.json({
        reply: local.reply,
        showContactLink: local.showContactLink,
        mode: "local" as const,
        warning: "AI接続に失敗したため、簡易回答に切り替えました。",
      });
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw =
      data.choices?.[0]?.message?.content?.trim() ||
      localChatReply(lastUser.content);
    const finalized = finalizeChatReply(raw, lastUser.content);

    return NextResponse.json({
      reply: finalized.reply,
      showContactLink: finalized.showContactLink,
      mode: "openai" as const,
    });
  } catch (error) {
    console.error("Chat route failed", error);
    const local = finalizeChatReply(localChatReply(lastUser.content), lastUser.content);
    return NextResponse.json({
      reply: local.reply,
      showContactLink: local.showContactLink,
      mode: "local" as const,
      warning: "一時的に接続できないため、簡易回答に切り替えました。",
    });
  }
}
