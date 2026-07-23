"use client";

import { Section } from "@/components/ui/Section";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { motion } from "framer-motion";
import { Bot, Monitor, Smartphone, PenTool, Sparkles } from "lucide-react";
import { useState } from "react";
import { WaveBackground } from "@/components/ui/WaveBackground";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { RabbitAvatar } from "@/components/chatbot/RabbitAvatar";
import { usePinnedHorizontalScroll } from "@/components/ui/usePinnedHorizontalScroll";

const services = [
  {
    key: "system",
    id: "01",
    icon: <Monitor className="w-6 h-6" />,
    title: "システム開発",
    enTitle: "System Development",
    description: "日々の業務で「困ったな」「大変だな」と感じることはありませんか？\n在庫管理や予約システムなど、面倒な作業を自動化して、\nもっと大切なことに時間を使えるようお手伝いします。",
    href: "/system-development",
    linkLabel: "システム開発について詳しく見る",
    orderClass: "md:order-1",
  },
  {
    key: "chatbot",
    id: "02",
    icon: <Bot className="w-6 h-6" />,
    title: "AIアバターチャットボット",
    enTitle: "AI Avatar Chatbot",
    description:
      "自社サイト向けのAIチャットボット制作に対応しています。\nアバター付きの案内ボットや、答える範囲を絞った設計など、\n用途に合わせて組み込みまでご相談いただけます。",
    href: "/ai-avatar-chatbot",
    linkLabel: "チャットボットについて詳しく見る",
    orderClass: "md:order-2",
  },
  {
    key: "web",
    id: "03",
    icon: <Smartphone className="w-6 h-6" />,
    title: "ホームページ制作",
    enTitle: "Web Production",
    description:
      "お店や会社の「顔」となるホームページ。\nただ綺麗なだけでなく、お客様が見やすく、\n使いやすいサイトを丁寧に作り上げます。",
    href: "/web-production",
    linkLabel: "ホームページ制作について詳しく見る",
    orderClass: "md:order-3",
  },
  {
    key: "design",
    id: "04",
    icon: <PenTool className="w-6 h-6" />,
    title: "デザイン",
    enTitle: "Creative Design",
    description:
      "ロゴマークや名刺、パンフレットなど。\nデザインから印刷手配・納品まで一気通貫で、\n見る人の心に残るカタチをご提案します。",
    href: "/design",
    linkLabel: "デザインについて詳しく見る",
    orderClass: "md:order-4",
  },
  {
    key: "geo",
    id: "05",
    icon: <Sparkles className="w-6 h-6" />,
    title: "GEO・SEO対策",
    enTitle: "GEO & SEO",
    description:
      "検索にもAIにも、正しく伝わるWebへ。\nSEOとGEOの両面から、事業内容が引用・発見されやすい\nページ設計と情報整理をサポートします。",
    href: "/geo-seo",
    linkLabel: "GEO・SEO対策について詳しく見る",
    orderClass: "md:order-5",
  },
  {
    key: "ai-consulting",
    id: "06",
    icon: (
      <span className="font-sans text-[0.7rem] font-bold tracking-[0.08em] md:text-[0.75rem]">
        AI
      </span>
    ),
    title: "AIコンサルティング",
    enTitle: "AI Consulting",
    description:
      "生成AIの活用から、\n社内マニュアル特化の社内用チャットボット制作まで。\n業務で使える形に落とし込み、導入後も伴走します。",
    href: "/ai-consulting",
    linkLabel: "AIコンサルティングについて詳しく見る",
    orderClass: "md:order-6",
  },
] as const;

type Service = (typeof services)[number];

function AiToolKeywordRain({ active }: { active: boolean }) {
  const keywords = [
    "生成AI",
    "社内ボット",
    "社内マニュアル",
    "ナレッジ",
    "業務効率化",
    "社内FAQ",
    "就業ルール",
    "商品知識",
    "導入支援",
    "プロンプト",
    "社内ボット",
    "生成AI",
    "伴走支援",
    "AI活用",
    "社内マニュアル",
    "ナレッジ",
    "業務効率化",
    "社内FAQ",
  ] as const;

  const columnCount = 3;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-300",
        active ? "opacity-[0.55]" : "opacity-0",
      )}
      aria-hidden
    >
      <div className="flex h-full w-full justify-between gap-3 px-6 md:gap-6 md:px-12">
        {Array.from({ length: columnCount }, (_, col) => {
          const duration = 13 + (col % 4) * 3.2;
          const columnWords = Array.from({ length: 10 }, (_, row) => {
            return keywords[(col * 5 + row * 2) % keywords.length]!;
          });

          return (
            <div key={col} className="relative h-full min-w-0 flex-1 overflow-hidden">
              <div
                className={cn(
                  "flex flex-col items-start gap-5 py-3 font-sans",
                  active && "geo-keyword-rain-track",
                )}
                style={active ? { animationDuration: `${duration}s` } : undefined}
              >
                {[...columnWords, ...columnWords].map((word, row) => (
                  <span
                    key={`${col}-${row}`}
                    className="block whitespace-nowrap text-[11px] font-medium tracking-wide text-amami-blue md:text-sm"
                    style={{
                      opacity: 0.08 + ((col + row) % 5) * 0.035,
                      transform: `translateX(${((col * 9 + row * 5) % 24) - 6}px)`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GeoKeywordRain({ active }: { active: boolean }) {
  const keywords = [
    "GEO",
    "SEO",
    "AI検索",
    "引用",
    "LLM",
    "生成AI",
    "FAQ",
    "構造化データ",
    "llms.txt",
    "JSON-LD",
    "AI Overview",
    "検索順位",
    "メタ情報",
    "内部リンク",
    "AI回答",
    "発見性",
    "情報設計",
    "引用されやすさ",
  ] as const;

  const columnCount = 3;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-300",
        active ? "opacity-[0.55]" : "opacity-0",
      )}
      aria-hidden
    >
      <div className="flex h-full w-full justify-between gap-3 px-6 md:gap-6 md:px-12">
        {Array.from({ length: columnCount }, (_, col) => {
          const duration = 14 + (col % 4) * 3.5;
          const columnWords = Array.from({ length: 10 }, (_, row) => {
            const word = keywords[(col * 7 + row * 3) % keywords.length]!;
            return word;
          });

          return (
            <div key={col} className="relative h-full min-w-0 flex-1 overflow-hidden">
              <div
                className={cn(
                  "flex flex-col items-start gap-5 py-3 font-sans",
                  active && "geo-keyword-rain-track",
                )}
                style={
                  active
                    ? {
                        animationDuration: `${duration}s`,
                      }
                    : undefined
                }
              >
                {[...columnWords, ...columnWords].map((word, row) => (
                  <span
                    key={`${col}-${row}`}
                    className="block whitespace-nowrap text-[11px] font-medium tracking-wide text-amami-blue md:text-sm"
                    style={{
                      opacity: 0.08 + ((col + row) % 5) * 0.035,
                      transform: `translateX(${((col * 11 + row * 7) % 28) - 8}px)`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// サービスカードコンポーネント
function ServiceCard({
  service,
  index,
  entrance = true,
}: {
  service: Service;
  index: number;
  entrance?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={entrance ? { opacity: 0, y: 50 } : false}
      whileInView={entrance ? { opacity: 1, y: 0 } : undefined}
      viewport={entrance ? { once: true } : undefined}
      transition={entrance ? { delay: index * 0.1, duration: 0.8 } : undefined}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm transition-[transform,box-shadow] duration-500 hover:shadow-xl md:rounded-[2rem] md:p-8",
        service.orderClass,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      {/* ホバー時の背景アニメーション - 中央最背面に配置 */}
      {service.key === "system" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.25 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0"
        >
          {/* 装飾は検索本文に混ざらない抽象的なバーで表現する */}
          <div className="w-64 h-48 font-mono text-xs leading-relaxed text-amami-blue p-4 border border-amami-blue/30 rounded bg-amami-blue/10 overflow-hidden flex flex-col">
            <motion.div
              initial={{ y: 0 }}
              animate={isHovered ? { y: -80 } : { y: 0 }}
              transition={{ duration: 4, ease: "linear", repeat: isHovered ? Infinity : 0 }}
              className="space-y-2"
              aria-hidden
            >
              {Array.from({ length: 14 }, (_, row) => (
                <span
                  key={row}
                  className="block h-2 rounded-full bg-current"
                  style={{
                    marginLeft: `${(row % 4) * 12}px`,
                    opacity: 0.25 + (row % 3) * 0.15,
                    width: `${35 + ((row * 19) % 55)}%`,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}

      {service.key === "web" && (
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
              initial={{ scaleX: 0 }}
              animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-3 h-4 origin-left bg-current opacity-70"
            />

            {/* コンテンツエリア */}
            <div className="mb-3 flex h-24 gap-2">
              {/* サイドバー */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={isHovered ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="h-full w-1/3 origin-top bg-current opacity-40"
              />
              {/* メインカラム */}
              <div className="flex w-2/3 flex-col gap-2">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="h-12 origin-left bg-current opacity-30"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="h-full origin-left bg-current opacity-30"
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

      {service.key === "design" && (
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
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0 }}
              className="opacity-50"
            />
            {/* 四角 - 右下 */}
            <motion.rect 
              x="55" y="55" width="30" height="30" 
              fill="currentColor" 
              initial={{ scale: 0, rotate: 0 }} 
              animate={{ scale: isHovered ? 1 : 0, rotate: isHovered ? 15 : 0 }} 
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.1 }}
              className="opacity-40"
            />
            {/* 三角形 - 右上 */}
            <motion.path 
              d="M70 10 L85 40 L55 40 Z" 
              fill="currentColor" 
              initial={{ scale: 0 }} 
              animate={{ scale: isHovered ? 1 : 0 }} 
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.2 }}
              className="opacity-30"
            />
            {/* 五角形 - 左下 */}
            <motion.path 
              d="M25 55 L40 65 L35 80 L15 80 L10 65 Z" 
              fill="currentColor" 
              initial={{ scale: 0 }} 
              animate={{ scale: isHovered ? 1 : 0 }} 
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.3 }}
              className="opacity-30"
            />
          </svg>
        </motion.div>
      )}

      {/* 右上アイコンはカード基準で固定（本文幅の影響を受けない） */}
      <div className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-[transform,background-color,color] duration-300 group-hover:scale-110 group-hover:bg-amami-blue-light/20 group-hover:text-amami-blue md:top-6 md:right-6 md:h-11 md:w-11">
        {service.icon}
      </div>

      {service.key === "geo" && <GeoKeywordRain active={isHovered} />}
      {service.key === "ai-consulting" && <AiToolKeywordRain active={isHovered} />}

      {service.key === "chatbot" && (
        <motion.div
          initial={{ opacity: 0.7, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0.85, y: isHovered ? 0 : 4 }}
          transition={{ duration: 0.35 }}
          className="pointer-events-none absolute bottom-6 right-2 z-20 md:bottom-8 md:right-3"
          aria-hidden
        >
          <RabbitAvatar mood={isHovered ? "happy" : "idle"} size={80} animateFloat={false} />
        </motion.div>
      )}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="pr-12 md:pr-14">
          <span className="mb-4 block font-serif text-2xl text-slate-200 transition-colors group-hover:text-amami-blue/20 md:mb-5 md:text-3xl">
            {service.id}
          </span>

          <h3 className="mb-1.5 font-serif text-lg text-slate-800 md:mb-2 md:text-2xl">{service.title}</h3>
          <span className="mb-3 block font-sans text-[10px] uppercase tracking-widest text-amami-blue md:mb-5 md:text-xs">
            {service.enTitle}
          </span>
        </div>

        <p className="font-sans text-sm leading-relaxed whitespace-pre-line text-slate-500 md:text-base md:leading-relaxed">
          {service.description}
        </p>

        <div
          className={cn(
            "mt-auto pt-6",
            service.key === "chatbot" && "pr-16 md:pr-20",
          )}
        >
          <Link
            href={service.href}
            className="inline-flex items-center whitespace-nowrap font-sans text-xs font-medium text-amami-blue transition hover:text-amami-blue/80 md:text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {service.linkLabel}
          </Link>
          <div className="mt-5 h-px w-full bg-slate-100 transition-colors duration-500 group-hover:bg-amami-blue md:mt-6" />
        </div>
      </div>
    </motion.div>
  );
}

function ServicesCopy({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("mx-auto max-w-3xl text-center", className)}
    >
      <SectionEyebrow label="Services" color="blue" />

      <h2 className="mb-8 font-serif text-3xl leading-tight tracking-normal text-slate-800 md:text-5xl">
        島暮らしを、<br />
        ちょっと便利に。
      </h2>
      <p className="mx-auto max-w-2xl font-sans text-base leading-loose text-slate-500 md:text-lg">
        難しそうなITのことも、私たちにお任せください。<br />
        お客様一人ひとりのペースに合わせて、<br />
        最適な解決策をご提案します。
      </p>
    </motion.div>
  );
}

function MobileServicesScroller() {
  const { containerRef, layout, reduceMotion, setDotRef, stickyRef, trackRef, x } =
    usePinnedHorizontalScroll(services.length);

  if (reduceMotion) {
    return (
      <div className="md:hidden">
        <ServicesCopy />
        <div className="mt-8 space-y-5">
          {services.map((service, index) => (
            <ServiceCard key={service.key} service={service} index={index} entrance={false} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 w-[calc(100%+2rem)] min-w-0 max-w-[calc(100%+2rem)] md:hidden"
      style={{ height: layout.containerHeight }}
      aria-label="サービスカード。縦スクロールで横に進みます"
    >
      <div
        ref={stickyRef}
        className="sticky z-10 flex w-full min-w-0 overflow-hidden"
        style={{ top: layout.stickyTop }}
      >
        <div className="w-full overflow-hidden">
          <div className="px-5">
            <ServicesCopy />
          </div>

          <motion.div
            ref={trackRef}
            style={{ x }}
            className="mt-8 flex w-max items-stretch gap-5 px-6 will-change-transform"
          >
            {services.map((service, index) => (
              <div
                key={service.key}
                className="w-[min(80vw,22rem)] shrink-0"
                data-service-card={index}
              >
                <ServiceCard service={service} index={index} entrance={false} />
              </div>
            ))}
          </motion.div>

          <div className="mt-6 flex justify-center gap-2 px-6" aria-hidden>
            {services.map((service, index) => (
              <span
                key={service.key}
                ref={(node) => setDotRef(index, node)}
                className="pinned-scroll-dot h-1.5 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Services() {
  return (
    <Section
      id="services"
      className="relative !overflow-visible bg-gradient-to-b from-white to-slate-50 py-20 md:py-32"
      background={<WaveBackground color="blue" position="full" opacity={0.12} speed={14} />}
    >
      <MobileServicesScroller />

      <div className="hidden md:block">
        <ServicesCopy className="mb-32" />
        <div className="relative z-10 grid auto-rows-fr gap-5 md:grid-cols-3 md:gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.key} service={service} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}
