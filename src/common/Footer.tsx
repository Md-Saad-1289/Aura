import React, { useState, useEffect } from 'react';
import { StorefrontView, CurrencyConfig } from '../types';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  Leaf,
  Globe,
  Clock,
  Lock,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Phone,
  HelpCircle,
  FileText,
  X,
  Sparkles,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
  onSwitchToAdmin?: () => void;
}

type PolicyType = 'privacy' | 'terms' | 'shipping' | 'returns' | 'cookies' | 'sustainability' | null;

const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', rate: 1.0 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'CAD', symbol: 'CA$', rate: 1.36 },
  { code: 'AUD', symbol: 'AU$', rate: 1.52 },
  { code: 'JPY', symbol: '¥', rate: 155.0 }
];

const FLAGSHIPS = [
  { city: 'Paris', timezone: 'Europe/Paris', address: '28 Rue Saint-Honoré, 75001' },
  { city: 'New York', timezone: 'America/New_York', address: '482 Broome St, SoHo' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', address: '6-10-1 Ginza, Chuo-ku' },
  { city: 'London', timezone: 'Europe/London', address: '14 New Bond St, Mayfair' }
];

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSwitchToAdmin }) => {
  const { categories, settings, currency, setCurrency } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English (Global)');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [newsletterPreference, setNewsletterPreference] = useState<'all' | 'releases' | 'archive'>('all');

  // Clock ticker for flagship ateliers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatCityTime = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(currentTime);
    } catch {
      return '';
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-12 border-t border-zinc-900 relative overflow-hidden font-sans">
      {/* Subtle radial ambient highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-radial from-zinc-800/10 to-transparent pointer-events-none -z-0" />

      {/* 1. Value Proposition & Trust Guarantees */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-zinc-800/80 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-100 shrink-0 border border-zinc-800 shadow-xs">
              <Truck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">Complimentary Global Delivery</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Carbon-neutral courier dispatch on orders over {currency?.symbol || '$'}150. Tracked in real time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-100 shrink-0 border border-zinc-800 shadow-xs">
              <RefreshCw className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">30-Day Seamless Returns</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Pre-paid digital return labels & doorstep courier collection with every order.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-100 shrink-0 border border-zinc-800 shadow-xs">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">Lifetime Craftsmanship Promise</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Complimentary structural servicing & leather reconditioning across all goods.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-100 shrink-0 border border-zinc-800 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">Vault-Grade Security</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                PCI-DSS Level 1 256-bit SSL encrypted zero-knowledge payment infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Flagship Boutiques & Live Atelier Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-zinc-800/60">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-zinc-200">
              Atelier Concierge Online
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-xs text-zinc-400 hidden sm:inline">
              Global Support Active & Dispatches Flowing Normally
            </span>
          </div>

          {/* City Clocks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full lg:w-auto">
            {FLAGSHIPS.map((f) => (
              <div key={f.city} className="flex items-center gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <div>
                  <span className="text-zinc-300 font-semibold">{f.city}</span>
                  <span className="text-zinc-500 font-mono ml-1.5 text-[11px]">
                    {formatCityTime(f.timezone)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-12 lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-zinc-100 to-zinc-300 text-zinc-950 flex items-center justify-center font-serif font-black text-base shadow-sm">
                  A
                </div>
                <span className="text-2xl font-serif font-bold tracking-widest text-zinc-100">
                  AURA
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400/90 ml-1">
                  Atelier
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                {settings.storeTagline ||
                  'Modern minimalist goods engineered with surgical precision, ethical raw materials, and timeless longevity.'}
              </p>
            </div>

            {/* Newsletter Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h5 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                  The AURA Circle Privileges
                </h5>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Receive private release notifications, archival sales access, and a 10% welcome privilege on your debut acquisition.
              </p>

              {subscribed ? (
                <div className="p-3.5 bg-zinc-900 border border-emerald-500/40 rounded-xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Welcome to the Circle!
                    </span>
                    <span className="text-[10px] text-zinc-400">10% Off Applied</span>
                  </div>
                  <div className="flex items-center justify-between bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
                    <span className="font-mono text-xs font-bold text-amber-400">WELCOME10</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode('WELCOME10')}
                      className="text-[11px] font-semibold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="Enter your personal email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 shrink-0"
                    >
                      <span>Join</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-400">
                      <input
                        type="radio"
                        name="pref"
                        checked={newsletterPreference === 'all'}
                        onChange={() => setNewsletterPreference('all')}
                        className="text-amber-400 focus:ring-0 bg-zinc-900 border-zinc-700 w-3 h-3"
                      />
                      <span>All Updates</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-400">
                      <input
                        type="radio"
                        name="pref"
                        checked={newsletterPreference === 'releases'}
                        onChange={() => setNewsletterPreference('releases')}
                        className="text-amber-400 focus:ring-0 bg-zinc-900 border-zinc-700 w-3 h-3"
                      />
                      <span>Private Drops Only</span>
                    </label>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Collections & Disciplines */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Collections & Goods
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-zinc-100 transition-colors flex items-center gap-1.5 text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <span>All Catalog Goods</span>
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onNavigate('shop', c.name)}
                    className="hover:text-zinc-100 transition-colors flex items-center gap-1.5 text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    <span>{c.name}</span>
                  </button>
                </li>
              ))}
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('categories')}
                  className="text-amber-400/90 hover:text-amber-300 font-semibold transition-colors text-xs flex items-center gap-1"
                >
                  <span>Explore All Disciplines</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Concierge & Support */}
          <div className="md:col-span-4 lg:col-span-2 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Concierge
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => onNavigate('order-tracking')}
                  className="hover:text-zinc-100 transition-colors"
                >
                  Track Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('account')}
                  className="hover:text-zinc-100 transition-colors"
                >
                  My Orders & Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wishlist')}
                  className="hover:text-zinc-100 transition-colors"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('shipping')}
                  className="hover:text-zinc-100 transition-colors text-left"
                >
                  Shipping & Customs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('returns')}
                  className="hover:text-zinc-100 transition-colors text-left"
                >
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-zinc-100 transition-colors"
                >
                  Contact Client Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Atelier House & Contact Info */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5 text-amber-400" />
              The Atelier House
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-zinc-100 transition-colors text-left font-medium text-zinc-300"
                >
                  Journal & Editorial Stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-zinc-100 transition-colors text-left"
                >
                  Philosophy & Provenance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('sustainability')}
                  className="hover:text-zinc-100 transition-colors text-left"
                >
                  Sustainability & B-Corp Ethics
                </button>
              </li>
              <li className="pt-2 border-t border-zinc-900">
                <p className="text-zinc-500 text-[11px]">Primary Headquarters:</p>
                <p className="text-zinc-300 text-xs mt-0.5">{settings.address}</p>
              </li>
              <li>
                <p className="text-zinc-500 text-[11px]">Direct Concierge Hotline:</p>
                <a
                  href={`tel:${settings.supportPhone}`}
                  className="text-zinc-300 hover:text-white transition-colors text-xs font-mono font-medium block mt-0.5"
                >
                  {settings.supportPhone}
                </a>
              </li>
              <li>
                <p className="text-zinc-500 text-[11px]">Electronic Inquiries:</p>
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="text-zinc-300 hover:text-white transition-colors text-xs font-mono block mt-0.5"
                >
                  {settings.supportEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Global Preferences & Localization Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-b border-zinc-900/90 bg-zinc-950/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Currency & Region Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-400">Currency & Market:</span>
            </div>

            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
              {SUPPORTED_CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                    currency?.code === curr.code
                      ? 'bg-zinc-100 text-zinc-950 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  {curr.symbol} {curr.code}
                </button>
              ))}
            </div>

            {/* Language Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <span>{selectedLanguage}</span>
              </button>

              {showLangMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-1 z-30 space-y-0.5">
                  {['English (Global)', 'Français (Paris)', '日本語 (Tokyo)', 'Deutsch (Berlin)'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        selectedLanguage === lang
                          ? 'bg-zinc-800 text-white font-semibold'
                          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Badges & Certifications */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-zinc-500 text-[11px]">Accepted Tenders:</span>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono font-bold">
                VISA
              </span>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono font-bold">
                MC
              </span>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono font-bold">
                AMEX
              </span>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono font-bold">
                APPLE PAY
              </span>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono font-bold">
                GOOGLE PAY
              </span>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono font-bold">
                PAYPAL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Legal, Policy Modals Links & Back to Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
          <span>© {new Date().getFullYear()} AURA LUXURY ATELIER INC. All rights reserved.</span>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={() => setActivePolicy('privacy')}
              className="hover:text-zinc-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePolicy('terms')}
              className="hover:text-zinc-300 transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePolicy('cookies')}
              className="hover:text-zinc-300 transition-colors"
            >
              Cookie Preferences
            </button>
          </div>
        </div>

        {/* Action Controls: Back to Top */}
        <div className="flex items-center gap-3">
          <button
            onClick={scrollToTop}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Scroll to top of page"
          >
            <span>Back to Top</span>
            <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* 6. Comprehensive Policy Modals */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-300 space-y-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white capitalize">
                    {activePolicy === 'privacy' && 'Privacy & Data Protection Policy'}
                    {activePolicy === 'terms' && 'Terms of Sale & Client Agreement'}
                    {activePolicy === 'shipping' && 'Global Shipping & Customs Protocols'}
                    {activePolicy === 'returns' && '30-Day Return & Exchange Framework'}
                    {activePolicy === 'cookies' && 'Cookie Preferences & Telemetry'}
                    {activePolicy === 'sustainability' && 'Atelier Sustainability & Ethics Charter'}
                  </h3>
                  <p className="text-[11px] text-zinc-500">Official AURA Atelier Legal Standard • Updated 2026</p>
                </div>
              </div>
              <button
                onClick={() => setActivePolicy(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto pr-2 space-y-4 text-xs leading-relaxed text-zinc-400">
              {activePolicy === 'privacy' && (
                <>
                  <p>
                    AURA respects your absolute right to confidentiality and digital sovereignty. We adhere strictly to GDPR, CCPA, and global privacy standards.
                  </p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">1. Zero Third-Party Monetization</h4>
                  <p>We do not, and will never, sell, lease, or monetize personal client data or purchasing histories to third-party ad networks.</p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">2. Vault Storage & Encryption</h4>
                  <p>All sensitive transactions are processed through tokenized PCI-DSS Level 1 payment systems. Credit card credentials are never held in plaintext on our servers.</p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">3. Right to Erasure</h4>
                  <p>You may request a complete export or permanent deletion of your customer dossier at any time via concierge@aura.store.</p>
                </>
              )}

              {activePolicy === 'terms' && (
                <>
                  <p>
                    By placing an order on AURA Atelier, you enter into a binding agreement for the manufacturing, provenance, and delivery of handcrafted goods.
                  </p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">1. Authenticity & Limited Editions</h4>
                  <p>Each piece is individually serialized with an authentic Certificate of Provenance. Numbered edition artifacts cannot be duplicated.</p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">2. Pricing & Customs</h4>
                  <p>Prices include applicable domestic taxes. For cross-border dispatches, duties and customs tariffs are calculated transparently during final checkout.</p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">3. Lifetime Servicing</h4>
                  <p>Our lifetime craftsmanship warranty covers structural failure and mechanical defects under normal care conditions.</p>
                </>
              )}

              {activePolicy === 'shipping' && (
                <>
                  <p>
                    We partner exclusively with premium carbon-neutral couriers (DHL Express, FedEx Priority, and Swiss Post) to ensure rapid, fully insured global delivery.
                  </p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">1. Complimentary Tier</h4>
                  <p>All orders exceeding {currency?.symbol || '$'}150 qualify for complimentary priority shipping worldwide.</p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">2. Delivery Timelines</h4>
                  <p>Domestic (US/EU): 2–4 business days. International Express: 3–6 business days. Hand-assembled bespoke items require an additional 48 hours for quality inspection.</p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">3. Real-Time Tracking</h4>
                  <p>You receive an automated SMS & email dispatch notification with a live tracking milestone link upon courier handover.</p>
                </>
              )}

              {activePolicy === 'returns' && (
                <>
                  <p>
                    We offer a 30-day effortless return window on all standard catalog artifacts.
                  </p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">1. Return Condition</h4>
                  <p>Items must be in original, unworn condition with all protective packaging, serialized tags, and authenticity documentation intact.</p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">2. Pre-Paid Logistics</h4>
                  <p>Our concierge generates a complimentary pre-paid return shipping label and schedules a convenient courier pickup at your chosen address.</p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">3. Instant Refunds</h4>
                  <p>Upon verification at our atelier, refunds are credited back to your original payment method within 3 to 5 business days.</p>
                </>
              )}

              {activePolicy === 'cookies' && (
                <>
                  <p>
                    AURA utilizes essential cookies to maintain your shopping bag, preserve your currency preference, and protect security tokens.
                  </p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">1. Essential Storage</h4>
                  <p>Necessary for cart checkout, authentication tokens, and currency conversions.</p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">2. Performance & Diagnostics</h4>
                  <p>Aggregated telemetry to ensure 99.99% storefront uptime and fast page rendering.</p>
                </>
              )}

              {activePolicy === 'sustainability' && (
                <>
                  <p>
                    Our atelier operates on a zero-waste, carbon-negative mandate from raw extraction to doorstep dispatch.
                  </p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">1. Certified Ethical Raw Materials</h4>
                  <p>100% of our leather is vegetable-tanned by gold-rated LWG tanneries. Precious metals are recycled or sourced from Fairmined certified partners.</p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">2. 100% Plastic-Free Packaging</h4>
                  <p>All packaging consists of FSC-certified recycled paperboard, cotton dust bags, and water-soluble adhesives.</p>
                  <h4 className="text-zinc-200 font-bold text-xs pt-1">3. Carbon Insetting</h4>
                  <p>We actively invest 1.5% of annual revenue into reforestation and ocean plastic removal initiatives.</p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="px-5 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
