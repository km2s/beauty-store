from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products, collections, auth, users, cart, orders, payments, quiz, waitlist, points, affiliates

app = FastAPI(title="Beauty Store API", version="1.0.0")

import os

def _build_origins() -> list[str]:
    origins = ["http://localhost:3000", "http://localhost:3001"]

    # URL do frontend configurada explicitamente (deve ser a URL do Vercel)
    frontend_url = os.getenv("FRONTEND_URL", "")
    if frontend_url and not frontend_url.endswith("railway.com"):
        origins.append(frontend_url)

    # VERCEL_URL injetado pelo Railway/Vercel pode vir sem protocolo
    vercel_url = os.getenv("VERCEL_URL", "")
    if vercel_url:
        if not vercel_url.startswith("http"):
            vercel_url = f"https://{vercel_url}"
        origins.append(vercel_url)

    return [o for o in origins if o]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_build_origins(),
    # Cobre todos os deploys de preview e produção do Vercel
    allow_origin_regex=r"https://[\w\-]+\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(collections.router, prefix="/collections", tags=["collections"])
app.include_router(cart.router, prefix="/cart", tags=["cart"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])
app.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
app.include_router(waitlist.router, prefix="/waitlist", tags=["waitlist"])
app.include_router(points.router, prefix="/points", tags=["points"])
app.include_router(affiliates.router, prefix="/affiliates", tags=["affiliates"])


@app.get("/")
def root():
    return {"status": "ok", "message": "Beauty Store API"}
