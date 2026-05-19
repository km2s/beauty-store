"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

const SKIN_TYPES = ["oleosa", "seca", "mista", "normal", "sensivel"];
const CONCERNS = ["manchas", "acne", "rugas", "poros", "olheiras", "hidratacao", "firmeza"];
const SORT_OPTIONS = [
  { value: "recent", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "rating", label: "Mais avaliados" },
];
const PRICE_RANGES = [
  { label: "Até R$99", min: 0, max: 99 },
  { label: "R$100 – R$199", min: 100, max: 199 },
  { label: "R$200 – R$349", min: 200, max: 349 },
  { label: "Acima de R$350", min: 350, max: 99999 },
];

function FilterSection({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-5 mb-5 last:border-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-[#1a1a1a] mb-3"
      >
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<any[]>([]);
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [colRes, prodRes] = await Promise.all([
          api.get(`/collections/${slug}`).catch(() => ({ data: null })),
          api.get(`/products/?limit=50`),
        ]);
        setCollection(colRes.data);
        setProducts(prodRes.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedSkinTypes.length > 0)
      list = list.filter((p) => p.skin_types?.some((s: string) => selectedSkinTypes.includes(s)));
    if (selectedConcerns.length > 0)
      list = list.filter((p) => p.concerns?.some((c: string) => selectedConcerns.includes(c)));
    if (selectedPrice !== null) {
      const range = PRICE_RANGES[selectedPrice];
      list = list.filter((p) => {
        const price = p.variants?.[0]?.price ?? 0;
        return price >= range.min && price <= range.max;
      });
    }
    if (sortBy === "price_asc") list.sort((a, b) => (a.variants?.[0]?.price ?? 0) - (b.variants?.[0]?.price ?? 0));
    else if (sortBy === "price_desc") list.sort((a, b) => (b.variants?.[0]?.price ?? 0) - (a.variants?.[0]?.price ?? 0));
    else if (sortBy === "rating") list.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));
    return list;
  }, [products, selectedSkinTypes, selectedConcerns, selectedPrice, sortBy]);

  const activeFiltersCount = selectedSkinTypes.length + selectedConcerns.length + (selectedPrice !== null ? 1 : 0);

  function clearAll() {
    setSelectedSkinTypes([]);
    setSelectedConcerns([]);
    setSelectedPrice(null);
    setSortBy("recent");
  }

  function toggle<T>(arr: T[], val: T, set: (v: T[]) => void) {
    set(arr.includes(val) ? arr.filter((i) => i !== val) : [...arr, val]);
  }

  const FilterPanel = () => (
    <div className="space-y-0">
      {activeFiltersCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs text-[#c9a96e] hover:underline mb-4"
        >
          <X size={12} /> Limpar filtros ({activeFiltersCount})
        </button>
      )}

      <FilterSection title="Tipo de pele">
        <div className="flex flex-wrap gap-2">
          {SKIN_TYPES.map((s) => (
            <button
              key={s}
              onClick={() => toggle(selectedSkinTypes, s, setSelectedSkinTypes)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedSkinTypes.includes(s)
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                  : "border-gray-200 text-gray-600 hover:border-[#c9a96e]"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Preocupações">
        <div className="flex flex-wrap gap-2">
          {CONCERNS.map((c) => (
            <button
              key={c}
              onClick={() => toggle(selectedConcerns, c, setSelectedConcerns)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedConcerns.includes(c)
                  ? "bg-[#c9a96e] text-white border-[#c9a96e]"
                  : "border-gray-200 text-gray-600 hover:border-[#c9a96e]"
              }`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Faixa de preço">
        <div className="space-y-2">
          {PRICE_RANGES.map((r, i) => (
            <label key={r.label} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedPrice === i ? "border-[#c9a96e] bg-[#c9a96e]" : "border-gray-300 group-hover:border-[#c9a96e]"
                }`}
                onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
              >
                {selectedPrice === i && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-sm text-gray-600">{r.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen pt-20">
      {/* Header da coleção */}
      <div className="bg-[#f5efe6] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-[#c9a96e] font-semibold tracking-widest uppercase mb-2">Coleção</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] capitalize">
            {collection?.name || slug.replace(/-/g, " ")}
          </h1>
          {collection?.description && (
            <p className="text-gray-500 mt-3 max-w-xl">{collection.description}</p>
          )}
          <p className="text-sm text-gray-400 mt-2">{filtered.length} produtos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Toolbar mobile */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium"
          >
            <SlidersHorizontal size={15} />
            Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="flex gap-10">
          {/* Sidebar filtros desktop */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-sm text-[#1a1a1a]">Filtros</h2>
                {activeFiltersCount > 0 && (
                  <button onClick={clearAll} className="text-xs text-[#c9a96e] hover:underline">
                    Limpar
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Grid de produtos */}
          <div className="flex-1">
            {/* Sort desktop */}
            <div className="hidden md:flex justify-end mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-[#c9a96e]"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3 animate-pulse">
                    <div className="aspect-square bg-gray-100 rounded-2xl" />
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium">Nenhum produto encontrado</p>
                <button onClick={clearAll} className="mt-3 text-sm text-[#c9a96e] hover:underline">
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal filtros mobile */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">Filtros</h2>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <FilterPanel />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-medium mt-6"
              >
                Ver {filtered.length} produtos
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
