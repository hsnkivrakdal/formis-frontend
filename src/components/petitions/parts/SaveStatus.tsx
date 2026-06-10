import { cn } from "@/lib/cn";

export function SaveStatus({ saved, savedLabel, savingLabel }: { saved: boolean; savedLabel: string; savingLabel: string }) {
  return (
    <span className="text-xs text-ink-3 flex items-center gap-1.5">
      <span className={cn("w-1.5 h-1.5 rounded-full", saved ? "bg-emerald-500" : "bg-amber-500")} />
      {saved ? savedLabel : savingLabel}
    </span>
  );
}
