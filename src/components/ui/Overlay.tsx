"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
      <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-lg shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5 pb-3 border-b border-[var(--color-line)]", className)}>{children}</div>;
}
export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("font-serif text-lg font-medium", className)}>{children}</h3>;
}
export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5 pt-3 border-t border-[var(--color-line)] flex justify-end gap-2", className)}>{children}</div>;
}

export function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  return (
    <span className="relative group inline-flex">
      {children}
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap rounded bg-[var(--color-ink)] text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {content}
      </span>
    </span>
  );
}
