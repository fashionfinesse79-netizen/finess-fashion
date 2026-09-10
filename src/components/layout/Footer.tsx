'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Lock, Sparkles } from 'lucide-react';

export default function Footer() {
  const { showToast } = useStore();
  const { user } = useAuth();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Thank you for joining the FINESSE Private Circle.');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#58111A] text-[#FAF6F0] pt-20 pb-12 border-t border-[#D4AF37]/30">
      
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-[#D4AF37]/20 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <Truck className="w-6 h-6 text-[#D4AF37] stroke-[1.25]" />
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF6F0]">White-Glove Shipping</h4>
          <p className="text-[11px] text-gray-300 leading-relaxed font-light">Complimentary express shipping across India on all orders.</p>
        </div>
        <div className="flex flex-col items-center md:items-start space-y-2">
          <RefreshCw className="w-6 h-6 text-[#D4AF37] stroke-[1.25]" />
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF6F0]">Seamless Returns</h4>
          <p className="text-[11px] text-gray-300 leading-relaxed font-light">14-day hassle-free return window with white-glove doorstep pick-up.</p>
        </div>
        <div className="flex flex-col items-center md:items-start space-y-2">
          <ShieldCheck className="w-6 h-6 text-[#D4AF37] stroke-[1.25]" />
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF6F0]">Bespoke Craftsmanship</h4>
          <p className="text-[11px] text-gray-300 leading-relaxed font-light">Each piece hand-finished in our luxury atelier by master artisans.</p>
        </div>
        <div className="flex flex-col items-center md:items-start space-y-2">
          <Lock className="w-6 h-6 text-[#D4AF37] stroke-[1.25]" />
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF6F0]">Razorpay Encryption</h4>
          <p className="text-[11px] text-gray-300 leading-relaxed font-light">PCI-DSS Level 1 256-bit encrypted checkout via Razorpay.</p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
        
        {/* Brand Column */}
        <div className="sm:col-span-2 space-y-6">
          <Link href="/" className="inline-block">
            <span className="font-serif-luxury text-3xl tracking-[0.25em] text-[#FAF6F0] uppercase font-bold block">
              FINESSE FASHION
            </span>
            <span className="text-[9px] tracking-[0.45em] uppercase text-[#D4AF37] block mt-0.5 font-medium">
              BY DHANI • THE ART OF ELEGANCE
            </span>
          </Link>
          <p className="text-xs text-gray-200 leading-relaxed max-w-sm font-light">
            Created for the woman who moves with confidence, dresses with intention, and finds beauty in every architectural detail.
          </p>

          {/* Newsletter Box */}
          <div className="pt-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#FAF6F0] mb-2 font-semibold">
              JOIN THE FINESSE WORLD
            </h4>
            <p className="text-[11px] text-gray-300 mb-3 font-light">
              Be the first to discover private capsule edits and fashion week showcases.
            </p>
            <form onSubmit={handleSubscribe} className="flex max-w-md">
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#3F0A11] border border-[#D4AF37]/30 text-xs text-[#FAF6F0] focus:outline-none focus:border-[#D4AF37]"
                required
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="px-5 bg-[#D4AF37] text-[#58111A] text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center font-bold"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF6F0] mb-5">
            BOUTIQUE
          </h4>
          <ul className="space-y-3 text-xs text-gray-300 font-light">
            <li>
              <Link href="/shop?collection=New+Arrivals" className="hover:text-[#D4AF37] transition-colors">
                New In
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Occasion+Wear" className="hover:text-[#D4AF37] transition-colors">
                Occasion Wear
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Co-Ord+Sets" className="hover:text-[#D4AF37] transition-colors">
                Co-Ord Sets
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Outerwear" className="hover:text-[#D4AF37] transition-colors">
                Tailored Outerwear
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Dresses" className="hover:text-[#D4AF37] transition-colors">
                Silk Gowns & Dresses
              </Link>
            </li>
          </ul>
        </div>

        {/* Client Care */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF6F0] mb-5">
            CLIENT CARE
          </h4>
          <ul className="space-y-3 text-xs text-gray-300 font-light">
            <li>
              <Link href="/order-tracking" className="hover:text-[#D4AF37] transition-colors">
                Order Tracking
              </Link>
            </li>
            <li>
              <Link href="/size-guide" className="hover:text-[#D4AF37] transition-colors">
                Size & Fit Guide
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-[#D4AF37] transition-colors">
                My Account
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                Atelier Assistance
              </Link>
            </li>
            {user?.isAdmin && (
              <li>
                <Link href="/admin" className="hover:text-[#D4AF37] transition-colors text-[#D4AF37] font-semibold">
                  Admin Console
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Mandatory Razorpay Policies */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF6F0] mb-5">
            POLICIES
          </h4>
          <ul className="space-y-3 text-xs text-gray-300 font-light">
            <li>
              <Link href="/terms-and-conditions" className="hover:text-[#D4AF37] transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:text-[#D4AF37] transition-colors">
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link href="/cancellation-and-refund" className="hover:text-[#D4AF37] transition-colors">
                Cancellation & Refund
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Social */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF6F0] mb-5">
            THE HOUSE
          </h4>
          <ul className="space-y-3 text-xs text-gray-300 font-light mb-6">
            <li>
              <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                Our Story & Heritage
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                Atelier Location
              </Link>
            </li>
          </ul>

          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/finesse__fashion__?igsi=MWEzdnBuMmhiOXVzag=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#3F0A11] border border-[#D4AF37]/30 flex items-center justify-center text-gray-300 hover:text-[#58111A] hover:bg-[#D4AF37] transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#D4AF37]/20 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-300 space-y-4 md:space-y-0">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} FINESSE FASHION BY DHANI. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-gray-400">
            <Link href="/terms-and-conditions" className="hover:text-[#D4AF37] transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:text-[#D4AF37] transition-colors">Shipping</Link>
            <span>•</span>
            <Link href="/cancellation-and-refund" className="hover:text-[#D4AF37] transition-colors">Refunds</Link>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[#D4AF37]">
          <span>UPI</span>
          <span>RAZORPAY SECURE</span>
          <span>VISA</span>
          <span>MASTERCARD</span>
          <span>NET BANKING</span>
        </div>
      </div>
    </footer>
  );
}
