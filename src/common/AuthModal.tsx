import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onSuccess?: () => void;
  onSwitchToAdmin?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onSuccess,
  onSwitchToAdmin
}) => {
  const { login, register, switchUser } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        const result = await login(email, password);
        if (result.success) {
          setSuccessMsg('Signed in successfully.');
          setTimeout(() => {
            onClose();
            if (result.user?.role === 'super_admin' || result.user?.role === 'manager') {
              if (onSwitchToAdmin) onSwitchToAdmin();
            } else if (onSuccess) {
              onSuccess();
            }
          }, 400);
        } else {
          setError(result.error || 'Invalid credentials.');
        }
      } else {
        if (!name.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        const result = await register(name, email, password);
        if (result.success) {
          setSuccessMsg('Account created successfully.');
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
          }, 400);
        } else {
          setError(result.error || 'Failed to create account.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = (role: UserRole) => {
    switchUser(role);
    onClose();
    if (role === 'super_admin' || role === 'manager') {
      if (onSwitchToAdmin) {
        onSwitchToAdmin();
        return;
      }
    }
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-zinc-150 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-zinc-950">
              {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {tab === 'login'
                ? 'Sign in to access your orders and saved addresses'
                : 'Join the AURA membership for private releases'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-zinc-150">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-all ${
              tab === 'login'
                ? 'border-zinc-950 text-zinc-950'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-all ${
              tab === 'register'
                ? 'border-zinc-950 text-zinc-950'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="jane.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-700">Password</label>
                {tab === 'login' && (
                  <span className="text-[11px] text-zinc-400 hover:text-zinc-700 cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-semibold tracking-wide transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : tab === 'login' ? 'Sign In to Account' : 'Create Account'}
            </button>
          </form>

          {/* Quick Demo Switcher Strip */}
          <div className="pt-4 border-t border-zinc-150">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 text-center mb-2.5">
              1-Click Demo Quick Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPersona('customer')}
                className="p-2 border border-zinc-200 hover:border-zinc-400 rounded-lg text-center bg-zinc-50 hover:bg-white transition-colors text-[11px]"
              >
                <span className="font-semibold text-zinc-900 block">Jane Doe</span>
                <span className="text-[10px] text-zinc-500">Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('super_admin')}
                className="p-2 border border-amber-200 bg-amber-50/60 hover:bg-amber-100 rounded-lg text-center transition-colors text-[11px]"
              >
                <span className="font-semibold text-amber-950 block">Elena R.</span>
                <span className="text-[10px] text-amber-700">Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('manager')}
                className="p-2 border border-blue-200 bg-blue-50/60 hover:bg-blue-100 rounded-lg text-center transition-colors text-[11px]"
              >
                <span className="font-semibold text-blue-950 block">Marcus V.</span>
                <span className="text-[10px] text-blue-700">Manager</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
