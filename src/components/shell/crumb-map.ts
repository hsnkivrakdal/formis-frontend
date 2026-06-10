import type { Translator } from "@/lib/t";

export function buildCrumbMap(T: Translator): Record<string, string[]> {
  return {
    "/": ["ForMIS", T("Anasayfa", "Dashboard")],
    "/petitions": ["ForMIS", T("Dilekçeler", "Petitions")],
    "/petitions/new": ["ForMIS", T("Dilekçeler", "Petitions"), T("Yeni başvuru", "New submission")],
    "/internship": ["ForMIS", T("Staj", "Internship")],
    "/schedule": ["ForMIS", T("Hocaların Programı", "Faculty Schedule")],
    "/profile": ["ForMIS", T("Profil", "Profile")],
  };
}
