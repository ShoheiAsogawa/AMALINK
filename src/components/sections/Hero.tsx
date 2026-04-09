"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-50">
      {/* Background with subtle gradient and noise texture */}
      <div className="absolute inset-0 z-0 bg-[#fafafa] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Elegant Wave Animation - Perfectly seamless infinite waves */}
        {/* Key: Each wave pattern repeats exactly at 1200px, so 0%, 50%, 100% positions are identical */}
        
        {/* Wave Layer 1 - Deep Blue */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 35, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
          style={{ willChange: "transform" }}
          className="absolute bottom-[30%] md:bottom-[20%] w-[200%] h-[60vh] md:h-[70vh] gpu-accelerate"
        >
          <svg viewBox="0 0 2400 320" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Pattern: 0→180, peak at 300→120, valley at 600→220, back to 900→180, repeat */}
            {/* Ensures: position at x=0 equals position at x=1200 equals position at x=2400 */}
            <path
              fill="url(#wave1)"
              d="M0,180 Q300,120 600,180 Q900,240 1200,180 Q1500,120 1800,180 Q2100,240 2400,180 L2400,320 L0,320 Z"
            />
          </svg>
        </motion.div>

        {/* Wave Layer 2 - Medium Blue */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 28, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
          style={{ willChange: "transform" }}
          className="absolute bottom-[20%] md:bottom-[10%] w-[200%] h-[50vh] md:h-[60vh] gpu-accelerate"
        >
          <svg viewBox="0 0 2400 320" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="wave2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#wave2)"
              d="M0,160 Q300,100 600,160 Q900,220 1200,160 Q1500,100 1800,160 Q2100,220 2400,160 L2400,320 L0,320 Z"
            />
          </svg>
        </motion.div>

        {/* Wave Layer 3 - Light Blue */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 24, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
          style={{ willChange: "transform" }}
          className="absolute bottom-[10%] md:bottom-0 w-[200%] h-[45vh] md:h-[55vh] gpu-accelerate"
        >
          <svg viewBox="0 0 2400 320" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="wave3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#wave3)"
              d="M0,200 Q300,140 600,200 Q900,260 1200,200 Q1500,140 1800,200 Q2100,260 2400,200 L2400,320 L0,320 Z"
            />
          </svg>
        </motion.div>

        {/* Wave Layer 4 - Lightest Blue */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
          style={{ willChange: "transform" }}
          className="absolute bottom-0 w-[200%] h-[35vh] md:h-[45vh] gpu-accelerate"
        >
          <svg viewBox="0 0 2400 320" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="wave4" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              fill="url(#wave4)"
              d="M0,220 Q300,160 600,220 Q900,280 1200,220 Q1500,160 1800,220 Q2100,280 2400,220 L2400,320 L0,320 Z"
            />
          </svg>
        </motion.div>

        {/* Wave Layer 5 - Top atmosphere */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
          style={{ willChange: "transform" }}
          className="absolute top-[10%] w-[200%] h-[30vh] md:h-[40vh] opacity-50 gpu-accelerate"
        >
          <svg viewBox="0 0 2400 320" preserveAspectRatio="none" className="w-full h-full rotate-180">
            <defs>
              <linearGradient id="wave5" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#wave5)"
              d="M0,160 Q300,100 600,160 Q900,220 1200,160 Q1500,100 1800,160 Q2100,220 2400,160 L2400,320 L0,320 Z"
            />
          </svg>
        </motion.div>

        {/* Bottom gradient overlay for smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-[150px] md:h-[250px] bg-gradient-to-b from-transparent to-slate-50 pointer-events-none z-[1]" />
      </div>

      <div className="container mx-auto px-6 z-10 relative h-full flex items-center justify-center py-20 md:py-0">
        <motion.div
          style={{ y, opacity }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24"
        >
          {/* Vertical Japanese Copy - Desktop Only */}
          <div className="hidden md:flex flex-row-reverse gap-8 h-[55vh]">
            <h1 className="vertical-text text-5xl md:text-7xl font-serif font-medium tracking-wider text-slate-800 leading-relaxed whitespace-nowrap">
              <span className="block mb-8">島のリズムで、</span>
              <span className="block text-amami-blue">未来をつくる。</span>
            </h1>
          </div>

          {/* Mobile Copy (Horizontal) */}
          <div className="md:hidden text-center pt-20">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium leading-tight text-slate-800 mb-8 drop-shadow-sm">
              島のリズムで、<br />
              <span className="text-amami-blue">未来をつくる。</span>
            </h1>
            <p className="text-slate-600 text-base leading-loose font-sans max-w-xs mx-auto">
              波音のように穏やかに、<br />
              けれど着実に。<br />
              <br />
              私たちは奄美大島から、<br />
              デジタルという新しい風を<br />
              暮らしに届けます。
            </p>
          </div>

          {/* Desktop Sub Copy */}
          <div className="hidden md:block max-w-md">
            <p className="text-slate-600 text-lg leading-loose font-sans">
              波音のように穏やかに、<br />
              けれど着実に。<br />
              <br />
              私たちは奄美大島から、<br />
              デジタルという新しい風を<br />
              暮らしに届けます。
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-sans">Scroll</span>
        <div className="w-[1px] h-8 md:h-12 bg-slate-300" />
      </motion.div>
    </section>
  );
}
