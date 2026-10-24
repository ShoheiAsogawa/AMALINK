import { MessagesSquare, PencilLine, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { COMPANY_OVERVIEW } from "@/lib/site-content";

const TEAL = "#188a8c";

const STEPS: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "改善案をもらう",
    body: "実際に使っている方から、「ここが分かりにくい」「こうだと助かる」という声をその場で伺います。",
    icon: <MessagesSquare className="h-5 w-5" strokeWidth={2} aria-hidden />,
  },
  {
    title: "すぐに反映する",
    body: "いただいた案は持ち帰って寝かせず、できるだけその場で形にして、動くものを見ていただきます。",
    icon: <PencilLine className="h-5 w-5" strokeWidth={2} aria-hidden />,
  },
  {
    title: "また改善する",
    body: "直したものを触っていただき、次の気づきをもらいます。このくり返しで、現場に合う形に仕上げていきます。",
    icon: <RefreshCw className="h-5 w-5" strokeWidth={2} aria-hidden />,
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
const pt = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
};
const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

function IconCircle({ children, size = "h-14 w-14" }: { children: ReactNode; size?: string }) {
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full text-white shadow-[0_10px_24px_-12px_rgba(24,138,140,0.7)]`}
      style={{ backgroundColor: TEAL }}
      aria-hidden
    >
      {children}
    </span>
  );
}

function CycleDiagram() {
  const alt = `改善の流れ：${STEPS.map((s) => s.title).join("→")}→はじめに戻ってくり返す`;
  return (
    <div role="img" aria-label={alt} className="relative mx-auto w-full max-w-[400px]" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={TEAL} strokeOpacity={0.22} strokeWidth={2} />
        {ARROW_DEG.map((deg) => {
          const p = pt(deg);
          return (
            <path
              key={deg}
              d="M-5 -7 L4 0 L-5 7"
              fill="none"
              stroke={TEAL}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${deg + 90})`}
            />
          );
        })}
      </svg>

      <div
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center font-sans"
        style={{ left: pct(CX, W), top: pct(CY, H) }}
        aria-hidden
      >
        <span className="whitespace-nowrap text-xs tracking-[0.12em] text-slate-500 md:text-[13px]">スピード感を持って</span>
        <span className="mt-1 whitespace-nowrap font-serif text-xl font-bold text-brand-gradient md:text-2xl">くり返す</span>
      </div>

      {STEPS.map((s, i) => {
        const p = pt(NODE_DEG[i]!);
        const top = i === 0;
        return (
          <div key={s.title} aria-hidden>
            <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: pct(p.x, W), top: pct(p.y, H) }}>
              <IconCircle>{s.icon}</IconCircle>
            </div>
            <span
              className="absolute w-[7.5rem] -translate-x-1/2 text-center font-sans text-[13px] font-bold leading-snug tracking-wide text-slate-700 md:w-[8.5rem] md:text-sm"
              style={
                top
                  ? { left: pct(p.x, W), bottom: `calc(${pct(H - p.y, H)} + 2.25rem)` }
                  : { left: pct(p.x, W), top: `calc(${pct(p.y, H)} + 2.25rem)` }
              }
            >
              {s.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** 会社概要：代表の働き方（FDE）。その場で改善案をもらい、反映し、また改善する流れ。 */
export function HowWeWork() {
  return (
    <section className="bg-white px-6 py-20 md:py-28" aria-labelledby="how-we-work">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.28em] text-amami-blue">How we work</p>
            <h2
              id="how-we-work"
              className="mb-8 font-serif text-3xl leading-tight text-slate-800 [word-break:keep-all] md:text-4xl"
            >
              その場で聞いて、
              <br />
              その場で直す。
            </h2>
            <div className="space-y-6 font-serif text-base leading-loose text-slate-600 md:text-lg">
              <p>
                代表の{COMPANY_OVERVIEW.representative}は、FDE（Forward Deployed Engineer）として仕事をしています。FDEは、お客さまの現場に入り込んで開発するエンジニアのことです。
              </p>
              <p>
                現場で使う方から改善案をいただいたら、すぐに反映して見ていただき、そこからまた改善する。このくり返しを、スピード感を持って回せることが私たちの強みです。
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

        <ol className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-7">
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
      </div>
    </section>
  );
}
