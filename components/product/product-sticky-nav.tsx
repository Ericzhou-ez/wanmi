"use client";

import { useEffect, useState } from "react";
import Price from "components/price";
import { SaveButton } from "./save-button";
import type { Product } from "lib/shopify/types";
import { cn } from "lib/utils";

const NAV_SECTIONS = [
  { id: "apercu", label: "Aperçu" },
  { id: "details-section", label: "Détails" },
  { id: "recommendations-section", label: "Recommandé" },
  { id: "delivery-section", label: "Livraisons & retours" },
] as const;

export function ProductStickyNav({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("apercu");

  useEffect(() => {
    const trigger = document.getElementById("product-hero");
    if (!trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry!.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionIds = NAV_SECTIONS.map((s) => s.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry!.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: "-120px 0px -50% 0px" },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-[60] border-b border-neutral-200 bg-white transition-transform duration-300",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-(--breakpoint-2xl) items-center justify-between px-4 py-2 lg:px-6">
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "text-sm font-medium transition-colors",
                activeSection === section.id
                  ? "border-b-2 border-neutral-900 pb-1 text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700",
              )}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:ml-auto">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            className="text-lg font-semibold"
            currencyCodeClassName="hidden"
          />
          <SaveButton product={product} iconOnly className="hidden md:flex" />
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("apercu");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
