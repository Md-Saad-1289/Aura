import React, { useState } from 'react';
import {
  CheckCircle,
  Package,
  Truck,
  Printer,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Download,
  CreditCard
} from 'lucide-react';
import { Order, StorefrontView, OrderStatus } from '../types';
import { useStore } from '../context/StoreContext';

interface OrderConfirmationPageProps {
  order: Order | null;
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
  onTrackOrder: (orderNumber: string) => void;
}

const ORDER_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'new', label: 'Placed' },
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'processing', label: 'Processing' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' }
];

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onNavigate,
  onTrackOrder
}) => {
  const { orders, formatPrice, settings } = useStore();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // If no order passed, get the latest one
  const displayOrder = order || orders[0];

  if (!displayOrder) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-sm text-zinc-500">No recent order found.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.findIndex(s => s.status === displayOrder.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Celebration Header */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50 duration-300">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 pt-2">
            Thank you for your order, {displayOrder.customer.name.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            A confirmation receipt and carbon-neutral transit details have been emailed to <strong className="text-zinc-800">{displayOrder.customer.email}</strong>.
          </p>
        </div>

        <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 inline-flex items-center gap-4 text-xs">
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase">Order Reference</span>
            <span className="font-mono font-bold text-zinc-950">{displayOrder.orderNumber}</span>
          </div>
          <div className="h-6 w-px bg-zinc-200" />
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase">Total Paid</span>
            <span className="font-bold text-zinc-950">{formatPrice(displayOrder.total)}</span>
          </div>
          <div className="h-6 w-px bg-zinc-200" />
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase">Status</span>
            <span className="font-bold text-emerald-700 capitalize">{displayOrder.status}</span>
          </div>
        </div>
      </div>

      {/* Visual Live Tracker Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-150">
          <div>
            <h3 className="text-base font-serif font-bold text-zinc-950">
              Live Fulfillment Status
            </h3>
            <p className="text-xs text-zinc-500">
              Estimated Delivery: <strong className="text-zinc-900">{displayOrder.shippingMethod.estimatedDays}</strong>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onTrackOrder(displayOrder.orderNumber)}
              className="px-3.5 py-1.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-850 transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Live</span>
            </button>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-3.5 py-1.5 bg-zinc-100 text-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Invoice</span>
            </button>
          </div>
        </div>

        {/* Stepper Steps Bar */}
        <div className="relative flex justify-between items-center max-w-2xl mx-auto pt-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-zinc-950 -translate-y-1/2 z-0 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentStepIndex) / (ORDER_STEPS.length - 1)) * 100}%`
            }}
          />

          {ORDER_STEPS.map((step, idx) => {
            const isDone = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-zinc-950 text-white ring-4 ring-zinc-200 scale-110'
                      : isDone
                      ? 'bg-zinc-950 text-white'
                      : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className={`text-[11px] mt-2 font-medium ${isDone ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Timeline Events Log */}
        <div className="pt-6 border-t border-zinc-150 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Timeline Events
          </h4>
          <div className="space-y-3">
            {displayOrder.timeline.map((event) => (
              <div key={event.id} className="flex gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-zinc-950 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-zinc-900">{event.title}</span>
                    <span className="text-zinc-400 text-[10px]">
                      {new Date(event.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-zinc-500 mt-0.5">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Item Breakdown & Address Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Purchased Items (8 Cols) */}
        <div className="md:col-span-8 bg-zinc-50 rounded-3xl p-6 border border-zinc-200 space-y-4">
          <h3 className="text-sm font-serif font-bold text-zinc-950 pb-2 border-b border-zinc-200">
            Purchased Artifacts
          </h3>

          <div className="divide-y divide-zinc-200/80">
            {displayOrder.items.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-xl bg-white border border-zinc-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-zinc-900">{item.product.name}</p>
                    <p className="text-[11px] text-zinc-500">
                      Qty: {item.quantity} {item.selectedVariant.color?.name ? `• ${item.selectedVariant.color.name}` : ''} {item.selectedVariant.size ? `• ${item.selectedVariant.size}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-950">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-200 space-y-1.5 text-xs text-zinc-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-900">{formatPrice(displayOrder.subtotal)}</span>
            </div>
            {displayOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({displayOrder.couponCode})</span>
                <span>-{formatPrice(displayOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-zinc-900">
                {displayOrder.shippingCost === 0 ? 'Free' : formatPrice(displayOrder.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({settings.taxRate}%)</span>
              <span className="font-semibold text-zinc-900">{formatPrice(displayOrder.tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-zinc-950 pt-2 border-t border-zinc-200">
              <span>Total</span>
              <span>{formatPrice(displayOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* Addresses (4 Cols) */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200 space-y-3 text-xs">
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
              Shipping Address
            </h4>
            <div className="text-zinc-600 leading-relaxed">
              <p className="font-semibold text-zinc-900">{displayOrder.shippingAddress.fullName}</p>
              <p>{displayOrder.shippingAddress.street}</p>
              {displayOrder.shippingAddress.apartment && <p>{displayOrder.shippingAddress.apartment}</p>}
              <p>
                {displayOrder.shippingAddress.city}, {displayOrder.shippingAddress.state} {displayOrder.shippingAddress.postalCode}
              </p>
              <p>{displayOrder.shippingAddress.country}</p>
              <p className="pt-1 text-zinc-400">{displayOrder.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200 space-y-3 text-xs">
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
              Payment Details
            </h4>
            <div className="text-zinc-600 space-y-1">
              <p className="font-semibold text-zinc-900 capitalize">
                Method: {displayOrder.paymentMethod.type.replace('_', ' ')}
              </p>
              {displayOrder.paymentMethod.last4 && (
                <p className="text-zinc-500 font-mono text-[11px]">
                  Card ending in •••• {displayOrder.paymentMethod.last4}
                </p>
              )}
              <p className="text-emerald-700 font-semibold capitalize">
                Status: {displayOrder.paymentStatus}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="text-center pt-6">
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm transition-all"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Printable Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div id="printable-invoice" className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 border border-zinc-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-start pb-6 border-b border-zinc-200">
              <div>
                <h2 className="text-2xl font-serif font-bold text-zinc-950">AURA ATELIER</h2>
                <p className="text-xs text-zinc-500">{settings.address}</p>
                <p className="text-xs text-zinc-500">{settings.supportEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-zinc-950">INVOICE</p>
                <p className="text-xs font-mono text-zinc-500">#{displayOrder.orderNumber}</p>
                <p className="text-xs text-zinc-500">
                  {new Date(displayOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs">
              <div>
                <p className="font-bold text-zinc-400 uppercase text-[10px]">Billed & Shipped To:</p>
                <p className="font-bold text-zinc-900 mt-1">{displayOrder.shippingAddress.fullName}</p>
                <p className="text-zinc-600">{displayOrder.shippingAddress.street}</p>
                <p className="text-zinc-600">{displayOrder.shippingAddress.city}, {displayOrder.shippingAddress.state} {displayOrder.shippingAddress.postalCode}</p>
              </div>
              <div>
                <p className="font-bold text-zinc-400 uppercase text-[10px]">Payment Information:</p>
                <p className="text-zinc-700 capitalize mt-1">Method: {displayOrder.paymentMethod.type.replace('_', ' ')}</p>
                <p className="text-emerald-700 font-semibold">Payment Status: Paid</p>
              </div>
            </div>

            {/* Invoice Line Items */}
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 uppercase text-[10px]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150">
                {displayOrder.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-medium text-zinc-900">
                      {item.product.name}
                      {item.selectedVariant.color && ` (${item.selectedVariant.color.name})`}
                    </td>
                    <td className="py-3 text-center text-zinc-700">{item.quantity}</td>
                    <td className="py-3 text-right text-zinc-700">{formatPrice(item.unitPrice)}</td>
                    <td className="py-3 text-right font-semibold text-zinc-900">{formatPrice(item.unitPrice * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-4 border-t border-zinc-200 text-xs text-right space-y-1">
              <p>Subtotal: <span className="font-semibold">{formatPrice(displayOrder.subtotal)}</span></p>
              {displayOrder.discount > 0 && <p className="text-emerald-700">Discount: -{formatPrice(displayOrder.discount)}</p>}
              <p>Shipping: <span className="font-semibold">{displayOrder.shippingCost === 0 ? 'Free' : formatPrice(displayOrder.shippingCost)}</span></p>
              <p>Tax: <span className="font-semibold">{formatPrice(displayOrder.tax)}</span></p>
              <p className="text-base font-bold text-zinc-950 pt-2 border-t border-zinc-900">Total: {formatPrice(displayOrder.total)}</p>
            </div>

            <div className="no-print flex justify-end gap-3 pt-4 border-t border-zinc-200">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-zinc-950 text-white text-xs font-semibold rounded-xl"
              >
                Print Invoice
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 bg-zinc-100 text-zinc-800 text-xs font-semibold rounded-xl"
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
