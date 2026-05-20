"use client";
import { useEffect, useState } from "react";
import { Search, ChevronDown, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AdminShell from "@/components/admin/AdminShell";
import { api } from "@/lib/api";

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  tracking_code?: string;
  profiles?: { email: string; full_name?: string };
  order_items?: {
    quantity: number;
    unit_price: number;
    variants?: { name: string; products?: { name: string } };
  }[];
}

const STATUS_OPTS = [
  { value: "pending",    label: "Aguardando" },
  { value: "paid",       label: "Pago" },
  { value: "processing", label: "Em separação" },
  { value: "shipped",    label: "Enviado" },
  { value: "delivered",  label: "Entregue" },
  { value: "cancelled",  label: "Cancelado" },
];
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700", paid: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-[#c9a96e]/15 text-[#a07840]", cancelled: "bg-red-100 text-red-600",
};

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get("/admin/orders").then((r) => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) =>
    o.id.slice(-6).toUpperCase().includes(search.toUpperCase()) ||
    (o.profiles?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId);
    try {
      const tracking = trackingInputs[orderId] || undefined;
      const res = await api.patch(`/admin/orders/${orderId}`, { status, tracking_code: tracking });
      setOrders((oo) => oo.map((o) => o.id === orderId ? { ...o, ...res.data } : o));
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Pedidos</h1>
          <p className="text-sm text-gray-500">{orders.length} pedidos no total</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por ID ou e-mail..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c9a96e] transition-colors" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1,2,3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : !filtered.length ? (
          <div className="text-center py-16 text-gray-400 text-sm">Nenhum pedido encontrado</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((order) => {
              const isOpen = expanded === order.id;
              const label = STATUS_OPTS.find((s) => s.value === order.status)?.label || order.status;
              return (
                <div key={order.id}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a1a1a]">
                        #{order.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.profiles?.email} · {new Date(order.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {label}
                    </span>
                    <span className="font-semibold text-sm flex-shrink-0">
                      R$ {Number(order.total).toFixed(2).replace(".", ",")}
                    </span>
                    <ChevronDown size={15} className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-gray-50"
                      >
                        <div className="px-5 py-4 bg-gray-50 space-y-4">
                          {/* Items */}
                          {order.order_items && order.order_items.length > 0 && (
                            <div className="space-y-2">
                              {order.order_items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-gray-700">
                                    {item.variants?.products?.name} — {item.variants?.name} × {item.quantity}
                                  </span>
                                  <span className="font-medium">
                                    R$ {(item.unit_price * item.quantity).toFixed(2).replace(".", ",")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Status update */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                            <select
                              defaultValue={order.status}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              disabled={updating === order.id}
                              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c9a96e] bg-white"
                            >
                              {STATUS_OPTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>

                            <div className="flex items-center gap-2 flex-1">
                              <input
                                placeholder="Código de rastreio (opcional)"
                                value={trackingInputs[order.id] || order.tracking_code || ""}
                                onChange={(e) => setTrackingInputs((t) => ({ ...t, [order.id]: e.target.value }))}
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#c9a96e] bg-white"
                              />
                              {(trackingInputs[order.id] || order.tracking_code) && (
                                <button
                                  onClick={() => updateStatus(order.id, "shipped")}
                                  disabled={updating === order.id}
                                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                                >
                                  <Truck size={13} />
                                  Marcar enviado
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
