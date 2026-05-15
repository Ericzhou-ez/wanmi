"use client";

import type { ProductVariant } from "lib/shopify/types";
import { cn } from "lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProductImage } from "types/product";
import { useSelectedVariantImageIndex } from "./use-selected-variant";

export function ProductGallery({
   images,
   variants = [],
}: {
   images: ProductImage[];
   variants?: ProductVariant[];
}) {
   const selectedVariantImageIndex = useSelectedVariantImageIndex(
      images,
      variants,
   );
   const [activeIndex, setActiveIndex] = useState(selectedVariantImageIndex);
   const hasMultiple = images.length > 1;
   const showPreviousImage = () => {
      setActiveIndex((current) =>
         current === 0 ? images.length - 1 : current - 1,
      );
   };
   const showNextImage = () => {
      setActiveIndex((current) =>
         current + 1 >= images.length ? 0 : current + 1,
      );
   };

   useEffect(() => {
      setActiveIndex(selectedVariantImageIndex);
   }, [selectedVariantImageIndex]);

   return (
      <div data-product-gallery className="flex h-full gap-3">
         {hasMultiple && (
            <div
               data-product-gallery-desktop-thumbs
               className="hidden w-[72px] flex-none flex-col gap-2 overflow-y-auto scrollbar-hide lg:flex"
            >
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
               {images.map((image, idx) => (
                  <Image
                     key={image.src}
                     src={image.src}
                     alt={image.altText || ""}
                     fill
                     sizes="(min-width: 1024px) 50vw, 100vw"
                     className={cn(
                        "object-contain transition-all duration-500 ease-out",
                        idx === activeIndex
                           ? "scale-100 opacity-100"
                           : "scale-[0.985] opacity-0",
                     )}
                     priority={idx === activeIndex}
                  />
               ))}

               {hasMultiple && (
                  <div className="product-carousel-btns absolute z-10 flex items-center">
                     <button
                        type="button"
                        aria-label="Image précédente"
                        onClick={showPreviousImage}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/35 text-neutral-900 shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:bg-white/55"
                     >
                        <i className="ph-caret-left ph-lg" />
                     </button>
                     <button
                        type="button"
                        aria-label="Image suivante"
                        onClick={showNextImage}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/35 text-neutral-900 shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:bg-white/55"
                     >
                        <i className="ph-caret-right ph-lg" />
                     </button>
                  </div>
               )}
            </div>

            {hasMultiple && (
               <div
                  data-product-gallery-mobile-thumbs
                  className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide lg:hidden"
               >
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
