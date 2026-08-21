import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  Award,
  Check,
  ChevronRight,
  Share2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Info,
  CheckCircle,
  Lock,
  PackageCheck
} from 'lucide-react';
import { Product, ProductVariantColor, StorefrontView, Review } from '../types';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigate,
  onQuickView
}) => {
  const { products, reviews, addReview, checkReviewEligibility, formatPrice } = useStore();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { currentUser, isAuthenticated } = useAuth();

  const product = products.find(p => p.id === productId) || products[0];

  const [activeImage, setActiveImage] = useState<string>(product.images[0] || '');
  const [selectedColor, setSelectedColor] = useState<ProductVariantColor | undefined>(
    product.variants.colors?.[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.variants.sizes?.[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping' | 'craft' | 'reviews'>('specs');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review submission state
  const [newRating, setNewRating] = useState<number>(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0] || '');
      setSelectedColor(product.variants.colors?.[0]);
      setSelectedSize(product.variants.sizes?.[0]);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [productId, product]);

  const productReviews = reviews.filter(
    r => r.productId === product.id && r.status === 'approved'
  );

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, {
      color: selectedColor,
      size: selectedSize
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, {
      color: selectedColor,
      size: selectedSize
    });
    onNavigate('checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const eligibility = checkReviewEligibility(product.id, currentUser?.id, currentUser?.email);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibility.eligible) return;
    if (!newTitle.trim() || !newComment.trim()) return;

    addReview({
      productId: product.id,
      productName: product.name,
      userId: currentUser?.id || 'verified-buyer',
      userName: currentUser?.name || 'Verified Collector',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      isVerifiedBuyer: true,
      orderNumber: eligibility.order?.orderNumber
    });

    setNewTitle('');
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3500);
  };

  // Related products in same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id && p.status === 'active')
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest font-semibold">
        <button onClick={() => onNavigate('home')} className="hover:text-zinc-900">
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => onNavigate('shop')} className="hover:text-zinc-900">
          Catalog
        </button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => onNavigate('shop', product.category)} className="hover:text-zinc-900">
          {product.category}
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-900 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Photo */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-xs">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-zinc-950 text-white text-xs font-bold px-3 py-1 rounded-md tracking-wider">
                -{discountPercent}% SPECIAL OFFER
              </span>
            )}
            {product.isBestSeller && (
              <span className="absolute top-4 right-4 bg-amber-400 text-zinc-950 text-xs font-bold px-3 py-1 rounded-md tracking-wider uppercase">
                Bestseller
              </span>
            )}
          </div>

          {/* Thumbnail Carousel */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 bg-zinc-100 transition-all ${
                    activeImage === img
                      ? 'border-zinc-950 ring-2 ring-zinc-300 shadow-xs'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-zinc-400 font-bold">
              <span>{product.brand}</span>
              <span className="font-mono text-[11px] text-zinc-500">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-900">{product.rating}</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs text-zinc-500 hover:text-zinc-900 underline"
              >
                ({product.reviewCount} customer reviews)
              </button>
            </div>
          </div>

          {/* Pricing Bar */}
          <div className="flex items-baseline gap-3 py-4 border-y border-zinc-200">
            <span className="text-3xl font-bold text-zinc-950 font-sans">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-zinc-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Save {formatPrice(product.compareAtPrice! - product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            {product.description}
          </p>

          {/* Variants: Colors */}
          {product.variants.colors && product.variants.colors.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-900">
                  Select Colorway:{' '}
                  <span className="font-normal text-zinc-600">{selectedColor?.name}</span>
                </span>
                <span className="text-emerald-700 text-[11px] font-semibold">✓ In Stock</span>
              </div>
              <div className="flex items-center gap-3">
                {product.variants.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-9 h-9 rounded-full border-2 p-0.5 transition-all relative ${
                      selectedColor?.name === color.name
                        ? 'border-zinc-950 ring-2 ring-zinc-400 scale-110 shadow-sm'
                        : 'border-zinc-200 hover:scale-105'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="w-full h-full rounded-full block"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variants: Sizes */}
          {product.variants.sizes && product.variants.sizes.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-900">
                  Select Size:{' '}
                  <span className="font-normal text-zinc-600">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => alert('Standard sizing guide: All items fit true to size. For a tailored silhouette, order your standard size.')}
                  className="text-zinc-500 hover:text-zinc-900 text-[11px] underline flex items-center gap-1"
                >
                  <Info className="w-3 h-3" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === size
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                        : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Status Bar */}
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="font-medium text-zinc-800">
                {isOutOfStock
                  ? 'Currently Out of Stock'
                  : isLowStock
                  ? `Only ${product.stock} units remaining in New York warehouse`
                  : 'Ready to Dispatch — In Stock'}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">Ships today</span>
          </div>

          {/* Purchase Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-zinc-300 rounded-xl bg-zinc-50 px-3 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-zinc-600 hover:text-zinc-950 text-sm font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-zinc-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="text-zinc-600 hover:text-zinc-950 text-sm font-bold disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'bg-zinc-950 hover:bg-zinc-850 text-white shadow-md'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Shopping Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                  </>
                )}
              </button>

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-center ${
                  isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-950'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="p-3.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 transition-colors"
                title="Share link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Direct Buy Now Button */}
            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-xl text-xs font-bold tracking-wider uppercase shadow-xs transition-colors"
              >
                Instant Buy Now with Express Checkout →
              </button>
            )}
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-150 text-[11px] text-zinc-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-zinc-900 flex-shrink-0" />
              <span>Complimentary worldwide express shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-zinc-900 flex-shrink-0" />
              <span>30-Day effortless trial & returns</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-zinc-900 flex-shrink-0" />
              <span>2-Year Atelier warranty included</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-900 flex-shrink-0" />
              <span>100% Authenticity guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications, Craft, Shipping, Reviews */}
      <div className="pt-10 border-t border-zinc-200">
        <div className="flex items-center border-b border-zinc-200 gap-8 overflow-x-auto">
          {[
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'craft', label: 'Materials & Craftsmanship' },
            { id: 'shipping', label: 'Shipping & Returns' },
            { id: 'reviews', label: `Customer Reviews (${productReviews.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-zinc-950 text-zinc-950 font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {/* Specifications Tab */}
          {activeTab === 'specs' && (
            <div className="max-w-3xl space-y-4">
              <h3 className="text-base font-bold text-zinc-950">Technical Regimen & Dimensions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="p-2 border-b border-zinc-200/60 flex justify-between gap-4 text-xs">
                    <span className="font-semibold text-zinc-500">{key}</span>
                    <span className="font-medium text-zinc-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Craft Tab */}
          {activeTab === 'craft' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <h3 className="text-base font-bold text-zinc-950">Ethical Sourcing & Heritage</h3>
              <p>
                Each component is manufactured in small batches following strict European circular economy standards. We collaborate exclusively with family-owned ateliers in Italy, Japan, and Switzerland that uphold zero-compromise working standards and ethical raw materials extraction.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <p className="font-bold text-zinc-900 text-xs">Certified Organic</p>
                  <p className="text-[11px] text-zinc-500 mt-1">GOTS & OEKO-TEX Standard 100 non-toxic dyes.</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <p className="font-bold text-zinc-900 text-xs">Carbon Neutral</p>
                  <p className="text-[11px] text-zinc-500 mt-1">100% of transport emissions permanently offset.</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <p className="font-bold text-zinc-900 text-xs">Repairable Design</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Modular screws & replacement spare parts stock.</p>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <h3 className="text-base font-bold text-zinc-950">Global Transit & Effortless Exchanges</h3>
              <p>
                All orders are dispatched from our climate-controlled fulfillment hubs within 24 hours. Each shipment includes insured tracking with FedEx or DHL Priority.
              </p>
              <ul className="space-y-2 list-disc list-inside pt-2">
                <li>Complimentary ground shipping on all orders over $150.</li>
                <li>30-day risk-free home evaluation window.</li>
                <li>Pre-printed return shipping labels included in the presentation box.</li>
                <li>Instant refund processed within 48 hours of return inspection.</li>
              </ul>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-10">
              {/* Overall Ratings Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8 bg-zinc-50 rounded-3xl border border-zinc-200">
                <div className="md:col-span-4 text-center md:text-left flex flex-col justify-center space-y-2">
                  <span className="text-5xl font-serif font-bold text-zinc-950">{product.rating}</span>
                  <div className="flex text-amber-400 justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Based on {productReviews.length} verified customer reviews
                  </p>
                </div>

                <div className="md:col-span-8 space-y-2 flex flex-col justify-center">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = productReviews.filter(r => r.rating === stars).length;
                    const percent = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs">
                        <span className="w-12 text-zinc-600 font-semibold">{stars} Stars</span>
                        <div className="flex-1 bg-zinc-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-zinc-400 font-mono text-[11px]">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews Feed */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-zinc-950">Verified Owner Feedback</h3>

                {productReviews.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4">No reviews yet for this product. Be the first to share your impression!</p>
                ) : (
                  productReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-6 bg-white rounded-2xl border border-zinc-200/80 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}
                            alt={review.userName}
                            className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-zinc-900">{review.userName}</h4>
                              {review.isVerifiedBuyer && (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                                  ✓ Verified Buyer
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-400">
                              {new Date(review.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating ? 'fill-current' : 'text-zinc-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h5 className="text-xs font-bold text-zinc-900">{review.title}</h5>
                      <p className="text-xs text-zinc-600 leading-relaxed">{review.comment}</p>

                      {/* Store Reply if available */}
                      {review.reply && (
                        <div className="mt-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-1">
                          <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Response from {review.reply.repliedBy}
                          </p>
                          <p className="text-zinc-600 text-[11px]">{review.reply.text}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Write A Review / Verified Delivery Gate */}
              <div className="max-w-2xl">
                {/* Condition 1: User is not logged in */}
                {eligibility.reason === 'guest' && (
                  <div className="p-6 sm:p-8 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-zinc-200/80 text-zinc-700 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-zinc-950">
                          Verified Delivery Review Policy
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Reviews can only be submitted by verified customers after their purchase has been completely delivered. Please sign in to check your order delivery status.
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center gap-3">
                      <button
                        onClick={() => onNavigate('account')}
                        className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                      >
                        <span>Sign In to Review</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Condition 2: Logged in, but hasn't bought this item */}
                {eligibility.reason === 'not_purchased' && (
                  <div className="p-6 sm:p-8 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-zinc-200 text-zinc-600 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-zinc-950">
                          Verified Delivery Required
                        </h4>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          You haven’t ordered <strong className="text-zinc-900">{product.name}</strong> yet. In accordance with our authenticity standards, reviews are strictly permitted only after an order is placed and delivered to your address.
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center gap-3">
                      <button
                        onClick={handleAddToCart}
                        className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Order Now ({formatPrice(product.price)})</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Condition 3: Logged in, purchased, but order NOT yet delivered */}
                {eligibility.reason === 'not_delivered' && (
                  <div className="p-6 sm:p-8 bg-amber-50 rounded-3xl border border-amber-200 space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-amber-950">
                            Delivery In Progress • Order #{eligibility.order?.orderNumber}
                          </h4>
                          <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                            {eligibility.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs text-amber-900/80 leading-relaxed">
                          We found your purchase of this item in order <strong>#{eligibility.order?.orderNumber}</strong>. You will be able to share your verified review the moment your courier delivers the parcel to your doorstep.
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center gap-3">
                      {eligibility.order?.orderNumber && (
                        <button
                          onClick={() => onNavigate('order-tracking')}
                          className="px-4 py-2.5 bg-zinc-950 text-white hover:bg-zinc-850 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Delivery Status</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Condition 4: User already reviewed this product */}
                {eligibility.reason === 'already_reviewed' && (
                  <div className="p-6 sm:p-8 bg-emerald-50/80 rounded-3xl border border-emerald-200 space-y-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-emerald-950">
                          Your Verified Review is Active
                        </h4>
                        <p className="text-xs text-emerald-900/80 leading-relaxed">
                          Thank you for sharing your experience as a verified owner of <strong>{product.name}</strong>. Your feedback is published in the community feedback section.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Condition 5: Eligible to review (Purchased AND Delivered) */}
                {eligibility.reason === 'can_review' && (
                  <div className="p-6 sm:p-8 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-5">
                    <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <PackageCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900">
                          Verified Delivery Confirmed • Order #{eligibility.order?.orderNumber}
                        </p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          Your consignment has been delivered. You are authorized to publish a verified buyer impression.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-zinc-950">Write a Verified Product Review</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Share your experience with fellow collectors and design enthusiasts.
                      </p>
                    </div>

                    {reviewSubmitted ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>Thank you! Your verified review has been published.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-800 mb-1">
                            Overall Rating
                          </label>
                          <div className="flex gap-1.5 text-amber-400 cursor-pointer">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setNewRating(star)}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= newRating ? 'fill-current text-amber-400' : 'text-zinc-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-800 mb-1">
                            Review Title
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Exceptional acoustic clarity and build quality"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-800 mb-1">
                            Detailed Impressions
                          </label>
                          <textarea
                            required
                            rows={4}
                            placeholder="How does the material feel? How does it fit into your everyday routine?"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
                        >
                          Publish Verified Review
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-zinc-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Complete the Look</span>
              <h3 className="text-2xl font-serif font-bold text-zinc-950 mt-1">
                You May Also Admire
              </h3>
            </div>
            <button
              onClick={() => onNavigate('shop', product.category)}
              className="text-xs font-bold text-zinc-900 hover:text-zinc-600 flex items-center gap-1"
            >
              View category <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={onQuickView}
                onSelect={(id) => onNavigate('product-detail', undefined, id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
