"use client";

import { Section } from "@/components/ui/Section";
import { motion, useScroll, useTransform } from "framer-motion";
import { Monitor, Smartphone, PenTool } from "lucide-react";
import { useRef, useState } from "react";
import { WaveBackground } from "@/components/ui/WaveBackground";

const services = [
  {
    id: "01",
    icon: <Monitor className="w-6 h-6" />,
    title: "システム開発",
    enTitle: "System Development",
    description: "日々の業務で「困ったな」「大変だな」と感じることはありませんか？\n在庫管理や予約システムなど、面倒な作業を自動化して、\nもっと大切なことに時間を使えるようお手伝いします。",
  },
  {
    id: "02",
    icon: <Smartphone className="w-6 h-6" />,
    title: "ホームページ制作",
    enTitle: "Web Production",
    description: "お店や会社の「顔」となるホームページ。\nただ綺麗なだけでなく、お客様が見やすく、\n使いやすいサイトを丁寧に作り上げます。",
  },
  {
    id: "03",
    icon: <PenTool className="w-6 h-6" />,
    title: "デザイン",
    enTitle: "Creative Design",
    description: "ロゴマークや名刺、パンフレットなど。\nあなたの想いをカタチにして、\n見る人の心に残るデザインをご提案します。",
  },
];

// サービスカードコンポーネント
function ServiceCard({ service, index }: { service: typeof services[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col justify-between min-h-[360px] md:min-h-[400px] group relative overflow-hidden"
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
              <div className="opacity-90">import React from 'react';</div>
              <div className="opacity-90">import {'{'} useState {'}'} from 'react';</div>
              <div className="h-2" />
              <div className="opacity-100">function App() {'{'}</div>
              <div className="pl-4 opacity-80">const [count, setCount] = useState(0);</div>
              <div className="pl-4 opacity-80">return (</div>
              <div className="pl-8 opacity-70">&lt;div className="app"&gt;</div>
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

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6 md:mb-8">
          <span className="text-3xl md:text-4xl font-serif text-slate-200 group-hover:text-amami-blue/20 transition-colors">{service.id}</span>
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:text-amami-blue group-hover:bg-amami-blue-light/20 group-hover:scale-110 transition-all duration-300">
            {service.icon}
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-serif text-slate-800 mb-2">{service.title}</h3>
        <span className="text-[10px] md:text-xs text-amami-blue uppercase tracking-widest block mb-6 md:mb-8">{service.enTitle}</span>
        
        <p className="text-slate-500 text-sm leading-7 md:leading-8 font-sans whitespace-pre-line">
          {service.description}
        </p>
      </div>

      <div className="w-full h-[1px] bg-slate-100 mt-6 md:mt-8 group-hover:bg-amami-blue transition-colors duration-500 relative z-10" />
    </motion.div>
  );
}

export function Services() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    // Applied gradient from white (About end) to slate-50 (Services)
    <Section
      id="services"
      className="bg-gradient-to-b from-white to-slate-50 py-20 md:py-32 overflow-hidden relative"
      background={<WaveBackground color="blue" position="full" opacity={0.12} speed={14} />}
    >
      <div className="container mx-auto px-6 mb-12 md:mb-32 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 text-center md:text-left"
        >
          <div className="w-full md:w-auto">
            <span className="text-amami-blue text-xs font-bold tracking-[0.2em] uppercase block mb-4">Services</span>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-800 leading-tight">
              島暮らしを、<br />
              ちょっと便利に。
            </h2>
          </div>
          <p className="text-slate-500 text-sm md:text-base max-w-md leading-loose font-sans mx-auto md:mx-0">
            難しそうなITのことも、私たちにお任せください。<br />
            お客様一人ひとりのペースに合わせて、<br />
            最適な解決策をご提案します。
          </p>
        </motion.div>
      </div>

      <div ref={containerRef} className="container mx-auto px-6 relative z-10">
        {/* Background Text Decoration - Moved to the very top of the section to avoid overlap */}
        <motion.div 
          style={{ x }}
          className="hidden md:block absolute -top-52 left-0 text-[10vw] font-bold text-slate-200/30 tracking-widest pointer-events-none select-none whitespace-nowrap z-0"
        >
          AMALINK SERVICES
        </motion.div>
        
        {/* Mobile visible background text */}
        <div className="md:hidden absolute -top-20 left-0 text-[15vw] font-bold text-slate-100 tracking-widest pointer-events-none select-none whitespace-nowrap z-0 opacity-50">
          SERVICES
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}
