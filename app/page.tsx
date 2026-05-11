import Footer from "components/layout/footer";
import {
  homeGuideCards,
  homeInspirationCards,
  mainCollections,
} from "lib/storefront-content";
import { getProducts } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  description:
    "Maison Atelier, boutique design en ligne : mobilier, décoration et inspirations d'intérieur.",
  openGraph: {
    type: "website",
  },
};

async function getHomeFeaturedProducts() {
  const tags = ["Salon", "Décoration", "Canapé"];
  const products = await Promise.all(
    tags.map(async (tag) => {
      const taggedProducts = await getProducts({ query: `tag:'${tag}'` });
      return taggedProducts[0] ?? null;
    }),
  );

  return products.filter((product) => product !== null);
}

export default async function HomePage() {
  const featuredProducts = await getHomeFeaturedProducts();

  return (
    <>
      <section className="mx-auto mt-6 grid max-w-(--breakpoint-2xl) gap-4 px-4 md:grid-cols-12">
        <article className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-700 p-8 text-white md:col-span-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.28em] text-neutral-300">
            Nouvelle collection
          </p>
          <h1 className="mt-3 max-w-xl text-4xl leading-tight font-semibold md:text-6xl">
            Votre maison, pensée comme une galerie contemporaine.
          </h1>
          <p className="mt-5 max-w-xl text-sm text-neutral-200 md:text-base">
            Découvrez une sélection en français de mobilier, canapés, literie et
            décoration au style moderne et sophistiqué.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/collections/salon"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
            >
              Explorer le salon
            </Link>
            <Link
              href="/collections"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Voir toutes les collections
            </Link>
          </div>
        </article>
        <article className="rounded-[2rem] border border-neutral-200 bg-white p-6 md:col-span-4 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Rendez-vous design
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
            Inspiration de la semaine
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            « Paris Élégant » associe matières naturelles, lignes sculpturales
            et jeux de lumière subtils.
          </p>
          <Link
            href="/inspirations/paris-elegant"
            className="mt-6 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Découvrir l'ambiance
          </Link>
        </article>
      </section>

      <section className="mx-auto mt-12 max-w-(--breakpoint-2xl) px-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Univers
            </p>
            <h2 className="text-3xl font-semibold text-neutral-900">
              Nos collections principales
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mainCollections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group rounded-[1.5rem] border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`h-28 rounded-2xl bg-gradient-to-br ${collection.accentClass}`}
              />
              <h3 className="mt-4 text-xl font-semibold text-neutral-900">
                {collection.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-700">
                {collection.subtitle}
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                {collection.description}
              </p>
              <span className="mt-5 inline-flex text-sm font-medium text-neutral-900 underline-offset-4 group-hover:underline">
                Voir la collection
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-(--breakpoint-2xl) px-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Sélection
            </p>
            <h2 className="text-3xl font-semibold text-neutral-900">
              Pièces à l'honneur
            </h2>
          </div>
          <Link
            href="/search?sort=trending-desc"
            className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
          >
            Voir les tendances
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featuredProducts.length > 0
            ? featuredProducts.map((product) => (
                <Link
                  key={product.handle}
                  href={`/product/${product.handle}`}
                  className="overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white transition hover:shadow-xl"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.featuredImage.url}
                      alt={product.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </Link>
              ))
            : [0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="rounded-[1.5rem] border border-neutral-200 bg-gradient-to-br from-neutral-100 to-neutral-200 p-8"
                >
                  <h3 className="text-lg font-semibold text-neutral-700">
                    Sélection en préparation
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    Connectez votre catalogue Shopify pour afficher les produits
                    recommandés.
                  </p>
                </div>
              ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-(--breakpoint-2xl) px-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-neutral-200 bg-white p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Inspirations
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
              Ambiances signées Maison Atelier
            </h2>
            <div className="mt-5 space-y-4">
              {homeInspirationCards.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl border border-neutral-200 p-4 transition hover:border-neutral-400 hover:bg-neutral-50"
                >
                  <p className="font-medium text-neutral-900">{item.title}</p>
                  <p className="mt-1 text-sm text-neutral-600">{item.blurb}</p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-neutral-200 bg-white p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Conseils
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
              Guides pratiques pour chaque pièce
            </h2>
            <div className="mt-5 space-y-4">
              {homeGuideCards.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl border border-neutral-200 p-4 transition hover:border-neutral-400 hover:bg-neutral-50"
                >
                  <p className="font-medium text-neutral-900">{item.title}</p>
                  <p className="mt-1 text-sm text-neutral-600">{item.blurb}</p>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
}
