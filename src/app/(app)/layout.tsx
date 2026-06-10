import type { Metadata } from "next";
import { Inter_Tight, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-client";
import { LangProvider } from "@/lib/lang-client";
import { getLang } from "@/lib/lang-server";
import { getTheme } from "@/lib/theme-server";
import { AppShell } from "@/components/shell/AppShell";
import "@/styles/globals.css";

const interTight = Inter_Tight({ subsets: ["latin", "latin-ext"], variable: "--font-inter-tight" });
const sourceSerif = Source_Serif_4({ subsets: ["latin", "latin-ext"], variable: "--font-source-serif" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "ForMIS — Department Portal",
  description: "Petition and internship management for the MIS department.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [lang, themeFromCookie] = await Promise.all([getLang(), getTheme()]);
  const theme = themeFromCookie ?? "light";

  return (
    <html
      lang={lang}
      className={`${interTight.variable} ${sourceSerif.variable} ${jetbrains.variable}${theme === "dark" ? " dark" : ""}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider initialTheme={theme}>
          <LangProvider initialLang={lang}>
            <AppShell>{children}</AppShell>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
