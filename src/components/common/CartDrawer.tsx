import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { StorefrontView } from '../../types';

interface CartDrawerProps {
  onNavigate?: (view: StorefrontView, categoryId?: string, productId?: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onCheckout?: () => void;
  onViewCart?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigate,
  isOpen: propsIsOpen,
  onClose: propsOnClose,
  onCheckout: propsOnCheckout,
  onViewCart: propsOnViewCart
}) => {
  const {
    cart,
    itemCount,
    subtotal,
    discount,
    appliedCoupon,
    total,
    shippingCost,
    freeShippingProgress,
    amountNeededForFreeShipping,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    applyCouponCode,
    removeCouponCode
  } = useCart();

  const { formatPrice } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const isDrawerOpen = propsIsOpen !== undefined ? (propsIsOpen || isCartOpen) : isCartOpen;

  if (!isDrawerOpen) return null;

  const handleClose = () => {
    setIsCartOpen(false);
    if (propsOnClose) {
      propsOnClose();
    }
  };

  const handleViewCart = () => {
    handleClose();
    if (propsOnViewCart) {
      propsOnViewCart();
    }
    if (onNavigate) {
      onNavigate('cart');
    }
  };

  const handleCheckout = () => {
    handleClose();
    if (propsOnCheckout) {
      propsOnCheckout();
    }
    if (onNavigate) {
      onNavigate('checkout');
    }
  };

  const handleExplore = () => {
    handleClose();
    if (onNavigate) {
      onNavigate('shop');
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-zinc-150 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h2 className="text-base font-serif font-bold text-zinc-950">
                Your Shopping Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-zinc-50 px-5 py-3 border-b border-zinc-150">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {freeShippingProgress >= 100 ? (
                  <span className="text-emerald-700 font-semibold">You unlocked Free Worldwide Shipping!</span>
                ) : (
                  <span>
                    Add <strong className="text-zinc-950">{formatPrice(amountNeededForFreeShipping)}</strong> for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-zinc-600">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-zinc-950 h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800">Your shopping bag is empty</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                    Explore our curated collections of timeless essentials crafted for longevity.
                  </p>
                </div>
                <button
                  onClick={handleExplore}
                  className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-850 transition-colors inline-block"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl border border-zinc-150 bg-zinc-50/50 hover:bg-zinc-50 transition-colors"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-zinc-100 flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-zinc-900 leading-snug line-clamp-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-400 hover:text-rose-500 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant chips */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                        {item.selectedVariant.color && (
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-zinc-300"
                              style={{ backgroundColor: item.selectedVariant.color.hex }}
                            />
                            {item.selectedVariant.color.name}
                          </span>
                        )}
                        {item.selectedVariant.size && (
                          <span className="bg-zinc-200/70 text-zinc-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            {item.selectedVariant.size}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/60">
                      <div className="flex items-center border border-zinc-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-zinc-800 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 rounded-r-lg transition-colors disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-zinc-950">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-150 bg-white space-y-4">
              {/* Coupon input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold">{appliedCoupon.code}</span>
                      <span>(-{formatPrice(discount)})</span>
                    </div>
                    <button
                      onClick={removeCouponCode}
                      className="text-emerald-700 hover:text-emerald-950 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. WELCOME10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 uppercase"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-600 pl-1">{couponError}</p>
                    )}
                    {couponSuccess && (
                      <p className="text-[11px] text-emerald-600 pl-1">{couponSuccess}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Order Summary breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-zinc-900 font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600 font-semibold">Free</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-150">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleViewCart}
                  className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  View Full Cart & Summary
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                <span>256-Bit SSL Encrypted & Carbon-Neutral Fulfillment</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
