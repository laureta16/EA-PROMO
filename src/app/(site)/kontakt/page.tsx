import type { Metadata } from "next";
import { OrderForm } from "@/components/OrderForm";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Na kontaktoni në EA Promo për oferta, dizajn dhe porosi të personalizuara.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <div className="container-x py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent)]">Na kontaktoni</h1>
      <p className="text-[var(--muted)] mt-2 max-w-2xl">
        Lëreni një mesazh dhe ekipi ynë do t&apos;ju kthehet brenda 24 orëve, ose na shkruani direkt në
        WhatsApp/Instagram.
      </p>

      <div className="grid lg:grid-cols-2 gap-10 mt-10">
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Email</h3>
            <a href={`mailto:${site.email}`} className="text-[var(--brand)] font-medium">
              {site.email}
            </a>
          </div>
          {site.whatsappNumber && (
            <div className="card p-6">
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <a
                href={whatsappLink("Përshëndetje! Dua të kërkoj një ofertë.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Bisedo në WhatsApp
              </a>
            </div>
          )}
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Instagram</h3>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              @ea_promo
            </a>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Lër një vlerësim</h3>
            <p className="text-sm text-[var(--muted)] mb-3">Ndani përvojën tuaj me të tjerët.</p>
            <a
              href={site.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              ★ Vlerëso në Google
            </a>
          </div>
        </div>

        <OrderForm />
      </div>
    </div>
  );
}
