import Link from "next/link";
import Image from "next/image";
import { site, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24">
      {/* ---------- MAP / ADDRESS SECTION ---------- */}
      <section className="border-t border-[var(--border)] bg-white">
        <div className="container-x py-12 grid md:grid-cols-2 gap-8 items-stretch">
          <div className="flex flex-col justify-center">
            <p className="script text-2xl text-[var(--brand)]">Vizitoni studion tonë</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--accent)] mt-1">Na gjeni në Tiranë</h2>
            <p className="text-[var(--muted)] mt-4 leading-relaxed">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              <span className="text-xs text-[var(--muted)]">Plus Code: {site.address.plusCode}</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={site.address.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Hap në Google Maps
              </a>
              {site.whatsappNumber && (
                <a
                  href={whatsappLink("Përshëndetje, dua të vij në studion tuaj.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  Cakto takim
                </a>
              )}
            </div>
            <div className="mt-6 text-sm text-[var(--muted)] space-y-1">
              <div>
                ✉{" "}
                <a href={`mailto:${site.email}`} className="hover:text-[var(--brand)]">
                  {site.email}
                </a>
              </div>
              <div>
                ⌖{" "}
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand)]">
                  Instagram @ea_promo
                </a>
              </div>
            </div>
          </div>

          <div className="relative w-full min-h-[280px] md:min-h-[360px] rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
            <iframe
              title="Lokacioni i EA Promo në hartë"
              src={site.address.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ---------- FOOTER COLUMNS ---------- */}
      <div className="border-t border-[var(--border)] bg-white">
        <div className="container-x py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 font-bold text-lg">
              <span className="logo-mark">
                <Image src="/logo.jpg" alt="EA Promo" width={72} height={72} />
              </span>
              <span className="text-[var(--accent)]">EA Promo</span>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)] max-w-md">{site.description}</p>
            <a
              href={site.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline mt-5"
            >
              <span aria-hidden>★</span> Lër një vlerësim në Google
            </a>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--accent)]">Navigimi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[var(--brand)]">Kreu</Link></li>
              <li><Link href="/produkte" className="hover:text-[var(--brand)]">Produkte</Link></li>
              <li><Link href="/oferta" className="hover:text-[var(--brand)]">Oferta</Link></li>
              <li><Link href="/kontakt" className="hover:text-[var(--brand)]">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--accent)]">Na kontaktoni</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-[var(--brand)]">
                  {site.email}
                </a>
              </li>
              {site.whatsappNumber && (
                <li>
                  <a
                    href={whatsappLink("Përshëndetje, dua të porosit nga EA Promo.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--brand)]"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand)]">
                  Instagram @ea_promo
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--border)]">
          <div className="container-x py-5 text-xs text-[var(--muted)] flex flex-col sm:flex-row justify-between gap-2">
            <span>© {new Date().getFullYear()} EA Promo. Të gjitha të drejtat e rezervuara.</span>
            <span>Tiranë, Shqipëri</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
