import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUploadField from '../../components/ImageUploadField';
import { useCollection } from '../../utils/useCollection';

const empty = { title: '', eyebrow: '', description: '', link: '', imageUrl: '', enabled: true, order: 0 };

export default function AdminBanners() {
  const { data, add, update, remove } = useCollection('banners', 'order');
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (data.length >= 5 && !editingId) return alert('Maximum of 5 banner slides allowed. Edit or delete an existing one.');
    if (!form.title || !form.imageUrl) return alert('Title and image required.');
    if (editingId) await update(editingId, form);
    else await add(form);
    setForm(empty);
    setEditingId(null);
  };

  return (
    <AdminLayout title="Banners (5 slides)">
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-8">
        <form onSubmit={submit} className="bg-ivory border border-line/10 p-5 space-y-3 h-fit">
          <h3 className="font-display text-lg">{editingId ? 'Edit slide' : `Add slide (${data.length}/5)`}</h3>
          <input placeholder="Eyebrow (e.g. New arrival)" className="input-field" value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
          <input required placeholder="Title" className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Description" className="input-field" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Link / button URL (optional)" className="input-field" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
          <input type="number" placeholder="Order" className="input-field" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          <ImageUploadField value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
            Enabled
          </label>
          <div className="flex gap-2">
            <button className="btn-gold flex-1">{editingId ? 'Save' : 'Add slide'}</button>
            {editingId && <button type="button" onClick={() => { setForm(empty); setEditingId(null); }} className="btn-outline">Cancel</button>}
          </div>
        </form>
        <div className="space-y-3">
          {data.map((b) => (
            <div key={b.id} className="flex gap-4 items-center bg-ivory border border-line/10 p-3">
              <img src={b.imageUrl} alt="" className="w-20 h-12 object-cover bg-parchment" />
              <p className="flex-1 text-sm">{b.title} {b.enabled === false && <span className="text-rust text-xs">(disabled)</span>}</p>
              <button onClick={() => { setForm(b); setEditingId(b.id); }} className="text-xs text-gold-deep underline">Edit</button>
              <button onClick={() => remove(b.id)} className="text-xs text-rust underline">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
