import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listOrders } from "@/lib/queries";
import { formatLek } from "@/lib/types";
import { updateOrderStatusAction } from "../actions";

const STATUSES = [
  { v: "pending", l: "Në pritje" },
  { v: "confirmed", l: "Konfirmuar" },
  { v: "shipped", l: "Dërguar" },
  { v: "completed", l: "Përfunduar" },
  { v: "cancelled", l: "Anuluar" },
];

const STATUS_BADGE: Record<string, string> = {
  pending: "background:#fef3c7;color:#92400e",
  confirmed: "background:#dbeafe;color:#1e40af",
  shipped: "background:#e0e7ff;color:#3730a3",
  completed: "background:#d1fae5;color:#065f46",
  cancelled: "background:#fee2e2;color:#991b1b",
};

function fmtDate(s: number) {
  const d = new Date(s * 1000);
  return d.toLocaleString("sq-AL");
}

function statusStyle(v: string): React.CSSProperties {
  const out: Record<string, string> = {};
  (STATUS_BADGE[v] ?? "").split(";").forEach((p) => {
    const [k, val] = p.split(":");
    if (k && val) out[k.trim()] = val.trim();
  });
  return out as React.CSSProperties;
}

export default async function AdminOrders() {
  if (!(await isAdmin())) redirect("/admin");
  const orders = listOrders();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Porosi</h1>

      {orders.length === 0 ? (
        <div className="card p-10 text-center text-[var(--muted)]">Asnjë porosi.</div>
      ) : (
        <>
          {/* Mobile / tablet: stacked cards */}
          <div className="grid gap-3 lg:hidden">
            {orders.map((o) => (
              <div key={o.id} className="card p-4 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-[var(--accent)]">{o.customer_name}</div>
                    <div className="text-xs text-[var(--muted)]">{fmtDate(o.created_at)}</div>
                  </div>
                  <span className="badge" style={statusStyle(o.status)}>
                    {STATUSES.find((s) => s.v === o.status)?.l ?? o.status}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{o.product_name}</div>
                  <div className="text-xs text-[var(--muted)]">Sasia: {o.quantity}{o.total_cents ? ` · ${formatLek(o.total_cents)}` : ""}</div>
                  {o.notes && <div className="text-xs italic mt-1">&ldquo;{o.notes}&rdquo;</div>}
                </div>
                <div className="text-sm space-y-0.5 border-t border-[var(--border)] pt-2">
                  <a href={`tel:${o.phone}`} className="block text-[var(--brand)] font-medium">📞 {o.phone}</a>
                  {o.email && <a href={`mailto:${o.email}`} className="block text-[var(--muted)] break-all">✉ {o.email}</a>}
                  {o.address && <div className="text-[var(--muted)] text-xs">📍 {o.address}</div>}
                </div>
                <form action={updateOrderStatusAction} className="flex gap-2 items-center pt-2">
                  <input type="hidden" name="id" value={o.id} />
                  <select name="status" defaultValue={o.status} className="select flex-1">
                    {STATUSES.map((s) => (
                      <option key={s.v} value={s.v}>{s.l}</option>
                    ))}
                  </select>
                  <button className="btn btn-outline">Ruaj</button>
                </form>
              </div>
            ))}
          </div>

          {/* Desktop: full table */}
          <div className="hidden lg:block card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--brand-soft)] text-left">
                <tr>
                  <th className="p-3">Data</th>
                  <th className="p-3">Klienti</th>
                  <th className="p-3">Produkti</th>
                  <th className="p-3">Kontakti</th>
                  <th className="p-3">Statusi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-[var(--border)] align-top">
                    <td className="p-3 whitespace-nowrap">{fmtDate(o.created_at)}</td>
                    <td className="p-3">
                      <div className="font-medium">{o.customer_name}</div>
                      {o.address && <div className="text-xs text-[var(--muted)]">{o.address}</div>}
                    </td>
                    <td className="p-3">
                      <div>{o.product_name}</div>
                      <div className="text-xs text-[var(--muted)]">Sasia: {o.quantity}{o.total_cents ? ` · ${formatLek(o.total_cents)}` : ""}</div>
                      {o.notes && <div className="text-xs mt-1 italic">&ldquo;{o.notes}&rdquo;</div>}
                    </td>
                    <td className="p-3 text-sm">
                      <div>{o.phone}</div>
                      {o.email && <div className="text-[var(--muted)]">{o.email}</div>}
                    </td>
                    <td className="p-3">
                      <form action={updateOrderStatusAction} className="flex gap-2 items-center">
                        <input type="hidden" name="id" value={o.id} />
                        <select name="status" defaultValue={o.status} className="select">
                          {STATUSES.map((s) => (
                            <option key={s.v} value={s.v}>{s.l}</option>
                          ))}
                        </select>
                        <button className="btn btn-outline">Ruaj</button>
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
