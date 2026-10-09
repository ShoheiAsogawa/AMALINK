import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  // 既定の dummy queue だと revalidate の期限が来ても再生成されず、古いページ（STALE）を出し続ける。
  // memoryQueue は WORKER_SELF_REFERENCE（wrangler.jsonc で定義済み）経由で同じ Worker に再生成を頼む。無料。
  queue: memoryQueue,
});
