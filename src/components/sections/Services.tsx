"use client";

import { Section } from "@/components/ui/Section";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { motion } from "framer-motion";
import { Monitor, Smartphone, PenTool, Sparkles } from "lucide-react";
import { useState } from "react";
import { WaveBackground } from "@/components/ui/WaveBackground";
import { cn } from "@/lib/utils";

const services = [
  {
    id: "01",
    icon: <Monitor className="w-6 h-6" />,
    title: "システム開発",
    enTitle: "System Development",
    description: "日々の業務で「困ったな」「大変だな」と感じることはありませんか？\n在庫管理や予約システムなど、面倒な作業を自動化して、\nもっと大切なことに時間を使えるようお手伝いします。",
    wide: false,
  },
  {
    id: "02",
    icon: <Smartphone className="w-6 h-6" />,
    title: "ホームページ制作",
    enTitle: "Web Production",
    description: "お店や会社の「顔」となるホームページ。\nただ綺麗なだけでなく、お客様が見やすく、\n使いやすいサイトを丁寧に作り上げます。",
    wide: false,
  },
  {
    id: "03",
    icon: <PenTool className="w-6 h-6" />,
    title: "デザイン",
    enTitle: "Creative Design",
    description: "ロゴマークや名刺、パンフレットなど。\nあなたの想いをカタチにして、\n見る人の心に残るデザインをご提案します。",
    wide: false,
  },
  {
    id: "04",
    icon: <Sparkles className="w-6 h-6" />,
    title: "GEO対策",
    enTitle: "Generative Engine Optimization",
    description:
      "これからは、人が検索するだけでなく、AIが答えを選ぶ時代。\n事業内容が正しく伝わるWebページの設計と、\nAIに引用されやすい情報整理・改善をサポートします。",
    wide: true,
  },
] as const;

type Service = (typeof services)[number];

const GEO_MATRIX_LINES = [
  "llms.txt",
  "JSON-LD",
  "@context",
  "FAQPage",
  "Organization",
  "schema.org",
  "meta",
  "og:title",
  "canonical",
  "structured",
  "WebSite",
  "Service",
  "legalName",
  "description",
  "robots.txt",
  "sitemap.xml",
  "areaServed",
  "AI cite",
  "GEO",
  "Generative",
] as const;

function GeoMatrixRain({ active }: { active: boolean }) {
  const columnCount = 16;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 0.22 : 0 }}
      transition={{ duration: 0.35 }}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="flex h-full w-full justify-between gap-1 px-4 md:gap-2 md:px-8">
        {Array.from({ length: columnCount }, (_, col) => {
          const lines = Array.from({ length: 18 }, (_, row) =>
            GEO_MATRIX_LINES[(col + row) % GEO_MATRIX_LINES.length]
          );
          const duration = 9 + (col % 6) * 1.4;

          return (
            <div key={col} className="relative h-full min-w-0 flex-1 overflow-hidden">
              <motion.div
                className="flex flex-col font-mono text-[8px] leading-[1.35rem] text-amami-blue md:text-[9px] md:leading-[1.5rem]"
                initial={{ y: 0 }}
                animate={active ? { y: ["0%", "50%"] } : { y: "0%" }}
                transition={{
                  duration,
                  repeat: active ? Infinity : 0,
                  ease: "linear",
                }}
              >
                {[...lines, ...lines].map((line, row) => (
                  <span
                    key={`${col}-${row}`}
                    className="block truncate whitespace-nowrap"
                    style={{ opacity: 0.25 + (row % 4) * 0.12 }}
                  >
                    {line}
                  </span>
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// サービスカードコンポーネント
function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-100 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-500 hover:shadow-xl md:p-12",
        service.wide
          ? "min-h-[320px] md:col-span-3 md:min-h-[280px]"
          : "min-h-[400px] md:min-h-[440px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      {/* ホバー時の背景アニメーション - 中央最背面に配置 */}
      {service.id === "01" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.25 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0"
        >
          {/* コードタイピング風アニメーション - ダミーコードが流れる */}
          <div className="w-64 h-48 font-mono text-xs leading-relaxed text-amami-blue p-4 border border-amami-blue/30 rounded bg-amami-blue/10 overflow-hidden flex flex-col">
            <motion.div
              initial={{ y: 0 }}
              animate={isHovered ? { y: -80 } : { y: 0 }}
              transition={{ duration: 4, ease: "linear", repeat: isHovered ? Infinity : 0 }}
              className="space-y-1"
            >
              <div className="opacity-90">{`import React from 'react';`}</div>
              <div className="opacity-90">{`import { useState } from 'react';`}</div>
              <div className="h-2" />
              <div className="opacity-100">function App() {'{'}</div>
              <div className="pl-4 opacity-80">const [count, setCount] = useState(0);</div>
              <div className="pl-4 opacity-80">return (</div>
              <div className="pl-8 opacity-70">{`<div className="app">`}</div>
              <div className="pl-12 opacity-60">&lt;h1&gt;Hello World&lt;/h1&gt;</div>
              <div className="pl-12 opacity-60">&lt;button onClick={'{'}() =&gt; setCount(c =&gt; c + 1){'}'}&gt;</div>
              <div className="pl-16 opacity-50">Count: {'{'}count{'}'}</div>
              <div className="pl-12 opacity-60">&lt;/button&gt;</div>
              <div className="pl-8 opacity-70">&lt;/div&gt;</div>
              <div className="pl-4 opacity-80">);</div>
              <div className="opacity-100">{'}'}</div>
              <div className="h-2" />
              <div className="opacity-90">export default App;</div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {service.id === "02" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.15 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0"
        >
          {/* ワイヤーフレーム構築風アニメーション - 枠組みも出現 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-40 h-48 border border-current text-amami-blue rounded p-2 bg-white/50 relative"
          >
            {/* ヘッダー */}
            <motion.div 
              initial={{ width: 0 }} 
              animate={isHovered ? { width: "100%" } : { width: 0 }} 
              transition={{ duration: 0.4, delay: 0.1 }} 
              className="h-4 bg-current mb-3 opacity-70" 
            />
            
            {/* コンテンツエリア */}
            <div className="flex gap-2 mb-3 h-24">
              {/* サイドバー */}
              <motion.div 
                initial={{ height: 0 }} 
                animate={isHovered ? { height: "100%" } : { height: 0 }} 
                transition={{ duration: 0.4, delay: 0.3 }} 
                className="w-1/3 bg-current opacity-40" 
              />
              {/* メインカラム */}
              <div className="w-2/3 flex flex-col gap-2">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={isHovered ? { width: "100%" } : { width: 0 }} 
                  transition={{ duration: 0.3, delay: 0.5 }} 
                  className="h-12 bg-current opacity-30" 
                />
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={isHovered ? { width: "100%" } : { width: 0 }} 
                  transition={{ duration: 0.3, delay: 0.6 }} 
                  className="h-full bg-current opacity-30" 
                />
              </div>
            </div>
            
            {/* フッター */}
            <motion.div 
              initial={{ scaleX: 0 }} 
              animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }} 
              transition={{ duration: 0.4, delay: 0.7 }} 
              className="absolute bottom-2 left-2 right-2 h-6 bg-current opacity-50 origin-center" 
            />
          </motion.div>
        </motion.div>
      )}

      {service.id === "03" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.15 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0"
        >
          {/* 図形描画風アニメーション - 重ならないように配置 */}
          <svg className="w-60 h-60 text-amami-blue" viewBox="0 0 100 100">
            {/* 円 - 左上 */}
            <motion.circle 
              cx="25" cy="25" r="15" 
              fill="currentColor" 
              initial={{ scale: 0 }} 
              animate={{ scale: isHovered ? 1 : 0 }} 
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0 }}
              className="opacity-50"
            />
            {/* 四角 - 右下 */}
            <motion.rect 
              x="55" y="55" width="30" height="30" 
              fill="currentColor" 
              initial={{ scale: 0, rotate: 0 }} 
              animate={{ scale: isHovered ? 1 : 0, rotate: isHovered ? 15 : 0 }} 
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
              className="opacity-40"
            />
            {/* 三角形 - 右上 */}
            <motion.path 
              d="M70 10 L85 40 L55 40 Z" 
              fill="currentColor" 
              initial={{ scale: 0 }} 
              animate={{ scale: isHovered ? 1 : 0 }} 
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              className="opacity-30"
            />
            {/* 五角形 - 左下 */}
            <motion.path 
              d="M25 55 L40 65 L35 80 L15 80 L10 65 Z" 
              fill="currentColor" 
              initial={{ scale: 0 }} 
              animate={{ scale: isHovered ? 1 : 0 }} 
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
              className="opacity-30"
            />
          </svg>
        </motion.div>
      )}

      {service.wide && (
        <div className="absolute top-8 right-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-amami-blue-light/20 group-hover:text-amami-blue md:top-12 md:right-12">
          {service.icon}
        </div>
      )}

      {service.id === "04" && <GeoMatrixRain active={isHovered} />}

      <div className={cn("relative z-10", service.wide && "max-w-xl")}>
        <div className="flex items-start justify-between mb-6 md:mb-8">
          <span className="text-3xl md:text-4xl font-serif text-slate-200 group-hover:text-amami-blue/20 transition-colors">{service.id}</span>
          {!service.wide && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-amami-blue-light/20 group-hover:text-amami-blue">
              {service.icon}
            </div>
          )}
        </div>
        
        <h3 className="text-xl md:text-2xl font-serif text-slate-800 mb-2">{service.title}</h3>
        <span className="text-[10px] md:text-xs text-amami-blue uppercase tracking-widest block mb-6 md:mb-8">{service.enTitle}</span>
        
        <p className="text-base leading-relaxed text-slate-500 md:text-lg md:leading-relaxed font-sans whitespace-pre-line">
          {service.description}
        </p>
      </div>

      <div className="w-full h-[1px] bg-slate-100 mt-6 md:mt-8 group-hover:bg-amami-blue transition-colors duration-500 relative z-10" />
    </motion.div>
  );
}

export function Services() {
  return (
    <Section
      id="services"
      className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-20 md:py-32"
      background={<WaveBackground color="blue" position="full" opacity={0.12} speed={14} />}
    >
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-32"
        >
          <SectionEyebrow label="Services" color="blue" />

          <h2 className="mb-8 text-3xl font-serif leading-tight text-slate-800 [letter-spacing:0] md:text-5xl">
            島暮らしを、<br />
            ちょっと便利に。
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-loose text-slate-500 md:text-lg font-sans">
            難しそうなITのことも、私たちにお任せください。<br />
            お客様一人ひとりのペースに合わせて、<br />
            最適な解決策をご提案します。
          </p>
        </motion.div>

        <div className="relative z-10 grid gap-6 md:grid-cols-3 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
    </Section>
  );
}
