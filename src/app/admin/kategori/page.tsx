import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listCategories } from "@/lib/queries";
import { deleteCategoryAction, saveCategoryAction } from "../actions";

export default async function AdminCategories() {
  if (!(await isAdmin())) redirect("/admin");
  const categories = listCategories();
  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
      <div>
        <h1 className="text-2xl font-bold mb-5">Kategori</h1>
        {categories.length === 0 ? (
          <div className="card p-8 text-center text-[var(--muted)]">Asnjë kategori.</div>
        ) : (
          <div className="grid gap-3">
            {categories.map((c) => (
              <form key={c.id} action={saveCategoryAction} className="card p-4 space-y-3">
                <input type="hidden" name="id" value={c.id} />
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="field">
                    <label>Emri</label>
                    <input name="name" defaultValue={c.name} className="input" />
                  </div>
                  <div className="field">
                    <label>Slug</label>
                    <input name="slug" defaultValue={c.slug} className="input" />
                  </div>
                </div>
                <div className="field">
                  <label>Përshkrim</label>
                  <textarea name="description" defaultValue={c.description ?? ""} className="textarea" />
                </div>
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <span className="text-xs text-[var(--muted)]">/{c.slug}</span>
                  <div className="flex gap-2">
                    <button className="btn btn-outline">Ruaj</button>
                    <button
                      type="submit"
                      formAction={deleteCategoryAction}
                      className="btn btn-ghost text-red-600"
                    >
                      Fshi
                    </button>
                  </div>
                </div>
              </form>
            ))}
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-20">
        <h2 className="text-lg font-semibold mb-3">Kategori e re</h2>
        <form action={saveCategoryAction} className="card p-5 space-y-4">
          <div className="field">
            <label htmlFor="new-name">Emri *</label>
            <input id="new-name" name="name" required className="input" />
          </div>
          <div className="field">
            <label htmlFor="new-slug">Slug (bosh = auto)</label>
            <input id="new-slug" name="slug" className="input" />
          </div>
          <div className="field">
            <label htmlFor="new-desc">Përshkrim</label>
            <textarea id="new-desc" name="description" className="textarea" />
          </div>
          <button className="btn btn-primary w-full">Shto</button>
        </form>
      </div>
    </div>
  );
}
