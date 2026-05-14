import "server-only";

import { shopifyAdminFetch } from "../admin";
import { getCustomerOrdersQuery } from "../queries/customer";
import type {
  Connection,
  ShopifyCustomerOrdersOperation,
  ShopifyOrder,
  ShopifyReturnableFulfillment,
  ShopifyReturnableFulfillmentLine,
} from "../types";
import type { CustomerOrder, CustomerReturnable } from "types/shopify-admin";

const removeEdges = <T>(connection: Connection<T>): T[] =>
  connection.edges.map((edge) => edge.node);

function reshapeReturnable(
  fulfillment: ShopifyReturnableFulfillment,
): CustomerReturnable {
  const lines: CustomerReturnable["lines"] = removeEdges(
    fulfillment.returnableFulfillmentLineItems,
  ).map((line: ShopifyReturnableFulfillmentLine) => ({
    quantity: line.quantity,
    fulfillmentLineItemId: line.fulfillmentLineItem.id,
    lineItemId: line.fulfillmentLineItem.lineItem.id,
    title: line.fulfillmentLineItem.lineItem.title,
    originalQuantity: line.fulfillmentLineItem.lineItem.quantity,
  }));
  return { id: fulfillment.id, lines };
}

function reshapeOrder(order: ShopifyOrder): CustomerOrder {
  return {
    ...order,
    lineItems: removeEdges(order.lineItems),
    returnableFulfillments: removeEdges(order.returnableFulfillments).map(
      reshapeReturnable,
    ),
    returns: removeEdges(order.returns),
  };
}

export async function getCustomerOrders(
  customerId: string,
  options?: { first?: number },
): Promise<CustomerOrder[]> {
  const data = await shopifyAdminFetch<
    ShopifyCustomerOrdersOperation["data"],
    ShopifyCustomerOrdersOperation["variables"]
  >({
    query: getCustomerOrdersQuery,
    variables: { customerId, first: options?.first ?? 20 },
  });

  if (!data.customer) return [];
  return removeEdges(data.customer.orders).map(reshapeOrder);
}

export async function getCustomerOrderById(
  customerId: string,
  orderId: string,
): Promise<CustomerOrder | undefined> {
  const orders = await getCustomerOrders(customerId, { first: 50 });
  return orders.find((order) => order.id === orderId);
}
