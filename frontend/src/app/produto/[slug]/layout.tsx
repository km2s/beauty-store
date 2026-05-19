import type { Metadata } from "next";
import { generateMetadataForProduct } from "./metadata";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return generateMetadataForProduct(params.slug);
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
