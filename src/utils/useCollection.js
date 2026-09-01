// Generic Firestore collection hook — realtime list + CRUD helpers.
// Used across admin pages so every screen shares the same data pattern.
import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export function useCollection(name, orderField) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, name);
    const q = orderField ? query(ref, orderBy(orderField, 'desc')) : ref;
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [name, orderField]);

  const add = (item) => addDoc(collection(db, name), { ...item, createdAt: serverTimestamp() });
  const update = (id, item) => updateDoc(doc(db, name, id), { ...item, updatedAt: serverTimestamp() });
  const remove = (id) => deleteDoc(doc(db, name, id));

  return { data, loading, add, update, remove };
}
