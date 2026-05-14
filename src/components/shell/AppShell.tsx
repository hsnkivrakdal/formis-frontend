"use client";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useApp } from "@/lib/app-context";

export function AppShell({ children }: { children: ReactNode }) {
  const { T } = useApp();
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    const map: Record<string, string[]> = {
      "/": ["ForMIS", T("Anasayfa", "Dashboard")],
      "/petitions": ["ForMIS", T("Dilekçeler", "Petitions")],
      "/petitions/new": ["ForMIS", T("Dilekçeler", "Petitions"), T("Yeni başvuru", "New submission")],
      "/internship": ["ForMIS", T("Staj", "Internship")],
      "/schedule": ["ForMIS", T("Hocaların Programı", "Faculty Schedule")],
      "/profile": ["ForMIS", T("Profil", "Profile")],
    };
    
    return map[pathname] ?? ["ForMIS"];
  }, [pathname, T]);
  return (
    <div className="grid grid-cols-[232px_1fr] min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex flex-col">
        <Topbar crumbs={crumbs} />
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}