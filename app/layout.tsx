import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rueda de Crecimiento Organizacional | Academia Referente",
  description:
    "Evalúa 8 áreas críticas de tu organización y recibe un informe con tu rueda de crecimiento y una ruta de formación sugerida, elaborado por Academia Referente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-brand-bg font-sans text-brand-text">
        {children}
      </body>
    </html>
  );
}
