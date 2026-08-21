import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ShoppingBag,
  Users,
  Award,
  ArrowUpRight,
  Sparkles,
  Printer
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ReportsAnalytics: React.FC = () => {
  const { orders, products, formatPrice, settings } = useStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'ytd' | 'all'>('30d');

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Category sales breakdown
  const categorySales: Record<string, { count: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((it) => {
      const cat = it.product.category || 'General';
      if (!categorySales[cat]) {
        categorySales[cat] = { count: 0, revenue: 0 };
      }
      categorySales[cat].count += it.quantity;
      categorySales[cat].revenue += it.unitPrice * it.quantity;
    });
  });

  const totalCategoryRev = Object.values(categorySales).reduce((sum, c) => sum + c.revenue, 0) || 1;

  // Top products
  const productSales: Record<string, { name: string; brand: string; units: number; revenue: number; image: string }> = {};
  orders.forEach((o) => {
    o.items.forEach((it) => {
      const pid = it.productId;
      if (!productSales[pid]) {
        productSales[pid] = {
          name: it.product.name,
          brand: it.product.brand,
          units: 0,
          revenue: 0,
          image: it.product.images[0]
        };
      }
      productSales[pid].units += it.quantity;
      productSales[pid].revenue += it.unitPrice * it.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Product,Brand,Units Sold,Gross Revenue\n' +
      topProducts.map((p) => `"${p.name}","${p.brand}",${p.units},${p.revenue}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aura_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
            Financial & Intelligence Reports
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Audit commerce velocity, category dominance, and unit margins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <div className="flex items-center bg-white border border-zinc-200 rounded-xl p-1 shadow-2xs">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'ytd', label: 'YTD' },
              { id: 'all', label: 'All Time' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  timeRange === t.id
                    ? 'bg-zinc-950 text-white'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Print Executive Report"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-600" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Net Revenue</span>
          <p className="text-3xl font-mono font-bold text-zinc-950">{formatPrice(totalRevenue)}</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% vs annualized target
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Average Cart Value</span>
          <p className="text-3xl font-mono font-bold text-zinc-950">{formatPrice(avgOrderValue)}</p>
          <p className="text-[11px] text-zinc-500">Across {totalOrders} recorded checkouts</p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Inventory Turnover</span>
          <p className="text-3xl font-mono font-bold text-emerald-700">4.8x</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Optimal luxury stocking tier</p>
        </div>
      </div>

      {/* Grid: Category Dominance & Bestseller Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Share (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-serif font-bold text-zinc-950">
              Revenue by Discipline
            </h3>
            <p className="text-xs text-zinc-500">Percentage distribution of gross volume</p>
          </div>

          <div className="space-y-4">
            {Object.entries(categorySales).map(([category, data]) => {
              const percent = Math.round((data.revenue / totalCategoryRev) * 100);
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-900">{category}</span>
                    <span className="font-mono text-zinc-950">{formatPrice(data.revenue)} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-zinc-950 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Bestsellers (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
            <div>
              <h3 className="text-base font-serif font-bold text-zinc-950">
                Top Performing Releases
              </h3>
              <p className="text-xs text-zinc-500">Ranked by gross sales volume</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="divide-y divide-zinc-150">
            {topProducts.map((p, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-serif font-bold text-zinc-400 text-sm">
                    #{idx + 1}
                  </span>
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-zinc-100 border border-zinc-200" />
                  <div>
                    <p className="font-bold text-zinc-900">{p.name}</p>
                    <p className="text-[10px] text-zinc-400">{p.brand} • {p.units} units shipped</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-zinc-950 font-mono">{formatPrice(p.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
