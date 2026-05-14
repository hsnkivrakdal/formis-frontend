"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { I } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Misc";
import { cn } from "@/lib/cn";

export function Sidebar() {
  const { T } = useApp();
  const pathname = usePathname();
  const items = [
    { href: "/", icon: I.home, label: T("Anasayfa", "Dashboard") },
    { href: "/petitions", icon: I.doc, label: T("Dilekçeler", "Petitions"), badge: "2" },
    { href: "/internship", icon: I.briefcase, label: T("Staj", "Internship") },
    { href: "/schedule", icon: I.cal, label: T("Hocaların Programı", "Faculty Schedule") },
    { href: "/profile", icon: I.user, label: T("Profil", "Profile") },
  ];
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="bg-ink text-slate-300 sticky top-0 h-screen overflow-y-auto px-4 py-5 flex flex-col gap-1">
      <div className="flex items-baseline gap-2 px-2.5 pb-5 mb-3 border-b border-white/10">
        <div>
          <div className="font-serif text-[22px] font-semibold tracking-tight text-white leading-none">For<em className="not-italic font-normal text-slate-400">MIS</em></div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-slate-500 mt-1">DEPT. PORTAL</div>
        </div>
      </div>
      <div className="text-[10px] tracking-[0.12em] uppercase text-slate-500 px-2.5 pt-3 pb-1.5">{T("Modüller", "Modules")}</div>
      {items.map((it) => (
        <Link key={it.href} href={it.href}
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13.5px] transition-colors",
            isActive(it.href) ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
          )}>
          <span className="opacity-85 shrink-0">{it.icon}</span>
          <span>{it.label}</span>
          {it.badge && <span className="ml-auto bg-white/10 text-white text-[10px] px-1.5 rounded-full font-medium">{it.badge}</span>}
        </Link>
      ))}
      <div className="mt-auto pt-3 border-t border-white/10 flex items-center gap-2.5 px-2.5">
        <Avatar initials="EY" />
        <div className="text-xs leading-tight min-w-0">
          <div className="text-slate-200 font-medium">Elif Yılmaz</div>
          <div className="text-slate-500 text-[11px]">{T("Öğrenci · MIS", "Student · MIS")}</div>
        </div>
      </div>
    </aside>
  );
}
