"use client";
import { motion } from "framer-motion";
import { Truck, RefreshCw, Shield, Leaf } from "lucide-react";

const features = [
  { icon: Truck,     title: "Entrega Rápida",      desc: "Chegue em até 5 dias úteis" },
  { icon: Leaf,      title: "100% Natural",         desc: "Sem parabenos, sem sulfatos" },
  { icon: RefreshCw, title: "Troca sem burocracia", desc: "30 dias sem perguntas" },
  { icon: Shield,    title: "Pagamento Seguro",     desc: "Criptografia 256-bit" },
];

export default function Features() {
  return (
    <section className="border-y border-gray-100 bg-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left"
          >
            <div className="w-11 h-11 rounded-full bg-[#f5efe6] flex items-center justify-center shrink-0">
              <f.icon size={18} className="text-[#c9a96e]" />
            </div>
            <div>
              <p className="font-semibold text-[#1a1a1a] text-sm">{f.title}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-snug">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
