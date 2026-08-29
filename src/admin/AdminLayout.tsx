import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  BarChart3,
  Tag,
  Star,
  Truck,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
  Bell,
  Search,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { AdminView } from '../types';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

interface AdminLayoutProps {
  currentView: AdminView;
  onNavigate: (view: AdminView) => void;
  onReturnToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentView,
  onNavigate,
  onReturnToStore,
  children
}) => {
  const { currentUser, logout, hasPermission } = useAuth();
  const { orders, products, reviews, blogs } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingOrdersCount = orders.filter(o => o.status === 'new' || o.status === 'confirmed').length;
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
    { id: 'products', label: 'Products', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined, badgeColor: 'amber', permission: 'manage_products' },
    { id: 'categories', label: 'Categories', icon: FolderTree, permission: 'manage_categories' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined, badgeColor: 'emerald', permission: 'manage_orders' },
    { id: 'customers', label: 'Customers', icon: Users, permission: 'manage_customers' },
    { id: 'blogs', label: 'Journal & Stories', icon: BookOpen, badge: `${blogs.length}`, badgeColor: 'zinc', permission: 'manage_blogs' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, permission: 'view_analytics' },
    { id: 'coupons', label: 'Coupons & Promos', icon: Tag, permission: 'manage_coupons' },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: pendingReviewsCount > 0 ? `${pendingReviewsCount}` : undefined, badgeColor: 'purple', permission: 'manage_reviews' },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck, permission: 'manage_shipping' },
    { id: 'settings', label: 'Store Settings', icon: Settings, permission: 'manage_settings' },
    { id: 'admins', label: 'Staff & Security', icon: Shield, permission: 'manage_admins' }
  ];

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row text-zinc-900 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-zinc-950 text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif font-bold text-base tracking-wider text-white">
            AURA <span className="text-[10px] font-sans font-normal text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded ml-1">ADMIN</span>
          </span>
        </div>

        <button
          onClick={onReturnToStore}
          className="text-xs bg-zinc-800 text-zinc-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold"
        >
          <span>Store</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sidebar Backdrop (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-zinc-950 text-zinc-300 flex flex-col justify-between border-r border-zinc-850 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Storefront Switch */}
        <div className="p-5 border-b border-zinc-850">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold tracking-widest text-white">
                AURA
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded">
                OPS
              </span>
            </div>

            <button
              onClick={onReturnToStore}
              className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group"
              title="Return to customer shop"
            >
              <span>Storefront</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Current Admin User Identity Card */}
          <div className="p-2.5 bg-zinc-900/80 rounded-xl border border-zinc-800 flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-lg object-cover border border-zinc-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-amber-400 font-mono capitalize">
                {currentUser?.role} Mode
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isAllowed = hasPermission(item.permission);

            if (!isAllowed) return null;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as AdminView);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-zinc-950 shadow-sm font-bold'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-zinc-950 text-white'
                        : item.badgeColor === 'amber'
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'bg-emerald-400/20 text-emerald-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-zinc-850 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>System Status</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Operational
            </span>
          </div>

          <button
            onClick={logout}
            className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Control Bar */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-zinc-200 px-8 py-4 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Admin Suite
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
            <h1 className="text-sm font-bold text-zinc-950 capitalize">
              {currentView.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Storefront Link */}
            <button
              onClick={onReturnToStore}
              className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>View Customer Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <div className="p-4 sm:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
