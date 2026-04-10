"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./svg-study-gateway.css";

interface SvgStudyGameProps {
  onClear: () => void;
}

const SUN_CENTER = { x: 963, y: 621 };
const LIGHTHOUSE = { x: 190, y: 680 };
const SUN_ANGLE_RAD = Math.atan2(
  SUN_CENTER.y - LIGHTHOUSE.y,
  SUN_CENTER.x - LIGHTHOUSE.x,
);
const HIT_THRESHOLD_DEG = 12;

/** 灯台ビームの回転中心（mask / #Light の transform-origin と一致） */
const BEAM_PIVOT_SVG = { x: 190, y: 680 };
/** 灯台上の光源ランプ付近（scene.svg の灯台内 ellipse） */
const LIGHTHOUSE_LAMP_SVG = { x: 187.5, y: 663.75 };

function svgUserToClient(svg: SVGSVGElement, x: number, y: number) {
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  return pt.matrixTransform(ctm);
}

export function SvgStudyGame({ onClear }: SvgStudyGameProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const svgHostRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const lighthouseGlowRef = useRef<HTMLDivElement>(null);
  const onClearRef = useRef(onClear);
  onClearRef.current = onClear;

  const [svgReady, setSvgReady] = useState(false);
  const [phase, setPhase] = useState<"night" | "dawn" | "done">("night");
  const clearedRef = useRef(false);

  const triggerDawn = useCallback(() => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    setPhase("dawn");
    window.setTimeout(() => {
      setPhase("done");
      onClearRef.current();
    }, 2200);
  }, []);

  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/svg-study/scene.svg", {
        cache: "no-store",
      });
      const text = await res.text();
      if (cancelled || !svgHostRef.current) return;
      svgHostRef.current.innerHTML = text;
      setSvgReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* 夜だけタップ用レイヤーを出す。文字の見え方は #Sun-lit と同じマスク（光の当たり）に依存 */
  useEffect(() => {
    if (!svgReady) return;
    const host = svgHostRef.current;
    if (!host) return;
    const layer = host.querySelector("#SunTapHintLayer") as SVGGElement | null;
    if (!layer) return;
    layer.setAttribute("visibility", phase === "night" ? "visible" : "hidden");
  }, [phase, svgReady]);

  useEffect(() => {
    if (!svgReady) return;
    const root = mountRef.current;
    const host = svgHostRef.current;
    if (!root || !host) return;

    const hostEl = host;
    const clipFound = hostEl.querySelector("#Clipping_Mask");
    if (!(clipFound instanceof SVGSVGElement)) return;
    const svgClip: SVGSVGElement = clipFound;

    const _center = root.querySelector("#light_center") as HTMLDivElement | null;
    const _light = hostEl.querySelector("#Light") as SVGElement | null;
    const _maskPoly = hostEl.querySelector(
      "#SunBeamMaskPoly",
    ) as SVGPolygonElement | null;
    const _sunBase = hostEl.querySelector("#Sun-base") as SVGEllipseElement | null;

    if (!_center || !_light || !_maskPoly || !_sunBase) return;

    const centerEl = _center;
    const lightEl = _light;
    const maskPoly = _maskPoly;
    const sunBase = _sunBase;

    const desktopGlowMq = window.matchMedia(
      "(min-width: 768px) and (pointer: fine)",
    );
    let desktopGlow = desktopGlowMq.matches;

    sunBase.style.fill = "#38bdf8";
    sunBase.style.transition = "fill 0.4s ease";

    let currentAngleRad = 0;
    let beamOnSun = false;

    function setLightRotation(angleDeg: number) {
      lightEl.style.transform = `rotate(${angleDeg}deg)`;
      maskPoly.setAttribute("transform", `rotate(${angleDeg} 190 680)`);
    }

    function setLightCenter() {
      setLightRotation(0);
      const pivot = svgUserToClient(
        svgClip,
        BEAM_PIVOT_SVG.x,
        BEAM_PIVOT_SVG.y,
      );
      if (pivot) {
        centerEl.style.position = "absolute";
        centerEl.style.left = `${pivot.x}px`;
        centerEl.style.top = `${pivot.y}px`;
      }
      const lampPt = svgUserToClient(
        svgClip,
        LIGHTHOUSE_LAMP_SVG.x,
        LIGHTHOUSE_LAMP_SVG.y,
      );
      const towerGlowDom = lighthouseGlowRef.current;
      if (lampPt && towerGlowDom) {
        towerGlowDom.style.left = `${lampPt.x}px`;
        towerGlowDom.style.top = `${lampPt.y}px`;
      }
    }

    function applyPointer(clientX: number, clientY: number) {
      lightEl.style.animation = "none";
      const rect = centerEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angleRad = Math.atan2(clientY - cy, clientX - cx);
      const angleDeg = (angleRad * 180) / Math.PI + 1;
      setLightRotation(angleDeg);
      currentAngleRad = angleRad;

      const diff = Math.abs(currentAngleRad - SUN_ANGLE_RAD) * (180 / Math.PI);
      const isHitting = diff < HIT_THRESHOLD_DEG;
      beamOnSun = isHitting;
    }

    function handleMouseMove(e: MouseEvent) {
      applyPointer(e.clientX, e.clientY);
      if (desktopGlow) {
        const g = cursorGlowRef.current;
        if (g) {
          g.style.left = `${e.clientX}px`;
          g.style.top = `${e.clientY}px`;
        }
      }
    }
    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length === 0) return;
      applyPointer(e.touches[0].clientX, e.touches[0].clientY);
    }
    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length === 0) return;
      applyPointer(e.touches[0].clientX, e.touches[0].clientY);
    }

    setLightCenter();
    lightEl.style.animation = "none";
    setLightRotation(-50);

    const onResize = () => setLightCenter();
    const onGlowMq = () => {
      desktopGlow = desktopGlowMq.matches;
    };
    desktopGlowMq.addEventListener("change", onGlowMq);
    window.addEventListener("resize", onResize);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchstart", handleTouchStart, { passive: true });

    const onClick = () => {
      if (beamOnSun) triggerDawn();
    };
    document.addEventListener("click", onClick);

    return () => {
      desktopGlowMq.removeEventListener("change", onGlowMq);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("click", onClick);
    };
  }, [svgReady, triggerDawn]);

  useEffect(() => {
    if (phase !== "dawn" && phase !== "done") return;
    const host = svgHostRef.current;
    if (!host) return;
    const lightEl = host.querySelector("#Light") as SVGElement | null;
    if (lightEl) {
      lightEl.style.transition = "opacity 1.2s ease";
      lightEl.style.opacity = "0";
    }
    const sunBase = host.querySelector("#Sun-base") as SVGEllipseElement | null;
    const sunLit = host.querySelector("#Sun-lit") as SVGEllipseElement | null;
    if (sunBase) {
      sunBase.style.transition = "fill 1.2s ease";
      sunBase.style.fill = "#fefaf1";
    }
    if (sunLit) {
      sunLit.style.transition = "opacity 1.2s ease";
      sunLit.style.opacity = "0";
    }
  }, [phase]);

  const isDawn = phase === "dawn" || phase === "done";

  return (
    <div
      ref={mountRef}
      className={`svg-study-game ${isDawn ? "svg-study-dawn" : ""}`}
    >
      <div ref={svgHostRef} className="svg-study-scene-host" aria-hidden />
      <div id="light_center" />
      {phase === "night" && (
        <>
          <div
            ref={lighthouseGlowRef}
            className="svg-study-lighthouse-glow"
            aria-hidden
          />
          <div
            ref={cursorGlowRef}
            className="svg-study-cursor-glow"
            aria-hidden
          />
        </>
      )}

      {isDawn && <div className="svg-study-dawn-overlay" aria-hidden />}

      <button
        type="button"
        className="svg-study-skip"
        onClick={() => onClear()}
      >
        スキップ →
      </button>
    </div>
  );
}
