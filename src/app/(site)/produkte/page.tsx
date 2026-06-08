import type { Metadata } from "next";
import Link from "next/link";
import { CatalogView } from "@/components/CatalogView";
import { getCategoryBySlug, listCategories, listProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Produkte",
  description:
    "Shfletoni katalogun tonë: printime, materiale promocionale, veshje dhe dhurata të personalizuara.",
  alternates: { canonical: "/produkte" },
};

export default async function ProduktePage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const categories = listCategories();
  const current = kategori ? getCategoryBySlug(kategori) : undefined;
  const products = listProducts({ categorySlug: current?.slug });

  return (
    <div className="container-x py-10 md:py-14">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent)]">
          {current ? current.name : "Të gjitha produktet"}
        </h1>
        <p className="text-[var(--muted)] mt-2">
          {current?.description ?? "Eksploroni gjithë katalogun tonë të produkteve dhe shërbimeve."}
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/produkte"
          className={`btn ${!current ? "btn-primary" : "btn-outline"}`}
        >
          Të gjitha
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/produkte?kategori=${c.slug}`}
            className={`btn ${current?.id === c.id ? "btn-primary" : "btn-outline"}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <CatalogView products={products} />
    </div>
  );
}
