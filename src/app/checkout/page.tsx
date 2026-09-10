'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { ShippingAddress, Order, OrderItem } from '@/lib/types';
import { formatINR, saveOrders, getStoredOrders } from '@/lib/store';
import RazorpayModal from '@/components/checkout/RazorpayModal';
import { ShieldCheck, Lock, Truck, CreditCard, ArrowLeft, Sparkles, CheckCircle2, Banknote, Loader2 } from 'lucide-react';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { cart, subtotal, discountAmount, appliedCoupon, totalAmount, clearCart, showToast } = useStore();
  const { user } = useAuth();

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.addresses[0]?.street || '',
    city: user?.addresses[0]?.city || 'Mumbai',
    state: user?.addresses[0]?.state || 'Maharashtra',
    pincode: user?.addresses[0]?.pincode || '400001',
    country: 'India'
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentOption, setPaymentOption] = useState<'razorpay' | 'cod'>('razorpay');
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isProcessingOnline, setIsProcessingOnline] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const shippingCost = 0;
  const finalPayableTotal = totalAmount + shippingCost;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid Email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = 'Valid 10-digit mobile number required';
    if (!formData.street.trim()) errors.street = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.pincode.trim()) errors.pincode = 'PIN Code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Direct Cash On Delivery Order
    if (paymentOption === 'cod') {
      const generatedOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      handlePaymentSuccess(generatedOrderId, 'COD');
      return;
    }

    // Online Razorpay Payment Flow
    setIsProcessingOnline(true);
    try {
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalPayableTotal,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customerName: formData.fullName,
            customerEmail: formData.email,
            customerPhone: formData.phone,
          }
        }),
      });

      const orderData = await orderRes.json();

      // If Razorpay keys are not yet configured or mock, fallback to built-in simulation modal
      if (!orderRes.ok || orderData.isMock || !orderData.keyId) {
        setIsProcessingOnline(false);
        setIsRazorpayOpen(true);
        return;
      }

      // Load official Razorpay Checkout SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setIsProcessingOnline(false);
        setIsRazorpayOpen(true);
        return;
      }

      // Launch official Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'FINESSE FASHION BY DHANI',
        description: 'Haute Couture Atelier Order',
        image: 'https://ffbydhani.com/favicon.ico',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.verified) {
              handlePaymentSuccess(response.razorpay_payment_id || orderData.orderId, 'Razorpay Online');
            } else {
              showToast('Payment verification failed. Please contact our Atelier Concierge.');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            handlePaymentSuccess(response.razorpay_payment_id || orderData.orderId, 'Razorpay Online');
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        },
        theme: {
          color: '#58111A',
        },
        modal: {
          ondismiss: function () {
            setIsProcessingOnline(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setIsProcessingOnline(false);
        showToast(resp.error?.description || 'Payment was cancelled or failed.');
      });
      rzp.open();
    } catch (err) {
      console.error('Error initializing Razorpay payment:', err);
      setIsProcessingOnline(false);
      setIsRazorpayOpen(true);
    }
  };

  const handlePaymentSuccess = (generatedOrderId: string, paymentMethodUsed: string) => {
    // Construct order
    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0],
      selectedColor: item.selectedColor.name,
      selectedSize: item.selectedSize,
      price: item.product.price,
      quantity: item.quantity
    }));

    const newOrder: Order = {
      id: generatedOrderId,
      trackingNumber: `FIN-EX-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      customer: formData,
      items: orderItems,
      subtotal,
      shippingFee: shippingCost,
      discountAmount,
      couponCode: appliedCoupon?.code,
      totalAmount: finalPayableTotal,
      paymentMethod: paymentMethodUsed as any,
      paymentStatus: paymentMethodUsed === 'COD' ? 'Pending' : 'Paid',
      orderStatus: paymentMethodUsed === 'COD' ? 'Pending Payment' : 'Paid',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      historyTimeline: [
        {
          status: paymentMethodUsed === 'COD' ? 'Pending Payment' : 'Paid',
          timestamp: new Date().toLocaleString(),
          description: paymentMethodUsed === 'COD' 
            ? 'Order placed. Payment pending Cash on Delivery.'
            : 'Payment authorized and captured via Razorpay. Dispatched to Atelier.'
        }
      ]
    };

    // Save order
    const existingOrders = getStoredOrders();
    saveOrders([newOrder, ...existingOrders]);

    // Persist order to MongoDB Atlas
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newOrder)
      }).catch((err) => console.error('Error syncing order to Atlas:', err));
    }


    clearCart();
    setIsRazorpayOpen(false);

    // Redirect to Order Confirmation
    window.location.href = `/order-confirmation/${generatedOrderId}`;
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif-luxury text-3xl text-[#58111A]">No items in cart for checkout</h1>
        <Link href="/shop" className="inline-block px-8 py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-widest">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Header */}
      <div className="flex justify-between items-center pb-6 border-b border-[#58111A]/15">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">SECURE CHECKOUT</span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#58111A]">FINESSE ATELIER CHECKOUT</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <form onSubmit={handleOpenPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Customer Information & Delivery Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Contact Details */}
          <div className="bg-[#FAF6F0] p-6 border border-[#58111A]/15 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#58111A] border-b border-[#58111A]/15 pb-3">
              1. Client Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Ananya Singhania"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                />
                {formErrors.fullName && <p className="text-[10px] text-red-600 mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="ananya@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                />
                {formErrors.email && <p className="text-[10px] text-red-600 mt-1">{formErrors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-medium mb-1">
                Mobile Number (for Order Updates & OTP) *
              </label>
              <input
                type="tel"
                placeholder="+91 98200 12345"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
              />
              {formErrors.phone && <p className="text-[10px] text-red-600 mt-1">{formErrors.phone}</p>}
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-[#FAF6F0] p-6 border border-[#58111A]/15 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#58111A] border-b border-[#58111A]/15 pb-3">
              2. Shipping Address
            </h3>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-medium mb-1">
                Flat, House / Suite, Street Address *
              </label>
              <input
                type="text"
                placeholder="Altamount Road, Cumballa Hill"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
              />
              {formErrors.street && <p className="text-[10px] text-red-600 mt-1">{formErrors.street}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-medium mb-1">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                />
                {formErrors.city && <p className="text-[10px] text-red-600 mt-1">{formErrors.city}</p>}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-medium mb-1">
                  State *
                </label>
                <input
                  type="text"
                  placeholder="Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                />
                {formErrors.state && <p className="text-[10px] text-red-600 mt-1">{formErrors.state}</p>}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7A3B43] font-medium mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  placeholder="400026"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37]"
                />
                {formErrors.pincode && <p className="text-[10px] text-red-600 mt-1">{formErrors.pincode}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Delivery Options */}
          <div className="bg-[#FAF6F0] p-6 border border-[#58111A]/15 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#58111A] border-b border-[#58111A]/15 pb-3">
              3. Delivery Method
            </h3>

            <div className="space-y-3">
              <label
                onClick={() => setShippingMethod('standard')}
                className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                  shippingMethod === 'standard' ? 'border-[#58111A] bg-white shadow-sm' : 'border-[#58111A]/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input type="radio" checked={shippingMethod === 'standard'} onChange={() => {}} className="accent-[#58111A]" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#58111A]">Standard White-Glove Shipping</h4>
                    <p className="text-[11px] text-[#7A3B43]">Delivery in 3 to 5 business days via BlueDart Air</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#D4AF37] uppercase">COMPLIMENTARY</span>
              </label>

              <label
                onClick={() => setShippingMethod('express')}
                className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                  shippingMethod === 'express' ? 'border-[#58111A] bg-white shadow-sm' : 'border-[#58111A]/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input type="radio" checked={shippingMethod === 'express'} onChange={() => {}} className="accent-[#58111A]" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#58111A]">Priority Atelier Express</h4>
                    <p className="text-[11px] text-[#7A3B43]">Guaranteed dispatch within 12 hours + Next day air delivery</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#D4AF37] uppercase">COMPLIMENTARY</span>
              </label>
            </div>
          </div>

          {/* Section 4: Payment Method */}
          <div className="bg-[#FAF6F0] p-6 border border-[#58111A]/15 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#58111A] border-b border-[#58111A]/15 pb-3">
              4. Payment Method
            </h3>

            <div className="space-y-3">
              {/* Razorpay Online */}
              <label
                onClick={() => setPaymentOption('razorpay')}
                className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                  paymentOption === 'razorpay' ? 'border-[#58111A] bg-white shadow-sm' : 'border-[#58111A]/15'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentOption === 'razorpay'}
                    onChange={() => setPaymentOption('razorpay')}
                    className="accent-[#58111A] mt-1"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#58111A]" />
                      <h4 className="text-xs font-semibold text-[#58111A]">Online Payment (Razorpay Secure)</h4>
                    </div>
                    <p className="text-[11px] text-[#7A3B43]">
                      UPI (Google Pay, PhonePe, Paytm), Credit &amp; Debit Cards, NetBanking, Wallets
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-semibold text-[#D4AF37] uppercase pt-1">
                      <span>UPI</span> • <span>VISA</span> • <span>MASTERCARD</span> • <span>RUPAY</span> • <span>NET BANKING</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200 font-semibold uppercase tracking-wider flex-shrink-0">
                  INSTANT DISPATCH
                </span>
              </label>

              {/* Cash On Delivery */}
              <label
                onClick={() => setPaymentOption('cod')}
                className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                  paymentOption === 'cod' ? 'border-[#58111A] bg-white shadow-sm' : 'border-[#58111A]/15'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentOption === 'cod'}
                    onChange={() => setPaymentOption('cod')}
                    className="accent-[#58111A] mt-1"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#58111A]" />
                      <h4 className="text-xs font-semibold text-[#58111A]">Cash on Delivery (COD)</h4>
                    </div>
                    <p className="text-[11px] text-[#7A3B43]">
                      Pay in cash directly to our delivery courier upon receiving your parcel
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-[#7A3B43] bg-white px-2.5 py-1 border border-[#58111A]/15 font-medium uppercase tracking-wider flex-shrink-0">
                  PAY ON ARRIVAL
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessingOnline}
            className="w-full py-4 bg-[#58111A] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors text-xs tracking-[0.25em] uppercase font-semibold flex items-center justify-center gap-2 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessingOnline ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> SECURING CONNECTION TO RAZORPAY...
              </>
            ) : paymentOption === 'cod' ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> CONFIRM CASH ON DELIVERY ORDER ({formatINR(finalPayableTotal)})
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> PROCEED TO PAY VIA RAZORPAY ({formatINR(finalPayableTotal)})
              </>
            )}
          </button>

        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#FAF6F0] border border-[#58111A]/15 space-y-6">
            <h3 className="font-serif-luxury text-xl text-[#58111A] border-b border-[#58111A]/15 pb-3">
              YOUR ORDER ({cart.length} Items)
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-[#58111A]/15">
                  <div className="relative w-16 h-20 bg-white border border-[#58111A]/15 overflow-hidden flex-shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif-luxury text-sm font-medium text-[#58111A]">{item.product.name}</h4>
                    <p className="text-[11px] text-[#7A3B43]">{item.selectedColor.name} • {item.selectedSize} • Qty: {item.quantity}</p>
                    <p className="text-xs font-semibold text-[#58111A] mt-1">{formatINR(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-[#7A3B43] pt-2 border-t border-[#58111A]/15">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-[#58111A]">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod === 'standard' ? 'Standard' : 'Express'})</span>
                <span>{shippingCost === 0 ? <strong className="text-[#D4AF37]">FREE</strong> : formatINR(shippingCost)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#58111A]/15 text-base text-[#58111A] font-semibold">
                <span>Total Amount</span>
                <span className="font-serif-luxury text-lg">{formatINR(finalPayableTotal)}</span>
              </div>
            </div>
          </div>
        </div>

      </form>

      {/* Razorpay Simulation Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={finalPayableTotal}
        customer={formData}
        items={cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          selectedColor: item.selectedColor.name,
          selectedSize: item.selectedSize,
          price: item.product.price,
          quantity: item.quantity
        }))}
        couponCode={appliedCoupon?.code}
        discountAmount={discountAmount}
        shippingFee={shippingCost}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
