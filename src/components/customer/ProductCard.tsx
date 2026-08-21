import React from 'react';
import { Heart, Star, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onSelect: (productId: string) => void;
  listView?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onSelect,
  listView = false
}) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useStore();

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1, {
      color: product.variants.colors?.[0],
      size: product.variants.sizes?.[0]
    });
  };

  if (listView) {
    return (
      <div
        onClick={() => onSelect(product.id)}
        className="group flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-zinc-950 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2 text-left w-full">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              {product.brand} • {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold text-zinc-800">{product.rating}</span>
              <span className="text-zinc-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="text-base font-semibold text-zinc-950 group-hover:text-zinc-800 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Color previews */}
          {product.variants.colors && (
            <div className="flex items-center gap-1.5 pt-1">
              {product.variants.colors.map((c) => (
                <span
                  key={c.name}
                  className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 sm:gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
          <div className="text-left sm:text-right">
            <div className="text-lg font-bold text-zinc-950">
              {formatPrice(product.price)}
            </div>
            {product.compareAtPrice && (
              <div className="text-xs text-zinc-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-900'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(product.id)}
      className="group relative bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Secondary Hover Image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-white/95 backdrop-blur-xs text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-zinc-950 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs tracking-wider">
              -{discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-400 text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
            isLiked
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-zinc-700 hover:text-zinc-950 shadow-sm opacity-90 group-hover:opacity-100'
          }`}
          title="Save to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden sm:flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2.5 bg-white/95 hover:bg-white text-zinc-900 rounded-xl text-xs font-semibold shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-600" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="p-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl shadow-md flex items-center justify-center transition-colors disabled:opacity-40"
            title="Quick add to bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase font-semibold tracking-wider">
            <span>{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-bold text-zinc-800 text-[11px]">{product.rating}</span>
            </div>
          </div>

          <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-1 mt-0.5">
            {product.name}
          </h3>

          <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
            {product.shortDescription}
          </p>
        </div>

        {/* Color swatches preview */}
        {product.variants.colors && product.variants.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {product.variants.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                className="w-3 h-3 rounded-full border border-zinc-300"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.variants.colors.length > 4 && (
              <span className="text-[9px] text-zinc-400">+{product.variants.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Price & Stock info */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-zinc-950">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {isOutOfStock ? (
            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {product.stock} left
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
