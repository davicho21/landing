import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diagnóstico de formación | Academia Referente",
  description:
    "Responde 6 preguntas y recibe un informe con recomendaciones de formación para tu equipo, elaborado por Academia Referente.",
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
