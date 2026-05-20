"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Clock } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { api } from "@/lib/api";

interface Stats {
  total_products: number;
  total_orders: number;
  total_users: number;
  total_revenue: number;
  pending_orders: number;
}

function StatCard({
  icon: Icon, label, value, color, sub, index,
}: {
  icon: React.ElementType; label: string; value: string | number;
  color: string; sub?: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-2xl font-bold text-[#1a1a1a]">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-[#c9a96e] mt-1 font-medium">{sub}</p>}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/orders"),
    ]).then(([s, o]) => {
      setStats(s.data);
      setOrders(o.data.slice(0, 8));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const STATUS_COLOR: Record<string, string> = {
    pending:    "bg-yellow-100 text-yellow-700",
    paid:       "bg-green-100 text-green-700",
    processing: "bg-blue-100 text-blue-700",
    shipped:    "bg-purple-100 text-purple-700",
    delivered:  "bg-[#c9a96e]/15 text-[#a07840]",
    cancelled:  "bg-red-100 text-red-600",
  };
  const STATUS_LABEL: Record<string, string> = {
    pending: "Aguardando", paid: "Pago", processing: "Em separação",
    shipped: "Enviado", delivered: "Entregue", cancelled: "Cancelado",
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral da Beauty Store</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={DollarSign} label="Receita total" index={0}
              value={`R$ ${stats.total_revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              color="bg-[#c9a96e]" sub="pedidos pagos + entregues" />
            <StatCard icon={ShoppingBag} label="Total de pedidos" index={1}
              value={stats.total_orders} color="bg-[#1a1a1a]"
              sub={`${stats.pending_orders} aguardando`} />
            <StatCard icon={Package} label="Produtos ativos" index={2}
              value={stats.total_products} color="bg-blue-500" />
            <StatCard icon={Users} label="Clientes" index={3}
              value={stats.total_users} color="bg-purple-500" />
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-[#1a1a1a] flex items-center gap-2">
                <TrendingUp size={16} className="text-[#c9a96e]" />
                Pedidos recentes
              </h2>
              <a href="/admin/pedidos" className="text-xs text-[#c9a96e] hover:underline">Ver todos</a>
            </div>
            {!orders.length ? (
              <div className="text-center py-12 text-gray-400">
                <Clock size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhum pedido ainda</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between px-6 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">
                        #{order.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.profiles?.email || "—"} · {new Date(order.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABEL[order.status] || order.status}
                      </span>
                      <span className="font-semibold text-sm">
                        R$ {Number(order.total).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
