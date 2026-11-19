"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CartButton } from "@/components/cart/cart-button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/productos", label: "Productos" },
    { href: "/categorias", label: "Categorías" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <header className={cn("nav-bar transition-all duration-200", scrolled && "shadow-[var(--shadow-1)]")}>
      <div className="container h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0" aria-label="Dulce Horno - Inicio">
          <svg className="w-8 h-8 text-brand-600" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 16c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 10v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="sr-only">Dulce Horno</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link",
                link.href === "/" && "nav-link--active"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/favoritos" className="btn-ghost relative" aria-label="Favoritos">
            <Icon name="heart" size="md" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white text-micro font-bold rounded-full flex items-center justify-center">3</span>
          </Link>
          <CartButton />
          <Button variant="secondary" size="sm" asChild>
            <Link href="/cuenta">Mi cuenta</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/pedido">Hacer pedido</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden btn-ghost p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <Icon name={mobileMenuOpen ? "close" : "menu"} size="lg" />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div id="mobile-menu" className="nav-drawer nav-drawer--open" role="navigation" aria-label="Menú móvil">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-ink-100 pb-4">
                <Link href="/" className="font-display text-display-sm font-light text-ink-900">
                  Dulce Horno
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-ghost p-1"
                  aria-label="Cerrar menú"
                >
                  <Icon name="close" size="lg" />
                </button>
              </div>

              <nav className="flex flex-col space-y-2" aria-label="Navegación principal">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="nav-link justify-start px-4 py-3 text-body-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-ink-100 pt-4 space-y-3">
                <Link href="/favoritos" className="flex items-center gap-3 text-body-md text-ink-700 hover:text-ink-900">
                  <Icon name="heart" size="md" className="text-ink-400" />
                  Favoritos
                </Link>
                <Link href="/cuenta" className="flex items-center gap-3 text-body-md text-ink-700 hover:text-ink-900">
                  <Icon name="user" size="md" className="text-ink-400" />
                  Mi cuenta
                </Link>
                <Button variant="primary" className="w-full justify-center" asChild>
                  <Link href="/pedido">Hacer pedido</Link>
                </Button>
              </div>
            </div>
          </div>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </header>
  );
}