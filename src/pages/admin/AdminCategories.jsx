import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUploadField from '../../components/ImageUploadField';
import { useCollection } from '../../utils/useCollection';

const empty = { name: '', imageUrl: '', enabled: true };

export default function AdminCategories() {
  const { data, add, update, remove } = useCollection('categories', 'createdAt');
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.imageUrl) return alert('Name and image required.');
    if (editingId) await update(editingId, form);
    else await add(form);
    setForm(empty);
    setEditingId(null);
  };

  return (
    <AdminLayout title="Categories">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
        <form onSubmit={submit} className="bg-ivory border border-line/10 p-5 space-y-3 h-fit">
          <h3 className="font-display text-lg">{editingId ? 'Edit category' : 'Add category'}</h3>
          <input required placeholder="Category name" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <ImageUploadField value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
            Enabled
          </label>
          <div className="flex gap-2">
            <button className="btn-gold flex-1">{editingId ? 'Save' : 'Add'}</button>
            {editingId && <button type="button" onClick={() => { setForm(empty); setEditingId(null); }} className="btn-outline">Cancel</button>}
          </div>
          <p className="text-xs text-charcoal/40">Only the first 3 enabled categories show on the homepage.</p>
        </form>
        <div className="space-y-3">
          {data.map((c) => (
            <div key={c.id} className="flex gap-4 items-center bg-ivory border border-line/10 p-3">
              <img src={c.imageUrl} alt="" className="w-14 h-14 object-cover bg-parchment" />
              <p className="flex-1 text-sm">{c.name} {c.enabled === false && <span className="text-rust text-xs">(disabled)</span>}</p>
              <button onClick={() => { setForm(c); setEditingId(c.id); }} className="text-xs text-gold-deep underline">Edit</button>
              <button onClick={() => remove(c.id)} className="text-xs text-rust underline">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
