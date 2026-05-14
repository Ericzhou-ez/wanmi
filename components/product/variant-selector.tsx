"use client";

import { cn } from "lib/utils";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import { useRouter, useSearchParams } from "next/navigation";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    params.set(name, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {options.map((option) => (
        <form key={option.id}>
          <dl className="mb-5">
            <dt className="mb-3 text-sm font-medium text-neutral-700">
              <span>Option : </span>
              <span className="font-semibold">{option.name}</span>
            </dt>
            <dd className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const optionNameLowerCase = option.name.toLowerCase();

                const optionParams: Record<string, string> = {};
                searchParams.forEach((v, k) => (optionParams[k] = v));
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
                  searchParams.get(optionNameLowerCase) === value;

                return (
                  <button
                    formAction={() =>
                      updateOption(optionNameLowerCase, value)
                    }
                    key={`${option.id}-${value}`}
                    aria-disabled={!isAvailableForSale}
                    disabled={!isAvailableForSale}
                    title={`${option.name} ${value}${!isAvailableForSale ? " (Rupture de stock)" : ""}`}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm transition-all",
                      isActive
                        ? "border-neutral-900 bg-neutral-900 font-medium text-white"
                        : isAvailableForSale
                          ? "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                          : "relative cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-300 line-through",
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </dd>
          </dl>
        </form>
      ))}
    </>
  );
}
