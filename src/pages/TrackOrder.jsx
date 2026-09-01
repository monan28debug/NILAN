import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCollection } from '../utils/useCollection';
import { formatDateTime } from '../utils/format';

export default function TrackOrder({ onRequireLogin }) {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [searched, setSearched] = useState(false);
  const { data: orders } = useCollection('orders');
  const { data: updates } = useCollection('trackingUpdates', 'createdAt');

  const order = orders.find((o) => o.orderId?.toLowerCase() === orderIdInput.trim().toLowerCase());
  const history = order ? updates.filter((u) => u.orderId === order.orderId) : [];

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-10">
        <h1 className="section-title mb-8">Track Order</h1>
        <div className="flex gap-2 mb-8">
          <input
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            placeholder="Enter Order ID e.g. NIL01"
            className="input-field"
          />
          <button onClick={() => setSearched(true)} className="btn-outline px-6 whitespace-nowrap">Track</button>
        </div>

        {searched && !order && <p className="text-charcoal/50 text-sm">No order found with that ID.</p>}

        {order && (
          <div>
            <div className="border border-line/10 p-5 mb-6 text-sm space-y-1">
              <p><span className="text-charcoal/50">Order ID:</span> {order.orderId}</p>
              <p><span className="text-charcoal/50">Order status:</span> {order.orderStatus}</p>
              <p><span className="text-charcoal/50">Payment status:</span> {order.paymentStatus}</p>
            </div>
            <h2 className="text-sm font-medium mb-4 text-charcoal/60">Tracking updates</h2>
            {history.length === 0 ? (
              <p className="text-charcoal/40 text-sm">No tracking updates yet.</p>
            ) : (
              <div className="space-y-4 border-l border-gold/40 pl-5">
                {history.map((u) => (
                  <div key={u.id}>
                    <p className="text-sm font-medium">{u.status}</p>
                    {u.note && <p className="text-xs text-charcoal/50">{u.note}</p>}
                    <p className="text-xs text-charcoal/40">{formatDateTime(u.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
