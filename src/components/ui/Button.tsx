import * as React from "react";
import { cn } from "@/lib/cn";
import { Slot } from "./Slot";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-2 border-accent",
  secondary: "bg-surface text-ink hover:bg-surface-2 border-line-2",
  ghost: "bg-transparent text-ink hover:bg-surface-2 border-transparent",
  outline: "bg-transparent text-ink hover:bg-surface-2 border-line-2",
  danger: "bg-danger text-white hover:opacity-90 border-danger",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
  icon: "h-9 w-9 p-0",
};

export const buttonClasses = (variant: Variant = "secondary", size: Size = "md", className?: string) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft",
    variants[variant],
    sizes[size],
    className,
  );

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", asChild, ...props }, ref) => {
    const cls = buttonClasses(variant, size, className);
    if (asChild) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <Slot className={cls} {...(props as any)} ref={ref as any} />;
    }
    return <button ref={ref} className={cls} {...props} />;
  },
);
Button.displayName = "Button";
