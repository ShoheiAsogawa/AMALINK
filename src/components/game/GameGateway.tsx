"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowGame } from "./ArrowGame";

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
      {/* 本体はバックグラウンドにプリレンダーしておく（非表示） */}
      <div className="hidden">{children}</div>

      <AnimatePresence mode="wait">
        {phase === "ask" && (
          <motion.div
            key="ask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a1a2e]"
          >
            {/* 海のような背景グラデーション */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 right-0 h-[40%] opacity-20"
              >
                <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full">
                  <path
                    fill="#0ea5e9"
                    d="M0,100 Q300,40 600,100 Q900,160 1200,100 L1200,200 L0,200 Z"
                  />
                </svg>
              </motion.div>
            </div>

            {/* コンテンツ */}
            <div className="relative z-10 flex flex-col items-center gap-12 px-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center"
              >
                <p className="text-white/50 text-xs tracking-[0.3em] uppercase font-sans mb-4">
                  Welcome to AMALINK
                </p>
                <h2 className="text-white text-2xl sm:text-3xl font-serif font-medium leading-relaxed">
                  島に来る前に、<br />
                  <span className="text-sky-400">弓を引いてみませんか？</span>
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
                  className="group relative px-10 py-4 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-sans font-medium text-base tracking-wider transition-all duration-300 hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] cursor-pointer"
                >
                  <span className="relative z-10">やってみる</span>
                </button>

                <button
                  onClick={() => setPhase("done")}
                  className="px-10 py-4 rounded-full border border-white/20 hover:border-white/40 text-white/60 hover:text-white/90 font-sans text-base tracking-wider transition-all duration-300 cursor-pointer"
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
            <ArrowGame onClear={handleClear} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
