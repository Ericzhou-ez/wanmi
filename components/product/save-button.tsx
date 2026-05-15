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
      <i
        className={cn(
          "ph-lg transition-colors",
          saved ? "ph-heart-fill text-red-500" : "ph-heart text-neutral-500",
        )}
      />
      {!iconOnly && (
        <span className="text-sm text-neutral-600">
          {saved ? "Enregistré" : "Enregistrer"}
        </span>
      )}
    </button>
  );
}
