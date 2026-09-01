import { Link } from 'react-router-dom';

export default function CategorySection({ categories }) {
  const active = categories.filter((c) => c.enabled !== false).slice(0, 3);
  if (!active.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14">
      <p className="kicker mb-2">Shop by category</p>
      <h2 className="section-title mb-8">Find your fit</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {active.map((cat) => (
          <Link
            key={cat.id}
            to={`/home?category=${cat.id}`}
            className="relative group overflow-hidden aspect-[4/5] block"
          >
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/45 transition-colors" />
            <span className="absolute bottom-5 left-5 font-display text-2xl text-ivory">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
