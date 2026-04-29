"use client";

import { Section } from "@/components/ui/Section";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { motion } from "framer-motion";
import { Sprout, Waves, Users } from "lucide-react";
import { useState } from "react";
import { WaveBackground } from "@/components/ui/WaveBackground";

// 島に根ざすカード - リアルな双葉成長アニメーション（右下配置）
function SproutCard() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0, duration: 0.8 }}
      className="bg-slate-50/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)} // モバイル対応: タップでトグル
    >
      {/* リアルな双葉アニメーション - 右下配置 */}
      <div className="absolute bottom-6 right-6 pointer-events-none z-0">
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 48 48" 
          fill="none"
          className="overflow-visible"
        >
          {/* 茎 - S字カーブで自然に伸びる */}
          <motion.path
            d="M24 44 C24 36 24 32 24 24"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: isHovered ? 1 : 0,
              opacity: isHovered ? 0.5 : 0
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* 左の葉 - 葉脈を感じさせる形状 */}
          <motion.path
            d="M24 24 C18 22 10 24 8 18 C6 12 14 10 20 16 C22 19 24 24 24 24"
            fill="#10b981"
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ 
              scale: isHovered ? 1 : 0, 
              opacity: isHovered ? 0.5 : 0,
              rotate: isHovered ? 0 : -45
            }}
            transition={{ duration: 0.4, delay: 0.4, ease: "backOut" }}
            style={{ transformOrigin: "24px 24px" }}
          />

          {/* 右の葉 - 非対称で自然な形状 */}
          <motion.path
            d="M24 24 C28 20 36 22 40 16 C42 10 34 6 28 12 C26 15 24 24 24 24"
            fill="#10b981"
            initial={{ scale: 0, opacity: 0, rotate: 45 }}
            animate={{ 
              scale: isHovered ? 1 : 0, 
              opacity: isHovered ? 0.5 : 0,
              rotate: isHovered ? 0 : 45
            }}
            transition={{ duration: 0.4, delay: 0.5, ease: "backOut" }}
            style={{ transformOrigin: "24px 24px" }}
          />
        </svg>
      </div>

      <div className="mb-6 flex items-center justify-between relative z-10">
        <h3 className="text-xl font-serif text-slate-800">島に根ざす</h3>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
          <Sprout className="w-5 h-5 text-amami-green" />
        </div>
      </div>
      <p className="relative z-10 text-base font-sans leading-loose text-slate-500 md:text-lg">
        奄美の文化や風土を大切にしながら、デジタルの力で新しい可能性を育みます。
      </p>
    </motion.div>
  );
}

// 波紋を広げるカード - 波紋アニメーション
function RippleCard() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="bg-slate-50/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)} // モバイル対応
    >
      {/* 波紋アニメーション */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-amami-blue/30"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={isHovered ? {
              width: [0, 200, 300],
              height: [0, 200, 300],
              opacity: [0.6, 0.3, 0],
            } : { width: 0, height: 0, opacity: 0 }}
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              repeat: isHovered ? Infinity : 0,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between relative z-10">
        <h3 className="text-xl font-serif text-slate-800">波紋を広げる</h3>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
          <Waves className="w-5 h-5 text-amami-blue" />
        </div>
      </div>
      <p className="relative z-10 text-base font-sans leading-loose text-slate-500 md:text-lg">
        小さな課題解決が、やがて大きな変化の波となり、島全体を豊かにしていきます。
      </p>
    </motion.div>
  );
}

// 人に寄り添うカード - ミニマルな人が寄り添うアニメーション（右下配置）
function PeopleCard() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="bg-slate-50/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)} // モバイル対応
    >
      {/* ミニマルな人が寄り添うアニメーション - 右下配置 */}
      <div className="absolute bottom-4 right-6 pointer-events-none">
        <svg 
          width="48" 
          height="32" 
          viewBox="0 0 48 32" 
          fill="none"
          className="overflow-visible"
        >
          {/* 左の人（シンプルで幾何学的） */}
          <motion.g
            initial={{ opacity: 0, x: -5 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -5
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* 頭 - 円 */}
            <circle cx="14" cy="8" r="5" stroke="#d4a574" strokeWidth="2" />
            {/* 体 - 円弧 */}
            <path 
              d="M6 30 C6 22 9 18 14 18 C19 18 22 22 22 30" 
              stroke="#d4a574" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </motion.g>
          
          {/* 右の人（シンプルで幾何学的） */}
          <motion.g
            initial={{ opacity: 0, x: 5 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : 5
            }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
          >
            {/* 頭 - 円 */}
            <circle cx="34" cy="8" r="5" stroke="#d4a574" strokeWidth="2" />
            {/* 体 - 円弧 */}
            <path 
              d="M26 30 C26 22 29 18 34 18 C39 18 42 22 42 30" 
              stroke="#d4a574" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </motion.g>
        </svg>
      </div>

      <div className="mb-6 flex items-center justify-between relative z-10">
        <h3 className="text-xl font-serif text-slate-800">人に寄り添う</h3>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
          <Users className="w-5 h-5 text-sand-beige" />
        </div>
      </div>
      <p className="relative z-10 text-base font-sans leading-loose text-slate-500 md:text-lg">
        難しい技術用語ではなく、分かりやすい言葉と温かい対応で、皆様の想いを形にします。
      </p>
    </motion.div>
  );
}

export function About() {
  return (
    <Section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-32 md:py-48"
      background={<WaveBackground color="blue-dark" position="bottom" opacity={0.15} speed={17} />}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto grid max-w-6xl gap-12 px-1 md:grid-cols-2 md:gap-14 md:px-4 lg:gap-20"
      >
        <div className="mx-auto w-full max-w-xl text-center md:mx-0 md:w-full md:max-w-[min(100%,36rem)] md:text-left">
          <SectionEyebrow label="About Us" color="blue" align="responsive" />

          <h2 className="mb-10 text-3xl font-serif leading-tight text-slate-800 [letter-spacing:0] md:mb-12 md:text-5xl">
            デジタルだけど、<br />
            <span className="text-slate-400">体温のある</span>仕事を。
          </h2>

          <div className="space-y-8 font-serif text-lg leading-loose text-slate-600 md:text-xl">
            <p>
              AMALINK（アマリンク）は、奄美大島で生まれたデジタルクリエイティブチームです。
            </p>
            <p>
              私たちの名前「AMALINK」には、故郷「<span className="text-amami-blue font-bold">AMAMI</span>」と、世界への「
              <span className="text-amami-green font-bold">LINK</span>」という2つの願いが込められています。
            </p>
            <p>
              最先端の技術も大切ですが、それ以上に「誰かの役に立つこと」を大切に。島の暮らしに、そっと寄り添うような温かいデジタル体験をお届けします。
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl space-y-8 md:mx-0 md:max-w-[min(100%,36rem)]">
          <SproutCard />
          <RippleCard />
          <PeopleCard />
        </div>
      </motion.div>
    </Section>
  );
}
