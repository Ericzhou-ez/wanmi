"use client";

import { cn } from "lib/utils";

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
}: {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-l-md border border-neutral-300 text-lg transition-colors",
          quantity <= min
            ? "cursor-not-allowed text-neutral-300"
            : "hover:bg-neutral-50 text-neutral-700",
        )}
        aria-label="Diminuer la quantité"
      >
        &minus;
      </button>
      <div className="flex h-10 w-12 items-center justify-center border-y border-neutral-300 text-sm font-medium text-neutral-900">
        {quantity}
      </div>
      <button
        type="button"
        onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-r-md border border-neutral-300 text-lg transition-colors",
          quantity >= max
            ? "cursor-not-allowed text-neutral-300"
            : "hover:bg-neutral-50 text-neutral-700",
        )}
        aria-label="Augmenter la quantité"
      >
        +
      </button>
    </div>
  );
}
