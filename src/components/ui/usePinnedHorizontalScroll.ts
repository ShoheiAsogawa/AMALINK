"use client";

import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

export function usePinnedHorizontalScroll(itemCount: number) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef(0);
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

  const setDotActive = useCallback((index: number) => {
    if (activeRef.current === index) return;
    activeRef.current = index;
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return;
      if (i === index) {
        dot.dataset.active = "true";
      } else {
        delete dot.dataset.active;
      }
    });
  }, []);

  const setDotRef = useCallback((index: number, node: HTMLSpanElement | null) => {
    dotsRef.current[index] = node;
    if (node) {
      if (index === activeRef.current) {
        node.dataset.active = "true";
      } else {
        delete node.dataset.active;
      }
    }
  }, []);

  useLayoutEffect(() => {
    let rafId = 0;
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

    const scheduleMeasure = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleMeasure) : null;
    if (trackRef.current) ro?.observe(trackRef.current);
    if (stickyRef.current) ro?.observe(stickyRef.current);
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [scrollEnd, scrollStart, travel]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setDotActive(
      Math.min(itemCount - 1, Math.max(0, Math.round(latest * (itemCount - 1)))),
    );
  });

  return {
    containerRef,
    layout,
    reduceMotion,
    setDotRef,
    stickyRef,
    trackRef,
    x,
  };
}
