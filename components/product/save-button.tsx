"use client";

import { useWishlist } from "components/wishlist/wishlist-context";
import type { Product } from "lib/shopify/types";
import { cn } from "lib/utils";
import { toast } from "sonner";

export function SaveButton({
  product,
  className,
  iconOnly = false,
}: {
  product: Product;
  className?: string;
  iconOnly?: boolean;
}) {
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const saved = isInWishlist(product.id);

  const handleToggle = () => {
    if (saved) {
      removeItem(product.id);
      toast.success("Retiré des favoris");
    } else {
      addItem({
        productId: product.id,
        handle: product.handle,
        title: product.title,
        image: product.featuredImage?.url || "",
        price: product.priceRange.maxVariantPrice.amount,
        currencyCode: product.priceRange.maxVariantPrice.currencyCode,
        addedAt: Date.now(),
      });
      toast.success("Ajouté aux favoris");
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={cn(
        "flex items-center justify-center gap-2 transition-colors",
        className,
      )}
    >
      <svg
        className={cn("h-5 w-5 transition-colors", saved ? "text-red-500" : "text-neutral-500")}
        fill={saved ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
      {!iconOnly && (
        <span className="text-sm text-neutral-600">
          {saved ? "Enregistré" : "Enregistrer"}
        </span>
      )}
    </button>
  );
}
