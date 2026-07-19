"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  markGatewaySeenClass,
  readGatewaySeen,
  writeGatewaySeen,
} from "@/lib/gateway";

/** ミニゲームクリア後：本編のフェード */
const CROSSFADE = {
  duration: 1.25,
  ease: [0.22, 1, 0.36, 1] as const,
};

/** フラッシュバン：白までの立ち上がり・キープ・抜け */
const WHITE_IN = { duration: 0.16, ease: "easeIn" as const };
const WHITE_HOLD_MS = 420;
const WHITE_OUT = { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const };

type WhiteFlashPhase = "idle" | "peak" | "out";

const SvgStudyGame = dynamic(
  () => import("./SvgStudyGame").then((m) => m.SvgStudyGame),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 z-[100] bg-slate-950" aria-hidden />,
  },
);

export function GameGateway({ children }: { children: React.ReactNode }) {
  /** SSR では本編を出し、クライアントで未プレイならゲートウェイを被せる */
  const [showGateway, setShowGateway] = useState(false);
  const [mainRevealed, setMainRevealed] = useState(true);
  const [whiteFlash, setWhiteFlash] = useState<WhiteFlashPhase>("idle");

  useEffect(() => {
    if (readGatewaySeen()) {
      markGatewaySeenClass();
      setShowGateway(false);
      setMainRevealed(true);
      return;
    }
    setShowGateway(true);
    setMainRevealed(false);
  }, []);

  const handleClear = useCallback(() => {
    writeGatewaySeen();
    markGatewaySeenClass();
    setShowGateway(false);
    setMainRevealed(true);
    setWhiteFlash("peak");
  }, []);

  useEffect(() => {
    if (whiteFlash !== "peak") return;
    const id = window.setTimeout(() => setWhiteFlash("out"), WHITE_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [whiteFlash]);

  useEffect(() => {
    if (!showGateway) return;
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    html.classList.add("amalink-gateway-lock");
    body.classList.add("amalink-gateway-lock");
    body.dataset.amalinkGatewayScroll = String(scrollY);
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    return () => {
      html.classList.remove("amalink-gateway-lock");
      body.classList.remove("amalink-gateway-lock");
      const y = Number(body.dataset.amalinkGatewayScroll ?? "0");
      delete body.dataset.amalinkGatewayScroll;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, y);
    };
  }, [showGateway]);

  const mainShell = mainRevealed ? (
    <div className="amalink-main-shell relative z-0 min-h-screen">{children}</div>
  ) : (
    <motion.div
      initial={false}
      animate={{ opacity: 0 }}
      transition={CROSSFADE}
      style={{ pointerEvents: "none" }}
      className="amalink-main-shell relative z-0 min-h-screen"
      aria-hidden
    >
      {children}
    </motion.div>
  );

  return (
    <>
      {mainShell}

      <AnimatePresence>
        {whiteFlash !== "idle" && (
          <motion.div
            key="gateway-white-flash"
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[300] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: whiteFlash === "out" ? 0 : 1 }}
            transition={whiteFlash === "out" ? WHITE_OUT : WHITE_IN}
            onAnimationComplete={() => {
              if (whiteFlash === "out") setWhiteFlash("idle");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGateway && (
          <motion.div
            key="gateway-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={CROSSFADE}
            className="fixed inset-0 z-[100] max-h-[100dvh] touch-none overscroll-none"
          >
            <div className="fixed inset-0">
              <SvgStudyGame onClear={handleClear} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
