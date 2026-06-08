import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shporta",
  description: "Shporta juaj e blerjes në EA Promo.",
  alternates: { canonical: "/shporta" },
};

export default function ShportaPage() {
  return (
    <div className="container-x py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent)]">Shporta juaj</h1>
      <p className="text-[var(--muted)] mt-2">Rishikoni produktet dhe plotësoni të dhënat tuaja.</p>
      <CartView />
    </div>
  );
}
