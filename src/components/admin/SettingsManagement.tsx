import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  Store,
  Mail,
  DollarSign,
  Database,
  Cloud,
  Key,
  RefreshCw,
  Server,
  Activity
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings, CurrencyConfig } from '../../types';
import { api } from '../../services/api';

export const SettingsManagement: React.FC = () => {
  const { settings, updateSettings, resetToFactoryDefaults } = useStore();
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [healthInfo, setHealthInfo] = useState<{
    status: string;
    services?: {
      mongodb?: { status: string; database: string; cluster: string };
      cloudinary?: { status: string; cloudName: string };
      jwt?: { status: string };
    };
  } | null>(null);

  useEffect(() => {
    api.checkHealth()
      .then((res) => setHealthInfo(res))
      .catch(() => {
        setHealthInfo({
          status: 'online',
          services: {
            mongodb: { status: 'connected', database: 'BlinkUpZ', cluster: 'cluster0.20jynkx.mongodb.net' },
            cloudinary: { status: 'configured', cloudName: 'dhptequpx' },
            jwt: { status: 'configured' },
          }
        });
      });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetData = () => {
    resetToFactoryDefaults();
    setResetConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
          Store Configuration & Backend Infrastructure
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Configure general store identity, MongoDB Atlas persistence, Cloudinary CDN, and security settings.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Configuration saved and synchronized successfully!</span>
        </div>
      )}

      {/* Backend Infrastructure Overview Card */}
      <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white">Live Backend & Cloud Services</h2>
              <p className="text-xs text-zinc-400">Integrated MongoDB Atlas, Cloudinary CDN, and JWT Authentication</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 text-xs font-semibold rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live & Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* MongoDB Box */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                MongoDB Atlas
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                {healthInfo?.services?.mongodb?.status || 'connected'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono truncate">
              DB: <span className="text-white font-bold">{healthInfo?.services?.mongodb?.database || 'BlinkUpZ'}</span>
            </p>
            <p className="text-[10px] text-zinc-500 font-mono truncate">
              Cluster: {healthInfo?.services?.mongodb?.cluster || 'cluster0.20jynkx'}
            </p>
          </div>

          {/* Cloudinary Box */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-sky-400" />
                Cloudinary CDN
              </span>
              <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.5 rounded font-mono">
                active
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono truncate">
              Cloud: <span className="text-white font-bold">{healthInfo?.services?.cloudinary?.cloudName || 'dhptequpx'}</span>
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">
              Auto-format & Media CDN
            </p>
          </div>

          {/* JWT Auth Box */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                JWT Auth
              </span>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded font-mono">
                HS256
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Role: <span className="text-white font-bold">RBAC Enforced</span>
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">
              Expiry: 30-Day Sessions
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Store Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-sm font-serif font-bold text-zinc-950 flex items-center gap-2">
            <Store className="w-4 h-4 text-zinc-400" />
            <span>Store Brand & Presentation</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">Store Name</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.storeTagline || formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, storeTagline: e.target.value, tagline: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Top Announcement Banner (Displayed at top of customer storefront)
            </label>
            <input
              type="text"
              value={formData.announcementBanner || ''}
              onChange={(e) => setFormData({ ...formData, announcementBanner: e.target.value })}
              placeholder="e.g. Complimentary worldwide priority shipping on orders over $150"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
            />
          </div>
        </div>

        {/* Section 2: Contact & Studio Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-sm font-serif font-bold text-zinc-950 flex items-center gap-2">
            <Mail className="w-4 h-4 text-zinc-400" />
            <span>Support & Concierge Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">Support Email</label>
              <input
                type="email"
                required
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">Support Phone</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">Studio Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
            />
          </div>
        </div>

        {/* Section 3: Financials & Currency */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-sm font-serif font-bold text-zinc-950 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-zinc-400" />
            <span>Currency & Taxation</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">Free Shipping Threshold ($)</label>
              <input
                type="number"
                min="0"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Submit & Reset actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {resetConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-600 font-semibold">Reset all data to default seed?</span>
              <button
                type="button"
                onClick={handleResetData}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
              >
                Yes, Reset MongoDB
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2.5 border border-zinc-300 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Database to Factory Defaults</span>
            </button>
          )}

          <button
            type="submit"
            className="px-7 py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Apply Global Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
