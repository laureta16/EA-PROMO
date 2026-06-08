import { collections, Timestamp } from "./firebase-admin";
import type {
  Category,
  Offer,
  Order,
  Product,
  ProductWithCategory,
} from "./types";

function tsToSeconds(v: unknown): number {
  if (v instanceof Timestamp) return Math.floor(v.toMillis() / 1000);
  if (typeof v === "number") return v;
  return 0;
}

function categoryFromDoc(doc: FirebaseFirestore.DocumentSnapshot): Category {
  const d = doc.data() ?? {};
  return {
    id: doc.id,
    slug: doc.id,
    name: String(d.name ?? ""),
    description: d.description ?? null,
    created_at: tsToSeconds(d.created_at),
  };
}

function productFromDoc(doc: FirebaseFirestore.DocumentSnapshot): Product {
  const d = doc.data() ?? {};
  return {
    id: doc.id,
    slug: doc.id,
    name: String(d.name ?? ""),
    description: String(d.description ?? ""),
    price_cents: Number(d.price_cents ?? 0),
    image_url: d.image_url ?? null,
    category_slug: d.category_slug ?? null,
    featured: d.featured ? 1 : 0,
    active: d.active === false ? 0 : 1,
    created_at: tsToSeconds(d.created_at),
  };
}

function offerFromDoc(doc: FirebaseFirestore.DocumentSnapshot): Offer {
  const d = doc.data() ?? {};
  return {
    id: doc.id,
    title: String(d.title ?? ""),
    description: String(d.description ?? ""),
    discount_percent: Number(d.discount_percent ?? 0),
    active: d.active === false ? 0 : 1,
    created_at: tsToSeconds(d.created_at),
  };
}

function orderFromDoc(doc: FirebaseFirestore.DocumentSnapshot): Order {
  const d = doc.data() ?? {};
  return {
    id: doc.id,
    product_id: d.product_id ?? null,
    product_name: String(d.product_name ?? ""),
    quantity: Number(d.quantity ?? 1),
    customer_name: String(d.customer_name ?? ""),
    phone: String(d.phone ?? ""),
    email: d.email ?? null,
    address: d.address ?? null,
    notes: d.notes ?? null,
    status: String(d.status ?? "pending"),
    items_json: d.items_json ?? null,
    total_cents: Number(d.total_cents ?? 0),
    created_at: tsToSeconds(d.created_at),
  };
}

// ===== Categories =====

export async function listCategories(): Promise<Category[]> {
  return safeQuery([], async () => {
    const snap = await collections.categories.orderBy("name").get();
    return snap.docs.map(categoryFromDoc);
  });
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  return safeQuery(undefined, async () => {
    const doc = await collections.categories.doc(slug).get();
    if (!doc.exists) return undefined;
    return categoryFromDoc(doc);
  });
}

// ===== Products =====

async function categoryNameMap(): Promise<Map<string, string>> {
  const snap = await collections.categories.get();
  const m = new Map<string, string>();
  snap.docs.forEach((d) => m.set(d.id, String(d.data().name ?? "")));
  return m;
}

function withCategory(
  p: Product,
  names: Map<string, string>,
): ProductWithCategory {
  return {
    ...p,
    category_name: p.category_slug
      ? (names.get(p.category_slug) ?? null)
      : null,
  };
}

async function safeQuery<T>(fallback: T, query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

export async function listProducts(
  opts: { categorySlug?: string; activeOnly?: boolean } = {},
): Promise<ProductWithCategory[]> {
  const { categorySlug, activeOnly = true } = opts;
  return safeQuery([], async () => {
    let q: FirebaseFirestore.Query = collections.products;
    if (activeOnly) q = q.where("active", "==", true);
    if (categorySlug) q = q.where("category_slug", "==", categorySlug);

    const [snap, names] = await Promise.all([q.get(), categoryNameMap()]);
    const items = snap.docs
      .map(productFromDoc)
      .map((p) => withCategory(p, names));
    // Sort featured first, then by created_at desc — done in memory to avoid composite index
    items.sort((a, b) => {
      if (a.featured !== b.featured) return b.featured - a.featured;
      return b.created_at - a.created_at;
    });
    return items;
  });
}

export async function getFeaturedProducts(
  limit = 6,
): Promise<ProductWithCategory[]> {
  return safeQuery([], async () => {
    const [snap, names] = await Promise.all([
      collections.products
        .where("active", "==", true)
        .where("featured", "==", true)
        .get(),
      categoryNameMap(),
    ]);
    const items = snap.docs
      .map(productFromDoc)
      .map((p) => withCategory(p, names));
    items.sort((a, b) => b.created_at - a.created_at);
    return items.slice(0, limit);
  });
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCategory | undefined> {
  return safeQuery(undefined, async () => {
    const doc = await collections.products.doc(slug).get();
    if (!doc.exists) return undefined;
    const p = productFromDoc(doc);
    const cat = p.category_slug
      ? await collections.categories.doc(p.category_slug).get()
      : null;
    return {
      ...p,
      category_name: cat && cat.exists ? String(cat.data()?.name ?? "") : null,
    };
  });
}

export async function getProductById(
  slug: string,
): Promise<Product | undefined> {
  return safeQuery(undefined, async () => {
    const doc = await collections.products.doc(slug).get();
    if (!doc.exists) return undefined;
    return productFromDoc(doc);
  });
}

// ===== Offers =====

export async function listActiveOffers(): Promise<Offer[]> {
  return safeQuery([], async () => {
    const snap = await collections.offers.where("active", "==", true).get();
    const items = snap.docs.map(offerFromDoc);
    items.sort((a, b) => b.created_at - a.created_at);
    return items;
  });
}

export async function listAllOffers(): Promise<Offer[]> {
  return safeQuery([], async () => {
    const snap = await collections.offers.get();
    const items = snap.docs.map(offerFromDoc);
    items.sort((a, b) => b.created_at - a.created_at);
    return items;
  });
}

// ===== Orders =====

export async function listOrders(): Promise<Order[]> {
  const snap = await collections.orders.orderBy("created_at", "desc").get();
  return snap.docs.map(orderFromDoc);
}

export async function createOrder(
  o: Omit<Order, "id" | "status" | "created_at">,
): Promise<string> {
  const ref = await collections.orders.add({
    ...o,
    status: "pending",
    created_at: Timestamp.now(),
  });
  return ref.id;
}

export async function updateOrderStatus(id: string, status: string) {
  await collections.orders.doc(id).update({ status });
}

// ===== Counts (for admin dashboard) =====

export async function getCounts() {
  const [products, categories, offers, ordersPending] = await Promise.all([
    collections.products.count().get(),
    collections.categories.count().get(),
    collections.offers.where("active", "==", true).count().get(),
    collections.orders.where("status", "==", "pending").count().get(),
  ]);
  return {
    products: products.data().count,
    categories: categories.data().count,
    offers: offers.data().count,
    orders: ordersPending.data().count,
  };
}
