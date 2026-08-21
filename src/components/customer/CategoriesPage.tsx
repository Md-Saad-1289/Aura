import React from 'react';
import { ArrowRight, Sparkles, ChevronRight, Layers, Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StorefrontView } from '../../types';

interface CategoriesPageProps {
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const { categories, products } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 rounded-full text-[11px] font-bold tracking-widest text-zinc-600 uppercase">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Curated Disciplines</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-950">
          Collections & Categories
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
          Discover our full spectrum of industrial design, precision acoustics, horology, and natural raw materials.
        </p>
      </div>

      {/* Main Circular Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => {
          const categoryProducts = products.filter(p => p.category === category.name);
          return (
            <div
              key={category.id}
              onClick={() => onNavigate('shop', category.name)}
              className="group relative bg-white border border-zinc-200 hover:border-zinc-300 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Distinctive Circle Shape Image Showcase */}
              <div className="relative mb-6">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 ring-2 ring-zinc-200 group-hover:ring-4 group-hover:ring-amber-400 transition-all duration-500 bg-zinc-50 shadow-md group-hover:shadow-2xl overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-zinc-950/10 group-hover:bg-zinc-950/30 transition-colors duration-300" />
                  </div>
                </div>

                {/* Floating Circular Badge */}
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-zinc-950 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border-2 border-white shadow-xs group-hover:bg-amber-400 group-hover:text-zinc-950 transition-colors">
                  {categoryProducts.length} Items
                </div>
              </div>

              {/* Category Info */}
              <div className="space-y-2 flex-1 flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-xl font-serif font-bold text-zinc-950 group-hover:text-amber-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Subcategory Pill Chips */}
                <div className="flex flex-wrap justify-center gap-1.5 pt-4">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub}
                      className="px-2.5 py-1 bg-zinc-100 group-hover:bg-amber-50 group-hover:text-amber-900 border border-zinc-150 rounded-full text-[10px] font-medium text-zinc-600 transition-colors"
                    >
                      {sub}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="px-2 py-1 bg-zinc-100 text-[10px] font-medium text-zinc-400 rounded-full">
                      +{category.subcategories.length - 3}
                    </span>
                  )}
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-5 border-t border-zinc-100 mt-5 flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
                  <span>Browse {category.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

