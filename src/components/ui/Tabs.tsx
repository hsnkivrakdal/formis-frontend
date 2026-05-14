"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface TabsCtx { value: string; setValue: (v: string) => void; }
const Ctx = React.createContext<TabsCtx | null>(null);

export function Tabs({ value, onValueChange, defaultValue, children, className }: { value?: string; onValueChange?: (v: string) => void; defaultValue?: string; children: React.ReactNode; className?: string }) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const v = value ?? internal;
  const setV = (nv: string) => { setInternal(nv); onValueChange?.(nv); };
  return <Ctx.Provider value={{ value: v, setValue: setV }}><div className={className}>{children}</div></Ctx.Provider>;
}
export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("inline-flex items-center gap-1 rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface-2)] p-0.5", className)}>{children}</div>;
}
export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(Ctx)!;
  const active = ctx.value === value;
  return <button onClick={() => ctx.setValue(value)} className={cn("px-3 h-7 rounded text-xs font-medium transition-colors", active ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]")}>{children}</button>;
}
export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(Ctx)!;
  if (ctx.value !== value) return null;
  return <div>{children}</div>;
}
