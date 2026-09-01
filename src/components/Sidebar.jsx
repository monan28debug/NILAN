import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/track-order', label: 'Track Order' },
  { to: '/orders', label: 'Order History' },
  { to: '/wholesale', label: 'Wholesale Request' },
  { to: '/returns', label: 'Return Request' },
  { to: '/wishlist', label: 'Liked Products' },
  { to: '/cart', label: 'Cart' },
  { to: '/profile', label: 'Profile' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/faq', label: 'Help / FAQ' },
  { to: '/contact', label: 'Contact' },
];

// Track Order and FAQ/Contact stay guest-accessible — only account-specific
// sections require sign-in, per the guest-first browsing flow.
const AUTH_REQUIRED = new Set(['/orders', '/wholesale', '/returns', '/wishlist', '/profile', '/notifications']);

export default function Sidebar({ open, onClose, onRequireLogin }) {
  const { user, logout } = useAuth();

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-ivory border-r border-gold/30 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-line/10">
          <span className="font-display text-lg">Nilan <span className="text-gold-deep">Fashion</span></span>
        </div>
        <nav className="py-4">
          {LINKS.map((l) => (
            <button
              key={l.to}
              onClick={(e) => {
                if (AUTH_REQUIRED.has(l.to) && !user) {
                  e.preventDefault();
                  onClose();
                  onRequireLogin();
                  return;
                }
                onClose();
              }}
              className="w-full text-left"
            >
              <Link
                to={l.to}
                onClick={(e) => {
                  if (AUTH_REQUIRED.has(l.to) && !user) e.preventDefault();
                }}
                className="block px-6 py-3 text-sm text-charcoal hover:bg-gold/10 hover:text-gold-deep transition-colors"
              >
                {l.label}
              </Link>
            </button>
          ))}
          {user ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full text-left px-6 py-3 text-sm text-rust hover:bg-rust/10 transition-colors mt-2 border-t border-line/10"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onRequireLogin();
              }}
              className="w-full text-left px-6 py-3 text-sm text-gold-deep hover:bg-gold/10 transition-colors mt-2 border-t border-line/10"
            >
              Login
            </button>
          )}
        </nav>
      </aside>
    </div>
  );
}
