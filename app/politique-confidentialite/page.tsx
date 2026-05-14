import Footer from "components/layout/footer";

export const metadata = {
  title: "Politique de confidentialité",
  description: "Comment nous gérons vos données et votre confidentialité.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12">
        <h1 className="text-4xl font-semibold text-neutral-900">
          Politique de confidentialité
        </h1>
        <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
          <p className="text-sm text-neutral-700">
            Nous collectons uniquement les informations nécessaires au
            traitement de votre commande et à l’amélioration de l’expérience du
            site.
          </p>
          <p className="mt-4 text-sm text-neutral-700">
            Vous pouvez demander l’accès, la rectification ou la suppression de
            vos données conformément aux règles applicables.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
