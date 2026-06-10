import "server-only";
import { formApi } from "./client";
import type { FormTypeDto, LayoutKey } from "@/types/petition";

const PATHS = {
  list: "/FormType",
  byId: (id: number) => `/FormType/${id}`,
};

export const FormTypes = {
  list: () => formApi<FormTypeDto[]>(PATHS.list),
  byId: (id: number) => formApi<FormTypeDto>(PATHS.byId(id)),
};

// FormType tablosu küçük olduğu için layout araması client-side filter:
export async function getFormTypeByLayout(key: LayoutKey): Promise<FormTypeDto | undefined> {
  const all = await FormTypes.list();
  return all.find((t) => t.layoutKey === key);
}
