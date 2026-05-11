"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "components/ui/navigation-menu";
import { megaMenuGroups } from "lib/storefront-content";
import Link from "next/link";

export default function MegaMenu() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {megaMenuGroups.map((group) => (
          <NavigationMenuItem key={group.title}>
            <NavigationMenuTrigger>{group.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[560px]">
                <div className="mb-4 border-b border-neutral-200 pb-3">
                  <h3 className="text-base font-semibold text-neutral-900">
                    {group.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    {group.description}
                  </p>
                </div>
                <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="block rounded-2xl border border-neutral-200 px-4 py-3 transition hover:border-neutral-400 hover:bg-neutral-50"
                        >
                          <p className="text-sm font-medium text-neutral-900">
                            {item.label}
                          </p>
                          <p className="mt-1 text-xs text-neutral-600">
                            {item.helper}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
