import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Produto Beauty Store";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  let product: { name?: string; images?: { url: string }[] } = {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.slug}`);
    product = await res.json();
  } catch {
    // fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #f5efe6 0%, #fff 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          <div style={{ fontSize: 18, color: "#c9a96e", fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>
            Beauty Store
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>
            {product.name || params.slug.replace(/-/g, " ")}
          </div>
          <div style={{ fontSize: 20, color: "#888", marginTop: 8 }}>
            Cosméticos premium · beautystore.com.br
          </div>
        </div>
        {product.images?.[0] && (
          <img
            src={product.images[0].url}
            style={{ width: 300, height: 300, borderRadius: 24, objectFit: "cover" }}
            alt=""
          />
        )}
      </div>
    ),
    size,
  );
}
