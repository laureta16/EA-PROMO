"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState, useEffect } from "react";
import { useCart } from "./CartProvider";
import { formatLek } from "@/lib/types";
import { checkoutAction, type CheckoutFormState } from "@/app/actions/checkout";

const initial: CheckoutFormState = { ok: false, message: "" };

export function CartView() {
  const { items, total, count, setQuantity, remove, clear, ready } = useCart();
  const [state, action, pending] = useActionState(checkoutAction, initial);

  useEffect(() => {
    if (state.ok) clear();
  }, [state.ok, clear]);

  if (!ready) {
    return <div className="mt-10 text-[var(--muted)]">Po ngarkohet shporta...</div>;
  }

  if (state.ok) {
    return (
      <div className="mt-10 card p-8 bg-[var(--brand-soft)] border-[var(--brand)]">
        <h2 className="font-bold text-xl text-[var(--brand-dark)]">Faleminderit!</h2>
        <p className="text-[var(--accent)] mt-2">{state.message}</p>
        <Link href="/produkte" className="btn btn-primary mt-5">Vazhdo blerjet</Link>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mt-10 card p-10 text-center">
        <p className="text-[var(--muted)]">Shporta juaj është bosh.</p>
        <Link href="/produkte" className="btn btn-primary mt-5">Shiko produktet</Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
      {/* Items */}
      <div className="card divide-y divide-[var(--border)]">
        {items.map((it) => (
          <div key={it.productId} className="p-4">
            <div className="flex gap-3 sm:gap-4">
              <Link
                href={`/produkte/${it.slug}`}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-[var(--paper)] paper-bg shrink-0 border border-[var(--border)]"
              >
                {it.image_url && (
                  <Image src={it.image_url} alt={it.name} fill sizes="96px" className="object-contain p-2" />
                )}
              </Link>

              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/produkte/${it.slug}`}
                    className="font-semibold text-[var(--accent)] hover:text-[var(--brand)] line-clamp-2 leading-tight"
                  >
                    {it.name}
                  </Link>
                  <button
                    onClick={() => remove(it.productId)}
                    className="shrink-0 text-[var(--muted)] hover:text-red-600 text-lg leading-none p-1 -m-1"
                    aria-label="Fshi"
                    title="Fshi nga shporta"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-sm text-[var(--muted)] mt-1">
                  {formatLek(it.price_cents)} <span className="opacity-60">/ copë</span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center border border-[var(--border)] rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(it.productId, it.quantity - 1)}
                      className="w-9 h-9 grid place-items-center hover:bg-[var(--brand-soft)] text-[var(--accent)] text-lg leading-none"
                      aria-label="Më pak"
                    >−</button>
                    <span className="w-10 text-center font-semibold text-[var(--accent)]">{it.quantity}</span>
                    <button
                      onClick={() => setQuantity(it.productId, it.quantity + 1)}
                      className="w-9 h-9 grid place-items-center hover:bg-[var(--brand-soft)] text-[var(--accent)] text-lg leading-none"
                      aria-label="Më shumë"
                    >+</button>
                  </div>
                  <div className="font-bold text-[var(--accent)] text-base">
                    {formatLek(it.price_cents * it.quantity)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="p-4 flex flex-wrap gap-3 justify-between items-center text-sm">
          <button onClick={clear} className="text-[var(--muted)] hover:text-red-600">Pastro shportën</button>
          <Link href="/produkte" className="text-[var(--brand)] hover:underline font-medium">+ Shto produkte të tjera</Link>
        </div>
      </div>

      {/* Checkout form */}
      <form action={action} className="card p-6 space-y-4 lg:sticky lg:top-24">
        <h2 className="font-bold text-lg">Përfundo porosinë</h2>
        <div className="text-sm flex justify-between"><span className="text-[var(--muted)]">Artikuj:</span><span className="font-semibold">{count}</span></div>
        <div className="text-base flex justify-between border-t border-[var(--border)] pt-3">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-[var(--brand)] text-lg">{formatLek(total)}</span>
        </div>

        <input type="hidden" name="items_json" value={JSON.stringify(items.map((i) => ({
          product_id: i.productId,
          product_name: i.name,
          product_slug: i.slug,
          quantity: i.quantity,
          price_cents: i.price_cents,
        })))} />

        <div className="field">
          <label htmlFor="customer_name">Emri *</label>
          <input id="customer_name" name="customer_name" required className="input" />
        </div>
        <div className="field">
          <label htmlFor="phone">Telefon *</label>
          <input id="phone" name="phone" required className="input" placeholder="+355 ..." />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" />
        </div>
        <div className="field">
          <label htmlFor="address">Adresa e dorëzimit</label>
          <input id="address" name="address" className="input" />
        </div>
        <div className="field">
          <label htmlFor="notes">Shënime (dizajn, ngjyrë, etj.)</label>
          <textarea id="notes" name="notes" className="textarea" />
        </div>

        {state.message && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}

        <button type="submit" disabled={pending} className="btn btn-primary w-full">
          {pending ? "Po dërgohet..." : "Përfundo porosinë"}
        </button>
        <p className="text-xs text-[var(--muted)]">
          Pagesa kryhet me dorëzim. Ekipi ynë ju kontakton për konfirmim.
        </p>
      </form>
    </div>
  );
}
