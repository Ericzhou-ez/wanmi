import { MegaMenuInspiration } from "components/layout/navbar/mega-menu-inspiration";
import { NavigationMenuLink } from "components/ui/navigation-menu";
import type { MegaMenuColumn as MegaMenuColumnType } from "types/content";
import Link from "next/link";

type MegaMenuColumnProps = {
  column: MegaMenuColumnType;
};

export function MegaMenuColumn({ column }: MegaMenuColumnProps) {
  const tone = column.tone === "muted" ? "bg-neutral-100/90" : "bg-white";

  return (
    <div className={`flex min-h-[min(28rem,70vh)] flex-col px-5 py-6 ${tone}`}>
      <h3 className="mega-menu-group-title text-xs font-bold uppercase tracking-wide text-neutral-900">
        <NavigationMenuLink asChild>
          <Link
            href={column.titleHref}
            className="inline-flex items-center gap-1 bg-transparent text-inherit no-underline decoration-none hover:bg-transparent hover:text-inherit hover:no-underline hover:decoration-none focus-visible:bg-transparent focus-visible:text-inherit data-[active]:bg-transparent data-[active]:text-inherit"
          >
            {column.title}
            <span aria-hidden className="text-[0.7rem] font-normal">
              →
            </span>
          </Link>
        </NavigationMenuLink>
      </h3>

      <nav className="mt-4 flex flex-col gap-2.5" aria-label={column.title}>
        {column.links.map((item) => (
          <p
            key={`${column.id}-${item.href}-${item.label}`}
            className="m-0 leading-snug"
          >
            <NavigationMenuLink asChild>
              <Link
                href={item.href}
                className="text-sm text-neutral-700 underline-offset-4 transition duration-75 hover:text-neutral-950 hover:underline hover:decoration-red-500"
              >
                {item.label}
              </Link>
            </NavigationMenuLink>
          </p>
        ))}

        {column.sections?.map((section) => (
          <div
            key={section.label}
            className="mt-4 border-t border-neutral-200/80 pt-4"
          >
            <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-wide text-neutral-500">
              {section.label}
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {section.links.map((item) => (
                <p
                  key={`${column.id}-${section.label}-${item.href}-${item.label}`}
                  className="m-0 leading-snug"
                >
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-700 underline-offset-4 transition duration-75 hover:text-neutral-950 hover:underline hover:decoration-red-500"
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </p>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <MegaMenuInspiration {...column.inspiration} />
    </div>
  );
}
