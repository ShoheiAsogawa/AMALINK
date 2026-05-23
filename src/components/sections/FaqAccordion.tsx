"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  type FaqCategoryId,
} from "@/lib/site-content";

function FaqAccordionItem({
  id,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const buttonId = `faq-btn-${id}`;
  const panelId = `faq-panel-${id}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <button
        type="button"
        id={buttonId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left md:px-8 md:py-6"
      >
        <span className="font-serif text-base leading-snug text-slate-800 md:text-lg">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "mt-0.5 size-5 shrink-0 text-slate-400 transition-transform duration-300",
            isOpen && "rotate-180 text-amami-blue"
          )}
          aria-hidden
        />
      </button>

      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
        role="region"
        aria-labelledby={buttonId}
      >
        <p className="border-t border-slate-100 px-5 pb-5 pt-4 font-sans text-sm leading-loose text-slate-600 md:px-8 md:pb-6 md:text-base">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export function FaqAccordion() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const grouped = (Object.keys(FAQ_CATEGORIES) as FaqCategoryId[]).map((categoryId) => ({
    categoryId,
    label: FAQ_CATEGORIES[categoryId],
    items: FAQ_ITEMS.filter((item) => item.category === categoryId),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="space-y-10">
      {grouped.map((group) => (
        <section key={group.categoryId}>
          <h2 className="mb-4 font-sans text-xs font-medium uppercase tracking-widest text-amami-blue md:text-sm">
            {group.label}
          </h2>
          <div className="space-y-3">
            {group.items.map((item) => (
              <FaqAccordionItem
                key={item.id}
                id={item.id}
                question={item.question}
                answer={item.answer}
                isOpen={openIds.has(item.id)}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
