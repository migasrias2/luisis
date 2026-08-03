import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

import checkoutHandler from "./api/create-checkout-session";

/*
  Em produção, a função `api/create-checkout-session.ts` é executada pelo Vercel.
  O `vite dev` não corre funções serverless, por isso este plugin liga o mesmo
  handler ao servidor de desenvolvimento — assim o "Contribuir Online" também
  funciona em `npm run dev` (lê a STRIPE_SECRET_KEY do .env).
*/
function stripeCheckoutDevApi(): Plugin {
  return {
    name: "stripe-checkout-dev-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/create-checkout-session")) return next();
        try {
          const chunks: Uint8Array[] = [];
          for await (const chunk of req) chunks.push(chunk as Uint8Array);
          const rawBody = Buffer.concat(chunks).toString("utf8");

          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === "string") headers.set(key, value);
            else if (Array.isArray(value)) headers.set(key, value.join(", "));
          }

          const origin = `http://${req.headers.host}`;
          const request = new Request(origin + req.url, {
            method: req.method,
            headers,
            body: req.method === "POST" && rawBody ? rawBody : undefined,
          });

          const response = await checkoutHandler(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(await response.text());
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: String(err) }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega TODAS as variáveis do .env (sem prefixo) para a função /api local.
  const env = loadEnv(mode, process.cwd(), "");
  if (env.STRIPE_SECRET_KEY) process.env.STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), stripeCheckoutDevApi()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
