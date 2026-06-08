export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  created_at: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  image_url: string | null;
  category_slug: string | null;
  featured: number;
  active: number;
  created_at: number;
};

export type ProductWithCategory = Product & {
  category_name: string | null;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  discount_percent: number;
  active: number;
  created_at: number;
};

export type OrderItem = {
  product_id: string | null;
  product_name: string;
  product_slug?: string;
  quantity: number;
  price_cents: number;
};

export type Order = {
  id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  status: string;
  items_json: string | null;
  total_cents: number;
  created_at: number;
};

export function formatLek(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const formatted = Math.abs(cents).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}${formatted} L`;
}
