import React, { useState, useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  X,
  ChevronDown,
  Star,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Product, StorefrontView, FilterState } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

interface ShopPageProps {
  initialCategory?: string;
  initialSearch?: string;
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
  onQuickView: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialSearch,
  onNavigate,
  onQuickView
}) => {
  const { products, categories, formatPrice } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory || '',
    subcategory: '',
    searchQuery: initialSearch || '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'recommended',
    rating: null,
    inStockOnly: false,
    onSaleOnly: false,
    selectedColors: [],
    selectedSizes: [],
    selectedBrand: ''
  });

  useEffect(() => {
    if (initialCategory) {
      setFilters(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setFilters(prev => ({ ...prev, searchQuery: initialSearch }));
    }
  }, [initialSearch]);

  // Extract all unique colors and sizes from catalog
  const availableColors = useMemo(() => {
    const colorMap = new Map<string, { name: string; hex: string }>();
    products.forEach(p => {
      p.variants.colors?.forEach(c => {
        if (!colorMap.has(c.name)) {
          colorMap.set(c.name, c);
        }
      });
    });
    return Array.from(colorMap.values());
  }, [products]);

  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    products.forEach(p => {
      p.variants.sizes?.forEach(s => sizeSet.add(s));
    });
    return Array.from(sizeSet);
  }, [products]);

  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand)));
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (product.status !== 'active') return false;

      if (filters.category && product.category !== filters.category) {
        return false;
      }

      if (filters.subcategory && product.subcategory !== filters.subcategory) {
        return false;
      }

      if (filters.selectedBrand && product.brand !== filters.selectedBrand) {
        return false;
      }

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchTags = product.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchBrand && !matchDesc && !matchTags) {
          return false;
        }
      }

      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      if (filters.rating && product.rating < filters.rating) {
        return false;
      }

      if (filters.inStockOnly && product.stock <= 0) {
        return false;
      }

      if (filters.onSaleOnly && !product.isOnSale) {
        return false;
      }

      if (filters.selectedColors.length > 0) {
        const productColors = product.variants.colors?.map(c => c.name) || [];
        const hasColor = filters.selectedColors.some(c => productColors.includes(c));
        if (!hasColor) return false;
      }

      if (filters.selectedSizes.length > 0) {
        const productSizes = product.variants.sizes || [];
        const hasSize = filters.selectedSizes.some(s => productSizes.includes(s));
        if (!hasSize) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'recommended':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, filters]);

  const handleClearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      searchQuery: '',
      minPrice: 0,
      maxPrice: 1000,
      sortBy: 'recommended',
      rating: null,
      inStockOnly: false,
      onSaleOnly: false,
      selectedColors: [],
      selectedSizes: [],
      selectedBrand: ''
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.subcategory ||
    filters.searchQuery ||
    filters.minPrice > 0 ||
    filters.maxPrice < 1000 ||
    filters.rating !== null ||
    filters.inStockOnly ||
    filters.onSaleOnly ||
    filters.selectedColors.length > 0 ||
    filters.selectedSizes.length > 0 ||
    filters.selectedBrand;

  const toggleColorFilter = (colorName: string) => {
    setFilters(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(colorName)
        ? prev.selectedColors.filter(c => c !== colorName)
        : [...prev.selectedColors, colorName]
    }));
  };

  const toggleSizeFilter = (size: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter(s => s !== size)
        : [...prev.selectedSizes, size]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="border-b border-zinc-200 pb-6 mb-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest font-semibold">
            <button onClick={() => onNavigate('home')} className="hover:text-zinc-900">
              Home
            </button>
            <span>/</span>
            <span className="text-zinc-900">Catalog</span>
            {filters.category && (
              <>
                <span>/</span>
                <span className="text-zinc-900">{filters.category}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-950 mt-2">
            {filters.category || (filters.searchQuery ? `Search: "${filters.searchQuery}"` : 'All Catalog Goods')}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Showing {filteredProducts.length} handcrafted essentials engineered for enduring performance.
          </p>
        </div>

        {/* Circular Category Story Navigation Rail */}
        <div className="pt-2">
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 scrollbar-thin">
            {/* "All" Circle */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, category: '', subcategory: '' }))}
              className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 transition-all duration-300 flex items-center justify-center ${
                  !filters.category
                    ? 'ring-3 ring-amber-500 bg-zinc-950 text-white shadow-md'
                    : 'ring-1.5 ring-zinc-200 bg-zinc-100 text-zinc-700 group-hover:ring-zinc-400'
                }`}
              >
                <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-zinc-900 text-white">
                  <LayoutGrid className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span
                className={`mt-2 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  !filters.category ? 'text-zinc-950 font-bold' : 'text-zinc-500 group-hover:text-zinc-900'
                }`}
              >
                All Pieces
              </span>
            </button>

            {/* Category Circles */}
            {categories.map((c) => {
              const isSelected = filters.category === c.name;
              return (
                <button
                  key={c.id}
                  onClick={() => setFilters(prev => ({ ...prev, category: c.name, subcategory: '' }))}
                  className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
                >
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 transition-all duration-300 flex items-center justify-center ${
                      isSelected
                        ? 'ring-3 ring-amber-500 shadow-md scale-105'
                        : 'ring-1.5 ring-zinc-200 group-hover:ring-amber-400/80 group-hover:scale-105'
                    }`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden relative bg-zinc-100">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-500/20" />
                      )}
                    </div>
                  </div>
                  <span
                    className={`mt-2 text-[11px] font-semibold whitespace-nowrap transition-colors max-w-[85px] truncate ${
                      isSelected ? 'text-zinc-950 font-bold' : 'text-zinc-500 group-hover:text-zinc-900'
                    }`}
                  >
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 space-y-6 pr-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <span className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset all
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Keyword Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-500"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setFilters(prev => ({ ...prev, category: '', subcategory: '' }))}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  !filters.category
                    ? 'bg-zinc-950 text-white font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-75">{products.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters(prev => ({ ...prev, category: cat.name, subcategory: '' }))}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    filters.category === cat.name
                      ? 'bg-zinc-950 text-white font-semibold'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-75">{cat.productCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-2 border-t border-zinc-150">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Max Price
              </label>
              <span className="text-xs font-bold text-zinc-950">
                {formatPrice(filters.maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-zinc-950 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
              <span>{formatPrice(50)}</span>
              <span>{formatPrice(1000)}+</span>
            </div>
          </div>

          {/* Colorways Filter */}
          <div className="pt-2 border-t border-zinc-150">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Color Palette
            </label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => {
                const isSelected = filters.selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => toggleColorFilter(color.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 relative ${
                      isSelected
                        ? 'border-zinc-950 ring-2 ring-zinc-400 scale-110'
                        : 'border-zinc-200 hover:scale-105'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="w-full h-full rounded-full block"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Filter */}
          {availableSizes.length > 0 && (
            <div className="pt-2 border-t border-zinc-150">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Sizes
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableSizes.map((size) => {
                  const isSelected = filters.selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSizeFilter(size)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-zinc-950 text-white border-zinc-950'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Toggles */}
          <div className="pt-2 border-t border-zinc-150 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                className="w-4 h-4 rounded text-zinc-950 focus:ring-zinc-950 accent-zinc-950"
              />
              <span className="text-xs text-zinc-700 font-medium">In Stock Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onSaleOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, onSaleOnly: e.target.checked }))}
                className="w-4 h-4 rounded text-zinc-950 focus:ring-zinc-950 accent-zinc-950"
              />
              <span className="text-xs text-zinc-700 font-medium">Special Sale Items</span>
            </label>
          </div>

          {/* Rating filter */}
          <div className="pt-2 border-t border-zinc-150">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Minimum Rating
            </label>
            <div className="space-y-1">
              {[4.8, 4.5, 4.0].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilters(prev => ({ ...prev, rating: prev.rating === star ? null : star }))}
                  className={`w-full text-left px-2.5 py-1 rounded-lg text-xs flex items-center justify-between ${
                    filters.rating === star ? 'bg-zinc-100 font-semibold' : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-zinc-800">{star} & above</span>
                  </div>
                  {filters.rating === star && <Check className="w-3.5 h-3.5 text-zinc-900" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Results Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-200/80">
            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters ? '(Active)' : ''}</span>
              </button>

              <span className="text-xs text-zinc-500 font-medium">
                {filteredProducts.length} items found
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 hidden sm:inline">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="bg-white border border-zinc-200 text-zinc-900 text-xs rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-zinc-500 shadow-2xs cursor-pointer"
                >
                  <option value="recommended">Featured / Recommended</option>
                  <option value="newest">Newest Releases</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* View Grid/List toggles */}
              <div className="hidden sm:flex items-center bg-white border border-zinc-200 rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-zinc-950 text-white shadow-2xs' : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-zinc-950 text-white shadow-2xs' : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-zinc-400 font-medium">Active Filters:</span>
              {filters.category && (
                <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full text-[11px] font-medium">
                  Category: {filters.category}
                  <button onClick={() => setFilters(prev => ({ ...prev, category: '' }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full text-[11px] font-medium">
                  Search: "{filters.searchQuery}"
                  <button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.maxPrice < 1000 && (
                <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full text-[11px] font-medium">
                  Under {formatPrice(filters.maxPrice)}
                  <button onClick={() => setFilters(prev => ({ ...prev, maxPrice: 1000 }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.selectedColors.map(c => (
                <span key={c} className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full text-[11px] font-medium">
                  Color: {c}
                  <button onClick={() => toggleColorFilter(c)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.inStockOnly && (
                <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full text-[11px] font-medium">
                  In Stock Only
                  <button onClick={() => setFilters(prev => ({ ...prev, inStockOnly: false }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-zinc-500 hover:text-zinc-950 font-semibold underline text-[11px] ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Listing */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-200/60 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-200/60 flex items-center justify-center mx-auto text-zinc-400">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">No products match your criteria</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your price range, color filters, or searching with broader keywords.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-850"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onSelect={(id) => onNavigate('product-detail', undefined, id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onSelect={(id) => onNavigate('product-detail', undefined, id)}
                  listView
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <span className="text-base font-bold text-zinc-950 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filter Products
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Controls */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>Max Price</span>
                    <span>{formatPrice(filters.maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="25"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                    className="w-full accent-zinc-950"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                      className="rounded accent-zinc-950"
                    />
                    <span className="text-xs text-zinc-800">In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.onSaleOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, onSaleOnly: e.target.checked }))}
                      className="rounded accent-zinc-950"
                    />
                    <span className="text-xs text-zinc-800">Special Value Sale</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex gap-2">
                <button
                  onClick={handleClearFilters}
                  className="flex-1 py-3 bg-zinc-100 text-zinc-800 rounded-xl text-xs font-semibold"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-zinc-950 text-white rounded-xl text-xs font-bold"
                >
                  Show Results ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
