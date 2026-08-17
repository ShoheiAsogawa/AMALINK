"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  className?: string;
  poster: string;
  /** 画面内に入ったときだけ再生。外れたら止めて負荷を落とす */
  ariaHidden?: boolean;
};

export function AmbientVideo({ className, poster, ariaHidden = true }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanLoad(true);
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "160px 0px", threshold: 0.12 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!canLoad) return;
    const el = ref.current;
    if (!el) return;
    el.load();
    void el.play().catch(() => {});
  }, [canLoad]);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      poster={`${assetBase}${poster}`}
      muted
      playsInline
      loop
      preload="none"
      aria-hidden={ariaHidden}
      disablePictureInPicture
    >
      {canLoad ? (
        <>
          <source src={`${assetBase}/about/amami-loop-sm.mp4`} type="video/mp4" media="(max-width: 767px)" />
          <source src={`${assetBase}/about/amami-loop.mp4`} type="video/mp4" />
        </>
      ) : null}
    </video>
  );
}
