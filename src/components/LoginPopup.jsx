import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPopup({ open, onClose, message }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  if (!open) return null;

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    onClose();
    // Always route through profile-setup — it auto-skips to /home on its own
    // (see ProfileSetup.jsx) once the saved profile is already complete.
    navigate('/profile-setup');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-ink/70" onClick={onClose} />
      <div className="relative bg-ivory w-full md:max-w-sm md:mx-4 p-8 border-t md:border border-gold/30 animate-[fadeIn_.2s_ease-out]">
        <p className="kicker mb-2">Sign in required</p>
        <h3 className="font-display text-2xl mb-2 text-ink">{message || 'Please sign in with Google to continue your purchase.'}</h3>
        <p className="text-sm text-charcoal/70 mb-6">
          You can keep browsing and adding to cart as a guest — sign-in is only needed to place an order.
        </p>
        <button onClick={handleGoogleLogin} className="btn-gold w-full mb-3">
          Continue with Google
        </button>
        <button onClick={onClose} className="w-full text-center text-sm text-charcoal/60 hover:text-ink py-2">
          Cancel
        </button>
      </div>
    </div>
  );
}
