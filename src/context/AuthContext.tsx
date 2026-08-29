import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Address } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import { useStore } from './StoreContext';
import { api, setAuthToken } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isManager: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  loginWithGoogle: (profile: { email: string; name: string; avatar?: string; googleId?: string; credential?: string }) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  switchUser: (role: UserRole | 'guest') => void;
  switchDemoRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
  updateUserProfile: (updates: Partial<User>) => void;
  saveAddress: (address: Address) => void;
  deleteAddress: (index: number) => void;
  setDefaultAddress: (index: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'aura_auth_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { customers, addCustomer, logActivity } = useStore();

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  // Sync token / verification on mount
  useEffect(() => {
    api.getMe()
      .then((res) => {
        if (res.success && res.user) {
          setCurrentUser(res.user);
        }
      })
      .catch(() => {
        // Backend fallback silently handled
      });
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const res = await api.login(email, password);
      if (res.success && res.user) {
        if (res.token) setAuthToken(res.token);
        setCurrentUser(res.user);
        logActivity('User Logged In', 'auth', `User ${res.user.name} logged into the store.`, res.user.id);
        return { success: true, user: res.user };
      }
    } catch (err: any) {
      // Local fallback
      const foundUser = customers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (foundUser) {
        if (foundUser.status === 'blocked') {
          return { success: false, error: 'Your account has been suspended. Please contact support.' };
        }
        setCurrentUser(foundUser);
        logActivity('User Logged In', 'auth', `User ${foundUser.name} logged into the store.`, foundUser.id);
        return { success: true, user: foundUser };
      }

      const adminUser = INITIAL_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (adminUser) {
        setCurrentUser(adminUser);
        return { success: true, user: adminUser };
      }

      return { success: false, error: err?.message || 'No account found with this email. Please create an account.' };
    }

    return { success: false, error: 'Login failed' };
  };

  const loginWithGoogle = async (profile: {
    email: string;
    name: string;
    avatar?: string;
    googleId?: string;
    credential?: string;
  }): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      // 1. Attempt backend API sync
      const res = await api.loginWithGoogle(profile);
      if (res.success && res.user) {
        if (res.token) setAuthToken(res.token);
        setCurrentUser(res.user);
        logActivity('Google Sign In', 'auth', `User ${res.user.name} signed in with Google Account.`, res.user.id);
        return { success: true, user: res.user };
      }
    } catch (err: any) {
      // 2. Client-side local fallback
      const email = profile.email.trim().toLowerCase();
      const existingUser = customers.find((u) => u.email.toLowerCase() === email);

      if (existingUser) {
        if (existingUser.status === 'blocked') {
          return { success: false, error: 'Your account has been suspended. Please contact support.' };
        }
        const updatedUser: User = {
          ...existingUser,
          name: profile.name || existingUser.name,
          avatar: profile.avatar || existingUser.avatar,
          authProvider: 'google',
          googleId: profile.googleId || existingUser.googleId,
        };
        setCurrentUser(updatedUser);
        logActivity('Google Sign In', 'auth', `User ${updatedUser.name} signed in with Google.`, updatedUser.id);
        return { success: true, user: updatedUser };
      }

      // Check admin users
      const adminUser = INITIAL_USERS.find((u) => u.email.toLowerCase() === email);
      if (adminUser) {
        const updatedAdmin: User = {
          ...adminUser,
          avatar: profile.avatar || adminUser.avatar,
          authProvider: 'google',
          googleId: profile.googleId,
        };
        setCurrentUser(updatedAdmin);
        logActivity('Google Sign In', 'auth', `Admin ${updatedAdmin.name} signed in with Google.`, updatedAdmin.id);
        return { success: true, user: updatedAdmin };
      }

      // Register new Google customer
      const newUser = addCustomer({
        name: profile.name || 'Google User',
        email: profile.email,
        role: 'customer',
        avatar: profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name || 'User')}`,
        addresses: [],
        status: 'active',
        authProvider: 'google',
        googleId: profile.googleId,
      });

      setCurrentUser(newUser);
      logActivity('Google Account Created', 'auth', `New account created via Google for ${newUser.name}.`, newUser.id);
      return { success: true, user: newUser };
    }

    return { success: false, error: 'Google sign-in could not be completed.' };
  };

  const register = async (
    name: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const res = await api.register(name, email, password);
      if (res.success && res.user) {
        if (res.token) setAuthToken(res.token);
        addCustomer(res.user);
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (err: any) {
      const existing = customers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (existing) {
        return { success: false, error: 'An account with this email address already exists.' };
      }

      const newUser = addCustomer({
        name,
        email,
        role: 'customer',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        addresses: [],
        status: 'active'
      });

      setCurrentUser(newUser);
      return { success: true, user: newUser };
    }

    return { success: false, error: 'Registration failed' };
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };

  const switchUser = (role: UserRole | 'guest') => {
    if (role === 'guest') {
      setAuthToken(null);
      setCurrentUser(null);
      return;
    }

    api.switchDemoRole(role)
      .then((res) => {
        if (res.token) setAuthToken(res.token);
        if (res.user) setCurrentUser(res.user);
      })
      .catch(() => {
        if (role === 'super_admin' || role === 'admin') {
          setCurrentUser(INITIAL_USERS[0]);
        } else if (role === 'manager') {
          setCurrentUser(INITIAL_USERS[1]);
        } else {
          setCurrentUser(INITIAL_USERS[2]);
        }
      });
  };

  const switchDemoRole = (role: UserRole) => {
    switchUser(role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin' || currentUser.role === 'super_admin') return true;

    if (currentUser.role === 'manager') {
      const allowed = ['view_dashboard', 'manage_products', 'manage_categories', 'manage_orders', 'manage_customers', 'manage_coupons', 'manage_shipping', 'view_analytics', 'manage_blogs'];
      return allowed.includes(permission);
    }

    if (currentUser.role === 'support') {
      const allowed = ['view_dashboard', 'manage_orders', 'manage_customers', 'manage_reviews'];
      return allowed.includes(permission);
    }

    return false;
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    api.updateProfile(updates).catch(() => {});
  };

  const saveAddress = (address: Address) => {
    if (!currentUser) return;
    let addresses = [...(currentUser.addresses || [])];
    if (address.isDefault || addresses.length === 0) {
      addresses = addresses.map(a => ({ ...a, isDefault: false }));
      addresses.push({ ...address, isDefault: true });
    } else {
      addresses.push(address);
    }
    updateUserProfile({ addresses });
  };

  const deleteAddress = (index: number) => {
    if (!currentUser) return;
    const addresses = [...(currentUser.addresses || [])];
    addresses.splice(index, 1);
    if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
      addresses[0].isDefault = true;
    }
    updateUserProfile({ addresses });
  };

  const setDefaultAddress = (index: number) => {
    if (!currentUser) return;
    const addresses = (currentUser.addresses || []).map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    updateUserProfile({ addresses });
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin' || currentUser?.role === 'manager';
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isManager = currentUser?.role === 'manager';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        isManager,
        login,
        loginWithGoogle,
        register,
        logout,
        switchUser,
        switchDemoRole,
        hasPermission,
        updateUserProfile,
        saveAddress,
        deleteAddress,
        setDefaultAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
