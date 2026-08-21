import {
  Product,
  Category,
  Order,
  User,
  Review,
  Coupon,
  StoreSettings,
  ActivityLog,
  UserRole,
} from '../types';

const API_BASE = '/api';

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || `HTTP ${response.status}: Request failed`);
  }

  return data;
}

export const api = {
  // Health & System Info
  async checkHealth() {
    return request<{
      status: string;
      timestamp: string;
      services: {
        mongodb: { status: string; database: string; cluster: string };
        cloudinary: { status: string; cloudName: string };
        jwt: { status: string };
      };
    }>('/health');
  },

  // Cloudinary Image Upload
  async uploadImage(imageData: string, folder = 'blinkupz_products') {
    return request<{
      success: boolean;
      url: string;
      public_id: string;
      format: string;
      message: string;
    }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ image: imageData, folder }),
    });
  },

  // Auth
  async login(email: string, password?: string) {
    return request<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(name: string, email: string, password?: string) {
    return request<{ success: boolean; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async getMe() {
    return request<{ success: boolean; user: User }>('/auth/me');
  },

  async switchDemoRole(role: UserRole | 'guest') {
    return request<{ success: boolean; token?: string; user?: User }>('/auth/demo-switch', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },

  async updateProfile(profileData: Partial<User>) {
    return request<{ success: boolean; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return request<{ success: boolean; count: number; data: Product[] }>(
      `/products${query ? `?${query}` : ''}`
    );
  },

  async getProduct(idOrSlug: string) {
    return request<{ success: boolean; data: Product }>(`/products/${idOrSlug}`);
  },

  async createProduct(product: Partial<Product>) {
    return request<{ success: boolean; data: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async updateProduct(id: string, product: Partial<Product>) {
    return request<{ success: boolean; data: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  async deleteProduct(id: string) {
    return request<{ success: boolean; message: string; id: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Categories
  async getCategories() {
    return request<{ success: boolean; count: number; data: Category[] }>('/categories');
  },

  async createCategory(category: Partial<Category>) {
    return request<{ success: boolean; data: Category }>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  async updateCategory(id: string, category: Partial<Category>) {
    return request<{ success: boolean; data: Category }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  async deleteCategory(id: string) {
    return request<{ success: boolean; message: string; id: string }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Orders
  async getOrders(params?: { email?: string; customerId?: string; status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return request<{ success: boolean; count: number; data: Order[] }>(
      `/orders${query ? `?${query}` : ''}`
    );
  },

  async getOrder(idOrNumber: string) {
    return request<{ success: boolean; data: Order }>(`/orders/${idOrNumber}`);
  },

  async createOrder(orderData: Partial<Order>) {
    return request<{ success: boolean; data: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async updateOrderStatus(id: string, status: string, location?: string, note?: string) {
    return request<{ success: boolean; data: Order }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, location, note }),
    });
  },

  async updateOrderTracking(id: string, trackingNumber: string, carrier: string) {
    return request<{ success: boolean; data: Order }>(`/orders/${id}/tracking`, {
      method: 'PATCH',
      body: JSON.stringify({ trackingNumber, carrier }),
    });
  },

  // Coupons
  async getCoupons() {
    return request<{ success: boolean; count: number; data: Coupon[] }>('/coupons');
  },

  async validateCoupon(code: string, subtotal: number) {
    return request<{
      valid: boolean;
      coupon?: Coupon;
      discountAmount?: number;
      message: string;
    }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  },

  async createCoupon(coupon: Partial<Coupon>) {
    return request<{ success: boolean; data: Coupon }>('/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon),
    });
  },

  async updateCoupon(id: string, coupon: Partial<Coupon>) {
    return request<{ success: boolean; data: Coupon }>(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coupon),
    });
  },

  async deleteCoupon(id: string) {
    return request<{ success: boolean; message: string; id: string }>(`/coupons/${id}`, {
      method: 'DELETE',
    });
  },

  // Reviews
  async getReviews(productId?: string) {
    const query = productId ? `?productId=${productId}` : '';
    return request<{ success: boolean; count: number; data: Review[] }>(`/reviews${query}`);
  },

  async createReview(review: Partial<Review>) {
    return request<{ success: boolean; data: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },

  async updateReviewStatus(id: string, status: string) {
    return request<{ success: boolean; data: Review }>(`/reviews/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async replyReview(id: string, text: string, repliedBy: string) {
    return request<{ success: boolean; data: Review }>(`/reviews/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text, repliedBy }),
    });
  },

  // Users
  async getUsers(params?: { role?: string; status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return request<{ success: boolean; count: number; data: User[] }>(
      `/users${query ? `?${query}` : ''}`
    );
  },

  async createUser(user: Partial<User>) {
    return request<{ success: boolean; data: User }>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  async updateUser(id: string, user: Partial<User>) {
    return request<{ success: boolean; data: User }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },

  async updateUserStatus(id: string, status: 'active' | 'blocked') {
    return request<{ success: boolean; data: User }>(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async deleteUser(id: string) {
    return request<{ success: boolean; message: string; id: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Settings & Activity
  async getSettings() {
    return request<{ success: boolean; data: StoreSettings }>('/settings');
  },

  async updateSettings(settings: StoreSettings) {
    return request<{ success: boolean; data: StoreSettings }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  async resetToFactoryDefaults() {
    return request<{ success: boolean; message: string }>('/settings/reset', {
      method: 'POST',
    });
  },

  async getActivityLogs() {
    return request<{ success: boolean; data: ActivityLog[] }>('/settings/activity');
  },
};
