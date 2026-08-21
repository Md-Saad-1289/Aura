import React, { useState, useEffect } from 'react';
import { X, Star, Heart, ShoppingBag, ArrowRight, Check, ShieldCheck, Truck } from 'lucide-react';
import { Product, ProductVariantColor } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useStore } from '../context/StoreContext';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (productId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onViewDetails
}) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useStore();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ProductVariantColor | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0] || '');
      setSelectedColor(product.variants.colors?.[0]);
      setSelectedSize(product.variants.sizes?.[0]);
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, {
      color: selectedColor,
      size: selectedSize
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-zinc-400 hover:text-zinc-900 bg-white/80 backdrop-blur-xs rounded-full hover:bg-white shadow-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images Gallery */}
        <div className="md:w-1/2 p-6 bg-zinc-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-150">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-100 mb-4">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-zinc-950 text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                    selectedImage === img ? 'border-zinc-950 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[80vh] md:max-h-[90vh]">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-widest font-semibold">
                <span>{product.brand}</span>
                <span className="text-zinc-500 font-mono text-[10px]">SKU: {product.sku}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-zinc-950 mt-1 leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-zinc-800">{product.rating}</span>
                <span className="text-xs text-zinc-400">({product.reviewCount} verified reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-2 border-y border-zinc-150">
              <span className="text-2xl font-bold text-zinc-950">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-zinc-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {isLowStock && (
                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ml-auto">
                  Only {product.stock} units remaining
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs text-zinc-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Color Swatches */}
            {product.variants.colors && product.variants.colors.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-2">
                  Colorway: <span className="font-normal text-zinc-600">{selectedColor?.name}</span>
                </label>
                <div className="flex items-center gap-2.5">
                  {product.variants.colors.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 relative ${
                        selectedColor?.name === col.name
                          ? 'border-zinc-950 scale-110 shadow-xs ring-2 ring-zinc-300'
                          : 'border-zinc-200 hover:scale-105'
                      }`}
                      title={col.name}
                    >
                      <span
                        className="w-full h-full rounded-full block"
                        style={{ backgroundColor: col.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Options */}
            {product.variants.sizes && product.variants.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-800">
                    Select Size: <span className="font-normal text-zinc-600">{selectedSize}</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedSize === sz
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-5 border-t border-zinc-150 space-y-3 mt-4">
            <div className="flex gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-zinc-300 rounded-xl bg-zinc-50 px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-zinc-600 hover:text-zinc-900"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-semibold text-zinc-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-1 text-zinc-600 hover:text-zinc-900 disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'bg-zinc-950 hover:bg-zinc-850 text-white shadow-sm'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Bag!
                  </>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                  </>
                )}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors flex items-center justify-center ${
                  isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:border-zinc-300'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                <Truck className="w-3.5 h-3.5 text-zinc-500" /> Free 3–5 day delivery over $150
              </span>

              <button
                onClick={() => {
                  onClose();
                  onViewDetails(product.id);
                }}
                className="text-zinc-950 font-semibold hover:underline flex items-center gap-1 text-xs"
              >
                Full Product Page <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
