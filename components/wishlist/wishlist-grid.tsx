"use client";

import Image from "next/image";
import Link from "next/link";
import Price from "components/price";
import { useWishlist } from "./wishlist-context";

export function WishlistGrid() {
  const { items, removeItem } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          className="mb-4 h-16 w-16 text-neutral-300"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        <p className="text-lg font-medium text-neutral-600">
          Aucun favori pour le moment
        </p>
        <p className="mt-1 text-sm text-neutral-400">
          Parcourez nos collections et sauvegardez vos coups de cœur.
        </p>
        <Link
          href="/search"
          className="mt-6 rounded-md bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Découvrir nos produits
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.productId} className="group relative">
          <Link
            href={`/product/${item.handle}`}
            className="block overflow-hidden rounded-lg"
          >
            <div className="relative aspect-square bg-neutral-50">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-neutral-900 line-clamp-2">
                {item.title}
              </h3>
              <Price
                amount={item.price}
                currencyCode={item.currencyCode}
                className="mt-1 text-sm text-neutral-600"
                currencyCodeClassName="hidden"
              />
            </div>
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition-opacity hover:bg-white"
            aria-label="Retirer des favoris"
          >
            <svg
              className="h-4 w-4"
              fill="currentColor"
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
          </button>
        </div>
      ))}
    </div>
  );
}
