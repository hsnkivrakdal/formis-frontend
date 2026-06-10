import "server-only";
import { formApi } from "./client";
import type {
  CreateFormContentDto,
  FormContentDto,
  FormContentPrecursorDto,
  UpdateFormContentDto,
} from "@/types/petition";

const PATHS = {
  contents: {
    list: "/FormContent",
    byId: (id: number) => `/FormContent/${id}`,
    create: "/FormContent",
    update: "/FormContent",
    remove: (id: number) => `/FormContent/${id}`,
  },
  precursors: {
    list: "/FormContentPrecursor",
    byId: (id: number) => `/FormContentPrecursor/${id}`,
  },
};

export const FormContents = {
  list: () => formApi<FormContentDto[]>(PATHS.contents.list),
  byId: (id: number) => formApi<FormContentDto>(PATHS.contents.byId(id)),
  create: (dto: CreateFormContentDto) =>
    formApi<FormContentDto, CreateFormContentDto>(PATHS.contents.create, { method: "POST", body: dto }),
  update: (dto: UpdateFormContentDto) =>
    formApi<FormContentDto, UpdateFormContentDto>(PATHS.contents.update, { method: "PUT", body: dto }),
  remove: (id: number) => formApi<void>(PATHS.contents.remove(id), { method: "DELETE" }),
};

export const FormContentPrecursors = {
  list: () => formApi<FormContentPrecursorDto[]>(PATHS.precursors.list),
  byId: (id: number) => formApi<FormContentPrecursorDto>(PATHS.precursors.byId(id)),
};

// Backend henüz filter endpoint sunmuyor — küçük tablo, client-side filter:
export async function getPrecursorsByFormType(formTypeId: number): Promise<FormContentPrecursorDto[]> {
  const all = await FormContentPrecursors.list();
  return all.filter((p) => p.formTypeId === formTypeId);
}
