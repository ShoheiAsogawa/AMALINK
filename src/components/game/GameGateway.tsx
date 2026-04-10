"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SvgStudyGame } from "./SvgStudyGame";

type Phase = "ask" | "playing" | "done";

export function GameGateway({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("ask");

  const handleClear = useCallback(() => {
    setPhase("done");
  }, []);

  if (phase === "done") {
    return <>{children}</>;
  }

  return (
    <>
      <div className="hidden">{children}</div>

      <AnimatePresence mode="wait">
        {phase === "ask" && (
          <motion.div
            key="ask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          >
            {/* 奄美の夜の海 */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#071a2e] via-[#0c2744] to-[#0f3460]" />

              {/* 波 — 2レイヤー */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 right-0 h-[35%] opacity-10"
              >
                <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full">
                  <path fill="#0ea5e9" d="M0,80 Q300,20 600,80 Q900,140 1200,80 L1200,200 L0,200 Z" />
                </svg>
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-0 left-0 right-0 h-[22%] opacity-15"
              >
                <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full">
                  <path fill="#38bdf8" d="M0,100 Q300,50 600,100 Q900,150 1200,100 L1200,200 L0,200 Z" />
                </svg>
              </motion.div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-12 px-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center"
              >
                <p className="text-sky-200/40 text-xs tracking-[0.3em] uppercase font-sans mb-6">
                  Welcome to AMALINK
                </p>
                <h2 className="text-white text-2xl sm:text-3xl font-serif font-medium leading-relaxed">
                  <span className="text-sky-400">島に明かりを灯しますか？</span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => setPhase("playing")}
                  className="group relative px-10 py-4 rounded-full bg-amami-blue hover:bg-sky-400 text-white font-serif font-medium text-base tracking-wider transition-all duration-300 hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] cursor-pointer"
                >
                  <span className="relative z-10">やってみる</span>
                </button>

                <button
                  onClick={() => setPhase("done")}
                  className="px-10 py-4 rounded-full border border-sky-300/20 hover:border-sky-300/40 text-sky-100/50 hover:text-sky-100/90 font-serif text-base tracking-wider transition-all duration-300 cursor-pointer"
                >
                  サイトを見る
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SvgStudyGame onClear={handleClear} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
