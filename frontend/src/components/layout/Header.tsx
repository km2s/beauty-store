"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Search, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";

const navLinks = [
  {
    label: "Skincare",
    href: "/colecao/skincare",
    sub: [
      { label: "Limpeza", href: "/colecao/limpeza" },
      { label: "Hidratação", href: "/colecao/hidratacao" },
      { label: "Proteção Solar", href: "/colecao/solar" },
      { label: "Anti-idade", href: "/colecao/anti-idade" },
    ],
  },
  {
    label: "Maquiagem",
    href: "/colecao/maquiagem",
    sub: [
      { label: "Base & Corretivo", href: "/colecao/base" },
      { label: "Olhos", href: "/colecao/olhos" },
      { label: "Lábios", href: "/colecao/labios" },
    ],
  },
  { label: "Kits", href: "/colecao/kits", sub: [] },
  { label: "Skin Quiz", href: "/quiz", sub: [] },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const count = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);
  const { user, isLoggedIn } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      {/* Faixa topo */}
      <div className="bg-[#1a1a1a] text-white text-center text-xs py-2 tracking-wider">
        FRETE GRÁTIS acima de R$299 · Parcelamento em até 6x sem juros
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold tracking-widest uppercase">
            Beauty<span className="text-[#c9a96e]">.</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.sub.length > 0 && setActiveMenu(link.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#c9a96e] transition-colors"
                >
                  {link.label}
                  {link.sub.length > 0 && <ChevronDown size={14} />}
                </Link>

                <AnimatePresence>
                  {activeMenu === link.label && link.sub.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-4 min-w-[180px]"
                    >
                      {link.sub.map((s) => (
                        <Link
                          key={s.label}
                          href={s.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-[#c9a96e] hover:bg-[#f5efe6] rounded-lg transition-colors"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex p-2 text-gray-600 hover:text-[#c9a96e] transition-colors">
              <Search size={20} />
            </button>

            <Link
              href={isLoggedIn() ? "/conta" : "/login"}
              className="hidden md:flex p-2 text-gray-600 hover:text-[#c9a96e] transition-colors"
            >
              <User size={20} />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-gray-600 hover:text-[#c9a96e] transition-colors"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-[#c9a96e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {count > 9 ? "9+" : count}
                </motion.span>
              )}
            </button>

            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-gray-700 py-1"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="text-sm text-gray-500 py-1">
                Minha conta
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
