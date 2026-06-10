import { cn } from "@/lib/cn";

export function DocRow({ lab, val, hi }: { lab: string; val?: string; hi?: boolean }) {
  return (
    <div className="meta-row">
      <span className="lab">{lab} :</span>
      <span className={cn("val", !val && "empty", hi && "typing")}>{val}</span>
    </div>
  );
}

export function fmtDate(d: string): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}
