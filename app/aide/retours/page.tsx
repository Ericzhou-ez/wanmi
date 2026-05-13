import Footer from "components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Retours",
  description: "Modalités de retour et remboursement.",
};

export default function RetoursPage() {
  return (
    <>
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12">
        <Link
          href="/aide"
          className="text-sm text-neutral-600 underline-offset-4 hover:underline"
        >
          ← Retour à l’aide
        </Link>
        <h1 className="mt-4 text-4xl font-semibold text-neutral-900">Retours</h1>
        <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
          <p className="text-sm text-neutral-700">
            Si un article ne convient pas, vous pouvez demander un retour. On
            vous guide étape par étape pour que ce soit simple.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-neutral-600">
            <li>Demande de retour: depuis l’e‑mail de commande.</li>
            <li>État: produit non utilisé, dans son emballage d’origine.</li>
            <li>Remboursement: après contrôle, sur le moyen de paiement initial.</li>
          </ul>
        </div>
      </section>
      <Footer />
    </>
  );
}

