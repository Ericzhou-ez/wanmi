import Footer from "components/layout/footer";
import { homeInspirationCards } from "lib/storefront-content";
import Link from "next/link";

export const metadata = {
  title: "Inspirations",
  description: "Explorez nos ambiances décoratives et idées de mise en scène.",
};

export default function InspirationsIndexPage() {
  return (
    <>
      <section className="mx-auto mt-8 max-w-(--breakpoint-2xl) px-4 pb-14">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Carnet créatif
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-neutral-900">
          Inspirations
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Parcourez nos directions artistiques pour imaginer un intérieur
          cohérent, moderne et chaleureux.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {homeInspirationCards.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-neutral-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm text-neutral-600">{item.blurb}</p>
              <span className="mt-4 inline-block text-sm font-medium text-neutral-900 underline-offset-4 hover:underline">
                Voir l'inspiration
              </span>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
