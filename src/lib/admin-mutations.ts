import { getDb } from "./db";

export function createProduct(p: {
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  image_url: string | null;
  category_id: number | null;
  featured: number;
  active: number;
}) {
  getDb()
    .prepare(
      `INSERT INTO products (slug, name, description, price_cents, image_url, category_id, featured, active)
       VALUES (@slug, @name, @description, @price_cents, @image_url, @category_id, @featured, @active)`
    )
    .run(p);
}

export function updateProduct(id: number, p: {
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  image_url: string | null;
  category_id: number | null;
  featured: number;
  active: number;
}) {
  getDb()
    .prepare(
      `UPDATE products SET slug=@slug, name=@name, description=@description, price_cents=@price_cents,
       image_url=@image_url, category_id=@category_id, featured=@featured, active=@active WHERE id=@id`
    )
    .run({ ...p, id });
}

export function deleteProduct(id: number) {
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
}

export function createCategory(c: { slug: string; name: string; description: string | null }) {
  getDb()
    .prepare("INSERT INTO categories (slug, name, description) VALUES (@slug, @name, @description)")
    .run(c);
}

export function updateCategory(id: number, c: { slug: string; name: string; description: string | null }) {
  getDb()
    .prepare("UPDATE categories SET slug=@slug, name=@name, description=@description WHERE id=@id")
    .run({ ...c, id });
}

export function deleteCategory(id: number) {
  getDb().prepare("DELETE FROM categories WHERE id = ?").run(id);
}

export function createOffer(o: { title: string; description: string; discount_percent: number; active: number }) {
  getDb()
    .prepare(
      "INSERT INTO offers (title, description, discount_percent, active) VALUES (@title, @description, @discount_percent, @active)"
    )
    .run(o);
}

export function updateOffer(id: number, o: { title: string; description: string; discount_percent: number; active: number }) {
  getDb()
    .prepare(
      "UPDATE offers SET title=@title, description=@description, discount_percent=@discount_percent, active=@active WHERE id=@id"
    )
    .run({ ...o, id });
}

export function deleteOffer(id: number) {
  getDb().prepare("DELETE FROM offers WHERE id = ?").run(id);
}
