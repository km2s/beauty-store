import resend
from app.config import settings

resend.api_key = settings.resend_api_key

FROM_EMAIL = "Beauty Store <noreply@beautystore.com.br>"


def _send(to: str, subject: str, html: str):
    try:
        resend.Emails.send({"from": FROM_EMAIL, "to": [to], "subject": subject, "html": html})
    except Exception as e:
        print(f"[email] Falha ao enviar para {to}: {e}")


def send_order_confirmation(to: str, order_id: str, total: float, items: list[dict]):
    items_html = "".join(
        f"<tr>"
        f"<td style='padding:8px 0;border-bottom:1px solid #f0f0f0'>{i.get('product_name','Produto')}</td>"
        f"<td style='padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right'>x{i.get('quantity',1)}</td>"
        f"<td style='padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right'>R$ {i.get('price',0):.2f}</td>"
        f"</tr>"
        for i in items
    )
    html = f"""
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a">
      <h1 style="font-size:24px;font-weight:600;margin-bottom:4px">Beauty<span style="color:#c9a96e">.</span></h1>
      <p style="color:#999;font-size:12px;margin-bottom:32px">Cosméticos premium</p>

      <h2 style="font-size:20px;font-weight:600;margin-bottom:8px">Pedido confirmado! 🎉</h2>
      <p style="color:#666">Olá! Recebemos seu pedido <strong>#{order_id[-6:].upper()}</strong> e já estamos separando tudo com carinho.</p>

      <table style="width:100%;border-collapse:collapse;margin:24px 0">
        <thead>
          <tr style="border-bottom:2px solid #f0f0f0">
            <th style="text-align:left;padding-bottom:8px;font-size:12px;color:#999;font-weight:600">PRODUTO</th>
            <th style="text-align:right;padding-bottom:8px;font-size:12px;color:#999;font-weight:600">QTD</th>
            <th style="text-align:right;padding-bottom:8px;font-size:12px;color:#999;font-weight:600">PREÇO</th>
          </tr>
        </thead>
        <tbody>{items_html}</tbody>
      </table>

      <div style="background:#f5efe6;border-radius:12px;padding:16px;margin-bottom:24px">
        <div style="display:flex;justify-content:space-between">
          <span style="font-weight:600">Total</span>
          <span style="font-weight:700;color:#c9a96e">R$ {total:.2f}</span>
        </div>
      </div>

      <p style="color:#666;font-size:14px">Você receberá uma notificação quando seu pedido for enviado. Qualquer dúvida, é só responder este e-mail.</p>

      <p style="margin-top:32px;color:#999;font-size:12px">© 2025 Beauty Store. Todos os direitos reservados.</p>
    </div>
    """
    _send(to, f"Pedido #{order_id[-6:].upper()} confirmado ✨", html)


def send_order_shipped(to: str, order_id: str, tracking_code: str | None = None):
    tracking_block = (
        f"<p>Código de rastreamento: <strong>{tracking_code}</strong></p>"
        if tracking_code else ""
    )
    html = f"""
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a">
      <h1 style="font-size:24px;font-weight:600;margin-bottom:4px">Beauty<span style="color:#c9a96e">.</span></h1>
      <h2 style="font-size:20px;font-weight:600;margin:24px 0 8px">Seu pedido saiu! 📦</h2>
      <p style="color:#666">Seu pedido <strong>#{order_id[-6:].upper()}</strong> foi enviado e está a caminho.</p>
      {tracking_block}
      <p style="color:#666;font-size:14px;margin-top:16px">Prazo de entrega: consulte o rastreamento para atualização em tempo real.</p>
      <p style="margin-top:32px;color:#999;font-size:12px">© 2025 Beauty Store. Todos os direitos reservados.</p>
    </div>
    """
    _send(to, f"Pedido #{order_id[-6:].upper()} enviado 🚀", html)


def send_waitlist_notification(to: str, product_name: str, product_url: str):
    html = f"""
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a">
      <h1 style="font-size:24px;font-weight:600;margin-bottom:4px">Beauty<span style="color:#c9a96e">.</span></h1>
      <h2 style="font-size:20px;font-weight:600;margin:24px 0 8px">Voltou ao estoque! 🌟</h2>
      <p style="color:#666">Boa notícia! <strong>{product_name}</strong>, que você estava esperando, acabou de voltar ao estoque.</p>
      <a href="{product_url}" style="display:inline-block;margin-top:20px;background:#c9a96e;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600">
        Comprar agora →
      </a>
      <p style="color:#999;font-size:12px;margin-top:8px">Corra — o estoque pode ser limitado!</p>
      <p style="margin-top:32px;color:#999;font-size:12px">© 2025 Beauty Store. Todos os direitos reservados.</p>
    </div>
    """
    _send(to, f"🌟 {product_name} voltou ao estoque!", html)


def send_points_credited(to: str, points: int, balance: int):
    html = f"""
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a">
      <h1 style="font-size:24px;font-weight:600;margin-bottom:4px">Beauty<span style="color:#c9a96e">.</span></h1>
      <h2 style="font-size:20px;font-weight:600;margin:24px 0 8px">Ritual Points creditados ✨</h2>
      <div style="background:#1a1a1a;border-radius:16px;padding:24px;color:white;text-align:center;margin:20px 0">
        <p style="color:#c9a96e;font-size:12px;font-weight:600;letter-spacing:2px;margin-bottom:8px">PONTOS GANHOS</p>
        <p style="font-size:48px;font-weight:700;margin:0">+{points}</p>
        <p style="color:#999;font-size:14px;margin-top:4px">Saldo total: {balance} pts</p>
      </div>
      <p style="color:#666;font-size:14px">Seus pontos foram creditados por sua compra. Use-os para ganhar descontos nas próximas compras!</p>
      <a href="{settings.frontend_url}/conta" style="display:inline-block;margin-top:20px;background:#c9a96e;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600">
        Ver meus pontos →
      </a>
      <p style="margin-top:32px;color:#999;font-size:12px">© 2025 Beauty Store. Todos os direitos reservados.</p>
    </div>
    """
    _send(to, f"✨ +{points} Ritual Points creditados!", html)
