import { Link, useLocation } from "react-router-dom";

/* Secções da página inicial (âncoras) + a nova aba "Plano de Mesas" */
const SECTIONS = [
  { id: "proximo-capitulo", label: "O Casal" },
  { id: "fundos", label: "Presentes" },
  { id: "contribuir", label: "Contribuir" },
  { id: "local", label: "Local" },
];

export default function SiteHeader() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  // Nas outras páginas, os links de secção têm de voltar à página inicial primeiro.
  const sectionHref = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="script text-2xl leading-none md:text-3xl">
          Isis &amp; Luís
        </Link>

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-5 md:flex">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={sectionHref(s.id)}
                className="heading-caps text-[11px] tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Botão "Plano de Mesas" escondido por agora (a página /plano-de-mesas
              continua acessível por link direto / QR code). Para repor, descomentar:
          <Link
            to="/plano-de-mesas"
            className={`rounded-md border px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
              pathname === "/plano-de-mesas"
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/30 hover:bg-foreground hover:text-background"
            }`}
          >
            Plano de Mesas
          </Link>
          */}
        </div>
      </nav>
    </header>
  );
}
