import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import planoMesas from "@/assets/wedding/plano-mesas.jpg";

/* ────────────────────────────────────────────────────────────
   PLANO DE MESAS — Casamento Isis & Luís (15.08.2026)

   • Plano visual da sala: src/assets/wedding/plano-mesas.jpg
   • Convidados de cada mesa: fonte = Convidados_Casamento.xlsx
   A pesquisa por nome ignora maiúsculas e acentos.
   ──────────────────────────────────────────────────────────── */
type Table = { id: number; guests: string[] };

const TABLES: Table[] = [
  { id: 1, guests: ["Rosa Costa", "Carlos Costa", "Nália Fonseca", "Francisco Fonseca", "Paulo Viana", "Elizabeth Bongo", "Alfredo Viana", "Carla Viana", "Rui Carmo", "Danila Batalha", "Hugo Batalha", "Alice Silva", "Daniel Gaspar"] },
  { id: 2, guests: ["Victor Viana", "Maria José", "Rute Armada", "Rui Armada", "Fernanda Menezes", "Tatiana Fortes", "Isaac da Cunha", "Nuno Armada", "Katila Mendes", "Maurya Pereira", "José Inácio", "Wiam Idbouichou"] },
  { id: 3, guests: ["Patrícia dos Santos", "Gilmar de Oliveira", "Jandira Santos", "Leandra Santos", "Beatriz Santos", "Wesa Faria", "Paula Viana", "António da Silva", "Stella Lagrifa", "Georgina Pedro", "Carlos Cohen", "Isabel Cohen"] },
  { id: 4, guests: ["Afra Armada", "Luís Armada", "Alice Armada", "Manuel Sampaio", "Nara Armada", "Filomena Moreso", "Teresinha Armada", "João Pinto de Campos", "Regina Armada", "Marcelo Mendes", "Jurema Cardoso", "Yuri Cardoso"] },
  { id: 5, guests: ["Luísa Félix", "Luísa - Acompanhante", "Maria do Carmo", "Odélia Costa", "António Costa", "Filomena Silva", "Pedro Silva", "Riquinho Miguel", "Susana Miguel", "Márcia Silva", "Camila Carvalho", "Arlindo Carvalho"] },
  { id: 6, guests: ["Giovani Martins", "Teresa Martins", "Manassês Martins", "Isabel Passos", "Mário Passos", "Helvia Oliveira", "Marlene Pereira", "Geraldo de Carvalho", "Efraim Martins", "Eliane Martins", "Mónica Cruz", "Bruno Pereira"] },
  { id: 7, guests: ["Mudumane", "Emanuel Madaleno", "Ligia Madaleno", "Luna Madaleno", "David Madaleno", "Ariete Faria", "Kwatchila Costa", "Edeline Costa", "Aldemiro da Conceição", "Aldemiro - Esposa", "Harolde Mendes", "Tadine Mendes"] },
  { id: 8, guests: ["Paulo Armada", "Ana Armada", "Sandra Vilar", "Marco Vinhais", "Djamila Fortes", "Joao Silva", "Joao Silva - Esposa", "Nelson Armada", "Manuela Mota", "David Mota", "Samuel", "Jordana Leitao", "Fernando Armada", "Carla Henriques", "Ernesto Farinas", "Fabio Fortes"] },
  { id: 9, guests: ["Hugo Luís", "Ilana Luís", "Nuno ou Edgar", "Nuno ou Edgar - Esposa", "Ademar Damião", "Hilay Carvalho", "Antonio Ferreira", "Walter Campos", "Walter - Esposa", "Zhair Din", "Sara Din", "Sónia Ferreira"] },
  { id: 10, guests: ["Luyana Félix", "Joshua", "Radhija", "Ana Ramos", "Regina Félix", "Francisco Muambuenze", "Patrícia Félix", "Priscilla Lolo", "Djanira Félix", "Ulika Costa", "Omar Costa", "Joicebel Félix"] },
  { id: 11, guests: ["Bruna Viana", "Rui Ferreira", "Yoanni Viana", "Kyami Costa", "Victória Viana", "Nathaly", "Jéssica Nicácio", "Leandro Nicácio", "Kayo", "Thaís", "Ericksson Viana", "Miriam Costa", "Adrien", "Ivanilson Viana", "Helga Viana", "Camila", "Micaela"] },
  { id: 12, guests: ["Ivanilson Machado", "Cristina Machado", "Ederson Machado", "Walkiria Machado", "Canassy Chitas", "Adilia Chitas", "Sidney Ferreira", "Fábia Ferreira", "Gerson Sequeira", "Elizângela Sequeira", "Luís Costa", "Deborah Costa"] },
  { id: 13, guests: ["Sónia Casimiro", "Leonel Casimiro", "Edna Casimiro", "Manuela Baptista", "Sérgio Baptista", "Daniela Casimiro", "Luyana Pacheco", "Manuela Casimiro", "Henrique Fonseca", "Jéssica Casimiro", "Pedro Macedo", "Malena", "Malena - Acompanhante", "Lineth Verdades", "Óscar Casimiro", "Susy"] },
  { id: 14, guests: ["Guiomar Covilhã", "Higino Covilhã", "Luigi", "Isana Machado", "Flávio Martins", "Adozinda Cunha", "Teodorico Cunha", "Marcelo Pereira", "Ricardo Pereira", "Mónica Miranda", "Heyla Machado", "Iris"] },
  { id: 15, guests: ["Luana Pacheco", "Maria Helena", "Inaara Virgi", "Hélio Nunes", "Tatiana Nunes", "Eddie Garcia", "Rebeca Cebolo", "Rafael Monteiro", "Rui George", "Márcio Mota", "Marcos Mota", "Renato de Sousa", "Katherine Joseane", "Divanilson Benge", "Péricles Joseph", "Nadine Bastos"] },
  { id: 16, guests: ["André Armada", "Belén Talavante", "Raquel Armada", "Afonso Pires", "Roger Trindade", "Diego Trindade", "Tatiana Mineeva", "Lucas Armada"] },
  { id: 17, guests: ["Chiara Armada", "Lueji Armada", "Aspen Doherty", "Jane", "Yara Armada", "Alexandre da Silva", "Ronaldo Carvalho", "Miguel Martins", "Darcio Mesquita", "Gerson Mesquita", "Rudi Mesquita"] },
  { id: 18, guests: ["Kelvin Amaral", "Kelsio Van-dunem", "Céline Van-dunem", "Kelson Humberto", "Ruben Heineken", "Bruna Martins", "Márcio Veiga", "Jéssica Veiga", "Elton Beia", "Yannick Diogo", "Artemiza Martinez", "William Malheiro", "Luana Mateus", "Nuno Cartier", "Sarah Rossini"] },
  { id: 19, guests: ["Érica Seguro", "Rui Seguro", "Christine Martins", "Guilherme Martins", "Débora Marques", "Tiago Moreira", "João Rama", "Suzana Vidal"] },
  { id: 20, guests: ["Miguel Chantre", "Yara Karina", "Pietro Mandetta", "Jacqueline Costa", "Miguel Albuquerque", "Sílvia Colles", "Jorge da Cruz", "Yola Fernandes"] },
  { id: 21, guests: ["Cindy Pires", "Sidney Cardoso", "Ariane David", "Hugo Renato", "Áurea Gouveia", "Márcia Fernandes", "Maroc Isata", "Sesita Isata", "Bruno Nunes", "Farida Canelas", "Bruna Pereira"] },
  { id: 22, guests: ["Willy Guimarães", "Vanessa Guimarães", "Ruca Faria", "Xima Faria", "Beatriz Faria", "Dilson Silva", "Etianeth Almeida", "Eliana Lopes", "Eliana - António", "Nuno ou Edgar", "Nuno ou Edgar - Esposa"] },
  { id: 23, guests: ["Rui Évora", "Maria Lopes", "Matthew Oly", "Alexandra Neto", "Daniela Beirão", "Bruna Dias", "Filipe Dias", "Catarina Terrinha", "Gabriela Costa", "Inmaculada Moreno"] },
  { id: 24, guests: ["Kássia Silva", "Danilson Silva", "Carlos Aguiar", "Annette Benchimol", "Cynthia Faria", "Filipe Silva", "Rita Lima", "Ana Sofia Marinho", "Afonso Miala", "Raquel Domingos", "Mara Félix", "Eduardo Matos"] },
];

const stripCombiningMarks = new RegExp("[\\u0300-\\u036f]", "g");
const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(stripCombiningMarks, "");

function TableCard({ table, query }: { table: Table; query: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="heading-caps text-lg font-medium tracking-[0.12em]">Mesa {table.id}</h2>
        <span className="shrink-0 text-xs text-muted-foreground">{table.guests.length} pessoas</span>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
        {table.guests.map((g) => {
          const match = query !== "" && normalize(g).includes(query);
          return (
            <li
              key={g}
              className={`text-sm ${match ? "font-medium text-primary" : "text-foreground/75"}`}
            >
              {g}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function SeatingPlan() {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const q = normalize(query.trim());
  const isSearching = q !== "";

  const matched = useMemo(() => {
    if (!q) return [];
    return TABLES.filter((t) => t.guests.some((g) => normalize(g).includes(q)));
  }, [q]);

  return (
    <main>
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-3">
            <span className="script">o nosso</span>
            <h1 className="heading-caps text-3xl font-medium md:text-4xl">Plano de Mesas</h1>
          </div>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            Procurem pelo vosso nome para saber a vossa mesa, e localizem-na no plano da sala.
          </p>
        </div>

        {/* Pesquisa */}
        <div className="mx-auto mt-10 max-w-md">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowAll(false);
            }}
            placeholder="Procurar pelo vosso nome…"
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Resultado da pesquisa */}
        {isSearching && (
          <div className="mx-auto mt-8 max-w-2xl">
            {matched.length > 0 ? (
              <div className="grid gap-6">
                {matched.map((t) => (
                  <TableCard key={t.id} table={t} query={q} />
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Não encontrámos ninguém com esse nome. Verifiquem a ortografia ou falem connosco.
              </p>
            )}
          </div>
        )}

        {/* Plano visual da sala */}
        <figure className="mt-12">
          <a href={planoMesas} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={planoMesas}
              alt="Plano de mesas — Estufa · Tazte Secret Spot"
              className="w-full rounded-md border border-border"
            />
          </a>
          <figcaption className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Toquem no plano para o verem em grande
          </figcaption>
        </figure>

        {/* Browsing sem pesquisa */}
        {!isSearching && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="rounded-md border border-foreground/30 px-6 py-3 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background"
            >
              {showAll ? "Esconder lista" : "Ver todas as mesas"}
            </button>

            {showAll && (
              <div className="mt-10 grid gap-6 text-left sm:grid-cols-2">
                {TABLES.map((t) => (
                  <TableCard key={t.id} table={t} query="" />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            to="/"
            className="inline-block rounded-md border border-foreground/30 px-6 py-3 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background"
          >
            Voltar ao início
          </Link>
        </div>
      </section>
    </main>
  );
}
