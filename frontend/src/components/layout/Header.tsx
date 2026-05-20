"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const count = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/colecao/skincare?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  function toggleSearch() {
    setSearchOpen((v) => !v);
    if (searchOpen) setSearchQuery("");
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      {/* Faixa de anúncio */}
      <div className="bg-[#1a1a1a] text-white text-center text-xs py-2 tracking-wider">
        ✦&nbsp; FRETE GRÁTIS acima de R$299 &nbsp;·&nbsp; Parcelamento em até 6x sem juros &nbsp;✦
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold tracking-widest uppercase shrink-0">
            Beauty<span className="text-[#c9a96e]">.</span>
          </Link>

          {/* Barra de busca expandida */}
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSearch}
                className="absolute left-0 right-0 top-0 bottom-0 bg-white flex items-end pb-2 px-4 sm:px-6 overflow-hidden"
                style={{ top: "2rem" }}
              >
                <div className="flex items-center gap-3 w-full max-w-7xl mx-auto border-b-2 border-[#c9a96e]">
                  <Search size={18} className="text-[#c9a96e] shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar produtos..."
                    className="flex-1 py-2 text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="p-1 text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

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
                      className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-4 min-w-44"
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
            <button
              onClick={toggleSearch}
              className="hidden md:flex p-2 text-gray-600 hover:text-[#c9a96e] transition-colors"
              aria-label="Buscar"
            >
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
            <div className="px-6 py-4 flex flex-col gap-1">
              {/* Busca mobile */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 mb-3">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                />
              </form>

              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-gray-700 py-2.5 border-b border-gray-50 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={isLoggedIn() ? "/conta" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-gray-500 py-2.5"
              >
                Minha conta
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
