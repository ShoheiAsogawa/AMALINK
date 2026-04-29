import Image from "next/image";
import { clsx } from "clsx";

const publicBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  className?: string;
  "aria-hidden"?: boolean;
};

/** 公式LINEボタン用アイコン（`public/line-app-icon.png`） */
export function OfficialLineIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: Props) {
  return (
    <span
      className={clsx(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[22%]",
        className
      )}
      aria-hidden={ariaHidden}
    >
      <Image
        src={`${publicBase}/line-app-icon.png`}
        alt=""
        fill
        className="block object-contain"
        sizes="40px"
      />
    </span>
  );
}
