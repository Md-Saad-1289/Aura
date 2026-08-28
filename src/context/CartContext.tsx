import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { Product, CartItem, SelectedVariant, Coupon, ShippingMethod } from '../types';
import { useStore } from './StoreContext';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  appliedCoupon: Coupon | null;
  shippingMethod: ShippingMethod;
  shippingCost: number;
  tax: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingProgress: number; // 0 to 100
  amountNeededForFreeShipping: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number, selectedVariant?: SelectedVariant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCouponCode: () => void;
  setShippingMethod: (method: ShippingMethod) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getCartStorageKey = (userId?: string) => {
  return userId ? `aura_cart_user_${userId}` : 'aura_cart_guest';
};

const getCouponStorageKey = (userId?: string) => {
  return userId ? `aura_coupon_user_${userId}` : 'aura_coupon_guest';
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { shippingMethods, settings, validateCoupon } = useStore();
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const currentCartKey = getCartStorageKey(userId);
  const currentCouponKey = getCouponStorageKey(userId);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(currentCartKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem(currentCouponKey);
    return saved ? JSON.parse(saved) : null;
  });

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(shippingMethods[0]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const activeCartKeyRef = useRef(currentCartKey);
  const activeCouponKeyRef = useRef(currentCouponKey);

  // Synchronize cart & coupon whenever the authenticated user changes (login, logout, switch account, register)
  useEffect(() => {
    const newCartKey = getCartStorageKey(userId);
    const newCouponKey = getCouponStorageKey(userId);
    activeCartKeyRef.current = newCartKey;
    activeCouponKeyRef.current = newCouponKey;

    const savedCart = localStorage.getItem(newCartKey);
    setCart(savedCart ? JSON.parse(savedCart) : []);

    const savedCoupon = localStorage.getItem(newCouponKey);
    setAppliedCoupon(savedCoupon ? JSON.parse(savedCoupon) : null);
  }, [userId]);

  // Persist cart items for the active user key
  useEffect(() => {
    localStorage.setItem(activeCartKeyRef.current, JSON.stringify(cart));
  }, [cart, userId]);

  // Persist applied coupon for the active user key
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(activeCouponKeyRef.current, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(activeCouponKeyRef.current);
    }
  }, [appliedCoupon, userId]);

  const itemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal <= 0) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      const disc = (subtotal * appliedCoupon.discountValue) / 100;
      return appliedCoupon.maxDiscount ? Math.min(disc, appliedCoupon.maxDiscount) : disc;
    }
    return Math.min(appliedCoupon.discountValue, subtotal);
  }, [appliedCoupon, subtotal]);

  const freeShippingThreshold = settings.freeShippingThreshold || 150;

  const freeShippingProgress = useMemo(() => {
    if (subtotal >= freeShippingThreshold) return 100;
    return Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  }, [subtotal, freeShippingThreshold]);

  const amountNeededForFreeShipping = useMemo(() => {
    return Math.max(0, freeShippingThreshold - subtotal);
  }, [subtotal, freeShippingThreshold]);

  const shippingCost = useMemo(() => {
    if (subtotal === 0) return 0;
    if (shippingMethod.id === 'ship-std' && subtotal >= freeShippingThreshold) {
      return 0;
    }
    return shippingMethod.price;
  }, [subtotal, shippingMethod, freeShippingThreshold]);

  const tax = useMemo(() => {
    if (subtotal === 0) return 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    return Number(((taxableAmount * settings.taxRate) / 100).toFixed(2));
  }, [subtotal, discount, settings.taxRate]);

  const total = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal - discount + shippingCost + tax);
  }, [subtotal, discount, shippingCost, tax]);

  const generateVariantKey = (variant?: SelectedVariant): string => {
    if (!variant) return 'default';
    return `${variant.size || ''}_${variant.color?.name || ''}_${variant.material || ''}`;
  };

  const addItem = (
    product: Product,
    quantity: number = 1,
    selectedVariant: SelectedVariant = {}
  ) => {
    const variantKey = generateVariantKey(selectedVariant);
    const instanceId = `${product.id}-${variantKey}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === instanceId);
      if (existing) {
        return prev.map(item =>
          item.id === instanceId
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: instanceId,
          productId: product.id,
          product,
          quantity: Math.min(product.stock, quantity),
          selectedVariant,
          unitPrice: product.price
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const maxStock = item.product.stock || 99;
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code: string): { success: boolean; message: string } => {
    const result = validateCoupon(code, subtotal);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  };

  const removeCouponCode = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        discount,
        appliedCoupon,
        shippingMethod,
        shippingCost,
        tax,
        total,
        freeShippingThreshold,
        freeShippingProgress,
        amountNeededForFreeShipping,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCouponCode,
        removeCouponCode,
        setShippingMethod
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
