import "server-only";
import { formApi } from "./client";
import type { FormStatusDto } from "@/types/petition";

const PATHS = {
  list: "/FormStatus",
  byId: (id: number) => `/FormStatus/${id}`,
};

export const FormStatuses = {
  list: () => formApi<FormStatusDto[]>(PATHS.list),
  byId: (id: number) => formApi<FormStatusDto>(PATHS.byId(id)),
};
