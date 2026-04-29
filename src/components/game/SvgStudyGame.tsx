"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./svg-study-gateway.css";

interface SvgStudyGameProps {
  onClear: () => void;
}

/** ポインタ未到達時のビーム向き（以前の CSS rotate(-50deg)+1° 補正に相当） */
const INITIAL_BEAM_RAD = ((-50 - 1) * Math.PI) / 180;

/**
 * タップ判定用の楕円（Clipping_Mask のユーザ座標）。
 * #Sun_Rings 最外周（cx≈962.5, cy≈621.5, rx≈429.5, ry≈384）を覆い、特に上側のリング／ハロを取りこぼさない。
 */
const SUN_TAP_ZONE = { cx: 962.5, cy: 621.5, rx: 438, ry: 392 };

/**
 * #SunTapText（scene.svg: x≈963, y≈454, font-size 92）＋ stroke / letter-spacing 分の余白。
 * 楕円判定だけだと文字周りが端で外れることがあるため矩形を併用する。
 */
const SUN_TAP_TEXT_BOUNDS = {
  minX: 792,
  maxX: 1134,
  minY: 392,
  maxY: 518,
};

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

/** カーソル位置のスポットから動物までの距離 → 不透明度（ハロ付近までフェード） */
function opacityFromSpotDistance(dist: number): number {
  const inner = BEAM_SPOT_CORE_R + 22;
  const outer = BEAM_SPOT_HALO_R + 56;
  if (dist <= inner) return 1;
  if (dist >= outer) return 0;
  const t = (dist - inner) / (outer - inner);
  const s = t * t * (3 - 2 * t);
  return 1 - s;
}

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

function sunTapPointInEllipse(svgX: number, svgY: number): boolean {
  const { cx, cy, rx, ry } = SUN_TAP_ZONE;
  if (rx <= 0 || ry <= 0) return false;
  const dx = (svgX - cx) / rx;
  const dy = (svgY - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

function sunTapPointInTextBounds(svgX: number, svgY: number): boolean {
  const { minX, maxX, minY, maxY } = SUN_TAP_TEXT_BOUNDS;
  return (
    svgX >= minX &&
    svgX <= maxX &&
    svgY >= minY &&
    svgY <= maxY
  );
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
    const animalRoots = Array.from(
      svgClip.querySelectorAll(".svg-study-hidden-animal-root"),
    ) as SVGGElement[];

    function updateAnimalOpacities(spotCx: number, spotCy: number) {
      for (const root of animalRoots) {
        const ax = Number(root.getAttribute("data-ax"));
        const ay = Number(root.getAttribute("data-ay"));
        if (Number.isNaN(ax) || Number.isNaN(ay)) continue;
        const d = Math.hypot(spotCx - ax, spotCy - ay);
        const op = opacityFromSpotDistance(d);
        root.setAttribute("opacity", String(op));
        const rect = root.querySelector("rect");
        if (rect)
          rect.setAttribute("pointer-events", op > 0.06 ? "all" : "none");
      }
    }

    sunBase.style.fill = "#38bdf8";
    sunBase.style.transition = "fill 0.4s ease";

    /** 直近ポインタ位置（SVG ユーザ座標）。ビーム先端＝この点。 */
    let lastPointerSvg: { x: number; y: number } | null = null;
    let beamOnSun = false;
    let lastClientX = 0;
    let lastClientY = 0;
    let hasLastClient = false;

    /** ビームが太陽タップ可能域を指しているか（中心角度ではなく「当たり位置」で判定） */
    function syncBeamOnSun() {
      if (!lastPointerSvg) {
        beamOnSun = false;
        return;
      }
      const { x, y } = lastPointerSvg;
      beamOnSun =
        sunTapPointInEllipse(x, y) || sunTapPointInTextBounds(x, y);
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
      updateAnimalOpacities(geom.spotCx, geom.spotCy);
    }

    const hopCleanups: Array<() => void> = [];
    for (const hop of svgClip.querySelectorAll(".svg-study-hidden-animal-hop-target")) {
      if (!(hop instanceof SVGGElement)) continue;
      const onEnter = () => {
        hop.classList.remove("svg-study-animal-hop");
        void hop.getBoundingClientRect();
        hop.classList.add("svg-study-animal-hop");
      };
      const onAnimEnd = () => {
        hop.classList.remove("svg-study-animal-hop");
      };
      hop.addEventListener("pointerenter", onEnter);
      hop.addEventListener("animationend", onAnimEnd);
      hopCleanups.push(() => {
        hop.removeEventListener("pointerenter", onEnter);
        hop.removeEventListener("animationend", onAnimEnd);
      });
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
      lastClientX = clientX;
      lastClientY = clientY;
      hasLastClient = true;
      const svgCoords = clientToSvgUser(svgClip, clientX, clientY);
      if (!svgCoords) return;
      lastPointerSvg = svgCoords;
      applyBeamGeometry(buildBeamGeometry(svgCoords.x, svgCoords.y));
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
      lastPointerSvg = { x: defaultTx, y: defaultTy };
      applyBeamGeometry(buildBeamGeometry(defaultTx, defaultTy));
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
      /* クリック／タップ座標でビームを先に合わせる（直前の mousemove だけだと TAP や端がずれる） */
      applyPointer(clientX, clientY);
      if (!beamOnSun) return;
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
      hopCleanups.forEach((fn) => {
        fn();
      });
    };
  }, [svgReady, triggerDawn]);

  useEffect(() => {
    if (phase !== "dawn" && phase !== "done") return;
    const host = svgHostRef.current;
    if (!host) return;
    const beamStack = host.querySelector(
      "#LighthouseBeamStack",
    ) as SVGGElement | null;
    const animalsLayer = host.querySelector(
      "#HiddenAnimalsLayer",
    ) as SVGGElement | null;
    if (beamStack) {
      beamStack.style.transition = "opacity 1.2s ease";
      beamStack.style.opacity = "0";
    }
    if (animalsLayer) {
      animalsLayer.style.transition = "opacity 1.2s ease";
      animalsLayer.style.opacity = "0";
    }
    const sunBase = host.querySelector("#Sun-base") as SVGEllipseElement | null;
    const sunLit = host.querySelector("#Sun-lit") as SVGEllipseElement | null;
    /** 上昇中の太陽はビームが当たる帯（#Sun-lit）と同じ色に統一 */
    const sunLitFill = "#f3b21a";
    if (sunBase) {
      sunBase.style.transition = "fill 2.2s ease-out";
      sunBase.style.fill = sunLitFill;
    }
    if (sunLit) {
      sunLit.style.transition = "opacity 2.2s ease-out";
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
