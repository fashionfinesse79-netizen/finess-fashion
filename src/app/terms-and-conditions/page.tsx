import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | FINESSE FASHION BY DHANI',
  description: 'Terms of service and user agreements for FINESSE FASHION BY DHANI (ffbydhani.com).',
};

export default function TermsPage() {
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
            LEGAL FRAMEWORK
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] mt-2 uppercase">
            Terms & Conditions
          </h1>
          <p className="text-xs text-[#7A3B43] mt-2">
            Last Updated: September 2026 • FINESSE FASHION BY DHANI (ffbydhani.com)
          </p>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white p-8 sm:p-12 border border-[#58111A]/15 shadow-sm space-y-8 text-xs text-[#58111A]/80 leading-relaxed font-light">
          
          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              1. Introduction & Acceptance
            </h2>
            <p>
              Welcome to <strong>FINESSE FASHION BY DHANI</strong> (&quot;the House&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), accessible via <strong>ffbydhani.com</strong>. These Terms &amp; Conditions govern your browsing, access, and purchase of luxury apparel, couture sets, and bespoke garments through our platform.
            </p>
            <p>
              By accessing our website or placing an order, you agree to be bound by these terms. If you do not accept these conditions in full, please refrain from using the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              2. Intellectual Property & Brand Assets
            </h2>
            <p>
              All designs, bespoke patterns, photographs, lookbooks, text, trademarks, and logos displayed on <strong>ffbydhani.com</strong> are the exclusive intellectual property of FINESSE FASHION BY DHANI. Any unauthorized reproduction, commercial exploitation, or scraping without prior written consent is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              3. Product Representation & Sizing
            </h2>
            <p>
              We curate and handcraft our garments with the highest artisanal standards. While we strive to display textile weaves, shades, and silhouettes with absolute fidelity, slight variations in color tone may occur depending on screen calibrating devices and organic natural dye lots.
            </p>
            <p>
              Please consult our <Link href="/size-guide" className="underline font-medium text-[#58111A]">Size &amp; Fit Guide</Link> prior to ordering or contact our Atelier Concierge for bespoke measurement guidance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              4. Pricing & Payment Gateway
            </h2>
            <p>
              All prices listed on <strong>ffbydhani.com</strong> are in Indian Rupees (INR) and inclusive of applicable GST unless explicitly stated otherwise. We reserve the right to revise pricing at any moment without retroactive liability.
            </p>
            <p>
              Online transactions are securely processed through our certified payment partner, <strong>Razorpay</strong>. We do not store or retain complete credit card numbers, debit PINs, or net banking passwords on our servers. Transactions adhere to PCI-DSS Level 1 encryption standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              5. Order Confirmation & Dispatch
            </h2>
            <p>
              Receipt of an automated digital invoice or order confirmation indicates our receipt of your order request. We reserve the prerogative to limit order quantities, refuse service, or cancel orders due to sudden fabric inventory depletion, payment verification failures, or pricing anomalies. In such instances, an immediate full refund is returned to the originating payment method.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              6. Governing Law & Dispute Jurisdiction
            </h2>
            <p>
              These Terms &amp; Conditions are construed in harmony with the laws of the Republic of India. Any legal dispute, claim, or proceeding arising under or related to your use of this site shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#58111A]/10">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              7. Atelier Contact Information
            </h2>
            <p>For questions or formal inquiries regarding these Terms:</p>
            <div className="bg-[#FAF6F0] p-4 border border-[#58111A]/10 space-y-1 text-[11px]">
              <p><strong>FINESSE FASHION BY DHANI</strong></p>
              <p>Penthouse Suite 4, The Grand Residences, Worli Sea Face, Mumbai 400018</p>
              <p>Email: <a href="mailto:concierge@ffbydhani.com" className="underline">concierge@ffbydhani.com</a> | Telephone: +91 98200 88888</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
