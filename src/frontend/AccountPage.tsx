import React, { useState } from 'react';
import {
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Truck,
  Eye,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Award,
  Star,
  Sparkles,
  X,
  Lock,
  PackageCheck,
  Check,
  Camera,
  Upload,
  CreditCard,
  Bell,
  Globe,
  Sliders,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Address, Order, Product, StorefrontView } from '../types';
import { AvatarSelectorModal, PRESET_AVATARS } from '../common';

interface AccountPageProps {
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
  onTrackOrder: (orderNumber: string) => void;
  onSwitchToAdmin?: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, onTrackOrder, onSwitchToAdmin }) => {
  const { currentUser, isAuthenticated, logout, updateUserProfile, hasPermission } = useAuth();
  const { orders, reviews, addReview, checkReviewEligibility, formatPrice } = useStore();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'reviews' | 'settings'>('orders');

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Edit Profile Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.notes || 'Collector of bespoke acoustic engineering & architecture artifacts.');
  const [preferredCurrency, setPreferredCurrency] = useState('USD ($)');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [vipDrops, setVipDrops] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false
  });

  // Review Modal State
  const [reviewModalData, setReviewModalData] = useState<{
    product: Product;
    order: Order;
  } | null>(null);
  const [modalRating, setModalRating] = useState(5);
  const [modalTitle, setModalTitle] = useState('');
  const [modalComment, setModalComment] = useState('');
  const [modalSubmitted, setModalSubmitted] = useState(false);

  const handleOpenReviewModal = (product: Product, order: Order) => {
    setReviewModalData({ product, order });
    setModalRating(5);
    setModalTitle('');
    setModalComment('');
    setModalSubmitted(false);
  };

  const handleModalReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalData || !currentUser) return;
    if (!modalTitle.trim() || !modalComment.trim()) return;

    addReview({
      productId: reviewModalData.product.id,
      productName: reviewModalData.product.name,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: modalRating,
      title: modalTitle.trim(),
      comment: modalComment.trim(),
      isVerifiedBuyer: true,
      orderNumber: reviewModalData.order.orderNumber
    });

    setModalSubmitted(true);
    setTimeout(() => {
      setModalSubmitted(false);
      setReviewModalData(null);
    }, 2000);
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-5">
        <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto text-zinc-400 shadow-xs border border-zinc-200">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-serif font-bold text-zinc-950">Atelier Account Required</h2>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            Please sign in to access your bespoke orders, curated wishlist, delivery tracking, and personal settings.
          </p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  // Filter orders for this user or show store sample orders
  const userOrders = orders.filter(
    o => o.customer.id === currentUser.id || o.customer.email.toLowerCase() === currentUser.email.toLowerCase()
  );
  const displayOrders = userOrders.length > 0 ? userOrders : orders.slice(0, 3);

  // User reviews
  const userReviews = reviews.filter(
    r => r.userId === currentUser.id || r.userName.toLowerCase() === currentUser.name.toLowerCase()
  );

  // Total lifetime spend calculation
  const totalLifetimeSpent = displayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      notes: bio
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleAvatarChange = (avatarUrl: string) => {
    updateUserProfile({ avatar: avatarUrl });
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const currentAddresses = currentUser.addresses || [];
    const updated = [...currentAddresses, newAddress];
    updateUserProfile({ addresses: updated });
    setShowAddressModal(false);
    setNewAddress({
      fullName: currentUser.name,
      email: currentUser.email,
      phone: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      isDefault: false
    });
  };

  const handleDeleteAddress = (index: number) => {
    const currentAddresses = currentUser.addresses || [];
    const updated = currentAddresses.filter((_, idx) => idx !== index);
    updateUserProfile({ addresses: updated });
  };

  const handleSetDefaultAddress = (index: number) => {
    const currentAddresses = (currentUser.addresses || []).map((addr, idx) => ({
      ...addr,
      isDefault: idx === index
    }));
    updateUserProfile({ addresses: currentAddresses });
  };

  const currentAvatarSrc = currentUser.avatar || PRESET_AVATARS[0].url;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. PROFESSIONAL HERO PROFILE BANNER */}
      <div className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-10 border border-zinc-800/80 shadow-2xl overflow-hidden">
        {/* Subtle Luxury Pattern Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-zinc-800/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Avatar & Core Profile Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Interactive Avatar with Camera Trigger */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-zinc-700/80 ring-4 ring-white/5 shadow-2xl bg-zinc-850">
                <img
                  src={currentAvatarSrc}
                  alt={currentUser.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Quick Change Avatar Overlay Button */}
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all cursor-pointer backdrop-blur-2xs"
                title="Change Profile Photo"
              >
                <Camera className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-200">Change</span>
              </button>

              {/* Floating Camera Badge */}
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-xl shadow-md border-2 border-zinc-950 transition-transform active:scale-95"
                title="Choose new avatar or upload photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Identity Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>
                    {currentUser.role === 'customer' ? 'Atelier Noir Member' : currentUser.role.toUpperCase()}
                  </span>
                </span>
              </div>

              <p className="text-xs text-zinc-400 font-mono">{currentUser.email}</p>

              <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-0.5">
                <span>Member since {new Date(currentUser.createdAt || '2024-01-01').toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Verified Atelier Account</span>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-xl text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Photo</span>
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Stat Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-zinc-800/80">
          <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
              Orders Placed
            </span>
            <p className="text-lg font-serif font-bold text-zinc-100 mt-0.5">
              {displayOrders.length}
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
              Lifetime Value
            </span>
            <p className="text-lg font-serif font-bold text-amber-300 mt-0.5">
              {formatPrice(totalLifetimeSpent)}
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
              Wishlist Items
            </span>
            <p className="text-lg font-serif font-bold text-zinc-100 mt-0.5">
              {wishlist.length}
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-3.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
              Verified Reviews
            </span>
            <p className="text-lg font-serif font-bold text-zinc-100 mt-0.5">
              {userReviews.length}
            </p>
          </div>
        </div>
      </div>

      {/* 2. TABS & MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Sidebar (3 Cols) */}
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: 'orders', label: 'Order History', icon: Package, count: displayOrders.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: currentUser.addresses?.length || 1 },
            { id: 'wishlist', label: 'Wishlist Artifacts', icon: Heart, count: wishlist.length },
            { id: 'reviews', label: 'Verified Reviews', icon: Star, count: userReviews.length },
            { id: 'settings', label: 'Profile & Security', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-xs font-bold'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Tab Content (9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: Orders History */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <div>
                  <h2 className="text-base font-serif font-bold text-zinc-950">
                    Your Orders & Consignments
                  </h2>
                  <p className="text-xs text-zinc-500">Track shipments, download invoices, and write reviews.</p>
                </div>
              </div>

              {displayOrders.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-3">
                  <Package className="w-8 h-8 text-zinc-400 mx-auto" />
                  <p className="text-xs text-zinc-500">No orders placed yet.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-5 py-2 bg-zinc-950 text-white rounded-xl text-xs font-semibold"
                  >
                    Explore Collections
                  </button>
                </div>
              ) : (
                displayOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-2xs hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-150">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-950">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : ord.status === 'shipped'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          Placed on{' '}
                          {new Date(ord.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onTrackOrder(ord.orderNumber)}
                          className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Delivery</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="divide-y divide-zinc-100">
                      {ord.items.map((item) => {
                        const hasReviewed = reviews.some(
                          (r) =>
                            (r.productId === item.productId || r.productId === item.product.id) &&
                            (r.userId === currentUser.id || r.userName.toLowerCase() === currentUser.name.toLowerCase())
                        );

                        return (
                          <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-12 h-12 rounded-xl object-cover bg-zinc-100 flex-shrink-0 cursor-pointer border border-zinc-200"
                                onClick={() => onNavigate('product-detail', undefined, item.productId || item.product.id)}
                              />
                              <div>
                                <button
                                  onClick={() => onNavigate('product-detail', undefined, item.productId || item.product.id)}
                                  className="text-xs font-semibold text-zinc-900 hover:underline text-left truncate max-w-[220px] sm:max-w-xs block"
                                >
                                  {item.product.name}
                                </button>
                                <p className="text-[10px] text-zinc-400">
                                  Qty: {item.quantity}{' '}
                                  {item.selectedVariant.color?.name ? `• ${item.selectedVariant.color.name}` : ''}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <span className="text-xs font-bold text-zinc-900">
                                {formatPrice(item.unitPrice * item.quantity)}
                              </span>

                              {ord.status === 'delivered' ? (
                                hasReviewed ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Reviewed</span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleOpenReviewModal(item.product, ord)}
                                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                                  >
                                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                                    <span>Review Product</span>
                                  </button>
                                )
                              ) : (
                                <span className="text-[10px] text-zinc-400 flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-150">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Review unlocks upon delivery</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-zinc-150 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">
                        Total Amount Paid:{' '}
                        <strong className="text-zinc-950 font-bold">{formatPrice(ord.total)}</strong>
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Paid via {ord.paymentMethod.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <div>
                  <h2 className="text-base font-serif font-bold text-zinc-950">
                    Saved Addresses & Delivery Hubs
                  </h2>
                  <p className="text-xs text-zinc-500">Manage multiple addresses for effortless 1-click checkout.</p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(currentUser.addresses || []).map((addr, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 ${
                      addr.isDefault
                        ? 'bg-zinc-50/80 border-zinc-950/40 shadow-xs'
                        : 'bg-white border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-zinc-900">{addr.fullName}</span>
                        {addr.isDefault ? (
                          <span className="text-[10px] bg-zinc-950 text-white px-2.5 py-0.5 rounded-full font-semibold uppercase">
                            Default Address
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultAddress(idx)}
                            className="text-[10px] text-zinc-500 hover:text-zinc-900 font-semibold"
                          >
                            Set as default
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600">{addr.street}</p>
                      {addr.apartment && <p className="text-xs text-zinc-600">{addr.apartment}</p>}
                      <p className="text-xs text-zinc-600">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-xs text-zinc-600">{addr.country}</p>
                      {addr.phone && <p className="text-[11px] text-zinc-400 mt-2 font-mono">{addr.phone}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-150">
                      <button
                        onClick={() => handleDeleteAddress(idx)}
                        className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <div>
                  <h2 className="text-base font-serif font-bold text-zinc-950">
                    Your Saved Wishlist ({wishlist.length})
                  </h2>
                  <p className="text-xs text-zinc-500">Curated artifacts saved for future acquisition.</p>
                </div>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-3">
                  <Heart className="w-8 h-8 text-zinc-300 mx-auto" />
                  <p className="text-xs text-zinc-500">Your wishlist is currently empty.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-850"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 bg-white rounded-2xl border border-zinc-200 flex gap-4 items-center justify-between shadow-2xs hover:border-zinc-300 transition-colors"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onClick={() => onNavigate('product-detail', undefined, product.id)}
                        className="w-16 h-16 rounded-xl object-cover bg-zinc-100 cursor-pointer border border-zinc-150"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate">{product.name}</p>
                        <p className="text-xs font-bold text-zinc-950 mt-0.5">{formatPrice(product.price)}</p>
                        <button
                          onClick={() => {
                            addItem(product, 1);
                            removeFromWishlist(product.id);
                          }}
                          className="mt-2 px-3 py-1 bg-zinc-950 text-white text-[11px] font-semibold rounded-lg hover:bg-zinc-800 shadow-2xs"
                        >
                          Move to Bag
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Reviews Written */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <div>
                  <h2 className="text-base font-serif font-bold text-zinc-950">
                    Your Verified Reviews & Impressions ({userReviews.length})
                  </h2>
                  <p className="text-xs text-zinc-500">Collector feedbacks published across the catalog.</p>
                </div>
              </div>

              {userReviews.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-3">
                  <Star className="w-8 h-8 text-zinc-300 mx-auto" />
                  <p className="text-xs text-zinc-500">You haven't reviewed any delivered products yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 bg-white rounded-2xl border border-zinc-200 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-zinc-950">
                          {rev.productName || 'Aura Artifact'}
                        </span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-current text-amber-400' : 'text-zinc-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="text-xs font-semibold text-zinc-900">{rev.title}</h4>
                      <p className="text-xs text-zinc-600 leading-relaxed">{rev.comment}</p>
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-zinc-400">
                        <span>Verified Buyer</span>
                        <span>•</span>
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Profile Settings & Security */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Profile Photo Manager Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-5">
                <div>
                  <h2 className="text-base font-serif font-bold text-zinc-950">
                    Profile Avatar & Identity
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Customize your personal avatar or upload your photo from your device.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <div className="flex items-center gap-4">
                    <img
                      src={currentAvatarSrc}
                      alt={currentUser.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-900/40 shadow-sm"
                    />
                    <div>
                      <p className="text-xs font-bold text-zinc-950">{currentUser.name}</p>
                      <p className="text-[11px] text-zinc-500">Custom Avatar / Atelier Preset</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="px-4 py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>Choose Avatar / Upload</span>
                    </button>
                  </div>
                </div>

                {/* Quick 1-Click Presets Strip */}
                <div className="space-y-2 pt-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Quick Preset Select
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {PRESET_AVATARS.slice(0, 6).map((preset) => {
                      const isCurrent = currentUser.avatar === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleAvatarChange(preset.url)}
                          className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-transform hover:scale-105 ${
                            isCurrent ? 'border-zinc-950 ring-2 ring-zinc-950/20' : 'border-zinc-200'
                          }`}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          {isCurrent && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Personal Information Form */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-serif font-bold text-zinc-950">
                    Personal Information
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Update your display name, contact phone, and atelier bio.
                  </p>
                </div>

                {savedSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Your profile information has been successfully updated!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Email Address (Verified)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-500 cursor-not-allowed font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Primary Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Collector Bio / Notes
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Brief note about your design preference..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>

              {/* Password & Security Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-serif font-bold text-zinc-950">
                    Security & Password
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Ensure your account is using a secure password.
                  </p>
                </div>

                {passwordSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Password successfully updated!</span>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-800 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-800 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. AVATAR SELECTOR MODAL (PRESETS + UPLOAD + URL) */}
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={currentUser.avatar}
        userName={currentUser.name}
        onSave={handleAvatarChange}
      />

      {/* 4. ADD ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-150">
              <h3 className="text-base font-serif font-bold text-zinc-950">Add Shipping Destination</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2.5 bg-zinc-100 text-zinc-700 rounded-xl text-xs font-semibold hover:bg-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-850 shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. REVIEW DELIVERED ARTIFACT MODAL */}
      {reviewModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-zinc-200 shadow-2xl relative">
            <button
              onClick={() => setReviewModalData(null)}
              className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pr-6">
              <img
                src={reviewModalData.product.images[0]}
                alt={reviewModalData.product.name}
                className="w-16 h-16 rounded-2xl object-cover bg-zinc-100 flex-shrink-0 border border-zinc-200"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                  <PackageCheck className="w-3 h-3 text-emerald-600" />
                  <span>Delivered Purchase • {reviewModalData.order.orderNumber}</span>
                </div>
                <h3 className="text-base font-serif font-bold text-zinc-950 leading-tight">
                  {reviewModalData.product.name}
                </h3>
                <p className="text-xs text-zinc-500">
                  Share your impressions as a verified owner.
                </p>
              </div>
            </div>

            {modalSubmitted ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold">Thank you for your review!</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Your verified feedback has been published.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleModalReviewSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Rating
                  </label>
                  <div className="flex gap-2 text-amber-400 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setModalRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= modalRating ? 'fill-current text-amber-400' : 'text-zinc-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Impeccable acoustic depth and titanium finish"
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Your Experience
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the quality, material, tactile finish, and daily performance..."
                    value={modalComment}
                    onChange={(e) => setModalComment(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalData(null)}
                    className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Publish Verified Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
