import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beautystore.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,             lastModified: new Date(), changeFrequency: "daily",   priority: 1 },
    { url: `${BASE_URL}/quiz`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/login`,  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let collectionRoutes: MetadataRoute.Sitemap = [];

  try {
    const [prodRes, colRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/?limit=200`).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/`).then((r) => r.json()),
    ]);

    productRoutes = (prodRes || []).map((p: { slug: string; updated_at?: string }) => ({
      url: `${BASE_URL}/produto/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    collectionRoutes = (colRes || []).map((c: { slug: string }) => ({
      url: `${BASE_URL}/colecao/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // API unavailable at build time — return static only
  }

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
