"use client";

import Image from "next/image";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Contact〜Footer 境界の border 直上を、画面右端の外から左端の外までループ走行 */
export function FooterTruck() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[88px] -translate-y-full overflow-x-hidden overflow-y-visible bg-transparent select-none"
      aria-hidden
    >
      {/* 幅固定が calc(-100vw - 100%) の 100% に効く（走行体ごと移動） */}
      <div className="footer-truck-runner absolute bottom-[-2px] left-0 w-[172px] shrink-0">
        <div className="footer-truck-bump relative h-[78px] w-[172px]">
          <Image
            src={`${assetBase}/safari-truck-cutout.png`}
            alt=""
            width={964}
            height={432}
            className="h-full w-full object-contain object-bottom drop-shadow-[0_2px_5px_rgba(15,23,42,0.16)]"
            sizes="172px"
          />
        </div>
      </div>
    </div>
  );
}
