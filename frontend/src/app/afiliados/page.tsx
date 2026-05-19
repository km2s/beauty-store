"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link2, DollarSign, TrendingUp, Copy, Check, Users, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";

interface AffiliateData {
  id: string;
  code: string;
  status: "pending" | "approved" | "suspended";
  commission_rate: number;
  total_earned: number;
  pending_payout: number;
  conversion_count: number;
  conversions: {
    id: string;
    commission: number;
    paid: boolean;
    created_at: string;
    orders: { total: number; status: string };
  }[];
}

function fmtPrice(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AfiliadosPage() {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/login"); return; }
    api.get("/affiliates/me")
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn, router]);

  if (!isLoggedIn()) return null;

  async function apply() {
    setApplying(true);
    try {
      await api.post("/affiliates/apply");
      const r = await api.get("/affiliates/me");
      setData(r.data);
    } catch {
      // ignore
    } finally {
      setApplying(false);
    }
  }

  function copyLink() {
    if (!data?.code) return;
    navigator.clipboard.writeText(`${window.location.origin}/?ref=${data.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (loading) return (
    <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#c9a96e]/30 border-t-[#c9a96e] rounded-full animate-spin" />
    </div>
  );

  // ── Not applied yet ──────────────────────────────────────────────────────────
  if (!data) return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-gradient-to-b from-[#fdf8f2] to-white">
      <div className="max-w-xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#c9a96e]/15 mb-6">
            <Users size={36} className="text-[#c9a96e]" />
          </div>
          <p className="text-xs text-[#c9a96e] font-semibold tracking-widest uppercase mb-3">Affiliate Hub</p>
          <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-4">Ganhe indicando Beauty.</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Compartilhe seu link exclusivo e ganhe <strong className="text-[#1a1a1a]">8% de comissão</strong> em cada venda realizada pela sua indicação. Pagamentos mensais via Pix.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10 text-center">
            {[
              { icon: "🔗", label: "Link único", desc: "Código exclusivo seu" },
              { icon: "💰", label: "8% comissão", desc: "Por venda confirmada" },
              { icon: "📱", label: "Dashboard", desc: "Acompanhe em tempo real" },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="text-3xl mb-2">{item.icon}</p>
                <p className="text-sm font-semibold text-[#1a1a1a]">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={apply}
            disabled={applying}
            className="bg-[#1a1a1a] hover:bg-[#c9a96e] text-white px-10 py-4 rounded-xl font-semibold transition-colors disabled:opacity-60 flex items-center gap-2 mx-auto"
          >
            {applying ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Link2 size={16} />
            )}
            Quero ser afiliada
          </button>
        </motion.div>
      </div>
    </div>
  );

  // ── Dashboard ────────────────────────────────────────────────────────────────
  const affiliateLink = `${typeof window !== "undefined" ? window.location.origin : "https://seusite.com"}/?ref=${data.code}`;
  const statusColors = {
    pending:   "bg-yellow-100 text-yellow-700",
    approved:  "bg-green-100 text-green-700",
    suspended: "bg-red-100 text-red-600",
  };
  const statusLabels = { pending: "Em análise", approved: "Aprovado", suspended: "Suspenso" };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-[#c9a96e] font-semibold tracking-widest uppercase mb-1">Affiliate Hub</p>
            <h1 className="text-3xl font-semibold text-[#1a1a1a]">Meu painel</h1>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[data.status]}`}>
            {statusLabels[data.status]}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: DollarSign, label: "Total ganho",    value: fmtPrice(data.total_earned),   color: "text-green-600" },
            { icon: Clock,      label: "Aguardando",     value: fmtPrice(data.pending_payout),  color: "text-yellow-600" },
            { icon: TrendingUp, label: "Conversões",     value: String(data.conversion_count),  color: "text-[#c9a96e]" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
              <stat.icon size={20} className={`mx-auto mb-2 ${stat.color}`} />
              <p className={`text-xl font-semibold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Link */}
        <div className="bg-[#fdf8f2] border border-[#c9a96e]/30 rounded-2xl p-5 mb-8">
          <p className="text-xs font-semibold text-[#c9a96e] uppercase tracking-wider mb-2">Seu link de afiliada</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={affiliateLink}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none"
            />
            <button
              onClick={copyLink}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                copied
                  ? "bg-green-100 text-green-700"
                  : "bg-[#1a1a1a] hover:bg-[#c9a96e] text-white"
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Código: <strong>{data.code}</strong> · Comissão: {(data.commission_rate * 100).toFixed(0)}% por venda</p>
        </div>

        {/* Conversions */}
        <h2 className="text-sm font-semibold text-[#1a1a1a] mb-4">Histórico de conversões</h2>
        {!data.conversions.length ? (
          <div className="text-center py-12 text-gray-400">
            <Link2 size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhuma conversão ainda. Compartilhe seu link!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.conversions.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    Venda de {fmtPrice(c.orders?.total ?? 0)}
                  </p>
                  <p className="text-xs text-gray-400">{fmtDate(c.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">+{fmtPrice(c.commission)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {c.paid ? "Pago" : "Pendente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
