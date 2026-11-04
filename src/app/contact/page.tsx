"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { WaveBackground } from "@/components/ui/WaveBackground";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChunkyButton, ChunkyNextLink } from "@/components/ui/ChunkyButton";

const NOTIFY_EMAIL = "uken.shohei@gmail.com";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState("");
  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !widgetEl.current || widgetId.current || !TURNSTILE_SITE_KEY) return;
    widgetId.current = window.turnstile.render(widgetEl.current, {
      sitekey: TURNSTILE_SITE_KEY,
      action: "contact",
      language: "ja",
      callback: (t: string) => setToken(t),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  }, []);

  useEffect(() => {
    if (scriptReady) renderWidget();
  }, [scriptReady, renderWidget, status]);

  useEffect(() => {
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);
    const payload = {
      category: String(formData.get("category") ?? ""),
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
      turnstileToken: token,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean };
      setStatus(res.ok && json.ok ? "success" : "error");
    } catch {
      setStatus("error");
    } finally {
      // トークンは1回限り。再送できるようにリセット
      setToken("");
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
        <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="lazyOnload"
            onReady={() => setScriptReady(true)}
        />
        <Header />
        
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 opacity-[0.03] bg-grain-noise" />
            <WaveBackground color="blue-dark" position="top" opacity={0.12} speed={15} />
            <WaveBackground color="blue-light" position="bottom" opacity={0.1} speed={17} />
        </div>

        <section className="pt-32 pb-20 px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-10 text-center md:mb-12"
                >
                    <p className="mb-3 font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">
                      Contact
                    </p>
                    <h1 className="mb-4 font-serif text-3xl text-slate-800 md:text-5xl">
                      お問い合わせ
                    </h1>
                    <p className="mx-auto max-w-xl font-sans leading-loose text-slate-600">
                      内容が固まっていなくても大丈夫です。
                      <br />
                      通常2営業日以内にご返信します。
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm md:p-12"
                >
                    {status === "success" ? (
                        <div className="text-center py-12">
                            <h3 className="text-2xl font-serif text-slate-800 mb-4">送信完了</h3>
                            <p className="text-slate-500 leading-loose">
                                お問い合わせありがとうございます。<br />
                                合同会社AMALINKの担当より、内容確認のうえご連絡します。<br />
                                しばらくお待ちくださいませ。
                            </p>
                            <ChunkyNextLink href="/" theme="primary" className="mt-10 inline-flex">
                                トップページへ戻る
                            </ChunkyNextLink>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative space-y-8">
                            {/* お問い合わせ項目 (Category) */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-3">
                                    お問い合わせ項目 <span className="text-amami-blue text-xs ml-1">必須</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                      "AIコンサルティングについて",
                                      "ホームページ制作について",
                                      "システム開発について",
                                      "デザインについて",
                                      "GEO・SEO対策について",
                                      "その他・ご相談",
                                    ].map((cat) => (
                                        <label key={cat} className="relative cursor-pointer group">
                                            <input type="radio" name="category" value={cat} className="peer sr-only" required />
                                            <div className="px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-sm transition-all peer-checked:bg-amami-blue-light peer-checked:border-amami-blue peer-checked:text-amami-blue group-hover:bg-white">
                                                {cat}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                                        お名前 <span className="text-amami-blue text-xs ml-1">必須</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-amami-blue focus:ring-2 focus:ring-amami-blue/20 outline-none transition-all placeholder:text-slate-300"
                                        placeholder="例）奄美 太郎"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                                        メールアドレス <span className="text-amami-blue text-xs ml-1">必須</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-amami-blue focus:ring-2 focus:ring-amami-blue/20 outline-none transition-all placeholder:text-slate-300"
                                        placeholder="例）info@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">
                                    お問い合わせ内容 <span className="text-slate-400 text-xs ml-1">任意</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-amami-blue focus:ring-2 focus:ring-amami-blue/20 outline-none transition-all resize-none placeholder:text-slate-300"
                                    placeholder="「こんなシステムを作りたい」「費用感を知りたい」など、ざっくりとした内容でも大丈夫です。"
                                />
                            </div>

                            {/* ハニーポット（人には見えない欄） */}
                            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                                <label htmlFor="website">ウェブサイト</label>
                                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                            </div>

                            <div ref={widgetEl} className="flex min-h-[65px] justify-center" />

                            <div className="pt-4 text-center">
                                <ChunkyButton
                                    type="submit"
                                    theme="primary"
                                    block
                                    disabled={status === "submitting" || !token}
                                    className="mx-auto w-full max-w-md md:inline-flex md:w-auto md:min-w-[280px]"
                                >
                                    {status === "submitting" ? "送信中..." : "上記の内容で送信する"}
                                </ChunkyButton>
                            </div>
                            
                            {status === "error" && (
                                <p className="text-red-500 text-center text-sm">
                                    送信に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、
                                    <a href={`mailto:${NOTIFY_EMAIL}`} className="underline">{NOTIFY_EMAIL}</a>
                                    へ直接メールでご連絡ください。
                                </p>
                            )}
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
        
        <Footer />
    </main>
  );
}
