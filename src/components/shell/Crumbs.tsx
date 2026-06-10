"use client";
import { usePathname } from "next/navigation";

export function Crumbs({ map }: { map: Record<string, string[]> }) {
  const pathname = usePathname();
  const crumbs = map[pathname] ?? ["ForMIS"];
  return (
    <nav className="flex items-center gap-2 text-[13px] text-ink-3">
      {crumbs.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          {i > 0 && <span className="opacity-50">/</span>}
          <span className={i === crumbs.length - 1 ? "text-ink font-medium" : ""}>{c}</span>
        </span>
      ))}
    </nav>
  );
}
