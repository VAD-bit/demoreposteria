"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "fresh" | "low-stock" | "sold-out" | "b2b" | "new" | "whatsapp";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "",
      fresh: "badge-fresh",
      "low-stock": "badge-low-stock",
      "sold-out": "badge-sold-out",
      b2b: "badge-b2b",
      new: "badge-new",
      whatsapp: "badge-whatsapp",
    };

    return (
      <span
        ref={ref}
        className={cn("badge", variantClasses[variant], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };