"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/account", label: "Aperçu" },
  { href: "/account/orders", label: "Commandes" },
  { href: "/account/recommendations", label: "Recommandations" },
  { href: "/account/returns", label: "Retours" },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="flex w-full flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-white p-2">
      {links.map((link) => {
        const isActive =
          link.href === "/account"
            ? pathname === "/account"
            : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              "rounded-xl px-4 py-2 text-sm transition",
              isActive
                ? "bg-neutral-900 text-white"
                : "text-neutral-700 hover:bg-neutral-100",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
