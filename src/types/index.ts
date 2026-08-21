export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ProductVariantColor {
  name: string;
  hex: string;
  image?: string;
  inStock?: boolean;
}

export interface ProductVariant {
  sizes?: string[];
  colors?: ProductVariantColor[];
  materials?: string[];
}

export interface ProductSpecification {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  variants: ProductVariant;
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  status: ProductStatus;
  specifications: ProductSpecification;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName?: string;
  productCount: number;
  isFeatured?: boolean;
  subcategories: string[];
}

export interface SelectedVariant {
  size?: string;
  color?: ProductVariantColor;
  material?: string;
}

export interface CartItem {
  id: string; // unique item instance id (productId + variant combo)
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant: SelectedVariant;
  unitPrice: number;
}

export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethodType = 'credit_card' | 'paypal' | 'apple_pay' | 'cash_on_delivery';

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  price: number;
  freeThreshold?: number;
}

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id?: string;
    name: string;
    email: string;
    phone: string;
  };
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: {
    type: PaymentMethodType;
    last4?: string;
    brand?: string;
  };
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCost: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'customer' | 'admin' | 'super_admin' | 'manager' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
  totalSpent?: number;
  orderCount?: number;
  tier?: string;
  notes?: string;
  status: 'active' | 'blocked';
}

export type Customer = User;

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
  orderNumber?: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  reply?: {
    text: string;
    repliedAt: string;
    repliedBy: string;
  };
}

export type ReviewEligibilityReason =
  | 'guest'
  | 'not_purchased'
  | 'not_delivered'
  | 'already_reviewed'
  | 'can_review';

export interface ReviewEligibility {
  eligible: boolean;
  reason: ReviewEligibilityReason;
  order?: Order;
  existingReview?: Review;
  orderStatus?: OrderStatus;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  expiresAt?: string;
  usageLimit?: number;
  usageCount: number;
  usedCount?: number;
  isActive: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: 'product' | 'order' | 'category' | 'coupon' | 'review' | 'customer' | 'settings' | 'auth';
  entityId?: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface CurrencyConfig {
  code: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY';
  symbol: string;
  rate: number; // relative to USD
}

export interface StoreSettings {
  storeName: string;
  tagline?: string;
  storeTagline?: string;
  announcementBanner?: string;
  currency: CurrencyConfig | string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  taxRate: number; // percentage, e.g., 8.5 for 8.5%
  freeShippingThreshold: number;
  orderAutoConfirm?: boolean;
  lowStockAlertThreshold?: number;
  maintenanceMode?: boolean;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface FilterState {
  category: string;
  subcategory: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'rating' | 'newest';
  rating: number | null;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  selectedColors: string[];
  selectedSizes: string[];
  selectedBrand: string;
}

export type StorefrontView =
  | 'home'
  | 'shop'
  | 'categories'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'order-tracking'
  | 'account'
  | 'wishlist'
  | 'about'
  | 'contact';

export type AdminView =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'reports'
  | 'coupons'
  | 'reviews'
  | 'shipping'
  | 'settings'
  | 'admins'
  | 'roles'
  | 'logs';
