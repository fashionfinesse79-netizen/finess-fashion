'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getStoredOrders, formatINR } from '@/lib/store';
import { Order } from '@/lib/types';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, Printer, ArrowRight, Truck } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#58111A', '#FAF6F0']
      });
    } catch (e) {}

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/track?id=${encodeURIComponent(orderId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setOrder(data.order);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }

      const orders = getStoredOrders();
      const found = orders.find((o) => o.id === orderId);
      if (found) {
        setOrder(found);
      } else if (orders.length > 0) {
        setOrder(orders[0]);
      }
    }
    fetchOrder();
  }, [orderId]);


  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-xs text-gray-500">Loading order receipt...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-[#FAF6F0] border border-[#58111A]/15 p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-[#58111A] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
        </div>
        
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold block">
          PAYMENT CONFIRMED VIA RAZORPAY
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#58111A]">
          THANK YOU FOR YOUR ORDER
        </h1>
        <p className="text-xs text-[#7A3B43] max-w-md mx-auto">
          Your order <strong>#{order.id}</strong> has been received by our Atelier. A confirmation receipt has been sent to <strong>{order.customer.email}</strong>.
        </p>

        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 border border-[#58111A]/15 text-xs">
          <Truck className="w-4 h-4 text-[#D4AF37]" />
          <span>Tracking ID: <strong className="text-[#58111A]">{order.trackingNumber}</strong></span>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-white p-8 border border-[#58111A]/15 space-y-8 print:border-none print:shadow-none">
        
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-[#58111A]/15 pb-6 gap-4">
          <div>
            <span className="font-serif-luxury text-2xl tracking-[0.2em] text-[#58111A] font-medium block">
              FINESSE FASHION
            </span>
            <span className="text-[9px] tracking-[0.4em] uppercase text-[#D4AF37] block">
              OFFICIAL ATELIER INVOICE
            </span>
          </div>

          <div className="text-left sm:text-right text-xs text-[#7A3B43] space-y-1">
            <p>Order Reference: <strong>#{order.id}</strong></p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Payment: <strong className="text-[#D4AF37] uppercase">{order.paymentMethod} ({order.paymentStatus})</strong></p>
          </div>
        </div>

        {/* Customer & Delivery Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-[#7A3B43]">
          <div>
            <h4 className="font-semibold text-[#58111A] uppercase tracking-wider mb-2 text-[11px]">
              Delivered To:
            </h4>
            <p className="font-medium text-[#58111A]">{order.customer.fullName}</p>
            <p>{order.customer.street}</p>
            <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
            <p>Phone: {order.customer.phone}</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#58111A] uppercase tracking-wider mb-2 text-[11px]">
              Estimated Delivery:
            </h4>
            <p className="font-medium text-[#58111A] text-sm">{order.estimatedDelivery}</p>
            <p className="mt-1">Carrier: BlueDart Air Express</p>
            <p>Tracking Number: {order.trackingNumber}</p>
          </div>
        </div>

        {/* Item Breakdown Table */}
        <div className="border-t border-[#58111A]/15 pt-6">
          <h4 className="font-semibold text-[#58111A] uppercase tracking-wider mb-4 text-[11px]">
            Purchased Items
          </h4>
          <div className="divide-y divide-[#58111A]/15">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 flex justify-between items-center text-xs">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-16 bg-[#FAF6F0] border border-[#58111A]/15 overflow-hidden flex-shrink-0">
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div>
                    <h5 className="font-serif-luxury font-semibold text-sm text-[#58111A]">{item.productName}</h5>
                    <p className="text-[#7A3B43]">Color: {item.selectedColor} • Size: {item.selectedSize}</p>
                    <p className="text-[#7A3B43]">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium text-[#58111A]">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="border-t border-[#58111A]/15 pt-4 space-y-2 text-xs text-[#7A3B43] max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-[#58111A]">{formatINR(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-700 font-medium">
              <span>Discount ({order.couponCode})</span>
              <span>-{formatINR(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingFee === 0 ? 'Complimentary' : formatINR(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#58111A]/15 text-base text-[#58111A] font-semibold">
            <span>Total Paid</span>
            <span className="font-serif-luxury">{formatINR(order.totalAmount)}</span>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 print:hidden">
        <Link
          href={`/order-tracking?id=${order.id}`}
          className="w-full sm:w-auto px-8 py-4 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" /> TRACK ORDER STATUS
        </Link>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-8 py-4 border border-[#58111A] text-[#58111A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#58111A] hover:text-[#FAF6F0] transition-colors flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" /> PRINT INVOICE PDF
        </button>

        <Link
          href="/shop"
          className="w-full sm:w-auto text-xs uppercase tracking-widest text-[#7A3B43] hover:text-[#58111A] transition-colors text-center"
        >
          Continue Shopping →
        </Link>
      </div>

    </div>
  );
}
