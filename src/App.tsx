import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { StorefrontView, AdminView, Product, Order } from './types';
import { DemoSwitcherBar } from './components/common/DemoSwitcherBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { AuthModal } from './components/common/AuthModal';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';

// Customer Pages
import { HomePage } from './components/customer/HomePage';
import { ShopPage } from './components/customer/ShopPage';
import { CategoriesPage } from './components/customer/CategoriesPage';
import { ProductDetailPage } from './components/customer/ProductDetailPage';
import { CartPage } from './components/customer/CartPage';
import { CheckoutPage } from './components/customer/CheckoutPage';
import { OrderConfirmationPage } from './components/customer/OrderConfirmationPage';
import { OrderTrackingPage } from './components/customer/OrderTrackingPage';
import { AccountPage } from './components/customer/AccountPage';
import { AboutPage } from './components/customer/AboutPage';
import { ContactPage } from './components/customer/ContactPage';

// Admin Suite
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { ProductManagement } from './components/admin/ProductManagement';
import { CategoryManagement } from './components/admin/CategoryManagement';
import { OrderManagement } from './components/admin/OrderManagement';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { ReportsAnalytics } from './components/admin/ReportsAnalytics';
import { CouponManagement } from './components/admin/CouponManagement';
import { ReviewManagement } from './components/admin/ReviewManagement';
import { ShippingManagement } from './components/admin/ShippingManagement';
import { SettingsManagement } from './components/admin/SettingsManagement';
import { AdminUserManagement } from './components/admin/AdminUserManagement';

const MainApp: React.FC = () => {
  const [mode, setMode] = useState<'customer' | 'admin'>('customer');
  const [storeView, setStoreView] = useState<StorefrontView>('home');
  const [adminView, setAdminView] = useState<AdminView>('dashboard');

  // Navigation Parameters
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(undefined);
  const [activeProductId, setActiveProductId] = useState<string | undefined>(undefined);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string | undefined>(undefined);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Scroll to top upon route change
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
      {/* Top Interactive Demo Switcher Bar */}
      <DemoSwitcherBar
        mode={mode}
        onSwitchMode={(newMode) => {
          setMode(newMode);
          if (newMode === 'admin') {
            setAdminView('dashboard');
          } else {
            setStoreView('home');
          }
        }}
      />

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
