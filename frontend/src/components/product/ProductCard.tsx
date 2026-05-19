"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface Variant { id: string; price: number; compare_at_price?: number; name: string; }
interface ProductImage { url: string; alt?: string; }

interface Product {
  id: string;
  name: string;
  slug: string;
  skin_types?: string[];
  is_limited?: boolean;
  variants?: Variant[];
  images?: ProductImage[];
  avg_rating?: number;
  review_count?: number;
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const variant = product.variants?.[0];
  const image = product.images?.[0];
  const discount = variant?.compare_at_price
    ? Math.round((1 - variant.price / variant.compare_at_price) * 100)
    : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!variant) return;
    addItem({
      id: variant.id,
      variant_id: variant.id,
      product_name: product.name,
      variant_name: variant.name,
      price: variant.price,
      quantity: 1,
      image_url: image?.url,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link href={`/produto/${product.slug}`} className="group block">
        {/* Imagem */}
        <div className="relative aspect-square bg-[#f5efe6] rounded-2xl overflow-hidden mb-3">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🧴</div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_limited && (
              <span className="bg-[#1a1a1a] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wider">
                LIMITADO
              </span>
            )}
            {discount && (
              <span className="bg-[#c9a96e] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Botão adicionar ao carrinho */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-3 right-3 bg-[#1a1a1a]/90 hover:bg-[#c9a96e] backdrop-blur-sm text-white text-xs font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={handleAddToCart}
          >
            <ShoppingBag size={14} />
            Adicionar à sacola
          </motion.button>
        </div>

        {/* Info */}
        <div>
          {product.skin_types && product.skin_types.length > 0 && (
            <p className="text-[10px] text-[#c9a96e] font-semibold uppercase tracking-widest mb-1">
              {product.skin_types.slice(0, 2).join(" · ")}
            </p>
          )}
          <h3 className="font-medium text-[#1a1a1a] text-sm leading-snug group-hover:text-[#c9a96e] transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          {product.avg_rating && (
            <div className="flex items-center gap-1 mt-1">
              <Star size={11} fill="#c9a96e" className="text-[#c9a96e]" />
              <span className="text-xs text-gray-500">
                {product.avg_rating.toFixed(1)} ({product.review_count})
              </span>
            </div>
          )}

          {/* Preço */}
          {variant && (
            <div className="flex items-center gap-2 mt-2">
              <span className="font-semibold text-[#1a1a1a]">
                R$ {variant.price.toFixed(2).replace(".", ",")}
              </span>
              {variant.compare_at_price && (
                <span className="text-xs text-gray-400 line-through">
                  R$ {variant.compare_at_price.toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
