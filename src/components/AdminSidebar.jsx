import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  ['/admin', 'Dashboard'],
  ['/admin/users', 'Users / Login History'],
  ['/admin/products', 'Products'],
  ['/admin/categories', 'Categories'],
  ['/admin/banners', 'Banners'],
  ['/admin/orders', 'Orders'],
  ['/admin/cod-requests', 'COD Requests'],
  ['/admin/upi-requests', 'UPI Requests'],
  ['/admin/transactions', 'Payment Transactions'],
  ['/admin/returns', 'Return Requests'],
  ['/admin/wholesale', 'Wholesale Requests'],
  ['/admin/tracking', 'Tracking'],
  ['/admin/reviews', 'Reviews'],
  ['/admin/coupons', 'Coupons'],
  ['/admin/faq', 'Help / FAQ'],
  ['/admin/contact', 'Contact Settings'],
  ['/admin/payment-settings', 'Payment Settings'],
  ['/admin/website-toggle', 'Website ON/OFF'],
  ['/admin/import-export', 'Excel Import/Export'],
  ['/admin/settings', 'Settings'],
];

// Shared nav content — rendered inside the persistent desktop rail AND inside
// the mobile drawer, so the two never drift out of sync.
function NavLinks({ onNavigate }) {
  return (
    <nav className="flex-1 overflow-y-auto py-3">
      {LINKS.map(([to, label]) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/admin'}
          onClick={onNavigate}
          className={({ isActive }) =>
            `block px-6 py-3 md:py-2.5 text-sm transition-colors ${
              isActive ? 'bg-gold/15 text-gold border-r-2 border-gold' : 'text-ivory/70 hover:bg-ivory/5 hover:text-ivory'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

// Persistent left rail — desktop and tablet only.
export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="w-64 shrink-0 bg-ink text-ivory min-h-screen hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-ivory/10">
        <span className="font-display text-lg">Nilan <span className="text-gold">Admin</span></span>
      </div>
      <NavLinks />
      <button
        onClick={async () => {
          await logout();
          navigate('/admin/login');
        }}
        className="m-4 border border-ivory/20 py-2 text-sm text-ivory/70 hover:bg-rust hover:text-ivory hover:border-rust transition-colors"
      >
        Admin Logout
      </button>
    </aside>
  );
}

// Slide-out drawer — mobile only. Mirrors the desktop rail's links exactly.
export function AdminMobileDrawer({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-ink text-ivory flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-ivory/10">
          <span className="font-display text-lg">Nilan <span className="text-gold">Admin</span></span>
          <button onClick={onClose} aria-label="Close menu" className="text-ivory/60 text-xl leading-none px-2">
            ×
          </button>
        </div>
        <NavLinks onNavigate={onClose} />
        <button
          onClick={async () => {
            await logout();
            onClose();
            navigate('/admin/login');
          }}
          className="m-4 border border-ivory/20 py-3 text-sm text-ivory/70 hover:bg-rust hover:text-ivory hover:border-rust transition-colors"
        >
          Admin Logout
        </button>
      </aside>
    </div>
  );
}
