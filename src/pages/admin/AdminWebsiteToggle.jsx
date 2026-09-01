import { useState, useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import { useSite } from '../../context/SiteContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminWebsiteToggle() {
  const site = useSite();
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  useEffect(() => setMessage(site.maintenanceMessage || ''), [site.maintenanceMessage]);

  const save = async (enabled) => {
    await setDoc(
      doc(db, 'settings', 'websiteStatus'),
      { isWebsiteEnabled: enabled, maintenanceMessage: message, updatedAt: serverTimestamp(), updatedBy: user?.email },
      { merge: true }
    );
  };

  return (
    <AdminLayout title="Website ON/OFF">
      <div className="max-w-md bg-ivory border border-line/10 p-6">
        <p className="text-sm text-charcoal/60 mb-4">
          Current status: <span className={site.isWebsiteEnabled ? 'text-forest font-medium' : 'text-rust font-medium'}>
            {site.isWebsiteEnabled ? 'ON' : 'OFF'}
          </span>
        </p>
        <p className="text-xs text-charcoal/50 mb-1">Maintenance message</p>
        <textarea className="input-field mb-4" rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="flex gap-3">
          <button onClick={() => save(true)} className="btn-outline flex-1">Turn ON</button>
          <button onClick={() => save(false)} className="bg-rust text-ivory flex-1 py-3 hover:bg-rust/90">Turn OFF</button>
        </div>
      </div>
    </AdminLayout>
  );
}
