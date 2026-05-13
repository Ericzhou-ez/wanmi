import Footer from "components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Aide",
  description: "Réponses rapides sur la livraison, les retours et le service.",
};

export default function AidePage() {
  return (
    <>
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12">
        <h1 className="text-4xl font-semibold text-neutral-900">Aide</h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          On a regroupé ici l’essentiel pour une expérience simple et fluide.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/aide/livraison"
            className="rounded-3xl border border-neutral-200 bg-white p-6 transition hover:shadow-xl"
          >
            <p className="text-lg font-semibold text-neutral-900">Livraison</p>
            <p className="mt-2 text-sm text-neutral-600">
              Délais, zones desservies et suivi.
            </p>
          </Link>
          <Link
            href="/aide/retours"
            className="rounded-3xl border border-neutral-200 bg-white p-6 transition hover:shadow-xl"
          >
            <p className="text-lg font-semibold text-neutral-900">Retours</p>
            <p className="mt-2 text-sm text-neutral-600">
              Conditions, étapes et remboursements.
            </p>
          </Link>
          <Link
            href="/search"
            className="rounded-3xl border border-neutral-200 bg-white p-6 transition hover:shadow-xl"
          >
            <p className="text-lg font-semibold text-neutral-900">
              Trouver un article
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              Utilisez la recherche pour aller plus vite.
            </p>
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}

