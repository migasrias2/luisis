import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import planoMesas from "@/assets/wedding/plano-mesas.jpg";
import salaMontada from "@/assets/wedding/sala-montada.jpg";

/* ────────────────────────────────────────────────────────────
   PLANO DE MESAS — Casamento Isis & Luís (15.08.2026)

   • Plano visual da sala: src/assets/wedding/plano-mesas.jpg
   • Convidados de cada mesa: fonte = Lista_Convidados_Mesas 14082026.csv (292 lugares)
   A pesquisa por nome ignora maiúsculas e acentos.
   ──────────────────────────────────────────────────────────── */
type Table = { id: number; label?: string; guests: string[] };

const TABLES: Table[] = [
  { id: -1, label: "Mesa dos Noivos", guests: ["Isis Armada", "Luís Armada"] },
  { id: 0, guests: ["Victor Viana", "Rui Armada", "Fernanda Menezes", "Nuno Armada", "Katila Mendes", "Rute Armada", "Tatiana Fortes", "Isaac da Cunha", "Wiam Idbouichou", "José Inácio", "Maurya Pereira", "Maria José"] },
  { id: 1, guests: ["Manuel Sampaio", "Alice Armada", "Nara Armada", "Afra Armada", "Luís Armada", "João Pinto de Campos", "Teresinha Armada", "Filomena Moreso", "Jurema Cardoso", "Regina Armada", "Marcelo Mendes"] },
  { id: 2, guests: ["Gilmar de Oliveira", "Patrícia dos Santos", "Jandira Santos", "Leandra Santos", "Beatriz Santos", "Wesa Faria", "Paula Viana", "António da Silva", "Stella Lagrifa", "Isabel Cohen", "Carlos Cohen"] },
  { id: 3, guests: ["Alexandre da Silva", "Jane", "Yara Armada", "Nelson Armada", "Djamila Fortes", "Fábio Fortes", "David Mota", "Samuel", "Manuela Mota", "Jordana Leitão"] },
  { id: 4, guests: ["Mila Silva", "João Silva", "Ana Armada", "Paulo Armada", "Fernando Armada", "Carla Henriques", "Sandra Vilar", "Marco Vinhais", "Ernesto Farinas"] },
  { id: 5, guests: ["António Costa", "Odélia Costa", "Miguel Catraio", "Edith Catraio", "Luísa Félix", "José Cameira", "Camila Carvalho", "Maria Vandsula", "Susana Miguel", "Riquinho Miguel", "Pedro Silva", "Filomena Silva"] },
  { id: 6, guests: ["Rosa Costa", "Carlos Costa", "Paulo Viana", "Elizabeth Bongo", "Carla Viana", "Rui Carmo", "Danila Batalha", "Hugo Batalha", "Alice Silva", "Daniel Gaspar", "Catarino Pereira", "Isabel Gama"] },
  { id: 7, guests: ["Marlene Pereira", "Geraldo de Carvalho", "Isabel Passos", "Mário Passos", "Giovani Martins", "Teresa Martins", "Manassês Martins", "Hélvia Oliveira", "Cláudia Sebastião", "Efraim Martins", "Eliane Martins"] },
  { id: 8, guests: ["Luana Casimiro", "Erika Casimiro", "Pedro Macedo", "Filipe dos Santos", "Malena Magalhães", "Sónia Casimiro", "Flávia Gonçalves", "Sandra José", "Edna Casimiro", "Leonel Casimiro", "Óscar Casimiro", "Lineth Verdades", "Jessy Casimiro", "Manuela Casimiro", "Daniela Casimiro"] },
  { id: 9, guests: ["Mudumane Boavida", "Emanuel Madaleno", "Ligia Madaleno", "David Madaleno", "Luna Madaleno", "Kwatchila Costa", "Edeline Costa", "Ariete Faria", "Sandra Santos", "Santiago Soares", "Aldemiro - Esposa", "Aldemiro da Conceição"] },
  { id: 10, guests: ["Nathaly", "Victória Viana", "Bruna Viana", "Yoanni Viana", "Kyami Costa", "Adrien", "Miriam Costa", "Ericksson Viana", "Ivanilson Viana", "Helga Viana", "Camila", "Micaela", "Leandro Nicácio", "Jéssica Nicácio", "Kayo", "Thaís"] },
  { id: 11, guests: ["Filipe Carvalho", "Rodrigo Carvalho", "Ruben Ferraz", "Djanira Félix", "Priscilla Lolo", "Joshua", "Radhija", "Luyana Félix", "Patrícia Félix", "Raul Vaz", "Yuri Paulo"] },
  { id: 12, guests: ["Mónica Miranda", "Heyla Machado", "Marcelo Pereira", "Ricardo Pereira", "Adozinda Cunha", "Teodorico Cunha", "Higino Covilhã", "Guiomar Covilhã", "Luigi", "Isana Machado", "Flávio Martins"] },
  { id: 13, guests: ["Eliana Lopes", "Tony Silva", "Íris Costa", "Ana Rafaela", "Ana Ramos", "Ricardo Ramos", "Beatriz Faria", "Xima Faria", "Ruca Faria"] },
  { id: 14, guests: ["Sidney Ferreira", "Fábia Ferreira", "Canassy Chitas", "Adilia Chitas", "Gerson Sequeira", "Elizângela Sequeira", "Luís Costa", "Deborah Costa", "Ivanilson Machado", "Cristina Machado", "Ederson Machado", "Walkiria Machado"] },
  { id: 15, guests: ["Edgar Oliveira", "Ana Oliveira", "António Ovídio", "Ademar Damião", "Walter Campos", "Walter - Acompanhante", "Zhair Din", "Sara Din", "Sónia Ferreira", "Dilson Silva", "Etianeth Almeida"] },
  { id: 16, guests: ["Ruben Heineken", "Bruna Martins", "Jéssica Veiga", "Márcio Veiga", "Yannick Diogo", "Artemiza Martinez", "Kelvin Amaral", "Elton Beia", "Kelsio Van-Dúnem", "Céline Van-Dúnem", "Luana Mateus", "William Malheiro", "Nuno Tomás", "Sarah Rossini"] },
  { id: 17, guests: ["Gabriella Costa", "Inmaculada Moreno", "Catarina Terrinha", "Henrique Fonseca", "Vânia Ribas", "Élison Bartolomeu", "Cristiano Jorge", "Dárcio Mesquita", "Gerson Mesquita", "Rudi Mesquita", "Ronaldo Carvalho"] },
  { id: 18, guests: ["André Armada", "Belén Talavante", "Chiara Armada", "Lueji Armada", "Aspen Doherty", "Raquel Armada", "Afonso Pires", "Roger Trindade", "Diego Trindade", "Tatiana Mineeva", "Lucas Armada", "Miguel Martins"] },
  { id: 19, guests: ["Renato de Sousa", "Katherine Joseane", "Rebeca Cebolo", "Eddie Garcia", "Rafael Monteiro", "Luana Pacheco", "Maria Helena", "Tatiana Nunes", "Teresa Lima", "Bruna Pereira", "Nadine Bastos", "Péricles Joseph", "Divanilson Benge", "Márcio Mota", "Marcos Mota", "Josué Nele"] },
  { id: 20, guests: ["Carlos Aguiar", "Annette Benchimol", "Kássia Silva", "Danilson Silva", "Cynthia Faria", "Raquel Domingos", "Ana Sofia Marinho", "Afonso Miala", "Rita Lima"] },
  { id: 21, guests: ["Rui Évora", "Matthew Oly", "Maria Lopes", "Alexandra Neto", "Daniela Beirão", "Bruna Dias", "Filipe Dias", "Jéssica Pinto", "Joicebel Félix", "Mara Félix", "Eduardo Matos", "Márcia Silva"] },
  { id: 22, guests: ["Yola Fernandes", "Jorge da Cruz", "Sílvia Colles", "Miguel Chantre", "Yara Karina", "Pietro Mandetta", "Jacqueline Costa", "Miguel Albuquerque", "Walter da Costa", "Alberta João", "Mauro Carvalho", "Mauro - Acompanhante"] },
  { id: 23, guests: ["Shawny de Sousa", "Kevin Jongschaap", "Daniel Sardinha", "Tatiana Casimiro", "Cindy Pires", "Sidney Cardoso", "Hugo Renato", "Áurea Gouveia", "Márcia Fernandes", "Maroc Isata", "Sesita Isata"] },
  { id: 24, guests: ["Débora Marques", "Tiago Moreira", "João Rama", "Suzana Vidal", "Érica Seguro", "Rui Seguro", "Christine Martins", "Guilherme Martins"] },
];

const stripCombiningMarks = new RegExp("[\\u0300-\\u036f]", "g");
const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(stripCombiningMarks, "");

function TableCard({ table, query }: { table: Table; query: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="heading-caps text-lg font-medium tracking-[0.12em]">
          {table.label ?? `Mesa ${table.id}`}
        </h2>
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
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
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

        {/* Foto de ambiente — a sala montada. Sem números: a disposição é
            aproximada, quem procura a mesa usa o plano acima. */}
        <figure className="mt-8">
          <img
            src={salaMontada}
            alt="A Estufa montada para o copo de água"
            loading="lazy"
            className="w-full rounded-md border border-border"
          />
          <figcaption className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            A sala à vossa espera
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
