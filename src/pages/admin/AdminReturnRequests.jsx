import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';
import { formatDate } from '../../utils/format';

export default function AdminReturnRequests() {
  const { data, update } = useCollection('returnRequests', 'createdAt');
  const [notes, setNotes] = useState({});

  return (
    <AdminLayout title="Return Requests">
      <div className="space-y-3">
        {data.map((r) => (
          <div key={r.id} className="bg-ivory border border-line/10 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-sm">{r.orderId} — {r.productName}</p>
                <p className="text-xs text-charcoal/50">{formatDate(r.createdAt)}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-gold/10 text-gold-deep capitalize">{r.status?.replaceAll('_', ' ')}</span>
            </div>
            <p className="text-sm text-charcoal/70 mb-3">{r.reason}</p>
            <div className="flex gap-2 items-center">
              <input
                placeholder="Admin note"
                defaultValue={r.adminNote}
                onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
                className="input-field flex-1 text-sm py-1.5"
              />
              <button onClick={() => update(r.id, { status: 'approved', adminNote: notes[r.id] ?? r.adminNote ?? '' })} className="btn-outline text-xs px-3 py-1.5">Approve</button>
              <button onClick={() => update(r.id, { status: 'rejected', adminNote: notes[r.id] ?? r.adminNote ?? '' })} className="text-xs text-rust underline">Reject</button>
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-charcoal/40 text-sm">No return requests yet.</p>}
      </div>
    </AdminLayout>
  );
}
