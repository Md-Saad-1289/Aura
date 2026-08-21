import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Package,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { StorefrontView, CurrencyConfig } from '../../types';

interface HeaderProps {
  currentView: StorefrontView;
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
  onOpenSearch: () => void;
  onOpenAuth: (initialTab?: 'login' | 'register') => void;
  onSwitchToAdmin?: () => void;
  onOpenCart?: () => void;
}

const AVAILABLE_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', rate: 1.0 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'CAD', symbol: 'CA$', rate: 1.36 },
  { code: 'JPY', symbol: '¥', rate: 154.5 }
];

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenAuth,
  onSwitchToAdmin,
  onOpenCart
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { categories, currency, setCurrency } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-150 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-900 text-zinc-300 text-[11px] font-medium tracking-wide py-1.5 px-4 text-center border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:inline-flex items-center gap-1.5 text-zinc-400">
            <Sparkles className="w-3 h-3 text-amber-400" /> Complimentary worldwide express shipping on orders over $150
          </span>
          <div className="mx-auto md:mx-0 text-zinc-200">
            USE CODE <span className="font-bold text-amber-400 bg-zinc-800 px-1.5 py-0.5 rounded ml-1 tracking-widest">WELCOME10</span> FOR 10% OFF
          </div>
          <div className="hidden md:flex items-center gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none"
              >
                <span>{currency.code} ({currency.symbol})</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {currencyDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-28 bg-zinc-900 border border-zinc-700 rounded-md shadow-xl py-1 z-50 text-left"
                  onMouseLeave={() => setCurrencyDropdownOpen(false)}
                >
                  {AVAILABLE_CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800 transition-colors ${
                        currency.code === curr.code ? 'text-amber-400 font-semibold' : 'text-zinc-300'
                      }`}
                    >
                      {curr.code} ({curr.symbol})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-zinc-700">|</span>
            <button
              onClick={() => onNavigate('contact')}
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Concierge
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-zinc-700 hover:text-zinc-950 focus:outline-none"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-serif font-black text-lg tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-serif font-bold tracking-widest text-zinc-950 leading-none">
                  AURA
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-medium">
                  Atelier & Co.
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center ml-10 space-x-7">
              <button
                onClick={() => onNavigate('home')}
                className={`text-sm font-medium transition-colors ${
                  currentView === 'home'
                    ? 'text-zinc-950 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Home
              </button>

              {/* Shop dropdown trigger */}
              <div
                className="relative"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <button
                  onClick={() => onNavigate('shop')}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    currentView === 'shop'
                      ? 'text-zinc-950 font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span>Catalog</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {shopDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white border border-zinc-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={() => {
                        onNavigate('shop');
                        setShopDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 rounded-lg flex items-center justify-between"
                    >
                      <span>Explore All Products</span>
                      <span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-mono">ALL</span>
                    </button>
                    <div className="h-px bg-zinc-100 my-1.5" />
                    <div className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase px-3 py-1">
                      Categories
                    </div>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onNavigate('shop', cat.name);
                          setShopDropdownOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-zinc-200 group-hover:ring-amber-400 transition-all flex-shrink-0">
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="group-hover:translate-x-0.5 transition-transform">{cat.name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400">{cat.productCount}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onNavigate('categories')}
                className={`text-sm font-medium transition-colors ${
                  currentView === 'categories'
                    ? 'text-zinc-950 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Collections
              </button>

              <button
                onClick={() => onNavigate('about')}
                className={`text-sm font-medium transition-colors ${
                  currentView === 'about'
                    ? 'text-zinc-950 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Craft & Story
              </button>

              <button
                onClick={() => onNavigate('order-tracking')}
                className={`text-sm font-medium transition-colors ${
                  currentView === 'order-tracking'
                    ? 'text-zinc-950 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Track Order
              </button>
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 p-2 text-zinc-600 hover:text-zinc-950 rounded-full hover:bg-zinc-100 transition-colors"
              title="Search products..."
            >
              <Search className="w-5 h-5" />
              <span className="hidden xl:inline text-xs text-zinc-400 font-normal bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full">
                ⌘K Quick Search
              </span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 text-zinc-600 hover:text-zinc-950 rounded-full hover:bg-zinc-100 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => {
                setIsCartOpen(true);
                if (onOpenCart) onOpenCart();
              }}
              className="relative flex items-center gap-2 p-2 text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-full sm:rounded-xl sm:px-3 sm:py-2 transition-colors group"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <span className="hidden sm:inline text-xs font-semibold text-zinc-900">
                Cart
              </span>
              {itemCount > 0 ? (
                <span className="w-5 h-5 bg-zinc-950 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              ) : (
                <span className="hidden sm:inline text-xs text-zinc-400">(0)</span>
              )}
            </button>

            {/* Admin Quick Entry Button if Admin/Manager */}
            {isAdmin && onSwitchToAdmin && (
              <button
                onClick={onSwitchToAdmin}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-900 rounded-xl text-xs font-bold transition-all shadow-2xs group"
                title="Enter Admin Management Suite"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
                <span>Admin Suite</span>
              </button>
            )}

            {/* User Account / Profile Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 transition-colors focus:outline-none"
                  >
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-medium">
                        {currentUser?.name.charAt(0)}
                      </div>
                    )}
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl py-2 z-50 text-left animate-in fade-in duration-150"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-zinc-100">
                        <p className="text-xs font-semibold text-zinc-900 truncate">{currentUser?.name}</p>
                        <p className="text-[11px] text-zinc-500 truncate">{currentUser?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-medium bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded capitalize">
                          {currentUser?.role.replace('_', ' ')}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onNavigate('account');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-zinc-400" />
                        My Account & Orders
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('wishlist');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4 text-zinc-400" />
                        Saved Wishlist ({wishlist.length})
                      </button>

                      {isAdmin && onSwitchToAdmin && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onSwitchToAdmin();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-amber-700 font-semibold bg-amber-50/50 hover:bg-amber-100/70 flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          Open Admin Portal
                        </button>
                      )}

                      <div className="h-px bg-zinc-100 my-1" />

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 hover:text-zinc-950 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-left text-sm font-medium ${
                currentView === 'home' ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-800'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-left text-sm font-medium ${
                currentView === 'shop' ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-800'
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => {
                onNavigate('categories');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-left text-sm font-medium ${
                currentView === 'categories' ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-800'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => {
                onNavigate('order-tracking');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-left text-sm font-medium ${
                currentView === 'order-tracking' ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-800'
              }`}
            >
              Track Order
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Browse Categories
            </div>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onNavigate('shop', cat.name);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-2 hover:bg-zinc-50 rounded-xl text-sm text-zinc-700 hover:text-zinc-950 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-1.5 ring-zinc-200 flex-shrink-0">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-xs sm:text-sm">{cat.name}</span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">{cat.productCount} items</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Currency:</span>
              <select
                value={currency.code}
                onChange={(e) => {
                  const selected = AVAILABLE_CURRENCIES.find(c => c.code === e.target.value);
                  if (selected) setCurrency(selected);
                }}
                className="text-xs font-semibold bg-zinc-100 border border-zinc-300 rounded px-2 py-1"
              >
                {AVAILABLE_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                ))}
              </select>
            </div>

            {isAdmin && onSwitchToAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSwitchToAdmin();
                }}
                className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
              >
                Admin Dashboard →
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
