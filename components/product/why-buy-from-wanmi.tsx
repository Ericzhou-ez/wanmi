import Link from "next/link";

const REASONS = [
  {
    icon: (
      <svg
        className="h-8 w-8"
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
    title: "Garantie Satisfaction 30 Jours",
    description:
      "Pas satisfait ? Retournez votre achat sous 30 jours pour un remboursement complet, sans questions.",
    link: { href: "/garantie-satisfaction", label: "En savoir plus" },
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
    title: "Livraison Gratuite & Sécurisée",
    description:
      "Profitez de la livraison gratuite sur toutes les commandes. Vos meubles arrivent protégés et en parfait état.",
    link: { href: "/aide/livraison", label: "Détails livraison" },
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
      </svg>
    ),
    title: "Qualité Sélectionnée avec Soin",
    description:
      "Chaque produit est choisi et testé par notre équipe pour garantir design, confort et durabilité.",
    link: null,
  },
] as const;

export function WhyBuyFromWanmi() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-14">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-6">
        <h2 className="mb-10 text-center text-2xl font-medium text-neutral-900">
          Pourquoi acheter chez Wanmi
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col items-center rounded-xl bg-white p-8 text-center shadow-sm"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
                {reason.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold text-neutral-900">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                {reason.description}
              </p>
              {reason.link && (
                <Link
                  href={reason.link.href}
                  className="mt-4 text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                >
                  {reason.link.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
