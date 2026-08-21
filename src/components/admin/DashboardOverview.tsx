import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminView, OrderStatus } from '../../types';

interface DashboardOverviewProps {
  onNavigate: (view: AdminView) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const {
    products,
    orders,
    customers,
    reviews,
    formatPrice,
    updateOrderStatus,
    settings
  } = useStore();

  // Metrics computation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'confirmed');

  // Status badge helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'new':
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  // Simulated 7-day revenue chart bars
  const revenueHistory = [
    { day: 'Mon', amount: 3240 },
    { day: 'Tue', amount: 4890 },
    { day: 'Wed', amount: 6120 },
    { day: 'Thu', amount: 5380 },
    { day: 'Fri', amount: 7950 },
    { day: 'Sat', amount: 9400 },
    { day: 'Sun', amount: 8200 }
  ];
  const maxBar = Math.max(...revenueHistory.map(r => r.amount));

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
            Operations & Revenue Overview
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time telemetry for {settings.storeName}. All systems operational.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('products')}
            className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={() => onNavigate('orders')}
            className="px-3.5 py-2 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 rounded-xl text-xs font-semibold"
          >
            Fulfill Orders ({pendingOrders.length})
          </button>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-zinc-950 font-mono">
              {formatPrice(totalRevenue)}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs previous month</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Orders</span>
            <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-zinc-950 font-mono">
              {totalOrders}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.1% fulfillment velocity</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Avg. Order Value</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-zinc-950 font-mono">
              {formatPrice(avgOrderValue)}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+6.2% premium mix</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Customers</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-zinc-950 font-mono">
              {customers.length}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-1">
              <span>94% repeat purchase rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Revenue Bar Graph (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-serif font-bold text-zinc-950">
                Revenue Trajectory (Past 7 Days)
              </h3>
              <p className="text-xs text-zinc-500">Gross processed volume in USD</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-zinc-900 hover:underline flex items-center gap-1"
            >
              Full Analytics <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-52 flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-zinc-150">
            {revenueHistory.map((item) => {
              const heightPercent = (item.amount / maxBar) * 100;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-950 font-bold transition-colors">
                    ${item.amount}
                  </span>
                  <div className="w-full bg-zinc-100 rounded-t-lg h-36 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-zinc-950 group-hover:bg-amber-500 transition-all duration-300 rounded-t-lg"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-600">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory Stock Alerts (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
              <h3 className="text-sm font-serif font-bold text-zinc-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Low Inventory Watch</span>
              </h3>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                {lowStockProducts.length} items
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-zinc-400 py-6 text-center">All catalog items healthy in stock.</p>
              ) : (
                lowStockProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-zinc-50 border border-zinc-150">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-white" />
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-900 truncate">{p.name}</p>
                        <p className="text-[10px] text-zinc-400">{p.category}</p>
                      </div>
                    </div>
                    <span className="font-bold text-amber-600 text-xs whitespace-nowrap pl-2">
                      {p.stock} units
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold transition-colors text-center"
          >
            Manage Product Catalog
          </button>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-150">
          <div>
            <h3 className="text-base font-serif font-bold text-zinc-950">
              Recent Consignments & Orders
            </h3>
            <p className="text-xs text-zinc-500">Live order fulfillment stream</p>
          </div>

          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-bold text-zinc-900 hover:underline flex items-center gap-1"
          >
            View all {orders.length} orders <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3">Order Ref</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3 font-mono font-bold text-zinc-950">
                    {order.orderNumber}
                  </td>
                  <td className="py-3">
                    <p className="font-semibold text-zinc-900">{order.customer.name}</p>
                    <p className="text-[10px] text-zinc-400">{order.customer.email}</p>
                  </td>
                  <td className="py-3 text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-3 text-zinc-700">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="py-3 font-bold text-zinc-950">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs rounded-lg px-2 py-1 font-medium focus:outline-none border-none cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
