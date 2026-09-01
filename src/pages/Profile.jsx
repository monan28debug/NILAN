import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../utils/useCollection';
import { formatCurrency, formatDate } from '../utils/format';

export default function Profile({ onRequireLogin }) {
  const { user, profile, saveProfile } = useAuth();
  const { data: orders } = useCollection('orders', 'createdAt');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile || {});

  const mineOrders = orders.filter((o) => o.uid === user?.uid);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const save = async () => {
    await saveProfile(form);
    setEditing(false);
  };

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title">Profile</h1>
          <button onClick={() => (editing ? save() : setEditing(true))} className="btn-outline text-sm px-5 py-2">
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {[
            ['name', 'Name'],
            ['gender', 'Gender'],
            ['phone1', 'Phone Number 1'],
            ['phone2', 'Phone Number 2'],
            ['address', 'Address'],
            ['landmark', 'Landmark'],
          ].map(([key, label]) => (
            <div key={key}>
              <p className="text-xs text-charcoal/50 mb-1">{label}</p>
              {editing ? (
                <input className="input-field" value={form[key] || ''} onChange={set(key)} />
              ) : (
                <p className="text-sm">{profile?.[key] || '—'}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Order History</h2>
          <Link to="/orders" className="text-xs text-gold-deep underline">View all</Link>
        </div>
        <div className="space-y-2">
          {mineOrders.length === 0 ? (
            <p className="text-charcoal/40 text-sm">No orders yet.</p>
          ) : (
            mineOrders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex justify-between text-sm border-b border-line/10 py-2">
                <span>{o.orderId} · {formatDate(o.createdAt)} · <span className="capitalize text-charcoal/50">{o.paymentStatus?.replaceAll('_', ' ')}</span></span>
                <span>{formatCurrency(o.finalAmount)}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
