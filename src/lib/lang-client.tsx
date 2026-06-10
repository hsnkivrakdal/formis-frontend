"use client";
import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/types/petition";
import { LANG_COOKIE, makeT, type Translator } from "@/lib/t";

interface LangCtx {
  lang: Locale;
  T: Translator;
  setLang: (l: Locale) => void;
}

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ initialLang, children }: { initialLang: Locale; children: ReactNode }) {
  const router = useRouter();
  const T = makeT(initialLang);
  const setLang = (l: Locale) => {
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  };
  return <Ctx.Provider value={{ lang: initialLang, T, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLang must be used inside <LangProvider>");
  return v;
}
