import "server-only";
import { cookies } from "next/headers";
import type { Locale } from "@/types/petition";
import { LANG_COOKIE, makeT, type Translator } from "@/lib/t";

export async function getLang(): Promise<Locale> {
  const store = await cookies();
  return store.get(LANG_COOKIE)?.value === "en" ? "en" : "tr";
}

export async function getT(): Promise<{ lang: Locale; T: Translator }> {
  const lang = await getLang();
  return { lang, T: makeT(lang) };
}
