"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="relative w-full">
      <label htmlFor="site-search" className="sr-only">
        Rechercher dans le catalogue
      </label>
      <input
        id="site-search"
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder="Rechercher tout"
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="text-sm w-full rounded-md border border-neutral-200 bg-white px-4 py-1.5 text-black placeholder:text-neutral-500 md:text-sm"
      />
      <button
        type="submit"
        aria-label="Lancer la recherche"
        className="absolute right-0 top-0 mr-3 flex h-full items-center"
      >
        <i className="ph-magnifying-glass ph-xs text-neutral-700" />
      </button>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="relative w-full">
      <input
        aria-label="Recherche en cours de chargement"
        placeholder="Rechercher un produit, une matière, une ambiance..."
        className="w-full rounded-md border border-neutral-200 bg-white px-4 py-1.5 text-sm text-black placeholder:text-neutral-500"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <i className="ph-magnifying-glass ph-sm text-neutral-700" />
      </div>
    </form>
  );
}
