import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import SiteHeader from "@/components/SiteHeader";

import heroCasal from "@/assets/wedding/hero-casal.jpg";
import presente from "@/assets/wedding/presente.jpg";

import fundoLuaDeMel from "@/assets/wedding/fundos/lua-de-mel.jpg";
import fundoCasaNova from "@/assets/wedding/fundos/casa-nova.jpg";
import fundoBrinde from "@/assets/wedding/fundos/brinde.jpg";
import fundoExperiencia from "@/assets/wedding/fundos/experiencia-a-dois.jpg";

/* Dados de pagamento manual */
const IBAN_PT = "PT50 0033 0000 4549 6520 0340 5";
const IBAN_LT = "LT91 3250 0511 8767 2782";
const MBWAY_ISIS = "960 232 161";
const MBWAY_LUIS = "912 338 222";

const FUNDS = [
  {
    name: "Lua de Mel",
    description:
      "A nossa lua de mel será na Turquia. O vosso contributo irá ajudar-nos a tornar esta viagem ainda mais especial e criar memórias inesquecíveis.",
    image: fundoLuaDeMel,
  },
  {
    name: "Casa Nova",
    description:
      "Um contributo para transformar a nossa casa num verdadeiro lar, ajudando na mobília, detalhes e tudo aquilo que fará parte da nossa nova vida.",
    image: fundoCasaNova,
  },
  {
    name: "Experiências a Dois",
    description:
      "Jantares, viagens, passeios e pequenos momentos que vamos guardar para sempre.",
    image: fundoExperiencia,
  },
  {
    name: "Brindar ao Futuro",
    description:
      "Para quem preferir contribuir sem destino certo. Um gesto que nos acompanhará nesta nova fase e em todos os momentos especiais que ainda vamos viver juntos.",
    image: fundoBrinde,
  },
];

const PRESET_AMOUNTS = [50, 100, 200, 250];

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ script, title }: { script: string; title: string }) {
  return (
    <div className="flex items-baseline justify-center gap-3">
      <span className="script">{script}</span>
      <h2 className="heading-caps text-3xl md:text-4xl font-medium">{title}</h2>
    </div>
  );
}

function OptionHeading({ number, title }: { number: number; title: string }) {
  return (
    <div className="text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Opção {number}</p>
      <h3 className="heading-caps mt-2 text-xl font-medium tracking-[0.14em] md:text-2xl">{title}</h3>
    </div>
  );
}

function CopyCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar. Copiem manualmente, por favor.");
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-card px-5 py-4">
      <div className="min-w-0">
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <div className="break-words font-medium">{value}</div>
        {sub && <div className="text-sm text-muted-foreground">{sub}</div>}
      </div>
      <button
        onClick={copy}
        className="shrink-0 rounded-md border border-foreground/30 px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background"
      >
        {copied ? "Copiado!" : "Copiar"}
      </button>
    </div>
  );
}

function ContributeForm() {
  const [fund, setFund] = useState(FUNDS[0].name); // "Lua de Mel" — fundo por defeito
  const [amount, setAmount] = useState<number | "">(50);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  const effectiveAmount = custom !== "" ? Number(custom) : amount === "" ? 0 : amount;

  const contribute = async () => {
    if (!effectiveAmount || effectiveAmount < 1 || !Number.isFinite(effectiveAmount)) {
      toast.error("Escolham um valor válido (mínimo 1 €).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount, fund }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { url } = await res.json();
      if (!url) throw new Error("Resposta sem URL de checkout");
      window.location.href = url;
    } catch (err) {
      console.error(err);
      toast.error(
        "O pagamento online não está disponível de momento. Podem usar o IBAN ou MB Way abaixo.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-md border border-border bg-card p-6 md:p-8">
      <label className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Fundo
      </label>
      <select
        value={fund}
        onChange={(e) => setFund(e.target.value)}
        className="mb-6 w-full rounded-md border border-input bg-background px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {FUNDS.map((f) => (
          <option key={f.name} value={f.name}>
            {f.name}
          </option>
        ))}
      </select>

      <label className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Valor
      </label>
      <div className="mb-4 grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS.map((v) => (
          <button
            key={v}
            onClick={() => {
              setAmount(v);
              setCustom("");
            }}
            className={`rounded-md border px-3 py-3 text-sm transition-colors ${
              custom === "" && amount === v
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input hover:border-primary"
            }`}
          >
            {v} €
          </button>
        ))}
      </div>
      <input
        type="number"
        min={1}
        placeholder="Outro valor (€)"
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        className="mb-6 w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <button
        onClick={contribute}
        disabled={loading}
        className="w-full rounded-md bg-foreground px-6 py-4 text-xs uppercase tracking-[0.25em] text-background transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {loading ? "A preparar o pagamento…" : "Contribuir Online"}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Pagamento seguro processado pela Stripe.
      </p>
    </div>
  );
}

const Index = () => {
  // Mensagem de agradecimento no regresso do checkout Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("contributo") === "obrigado") {
      toast.success("Muito obrigado pelo vosso contributo! ♥", { duration: 8000 });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return (
    <main>
      <SiteHeader />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <img
          src={heroCasal}
          alt="Isis e Luís"
          className="absolute inset-0 h-full w-full object-cover object-[center_38%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-background" />
        <div className="relative px-6 pb-24 pt-32 text-center text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
          <Reveal>
            <div className="mb-4 flex items-baseline justify-center gap-3">
              <span className="script text-4xl text-white/90 md:text-5xl">o nosso</span>
              <span className="heading-caps text-4xl font-medium md:text-6xl">Casamento</span>
            </div>
            <h1 className="heading-caps mb-8 text-xl tracking-[0.35em] md:text-2xl">
              Isis &amp; Luís
            </h1>
            <div className="mx-auto mb-8 h-px w-24 bg-white/70" />
            <p className="heading-caps text-sm tracking-[0.3em] md:text-base">15 . 08 . 2026</p>
            <p className="heading-caps mt-2 text-sm tracking-[0.3em] md:text-base">
              Basílica da Estrela
            </p>
            <p className="heading-caps mt-1 text-sm tracking-[0.3em] md:text-base">
              Estufa · Tazte Secret Spot
            </p>
          </Reveal>
        </div>
      </section>

      {/* O nosso próximo capítulo */}
      <section
        id="proximo-capitulo"
        className="relative flex min-h-[70vh] scroll-mt-20 items-center justify-center overflow-hidden"
      >
        <img
          src={presente}
          alt="Estufa · Tazte Secret Spot ao pôr do sol"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <Reveal className="relative mx-auto max-w-2xl px-6 py-24 text-center text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.4)]">
          <div className="flex items-baseline justify-center gap-3">
            <span className="script text-white/90">o nosso</span>
            <h2 className="heading-caps text-3xl font-medium md:text-4xl">Próximo Capítulo</h2>
          </div>
          <p className="mt-6 leading-relaxed text-white/90">
            Decidimos continuar o resto do caminho a dois e começar uma nova fase juntos. Se
            quiserem fazer parte deste capítulo, criámos algumas opções onde o vosso carinho poderá
            ajudar-nos a criar novas memórias e construir o nosso futuro.
          </p>
        </Reveal>
      </section>

      {/* Fundos */}
      <section id="fundos" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20 md:py-28">
        <Reveal>
          <SectionTitle script="os nossos" title="Fundos" />
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">
            Para onde pode ir o vosso contributo
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FUNDS.map((fund) => (
            <Reveal key={fund.name}>
              <div className="group h-full overflow-hidden rounded-md border border-border bg-card">
                <div className="h-44 overflow-hidden">
                  <img
                    src={fund.image}
                    alt={fund.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="heading-caps text-lg font-medium tracking-[0.12em]">
                    {fund.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                    {fund.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Como contribuir */}
      <section id="contribuir" className="scroll-mt-20 bg-secondary/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionTitle script="como" title="Contribuir" />
            <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">
              Escolham a forma que for mais fácil — qualquer contributo é bem-vindo.
            </p>
          </Reveal>

          {/* Opção 1 — Contribuir Online */}
          <Reveal className="mt-16">
            <OptionHeading number={1} title="Contribuir Online" />
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-foreground/75">
              Podem contribuir online de forma simples e segura através de Apple Pay, MB Way ou
              cartão bancário.
            </p>
            <div className="mt-8">
              <ContributeForm />
            </div>
          </Reveal>

          {/* Opção 2 — Transferência Bancária */}
          <Reveal className="mt-16">
            <OptionHeading number={2} title="Transferência Bancária" />
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-foreground/75">
              Caso prefiram, podem contribuir através de transferência bancária para um dos
              seguintes IBAN.
            </p>
            <div className="mx-auto mt-8 grid max-w-2xl gap-3">
              <CopyCard label="IBAN · PT" value={IBAN_PT} />
              <CopyCard label="IBAN · LT" value={IBAN_LT} />
            </div>
          </Reveal>

          {/* Opção 3 — MB Way */}
          <Reveal className="mt-16">
            <OptionHeading number={3} title="MB Way" />
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-foreground/75">
              Também podem contribuir diretamente através de MB Way.
            </p>
            <div className="mx-auto mt-8 grid max-w-2xl gap-3">
              <CopyCard label="MB Way — Isis" value={MBWAY_ISIS} />
              <CopyCard label="MB Way — Luís" value={MBWAY_LUIS} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Localização */}
      <section id="local" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20 md:py-28">
        <Reveal>
          <SectionTitle script="o" title="Local" />
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">
            Estufa · Tazte Secret Spot
          </p>
        </Reveal>
        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-md border border-border">
            <iframe
              title="Mapa — Estufa, Tazte Secret Spot, Monsanto · Lisboa"
              src="https://maps.google.com/maps?q=38.7388913,-9.1887904&z=16&output=embed"
              className="h-[380px] w-full md:h-[460px]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://www.google.com/maps/place/Estufa+-+Tazte+Secret+Spot/@38.7388913,-9.1887904,17z/data=!3m1!4b1!4m6!3m5!1s0xd1933617d815017:0x6db2d739047a3940!8m2!3d38.7388913!4d-9.1887904"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md border border-foreground/30 px-6 py-3 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background"
            >
              Abrir no Google Maps
            </a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 text-center">
        <Reveal>
          <p className="text-sm text-foreground/70">Obrigado por fazerem parte deste capítulo.</p>
          <div className="script mt-4 text-4xl">Isis &amp; Luís</div>
          <p className="heading-caps mt-6 text-[11px] tracking-[0.3em] text-muted-foreground">
            15 . 08 . 2026 · Lisboa
          </p>
        </Reveal>
      </footer>
    </main>
  );
};

export default Index;
