"use client";

import type { Product, ProductOption, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { ProductImage } from "types/product";

function getOptionKey(name: string) {
  return name.toLowerCase();
}

function getDefaultVariant(variants: ProductVariant[]) {
  return variants.find((variant) => variant.availableForSale) ?? variants[0];
}

export function getSelectedOptionsFromSearchParams({
  variants,
  options,
  searchParams,
}: {
  variants: ProductVariant[];
  options?: ProductOption[];
  searchParams: URLSearchParams;
}): Record<string, string> {
  const defaultVariant = getDefaultVariant(variants);
  const selectedOptions = Object.fromEntries(
    defaultVariant?.selectedOptions.map((option) => [
      getOptionKey(option.name),
      option.value,
    ]) ?? [],
  );

  const optionEntries =
    options ??
    variants[0]?.selectedOptions.map((option) => ({
      name: option.name,
      values: variants
        .map(
          (variant) =>
            variant.selectedOptions.find(
              (selectedOption) => selectedOption.name === option.name,
            )?.value,
        )
        .filter((value): value is string => Boolean(value)),
    })) ??
    [];

  optionEntries.forEach((option) => {
    const optionKey = getOptionKey(option.name);
    const value = searchParams.get(optionKey);

    if (value && option.values.includes(value)) {
      selectedOptions[optionKey] = value;
    }
  });

  return selectedOptions;
}

export function findSelectedVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>,
) {
  return variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => selectedOptions[getOptionKey(option.name)] === option.value,
    ),
  );
}

export function useSelectedProductVariant(product: Product) {
  const searchParams = useSearchParams();
  const selectedOptions = useMemo(
    () =>
      getSelectedOptionsFromSearchParams({
        variants: product.variants,
        options: product.options,
        searchParams,
      }),
    [product.options, product.variants, searchParams],
  );
  const selectedVariant = useMemo(
    () => findSelectedVariant(product.variants, selectedOptions),
    [product.variants, selectedOptions],
  );

  return { selectedOptions, selectedVariant };
}

export function useSelectedVariantImageIndex(
  images: ProductImage[],
  variants: ProductVariant[],
) {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const selectedOptions = getSelectedOptionsFromSearchParams({
      variants,
      searchParams,
    });
    const selectedVariant =
      findSelectedVariant(variants, selectedOptions) ??
      getDefaultVariant(variants);

    if (!selectedVariant?.image?.url) return 0;

    const imageIndex = images.findIndex(
      (image) => image.src === selectedVariant.image?.url,
    );

    return imageIndex >= 0 ? imageIndex : 0;
  }, [images, searchParams, variants]);
}
