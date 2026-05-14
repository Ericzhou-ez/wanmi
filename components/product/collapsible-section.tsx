"use client";

import { useState } from "react";
import { cn } from "lib/utils";

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
          {title}
        </span>
        <svg
          className={cn(
            "h-5 w-5 flex-none text-neutral-500 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[2000px] opacity-100 pb-5" : "max-h-0 opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}
