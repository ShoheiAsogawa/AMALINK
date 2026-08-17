"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  buildLineConsultMessage,
  getOfficialLineAddFriendUrl,
  getOfficialLineConsultUrl,
  type LineConsultTranscriptItem,
} from "@/lib/line-consult";
import { CHATBOT_CONTACT_PATH } from "@/lib/chatbot-knowledge";
import { OfficialLineIcon } from "@/components/ui/OfficialLineIcon";

type Props = {
  transcript: readonly LineConsultTranscriptItem[];
};

export function LineConsultForm({ transcript }: Props) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [opened, setOpened] = useState(false);

  function openLine(e: FormEvent) {
    e.preventDefault();
    const text = buildLineConsultMessage({
      name: name.trim(),
      contact: contact.trim(),
      transcript,
    });
    const url = getOfficialLineConsultUrl(text);
    const popup = window.open(url, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.assign(url);
    }
    setOpened(true);
  }

  if (opened) {
    return (
      <div className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-3 font-sans text-xs leading-relaxed text-slate-700">
        LINEを開きました。送信を押すと、公式アカウントに届きます。
        <a
          href={getOfficialLineAddFriendUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex text-amami-blue underline-offset-2 hover:underline"
        >
          友だち追加はこちら
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={openLine}
      className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm"
    >
      <p className="mb-2.5 font-sans text-xs leading-relaxed text-slate-600">
        名前と連絡先を書いて、公式LINEで担当に送れます。
      </p>
      <label className="mb-2 block">
        <span className="mb-1 block font-sans text-[11px] font-medium text-slate-500">
          お名前
        </span>
        <input
          type="text"
          name="line-consult-name"
          autoComplete="name"
          required
          maxLength={40}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例）奄美 太郎"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-sans text-sm outline-none transition focus:border-amami-blue focus:bg-white"
        />
      </label>
      <label className="mb-3 block">
        <span className="mb-1 block font-sans text-[11px] font-medium text-slate-500">
          連絡先（電話・メール・LINE ID）
        </span>
        <input
          type="text"
          name="line-consult-contact"
          autoComplete="tel"
          required
          maxLength={80}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="例）090-0000-0000"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-sans text-sm outline-none transition focus:border-amami-blue focus:bg-white"
        />
      </label>
      <button
        type="submit"
        disabled={!name.trim() || !contact.trim()}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#06c755] px-3 py-2 font-sans text-xs font-medium text-white transition hover:brightness-105 disabled:opacity-40"
      >
        <OfficialLineIcon className="size-4" />
        公式LINEで送る
      </button>
      <p className="mt-2 text-center font-sans text-[10px] leading-relaxed text-slate-400">
        LINEが開き、本文が入った状態になります。送信を押すと届きます。
        <Link
          href={CHATBOT_CONTACT_PATH}
          className="ml-1 text-amami-blue underline-offset-2 hover:underline"
        >
          フォームはこちら
        </Link>
      </p>
    </form>
  );
}
