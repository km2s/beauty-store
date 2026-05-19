declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// ── GA4 ──────────────────────────────────────────────────────────────────────

export function pageview(url: string) {
  if (typeof window === "undefined" || !GA_ID) return;
  window.gtag?.("config", GA_ID, { page_path: url });
}

export function gaEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !GA_ID) return;
  window.gtag?.("event", name, params);
}

// ── Meta Pixel ───────────────────────────────────────────────────────────────

export function pixelEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !PIXEL_ID) return;
  window.fbq?.("track", event, params);
}

// ── E-commerce helpers ────────────────────────────────────────────────────────

export function trackAddToCart(item: { id: string; name: string; price: number; quantity: number }) {
  gaEvent("add_to_cart", {
    currency: "BRL",
    value: item.price * item.quantity,
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity }],
  });
  pixelEvent("AddToCart", { content_ids: [item.id], content_name: item.name, value: item.price, currency: "BRL" });
}

export function trackViewProduct(item: { id: string; name: string; price: number }) {
  gaEvent("view_item", {
    currency: "BRL",
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, price: item.price }],
  });
  pixelEvent("ViewContent", { content_ids: [item.id], content_name: item.name, value: item.price, currency: "BRL" });
}

export function trackBeginCheckout(total: number) {
  gaEvent("begin_checkout", { currency: "BRL", value: total });
  pixelEvent("InitiateCheckout", { value: total, currency: "BRL" });
}

export function trackPurchase(orderId: string, total: number, items: { id: string; name: string; price: number; quantity: number }[]) {
  gaEvent("purchase", {
    transaction_id: orderId,
    currency: "BRL",
    value: total,
    items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
  });
  pixelEvent("Purchase", { value: total, currency: "BRL", content_ids: items.map((i) => i.id) });
}

export function trackQuizComplete(skinType: string) {
  gaEvent("quiz_complete", { skin_type: skinType });
  pixelEvent("Lead", { skin_type: skinType });
}

export function trackSignUp() {
  gaEvent("sign_up");
  pixelEvent("CompleteRegistration");
}
