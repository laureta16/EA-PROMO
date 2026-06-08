"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/admin/actions";

const LINKS = [
  { href: "/admin", label: "Panel", match: (p: string) => p === "/admin" },
  { href: "/admin/produkte", label: "Produkte", match: (p: string) => p.startsWith("/admin/produkte") },
  { href: "/admin/kategori", label: "Kategori", match: (p: string) => p.startsWith("/admin/kategori") },
  { href: "/admin/oferta", label: "Oferta", match: (p: string) => p.startsWith("/admin/oferta") },
  { href: "/admin/porosi", label: "Porosi", match: (p: string) => p.startsWith("/admin/porosi") },
];

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop nav (md+) */}
      <nav className="hidden md:flex items-center gap-5 text-sm">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`hover:text-[var(--brand-light)] transition-colors ${
              l.match(pathname) ? "text-[var(--brand-light)] font-semibold" : ""
            }`}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/" className="hover:text-[var(--brand-light)]" target="_blank">↗ Faqja</Link>
        <form action={logoutAction}>
          <button type="submit" className="underline hover:text-[var(--brand-light)]">Dil</button>
        </form>
      </nav>

      {/* Mobile burger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Mbyll menunë" : "Hap menunë"}
        aria-expanded={open}
        aria-controls="admin-mobile-menu"
        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-white/10 transition-colors"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open ? (
            <>
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </>
          ) : (
            <>
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile dropdown */}
      <div
        id="admin-mobile-menu"
        className={`md:hidden absolute left-0 right-0 top-full bg-[var(--accent)] border-t border-white/10 overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container-x py-3 flex flex-col gap-1 text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`py-3 px-2 rounded-md font-medium transition-colors ${
                l.match(pathname)
                  ? "bg-white/15 text-[var(--brand-light)]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t border-white/10 my-2" />
          <Link href="/" target="_blank" className="py-3 px-2 rounded-md text-white hover:bg-white/10">↗ Hap faqen publike</Link>
          <form action={logoutAction}>
            <button type="submit" className="w-full text-left py-3 px-2 rounded-md text-white hover:bg-white/10">Dil</button>
          </form>
        </nav>
      </div>
    </>
  );
}
