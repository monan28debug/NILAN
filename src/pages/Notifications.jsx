import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCollection } from '../utils/useCollection';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/format';

export default function Notifications({ onRequireLogin }) {
  const { user } = useAuth();
  const { data } = useCollection('notifications', 'createdAt');
  const mine = data.filter((n) => n.uid === user?.uid);

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-10">
        <h1 className="section-title mb-8">Notifications</h1>
        {mine.length === 0 ? (
          <p className="text-charcoal/50 text-sm">No notifications yet.</p>
        ) : (
          <div className="space-y-3">
            {mine.map((n) => (
              <div key={n.id} className="border border-line/10 p-4 text-sm">
                <p>{n.message}</p>
                <p className="text-xs text-charcoal/40 mt-1">{formatDateTime(n.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
