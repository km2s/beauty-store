"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export default function Hero() {
  return (
    <section className="flex flex-col overflow-hidden bg-[#fdf8f2] pt-16">
      {/* Announcement bar */}
      <div className="bg-[#1a1a1a] text-white text-xs py-2.5 text-center tracking-widest font-medium">
        ✦&nbsp; FRETE GRÁTIS EM PEDIDOS ACIMA DE R$299 &nbsp;·&nbsp; NOVA COLEÇÃO DISPONÍVEL &nbsp;✦
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-10 items-center py-20 md:py-28">
        {/* ── Texto ── */}
        <div>
          <motion.p
            {...fadeUp(0)}
            className="text-xs font-semibold tracking-widest uppercase text-[#c9a96e] mb-5"
          >
            Beauty Products — Primavera 2025
          </motion.p>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-[#1a1a1a]"
          >
            Skin care que<br />
            <span className="text-[#c9a96e] italic">realmente</span><br />
            funciona.
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-base text-gray-500 leading-relaxed max-w-md"
          >
            Cosméticos premium com ingredientes 100% naturais. Encontre a rotina
            perfeita para a sua pele com a ajuda da nossa IA.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/colecao/skincare"
              className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#c9a96e] text-white px-8 py-4 rounded-full font-medium transition-colors duration-300 text-sm"
            >
              Ver produtos
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/quiz"
              className="flex items-center gap-2 border border-[#1a1a1a]/30 text-[#1a1a1a] hover:border-[#c9a96e] hover:text-[#c9a96e] px-8 py-4 rounded-full font-medium transition-colors duration-300 text-sm"
            >
              <Sparkles size={14} />
              Fazer Skin Quiz
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp(0.45)} className="flex gap-10 mt-14 pt-10 border-t border-[#1a1a1a]/10">
            {[
              { value: "50k+", label: "Clientes felizes" },
              { value: "4.9★", label: "Avaliação média" },
              { value: "100%", label: "Natural e vegano" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-[#1a1a1a]">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Visual ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative flex justify-center"
        >
          {/* Card editorial principal */}
          <div className="relative w-full max-w-sm md:max-w-none">
            {/* Fundo arredondado estilo arco */}
            <div className="relative w-full aspect-3/4 bg-[#f0e8dc] rounded-[2.5rem] overflow-hidden flex items-end justify-center">
              {/* Círculo decorativo */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#c9a96e]/15 rounded-full" />
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#c9a96e]/10 rounded-full" />
              {/* Emoji produto */}
              <div className="relative z-10 pb-12 text-center">
                <div className="text-[6rem] leading-none mb-2">🌿</div>
                <p className="text-[#a07840] text-xs font-semibold uppercase tracking-widest">Skincare Natural</p>
              </div>
            </div>

            {/* Badge flutuante — topo */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -top-5 -right-5 bg-white rounded-2xl px-4 py-3 shadow-xl shadow-black/10 border border-gray-50"
            >
              <div className="flex gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} fill="#c9a96e" className="text-[#c9a96e]" />
                ))}
              </div>
              <p className="text-xs font-semibold text-[#1a1a1a]">Sérum Vitamina C</p>
              <p className="text-[#c9a96e] font-bold text-sm mt-0.5">R$ 129,90</p>
            </motion.div>

            {/* Badge flutuante — baixo */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.6 }}
              className="absolute -bottom-5 -left-5 bg-[#1a1a1a] rounded-2xl px-4 py-3 shadow-xl shadow-black/20"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#c9a96e]" />
                <p className="text-xs text-gray-300 font-medium">Skin Quiz com IA</p>
              </div>
              <p className="text-white text-sm font-semibold mt-1">Rotina personalizada →</p>
            </motion.div>

            {/* Rótulo lateral */}
            <div className="absolute top-1/2 -left-10 -translate-y-1/2 -rotate-90 text-[10px] text-gray-300 tracking-[0.3em] uppercase hidden md:block">
              Coleção Primavera
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
