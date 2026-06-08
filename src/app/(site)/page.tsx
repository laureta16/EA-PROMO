import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { getFeaturedProducts, listActiveOffers, listCategories } from "@/lib/queries";
import { site, whatsappLink } from "@/lib/site";

const SHOWCASE_POSTS = [
  { src: "/showcase/set-biznesi.png", title: "Set për biznesin tuaj", subtitle: "Tote bag · Termus · Notebook · USB", href: "/produkte/set-biznesi-complete" },
  { src: "/showcase/produkte-promocionale.png", title: "Pako e plotë promocionale", subtitle: "Uniforme · Stilolaps · Notebook · Termus · Vula", href: "/produkte/pako-promocionale" },
  { src: "/showcase/bracelet.png", title: "Bracelet me logo", subtitle: "Silikon · Të gjitha ngjyrat", href: "/produkte/bracelet-silicon" },
  { src: "/showcase/trofe.png", title: "Trofe & kupa rezine", subtitle: "40/46/52 cm · Pllakë e gdhendur", href: "/produkte/trofe-resine" },
];

export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const categories = listCategories();
  const offers = listActiveOffers();

  const productLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: featured.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.url}/produkte/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />

      {/* ---------- HERO ---------- */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container-x py-14 md:py-20 grid md:grid-cols-12 gap-10 items-center relative">
          <div className="md:col-span-7 relative z-10">
            <div className="flex items-center gap-3">
              <span className="badge">Produkte #Promocionale</span>
              <span className="text-xs text-[var(--muted)]">Tirana, Albania</span>
            </div>
            <p className="script text-3xl md:text-4xl text-[var(--brand)] mt-5 leading-tight">
              Set për biznesin tuaj.
            </p>
            <h1 className="mt-2 text-4xl md:text-6xl font-bold tracking-tight text-[var(--accent)] leading-[1.03]">
              T‑Shirt, Banner, Filxhana,<br />Print &amp; Stilolapsa.
            </h1>
            <p className="mt-5 text-lg text-[var(--muted)] max-w-xl">
              Materiale promocionale të personalizuara me logon, ngjyrat dhe identitetin
              e biznesit tuaj — dizajn, printim dhe dorëzim në të gjithë Shqipërinë.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/produkte" className="btn btn-primary">Shiko produktet</Link>
              {site.whatsappNumber && (
                <a
                  href={whatsappLink("Përshëndetje! Dua të kërkoj një ofertë.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  WhatsApp
                </a>
              )}
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-[var(--muted)]">
              <span>✔ Dizajn falas</span>
              <span>✔ Mostra para porosisë</span>
              <span>✔ Dorëzim në Shqipëri</span>
            </div>
          </div>

          {/* Logo composition — IG-style gradient ring + floating animation */}
          <div className="md:col-span-5 relative">
            <div className="relative max-w-[210px] sm:max-w-[270px] md:max-w-sm mx-auto logo-float">
              <div className="logo-ring">
                <span className="logo-ring-inner">
                  <Image src="/logo.jpg" alt="EA Promo" width={360} height={360} priority className="rounded-full w-full h-auto" />
                </span>
              </div>
              <span className="absolute -top-2 -left-2 tag-label rotate-[-6deg] text-[10px] md:text-xs">EA · PROMO</span>
              <span className="absolute -bottom-2 -right-2 tag-label rotate-[5deg] text-[10px] md:text-xs">EST. TIRANA</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MARQUEE STRIP ---------- */}
      <section className="bg-[var(--accent)] py-1.5 overflow-hidden">
        <div className="marquee">
          <div className="marquee-track text-white/80 text-[11px] tracking-wide uppercase">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="marquee-group">
                <span className="script normal-case text-base text-[var(--brand-light)] mx-4">Promovime me stil</span>
                <span className="mx-4">★ Dizajn falas</span>
                <span className="mx-4">★ Brandim i plotë i biznesit</span>
                <span className="mx-4">★ Dorëzim në të gjithë Shqipërinë</span>
                <span className="mx-4">★ +9k ndjekës në Instagram</span>
                <span className="mx-4">★ Çmime konkurruese</span>
                <span className="mx-4">★ Mostra para porosisë</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- IG-STYLE CATEGORY CHIPS ---------- */}
      <section className="container-x py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="script text-2xl text-[var(--brand)]">Kategoritë tona</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--accent)]">Çfarë printojmë &amp; personalizojmë</h2>
          </div>
          <Link href="/produkte" className="hidden sm:inline text-sm font-medium hover:text-[var(--brand)]">
            Të gjitha →
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/produkte?kategori=${c.slug}`}
              className="flex flex-col items-center gap-2 group"
            >
              <CategoryIcon slug={c.slug} />
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)] text-center leading-tight">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- "SET PËR BIZNESIN TUAJ" CALLOUT ---------- */}
      <section className="container-x py-8">
        <div className="paper-bg card relative overflow-hidden p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="script text-3xl md:text-5xl text-[var(--brand)] leading-tight">
              Set për biznesin tuaj.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-[var(--accent)] font-semibold">
              {["Stilolaps", "Notebook", "Tote Bag", "Termus", "USB", "Varse çelësash", "Filxhan"].map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-[var(--brand)] rounded-[3px] text-[var(--brand)] text-[10px] leading-3 text-center">✓</span>
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[var(--muted)] max-w-md">
              Një set komplet, i dizajnuar dhe printuar për të lënë përshtypje në çdo evento, panair
              apo takim biznesi.
            </p>
            <Link href="/produkte/set-biznesi-complete" className="btn btn-primary mt-6">
              Shiko setin
            </Link>
          </div>
          <div className="relative h-80 md:h-96">
            <Image
              src="/showcase/set-biznesi.png"
              alt="Set biznesi promocional"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* ---------- SHOWCASE: real IG-style posts ---------- */}
      <section className="container-x py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="script text-2xl text-[var(--brand)]">Nga punët tona</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--accent)]">Brandim real për bizneset shqiptare</h2>
          </div>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-sm font-medium hover:text-[var(--brand)]"
          >
            Më shumë në Instagram →
          </a>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {SHOWCASE_POSTS.map((p) => (
            <Link
              key={p.src}
              href={p.href}
              className="group block card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[4/5] bg-white">
                <Image
                  src={p.src}
                  alt={p.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[var(--accent)] line-clamp-1">{p.title}</h3>
                <p className="text-xs text-[var(--muted)] mt-1 line-clamp-1">{p.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- VIDEO SHOWCASE: brandim video as section bg ---------- */}
      <section className="relative my-12 overflow-hidden">
        <div className="relative h-[420px] md:h-[520px]">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/showcase/brandim.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/showcase/set-biznesi.png"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, rgba(14,34,56,0.85) 0%, rgba(14,34,56,0.55) 55%, rgba(14,34,56,0.15) 100%)",
            }}
          />
          <div className="relative h-full container-x flex items-center">
            <div className="max-w-xl text-white">
              <p className="script text-3xl md:text-4xl text-[var(--brand-light)]">Brandim me stil</p>
              <h2 className="text-3xl md:text-5xl font-bold mt-2 leading-[1.05]">
                Personalizo produktin me <span className="text-[var(--brand-light)]">logon</span> apo shkrimin që dëshiron.
              </h2>
              <p className="mt-4 text-white/85 max-w-md">
                Nga ideja, te dizajni, te prodhimi — çdo produkt del me identitetin unik të biznesit tuaj.
              </p>
              <div className="mt-6 flex gap-3 flex-wrap">
                <Link href="/produkte" className="btn" style={{ background: "white", color: "var(--brand-dark)" }}>
                  Shiko produktet
                </Link>
                {site.whatsappNumber && (
                  <a
                    href={whatsappLink("Përshëndetje! Dua të personalizoj një produkt.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.6)" }}
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURED PRODUCTS ---------- */}
      <section className="container-x py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="script text-2xl text-[var(--brand)]">Më të kërkuarat</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--accent)]">Produktet që klientët tanë i duan më shumë</h2>
          </div>
          <Link href="/produkte" className="hidden sm:inline text-sm font-medium hover:text-[var(--brand)]">
            Shiko të gjitha →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------- OFFERS ---------- */}
      {offers.length > 0 && (
        <section className="container-x py-12">
          <div className="grid md:grid-cols-2 gap-5">
            {offers.map((o) => (
              <div key={o.id} className="card p-6 paper-bg">
                <div className="flex items-start gap-4">
                  {o.discount_percent > 0 ? (
                    <div className="shrink-0 w-16 h-16 rounded-full bg-[var(--brand)] text-white grid place-items-center font-bold text-lg">
                      -{o.discount_percent}%
                    </div>
                  ) : (
                    <div className="shrink-0 w-16 h-16 rounded-full bg-[var(--brand-soft)] text-[var(--brand)] grid place-items-center font-bold text-2xl">
                      ★
                    </div>
                  )}
                  <div>
                    <p className="script text-xl text-[var(--brand)] -mb-1">Ofertë</p>
                    <h3 className="font-bold text-lg text-[var(--accent)]">{o.title}</h3>
                    <p className="text-sm text-[var(--muted)] mt-1">{o.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- PROCESS / WHY ---------- */}
      <section className="container-x py-12">
        <p className="script text-2xl text-[var(--brand)] text-center">Si punojmë</p>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--accent)] mb-10 text-center">Nga ideja te dorëzimi në 4 hapa</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { n: "01", t: "Konsulencë falas", d: "Na thoni çfarë ju nevojitet — propozojmë zgjidhjen më të mirë." },
            { n: "02", t: "Dizajn i personalizuar", d: "Përgatisim dizajnin me logon dhe ngjyrat tuaja, deri sa të miratoni." },
            { n: "03", t: "Printim & prodhim", d: "Prodhojmë me materiale premium dhe kontroll cilësie në çdo hap." },
            { n: "04", t: "Dorëzim në derë", d: "Ju dorëzojmë porosinë në të gjithë Shqipërinë." },
          ].map((s) => (
            <div key={s.n} className="card p-6 relative overflow-hidden">
              <span className="absolute top-3 right-4 text-5xl font-black text-[var(--brand-soft)] leading-none">{s.n}</span>
              <h3 className="font-bold text-[var(--accent)] relative z-10">{s.t}</h3>
              <p className="text-sm text-[var(--muted)] mt-2 relative z-10">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA (with diagonal stripe) ---------- */}
      <section className="container-x py-12">
        <div className="diagonal-divider rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <span className="absolute right-6 top-6 opacity-25">
            <Image src="/logo.jpg" alt="" width={80} height={80} className="rounded-full" />
          </span>
          <div className="relative">
            <p className="script text-2xl text-white/85">Të presim me dëshirë</p>
            <h3 className="text-2xl md:text-3xl font-bold">Gati ta sjellësh brand-in tënd në jetë?</h3>
            <p className="text-white/85 mt-2">Na shkruaj — propozojmë zgjidhje brenda 24 orëve.</p>
          </div>
          <div className="flex gap-3 flex-wrap relative">
            <Link href="/produkte" className="btn" style={{ background: "white", color: "var(--brand-dark)" }}>Katalogu</Link>
            <Link href="/kontakt" className="btn" style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.6)" }}>Na kontakto</Link>
          </div>
        </div>
      </section>
    </>
  );
}
