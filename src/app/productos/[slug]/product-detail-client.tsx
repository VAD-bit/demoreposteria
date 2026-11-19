"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { formatPriceFromCents } from "@/lib/utils";
import { productsData } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/product-card";

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="section section__container text-center py-20">
        <Icon name="alert-circle" size="2xl" className="text-ink-200 mx-auto mb-4" />
        <h1 className="font-display font-light tracking-tight text-display-md text-ink-900 mb-4">
          Producto no encontrado
        </h1>
        <p className="text-body-lg text-ink-600 mb-8 max-w-md mx-auto">
          Este producto no existe o ya no está disponible hoy. El catálogo se actualiza cada mañana.
        </p>
        <Button variant="primary" asChild>
          <Link href="/productos">
            <Icon name="arrow-left" size="sm" className="mr-2" />
            Ver catálogo de hoy
          </Link>
        </Button>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="container py-4" aria-label="Navegación">
        <ol className="flex items-center gap-2 text-body-sm text-ink-500">
          <li><Link href="/" className="hover:text-ink-700">Inicio</Link></li>
          <li><Icon name="chevron-right" size="xs" /></li>
          <li><Link href="/productos" className="hover:text-ink-700">Productos</Link></li>
          <li><Icon name="chevron-right" size="xs" /></li>
          <li className="text-ink-900 truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      {/* Product Detail */}
      <section className="section section--light pt-0">
        <div className="section__container">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-100 mb-4">
                <Image
                  src={product.images[selectedImage] || product.image}
                  alt={`${product.name} - vista ${selectedImage + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-ink-100 transition-colors"
                      aria-label="Imagen anterior"
                    >
                      <Icon name="chevron-left" size="md" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-ink-100 transition-colors"
                      aria-label="Imagen siguiente"
                    >
                      <Icon name="chevron-right" size="md" />
                    </button>
                  </>
                )}
                {(product.badge || product.isDailyFresh) && (
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.badge && (
                      <Badge variant={product.badge === "Oferta" ? "fresh" : "default"}>
                        {product.badge}
                      </Badge>
                    )}
                    {product.isDailyFresh && (
                      <Badge variant="fresh">
                        <Icon name="sparkles" size="xs" className="mr-1" />
                        Horneado hoy
                      </Badge>
                    )}
                  </div>
                )}
                {!product.isInStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="sold-out" className="text-body px-6 py-3">
                      Agotado hoy
                    </Badge>
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                  {product.images.map((img, index) => (
                    <button
                      key={img}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                        selectedImage === index
                          ? "border-brand-500 ring-2 ring-brand-100"
                          : "border-transparent hover:border-brand-300"
                      )}
                      aria-label={`Ver imagen ${index + 1}`}
                      aria-current={selectedImage === index ? "true" : "false"}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div className="flex items-start gap-2 mb-4">
                <span className="font-display font-light tracking-tight text-display-sm text-ink-900">
                  {product.name}
                </span>
                {product.isDailyFresh && (
                  <Badge variant="fresh" className="self-center">
                    <Icon name="sparkles" size="xs" className="mr-1" />
                    Horneado hoy
                  </Badge>
                )}
              </div>

              <p className="text-body-lg text-ink-600 mb-6">{product.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-mono text-price font-semibold text-ink-900 tabular-nums">
                  {formatPriceFromCents(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-body-lg text-ink-300 line-through">
                    {formatPriceFromCents(product.originalPrice)}
                  </span>
                )}
                <span className="text-body-md text-ink-500 ml-auto">/ {product.unit}</span>
              </div>

              {/* Allergens */}
              {product.allergens.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-label text-ink-500 self-center mr-2">Alérgenos:</span>
                  {product.allergens.map((allergen) => (
                    <Badge key={allergen} variant="b2b" className="text-xs">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-8">
                <label htmlFor="quantity" className="label mb-0">Cantidad</label>
                <div className="flex items-center border border-ink-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-ink-600 hover:bg-ink-100 transition-colors"
                    aria-label="Reducir cantidad"
                    disabled={quantity <= 1}
                  >
                    <Icon name="minus" size="md" />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-none focus:outline-none focus:ring-0 text-body-lg font-medium text-ink-900"
                    min="1"
                    max={product.stock}
                    aria-label="Cantidad"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center text-ink-600 hover:bg-ink-100 transition-colors"
                    aria-label="Aumentar cantidad"
                    disabled={quantity >= product.stock}
                  >
                    <Icon name="plus" size="md" />
                  </button>
                </div>
                <span className="text-body-sm text-ink-500">Stock: {product.stock} {product.unit}</span>
              </div>

              {/* Add to Cart / Favorite */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 min-w-[200px]"
                  disabled={!product.isInStock}
                  onClick={() => console.log("Add to cart:", product.id, quantity)}
                >
                  <Icon name="shopping-cart" size="md" className="mr-2" />
                  {product.isInStock ? `Añadir ${quantity} al carrito` : "Agotado"}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1 min-w-[200px] justify-center gap-2"
                  onClick={() => console.log("Toggle favorite")}
                >
                  <Icon name="heart" size="md" />
                  Guardar
                </Button>
              </div>

              {/* WhatsApp CTA */}
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full justify-center gap-2"
                asChild
              >
                <a href={`https://wa.me/34600000000?text=Hola%20Dulce%20Horno%2C%20quiero%20pedir%20${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size="md" />
                  Pedir por WhatsApp
                </a>
              </Button>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-body-sm text-ink-500">
                <div className="flex items-center gap-2">
                  <Icon name="truck" size="md" className="text-brand-500" />
                  <span>Delivery 09-14h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="rotate-ccw" size="md" className="text-fresh-500" />
                  <span>Cambios gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="shield" size="md" className="text-info-500" />
                  <span>Pago seguro</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="ingredientes">
              <Tabs.List className="flex gap-2 mb-6 border-b border-ink-100">
                <Tabs.Trigger value="ingredientes">Ingredientes</Tabs.Trigger>
                <Tabs.Trigger value="nutricion">Información nutricional</Tabs.Trigger>
                <Tabs.Trigger value="conservacion">Conservación</Tabs.Trigger>
                <Tabs.Trigger value="reviews">Reseñas</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="ingredientes">
                <h3 className="text-h3 mb-4">Ingredientes</h3>
                <ul className="grid gap-3 sm:grid-cols-2 max-w-2xl">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2 text-body-md text-ink-700">
                      <Icon name="check" size="sm" className="text-fresh-500 flex-shrink-0" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </Tabs.Content>

              <Tabs.Content value="nutricion">
                <h3 className="text-h3 mb-4">Por 100g</h3>
                {product.nutritionInfo && (
                  <div className="grid gap-4 md:grid-cols-4 max-w-xl">
                    <NutritionItem label="Calorías" value={`${product.nutritionInfo.calories} kcal`} />
                    <NutritionItem label="Proteínas" value={`${product.nutritionInfo.protein}g`} />
                    <NutritionItem label="Carbohidratos" value={`${product.nutritionInfo.carbs}g`} />
                    <NutritionItem label="Grasas" value={`${product.nutritionInfo.fat}g`} />
                  </div>
                )}
              </Tabs.Content>

              <Tabs.Content value="conservacion">
                <h3 className="text-h3 mb-4">Conservación y consumo</h3>
                <div className="space-y-4 max-w-2xl">
                  <ConservationItem
                    icon="clock"
                    title="Mejor consumir"
                    desc="Producto horneado esta madrugada. Consumir preferentemente en las primeras 24h para disfrutar su textura óptima."
                  />
                  <ConservationItem
                    icon="package"
                    title="Conservación"
                    desc="Mantener en bolsa de papel a temperatura ambiente. No refrigerar (seca el producto). Congelar hasta 1 mes."
                  />
                  <ConservationItem
                    icon="zap"
                    title="Recalentar"
                    desc="Horno 160°C 3-5 min para recuperar crujiente. Microondas 15 seg solo si es urgente (pierde textura)."
                  />
                </div>
              </Tabs.Content>

              <Tabs.Content value="reviews">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="star-filled" size="lg" className="text-warn-500" />
                      ))}
                    </div>
                    <span className="text-h3 font-medium">4.9</span>
                    <span className="text-body-md text-ink-500">(127 reseñas)</span>
                  </div>
                  <div className="space-y-6">
                    {[
                      { author: "María G.", date: "Hace 2 días", text: "El mejor croissant que he probado en Madrid. La mantequilla se nota, hojaldre perfecto, no pesa nada. Repetiré seguro." },
                      { author: "Carlos R.", date: "Hace 1 semana", text: "Encargamos la tarta de queso para el cumple de mi madre y fue un éxito. Cremosa, no empalagosa, con el punto justo de quemado. Volveremos a pedir." },
                      { author: "Ana M.", date: "Hace 3 semanas", text: "El pan de masa madre dura toda la semana fresco. Hace tostadas increíbles. Se nota el horno de leña y la fermentación larga." },
                    ].map((review, index) => (
                      <div key={index} className="card p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-ink-900">{review.author}</p>
                            <p className="text-caption text-ink-500">{review.date}</p>
                          </div>
                        </div>
                        <p className="text-body-md text-ink-700">{review.text}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Icon key={i} name="star-filled" size="sm" className="text-warn-500" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" className="w-full justify-center">
                    Ver todas las reseñas
                    <Icon name="chevron-right" size="sm" />
                  </Button>
                </div>
              </Tabs.Content>
            </Tabs>
          </div>

          {/* Related Products */}
          <section className="mt-20" aria-labelledby="related-title">
            <div className="flex items-center justify-between mb-8">
              <h2 id="related-title" className="font-display font-light tracking-tight text-display-sm text-ink-900">
                También te puede gustar
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/productos">Ver todo <Icon name="chevron-right" size="sm" /></Link>
              </Button>
            </div>
            <div className="product-grid" role="list">
              {productsData
                .filter((p) => p.id !== product.id && p.category === product.category)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

// Tabs Component
const TabsContext = React.createContext<{ value: string; onChange: (v: string) => void } | null>(null);

function Tabs({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, onChange: setValue }}>
      {children}
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div role="tablist" className={className}>{children}</div>;
}

function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");
  const isActive = context.value === value;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => context.onChange(value)}
      className={cn(
        "px-4 py-3 text-body-sm font-medium rounded-t-lg border-b-2 transition-colors",
        isActive
          ? "border-brand-500 text-brand-600"
          : "border-transparent text-ink-500 hover:text-ink-700",
        className
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");
  if (context.value !== value) return null;
  return <div role="tabpanel" className={className}>{children}</div>;
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

function NutritionItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-caption text-ink-500 mb-1">{label}</p>
      <p className="font-mono text-price-sm font-semibold text-ink-900 tabular-nums">{value}</p>
    </div>
  );
}

function ConservationItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-brand-100 flex items-center justify-center">
        <Icon name={icon as any} size="lg" className="text-brand-600" />
      </div>
      <div>
        <h4 className="font-medium text-ink-900 mb-1">{title}</h4>
        <p className="text-body-sm text-ink-600">{desc}</p>
      </div>
    </div>
  );
}