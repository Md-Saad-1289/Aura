import React, { useState, useMemo } from 'react';
import { Users, Search, Plus, Mail, Phone, MapPin, Eye, Edit2, Trash2, Award, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Customer } from '../types';

export const CustomerManagement: React.FC = () => {
  const { customers, orders, formatPrice } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
      );
    });
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
            Clientele & Collector Directory
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            View customer lifetime value (LTV), order frequency, and private client notes.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-3 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
          />
        </div>

        <span className="text-xs text-zinc-500 font-medium">
          {filteredCustomers.length} registered collectors
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Tier Status</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Total Spent (LTV)</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'}
                        alt={cust.name}
                        className="w-9 h-9 rounded-xl object-cover border border-zinc-200"
                      />
                      <div>
                        <p className="font-bold text-zinc-900">{cust.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">ID: {cust.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <p className="text-zinc-800">{cust.email}</p>
                    {cust.phone && <p className="text-[10px] text-zinc-400">{cust.phone}</p>}
                  </td>

                  <td className="py-3 px-4">
                    <span className="bg-amber-400/20 text-amber-900 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {cust.tier}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-zinc-900">
                    {cust.ordersCount}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                    {formatPrice(cust.totalSpent)}
                  </td>

                  <td className="py-3 px-4 text-zinc-500">
                    {new Date(cust.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg"
                      title="Inspect Client Dossier"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Dossier Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-zinc-200 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-zinc-200"
                />
                <div>
                  <h3 className="text-base font-serif font-bold text-zinc-950">{selectedCustomer.name}</h3>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                    {selectedCustomer.tier} Tier
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
                <span className="text-zinc-400 uppercase text-[10px] font-bold block">Lifetime Volume</span>
                <span className="text-base font-bold text-zinc-950 font-mono mt-0.5 block">
                  {formatPrice(selectedCustomer.totalSpent)}
                </span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
                <span className="text-zinc-400 uppercase text-[10px] font-bold block">Consignments</span>
                <span className="text-base font-bold text-zinc-950 font-mono mt-0.5 block">
                  {selectedCustomer.ordersCount} Orders
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-zinc-800">Private Concierge Notes</p>
              <p className="text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-150 leading-relaxed">
                {selectedCustomer.notes || 'No concierge notes recorded for this collector.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
