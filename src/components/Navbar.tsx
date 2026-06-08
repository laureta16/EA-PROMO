"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CartBadge } from "./cart/CartBadge";

const LINKS = [
  { href: "/", label: "Kreu" },
  { href: "/produkte", label: "Produkte" },
  { href: "/oferta", label: "Oferta" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/90 border-b border-[var(--border)]">
      <div className="container-x flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 font-bold text-lg tracking-tight">
          <span className="logo-mark">
            <Image src="/logo.jpg" alt="EA Promo" width={72} height={72} priority />
          </span>
          <span className="text-[var(--accent)]">EA Promo</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`hover:text-[var(--brand)] ${pathname === l.href ? "text-[var(--brand)]" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartBadge />
          <Link href="/produkte" className="btn btn-primary text-sm hidden sm:inline-flex">Porosit</Link>

          {/* Mobile burger — only on small screens */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--border)] bg-white hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
            aria-label="Hap menunë"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out border-t border-[var(--border)] bg-white ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container-x py-4 flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`py-3 px-2 rounded-md text-base font-semibold transition-colors ${
                pathname === l.href
                  ? "text-[var(--brand)] bg-[var(--brand-soft)]"
                  : "text-[var(--accent)] hover:bg-[var(--brand-soft)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/shporta"
            className="py-3 px-2 rounded-md text-base font-semibold text-[var(--accent)] hover:bg-[var(--brand-soft)]"
          >
            Shporta
          </Link>
          <Link href="/produkte" className="btn btn-primary mt-2">Porosit tani</Link>
        </nav>
      </div>
    </header>
  );
}
