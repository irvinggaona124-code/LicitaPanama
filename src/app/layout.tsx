import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LicitaPanama AI | Inteligencia Artificial para Licitaciones Públicas",
  description:
    "Plataforma GovTech de inteligencia competitiva para PanamáCompra. Análisis de pliegos, cálculo de probabilidad de adjudicación con Gemini 3.8 Flash y redacción de plantillas Ley 22.",
  keywords: [
    "PanamáCompra",
    "Licitaciones Panamá",
    "Ley 22",
    "Inteligencia Artificial",
    "Gemini 3.8 Flash",
    "GovTech",
  ],
  authors: [{ name: "LicitaPanama AI Team" }],
  openGraph: {
    title: "LicitaPanama AI - Gana más licitaciones en PanamáCompra con IA",
    description:
      "Radar 3D en tiempo real, predicción de probabilidad de adjudicación y plantillas oficiales automatizadas de la Ley 22.",
    type: "website",
    locale: "es_PA",
  },
};

export const viewport: Viewport = {
  themeColor: "#070B14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-[#070B14] text-[#F8FAFC] antialiased min-h-screen selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
