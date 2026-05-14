"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "lib/utils";
import type { ProductImage } from "types/product";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const activeImage = images[activeIndex];

  return (
    <div className="flex h-full gap-3">
      {hasMultiple && (
        <div className="hidden w-[72px] flex-none flex-col gap-2 overflow-y-auto scrollbar-hide lg:flex">
          {images.map((image, idx) => (
            <button
              key={image.src}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-square w-full flex-none overflow-hidden rounded-md border-2 transition-colors",
                idx === activeIndex
                  ? "border-neutral-900"
                  : "border-transparent hover:border-neutral-300",
              )}
            >
              <Image
                src={image.src}
                alt={image.altText || ""}
                fill
                sizes="72px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-50">
          {activeImage && (
            <Image
              src={activeImage.src}
              alt={activeImage.altText || ""}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
              priority
            />
          )}
        </div>

        {hasMultiple && (
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide lg:hidden">
            {images.map((image, idx) => (
              <button
                key={image.src}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative h-16 w-16 flex-none overflow-hidden rounded-md border-2 transition-colors",
                  idx === activeIndex
                    ? "border-neutral-900"
                    : "border-transparent hover:border-neutral-300",
                )}
              >
                <Image
                  src={image.src}
                  alt={image.altText || ""}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
