"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, ChevronLeft, Check, RotateCcw } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

// ─── Quiz data ────────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: "skin_type",
    question: "Qual é o seu tipo de pele?",
    subtitle: "Escolha a opção que melhor descreve sua pele na maior parte do tempo.",
    type: "single",
    options: [
      { value: "oleosa",    label: "Oleosa",    emoji: "💧", desc: "Brilho excessivo, poros dilatados" },
      { value: "seca",      label: "Seca",      emoji: "🌵", desc: "Ressecamento, sensação de tensão" },
      { value: "mista",     label: "Mista",     emoji: "⚖️",  desc: "Zona T oleosa, bochechas secas" },
      { value: "normal",    label: "Normal",    emoji: "✨", desc: "Equilibrada, poucos problemas" },
      { value: "sensivel",  label: "Sensível",  emoji: "🌸", desc: "Reativa, vermelhidão frequente" },
    ],
  },
  {
    id: "concerns",
    question: "Quais são as suas principais preocupações?",
    subtitle: "Selecione todas que se aplicam à sua pele.",
    type: "multi",
    options: [
      { value: "manchas",    label: "Manchas",     emoji: "🎯" },
      { value: "acne",       label: "Acne",        emoji: "❌" },
      { value: "rugas",      label: "Rugas",       emoji: "🔍" },
      { value: "poros",      label: "Poros",       emoji: "🔬" },
      { value: "olheiras",   label: "Olheiras",    emoji: "👁️" },
      { value: "hidratacao", label: "Hidratação",  emoji: "💦" },
      { value: "firmeza",    label: "Firmeza",     emoji: "💪" },
    ],
  },
  {
    id: "current_routine",
    question: "Como é a sua rotina de skincare atual?",
    subtitle: "Isso nos ajuda a recomendar produtos que se encaixam no seu dia a dia.",
    type: "single",
    options: [
      { value: "nenhuma",     label: "Não tenho rotina",     emoji: "🌱", desc: "Só água e sabonete" },
      { value: "basica",      label: "Básica",               emoji: "🧴", desc: "Hidratante e protetor solar" },
      { value: "intermediaria",label: "Intermediária",       emoji: "✅", desc: "Limpeza, tônico, hidratante, FPS" },
      { value: "completa",    label: "Completa",             emoji: "⭐", desc: "Multi-etapas AM e PM" },
    ],
  },
  {
    id: "age_range",
    question: "Qual é a sua faixa etária?",
    subtitle: "As necessidades da pele mudam com a idade.",
    type: "single",
    options: [
      { value: "18-24", label: "18–24 anos", emoji: "🌟" },
      { value: "25-34", label: "25–34 anos", emoji: "✨" },
      { value: "35-44", label: "35–44 anos", emoji: "💫" },
      { value: "45-54", label: "45–54 anos", emoji: "🌙" },
      { value: "55+",   label: "55+ anos",   emoji: "🏆" },
    ],
  },
  {
    id: "sensitivities",
    question: "Tem alguma sensibilidade ou restrição?",
    subtitle: "Selecione tudo que você prefere evitar nos seus produtos.",
    type: "multi",
    options: [
      { value: "fragrancias",  label: "Fragrâncias",    emoji: "🚫" },
      { value: "alcool",       label: "Álcool",         emoji: "🍷" },
      { value: "parabenos",    label: "Parabenos",      emoji: "⚗️" },
      { value: "sulfatos",     label: "Sulfatos",       emoji: "🧪" },
      { value: "retinol",      label: "Retinol",        emoji: "🔴" },
      { value: "nenhuma",      label: "Nenhuma",        emoji: "✅" },
    ],
  },
];

interface Answers {
  skin_type: string;
  concerns: string[];
  current_routine: string;
  age_range: string;
  sensitivities: string[];
}

interface Recommendation {
  id: string;
  name: string;
  slug: string;
  reason: string;
  variants?: { id: string; price: number; compare_at_price?: number; name: string }[];
  images?: { url: string; alt?: string }[];
  skin_types?: string[];
  avg_rating?: number;
  review_count?: number;
}

// ─── Option button ─────────────────────────────────────────────────────────────

function OptionBtn({
  label, emoji, desc, selected, onClick, multi,
}: {
  label: string; emoji: string; desc?: string; selected: boolean; onClick: () => void; multi: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`relative w-full text-left px-5 py-4 rounded-2xl border-2 transition-all ${
        selected
          ? "border-[#c9a96e] bg-[#fdf8f2]"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm ${selected ? "text-[#1a1a1a]" : "text-gray-700"}`}>{label}</p>
          {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
        </div>
        <div className={`w-5 h-5 flex-shrink-0 rounded-${multi ? "md" : "full"} border-2 flex items-center justify-center transition-all ${
          selected ? "border-[#c9a96e] bg-[#c9a96e]" : "border-gray-300"
        }`}>
          {selected && <Check size={11} className="text-white" strokeWidth={3} />}
        </div>
      </div>
    </motion.button>
  );
}

// ─── Progress bar ──────────────────────────────────────────────────────────────

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
            i < step ? "bg-[#c9a96e]" : i === step ? "bg-[#c9a96e]/40" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function QuizPage() {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    skin_type: "",
    concerns: [],
    current_routine: "",
    age_range: "",
    sensitivities: [],
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState("");

  const currentStep = STEPS[stepIdx];
  const isMulti = currentStep?.type === "multi";

  function getValue(stepId: string): string | string[] {
    return answers[stepId as keyof Answers];
  }

  function isSelected(stepId: string, val: string): boolean {
    const v = getValue(stepId);
    return Array.isArray(v) ? v.includes(val) : v === val;
  }

  function canAdvance(): boolean {
    const v = getValue(currentStep.id);
    return Array.isArray(v) ? v.length > 0 : v !== "";
  }

  function handleSelect(val: string) {
    const id = currentStep.id as keyof Answers;
    if (isMulti) {
      const prev = answers[id] as string[];
      if (val === "nenhuma") {
        setAnswers((a) => ({ ...a, [id]: prev.includes("nenhuma") ? [] : ["nenhuma"] }));
      } else {
        const without = prev.filter((x) => x !== "nenhuma");
        setAnswers((a) => ({
          ...a,
          [id]: without.includes(val) ? without.filter((x) => x !== val) : [...without, val],
        }));
      }
    } else {
      setAnswers((a) => ({ ...a, [id]: val }));
    }
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/quiz/recommend", answers);
      setResults(res.data.recommendations);
    } catch {
      setError("Não foi possível carregar as recomendações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setStepIdx(0);
    setAnswers({ skin_type: "", concerns: [], current_routine: "", age_range: "", sensitivities: [] });
    setResults(null);
    setError("");
  }

  // ── Results screen ──────────────────────────────────────────────────────────
  if (results !== null) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6 bg-gradient-to-b from-[#fdf8f2] to-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c9a96e]/15 mb-5">
              <Sparkles size={28} className="text-[#c9a96e]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-3">
              Sua análise personalizada
            </h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Com base no seu perfil, nossa IA selecionou os produtos ideais para a sua pele.
            </p>
          </motion.div>

          {results.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p>Nenhum produto encontrado para o seu perfil.</p>
              <button onClick={restart} className="mt-4 text-[#c9a96e] hover:underline text-sm">
                Refazer quiz
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {results.map((product, i) => (
                  <div key={product.id} className="flex flex-col gap-3">
                    <ProductCard product={product} index={i} />
                    {product.reason && (
                      <div className="bg-[#fdf8f2] border border-[#c9a96e]/30 rounded-xl px-4 py-3">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          <span className="font-semibold text-[#c9a96e]">Por que este produto? </span>
                          {product.reason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={restart}
                  className="flex items-center gap-2 border border-gray-200 px-6 py-3 rounded-xl text-sm font-medium hover:border-[#c9a96e] transition-colors"
                >
                  <RotateCcw size={15} />
                  Refazer quiz
                </button>
                <Link
                  href="/colecao/skincare"
                  className="bg-[#1a1a1a] hover:bg-[#c9a96e] text-white px-8 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Ver todos os produtos
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fdf8f2] to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-6"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-[#c9a96e]/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#c9a96e] animate-spin" />
            <Sparkles className="absolute inset-0 m-auto text-[#c9a96e]" size={28} />
          </div>
          <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Analisando seu perfil…</h2>
          <p className="text-sm text-gray-500">Nossa IA está selecionando os melhores produtos para você.</p>
        </motion.div>
      </div>
    );
  }

  // ── Quiz steps ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf8f2] to-white pt-24 pb-20 px-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[#c9a96e] text-xs font-semibold tracking-widest uppercase mb-3">
            <Sparkles size={13} />
            Skin Quiz — IA
          </div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Descubra sua rotina ideal</h1>
          <p className="text-gray-500 text-sm mt-2">
            {STEPS.length} perguntas para produtos personalizados para você
          </p>
        </div>

        <Progress step={stepIdx} total={STEPS.length} />

        <AnimatePresence mode="wait">
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step label */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-gray-400 font-medium">
                Passo {stepIdx + 1} de {STEPS.length}
              </p>
              {isMulti && (
                <p className="text-xs text-[#c9a96e] font-medium">Seleção múltipla</p>
              )}
            </div>

            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-1">{currentStep.question}</h2>
            <p className="text-sm text-gray-500 mb-6">{currentStep.subtitle}</p>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentStep.options.map((opt) => (
                <OptionBtn
                  key={opt.value}
                  label={opt.label}
                  emoji={opt.emoji}
                  desc={"desc" in opt ? opt.desc : undefined}
                  selected={isSelected(currentStep.id, opt.value)}
                  onClick={() => handleSelect(opt.value)}
                  multi={isMulti}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-3">
              {stepIdx > 0 && (
                <button
                  onClick={() => setStepIdx((i) => i - 1)}
                  className="flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-xl text-sm font-medium hover:border-gray-300 transition-colors"
                >
                  <ChevronLeft size={16} />
                  Voltar
                </button>
              )}
              <button
                onClick={() => {
                  if (stepIdx < STEPS.length - 1) setStepIdx((i) => i + 1);
                  else submit();
                }}
                disabled={!canAdvance()}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  canAdvance()
                    ? "bg-[#1a1a1a] hover:bg-[#c9a96e] text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {stepIdx < STEPS.length - 1 ? (
                  <>
                    Próximo
                    <ChevronRight size={16} />
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Ver minha análise
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
