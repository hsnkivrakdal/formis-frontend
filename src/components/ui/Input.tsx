import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-md border border-line-2 bg-surface px-3 text-sm text-ink outline-none transition-colors",
        "placeholder:text-ink-3",
        "focus:border-accent focus:ring-2 focus:ring-accent-soft",
        "disabled:bg-surface-2 disabled:text-ink-2 disabled:border-dashed",
        "aria-[invalid=true]:border-danger",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[130px] w-full rounded-md border border-line-2 bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors leading-relaxed",
        "placeholder:text-ink-3",
        "focus:border-accent focus:ring-2 focus:ring-accent-soft",
        "aria-[invalid=true]:border-danger",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function Label({ className, children, required, hint, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean; hint?: React.ReactNode }) {
  return (
    <label className={cn("flex items-center gap-1.5 text-xs font-medium text-ink-2", className)} {...props}>
      {children}
      {required && <span className="text-accent font-semibold">*</span>}
      {hint && <span className="ml-auto">{hint}</span>}
    </label>
  );
}

export function FieldError({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <span className="text-[11.5px] text-danger flex items-center gap-1">{children}</span>;
}
