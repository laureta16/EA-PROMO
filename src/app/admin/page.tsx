import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";
import { getCounts } from "@/lib/queries";

export default async function AdminHome() {
  const authed = await isAdmin();
  if (!authed) {
    return (
      <div className="py-10">
        <LoginForm />
      </div>
    );
  }
  const counts = await getCounts();
  const cards: { href: string; label: string; n: number }[] = [
    { href: "/admin/produkte", label: "Produkte", n: counts.products },
    { href: "/admin/kategori", label: "Kategori", n: counts.categories },
    { href: "/admin/oferta", label: "Oferta aktive", n: counts.offers },
    { href: "/admin/porosi", label: "Porosi në pritje", n: counts.orders },
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
