import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, CheckCircle2, Clock, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Cancellation & Refund Policy | FINESSE FASHION BY DHANI',
  description: 'Returns, exchanges, cancellation rules, and refund timelines for FINESSE FASHION BY DHANI (ffbydhani.com).',
};

export default function CancellationRefundPage() {
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
            CLIENT SATISFACTION ASSURANCE
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] mt-2 uppercase">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="text-xs text-[#7A3B43] mt-2">
            Last Updated: September 2026 • FINESSE FASHION BY DHANI (ffbydhani.com)
          </p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 border border-[#58111A]/15 text-center space-y-2">
            <Clock className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#58111A]">24h Cancellation</h3>
            <p className="text-[11px] text-[#7A3B43]">Easy cancellation before order is dispatched</p>
          </div>
          <div className="bg-white p-5 border border-[#58111A]/15 text-center space-y-2">
            <RotateCcw className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#58111A]">7 Days Return Window</h3>
            <p className="text-[11px] text-[#7A3B43]">Hassle-free return or exchange from delivery date</p>
          </div>
          <div className="bg-white p-5 border border-[#58111A]/15 text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#58111A]">5–7 Days Refund</h3>
            <p className="text-[11px] text-[#7A3B43]">Direct refund to original payment source via Razorpay</p>
          </div>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white p-8 sm:p-12 border border-[#58111A]/15 shadow-sm space-y-8 text-xs text-[#58111A]/80 leading-relaxed font-light">
          
          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              1. Order Cancellation Policy
            </h2>
            <p>
              Clients may request cancellation of an order within <strong>24 hours</strong> of placement or before the garment has been dispatched from our Mumbai Atelier, whichever occurs earlier.
            </p>
            <p>
              To cancel, simply visit your <Link href="/account" className="underline font-medium text-[#58111A]">Account Dashboard</Link> or email <a href="mailto:concierge@ffbydhani.com" className="underline font-medium">concierge@ffbydhani.com</a> with your Order ID. Once cancelled, a 100% refund will be automatically credited to your original payment method.
            </p>
            <p className="italic text-[#7A3B43]">
              *Orders that have already been dispatched or handed over to our courier partner cannot be cancelled in-transit; however, they remain eligible for our 7-day return policy upon arrival.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              2. 7-Day Return &amp; Exchange Window
            </h2>
            <p>
              We want you to love your silhouette. If you are not completely enchanted with your purchase, you may initiate a return or size exchange within <strong>7 days from the date of confirmed delivery</strong>.
            </p>
            <p><strong>Eligibility Conditions:</strong></p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Garments must be entirely unworn, unwashed, unaltered, and free of fragrance or makeup marks.</li>
              <li>All original atelier security tags, brand labels, and protective packaging must be intact.</li>
              <li>Bespoke custom-tailored garments made to bespoke personal measurements are non-returnable unless defective.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              3. Return Pickup Process
            </h2>
            <p>
              Once your return request is approved, our courier partner will schedule a complimentary reverse pickup from your doorstep within <strong>24 to 48 hours</strong>. Please keep the piece safely packed in its original box.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              4. Refund Timelines &amp; Razorpay Processing
            </h2>
            <p>
              Upon receipt of the returned item at our quality inspection atelier:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Our textile masters will inspect the piece within <strong>24 hours</strong> of arrival.</li>
              <li>Once approved, the refund is initiated immediately through our payment partner, <strong>Razorpay</strong>.</li>
              <li>
                <strong>Prepaid Payments (UPI, Cards, Netbanking):</strong> The refund will reflect in your bank account or credit card within <strong>5 to 7 business days</strong>, depending on your issuing bank.
              </li>
              <li>
                <strong>Cash on Delivery (COD) Orders:</strong> Our concierge will email you a secure link to input your preferred NEFT/UPI details for a direct bank transfer completed within 3 business days.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              5. How to Initiate a Return
            </h2>
            <p>You can initiate a return seamlessly in two ways:</p>
            <ol className="list-decimal pl-5 space-y-1 text-xs">
              <li>Go to <Link href="/order-tracking" className="underline font-medium text-[#58111A]">Order Tracking</Link>, enter your Order ID, and click the <strong>&quot;Request Return&quot;</strong> button on your delivered order.</li>
              <li>Or contact our concierge team directly at <a href="mailto:concierge@ffbydhani.com" className="underline font-medium">concierge@ffbydhani.com</a> or WhatsApp at +91 98200 88888.</li>
            </ol>
          </section>

        </div>

      </div>
    </div>
  );
}
