"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const steps = [
  { n: "01", label: "Tipo de pele" },
  { n: "02", label: "Preocupações" },
  { n: "03", label: "Sensibilidades" },
  { n: "04", label: "Rotina ideal" },
];

export default function QuizBanner() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-[#1a1a1a] rounded-3xl"
        >
          {/* Manchas decorativas */}
          <div className="absolute top-0 right-0 w-125 h-125 bg-[#c9a96e]/8 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-75 h-75 bg-[#c9a96e]/6 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl pointer-events-none" />

          <div className="relative z-10 px-8 md:px-16 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Texto */}
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e] text-xs font-semibold px-4 py-2 rounded-full mb-6 tracking-wider uppercase">
                <Sparkles size={13} />
                Tecnologia com IA
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
                Descubra a rotina<br />
                <span className="text-[#c9a96e]">perfeita para você</span>
              </h2>
              <p className="text-gray-400 mt-5 leading-relaxed">
                Responda 5 perguntas rápidas sobre a sua pele e nossa IA monta
                uma rotina personalizada com os produtos certos para os seus objetivos.
              </p>
              <Link
                href="/quiz"
                className="mt-8 inline-flex items-center gap-2 bg-[#c9a96e] hover:bg-[#a07840] text-white px-8 py-4 rounded-full font-medium text-sm transition-colors"
              >
                <Sparkles size={15} />
                Fazer meu Skin Quiz
                <ArrowRight size={15} />
              </Link>
              <p className="text-xs text-gray-600 mt-3">Gratuito · Menos de 2 minutos</p>
            </div>

            {/* Steps visuais */}
            <div className="flex flex-col gap-3 w-full max-w-xs shrink-0">
              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4"
                >
                  <span className="text-[#c9a96e] font-bold text-lg w-8">{s.n}</span>
                  <span className="text-gray-300 text-sm font-medium">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
