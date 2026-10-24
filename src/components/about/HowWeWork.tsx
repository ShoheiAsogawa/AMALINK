import { MessagesSquare, PencilLine, RefreshCw } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "./Reveal";

const TEAL = "#188a8c";

const STEPS: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "改善案をもらう",
    body: "実際に使っている方から、「ここが分かりにくい」「こうだと助かる」という声をその場で伺います。",
    icon: <MessagesSquare className="relative h-5 w-5" strokeWidth={2} aria-hidden />,
  },
  {
    title: "すぐに反映する",
    body: "いただいた案は持ち帰って寝かせず、できるだけその場で形にして、動くものを見ていただきます。",
    icon: <PencilLine className="relative h-5 w-5" strokeWidth={2} aria-hidden />,
  },
  {
    title: "また改善する",
    body: "直したものを触っていただき、次の気づきをもらいます。このくり返しで、現場に合う形に仕上げていきます。",
    icon: <RefreshCw className="relative h-5 w-5" strokeWidth={2} aria-hidden />,
  },
];

/* 循環図の座標（viewBox 400×360）。丸は輪の上に 120° ずつ置く。 */
const W = 400;
const H = 360;
const CX = 200;
const CY = 205;
const R = 125;
const NODE_DEG = [-90, 30, 150];
const ARROW_DEG = [-30, 90, 210];
/* 輪は 0.2s から 1.5s で一周描く（how-we-work.css と合わせる） */
const DRAW_START = 0.2;
const DRAW_DUR = 1.5;
const at = (deg: number) => DRAW_START + (((deg + 90) % 360) / 360) * DRAW_DUR;
const pt = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
};
const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;
const delay = (s: number) => ({ "--d": `${s.toFixed(2)}s` }) as CSSProperties;

function IconCircle({
  children,
  size = "h-14 w-14",
  flashIndex,
}: {
  children: ReactNode;
  size?: string;
  flashIndex?: number;
}) {
  return (
    <span
      className={`relative flex ${size} shrink-0 items-center justify-center rounded-full text-white shadow-[0_10px_24px_-12px_rgba(24,138,140,0.7)]`}
      style={{ backgroundColor: TEAL }}
      aria-hidden
    >
      {flashIndex !== undefined && (
        <span
          className="fde-flash pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_40%,#5eead4_0%,#22b8b0_55%,#188a8c_100%)] shadow-[0_0_0_6px_rgba(45,212,191,0.18),0_0_28px_6px_rgba(45,212,191,0.45)]"
          style={{ "--k": flashIndex } as CSSProperties}
        />
      )}
      {children}
    </span>
  );
}

function CycleDiagram() {
  const label = `改善の流れ：${STEPS.map((s) => s.title).join("→")}→はじめに戻ってくり返す`;
  const top = pt(-90);
  return (
    <Reveal className="relative mx-auto w-full max-w-[400px]">
      <div role="img" aria-label={label} className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <radialGradient id="fde-glow">
              <stop offset="0%" stopColor="#5eead4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle
            className="fde-ring"
            cx={CX}
            cy={CY}
            r={R}
            pathLength={1}
            transform={`rotate(-90 ${CX} ${CY})`}
            fill="none"
            stroke={TEAL}
            strokeOpacity={0.3}
            strokeWidth={2}
          />
          {ARROW_DEG.map((deg) => {
            const p = pt(deg);
            return (
              <g key={deg} className="fde-fade" style={delay(at(deg))}>
                <path
                  d="M-5 -7 L4 0 L-5 7"
                  fill="none"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform={`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${deg + 90})`}
                />
              </g>
            );
          })}
          {/* 輪の上を回る光の点と、その後ろの尾 */}
          <g className="fde-orbit">
            {[
              [0.1, 0.12],
              [0.06, 0.28],
              [0.03, 0.55],
            ].map(([len, op]) => (
              <circle
                key={len}
                cx={CX}
                cy={CY}
                r={R}
                pathLength={1}
                transform={`rotate(-90 ${CX} ${CY})`}
                fill="none"
                stroke="#2dd4bf"
                strokeOpacity={op}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={`${len} ${1 - len!}`}
                strokeDashoffset={len}
              />
            ))}
            <circle cx={top.x} cy={top.y} r={14} fill="url(#fde-glow)" />
            <circle cx={top.x} cy={top.y} r={4} fill="#ffffff" stroke="#2dd4bf" strokeWidth={2} />
          </g>
        </svg>

        <div
          className="fde-pop absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center font-sans"
          style={{ left: pct(CX, W), top: pct(CY, H), ...delay(1.5) }}
          aria-hidden
        >
          <span className="whitespace-nowrap text-xs tracking-[0.12em] text-slate-500 md:text-[13px]">スピード感を持って</span>
          <span className="mt-1 whitespace-nowrap font-serif text-xl font-bold text-brand-gradient md:text-2xl">くり返す</span>
        </div>

        {STEPS.map((s, i) => {
          const deg = NODE_DEG[i]!;
          const p = pt(deg);
          const isTop = i === 0;
          return (
            <div key={s.title} aria-hidden>
              {/* 位置決め（translate）と出現の動き（transform）は別の要素に分ける */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: pct(p.x, W), top: pct(p.y, H) }}>
                <div className="fde-pop" style={delay(at(deg))}>
                  <IconCircle flashIndex={i}>{s.icon}</IconCircle>
                </div>
              </div>
              <span
                className="fde-pop absolute w-[7.5rem] -translate-x-1/2 text-center font-sans text-[13px] font-bold leading-snug tracking-wide text-slate-700 md:w-[8.5rem] md:text-sm"
                style={{
                  ...(isTop
                    ? { left: pct(p.x, W), bottom: `calc(${pct(H - p.y, H)} + 2.25rem)` }
                    : { left: pct(p.x, W), top: `calc(${pct(p.y, H)} + 2.25rem)` }),
                  ...delay(at(deg) + 0.1),
                }}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}

/** 会社概要：FDE（Forward Deployed Engineering）。その場で改善案をもらい、反映し、また改善する流れ。 */
export function HowWeWork() {
  return (
    <section className="bg-white px-6 py-20 md:py-28" aria-labelledby="fde-heading">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <p className="mb-5 font-sans text-[11px] uppercase tracking-[0.18em] text-amami-blue sm:text-xs sm:tracking-[0.28em]">
              FDE — Forward Deployed Engineering
            </p>
            <h2 id="fde-heading" className="mb-8 text-slate-800">
              <span className="inline-block font-serif text-7xl leading-none tracking-[0.04em] text-brand-gradient md:text-8xl">
                FDE
              </span>
              <span className="mt-6 block font-serif text-2xl leading-snug [word-break:keep-all] md:text-[2rem]">
                現場で聞いて、
                <br />
                その場で直す。
              </span>
            </h2>

            <p className="mb-8 grid grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-x-3 rounded-2xl bg-slate-50 px-5 py-4 font-sans text-[15px] leading-relaxed text-slate-700 md:text-base">
              <span
                className="inline-flex h-7 items-center rounded-full px-3 text-xs font-bold leading-none tracking-[0.12em] text-white"
                style={{ backgroundColor: TEAL }}
              >
                FDE
              </span>
              <span className="text-slate-400" aria-hidden>
                ＝
              </span>
              <span className="font-bold [word-break:keep-all]">
                お客さまの現場に入り込んで
                <wbr />
                開発するエンジニア
              </span>
            </p>

            <div className="space-y-6 font-serif text-base leading-loose text-slate-600 md:text-lg">
              <p>
                弊社は、FDE（Forward Deployed Engineer）としてお客さまの現場に入り込み、使う方のそばで開発を進めます。
              </p>
              <p>
                現場で改善案をいただいたら、すぐに反映して見ていただき、そこからまた改善する。このくり返しを、スピード感を持って回せることが弊社の強みです。
              </p>
              <p>
                完成してから手直しするのではなく、使いながら少しずつ合わせていくので、現場にしっくりくる形へ早くたどり着けます。
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-slate-50 px-4 py-8 sm:px-8 md:py-10">
            <CycleDiagram />
          </div>
        </div>

        <Reveal className="mt-12 md:mt-16">
          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="fde-card rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-7"
                style={{ "--i": i } as CSSProperties}
              >
                <div className="flex items-center gap-4">
                  <IconCircle size="h-11 w-11">{s.icon}</IconCircle>
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-amami-blue">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold text-slate-800 [word-break:keep-all]">{s.title}</h3>
                <p className="mt-3 font-sans leading-loose text-slate-600">{s.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
