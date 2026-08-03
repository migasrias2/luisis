import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

/* Secções da página inicial (âncoras) + a nova aba "Plano de Mesas" */
const SECTIONS = [
  { id: "proximo-capitulo", label: "O Casal" },
  { id: "fundos", label: "Presentes" },
  { id: "contribuir", label: "Contribuir" },
  { id: "local", label: "Local" },
  { id: "programa", label: "Programa" },
];

export default function SiteHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const onHome = pathname === "/";
  // Nas outras páginas, os links de secção têm de voltar à página inicial primeiro.
  const sectionHref = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="script text-2xl leading-none md:text-3xl"
        >
          Isis &amp; Luís
        </Link>

        {/* Navegação — visível a partir de md */}
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

        {/* Botão de menu — só em mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="-mr-1 inline-flex items-center justify-center rounded-md p-2 text-foreground/80 transition-colors hover:text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

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
      </nav>

      {/* Painel de navegação mobile */}
      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={sectionHref(s.id)}
                onClick={() => setOpen(false)}
                className="heading-caps border-b border-border/40 py-3 text-xs tracking-[0.2em] text-foreground/80 transition-colors last:border-b-0 hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
