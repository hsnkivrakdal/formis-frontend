import "server-only";
import { formApi } from "./client";
import { DEV_IDENTITY_NUMBER } from "./services";
import { Students } from "./students";
import type {
  CreateFormDto,
  FormDto,
  PetitionStatus,
  PetitionSummary,
  UpdateFormDto,
} from "@/types/petition";

const PATHS = {
  list: "/Form",
  byId: (id: number) => `/Form/${id}`,
  byStudent: (n: string) => `/Form/by-student/${n}`,
  create: "/Form",
  update: "/Form",
  remove: (id: number) => `/Form/${id}`,
};

export const Forms = {
  list: () => formApi<FormDto[]>(PATHS.list),
  byId: (id: number) => formApi<FormDto>(PATHS.byId(id)),
  byStudent: (studentNumber: string) => formApi<FormDto[]>(PATHS.byStudent(studentNumber)),
  create: (dto: CreateFormDto) => formApi<FormDto, CreateFormDto>(PATHS.create, { method: "POST", body: dto }),
  update: (dto: UpdateFormDto) => formApi<FormDto, UpdateFormDto>(PATHS.update, { method: "PUT", body: dto }),
  remove: (id: number) => formApi<void>(PATHS.remove(id), { method: "DELETE" }),
};

export async function getPetitions(): Promise<PetitionSummary[]> {
  if (!DEV_IDENTITY_NUMBER) {
    throw new Error("DEV_IDENTITY_NUMBER env yok");
  }
  const student = await Students.byIdentity(DEV_IDENTITY_NUMBER);
  const dtos = await Forms.byStudent(student.studentNumber);
  return dtos.map(adaptForm);
}

function adaptForm(f: FormDto): PetitionSummary {
  return {
    id: String(f.id),
    code: `${f.formTypeName.slice(0, 3).toUpperCase()}-${String(f.id).padStart(4, "0")}`,
    layoutKey: f.layoutKey,
    subject: f.subject || f.formTypeName,
    status: mapStatus(f.formStatusName),
    updatedAt: f.formDate,
  };
}

function mapStatus(name: string): PetitionStatus {
  const n = name.toLowerCase();
  if (n.includes("approve") || n.includes("onay")) return "approved";
  if (n.includes("reject") || n.includes("red")) return "rejected";
  if (n.includes("draft") || n.includes("taslak")) return "draft";
  return "review";
}
