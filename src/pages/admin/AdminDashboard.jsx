import { useMemo } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import { formatCurrency } from '../../utils/format';

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-ivory border border-line/10 p-5">
      <p className="text-xs text-charcoal/50 mb-2">{label}</p>
      <p className={`font-display text-2xl ${accent ? 'text-gold-deep' : 'text-ink'}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isWebsiteEnabled } = useSite();
  const { data: users } = useCollection('users');
  const { data: orders } = useCollection('orders');
  const { data: returns } = useCollection('returnRequests');
  const { data: wholesale } = useCollection('wholesaleRequests');
  const { data: cod } = useCollection('codRequests');
  const { data: upi } = useCollection('upiRequests');
  const { data: transactions } = useCollection('transactions');
  const { data: products } = useCollection('products');

  const LOW_STOCK_THRESHOLD = 5;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
  const outOfStock = products.filter((p) => p.stock === 0);

  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now - 7 * 86400000);
    const monthAgo = new Date(now - 30 * 86400000);
    const yearAgo = new Date(now - 365 * 86400000);
    const toDate = (t) => (t?.toDate ? t.toDate() : t ? new Date(t) : null);

    const sum = (list) => list.reduce((s, o) => s + (o.finalAmount || 0), 0);
    const paid = orders.filter((o) => o.paymentStatus === 'paid' || o.orderStatus === 'delivered');

    return {
      totalRevenue: sum(paid),
      weekly: sum(paid.filter((o) => toDate(o.createdAt) >= weekAgo)),
      monthly: sum(paid.filter((o) => toDate(o.createdAt) >= monthAgo)),
      yearly: sum(paid.filter((o) => toDate(o.createdAt) >= yearAgo)),
      pending: orders.filter((o) => o.orderStatus === 'pending_confirmation').length,
      completed: orders.filter((o) => o.orderStatus === 'delivered').length,
    };
  }, [orders]);

  const toggleWebsite = async () => {
    await setDoc(
      doc(db, 'settings', 'websiteStatus'),
      {
        isWebsiteEnabled: !isWebsiteEnabled,
        maintenanceMessage: 'We are updating the store — please check back shortly.',
        updatedAt: serverTimestamp(),
        updatedBy: user?.email,
      },
      { merge: true }
    );
  };

  return (
    <AdminLayout title="Dashboard">
      <button
        onClick={toggleWebsite}
        className={`w-full mb-8 py-4 font-display text-lg tracking-wide transition-colors ${
          isWebsiteEnabled ? 'bg-forest text-ivory hover:bg-forest/90' : 'bg-rust text-ivory hover:bg-rust/90'
        }`}
      >
        USER WEBSITE: {isWebsiteEnabled ? 'ON — click to turn OFF' : 'OFF — click to turn ON'}
      </button>

      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="mb-8 space-y-2">
          {outOfStock.length > 0 && (
            <div className="bg-rust/10 border border-rust/20 p-4">
              <p className="text-sm font-medium text-rust mb-1">⛔ Out of Stock</p>
              <ul className="text-xs text-rust/80 space-y-0.5">
                {outOfStock.map((p) => (
                  <li key={p.id}>{p.name} — 0 remaining</li>
                ))}
              </ul>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="bg-gold/10 border border-gold/30 p-4">
              <p className="text-sm font-medium text-gold-deep mb-1">⚠️ Low Stock Alert</p>
              <ul className="text-xs text-charcoal/70 space-y-0.5">
                {lowStock.map((p) => (
                  <li key={p.id}>{p.name} — {p.stock} remaining</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total users" value={users.length} />
        <StatCard label="Total orders" value={orders.length} />
        <StatCard label="Pending orders" value={stats.pending} />
        <StatCard label="Completed orders" value={stats.completed} />
        <StatCard label="Return requests" value={returns.length} />
        <StatCard label="Wholesale requests" value={wholesale.length} />
        <StatCard label="COD requests" value={cod.length} />
        <StatCard label="UPI requests" value={upi.length} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total revenue" value={formatCurrency(stats.totalRevenue)} accent />
        <StatCard label="Weekly income" value={formatCurrency(stats.weekly)} accent />
        <StatCard label="Monthly income" value={formatCurrency(stats.monthly)} accent />
        <StatCard label="Yearly income" value={formatCurrency(stats.yearly)} accent />
      </div>

      <p className="text-xs text-charcoal/40 mt-8">{transactions.length} payment transactions recorded.</p>
    </AdminLayout>
  );
}
