import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Eye,
  Edit2,
  Trash2,
  Award,
  ShieldCheck,
  ShieldAlert,
  X,
  Download,
  ShoppingBag,
  Clock,
  CheckCircle,
  Ban,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { User, Order } from '../types';

export const CustomerManagement: React.FC = () => {
  const { customers, orders, updateCustomer, updateCustomerStatus, deleteCustomer, formatPrice } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<User | null>(null);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'blocked'>('active');
  const [editNotes, setEditNotes] = useState('');

  // Compute live customer metrics from orders
  const customerMetrics = useMemo(() => {
    const metrics: Record<string, { totalSpent: number; ordersCount: number; orders: Order[] }> = {};

    customers.forEach((c) => {
      metrics[c.id] = { totalSpent: 0, ordersCount: 0, orders: [] };
    });

    orders.forEach((o) => {
      const match = customers.find(
        (c) =>
          c.id === o.customer.id ||
          (c.email && o.customer.email && c.email.toLowerCase() === o.customer.email.toLowerCase())
      );
      if (match) {
        if (!metrics[match.id]) {
          metrics[match.id] = { totalSpent: 0, ordersCount: 0, orders: [] };
        }
        if (o.paymentStatus === 'paid') {
          metrics[match.id].totalSpent += o.total;
        }
        metrics[match.id].ordersCount += 1;
        metrics[match.id].orders.push(o);
      }
    });

    return metrics;
  }, [customers, orders]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (statusFilter !== 'all') {
        const custStatus = c.status || 'active';
        if (custStatus !== statusFilter) return false;
      }

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
      );
    });
  }, [customers, searchQuery, statusFilter]);

  const handleOpenEdit = (cust: User) => {
    setEditingCustomer(cust);
    setEditName(cust.name);
    setEditEmail(cust.email);
    setEditPhone(cust.phone || '');
    setEditStatus(cust.status === 'blocked' ? 'blocked' : 'active');
    setEditNotes(cust.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editName.trim() || !editEmail.trim()) return;

    updateCustomer(editingCustomer.id, {
      name: editName.trim(),
      email: editEmail.trim().toLowerCase(),
      phone: editPhone.trim() || undefined,
      status: editStatus,
      notes: editNotes.trim() || undefined,
    });

    setEditingCustomer(null);
  };

  const handleToggleBlock = (cust: User) => {
    const newStatus = cust.status === 'blocked' ? 'active' : 'blocked';
    updateCustomerStatus(cust.id, newStatus);
  };

  const handleDelete = (cust: User) => {
    if (confirm(`Are you sure you want to remove customer "${cust.name}"? This action cannot be undone.`)) {
      deleteCustomer(cust.id);
      if (selectedCustomer?.id === cust.id) setSelectedCustomer(null);
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Name,Email,Phone,Status,Orders Count,Total Spent (LTV),Joined Date\n' +
      filteredCustomers
        .map((c) => {
          const stats = customerMetrics[c.id] || { totalSpent: c.totalSpent || 0, ordersCount: c.orderCount || 0 };
          return `"${c.id}","${c.name}","${c.email}","${c.phone || ''}","${c.status || 'active'}",${stats.ordersCount},${stats.totalSpent},"${new Date(c.createdAt).toISOString().slice(0, 10)}"`;
        })
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aura_customers_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTier = (spent: number) => {
    if (spent >= 3000) return { label: 'Imperial VIP', color: 'bg-amber-400/20 text-amber-900 border-amber-400/30' };
    if (spent >= 1000) return { label: 'Platinum Collector', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    if (spent >= 400) return { label: 'Silver Patron', color: 'bg-zinc-100 text-zinc-800 border-zinc-200' };
    return { label: 'Standard Member', color: 'bg-zinc-50 text-zinc-600 border-zinc-200' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
            Clientele & Collector Directory
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time customer lifetime value (LTV), transaction frequency, access status, and concierge dossiers.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Directory (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
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

          <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl p-0.5">
            {(['all', 'active', 'blocked'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  statusFilter === st ? 'bg-zinc-950 text-white shadow-2xs' : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-zinc-500 font-medium">
          Showing {filteredCustomers.length} of {customers.length} registered collectors
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
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Total Spent (LTV)</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-400 text-xs">
                    No client records matching the selected search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const stats = customerMetrics[cust.id] || { totalSpent: cust.totalSpent || 0, ordersCount: cust.orderCount || 0, orders: [] };
                  const tier = getTier(stats.totalSpent);
                  const isBlocked = cust.status === 'blocked';

                  return (
                    <tr key={cust.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cust.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cust.name)}`}
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
                        <p className="text-zinc-800 font-medium">{cust.email}</p>
                        {cust.phone && <p className="text-[10px] text-zinc-400 font-mono">{cust.phone}</p>}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tier.color}`}>
                          {tier.label}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit ${
                            isBlocked
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <ShieldAlert className="w-3 h-3" />
                              <span>Suspended</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3 h-3" />
                              <span>Active</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-zinc-900">
                        {stats.ordersCount} orders
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                        {formatPrice(stats.totalSpent)}
                      </td>

                      <td className="py-3 px-4 text-zinc-500">
                        {new Date(cust.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg"
                            title="Inspect Client Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(cust)}
                            className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg"
                            title="Edit Client Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleBlock(cust)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isBlocked
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-amber-600 hover:bg-amber-50'
                            }`}
                            title={isBlocked ? 'Restore Client Access' : 'Suspend Client'}
                          >
                            {isBlocked ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDelete(cust)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Customer Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Dossier Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-zinc-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedCustomer.name)}`}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-zinc-200"
                />
                <div>
                  <h3 className="text-base font-serif font-bold text-zinc-950">{selectedCustomer.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                      {getTier(customerMetrics[selectedCustomer.id]?.totalSpent || 0).label}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{selectedCustomer.email}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
                <span className="text-zinc-400 uppercase text-[10px] font-bold block">Lifetime Volume</span>
                <span className="text-base font-bold text-zinc-950 font-mono mt-0.5 block">
                  {formatPrice(customerMetrics[selectedCustomer.id]?.totalSpent || 0)}
                </span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
                <span className="text-zinc-400 uppercase text-[10px] font-bold block">Orders Placed</span>
                <span className="text-base font-bold text-zinc-950 font-mono mt-0.5 block">
                  {customerMetrics[selectedCustomer.id]?.ordersCount || 0} Consignments
                </span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 col-span-2 sm:col-span-1">
                <span className="text-zinc-400 uppercase text-[10px] font-bold block">Account Status</span>
                <span className={`text-xs font-bold mt-1 block uppercase ${selectedCustomer.status === 'blocked' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {selectedCustomer.status === 'blocked' ? 'Suspended' : 'Active Privileges'}
                </span>
              </div>
            </div>

            {/* Order History breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Purchase History & Orders</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(customerMetrics[selectedCustomer.id]?.orders || []).length === 0 ? (
                  <p className="text-xs text-zinc-400 p-3 bg-zinc-50 rounded-xl border border-zinc-150">
                    No orders registered yet for this client profile.
                  </p>
                ) : (
                  (customerMetrics[selectedCustomer.id]?.orders || []).map((ord) => (
                    <div key={ord.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-zinc-950">{ord.orderNumber}</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-zinc-200 text-zinc-800 rounded">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {ord.items.length} items • {new Date(ord.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-zinc-950">{formatPrice(ord.total)}</span>
                    </div>
                  ))
                )}
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
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-zinc-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
              <h3 className="text-base font-serif font-bold text-zinc-950">
                Edit Collector Profile
              </h3>
              <button onClick={() => setEditingCustomer(null)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Account Privilege Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as 'active' | 'blocked')}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-bold focus:bg-white focus:outline-none"
                >
                  <option value="active">Active (Full Purchasing Privileges)</option>
                  <option value="blocked">Suspended / Blocked</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Private Concierge Notes</label>
                <textarea
                  rows={3}
                  placeholder="VIP preferences, special delivery instructions, bespoke sizing..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
