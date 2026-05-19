import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from openai import OpenAI
from app.config import settings
from app.database import supabase

router = APIRouter()
client = OpenAI(api_key=settings.openai_api_key)


class QuizAnswers(BaseModel):
    skin_type: str
    concerns: List[str]
    current_routine: str
    age_range: str
    sensitivities: List[str]


@router.post("/recommend")
async def recommend_products(answers: QuizAnswers):
    try:
        products_res = supabase.table("products").select(
            "id, name, slug, skin_types, concerns, variants(price), images(url)"
        ).execute()
        products = products_res.data

        if not products:
            raise HTTPException(status_code=404, detail="Nenhum produto encontrado no catálogo.")

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

Catálogo disponível:
{catalog_summary}

Responda em JSON com o formato:
{{"recommendations": [{{"product_name": "...", "reason": "..."}}]}}"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )

        result = json.loads(response.choices[0].message.content)
        recommended_names = [r["product_name"] for r in result.get("recommendations", [])]
        matched = [
            {**p, "reason": next(
                (r["reason"] for r in result["recommendations"] if r["product_name"] == p["name"]), ""
            )}
            for p in products if p["name"] in recommended_names
        ]

        return {"recommendations": matched}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao processar recomendações. Tente novamente.")
