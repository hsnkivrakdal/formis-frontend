import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-2)] border-[var(--color-accent)]",
  secondary: "bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] border-[var(--color-line-2)]",
  ghost: "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] border-transparent",
  outline: "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] border-[var(--color-line-2)]",
  danger: "bg-[var(--color-danger)] text-white hover:opacity-90 border-[var(--color-danger)]",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
  icon: "h-9 w-9 p-0",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-soft)]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
