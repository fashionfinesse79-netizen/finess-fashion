import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | FINESSE FASHION BY DHANI',
  description: 'Privacy and data protection commitment of FINESSE FASHION BY DHANI (ffbydhani.com).',
};

export default function PrivacyPolicyPage() {
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
            DATA INTEGRITY &amp; TRUST
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] mt-2 uppercase">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#7A3B43] mt-2">
            Last Updated: September 2026 • FINESSE FASHION BY DHANI (ffbydhani.com)
          </p>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white p-8 sm:p-12 border border-[#58111A]/15 shadow-sm space-y-8 text-xs text-[#58111A]/80 leading-relaxed font-light">
          
          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              1. Our Privacy Commitment
            </h2>
            <p>
              At <strong>FINESSE FASHION BY DHANI</strong> (&quot;ffbydhani.com&quot;), we respect the privacy of our distinguished clientele. This Privacy Policy details how we collect, use, process, and safeguard your personal information when you browse our boutique or order couture pieces.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              2. Information We Collect
            </h2>
            <p>We only collect data essential for fulfilling your couture experience:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Personal Identifiers:</strong> Name, email address, telephone contact, and delivery addresses.</li>
              <li><strong>Transaction Data:</strong> Details of orders placed, payment status, invoice records, and shipping manifests.</li>
              <li><strong>Technical &amp; Browsing Data:</strong> IP address, browser type, device information, and site interaction cookies used strictly to enhance shopping performance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              3. Payment Information &amp; Razorpay Security
            </h2>
            <p>
              All online payments conducted on <strong>ffbydhani.com</strong> are securely processed via <strong>Razorpay Payment Solutions</strong>.
            </p>
            <p>
              We do <strong>not</strong> collect, store, or view sensitive payment card numbers, UPI PINs, or net banking access credentials on our servers. Razorpay adheres to the highest level of security standards (<strong>PCI-DSS Level 1 Compliant</strong>), guaranteeing 256-bit SSL encryption for every transaction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              4. How We Use Your Information
            </h2>
            <p>Your data is utilized strictly for:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Dispatching and delivering your garments via verified courier partners.</li>
              <li>Sending SMS and email notifications regarding order tracking and invoice receipts.</li>
              <li>Providing bespoke client concierge styling and addressing return/exchange requests.</li>
              <li>Fraud prevention and regulatory tax compliance under Indian commerce laws.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              5. Third-Party Data Sharing
            </h2>
            <p>
              We never sell, lease, or monetize client personal data to third parties. Information is shared solely with vetted logistical and operational partners necessary to fulfill your order:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Payment Partners:</strong> Razorpay (Payment Gateway).</li>
              <li><strong>Logistics Partners:</strong> BlueDart, Delhivery, DTDC, and India Post for doorstep delivery.</li>
              <li><strong>Statutory Authorities:</strong> If required by applicable Indian law, court subpoena, or tax regulation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              6. Cookies Policy
            </h2>
            <p>
              Our website uses session cookies to preserve items in your shopping bag, maintain account logins, and recognize returning clients. You can disable cookies in your browser settings, though certain checkout functions may become unavailable.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#58111A]/10">
            <h2 className="font-serif-luxury text-xl text-[#58111A] uppercase tracking-wide font-medium">
              7. Grievance Officer &amp; Contact
            </h2>
            <p>In accordance with the Information Technology Act, 2000 and rules made thereunder, inquiries or concerns regarding data privacy can be addressed to our Grievance Officer:</p>
            <div className="bg-[#FAF6F0] p-4 border border-[#58111A]/10 space-y-1 text-[11px]">
              <p><strong>Grievance Officer:</strong> Atelier Client Relations</p>
              <p><strong>FINESSE FASHION BY DHANI</strong></p>
              <p>Penthouse Suite 4, The Grand Residences, Worli Sea Face, Mumbai, MH 400018</p>
              <p>Email: <a href="mailto:privacy@ffbydhani.com" className="underline">privacy@ffbydhani.com</a> | <a href="mailto:concierge@ffbydhani.com" className="underline">concierge@ffbydhani.com</a></p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
