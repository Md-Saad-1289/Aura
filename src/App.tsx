import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { StorefrontView, AdminView, Product, Order } from './types';
import { Header, Footer, SearchModal, AuthModal, CartDrawer, QuickViewModal } from './common';

// Frontend / Customer Pages
import {
  HomePage,
  ShopPage,
  CategoriesPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  OrderConfirmationPage,
  OrderTrackingPage,
  AccountPage,
  WishlistPage,
  AboutPage,
  ContactPage
} from './frontend';

// Admin Suite
import {
  AdminLayout,
  DashboardOverview,
  ProductManagement,
  CategoryManagement,
  OrderManagement,
  CustomerManagement,
  ReportsAnalytics,
  CouponManagement,
  ReviewManagement,
  ShippingManagement,
  SettingsManagement,
  AdminUserManagement
} from './admin';

const MainApp: React.FC = () => {
  // Check if environment or URL specifies admin mode
  const isEnvAdmin = (import.meta as any).env?.VITE_APP_MODE === 'admin';
  const getInitialMode = (): 'customer' | 'admin' => {
    if (isEnvAdmin) return 'admin';
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (search.get('mode') === 'admin' || search.get('app') === 'admin' || pathname.startsWith('/admin') || hash.includes('admin')) {
        return 'admin';
      }
    }
    return 'customer';
  };

  const getInitialStoreView = (): StorefrontView => {
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      const view = search.get('view') as StorefrontView;
      const validViews: StorefrontView[] = [
        'home', 'shop', 'categories', 'product-detail', 'cart', 'checkout',
        'order-confirmation', 'order-tracking', 'account', 'about', 'contact'
      ];
      if (view && validViews.includes(view)) return view;
    }
    return 'home';
  };

  const getInitialAdminView = (): AdminView => {
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      const view = search.get('admin_view') as AdminView;
      const validViews: AdminView[] = [
        'dashboard', 'products', 'categories', 'orders', 'customers',
        'reports', 'coupons', 'reviews', 'shipping', 'settings', 'admins'
      ];
      if (view && validViews.includes(view)) return view;
    }
    return 'dashboard';
  };

  const [mode, setMode] = useState<'customer' | 'admin'>(getInitialMode);
  const [storeView, setStoreView] = useState<StorefrontView>(getInitialStoreView);
  const [adminView, setAdminView] = useState<AdminView>(getInitialAdminView);

  // Navigation Parameters
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('category') || undefined;
    }
    return undefined;
  });
  const [activeProductId, setActiveProductId] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('product') || undefined;
    }
    return undefined;
  });
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('track') || undefined;
    }
    return undefined;
  });

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Scroll to top upon route change & optionally sync URL
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [storeView, adminView, mode]);

  const handleNavigateStorefront = (view: StorefrontView, categoryId?: string, productId?: string) => {
    setMode('customer');
    setStoreView(view);
    if (categoryId !== undefined) setActiveCategoryId(categoryId);
    if (productId !== undefined) setActiveProductId(productId);
  };

  const handleNavigateAdmin = (view: AdminView) => {
    setMode('admin');
    setAdminView(view);
  };

  const handleOrderPlaced = (order: Order) => {
    setActiveOrder(order);
    setStoreView('order-confirmation');
  };

  const handleTrackOrderFromHistory = (orderNumber: string) => {
    setTrackingOrderNumber(orderNumber);
    setStoreView('order-tracking');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col antialiased selection:bg-zinc-950 selection:text-white">
      {/* RENDER ADMIN OR CUSTOMER */}
      {mode === 'admin' ? (
        <AdminLayout
          currentView={adminView}
          onNavigate={(view) => setAdminView(view)}
          onReturnToStore={() => {
            setMode('customer');
            setStoreView('home');
          }}
        >
          {adminView === 'dashboard' && <DashboardOverview onNavigate={setAdminView} />}
          {adminView === 'products' && <ProductManagement />}
          {adminView === 'categories' && <CategoryManagement />}
          {adminView === 'orders' && <OrderManagement />}
          {adminView === 'customers' && <CustomerManagement />}
          {adminView === 'reports' && <ReportsAnalytics />}
          {adminView === 'coupons' && <CouponManagement />}
          {adminView === 'reviews' && <ReviewManagement />}
          {adminView === 'shipping' && <ShippingManagement />}
          {adminView === 'settings' && <SettingsManagement />}
          {adminView === 'admins' && <AdminUserManagement />}
        </AdminLayout>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Customer Header */}
          <Header
            currentView={storeView}
            onNavigate={handleNavigateStorefront}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            onSwitchToAdmin={() => handleNavigateAdmin('dashboard')}
          />

          {/* Customer Page Body */}
          <main className="flex-1">
            {storeView === 'home' && (
              <HomePage
                onNavigate={handleNavigateStorefront}
                onQuickView={(product) => setQuickViewProduct(product)}
              />
            )}

            {storeView === 'shop' && (
              <ShopPage
                initialCategory={activeCategoryId}
                onNavigate={handleNavigateStorefront}
                onQuickView={(product) => setQuickViewProduct(product)}
              />
            )}

            {storeView === 'categories' && (
              <CategoriesPage onNavigate={handleNavigateStorefront} />
            )}

            {storeView === 'product-detail' && (
              <ProductDetailPage
                productId={activeProductId}
                onNavigate={handleNavigateStorefront}
                onQuickView={(product) => setQuickViewProduct(product)}
              />
            )}

            {storeView === 'cart' && (
              <CartPage onNavigate={handleNavigateStorefront} />
            )}

            {storeView === 'checkout' && (
              <CheckoutPage
                onNavigate={handleNavigateStorefront}
                onOrderPlaced={handleOrderPlaced}
              />
            )}

            {storeView === 'order-confirmation' && (
              <OrderConfirmationPage
                order={activeOrder}
                onNavigate={handleNavigateStorefront}
              />
            )}

            {storeView === 'order-tracking' && (
              <OrderTrackingPage
                initialOrderNumber={trackingOrderNumber}
                onNavigate={handleNavigateStorefront}
              />
            )}

            {storeView === 'account' && (
              <AccountPage
                onNavigate={handleNavigateStorefront}
                onTrackOrder={handleTrackOrderFromHistory}
                onSwitchToAdmin={() => handleNavigateAdmin('dashboard')}
              />
            )}

            {storeView === 'wishlist' && (
              <WishlistPage
                onNavigate={handleNavigateStorefront}
                onQuickView={(product) => setQuickViewProduct(product)}
              />
            )}

            {storeView === 'about' && (
              <AboutPage onNavigate={handleNavigateStorefront} />
            )}

            {storeView === 'contact' && (
              <ContactPage />
            )}
          </main>

          {/* Customer Footer */}
          <Footer
            onNavigate={handleNavigateStorefront}
            onSwitchToAdmin={() => handleNavigateAdmin('dashboard')}
          />
        </div>
      )}

      {/* Global Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(productId) => {
          setIsSearchOpen(false);
          handleNavigateStorefront('product-detail', undefined, productId);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSwitchToAdmin={() => handleNavigateAdmin('dashboard')}
      />

      <CartDrawer
        onNavigate={handleNavigateStorefront}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          handleNavigateStorefront('checkout');
        }}
        onViewCart={() => {
          setIsCartOpen(false);
          handleNavigateStorefront('cart');
        }}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewDetails={(productId) => {
          setQuickViewProduct(null);
          handleNavigateStorefront('product-detail', undefined, productId);
        }}
      />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </StoreProvider>
  );
}

export default App;
