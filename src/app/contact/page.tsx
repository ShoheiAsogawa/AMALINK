"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WaveBackground } from "@/components/ui/WaveBackground";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const NOTIFY_EMAIL = "uken.shohei@gmail.com";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  const contactEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      category: formData.get("category"),
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    const name = String(data.name ?? "");
    const email = String(data.email ?? "");
    const category = String(data.category ?? "");
    const message = String(data.message ?? "");

    try {
      if (web3formsKey) {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: `【AMALINK】お問い合わせ (${category})`,
            name,
            email,
            message: [
              `カテゴリ: ${category}`,
              `お名前: ${name}`,
              `返信先メール: ${email}`,
              ``,
              `お問い合わせ内容:`,
              message.trim() || "(未入力)",
            ].join("\n"),
          }),
        });

        const json = (await response.json()) as { success?: boolean };
        if (response.ok && json.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } else if (contactEndpoint) {
        const response = await fetch(contactEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } else {
        const subject = encodeURIComponent(`【AMALINK】お問い合わせ: ${name}`);
        const body = encodeURIComponent(
          `カテゴリ: ${category}\n名前: ${name}\nメール: ${email}\n\n${message}`
        );
        window.location.href = `mailto:${NOTIFY_EMAIL}?subject=${subject}&body=${body}`;
        setStatus("success");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
        <Header />
        
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <WaveBackground color="blue-dark" position="top" opacity={0.12} speed={15} />
            <WaveBackground color="blue-light" position="bottom" opacity={0.1} speed={17} />
        </div>

        <section className="pt-32 pb-20 px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-3xl md:text-5xl font-serif text-slate-800 mb-6">お問い合わせ</h1>
                    <p className="text-slate-500 leading-loose">
                        お仕事のご相談、ご質問など、<br className="hidden md:block" />
                        お気軽にお問い合わせください。
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100"
                >
                    {status === "success" ? (
                        <div className="text-center py-12">
                            <h3 className="text-2xl font-serif text-slate-800 mb-4">送信完了</h3>
                            <p className="text-slate-500 leading-loose">
                                お問い合わせありがとうございます。<br />
                                内容を確認次第、担当者よりご連絡させていただきます。<br />
                                しばらくお待ちくださいませ。
                            </p>
                            <a href="/" className="inline-block mt-10 px-8 py-3 bg-slate-800 text-white rounded-full text-sm hover:bg-amami-blue transition-colors">
                                トップページへ戻る
                            </a>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* お問い合わせ項目 (Category) */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-3">
                                    お問い合わせ項目 <span className="text-amami-blue text-xs ml-1">必須</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {["システム開発について", "ホームページ制作について", "デザインについて", "その他・ご相談"].map((cat) => (
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

                            <div className="pt-4 text-center">
                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="w-full md:w-auto md:px-12 py-4 bg-slate-800 text-white rounded-full font-bold tracking-wider hover:bg-amami-blue transition-colors duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-amami-blue/30"
                                >
                                    {status === "submitting" ? "送信中..." : "上記の内容で送信する"}
                                </button>
                            </div>
                            
                            {status === "error" && (
                                <p className="text-red-500 text-center text-sm">
                                    送信に失敗しました。お手数ですが、時間をおいて再度お試しください。
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
