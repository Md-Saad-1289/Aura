import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Trash2,
  Share2,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Eye,
  SlidersHorizontal,
  Grid,
  List,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Download,
  RotateCcw
} from 'lucide-react';
import { Product, StorefrontView } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

interface WishlistPageProps {
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
  onQuickView?: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate, onQuickView }) => {
  const { wishlist, removeFromWishlist, clearWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { products, formatPrice } = useStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'sale'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price-low' | 'price-high' | 'rating'>('date');
  const [copiedLink, setCopiedLink] = useState(false);
  const [movedAllSuccess, setMovedAllSuccess] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Derive available categories in current wishlist
  const wishlistCategories = Array.from(new Set(wishlist.map((item) => item.category)));

  // Filter and sort wishlist items
  const filteredWishlist = wishlist
    .filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (stockFilter === 'in-stock' && item.stock <= 0) return false;
      if (stockFilter === 'sale' && (!item.compareAtPrice || item.compareAtPrice <= item.price)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default order (recently added)
    });

  // Calculate wishlist summary metrics
  const totalValue = wishlist.reduce((acc, item) => acc + item.price, 0);
  const inStockCount = wishlist.filter((item) => item.stock > 0).length;
  const onSaleCount = wishlist.filter(
    (item) => item.compareAtPrice && item.compareAtPrice > item.price
  ).length;

  // Recommended products if wishlist is low or empty
  const recommendedProducts = products
    .filter((p) => !wishlist.some((w) => w.id === p.id))
    .slice(0, 4);

  const handleMoveToBag = (product: Product, removeFromList = true) => {
    addItem(product, 1, {
      color: product.variants?.colors?.[0],
      size: product.variants?.sizes?.[0]
    });
    if (removeFromList) {
      removeFromWishlist(product.id);
    }
  };

  const handleMoveAllToBag = () => {
    const inStockItems = wishlist.filter((item) => item.stock > 0);
    if (inStockItems.length === 0) return;

    inStockItems.forEach((item) => {
      addItem(item, 1, {
        color: item.variants?.colors?.[0],
        size: item.variants?.sizes?.[0]
      });
    });

    setMovedAllSuccess(true);
    setTimeout(() => setMovedAllSuccess(false), 3000);
  };

  const handleShareWishlist = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
      {/* 1. EDITORIAL WISHLIST HERO BANNER */}
      <div className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-10 border border-zinc-800 shadow-2xl overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                <Heart className="w-3 h-3 fill-current text-rose-400" />
                <span>Personal Atelier Wishlist</span>
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-zinc-400 text-xs font-mono">
                {wishlist.length} {wishlist.length === 1 ? 'Artifact' : 'Artifacts'} Saved
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-zinc-100 tracking-tight">
              Curated Private Collection
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              Your bespoke repository of prospective acquisitions. Monitor real-time availability,
              pricing adjustments, and seamlessly transfer curated artifacts to your acquisition bag.
            </p>
          </div>

          {/* Quick Hero Actions */}
          {wishlist.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleShareWishlist}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-xl text-xs font-semibold border border-zinc-700 flex items-center justify-center gap-2 transition-all shadow-xs"
                title="Copy shareable wishlist link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Share Wishlist</span>
                  </>
                )}
              </button>

              <button
                onClick={handleMoveAllToBag}
                disabled={inStockCount === 0}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All to Bag ({inStockCount})</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Metric Ribbon */}
        {wishlist.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-zinc-800/80">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                Total Collection Value
              </span>
              <p className="text-base sm:text-lg font-serif font-bold text-amber-300 mt-0.5">
                {formatPrice(totalValue)}
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                Ready to Dispatch
              </span>
              <p className="text-base sm:text-lg font-serif font-bold text-emerald-400 mt-0.5">
                {inStockCount} of {wishlist.length} In Stock
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                Promotional Reductions
              </span>
              <p className="text-base sm:text-lg font-serif font-bold text-rose-300 mt-0.5">
                {onSaleCount} {onSaleCount === 1 ? 'Special Offer' : 'Special Offers'}
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                Complimentary Concierge
              </span>
              <p className="text-base sm:text-lg font-serif font-bold text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Active Protection</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Moved All Toast Notification */}
      {movedAllSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4 text-emerald-900 text-xs animate-in slide-in-from-top duration-300 shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>
              All <strong>{inStockCount} in-stock artifacts</strong> have been successfully added to your shopping bag!
            </span>
          </div>
          <button
            onClick={() => onNavigate('cart')}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex-shrink-0 transition-colors"
          >
            View Bag & Checkout →
          </button>
        </div>
      )}

      {/* 2. FILTER & SORT TOOLBAR */}
      {wishlist.length > 0 && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-zinc-950 text-white shadow-2xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              All Categories ({wishlist.length})
            </button>
            {wishlistCategories.map((cat) => {
              const count = wishlist.filter((item) => item.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-zinc-950 text-white shadow-2xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Right Controls: Stock, Sort & View Toggles */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none focus:border-zinc-900 cursor-pointer"
            >
              <option value="all">All Availability</option>
              <option value="in-stock">In Stock Only</option>
              <option value="sale">On Sale Only</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none focus:border-zinc-900 cursor-pointer"
            >
              <option value="date">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Mode Grid/List */}
            <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-zinc-950' : 'text-zinc-400 hover:text-zinc-700'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-2xs text-zinc-950' : 'text-zinc-400 hover:text-zinc-700'
                }`}
                title="Detailed List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Clear Wishlist Button with Confirmation */}
            {confirmClear ? (
              <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded-xl border border-rose-200">
                <span className="text-[11px] text-rose-700 font-semibold">Clear all?</span>
                <button
                  onClick={() => {
                    clearWishlist();
                    setConfirmClear(false);
                  }}
                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-0.5 bg-zinc-200 text-zinc-700 rounded text-[10px] font-bold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-zinc-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors text-xs font-semibold flex items-center gap-1"
                title="Clear all wishlist items"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. WISHLIST ITEMS PRESENTATION */}
      {wishlist.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 sm:p-16 text-center space-y-6 max-w-2xl mx-auto shadow-xs">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto text-rose-500 border border-rose-100 shadow-xs">
            <Heart className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
              Your Wishlist is Awaiting Artifacts
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-md mx-auto">
              Explore our bespoke collections of architectural acoustics, tactile furniture, and minimalist design. Tap the heart icon on any artifact to save it here for future consideration.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto px-6 py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Explore Master Catalog</span>
            </button>
            <button
              onClick={() => onNavigate('categories')}
              className="w-full sm:w-auto px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Browse Categories
            </button>
          </div>
        </div>
      ) : filteredWishlist.length === 0 ? (
        /* No Match After Filter */
        <div className="bg-zinc-50 rounded-3xl border border-zinc-200 p-12 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-sm font-serif font-bold text-zinc-900">No items match your active filter</h3>
          <p className="text-xs text-zinc-500">Try changing or clearing your category or stock filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setStockFilter('all');
            }}
            className="px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-semibold mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWishlist.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const discountPercent = product.compareAtPrice
              ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-3xl border border-zinc-200/90 hover:border-zinc-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden bg-zinc-100 cursor-pointer">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onClick={() => onNavigate('product-detail', undefined, product.id)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.images[1] && (
                    <img
                      src={product.images[1]}
                      alt={product.name}
                      onClick={() => onNavigate('product-detail', undefined, product.id)}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {discountPercent > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                        -{discountPercent}%
                      </span>
                    )}
                    {isOutOfStock ? (
                      <span className="bg-zinc-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    ) : product.stock <= product.lowStockThreshold ? (
                      <span className="bg-amber-500 text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Low Stock ({product.stock})
                      </span>
                    ) : null}
                  </div>

                  {/* Remove Wishlist Button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-rose-500 rounded-full shadow-md backdrop-blur-2xs transition-all hover:scale-110"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-4 h-4 fill-current text-rose-500" />
                  </button>

                  {/* Quick View Hover Button */}
                  {onQuickView && (
                    <button
                      onClick={() => onQuickView(product)}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-950/90 hover:bg-zinc-950 text-white rounded-xl text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 backdrop-blur-2xs shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  )}
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="font-semibold uppercase tracking-wider">{product.brand}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-zinc-800">{product.rating}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => onNavigate('product-detail', undefined, product.id)}
                      className="text-sm font-serif font-bold text-zinc-950 hover:text-zinc-700 cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Pricing & Bag Action */}
                  <div className="pt-3 border-t border-zinc-150 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-serif font-bold text-zinc-950">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-xs text-zinc-400 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-semibold ${
                          isOutOfStock ? 'text-zinc-400' : 'text-emerald-600'
                        }`}
                      >
                        {isOutOfStock ? 'Waitlist' : 'In Stock'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToBag(product, true)}
                        disabled={isOutOfStock}
                        className="flex-1 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>

                      <button
                        onClick={() => onNavigate('product-detail', undefined, product.id)}
                        className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-colors"
                        title="View Full Specifications"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DETAILED LIST VIEW */
        <div className="space-y-4">
          {filteredWishlist.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const discountPercent = product.compareAtPrice
              ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-zinc-200/90 hover:border-zinc-300 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-2xs transition-all hover:shadow-md"
              >
                {/* Image Section */}
                <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0 cursor-pointer">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onClick={() => onNavigate('product-detail', undefined, product.id)}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {/* Information Section */}
                <div className="flex-1 min-w-0 space-y-2 w-full text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-widest text-zinc-400">
                      {product.brand} • {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-zinc-900">{product.rating}</span>
                      <span className="text-zinc-400 text-[10px]">({product.reviewCount})</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => onNavigate('product-detail', undefined, product.id)}
                    className="text-base font-serif font-bold text-zinc-950 hover:text-zinc-700 cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {product.description || product.shortDescription}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px]">
                    <span className="font-mono text-zinc-400">SKU: {product.sku}</span>
                    <span>•</span>
                    <span
                      className={`font-semibold ${
                        isOutOfStock ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {isOutOfStock ? 'Currently Unavailable' : `In Stock (${product.stock} units ready)`}
                    </span>
                  </div>
                </div>

                {/* Price & Action Section */}
                <div className="w-full sm:w-56 flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-zinc-150 sm:pl-6 flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-lg font-serif font-bold text-zinc-950">
                      {formatPrice(product.price)}
                    </div>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full max-w-[160px]">
                    <button
                      onClick={() => handleMoveToBag(product, true)}
                      disabled={isOutOfStock}
                      className="w-full px-4 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>

                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="w-full px-3 py-1.5 bg-zinc-100 hover:bg-rose-50 text-zinc-600 hover:text-rose-600 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. CURATED RECOMMENDATIONS (TRENDING ARTIFACTS) */}
      {recommendedProducts.length > 0 && (
        <div className="pt-10 border-t border-zinc-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 block">
                Tailored Discoveries
              </span>
              <h2 className="text-xl font-serif font-bold text-zinc-950 mt-0.5">
                Trending Atelier Masterpieces
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-bold text-zinc-900 hover:text-zinc-600 flex items-center gap-1"
            >
              <span>Explore All Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={(id) => onNavigate('product-detail', undefined, id)}
                onQuickView={(prod) => onQuickView && onQuickView(prod)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
