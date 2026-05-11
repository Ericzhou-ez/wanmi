export interface ShopifyErrorLike {
  status: number;
  message: string;
  cause?: unknown;
}

export const isObject = (
  object: unknown,
): object is Record<string, unknown> => {
  return (
    typeof object === "object" && object !== null && !Array.isArray(object)
  );
};

export const isShopifyError = (error: unknown): error is ShopifyErrorLike => {
  if (!isObject(error)) return false;

  return typeof error.status === "number" && typeof error.message === "string";
};
