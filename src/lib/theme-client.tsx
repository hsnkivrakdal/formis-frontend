"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { THEME_COOKIE, type Theme } from "@/lib/t";

interface ThemeCtx {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ initialTheme, children }: { initialTheme: Theme; children: ReactNode }) {
  const router = useRouter();
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  const setTheme = (t: Theme) => {
    document.cookie = `${THEME_COOKIE}=${t}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    document.documentElement.classList.toggle("dark", t === "dark");
    setThemeState(t);
    router.refresh();
  };

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return <Ctx.Provider value={{ theme, resolvedTheme: theme, setTheme, toggle }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside <ThemeProvider>");
  return v;
}