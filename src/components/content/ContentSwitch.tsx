import Link from "next/link";

const ITEMS = [
  { href: "/news", id: "news", label: "お知らせ" },
  { href: "/column", id: "column", label: "コラム" },
] as const;

export function ContentSwitch({ current }: { current: "news" | "column" }) {
  return (
    <div className="mb-8 inline-flex rounded-full bg-slate-100 p-1" role="tablist" aria-label="記事の種類">
      {ITEMS.map((item) => {
        const active = item.id === current;
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-sans transition-colors ${
              active ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
