import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";
import { listAllOffers, listCategories, listOrders, listProducts } from "@/lib/queries";

export default async function AdminHome() {
  const authed = await isAdmin();
  if (!authed) {
    return (
      <div className="py-10">
        <LoginForm />
      </div>
    );
  }
  const products = listProducts({ activeOnly: false });
  const categories = listCategories();
  const offers = listAllOffers().filter((o) => o.active === 1);
  const orders = listOrders().filter((o) => o.status === "pending");
  const cards: { href: string; label: string; n: number }[] = [
    { href: "/admin/produkte", label: "Produkte", n: products.length },
    { href: "/admin/kategori", label: "Kategori", n: categories.length },
    { href: "/admin/oferta", label: "Oferta aktive", n: offers.length },
    { href: "/admin/porosi", label: "Porosi në pritje", n: orders.length },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card p-6 hover:border-[var(--brand)]">
            <div className="text-sm text-[var(--muted)]">{c.label}</div>
            <div className="text-3xl font-bold mt-1">{c.n}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
