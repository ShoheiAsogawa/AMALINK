"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Mail } from "lucide-react";
import { OfficialLineIcon } from "@/components/ui/OfficialLineIcon";
import { getOfficialLineAddFriendUrl } from "@/lib/seo";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type NavItem = {
  name: string;
  href: string;
  label: string;
  en: string;
  external?: boolean;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const lineUrl = getOfficialLineAddFriendUrl();

  const navItems: NavItem[] = [
    { name: "About", href: "/#about", label: "私たちについて", en: "About Us" },
    { name: "Services", href: "/#services", label: "サービス", en: "Services" },
    { name: "News", href: "/news", label: "お知らせ", en: "News" },
    { name: "OfficialLINE", href: lineUrl, label: "公式LINE", en: "LINE", external: true },
    { name: "Contact", href: "/contact", label: "お問い合わせ", en: "Contact" },
  ];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const closeIfDesktop = () => {
      if (mq.matches) setIsOpen(false);
    };
    closeIfDesktop();
    mq.addEventListener("change", closeIfDesktop);
    return () => mq.removeEventListener("change", closeIfDesktop);
  }, []);

  return (
    <>
      <header className="fixed top-0 w-full z-[100] bg-transparent py-8 pointer-events-none">
        {/* Container for logo and menu - blend mode applied individually */}
        <div className="container mx-auto px-6 flex justify-between items-center relative z-[100] pointer-events-auto">
          
          {/* Logo - mix-blend-normal to prevent color inversion */}
          <Link href="/" className="group flex items-center gap-2 mix-blend-normal">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image 
                src={`${assetBase}/logo.png`}
                alt="AMALINK Logo" 
                fill
                className="object-contain" 
              />
            </div>
            {/* Title with gradient hover - using background-clip for smooth transition */}
            <span className="text-xl md:text-2xl font-sans font-bold tracking-widest text-slate-900 transition-colors duration-500 group-hover:text-amami-blue">
              AMALINK
            </span>
          </Link>

          {/* Desktop Nav（ハンバーガーはモバイルのみ md:hidden） */}
          <nav className="hidden md:flex space-x-10 mix-blend-normal text-slate-900">
            {navItems.map((item) => {
              const className =
                "group relative font-medium tracking-wide transition-colors duration-500 hover:text-amami-blue";
              return item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  <span>{item.label}</span>
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gradient-to-r from-amami-blue to-amami-green group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                <Link key={item.name} href={item.href} className={className}>
                  <span>{item.label}</span>
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gradient-to-r from-amami-blue to-amami-green group-hover:w-full transition-all duration-300" />
                </Link>
              );
            })}
          </nav>

          {/* Mobile のみ — デスクトップでは nav を表示し、このラベルは md:hidden で DOM から見えない */}
          <label
            className="inline-flex items-center justify-center amalink-hamburger md:hidden relative z-[110] mix-blend-normal rounded-full p-1 text-slate-900 transition-colors hover:bg-white/10 hover:text-amami-blue"
            aria-expanded={isOpen}
            aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
            />
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path
                className="amalink-hamburger-line amalink-hamburger-line-top-bottom"
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              />
              <path className="amalink-hamburger-line" d="M7 16 27 16" />
            </svg>
          </label>
        </div>
      </header>

      {/* Mobile Nav Overlay — ヘッダーより下のレイヤー。下からせり上げ（ハンバーガーが常に手前） */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "105%" }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              y: "105%",
              transition: { duration: 0.38, ease: [0.4, 0, 1, 1] },
            }}
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-white px-6 pb-16 pt-28 md:hidden"
          >
            {/* Background Decoration */}
            <div className="pointer-events-none absolute top-[-10%] right-[-10%] h-[300px] w-[300px] rounded-full bg-amami-blue-light/30 blur-[60px]" />
            <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-amami-green-light/30 blur-[60px]" />

            <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-50 opacity-50" />
            <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-50 opacity-50" />

            <div className="relative z-10 flex w-full flex-col items-center space-y-12">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.45 }}
                  className="w-full text-center"
                >
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col items-center justify-center py-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {item.name === "OfficialLINE" && (
                          <OfficialLineIcon className="h-9 w-9 shrink-0" aria-hidden />
                        )}
                        <span className="text-2xl font-serif font-medium text-slate-800 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-amami-blue group-hover:to-amami-green group-hover:bg-clip-text group-hover:text-transparent">
                          {item.label}
                        </span>
                      </span>
                      <span className="relative z-10 mt-2 text-[10px] font-sans uppercase tracking-[0.3em] text-slate-400 transition-colors duration-300 group-hover:text-amami-blue/60">
                        {item.en}
                      </span>
                      <span className="absolute left-1/2 top-1/2 -z-0 h-0 w-0 rounded-full bg-slate-50 opacity-50 transition-all duration-500 ease-out group-hover:h-32 group-hover:w-32 -translate-x-1/2 -translate-y-1/2" />
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="group relative flex flex-col items-center justify-center py-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {item.name === "Contact" && (
                          <Mail
                            className="h-7 w-7 shrink-0 text-slate-500"
                            strokeWidth={2}
                            aria-hidden
                          />
                        )}
                        <span className="text-2xl font-serif font-medium text-slate-800 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-amami-blue group-hover:to-amami-green group-hover:bg-clip-text group-hover:text-transparent">
                          {item.label}
                        </span>
                      </span>
                      <span className="relative z-10 mt-2 text-[10px] font-sans uppercase tracking-[0.3em] text-slate-400 transition-colors duration-300 group-hover:text-amami-blue/60">
                        {item.en}
                      </span>
                      <span className="absolute left-1/2 top-1/2 -z-0 h-0 w-0 rounded-full bg-slate-50 opacity-50 transition-all duration-500 ease-out group-hover:h-32 group-hover:w-32 -translate-x-1/2 -translate-y-1/2" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="pointer-events-none absolute bottom-12 text-center"
            >
              <p className="text-[10px] font-sans tracking-widest text-slate-300">© AMALINK</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
