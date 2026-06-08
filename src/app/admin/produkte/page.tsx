import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listProducts } from "@/lib/queries";
import { formatLek } from "@/lib/types";
import { deleteProductAction } from "../actions";

export default async function AdminProducts() {
  if (!(await isAdmin())) redirect("/admin");
  const products = await listProducts({ activeOnly: false });
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Produkte</h1>
        <Link href="/admin/produkte/new" className="btn btn-primary">+ Produkt i ri</Link>
      </div>

      {products.length === 0 ? (
        <div className="card p-10 text-center text-[var(--muted)]">Asnjë produkt.</div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="grid gap-3 md:hidden">
            {products.map((p) => (
              <div key={p.id} className="card p-4">
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-[var(--accent)] line-clamp-1">{p.name}</div>
                    <div className="text-xs text-[var(--muted)]">/{p.slug}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-[var(--brand)]">{formatLek(p.price_cents)}</div>
                    <div className="text-xs text-[var(--muted)]">{p.category_name ?? "—"}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.active ? <span className="badge">Aktiv</span> : <span className="text-xs text-[var(--muted)]">Joaktiv</span>}
                  {p.featured ? (
                    <span className="badge" style={{ background: "#dbeafe", color: "#1e40af" }}>Featured</span>
                  ) : null}
                </div>
                <div className="flex gap-2 mt-3 border-t border-[var(--border)] pt-3">
                  <Link href={`/admin/produkte/${p.id}`} className="btn btn-outline flex-1 text-sm">Redakto</Link>
                  <form action={deleteProductAction} className="flex-1">
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="btn btn-ghost text-red-600 w-full text-sm">Fshi</button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: full table */}
          <div className="hidden md:block card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--brand-soft)] text-left">
                <tr>
                  <th className="p-3">Emri</th>
                  <th className="p-3">Kategoria</th>
                  <th className="p-3">Çmimi</th>
                  <th className="p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-[var(--border)]">
                    <td className="p-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-[var(--muted)]">/{p.slug}</div>
                    </td>
                    <td className="p-3">{p.category_name ?? "—"}</td>
                    <td className="p-3">{formatLek(p.price_cents)}</td>
                    <td className="p-3">
                      {p.active ? <span className="badge">Aktiv</span> : <span className="text-[var(--muted)]">Joaktiv</span>}
                      {p.featured ? (
                        <span className="badge ml-1" style={{ background: "#dbeafe", color: "#1e40af" }}>Featured</span>
                      ) : null}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <Link href={`/admin/produkte/${p.id}`} className="btn btn-ghost">Redakto</Link>
                      <form action={deleteProductAction} className="inline">
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="btn btn-ghost text-red-600">Fshi</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
