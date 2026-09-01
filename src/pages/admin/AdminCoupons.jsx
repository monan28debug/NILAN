import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';

const empty = {
  code: '', discountType: 'percent', discountValue: '', minOrderAmount: '', maxDiscount: '',
  usageLimit: '', perUserLimit: '', enabled: true,
};

export default function AdminCoupons() {
  const { data, add, update, remove } = useCollection('coupons', 'createdAt');
  const { data: usage } = useCollection('couponUsage');
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) return alert('Code and discount value required.');
    const payload = {
      ...form,
      code: form.code.toUpperCase(),
      discountValue: Number(form.discountValue),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : null,
    };
    if (editingId) await update(editingId, payload);
    else await add(payload);
    setForm(empty);
    setEditingId(null);
  };

  return (
    <AdminLayout title="Coupons">
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-8">
        <form onSubmit={submit} className="bg-ivory border border-line/10 p-5 space-y-3 h-fit">
          <h3 className="font-display text-lg">{editingId ? 'Edit coupon' : 'Create coupon'}</h3>
          <input required placeholder="Coupon code" className="input-field uppercase" value={form.code} onChange={set('code')} />
          <select className="input-field" value={form.discountType} onChange={set('discountType')}>
            <option value="percent">Percent off</option>
            <option value="flat">Flat amount off</option>
          </select>
          <input required type="number" placeholder="Discount value" className="input-field" value={form.discountValue} onChange={set('discountValue')} />
          <input type="number" placeholder="Minimum order amount" className="input-field" value={form.minOrderAmount} onChange={set('minOrderAmount')} />
          <input type="number" placeholder="Max discount (optional)" className="input-field" value={form.maxDiscount} onChange={set('maxDiscount')} />
          <input type="number" placeholder="Total usage limit (optional)" className="input-field" value={form.usageLimit} onChange={set('usageLimit')} />
          <input type="number" placeholder="Per-user usage limit (optional)" className="input-field" value={form.perUserLimit} onChange={set('perUserLimit')} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
            Enabled
          </label>
          <div className="flex gap-2">
            <button className="btn-gold flex-1">{editingId ? 'Save' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => { setForm(empty); setEditingId(null); }} className="btn-outline">Cancel</button>}
          </div>
        </form>
        <div className="space-y-3">
          {data.map((c) => (
            <div key={c.id} className="bg-ivory border border-line/10 p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{c.code} — {c.discountType === 'percent' ? `${c.discountValue}%` : `₹${c.discountValue}`} off</p>
                <p className="text-xs text-charcoal/50">
                  Used {usage.filter((u) => u.couponCode === c.code).length} time(s)
                  {c.enabled === false && ' · disabled'}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setForm(c); setEditingId(c.id); }} className="text-xs text-gold-deep underline">Edit</button>
                <button onClick={() => update(c.id, { enabled: !c.enabled })} className="text-xs text-charcoal/60 underline">
                  {c.enabled === false ? 'Enable' : 'Disable'}
                </button>
                <button onClick={() => remove(c.id)} className="text-xs text-rust underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
