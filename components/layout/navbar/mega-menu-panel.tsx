import { MegaMenuColumn } from "components/layout/navbar/mega-menu-column";
import { cn } from "lib/utils";
import { getMegaMenuPanelColumns } from "lib/storefront-content";
import type { MegaMenuGroup } from "types/content";

type MegaMenuPanelProps = {
  group: MegaMenuGroup;
};

const gridByCount: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
};

export function MegaMenuPanel({ group }: MegaMenuPanelProps) {
  const columns = getMegaMenuPanelColumns(group);
  const cols = Math.min(columns.length || 1, 5);
  const gridClass = gridByCount[cols] ?? "md:grid-cols-5";

  return (
    <div
      className={cn(
        "grid w-full max-w-none divide-y divide-neutral-200 border-t border-neutral-200 bg-white md:divide-x md:divide-y-0",
        gridClass,
      )}
    >
      {columns.map((column) => (
        <MegaMenuColumn key={column.id} column={column} />
      ))}
    </div>
  );
}
