"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Clock, Check, Send } from "lucide-react";

export default function ContatoPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs text-[#c9a96e] font-semibold tracking-widest uppercase mb-2">Suporte</p>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Fale Conosco</h1>
          <p className="text-gray-500 text-sm mt-2">Adoramos ouvir você! Responderemos em até 24h úteis.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-6">
            {[
              {
                icon: Mail, title: "E-mail", color: "bg-[#c9a96e]/15 text-[#c9a96e]",
                lines: ["contato@beautystore.com.br", "trocas@beautystore.com.br"],
              },
              {
                icon: MessageCircle, title: "WhatsApp", color: "bg-green-100 text-green-600",
                lines: ["(11) 99999-0000", "seg–sex, 9h–18h"],
              },
              {
                icon: Clock, title: "Horário de atendimento", color: "bg-blue-100 text-blue-600",
                lines: ["Segunda a Sexta: 9h–18h", "Sábado: 9h–13h"],
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[#1a1a1a] text-sm mb-0.5">{item.title}</p>
                  {item.lines.map((l) => <p key={l} className="text-sm text-gray-500">{l}</p>)}
                </div>
              </div>
            ))}

            <div className="bg-[#f5efe6] rounded-2xl p-5 mt-4">
              <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Acesso rápido</p>
              <div className="space-y-2">
                {[
                  { label: "Rastrear meu pedido", href: "/rastrear" },
                  { label: "Trocas e devoluções", href: "/trocas" },
                  { label: "Perguntas frequentes", href: "/faq" },
                  { label: "Minha conta", href: "/conta" },
                ].map((link) => (
                  <a key={link.href} href={link.href}
                    className="flex items-center justify-between py-1.5 text-sm text-gray-600 hover:text-[#c9a96e] transition-colors group">
                    <span>{link.label}</span>
                    <span className="text-gray-300 group-hover:text-[#c9a96e]">→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full py-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check size={28} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] text-lg mb-2">Mensagem enviada!</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Obrigada por entrar em contato. Responderemos em até 24h úteis.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="text-sm text-[#c9a96e] hover:underline"
                >
                  Enviar outra mensagem
                </button>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome</label>
                    <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
                      placeholder="Seu nome" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">E-mail</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
                      placeholder="seu@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Assunto</label>
                  <select required value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors">
                    <option value="">Selecione...</option>
                    <option>Dúvida sobre produto</option>
                    <option>Status do meu pedido</option>
                    <option>Troca ou devolução</option>
                    <option>Problema na compra</option>
                    <option>Sugestão</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mensagem</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors resize-none"
                    placeholder="Descreva sua dúvida ou solicitação..." />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#c9a96e] text-white py-3.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send size={15} /> Enviar mensagem</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
