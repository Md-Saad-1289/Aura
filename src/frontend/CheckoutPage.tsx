import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle,
  Lock,
  ArrowRight,
  Sparkles,
  Tag,
  ShoppingBag,
  ChevronLeft,
  Smartphone,
  Banknote,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import {
  Address,
  PaymentMethodType,
  ShippingMethod,
  StorefrontView,
  Order
} from '../types';

interface CheckoutPageProps {
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string) => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onOrderPlaced }) => {
  const {
    cart,
    subtotal,
    discount,
    appliedCoupon,
    shippingMethod,
    setShippingMethod,
    shippingCost,
    tax,
    total,
    clearCart
  } = useCart();

  const { shippingMethods, settings, createOrder, formatPrice } = useStore();
  const { currentUser, isAuthenticated } = useAuth();

  // Step state: 1 = Shipping/Contact, 2 = Shipping Method, 3 = Payment
  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address Form State
  const defaultUserAddress = currentUser?.addresses?.find(a => a.isDefault) || currentUser?.addresses?.[0];
  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: defaultUserAddress?.fullName || currentUser?.name || '',
    email: defaultUserAddress?.email || currentUser?.email || '',
    phone: defaultUserAddress?.phone || currentUser?.phone || '',
    street: defaultUserAddress?.street || '',
    apartment: defaultUserAddress?.apartment || '',
    city: defaultUserAddress?.city || '',
    state: defaultUserAddress?.state || '',
    postalCode: defaultUserAddress?.postalCode || '',
    country: defaultUserAddress?.country || 'United States'
  });

  const [useSameForBilling, setUseSameForBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState<Address>(shippingAddress);

  // Payment Form State
  const [paymentType, setPaymentType] = useState<PaymentMethodType>('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Jane Doe');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => {
      const updated = { ...prev, [field]: value };
      if (useSameForBilling) {
        setBillingAddress(updated);
      }
      return updated;
    });
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.fullName || !shippingAddress.email || !shippingAddress.street || !shippingAddress.city) {
      alert('Please fill out all required shipping address fields.');
      setStep(1);
      return;
    }

    setIsProcessing(true);

    // Simulate luxury payment gateway authorization
    setTimeout(() => {
      const newOrder = createOrder({
        customer: {
          id: currentUser?.id,
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone
        },
        items: cart,
        shippingAddress,
        billingAddress: useSameForBilling ? shippingAddress : billingAddress,
        shippingMethod,
        paymentMethod: {
          type: paymentType,
          last4: paymentType === 'credit_card' ? cardNumber.slice(-4).replace(/\s/g, '') || '4242' : undefined,
          brand: paymentType === 'credit_card' ? 'Visa' : undefined
        },
        paymentStatus: paymentType === 'cash_on_delivery' ? 'pending' : 'paid',
        status: 'new',
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        shippingCost,
        tax,
        total
      });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }

      setIsProcessing(false);
      clearCart();
      onOrderPlaced(newOrder);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-950">Your Cart is Empty</h2>
        <p className="text-xs text-zinc-500">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-zinc-950 text-white text-xs font-semibold rounded-xl"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Checkout Progress Stepper */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 ${step >= 1 ? 'text-zinc-950 font-bold' : ''}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-zinc-950 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
              1
            </span>
            <span>Shipping & Contact</span>
          </button>

          <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-zinc-950' : 'bg-zinc-200'}`} />

          <button
            onClick={() => {
              if (shippingAddress.fullName && shippingAddress.email && shippingAddress.street) {
                setStep(2);
              }
            }}
            className={`flex items-center gap-2 ${step >= 2 ? 'text-zinc-950 font-bold' : ''}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-zinc-950 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
              2
            </span>
            <span>Delivery Method</span>
          </button>

          <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-zinc-950' : 'bg-zinc-200'}`} />

          <button
            onClick={() => {
              if (shippingAddress.fullName && shippingAddress.email && shippingAddress.street) {
                setStep(3);
              }
            }}
            className={`flex items-center gap-2 ${step === 3 ? 'text-zinc-950 font-bold' : ''}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-zinc-950 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
              3
            </span>
            <span>Payment & Review</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Step Form Content (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* STEP 1: Contact & Shipping Address */}
          {step === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-150">
                <div>
                  <h2 className="text-lg font-serif font-bold text-zinc-950">
                    Contact & Shipping Destination
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Enter your recipient address for carbon-neutral priority transit.
                  </p>
                </div>
                {!isAuthenticated && (
                  <span className="text-xs text-zinc-500">
                    Guest Checkout
                  </span>
                )}
              </div>

              {/* Saved addresses selector for logged-in user */}
              {isAuthenticated && currentUser?.addresses && currentUser.addresses.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Saved Addresses
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentUser.addresses.map((addr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setShippingAddress(addr)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          shippingAddress.street === addr.street
                            ? 'border-zinc-950 bg-zinc-50 font-medium ring-1 ring-zinc-950'
                            : 'border-zinc-200 hover:bg-zinc-50'
                        }`}
                      >
                        <p className="font-bold text-zinc-900">{addr.fullName}</p>
                        <p className="text-zinc-600 truncate">{addr.street}</p>
                        <p className="text-zinc-500">{addr.city}, {addr.state} {addr.postalCode}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Address Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Full Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Email Address (for tracking alerts) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane.doe@example.com"
                      value={shippingAddress.email}
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Phone Number (for courier SMS)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 234-5678"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Country / Region *
                    </label>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Japan">Japan</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="450 West 33rd Street"
                    value={shippingAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Apt / Suite
                    </label>
                    <input
                      type="text"
                      placeholder="Apt 18B"
                      value={shippingAddress.apartment}
                      onChange={(e) => handleAddressChange('apartment', e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="New York"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="10001"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-150 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => onNavigate('cart')}
                  className="text-xs font-bold text-zinc-600 hover:text-zinc-950 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Return to Bag
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (shippingAddress.fullName && shippingAddress.email && shippingAddress.street && shippingAddress.city) {
                      setStep(2);
                    } else {
                      alert('Please complete all required address fields.');
                    }
                  }}
                  className="px-6 py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>Continue to Delivery Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Method Selection */}
          {step === 2 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
              <div className="pb-4 border-b border-zinc-150">
                <h2 className="text-lg font-serif font-bold text-zinc-950">
                  Select Delivery Courier & Speed
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Delivering to: <strong className="text-zinc-900">{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.postalCode}</strong>
                </p>
              </div>

              <div className="space-y-3">
                {shippingMethods.map((sm) => {
                  const isFree = sm.id === 'ship-std' && subtotal >= (settings.freeShippingThreshold || 150);
                  const isSelected = shippingMethod.id === sm.id;

                  return (
                    <div
                      key={sm.id}
                      onClick={() => setShippingMethod(sm)}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-zinc-950 bg-zinc-50/80 ring-1 ring-zinc-950 shadow-2xs'
                          : 'border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_speed"
                          checked={isSelected}
                          onChange={() => setShippingMethod(sm)}
                          className="accent-zinc-950"
                        />
                        <div>
                          <p className="text-xs font-bold text-zinc-950">{sm.name}</p>
                          <p className="text-[11px] text-zinc-500">{sm.description}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-zinc-950">
                          {isFree ? <span className="text-emerald-700 font-bold">Free</span> : formatPrice(sm.price)}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-mono">{sm.estimatedDays}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-zinc-150 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-zinc-600 hover:text-zinc-950 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Edit Address
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Final Review */}
          {step === 3 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
              <div className="pb-4 border-b border-zinc-150">
                <h2 className="text-lg font-serif font-bold text-zinc-950">
                  Payment Method & Authentication
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Transactions are encrypted using 256-bit SSL protocols.
                </p>
              </div>

              {/* Payment Type Selection Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('credit_card')}
                  className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    paymentType === 'credit_card'
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('apple_pay')}
                  className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    paymentType === 'apple_pay'
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('paypal')}
                  className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    paymentType === 'paypal'
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-white'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('cash_on_delivery')}
                  className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    paymentType === 'cash_on_delivery'
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-white'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>COD</span>
                </button>
              </div>

              {/* Credit Card Interactive Simulator Form */}
              {paymentType === 'credit_card' && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-zinc-900 text-white rounded-2xl space-y-4 shadow-md max-w-sm mx-auto">
                    <div className="flex justify-between items-center text-xs text-zinc-400 font-mono">
                      <span>AURA BLACK CARD</span>
                      <span className="font-bold text-amber-400">VISA</span>
                    </div>
                    <p className="text-lg font-mono tracking-widest text-zinc-200 pt-2">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                    <div className="flex justify-between text-xs font-mono text-zinc-400">
                      <div>
                        <p className="text-[9px] uppercase">Cardholder</p>
                        <p className="text-zinc-100 font-semibold">{cardHolder || 'JANE DOE'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase">Expires</p>
                        <p className="text-zinc-100 font-semibold">{cardExpiry || '12/28'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-800 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 font-mono focus:bg-white focus:outline-none focus:border-zinc-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-zinc-800 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs font-semibold text-zinc-800 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-900 font-mono text-center focus:bg-white focus:outline-none focus:border-zinc-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentType === 'apple_pay' && (
                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 text-center space-y-2">
                  <Smartphone className="w-8 h-8 text-zinc-900 mx-auto" />
                  <h4 className="text-sm font-bold text-zinc-900">Apple Pay Express Authorization</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Touch ID or Face ID will authenticate your purchase instantly with encrypted biometric token.
                  </p>
                </div>
              )}

              {paymentType === 'paypal' && (
                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 text-center space-y-2">
                  <DollarSign className="w-8 h-8 text-blue-600 mx-auto" />
                  <h4 className="text-sm font-bold text-zinc-900">PayPal Express Checkout</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    You will be securely routed to PayPal to complete authorization and buyer protection.
                  </p>
                </div>
              )}

              {paymentType === 'cash_on_delivery' && (
                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 text-center space-y-2">
                  <Banknote className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-zinc-900">Cash / Card on Delivery</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Pay via contactless card reader or exact cash directly upon courier delivery at your doorstep.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-150 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-zinc-600 hover:text-zinc-950 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Shipping
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="px-8 py-4 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Authorizing & Reserving Stock...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirm & Place Order ({formatPrice(total)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary Sidebar (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200 space-y-5">
            <h3 className="text-base font-serif font-bold text-zinc-950 pb-3 border-b border-zinc-200">
              Bag Overview ({cart.length} items)
            </h3>

            {/* Line items list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-zinc-200/60">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-zinc-200 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 truncate max-w-[170px]">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        Qty: {item.quantity} {item.selectedVariant.color?.name ? `• ${item.selectedVariant.color.name}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="space-y-2 pt-4 border-t border-zinc-200 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping ({shippingMethod.name})</span>
                <span className="font-semibold text-zinc-900">
                  {shippingCost === 0 ? <span className="text-emerald-700 font-bold">Free</span> : formatPrice(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Sales Tax ({settings.taxRate}%)</span>
                <span className="font-semibold text-zinc-900">{formatPrice(tax)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-zinc-950 pt-3 border-t border-zinc-200">
                <span>Final Total Due</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-zinc-200 text-[11px] text-zinc-500 space-y-1">
              <p className="font-semibold text-zinc-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Guaranteed Satisfaction
              </p>
              <p>Carbon-neutral shipping & 30-day effortless return warranty included.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
