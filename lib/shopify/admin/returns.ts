import "server-only";

import { shopifyAdminFetch } from "../admin";
import { returnRequestMutation } from "../mutations/return";
import type { ShopifyReturnRequestOperation } from "../types";
import type { ReturnReasonOption } from "types/account";
import type {
  CreateReturnInput,
  CreateReturnResult,
} from "types/shopify-admin";

export async function createReturnRequest(
  input: CreateReturnInput,
): Promise<CreateReturnResult> {
  if (!input.lines.length) {
    return {
      returnId: null,
      returnName: null,
      status: null,
      errors: ["Aucun article sélectionné."],
    };
  }

  const data = await shopifyAdminFetch<
    ShopifyReturnRequestOperation["data"],
    ShopifyReturnRequestOperation["variables"]
  >({
    query: returnRequestMutation,
    variables: {
      input: {
        orderId: input.orderId,
        returnLineItems: input.lines,
      },
    },
  });

  const errors = data.returnRequest.userErrors.map((e) => e.message);
  const ret = data.returnRequest.return;

  return {
    returnId: ret?.id ?? null,
    returnName: ret?.name ?? null,
    status: ret?.status ?? null,
    errors,
  };
}

export const RETURN_REASONS: ReturnReasonOption[] = [
  { value: "DEFECTIVE", label: "Défectueux" },
  { value: "WRONG_ITEM", label: "Mauvais article" },
  { value: "NOT_AS_DESCRIBED", label: "Non conforme à la description" },
  { value: "SIZE_TOO_SMALL", label: "Taille trop petite" },
  { value: "SIZE_TOO_LARGE", label: "Taille trop grande" },
  { value: "STYLE", label: "Style ne convient pas" },
  { value: "COLOR", label: "Couleur non attendue" },
  { value: "UNKNOWN", label: "Autre" },
  { value: "OTHER", label: "Autre raison" },
];
