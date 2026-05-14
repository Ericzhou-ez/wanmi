import { Suspense } from "react";
import type { ListItem } from "types/search-filters";
import FilterItemDropdown from "./dropdown";
import { FilterItem } from "./item";

const getFilterItemKey = (item: ListItem) =>
  "path" in item
    ? `path:${item.path}`
    : `sort:${item.slug ?? "default"}:${item.title}`;

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <>
      {list.map((item: ListItem) => (
        <FilterItem key={getFilterItemKey(item)} item={item} />
      ))}
    </>
  );
}

export default function FilterList({
  list,
  title,
}: {
  list: ListItem[];
  title?: string;
}) {
  return (
    <>
      <nav>
        {title ? (
          <h3 className="hidden text-xs text-neutral-500 md:block">{title}</h3>
        ) : null}
        <ul className="hidden md:block">
          <Suspense fallback={null}>
            <FilterItemList list={list} />
          </Suspense>
        </ul>
        <div className="md:hidden">
          <Suspense fallback={null}>
            <FilterItemDropdown list={list} />
          </Suspense>
        </div>
      </nav>
    </>
  );
}
