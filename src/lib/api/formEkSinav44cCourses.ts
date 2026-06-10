import "server-only";
import { formApi } from "./client";
import type {
  CreateFormEkSinav44cCourseDto,
  FormEkSinav44cCourseDto,
} from "@/types/petition";

const PATHS = {
  list: "/FormEkSinav44cCourses",
  byId: (id: number) => `/FormEkSinav44cCourses/${id}`,
};

export const FormEkSinav44cCourses = {
  list: () => formApi<FormEkSinav44cCourseDto[]>(PATHS.list),
  byId: (id: number) => formApi<FormEkSinav44cCourseDto>(PATHS.byId(id)),
  create: (dto: CreateFormEkSinav44cCourseDto) =>
    formApi<FormEkSinav44cCourseDto, CreateFormEkSinav44cCourseDto>(PATHS.list, { method: "POST", body: dto }),
  update: (dto: FormEkSinav44cCourseDto) =>
    formApi<FormEkSinav44cCourseDto, FormEkSinav44cCourseDto>(PATHS.list, { method: "PUT", body: dto }),
  remove: (id: number) => formApi<void>(PATHS.byId(id), { method: "DELETE" }),
};

export async function getEkSinav44cCoursesByFormId(formId: number): Promise<FormEkSinav44cCourseDto[]> {
  const all = await FormEkSinav44cCourses.list();
  return all.filter((c) => c.formId === formId).sort((a, b) => a.sortOrder - b.sortOrder);
}
