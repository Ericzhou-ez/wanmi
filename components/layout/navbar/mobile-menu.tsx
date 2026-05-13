"use client";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";

import {
  getMegaMenuFlatLinks,
  getMegaMenuPanelColumns,
  megaMenuGroups,
} from "lib/storefront-content";
import Search, { SearchSkeleton } from "./search";

const mobileQuickLinks = [
  { title: "Nouveautés", path: "/search?sort=latest-desc" },
  { title: "Toutes les collections", path: "/collections" },
];

export default function MobileMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Ouvrir le menu mobile"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors md:hidden"
      >
        <i className="ph-list ph-sm text-neutral-900" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed inset-0 flex h-dvh w-full flex-col overflow-y-auto overscroll-contain bg-white pb-6 [-webkit-overflow-scrolling:touch]">
              <div className="p-4">
                <button
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors"
                  onClick={closeMobileMenu}
                  aria-label="Fermer le menu mobile"
                >
                  <i className="ph-x ph-lg text-neutral-900" />
                </button>

                <div className="mb-4 w-full">
                  <Suspense fallback={<SearchSkeleton />}>
                    <Search />
                  </Suspense>
                </div>
                <ul className="mb-6 flex w-full flex-col border-b border-neutral-200 pb-4">
                  <li className="py-2 text-xl text-black transition-colors hover:text-neutral-500">
                    <Link href="/" prefetch={true} onClick={closeMobileMenu}>
                      Accueil
                    </Link>
                  </li>
                  {mobileQuickLinks.map((item) => (
                    <li
                      className="py-2 text-xl text-black transition-colors hover:text-neutral-500"
                      key={item.title}
                    >
                      <Link
                        href={item.path}
                        prefetch={true}
                        onClick={closeMobileMenu}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="space-y-6">
                  {megaMenuGroups
                    .filter((group) => getMegaMenuPanelColumns(group).length > 0)
                    .map((group) => (
                    <div key={group.trigger}>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                        {group.trigger}
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {getMegaMenuFlatLinks(group).map((item) => (
                          <li
                            className="text-base text-black transition-colors hover:text-neutral-500"
                            key={`${group.trigger}-${item.href}-${item.label}`}
                          >
                            <Link
                              href={item.href}
                              prefetch={true}
                              onClick={closeMobileMenu}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
