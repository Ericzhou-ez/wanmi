import Footer from "components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Livraison",
  description: "Informations sur la livraison et le suivi de commande.",
};

export default function LivraisonPage() {
  return (
    <>
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12">
        <Link
          href="/aide"
          className="text-sm text-neutral-600 underline-offset-4 hover:underline"
        >
          ← Retour à l’aide
        </Link>
        <h1 className="mt-4 text-4xl font-semibold text-neutral-900">
          Livraison
        </h1>
        <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
          <p className="text-sm text-neutral-700">
            Les délais et options de livraison varient selon les produits et
            l’adresse. Dès l’expédition, vous recevez un e‑mail de suivi.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-neutral-600">
            <li>Délais indicatifs: 2–7 jours ouvrés selon disponibilité.</li>
            <li>Suivi: lien de tracking dès prise en charge.</li>
            <li>Livraison premium: sur rendez-vous si nécessaire.</li>
          </ul>
        </div>
      </section>
      <Footer />
    </>
  );
}
