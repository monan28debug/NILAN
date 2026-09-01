// Places an order and decrements product stock atomically in a single Firestore
// transaction, so concurrent checkouts on the same product can never oversell it
// or push stock negative. The Order ID itself is generated just before this in a
// separate, dedicated counter transaction (Firestore doesn't support nested
// transactions), then this transaction does the actual stock-safe commit.
import { doc, runTransaction, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { generateOrderId } from './orderId';

export class InsufficientStockError extends Error {
  constructor(items) {
    super('One or more items no longer have enough stock.');
    this.items = items; // [{ productId, name, available }]
  }
}

export async function placeOrderWithStock({ uid, items, orderMeta }) {
  const orderId = await generateOrderId();
  const orderRef = doc(collection(db, 'orders'));

  await runTransaction(db, async (transaction) => {
    // 1. Read every product involved first (Firestore transactions require all
    //    reads before any writes).
    const productRefs = items.map((i) => doc(db, 'products', i.productId));
    const productSnaps = await Promise.all(productRefs.map((ref) => transaction.get(ref)));

    const shortfalls = [];
    productSnaps.forEach((snap, idx) => {
      const requestedQty = items[idx].qty;
      const available = snap.exists() ? Number(snap.data().stock || 0) : 0;
      if (!snap.exists() || available < requestedQty) {
        shortfalls.push({ productId: items[idx].productId, name: items[idx].name, available });
      }
    });
    if (shortfalls.length) throw new InsufficientStockError(shortfalls);

    // 2. All good — decrement stock (never below 0) and write the order.
    productSnaps.forEach((snap, idx) => {
      const current = Number(snap.data().stock || 0);
      const next = Math.max(0, current - items[idx].qty);
      transaction.update(productRefs[idx], { stock: next });
    });

    transaction.set(orderRef, {
      orderId,
      uid,
      items,
      ...orderMeta,
      createdAt: serverTimestamp(),
    });
  });

  return { orderId, orderDocId: orderRef.id };
}
