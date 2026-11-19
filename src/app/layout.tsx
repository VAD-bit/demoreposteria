import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { ClientOnly } from "@/components/ui/client-only";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dulcehorno.es"),
  title: {
    default: "Dulce Horno - Pastelería artesanal a un click",
    template: "%s | Dulce Horno",
  },
  description: "Pastelería artesanal horneada cada madrugada. Productos frescos del día, delivery y recogida en tienda. Canal Horeca con precios por volumen.",
  keywords: ["pastelería", "artesanal", "delivery", "recogida", "croissant", "tarta", "pan", "dulces", "horeca"],
  authors: [{ name: "Dulce Horno" }],
  creator: "Dulce Horno",
  publisher: "Dulce Horno",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://dulcehorno.es",
    siteName: "Dulce Horno",
    title: "Dulce Horno - Pastelería artesanal a un click",
    description: "Productos horneados esta mañana, en tu mesa al mediodía.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dulce Horno - Pastelería artesanal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dulce Horno - Pastelería artesanal",
    description: "Productos horneados esta mañana, en tu mesa al mediodía.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF8F0" },
    { media: "(prefers-color-scheme: dark)", color: "#2D2D2D" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className="font-ui antialiased">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <Header />
        <main id="main-content" className="min-h-screen" role="main">
          {children}
        </main>
        <Footer />
        <ClientOnly>
          <Toaster />
        </ClientOnly>
      </body>
    </html>
  );
}