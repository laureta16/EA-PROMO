import Link from "next/link";
import Image from "next/image";
import type { ProductWithCategory } from "@/lib/types";
import { formatLek } from "@/lib/types";
import { AddToCartCompact } from "./cart/AddToCartCompact";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const shortLabel = product.name.split(" ").slice(0, 3).join(" ");

  return (
    <article className="product-tile group">
      {/* Image area on paper background */}
      <Link href={`/produkte/${product.slug}`} className="block relative">
        <span className="absolute top-3 left-3 z-20">
          <span className="tag-label">{shortLabel}</span>
        </span>
        <span className="tile-watermark" aria-hidden>
          <Image src="/logo.jpg" alt="" width={80} height={80} />
        </span>
        <div className="relative aspect-square paper-bg">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain p-8 group-hover:scale-[1.05] transition-transform duration-300"
            />
          ) : (
            <div className="grid place-items-center h-full">
              <div className="text-center">
                <Image
                  src="/logo.jpg"
                  alt=""
                  width={96}
                  height={96}
                  className="mx-auto rounded-full opacity-70 group-hover:opacity-90 transition-opacity"
                />
                <div className="mt-3 script text-2xl text-[var(--brand)]">
                  {product.category_name ?? "EA Promo"}
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Diagonal blue accent strip (thin divider, IG-post style) */}
      <div className="tile-accent" aria-hidden />

      {/* White footer with info */}
      <div className="px-4 py-3.5 bg-white">
        <Link href={`/produkte/${product.slug}`} className="block">
          {product.category_name && (
            <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--brand)] font-bold">
              {product.category_name}
            </div>
          )}
          <h3 className="font-bold text-[15px] leading-tight mt-0.5 line-clamp-1 text-[var(--accent)]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="font-bold text-[var(--brand)] text-base">
            {formatLek(product.price_cents)}
          </span>
          <AddToCartCompact
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price_cents={product.price_cents}
            image_url={product.image_url}
          />
        </div>
      </div>
    </article>
  );
}
