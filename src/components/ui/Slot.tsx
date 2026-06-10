import * as React from "react";

type ChildProps = Record<string, unknown> & { className?: string };

export const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }>(
  ({ children, ...slotProps }, ref) => {
    if (!React.isValidElement(children)) return null;
    const child = children as React.ReactElement<ChildProps & { ref?: React.Ref<HTMLElement> }>;
    const childProps = child.props;
    const merged: ChildProps = {
      ...slotProps,
      ...childProps,
      className: [slotProps.className, childProps.className].filter(Boolean).join(" "),
      ref,
    };
    return React.cloneElement(child, merged);
  },
);
Slot.displayName = "Slot";
