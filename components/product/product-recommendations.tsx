import { GridTileImage } from "components/grid/tile";
import { getProductRecommendations } from "lib/shopify";
import type { Product } from "lib/shopify/types";
import Link from "next/link";

function ProductCarousel({
  title,
  products,
  id,
}: {
  title: string;
  products: Product[];
  id: string;
}) {
  if (products.length === 0) return null;

  return (
    <section id={id} className="py-10">
      <h2 className="mb-6 text-2xl font-medium text-neutral-900">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.handle}
            className="w-[220px] flex-none sm:w-[250px] md:w-[280px]"
          >
            <Link
              href={`/product/${product.handle}`}
              className="group block"
              prefetch={true}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <GridTileImage
                  alt={product.title}
                  src={product.featuredImage?.url}
                  fill
                  sizes="280px"
                  label={{
                    title: product.title,
                    amount: product.priceRange.maxVariantPrice.amount,
                    currencyCode:
                      product.priceRange.maxVariantPrice.currencyCode,
                  }}
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function ProductRecommendations({
  productId,
}: {
  productId: string;
}) {
  const recommendations = await getProductRecommendations(productId);

  if (recommendations.length === 0) return null;

  const midpoint = Math.ceil(recommendations.length / 2);
  const goesWellWith = recommendations.slice(0, midpoint);
  const youMightLike = recommendations.slice(midpoint);

  return (
    <div id="recommendations-section">
      <ProductCarousel
        id="goes-well-with"
        title="Va bien avec"
        products={goesWellWith}
      />
      {youMightLike.length > 0 && (
        <ProductCarousel
          id="you-might-like"
          title="Vous pourriez aussi aimer"
          products={youMightLike}
        />
      )}
    </div>
  );
}
