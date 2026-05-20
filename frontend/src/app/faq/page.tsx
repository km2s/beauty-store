"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const CATEGORIES = [
  {
    title: "Pedidos & Entregas",
    emoji: "📦",
    faqs: [
      { q: "Qual o prazo de entrega?", a: "PAC: 6–10 dias úteis. SEDEX: 2–4 dias úteis. Expresso: 1–2 dias úteis. Os prazos são contados após a confirmação do pagamento." },
      { q: "Posso rastrear meu pedido?", a: "Sim! Acesse /rastrear e insira o número do seu pedido ou código de rastreamento dos Correios." },
      { q: "Frete grátis a partir de quanto?", a: "Frete grátis via PAC para compras acima de R$299. Para valores menores, o frete é calculado no checkout pelo CEP." },
      { q: "Posso alterar o endereço depois de feito o pedido?", a: "É possível alterar em até 2 horas após a confirmação do pagamento. Após isso, o pedido já entra em separação e não é mais possível." },
    ],
  },
  {
    title: "Produtos & Skincare",
    emoji: "🧴",
    faqs: [
      { q: "Os produtos são veganos?", a: "A maioria dos nossos produtos é vegana. Cada página de produto indica se o item é vegano ou não na seção de ingredientes." },
      { q: "Como faço o Skin Quiz?", a: "Acesse /quiz e responda 5 perguntas rápidas. Nossa IA analisa seu perfil e recomenda produtos personalizados para a sua pele." },
      { q: "Os produtos têm validade?", a: "Todos os produtos exibem a validade na embalagem. Após abertos, recomendamos uso em até 12 meses ou conforme indicado no produto." },
      { q: "Posso usar os produtos na gravidez?", a: "Para uso durante a gravidez, recomendamos consultar um dermatologista. Produtos com retinol e ácidos em alta concentração geralmente são contraindicados." },
    ],
  },
  {
    title: "Pagamentos",
    emoji: "💳",
    faqs: [
      { q: "Quais formas de pagamento são aceitas?", a: "Aceitamos cartão de crédito (até 12x), Pix (5% de desconto) e boleto bancário. Pagamentos processados pelo Mercado Pago." },
      { q: "O site é seguro para comprar?", a: "Sim! Utilizamos criptografia SSL e processamento seguro via Mercado Pago. Seus dados de pagamento nunca são armazenados em nossos servidores." },
      { q: "O Pix tem desconto?", a: "Sim! Compras pagas via Pix têm 5% de desconto automaticamente aplicado no checkout." },
      { q: "Posso parcelar no cartão?", a: "Sim, parcelamos em até 12x sem juros para compras acima de R$150." },
    ],
  },
  {
    title: "Conta & Ritual Points",
    emoji: "⭐",
    faqs: [
      { q: "Como funcionam os Ritual Points?", a: "Você ganha 1 ponto por cada R$1 gasto. Também ganha 50 pts por avaliação e 100 pts por indicação. Os pontos equivalem a 5% do valor em descontos." },
      { q: "Os pontos expiram?", a: "Pontos ganhos têm validade de 12 meses a partir da data de crédito. Movimentações renovam a validade dos pontos existentes." },
      { q: "Como criar uma conta?", a: "Acesse /login, clique em 'Criar agora' e preencha seus dados. O cadastro é gratuito e leva menos de 1 minuto." },
      { q: "Esqueci minha senha, o que faço?", a: "Na tela de login, clique em 'Esqueci minha senha'. Você receberá um e-mail com instruções para redefinição." },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openItem, setOpenItem] = useState<string | null>(null);

  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (f) =>
        !search ||
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => !search || cat.faqs.length > 0);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs text-[#c9a96e] font-semibold tracking-widest uppercase mb-2">Ajuda</p>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Perguntas Frequentes</h1>
          <p className="text-gray-500 text-sm mt-2">Encontre respostas rápidas para as dúvidas mais comuns.</p>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar dúvida..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">Nenhuma resposta encontrada para "{search}".</p>
            <a href="/contato" className="mt-3 inline-block text-sm text-[#c9a96e] hover:underline">
              Falar com o suporte
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map((cat, ci) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.06 }}
              >
                <h2 className="flex items-center gap-2 text-base font-semibold text-[#1a1a1a] mb-3">
                  <span>{cat.emoji}</span>
                  {cat.title}
                </h2>
                <div className="space-y-2">
                  {cat.faqs.map((faq, fi) => {
                    const key = `${ci}-${fi}`;
                    const isOpen = openItem === key;
                    return (
                      <div key={fi} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => setOpenItem(isOpen ? null : key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left"
                        >
                          <p className="text-sm font-medium text-[#1a1a1a] pr-4">{faq.q}</p>
                          {isOpen
                            ? <ChevronUp size={15} className="text-[#c9a96e] flex-shrink-0" />
                            : <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />
                          }
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">Não encontrou o que procurava?</p>
          <a href="/contato"
            className="inline-block mt-3 bg-[#1a1a1a] hover:bg-[#c9a96e] text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">
            Falar com o suporte
          </a>
        </div>
      </div>
    </div>
  );
}
