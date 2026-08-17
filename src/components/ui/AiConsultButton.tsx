"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Sparkles, X } from "lucide-react";
import { AI_CONSULT_LINKS } from "@/lib/ai-consult";

export function AiConsultButton() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-auto fixed z-[70] max-md:bottom-[max(0.75rem,env(safe-area-inset-bottom))] max-md:right-[max(0.75rem,env(safe-area-inset-right))] md:bottom-[max(1.25rem,env(safe-area-inset-bottom))] md:right-[max(1.25rem,env(safe-area-inset-right))]"
    >
      <div className="relative flex flex-col items-end gap-2">
        <AnimatePresence>
          {open && (
            <motion.div
              id={panelId}
              role="dialog"
              aria-label="普段使っているAIに相談"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="mb-1 w-[min(calc(100vw-1.5rem),18.5rem)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
            >
              <p className="border-b border-slate-100 px-4 py-3 font-sans text-sm leading-relaxed text-slate-700">
                普段使っているAIに相談できます
              </p>
              <ul>
                {AI_CONSULT_LINKS.map((item) => (
                  <li key={item.id} className="border-b border-slate-50 last:border-b-0">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 px-4 py-3 font-sans text-sm text-slate-800 transition-colors hover:bg-amami-blue-light/40"
                    >
                      <span className="font-medium">{item.name}</span>
                      <ExternalLink className="size-3.5 shrink-0 text-slate-400" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "AI相談メニューを閉じる" : "普段使っているAIに相談する"}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 px-4 py-2.5 font-sans text-sm font-medium text-white shadow-[0_8px_24px_rgba(14,165,233,0.35)] transition hover:brightness-105 max-md:px-3.5 max-md:py-2 max-md:text-[13px]"
        >
          {open ? <X className="size-4" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
          AI相談
        </button>
      </div>
    </div>
  );
}
