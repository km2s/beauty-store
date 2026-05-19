export default function OrganizationJsonLd() {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beautystore.com.br";
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Beauty Store",
        url: BASE_URL,
        logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Beauty Store",
        publisher: { "@id": `${BASE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/busca?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
