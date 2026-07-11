"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
  singleLineOnMobile,
}: {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  singleLineOnMobile?: boolean;
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
        <span
          className={cn(
            "font-serif text-base leading-snug text-slate-800 md:text-lg",
            singleLineOnMobile && "whitespace-nowrap text-sm sm:text-base"
          )}
        >
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

      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
        role="region"
        aria-labelledby={buttonId}
      >
        <div className="overflow-hidden">
          <p className="border-t border-slate-100 px-5 pb-5 pt-4 font-sans text-sm leading-loose text-slate-600 md:px-8 md:pb-6 md:text-base">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export type FaqAccordionEntry = {
  id: string;
  question: string;
  answer: string;
  singleLineOnMobile?: boolean;
};

export function FaqAccordion({ items }: { items?: FaqAccordionEntry[] }) {
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

  if (items) {
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <FaqAccordionItem
            key={item.id}
            id={item.id}
            question={item.question}
            answer={item.answer}
            singleLineOnMobile={item.singleLineOnMobile}
            isOpen={openIds.has(item.id)}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </div>
    );
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
