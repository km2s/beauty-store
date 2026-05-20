"use client";
import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { api } from "@/lib/api";

interface Customer {
  id: string;
  email: string;
  full_name?: string;
  points_balance: number;
  created_at: string;
}

export default function AdminClientes() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/admin/users").then((r) => setCustomers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.full_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Clientes</h1>
        <p className="text-sm text-gray-500">{customers.length} clientes cadastrados</p>
      </div>

      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c9a96e] transition-colors" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1,2,3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : !filtered.length ? (
          <div className="text-center py-16 text-gray-400">
            <Users size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            <div className="grid grid-cols-4 px-5 py-2.5 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span className="col-span-2">Cliente</span>
              <span className="text-right">Ritual Points</span>
              <span className="text-right">Cadastro</span>
            </div>
            {filtered.map((c) => (
              <div key={c.id} className="grid grid-cols-4 items-center px-5 py-3.5">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#a07840] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {(c.full_name || c.email || "?")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1a1a1a] truncate">{c.full_name || "—"}</p>
                    <p className="text-xs text-gray-400 truncate">{c.email}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#c9a96e] text-right">
                  {(c.points_balance || 0).toLocaleString("pt-BR")} pts
                </p>
                <p className="text-xs text-gray-400 text-right">
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
