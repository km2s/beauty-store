import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.config import settings
from app.database import supabase

router = APIRouter()

SKIN_TYPE_REASONS: dict[str, str] = {
    "oleosa":   "Formulado para controlar o brilho e equilibrar a oleosidade da pele.",
    "seca":     "Rico em ingredientes hidratantes que nutrem a pele seca em profundidade.",
    "mista":    "Equilibrado para atender as necessidades da zona T oleosa e bochechas secas.",
    "normal":   "Mantém o equilíbrio natural da sua pele saudável.",
    "sensivel": "Fórmula suave e dermatologicamente testada para peles reativas.",
}
CONCERN_REASONS: dict[str, str] = {
    "manchas":    "Contém ativos clareadores que reduzem manchas e uniformizam o tom.",
    "acne":       "Com propriedades antissépticas e seborreguladoras para combater a acne.",
    "rugas":      "Estimula a produção de colágeno e suaviza linhas de expressão.",
    "poros":      "Ação adstringente que minimiza visivelmente os poros dilatados.",
    "olheiras":   "Ativos que melhoram a microcirculação e reduzem olheiras.",
    "hidratacao": "Hidratação profunda e duradoura para manter a pele macia.",
    "firmeza":    "Peptídeos e ativos que restauram a firmeza e a elasticidade da pele.",
}


def rule_based_recommend(products: list, answers: "QuizAnswers", limit: int = 5) -> list:
    scored = []
    for p in products:
        score = 0
        skin_types = p.get("skin_types") or []
        concerns = p.get("concerns") or []

        if answers.skin_type in skin_types:
            score += 3
        if not skin_types:
            score += 1

        matched_concerns = [c for c in answers.concerns if c in concerns]
        score += len(matched_concerns) * 2

        if matched_concerns:
            reason = CONCERN_REASONS.get(matched_concerns[0], "Indicado para o seu perfil de pele.")
        elif answers.skin_type in skin_types:
            reason = SKIN_TYPE_REASONS.get(answers.skin_type, "Adequado para o seu tipo de pele.")
        else:
            reason = "Selecionado pela nossa equipe como essencial para qualquer rotina."

        scored.append((score, p, reason))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [{**p, "reason": reason} for _, p, reason in scored[:limit] if _[0] >= 0 or True][:limit]


def _openai_recommend(products: list, answers: "QuizAnswers") -> list | None:
    key = settings.openai_api_key
    if not key or key.startswith("sk-substituir") or len(key) < 20:
        return None
    try:
        from openai import OpenAI
        client = OpenAI(api_key=key)
        catalog_summary = "\n".join([
            f"- {p['name']} | Tipos de pele: {p.get('skin_types', [])} | Preocupações: {p.get('concerns', [])}"
            for p in products[:50]
        ])
        prompt = f"""Você é uma especialista em skincare. Com base no perfil do cliente, recomende até 5 produtos do catálogo.

Perfil:
- Tipo de pele: {answers.skin_type}
- Preocupações: {', '.join(answers.concerns)}
- Rotina atual: {answers.current_routine}
- Faixa etária: {answers.age_range}
- Sensibilidades: {', '.join(answers.sensitivities) if answers.sensitivities else 'Nenhuma'}

Catálogo:
{catalog_summary}

Responda APENAS JSON: {{"recommendations": [{{"product_name": "...", "reason": "..."}}]}}"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            timeout=15,
        )
        result = json.loads(response.choices[0].message.content)
        recommended = result.get("recommendations", [])
        name_map = {r["product_name"]: r["reason"] for r in recommended}
        matched = [
            {**p, "reason": name_map.get(p["name"], "")}
            for p in products if p["name"] in name_map
        ]
        return matched if matched else None
    except Exception as e:
        print(f"[quiz] OpenAI falhou, usando fallback: {e}")
        return None


class QuizAnswers(BaseModel):
    skin_type: str
    concerns: List[str]
    current_routine: str
    age_range: str
    sensitivities: List[str]


@router.post("/recommend")
async def recommend_products(answers: QuizAnswers):
    products_res = supabase.table("products").select(
        "id, name, slug, skin_types, concerns, variants(*), images(*)"
    ).eq("is_active", True).execute()
    products = products_res.data or []

    if not products:
        raise HTTPException(status_code=404, detail="Nenhum produto encontrado no catálogo.")

    ai_result = _openai_recommend(products, answers)
    recommendations = ai_result if ai_result else rule_based_recommend(products, answers)

    return {"recommendations": recommendations}
