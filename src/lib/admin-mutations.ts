import { store } from "./store";

type ProductPayload = {
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  image_url: string | null;
  category_id: number | null;
  featured: number;
  active: number;
};

export function createProduct(p: ProductPayload) {
  const s = store();
  const id = s.nextId.product++;
  s.products.push({ id, ...p, created_at: Math.floor(Date.now() / 1000) });
}

export function updateProduct(id: number, p: ProductPayload) {
  const s = store();
  const i = s.products.findIndex((x) => x.id === id);
  if (i >= 0) s.products[i] = { ...s.products[i], ...p };
}

export function deleteProduct(id: number) {
  const s = store();
  s.products = s.products.filter((x) => x.id !== id);
}

type CategoryPayload = { slug: string; name: string; description: string | null };

export function createCategory(c: CategoryPayload) {
  const s = store();
  const id = s.nextId.category++;
  s.categories.push({ id, ...c, created_at: Math.floor(Date.now() / 1000) });
}

export function updateCategory(id: number, c: CategoryPayload) {
  const s = store();
  const i = s.categories.findIndex((x) => x.id === id);
  if (i >= 0) s.categories[i] = { ...s.categories[i], ...c };
}

export function deleteCategory(id: number) {
  const s = store();
  s.categories = s.categories.filter((x) => x.id !== id);
}

type OfferPayload = {
  title: string;
  description: string;
  discount_percent: number;
  active: number;
};

export function createOffer(o: OfferPayload) {
  const s = store();
  const id = s.nextId.offer++;
  s.offers.push({ id, ...o, created_at: Math.floor(Date.now() / 1000) });
}

export function updateOffer(id: number, o: OfferPayload) {
  const s = store();
  const i = s.offers.findIndex((x) => x.id === id);
  if (i >= 0) s.offers[i] = { ...s.offers[i], ...o };
}

export function deleteOffer(id: number) {
  const s = store();
  s.offers = s.offers.filter((x) => x.id !== id);
}
