import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, UserCheck, RefreshCw, Store, ChevronUp, ChevronDown, EyeOff, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface DemoSwitcherBarProps {
  currentMode?: 'storefront' | 'customer' | 'admin';
  mode?: 'customer' | 'admin' | 'storefront';
  onToggleMode?: (mode: 'storefront' | 'admin' | 'customer') => void;
  onSwitchMode?: (mode: 'customer' | 'admin') => void;
  onNavigateStorefront?: (view: string) => void;
}

export const DemoSwitcherBar: React.FC<DemoSwitcherBarProps> = ({
  currentMode,
  mode,
  onToggleMode,
  onSwitchMode,
}) => {
  const { currentUser, switchUser } = useAuth();
  const { resetToFactoryDefaults } = useStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return (import.meta as any).env?.VITE_HIDE_DEMO_BAR === 'true';
  });

  const active = currentMode === 'admin' || mode === 'admin' ? 'admin' : 'customer';

  const handleToggle = (target: 'customer' | 'admin') => {
    if (target === 'admin' && (!currentUser || currentUser.role === 'customer')) {
      // Auto-elevate to Elena Rostova (super_admin) so they have full access
      switchUser('super_admin');
    }
    if (onToggleMode) {
      onToggleMode(target === 'admin' ? 'admin' : 'storefront');
    }
    if (onSwitchMode) {
      onSwitchMode(target);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all store data (products, orders, reviews, coupons) to default?')) {
      resetToFactoryDefaults();
      window.location.reload();
    }
  };

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        title="Open Developer / Switcher Bar"
        className="fixed bottom-4 right-4 z-50 bg-zinc-950/90 text-zinc-300 text-xs px-3 py-1.5 rounded-full border border-zinc-800 shadow-xl flex items-center gap-1.5 hover:text-white hover:bg-black transition-all backdrop-blur"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] font-medium">Switch View</span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="bg-zinc-950 text-zinc-300 text-xs py-1 px-4 border-b border-zinc-800 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-[11px] font-semibold text-zinc-200 uppercase tracking-wider">AURA LIVE: {active.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggle(active === 'admin' ? 'customer' : 'admin')}
            className="text-[11px] text-amber-400 hover:underline font-medium"
          >
            Switch to {active === 'admin' ? 'Customer Store' : 'Admin'}
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 hover:text-white text-zinc-400"
            title="Expand bar"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-zinc-300 text-xs py-2 px-3 sm:px-6 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2 z-50 transition-all">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-100 uppercase tracking-widest text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          AURA E-COMMERCE SUITE
        </span>

        <span className="hidden sm:inline text-zinc-600">|</span>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-zinc-900 border border-zinc-700/60 rounded-md p-0.5">
          <button
            onClick={() => handleToggle('customer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              active === 'customer'
                ? 'bg-zinc-100 text-zinc-900 shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Customer Store
          </button>
          <button
            onClick={() => handleToggle('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              active === 'admin'
                ? 'bg-amber-400 text-zinc-950 shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Dashboard
          </button>
        </div>
      </div>

      {/* Role Switcher & Controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <UserCheck className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Current Persona:</span>
          <select
            value={currentUser?.role || 'guest'}
            onChange={(e) => switchUser(e.target.value as UserRole | 'guest')}
            className="bg-zinc-900 text-zinc-200 border border-zinc-700/80 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-zinc-500 font-medium cursor-pointer"
          >
            <option value="customer">Jane Doe (Customer)</option>
            <option value="super_admin">Elena Rostova (Super Admin)</option>
            <option value="manager">Marcus Vance (Store Manager)</option>
            <option value="guest">Guest (Logged Out)</option>
          </select>
        </div>

        <button
          onClick={handleReset}
          title="Reset database to initial demo state"
          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 px-2 py-1 rounded transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset DB</span>
        </button>

        <button
          onClick={() => setIsMinimized(true)}
          title="Minimize bar"
          className="p-1 hover:text-white text-zinc-400 transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          title="Hide toolbar (Production mode)"
          className="p-1 hover:text-white text-zinc-400 transition-colors"
        >
          <EyeOff className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
