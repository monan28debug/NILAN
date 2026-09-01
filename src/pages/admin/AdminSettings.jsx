import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import ImageUploadField from '../../components/ImageUploadField';
import { useCollection } from '../../utils/useCollection';

export default function AdminSettings() {
  const { data } = useCollection('settings');
  const landing = data.find((d) => d.id === 'landing') || {};
  const [form, setForm] = useState({ eyebrow: '', title: '', subtitle: '', buttonText: '', backgroundImageUrl: '' });

  useEffect(() => {
    setForm({
      eyebrow: landing.eyebrow || '',
      title: landing.title || '',
      subtitle: landing.subtitle || '',
      buttonText: landing.buttonText || '',
      backgroundImageUrl: landing.backgroundImageUrl || '',
    });
  }, [landing.eyebrow, landing.title, landing.subtitle, landing.buttonText, landing.backgroundImageUrl]);

  const save = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, 'settings', 'landing'), form, { merge: true });
    alert('Landing page updated.');
  };

  return (
    <AdminLayout title="Settings — Landing Page">
      <form onSubmit={save} className="bg-ivory border border-line/10 p-5 space-y-3 max-w-md">
        <input placeholder="Eyebrow text" className="input-field" value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
        <input placeholder="Title (defaults to Nilan Fashion)" className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Subtitle" className="input-field" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
        <input placeholder="Shop Now button text" className="input-field" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} />
        <ImageUploadField value={form.backgroundImageUrl} onChange={(url) => setForm({ ...form, backgroundImageUrl: url })} label="Landing background image" />
        <button className="btn-gold">Save</button>
      </form>
    </AdminLayout>
  );
}
