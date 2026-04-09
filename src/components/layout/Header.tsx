"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "About", href: "/#about", label: "私たちについて", en: "About Us" },
    { name: "Services", href: "/#services", label: "サービス", en: "Services" },
    { name: "News", href: "/news", label: "お知らせ", en: "News" },
    { name: "Contact", href: "/contact", label: "お問い合わせ", en: "Contact" },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-transparent py-8 pointer-events-none">
        {/* Container for logo and menu - blend mode applied individually */}
        <div className="container mx-auto px-6 flex justify-between items-center relative z-50 pointer-events-auto">
          
          {/* Logo - mix-blend-normal to prevent color inversion */}
          <Link href="/" className="group flex items-center gap-2 mix-blend-normal">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image 
                src="/logo.png" 
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
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative font-medium tracking-wide transition-colors duration-500 hover:text-amami-blue"
              >
                <span>{item.label}</span>
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gradient-to-r from-amami-blue to-amami-green group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button - Wavy Lines Animation */}
          <button
            className="md:hidden p-2 rounded-full transition-colors hover:bg-white/10 relative z-[70] mix-blend-normal group"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-8 h-6 flex flex-col justify-between items-center overflow-hidden py-1">
                {/* Top Wavy Bar */}
                <svg width="24" height="4" viewBox="0 0 24 4" fill="none" xmlns="http://www.w3.org/2000/svg" 
                     className="transition-transform duration-300 origin-center"
                     style={{ transform: isOpen ? "translateY(7px) rotate(45deg)" : "none" }}>
                    <path d="M1 2C4 0 8 0 11 2C14 4 18 4 21 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                          className="text-slate-900 group-hover:text-amami-blue transition-colors duration-300" />
                </svg>
                
                {/* Middle Wavy Bar */}
                <svg width="24" height="4" viewBox="0 0 24 4" fill="none" xmlns="http://www.w3.org/2000/svg" 
                     className="transition-opacity duration-300"
                     style={{ opacity: isOpen ? 0 : 1 }}>
                    <path d="M1 2C4 0 8 0 11 2C14 4 18 4 21 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                          className="text-slate-900 group-hover:text-amami-green transition-colors duration-300" />
                </svg>

                {/* Bottom Wavy Bar */}
                <svg width="24" height="4" viewBox="0 0 24 4" fill="none" xmlns="http://www.w3.org/2000/svg" 
                     className="transition-transform duration-300 origin-center"
                     style={{ transform: isOpen ? "translateY(-7px) rotate(-45deg)" : "none" }}>
                    <path d="M1 2C4 0 8 0 11 2C14 4 18 4 21 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                          className="text-slate-900 group-hover:text-amami-blue transition-colors duration-300" />
                </svg>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-white z-[60] flex flex-col justify-center items-center"
          >
            {/* Close Button (X) - Top Right */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-6 p-3 rounded-full transition-colors hover:bg-slate-100 z-[70] group"
              aria-label="Close menu"
            >
              <div className="w-6 h-6 relative">
                {/* Straight X lines */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" 
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {/* Diagonal line from top-left to bottom-right */}
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                        className="text-slate-900 group-hover:text-amami-blue transition-colors duration-300" />
                  {/* Diagonal line from top-right to bottom-left */}
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                        className="text-slate-900 group-hover:text-amami-green transition-colors duration-300" />
                </svg>
              </div>
            </motion.button>

            {/* Background Decoration */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-amami-blue-light/30 rounded-full blur-[60px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-amami-green-light/30 rounded-full blur-[60px]" />
            
            {/* Decorative Lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-slate-50 opacity-50" />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-50 opacity-50" />

            <div className="flex flex-col items-center space-y-12 relative z-10 w-full">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  custom={i}
                  variants={linkVariants}
                  className="w-full text-center"
                >
                  <Link
                    href={item.href}
                    className="group flex flex-col items-center justify-center relative py-4"
                    onClick={() => setIsOpen(false)}
                  >
                    {/* Gradient Hover Effect for Menu Text */}
                    <span className="text-2xl font-serif font-medium text-slate-800 transition-all duration-300 relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amami-blue group-hover:to-amami-green">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-sans text-slate-400 tracking-[0.3em] mt-2 uppercase relative z-10 group-hover:text-amami-blue/60 transition-colors duration-300">
                      {item.en}
                    </span>
                    
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-slate-50 rounded-full -z-0 group-hover:w-32 group-hover:h-32 transition-all duration-500 ease-out opacity-50" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-12 text-center"
            >
              <p className="text-slate-300 text-[10px] font-sans tracking-widest">
                © AMALINK
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
