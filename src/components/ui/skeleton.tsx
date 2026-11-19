"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "title" | "card" | "image" | "button" | "circular";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "text", ...props }, ref) => {
    const variantClasses = {
      text: "skeleton skeleton-text",
      title: "skeleton skeleton-title",
      card: "skeleton skeleton-card",
      image: "skeleton skeleton-image",
      button: "skeleton skeleton-button",
      circular: "skeleton rounded-full",
    };

    return (
      <div
        ref={ref}
        className={cn(variantClasses[variant], className)}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton };