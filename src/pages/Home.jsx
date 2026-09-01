import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BannerCarousel from '../components/BannerCarousel';
import CategorySection from '../components/CategorySection';
import ProductCard from '../components/ProductCard';
import { useCollection } from '../utils/useCollection';

export default function Home({ onRequireLogin }) {
  const [params] = useSearchParams();
  const { data: banners } = useCollection('banners');
  const { data: categories } = useCollection('categories');
  const { data: products, loading } = useCollection('products');

  const search = params.get('search')?.toLowerCase();
  const categoryId = params.get('category');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryId && p.category !== categoryId) return false;
      if (search && !p.name?.toLowerCase().includes(search)) return false;
      return true;
    });
  }, [products, search, categoryId]);

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <BannerCarousel slides={banners} />
      <CategorySection categories={categories} />

      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <p className="kicker mb-2">The edit</p>
        <h2 className="section-title mb-8">
          {search ? `Results for "${params.get('search')}"` : categoryId ? 'Category' : 'All products'}
        </h2>
        {loading ? (
          <p className="text-charcoal/50 text-sm">Loading products…</p>
        ) : filtered.length === 0 ? (
          <p className="text-charcoal/50 text-sm">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onRequireLogin={onRequireLogin} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
