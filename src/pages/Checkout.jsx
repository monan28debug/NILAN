import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../utils/useCollection';
import { placeOrderWithStock, InsufficientStockError } from '../utils/placeOrder';
import { formatCurrency } from '../utils/format';

export default function Checkout({ onRequireLogin }) {
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { data: settingsDocs } = useCollection('settings');
  const navigate = useNavigate();

  const paymentSettings = settingsDocs.find((d) => d.id === 'payment') || {};
  const razorpayEnabled = !!paymentSettings.razorpayEnabled;
  const razorpayFee = razorpayEnabled ? Number(paymentSettings.razorpayFee ?? 2) : 0;

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [method, setMethod] = useState('cod');
  const [transactionRef, setTransactionRef] = useState('');
  const [placing, setPlacing] = useState(false);
  const [name] = useState(profile?.name || '');
  const [phone] = useState(profile?.phone1 || '');
  const [address] = useState(profile?.address || '');

  if (!user) {
    onRequireLogin();
  }

  const applyCoupon = async () => {
    setCouponMsg('');
    if (!couponCode) return;
    const q = query(collection(db, 'coupons'), where('code', '==', couponCode.toUpperCase()));
    const snap = await getDocs(q);
    if (snap.empty) return setCouponMsg('Invalid coupon code.');
    const coupon = snap.docs[0].data();
    if (coupon.enabled === false) return setCouponMsg('This coupon is not active.');
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return setCouponMsg(`Minimum order ₹${coupon.minOrderAmount} required.`);
    }
    let d = coupon.discountType === 'percent' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
    if (coupon.maxDiscount) d = Math.min(d, coupon.maxDiscount);
    setDiscount(Math.round(d));
    setCouponMsg(`Coupon applied — you saved ${formatCurrency(Math.round(d))}`);
  };

  const finalAmount = Math.max(0, subtotal - discount + razorpayFee * (method === 'upi' && razorpayEnabled ? 1 : 0));

  const [stockError, setStockError] = useState(null);

  const placeOrder = async () => {
    if (!name || !phone || !address) {
      alert('Your profile is missing required details. Please update your profile first.');
      navigate('/profile');
      return;
    }
    setPlacing(true);
    setStockError(null);
    try {
      const orderMeta = {
        customerName: name,
        phone,
        address,
        subtotal,
        discount,
        paymentMethod: method,
        paymentStatus: method === 'cod' ? 'pending' : 'pending_verification',
        orderStatus: 'pending_confirmation',
        finalAmount,
        ...(method === 'upi' && transactionRef ? { transactionRef } : {}),
      };

      // Stock is checked and decremented inside the same transaction as the order
      // write, so two shoppers buying the last unit at once can never both succeed.
      const { orderId } = await placeOrderWithStock({ uid: user.uid, items, orderMeta });
      const fullOrderData = { orderId, uid: user.uid, items, ...orderMeta };

      if (method === 'cod') {
        await addDoc(collection(db, 'codRequests'), fullOrderData);
      } else {
        await addDoc(collection(db, 'upiRequests'), fullOrderData);
      }

      clearCart();
      navigate('/thank-you', { state: { orderId, method, finalAmount } });
    } catch (err) {
      if (err instanceof InsufficientStockError) {
        setStockError(err.items);
      } else {
        alert('Something went wrong placing your order. Please try again.');
      }
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        <h1 className="section-title mb-8">Checkout</h1>

        <div className="mb-8 bg-parchment/60 p-5 text-sm">
          <p className="font-medium mb-1">{name || 'Add your delivery details'}</p>
          <p className="text-charcoal/60">{phone}</p>
          <p className="text-charcoal/60">{address}</p>
          {(!name || !phone || !address) && (
            <button onClick={() => navigate('/profile')} className="text-gold-deep text-xs mt-2 underline">
              Complete your profile
            </button>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm">
              <span>{i.name} × {i.qty}</span>
              <span>{formatCurrency(i.price * i.qty)}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-2">
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon code"
            className="input-field"
          />
          <button onClick={applyCoupon} className="btn-outline px-5 whitespace-nowrap">Apply</button>
        </div>
        {couponMsg && <p className="text-xs text-charcoal/60 mb-6">{couponMsg}</p>}

        <div className="space-y-2 border-t border-line/10 pt-4 mb-8 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          {discount > 0 && <div className="flex justify-between text-forest"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>}
          {method === 'upi' && razorpayEnabled && (
            <div className="flex justify-between"><span>Payment fee</span><span>{formatCurrency(razorpayFee)}</span></div>
          )}
          <div className="flex justify-between font-display text-lg pt-2"><span>Total</span><span>{formatCurrency(finalAmount)}</span></div>
        </div>

        <p className="text-sm text-charcoal/60 mb-3">Payment method</p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => setMethod('cod')}
            className={`border px-4 py-3 text-sm text-left ${method === 'cod' ? 'border-gold bg-gold/10' : 'border-line/20'}`}
          >
            Cash on Delivery
          </button>
          <button
            onClick={() => setMethod('upi')}
            className={`border px-4 py-3 text-sm text-left ${method === 'upi' ? 'border-gold bg-gold/10' : 'border-line/20'}`}
          >
            UPI
          </button>
        </div>

        {method === 'upi' && (
          <div className="bg-parchment/60 p-5 mb-8 text-sm text-charcoal/70">
            {paymentSettings.upiQrUrl && (
              <img src={paymentSettings.upiQrUrl} alt="UPI QR" className="w-40 h-40 object-contain mb-3 bg-white" />
            )}
            <p>UPI ID: <span className="font-medium">{paymentSettings.upiId || 'not configured yet'}</span></p>
            <label className="block text-xs text-charcoal/50 mt-4 mb-1">Transaction / reference ID (optional)</label>
            <input
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="e.g. UPI ref number from your payment app"
              className="input-field bg-ivory"
            />
            <p className="mt-3 text-xs">
              After paying, our team will verify your transaction and confirm the order — you'll be notified once confirmed.
            </p>
          </div>
        )}

        {stockError && (
          <div className="bg-rust/10 text-rust text-sm p-4 mb-4">
            <p className="font-medium mb-1">Some items in your cart are no longer available:</p>
            <ul className="list-disc pl-5">
              {stockError.map((s) => (
                <li key={s.productId}>
                  {s.name} — only {s.available} left. Please update the quantity in your cart.
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={placeOrder} disabled={placing || items.length === 0} className="btn-gold w-full">
          {placing ? 'Placing order…' : `Place Order — ${formatCurrency(finalAmount)}`}
        </button>
      </div>
      <Footer />
    </div>
  );
}
