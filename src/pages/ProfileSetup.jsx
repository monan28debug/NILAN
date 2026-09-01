import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfileSetup() {
  const { saveProfile, profile, user, needsProfileSetup } = useAuth();
  const navigate = useNavigate();

  // Returning users whose profile is already complete skip straight through —
  // this page only needs to appear the first time.
  useEffect(() => {
    if (user && !needsProfileSetup) navigate('/home', { replace: true });
  }, [user, needsProfileSetup, navigate]);
  const [form, setForm] = useState({
    name: profile?.name || user?.displayName || '',
    gender: profile?.gender || '',
    phone1: profile?.phone1 || '',
    phone2: profile?.phone2 || '',
    address: profile?.address || '',
    landmark: profile?.landmark || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone1 || !form.address) return;
    setSaving(true);
    await saveProfile(form);
    setSaving(false);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-6 py-12">
      <form onSubmit={submit} className="w-full max-w-md bg-ivory p-8 border border-line/10">
        <p className="kicker mb-2">Almost done — just for delivery</p>
        <h1 className="font-display text-2xl mb-6">Confirm your details</h1>

        <label className="block text-xs text-charcoal/60 mb-1">Name *</label>
        <input required className="input-field mb-4" value={form.name} onChange={set('name')} />

        <label className="block text-xs text-charcoal/60 mb-1">Gender (optional)</label>
        <select className="input-field mb-4" value={form.gender} onChange={set('gender')}>
          <option value="">Prefer not to say</option>
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
        </select>

        <label className="block text-xs text-charcoal/60 mb-1">Phone Number 1 *</label>
        <input required className="input-field mb-4" value={form.phone1} onChange={set('phone1')} />

        <label className="block text-xs text-charcoal/60 mb-1">Phone Number 2 (optional)</label>
        <input className="input-field mb-4" value={form.phone2} onChange={set('phone2')} />

        <label className="block text-xs text-charcoal/60 mb-1">Address *</label>
        <textarea required className="input-field mb-4" rows={3} value={form.address} onChange={set('address')} />

        <label className="block text-xs text-charcoal/60 mb-1">Landmark (optional)</label>
        <input className="input-field mb-6" value={form.landmark} onChange={set('landmark')} />

        <button disabled={saving} className="btn-gold w-full">
          {saving ? 'Saving…' : 'Save & Continue'}
        </button>
      </form>
    </div>
  );
}
