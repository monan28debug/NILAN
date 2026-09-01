import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function AdminTransactions() {
  const { data } = useCollection('transactions', 'createdAt');
  return (
    <AdminLayout title="Payment Transactions">
      <div className="overflow-x-auto bg-ivory border border-line/10">
        <table className="w-full text-sm">
          <thead className="bg-parchment text-left">
            <tr>{['Order ID', 'Amount', 'Method', 'Status', 'Date/time'].map((h) => <th key={h} className="px-4 py-3 font-medium text-charcoal/60">{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((t) => (
              <tr key={t.id} className="border-t border-line/10">
                <td className="px-4 py-3">{t.orderId}</td>
                <td className="px-4 py-3">{formatCurrency(t.amount)}</td>
                <td className="px-4 py-3 uppercase text-xs">{t.paymentMethod}</td>
                <td className="px-4 py-3 capitalize">{t.paymentStatus}</td>
                <td className="px-4 py-3 text-xs text-charcoal/50">{formatDateTime(t.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <p className="p-6 text-charcoal/40 text-sm">No transactions yet.</p>}
      </div>
    </AdminLayout>
  );
}
