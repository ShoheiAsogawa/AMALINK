import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  id?: string;
  className?: string;
  background?: React.ReactNode;
  /** コンテナ外・全幅向け（背景マーキー等）。section 直下に配置 */
  bleed?: React.ReactNode;
}

export function Section({ children, id, className, background, bleed, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-20 md:py-32 relative overflow-hidden", className)}
      {...props}
    >
      {background}
      {bleed}
      <div className="container mx-auto px-4 relative z-10">{children}</div>
    </section>
  );
}

