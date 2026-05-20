"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";

const FAKE_STATUSES = [
  { icon: CheckCircle, label: "Pedido confirmado",      date: "15/05/2025 09:12", done: true },
  { icon: Package,     label: "Em separação",           date: "15/05/2025 14:30", done: true },
  { icon: Truck,       label: "Saiu para entrega",      date: "16/05/2025 08:00", done: true },
  { icon: MapPin,      label: "Em rota — São Paulo/SP", date: "16/05/2025 13:45", done: false },
  { icon: CheckCircle, label: "Entregue",               date: "—",               done: false },
];

export default function RastrearPage() {
  const [code, setCode] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  function search(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSearched(true); }, 1200);
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-[#fafafa]">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs text-[#c9a96e] font-semibold tracking-widest uppercase mb-2">Logística</p>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Rastrear Pedido</h1>
          <p className="text-gray-500 text-sm mt-2">
            Insira o número do pedido ou o código de rastreamento para acompanhar a entrega.
          </p>
        </div>

        <form onSubmit={search} className="flex gap-2 mb-10">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: BR123456789 ou #A1B2C3"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="bg-[#1a1a1a] hover:bg-[#c9a96e] text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? "…" : "Rastrear"}
          </button>
        </form>

        {searched && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Pedido</p>
                  <p className="font-semibold text-[#1a1a1a]">#{code.toUpperCase()}</p>
                </div>
                <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Truck size={11} />
                  Em rota
                </span>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
                <div className="space-y-5">
                  {FAKE_STATUSES.map((s, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        s.done ? "bg-[#c9a96e]" : "bg-gray-100"
                      }`}>
                        <s.icon size={14} className={s.done ? "text-white" : "text-gray-400"} />
                      </div>
                      <div className="pt-1">
                        <p className={`text-sm font-medium ${s.done ? "text-[#1a1a1a]" : "text-gray-400"}`}>
                          {s.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#fdf8f2] border border-[#c9a96e]/30 rounded-xl p-4 text-sm text-gray-600">
              <p className="font-medium text-[#1a1a1a] mb-1">Previsão de entrega</p>
              <p>16 a 17 de maio de 2025 · Correios PAC</p>
            </div>
          </motion.div>
        )}

        {!searched && (
          <div className="text-center text-gray-400 py-8">
            <Package size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Informe o código acima para ver o status da entrega.</p>
          </div>
        )}
      </div>
    </div>
  );
}
