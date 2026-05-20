"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/produtos",  label: "Produtos",    icon: Package },
  { href: "/admin/pedidos",   label: "Pedidos",     icon: ShoppingBag },
  { href: "/admin/clientes",  label: "Clientes",    icon: Users },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, clearAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/admin/login"); return; }
    api.get("/admin/stats").catch(() => {
      router.replace("/admin/login");
    }).finally(() => setChecking(false));
  }, [isLoggedIn, router]);

  if (checking) return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#c9a96e]/30 border-t-[#c9a96e] rounded-full animate-spin" />
    </div>
  );

  function logout() {
    clearAuth();
    router.push("/admin/login");
  }

  const Sidebar = () => (
    <aside className="w-60 flex-shrink-0 bg-[#1a1a1a] min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-semibold tracking-widest text-white uppercase">
          Beauty<span className="text-[#c9a96e]">.</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">Painel Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#c9a96e] text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon size={17} />
              {item.label}
              {active && <ChevronRight size={13} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all w-full"
        >
          <LogOut size={17} />
          Sair
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <span className="font-semibold text-sm tracking-wider">
            Beauty<span className="text-[#c9a96e]">.</span> Admin
          </span>
          <div />
        </div>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
