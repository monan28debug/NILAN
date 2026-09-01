import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/format';

export default function Cart({ onRequireLogin }) {
  const { items, updateQty, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const checkout = () => (user ? navigate('/checkout') : onRequireLogin());

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <h1 className="section-title mb-8">Your Cart</h1>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-charcoal/50 mb-4">Your cart is empty.</p>
            <Link to="/home" className="btn-outline">Continue shopping</Link>
          </div>
        ) : (
          <>
            <div className="space-y-5 mb-8">
              {items.map((i) => (
                <div key={i.productId} className="flex gap-4 items-center border-b border-line/10 pb-5">
                  <img src={i.image} alt={i.name} className="w-20 h-24 object-cover bg-parchment" />
                  <div className="flex-1">
                    <p className="font-body text-sm">{i.name}</p>
                    <p className="text-gold-deep text-sm mt-1">{formatCurrency(i.price)}</p>
                    <div className="flex items-center border border-line/30 w-fit mt-2">
                      <button onClick={() => updateQty(i.productId, i.qty - 1)} className="px-2.5 py-1">−</button>
                      <span className="px-3 text-sm">{i.qty}</span>
                      <button onClick={() => updateQty(i.productId, i.qty + 1)} className="px-2.5 py-1">+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm mb-2">{formatCurrency(i.price * i.qty)}</p>
                    <button onClick={() => removeFromCart(i.productId)} className="text-xs text-rust/70 hover:text-rust">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-charcoal/60">Subtotal</span>
              <span className="font-display text-2xl">{formatCurrency(subtotal)}</span>
            </div>
            <button onClick={checkout} className="btn-gold w-full">Proceed to Checkout</button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
