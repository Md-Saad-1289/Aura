import React, { useState, useEffect } from 'react';
import { Search, Truck, Package, CheckCircle2, Clock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order, OrderStatus, StorefrontView } from '../types';
import { useStore } from '../context/StoreContext';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
}

const ORDER_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'new', label: 'Order Verified', desc: 'Payment captured and security cleared' },
  { status: 'confirmed', label: 'Fulfillment Hub', desc: 'Stock reserved & allocated' },
  { status: 'processing', label: 'Artisan Packaging', desc: 'Inspected and sealed in magnetic presentation box' },
  { status: 'shipped', label: 'In Transit', desc: 'Dispatched via carbon-neutral priority courier' },
  { status: 'delivered', label: 'Delivered', desc: 'Signed and delivered safely to recipient' }
];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber,
  onNavigate
}) => {
  const { orders, formatPrice } = useStore();
  const [query, setQuery] = useState(initialOrderNumber || 'AUR-89410');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (initialOrderNumber) {
      setQuery(initialOrderNumber);
      handleSearch(initialOrderNumber);
    } else if (orders.length > 0) {
      setSearchedOrder(orders[0]);
    }
  }, [initialOrderNumber, orders]);

  const handleSearch = (searchQuery: string) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const found = orders.find(
      o => o.orderNumber.toLowerCase() === q ||
           (o.trackingNumber && o.trackingNumber.toLowerCase() === q) ||
           o.customer.email.toLowerCase() === q
    );

    if (found) {
      setSearchedOrder(found);
      setNotFound(false);
    } else {
      setSearchedOrder(null);
      setNotFound(true);
    }
  };

  const currentStepIndex = searchedOrder
    ? ORDER_STEPS.findIndex(s => s.status === searchedOrder.status)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header & Lookup Bar */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Real-Time Courier Telemetry
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-950">
          Track Your Delivery
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500">
          Enter your AURA order reference (e.g. <strong className="text-zinc-800">AUR-89410</strong>) or courier tracking number.
        </p>

        {/* Search Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex gap-2 max-w-md mx-auto pt-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. AUR-89410 or DHL-558291048"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-3 py-3 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500 font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Locate
          </button>
        </form>
      </div>

      {notFound && (
        <div className="p-8 text-center bg-zinc-50 rounded-3xl border border-zinc-200 space-y-2">
          <p className="text-sm font-bold text-zinc-900">No order found matching "{query}"</p>
          <p className="text-xs text-zinc-500">
            Please check your confirmation email for the exact reference number or contact support.
          </p>
        </div>
      )}

      {searchedOrder && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Tracking Summary Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-150">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-zinc-950 px-2.5 py-1 bg-zinc-100 rounded-md">
                    {searchedOrder.orderNumber}
                  </span>
                  <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    searchedOrder.status === 'delivered'
                      ? 'bg-emerald-50 text-emerald-700'
                      : searchedOrder.status === 'shipped'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {searchedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Carrier: <strong className="text-zinc-900">{searchedOrder.carrier || 'FedEx Express'}</strong>
                  {searchedOrder.trackingNumber && (
                    <span> • Tracking ID: <strong className="font-mono text-zinc-900">{searchedOrder.trackingNumber}</strong></span>
                  )}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[10px] uppercase font-bold text-zinc-400">Estimated Delivery</p>
                <p className="text-sm font-bold text-zinc-950">{searchedOrder.shippingMethod.estimatedDays}</p>
                <p className="text-xs text-zinc-500">{searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="py-4">
              <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                <div className="absolute top-4 left-0 right-0 h-1 bg-zinc-200 -translate-y-1/2 z-0" />
                <div
                  className="absolute top-4 left-0 h-1 bg-zinc-950 -translate-y-1/2 z-0 transition-all duration-500"
                  style={{
                    width: `${(Math.max(0, currentStepIndex) / (ORDER_STEPS.length - 1)) * 100}%`
                  }}
                />

                {ORDER_STEPS.map((s, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={s.status} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-zinc-950 text-white ring-4 ring-zinc-200 scale-110 shadow-sm'
                            : isDone
                            ? 'bg-zinc-950 text-white'
                            : 'bg-zinc-200 text-zinc-500'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className={`text-[11px] mt-2 font-semibold text-center ${isDone ? 'text-zinc-950' : 'text-zinc-400'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Timeline Event Log */}
            <div className="pt-6 border-t border-zinc-150 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Live Transit Checkpoints
              </h3>

              <div className="space-y-4">
                {searchedOrder.timeline.map((event) => (
                  <div key={event.id} className="flex gap-4 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 mt-1 flex-shrink-0" />
                    <div className="flex-1 bg-zinc-50 p-3.5 rounded-xl border border-zinc-150">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-zinc-900">{event.title}</span>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(event.timestamp).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-zinc-600 mt-1">{event.description}</p>
                      {event.location && (
                        <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          <span>{event.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Package Content Breakdown */}
          <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200 space-y-4">
            <h3 className="text-sm font-serif font-bold text-zinc-950 pb-2 border-b border-zinc-200">
              Package Contents ({searchedOrder.items.length} items)
            </h3>
            <div className="divide-y divide-zinc-200/80">
              {searchedOrder.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-white border border-zinc-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">{item.product.name}</p>
                      <p className="text-[10px] text-zinc-500">
                        Qty: {item.quantity} {item.selectedVariant.color?.name ? `• ${item.selectedVariant.color.name}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-zinc-950">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
