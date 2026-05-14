import "server-only";

import { getProductRecommendations, getProducts } from "lib/shopify";
import type { Product } from "lib/shopify/types";
import type { PastOrderBasis } from "types/recommendations";
import type { CustomerOrder } from "types/shopify-admin";

export function extractRecommendationBasis(
  orders: CustomerOrder[],
): PastOrderBasis {
  const productIds: string[] = [];
  const tags = new Set<string>();
  const vendors = new Set<string>();
  for (const order of orders) {
    for (const line of order.lineItems) {
      const product = line.variant?.product;
      if (!product) continue;
      if (product.id && !productIds.includes(product.id)) {
        productIds.push(product.id);
      }
      product.tags?.forEach((tag) => tags.add(tag));
      if (product.vendor) vendors.add(product.vendor);
    }
  }
  return {
    productIds,
    tags: Array.from(tags),
    vendors: Array.from(vendors),
  };
}

export async function buildRecommendations(
  orders: CustomerOrder[],
  options?: { limit?: number },
): Promise<Product[]> {
  const limit = options?.limit ?? 12;
  const basis = extractRecommendationBasis(orders);
  if (basis.productIds.length === 0) return [];

  const purchasedIds = new Set(basis.productIds);
  const dedup = new Map<string, Product>();

  // 1) Use Shopify productRecommendations from up to 3 recent purchases.
  const recentSeeds = basis.productIds.slice(0, 3);
  const recoLists = await Promise.all(
    recentSeeds.map(async (id) => {
      try {
        return await getProductRecommendations(id);
      } catch {
        return [] as Product[];
      }
    }),
  );

  for (const list of recoLists) {
    for (const product of list) {
      if (purchasedIds.has(product.id)) continue;
      if (!product.availableForSale) continue;
      if (!dedup.has(product.id)) dedup.set(product.id, product);
      if (dedup.size >= limit) break;
    }
    if (dedup.size >= limit) break;
  }

  // 2) Fallback: search by top vendor/tag to fill remaining slots.
  if (dedup.size < limit) {
    const queryParts: string[] = [];
    if (basis.vendors[0]) queryParts.push(`vendor:${basis.vendors[0]}`);
    if (basis.tags[0]) queryParts.push(`tag:${basis.tags[0]}`);
    const query = queryParts.join(" OR ");

    if (query) {
      try {
        const more = await getProducts({ query });
        for (const product of more) {
          if (purchasedIds.has(product.id)) continue;
          if (!product.availableForSale) continue;
          if (!dedup.has(product.id)) dedup.set(product.id, product);
          if (dedup.size >= limit) break;
        }
      } catch {
        // ignore fallback errors
      }
    }
  }

  return Array.from(dedup.values()).slice(0, limit);
}
