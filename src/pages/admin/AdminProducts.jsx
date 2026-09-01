import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUploadField from '../../components/ImageUploadField';
import { useCollection } from '../../utils/useCollection';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { formatCurrency } from '../../utils/format';

const empty = { name: '', price: '', description: '', shortDetails: '', category: '', stock: 10, imageUrl: '', enabled: true };

export default function AdminProducts() {
  const { data: products, add, update, remove } = useCollection('products', 'createdAt');
  const { data: categories } = useCollection('categories');
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const logHistory = async (productId, changeType, previousValue, newValue) => {
    await addDoc(collection(db, 'productHistory'), {
      productId, changeType, previousValue: previousValue ?? null, newValue: newValue ?? null,
      createdAt: serverTimestamp(),
    });
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.imageUrl) return alert('Name, price and image are required.');
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editingId) {
      const prev = products.find((p) => p.id === editingId);
      await update(editingId, payload);
      await logHistory(editingId, 'edited', prev, payload);
    } else {
      const ref = await add(payload);
      await logHistory(ref.id, 'created', null, payload);
    }
    setForm(empty);
    setEditingId(null);
  };

  const edit = (p) => {
    setForm({ name: p.name, price: p.price, description: p.description, shortDetails: p.shortDetails, category: p.category, stock: p.stock, imageUrl: p.imageUrl, enabled: p.enabled });
    setEditingId(p.id);
  };

  const del = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await remove(p.id);
    await logHistory(p.id, 'deleted', p, null);
  };

  return (
    <AdminLayout title="Products">
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-8">
        <form onSubmit={submit} className="bg-ivory border border-line/10 p-5 space-y-3 h-fit">
          <h3 className="font-display text-lg mb-1">{editingId ? 'Edit product' : 'Add product'}</h3>
          <input required placeholder="Name" className="input-field" value={form.name} onChange={set('name')} />
          <input required type="number" placeholder="Price" className="input-field" value={form.price} onChange={set('price')} />
          <select className="input-field" value={form.category} onChange={set('category')}>
            <option value="">Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" placeholder="Stock" className="input-field" value={form.stock} onChange={set('stock')} />
          <input placeholder="Short details" className="input-field" value={form.shortDetails} onChange={set('shortDetails')} />
          <textarea placeholder="Description" className="input-field" rows={3} value={form.description} onChange={set('description')} />
          <ImageUploadField value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} label="Product image" />
          <div className="flex gap-2 pt-2">
            <button className="btn-gold flex-1">{editingId ? 'Save changes' : 'Add product'}</button>
            {editingId && (
              <button type="button" onClick={() => { setForm(empty); setEditingId(null); }} className="btn-outline">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex gap-4 items-center bg-ivory border border-line/10 p-3">
              <img src={p.imageUrl} alt="" className="w-14 h-16 object-cover bg-parchment" />
              <div className="flex-1">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-charcoal/50">{formatCurrency(p.price)} · Stock {p.stock}</p>
              </div>
              <button onClick={() => edit(p)} className="text-xs text-gold-deep underline">Edit</button>
              <button onClick={() => del(p)} className="text-xs text-rust underline">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
