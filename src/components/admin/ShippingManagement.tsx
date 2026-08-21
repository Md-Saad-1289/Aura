import React, { useState } from 'react';
import { Truck, Plus, Edit2, Trash2, ShieldCheck, Sparkles, Check, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ShippingMethod } from '../../types';

export const ShippingManagement: React.FC = () => {
  const { shippingMethods, updateShippingMethod, settings, updateSettings, formatPrice } = useStore();

  const [thresholdInput, setThresholdInput] = useState(settings.freeShippingThreshold);
  const [thresholdSaved, setThresholdSaved] = useState(false);

  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [estimatedDays, setEstimatedDays] = useState('');

  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ freeShippingThreshold: Number(thresholdInput) });
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 2000);
  };

  const handleOpenEdit = (m: ShippingMethod) => {
    setEditingMethod(m);
    setName(m.name);
    setDescription(m.description);
    setPrice(m.price);
    setEstimatedDays(m.estimatedDays);
  };

  const handleSaveMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMethod) return;
    updateShippingMethod(editingMethod.id, {
      name,
      description,
      price: Number(price),
      estimatedDays
    });
    setEditingMethod(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
          Shipping Rules & Courier Logistics
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Configure global delivery zones, standard courier tariffs, and free shipping triggers.
        </p>
      </div>

      {/* Free Shipping Threshold Rule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs max-w-xl space-y-4">
        <div className="flex items-center gap-2 text-zinc-950 font-serif font-bold text-base">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3>Automated Free Shipping Trigger</h3>
        </div>
        <p className="text-xs text-zinc-500">
          When customer cart subtotal reaches this amount, standard ground shipping is automatically waived during checkout.
        </p>

        <form onSubmit={handleSaveThreshold} className="flex gap-3 items-center">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">$</span>
            <input
              type="number"
              min="0"
              required
              value={thresholdInput}
              onChange={(e) => setThresholdInput(Number(e.target.value))}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-zinc-900"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-850"
          >
            {thresholdSaved ? 'Saved!' : 'Update Threshold'}
          </button>
        </form>
      </div>

      {/* Shipping Methods Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-150">
          <h3 className="text-base font-serif font-bold text-zinc-950">
            Active Shipping Methods & Speeds
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Courier Tier</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Estimated Transit</th>
                <th className="py-3.5 px-4">Base Tariff</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150">
              {shippingMethods.map((method) => (
                <tr key={method.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-zinc-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-zinc-500" />
                    <span>{method.name}</span>
                  </td>

                  <td className="py-4 px-4 text-zinc-600 max-w-sm">
                    {method.description}
                  </td>

                  <td className="py-4 px-4 font-mono font-medium text-zinc-800">
                    {method.estimatedDays}
                  </td>

                  <td className="py-4 px-4 font-bold text-zinc-950">
                    {method.price === 0 ? <span className="text-emerald-700 font-bold">Complimentary</span> : formatPrice(method.price)}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(method)}
                      className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-zinc-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
              <h3 className="text-base font-serif font-bold text-zinc-950">
                Edit Method: {editingMethod.name}
              </h3>
              <button onClick={() => setEditingMethod(null)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMethod} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Tier Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">Transit Window</label>
                  <input
                    type="text"
                    required
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setEditingMethod(null)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white text-xs font-bold rounded-xl"
                >
                  Save Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
