import Link from "next/link";
import Image from "next/image";
import { FooterTruck } from "@/components/layout/FooterTruck";
import { COMPANY_OVERVIEW } from "@/lib/site-content";
import { LEGAL_NAME } from "@/lib/seo";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Footer() {
  return (
    <footer className="relative bg-slate-50 border-t border-slate-200 py-12 md:py-20">
      <FooterTruck />
      <div className="container relative z-[1] mx-auto px-6">
        <div className="max-w-md text-left">
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-widest flex items-center gap-2 mb-4 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image
                src={`${assetBase}/logo.png`}
                alt={`${LEGAL_NAME} ロゴ`}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-slate-900 font-sans group-hover:text-amami-blue transition-colors">AMALINK</span>
          </Link>
          <p className="text-slate-500 text-xs md:text-sm font-sans leading-relaxed">
            {LEGAL_NAME}
            <br />
            {COMPANY_OVERVIEW.address}
          </p>
          <p className="mt-[1em] text-slate-500 text-xs md:text-sm font-sans leading-relaxed">
            島のリズムで、
            <br />
            <span className="text-amami-blue">未来をつくる。</span>
          </p>
          <p className="mt-8 text-[10px] md:text-xs tracking-wide font-sans text-slate-400">
            &copy; {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
