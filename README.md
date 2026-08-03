# Isis & Luís · 15.08.2026

Site do casamento — lista de presentes com contribuições por cartão (Stripe), IBAN, MB Way e Revolut.

Construído com React + Vite + Tailwind CSS. Design, cores, fontes e fotografias baseados no moodboard do casamento (Clube + Estufa Monsanto, Lisboa).

## Antes de publicar

1. **Dados de pagamento manual** — em `src/pages/Index.tsx`, substituir:
   - `[IBAN_AQUI]` → IBAN completo
   - `[TITULAR_AQUI]` → nome do titular da conta
   - `[MBWAY_AQUI]` → número associado ao MB Way
   - `[REVOLUT_AQUI]` → @revtag ou link revolut.me/...

2. **Stripe (pagamentos por cartão)**:
   - Criar conta em [stripe.com](https://stripe.com) e copiar a **chave secreta** (Dashboard → Developers → API keys)
   - No Vercel: Project → Settings → Environment Variables → adicionar `STRIPE_SECRET_KEY`
   - A função `api/create-checkout-session.ts` cria a sessão de checkout no caminho `/api/create-checkout-session` — não precisa de mais nada
   - Testar primeiro com a chave `sk_test_...` e o cartão de teste `4242 4242 4242 4242`; trocar para `sk_live_...` quando estiver tudo bem
   - Sem a chave configurada, o site continua a funcionar: o botão de cartão mostra um aviso e os convidados usam IBAN/MB Way/Revolut

## Desenvolvimento

```sh
npm install
npm run dev           # site em http://localhost:8080 (sem a função Stripe)
npx vercel dev        # site + função Stripe em local (lê STRIPE_SECRET_KEY de um ficheiro .env)
```

## Deploy (Vercel)

O `vercel.json` faz o rewrite de SPA (todas as rotas → `index.html`) para as rotas do React Router
(ex.: `/plano-de-mesas`) funcionarem. O build (`npm run build` → `dist`) e a função em `api/`
são detetados automaticamente pelo Vercel.

- **Via GitHub (recomendado):** "Import Project" no Vercel a partir do repositório — cada push publica automaticamente.
- **Via CLI:** `npx vercel --prod`
