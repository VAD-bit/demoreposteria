"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { Check, AlertCircle, Info, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & {
  variant?: "default" | "success" | "error" | "info" | "loading";
};

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant = "default", children, ...props }, ref) => {
  const variantClasses = {
    default: "bg-surface-base text-ink-900 border-ink-200",
    success: "bg-fresh-50 text-fresh-700 border-fresh-200",
    error: "bg-error-50 text-error-700 border-error-200",
    info: "bg-info-50 text-info-700 border-info-200",
    loading: "bg-brand-50 text-brand-700 border-brand-200",
  };

  const icons = {
    default: null,
    success: <Check className="w-5 h-5 text-fresh-600" />,
    error: <AlertCircle className="w-5 h-5 text-error-600" />,
    info: <Info className="w-5 h-5 text-info-600" />,
    loading: <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />,
  };

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 pr-8 shadow-[var(--shadow-3)] transition-all duration-300 ease-smooth data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 flex-1">
        {icons[variant] && <div className="flex-shrink-0">{icons[variant]}</div>}
        <div className="grid gap-1">
          <ToastPrimitives.Title className="font-ui font-semibold text-body-sm">
            {children}
          </ToastPrimitives.Title>
        </div>
      </div>
      <ToastPrimitives.Close className="flex-shrink-0">
        <X className="w-4 h-4 opacity-50 transition-opacity hover:opacity-100" />
        <span className="sr-only">Cerrar</span>
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("font-ui font-semibold text-body-sm", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("font-ui text-caption opacity-80", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn("flex-shrink-0", className)}
    {...props}
  >
    <X className="w-4 h-4 opacity-50 transition-opacity hover:opacity-100" />
    <span className="sr-only">Cerrar</span>
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

type ToastActionElement = React.ReactElement<{
  altText: string;
  onClick: () => void;
}>;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "flex-shrink-0 font-ui text-button-sm font-semibold rounded-md px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};