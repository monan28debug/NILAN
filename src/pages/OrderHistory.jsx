import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCollection } from '../utils/useCollection';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDateTime } from '../utils/format';

const PAYMENT_STATUS_COLORS = {
  pending: 'bg-gold/10 text-gold-deep',
  pending_verification: 'bg-gold/10 text-gold-deep',
  paid: 'bg-forest/10 text-forest',
  failed: 'bg-rust/10 text-rust',
  refunded: 'bg-rust/10 text-rust',
  cancelled: 'bg-charcoal/10 text-charcoal/60',
};

export default function OrderHistory({ onRequireLogin }) {
  const { user } = useAuth();
  const { data: orders } = useCollection('orders', 'createdAt');
  const mine = orders.filter((o) => o.uid === user?.uid);

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <h1 className="section-title mb-8">Order History</h1>
        {mine.length === 0 ? (
          <p className="text-charcoal/50 text-sm">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {mine.map((o) => (
              <div key={o.id} className="border border-line/10 p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-display text-lg">{o.orderId}</span>
                  <span className="text-xs px-2 py-1 bg-gold/10 text-gold-deep capitalize">
                    {o.orderStatus?.replaceAll('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-charcoal/60 mb-4">
                  {o.items?.map((i) => `${i.name} × ${i.qty}`).join(', ')}
                </p>

                {/* Payment details, integrated directly into the order — no separate transactions page */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-parchment/50 p-3">
                  <div>
                    <p className="text-charcoal/40 mb-0.5">Amount</p>
                    <p className="font-medium">{formatCurrency(o.finalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/40 mb-0.5">Payment method</p>
                    <p className="font-medium uppercase">{o.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/40 mb-0.5">Payment status</p>
                    <p className={`inline-block px-1.5 py-0.5 rounded font-medium capitalize ${PAYMENT_STATUS_COLORS[o.paymentStatus] || ''}`}>
                      {o.paymentStatus?.replaceAll('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-charcoal/40 mb-0.5">Date / time</p>
                    <p className="font-medium">{formatDateTime(o.createdAt)}</p>
                  </div>
                  {o.transactionRef && (
                    <div className="col-span-2 md:col-span-4">
                      <p className="text-charcoal/40 mb-0.5">Transaction reference</p>
                      <p className="font-medium">{o.transactionRef}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
