import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function WholesaleRequest({ onRequireLogin }) {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    name: profile?.name || '',
    address: profile?.address || '',
    phone: profile?.phone1 || '',
    description: '',
  });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.description) return;
    await addDoc(collection(db, 'wholesaleRequests'), {
      uid: user.uid,
      ...form,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    setSent(true);
  };

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-lg mx-auto px-4 md:px-8 py-10">
        <h1 className="section-title mb-3">Wholesale Request</h1>
        <p className="text-charcoal/60 text-sm mb-8">Tell us what you're looking for and our team will get in touch.</p>
        {sent ? (
          <p className="text-forest text-sm">Request sent — we'll contact you shortly.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input required placeholder="Name" className="input-field" value={form.name} onChange={set('name')} />
            <input required placeholder="Phone / contact" className="input-field" value={form.phone} onChange={set('phone')} />
            <input placeholder="Basic address" className="input-field" value={form.address} onChange={set('address')} />
            <textarea
              required
              placeholder="Wholesale requirement / description"
              className="input-field"
              rows={4}
              value={form.description}
              onChange={set('description')}
            />
            <button className="btn-gold w-full">Send Request</button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
