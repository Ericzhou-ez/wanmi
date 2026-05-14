import "server-only";

import { isAdminConfigured, shopifyAdminFetch } from "./admin";
import { customerCreateMutation } from "./mutations/customer";
import { findCustomerByEmailQuery } from "./queries/customer";
import type {
  ShopifyCustomer,
  ShopifyCustomerCreateOperation,
  ShopifyFindCustomerByEmailOperation,
} from "./types";
import type { CustomerSyncResult } from "types/shopify-admin";

function splitName(name?: string | null) {
  if (!name) return { firstName: undefined, lastName: undefined };
  const trimmed = name.trim();
  if (!trimmed) return { firstName: undefined, lastName: undefined };
  const parts = trimmed.split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;
  return { firstName, lastName };
}

export async function findShopifyCustomerByEmail(
  email: string,
): Promise<ShopifyCustomer | null> {
  if (!isAdminConfigured) return null;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return null;

  const data = await shopifyAdminFetch<
    ShopifyFindCustomerByEmailOperation["data"],
    ShopifyFindCustomerByEmailOperation["variables"]
  >({
    query: findCustomerByEmailQuery,
    variables: { query: `email:${trimmed}` },
  });

  const node = data.customers.edges[0]?.node;
  return node ?? null;
}

export async function syncShopifyCustomer({
  email,
  name,
}: {
  email: string;
  name?: string;
}): Promise<CustomerSyncResult> {
  if (!isAdminConfigured) {
    return { customerId: null, customer: null, created: false };
  }

  const existing = await findShopifyCustomerByEmail(email);
  if (existing) {
    return { customerId: existing.id, customer: existing, created: false };
  }

  const { firstName, lastName } = splitName(name);

  const data = await shopifyAdminFetch<
    ShopifyCustomerCreateOperation["data"],
    ShopifyCustomerCreateOperation["variables"]
  >({
    query: customerCreateMutation,
    variables: {
      input: {
        email,
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
        tags: ["google-oauth", "wanmi-app"],
      },
    },
  });

  const errors = data.customerCreate.userErrors;
  if (errors.length > 0) {
    const message = errors.map((e) => e.message).join("; ");
    // If a customer was created in parallel, fall back to lookup.
    const refetched = await findShopifyCustomerByEmail(email);
    if (refetched) {
      return { customerId: refetched.id, customer: refetched, created: false };
    }
    throw new Error(`Shopify customerCreate failed: ${message}`);
  }

  const created = data.customerCreate.customer;
  if (!created) {
    throw new Error("Shopify customerCreate returned no customer");
  }
  return { customerId: created.id, customer: created, created: true };
}
