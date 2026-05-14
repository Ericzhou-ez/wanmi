export type AccountContext = {
  email: string;
  name: string | null;
  shopifyCustomerId: string | null;
  adminConfigured: boolean;
};

export type SubmitReturnState = {
  status: "idle" | "success" | "error";
  message?: string;
  returnName?: string | null;
};

export type ReturnableLine = {
  fulfillmentLineItemId: string;
  lineItemId: string;
  title: string;
  availableQuantity: number;
};

export type ReturnReasonOption = {
  value: string;
  label: string;
};
