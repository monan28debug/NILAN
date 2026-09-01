import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCollection } from '../utils/useCollection';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/format';

export default function ProductDetails({ onRequireLogin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: products } = useCollection('products');
  const { data: allReviews } = useCollection('reviews');
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const product = products.find((p) => p.id === id);
  const reviews = allReviews.filter((r) => r.productId === id);
  const liked = wishlist.includes(id);

  if (!product) {
    return (
      <div>
        <Header onRequireLogin={onRequireLogin} />
        <p className="text-center py-24 text-charcoal/50">Product not found.</p>
        <Footer />
      </div>
    );
  }

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return onRequireLogin();
    if (!comment.trim()) return;
    await addDoc(collection(db, 'reviews'), {
      productId: id,
      uid: user.uid,
      name: user.displayName || 'Customer',
      rating,
      comment,
      createdAt: serverTimestamp(),
    });
    setComment('');
  };

  const buyNow = () => {
    if (!user) return onRequireLogin();
    addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-[3/4] bg-parchment">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="font-display text-3xl mb-2">{product.name}</h1>
          <p className="text-2xl text-gold-deep font-display mb-4">₹{product.price}</p>
          <p className="text-charcoal/70 text-sm mb-4 leading-relaxed">{product.description}</p>
          <p className="text-xs text-charcoal/50 mb-6">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-charcoal/60">Qty</span>
            <div className="flex items-center border border-line/30">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5">−</button>
              <span className="px-4">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1.5">+</button>
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <button
              onClick={() => addToCart(product, qty)}
              disabled={product.stock === 0}
              className="btn-outline flex-1 disabled:opacity-30"
            >
              Add to Cart
            </button>
            <button
              onClick={buyNow}
              disabled={product.stock === 0}
              className="btn-gold flex-1 disabled:opacity-30"
            >
              Buy Now
            </button>
          </div>
          <button
            onClick={() => (user ? toggleWishlist(id) : onRequireLogin())}
            className="text-sm text-rust/80 hover:text-rust"
          >
            {liked ? '♥ Saved to wishlist' : '♡ Add to wishlist'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <h2 className="section-title mb-6">Reviews</h2>
        <form onSubmit={submitReview} className="mb-8 bg-parchment/60 p-5 max-w-md">
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRating(n)} className="text-xl">
                <span className={n <= rating ? 'text-gold' : 'text-line/30'}>★</span>
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience…"
            className="input-field mb-3 bg-ivory"
            rows={2}
          />
          <button className="btn-outline text-sm px-5 py-2">Post review</button>
        </form>

        {reviews.length === 0 ? (
          <p className="text-charcoal/40 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-5">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-line/10 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gold text-sm">{'★'.repeat(r.rating)}</span>
                  <span className="text-sm font-medium">{r.name}</span>
                  <span className="text-xs text-charcoal/40">{formatDate(r.createdAt)}</span>
                </div>
                <p className="text-sm text-charcoal/70">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
