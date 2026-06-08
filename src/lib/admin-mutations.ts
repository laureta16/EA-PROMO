import { collections, Timestamp } from "./firebase-admin";

type ProductPayload = {
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  image_url: string | null;
  category_slug: string | null;
  featured: number;
  active: number;
};

export async function createProduct(p: ProductPayload) {
  const { slug, ...rest } = p;
  await collections.products.doc(slug).set({
    ...rest,
    featured: !!p.featured,
    active: p.active !== 0,
    created_at: Timestamp.now(),
  });
}

export async function updateProduct(slug: string, p: ProductPayload) {
  // Slug is the doc id; if user changed slug, we'd need to recreate.
  // Here we treat slug as immutable on edit (the form hides it on edit).
  await collections.products.doc(slug).set(
    {
      name: p.name,
      description: p.description,
      price_cents: p.price_cents,
      image_url: p.image_url,
      category_slug: p.category_slug,
      featured: !!p.featured,
      active: p.active !== 0,
    },
    { merge: true }
  );
}

export async function deleteProduct(slug: string) {
  await collections.products.doc(slug).delete();
}

type CategoryPayload = { slug: string; name: string; description: string | null };

export async function createCategory(c: CategoryPayload) {
  const { slug, ...rest } = c;
  await collections.categories.doc(slug).set({
    ...rest,
    created_at: Timestamp.now(),
  });
}

export async function updateCategory(slug: string, c: CategoryPayload) {
  await collections.categories.doc(slug).set(
    { name: c.name, description: c.description },
    { merge: true }
  );
}

export async function deleteCategory(slug: string) {
  await collections.categories.doc(slug).delete();
}

type OfferPayload = {
  title: string;
  description: string;
  discount_percent: number;
  active: number;
};

export async function createOffer(o: OfferPayload) {
  await collections.offers.add({
    title: o.title,
    description: o.description,
    discount_percent: o.discount_percent,
    active: o.active !== 0,
    created_at: Timestamp.now(),
  });
}

export async function updateOffer(id: string, o: OfferPayload) {
  await collections.offers.doc(id).set(
    {
      title: o.title,
      description: o.description,
      discount_percent: o.discount_percent,
      active: o.active !== 0,
    },
    { merge: true }
  );
}

export async function deleteOffer(id: string) {
  await collections.offers.doc(id).delete();
}
