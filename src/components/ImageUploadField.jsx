import { useState } from 'react';
import { uploadToCloudinary } from '../firebase/cloudinary';

export default function ImageUploadField({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="text-xs text-charcoal/50 mb-1">{label}</p>
      {value && <img src={value} alt="" className="w-full h-32 object-cover mb-2 bg-parchment" />}
      <input type="file" accept="image/*" onChange={handleFile} className="text-xs" />
      {uploading && <p className="text-xs text-gold-deep mt-1">Uploading…</p>}
    </div>
  );
}
