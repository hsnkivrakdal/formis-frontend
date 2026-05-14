"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type Lang = "tr" | "en";

interface AppCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  mounted: boolean;
  T: (tr: string, en: string) => string;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Lazy Initialization: localStorage okumalarını render sırasında güvenli yapıyoruz
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("formis.theme") as Theme | null) ?? "light";
    }
    return "light";
  });

  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("formis.lang") as Lang | null) ?? "tr";
    }
    return "tr";
  });

  // ÇÖZÜM: setMounted çağrısını bir sonraki tick'e (asenkron) erteliyoruz.
  // Böylece efekt senkron çalışıp render'ı "cascade" (ardışık) olarak tetiklememiş oluyor.
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Tema değişimini DOM'a yansıtma
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Dil değişimini DOM'a yansıtma
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("formis.theme", t);
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("formis.lang", l);
  };

  const T = (tr: string, en: string) => (mounted && lang === "en" ? en : tr);

  return (
    <Ctx.Provider value={{ theme, setTheme, lang, setLang, mounted, T }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppProvider>");
  return v;
} 