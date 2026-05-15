import { HomeHero } from "components/home/home-hero";
import {
  FullWidthFeatureSection,
  LifestyleSection,
  ProductCarouselRail,
  ShopBySection,
} from "components/home/home-sections";
import Footer from "components/layout/footer";
import { defaultSort } from "lib/constants";
import { getHomeHeroHandles } from "lib/home-hero";
import {
  getCollectionProductsById,
  getProduct,
  getProducts,
} from "lib/shopify";
import { mainCollections } from "lib/storefront-content";
import type { HomeHeroProduct } from "types/home-hero";

export const metadata = {
  description:
    "Maison Atelier, boutique design en ligne : mobilier, décoration et inspirations d'intérieur.",
  openGraph: {
    type: "website",
  },
};

async function getProductsForCollectionTag({
  collectionId,
  tag,
  limit,
}: {
  collectionId?: string;
  tag: string;
  limit: number;
}) {
  const byId = collectionId
    ? await getCollectionProductsById({
        id: collectionId,
        sortKey: defaultSort.sortKey,
        reverse: defaultSort.reverse,
      })
    : [];

  if (byId.length > 0) return byId.slice(0, limit);

  const byTag = await getProducts({
    query: `tag:'${tag}'`,
    sortKey: "BEST_SELLING",
  });
  return byTag.slice(0, limit);
}

export default async function HomePage() {
  const collectionCards = mainCollections.filter(
    (collection) =>
      collection.slug !== "chaises-lounge" && collection.slug !== "canape",
  );

  const [
    salonProducts,
    chambreProducts,
    salleAMangerProducts,
    decorationProducts,
    literieProducts,
    chaisesLoungeProducts,
    topSellers,
  ] = await Promise.all([
    getProductsForCollectionTag({
      collectionId: mainCollections.find((c) => c.slug === "salon")
        ?.collectionId,
      tag: "Salon",
      limit: 5,
    }),
    getProductsForCollectionTag({
      collectionId: mainCollections.find((c) => c.slug === "chambre")
        ?.collectionId,
      tag: "Chambre",
      limit: 5,
    }),
    getProductsForCollectionTag({
      collectionId: mainCollections.find((c) => c.slug === "salle-a-manger")
        ?.collectionId,
      tag: "Salle à Manger",
      limit: 5,
    }),
    getProductsForCollectionTag({
      collectionId: mainCollections.find((c) => c.slug === "decoration")
        ?.collectionId,
      tag: "Décoration",
      limit: 5,
    }),
    getProductsForCollectionTag({
      collectionId: mainCollections.find((c) => c.slug === "literie")
        ?.collectionId,
      tag: "Literie",
      limit: 5,
    }),
    getProductsForCollectionTag({
      collectionId: mainCollections.find((c) => c.slug === "chaises-lounge")
        ?.collectionId,
      tag: "Chaises Lounge",
      limit: 5,
    }),
    getProducts({ sortKey: "BEST_SELLING" }).then((items) => items.slice(0, 6)),
  ]);

  const heroHandles = getHomeHeroHandles();
  const heroProducts = await Promise.all(
    heroHandles.map(async (handle) => {
      const product = await getProduct(handle);
      return product
        ? ([handle, product] as const)
        : ([handle, undefined] as const);
    }),
  );
  const productsByHandle: Record<string, HomeHeroProduct | undefined> =
    Object.fromEntries(
      heroProducts.map(([handle, p]) => [
        handle,
        p
          ? {
              handle: p.handle,
              title: p.title,
              imageUrl: p.featuredImage?.url,
              imageAlt: p.featuredImage?.altText ?? p.title,
              priceAmount: p.priceRange?.minVariantPrice?.amount,
              priceCurrency: p.priceRange?.minVariantPrice?.currencyCode,
            }
          : undefined,
      ]),
    );

  return (
    <>
      <HomeHero productsByHandle={productsByHandle} />

      <ShopBySection collections={collectionCards} />

      <FullWidthFeatureSection
        imageUrl={literieProducts[0]?.featuredImage?.url}
        imageAlt={literieProducts[0]?.title ?? "La chambre, version cocon"}
        eyebrow="Soin du confort"
        title="La chambre, version cocon."
        ctaLabel="Voir la literie"
        ctaHref="/collections/literie"
        textAlign="left"
      />

      <ProductCarouselRail
        title="Meilleures ventes"
        subtitle="Top sélections"
        products={topSellers}
        href="/search?sort=best-selling"
      />

      <FullWidthFeatureSection
        imageUrl={decorationProducts[0]?.featuredImage?.url}
        imageAlt={decorationProducts[0]?.title ?? "La touche finale, assumée"}
        eyebrow="Détails qui signent"
        title="La touche finale, assumée."
        ctaLabel="Voir la décoration"
        ctaHref="/collections/decoration"
        textAlign="right"
      />

      {/* <ProductCarouselRail
        title="À installer Salon"
        subtitle="Sélection"
        products={salonProducts}
        href="/collections/salon"
      /> */}

      <LifestyleSection
        chambreProducts={chambreProducts}
        salleAMangerProducts={salleAMangerProducts}
        chaisesLoungeProducts={chaisesLoungeProducts}
      />

      <Footer />
    </>
  );
}
