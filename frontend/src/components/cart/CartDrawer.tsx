"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQty, total, count } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#c9a96e]" />
                <span className="font-semibold text-lg">Sacola ({count()})</span>
              </div>
              <button onClick={closeCart} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="text-sm">Sua sacola está vazia</p>
                  <button
                    onClick={closeCart}
                    className="text-sm text-[#c9a96e] hover:underline"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 py-3 border-b border-gray-50"
                    >
                      {/* Imagem */}
                      <div className="w-20 h-20 bg-[#f5efe6] rounded-xl flex-shrink-0 overflow-hidden relative">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag size={24} strokeWidth={1} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{item.product_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.variant_name}</p>
                        <p className="text-[#c9a96e] font-semibold text-sm mt-1">
                          R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                        </p>

                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="px-2.5 py-1 hover:bg-gray-50 transition-colors text-gray-500"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="px-2.5 py-1 hover:bg-gray-50 transition-colors text-gray-500"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Subtotal</span>
                  <span className="font-semibold">
                    R$ {total().toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Frete calculado no checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-[#1a1a1a] hover:bg-[#c9a96e] text-white text-center py-4 rounded-xl font-medium transition-colors duration-300"
                >
                  Finalizar Compra
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
                >
                  Continuar comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
