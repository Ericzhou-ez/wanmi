import Footer from "components/layout/footer";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type InspirationContent = {
  title: string;
  intro: string;
  palette: string;
  textures: string;
  focusCollection: {
    label: string;
    href: string;
  };
};

const inspirations: Record<string, InspirationContent> = {
  "paris-elegant": {
    title: "Paris Élégant",
    intro:
      "Une ambiance où les pièces fortes rencontrent des matières enveloppantes et un éclairage subtil.",
    palette: "Ivoire chaud, brun cacao, doré patiné, noir profond.",
    textures: "Velours brossé, laine bouclée, bois fumé, métal mat.",
    focusCollection: {
      label: "Voir la collection Salon",
      href: "/collections/salon",
    },
  },
  "calme-mineral": {
    title: "Calme Minéral",
    intro:
      "Une direction douce et lumineuse pensée pour ralentir le rythme visuel et créer une sensation de sérénité.",
    palette: "Sable, pierre, crème, sauge pâle.",
    textures: "Lin lavé, céramique brute, travertin, coton texturé.",
    focusCollection: {
      label: "Voir la collection Chambre",
      href: "/collections/chambre",
    },
  },
  "esprit-galerie": {
    title: "Esprit Galerie",
    intro:
      "Un intérieur affirmé qui met en scène les volumes, les contrastes et les objets de caractère.",
    palette: "Blanc galerie, graphite, terracotta, accents métalliques.",
    textures: "Laque satinée, bois nervuré, verre fumé, cuir lisse.",
    focusCollection: {
      label: "Voir la collection Décoration",
      href: "/collections/decoration",
    },
  },
};

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const content = inspirations[params.slug];

  if (!content) return notFound();

  return {
    title: content.title,
    description: content.intro,
  };
}

export function generateStaticParams() {
  return Object.keys(inspirations).map((slug) => ({ slug }));
}

export default async function InspirationDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const content = inspirations[params.slug];

  if (!content) return notFound();

  return (
    <>
      <section className="mx-auto mt-8 max-w-(--breakpoint-2xl) px-4 pb-14">
        <Link
          href="/inspirations"
          className="text-sm text-neutral-600 underline-offset-4 hover:underline"
        >
          ← Retour aux inspirations
        </Link>

        <article className="mt-4 rounded-[2rem] border border-neutral-200 bg-white p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Ambiance
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-neutral-900">
            {content.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-700">
            {content.intro}
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-neutral-50 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                Palette recommandée
              </h2>
              <p className="mt-2 text-sm text-neutral-700">{content.palette}</p>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                Matières clés
              </h2>
              <p className="mt-2 text-sm text-neutral-700">
                {content.textures}
              </p>
            </div>
          </div>

          <Link
            href={content.focusCollection.href}
            className="mt-8 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            {content.focusCollection.label}
          </Link>
        </article>
      </section>
      <Footer />
    </>
  );
}
