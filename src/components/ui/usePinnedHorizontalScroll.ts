"use client";

import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

export function usePinnedHorizontalScroll(itemCount: number) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [layout, setLayout] = useState({ stickyTop: -300, containerHeight: 1500 });
  const travel = useMotionValue(0);
  const scrollStart = useMotionValue(0);
  const scrollEnd = useMotionValue(1);
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(
    [scrollY, scrollStart, scrollEnd],
    ([current, start, end]) => {
      const range = Math.max(1, Number(end) - Number(start));
      return Math.min(1, Math.max(0, (Number(current) - Number(start)) / range));
    },
  );
  const x = useTransform(
    [scrollYProgress, travel],
    ([progress, distance]) => -Number(progress) * Number(distance),
  );

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!container || !track || !sticky) return;

      const nextTravel = Math.max(0, track.scrollWidth - sticky.clientWidth);
      const stickyHeight = Math.max(1, sticky.offsetHeight);
      const nextStickyTop = Math.round(window.innerHeight * 0.8 - stickyHeight);
      const nextContainerHeight = Math.ceil(stickyHeight + nextTravel);
      const documentTop = container.getBoundingClientRect().top + window.scrollY;
      const nextScrollStart = documentTop - nextStickyTop;

      travel.set(nextTravel);
      scrollStart.set(nextScrollStart);
      scrollEnd.set(nextScrollStart + nextTravel);
      setLayout((current) =>
        current.stickyTop === nextStickyTop && current.containerHeight === nextContainerHeight
          ? current
          : { stickyTop: nextStickyTop, containerHeight: nextContainerHeight },
      );
    };

    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (trackRef.current) ro?.observe(trackRef.current);
    if (stickyRef.current) ro?.observe(stickyRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [scrollEnd, scrollStart, travel]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActive(
      Math.min(itemCount - 1, Math.max(0, Math.round(latest * (itemCount - 1)))),
    );
  });

  return {
    active,
    containerRef,
    layout,
    reduceMotion,
    stickyRef,
    trackRef,
    x,
  };
}
