"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./svg-study-gateway.css";

interface SvgStudyGameProps {
  onClear: () => void;
}

function getRandomInt(min: number, max: number) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(Math.random() * (hi - lo) + lo);
}

export function SvgStudyGame({ onClear }: SvgStudyGameProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const svgHostRef = useRef<HTMLDivElement>(null);
  const onClearRef = useRef(onClear);
  onClearRef.current = onClear;

  const [showWin, setShowWin] = useState(false);
  const [svgReady, setSvgReady] = useState(false);
  const clearedRef = useRef(false);
  const mouseBoundRef = useRef(false);

  const scheduleClear = useCallback(() => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    setShowWin(true);
    window.setTimeout(() => onClearRef.current(), 2600);
  }, []);

  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    let cancelled = false;

    (async () => {
      const res = await fetch("/svg-study/scene.svg");
      const text = await res.text();
      if (cancelled || !svgHostRef.current) return;
      svgHostRef.current.innerHTML = text;
      setSvgReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!svgReady) return;
    const root = mountRef.current;
    const host = svgHostRef.current;
    if (!root || !host || !host.querySelector("#Clipping_Mask")) return;

    const hostEl = host;

    const boat = hostEl.querySelector("#Boat") as SVGGElement | null;
    const svgRoot = hostEl.querySelector("#Clipping_Mask") as SVGSVGElement | null;
    if (!boat || !svgRoot || svgRoot.children.length < 2) return;

    const mainGroup = svgRoot.children[1] as SVGGElement;
    const clippingmaskcontainer = svgRoot;
    const center = root.querySelector("#light_center") as HTMLDivElement | null;
    const hand = hostEl.querySelector("#Light") as SVGElement | null;
    const sun = hostEl.querySelector("#Sun") as SVGGElement | null;

    if (!center || !hand || !sun) return;

    const lightEl = hand;
    const sunEl = sun;
    const centerEl = center;

    function setLightCenter() {
      lightEl.style.transform = "rotate(0deg)";
      const lh = hostEl.querySelector("#Lighthouse");
      if (!lh) return;
      const bbox = lh.getBoundingClientRect();
      centerEl.style.top = `calc(${bbox.top}px + 5.6vw)`;
      centerEl.style.left = `calc(${bbox.left}px + 1.2vw)`;
    }

    function resetAnimation() {
      lightEl.style.transform = "rotate(0deg)";
      lightEl.style.animation = "svg-study-rotate 10s linear infinite";
    }

    function handleMouseMove(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target || !clippingmaskcontainer.contains(target)) {
        resetAnimation();
      } else {
        lightEl.style.animation = "none";
        const rect = centerEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle =
          (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) / Math.PI + 1;
        lightEl.style.transform = `rotate(${angle}deg)`;
      }
    }

    setLightCenter();
    resetAnimation();

    const onResize = () => setLightCenter();
    window.addEventListener("resize", onResize);

    const onSunClick = () => {
      const dup = boat.cloneNode(true) as SVGGElement;
      mainGroup.insertBefore(dup, boat.nextSibling);
      dup.style.transform = `translateY(${getRandomInt(-20, 120)}px)`;
      window.setTimeout(() => dup.classList.add("translated"), 100);
      window.setTimeout(() => dup.remove(), 20000);

      if (!mouseBoundRef.current) {
        mouseBoundRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
      }

      scheduleClear();
    };

    sunEl.addEventListener("click", onSunClick);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", handleMouseMove);
      sunEl.removeEventListener("click", onSunClick);
    };
  }, [svgReady, scheduleClear]);

  return (
    <div ref={mountRef} className="svg-study-game">
      <div ref={svgHostRef} className="absolute inset-0" aria-hidden />

      <div id="light_center" />

      <div className="grid-container svg-study-hero">
        <div className="svg-study-hero-inner">
          <p className="lead">AMALINK</p>
          <p className="title">
            夕陽をタップして、
            <br />
            島の灯を灯してください。
          </p>
        </div>
      </div>

      {showWin && (
        <div className="svg-study-win" aria-live="polite">
          <div className="svg-study-win-inner">
            <p className="win-main">見事！</p>
            <p className="win-sub">灯がともりました</p>
          </div>
        </div>
      )}

      <button type="button" className="svg-study-skip" onClick={() => onClear()}>
        スキップ →
      </button>

      <p className="svg-study-footer">奄美から、未来へ。</p>
    </div>
  );
}
