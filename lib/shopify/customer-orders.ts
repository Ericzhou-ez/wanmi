import "server-only";

import { shopifyFetch } from "lib/shopify";
import { getCustomerOrders as getAdminCustomerOrders } from "lib/shopify/admin/orders";
import { getStorefrontCustomerOrdersByCustomerIdQuery } from "lib/shopify/queries/customer";
import type {
  Connection,
  ShopifyStorefrontCustomerOrder,
  ShopifyStorefrontCustomerOrdersOperation,
} from "lib/shopify/types";
import type { CustomerOrder } from "types/shopify-admin";

const removeEdges = <T>(connection: Connection<T>): T[] =>
  connection.edges.map((edge) => edge.node);

function reshapeStorefrontOrder(
  order: ShopifyStorefrontCustomerOrder,
): CustomerOrder {
  return {
    id: order.id,
    name: order.name,
    processedAt: order.processedAt,
    displayFinancialStatus: order.financialStatus,
    displayFulfillmentStatus: order.fulfillmentStatus,
    currentTotalPriceSet: {
      shopMoney: order.currentTotalPrice,
    },
    lineItems: removeEdges(order.lineItems).map((line, index) => ({
      id: `${order.id}:line:${index}`,
      title: line.title,
      quantity: line.quantity,
      variant: line.variant
        ? {
            id: line.variant.id,
            title: line.variant.title,
            image: line.variant.image,
            product: line.variant.product,
          }
        : null,
    })),
    returnableFulfillments: [],
    returns: [],
  };
}

export async function getStorefrontCustomerOrders(
  customerId: string,
  options?: { first?: number },
): Promise<CustomerOrder[]> {
  const first = options?.first ?? 20;
  let storefrontOrders: CustomerOrder[] = [];

  try {
    const res = await shopifyFetch<ShopifyStorefrontCustomerOrdersOperation>({
      query: getStorefrontCustomerOrdersByCustomerIdQuery,
      variables: { customerId, first },
      cache: "no-store",
    });

    const customer = res.body.data.node;
    storefrontOrders = customer
      ? removeEdges(customer.orders).map(reshapeStorefrontOrder)
      : [];
  } catch (e) {
    console.warn(
      "[shopify] Storefront customer order lookup failed:",
      e instanceof Error ? e.message : String(e),
    );
  }

  if (storefrontOrders.length > 0) return storefrontOrders;

  try {
    return await getAdminCustomerOrders(customerId, { first });
  } catch (e) {
    console.warn(
      "[shopify] Admin customer order fallback failed:",
      e instanceof Error ? e.message : String(e),
    );
    return [];
  }
}
