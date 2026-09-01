import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Sidebar from './Sidebar';

export default function Header({ onRequireLogin }) {
  const { user, profile } = useAuth();
  const { items } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const cartCount = items.reduce((n, i) => n + i.qty, 0);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/home?search=${encodeURIComponent(query)}` : '/home');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-ink text-ivory border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col gap-1.5 w-6 group"
            >
              <span className="h-px w-full bg-ivory group-hover:bg-gold transition-colors" />
              <span className="h-px w-4 bg-ivory group-hover:bg-gold transition-colors" />
            </button>
            <Link to="/home" className="font-display text-xl tracking-wide">
              Nilan <span className="text-gold">Fashion</span>
            </Link>
          </div>

          <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for sarees, kurtas, dresses…"
              className="w-full bg-transparent border border-ivory/25 px-4 py-2 text-sm placeholder:text-ivory/40 focus:border-gold outline-none"
            />
          </form>

          <div className="flex items-center gap-5">
            <Link to="/cart" className="relative">
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => (user ? navigate('/profile') : onRequireLogin())}
              className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-xs font-semibold"
              aria-label="Profile"
            >
              {user ? (profile?.name?.[0] || user.email?.[0] || 'U').toUpperCase() : <UserIcon />}
            </button>
          </div>
        </div>
      </header>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onRequireLogin={onRequireLogin} />
    </>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6h15l-1.5 9h-12L6 6Z" strokeLinejoin="round" />
      <path d="M6 6 5 3H2" strokeLinecap="round" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="17.5" cy="20" r="1.3" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
