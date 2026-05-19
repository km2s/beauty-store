"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ShoppingBag, MapPin, Truck, CreditCard, Check, Package, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { api } from "@/lib/api";

type Step = "sacola" | "endereco" | "entrega" | "pagamento";

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "sacola",    label: "Sacola",   icon: ShoppingBag },
  { id: "endereco",  label: "Endereço", icon: MapPin },
  { id: "entrega",   label: "Entrega",  icon: Truck },
  { id: "pagamento", label: "Pagamento", icon: CreditCard },
];

const SHIPPING_OPTIONS = [
  { id: "pac",     label: "PAC",       desc: "6–10 dias úteis",  price: 0,     badge: "Grátis acima de R$299" },
  { id: "sedex",   label: "SEDEX",     desc: "2–4 dias úteis",   price: 29.90, badge: null },
  { id: "expresso",label: "Expresso",  desc: "1–2 dias úteis",   price: 49.90, badge: "Mais rápido" },
];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              active ? "bg-[#1a1a1a] text-white" :
              done  ? "bg-[#c9a96e] text-white" :
                      "bg-gray-100 text-gray-400"
            }`}>
              {done ? <Check size={12} /> : <step.icon size={12} />}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-px mx-1 transition-colors ${i < idx ? "bg-[#c9a96e]" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderSummary({ shipping }: { shipping: number }) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const FREE_SHIPPING_MIN = 299;
  const freeShipping = total >= FREE_SHIPPING_MIN;

  return (
    <div className="bg-[#f5efe6] rounded-2xl p-6 space-y-4">
      <h3 className="font-semibold text-[#1a1a1a]">Resumo do pedido</h3>

      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-white rounded-xl shrink-0 overflow-hidden relative">
              {item.image_url
                ? <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-lg">🧴</div>
              }
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c9a96e] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#1a1a1a] line-clamp-1">{item.product_name}</p>
              <p className="text-[10px] text-gray-400">{item.variant_name}</p>
            </div>
            <p className="text-xs font-semibold text-[#1a1a1a]">
              R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-[#e8d5bb] pt-3 space-y-2 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>R$ {total.toFixed(2).replace(".", ",")}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Frete</span>
          <span className={freeShipping && shipping === 0 ? "text-green-600 font-medium" : ""}>
            {shipping === 0 && freeShipping ? "Grátis" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
          </span>
        </div>
        <div className="flex justify-between font-bold text-base text-[#1a1a1a] pt-1 border-t border-[#e8d5bb]">
          <span>Total</span>
          <span>R$ {(total + (freeShipping ? 0 : shipping)).toFixed(2).replace(".", ",")}</span>
        </div>
      </div>

      {!freeShipping && (
        <p className="text-[11px] text-gray-400 text-center">
          Faltam R$ {(FREE_SHIPPING_MIN - total).toFixed(2).replace(".", ",")} para frete grátis
        </p>
      )}
    </div>
  );
}

/* ── Etapas ── */

function StepSacola({ onNext }: { onNext: () => void }) {
  const items = useCartStore((s) => s.items);
  const { updateQty, removeItem } = useCartStore();

  if (items.length === 0) return (
    <div className="text-center py-16 text-gray-400 space-y-3">
      <ShoppingBag size={48} strokeWidth={1} className="mx-auto" />
      <p>Sua sacola está vazia</p>
      <Link href="/colecao/skincare" className="text-sm text-[#c9a96e] hover:underline">
        Continuar comprando
      </Link>
    </div>
  );

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 items-center p-4 border border-gray-100 rounded-2xl">
          <div className="w-16 h-16 bg-[#f5efe6] rounded-xl overflow-hidden shrink-0 relative">
            {item.image_url
              ? <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-2xl">🧴</div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-[#1a1a1a] line-clamp-1">{item.product_name}</p>
            <p className="text-xs text-gray-400">{item.variant_name}</p>
            <p className="text-[#c9a96e] font-semibold text-sm mt-1">
              R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
            </p>
          </div>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden text-sm">
            <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-50">−</button>
            <span className="px-2 font-medium">{item.quantity}</span>
            <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-50">+</button>
          </div>
        </div>
      ))}

      {/* Modo Presente */}
      <GiftModeToggle />

      <button
        onClick={onNext}
        className="w-full bg-[#1a1a1a] hover:bg-[#c9a96e] text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
      >
        Ir para endereço <ChevronRight size={16} />
      </button>
    </div>
  );
}

function GiftModeToggle() {
  const [gift, setGift] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <div className="border border-dashed border-gray-200 rounded-2xl p-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setGift(!gift)}
          className={`w-10 h-6 rounded-full transition-colors relative ${gift ? "bg-[#c9a96e]" : "bg-gray-200"}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${gift ? "left-5" : "left-1"}`} />
        </div>
        <div className="flex items-center gap-2">
          <Gift size={16} className="text-[#c9a96e]" />
          <span className="text-sm font-medium text-[#1a1a1a]">Modo Presente</span>
        </div>
      </label>
      <AnimatePresence>
        {gift && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-3"
          >
            <p className="text-xs text-gray-400 mb-2">Mensagem personalizada (opcional)</p>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="Escreva uma mensagem carinhosa..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c9a96e] resize-none"
            />
            <p className="text-[10px] text-gray-300 text-right">{msg.length}/200</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepEndereco({ onNext }: { onNext: (addr: any) => void }) {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "",
    zip_code: "", street: "", number: "",
    complement: "", neighborhood: "", city: "", state: "",
  });
  const [loadingCep, setLoadingCep] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function fetchCep(cep: string) {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setLoadingCep(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setForm((f) => ({ ...f, street: d.logradouro, neighborhood: d.bairro, city: d.localidade, state: d.uf }));
      }
    } finally {
      setLoadingCep(false);
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.full_name) e.full_name = "Nome obrigatório";
    if (!form.email) e.email = "E-mail obrigatório";
    if (!form.zip_code) e.zip_code = "CEP obrigatório";
    if (!form.street) e.street = "Rua obrigatória";
    if (!form.number) e.number = "Número obrigatório";
    if (!form.city) e.city = "Cidade obrigatória";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const field = (label: string, key: keyof typeof form, opts?: { placeholder?: string; half?: boolean; type?: string }) => (
    <div className={opts?.half ? "col-span-1" : "col-span-2"}>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <input
        type={opts?.type || "text"}
        value={form[key]}
        onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: "" }); }}
        onBlur={key === "zip_code" ? (e) => fetchCep(e.target.value) : undefined}
        placeholder={opts?.placeholder}
        className={`w-full border rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors ${
          errors[key] ? "border-red-300 bg-red-50" : "border-gray-200"
        } ${loadingCep && key === "street" ? "opacity-50" : ""}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {field("Nome completo", "full_name")}
        <div className="col-span-2 grid grid-cols-2 gap-3">
          {field("E-mail", "email", { half: true, type: "email" })}
          {field("Telefone", "phone", { half: true, placeholder: "(11) 99999-9999" })}
        </div>
        {field("CEP", "zip_code", { half: true, placeholder: "00000-000" })}
        {field("Número", "number", { half: true })}
        {field("Rua / Avenida", "street")}
        <div className="col-span-2 grid grid-cols-2 gap-3">
          {field("Bairro", "neighborhood", { half: true })}
          {field("Complemento", "complement", { half: true, placeholder: "Apto, bloco... (opcional)" })}
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-3">
          {field("Cidade", "city", { half: true })}
          {field("Estado (UF)", "state", { half: true, placeholder: "SP" })}
        </div>
      </div>
      <button
        onClick={() => validate() && onNext(form)}
        className="w-full bg-[#1a1a1a] hover:bg-[#c9a96e] text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
      >
        Escolher entrega <ChevronRight size={16} />
      </button>
    </div>
  );
}

function StepEntrega({ onNext }: { onNext: (shipping: { id: string; price: number }) => void }) {
  const [selected, setSelected] = useState("pac");
  const total = useCartStore((s) => s.total());
  const freeShipping = total >= 299;

  return (
    <div className="space-y-4">
      {SHIPPING_OPTIONS.map((opt) => {
        const price = opt.id === "pac" && freeShipping ? 0 : opt.price;
        return (
          <label
            key={opt.id}
            className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
              selected === opt.id ? "border-[#c9a96e] bg-[#f5efe6]" : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div
              onClick={() => setSelected(opt.id)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                selected === opt.id ? "border-[#c9a96e]" : "border-gray-300"
              }`}
            >
              {selected === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#c9a96e]" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#1a1a1a]">{opt.label}</span>
                {opt.badge && (
                  <span className="text-[10px] bg-[#c9a96e] text-white px-2 py-0.5 rounded-full">{opt.badge}</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
            </div>
            <span className={`font-bold text-sm ${price === 0 ? "text-green-600" : "text-[#1a1a1a]"}`}>
              {price === 0 ? "Grátis" : `R$ ${price.toFixed(2).replace(".", ",")}`}
            </span>
          </label>
        );
      })}

      <button
        onClick={() => {
          const opt = SHIPPING_OPTIONS.find((o) => o.id === selected)!;
          const price = opt.id === "pac" && freeShipping ? 0 : opt.price;
          onNext({ id: selected, price });
        }}
        className="w-full bg-[#1a1a1a] hover:bg-[#c9a96e] text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors mt-2"
      >
        Ir para pagamento <ChevronRight size={16} />
      </button>
    </div>
  );
}

function StepPagamento({ address, shipping, onDone }: { address: any; shipping: any; onDone: (url: string) => void }) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const orderItems = items.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.price,
      }));
      const res = await api.post("/payments/checkout", {
        items: orderItems,
        shipping_address: {
          street: address.street,
          number: address.number,
          complement: address.complement || null,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          zip_code: address.zip_code.replace(/\D/g, ""),
        },
        shipping_method: shipping.id,
        gift_mode: false,
      });
      onDone(res.data.payment_url);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Erro ao criar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Resumo endereço */}
      <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 space-y-1">
        <p className="font-semibold text-[#1a1a1a] text-xs uppercase tracking-wider mb-2">Entregando para</p>
        <p>{address.full_name}</p>
        <p>{address.street}, {address.number}{address.complement ? `, ${address.complement}` : ""}</p>
        <p>{address.neighborhood} — {address.city}/{address.state}</p>
        <p>CEP {address.zip_code}</p>
      </div>

      {/* Método de pagamento */}
      <div>
        <p className="text-sm font-semibold text-[#1a1a1a] mb-3">Forma de pagamento</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "💳", label: "Cartão" },
            { icon: "🏦", label: "Pix" },
            { icon: "📄", label: "Boleto" },
          ].map((m, i) => (
            <div
              key={m.label}
              className={`flex flex-col items-center gap-1.5 p-4 border-2 rounded-2xl text-sm ${
                i === 0 ? "border-[#c9a96e] bg-[#f5efe6]" : "border-gray-100 opacity-50"
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="text-xs font-medium text-[#1a1a1a]">{m.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Você será redirecionado ao Mercado Pago para concluir o pagamento com segurança.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-[#c9a96e] hover:bg-[#a07840] disabled:opacity-60 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-base"
      >
        {loading ? (
          <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <><CreditCard size={18} /> Finalizar e pagar</>
        )}
      </button>
    </div>
  );
}

function OrderSuccess({ paymentUrl }: { paymentUrl: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-10 space-y-5"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, delay: 0.1 }}
        className="w-20 h-20 bg-[#c9a96e] rounded-full flex items-center justify-center mx-auto"
      >
        <Package size={36} className="text-white" />
      </motion.div>
      <div>
        <h2 className="text-2xl font-semibold text-[#1a1a1a]">Pedido criado!</h2>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
          Clique abaixo para concluir o pagamento de forma segura pelo Mercado Pago.
        </p>
      </div>
      <a
        href={paymentUrl}
        className="inline-flex items-center gap-2 bg-[#c9a96e] hover:bg-[#a07840] text-white px-8 py-4 rounded-xl font-semibold transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <CreditCard size={18} /> Ir para o pagamento
      </a>
      <div>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 underline">
          Voltar para a loja
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Página ── */
export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("sacola");
  const [address, setAddress] = useState<any>(null);
  const [shipping, setShipping] = useState<{ id: string; price: number }>({ id: "pac", price: 0 });
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const slide = { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-[#1a1a1a] text-center mb-2">Checkout</h1>

        {!paymentUrl && <StepIndicator current={step} />}

        <div className="grid md:grid-cols-5 gap-10 items-start">
          {/* Formulários */}
          <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              {paymentUrl ? (
                <OrderSuccess key="success" paymentUrl={paymentUrl} />
              ) : step === "sacola" ? (
                <motion.div key="sacola" {...slide} transition={{ duration: 0.25 }}>
                  <StepSacola onNext={() => setStep("endereco")} />
                </motion.div>
              ) : step === "endereco" ? (
                <motion.div key="endereco" {...slide} transition={{ duration: 0.25 }}>
                  <h2 className="font-semibold text-lg text-[#1a1a1a] mb-5">Endereço de entrega</h2>
                  <StepEndereco onNext={(addr) => { setAddress(addr); setStep("entrega"); }} />
                </motion.div>
              ) : step === "entrega" ? (
                <motion.div key="entrega" {...slide} transition={{ duration: 0.25 }}>
                  <h2 className="font-semibold text-lg text-[#1a1a1a] mb-5">Método de entrega</h2>
                  <StepEntrega onNext={(s) => { setShipping(s); setStep("pagamento"); }} />
                </motion.div>
              ) : (
                <motion.div key="pagamento" {...slide} transition={{ duration: 0.25 }}>
                  <h2 className="font-semibold text-lg text-[#1a1a1a] mb-5">Pagamento</h2>
                  <StepPagamento
                    address={address}
                    shipping={shipping}
                    onDone={(url) => setPaymentUrl(url)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar resumo */}
          {!paymentUrl && (
            <div className="md:col-span-2">
              <OrderSummary shipping={shipping.price} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
