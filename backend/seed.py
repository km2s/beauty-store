"""
Script de seed — popula o banco com coleções, produtos, variantes e ingredientes.
Rodar: cd backend && venv/Scripts/python seed.py
"""
import os, sys
from dotenv import load_dotenv
load_dotenv()

from supabase import create_client

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

# ── Helpers ────────────────────────────────────────────────────────────────────
def img(seed: str, n: int = 1):
    return [f"https://picsum.photos/seed/{seed}-{i}/800/800" for i in range(1, n + 1)]

def upsert_collection(name, slug, description, cover, position):
    existing = supabase.table("collections").select("id").eq("slug", slug).execute()
    if existing.data:
        return existing.data[0]["id"]
    res = supabase.table("collections").insert({
        "name": name, "slug": slug, "description": description,
        "cover_image_url": cover, "position": position,
    }).execute()
    return res.data[0]["id"]

def upsert_product(name, slug, description, collection_id, skin_types, concerns, duration, is_limited=False):
    existing = supabase.table("products").select("id").eq("slug", slug).execute()
    if existing.data:
        return existing.data[0]["id"]
    res = supabase.table("products").insert({
        "name": name, "slug": slug, "description": description,
        "collection_id": collection_id, "skin_types": skin_types,
        "concerns": concerns, "estimated_duration_days": duration,
        "is_limited": is_limited, "is_active": True,
    }).execute()
    return res.data[0]["id"]

def add_variant(product_id, name, sku, price, compare_at=None, stock=50):
    existing = supabase.table("variants").select("id").eq("sku", sku).execute()
    if existing.data:
        return
    supabase.table("variants").insert({
        "product_id": product_id, "name": name, "sku": sku,
        "price": price, "compare_at_price": compare_at, "stock": stock,
    }).execute()

def add_images(product_id, urls):
    for i, url in enumerate(urls):
        supabase.table("images").insert({
            "product_id": product_id, "url": url, "alt": "", "position": i,
        }).execute()

def add_ingredient(product_id, name, description, benefit):
    supabase.table("ingredients").insert({
        "product_id": product_id, "name": name,
        "description": description, "benefit": benefit,
    }).execute()

# ── Coleções ───────────────────────────────────────────────────────────────────
print("Criando coleções...")
col_sk = upsert_collection("Skincare", "skincare",
    "Cuide da sua pele com a melhor ciência cosmética.",
    img("skincare-cover")[0], 1)
col_mq = upsert_collection("Maquiagem", "maquiagem",
    "Realce sua beleza natural com produtos de alta pigmentação.",
    img("makeup-cover")[0], 2)
col_cb = upsert_collection("Corpo & Banho", "corpo-e-banho",
    "Rituais de beleza do rosto aos pés.",
    img("body-cover")[0], 3)
col_kp = upsert_collection("Kits & Presentes", "kits-e-presentes",
    "Presentes perfeitos para quem ama skincare.",
    img("kits-cover")[0], 4)
col_lc = upsert_collection("Lançamentos", "lancamentos",
    "Os primeiros lançamentos exclusivos da Beauty Store.",
    img("launches-cover")[0], 5)

# ── SKINCARE ───────────────────────────────────────────────────────────────────
print("Criando produtos skincare...")

# 1
pid = upsert_product(
    "Sérum Vitamina C Iluminador", "serum-vitamina-c",
    "Fórmula de alta concentração com 15% de Vitamina C pura, niacinamida e ácido ferúlico. Combate manchas, uniformiza o tom e confere luminosidade à pele em 4 semanas de uso contínuo.",
    col_sk, ["oleosa","mista","normal"], ["manchas","acne","hidratacao"], 60)
add_variant(pid, "30ml", "SKC-VC30", 189.90, 239.90, 45)
add_images(pid, img("serum-vitc", 3))
add_ingredient(pid, "Vitamina C 15%", "Antioxidante poderoso que inibe a melanogênese.", "Clareamento")
add_ingredient(pid, "Niacinamida 5%", "Regula a produção de sebo e fecha poros.", "Poros")
add_ingredient(pid, "Ácido Ferúlico", "Potencializa a ação antioxidante da Vitamina C.", "Proteção")

# 2
pid = upsert_product(
    "Hidratante Facial FPS 50+", "hidratante-fps50",
    "Textura gel-creme ultraleviana que hidrata profundamente e protege contra raios UVA/UVB. Com ácido hialurônico e extrato de aloe vera, deixa a pele macia e luminosa o dia todo.",
    col_sk, ["oleosa","mista","seca","normal","sensivel"], ["hidratacao"], 60)
add_variant(pid, "50ml", "SKC-HF50", 159.90, None, 60)
add_images(pid, img("hidratante-fps", 3))
add_ingredient(pid, "Ácido Hialurônico", "Atrai e retém até 1000x seu peso em água.", "Hidratação")
add_ingredient(pid, "Filtro UV FPS 50+", "Proteção UVA/UVB de amplo espectro.", "Proteção solar")
add_ingredient(pid, "Extrato de Aloe Vera", "Acalma e hidrata peles sensíveis.", "Calmante")

# 3
pid = upsert_product(
    "Tônico Reequilibrante Poros", "tonico-reequilibrante",
    "Tônico com ácido glicólico 5%, extrato de hamamelis e zinco para controlar o brilho, desobstruir poros e equilibrar o microbioma da pele.",
    col_sk, ["oleosa","mista"], ["poros","acne"], 45)
add_variant(pid, "150ml", "SKC-TR150", 99.90, None, 55)
add_images(pid, img("tonico-poros", 3))
add_ingredient(pid, "Ácido Glicólico 5%", "Esfoliação química que desobstrui poros.", "Renovação")
add_ingredient(pid, "Hamamelis", "Adstringente natural que minimiza poros.", "Controle de brilho")
add_ingredient(pid, "Zinco PCA", "Regula a oleosidade e tem ação antisséptica.", "Antiacne")

# 4
pid = upsert_product(
    "Esfoliante Enzimático Suave", "esfoliante-enzimatico",
    "Esfoliante de baixo pH com enzima de papaia e AHA que remove células mortas suavemente, sem irritar. Indicado para peles sensíveis que querem renovação sem agressão.",
    col_sk, ["seca","normal","sensivel"], ["hidratacao","poros"], 30)
add_variant(pid, "75g", "SKC-EE75", 129.90, None, 40)
add_images(pid, img("esfoliante-enz", 3))
add_ingredient(pid, "Enzima de Papaia", "Dissolve células mortas sem fricção mecânica.", "Renovação")
add_ingredient(pid, "AHA 8%", "Glicólico + Láctico para pele mais lisa.", "Textura")
add_ingredient(pid, "Extrato de Camomila", "Acalma após a esfoliação.", "Calmante")

# 5
pid = upsert_product(
    "Óleo Facial Rosa Mosqueta", "oleo-rosa-mosqueta",
    "Óleo puro de Rosa Mosqueta prensado a frio, rico em ácidos graxos essenciais ômega 3, 6 e 9. Regenera, firma e trata cicatrizes, rugas e manchas com uso regular.",
    col_sk, ["seca","sensivel","normal"], ["rugas","firmeza","manchas"], 90)
add_variant(pid, "30ml", "SKC-RM30", 219.90, 259.90, 30)
add_images(pid, img("oleo-rosa", 3))
add_ingredient(pid, "Rosa Mosqueta 100%", "Rico em Vitamina A e ômega 3, 6 e 9.", "Regeneração")
add_ingredient(pid, "Vitamina E", "Antioxidante que protege lipídios da oxidação.", "Anti-aging")

# 6
pid = upsert_product(
    "Máscara Hidratante Noturna", "mascara-noturna",
    "Sleeping mask com retinol 0,1%, ceramidas e peptídeos que agem enquanto você dorme. Acorda com a pele visivelmente mais firme, hidratada e luminosa.",
    col_sk, ["seca","normal","mista"], ["hidratacao","rugas","firmeza"], 45)
add_variant(pid, "50ml", "SKC-MN50", 149.90, 189.90, 35)
add_images(pid, img("mascara-noturna", 3))
add_ingredient(pid, "Retinol 0,1%", "Estimula colágeno e acelera renovação celular.", "Anti-aging")
add_ingredient(pid, "Ceramidas", "Restauram a barreira cutânea comprometida.", "Barreira")
add_ingredient(pid, "Peptídeos Triplos", "Sinalizam a pele para produzir colágeno.", "Firmeza")

# 7
pid = upsert_product(
    "Gel de Limpeza Purificante", "gel-limpeza-purificante",
    "Limpeza profunda com carvão ativado e ácido salicílico 1% que remove impurezas, excesso de sebo e maquiagem sem ressecar. Deixa a pele limpa e fresca sem sensação de apertamento.",
    col_sk, ["oleosa","mista"], ["acne","poros"], 30)
add_variant(pid, "150ml", "SKC-GL150", 89.90, None, 70)
add_images(pid, img("gel-limpeza", 3))
add_ingredient(pid, "Carvão Ativado", "Adsorve impurezas e toxinas dos poros.", "Limpeza profunda")
add_ingredient(pid, "Ácido Salicílico 1%", "Penetra nos poros e dissolve comedões.", "Antiacne")
add_ingredient(pid, "Extrato de Chá Verde", "Antioxidante e anti-inflamatório.", "Proteção")

# ── MAQUIAGEM ─────────────────────────────────────────────────────────────────
print("Criando produtos maquiagem...")

# 8
pid = upsert_product(
    "Base Fluida Cobertura Total", "base-fluida-cobertura-total",
    "Base de longa duração com FPS 30, cobertura buildable de media a total. Fórmula com ácido hialurônico que hidrata enquanto cobre. Disponível em 6 tons.",
    col_mq, None, None, None)
add_variant(pid, "Tom 01 - Bege Claro | 30ml", "MQ-BF01", 179.90, 199.90, 25)
add_variant(pid, "Tom 02 - Bege Médio | 30ml", "MQ-BF02", 179.90, 199.90, 25)
add_variant(pid, "Tom 03 - Bege Escuro | 30ml", "MQ-BF03", 179.90, 199.90, 20)
add_images(pid, img("base-fluida", 3))

# 9
pid = upsert_product(
    "Batom Cremoso Matte", "batom-cremoso-matte",
    "Batom de longa duração com fórmula cremosa que hidrata os lábios. Pigmentação intensa, acabamento matte veludo que não resseca.",
    col_mq, None, None, None)
add_variant(pid, "Rosa Nude", "MQ-BTM01", 69.90, None, 40)
add_variant(pid, "Vermelho Clássico", "MQ-BTM02", 69.90, None, 40)
add_variant(pid, "Berry Intenso", "MQ-BTM03", 69.90, None, 35)
add_images(pid, img("batom-matte", 3))

# 10
pid = upsert_product(
    "Máscara para Cílios Volume Extreme", "mascara-cilios-volume",
    "Fórmula enriquecida com fibras de seda que multiplica o volume dos cílios em até 5x. Resistente à água, dura 16h sem borrar.",
    col_mq, None, None, None)
add_variant(pid, "Preto Intenso", "MQ-MC01", 79.90, 99.90, 50)
add_images(pid, img("mascara-cilios", 3))

# 11
pid = upsert_product(
    "Iluminador em Pó Radiância", "iluminador-po-radiancia",
    "Iluminador em pó prensado com partículas douradas ultra-finas. Cria um glow natural e duradouro nas maçãs do rosto, nariz e clavículas.",
    col_mq, None, None, None)
add_variant(pid, "Dourado Champagne", "MQ-IL01", 99.90, None, 30)
add_variant(pid, "Rose Gold", "MQ-IL02", 99.90, None, 30)
add_images(pid, img("iluminador-po", 3))

# 12
pid = upsert_product(
    "Paleta de Sombras 12 Tons Nude", "paleta-sombras-nude",
    "12 tons cuidadosamente selecionados entre mattes e shimmer na paleta nude mais versátil. Do dia à noite em segundos.",
    col_mq, None, None, None)
add_variant(pid, "Paleta Completa", "MQ-PS01", 159.90, 199.90, 20)
add_images(pid, img("paleta-sombras", 3))

# ── CORPO & BANHO ─────────────────────────────────────────────────────────────
print("Criando produtos corpo & banho...")

# 13
pid = upsert_product(
    "Óleo Corporal Iluminador Dourado", "oleo-corporal-iluminador",
    "Blend de óleos preciosos — argan, jojoba e coco — com partículas douradas finas que iluminam e hidratam profundamente sem deixar resíduo pegajoso.",
    col_cb, None, None, 30)
add_variant(pid, "100ml", "CB-OCI100", 139.90, None, 45)
add_images(pid, img("oleo-corporal", 3))

# 14
pid = upsert_product(
    "Esfoliante Corporal Açúcar & Mel", "esfoliante-corporal-acucar-mel",
    "Esfoliante físico com cristais de açúcar de cana e mel puro que remove células mortas e hidrata simultaneamente. Perfume irresistível de baunilha.",
    col_cb, None, None, 30)
add_variant(pid, "300g", "CB-ECA300", 89.90, None, 55)
add_images(pid, img("esfoliante-corporal", 3))

# 15
pid = upsert_product(
    "Loção Corporal Manteiga de Karité", "locao-corporal-karite",
    "Loção ultraconcentrada com 30% de manteiga de karité, ceramidas e vitamina E. Hidratação de 72h comprovada, absorção rápida e sem oleosidade.",
    col_cb, None, None, 60)
add_variant(pid, "250ml", "CB-LCK250", 119.90, 139.90, 60)
add_variant(pid, "500ml (Economy)", "CB-LCK500", 199.90, 239.90, 40)
add_images(pid, img("locao-karite", 3))

# 16
pid = upsert_product(
    "Sabonete Líquido Aromaterapia Lavanda", "sabonete-lavanda-aromaterapia",
    "Sabonete líquido dermatologicamente testado com extrato de lavanda e camomila. Limpa suavemente sem alterar o pH da pele, com aroma relaxante e duradouro.",
    col_cb, None, None, 30)
add_variant(pid, "250ml", "CB-SLA250", 59.90, None, 80)
add_variant(pid, "500ml Refil", "CB-SLA500R", 89.90, None, 60)
add_images(pid, img("sabonete-lavanda", 3))

# ── KITS & PRESENTES ─────────────────────────────────────────────────────────
print("Criando kits e presentes...")

# 17
pid = upsert_product(
    "Kit Skincare Ritual Completo", "kit-skincare-ritual",
    "O trio perfeito para montar sua rotina: Gel de Limpeza Purificante + Tônico Reequilibrante + Hidratante FPS 50. Embalagem presente exclusiva com laço dourado.",
    col_kp, ["oleosa","mista","normal"], ["hidratacao","poros","acne"], None)
add_variant(pid, "Kit 3 peças", "KP-SKR01", 299.90, 349.70, 25)
add_images(pid, img("kit-skincare", 3))

# 18
pid = upsert_product(
    "Kit Presente Beauty Essentials", "kit-presente-beauty-essentials",
    "Caixa presente com Batom Matte Rosa Nude + Iluminador Dourado + Máscara para Cílios. A combinação perfeita para presentear. Embalagem luxo com papel de seda.",
    col_kp, None, None, None)
add_variant(pid, "Kit 3 peças Maquiagem", "KP-BE01", 219.90, 249.70, 20)
add_images(pid, img("kit-presente", 3))

# 19
pid = upsert_product(
    "Caixinha Surpresa Beauty 5 itens", "caixinha-surpresa-beauty",
    "Receba 5 produtos curados pela nossa equipe de especialistas — sempre com valor acima de R$400. Ideal para quem quer experimentar produtos novos ou presentear.",
    col_kp, None, None, None, is_limited=True)
add_variant(pid, "Caixa Surpresa", "KP-CS01", 299.90, 400.00, 15)
add_images(pid, img("kit-surpresa", 3))

# ── LANÇAMENTOS ───────────────────────────────────────────────────────────────
print("Criando lançamentos...")

# 20
pid = upsert_product(
    "Sérum Retinol 0.5% Noturno", "serum-retinol-05",
    "Nossa fórmula mais avançada: retinol encapsulado 0,5% com bakuchiol vegano e peptídeos de cobre. Máxima eficácia com mínima irritação. Clínico comprovado em 8 semanas.",
    col_lc, ["seca","normal","mista"], ["rugas","firmeza","manchas"], 60, is_limited=True)
add_variant(pid, "30ml — Edição Limitada", "LC-RT30", 249.90, 299.90, 20)
add_images(pid, img("serum-retinol", 3))
add_ingredient(pid, "Retinol Encapsulado 0,5%", "Liberação gradual que minimiza irritação.", "Anti-aging")
add_ingredient(pid, "Bakuchiol", "Alternativa vegana ao retinol com efeitos similares.", "Renovação")
add_ingredient(pid, "Peptídeos de Cobre", "Estimulam a síntese de colágeno tipo I e III.", "Firmeza")

# 21
pid = upsert_product(
    "Protetor Solar Mineral Tinted FPS 60", "protetor-solar-mineral-tinted",
    "Protetor solar 100% mineral com filtros de óxido de zinco e dióxido de titânio. Leve tint que uniformiza o tom naturalmente. Indicado para peles sensíveis e com rosácea.",
    col_lc, ["sensivel","seca","normal"], ["manchas","hidratacao"], 60)
add_variant(pid, "Tom Universal 40g", "LC-PSM40", 219.90, None, 30)
add_images(pid, img("protetor-mineral", 3))
add_ingredient(pid, "Óxido de Zinco 20%", "Filtro mineral que bloqueia UV sem reagir quimicamente.", "Proteção UV")
add_ingredient(pid, "Niacinamida 3%", "Reduz vermelhidão e uniformiza o tom.", "Tônico")

# 22
pid = upsert_product(
    "Kit Lip Care Completo", "kit-lip-care",
    "Ritual completo para lábios perfeitos: Esfoliante Labial de Açúcar + Máscara Noturna para Lábios + Hidratante Labial SPF 30. Fórmulas veganas em embalagem presente.",
    col_lc, None, None, 30, is_limited=True)
add_variant(pid, "Kit 3 peças Lábios", "LC-LC01", 159.90, 199.70, 18)
add_images(pid, img("kit-lips", 3))

print("\nSeed completo! Colecoes e produtos inseridos com sucesso.")
