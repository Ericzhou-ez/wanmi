import "server-only";

import { shopifyAdminFetch } from "../admin";
import {
  getCustomerOrdersBySearchQuery,
  getCustomerOrdersQuery,
} from "../queries/customer";
import type {
  Connection,
  ShopifyCustomerOrdersBySearchOperation,
  ShopifyCustomerOrdersOperation,
  ShopifyOrder,
  ShopifyReturnableFulfillment,
  ShopifyReturnableFulfillmentLine,
} from "../types";
import type { CustomerOrder, CustomerReturnable } from "types/shopify-admin";

const removeEdges = <T>(connection: Connection<T>): T[] =>
  connection.edges.map((edge) => edge.node);

function quoteSearchValue(value: string): string {
  return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

function legacyCustomerIdFromGid(customerId: string): string | null {
  return customerId.match(/\/Customer\/(\d+)$/)?.[1] ?? null;
}

function uniqueOrders(orders: CustomerOrder[]): CustomerOrder[] {
  const seen = new Set<string>();
  return orders.filter((order) => {
    if (seen.has(order.id)) return false;
    seen.add(order.id);
    return true;
  });
}

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

export async function getCustomerOrdersByIdentity(
  {
    customerId,
    email,
  }: {
    customerId: string;
    email: string;
  },
  options?: { first?: number },
): Promise<CustomerOrder[]> {
  const first = options?.first ?? 20;
  const searchParts: string[] = [];
  const legacyCustomerId = legacyCustomerIdFromGid(customerId);

  if (legacyCustomerId) {
    searchParts.push(`customer_id:${legacyCustomerId}`);
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail) {
    searchParts.push(`email:${quoteSearchValue(normalizedEmail)}`);
  }

  if (searchParts.length === 0) return [];

  const data = await shopifyAdminFetch<
    ShopifyCustomerOrdersBySearchOperation["data"],
    ShopifyCustomerOrdersBySearchOperation["variables"]
  >({
    query: getCustomerOrdersBySearchQuery,
    variables: { query: searchParts.join(" OR "), first },
  });

  const searchedOrders = uniqueOrders(
    removeEdges(data.orders).map(reshapeOrder),
  );
  if (searchedOrders.length > 0) return searchedOrders;

  return getCustomerOrders(customerId, { first });
}

export async function getCustomerOrderById(
  customerId: string,
  orderId: string,
): Promise<CustomerOrder | undefined> {
  const orders = await getCustomerOrders(customerId, { first: 50 });
  return orders.find((order) => order.id === orderId);
}
