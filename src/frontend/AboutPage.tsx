import React from 'react';
import { ShieldCheck, Leaf, Award, Globe, HeartHandshake, Compass } from 'lucide-react';
import { StorefrontView } from '../types';

interface AboutPageProps {
  onNavigate: (view: StorefrontView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Editorial Hero */}
      <section className="relative bg-zinc-950 text-white py-24 sm:py-32 overflow-hidden text-center px-4">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Our Manifesto & Atelier Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-zinc-50 leading-tight">
            Designed for Longevity. <br />
            <span className="italic font-normal text-zinc-300">Crafted with Restraint.</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed pt-2">
            Founded on the premise that everyday tools and garments should endure for decades, AURA creates timeless functional pieces using non-toxic organic raw materials and precision engineering.
          </p>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center">
              <Leaf className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-zinc-950">
              100% Circular Sustainability
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              We reject petroleum-based synthetics. Our knitwear uses GOTS certified organic wool and unbleached cotton, while our packaging is 100% biodegradable FSC certified paper.
            </p>
          </div>

          <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-zinc-950">
              Honest Materiality
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Every curve of 316L stainless steel, every slab of aerospace titanium, and every cut of vegetable-tanned Tuscan leather is left exposed in its true tactile perfection.
            </p>
          </div>

          <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-zinc-950">
              Two-Year Atelier Warranty
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              We stand behind every seam and component. If anything breaks under normal usage within two years, our master craftspeople will restore or replace it free of charge.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Image Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              The Artisan Heritage
            </span>
            <h2 className="text-3xl font-serif font-bold text-zinc-950">
              Small Batches, Uncompromising Integrity
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Unlike mass-market assembly lines, our goods are produced in numbered, limited releases. We collaborate with independent multi-generational workshops in Scandicci (Italy), Kyoto (Japan), and La Chaux-de-Fonds (Switzerland).
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              By selling directly to discerning connoisseurs without retail distributor markups, we invest more in premium raw materials than traditional luxury fashion houses.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-3 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-850 transition-colors"
              >
                Browse Current Editions →
              </button>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl bg-zinc-100">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop"
              alt="Artisan workshop"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
