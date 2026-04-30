"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";
import { colorMix, squirclePath } from "@/lib/chunkySquircle";

export type ChunkyTheme = "neu" | "primary" | "blue";

/** script.js の HEX ペアに相当（薄い面 / 影側） */
const THEMES: Record<ChunkyTheme, { hb: string; hd: string }> = {
  neu: { hb: "fafafa", hd: "94a3b8" },
  primary: { hb: "1e293b", hd: "0f172a" },
  blue: { hb: "0ea5e9", hd: "0369a1" },
};

type ChromeProps = {
  theme: ChunkyTheme;
  block?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

function ChunkyChrome({ theme, block, disabled, children }: ChromeProps) {
  const uid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(260);
  const [pressed, setPressed] = useState(false);

  const h = 46;
  const scale = h / 40;
  const floating = false;
  const p = disabled ? 0 : pressed ? 1 : 0;

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const ox = el.offsetWidth;
      if (ox > 0) setCw(ox);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { hb, hd } = THEMES[theme];
  const color = colorMix;
  const hi = color(hb, 70, "white");
  const sh = color(hd, 35, "black");
  const whiteFace = theme === "neu";
  const coloredFace = theme !== "neu";

  const w = Math.max(96, Math.round(cw / scale - 10));
  const baseY = 12;
  const faceY = 4 + p * 5;
  const z = Math.min(0.5, 20 / w);

  /** viewBox 高さ 60 のうち、フェイス（高さ 40）の縦方向の中心 — script.js の text y={20+faceY} と同じ基準 */
  const faceCenterY = faceY + 20;
  const labelTopPct = (faceCenterY / 60) * 100;

  const dy = floating ? 24 - p * 12 : 4 - p * 2;
  const std = floating ? 12 - p * 6 : 3 - p * 1.5;
  const op = floating ? 0.15 : 0.3;

  const vbW = w + 10;

  return (
    <div
      ref={wrapRef}
      className={cn(
        /* block + w-full: 子がすべて absolute でも親が横幅を失わない（inline-flex だと幅 0 で文字が縦に崩れる） */
        "relative block min-h-0 min-w-[9.5rem] w-full select-none [-webkit-tap-highlight-color:transparent] sm:min-w-[11rem]",
        block && "max-w-full"
      )}
      style={{
        height: `${60 * scale}px`,
      }}
      onPointerDown={() => {
        if (!disabled) setPressed(true);
      }}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${vbW} 60`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id={`bf${uid}`} x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow dy={dy} stdDeviation={std} floodColor={sh} floodOpacity={op} />
          </filter>
          <linearGradient id={`gf${uid}`}>
            <stop offset="0" stopColor={color(hd, 65, "white")} />
            <stop offset={z} stopColor={color(hd, 90, "white")} />
            <stop offset={1 - z} stopColor={color(hd, 90, "white")} />
            <stop offset="1" stopColor={color(hd, 65, "white")} />
          </linearGradient>
        </defs>
        <path
          d={squirclePath(w, 40, 18, 5, baseY)}
          fill={color(hd, 60, "black")}
          filter={`url(#bf${uid})`}
        />
        <path
          d={squirclePath(w, 40, 18, 5, baseY)}
          fill={color(hd, 80, "black")}
          stroke={floating ? hi : color(hd, 50, "black")}
          strokeWidth={1}
        />
        {Array.from({ length: Math.max(0, baseY - faceY) }).map((_, k) => (
          <path
            key={k}
            d={squirclePath(w, 40, 18, 5, faceY + 1 + k)}
            fill={`url(#gf${uid})`}
          />
        ))}
        <path
          d={squirclePath(w, 40, 18, 5, faceY)}
          fill={whiteFace ? "#fafafa" : `#${hb}`}
          stroke={whiteFace ? "#e2e8f0" : hi}
          strokeWidth={1.5}
        />
      </svg>
      <span
        className={cn(
          /* [&_svg]/[&_img]:block … インライン置換要素のベースライン下ギャップでアイコンだけ下に見えるのを防ぐ */
          "pointer-events-none absolute inset-x-0 z-[2] flex flex-row flex-nowrap items-center justify-center py-0 [&_img]:block [&_svg]:block [&_svg]:shrink-0",
          coloredFace
            ? "gap-3 px-5 text-[15px] font-bold tracking-wider text-white sm:px-7 sm:text-[18px]"
            : "gap-2 px-4 text-[14px] font-medium tracking-wide text-slate-800 sm:gap-2.5 sm:px-6 sm:text-[17px]"
        )}
        style={{
          top: `${labelTopPct}%`,
          transform: "translateY(-50%)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

type BtnProps = {
  theme?: ChunkyTheme;
  block?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function ChunkyButton({
  theme = "neu",
  block,
  className,
  children,
  type = "button",
  disabled,
  ...rest
}: BtnProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "flex min-h-0 min-w-0 border-0 bg-transparent p-0 font-sans [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-sky-400/50",
        block && "w-full",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
      {...rest}
    >
      <ChunkyChrome theme={theme} block={block} disabled={!!disabled}>
        {children}
      </ChunkyChrome>
    </button>
  );
}

type AnchorProps = {
  theme?: ChunkyTheme;
  block?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">;

export function ChunkyAnchor({ theme = "neu", block, className, children, ...rest }: AnchorProps) {
  return (
    <a
      className={cn(
        "inline-flex max-w-full min-h-0 min-w-0 cursor-pointer font-sans text-inherit no-underline [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-sky-400/50",
        block && "w-full",
        className
      )}
      {...rest}
    >
      <ChunkyChrome theme={theme} block={block}>
        {children}
      </ChunkyChrome>
    </a>
  );
}

type NextProps = {
  theme?: ChunkyTheme;
  block?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<LinkProps, "className"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href">;

export function ChunkyNextLink({ theme = "neu", block, className, children, ...rest }: NextProps) {
  return (
    <Link
      className={cn(
        "inline-flex max-w-full min-h-0 min-w-0 cursor-pointer font-sans text-inherit no-underline [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-sky-400/50",
        block && "w-full",
        className
      )}
      {...rest}
    >
      <ChunkyChrome theme={theme} block={block}>
        {children}
      </ChunkyChrome>
    </Link>
  );
}
