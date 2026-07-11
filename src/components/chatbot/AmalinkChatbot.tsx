"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Send, X } from "lucide-react";
import { RabbitAvatar, type RabbitMood } from "@/components/chatbot/RabbitAvatar";
import {
  CHATBOT_CONTACT_PATH,
  CHATBOT_GREETING,
  CHATBOT_NAME,
} from "@/lib/chatbot-knowledge";
import { cn } from "@/lib/utils";

type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  showContactLink?: boolean;
};

const OPEN_EVENT = "amalink-open-chat";

export function openAmalinkChat() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  }
}

export function AmalinkChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [mood, setMood] = useState<RabbitMood>("idle");
  const [messages, setMessages] = useState<UiMessage[]>([
    { id: "greet", role: "assistant", content: CHATBOT_GREETING },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) {
      setMood("idle");
      return;
    }
    setMood("happy");
    const t = setTimeout(() => setMood("idle"), 1600);
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 280);
    return () => {
      clearTimeout(t);
      clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending, open]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || pending) return;

    const userMsg: UiMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setPending(true);
    setMood("thinking");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        showContactLink?: boolean;
      };
      const reply =
        data.reply?.trim() ||
        "うまく答えられなかったみたい。奄美大島やAMALINKのこと、別の聞き方で試してみてね。";

      setMood("talking");
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply,
          showContactLink: Boolean(data.showContactLink),
        },
      ]);
      setTimeout(() => setMood("idle"), Math.min(2200, 400 + reply.length * 18));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "通信に失敗しちゃった。少し待ってから、もう一度話しかけてね。",
        },
      ]);
      setMood("thinking");
      setTimeout(() => setMood("idle"), 1200);
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  const suggestions = [
    "AMALINKってどんな会社？",
    "ホームページ制作お願いできる？",
    "奄美大島以外からも依頼できる？",
  ];

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[80] flex flex-col items-start",
        "max-md:bottom-0 max-md:left-[max(0.25rem,env(safe-area-inset-left))]",
        "md:bottom-0 md:left-[max(0.75rem,env(safe-area-inset-left))]",
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.7 }}
            className="pointer-events-auto mb-2 ml-2 flex w-[min(100vw-1.5rem,22.5rem)] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-md max-md:mb-1"
            role="dialog"
            aria-label={`${CHATBOT_NAME}チャット`}
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 px-4 py-3 text-white">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.25), transparent 40%)",
                }}
              />
              <div className="relative flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg leading-tight">{CHATBOT_NAME}</p>
                  <p className="truncate font-sans text-[11px] text-white/85">
                    奄美大島 &amp; AMALINK 案内係
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
                  aria-label="チャットを閉じる"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={listRef}
              className="flex max-h-[min(52vh,26rem)] flex-col gap-3 overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-3 py-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex max-w-[90%] flex-col gap-2",
                    m.role === "user" ? "ml-auto items-end" : "mr-auto items-start",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-3.5 py-2.5 font-sans text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-amami-blue text-white"
                        : "border border-slate-100 bg-white text-slate-700 shadow-sm",
                    )}
                  >
                    {m.content}
                  </div>
                  {m.role === "assistant" && m.showContactLink && (
                    <Link
                      href={CHATBOT_CONTACT_PATH}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amami-blue/30 bg-amami-blue-light/50 px-3 py-1.5 font-sans text-xs font-medium text-amami-blue transition hover:border-amami-blue/50 hover:bg-amami-blue-light"
                    >
                      お問い合わせページへ
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </Link>
                  )}
                </div>
              ))}
              {pending && (
                <div className="mr-auto flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3.5 py-2.5 text-sm text-slate-500 shadow-sm">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amami-blue [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amami-green [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amami-blue [animation-delay:240ms]" />
                  </span>
                  考え中…
                </div>
              )}
              {messages.length <= 1 && !pending && (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void sendMessage(s)}
                      className="rounded-full border border-amami-blue/25 bg-amami-blue-light/40 px-3 py-1.5 font-sans text-xs text-slate-700 transition hover:border-amami-blue/50 hover:bg-amami-blue-light"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="奄美やAMALINKのことを聞いてね"
                maxLength={800}
                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 font-sans text-sm outline-none transition focus:border-amami-blue focus:bg-white"
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-md transition enabled:hover:brightness-105 disabled:opacity-40"
                aria-label="送信"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 左下から顔を見せる → クリックで登場（高さ固定で開閉時のガクつき防止） */}
      <div className="pointer-events-auto relative ml-1 h-[100px] w-[112px] max-md:h-[92px] max-md:w-[100px]">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-full left-1 z-10 mb-4"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="whitespace-nowrap rounded-2xl bg-slate-900 px-3 py-1.5 font-sans text-[11px] font-medium text-white shadow-lg"
              >
                くろうさと話す
              </button>
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-5 h-3 w-3 rotate-45 bg-slate-900"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 上にジャンプ余白を確保し、耳が overflow で切れないようにする */}
        <div className="absolute -top-3 bottom-0 left-0 right-0 overflow-hidden">
          <motion.button
            type="button"
            className="absolute left-1/2 top-3 -translate-x-1/2"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "チャットを閉じる" : `${CHATBOT_NAME}に話しかける`}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              animate={
                open
                  ? { y: 0 }
                  : {
                      y: [0, 0, -10, 0, 0],
                    }
              }
              transition={
                open
                  ? { duration: 0.2 }
                  : {
                      duration: 0.7,
                      times: [0, 0.72, 0.84, 0.94, 1],
                      repeat: Infinity,
                      repeatDelay: 2.4,
                      ease: "easeOut",
                    }
              }
            >
              <RabbitAvatar
                mood={open ? mood : "idle"}
                size={118}
                priority
                animateFloat={false}
              />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
