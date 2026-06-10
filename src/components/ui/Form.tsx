"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

export function Checkbox({ className, ...p }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-line-2 bg-surface text-accent",
        "focus:ring-2 focus:ring-accent-soft focus:ring-offset-0 cursor-pointer",
        className
      )}
      {...p}
    />
  );
}

export function Switch({ checked, onCheckedChange, label }: { checked: boolean; onCheckedChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors",
        checked ? "bg-accent border-accent" : "bg-surface-2 border-line-2"
      )}
      title={label}
    >
      <span className={cn("inline-block h-4 w-4 translate-y-[1px] rounded-full bg-white shadow transition-transform", checked ? "translate-x-[18px]" : "translate-x-[1px]")} />
    </button>
  );
}
