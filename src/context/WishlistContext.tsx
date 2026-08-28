import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const getWishlistStorageKey = (userId?: string) => {
  return userId ? `aura_wishlist_user_${userId}` : 'aura_wishlist_guest';
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const currentKey = getWishlistStorageKey(userId);

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem(currentKey);
    return saved ? JSON.parse(saved) : [];
  });

  const activeKeyRef = useRef(currentKey);

  // Synchronize when the authenticated user changes (login, logout, switch account, register)
  useEffect(() => {
    const newKey = getWishlistStorageKey(userId);
    activeKeyRef.current = newKey;
    const saved = localStorage.getItem(newKey);
    setWishlist(saved ? JSON.parse(saved) : []);
  }, [userId]);

  // Persist items for the active user key
  useEffect(() => {
    localStorage.setItem(activeKeyRef.current, JSON.stringify(wishlist));
  }, [wishlist, userId]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.id === productId);
  };

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlist(prev => [product, ...prev]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

