"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WaveBackground } from "@/components/ui/WaveBackground";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChunkyButton, ChunkyNextLink } from "@/components/ui/ChunkyButton";

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
                    className="mb-12 text-center md:mb-14"
                >
                    <p className="mb-3 font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">
                      Contact
                    </p>
                    <h1 className="mb-6 font-serif text-3xl text-slate-800 md:text-5xl">
                      お問い合わせ
                    </h1>
                    <p className="mx-auto max-w-2xl font-sans leading-loose text-slate-600">
                      合同会社AMALINK（AMALINK）は、鹿児島県奄美大島を拠点に、
                      AI活用支援・社内チャットボット・ホームページ制作・システム開発・デザイン・GEO対策を行うデジタル支援会社です。
                      島内外・全国からのオンライン相談も受け付けています。
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mb-10 grid gap-4 rounded-[1.75rem] border border-slate-100 bg-white/90 p-6 text-left shadow-sm md:mb-12 md:grid-cols-3 md:p-8"
                >
                    <div>
                      <h2 className="font-serif text-lg font-bold text-brand-gradient">ご相談できること</h2>
                      <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600">
                        生成AIの活用、社内マニュアル向けチャットボット、ホームページ制作、業務システム、ロゴ・印刷物、GEO・SEO対策まで。内容が固まっていなくても大丈夫です。
                      </p>
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-brand-gradient">対応エリア</h2>
                      <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600">
                        拠点は鹿児島県大島郡宇検村（奄美大島）。奄美群島・鹿児島県内はもちろん、全国からのオンライン相談に対応しています。
                      </p>
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-brand-gradient">返信の目安</h2>
                      <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600">
                        通常2営業日以内を目安にご返信します。お急ぎの場合は、その旨を内容欄に書いていただけると助かります。
                      </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm md:p-12"
                >
                    <h2 className="mb-2 text-center font-serif text-2xl font-bold text-brand-gradient md:text-left">
                      フォームから送る
                    </h2>
                    <p className="mb-8 text-center font-sans text-sm leading-relaxed text-slate-500 md:text-left">
                      お仕事のご相談、費用感の確認、サービスについてのご質問など、お気軽にどうぞ。
                    </p>
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
                        <form onSubmit={handleSubmit} className="space-y-8">
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
                                      "チャットボットについて",
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

                            <div className="pt-4 text-center">
                                <ChunkyButton
                                    type="submit"
                                    theme="primary"
                                    block
                                    disabled={status === "submitting"}
                                    className="mx-auto w-full max-w-md md:inline-flex md:w-auto md:min-w-[280px]"
                                >
                                    {status === "submitting" ? "送信中..." : "上記の内容で送信する"}
                                </ChunkyButton>
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
