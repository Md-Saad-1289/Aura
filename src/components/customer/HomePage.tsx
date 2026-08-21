import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  ChevronRight,
  TrendingUp,
  Star,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Product, Category, StorefrontView } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

interface HomePageProps {
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onQuickView }) => {
  const { products, categories, formatPrice } = useStore();
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'bestsellers' | 'sale'>('featured');

  const featuredProducts = products.filter(p => p.isFeatured && p.status === 'active');
  const newArrivals = products.filter(p => p.isNewArrival && p.status === 'active');
  const bestSellers = products.filter(p => p.isBestSeller && p.status === 'active');
  const saleProducts = products.filter(p => p.isOnSale && p.status === 'active');

  const tabProducts =
    activeTab === 'featured'
      ? featuredProducts
      : activeTab === 'new'
      ? newArrivals
      : activeTab === 'bestsellers'
      ? bestSellers
      : saleProducts;

  const heroFeaturedProduct = products[0];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 text-white min-h-[640px] flex items-center">
        {/* Background Subtle Gradient & Pattern */}
        <div className="absolute inset-0 bg-radial-at-t from-zinc-800/40 via-zinc-950 to-zinc-950 opacity-90" />
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1800&auto=format&fit=crop')`
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-850 border border-zinc-700/80 text-zinc-300 text-xs font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>The 2026 Architectural Living & Audio Collection</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-zinc-50 leading-[1.1]">
                Mastery in Form. <br />
                <span className="italic font-normal text-zinc-300">Purity in Sound.</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
                Engineered for those who value timeless industrial design, organic raw materials, and uncompromised precision acoustics.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-7 py-3.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <span>Explore The Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('categories')}
                  className="px-6 py-3.5 bg-zinc-900/80 hover:bg-zinc-850 text-zinc-200 border border-zinc-700/80 rounded-xl text-sm font-semibold transition-colors"
                >
                  View Lookbook
                </button>
              </div>

              {/* Trust micro metrics */}
              <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <p className="text-2xl font-bold text-zinc-100 font-serif">45h</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Titanium Lossless ANC</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-100 font-serif">100%</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Organic Certified Cotton</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-100 font-serif">2 YR</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Atelier Craft Warranty</p>
                </div>
              </div>
            </div>

            {/* Right Hero Product Feature Card */}
            {heroFeaturedProduct && (
              <div className="lg:col-span-5 hidden lg:block">
                <div
                  onClick={() => onNavigate('product-detail', undefined, heroFeaturedProduct.id)}
                  className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md group cursor-pointer hover:border-zinc-700 transition-all"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-800 mb-5">
                    <img
                      src={heroFeaturedProduct.images[0]}
                      alt={heroFeaturedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-amber-400 text-zinc-950 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      Flagship Release
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-widest font-semibold">
                      <span>{heroFeaturedProduct.brand}</span>
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current mr-1" />
                        <span className="font-bold text-white">{heroFeaturedProduct.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {heroFeaturedProduct.name}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {heroFeaturedProduct.shortDescription}
                    </p>

                    <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        {formatPrice(heroFeaturedProduct.price)}
                      </span>
                      <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Specifications <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Categories in Circle Shapes - Unique Luxury Showcase */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative backdrop aura */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none blur-2xl" />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-zinc-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-[11px] font-bold tracking-widest text-amber-900 uppercase mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Curated Disciplines</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-950">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-lg">
              Explore meticulously engineered disciplines crafted from acoustic alloys, horological sapphire, and full-grain leathers.
            </p>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="group mt-4 sm:mt-0 px-4 py-2 bg-zinc-100 hover:bg-zinc-950 text-zinc-800 hover:text-white rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-300 shadow-2xs"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Unique Circular Category Grid Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-4 sm:gap-x-6 lg:gap-x-8 justify-items-center">
          {categories.map((category, index) => {
            const categoryProducts = products.filter(p => p.category === category.name);
            const categoryPriceFrom = categoryProducts.length > 0 
              ? Math.min(...categoryProducts.map(p => p.price))
              : 0;

            return (
              <div
                key={category.id}
                onClick={() => onNavigate('shop', category.name)}
                className="group relative flex flex-col items-center text-center cursor-pointer w-full max-w-[210px] select-none"
              >
                {/* Outer Glow Halo and Circle Container */}
                <div className="relative">
                  {/* Glowing Aura Ring on hover */}
                  <div className="absolute -inset-2 rounded-full bg-radial from-amber-400/30 via-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />

                  {/* Concentric Circle Frame */}
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full p-2 bg-gradient-to-b from-zinc-100 via-white to-zinc-200 border border-zinc-250 group-hover:border-amber-400 shadow-sm group-hover:shadow-2xl group-hover:shadow-amber-500/20 transition-all duration-500 flex items-center justify-center">
                    {/* Inner Circle Disc */}
                    <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner ring-2 ring-zinc-950/5 group-hover:ring-amber-500/50 transition-all duration-500">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-120 group-hover:rotate-1 transition-transform duration-700 ease-out"
                      />
                      {/* Gradient Ambient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />

                      {/* Floating Disc Badge */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                        <span className="px-3 py-1.5 bg-white text-zinc-950 text-[11px] font-bold rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1">
                          <span>Browse</span>
                          <ArrowRight className="w-3 h-3 text-amber-600" />
                        </span>
                      </div>
                    </div>

                    {/* Circular Floating Counter Tag */}
                    <div className="absolute -top-1 -right-1 sm:top-1 sm:right-1 bg-zinc-950 text-amber-400 group-hover:bg-amber-500 group-hover:text-zinc-950 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border-2 border-white shadow-md transition-colors duration-300 flex items-center gap-1">
                      <span className="text-[9px] text-zinc-400 group-hover:text-zinc-900 font-sans">#0{index + 1}</span>
                      <span>•</span>
                      <span>{category.productCount}</span>
                    </div>

                    {/* From Price Pill */}
                    {categoryPriceFrom > 0 && (
                      <div className="absolute -bottom-2.5 inset-x-0 mx-auto w-fit bg-white/95 backdrop-blur-xs border border-zinc-200/90 text-zinc-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs group-hover:border-amber-400 group-hover:text-zinc-950 transition-colors">
                        From {formatPrice(categoryPriceFrom)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Typography & Subcategory Preview */}
                <div className="mt-5 space-y-1.5 w-full">
                  <h3 className="text-sm sm:text-base font-serif font-bold text-zinc-950 group-hover:text-amber-700 transition-colors tracking-tight">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-1 leading-relaxed px-1">
                    {category.description}
                  </p>

                  {/* Sub-discipline Pill tags */}
                  <div className="hidden sm:flex flex-wrap justify-center gap-1 pt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {category.subcategories.slice(0, 2).map((sub) => (
                      <span
                        key={sub}
                        className="text-[9px] font-medium bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full border border-zinc-200/60 group-hover:bg-amber-50 group-hover:text-amber-900 group-hover:border-amber-200 transition-colors"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>

                  <div className="pt-1.5 inline-flex items-center justify-center gap-1 text-[11px] font-bold text-zinc-400 group-hover:text-zinc-950 transition-colors">
                    <span>Explore Discipline</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Tabbed Product Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 pb-4 mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Handcrafted Goods</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 mt-1">
              Curated Catalog
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'featured', label: 'Featured' },
              { id: 'new', label: 'New Arrivals' },
              { id: 'bestsellers', label: 'Bestsellers' },
              { id: 'sale', label: 'Special Value' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === t.id
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {tabProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onSelect={(id) => onNavigate('product-detail', undefined, id)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Explore All Catalog Items ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Editorial Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-900 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1800&auto=format&fit=crop')`
            }}
          />
          <div className="relative p-8 sm:p-14 lg:p-20 max-w-2xl space-y-5 text-left">
            <div className="inline-block bg-amber-400 text-zinc-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
              Heritage Series
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Tuscan Vachetta Leather: Built to Age with Nobility
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Every bag and wallet in our leather laboratory is vegetable-tanned with tree barks and oils in Santa Croce sull'Arno, Italy. No synthetic coatings, just rich natural patina that deepens every year.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop', 'Leather Goods & Bags')}
                className="px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-100 rounded-xl text-xs font-bold tracking-wide transition-colors"
              >
                Shop Leather Laboratory →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials & Press */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Collector Reviews</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 mt-1">
            Praised by Discriminating Connoisseurs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-150 space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed italic">
              "The titanium drivers on the Aura Studio deliver a high-frequency sparkle and sub-bass depth that rival headphones double the price. Beautiful packaging too."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-200/60">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                alt="Jane D."
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-zinc-900">Jane Doe</p>
                <p className="text-[10px] text-zinc-500">Verified Collector • New York</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-150 space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed italic">
              "The weekender duffel exceeded my expectations. The Tuscan leather has that authentic rich aroma and the brass zippers feel indestructible on flights."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-200/60">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
                alt="Alexander H."
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-zinc-900">Alexander Hayes</p>
                <p className="text-[10px] text-zinc-500">Architect • Chicago</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-150 space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed italic">
              "Clean minimalist dial with automatic sweep second hand. It's rare to find 316L surgical steel with domed AR sapphire glass at this price point."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-200/60">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
                alt="Sophie L."
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-zinc-900">Sophie Laurent</p>
                <p className="text-[10px] text-zinc-500">Creative Director • Paris</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
