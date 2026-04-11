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
/** ポインタ未到達時のビーム向き（以前の CSS rotate(-50deg)+1° 補正に相当） */
const INITIAL_BEAM_RAD = ((-50 - 1) * Math.PI) / 180;

/**
 * タップ判定用の楕円（Clipping_Mask のユーザ座標）。
 * #Sun-base(rx≈290, ry≈260) より広く、手前に描かれる #Sun_Rings の上部ハロを含める。
 */
const SUN_TAP_ZONE = { cx: 963.06, cy: 621, rx: 348, ry: 336 };

/** 灯台ビームの回転中心（台形の根元・旧 CSS transform-origin と一致） */
const BEAM_PIVOT_SVG = { x: 190, y: 680 };
/** 根元から灯口付近まで（台形の手前側） */
const BEAM_D_NEAR = 4;
/** 灯口付近の半幅（全体幅 ≈ 2×） */
const BEAM_W_NEAR = 4.5;
/** 遠方端の半幅（フルフレア、全体幅 ≈ 2×） */
const BEAM_W_FAR_MAX = 522;
/**
 * 灯口 N から先へ、軸方向に伸ばす固定長（ユーザ座標）。
 * viewBox より十分長くし、常に画面外までビームが届く見え方にする。
 */
const BEAM_SHAFT_LENGTH = 5800;
/** 線形グラデの軸：灯口より少し手前〜先端より先まで伸ばし、途切れをなめらかに */
const BEAM_GRAD_BACK = 36;
const BEAM_GRAD_FWD = 320;
/** カーソル位置のスポット円（SVG ユーザ座標の半径）— scene.svg の r と揃える */
const BEAM_SPOT_CORE_R = 56;
const BEAM_SPOT_HALO_R = 132;
/** 灯台上の光源ランプ付近（scene.svg の灯台内 ellipse） */
const LIGHTHOUSE_LAMP_SVG = { x: 187.5, y: 663.75 };

interface BeamGeometry {
  points: string;
  gradX1: number;
  gradY1: number;
  gradX2: number;
  gradY2: number;
  spotCx: number;
  spotCy: number;
}

function svgUserToClient(svg: SVGSVGElement, x: number, y: number) {
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  return pt.matrixTransform(ctm);
}

function clientToSvgUser(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } | null {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  try {
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  } catch {
    return null;
  }
}

/**
 * カーソルは「向き」と「スポットの中心」のみ。ビーム本体は軸方向に固定長で画面外まで伸ばす。
 */
function buildBeamGeometry(targetX: number, targetY: number): BeamGeometry {
  const { x: Px, y: Py } = BEAM_PIVOT_SVG;
  let dx = targetX - Px;
  let dy = targetY - Py;
  let len = Math.hypot(dx, dy);
  if (len < 1e-6) {
    dx = 1;
    dy = 0;
    len = 1;
  }
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;

  const Nx = Px + ux * BEAM_D_NEAR;
  const Ny = Py + uy * BEAM_D_NEAR;

  const spotCx = targetX;
  const spotCy = targetY;

  const wTip = BEAM_W_FAR_MAX;
  const Fx = Nx + ux * BEAM_SHAFT_LENGTH;
  const Fy = Ny + uy * BEAM_SHAFT_LENGTH;

  const nlx = Nx + px * BEAM_W_NEAR;
  const nly = Ny + py * BEAM_W_NEAR;
  const nrx = Nx - px * BEAM_W_NEAR;
  const nry = Ny - py * BEAM_W_NEAR;
  const frx = Fx - px * wTip;
  const fry = Fy - py * wTip;
  const flx = Fx + px * wTip;
  const fly = Fy + py * wTip;

  const points = `${nlx} ${nly} ${nrx} ${nry} ${frx} ${fry} ${flx} ${fly}`;
  const gradX1 = Nx - ux * BEAM_GRAD_BACK;
  const gradY1 = Ny - uy * BEAM_GRAD_BACK;
  const gradX2 = Fx + ux * BEAM_GRAD_FWD;
  const gradY2 = Fy + uy * BEAM_GRAD_FWD;

  return {
    points,
    gradX1,
    gradY1,
    gradX2,
    gradY2,
    spotCx,
    spotCy,
  };
}

/** 画面上の座標が太陽タップ域（リング含む）に入っているか */
function clientPointInSunTapZone(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): boolean {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return false;
  let inv: DOMMatrix;
  try {
    inv = ctm.inverse();
  } catch {
    return false;
  }
  const p = pt.matrixTransform(inv);
  const { cx, cy, rx, ry } = SUN_TAP_ZONE;
  if (rx <= 0 || ry <= 0) return false;
  const dx = (p.x - cx) / rx;
  const dy = (p.y - cy) / ry;
  return dx * dx + dy * dy <= 1;
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
    const ripples = host.querySelector("#SunTapRippleLayer") as SVGGElement | null;
    if (!layer) return;
    const vis = phase === "night" ? "visible" : "hidden";
    layer.setAttribute("visibility", vis);
    ripples?.setAttribute("visibility", vis);
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
    const _light = hostEl.querySelector("#Light") as SVGPolygonElement | null;
    const _maskPoly = hostEl.querySelector(
      "#SunBeamMaskPoly",
    ) as SVGPolygonElement | null;
    const _sunBase = hostEl.querySelector("#Sun-base") as SVGEllipseElement | null;

    if (!_center || !_light || !_maskPoly || !_sunBase) return;

    const centerEl = _center;
    const lightEl = _light;
    const maskPoly = _maskPoly;
    const sunBase = _sunBase;
    const beamFillGrad = svgClip.querySelector(
      "#lighthouse-beam-fill-dynamic",
    ) as SVGLinearGradientElement | null;
    const beamMaskGrad = svgClip.querySelector(
      "#lighthouse-beam-mask-dynamic",
    ) as SVGLinearGradientElement | null;
    const beamSpotHalo = svgClip.querySelector(
      "#BeamSpotHalo",
    ) as SVGCircleElement | null;
    const beamSpotCore = svgClip.querySelector(
      "#BeamSpotCore",
    ) as SVGCircleElement | null;
    sunBase.style.fill = "#38bdf8";
    sunBase.style.transition = "fill 0.4s ease";

    let currentAngleRad = 0;
    let beamOnSun = false;
    let lastClientX = 0;
    let lastClientY = 0;
    let hasLastClient = false;

    function syncBeamOnSun() {
      const diff =
        Math.abs(currentAngleRad - SUN_ANGLE_RAD) * (180 / Math.PI);
      beamOnSun = diff < HIT_THRESHOLD_DEG;
    }

    function applyBeamGeometry(geom: BeamGeometry) {
      lightEl.setAttribute("points", geom.points);
      maskPoly.setAttribute("points", geom.points);
      lightEl.style.transform = "none";
      maskPoly.removeAttribute("transform");
      const gx = (g: SVGLinearGradientElement | null) => {
        if (!g) return;
        g.setAttribute("x1", String(geom.gradX1));
        g.setAttribute("y1", String(geom.gradY1));
        g.setAttribute("x2", String(geom.gradX2));
        g.setAttribute("y2", String(geom.gradY2));
      };
      gx(beamFillGrad);
      gx(beamMaskGrad);
      const sx = String(geom.spotCx);
      const sy = String(geom.spotCy);
      if (beamSpotHalo) {
        beamSpotHalo.setAttribute("cx", sx);
        beamSpotHalo.setAttribute("cy", sy);
        beamSpotHalo.setAttribute("r", String(BEAM_SPOT_HALO_R));
      }
      if (beamSpotCore) {
        beamSpotCore.setAttribute("cx", sx);
        beamSpotCore.setAttribute("cy", sy);
        beamSpotCore.setAttribute("r", String(BEAM_SPOT_CORE_R));
      }
    }

    function updateBeamFromClient(clientX: number, clientY: number) {
      const svgCoords = clientToSvgUser(svgClip, clientX, clientY);
      if (!svgCoords) return;
      applyBeamGeometry(buildBeamGeometry(svgCoords.x, svgCoords.y));
    }

    function setLightCenter() {
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
      currentAngleRad = angleRad;
      lastClientX = clientX;
      lastClientY = clientY;
      hasLastClient = true;
      updateBeamFromClient(clientX, clientY);
      syncBeamOnSun();
    }

    function moveCursorGlow(clientX: number, clientY: number) {
      const g = cursorGlowRef.current;
      if (g) {
        g.style.left = `${clientX}px`;
        g.style.top = `${clientY}px`;
      }
    }

    function handleMouseMove(e: MouseEvent) {
      applyPointer(e.clientX, e.clientY);
      moveCursorGlow(e.clientX, e.clientY);
    }
    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      applyPointer(t.clientX, t.clientY);
      moveCursorGlow(t.clientX, t.clientY);
    }
    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      applyPointer(t.clientX, t.clientY);
      moveCursorGlow(t.clientX, t.clientY);
    }

    setLightCenter();
    lightEl.style.animation = "none";
    {
      const defaultLen = 3000;
      const defaultTx =
        BEAM_PIVOT_SVG.x + Math.cos(INITIAL_BEAM_RAD) * defaultLen;
      const defaultTy =
        BEAM_PIVOT_SVG.y + Math.sin(INITIAL_BEAM_RAD) * defaultLen;
      applyBeamGeometry(buildBeamGeometry(defaultTx, defaultTy));
      currentAngleRad = INITIAL_BEAM_RAD;
      syncBeamOnSun();
    }

    const onResize = () => {
      setLightCenter();
      if (hasLastClient) {
        applyPointer(lastClientX, lastClientY);
      }
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchstart", handleTouchStart, { passive: true });

    function tryClearSunTap(clientX: number, clientY: number) {
      if (!beamOnSun) return;
      if (!clientPointInSunTapZone(svgClip, clientX, clientY)) return;
      triggerDawn();
    }

    const onClick = (e: MouseEvent) => {
      tryClearSunTap(e.clientX, e.clientY);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0) return;
      const t = e.changedTouches[0];
      tryClearSunTap(t.clientX, t.clientY);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      tryClearSunTap(e.clientX, e.clientY);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("click", onClick);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [svgReady, triggerDawn]);

  useEffect(() => {
    if (phase !== "dawn" && phase !== "done") return;
    const host = svgHostRef.current;
    if (!host) return;
    const beamStack = host.querySelector(
      "#LighthouseBeamStack",
    ) as SVGGElement | null;
    if (beamStack) {
      beamStack.style.transition = "opacity 1.2s ease";
      beamStack.style.opacity = "0";
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
