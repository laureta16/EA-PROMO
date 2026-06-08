import { getDb } from "./db";
import type { Category, Offer, Order, Product, ProductWithCategory } from "./types";

export function listCategories(): Category[] {
  return getDb().prepare("SELECT * FROM categories ORDER BY name").all() as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getDb().prepare("SELECT * FROM categories WHERE slug = ?").get(slug) as Category | undefined;
}

export function listProducts(opts: { categorySlug?: string; activeOnly?: boolean } = {}): ProductWithCategory[] {
  const { categorySlug, activeOnly = true } = opts;
  const where: string[] = [];
  const params: unknown[] = [];
  if (activeOnly) where.push("p.active = 1");
  if (categorySlug) {
    where.push("c.slug = ?");
    params.push(categorySlug);
  }
  const sql = `
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY p.featured DESC, p.created_at DESC
  `;
  return getDb().prepare(sql).all(...params) as ProductWithCategory[];
}

export function getFeaturedProducts(limit = 6): ProductWithCategory[] {
  return getDb()
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.active = 1 AND p.featured = 1
       ORDER BY p.created_at DESC LIMIT ?`
    )
    .all(limit) as ProductWithCategory[];
}

export function getProductBySlug(slug: string): ProductWithCategory | undefined {
  return getDb()
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.slug = ?`
    )
    .get(slug) as ProductWithCategory | undefined;
}

export function getProductById(id: number): Product | undefined {
  return getDb().prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;
}

export function listActiveOffers(): Offer[] {
  return getDb()
    .prepare("SELECT * FROM offers WHERE active = 1 ORDER BY created_at DESC")
    .all() as Offer[];
}

export function listAllOffers(): Offer[] {
  return getDb().prepare("SELECT * FROM offers ORDER BY created_at DESC").all() as Offer[];
}

export function listOrders(): Order[] {
  return getDb().prepare("SELECT * FROM orders ORDER BY created_at DESC").all() as Order[];
}

export function createOrder(o: Omit<Order, "id" | "status" | "created_at">): number {
  const stmt = getDb().prepare(
    `INSERT INTO orders (product_id, product_name, quantity, customer_name, phone, email, address, notes, items_json, total_cents)
     VALUES (@product_id, @product_name, @quantity, @customer_name, @phone, @email, @address, @notes, @items_json, @total_cents)`
  );
  const r = stmt.run(o);
  return Number(r.lastInsertRowid);
}

export function updateOrderStatus(id: number, status: string) {
  getDb().prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
}
