"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Send, X } from "lucide-react";
import { RabbitAvatar, type RabbitMood } from "@/components/chatbot/RabbitAvatar";
import {
  CHATBOT_CONTACT_PATH,
  CHATBOT_NAME,
} from "@/lib/chatbot-knowledge";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/useLocale";
import { withLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  showContactLink?: boolean;
};

const OPEN_EVENT = "amalink-open-chat";
/** クライアント側の連打防止（秒） */
const CLIENT_SEND_COOLDOWN_MS = 1500;
const CLIENT_MAX_USER_MESSAGES = 30;

export function openAmalinkChat() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  }
}

export function AmalinkChatbot() {
  const locale = useLocale();
  const t = getMessages(locale).chatbot;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [mood, setMood] = useState<RabbitMood>("idle");
  const [messages, setMessages] = useState<UiMessage[]>([
    { id: "greet", role: "assistant", content: t.greeting },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSendAtRef = useRef(0);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    setMessages([{ id: "greet", role: "assistant", content: t.greeting }]);
  }, [t.greeting]);

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

    const now = Date.now();
    if (now - lastSendAtRef.current < CLIENT_SEND_COOLDOWN_MS) {
      return;
    }

    const userCount = messages.filter((m) => m.role === "user").length;
    if (userCount >= CLIENT_MAX_USER_MESSAGES) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content:
            "いっぱい話してくれてありがとう。続きはお問い合わせからもどうぞ。",
          showContactLink: true,
        },
      ]);
      return;
    }

    lastSendAtRef.current = now;

    const userMsg: UiMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: content.slice(0, 800),
    };
    const nextMessages = [...messages, userMsg].slice(-24);
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

      if (res.status === 429) {
        setMood("thinking");
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content:
              data.reply?.trim() ||
              "ごめんね、いまちょっと込み合ってるみたい。少し待ってから、もう一度話しかけてね。",
          },
        ]);
        setTimeout(() => setMood("idle"), 1200);
        return;
      }

      if (res.status === 403 || res.status === 413) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: "うまく送れなかったみたい。少し時間をおいてから試してね。",
          },
        ]);
        setMood("thinking");
        setTimeout(() => setMood("idle"), 1200);
        return;
      }

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

  const suggestions = t.suggestions;

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[80] flex flex-col items-start",
        "max-md:bottom-0 max-md:left-[max(0.125rem,env(safe-area-inset-left))]",
        "md:bottom-0 md:left-[max(0.5rem,env(safe-area-inset-left))]",
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.8 }}
            className="pointer-events-auto mb-2 ml-2 flex w-[min(100vw-1.5rem,22.5rem)] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14)] max-md:mb-1"
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
                    {t.role}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
                  aria-label={t.close}
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
                      href={withLocale(CHATBOT_CONTACT_PATH, locale)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amami-blue/30 bg-amami-blue-light/50 px-3 py-1.5 font-sans text-xs font-medium text-amami-blue transition hover:border-amami-blue/50 hover:bg-amami-blue-light"
                    >
                      {t.contactPage}
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
                  {t.thinking}
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
                placeholder={t.placeholder}
                maxLength={800}
                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 font-sans text-sm outline-none transition focus:border-amami-blue focus:bg-white"
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-md transition enabled:hover:brightness-105 disabled:opacity-40"
                aria-label={t.send}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 左下から顔を見せる → クリックで登場（高さ固定で開閉時のガクつき防止） */}
      <div className="pointer-events-auto relative ml-1 h-[80px] w-[88px] origin-bottom-left max-md:ml-0 max-md:h-[64px] max-md:w-[70px] max-md:scale-[0.92]">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-full left-1 z-10 mb-3 max-md:hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="whitespace-nowrap rounded-2xl bg-slate-900 px-3 py-1.5 font-sans text-[11px] font-medium text-white shadow-lg"
              >
                {t.talk}
              </button>
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-5 h-3 w-3 rotate-45 bg-slate-900"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 上にジャンプ余白を確保し、耳が overflow で切れないようにする */}
        <div className="absolute -top-2 bottom-0 left-0 right-0 overflow-hidden">
          <motion.button
            type="button"
            className="absolute left-1/2 top-2 -translate-x-1/2"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t.close : t.open}
            whileTap={{ scale: 0.97 }}
          >
            <div className={open ? undefined : "chatbot-rabbit-hop"}>
              <RabbitAvatar
                mood={open ? mood : "idle"}
                size={92}
                priority
                animateFloat={false}
              />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
