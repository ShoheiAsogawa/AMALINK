"use client";

import { Section } from "@/components/ui/Section";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { WaveBackground } from "@/components/ui/WaveBackground";
import { getOfficialLineAddFriendUrl } from "@/lib/seo";
import { OfficialLineIcon } from "@/components/ui/OfficialLineIcon";
import { ChunkyAnchor, ChunkyNextLink } from "@/components/ui/ChunkyButton";

export function Contact() {
  const lineUrl = getOfficialLineAddFriendUrl();

  return (
    <Section
      id="contact"
      className="bg-gradient-to-b from-slate-50 to-white py-20 md:py-32 overflow-hidden relative"
      background={<WaveBackground color="blue-light" position="top" opacity={0.18} speed={16} />}
    >
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center bg-transparent py-6 text-center md:py-24"
        >
          <SectionEyebrow label="Contact Us" color="green" />

          <h2 className="mb-6 w-full max-w-full text-center text-2xl font-serif leading-tight text-slate-800 [letter-spacing:0] md:mb-8 md:whitespace-nowrap md:text-[clamp(1.65rem,3.2vw,3rem)] xl:text-5xl">
            まずは、<br className="md:hidden" />
            気軽にお話ししませんか？
          </h2>

          <p className="mb-9 max-w-2xl text-center text-base leading-loose text-slate-500 md:mb-11 md:text-lg font-sans">
            「これって相談をしていいのかな？」
            <br />
            そんな気持ちのままで大丈夫。お気軽にどうぞ。
          </p>

          <div className="mx-auto flex w-full max-w-[15rem] flex-col items-stretch justify-center gap-3 sm:max-w-[32rem] sm:flex-row sm:gap-5">
            <ChunkyAnchor
              href={lineUrl}
              theme="neu"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full min-w-0 flex-1"
            >
              <span className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 sm:gap-x-2.5">
                <span className="flex shrink-0 translate-y-[0.11em] items-center justify-center">
                  <OfficialLineIcon className="relative size-[1em]" />
                </span>
                <span className="flex min-h-[1em] min-w-0 items-center justify-center whitespace-nowrap text-center leading-none">
                  公式LINE
                </span>
                <ArrowRight
                  className="size-[0.85em] shrink-0 translate-y-[0.11em] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-[0.11em]"
                  aria-hidden
                />
              </span>
            </ChunkyAnchor>

            <ChunkyNextLink href="/contact" theme="neu" className="group flex w-full min-w-0 flex-1">
              <span className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 sm:gap-x-2.5">
                <span className="flex shrink-0 translate-y-[0.11em] items-center justify-center">
                  <Mail className="size-[1em] opacity-90" strokeWidth={2} aria-hidden />
                </span>
                <span className="flex min-h-[1em] min-w-0 items-center justify-center whitespace-nowrap text-center leading-none">
                  お問い合わせ
                </span>
                <ArrowRight
                  className="size-[0.85em] shrink-0 translate-y-[0.11em] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-[0.11em]"
                  aria-hidden
                />
              </span>
            </ChunkyNextLink>
          </div>

          <p className="mt-8 max-w-md text-center text-xs text-slate-400 md:text-sm font-sans">
            お問い合わせには、通常2営業日以内に返信いたします。
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
