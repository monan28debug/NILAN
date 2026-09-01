import { useNavigate } from 'react-router-dom';
import { useCollection } from '../utils/useCollection';

export default function Landing() {
  const navigate = useNavigate();
  const { data } = useCollection('settings');
  const landing = data.find((d) => d.id === 'landing') || {};

  const bg = landing.backgroundImageUrl ||
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop';

  return (
    <div className="relative min-h-screen flex items-end md:items-center justify-center">
      <img src={bg} alt="Nilan Fashion" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
      <div className="relative z-10 text-center px-6 pb-20 md:pb-0">
        <p className="kicker text-gold mb-4">{landing.eyebrow || 'Est. Nilan Fashion'}</p>
        <h1 className="font-display text-5xl md:text-7xl text-ivory mb-5 leading-[1.05]">
          {landing.title || 'Nilan Fashion'}
        </h1>
        <p className="text-ivory/70 max-w-md mx-auto mb-9 text-sm md:text-base">
          {landing.subtitle || 'Considered clothing for everyday wear.'}
        </p>
        <button onClick={() => navigate('/home')} className="btn-gold px-10 py-4 text-base">
          {landing.buttonText || 'Shop Now'}
        </button>
      </div>
    </div>
  );
}
