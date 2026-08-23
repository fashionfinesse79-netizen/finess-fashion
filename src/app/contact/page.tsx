'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock } from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useStore();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    showToast('Your message has been sent to our Atelier Concierge.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-white">
      
      {/* Header */}
      <div className="text-center pb-8 border-b border-[#58111A]/15">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
          ATELIER CLIENT CONCIERGE
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] mt-1 uppercase">
          CONTACT US
        </h1>
        <p className="text-xs text-[#7A3B43] mt-2 max-w-md mx-auto">
          Our client styling team is available for styling advice, custom fitting consultations, and order assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Atelier Info Cards */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-[#FAF6F0] p-8 border border-[#58111A]/15 space-y-6 shadow-sm">
            <h3 className="font-serif-luxury text-2xl text-[#58111A] uppercase">
              FLAGSHIP ATELIER
            </h3>

            <div className="space-y-4 text-xs text-[#7A3B43]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#58111A]">FINESSE FASHION Flagship Atelier</h4>
                  <p>Penthouse Suite 4, The Grand Residences</p>
                  <p>Worli Sea Face, Mumbai, Maharashtra 400018</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#58111A]">Email Concierge</h4>
                  <a href="mailto:concierge@finesse.fashion" className="hover:underline">concierge@finesse.fashion</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#58111A]">Telephone Assistance</h4>
                  <a href="tel:+919820088888" className="hover:underline">+91 98200 88888</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#58111A]">Hours of Operation</h4>
                  <p>Monday — Saturday: 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Button */}
            <div className="pt-2 border-t border-[#58111A]/15">
              <a
                href="https://wa.me/919820088888?text=Hello%20FINESSE%20Atelier,%20I%20would%20like%20to%20inquire%20about%20a%20garment."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#25D366] text-white text-xs uppercase tracking-widest font-semibold rounded-none flex items-center justify-center gap-2 hover:bg-[#1EBE5D] transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4 fill-white" /> CONNECT VIA WHATSAPP
              </a>
            </div>

          </div>

        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-[#FAF6F0] p-8 border border-[#58111A]/15 shadow-sm">
          <h2 className="font-serif-luxury text-3xl text-[#58111A] mb-6 uppercase">
            Send an Inquiry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A3B43] font-semibold mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="Ananya Singhania"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A3B43] font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="ananya@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7A3B43] font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98200 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7A3B43] font-semibold mb-1">
                How Can We Assist You?
              </label>
              <textarea
                rows={5}
                placeholder="Please include product names, custom sizing requests, or event dates..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <button
              type="submit"
              className="px-9 py-4 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors flex items-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" /> SEND INQUIRY
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
