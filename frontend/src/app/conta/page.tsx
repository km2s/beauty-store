"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, Star, LogOut, ChevronRight,
  Edit2, Check, X, Crown, TrendingUp, Clock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";

type Tab = "pedidos" | "pontos" | "perfil";

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: {
    quantity: number;
    unit_price: number;
    variants: {
      name: string;
      products: {
        name: string;
        images: { url: string }[];
      };
    };
  }[];
}

interface PointsTx {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: "Aguardando pagamento", color: "bg-yellow-100 text-yellow-700" },
  paid:       { label: "Pago",                 color: "bg-green-100 text-green-700" },
  processing: { label: "Em separação",         color: "bg-blue-100 text-blue-700" },
  shipped:    { label: "Enviado",              color: "bg-purple-100 text-purple-700" },
  delivered:  { label: "Entregue",             color: "bg-[#c9a96e]/15 text-[#a07840]" },
  cancelled:  { label: "Cancelado",            color: "bg-red-100 text-red-600" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtPrice(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get("/orders/").then((r) => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  if (!orders.length) return (
    <div className="text-center py-16 text-gray-400">
      <Package size={40} className="mx-auto mb-3 opacity-30" />
      <p className="font-medium text-gray-500">Nenhum pedido ainda</p>
      <Link href="/colecao/skincare" className="mt-3 inline-block text-sm text-[#c9a96e] hover:underline">
        Explorar produtos
      </Link>
    </div>
  );

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const status = STATUS_LABELS[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-600" };
        const isOpen = expanded === order.id;
        return (
          <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : order.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#f5efe6] flex items-center justify-center shrink-0">
                  <Package size={18} className="text-[#c9a96e]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">Pedido #{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{fmtDate(order.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                  {status.label}
                </span>
                <span className="font-semibold text-sm text-[#1a1a1a]">{fmtPrice(order.total)}</span>
                <ChevronRight
                  size={16}
                  className={`text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  <div className="px-5 py-4 space-y-3">
                    {order.order_items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.variants?.products?.images?.[0] && (
                          <img
                            src={item.variants.products.images[0].url}
                            alt={item.variants.products.name}
                            className="w-12 h-12 rounded-xl object-cover bg-[#f5efe6]"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1a1a1a] truncate">{item.variants?.products?.name}</p>
                          <p className="text-xs text-gray-400">{item.variants?.name} · Qtd: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">{fmtPrice(item.unit_price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Points Tab ───────────────────────────────────────────────────────────────

function PointsTab() {
  const [balance, setBalance] = useState<number | null>(null);
  const [history, setHistory] = useState<PointsTx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/points/balance"),
      api.get("/points/history"),
    ]).then(([b, h]) => {
      setBalance(b.data.balance);
      setHistory(h.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const TIER_THRESHOLDS = [
    { name: "Bronze",   min: 0,    max: 499,  color: "#a07840" },
    { name: "Prata",    min: 500,  max: 1499, color: "#9ca3af" },
    { name: "Ouro",     min: 1500, max: 2999, color: "#c9a96e" },
    { name: "Platina",  min: 3000, max: 99999,color: "#3b82f6" },
  ];

  const tier = TIER_THRESHOLDS.find((t) => (balance ?? 0) >= t.min && (balance ?? 0) <= t.max) ?? TIER_THRESHOLDS[0];
  const next = TIER_THRESHOLDS[TIER_THRESHOLDS.indexOf(tier) + 1];
  const progress = next ? Math.min(((balance ?? 0) - tier.min) / (next.min - tier.min) * 100, 100) : 100;

  if (loading) return <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-6">
      {/* Balance card */}
      <div className="bg-linear-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-[#c9a96e]" />
            <span className="text-sm font-medium text-gray-300">Ritual Points</span>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: `${tier.color}30`, color: tier.color }}
          >
            {tier.name}
          </span>
        </div>
        <p className="text-4xl font-semibold">
          {(balance ?? 0).toLocaleString("pt-BR")}
          <span className="text-lg text-gray-400 ml-2 font-normal">pts</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">≈ {fmtPrice((balance ?? 0) * 0.05)} em descontos</p>

        {next && (
          <div className="mt-5">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>{tier.name}</span>
              <span>{next.name} em {(next.min - (balance ?? 0)).toLocaleString("pt-BR")} pts</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-[#c9a96e]"
              />
            </div>
          </div>
        )}
      </div>

      {/* How to earn */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: "🛍️", label: "Compras", desc: "1 pt por R$1" },
          { icon: "⭐", label: "Avaliação", desc: "+50 pts" },
          { icon: "👥", label: "Indicação", desc: "+100 pts" },
        ].map((item) => (
          <div key={item.label} className="bg-[#fdf8f2] rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">{item.icon}</p>
            <p className="text-xs font-semibold text-[#1a1a1a]">{item.label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* History */}
      <div>
        <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3 flex items-center gap-2">
          <TrendingUp size={15} className="text-[#c9a96e]" />
          Histórico
        </h3>
        {!history.length ? (
          <p className="text-sm text-gray-400 text-center py-6">Nenhuma movimentação ainda.</p>
        ) : (
          <div className="space-y-2">
            {history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Clock size={13} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">{tx.description || tx.type}</p>
                    <p className="text-xs text-gray-400">{fmtDate(tx.created_at)}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${tx.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const { user, setAuth, token, clearAuth } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState({ full_name: user?.full_name || "", email: user?.email || "" });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await api.patch("/users/me", { full_name: profile.full_name });
      if (user && token) setAuth({ ...user, full_name: profile.full_name }, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setEditing(false);
    } catch {
      // keep editing open on error
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    clearAuth();
    router.push("/");
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#c9a96e] to-[#a07840] flex items-center justify-center text-white text-2xl font-semibold shrink-0">
          {(profile.full_name || profile.email || "?")[0].toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-[#1a1a1a]">{profile.full_name || "Sem nome"}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome completo</label>
          {editing ? (
            <input
              value={profile.full_name}
              onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              className="w-full border border-[#c9a96e] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30"
              autoFocus
            />
          ) : (
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-[#1a1a1a]">
              {profile.full_name || <span className="text-gray-400">Não informado</span>}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">E-mail</label>
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400">{profile.email}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {editing ? (
          <>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 border border-gray-200 px-4 py-2.5 rounded-xl text-sm"
            >
              <X size={14} /> Cancelar
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#c9a96e] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
            >
              {saved ? <Check size={14} /> : <Edit2 size={14} />}
              {saving ? "Salvando…" : saved ? "Salvo!" : "Salvar"}
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-medium hover:border-[#c9a96e] transition-colors"
          >
            <Edit2 size={14} />
            Editar perfil
          </button>
        )}
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={15} />
          Sair da conta
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ContaPage() {
  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pedidos");

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn()) return null;

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "pedidos", label: "Meus Pedidos", icon: Package },
    { id: "pontos",  label: "Ritual Points", icon: Crown },
    { id: "perfil",  label: "Perfil",        icon: User },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-[#fafafa]">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs text-[#c9a96e] font-semibold tracking-widest uppercase mb-1">Minha Conta</p>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">
            Olá, {user?.full_name?.split(" ")[0] || "você"} 👋
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-white text-[#1a1a1a] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon size={14} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "pedidos" && <OrdersTab />}
            {tab === "pontos"  && <PointsTab />}
            {tab === "perfil"  && <ProfileTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
