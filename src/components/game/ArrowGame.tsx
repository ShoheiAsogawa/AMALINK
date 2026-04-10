"use client";

import { useEffect, useRef, useCallback } from "react";

interface ArrowGameProps {
  onClear: () => void;
}

export function ArrowGame({ onClear }: ArrowGameProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const initialized = useRef(false);
  const onClearRef = useRef(onClear);
  onClearRef.current = onClear;

  const initGame = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || initialized.current) return;
    const TweenMax = (window as any).TweenMax;
    const MorphSVGPlugin = (window as any).MorphSVGPlugin;
    if (!TweenMax || !MorphSVGPlugin) return;
    initialized.current = true;

    const cursor = svg.createSVGPoint();
    const arrows = svg.querySelector(".arrows")!;
    let randomAngle = 0;

    const target = { x: 900, y: 249.5 };
    const lineSegment = { x1: 875, y1: 280, x2: 925, y2: 220 };
    const pivot = { x: 100, y: 250 };

    function getMouseSVG(e: MouseEvent | TouchEvent) {
      const point = "touches" in e ? e.touches[0] : e;
      cursor.x = point.clientX;
      cursor.y = point.clientY;
      return cursor.matrixTransform(svg!.getScreenCTM()!.inverse());
    }

    function getIntersection(
      s1: { x1: number; y1: number; x2: number; y2: number },
      s2: { x1: number; y1: number; x2: number; y2: number },
    ) {
      const dx1 = s1.x2 - s1.x1;
      const dy1 = s1.y2 - s1.y1;
      const dx2 = s2.x2 - s2.x1;
      const dy2 = s2.y2 - s2.y1;
      const cx = s1.x1 - s2.x1;
      const cy = s1.y1 - s2.y1;
      const denom = dy2 * dx1 - dx2 * dy1;
      if (denom === 0) return null;
      const ua = (dx2 * cy - dy2 * cx) / denom;
      const ub = (dx1 * cy - dy1 * cx) / denom;
      return {
        x: s1.x1 + ua * dx1,
        y: s1.y1 + ua * dy1,
        segment1: ua >= 0 && ua <= 1,
        segment2: ub >= 0 && ub <= 1,
      };
    }

    function aim(e: MouseEvent | TouchEvent) {
      const point = getMouseSVG(e);
      point.x = Math.min(point.x, pivot.x - 7);
      point.y = Math.max(point.y, pivot.y + 7);
      const dx = point.x - pivot.x;
      const dy = point.y - pivot.y;
      const angle = Math.atan2(dy, dx) + randomAngle;
      const bowAngle = angle - Math.PI;
      const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 50);
      const scale = Math.min(Math.max(distance / 30, 1), 2);

      TweenMax.to(svg!.querySelector("#bow"), 0.3, {
        scaleX: scale,
        rotation: bowAngle + "rad",
        transformOrigin: "right center",
      });
      TweenMax.to(svg!.querySelector(".arrow-angle"), 0.3, {
        rotation: bowAngle + "rad",
        svgOrigin: "100 250",
      });
      TweenMax.to(svg!.querySelector(".arrow-angle use"), 0.3, {
        x: -distance,
      });
      TweenMax.to(svg!.querySelector("#bow polyline"), 0.3, {
        attr: {
          points:
            "88,200 " +
            Math.min(pivot.x - (1 / scale) * distance, 88) +
            ",250 88,300",
        },
      });

      const radius = distance * 9;
      const offset = {
        x: Math.cos(bowAngle) * radius,
        y: Math.sin(bowAngle) * radius,
      };
      const arcWidth = offset.x * 3;
      TweenMax.to(svg!.querySelector("#arc"), 0.3, {
        attr: {
          d:
            "M100,250c" +
            offset.x + "," + offset.y + "," +
            (arcWidth - offset.x) + "," + (offset.y + 50) + "," +
            arcWidth + ",50",
        },
        autoAlpha: distance / 60,
      });
    }

    function showMessage(selector: string) {
      TweenMax.killTweensOf(selector);
      TweenMax.killChildTweensOf(selector);
      TweenMax.set(selector, { autoAlpha: 1 });
      TweenMax.staggerFromTo(
        selector + " text", 0.5,
        { rotation: -5, scale: 0, transformOrigin: "center" },
        { scale: 1, ease: (window as any).Back.easeOut },
        0.08,
      );
      TweenMax.staggerTo(
        selector + " text", 0.3,
        { delay: 2, rotation: 20, scale: 0, ease: (window as any).Back.easeIn },
        0.05,
      );
    }

    function hitTest(tween: any) {
      const arrow = tween.target[0];
      const t = arrow._gsTransform;
      const rad = (t.rotation * Math.PI) / 180;
      const arrowSeg = {
        x1: t.x, y1: t.y,
        x2: Math.cos(rad) * 60 + t.x,
        y2: Math.sin(rad) * 60 + t.y,
      };
      const hit = getIntersection(arrowSeg, lineSegment);
      if (hit && hit.segment1 && hit.segment2) {
        tween.pause();
        const dx = hit.x - target.x;
        const dy = hit.y - target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const selector = dist < 7 ? ".loveyou" : ".hit";
        showMessage(selector);
        setTimeout(() => onClearRef.current(), 2800);
      }
    }

    function onMiss() {
      showMessage(".missyou");
    }

    function loose() {
      window.removeEventListener("mousemove", aim);
      window.removeEventListener("mouseup", loose);
      window.removeEventListener("touchmove", aim);
      window.removeEventListener("touchend", loose);

      TweenMax.to(svg!.querySelector("#bow"), 0.4, {
        scaleX: 1, transformOrigin: "right center",
        ease: (window as any).Elastic.easeOut,
      });
      TweenMax.to(svg!.querySelector("#bow polyline"), 0.4, {
        attr: { points: "88,200 88,250 88,300" },
        ease: (window as any).Elastic.easeOut,
      });

      const newArrow = document.createElementNS("http://www.w3.org/2000/svg", "use");
      newArrow.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#arrow");
      arrows.appendChild(newArrow);

      const path = MorphSVGPlugin.pathDataToBezier("#arc");
      TweenMax.to([newArrow], 0.5, {
        force3D: true,
        bezier: { type: "cubic", values: path, autoRotate: ["x", "y", "rotation"] },
        onUpdate: hitTest,
        onUpdateParams: ["{self}"],
        onComplete: onMiss,
        ease: (window as any).Linear.easeNone,
      });
      TweenMax.to(svg!.querySelector("#arc"), 0.3, { opacity: 0 });
      TweenMax.set(svg!.querySelector(".arrow-angle use"), { opacity: 0 });
    }

    function draw(e: MouseEvent | TouchEvent) {
      randomAngle = Math.random() * Math.PI * 0.03 - 0.015;
      TweenMax.to(svg!.querySelector(".arrow-angle use"), 0.3, { opacity: 1 });
      window.addEventListener("mousemove", aim);
      window.addEventListener("mouseup", loose);
      window.addEventListener("touchmove", aim, { passive: false });
      window.addEventListener("touchend", loose);
      aim(e);
    }

    aim({ clientX: 320, clientY: 300 } as MouseEvent);
    window.addEventListener("mousedown", draw);
    window.addEventListener("touchstart", draw, { passive: false });

    return () => {
      window.removeEventListener("mousedown", draw);
      window.removeEventListener("touchstart", draw);
      window.removeEventListener("mousemove", aim);
      window.removeEventListener("mouseup", loose);
      window.removeEventListener("touchmove", aim);
      window.removeEventListener("touchend", loose);
    };
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let attempts = 0;

    function tryInit() {
      if ((window as any).TweenMax && (window as any).MorphSVGPlugin) {
        cleanup = initGame() ?? undefined;
      } else if (attempts < 50) {
        attempts++;
        setTimeout(tryInit, 100);
      }
    }

    const s1 = document.createElement("script");
    s1.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.1/TweenMax.min.js";
    s1.onload = () => {
      const s2 = document.createElement("script");
      s2.src = "//s3-us-west-2.amazonaws.com/s.cdpn.io/16327/MorphSVGPlugin.min.js";
      s2.onload = tryInit;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);

    return () => cleanup?.();
  }, [initGame]);

  const FONT_SERIF = '"Zen Old Mincho", "Hiragino Mincho ProN", serif';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* 奄美の夜の海をイメージした背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071a2e] via-[#0c2744] to-[#0f3460]" />

      {/* 背景の波装飾 */}
      <svg className="absolute bottom-0 left-0 w-full h-[30%] opacity-10" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path fill="#0ea5e9" d="M0,80 Q300,20 600,80 Q900,140 1200,80 L1200,200 L0,200 Z" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-full h-[20%] opacity-15" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path fill="#38bdf8" d="M0,100 Q300,50 600,100 Q900,150 1200,100 L1200,200 L0,200 Z" />
      </svg>

      {/* 説明テキスト */}
      <p
        className="absolute top-6 left-1/2 -translate-x-1/2 text-sky-200/40 text-sm tracking-[0.15em] z-10"
        style={{ fontFamily: FONT_SERIF }}
      >
        弓を引いて、的を射て。
      </p>

      <svg
        ref={svgRef}
        id="game"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 400"
        overflow="visible"
        className="w-full h-full fixed top-0 left-0"
      >
        {/* 軌道グラデーション — 奄美ブルー */}
        <linearGradient id="ArcGradient">
          <stop offset="0" stopColor="#0ea5e9" stopOpacity=".3" />
          <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>
        <path
          id="arc"
          fill="none"
          stroke="url(#ArcGradient)"
          strokeWidth="4"
          d="M100,250c250-400,550-400,800,0"
          pointerEvents="none"
        />

        <defs>
          {/* 矢 — 奄美カラー */}
          <g id="arrow">
            <line x2="60" fill="none" stroke="#7dd3fc" strokeWidth="2" />
            <polygon fill="#38bdf8" points="64 0 58 2 56 0 58 -2" />
            <polygon fill="#10b981" points="2 -3 -4 -3 -1 0 -4 3 2 3 5 0" />
          </g>
        </defs>

        {/* 的 — 奄美ブルー + エメラルド */}
        <g id="target">
          <path fill="#e0f2fe" d="M924.2,274.2c-21.5,21.5-45.9,19.9-52,3.2c-4.4-12.1,2.4-29.2,14.2-41c11.8-11.8,29-18.6,41-14.2 C944.1,228.3,945.7,252.8,924.2,274.2z" />
          <path fill="#0ea5e9" d="M915.8,265.8c-14.1,14.1-30.8,14.6-36,4.1c-4.1-8.3,0.5-21.3,9.7-30.5s22.2-13.8,30.5-9.7 C930.4,235,929.9,251.7,915.8,265.8z" />
          <path fill="#e0f2fe" d="M908.9,258.9c-8,8-17.9,9.2-21.6,3.5c-3.2-4.9-0.5-13.4,5.6-19.5c6.1-6.1,14.6-8.8,19.5-5.6 C918.1,241,916.9,250.9,908.9,258.9z" />
          <path fill="#10b981" d="M903.2,253.2c-2.9,2.9-6.7,3.6-8.3,1.7c-1.5-1.8-0.6-5.4,2-8c2.6-2.6,6.2-3.6,8-2 C906.8,246.5,906.1,250.2,903.2,253.2z" />
        </g>

        {/* 弓 — 弦: 淡いブルー白 / 弓本体: エメラルドグリーン */}
        <g id="bow" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" pointerEvents="none">
          <polyline fill="none" stroke="#bae6fd" strokeLinecap="round" points="88,200 88,250 88,300" />
          <path fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" d="M88,300 c0-10.1,12-25.1,12-50s-12-39.9-12-50" />
        </g>

        <g className="arrow-angle">
          <use x="100" y="250" xlinkHref="#arrow" />
        </g>
        <clipPath id="mask">
          <polygon opacity=".5" points="0,0 1500,0 1500,200 970,290 950,240 925,220 875,280 890,295 920,310 0,350" pointerEvents="none" />
        </clipPath>
        <g className="arrows" clipPath="url(#mask)" pointerEvents="none" />

        {/* もう一回！ — ミス時 */}
        <g className="missyou" opacity="0" transform="translate(320, 200)">
          <text x="0"   y="0" fill="#94a3b8" fontSize="72" fontFamily={FONT_SERIF}>も</text>
          <text x="72"  y="0" fill="#94a3b8" fontSize="72" fontFamily={FONT_SERIF}>う</text>
          <text x="144" y="0" fill="#94a3b8" fontSize="72" fontFamily={FONT_SERIF}>一</text>
          <text x="216" y="0" fill="#94a3b8" fontSize="72" fontFamily={FONT_SERIF}>回</text>
          <text x="288" y="0" fill="#94a3b8" fontSize="72" fontFamily={FONT_SERIF}>！</text>
        </g>

        {/* 見事！ — 的の中心ヒット */}
        <g className="loveyou" opacity="0" transform="translate(350, 180)">
          <text x="0"   y="0" fill="#0ea5e9" fontSize="90" fontFamily={FONT_SERIF} fontWeight="700">見</text>
          <text x="90"  y="0" fill="#0ea5e9" fontSize="90" fontFamily={FONT_SERIF} fontWeight="700">事</text>
          <text x="180" y="0" fill="#38bdf8" fontSize="90" fontFamily={FONT_SERIF} fontWeight="700">！</text>
        </g>

        {/* 命中！ — ヒット */}
        <g className="hit" opacity="0" transform="translate(350, 180)">
          <text x="0"   y="0" fill="#10b981" fontSize="84" fontFamily={FONT_SERIF} fontWeight="500">命</text>
          <text x="84"  y="0" fill="#10b981" fontSize="84" fontFamily={FONT_SERIF} fontWeight="500">中</text>
          <text x="168" y="0" fill="#34d399" fontSize="84" fontFamily={FONT_SERIF} fontWeight="500">！</text>
        </g>
      </svg>

      {/* スキップボタン */}
      <button
        onClick={onClear}
        className="absolute bottom-8 right-8 text-sky-300/30 hover:text-sky-200/70 text-xs tracking-[0.1em] transition-colors cursor-pointer z-10"
        style={{ fontFamily: FONT_SERIF }}
      >
        スキップ →
      </button>
    </div>
  );
}
