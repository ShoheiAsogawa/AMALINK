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
  const imgRef = useRef<HTMLImageElement | null>(null);
  const spawnKeyRef = useRef(0);

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
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => {
        window.cancelIdleCallback(id);
        clearHideTimer();
      };
    }
    const timer = window.setTimeout(start, 400);
    return () => {
      window.clearTimeout(timer);
      clearHideTimer();
    };
  }, [clearHideTimer, ensurePreloaded]);

  const beginHideCountdown = useCallback(
    (key: number) => {
      if (key !== spawnKeyRef.current) return;
      clearHideTimer();
      hideTimerRef.current = setTimeout(() => {
        if (spawnKeyRef.current !== key) return;
        setSpawn(null);
        hideTimerRef.current = null;
      }, DISPLAY_MS);
    },
    [clearHideTimer]
  );

  const spawnAnimal = useCallback(() => {
    ensurePreloaded();
    clearHideTimer();
    const idx = randomAnimalIndex(HATENA_ANIMAL_SRC.length);
    const src = HATENA_ANIMAL_SRC[idx]!;
    const key = Date.now();
    spawnKeyRef.current = key;
    setSpawn({ src, key });
  }, [clearHideTimer, ensurePreloaded]);

  useEffect(() => {
    if (!spawn) return;
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      beginHideCountdown(spawn.key);
    }
  }, [spawn, beginHideCountdown]);

  return (
    <div
      className="pointer-events-auto fixed z-[70] max-md:bottom-[max(0.375rem,env(safe-area-inset-right))] max-md:right-[max(0.375rem,env(safe-area-inset-right))] max-md:origin-bottom-right max-md:scale-[0.82] md:bottom-[max(1.25rem,env(safe-area-inset-bottom))] md:right-[max(1.25rem,env(safe-area-inset-right))] md:scale-100"
    >
      <div className="relative inline-flex flex-col items-center">
        <div className="pointer-events-none relative mb-1 flex h-[150px] w-[140px] max-md:h-[126px] max-md:w-[118px] items-end justify-center overflow-visible">
          <AnimatePresence mode="wait">
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
                className="absolute bottom-0 left-1/2 flex max-h-[128px] w-[128px] max-md:max-h-[106px] max-md:w-[106px] max-md:max-w-[106px] -translate-x-1/2 items-end justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- 事前プリロード済みの軽量WebPをそのまま表示 */}
                <img
                  ref={imgRef}
                  src={spawn.src}
                  alt=""
                  width={160}
                  height={160}
                  decoding="async"
                  className="h-auto max-h-[128px] w-auto max-w-[128px] max-md:max-h-[106px] max-md:max-w-[106px] object-contain select-none bg-transparent"
                  draggable={false}
                  onLoad={() => beginHideCountdown(spawn.key)}
                  onError={() => beginHideCountdown(spawn.key)}
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
