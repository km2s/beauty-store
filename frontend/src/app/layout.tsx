import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreLayout from "@/components/layout/StoreLayout";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beautystore.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "Beauty Store — Skincare & Cosméticos Premium", template: "%s | Beauty Store" },
  description: "Skincare e cosméticos premium formulados com os melhores ingredientes do mundo. Skin Quiz com IA, Ritual Points e experiência de compra única.",
  keywords: ["skincare", "cosméticos", "beleza", "cuidados com a pele", "serum", "hidratante"],
  authors: [{ name: "Beauty Store" }],
  creator: "Beauty Store",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Beauty Store",
    title: "Beauty Store — Skincare & Cosméticos Premium",
    description: "Skincare e cosméticos premium com Skin Quiz IA e Ritual Points.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Beauty Store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beauty Store — Skincare & Cosméticos Premium",
    description: "Skincare e cosméticos premium com experiência única.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <StoreLayout>{children}</StoreLayout>
        <AnalyticsProvider />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
