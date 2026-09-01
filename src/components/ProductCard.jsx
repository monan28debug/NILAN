import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product, onRequireLogin }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { user } = useAuth();
  const liked = wishlist.includes(product.id);

  return (
    <div className="group">
      <div className="relative overflow-hidden bg-parchment aspect-[3/4]">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button
          onClick={() => (user ? toggleWishlist(product.id) : onRequireLogin())}
          aria-label="Like product"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-ivory/90 flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#8B4A3C' : 'none'} stroke="#8B4A3C" strokeWidth="1.5">
            <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.65 12 21 12 21Z" />
          </svg>
        </button>
        {product.stock === 0 && (
          <span className="absolute bottom-3 left-3 bg-ink text-ivory text-[10px] tracking-widest2 px-2 py-1">
            SOLD OUT
          </span>
        )}
      </div>
      <div className="pt-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-body text-sm text-ink">{product.name}</h3>
        </Link>
        <p className="text-xs text-charcoal/50 mt-0.5 line-clamp-1">{product.shortDetails}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-display text-base text-gold-deep">₹{product.price}</span>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="text-xs border border-ink px-3 py-1.5 hover:bg-ink hover:text-ivory transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
