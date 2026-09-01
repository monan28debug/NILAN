import { useEffect, useState } from 'react';

export default function BannerCarousel({ slides }) {
  const [index, setIndex] = useState(0);
  const active = slides.filter((s) => s.enabled !== false);

  useEffect(() => {
    if (active.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % active.length), 5000);
    return () => clearInterval(t);
  }, [active.length]);

  if (!active.length) return null;
  const slide = active[index];

  return (
    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-ink">
      {active.map((s, i) => (
        <img
          key={s.id || i}
          src={s.imageUrl}
          alt={s.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-14 max-w-lg">
        <p className="kicker text-gold mb-2">{slide.eyebrow || 'New arrival'}</p>
        <h2 className="font-display text-3xl md:text-5xl text-ivory mb-3">{slide.title}</h2>
        <p className="text-ivory/70 text-sm md:text-base mb-5">{slide.description}</p>
        {slide.link && (
          <a href={slide.link} className="btn-outline-light">
            Explore
          </a>
        )}
      </div>
      {active.length > 1 && (
        <div className="absolute bottom-5 right-6 flex gap-2">
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-gold' : 'w-1.5 bg-ivory/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
