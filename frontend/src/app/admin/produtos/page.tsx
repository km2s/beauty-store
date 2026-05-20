"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, Check, Package } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { api } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_limited: boolean;
  is_active: boolean;
  collection_id?: string;
  skin_types?: string[];
  concerns?: string[];
  collections?: { name: string; slug: string };
  variants?: { id: string; price: number; compare_at_price?: number; stock: number }[];
  images?: { url: string }[];
}

interface Collection { id: string; name: string; slug: string; }

const EMPTY_FORM = {
  name: "", slug: "", description: "", collection_id: "",
  price: "", compare_at_price: "", stock: "50",
  skin_types: [] as string[], concerns: [] as string[],
  is_limited: false, image_url: "",
};

const SKIN_OPTS = ["oleosa","seca","mista","normal","sensivel"];
const CONCERN_OPTS = ["manchas","acne","rugas","poros","olheiras","hidratacao","firmeza"];

export default function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.get("/admin/products"), api.get("/collections/")])
      .then(([p, c]) => { setProducts(p.data); setCollections(c.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name, slug: p.slug, description: p.description || "",
      collection_id: p.collection_id || "",
      price: String(p.variants?.[0]?.price || ""),
      compare_at_price: String(p.variants?.[0]?.compare_at_price || ""),
      stock: String(p.variants?.[0]?.stock || 50),
      skin_types: p.skin_types || [],
      concerns: p.concerns || [],
      is_limited: p.is_limited,
      image_url: p.images?.[0]?.url || "",
    });
    setEditId(p.id);
    setShowForm(true);
  }

  function toggleArr(arr: string[], val: string, key: "skin_types" | "concerns") {
    setForm((f) => ({
      ...f,
      [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
    }));
  }

  async function save() {
    setSaving(true);
    try {
      if (editId) {
        const res = await api.patch(`/admin/products/${editId}`, {
          name: form.name, description: form.description,
          collection_id: form.collection_id || null,
          skin_types: form.skin_types.length ? form.skin_types : null,
          concerns: form.concerns.length ? form.concerns : null,
          is_limited: form.is_limited,
        });
        setProducts((pp) => pp.map((p) => p.id === editId ? { ...p, ...res.data } : p));
      } else {
        const res = await api.post("/admin/products", {
          name: form.name, slug: form.slug, description: form.description,
          collection_id: form.collection_id || null,
          price: parseFloat(form.price),
          compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
          stock: parseInt(form.stock),
          skin_types: form.skin_types.length ? form.skin_types : null,
          concerns: form.concerns.length ? form.concerns : null,
          is_limited: form.is_limited,
          image_url: form.image_url || null,
        });
        const full = await api.get(`/admin/products`);
        setProducts(full.data);
      }
      setShowForm(false);
    } catch {
      // keep form open
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    setDeletingId(id);
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((pp) => pp.map((p) => p.id === id ? { ...p, is_active: false } : p));
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Produtos</h1>
          <p className="text-sm text-gray-500">{products.length} produtos cadastrados</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#c9a96e] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Novo produto
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1,2,3,4,5].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <div key={p.id} className={`flex items-center gap-4 px-5 py-3.5 ${!p.is_active ? "opacity-40" : ""}`}>
                {/* Image */}
                <div className="w-10 h-10 rounded-xl bg-[#f5efe6] flex-shrink-0 overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🧴</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a1a1a] truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.collections?.name || "Sem coleção"} · {p.slug}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {p.is_limited && (
                    <span className="text-[10px] bg-[#1a1a1a] text-white px-2 py-0.5 rounded-full">Limitado</span>
                  )}
                  {!p.is_active && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inativo</span>
                  )}
                  {p.variants?.[0] && (
                    <span className="text-sm font-semibold text-[#1a1a1a]">
                      R$ {Number(p.variants[0].price).toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-[#1a1a1a]"
                  >
                    <Edit2 size={15} />
                  </button>
                  {p.is_active && (
                    <button
                      onClick={() => deleteProduct(p.id)}
                      disabled={deletingId === p.id}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Package size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl z-50 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold">{editId ? "Editar produto" : "Novo produto"}</h2>
                <button onClick={() => setShowForm(false)}><X size={20} /></button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="admin-label">Nome</label>
                    <input className="admin-input" value={form.name}
                      onChange={(e) => {
                        const v = e.target.value;
                        setForm((f) => ({
                          ...f, name: v,
                          slug: editId ? f.slug : v.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""),
                        }));
                      }} placeholder="Nome do produto" />
                  </div>
                  {!editId && (
                    <div className="col-span-2">
                      <label className="admin-label">Slug (URL)</label>
                      <input className="admin-input" value={form.slug}
                        onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                        placeholder="slug-do-produto" />
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="admin-label">Descrição</label>
                    <textarea className="admin-input h-20 resize-none" value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div>
                    <label className="admin-label">Coleção</label>
                    <select className="admin-input" value={form.collection_id}
                      onChange={(e) => setForm((f) => ({ ...f, collection_id: e.target.value }))}>
                      <option value="">Sem coleção</option>
                      {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  {!editId && (
                    <>
                      <div>
                        <label className="admin-label">Preço (R$)</label>
                        <input className="admin-input" type="number" step="0.01" value={form.price}
                          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                      </div>
                      <div>
                        <label className="admin-label">Preço original (opcional)</label>
                        <input className="admin-input" type="number" step="0.01" value={form.compare_at_price}
                          onChange={(e) => setForm((f) => ({ ...f, compare_at_price: e.target.value }))} />
                      </div>
                      <div>
                        <label className="admin-label">Estoque</label>
                        <input className="admin-input" type="number" value={form.stock}
                          onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
                      </div>
                      <div className="col-span-2">
                        <label className="admin-label">URL da imagem</label>
                        <input className="admin-input" value={form.image_url}
                          onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                          placeholder="https://..." />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="admin-label">Tipo de pele</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {SKIN_OPTS.map((s) => (
                      <button key={s} type="button"
                        onClick={() => toggleArr(form.skin_types, s, "skin_types")}
                        className={`px-3 py-1 rounded-full text-xs border transition-all ${
                          form.skin_types.includes(s)
                            ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="admin-label">Preocupações</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {CONCERN_OPTS.map((c) => (
                      <button key={c} type="button"
                        onClick={() => toggleArr(form.concerns, c, "concerns")}
                        className={`px-3 py-1 rounded-full text-xs border transition-all ${
                          form.concerns.includes(c)
                            ? "bg-[#c9a96e] text-white border-[#c9a96e]"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setForm((f) => ({ ...f, is_limited: !f.is_limited }))}
                    className={`w-10 h-5 rounded-full transition-colors relative ${form.is_limited ? "bg-[#c9a96e]" : "bg-gray-200"}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${form.is_limited ? "left-5.5" : "left-0.5"}`} />
                  </div>
                  <span className="text-sm text-gray-700">Produto limitado</span>
                </label>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:border-gray-300 transition-colors">
                  Cancelar
                </button>
                <button onClick={save} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#c9a96e] text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Check size={15} /> Salvar</>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .admin-label { display: block; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .admin-input { width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 12px; font-size: 14px; transition: border-color 0.15s; outline: none; }
        .admin-input:focus { border-color: #c9a96e; }
      `}</style>
    </AdminShell>
  );
}
