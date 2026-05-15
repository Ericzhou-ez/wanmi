export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Cart = Omit<ShopifyCart, "lines"> & {
  lines: CartItem[];
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    image: Image | null;
    product: CartProduct;
  };
};

export type Collection = ShopifyCollection & {
  path: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = Omit<ShopifyProduct, "variants" | "images"> & {
  variants: ProductVariant[];
  images: Image[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image: Image | null;
  price: Money;
  compareAtPrice: Money | null;
};

export type SEO = {
  title: string;
  description: string;
};

export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyCollectionOperation = {
  data: {
    collection: ShopifyCollection;
  };
  variables: {
    handle: string;
  };
};

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollectionProductsByIdOperation = {
  data: {
    node: {
      products: Connection<ShopifyProduct>;
    } | null;
  };
  variables: {
    id: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCustomer = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ShopifyFindCustomerByEmailOperation = {
  data: {
    customers: Connection<ShopifyCustomer>;
  };
  variables: {
    query: string;
  };
};

export type ShopifyCustomerCreateOperation = {
  data: {
    customerCreate: {
      customer: ShopifyCustomer | null;
      userErrors: { field?: string[] | null; message: string }[];
    };
  };
  variables: {
    input: {
      email: string;
      firstName?: string;
      lastName?: string;
      tags?: string[];
    };
  };
};

export type ShopifyOrderMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyOrderLineItem = {
  id: string;
  title: string;
  quantity: number;
  variant: {
    id: string | null;
    title: string | null;
    image: Image | null;
    product: {
      id: string;
      handle: string;
      title: string;
      tags: string[];
      productType: string | null;
      vendor: string | null;
    } | null;
  } | null;
};

export type ShopifyOrderReturn = {
  id: string;
  name: string | null;
  status: string;
};

export type ShopifyReturnableFulfillmentLine = {
  quantity: number;
  fulfillmentLineItem: {
    id: string;
    lineItem: {
      id: string;
      title: string;
      quantity: number;
    };
  };
};

export type ShopifyReturnableFulfillment = {
  id: string;
  returnableFulfillmentLineItems: Connection<ShopifyReturnableFulfillmentLine>;
};

export type ShopifyOrder = {
  id: string;
  name: string;
  processedAt: string;
  displayFinancialStatus: string | null;
  displayFulfillmentStatus: string | null;
  currentTotalPriceSet: {
    shopMoney: ShopifyOrderMoney;
  };
  lineItems: Connection<ShopifyOrderLineItem>;
  returnableFulfillments: Connection<ShopifyReturnableFulfillment>;
  returns: Connection<ShopifyOrderReturn>;
};

export type ShopifyCustomerOrdersOperation = {
  data: {
    customer:
      | (ShopifyCustomer & {
          orders: Connection<ShopifyOrder>;
        })
      | null;
  };
  variables: {
    customerId: string;
    first?: number;
  };
};

export type ShopifyReturnRequestLineItem = {
  fulfillmentLineItemId: string;
  quantity: number;
  returnReason: string;
  returnReasonNote?: string;
};

export type ShopifyReturnRequestOperation = {
  data: {
    returnRequest: {
      return: {
        id: string;
        name: string | null;
        status: string;
      } | null;
      userErrors: { field?: string[] | null; message: string }[];
    };
  };
  variables: {
    input: {
      orderId: string;
      returnLineItems: ShopifyReturnRequestLineItem[];
    };
  };
};
