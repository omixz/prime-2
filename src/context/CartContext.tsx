import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MenuItem } from "../data/menu";

export type ComboSize = "single" | "regular" | "large";

export type AddItemOptions = {
  comboSize?: ComboSize;
  drink?: { id: string; name: string };
};

export type CartLine = {
  id: string;
  itemId: string;
  comboSize: ComboSize;
  drinkId?: string;
  name: string;
  priceCents: number;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (item: MenuItem, options?: AddItemOptions) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalCents: number;
  totalCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "prime-burger-cart";
const MAX_QUANTITY_PER_ITEM = 20;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable — cart just won't persist across reloads
    }
  }, [lines]);

  const addItem = (item: MenuItem, options?: AddItemOptions) => {
    const comboSize = options?.comboSize ?? "single";

    let priceCents = item.priceCents;
    let name = item.name;
    let lineId = item.id;

    if (comboSize === "regular" && item.comboUpchargeCents != null) {
      priceCents += item.comboUpchargeCents;
      name = `${item.name} — Combo${options?.drink ? ` w/ ${options.drink.name}` : ""}`;
      lineId = `${item.id}:combo:${options?.drink?.id ?? ""}`;
    } else if (comboSize === "large" && item.largeComboUpchargeCents != null) {
      priceCents += item.largeComboUpchargeCents;
      name = `${item.name} — Large Combo${options?.drink ? ` w/ ${options.drink.name}` : ""}`;
      lineId = `${item.id}:large:${options?.drink?.id ?? ""}`;
    }

    setLines((prev) => {
      const existing = prev.find((l) => l.id === lineId);
      if (existing) {
        return prev.map((l) =>
          l.id === lineId
            ? { ...l, quantity: Math.min(MAX_QUANTITY_PER_ITEM, l.quantity + 1) }
            : l
        );
      }
      return [
        ...prev,
        { id: lineId, itemId: item.id, comboSize, drinkId: options?.drink?.id, name, priceCents, quantity: 1 },
      ];
    });
  };

  const removeItem = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, quantity: Math.min(MAX_QUANTITY_PER_ITEM, quantity) } : l))
    );
  };

  const clear = () => setLines([]);

  const totalCents = useMemo(() => lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0), [lines]);
  const totalCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  return (
    <CartContext.Provider value={{ lines, addItem, removeItem, updateQuantity, clear, totalCents, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
