import { GridTileImage } from "components/grid/tile";
import { getAccountContext } from "lib/account";
import { buildRecommendations } from "lib/recommendations";
import { getStorefrontCustomerOrders } from "lib/shopify/customer-orders";
import Link from "next/link";

export const metadata = {
  title: "Recommandations",
  description: "Recommandations basées sur vos achats passés.",
};

export default async function RecommendationsPage() {
  const account = await getAccountContext();
  if (!account) {
    return (
      <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        Impossible de charger vos recommandations pour le moment. Veuillez vous
        reconnecter.
      </p>
    );
  }

  if (!account.adminConfigured || !account.shopifyCustomerId) {
    return (
      <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        Les recommandations seront disponibles dès que vous aurez une première
        commande.
      </p>
    );
  }

  const orders = await getStorefrontCustomerOrders(account.shopifyCustomerId, {
    first: 20,
  });
  const products = await buildRecommendations(orders, { limit: 12 });

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        Pas encore de suggestion personnalisée. Explorez le{" "}
        <Link href="/search" className="underline">
          catalogue complet
        </Link>{" "}
        pour démarrer.
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-neutral-600">
        Sélectionnés à partir de vos commandes précédentes.
      </p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id} className="aspect-square">
            <Link
              href={`/product/${product.handle}`}
              prefetch
              className="relative block h-full w-full"
            >
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
