import type { Cart, Product, ProductVariant } from "lib/shopify/types";

export type UpdateType = "plus" | "minus" | "delete";

export type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    };

export type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
};

export type MerchandiseSearchParams = {
  [key: string]: string;
};
