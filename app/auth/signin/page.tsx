import Footer from "components/layout/footer";
import { auth, signIn } from "lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte Wanmi avec Google.",
};

const isGoogleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

const sanitizeCallbackUrl = (callbackUrl?: string) => {
  if (!callbackUrl) return "/account";
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return "/account";
  }
  return callbackUrl;
};

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const callbackUrl = sanitizeCallbackUrl(searchParams.callbackUrl);

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <>
      <section className="mx-auto flex max-w-(--breakpoint-2xl) flex-col items-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-neutral-900">Connexion</h1>
          <p className="mt-3 text-sm text-neutral-600">
            Accédez à votre espace client pour suivre vos commandes, vos retours
            et vos recommandations personnalisées.
          </p>

          {searchParams.error ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              La connexion a échoué. Veuillez réessayer.
            </div>
          ) : null}

          <div className="mt-8">
            {isGoogleConfigured ? (
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: callbackUrl });
                }}
              >
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                >
                  <GoogleGlyph />
                  Continuer avec Google
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                La connexion Google n’est pas encore configurée. Ajoutez
                <code className="mx-1 rounded bg-amber-100 px-1">
                  GOOGLE_CLIENT_ID
                </code>
                et
                <code className="mx-1 rounded bg-amber-100 px-1">
                  GOOGLE_CLIENT_SECRET
                </code>
                à votre fichier <code>.env</code>.
              </div>
            )}
          </div>

          <p className="mt-8 text-xs text-neutral-500">
            En continuant, vous acceptez nos{" "}
            <Link href="/conditions" className="underline">
              conditions
            </Link>{" "}
            et notre{" "}
            <Link href="/politique-confidentialite" className="underline">
              politique de confidentialité
            </Link>
            .
          </p>
        </div>

        <p className="mt-6 text-sm text-neutral-600">
          Besoin d’aide ?{" "}
          <Link className="underline" href="/aide">
            Visitez notre centre d’aide
          </Link>
        </p>
      </section>
      <Footer />
    </>
  );
}

function GoogleGlyph() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-5 w-5"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.52 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
