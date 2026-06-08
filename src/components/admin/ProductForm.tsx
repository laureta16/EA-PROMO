"use client";

import { useRef, useState } from "react";
import { saveProductAction } from "@/app/admin/actions";
import type { Category, Product } from "@/lib/types";

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const p = product;
  const [preview, setPreview] = useState<string | null>(p?.image_url ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setPreview(URL.createObjectURL(f));
      setFileName(f.name);
    } else {
      setFileName(null);
    }
  }

  function clearImage() {
    setPreview(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    const urlInput = document.getElementById("image_url") as HTMLInputElement | null;
    if (urlInput) urlInput.value = "";
  }

  return (
    <form action={saveProductAction} className="card p-6 space-y-4 max-w-2xl" encType="multipart/form-data">
      {p ? <input type="hidden" name="id" value={p.id} /> : null}

      <div className="field">
        <label htmlFor="name">Emri *</label>
        <input id="name" name="name" required defaultValue={p?.name} className="input" />
      </div>
      <div className="field">
        <label htmlFor="slug">Slug (lihet bosh për auto)</label>
        <input id="slug" name="slug" defaultValue={p?.slug} className="input" />
      </div>
      <div className="field">
        <label htmlFor="description">Përshkrimi *</label>
        <textarea id="description" name="description" required defaultValue={p?.description} className="textarea" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="field">
          <label htmlFor="price_cents">Çmimi (në Lekë) *</label>
          <input id="price_cents" name="price_cents" type="number" min={0} required defaultValue={p?.price_cents ?? ""} className="input" />
        </div>
        <div className="field">
          <label htmlFor="category_id">Kategoria</label>
          <select id="category_id" name="category_id" defaultValue={p?.category_id ?? 0} className="select">
            <option value={0}>—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label>Foto e produktit</label>
        <div className="border border-dashed border-[var(--border)] rounded-lg p-4 bg-[var(--background)]">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-32 h-32 shrink-0 rounded-md border border-[var(--border)] bg-white paper-bg grid place-items-center overflow-hidden">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-[var(--muted)]">Pa foto</span>
              )}
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image_file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleFile}
                  className="block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[var(--brand)] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-[var(--brand-dark)]"
                />
                {fileName && <p className="text-xs text-[var(--muted)] mt-1">Zgjedhur: {fileName}</p>}
                <p className="text-xs text-[var(--muted)] mt-1">
                  JPG, PNG, WEBP, GIF ose SVG · max 5MB. Lihet bosh për ta mbajtur foton ekzistuese.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--muted)] uppercase tracking-wider">ose URL</span>
                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  defaultValue={p?.image_url ?? ""}
                  className="input"
                  placeholder="https://..."
                  onChange={(e) => {
                    if (!fileName) setPreview(e.target.value || null);
                  }}
                />
              </div>

              {preview && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-xs text-red-600 hover:underline"
                >
                  Hiq foton
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={p ? !!p.featured : false} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={p ? !!p.active : true} /> Aktiv
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary">Ruaj</button>
      </div>
    </form>
  );
}
