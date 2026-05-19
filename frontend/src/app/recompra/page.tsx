"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ShoppingBag, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { api } from "@/lib/api";

interface RepurchaseItem {
  product_name: string;
  variant_name: string;
  variant_id: string;
  variant_price: number;
  product_slug: string;
  image_url?: string;
  last_ordered: string;
  days_since: number;
  avg_cycle_days: number;
  urgency: "low" | "medium" | "high";
}

function urgencyLabel(u: RepurchaseItem["urgency"]) {
  return {
    high:   { text: "Acabando em breve",  color: "bg-red-100 text-red-600",    dot: "bg-red-500" },
    medium: { text: "Hora de repor",       color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
    low:    { text: "Com estoque",         color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  }[u];
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
function fmtPrice(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}

function computeRepurchaseItems(orders: any[]): RepurchaseItem[] {
  const map = new Map<string, { dates: Date[]; item: any }>();

  for (const order of orders) {
    if (order.status !== "delivered" && order.status !== "paid") continue;
    const date = new Date(order.created_at);
    for (const oi of order.order_items ?? []) {
      const vid = oi.variants?.id || oi.variant_id;
      if (!vid) continue;
      if (!map.has(vid)) map.set(vid, { dates: [], item: oi });
      map.get(vid)!.dates.push(date);
    }
  }

  const now = new Date();
  const result: RepurchaseItem[] = [];

  for (const [vid, { dates, item }] of map.entries()) {
    dates.sort((a, b) => b.getTime() - a.getTime());
    const lastOrdered = dates[0];
    const daysSince = Math.floor((now.getTime() - lastOrdered.getTime()) / 86400000);

    let avgCycle = 45;
    if (dates.length >= 2) {
      const diffs = dates.slice(0, -1).map((d, i) => (d.getTime() - dates[i + 1].getTime()) / 86400000);
      avgCycle = Math.round(diffs.reduce((s, d) => s + d, 0) / diffs.length);
    }

    const ratio = daysSince / avgCycle;
    const urgency: RepurchaseItem["urgency"] = ratio >= 0.85 ? "high" : ratio >= 0.6 ? "medium" : "low";

    result.push({
      product_name: item.variants?.products?.name ?? "Produto",
      variant_name: item.variants?.name ?? "",
      variant_id: vid,
      variant_price: item.unit_price ?? item.variants?.price ?? 0,
      product_slug: item.variants?.products?.slug ?? "",
      image_url: item.variants?.products?.images?.[0]?.url,
      last_ordered: lastOrdered.toISOString(),
      days_since: daysSince,
      avg_cycle_days: avgCycle,
      urgency,
    });
  }

  return result.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.urgency] - order[b.urgency];
  });
}

export default function RecompraPage() {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [items, setItems] = useState<RepurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/login"); return; }
    api.get("/orders/")
      .then((r) => setItems(computeRepurchaseItems(r.data)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn, router]);

  function handleAdd(item: RepurchaseItem) {
    addItem({
      id: item.variant_id,
      variant_id: item.variant_id,
      product_name: item.product_name,
      variant_name: item.variant_name,
      price: item.variant_price,
      quantity: 1,
      image_url: item.image_url,
    });
    setAddedIds((s) => new Set(s).add(item.variant_id));
    openCart();
  }

  if (!isLoggedIn()) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[#c9a96e] text-xs font-semibold tracking-widest uppercase mb-2">
            <RefreshCw size={13} />
            Recompra Inteligente
          </div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Hora de repor?</h1>
          <p className="text-gray-500 text-sm mt-2">
            Com base no seu histórico, monitoramos quando seus produtos favoritos podem estar acabando.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-500">Nenhum histórico de compras ainda</p>
            <Link href="/colecao/skincare" className="mt-3 inline-block text-sm text-[#c9a96e] hover:underline">
              Fazer minha primeira compra
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => {
              const u = urgencyLabel(item.urgency);
              const added = addedIds.has(item.variant_id);
              const progressPct = Math.min((item.days_since / item.avg_cycle_days) * 100, 100);

              return (
                <motion.div
                  key={item.variant_id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl bg-[#f5efe6] flex-shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🧴</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-medium text-sm text-[#1a1a1a] leading-snug">{item.product_name}</h3>
                          {item.variant_name && (
                            <p className="text-xs text-gray-400">{item.variant_name}</p>
                          )}
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1 ${u.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.dot}`} />
                          {u.text}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="my-2">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                          <span className="flex items-center gap-1">
                            <Clock size={9} />
                            Último pedido: {fmtDate(item.last_ordered)} ({item.days_since}d atrás)
                          </span>
                          <span>Ciclo médio: {item.avg_cycle_days}d</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.urgency === "high" ? "bg-red-500" :
                              item.urgency === "medium" ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-sm text-[#1a1a1a]">{fmtPrice(item.variant_price)}</span>
                        <button
                          onClick={() => handleAdd(item)}
                          disabled={added}
                          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${
                            added
                              ? "bg-green-100 text-green-700"
                              : "bg-[#1a1a1a] hover:bg-[#c9a96e] text-white"
                          }`}
                        >
                          <ShoppingBag size={12} />
                          {added ? "Adicionado!" : "Adicionar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {items.some((i) => i.urgency === "high") && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                <AlertCircle size={16} />
                Alguns produtos podem estar acabando — adicione-os à sacola antes de esgotar!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
