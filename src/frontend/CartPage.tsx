import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { StorefrontView } from '../types';

interface CartPageProps {
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    cart,
    itemCount,
    subtotal,
    discount,
    appliedCoupon,
    shippingMethod,
    setShippingMethod,
    shippingCost,
    tax,
    total,
    freeShippingProgress,
    amountNeededForFreeShipping,
    updateQuantity,
    removeItem,
    clearCart,
    applyCouponCode,
    removeCouponCode
  } = useCart();

  const { shippingMethods, settings, formatPrice } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError(null);
    setCouponSuccess(null);

    const res = applyCouponCode(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Discover precision-engineered audio, organic knitwear, horology, and Italian leather accessories.
          </p>
        </div>
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
        >
          Explore Catalog Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Checkout Prep</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 mt-1">
            Shopping Bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-zinc-500 hover:text-rose-600 underline text-left sm:text-right"
        >
          Empty Bag
        </button>
      </div>

      {/* Free Shipping Progress bar */}
      <div className="p-4 sm:p-5 bg-zinc-50 rounded-2xl border border-zinc-200">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {freeShippingProgress >= 100 ? (
              <span className="text-emerald-700 font-bold">You qualify for complimentary worldwide express delivery!</span>
            ) : (
              <span>
                Add <strong className="text-zinc-950">{formatPrice(amountNeededForFreeShipping)}</strong> more to your bag for Free Worldwide Shipping
              </span>
            )}
          </span>
          <span className="font-mono text-zinc-600 font-bold">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-zinc-950 h-full transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200/80 divide-y divide-zinc-150 overflow-hidden shadow-xs">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                {/* Thumbnail & Info */}
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    onClick={() => onNavigate('product-detail', undefined, item.product.id)}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-zinc-100 flex-shrink-0 cursor-pointer hover:opacity-90"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      {item.product.brand}
                    </span>
                    <h3
                      onClick={() => onNavigate('product-detail', undefined, item.product.id)}
                      className="text-sm font-bold text-zinc-950 hover:underline cursor-pointer truncate"
                    >
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 pt-0.5">
                      {item.selectedVariant.color && (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-zinc-300"
                            style={{ backgroundColor: item.selectedVariant.color.hex }}
                          />
                          {item.selectedVariant.color.name}
                        </span>
                      )}
                      {item.selectedVariant.size && (
                        <span className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded text-[11px] font-medium">
                          Size: {item.selectedVariant.size}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity & Unit Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                  <div className="flex items-center border border-zinc-300 rounded-xl bg-zinc-50 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-zinc-600 hover:text-zinc-950"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-zinc-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-1 text-zinc-600 hover:text-zinc-950 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <p className="text-sm font-bold text-zinc-950">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {formatPrice(item.unitPrice)} each
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-bold text-zinc-900 hover:underline flex items-center gap-1.5"
            >
              ← Continue Browsing
            </button>
          </div>
        </div>

        {/* Right: Summary & Order Configuration (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200 space-y-6">
            <h3 className="text-base font-serif font-bold text-zinc-950 pb-3 border-b border-zinc-200">
              Order Summary
            </h3>

            {/* Shipping selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                Delivery Method
              </label>
              <div className="space-y-2">
                {shippingMethods.map((sm) => {
                  const isFree = sm.id === 'ship-std' && subtotal >= (settings.freeShippingThreshold || 150);
                  const isSelected = shippingMethod.id === sm.id;
                  return (
                    <label
                      key={sm.id}
                      onClick={() => setShippingMethod(sm)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white border-zinc-950 shadow-2xs ring-1 ring-zinc-950'
                          : 'bg-white/60 border-zinc-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="shipping_method"
                          checked={isSelected}
                          onChange={() => setShippingMethod(sm)}
                          className="accent-zinc-950"
                        />
                        <div>
                          <p className="text-xs font-bold text-zinc-900">{sm.name}</p>
                          <p className="text-[10px] text-zinc-500">{sm.estimatedDays}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-zinc-950">
                        {isFree ? <span className="text-emerald-700">Free</span> : formatPrice(sm.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Coupon Box */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                Discount Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">{appliedCoupon.code}</span>
                    <span>(-{formatPrice(discount)})</span>
                  </div>
                  <button
                    onClick={removeCouponCode}
                    className="text-emerald-700 hover:text-emerald-950 text-xs underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 uppercase placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                  {couponSuccess && <p className="text-[11px] text-emerald-600">{couponSuccess}</p>}
                </form>
              )}
            </div>

            {/* Cost Breakdown Table */}
            <div className="space-y-2.5 pt-3 border-t border-zinc-200 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600">
                <span>Shipping ({shippingMethod.name})</span>
                <span className="font-semibold text-zinc-900">
                  {shippingCost === 0 ? <span className="text-emerald-700 font-bold">Free</span> : formatPrice(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between text-zinc-600">
                <span>Estimated Sales Tax ({settings.taxRate}%)</span>
                <span className="font-semibold text-zinc-900">{formatPrice(tax)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-zinc-950 pt-3 border-t border-zinc-200">
                <span>Estimated Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-4 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-zinc-500" />
              <span>Encrypted Checkout with 2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
