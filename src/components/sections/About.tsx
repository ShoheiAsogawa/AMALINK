"use client";

import { Section } from "@/components/ui/Section";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { motion } from "framer-motion";
import { Sprout, Waves, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { WaveBackground } from "@/components/ui/WaveBackground";
import { cn } from "@/lib/utils";
import { usePinnedHorizontalScroll } from "@/components/ui/usePinnedHorizontalScroll";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useLocale } from "@/components/i18n/useLocale";
import { getMessages } from "@/lib/messages";

type ValueCardShellProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  entrance?: boolean;
  isHovered: boolean;
  setHovered: (v: boolean) => void;
};

function ValueCardShell({
  children,
  className,
  delay = 0,
  entrance = true,
  isHovered,
  setHovered,
}: ValueCardShellProps) {
  return (
    <motion.div
      initial={entrance ? { opacity: 0, x: 20 } : false}
      whileInView={entrance ? { opacity: 1, x: 0 } : undefined}
      viewport={entrance ? { once: true, amount: 0.35 } : undefined}
      transition={entrance ? { delay, duration: 0.8 } : undefined}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-[transform,box-shadow,background-color] duration-500 hover:bg-white hover:shadow-xl md:p-10",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(!isHovered)}
    >
      {children}
    </motion.div>
  );
}

function SproutCard({
  className,
  delay = 0,
  entrance = true,
}: {
  className?: string;
  delay?: number;
  entrance?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const copy = getMessages(useLocale()).about.values[0];

  return (
    <ValueCardShell
      className={className}
      delay={delay}
      entrance={entrance}
      isHovered={isHovered}
      setHovered={setIsHovered}
    >
      <div className="pointer-events-none absolute bottom-6 right-6 z-0">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="overflow-visible">
          <motion.path
            d="M24 44 C24 36 24 32 24 24"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: isHovered ? 1 : 0,
              opacity: isHovered ? 0.5 : 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <motion.path
            d="M24 24 C18 22 10 24 8 18 C6 12 14 10 20 16 C22 19 24 24 24 24"
            fill="#10b981"
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{
              scale: isHovered ? 1 : 0,
              opacity: isHovered ? 0.5 : 0,
              rotate: isHovered ? 0 : -45,
            }}
            transition={{ duration: 0.4, delay: 0.4, ease: "backOut" }}
            style={{ transformOrigin: "24px 24px" }}
          />
          <motion.path
            d="M24 24 C28 20 36 22 40 16 C42 10 34 6 28 12 C26 15 24 24 24 24"
            fill="#10b981"
            initial={{ scale: 0, opacity: 0, rotate: 45 }}
            animate={{
              scale: isHovered ? 1 : 0,
              opacity: isHovered ? 0.5 : 0,
              rotate: isHovered ? 0 : 45,
            }}
            transition={{ duration: 0.4, delay: 0.5, ease: "backOut" }}
            style={{ transformOrigin: "24px 24px" }}
          />
        </svg>
      </div>

      <div className="relative z-10 mb-6 flex items-center justify-between">
        <h3 className="font-serif text-xl text-slate-800">{copy.title}</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white transition-transform duration-300 group-hover:scale-110">
          <Sprout className="h-5 w-5 text-amami-green" />
        </div>
      </div>
      <p className="relative z-10 font-sans text-base leading-loose text-slate-500 md:text-lg">
        {copy.body}
      </p>
    </ValueCardShell>
  );
}

function RippleCard({
  className,
  delay = 0.2,
  entrance = true,
}: {
  className?: string;
  delay?: number;
  entrance?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const copy = getMessages(useLocale()).about.values[1];

  return (
    <ValueCardShell
      className={className}
      delay={delay}
      entrance={entrance}
      isHovered={isHovered}
      setHovered={setIsHovered}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-amami-blue/30"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={
              isHovered
                ? {
                    width: [0, 200, 300],
                    height: [0, 200, 300],
                    opacity: [0.6, 0.3, 0],
                  }
                : { width: 0, height: 0, opacity: 0 }
            }
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              repeat: isHovered ? Infinity : 0,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mb-6 flex items-center justify-between">
        <h3 className="font-serif text-xl text-slate-800">{copy.title}</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white transition-transform duration-300 group-hover:scale-110">
          <Waves className="h-5 w-5 text-amami-blue" />
        </div>
      </div>
      <p className="relative z-10 font-sans text-base leading-loose text-slate-500 md:text-lg">
        {copy.body}
      </p>
    </ValueCardShell>
  );
}

function PeopleCard({
  className,
  delay = 0.4,
  entrance = true,
}: {
  className?: string;
  delay?: number;
  entrance?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const copy = getMessages(useLocale()).about.values[2];

  return (
    <ValueCardShell
      className={className}
      delay={delay}
      entrance={entrance}
      isHovered={isHovered}
      setHovered={setIsHovered}
    >
      <div className="pointer-events-none absolute bottom-4 right-6">
        <svg width="48" height="32" viewBox="0 0 48 32" fill="none" className="overflow-visible">
          <motion.g
            initial={{ opacity: 0, x: -5 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -5,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <circle cx="14" cy="8" r="5" stroke="#d4a574" strokeWidth="2" />
            <path
              d="M6 30 C6 22 9 18 14 18 C19 18 22 22 22 30"
              stroke="#d4a574"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.g>
          <motion.g
            initial={{ opacity: 0, x: 5 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : 5,
            }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
          >
            <circle cx="34" cy="8" r="5" stroke="#d4a574" strokeWidth="2" />
            <path
              d="M26 30 C26 22 29 18 34 18 C39 18 42 22 42 30"
              stroke="#d4a574"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.g>
        </svg>
      </div>

      <div className="relative z-10 mb-6 flex items-center justify-between">
        <h3 className="font-serif text-xl text-slate-800">{copy.title}</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white transition-transform duration-300 group-hover:scale-110">
          <Users className="h-5 w-5 text-sand-beige" />
        </div>
      </div>
      <p className="relative z-10 font-sans text-base leading-loose text-slate-500 md:text-lg">
        {copy.body}
      </p>
    </ValueCardShell>
  );
}

const CARD_ITEM_CLASS = "w-[min(80vw,22rem)] shrink-0";
const CARD_CLASS = "h-full w-full";

function AboutCopy({ className }: { className?: string }) {
  const locale = useLocale();
  const t = getMessages(locale).about;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={cn(
        "mx-auto w-full max-w-xl text-center md:mx-0 md:w-full md:max-w-[min(100%,36rem)] md:text-left",
        className,
      )}
    >
      <SectionEyebrow label="About Us" color="blue" align="responsive" />

      <h2 className="mb-10 font-serif text-3xl leading-tight tracking-normal text-slate-800 [word-break:keep-all] md:mb-12 md:text-5xl">
        {t.headingBefore}
        <br />
        {t.headingMuted ? (
          <>
            <span className="text-slate-400">{t.headingMuted}</span>
            {t.headingAfter}
          </>
        ) : null}
      </h2>

      <div className="space-y-8 font-serif text-lg leading-loose text-slate-600 md:text-xl">
        <p>{t.p1}</p>
        <p>
          {t.p2Before}
          <span className="font-bold text-amami-blue">AMAMI</span>
          {locale === "ja" ? (
            <>
              」と、世界への「
              <span className="font-bold text-amami-green">LINK</span>
              {t.p2After}
            </>
          ) : (
            <>
              {" "}
              and a <span className="font-bold text-amami-green">LINK</span> to the world
              {t.p2After}
            </>
          )}
        </p>
        <p>{t.p3}</p>
        <p className="pt-2">
          <LocaleLink
            href="/about"
            className="font-sans text-sm tracking-wide text-amami-blue transition hover:text-amami-green"
          >
            {t.companyLink}
          </LocaleLink>
        </p>
      </div>
    </motion.div>
  );
}

/**
 * モバイル横送り:
 * ABOUT本文は通常どおり縦に流し、カード領域だけを固定する。
 * カード領域の縦スクロール進捗を、そのまま横方向の移動量へ変換する。
 */
function ValuesCards({ mobileCopy }: { mobileCopy: ReactNode }) {
  const valuesAria = getMessages(useLocale()).about.valuesAria;
  const { containerRef, layout, reduceMotion, setDotRef, stickyRef, trackRef, x } =
    usePinnedHorizontalScroll(3);

  if (reduceMotion) {
    return (
      <>
        <div className="md:hidden">
          {mobileCopy}
          <div className="mt-8 space-y-8">
            <SproutCard entrance={false} />
            <RippleCard entrance={false} />
            <PeopleCard entrance={false} />
          </div>
        </div>
        <div className="mx-auto hidden w-full max-w-xl space-y-8 md:mx-0 md:block md:max-w-[min(100%,36rem)]">
          <SproutCard />
          <RippleCard />
          <PeopleCard />
        </div>
      </>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative -mx-4 w-[calc(100%+2rem)] min-w-0 max-w-[calc(100%+2rem)] md:hidden"
        style={{ height: layout.containerHeight }}
        aria-label={valuesAria}
      >
        <div
          ref={stickyRef}
          className="sticky z-10 flex w-full min-w-0 overflow-hidden"
          style={{ top: layout.stickyTop }}
        >
          <div className="w-full overflow-hidden">
            <div className="px-5">{mobileCopy}</div>
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="mt-8 flex w-max items-stretch gap-5 px-6 will-change-transform"
            >
            <div className={CARD_ITEM_CLASS} data-value-card="0">
              <SproutCard className={CARD_CLASS} delay={0} entrance={false} />
            </div>
            <div className={CARD_ITEM_CLASS} data-value-card="1">
              <RippleCard className={CARD_CLASS} delay={0} entrance={false} />
            </div>
            <div className={CARD_ITEM_CLASS} data-value-card="2">
              <PeopleCard className={CARD_CLASS} delay={0} entrance={false} />
            </div>
            </motion.div>

            <div className="mt-6 flex justify-center gap-2 px-6" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  ref={(node) => setDotRef(i, node)}
                  className="pinned-scroll-dot h-1.5 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-xl space-y-8 md:mx-0 md:block md:max-w-[min(100%,36rem)]">
        <SproutCard />
        <RippleCard />
        <PeopleCard />
      </div>
    </>
  );
}

export function About() {
  return (
    <Section
      id="about"
      className="relative !overflow-visible bg-gradient-to-b from-slate-50 to-white py-32 md:py-48"
      background={<WaveBackground color="blue-dark" position="bottom" opacity={0.15} speed={17} />}
    >
      <div className="relative mx-auto grid max-w-6xl gap-0 px-1 md:grid-cols-2 md:gap-14 md:px-4 lg:gap-20">
        <AboutCopy className="hidden md:block" />
        <ValuesCards mobileCopy={<AboutCopy />} />
      </div>
    </Section>
  );
}
