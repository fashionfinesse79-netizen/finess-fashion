'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/store';
import { ShoppingBag, Trash2, ArrowRight, Tag, Sparkles, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    subtotal,
    freeShippingThreshold,
    freeShippingRemaining,
    shippingFee,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    discountAmount,
    totalAmount
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) setCouponInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center pb-8 border-b border-[#58111A]/15">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
          YOUR SELECTION
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] mt-1">
          SHOPPING BAG
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-[#FAF6F0] border border-[#58111A]/15 space-y-6">
          <ShoppingBag className="w-16 h-16 stroke-[1] text-[#D4AF37] mx-auto" />
          <h2 className="font-serif-luxury text-3xl text-[#58111A]">Your Bag is Empty</h2>
          <p className="text-xs text-[#7A3B43] max-w-sm mx-auto">
            Discover our new Autumn / Winter silk gowns, tailored sets, and high-fashion edits.
          </p>
          <div>
            <Link
              href="/shop"
              className="inline-block px-9 py-4 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors"
            >
              EXPLORE COLLECTIONS
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Cart Items Table */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Free Shipping Banner */}
            <div className="p-4 bg-[#58111A] text-[#FAF6F0] text-xs flex items-center justify-between border border-[#D4AF37]/30 shadow-sm">
              <p className="flex items-center gap-2 text-[#D4AF37] font-medium text-xs tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" /> Complimentary White-Glove Shipping On All Orders
              </p>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#58111A] bg-[#D4AF37] px-2.5 py-1">100% FREE</span>
            </div>

            {/* Table */}
            <div className="border border-[#58111A]/15 bg-white divide-y divide-[#58111A]/15">
              {cart.map((item, idx) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="relative w-20 h-28 bg-[#FAF6F0] flex-shrink-0 border border-[#58111A]/15 overflow-hidden">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                        {item.product.category}
                      </span>
                      <h3 className="font-serif-luxury text-lg text-[#58111A] font-medium leading-snug">
                        <Link href={`/product/${item.product.slug}`} className="hover:text-[#D4AF37]">
                          {item.product.name}
                        </Link>
                      </h3>
                      <div className="text-xs text-[#7A3B43] mt-1 space-x-2">
                        <span>Color: {item.selectedColor.name}</span>
                        <span>•</span>
                        <span>Size: {item.selectedSize}</span>
                      </div>
                      <div className="text-xs font-semibold text-[#58111A] mt-2">
                        {formatINR(item.product.price)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 border-t sm:border-t-0 pt-4 sm:pt-0 border-[#58111A]/15">
                    <div className="inline-flex items-center border border-[#58111A]/15">
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                        className="px-3 py-1.5 text-xs text-[#7A3B43] hover:bg-[#FAF6F0]"
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-medium text-[#58111A]">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                        className="px-3 py-1.5 text-xs text-[#7A3B43] hover:bg-[#FAF6F0]"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-serif-luxury font-medium text-[#58111A]">
                      {formatINR(item.product.price * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-[#A3757C] hover:text-red-500 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#58111A] hover:text-[#D4AF37] font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>

          </div>

          {/* Right: Summary Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 bg-[#FAF6F0] border border-[#58111A]/15 space-y-6">
              <h2 className="font-serif-luxury text-2xl text-[#58111A] border-b border-[#58111A]/15 pb-4">
                ORDER SUMMARY
              </h2>

              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#58111A] text-[#FAF6F0] p-3 text-xs">
                    <span className="flex items-center gap-1.5 text-[#D4AF37]">
                      <Tag className="w-4 h-4" /> Code <strong>{appliedCoupon.code}</strong> Applied
                    </span>
                    <button onClick={removeCoupon} className="text-xs text-gray-300 underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] uppercase focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold hover:bg-[#D4AF37] hover:text-[#58111A]"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-xs text-[#7A3B43] border-t border-[#58111A]/15 pt-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-[#58111A] font-medium">{formatINR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping & Delivery</span>
                  <span>{shippingFee === 0 ? <strong className="text-[#D4AF37]">COMPLIMENTARY</strong> : formatINR(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#58111A]/15 text-base text-[#58111A] font-semibold">
                  <span>Total Amount</span>
                  <span className="font-serif-luxury">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 bg-[#58111A] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors text-xs tracking-[0.25em] uppercase font-semibold flex items-center justify-center gap-2 group shadow-lg"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
