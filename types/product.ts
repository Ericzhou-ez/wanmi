import type { Product, Money } from "lib/shopify/types";

export type ProductImage = {
  src: string;
  altText: string;
  width?: number;
  height?: number;
};

export type ParsedDescriptionSection = {
  title: string;
  content: string;
};

export type ParsedDescription = {
  description: ParsedDescriptionSection | null;
  weightAndDimensions: ParsedDescriptionSection | null;
  specifications: ParsedDescriptionSection | null;
};

export type ProductPriceInfo = {
  price: Money;
  compareAtPrice: Money | null;
  currencyCode: string;
};

export type ProductNavSection = {
  id: string;
  label: string;
};

export { type Product };
