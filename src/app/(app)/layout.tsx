import type { Metadata } from "next";
import { Inter_Tight, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { AppProvider } from "@/lib/app-context";
import { AppShell } from "@/components/shell/AppShell";
import "@/styles/globals.css";

const interTight = Inter_Tight({ subsets: ["latin", "latin-ext"], variable: "--font-inter-tight" });
const sourceSerif = Source_Serif_4({ subsets: ["latin", "latin-ext"], variable: "--font-source-serif" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "ForMIS — Department Portal",
  description: "Petition and internship management for the MIS department.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${interTight.variable} ${sourceSerif.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
