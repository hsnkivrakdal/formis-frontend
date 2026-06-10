import type { Locale } from "@/types/petition";

export function formatDate(iso: string | null | undefined, lang: Locale): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}
