import "server-only";
import { formApi } from "./client";
import type {
  CreateFormMazeretSinaviFinalDetailDto,
  FormMazeretSinaviFinalDetailDto,
} from "@/types/petition";

const PATHS = {
  list: "/FormMazeretSinaviFinalDetails",
  byId: (id: number) => `/FormMazeretSinaviFinalDetails/${id}`,
};

export const FormMazeretSinaviFinalDetails = {
  list: () => formApi<FormMazeretSinaviFinalDetailDto[]>(PATHS.list),
  byId: (id: number) => formApi<FormMazeretSinaviFinalDetailDto>(PATHS.byId(id)),
  create: (dto: CreateFormMazeretSinaviFinalDetailDto) =>
    formApi<FormMazeretSinaviFinalDetailDto, CreateFormMazeretSinaviFinalDetailDto>(PATHS.list, { method: "POST", body: dto }),
  update: (dto: FormMazeretSinaviFinalDetailDto) =>
    formApi<FormMazeretSinaviFinalDetailDto, FormMazeretSinaviFinalDetailDto>(PATHS.list, { method: "PUT", body: dto }),
  remove: (id: number) => formApi<void>(PATHS.byId(id), { method: "DELETE" }),
};

export async function getMazeretSinaviFinalDetailByFormId(formId: number): Promise<FormMazeretSinaviFinalDetailDto | undefined> {
  const all = await FormMazeretSinaviFinalDetails.list();
  return all.find((d) => d.formId === formId);
}
