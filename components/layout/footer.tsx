import FooterMenu from "components/layout/footer-menu";
import WordLogo from "components/icons/word-logo";
import { getMenu } from "lib/shopify";
import Link from "next/link";
import { Suspense } from "react";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const skeleton = "h-5 w-full animate-pulse rounded-sm bg-neutral-200";
  const menu = await getMenu("next-js-frontend-footer-menu");
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  const fallbackColumns = [
    {
      title: "Aide",
      links: [
        { label: "Centre d’assistance", href: "/aide" },
        { label: "Livraison", href: "/aide/livraison" },
        { label: "Retours", href: "/aide/retours" },
      ],
    },
    {
      title: "Explorer",
      links: [
        { label: "Collections", href: "/collections" },
        { label: "Inspirations", href: "/inspirations" },
        { label: "Conseils", href: "/conseils" },
      ],
    },
    {
      title: "Compte",
      links: [
        { label: "Panier", href: "/cart" },
        { label: "Recherche", href: "/search" },
      ],
    },
  ];

  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white text-neutral-900">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-6 py-12 md:px-4">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Link className="inline-flex text-neutral-900" href="/">
              <WordLogo isDark={true} />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-neutral-600">
              Mobilier et décoration contemporains — une sélection pensée comme
              un magazine, avec le confort d’une boutique.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/"
                aria-label="Instagram"
                className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs hover:bg-neutral-100"
              >
                IG
              </Link>
              <Link
                href="/"
                aria-label="Pinterest"
                className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs hover:bg-neutral-100"
              >
                PT
              </Link>
              <Link
                href="/"
                aria-label="Facebook"
                className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs hover:bg-neutral-100"
              >
                FB
              </Link>
              <Link
                href="/"
                aria-label="YouTube"
                className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs hover:bg-neutral-100"
              >
                YT
              </Link>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-3">
            <Suspense
              fallback={
                <div className="space-y-2">
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                  <div className={skeleton} />
                </div>
              }
            >
              {menu.length > 0 ? (
                <FooterMenu menu={menu} />
              ) : (
                fallbackColumns.map((col) => (
                  <div key={col.title}>
                    <p className="text-xs uppercase tracking-[0.22em] text-neutral-600">
                      {col.title}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {col.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="text-sm text-neutral-800 hover:text-black hover:underline underline-offset-4"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </Suspense>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-600">
              Nouveautés & offres
            </p>
            <p className="mt-3 text-sm text-neutral-700">
              Recevez nos sélections, nouveautés et inspirations (promis, pas de
              spam).
            </p>
            <form className="mt-5 flex gap-2">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Adresse e-mail pour la newsletter
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                name="email"
                placeholder="Votre e-mail"
                className="h-11 w-full rounded-full border border-neutral-300 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none focus:border-neutral-400"
              />
              <button
                type="button"
                className="h-11 rounded-full bg-red-500 px-6 text-sm font-semibold text-white hover:bg-red-400"
              >
                S’inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-6 text-xs text-neutral-600">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <p>
              &copy; {copyrightDate} {copyrightName}
              {copyrightName.length && !copyrightName.endsWith(".")
                ? "."
                : ""}{" "}
              Tous droits réservés.
            </p>
            <div className="md:ml-auto flex flex-wrap gap-x-4 gap-y-2">
              <Link
                href="/politique-confidentialite"
                className="hover:text-black hover:underline underline-offset-4"
              >
                Confidentialité
              </Link>
              <Link
                href="/conditions"
                className="hover:text-black hover:underline underline-offset-4"
              >
                Conditions
              </Link>
              <Link
                href="/accessibilite"
                className="hover:text-black hover:underline underline-offset-4"
              >
                Accessibilité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
