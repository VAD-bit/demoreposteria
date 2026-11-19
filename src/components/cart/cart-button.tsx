"use client";

import * as React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function CartButton() {
  const [itemCount, setItemCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dh_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed);
        setItemCount(parsed.reduce((sum: number, item: CartItem) => sum + item.quantity, 0));
      } catch {
        localStorage.removeItem("dh_cart");
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("dh_cart", JSON.stringify(items));
    setItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
  };

  return (
    <div className="relative">
      {/* Cart Button */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? "Cerrar carrito" : `Abrir carrito, ${itemCount} artículos`}
      >
        <Icon name="shopping-cart" size="md" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-micro font-bold rounded-full flex items-center justify-center">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>

      {/* Cart Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm md:max-w-md z-50 bg-surface-base shadow-[var(--shadow-4)] flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-ink-100">
              <h2 className="font-display text-h3 font-light text-ink-900">Tu carrito</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-ghost p-1"
                aria-label="Cerrar carrito"
              >
                <Icon name="close" size="lg" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center text-ink-500">
                  <Icon name="shopping-cart" size="2xl" className="text-ink-200 mb-4" />
                  <p className="text-body-md font-medium text-ink-700">Tu carrito está vacío</p>
                  <p className="text-body-sm mt-1">Añade productos para empezar tu pedido</p>
                  <Button variant="primary" className="mt-4" onClick={() => setIsOpen(false)} asChild>
                    <Link href="/productos">Ver productos</Link>
                  </Button>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-brand-100">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Icon name="package" size="xl" className="absolute inset-0 flex items-center justify-center text-brand-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-medium text-ink-900 truncate">{item.name}</p>
                        <p className="text-body-xs text-ink-500">{formatPrice(item.price)} c/u</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-ink-100 transition-colors"
                            aria-label="Reducir cantidad"
                          >
                            <Icon name="minus" size="sm" />
                          </button>
                          <span className="text-body-sm font-medium text-ink-900 w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-ink-100 transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Icon name="plus" size="sm" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-ink-400 hover:text-error-500 transition-colors"
                            aria-label="Eliminar"
                          >
                            <Icon name="trash" size="sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Summary */}
                  <div className="border-t border-ink-100 pt-4 space-y-2">
                    <div className="flex justify-between text-body-sm">
                      <span className="text-ink-600">Subtotal</span>
                      <span className="text-ink-900 font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-body-sm">
                      <span className="text-ink-600">Envío</span>
                      <span className="text-ink-900 font-medium">A calcular</span>
                    </div>
                    <div className="flex justify-between text-body-md font-semibold text-ink-900 border-t border-ink-100 pt-2">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            {items.length > 0 && (
              <div className="p-4 border-t border-ink-100 space-y-3">
                <Button variant="secondary" className="w-full justify-center gap-2" onClick={() => setIsOpen(false)} asChild>
                  <Link href="/productos">
                    <Icon name="arrow-left" size="sm" />
                    Seguir comprando
                  </Link>
                </Button>
                <Button variant="primary" className="w-full justify-center gap-2" asChild>
                  <Link href="/checkout">
                    <Icon name="arrow-right" size="sm" />
                    Ir al checkout
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Export the addItem function for use in other components
export const cartActions = {
  addItem: (item: Omit<CartItem, "quantity">) => {
    // This will be handled by the component's internal state
    // For cross-component usage, we'd use a context or store
    console.log("Add to cart:", item);
  },
};