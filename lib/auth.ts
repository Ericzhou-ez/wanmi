import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { syncShopifyCustomer } from "lib/shopify/customer-sync";

declare module "next-auth" {
  interface Session {
    user: {
      shopifyCustomerId?: string | null;
      shopifyCustomerCreated?: boolean;
    } & DefaultSession["user"];
  }
}

type ShopifyTokenFields = {
  shopifyCustomerId?: string | null;
  shopifyCustomerCreated?: boolean;
};

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const isGoogleConfigured = Boolean(googleClientId && googleClientSecret);

if (!isGoogleConfigured && process.env.NODE_ENV !== "production") {
  console.warn(
    "[auth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set. Google sign-in will be disabled until they are configured.",
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  providers: isGoogleConfigured
    ? [
        Google({
          clientId: googleClientId!,
          clientSecret: googleClientSecret!,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
            },
          },
        }),
      ]
    : [],
  callbacks: {
    async jwt({ token, user, trigger }) {
      const enriched = token as typeof token & ShopifyTokenFields;
      if ((trigger === "signIn" || trigger === "signUp") && user?.email) {
        try {
          const result = await syncShopifyCustomer({
            email: user.email,
            name: user.name ?? undefined,
          });
          enriched.shopifyCustomerId = result.customerId;
          enriched.shopifyCustomerCreated = result.created;
        } catch (e) {
          console.warn(
            "[auth] Shopify customer sync failed during sign-in:",
            e instanceof Error ? e.message : String(e),
          );
        }
      }
      return enriched;
    },
    async session({ session, token }) {
      const fields = token as typeof token & ShopifyTokenFields;
      if (session.user) {
        session.user.shopifyCustomerId = fields.shopifyCustomerId ?? null;
        session.user.shopifyCustomerCreated = Boolean(
          fields.shopifyCustomerCreated,
        );
      }
      return session;
    },
  },
});
