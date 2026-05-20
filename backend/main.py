import os
import re as _re
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import products, collections, auth, users, cart, orders, payments, quiz, waitlist, points, affiliates, admin

app = FastAPI(title="Beauty Store API", version="1.0.0")

_CORS_ORIGIN_RE = _re.compile(r"https://[\w][\w\-]*\.vercel\.app$")
_ALLOWED_ORIGINS_STATIC = {
    "http://localhost:3000",
    "http://localhost:3001",
    os.getenv("FRONTEND_URL", ""),
}

def _cors_origin(request: Request) -> str:
    origin = request.headers.get("origin", "")
    if origin in _ALLOWED_ORIGINS_STATIC or _CORS_ORIGIN_RE.match(origin):
        return origin
    return ""

def _build_origins() -> list[str]:
    origins = list(_ALLOWED_ORIGINS_STATIC)
    vercel_url = os.getenv("VERCEL_URL", "")
    if vercel_url:
        origins.append(vercel_url if vercel_url.startswith("http") else f"https://{vercel_url}")
    return [o for o in origins if o]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_build_origins(),
    allow_origin_regex=r"https://[\w][\w\-]*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Garante headers CORS mesmo em respostas de erro 500
@app.exception_handler(Exception)
async def _global_error_handler(request: Request, exc: Exception):
    origin = _cors_origin(request)
    headers = {"Access-Control-Allow-Origin": origin, "Access-Control-Allow-Credentials": "true"} if origin else {}
    return JSONResponse(status_code=500, content={"detail": str(exc)}, headers=headers)

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
app.include_router(admin.router, prefix="/admin", tags=["admin"])


@app.get("/")
def root():
    return {"status": "ok", "message": "Beauty Store API"}
