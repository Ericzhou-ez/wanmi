import Footer from "components/layout/footer";
import { ProductGallery } from "components/product/product-gallery";
import { ProductInfo } from "components/product/product-info";
import { ProductStickyNav } from "components/product/product-sticky-nav";
import { ProductRecommendations } from "components/product/product-recommendations";
import { WhyBuyFromWanmi } from "components/product/why-buy-from-wanmi";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getProduct } from "lib/shopify";
import { parseProductDescription } from "lib/parse-product-description";
import type { Image } from "lib/shopify/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const parsedDescription = parseProductDescription(
    product.descriptionHtml || "",
  );

  const images = product.images.map((image: Image) => ({
    src: image.url,
    altText: image.altText,
    width: image.width,
    height: image.height,
  }));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    ...(product.featuredImage?.url ? { image: product.featuredImage.url } : {}),
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Suspense fallback={null}>
        <ProductStickyNav product={product} />
      </Suspense>

      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-6">
        {/* Hero: Gallery (sticky) + Info (scrollable) */}
        <div
          id="product-hero"
          className="flex flex-col py-6 lg:flex-row lg:gap-10 lg:py-10"
        >
          {/* Left: Gallery – sticky on desktop */}
          <div className="w-full lg:w-[55%] xl:w-[58%]" id="apercu">
            <div className="lg:sticky lg:top-24">
              <ProductGallery images={images} />
            </div>
          </div>

          {/* Right: Product Info – scrolls naturally */}
          <div className="mt-6 w-full lg:mt-0 lg:w-[45%] xl:w-[42%]">
            <Suspense fallback={null}>
              <ProductInfo
                product={product}
                parsedDescription={parsedDescription}
              />
            </Suspense>
          </div>
        </div>

        {/* Recommendations */}
        <Suspense
          fallback={
            <div className="h-[400px] animate-pulse rounded-lg bg-neutral-50" />
          }
        >
          <ProductRecommendations productId={product.id} />
        </Suspense>

        {/* Delivery & returns info */}
        <section
          id="delivery-section"
          className="border-t border-neutral-200 py-10"
        >
          <h2 className="mb-6 text-2xl font-medium text-neutral-900">
            Livraisons & retours
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-neutral-200 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <svg className="h-5 w-5 text-neutral-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-neutral-900">
                Livraison gratuite
              </h3>
              <p className="text-sm text-neutral-600">
                Livraison standard gratuite sur toutes les commandes en France
                métropolitaine.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <svg className="h-5 w-5 text-neutral-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-neutral-900">
                Retours sous 30 jours
              </h3>
              <p className="text-sm text-neutral-600">
                Retournez gratuitement tout article sous 30 jours après
                réception. Remboursement complet garanti.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <svg className="h-5 w-5 text-neutral-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-neutral-900">
                Paiement sécurisé
              </h3>
              <p className="text-sm text-neutral-600">
                Transactions cryptées SSL. Paiement par carte, PayPal ou en 3×
                sans frais.
              </p>
            </div>
          </div>
        </section>
      </div>

      <WhyBuyFromWanmi />
      <Footer />
    </>
  );
}
