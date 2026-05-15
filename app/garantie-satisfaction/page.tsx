import Footer from "components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garantie Satisfaction 30 Jours",
  description:
    "Découvrez notre garantie satisfaction 30 jours : retournez votre achat sans questions pour un remboursement complet.",
};

const GUARANTEE_POINTS = [
  {
    title: "30 jours pour essayer",
    description:
      "À partir de la date de livraison, vous avez 30 jours complets pour tester votre achat dans votre intérieur.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
        />
      </svg>
    ),
  },
  {
    title: "Retour gratuit & sans questions",
    description:
      "Si le produit ne vous convient pas, contactez-nous. Nous organisons le retour gratuitement, sans vous demander de justification.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
        />
      </svg>
    ),
  },
  {
    title: "Remboursement complet",
    description:
      "Votre remboursement est effectué sous 5 à 10 jours ouvrés après réception du produit retourné, sur le moyen de paiement d'origine.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
        />
      </svg>
    ),
  },
  {
    title: "Produit endommagé ?",
    description:
      "Si votre article arrive endommagé, nous le remplaçons immédiatement ou vous remboursons intégralement. Envoyez-nous simplement des photos.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
    ),
  },
];

const FAQ_ITEMS = [
  {
    question: "Comment initier un retour ?",
    answer:
      "Contactez notre service client par e-mail ou via la page Aide. Nous vous enverrons une étiquette de retour prépayée.",
  },
  {
    question: "Le retour est-il vraiment gratuit ?",
    answer:
      "Oui, les frais de retour sont entièrement à notre charge pendant la période de garantie de 30 jours.",
  },
  {
    question: "Quand serai-je remboursé ?",
    answer:
      "Le remboursement est initié dès réception du produit retourné et apparaît sous 5 à 10 jours ouvrés sur votre relevé bancaire.",
  },
  {
    question: "Le produit doit-il être dans son emballage d'origine ?",
    answer:
      "Nous demandons que le produit soit en bon état et, si possible, dans son emballage d'origine. Mais l'absence d'emballage ne bloque pas votre retour.",
  },
];

export default function GarantieSatisfactionPage() {
  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12 lg:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <svg
                className="h-8 w-8 text-neutral-700"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-medium text-neutral-900 lg:text-4xl">
              Garantie Satisfaction 30 Jours
            </h1>
            <p className="mt-4 text-lg text-neutral-600">
              Chez Wanmi, votre satisfaction est notre priorité. Nous vous
              offrons 30 jours pour être sûr de votre choix.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {GUARANTEE_POINTS.map((point) => (
              <div
                key={point.title}
                className="rounded-xl border border-neutral-200 bg-white p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                  {point.icon}
                </div>
                <h2 className="mb-2 text-base font-semibold text-neutral-900">
                  {point.title}
                </h2>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {point.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <h2 className="mb-6 text-xl font-medium text-neutral-900">
              Questions fréquentes
            </h2>
            <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="p-5">
                  <h3 className="mb-1 text-sm font-semibold text-neutral-900">
                    {item.question}
                  </h3>
                  <p className="text-sm text-neutral-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
