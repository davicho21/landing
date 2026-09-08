import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Índice de Madurez de Formación Corporativa | Academia Referente",
  description:
    "Determina el nivel actual del desarrollo profesional dentro de tu empresa y recibe un informe con tu Pentágono de Formación Corporativa y una ruta de formación sugerida, elaborado por Academia Referente.",
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
