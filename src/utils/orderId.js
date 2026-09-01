// Generates sequential Order IDs in the format: 3 letters + 2+ digits
// NIL01, NIL02, ... NIL99, NIL100, NIL101 ...
// Uses a Firestore counter doc (settings/orderCounter) so IDs never collide,
// even with concurrent orders, and safely extends past 99.
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase/config';

const PREFIX = 'NIL';

export async function generateOrderId() {
  const counterRef = doc(db, 'settings', 'orderCounter');
  const newId = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef);
    const current = snap.exists() ? snap.data().value : 0;
    const next = current + 1;
    transaction.set(counterRef, { value: next }, { merge: true });
    const padded = String(next).length < 2 ? String(next).padStart(2, '0') : String(next);
    return `${PREFIX}${padded}`;
  });
  return newId;
}
