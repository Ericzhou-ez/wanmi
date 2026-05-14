import type {
  ShopifyCustomer,
  ShopifyOrder,
  ShopifyOrderLineItem,
  ShopifyOrderReturn,
  ShopifyReturnRequestLineItem,
} from "lib/shopify/types";

export type CustomerOrderLine = ShopifyOrderLineItem;

export type CustomerReturnable = {
  id: string;
  lines: {
    quantity: number;
    fulfillmentLineItemId: string;
    title: string;
    originalQuantity: number;
    lineItemId: string;
  }[];
};

export type CustomerOrder = Omit<
  ShopifyOrder,
  "lineItems" | "returnableFulfillments" | "returns"
> & {
  lineItems: CustomerOrderLine[];
  returnableFulfillments: CustomerReturnable[];
  returns: ShopifyOrderReturn[];
};

export type CreateReturnInput = {
  orderId: string;
  lines: ShopifyReturnRequestLineItem[];
};

export type CreateReturnResult = {
  returnId: string | null;
  returnName: string | null;
  status: string | null;
  errors: string[];
};

export type CustomerSyncResult = {
  customerId: string | null;
  customer: ShopifyCustomer | null;
  created: boolean;
};
