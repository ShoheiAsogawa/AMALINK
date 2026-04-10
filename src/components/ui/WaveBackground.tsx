import { useId } from "react";

interface WaveBackgroundProps {
  color?: "blue" | "blue-light" | "blue-dark" | "green" | "mixed";
  position?: "top" | "bottom" | "full";
  opacity?: number;
  /** 横方向にシームレスで 1 周するまでの秒数（CSS animation-duration にそのまま渡す） */
  speed?: number;
  className?: string;
}

export function WaveBackground({
  color = "blue",
  position = "bottom",
  opacity = 0.15,
  speed = 30,
  className = "",
}: WaveBackgroundProps) {
  const uniqueId = useId();

  const getGradientColors = () => {
    switch (color) {
      case "blue-dark":
        return { start: "#0369a1", end: "#0369a1" };
      case "blue-light":
        return { start: "#7dd3fc", end: "#7dd3fc" };
      case "green":
        return { start: "#10b981", end: "#10b981" };
      case "mixed":
        return { start: "#0ea5e9", end: "#10b981" };
      default:
        return { start: "#0ea5e9", end: "#0ea5e9" };
    }
  };

  const colors = getGradientColors();
  const gradientId = `wave-${color}-${uniqueId}`;

  const positionClasses = {
    top: "top-0",
    bottom: "bottom-0",
    full: "top-1/2 -translate-y-1/2",
  };

  return (
    <div
      className={`absolute left-0 right-0 ${positionClasses[position]} h-[50vh] overflow-hidden pointer-events-none ${className}`}
    >
      <div
        className="absolute inset-0 w-[200%] h-full"
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
          animationName: "wave-bg-drift",
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        <svg viewBox="0 0 2400 320" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.start} stopOpacity={opacity} />
              <stop offset="100%" stopColor={colors.end} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${gradientId})`}
            d="M0,160 Q300,100 600,160 Q900,220 1200,160 Q1500,100 1800,160 Q2100,220 2400,160 L2400,320 L0,320 Z"
          />
        </svg>
      </div>
    </div>
  );
}
