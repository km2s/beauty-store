"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ana Paula S.",
    skin: "Pele oleosa",
    text: "O Sérum de Vitamina C mudou minha pele em 3 semanas. As manchas sumiram e a textura ficou incrível!",
    rating: 5,
    avatar: "A",
  },
  {
    name: "Mariana C.",
    skin: "Pele seca",
    text: "Fiz o Skin Quiz e as recomendações foram perfeitas. O hidratante é o melhor que já usei na vida.",
    rating: 5,
    avatar: "M",
  },
  {
    name: "Beatriz L.",
    skin: "Pele mista",
    text: "Adoro a transparência dos ingredientes! Cada produto explica o que faz. A rotina ficou super fácil.",
    rating: 5,
    avatar: "B",
  },
  {
    name: "Fernanda R.",
    skin: "Pele sensível",
    text: "Nunca achei uma marca que entendesse pele sensível tão bem. Zero irritação e resultado visível.",
    rating: 5,
    avatar: "F",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#fdf8f2]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-[#c9a96e] mb-3">Depoimentos</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a]">
            O que nossas clientes dizem
          </h2>

          {/* Rating summary */}
          <div className="inline-flex items-center gap-3 bg-white border border-[#e8d5bb] rounded-full px-6 py-3 mt-6 shadow-sm">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="#c9a96e" className="text-[#c9a96e]" />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#1a1a1a]">4.9</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">+50.000 clientes satisfeitas</span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <Quote size={24} className="text-[#c9a96e]/30 mb-4" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} fill="#c9a96e" className="text-[#c9a96e]" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-50">
                <div className="w-9 h-9 rounded-full bg-[#c9a96e] flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.skin}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
