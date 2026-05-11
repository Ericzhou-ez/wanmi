import Footer from "components/layout/footer";
import { homeGuideCards } from "lib/storefront-content";
import Link from "next/link";

export const metadata = {
  title: "Conseils",
  description: "Conseils déco et aménagement pour chaque pièce de la maison.",
};

export default function ConseilsIndexPage() {
  return (
    <>
      <section className="mx-auto mt-8 max-w-(--breakpoint-2xl) px-4 pb-14">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Guides Maison Atelier
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-neutral-900">
          Conseils
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Des méthodes simples pour choisir les bonnes pièces et créer des
          espaces harmonieux, pièce par pièce.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {homeGuideCards.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-neutral-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm text-neutral-600">{item.blurb}</p>
              <span className="mt-4 inline-block text-sm font-medium text-neutral-900 underline-offset-4 hover:underline">
                Lire le guide
              </span>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
