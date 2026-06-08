"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export function AddToCart({
  productId,
  slug,
  name,
  price_cents,
  image_url,
}: {
  productId: number;
  slug: string;
  name: string;
  price_cents: number;
  image_url: string | null;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add({ productId, slug, name, price_cents, image_url }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center border border-[var(--border)] rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-10 h-10 grid place-items-center hover:bg-[var(--brand-soft)]"
          aria-label="Më pak"
        >−</button>
        <span className="w-10 text-center font-semibold">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="w-10 h-10 grid place-items-center hover:bg-[var(--brand-soft)]"
          aria-label="Më shumë"
        >+</button>
      </div>
      <button type="button" onClick={handleAdd} className="btn btn-primary">
        {added ? "✓ Shtuar në shportë" : "Shto në shportë"}
      </button>
    </div>
  );
}
