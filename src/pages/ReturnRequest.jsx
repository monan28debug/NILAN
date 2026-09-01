import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCollection } from '../utils/useCollection';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/format';

export default function ReturnRequest({ onRequireLogin }) {
  const { user } = useAuth();
  const { data: orders } = useCollection('orders', 'createdAt');
  const { data: returns } = useCollection('returnRequests', 'createdAt');
  const mineOrders = orders.filter((o) => o.uid === user?.uid && o.orderStatus === 'delivered');
  const myReturns = returns.filter((r) => r.uid === user?.uid);

  const [orderId, setOrderId] = useState('');
  const [productName, setProductName] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!orderId || !reason) return;
    await addDoc(collection(db, 'returnRequests'), {
      uid: user.uid,
      orderId,
      productName,
      reason,
      status: 'pending_admin_confirmation',
      createdAt: serverTimestamp(),
    });
    setSubmitted(true);
    setOrderId(''); setProductName(''); setReason('');
  };

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-10">
        <h1 className="section-title mb-8">Return Request</h1>

        {mineOrders.length === 0 ? (
          <p className="text-charcoal/50 text-sm mb-10">
            Returns can be requested once an eligible order has been delivered.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4 mb-12 bg-parchment/60 p-6">
            <select required className="input-field bg-ivory" value={orderId} onChange={(e) => setOrderId(e.target.value)}>
              <option value="">Select order</option>
              {mineOrders.map((o) => <option key={o.id} value={o.orderId}>{o.orderId}</option>)}
            </select>
            <input
              placeholder="Product name"
              className="input-field bg-ivory"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <textarea
              required
              placeholder="Reason for return"
              className="input-field bg-ivory"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button className="btn-gold">Submit Return Request</button>
            {submitted && <p className="text-xs text-forest">Request submitted — pending admin confirmation.</p>}
          </form>
        )}

        <h2 className="font-display text-xl mb-4">Your Requests</h2>
        {myReturns.length === 0 ? (
          <p className="text-charcoal/40 text-sm">No return requests yet.</p>
        ) : (
          <div className="space-y-3">
            {myReturns.map((r) => (
              <div key={r.id} className="border border-line/10 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{r.orderId}</span>
                  <span className="text-xs px-2 py-1 bg-gold/10 text-gold-deep capitalize">{r.status?.replaceAll('_', ' ')}</span>
                </div>
                <p className="text-charcoal/60 mt-1">{r.reason}</p>
                {r.adminNote && <p className="text-xs text-charcoal/50 mt-1">Admin note: {r.adminNote}</p>}
                <p className="text-xs text-charcoal/40 mt-1">{formatDate(r.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
