import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { checkChatRateLimit, getClientIp, isAllowedChatOrigin } from "@/lib/chat-rate-limit";

export const runtime = "nodejs";

/** 通知先（Cloudflare の確認済み宛先に登録しておく必要あり） */
const NOTIFY_EMAIL = "s_asogawa@amalink.co.jp";
/** 送信元（Email Sending に登録したドメインのアドレス） */
const FROM_EMAIL = "noreply@send.amalink.co.jp";
const TURNSTILE_ACTION = "contact";
const MAX_BODY_BYTES = 12_000;
const LIMITS = { name: 100, email: 254, category: 60, message: 4000 } as const;
const CATEGORIES = new Set([
  "AIコンサルティングについて",
  "ホームページ制作について",
  "システム開発について",
  "デザインについて",
  "GEO・SEO対策について",
  "その他・ご相談",
]);
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;

type SendEmailBinding = {
  send(message: {
    to: string;
    from: string | { email: string; name?: string };
    subject: string;
    text: string;
    replyTo?: string;
  }): Promise<{ messageId: string }>;
};

type ContactEnv = {
  EMAIL?: SendEmailBinding;
  TURNSTILE_SECRET?: string;
  TURNSTILE_HOSTNAMES?: string;
  TURNSTILE_ALLOW_TEST_KEYS?: string;
  CONTACT_EMAIL_DRY_RUN?: string;
};

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function readEnv(): ContactEnv {
  let cf: ContactEnv = {};
  try {
    cf = getCloudflareContext().env as unknown as ContactEnv;
  } catch {
    // Cloudflare 外（next dev など）
  }
  const pick = (k: keyof ContactEnv) =>
    (cf[k] as string | undefined) ?? (process.env[k] as string | undefined);
  return {
    EMAIL: cf.EMAIL,
    TURNSTILE_SECRET: pick("TURNSTILE_SECRET"),
    TURNSTILE_HOSTNAMES: pick("TURNSTILE_HOSTNAMES"),
    TURNSTILE_ALLOW_TEST_KEYS: pick("TURNSTILE_ALLOW_TEST_KEYS"),
    CONTACT_EMAIL_DRY_RUN: pick("CONTACT_EMAIL_DRY_RUN"),
  };
}

async function verifyTurnstile(token: string, ip: string, env: ContactEnv): Promise<boolean> {
  const hostnames = new Set(
    (env.TURNSTILE_HOSTNAMES ?? "").split(",").map((h) => h.trim()).filter(Boolean),
  );
  if (!env.TURNSTILE_SECRET || !token || token.length > 2048 || hostnames.size === 0) return false;
  try {
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!r.ok) return false;
    const result = (await r.json()) as { success?: boolean; action?: string; hostname?: string };
    if (result.success !== true) return false;
    // テスト用キーは action が空で返るため、ローカル検証時だけ許す
    const actionOk =
      result.action === TURNSTILE_ACTION ||
      (env.TURNSTILE_ALLOW_TEST_KEYS === "1" && !result.action);
    return actionOk && hostnames.has(result.hostname ?? "");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isAllowedChatOrigin(request)) return json({ error: "forbidden" }, 403);

  const len = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(len) && len > MAX_BODY_BYTES) return json({ error: "too_large" }, 400);

  const ip = getClientIp(request);
  const limited = checkChatRateLimit(`contact:${ip}`);
  if (!limited.ok) return json({ error: "rate_limited" }, 429);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ error: "invalid_body" }, 400);
  }
  if (raw.length > MAX_BODY_BYTES) return json({ error: "too_large" }, 400);

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  // ハニーポット：人には見えない欄。入っていたら拒否
  if (str(body.website)) return json({ error: "rejected" }, 400);

  const name = str(body.name);
  const email = str(body.email);
  const category = str(body.category);
  const message = str(body.message);
  if (
    !name || name.length > LIMITS.name ||
    !email || email.length > LIMITS.email || !EMAIL_RE.test(email) ||
    !CATEGORIES.has(category) ||
    message.length > LIMITS.message
  ) {
    return json({ error: "invalid_input" }, 400);
  }

  const env = readEnv();
  if (!(await verifyTurnstile(str(body.turnstileToken), ip, env))) {
    return json({ error: "turnstile_failed" }, 403);
  }

  if (env.CONTACT_EMAIL_DRY_RUN === "1") {
    // ローカル検証用：実メールは送らない（本文・アドレスはログに出さない）
    return json({ ok: true, dryRun: true }, 200);
  }
  if (!env.EMAIL) {
    console.error("contact: EMAIL binding missing");
    return json({ error: "send_unavailable" }, 503);
  }

  try {
    await env.EMAIL.send({
      to: NOTIFY_EMAIL,
      from: { email: FROM_EMAIL, name: "AMALINK お問い合わせ" },
      replyTo: email,
      subject: `【AMALINK】お問い合わせ (${category})`,
      text: [
        `カテゴリ: ${category}`,
        `お名前: ${name}`,
        `返信先メール: ${email}`,
        "",
        "お問い合わせ内容:",
        message || "(未入力)",
      ].join("\n"),
    });
  } catch (e) {
    const code = (e as { code?: string })?.code ?? "unknown";
    console.error("contact: send failed", code); // コードのみ。本文・アドレスは残さない
    return json({ error: "send_failed" }, 502);
  }
  return json({ ok: true }, 200);
}
