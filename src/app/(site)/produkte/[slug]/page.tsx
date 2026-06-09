import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderForm } from "@/components/OrderForm";
import { AddToCart } from "@/components/cart/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, listProducts } from "@/lib/queries";
import { formatLek } from "@/lib/types";
import { site, whatsappLink } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return { title: "Produkti nuk u gjet" };
  return {
    title: p.name,
    description: p.description,
    alternates: { canonical: `/produkte/${p.slug}` },
    openGraph: {
      title: p.name,
      description: p.description,
      images: p.image_url ? [p.image_url] : undefined,
      type: "website",
    },
  };
}

export default async function ProduktDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = listProducts({ categorySlug: product.category_slug ?? undefined })
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image_url ? [product.image_url] : undefined,
    sku: String(product.id),
    category: product.category_name ?? undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "ALL",
      price: (product.price_cents / 1).toFixed(0),
      availability: "https://schema.org/InStock",
      url: `${site.url}/produkte/${product.slug}`,
    },
  };

  return (
    <div className="container-x py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <nav className="text-sm text-[var(--muted)] mb-6">
        <Link href="/" className="hover:text-[var(--brand)]">Kreu</Link> /{" "}
        <Link href="/produkte" className="hover:text-[var(--brand)]">Produkte</Link>
        {product.category_slug && (
          <>
            {" / "}
            <Link href={`/produkte?kategori=${product.category_slug}`} className="hover:text-[var(--brand)]">
              {product.category_name}
            </Link>
          </>
        )}
        {" / "}<span className="text-[var(--accent)]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="relative aspect-square card bg-[var(--brand-soft)]">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="grid place-items-center h-full text-[var(--muted)]">Pa foto</div>
          )}
        </div>

        <div>
          {product.category_name && (
            <p className="text-sm text-[var(--brand)] font-semibold uppercase tracking-wide">
              {product.category_name}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent)] mt-2">{product.name}</h1>
          <p className="text-2xl font-bold text-[var(--brand)] mt-4">{formatLek(product.price_cents)}</p>
          <p className="text-[var(--foreground)] mt-5 leading-relaxed">{product.description}</p>

          <div className="mt-7">
            <AddToCart
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price_cents={product.price_cents}
              image_url={product.image_url}
            />
          </div>

          {site.whatsappNumber && (
            <a
              href={whatsappLink(`Përshëndetje! Dua më shumë informacion për: ${product.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline mt-4"
            >
              Pyet në WhatsApp
            </a>
          )}

          <details className="mt-8 group">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--accent)] hover:text-[var(--brand)]">
              Ose porosit drejtpërdrejt këtë artikull →
            </summary>
            <div className="mt-4">
              <OrderForm productId={product.id} productName={product.name} />
            </div>
          </details>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-[var(--accent)] mb-6">Produkte të ngjashme</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
