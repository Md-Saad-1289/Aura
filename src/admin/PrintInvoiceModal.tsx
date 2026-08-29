import React, { useState } from 'react';
import {
  Printer,
  X,
  Download,
  Copy,
  Check,
  FileText,
  Package,
  Truck,
  ShieldCheck,
  QrCode,
  Sparkles
} from 'lucide-react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';

interface PrintInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({ order, onClose }) => {
  const { formatPrice, settings } = useStore();
  const [docType, setDocType] = useState<'invoice' | 'packingslip' | 'label'>('invoice');
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const getPaymentMethodDisplay = (paymentMethod: any): string => {
    if (!paymentMethod) return 'Standard';
    if (typeof paymentMethod === 'string') {
      if (paymentMethod === 'cash_on_delivery') return 'Cash on Delivery';
      if (paymentMethod === 'credit_card' || paymentMethod === 'stripe') return 'Credit Card';
      if (paymentMethod === 'apple_pay') return 'Apple Pay';
      if (paymentMethod === 'google_pay') return 'Google Pay';
      if (paymentMethod === 'bank_transfer') return 'Wire Transfer';
      return paymentMethod.replace(/_/g, ' ');
    }
    if (typeof paymentMethod === 'object') {
      const type = paymentMethod.type || 'credit_card';
      const last4 = paymentMethod.last4 ? ` (•••• ${paymentMethod.last4})` : '';
      if (type === 'cash_on_delivery') return 'Cash on Delivery';
      if (type === 'credit_card' || type === 'card' || type === 'stripe') return `Card${last4}`;
      if (type === 'apple_pay') return 'Apple Pay';
      if (type === 'google_pay') return 'Google Pay';
      if (type === 'bank_transfer') return 'Wire Transfer';
      return `${type.replace(/_/g, ' ')}${last4}`;
    }
    return 'Standard';
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.error('Print trigger failed:', err);
    }
  };

  const handleCopySummary = () => {
    const summary = `
========================================
${settings.storeName.toUpperCase()} - TAX INVOICE
Invoice Ref: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Customer: ${order.customer?.name || 'Customer'} (${order.customer?.email || ''})
Destination: ${order.shippingAddress?.street || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.country || ''}
Carrier: ${order.carrier || 'FedEx Express'} | Tracking: ${order.trackingNumber || 'Pending'}
----------------------------------------
Items:
${(order.items || []).map(it => `- ${it.product?.name || 'Item'} (Qty: ${it.quantity}) - ${formatPrice((it.unitPrice || 0) * (it.quantity || 1))}`).join('\n')}
----------------------------------------
Subtotal: ${formatPrice(order.subtotal || 0)}
Discount: -${formatPrice(order.discount || 0)}
Shipping: ${order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost || 0)}
Tax: ${formatPrice(order.tax || 0)}
TOTAL PAID: ${formatPrice(order.total || 0)}
Payment Status: ${(order.paymentStatus || 'paid').toUpperCase()} (${getPaymentMethodDisplay(order.paymentMethod)})
========================================
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHTML = () => {
    const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice_${order.orderNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #18181b; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e4e4e7; padding-bottom: 20px; margin-bottom: 24px; }
    .brand { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .title { font-size: 20px; font-weight: 700; text-align: right; }
    .meta { font-size: 12px; color: #71717a; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; font-size: 13px; }
    .card { background: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px; }
    .card h4 { margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    th { text-align: left; background: #f4f4f5; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; }
    td { padding: 12px; border-bottom: 1px solid #e4e4e7; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .totals { margin-left: auto; width: 280px; font-size: 13px; }
    .totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
    .totals-total { border-top: 2px solid #18181b; padding-top: 8px; margin-top: 8px; font-size: 16px; font-weight: bold; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e4e4e7; font-size: 11px; color: #71717a; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">${settings.storeName}</div>
      <div class="meta">${settings.address} • ${settings.supportEmail}</div>
    </div>
    <div>
      <div class="title">${docType === 'packingslip' ? 'PACKING SLIP' : docType === 'label' ? 'DISPATCH MANIFEST' : 'TAX INVOICE'}</div>
      <div class="meta">Ref: #${order.orderNumber} • ${new Date(order.createdAt).toLocaleDateString()}</div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h4>Billed & Shipped To</h4>
      <strong>${order.shippingAddress?.fullName || order.customer?.name || 'Customer'}</strong><br/>
      ${order.shippingAddress?.street || ''}<br/>
      ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.postalCode || ''}<br/>
      ${order.shippingAddress?.country || 'United States'}<br/>
      <small style="color:#71717a">${order.shippingAddress?.phone || order.customer?.email || ''}</small>
    </div>
    <div class="card">
      <h4>Fulfillment & Payment</h4>
      <strong>Courier:</strong> ${order.carrier || 'FedEx Express'}<br/>
      <strong>Tracking #:</strong> ${order.trackingNumber || 'Pending Assignment'}<br/>
      <strong>Payment Status:</strong> ${(order.paymentStatus || 'paid').toUpperCase()} (${getPaymentMethodDisplay(order.paymentMethod)})<br/>
      <strong>Order Status:</strong> ${(order.status || 'new').toUpperCase()}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item Description</th>
        <th>SKU</th>
        <th class="text-center">Qty</th>
        <th class="text-right">Unit Price</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${(order.items || []).map(it => `
        <tr>
          <td>
            <strong>${it.product?.name || 'Store Item'}</strong>
            ${it.selectedVariant?.color?.name ? `<br/><small style="color:#71717a">Color: ${it.selectedVariant.color.name}</small>` : ''}
          </td>
          <td style="font-family: monospace; color: #71717a;">${it.product?.sku || 'SKU-N/A'}</td>
          <td class="text-center">${it.quantity}</td>
          <td class="text-right">${formatPrice(it.unitPrice || 0)}</td>
          <td class="text-right"><strong>${formatPrice((it.unitPrice || 0) * (it.quantity || 1))}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Subtotal:</span><span>${formatPrice(order.subtotal || 0)}</span></div>
    ${order.discount > 0 ? `<div class="totals-row" style="color: #059669;"><span>Discount:</span><span>-${formatPrice(order.discount)}</span></div>` : ''}
    <div class="totals-row"><span>Shipping:</span><span>${order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost || 0)}</span></div>
    <div class="totals-row"><span>Tax:</span><span>${formatPrice(order.tax || 0)}</span></div>
    <div class="totals-row totals-total"><span>Total:</span><span>${formatPrice(order.total || 0)}</span></div>
  </div>

  <div class="footer">
    Thank you for choosing ${settings.storeName}. For inquiries, contact ${settings.supportEmail}.<br/>
    Authorized Official Document • Generated on ${new Date().toLocaleString()}
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.orderNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Controls Toolbar (Hidden during print) */}
        <div className="no-print p-4 sm:p-5 bg-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zinc-800 rounded-xl">
              <Printer className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-white">
                Print & Document Dispatch Console
              </h2>
              <p className="text-[11px] text-zinc-400">
                Order Ref: <span className="font-mono text-zinc-200">{order.orderNumber}</span> • Customer: {order.customer.name}
              </p>
            </div>
          </div>

          {/* Document Type Switcher */}
          <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setDocType('invoice')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                docType === 'invoice'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </button>
            <button
              onClick={() => setDocType('packingslip')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                docType === 'packingslip'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Packing Slip</span>
            </button>
            <button
              onClick={() => setDocType('label')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                docType === 'label'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Shipping Label</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              title="Send to Printer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Now</span>
            </button>

            <button
              onClick={handleDownloadHTML}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs flex items-center gap-1"
              title="Download HTML Document"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopySummary}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs flex items-center gap-1"
              title="Copy Summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-zinc-50">
          
          <div id="printable-invoice" className="bg-white p-8 sm:p-10 rounded-2xl border border-zinc-200 shadow-sm max-w-3xl mx-auto text-zinc-900 space-y-8">
            
            {/* Header / Brand Details */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-zinc-950 uppercase">
                    {settings.storeName}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
                    Official
                  </span>
                </div>
                <p className="text-xs text-zinc-500">{settings.address}</p>
                <p className="text-xs text-zinc-500">{settings.supportEmail} • {settings.supportPhone}</p>
                <p className="text-[11px] text-zinc-400 font-mono">Tax / VAT ID: CHE-928.341.109-MWST</p>
              </div>

              <div className="sm:text-right space-y-1">
                <span className="inline-block px-3 py-1 bg-zinc-950 text-white rounded-md text-xs font-mono font-bold tracking-wider uppercase">
                  {docType === 'invoice' && 'TAX INVOICE'}
                  {docType === 'packingslip' && 'WAREHOUSE PACKING SLIP'}
                  {docType === 'label' && 'COURIER DISPATCH MANIFEST'}
                </span>
                <p className="text-sm font-mono font-bold text-zinc-950 pt-1">
                  #{order.orderNumber}
                </p>
                <p className="text-xs text-zinc-500">
                  Issue Date: <strong className="text-zinc-800">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                </p>
                <p className="text-xs text-zinc-500">
                  Payment Status: <strong className="text-emerald-700 uppercase font-bold">{order.paymentStatus}</strong>
                </p>
              </div>
            </div>

            {/* Recipient / Courier Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1.5">
                <p className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider">
                  Deliver To / Consignee
                </p>
                <p className="font-bold text-zinc-950 text-sm">{order.shippingAddress?.fullName || order.customer?.name || 'Customer'}</p>
                <p className="text-zinc-700 leading-relaxed">
                  {order.shippingAddress?.street || ''}
                  {order.shippingAddress?.apartment && `, ${order.shippingAddress.apartment}`}
                </p>
                <p className="text-zinc-700">
                  {order.shippingAddress?.city || ''}{order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress?.postalCode || ''}
                </p>
                <p className="font-semibold text-zinc-900">{order.shippingAddress?.country || 'United States'}</p>
                <p className="text-zinc-500 pt-1 font-mono">{order.shippingAddress?.phone || order.customer?.email || ''}</p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1.5">
                <p className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider">
                  Fulfillment & Logistics
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Courier</span>
                    <strong className="text-zinc-900 font-semibold">{order.carrier || 'FedEx Express'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Tracking ID</span>
                    <strong className="font-mono text-zinc-900">{order.trackingNumber || 'TRK-PENDING'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Payment Method</span>
                    <strong className="text-zinc-900 capitalize">{getPaymentMethodDisplay(order.paymentMethod)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Dispatch Status</span>
                    <strong className="text-emerald-700 capitalize">{order.status || 'new'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-zinc-100/80 text-zinc-500 uppercase text-[10px] font-bold tracking-wider border-b border-zinc-200">
                    <th className="py-3 px-4">Item & Variant</th>
                    <th className="py-3 px-4 font-mono">SKU</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    {docType === 'invoice' && <th className="py-3 px-4 text-right">Unit Price</th>}
                    {docType === 'invoice' && <th className="py-3 px-4 text-right">Subtotal</th>}
                    {docType === 'packingslip' && <th className="py-3 px-4 text-center">Verification</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-800">
                  {(order.items || []).map((it) => (
                    <tr key={it.id} className="hover:bg-zinc-50/50">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-zinc-950">{it.product?.name || 'Store Item'}</p>
                        <p className="text-[11px] text-zinc-500">
                          {it.product?.brand || ''} {it.selectedVariant?.color?.name ? `• Color: ${it.selectedVariant.color.name}` : ''}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                        {it.product?.sku || 'SKU-N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-zinc-950">
                        {it.quantity}
                      </td>
                      {docType === 'invoice' && (
                        <td className="py-3.5 px-4 text-right font-mono text-zinc-700">
                          {formatPrice(it.unitPrice || 0)}
                        </td>
                      )}
                      {docType === 'invoice' && (
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-zinc-950">
                          {formatPrice((it.unitPrice || 0) * (it.quantity || 1))}
                        </td>
                      )}
                      {docType === 'packingslip' && (
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block w-4 h-4 border-2 border-zinc-400 rounded"></span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Sign-off */}
            {docType === 'invoice' && (
              <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-2">
                <div className="text-[11px] text-zinc-400 space-y-2 max-w-sm">
                  <div className="flex items-center gap-1.5 text-zinc-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Authenticated Purchase</span>
                  </div>
                  <p>
                    All merchandise is serialized, quality-tested, and covered by standard 24-month manufacturer warranty.
                  </p>
                  {/* Simulated Barcode */}
                  <div className="pt-2">
                    <div className="h-9 w-48 bg-zinc-900 flex items-center justify-between px-2 font-mono text-[9px] text-white tracking-widest">
                      ||| |||| | ||||| || |||
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500">{order.orderNumber}</span>
                  </div>
                </div>

                <div className="w-full sm:w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold text-zinc-900">{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Promotional Discount:</span>
                      <span className="font-mono">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping & Handling:</span>
                    <span className="font-mono font-semibold text-zinc-900">
                      {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Estimated Sales Tax / VAT:</span>
                    <span className="font-mono font-semibold text-zinc-900">{formatPrice(order.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t-2 border-zinc-900">
                    <span>Total Paid:</span>
                    <span className="font-mono text-base">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Packing Slip Warehouse Verification Footer */}
            {docType === 'packingslip' && (
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-200 text-xs">
                <div className="space-y-4">
                  <p className="font-bold text-zinc-500 uppercase text-[10px]">Quality Inspection</p>
                  <p className="text-zinc-600">Checked By: __________________________</p>
                  <p className="text-zinc-600">Package Weight: ________ kg</p>
                </div>
                <div className="space-y-4 text-right">
                  <p className="font-bold text-zinc-500 uppercase text-[10px]">Dispatch Clearance</p>
                  <p className="text-zinc-600">Date Dispatched: ____ / ____ / 2026</p>
                  <p className="text-zinc-600">Seal Serial #: _____________________</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-6 border-t border-zinc-200 text-center text-[10px] text-zinc-400 space-y-1">
              <p>
                {settings.storeName} • {settings.address} • {settings.supportEmail}
              </p>
              <p>
                This electronic document is valid without physical seal under global electronic transaction regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
