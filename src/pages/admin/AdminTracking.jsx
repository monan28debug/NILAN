import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/format';

const STATUS_OPTIONS = ['Order Confirmed', 'Processing', 'Packed', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered', 'Other'];

export default function AdminTracking() {
  const { user } = useAuth();
  const { data: orders } = useCollection('orders');
  const { data: updates, add } = useCollection('trackingUpdates', 'createdAt');
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [note, setNote] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!orderId) return;
    await add({ orderId, status, note, adminId: user?.email });
    setNote('');
  };

  const history = updates.filter((u) => u.orderId === orderId);

  return (
    <AdminLayout title="Tracking">
      <form onSubmit={submit} className="bg-ivory border border-line/10 p-5 space-y-3 max-w-md mb-8">
        <select required className="input-field" value={orderId} onChange={(e) => setOrderId(e.target.value)}>
          <option value="">Select Order ID</option>
          {orders.map((o) => <option key={o.id} value={o.orderId}>{o.orderId}</option>)}
        </select>
        <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input placeholder="Note (optional)" className="input-field" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="btn-gold">Add tracking update</button>
      </form>

      {orderId && (
        <div>
          <h3 className="font-display text-lg mb-3">History for {orderId}</h3>
          <div className="space-y-2">
            {history.map((u) => (
              <div key={u.id} className="text-sm border-b border-line/10 pb-2">
                <span className="font-medium">{u.status}</span> — {u.note}
                <p className="text-xs text-charcoal/40">{formatDateTime(u.createdAt)} · {u.adminId}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
