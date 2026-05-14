"use client";

import { useActionState } from "react";

import {
  submitReturnRequest,
} from "app/account/returns/actions";
import type {
  ReturnReasonOption,
  ReturnableLine,
  SubmitReturnState,
} from "types/account";

const initialState: SubmitReturnState = { status: "idle" };

export function ReturnRequestForm({
  orderId,
  orderName,
  lines,
  reasons,
}: {
  orderId: string;
  orderName: string;
  lines: ReturnableLine[];
  reasons: ReturnReasonOption[];
}) {
  const [state, formAction, pending] = useActionState(
    submitReturnRequest,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-neutral-200 bg-white p-6"
    >
      <input type="hidden" name="orderId" value={orderId} />
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
        Nouvelle demande de retour
      </p>
      <h2 className="mt-1 text-xl font-semibold text-neutral-900">
        Commande {orderName}
      </h2>

      <ul className="mt-5 space-y-3">
        {lines.map((line) => (
          <li
            key={line.fulfillmentLineItemId}
            className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-neutral-900">{line.title}</p>
              <p className="text-xs text-neutral-500">
                Retournable: jusqu’à {line.availableQuantity}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              Quantité
              <input
                type="number"
                name={`qty:${line.fulfillmentLineItemId}`}
                min={0}
                max={line.availableQuantity}
                defaultValue={0}
                className="h-9 w-20 rounded-md border border-neutral-300 px-2 text-sm"
              />
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-neutral-700">Raison</span>
          <select
            name="reason"
            defaultValue="OTHER"
            className="mt-1 h-10 w-full rounded-md border border-neutral-300 bg-white px-2 text-sm"
          >
            {reasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-neutral-700">Note (optionnel)</span>
          <input
            type="text"
            name="note"
            maxLength={300}
            placeholder="Précisez si besoin"
            className="mt-1 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
      >
        {pending ? "Envoi en cours…" : "Envoyer la demande"}
      </button>

      {state.status === "success" ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {state.message}
          {state.returnName ? ` — Référence: ${state.returnName}` : ""}
        </p>
      ) : null}
      {state.status === "error" ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
