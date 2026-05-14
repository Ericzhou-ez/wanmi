import "server-only";

import { ensureStartsWith } from "lib/utils";

const ADMIN_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || "2024-10";

const adminDomain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";

const adminEndpoint = adminDomain
  ? `${adminDomain}/admin/api/${ADMIN_API_VERSION}/graphql.json`
  : "";

const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

export const isAdminConfigured = Boolean(adminEndpoint && adminToken);

type AdminFetchArgs<TVariables> = {
  query: string;
  variables?: TVariables;
  cache?: RequestCache;
  tags?: string[];
};

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export async function shopifyAdminFetch<TData, TVariables = unknown>({
  query,
  variables,
  cache = "no-store",
  tags,
}: AdminFetchArgs<TVariables>): Promise<TData> {
  if (!isAdminConfigured) {
    throw new Error(
      "Shopify Admin API is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN.",
    );
  }

  const response = await fetch(adminEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken!,
    },
    body: JSON.stringify({
      query,
      ...(variables ? { variables } : {}),
    }),
    cache,
    ...(tags ? { next: { tags } } : {}),
  });

  const text = await response.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    const hint =
      response.status === 401
        ? " (Unauthorized: check SHOPIFY_ADMIN_ACCESS_TOKEN)"
        : "";
    throw new Error(
      `Shopify Admin HTTP ${response.status} ${response.statusText}${hint}`,
      { cause: body },
    );
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "errors" in body &&
    Array.isArray((body as { errors?: unknown }).errors)
  ) {
    const first = (body as { errors: { message?: string }[] }).errors[0];
    throw new Error(
      typeof first?.message === "string"
        ? first.message
        : "Shopify Admin GraphQL error",
      { cause: first },
    );
  }

  const data = (body as { data?: TData })?.data;
  if (!data) {
    throw new Error("Shopify Admin response missing data field", {
      cause: body,
    });
  }
  return data;
}

export const adminErrorMessage = toErrorMessage;
