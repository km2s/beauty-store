import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beautystore.com.br";

export async function generateMetadataForProduct(slug: string): Promise<Metadata> {
  let product: { name?: string; description?: string; images?: { url: string }[]; variants?: { price: number }[] } = {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`, { next: { revalidate: 3600 } });
    product = await res.json();
  } catch {
    // fallback
  }

  const title = product.name || slug.replace(/-/g, " ");
  const description = product.description || `${title} — skincare e cosméticos premium da Beauty Store.`;
  const image = product.images?.[0]?.url;
  const price = product.variants?.[0]?.price;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/produto/${slug}`,
      type: "website",
      ...(image && { images: [{ url: image, width: 800, height: 800, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
    other: {
      ...(price && { "product:price:amount": String(price), "product:price:currency": "BRL" }),
    },
  };
}
