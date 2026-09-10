'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/store';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
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

  const [couponCodeInput, setCouponCodeInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const success = applyCoupon(couponCodeInput);
    if (success) setCouponCodeInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Overlay Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF6F0] border-l border-[#58111A]/15 shadow-2xl flex flex-col justify-between">
          
          {/* Top Header */}
          <div className="p-6 border-b border-[#58111A]/15 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#58111A]" />
              <h2 className="font-serif-luxury text-xl text-[#58111A] tracking-wide">
                Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-[#7A3B43] hover:text-[#58111A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Complimentary Banner */}
          <div className="px-6 py-2.5 bg-[#58111A] text-[#FAF6F0] text-xs flex items-center justify-between border-b border-[#D4AF37]/30">
            <p className="flex items-center gap-1.5 text-[#D4AF37] font-medium text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Complimentary White-Glove Shipping
            </p>
            <span className="text-[9px] font-semibold text-[#58111A] bg-[#D4AF37] px-2 py-0.5 uppercase tracking-wider">FREE</span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-[#7A3B43]">
                <ShoppingBag className="w-12 h-12 stroke-[1] mx-auto text-[#D4AF37] mb-4" />
                <p className="font-serif-luxury text-xl text-[#58111A] mb-2">Your Bag is Empty</p>
                <p className="text-xs mb-6 max-w-xs mx-auto">
                  Explore our luxury silk gowns, tailored sets, and high-fashion edits.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block px-8 py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-6 border-b border-[#58111A]/15 group">
                  <div className="relative w-20 h-28 bg-white flex-shrink-0 overflow-hidden border border-[#58111A]/15">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif-luxury text-base text-[#58111A] font-medium leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-[#A3757C] hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#7A3B43]">
                        <span>Color: {item.selectedColor.name}</span>
                        <span>•</span>
                        <span>Size: {item.selectedSize}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity Controls */}
                      <div className="inline-flex items-center border border-[#58111A]/15 bg-white">
                        <button
                          onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-[#7A3B43] hover:bg-[#FAF6F0]"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-medium text-[#58111A]">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-[#7A3B43] hover:bg-[#FAF6F0]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-medium text-[#58111A]">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#58111A]/15 bg-white space-y-4">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#58111A] text-[#FAF6F0] px-3.5 py-2 text-xs">
                    <span className="flex items-center gap-1.5 text-[#D4AF37]">
                      <Tag className="w-3.5 h-3.5" /> Coupon <strong>{appliedCoupon.code}</strong> applied
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-gray-300 hover:text-white underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. ROYAL20)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-[#58111A]/15 bg-white text-[#58111A] focus:outline-none focus:border-[#D4AF37] uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-wider font-medium hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Order Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-[#7A3B43]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#58111A]">{formatINR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-[#D4AF37] uppercase">COMPLIMENTARY</strong> : formatINR(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#58111A]/15 text-sm text-[#58111A] font-semibold">
                  <span>Estimated Total</span>
                  <span className="text-base font-serif-luxury">{formatINR(totalAmount)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-4 bg-[#58111A] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors text-xs tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full text-center py-2 text-xs uppercase tracking-widest text-[#7A3B43] hover:text-[#58111A] transition-colors"
                >
                  View Full Cart & Summary
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
