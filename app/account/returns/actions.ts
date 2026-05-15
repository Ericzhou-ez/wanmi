"use server";

import { revalidatePath } from "next/cache";

import { getAccountContext } from "lib/account";
import { createReturnRequest } from "lib/shopify/admin/returns";
import { getCustomerOrderById } from "lib/shopify/admin/orders";
import type { SubmitReturnState } from "types/account";
import type { CreateReturnInput } from "types/shopify-admin";

export async function submitReturnRequest(
  _prev: SubmitReturnState,
  formData: FormData,
): Promise<SubmitReturnState> {
  const account = await getAccountContext();
  if (!account?.shopifyCustomerId) {
    return { status: "error", message: "Vous n’êtes pas connecté." };
  }
  if (!account.adminConfigured) {
    return {
      status: "error",
      message: "L’API Admin Shopify n’est pas configurée.",
    };
  }

  const orderId = String(formData.get("orderId") || "");
  if (!orderId) {
    return { status: "error", message: "Commande manquante." };
  }

  // Make sure the order belongs to the signed-in customer.
  const order = await getCustomerOrderById(account.shopifyCustomerId, orderId);
  if (!order) {
    return { status: "error", message: "Commande introuvable." };
  }

  const reason = String(formData.get("reason") || "OTHER").toUpperCase();
  const note = String(formData.get("note") || "").trim() || undefined;

  const allowedFlIds = new Set(
    order.returnableFulfillments.flatMap((f) =>
      f.lines.map((l) => l.fulfillmentLineItemId),
    ),
  );

  const lines: CreateReturnInput["lines"] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("qty:")) continue;
    const fulfillmentLineItemId = key.slice("qty:".length);
    if (!allowedFlIds.has(fulfillmentLineItemId)) continue;
    const qty = Number(value);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    lines.push({
      fulfillmentLineItemId,
      quantity: qty,
      returnReason: reason,
      ...(note ? { returnReasonNote: note } : {}),
    });
  }

  if (lines.length === 0) {
    return {
      status: "error",
      message: "Sélectionnez au moins un article à retourner.",
    };
  }

  try {
    const result = await createReturnRequest({ orderId, lines });
    if (result.errors.length > 0) {
      return {
        status: "error",
        message: result.errors.join(" "),
      };
    }
    revalidatePath("/account/returns");
    revalidatePath("/account/orders");
    return {
      status: "success",
      message: `Demande de retour envoyée.`,
      returnName: result.returnName,
    };
  } catch (e) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "Erreur inattendue.",
    };
  }
}
