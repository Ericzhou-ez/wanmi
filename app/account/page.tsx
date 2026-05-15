import Link from "next/link";

import { getAccountContext } from "lib/account";
import { getCustomerOrdersByIdentity } from "lib/shopify/admin/orders";

export const metadata = {
  title: "Mon compte",
  description: "Aperçu de votre espace client.",
};

export default async function AccountOverviewPage() {
  const account = await getAccountContext();
  if (!account) {
    return (
      <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        Impossible de charger votre compte pour le moment. Veuillez vous
        reconnecter.
      </p>
    );
  }

  let recentOrderCount = 0;
  let pendingReturnCount = 0;

  if (account.shopifyCustomerId && account.adminConfigured) {
    try {
      const orders = await getCustomerOrdersByIdentity(
        {
          customerId: account.shopifyCustomerId,
          email: account.email,
        },
        {
          first: 10,
        },
      );
      recentOrderCount = orders.length;
      pendingReturnCount = orders.reduce(
        (acc, order) =>
          acc +
          order.returns.filter((r) =>
            ["REQUESTED", "OPEN"].includes(r.status?.toUpperCase()),
          ).length,
        0,
      );
    } catch (e) {
      console.warn(
        "[account] Failed to load order summary:",
        e instanceof Error ? e.message : String(e),
      );
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SummaryCard
        title="Commandes récentes"
        value={String(recentOrderCount)}
        href="/account/orders"
        cta="Voir mes commandes"
      />
      <SummaryCard
        title="Retours en cours"
        value={String(pendingReturnCount)}
        href="/account/returns"
        cta="Gérer mes retours"
      />
      <SummaryCard
        title="Recommandations"
        value="✨"
        href="/account/recommendations"
        cta="Découvrir"
      />

      {!account.adminConfigured ? (
        <div className="md:col-span-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">Espace client en cours d’activation</p>
          <p className="mt-1">
            L’API Admin Shopify n’est pas encore configurée. Ajoutez
            <code className="mx-1 rounded bg-amber-100 px-1">
              SHOPIFY_ADMIN_ACCESS_TOKEN
            </code>
            à <code>.env</code> pour activer les commandes et les retours.
          </p>
        </div>
      ) : !account.shopifyCustomerId ? (
        <div className="md:col-span-3 rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
          Nous n’avons pas encore lié votre adresse e-mail à un client Shopify.
          Effectuez une commande pour activer le suivi.
        </div>
      ) : null}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  href,
  cta,
}: {
  title: string;
  value: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
        {title}
      </p>
      <p className="mt-2 text-3xl font-semibold text-neutral-900">{value}</p>
      <Link
        href={href}
        className="mt-4 inline-flex text-sm text-neutral-900 underline-offset-4 hover:underline"
      >
        {cta} →
      </Link>
    </div>
  );
}
