import "server-only";
import { universityApi } from "./client";
import type { SemesterDto } from "@/types/petition";

const PATHS = {
  list: "/Semester",
  byId: (id: number) => `/Semester/${id}`,
};

export const Semesters = {
  list: () => universityApi<SemesterDto[]>(PATHS.list),
  byId: (id: number) => universityApi<SemesterDto>(PATHS.byId(id)),
};

// Semester tablosu küçük → aktifi client-side filter:
export async function getActiveSemester(): Promise<SemesterDto | undefined> {
  const all = await Semesters.list();
  return all.find((s) => s.isActive);
}
