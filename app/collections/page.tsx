import Footer from "components/layout/footer";
import { mainCollections } from "lib/storefront-content";
import Link from "next/link";

export const metadata = {
  title: "Collections",
  description: "Explorez toutes nos collections maison et mobilier.",
};

export default function CollectionsPage() {
  return (
    <>
      <section className="mx-auto mt-8 max-w-(--breakpoint-2xl) px-4 pb-14">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Maison Atelier
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-neutral-900">
          Toutes les collections
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Naviguez parmi nos univers en français : décoration, literie, chaises
          lounge, chambre, salle à manger, salon et canapé.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mainCollections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group rounded-[1.5rem] border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`h-28 rounded-2xl bg-gradient-to-br ${collection.accentClass}`}
              />
              <h2 className="mt-4 text-xl font-semibold text-neutral-900">
                {collection.title}
              </h2>
              <p className="mt-1 text-sm text-neutral-700">
                {collection.subtitle}
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                {collection.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
