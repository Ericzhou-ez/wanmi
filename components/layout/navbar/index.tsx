import CartModal from "components/cart/modal";
import WordLogo from "components/icons/word-logo";
import Link from "next/link";
import { Suspense } from "react";
import MegaMenu from "./mega-menu";
import MobileMenu from "./mobile-menu";
import { NavbarMetrics } from "./navbar-metrics";
import { PromoStrip } from "./promo-strip";
import Search, { SearchSkeleton } from "./search";

const { SITE_NAME } = process.env;

export async function Navbar() {
   return (
      <nav
         data-site-navbar
         className="sticky top-0 z-50 translate-y-0 border-b border-neutral-200 bg-white px-4 pt-0 pb-2 transition-transform duration-300 ease-out will-change-transform data-[nav-hidden=true]:-translate-y-full lg:px-6"
      >
         <NavbarMetrics />
         <PromoStrip />
         <div className="mx-auto w-full max-w-(--breakpoint-2xl)">
            <div className="relative flex min-h-[2.75rem] items-end gap-3 md:min-h-0">
               <div className="z-10 flex flex-none md:hidden">
                  <Suspense fallback={null}>
                     <MobileMenu />
                  </Suspense>
               </div>

               <Link
                  href="/"
                  prefetch={true}
                  className="absolute left-1/2 top-1/2 z-[5] flex -translate-x-1/2 -translate-y-1/2 md:static md:left-auto md:top-auto md:z-auto md:translate-x-0 md:translate-y-0 md:flex-none md:pr-2"
               >
                  <WordLogo isDark={true} />
               </Link>

               <div className="hidden flex-1 justify-center md:flex">
                  <div className="w-full">
                     <Suspense fallback={<SearchSkeleton />}>
                        <Search />
                     </Suspense>
                  </div>
               </div>

               <div className="z-10 ml-auto flex flex-1 items-center justify-end gap-1 md:ml-0 md:flex-none md:gap-2">
                  <Link
                     href="/aide"
                     aria-label="Aide"
                     className="hidden h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:bg-neutral-50 md:flex"
                  >
                     <i className="ph-question ph-sm text-neutral-900" />
                  </Link>
                  <button
                     type="button"
                     aria-label="Compte"
                     className="hidden h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:bg-neutral-50 md:flex"
                  >
                     <i className="ph-user ph-sm text-neutral-900" />
                  </button>
                  <button
                     type="button"
                     aria-label="Favoris"
                     className="hidden h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:bg-neutral-50 md:flex"
                  >
                     <i className="ph-heart ph-sm text-neutral-900" />
                  </button>
                  <CartModal />
               </div>
            </div>

            <div className="relative mt-3 hidden w-full md:block">
               <MegaMenu />
            </div>
         </div>
      </nav>
   );
}
