"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductWithCategory } from "@/lib/types";
import { formatLek } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type Mode = "cards" | "grid";

const STORAGE_KEY = "eapromo_catalog_view";

export function CatalogView({ products }: { products: ProductWithCategory[] }) {
  const [mode, setMode] = useState<Mode>("cards");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
      if (saved === "cards" || saved === "grid") setMode(saved);
    } catch {}
  }, []);

  function set(m: Mode) {
    setMode(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {}
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[var(--muted)]">
          {products.length} {products.length === 1 ? "produkt" : "produkte"}
        </p>
        <div
          role="tablist"
          aria-label="Pamja e produkteve"
          className="inline-flex border border-[var(--border)] rounded-lg bg-white overflow-hidden text-sm"
        >
          <button
            role="tab"
            aria-selected={mode === "cards"}
            onClick={() => set("cards")}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
              mode === "cards" ? "bg-[var(--brand)] text-white" : "text-[var(--accent)] hover:bg-[var(--brand-soft)]"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="8" height="9" rx="1.5" />
              <rect x="13" y="3" width="8" height="9" rx="1.5" />
              <rect x="3" y="14" width="8" height="7" rx="1.5" />
              <rect x="13" y="14" width="8" height="7" rx="1.5" />
            </svg>
            Karta
          </button>
          <button
            role="tab"
            aria-selected={mode === "grid"}
            onClick={() => set("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
              mode === "grid" ? "bg-[var(--brand)] text-white" : "text-[var(--accent)] hover:bg-[var(--brand-soft)]"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="5" height="5" />
              <rect x="9.5" y="3" width="5" height="5" />
              <rect x="16" y="3" width="5" height="5" />
              <rect x="3" y="9.5" width="5" height="5" />
              <rect x="9.5" y="9.5" width="5" height="5" />
              <rect x="16" y="9.5" width="5" height="5" />
              <rect x="3" y="16" width="5" height="5" />
              <rect x="9.5" y="16" width="5" height="5" />
              <rect x="16" y="16" width="5" height="5" />
            </svg>
            Grid
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-[var(--muted)]">Asnjë produkt për momentin.</p>
      ) : mode === "cards" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/produkte/${p.slug}`}
              className="group flex flex-col bg-white border border-[var(--border)] rounded-md overflow-hidden hover:border-[var(--brand)] hover:shadow-md transition"
              title={p.name}
            >
              <div className="relative aspect-square paper-bg">
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-contain p-4 group-hover:scale-[1.05] transition-transform duration-300"
                  />
                ) : (
                  <div className="grid place-items-center h-full">
                    <Image src="/logo.jpg" alt="" width={48} height={48} className="rounded-full opacity-60" />
                  </div>
                )}
              </div>
              <div className="px-2 py-2 border-t border-[var(--border)]">
                <div className="text-[11px] font-semibold text-[var(--accent)] line-clamp-1 leading-tight">
                  {p.name}
                </div>
                <div className="text-[12px] font-bold text-[var(--brand)] mt-0.5">
                  {formatLek(p.price_cents)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
