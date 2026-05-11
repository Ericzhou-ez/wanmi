import Grid from "components/grid";
import Footer from "components/layout/footer";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort } from "lib/constants";
import { getCollectionProductsById, getProducts } from "lib/shopify";
import { getCollectionBySlug, mainCollections } from "lib/storefront-content";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getCategoryProducts(slug: string) {
  const collection = getCollectionBySlug(slug);

  if (!collection) return [];

  const byCollectionId = collection.collectionId
    ? await getCollectionProductsById({
        id: collection.collectionId,
        sortKey: defaultSort.sortKey,
        reverse: defaultSort.reverse,
      })
    : [];

  if (byCollectionId.length > 0) return byCollectionId;

  return getProducts({
    query: `tag:'${collection.tag}'`,
    sortKey: "BEST_SELLING",
  });
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = getCollectionBySlug(params.slug);

  if (!collection) return notFound();

  return {
    title: collection.title,
    description: collection.description,
  };
}

export async function generateStaticParams() {
  return mainCollections.map((collection) => ({ slug: collection.slug }));
}

export default async function CollectionDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const collection = getCollectionBySlug(params.slug);

  if (!collection) return notFound();

  const products = await getCategoryProducts(collection.slug);

  return (
    <>
      <section className="mx-auto mt-8 max-w-(--breakpoint-2xl) px-4 pb-16">
        <Link
          href="/collections"
          className="text-sm text-neutral-600 underline-offset-4 hover:underline"
        >
          ← Retour aux collections
        </Link>
        <div className="mt-4 rounded-[2rem] border border-neutral-200 bg-white p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Collection
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-neutral-900">
            {collection.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-neutral-600">
            {collection.description}
          </p>
          <div
            className={`mt-6 h-32 rounded-3xl bg-gradient-to-br ${collection.accentClass}`}
          />
        </div>

        <div className="mt-8">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-neutral-200 bg-white p-8">
              <p className="text-lg font-medium text-neutral-900">
                Aucun produit trouvé pour cette collection.
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                Vérifiez les tags Shopify ({collection.tag}) ou ajoutez des
                produits à cette collection.
              </p>
            </div>
          ) : (
            <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <ProductGridItems products={products} />
            </Grid>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
