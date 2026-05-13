import { ArrowRightIcon } from "@heroicons/react/24/outline";
import ProductGridItems from "components/layout/product-grid-items";
import type { Product } from "lib/shopify/types";
import type { MainCollection } from "lib/storefront-content";
import Image from "next/image";
import Link from "next/link";

const shopBySectionImages: Record<string, { src: string; alt: string }> = {
  salon: {
    src: "/assets/shop-by-section/shop-by-section-salon.png",
    alt: "Salon moderne et lumineux",
  },
  chambre: {
    src: "/assets/shop-by-section/shop-by-section-bedroom.png",
    alt: "Chambre elegante au style cocon",
  },
  "salle-a-manger": {
    src: "/assets/shop-by-section/shop-by-section-dinning-table.png",
    alt: "Salle a manger avec table design",
  },
  decoration: {
    src: "/assets/shop-by-section/shop-by-section-decoration.png",
    alt: "Objets de decoration dans un interieur",
  },
  literie: {
    src: "/assets/shop-by-section/shop-by-section-bedding.png",
    alt: "Literie premium et textile de chambre",
  },
};

export function ShopBySection({ collections }: { collections: MainCollection[] }) {
  return (
    <section className="mx-auto mt-10 max-w-(--breakpoint-2xl) px-4">
      <div className="flex items-end justify-between gap-4">
        <div className="w-full text-center">
          <h2 className="text-left text-2xl font-semibold text-neutral-900 sm:text-3xl md:text-center">
            Acheter par pièce
          </h2>
        </div>
      </div>
      <div className="scrollbar-hide mt-5 w-full overflow-x-auto pb-2">
        <div className="mx-auto flex w-max min-w-full snap-x snap-mandatory justify-start gap-4 pr-4 md:justify-center">
          {collections.slice(0, 6).map((collection) => {
            const cardImage = shopBySectionImages[collection.slug];
            return (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group w-[170px] flex-none snap-start sm:w-[185px] md:w-[250px]"
              >
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <div className="relative aspect-[3/4] bg-neutral-100">
                    {cardImage ? (
                      <Image
                        src={cardImage.src}
                        alt={cardImage.alt}
                        fill
                        sizes="(min-width: 768px) 200px, 170px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${collection.accentClass}`}
                      />
                    )}
                  </div>
                </div>
                <p className="mt-2 inline-flex items-center gap-1 text-sm font-normal uppercase tracking-[0.08em] text-neutral-900 underline-offset-4 group-hover:underline">
                  <span>{collection.title}</span>
                  <ArrowRightIcon className="h-4 w-4 shrink-0" />
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductCarouselRail({
  title,
  subtitle,
  products,
  href,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  href: string;
}) {
  return (
    <section className="mx-auto mt-10 max-w-(--breakpoint-2xl) px-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
            {subtitle}
          </p>
          <h2 className="mt-1 text-3xl font-semibold text-neutral-900">{title}</h2>
        </div>
        <Link
          href={href}
          className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
        >
          Tout voir
        </Link>
      </div>
      <div className="scrollbar-hide mt-5 w-full overflow-x-auto pb-2">
        <ul className="flex min-w-max gap-4 snap-x snap-mandatory pr-4 [&>li]:w-[260px] [&>li]:shrink-0 [&>li]:snap-start md:[&>li]:w-[320px]">
          <ProductGridItems products={products} />
        </ul>
      </div>
    </section>
  );
}

export function FullWidthFeatureSection({
  imageUrl,
  imageAlt,
  eyebrow,
  title,
  ctaLabel,
  ctaHref,
  textAlign = "left",
}: {
  imageUrl?: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  textAlign?: "left" | "right";
}) {
  const isRight = textAlign === "right";
  const commaIndex = title.indexOf(",");
  const titleFirstLine =
    commaIndex >= 0 ? title.slice(0, commaIndex + 1) : title;
  const titleSecondLine =
    commaIndex >= 0 ? title.slice(commaIndex + 1).trim() : null;

  return (
    <section className="relative mt-10 h-[60vh] w-screen bg-neutral-900 lg:h-[70vh]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover opacity-95"
        />
      ) : null}
      <div className="absolute inset-0 bg-black/35" />
      <div
        className={`relative flex h-full items-start p-8 text-white md:p-12 ${
          isRight ? "justify-end text-right" : "text-left"
        }`}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/80">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-4xl md:text-6xl">
            {titleFirstLine}
            {titleSecondLine ? (
              <>
                <br />
                {titleSecondLine}
              </>
            ) : null}
          </h3>
          <div className={`mt-6 md:mt-10 ${isRight ? "flex justify-end" : ""}`}>
            <Link
              href={ctaHref}
              className="inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LifestyleSection({
  chambreProducts,
  salleAMangerProducts,
  chaisesLoungeProducts,
}: {
  chambreProducts: Product[];
  salleAMangerProducts: Product[];
  chaisesLoungeProducts: Product[];
}) {
  return (
    <section className="mx-auto mt-10 max-w-(--breakpoint-2xl) px-4">
      {/* <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
            Style en situation
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-neutral-900">
            Le beau, au quotidien.
          </h2>
        </div>
        <Link
          href="/inspirations"
          className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
        >
          Voir plus d’inspirations
        </Link>
      </div> */}

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Link
          href="/collections/chambre"
          className="group relative min-h-[320px] overflow-hidden rounded-xl bg-neutral-100 lg:col-span-2 lg:min-h-[520px]"
        >
          {chambreProducts[0]?.featuredImage?.url ? (
            <Image
              src={chambreProducts[0].featuredImage.url}
              alt={chambreProducts[0].title}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="relative p-6 text-white">
            <p className="text-xl font-semibold">Chambre</p>
            <p className="mt-1 text-xs text-white/85">
              Textures, lumière douce, équilibre.
            </p>
          </div>
        </Link>

        <div className="grid gap-4">
          <Link
            href="/collections/salle-a-manger"
            className="group relative min-h-[220px] overflow-hidden rounded-xl bg-neutral-100 lg:min-h-[250px]"
          >
            {salleAMangerProducts[0]?.featuredImage?.url ? (
              <Image
                src={salleAMangerProducts[0].featuredImage.url}
                alt={salleAMangerProducts[0].title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="relative p-6 text-white">
              <p className="text-xl font-semibold">Salle à manger</p>
              <p className="mt-1 text-xs text-white/85">Recevoir, sans effort.</p>
            </div>
          </Link>

          <Link
            href="/collections/chaises-lounge"
            className="group relative min-h-[220px] overflow-hidden rounded-xl bg-neutral-100 lg:min-h-[250px]"
          >
            {chaisesLoungeProducts[0]?.featuredImage?.url ? (
              <Image
                src={chaisesLoungeProducts[0].featuredImage.url}
                alt={chaisesLoungeProducts[0].title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="relative p-6 text-white">
              <p className="text-xl font-semibold">Lounge</p>
              <p className="mt-1 text-xs text-white/85">
                Assises iconiques, confort moderne.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
