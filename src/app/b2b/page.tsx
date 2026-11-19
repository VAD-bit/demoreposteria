"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { formatPriceFromCents } from "@/lib/utils";
import { productsData } from "@/lib/mock-data";

const b2bProducts = productsData.filter((p) => p.b2bPricing);

const benefits = [
  {
    icon: "package",
    title: "Precios por volumen automáticos",
    desc: "Tres escalones: 1-10 uds, 11-50 uds, 51+ uds. Ves tu precio al instante según cantidad.",
  },
  {
    icon: "file-text",
    title: "Facturación instantánea",
    desc: "Factura PDF automática al confirmar el pedido, lista para tu contabilidad.",
  },
  {
    icon: "rotate-ccw",
    title: "Pedidos recurrentes",
    desc: "Configura tu standing order semanal. Se genera solo cada lunes a las 6am.",
  },
  {
    icon: "whatsapp",
    title: "Notificaciones por WhatsApp",
    desc: "Pedido confirmado, factura lista, recordatorio de standing order. En tu canal habitual.",
  },
  {
    icon: "truck",
    title: "Delivery profesional",
    desc: "Franjas horarias amplias, tracking en tiempo real, albarán digital firmado.",
  },
  {
    icon: "shield",
    title: "Garantía de frescura",
    desc: "Horneado del día, control de temperatura en transporte, cambios gratis si no cumple.",
  },
];

const testimonials = [
  {
    name: "Laura M.",
    role: "Propietaria, Café Central",
    text: "Llevamos 2 años trabajando con Dulce Horno. Los croissants son el producto estrella de nuestra carta. El standing order semanal nos ahorra horas de gestión.",
    avatar: "LM",
  },
  {
    name: "Roberto S.",
    role: "Chef ejecutivo, Hotel Boutique",
    text: "La facturación instantánea nos da el flujo de caja que necesitamos. La calidad es constante y el delivery siempre puntual. Un proveedor de 10.",
    avatar: "RS",
  },
  {
    name: "Carmen R.",
    role: "Directora, Grupo Restaura",
    text: "Gestionamos 5 locales desde un solo portal. Precios por volumen claros, facturas centralizadas, soporte por WhatsApp inmediato. Nos simplifica la vida.",
    avatar: "CR",
  },
];

export default function B2BPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero" aria-labelledby="b2b-hero-title">
        <div className="hero__content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge variant="whatsapp" className="stagger-1 animate-fade-in mb-4 inline-flex">
              <Icon name="package" size="sm" />
              Canal Horeca
            </Badge>
            <h1
              id="b2b-hero-title"
              className="hero__headline stagger-2 animate-slide-up"
            >
              Tu proveedor de pastelería<br />
              <span className="text-fresh-500">para profesionales</span>
            </h1>
            <p className="hero__subhead stagger-3 animate-slide-up">
              Precios por volumen, facturación instantánea, pedidos recurrentes automáticos y WhatsApp en cada paso.
              Calidad artesanal horneada cada madrugada para tus clientes.
            </p>
            <div className="hero__cta-group stagger-4 animate-slide-up">
              <Button variant="primary" size="lg" asChild>
                <Link href="/b2b/registro">
                  <Icon name="user-plus" size="sm" />
                  Registrar mi negocio
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/productos">
                  <Icon name="package" size="sm" />
                  Ver catálogo mayorista
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="flex flex-wrap items-center gap-8 mt-16 text-body-sm"
          >
            <div className="flex items-center gap-2">
              <Icon name="check" size="sm" className="text-fresh-500" />
              <span><strong>200+</strong> profesionales confían en nosotros</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="star" size="sm" className="text-warn-500" />
              <span><strong>4.9/5</strong> satisfacción media</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="truck" size="sm" className="text-brand-500" />
              <span>Delivery en <strong>24h</strong> en zona</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section section--light" aria-labelledby="benefits-title">
        <div className="section__container">
          <div className="section__header">
            <span className="section__eyebrow">Para tu negocio</span>
            <h2 id="benefits-title" className="section__title">
              Diseñado para hostelería
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.article
                key={benefit.title}
                className="card p-6 h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                  <Icon name={benefit.icon as any} size="xl" className="text-brand-600" />
                </div>
                <h3 className="text-h3 text-ink-900 mb-2">{benefit.title}</h3>
                <p className="text-body-md text-ink-600">{benefit.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Preview */}
      <section className="section section--cream" aria-labelledby="catalog-title">
        <div className="section__container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="section__eyebrow">Catálogo mayorista</span>
              <h2 id="catalog-title" className="section__title">
                Productos con precios por volumen
              </h2>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/b2b/catalogo">Ver catálogo completo <Icon name="chevron-right" size="sm" /></Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="text-left text-label text-ink-500 border-b border-ink-100">
                  <th className="pb-3 font-semibold text-ink-700">Producto</th>
                  <th className="pb-3 font-semibold text-ink-700 text-right">1-10 uds</th>
                  <th className="pb-3 font-semibold text-ink-700 text-right">11-50 uds</th>
                  <th className="pb-3 font-semibold text-ink-700 text-right">51+ uds</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {b2bProducts.slice(0, 8).map((product) => (
                  <tr key={product.id} className="border-b border-ink-100 hover:bg-brand-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-100 flex-shrink-0">
                          <Image src={product.image} alt="" fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-ink-900">{product.name}</p>
                          <p className="text-body-sm text-ink-500">{product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-mono text-price-sm font-semibold text-ink-900 tabular-nums">
                      {product.b2bPricing && formatPriceFromCents(product.b2bPricing.tier1.price)}
                    </td>
                    <td className="py-4 text-right font-mono text-price-sm font-semibold text-brand-600 tabular-nums">
                      {product.b2bPricing && formatPriceFromCents(product.b2bPricing.tier2.price)}
                    </td>
                    <td className="py-4 text-right font-mono text-price-sm font-semibold text-fresh-700 tabular-nums">
                      {product.b2bPricing && formatPriceFromCents(product.b2bPricing.tier3.price)}
                    </td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="sm">Añadir</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Button variant="primary" size="lg" asChild>
              <Link href="/b2b/catalogo">
                Ver catálogo completo ({b2bProducts.length} productos)
                <Icon name="chevron-right" size="sm" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works B2B */}
      <section className="section section--light" aria-labelledby="how-b2b-title">
        <div className="section__container">
          <div className="section__header">
            <span className="section__eyebrow">Así de fácil</span>
            <h2 id="how-b2b-title" className="section__title">
              Empieza en 3 pasos
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <StepCard
              number="01"
              title="Regístrate como profesional"
              desc="Rellena el formulario con tus datos fiscales. Nuestro equipo valida en 24h y te asigna tu tarifa."
              icon="user-plus"
            />
            <StepCard
              number="02"
              title="Accede al portal mayorista"
              desc="Ve precios por volumen, haz pedidos rápidos, configura standing orders, descarga facturas."
              icon="layout-dashboard"
            />
            <StepCard
              number="03"
              title="Recibe y vende"
              desc="Delivery en franjas horarias, tracking en vivo, albarán digital. Factura automática."
              icon="truck"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section--cream" aria-labelledby="testimonials-title">
        <div className="section__container">
          <div className="section__header">
            <span className="section__eyebrow">Opinan los profesionales</span>
            <h2 id="testimonials-title" className="section__title">
              Más de 200 negocios confían en nosotros
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.name}
                className="card p-6 h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="star-filled" size="md" className="text-warn-500" />
                  ))}
                </div>
                <p className="text-body-md text-ink-700 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-ink-900">{testimonial.name}</p>
                    <p className="text-caption text-ink-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--dark" aria-labelledby="cta-title">
        <div className="section__container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-title" className="font-display font-light tracking-tight text-display-md text-paper-100 mb-4">
              ¿Listo para simplificar tu proveedor de pastelería?
            </h2>
            <p className="text-body-lg text-ink-300 mb-8">
              Regístrate hoy, valida tu cuenta en 24h y accede a precios mayoristas desde el primer pedido.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/b2b/registro">
                  <Icon name="user-plus" size="sm" />
                  Registrar mi negocio gratis
                </Link>
              </Button>
              <Button variant="whatsapp" size="lg" asChild>
                <a href="https://wa.me/34600000000?text=Hola%20Dulce%20Horno%2C%20soy%20profesional%20y%20quiero%20info%20canal%20Horeca" target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size="sm" />
                  Dudas por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
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