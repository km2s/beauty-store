from fastapi import APIRouter, Header, HTTPException
from app.models.order import OrderCreate
from app.database import supabase
from app.routers.users import get_user_id
import mercadopago

router = APIRouter()


@router.post("/checkout")
async def create_checkout(data: OrderCreate, authorization: str = Header(...)):
    from app.config import settings
    user_id = get_user_id(authorization)

    total = sum(item.unit_price * item.quantity for item in data.items)
    shipping_total = 15.0

    order_res = supabase.table("orders").insert({
        "user_id": user_id,
        "status": "pending",
        "total": total + shipping_total,
        "shipping_total": shipping_total,
        "shipping_address": data.shipping_address.model_dump(),
        "gift_mode": data.gift_mode,
        "gift_message": data.gift_message,
    }).execute()
    order = order_res.data[0]

    for item in data.items:
        supabase.table("order_items").insert({
            "order_id": order["id"],
            "variant_id": str(item.variant_id),
            "quantity": item.quantity,
            "unit_price": item.unit_price,
        }).execute()

    sdk = mercadopago.SDK(settings.mercadopago_access_token)
    preference = sdk.preference().create({
        "items": [
            {
                "title": f"Pedido #{order['id'][:8]}",
                "quantity": 1,
                "unit_price": float(total + shipping_total),
            }
        ],
        "external_reference": order["id"],
        "back_urls": {
            "success": f"{settings.frontend_url}/pedido/{order['id']}?status=sucesso",
            "failure": f"{settings.frontend_url}/checkout?status=falhou",
        },
        "auto_approve": True,
    })

    supabase.table("cart_items").delete().eq("user_id", user_id).execute()

    try:
        from app.services.email import send_order_confirmation
        profile = supabase.table("profiles").select("email").eq("id", user_id).single().execute()
        email_items = [
            {"product_name": i.product_name, "quantity": i.quantity, "price": i.unit_price}
            for i in data.items
        ]
        send_order_confirmation(profile.data["email"], order["id"], total + shipping_total, email_items)
    except Exception as e:
        print(f"[payments] e-mail falhou: {e}")

    return {
        "order_id": order["id"],
        "payment_url": preference["response"]["init_point"],
    }
