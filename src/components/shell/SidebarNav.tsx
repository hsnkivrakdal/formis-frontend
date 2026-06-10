"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { I } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type IconKey = keyof typeof I;

export interface SidebarItem {
  href: string;
  iconKey: IconKey;
  label: string;
  badge?: string;
}

export function SidebarNav({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13.5px] transition-colors",
            isActive(it.href) ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white",
          )}
        >
          <span className="opacity-85 shrink-0">{I[it.iconKey]}</span>
          <span>{it.label}</span>
          {it.badge && (
            <span className="ml-auto bg-white/10 text-white text-[10px] px-1.5 rounded-full font-medium">
              {it.badge}
            </span>
          )}
        </Link>
      ))}
    </>
  );
}
