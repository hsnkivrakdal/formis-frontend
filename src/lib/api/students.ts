import "server-only";
import { userApi } from "./client";
import { DEV_IDENTITY_NUMBER } from "./services";
import type { StudentDto, StudentProfile } from "@/types/petition";

const PATHS = {
  list: "/Student",
  byId: (id: number) => `/Student/${id}`,
  byIdentity: (n: string) => `/Student/by-identity/${n}`,
  remove: (id: number) => `/Student/${id}`,
};

export const Students = {
  list: () => userApi<StudentDto[]>(PATHS.list),
  byId: (id: number) => userApi<StudentDto>(PATHS.byId(id)),
  byIdentity: (identityNumber: string) => userApi<StudentDto>(PATHS.byIdentity(identityNumber)),
  remove: (id: number) => userApi<void>(PATHS.remove(id), { method: "DELETE" }),
};

export async function getStudentProfile(): Promise<StudentProfile> {
  if (!DEV_IDENTITY_NUMBER) {
    throw new Error("DEV_IDENTITY_NUMBER env yok — auth eklenene kadar test kimliği .env'de gerekli");
  }
  const dto = await Students.byIdentity(DEV_IDENTITY_NUMBER);
  return adaptStudent(dto);
}

function adaptStudent(s: StudentDto): StudentProfile {
  const advisorParts = [s.departmentMemberTitle, s.departmentMemberFirstName, s.departmentMemberLastName]
    .filter((p): p is string => !!p && p.trim().length > 0);
  const advisor = advisorParts.length ? advisorParts.join(" ") : null;

  return {
    identityNumber: s.identityNumber,
    studentNumber: s.studentNumber,
    fullName: `${s.firstName} ${s.lastName}`.trim(),
    department: s.departmentName,
    faculty: s.facultyName,
    advisor,
    semester: String(s.numOfSemesters),
    gpa: (s.overallGpa ?? 0).toFixed(2),
    phone: s.phone,
    email: s.email,
    scholarship: s.scholarship ?? "",
    address: s.address ?? "",
  };
}
