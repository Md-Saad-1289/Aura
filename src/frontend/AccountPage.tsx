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
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Address, Order, Product, StorefrontView } from '../types';

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

  const isAdminUser = currentUser?.role === 'super_admin' || currentUser?.role === 'manager';

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'settings'>('orders');

  // Edit Profile Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-zinc-950">Customer Sign In Required</h2>
        <p className="text-xs text-zinc-500">
          Please sign in to access your order history, delivery tracking, and saved addresses.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  // Filter orders for this user or show all mock demo orders if customer matches
  const userOrders = orders.filter(
    o => o.customer.id === currentUser.id || o.customer.email.toLowerCase() === currentUser.email.toLowerCase()
  );
  // Fallback to demo orders if empty to showcase the polished UI
  const displayOrders = userOrders.length > 0 ? userOrders : orders.slice(0, 3);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Account Hero Banner */}
      <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-700 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">
                  {currentUser.name}
                </h1>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {currentUser.role === 'customer' ? 'Atelier Collector' : currentUser.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{currentUser.email}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Member since {new Date(currentUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={logout}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs & Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Sidebar (3 Cols) */}
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: 'orders', label: 'Order History', icon: Package, count: displayOrders.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: currentUser.addresses?.length || 1 },
            { id: 'wishlist', label: 'Wishlist Artifacts', icon: Heart, count: wishlist.length },
            { id: 'settings', label: 'Account Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-200 text-zinc-700'}`}>
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
                <h2 className="text-base font-serif font-bold text-zinc-950">
                  Your Orders & Consignments ({displayOrders.length})
                </h2>
              </div>

              {displayOrders.length === 0 ? (
                <div className="text-center py-12 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-3">
                  <Package className="w-8 h-8 text-zinc-400 mx-auto" />
                  <p className="text-xs text-zinc-500">No orders placed yet.</p>
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
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ord.status === 'shipped'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          Placed on {new Date(ord.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onTrackOrder(ord.orderNumber)}
                          className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
                                className="w-12 h-12 rounded-lg object-cover bg-zinc-100 flex-shrink-0 cursor-pointer"
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
                                  Qty: {item.quantity} {item.selectedVariant.color?.name ? `• ${item.selectedVariant.color.name}` : ''}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <span className="text-xs font-bold text-zinc-900">
                                {formatPrice(item.unitPrice * item.quantity)}
                              </span>

                              {/* Review Action Trigger according to delivery status */}
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
                                  <span>Review unlocks after delivery</span>
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
                    Saved Addresses & Destinations
                  </h2>
                  <p className="text-xs text-zinc-500">Manage multiple delivery locations.</p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(currentUser.addresses || []).map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 relative flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-zinc-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-zinc-950 text-white px-2 py-0.5 rounded font-semibold uppercase">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600">{addr.street}</p>
                      {addr.apartment && <p className="text-xs text-zinc-600">{addr.apartment}</p>}
                      <p className="text-xs text-zinc-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p className="text-xs text-zinc-600">{addr.country}</p>
                      {addr.phone && <p className="text-[11px] text-zinc-400 mt-2">{addr.phone}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200/80">
                      <button
                        onClick={() => handleDeleteAddress(idx)}
                        className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50"
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
                <h2 className="text-base font-serif font-bold text-zinc-950">
                  Your Saved Wishlist ({wishlist.length})
                </h2>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-3">
                  <Heart className="w-8 h-8 text-zinc-300 mx-auto" />
                  <p className="text-xs text-zinc-500">Your wishlist is currently empty.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 bg-white rounded-2xl border border-zinc-200 flex gap-4 items-center justify-between shadow-2xs"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onClick={() => onNavigate('product-detail', undefined, product.id)}
                        className="w-16 h-16 rounded-xl object-cover bg-zinc-100 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate">{product.name}</p>
                        <p className="text-xs font-bold text-zinc-950 mt-0.5">{formatPrice(product.price)}</p>
                        <button
                          onClick={() => {
                            addItem(product, 1);
                            removeFromWishlist(product.id);
                          }}
                          className="mt-1.5 px-3 py-1 bg-zinc-950 text-white text-[11px] font-semibold rounded-lg hover:bg-zinc-800"
                        >
                          Move to Bag
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Profile Settings */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
              <div className="pb-4 border-b border-zinc-200">
                <h2 className="text-base font-serif font-bold text-zinc-950">
                  Profile Information & Preferences
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Update your contact details and account security.
                </p>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Your profile changes have been successfully saved!</span>
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
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-500 cursor-not-allowed"
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
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="pt-4 border-t border-zinc-150">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-zinc-200 space-y-4">
            <h3 className="text-base font-serif font-bold text-zinc-950">Add Shipping Address</h3>

            <form onSubmit={handleSaveNewAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs"
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
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs"
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
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-semibold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Delivered Artifact Modal */}
      {reviewModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
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
                    placeholder="e.g. Impeccable craftsmanship and comfort"
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white"
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
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white"
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
