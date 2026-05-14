"use client";

import clsx from "clsx";
import { createUrl } from "lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ListItem, PathFilterItem, SortFilterItem } from "types/search-filters";

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const className = clsx("w-full text-sm underline-offset-4 hover:underline", {
    "underline underline-offset-4": active,
  });

  newParams.delete("q");

  return (
    <li className="mt-2 flex text-black">
      {active ? (
        <span className={className} aria-current="page">
          {item.title}
        </span>
      ) : (
        <Link href={createUrl(item.path, newParams)} className={className}>
          {item.title}
        </Link>
      )}
    </li>
  );
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") === item.slug;
  const q = searchParams.get("q");
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug }),
    }),
  );
  const className = clsx("w-full hover:underline hover:underline-offset-4", {
    "underline underline-offset-4": active,
  });

  return (
    <li className="mt-2 flex text-sm text-black">
      {active ? (
        <span className={className} aria-current="true">
          {item.title}
        </span>
      ) : (
        <Link prefetch={false} href={href} className={className}>
          {item.title}
        </Link>
      )}
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return "path" in item ? (
    <PathFilterItem item={item} />
  ) : (
    <SortFilterItem item={item} />
  );
}
