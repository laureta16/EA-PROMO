import { store } from "./store";
import type { Category, Offer, Order, Product, ProductWithCategory } from "./types";

function withCategory(p: Product, cats: Category[]): ProductWithCategory {
  const c = cats.find((x) => x.id === p.category_id);
  return { ...p, category_name: c?.name ?? null, category_slug: c?.slug ?? null };
}

export function listCategories(): Category[] {
  return [...store().categories].sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return store().categories.find((c) => c.slug === slug);
}

export function listProducts(opts: { categorySlug?: string; activeOnly?: boolean } = {}): ProductWithCategory[] {
  const { categorySlug, activeOnly = true } = opts;
  const s = store();
  let items = s.products;
  if (activeOnly) items = items.filter((p) => p.active === 1);
  if (categorySlug) {
    const cat = s.categories.find((c) => c.slug === categorySlug);
    if (cat) items = items.filter((p) => p.category_id === cat.id);
    else items = [];
  }
  const result = items.map((p) => withCategory(p, s.categories));
  result.sort((a, b) => {
    const aHasImg = a.image_url ? 1 : 0;
    const bHasImg = b.image_url ? 1 : 0;
    if (aHasImg !== bHasImg) return bHasImg - aHasImg;
    if (a.featured !== b.featured) return b.featured - a.featured;
    return b.created_at - a.created_at;
  });
  return result;
}

export function getFeaturedProducts(limit = 6): ProductWithCategory[] {
  const s = store();
  return s.products
    .filter((p) => p.active === 1 && p.featured === 1)
    .map((p) => withCategory(p, s.categories))
    .sort((a, b) => b.created_at - a.created_at)
    .slice(0, limit);
}

export function getProductBySlug(slug: string): ProductWithCategory | undefined {
  const s = store();
  const p = s.products.find((x) => x.slug === slug);
  if (!p) return undefined;
  return withCategory(p, s.categories);
}

export function getProductById(id: number): Product | undefined {
  return store().products.find((p) => p.id === id);
}

export function listActiveOffers(): Offer[] {
  return store().offers.filter((o) => o.active === 1).sort((a, b) => b.created_at - a.created_at);
}

export function listAllOffers(): Offer[] {
  return [...store().offers].sort((a, b) => b.created_at - a.created_at);
}

export function listOrders(): Order[] {
  return [...store().orders].sort((a, b) => b.created_at - a.created_at);
}

export function createOrder(o: Omit<Order, "id" | "status" | "created_at">): number {
  const s = store();
  const id = s.nextId.order++;
  s.orders.push({
    ...o,
    id,
    status: "pending",
    created_at: Math.floor(Date.now() / 1000),
  });
  return id;
}

export function updateOrderStatus(id: number, status: string) {
  const o = store().orders.find((x) => x.id === id);
  if (o) o.status = status;
}
