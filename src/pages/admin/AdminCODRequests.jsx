import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';
import { formatCurrency, formatDate } from '../../utils/format';

export default function AdminCODRequests() {
  const { data: requests, update: updateRequest } = useCollection('codRequests', 'createdAt');
  const { data: orders, update: updateOrder } = useCollection('orders');

  const confirm = async (r) => {
    await updateRequest(r.id, { status: 'confirmed' });
    const order = orders.find((o) => o.orderId === r.orderId);
    if (order) {
      await updateOrder(order.id, { orderStatus: 'confirmed', paymentStatus: 'pending' });
    }
    await addDoc(collection(db, 'notifications'), {
      uid: r.uid,
      message: `Your COD order ${r.orderId} has been confirmed by our team.`,
      createdAt: serverTimestamp(),
    });
  };

  const reject = async (r) => {
    await updateRequest(r.id, { status: 'rejected' });
    const order = orders.find((o) => o.orderId === r.orderId);
    if (order) await updateOrder(order.id, { orderStatus: 'cancelled' });
  };

  return (
    <AdminLayout title="COD Requests">
      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="bg-ivory border border-line/10 p-4 flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="font-medium text-sm">{r.orderId} · {r.customerName}</p>
              <p className="text-xs text-charcoal/50">{r.phone} · {r.address}</p>
              <p className="text-xs text-charcoal/40">{formatDate(r.createdAt)} · {formatCurrency(r.finalAmount)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-gold/10 text-gold-deep capitalize">{r.status || 'pending'}</span>
              {(!r.status || r.status === 'pending') && (
                <>
                  <button onClick={() => confirm(r)} className="btn-outline text-xs px-3 py-1.5">Confirm</button>
                  <button onClick={() => reject(r)} className="text-xs text-rust underline">Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
        {requests.length === 0 && <p className="text-charcoal/40 text-sm">No COD requests yet.</p>}
      </div>
    </AdminLayout>
  );
}
