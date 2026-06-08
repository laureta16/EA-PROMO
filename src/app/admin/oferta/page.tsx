import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listAllOffers } from "@/lib/queries";
import { deleteOfferAction, saveOfferAction } from "../actions";

export default async function AdminOffers() {
  if (!(await isAdmin())) redirect("/admin");
  const offers = listAllOffers();
  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
      <div>
        <h1 className="text-2xl font-bold mb-5">Oferta</h1>
        {offers.length === 0 ? (
          <div className="card p-8 text-center text-[var(--muted)]">Asnjë ofertë.</div>
        ) : (
          <div className="grid gap-3">
            {offers.map((o) => (
              <form key={o.id} action={saveOfferAction} className="card p-4 space-y-3">
                <input type="hidden" name="id" value={o.id} />
                <div className="field">
                  <label>Titulli</label>
                  <input name="title" defaultValue={o.title} className="input" />
                </div>
                <div className="field">
                  <label>Përshkrimi</label>
                  <textarea name="description" defaultValue={o.description} className="textarea" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 items-end">
                  <div className="field">
                    <label>% Ulje</label>
                    <input type="number" name="discount_percent" defaultValue={o.discount_percent} className="input" />
                  </div>
                  <label className="flex items-center gap-2 text-sm pb-2">
                    <input type="checkbox" name="active" defaultChecked={!!o.active} /> Aktive
                  </label>
                </div>
                <div className="flex gap-2 justify-end">
                  <button className="btn btn-outline">Ruaj</button>
                  <button
                    type="submit"
                    formAction={deleteOfferAction}
                    className="btn btn-ghost text-red-600"
                  >
                    Fshi
                  </button>
                </div>
              </form>
            ))}
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-20">
        <h2 className="text-lg font-semibold mb-3">Ofertë e re</h2>
        <form action={saveOfferAction} className="card p-5 space-y-4">
          <div className="field">
            <label htmlFor="new-title">Titulli *</label>
            <input id="new-title" name="title" required className="input" />
          </div>
          <div className="field">
            <label htmlFor="new-desc">Përshkrimi *</label>
            <textarea id="new-desc" name="description" required className="textarea" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3 items-end">
            <div className="field">
              <label htmlFor="new-disc">% Ulje</label>
              <input id="new-disc" type="number" name="discount_percent" defaultValue={0} className="input" />
            </div>
            <label className="flex items-center gap-2 text-sm pb-2">
              <input type="checkbox" name="active" defaultChecked /> Aktive
            </label>
          </div>
          <button className="btn btn-primary w-full">Shto</button>
        </form>
      </div>
    </div>
  );
}
