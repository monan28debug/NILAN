import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import ImageUploadField from '../../components/ImageUploadField';
import { useCollection } from '../../utils/useCollection';

export default function AdminPaymentSettings() {
  const { data } = useCollection('settings');
  const payment = data.find((d) => d.id === 'payment') || {};
  const [form, setForm] = useState({ upiId: '', upiQrUrl: '', razorpayEnabled: false, razorpayFee: 2 });

  useEffect(() => {
    setForm({
      upiId: payment.upiId || '',
      upiQrUrl: payment.upiQrUrl || '',
      razorpayEnabled: !!payment.razorpayEnabled,
      razorpayFee: payment.razorpayFee ?? 2,
    });
  }, [payment.upiId, payment.upiQrUrl, payment.razorpayEnabled, payment.razorpayFee]);

  const save = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, 'settings', 'payment'), form, { merge: true });
    alert('Payment settings saved.');
  };

  return (
    <AdminLayout title="Payment Settings">
      <form onSubmit={save} className="bg-ivory border border-line/10 p-5 space-y-4 max-w-md">
        <div>
          <p className="text-xs text-charcoal/50 mb-1">UPI ID</p>
          <input className="input-field" value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} />
        </div>
        <ImageUploadField value={form.upiQrUrl} onChange={(url) => setForm({ ...form, upiQrUrl: url })} label="UPI QR / scan image" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.razorpayEnabled} onChange={(e) => setForm({ ...form, razorpayEnabled: e.target.checked })} />
          Enable Razorpay (adds the payment fee below to UPI checkout)
        </label>
        <div>
          <p className="text-xs text-charcoal/50 mb-1">Razorpay fee (₹)</p>
          <input type="number" className="input-field" value={form.razorpayFee} onChange={(e) => setForm({ ...form, razorpayFee: Number(e.target.value) })} />
        </div>
        <p className="text-xs text-charcoal/40">
          Add your Razorpay Key ID as VITE_RAZORPAY_KEY_ID in .env. Secrets stay server-side — see README.
        </p>
        <button className="btn-gold">Save</button>
      </form>
    </AdminLayout>
  );
}
