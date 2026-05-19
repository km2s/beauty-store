"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tags = ["Sem Parabenos", "Sem Sulfatos", "Cruelty Free", "Vegano", "Dermatologicamente testado"];

export default function About() {
  return (
    <section className="py-24 bg-[#fdf8f2]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Imagem circular — esquerda */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative flex justify-center"
        >
          {/* Anel decorativo externo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[calc(100%-2rem)] max-w-sm aspect-square rounded-full border-2 border-[#c9a96e]/20" />
          </div>

          {/* Círculo principal */}
          <div className="relative w-full max-w-sm aspect-square rounded-full bg-[#f0e8dc] overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <div className="text-[6rem] leading-none">🌿</div>
              <p className="text-[#a07840] text-xs font-semibold uppercase tracking-widest mt-3">
                Natureza & Ciência
              </p>
            </div>
          </div>

          {/* Pill flutuante */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute bottom-4 right-4 bg-white rounded-2xl px-5 py-3 shadow-lg shadow-black/10"
          >
            <p className="text-xs text-gray-400">Fundada em</p>
            <p className="text-sm font-bold text-[#1a1a1a]">2020 · Brasil</p>
          </motion.div>
        </motion.div>

        {/* Texto — direita */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-[#c9a96e] mb-4">Nossa Filosofia</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] leading-tight">
            Natural.<br />
            <em className="text-[#c9a96e] not-italic">Eficaz.</em><br />
            Sustentável.
          </h2>

          <p className="text-gray-500 mt-6 leading-relaxed text-base">
            Acreditamos que a beleza não precisa vir à custa da saúde ou do planeta.
            Cada produto é formulado com ingredientes de origem natural, clinicamente
            testados e livres de toxinas desnecessárias.
          </p>
          <p className="text-gray-500 mt-4 leading-relaxed text-base">
            Unimos o melhor da natureza com tecnologia de ponta para entregar
            resultados reais, respeitando a sua pele e o meio ambiente.
          </p>

          {/* Tags certificação */}
          <div className="flex flex-wrap gap-2.5 mt-8">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-white border border-[#e8d5bb] text-[#a07840] text-xs font-medium px-4 py-2 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href="/colecao/skincare"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-0.5 hover:text-[#c9a96e] hover:border-[#c9a96e] transition-colors"
          >
            Conhecer os produtos
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
