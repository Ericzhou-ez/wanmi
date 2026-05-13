"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "components/ui/navigation-menu";
import { MegaMenuPanel } from "components/layout/navbar/mega-menu-panel";
import {
  getMegaMenuPanelColumns,
  megaMenuGroups,
} from "lib/storefront-content";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function MegaMenu() {
  const [open, setOpen] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrim =
    mounted && open
      ? createPortal(
          <div
            role="presentation"
            className="fixed inset-x-0 bottom-0 z-30 bg-neutral-950/35 transition-opacity duration-150"
            style={{ top: "var(--site-navbar-height, 7.5rem)" }}
            aria-hidden
            onClick={() => setOpen("")}
          />,
          document.body,
        )
      : null;

  return (
    <>
      {scrim}
      <NavigationMenu
        className="hidden w-full max-w-none md:flex"
        delayDuration={0}
        skipDelayDuration={250}
        value={open}
        onValueChange={(v) => setOpen(v ?? "")}
      >
      <NavigationMenuList className="w-full flex-wrap gap-x-6 gap-y-0.5 md:flex-nowrap">
        {megaMenuGroups
          .filter((group) => getMegaMenuPanelColumns(group).length > 0)
          .map((group) => (
          <NavigationMenuItem key={group.trigger} value={group.trigger}>
            <NavigationMenuTrigger>{group.trigger}</NavigationMenuTrigger>
            <NavigationMenuContent className="w-full">
              <MegaMenuPanel group={group} />
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
    </>
  );
}
