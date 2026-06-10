"use client";
import { useLang } from "@/lib/lang-client";
import { cn } from "@/lib/cn";
import type { Locale } from "@/types/petition";

export function LangSwitcher({ current }: { current: Locale }) {
  const { setLang } = useLang();
  const langs: Locale[] = ["tr", "en"];
  return (
    <div className="inline-flex border border-line-2 rounded-md overflow-hidden bg-surface-2">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={current === l}
          className={cn(
            "px-2.5 py-1 text-[11.5px] font-semibold tracking-wide uppercase",
            current === l ? "bg-ink text-white" : "text-ink-3",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
