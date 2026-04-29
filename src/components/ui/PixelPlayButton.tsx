"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HATENA_ANIMAL_SRC, randomAnimalIndex } from "@/data/hatenaAnimals";

const DISPLAY_MS = 1000;

export function PixelPlayButton() {
  const [spawn, setSpawn] = useState<{ src: string; key: number } | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const spawnAnimal = useCallback(() => {
    clearHideTimer();
    const idx = randomAnimalIndex(HATENA_ANIMAL_SRC.length);
    const src = HATENA_ANIMAL_SRC[idx]!;
    setSpawn({ src, key: Date.now() });
    hideTimerRef.current = setTimeout(() => {
      setSpawn(null);
      hideTimerRef.current = null;
    }, DISPLAY_MS);
  }, [clearHideTimer]);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

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
                <Image
                  src={spawn.src}
                  alt=""
                  width={160}
                  height={160}
                  className="h-auto max-h-[128px] w-auto max-w-[128px] max-md:max-h-[106px] max-md:max-w-[106px] object-contain select-none bg-transparent"
                  draggable={false}
                  priority={false}
                  unoptimized
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
