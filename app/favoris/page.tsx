import Footer from "components/layout/footer";
import { WishlistGrid } from "components/wishlist/wishlist-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes Favoris",
  description: "Retrouvez vos produits sauvegardés.",
};

export default function FavorisPage() {
  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12 lg:px-6">
        <h1 className="mb-8 text-3xl font-medium text-neutral-900">
          Mes Favoris
        </h1>
        <WishlistGrid />
      </div>
      <Footer />
    </>
  );
}
