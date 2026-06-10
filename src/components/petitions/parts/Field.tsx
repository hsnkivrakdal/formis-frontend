import type { ReactNode } from "react";
import { Label, FieldError } from "@/components/ui/Input";
import { I } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function Field({
  label,
  required,
  badge,
  full,
  hint,
  err,
  children,
}: {
  label: string;
  required?: boolean;
  badge?: string;
  full?: boolean;
  hint?: ReactNode;
  err?: string | null;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", full && "col-span-2")}>
      <Label
        required={required}
        hint={
          <>
            {badge && (
              <span className="font-mono text-[10px] bg-surface-2 border border-line text-ink-3 px-1.5 py-px rounded font-medium">
                {badge}
              </span>
            )}
            {hint}
          </>
        }
      >
        {label}
      </Label>
      {children}
      {err && (
        <FieldError>
          {I.alert}
          {err}
        </FieldError>
      )}
    </div>
  );
}
