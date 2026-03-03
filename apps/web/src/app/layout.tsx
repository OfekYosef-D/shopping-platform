import type { Metadata } from "next";
import { Rubik, Secular_One } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import { CartDrawer } from "@/components/features/cart-drawer";
import { publicEnv } from "@/lib/env/public";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

const secularOne = Secular_One({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${rubik.variable} ${secularOne.variable} antialiased`}>
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
