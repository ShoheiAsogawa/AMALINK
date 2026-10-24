"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "./how-we-work.css";

/**
 * 画面に入ったら data-anim="play" を付けて CSS アニメーションを始める。
 * JS が動かないとき・動きを減らす設定のときは何も付けないので、完成した状態のまま見える。
 * 画面の外に出たら data-running="0" で、くり返しの動きを止める（スマホの負荷対策）。
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.dataset.anim = "ready";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          el.dataset.anim = "play";
          el.dataset.running = "1";
        } else if (el.dataset.anim === "play") {
          el.dataset.running = "0";
        }
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
