import "server-only";

import { auth } from "lib/auth";
import { isAdminConfigured } from "lib/shopify/admin";
import { syncShopifyCustomer } from "lib/shopify/customer-sync";
import type { AccountContext } from "types/account";

export async function getAccountContext(): Promise<AccountContext | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.email) return null;

  let shopifyCustomerId = user.shopifyCustomerId ?? null;

  // Lazily re-sync if missing (e.g. admin token was added after sign-in).
  if (!shopifyCustomerId && isAdminConfigured) {
    try {
      const result = await syncShopifyCustomer({
        email: user.email,
        name: user.name ?? undefined,
      });
      shopifyCustomerId = result.customerId;
    } catch (e) {
      console.warn(
        "[account] Lazy customer sync failed:",
        e instanceof Error ? e.message : String(e),
      );
    }
  }

  return {
    email: user.email,
    name: user.name ?? null,
    shopifyCustomerId,
    adminConfigured: isAdminConfigured,
  };
}
