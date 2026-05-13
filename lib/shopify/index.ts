import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "lib/constants";
import { isShopifyError } from "lib/type-guards";
import { ensureStartsWith } from "lib/utils";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidateTag,
} from "next/cache";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";
import { getCartQuery } from "./queries/cart";
import {
  getCollectionProductsQuery,
  getCollectionProductsByIdQuery,
  getCollectionQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import { getPageQuery, getPagesQuery } from "./queries/page";
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
} from "./queries/product";
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionProductsByIdOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
} from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = domain ? `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}` : "";
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

const logRecoverableShopifyFailure = (
  context: string,
  error: unknown,
  fallbackLabel: string,
) => {
  console.warn(
    `[shopify] ${context} failed (${toErrorMessage(error)}). Returning ${fallbackLabel}.`,
  );
};

export async function shopifyFetch<T>({
  headers,
  query,
  variables,
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    if (!endpoint) {
      throw new Error("SHOPIFY_STORE_DOMAIN environment variable is not set");
    }

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    });

    const responseText = await result.text();
    let body: unknown;
    try {
      body = responseText ? JSON.parse(responseText) : null;
    } catch {
      body = responseText;
    }

    if (!result.ok) {
      const hint =
        result.status === 401
          ? " (Unauthorized: check SHOPIFY_STOREFRONT_ACCESS_TOKEN)"
          : "";
      throw new Error(
        `Shopify HTTP ${result.status} ${result.statusText}${hint}`,
        {
          cause: body,
        },
      );
    }

    if (
      typeof body === "object" &&
      body !== null &&
      "errors" in body &&
      Array.isArray((body as { errors?: unknown }).errors)
    ) {
      // Shopify returns GraphQL errors as plain objects; normalize to an Error
      // so Next.js can render/log it without redacting the payload.
      const first = (body as { errors: any[] }).errors[0];
      const message =
        typeof first?.message === "string"
          ? first.message
          : "Shopify GraphQL error";
      throw new Error(message, { cause: first });
    }

    return {
      status: result.status,
      body: body as T,
    };
  } catch (e) {
    // IMPORTANT: Always throw an Error instance (not a plain object), otherwise
    // Next.js redacts it in cached/server environments and you lose the details.
    if (isShopifyError(e)) {
      const err = new Error(
        `Shopify request failed (${e.status || 500}): ${e.message}`,
        { cause: e.cause },
      );
      (err as Error & { query?: string; status?: number }).query = query;
      (err as Error & { query?: string; status?: number }).status =
        e.status || 500;
      throw err;
    }

    const unknownErr = e instanceof Error ? e : new Error(String(e));
    const wrapped = new Error(`Shopify request failed: ${unknownErr.message}`, {
      cause: unknownErr,
    });
    (wrapped as Error & { query?: string }).query = query;
    throw wrapped;
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
};

const reshapeCollection = (
  collection: ShopifyCollection,
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  "use cache: private";
  cacheTag(TAGS.cart);
  cacheLife("seconds");

  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: {
      handle,
    },
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    console.log(
      `Skipping getCollectionProducts for '${collection}' - Shopify not configured`,
    );
    return [];
  }

  let res: { status: number; body: ShopifyCollectionProductsOperation };
  try {
    res = await shopifyFetch<ShopifyCollectionProductsOperation>({
      query: getCollectionProductsQuery,
      variables: {
        handle: collection,
        reverse,
        sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
      },
    });
  } catch (e) {
    logRecoverableShopifyFailure(
      `getCollectionProducts('${collection}')`,
      e,
      "an empty list",
    );
    return [];
  }

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products),
  );
}

export async function getCollectionProductsById({
  id,
  reverse,
  sortKey,
}: {
  id: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    console.log(
      `Skipping getCollectionProductsById for '${id}' - Shopify not configured`,
    );
    return [];
  }

  let res: { status: number; body: ShopifyCollectionProductsByIdOperation };
  try {
    res = await shopifyFetch<ShopifyCollectionProductsByIdOperation>({
      query: getCollectionProductsByIdQuery,
      variables: {
        id,
        reverse,
        sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
      },
    });
  } catch (e) {
    logRecoverableShopifyFailure(
      `getCollectionProductsById('${id}')`,
      e,
      "an empty list",
    );
    return [];
  }

  if (!res.body.data.node) {
    console.log(`No collection found for id \`${id}\``);
    return [];
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.node.products));
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  if (!endpoint) {
    console.log("Skipping getCollections - Shopify not configured");
    return [
      {
        handle: "",
        title: "Tout",
        description: "Tous les produits",
        seo: {
          title: "Tout",
          description: "Tous les produits",
        },
        path: "/search",
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  let res: { status: number; body: ShopifyCollectionsOperation };
  try {
    res = await shopifyFetch<ShopifyCollectionsOperation>({
      query: getCollectionsQuery,
    });
  } catch (e) {
    logRecoverableShopifyFailure(
      "getCollections()",
      e,
      "the default collections",
    );
    return [
      {
        handle: "",
        title: "Tout",
        description: "Tous les produits",
        seo: {
          title: "Tout",
          description: "Tous les produits",
        },
        path: "/search",
        updatedAt: new Date().toISOString(),
      },
    ];
  }
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: "",
      title: "Tout",
      description: "Tous les produits",
      seo: {
        title: "Tout",
        description: "Tous les produits",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith("hidden"),
    ),
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  if (!endpoint) {
    console.log(`Skipping getMenu for '${handle}' - Shopify not configured`);
    return [];
  }

  let res: { status: number; body: ShopifyMenuOperation };
  try {
    res = await shopifyFetch<ShopifyMenuOperation>({
      query: getMenuQuery,
      variables: {
        handle,
      },
    });
  } catch (e) {
    logRecoverableShopifyFailure(
      `getMenu('${handle}')`,
      e,
      "an empty menu",
    );
    return [];
  }

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, "")
        .replace("/collections", "/search")
        .replace("/pages", ""),
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle },
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    console.log(`Skipping getProduct for '${handle}' - Shopify not configured`);
    return undefined;
  }

  let res: { status: number; body: ShopifyProductOperation };
  try {
    res = await shopifyFetch<ShopifyProductOperation>({
      query: getProductQuery,
      variables: {
        handle,
      },
    });
  } catch (e) {
    logRecoverableShopifyFailure(`getProduct('${handle}')`, e, "undefined");
    return undefined;
  }

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  let res: { status: number; body: ShopifyProductRecommendationsOperation };
  try {
    res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
      query: getProductRecommendationsQuery,
      variables: {
        productId,
      },
    });
  } catch (e) {
    logRecoverableShopifyFailure(
      `getProductRecommendations('${productId}')`,
      e,
      "an empty list",
    );
    return [];
  }

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    console.log("Skipping getProducts - Shopify not configured");
    return [];
  }

  let res: { status: number; body: ShopifyProductsOperation };
  try {
    res = await shopifyFetch<ShopifyProductsOperation>({
      query: getProductsQuery,
      variables: {
        query,
        reverse,
        sortKey,
      },
    });
  } catch (e) {
    logRecoverableShopifyFailure(
      "getProducts()",
      e,
      "an empty list",
    );
    return [];
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];
  const topic = (await headers()).get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections, "seconds");
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products, "seconds");
  }

  return NextResponse.json({
    status: 200,
    revalidated: true,
    now: Date.now(),
  });
}
