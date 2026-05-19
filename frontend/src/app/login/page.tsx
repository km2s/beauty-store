"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "register") {
        await api.post("/auth/register", { email: form.email, password: form.password, full_name: form.full_name });
      }
      const res = await api.post("/auth/login", { email: form.email, password: form.password });
      setAuth(res.data.user, res.data.access_token);
      router.push("/conta");
    } catch (err: any) {
      if (!err?.response) {
        setError("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
      } else {
        setError(err.response.data?.detail || "Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#fdf8f2] to-white flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-2xl font-semibold tracking-widest uppercase mb-4">
            Beauty<span className="text-[#c9a96e]">.</span>
          </Link>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">
            {mode === "login" ? "Entrar na conta" : "Criar conta"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "login"
              ? "Bem-vinda de volta!"
              : "Junte-se ao programa Ritual Points"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome completo</label>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                placeholder="Seu nome"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">E-mail</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="seu@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Senha</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] hover:bg-[#c9a96e] text-white py-3.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={15} />
                {mode === "login" ? "Entrar" : "Criar conta"}
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-[#c9a96e] font-medium hover:underline"
          >
            {mode === "login" ? "Criar agora" : "Entrar"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
