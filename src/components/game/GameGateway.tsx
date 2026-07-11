"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SvgStudyGame } from "./SvgStudyGame";

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

const GATEWAY_SEEN_KEY = "amalink-gateway-seen";

function readGatewaySeen(): boolean {
  try {
    return sessionStorage.getItem(GATEWAY_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeGatewaySeen(): void {
  try {
    sessionStorage.setItem(GATEWAY_SEEN_KEY, "1");
  } catch {
    /* private browsing 等 */
  }
}

export function GameGateway({ children }: { children: React.ReactNode }) {
  /** null = 初回判定中, true = 本編表示, false = ゲートウェイ表示 */
  const [mainRevealed, setMainRevealed] = useState<boolean | null>(null);
  const [whiteFlash, setWhiteFlash] = useState<WhiteFlashPhase>("idle");

  useEffect(() => {
    setMainRevealed(readGatewaySeen());
  }, []);

  const handleClear = useCallback(() => {
    writeGatewaySeen();
    setMainRevealed(true);
    setWhiteFlash("peak");
  }, []);

  useEffect(() => {
    if (whiteFlash !== "peak") return;
    const id = window.setTimeout(() => setWhiteFlash("out"), WHITE_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [whiteFlash]);

  /* 灯す／ミニゲーム中は背後の document スクロールとモバイルのオーバースクロールを止める */
  useEffect(() => {
    if (mainRevealed !== false) return;
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
  }, [mainRevealed]);

  const revealed = mainRevealed === true;
  const showGateway = mainRevealed === false;

  /* 本編表示後は素の div にする。motion の transform が残ると子の sticky/fixed が壊れる */
  const mainShell = revealed ? (
    <div className="relative z-0 min-h-screen">{children}</div>
  ) : (
    <motion.div
      initial={false}
      animate={{ opacity: 0 }}
      transition={CROSSFADE}
      style={{ pointerEvents: "none" }}
      className="relative z-0 min-h-screen"
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
            <AnimatePresence mode="wait">
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="fixed inset-0"
              >
                <SvgStudyGame onClear={handleClear} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
