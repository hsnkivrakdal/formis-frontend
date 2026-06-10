import type { ReactNode } from "react";

export function Section({ num, title, hint, children }: { num: string; title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3.5 pb-5 mb-5 border-b border-line last:border-none">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] tracking-wider text-ink-3">{num}</span>
        <span className="text-[13px] font-semibold">{title}</span>
        {hint && <span className="ml-auto text-[11.5px] text-ink-3">{hint}</span>}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
    </div>
  );
}
