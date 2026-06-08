import { CATEGORIES_SEED, PRODUCTS_SEED, OFFERS_SEED } from "./data";
import type { Category, Offer, Order, Product } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __store: Store | undefined;
}

type Store = {
  categories: Category[];
  products: Product[];
  offers: Offer[];
  orders: Order[];
  nextId: { category: number; product: number; offer: number; order: number };
};

function makeStore(): Store {
  return {
    categories: [...CATEGORIES_SEED],
    products: [...PRODUCTS_SEED],
    offers: [...OFFERS_SEED],
    orders: [],
    nextId: {
      category: Math.max(0, ...CATEGORIES_SEED.map((c) => c.id)) + 1,
      product: Math.max(0, ...PRODUCTS_SEED.map((p) => p.id)) + 1,
      offer: Math.max(0, ...OFFERS_SEED.map((o) => o.id)) + 1,
      order: 1,
    },
  };
}

export function store(): Store {
  if (!globalThis.__store) globalThis.__store = makeStore();
  return globalThis.__store;
}
