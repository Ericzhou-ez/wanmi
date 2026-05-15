"use client";

import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { EmptyDiscoveryPrompt } from "components/empty-discovery-prompt";
import Price from "components/price";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { useWishlist } from "./wishlist-context";

export function WishlistButton() {
  const { items, itemCount, removeItem } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const openWishlist = () => setIsOpen(true);
  const closeWishlist = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label={`Ouvrir les favoris${itemCount > 0 ? ` (${itemCount})` : ""}`}
        title="Favoris"
        onClick={openWishlist}
        className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:bg-neutral-50 md:h-8 md:w-8"
      >
        <i className="ph-heart ph-sm text-neutral-900 transition-all ease-in-out hover:scale-110" />
        {itemCount > 0 && (
          <span className="absolute right-0 top-0 -mr-2 -mt-2 flex h-4 w-4 items-center justify-center rounded-sm bg-red-600 text-[11px] font-medium text-white">
            {itemCount}
          </span>
        )}
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={closeWishlist} className="relative z-50">
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
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px]">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Mes favoris</p>
                <button
                  type="button"
                  aria-label="Fermer les favoris"
                  onClick={closeWishlist}
                >
                  <CloseWishlist />
                </button>
              </div>

              {items.length === 0 ? (
                <EmptyDiscoveryPrompt
                  iconClassName="ph-heart"
                  title="Aucun favori pour le moment."
                  description="Parcourez nos collections et sauvegardez vos coups de coeur."
                  onClick={closeWishlist}
                />
              ) : (
                <ul className="grow overflow-auto py-4">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex w-full flex-col border-b border-neutral-300"
                    >
                      <div className="relative flex w-full flex-row justify-between px-1 py-4">
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          aria-label="Retirer des favoris"
                          className="absolute z-40 -ml-1 -mt-2 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 bg-white text-black transition-colors hover:bg-neutral-50"
                        >
                          <i className="ph-x ph-sm" />
                        </button>

                        <div className="flex flex-row">
                          <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-100">
                            {item.image ? (
                              <Image
                                className="h-full w-full object-cover"
                                width={64}
                                height={64}
                                alt={item.title}
                                src={item.image}
                              />
                            ) : (
                              <div
                                aria-hidden="true"
                                className="h-full w-full bg-neutral-100"
                              />
                            )}
                          </div>
                          <Link
                            href={`/product/${item.handle}`}
                            onClick={closeWishlist}
                            className="z-30 ml-2 flex flex-row space-x-4"
                          >
                            <div className="flex flex-1 flex-col text-base">
                              <span className="leading-tight">
                                {item.title}
                              </span>
                              <Price
                                amount={item.price}
                                currencyCode={item.currencyCode}
                                className="mt-1 text-sm text-neutral-500"
                              />
                            </div>
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseWishlist({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors">
      <i
        className={clsx(
          "ph-x ph-lg text-neutral-900 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />
    </div>
  );
}
