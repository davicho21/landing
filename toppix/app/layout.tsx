import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toppix Donas | Crea tu propia dona",
  description:
    "En Toppix eliges la base, el glaseado y los toppings de tu dona y la preparamos al momento. Más de 13.000 combinaciones en un rincón rosa hecho para quedarse.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full bg-tp-cream font-round text-tp-cocoa selection:bg-tp-blush">{children}</body>
    </html>
  );
}
