import { getT } from "@/lib/lang-server";
import { I } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Misc";
import { getPetitions, getStudentProfile } from "@/lib/api";
import { SidebarNav, type SidebarItem } from "./SidebarNav";

export async function Sidebar() {
  const { T } = await getT();
  const [profile, petitions] = await Promise.all([getStudentProfile(), getPetitions()]);
  const openCount = petitions.filter((p) => p.status === "review").length;
  const initials = profile.fullName
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const items: SidebarItem[] = [
    { href: "/", iconKey: "home", label: T("Anasayfa", "Dashboard") },
    { href: "/petitions", iconKey: "doc", label: T("Dilekçeler", "Petitions"), badge: openCount > 0 ? String(openCount) : undefined },
    { href: "/internship", iconKey: "briefcase", label: T("Staj", "Internship") },
    { href: "/schedule", iconKey: "cal", label: T("Hocaların Programı", "Faculty Schedule") },
    { href: "/profile", iconKey: "user", label: T("Profil", "Profile") },
  ];

  return (
    <aside className="bg-ink text-slate-300 sticky top-0 h-screen overflow-y-auto px-4 py-5 flex flex-col gap-1">
      <div className="flex items-baseline gap-2 px-2.5 pb-5 mb-3 border-b border-white/10">
        <div>
          <div className="font-serif text-[22px] font-semibold tracking-tight text-white leading-none">
            For<em className="not-italic font-normal text-slate-400">MIS</em>
          </div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-slate-500 mt-1">DEPT. PORTAL</div>
        </div>
      </div>
      <div className="text-[10px] tracking-[0.12em] uppercase text-slate-500 px-2.5 pt-3 pb-1.5">
        {T("Modüller", "Modules")}
      </div>
      <SidebarNav items={items} />
      <div className="mt-auto pt-3 border-t border-white/10 flex items-center gap-2.5 px-2.5">
        <Avatar initials={initials} />
        <div className="text-xs leading-tight min-w-0">
          <div className="text-slate-200 font-medium">{profile.fullName}</div>
          <div className="text-slate-500 text-[11px]">{T("Öğrenci · MIS", "Student · MIS")}</div>
        </div>
      </div>
    </aside>
  );
}

export { I };
