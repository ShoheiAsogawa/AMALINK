"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Mail, Monitor, Newspaper, UserRound } from "lucide-react";
import { OfficialLineIcon } from "@/components/ui/OfficialLineIcon";
import { getOfficialLineAddFriendUrl } from "@/lib/seo";
import { ChunkyAnchor, ChunkyNextLink } from "@/components/ui/ChunkyButton";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** モバイル：タップ後にこの時間だけ待ってから遷移（動物アニメを見せる） */
const MOBILE_NAV_DELAY_MS = 520;

type NavItem = {
  name: string;
  href: string;
  label: string;
  en: string;
  external?: boolean;
};

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileAnimal, setActiveMobileAnimal] = useState<string | null>(null);
  const mobileAnimalTimerRef = useRef<number | null>(null);
  const lineUrl = getOfficialLineAddFriendUrl();
  const mobileNavIconClass = "size-[1em] shrink-0 opacity-90";

  const navItems: NavItem[] = [
    { name: "About", href: "/#about", label: "私たちについて", en: "About Us" },
    { name: "Services", href: "/#services", label: "サービス", en: "Services" },
    { name: "News", href: "/news", label: "お知らせ", en: "News" },
    { name: "OfficialLINE", href: lineUrl, label: "公式LINE", en: "LINE", external: true },
    { name: "Contact", href: "/contact", label: "お問い合わせ", en: "Contact" },
  ];

  function mobileNavIcon(itemName: string) {
    switch (itemName) {
      case "About":
        return <UserRound className={mobileNavIconClass} strokeWidth={2} aria-hidden />;
      case "Services":
        return <Monitor className={mobileNavIconClass} strokeWidth={2} aria-hidden />;
      case "News":
        return <Newspaper className={mobileNavIconClass} strokeWidth={2} aria-hidden />;
      case "OfficialLINE":
        return <OfficialLineIcon className="relative size-[1em] shrink-0" aria-hidden />;
      case "Contact":
        return <Mail className={mobileNavIconClass} strokeWidth={2} aria-hidden />;
      default:
        return null;
    }
  }

  function animalShellClass(itemName: NavItem["name"]): string {
    switch (itemName) {
      case "About":
        return "pointer-events-none absolute left-4 top-[34%] z-0 h-[2.25rem] w-[2.6rem]";
      case "Services":
        return "pointer-events-none absolute right-3 top-[36%] z-0 h-[2.25rem] w-[2.6rem]";
      case "News":
        return "pointer-events-none absolute left-3 top-[22%] z-0 h-[2.35rem] w-[2.25rem] overflow-visible [clip-path:inset(0_0_12%_0)]";
      case "OfficialLINE":
        return "pointer-events-none absolute right-4 top-[28%] z-0 h-[2.45rem] w-[2.35rem]";
      case "Contact":
        return "pointer-events-none absolute left-4 top-[32%] z-0 h-[2.15rem] w-[3rem]";
      default:
        return "";
    }
  }

  function navMenuAnimal(itemName: string, isActive: boolean) {
    switch (itemName) {
      case "About":
        return (
          <motion.div
            className={animalShellClass("About")}
            initial={false}
            animate={
              isActive
                ? { y: -48, rotate: -4, opacity: 1, scale: 1 }
                : { y: 0, rotate: -10, opacity: 0.96, scale: 0.86 }
            }
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={`${assetBase}/menu-about-bird.png`}
              alt=""
              width={382}
              height={337}
              className="h-full w-full object-contain object-left-bottom drop-shadow-[0_3px_5px_rgba(15,23,42,0.18)]"
              sizes="42px"
            />
          </motion.div>
        );
      case "Services":
        return (
          <motion.div
            className={animalShellClass("Services")}
            initial={false}
            animate={
              isActive
                ? { y: -42, rotate: 5, opacity: 1, scale: 1 }
                : { y: 2, rotate: 10, opacity: 0.96, scale: 0.86 }
            }
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={`${assetBase}/menu-service-kingfisher.png`}
              alt=""
              width={322}
              height={288}
              className="h-full w-full object-contain object-right-bottom drop-shadow-[0_3px_5px_rgba(15,23,42,0.18)]"
              sizes="42px"
            />
          </motion.div>
        );
      case "News":
        /* 足元だけ隠したいのに overflow-hidden + translate-y で上に逃がすと、顔が上辺で途切れる。
           clip-path で下端だけトリミングする（見える領域は上〜中央寄り）。 */
        return (
          <motion.div
            className={animalShellClass("News")}
            initial={false}
            animate={
              isActive
                ? { x: -18, y: -30, rotate: -10, opacity: 1, scale: 1 }
                : { x: 6, y: 0, rotate: -6, opacity: 0.96, scale: 0.88 }
            }
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={`${assetBase}/menu-news-hawk.png`}
              alt=""
              width={302}
              height={381}
              className="h-full w-full object-contain object-left-bottom drop-shadow-[0_3px_5px_rgba(15,23,42,0.18)]"
              sizes="40px"
            />
          </motion.div>
        );
      case "OfficialLINE":
        return (
          <motion.div
            className={animalShellClass("OfficialLINE")}
            initial={false}
            animate={
              isActive
                ? { x: 46, rotate: 6, opacity: 1, scale: 1 }
                : { x: 0, rotate: 3, opacity: 0.96, scale: 0.86 }
            }
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={`${assetBase}/menu-line-rabbit.png`}
              alt=""
              width={317}
              height={344}
              className="h-full w-full object-contain object-right-center drop-shadow-[0_3px_5px_rgba(15,23,42,0.18)]"
              sizes="39px"
            />
          </motion.div>
        );
      case "Contact":
        return (
          <motion.div
            className={animalShellClass("Contact")}
            initial={false}
            animate={
              isActive
                ? { x: -48, rotate: -5, opacity: 1, scale: 1 }
                : { x: 0, rotate: -2, opacity: 0.96, scale: 0.86 }
            }
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={`${assetBase}/menu-contact-snake.png`}
              alt=""
              width={390}
              height={285}
              className="h-full w-full object-contain object-left-center drop-shadow-[0_3px_5px_rgba(15,23,42,0.18)]"
              sizes="48px"
            />
          </motion.div>
        );
      default:
        return null;
    }
  }

  function shouldDeferMobileNavClick(e: React.MouseEvent) {
    return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
  }

  function triggerMobileAnimal(itemName: string) {
    if (mobileAnimalTimerRef.current) {
      window.clearTimeout(mobileAnimalTimerRef.current);
    }
    setActiveMobileAnimal(itemName);
    mobileAnimalTimerRef.current = window.setTimeout(() => {
      setActiveMobileAnimal(null);
    }, 620);
  }

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const closeIfDesktop = () => {
      if (mq.matches) setIsOpen(false);
    };
    closeIfDesktop();
    mq.addEventListener("change", closeIfDesktop);
    return () => mq.removeEventListener("change", closeIfDesktop);
  }, []);

  useEffect(() => {
    return () => {
      if (mobileAnimalTimerRef.current) {
        window.clearTimeout(mobileAnimalTimerRef.current);
      }
    };
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

          {/* Desktop Nav */}
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
                  <span className="absolute -bottom-2 left-0 h-[1px] w-0 bg-gradient-to-r from-amami-blue to-amami-green transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <Link key={item.name} href={item.href} className={className}>
                  <span>{item.label}</span>
                  <span className="absolute -bottom-2 left-0 h-[1px] w-0 bg-gradient-to-r from-amami-blue to-amami-green transition-all duration-300 group-hover:w-full" />
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
            initial={{ y: "100%" }}
            animate={{
              y: 0,
              transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              y: "100%",
              transition: { duration: 0.26, ease: [0.4, 0, 1, 1] },
            }}
            style={{ willChange: "transform" }}
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-white px-5 pb-12 pt-24 md:hidden"
          >
            <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-50 opacity-50" />
            <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-50 opacity-50" />

            <div className="relative z-10 flex w-full max-w-[18rem] flex-col items-stretch gap-2.5">
              {navItems.map((item, i) => (
                <div
                  key={item.name}
                  className="amalink-mobile-nav-item relative w-full overflow-visible"
                  style={{ "--amalink-nav-i": i } as React.CSSProperties}
                >
                  {navMenuAnimal(item.name, activeMobileAnimal === item.name)}
                  {item.external ? (
                    <ChunkyAnchor
                      href={item.href}
                      theme="blue"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative z-10 flex w-full min-w-0"
                      onPointerDown={() => triggerMobileAnimal(item.name)}
                      onClick={(e) => {
                        if (shouldDeferMobileNavClick(e)) return;
                        e.preventDefault();
                        window.setTimeout(() => {
                          window.open(item.href, "_blank", "noopener,noreferrer");
                          setIsOpen(false);
                        }, MOBILE_NAV_DELAY_MS);
                      }}
                    >
                      <span className="flex w-full min-w-0 items-center justify-center gap-2 px-2">
                        <span className="flex shrink-0 translate-y-[0.11em] items-center justify-center">
                          {mobileNavIcon(item.name)}
                        </span>
                        <span className="flex min-h-[1em] min-w-0 items-center justify-center whitespace-nowrap text-center leading-none">
                          {item.label}
                        </span>
                      </span>
                    </ChunkyAnchor>
                  ) : (
                    <ChunkyNextLink
                      href={item.href}
                      theme="blue"
                      className="group relative z-10 flex w-full min-w-0"
                      onPointerDown={() => triggerMobileAnimal(item.name)}
                      onClick={(e) => {
                        if (shouldDeferMobileNavClick(e)) return;
                        e.preventDefault();
                        window.setTimeout(() => {
                          setIsOpen(false);
                          router.push(item.href);
                        }, MOBILE_NAV_DELAY_MS);
                      }}
                    >
                      <span className="flex w-full min-w-0 items-center justify-center gap-2 px-2">
                        <span className="flex shrink-0 translate-y-[0.11em] items-center justify-center">
                          {mobileNavIcon(item.name)}
                        </span>
                        <span className="flex min-h-[1em] min-w-0 items-center justify-center whitespace-nowrap text-center leading-none">
                          {item.label}
                        </span>
                      </span>
                    </ChunkyNextLink>
                  )}
                </div>
              ))}
            </div>

            <div className="amalink-mobile-nav-footer pointer-events-none absolute bottom-12 text-center">
              <p className="text-[10px] font-sans tracking-widest text-slate-300">© AMALINK</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
