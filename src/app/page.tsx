"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { ProductCard } from "@/components/product/product-card";
import { productsData } from "@/lib/mock-data";

export default function HomePage() {
  const features = [
    {
      icon: "wheat",
      title: "Horneado diario",
      desc: "Masa madre 48h, ingredientes locales, sin conservantes. Sale del horno a las 5am.",
    },
    {
      icon: "truck",
      title: "Delivery y recogida",
      desc: "Elige tu franja horaria. Te lo llevamos a casa o lo tienes listo en tienda.",
    },
    {
      icon: "whatsapp",
      title: "WhatsApp en cada paso",
      desc: "Confirmación, listo para recoger, en ruta, entregado. Sin apps extra.",
    },
    {
      icon: "shield",
      title: "Canal Horeca",
      desc: "Precios por volumen, pedidos recurrentes. Para profesionales.",
    },
  ];

  const featuredProducts = productsData.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section__eyebrow stagger-1 animate-fade-in">Pastelería artesanal</span>
            <h1
              id="hero-title"
              className="hero__headline stagger-2 animate-slide-up"
            >
              Horneado a las 5am.<br />
              <span className="text-brand-600">En tu mesa a las 10.</span>
            </h1>
            <p className="hero__subhead stagger-3 animate-slide-up">
              Productos frescos del día, delivery en franjas horarias y canal mayorista para profesionales.
              Sin conservantes, con masa madre de 48h y el tiempo que merece lo bueno.
            </p>
            <div className="hero__cta-group stagger-4 animate-slide-up">
              <Button variant="primary" size="lg" asChild>
                <Link href="/productos">
                  <Icon name="arrow-right" size="sm" />
                  Ver productos de hoy
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/b2b">
                  <Icon name="package" size="sm" />
                  Pedidos a mayor
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="flex flex-wrap items-center gap-8 mt-16 text-body-sm text-ink-500"
          >
            <div className="flex items-center gap-2">
              <Icon name="check" size="sm" className="text-fresh-500" />
              <span>Horneado hoy</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="truck" size="sm" className="text-brand-500" />
              <span>Delivery 09-14h</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="credit-card" size="sm" className="text-info-500" />
              <span>Pago seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="whatsapp" size="sm" className="text-fresh-500" />
              <span>WhatsApp</span>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <Icon name="chevron-down" size="xl" className="text-ink-300" />
        </div>
      </section>

      {/* Today's Highlights */}
      <section className="section section--light" aria-labelledby="today-title">
        <div className="section__container">
          <div className="section__header">
            <span className="section__eyebrow">Hoy en el horno</span>
            <h2 id="today-title" className="section__title">
              Lo que sale fresco esta mañana
            </h2>
          </div>

          <div className="product-grid" role="list">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 2}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/productos">
                Ver todo el catálogo de hoy
                <Icon name="arrow-right" size="sm" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section--cream" aria-labelledby="features-title">
        <div className="section__container">
          <div className="section__header">
            <span className="section__eyebrow">Por qué Dulce Horno</span>
            <h2 id="features-title" className="section__title">
              Hecho con tiempo, entregado con cuidado
            </h2>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                className="card-feature"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              >
                <div className="card-feature__icon">
                  <Icon name={feature.icon as any} size="2xl" />
                </div>
                <h3 className="card-feature__title">{feature.title}</h3>
                <p className="card-feature__desc">{feature.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section--light" aria-labelledby="how-title">
        <div className="section__container">
          <div className="section__header">
            <span className="section__eyebrow">Cómo funciona</span>
            <h2 id="how-title" className="section__title">
              Tu pedido en 3 pasos
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <StepCard
              number="01"
              title="Elige y personaliza"
              desc="Navega el catálogo del día, elige tus productos, selecciona tamaños y cantidades. Ves disponibilidad real por franja."
              icon="search"
            />
            <StepCard
              number="02"
              title="Elige franja y paga"
              desc="Recogida en tienda (09-11, 12-14, 17-19) o delivery por zonas. Pago móvil, efectivo, Zelle o USDT."
              icon="clock"
            />
            <StepCard
              number="03"
              title="Recibe y disfruta"
              desc="Recibes WhatsApp en cada paso: confirmado, listo, en ruta, entregado."
              icon="check"
            />
          </div>
        </div>
      </section>

      {/* B2B Section */}
      <section className="section section--dark" aria-labelledby="b2b-title">
        <div className="section__container">
          <div className="section__header">
            <span className="section__eyebrow">Para profesionales</span>
            <h2 id="b2b-title" className="section__title">
              Canal Horeca: tu proveedor de confianza
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            <B2BFeatureCard
              icon="package"
              title="Precios por volumen"
              desc="Escalones automáticos: 1-10 uds, 11-50 uds, 51+ uds. Ves tu precio al instante."
            />
            <B2BFeatureCard
              icon="file-text"
              title="Facturación automática"
              desc="Factura PDF instantánea al confirmar el pedido, lista para tu contabilidad."
            />
            <B2BFeatureCard
              icon="rotate-ccw"
              title="Pedidos recurrentes"
              desc="Configura tu standing order semanal. Se genera solo cada lunes a las 6am."
            />
            <B2BFeatureCard
              icon="whatsapp"
              title="WhatsApp profesional"
              desc="Notificaciones de pedido, factura lista, recordatorio de standing order. Todo en tu WhatsApp."
            />
          </div>

          <div className="text-center mt-12">
            <Button variant="secondary" size="lg" className="border-paper-100 text-paper-100 hover:bg-white/10" asChild>
              <Link href="/b2b/registro">
                Registrar mi negocio
                <Icon name="arrow-right" size="sm" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="section section--light" aria-labelledby="newsletter-title">
        <div className="section__container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="newsletter-title" className="font-display font-light tracking-tight text-display-md text-ink-900 mb-4">
              ¿Quieres enterarte de lo que sale del horno?
            </h2>
            <p className="text-body-lg text-ink-600 mb-8">
              Recibe cada mañana el catálogo del día, ofertas exclusivas y novedades. Sin spam, solo cosas ricas.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="/newsletter" method="POST">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="tu@email.com"
                className="input flex-1"
                required
                autoComplete="email"
              />
              <Button type="submit" variant="primary" className="whitespace-nowrap">
                Apuntarme
                <Icon name="arrow-right" size="sm" />
              </Button>
            </form>
            <p className="text-caption text-ink-500 mt-4">
              Al suscribirte aceptas nuestra <a href="/privacidad" className="underline hover:text-brand-600">política de privacidad</a>.
              Puedes darte de baja en cualquier momento.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function StepCard({ number, title, desc, icon }: { number: string; title: string; desc: string; icon: string }) {
  return (
    <motion.article
      className="card-feature relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute -top-3 -right-3 font-display font-light text-[6rem] text-brand-100">
        {number}
      </div>
      <div className="relative z-10">
        <div className="card-feature__icon">
          <Icon name={icon as any} size="2xl" />
        </div>
        <h3 className="card-feature__title">{title}</h3>
        <p className="card-feature__desc">{desc}</p>
      </div>
    </motion.article>
  );
}

function B2BFeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <motion.article
      className="card p-6 text-center h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-brand-100 flex items-center justify-center">
        <Icon name={icon as any} size="xl" className="text-brand-600" />
      </div>
      <h3 className="text-h3 text-paper-100 mb-2">{title}</h3>
      <p className="text-body-md text-ink-300">{desc}</p>
    </motion.article>
  );
}