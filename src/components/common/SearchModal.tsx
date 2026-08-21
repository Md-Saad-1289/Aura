import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSearchSubmit
}) => {
  const { products, categories, formatPrice } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products
        .filter(
          p =>
            p.status === 'active' &&
            (p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.category.toLowerCase().includes(query.toLowerCase()) ||
              p.brand.toLowerCase().includes(query.toLowerCase()) ||
              p.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
        )
        .slice(0, 6)
    : products.filter(p => p.isFeatured).slice(0, 4);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && query.trim()) {
      onSearchSubmit(query.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-150 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search audio, cashmere, automatic watches, leather..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-base sm:text-lg text-zinc-900 placeholder-zinc-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-400 hover:text-zinc-600 text-xs px-2 py-1 bg-zinc-100 rounded-md"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-5 py-2.5 bg-zinc-50 border-b border-zinc-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-zinc-400 font-medium whitespace-nowrap">Suggested:</span>
          {['Headphones', 'Automatic Watch', 'Merino Wool', 'Leather Bag', 'Diffuser'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-white border border-zinc-200 hover:border-zinc-400 rounded-full text-zinc-700 text-[11px] whitespace-nowrap transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
          <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mb-3 flex items-center justify-between">
            <span>{query ? `Search Results (${filteredProducts.length})` : 'Featured Collections'}</span>
            {query && (
              <button
                onClick={() => {
                  onSearchSubmit(query);
                  onClose();
                }}
                className="text-zinc-900 font-semibold hover:underline flex items-center gap-1"
              >
                View all results <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-zinc-600 font-medium">No results found for "{query}"</p>
              <p className="text-xs text-zinc-400 mt-1">Try checking for spelling or searching with broader keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product.id);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50/80 cursor-pointer transition-all group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg bg-zinc-100 flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold truncate">
                      {product.brand}
                    </p>
                    <h4 className="text-xs font-semibold text-zinc-900 truncate group-hover:text-zinc-950">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-zinc-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-[10px] text-zinc-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-150 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-zinc-200 text-zinc-700 rounded font-mono text-[10px]">ESC</kbd> to close</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-zinc-200 text-zinc-700 rounded font-mono text-[10px]">↵</kbd> for full catalog search</span>
          </div>
          <span className="text-zinc-500 font-medium">Free Global Shipping over $150</span>
        </div>
      </div>
    </div>
  );
};
