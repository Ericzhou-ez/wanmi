"use client";

import Link from "next/link";
import { useWishlist } from "./wishlist-context";

export function WishlistButton() {
  const { itemCount } = useWishlist();

  return (
    <Link
      href="/favoris"
      aria-label={`Favoris${itemCount > 0 ? ` (${itemCount})` : ""}`}
      title="Favoris"
      className="relative hidden h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:bg-neutral-50 md:flex"
    >
      <i className="ph-heart ph-sm text-neutral-900" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
