import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <p className="font-display text-2xl mb-3">Nilan <span className="text-gold">Fashion</span></p>
          <p className="text-sm text-ivory/60 max-w-xs">
            Considered clothing for everyday wear — sourced, styled, and shipped with care.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-widest2 text-gold mb-3">Shop</p>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><Link to="/home">All products</Link></li>
            <li><Link to="/wholesale">Wholesale</Link></li>
            <li><Link to="/returns">Returns</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-widest2 text-gold mb-3">Support</p>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><Link to="/faq">Help / FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/track-order">Track order</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/40">
        © {new Date().getFullYear()} Nilan Fashion. All rights reserved.
      </div>
    </footer>
  );
}
