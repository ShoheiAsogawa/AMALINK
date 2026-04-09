"use client";

import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WaveBackground } from "@/components/ui/WaveBackground";
import Link from "next/link";

export function Contact() {
  return (
    // Applied gradient from slate-50 (Services end) to white
    <Section
      id="contact"
      className="bg-gradient-to-b from-slate-50 to-white py-20 md:py-32 overflow-hidden relative"
      background={<WaveBackground color="blue-light" position="top" opacity={0.18} speed={16} />}
    >
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center bg-transparent p-6 md:p-24"
        >
          <span className="text-amami-green text-xs font-bold tracking-[0.2em] uppercase block mb-4 md:mb-6">Contact Us</span>
          
          <h2 className="text-2xl md:text-5xl font-serif text-slate-800 mb-6 md:mb-8 leading-tight">
            まずは、<br className="md:hidden" />
            気軽にお話ししませんか？
          </h2>
          
          <p className="text-slate-500 mb-8 md:mb-12 text-sm md:text-lg max-w-2xl mx-auto leading-loose font-sans">
            「これって相談していいのかな？」<br />
            そんな気持ちのままで大丈夫です。<br />
            思いついたことを、気軽に聞かせてください。
          </p>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Link 
              href="/contact"
              className="inline-flex items-center gap-4 px-8 py-4 md:px-12 md:py-5 bg-slate-800 text-white rounded-full font-sans tracking-wider hover:bg-amami-blue transition-colors duration-300 shadow-lg group text-sm md:text-base w-full md:w-auto justify-center cursor-pointer"
            >
              <span>お問い合わせはこちら</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <p className="mt-8 text-[10px] md:text-xs text-slate-400 font-sans">
            通常、2営業日以内に返信いたします。
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
