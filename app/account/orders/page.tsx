import Image from "next/image";
import Link from "next/link";

import { getAccountContext } from "lib/account";
import { formatPrice } from "lib/format-price";
import { getStorefrontCustomerOrders } from "lib/shopify/customer-orders";

export const metadata = {
  title: "Mes commandes",
  description: "Historique de vos commandes Wanmi.",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function OrdersPage() {
  const account = await getAccountContext();
  if (!account) {
    return (
      <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        Impossible de charger vos commandes pour le moment. Veuillez vous
        reconnecter.
      </p>
    );
  }

  if (!account.adminConfigured) {
    return (
      <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        Les commandes ne peuvent pas être chargées tant que l’API Admin Shopify
        n’est pas configurée.
      </p>
    );
  }

  if (!account.shopifyCustomerId) {
    return (
      <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        Aucun client Shopify lié à votre adresse {account.email}.
      </p>
    );
  }

  const orders = await getStorefrontCustomerOrders(account.shopifyCustomerId, {
    first: 30,
  });

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        Vous n’avez pas encore de commande.{" "}
        <Link href="/search" className="underline">
          Découvrir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li
          key={order.id}
          className="rounded-2xl border border-neutral-200 bg-white p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                Commande {order.name}
              </p>
              <p className="mt-1 text-sm text-neutral-700">
                {dateFormatter.format(new Date(order.processedAt))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold text-neutral-900">
                {formatPrice(
                  order.currentTotalPriceSet.shopMoney.amount,
                  order.currentTotalPriceSet.shopMoney.currencyCode,
                )}
              </p>
              <p className="mt-1 flex flex-wrap justify-end gap-2 text-xs">
                {order.displayFinancialStatus ? (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700">
                    {order.displayFinancialStatus}
                  </span>
                ) : null}
                {order.displayFulfillmentStatus ? (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700">
                    {order.displayFulfillmentStatus}
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {order.lineItems.slice(0, 6).map((line) => {
              const product = line.variant?.product;
              const image = line.variant?.image;
              const href = product?.handle
                ? `/product/${product.handle}`
                : null;
              const inner = (
                <div className="flex items-center gap-3 rounded-xl border border-neutral-100 p-2">
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={image.altText || line.title}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-md bg-neutral-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-neutral-900">
                      {line.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Quantité {line.quantity}
                    </p>
                  </div>
                </div>
              );
              return (
                <li key={line.id}>
                  {href ? (
                    <Link href={href} className="block hover:opacity-90">
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>

          {order.returns.length > 0 ? (
            <div className="mt-4 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-700">
              Retours associés:{" "}
              {order.returns
                .map((r) => `${r.name ?? r.id} (${r.status})`)
                .join(", ")}
            </div>
          ) : null}

          {order.returnableFulfillments.some((f) => f.lines.length > 0) ? (
            <div className="mt-4">
              <Link
                href={`/account/returns?order=${encodeURIComponent(order.id)}`}
                className="text-sm text-neutral-900 underline underline-offset-4"
              >
                Demander un retour
              </Link>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
