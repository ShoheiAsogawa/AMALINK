/**
 * チャットAPI向けの簡易レート制限（プロセス内メモリ）。
 * Vercel の複数インスタンス間では完全共有されないが、単体インスタンスでの連打・乱用を抑える。
 */

type Bucket = {
  /** 直近のリクエスト時刻（ms） */
  hits: number[];
};

const buckets = new Map<string, Bucket>();

/** 1分あたりの上限 */
export const CHAT_RATE_LIMIT_PER_MINUTE = 8;
/** 1時間あたりの上限 */
export const CHAT_RATE_LIMIT_PER_HOUR = 40;
/** リクエストボディ上限（バイト） */
export const CHAT_MAX_BODY_BYTES = 16_384;

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * 60_000;
const MAX_BUCKETS = 5_000;

function pruneBucket(bucket: Bucket, now: number) {
  bucket.hits = bucket.hits.filter((t) => now - t < HOUR_MS);
}

function evictIfNeeded(now: number) {
  if (buckets.size <= MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    pruneBucket(bucket, now);
    if (bucket.hits.length === 0) buckets.delete(key);
    if (buckets.size <= MAX_BUCKETS * 0.8) break;
  }
  // それでも多ければ古いものから削除
  if (buckets.size > MAX_BUCKETS) {
    const overflow = buckets.size - Math.floor(MAX_BUCKETS * 0.8);
    const keys = buckets.keys();
    for (let i = 0; i < overflow; i++) {
      const next = keys.next();
      if (next.done) break;
      buckets.delete(next.value);
    }
  }
}

export type RateLimitResult =
  | { ok: true; remainingMinute: number; remainingHour: number }
  | { ok: false; retryAfterSec: number; reason: "minute" | "hour" };

export function checkChatRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  evictIfNeeded(now);

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }
  pruneBucket(bucket, now);

  const minuteHits = bucket.hits.filter((t) => now - t < MINUTE_MS).length;
  const hourHits = bucket.hits.length;

  if (minuteHits >= CHAT_RATE_LIMIT_PER_MINUTE) {
    const oldest = bucket.hits.find((t) => now - t < MINUTE_MS) ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((MINUTE_MS - (now - oldest)) / 1000));
    return { ok: false, retryAfterSec, reason: "minute" };
  }

  if (hourHits >= CHAT_RATE_LIMIT_PER_HOUR) {
    const oldest = bucket.hits[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((HOUR_MS - (now - oldest)) / 1000));
    return { ok: false, retryAfterSec, reason: "hour" };
  }

  bucket.hits.push(now);
  return {
    ok: true,
    remainingMinute: CHAT_RATE_LIMIT_PER_MINUTE - minuteHits - 1,
    remainingHour: CHAT_RATE_LIMIT_PER_HOUR - hourHits - 1,
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 128);
  return "unknown";
}

/** 同一サイト（またはローカル）以外からの Origin を拒否 */
export function isAllowedChatOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const host = request.headers.get("host");
  if (host && originHost === host) return true;

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) {
    try {
      if (new URL(site).host === originHost) return true;
    } catch {
      /* ignore */
    }
  }

  if (
    originHost.startsWith("localhost:") ||
    originHost.startsWith("127.0.0.1:") ||
    originHost === "localhost" ||
    originHost === "127.0.0.1"
  ) {
    return true;
  }

  // Vercel preview
  if (originHost.endsWith(".vercel.app")) return true;

  return false;
}
