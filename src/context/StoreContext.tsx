import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Order,
  OrderStatus,
  User,
  Review,
  Coupon,
  ShippingMethod,
  StoreSettings,
  ActivityLog,
  PaymentStatus,
  CurrencyConfig,
  ReviewEligibility,
  BlogPost,
  BlogComment,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_USERS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_SHIPPING_METHODS,
  INITIAL_STORE_SETTINGS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_BLOG_POSTS,
} from '../data/initialData';
import { api } from '../services/api';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: User[];
  reviews: Review[];
  coupons: Coupon[];
  shippingMethods: ShippingMethod[];
  settings: StoreSettings;
  activityLogs: ActivityLog[];
  blogs: BlogPost[];
  currency: CurrencyConfig;
  setCurrency: (currency: CurrencyConfig) => void;
  formatPrice: (amount: number) => string;

  // Blog Actions
  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedAt' | 'likes' | 'comments' | 'views'>) => BlogPost;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  likeBlogPost: (id: string) => void;
  addBlogComment: (postId: string, comment: { userName: string; comment: string; userAvatar?: string }) => void;
  incrementBlogViews: (id: string) => void;

  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  restockProduct: (id: string, amount: number) => void;

  // Category Actions
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Order Actions
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, carrier?: string, note?: string) => void;
  updateOrderTracking: (orderId: string, trackingNumber: string, carrier?: string) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Customer Actions
  updateCustomerStatus: (customerId: string, status: 'active' | 'blocked') => void;
  updateCustomer: (customerId: string, updates: Partial<User>) => void;
  deleteCustomer: (customerId: string) => void;
  addCustomer: (customer: Omit<User, 'id' | 'createdAt'>) => User;

  // Coupon Actions
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => Coupon;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, subtotal: number) => { valid: boolean; coupon?: Coupon; discount: number; message: string };

  // Review Actions
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => Review;
  checkReviewEligibility: (productId: string, userId?: string, userEmail?: string) => ReviewEligibility;
  updateReviewStatus: (id: string, status: 'approved' | 'rejected') => void;
  replyToReview: (id: string, replyText: string, replierName: string) => void;
  deleteReview: (id: string) => void;

  // Shipping Methods
  updateShippingMethod: (id: string, updates: Partial<ShippingMethod>) => void;

  // Settings & System
  updateSettings: (updates: Partial<StoreSettings>) => void;
  resetToFactoryDefaults: () => void;
  logActivity: (action: string, entityType: ActivityLog['entityType'], details: string, entityId?: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'aura_store_products_v1',
  CATEGORIES: 'aura_store_categories_v1',
  ORDERS: 'aura_store_orders_v1',
  CUSTOMERS: 'aura_store_customers_v1',
  REVIEWS: 'aura_store_reviews_v1',
  COUPONS: 'aura_store_coupons_v1',
  SHIPPING: 'aura_store_shipping_v1',
  SETTINGS: 'aura_store_settings_v1',
  LOGS: 'aura_store_logs_v1',
  BLOGS: 'aura_store_blogs_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHIPPING);
    return saved ? JSON.parse(saved) : INITIAL_SHIPPING_METHODS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOGS);
    return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
  });

  const [currency, setCurrency] = useState<CurrencyConfig>(
    settings.currency && typeof settings.currency === 'object'
      ? settings.currency
      : INITIAL_STORE_SETTINGS.currency as CurrencyConfig
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHIPPING, JSON.stringify(shippingMethods));
  }, [shippingMethods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
  }, [blogs]);

  // Initial fetch from MongoDB backend
  useEffect(() => {
    const loadFromBackend = async () => {
      try {
        const [prodRes, catRes, ordRes, usrRes, revRes, cpnRes, setRes, actRes] =
          await Promise.allSettled([
            api.getProducts(),
            api.getCategories(),
            api.getOrders(),
            api.getUsers(),
            api.getReviews(),
            api.getCoupons(),
            api.getSettings(),
            api.getActivityLogs(),
          ]);

        if (prodRes.status === 'fulfilled' && prodRes.value.data?.length > 0) {
          setProducts(prodRes.value.data);
        }
        if (catRes.status === 'fulfilled' && catRes.value.data?.length > 0) {
          setCategories(catRes.value.data);
        }
        if (ordRes.status === 'fulfilled' && ordRes.value.data?.length > 0) {
          setOrders(ordRes.value.data);
        }
        if (usrRes.status === 'fulfilled' && usrRes.value.data?.length > 0) {
          setCustomers(usrRes.value.data);
        }
        if (revRes.status === 'fulfilled' && revRes.value.data?.length > 0) {
          setReviews(revRes.value.data);
        }
        if (cpnRes.status === 'fulfilled' && cpnRes.value.data?.length > 0) {
          setCoupons(cpnRes.value.data);
        }
        if (setRes.status === 'fulfilled' && setRes.value.data) {
          setSettings(setRes.value.data);
        }
        if (actRes.status === 'fulfilled' && actRes.value.data?.length > 0) {
          setActivityLogs(actRes.value.data);
        }
      } catch (err) {
        console.warn('Backend sync paused, operating in persistent cache mode:', err);
      }
    };

    loadFromBackend();
  }, []);

  // Log activity helper
  const logActivity = (
    action: string,
    entityType: ActivityLog['entityType'],
    details: string,
    entityId?: string
  ) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: 'usr-admin-1',
      userName: 'Elena Rostova',
      userRole: 'Super Admin',
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
      ip: '192.168.1.104',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const formatPrice = (amount: number): string => {
    const converted = amount * (currency.rate || 1.0);
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  // Product Methods
  const addProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === data.category ? { ...cat, productCount: cat.productCount + 1 } : cat
      )
    );

    api.createProduct(newProduct).catch(() => {});
    logActivity('Product Created', 'product', `Added new product "${newProduct.name}" (${newProduct.sku})`, newProduct.id);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, ...updates, updatedAt: new Date().toISOString() } : prod
      )
    );
    api.updateProduct(id, updates).catch(() => {});
    logActivity('Product Updated', 'product', `Updated product ID: ${id}`, id);
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
    if (product) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === product.category ? { ...cat, productCount: Math.max(0, cat.productCount - 1) } : cat
        )
      );
      logActivity('Product Deleted', 'product', `Deleted product "${product.name}"`, id);
    }
    api.deleteProduct(id).catch(() => {});
  };

  const restockProduct = (id: string, amount: number) => {
    const product = products.find((p) => p.id === id);
    const newStock = (product?.stock || 0) + amount;
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, stock: newStock, updatedAt: new Date().toISOString() } : prod
      )
    );
    api.updateProduct(id, { stock: newStock }).catch(() => {});
    logActivity('Product Restocked', 'product', `Restocked +${amount} units for product ID: ${id}`, id);
  };

  // Category Methods
  const addCategory = (data: Omit<Category, 'id' | 'productCount'>): Category => {
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      productCount: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
    api.createCategory(newCategory).catch(() => {});
    logActivity('Category Added', 'category', `Added new category "${newCategory.name}"`, newCategory.id);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
    api.updateCategory(id, updates).catch(() => {});
    logActivity('Category Updated', 'category', `Updated category ID: ${id}`, id);
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (cat) {
      logActivity('Category Deleted', 'category', `Deleted category "${cat.name}"`, id);
    }
    api.deleteCategory(id).catch(() => {});
  };

  // Order Methods
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>
  ): Order => {
    const now = new Date().toISOString();
    const orderNumber = `AUR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          status: 'new',
          title: 'Order Placed',
          description: `Order ${orderNumber} placed and payment processed successfully.`,
          timestamp: now,
        },
      ],
    };

    // Deduct inventory
    orderData.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.productId ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p
        )
      );
    });

    // Update coupon usage count if used
    if (orderData.couponCode) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.code.toUpperCase() === orderData.couponCode?.toUpperCase()
            ? { ...c, usageCount: c.usageCount + 1 }
            : c
        )
      );
    }

    setOrders((prev) => [newOrder, ...prev]);

    // Update customer spend stats if logged in
    if (orderData.customer?.email) {
      setCustomers((prev) =>
        prev.map((cust) =>
          cust.email.toLowerCase() === orderData.customer.email.toLowerCase()
            ? {
                ...cust,
                totalSpent: (cust.totalSpent || 0) + newOrder.total,
                orderCount: (cust.orderCount || 0) + 1,
              }
            : cust
        )
      );
    }

    api.createOrder(newOrder).catch(() => {});
    logActivity('New Order Created', 'order', `Order #${orderNumber} placed for $${newOrder.total.toFixed(2)} by ${newOrder.customer.name}`, newOrder.id);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    carrier?: string,
    note?: string
  ) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const statusTitles: Record<OrderStatus, string> = {
            new: 'Order Placed',
            confirmed: 'Order Confirmed',
            processing: 'Order in Processing',
            shipped: 'Order Shipped & Dispatched',
            delivered: 'Order Delivered',
            cancelled: 'Order Cancelled',
          };

          const newTimelineEvent = {
            id: `tl-${Date.now()}`,
            status,
            title: statusTitles[status] || 'Status Updated',
            description:
              note ||
              (trackingNumber
                ? `Dispatched with ${carrier || 'Carrier'}. Tracking: ${trackingNumber}`
                : `Status transitioned to ${status}`),
            timestamp: now,
            location: status === 'shipped' ? 'Regional Fulfillment Center' : undefined,
          };

          return {
            ...order,
            status,
            trackingNumber: trackingNumber || order.trackingNumber,
            carrier: carrier || order.carrier,
            updatedAt: now,
            timeline: [...order.timeline, newTimelineEvent],
          };
        }
        return order;
      })
    );

    api.updateOrderStatus(orderId, status, undefined, note).catch(() => {});
    logActivity('Order Status Changed', 'order', `Order ID: ${orderId} changed to ${status}`, orderId);
  };

  const updateOrderTracking = (orderId: string, trackingNumber: string, carrier?: string) => {
    updateOrderStatus(
      orderId,
      'shipped',
      trackingNumber,
      carrier,
      `Carrier tracking assigned: ${trackingNumber} (${carrier || 'FedEx Express'})`
    );
    api.updateOrderTracking(orderId, trackingNumber, carrier || 'FedEx Express').catch(() => {});
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, paymentStatus, updatedAt: new Date().toISOString() } : order
      )
    );
    logActivity('Payment Status Updated', 'order', `Order ID: ${orderId} payment status set to ${paymentStatus}`, orderId);
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'cancelled', undefined, undefined, reason || 'Cancelled by administrator or customer.');
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.items.forEach((item) => {
        setProducts((prev) =>
          prev.map((p) => (p.id === item.productId ? { ...p, stock: p.stock + item.quantity } : p))
        );
      });
    }
  };

  // Customer Methods
  const updateCustomerStatus = (customerId: string, status: 'active' | 'blocked') => {
    setCustomers((prev) =>
      prev.map((cust) => (cust.id === customerId ? { ...cust, status } : cust))
    );
    api.updateUserStatus(customerId, status).catch(() => {});
    logActivity('Customer Status Updated', 'customer', `Customer ${customerId} set to ${status}`, customerId);
  };

  const updateCustomer = (customerId: string, updates: Partial<User>) => {
    setCustomers((prev) =>
      prev.map((cust) => (cust.id === customerId ? { ...cust, ...updates } : cust))
    );
    api.updateUser(customerId, updates).catch(() => {});
    logActivity('Customer Profile Updated', 'customer', `Updated client details for ID: ${customerId}`, customerId);
  };

  const deleteCustomer = (customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    if (cust) {
      logActivity('Customer Removed', 'customer', `Removed customer profile: ${cust.name} (${cust.email})`, customerId);
    }
    api.deleteUser(customerId).catch(() => {});
  };

  const addCustomer = (data: Omit<User, 'id' | 'createdAt'>): User => {
    const existingIndex = customers.findIndex(
      (c) => c.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (existingIndex >= 0) {
      const updated = { ...customers[existingIndex], ...data };
      setCustomers((prev) => {
        const next = [...prev];
        next[existingIndex] = updated;
        return next;
      });
      return updated;
    }

    const newUser: User = {
      ...data,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalSpent: 0,
      orderCount: 0,
      status: data.status || 'active',
    };
    setCustomers((prev) => [...prev, newUser]);
    api.createUser(newUser).catch(() => {});
    logActivity('Customer Registered', 'customer', `Created customer profile for ${newUser.name} (${newUser.email})`, newUser.id);
    return newUser;
  };

  // Coupon Methods
  const addCoupon = (data: Omit<Coupon, 'id' | 'usageCount'>): Coupon => {
    const newCoupon: Coupon = {
      ...data,
      id: `coup-${Date.now()}`,
      usageCount: 0,
    };
    setCoupons((prev) => [...prev, newCoupon]);
    api.createCoupon(newCoupon).catch(() => {});
    logActivity('Coupon Created', 'coupon', `Created discount code "${newCoupon.code}"`, newCoupon.id);
    return newCoupon;
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    api.updateCoupon(id, updates).catch(() => {});
    logActivity('Coupon Updated', 'coupon', `Updated discount coupon ${id}`, id);
  };

  const deleteCoupon = (id: string) => {
    const coup = coupons.find((c) => c.id === id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    if (coup) {
      logActivity('Coupon Deleted', 'coupon', `Deleted coupon code "${coup.code}"`, id);
    }
    api.deleteCoupon(id).catch(() => {});
  };

  const validateCoupon = (
    code: string,
    subtotal: number
  ): { valid: boolean; coupon?: Coupon; discount: number; message: string } => {
    const normalized = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === normalized);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid promo code' };
    }
    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: 'This promo code is inactive' };
    }
    const expiryDateStr = coupon.endDate || coupon.expiresAt || coupon.validUntil;
    if (expiryDateStr && new Date(expiryDateStr) < new Date()) {
      return { valid: false, discount: 0, message: 'This promo code has expired' };
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'This promo code has reached its usage limit' };
    }
    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of ${formatPrice(coupon.minSpend)} required for this code`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return {
      valid: true,
      coupon,
      discount,
      message: `Coupon "${coupon.code}" applied successfully! You save ${formatPrice(discount)}.`,
    };
  };

  // Review Methods
  const addReview = (data: Omit<Review, 'id' | 'createdAt' | 'status'>): Review => {
    const newReview: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      status: 'approved',
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);

    const productReviews = [
      ...reviews.filter((r) => r.productId === data.productId && r.status === 'approved'),
      newReview,
    ];
    const avgRating =
      productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === data.productId
          ? {
              ...p,
              rating: Number(avgRating.toFixed(1)),
              reviewCount: productReviews.length,
            }
          : p
      )
    );

    api.createReview(newReview).catch(() => {});
    logActivity('Review Added', 'review', `New ${newReview.rating}-star review on "${newReview.productName}" by ${newReview.userName}`, newReview.id);
    return newReview;
  };

  const checkReviewEligibility = (
    productId: string,
    userId?: string,
    userEmail?: string
  ): ReviewEligibility => {
    if (!userId && !userEmail) {
      return { eligible: false, reason: 'guest' };
    }

    const existingReview = reviews.find(
      (r) =>
        r.productId === productId &&
        ((userId && r.userId === userId) ||
          (userEmail && r.userName.toLowerCase() === userEmail.toLowerCase()))
    );

    if (existingReview) {
      return {
        eligible: false,
        reason: 'already_reviewed',
        existingReview,
      };
    }

    const userOrders = orders.filter((ord) => {
      const isIdMatch = Boolean(userId && ord.customer?.id && ord.customer.id === userId);
      const isEmailMatch = Boolean(
        userEmail &&
          (ord.customer?.email?.toLowerCase() === userEmail.toLowerCase() ||
            ord.shippingAddress?.email?.toLowerCase() === userEmail.toLowerCase())
      );
      return isIdMatch || isEmailMatch;
    });

    const ordersWithProduct = userOrders.filter((ord) =>
      ord.items?.some((item) => item.productId === productId || item.product?.id === productId)
    );

    if (ordersWithProduct.length === 0) {
      return {
        eligible: false,
        reason: 'not_purchased',
      };
    }

    const deliveredOrder = ordersWithProduct.find((ord) => ord.status === 'delivered');

    if (!deliveredOrder) {
      const latestOrder = ordersWithProduct[0];
      return {
        eligible: false,
        reason: 'not_delivered',
        order: latestOrder,
        orderStatus: latestOrder.status,
      };
    }

    return {
      eligible: true,
      reason: 'can_review',
      order: deliveredOrder,
    };
  };

  const updateReviewStatus = (id: string, status: 'approved' | 'rejected') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    api.updateReviewStatus(id, status).catch(() => {});
    logActivity('Review Moderated', 'review', `Review ${id} status set to ${status}`, id);
  };

  const replyToReview = (id: string, replyText: string, replierName: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              reply: {
                text: replyText,
                repliedAt: new Date().toISOString(),
                repliedBy: replierName,
              },
            }
          : r
      )
    );
    api.replyReview(id, replyText, replierName).catch(() => {});
    logActivity('Review Replied', 'review', `Official response added to review ${id}`, id);
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    logActivity('Review Deleted', 'review', `Deleted review ${id}`, id);
  };

  // Blog Actions
  const addBlogPost = (postData: Omit<BlogPost, 'id' | 'publishedAt' | 'likes' | 'comments' | 'views'>): BlogPost => {
    const newPost: BlogPost = {
      ...postData,
      id: `blog-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      likes: 0,
      views: 1,
      comments: [],
    };
    setBlogs((prev) => [newPost, ...prev]);
    logActivity('Article Created', 'blog', `Created editorial story: "${newPost.title}"`, newPost.id);
    return newPost;
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    logActivity('Article Updated', 'blog', `Updated editorial story ID: ${id}`, id);
  };

  const deleteBlogPost = (id: string) => {
    const postToDelete = blogs.find((b) => b.id === id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    logActivity(
      'Article Deleted',
      'blog',
      `Deleted editorial story: "${postToDelete?.title || id}"`,
      id
    );
  };

  const likeBlogPost = (id: string) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, likes: (b.likes || 0) + 1 } : b))
    );
  };

  const incrementBlogViews = (id: string) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, views: (b.views || 0) + 1 } : b))
    );
  };

  const addBlogComment = (
    postId: string,
    commentData: { userName: string; comment: string; userAvatar?: string }
  ) => {
    const newComment: BlogComment = {
      id: `c-${Date.now()}`,
      postId,
      userName: commentData.userName.trim() || 'Reader',
      userAvatar: commentData.userAvatar,
      comment: commentData.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    setBlogs((prev) =>
      prev.map((b) =>
        b.id === postId
          ? { ...b, comments: [newComment, ...(b.comments || [])] }
          : b
      )
    );
    logActivity('Article Commented', 'blog', `New comment on story ${postId} by ${newComment.userName}`, postId);
  };

  const updateShippingMethod = (id: string, updates: Partial<ShippingMethod>) => {
    setShippingMethods((prev) =>
      prev.map((sm) => (sm.id === id ? { ...sm, ...updates } : sm))
    );
    logActivity('Shipping Method Updated', 'settings', `Updated shipping carrier method ID: ${id}`, id);
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    if (updates.currency && typeof updates.currency === 'object') {
      setCurrency(updates.currency);
    }
    api.updateSettings(updated).catch(() => {});
    logActivity('Store Settings Changed', 'settings', 'Updated general store configuration.');
  };

  const resetToFactoryDefaults = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_USERS);
    setReviews(INITIAL_REVIEWS);
    setCoupons(INITIAL_COUPONS);
    setShippingMethods(INITIAL_SHIPPING_METHODS);
    setSettings(INITIAL_STORE_SETTINGS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setBlogs(INITIAL_BLOG_POSTS);
    setCurrency(INITIAL_STORE_SETTINGS.currency as CurrencyConfig);
    api.resetToFactoryDefaults().catch(() => {});
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        customers,
        reviews,
        coupons,
        shippingMethods,
        settings,
        activityLogs,
        blogs,
        currency,
        setCurrency,
        formatPrice,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        createOrder,
        updateOrderStatus,
        updateOrderTracking,
        updateOrderPaymentStatus,
        cancelOrder,
        updateCustomerStatus,
        updateCustomer,
        deleteCustomer,
        addCustomer,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        validateCoupon,
        addReview,
        checkReviewEligibility,
        updateReviewStatus,
        replyToReview,
        deleteReview,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        likeBlogPost,
        addBlogComment,
        incrementBlogViews,
        updateShippingMethod,
        updateSettings,
        resetToFactoryDefaults,
        logActivity,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
