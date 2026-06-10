"use client";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const ZOOM_LEVELS = [0.6, 0.78, 1] as const;
const A4_HEIGHT = 1123;

export function PreviewFrame({ label, children }: { label: string; children: ReactNode }) {
  const [zoom, setZoom] = useState(0.78);
  return (
    <div className="bg-zinc-200 dark:bg-zinc-800 p-8 overflow-y-auto max-h-[calc(100vh-56px)] flex flex-col items-center gap-3.5">
      <div className="flex items-center gap-2 w-full max-w-[794px] text-xs text-ink-3">
        <span className="font-mono text-[10.5px] tracking-wider uppercase">{label}</span>
        <div className="flex-1" />
        <div className="inline-flex border border-line-2 rounded overflow-hidden bg-surface">
          {ZOOM_LEVELS.map((z) => (
            <button
              key={z}
              onClick={() => setZoom(z)}
              className={cn(
                "px-2 py-0.5 text-[11px] font-mono",
                Math.abs(zoom - z) < 0.01 ? "bg-ink text-white" : "text-ink-2",
              )}
            >
              {Math.round(z * 100)}%
            </button>
          ))}
        </div>
      </div>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", marginBottom: -((1 - zoom) * A4_HEIGHT) + "px" }}>
        {children}
      </div>
    </div>
  );
}
