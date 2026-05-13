import Footer from "components/layout/footer";

export const metadata = {
  title: "Conditions",
  description: "Conditions d’utilisation et conditions de vente.",
};

export default function ConditionsPage() {
  return (
    <>
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12">
        <h1 className="text-4xl font-semibold text-neutral-900">Conditions</h1>
        <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
          <p className="text-sm text-neutral-700">
            Les présentes conditions encadrent l’utilisation du site et les
            achats réalisés. Les informations sont fournies à titre indicatif et
            peuvent évoluer.
          </p>
          <p className="mt-4 text-sm text-neutral-700">
            Pour toute question, consultez la section Aide ou contactez-nous via
            le canal indiqué lors de votre commande.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

