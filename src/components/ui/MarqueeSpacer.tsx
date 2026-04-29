"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { SectionServicesMarquee } from "@/components/ui/SectionMarquee";

type Props = {
  phrase: string;
  className?: string;
};

/**
 * セクション境界の全幅帯にマーキーを置く（About Us / Services の英字ラベルの直上イメージ）
 */
export function MarqueeSpacer({ phrase, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn(
        "relative z-[1] overflow-hidden bg-transparent py-9 md:py-12",
        className
      )}
      aria-hidden
    >      <SectionServicesMarquee
        scrollTargetRef={ref}
        phrase={phrase}
        positionClass="left-0 right-0 top-1/2 z-0 -translate-y-1/2"
      />
    </div>
  );
}
