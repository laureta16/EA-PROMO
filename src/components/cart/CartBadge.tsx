"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartBadge() {
  const { count, ready } = useCart();
  return (
    <Link
      href="/shporta"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--border)] bg-white hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
      aria-label="Shporta"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6h15l-1.5 9h-12z" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M6 6L5 3H2" />
      </svg>
      {ready && count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[var(--brand)] text-white text-[11px] font-bold grid place-items-center">
          {count}
        </span>
      )}
    </Link>
  );
}
