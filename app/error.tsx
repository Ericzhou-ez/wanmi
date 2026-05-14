"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12">
      <h2 className="text-xl font-bold">Une erreur est survenue</h2>
      <p className="my-2">
        Un problème temporaire est apparu sur la boutique. Merci de réessayer
        votre action.
      </p>
      <button
        type="button"
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-red-600 p-4 tracking-wide text-white hover:opacity-90"
        onClick={() => reset()}
      >
        Réessayer
      </button>
    </div>
  );
}
