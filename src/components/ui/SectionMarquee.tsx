"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";
import { cn } from "@/lib/utils";

type Props = {
  scrollTargetRef: RefObject<HTMLElement | null>;
  /** 表示テキスト（「Philosophy」「AMALINK SERVICES」など） */
  phrase: string;
  separator?: string;
  className?: string;
  /** absolute 配置用。帯の中央に寄せるときは top-1/2 -translate-y-1/2 など */
  positionClass?: string;
  durationSec?: number;
  scrollShift?: [string, string];
};

/**
 * Philosophy / AMALINK SERVICES 共通：スクロール連動パララックス ＋ 右→左無限ループ（スタイル同一）
 */
export function SectionServicesMarquee({
  scrollTargetRef,
  phrase,
  separator = " ",
  className,
  positionClass = "top-[7%]",
  durationSec = 95,
  scrollShift = ["8%", "-28%"],
}: Props) {
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start end", "end start"],
  });
  const parallaxX = useTransform(scrollYProgress, [0, 1], scrollShift);

  const chunk = Array.from({ length: 12 }, () => phrase).join(separator);

  const band =
    "inline-block shrink-0 whitespace-nowrap px-4 font-sans uppercase text-[min(11vw,6.5rem)] font-bold tracking-[0.18em] text-slate-400/90 md:text-[min(9vw,5.5rem)]";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 z-0 overflow-hidden select-none opacity-[0.13]",
        positionClass,
        className
      )}
      aria-hidden
    >
      <motion.div style={{ x: parallaxX }} className="will-change-transform">
        <motion.div
          className="flex w-max flex-row"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: durationSec,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span className={band}>{chunk}</span>
          <span className={band}>{chunk}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
