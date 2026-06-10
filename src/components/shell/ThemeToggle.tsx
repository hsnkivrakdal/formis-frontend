"use client";
import { useTheme } from "@/lib/theme-client";
import { I } from "@/components/ui/Icon";

export function ThemeToggle() {
  const { toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid place-items-center h-8 w-8 rounded-md text-ink-2 hover:bg-surface-2 hover:border-line border border-transparent transition-colors"
    >
      <span className="dark:hidden inline-flex">{I.moon}</span>
      <span className="hidden dark:inline-flex">{I.sun}</span>
    </button>
  );
}
