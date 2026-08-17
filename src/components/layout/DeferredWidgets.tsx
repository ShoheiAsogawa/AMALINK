"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * 初回表示に不要な常駐ウィジェットを、アイドル後に読み込む。
 * 見た目・位置は同じで、初期 JS / 画像の負荷だけ下げる。
 */
const AmalinkChatbot = dynamic(
  () => import("@/components/chatbot/AmalinkChatbot").then((m) => m.AmalinkChatbot),
  { ssr: false },
);

const AiConsultButton = dynamic(
  () => import("@/components/ui/AiConsultButton").then((m) => m.AiConsultButton),
  { ssr: false },
);

function scheduleIdle(callback: () => void, timeoutMs: number) {
  if (typeof window === "undefined") return () => {};

  const win = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (typeof win.requestIdleCallback === "function") {
    const id = win.requestIdleCallback(callback, { timeout: timeoutMs });
    return () => win.cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(callback, Math.min(timeoutMs, 1200));
  return () => window.clearTimeout(id);
}

export function DeferredWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cancel = scheduleIdle(() => {
      if (!cancelled) setReady(true);
    }, 2000);
    return () => {
      cancelled = true;
      cancel();
    };
  }, []);

  if (!ready) return null;
  return (
    <>
      <AmalinkChatbot />
      <AiConsultButton />
    </>
  );
}
