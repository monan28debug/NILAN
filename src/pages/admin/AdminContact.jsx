import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';

export default function AdminContact() {
  const { data } = useCollection('settings');
  const contact = data.find((d) => d.id === 'contact') || {};
  const [form, setForm] = useState({ email: '', messenger: '', phone: '' });

  useEffect(() => { setForm({ email: contact.email || '', messenger: contact.messenger || '', phone: contact.phone || '' }); }, [contact.email, contact.messenger, contact.phone]);

  const save = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, 'settings', 'contact'), form, { merge: true });
    alert('Contact details saved.');
  };

  return (
    <AdminLayout title="Contact Settings">
      <form onSubmit={save} className="bg-ivory border border-line/10 p-5 space-y-3 max-w-md">
        <input placeholder="Gmail contact" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Messenger contact" className="input-field" value={form.messenger} onChange={(e) => setForm({ ...form, messenger: e.target.value })} />
        <input placeholder="Phone" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button className="btn-gold">Save</button>
      </form>
    </AdminLayout>
  );
}
