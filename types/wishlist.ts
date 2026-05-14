export type WishlistItem = {
  productId: string;
  handle: string;
  title: string;
  image: string;
  price: string;
  currencyCode: string;
  addedAt: number;
};

export type WishlistContextType = {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
};
