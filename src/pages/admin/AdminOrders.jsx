import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';
import { formatCurrency, formatDate } from '../../utils/format';

const STATUSES = ['pending_confirmation', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
// Admin-only manual override — the actual state of money changing hands.
// Restricted to Admin because this whole page sits behind AdminRoute + AdminSidebar,
// and Firestore rules only allow isAdmin() to write to the orders collection.
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded', 'cancelled'];

export default function AdminOrders() {
  const { data: orders, update } = useCollection('orders', 'createdAt');

  return (
    <AdminLayout title="Orders">
      {/* Mobile: stacked cards */}
      <div className="space-y-3 md:hidden">
        {orders.map((o) => (
          <div key={o.id} className="bg-ivory border border-line/10 p-4 text-sm space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-medium">{o.orderId}</span>
              <span className="text-xs text-charcoal/50">{formatDate(o.createdAt)}</span>
            </div>
            <p className="text-charcoal/60">{o.customerName} · {o.phone}</p>
            <p>{formatCurrency(o.finalAmount)} · <span className="uppercase text-xs">{o.paymentMethod}</span></p>
            <div>
              <label className="block text-xs text-charcoal/40 mb-1">Order status</label>
              <select
                value={o.orderStatus}
                onChange={(e) => update(o.id, { orderStatus: e.target.value })}
                className="border border-line/20 text-xs px-2 py-1.5 w-full"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-charcoal/40 mb-1">Payment status</label>
              <select
                value={o.paymentStatus}
                onChange={(e) => update(o.id, { paymentStatus: e.target.value })}
                className="border border-line/20 text-xs px-2 py-1.5 w-full"
              >
                {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-charcoal/40 text-sm">No orders yet.</p>}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto bg-ivory border border-line/10">
        <table className="w-full text-sm">
          <thead className="bg-parchment text-left">
            <tr>
              {['Order ID', 'Customer', 'Phone', 'Amount', 'Method', 'Payment status', 'Order status', 'Date'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium text-charcoal/60 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-line/10">
                <td className="px-4 py-3 font-medium whitespace-nowrap">{o.orderId}</td>
                <td className="px-4 py-3">{o.customerName}</td>
                <td className="px-4 py-3">{o.phone}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatCurrency(o.finalAmount)}</td>
                <td className="px-4 py-3 uppercase text-xs">{o.paymentMethod}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.paymentStatus}
                    onChange={(e) => update(o.id, { paymentStatus: e.target.value })}
                    className="border border-line/20 text-xs px-2 py-1"
                  >
                    {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.orderStatus}
                    onChange={(e) => update(o.id, { orderStatus: e.target.value })}
                    className="border border-line/20 text-xs px-2 py-1"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-charcoal/50 whitespace-nowrap">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-charcoal/40 text-sm">No orders yet.</p>}
      </div>
    </AdminLayout>
  );
}
