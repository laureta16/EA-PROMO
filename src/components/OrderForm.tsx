"use client";

import { useActionState } from "react";
import { submitOrderAction, type OrderFormState } from "@/app/actions/order";

const initial: OrderFormState = { ok: false, message: "" };

export function OrderForm({
  productId,
  productName,
}: {
  productId?: number;
  productName?: string;
}) {
  const [state, action, pending] = useActionState(submitOrderAction, initial);

  if (state.ok) {
    return (
      <div className="card p-6 bg-[var(--brand-soft)] border-[var(--brand)]">
        <h3 className="font-bold text-lg text-[var(--brand-dark)]">Faleminderit!</h3>
        <p className="text-sm text-[var(--accent)] mt-2">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="card p-6 space-y-4">
      <h3 className="font-bold text-lg">
        {productName ? `Porosit: ${productName}` : "Bëj një kërkesë"}
      </h3>
      {productId ? <input type="hidden" name="product_id" value={productId} /> : null}
      {productName ? <input type="hidden" name="product_name" value={productName} /> : null}

      <div className="field">
        <label htmlFor="customer_name">Emri juaj *</label>
        <input id="customer_name" name="customer_name" required className="input" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="field">
          <label htmlFor="phone">Telefon *</label>
          <input id="phone" name="phone" required className="input" placeholder="+355 ..." />
        </div>
        <div className="field">
          <label htmlFor="quantity">Sasia</label>
          <input id="quantity" name="quantity" type="number" min={1} defaultValue={1} className="input" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="email">Email (opsional)</label>
        <input id="email" name="email" type="email" className="input" />
      </div>
      <div className="field">
        <label htmlFor="address">Adresa (opsional)</label>
        <input id="address" name="address" className="input" />
      </div>
      <div className="field">
        <label htmlFor="notes">Shënime</label>
        <textarea id="notes" name="notes" className="textarea" placeholder="Detaje shtesë, dizajn i preferuar..." />
      </div>

      {state.message && !state.ok && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? "Po dërgohet..." : "Dërgo porosinë"}
      </button>
      <p className="text-xs text-[var(--muted)]">
        Duke dërguar porosinë, pranoni që ne t'ju kontaktojmë për të konfirmuar detajet.
      </p>
    </form>
  );
}
