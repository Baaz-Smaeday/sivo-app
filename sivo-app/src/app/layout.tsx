import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BasketDrawer from "@/components/BasketDrawer";
import FloatingQuoteBar from "@/components/FloatingQuoteBar";
import QuickContact from "@/components/QuickContact";
import { BasketProvider } from "@/lib/basket";

export const metadata: Metadata = {
  title: "SIVO — Premium UK Trade Furniture",
  description: "Direct-sourced Indian artisan furniture for UK retailers. Wholesale trade pricing, full UK compliance, 8-10 week delivery.",
  openGraph: {
    title: "SIVO — Premium UK Trade Furniture",
    description: "Direct-sourced Indian artisan furniture for UK retailers.",
    url: "https://sivohome.com",
    siteName: "SIVO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <BasketProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <BasketDrawer />
          <FloatingQuoteBar />
          <QuickContact />
        </BasketProvider>
      </body>
    </html>
  );
}
