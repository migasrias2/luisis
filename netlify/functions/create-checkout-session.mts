/*
  Função serverless (Netlify) que cria uma sessão de Stripe Checkout
  para um contributo com valor livre.

  Configuração necessária (Netlify → Site configuration → Environment variables):
    STRIPE_SECRET_KEY → chave secreta da conta Stripe (sk_live_... ou sk_test_...)

  Usa a API REST da Stripe diretamente, por isso não precisa de dependências.
*/

const MIN_EUR = 1;
const MAX_EUR = 10000;

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", Allow: "POST" },
    });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return json({ error: "Stripe não configurado (STRIPE_SECRET_KEY em falta)" }, 500);
  }

  let body: { amount?: unknown; fund?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Pedido inválido" }, 400);
  }

  const eur = Number(body.amount);
  if (!Number.isFinite(eur) || eur < MIN_EUR || eur > MAX_EUR) {
    return json({ error: `Valor inválido (entre ${MIN_EUR} e ${MAX_EUR} €)` }, 400);
  }
  const fundName =
    typeof body.fund === "string" && body.fund.trim() ? body.fund.trim().slice(0, 100) : "Presente";

  const origin = req.headers.get("origin") || new URL(req.url).origin;

  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/?contributo=obrigado`,
    cancel_url: `${origin}/#contribuir`,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(Math.round(eur * 100)),
    "line_items[0][price_data][product_data][name]": `Presente de casamento — ${fundName}`,
    "metadata[fund]": fundName,
    locale: "pt",
  });

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const session = await stripeRes.json();
  if (!stripeRes.ok) {
    console.error("Stripe error:", session.error?.message);
    return json({ error: "Não foi possível criar a sessão de pagamento" }, 502);
  }

  return json({ url: session.url }, 200);
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Mantém o endpoint em /api/... para o frontend não depender do caminho interno do Netlify
export const config = {
  path: "/api/create-checkout-session",
};
