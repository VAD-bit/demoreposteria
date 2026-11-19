"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product/product-card";
import { productsData, categories } from "@/lib/mock-data";

export default function ProductosPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredProducts = productsData.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryOptions = [
    { id: "all", name: "Todos", icon: "grid" },
    ...categories.map((cat) => ({ id: cat.id, name: cat.name, icon: cat.icon })),
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="section section--cream pt-12 pb-8">
        <div className="section__container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <span className="section__eyebrow">Catálogo del día</span>
            <h1 className="font-display font-light tracking-tight text-display-lg text-ink-900 mb-4">
              Lo que hay fresco hoy
            </h1>
            <p className="text-body-lg text-ink-600">
              {filteredProducts.length} productos disponibles · Horneados esta madrugada · Se actualiza cada día a las 5am
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="section section--light pt-0">
        <div className="section__container">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <label htmlFor="search" className="sr-only">Buscar productos</label>
              <div className="relative">
                <Icon name="search" size="md" className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                <input
                  type="search"
                  id="search"
                  placeholder="Buscar croissant, tarta, pan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-12"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 lg:w-[280px]">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "btn btn-sm px-4 py-2 gap-2",
                    selectedCategory === cat.id ? "btn-primary" : "btn-secondary"
                  )}
                  aria-pressed={selectedCategory === cat.id}
                >
                  <Icon name={cat.icon as any} size="sm" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-body-sm text-ink-500">
              Mostrando <span className="font-semibold text-ink-900">{filteredProducts.length}</span> de{' '}
              <span className="font-semibold text-ink-900">{productsData.length}</span> productos
            </p>
            <div className="flex items-center gap-2 text-body-sm text-ink-500">
              <span>Ordenar:</span>
              <select className="input py-2 px-3 text-body-sm w-auto">
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="newest">Más nuevos</option>
                <option value="popular">Más vendidos</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="section section--light pt-0 pb-20">
        <div className="section__container">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Icon name="search" size="2xl" className="text-ink-200 mx-auto mb-4" />
              <h2 className="text-h3 text-ink-700 mb-2">No hay productos que coincidan</h2>
              <p className="text-body-md text-ink-500 mb-6">Prueba con otra búsqueda o categoría</p>
              <Button variant="secondary" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
                <Icon name="rotate-ccw" size="sm" className="mr-2" />
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="product-grid" role="list">
                {filteredProducts.map((product, index) => (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
                    role="listitem"
                  >
                    <ProductCard product={product} />
                  </motion.article>
                ))}
              </div>

              {/* Load more / Pagination placeholder */}
              {filteredProducts.length > 12 && (
                <div className="text-center mt-12">
                  <Button variant="secondary" size="lg">
                    Cargar más productos
                    <Icon name="chevron-down" size="sm" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section--cream">
        <div className="section__container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display font-light tracking-tight text-display-md text-ink-900 mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-body-lg text-ink-600 mb-8">
              Hacemos encargos personalizados: tartas a medida, panes especiales, catering para eventos.
              Cuéntanos qué necesitas y te damos presupuesto sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <a href="/contacto?tipo=encargo">
                  <Icon name="mail" size="sm" className="mr-2" />
                  Pedir presupuesto
                </a>
              </Button>
              <Button variant="whatsapp" size="lg" asChild>
                <a href="https://wa.me/34600000000?text=Hola%20Dulce%20Horno%2C%20quiero%20hacer%20un%20encargo%20personalizado" target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size="sm" className="mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}