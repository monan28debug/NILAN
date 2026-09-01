import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const GUEST_KEY = 'nilan_guest_cart';

function readGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
  } catch {
    return [];
  }
}
function writeGuestCart(items) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [merged, setMerged] = useState(false);

  useEffect(() => {
    async function load() {
      if (user) {
        const ref = doc(db, 'carts', user.uid);
        const snap = await getDoc(ref);
        let userItems = snap.exists() ? snap.data().items || [] : [];

        if (!merged) {
          const guestItems = readGuestCart();
          if (guestItems.length) {
            const map = new Map(userItems.map((i) => [i.productId, i]));
            for (const gi of guestItems) {
              if (map.has(gi.productId)) {
                map.get(gi.productId).qty += gi.qty;
              } else {
                map.set(gi.productId, gi);
              }
            }
            userItems = Array.from(map.values());
            await setDoc(ref, { items: userItems }, { merge: true });
            localStorage.removeItem(GUEST_KEY);
          }
          setMerged(true);
        }
        setItems(userItems);

        const wref = doc(db, 'wishlists', user.uid);
        const wsnap = await getDoc(wref);
        setWishlist(wsnap.exists() ? wsnap.data().productIds || [] : []);
      } else {
        setItems(readGuestCart());
        setWishlist([]);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const persist = async (next) => {
    setItems(next);
    if (user) {
      await setDoc(doc(db, 'carts', user.uid), { items: next }, { merge: true });
    } else {
      writeGuestCart(next);
    }
  };

  const addToCart = (product, qty = 1) => {
    const existing = items.find((i) => i.productId === product.id);
    let next;
    if (existing) {
      next = items.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + qty } : i));
    } else {
      next = [
        ...items,
        { productId: product.id, name: product.name, price: product.price, image: product.imageUrl, qty },
      ];
    }
    persist(next);
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    persist(items.map((i) => (i.productId === productId ? { ...i, qty } : i)));
  };

  const removeFromCart = (productId) => persist(items.filter((i) => i.productId !== productId));
  const clearCart = () => persist([]);

  const toggleWishlist = async (productId) => {
    if (!user) return;
    const next = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(next);
    await setDoc(doc(db, 'wishlists', user.uid), { productIds: next }, { merge: true });
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeFromCart, clearCart, subtotal, wishlist, toggleWishlist }}
    >
      {children}
    </CartContext.Provider>
  );
}
