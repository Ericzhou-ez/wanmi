import { AccountNav } from "components/account/account-nav";
import { SignOutButton } from "components/account/sign-out-button";
import Footer from "components/layout/footer";
import { auth } from "lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/account");
  }

  return (
    <>
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
              Espace client
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-neutral-900">
              Bonjour {session.user.name?.split(" ")[0] ?? ""}
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              {session.user.email}
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-6">
          <AccountNav />
        </div>

        <div className="mt-8">{children}</div>
      </section>
      <Footer />
    </>
  );
}
