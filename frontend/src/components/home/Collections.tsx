"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const collections = [
  { name: "Limpeza",        slug: "limpeza",    emoji: "🧴", desc: "Cleansers, tônicos e esfoliantes",   bg: "#f5f0ff", accent: "#9b7fd4" },
  { name: "Hidratação",     slug: "hidratacao", emoji: "💧", desc: "Cremes, séruns e óleos faciais",      bg: "#eef6ff", accent: "#5b9bd5" },
  { name: "Proteção Solar", slug: "solar",      emoji: "☀️", desc: "FPS 30 a 70, toque seco e tintado",  bg: "#fffbea", accent: "#c9a96e" },
  { name: "Anti-idade",     slug: "anti-idade", emoji: "⭐", desc: "Retinol, peptídeos e vitamina C",     bg: "#f5efe6", accent: "#a07840" },
  { name: "Maquiagem",      slug: "maquiagem",  emoji: "💄", desc: "Base, batom, máscara e mais",        bg: "#fff0f6", accent: "#d47fa0" },
  { name: "Kits & Presentes",slug: "kits",      emoji: "🎁", desc: "Conjuntos curados com desconto",     bg: "#edfff5", accent: "#4db87a" },
];

export default function Collections() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#c9a96e] mb-2">Categorias</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a]">Explore por categoria</h2>
          </div>
          <Link
            href="/colecao/skincare"
            className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:text-[#c9a96e] hover:border-[#c9a96e] transition-colors self-start md:self-auto"
          >
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map((col, i) => (
            <motion.div
              key={col.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/colecao/${col.slug}`}
                className="group relative flex flex-col items-start p-6 md:p-8 rounded-3xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
                style={{ backgroundColor: col.bg }}
              >
                {/* Círculo decorativo */}
                <div
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 transition-transform duration-500 group-hover:scale-150"
                  style={{ backgroundColor: col.accent }}
                />

                <span className="text-4xl mb-4 relative z-10">{col.emoji}</span>
                <h3 className="font-semibold text-[#1a1a1a] text-base relative z-10">{col.name}</h3>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2 relative z-10">{col.desc}</p>
                <span
                  className="mt-5 flex items-center gap-1 text-xs font-semibold relative z-10 transition-colors"
                  style={{ color: col.accent }}
                >
                  Ver produtos <ArrowRight size={12} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
