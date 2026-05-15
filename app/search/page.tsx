import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Recherche",
  description: "Rechercher des produits dans la boutique.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sortParam = searchParams?.sort;
  const searchParam = searchParams?.q;
  const sort = Array.isArray(sortParam) ? sortParam[0] : sortParam;
  const searchValue = Array.isArray(searchParam) ? searchParam[0] : searchParam;
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? "résultats" : "résultat";

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold text-neutral-900">
        Recherche
      </h1>
      {!searchValue ? (
        <p className="mb-4 text-sm text-neutral-600">
          Entrez un mot-clé pour découvrir nos produits.
        </p>
      ) : null}
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "Aucun produit ne correspond à "
            : `${products.length} ${resultsText} pour `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
