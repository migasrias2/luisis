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
   - No Netlify: Site configuration → Environment variables → adicionar `STRIPE_SECRET_KEY`
   - A função `netlify/functions/create-checkout-session.mts` cria a sessão de checkout no caminho `/api/create-checkout-session` — não precisa de mais nada
   - Testar primeiro com a chave `sk_test_...` e o cartão de teste `4242 4242 4242 4242`; trocar para `sk_live_...` quando estiver tudo bem
   - Sem a chave configurada, o site continua a funcionar: o botão de cartão mostra um aviso e os convidados usam IBAN/MB Way/Revolut

## Desenvolvimento

```sh
npm install
npm run dev           # site em http://localhost:8080 (sem a função Stripe)
npx netlify dev       # site + função Stripe em local (lê STRIPE_SECRET_KEY de um ficheiro .env)
```

## Deploy (Netlify)

O `netlify.toml` já define o build (`npm run build` → `dist`), o redirect de SPA e a pasta de funções é detetada automaticamente.

- **Via GitHub (recomendado):** fazer push do repositório e "Import from Git" no Netlify — cada push publica automaticamente.
- **Via CLI:** `npx netlify deploy --prod`
