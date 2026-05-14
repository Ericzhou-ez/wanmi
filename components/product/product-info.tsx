"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Price from "components/price";
import { addItem } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { VariantSelector } from "./variant-selector";
import { QuantitySelector } from "./quantity-selector";
import { ProductDetailsSections } from "./product-details-sections";
import { SaveButton } from "./save-button";
import type { Product, ProductVariant } from "lib/shopify/types";
import type { ParsedDescription } from "types/product";
import { cn } from "lib/utils";
import { useActionState } from "react";

function ProductPrice({
  variant,
  product,
}: {
  variant: ProductVariant | undefined;
  product: Product;
}) {
  const price = variant?.price || product.priceRange.maxVariantPrice;
  const compareAtPrice = variant?.compareAtPrice;
  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <div className="flex items-baseline gap-3">
      <Price
        amount={price.amount}
        currencyCode={price.currencyCode}
        className="text-2xl font-semibold text-neutral-900"
        currencyCodeClassName="hidden"
      />
      {hasDiscount && (
        <Price
          amount={compareAtPrice.amount}
          currencyCode={compareAtPrice.currencyCode}
          className="text-lg text-neutral-400 line-through"
          currencyCodeClassName="hidden"
        />
      )}
    </div>
  );
}

export function ProductInfo({
  product,
  parsedDescription,
}: {
  product: Product;
  parsedDescription: ParsedDescription;
}) {
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [, formAction] = useActionState(addItem, null);

  const variant = product.variants.find((v: ProductVariant) =>
    v.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId =
    product.variants.length === 1 ? product.variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = product.variants.find(
    (v) => v.id === selectedVariantId,
  );

  const addItemAction = formAction.bind(null, finalVariant?.id);

  const handleAddToCart = async () => {
    if (!finalVariant) return;
    for (let i = 0; i < quantity; i++) {
      addCartItem(finalVariant, product);
    }
    await addItemAction();
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-lora text-2xl font-medium leading-tight text-neutral-900 lg:text-3xl">
          {product.title}
        </h1>
        <SaveButton product={product} iconOnly />
      </div>

      <div className="mt-4">
        <ProductPrice variant={finalVariant} product={product} />
      </div>

      <div className="mt-6">
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-neutral-700">Quantité</p>
        <div className="flex items-center gap-4">
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
          <form action={handleAddToCart} className="flex-1">
            <button
              type="submit"
              disabled={!product.availableForSale || !selectedVariantId}
              className={cn(
                "w-full rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors",
                product.availableForSale && selectedVariantId
                  ? "bg-neutral-900 text-white hover:bg-neutral-800"
                  : "cursor-not-allowed bg-neutral-200 text-neutral-400",
              )}
            >
              {!product.availableForSale
                ? "Rupture de stock"
                : "Ajouter au panier"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-6">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
          <span>Livraison gratuite</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
          <span>Garantie du meilleur prix pendant 30 jours</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
          <span>Retours pendant 30 jours</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <span>Livraison sécurisée</span>
        </div>
      </div>

      <ProductDetailsSections parsedDescription={parsedDescription} />
    </div>
  );
}
