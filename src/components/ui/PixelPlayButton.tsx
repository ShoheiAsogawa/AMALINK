"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HATENA_ANIMAL_SRC, randomAnimalIndex } from "@/data/hatenaAnimals";

const DISPLAY_MS = 1200;

function preloadAnimalImages(srcs: readonly string[]) {
  for (const src of srcs) {
    const img = new window.Image();
    img.decoding = "async";
    img.src = src;
  }
}

export function PixelPlayButton() {
  const [spawn, setSpawn] = useState<{ src: string; key: number } | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preloadStartedRef = useRef(false);
  const spawnSeqRef = useRef(0);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const ensurePreloaded = useCallback(() => {
    if (preloadStartedRef.current) return;
    preloadStartedRef.current = true;
    preloadAnimalImages(HATENA_ANIMAL_SRC);
  }, []);

  useEffect(() => {
    const start = () => ensurePreloaded();
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: 1500 });
    } else {
      timeoutId = setTimeout(start, 400);
    }

    return () => {
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      clearHideTimer();
    };
  }, [clearHideTimer, ensurePreloaded]);

  const spawnAnimal = useCallback(() => {
    ensurePreloaded();
    clearHideTimer();

    const idx = randomAnimalIndex(HATENA_ANIMAL_SRC.length);
    const src = HATENA_ANIMAL_SRC[idx]!;
    const key = ++spawnSeqRef.current;
    setSpawn({ src, key });

    // 画像の onLoad 待ちに依存すると AnimatePresence(mode=wait) 時に
    // タイマーが始まらず残り続けることがあるため、出現と同時に消す。
    hideTimerRef.current = setTimeout(() => {
      setSpawn((current) => (current?.key === key ? null : current));
      hideTimerRef.current = null;
    }, DISPLAY_MS);
  }, [clearHideTimer, ensurePreloaded]);

  return (
    <div
      className="pointer-events-auto fixed z-[70] max-md:bottom-[max(0.25rem,env(safe-area-inset-bottom))] max-md:right-[max(0.25rem,env(safe-area-inset-right))] max-md:origin-bottom-right max-md:scale-[0.62] md:bottom-[max(1rem,env(safe-area-inset-bottom))] md:right-[max(1rem,env(safe-area-inset-right))] md:origin-bottom-right md:scale-[0.82]"
    >
      <div className="relative inline-flex flex-col items-center">
        <div className="pointer-events-none relative mb-1 flex h-[150px] w-[140px] items-end justify-center overflow-visible">
          <AnimatePresence mode="sync">
            {spawn && (
              <motion.div
                key={spawn.key}
                initial={{ opacity: 1, y: 36, scale: 0.14 }}
                animate={{
                  opacity: 1,
                  y: -10,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 520,
                    damping: 11,
                    mass: 0.42,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.85,
                  y: -4,
                  transition: { duration: 0.12 },
                }}
                style={{ transformOrigin: "bottom center" }}
                className="absolute bottom-0 left-1/2 flex max-h-[128px] w-[128px] max-w-[128px] -translate-x-1/2 items-end justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- 事前プリロード済みの軽量WebPをそのまま表示 */}
                <img
                  src={spawn.src}
                  alt=""
                  width={160}
                  height={160}
                  decoding="async"
                  className="h-auto max-h-[128px] w-auto max-w-[128px] object-contain select-none bg-transparent"
                  draggable={false}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="amalink-pixel-toggle">
          <button
            type="button"
            className="amalink-pixel-trigger"
            aria-label="タップするたびにランダムな動物が出ます"
            onPointerEnter={ensurePreloaded}
            onFocus={ensurePreloaded}
            onClick={spawnAnimal}
          />
          <span aria-hidden />
          <span aria-hidden />
          <span aria-hidden />
          <span aria-hidden />
        </div>
      </div>
    </div>
  );
}
