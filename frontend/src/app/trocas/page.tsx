"use client";
import { motion } from "framer-motion";
import { RefreshCw, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const POLICIES = [
  {
    title: "Arrependimento (até 7 dias)",
    icon: Clock,
    color: "bg-blue-50 text-blue-700",
    text: "Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução sem precisar justificar, conforme o Código de Defesa do Consumidor. O produto deve estar lacrado e sem uso.",
  },
  {
    title: "Produto com defeito",
    icon: AlertCircle,
    color: "bg-red-50 text-red-700",
    text: "Identificou algum problema? Nos envie fotos do produto e da embalagem por e-mail. Faremos a troca sem custo, incluindo frete.",
  },
  {
    title: "Produto diferente do pedido",
    icon: RefreshCw,
    color: "bg-yellow-50 text-yellow-700",
    text: "Se receber um produto diferente do que pediu, entre em contato em até 48h. Resolvemos com prioridade máxima.",
  },
];

const FAQS = [
  {
    q: "Como inicio uma troca ou devolução?",
    a: "Acesse sua conta em Meus Pedidos, localize o pedido e clique em 'Solicitar troca/devolução'. Ou envie um e-mail para trocas@beautystore.com.br com o número do pedido e o motivo.",
  },
  {
    q: "Quanto tempo leva o reembolso?",
    a: "Após recebermos e conferirmos o produto, o reembolso é processado em até 5 dias úteis. No cartão de crédito, pode aparecer na próxima fatura ou subsequente dependendo da operadora.",
  },
  {
    q: "Quem paga o frete da devolução?",
    a: "Em caso de defeito ou erro nosso, o frete é por nossa conta. Em caso de arrependimento, o frete de retorno é por conta do cliente.",
  },
  {
    q: "Posso trocar por outro produto?",
    a: "Sim! Na solicitação, informe qual produto deseja receber em troca. Se o novo item tiver valor diferente, a diferença é cobrada ou devolvida conforme o caso.",
  },
  {
    q: "E se meu produto chegar avariado?",
    a: "Tire fotos da embalagem e do produto assim que receber e nos envie. Tratamos como prioridade e enviamos um novo produto sem custo adicional.",
  },
];

export default function TrocasPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs text-[#c9a96e] font-semibold tracking-widest uppercase mb-2">Política</p>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Trocas & Devoluções</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Sua satisfação é nossa prioridade. Veja como funciona nosso processo.
          </p>
        </div>

        {/* Policy cards */}
        <div className="space-y-4 mb-12">
          {POLICIES.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.color}`}>
                <p.icon size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-1">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Steps */}
        <div className="bg-[#f5efe6] rounded-2xl p-6 mb-12">
          <h2 className="font-semibold text-[#1a1a1a] mb-5">Como solicitar</h2>
          <div className="space-y-4">
            {[
              { step: "01", label: "Acesse Minha Conta", desc: "Vá em Meus Pedidos e encontre o pedido." },
              { step: "02", label: "Clique em Solicitar", desc: "Escolha 'Troca' ou 'Devolução' e informe o motivo." },
              { step: "03", label: "Aguarde confirmação", desc: "Em até 24h úteis você recebe instruções por e-mail." },
              { step: "04", label: "Envio ou coleta", desc: "Dependendo do caso, agendaremos coleta ou enviaremos etiqueta." },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#c9a96e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{s.label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <h2 className="font-semibold text-[#1a1a1a] mb-4">Dúvidas frequentes</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <p className="text-sm font-medium text-[#1a1a1a] pr-4">{faq.q}</p>
                {open === i ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center p-5 bg-[#1a1a1a] rounded-2xl text-white">
          <CheckCircle size={28} className="text-[#c9a96e] mx-auto mb-2" />
          <p className="font-semibold">Precisa de ajuda?</p>
          <p className="text-sm text-gray-400 mt-1">
            E-mail: <span className="text-[#c9a96e]">trocas@beautystore.com.br</span><br />
            Atendimento: seg–sex das 9h às 18h
          </p>
        </div>
      </div>
    </div>
  );
}
