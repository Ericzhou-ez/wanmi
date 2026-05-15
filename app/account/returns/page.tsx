import Link from "next/link";

import { ReturnRequestForm } from "components/account/return-request-form";
import { getAccountContext } from "lib/account";
import { getCustomerOrders } from "lib/shopify/admin/orders";
import { RETURN_REASONS } from "lib/shopify/admin/returns";
import type { ReturnableLine } from "types/account";

export const metadata = {
  title: "Mes retours",
  description: "Gérer vos demandes de retour Wanmi.",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function ReturnsPage(props: {
  searchParams: Promise<{ order?: string }>;
}) {
  const account = await getAccountContext();
  if (!account) {
    return (
      <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        Impossible de charger vos retours pour le moment. Veuillez vous
        reconnecter.
      </p>
    );
  }
  const searchParams = await props.searchParams;

  if (!account.adminConfigured) {
    return (
      <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        Le centre de retours sera disponible après configuration de l’API Admin
        Shopify.
      </p>
    );
  }
  if (!account.shopifyCustomerId) {
    return (
      <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        Aucun client Shopify lié à votre adresse.
      </p>
    );
  }

  const orders = await getCustomerOrders(account.shopifyCustomerId, {
    first: 30,
  });

  const existingReturns = orders
    .flatMap((order) =>
      order.returns.map((ret) => ({
        ...ret,
        orderName: order.name,
        orderId: order.id,
        processedAt: order.processedAt,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime(),
    );

  const eligibleOrders = orders.filter((order) =>
    order.returnableFulfillments.some((f) => f.lines.length > 0),
  );

  const selectedOrderId = searchParams.order;
  const selectedOrder = selectedOrderId
    ? eligibleOrders.find((o) => o.id === selectedOrderId)
    : eligibleOrders[0];

  const returnableLines: ReturnableLine[] = selectedOrder
    ? Array.from(
        new Map(
          selectedOrder.returnableFulfillments
            .flatMap((f) => f.lines)
            .map((l) => [
              l.fulfillmentLineItemId,
              {
                fulfillmentLineItemId: l.fulfillmentLineItemId,
                lineItemId: l.lineItemId,
                title: l.title,
                availableQuantity: l.quantity,
              },
            ]),
        ).values(),
      )
    : [];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-neutral-900">
          Demandes de retour
        </h2>
        {existingReturns.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">
            Aucune demande de retour pour le moment.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {existingReturns.map((ret) => (
              <li
                key={ret.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-sm"
              >
                <div>
                  <p className="font-medium text-neutral-900">
                    {ret.name ?? ret.id}
                  </p>
                  <p className="text-neutral-600">
                    Commande {ret.orderName} ·{" "}
                    {dateFormatter.format(new Date(ret.processedAt))}
                  </p>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
                  {ret.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-neutral-900">
          Nouvelle demande
        </h2>

        {eligibleOrders.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">
            Aucune commande éligible au retour pour le moment. Consultez{" "}
            <Link className="underline" href="/aide/retours">
              nos conditions de retour
            </Link>
            .
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            <div className="flex flex-wrap gap-2">
              {eligibleOrders.map((order) => {
                const active = order.id === selectedOrder?.id;
                return (
                  <Link
                    key={order.id}
                    href={`/account/returns?order=${encodeURIComponent(order.id)}`}
                    className={
                      "rounded-xl border px-3 py-2 text-sm transition " +
                      (active
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50")
                    }
                  >
                    {order.name}
                  </Link>
                );
              })}
            </div>

            {selectedOrder && returnableLines.length > 0 ? (
              <ReturnRequestForm
                orderId={selectedOrder.id}
                orderName={selectedOrder.name}
                lines={returnableLines}
                reasons={RETURN_REASONS}
              />
            ) : (
              <p className="text-sm text-neutral-600">
                Aucun article retournable pour cette commande.
              </p>
            )}
          </div>
        )}

        <p className="mt-4 text-xs text-neutral-500">
          Plus d’informations sur{" "}
          <Link href="/aide/retours" className="underline">
            les conditions de retour
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
