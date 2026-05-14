export interface ShopifyErrorLike {
  status: number;
  message: string;
  cause?: unknown;
}
