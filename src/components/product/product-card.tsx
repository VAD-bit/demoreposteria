"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { formatPriceFromCents } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  priority?: boolean;
}

export function ProductCard({ product, variant = "default", priority = false }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    // In a real app, this would call a cart context or API
    console.log("Add to cart:", product.id);
  };

  return (
    <article
      className={cn(
        "card-product group relative",
        variant === "compact" && "min-w-[220px]",
        variant === "featured" && "lg:grid-cols-2"
      )}
    >
      <Link
        href={`/productos/${product.slug}`}
        className="relative aspect-square overflow-hidden"
        aria-label={`Ver detalles de ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
        {(product.badge || product.isDailyFresh) && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <Badge variant={product.badge === "Oferta" ? "fresh" : product.badge === "Más vendido" ? "default" : "new"}>
                {product.badge}
              </Badge>
            )}
            {product.isDailyFresh && !product.badge && (
              <Badge variant="fresh">
                <Icon name="sparkles" size="xs" className="mr-1" />
                Horneado hoy
              </Badge>
            )}
          </div>
        )}
        {!product.isInStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="sold-out" className="text-body-sm px-4 py-2">
              Agotado
            </Badge>
          </div>
        )}
        <button
          onClick={toggleFavorite}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "hover:bg-ink-100",
            isFavorite && "opacity-100 text-rose-500"
          )}
          aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          aria-pressed={isFavorite}
        >
          <Icon
            name={isFavorite ? "heart-filled" : "heart"}
            size="md"
            className={cn("transition-colors", isFavorite && "fill-current")}
          />
        </button>
      </Link>

      <div className="card-product__content">
        <div className="flex items-start justify-between gap-2">
          <h3 className="card-product__title">
            <Link href={`/productos/${product.slug}`} className="hover:underline underline-offset-2">
              {product.name}
            </Link>
          </h3>
          {product.subcategory && (
            <Badge variant="b2b" className="text-xs shrink-0">
              {product.subcategory}
            </Badge>
          )}
        </div>

        <p className="card-product__desc">{product.shortDescription}</p>

        <div className="card-product__price-row">
          <span className="card-product__price">
            {formatPriceFromCents(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="card-product__price-old">
              {formatPriceFromCents(product.originalPrice)}
            </span>
          )}
          <span className="card-product__unit ml-auto">
            / {product.unit}
          </span>
        </div>

        <Button
          className="w-full mt-2"
          size={variant === "compact" ? "sm" : "md"}
          onClick={handleAddToCart}
          disabled={!product.isInStock}
          aria-label={product.isInStock ? `Añadir ${product.name} al carrito` : `${product.name} agotado`}
        >
          {product.isInStock ? "Añadir" : "Agotado"}
        </Button>
      </div>
    </article>
  );
}