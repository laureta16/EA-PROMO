import type { Metadata } from "next";
import { listActiveOffers } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Oferta",
  description: "Ofertat aktuale të EA Promo për biznesin dhe klientët tanë.",
  alternates: { canonical: "/oferta" },
};

export default async function OfertaPage() {
  const offers = await listActiveOffers();
  return (
    <div className="container-x py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent)]">Oferta aktuale</h1>
      <p className="text-[var(--muted)] mt-2">Mos i humb ofertat tona të kohëpaskohshme.</p>

      <div className="grid md:grid-cols-2 gap-5 mt-8">
        {offers.length === 0 && (
          <p className="text-[var(--muted)]">Nuk ka oferta aktive për momentin.</p>
        )}
        {offers.map((o) => (
          <div key={o.id} className="card p-6 bg-gradient-to-br from-[var(--brand-soft)] to-white">
            <div className="flex items-start gap-4">
              {o.discount_percent > 0 && (
                <div className="shrink-0 w-16 h-16 rounded-full bg-[var(--brand)] text-white grid place-items-center font-bold">
                  -{o.discount_percent}%
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg text-[var(--accent)]">{o.title}</h3>
                <p className="text-sm text-[var(--muted)] mt-1">{o.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
