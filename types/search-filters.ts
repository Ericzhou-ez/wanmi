export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export type PathFilterItem = {
  title: string;
  path: string;
};

export type ListItem = SortFilterItem | PathFilterItem;
