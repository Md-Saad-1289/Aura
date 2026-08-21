import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Truck,
  Printer,
  Eye,
  CheckCircle,
  Clock,
  X,
  MapPin,
  ExternalLink,
  ChevronDown,
  Filter
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { PrintInvoiceModal } from './PrintInvoiceModal';

export const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderTracking, formatPrice, settings } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Tracking modal state
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [carrierInput, setCarrierInput] = useState('FedEx Express');
  const [trackingInput, setTrackingInput] = useState('');

  // Invoice modal state
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchNum = order.orderNumber.toLowerCase().includes(q);
        const matchName = order.customer.name.toLowerCase().includes(q);
        const matchEmail = order.customer.email.toLowerCase().includes(q);
        const matchTrack = (order.trackingNumber || '').toLowerCase().includes(q);
        if (!matchNum && !matchName && !matchEmail && !matchTrack) return false;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleOpenTrackingModal = (order: Order) => {
    setTrackingModalOrder(order);
    setCarrierInput(order.carrier || 'FedEx Express');
    setTrackingInput(order.trackingNumber || `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`);
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder) return;
    updateOrderTracking(trackingModalOrder.id, trackingInput, carrierInput);
    setTrackingModalOrder(null);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
            Order Fulfillment & Consignments
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage dispatch statuses, assign tracking codes, and generate tax invoices.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order #, customer name, tracking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-3 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
          {['all', 'new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-zinc-950 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Tracking</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                      {order.orderNumber}
                    </td>

                    <td className="py-3 px-4 text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-zinc-900">{order.customer.name}</p>
                      <p className="text-[10px] text-zinc-400">{order.customer.email}</p>
                    </td>

                    <td className="py-3 px-4 text-zinc-600">
                      {order.shippingAddress.city}, {order.shippingAddress.country}
                    </td>

                    <td className="py-3 px-4 font-bold text-zinc-950">
                      {formatPrice(order.total)}
                    </td>

                    <td className="py-3 px-4">
                      {order.trackingNumber ? (
                        <span className="font-mono text-[10px] text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded">
                          {order.trackingNumber}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenTrackingModal(order)}
                          className="text-[11px] text-blue-600 hover:underline font-medium"
                        >
                          + Assign ID
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold rounded-lg px-2 py-1 border cursor-pointer capitalize ${getStatusBadge(order.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenTrackingModal(order)}
                          className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg"
                          title="Update Tracking"
                        >
                          <Truck className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setInvoiceOrder(order)}
                          className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg"
                          title="Print Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Inspector Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-zinc-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
              <div>
                <span className="text-xs font-mono font-bold text-zinc-950 px-2 py-0.5 bg-zinc-100 rounded">
                  {selectedOrder.orderNumber}
                </span>
                <h3 className="text-lg font-serif font-bold text-zinc-950 mt-1">
                  Consignment Breakdown
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-zinc-150 border border-zinc-200 rounded-2xl p-4 bg-zinc-50/50">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.product.images[0]} alt={it.product.name} className="w-12 h-12 rounded-lg object-cover bg-white" />
                      <div>
                        <p className="font-bold text-zinc-900">{it.product.name}</p>
                        <p className="text-[11px] text-zinc-500">Qty: {it.quantity} {it.selectedVariant.color?.name ? `• ${it.selectedVariant.color.name}` : ''}</p>
                      </div>
                    </div>
                    <span className="font-bold text-zinc-950">{formatPrice(it.unitPrice * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <p className="font-bold text-zinc-400 uppercase text-[10px]">Shipping Destination</p>
                <p className="font-bold text-zinc-900 mt-1">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-zinc-600">{selectedOrder.shippingAddress.street}</p>
                <p className="text-zinc-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                <p className="text-zinc-600">{selectedOrder.shippingAddress.country}</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <p className="font-bold text-zinc-400 uppercase text-[10px]">Fulfillment & Courier</p>
                <p className="font-bold text-zinc-900 mt-1">Carrier: {selectedOrder.carrier || 'FedEx Express'}</p>
                <p className="text-zinc-600">Tracking: {selectedOrder.trackingNumber || 'Unassigned'}</p>
                <p className="text-emerald-700 font-semibold capitalize">Status: {selectedOrder.status}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
              <button
                onClick={() => {
                  const target = selectedOrder;
                  setSelectedOrder(null);
                  setInvoiceOrder(target);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-zinc-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
              <h3 className="text-base font-serif font-bold text-zinc-950">
                Update Tracking: {trackingModalOrder.orderNumber}
              </h3>
              <button onClick={() => setTrackingModalOrder(null)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Logistics Courier</label>
                <select
                  value={carrierInput}
                  onChange={(e) => setCarrierInput(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-semibold"
                >
                  <option value="FedEx Express">FedEx Express</option>
                  <option value="DHL Priority Express">DHL Priority Express</option>
                  <option value="UPS Worldwide">UPS Worldwide</option>
                  <option value="Swiss Post International">Swiss Post International</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Tracking Number</label>
                <input
                  type="text"
                  required
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white text-xs font-bold rounded-xl"
                >
                  Save & Notify Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice & Packing Slip Modal */}
      {invoiceOrder && (
        <PrintInvoiceModal
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
