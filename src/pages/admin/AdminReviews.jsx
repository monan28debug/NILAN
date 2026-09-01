import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';
import { formatDate } from '../../utils/format';

export default function AdminReviews() {
  const { data, remove } = useCollection('reviews', 'createdAt');
  const { data: products } = useCollection('products');
  const nameOf = (id) => products.find((p) => p.id === id)?.name || id;

  return (
    <AdminLayout title="Reviews">
      <div className="space-y-3">
        {data.map((r) => (
          <div key={r.id} className="bg-ivory border border-line/10 p-4 flex justify-between items-start gap-4">
            <div>
              <p className="text-sm font-medium">{nameOf(r.productId)} — {r.name}</p>
              <p className="text-gold text-sm">{'★'.repeat(r.rating)}</p>
              <p className="text-sm text-charcoal/70">{r.comment}</p>
              <p className="text-xs text-charcoal/40 mt-1">{formatDate(r.createdAt)}</p>
            </div>
            <button onClick={() => remove(r.id)} className="text-xs text-rust underline whitespace-nowrap">Delete</button>
          </div>
        ))}
        {data.length === 0 && <p className="text-charcoal/40 text-sm">No reviews yet.</p>}
      </div>
    </AdminLayout>
  );
}
