"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  price_cents: number;
  image_url: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  ready: boolean;
};

const STORAGE_KEY = "eapromo_cart_v2";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, ready]);

  const add = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((cur) => {
      const existing = cur.find((i) => i.productId === item.productId);
      if (existing) {
        return cur.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...cur, { ...item, quantity }];
    });
  }, []);

  const remove = useCallback((productId: number) => {
    setItems((cur) => cur.filter((i) => i.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setItems((cur) =>
      cur
        .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(0, quantity) } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.quantity * i.price_cents, 0);
    return { items, count, total, add, remove, setQuantity, clear, ready };
  }, [items, add, remove, setQuantity, clear, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
