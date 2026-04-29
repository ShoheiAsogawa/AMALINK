import { cn } from "@/lib/utils";

type Props = {
  label: string;
  color: "blue" | "green";
  /** center: 中央 | left: 左 | responsive: モバイル中央・md以上で左（About 2カラム向け） */
  align?: "center" | "left" | "responsive";
  className?: string;
};

/** 英字ラベルを左右同色系バーで挟み中央または左寄せ */
export function SectionEyebrow({ label, color, align = "center", className }: Props) {
  const bar = color === "blue" ? "bg-amami-blue" : "bg-amami-green";
  const text = color === "blue" ? "text-amami-blue" : "text-amami-green";

  const justify =
    align === "center"
      ? "justify-center"
      : align === "left"
        ? "justify-start"
        : "justify-center md:justify-start";

  return (
    <div className={cn("mb-4 flex md:mb-6", justify, className)}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={cn("h-[1px] w-8 sm:w-12", bar)} />
        <span className={cn("text-xs font-bold uppercase tracking-[0.2em]", text)}>{label}</span>
        <div className={cn("h-[1px] w-8 sm:w-12", bar)} />
      </div>
    </div>
  );
}
