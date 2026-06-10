import "server-only";
import { formApi } from "./client";
import type {
  CreateFormEkSinav44cDetailDto,
  FormEkSinav44cDetailDto,
} from "@/types/petition";

const PATHS = {
  list: "/FormEkSinav44cDetails",
  byId: (id: number) => `/FormEkSinav44cDetails/${id}`,
};

export const FormEkSinav44cDetails = {
  list: () => formApi<FormEkSinav44cDetailDto[]>(PATHS.list),
  byId: (id: number) => formApi<FormEkSinav44cDetailDto>(PATHS.byId(id)),
  create: (dto: CreateFormEkSinav44cDetailDto) =>
    formApi<FormEkSinav44cDetailDto, CreateFormEkSinav44cDetailDto>(PATHS.list, { method: "POST", body: dto }),
  update: (dto: FormEkSinav44cDetailDto) =>
    formApi<FormEkSinav44cDetailDto, FormEkSinav44cDetailDto>(PATHS.list, { method: "PUT", body: dto }),
  remove: (id: number) => formApi<void>(PATHS.byId(id), { method: "DELETE" }),
};

export async function getEkSinav44cDetailByFormId(formId: number): Promise<FormEkSinav44cDetailDto | undefined> {
  const all = await FormEkSinav44cDetails.list();
  return all.find((d) => d.formId === formId);
}
