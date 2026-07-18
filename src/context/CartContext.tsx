import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MenuItem } from "../data/menu";

export type CartLine = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalCents: number;
  totalCount: number;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "prime-burger-cart";
const STORAGE_KEY_EMAIL = "prime-burger-email";
const STORAGE_KEY_PHONE = "prime-burger-phone";
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

  const [email, setEmailState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_EMAIL) || "";
    } catch {
      return "";
    }
  });

  const [phone, setPhoneState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_PHONE) || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable — cart just won't persist across reloads
    }
  }, [lines]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EMAIL, email);
    } catch {
      // storage unavailable
    }
  }, [email]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PHONE, phone);
    } catch {
      // storage unavailable
    }
  }, [phone]);

  const setEmail = (newEmail: string) => setEmailState(newEmail);
  const setPhone = (newPhone: string) => setPhoneState(newPhone);

  const addItem = (item: MenuItem) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === item.id);
      if (existing) {
        return prev.map((l) =>
          l.id === item.id
            ? { ...l, quantity: Math.min(MAX_QUANTITY_PER_ITEM, l.quantity + 1) }
            : l
        );
      }
      return [...prev, { id: item.id, name: item.name, priceCents: item.priceCents, quantity: 1 }];
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
    <CartContext.Provider value={{ lines, addItem, removeItem, updateQuantity, clear, totalCents, totalCount, email, setEmail, phone, setPhone }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
