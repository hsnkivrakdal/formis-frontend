import { cookies } from "next/headers";
import { THEME_COOKIE, type Theme } from "@/lib/t";

export async function getTheme(): Promise<Theme | null> {
  const store = await cookies();
  const v = store.get(THEME_COOKIE)?.value;
  if (v === "dark" || v === "light") return v;
  return null;
}