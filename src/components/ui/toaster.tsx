"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const ToasterComponent = dynamic(
  async () => {
    const { useToast } = await import("@/hooks/use-toast");
    const { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } = await import("@/components/ui/toast");

    return function ToasterInner() {
      const { toasts } = useToast();

      return (
        <ToastProvider>
          {toasts.map(({ id, title, description, action, variant, ...props }) => (
            <Toast key={id} variant={variant} {...props}>
              <ToastTitle>{title}</ToastTitle>
              <ToastDescription>{description}</ToastDescription>
              {action}
              <ToastClose />
            </Toast>
          ))}
          <ToastViewport />
        </ToastProvider>
      );
    };
  },
  { ssr: false }
);

export function Toaster() {
  return <ToasterComponent />;
}