import React, { useState } from 'react';
import { StorefrontView } from '../types';
import { Mail, ArrowRight, ShieldCheck, Truck, RefreshCw, Award, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onNavigate: (view: StorefrontView, categoryId?: string) => void;
  onSwitchToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSwitchToAdmin }) => {
  const { categories, settings } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-12 border-t border-zinc-900">
      {/* Brand Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-100 flex-shrink-0 border border-zinc-800">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">Complimentary Worldwide Shipping</h4>
              <p className="text-xs text-zinc-400 mt-1">Carbon-neutral courier delivery on all orders over $150.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-100 flex-shrink-0 border border-zinc-800">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">30-Day Effortless Returns</h4>
              <p className="text-xs text-zinc-400 mt-1">Pre-paid return labels included with every dispatch.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-100 flex-shrink-0 border border-zinc-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">Lifetime Craftsmanship Warranty</h4>
              <p className="text-xs text-zinc-400 mt-1">Full structural repair guarantee on all manufactured goods.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-100 flex-shrink-0 border border-zinc-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">Secure Encrypted Payments</h4>
              <p className="text-xs text-zinc-400 mt-1">PCI-DSS Level 1 256-bit SSL encrypted checkout.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-serif font-black text-sm">
                A
              </div>
              <span className="text-xl font-serif font-bold tracking-widest text-zinc-100">
                AURA
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {settings.storeTagline || 'Modern minimalist goods engineered with surgical precision, ethical raw materials, and timeless longevity.'}
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-zinc-200 mb-2">Subscribe for Private Releases & Archival Sales</p>
              {subscribed ? (
                <div className="p-3 bg-zinc-900 border border-emerald-500/40 rounded-lg text-emerald-400 text-xs">
                  ✓ Welcome to the AURA circle. Check your inbox for your code: <strong className="text-white">WELCOME10</strong>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    Join
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Catalog Categories Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-100">Collections</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-zinc-100 transition-colors">
                  All Catalog Goods
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button onClick={() => onNavigate('shop', c.name)} className="hover:text-zinc-100 transition-colors">
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Concierge & Support */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-100">Concierge</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={() => onNavigate('order-tracking')} className="hover:text-zinc-100 transition-colors">
                  Track Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-zinc-100 transition-colors">
                  My Orders & Profile
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-zinc-100 transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-zinc-100 transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-zinc-100 transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier House */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-100">Atelier House</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-zinc-100 transition-colors">
                  Philosophy & Materials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-zinc-100 transition-colors">
                  Sustainability Report
                </button>
              </li>
              <li>
                <span className="text-zinc-400">{settings.address}</span>
              </li>
              <li className="pt-2 text-zinc-400">
                Email: <span className="text-zinc-300">{settings.supportEmail}</span>
              </li>
              <li className="text-zinc-400">
                Phone: <span className="text-zinc-300">{settings.supportPhone}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
        <div>
          © {new Date().getFullYear()} AURA ATELIER CO. All rights reserved.
        </div>

        <div className="flex items-center gap-6">
          <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};
