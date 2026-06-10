import "server-only";
import { formApi } from "./client";
import type {
  CreateFormIlisikKesmeDetailDto,
  FormIlisikKesmeDetailDto,
} from "@/types/petition";

const PATHS = {
  list: "/FormIlisikKesmeDetails",
  byId: (id: number) => `/FormIlisikKesmeDetails/${id}`,
};

export const FormIlisikKesmeDetails = {
  list: () => formApi<FormIlisikKesmeDetailDto[]>(PATHS.list),
  byId: (id: number) => formApi<FormIlisikKesmeDetailDto>(PATHS.byId(id)),
  create: (dto: CreateFormIlisikKesmeDetailDto) =>
    formApi<FormIlisikKesmeDetailDto, CreateFormIlisikKesmeDetailDto>(PATHS.list, { method: "POST", body: dto }),
  update: (dto: FormIlisikKesmeDetailDto) =>
    formApi<FormIlisikKesmeDetailDto, FormIlisikKesmeDetailDto>(PATHS.list, { method: "PUT", body: dto }),
  remove: (id: number) => formApi<void>(PATHS.byId(id), { method: "DELETE" }),
};

export async function getIlisikKesmeDetailByFormId(formId: number): Promise<FormIlisikKesmeDetailDto | undefined> {
  const all = await FormIlisikKesmeDetails.list();
  return all.find((d) => d.formId === formId);
}
