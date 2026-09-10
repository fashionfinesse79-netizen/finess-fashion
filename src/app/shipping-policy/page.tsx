import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, Package, Clock, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | FINESSE FASHION BY DHANI',
  description: 'Shipping timelines, courier partners, and delivery standards for FINESSE FASHION BY DHANI (ffbydhani.com).',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Breadcrumb */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#7A3B43] hover:text-[#58111A] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="border-b border-[#58111A]/15 pb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
            ATELIER LOGISTICS
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] mt-2 uppercase">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs text-[#7A3B43] mt-2">
            Last Updated: September 2026 • FINESSE FASHION BY DHANI (ffbydhani.com)
          </p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 border border-[#58111A]/15 text-center space-y-2">
            <Clock className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#58111A]">Fast Dispatch</h3>
            <p className="text-[11px] text-[#7A3B43]">Dispatched within 24–48 business hours from Mumbai Atelier</p>
          </div>
          <div className="bg-white p-5 border border-[#58111A]/15 text-center space-y-2">
            <Truck className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#58111A]">3–7 Days Delivery</h3>
            <p className="text-[11px] text-[#7A3B43]">Express door-to-door delivery across India</p>
          </div>
          <div className="bg-white p-5 border border-[#58111A]/15 text-center space-y-2">
            <Package className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#58111A]">Luxury Packaging</h3>
            <p className="text-[11px] text-[#7A3B43]">Tamper-proof signature garment box &amp; garment bag</p>
          </div>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white p-8 sm:p-12 border border-[#58111A]/15 shadow-sm space-y-8 text-xs text-[#58111A]/80 leading-relaxed font-light">
          
          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              1. Domestic Shipping Coverage
            </h2>
            <p>
              FINESSE FASHION BY DHANI delivers across all serviceable postal pin codes in India via premium tier courier partners including <strong>BlueDart, Delhivery, DTDC, and India Post Speed Post</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              2. Shipping Charges &amp; Fees
            </h2>
            <p>
              We are pleased to provide <strong>100% Complimentary White-Glove Shipping</strong> on all domestic orders across India, with absolutely no minimum purchase requirement.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>All Orders (Prepaid &amp; COD):</strong> <strong>FREE (₹0)</strong> across all serviceable postal pin codes in India.</li>
              <li><strong>Priority Courier Handling:</strong> All parcels are dispatched via premium air courier partners at zero extra logistics cost.</li>
              <li><strong>Gift Box Packaging:</strong> Custom atelier gift packaging and garment care protection are included complimentary with every shipment.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              3. Processing &amp; Delivery Timelines
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Standard Dispatch:</strong> In-stock capsule pieces are tailored, steam-pressed, and dispatched within <strong>24 to 48 hours</strong> of payment authorization.</li>
              <li><strong>Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> Delivered within <strong>2 to 4 business days</strong>.</li>
              <li><strong>Rest of India:</strong> Delivered within <strong>4 to 7 business days</strong>.</li>
              <li><strong>Bespoke / Custom Fitted Pieces:</strong> Handcrafted custom orders may require 7 to 10 days for tailoring prior to courier handover.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              4. Real-Time Tracking
            </h2>
            <p>
              Once your parcel departs our atelier, you will receive an automated email and SMS notification containing your <strong>Airway Bill (AWB) Tracking Number</strong> and courier partner link.
            </p>
            <p>
              You can track your parcel live anytime by visiting our <Link href="/order-tracking" className="underline font-medium text-[#58111A]">Order Tracking Page</Link> and entering your Order ID.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              5. Delivery Inspection &amp; Damaged Shipments
            </h2>
            <p>
              All shipments are dispatched in tamper-evident sealed packaging. If you notice that the outer security seal has been tampered with or damaged upon arrival, please <strong>refuse delivery</strong> and immediately alert our team at <a href="mailto:concierge@ffbydhani.com" className="underline font-medium">concierge@ffbydhani.com</a> or +91 98200 88888.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
