import { ArrowRight, ListOrdered, Mail } from "lucide-react";
import { ChunkyAnchor, ChunkyNextLink } from "@/components/ui/ChunkyButton";
import { SERVICE_GUIDES, type ServiceGuideKey } from "@/lib/service-guides";

const TEAL = "#188a8c";

function Diagram({ slug, kind, alt }: { slug: ServiceGuideKey; kind: "ba" | "steps"; alt: string }) {
  const g = SERVICE_GUIDES[slug];
  const wide = g.dims[`${kind}-wide`];
  const tall = g.dims[`${kind}-tall`];
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={`/services/${slug}-${kind}-wide.webp`} width={wide[0]} height={wide[1]} />
      <img
        src={`/services/${slug}-${kind}-tall.webp`}
        width={tall[0]}
        height={tall[1]}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="mx-auto h-auto w-full max-w-md rounded-3xl md:max-w-none"
      />
    </picture>
  );
}

function Eyebrow({ children }: { children: string }) {
  return <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">{children}</p>;
}

function CheckIcon() {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
      style={{ backgroundColor: TEAL }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}


/** トップページ（Contact セクション）と同じ Chunky ボタンの中身：アイコン＋文字＋矢印 */
function ButtonInner({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 sm:gap-x-2.5">
      <span className="flex shrink-0 translate-y-[0.11em] items-center justify-center">{icon}</span>
      <span className="flex min-h-[1em] min-w-0 items-center justify-center whitespace-nowrap text-center leading-none">
        {label}
      </span>
      <ArrowRight
        className="size-[0.85em] shrink-0 translate-y-[0.11em] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-[0.11em]"
        aria-hidden
      />
    </span>
  );
}
const BTN = "group flex w-full min-w-0 flex-1 text-[0.95rem] md:text-base";
const MAIL = <Mail className="size-[1em] opacity-90" strokeWidth={2} aria-hidden />;

/** ヒーロー下の行動ボタン */
export function ServiceHeroCta() {
  return (
    <div className="mt-10 flex w-full max-w-[15rem] flex-col items-stretch gap-3 sm:max-w-[32rem] sm:flex-row sm:gap-5">
      <ChunkyNextLink href="/contact" theme="neu" className={BTN}>
        <ButtonInner icon={MAIL} label="相談してみる" />
      </ChunkyNextLink>
      <ChunkyAnchor href="#service-flow" theme="neu" className={BTN}>
        <ButtonInner icon={<ListOrdered className="size-[1em] opacity-90" strokeWidth={2} aria-hidden />} label="進め方を見る" />
      </ChunkyAnchor>
    </div>
  );
}

/** お悩み → 相談したあと（図解） → 変わること */
export function ServiceProblems({ slug }: { slug: ServiceGuideKey }) {
  const g = SERVICE_GUIDES[slug];
  const alt = `相談すると、こう変わります。いまのお悩み：${g.before.join("、")}。相談したあと：${g.after.join("、")}。`;
  return (
    <>
      <section className="bg-slate-50 px-6 py-20 md:py-28" aria-labelledby="svc-problems">
        <div className="mx-auto max-w-5xl">
          <Eyebrow>Your worries</Eyebrow>
          <h2 id="svc-problems" className="mt-3 font-serif text-2xl font-bold text-brand-gradient md:text-5xl">
            こんなお悩みはありませんか？
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
            {g.problems.map((p) => (
              <li key={p.title} className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
                <h3 className="font-sans text-lg font-bold text-slate-800 md:text-xl">{p.title}</h3>
                <p className="mt-3 font-sans leading-loose text-slate-600">{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-sans leading-loose text-slate-700 md:text-lg">
            ひとつでも当てはまれば、{g.name}でお手伝いできます。
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28" aria-labelledby="svc-change">
        <div className="mx-auto max-w-5xl">
          <Eyebrow>What changes</Eyebrow>
          <h2 id="svc-change" className="mt-3 font-serif text-2xl font-bold text-brand-gradient md:text-5xl">
            相談すると、こう変わります
          </h2>
          <div className="mt-10">
            <Diagram slug={slug} kind="ba" alt={alt} />
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {g.outcomes.map((o) => (
              <li key={o.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-7">
                <div className="flex items-center gap-3">
                  <CheckIcon />
                  <h3 className="font-sans text-lg font-bold" style={{ color: TEAL }}>
                    {o.title}
                  </h3>
                </div>
                <p className="mt-4 font-sans leading-loose text-slate-600">{o.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/** 進め方（図解＋文章）と途中の相談導線 */
export function ServiceSteps({
  slug,
  heading,
  steps,
}: {
  slug: ServiceGuideKey;
  heading: string;
  steps: readonly (readonly [string, string, string])[];
}) {
  const g = SERVICE_GUIDES[slug];
  const alt = `${g.name}の進め方：${g.steps.map((s, i) => `${i + 1}. ${s.title}`).join("、")}`;
  return (
    <section id="service-flow" className="scroll-mt-24 px-6 py-20 md:py-28" aria-labelledby="svc-flow">
      <div className="mx-auto max-w-5xl">
        <Eyebrow>Process</Eyebrow>
        <h2 id="svc-flow" className="mt-3 font-serif text-3xl font-bold text-brand-gradient md:text-5xl">
          {heading}
        </h2>
        <div className="mt-10">
          <Diagram slug={slug} kind="steps" alt={alt} />
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {steps.map(([, title, body], i) => (
            <li key={title} className="flex gap-4 rounded-3xl bg-slate-50 p-6">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-sans text-lg font-bold leading-none text-white"
                style={{ backgroundColor: TEAL }}
                aria-hidden
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-sans text-lg font-bold text-slate-800">{title}</h3>
                <p className="mt-2 font-sans leading-loose text-slate-600">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-3xl bg-slate-900 px-6 py-10 text-center md:px-12 md:py-12">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-teal-300">Contact</p>
          <p className="mt-3 font-sans text-xl font-bold leading-relaxed text-white md:text-2xl">
            まだ内容が固まっていなくても大丈夫です。
          </p>
          <p className="mt-3 font-sans leading-loose text-slate-300">
            いまの困りごとを聞かせてください。何から始めるか、一緒に整理します。
          </p>
          <div className="mx-auto mt-7 flex w-full max-w-[15rem]">
            <ChunkyNextLink href="/contact" theme="neu" className={BTN}>
              <ButtonInner icon={MAIL} label="相談してみる" />
            </ChunkyNextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
