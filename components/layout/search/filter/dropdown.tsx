"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { ListItem } from "types/search-filters";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FilterItem } from "./item";

export default function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const panelId = useId();
  const getFilterItemKey = (item: ListItem) =>
    "path" in item
      ? `path:${item.path}`
      : `sort:${item.slug ?? "default"}:${item.title}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("touchstart", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const current = list.find(
      (listItem: ListItem) =>
        ("path" in listItem && pathname === listItem.path) ||
        ("slug" in listItem && searchParams.get("sort") === listItem.slug),
    );
    setActive(current?.title ?? list[0]?.title ?? "");
  }, [pathname, list, searchParams]);

  useEffect(() => {
    if (!openSelect) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenSelect(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [openSelect]);

  return (
    <div className="relative" ref={ref}>
      <button
        id={buttonId}
        type="button"
        aria-controls={panelId}
        aria-expanded={openSelect}
        onClick={() => setOpenSelect((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-sm border border-black/30 px-4 py-2 text-sm"
      >
        <span>{active}</span>
        <ChevronDownIcon className="h-4" />
      </button>
      {openSelect && (
        <div
          id={panelId}
          aria-labelledby={buttonId}
          onClick={() => {
            setOpenSelect(false);
          }}
          className="absolute z-40 w-full rounded-b-md bg-white p-4 shadow-md"
        >
          <ul>
            {list.map((item: ListItem) => (
              <FilterItem key={getFilterItemKey(item)} item={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
