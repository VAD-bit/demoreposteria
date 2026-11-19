"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function Footer() {
  const [currentYear, setCurrentYear] = React.useState(2026);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const footerLinks = {
    "Compra": [
      { href: "/productos", label: "Todos los productos" },
      { href: "/categorias", label: "Categorías" },
      { href: "/novedades", label: "Novedades" },
      { href: "/ofertas", label: "Ofertas" },
      { href: "/favoritos", label: "Mis favoritos" },
    ],
    "Ayuda": [
      { href: "/envio", label: "Envíos y recogida" },
      { href: "/devoluciones", label: "Cambios y devoluciones" },
      { href: "/faq", label: "Preguntas frecuentes" },
      { href: "/contacto", label: "Contacto" },
      { href: "/mapa-codigo", label: "Mapa de código" },
    ],
    "Cuenta": [
      { href: "/cuenta", label: "Mi cuenta" },
      { href: "/pedidos", label: "Mis pedidos" },
      { href: "/direcciones", label: "Direcciones" },
      { href: "/notificaciones", label: "Notificaciones" },
      { href: "/whatsapp", label: "WhatsApp" },
    ],
    "Legal": [
      { href: "/aviso-legal", label: "Aviso legal" },
      { href: "/privacidad", label: "Política de privacidad" },
      { href: "/cookies", label: "Política de cookies" },
      { href: "/terminos", label: "Términos y condiciones" },
      { href: "/accesibilidad", label: "Accesibilidad" },
    ],
  };

  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { name: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { name: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
  ];

  const paymentMethods = [
    { name: "Visa", icon: "credit-card" },
    { name: "Mastercard", icon: "credit-card" },
    { name: "Bizum", icon: "smartphone" },
    { name: "WhatsApp Pay", icon: "whatsapp" },
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__grid">
        {/* Brand Column */}
        <div className="footer__brand">
          <Link href="/" className="footer__logo" aria-label="Dulce Horno - Inicio">
            <svg className="w-10 h-10 text-fresh-500 inline-block mb-2" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 16c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 10v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-display text-display-sm font-light tracking-tight text-paper-100">Dulce Horno</span>
          </Link>
          <p className="footer__tagline">
            Pastelería artesanal horneada cada madrugada. Ingredientes locales, sin conservantes, con el tiempo que merece lo bueno.
          </p>
          <div className="flex gap-4 mt-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-400 hover:text-fresh-500 transition-colors"
                aria-label={social.name}
              >
                <Icon name={social.icon as any} size="lg" />
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <nav key={category} aria-label={category}>
            <h3 className="footer__column-title">{category}</h3>
            <ul className="space-y-3" role="list">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* B2B Column - only on desktop */}
        <div className="hidden md:block">
          <h3 className="footer__column-title">Canal Horeca</h3>
          <ul className="space-y-3" role="list">
            <li>
              <Link href="/b2b" className="footer__link">Portal mayorista</Link>
            </li>
            <li>
              <Link href="/b2b/registro" className="footer__link">Registro profesional</Link>
            </li>
            <li>
              <Link href="/b2b/precios" className="footer__link">Precios por volumen</Link>
            </li>
            <li>
              <Link href="/b2b/pedidos-recurrentes" className="footer__link">Pedidos recurrentes</Link>
            </li>
            <li>
              <Link href="/b2b/facturas" className="footer__link">Facturación</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="flex flex-wrap items-center gap-4 text-caption text-ink-500">
          <p>&copy; {currentYear} Dulce Horno. Todos los derechos reservados.</p>
          <p>Hecho con ❤️ en tu barrio</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-caption text-ink-500">Paga con:</span>
          <div className="flex items-center gap-2">
            {paymentMethods.map((method) => (
              <span key={method.name} className="flex items-center gap-1 text-body-xs text-ink-400" title={method.name}>
                <Icon name={method.icon as any} size="sm" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}