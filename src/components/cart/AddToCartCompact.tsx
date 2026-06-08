"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export function AddToCartCompact(props: {
  productId: number;
  slug: string;
  name: string;
  price_cents: number;
  image_url: string | null;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add(props, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-[var(--brand-dark)] text-xs font-bold border border-white shadow-sm hover:bg-[var(--brand-dark)] hover:text-white transition-colors"
    >
      {added ? "✓ Shtuar" : "+ Shportë"}
    </button>
  );
}
