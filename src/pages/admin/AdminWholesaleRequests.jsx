import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';
import { formatDate } from '../../utils/format';

export default function AdminWholesaleRequests() {
  const { data, update } = useCollection('wholesaleRequests', 'createdAt');
  return (
    <AdminLayout title="Wholesale Requests">
      <div className="space-y-3">
        {data.map((r) => (
          <div key={r.id} className="bg-ivory border border-line/10 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-sm">{r.name} · {r.phone}</p>
                <p className="text-xs text-charcoal/50">{r.address}</p>
                <p className="text-xs text-charcoal/40">{formatDate(r.createdAt)}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-gold/10 text-gold-deep capitalize">{r.status}</span>
            </div>
            <p className="text-sm text-charcoal/70 mb-3">{r.description}</p>
            {r.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => update(r.id, { status: 'approved' })} className="btn-outline text-xs px-3 py-1.5">Approve</button>
                <button onClick={() => update(r.id, { status: 'rejected' })} className="text-xs text-rust underline">Reject</button>
              </div>
            )}
          </div>
        ))}
        {data.length === 0 && <p className="text-charcoal/40 text-sm">No wholesale requests yet.</p>}
      </div>
    </AdminLayout>
  );
}
