import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "draft" | "review" | "approved" | "rejected" | "accent";
const tones: Record<Tone, string> = {
  default: "bg-[var(--color-surface-2)] text-[var(--color-ink-2)] border-[var(--color-line)]",
  draft: "bg-[var(--color-surface-2)] text-[var(--color-ink-2)] border-[var(--color-line)]",
  review: "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800",
  approved: "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800",
  rejected: "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-800",
  accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent-soft)]",
};
export function Badge({ tone = "default", className, ...p }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium", tones[tone], className)} {...p} />;
}

export function Separator({ className, orientation = "horizontal" }: { className?: string; orientation?: "horizontal" | "vertical" }) {
  return <div role="separator" className={cn(orientation === "horizontal" ? "h-px w-full" : "h-full w-px", "bg-[var(--color-line)]", className)} />;
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <div className={cn("grid place-items-center h-8 w-8 rounded-full bg-linear-to-br from-slate-500 to-slate-700 text-white text-xs font-semibold shrink-0", className)}>
      {initials}
    </div>
  );
}