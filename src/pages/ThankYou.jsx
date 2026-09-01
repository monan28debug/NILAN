import { useLocation, Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function ThankYou() {
  const { state } = useLocation();
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/home" className="btn-gold">Back to shop</Link>
      </div>
    );
  }
  const { orderId, method, finalAmount } = state;

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mx-auto mb-6">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" strokeWidth="2">
            <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-3xl text-ivory mb-2">Thank you for your order!</h1>
        <p className="text-gold text-sm mb-8">Order {orderId}</p>

        <div className="text-left bg-ivory/5 border border-ivory/10 p-5 mb-6 text-sm text-ivory/80 space-y-2">
          <div className="flex justify-between"><span>Amount</span><span>{formatCurrency(finalAmount)}</span></div>
          <div className="flex justify-between"><span>Payment method</span><span className="uppercase">{method}</span></div>
          <div className="flex justify-between"><span>Status</span><span>Pending confirmation</span></div>
        </div>

        <p className="text-ivory/50 text-xs mb-8">
          {method === 'cod'
            ? 'Your order will be confirmed after Admin/Owner verification. Our team may contact you using your registered phone number.'
            : 'Your payment is being verified. Your order will be confirmed once our team verifies the transaction.'}
        </p>

        <Link to="/orders" className="btn-outline-light w-full">View Order History</Link>
      </div>
    </div>
  );
}
