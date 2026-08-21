import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle, Send, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Client Relations
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-950">
          Concierge Support
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500">
          Whether you need bespoke sizing advice, order adjustments, or warranty assistance, our specialists are at your disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Studio Locations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-50 rounded-3xl p-6 sm:p-8 border border-zinc-200 space-y-6">
            <h3 className="text-lg font-serif font-bold text-zinc-950">
              Direct Inquiries
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 shadow-2xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900">Email Concierge</p>
                  <p className="text-zinc-600 mt-0.5">{settings.supportEmail}</p>
                  <p className="text-[11px] text-zinc-400">Average response time: &lt; 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900">Telephone Client Service</p>
                  <p className="text-zinc-600 mt-0.5">{settings.supportPhone}</p>
                  <p className="text-[11px] text-zinc-400">Mon–Fri: 9:00 AM – 6:00 PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 shadow-2xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900">Design Studio & Headquarters</p>
                  <p className="text-zinc-600 mt-0.5">{settings.address}</p>
                  <p className="text-[11px] text-zinc-400">Visits by appointment only</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 space-y-2">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Bespoke & Corporate Orders
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              We offer personalized laser engravings, bespoke leather monogramming, and volume gifting packages for architecture studios and corporate partners.
            </p>
          </div>
        </div>

        {/* Right: Message Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-zinc-950">
              Send a Message to our Concierge
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Fill out the form below and an atelier representative will contact you promptly.
            </p>
          </div>

          {sent && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Thank you! Your message has been routed to our specialist team.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="Product Inquiry / Sizing Assistance / Order Modification"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Message *
              </label>
              <textarea
                required
                rows={5}
                placeholder="How may our concierge team assist you today?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <button
              type="submit"
              className="px-7 py-3.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
