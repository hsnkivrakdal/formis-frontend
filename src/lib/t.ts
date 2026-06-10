import type { Locale } from "@/types/petition";

export const LANG_COOKIE = "formis.lang";
export const THEME_COOKIE = "formis.theme";

export type Theme = "light" | "dark";

export type Translator = (tr: string, en: string) => string;

export function makeT(lang: Locale): Translator {
  return (tr, en) => (lang === "en" ? en : tr);
}
