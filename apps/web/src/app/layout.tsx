import type { Metadata } from "next";
import { Assistant, Geist_Mono, Rubik } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import { CartDrawer } from "@/components/features/cart-drawer";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-geist-sans",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const assistantDisplay = Assistant({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "שינה ישירה | מזרנים וכריות מיבואן",
  description: "מזרנים וכריות איכות ישירות מהיבואן, עם משלוח מהיר לכל הארץ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body
        className={`${rubik.variable} ${geistMono.variable} ${assistantDisplay.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          <CartDrawer />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
