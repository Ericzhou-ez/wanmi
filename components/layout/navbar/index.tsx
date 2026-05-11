import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import Link from "next/link";
import { Suspense } from "react";
import MegaMenu from "./mega-menu";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const { SITE_NAME } = process.env;

export async function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 p-4 backdrop-blur lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full items-center gap-3 md:w-2/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-3"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-semibold uppercase tracking-[0.2em] md:hidden lg:block">
              {SITE_NAME || "Maison Atelier"}
            </div>
          </Link>
          <MegaMenu />
        </div>
        <div className="hidden justify-center md:flex md:w-1/4">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/12">
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
