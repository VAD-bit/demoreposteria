"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { formatPriceFromCents } from "@/lib/utils";

const cartItems = [
  { id: "1", name: "Croissant de mantequilla", price: 280, quantity: 2, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&h=100&fit=crop", stock: 120 },
  { id: "2", name: "Pain au chocolat", price: 310, quantity: 1, image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=100&h=100&fit=crop", stock: 80 },
  { id: "3", name: "Tarta de manzana y caramelo salado", price: 3800, quantity: 1, image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=100&h=100&fit=crop", stock: 12 },
];

export default function CartPage() {
  const [items, setItems] = React.useState(cartItems);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedDelivery = 350;
  const total = subtotal + estimatedDelivery;

  return (
    <div className="min-h-screen">
      <section className="section section--light pt-4">
        <div className="section__container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-light tracking-tight text-display-lg text-ink-900">
                Tu carrito
              </h1>
              <p className="text-body-md text-ink-600 mt-1">
                {items.length} {items.length === 1 ? "producto" : "productos"} · Revisa tu pedido
              </p>
            </div>
            {items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setItems([])}>
                <Icon name="trash" size="sm" className="mr-2" />
                Vaciar carrito
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            /* Empty Cart */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-brand-100 flex items-center justify-center">
                <Icon name="shopping-cart" size="2xl" className="text-brand-300" />
              </div>
              <h2 className="font-display font-light tracking-tight text-display-sm text-ink-900 mb-3">
                Tu carrito está vacío
              </h2>
              <p className="text-body-lg text-ink-500 mb-8 max-w-md mx-auto">
                Aún no has añadido nada. El catálogo de hoy tiene croissants, tartas, pan artesanal y más.
              </p>
              <Button variant="primary" size="lg" asChild>
                <Link href="/productos">
                  <Icon name="arrow-right" size="sm" className="mr-2" />
                  Ver productos de hoy
                </Link>
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="grid gap-4 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-4">
                  {items.map((item, index) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                      className="card p-4 grid grid-cols-[80px_1fr_auto] gap-4 items-center"
                    >
                      <Link href={`/productos/${item.id}`} className="relative aspect-square rounded-lg overflow-hidden bg-brand-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </Link>

                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium text-ink-900 truncate">
                            <Link href={`/productos/${item.id}`} className="hover:underline">
                              {item.name}
                            </Link>
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-ink-400 hover:text-error-500 transition-colors p-1"
                            aria-label={`Eliminar ${item.name}`}
                          >
                            <Icon name="trash" size="sm" />
                          </button>
                        </div>
                        <p className="text-body-sm text-ink-500 mb-2">Stock disponible: {item.stock} unidades</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 rounded-lg border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-ink-100 transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                            aria-label="Reducir cantidad"
                          >
                            <Icon name="minus" size="sm" />
                          </button>
                          <span className="w-10 text-center font-mono text-body-md font-semibold text-ink-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 rounded-lg border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-ink-100 transition-colors disabled:opacity-50"
                            disabled={item.quantity >= item.stock}
                            aria-label="Aumentar cantidad"
                          >
                            <Icon name="plus" size="sm" />
                          </button>
                          <span className="text-body-sm text-ink-500 ml-auto font-mono text-price-sm font-semibold tabular-nums">
                            {formatPriceFromCents(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="card p-6 sticky top-24"
                  >
                    <h2 className="text-h3 mb-4">Resumen</h2>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-body-sm">
                        <span className="text-ink-600">Subtotal ({items.length} productos)</span>
                        <span className="font-mono text-price-sm font-semibold text-ink-900 tabular-nums">
                          {formatPriceFromCents(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-body-sm">
                        <span className="text-ink-600 flex items-center gap-1">
                          <Icon name="truck" size="sm" />
                          Envío estimado
                        </span>
                        <span className="font-mono text-price-sm font-semibold text-ink-900 tabular-nums">
                          {formatPriceFromCents(estimatedDelivery)}
                        </span>
                      </div>
                      <div className="flex justify-between text-body-md font-semibold text-ink-900 border-t border-ink-100 pt-2">
                        <span>Total estimado</span>
                        <span className="font-mono text-price font-semibold tabular-nums">
                          {formatPriceFromCents(total)}
                        </span>
                      </div>
                    </div>

                    <Button variant="primary" size="lg" className="w-full justify-center gap-2" asChild>
                      <Link href="/checkout">
                        <Icon name="chevron-right" size="sm" />
                        Ir al checkout
                      </Link>
                    </Button>

                    <Button variant="secondary" size="lg" className="w-full justify-center gap-2 mt-3" asChild>
                      <Link href="/productos">
                        <Icon name="arrow-left" size="sm" />
                        Seguir comprando
                      </Link>
                    </Button>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-body-sm text-ink-500">
                      <div className="flex items-center gap-1">
                        <Icon name="shield" size="sm" className="text-info-500" />
                        <span>Pago seguro</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="rotate-ccw" size="sm" className="text-fresh-500" />
                        <span>Cambios gratis</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="whatsapp" size="sm" className="text-fresh-500" />
                        <span>WhatsApp</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Cross-sell */}
      {items.length > 0 && (
        <section className="section section--cream" aria-labelledby="cross-sell-title">
          <div className="section__container">
            <h2 id="cross-sell-title" className="font-display font-light tracking-tight text-display-sm text-ink-900 mb-8 text-center">
              Completa tu pedido
            </h2>
            <div className="product-grid" role="list">
              {[
                { id: "4", name: "Café de especialidad (250g)", price: 1200, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop", unit: "bolsa" },
                { id: "5", name: "Galletas de avena y pasas (12 uds)", price: 480, image: "https://images.unsplash.com/photo-1499636138277-2246624543d2?w=400&h=400&fit=crop", unit: "pack" },
                { id: "6", name: "Magdalenas caseras (6 uds)", price: 360, image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop", unit: "pack" },
              ].map((product) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  role="listitem"
                >
                  <article className="card-product">
                    <Link href={`/productos/${product.id}`} className="relative aspect-square overflow-hidden">
                      <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </Link>
                    <div className="card-product__content">
                      <h3 className="card-product__title">
                        <Link href={`/productos/${product.id}`} className="hover:underline">{product.name}</Link>
                      </h3>
                      <div className="card-product__price-row">
                        <span className="card-product__price">{formatPriceFromCents(product.price)}</span>
                        <span className="card-product__unit">/ {product.unit}</span>
                      </div>
                      <Button className="w-full mt-2" size="sm">Añadir</Button>
                    </div>
                  </article>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}