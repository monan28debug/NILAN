import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useCollection } from '../utils/useCollection';
import { useCart } from '../context/CartContext';

export default function Wishlist({ onRequireLogin }) {
  const { data: products } = useCollection('products');
  const { wishlist } = useCart();
  const liked = products.filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <h1 className="section-title mb-8">Liked Products</h1>
        {liked.length === 0 ? (
          <p className="text-charcoal/50 text-sm">Nothing saved yet — tap the heart on any product.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {liked.map((p) => <ProductCard key={p.id} product={p} onRequireLogin={onRequireLogin} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
