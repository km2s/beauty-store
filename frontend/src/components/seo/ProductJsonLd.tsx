interface Props {
  name: string;
  description?: string;
  image?: string;
  price?: number;
  currency?: string;
  sku?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  slug: string;
}

export default function ProductJsonLd({
  name, description, image, price, currency = "BRL",
  sku, brand = "Beauty Store", rating, reviewCount, slug,
}: Props) {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beautystore.com.br";

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(description && { description }),
    ...(image && { image }),
    ...(sku && { sku }),
    brand: { "@type": "Brand", name: brand },
    url: `${BASE_URL}/produto/${slug}`,
  };

  if (price !== undefined) {
    data.offers = {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: brand },
    };
  }

  if (rating && reviewCount) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      reviewCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
