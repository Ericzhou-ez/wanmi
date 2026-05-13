import Footer from "components/layout/footer";

export const metadata = {
  title: "Accessibilité",
  description: "Notre engagement pour une expérience accessible.",
};

export default function AccessibilitePage() {
  return (
    <>
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-12">
        <h1 className="text-4xl font-semibold text-neutral-900">
          Accessibilité
        </h1>
        <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
          <p className="text-sm text-neutral-700">
            Nous travaillons à rendre ce site plus accessible: contrastes,
            navigation clavier et libellés explicites. Si vous rencontrez un
            problème, dites-nous ce qui bloque afin qu’on puisse l’améliorer.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

