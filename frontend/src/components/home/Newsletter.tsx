"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#1a1a1a] py-24">
      {/* Manchas orgânicas decorativas */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#c9a96e]/8 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#c9a96e]/6 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl pointer-events-none" />

      {/* Folhas decorativas — inspiradas no Template 3 */}
      <div className="absolute top-8 right-12 text-5xl opacity-10 rotate-12 pointer-events-none select-none">🌿</div>
      <div className="absolute bottom-8 left-12 text-5xl opacity-10 -rotate-12 pointer-events-none select-none">🌿</div>

      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-14 h-14 bg-[#c9a96e]/15 border border-[#c9a96e]/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={22} className="text-[#c9a96e]" />
          </div>

          <p className="text-xs font-semibold tracking-widest uppercase text-[#c9a96e] mb-3">Newsletter</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
            Não perca nenhuma<br />novidade
          </h2>
          <p className="text-gray-400 mt-4 leading-relaxed">
            Receba dicas de skincare, lançamentos exclusivos e ofertas
            especiais diretamente no seu e-mail.
          </p>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 bg-[#c9a96e]/15 border border-[#c9a96e]/30 rounded-2xl px-6 py-5 text-[#c9a96e] font-medium"
            >
              ✓ Perfeito! Você está na nossa lista VIP.
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
              className="mt-8 flex gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 bg-white/8 border border-white/15 text-white placeholder-gray-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#c9a96e] hover:bg-[#a07840] text-white px-6 py-3.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 shrink-0"
              >
                <Send size={14} />
                Assinar
              </button>
            </form>
          )}

          <p className="text-xs text-gray-600 mt-4">Sem spam. Cancele quando quiser.</p>
        </motion.div>
      </div>
    </section>
  );
}
