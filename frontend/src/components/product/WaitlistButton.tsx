"use client";
import { useState, useEffect } from "react";
import { Bell, BellOff, Check } from "lucide-react";
import { api } from "@/lib/api";

interface Props {
  productId: string;
  className?: string;
}

export default function WaitlistButton({ productId, className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/waitlist/${productId}/count`)
      .then((r) => setCount(r.data.count))
      .catch(() => {});
  }, [productId]);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/waitlist/join", { email, product_id: productId });
      setSubmitted(true);
      setCount((c) => (c ?? 0) + 1);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Erro ao entrar na lista.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={`flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl py-3 px-4 text-sm font-medium ${className}`}>
        <Check size={16} />
        Você está na lista! Avisaremos quando chegar.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-[#c9a96e] text-gray-600 hover:text-[#c9a96e] rounded-xl py-3 px-4 text-sm font-medium transition-all ${className}`}
      >
        <Bell size={16} />
        Avise-me quando chegar
        {count !== null && count > 0 && (
          <span className="ml-1 text-xs bg-[#c9a96e]/15 text-[#a07840] px-2 py-0.5 rounded-full">
            {count} na fila
          </span>
        )}
      </button>
    );
  }

  return (
    <form onSubmit={join} className={`space-y-2 ${className}`}>
      <p className="text-sm font-medium text-[#1a1a1a] flex items-center gap-2">
        <Bell size={15} className="text-[#c9a96e]" />
        Entre na lista de espera
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1a1a1a] hover:bg-[#c9a96e] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
        >
          {loading ? "…" : "Entrar"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-2.5 text-gray-400 hover:text-gray-600"
        >
          <BellOff size={16} />
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
