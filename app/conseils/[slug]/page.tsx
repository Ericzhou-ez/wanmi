import Footer from "components/layout/footer";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type GuideContent = {
  title: string;
  intro: string;
  steps: string[];
  cta: {
    label: string;
    href: string;
  };
};

const guides: Record<string, GuideContent> = {
  "styler-salon-moderne": {
    title: "Styler un salon moderne",
    intro:
      "Le salon est la pièce d'accueil. Il doit équilibrer circulation, confort et impact visuel.",
    steps: [
      "Définissez un point focal : canapé, œuvre murale ou luminaire central.",
      "Associez trois matières majeures maximum pour garder une lecture claire.",
      "Terminez par une couche textile (coussins, plaid, tapis) pour adoucir l'ensemble.",
    ],
    cta: { label: "Découvrir la collection Salon", href: "/collections/salon" },
  },
  "chambre-cocon": {
    title: "Créer une chambre cocon",
    intro:
      "Une chambre réussie combine apaisement visuel, textile généreux et lumière enveloppante.",
    steps: [
      "Privilégiez une base de teintes sourdes : ivoire, beige, taupe, grège.",
      "Superposez drap, couette, plaid et coussins pour créer de la profondeur.",
      "Ajoutez une lampe d'appoint chaude à hauteur des yeux pour l'ambiance soir.",
    ],
    cta: {
      label: "Explorer la collection Literie",
      href: "/collections/literie",
    },
  },
  "recevoir-avec-style": {
    title: "Recevoir avec style",
    intro:
      "La salle à manger devient mémorable grâce à l'équilibre entre fonctionnalité et mise en scène.",
    steps: [
      "Choisissez une table adaptée au rythme de vie (quotidien, invités, modulable).",
      "Misez sur des assises confortables qui invitent à prolonger le repas.",
      "Travaillez la table par strates : nappe, vaisselle, verrerie et lumière douce.",
    ],
    cta: {
      label: "Voir la collection Salle à Manger",
      href: "/collections/salle-a-manger",
    },
  },
};

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const content = guides[params.slug];

  if (!content) return notFound();

  return {
    title: content.title,
    description: content.intro,
  };
}

export function generateStaticParams() {
  return Object.keys(guides).map((slug) => ({ slug }));
}

export default async function ConseilsDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const content = guides[params.slug];

  if (!content) return notFound();

  return (
    <>
      <section className="mx-auto mt-8 max-w-(--breakpoint-2xl) px-4 pb-14">
        <Link
          href="/conseils"
          className="text-sm text-neutral-600 underline-offset-4 hover:underline"
        >
          ← Retour aux conseils
        </Link>

        <article className="mt-4 rounded-[2rem] border border-neutral-200 bg-white p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Guide pratique
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-neutral-900">
            {content.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-700">
            {content.intro}
          </p>
          <ol className="mt-7 space-y-3">
            {content.steps.map((step) => (
              <li
                key={step}
                className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700"
              >
                {step}
              </li>
            ))}
          </ol>
          <Link
            href={content.cta.href}
            className="mt-8 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            {content.cta.label}
          </Link>
        </article>
      </section>
      <Footer />
    </>
  );
}
