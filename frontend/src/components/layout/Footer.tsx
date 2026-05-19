import Link from "next/link";
import { Heart, Play } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Marca */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-2xl font-semibold tracking-widest uppercase mb-3">
            Beauty<span className="text-[#c9a96e]">.</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Cosméticos premium formulados com os melhores ingredientes do mundo para
            a sua rotina de beleza.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#c9a96e] transition-colors">
              <Heart size={16} />
            </a>
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#c9a96e] transition-colors">
              <Play size={16} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[#c9a96e] mb-4">
            Produtos
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {["Skincare", "Maquiagem", "Corpo & Banho", "Kits & Presentes", "Lançamentos"].map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-white transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[#c9a96e] mb-4">
            Ajuda
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {["Minha Conta", "Rastrear Pedido", "Trocas & Devoluções", "Fale Conosco", "FAQ"].map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-white transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[#c9a96e] mb-4">
            Newsletter
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Receba dicas de skincare e ofertas exclusivas.
          </p>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="seu@email.com"
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a96e] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#c9a96e] hover:bg-[#a07840] text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Inscrever-se
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
        <p>© 2025 Beauty Store. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
          <Link href="#" className="hover:text-white transition-colors">Termos</Link>
        </div>
      </div>
    </footer>
  );
}
