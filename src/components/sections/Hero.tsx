"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type WaveLayer = {
  bottom?: string;
  top?: string;
  height: string;
  duration: number;
  opacity?: string;
  rotate?: boolean;
  path: string;
  gradient: {
    id: string;
    stops: { offset: string; color: string; opacity: string }[];
    y1?: string;
    y2?: string;
  };
};

const WAVE_LAYERS: WaveLayer[] = [
  {
    bottom: "bottom-[30%] md:bottom-[20%]",
    height: "h-[60vh] md:h-[70vh]",
    duration: 35,
    path: "M0,180 Q300,120 600,180 Q900,240 1200,180 Q1500,120 1800,180 Q2100,240 2400,180 L2400,320 L0,320 Z",
    gradient: {
      id: "hero-wave1",
      stops: [
        { offset: "0%", color: "#0284c7", opacity: "0.15" },
        { offset: "100%", color: "#0284c7", opacity: "0" },
      ],
    },
  },
  {
    bottom: "bottom-[20%] md:bottom-[10%]",
    height: "h-[50vh] md:h-[60vh]",
    duration: 28,
    path: "M0,160 Q300,100 600,160 Q900,220 1200,160 Q1500,100 1800,160 Q2100,220 2400,160 L2400,320 L0,320 Z",
    gradient: {
      id: "hero-wave2",
      stops: [
        { offset: "0%", color: "#0ea5e9", opacity: "0.2" },
        { offset: "100%", color: "#0ea5e9", opacity: "0" },
      ],
    },
  },
  {
    bottom: "bottom-[10%] md:bottom-0",
    height: "h-[45vh] md:h-[55vh]",
    duration: 24,
    path: "M0,200 Q300,140 600,200 Q900,260 1200,200 Q1500,140 1800,200 Q2100,260 2400,200 L2400,320 L0,320 Z",
    gradient: {
      id: "hero-wave3",
      stops: [
        { offset: "0%", color: "#38bdf8", opacity: "0.25" },
        { offset: "100%", color: "#38bdf8", opacity: "0" },
      ],
    },
  },
  {
    bottom: "bottom-0",
    height: "h-[35vh] md:h-[45vh]",
    duration: 20,
    path: "M0,220 Q300,160 600,220 Q900,280 1200,220 Q1500,160 1800,220 Q2100,280 2400,220 L2400,320 L0,320 Z",
    gradient: {
      id: "hero-wave4",
      stops: [
        { offset: "0%", color: "#7dd3fc", opacity: "0.3" },
        { offset: "50%", color: "#bae6fd", opacity: "0.15" },
        { offset: "100%", color: "#f0f9ff", opacity: "0" },
      ],
    },
  },
  {
    top: "top-[10%]",
    height: "h-[30vh] md:h-[40vh]",
    duration: 40,
    opacity: "opacity-50",
    rotate: true,
    path: "M0,160 Q300,100 600,160 Q900,220 1200,160 Q1500,100 1800,160 Q2100,220 2400,160 L2400,320 L0,320 Z",
    gradient: {
      id: "hero-wave5",
      y1: "100%",
      y2: "0%",
      stops: [
        { offset: "0%", color: "#e0f2fe", opacity: "0.4" },
        { offset: "100%", color: "#e0f2fe", opacity: "0" },
      ],
    },
  },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "80px 0px", threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-50">
      {/* Background with subtle gradient and noise texture */}
      <div className="absolute inset-0 z-0 bg-[#fafafa] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-grain-noise" />

        {WAVE_LAYERS.map((layer) => (
          <div
            key={layer.gradient.id}
            className={`absolute w-[200%] anim-wave-drift gpu-accelerate ${layer.height} ${layer.bottom ?? ""} ${layer.top ?? ""} ${layer.opacity ?? ""}`}
            style={{
              willChange: inView ? "transform" : "auto",
              backfaceVisibility: "hidden",
              animationDuration: `${layer.duration}s`,
              animationPlayState: inView ? "running" : "paused",
            }}
          >
            <svg
              viewBox="0 0 2400 320"
              preserveAspectRatio="none"
              className={`h-full w-full ${layer.rotate ? "rotate-180" : ""}`}
            >
              <defs>
                <linearGradient
                  id={layer.gradient.id}
                  x1="0%"
                  y1={layer.gradient.y1 ?? "0%"}
                  x2="0%"
                  y2={layer.gradient.y2 ?? "100%"}
                >
                  {layer.gradient.stops.map((stop) => (
                    <stop
                      key={stop.offset}
                      offset={stop.offset}
                      stopColor={stop.color}
                      stopOpacity={stop.opacity}
                    />
                  ))}
                </linearGradient>
              </defs>
              <path fill={`url(#${layer.gradient.id})`} d={layer.path} />
            </svg>
          </div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 h-[150px] md:h-[250px] bg-gradient-to-b from-transparent to-slate-50 pointer-events-none z-[1]" />
      </div>

      <div className="container relative z-10 mx-auto flex h-full w-full items-center justify-center px-6 py-20 md:py-0">
        <motion.div
          style={{ y, opacity }}
          className="flex w-full flex-col items-center justify-center gap-8 md:w-auto md:flex-row md:gap-24"
        >
          <h1 className="m-0 w-full text-center font-serif font-bold text-slate-800">
            <span className="hidden md:flex flex-row-reverse gap-8">
              <span className="vertical-text text-5xl md:text-7xl tracking-wider leading-relaxed whitespace-nowrap">
                島のリズムで、
              </span>
              <span className="vertical-text text-5xl md:text-7xl tracking-wider leading-relaxed whitespace-nowrap text-amami-blue">
                未来をつくる。
              </span>
            </span>
            <span className="mx-auto block w-full pt-4 text-center text-3xl leading-tight drop-shadow-sm sm:text-4xl md:hidden">
              島のリズムで、
              <br />
              <span className="text-amami-blue">未来をつくる。</span>
            </span>
          </h1>

          <div className="mx-auto w-full max-w-[21rem] text-center md:hidden">
            <p className="text-pretty text-base leading-loose text-slate-600 font-sans [word-break:keep-all] sm:text-lg">
              <span className="block">波音のように穏やかに、</span>
              <span className="block">けれど着実に。</span>
              <span className="mt-6 block">奄美大島でAIのことなら、</span>
              <span className="block">AMALINKへ。</span>
              <span className="block">生成AIの活用から</span>
              <span className="block">Web制作まで、</span>
              <span className="block">島から全国へ伴走します。</span>
            </p>
          </div>

          <div className="hidden md:block max-w-lg">
            <p className="text-pretty text-lg leading-loose text-slate-600 font-sans [word-break:keep-all] md:text-xl">
              <span className="block">波音のように穏やかに、</span>
              <span className="block">けれど着実に。</span>
              <span className="mt-6 block">奄美大島でAIのことなら、</span>
              <span className="block">AMALINKへ。</span>
              <span className="block">生成AIの活用からWeb制作まで、</span>
              <span className="block">島から全国へ伴走します。</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll */}
      <div className="absolute bottom-6 md:bottom-10 left-0 right-0 z-10 flex flex-col items-center px-6">
        <div className="hero-scroll-hint flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-sans">Scroll</span>
          <div className="w-[1px] h-8 md:h-12 bg-slate-300" />
        </div>
      </div>
    </section>
  );
}
