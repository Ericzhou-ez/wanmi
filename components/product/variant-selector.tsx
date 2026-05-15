"use client";

import { cn } from "lib/utils";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants,
  selectedOptions,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedOptions?: Record<string, string>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hoveredValues, setHoveredValues] = useState<Record<string, string>>(
    {},
  );
  const defaultVariant =
    variants.find((variant) => variant.availableForSale) ?? variants[0];
  const resolvedSelectedOptions =
    selectedOptions ??
    Object.fromEntries(
      defaultVariant?.selectedOptions.map((option) => [
        option.name.toLowerCase(),
        searchParams.get(option.name.toLowerCase()) ?? option.value,
      ]) ?? [],
    );
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextSelection = {
      ...resolvedSelectedOptions,
      [name]: value,
    };
    const matchingVariant =
      variants.find(
        (variant) =>
          variant.availableForSale &&
          variant.selectedOptions.every(
            (option) =>
              nextSelection[option.name.toLowerCase()] === option.value,
          ),
      ) ??
      variants.find((variant) =>
        variant.selectedOptions.some(
          (option) =>
            option.name.toLowerCase() === name && option.value === value,
        ),
      );

    if (matchingVariant) {
      matchingVariant.selectedOptions.forEach((option) => {
        params.set(option.name.toLowerCase(), option.value);
      });
    } else {
      params.set(name, value);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const getOptionValueImages = (option: ProductOption) => {
    if (option.values.length < 2) return {};

    const optionName = option.name.toLowerCase();
    const imagesByValue = Object.fromEntries(
      option.values.flatMap((value) => {
        const matchingImages = variants
          .filter((variant) =>
            variant.selectedOptions.some(
              (selectedOption) =>
                selectedOption.name.toLowerCase() === optionName &&
                selectedOption.value === value,
            ),
          )
          .map((variant) => variant.image)
          .filter((image) => image?.url);
        const uniqueUrls = new Set(matchingImages.map((image) => image!.url));

        if (uniqueUrls.size !== 1) return [];

        return [[value, matchingImages[0]!]];
      }),
    );

    const uniqueOptionImages = new Set(
      Object.values(imagesByValue).map((image) => image.url),
    );

    return uniqueOptionImages.size > 1 ? imagesByValue : {};
  };

  return (
    <>
      {options.map((option) => {
        const optionNameLowerCase = option.name.toLowerCase();
        const optionValueImages = getOptionValueImages(option);
        const hasImageSwatches = Object.keys(optionValueImages).length > 0;
        const activeOrHoveredValue =
          hoveredValues[optionNameLowerCase] ??
          resolvedSelectedOptions[optionNameLowerCase];

        return (
          <div key={option.id}>
            <dl className="mb-6">
              <dt className="mb-1.5 flex items-baseline gap-1.5 text-sm text-neutral-700">
                <span className="font-semibold">{option.name}:</span>
                {activeOrHoveredValue && (
                  <span className="text-neutral-500">
                    {activeOrHoveredValue}
                  </span>
                )}
              </dt>
              <dd className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const optionParams: Record<string, string> = {};
                  Object.assign(optionParams, resolvedSelectedOptions);
                  optionParams[optionNameLowerCase] = value;

                  const filtered = Object.entries(optionParams).filter(
                    ([key, value]) =>
                      options.find(
                        (option) =>
                          option.name.toLowerCase() === key &&
                          option.values.includes(value),
                      ),
                  );
                  const isAvailableForSale = combinations.find((combination) =>
                    filtered.every(
                      ([key, value]) =>
                        combination[key] === value &&
                        combination.availableForSale,
                    ),
                  );

                  const isActive =
                    resolvedSelectedOptions[optionNameLowerCase] === value;
                  const valueImage = optionValueImages[value];

                  return (
                    <button
                      type="button"
                      onClick={() => updateOption(optionNameLowerCase, value)}
                      key={`${option.id}-${value}`}
                      onMouseEnter={() =>
                        setHoveredValues((current) => ({
                          ...current,
                          [optionNameLowerCase]: value,
                        }))
                      }
                      onMouseLeave={() =>
                        setHoveredValues((current) => {
                          const next = { ...current };
                          delete next[optionNameLowerCase];
                          return next;
                        })
                      }
                      aria-disabled={!isAvailableForSale}
                      disabled={!isAvailableForSale}
                      title={`${option.name} ${value}${!isAvailableForSale ? " (Rupture de stock)" : ""}`}
                      className={cn(
                        "flex items-center rounded-md border text-sm transition-all",
                        hasImageSwatches
                          ? "h-16 w-16 justify-center p-1"
                          : "gap-2 px-4 py-2",
                        isActive
                          ? "border-neutral-900 bg-neutral-50 font-medium text-neutral-900 ring-1 ring-neutral-900"
                          : isAvailableForSale
                            ? "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500 hover:bg-neutral-50"
                            : "relative cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-300 line-through",
                      )}
                    >
                      {valueImage?.url && (
                        <span className="relative h-full w-full overflow-hidden rounded bg-neutral-50">
                          <Image
                            src={valueImage.url}
                            alt={valueImage.altText || value}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </span>
                      )}
                      {!hasImageSwatches && value}
                    </button>
                  );
                })}
              </dd>
            </dl>
          </div>
        );
      })}
    </>
  );
}
