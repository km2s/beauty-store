"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, ChevronLeft, ChevronRight, X, Info, Sun, Moon, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cart";
import ProductCard from "@/components/product/ProductCard";

/* ── Ingrediente Explorer ── */
function IngredientModal({ ingredient, onClose }: { ingredient: any; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-sm w-full p-8 relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full">
            <X size={18} />
          </button>
          <div className="text-4xl mb-4">{ingredient.icon_url || "🌿"}</div>
          <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{ingredient.name}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{ingredient.description}</p>
          {ingredient.benefit && (
            <div className="bg-[#f5efe6] rounded-2xl px-4 py-3">
              <p className="text-xs font-semibold text-[#c9a96e] uppercase tracking-wider mb-1">Benefício principal</p>
              <p className="text-sm text-[#1a1a1a]">{ingredient.benefit}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Galeria ── */
function ProductGallery({ images, name }: { images: any[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const imgs = images.length > 0 ? images : [{ url: null }];

  return (
    <div className="space-y-3">
      {/* Imagem principal */}
      <div className="relative aspect-square bg-[#f5efe6] rounded-3xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {imgs[current]?.url ? (
              <Image src={imgs[current].url} alt={imgs[current].alt || name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🧴</div>
            )}
          </motion.div>
        </AnimatePresence>

        {imgs.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((c) => (c - 1 + imgs.length) % imgs.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrent((c) => (c + 1) % imgs.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                i === current ? "border-[#c9a96e]" : "border-transparent"
              }`}
            >
              {img.url ? (
                <Image src={img.url} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-[#f5efe6] flex items-center justify-center text-xl">🧴</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Tabs ── */
type Tab = "descricao" | "ingredientes" | "como-usar" | "reviews";
const TABS: { id: Tab; label: string }[] = [
  { id: "descricao", label: "Descrição" },
  { id: "ingredientes", label: "Ingredientes" },
  { id: "como-usar", label: "Como usar" },
  { id: "reviews", label: "Avaliações" },
];

/* ── Página principal ── */
export default function ProductPage() {
  const { slug } = useParams() as { slug: string };
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("descricao");
  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    api.get(`/products/${slug}`)
      .then((r) => {
        setProduct(r.data);
        setSelectedVariant(r.data.variants?.[0]);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[#c9a96e] border-t-transparent animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-gray-400 gap-3">
      <p className="text-5xl">😕</p>
      <p>Produto não encontrado</p>
    </div>
  );

  const discount = selectedVariant?.compare_at_price
    ? Math.round((1 - selectedVariant.price / selectedVariant.compare_at_price) * 100)
    : null;

  function handleAddToCart() {
    if (!selectedVariant) return;
    addItem({
      id: `${selectedVariant.id}-${Date.now()}`,
      variant_id: selectedVariant.id,
      product_name: product.name,
      variant_name: selectedVariant.name,
      price: selectedVariant.price,
      quantity,
      image_url: product.images?.[0]?.url,
    });
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          {/* Galeria */}
          <div className="md:sticky md:top-24">
            <ProductGallery images={product.images || []} name={product.name} />
          </div>

          {/* Info */}
          <div>
            {/* Coleção */}
            {product.collections?.name && (
              <p className="text-xs text-[#c9a96e] font-semibold uppercase tracking-widest mb-2">
                {product.collections.name}
              </p>
            )}
            <h1 className="text-3xl font-semibold text-[#1a1a1a] leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} fill={s <= 4 ? "#c9a96e" : "none"} className="text-[#c9a96e]" />
                ))}
              </div>
              <span className="text-sm text-gray-400">4.8 (124 avaliações)</span>
            </div>

            {/* Preço */}
            <div className="flex items-center gap-3 mt-5">
              <span className="text-3xl font-bold text-[#1a1a1a]">
                R$ {selectedVariant?.price?.toFixed(2).replace(".", ",")}
              </span>
              {selectedVariant?.compare_at_price && (
                <span className="text-lg text-gray-400 line-through">
                  R$ {selectedVariant.compare_at_price.toFixed(2).replace(".", ",")}
                </span>
              )}
              {discount && (
                <span className="bg-[#c9a96e] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              ou 6x de R$ {((selectedVariant?.price || 0) / 6).toFixed(2).replace(".", ",")} sem juros
            </p>

            {/* Variantes */}
            {product.variants?.length > 1 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-[#1a1a1a] mb-2">
                  Tamanho: <span className="text-[#c9a96e]">{selectedVariant?.name}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                          : "border-gray-200 hover:border-[#c9a96e] text-gray-700"
                      } ${v.stock === 0 ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                      disabled={v.stock === 0}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tipo de pele */}
            {product.skin_types?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {product.skin_types.map((t: string) => (
                  <span key={t} className="bg-[#f5efe6] text-[#a07840] text-xs font-medium px-3 py-1.5 rounded-full capitalize">
                    Pele {t}
                  </span>
                ))}
              </div>
            )}

            {/* Quantidade + Adicionar */}
            <div className="flex gap-3 mt-8">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3.5 hover:bg-gray-50 text-gray-500 transition-colors">−</button>
                <span className="px-4 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3.5 hover:bg-gray-50 text-gray-500 transition-colors">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#c9a96e] text-white font-medium py-3.5 rounded-xl transition-colors duration-300"
              >
                <ShoppingBag size={18} />
                Adicionar à sacola
              </button>
            </div>

            {/* Duração estimada */}
            {product.estimated_duration_days && (
              <div className="mt-4 flex items-center gap-2 bg-[#f5efe6] rounded-xl px-4 py-3">
                <Clock size={15} className="text-[#c9a96e]" />
                <p className="text-sm text-gray-600">
                  Duração estimada: <strong className="text-[#1a1a1a]">{product.estimated_duration_days} dias</strong>
                </p>
              </div>
            )}

            {/* Rotina AM/PM (Modo Rotina Completa) */}
            {product.routines?.length > 0 && (
              <div className="mt-5 border border-gray-100 rounded-2xl p-5">
                <h3 className="font-semibold text-sm text-[#1a1a1a] mb-3">✨ Rotina Completa</h3>
                <div className="space-y-2">
                  {product.routines[0]?.routine_products?.map((rp: any) => (
                    <div key={rp.id} className="flex items-center gap-3 text-sm">
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                        rp.time_of_day === "AM" ? "bg-yellow-50 text-yellow-700" : "bg-indigo-50 text-indigo-700"
                      }`}>
                        {rp.time_of_day === "AM" ? <Sun size={11} /> : <Moon size={11} />}
                        {rp.time_of_day}
                      </span>
                      <span className="text-gray-600">Passo {rp.step_order}:</span>
                      <span className="font-medium text-[#1a1a1a]">{rp.products?.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-gray-100 pt-8">
          <div className="flex gap-0 border-b border-gray-100 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? "text-[#1a1a1a]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c9a96e]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-8 max-w-2xl">
            {/* Descrição */}
            {activeTab === "descricao" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "Descrição do produto em breve."}
                </p>
                {product.concerns?.length > 0 && (
                  <div className="mt-6">
                    <p className="font-semibold text-sm text-[#1a1a1a] mb-3">Indicado para</p>
                    <div className="flex flex-wrap gap-2">
                      {product.concerns.map((c: string) => (
                        <span key={c} className="bg-gray-50 border border-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full capitalize">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Ingredientes Explorer */}
            {activeTab === "ingredientes" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {product.ingredients?.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-500 mb-5">
                      Toque em um ingrediente para saber mais sobre seus benefícios.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {product.ingredients.map((ing: any) => (
                        <button
                          key={ing.id}
                          onClick={() => setSelectedIngredient(ing)}
                          className="group flex flex-col items-start p-4 bg-[#f5efe6] hover:bg-[#c9a96e] rounded-2xl transition-colors text-left"
                        >
                          <span className="text-2xl mb-2">{ing.icon_url || "🌿"}</span>
                          <p className="font-medium text-sm text-[#1a1a1a] group-hover:text-white transition-colors">
                            {ing.name}
                          </p>
                          <p className="text-xs text-gray-400 group-hover:text-white/80 mt-0.5 flex items-center gap-1 transition-colors">
                            <Info size={10} /> Ver benefício
                          </p>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-sm">Informações de ingredientes em breve.</p>
                )}
              </motion.div>
            )}

            {/* Como usar */}
            {activeTab === "como-usar" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="space-y-4">
                  {[
                    { step: 1, icon: "🧼", title: "Limpe o rosto", desc: "Aplique em pele limpa e seca." },
                    { step: 2, icon: "💧", title: "Aplique o produto", desc: "Use uma pequena quantidade, espalhando suavemente em movimentos circulares." },
                    { step: 3, icon: "⏳", title: "Aguarde a absorção", desc: "Espere 1-2 minutos antes de aplicar o próximo produto." },
                    { step: 4, icon: "🌟", title: "Finalize sua rotina", desc: "Complete com protetor solar pela manhã." },
                  ].map((s) => (
                    <div key={s.step} className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-[#f5efe6] rounded-full flex items-center justify-center shrink-0 text-xl">
                        {s.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#1a1a1a]">{s.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-gray-400 text-sm text-center py-8">Avaliações em breve.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal ingrediente */}
      {selectedIngredient && (
        <IngredientModal ingredient={selectedIngredient} onClose={() => setSelectedIngredient(null)} />
      )}
    </div>
  );
}
