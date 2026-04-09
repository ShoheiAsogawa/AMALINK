import Link from "next/link";
import Image from "next/image";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-10">
          <div className="text-left w-full md:w-auto">
            <Link href="/" className="text-xl md:text-2xl font-bold tracking-widest flex items-center gap-2 mb-4 group">
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image 
                  src={`${assetBase}/logo.png`}
                  alt="AMALINK Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-slate-900 font-sans group-hover:text-amami-blue transition-colors">AMALINK</span>
            </Link>
            <p className="text-slate-500 text-xs md:text-sm font-sans leading-relaxed">
              奄美大島から、<br />
              デジタルで暮らしを豊かに。
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-6 w-full md:w-auto">
             <div className="text-slate-400 text-[10px] md:text-xs tracking-wide font-sans">
              &copy; {new Date().getFullYear()} AMALINK. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
